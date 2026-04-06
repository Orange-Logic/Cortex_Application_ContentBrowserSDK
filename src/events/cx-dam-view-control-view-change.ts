import { GridView } from '@/types/dam-view';

export type CxDamViewControlViewChangeEvent = CustomEvent<{
  isSeeThrough: boolean;
  view: GridView;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-control-view-change': CxDamViewControlViewChangeEvent;
  }
}
