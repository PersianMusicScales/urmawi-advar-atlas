# Deployment guide — version 4.3.0

## Replace the complete repository contents

This release changes HTML, JavaScript, CSS, the service worker, translations, and PWA metadata together. Do not upload only `index.html`.

1. Download and extract the complete v4.3.0 archive.
2. Open the extracted `urmawi-advar-atlas-pwa` folder.
3. Upload **all files and folders inside it** to the root of `PersianMusicScales/urmawi-advar-atlas`.
4. Commit with a message such as `Release Advar Atlas PWA v4.3.0`.
5. In **Settings → Pages**, use **GitHub Actions** as the source.
6. Wait for the deployment workflow to complete.

The repository root must contain `index.html`, `manifest.webmanifest`, `service-worker.js`, `css/`, `js/`, and `assets/` directly.

## Activate the new PWA files

The release uses cache `advar-atlas-4.3.0`. After deployment:

1. Open the live application.
2. Perform one hard refresh (`Ctrl + Shift + R` on Windows).
3. When testing an installed PWA, close and reopen it.
4. If an older broken service worker remains, clear site data once and reload.

## Google Sites

Embed:

```text
https://persianmusicscales.github.io/urmawi-advar-atlas/?embed=1
```

Embed mode removes the opening screen, installation controls, mobile navigation, and unnecessary outer chrome.

## Release tag

After confirming the live application, create tag `v4.3.0`.
