# Changelog

## [Unreleased]

### Agregado
- **Artistas en canciones**: Se asignaron artistas a las 16 canciones de la playlist. Distribución: Tio Mati (5), Spinetta (2), Joan Manuel Serrat (2), John Lennon (2), Charly García (2), Mercedes Sosa (2), Bob Marley (1).
- **CHANGELOG.md**: Archivo de registro de cambios.

### Cambiado
- **Letras más gruesas**: Las letras de canciones en `LyricsView` ahora usan `font-medium` para una apariencia más legible y con mayor presencia visual (`src/components/LyricsView.tsx:108`).
- **Animación en botón ¡Empezar!**: El botón de la pantalla de inicio ahora tiene un efecto de respiración/`pulse-soft` (escala 1.0 → 1.04 → 1.0 cada 3s, infinito) que le da un sutil movimiento continuo sin ser invasivo (`src/components/SplashScreen.tsx:34`, `src/app/globals.css:125-136`).
- **Estilo del botón Mi Porfolio**: Mejorado con gradiente sutil en background, glow hover con sombra, y animación del icono SVG que se desplaza ligeramente a la derecha al hacer hover (`src/app/page.tsx:82-90`).
- **Fade-in en pantalla principal**: La página de inicio (`/`) ahora tiene un sutil `animate-fade-in` al cargar (`src/app/page.tsx:26`).
- **Premio por Completar Playlist**: Al escuchar el 90% de la duración de al menos 13 canciones (80% de 16 totales), se desbloquea un video sorpresa. Al terminar la canción que completa el requisito, aparece un modal con el mensaje "Felicitaciones! Por soportar tanta cultura musical, Perli te regala un video..." y un botón "Ver" que reproduce el video en un overlay. El premio se muestra una sola vez y queda persistido en localStorage (`src/context/PlayerContext.tsx`, `src/components/RewardModal.tsx`).
- **Fix flash de contenido antes del splash**: Se creó `SplashGuard` para ocultar los children con `opacity-0` mientras el splash está activo, evitando que se vea la playlist antes de que aparezca la pantalla de bienvenida (`src/components/SplashGuard.tsx`, `src/app/layout.tsx`).
- **Fotos Secretas: guardia de música**: Los taps sobre el cover solo activan fotos secretas si la canción está sonando. Si no hay música, aparece un overlay breve con el mensaje "Acá falta música!!!" durante 2 segundos (`src/app/player/[id]/page.tsx:32-40, 113-116`).
- **Fotos Secretas (Easter Egg)**: Al hacer tap 5 veces sobre el cover grande en la pantalla del reproductor, aparece una foto sorpresa de la carpeta `Secretos` con un magic chime generado por Web Audio API. La foto dura 5 segundos con una transición suave (crossfade) y luego vuelve el cover original. Las fotos no se repiten hasta agotar las 8, y luego el ciclo se reinicia. Si se cambia de canción, el contador de taps se resetea (`src/hooks/useSecretPhotos.ts`, `src/data/secretPhotos.ts`, `src/app/player/[id]/page.tsx:73-101`).

### Corregido
- **Error de React Hooks en build**: El `useState` de `showNoMusicMsg` estaba después de un early return (`if (!song)`), lo que violaba las Rules of Hooks. Se movió antes del early return para que se llame en el mismo orden siempre (`src/app/player/[id]/page.tsx`).
- **Artistas no se mostraban**: Las asignaciones de artistas a las canciones se habían perdido (nunca se commitearon). Se re-asignaron los nombres reales a las 16 canciones: Tio Mati (5), Spinetta (2), Joan Manuel Serrat (2), John Lennon (2), Charly García (2), Mercedes Sosa (2), Bob Marley (1) (`src/data/playlist.ts`).
- **Guard "Acá falta música!!!" en portfolio**: Se cambió de un mensaje temporal al tocar (setTimeout 2s) a un banner PERSISTENTE que aparece siempre que no haya música y queden fotos bloqueadas. El bloqueo de taps se mantiene: sin música, tocar fotos no hace nada (`src/app/portfolio/page.tsx`).
- **Fotos secretas con paths inválidos**: El archivo `secretPhotos.ts` contenía paths que no existen en disco (ej: `9.31.07 AM (2).jpeg`), causando que a veces la imagen no cargara y se mostrara rota. Se actualizaron los 13 paths correctos que existen en la carpeta `Secretos` (`src/data/secretPhotos.ts`).
- **generate-playlist.js sobreescribía artistas**: El script de prebuild hardcodeaba `artist: "Artista"` y regeneraba todo el `playlist.ts`, borrando cualquier asignación manual. Se agregó `loadExistingArtists()` que lee los artistas del archivo existente y los preserva en cada regeneración (`scripts/generate-playlist.js`).
- **Cover de Perlita Marchando**: Se reemplazó la imagen de portada de `Perlita Marchando` por `WhatsApp Image 2026-06-14 at 9.50.23 PM (1).jpeg` copiada desde la carpeta de fotos (`public/media/covers/Perlita Marchando.jpg`).
- **Auto-advance entre canciones**: Se agregó `key={state.currentSong.id}` al `<audio>` para que React monte un elemento nuevo por canción, evitando problemas de transición de `src`. Además, cuando `play()` falla (autoplay bloqueado o browser no listo), se reintenta al escuchar el evento `canplay` una sola vez (`src/context/PlayerContext.tsx`).
- **Fotos de portfolio sincronizadas**: Al eliminar fotos de `public/media/fotos`, el script `generatePhotos()` regenera `photos.ts` automáticamente en cada build. Sin acción manual necesaria.
