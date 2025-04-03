/* eslint-disable */
import { BoardItem as BoardItem_2 } from 'packages/molecules/src/board/types';
import { CSSResult } from 'lit';
import { CSSResultGroup } from 'lit';
import { default as default_2 } from 'sortablejs';
import { default as default_3 } from 'react';
import { Edge as Edge_2 } from '@xyflow/react';
import { ExecutionContext } from './data/orangelogic-types';
import { LitElement } from 'lit';
import { MenuData as MenuData_2 } from 'packages/molecules/src/view-and-sort/view-and-sort.types';
import { Node as Node_3 } from '@xyflow/react';
import { PropertyDeclaration } from 'lit';
import { PropertyValueMap } from 'lit';
import { PropertyValues } from 'lit';
import { ReactiveController } from 'lit';
import { ReactiveControllerHost } from 'lit';
import { RendererObject } from 'marked';
import * as signalR from '@microsoft/signalr';
import { StepData } from './stepper-wizard.types';
import { TemplateResult } from 'lit';
import { TokenizerAndRendererExtension } from 'marked';

declare type AlertVariant = BaseVariant;

declare type AnimationNames = EnumOrString<keyof typeof animations | 'none'>;

declare namespace animations {
    export {
        easings,
        bounce,
        flash,
        headShake,
        heartBeat,
        jello,
        pulse,
        rubberBand,
        shake,
        shakeX,
        shakeY,
        swing,
        tada,
        wobble,
        backInDown,
        backInLeft,
        backInRight,
        backInUp,
        backOutDown,
        backOutLeft,
        backOutRight,
        backOutUp,
        bounceIn,
        bounceInDown,
        bounceInLeft,
        bounceInRight,
        bounceInUp,
        bounceOut,
        bounceOutDown,
        bounceOutLeft,
        bounceOutRight,
        bounceOutUp,
        fadeIn,
        fadeInBottomLeft,
        fadeInBottomRight,
        fadeInDown,
        fadeInDownBig,
        fadeInLeft,
        fadeInLeftBig,
        fadeInRight,
        fadeInRightBig,
        fadeInTopLeft,
        fadeInTopRight,
        fadeInUp,
        fadeInUpBig,
        fadeOut,
        fadeOutBottomLeft,
        fadeOutBottomRight,
        fadeOutDown,
        fadeOutDownBig,
        fadeOutLeft,
        fadeOutLeftBig,
        fadeOutRight,
        fadeOutRightBig,
        fadeOutTopLeft,
        fadeOutTopRight,
        fadeOutUp,
        fadeOutUpBig,
        flip,
        flipInX,
        flipInY,
        flipOutX,
        flipOutY,
        lightSpeedInLeft,
        lightSpeedInRight,
        lightSpeedOutLeft,
        lightSpeedOutRight,
        rotateIn,
        rotateInDownLeft,
        rotateInDownRight,
        rotateInUpLeft,
        rotateInUpRight,
        rotateOut,
        rotateOutDownLeft,
        rotateOutDownRight,
        rotateOutUpLeft,
        rotateOutUpRight,
        slideInDown,
        slideInLeft,
        slideInRight,
        slideInUp,
        slideOutDown,
        slideOutLeft,
        slideOutRight,
        slideOutUp,
        hinge,
        jackInTheBox,
        rollIn,
        rollOut,
        zoomIn,
        zoomInDown,
        zoomInLeft,
        zoomInRight,
        zoomInUp,
        zoomOut,
        zoomOutDown,
        zoomOutLeft,
        zoomOutRight,
        zoomOutUp
    }
}

declare type AvatarShape = 'circle' | 'rounded' | 'square';

declare const backInDown: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const backInLeft: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const backInRight: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const backInUp: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const backOutDown: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const backOutLeft: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const backOutRight: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const backOutUp: {
    offset: number;
    opacity: string;
    transform: string;
}[];

export declare type BaseVariant = 'primary' | 'success' | 'neutral' | 'warning' | 'danger';

declare namespace BoardComponentTypes {
    export {
        BoardItem
    }
}
export { BoardComponentTypes }

declare interface BoardItem {
    group: string;
    id: string;
    index?: string;
    text: string;
    tooltip: string;
    type?: string;
}

declare const bounce: ({
    easing: string;
    offset: number;
    transform: string;
    'transition-timing-function'?: undefined;
} | {
    offset: number;
    transform: string;
    'transition-timing-function': string;
    easing?: undefined;
} | {
    offset: number;
    transform: string;
    easing?: undefined;
    'transition-timing-function'?: undefined;
})[];

declare const bounceIn: ({
    offset: number;
    opacity: string;
    transform: string;
    easing?: undefined;
} | {
    easing: string;
    offset: number;
    opacity?: undefined;
    transform?: undefined;
} | {
    offset: number;
    transform: string;
    opacity?: undefined;
    easing?: undefined;
})[];

declare const bounceInDown: ({
    offset: number;
    opacity: string;
    transform: string;
    easing?: undefined;
} | {
    easing: string;
    offset: number;
    opacity?: undefined;
    transform?: undefined;
} | {
    offset: number;
    transform: string;
    opacity?: undefined;
    easing?: undefined;
})[];

declare const bounceInLeft: ({
    offset: number;
    opacity: string;
    transform: string;
    easing?: undefined;
} | {
    easing: string;
    offset: number;
    opacity?: undefined;
    transform?: undefined;
} | {
    offset: number;
    transform: string;
    opacity?: undefined;
    easing?: undefined;
})[];

declare const bounceInRight: ({
    offset: number;
    opacity: string;
    transform: string;
    easing?: undefined;
} | {
    easing: string;
    offset: number;
    opacity?: undefined;
    transform?: undefined;
} | {
    offset: number;
    transform: string;
    opacity?: undefined;
    easing?: undefined;
})[];

declare const bounceInUp: ({
    offset: number;
    opacity: string;
    transform: string;
    easing?: undefined;
} | {
    easing: string;
    offset: number;
    opacity?: undefined;
    transform?: undefined;
} | {
    offset: number;
    transform: string;
    opacity?: undefined;
    easing?: undefined;
})[];

