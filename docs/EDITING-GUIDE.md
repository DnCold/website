# Guía para editar la web

Esta guía está pensada para cambiar el sitio sin tener que entender todo Astro de una vez. La regla
principal es simple: el contenido, los estilos y la lógica están separados para que cada cambio tenga
un lugar predecible.

## 1. Empezar el proyecto

Necesitas una versión reciente de Node.js. Desde la carpeta del proyecto:

```sh
npm ci
npm run dev
```

Astro mostrará una dirección local, normalmente `http://localhost:4321`. Los cambios se actualizan
automáticamente mientras el servidor está abierto.

Antes de publicar, comprueba siempre el build:

```sh
npm run build
```

## 2. Mapa rápido del proyecto

```text
src/
├── assets/            Imágenes que Astro optimiza al compilar
├── components/        Cabecera, pie y piezas reutilizables
├── content/blog/      Notas escritas en Markdown o MDX
├── data/gallery.ts    Contenido de los capítulos de la galería
├── layouts/           Layout normal y layout sin navegación para cada mundo
├── pages/             Una página por archivo o carpeta
├── styles/            Estilos globales y de la galería
├── consts.ts          Título y descripción generales
└── lib/nav.ts         Menú principal y helper para URLs
```

Los archivos que probablemente editarás más seguido son:

- `src/consts.ts`: nombre y descripción global.
- `src/lib/nav.ts`: enlaces de navegación.
- `src/pages/index.astro`: portada.
- `src/pages/about.astro`: texto de About y explicación del proceso.
- `src/pages/links.astro`: enlaces externos.
- `src/data/gallery.ts`: capítulos de la galería.
- `src/pages/coldem.astro`: contenido del mundo Coldem.
- `src/styles/coldem.css`: apariencia completa del launcher Coldem.
- `src/styles/global.css`: paleta y tipografías.

## 3. Páginas normales y mundos independientes

El sitio tiene dos tipos de página:

- `PageLayout.astro` muestra la cabecera noren y el pie general. Se usa en Home, Notes, Links y About.
- `WorldLayout.astro` no añade navegación visual. Se usa cuando una página debe sentirse como un
  lugar o programa independiente.

Gallery/Archivist y Coldem usan `WorldLayout.astro`. Cada mundo incluye un enlace pequeño para volver
al hub, pero no hereda la cortina noren ni el pie de la portada. Para crear otro mundo, copia una de
esas páginas, conserva `WorldLayout` y dale su propia hoja de estilos.

## 4. Cambiar la galería

Todo el texto de los capítulos vive en `src/data/gallery.ts`. Cada objeto tiene esta forma:

```ts
{
  id: 'sketchbook',
  number: '01',
  title: 'The Sketchbook',
  label: 'Drawings',
  summary: 'Ink, studies, and unfinished lines.',
  description: 'A longer description for the selected chapter.',
  status: 'Catalog in progress',
  tags: ['illustration', 'sketches'],
  accent: '#9edee8',
}
```

Puedes reescribir, reordenar o duplicar estos objetos. El selector y el panel inferior se generan
automáticamente. Para un capítulo nuevo:

1. Copia un objeto completo.
2. Usa un `id` corto, único y sin espacios.
3. Cambia el número, textos, etiquetas y color.
4. Ejecuta `npm run build` para detectar errores.

### Sustituir el arte de la recepcionista

El arte actual está en:

```text
src/assets/gallery/archive-guide-manga.webp
```

La página lo importa al comienzo de `src/pages/gallery/index.astro`:

```ts
import archiveGuide from '../../assets/gallery/archive-guide-manga.webp';
```

La opción más clara es añadir tu imagen nueva en `src/assets/gallery/` y cambiar únicamente esa ruta.
No necesitas tocar el selector ni JavaScript.

Para que la composición siga funcionando bien:

- usa una imagen horizontal cercana a proporción 16:10;
- deja espacio oscuro y relativamente limpio a la izquierda;
- coloca el personaje principal hacia la derecha;
- evita texto incrustado en la imagen: los títulos deben seguir siendo HTML editable;
- WebP, AVIF, PNG y JPG funcionan, aunque WebP suele dar un buen equilibrio de tamaño y calidad.

## 5. Cambiar Coldem

El contenido editable está en `src/pages/coldem.astro` y su diseño en `src/styles/coldem.css`.
Las tres imágenes propias del launcher viven en `src/assets/coldem/`:

