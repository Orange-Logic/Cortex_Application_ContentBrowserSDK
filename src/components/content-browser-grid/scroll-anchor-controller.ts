import type { ReactiveController, ReactiveControllerHost } from 'lit';

type ScrollAnchor = {
  id: string;
  offset: number;
};

type ScrollAnchorElement = HTMLElement & {
  assetId?: string;
};

type ScrollAnchorContainer = HTMLElement & {
  layoutComplete?: Promise<unknown>;
};

type ScrollAnchorControllerOptions = {
  getContainer: () => ScrollAnchorContainer | undefined;
  getItemIndexById: (id: string) => number;
  itemSelector: string;
};

export default class ScrollAnchorController implements ReactiveController {
  readonly #host: ReactiveControllerHost & {
    updateComplete: Promise<unknown>;
  };

  readonly #getContainer: ScrollAnchorControllerOptions['getContainer'];

  readonly #getItemIndexById: ScrollAnchorControllerOptions['getItemIndexById'];

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
    this.#getItemIndexById = options.getItemIndexById;
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

    for (const el of children) {
      const rect = el.getBoundingClientRect();
      const id = el.assetId || el.dataset.id;

      if (rect.bottom > containerTop && id) {
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
      await this.#getContainer()?.layoutComplete;

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

    return Math.max(0, rowIndex * this.#itemHeight - this.#anchor.offset);
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