declare const bounceOut: ({
    offset: number;
    transform: string;
    opacity?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const bounceOutDown: ({
    offset: number;
    transform: string;
    opacity?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const bounceOutLeft: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const bounceOutRight: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const bounceOutUp: ({
    offset: number;
    transform: string;
    opacity?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare type ButtonVariant = BaseVariant | 'default' | 'text' | 'tertiary';

declare type Category = {
    id: string;
    name: string;
};

declare namespace ChatbotComponentTypes {
    export {
        ChatbotEvent,
        Reference,
        Message,
        MessageRole
    }
}
export { ChatbotComponentTypes }

declare type ChatbotEvent = {
    callback: (messageContent: string) => void;
    event: string;
    excludedFromPurposes?: string[];
    label: string;
};

declare type ClusterData = {
    services: Service[];
};

declare namespace ClusterManagerComponentTypes {
    export {
        Service,
        ClusterData,
        GetClusterDataFunction,
        UpdateServiceFunction
    }
}
export { ClusterManagerComponentTypes }

declare type ColumnData = {
    id: string;
    items: BoardItem_2[];
    sort?: boolean;
    title: string;
};

export declare const componentStyles: CSSResult;

declare class CortexElement extends LitElement {
    dir: string;
    lang: string;
    /** Emits a custom event with more convenient defaults. */
    emit<T extends string & keyof EventTypesWithoutRequiredDetail>(name: EventTypeDoesNotRequireDetail<T>, options?: CxEventInit<T> | undefined): GetCustomEventType<T>;
    emit<T extends string & keyof EventTypesWithRequiredDetail>(name: EventTypeRequiresDetail<T>, options: CxEventInit<T>): GetCustomEventType<T>;
    static version: string;
    static define(name: string, elementConstructor?: typeof CortexElement, options?: ElementDefinitionOptions): void;
    static dependencies: Record<string, typeof CortexElement>;
    static createProperty(name: PropertyKey, options?: PropertyDeclaration): void;
    constructor();
}

declare class CortexLightElement extends CortexElement {
    #private;
    constructor();
    protected createRenderRoot(): HTMLElement | DocumentFragment;
}

export declare type CxAfterCollapseEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxAfterExpandEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxAfterHideEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxAfterShowEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary Alerts are used to display important messages inline or as toast notifications.
 * @status stable
 * @since 2.0
 *
 * @dependency cx-icon-button
 *
 * @slot - The alert's main content.
 * @slot icon - An icon to show in the alert. Works best with `<cx-icon>`.
 *
 * @event cx-show - Emitted when the alert opens.
 * @event cx-after-show - Emitted after the alert opens and all animations are complete.
 * @event cx-hide - Emitted when the alert closes.
 * @event cx-after-hide - Emitted after the alert closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The container that wraps the optional icon.
 * @csspart message - The container that wraps the alert's main content.
 * @csspart close-button - The close button, an `<cx-icon-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 *
 * @animation alert.show - The animation to use when showing the alert.
 * @animation alert.hide - The animation to use when hiding the alert.
 */
export declare class CxAlert extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon-button': typeof CxIconButton;
    };
    private autoHideTimeout;
    private remainingTimeInterval;
    private countdownAnimation?;
    private readonly hasSlotController;
    private readonly localize;
    base: HTMLElement;
    countdownElement: HTMLElement;
    /**
     * Indicates whether or not the alert is open. You can toggle this attribute to show and hide the alert, or you can
     * use the `show()` and `hide()` methods and this attribute will reflect the alert's open state.
     */
    open: boolean;
    /** Enables a close button that allows the user to dismiss the alert. */
    closable: boolean;
    /** The alert's theme variant. */
    variant: AlertVariant;
    /**
     * The length of time, in milliseconds, the alert will show before closing itself. If the user interacts with
     * the alert before it closes (e.g. moves the mouse over it), the timer will restart. Defaults to `Infinity`, meaning
     * the alert will not close on its own.
     */
    duration: number;
    /**
     * Enables a countdown that indicates the remaining time the alert will be displayed.
     * Typically used to indicate the remaining time before a whole app refresh.
     */
    countdown?: 'rtl' | 'ltr';
    private remainingTime;
    firstUpdated(): void;
    private restartAutoHide;
    private pauseAutoHide;
    private resumeAutoHide;
    private handleCountdownChange;
    private handleCloseClick;
    handleOpenChange(): Promise<void>;
    handleDurationChange(): void;
    /** Shows the alert. */
    show(): Promise<void>;
    /** Hides the alert */
    hide(): Promise<void>;
    /**
     * Displays the alert as a toast notification. This will move the alert out of its position in the DOM and, when
     * dismissed, it will be removed from the DOM completely. By storing a reference to the alert, you can reuse it by
     * calling this method again. The returned promise will resolve after the alert is hidden.
     */
    toast(): Promise<void>;
    render(): TemplateResult<1>;
}

/**
 * @summary A component for displaying animated GIFs and WEBPs that play and pause on interaction.
 *
 * @dependency cx-icon
 *
 * @event cx-load - Emitted when the image loads successfully.
 * @event cx-error - Emitted when the image fails to load.
 *
 * @slot play-icon - Optional play icon to use instead of the default. Works best with `<cx-icon>`.
 * @slot pause-icon - Optional pause icon to use instead of the default. Works best with `<cx-icon>`.
 *
 * @part control-box - The container that surrounds the pause/play icons and provides their background.
 *
 * @cssproperty --control-box-size - The size of the icon box.
 * @cssproperty --icon-size - The size of the play/pause icons.
 */
export declare class CxAnimatedImage extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
    };
    animatedImage: HTMLImageElement;
    frozenFrame: string;
    isLoaded: boolean;
    /** The path to the image to load. */
    src: string;
    /** A description of the image used by assistive devices. */
    alt: string;
    /** Plays the animation. When this attribute is remove, the animation will pause. */
    play: boolean;
    private handleClick;
    private handleLoad;
    private handleError;
    handlePlayChange(): void;
    handleSrcChange(): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Animate elements declaratively with nearly 100 baked-in presets, or roll your own with custom keyframes. Powered by the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).
 *
 * @event cx-cancel - Emitted when the animation is canceled.
 * @event cx-finish - Emitted when the animation finishes.
 * @event cx-start - Emitted when the animation starts or restarts.
 *
 * @slot - The element to animate. Avoid slotting in more than one element, as subsequent ones will be ignored. To
 *  animate multiple elements, either wrap them in a single container or use multiple `<cx-animation>` elements.
 */
export declare class CxAnimation extends CortexElement {
    static styles: CSSResultGroup;
    private animation?;
    private hasStarted;
    defaultSlot: Promise<HTMLSlotElement>;
    /** The name of the built-in animation to use. For custom animations, use the `keyframes` prop. */
    name: AnimationNames;
    /**
     * Plays the animation. When omitted, the animation will be paused. This attribute will be automatically removed when
     * the animation finishes or gets canceled.
     */
    play: boolean;
    /** The number of milliseconds to delay the start of the animation. */
    delay: number;
    /**
     * Determines the direction of playback as well as the behavior when reaching the end of an iteration.
     * [Learn more](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-direction)
     */
    direction: PlaybackDirection;
    /** The number of milliseconds each iteration of the animation takes to complete. */
    duration: number;
    /**
     * The easing function to use for the animation. This can be a Shoelace easing function or a custom easing function
     * such as `cubic-bezier(0, 1, .76, 1.14)`.
     */
    easing: EasingTypes;
    /** The number of milliseconds to delay after the active period of an animation sequence. */
    endDelay: number;
    /** Sets how the animation applies styles to its target before and after its execution. */
    fill: FillMode;
    /** The number of iterations to run before the animation completes. Defaults to `Infinity`, which loops. */
    iterations: number;
    /** The offset at which to start the animation, usually between 0 (start) and 1 (end). */
    iterationStart: number;
    /** The keyframes to use for the animation. If this is set, `name` will be ignored. */
    keyframes?: Keyframe[];
    /**
     * Sets the animation's playback rate. The default is `1`, which plays the animation at a normal speed. Setting this
     * to `2`, for example, will double the animation's speed. A negative value can be used to reverse the animation. This
     * value can be changed without causing the animation to restart.
     */
    playbackRate: number;
    /** Gets and sets the current animation time. */
    get currentTime(): CSSNumberish;
    set currentTime(time: number);
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleAnimationFinish;
    private handleAnimationCancel;
    private handleSlotChange;
    private createAnimation;
    private destroyAnimation;
    handleAnimationChange(): void;
    handlePlayChange(): boolean;
    handlePlaybackRateChange(): void;
    /** Clears all keyframe effects caused by this animation and aborts its playback. */
    cancel(): void;
    /** Sets the playback time to the end of the animation corresponding to the current playback direction. */
    finish(): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Avatars are used to represent a person or object.
 *
 * @dependency cx-icon
 *
 * @event cx-error - The image could not be loaded. This may because of an invalid URL, a temporary network condition, or some
 * unknown cause.
 *
 * @slot icon - The default icon to use when no image or initials are present. Works best with `<cx-icon>`.
 *
 * @csspart base - The component's base wrapper.
 * @csspart icon - The container that wraps the avatar's icon.
 * @csspart initials - The container that wraps the avatar's initials.
 * @csspart image - The avatar image. Only shown when the `image` attribute is set.
 *
 * @cssproperty --size - The size of the avatar.
 */
export declare class CxAvatar extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
    };
    private hasError;
    /** The image source to use for the avatar. */
    image: string;
    /** A label to use to describe the avatar to assistive devices. */
    label: string;
    /** Initials to use as a fallback when no image is available (1-2 characters max recommended). */
    initials: string;
    /** Indicates how the browser should load the image. */
    loading: 'eager' | 'lazy';
    /** The shape of the avatar. */
    shape: AvatarShape;
    handleImageChange(): void;
    private handleImageLoadError;
    render(): TemplateResult<1>;
}

/**
 * @summary Badges are used to draw attention and display statuses or counts.
 *
 * @slot - The badge's content.
 *
 * @csspart base - The component's base wrapper.
 */
export declare class CxBadge extends CortexElement {
    static styles: CSSResultGroup;
    /** The badge's theme variant. */
    variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
    /** Draws a pill-style badge with rounded edges. */
    pill: boolean;
    /** Makes the badge pulsate to draw attention. */
    pulse: boolean;
    render(): TemplateResult<1>;
}

export declare type CxBlurEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary Board is a list of items that can be reordered by dragging and dropping them.
 *
 * @event {{ items: string[] }} cx-sort-change - Emitted when the list items changes.
 */
export declare class CxBoard extends CortexElement {
    static styles: CSSResult;
    private readonly localize;
    board: HTMLElement;
    searchInput?: CxInput;
    searchInputClear?: CxIconButton;
    list: HTMLElement;
    selectAllCheckBox: HTMLElement;
    title: string;
    name: string;
    ignoreTypes: string[];
    data: BoardItem[];
    sort: boolean;
    group: boolean;
    configurable: boolean;
    all: boolean;
    allowSearch: boolean;
    /**
     * A boolean property that indicates whether the drag operation should be aborted.
     * When set to `true`, the current drag action will be canceled,
     * and the dragged items will be placed back to their original position.
     */
    abortDrag: boolean;
    items: BoardItem[];
    private _allItems;
    get allItems(): BoardItem[];
    private _filteredItems;
    get filteredItems(): BoardItem[];
    /** The selected items in the board. */
    private _selectedItems;
    get selectedItemAsArray(): string[];
    get selectedItems(): Record<string, boolean>;
    searchValue: string;
    private sortable;
    private _totalCount;
    private _indexMap;
    get totalCount(): number;
    private isDragging;
    private start;
    private end;
    private previous;
    private lastSelectedItem;
    get isAllSelected(): boolean;
    get isPartiallySelected(): boolean;
    /** Handles the update of items in the board. */
    private handleUpdateEvent;
    private handleSelectedChange;
    private handleItemConfigure;
    private handleListScroll;
    private handleSearchChanged;
    private handleSearchClear;
    private concatGroupItems;
    onSearchValueChanged(): void;
    onItemsChanged(): void;
    handleAdd(evt: default_2.SortableEvent): void;
    handleEnd(evt: default_2.SortableEvent): Promise<void>;
    handleRemove(evt: default_2.SortableEvent): void;
    handleSelect(evt: default_2.SortableEvent): void;
    handleStart(evt: default_2.SortableEvent): void;
    handleUpdate(evt: default_2.SortableEvent): void;
    deselectAll(force?: boolean, exclude?: string[]): void;
    selectAll(): void;
    handleSelectAll(): void;
    onAllChanged(): void;
    private initSortable;
    /** Initializes the sortable functionality for the list element. */
    firstUpdated(): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
}

export declare class CxBoardListItem extends CortexElement {
    static styles: CSSResult;
    configButton: CxIconButton;
    textElement: HTMLElement;
    tooltipElement: CxTooltip;
    controlElement: HTMLElement;
    text: string;
    tooltip: string;
    readonly: boolean;
    placeholder: boolean;
    selected: boolean;
    configurable: boolean;
    disabledTooltip: boolean;
    isGroup: boolean;
    private timeout;
    private onConfigButtonClick;
    private onTextMouseEnter;
    private onTextMouseLeave;
    handleDisabledTooltipChange(): void;
    firstUpdated(): Promise<void>;
    disconnectedCallback(): void;
    render(): TemplateResult;
}

/**
 * @summary Breadcrumbs provide a group of links so users can easily navigate a website's hierarchy.
 *
 * @slot - One or more breadcrumb items to display.
 * @slot separator - The separator to use between breadcrumb items. Works best with `<cx-icon>`.
 *
 * @dependency cx-icon
 *
 * @csspart base - The component's base wrapper.
 */
export declare class CxBreadcrumb extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
    };
    private readonly localize;
    private separatorDir;
    defaultSlot: HTMLSlotElement;
    separatorSlot: HTMLSlotElement;
    /**
     * The label to use for the breadcrumb control. This will not be shown on the screen, but it will be announced by
     * screen readers and other assistive devices to provide more context for users.
     */
    label: string;
    private getSeparator;
    private handleSlotChange;
    render(): TemplateResult<1>;
}

/**
 * @summary Breadcrumb Items are used inside [breadcrumbs](?s=atoms&id=/breadcrumb) to represent different links.
 *
 * @slot - The breadcrumb item's label.
 * @slot prefix - An optional prefix, usually an icon or icon button.
 * @slot suffix - An optional suffix, usually an icon or icon button.
 * @slot separator - The separator to use for the breadcrumb item. This will only change the separator for this item. If
 * you want to change it for all items in the group, set the separator on `<cx-breadcrumb>` instead.
 *
 * @csspart base - The component's base wrapper.
 * @csspart label - The breadcrumb item's label.
 * @csspart prefix - The container that wraps the prefix.
 * @csspart suffix - The container that wraps the suffix.
 * @csspart separator - The container that wraps the separator.
 */
export declare class CxBreadcrumbItem extends CortexElement {
    static styles: CSSResultGroup;
    private readonly hasSlotController;
    defaultSlot: HTMLSlotElement;
    private renderType;
    /**
     * Optional URL to direct the user to when the breadcrumb item is activated. When set, a link will be rendered
     * internally. When unset, a button will be rendered instead.
     */
    href?: string;
    /** Tells the browser where to open the link. Only used when `href` is set. */
    target?: '_blank' | '_parent' | '_self' | '_top';
    /** The `rel` attribute to use on the link. Only used when `href` is set. */
    rel: string;
    private setRenderType;
    hrefChanged(): void;
    handleSlotChange(): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Buttons represent actions that are available to the user.
 *
 * @dependency cx-icon
 * @dependency cx-spinner
 *
 * @event cx-blur - Emitted when the button loses focus.
 * @event cx-focus - Emitted when the button gains focus.
 * @event cx-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @slot - The button's label.
 * @slot prefix - A presentational prefix icon or similar element.
 * @slot suffix - A presentational suffix icon or similar element.
 *
 * @csspart base - The component's base wrapper.
 * @csspart prefix - The container that wraps the prefix.
 * @csspart label - The button's label.
 * @csspart suffix - The container that wraps the suffix.
 * @csspart caret - The button's caret icon, an `<cx-icon>` element.
 * @csspart spinner - The spinner that shows when the button is in the loading state.
 */
export declare class CxButton extends CortexElement implements ShoelaceFormControl {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
        'cx-spinner': typeof CxSpinner;
    };
    private readonly formControlController;
    private readonly hasSlotController;
    private readonly localize;
    button: HTMLButtonElement | HTMLLinkElement;
    private hasFocus;
    invalid: boolean;
    title: string;
    /** The button's theme variant. */
    variant: ButtonVariant;
    /** The button's size. */
    size: 'small' | 'medium' | 'large' | 'x-large';
    /** Draws the button with a caret. Used to indicate that the button triggers a dropdown menu or similar behavior. */
    caret: boolean;
    /** Disables the button. */
    disabled: boolean;
    /** Draws the button in a loading state. */
    loading: boolean;
    /** Draws an outlined button. */
    outline: boolean;
    /** Draws a pill-style button with rounded edges. */
    pill: boolean;
    /**
     * Draws a circular icon button. When this attribute is present, the button expects a single `<cx-icon>` in the
     * default slot.
     */
    circle: boolean;
    /**
     * The type of button. Note that the default value is `button` instead of `submit`, which is opposite of how native
     * `<button>` elements behave. When the type is `submit`, the button will submit the surrounding form.
     */
    type: 'button' | 'submit' | 'reset';
    /**
     * The name of the button, submitted as a name/value pair with form data, but only when this button is the submitter.
     * This attribute is ignored when `href` is present.
     */
    name: string;
    /**
     * The value of the button, submitted as a pair with the button's name as part of the form data, but only when this
     * button is the submitter. This attribute is ignored when `href` is present.
     */
    value: string;
    /** When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`. */
    href: string;
    /** Tells the browser where to open the link. Only used when `href` is present. */
    target: '_blank' | '_parent' | '_self' | '_top';
    /**
     * When using `href`, this attribute will map to the underlying link's `rel` attribute. Unlike regular links, the
     * default is `noreferrer noopener` to prevent security exploits. However, if you're using `target` to point to a
     * specific tab/window, this will prevent that from working correctly. You can remove or change the default value by
     * setting the attribute to an empty string or a value of your choice, respectively.
     */
    rel: string;
    /** Tells the browser to download the linked file as this filename. Only used when `href` is present. */
    download?: string;
    /**
     * The "form owner" to associate the button with. If omitted, the closest containing form will be used instead. The
     * value of this attribute must be an id of a form in the same document or shadow root as the button.
     */
    form: string;
    /** Used to override the form owner's `action` attribute. */
    formAction: string;
    /** Used to override the form owner's `enctype` attribute.  */
    formEnctype: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
    /** Used to override the form owner's `method` attribute.  */
    formMethod: 'post' | 'get';
    /** Used to override the form owner's `novalidate` attribute. */
    formNoValidate: boolean;
    /** Used to override the form owner's `target` attribute. */
    formTarget: '_self' | '_blank' | '_parent' | '_top' | string;
    /** Gets the validity state object */
    get validity(): ValidityState;
    /** Gets the validation message */
    get validationMessage(): string;
    firstUpdated(): void;
    syncStyles(): void;
    private handleBlur;
    private handleFocus;
    private handleClick;
    private handleInvalid;
    private isButton;
    private isLink;
    handleDisabledChange(): void;
    /** Simulates a click on the button. */
    click(): void;
    /** Sets focus on the button. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the button. */
    blur(): void;
    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity(): boolean;
    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null;
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity(): boolean;
    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string): void;
    render(): TemplateResult;
}

/**
 * @summary Button groups can be used to group related buttons into sections.
 *
 * @slot - One or more `<cx-button>` elements to display in the button group.
 *
 * @csspart base - The component's base wrapper.
 */
export declare class CxButtonGroup extends CortexElement {
    static styles: CSSResultGroup;
    defaultSlot: HTMLSlotElement;
    disableRole: boolean;
    /**
     * A label to use for the button group. This won't be displayed on the screen, but it will be announced by assistive
     * devices when interacting with the control and is strongly recommended.
     */
    label: string;
    private handleFocus;
    private handleBlur;
    private handleMouseOver;
    private handleMouseOut;
    private handleSlotChange;
    render(): TemplateResult<1>;
}

export declare type CxCancelEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary Cards can be used to group related subjects in a container.
 *
 * @slot - The card's main content.
 * @slot header - An optional header for the card.
 * @slot footer - An optional footer for the card.
 * @slot image - An optional image to render at the start of the card.
 *
 * @csspart base - The component's base wrapper.
 * @csspart image - The container that wraps the card's image.
 * @csspart header - The container that wraps the card's header.
 * @csspart body - The container that wraps the card's main content.
 * @csspart footer - The container that wraps the card's footer.
 *
 * @cssproperty --border-color - The card's border color, including borders that occur inside the card.
 * @cssproperty --border-radius - The border radius for the card's edges.
 * @cssproperty --border-width - The width of the card's borders.
 * @cssproperty --padding - The padding to use for the card's sections.
 */
export declare class CxCard extends CortexElement {
    static styles: CSSResultGroup;
    /** Draws the option in an interactive state. */
    interactive: boolean;
    private readonly hasSlotController;
    render(): TemplateResult<1>;
}

/**
 * @summary Carousels display an arbitrary number of content slides along a horizontal or vertical axis.
 *
 * @since 2.2
 * @status experimental
 *
 * @dependency cx-icon
 *
 * @event {{ index: number, slide: CxCarouselItem }} cx-slide-change - Emitted when the active slide changes.
 *
 * @slot - The carousel's main content, one or more `<cx-carousel-item>` elements.
 * @slot next-icon - Optional next icon to use instead of the default. Works best with `<cx-icon>`.
 * @slot previous-icon - Optional previous icon to use instead of the default. Works best with `<cx-icon>`.
 *
 * @csspart base - The carousel's internal wrapper.
 * @csspart scroll-container - The scroll container that wraps the slides.
 * @csspart pagination - The pagination indicators wrapper.
 * @csspart pagination-item - The pagination indicator.
 * @csspart pagination-item--active - Applied when the item is active.
 * @csspart navigation - The navigation wrapper.
 * @csspart navigation-button - The navigation button.
 * @csspart navigation-button--previous - Applied to the previous button.
 * @csspart navigation-button--next - Applied to the next button.
 *
 * @cssproperty --slide-gap - The space between each slide.
 * @cssproperty [--aspect-ratio=16/9] - The aspect ratio of each slide.
 * @cssproperty --scroll-hint - The amount of padding to apply to the scroll area, allowing adjacent slides to become
 *  partially visible as a scroll hint.
 */
export declare class CxCarousel extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
    };
    /** When set, allows the user to navigate the carousel in the same direction indefinitely. */
    loop: boolean;
    /** When set, show the carousel's navigation. */
    navigation: boolean;
    /** When set, show the carousel's pagination indicators. */
    pagination: boolean;
    /** When set, the slides will scroll automatically when the user is not interacting with them.  */
    autoplay: boolean;
    /** Specifies the amount of time, in milliseconds, between each automatic scroll.  */
    autoplayInterval: number;
    /** Specifies how many slides should be shown at a given time.  */
    slidesPerPage: number;
    /**
     * Specifies the number of slides the carousel will advance when scrolling, useful when specifying a `slides-per-page`
     * greater than one. It can't be higher than `slides-per-page`.
     */
    slidesPerMove: number;
    /** Specifies the orientation in which the carousel will lay out.  */
    orientation: 'horizontal' | 'vertical';
    /** When set, it is possible to scroll through the slides by dragging them with the mouse. */
    mouseDragging: boolean;
    scrollContainer: HTMLElement;
    paginationContainer: HTMLElement;
    activeSlide: number;
    scrolling: boolean;
    dragging: boolean;
    private autoplayController;
    private readonly localize;
    private mutationObserver;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(): void;
    protected willUpdate(changedProperties: PropertyValueMap<CxCarousel> | Map<PropertyKey, unknown>): void;
    private getPageCount;
    private getCurrentPage;
    private canScrollNext;
    private canScrollPrev;
    /* Excluded from this release type: getSlides */
    private handleKeyDown;
    private handleMouseDragStart;
    private handleMouseDrag;
    private handleMouseDragEnd;
    private handleScroll;
    /* Excluded from this release type: synchronizeSlides */
    private handleScrollEnd;
    private isCarouselItem;
    private handleSlotChange;
    initializeSlides(): void;
    private createClones;
    handelSlideChange(): void;
    updateSlidesSnap(): void;
    handleAutoplayChange(): void;
    /**
     * Move the carousel backward by `slides-per-move` slides.
     *
     * @param behavior - The behavior used for scrolling.
     */
    previous(behavior?: ScrollBehavior): void;
    /**
     * Move the carousel forward by `slides-per-move` slides.
     *
     * @param behavior - The behavior used for scrolling.
     */
    next(behavior?: ScrollBehavior): void;
    /**
     * Scrolls the carousel to the slide specified by `index`.
     *
     * @param index - The slide index.
     * @param behavior - The behavior used for scrolling.
     */
    goToSlide(index: number, behavior?: ScrollBehavior): void;
    private scrollToSlide;
    render(): TemplateResult<1>;
}

/**
 * @summary A carousel item represent a slide within a [carousel](?s=atoms&id=/carousel).
 *
 * @since 2.0
 * @status experimental
 *
 * @slot - The carousel item's content..
 *
 * @cssproperty --aspect-ratio - The slide's aspect ratio. Inherited from the carousel by default.
 *
 */
export declare class CxCarouselItem extends CortexElement {
    static styles: CSSResultGroup;
    connectedCallback(): void;
    render(): TemplateResult<1>;
}

export declare type CxChangeEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary A chatbot component to interact with Cortex AI Assistant.
 *
 * @dependency cx-tooltip
 * @dependency cx-icon-button
 * @dependency cx-markdown
 * @dependency cx-icon
 * @dependency cx-typography
 * @dependency cx-checkbox
 * @dependency cx-menu
 * @dependency cx-menu-item
 * @dependency cx-input
 * @dependency cx-badge
 * @dependency cx-dropdown
 * @dependency cx-button
 * @dependency cx-divider
 *
 */
export declare class CxChatbot extends CortexElement {
    private readonly localize;
    static readonly styles: CSSResultGroup;
    chatbot: HTMLDivElement;
    overlay: HTMLDivElement;
    minimizedContent: HTMLDivElement;
    messagesContainer: HTMLDivElement;
    messageInput: CxInput;
    private isFullscreen;
    private isMinimized;
    private isOpen;
    private isTyping;
    private message;
    private lastMessage;
    private messages;
    private connection;
    private pingInterval;
    private botMessage;
    /** The conversation ID to connect to the chatbot */
    conversationId: string;
    /** The title of the chatbot */
    conversationTitle: string;
    /** The purpose of the conversation */
    conversationPurpose: string;
    /** The name of the chatbot */
    botName: string;
    /** The name of the user */
    userName: string;
    /** The events to show in the chatbot's menu */
    events: ChatbotEvent[];
    /** The connection URL to the chatbot */
    connectionURL: string;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    connect({ botName, connection, conversationId, conversationPurpose, }: {
        botName?: string;
        connection?: string | signalR.HubConnection;
        conversationId?: string;
        conversationPurpose?: string;
    }): void;
    show(): void;
    hide(): void;
    toggleFullScreen(): void;
    pingConnection(): void;
    adjustScroll(): Promise<void>;
    private sendMessage;
    private closeConnection;
    animateChatbot(): void;
    private renderTyping;
    private renderReferencePopup;
    private renderReferenceFooter;
    private renderMarkdown;
    private renderMessage;
    private renderMessageInput;
    private renderCloseButton;
    private renderExpandedContent;
    private renderMinimizedContent;
    render(): TemplateResult;
}

/**
 * @summary Checkboxes allow the user to toggle an option on or off.
 *
 * @dependency cx-icon
 *
 * @slot - The checkbox's label.
 * @slot help-text - Text that describes how to use the checkbox. Alternatively, you can use the `help-text` attribute.
 *
 * @event cx-blur - Emitted when the checkbox loses focus.
 * @event cx-change - Emitted when the checked state changes.
 * @event cx-focus - Emitted when the checkbox gains focus.
 * @event cx-input - Emitted when the checkbox receives input.
 * @event cx-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The square container that wraps the checkbox's checked state.
 * @csspart control--checked - Matches the control part when the checkbox is checked.
 * @csspart control--indeterminate - Matches the control part when the checkbox is indeterminate.
 * @csspart checked-icon - The checked icon, an `<cx-icon>` element.
 * @csspart indeterminate-icon - The indeterminate icon, an `<cx-icon>` element.
 * @csspart label - The container that wraps the checkbox's label.
 * @csspart form-control-help-text - The help text's wrapper.
 */
export declare class CxCheckbox extends CortexElement implements ShoelaceFormControl {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
    };
    private readonly formControlController;
    private readonly hasSlotController;
    input: HTMLInputElement;
    private hasFocus;
    title: string;
    /** The name of the checkbox, submitted as a name/value pair with form data. */
    name: string;
    /** The current value of the checkbox, submitted as a name/value pair with form data. */
    value: string;
    /** The checkbox's size. */
    size: 'small' | 'medium' | 'large';
    /** Disables the checkbox. */
    disabled: boolean;
    /** Draws the checkbox in a checked state. */
    checked: boolean;
    /**
     * Draws the checkbox in an indeterminate state. This is usually applied to checkboxes that represents a "select
     * all/none" behavior when associated checkboxes have a mix of checked and unchecked states.
     */
    indeterminate: boolean;
    /** The default value of the form control. Primarily used for resetting the form control. */
    defaultChecked: boolean;
    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    form: string;
    /** Makes the checkbox a required field. */
    required: boolean;
    /** The checkbox's help text. If you need to display HTML, use the `help-text` slot instead. */
    helpText: string;
    /** Gets the validity state object */
    get validity(): ValidityState;
    /** Gets the validation message */
    get validationMessage(): string;
    firstUpdated(): void;
    private handleClick;
    private handleBlur;
    private handleInput;
    private handleInvalid;
    private handleFocus;
    handleDisabledChange(): void;
    handleStateChange(): void;
    /** Simulates a click on the checkbox. */
    click(): void;
    /** Sets focus on the checkbox. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the checkbox. */
    blur(): void;
    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity(): boolean;
    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null;
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity(): boolean;
    /**
     * Sets a custom validation message. The value provided will be shown to the user when the form is submitted. To clear
     * the custom validation message, call this method with an empty string.
     */
    setCustomValidity(message: string): void;
    render(): TemplateResult<1>;
}

export declare type CxClearEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxCloseEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary Widget for managing cluster. Pure web component version of orangelogic.react.clustermanagement.
 *
 * @event cx-refresh - Emitted when a data refresh has been made.
 *
 * @csspart base - The component's base wrapper.
 * @csspart spinner - The spinner that gets displayed when no data is available yet.
 * @csspart alert - The alert that gets displayed when an error occurs.
 * @csspart service - The container that wraps around each service.
 * @csspart service__label - The label for each service.
 * @csspart service__range - The wrapper around each service's range sliders.
 * @csspart service__running-range - Each service's range slider for the currently running count.
 * @csspart service__desired-range - Each service's range slider for the desired count.
 * @csspart status - The container that wraps the status date and refresh button.
 * @csspart status__refresh-button - The button to refresh the data.
 * @csspart status__refresh-spinner - The spinner that gets displayed when data is being refreshed.
 * @csspart dialog - The dialog that gets displayed when confirming a change.
 * @csspart dialog__confirm-button - The confirm button inside the confirmation dialog.
 * @csspart dialog__cancel-button - The cancel button inside the confirmation dialog.
 *
 * @dependency cx-alert
 * @dependency cx-icon
 * @dependency cx-spinner
 * @dependency cx-range
 * @dependency cx-icon-button
 * @dependency cx-dialog
 * @dependency cx-format-date
 */
export declare class CxClusterManagement extends CortexElement {
    static styles: CSSResultGroup;
    private intervalIdRefresh;
    private readonly localize;
    dialog: CxDialog;
    refreshDate: CxFormatDate;
    private _status;
    get status(): "error" | "loading" | "ready";
    _isRefreshing: boolean;
    get isRefreshing(): boolean;
    private errorObject;
    private clusterData;
    private sliderDesiredCount;
    private confirmCount;
    /** How many seconds between each automatic data refresh */
    refreshInterval: number;
    /** A function used to get cluster data. We call this function every data refresh. */
    getClusterData: GetClusterDataFunction;
    /** A function used to update a service's count. Returns the updated service data. */
    updateService: UpdateServiceFunction;
    /** A function to clean up resources. Gets called when this component disconnects/unmounts. */
    cleanUp: () => void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    refreshStatus(): Promise<void>;
    private setStateForService;
    private confirmCallback;
    private handleChangeCommitted;
    private handleChange;
    private handleDialogConfirm;
    private handleDialogCancel;
    renderConfirm(): TemplateResult<1>;
    renderLoading(): TemplateResult<1>;
    renderError(): TemplateResult<1>;
    renderService(currentService: Service): TemplateResult<1>;
    render(): TemplateResult<1>;
}

export declare type CxCollapseEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary Color pickers allow the user to select a color.
 *
 * @dependency cx-button
 * @dependency cx-button-group
 * @dependency cx-dropdown
 * @dependency cx-input
 * @dependency cx-visually-hidden
 *
 * @slot label - The color picker's form label. Alternatively, you can use the `label` attribute.
 *
 * @event cx-blur - Emitted when the color picker loses focus.
 * @event cx-change - Emitted when the color picker's value changes.
 * @event cx-focus - Emitted when the color picker receives focus.
 * @event cx-input - Emitted when the color picker receives input.
 * @event cx-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 * @event cx-swatch-add - Emitted when a color is added to the custom swatches.
 *
 * @csspart base - The component's base wrapper.
 * @csspart trigger - The color picker's dropdown trigger.
 * @csspart swatches - The container that holds the swatches.
 * @csspart swatch - Each individual swatch.
 * @csspart grid - The color grid.
 * @csspart grid-handle - The color grid's handle.
 * @csspart slider - Hue and opacity sliders.
 * @csspart slider-handle - Hue and opacity slider handles.
 * @csspart hue-slider - The hue slider.
 * @csspart hue-slider-handle - The hue slider's handle.
 * @csspart opacity-slider - The opacity slider.
 * @csspart opacity-slider-handle - The opacity slider's handle.
 * @csspart preview - The preview color.
 * @csspart input - The text input.
 * @csspart eye-dropper-button - The eye dropper button.
 * @csspart eye-dropper-button__base - The eye dropper button's exported `button` part.
 * @csspart eye-dropper-button__prefix - The eye dropper button's exported `prefix` part.
 * @csspart eye-dropper-button__label - The eye dropper button's exported `label` part.
 * @csspart eye-dropper-button__suffix - The eye dropper button's exported `suffix` part.
 * @csspart eye-dropper-button__caret - The eye dropper button's exported `caret` part.
 * @csspart format-button - The format button.
 * @csspart format-button__base - The format button's exported `button` part.
 * @csspart format-button__prefix - The format button's exported `prefix` part.
 * @csspart format-button__label - The format button's exported `label` part.
 * @csspart format-button__suffix - The format button's exported `suffix` part.
 * @csspart format-button__caret - The format button's exported `caret` part.
 *
 * @cssproperty --grid-width - The width of the color grid.
 * @cssproperty --grid-height - The height of the color grid.
 * @cssproperty --grid-handle-size - The size of the color grid's handle.
 * @cssproperty --slider-height - The height of the hue and alpha sliders.
 * @cssproperty --slider-handle-size - The diameter of the slider's handle.
 * @cssproperty --swatch-size - The size of each predefined color swatch.
 */
export declare class CxColorPicker extends CortexElement implements ShoelaceFormControl {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-button': typeof CxButton;
        'cx-button-group': typeof CxButtonGroup;
        'cx-dropdown': typeof CxDropdown;
        'cx-icon': typeof CxIcon;
        'cx-input': typeof CxInput;
        'cx-visually-hidden': typeof CxVisuallyHidden;
    };
    private readonly formControlController;
    private isSafeValue;
    private readonly localize;
    base: HTMLElement;
    input: CxInput;
    dropdown: CxDropdown;
    previewButton: HTMLButtonElement;
    trigger: HTMLButtonElement;
    private hasFocus;
    private isDraggingGridHandle;
    private isEmpty;
    private inputValue;
    private hue;
    private saturation;
    private brightness;
    private alpha;
    /**
     * The current value of the color picker. The value's format will vary based the `format` attribute. To get the value
     * in a specific format, use the `getFormattedValue()` method. The value is submitted as a name/value pair with form
     * data.
     */
    value: string;
    /** The default value of the form control. Primarily used for resetting the form control. */
    defaultValue: string;
    /**
     * The color picker's label. This will not be displayed, but it will be announced by assistive devices. If you need to
     * display HTML, you can use the `label` slot` instead.
     */
    label: string;
    /** The variant of the form control. */
    variant: 'default' | 'button';
    /**
     * The format to use. If opacity is enabled, these will translate to HEXA, RGBA, HSLA, and HSVA respectively. The color
     * picker will accept user input in any format (including CSS color names) and convert it to the desired format.
     */
    format: 'hex' | 'rgb' | 'hsl' | 'hsv';
    /** Renders the color picker inline rather than in a dropdown. */
    inline: boolean;
    /** Determines the size of the color picker's trigger. This has no effect on inline color pickers. */
    size: 'small' | 'medium' | 'large';
    /** Removes the button that lets users toggle between format.   */
    noFormatToggle: boolean;
    /** The name of the form control, submitted as a name/value pair with form data. */
    name: string;
    /** Disables the color picker. */
    disabled: boolean;
    /**
     * Enable this option to prevent the panel from being clipped when the component is placed inside a container with
     * `overflow: auto|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all, scenarios.
     */
    hoist: boolean;
    /** Shows the opacity slider. Enabling this will cause the formatted value to be HEXA, RGBA, or HSLA. */
    opacity: boolean;
    /** By default, values are lowercase. With this attribute, values will be uppercase instead. */
    uppercase: boolean;
    /** Adds a clear button when the input is not empty. */
    clearable: boolean;
    /**
     * One or more predefined color swatches to display as presets in the color picker. Can include any format the color
     * picker can parse, including HEX(A), RGB(A), HSL(A), HSV(A), and CSS color names. Each color must be separated by a
     * semicolon (`;`). Alternatively, you can pass an array of color values to this property using JavaScript.
     */
    swatches: string | string[];
    /**
     * Similar to swatches, but for user-defined custom colors.
     */
    customSwatches: string | string[];
    /**
     *Set to true to display a loading spinner.
     */
    loading: boolean;
    /**
     * Set to true to display a button that allows user to add current color to custom swatches.
     */
    creatable: boolean;
    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    form: string;
    /** Makes the color picker a required field. */
    required: boolean;
    /** Gets the validity state object */
    get validity(): ValidityState;
    /** Gets the validation message */
    get validationMessage(): string;
    constructor();
    firstUpdated(): void;
    private handleCopy;
    private handleFocusIn;
    private handleFocusOut;
    private handleFormatToggle;
    private handleAlphaDrag;
    private handleHueDrag;
    private handleGridDrag;
    private handleAlphaKeyDown;
    private handleHueKeyDown;
    private handleGridKeyDown;
    private handleInputChange;
    private handleInputInput;
    private debouncedSetColor;
    private handleInputKeyDown;
    private handleInputInvalid;
    private handleTouchMove;
    private handleClear;
    private parseColor;
    private setColor;
    private setLetterCase;
    private syncValues;
    private handleAfterHide;
    private handleEyeDropper;
    private handleSwatchAdd;
    private selectSwatch;
    /** Generates a hex string from HSV values. Hue must be 0-360. All other arguments must be 0-100. */
    private getHexString;
    private stopNestedEventPropagation;
    handleFormatChange(): void;
    handleOpacityChange(): void;
    handleValueChange(oldValue: string | undefined, newValue: string): void;
    /** Sets focus on the color picker. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the color picker. */
    blur(): void;
    /** Returns the current value as a string in the specified format. */
    getFormattedValue(format?: 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hsv' | 'hsva'): string;
    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity(): boolean;
    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null;
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity(): boolean;
    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string): void;
    renderSwatches(swatches: string[]): ("" | TemplateResult<1>)[];
    render(): TemplateResult<1>;
}

/**
 * @summary Copies text data to the clipboard when the user clicks the trigger.
 *
 * @dependency cx-icon
 * @dependency cx-tooltip
 *
 * @event cx-copy - Emitted when the data has been copied.
 * @event cx-error - Emitted when the data could not be copied.
 *
 * @slot copy-icon - The icon to show in the default copy state. Works best with `<cx-icon>`.
 * @slot success-icon - The icon to show when the content is copied. Works best with `<cx-icon>`.
 * @slot error-icon - The icon to show when a copy error occurs. Works best with `<cx-icon>`.
 *
 * @csspart button - The internal `<button>` element.
 * @csspart copy-icon - The container that holds the copy icon.
 * @csspart success-icon - The container that holds the success icon.
 * @csspart error-icon - The container that holds the error icon.
 * @csspart tooltip__base - The tooltip's exported `base` part.
 * @csspart tooltip__base__popup - The tooltip's exported `popup` part.
 * @csspart tooltip__base__arrow - The tooltip's exported `arrow` part.
 * @csspart tooltip__body - The tooltip's exported `body` part.
 *
 * @cssproperty --success-color - The color to use for success feedback.
 * @cssproperty --error-color - The color to use for error feedback.
 *
 * @animation copy.in - The animation to use when feedback icons animate in.
 * @animation copy.out - The animation to use when feedback icons animate out.
 */
export declare class CxCopyButton extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
        'cx-tooltip': typeof CxTooltip;
    };
    private readonly localize;
    copyIcon: HTMLSlotElement;
    successIcon: HTMLSlotElement;
    errorIcon: HTMLSlotElement;
    tooltip: CxTooltip;
    isCopying: boolean;
    status: 'rest' | 'success' | 'error';
    /** The text value to copy. */
    value: string;
    /**
     * An id that references an element in the same document from which data will be copied. If both this and `value` are
     * present, this value will take precedence. By default, the target element's `textContent` will be copied. To copy an
     * attribute, append the attribute name wrapped in square brackets, e.g. `from="el[value]"`. To copy a property,
     * append a dot and the property name, e.g. `from="el.value"`.
     */
    from: string;
    /** Disables the copy button. */
    disabled: boolean;
    /** A custom label to show in the tooltip. */
    copyLabel: string;
    /** A custom label to show in the tooltip after copying. */
    successLabel: string;
    /** A custom label to show in the tooltip when a copy error occurs. */
    errorLabel: string;
    /** The length of time to show feedback before restoring the default trigger. */
    feedbackDuration: number;
    /** The preferred placement of the tooltip. */
    tooltipPlacement: 'top' | 'right' | 'bottom' | 'left';
    /**
     * Enable this option to prevent the tooltip from being clipped when the component is placed inside a container with
     * `overflow: auto|hidden|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all,
     * scenarios.
     */
    hoist: boolean;
    private handleCopy;
    private showStatus;
    render(): TemplateResult<1>;
}

export declare type CxCopyEvent = CustomEvent<{
    value: string;
}>;

/**
 * @summary Details show a brief summary and expand to show additional content.
 *
 * @dependency cx-icon
 *
 * @slot - The details' main content.
 * @slot summary - The details' summary. Alternatively, you can use the `summary` attribute.
 * @slot expand-icon - Optional expand icon to use instead of the default. Works best with `<cx-icon>`.
 * @slot collapse-icon - Optional collapse icon to use instead of the default. Works best with `<cx-icon>`.
 *
 * @event cx-show - Emitted when the details opens.
 * @event cx-after-show - Emitted after the details opens and all animations are complete.
 * @event cx-hide - Emitted when the details closes.
 * @event cx-after-hide - Emitted after the details closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper.
 * @csspart header - The header that wraps both the summary and the expand/collapse icon.
 * @csspart summary - The container that wraps the summary.
 * @csspart summary-icon - The container that wraps the expand/collapse icons.
 * @csspart content - The details content.
 *
 * @animation details.show - The animation to use when showing details. You can use `height: auto` with this animation.
 * @animation details.hide - The animation to use when hiding details. You can use `height: auto` with this animation.
 */
