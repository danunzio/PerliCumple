# Changelog

## [Unreleased]

### Agregado
- **Artistas en canciones**: Se asignaron artistas a las 16 canciones de la playlist. Distribución: Tio Mati (5), Spinetta (2), Serrat (2), John Lennon (2), Charly García (2), Mercedes Sosa (2), Bob Marley (1).
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
