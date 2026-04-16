import CxIcon from '@orangelogic/design-system/components/icon';
import { customElement } from '@orangelogic/design-system/utils';

import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

import CortexElement from '@/base/element';
import componentStyles from '@/styles/component.styles';

import type { CSSResultGroup } from 'lit';
import styles from './content-browser-no-result.styles';

@customElement('cx-content-browser-no-result')
export default class CxContentBrowserNoResult extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-icon': CxIcon,
  };

  @property({ attribute: 'icon', type: String })
  icon: string = '';

  @property({ attribute: 'message', type: String })
  message: string = '';

  render(): TemplateResult {
    return html`
      <div class="content-browser-no-result" data-testid="no-results">
        <cx-icon name=${this.icon}></cx-icon>
        ${this.message}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-no-result': CxContentBrowserNoResult;
  }
}
