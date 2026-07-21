# Deployment guide

## Replace the current GitHub repository contents

1. Download the complete PWA archive.
2. Extract it locally.
3. In `PersianMusicScales/urmawi-advar-atlas`, upload all extracted files and folders to the repository root.
4. Commit with a message such as `Release official PWA edition v4.1.0`.
5. In **Settings → Pages**, choose **GitHub Actions** as the source.
6. The included workflow validates and deploys the application.

## Google Sites

Embed this URL:

```text
https://persianmusicscales.github.io/urmawi-advar-atlas/?embed=1
```

The embed mode hides the opening screen, installation controls, mobile bottom bar, and unnecessary outer chrome.

## Create the first release

After confirming the live app, create and push tag `v4.1.0`. The release workflow creates a downloadable archive and GitHub release.
