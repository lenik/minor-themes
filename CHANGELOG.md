# Changelog

All notable changes to this extension are documented in this file.

## [1.0.7] — 2026-07-01

### Added

- **Dark Innocent** — lavender-twilight shell with lilac-mist text, dusty rose cursor, and periwinkle glow; paired with the existing Innocent light theme.
- **Light X-Files** and **Dark X-Files** — manila-folder fluorescent bureaucracy (light) and forest-night CRT / flashlight investigation (dark), inspired by *The X-Files*.
- **Light Only Yesterday** and **Dark Only Yesterday** — sun-washed Yamagata memory (light) and tatami-dusk safflower lantern (dark), inspired by *Omohide Poro Poro* (1991).
- Hand-crafted syntax token palettes for all six new theme JSON files.

### Changed

- Redesigned dark workbench and token color language for **Maiden**, **Girl**, **Morandi**, **LGBTQ**, and **Lesbian** — each dark palette now expresses the theme’s essence (ink-and-vellum, coral screen-glow, painter’s studio umber, rain-slick pride neon, terracotta skin-warmth) instead of generic wine-plum or magenta nights.
- README theme guides (English and Chinese): Innocent light/dark pair; revised dark descriptions for aesthetic themes; new X-Files and Only Yesterday sections.
- Extension manifest registers **48 themes** (version **1.0.7**).

## [1.0.6] — 2026-07-01

### Added

- Country themes **Thai**, **Viet**, and **Taiwan** — each with hand-crafted light and dark palettes in `scripts/country-palettes.mjs`, plus syntax token palettes.
- Dark country variants for all fifteen regions (`dark-country-{slug}`), registered alongside existing light `country-{slug}` entries — **43 themes** total.
- Shared `scripts/color-utils.mjs` and one-shot HSL refactor scripts for palette maintenance.
- Hand-crafted syntax token palettes (`scripts/token-palettes.mjs`, `scripts/country-token-palettes.mjs`) with ~32 scoped categories per theme.

### Changed

- Theme generation refactor: workbench palettes use `hsl()` strings; git decoration colors are defined inline per palette instead of via `withGit()` / `countryGit()`.
- Light and dark shells are fully independent palettes — `darkVariant()` derivation removed for Maiden, Girl, Morandi, LGBTQ, Lesbian, and all country themes.
- Country workbench colors are hand-designed in `scripts/country-palettes.mjs` (no `countryPalette()` algorithm).
- **Japan** workbench and token palettes redesigned around paper (**washi**), ink (**sumi**), indigo dye (**ai**), vermillion accent (**beni**), moss, and seasonal restraint.
- **Norway** and **German**: `country-norway` / `country-german` are now light; former dark shells are `dark-country-norway` / `dark-country-german`.
- Generated `themes/*.json` files are no longer tracked in git; `vscode:prepublish` runs `pnpm run generate`.
- README theme guides (English and Chinese): country table lists all fifteen regions alphabetically with Light/Dark columns; paired theme sections describe both variants.

## [1.0.5] — 2026-06-30

### Added

- Hand-crafted git decoration foreground colors (`modified`, `deleted`, `untracked`) for all 25 themes on `panel.background`. Each palette uses amber-gold, red, and green (or a theme-specific accent such as Ukraine blue), tuned for contrast and cultural fit. Values live in `gitDecorations` inside `scripts/generate-themes.mjs`.

## [1.0.4] — 2026-06-25

### Fixed

- Extension marketplace icon display.

## [1.0.3] — 2026-06-25

### Changed

- Added alpha channel to the extension icon.

## [1.0.2] — 2026-06-25

### Added

- English and Chinese README theme guides (`README.md`, `README-zh_CN.md`).

### Changed

- Regenerated all theme JSON files with contrast-adjusted editor token and UI colors.

## [1.0.1] — 2026-06-25

### Added

- Registered 25 themes in the extension manifest: Innocent; Light/Dark Maiden, Girl, Morandi, LGBTQ, and Lesbian; MS-DOS; Matrix II; and twelve Country themes.

### Changed

- Extended the theme generator with contrast enforcement and new palette families (LGBTQ, Lesbian, Matrix II, country palettes).

## [1.0.0] — 2026-06-25

### Added

- Initial VS Code extension with seven generated color themes from UiTheme.cpp-derived palettes.
- Theme generator script, `vsce` packaging, AGPL-3.0 license.
