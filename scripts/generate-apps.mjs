#!/usr/bin/env node
/**
 * Generate Eclipse / IntelliJ / Emacs theme plugins from shared palettes.
 * Run: node scripts/generate-apps.mjs
 *
 * Output:
 *   apps/eclipse/   — e4 CSS theme drop-in + .epf syntax prefs
 *   apps/intellij/  — bundledColorScheme plugin (.xml + loose .icls)
 *   apps/emacs/     — deftheme .el files
 */

import {
  writeFileSync,
  mkdirSync,
  rmSync,
  existsSync,
  readFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { themeCatalog } from "./theme-catalog.mjs";
import {
  resolveThemeColors,
  hexNoHash,
  hexToEclipseRgb,
  xmlEscape,
} from "./palette-resolve.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const appsDir = join(root, "apps");
const PKG_VERSION = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
  .version;

/**
 * @param {string} dir
 */
function resetDir(dir) {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

/**
 * @param {string} path
 * @param {string} contents
 */
function write(path, contents) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
}

// ─── Eclipse ───────────────────────────────────────────────────────────────

/**
 * @param {import('./theme-catalog.mjs').themeCatalog[0]} entry
 * @param {{ ui: Record<string,string>, tokens: Record<string,string> }} colors
 */
function eclipseCss(entry, { ui }) {
  return `/* ${entry.label} — Minor Themes (Eclipse e4 CSS) */
ColorDefinition#org-eclipse-ui-workbench-ACTIVE_TAB_BG_START { color: ${ui.panelBg}; }
ColorDefinition#org-eclipse-ui-workbench-ACTIVE_TAB_BG_END { color: ${ui.panelBg}; }
ColorDefinition#org-eclipse-ui-workbench-ACTIVE_TAB_TEXT_COLOR { color: ${ui.windowFg}; }
ColorDefinition#org-eclipse-ui-workbench-INACTIVE_TAB_BG_START { color: ${ui.intervalBg}; }
ColorDefinition#org-eclipse-ui-workbench-INACTIVE_TAB_BG_END { color: ${ui.intervalBg}; }
ColorDefinition#org-eclipse-ui-workbench-INACTIVE_TAB_TEXT_COLOR { color: ${ui.intervalFg}; }

.MTrimmedWindow, .MPartStack, .MToolBar, .MToolControl {
  background-color: ${ui.windowBg};
  color: ${ui.windowFg};
}

.MPartStack {
  swt-tab-renderer: url('bundleclass://org.eclipse.e4.ui.workbench.renderers.swt/org.eclipse.e4.ui.workbench.renderers.swt.CTabRendering');
  swt-selected-tab-fill: ${ui.surfaceBg};
  swt-unselected-tabs-color: ${ui.intervalBg};
  swt-outer-keyline-color: ${ui.border};
  swt-tab-outline: ${ui.border};
  swt-shadow-visible: false;
  color: ${ui.windowFg};
}

.MPart StyledText, StyledText {
  background-color: ${ui.surfaceBg};
  color: ${ui.windowFg};
}
`;
}

/**
 * @param {import('./theme-catalog.mjs').themeCatalog[0]} entry
 * @param {{ ui: Record<string,string>, tokens: Record<string,string> }} colors
 */
function eclipseEpf(entry, { ui, tokens }) {
  const bg = hexToEclipseRgb(ui.surfaceBg);
  const fg = hexToEclipseRgb(ui.windowFg);
  const sel = hexToEclipseRgb(ui.selectedBg);
  const line = hexToEclipseRgb(ui.mutedFg);
  return `file_export_version=3.0
/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.Background.SystemDefault=false
/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.Foreground.SystemDefault=false
/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.SelectionBackground.SystemDefault=false
/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.Background=${bg}
/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.Foreground=${fg}
/instance/org.eclipse.ui.editors/AbstractTextEditor.Color.SelectionBackground=${sel}
/instance/org.eclipse.ui.editors/lineNumberColor=${line}
/instance/org.eclipse.ui.editors/currentLineColor=${hexToEclipseRgb(ui.panelBg)}
/instance/org.eclipse.jdt.ui/java_default=${fg}
/instance/org.eclipse.jdt.ui/java_keyword=${hexToEclipseRgb(tokens.keyword)}
/instance/org.eclipse.jdt.ui/java_keyword_return=${hexToEclipseRgb(tokens.control)}
/instance/org.eclipse.jdt.ui/java_string=${hexToEclipseRgb(tokens.string)}
/instance/org.eclipse.jdt.ui/java_single_line_comment=${hexToEclipseRgb(tokens.comment)}
/instance/org.eclipse.jdt.ui/java_multi_line_comment=${hexToEclipseRgb(tokens.comment)}
/instance/org.eclipse.jdt.ui/java_operator=${hexToEclipseRgb(tokens.operator)}
/instance/org.eclipse.jdt.ui/java_bracket=${hexToEclipseRgb(tokens.punctuation)}
/instance/org.eclipse.jdt.ui/java_doc_default=${hexToEclipseRgb(tokens.comment)}
`;
}

/**
 * @param {typeof themeCatalog} catalog
 */
function writeEclipse(catalog) {
  const base = join(appsDir, "eclipse");
  // resetDir already called for eclipse

  const themesXml = catalog
    .map(
      (e) => `    <theme
        basestylesheeturi="css/${e.id}.css"
        id="com.lenik.minor.themes.${e.id}"
        label="${xmlEscape(e.label)}"/>`,
    )
    .join("\n");

  write(
    join(base, "META-INF/MANIFEST.MF"),
    `Manifest-Version: 1.0
Bundle-ManifestVersion: 2
Bundle-Name: Minor Themes
Bundle-SymbolicName: com.lenik.minor.themes;singleton:=true
Bundle-Version: ${PKG_VERSION}.0
Bundle-Vendor: Lenik
Require-Bundle: org.eclipse.e4.ui.css.swt.theme
Eclipse-BundleShape: dir
`,
  );

  write(
    join(base, "plugin.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<?eclipse version="3.4"?>
<plugin>
  <extension point="org.eclipse.e4.ui.css.swt.theme">
${themesXml}
  </extension>
</plugin>
`,
  );

  write(
    join(base, "README.md"),
    `# Minor Themes — Eclipse

Generated e4 CSS theme plug-in plus JDT \`.epf\` preference companions.

## Install (CSS workbench themes)

1. Build: \`pnpm run package:eclipse\`
2. Copy \`dist/minor-themes-eclipse.jar\` into \`$ECLIPSE_HOME/dropins/\`
3. Restart Eclipse → **Window → Preferences → General → Appearance → Theme**

## Syntax colors (JDT)

Import \`prefs/<id>.epf\` via **File → Import → General → Preferences**.
`,
  );

  for (const entry of catalog) {
    const colors = resolveThemeColors(entry);
    write(join(base, "css", `${entry.id}.css`), eclipseCss(entry, colors));
    write(join(base, "prefs", `${entry.id}.epf`), eclipseEpf(entry, colors));
  }
}

// ─── IntelliJ ──────────────────────────────────────────────────────────────

/**
 * @param {import('./theme-catalog.mjs').themeCatalog[0]} entry
 * @param {{ ui: Record<string,string>, tokens: Record<string,string> }} colors
 */
function intellijSchemeXml(entry, { ui, tokens }) {
  const parent = entry.type === "dark" ? "Darcula" : "Default";
  const c = {
    caret: hexNoHash(ui.actionFg),
    caretRow: hexNoHash(ui.panelBg),
    selection: hexNoHash(ui.selectedBg),
    lineNumbers: hexNoHash(ui.mutedFg),
    tearline: hexNoHash(ui.grid),
    gutter: hexNoHash(ui.panelBg),
    fg: hexNoHash(ui.windowFg),
    bg: hexNoHash(ui.surfaceBg),
    keyword: hexNoHash(tokens.keyword),
    string: hexNoHash(tokens.string),
    comment: hexNoHash(tokens.comment),
    number: hexNoHash(tokens.number),
    type: hexNoHash(tokens.type),
    fn: hexNoHash(tokens.functionDef),
    variable: hexNoHash(tokens.variable),
    constant: hexNoHash(tokens.constant),
    operator: hexNoHash(tokens.operator),
    punct: hexNoHash(tokens.punctuation),
  };
  const name = xmlEscape(entry.label);
  return `<?xml version="1.0" encoding="UTF-8"?>
<scheme name="${name}" version="142" parent_scheme="${parent}">
  <colors>
    <option name="CARET_COLOR" value="${c.caret}" />
    <option name="CARET_ROW_COLOR" value="${c.caretRow}" />
    <option name="SELECTION_BACKGROUND" value="${c.selection}" />
    <option name="LINE_NUMBERS_COLOR" value="${c.lineNumbers}" />
    <option name="TEARLINE_COLOR" value="${c.tearline}" />
    <option name="RIGHT_MARGIN_COLOR" value="${c.tearline}" />
    <option name="GUTTER_BACKGROUND" value="${c.gutter}" />
  </colors>
  <attributes>
    <option name="TEXT">
      <value>
        <option name="FOREGROUND" value="${c.fg}" />
        <option name="BACKGROUND" value="${c.bg}" />
      </value>
    </option>
    <option name="DEFAULT_KEYWORD">
      <value>
        <option name="FOREGROUND" value="${c.keyword}" />
        <option name="FONT_TYPE" value="1" />
      </value>
    </option>
    <option name="DEFAULT_STRING">
      <value>
        <option name="FOREGROUND" value="${c.string}" />
      </value>
    </option>
    <option name="DEFAULT_LINE_COMMENT">
      <value>
        <option name="FOREGROUND" value="${c.comment}" />
        <option name="FONT_TYPE" value="2" />
      </value>
    </option>
    <option name="DEFAULT_BLOCK_COMMENT">
      <value>
        <option name="FOREGROUND" value="${c.comment}" />
        <option name="FONT_TYPE" value="2" />
      </value>
    </option>
    <option name="DEFAULT_DOC_COMMENT">
      <value>
        <option name="FOREGROUND" value="${c.comment}" />
        <option name="FONT_TYPE" value="2" />
      </value>
    </option>
    <option name="DEFAULT_NUMBER">
      <value>
        <option name="FOREGROUND" value="${c.number}" />
      </value>
    </option>
    <option name="DEFAULT_CLASS_NAME">
      <value>
        <option name="FOREGROUND" value="${c.type}" />
      </value>
    </option>
    <option name="DEFAULT_INTERFACE_NAME">
      <value>
        <option name="FOREGROUND" value="${c.type}" />
      </value>
    </option>
    <option name="DEFAULT_FUNCTION_DECLARATION">
      <value>
        <option name="FOREGROUND" value="${c.fn}" />
      </value>
    </option>
    <option name="DEFAULT_FUNCTION_CALL">
      <value>
        <option name="FOREGROUND" value="${c.fn}" />
      </value>
    </option>
    <option name="DEFAULT_LOCAL_VARIABLE">
      <value>
        <option name="FOREGROUND" value="${c.variable}" />
      </value>
    </option>
    <option name="DEFAULT_CONSTANT">
      <value>
        <option name="FOREGROUND" value="${c.constant}" />
      </value>
    </option>
    <option name="DEFAULT_OPERATION_SIGN">
      <value>
        <option name="FOREGROUND" value="${c.operator}" />
      </value>
    </option>
    <option name="DEFAULT_BRACES">
      <value>
        <option name="FOREGROUND" value="${c.punct}" />
      </value>
    </option>
    <option name="DEFAULT_BRACKETS">
      <value>
        <option name="FOREGROUND" value="${c.punct}" />
      </value>
    </option>
    <option name="DEFAULT_PARENTHS">
      <value>
        <option name="FOREGROUND" value="${c.punct}" />
      </value>
    </option>
    <option name="DEFAULT_DOT">
      <value>
        <option name="FOREGROUND" value="${c.punct}" />
      </value>
    </option>
    <option name="DEFAULT_COMMA">
      <value>
        <option name="FOREGROUND" value="${c.punct}" />
      </value>
    </option>
    <option name="DEFAULT_SEMICOLON">
      <value>
        <option name="FOREGROUND" value="${c.punct}" />
      </value>
    </option>
  </attributes>
</scheme>
`;
}

/**
 * @param {typeof themeCatalog} catalog
 */
function writeIntellij(catalog) {
  const base = join(appsDir, "intellij");

  const extensions = catalog
    .map(
      (e) =>
        `    <bundledColorScheme id="${xmlEscape(e.label)}" path="/colors/${e.id}"/>`,
    )
    .join("\n");

  write(
    join(base, "META-INF/plugin.xml"),
    `<idea-plugin>
  <id>com.lenik.minor-themes</id>
  <name>Minor Themes</name>
  <version>${PKG_VERSION}</version>
  <vendor email="pub.lenik@bodz.net" url="https://github.com/lenik/minor-themes">Lenik</vendor>
  <description><![CDATA[
    <p>Minor Themes — color schemes in three groups: Minor, Vibe, and Country.</p>
    <p>Generated from the same palettes as the VS Code extension.</p>
  ]]></description>
  <change-notes><![CDATA[
    <p>${PKG_VERSION}: generated schemes from shared HSL palettes.</p>
  ]]></change-notes>
  <depends>com.intellij.modules.platform</depends>
  <idea-version since-build="223"/>
  <extensions defaultExtensionNs="com.intellij">
${extensions}
  </extensions>
</idea-plugin>
`,
  );

  write(
    join(base, "README.md"),
    `# Minor Themes — IntelliJ IDEA

Bundled editor color schemes (.icls / .xml) generated from shared palettes.

## Install (plugin JAR)

1. Build: \`pnpm run package:intellij\`
2. **Settings → Plugins → ⚙ → Install Plugin from Disk…** → \`dist/minor-themes-intellij.jar\`
3. **Settings → Editor → Color Scheme** → pick a Minor Themes scheme

## Import a single scheme

Use \`icls/<id>.icls\` via **Color Scheme → ⚙ → Import Scheme…**.
`,
  );

  for (const entry of catalog) {
    const colors = resolveThemeColors(entry);
    const xml = intellijSchemeXml(entry, colors);
    write(join(base, "colors", `${entry.id}.xml`), xml);
    write(join(base, "icls", `${entry.id}.icls`), xml);
  }
}

// ─── Emacs ─────────────────────────────────────────────────────────────────

/**
 * @param {import('./theme-catalog.mjs').themeCatalog[0]} entry
 * @param {{ ui: Record<string,string>, tokens: Record<string,string> }} colors
 */
function emacsThemeEl(entry, { ui, tokens }) {
  const sym = entry.id;
  const label = entry.label.replace(/"/g, '\\"');
  return `;;; ${sym}-theme.el --- ${label} -*- lexical-binding: t; -*-
;;; Commentary:
;; Minor Themes — generated from shared HSL palettes. Do not edit by hand.
;;; Code:

(deftheme ${sym} "${label} — Minor Themes")

(let ((class '((class color) (min-colors 89)))
      (bg "${ui.surfaceBg}")
      (fg "${ui.windowFg}")
      (sel "${ui.selectedBg}")
      (cur "${ui.actionFg}")
      (panel "${ui.panelBg}")
      (muted "${ui.mutedFg}")
      (border "${ui.border}")
      (cmt "${tokens.comment}")
      (str "${tokens.string}")
      (kw "${tokens.keyword}")
      (fn "${tokens.functionDef}")
      (ty "${tokens.type}")
      (var "${tokens.variable}")
      (cst "${tokens.constant}")
      (num "${tokens.number}")
      (op "${tokens.operator}"))
  (custom-theme-set-faces
   '${sym}
   \`(default ((,class (:background ,bg :foreground ,fg))))
   \`(cursor ((,class (:background ,cur))))
   \`(region ((,class (:background ,sel))))
   \`(fringe ((,class (:background ,bg :foreground ,muted))))
   \`(vertical-border ((,class (:foreground ,border))))
   \`(mode-line ((,class (:background ,panel :foreground ,fg :box (:line-width 1 :color ,border)))))
   \`(mode-line-inactive ((,class (:background ,panel :foreground ,muted))))
   \`(minibuffer-prompt ((,class (:foreground ,kw :weight bold))))
   \`(link ((,class (:foreground ,kw :underline t))))
   \`(font-lock-comment-face ((,class (:foreground ,cmt :slant italic))))
   \`(font-lock-comment-delimiter-face ((,class (:foreground ,cmt))))
   \`(font-lock-string-face ((,class (:foreground ,str))))
   \`(font-lock-keyword-face ((,class (:foreground ,kw :weight bold))))
   \`(font-lock-function-name-face ((,class (:foreground ,fn))))
   \`(font-lock-variable-name-face ((,class (:foreground ,var))))
   \`(font-lock-type-face ((,class (:foreground ,ty))))
   \`(font-lock-constant-face ((,class (:foreground ,cst))))
   \`(font-lock-builtin-face ((,class (:foreground ,kw))))
   \`(font-lock-number-face ((,class (:foreground ,num))))
   \`(font-lock-operator-face ((,class (:foreground ,op))))
   \`(line-number ((,class (:foreground ,muted))))
   \`(line-number-current-line ((,class (:foreground ,fg :weight bold))))
   \`(hl-line ((,class (:background ,panel))))))

(provide-theme '${sym})

;;; ${sym}-theme.el ends here
`;
}

/**
 * @param {typeof themeCatalog} catalog
 */
function writeEmacs(catalog) {
  const base = join(appsDir, "emacs");
  const themesDir = join(base, "themes");
  mkdirSync(themesDir, { recursive: true });

  write(
    join(base, "README.md"),
    `# Minor Themes — Emacs

\`deftheme\` files generated from shared HSL palettes.

## Install

1. Build zip: \`pnpm run package:emacs\`
2. Unpack \`dist/minor-themes-emacs.zip\` somewhere on disk
3. In Emacs:

\`\`\`elisp
(add-to-list 'custom-theme-load-path "/path/to/minor-themes-emacs/themes")
(load-theme 'dark-innocent t)  ; or any <id> from the catalog
\`\`\`

Theme symbol names match catalog ids (e.g. \`innocent\`, \`dark-maiden\`, \`country-japan\`).
`,
  );

  for (const entry of catalog) {
    const colors = resolveThemeColors(entry);
    write(join(themesDir, `${entry.id}-theme.el`), emacsThemeEl(entry, colors));
  }
}

// ─── Top-level apps README ─────────────────────────────────────────────────

function writeAppsReadme() {
  write(
    join(appsDir, "README.md"),
    `# App theme packages

Generated theme plugins/extensions for editors other than VS Code.
Source of truth remains the shared HSL palettes under \`scripts/\`.

| App | Layout | Package script | Artifact |
|-----|--------|----------------|----------|
| **Eclipse** | e4 CSS plug-in + \`.epf\` syntax prefs | \`pnpm run package:eclipse\` | \`dist/minor-themes-eclipse.jar\` |
| **IntelliJ** | \`bundledColorScheme\` plugin | \`pnpm run package:intellij\` | \`dist/minor-themes-intellij.jar\` |
| **Emacs** | \`deftheme\` \`.el\` files | \`pnpm run package:emacs\` | \`dist/minor-themes-emacs.zip\` |

\`\`\`bash
pnpm run generate:apps   # regenerate apps/{eclipse,intellij,emacs}/
pnpm run package:apps    # generate + package all three into dist/
\`\`\`

Trees under \`apps/eclipse\`, \`apps/intellij\`, and \`apps/emacs\` are **generated** — edit palettes, not these files.
`,
  );
}

// ─── main ──────────────────────────────────────────────────────────────────

resetDir(join(appsDir, "eclipse"));
resetDir(join(appsDir, "intellij"));
resetDir(join(appsDir, "emacs"));
mkdirSync(appsDir, { recursive: true });
writeAppsReadme();
writeEclipse(themeCatalog);
writeIntellij(themeCatalog);
writeEmacs(themeCatalog);

console.log(
  `Wrote app themes for ${themeCatalog.length} catalog entries → ${appsDir}/{eclipse,intellij,emacs}`,
);
