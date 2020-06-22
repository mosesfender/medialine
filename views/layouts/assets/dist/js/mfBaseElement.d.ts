declare module mf {
    enum SvgIcons {
        GOTO_LINK = "goto_link",
        SETTINGS = "settings",
        SETTINGS_2 = "settings_2",
        SORT_ALPHABET_ASC = "sort_alphabet_asc",
        SORT_ALPHABET_DESC = "sort_alphabet_desc",
        SORT_NUM_ASC = "sort_num_asc",
        SORT_NUM_DESC = "sort_num_desc"
    }
    function getIconID(id: any): string;
}
declare module mf {
    class TDOMHelper {
        protected _owner: mf.TBaseElement;
        constructor(owner: mf.TBaseElement);
        attr(name: string): string;
        attr(name: string, value: string | number): mf.TDOMHelper;
        attr(arg: Object): mf.TDOMHelper;
        removeAttr(name: string): mf.TDOMHelper;
        readonly _el: HTMLElement;
    }
}
declare module mf {
    class TUndoStack {
        protected _stack: Array<mf.TUndoItem>;
        append(val: any): void;
        undo(): string | number;
        reset(): string | number;
    }
    class TUndoItem {
        protected _value: string | number | null | undefined;
        protected _time: number;
        constructor(value: any);
        readonly value: string | number;
    }
}
declare module mf {
    enum TDatasetClasses {
        TDataset = "TDataset",
        TAjaxDataset = "TAjaxDataset",
        TGooleMapDataset = "TGoogleMapDataset"
    }
    enum TFieldTypes {
        NUMBER = 0,
        STRING = 1
    }
    interface IDefField {
        fieldName: string;
        fieldType: number;
    }
    class TDataset {
        protected owner: TBaseDataElement;
        protected _data: Array<Object>;
        protected _selectValue: any;
        protected flagBof: boolean;
        protected flagEof: boolean;
        protected cursor: number;
        defFields: Array<IDefField>;
        constructor(owner: TBaseDataElement);
        loadData(data: Array<Object>): void;
        protected defineFields(): void;
        issetField(fieldName: string): false | IDefField;
        first(): Object;
        prev(): Object;
        next(): Object;
        last(): Object;
        current(): Object;
        goTo(idx: number): any;
        goTo(field: string, value: any): any;
        protected findIndex(field: string, value: string | number): number;
        size(): number;
        protected setIndex(idx: number): Object;
        fieldByName(fieldName: any): TDataField;
        column(fieldName: any): any[];
        readonly Bof: boolean;
        readonly Eof: boolean;
        readonly index: number;
        data: any;
        readonly isActive: boolean;
        selectValue: string | number;
    }
    class TDataField {
        name: string;
        value: any;
        asString(): any;
        asInteger(): number;
    }
}
declare module mf {
    enum RequestMethods {
        GET = "GET",
        POST = "POST"
    }
    class TAjaxDataset extends TDataset {
        baseUrl: string;
        requestParams: Object;
        requestMethod: RequestMethods;
        constructor(owner: TBaseDataElement);
        loadData(): any;
        loadData(data: Array<Object>): any;
        loadData(params: Object): any;
    }
}
declare module mf {
    type TResponse = {
        success: Array<any>;
        error: {
            errorInfo: Array<string>;
        };
    };
    interface IElementOptions {
        attributes?: Object;
    }
    enum BaseElementEvents {
        EV_CREATED = "created",
        EV_ELEMENT_CREATED = "element:created"
    }
    interface IBaseElementOptions {
        element?: null | string | Element;
        parent?: null | string | Element;
        cssClass?: string;
    }
    class TBaseElement {
        protected _wrap: HTMLElement;
        protected _createElementIfNotExists: boolean;
        protected _contextMenuList: mf.TContextMenuList;
        protected _contextMenuMap: mf.TContextMenuMap;
        protected _cssClass: string;
        protected _tag: string;
        protected _parent: HTMLElement;
        protected _element: HTMLElement;
        protected _domHelper: mf.TDOMHelper;
        protected _contextMenu: mf.TContextMenu | Array<mf.IContextMenuItem> | null;
        protected _monitor: mf.TBaseLogger | string | null;
        protected _addons: mf.TBaseAddonCollection;
        protected _temporary: Object;
        protected _dnd: mf.TBaseDragDrop;
        constructor(options?: any);
        protected _beforeElement(): void;
        ancestor: string;
        protected _contextMenuHandler(ev: Event): boolean;
        destroy(): this;
        protected _innerInit(options?: any): void;
        protected _initEvents(): void;
        afterCreate(): void;
        onElementCreated(): void;
        fire(atype: string, adata?: any): void;
        on(atype: string, func: Function, capture?: Object): Array<any>;
        off(handler: any): any;
        parent: HTMLElement;
        element: HTMLElement;
        readonly tag: string;
        contextMenu: mf.TContextMenu | Array<mf.IContextMenuItem>;
        cssClass: string | Array<string>;
        monitor: any;
        addons: mf.TBaseAddonCollection;
        wrap: string | HTMLElement | mf.TBaseElement;
        dragdrop: mf.TBaseDragDrop | any;
        protected _logMessage(messageType: mf.MessageType, message: string | Array<string>): void;
        danger: any;
        warning: any;
        success: any;
        info: any;
        message: any;
        createElementIfNotExists: boolean;
        readonly dom: TDOMHelper;
        protected registerEvents(_events: Array<any>): void;
        protected registerEvent(_ev: string, args: Array<string> | string, expression: any): any;
        contextMenuMap: mf.TContextMenuMap | Array<mf.IContextMenuMapItem>;
        contextMenuList: mf.TContextMenuList | Array<mf.IContextMenu>;
    }
}
declare interface Element {
    _getObj(): mf.TBaseElement;
    _closestObj(): mf.TBaseElement;
}
declare module mf {
    class TBaseDataElement extends mf.TBaseElement {
        protected _dataset: TDataset;
        keyFieldName: string;
        constructor(options: any);
        loaded(aowner: TBaseElement): void;
        readonly dataset: TDataset;
    }
}
declare module mf {
    enum StorageClasses {
        BASE = "mf.TBaseStorage",
        AJAX = "mf.TAjaxStorage",
        FETCH = "mf.TFetchStorage"
    }
    class TBaseStorage {
        storageID: string;
        constructor(options: any);
        store(data: any, callback?: Function): void;
        restore(callback: Function): void;
    }
    class TFetchStorage extends mf.TBaseStorage {
        url: string;
        method: string;
        store(data: any, callback?: Function): void;
        restore(callback: Function): void;
    }
}
declare module mf {
    class TBasePanel extends mf.TBaseElement {
        constructor(options?: any);
    }
}
declare module mf {
    interface IVirtualWindowOptions extends mf.IBaseElementOptions {
        caption?: string;
        content?: string;
        draggable?: boolean;
        dimentionsByContent?: boolean;
        showCloseButton?: boolean;
        buttons?: mf.IVWButtonsOptions;
    }
    class TVirtWindow extends mf.TBasePanel implements IVirtualWindow {
        static ancestor: string;
        oid: string;
        winmanIdx: number;
        protected _captionBar: HTMLElement;
        protected _contentBar: HTMLElement;
        protected _buttons: mf.TVWButtons;
        showCloseButton: boolean;
        private _ev_closeButtonClick;
        protected _draggable: boolean;
        constructor(options?: any);
        destroy(): this;
        protected _innerInit(options: any): void;
        protected _initEvents(): void;
        renderCloseButton(): void;
        letFocus(): void;
        open(): void;
        close(): void;
        expand(): void;
        collapse(): void;
        caption: string;
        content: string | HTMLElement | NodeList;
        buttons: mf.IVWButtonsOptions;
    }
    interface IVWButtonsOptions {
        owner: IVirtualWindow;
        cssClass: string;
        items: Array<mf.IVWButtonOptions>;
    }
    interface IVWButtonOptions {
        xhref: string;
        svgclass: string;
        caption: string;
        cssClass: string;
        click: string;
    }
    class TVWButtons {
        owner: IVirtualWindow;
        element: HTMLElement;
        protected _items: Array<HTMLButtonElement>;
        constructor(options: mf.IVWButtonsOptions);
        items: Array<mf.IVWButtonOptions>;
    }
}
