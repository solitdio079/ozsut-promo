# Özsüt Promo Menu

Small React + React Router v7 promotional menu page.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production files are generated in `dist/`.

## Deploy With Coolify

Use the included `Dockerfile`.

In Coolify:

1. Create a new Dockerfile-based app from this repository.
2. Set the exposed/container port to `80`.
3. Point your domain to the Coolify app.

The nginx config includes React Router fallback, so QR links like
`/menu/serpme-kahvalti`, `/menu/pizza-hamburger-icecek`, and
`/menu/tatli-bir-mola` work when opened directly.

## Other Deploys

Netlify can use the included `netlify.toml`.

For a custom server, serve the `dist/` folder and route unknown paths back to
`dist/index.html` so React Router can handle client-side routes.
