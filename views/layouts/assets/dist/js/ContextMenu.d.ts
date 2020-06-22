declare module cm {
    enum TContextMenuItemType {
        ITEM_BUTTON = 1,
        ITEM_LINK = 2,
        ITEM_SEPARATOR = 4,
        ITEM_MENU = 8
    }
    interface IContextMenuItemOptions {
        type: cm.TContextMenuItemType;
        class?: any;
        caption?: string;
        cssClass?: string;
        link?: string;
        action?: string | Function;
        items?: Array<cm.IContextMenuItemOptions>;
    }
    interface IContextMenuOptions {
        event: MouseEvent;
        items: Array<cm.IContextMenuItemOptions>;
    }
    class TContextMenu extends HTMLUListElement {
        event: MouseEvent;
        private _click;
        constructor(options: cm.IContextMenuOptions);
        destroy(): void;
        protected position(): void;
        items: Array<cm.IContextMenuItemOptions>;
    }
    class TContextMenuItem extends HTMLLIElement {
        constructor(options: cm.IContextMenuItemOptions);
        readonly menu: TContextMenu;
    }
    function ContextMenu(options?: any): TContextMenu;
}
