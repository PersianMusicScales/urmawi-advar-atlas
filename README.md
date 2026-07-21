# Al-Urmawī Advar Atlas

**Al-Urmawī Advar Atlas** is an installable, offline-capable, multilingual progressive web application for exploring Ṣafī al-Dīn al-Urmawī’s monochord, fret divisions, exact rational pitch data, geometrical construction, listening models, tetrachord species, modal categories, and training activities.

The Atlas is part of **Persian Music Scales · Historical Theory Series** and was conceived, designed, researched, and developed by **Dr. Pouya Hosseini**.

## Live application

https://persianmusicscales.github.io/urmawi-advar-atlas/

## PWA and responsive features

- Installable on Android, Windows, macOS, Linux, ChromeOS, and through Add to Home Screen on iOS
- Offline application shell and cached scholarly Atlas
- True desktop, tablet, and phone layouts—no miniature scaled desktop interface
- Theory-first phone layout; the illustrative instrument is hidden by default and can be opened explicitly
- Mobile bottom navigation and touch-sized controls
- Long-press fret playback and swipe navigation through lessons
- Local persistence of lesson, panel, pitch, audio, view, and accessibility settings
- English, Persian, Arabic, and Turkish interfaces, including PWA and mobile controls
- Dedicated Google Sites/iframe mode through `?embed=1`
- Install, update, online/offline, and version-management interface

## Visual identity

The icon and color system are original designs inspired by the manuscript’s parchment ground, dark calligraphic ink, vermilion geometrical circles, and string-division diagrams. The mark combines concentric theoretical rings with a monochord and highlighted fret.

## URL options

- `?lang=en`, `?lang=fa`, `?lang=ar`, `?lang=tr`
- `?panel=learn`, `?panel=explore`, `?panel=construct`, `?panel=listen`, `?panel=modes`, `?panel=train`
- `?view=both`, `?view=theory`, `?view=instrument`
- `?embed=1` for Google Sites and iframe embedding
- `?welcome=0` to bypass the opening screen

## Local validation

```bash
node tests/validate.mjs
node tests/pwa-check.mjs
```

## GitHub Pages

The included workflow publishes the root directory to GitHub Pages after validation. It can also be deployed directly from the `main` branch root.

## Scholarly scope

Exact ratios and mathematical relations are separated from editorial reconstruction. The guided sequence, synthesized audio, four-string illustration, and modern explanatory prose are pedagogical layers rather than claims for a unique historical performance tuning or reconstruction of a surviving instrument.

## Copyright

Copyright © 2026 Dr. Pouya Hosseini. All rights reserved. See `LICENSE`.
