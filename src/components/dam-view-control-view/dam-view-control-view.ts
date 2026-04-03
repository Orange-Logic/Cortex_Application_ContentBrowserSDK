import CxDivider from '@orangelogic/design-system/components/divider';
import CxDropdown from '@orangelogic/design-system/components/dropdown';
import CxIcon from '@orangelogic/design-system/components/icon';
import CxIconButton from '@orangelogic/design-system/components/icon-button';
import CxLineClamp from '@orangelogic/design-system/components/line-clamp';
import CxMenu from '@orangelogic/design-system/components/menu';
import CxMenuItem from '@orangelogic/design-system/components/menu-item';
import CxMenuLabel from '@orangelogic/design-system/components/menu-label';
import CxSpace from '@orangelogic/design-system/components/space';
import CxSwitch from '@orangelogic/design-system/components/switch';
import CxTooltip from '@orangelogic/design-system/components/tooltip';
import CortexElement from '@/base/element';
import type { CxSelectEvent } from '@/events';
import componentStyles from '@/styles/component.styles';
import { ControlOption, GridView } from '@/types/dam-view';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';
import { watch } from '@/utils/watch';

import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';

import styles from './dam-view-control-view.styles';

/**
 * @summary DAM view control toolbar for selecting asset view modes and toggling options.
 *
 * @description Provides a toolbar to switch between available asset view layouts (e.g., small, medium, large tile) and toggle "see through" view in the Content Browser. Adapted from ContentBrowserSDK Header React component.
 *
 * @property {string} view - The currently selected view identifier.
 * @property {Array<ControlOption>} views - Array of selectable view options.
 * @property {boolean} isSeeThrough - Whether the "see through" mode is enabled.
 * @property {boolean} isMobile - Adjusts layout for mobile devices.
 *
 * @event cx-dam-view-control-view-change - Emitted when the view mode or see-through mode is changed.
 */
@customElement('cx-dam-view-control-view')
export default class CxDamViewControlView extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-divider': CxDivider,
    'cx-dropdown': CxDropdown,
    'cx-icon': CxIcon,
    'cx-icon-button': CxIconButton,
    'cx-line-clamp': CxLineClamp,
    'cx-menu': CxMenu,
    'cx-menu-item': CxMenuItem,
    'cx-menu-label': CxMenuLabel,
    'cx-space': CxSpace,
    'cx-switch': CxSwitch,
    'cx-tooltip': CxTooltip,
  };

  private readonly localize = new LocalizeController(this);

  @property({ attribute: 'view', reflect: true, type: String })
  view: GridView = GridView.Medium;

  @property({ attribute: 'views', reflect: false, type: Array })
  views: ControlOption[] = [];

  @property({ attribute: 'is-see-through', reflect: true, type: Boolean })
  isSeeThrough = false;

  @property({ attribute: 'is-mobile', reflect: false, type: Boolean })
  isMobile = false;

  @state()
  private selectedView: ControlOption | undefined;

  runConnectedCallback() {
    this.handleViewChange();
  }

  private handleSeeThroughClick(event: MouseEvent) {
    event.preventDefault();
  }

  private handleViewSelect(event: CxSelectEvent<CxMenuItem>) {
    const value = event.detail.item.value;

    if (!value) {
      return;
    }

    this.emit('cx-dam-view-control-view-change', {
      detail: {
        isSeeThrough: value === 'see-thru' ? !this.isSeeThrough : this.isSeeThrough,
        view: value === 'see-thru' ? this.view : value as GridView,
      },
    });
  }

  @watch('view', { waitUntilFirstUpdate: true })
  handleViewChange() {
    this.selectedView = this.views.find((item) => item.value === this.view);
  }

  render(): TemplateResult {
    return html`
      <cx-dropdown
        auto-width-factor=${this.isMobile ? 1 : 0.6}
        stay-open-on-select
        placement="bottom-end"
        distance="4"
        skidding=${this.isMobile ? 40 : 0}
        @cx-select=${this.handleViewSelect}
      >
        <div slot="trigger">
          <cx-tooltip content=${this.localize.term('view')}>
            <cx-icon-button
              name="dashboard"
              label=${this.localize.term('view')}
              outline
            ></cx-icon-button>
          </cx-tooltip>
        </div>
        ${when(this.isMobile,
          () => html`
            <cx-menu variant="multiple" key="multiple-menu">
              <cx-menu active name="main">
                <cx-menu-label>${this.localize.term('view')}</cx-menu-label>
                <cx-menu-item
                  menu="submenu"
                  always-show-checked-icon
                >
                  ${this.localize.term('grid')}
                  ${when(this.selectedView,
                    () => html` (${this.selectedView?.label})`,
                    () => nothing,
                  )}
                  <cx-icon slot="checked-icon" name="grid_view"></cx-icon>
                </cx-menu-item>
                <cx-divider></cx-divider>
                <cx-menu-item value="see-thru" class="menu-item--switch">
                  <cx-space direction="horizontal" justify-content="space-between">
                    <cx-line-clamp lines="1">${this.localize.term('seeThru')}</cx-line-clamp>
                    <cx-switch
                      ?checked=${this.isSeeThrough}
                      @click=${this.handleSeeThroughClick}
                    ></cx-switch>
                  </cx-space>
                </cx-menu-item>
              </cx-menu>
              <cx-menu name="submenu" back="main">
                ${repeat(this.views,
                (item) => item.value,
                (item) => (
                  html`<cx-menu-item
                    key=${item.value}
                    value=${item.value.toString()}
                    type="checkbox"
                  >
                    <cx-line-clamp lines="1">${item.label}</cx-line-clamp>
                  </cx-menu-item>`
                ))}
              </cx-menu>
            </cx-menu>
          `,
          () => html`
            <cx-menu key="default-menu">
              <cx-menu-label>${this.localize.term('view')}</cx-menu-label>
              <cx-menu-item
                type="checkbox"
                always-show-checked-icon
              >
                ${this.localize.term('grid')}
                ${when(this.selectedView,
                  () => html` (${this.selectedView?.label})`,
                  () => nothing,
                )}
                <cx-menu slot="submenu">
                  ${repeat(this.views,
                    (item) => item.value,
                    (item) => (
                      html`<cx-menu-item
                        key=${item.value}
                        value=${item.value.toString()}
                        type="checkbox"
                        ?checked=${item.value === this.selectedView?.value}
                      >
                        <cx-line-clamp lines="1">${item.label}</cx-line-clamp>
                      </cx-menu-item>`
                    ))}
                </cx-menu>
                <cx-icon slot="checked-icon" name="grid_view"></cx-icon>
              </cx-menu-item>
              <cx-divider></cx-divider>
              <cx-menu-item value="see-thru" class="menu-item--switch">
                <cx-space direction="horizontal" justify-content="space-between">
                  <cx-line-clamp lines="1">${this.localize.term('seeThru')}</cx-line-clamp>
                  <cx-switch
                    ?checked=${this.isSeeThrough}
                    @click=${this.handleSeeThroughClick}
                  ></cx-switch>
                </cx-space>
              </cx-menu-item>
            </cx-menu>
          `,
        )}
      </cx-dropdown>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-dam-view-control-view': CxDamViewControlView;
  }
}
