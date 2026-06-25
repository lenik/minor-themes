# Minor Themes

A collection of VS Code color themes — soft pastels, pride palettes, retro terminals, and country palettes rooted in traditional culture.

## Theme guide

Each palette is defined in `scripts/generate-themes.mjs` and shared with the [UiTheme](https://github.com/lenik) project. Light/dark pairs use the same accent hues; dark variants keep those accents on a deep blue-gray shell.

### Innocent

**Meaning:** *Innocent* — pure, gentle, unassuming.

A single light theme built on blush rose and soft lavender (hues ~280–340°). Backgrounds stay near white with a faint pink wash; text is muted purple-gray. Accents are dusty rose and periwinkle — selection, cursor, and brackets feel airy rather than loud. Syntax: keywords in rose, strings in violet-gray, numbers in deeper pink. Best if you want a calm, feminine editor that never strains the eyes.

### Maiden

**Meaning:** *Maiden* — young woman; also the romantic, delicate sense of “maidenly.”

Warm shell pink (low saturation red, ~94% lightness) with **deep rose-red** body text and **golden-yellow** highlights (`today`, strings, git untracked). Olive-green line numbers add a vintage touch. Dark Maiden keeps those rose and gold accents on a charcoal shell. Feels like handwritten stationery — soft surface, strong readable ink.

### Girl

**Meaning:** *Girl* — youthful, bold, playful (not “girly” as in childish — more vivid and confident).

High-saturation **coral-red** panel (~h 4–6°) on white, with **hot pink** quotes and **sky-blue** intervals. Accents are loud: full-strength red cursor, cyan selections, yellow “today” markers. Dark Girl preserves the coral/pink/cyan energy on a dark base. For people who like their theme to have personality.

### Morandi

**Meaning:** Named after Italian painter **Giorgio Morandi** — his still lifes are famous for dusty, muted, harmonious grays.

Warm **greige** window (~h 35°, low saturation) and **blue-gray** text (~h 230°). Accents are desaturated teal and dusty rose — nothing neon. Borders and grids are soft; contrast is deliberately restrained. Dark Morandi shifts to a cool charcoal while keeping Morandi’s muted blue-green highlights. Calm, gallery-like, easy on the eyes for long sessions.

### LGBTQ

**Meaning:** Colors drawn from the **rainbow pride flag** (Gilbert Baker design).

Neutral cool-gray shell; stripe colors appear as accents:

| Stripe | Role in UI |
|--------|------------|
| Red | Active markers, emphasis |
| Orange / yellow | Charts, “today”, highlights |
| Green | Strings, weekday headers |
| Blue | Types, intervals |
| Violet | Keywords, cursor, actions |
| Cyan | Quote glow, numbers (dark) |

Dark LGBTQ inverts to a dark shell with the same hue family. Celebratory without painting the whole editor in stripes.

### Lesbian

**Meaning:** An inward color language — the warmth and closeness of love between women.

Think **dusk on a shared balcony**, **terracotta walls** catching the last light, **dusty rose** in shadow, **magenta** as pulse rather than symbol. The palette runs warm peach shell (~h 25°) through **sunset orange** intervals, **blush pink** quote glow, and **deep rose-magenta** for keywords and cursor — like intimacy that is tender but not fragile. Dark Lesbian keeps that glow on charcoal: embers, not neon. Compared with LGBTQ’s outward spectrum, Lesbian stays in one emotional register — close, bodily, quiet confidence.

### MS-DOS

**Meaning:** **Microsoft DOS** — the classic PC text mode of the 1980s–90s.

Saturated **IBM blue** background (~h 240°), **white** foreground, **yellow** strings, **green** actions, **cyan** muted text — the familiar `DIR` / `AUTOEXEC.BAT` look. Only a dark variant. Nostalgic terminal energy; not designed for minimal eye strain.

### Matrix II

**Meaning:** Reference to ***The Matrix*** (1999) — “Matrix” with a sequel nod in the name.

**Neon green** (~h 135°) on **near-black** green-tinted panels. Glassy depth via subtle grid and border greens; cursor and active elements glow. Strings and functions pick up the bright green; keywords stay in a mid green. Cyberpunk terminal — best in a dim room.

### Country themes

**Meaning:** Each palette draws on **classic cultural color expression** — landscape, craft, ritual, and everyday beauty — not national flags. Ukraine’s sky-and-wheat pairing is the clearest example; the others follow the same spirit.

| Theme | Cultural color story | Base |
|-------|----------------------|------|
| **China** | **Ink-wash landscape (水墨山水):** Xuan paper white, ink black and ink-wash gray, distant **mountain blue-green (花青)**, occasional **cinnabar seal red (朱砂)** — mist, restraint, depth. | Light |
| **Russia** | **Icons and winter:** gilt onion-dome gold, deep liturgical red, **birch-bark white**, twilight **slate blue** over snow — solemn, luminous, cold air. | Light |
| **USA** | **Open country:** **prairie sky** blue, **wheat-field** amber, **barn red**, worn denim — frontier light, not bunting. | Light |
| **Japan** | **Chrysanthemum and sword (菊与刀):** imperial **crimson**, **washi** white, **sumi** black, austere gray — bushido clarity: beauty held taut by discipline. | Light |
| **Ukraine** | **Sky and wheat (небо й пшениця):** open **azure** and ripe **gold** — the horizon where field meets summer sky; hopeful, earthy, wide. | Light |
| **Canada** | **North woods:** **maple autumn** crimson, **snow** white, **lake and pine** blue-green — forest silence, long winters, brief fire of fall. | Light |
| **Norway** | **Fjord night:** deep **sea navy**, **aurora** teal highlights, **pine** shadow, **midnight sun** amber on water — Nordic dark, sparse, bright edges. | Dark |
| **UK** | **Rain and reading rooms:** **fog gray**, **slate**, **library leather**, muted **rose** — damp stone, tea-hour quiet, inherited craft. | Light |
| **German** | **Forest and workshop:** **Black Forest** green-black, **oak** amber, **Rhine mist** gray, **Bauhaus** clear red accent — craft, gravity, function. | Dark |
| **Italy** | **Mediterranean stone:** **terracotta**, **olive**, **marble** warm white, **coastal azure** — sun on old walls, Renaissance earth tones. | Light |
| **India** | **Temple and market:** **turmeric** gold, **henna** rust, **indigo** night, **marigold** saffron — spice, ritual dye, monsoon sky between showers. | Light |
| **Brasil** | **Tropics:** **rainforest** green canopy, **beach** gold, **Atlantic** deep blue, carnival heat in accent reds — lush, sun, rhythm. | Light |

Primary hues tint the shell; secondary and accent colors carry strings, cursor, selection, and git marks. Light themes use pale washed backgrounds; Norway and German use deep cultural shadows with brighter accents.

## Install

**From the Marketplace** — search for [Minor Themes](https://marketplace.visualstudio.com/) in VS Code or Cursor, then install.

**From source**

```bash
git clone https://github.com/lenik/minor-themes.git
cd minor-themes
pnpm install
pnpm run package
```

Install the generated `.vsix` via **Extensions → … → Install from VSIX…**.

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run **Preferences: Color Theme**.
3. Pick a theme from the **Minor Themes** list.

## Development

```bash
pnpm install
pnpm run generate   # regenerate themes/*.json
pnpm run package    # build .vsix (runs generate via prepublish)
```

## License

[GNU Affero General Public License v3.0](LICENSE)