- `icon.png`: icono pequeño del sistema;
- `dancold-logo.png`: marca morada grande;
- `pet-stickers-v6.webp`: hoja optimizada de cuatro stickers usada como sprite CSS.

La página está pensada principalmente para descargar el instalador de Windows. La versión, el tamaño,
el SHA-256 y la URL directa viven juntos al principio de `coldem.astro`:

```ts
const releaseVersion = '0.4.1';
const installerUrl = '...';
const installerSize = '26.9 MB';
const installerSha = '...';
```

Cuando publiques una nueva versión del launcher, actualiza esas cuatro constantes con los datos del
asset `.exe` de GitHub Releases. `launcherRepo` y `launcherReleases` controlan los enlaces secundarios
al código y a las notas de versión.

## 6. Cambiar los sprites noren

La cortina del hub usa dos imágenes separadas:

```text
src/assets/noren-fabric-v2.webp   textura repetible
src/assets/noren-rail-v2.webp     barra y cinco paneles transparentes
```

Sus tamaños, posición, interacción y vista móvil están en `src/styles/noren-component.css`. Si
reemplazas una imagen, conserva el mismo nombre para no tocar código. El rail funciona mejor en una
proporción horizontal cercana a 3:1 y con fondo transparente.

## 7. Escribir una nota

Crea un archivo como `src/content/blog/my-first-note.md`:

```md
---
title: 'My first note'
description: 'A short description shown in the notes index.'
pubDate: 2026-08-13
draft: false
---

Write the note here using Markdown.
```

Con `draft: true` la nota queda guardada pero no aparece en la web ni en RSS. Cambia a `false` para
publicarla.

Si necesitas una imagen de portada, guárdala en `src/assets/` y añade al frontmatter:

```md
heroImage: '../../assets/my-image.jpg'
```

## 8. Cambiar colores y tipografía

Las decisiones generales están al principio de `src/styles/global.css` dentro de `:root`.

```css
--font-reading: Georgia, 'Times New Roman', serif;
--font-display: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;
--font-label: ui-monospace, 'Cascadia Code', 'Courier New', monospace;

--ink: #20253b;
--paper: #f6ead4;
--night: #151622;
--rust: #a95738;
--ice: #8bc9d3;
```

- `--font-reading` controla párrafos y lectura larga.
- `--font-display` controla títulos y elementos editoriales.
- `--font-label` se usa para fichas, números y pequeños rótulos de archivo.

La mezcla está pensada para sentirse artesanal: serif de imprenta para la lectura, monoespaciada sólo
en etiquetas funcionales y una superficie de papel con pequeñas imperfecciones.

## 9. Cambiar una página

Cada ruta pública corresponde a un archivo:

| URL | Archivo |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/blog/` | `src/pages/blog/index.astro` |
| `/gallery/` | `src/pages/gallery/index.astro` |
| `/coldem/` | `src/pages/coldem.astro` |
| `/links/` | `src/pages/links.astro` |
| `/about/` | `src/pages/about.astro` |
| página inexistente | `src/pages/404.astro` |

En un archivo `.astro`, la parte entre `---` contiene imports y datos. El HTML está debajo. Los estilos
locales suelen estar al final dentro de `<style>`.

## 10. Publicar

El repositorio publica automáticamente con GitHub Actions cuando los cambios llegan a `main`.

Flujo recomendado:

1. Haz tus cambios en una rama.
2. Ejecuta `npm run build`.
3. Revisa la portada, Gallery y la vista móvil.
4. Sube la rama y abre un pull request.
5. Integra el pull request en `main`.
6. Comprueba la pestaña **Actions** y luego la web pública.

No edites `dist/`: esa carpeta se genera de nuevo en cada build y no se publica como código fuente.

## 11. Checklist antes de terminar

- [ ] Todo el texto público está en inglés.
- [ ] Los enlaces del menú funcionan bajo `/website/`.
- [ ] La galería se puede usar con mouse, touch y teclado.
- [ ] Gallery y Coldem no muestran la navegación noren del hub.
- [ ] El arte no contiene títulos que luego sean difíciles de editar.
- [ ] Las imágenes tienen texto alternativo útil o `alt=""` si son sólo decorativas.
- [ ] `npm run build` termina sin errores.
- [ ] No se añadieron `node_modules/`, `dist/` ni archivos privados al commit.
