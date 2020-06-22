var TWinEvents;
(function (TWinEvents) {
    TWinEvents["EV_RECIVE_FOCUS"] = "reciveFocus";
})(TWinEvents || (TWinEvents = {}));
class TWinMan {
    constructor(options) {
        Objects.setDefinition(this, '_wins', []);
        Objects.setDefinition(this, 'firstZIndex', 100000);
    }
    registerWindow(win) {
        this._wins.push(win);
        this.sort();
        if (this.issetModal) {
            win.modal = true;
        }
        this.moveOverlay(this.issetModal);
    }
    unRegisterWindow(win) {
        this._wins.splice(this._wins.indexOf(win), 1);
        this.sort();
        this.moveOverlay(this.issetModal);
    }
    topWindow(win) {
        this._wins.push(this._wins.splice(this._wins.indexOf(win), 1)[0]);
        this.sort();
    }
    doWinFocus(win) {
        win.classList.add('current');
    }
    leftWinFocus(win) {
        win.classList.remove('current');
    }
    sort() {
        let _that = this;
        [].map.call(_that._wins, function (current, idx) {
            current.winmanIdx = idx;
            current.zIndex = _that.firstZIndex + idx;
            _that.leftWinFocus(current);
            if (idx == _that._wins.length - 1) {
                _that.doWinFocus(current);
            }
        });
    }
    get nextIdx() {
        return this._wins.length;
    }
    get top() {
        return this._wins[this._wins.length - 1];
    }
    get window() {
        return window;
    }
    get issetModal() {
        let res = false;
        for (let i = this._wins.length - 1; i >= 0; i--) {
            if (this._wins[i].modal) {
                res = this._wins[i];
                break;
            }
        }
        return res;
    }
    moveOverlay(modalWin) {
        let _that = this;
        if (!modalWin) {
            try {
                this._overlay = document.body.removeChild(this._overlay);
            }
            catch (err) { }
            return true;
        }
        if (!this._overlay) {
            this._overlay = new vw.TVWOverlay();
        }
        try {
            this._overlay = document.body.removeChild(this._overlay);
        }
        catch (err) { }
        try {
            this._overlay.style.zIndex = modalWin.style.zIndex;
            new Promise((resolve, reject) => {
                let itrl = setInterval(function () {
                    if (modalWin.parentNode) {
                        clearInterval(itrl);
                        resolve(modalWin);
                    }
                }, 1);
            }).then((mw) => {
                document.body.insertBefore(_that._overlay, modalWin);
            });
        }
        catch (err) {
            console.error(err);
        }
    }
}
if (!Window.hasOwnProperty('isFrameWin')) {
    Object.defineProperty(Window.prototype, 'isFrameWin', {
        get: function () {
            return window != parent;
        }
    });
}
var _winman;
if (!Window.hasOwnProperty('winman')) {
    Object.defineProperty(Window.prototype, 'winman', {
        get: function () {
            if (window.isFrameWin) {
                return parent.winman;
            }
            if (!_winman && !window.isFrameWin) {
                _winman = new TWinMan();
            }
            return _winman;
        },
    });
}
function createVWin() {
    let _options = {};
    if (isObject(arguments[0])) {
        _options = arguments[0];
    }
    else {
        Objects.extend(_options, arguments[2]);
        _options.caption = arguments[0];
        _options.content = arguments[1];
    }
    //let ret = new window.winman.window.vw.TVirtWindow();
    //ret.init(_options);
    let ret = VirtualWindow(_options);
    return ret;
}
;
window.VirtualWindow = function (options) {
    if (!options) {
        options = {};
    }
    let cls = vw.TVirtWindow;
    try {
        if (options.class) {
            cls = options.class;
        }
    }
    catch (err) {
    }
    const win = new cls(options);
    win.open();
    let promise = new Promise(function (resolve, reject) {
        win.onModalResult = function (win) {
            if (win.modalResult == vw.TModalResult.mrClose) {
                reject(win);
            }
            else {
                resolve(win);
            }
        };
    });
    promise['win'] = win;
    return promise;
};
const VirtualWindow = window.winman.window.VirtualWindow;
var vw;
(function (vw) {
    let TVWEvents;
    (function (TVWEvents) {
        TVWEvents["EV_ON_CREATED"] = "vw:created";
        TVWEvents["EV_ON_DESTROYES"] = "vw:destroyed";
        TVWEvents["EV_ON_FOCUSED"] = "vw:focused";
        TVWEvents["EV_ON_OPEN"] = "vw:open";
        TVWEvents["EV_BEFORE_OPEN"] = "vw:beforeopen";
        TVWEvents["EV_BEFORE_CLOSE"] = "vw:beforeclose";
        TVWEvents["EV_ON_SHOW"] = "vw:onshow";
        TVWEvents["EV_ON_CLOSE"] = "vw:close";
        TVWEvents["EV_ON_MODAL_RESULT"] = "vw:modalresult";
        TVWEvents["EV_ON_SIZEABLED"] = "vw:sizeabled";
    })(TVWEvents = vw.TVWEvents || (vw.TVWEvents = {}));
    let TModalResult;
    (function (TModalResult) {
        TModalResult[TModalResult["mrOk"] = 1] = "mrOk";
        TModalResult[TModalResult["mrCancel"] = 2] = "mrCancel";
        TModalResult[TModalResult["mrClose"] = 4] = "mrClose";
    })(TModalResult = vw.TModalResult || (vw.TModalResult = {}));
    class TVirtWindow extends HTMLElement {
        constructor(options) {
            super();
            this.ancestor = vw.TVirtWindow.ancestor;
            this.init(options);
        }
        init(options) {
            Objects.setDefinition(this, 'showCloseButton', true);
            Objects.setDefinition(this, 'showOnOpen', false);
            Objects.setDefinition(this, 'drag', true);
            Objects.setDefinition(this, 'modal', false);
            Objects.setDefinition(options, 'caption', 'Form ' + window.winman.nextIdx);
            Objects.setDefinition(options, 'buttins', null);
            Objects.setDefinition(options, 'sizeable', true);
            Objects.setDefinition(options, 'bounds', {
                class: vw.TVWBounds,
            });
            Objects.setDefinition(options, 'content', 'Any content');
            this.caption = Objects.removeVal(options, 'caption');
            this.content = Objects.removeVal(options, 'content');
            this.buttons = Objects.removeVal(options, 'buttons');
            this.bounds = Objects.removeVal(options, 'bounds');
            Object.assign(this, options);
            this.appendChild(this._captionBar);
            this.appendChild(this._contentBar);
            if (this._buttons instanceof vw.TVWButtons) {
                this.appendChild(this._buttons);
            }
            if (this.drag) {
                this.dragdrop = new vw.TVWDragDrop({ owner: this, levers: this._captionBar.localName });
            }
            this._initEvents();
            this.sizeable = options.sizeable;
            this.fire(vw.TVWEvents.EV_ON_CREATED, this);
            window.winman.registerWindow(this);
        }
        destroy() {
            this.dragdrop.destroy();
            this.parentElement.removeChild(this);
            this.fire(vw.TVWEvents.EV_ON_DESTROYES, this);
            window.winman.unRegisterWindow(this);
            return this;
        }
        _initEvents() {
            let _that = this;
            this.eventListener('mousedown', function (ev) {
                _that.letFocus();
            });
            this.eventListener(vw.TVWEvents.EV_BEFORE_OPEN, function (ev) {
            });
            this.eventListener(vw.TVWEvents.EV_ON_OPEN, function (ev) {
                if (_that.showOnOpen && _that.bounds) {
                    _that.bounds.show();
                }
            });
            this.eventListener(vw.TVWEvents.EV_ON_MODAL_RESULT, function (ev) {
                _that.onModalResult(_that);
            });
        }
        onModalResult(win) { }
        ;
        renderCloseButton() {
            let _that = this;
            let ret = Html.createElementEx('div', this._captionBar, { 'class': 'btn-close' });
            this._ev_closeButtonClick = ret.eventListener('mousedown', function (ev) {
                ev.stopPropagation();
                _that.modalResult = vw.TModalResult.mrClose;
                _that.fire(vw.TVWEvents.EV_ON_MODAL_RESULT, this);
            });
        }
        letFocus() {
            this.fire(vw.TVWEvents.EV_ON_FOCUSED, this);
            window.winman.topWindow(this);
        }
        open() {
            this.fire(vw.TVWEvents.EV_BEFORE_OPEN, this);
            document.body.appendChild(this);
            this.fire(vw.TVWEvents.EV_ON_OPEN, this);
            return this;
        }
        close() {
            this.fire(vw.TVWEvents.EV_BEFORE_CLOSE, this);
            return this.destroy();
        }
        set sizeable(val) {
            if (!isObject(val) && val) {
                this.sizeable = {
                    sizeableElement: this
                };
            }
            else if (isObject(val)) {
                this._sizeable = new vw.TSizeable(val);
            }
        }
        set zIndex(val) {
            this.style.zIndex = val.toString();
        }
        set cssClass(val) {
            this.classList.addMany(val);
        }
        //        public expand() {
        //
        //        }
        //
        //        public collapse() {
        //
        //        }
        get bounds() {
            return this._bounds;
        }
        set bounds(val) {
            let cls = vw.TVWBounds;
            if (val.class) {
                cls = val.class;
            }
            val.owner = this;
            this._bounds = new cls(val);
        }
        get captionBar() {
            return this._captionBar;
        }
        get buttonsBar() {
            return this._buttons;
        }
        set caption(val) {
            if (!isObject(val)) {
                val = {
                    caption: val
                };
            }
            if (!this._captionBar) {
                this._captionBar = new vw.TVWCaptionBar(val);
            }
            else {
                Object.assign(this._captionBar, val);
            }
        }
        get content() {
            return this._contentBar;
        }
        set content(val) {
            if (isString(val)) {
                val = {
                    data: val
                };
            }
            let cls = vw.TVWContent;
            if (isObject(val) && !(val instanceof HTMLElement) && !(val instanceof NodeList)) {
                Objects.setDefinition(val, 'class', vw.TVWContent);
            }
            if (val.class) {
                cls = val.class;
            }
            val.owner = this;
            let _tmp = new cls(val);
            if (this._contentBar) {
                this._contentBar = this.replaceChild(_tmp, this._contentBar);
            }
            else {
                this._contentBar = _tmp;
            }
        }
        get buttons() {
            return this._buttons;
        }
        get modal() {
            return this._modal;
        }
        set modal(val) {
            this._modal = val;
        }
        set buttons(val) {
            if (val) {
                val.owner = this;
                if (val instanceof vw.TVWButtons) {
                    this._buttons = val;
                }
                else {
                    this._buttons = new vw.TVWButtons();
                    this._buttons.init(val);
                }
            }
        }
        get ancestor() {
            return this.getAttribute('data-ancestor');
        }
        set ancestor(val) {
            this.setAttribute(('data-ancestor'), val);
        }
    }
    TVirtWindow.ancestor = 'mfWin';
    vw.TVirtWindow = TVirtWindow;
    class TVWCaptionBar extends HTMLElement {
        constructor(options) {
            super();
            let _that = this;
            this._captionElement = Html.createElementEx('span', this);
            this._iconElement = Html.createElementEx('div', this, { 'class': 'winicon' });
            this._closeButtonElement = Html.createElementEx('div', this, { 'class': 'btn-close' });
            this._closeButtonElement.eventListener('mousedown', function (ev) {
                ev.stopPropagation();
                _that.window.modalResult = vw.TModalResult.mrClose;
                _that.window.fire(vw.TVWEvents.EV_ON_MODAL_RESULT, _that.window);
            });
            Object.assign(this, options);
        }
        set closeButtonClass(val) {
            this._closeButtonElement.classList.removeMany(this._closeButtonElement.classList.value);
            this._closeButtonElement.classList.addMany(val);
        }
        set iconClass(val) {
            this._iconElement.classList.removeMany(this._iconElement.classList.value);
            this._iconElement.classList.addMany(val);
        }
        get caption() {
            return this._captionElement.innerHTML;
        }
        set caption(val) {
            this._captionElement.innerHTML = val;
        }
        get window() {
            return this.closestType(vw.TVirtWindow);
        }
    }
    vw.TVWCaptionBar = TVWCaptionBar;
})(vw || (vw = {}));
window.customElements.define('mf-virtual-window', vw.TVirtWindow);
window.customElements.define('mf-virtual-window-caption-bar', vw.TVWCaptionBar);
var vw;
(function (vw) {
    let TBoundsPosition;
    (function (TBoundsPosition) {
        TBoundsPosition[TBoundsPosition["POS_CENTER"] = 1] = "POS_CENTER";
        TBoundsPosition[TBoundsPosition["POS_CASCADE"] = 2] = "POS_CASCADE";
        TBoundsPosition[TBoundsPosition["POS_STORAGE"] = 4] = "POS_STORAGE";
        TBoundsPosition[TBoundsPosition["POS_DEFAULT"] = 8] = "POS_DEFAULT";
    })(TBoundsPosition = vw.TBoundsPosition || (vw.TBoundsPosition = {}));
    class TVWBounds {
        constructor(options) {
            let _that = this;
            this._styleCache = document.styleSheets.findRulesForSelector('[data-ancestor="mfWin"]').last;
            Objects.setDefinition(options, 'position', vw.TBoundsPosition.POS_CENTER);
            Object.assign(this, options);
            this.owner.eventListener(vw.TVWEvents.EV_BEFORE_OPEN, function () {
                _that.owner.style.opacity = '0';
            });
            this.owner.eventListener(vw.TVWEvents.EV_ON_OPEN, function () {
                _that.owner.content.style.top = _that.owner.captionBar.fullHeight + 'px';
                _that.owner.content.style.bottom = _that.owner.buttonsBar ?
                    _that.owner.buttonsBar.fullHeight + 'px' : '0';
                try {
                    _that.owner.style.minWidth = (_that.owner.buttons.itemsWidth || 0)
                        + (Html.cssMeasureToNumber(_that.owner.buttons.computedStyle.paddingLeft) * 2) + 'px';
                }
                catch (err) {
                    _that.owner.style.minWidth = '100px';
                }
                try {
                    _that.owner.style.minHeight = _that.owner.captionBar.offsetHeight +
                        _that.owner.content.offsetHeight +
                        _that.owner.buttonsBar.offsetHeight + 'px';
                }
                catch (err) {
                    _that.owner.style.minHeight = _that.owner.captionBar.offsetHeight +
                        100 + 'px';
                }
            });
            this.owner.eventListener(vw.TVWEvents.EV_BEFORE_CLOSE, function () {
                _that.hide();
            });
            this.owner.eventListener(vw.TVWEvents.EV_ON_CONTENT, function () {
                _that.show();
            });
            this.owner.eventListener(vw.TVWEvents.EV_ON_SIZEABLED, function () {
                try {
                    _that._storage.store();
                }
                catch (err) {
                    //console.error(err);
                }
            });
            /**
             * Сохранение геометрии включаем если стоит флажок 0x4 или указан
             * метод для удалённого хранения.
             */
            if (this.isStorage || options.remoteMethod) {
                let cls;
                cls = vw.TLocalStorage;
                if (options.remoteMethod) {
                    cls = vw.TRemoteStorage;
                }
                this._storage = new cls(this.owner);
                if (options.remoteMethod) {
                    this._storage.method = options.remoteMethod;
                }
            }
        }
        show() {
            if (this.owner.parentElement) {
                //_that.owner.style.minWidth = (_that.owner.content as vw.TVWContent).getBoundingClientRect().width + 'px';
                this.doDimensions();
                this.doPosition();
                this.owner.offsetHeight;
                this.owner.style.opacity = this._styleCache.style.opacity;
                this.owner.fire(vw.TVWEvents.EV_ON_SHOW);
            }
        }
        hide() {
            let _that = this;
            _that.owner.offsetHeight;
            _that.owner.style.opacity = '0';
        }
        doDimensions() {
            this.isStorage ? this._storage.restore() : null;
        }
        doPosition() {
            if (this._position & vw.TBoundsPosition.POS_CENTER) {
                this.owner.style.left = (this.owner.parentElement.clientWidth / 2) - (this.owner.fullWidth / 2) + 'px';
                this.owner.style.top = (this.owner.parentElement.clientHeight / 2) - (this.owner.fullHeight / 2) + 'px';
            }
        }
        get isStorage() {
            return this._position & vw.TBoundsPosition.POS_STORAGE;
        }
        set position(val) {
            this._position = val;
        }
        get width() {
            return this.owner.fullWidth;
        }
        get height() {
            return this.owner.fullHeight;
        }
    }
    vw.TVWBounds = TVWBounds;
    class TStorage {
        constructor(owner) {
            this.owner = owner;
        }
        store() {
            let data = {
                left: this.owner.offsetLeft,
                top: this.owner.offsetTop,
                width: this.owner.offsetWidth,
                height: this.owner.offsetHeight,
            };
            return data;
        }
        restore(data) {
            try {
                this.owner.style.left = data.left + 'px';
                this.owner.style.top = data.top + 'px';
                this.owner.style.width = data.width + 'px';
                this.owner.style.height = data.height + 'px';
            }
            catch (err) {
            }
        }
    }
    vw.TStorage = TStorage;
    class TLocalStorage extends vw.TStorage {
        store() {
            if (!this.owner.oid) {
                throw new Error('Для сохранения геометрии окна необходимо указать его OID.');
            }
            let data = super.store();
            window.localStorage.setItem('vw.geometry_' + this.owner.oid, JSON.stringify(data));
            return data;
        }
        restore() {
            let data = JSON.parse(window.localStorage.getItem('vw.geometry_' + this.owner.oid));
            super.restore(data);
        }
    }
    vw.TLocalStorage = TLocalStorage;
    class TRemoteStorage extends vw.TStorage {
    }
    vw.TRemoteStorage = TRemoteStorage;
})(vw || (vw = {}));
var vw;
(function (vw) {
    let TVWEvents;
    (function (TVWEvents) {
        TVWEvents["EV_ON_CONTENT"] = "vw:content";
    })(TVWEvents = vw.TVWEvents || (vw.TVWEvents = {}));
    let TVWRemoteContentMethod;
    (function (TVWRemoteContentMethod) {
        TVWRemoteContentMethod["METHOD_JQAJAX"] = "jqajax";
        TVWRemoteContentMethod["METHOD_FETCH"] = "fetch";
    })(TVWRemoteContentMethod = vw.TVWRemoteContentMethod || (vw.TVWRemoteContentMethod = {}));
    class TVWContent extends HTMLElement {
        constructor(options) {
            super();
            this.owner = options.owner;
            if (this.constructor.name == 'TVWContent') {
                Object.assign(this, options);
            }
        }
        set data(val) {
            let _that = this;
            this.innerHTML = '';
            if (isString(val)) {
                this.innerHTML = val;
            }
            else if (val instanceof HTMLElement) {
                this.appendChild(val);
            }
            else if (val instanceof NodeList) {
                val.forEach((el) => {
                    _that.appendChild(el);
                });
            }
            this.owner.fire(vw.TVWEvents.EV_ON_CONTENT, this.owner);
        }
        set remote(val) {
            this._remote = new vw.TVWRemoteContentTransport(this, val);
        }
    }
    vw.TVWContent = TVWContent;
    class TVWRemoteContentTransport {
        constructor(content, options) {
            Objects.setDefinition(options, 'type', vw.TVWRemoteContentMethod.METHOD_FETCH);
            Objects.setDefinition(options, 'settings', {});
            this.content = content;
            switch (options.type) {
                case vw.TVWRemoteContentMethod.METHOD_FETCH:
                    this._getFetch(options);
                    break;
                case vw.TVWRemoteContentMethod.METHOD_JQAJAX:
                    this._getJqAjax(options);
                    break;
            }
        }
        renderContent(content) {
            switch (content.code) {
                case mfResponseCodes.RESULT_CODE_SUCCESS:
                    this.content.owner.caption = content.message;
                    this.content.data = content.data.html;
                    if (content.data.js) {
                        runJS(content.data.js);
                    }
                    break;
            }
        }
        _getFetch(options) {
            let _that = this;
            Objects.setDefinition(options, 'settings', {});
            Objects.setDefinition(options.settings, 'headers', {});
            options.settings.headers['X-Requested-With'] = 'XMLHttpRequest';
            let f = fetch(options.url, options.settings)
                .then((res) => {
                return res.json();
            })
                .then((json) => {
                _that.renderContent(json);
            })
                .catch((res) => {
                console.error(res);
            });
            console.log(f);
        }
        _getJqAjax(options) {
        }
    }
    vw.TVWRemoteContentTransport = TVWRemoteContentTransport;
    class TVWFrameContent extends vw.TVWContent {
        constructor(options) {
            super(options);
            let _that = this;
            this._iframe = Html.createElementEx('iframe', this);
            this._iframe.eventListener('load', function () {
                _that.owner.caption = _that._iframe.contentWindow.vwCaption;
                _that.owner.fire(vw.TVWEvents.EV_ON_CONTENT, _that.owner);
            });
            Object.assign(this, options);
        }
        refresh() {
            this.src = this._iframe.src;
        }
        set src(val) {
            this._iframe.src = val;
        }
        set data(val) {
            null;
        }
    }
    vw.TVWFrameContent = TVWFrameContent;
})(vw || (vw = {}));
window.customElements.define('mf-virtual-window-content', vw.TVWContent);
window.customElements.define('mf-virtual-window-frame-content', vw.TVWFrameContent);
var vw;
(function (vw) {
    let TButtonsAlignment;
    (function (TButtonsAlignment) {
        TButtonsAlignment["ALIGN_LEFT"] = "left";
        TButtonsAlignment["ALIGN_RIGHT"] = "right";
        TButtonsAlignment["ALIGN_CENTER"] = "center";
    })(TButtonsAlignment = vw.TButtonsAlignment || (vw.TButtonsAlignment = {}));
    class TVWButtons extends HTMLElement {
        constructor(options) {
            super();
            Objects.setDefinition(this, '_items', []);
            Objects.setDefinition(this, 'align', vw.TButtonsAlignment.ALIGN_CENTER);
            Objects.setDefinition(this, 'cssClass', 'button-bar');
        }
        init(options) {
            if (options.cssClass) {
                this.classList.addMany(options.cssClass);
            }
            Objects.extendWithExcludes(this, options, ['cssClass']);
        }
        set cssClass(val) {
            this.classList.removeMany(this.classList.value, Object.wrapValues(vw.TButtonsAlignment, 'text-'));
            this.classList.addMany(val);
        }
        set align(val) {
            this.classList.removeMany(Object.wrapValues(vw.TButtonsAlignment, 'text-'));
            this.classList.add('text-' + val);
        }
        get itemsWidth() {
            let res = 0;
            for (let i = 0; i < this._items.length; i++) {
                res += this._items[i].fullWidth;
            }
            return res;
        }
        get computedStyle() {
            return window.getComputedStyle(this);
        }
        get buttons() {
            return this._items;
        }
        set items(val) {
            let _item;
            for (let i = 0; i < val.length; i++) {
                //                _item = Html.createElementEx('button', this, {
                //                    is: 'mf-icon-button',
                //                    svgclass: val[i].svgclass,
                //                    svglink: val[i].xhref,
                //                    'class': val[i].cssClass,
                //                }, val[i].caption) as HTMLButtonElement;
                //                _item.eventListener('click', val[i].click);
                _item = new vw.TVWButton(val[i]);
                this._items.push(_item);
                this.appendChild(_item);
            }
        }
    }
    vw.TVWButtons = TVWButtons;
})(vw || (vw = {}));
window.customElements.define('mf-virtual-window-buttons', vw.TVWButtons);
var vw;
(function (vw) {
    class TVWButton extends HTMLElement {
        constructor(...args) {
            super();
            Object.assign(this, ...args);
        }
        set caption(val) {
            this.innerHTML = val;
        }
        set cssClass(val) {
            this.classList.addMany(val);
        }
        set modalResult(val) {
            let _that = this;
            if (isFunc(val)) {
                this.eventListener('click', val);
            }
            else {
                this.eventListener('click', function () {
                    _that.window.modalResult = val;
                    _that.window.fire(vw.TVWEvents.EV_ON_MODAL_RESULT, _that.window);
                });
            }
        }
        get window() {
            return this.closestType(vw.TVirtWindow);
        }
    }
    vw.TVWButton = TVWButton;
})(vw || (vw = {}));
window.customElements.define('mf-virtual-window-button', vw.TVWButton);
var vw;
(function (vw) {
    class TVWOverlay extends HTMLElement {
        constructor(options) {
            super();
            Objects.setDefinition(this, 'opacity', 0.2);
            Object.assign(this, options);
        }
        destroy() {
            let _that = this;
            let dur = window.getComputedStyle(this).transitionDuration;
            this.hide();
            setTimeout(function () {
                _that.parentElement.removeChild(_that);
            }, dur.CSStoMilliseconds());
        }
        show() {
            this.style.opacity = this.opacity.toString();
        }
        hide() {
            this.style.opacity = '0';
        }
    }
    vw.TVWOverlay = TVWOverlay;
})(vw || (vw = {}));
window.customElements.define('mf-virtual-window-overlay', vw.TVWOverlay);
var vw;
(function (vw) {
    class TVWDragDrop extends mf.TBaseDragDrop {
        startDrag(ev) {
            if (this.owner.winmanIdx != window.winman.top.winmanIdx) {
                return false;
            }
            super.startDrag(ev);
        }
        clearDrag() {
            super.clearDrag();
            this.owner.fire(vw.TVWEvents.EV_ON_SIZEABLED);
        }
    }
    vw.TVWDragDrop = TVWDragDrop;
})(vw || (vw = {}));
var vw;
(function (vw) {
    class TSizeable extends HTMLElement {
        constructor(options) {
            super();
            Object.assign(this, options);
            this._initEvents();
        }
        _initEvents() {
            let _that = this;
            this._ev_MouseDown = this.eventListener('mousedown', function (ev) {
                setTimeout(function () {
                    _that._ev_MouseUp = document.eventListener('mouseup', function (ev) {
                        cancelAnimationFrame(_that._rfa);
                        _that.clearDrag();
                    });
                    _that._ev_MouseMove = document.eventListener('mousemove', function (ev) {
                        _that._rfa = requestAnimationFrame(function () {
                            _that.parentElement.style.width = ev.clientX + (_that._beginOffset.x / 2) - _that.parentElement.offsetLeft + 'px';
                            _that.parentElement.style.height = ev.clientY + (_that._beginOffset.y / 2) - _that.parentElement.offsetTop + 'px';
                        });
                    });
                    _that.startDrag(ev);
                }, 10);
            });
        }
        startDrag(ev) {
            this._beginEvent = ev;
            this._beginOffset = {};
            this._beginOffset.x = ev['layerX'];
            this._beginOffset.y = ev['layerY'];
            //this.parentElement.classList.toggleClass('noselect', 'autoselect');
            document.body.classList.toggleClass('noselect', 'autoselect');
        }
        clearDrag() {
            document.eventListener(this._ev_MouseUp);
            document.eventListener(this._ev_MouseMove);
            //this.parentElement.classList.toggleClass('autoselect', 'noselect');
            document.body.classList.toggleClass('autoselect', 'noselect');
            this.parentElement.fire(vw.TVWEvents.EV_ON_SIZEABLED);
        }
        set sizeableElement(val) {
            val.appendChild(this);
        }
        set cssClass(val) {
            if (val) {
                this.classList.addMany(val);
            }
        }
        isPosition(el) {
            let _st = el.style.position;
            let _cs = window.getComputedStyle(el).position;
            if (!['fixed', 'absolute', 'relative'].includes(_st) && !['fixed', 'absolute', 'relative'].includes(_cs)) {
                return false;
            }
            return true;
        }
    }
    vw.TSizeable = TSizeable;
})(vw || (vw = {}));
window.customElements.define('mf-sizeable-handler', vw.TSizeable);
var vw;
(function (vw) {
    vw.baseDialogsSettings = {
        modal: true,
        sizeable: false,
        showOnOpen: true,
        bounds: {
            position: vw.TBoundsPosition.POS_CENTER,
        },
        buttons: {
            align: vw.TButtonsAlignment.ALIGN_CENTER,
            items: [
                {
                    caption: 'OK',
                    cssClass: 'btn btn-danger',
                    modalResult: vw.TModalResult.mrClose
                }
            ]
        }
    };
    class TDialogs extends vw.TVirtWindow {
        constructor(options) {
            super(options);
        }
    }
    vw.TDialogs = TDialogs;
    class TDialogsContent extends vw.TVWContent {
        constructor(options) {
            super(options);
            Object.assign(this, options);
            let _tmp = this.innerHTML;
            Html.empty(this);
            Html.createElementEx('div', this, { class: 'pict' });
            Html.createElementEx('div', this, { class: 'content' }, _tmp);
        }
    }
    vw.TDialogsContent = TDialogsContent;
    function getAlertSettings() {
        let ret = Objects.extend({}, vw.baseDialogsSettings);
        return Objects.extend(ret, {
            class: vw.TDialogAlert,
            cssClass: 'alert',
        });
    }
    vw.getAlertSettings = getAlertSettings;
    ;
    function Alert(caption, message, options) {
        let def = vw.getAlertSettings();
        def.caption = caption || "Error";
        def.content = {
            class: vw.TDialogsContent,
            data: message
        };
        let ret = VirtualWindow(def)
            .catch((win) => {
            win.close();
        });
        return ret;
    }
    vw.Alert = Alert;
    class TDialogAlert extends vw.TDialogs {
    }
    vw.TDialogAlert = TDialogAlert;
    function getSuccessSettings() {
        let ret = Objects.extend({}, vw.baseDialogsSettings);
        return Objects.extend(ret, {
            class: vw.TDialogSuccess,
            cssClass: 'success',
        });
    }
    vw.getSuccessSettings = getSuccessSettings;
    ;
    function Success(caption, message, options) {
        let def = vw.getSuccessSettings();
        Objects.extend(def, options);
        def.caption = caption || "Success";
        def.content = {
            class: vw.TDialogsContent,
            data: message
        };
        let ret = VirtualWindow(def)
            .catch((win) => {
            win.close();
        });
        return ret;
    }
    vw.Success = Success;
    class TDialogSuccess extends vw.TDialogs {
    }
    vw.TDialogSuccess = TDialogSuccess;
    function getWarningSettings() {
        let ret = Objects.extend({}, vw.baseDialogsSettings);
        return Objects.extend(ret, {
            class: vw.TDialogWarning,
            cssClass: 'warning',
        });
    }
    vw.getWarningSettings = getWarningSettings;
    ;
    function Warning(caption, message, options) {
        let def = vw.getWarningSettings();
        Objects.extend(def, options);
        def.caption = caption || "Warning";
        def.content = {
            class: vw.TDialogsContent,
            data: message
        };
        let ret = VirtualWindow(def)
            .catch((win) => {
            win.close();
        });
        return ret;
    }
    vw.Warning = Warning;
    class TDialogWarning extends vw.TDialogs {
    }
    vw.TDialogWarning = TDialogWarning;
    function getInfoSettings() {
        let ret = Objects.extend({}, vw.baseDialogsSettings);
        return Objects.extend(ret, {
            class: vw.TDialogInfo,
            cssClass: 'info',
        });
    }
    vw.getInfoSettings = getInfoSettings;
    ;
    function Info(caption, message, options) {
        let def = vw.getInfoSettings();
        Objects.extend(def, options);
        def.caption = caption || "Info";
        def.content = {
            class: vw.TDialogsContent,
            data: message
        };
        let ret = VirtualWindow(def)
            .catch((win) => {
            win.close();
        });
        return ret;
    }
    vw.Info = Info;
    class TDialogInfo extends vw.TDialogs {
    }
    vw.TDialogInfo = TDialogInfo;
    function getConfirmSettings() {
        let ret = Objects.extend({}, vw.baseDialogsSettings);
        return Objects.extend(ret, {
            class: vw.TDialogConfirm,
            cssClass: 'confirm',
            buttons: {
                align: vw.TButtonsAlignment.ALIGN_CENTER,
                items: [
                    {
                        caption: 'OK',
                        cssClass: 'btn btn-success',
                        modalResult: vw.TModalResult.mrOk
                    }, {
                        caption: 'Cancel',
                        cssClass: 'btn btn-danger',
                        modalResult: vw.TModalResult.mrClose
                    }
                ]
            }
        });
    }
    vw.getConfirmSettings = getConfirmSettings;
    ;
    function Confirm(caption, message, options) {
        let def = vw.getConfirmSettings();
        Objects.extend(def, options);
        def.caption = caption || "Confirm";
        def.content = {
            class: vw.TDialogsContent,
            data: message
        };
        let ret = VirtualWindow(def)
            .catch((win) => {
            win.close();
        });
        return ret;
    }
    vw.Confirm = Confirm;
    class TDialogConfirm extends vw.TDialogs {
    }
    vw.TDialogConfirm = TDialogConfirm;
})(vw || (vw = {}));
window.customElements.define('mf-dialogs-content', vw.TDialogsContent);
window.customElements.define('mf-alert', vw.TDialogAlert);
window.customElements.define('mf-success', vw.TDialogSuccess);
window.customElements.define('mf-warning', vw.TDialogWarning);
window.customElements.define('mf-info', vw.TDialogInfo);
window.customElements.define('mf-confirm', vw.TDialogConfirm);
//window.customElements.define('mf-confirm', vw.TAlert);
