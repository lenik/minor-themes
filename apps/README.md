# App theme packages

Generated theme plugins/extensions for editors other than VS Code.
Source of truth remains the shared HSL palettes under `scripts/`.

| App | Layout | Package script | Artifact |
|-----|--------|----------------|----------|
| **Eclipse** | e4 CSS plug-in + `.epf` syntax prefs | `pnpm run package:eclipse` | `dist/minor-themes-eclipse.jar` |
| **IntelliJ** | `bundledColorScheme` plugin | `pnpm run package:intellij` | `dist/minor-themes-intellij.jar` |
| **Emacs** | `deftheme` `.el` files | `pnpm run package:emacs` | `dist/minor-themes-emacs.zip` |

```bash
pnpm run generate:apps   # regenerate apps/{eclipse,intellij,emacs}/
pnpm run package:apps    # generate + package all three into dist/
```

Trees under `apps/eclipse`, `apps/intellij`, and `apps/emacs` are **generated** — edit palettes, not these files.
