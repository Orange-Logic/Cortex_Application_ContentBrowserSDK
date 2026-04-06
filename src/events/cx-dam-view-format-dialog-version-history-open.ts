export type CxDamViewFormatDialogVersionHistoryOpenEvent = CustomEvent<{
  assetId: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-format-dialog-version-history-open': CxDamViewFormatDialogVersionHistoryOpenEvent;
  }
}
