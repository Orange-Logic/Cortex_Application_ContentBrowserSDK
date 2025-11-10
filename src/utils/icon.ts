import { MediaType } from '@/types/search';

export const getMediaIcon = (type?: MediaType) => {
  switch (type) {
    case MediaType.Audio:
      return 'audio_file';
    case MediaType.Album:
      return 'album';
    case MediaType.Widget:
      return 'widgets';
    case MediaType.Multimedia:
      return 'perm_media';
    case MediaType.Story:
      return 'article';
    case MediaType.Video:
      return 'video_file';
    case MediaType.Image:
      return 'photo';
    default:
      return 'file';
  }
};
  
export const constructIconDataUrl = (svgString: string) => {
  const encoded = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
};