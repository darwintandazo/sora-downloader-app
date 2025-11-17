import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio'; // Used to parse the HTML

/**
 * Este es el manejador de la API.
 * Vercel ejecutará esta función cada vez que alguien visite /api/getVideo
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 1. Asegurarnos de que sea una solicitud GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Obtener la URL de Sora que el frontend nos envió
  const { url } = req.query;

  // 3. Validar la URL
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is missing or invalid' });
  }

  // Validación simple para asegurar que es una URL
  try {
    new URL(url);
    // Opcional: Podrías verificar si el dominio es sora.chatgpt.com
    // if (!url.startsWith('https://sora.chatgpt.com/')) {
    //   return res.status(400).json({ error: 'Invalid domain. Only sora.chatgpt.com links are allowed.' });
    // }
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }


  try {
    // 4. El Servidor "visita" la página de Sora (Scraping)
    // Usamos fetch, que está disponible globalmente en Vercel
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // 5. Usar Cheerio para "cargar" el HTML y encontrar el video
    const $ = cheerio.load(html);

    // --- ¡ATENCIÓN! ESTA ES LA PARTE MÁS IMPORTANTE Y FRÁGIL ---
    // Este selector es solo un EJEMPLO. 
    // Tienes que "Inspeccionar Elemento" en la página real de Sora
    // para encontrar el selector CSS correcto que apunta al video.

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
      // ¡Éxito! Devolvemos la URL del .mp4 al frontend
      return res.status(200).json({ videoUrl: videoSrc });
    } else {
      // No encontramos el video
      return res.status(404).json({ error: 'Could not find a video source on the provided page.' });
    }

  } catch (error: any) {
    console.error('Error fetching or parsing page:', error);
    return res.status(500).json({ error: 'Failed to retrieve video details.', details: error.message });
  }
}