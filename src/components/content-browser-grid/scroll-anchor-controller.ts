import type { ReactiveController, ReactiveControllerHost } from 'lit';

type ScrollAnchor = {
  id: string;
  offset: number;
};

type ScrollAnchorElement = HTMLElement & {
  assetId?: string;
};

type ScrollAnchorLayoutSource = {
  layoutComplete?: Promise<unknown>;
};

type ScrollAnchorContainer = HTMLElement & ScrollAnchorLayoutSource;

type ScrollAnchorControllerOptions = {
  getContainer: () => ScrollAnchorContainer | undefined;
  /**
   * Distance from the scroller's content origin down to the top of row 0 -- the height of whatever
   * leads the content, such as a sticky header. Defaults to 0: the rows start at the origin.
   */
  getContentOffset?: () => number;
  getItemIndexById: (id: string) => number;
  /**
   * The object whose `layoutComplete` a restore waits on. Defaults to the container, which carries
   * it when the virtualizer is itself the scroller.
   */
  getLayoutSource?: () => ScrollAnchorLayoutSource | undefined;
  itemSelector: string;
};

export default class ScrollAnchorController implements ReactiveController {
  readonly #host: ReactiveControllerHost & {
    updateComplete: Promise<unknown>;
  };

  readonly #getContainer: ScrollAnchorControllerOptions['getContainer'];

  readonly #getContentOffset: () => number;

  readonly #getItemIndexById: ScrollAnchorControllerOptions['getItemIndexById'];

  readonly #getLayoutSource: () => ScrollAnchorLayoutSource | undefined;

  readonly #itemSelector: string;

  #anchor: ScrollAnchor | null = null;

  #columnCount = 0;

  #itemHeight = 0;

  #pendingRestoreFrames: number[] = [];

  #restoreSequence = 0;

  constructor(
    host: ReactiveControllerHost & {
      updateComplete: Promise<unknown>;
    },
    options: ScrollAnchorControllerOptions,
  ) {
    this.#host = host;
    this.#getContainer = options.getContainer;
    this.#getContentOffset = options.getContentOffset ?? (() => 0);
    this.#getItemIndexById = options.getItemIndexById;
    this.#getLayoutSource = options.getLayoutSource ?? options.getContainer;
    this.#itemSelector = options.itemSelector;

    host.addController?.(this);
  }

  capture(container: ScrollAnchorContainer | undefined = this.#getContainer()) {
    if (!container || typeof container.querySelectorAll !== 'function') {
      return;
    }

    const children = Array.from(
      container.querySelectorAll<ScrollAnchorElement>(this.#itemSelector),
    );
    const containerTop = container.getBoundingClientRect().top;
    // A row scrolled in behind whatever leads the content -- a sticky header -- is one the user
    // cannot see, so it is not one to anchor on.
    const contentTop = containerTop + this.#getContentOffset();

    for (const el of children) {
      const rect = el.getBoundingClientRect();
      const id = el.assetId || el.dataset.id;

      if (rect.bottom > contentTop && id) {
        this.#anchor = {
          id,
          offset: rect.top - containerTop,
        };
        return;
      }
    }
  }

  setLayoutMetrics(options: {
    columnCount: number;
    itemHeight: number;
  }) {
    this.#columnCount = options.columnCount;
    this.#itemHeight = options.itemHeight;
  }

  scheduleRestore() {
    if (!this.#anchor) {
      return;
    }

    this.cancelPendingRestore();
    const sequence = ++this.#restoreSequence;

    void this.#host.updateComplete.then(async () => {
      // A virtualizer torn down mid-restore rejects layoutComplete with 'disconnected'. There is then
      // nothing left to scroll, so swallow it rather than surface an unhandled rejection.
      await this.#getLayoutSource()?.layoutComplete?.catch(() => undefined);

      if (sequence !== this.#restoreSequence) {
        return;
      }

      const firstFrame = globalThis.requestAnimationFrame(() => {
        const secondFrame = globalThis.requestAnimationFrame(() => {
          if (sequence !== this.#restoreSequence) {
            return;
          }

          this.#pendingRestoreFrames = [];
          this.restore();
        });

        this.#pendingRestoreFrames = [secondFrame];
      });

      this.#pendingRestoreFrames = [firstFrame];
    });
  }

  restore() {
    const container = this.#getContainer();

    if (!this.#anchor || !container) {
      return;
    }

    const anchorRowTop = this.getAnchorRowTop();

    if (anchorRowTop !== undefined) {
      this.scrollTo(container, anchorRowTop);
      return;
    }

    const anchorEl = Array.from(
      container.querySelectorAll<ScrollAnchorElement>(this.#itemSelector),
    ).find((el) => el.assetId === this.#anchor?.id || el.dataset.id === this.#anchor?.id);

    if (anchorEl) {
      const containerTop = container.getBoundingClientRect().top;
      const anchorTop = anchorEl.getBoundingClientRect().top;

      this.scrollTo(container, container.scrollTop + anchorTop - containerTop - this.#anchor.offset);
    }
  }

  private getAnchorRowTop() {
    if (!this.#anchor || this.#columnCount < 1 || this.#itemHeight < 1) {
      return undefined;
    }

    const assetIndex = this.#getItemIndexById(this.#anchor.id);

    if (assetIndex < 0) {
      return undefined;
    }

    const rowIndex = Math.floor(assetIndex / this.#columnCount);

    // `offset` is measured from the container's top edge, so the row's position has to be measured
    // from there too: row 0 starts after whatever leads the content, not at the content origin.
    return Math.max(
      0,
      this.#getContentOffset() + rowIndex * this.#itemHeight - this.#anchor.offset,
    );
  }

  hostDisconnected() {
    this.cancelPendingRestore();
  }

  private cancelPendingRestore() {
    this.#restoreSequence += 1;
    this.#pendingRestoreFrames.forEach((frame) => {
      globalThis.cancelAnimationFrame(frame);
    });
    this.#pendingRestoreFrames = [];
  }

  private scrollTo(container: HTMLElement, top: number) {
    container.scrollTop = top;
    container.scrollTo({
      behavior: 'auto',
      top,
    });
  }
}
