# DanCold — personal web

Web personal estática construida con Astro. Reúne notas, dibujos, animación, experimentos 3D y otros proyectos en una estética inspirada por la web independiente.

## Desarrollo local

```sh
npm ci
npm run dev
```

El servidor local usa `/` como base. El build de producción usa `/website`, la ruta del proyecto en GitHub Pages.

## Comandos

| Comando | Acción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve el build de producción localmente |

## Publicar notas

Las notas viven en `src/content/blog/`. Los archivos heredados del starter de Astro están conservados como borradores mediante `draft: true`; para publicar una nota, crear un Markdown nuevo o cambiar ese valor a `false`.

## GitHub Pages

El workflow `.github/workflows/deploy.yml` compila y publica el sitio cuando hay un push a `main`. En la configuración del repositorio debe seleccionarse **Settings → Pages → Source: GitHub Actions**.

Sitio previsto: <https://dncold.github.io/website/>
