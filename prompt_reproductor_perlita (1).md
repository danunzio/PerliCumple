# Prompt para generar la app "Reproductor Cumple de Perlita"

Copiá y pegá todo el bloque de abajo en tu IDE de AI (Cursor, v0, Bolt, etc.). Está pensado como una sola instrucción completa.

---

## PROMPT

Quiero que crees una aplicación web (mobile-first, tipo single page app) que funcione como un reproductor de música similar a Spotify, para compartir vía link como regalo de cumpleaños número 3 de "Perlita". El resultado debe verse y comportarse como una mini app de Spotify en celular, pero simplificada y con un toque festivo de cumpleaños.

### Stack técnico
- Next.js (App Router) con TailwindCSS para los estilos.
- Todo en un solo proyecto, sin backend ni base de datos: los archivos de audio, imágenes, gifs y videos se cargan desde una carpeta local `/public/media`.
- Usar componentes de cliente ("use client") para todo lo relacionado al reproductor (audio, estado de reproducción, etc.).
- La app debe poder desplegarse fácilmente en Vercel para compartir el link.

### Estructura de datos
Crear un archivo `playlist.json` (o un array en TypeScript) con la lista de canciones. Cada canción tiene:
```json
{
  "id": "01",
  "title": "Acá Tá",
  "artist": "Canticuénticos",
  "audioSrc": "/media/audio/aca-ta.mp3",
  "coverType": "image", // puede ser "image" | "gif" | "video"
  "coverSrc": "/media/covers/aca-ta.jpg",
  "duration": 180, // en segundos (o se puede calcular del audio)
  "lyrics": [
    { "time": 0, "text": "¿Dónde están los pies?, acá tá" },
    { "time": 8, "text": "¿Dónde está escondido ese sonido que no se ve?" },
    { "time": 16, "text": "¿Quién es el que canta?, acá tá, acá tá" }
  ],
  "dedication": "" // mensaje opcional dedicado para esta canción
}
```
- `lyrics` es un array de líneas con un timestamp (`time`, en segundos) y el texto (`text`). Esto permite resaltar la línea actual mientras suena la canción, como en Spotify.
- Si una canción no tiene letras, el array puede ir vacío y la pantalla de letras debe mostrar un mensaje tipo "Sin letras disponibles".
- `coverType` define qué se muestra en el reproductor mientras suena la canción:
  - `image`: foto fija del álbum (jpg/png).
  - `gif`: gif animado en loop.
  - `video`: video corto (4 segundos) en loop, sin sonido (mute), tipo `mp4` o `webm`, que se reproduce automáticamente mientras la canción está sonando y se pausa cuando la canción está pausada.
- Dejar la playlist con 8-10 canciones de ejemplo (placeholders) para que yo después reemplace audio/cover por las canciones reales de Perlita.

### Pantallas / Vistas
1. **Pantalla principal (Home / Playlist)**
   - Header con título "Feliz Cumple Perlita 🎉" (o similar, personalizable), y un ícono o foto decorativa.
   - Lista de canciones tipo lista de Spotify: portada chica, título, artista. Al tocar una canción, se abre el reproductor.
   - Diseño oscuro (dark theme) con acentos de color festivo (rosa/violeta/dorado, a elección, que después pueda cambiar fácilmente vía variables de Tailwind).

2. **Pantalla de reproductor (Now Playing)**
   - Ocupa toda la pantalla (mobile full screen), con botón de "volver" arriba.
   - Área principal con el cover de la canción:
     - Si `coverType` es `image` o `gif`: se muestra como imagen/gif a pantalla, con bordes redondeados, ocupando la mayor parte del espacio (similar a la portada del álbum en Spotify).
     - Si `coverType` es `video`: se reproduce el video en loop (4 segundos), sin sonido, sincronizado con el estado de reproducción (play/pause) de la canción.
   - Debajo del cover: título de la canción y artista.
   - Barra de progreso (seek bar):
     - Muestra el tiempo transcurrido y el tiempo total (formato mm:ss).
     - Debe ser interactiva: el usuario puede arrastrar o tocar la barra para saltar a cualquier punto de la canción (seek).
   - Controles principales:
     - Botón "anterior" (canción previa en la playlist).
     - Botón "play/pause" grande, central.
     - Botón "siguiente" (canción siguiente en la playlist).
   - Opcionales (si es fácil de implementar): botón de shuffle y botón de repeat, con estilo similar al de Spotify (íconos verdes/activos cuando están encendidos).
   - Al terminar una canción, debe pasar automáticamente a la siguiente de la playlist.

3. **Pantalla de letras (Lyrics view)**
   - Accesible desde la pantalla "Now Playing" (por ejemplo, deslizando hacia arriba o tocando un ícono/botón "Letras").
   - Fondo de color sólido o degradado (puede tomar un color dominante del cover, o un color fijo del tema festivo).
   - Header con el título de la canción y el artista (igual que en la captura de referencia).
   - Lista de líneas de la letra, centradas o alineadas a la izquierda, con scroll vertical.
   - La línea correspondiente al tiempo actual de reproducción debe resaltarse (texto en blanco/más grande/más opaco que el resto), y el resto de las líneas se ven más atenuadas (gris claro), tal como en Spotify.
   - El scroll debe seguir automáticamente la línea activa (auto-scroll), pero el usuario puede scrollear manualmente sin que se "trabe".
   - Reutilizar la misma barra de progreso y controles de play/pause/anterior/siguiente abajo de la pantalla (igual que en la captura).
   - Botón para volver a la vista de cover (Now Playing) y botón de compartir (puede no tener funcionalidad real, solo visual).

