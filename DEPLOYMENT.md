# Deployment guide — current repository

The `main` branch is the production source. GitHub Pages deploys automatically when changes are pushed to main, after `npm test` passes. It can also be deployed manually using the **Deploy Advar Atlas to GitHub Pages** workflow in Actions. In Settings → Pages, select GitHub Actions as the source.

## Local validation

From the repository root, run `npm test` using Node.js 22, then `python3 -m http.server 8080` and open http://localhost:8080/. Check the current application, reference pages and mobile landscape controls. The Quality and Lighthouse workflow runs desktop and mobile checks on pull requests.

## After deployment

Open https://persianmusicscales.github.io/urmawi-advar-atlas/ and check the application and sitemap. If an installed PWA offers an update, accept it. A hard refresh or clearing site data is a last resort if stale assets remain. The service worker uses a versioned cache.

## Google Sites

Embed URL: https://persianmusicscales.github.io/urmawi-advar-atlas/?embed=1

Keep the application, assets, reference pages, topics, manifest, and service worker together. Never overwrite the production repository with an older release archive. Create release tags only after validating the corresponding release.
