# Reproductor Cumple de Perlita — Design Doc

## Goal
Single-page web app (mobile-first) resembling Spotify, as a birthday gift for Perlita's 3rd birthday. Playlist of ~8 songs with audio, cover art, synchronized lyrics, and festive dark theme.

## Stack
- Next.js 14+ (App Router) + TypeScript + TailwindCSS
- No backend: audio/covers/gifs from `/public/media`
- State: `useContext` + `useReducer`
- Deploy: Vercel

## Routes
| Route | Page | Description |
|---|---|---|
| `/` | HomePage | Playlist + splash overlay + mini player |
| `/player/[id]` | NowPlayingPage | Full-screen player + lyrics toggle |

## Component Tree
```
Layout (root)
├── PlayerProvider (context)
│   ├── SplashScreen (overlay on /, dismiss once)
│   ├── HomePage
│   │   ├── SongItem[] (cover, title, artist)
│   │   └── MiniPlayer (fixed bottom if playing)
│   └── NowPlayingPage
│       ├── Cover (image/gif full screen)
│       ├── SongInfo (title, artist, dedication)
│       ├── ProgressBar (seekable)
│       ├── PlayerControls (prev, play/pause, next, shuffle, repeat)
│       └── LyricsView (overlay, synced auto-scroll)
```

## State (PlayerContext)
```
currentSong, isPlaying, currentTime, duration
queue, queueIndex, isShuffled, repeatMode
showSplash, showLyrics
```

## Data Flow
1. User taps song → dispatch PLAY_SONG → audio.play()
2. `timeupdate` → dispatch SET_PROGRESS → UI updates (seekbar, lyrics highlight)
3. Song ends → auto NEXT or repeat
4. Navigate away → MiniPlayer persists playback

## Design Decisions
- Colors: manual `accentColor` per song in playlist.json (no auto-extraction)
- coverType: image/gif only (no video)
- Extras (v2): PWA, QR, confetti, favorites, gift mode
