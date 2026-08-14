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
├── data/archivist.ts  Contenido de los estantes de The Archivist
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
- `src/pages/about.astro`: contenido del dossier About.
- `src/styles/about.css`: apariencia retro del dossier About.
- `src/pages/links.astro`: enlaces externos.
- `src/data/archivist.ts`: estantes y reacciones de The Archivist.
- `src/pages/blog/index.astro`: presentación y textos de The Chronicler.
- `src/styles/chronicler.css`: mundo visual de The Chronicler.
- `src/assets/chronicler/chronicler-neutral.png`: retrato principal de The Chronicler.
- `src/pages/coldem.astro`: contenido del mundo Coldem.
- `src/styles/coldem.css`: apariencia completa del launcher Coldem.
- `src/styles/global.css`: paleta y tipografías.

## 3. Páginas normales y mundos independientes

El sitio tiene dos tipos de página:

- `PageLayout.astro` muestra la cabecera noren y el pie general. Se usa en Home, Links y About.
  Home activa una variante retro propia; las otras páginas conservan la cabecera artesanal normal.
- `WorldLayout.astro` no añade navegación visual. Se usa cuando una página debe sentirse como un
  lugar o programa independiente.

The Chronicler, The Archivist y Coldem usan `WorldLayout.astro`. Cada mundo incluye un enlace pequeño para volver
al hub, pero no hereda la cortina noren ni el pie de la portada. Para crear otro mundo, copia una de
esas páginas, conserva `WorldLayout` y dale su propia hoja de estilos.

## 4. Cambiar The Archivist

Todo el texto de los estantes vive en `src/data/archivist.ts`. Cada objeto tiene esta forma:

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
  accent: '#77937b',
  reaction: 'Mm. These margins have potential.',
}
```

Puedes reescribir, reordenar o duplicar estos objetos. El selector y el panel inferior se generan
automáticamente. Para un capítulo nuevo:

1. Copia un objeto completo.
2. Usa un `id` corto, único y sin espacios.
3. Cambia el número, textos, etiquetas y color.
4. Ejecuta `npm run build` para detectar errores.

### Sustituir los retratos de The Archivist

Los cuatro retratos están en:

```text
src/assets/archivist/archivist-neutral.webp
src/assets/archivist/archivist-sketchbook.webp
src/assets/archivist/archivist-motion.webp
src/assets/archivist/archivist-render.webp
```

La página los importa al comienzo de `src/pages/archivist/index.astro`. Cada imagen corresponde a un
estado de `data-pose`; al pasar el mouse o enfocar un estante, JavaScript muestra la pose asociada.

```ts
import archivistNeutral from '../../assets/archivist/archivist-neutral.webp';
```

La opción más clara es reemplazar los cuatro archivos conservando sus nombres. No necesitas tocar el
selector ni JavaScript.

Para que la composición siga funcionando bien:

- usa cuatro retratos cuadrados con el personaje a la misma escala;
- conserva la identidad, ropa, gafas y trenza entre poses;
- evita texto incrustado: títulos y reacciones siguen siendo HTML editable;
- WebP, AVIF, PNG y JPG funcionan, aunque WebP suele dar un buen equilibrio de tamaño y calidad.

## 5. Cambiar The Chronicler

The Chronicler es el personaje de Notes. Su portada vive en `src/pages/blog/index.astro` y todos sus
estilos están agrupados en `src/styles/chronicler.css`. El retrato canónico está en:

```text
src/assets/chronicler/chronicler-neutral.png
```

Puedes sustituirlo conservando ese nombre. La misma imagen aparece recortada como miniatura en la
portada y a tamaño grande dentro del mundo de The Chronicler. Para que ambos recortes funcionen:

- usa un retrato vertical con el rostro y el pelo lejos de los bordes;
- deja algo de espacio alrededor de la silueta;
- evita texto incrustado, porque el nombre y la descripción son HTML editable;
- conserva el aspecto del personaje entre futuros retratos: rizos grandes, barba, capa gastada,
  correas de explorador y libreta de campo.

Los artículos no se escriben dentro de la página. Siguen viviendo en `src/content/blog/` y usan
automáticamente el mismo mundo visual mediante `src/layouts/BlogPost.astro`.

## 6. Cambiar Coldem

El contenido editable está en `src/pages/coldem.astro` y su diseño en `src/styles/coldem.css`.
Las imágenes propias de este mundo viven en `src/assets/coldem/`:

- `dancold-logo.png`: marca grafiti original, conservada como referencia histórica;
- `runner-v4.png`: retrato vertical con fondo, conservado como arte fuente;
- `runner-head.png`: cabeza actual con transparencia; reemplaza la marca antigua en la interfaz;
- `runner-full.png`: pose completa y transparente usada en la ficha del personaje;
- `runner-welcome.png`: pose de bienvenida usada junto al launcher;
- `runner-active.png`: pose dinámica usada en la portada del mundo;
- `robot-rock-reborn-cover.png`: portada de la primera ficha de juego;
- `pet-stickers-v6.webp`: hoja optimizada de cuatro stickers usada como sprite CSS.

La página abre con el mundo de juegos y presenta el contenido en este orden: `#games`, `#runner`,
`#launcher` y `#system`. El launcher es una herramienta opcional y aparece como un bloque compacto después
del catálogo y de la ficha del personaje.