export declare class CxDetails extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
    };
    private readonly localize;
    details: HTMLDetailsElement;
    header: HTMLElement;
    body: HTMLElement;
    expandIconSlot: HTMLSlotElement;
    detailsObserver: MutationObserver;
    /**
     * Indicates whether or not the details is open. You can toggle this attribute to show and hide the details, or you
     * can use the `show()` and `hide()` methods and this attribute will reflect the details' open state.
     */
    open: boolean;
    /** The summary to show in the header. If you need to display HTML, use the `summary` slot instead. */
    summary: string;
    /** Disables the details so it can't be toggled. */
    disabled: boolean;
    firstUpdated(): void;
    disconnectedCallback(): void;
    private handleSummaryClick;
    private handleSummaryKeyDown;
    handleOpenChange(): Promise<void>;
    /** Shows the details. */
    show(): Promise<void>;
    /** Hides the details */
    hide(): Promise<void>;
    render(): TemplateResult<1>;
}

/**
 * @summary Dialogs, sometimes called "modals", appear above the page and require the user's immediate attention.
 *
 * @dependency cx-icon-button
 * @dependency cx-divider
 *
 * @slot - The dialog's main content.
 * @slot label - The dialog's label. Alternatively, you can use the `label` attribute.
 * @slot header-actions - Optional actions to add to the header. Works best with `<cx-icon-button>`.
 * @slot footer - The dialog's footer, usually one or more buttons representing various options.
 *
 * @event cx-show - Emitted when the dialog opens.
 * @event cx-after-show - Emitted after the dialog opens and all animations are complete.
 * @event cx-hide - Emitted when the dialog closes.
 * @event cx-after-hide - Emitted after the dialog closes and all animations are complete.
 * @event cx-initial-focus - Emitted when the dialog opens and is ready to receive focus. Calling
 *   `event.preventDefault()` will prevent focusing and allow you to set it on a different element, such as an input.
 * @event {{ source: 'close-button' | 'keyboard' | 'overlay' }} cx-request-close - Emitted when the user attempts to
 *   close the dialog by clicking the close button, clicking the overlay, or pressing escape. Calling
 *   `event.preventDefault()` will keep the dialog open. Avoid using this unless closing the dialog will result in
 *   destructive behavior such as data loss.
 *
 * @csspart base - The component's base wrapper.
 * @csspart overlay - The overlay that covers the screen behind the dialog.
 * @csspart panel - The dialog's panel (where the dialog and its content are rendered).
 * @csspart header - The dialog's header. This element wraps the title and header actions.
 * @csspart header-actions - Optional actions to add to the header. Works best with `<cx-icon-button>`.
 * @csspart title - The dialog's title.
 * @csspart close-button - The close button, an `<cx-icon-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 * @csspart body - The dialog's body.
 * @csspart footer - The dialog's footer.
 *
 * @cssproperty --width - The preferred width of the dialog. Note that the dialog will shrink to accommodate smaller screens.
 * @cssproperty --header-spacing - The amount of padding to use for the header.
 * @cssproperty --body-spacing - The amount of padding to use for the body.
 * @cssproperty --footer-spacing - The amount of padding to use for the footer.
 *
 * @animation dialog.show - The animation to use when showing the dialog.
 * @animation dialog.hide - The animation to use when hiding the dialog.
 * @animation dialog.denyClose - The animation to use when a request to close the dialog is denied.
 * @animation dialog.overlay.show - The animation to use when showing the dialog's overlay.
 * @animation dialog.overlay.hide - The animation to use when hiding the dialog's overlay.
 *
 * @property modal - Exposes the internal modal utility that controls focus trapping. To temporarily disable focus
 *   trapping and allow third-party modals spawned from an active Shoelace modal, call `modal.activateExternal()` when
 *   the third-party modal opens. Upon closing, call `modal.deactivateExternal()` to restore Shoelace's focus trapping.
 */
export declare class CxDialog extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-divider': typeof CxDivider;
        'cx-icon-button': typeof CxIconButton;
    };
    private readonly hasSlotController;
    private readonly localize;
    private originalTrigger;
    modal: Modal;
    private closeWatcher;
    dialog: HTMLElement;
    panel: HTMLElement;
    overlay: HTMLElement;
    private footerSlot;
    /**
     * Indicates whether or not the dialog is open. You can toggle this attribute to show and hide the dialog, or you can
     * use the `show()` and `hide()` methods and this attribute will reflect the dialog's open state.
     */
    open: boolean;
    /**
     * The dialog's label as displayed in the header. You should always include a relevant label even when using
     * `no-header`, as it is required for proper accessibility. If you need to display HTML, use the `label` slot instead.
     */
    label: string;
    /**
     * Disables the header. This will also remove the default close button, so please ensure you provide an easy,
     * accessible way for users to dismiss the dialog.
     */
    noHeader: boolean;
    /**
     * Determines how the popup is positioned. The `absolute` strategy works well in most cases, but if overflow is
     * clipped, using a `fixed` position strategy can often workaround it.
     */
    strategy: 'absolute' | 'fixed';
    firstUpdated(): void;
    disconnectedCallback(): void;
    private requestClose;
    private addOpenListeners;
    private removeOpenListeners;
    private handleDocumentKeyDown;
    handleOpenChange(): Promise<void>;
    /** Shows the dialog. */
    show(): Promise<void>;
    /** Hides the dialog */
    hide(): Promise<void>;
    render(): TemplateResult<1>;
}

/**
 * @summary Dividers are used to visually separate or group elements.
 *
 * @cssproperty --color - The color of the divider.
 * @cssproperty --width - The width of the divider.
 * @cssproperty --spacing - The spacing of the divider.
 */
export declare class CxDivider extends CortexElement {
    static styles: CSSResultGroup;
    /** Draws the divider in a vertical orientation. */
    vertical: boolean;
    connectedCallback(): void;
    handleVerticalChange(): void;
}

/**
 * `CxDocsExample` is a custom element that renders a code example along with a toggleable code block.
 * It allows users to view and copy the code snippet and see a live demo of the markup.
 *
 * The element works by extracting HTML content placed inside it (light DOM),
 * processing this content to remove unnecessary wrappers or adjust formatting,
 * and then displaying both the live content and its corresponding code in a formatted manner.
 *
 * @example
 * Example 1: Adding a div with slot="html"
 * This example demonstrates how to ensure that your content is slotted correctly.
 *
 * <cx-docs-example>
 *   <p slot="html">Your content here</p>
 * </cx-docs-example>
 *
 * @example
 * Example 2: Adding the slot to an existing div
 * This shows how to add the slot attribute if your content does not contain a wrapper element.
 * Note that in this case, the div will be stripped out of the code block on display.
 *
 * <cx-docs-example>
 *   <div slot="html">
 *     <existing-component></existing-component>
 *     <existing-component></existing-component>
 *   </div>
 * </cx-docs-example>
 *
 * @example
 * Example 3: Executing a script in the same context
 * This illustrates that a script tag included in the markup will be executed in the same context.
 * Note that you do not need to slot the script tag.
 *
 * <cx-docs-example>
 *   <div class="example-3" slot="html">
 *   </div>
 *
 *   <script>
 *     const el = document.querySelector('.example-3'); // works!
 *   </script>
 * </cx-docs-example>
 */
export declare class CxDocsExample extends CortexElement {
    static styles: CSSResult;
    private readonly localize;
    /**
     * Stores all the code markup contained within the component's light DOM.
     */
    markup: string;
    /**
     * Whether or not the code block is open.
     */
    isOpen: boolean;
    resizer: HTMLElement;
    preview: HTMLElement;
    connectedCallback(): void;
    handleToggle(): void;
    handleResizerDrag(event: MouseEvent | TouchEvent): void;
    render(): TemplateResult;
}

/**
 * @summary Downloader, but web component.
 *
 * @dependency cx-icon-button
 * @dependency cx-input
 * @dependency cx-icon
 * @dependency cx-button
 * @dependency cx-spinner
 * @dependency cx-tooltip
 * @dependency cx-menu
 * @dependency cx-menu-item
 * @dependency cx-switch
 * @dependency cx-range
 * @dependency cx-dropdown
 * @dependency cx-progress-bar
 * @dependency cx-badge
 * @dependency cx-dialog
 * @dependency cx-divider
 * @dependency cx-checkbox
 * @dependency cx-pagination
 * @dependency cx-typography
 *
 */
export declare class CxDownloader extends CortexElement {
    static readonly styles: CSSResultGroup;
    private manager;
    private fileEventsQueue;
    private cleanupHandlers;
    private readonly localize;
    downloader: HTMLDivElement;
    searchInput: CxInput;
    ctx: ExecutionContext | null;
    userId: string;
    workerURL: string;
    private _coordinates;
    get coordinates(): {
        x: number;
        y: number;
    };
    private _connected;
    get connected(): boolean;
    private isFullscreen;
    private isRocketMode;
    private isVisible;
    private chunkSize;
    private _downloadingFiles;
    get downloadingFiles(): DownloadItem[];
    get baseUrl(): string;
    get localStoragePrefix(): string;
    set downloadingFiles(newDownloadingFiles: DownloadItem[]);
    private allFiles;
    private sortedFiles;
    private pageIndex;
    private rowsPerPage;
    private filteredFiles;
    private _loading;
    get loading(): boolean;
    private errorMessage;
    private bandWidth;
    private defaultDownloadFolderName;
    private filterOptions;
    private isPausing;
    private isResuming;
    private isClearing;
    private isCancelling;
    private isRetrying;
    private isSearchOpen;
    private totalSize;
    updateTotalSize(): Promise<void>;
    private countByStatus;
    updateCountByStatus(): Promise<void>;
    private isAllDownloadingFilesCompleted;
    updateIsAllDownloadingFilesCompleted(): Promise<void>;
    cleanup(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    requestLocation(transactionID: string | null): void;
    requestDownload({ containerName, transactionID }: any): void;
    private buildDownloadManager;
    fireNotification(message: string, title: string | undefined, options: {
        notificationType: string;
    }): void;
    initDownloadManager(): Promise<void>;
    updateAllFiles(newAllFiles: Record<string, DownloadItem>): void;
    fetchAllFiles(): Promise<void>;
    updateFilesInterval: NodeJS.Timer | null;
    setUpdateFilesInterval(): void;
    checkDefaultRootNameInterval: NodeJS.Timer | null;
    setCheckDefaultRootNameInterval(): void;
    cancelSingle: (id: string) => void;
    onCancelAll: () => Promise<void>;
    onClear: (id: string) => void;
    onClearAll: () => Promise<void>;
    onPause: (id: string) => void;
    onPauseAll: () => Promise<void>;
    onResume: (id: string) => void;
    onResumeAll: () => Promise<void>;
    onRetry: (id: string) => void;
    onRetryAll: () => Promise<void>;
    selectDefaultRoot: () => void;
    removeDefaultRoot: () => void;
    updateSortedFiles(): Promise<void>;
    animateDownloader(): void;
    handleDrag(e: PointerEvent): void;
    hide(): void;
    show(): void;
    getDownloadingFilesFromLocalStorage(): void;
    onFilter(key: keyof DownloadItem, value: any): void;
    updateFilteredFiles(): void;
    renderSearch(): TemplateResult<1>;
    renderMassActions(): TemplateResult<1>;
    renderChunkSizeMarks(): TemplateResult<1>;
    renderSettingsButton(): TemplateResult;
    renderExpandButton(): TemplateResult;
    renderCloseButton(): TemplateResult;
    renderProgressBar({ progress, showProgress, size, status, unit, }: {
        progress: number;
        showProgress?: boolean;
        size: number;
        status: STATUS | null;
        unit: string;
    }): TemplateResult;
    renderTableHead(): TemplateResult;
    renderItemActions({ id, status, }: {
        id: string;
        status: STATUS;
    }): TemplateResult;
    renderTableRow(rowProps: DownloadItem): TemplateResult;
    renderTableView(): TemplateResult;
    renderBandWidth(showLabel?: boolean): TemplateResult;
    renderFullView(): TemplateResult;
    renderSmallView(): TemplateResult;
    render(): TemplateResult;
}

export declare type CxDragEnd = CustomEvent<Record<PropertyKey, never>>;

export declare type CxDragStart = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary Drawers slide in from a container to expose additional options and information.
 *
 * @dependency cx-icon-button
 *
 * @slot - The drawer's main content.
 * @slot label - The drawer's label. Alternatively, you can use the `label` attribute.
 * @slot header-actions - Optional actions to add to the header. Works best with `<cx-icon-button>`.
 * @slot footer - The drawer's footer, usually one or more buttons representing various options.
 *
 * @event cx-show - Emitted when the drawer opens.
 * @event cx-after-show - Emitted after the drawer opens and all animations are complete.
 * @event cx-hide - Emitted when the drawer closes.
 * @event cx-after-hide - Emitted after the drawer closes and all animations are complete.
 * @event cx-initial-focus - Emitted when the drawer opens and is ready to receive focus. Calling
 *   `event.preventDefault()` will prevent focusing and allow you to set it on a different element, such as an input.
 * @event {{ source: 'close-button' | 'keyboard' | 'overlay' }} cx-request-close - Emitted when the user attempts to
 *   close the drawer by clicking the close button, clicking the overlay, or pressing escape. Calling
 *   `event.preventDefault()` will keep the drawer open. Avoid using this unless closing the drawer will result in
 *   destructive behavior such as data loss.
 *
 * @csspart base - The component's base wrapper.
 * @csspart overlay - The overlay that covers the screen behind the drawer.
 * @csspart panel - The drawer's panel (where the drawer and its content are rendered).
 * @csspart header - The drawer's header. This element wraps the title and header actions.
 * @csspart header-actions - Optional actions to add to the header. Works best with `<cx-icon-button>`.
 * @csspart title - The drawer's title.
 * @csspart close-button - The close button, an `<cx-icon-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 * @csspart body - The drawer's body.
 * @csspart footer - The drawer's footer.
 *
 * @cssproperty --size - The preferred size of the drawer. This will be applied to the drawer's width or height
 *   depending on its `placement`. Note that the drawer will shrink to accommodate smaller screens.
 * @cssproperty --header-spacing - The amount of padding to use for the header.
 * @cssproperty --body-spacing - The amount of padding to use for the body.
 * @cssproperty --footer-spacing - The amount of padding to use for the footer.
 *
 * @animation drawer.showTop - The animation to use when showing a drawer with `top` placement.
 * @animation drawer.showEnd - The animation to use when showing a drawer with `end` placement.
 * @animation drawer.showBottom - The animation to use when showing a drawer with `bottom` placement.
 * @animation drawer.showStart - The animation to use when showing a drawer with `start` placement.
 * @animation drawer.hideTop - The animation to use when hiding a drawer with `top` placement.
 * @animation drawer.hideEnd - The animation to use when hiding a drawer with `end` placement.
 * @animation drawer.hideBottom - The animation to use when hiding a drawer with `bottom` placement.
 * @animation drawer.hideStart - The animation to use when hiding a drawer with `start` placement.
 * @animation drawer.denyClose - The animation to use when a request to close the drawer is denied.
 * @animation drawer.overlay.show - The animation to use when showing the drawer's overlay.
 * @animation drawer.overlay.hide - The animation to use when hiding the drawer's overlay.
 *
 * @property modal - Exposes the internal modal utility that controls focus trapping. To temporarily disable focus
 *   trapping and allow third-party modals spawned from an active Shoelace modal, call `modal.activateExternal()` when
 *   the third-party modal opens. Upon closing, call `modal.deactivateExternal()` to restore Shoelace's focus trapping.
 */
export declare class CxDrawer extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon-button': typeof CxIconButton;
    };
    private readonly hasSlotController;
    private readonly localize;
    private originalTrigger;
    modal: Modal;
    private closeWatcher;
    drawer: HTMLElement;
    panel: HTMLElement;
    overlay: HTMLElement;
    /**
     * Indicates whether or not the drawer is open. You can toggle this attribute to show and hide the drawer, or you can
     * use the `show()` and `hide()` methods and this attribute will reflect the drawer's open state.
     */
    open: boolean;
    /**
     * The drawer's label as displayed in the header. You should always include a relevant label even when using
     * `no-header`, as it is required for proper accessibility. If you need to display HTML, use the `label` slot instead.
     */
    label: string;
    /** The direction from which the drawer will open. */
    placement: 'top' | 'end' | 'bottom' | 'start';
    /**
     * By default, the drawer slides out of its containing block (usually the viewport). To make the drawer slide out of
     * its parent element, set this attribute and add `position: relative` to the parent.
     */
    contained: boolean;
    /**
     * Removes the header. This will also remove the default close button, so please ensure you provide an easy,
     * accessible way for users to dismiss the drawer.
     */
    noHeader: boolean;
    firstUpdated(): void;
    disconnectedCallback(): void;
    private requestClose;
    private addOpenListeners;
    private removeOpenListeners;
    private handleDocumentKeyDown;
    handleOpenChange(): Promise<void>;
    handleNoModalChange(): void;
    /** Shows the drawer. */
    show(): Promise<void>;
    /** Hides the drawer */
    hide(): Promise<void>;
    render(): TemplateResult<1>;
}

/**
 * @summary Dropdowns expose additional content that "drops down" in a panel.
 *
 * @dependency cx-popup
 *
 * @slot - The dropdown's main content.
 * @slot trigger - The dropdown's trigger, usually a `<cx-button>` element.
 *
 * @event cx-show - Emitted when the dropdown opens.
 * @event cx-after-show - Emitted after the dropdown opens and all animations are complete.
 * @event cx-hide - Emitted when the dropdown closes.
 * @event cx-after-hide - Emitted after the dropdown closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper.
 * @csspart trigger - The container that wraps the trigger.
 * @csspart panel - The panel that gets shown when the dropdown is open.
 *
 * @animation dropdown.show - The animation to use when showing the dropdown.
 * @animation dropdown.hide - The animation to use when hiding the dropdown.
 */
export declare class CxDropdown extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-popup': typeof CxPopup;
    };
    popup: CxPopup;
    trigger: HTMLSlotElement;
    panel: HTMLSlotElement;
    private readonly localize;
    private closeWatcher;
    /**
     * Indicates whether or not the dropdown is open. You can toggle this attribute to show and hide the dropdown, or you
     * can use the `show()` and `hide()` methods and this attribute will reflect the dropdown's open state.
     */
    open: boolean;
    /**
     * The preferred placement of the dropdown panel. Note that the actual placement may vary as needed to keep the panel
     * inside of the viewport.
     */
    placement: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
    /** Disables the dropdown so the panel will not open. */
    disabled: boolean;
    /**
     * By default, the dropdown is closed when an item is selected. This attribute will keep it open instead. Useful for
     * dropdowns that allow for multiple interactions.
     */
    stayOpenOnSelect: boolean;
    /**
     * The dropdown will close when the user interacts outside of this element (e.g. clicking). Useful for composing other
     * components that use a dropdown internally.
     */
    containingElement?: HTMLElement;
    /** The distance in pixels from which to offset the panel away from its trigger. */
    distance: number;
    /** The distance in pixels from which to offset the panel along its trigger. */
    skidding: number;
    /**
     * Enable this option to prevent the panel from being clipped when the component is placed inside a container with
     * `overflow: auto|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all, scenarios.
     */
    hoist: boolean;
    /**
     * Syncs the popup width or height to that of the trigger element.
     */
    sync: 'width' | 'height' | 'both' | undefined;
    /**
     * The factor by which to multiply the available width when using `auto-size`. E.g: Set to 0.5 to
     * make the popup half the width of the available space.
     */
    autoWidthFactor: number;
    connectedCallback(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    focusOnTrigger(): void;
    getMenu(): CxMenu | undefined;
    private handleKeyDown;
    private handleDocumentKeyDown;
    private handleDocumentMouseDown;
    private handlePanelSelect;
    handleTriggerClick(): void;
    handleTriggerKeyDown(event: KeyboardEvent): Promise<void>;
    handleTriggerKeyUp(event: KeyboardEvent): void;
    handleTriggerSlotChange(): void;
    updateAccessibleTrigger(): void;
    blurTrigger(): void;
    /** Shows the dropdown panel. */
    show(): Promise<void>;
    /** Hides the dropdown panel */
    hide(): Promise<void>;
    /**
     * Instructs the dropdown menu to reposition. Useful when the position or size of the trigger changes when the menu
     * is activated.
     */
    reposition(): void;
    addOpenListeners(): void;
    removeOpenListeners(): void;
    handleOpenChange(): Promise<void>;
    render(): TemplateResult<1>;
}

/**
 * @summary Details show a brief summary and expand to show additional content.
 *
 * @dependency cx-icon
 *
 * @slot - The details' main content.
 * @slot summary - The details' summary. Alternatively, you can use the `summary` attribute.
 * @slot expand-icon - Optional expand icon to use instead of the default. Works best with `<cx-icon>`.
 * @slot collapse-icon - Optional collapse icon to use instead of the default. Works best with `<cx-icon>`.
 *
 * @event cx-show - Emitted when the details opens.
 * @event cx-after-show - Emitted after the details opens and all animations are complete.
 * @event cx-hide - Emitted when the details closes.
 * @event cx-after-hide - Emitted after the details closes and all animations are complete.
 *
 * @csspart base - The component's base wrapper.
 * @csspart summary - The container that wraps the summary.
 * @csspart summary-icon - The container that wraps the expand/collapse icons.
 * @csspart content - The details content.
 *
 * @animation details.show - The animation to use when showing details. You can use `height: auto` with this animation.
 * @animation details.hide - The animation to use when hiding details. You can use `height: auto` with this animation.
 */
export declare class CxElementClamp extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
    };
    private readonly localize;
    private resizeObserver;
    body: HTMLElement;
    expandIconSlot: HTMLSlotElement;
    /**
     * Indicates whether or not the details is open. You can toggle this attribute to show and hide the details, or you
     * can use the `show()` and `hide()` methods and this attribute will reflect the details' open state.
     */
    open: boolean;
    /**
     * Disables the details so it can't be toggled.
     */
    disabled: boolean;
    /**
     * The number of elements to show before clamping.
     */
    elements: number;
    /**
     * The root element to use for the intersection observer.
     */
    root: string;
    /**
     * Whether to animate the opening and closing of the details.
     */
    animation: boolean;
    /**
     * Whether to show the show more button.
     */
    showMore: boolean;
    /**
     * The text to show on the show more button.
     */
    showMoreText: string;
    /**
     * The text to show on the show less button.
     */
    showLessText: string;
    /**
     * The event to listen to for rerendering the component
     */
    rerenderEvent: string;
    /**
     * Whether to show the show more button.
     */
    private showButton;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleClick;
    private replaceRootId;
    getCollapsedHeight(): number;
    handleChange(): Promise<void>;
    handleOpenChange(): Promise<void>;
    /** Shows the details. */
    show(): Promise<void>;
    /** Hides the details */
    hide(): Promise<void>;
    render(): TemplateResult<1>;
}

export declare type CxErrorEvent = CustomEvent<{
    status?: number;
}>;

declare type CxEventInit<T> = T extends keyof GlobalEventHandlersEventMap ? GlobalEventHandlersEventMap[T] extends CustomEvent<Record<PropertyKey, unknown>> ? GlobalEventHandlersEventMap[T] extends CustomEvent<Record<PropertyKey, never>> ? CustomEventInit<GlobalEventHandlersEventMap[T]['detail']> : Partial<GlobalEventHandlersEventMap[T]['detail']> extends GlobalEventHandlersEventMap[T]['detail'] ? CustomEventInit<GlobalEventHandlersEventMap[T]['detail']> : WithRequired<CustomEventInit<GlobalEventHandlersEventMap[T]['detail']>, 'detail'> : CustomEventInit : CustomEventInit;

export declare type CxExpandEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxFinishEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxFocusEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary Formats a number as a human readable bytes value.
 */
export declare class CxFormatBytes extends CortexElement {
    private readonly localize;
    /** The number to format in bytes. */
    value: number;
    /** The type of unit to display. */
    unit: 'byte' | 'bit';
    /** Determines how to display the result, e.g. "100 bytes", "100 b", or "100b". */
    display: 'long' | 'short' | 'narrow';
    render(): string;
}

/**
 * @summary Formats a date/time using the specified locale and options.
 */
export declare class CxFormatDate extends CortexElement {
    private readonly localize;
    /**
     * The date/time to format. If not set, the current date and time will be used. When passing a string, it's strongly
     * recommended to use the ISO 8601 format to ensure timezones are handled correctly. To convert a date to this format
     * in JavaScript, use [`date.toISOString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString).
     */
    date: Date | string;
    /** The format for displaying the weekday. */
    weekday: FormatDateWeekday;
    /** The format for displaying the era. */
    era: FormatDateEra;
    /** The format for displaying the year. */
    year: FormatDateYear;
    /** The format for displaying the month. */
    month: FormatDateMonth;
    /** The format for displaying the day. */
    day: FormatDateDay;
    /** The format for displaying the hour. */
    hour: FormatDateHour;
    /** The format for displaying the minute. */
    minute: FormatDateMinute;
    /** The format for displaying the second. */
    second: FormatDateSecond;
    /** The format for displaying the time. */
    timeZoneName: FormatDateTimeZoneName;
    /** The time zone to express the time in. */
    timeZone: string;
    /** The format for displaying the hour. */
    hourFormat: FormatDateTimeZoneHour;
    render(): TemplateResult<1> | undefined;
}

/**
 * @summary Formats a number using the specified locale and options.
 */
