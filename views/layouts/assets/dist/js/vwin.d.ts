interface IVirtualWindow {
    oid: string;
    winmanIdx: number;
}
interface IVWins {
    [K: string]: IVirtualWindow;
}
declare enum TWinEvents {
    EV_RECIVE_FOCUS = "reciveFocus"
}
declare class TWinMan {
    firstZIndex: number;
    protected _wins: Array<vw.TVirtWindow>;
    protected _overlay: vw.TVWOverlay;
    constructor(options?: any);
    registerWindow(win: vw.TVirtWindow): void;
    unRegisterWindow(win: vw.TVirtWindow): void;
    topWindow(win: vw.TVirtWindow): void;
    doWinFocus(win: vw.TVirtWindow): void;
    leftWinFocus(win: vw.TVirtWindow): void;
    protected sort(): void;
    readonly nextIdx: number;
    readonly top: vw.TVirtWindow;
    readonly window: Window & typeof globalThis;
    readonly issetModal: boolean | vw.TVirtWindow;
    moveOverlay(modalWin: boolean | vw.TVirtWindow): boolean;
}
declare var _winman: any;
interface VirtualWindow {
    win: vw.TVirtWindow;
}
declare function createVWin(options?: vw.IVirtualWindowOptions): Promise<vw.TVirtWindow>;
interface Window {
    isFrameWin: boolean;
    winman: TWinMan;
    createVWin(caption?: string, content?: string): VirtualWindow;
    createVWin(caption?: string, content?: HTMLElement | NodeList): VirtualWindow;
    createVWin(options?: vw.IVirtualWindowOptions): VirtualWindow;
}
declare const VirtualWindow: (options?: vw.IVirtualWindowOptions) => Promise<vw.TVirtWindow>;
interface Window {
    VirtualWindow(options?: vw.IVirtualWindowOptions): Promise<vw.TVirtWindow>;
    vwCaption: string;
}
declare module vw {
    enum TVWEvents {
        EV_ON_CREATED = "vw:created",
        EV_ON_DESTROYES = "vw:destroyed",
        EV_ON_FOCUSED = "vw:focused",
        EV_ON_OPEN = "vw:open",
        EV_BEFORE_OPEN = "vw:beforeopen",
        EV_BEFORE_CLOSE = "vw:beforeclose",
        EV_ON_SHOW = "vw:onshow",
        EV_ON_CLOSE = "vw:close",
        EV_ON_MODAL_RESULT = "vw:modalresult",
        EV_ON_SIZEABLED = "vw:sizeabled"
    }
    enum TModalResult {
        mrOk = 1,
        mrCancel = 2,
        mrClose = 4
    }
    interface IVirtualWindowOptions {
        class?: any;
        oid?: string;
        caption?: string | vw.ICaptionBarOptions;
        content?: string | HTMLElement | NodeList | vw.IVWContentOptions;
        bounds?: vw.IVWBoundsOptions;
        buttons?: vw.IVWButtonsOptions;
        drag?: boolean;
        dimentionsByContent?: boolean;
        showCloseButton?: boolean;
        cssClass?: string;
        modal?: boolean;
        sizeable?: boolean;
        showOnOpen?: boolean;
    }
    class TVirtWindow extends HTMLElement implements IVirtualWindow {
        static ancestor: string;
        oid: string;
        dragdrop: mf.TBaseDragDrop;
        drag: boolean;
        showOnOpen: boolean;
        protected _modal: boolean;
        modalResult: vw.TModalResult;
        winmanIdx: number;
        protected _captionBar: vw.TVWCaptionBar;
        protected _contentBar: vw.TVWContent;
        protected _buttons: vw.TVWButtons | vw.IVWButtonsOptions;
        protected _bounds: vw.TVWBounds;
        protected _sizeable: vw.TSizeable;
        showCloseButton: boolean;
        private _ev_closeButtonClick;
        constructor(options: vw.IVirtualWindowOptions);
        init(options: vw.IVirtualWindowOptions): void;
        destroy(): this;
        protected _initEvents(): void;
        onModalResult(win: vw.TVirtWindow): void;
        renderCloseButton(): void;
        letFocus(): void;
        open(): vw.TVirtWindow;
        close(): vw.TVirtWindow;
        sizeable: boolean | vw.ISizeableOptions;
        zIndex: number;
        cssClass: string;
        bounds: vw.IVWBoundsOptions;
        readonly captionBar: TVWCaptionBar;
        readonly buttonsBar: TVWButtons;
        caption: string | vw.ICaptionBarOptions;
        content: string | HTMLElement | NodeList | vw.IVWContentOptions;
        buttons: null | vw.TVWButtons | vw.IVWButtonsOptions;
        modal: boolean;
        ancestor: string;
    }
    interface ICaptionBarOptions {
        caption?: string;
        iconClass?: string;
        closeButtonClass?: string;
    }
    class TVWCaptionBar extends HTMLElement {
        protected _iconElement: HTMLElement;
        protected _captionElement: HTMLElement;
        protected _closeButtonElement: HTMLElement;
        constructor(options?: vw.ICaptionBarOptions);
        closeButtonClass: string;
        iconClass: string;
        caption: string;
        readonly window: TVirtWindow;
    }
}
declare module vw {
    enum TBoundsPosition {
        POS_CENTER = 1,
        POS_CASCADE = 2,
        POS_STORAGE = 4,
        POS_DEFAULT = 8
    }
    interface IVWBoundsOptions {
        owner?: vw.TVirtWindow;
        class?: any;
        position?: vw.TBoundsPosition;
        /**
         * Для сохранения геометрии на удалённом хосте
         */
        remoteMethod?: string;
    }
    class TVWBounds {
        owner: vw.TVirtWindow;
        protected _position: vw.TBoundsPosition;
        protected _storage: vw.TStorage;
        protected _styleCache: CSSStyleRule;
        constructor(options: vw.IVWBoundsOptions);
        show(): void;
        hide(): void;
        doDimensions(): void;
        doPosition(): void;
        readonly isStorage: number;
        position: number;
        readonly width: number;
        readonly height: number;
    }
    interface IStorage {
        owner: vw.TVirtWindow;
        store(): vw.IStorageData;
        restore(data?: vw.IStorageData): void;
    }
    interface IStorageData {
        left: number;
        top: number;
        width: number;
        height: number;
    }
    class TStorage implements vw.IStorage {
        owner: vw.TVirtWindow;
        constructor(owner: vw.TVirtWindow);
        store(): vw.IStorageData;
        restore(data?: vw.IStorageData): void;
    }
    class TLocalStorage extends vw.TStorage implements vw.IStorage {
        store(): vw.IStorageData;
        restore(): void;
    }
    class TRemoteStorage extends vw.TStorage implements vw.IStorage {
        method: string;
    }
}
declare module vw {
    enum TVWEvents {
        EV_ON_CONTENT = "vw:content"
    }
    interface IVWContentOptions {
        owner?: vw.TVirtWindow;
        class?: any;
        data?: string | HTMLElement | NodeList;
        src?: string;
        remote?: vw.IVWRemoteContentOptions;
    }
    enum TVWRemoteContentMethod {
        METHOD_JQAJAX = "jqajax",
        METHOD_FETCH = "fetch"
    }
    class TVWContent extends HTMLElement {
        owner: vw.TVirtWindow;
        protected _remote: vw.TVWRemoteContentTransport;
        constructor(options?: vw.IVWContentOptions);
        data: string | HTMLElement | NodeList;
        remote: vw.IVWRemoteContentOptions;
    }
    interface IVWRemoteContentOptions {
        type?: vw.TVWRemoteContentMethod;
        url: string;
        settings?: JQuery.AjaxSettings | RequestInit;
    }
    interface IAjaxSuccessResponse extends mfResponse {
        data: {
            html: string;
            js?: Array<Object>;
        };
    }
    class TVWRemoteContentTransport {
        protected content: vw.TVWContent;
        constructor(content: vw.TVWContent, options: vw.IVWRemoteContentOptions);
        protected renderContent(content: vw.IAjaxSuccessResponse): void;
        protected _getFetch(options: vw.IVWRemoteContentOptions): void;
        protected _getJqAjax(options: vw.IVWRemoteContentOptions): void;
    }
    interface IVWFrameContentOptions extends vw.IVWContentOptions {
        src?: string;
    }
    class TVWFrameContent extends vw.TVWContent {
        protected _iframe: HTMLIFrameElement;
        constructor(options?: vw.IVWContentOptions);
        refresh(): void;
        src: string;
        data: any;
    }
}
declare module vw {
    enum TButtonsAlignment {
        ALIGN_LEFT = "left",
        ALIGN_RIGHT = "right",
        ALIGN_CENTER = "center"
    }
    interface IVWButtonsOptions {
        owner?: IVirtualWindow;
        cssClass?: string;
        align?: vw.TButtonsAlignment;
        items: Array<vw.IVWButtonOptions>;
    }
    class TVWButtons extends HTMLElement {
        owner: IVirtualWindow;
        protected _items: Array<vw.TVWButton>;
        constructor(options?: vw.IVWButtonsOptions);
        init(options: vw.IVWButtonsOptions): void;
        cssClass: string;
        align: vw.TButtonsAlignment;
        readonly itemsWidth: number;
        readonly computedStyle: CSSStyleDeclaration;
        readonly buttons: TVWButton[];
        items: Array<vw.IVWButtonOptions>;
    }
}
declare module vw {
    interface IVWButtonOptions {
        xhref?: string;
        svgclass?: string;
        caption?: string;
        cssClass?: string;
        modalResult?: vw.TModalResult | number | Function;
    }
    class TVWButton extends HTMLElement {
        constructor(...args: any[]);
        caption: string;
        cssClass: string;
        modalResult: vw.TModalResult | number | Function;
        readonly window: TVirtWindow;
    }
}
declare module vw {
    interface IVWOverlayOptions {
        opacity: number;
    }
    class TVWOverlay extends HTMLElement {
        opacity: number;
        constructor(options?: vw.IVWOverlayOptions);
        destroy(): void;
        show(): void;
        hide(): void;
    }
}
declare module vw {
    class TVWDragDrop extends mf.TBaseDragDrop {
        protected startDrag(ev: MouseEvent): boolean;
        protected clearDrag(): void;
    }
}
declare module vw {
    interface ISizeableOptions {
        /**
         * Элемент, на который распространяется изменение размеров
         */
        sizeableElement: HTMLElement;
        /**
         * CSS селектор элемента ресайза
         */
        cssClass?: string;
    }
    class TSizeable extends HTMLElement {
        protected _beginOffset: TOffsetCoords;
        protected _beginEvent: MouseEvent;
        private _ev_MouseDown;
        private _ev_MouseMove;
        private _ev_MouseUp;
        protected _rfa: number;
        constructor(options: vw.ISizeableOptions);
        protected _initEvents(): void;
        protected startDrag(ev: MouseEvent): void;
        protected clearDrag(): void;
        sizeableElement: HTMLElement;
        cssClass: string;
        private isPosition;
    }
}
declare module vw {
    var baseDialogsSettings: {
        modal: boolean;
        sizeable: boolean;
        showOnOpen: boolean;
        bounds: {
            position: TBoundsPosition;
        };
        buttons: {
            align: TButtonsAlignment;
            items: {
                caption: string;
                cssClass: string;
                modalResult: TModalResult;
            }[];
        };
    };
    class TDialogs extends vw.TVirtWindow {
        constructor(options: vw.IVirtualWindowOptions);
    }
    class TDialogsContent extends vw.TVWContent {
        constructor(options?: vw.IVWContentOptions);
    }
    function getAlertSettings(): Object;
    function Alert(caption: string, message: string, options?: vw.IVirtualWindowOptions): Promise<void | TVirtWindow>;
    class TDialogAlert extends vw.TDialogs {
    }
    function getSuccessSettings(): Object;
    function Success(caption: string, message: string, options?: vw.IVirtualWindowOptions): Promise<void | TVirtWindow>;
    class TDialogSuccess extends vw.TDialogs {
    }
    function getWarningSettings(): Object;
    function Warning(caption: string, message: string, options?: vw.IVirtualWindowOptions): Promise<void | TVirtWindow>;
    class TDialogWarning extends vw.TDialogs {
    }
    function getInfoSettings(): Object;
    function Info(caption: string, message: string, options?: vw.IVirtualWindowOptions): Promise<void | TVirtWindow>;
    class TDialogInfo extends vw.TDialogs {
    }
    function getConfirmSettings(): Object;
    function Confirm(caption: string, message: string, options?: vw.IVirtualWindowOptions): Promise<void | TVirtWindow>;
    class TDialogConfirm extends vw.TDialogs {
    }
}
