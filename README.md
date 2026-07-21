# Al-Urmawī Advar Atlas

**Al-Urmawī Advar Atlas** is a multilingual, installable, and offline-capable progressive web application for exploring the music theory of Ṣafī al-Dīn al-Urmawī through interactive geometry, exact rational pitch relationships, sound, and guided learning.

The Atlas presents the monochord and its fret divisions as a connected system of mathematical, visual, and aural relationships. It includes exact pitch data, geometrical construction, listening tools, tetrachord species, modal categories, and training activities.

The project forms part of the **Persian Music Scales · Historical Theory Series** and was conceived, researched, designed, and developed by **Dr. Pouya Hosseini**.

## Live application

**https://persianmusicscales.github.io/urmawi-advar-atlas/**

## Main features

- Interactive monochord with exact rational string-length and frequency ratios
- Guided lessons covering fret division, intervals, construction, and modal organization
- Explore, Construct, Listen, Species & Modes, and Train & Data sections
- Pure-tone and plucked-string listening models
- Exact cents, frequencies, string lengths, and interval relationships
- Illustrative four-string instrument mapping
- English, Persian, Arabic, and Turkish interfaces
- Responsive desktop, tablet, and phone layouts
- Installable progressive web application with offline support
- Local persistence of language, lesson progress, selected pitch, audio settings, and interface state
- Dedicated Google Sites and iframe presentation mode
- Keyboard, touch, and mobile navigation support

## Mobile experience

The phone interface is designed around the theoretical monochord rather than a reduced desktop canvas.

- The complete monochord is presented in landscape orientation for legibility.
- The illustrative instrument is hidden by default on phones and can be opened when needed.
- All six principal sections remain directly accessible:
  - Learn
  - Explore
  - Construct
  - Listen
  - Species & Modes
  - Train & Data
- Touch targets and controls are adapted for smaller screens.
- Safe-area spacing prevents overlap with the phone status bar, camera cutout, and home indicator.

## Progressive web application

The Atlas can be installed on supported browsers and devices, including Android, Windows, macOS, Linux, ChromeOS, and iOS through **Add to Home Screen**.

PWA functionality includes:

- offline application shell
- cached interface and scholarly content
- install support
- update notifications
- online and offline status handling
- application icons and maskable icons
- standalone display mode
- versioned service-worker caching

## Languages

The complete interface is available in:

- English
- Persian
- Arabic
- Turkish

Persian and Arabic use dedicated right-to-left layouts. Language coverage includes lessons, navigation, visualization controls, installation messages, settings, source notes, accessibility labels, and mobile controls.

## Visual identity

The visual system combines deep indigo, parchment, gold, vermilion, and manuscript-inspired geometric details.

The current application icon is based on the miniature-style artwork supplied for the project and has been adapted into a consistent icon family for browser, mobile, and installed-app use.

Icon assets are provided in multiple sizes under:

```text
assets/icons/
```

## Application sections

### Learn

A guided curriculum introducing the mathematical and historical foundations of the system.

### Explore

Interactive inspection of each fret position, including:

- exact string-length ratio
- reciprocal frequency ratio
- cents
- calculated frequency
- distances from bridge and nut
- adjacent interval classification

### Construct

A step-by-step pedagogical reconstruction of the pitch positions using exact geometrical and rational relationships.

### Listen

Aural comparison of positions and intervals using pure and plucked-string synthesis.

### Species & Modes

Exploration of tetrachord species, interval orders, and modal categories.

### Train & Data

Exercises, pitch recognition, exact-ratio review, and access to the complete pitch table.

## URL parameters

The application supports direct links to languages, panels, and visualization modes.

### Language

```text
?lang=en
?lang=fa
?lang=ar
?lang=tr
```

### Section

```text
?panel=learn
?panel=explore
?panel=construct
?panel=listen
?panel=modes
?panel=train
```

### Visualization

```text
?view=both
?view=theory
?view=instrument
```

### Embedded presentation

```text
?embed=1
```

This mode is intended for Google Sites and iframe embedding.

### Skip the opening screen

```text
?welcome=0
```

Parameters may be combined, for example:

```text
?lang=fa&panel=explore&view=theory
```

## Project structure

```text
.
├── .github/
│   └── workflows/
├── assets/
│   ├── brand/
│   ├── icons/
│   ├── screenshots/
│   └── social/
├── css/
├── js/
├── tests/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── offline.html
├── README.md
├── SCHOLARLY_NOTES.md
├── CHANGELOG.md
└── LICENSE
```

## Local development

No backend is required. The project can be served through any static web server.

For example:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

A local server is recommended because service workers and some PWA functions do not operate correctly when `index.html` is opened directly through the `file://` protocol.

## Validation

Run the included validation scripts with Node.js:

```bash
node tests/validate.mjs
node tests/pwa-check.mjs
```

The tests verify the mathematical model, pitch ordering, octave closure, multilingual structure, PWA resources, and application configuration.

## Deployment

The application is designed for static hosting and is compatible with GitHub Pages.

The included GitHub Actions workflow can validate and deploy the repository automatically. Alternatively, GitHub Pages may publish directly from the root of the `main` branch.

For embedding in Google Sites, use the deployed URL with:

```text
?embed=1
```

## Scholarly scope

The Atlas distinguishes between:

- exact mathematical relationships;
- information grounded in historical sources;
- modern scholarly interpretation;
- pedagogical reconstruction;
- synthesized audio and illustrative visual mapping.

The guided construction sequence, modern explanatory language, synthesized sound, and four-string instrument illustration are educational layers. They should not be understood as claims for a unique historical performance practice or as a reconstruction of one surviving instrument.

Further source and editorial information is provided in:

```text
SCHOLARLY_NOTES.md
```

## Citation

Suggested citation:

> Hosseini, Pouya. *Al-Urmawī Advar Atlas: A Scholarly Interactive Edition*. Persian Music Scales · Historical Theory Series, 2026.

## Creator

**Dr. Pouya Hosseini**  
Researcher, independent developer, and creator of the Persian Music Scales project.

## Copyright and license

Copyright © 2026 Dr. Pouya Hosseini. All rights reserved.

See [`LICENSE`](LICENSE) for the terms governing use, reproduction, modification, and distribution.
