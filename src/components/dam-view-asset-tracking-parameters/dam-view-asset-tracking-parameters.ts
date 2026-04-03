import CxButton from '@orangelogic/design-system/components/button';
import CxIcon from '@orangelogic/design-system/components/icon';
import CxIconButton from '@orangelogic/design-system/components/icon-button';
import CxInput from '@orangelogic/design-system/components/input';
import CxInputGroup from '@orangelogic/design-system/components/input-group';
import CxSpace from '@orangelogic/design-system/components/space';
import CortexElement from '@/base/element';
import type { CxChangeEvent } from '@/events';
import componentStyles from '@/styles/component.styles';
import type { Parameter } from '@/types/dam-view';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import type { CSSResultGroup, TemplateResult } from 'lit';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import styles from './dam-view-asset-tracking-parameters.styles';

/**
 * @summary Key/value editor for asset tracking query parameters.
 *
 * @property {Parameter[]} values - Current parameter rows (mutations are emitted; parent should update this binding).
 *
 * @event cx-dam-view-asset-tracking-parameters-change - Fired when parameters are added, removed, or edited. `detail.values` is the new list.
 */
@customElement('cx-dam-view-asset-tracking-parameters')
export default class CxDamViewAssetTrackingParameters extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-button': CxButton,
    'cx-icon': CxIcon,
    'cx-icon-button': CxIconButton,
    'cx-input': CxInput,
    'cx-input-group': CxInputGroup,
    'cx-space': CxSpace,
  };

  private readonly localize = new LocalizeController(this);

  @property({ attribute: false, type: Array })
  values: Parameter[] = [];

  private emitValuesChange(next: Parameter[]) {
    this.emit('cx-dam-view-asset-tracking-parameters-change', {
      detail: { values: next },
    });
  }

  private addParameter() {
    this.emitValuesChange([...this.values, { key: '', value: '' }]);
  }

  private handleRemoveClick(event: Event) {
    const el = event.currentTarget as HTMLElement;
    const indexStr = el.dataset.trackingIndex;

    if (indexStr === undefined) {
      return;
    }

    const index = Number.parseInt(indexStr, 10);

    if (Number.isNaN(index)) {
      return;
    }

    this.emitValuesChange(this.values.filter((_, i) => i !== index));
  }

  private handleRowInputChange(event: CxChangeEvent) {
    if (!(event.target instanceof CxInput)) {
      return;
    }

    const indexStr = event.target.dataset.trackingIndex;
    const field = event.target.dataset.trackingField;

    if (indexStr === undefined || (field !== 'key' && field !== 'value')) {
      return;
    }

    const index = Number.parseInt(indexStr, 10);

    if (Number.isNaN(index)) {
      return;
    }

    const row = this.values[index];

    if (!row) {
      return;
    }

    const nextValue = event.target.value;

    if (field === 'key') {
      this.emitValuesChange(
        this.values.map((r, i) =>
          i === index ? { key: nextValue, value: r.value } : r,
        ),
      );

      return;
    }

    this.emitValuesChange(
      this.values.map((r, i) =>
        i === index ? { key: r.key, value: nextValue } : r,
      ),
    );
  }

  render(): TemplateResult {
    const rows = repeat(
      this.values,
      (_param, index) => index,
      (param, index) => html`
        <cx-space class="dam-view-asset-tracking-parameters__row" spacing="small" wrap="nowrap" align-items="center">
          <cx-input-group>
            <cx-input
              data-tracking-index=${index}
              data-tracking-field="key"
              label=${this.localize.term('name')}
              size="small"
              value=${param.key}
              @cx-change=${this.handleRowInputChange}
            ></cx-input>
            <cx-input
              data-tracking-index=${index}
              data-tracking-field="value"
              label=${this.localize.term('value')}
              size="small"
              value=${param.value}
              @cx-change=${this.handleRowInputChange}
            ></cx-input>
          </cx-input-group>
          <cx-icon-button
            data-tracking-index=${index}
            name="close"
            @click=${this.handleRemoveClick}
          ></cx-icon-button>
        </cx-space>
      `,
    );

    return html`
      <cx-space
        direction="vertical"
        spacing="small"
        class="dialog__tracking"
        align-items="flex-start"
      >
        ${rows}
        <cx-button variant="neutral" @click=${this.addParameter}>
          <cx-icon slot="prefix" name="add"></cx-icon>
          ${this.localize.term('addParameter')}
        </cx-button>
      </cx-space>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-dam-view-asset-tracking-parameters': CxDamViewAssetTrackingParameters;
  }
}