export declare class CxFormatNumber extends CortexElement {
    private readonly localize;
    /** The number to format. */
    value: number;
    /** The formatting style to use. */
    type: FormatNumberType;
    /** Turns off grouping separators. */
    noGrouping: boolean;
    /** The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code to use when formatting. */
    currency: string;
    /** How to display the currency. */
    currencyDisplay: FormatNumberCurrencyDisplay;
    /** The minimum number of integer digits to use. Possible values are 1-21. */
    minimumIntegerDigits: number;
    /** The minimum number of fraction digits to use. Possible values are 0-20. */
    minimumFractionDigits: number;
    /** The maximum number of fraction digits to use. Possible values are 0-0. */
    maximumFractionDigits: number;
    /** The minimum number of significant digits to use. Possible values are 1-21. */
    minimumSignificantDigits: number;
    /** The maximum number of significant digits to use,. Possible values are 1-21. */
    maximumSignificantDigits: number;
    render(): string;
}

/**
 * @summary
 *
 * @event
 */
export declare class CxGraphView extends CortexElement {
    static styles: CSSResult[];
    private readonly localize;
    data: Workflow;
    readonly: boolean;
    hideControls: boolean;
    renderDelay: number;
    selectNodesWhenLayout(_nodeIds?: string[]): void;
    selectNodes(_nodeIds?: string[]): void;
    handleAddNode(params: CxGraphViewAddNodeParams): void;
    handleSelectNode(params: CxGraphViewSelectNodeParams): void;
    handleSelectEdge(params: CxGraphViewSelectEdgeParams): void;
    handlePaneClick(params: CxGraphViewPaneClickParams): void;
    handleUnlink(params: Edge): void;
    addNodes(nodes: Node_2[] | Node_2): void;
    addEdges(edges: Edge[] | Edge): void;
    removeNodes(nodeId: string | string[]): void;
    removeEdges(link: Edge | Edge[]): void;
    updateNodeData(nodeId: string, data: Node_2): void;
    getData(): Workflow;
    render(): TemplateResult<1>;
}

declare type CxGraphViewAddNodeParams = {
    sourceNode: string;
    targetNode?: string;
    transition?: string;
    type: string;
};

declare type CxGraphViewPaneClickParams = {
    event: default_3.MouseEvent;
};

declare type CxGraphViewSelectEdgeParams = {
    edges: Edge[];
};

declare type CxGraphViewSelectNodeParams = {
    nodes: string[];
};

/**
 * @summary The responsive layout grid adapts to screen size and orientation, ensuring consistency across layouts.
 *
 * @slot - The component's main content.
 *
 * @csspart content - The component's content.
 */
export declare class CxGrid extends CortexElement {
    static styles: CSSResultGroup;
    defaultSlot: HTMLSlotElement;
    /** The space between children. */
    spacing: string | number;
    /** The number of columns to display. */
    columns: number;
    /** Whether to use flex gap or not. */
    useFlexGap: boolean;
    /** The space between columns. It overrides the value of the spacing prop. */
    columnSpacing: string | number;
    /** The space between rows. It overrides the value of the spacing prop. */
    rowSpacing: string | number;
    /** Defines the flex-wrap style property.*/
    wrap: 'nowrap' | 'wrap' | 'wrap-reverse';
    /** Whether to use the "@container" query or not. */
    useContainer: boolean;
    private handleSlotChange;
    render(): TemplateResult<1>;
}

/**
 * @summary The item of a Grid layout.
 *
 * @slot - The component’s's main content.
 *
 * @csspart body -The component’s content
 */
export declare class CxGridItem extends CortexElement {
    static styles: CSSResultGroup;
    xs: number | boolean | 'auto';
    sm: number | null | boolean | 'auto';
    md: number | null | boolean | 'auto';
    lg: number | null | boolean | 'auto';
    xl: number | null | boolean | 'auto';
    useContainer: boolean;
    handleXsChange(): void;
    render(): TemplateResult<1>;
}

export declare type CxHideEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxHoverEvent = CustomEvent<{
    phase: 'start' | 'move' | 'end';
    value: number;
}>;

/**
 * @summary The `cx-hub-connection` component is used to establish a connection to a SignalR hub.
 * https://learn.microsoft.com/en-us/javascript/api/%40microsoft/signalr/hubconnection?view=signalr-js-latest
 */
export declare class CxHubConnection extends CortexElement {
    private connection;
    /**
     * In case the connection is re-established, we need to re-register the event listeners.
     * This set stores the names of the method names that are being watched.
     */
    private readonly watchedMethods;
    /** The url of the HubConnection to the server. */
    baseUrl: string;
    /** Default interval at which to ping the server in milliseconds. */
    keepAliveIntervalInMilliseconds: number;
    /** A boolean value that determines whether the negotiation step should be skipped when connecting to the server. */
    skipNegotiation: boolean;
    /** The transport type for the connection. */
    transport: signalR.HttpTransportType;
    connectMode: 'manual' | 'auto';
    connectedCallback(): void;
    private readonly emitEvent;
    private registerEventListeners;
    onBaseUrlChanged(): void;
    /** Starts the connection.
     * @returns A Promise that resolves when the connection is successfully started, or rejects with an error.
     */
    start(): Promise<void>;
    /** Stops the connection.
     * @returns A Promise that resolves when the connection is successfully stopped, or rejects with an error.
     */
    stop(): Promise<void>;
    /**
     * Invokes a hub method on the server using the specified method name and arguments.
     * @param methodName The name of the server method to invoke.
     * @param args The arguments to pass to the server method.
     * @returns A Promise that resolves with the result of the server method (if any), or rejects with an error.
     */
    invoke(methodName: string, ...args: any[]): Promise<any>;
}

/**
 * @summary Icons are symbols that can be used to represent various options within an application.
 *
 * https://fonts.google.com/icons
 *
 * @csspart span - The internal span element.
 */
export declare class CxIcon extends CortexElement {
    static styles: CSSResultGroup;
    /** The name of the icon to draw. Available names depend on the icon library being used. */
    name: string;
    /** The src of the icon for custom icons. */
    src: string;
    /**
     * An alternate description to use for assistive devices. If omitted, the icon will be considered presentational and
     * ignored by assistive devices.
     */
    label: string;
    /** The variant of the icon to draw. */
    variant: 'outlined' | 'filled' | 'round' | 'sharp' | 'two-tone' | 'fa';
    /** The class of the Font Awesome icon to draw */
    iconClass: string;
    private fontLoaded;
    checkFontLoaded: () => void;
    handleVariantChange(): void;
    handleLabelChange(): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Icons buttons are simple, icon-only buttons that can be used for actions and in toolbars.
 *
 * @dependency cx-icon
 *
 * @event cx-blur - Emitted when the icon button loses focus.
 * @event cx-focus - Emitted when the icon button gains focus.
 *
 * @csspart base - The component's base wrapper.
 */
export declare class CxIconButton extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
    };
    button: HTMLButtonElement | HTMLLinkElement;
    icon: CxIcon;
    private hasFocus;
    /** The name of the icon to draw. */
    name?: string;
    /** The variant of the icon to draw. */
    variant: 'outlined' | 'filled' | 'round' | 'sharp' | 'two-tone';
    /**
     * An external URL of an SVG file. Be sure you trust the content you are including, as it will be executed as code and
     * can result in XSS attacks.
     */
    src?: string;
    /** When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`. */
    href?: string;
    /** Tells the browser where to open the link. Only used when `href` is set. */
    target?: '_blank' | '_parent' | '_self' | '_top';
    /** Tells the browser to download the linked file as this filename. Only used when `href` is set. */
    download?: string;
    /**
     * A description that gets read by assistive devices. For optimal accessibility, you should always include a label
     * that describes what the icon button does.
     */
    label: string;
    /** Disables the button. */
    disabled: boolean;
    /** The class of the Font Awesome icon to draw */
    iconClass: string;
    /** The button's size. */
    size: 'small' | 'medium' | 'large' | 'x-large';
    /** Draws an outlined button. */
    outline: boolean;
    /**
     * Draws a circular icon button.
     */
    circle: boolean;
    firstUpdated(): void;
    syncStyles(): void;
    private handleBlur;
    private handleFocus;
    private handleClick;
    /** Simulates a click on the icon button. */
    click(): void;
    /** Sets focus on the icon button. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the icon button. */
    blur(): void;
    render(): TemplateResult;
}

/**
 * @summary Compare visual differences between similar photos with a sliding panel.
 *
 * @dependency cx-icon
 *
 * @slot before - The before image, an `<img>` or `<svg>` element.
 * @slot after - The after image, an `<img>` or `<svg>` element.
 * @slot handle - The icon used inside the handle.
 *
 * @event cx-change - Emitted when the position changes.
 *
 * @csspart base - The component's base wrapper.
 * @csspart before - The container that wraps the before image.
 * @csspart after - The container that wraps the after image.
 * @csspart divider - The divider that separates the images.
 * @csspart handle - The handle that the user drags to expose the after image.
 *
 * @cssproperty --divider-width - The width of the dividing line.
 * @cssproperty --handle-size - The size of the compare handle.
 */
export declare class CxImageComparer extends CortexElement {
    static styles: CSSResultGroup;
    static scopedElement: {
        'cx-icon': typeof CxIcon;
    };
    private readonly localize;
    base: HTMLElement;
    handle: HTMLElement;
    /** The position of the divider as a percentage. */
    position: number;
    private handleDrag;
    private handleKeyDown;
    handlePositionChange(): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Includes give you the power to embed external HTML files into the page.
 *
 * @event cx-load - Emitted when the included file is loaded.
 * @event {{ status: number }} cx-error - Emitted when the included file fails to load due to an error.
 */
export declare class CxInclude extends CortexElement {
    static styles: CSSResultGroup;
    /**
     * The location of the HTML file to include. Be sure you trust the content you are including as it will be executed as
     * code and can result in XSS attacks.
     */
    src: string;
    /** The fetch mode to use. */
    mode: 'cors' | 'no-cors' | 'same-origin';
    /**
     * Allows included scripts to be executed. Be sure you trust the content you are including as it will be executed as
     * code and can result in XSS attacks.
     */
    allowScripts: boolean;
    private executeScript;
    handleSrcChange(): Promise<void>;
    render(): TemplateResult<1>;
}

export declare type CxInitialFocusEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary Inputs collect data from the user.
 *
 * @dependency cx-icon
 *
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 * @slot prefix - Used to prepend a presentational icon or similar element to the input.
 * @slot suffix - Used to append a presentational icon or similar element to the input.
 * @slot clear-icon - An icon to use in lieu of the default clear icon.
 * @slot show-password-icon - An icon to use in lieu of the default show password icon.
 * @slot hide-password-icon - An icon to use in lieu of the default hide password icon.
 * @slot help-text - Text that describes how to use the input. Alternatively, you can use the `help-text` attribute.
 * @slot file-button - The button that opens the file picker. Alternatively, you can use the `file-button-label` attribute.
 *
 * @event cx-blur - Emitted when the control loses focus.
 * @event cx-change - Emitted when an alteration to the control's value is committed by the user.
 * @event cx-clear - Emitted when the clear button is activated.
 * @event cx-focus - Emitted when the control gains focus.
 * @event cx-input - Emitted when the control receives input.
 * @event cx-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 * @event cx-keydown - Emitted when a key is pressed down on the control.
 *
 * @csspart form-control - The form control that wraps the label, input, and help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-input - The input's wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart base - The component's base wrapper.
 * @csspart input - The internal `<input>` control.
 * @csspart prefix - The container that wraps the prefix.
 * @csspart clear-button - The clear button.
 * @csspart password-toggle-button - The password toggle button.
 * @csspart suffix - The container that wraps the suffix.
 */
export declare class CxInput extends CortexElement implements ShoelaceFormControl {
    #private;
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
    };
    private readonly formControlController;
    private readonly hasSlotController;
    private readonly localize;
    input: HTMLInputElement;
    inputContainer: HTMLElement;
    labelElement: HTMLElement;
    private hasFocus;
    private maskInstance;
    private containerClicked;
    title: string;
    private __numberInput;
    private __dateInput;
    /**
     * The type of input. Works the same as a native `<input>` element, but only a subset of types are supported. Defaults
     * to `text`.
     */
    type: 'date' | 'datetime-local' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'file' | 'url';
    /** The name of the input, submitted as a name/value pair with form data. */
    name: string;
    /** The current value of the input, submitted as a name/value pair with form data. */
    value: string;
    /** If used with mask, this stores the input's value, with fixed strings omitted. */
    unmaskedValue: string;
    /** The default value of the form control. Primarily used for resetting the form control. */
    defaultValue: string;
    /** The input's size. */
    size: 'small' | 'medium' | 'large';
    /** Draws a filled input. */
    filled: boolean;
    /** Draws a pill-style input with rounded edges. */
    pill: boolean;
    /** The input's label. If you need to display HTML, use the `label` slot instead. */
    label: string;
    /** The input's help text. If you need to display HTML, use the `help-text` slot instead. */
    helpText: string;
    /** Adds a clear button when the input is not empty. */
    clearable: boolean;
    /** Disables the input. */
    disabled: boolean;
    /** Placeholder text to show as a hint when the input is empty. */
    placeholder: string;
    /** Makes the input readonly. */
    readonly: boolean;
    /** Adds a button to toggle the password's visibility. Only applies to password types. */
    passwordToggle: boolean;
    /** Determines whether or not the password is currently visible. Only applies to password input types. */
    passwordVisible: boolean;
    /** Hides the browser's built-in increment/decrement spin buttons for number inputs. */
    noSpinButtons: boolean;
    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    form: string;
    /** Makes the input a required field. */
    required: boolean;
    /** A regular expression pattern to validate input against. */
    pattern: string;
    /** The minimum length of input that will be considered valid. */
    minlength: number;
    /** The maximum length of input that will be considered valid. */
    maxlength: number;
    /** The input's minimum value. Only applies to date and number input types. */
    min: number | string;
    /** The input's maximum value. Only applies to date and number input types. */
    max: number | string;
    /**
     * Specifies the granularity that the value must adhere to, or the special value `any` which means no stepping is
     * implied, allowing any numeric value. Only applies to date and number input types.
     */
    step: number | 'any';
    /** Controls whether and how text input is automatically capitalized as it is entered by the user. */
    autocapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
    /** Indicates whether the browser's autocorrect feature is on or off. */
    autocorrect: 'off' | 'on';
    /**
     * Specifies what permission the browser has to provide assistance in filling out form field values. Refer to
     * [this page on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for available values.
     */
    autocomplete: HTMLInputElement['autocomplete'];
    /** Indicates that the input should receive focus on page load. */
    autofocus: boolean;
    /** Used to customize the label or icon of the Enter key on virtual keyboards. */
    enterkeyhint: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
    /** Enables spell checking on the input. */
    spellcheck: boolean;
    /**
     * Tells the browser what type of data will be entered by the user, allowing it to display the appropriate virtual
     * keyboard on supportive devices.
     */
    inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    /**
     * The mask pattern to apply to the input.
     */
    mask: string;
    /**
     * The character to use as a placeholder when the input is empty. Defaults to '_'.
     */
    maskPlaceholder: string;
    /**
     * Whether or not to lazy mask the input. When `true`, the mask will only be applied after the user starts typing.
     */
    maskLazy: boolean;
    /**
     * Enables characters overwriting instead of inserting.
     */
    maskOverwrite: 'shift' | boolean;
    /**
     * The `accept` attribute of the file input. This attribute contains a comma-separated list of unique file type
     * For example, `accept="image/png, image/jpeg"`.
     */
    accept: string;
    /**
     * The `multiple` attribute of the file input. This attribute indicates that the user can enter more than one value.
     */
    multiple: boolean;
    /** The Choose file's theme variant. */
    variant: ButtonVariant;
    fileButtonLabel: string;
    buttonOnly: boolean;
    fileResultLabel: string | ((files: FileList | null) => string);
    /**
     * Gets or sets the current value as a `Date` object. Returns `null` if the value can't be converted. This will use the native `<input type="{{type}}">` implementation and may result in an error.
     */
    get valueAsDate(): Date | null;
    set valueAsDate(newValue: Date | null);
    /** Gets or sets the current value as a number. Returns `NaN` if the value can't be converted. */
    get valueAsNumber(): number;
    set valueAsNumber(newValue: number);
    /** Gets the validity state object */
    get validity(): ValidityState;
    /** Gets the validation message */
    get validationMessage(): string;
    initMaskInstance(): void;
    connectedCallback(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    private handleBlur;
    private handleChange;
    private handleClearClick;
    private handleFocus;
    private handleMaskAccept;
    private handleInput;
    private handleInvalid;
    private handleKeyDown;
    private handlePasswordToggle;
    private handleFileButtonClick;
    private handleContainerMouseDown;
    handleDisabledChange(): void;
    handleStepChange(): void;
    handleValueChange(): Promise<void>;
    /** Sets focus on the input. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the input. */
    blur(): void;
    /** Selects all the text in the input. */
    select(): void;
    /** Sets the start and end positions of the text selection (0-based). */
    setSelectionRange(selectionStart: number, selectionEnd: number, selectionDirection?: 'forward' | 'backward' | 'none'): void;
    /** Replaces a range of text with a new string. */
    setRangeText(replacement: string, start?: number, end?: number, selectMode?: 'select' | 'start' | 'end' | 'preserve'): void;
    /** Displays the browser picker for an input element (only works if the browser supports it for the input type). */
    showPicker(): void;
    /** Increments the value of a numeric input type by the value of the step attribute. */
    stepUp(): void;
    /** Decrements the value of a numeric input type by the value of the step attribute. */
    stepDown(): void;
    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity(): boolean;
    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null;
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity(): boolean;
    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string): void;
    render(): TemplateResult<1>;
}

export declare type CxInputEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary Input groups can be used to group related inputs into sections.
 *
 * @slot - One or more `<cx-input>` elements to display in the input group.
 *
 * @csspart base - The component's base wrapper.
 */
export declare class CxInputGroup extends CortexElement {
    static readonly styles: CSSResultGroup;
    defaultSlot: HTMLSlotElement;
    /**
     * A label to use for the input group. This won't be displayed on the screen, but it will be announced by assistive
     * devices when interacting with the control and is strongly recommended.
     */
    label: string;
    private handleFocus;
    private handleBlur;
    private handleMouseOver;
    private handleMouseOut;
    private handleSlotChange;
    render(): TemplateResult;
}

export declare type CxInvalidEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxInvokedEvent = CustomEvent<Record<PropertyKey, any>>;

export declare type CxKeydownEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxLazyChangeEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxLazyLoadEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary A web component for clamping text to a specific number of lines, allowing for single or multiline ellipsis.
 *
 * @csspart content - The component's content wrapper.
 */
export declare class CxLineClamp extends CortexElement {
    static styles: CSSResultGroup;
    /**
     * The number of lines to clamp the text to.
     */
    lines: number;
    /**
     * Whether the content is open or not.
     */
    open: boolean;
    /**
     * Whether to show the show more button.
     */
    showMore: boolean;
    /**
     * The text to show on the show more button.
     */
    showMoreText: string;
    /**
     * The text to show on the show less button.
     */
    showLessText: string;
    /**
     * The tooltip to show. When this prop is set, the component will always show a tooltip.
     */
    tooltip: string;
    disabledTooltip: boolean;
    /**
     * Whether the text is clamped or not.
     */
    isClamped: boolean;
    /**
     * The content to show in the tooltip when the text is clamped.
     */
    tooltipContent: string;
    /**
     * Whether the component has calculated the clamped state.
     */
    calculated: boolean;
    /**
     * The content element.
     */
    content: HTMLElement;
    firstUpdated(): void;
    /**
     * This works by comparing the scrollHeight of the element to its clientHeight. When the text is clamped,
     * the scroll height extends below the element's visible area (clientHeight). When the text is not clamped,
     * the scroll height is the same as the clientHeight.
     */
    isTextClamped(element: Element): boolean;
    handleResize(): void;
    toggleShowingMore(): void;
    render(): TemplateResult<1>;
}

export declare type CxLoadEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary Renders markdown passed in as a string. cx-markdown is a Light DOM element, so can be styled
 * from outside the Shadow DOM.
 *
 * @event cx-ready - Emitted when the markdown has been rendered.
 */
export declare class CxMarkdown extends CortexLightElement {
    #private;
    /**
     * The class name to apply to the root element. As this is a light DOM element, it can be styled
     * from outside the Shadow DOM.
     */
    classname: string;
    liveScript: boolean;
    /**
     * The markdown to render.
     */
    markdown: string;
    /**
     * A marked renderer object to use when rendering the markdown. This overrides the current renderer
     * only for those methods that are specifically defined on the passed in renderer object.
     */
    renderer: RendererObject;
    /**
     * Extensions to add to the marked parser.
     */
    extensions: TokenizerAndRendererExtension[];
    /**
     * The rendered markdown.
     */
    rendered: string;
    connectedCallback(): void;
    updateRendered(): void;
    render(): TemplateResult;
    updated(): Promise<void>;
}

/**
 * @summary Menus provide a list of options for the user to choose from.
 *
 * @slot - The menu's content, including menu items, menu labels, and dividers.
 *
 * @event {{ item: CxMenuItem }} cx-select - Emitted when a menu item is selected.
 */
export declare class CxMenu extends CortexElement {
    static styles: CSSResultGroup;
    defaultSlot: HTMLSlotElement;
    horizontal: boolean;
    connectedCallback(): void;
    private handleClick;
    private handleKeyDown;
    private handleMouseDown;
    private handleSlotChange;
    private isMenuSection;
    private isMenuItem;
    /* Excluded from this release type: getAllItems */
    /* Excluded from this release type: getCurrentItem */
    /* Excluded from this release type: setCurrentItem */
    render(): TemplateResult<1>;
}

/**
 * @summary Menu items provide options for the user to pick from in a menu.
 *
 * @dependency cx-icon
 * @dependency cx-popup
 * @dependency cx-spinner
 *
 * @slot - The menu item's label.
 * @slot prefix - Used to prepend an icon or similar element to the menu item.
 * @slot suffix - Used to append an icon or similar element to the menu item.
 * @slot submenu - Used to denote a nested menu.
 *
 * @csspart base - The component's base wrapper.
 * @csspart checked-icon - The checked icon, which is only visible when the menu item is checked.
 * @csspart prefix - The prefix container.
 * @csspart label - The menu item label.
 * @csspart suffix - The suffix container.
 * @csspart spinner - The spinner that shows when the menu item is in the loading state.
 * @csspart spinner__base - The spinner's base part.
 * @csspart submenu-icon - The submenu icon, visible only when the menu item has a submenu (not yet implemented).
 *
 * @cssproperty [--submenu-offset=-2px] - The distance submenus shift to overlap the parent menu.
 */
export declare class CxMenuItem extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
        'cx-popup': typeof CxPopup;
        'cx-spinner': typeof CxSpinner;
    };
    private cachedTextLabel;
    defaultSlot: HTMLSlotElement;
    menuItem: HTMLElement;
    /** The type of menu item to render. To use `checked`, this value must be set to `checkbox`. */
    type: 'normal' | 'checkbox';
    /** Draws the item in a checked state. */
    checked: boolean;
    /** A unique value to store in the menu item. This can be used as a way to identify menu items when selected. */
    value: string;
    /** Draws the menu item in a loading state. */
    loading: boolean;
    /** Draws the menu item in a disabled state, preventing selection. */
    disabled: boolean;
    /** Makes the menu item readonly */
    readonly: boolean;
    /** The flip boundary for the submenu. */
    flipBoundary: Element | Element[];
    /** The shift boundary for the submenu. */
    shiftBoundary: Element | Element[];
    /** The autosize boundary for the submenu. */
    autoSizeBoundary: Element | Element[];
    private readonly localize;
    private readonly hasSlotController;
    private readonly submenuController;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleDocumentWheel;
    private handleDefaultSlotChange;
    private handleHostClick;
    private handleMouseOver;
    handleCheckedChange(): void;
    handleDisabledChange(): void;
    handleTypeChange(): void;
    /** Returns a text label based on the contents of the menu item's default slot. */
    getTextLabel(): string;
    isSubmenu(): boolean;
    render(): TemplateResult<1>;
}

/**
 * @summary Menu labels are used to describe a group of menu items.
 *
 * @slot - The menu label's content.
 *
 * @csspart base - The component's base wrapper.
 */
export declare class CxMenuLabel extends CortexElement {
    static styles: CSSResultGroup;
    render(): TemplateResult<1>;
}

/**
 * @summary Menu sections provide a mean for grouping together related menu items.
 *
 * @slot - The menu items in the section.
 *
 */
export declare class CxMenuSection extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-menu-label': typeof CxMenuLabel;
    };
    defaultSlot: HTMLSlotElement;
    label: string;
    connectedCallback(): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Multi-select allows the user to select multiple items from a list. The items can be moved between two columns. The user can move items between the columns by dragging and dropping them.
 * @element cx-multi-select
 *
 * @event {{ items: BoardItem[], name: string }} cx-multi-select-change - Emitted when the list items change.
 */
