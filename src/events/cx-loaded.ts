export type CxLoadedEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-loaded': CxLoadedEvent;
  }
}
