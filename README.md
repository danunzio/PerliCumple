# 🎉 Feliz Cumple Perlita

Reproductor musical estilo Spotify para celebrar los 3 años de Perlita.

## Stack

- Next.js 14 (App Router) + TypeScript + TailwindCSS
- Sin backend: todo desde `/public/media/`
- Playlist auto-generada desde los archivos en `public/media/audio/`

## Cómo correr

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Cómo agregar canciones

La playlist se genera automáticamente. Solo tirás los MP3 en `public/media/audio/` y listo.

### Estructura de carpetas

```
public/media/
├── audio/           ← acá van los MP3/WAV/OGG
├── covers/          ← portadas (auto-extraídas del MP3)
├── lyrics/          ← letras (JSON, opcional)
└── dedications/     ← dedicatorias (TXT, opcional)
```

### Portadas

Las imágenes se extraen **automáticamente** del metadata del MP3 (album art embebido). No necesitás hacer nada.

Si querés usar una imagen externa, poné un archivo con el mismo nombre en `public/media/covers/`:
```
public/media/audio/mi-cancion.mp3
public/media/covers/mi-cancion.jpg    ← sobreescribe la embebida
```

### Letras (opcional)

Archivo JSON en `public/media/lyrics/` con el mismo nombre:

```json
[
  { "time": 0, "text": "Primera línea" },
  { "time": 8, "text": "Segunda línea" }
]
```

### Dedicatorias (opcional)

Archivo `.txt` en `public/media/dedications/` con el mismo nombre.

## Personalización

Editá `src/data/playlist.ts` después de generarlo para cambiar:

- `title`: título de la canción
- `artist`: nombre del artista
- `accentColor`: color hex del acento (ej: `#FF69B4`)

**Nota:** `npm run dev` y `npm run build` regeneran la playlist automáticamente.

## Deploy en Vercel

Conectá el repo a Vercel o arrastrá la carpeta del proyecto a vercel.com.

Hecho con ❤️ para Perlita