La versión, el tamaño, el SHA-256 y la URL directa viven juntos al principio de `coldem.astro`:

```ts
const releaseVersion = '0.4.1';
const installerUrl = '...';
const installerSize = '26.9 MB';
const installerSha = '...';
```

Cuando publiques una nueva versión del launcher, actualiza esas cuatro constantes con los datos del
asset `.exe` de GitHub Releases. `launcherRepo` y `launcherReleases` controlan los enlaces secundarios
al código y a las notas de versión.

- `#games`: catálogo público. La primera ficha usa **Robot Rock Reborn 0.1.0** y enlaza a su Release;
- `#runner`: ficha de **The Runner**, el personaje nacido de la marca grafiti morada;
- `#launcher`: descarga opcional, pasos de instalación y datos del paquete;
- `#system`: principios del ecosistema Coldem.

Para añadir otro juego, duplica una ficha dentro de `.future-games` o crea otro bloque con la misma
estructura de `.featured-game`. Mantén el título, versión, plataforma, descripción y enlaces como texto
HTML editable. Las portadas no deberían contener información esencial que no se repita en el HTML.

`dancold-logo.png` ya no se usa como imagen principal, pero sigue siendo la referencia histórica de identidad.
Futuras ilustraciones de The Runner deberían conservar la cabeza rectangular violeta, los dos ojos negros
esféricos (uno grande y otro asomándose por el lateral), la boca blanca, la grieta angular y la ropa urbana
remendada. Los cuatro PNG `runner-*.png` son transparentes y se pueden reutilizar sobre otros fondos.

## 7. Cambiar los sprites noren

Home usa un GIF deliberadamente pequeño y limitado a 32 colores:

```text
src/assets/noren-retro-v3.gif    noren low-fi de la portada
```

La barra de título, dirección falsa, estado y textos del header están en
`src/components/Header.astro`. El componente detecta Home automáticamente y pasa `retro={true}` a
`NorenNav.astro`; no necesitas duplicar rutas ni navegación.

Links y About usan las dos imágenes de mayor detalle:

```text
src/assets/noren-fabric-v2.webp   textura repetible
src/assets/noren-rail-v2.webp     barra y cinco paneles transparentes
```

Sus tamaños, posición, interacción y vista móvil están en `src/styles/noren-component.css`. Si
reemplazas una imagen, conserva el mismo nombre para no tocar código. El GIF retro funciona mejor en
una proporción cercana a 3.7:1, con exactamente cinco paneles y fondo transparente. Los textos no
deben estar dibujados dentro del GIF: siguen siendo enlaces HTML editables y accesibles.

## 8. Escribir una nota

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

## 9. Cambiar colores y tipografía

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

## 10. Cambiar una página

Cada ruta pública corresponde a un archivo:

| URL | Archivo |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/blog/` | `src/pages/blog/index.astro` |
| `/archivist/` | `src/pages/archivist/index.astro` |
| `/gallery/` | redirección antigua hacia `/archivist/` |
| `/coldem/` | `src/pages/coldem.astro` |
| `/links/` | `src/pages/links.astro` |
| `/about/` | `src/pages/about.astro` |
| página inexistente | `src/pages/404.astro` |

En un archivo `.astro`, la parte entre `---` contiene imports y datos. El HTML está debajo. Los estilos
locales suelen estar al final dentro de `<style>`.

## 11. Publicar

El repositorio publica automáticamente con GitHub Actions cuando los cambios llegan a `main`.

Flujo recomendado:

1. Haz tus cambios en una rama.
2. Ejecuta `npm run build`.
3. Revisa la portada, The Chronicler, The Archivist y la vista móvil.
4. Sube la rama y abre un pull request.
5. Integra el pull request en `main`.
6. Comprueba la pestaña **Actions** y luego la web pública.

No edites `dist/`: esa carpeta se genera de nuevo en cada build y no se publica como código fuente.

## 12. Checklist antes de terminar

- [ ] Todo el texto público está en inglés.
- [ ] Los enlaces del menú funcionan desde la raíz de `https://dancold.quest/`.
- [ ] The Archivist se puede usar con mouse, touch y teclado.
- [ ] The Chronicler, The Archivist y Coldem no muestran la navegación noren del hub.
- [ ] El arte no contiene títulos que luego sean difíciles de editar.
- [ ] Las imágenes tienen texto alternativo útil o `alt=""` si son sólo decorativas.
- [ ] `npm run build` termina sin errores.
- [ ] No se añadieron `node_modules/`, `dist/` ni archivos privados al commit.
