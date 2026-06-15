const fs = require("fs");
const path = require("path");

const FOTOS_DIR = path.join(__dirname, "..", "public", "media", "fotos");
const AUDIO_DIR = path.join(__dirname, "..", "public", "media", "audio");
const COVERS_DIR = path.join(__dirname, "..", "public", "media", "covers");
const GIFS_DIR = path.join(__dirname, "..", "public", "media", "gifs");
const LYRICS_DIR = path.join(__dirname, "..", "public", "media", "lyrics");
const DEDICATIONS_DIR = path.join(
  __dirname,
  "..",
  "public",
  "media",
  "dedications"
);
const OUTPUT = path.join(__dirname, "..", "src", "data", "playlist.ts");
const PHOTOS_OUTPUT = path.join(__dirname, "..", "src", "data", "photos.ts");

const AUDIO_EXTS = [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac"];
const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".svg", ".webp"];
const GIF_EXTS = [".gif"];

function loadExistingArtists() {
  try {
    if (!fs.existsSync(OUTPUT)) return [];
    const content = fs.readFileSync(OUTPUT, "utf-8");
    const matches = content.match(/"artist":\s*"([^"]+)"/g);
    if (!matches) return [];
    return matches.map((m) => m.replace(/"artist":\s*"([^"]+)"/, "$1"));
  } catch {
    return [];
  }
}

function getBaseName(filename) {
  return path.parse(filename).name;
}

function findFile(dir, baseName, extensions) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const ext of extensions) {
    const match = files.find(
      (f) => getBaseName(f) === baseName && f.toLowerCase().endsWith(ext)
    );
    if (match) return path.join(dir, match);
  }
  return null;
}

function findExternalCover(baseName) {
  const img = findFile(COVERS_DIR, baseName, IMAGE_EXTS);
  if (img) return { src: `/media/covers/${path.basename(img)}`, type: "image" };
  const gif = findFile(GIFS_DIR, baseName, GIF_EXTS);
  if (gif) return { src: `/media/gifs/${path.basename(gif)}`, type: "gif" };
  return null;
}

function findLyrics(baseName) {
  const file = findFile(LYRICS_DIR, baseName, [".txt", ".md"]);
  if (!file) return "";
  return fs.readFileSync(file, "utf-8").trim();
}

function findDedication(baseName) {
  const file = findFile(DEDICATIONS_DIR, baseName, [".txt", ".md"]);
  if (!file) return "";
  return fs.readFileSync(file, "utf-8").trim();
}

function getAccentColor(baseName, index) {
  const colors = [
    "#FF69B4",
    "#4CAF50",
    "#FFD700",
    "#9C27B0",
    "#2196F3",
    "#E91E63",
    "#FF5722",
    "#00BCD4",
    "#FFC107",
    "#FF9800",
  ];
  return colors[index % colors.length];
}

function formatTitle(baseName) {
  return baseName
    .replace(/\s*-\s*/g, " ")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getExtensionFromMime(mime) {
  const map = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
  };
  return map[mime] || ".jpg";
}

async function parseAudioFile(audioPath, baseName) {
  const mm = await import("music-metadata");
  try {
    const metadata = await mm.parseFile(audioPath, { duration: true });
    const duration = metadata.format.duration
      ? Math.round(metadata.format.duration)
      : 0;

    let cover = null;
    const pictures = metadata.common.picture;
    if (pictures && pictures.length > 0) {
      const pic = pictures[0];
      const ext = getExtensionFromMime(pic.format);
      const coverPath = path.join(COVERS_DIR, `${baseName}${ext}`);
      fs.writeFileSync(coverPath, pic.data);
      cover = { src: `/media/covers/${baseName}${ext}`, type: "image" };
    }

    return { cover, duration };
  } catch (err) {
    console.warn(`  Warning: could not read metadata from ${baseName}: ${err.message}`);
  }
  return { cover: null, duration: 0 };
}

