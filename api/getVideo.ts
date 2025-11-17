import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio'; 

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is missing or invalid' });
  }

  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // --- ¡COMIENZA LA ACTUALIZACIÓN! ---
  // Estos son los encabezados que simulan ser un navegador Chrome en Windows.
  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  };
  // --- FIN DE LA ACTUALIZACIÓN ---

  try {
    // 4. El Servidor "visita" la página de Sora (Scraping)
    const response = await fetch(url, {
        method: 'GET',
        headers: browserHeaders // <-- ¡AQUÍ AÑADIMOS LOS ENCABEZADOS!
    });

    if (!response.ok) {
      // Si nos vuelven a bloquear, esto lanzará el error 403 de nuevo
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // 5. Usar Cheerio para "cargar" el HTML y encontrar el video
    const $ = cheerio.load(html);

    let videoSrc: string | undefined;

    // Intento 1: Buscar una etiqueta <source> dentro de <video>
    videoSrc = $('video source[type="video/mp4"]').attr('src');

    // Intento 2: Si no se encuentra, buscar el atributo 'src' en la propia <video>
    if (!videoSrc) {
      videoSrc = $('video').attr('src');
    }
    
    // Intento 3: A veces está en un meta tag 'og:video'
    if (!videoSrc) {
      videoSrc = $('meta[property="og:video"]').attr('content');
    }

    // 6. Enviar la respuesta
    if (videoSrc) {
      return res.status(200).json({ videoUrl: videoSrc });
    } else {
      return res.status(404).json({ error: 'Could not find a video source on the provided page. (The page was loaded, but no video was found)' });
    }

  } catch (error: any) {
    console.error('Error fetching or parsing page:', error);
    // Este es el error que viste: "Failed to fetch page: 403 Forbidden"
    return res.status(500).json({ error: 'Failed to retrieve video details.', details: error.message });
  }
}