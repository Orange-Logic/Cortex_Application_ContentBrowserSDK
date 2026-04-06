import { GetAssetsRequest } from '@/types/asset';
import { GridView } from '@/types/dam-view';

export type CxDamViewRequestChangeEvent = CustomEvent<{
  request: GetAssetsRequest | null;
  view: GridView;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-request-change': CxDamViewRequestChangeEvent;
  }
}