export declare class CxMultiSelect extends CortexElement {
    static styles: CSSResult;
    private readonly localize;
    multiSelect: HTMLElement;
    board1: CxBoard;
    board2: CxBoard;
    firstColumnData: ColumnData;
    secondColumnData: ColumnData;
    configurable: boolean;
    ignoreTypes: string[];
    addLimit: number | undefined;
    private itemMap;
    selectedItems: Record<string, string[]>;
    private initialSecondColumnItems;
    get firstColumnItemIds(): string[];
    get secondColumnItemIds(): string[];
    /**
     * Validates the changes made to the items array based on the specified type of action ('add' or 'remove').
     * If an add limit is set, it checks whether the new items exceed the allowed limit.
     * If the limit is exceeded, a warning toast notification is displayed.
     *
     * @param items - The current array of items.
     * @param oldItems - The previous array of items before the change.
     * @param type - The type of action performed, either 'add' or 'remove'.
     * @returns A boolean indicating whether the changes are valid (true) or not (false).
     */
    private isValidChanges;
    private handleBoardChange;
    private handleSelectedChange;
    private handleMoveItems;
    onDataChange(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
}

export declare type CxMutationEvent = CustomEvent<{
    mutationList: MutationRecord[];
}>;

/**
 * @summary The Mutation Observer component offers a thin, declarative interface to the [`MutationObserver API`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).
 *
 * @event {{ mutationList: MutationRecord[] }} cx-mutation - Emitted when a mutation occurs.
 *
 * @slot - The content to watch for mutations.
 */
export declare class CxMutationObserver extends CortexElement {
    static styles: CSSResultGroup;
    private mutationObserver;
    /**
     * Watches for changes to attributes. To watch only specific attributes, separate them by a space, e.g.
     * `attr="class id title"`. To watch all attributes, use `*`.
     */
    attr: string;
    /** Indicates whether or not the attribute's previous value should be recorded when monitoring changes. */
    attrOldValue: boolean;
    /** Watches for changes to the character data contained within the node. */
    charData: boolean;
    /** Indicates whether or not the previous value of the node's text should be recorded. */
    charDataOldValue: boolean;
    /** Watches for the addition or removal of new child nodes. */
    childList: boolean;
    /** Disables the observer. */
    disabled: boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleMutation;
    private startObserver;
    private stopObserver;
    handleDisabledChange(): void;
    handleChange(): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Options define the selectable items within various form controls such as [select](?s=atoms&id=/select).
 *
 * @dependency cx-icon
 *
 * @slot - The option's label.
 * @slot prefix - Used to prepend an icon or similar element to the menu item.
 * @slot suffix - Used to append an icon or similar element to the menu item.
 *
 * @csspart checked-icon - The checked icon, an `<cx-icon>` element.
 * @csspart base - The component's base wrapper.
 * @csspart label - The option's label.
 * @csspart prefix - The container that wraps the prefix.
 * @csspart suffix - The container that wraps the suffix.
 */
export declare class CxOption extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
    };
    private cachedTextLabel;
    private readonly localize;
    defaultSlot: HTMLSlotElement;
    current: boolean;
    selected: boolean;
    hasHover: boolean;
    /**
     * The option's value. When selected, the containing form control will receive this value. The value must be unique
     * from other options in the same group. Values may not contain spaces, as spaces are used as delimiters when listing
     * multiple values.
     */
    value: string;
    /** Draws the option in a disabled state, preventing selection. */
    disabled: boolean;
    /** Whether to show check icon prefix for selected option. */
    showCheck: boolean;
    connectedCallback(): void;
    private handleDefaultSlotChange;
    private handleMouseEnter;
    private handleMouseLeave;
    handleDisabledChange(): void;
    handleSelectedChange(): void;
    handleValueChange(): void;
    /** Returns a plain text label based on the option's content. */
    getTextLabel(): string;
    render(): TemplateResult<1>;
}

export declare type CxPageChangeEvent = CustomEvent<{
    pageIndex: number;
    rowsPerPage: number;
}>;

/**
 * @summary Pagination component displays the current page and allows the user to navigate through pages.
 *
 *
 * @dependency cx-icon-button
 * @dependency cx-option
 * @dependency cx-select
 * @dependency cx-typography
 *
 *
 * @event {{ pageIndex: number, rowsPerPage: number }} cx-page-change - Emitted when the active page changes.
 */
export declare class CxPagination extends CortexElement {
    static readonly styles: CSSResultGroup;
    private readonly localize;
    /** The total number of items */
    count: number;
    /** The options for the number of items per page */
    rowsPerPageOptions: number[];
    /** The current number of items per page */
    rowsPerPage: number;
    label: string;
    private _pageIndex;
    get pageIndex(): number;
    set pageIndex(value: number);
    handleRowsPerPageChange(e: CxChangeEvent): void;
    handleBack(): void;
    handleForward(): void;
    handleCountChange(): Promise<void>;
    handlePageChange(): void;
    render(): TemplateResult;
}

/**
 * @summary Popup is a utility that lets you declaratively anchor "popup" containers to another element.
 *
 * @event cx-reposition - Emitted when the popup is repositioned. This event can fire a lot, so avoid putting expensive
 *  operations in your listener or consider debouncing it.
 *
 * @slot - The popup's content.
 * @slot anchor - The element the popup will be anchored to. If the anchor lives outside of the popup, you can use the
 *  `anchor` attribute or property instead.
 *
 * @csspart arrow - The arrow's container. Avoid setting `top|bottom|left|right` properties, as these values are
 *  assigned dynamically as the popup moves. This is most useful for applying a background color to match the popup, and
 *  maybe a border or box shadow.
 * @csspart popup - The popup's container. Useful for setting a background color, box shadow, etc.
 * @csspart hover-bridge - The hover bridge element. Only available when the `hover-bridge` option is enabled.
 *
 * @cssproperty [--arrow-size=6px] - The size of the arrow. Note that an arrow won't be shown unless the `arrow`
 *  attribute is used.
 * @cssproperty [--arrow-color=var(--cx-color-neutral-0)] - The color of the arrow.
 * @cssproperty [--auto-size-available-width] - A read-only custom property that determines the amount of width the
 *  popup can be before overflowing. Useful for positioning child elements that need to overflow. This property is only
 *  available when using `auto-size`.
 * @cssproperty [--auto-size-available-height] - A read-only custom property that determines the amount of height the
 *  popup can be before overflowing. Useful for positioning child elements that need to overflow. This property is only
 *  available when using `auto-size`.
 */
export declare class CxPopup extends CortexElement {
    static styles: CSSResultGroup;
    private anchorEl;
    private cleanup;
    private readonly localize;
    /** A reference to the internal popup container. Useful for animating and styling the popup with JavaScript. */
    popup: HTMLElement;
    private arrowEl;
    private overlay;
    /**
     * The element the popup will be anchored to. If the anchor lives outside of the popup, you can provide the anchor
     * element `id`, a DOM element reference, or a `VirtualElement`. If the anchor lives inside the popup, use the
     * `anchor` slot instead.
     */
    anchor: Element | string | VirtualElement;
    /**
     * Activates the positioning logic and shows the popup. When this attribute is removed, the positioning logic is torn
     * down and the popup will be hidden.
     */
    active: boolean;
    /**
     * The preferred placement of the popup. Note that the actual placement will vary as configured to keep the
     * panel inside of the viewport.
     */
    placement: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
    /**
     * Determines how the popup is positioned. The `absolute` strategy works well in most cases, but if overflow is
     * clipped, using a `fixed` position strategy can often workaround it.
     */
    strategy: 'absolute' | 'fixed';
    /** The distance in pixels from which to offset the panel away from its anchor. */
    distance: number;
    /** The distance in pixels from which to offset the panel along its anchor. */
    skidding: number;
    /**
     * Attaches an arrow to the popup. The arrow's size and color can be customized using the `--arrow-size` and
     * `--arrow-color` custom properties. For additional customizations, you can also target the arrow using
     * `::part(arrow)` in your stylesheet.
     */
    arrow: boolean;
    /**
     * The placement of the arrow. The default is `anchor`, which will align the arrow as close to the center of the
     * anchor as possible, considering available space and `arrow-padding`. A value of `start`, `end`, or `center` will
     * align the arrow to the start, end, or center of the popover instead.
     */
    arrowPlacement: 'start' | 'end' | 'center' | 'anchor';
    /**
     * The amount of padding between the arrow and the edges of the popup. If the popup has a border-radius, for example,
     * this will prevent it from overflowing the corners.
     */
    arrowPadding: number;
    /**
     * When set, placement of the popup will flip to the opposite site to keep it in view. You can use
     * `flipFallbackPlacements` to further configure how the fallback placement is determined.
     */
    flip: boolean;
    /**
     * If the preferred placement doesn't fit, popup will be tested in these fallback placements until one fits. Must be a
     * string of any number of placements separated by a space, e.g. "top bottom left". If no placement fits, the flip
     * fallback strategy will be used instead.
     * */
    flipFallbackPlacements: string;
    /**
     * When neither the preferred placement nor the fallback placements fit, this value will be used to determine whether
     * the popup should be positioned using the best available fit based on available space or as it was initially
     * preferred.
     */
    flipFallbackStrategy: 'best-fit' | 'initial';
    /**
     * The flip boundary describes clipping element(s) that overflow will be checked relative to when flipping. By
     * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
     * change the boundary by passing a reference to one or more elements to this property.
     */
    flipBoundary: Element | Element[];
    /** The amount of padding, in pixels, to exceed before the flip behavior will occur. */
    flipPadding: number;
    /** Moves the popup along the axis to keep it in view when clipped. */
    shift: boolean;
    /**
     * The shift boundary describes clipping element(s) that overflow will be checked relative to when shifting. By
     * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
     * change the boundary by passing a reference to one or more elements to this property.
     */
    shiftBoundary: Element | Element[];
    /** The amount of padding, in pixels, to exceed before the shift behavior will occur. */
    shiftPadding: number;
    /** When set, this will cause the popup to automatically resize itself to prevent it from overflowing. */
    autoSize: 'horizontal' | 'vertical' | 'both';
    /** Syncs the popup's width or height to that of the anchor element. */
    sync: 'width' | 'height' | 'both';
    /**
     * The auto-size boundary describes clipping element(s) that overflow will be checked relative to when resizing. By
     * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
     * change the boundary by passing a reference to one or more elements to this property.
     */
    autoSizeBoundary: Element | Element[];
    /** The amount of padding, in pixels, to exceed before the auto-size behavior will occur. */
    autoSizePadding: number;
    /**
     * When a gap exists between the anchor and the popup element, this option will add a "hover bridge" that fills the
     * gap using an invisible element. This makes listening for events such as `mouseenter` and `mouseleave` more sane
     * because the pointer never technically leaves the element. The hover bridge will only be drawn when the popover is
     * active.
     */
    hoverBridge: boolean;
    /**
     * The factor by which to multiply the available width when using `auto-size`. E.g: Set to 0.5 to
     * make the popup half the width of the available space.
     */
    autoWidthFactor: number;
    /**
     * After `active` changes, cx-overlay takes some time to open.
     * Until then, the positioning is not accurate, so we use this
     * state to hide the popup until the overlay is opened.
     * (Only for fixed strategy)
     */
    overlayOpened: boolean;
    private get isSizeMiddleWareUsed();
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    protected firstUpdated(): void;
    updated(changedProps: Map<string, unknown>): Promise<void>;
    private handleAnchorChange;
    private handleOverlayOpened;
    private start;
    private stop;
    /** Forces the popup to recalculate and reposition itself. */
    reposition(): void;
    private updateHoverBridge;
    render(): TemplateResult<1>;
}

/**
 * @summary Progress bars are used to show the status of an ongoing operation.
 *
 * @slot - A label to show inside the progress indicator.
 *
 * @csspart base - The component's base wrapper.
 * @csspart indicator - The progress bar's indicator.
 * @csspart label - The progress bar's label.
 *
 * @cssproperty --height - The progress bar's height.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-color - The color of the indicator.
 * @cssproperty --label-color - The color of the label.
 */
export declare class CxProgressBar extends CortexElement {
    static styles: CSSResultGroup;
    private readonly localize;
    /** The current progress as a percentage, 0 to 100. */
    value: number;
    /** When true, percentage is ignored, the label is hidden, and the progress bar is drawn in an indeterminate state. */
    indeterminate: boolean;
    /** The title of the progress bar. */
    label: string;
    /** When true, the percentage is drawn. */
    showProgress: string;
    render(): TemplateResult<1>;
}

/**
 * @summary Progress rings are used to show the progress of a determinate operation in a circular fashion.
 *
 * @slot - A label to show inside the ring.
 *
 * @csspart base - The component's base wrapper.
 * @csspart label - The progress ring label.
 *
 * @cssproperty --size - The diameter of the progress ring (cannot be a percentage).
 * @cssproperty --track-width - The width of the track.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-width - The width of the indicator. Defaults to the track width.
 * @cssproperty --indicator-color - The color of the indicator.
 * @cssproperty --indicator-transition-duration - The duration of the indicator's transition when the value changes.
 */
export declare class CxProgressRing extends CortexElement {
    static styles: CSSResultGroup;
    private readonly localize;
    indicator: SVGCircleElement;
    indicatorOffset: string;
    /** The current progress as a percentage, 0 to 100. */
    value: number;
    /** A custom label for assistive devices. */
    label: string;
    updated(changedProps: Map<string, unknown>): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Generates a [QR code](https://www.qrcode.com/) and renders it using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).
 *
 * @csspart base - The component's base wrapper.
 */
export declare class CxQrCode extends CortexElement {
    static styles: CSSResultGroup;
    canvas: HTMLElement;
    /** The QR code's value. */
    value: string;
    /** The label for assistive devices to announce. If unspecified, the value will be used instead. */
    label: string;
    /** The size of the QR code, in pixels. */
    size: number;
    /** The fill color. This can be any valid CSS color, but not a CSS custom property. */
    fill: string;
    /** The background color. This can be any valid CSS color or `transparent`. It cannot be a CSS custom property. */
    background: string;
    /** The edge radius of each module. Must be between 0 and 0.5. */
    radius: number;
    /** The level of error correction to use. [Learn more](https://www.qrcode.com/en/about/error_correction.html) */
    errorCorrection: 'L' | 'M' | 'Q' | 'H';
    firstUpdated(): void;
    generate(): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Radios allow the user to select a single option from a group.
 *
 * @dependency cx-icon
 *
 * @slot - The radio's label.
 *
 * @event cx-blur - Emitted when the control loses focus.
 * @event cx-focus - Emitted when the control gains focus.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The circular container that wraps the radio's checked state.
 * @csspart control--checked - The radio control when the radio is checked.
 * @csspart checked-icon - The checked icon, an `<cx-icon>` element.
 * @csspart label - The container that wraps the radio's label.
 */
export declare class CxRadio extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
    };
    checked: boolean;
    protected hasFocus: boolean;
    /** The radio's value. When selected, the radio group will receive this value. */
    value: string;
    /**
     * The radio's size. When used inside a radio group, the size will be determined by the radio group's size so this
     * attribute can typically be omitted.
     */
    size: 'small' | 'medium' | 'large';
    /** Disables the radio. */
    disabled: boolean;
    constructor();
    connectedCallback(): void;
    private handleBlur;
    private handleClick;
    private handleFocus;
    private setInitialAttributes;
    handleCheckedChange(): void;
    handleDisabledChange(): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Radios buttons allow the user to select a single option from a group using a button-like control.
 *
 * @slot - The radio button's label.
 * @slot prefix - A presentational prefix icon or similar element.
 * @slot suffix - A presentational suffix icon or similar element.
 *
 * @event cx-blur - Emitted when the button loses focus.
 * @event cx-focus - Emitted when the button gains focus.
 *
 * @csspart base - The component's base wrapper.
 * @csspart button - The internal `<button>` element.
 * @csspart button--checked - The internal button element when the radio button is checked.
 * @csspart prefix - The container that wraps the prefix.
 * @csspart label - The container that wraps the radio button's label.
 * @csspart suffix - The container that wraps the suffix.
 */
export declare class CxRadioButton extends CortexElement {
    static styles: CSSResultGroup;
    private readonly hasSlotController;
    input: HTMLInputElement;
    hiddenInput: HTMLInputElement;
    protected hasFocus: boolean;
    /* Excluded from this release type: checked */
    /** The radio's value. When selected, the radio group will receive this value. */
    value: string;
    /** Disables the radio button. */
    disabled: boolean;
    /**
     * The radio button's size. When used inside a radio group, the size will be determined by the radio group's size so
     * this attribute can typically be omitted.
     */
    size: 'small' | 'medium' | 'large';
    /** Draws a pill-style radio button with rounded edges. */
    pill: boolean;
    connectedCallback(): void;
    private handleBlur;
    private handleClick;
    private handleFocus;
    handleDisabledChange(): void;
    /** Sets focus on the radio button. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the radio button. */
    blur(): void;
    render(): TemplateResult;
}

export declare class CxRadioCard extends CortexElement {
    static styles: CSSResultGroup;
    private radio;
    checked: boolean;
    protected hasFocus: boolean;
    /** The radio's value. When selected, the radio group will receive this value. */
    value: string;
    /** Disables the radio. */
    disabled: boolean;
    constructor();
    connectedCallback(): void;
    private handleBlur;
    private handleClick;
    private handleFocus;
    private setInitialAttributes;
    handleCheckedChange(): void;
    handleDisabledChange(): void;
    render(): TemplateResult;
}

/**
 * @summary Radio groups are used to group multiple [radios](?s=atoms&id=/radio) or [radio buttons](?s=atoms&id=/radio-button) so they function as a single form control.
 *
 * @dependency cx-button-group
 *
 * @slot - The default slot where `<cx-radio>` or `<cx-radio-button>` elements are placed.
 * @slot label - The radio group's label. Required for proper accessibility. Alternatively, you can use the `label`
 *  attribute.
 * @slot help-text - Text that describes how to use the radio group. Alternatively, you can use the `help-text` attribute.
 *
 * @event cx-change - Emitted when the radio group's selected value changes.
 * @event cx-input - Emitted when the radio group receives user input.
 * @event cx-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart form-control - The form control that wraps the label, input, and help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-input - The input's wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart button-group - The button group that wraps radio buttons.
 * @csspart button-group__base - The button group's `base` part.
 */
export declare class CxRadioGroup extends CortexElement implements ShoelaceFormControl {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-button-group': typeof CxButtonGroup;
    };
    protected readonly formControlController: FormControlController;
    private readonly hasSlotController;
    private customValidityMessage;
    private validationTimeout;
    defaultSlot: HTMLSlotElement;
    validationInput: HTMLInputElement;
    private hasButtonGroup;
    private errorMessage;
    defaultValue: string;
    /**
     * The radio group's label. Required for proper accessibility. If you need to display HTML, use the `label` slot
     * instead.
     */
    label: string;
    /** The radio groups's help text. If you need to display HTML, use the `help-text` slot instead. */
    helpText: string;
    /** The name of the radio group, submitted as a name/value pair with form data. */
    name: string;
    /** The current value of the radio group, submitted as a name/value pair with form data. */
    value: string;
    /** The radio group's size. This size will be applied to all child radios and radio buttons. */
    size: 'small' | 'medium' | 'large';
    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    form: string;
    /** Ensures a child radio is checked before allowing the containing form to submit. */
    required: boolean;
    /** Arrange the radio buttons in a horizontal layout, making them appear side by side instead of stacked vertically. */
    horizontal: boolean;
    /** This attribute specifies the number of items to be displayed per row. It is only applicable when the `horizontal` attribute is set to true. */
    itemsPerRow: number;
    /** Gets the validity state object */
    get validity(): ValidityState;
    /** Gets the validation message */
    get validationMessage(): string;
    connectedCallback(): void;
    firstUpdated(): void;
    private getAllRadios;
    private handleRadioClick;
    private handleKeyDown;
    private handleLabelClick;
    private handleInvalid;
    private syncRadioElements;
    private syncRadios;
    private updateCheckedRadio;
    handleSizeChange(): void;
    handleValueChange(): void;
    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity(): boolean;
    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null;
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity(): boolean;
    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message?: string): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Ranges allow the user to select a single value within a given range using a slider.
 *
 * @slot label - The range's label. Alternatively, you can use the `label` attribute.
 * @slot help-text - Text that describes how to use the input. Alternatively, you can use the `help-text` attribute.
 *
 * @event cx-blur - Emitted when the control loses focus.
 * @event cx-change - Emitted when an alteration to the control's value is committed by the user.
 * @event cx-focus - Emitted when the control gains focus.
 * @event cx-input - Emitted when the control receives input.
 * @event cx-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 * @event cx-drag-start - Emitted when the user starts dragging the thumb.
 * @event cx-drag-end - Emitted when the user stops dragging the thumb.
 *
 * @csspart form-control - The form control that wraps the label, input, and help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-input - The range's wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart base - The component's base wrapper.
 * @csspart input - The internal `<input>` element.
 * @csspart tooltip - The range's tooltip.
 *
 * @cssproperty --thumb-size - The size of the thumb.
 * @cssproperty --track-color-active - The color of the portion of the track that represents the current value.
 * @cssproperty --track-color-inactive - The of the portion of the track that represents the remaining value.
 * @cssproperty --track-height - The height of the track.
 * @cssproperty --track-active-offset - The point of origin of the active track.
 */
export declare class CxRange extends CortexElement implements ShoelaceFormControl {
    static styles: CSSResultGroup;
    private readonly formControlController;
    private readonly hasSlotController;
    private readonly localize;
    private resizeObserver;
    input: HTMLInputElement;
    output: CxTooltip;
    range: HTMLElement;
    private hasFocus;
    private hasTooltip;
    /**
     * Sets the dragging state for the component. This allows us to control the style in CSS.
     */
    state: 'dragging' | 'idle';
    title: string;
    /** The name of the range, submitted as a name/value pair with form data. */
    name: string;
    /** The current value of the range, submitted as a name/value pair with form data. */
    value: number;
    /** The range's label. If you need to display HTML, use the `label` slot instead. */
    label: string;
    /** The range's help text. If you need to display HTML, use the help-text slot instead. */
    helpText: string;
    /** Disables the range. */
    disabled: boolean;
    /** The minimum acceptable value of the range. */
    min: number;
    /** The maximum acceptable value of the range. */
    max: number;
    /** The interval at which the range will increase and decrease. */
    step: number | undefined;
    /** The preferred placement of the range's tooltip. */
    tooltipPlacement: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
    /**
     Controls when the tooltip is displayed:

     - on: always displayed.
     - off: never displayed.
     - auto: displayed on hover or focus.
     */
    tooltipDisplay: 'auto' | 'on' | 'off';
    /** Controls the `hoist` attribute of the tooltip. */
    tooltipHoist: boolean;
    /**
     * A function used to format the tooltip's value. The range's value is passed as the first and only argument. The
     * function should return a string to display in the tooltip.
     */
    tooltipFormatter: (value: number) => string;
    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    form: string;
    /** How close the thumb must be to a mark until snapping occurs. */
    snapThreshold: number;
    /**
     * Displays a tick mark for each step in the range. If no `marks` slot is provided, marks will be auto-generated using the `step` value.
     */
    showMarks: boolean;
    /** The offset of the tooltip from the thumb. */
    tooltipOffset: number;
    marks: Mark[];
    /** The default value of the form control. Primarily used for resetting the form control. */
    defaultValue: number;
    /** Gets the validity state object */
    get validity(): ValidityState;
    /** Gets the validation message */
    get validationMessage(): string;
    connectedCallback(): void;
    initMarks(): void;
    disconnectedCallback(): void;
    private handleChange;
    private handleInput;
    private handleBlur;
    private handleFocus;
    /**
     * Snaps the value to the nearest snap point to a given x position
     * @param x the x position that is seeked to
     * @returns whether the value has changed
     */
    private snapValue;
    private handleThumbDragStart;
    private handleMouseDown;
    private handleKeyDown;
    private valueToPercentage;
    private pixelsToValue;
    private syncProgress;
    handleValueChange(): void;
    handleDisabledChange(): void;
    syncRange(): void;
    private handleInvalid;
    /** Sets focus on the range. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the range. */
    blur(): void;
    /**
     * Increments the value of the range by the value of the step attribute.
     * @returns whether the value has changed
     */
    stepUp(): boolean;
    /**
     * Decrements the value of the range by the value of the step attribute.
     * @returns whether the value has changed
     */
    stepDown(): boolean;
    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity(): boolean;
    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null;
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity(): boolean;
    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string): void;
    getAllMarks(): NodeListOf<HTMLElement> | undefined;
    renderMarks(): TemplateResult<1>[];
    render(): TemplateResult<1>;
}

/**
 * @summary Ratings give users a way to quickly view and provide feedback.
 *
 * @dependency cx-icon
 *
 * @event cx-change - Emitted when the rating's value changes.
 * @event {{ phase: 'start' | 'move' | 'end', value: number }} cx-hover - Emitted when the user hovers over a value. The
 *  `phase` property indicates when hovering starts, moves to a new value, or ends. The `value` property tells what the
 *  rating's value would be if the user were to commit to the hovered value.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --symbol-color - The inactive color for symbols.
 * @cssproperty --symbol-color-active - The active color for symbols.
 * @cssproperty --symbol-size - The size of symbols.
 * @cssproperty --symbol-spacing - The spacing to use around symbols.
 */
export declare class CxRating extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
    };
    private readonly localize;
    rating: HTMLElement;
    private hoverValue;
    private isHovering;
    /** A label that describes the rating to assistive devices. */
    label: string;
    /** The current rating. */
    value: number;
    /** The highest rating to show. */
    max: number;
    /**
     * The precision at which the rating will increase and decrease. For example, to allow half-star ratings, set this
     * attribute to `0.5`.
     */
    precision: number;
    /** Makes the rating readonly. */
    readonly: boolean;
    /** Disables the rating. */
    disabled: boolean;
    /**
     * A function that customizes the symbol to be rendered. The first and only argument is the rating's current value.
     * The function should return a string containing trusted HTML of the symbol to render at the specified value. Works
     * well with `<cx-icon>` elements.
     */
    getSymbol: (value: number) => string;
    private getValueFromMousePosition;
    private getValueFromTouchPosition;
    private getValueFromXCoordinate;
    private handleClick;
    private setValue;
    private handleKeyDown;
    private handleMouseEnter;
    private handleMouseMove;
    private handleMouseLeave;
    private handleTouchStart;
    private handleTouchMove;
    private handleTouchEnd;
    private roundToPrecision;
    handleHoverValueChange(): void;
    handleIsHoveringChange(): void;
    /** Sets focus on the rating. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the rating. */
    blur(): void;
    render(): TemplateResult<1>;
}

