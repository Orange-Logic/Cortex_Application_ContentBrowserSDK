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
    default:
      return 'file';
  }
};