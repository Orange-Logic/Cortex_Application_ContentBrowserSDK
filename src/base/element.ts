import { LitElement, PropertyDeclaration, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

// Match event type name strings that are registered on GlobalEventHandlersEventMap...
type EventTypeRequiresDetail<T> = T extends keyof GlobalEventHandlersEventMap
  ? // ...where the event detail is an object...
    GlobalEventHandlersEventMap[T] extends CustomEvent<
      Record<PropertyKey, unknown>
    >
    ? // ...that is non-empty...
      GlobalEventHandlersEventMap[T] extends CustomEvent<
        Record<PropertyKey, never>
      >
      ? never
      : // ...and has at least one non-optional property
        Partial<
            GlobalEventHandlersEventMap[T]['detail']
          > extends GlobalEventHandlersEventMap[T]['detail']
        ? never
        : T
    : never
  : never;

// The inverse of the above (match any type that doesn't match EventTypeRequiresDetail)
type EventTypeDoesNotRequireDetail<T> =
  T extends keyof GlobalEventHandlersEventMap
    ? GlobalEventHandlersEventMap[T] extends CustomEvent<
        Record<PropertyKey, unknown>
      >
      ? GlobalEventHandlersEventMap[T] extends CustomEvent<
          Record<PropertyKey, never>
        >
        ? T
        : Partial<
              GlobalEventHandlersEventMap[T]['detail']
            > extends GlobalEventHandlersEventMap[T]['detail']
          ? T
          : never
      : T
    : T;

// `keyof EventTypesWithRequiredDetail` lists all registered event types that require detail
type EventTypesWithRequiredDetail = {
  [EventType in keyof GlobalEventHandlersEventMap as EventTypeRequiresDetail<EventType>]: true;
};

// `keyof EventTypesWithoutRequiredDetail` lists all registered event types that do NOT require detail
type EventTypesWithoutRequiredDetail = {
  [EventType in keyof GlobalEventHandlersEventMap as EventTypeDoesNotRequireDetail<EventType>]: true;
};

// Helper to make a specific property of an object non-optional
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Given an event name string, get a valid type for the options to initialize the event that is more restrictive than
// just CustomEventInit when appropriate (validate the type of the event detail, and require it to be provided if the
// event requires it)
type CxEventInit<T> = T extends keyof GlobalEventHandlersEventMap
  ? GlobalEventHandlersEventMap[T] extends CustomEvent<
      Record<PropertyKey, unknown>
    >
    ? GlobalEventHandlersEventMap[T] extends CustomEvent<
        Record<PropertyKey, never>
      >
      ? CustomEventInit<GlobalEventHandlersEventMap[T]['detail']>
      : Partial<
            GlobalEventHandlersEventMap[T]['detail']
          > extends GlobalEventHandlersEventMap[T]['detail']
        ? CustomEventInit<GlobalEventHandlersEventMap[T]['detail']>
        : WithRequired<
            CustomEventInit<GlobalEventHandlersEventMap[T]['detail']>,
            'detail'
          >
    : CustomEventInit
  : CustomEventInit;

// Given an event name string, get the type of the event
type GetCustomEventType<T> = T extends keyof GlobalEventHandlersEventMap
  ? GlobalEventHandlersEventMap[T] extends CustomEvent<unknown>
    ? GlobalEventHandlersEventMap[T]
    : CustomEvent<unknown>
  : CustomEvent<unknown>;

// `keyof ValidEventTypeMap` is equivalent to `keyof GlobalEventHandlersEventMap` but gives a nicer error message
type ValidEventTypeMap =
  | EventTypesWithRequiredDetail
  | EventTypesWithoutRequiredDetail;

export default class CortexElement extends LitElement {
  // Make localization attributes reactive
  // eslint-disable-next-line lit/no-native-attributes
  @property() dir: string;

  // eslint-disable-next-line lit/no-native-attributes
  @property() lang: string;

  @property() theme: 'light' | 'dark' = 'light';

  @property({ attribute: 'pre-render', type: Boolean })
  preRender: boolean = false;

  /** Emits a custom event with more convenient defaults. */
  emit<T extends string & keyof EventTypesWithoutRequiredDetail>(
    name: EventTypeDoesNotRequireDetail<T>,
    options?: CxEventInit<T> | undefined,
  ): GetCustomEventType<T>;
  emit<T extends string & keyof EventTypesWithRequiredDetail>(
    name: EventTypeRequiresDetail<T>,
    options: CxEventInit<T>,
  ): GetCustomEventType<T>;
  emit<T extends string & keyof ValidEventTypeMap>(
    name: T,
    options?: CxEventInit<T> | undefined,
  ): GetCustomEventType<T> {
    const event = new CustomEvent(name, {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {},
      ...options,
    });

    this.dispatchEvent(event);

    return event as GetCustomEventType<T>;
  }

  static version = '1';

  static define(
    name: string,
    elementConstructor = this,
    options: ElementDefinitionOptions = {},
  ) {
    const currentlyRegisteredConstructor = customElements.get(name) as
      | CustomElementConstructor
      | typeof CortexElement;

    if (!currentlyRegisteredConstructor) {
      // We try to register as the actual class first. If for some reason that fails, we fall back to anonymous classes.
      // customElements can only have 1 class of the same "object id" per registry, so that is why the try {} catch {} exists.
      // Some tools like Jest Snapshots and if you import the constructor and call `new SlButton()` they will fail with
      //   the anonymous class version.
      try {
        customElements.define(name, elementConstructor, options);
      } catch (error) {
        customElements.define(
          name,
          class extends elementConstructor {},
          options,
        );
      }

      return;
    }

    let newVersion = ' (unknown version)';
    let existingVersion = newVersion;

    if ('version' in elementConstructor && elementConstructor.version) {
      newVersion = ' v' + elementConstructor.version;
    }

    if (
      'version' in currentlyRegisteredConstructor &&
      currentlyRegisteredConstructor.version
    ) {
      existingVersion = ' v' + currentlyRegisteredConstructor.version;
    }

    // Need to make sure we're not working with null or empty strings before doing version comparisons.
    if (newVersion && existingVersion && newVersion === existingVersion) {
      // If versions match, we don't need to warn anyone. Carry on.
      return;
    }

    // eslint-disable-next-line no-console
    console.warn(
      `Attempted to register <${name}>${newVersion}, but <${name}>${existingVersion} has already been registered.`,
    );
  }

  static dependencies: Record<string, CustomElementConstructor> = {};

  static createProperty(
    name: PropertyKey,
    options?: PropertyDeclaration,
  ): void {
    super.createProperty(name, options);

    if (
      options?.attribute &&
      typeof options.attribute === 'string' &&
      !Object.prototype.hasOwnProperty.call(
        this.prototype,
        options.attribute,
      ) &&
      Object.prototype.hasOwnProperty.call(this.prototype, name)
    ) {
      Object.defineProperty(this.prototype, options.attribute, {
        get() {
          return this[name];
        },
        set(v) {
          this[name] = v;
        },
      });
    }
  }

  constructor() {
    super();
    Object.entries(
      (this.constructor as typeof CortexElement).dependencies,
    ).forEach(([name, component]) => {
      (this.constructor as typeof CortexElement).define(name, component as any);
    });

    this.handleThemeChange = this.handleThemeChange.bind(this);
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    if (this.preRender) {
      return;
    }

    this.runFirstUpdated(_changedProperties);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected runFirstUpdated(_changedProperties: PropertyValues) {
    /**
     * Do nothing by default.
     */
  }


  protected connectedUpdatedCallback() {
    /**
      * Do nothing by default.
    */
  }

  protected runConnectedCallback() {
    /**
      * Do nothing by default.
    */
  }

  adoptedCallback() {
    rescueElementPrototype(this);
  }

  connectedCallback() {
    super.connectedCallback();

    if ('addEventListener' in globalThis) {
      globalThis.addEventListener('cx-theme-change', this.handleThemeChange);
    }

    if (this.preRender) {
      return;
    }

    this.runConnectedCallback();

    this.updateComplete.then(() => {
      this.connectedUpdatedCallback();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if ('removeEventListener' in globalThis) {
      globalThis.removeEventListener('cx-theme-change', this.handleThemeChange);
    }

    rescueElementPrototype(this);
  }

  private handleThemeChange(event: CustomEvent) {
    this.theme = event.detail.theme;
  }

  getTheme() {
    if ('getComputedStyle' in globalThis) {
      const computedStyle = getComputedStyle(
        globalThis.document.documentElement,
      );

      return computedStyle?.colorScheme === 'dark' ? 'dark' : 'light';
    }

    return 'light';
  }

  getState<K extends keyof this>(key: string): this[K] {
    return this[key as unknown as K];
  }
}

/**
 * https://jakearchibald.com/2025/firefox-custom-elements-iframes-bug/
 */
function rescueElementPrototype(element: HTMLElement) {
  /**
   * Return if everything looks as expected.
   */
  if (element instanceof CortexElement) {
    return;
  }

  const tagName = element.localName || element.tagName;
  /**
   * Otherwise, get the intended constructor…
   */
  const constructor = customElements.get(tagName.toLowerCase());

  /**
   * …and set the prototype.
   */
  if (constructor) {
    Object.setPrototypeOf(element, constructor.prototype);
  }
}