export declare type CxReadyEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxRefreshEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary Outputs a localized time phrase relative to the current date and time.
 */
export declare class CxRelativeTime extends CortexElement {
    private readonly localize;
    private updateTimeout;
    private isoTime;
    private relativeTime;
    /**
     * The date from which to calculate time from. If not set, the current date and time will be used. When passing a
     * string, it's strongly recommended to use the ISO 8601 format to ensure timezones are handled correctly. To convert
     * a date to this format in JavaScript, use [`date.toISOString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString).
     */
    date: Date | string;
    /** The formatting style to use. */
    format: 'long' | 'short' | 'narrow';
    /**
     * When `auto`, values such as "yesterday" and "tomorrow" will be shown when possible. When `always`, values such as
     * "1 day ago" and "in 1 day" will be shown.
     */
    numeric: 'always' | 'auto';
    /** Keep the displayed value up to date as time passes. */
    sync: boolean;
    disconnectedCallback(): void;
    render(): "" | TemplateResult<1>;
}

export declare type CxRemoveEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxRepositionEvent = CustomEvent<Record<PropertyKey, never>>;

export declare type CxRequestCloseEvent = CustomEvent<{
    source: 'close-button' | 'keyboard' | 'overlay';
}>;

export declare type CxResizeEvent = CustomEvent<{
    entries: ResizeObserverEntry[];
}>;

/**
 * @summary The Resize Observer component offers a thin, declarative interface to the [`ResizeObserver API`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).
 *
 * @slot - One or more elements to watch for resizing.
 *
 * @event {{ entries: ResizeObserverEntry[] }} cx-resize - Emitted when the element is resized.
 */
export declare class CxResizeObserver extends CortexElement {
    static styles: CSSResultGroup;
    private resizeObserver;
    private observedElements;
    /** Disables the observer. */
    disabled: boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleSlotChange;
    private startObserver;
    private stopObserver;
    handleDisabledChange(): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Selects allow you to choose items from a menu of predefined options.
 *
 * @dependency cx-icon
 * @dependency cx-popup
 * @dependency cx-tag
 *
 * @slot - The listbox options. Can be any HTML element, nested or not, as long as they have role="option".
 *         However, default logic supports only `<cx-option>` elements. Make sure to override the default logic. See region Overridable.
 *         You can use `<cx-divider>` to group items visually.
 * @slot label - The input's label. Alternatively, you can use the `label` attribute.
 * @slot prefix - Used to prepend a presentational icon or similar element to the combobox.
 * @slot suffix - Used to append a presentational icon or similar element to the combobox.
 * @slot clear-icon - An icon to use in lieu of the default clear icon.
 * @slot expand-icon - The icon to show when the control is expanded and collapsed. Rotates on open and close.
 * @slot help-text - Text that describes how to use the input. Alternatively, you can use the `help-text` attribute.
 *
 * @event cx-change - Emitted when the control's value changes.
 * @event cx-clear - Emitted when the control's value is cleared.
 * @event cx-input - Emitted when the control receives input.
 * @event cx-focus - Emitted when the control gains focus.
 * @event cx-blur - Emitted when the control loses focus.
 * @event cx-show - Emitted when the select's menu opens.
 * @event cx-after-show - Emitted after the select's menu opens and all animations are complete.
 * @event cx-hide - Emitted when the select's menu closes.
 * @event cx-after-hide - Emitted after the select's menu closes and all animations are complete.
 * @event cx-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart form-control - The form control that wraps the label, input, and help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-input - The select's wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart combobox - The container the wraps the prefix, suffix, combobox, clear icon, and expand button.
 * @csspart prefix - The container that wraps the prefix slot.
 * @csspart suffix - The container that wraps the suffix slot.
 * @csspart display-input - The element that displays the selected option's label, an `<input>` element.
 * @csspart listbox - The listbox container where options are slotted.
 * @csspart tags - The container that houses option tags when `multiselect` is used.
 * @csspart tag - The individual tags that represent each multiselect option.
 * @csspart tag__base - The tag's base part.
 * @csspart tag__content - The tag's content part.
 * @csspart tag__remove-button - The tag's remove button.
 * @csspart tag__remove-button__base - The tag's remove button base part.
 * @csspart clear-button - The clear button.
 * @csspart expand-icon - The container that wraps the expand icon.
 */
export declare class CxSelect extends CortexElement implements ShoelaceFormControl {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon': typeof CxIcon;
        'cx-popup': typeof CxPopup;
        'cx-tag': typeof CxTag;
    };
    private readonly formControlController;
    private readonly hasSlotController;
    private readonly localize;
    private typeToSelectString;
    private closeWatcher;
    popup: CxPopup;
    combobox: HTMLSlotElement;
    displayInput: HTMLInputElement;
    valueInput: HTMLInputElement;
    listbox: HTMLSlotElement;
    private hasFocus;
    displayLabel: string;
    currentOption: HTMLElement;
    selectedOptions: HTMLElement[];
    /** The name of the select, submitted as a name/value pair with form data. */
    name: string;
    /**
     * The current value of the select, submitted as a name/value pair with form data. When `multiple` is enabled, the
     * value attribute will be a space-delimited list of values based on the options selected, and the value property will
     * be an array. **For this reason, values must not contain spaces.**
     */
    value: string | string[];
    /** The default value of the form control. Primarily used for resetting the form control. */
    defaultValue: string | string[];
    /** The select's size. */
    size: 'small' | 'medium' | 'large';
    /** Placeholder text to show as a hint when the select is empty. */
    placeholder: string;
    /**
     * If this property is enabled the user will be able to enter a free text value without being forced to select an option from the suggested values.
     * Otherwise, when no value is selected, the input will be cleared.
     */
    allowFreetext: boolean;
    /** Allows more than one option to be selected. */
    multiple: boolean;
    /**
     * The maximum number of selected options to show when `multiple` is true. After the maximum, "+n" will be shown to
     * indicate the number of additional items that are selected. Set to 0 to remove the limit.
     */
    maxOptionsVisible: number;
    /** Disables the select control. */
    disabled: boolean;
    /** Adds a clear button when the select is not empty. */
    clearable: boolean;
    /**
     * Indicates whether or not the select is open. You can toggle this attribute to show and hide the menu, or you can
     * use the `show()` and `hide()` methods and this attribute will reflect the select's open state.
     */
    open: boolean;
    /**
     * Enable this option to prevent the listbox from being clipped when the component is placed inside a container with
     * `overflow: auto|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all, scenarios.
     */
    hoist: boolean;
    /**
     * By default, the select menu's width matches the select's width. Set this to true to make the menu as wide as the content.
     */
    /** Disables the select control. */
    freeWidth: boolean;
    /**
     * The autosize padding of the listbox dropdown.
     */
    autosizePadding: number;
    /** Draws a filled select. */
    filled: boolean;
    /** Draws a pill-style select with rounded edges. */
    pill: boolean;
    /** The select's label. If you need to display HTML, use the `label` slot instead. */
    label: string;
    /**
     * The preferred placement of the select's menu. Note that the actual placement may vary as needed to keep the listbox
     * inside of the viewport.
     */
    placement: 'top' | 'bottom';
    /** The select's help text. If you need to display HTML, use the `help-text` slot instead. */
    helpText: string;
    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    form: string;
    /** The select's required attribute. */
    required: boolean;
    /**
     * A function that customizes the tags to be rendered when multiple=true. The first argument is the option, the second
     * is the current tag's index.  The function should return either a Lit TemplateResult or a string containing trusted HTML of the symbol to render at
     * the specified value.
     */
    getTag: (option: HTMLElement, index: number) => TemplateResult | string | HTMLElement;
    /** Behavior when typing into the display input
     * - `select` - default shoelace behavior, selects the first option that starts with the typed string
     * - `filter` - filters out options that do not include the typed string
     */
    inputBehavior: 'select' | 'filter';
    /**
     *
     * @param option The option to get the value for
     * @returns The value
     */
    getOptionValue: (option: HTMLElement) => string;
    stayOpenOnSelect: boolean;
    /** Gets the validity state object */
    get validity(): ValidityState;
    /** Gets the validation message */
    get validationMessage(): string;
    /**
     *
     * @param option The option to update the selected state
     * @param selected If undefined, the option will be toggled. If true, the option will be selected. If false, the option will be unselected.
     * @returns
     */
    setOptionSelected(option: HTMLElement, selected?: boolean): void;
    /**
     *
     * current = whether the option is currently focused on e.g via keyboard
     * @param option The option to update the current state
     * @param current If undefined, the option will be toggled. If true, the option will be set as current. If false, the option will be unset.
     * @returns
     */
    setOptionCurrent(option: HTMLElement, current?: boolean): void;
    /**
     *
     * @param option The option to get the label for
     * @returns The label
     */
    getOptionLabel(option: HTMLElement): string;
    /**
     *
     * @param option The option to get the selected state for
     * @returns The selected state
     */
    getOptionSelected(option: HTMLElement): boolean | undefined;
    /**
     *
     * @param option The option to get the disabled state for
     * @returns The disabled state
     */
    getOptionDisabled(option: HTMLElement): boolean | undefined;
    /**
     * For each option, this function is called to determine if the option should be displayed based on the input string
     * @param option
     * @param value The current input string
     * @returns Whether this option should be displayed
     */
    filterCallback(option: HTMLElement, value: string): boolean;
    connectedCallback(): void;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    private addOpenListeners;
    private removeOpenListeners;
    private handleFocus;
    private handleBlur;
    private handleInput;
    private handleDocumentFocusIn;
    private handleDocumentKeyDown;
    private handleDocumentMouseDown;
    private handleLabelClick;
    private handleComboboxMouseDown;
    private handleComboboxKeyDown;
    private handleClearClick;
    private handleClearMouseDown;
    private handleOptionClick;
    /**
     * Runs when the default slot changes, i.e when options are removed/added to listbox.
     * Update the selected options (this.value) accordingly.
     */
    handleDefaultSlotChange(): void;
    private handleTagRemove;
    private getAllOptions;
    private getFirstOption;
    private setCurrentOption;
    private setSelectedOptions;
    private toggleOptionSelection;
    private selectionChanged;
    protected get tags(): TemplateResult<1>[];
    private handleInvalid;
    handleDisabledChange(): void;
    handleValueChange(): void;
    handleOpenChange(): Promise<void>;
    private selectOptionByInput;
    private filterOptionsByInput;
    /** Shows the listbox. */
    show(): Promise<void>;
    /** Hides the listbox. */
    hide(): Promise<void>;
    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity(): boolean;
    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null;
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity(): boolean;
    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string): void;
    /** Sets focus on the control. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the control. */
    blur(): void;
    render(): TemplateResult<1>;
}

export declare type CxSelectEvent = CustomEvent<{
    item: CxMenuItem;
}>;

export declare type CxSelectionChangeEvent = CustomEvent<{
    selection: CxTreeItem[];
}>;

export declare type CxShowEvent = CustomEvent<Record<PropertyKey, never>>;

/**
 * @summary Skeletons are used to provide a visual representation of where content will eventually be drawn.
 *
 * @csspart base - The component's base wrapper.
 * @csspart indicator - The skeleton's indicator which is responsible for its color and animation.
 *
 * @cssproperty --border-radius - The skeleton's border radius.
 * @cssproperty --color - The color of the skeleton.
 * @cssproperty --sheen-color - The sheen color when the skeleton is in its loading state.
 */
export declare class CxSkeleton extends CortexElement {
    static styles: CSSResultGroup;
    /** Determines which effect the skeleton will use. */
    effect: 'pulse' | 'sheen' | 'none';
    render(): TemplateResult<1>;
}

export declare type CxSlideChangeEvent = CustomEvent<{
    index: number;
    slide: CxCarouselItem;
}>;

/**
 * @summary SpacingContainer allows for flexible layout spacing between child elements, vertically or horizontally, with varying sizes.
 *
 * @csspart base - The component's base container, applying flex layout.
 */
export declare class CxSpace extends CortexElement {
    static readonly styles: CSSResultGroup;
    /**
     * When set, and in vertical orientation, the child elements will stretch to fill the width of the container.
     */
    block: boolean;
    /**
     * The direction of the spacing container. This will determine if the child elements are spaced vertically or horizontally.
     */
    direction: 'vertical' | 'horizontal';
    /**
     * The spacing between child elements
     */
    spacing: SpacingProp;
    /**
     * The wrap behavior of the container.
     */
    wrap: 'wrap' | 'nowrap' | 'wrap-reverse';
    /**
     * Proxy for justify-content CSS property.
     */
    justifyContent: 'start' | 'end' | 'flex-start' | 'flex-end' | 'center' | 'left' | 'right' | 'normal' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch';
    /**
     * Proxy for align-items CSS property.
     */
    alignItems: 'normal' | 'center' | 'start' | 'end' | 'baseline' | 'stretch' | 'flex-start' | 'flex-end';
    render(): TemplateResult<1>;
}

/**
 * @summary Spinners are used to show the progress of an indeterminate operation.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --track-width - The width of the track.
 * @cssproperty --track-color - The color of the track.
 * @cssproperty --indicator-color - The color of the spinner's indicator.
 * @cssproperty --speed - The time it takes for the spinner to complete one animation cycle.
 */
export declare class CxSpinner extends CortexElement {
    static styles: CSSResultGroup;
    private readonly localize;
    render(): TemplateResult<1>;
}

/**
 * @summary Split panels display two adjacent panels, allowing the user to reposition them.
 *
 * @event cx-reposition - Emitted when the divider's position changes.
 *
 * @slot start - Content to place in the start panel.
 * @slot end - Content to place in the end panel.
 * @slot divider - The divider. Useful for slotting in a custom icon that renders as a handle.
 *
 * @csspart start - The start panel.
 * @csspart end - The end panel.
 * @csspart panel - Targets both the start and end panels.
 * @csspart divider - The divider that separates the start and end panels.
 *
 * @cssproperty [--divider-width=4px] - The width of the visible divider.
 * @cssproperty [--divider-hit-area=12px] - The invisible region around the divider where dragging can occur. This is
 *  usually wider than the divider to facilitate easier dragging.
 * @cssproperty [--min=0] - The minimum allowed size of the primary panel.
 * @cssproperty [--max=100%] - The maximum allowed size of the primary panel.
 */
export declare class CxSplitPanel extends CortexElement {
    static styles: CSSResultGroup;
    private cachedPositionInPixels;
    private readonly localize;
    private resizeObserver;
    private size;
    divider: HTMLElement;
    /**
     * The current position of the divider from the primary panel's edge as a percentage 0-100. Defaults to 50% of the
     * container's initial size.
     */
    position: number;
    /** The current position of the divider from the primary panel's edge in pixels. */
    positionInPixels: number;
    /** Draws the split panel in a vertical orientation with the start and end panels stacked. */
    vertical: boolean;
    /** Disables resizing. Note that the position may still change as a result of resizing the host element. */
    disabled: boolean;
    /**
     * If no primary panel is designated, both panels will resize proportionally when the host element is resized. If a
     * primary panel is designated, it will maintain its size and the other panel will grow or shrink as needed when the
     * host element is resized.
     */
    primary?: 'start' | 'end';
    /**
     * Sets the dragging state for the component. This allows us to control the style in CSS.
     */
    state: 'dragging' | 'idle';
    /**
     * One or more space-separated values at which the divider should snap. Values can be in pixels or percentages, e.g.
     * `"100px 50%"`.
     */
    snap?: string;
    /** How close the divider must be to a snap point until snapping occurs. */
    snapThreshold: number;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private detectSize;
    private percentageToPixels;
    private pixelsToPercentage;
    private handleDrag;
    private handleKeyDown;
    private handleResize;
    private unsetDocumentCursor;
    handlePositionChange(): void;
    handlePositionInPixelsChange(): void;
    handleStateChange(): void;
    handleVerticalChange(): void;
    render(): TemplateResult<1>;
}

export declare type CxStartEvent = CustomEvent<Record<PropertyKey, never>>;

export declare class CxStep extends CortexElement {
    static styles: CSSResult[];
    private step;
    active: boolean;
    completed: boolean;
    disabled: boolean;
    readonly: boolean;
    error: boolean;
    index: number;
    last: boolean;
    helpText: string;
    progress: number;
    color: string;
    round: boolean;
    firstUpdated(): void;
    private handleClick;
    private renderDefaultStep;
    private renderRoundStep;
    render(): TemplateResult;
}

export declare class CxStepper extends CortexElement {
    static styles: CSSResult[];
    private stepSlot;
    direction: 'horizontal' | 'vertical';
    itemsPerRow: number;
    private handleSlotChange;
    render(): TemplateResult;
}

export declare class CxStepperWizard extends CortexElement {
    static styles: CSSResultGroup;
    data: StepData[];
    maxWidth: number;
    minWidth: number;
    get columnCount(): number;
    handleResize(): void;
    render(): TemplateResult;
}

export declare type CxSwatchAddEvent = CustomEvent<Record<PropertyKey, string>>;

/**
 * @summary Switches allow the user to toggle an option on or off.
 *
 * @slot - The switch's label.
 * @slot help-text - Text that describes how to use the switch. Alternatively, you can use the `help-text` attribute.
 * @slot checked-icon - Thumb icon when the switch is checked.
 * @slot unchecked-icon - Thumb icon when the switch is unchecked.
 *
 * @event cx-blur - Emitted when the control loses focus.
 * @event cx-change - Emitted when the control's checked state changes.
 * @event cx-input - Emitted when the control receives input.
 * @event cx-focus - Emitted when the control gains focus.
 * @event cx-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart base - The component's base wrapper.
 * @csspart control - The control that houses the switch's thumb.
 * @csspart thumb - The switch's thumb.
 * @csspart label - The switch's label.
 * @csspart form-control-help-text - The help text's wrapper.
 *
 * @cssproperty --width - The width of the switch.
 * @cssproperty --height - The height of the switch.
 * @cssproperty --thumb-size - The size of the thumb.
 */
export declare class CxSwitch extends CortexElement implements ShoelaceFormControl {
    static styles: CSSResultGroup;
    private readonly formControlController;
    private readonly hasSlotController;
    input: HTMLInputElement;
    private hasFocus;
    title: string;
    /** The name of the switch, submitted as a name/value pair with form data. */
    name: string;
    /** The current value of the switch, submitted as a name/value pair with form data. */
    value: string;
    /** The switch's size. */
    size: 'small' | 'medium' | 'large';
    /** Disables the switch. */
    disabled: boolean;
    /** Draws the switch in a checked state. */
    checked: boolean;
    /** The default value of the form control. Primarily used for resetting the form control. */
    defaultChecked: boolean;
    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    form: string;
    /** Makes the switch a required field. */
    required: boolean;
    /** Whether to display icon on the switch's thumb. */
    showIcon: boolean;
    /** The switch's help text. If you need to display HTML, use the `help-text` slot instead. */
    helpText: string;
    /** Gets the validity state object */
    get validity(): ValidityState;
    /** Gets the validation message */
    get validationMessage(): string;
    firstUpdated(): void;
    private handleBlur;
    private handleInput;
    private handleInvalid;
    private handleClick;
    private handleFocus;
    private handleKeyDown;
    handleCheckedChange(): void;
    handleDisabledChange(): void;
    /** Simulates a click on the switch. */
    click(): void;
    /** Sets focus on the switch. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the switch. */
    blur(): void;
    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity(): boolean;
    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null;
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity(): boolean;
    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Tabs are used inside [tab groups](?s=atoms&id=/tab-group) to represent and activate [tab panels](?s=atoms&id=/tab-panel).
 *
 * @dependency cx-icon-button
 *
 * @slot - The tab's label.
 *
 * @event cx-close - Emitted when the tab is closable and the close button is activated.
 *
 * @csspart base - The component's base wrapper.
 * @csspart close-button - The close button, an `<cx-icon-button>`.
 * @csspart close-button__base - The close button's exported `base` part.
 */
export declare class CxTab extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon-button': typeof CxIconButton;
    };
    private readonly localize;
    private readonly attrId;
    private readonly componentId;
    tab: HTMLElement;
    /** The name of the tab panel this tab is associated with. The panel must be located in the same tab group. */
    panel: string;
    /** Draws the tab in an active state. */
    active: boolean;
    /** Makes the tab closable and shows a close button. */
    closable: boolean;
    /** Disables the tab and prevents selection. */
    disabled: boolean;
    /* Excluded from this release type: tabIndex */
    connectedCallback(): void;
    private handleCloseClick;
    handleActiveChange(): void;
    handleDisabledChange(): void;
    render(): TemplateResult<1>;
}

/**
 * @summary Tab groups organize content into a container that shows one section at a time.
 *
 * @dependency cx-icon-button
 *
 * @slot - Used for grouping tab panels in the tab group. Must be `<cx-tab-panel>` elements.
 * @slot nav - Used for grouping tabs in the tab group. Must be `<cx-tab>` elements.
 *
 * @event {{ name: String }} cx-tab-show - Emitted when a tab is shown.
 * @event {{ name: String }} cx-tab-hide - Emitted when a tab is hidden.
 *
 * @csspart base - The component's base wrapper.
 * @csspart nav - The tab group's navigation container where tabs are slotted in.
 * @csspart tabs - The container that wraps the tabs.
 * @csspart active-tab-indicator - The line that highlights the currently selected tab.
 * @csspart body - The tab group's body where tab panels are slotted in.
 * @csspart scroll-button - The previous/next scroll buttons that show when tabs are scrollable, an `<cx-icon-button>`.
 * @csspart scroll-button--start - The starting scroll button.
 * @csspart scroll-button--end - The ending scroll button.
 * @csspart scroll-button__base - The scroll button's exported `base` part.
 *
 * @cssproperty --indicator-color - The color of the active tab indicator.
 * @cssproperty --track-color - The color of the indicator's track (the line that separates tabs from panels).
 * @cssproperty --track-width - The width of the indicator's track (the line that separates tabs from panels).
 */
export declare class CxTabGroup extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon-button': typeof CxIconButton;
        'cx-resize-observer': typeof CxResizeObserver;
    };
    private readonly localize;
    private activeTab?;
    private mutationObserver;
    private resizeObserver;
    private tabs;
    private focusableTabs;
    private panels;
    tabGroup: HTMLElement;
    body: HTMLSlotElement;
    nav: HTMLElement;
    indicator: HTMLElement;
    private hasScrollControls;
    private shouldHideScrollStartButton;
    private shouldHideScrollEndButton;
    /** The placement of the tabs. */
    placement: 'top' | 'bottom' | 'start' | 'end';
    /**
     * When set to auto, navigating tabs with the arrow keys will instantly show the corresponding tab panel. When set to
     * manual, the tab will receive focus but will not show until the user presses spacebar or enter.
     */
    activation: 'auto' | 'manual';
    /** Disables the scroll arrows that appear when tabs overflow. */
    noScrollControls: boolean;
    /** Prevent scroll buttons from being hidden when inactive. */
    fixedScrollControls: boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private getAllTabs;
    private getAllPanels;
    private getActiveTab;
    private handleClick;
    private handleKeyDown;
    private handleScrollToStart;
    private handleScrollToEnd;
    private setActiveTab;
    private setAriaLabels;
    private repositionIndicator;
    private syncTabsAndPanels;
    private findNextFocusableTab;
    /**
     * The reality of the browser means that we can't expect the scroll position to be exactly what we want it to be, so
     * we add one pixel of wiggle room to our calculations.
     */
    private scrollOffset;
    private updateScrollButtons;
    private isScrolledToEnd;
    private scrollFromStart;
    updateScrollControls(): void;
    syncIndicator(): void;
    /** Shows the specified tab panel. */
    show(panel: string): void;
    render(): TemplateResult<1>;
}

export declare type CxTabHideEvent = CustomEvent<{
    name: string;
}>;

/**
 * @summary Tab panels are used inside [tab groups](?s=atoms&id=/tab-group) to display tabbed content.
 *
 * @slot - The tab panel's content.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --padding - The tab panel's padding.
 */
export declare class CxTabPanel extends CortexElement {
    static styles: CSSResultGroup;
    private readonly attrId;
    private readonly componentId;
    /** The tab panel's name. */
    name: string;
    /** When true, the tab panel will be shown. */
    active: boolean;
    connectedCallback(): void;
    handleActiveChange(): void;
    render(): TemplateResult<1>;
}

export declare type CxTabShowEvent = CustomEvent<{
    name: string;
}>;

/**
 * @summary Tags are used as labels to organize things or to indicate a selection.
 *
 * @dependency cx-icon-button
 *
 * @slot - The tag's content.
 *
 * @event cx-remove - Emitted when the remove button is activated.
 *
 * @csspart base - The component's base wrapper.
 * @csspart content - The tag's content.
 * @csspart remove-button - The tag's remove button, an `<cx-icon-button>`.
 * @csspart remove-button__base - The remove button's exported `base` part.
 */
