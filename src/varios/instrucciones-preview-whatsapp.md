# Cómo agregar la vista previa de WhatsApp a perli-cumple.vercel.app

## 1. Subí la imagen
Subí el archivo **`og-image.jpg`** (que te dejé adjunto, ya recortado en 1200x630 para que se vea bien en WhatsApp) a la carpeta `public/` de tu proyecto de Vercel.

Quedaría accesible en:
```
https://perli-cumple.vercel.app/og-image.jpg
```

## 2. Agregá estas etiquetas al `<head>` de tu página
Abrí el archivo principal de tu app (por ejemplo `index.html`, o `app/layout.tsx` / `_document.js` si usás Next.js) y pegá esto dentro del `<head>`:

```html
<!-- Vista previa para WhatsApp / redes sociales (Open Graph) -->
<meta property="og:title" content="Feliz Cumple Perlita 🎉" />
<meta property="og:description" content="Para celebrar los 3 años de Perlita!. Hecho con mucho amor!." />
<meta property="og:image" content="https://perli-cumple.vercel.app/og-image.jpg" />
<meta property="og:url" content="https://perli-cumple.vercel.app/" />
<meta property="og:type" content="website" />

<!-- Twitter Card (algunas apps usan esto también) -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Feliz Cumple Perlita 🎉" />
<meta name="twitter:description" content="Para celebrar los 3 años de Perlita!. Hecho con mucho amor!." />
<meta name="twitter:image" content="https://perli-cumple.vercel.app/og-image.jpg" />
```

## 3. Si usás Next.js (App Router)
En vez de las etiquetas HTML, podés definir esto en `app/layout.tsx` o `app/page.tsx`:

```tsx
export const metadata = {
  title: "Feliz Cumple Perlita 🎉",
  description: "Para celebrar los 3 años de Perlita!. Hecho con mucho amor!.",
  openGraph: {
    title: "Feliz Cumple Perlita 🎉",
    description: "Para celebrar los 3 años de Perlita!. Hecho con mucho amor!.",
    url: "https://perli-cumple.vercel.app/",
    images: ["https://perli-cumple.vercel.app/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Feliz Cumple Perlita 🎉",
    description: "Para celebrar los 3 años de Perlita!. Hecho con mucho amor!.",
    images: ["https://perli-cumple.vercel.app/og-image.jpg"],
  },
};
```

## 4. Hacé deploy
Subí los cambios (git push) y Vercel va a hacer el deploy automáticamente.

## 5. Probá la vista previa
WhatsApp guarda en caché las vistas previas, así que si ya compartiste el link antes, puede tardar en actualizarse. Para forzar la actualización:
- Probá compartirlo desde un chat nuevo o con otro contacto.
- O usá un "cache buster" agregando `?v=2` al final del link la primera vez: `https://perli-cumple.vercel.app/?v=2`
- También podés revisar cómo se ve con: https://www.opengraph.xyz/ (pegás tu URL y te muestra la preview)

¡Listo! Con eso debería verse igual que la imagen de ejemplo, pero con la foto y el mensaje de Perlita. 🎉
