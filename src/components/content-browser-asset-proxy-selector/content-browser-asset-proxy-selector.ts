import CxIcon from '@orangelogic/design-system/components/icon';
import CxMenu from '@orangelogic/design-system/components/menu';
import CxMenuItem from '@orangelogic/design-system/components/menu-item';
import CxSpace from '@orangelogic/design-system/components/space';
import CxSwitch from '@orangelogic/design-system/components/switch';
import CxTypography from '@orangelogic/design-system/components/typography';
import CortexElement from '@/base/element';
import componentStyles from '@/styles/component.styles';
import { Parameter } from '@/types/content-browser';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import { CSSResultGroup, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';

import CxContentBrowserAssetTrackingParameters from '../content-browser-asset-tracking-parameters/content-browser-asset-tracking-parameters';

import styles from './content-browser-asset-proxy-selector.styles';

export const USE_REPRESENTATIVE_VALUE = 'use-representative';
export const CUSTOM_FORMAT_VALUE = 'custom';

@customElement('cx-content-browser-asset-proxy-selector')
export default class CxContentBrowserAssetProxySelector extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-content-browser-asset-tracking-parameters': CxContentBrowserAssetTrackingParameters,
    'cx-icon': CxIcon,
    'cx-menu': CxMenu,
    'cx-menu-item': CxMenuItem,
    'cx-space': CxSpace,
    'cx-switch': CxSwitch,
    'cx-typography': CxTypography,
  };

  private readonly localize = new LocalizeController(this);

  @property({ reflect: false, type: Array })
  items: Array<{
    cdnName: string;
    docType: string;
    extension: string | null;
    height: string;
    id: string;
    image?: string;
    name: string;
    value: string;
    width: string;
  }> = [];

  @property({ attribute: 'can-custom-format', reflect: true, type: Boolean })
  canCustomFormat: boolean = false;

  @property({ attribute: 'can-use-representative', reflect: true, type: Boolean })
  canUseRepresentative: boolean = false;

  @property({ attribute: 'can-use-ats', reflect: true, type: Boolean })
  canUseATS: boolean = false;

  @property({ attribute: 'can-use-tracking', reflect: true, type: Boolean })
  canUseTracking: boolean = false;

  @property({ attribute: 'selected', reflect: true, type: String })
  selected: string = '';

  @property({ attribute: 'disabled-selected', reflect: true, type: Boolean })
  disabledSelected: boolean = false;

  @property({ attribute: 'custom-width', reflect: true, type: String })
  customWidth: string = '';

  @property({ attribute: 'custom-height', reflect: true, type: String })
  customHeight: string = '';

  @property({ attribute: 'custom-extension', reflect: true, type: String })
  customExtension: string = '';

  @property({ attribute: 'enabled-tracking', reflect: true, type: Boolean })
  enabledTracking: boolean = false;

  @property({ attribute: 'tracking-parameters', reflect: false, type: Array })
  trackingParameters: Parameter[] = [];

  handleTrackingClick(event: MouseEvent) {
    event.preventDefault();
  }

  render() {
    const supportedProxies = this.items.length > 0;

    return html`
      ${when(supportedProxies || this.canUseATS,
        () => html`
          ${when(supportedProxies,
            () => html`
              <cx-menu class="content-browser-asset-proxy-selector__menu">
                ${repeat(this.items,
                  (item) => item.id,
                  (item) => html`
                    <cx-menu-item
                      value=${item.id}
                      class=${classMap({
                        'content-browser-asset-proxy-selector__menu-item': true,
                        'content-browser-asset-proxy-selector__menu-item--disable-hover': !this.disabledSelected && item.id === this.selected,
                      })}
                    >
                      ${when(item.image,
                        () => html`
                          <div slot="prefix" class="content-browser-asset-proxy-selector__menu-item__thumbnail">
                            <img src=${item.image} alt=${item.name} />
                          </div>
                          `,
                        () => nothing,
                      )}
                      <div>
                        <cx-typography
                          variant="body3"
                          class=${classMap({
                            'content-browser-asset-proxy-selector__menu-item__name': true,
                            'content-browser-asset-proxy-selector__menu-item__name--selected': !this.disabledSelected && item.id === this.selected,
                          })}
                        >
                          ${item.name}
                        </cx-typography>
                        <cx-typography variant="body3" class="content-browser-asset-proxy-selector__menu-item__details">
                          ${when(item.width && item.height,
                            () => html`
                              ${item.width} x ${item.height}
                            `,
                            () => nothing,
                          )}

                          ${when(item.extension,
                            () => html`
                              <div class="content-browser-asset-proxy-selector__menu-item__extension-dot"></div>
                              ${item.extension?.replace(/^\./, '').toUpperCase()}
                            `,
                            () => nothing,
                          )}
                          ${when(item.cdnName,
                            () => html`
                              <div class="content-browser-asset-proxy-selector__menu-item__extension-dot"></div>
                              <span class="content-browser-asset-proxy-selector__menu-item__cdn-name">${item.cdnName}</span>
                            `,
                            () => nothing,
                          )}
                        </cx-typography>
                      </div>
                      <cx-icon
                        slot="suffix"
                        name=${this.selected === item.id ? 'check' : ''}
                        style=${styleMap({
                          color: 'var(--cx-color-primary)',
                        })}
                      ></cx-icon>
                    </cx-menu-item>
                  `,
                )}
                ${when(this.canUseRepresentative,
                  () => html`
                    <cx-menu-item
                      value=${USE_REPRESENTATIVE_VALUE}
                      class=${classMap({
                        'content-browser-asset-proxy-selector__menu-item': true,
                      })}
                    >
                      <cx-typography
                        variant="body3"
                        class=${classMap({
                          'content-browser-asset-proxy-selector__menu-item__name': true,
                          'content-browser-asset-proxy-selector__menu-item__name--selected': !this.disabledSelected && this.selected === USE_REPRESENTATIVE_VALUE,
                        })}
                      >
                        ${this.localize.term('representativeImage')}
                      </cx-typography>
                      <cx-icon
                        slot="suffix"
                        name=${this.selected === USE_REPRESENTATIVE_VALUE ? 'check' : ''}
                      ></cx-icon>
                    </cx-menu-item>
                  `,
                  () => nothing,
                )}
                </cx-menu>
              `,
            () => nothing,
          )}
          ${when(this.canUseATS,
            () => html`
              <cx-menu class="content-browser-asset-proxy-selector__menu">
                <cx-menu-item
                  value=${CUSTOM_FORMAT_VALUE}
                  class=${classMap({
                    'content-browser-asset-proxy-selector__menu-item': true,
                  })}
                >
                  <cx-icon
                    slot="prefix"
                    name="crop_rotate"
                    class="icon--large"
                  ></cx-icon>
                  <div>
                    <cx-typography
                      variant="body3"
                      class=${classMap({
                        'content-browser-asset-proxy-selector__menu-item__name': true,
                        'content-browser-asset-proxy-selector__menu-item__name--selected': !this.disabledSelected && this.selected === CUSTOM_FORMAT_VALUE,
                      })}
                    >
                      ${this.localize.term('customFormat')}
                    </cx-typography>
                    ${when(this.selected === CUSTOM_FORMAT_VALUE,
                      () => html`
                        <cx-typography
                          variant="body3"
                          class="content-browser-asset-proxy-selector__menu-item__details"
                        >
                          ${when(this.customWidth && this.customHeight,
                            () => html`
                              ${this.customWidth} x ${this.customHeight}
                            `,
                            () => nothing,
                          )}
                          ${when(this.customExtension,
                            () => html`
                              <div class="content-browser-asset-proxy-selector__menu-item__extension-dot"></div>
                              ${this.customExtension?.replace(/^\./, '').toUpperCase()}
                            `,
                            () => nothing,
                          )}
                        </cx-typography>
                      `,
                      () => nothing,
                    )}
                  </div>
                  <cx-icon
                    slot="suffix"
                    name=${this.selected === CUSTOM_FORMAT_VALUE ? 'edit' : ''}
                    class="icon--large"
                  ></cx-icon>
                  <cx-icon
                    slot="suffix"
                    name=${this.selected === CUSTOM_FORMAT_VALUE ? 'check' : ''}
                    class="icon--large icon--primary"
                  ></cx-icon>
                </cx-menu-item>
              </cx-menu>
            `,
            () => nothing,
          )}
          ${when(this.canUseTracking,
            () => html`
              <cx-menu class="content-browser-asset-proxy-selector__menu">
                <cx-menu-item value="tracking" class="content-browser-asset-proxy-selector__menu-item">
                  <cx-typography variant="body3" class="proxy__name">
                    ${this.localize.term('trackingParameters')}
                  </cx-typography>
                  <cx-switch
                    class="content-browser-asset-proxy-selector__menu-item__switch"
                    ?checked=${this.enabledTracking}
                    @click=${this.handleTrackingClick}
                  ></cx-switch>
                </cx-menu-item>
              </cx-menu>
              ${when(this.enabledTracking,
                () => html`
                  <cx-content-browser-asset-tracking-parameters
                    .values=${this.trackingParameters}
                  ></cx-content-browser-asset-tracking-parameters>
                `,
                () => nothing,
              )}
            `,
            () => nothing,
          )}
        `,
        () => html`
          <cx-space
            class="content-browser-asset-proxy-selector__menu-item__warning"
            align-items="center"
            spacing="large"
            wrap="nowrap"
          >
            <cx-icon name="warning"></cx-icon>
            <cx-typography variant="body3" class="content-browser-asset-proxy-selector__menu-item__name">
              ${this.localize.term('contentBrowserNoAvailableOptionsForThisAsset')}
            </cx-typography>
          </cx-space>
        `,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-asset-proxy-selector': CxContentBrowserAssetProxySelector;
  }
}