async function generate() {
  if (!fs.existsSync(AUDIO_DIR)) {
    console.log("No audio directory found. Generating empty playlist.");
  }

  const audioFiles = fs.existsSync(AUDIO_DIR)
    ? fs
        .readdirSync(AUDIO_DIR)
        .filter((f) =>
          AUDIO_EXTS.some((ext) => f.toLowerCase().endsWith(ext))
        )
        .sort()
    : [];

  if (audioFiles.length === 0) {
    console.log("No audio files found. Playlist will be empty.");
  } else {
    console.log(`Found ${audioFiles.length} audio file(s):`);
    audioFiles.forEach((f) => console.log(`  - ${f}`));
  }

  // Ensure covers directory exists
  if (!fs.existsSync(COVERS_DIR)) {
    fs.mkdirSync(COVERS_DIR, { recursive: true });
  }

  const songs = [];
  const existingArtists = loadExistingArtists();

  for (let idx = 0; idx < audioFiles.length; idx++) {
    const file = audioFiles[idx];
    const baseName = getBaseName(file);
    const id = String(idx + 1).padStart(2, "0");
    const title = formatTitle(baseName);
    const accentColor = getAccentColor(baseName, idx);
    const artist = existingArtists[idx] || "Artista";

    console.log(`\nProcessing: ${file}`);

    let cover = findExternalCover(baseName);
    let duration = 0;

    // 2. If no external cover, extract from MP3 metadata
    if (!cover) {
      console.log(`  No external cover found, extracting from audio...`);
      const audioPath = path.join(AUDIO_DIR, file);
      const parsed = await parseAudioFile(audioPath, baseName);
      cover = parsed.cover;
      duration = parsed.duration;
      if (cover) {
        console.log(`  ✓ Embedded cover extracted`);
      } else {
        console.log(`  No embedded cover found, using placeholder`);
        cover = { src: `/media/covers/placeholder.svg`, type: "image" };
      }
      if (duration > 0) {
        console.log(`  ✓ Duration: ${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")}`);
      }
    } else {
      console.log(`  ✓ External cover found: ${path.basename(cover.src)}`);
      // Still parse for duration
      const audioPath = path.join(AUDIO_DIR, file);
      const parsed = await parseAudioFile(audioPath, baseName);
      duration = parsed.duration;
      if (duration > 0) {
        console.log(`  ✓ Duration: ${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")}`);
      }
    }

    const lyrics = findLyrics(baseName);
    const dedication = findDedication(baseName);

    if (lyrics.length > 0) console.log(`  ✓ Lyrics loaded (${lyrics.split("\n").filter(l => l.trim().length > 0).length} lines)`);
    if (dedication) console.log(`  ✓ Dedication loaded`);

    songs.push({
      id,
      title,
      artist,
      audioSrc: `/media/audio/${file}`,
      coverType: cover.type,
      coverSrc: cover.src,
      duration,
      lyrics,
      dedication,
      accentColor,
    });
  }

  const output = `import { Song } from "@/types";

export const playlist: Song[] = ${JSON.stringify(songs, null, 2)};
`;

  fs.writeFileSync(OUTPUT, output, "utf-8");
  console.log(`\nPlaylist generated: ${OUTPUT}`);

  generatePhotos();
}

function generatePhotos() {
  const FOTO_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  const fotoFiles = fs.existsSync(FOTOS_DIR)
    ? fs
        .readdirSync(FOTOS_DIR)
        .filter((f) => FOTO_EXTS.some((ext) => f.toLowerCase().endsWith(ext)))
        .sort()
    : [];

  const paths = fotoFiles.map((f) => `/media/fotos/${f}`);

  const output = `export const photos: string[] = ${JSON.stringify(paths, null, 2)};\n`;

  fs.writeFileSync(PHOTOS_OUTPUT, output, "utf-8");
  console.log(`Photos generated: ${PHOTOS_OUTPUT} (${fotoFiles.length} photos)`);
}

generate();
