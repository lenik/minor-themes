# Changelog

All notable changes to this extension are documented in this file.

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
