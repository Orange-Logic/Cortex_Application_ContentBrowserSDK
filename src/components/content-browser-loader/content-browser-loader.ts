import CxButton from '@orangelogic/design-system/components/button';
import CxSpace from '@orangelogic/design-system/components/space';
import CxSpinner from '@orangelogic/design-system/components/spinner';
import CxTypography from '@orangelogic/design-system/components/typography';
import { customElement } from '@orangelogic/design-system/utils';

import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

import CortexElement from '@/base/element';
import componentStyles from '@/styles/component.styles';

import type { CSSResultGroup } from 'lit';
import styles from './content-browser-loader.styles';

export const MESSAGE_NEW_LINE = '\n';

@customElement('cx-content-browser-loader')
export default class CxContentBrowserLoader extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-button': CxButton,
    'cx-space': CxSpace,
    'cx-spinner': CxSpinner,
    'cx-typography': CxTypography,
  };

  @property({ attribute: 'message', type: String })
  message: string = '';

  private renderMessageLines(): TemplateResult[] {
    if (!this.message) {
      return [];
    }

    return this.message.split(MESSAGE_NEW_LINE).map((line) => (
      line.includes('http')
        ? html`
          <cx-button href=${line} target="_blank">
            ${line}
          </cx-button>
        `
        : html`
          <cx-typography variant="body2">
            ${line}
          </cx-typography>
        `
    ));
  }

  render(): TemplateResult {
    return html`
      <cx-space class="content-browser-loader" direction="vertical" align-items="center">
        <cx-spinner class="content-browser-loader__spinner"></cx-spinner>
        ${this.renderMessageLines()}
        <slot></slot>
      </cx-space>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-loader': CxContentBrowserLoader;
  }
}