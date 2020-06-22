var cm;
(function (cm) {
    let TContextMenuItemType;
    (function (TContextMenuItemType) {
        TContextMenuItemType[TContextMenuItemType["ITEM_BUTTON"] = 1] = "ITEM_BUTTON";
        TContextMenuItemType[TContextMenuItemType["ITEM_LINK"] = 2] = "ITEM_LINK";
        TContextMenuItemType[TContextMenuItemType["ITEM_SEPARATOR"] = 4] = "ITEM_SEPARATOR";
        TContextMenuItemType[TContextMenuItemType["ITEM_MENU"] = 8] = "ITEM_MENU";
    })(TContextMenuItemType = cm.TContextMenuItemType || (cm.TContextMenuItemType = {}));
    class TContextMenu extends HTMLUListElement {
        constructor(options) {
            super();
            let _that = this;
            this.setAttribute('data-anc', 'cmu');
            Object.assign(this, options);
            this._click = document.eventListener('click', function (ev) {
                if (!ev.target.closestElement(_that)) {
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
        position() {
            try {
                this.style.left = this.event.x + 'px';
                this.style.top = this.event.y + 'px';
            }
            catch (err) { }
        }
        set items(val) {
            let _that = this;
            val.forEach((val) => {
                Objects.setDefinition(val, 'class', cm.TContextMenuItem);
                let _cls = val.class;
                _that.appendChild(new _cls(val));
            });
        }
    }
    cm.TContextMenu = TContextMenu;
    class TContextMenuItem extends HTMLLIElement {
        constructor(options) {
            super();
            let _that = this;
            if (options.type == cm.TContextMenuItemType.ITEM_SEPARATOR) {
                this.classList.add('sep');
            }
            if (options.caption) {
                this.innerHTML = options.caption;
            }
            if (options.action) {
                this.eventListener('click', (ev) => {
                    options.action.apply(_that);
                    _that.menu.destroy();
                });
            }
        }
        get menu() {
            return this.parentElement;
        }
    }
    cm.TContextMenuItem = TContextMenuItem;
    function ContextMenu(options) {
        document.querySelectorAll('[data-anc="cmu"]').forEach((value) => {
            value.destroy();
            value = null;
        });
        let ret = new cm.TContextMenu(options);
        document.body.appendChild(ret);
        return ret;
    }
    cm.ContextMenu = ContextMenu;
})(cm || (cm = {}));
window.customElements.define('context-menu', cm.TContextMenu, { extends: 'ul' });
window.customElements.define('context-menu-item', cm.TContextMenuItem, { extends: 'li' });
