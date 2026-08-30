export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Normalizes and optimizes external image URLs from Unsplash, Pexels, Imgur, Google Drive, Dropbox, etc.
 * Converts web page URLs (such as unsplash.com/photos/...) into direct, high-resolution CDN image URLs.
 */
export function normalizeImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim();

  // 1. Data URLs, local public paths, or blob URLs
  if (trimmed.startsWith('data:') || trimmed.startsWith('/') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // 2. Unsplash photo page or CDN URL with photo- ID or numeric timestamp ID
  const unsplashPhotoMatch = trimmed.match(
    /(?:images\.unsplash\.com|plus\.unsplash\.com|unsplash\.com)\/(?:photos\/)?(?:[a-zA-Z0-9_-]+-)?(premium_photo-\d+[a-zA-Z0-9_-]+|photo-\d+[a-zA-Z0-9_-]+|\d{10,}-[a-zA-Z0-9_-]+)/i
  );
  if (unsplashPhotoMatch && unsplashPhotoMatch[1]) {
    const photoId = unsplashPhotoMatch[1];
    if (photoId.startsWith('premium_photo-')) {
      return `https://plus.unsplash.com/${photoId}?auto=format&fit=crop&w=2560&q=85`;
    }
    const cleanId = photoId.startsWith('photo-') ? photoId : `photo-${photoId}`;
    return `https://images.unsplash.com/${cleanId}?auto=format&fit=crop&w=2560&q=85`;
  }

  // 3. Raw Unsplash ID pasted directly (e.g. photo-1506744038136-46273834b3fb or 1506744038136-46273834b3fb)
  const rawIdMatch = trimmed.match(/^(?:photo-)?(\d{10,}-[a-zA-Z0-9_-]+)$/i);
  if (rawIdMatch && rawIdMatch[1]) {
    return `https://images.unsplash.com/photo-${rawIdMatch[1]}?auto=format&fit=crop&w=2560&q=85`;
  }

  // 4. images.unsplash.com or plus.unsplash.com URLs without explicit photo- pattern (e.g. reserve / custom assets)
  if (trimmed.includes('images.unsplash.com') || trimmed.includes('plus.unsplash.com')) {
    try {
      const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      parsed.searchParams.set('auto', 'format');
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('w', '2560');
      parsed.searchParams.set('q', '85');
      return parsed.toString();
    } catch {
      return trimmed;
    }
  }

  // 5. Pexels page or photo URL
  const pexelsMatch = trimmed.match(/pexels\.com\/photo\/(?:[a-zA-Z0-9_-]+-)?(\d+)/i);
  if (pexelsMatch && pexelsMatch[1]) {
    return `https://images.pexels.com/photos/${pexelsMatch[1]}/pexels-photo-${pexelsMatch[1]}.jpeg?auto=compress&cs=tinysrgb&w=2560`;
  }
  if (trimmed.includes('images.pexels.com/photos/')) {
    try {
      const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      parsed.searchParams.set('auto', 'compress');
      parsed.searchParams.set('cs', 'tinysrgb');
      parsed.searchParams.set('w', '2560');
      return parsed.toString();
    } catch {
      return trimmed;
    }
  }

  // 6. Imgur page or image link
  const imgurMatch = trimmed.match(/imgur\.com\/(?:a\/|gallery\/)?([a-zA-Z0-9]{5,8})(?:\.[a-zA-Z]+)?$/i);
  if (imgurMatch && imgurMatch[1]) {
    return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
  }

  // 7. Google Drive share link
  const gdriveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (gdriveMatch && gdriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gdriveMatch[1]}`;
  }

  // 8. Dropbox share link
  if (trimmed.includes('dropbox.com')) {
    return trimmed.replace(/\?dl=0(&.*)?$/, '?raw=1$1').replace(/\?dl=1(&.*)?$/, '?raw=1$1');
  }

  // 9. Gyazo
  const gyazoMatch = trimmed.match(/gyazo\.com\/([a-zA-Z0-9]{32})/i);
  if (gyazoMatch && gyazoMatch[1]) {
    return `https://i.gyazo.com/${gyazoMatch[1]}.png`;
  }

  // 10. If missing protocol, prepend https:// if it looks like a domain
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && trimmed.includes('.')) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

