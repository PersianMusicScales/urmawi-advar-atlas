# Changelog

## 4.3.0 — final interaction and phone-layout repair

- Fixed the startup exception that could stop every opening-screen and navigation control.
- Verified Combined, Theory, Instrument, and Focus as independent working controls.
- Rebuilt phone-landscape navigation as six direct, equal-width sections: Learn, Explore, Construct, Listen, Species & Modes, and Train & Data.
- Ensured each phone navigation item activates and displays its complete panel.
- Hid fullscreen on phones while retaining it on desktop.
- Removed font-size and contrast controls and their saved state.
- Corrected top-left brand alignment and centered the circle-only mark.
- Completed a four-language dynamic-content refresh after language changes.
- Standardized Persian creator terminology as «محقق».
- Updated all application, manifest, service-worker, and structured-data versions to 4.3.0.

## 4.2.0 — interface and mobile navigation repair

- Corrected the header brand-mark alignment.
- Repaired Combined, Theory, Instrument, and Focus controls by removing stale dependencies on deleted controls.
- Removed contrast and font-size controls from the header and Settings.
- Replaced the clipped fullscreen text with an accessible icon-only button.
- Exposed Learn, Explore, Construct, Listen, Species & Modes, and Train & Data directly in phone navigation.
- Corrected Persian creator wording to «محقق» and harmonized equivalent researcher wording in the other languages.
- Audited six-section labels across English, Persian, Arabic, and Turkish.
- Prevented phone-landscape presentation rules from hiding the learning workspace.

## 4.1.1
- Critical startup hotfix: repaired non-working buttons caused by a missing validation-panel element.
- Updated service-worker cache version to force delivery of the corrected scripts.


## 4.1.1 — Mobile presentation correction
- Removed obsolete session-continuation and progress-reset controls.
- Removed public built-in validation/test panels while retaining developer-side tests.
- Replaced legacy product terminology with Atlas terminology.
- Corrected the Persian product name to «گام‌های موسیقی ایرانی».
- Added a phone-only landscape requirement so the complete monochord is visible.
- Added iOS and Android safe-area handling to prevent status-bar overlap.
- Simplified the brand mark to the circular manuscript diagram without the monochord line.
- Shortened the opening statement in all four languages.

## 4.0.0 — Official PWA Edition

- Complete installable PWA and offline cache
- Manuscript-inspired official visual identity and app icon
- True responsive desktop, tablet, and theory-first phone layouts
- Optional mobile instrument view
- Mobile bottom navigation, More and Settings sheets
- First-launch screen and session continuation
- Persistent learning, audio, view, and accessibility state
- Touch interactions and lesson swipe support
- Google Sites embed mode
- Four-language PWA and mobile interface
- Open Graph, structured data, screenshots, shortcuts, and release metadata
- Automated Pages deployment and validation workflows
