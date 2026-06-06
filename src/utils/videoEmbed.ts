export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname.includes('youtube.com')) {
      videoId = parsed.searchParams.get('v');
    } else if (parsed.hostname === 'youtu.be') {
      videoId = parsed.pathname.replace(/^\//, '').split('/')[0] ?? null;
    }

    if (!videoId) return null;

    const params = new URLSearchParams({
      modestbranding: '1',
      rel: '0',
      iv_load_policy: '3',
    });

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  } catch {
    return null;
  }
}

export function isDirectVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

export function getInlineVideoSrc(url: string): { type: 'embed'; src: string } | { type: 'direct'; src: string } | null {
  const youtube = getYouTubeEmbedUrl(url);
  if (youtube) return { type: 'embed', src: youtube };
  if (isDirectVideoUrl(url)) return { type: 'direct', src: url };
  return null;
}
