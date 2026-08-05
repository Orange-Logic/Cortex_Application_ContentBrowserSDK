import CxAvatar from '@orangelogic/design-system/components/avatar';
import CxDivider from '@orangelogic/design-system/components/divider';
import CxDropdown from '@orangelogic/design-system/components/dropdown';
import CxIcon from '@orangelogic/design-system/components/icon';
import CxIconButton from '@orangelogic/design-system/components/icon-button';
import CxLineClamp from '@orangelogic/design-system/components/line-clamp';
import CxMenu from '@orangelogic/design-system/components/menu';
import CxMenuItem from '@orangelogic/design-system/components/menu-item';
import CxSkeleton from '@orangelogic/design-system/components/skeleton';
import CxSpace from '@orangelogic/design-system/components/space';
import CxTypography from '@orangelogic/design-system/components/typography';
import CortexElement from '@/base/element';
import { CxSelectEvent } from '@/events';
import componentStyles from '@/styles/component.styles';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';

import styles from './content-browser-header.styles';

const LOGOUT_ITEM_VALUE = 'logout';

/**
 * @summary DAM view header. Converted from ContentBrowserSDK Header React component.
 *
 * @event cx-content-browser-header-close - Emitted when the close button is clicked (when shown in popup).
 * @event cx-content-browser-header-logout - Emitted when the user selects logout.
 */
@customElement('cx-content-browser-header')
export default class CxContentBrowserHeader extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-avatar': CxAvatar,
    'cx-divider': CxDivider,
    'cx-dropdown': CxDropdown,
    'cx-icon': CxIcon,
    'cx-icon-button': CxIconButton,
    'cx-line-clamp': CxLineClamp,
    'cx-menu': CxMenu,
    'cx-menu-item': CxMenuItem,
    'cx-skeleton': CxSkeleton,
    'cx-space': CxSpace,
    'cx-typography': CxTypography,
  };

  private readonly localize = new LocalizeController(this);

  @property({ type: Boolean })
  bordered = false;

  /**
   * Application name shown when no folder is selected.
   */
  @property({ attribute: 'application-name', type: String })
  applicationName = '';

  @property({ type: Boolean })
  loading = false;

  @property({ attribute: 'is-fetching', type: Boolean })
  isFetching = false;

  @property({ attribute: 'avatar', type: String })
  avatar = '';

  @property({ attribute: 'full-name', type: String })
  fullName = '';

  @property({ attribute: 'folder-title', type: String })
  folderTitle = '';

  /**
   * When true, show the close button (e.g. when content browser is in a popup).
   */
  @property({ attribute: 'show-close-button', type: Boolean })
  showCloseButton = false;

  /**
   * When true, show logout option in user dropdown.
   */
  @property({ attribute: 'can-logout', type: Boolean })
  canLogout = false;

  get isLoading(): boolean {
    return this.loading || this.isFetching;
  }

  private handleCloseClick(): void {
    this.emit('cx-content-browser-header-close');
  }

  private handleMenuSelect(event: CxSelectEvent<CxMenuItem>): void {
    const item = event.detail?.item;

    if (item?.value === LOGOUT_ITEM_VALUE) {
      this.emit('cx-content-browser-header-logout');
    }
  }

  private renderTitle(): TemplateResult {
    return html`
      <cx-space direction="horizontal" align-items="center" spacing="2x-small">
        ${when(this.folderTitle,
          () => html`<cx-typography variant="h4">${this.folderTitle}</cx-typography>`,
          () => html`
            <cx-line-clamp lines="1">
              <cx-typography variant="h4">${this.applicationName}</cx-typography>
            </cx-line-clamp>
          `,
        )}
      </cx-space>
    `;
  }

  private renderUserDropdown(): TemplateResult {
    if (this.isLoading || !this.avatar || !this.fullName) {
      return html`
        <cx-skeleton
          effect="sheen"
          style=${styleMap({
            borderRadius: '50%',
            height: '32px',
            width: '32px',
          })}
        ></cx-skeleton>
      `;
    }

    if (this.canLogout) {
      return html`
        <cx-dropdown distance="4">
          <cx-avatar
            slot="trigger"
            class="header__user-avatar header__user-avatar--dropdown-trigger"
            label=${this.localize.term('userAvatar')}
            image=${this.avatar}
            loading="lazy"
          ></cx-avatar>
          <cx-menu @cx-select=${this.handleMenuSelect}>
            <cx-menu-item class="header__user-info" readonly>
              <cx-line-clamp lines="1">${this.fullName}</cx-line-clamp>
              <cx-avatar
                slot="prefix"
                label=${this.localize.term('userAvatar')}
                image=${this.avatar}
                loading="lazy"
                style=${styleMap({
                  '--size': 'var(--cx-font-size-x-large)',
                })}
              ></cx-avatar>
            </cx-menu-item>
            <cx-divider></cx-divider>
            <cx-menu-item value=${LOGOUT_ITEM_VALUE}>
              ${this.localize.term('logout')}
              <cx-icon slot="prefix" name="logout"></cx-icon>
            </cx-menu-item>
          </cx-menu>
        </cx-dropdown>
      `;
    }

    return html`
      <cx-avatar
        class="header__user-avatar"
        label=${this.localize.term('userAvatar')}
        image=${this.avatar}
        loading="lazy"
      ></cx-avatar>
    `;
  }

  render(): TemplateResult {
    const containerClasses = {
      container: true,
      'container--bordered': this.bordered,
    };

    return html`
      <cx-space class=${classMap(containerClasses)} direction="vertical" spacing="small">
        <cx-space class="header" justify-content="space-between" align-items="center">
          <div class="header__title">
            <cx-space class="header" justify-content="space-between" align-items="center" spacing="x-small">
              ${this.renderTitle()}
            </cx-space>
          </div>
          <div class="header__menu">
            ${this.renderUserDropdown()}
            ${when(
              this.showCloseButton,
              () => html`
                <cx-icon-button
                  name="close"
                  label=${this.localize.term('close')}
                  @click=${this.handleCloseClick}
                ></cx-icon-button>
              `,
              () => nothing,
            )}
          </div>
        </cx-space>
        <slot></slot>
      </cx-space>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-header': CxContentBrowserHeader;
  }
}
