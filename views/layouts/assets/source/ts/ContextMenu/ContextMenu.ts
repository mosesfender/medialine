module cm {

    export enum TContextMenuItemType {
        ITEM_BUTTON = 0x1,
        ITEM_LINK = 0x2,
        ITEM_SEPARATOR = 0x4,
        ITEM_MENU = 0x8,
    }

    export interface IContextMenuItemOptions {
        type: cm.TContextMenuItemType;
        class?: any;
        caption?: string;
        cssClass?: string;
        link?: string;
        action?: string | Function;
        items?: Array<cm.IContextMenuItemOptions>,
    }

    export interface IContextMenuOptions {
        event: MouseEvent,
        items: Array<cm.IContextMenuItemOptions>,
    }

    export class TContextMenu extends HTMLUListElement {
        public event: MouseEvent;
        private _click: MouseEvent;

        constructor(options: cm.IContextMenuOptions) {
            super();
            let _that = this;
            this.setAttribute('data-anc', 'cmu');
            Object.assign(this, options);

            this._click = document.eventListener('click', function (ev: MouseEvent) {
                if (!(ev.target as HTMLElement).closestElement(_that)) {
                    _that.destroy();
                }
            });

            this.position();
        }

        destroy() {
            document.eventListener(this._click);
            this.event = null;
            this.remove();
        }

        protected position() {
            try {
                this.style.left = this.event.x + 'px';
                this.style.top = this.event.y + 'px';
            } catch (err) {}
        }

        set items(val: Array<cm.IContextMenuItemOptions>) {
            let _that = this;
            val.forEach((val: cm.IContextMenuItemOptions) => {
                Objects.setDefinition(val, 'class', cm.TContextMenuItem);
                let _cls = val.class;
                _that.appendChild(new _cls(val));
            });
        }
    }

    export class TContextMenuItem extends HTMLLIElement {

        constructor(options: cm.IContextMenuItemOptions) {
            super();
            let _that = this;

            if (options.type == cm.TContextMenuItemType.ITEM_SEPARATOR) {
                this.classList.add('sep');
            }

            if (options.caption) {
                this.innerHTML = options.caption;
            }

            if (options.action) {
                this.eventListener('click', (ev: MouseEvent) => {
                    (options.action as Function).apply(_that);
                    _that.menu.destroy();
                });
            }
        }

        get menu() {
            return this.parentElement as cm.TContextMenu;
        }
    }

    export function ContextMenu(options?: any) {
        document.querySelectorAll('[data-anc="cmu"]').forEach((value: Node) => {
            (value as cm.TContextMenu).destroy();
            (value as cm.TContextMenu) = null;
        });

        let ret = new cm.TContextMenu(options);
        document.body.appendChild(ret);
        return ret;
    }
}

window.customElements.define('context-menu', cm.TContextMenu, {extends: 'ul'});
window.customElements.define('context-menu-item', cm.TContextMenuItem, {extends: 'li'});