export declare class CxTag extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-icon-button': typeof CxIconButton;
    };
    private readonly localize;
    /** The tag's theme variant. */
    variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' | 'text';
    /** The tag's size. */
    size: 'small' | 'medium' | 'large';
    /** Draws a pill-style tag with rounded edges. */
    pill: boolean;
    /** Makes the tag removable and shows a remove button. */
    removable: boolean;
    private handleRemoveClick;
    render(): TemplateResult<1>;
}

/**
 * @class CxTemplateSwitcher
 * @extends CortexElement
 * @summary Custom web component for switching templates in the Cortex application. The component manages various settings and menu configurations for different views, sort orders, and other options.
 *
 * @property {TemplateSwitcherProps} data - The data object containing initial settings and other configurations.
 * @property {boolean | null} forcedSortOrder - Indicates if the sort order is forced.
 * @property {string | null} forcedSortOrderReason - The reason for forcing the sort order.
 * @property {MenuData} _menu - Internal state to store the menu data.
 * @property {Settings} _settings - Internal state to store the settings.
 * @property {boolean} _loading - Internal state to indicate if the component is loading.
 *
 * @method handleDataChange - Handles changes to the `data` property and updates settings accordingly.
 * @method handleSettingsChange - Handles changes to the `_settings` property and updates the menu.
 * @method handleAddCortexEvent - Adds a Cortex event using the provided event name and value.
 * @method handleItemSelect - Handles item selection events and updates settings or triggers events.
 * @method firstUpdated - Lifecycle method called after the component is first updated.
 * @method disconnectedCallback - Lifecycle method called when the component is disconnected from the DOM.
 * @method render - Renders the component's template.
 *
 * @event {{ item: MenuItem }} cx-select - Emitted when a menu item is selected.
 */
export declare class CxTemplateSwitcher extends CortexElement {
    private readonly localize;
    viewAndSort: CxViewAndSort;
    data: TemplateSwitcherProps;
    forcedSortOrder: boolean | null;
    forcedSortOrderReason: string | null;
    label: string;
    private _loading;
    private _menu;
    get menu(): MenuData_2;
    private _settings;
    get settings(): Settings;
    private iconMap;
    handleDataChange(): void;
    handleSettingsChange(): void;
    handleAddCortexEvent(eventName: string, value: string, isSetting?: boolean): void;
    handleItemSelect(event: CustomEvent): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    render(): TemplateResult;
}

/**
 * @summary Textareas collect data from the user and allow multiple lines of text.
 *
 * @slot label - The textarea's label. Alternatively, you can use the `label` attribute.
 * @slot help-text - Text that describes how to use the input. Alternatively, you can use the `help-text` attribute.
 *
 * @event cx-blur - Emitted when the control loses focus.
 * @event cx-change - Emitted when an alteration to the control's value is committed by the user.
 * @event cx-focus - Emitted when the control gains focus.
 * @event cx-input - Emitted when the control receives input.
 * @event cx-invalid - Emitted when the form control has been checked for validity and its constraints aren't satisfied.
 *
 * @csspart form-control - The form control that wraps the label, input, and help text.
 * @csspart form-control-label - The label's wrapper.
 * @csspart form-control-input - The input's wrapper.
 * @csspart form-control-help-text - The help text's wrapper.
 * @csspart base - The component's base wrapper.
 * @csspart textarea - The internal `<textarea>` control.
 */
export declare class CxTextarea extends CortexElement implements ShoelaceFormControl {
    static styles: CSSResultGroup;
    private readonly formControlController;
    private readonly hasSlotController;
    private resizeObserver;
    input: HTMLTextAreaElement;
    private hasFocus;
    title: string;
    /** The name of the textarea, submitted as a name/value pair with form data. */
    name: string;
    /** The current value of the textarea, submitted as a name/value pair with form data. */
    value: string;
    /** The textarea's size. */
    size: 'small' | 'medium' | 'large';
    /** Draws a filled textarea. */
    filled: boolean;
    /** The textarea's label. If you need to display HTML, use the `label` slot instead. */
    label: string;
    /** The textarea's help text. If you need to display HTML, use the `help-text` slot instead. */
    helpText: string;
    /** Placeholder text to show as a hint when the input is empty. */
    placeholder: string;
    /** The number of rows to display by default. */
    rows: number;
    /** Controls how the textarea can be resized. */
    resize: 'none' | 'vertical' | 'auto';
    /** Disables the textarea. */
    disabled: boolean;
    /** Makes the textarea readonly. */
    readonly: boolean;
    /**
     * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
     * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
     * the same document or shadow root for this to work.
     */
    form: string;
    /** Makes the textarea a required field. */
    required: boolean;
    /** The minimum length of input that will be considered valid. */
    minlength: number;
    /** The maximum length of input that will be considered valid. */
    maxlength: number;
    /** Controls whether and how text input is automatically capitalized as it is entered by the user. */
    autocapitalize: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
    /** Indicates whether the browser's autocorrect feature is on or off. */
    autocorrect: string;
    /**
     * Specifies what permission the browser has to provide assistance in filling out form field values. Refer to
     * [this page on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for available values.
     */
    autocomplete: string;
    /** Indicates that the input should receive focus on page load. */
    autofocus: boolean;
    /** Used to customize the label or icon of the Enter key on virtual keyboards. */
    enterkeyhint: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
    /** Enables spell checking on the textarea. */
    spellcheck: boolean;
    /**
     * Tells the browser what type of data will be entered by the user, allowing it to display the appropriate virtual
     * keyboard on supportive devices.
     */
    inputmode: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    /** The default value of the form control. Primarily used for resetting the form control. */
    defaultValue: string;
    /** Gets the validity state object */
    get validity(): ValidityState;
    /** Gets the validation message */
    get validationMessage(): string;
    connectedCallback(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    private handleBlur;
    private handleChange;
    private handleFocus;
    private handleInput;
    private handleInvalid;
    private setTextareaHeight;
    handleDisabledChange(): void;
    handleRowsChange(): void;
    handleValueChange(): Promise<void>;
    /** Sets focus on the textarea. */
    focus(options?: FocusOptions): void;
    /** Removes focus from the textarea. */
    blur(): void;
    /** Selects all the text in the textarea. */
    select(): void;
    /** Gets or sets the textarea's scroll position. */
    scrollPosition(position?: {
        left?: number;
        top?: number;
    }): {
        left: number;
        top: number;
    } | undefined;
    /** Sets the start and end positions of the text selection (0-based). */
    setSelectionRange(selectionStart: number, selectionEnd: number, selectionDirection?: 'forward' | 'backward' | 'none'): void;
    /** Replaces a range of text with a new string. */
    setRangeText(replacement: string, start?: number, end?: number, selectMode?: 'select' | 'start' | 'end' | 'preserve'): void;
    /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
    checkValidity(): boolean;
    /** Gets the associated form, if one exists. */
    getForm(): HTMLFormElement | null;
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    reportValidity(): boolean;
    /** Sets a custom validation message. Pass an empty string to restore validity. */
    setCustomValidity(message: string): void;
    render(): TemplateResult<1>;
}

export declare class CxTextToSpeech extends CortexElement {
    static styles: CSSResult;
    private readonly localize;
    private readonly acceptedFileTypes;
    private textEditorContainer;
    private form;
    private bubbleMenu;
    private importDialog;
    private fileInput;
    data: TextToSpeechData | null;
    editable: boolean;
    autofocus: boolean;
    recordId: undefined;
    fileName: undefined;
    componentTitle: string;
    height: undefined;
    width: undefined;
    maxHeight: string;
    maxWidth: undefined;
    minWidth: undefined;
    minHeight: string;
    mock: boolean;
    private textEditor;
    private voices;
    private voice;
    private gender;
    private language;
    private speed;
    private audio;
    private isSpeaking;
    private loading;
    private previewLoading;
    private lastPosition;
    private isSelectionEmpty;
    private bubbleMenuType;
    private timeCode;
    private savedData;
    private provider;
    get 'is-unsaved'(): boolean | null;
    get isUnsaved(): boolean | null;
    get 'current-data'(): TextToSpeechData;
    get currentData(): TextToSpeechData;
    private isSsmlDataNotChanged;
    private saveData;
    onKeyDown: (event: KeyboardEvent) => void;
    onBubbleMenuOpened(): void;
    resetAudio(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    onDataChange(): void;
    onVoicesChange(): void;
    private get selectedVoice();
    private get unsupportedSsmlTags();
    openImportDialog(event: any): void;
    closeImportDialog(): void;
    confirmImport(): void;
    private onAudioTimeUpdate;
    private onAudioEnded;
    pauseAudio(): void;
    endAudio(): void;
    playAudio(): void;
    startNewAudio(blob: Blob): void;
    addAudioEventListeners(): void;
    removeAudioEventListeners(): void;
    handleInsertBreak(): void;
    private getEditorHTML;
    private getSelectedHTML;
    speak(): Promise<void>;
    private clearInput;
    private loadContentFromFile;
    saveSSML(): Promise<void>;
    private renderControls;
    private renderBreakControls;
    private renderBreakMenu;
    private renderSayAsMenu;
    private renderPreviewButtonContent;
    private renderTimeCode;
    private renderGlobalControls;
    private renderInfo;
    private renderImportFileConfirmDialog;
    render(): TemplateResult;
}

/**
 * @summary Tooltips display additional information based on a specific action.
 *
 * @dependency cx-popup
 *
 * @slot - The tooltip's target element. Avoid slotting in more than one element, as subsequent ones will be ignored.
 * @slot content - The content to render in the tooltip. Alternatively, you can use the `content` attribute.
 *
 * @event cx-show - Emitted when the tooltip begins to show.
 * @event cx-after-show - Emitted after the tooltip has shown and all animations are complete.
 * @event cx-hide - Emitted when the tooltip begins to hide.
 * @event cx-after-hide - Emitted after the tooltip has hidden and all animations are complete.
 *
 * @csspart base - The component's base wrapper, an `<cx-popup>` element.
 * @csspart base__popup - The popup's exported `popup` part. Use this to target the tooltip's popup container.
 * @csspart base__arrow - The popup's exported `arrow` part. Use this to target the tooltip's arrow.
 * @csspart body - The tooltip's body where its content is rendered.
 * @csspart hover-bridge - The hover bridge element. Only available when the `hover-bridge` option is enabled.

 * @cssproperty --max-width - The maximum width of the tooltip before its content will wrap.
 * @cssproperty --hide-delay - The amount of time to wait before hiding the tooltip when hovering.
 * @cssproperty --show-delay - The amount of time to wait before showing the tooltip when hovering.
 *
 * @animation tooltip.show - The animation to use when showing the tooltip.
 * @animation tooltip.hide - The animation to use when hiding the tooltip.
 */
export declare class CxTooltip extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-popup': typeof CxPopup;
    };
    private hoverTimeout;
    private readonly localize;
    private closeWatcher;
    defaultSlot: HTMLSlotElement;
    body: HTMLElement;
    popup: CxPopup;
    /** The tooltip's content. If you need to display HTML, use the `content` slot instead. */
    content: string;
    /**
     * The preferred placement of the tooltip. Note that the actual placement may vary as needed to keep the tooltip
     * inside of the viewport.
     */
    placement: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
    /** Disables the tooltip so it won't show when triggered. */
    disabled: boolean;
    /** The distance in pixels from which to offset the tooltip away from its target. */
    distance: number;
    /** Indicates whether or not the tooltip is open. You can use this in lieu of the show/hide methods. */
    open: boolean;
    /** The distance in pixels from which to offset the tooltip along its target. */
    skidding: number;
    /**
     * Controls how the tooltip is activated. Possible options include `click`, `hover`, `focus`, and `manual`. Multiple
     * options can be passed by separating them with a space. When manual is used, the tooltip must be activated
     * programmatically.
     */
    trigger: string;
    /**
     * Enable this option to prevent the tooltip from being clipped when the component is placed inside a container with
     * `overflow: auto|hidden|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all,
     * scenarios.
     */
    hoist: boolean;
    /**
     * When a gap exists between the anchor and the popup element, this option will add a "hover bridge" that fills the
     * gap using an invisible element. This makes listening for events such as `mouseenter` and `mouseleave` more sane
     * because the pointer never technically leaves the element. The hover bridge will only be drawn when the popover is
     * active.
     */
    hoverBridge: boolean;
    constructor();
    disconnectedCallback(): void;
    firstUpdated(): void;
    private handleBlur;
    private handleClick;
    private handleFocus;
    private handleDocumentKeyDown;
    private handleMouseOver;
    private handleMouseOut;
    private hasTrigger;
    handleOpenChange(): Promise<void>;
    handleOptionsChange(): Promise<void>;
    handleDisabledChange(): void;
    /** Shows the tooltip. */
    show(): Promise<void>;
    /** Hides the tooltip */
    hide(): Promise<void>;
    render(): TemplateResult<1>;
}

/**
 * @summary Trees allow you to display a hierarchical list of selectable [tree items](?s=atoms&id=/tree-item). Items with children can be expanded and collapsed as desired by the user.
 *
 * @event {{ selection: CxTreeItem[] }} cx-selection-change - Emitted when a tree item is selected or deselected.
 *
 * @slot - The default slot.
 * @slot expand-icon - The icon to show when the tree item is expanded. Works best with `<cx-icon>`.
 * @slot collapse-icon - The icon to show when the tree item is collapsed. Works best with `<cx-icon>`.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty [--indent-size=var(--cx-spacing-medium)] - The size of the indentation for nested items.
 * @cssproperty [--indent-guide-color=var(--cx-color-neutral-200)] - The color of the indentation line.
 * @cssproperty [--indent-guide-offset=0] - The amount of vertical spacing to leave between the top and bottom of the
 *  indentation line's starting position.
 * @cssproperty [--indent-guide-style=solid] - The style of the indentation line, e.g. solid, dotted, dashed.
 * @cssproperty [--indent-guide-width=0] - The width of the indentation line.
 */
export declare class CxTree extends CortexElement {
    static styles: CSSResultGroup;
    defaultSlot: HTMLSlotElement;
    expandedIconSlot: HTMLSlotElement;
    collapsedIconSlot: HTMLSlotElement;
    /**
     * The selection behavior of the tree. Single selection allows only one node to be selected at a time. Multiple
     * displays checkboxes and allows more than one node to be selected. Leaf allows only leaf nodes to be selected.
     */
    selection: TreeSelection;
    private lastFocusedItem;
    private mutationObserver;
    private clickTarget;
    private readonly localize;
    constructor();
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    private getExpandButtonIcon;
    private initTreeItem;
    private handleTreeChanged;
    private selectItem;
    private getAllTreeItems;
    private focusItem;
    private handleKeyDown;
    private handleClick;
    handleMouseDown(event: MouseEvent): void;
    private handleFocusOut;
    private handleFocusIn;
    private handleSlotChange;
    handleSelectionChange(): Promise<void>;
    /* Excluded from this release type: selectedItems */
    /* Excluded from this release type: getFocusableItems */
    render(): TemplateResult<1>;
}

/**
 * @summary A tree item serves as a hierarchical node that lives inside a [tree](?s=atoms&id=/tree).
 *
 * @dependency cx-checkbox
 * @dependency cx-icon
 * @dependency cx-spinner
 *
 * @event cx-expand - Emitted when the tree item expands.
 * @event cx-after-expand - Emitted after the tree item expands and all animations are complete.
 * @event cx-collapse - Emitted when the tree item collapses.
 * @event cx-after-collapse - Emitted after the tree item collapses and all animations are complete.
 * @event cx-lazy-change - Emitted when the tree item's lazy state changes.
 * @event cx-lazy-load - Emitted when a lazy item is selected. Use this event to asynchronously load data and append
 *  items to the tree before expanding. After appending new items, remove the `lazy` attribute to remove the loading
 *  state and update the tree.
 *
 * @slot - The default slot.
 * @slot expand-icon - The icon to show when the tree item is expanded.
 * @slot collapse-icon - The icon to show when the tree item is collapsed.
 *
 * @csspart base - The component's base wrapper.
 * @csspart item - The tree item's container. This element wraps everything except slotted tree item children.
 * @csspart item--disabled - Applied when the tree item is disabled.
 * @csspart item--expanded - Applied when the tree item is expanded.
 * @csspart item--indeterminate - Applied when the selection is indeterminate.
 * @csspart item--selected - Applied when the tree item is selected.
 * @csspart indentation - The tree item's indentation container.
 * @csspart expand-button - The container that wraps the tree item's expand button and spinner.
 * @csspart label - The tree item's label.
 * @csspart children - The container that wraps the tree item's nested children.
 * @csspart checkbox - The checkbox that shows when using multiselect.
 * @csspart checkbox__base - The checkbox's exported `base` part.
 * @csspart checkbox__control - The checkbox's exported `control` part.
 * @csspart checkbox__control--checked - The checkbox's exported `control--checked` part.
 * @csspart checkbox__control--indeterminate - The checkbox's exported `control--indeterminate` part.
 * @csspart checkbox__checked-icon - The checkbox's exported `checked-icon` part.
 * @csspart checkbox__indeterminate-icon - The checkbox's exported `indeterminate-icon` part.
 * @csspart checkbox__label - The checkbox's exported `label` part.
 */
export declare class CxTreeItem extends CortexElement {
    static styles: CSSResultGroup;
    static dependencies: {
        'cx-checkbox': typeof CxCheckbox;
        'cx-icon': typeof CxIcon;
        'cx-spinner': typeof CxSpinner;
    };
    static isTreeItem(node: Node): node is CxTreeItem;
    private readonly localize;
    indeterminate: boolean;
    isLeaf: boolean;
    loading: boolean;
    selectable: boolean;
    /** Expands the tree item. */
    expanded: boolean;
    /** Draws the tree item in a selected state. */
    selected: boolean;
    /** Disables the tree item. */
    disabled: boolean;
    /** Makes the tree item readonly */
    readonly: boolean;
    /** Enables lazy loading behavior. */
    lazy: boolean;
    defaultSlot: HTMLSlotElement;
    childrenSlot: HTMLSlotElement;
    itemElement: HTMLDivElement;
    childrenContainer: HTMLDivElement;
    expandButtonSlot: HTMLSlotElement;
    connectedCallback(): void;
    firstUpdated(): void;
    private animateCollapse;
    private isNestedItem;
    private handleChildrenSlotChange;
    protected willUpdate(changedProperties: PropertyValueMap<CxTreeItem> | Map<PropertyKey, unknown>): void;
    private animateExpand;
    handleLoadingChange(): void;
    handleDisabledChange(): void;
    handleSelectedChange(): void;
    handleExpandedChange(): void;
    handleExpandAnimation(): void;
    handleLazyChange(): void;
    /** Gets all the nested tree items in this node. */
    getChildrenItems({ includeDisabled, }?: {
        includeDisabled?: boolean;
    }): CxTreeItem[];
    render(): TemplateResult<1>;
}

export declare class CxTypography extends CortexElement {
    static styles: CSSResultGroup;
    variant: Variant;
    render(): TemplateResult;
}

/**
 * @summary A dropdown menu that accepts a JSON string to render menu items for the template switcher dropdown.
 *
 * @event {{ item: MenuItem }} cx-select - Emitted when a menu item is selected.
 */