### Comportamiento del reproductor
- Usar el elemento `<audio>` de HTML5 para reproducir el audio.
- El estado global del reproductor (canción actual, si está en play o pause, tiempo actual) debe manejarse con un contexto de React o un store simple (Zustand o useState + Context), de forma que se mantenga consistente entre la vista de lista y la vista "Now Playing".
- Si el usuario navega a la lista de canciones mientras hay una reproduciéndose, debe verse una mini barra de reproducción fija abajo (mini player), similar a la de Spotify, con: cover chico, título, botón play/pause, y al tocarla se abre la pantalla completa del reproductor.
- Importante: los navegadores móviles bloquean el autoplay de audio con sonido hasta que el usuario interactúa con la página (tocar un botón). Por eso, la reproducción solo debe iniciar cuando el usuario toca play por primera vez (no intentar reproducir automáticamente al cargar la app).
- Sincronizar la letra resaltada con el audio usando el evento `timeupdate` del elemento `<audio>`, comparando `currentTime` con los `time` de cada línea de `lyrics`.

### Estilo visual / UI
- Inspirado en la interfaz móvil de Spotify (adjunto capturas de referencia): fondo oscuro casi negro, tipografía blanca/gris clara, tarjetas grandes con bordes redondeados, controles centrados y grandes para fácil uso táctil.
- Paleta festiva por defecto: en la pantalla principal (Home / Playlist) y como color de respaldo general, usar tonos cálidos/festivos (por ejemplo, degradados de rosa, naranja o violeta) en los acentos, botones activos y barra de progreso, en lugar del verde típico de Spotify.
- Tema de color dinámico por canción (aplica a "Now Playing" y "Letras"): el color de acento de esas pantallas (fondo degradado, barra de progreso, botón de play, resaltado de la línea activa, mini player) debe adaptarse al color dominante del cover de la canción que está sonando, tomando la paleta festiva como color de respaldo si la extracción falla.
  - Implementación sugerida: usar una librería como `color-thief-react`, `colorthief` o `node-vibrant` para extraer el color dominante (o una paleta de 2-3 colores) de la imagen/cover de cada canción.
  - Si `coverType` es `video` o `gif`, se puede extraer el color del primer frame, o definir manualmente un color de respaldo (`accentColor`) en `playlist.json` para esos casos, ya que extraer color de un video/gif es más complejo.
  - El fondo de la pantalla "Now Playing" y "Letras" debe usar un degradado suave que vaya desde el color dominante (arriba) hacia el negro/gris oscuro (abajo), igual al estilo de Spotify.
  - La transición de un color a otro al cambiar de canción debe ser animada (fade/transition de 400-600ms) para que no se sienta abrupta.
  - Si el color extraído es muy claro u oscuro (poco contraste con el texto blanco), aplicar un ajuste automático de brillo/saturación para garantizar legibilidad del texto y los íconos.
  - Agregar el campo opcional `accentColor` (hex) en cada canción dentro de `playlist.json`, como color de respaldo manual por si la extracción automática no da buenos resultados.
- Tipografía grande y legible, pensada para celulares (viewport ~375-420px de ancho).
- Animaciones suaves (transiciones de 200-300ms) al cambiar de canción, abrir el reproductor, o al iniciar el video/gif de portada.
- Optimizar el peso de los archivos multimedia (especialmente gifs y videos) para que carguen rápido en conexiones móviles: usar `loading="lazy"` en imágenes/gifs que no están en pantalla, y comprimir los videos cortos (mp4/webm) lo más posible sin perder calidad visual.

### Extras (si es posible sin mucha complejidad)
- Mensaje o pantalla de bienvenida inicial (splash) con un saludo de cumpleaños personalizado antes de entrar a la playlist.
- Posibilidad de poner un mensaje/dedicatoria de texto corto que se muestre en la pantalla "Now Playing" de alguna canción especial (campo `dedication` en la playlist), debajo del título o como overlay sobre el cover.
- Botón de "me gusta" (corazón) en cada canción, solo visual/local (guardado en localStorage), para que Perlita pueda "marcar" sus favoritas.
- Cola de reproducción ("Up Next"): una vista o panel deslizable que muestra el resto de las canciones de la playlist, con opción de tocar para saltar a esa canción.
- Confeti o animación festiva (con `canvas-confetti` o similar) que se dispare al abrir la app o al tocar una canción especial (por ejemplo, la primera de la lista, pensada como "canción de cumpleaños").
- Modo "regalo": una pantalla previa, antes de entrar al reproductor, con un sobre o tarjeta animada que el usuario "abre" tocando, revelando el mensaje de cumpleaños y dando paso a la playlist.
- PWA (Progressive Web App): permitir "instalar" la app en la pantalla de inicio del celular, para que se sienta como una app real.
- Generar un QR code con el link de la app, para imprimir o compartir en una invitación física.

### Entregable
- Código completo y funcional, listo para correr con `npm install && npm run dev`.
- Estructura de carpetas clara, especialmente `/public/media/audio`, `/public/media/covers` (para imágenes), `/public/media/gifs` y `/public/media/videos`, para que yo pueda reemplazar los archivos de ejemplo por los reales fácilmente.
- Instrucciones breves en un README sobre cómo agregar nuevas canciones a `playlist.json` y dónde colocar los archivos multimedia.

---

### Notas para vos (no incluir en el prompt si no querés)
- Cuando tengas el proyecto generado, lo que vas a tener que hacer es reemplazar los archivos de `/public/media` por los audios/covers/gifs/videos reales de Perlita, y editar `playlist.json` con los títulos correctos.
- Para compartir el link, podés desplegarlo gratis en Vercel conectando el repositorio o arrastrando la carpeta del proyecto.
