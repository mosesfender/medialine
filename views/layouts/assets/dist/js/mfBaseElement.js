var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var mf;
(function (mf) {
    var SvgIcons;
    (function (SvgIcons) {
        SvgIcons["GOTO_LINK"] = "goto_link";
        SvgIcons["SETTINGS"] = "settings";
        SvgIcons["SETTINGS_2"] = "settings_2";
        SvgIcons["SORT_ALPHABET_ASC"] = "sort_alphabet_asc";
        SvgIcons["SORT_ALPHABET_DESC"] = "sort_alphabet_desc";
        SvgIcons["SORT_NUM_ASC"] = "sort_num_asc";
        SvgIcons["SORT_NUM_DESC"] = "sort_num_desc";
    })(SvgIcons = mf.SvgIcons || (mf.SvgIcons = {}));
    function getIconID(id) {
        return '#' + id;
    }
    mf.getIconID = getIconID;
})(mf || (mf = {}));
var mf;
(function (mf) {
    var TDOMHelper = (function () {
        function TDOMHelper(owner) {
            this._owner = owner;
        }
        TDOMHelper.prototype.attr = function () {
            var args = arguments;
            if (isString(args[0]) && args.length == 1) {
                return this._el.hasAttribute(args[0]) ? this._el.getAttribute(args[0]) : undefined;
            }
            var _tmp = {};
            if (isString(args[0]) && args.length == 2) {
                _tmp[args[0]] = args[1];
            }
            if (isObject(args[0])) {
                _tmp = args[0];
            }
            for (var p in _tmp) {
                this._el.setAttribute(p, _tmp[p]);
            }
            return this;
        };
        TDOMHelper.prototype.removeAttr = function (name) {
            if (this._el.hasAttribute(name)) {
                this._el.removeAttribute(name);
            }
            return this;
        };
        Object.defineProperty(TDOMHelper.prototype, "_el", {
            get: function () {
                return this._owner.element;
            },
            enumerable: true,
            configurable: true
        });
        return TDOMHelper;
    }());
    mf.TDOMHelper = TDOMHelper;
})(mf || (mf = {}));
var mf;
(function (mf) {
    var TUndoStack = (function () {
        function TUndoStack() {
            this._stack = [];
        }
        TUndoStack.prototype.append = function (val) {
            this._stack.push(new mf.TUndoItem(val));
        };
        TUndoStack.prototype.undo = function () {
            if (this._stack.length > 1) {
                return this._stack.pop().value;
            }
            else {
                return this._stack[0].value;
            }
        };
        TUndoStack.prototype.reset = function () {
            while (this._stack.length > 1) {
                this._stack.pop().value;
            }
            return this._stack[0].value;
        };
        return TUndoStack;
    }());
    mf.TUndoStack = TUndoStack;
    var TUndoItem = (function () {
        function TUndoItem(value) {
            this._time = Date.now();
            this._value = value;
        }
        Object.defineProperty(TUndoItem.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        return TUndoItem;
    }());
    mf.TUndoItem = TUndoItem;
})(mf || (mf = {}));
var mf;
(function (mf) {
    var TDatasetClasses;
    (function (TDatasetClasses) {
        TDatasetClasses["TDataset"] = "TDataset";
        TDatasetClasses["TAjaxDataset"] = "TAjaxDataset";
        TDatasetClasses["TGooleMapDataset"] = "TGoogleMapDataset";
    })(TDatasetClasses = mf.TDatasetClasses || (mf.TDatasetClasses = {}));
    ;
    var TFieldTypes;
    (function (TFieldTypes) {
        TFieldTypes[TFieldTypes["NUMBER"] = 0] = "NUMBER";
        TFieldTypes[TFieldTypes["STRING"] = 1] = "STRING";
    })(TFieldTypes = mf.TFieldTypes || (mf.TFieldTypes = {}));
    ;
    var TDataset = (function () {
        function TDataset(owner) {
            this._data = [];
            this.flagBof = false;
            this.flagEof = false;
            this.cursor = 0;
            this.defFields = [];
            if (owner) {
                this.owner = owner;
            }
            else {
                throw Error('Для TDataset требуется владелец');
            }
        }
        TDataset.prototype.loadData = function (data) {
            this.data = data;
            this.owner.loaded.call(this.owner);
        };
        TDataset.prototype.defineFields = function () {
            this.defFields = [];
            if (this._data.length > 0) {
                for (var p in this._data[0]) {
                    var ftype = TFieldTypes.STRING;
                    if (isInteger(this.data[0][p])) {
                        ftype = TFieldTypes.NUMBER;
                    }
                    this.defFields.push({
                        fieldName: p,
                        fieldType: ftype
                    });
                }
            }
        };
        TDataset.prototype.issetField = function (fieldName) {
            for (var i = 0; i < this.defFields.length; i++) {
                if (fieldName == this.defFields[i].fieldName) {
                    return this.defFields[i];
                }
            }
            return false;
        };
        TDataset.prototype.first = function () {
            return this.setIndex(0);
        };
        TDataset.prototype.prev = function () {
            return this.setIndex(this.cursor - 1);
        };
        TDataset.prototype.next = function () {
            return this.setIndex(this.cursor + 1);
        };
        TDataset.prototype.last = function () {
            return this.setIndex(this._data.length - 1);
        };
        TDataset.prototype.current = function () {
            try {
                return this.setIndex(this.cursor);
            }
            catch (err) {
                this.cursor = 0;
                return this.setIndex(this.cursor);
            }
        };
        TDataset.prototype.goTo = function (a, value) {
            if (typeof a == 'string') {
                return this.goTo(this.findIndex(a, value));
            }
            else if (typeof a == 'number') {
                return this.setIndex(a);
            }
        };
        TDataset.prototype.findIndex = function (field, value) {
            try {
                for (var i = 0; i < this._data.length; i++) {
                    if (value == this._data[i][field]) {
                        return i;
                    }
                }
            }
            catch (err) {
                console.error(err);
            }
            return 0;
        };
        TDataset.prototype.size = function () {
            return this._data.length;
        };
        TDataset.prototype.setIndex = function (idx) {
            try {
                this.flagBof = false;
                this.flagEof = false;
                if (idx < 0) {
                    idx = 0;
                    this.flagBof = true;
                }
                if (idx >= this._data.length) {
                    idx = this._data.length - 1;
                    this.flagEof = true;
                }
                this.cursor = idx;
                return this._data[this.cursor];
            }
            catch (err) {
                this.cursor = 0;
            }
        };
        TDataset.prototype.fieldByName = function (fieldName) {
            var ret = new TDataField();
            ret.name = fieldName;
            if (this.data[this.cursor].hasOwnProperty(fieldName)) {
                ret.value = this.data[this.cursor][fieldName];
            }
            else {
                ret.value = '';
            }
            return ret;
        };
        TDataset.prototype.column = function (fieldName) {
            var ret = [];
            [].map.call(this._data, function (row) {
                if (row[fieldName]) {
                    ret.push(row[fieldName]);
                }
            });
            return ret;
        };
        Object.defineProperty(TDataset.prototype, "Bof", {
            get: function () {
                return this.flagBof;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TDataset.prototype, "Eof", {
            get: function () {
                return this.flagEof;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TDataset.prototype, "index", {
            get: function () {
                return this.cursor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TDataset.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (data) {
                this._data = data;
                this.defineFields();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TDataset.prototype, "isActive", {
            get: function () {
                return this.size() > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TDataset.prototype, "selectValue", {
            set: function (val) {
                try {
                    this._selectValue = val;
                    this.findIndex(this._selectValue, this.owner.keyFieldName);
                }
                catch (err) {
                }
            },
            enumerable: true,
            configurable: true
        });
        return TDataset;
    }());
    mf.TDataset = TDataset;
    var TDataField = (function () {
        function TDataField() {
        }
        TDataField.prototype.asString = function () {
            if (this.value) {
                return this.value.toString();
            }
            else {
                return null;
            }
        };
        TDataField.prototype.asInteger = function () {
            return parseInt(this.value);
        };
        return TDataField;
    }());
    mf.TDataField = TDataField;
})(mf || (mf = {}));
var mf;
(function (mf) {
    var RequestMethods;
    (function (RequestMethods) {
        RequestMethods["GET"] = "GET";
        RequestMethods["POST"] = "POST";
    })(RequestMethods = mf.RequestMethods || (mf.RequestMethods = {}));
    ;
    var TAjaxDataset = (function (_super) {
        __extends(TAjaxDataset, _super);
        function TAjaxDataset(owner) {
            var _this = _super.call(this, owner) || this;
            _this.requestParams = {};
            _this.requestMethod = RequestMethods.GET;
            _this.owner = owner;
            return _this;
        }
        TAjaxDataset.prototype.loadData = function (params) {
            var _that = this;
            if (arguments.length) {
                if (isArray(params)) {
                    _super.prototype.loadData.call(this, params);
                    return true;
                }
                else {
                    this.requestParams = params;
                }
            }
            fetch(_that.baseUrl)
                .then(function (resp) {
            }).catch();
        };
        return TAjaxDataset;
    }(mf.TDataset));
    mf.TAjaxDataset = TAjaxDataset;
})(mf || (mf = {}));
var mf;
(function (mf) {
    var BaseElementEvents;
    (function (BaseElementEvents) {
        BaseElementEvents["EV_CREATED"] = "created";
        BaseElementEvents["EV_ELEMENT_CREATED"] = "element:created";
    })(BaseElementEvents = mf.BaseElementEvents || (mf.BaseElementEvents = {}));
    var TBaseElement = (function () {
        function TBaseElement(options) {
            this._createElementIfNotExists = true;
            this._tag = 'div';
            this._temporary = {};
            if (!options) {
                options = {};
            }
            var _that = this;
            this._innerInit(options);
            try {
                this._temporary[mf.ATTRIBUTES_PARAM] = options[mf.ATTRIBUTES_PARAM];
            }
            catch (err) { }
            this._domHelper = new mf.TDOMHelper(this);
            this._addons = new mf.TBaseAddonCollection(this);
            if (options['addons']) {
                this._temporary['addons'] = options['addons'];
                delete options['addons'];
            }
            this._beforeElement();
            Objects.extendWithExcludes(this, options, [mf.ATTRIBUTES_PARAM]);
            if (this.element instanceof HTMLElement) {
                if (!this.element.hasAttribute((mf.ATTRIBUTE_ANCESTOR))) {
                    this.element.setAttribute((mf.ATTRIBUTE_ANCESTOR), mf.MAIN_ANCESTOR);
                }
                this._element[mf.ANCESTOR_OBJ] = this;
                for (var _a in this._temporary[mf.ATTRIBUTES_PARAM]) {
                    this._element.setAttribute(_a, this._temporary[mf.ATTRIBUTES_PARAM][_a]);
                }
            }
            if (options.cssClass) {
                this.element.classList.addMany(options.cssClass);
            }
            this.registerEvents([
                [mf.BaseElementEvents.EV_CREATED, ['e', 'obj']],
            ]);
            if (this._contextMenuList || this._contextMenuMap || this._contextMenu) {
                this.on('contextmenu', function (ev) {
                    ev.preventDefault();
                    _that._contextMenuHandler.call(_that, ev);
                });
            }
            this._initEvents();
        }
        TBaseElement.prototype._beforeElement = function () {
        };
        Object.defineProperty(TBaseElement.prototype, "ancestor", {
            get: function () {
                return this.element.getAttribute(mf.ATTRIBUTE_ANCESTOR);
            },
            set: function (val) {
                this.element.setAttribute((mf.ATTRIBUTE_ANCESTOR), val);
            },
            enumerable: true,
            configurable: true
        });
        TBaseElement.prototype._contextMenuHandler = function (ev) {
            var _expander = ev.target.closest('[data-role]');
            if (!_expander) {
                return false;
            }
            var _role = _expander.getAttribute('data-role');
            if (!_expander._getObj()) {
                var _obj = null;
                var _p = _expander;
                var ret = false;
                while (!ret) {
                    _p = _p.parentElement;
                    _obj = _p._getObj();
                    if (_obj instanceof mf.TBaseElement) {
                        _expander = _obj.element;
                        ret = true;
                    }
                }
            }
            if (_role) {
                try {
                    var _menuName = this._contextMenuMap.getMenuByRole(_role);
                    var _menu = this._contextMenuList.getMenu(_menuName);
                    if (_menu) {
                        _menu.expander = _expander._getObj();
                        _menu.expand(ev);
                    }
                }
                catch (err) {
                    console.log(this);
                }
            }
        };
        TBaseElement.prototype.destroy = function () {
            this._element.remove();
            return this;
        };
        TBaseElement.prototype._innerInit = function (options) {
            if (options['parent']) {
                this.parent = options['parent'];
            }
        };
        ;
        TBaseElement.prototype._initEvents = function () {
            var _that = this;
            this.on(mf.BaseElementEvents.EV_CREATED, function () {
                try {
                    _that.addons = _that._temporary['addons'];
                    delete _that._temporary['addons'];
                }
                catch (err) {
                }
            });
        };
        TBaseElement.prototype.afterCreate = function () {
            this.fire(mf.BaseElementEvents.EV_CREATED, this);
        };
        TBaseElement.prototype.onElementCreated = function () {
            this._element[mf.ANCESTOR_OBJ] = this;
            for (var _a in this._temporary[mf.ATTRIBUTES_PARAM]) {
                this._element.setAttribute(_a, this._temporary[mf.ATTRIBUTES_PARAM][_a]);
            }
        };
        TBaseElement.prototype.fire = function (atype, adata) {
            if (this.element) {
                this._element.fire(atype, adata);
            }
        };
        TBaseElement.prototype.on = function (atype, func, capture) {
            if (this.element) {
                return this.element.eventListener(atype, func, capture);
            }
        };
        TBaseElement.prototype.off = function (handler) {
            return this.element.eventListener(handler);
        };
        Object.defineProperty(TBaseElement.prototype, "parent", {
            get: function () {
                if (!this._parent) {
                    if (this._element) {
                        this._parent = this._element.parentElement;
                    }
                }
                return this._parent;
            },
            set: function (el) {
                if (typeof el == 'string') {
                    this._parent = document.querySelector(el);
                }
                else {
                    this._parent = el;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "element", {
            get: function () {
                if (!this._element && this._createElementIfNotExists) {
                    this._element = Html.createElementEx(this.tag, this.parent || null, { 'data-ancestor': mf.MAIN_ANCESTOR });
                    this.onElementCreated();
                }
                return this._element;
            },
            set: function (el) {
                if (typeof el == 'string') {
                    this._element = document.querySelector(el);
                }
                else {
                    this._element = el;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "tag", {
            get: function () {
                return this._tag;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "contextMenu", {
            get: function () {
                return this._contextMenu;
            },
            set: function (val) {
                if (isArray(val)) {
                    this._contextMenu = new mf.TContextMenu({
                        items: val
                    });
                }
                if (val instanceof mf.TContextMenu) {
                    this._contextMenu = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "cssClass", {
            get: function () {
                return this._cssClass;
            },
            set: function (val) {
                if (isArray(val)) {
                    this._cssClass = val.join(' ');
                }
                else {
                    this._cssClass = val.toString();
                }
                this.element.classList.addMany(this._cssClass);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "monitor", {
            get: function () {
                if (typeof this._monitor == 'string') {
                    if (window.hasOwnProperty(this._monitor)) {
                        this._monitor = window[this._monitor];
                    }
                }
                return this._monitor;
            },
            set: function (val) {
                this._monitor = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "addons", {
            get: function () {
                return this._addons;
            },
            set: function (val) {
                for (var p in val) {
                    val[p]['id'] = p;
                    this._addons.addAddon(val[p]);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "wrap", {
            get: function () {
                return this._wrap;
            },
            set: function (val) {
                if (val instanceof mf.TBaseElement) {
                    this._wrap = val.element;
                }
                else if (val instanceof HTMLElement) {
                    this._wrap = val;
                }
                else if (typeof val == 'string') {
                    if (val == 'parent') {
                        this._wrap = this._element.parentElement;
                    }
                    else {
                        this._wrap = document.querySelector(val);
                    }
                }
                if (!this._wrap.hasAttribute(mf.ATTRIBUTE_ANCESTOR)) {
                    this._wrap.setAttribute(mf.ATTRIBUTE_ANCESTOR, 'mfcomponent-wrap');
                }
                if (this._wrap != this.element.parentElement) {
                    this._wrap.appendChild(this._element.parentNode.removeChild(this._element));
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "dragdrop", {
            get: function () {
                return this._dnd;
            },
            set: function (val) {
                if (val instanceof mf.TBaseDragDrop) {
                    this._dnd = val;
                }
                else {
                    this._dnd = new mf.TBaseDragDrop(val);
                }
            },
            enumerable: true,
            configurable: true
        });
        TBaseElement.prototype._logMessage = function (messageType, message) {
            if (this.monitor instanceof mf.TBaseLogger) {
                this.monitor.log(messageType, message);
            }
        };
        Object.defineProperty(TBaseElement.prototype, "danger", {
            set: function (val) {
                this._logMessage(mf.MessageType.MESS_DANGER, val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "warning", {
            set: function (val) {
                this._logMessage(mf.MessageType.MESS_WARNING, val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "success", {
            set: function (val) {
                this._logMessage(mf.MessageType.MESS_SUCCESS, val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "info", {
            set: function (val) {
                this._logMessage(mf.MessageType.MESS_INFO, val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "message", {
            set: function (val) {
                this._logMessage(mf.MessageType.MESS_DEFAULT, val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "createElementIfNotExists", {
            set: function (val) {
                this._createElementIfNotExists = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "dom", {
            get: function () {
                return this._domHelper;
            },
            enumerable: true,
            configurable: true
        });
        TBaseElement.prototype.registerEvents = function (_events) {
            var _that = this;
            [].map.call(_events, function (_ev) {
                var args = [];
                if (isArray(_ev)) {
                    try {
                        if (_ev.length > 1) {
                            args = _ev[1];
                        }
                        _ev = _ev[0];
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
                if (_that[_ev] != null) {
                    try {
                        _that.element.eventListener(_ev, function () {
                            var _a = arguments;
                            var argsstr = args.join(',');
                            var det = _a[0]['detail'];
                            det.unshift(_a[0]);
                            return new Function(argsstr, _that[_ev]['expression'])
                                .apply(this, det);
                        });
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        };
        TBaseElement.prototype.registerEvent = function (_ev, args, expression) {
            var argsstr = isArray(args) ? args.join(',') : args;
            var det = [];
            det.push(_ev);
            det.concat(_ev['detail']);
            return new Function(argsstr, expression)
                .apply(this, det);
        };
        Object.defineProperty(TBaseElement.prototype, "contextMenuMap", {
            get: function () {
                return this._contextMenuMap;
            },
            set: function (val) {
                if (val instanceof mf.TContextMenuMap) {
                    this._contextMenuMap = val;
                }
                if (isArray(val)) {
                    this._contextMenuMap = new mf.TContextMenuMap(val);
                }
                this._contextMenuMap.owner = this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseElement.prototype, "contextMenuList", {
            get: function () {
                return this._contextMenuList;
            },
            set: function (val) {
                if (val instanceof mf.TContextMenuList) {
                    this._contextMenuList = val;
                }
                if (isArray(val)) {
                    this._contextMenuList = new mf.TContextMenuList(this, val);
                }
                this._contextMenuList.owner = this;
                var _that = this;
                this.on('contentMenuExpand', function () {
                    _that._contextMenuList.collapseAll.call(_that._contextMenuList);
                });
                this.on('click', function () {
                    if (_that._contextMenuList.expanded) {
                        _that._contextMenuList.expanded.collapse();
                    }
                });
            },
            enumerable: true,
            configurable: true
        });
        return TBaseElement;
    }());
    mf.TBaseElement = TBaseElement;
})(mf || (mf = {}));
var mf;
(function (mf) {
    var TBaseDataElement = (function (_super) {
        __extends(TBaseDataElement, _super);
        function TBaseDataElement(options) {
            var _this = _super.call(this, options) || this;
            _this._dataset = new mf.TDataset(_this);
            return _this;
        }
        TBaseDataElement.prototype.loaded = function (aowner) { };
        Object.defineProperty(TBaseDataElement.prototype, "dataset", {
            get: function () {
                return this._dataset;
            },
            enumerable: true,
            configurable: true
        });
        return TBaseDataElement;
    }(mf.TBaseElement));
    mf.TBaseDataElement = TBaseDataElement;
})(mf || (mf = {}));
var mf;
(function (mf) {
    var StorageClasses;
    (function (StorageClasses) {
        StorageClasses["BASE"] = "mf.TBaseStorage";
        StorageClasses["AJAX"] = "mf.TAjaxStorage";
        StorageClasses["FETCH"] = "mf.TFetchStorage";
    })(StorageClasses = mf.StorageClasses || (mf.StorageClasses = {}));
    var TBaseStorage = (function () {
        function TBaseStorage(options) {
            Objects.extend(this, options);
            if (!this.storageID) {
                console.error('Needed storageID');
            }
        }
        TBaseStorage.prototype.store = function (data, callback) {
        };
        TBaseStorage.prototype.restore = function (callback) {
        };
        return TBaseStorage;
    }());
    mf.TBaseStorage = TBaseStorage;
    var TFetchStorage = (function (_super) {
        __extends(TFetchStorage, _super);
        function TFetchStorage() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.method = mf.RequestMethods.POST;
            return _this;
        }
        TFetchStorage.prototype.store = function (data, callback) {
            var fd = new FormData();
            fd.append("json", JSON.stringify(data));
            fd.append("storageID", this.storageID);
            fetch(this.url, {
                method: "POST",
                body: fd
            }).then(function (res) {
                return res.json();
            }).then(function (res) {
                if (callback) {
                    callback(res);
                }
            });
        };
        TFetchStorage.prototype.restore = function (callback) {
            fetch(Objects.compileGetUrl(this.url, { storageID: this.storageID })).then(function (res) {
                return res.json();
            }).then(function (res) {
                callback(res);
            });
        };
        return TFetchStorage;
    }(mf.TBaseStorage));
    mf.TFetchStorage = TFetchStorage;
})(mf || (mf = {}));
var mf;
(function (mf) {
    var TBasePanel = (function (_super) {
        __extends(TBasePanel, _super);
        function TBasePanel(options) {
            var _this = _super.call(this, options) || this;
            _this.ancestor = "mfPanel";
            return _this;
        }
        return TBasePanel;
    }(mf.TBaseElement));
    mf.TBasePanel = TBasePanel;
})(mf || (mf = {}));
var mf;
(function (mf) {
    var TVirtWindow = (function (_super) {
        __extends(TVirtWindow, _super);
        function TVirtWindow(options) {
            var _this = _super.call(this, options) || this;
            _this.ancestor = mf.TVirtWindow.ancestor;
            Objects.extendWithExcludes(_this, options, ['buttons']);
            Objects.setDefinition(_this, 'showCloseButton', true);
            Objects.setDefinition(_this, 'draggable', true);
            _this.element.appendChild(_this._captionBar);
            _this.element.appendChild(_this._contentBar);
            if (_this._buttons instanceof mf.TVWButtons) {
                _this.element.appendChild(_this._buttons.element);
            }
            if (_this.showCloseButton) {
                _this.renderCloseButton();
            }
            _this.dragdrop = new mf.TBaseDragDrop({ owner: _this, levers: '.caption-bar' });
            try {
                window.winman.registerWindow(_this);
            }
            catch (err) {
                console.error(err);
            }
            return _this;
        }
        TVirtWindow.prototype.destroy = function () {
            this.dragdrop.destroy();
            this.element.parentElement.removeChild(this.element);
            try {
                window.winman.unRegisterWindow(this);
            }
            catch (err) {
                console.error(err);
            }
            return this;
        };
        TVirtWindow.prototype._innerInit = function (options) {
            _super.prototype._innerInit.call(this, options);
            this._captionBar = Html.createElementEx('div', null, { 'class': 'caption-bar' });
            Html.createElementEx('span', this._captionBar);
            this._contentBar = Html.createElementEx('div', null, { 'class': 'content-bar' });
        };
        TVirtWindow.prototype._initEvents = function () {
            var _that = this;
            this.on('mousedown', function (ev) {
                _that.letFocus();
            });
            _super.prototype._initEvents.call(this);
        };
        TVirtWindow.prototype.renderCloseButton = function () {
            var _that = this;
            var ret = Html.createSwgUse('close_christ_circle');
            this._captionBar.appendChild(ret);
            this._ev_closeButtonClick = ret.eventListener('mousedown', function (ev) {
                ev.stopPropagation();
                _that.close();
            });
        };
        TVirtWindow.prototype.letFocus = function () {
            try {
                window.winman.topWindow(this);
            }
            catch (err) {
                console.error(err);
            }
        };
        TVirtWindow.prototype.open = function () {
            document.body.appendChild(this.element);
        };
        TVirtWindow.prototype.close = function () {
            this.destroy();
        };
        TVirtWindow.prototype.expand = function () {
        };
        TVirtWindow.prototype.collapse = function () {
        };
        Object.defineProperty(TVirtWindow.prototype, "caption", {
            set: function (val) {
                this._captionBar.children.item(0).innerHTML = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TVirtWindow.prototype, "content", {
            set: function (val) {
                if (isString(val)) {
                    this._contentBar.innerHTML = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TVirtWindow.prototype, "buttons", {
            set: function (val) {
                val.owner = this;
                this._buttons = new mf.TVWButtons(val);
            },
            enumerable: true,
            configurable: true
        });
        TVirtWindow.ancestor = 'mfWin';
        return TVirtWindow;
    }(mf.TBasePanel));
    mf.TVirtWindow = TVirtWindow;
    var TVWButtons = (function () {
        function TVWButtons(options) {
            this.element = Html.createElementEx('div', null, { 'class': 'button-bar' });
            if (options.cssClass) {
                this.element.classList.addMany(options.cssClass);
            }
            Objects.extendWithExcludes(this, options, ['cssClass']);
        }
        Object.defineProperty(TVWButtons.prototype, "items", {
            set: function (val) {
                var _item;
                for (var i = 0; i < val.length; i++) {
                    _item = Html.createElementEx('button', this.element, {
                        is: 'mf-icon-button',
                        svgclass: val[i].svgclass,
                        svglink: val[i].xhref,
                        'class': val[i].cssClass,
                    }, val[i].caption);
                    _item.eventListener('click', val[i].click);
                }
            },
            enumerable: true,
            configurable: true
        });
        return TVWButtons;
    }());
    mf.TVWButtons = TVWButtons;
})(mf || (mf = {}));
