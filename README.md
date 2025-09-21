# UABC Portal — Astro + TypeScript + Tailwind

Mantiene **el diseño actual** y lo sube a un stack profesional al estilo midudev (Astro, Tailwind, Vercel, Supabase).

## Dev
```bash
npm i
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Supabase
Configura variables en `.env` (o en Vercel → Project Settings → Environment Variables):
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

## Estructura
- `src/pages/index.astro` → usa tu HTML actual
- `src/layouts/BaseLayout.astro` → incluye Tailwind, vendors y tus assets
- `public/assets/...` → tus css/js y `/assets/cv/cv.pdf`

## Deploy (Vercel)
- Importa el repo. Vercel detectará Astro automáticamente.
- Añade `SUPABASE_URL` y `SUPABASE_ANON_KEY` como env vars.
