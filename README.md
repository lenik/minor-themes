# Minor Themes

A collection of VS Code color themes — soft pastels, pride palettes, retro terminals, and country palettes rooted in traditional culture.

## Theme guide

Each palette is defined in `scripts/generate-themes.mjs` and shared with the [UiTheme](https://github.com/lenik) project. Light/dark pairs are **separate hand-crafted palettes** — not derived from one another.

### Innocent

**Meaning:** *Innocent* — pure, gentle, unassuming.

**Innocent (light)** — Blush rose and soft lavender (hues ~280–340°). Backgrounds stay near white with a faint pink wash; text is muted purple-gray. Accents are dusty rose and periwinkle — selection, cursor, and brackets feel airy rather than loud. Syntax: keywords in rose, strings in violet-gray, numbers in deeper pink. Calm, feminine, easy on the eyes.

**Dark Innocent** — **Lavender twilight**: soft **purple dusk** shell (not neutral gray), **lilac-mist** text, **dusty rose** cursor and **periwinkle** glow. Innocence doesn't vanish in darkness — it becomes a quiet, ethereal night. Softer and cooler than Dark Maiden's ink-and-vellum warmth.

### Maiden

**Meaning:** *Maiden* — young woman; also the romantic, delicate sense of “maidenly.”

**Light Maiden** — Warm shell pink (low saturation red, ~94% lightness) with **deep rose-red** body text and **golden-yellow** highlights (`today`, strings, git untracked). Olive-green line numbers add a vintage touch. Feels like handwritten stationery — soft surface, strong readable ink.

**Dark Maiden** — **Ink and wax by lamplight**: aged **vellum** shadow (warm umber, not magenta gray), **iron-gall rose ink** text, **honey-gold** highlights, **dried sage** line numbers. The light theme’s stationery becomes a letter read in a quiet room — literary, restrained, pre-modern femininity.

### Girl

**Meaning:** *Girl* — youthful, bold, playful (not “girly” as in childish — more vivid and confident).

**Light Girl** — High-saturation **coral-red** panel (~h 4–6°) on white, with **hot pink** quotes and **sky-blue** intervals. Accents are loud: full-strength red cursor, cyan selections, yellow “today” markers.

**Dark Girl** — **Screen glow in a warm dark room**: **coral-black** shell (not purple “anime night”), loud coral cursor, **cyan LED** intervals, **hot-pink** quote stickers. Same bold confidence as the light theme — youth energy tuned for dim light, not muted into pastel darkness.

### Morandi

**Meaning:** Named after Italian painter **Giorgio Morandi** — his still lifes are famous for dusty, muted, harmonious grays.

**Light Morandi** — Warm **greige** window (~h 35°, low saturation) and **blue-gray** text (~h 230°). Accents are desaturated teal and dusty rose — nothing neon. Borders and grids are soft; contrast is deliberately restrained.

**Dark Morandi** — **Studio at closing**: **umber ochre** shadow (his bottle browns), **chalk-dust** cool gray text, **dusty teal** and **faded sage** accents — pigments whispering in low north light. Still gallery-quiet; saturation stays deliberately low.

### LGBTQ

**Meaning:** Colors drawn from the **rainbow pride flag** (Gilbert Baker design).

Stripe colors appear as accents (not full-background stripes):

| Stripe | Role in UI |
|--------|------------|
| Red | Active markers, emphasis |
| Orange / yellow | Charts, “today”, highlights |
| Green | Strings, weekday headers |
| Blue | Types, intervals |
| Violet | Keywords, cursor, actions |
| Cyan | Quote glow, numbers |

**Light LGBTQ** — Neutral cool-gray shell; stripe hues as readable accents. Celebratory without painting the whole editor in stripes.

**Dark LGBTQ** — **Rain-slick night parade**: deep **storm indigo** shell holding space for stripe hues to glow like **wet neon signage** — violet actions, green strings, yellow highlights, cyan numbers. Celebration needs darkness as backdrop, not as mute.

### Lesbian

**Meaning:** An inward color language — the warmth and closeness of love between women.

**Light Lesbian** — **Dusk on a shared balcony**: warm peach shell (~h 25°), **sunset orange** intervals, **blush pink** quote glow, **deep rose-magenta** keywords and cursor — intimate, tender, not fragile.

**Dark Lesbian** — **Skin warmth after sunset**: **terracotta umber** shadow (not wine-plum), **ember orange** and **blush pink** glow on cocoa depth — closeness held in one warm band. Inward, bodily, quiet confidence; distinct from Maiden’s literary rose.

### MS-DOS

**Meaning:** **Microsoft DOS** — the classic PC text mode of the 1980s–90s.

Saturated **IBM blue** background (~h 240°), **white** foreground, **yellow** strings, **green** actions, **cyan** muted text — the familiar `DIR` / `AUTOEXEC.BAT` look. Only a dark variant. Nostalgic terminal energy; not designed for minimal eye strain.

### Matrix II

**Meaning:** Reference to ***The Matrix*** (1999) — “Matrix” with a sequel nod in the name.

**Neon green** (~h 135°) on **near-black** green-tinted panels. Glassy depth via subtle grid and border greens; cursor and active elements glow. Strings and functions pick up the bright green; keywords stay in a mid green. Cyberpunk terminal — best in a dim room.

### Country themes

**Meaning:** Each palette draws on **classic cultural color expression** — landscape, craft, ritual, and everyday beauty — not national flags. Every country has **Light** and **Dark** variants as independent palettes.

| Theme | Light | Dark |
|-------|-------|------|
| **Brasil** | **Tropics:** **rainforest** green, **beach** gold, **Atlantic** blue on a pale shell — lush daylight. | **Canopy night:** deep green-black shadow, **carnival** red accents, gold and Atlantic blue as bright edges. |
| **Canada** | **North woods:** **snow** white, **maple autumn** crimson, **lake and pine** blue-green. | **Forest night:** pine shadow shell, maple ember, lake blue — long winter dark with brief warm accents. |
| **China** | **Ink-wash (水墨山水):** **xuan** paper, **sumi** gray, distant **mountain blue-green (花青)**, **cinnabar (朱砂)** seal accents. | **Night landscape:** deep ink blue-black, pale paper-toned text, **cinnabar** lantern accents, **indigo** mist. |
| **German** | **Rhine workshop:** **mist** gray, **oak** amber, forest **green** accents — craft in daylight. | **Black Forest:** green-black shadow, **oak** warmth, **Bauhaus** red accent — gravity and function. |
| **India** | **Temple and market:** **turmeric** gold, **henna** rust, **marigold** saffron on cream — spice and ritual dye in sun. | **Monsoon night:** deep **indigo** shell, **turmeric** and **marigold** glow, henna depth between showers. |
| **Italy** | **Mediterranean stone:** **terracotta**, **olive**, **marble** warm white, **coastal azure**. | **Coastal dusk:** terracotta shadow, olive depth, azure highlights on warm stone dark. |
| **Japan** | **Paper and dye:** warm **washi**, **sumi** gray, **ai** indigo, **beni** shrine accent, **moss**, pale **sakura** wash. | **Lacquer evening:** **urushi** dark shell, lantern **beni**, **moss** garden green, **ai** shadow — materials and season, not a single emblem. |
| **Norway** | **Fjord and birch:** ice-bright shell, pale **sea** blue, **pine** shadow, brief **midnight-sun** gold. | **Fjord night:** deep **sea navy**, **aurora** teal, sparse bright edges on Nordic dark. |
| **Russia** | **Icons and winter:** gilt gold, liturgical red, **birch** white, **slate blue** over snow. | **Winter twilight:** deep slate shell, gilt and red as luminous accents, birch-pale text, cold air. |
| **Taiwan** | **Island mist:** **mountain fog** gray-blue, **tea-hill** green, **temple-pillar** red, **Pacific teal**. | **Highland night:** misty blue-gray dark, tea-green shadow, temple red and coast teal as edges. |
| **Thai** | **Temple and river:** warm **stucco** cream, **saffron** robe, **lotus** pink, **jade** shade, **gold leaf** accent. | **Temple night:** lacquer dark, **saffron** glow, lotus pink, gold on shadow — ordination gold without gilding the whole shell. |
| **UK** | **Rain and reading rooms:** **fog gray**, **slate**, **library leather**, muted **rose**. | **Rainy evening:** slate depth, leather-brown warmth, rose in lamplight — tea-hour quiet. |
| **Ukraine** | **Sky and wheat (небо й пшениця):** open **azure** and ripe **gold** — field meets summer sky. | **Evening field:** indigo sky dark, **wheat** shimmer and **azure** accents — hopeful, earthy depth. |
| **USA** | **Open country:** **prairie sky** blue, **wheat-field** amber, **barn red**, worn **denim**. | **Prairie dusk:** denim-navy shell, **barn red** ember, amber horizon — frontier dark, not bunting. |
| **Viet** | **Delta and village:** **rice-paper** cream, **lacquer** red, **bamboo** green, **river** blue-gray. | **Lantern dusk:** delta indigo dark, **lacquer** red, bamboo green, warm lantern gold on water. |

Primary hues tint the shell; secondary and accent colors carry strings, cursor, selection, and git marks.

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