export declare class CxViewAndSort extends CortexElement {
    static readonly styles: CSSResultGroup;
    private readonly localize;
    dropdown: CxDropdown;
    items: MenuData;
    label: string;
    handleSelectChanged(e: CxSelectEvent): void;
    debouncedHandleSelectChanged: (...args: any[]) => void;
    onSelectChanged(e: CxSelectEvent): void;
    onDropdownShow(e: CxShowEvent): void;
    onDropdownAfterHide(e: CxAfterHideEvent): void;
    hide(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    render(): TemplateResult<1>;
    renderMenuSection(section: MenuSection): TemplateResult;
    renderMenuItem(item: MenuItem, isHorizontal?: boolean, tooltip?: string): TemplateResult;
}

/**
 * @summary The visually hidden utility makes content accessible to assistive devices without displaying it on the screen.
 *
 * @slot - The content to be visually hidden.
 */
export declare class CxVisuallyHidden extends CortexElement {
    static styles: CSSResultGroup;
    render(): TemplateResult<1>;
}

declare type Data = {
    fromTransition?: string | null;
    name?: string | null;
    source?: string | null;
    transitions?: Transition[] | null;
};

declare namespace DownloaderComponentTypes {
    export {
        STATUS,
        UNIT,
        DownloadItem,
        DownloadFileStateDetails,
        OpenDirectoryPickerFunction
    }
}
export { DownloaderComponentTypes }

declare enum DownloadFileStateDetails {
    MissingFileErrorMessage = "MissingFileErrorMessage",
    NetworkErrorMessage = "NetworkErrorMessage",
    NotEnoughStorageErrorMessage = "NotEnoughStorageErrorMessage"
}

declare interface DownloadItem {
    createDate: number;
    id: string;
    name: string;
    path: string;
    progress: number;
    size: number;
    status: STATUS;
    statusDetails: string;
    unit: UNIT;
}

declare const easings: {
    ease: string;
    easeIn: string;
    easeInBack: string;
    easeInCirc: string;
    easeInCubic: string;
    easeInExpo: string;
    easeInOut: string;
    easeInOutBack: string;
    easeInOutCirc: string;
    easeInOutCubic: string;
    easeInOutExpo: string;
    easeInOutQuad: string;
    easeInOutQuart: string;
    easeInOutQuint: string;
    easeInOutSine: string;
    easeInQuad: string;
    easeInQuart: string;
    easeInQuint: string;
    easeInSine: string;
    easeOut: string;
    easeOutBack: string;
    easeOutCirc: string;
    easeOutCubic: string;
    easeOutExpo: string;
    easeOutQuad: string;
    easeOutQuart: string;
    easeOutQuint: string;
    easeOutSine: string;
    linear: string;
};

declare type EasingTypes = EnumOrString<keyof typeof animations.easings>;

declare type Edge = {
    fromNode: string;
    fromTransition?: string;
    icon?: string;
    iconRotation?: number;
    toNode: string;
};

declare interface ElementAnimation {
    keyframes: Keyframe[];
    options?: KeyframeAnimationOptions;
    rtlKeyframes?: Keyframe[];
}

export declare type EnumOrString<T> = T | FakeString;

declare type EventOption = {
    delay: string;
    returnType: string;
};

declare type Events = Record<string, EventOption>;

declare type EventTypeDoesNotRequireDetail<T> = T extends keyof GlobalEventHandlersEventMap ? GlobalEventHandlersEventMap[T] extends CustomEvent<Record<PropertyKey, unknown>> ? GlobalEventHandlersEventMap[T] extends CustomEvent<Record<PropertyKey, never>> ? T : Partial<GlobalEventHandlersEventMap[T]['detail']> extends GlobalEventHandlersEventMap[T]['detail'] ? T : never : T : T;

declare type EventTypeRequiresDetail<T> = T extends keyof GlobalEventHandlersEventMap ? GlobalEventHandlersEventMap[T] extends CustomEvent<Record<PropertyKey, unknown>> ? GlobalEventHandlersEventMap[T] extends CustomEvent<Record<PropertyKey, never>> ? never : Partial<GlobalEventHandlersEventMap[T]['detail']> extends GlobalEventHandlersEventMap[T]['detail'] ? never : T : never : never;

declare type EventTypesWithoutRequiredDetail = {
    [EventType in keyof GlobalEventHandlersEventMap as EventTypeDoesNotRequireDetail<EventType>]: true;
};

declare type EventTypesWithRequiredDetail = {
    [EventType in keyof GlobalEventHandlersEventMap as EventTypeRequiresDetail<EventType>]: true;
};

declare const fadeIn: {
    offset: number;
    opacity: string;
}[];

declare const fadeInBottomLeft: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeInBottomRight: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeInDown: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeInDownBig: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeInLeft: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeInLeftBig: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeInRight: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeInRightBig: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeInTopLeft: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeInTopRight: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeInUp: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeInUpBig: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeOut: {
    offset: number;
    opacity: string;
}[];

declare const fadeOutBottomLeft: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeOutBottomRight: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeOutDown: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const fadeOutDownBig: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const fadeOutLeft: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const fadeOutLeftBig: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const fadeOutRight: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const fadeOutRightBig: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const fadeOutTopLeft: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeOutTopRight: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const fadeOutUp: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const fadeOutUpBig: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare type FakeString = string & Record<string, never>;

declare const flash: {
    offset: number;
    opacity: string;
}[];

declare const flip: {
    easing: string;
    offset: number;
    transform: string;
}[];

declare const flipInX: ({
    easing: string;
    offset: number;
    opacity: string;
    transform: string;
} | {
    easing: string;
    offset: number;
    transform: string;
    opacity?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
    easing?: undefined;
} | {
    offset: number;
    transform: string;
    easing?: undefined;
    opacity?: undefined;
})[];

declare const flipInY: ({
    easing: string;
    offset: number;
    opacity: string;
    transform: string;
} | {
    easing: string;
    offset: number;
    transform: string;
    opacity?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
    easing?: undefined;
} | {
    offset: number;
    transform: string;
    easing?: undefined;
    opacity?: undefined;
})[];

declare const flipOutX: ({
    offset: number;
    transform: string;
    opacity?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const flipOutY: ({
    offset: number;
    transform: string;
    opacity?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare type FlowEdgeData = Edge & {
    isContextMenuOpen?: boolean;
    isHovered?: boolean;
    offset?: number;
};

declare type FlowNodeData = Data & {
    category?: string | null;
    color?: string | null;
    description?: string | null;
    icon?: string | null;
    iconRotation?: number | null;
    id: string;
    isHighlighted?: boolean;
    label?: string | null;
    messages?: string[] | null;
    state?: State | null;
    summaries?: Summary[];
    unordered?: boolean | null;
    unorderedText?: string | null;
};

declare type FormatDateDay = 'numeric' | '2-digit';

declare type FormatDateEra = 'long' | 'short' | 'narrow';

declare type FormatDateHour = 'numeric' | '2-digit';

declare type FormatDateMinute = 'numeric' | '2-digit';

declare type FormatDateMonth = 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';

declare type FormatDateSecond = 'numeric' | '2-digit';

declare type FormatDateTimeZoneHour = 'auto' | '12' | '24';

declare type FormatDateTimeZoneName = 'short' | 'long';

declare type FormatDateWeekday = 'long' | 'short' | 'narrow';

declare type FormatDateYear = 'numeric' | '2-digit';

declare type FormatNumberCurrencyDisplay = 'symbol' | 'narrowSymbol' | 'code' | 'name';

declare type FormatNumberType = 'currency' | 'decimal' | 'percent';

/** A reactive controller to allow form controls to participate in form submission, validation, etc. */
declare class FormControlController implements ReactiveController {
    host: ShoelaceFormControl & ReactiveControllerHost;
    form?: HTMLFormElement | null;
    options: FormControlControllerOptions;
    constructor(host: ReactiveControllerHost & ShoelaceFormControl, options?: Partial<FormControlControllerOptions>);
    hostConnected(): void;
    hostDisconnected(): void;
    hostUpdated(): void;
    private attachForm;
    private detachForm;
    private handleFormData;
    private handleFormSubmit;
    private handleFormReset;
    private handleInteraction;
    private checkFormValidity;
    private reportFormValidity;
    private setUserInteracted;
    private doAction;
    /** Returns the associated `<form>` element, if one exists. */
    getForm(): HTMLFormElement | null;
    /** Resets the form, restoring all the control to their default value */
    reset(submitter?: HTMLInputElement | CxButton): void;
    /** Submits the form, triggering validation and form data injection. */
    submit(submitter?: HTMLInputElement | CxButton): void;
    /**
     * Synchronously sets the form control's validity. Call this when you know the future validity but need to update
     * the host element immediately, i.e. before Lit updates the component in the next update.
     */
    setValidity(isValid: boolean): void;
    /**
     * Updates the form control's validity based on the current value of `host.validity.valid`. Call this when anything
     * that affects constraint validation changes so the component receives the correct validity states.
     */
    updateValidity(): void;
    /**
     * Dispatches a non-bubbling, cancelable custom event of type `cx-invalid`.
     * If the `cx-invalid` event will be cancelled then the original `invalid`
     * event (which may have been passed as argument) will also be cancelled.
     * If no original `invalid` event has been passed then the `cx-invalid`
     * event will be cancelled before being dispatched.
     */
    emitInvalidEvent(originalInvalidEvent?: Event): void;
}

declare interface FormControlControllerOptions {
    /**
     * An array of event names to listen to. When all events in the list are emitted, the control will receive validity
     * states such as user-valid and user-invalid.user interacted validity states. */
    assumeInteractionOn: string[];
    /**
     * A function that maps to the form control's `checkValidity()` function. When the control is invalid, this will return false.
     *   this is helpful is you want to check validation without triggering the native browser constraint violation warning.
     */
    checkValidity: (input: ShoelaceFormControl) => boolean;
    /** A function that returns the form control's default value. */
    defaultValue: (input: ShoelaceFormControl) => unknown | unknown[];
    /** A function that returns the form control's current disabled state. If disabled, the value won't be submitted. */
    disabled: (input: ShoelaceFormControl) => boolean;
    /** A function that returns the form containing the form control. */
    form: (input: ShoelaceFormControl) => HTMLFormElement | null;
    /** A function that returns the form control's name, which will be submitted with the form data. */
    name: (input: ShoelaceFormControl) => string;
    /**
     * A function that maps to the form control's reportValidity() function. When the control is invalid, this will
     * prevent submission and trigger the browser's constraint violation warning.
     */
    reportValidity: (input: ShoelaceFormControl) => boolean;
    /** A function that sets the form control's value */
    setValue: (input: ShoelaceFormControl, value: unknown) => void;
    /** A function that returns the form control's current value. */
    value: (input: ShoelaceFormControl) => unknown | unknown[];
}

declare const GenderMap: {
    readonly '1': "MALE";
    readonly '2': "FEMALE";
};

/** Gets an element's animation. Falls back to the default if no animation is found. */
export declare function getAnimation(el: Element, animationName: string, options: GetAnimationOptions): ElementAnimation;

/** Gets a list of all supported animation names. */
export declare function getAnimationNames(): string[];

declare interface GetAnimationOptions {
    /**
     * The component's directionality. When set to "rtl", `rtlKeyframes` will be preferred over `keyframes` where
     * available using getAnimation().
     */
    dir: string;
}

declare type GetClusterDataFunction = () => ClusterData | Promise<ClusterData>;

declare type GetCustomEventType<T> = T extends keyof GlobalEventHandlersEventMap ? GlobalEventHandlersEventMap[T] extends CustomEvent<unknown> ? GlobalEventHandlersEventMap[T] : CustomEvent<unknown> : CustomEvent<unknown>;

/** Gets a list of all supported easing function names. */
export declare function getEasingNames(): string[];

declare namespace GraphViewComponentTypes {
    export {
        Edge,
        FlowEdgeData,
        Transition,
        Permission,
        NodeType,
        Data,
        Summary,
        FlowNodeData,
        Node_2 as Node,
        Workflow,
        HierarchyData,
        NodeHierarchyDataMap,
        MappedEdge,
        MappedNode
    }
}
export { GraphViewComponentTypes }

declare const headShake: {
    offset: number;
    transform: string;
}[];

declare const heartBeat: {
    offset: number;
    transform: string;
}[];

declare type HierarchyData = {
    depth: number;
    height: number;
    id: string;
    parent: string | null;
};

declare const hinge: ({
    easing: string;
    offset: number;
    transform?: undefined;
    opacity?: undefined;
} | {
    easing: string;
    offset: number;
    transform: string;
    opacity?: undefined;
} | {
    easing: string;
    offset: number;
    opacity: string;
    transform: string;
} | {
    offset: number;
    opacity: string;
    transform: string;
    easing?: undefined;
})[];

declare const jackInTheBox: ({
    offset: number;
    opacity: string;
    transform: string;
    'transform-origin': string;
} | {
    offset: number;
    transform: string;
    opacity?: undefined;
    'transform-origin'?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
    'transform-origin'?: undefined;
})[];

declare const jello: {
    offset: number;
    transform: string;
}[];

declare const lightSpeedInLeft: ({
    offset: number;
    opacity: string;
    transform: string;
} | {
    offset: number;
    transform: string;
    opacity?: undefined;
})[];

declare const lightSpeedInRight: ({
    offset: number;
    opacity: string;
    transform: string;
} | {
    offset: number;
    transform: string;
    opacity?: undefined;
})[];

declare const lightSpeedOutLeft: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const lightSpeedOutRight: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare type MappedEdge = Edge_2<FlowEdgeData>;

declare type MappedNode = Node_3<FlowNodeData>;

declare type Mark = {
    hidden: boolean;
    label: string;
    value: number;
};

declare type MenuData = MenuSection[];

declare type MenuItem = {
    checked?: boolean;
    disabled?: boolean;
    divider?: boolean;
    eventName?: string;
    forceHighlight?: boolean;
    group?: string;
    hidden?: boolean;
    icon?: string | TemplateResult;
    iconVariant?: string;
    label: string;
    labelAsSelected?: boolean;
    selected?: boolean;
    selectedTip?: string | null;
    submenu?: MenuSection[];
    type?: 'switch' | 'button';
    unselectedTip?: string | null;
    value: string;
};

declare type MenuSection = {
    horizontal?: boolean;
    items: MenuItem[];
    selected?: string;
    title?: string;
    tooltip?: string;
};

declare type Message = {
    content: string;
    events?: Array<{
        callback: (messageContent: string) => void;
        label: string;
    }>;
    finished?: boolean;
    isEndOfRole?: boolean;
    isStartOfRole?: boolean;
    references?: Reference[];
    role: MessageRole;
};

declare enum MessageRole {
    ASSISTANT = "assistant",
    SYSTEM = "system",
    USER = "user"
}

declare class Modal {
    element: HTMLElement;
    isExternalActivated: boolean;
    tabDirection: 'forward' | 'backward';
    currentFocus: HTMLElement | null;
    previousFocus: HTMLElement | null;
    elementsWithTabbableControls: string[];
    constructor(element: HTMLElement);
    /** Activates focus trapping. */
    activate(): void;
    /** Deactivates focus trapping. */
    deactivate(): void;
    /** Determines if this modal element is currently active or not. */
    isActive(): boolean;
    /** Activates external modal behavior and temporarily disables focus trapping. */
    activateExternal(): void;
    /** Deactivates external modal behavior and re-enables focus trapping. */
    deactivateExternal(): void;
    private checkFocus;
    private handleFocusIn;
    private possiblyHasTabbableChildren;
    private handleKeyDown;
    private handleKeyUp;
}

declare type MoreOptions = Record<string, Option_2>;

declare namespace MultiSelectComponentTypes {
    export {
        ColumnData
    }
}
export { MultiSelectComponentTypes }

declare type Node_2 = {
    category?: string | null;
    color?: string | null;
    data: Data | null;
    description?: string | null;
    icon?: string | null;
    id: string;
    messages?: string[] | null;
    name?: string | null;
    state?: State | null;
    summaries?: Summary[];
    type: 'Action' | 'Decision' | 'Status' | 'Trigger' | 'Ghost' | null;
    unordered?: boolean | null;
    unorderedText?: string | null;
};

declare type NodeHierarchyDataMap = Record<string, HierarchyData>;

declare type NodeType = {
    allows_loop?: boolean;
    color: string;
    icon: string;
    name: string;
};

declare type OpenDirectoryPickerFunction = (args: {
    containerName: string;
    transactionID: string;
}) => void;

declare type Option_2 = {
    category: string | null;
    eventName: string;
    id: string;
    isSetting: boolean | null;
    name: string;
    selectedTip?: string | null;
    subCategory: string | null;
    unselectedTip?: string | null;
};

declare type Permission = {
    id: string;
    rights: string;
};

declare const pulse: {
    offset: number;
    transform: string;
}[];

declare type Reference = {
    href: string;
    id: string;
    source: string;
    summary: string;
    title: string;
};

declare const rollIn: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const rollOut: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const rotateIn: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const rotateInDownLeft: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const rotateInDownRight: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const rotateInUpLeft: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const rotateInUpRight: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const rotateOut: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const rotateOutDownLeft: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const rotateOutDownRight: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const rotateOutUpLeft: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const rotateOutUpRight: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const rubberBand: {
    offset: number;
    transform: string;
}[];

declare type SectionOption = {
    id: string;
    name: string;
};

declare type Service = {
    desiredCount: number;
    maxNodeCount: number;
    minNodeCount: number;
    runningCount: number;
    serviceId: string;
};

/** Sets a custom animation for the specified element. */
export declare function setAnimation(el: Element, animationName: string, animation: ElementAnimation | null): void;

/**
 * Sets a default animation. Components should use the `name.animation` for primary animations and `name.part.animation`
 * for secondary animations, e.g. `dialog.show` and `dialog.overlay.show`. For modifiers, use `drawer.showTop`.
 */
export declare function setDefaultAnimation(animationName: string, animation: ElementAnimation | null): void;

declare type Settings = {
    darkMode: boolean | null;
    deployStack: boolean;
    direction: string;
    groupBy: string;
    itemsPerPage: string;
    resequence: boolean;
    seeThru: boolean | null;
    showBinnedAssets: boolean;
    sortOrder: string;
    view: string;
};

declare const shake: {
    offset: number;
    transform: string;
}[];

declare const shakeX: {
    offset: number;
    transform: string;
}[];

declare const shakeY: {
    offset: number;
    transform: string;
}[];

declare interface ShoelaceFormControl extends CortexElement {
    checkValidity: () => boolean;
    defaultChecked?: boolean;
    defaultValue?: unknown;
    disabled?: boolean;
    form?: string;
    getForm: () => HTMLFormElement | null;
    max?: number | string | Date;
    maxlength?: number;
    min?: number | string | Date;
    minlength?: number;
    name: string;
    pattern?: string;
    reportValidity: () => boolean;
    required?: boolean;
    setCustomValidity: (message: string) => void;
    step?: number | 'any';
    readonly validationMessage: string;
    readonly validity: ValidityState;
    value: unknown;
}

declare const slideInDown: ({
    offset: number;
    transform: string;
    visibility: string;
} | {
    offset: number;
    transform: string;
    visibility?: undefined;
})[];

declare const slideInLeft: ({
    offset: number;
    transform: string;
    visibility: string;
} | {
    offset: number;
    transform: string;
    visibility?: undefined;
})[];

declare const slideInRight: ({
    offset: number;
    transform: string;
    visibility: string;
} | {
    offset: number;
    transform: string;
    visibility?: undefined;
})[];

declare const slideInUp: ({
    offset: number;
    transform: string;
    visibility: string;
} | {
    offset: number;
    transform: string;
    visibility?: undefined;
})[];

declare const slideOutDown: ({
    offset: number;
    transform: string;
    visibility?: undefined;
} | {
    offset: number;
    transform: string;
    visibility: string;
})[];

declare const slideOutLeft: ({
    offset: number;
    transform: string;
    visibility?: undefined;
} | {
    offset: number;
    transform: string;
    visibility: string;
})[];

declare const slideOutRight: ({
    offset: number;
    transform: string;
    visibility?: undefined;
} | {
    offset: number;
    transform: string;
    visibility: string;
})[];

declare const slideOutUp: ({
    offset: number;
    transform: string;
    visibility?: undefined;
} | {
    offset: number;
    transform: string;
    visibility: string;
})[];

declare type SortOrder = Option_2 & {
    direction: Option_2[] | null;
};

declare type SpacingProp = '3x-small' | '2x-small' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | '2x-large' | '3x-large' | '4x-large';

declare type State = 'Error';

declare enum STATUS {
    Assembling = "assembling",
    Cancelled = "cancelled",
    Completed = "completed",
    Downloading = "downloading",
    Failed = "failed",
    Paused = "paused"
}

declare type Summary = {
    icon: string;
    texts: string[];
};

declare const swing: {
    offset: number;
    transform: string;
}[];

declare const tada: {
    offset: number;
    transform: string;
}[];

declare namespace TemplateSwitcherComponentTypes {
    export {
        Settings,
        Category,
        Option_2 as Option,
        TemplateSwitcherProps
    }
}
export { TemplateSwitcherComponentTypes }

declare type TemplateSwitcherProps = {
    VFormID: string;
    categories?: Category[];
    defaultDirectionWhenSortChange: string;
    defaultSettings: Settings;
    defaultSortForResequence: string;
    disabledCountForViews?: string[];
    disabledDeployStackForViews?: string[];
    disabledGroupByForViews?: string[];
    disabledSeeThruForViews?: string[];
    disabledSortForViews?: string[];
    events: Events;
    forceSortOrderWhenSeethruOff: string;
    groupBy: Option_2[] | null;
    hideDeployStackForViews?: string[];
    hideGroupByForViews?: string[];
    initSettings: Settings;
    itemsPerPage: Option_2[];
    moreOptions: MoreOptions;
    sections: SectionOption[];
    sortOrder: SortOrder[];
    view: Option_2[];
};

declare namespace TextToSpeechComponentTypes {
    export {
        Voice,
        GenderMap,
        TuneOptions,
        TextToSpeechData
    }
}
export { TextToSpeechComponentTypes }

declare type TextToSpeechData = {
    HtmlData: string;
    SsmlData: {
        LanguageCode: string;
        Name: string;
        SsmlGender: 1 | 2;
        SsmlText: string;
    };
};

declare type Transition = {
    description?: string | null;
    icon?: string | null;
    icon_rotation?: number | null;
    id: string;
    name?: string;
    required?: boolean;
    type?: string | null;
};

declare type TreeSelection = 'single' | 'multiple' | 'leaf';

declare type TuneOptions = {
    ssmlTagName: string;
};

declare enum UNIT {
    B = "B",
    Gb = "GB",
    Kb = "KB",
    Mb = "MB"
}

declare type UpdateServiceFunction = (params: {
    desiredCount: number;
    serviceId: string;
}) => {
    service: Service;
} | Promise<{
    service: Service;
}>;

declare enum Variant {
    BODY1 = "body1",
    BODY2 = "body2",
    BODY3 = "body3",
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    H4 = "h4",
    H5 = "h5",
    H6 = "h6",
    SMALL = "small"
}

declare namespace ViewAndSortComponentTypes {
    export {
        MenuItem,
        MenuSection,
        MenuData
    }
}
export { ViewAndSortComponentTypes }

declare interface VirtualElement {
    contextElement?: Element;
    getBoundingClientRect: () => DOMRect;
}

declare type Voice = {
    isPremiumVoice?: boolean;
    languageCodes: string[];
    name: string;
    ssmlGender: string;
    unsupportedSsmlTags?: string[];
};

declare type WithRequired<T, K extends keyof T> = T & {
    [P in K]-?: T[P];
};

declare const wobble: {
    offset: number;
    transform: string;
}[];

declare type Workflow = {
    data: Data | null;
    description: string | null;
    id: string | null;
    links: Edge[] | null;
    name: string | null;
    node_types: Record<string, NodeType> | null;
    nodes: Node_2[] | null;
    type: string | null;
};

declare const zoomIn: ({
    offset: number;
    opacity: string;
    transform: string;
} | {
    offset: number;
    opacity: string;
    transform?: undefined;
})[];

declare const zoomInDown: {
    easing: string;
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const zoomInLeft: {
    easing: string;
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const zoomInRight: {
    easing: string;
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const zoomInUp: {
    easing: string;
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const zoomOut: ({
    offset: number;
    opacity: string;
    transform?: undefined;
} | {
    offset: number;
    opacity: string;
    transform: string;
})[];

declare const zoomOutDown: {
    easing: string;
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const zoomOutLeft: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const zoomOutRight: {
    offset: number;
    opacity: string;
    transform: string;
}[];

declare const zoomOutUp: {
    easing: string;
    offset: number;
    opacity: string;
    transform: string;
}[];

export { }


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-board-change': CxBoardChangeEvent;
        'cx-board-item-added': CxBoardItemAddedEvent;
        'cx-board-item-removed': CxBoardItemRemovedEvent;
        'cx-board-selected-change': CxBoardSelectedChangeEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-after-hide': CxAfterHideEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-board-item-checkbox-click': CxBoardItemCheckboxClickEvent;
        'cx-board-item-label-click': CxBoardItemLabelClickEvent;
        'cx-multi-select-configure': CxMultiSelectConfigureEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-blur': CxBlurEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-after-expand': CxAfterExpandEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-after-show': CxAfterShowEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-cancel': CxCancelEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-close': CxCloseEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-collapse': CxCollapseEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-action-dropdown-hide': CxActionDropdown;
        'cx-action-dropdown-show': CxActionDropdown;
        'cx-graph-view-add-node': CxGraphViewAddNodeEvent;
        'cx-graph-view-pane-click': CxGraphViewPaneClickEvent;
        'cx-graph-view-select-edge': CxGraphViewSelectEdgeEvent;
        'cx-graph-view-select-node': CxGraphViewSelectNodeEvent;
        'cx-graph-view-unlink': CxGraphViewUnlinkEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-change': CxChangeEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-copy': CxCopyEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-clear': CxClearEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-after-collapse': CxAfterCollapseEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-error': CxErrorEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-expand': CxExpandEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-finish': CxFinishEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-focus': CxFocusEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-hide': CxHideEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-hover': CxHoverEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-initial-focus': CxInitialFocusEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-input': CxInputEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-keydown': CxKeydownEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-invalid': CxInvalidEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-lazy-load': CxLazyLoadEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-lazy-change': CxLazyChangeEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-mutation': CxMutationEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-load': CxLoadEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-remove': CxRemoveEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-reposition': CxRepositionEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-ready': CxReadyEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-request-close': CxRequestCloseEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-resize': CxResizeEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-select': CxSelectEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-selection-change': CxSelectionChangeEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-show': CxShowEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-slide-change': CxSlideChangeEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-page-change': CxPageChangeEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-start': CxStartEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-tab-hide': CxTabHideEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-swatch-add': CxSwatchAddEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-tab-show': CxTabShowEvent;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-drag-end': CxDragEnd;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-drag-start': CxDragStart;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-refresh': CxRefreshEvent;
    }
}


declare global {
    interface Window {
        Matrix3: any;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        [eventName: string]: eventName extends `cx-invoked${string}` ? CxInvokedEvent : never;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-multi-select-change': CxMultiSelectChangeEvent;
    }
}


declare global {
    interface Window {
        Param: any;
        Utils: any;
        tabId: string;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-animated-image': CxAnimatedImage;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-alert': CxAlert;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-animation': CxAnimation;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-avatar': CxAvatar;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-badge': CxBadge;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-breadcrumb': CxBreadcrumb;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-breadcrumb-item': CxBreadcrumbItem;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-button': CxButton;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-button-group': CxButtonGroup;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-card': CxCard;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-carousel': CxCarousel;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-carousel-item': CxCarouselItem;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-checkbox': CxCheckbox;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-color-picker': CxColorPicker;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-copy-button': CxCopyButton;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-details': CxDetails;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-dialog': CxDialog;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-divider': CxDivider;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-dropdown': CxDropdown;
    }
    interface Window {
        CxDropdown: typeof CxDropdown;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-drawer': CxDrawer;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-element-clamp': CxElementClamp;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-format-bytes': CxFormatBytes;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-format-date': CxFormatDate;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-hub-connection': CxHubConnection;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-format-number': CxFormatNumber;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-icon': CxIcon;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-icon-button': CxIconButton;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-image-comparer': CxImageComparer;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-include': CxInclude;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-input': CxInput;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-input-group': CxInputGroup;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-line-clamp': CxLineClamp;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-markdown': CxMarkdown;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-menu': CxMenu;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-menu-item': CxMenuItem;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-menu-label': CxMenuLabel;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-menu-section': CxMenuSection;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-mutation-observer': CxMutationObserver;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-option': CxOption;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-pagination': CxPagination;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-popup': CxPopup;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-progress-bar': CxProgressBar;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-qr-code': CxQrCode;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-progress-ring': CxProgressRing;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-radio': CxRadio;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-radio-button': CxRadioButton;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-radio-group': CxRadioGroup;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-radio-card': CxRadioCard;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-range': CxRange;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-rating': CxRating;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-relative-time': CxRelativeTime;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-resize-observer': CxResizeObserver;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-select': CxSelect;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-skeleton': CxSkeleton;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-space': CxSpace;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-spinner': CxSpinner;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-split-panel': CxSplitPanel;
    }
}


declare global {
    interface GlobalEventHandlersEventMap {
        'cx-step-select': CxStepSelect;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-step': CxStep;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-stepper': CxStepper;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-switch': CxSwitch;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-tab': CxTab;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-tab-group': CxTabGroup;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-tab-panel': CxTabPanel;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-tag': CxTag;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-textarea': CxTextarea;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-tooltip': CxTooltip;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-tree': CxTree;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-tree-item': CxTreeItem;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-typography': CxTypography;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-visually-hidden': CxVisuallyHidden;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-grid': CxGrid;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-grid-item': CxGridItem;
    }
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        tune: {
            setBreakNode: (someProp?: any) => ReturnType;
            setEmphasis: (someProp?: any) => ReturnType;
            setProsody: (someProp?: any) => ReturnType;
            setSayAs: (someProp?: any) => ReturnType;
            unsetEmphasis: (someProp?: any) => ReturnType;
            unsetProsody: (someProp?: any) => ReturnType;
            unsetSayAs: (someProp?: any) => ReturnType;
        };
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-menu-label': CxMenuLabel;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-resize-observer': CxResizeObserver;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-split-panel': CxSplitPanel;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-tab': CxTab;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-tab-group': CxTabGroup;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-switch': CxSwitch;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'cx-overlay': Overlay;
    }
}


declare namespace IMask {
    let InputMask: typeof _InputMask;
    let createMask: typeof _createMask;
    let Masked: typeof _Masked;
    let MaskedPattern: typeof _MaskedPattern;
    let RepeatBlock: typeof _RepeatBlock;
    let MaskedDate: typeof _MaskedDate;
    let MaskedDynamic: typeof _MaskedDynamic;
    let MaskedEnum: typeof _MaskedEnum;
    let MaskedRange: typeof _MaskedRange;
    let MaskedNumber: typeof _MaskedNumber;
    let MaskedFunction: typeof _MaskedFunction;
    let MaskedRegExp: typeof _MaskedRegExp;
    let ChangeDetails: typeof _ChangeDetails;
    let MaskElement: typeof _MaskElement;
    let HTMLMaskElement: typeof _HTMLMaskElement;
    let HTMLContenteditableMaskElement: typeof _HTMLContenteditableMaskElement;
    let createPipe: typeof _createPipe;
    let pipe: typeof _pipe;
    let PIPE_TYPE: typeof _PIPE_TYPE;
}


declare global {
    interface GlobalEventHandlersEventMap {
        'slottable-request': SlottableRequestEvent;
    }
}

