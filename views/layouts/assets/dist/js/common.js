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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var mf;
(function (mf) {
    mf.ATTRIBUTE_ANCESTOR = 'data-ancestor';
    mf.ATTRIBUTE_ROLE = 'data-role';
    mf.MAIN_ANCESTOR = 'mfElement';
    mf.ANCESTOR_OBJ = '__obj';
    mf.ATTRIBUTES_PARAM = 'attributes';
})(mf || (mf = {}));
var mfRequestMethod;
(function (mfRequestMethod) {
    mfRequestMethod["METHOD_GET"] = "GET";
    mfRequestMethod["METHOD_POST"] = "POST";
})(mfRequestMethod || (mfRequestMethod = {}));
var mfResponseCodes;
(function (mfResponseCodes) {
    mfResponseCodes["RESULT_CODE_SUCCESS"] = "success";
    mfResponseCodes["RESULT_CODE_ERROR"] = "error";
    mfResponseCodes["RESULT_CODE_MODEL_ERROR"] = "modelError";
})(mfResponseCodes || (mfResponseCodes = {}));
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* closest */
(function (ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT['mozMatchesSelector'] || ELEMENT.msMatchesSelector || ELEMENT['oMatchesSelector'] || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
        if (!this)
            return null;
        if (this.matches(selector))
            return this;
        if (!this.parentElement) {
            return null;
        }
        else
            return this.parentElement.closest(selector);
    };
}(Element.prototype));
/* Custom Event */
(function () {
    /* Incompatible CustomEvent browsers polyfill */
    if (typeof window['CustomEvent'] === "function")
        return false;
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    CustomEvent.prototype = window['Event'].prototype;
    window['CustomEvent'] = CustomEvent;
})();
/**
 * @update 27.08.2018
 */
var Url;
(function (Url) {
    function parse(str) {
        var a = document.createElement('a');
        a.href = str;
        var _res = {
            source: str,
            schema: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function () {
                try {
                    var ret = {}, seg = a.search.replace(/^\?/, '').split('&'), len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                }
                catch (err) {
                    console.error(err);
                }
            })(),
            file: (a.pathname.match(/\/([^/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/ [^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/'),
        };
        return _res;
    }
    Url.parse = parse;
})(Url || (Url = {}));
var Objects;
(function (Objects) {
    function extend(first, second) {
        for (var id in second) {
            first[id] = second[id];
        }
        return first;
    }
    Objects.extend = extend;
    function extendWithExcludes(first, second, excludes) {
        if (excludes === void 0) { excludes = []; }
        for (var id in second) {
            var exclude = false;
            for (var i = 0; i < excludes.length; i++) {
                if (excludes[i] == id) {
                    exclude = true;
                }
            }
            if (!exclude) {
                first[id] = second[id];
            }
        }
        return first;
    }
    Objects.extendWithExcludes = extendWithExcludes;
    function objectToQueryStr(obj) {
        var _tmp = [];
        for (var p in obj) {
            _tmp.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
        return _tmp.length ? '?' + _tmp.join('&') : '';
    }
    Objects.objectToQueryStr = objectToQueryStr;
    function objectToQueryStr2(obj) {
        var _tmp = [];
        for (var p in obj) {
            _tmp.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
        return _tmp.join('&');
    }
    Objects.objectToQueryStr2 = objectToQueryStr2;
    function compileGetUrl(url, params) {
        return url + Objects.objectToQueryStr(params);
    }
    Objects.compileGetUrl = compileGetUrl;
    function setDefinition(obj, propertyName, defValue) {
        if (obj.hasOwnProperty(propertyName) && obj[propertyName] == undefined || obj[propertyName] == null) {
            obj[propertyName] = defValue;
        }
        return obj[propertyName];
    }
    Objects.setDefinition = setDefinition;
    function postData(url, params, method) {
        if (!method) {
            method = mfRequestMethod.METHOD_GET;
        }
        var form = Html.createElementEx('form', null, { action: url, method: method });
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                Html.createElementEx('input', form, {
                    'type': 'hidden',
                    name: key,
                    value: params[key],
                });
            }
        }
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
    Objects.postData = postData;
    /**
     * Получает значение key объекта obj, и удаляет его из объекта
     * @param Object obj
     * @param string key
     */
    function removeVal(obj, key) {
        var res = undefined;
        if (obj.hasOwnProperty(key)) {
            res = obj[key];
            delete obj[key];
        }
        return res;
    }
    Objects.removeVal = removeVal;
})(Objects || (Objects = {}));
var Html;
(function (Html) {
    function empty(el) {
        for (var _i = 0; _i < el.childNodes.length; _i++) {
            el.removeChild(el.childNodes[_i]);
        }
    }
    Html.empty = empty;
    function createElement(tag) {
        return document.createElement(tag);
    }
    Html.createElement = createElement;
    function createElementNS(NS, tag) {
        return document.createElementNS(NS, tag);
    }
    Html.createElementNS = createElementNS;
    function createElementEx(tag, parent, attributes, innerText) {
        var ret;
        try {
            if (attributes && attributes.hasOwnProperty('xmlns')) {
                ret = Html.createElementNS(attributes['xmlns'], tag);
            }
            else {
                ret = Html.createElement(tag);
            }
            if (attributes) {
                for (var attr in attributes) {
                    if (attr == 'xmlns') {
                        continue;
                    }
                    if (attributes.hasOwnProperty('xmlns')) {
                        ret.setAttributeNS(null, attr, attributes[attr]);
                    }
                    else {
                        ret.setAttribute(attr, attributes[attr]);
                    }
                }
            }
            if (innerText) {
                ret.innerHTML = innerText;
            }
            if (parent) {
                parent.appendChild(ret);
            }
            return ret;
        }
        catch (e) {
            console.error(e);
        }
    }
    Html.createElementEx = createElementEx;
    function createSwgUse(xhref, cssClass) {
        function href(s) {
            if (s.substr(0, 1) != '#') {
                return '#' + s;
            }
            else {
                return s;
            }
        }
        var _icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        if (cssClass) {
            _icon.classList.add(cssClass);
        }
        var _use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        _use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href(xhref));
        _icon.appendChild(_use);
        return _icon;
    }
    Html.createSwgUse = createSwgUse;
    /**
     * @var {string} str Class attribute, e.g. 'class-one class-two'
     * @returns {string} CSS path, e.q. '.class-one.class-two'
     */
    function classStringToCSSSelector(str) {
        var ret = [];
        var arr = [];
        try {
            arr = str.split(' ');
            [].map.call(arr, function (s) {
                ret.push('.' + s);
            });
        }
        catch (err) {
            ret.push('.' + str);
        }
        return ret.join('');
    }
    Html.classStringToCSSSelector = classStringToCSSSelector;
    /**
     * @var {string} tag, e.g. 'div'
     * @returns {string} e.g. '<div></div>'
     */
    function tagToJqueryTag(tag) {
        return '<' + tag + '></' + tag + '>';
    }
    Html.tagToJqueryTag = tagToJqueryTag;
    function cssMeasureToNumber(css) {
        return parseFloat(css.replace('/px/', ''));
    }
    Html.cssMeasureToNumber = cssMeasureToNumber;
    function getElementFullHeight(element) {
        var calc = getComputedStyle(element);
        return element.clientHeight
            + Html.cssMeasureToNumber(calc.marginTop)
            + Html.cssMeasureToNumber(calc.marginBottom)
            + Html.cssMeasureToNumber(calc.borderTopWidth)
            + Html.cssMeasureToNumber(calc.borderBottomWidth);
    }
    Html.getElementFullHeight = getElementFullHeight;
    function getElementFullWidth(element) {
        var calc = getComputedStyle(element);
        return element.clientWidth
            + Html.cssMeasureToNumber(calc.marginLeft)
            + Html.cssMeasureToNumber(calc.marginRight)
            + Html.cssMeasureToNumber(calc.borderLeftWidth)
            + Html.cssMeasureToNumber(calc.borderRightWidth);
    }
    Html.getElementFullWidth = getElementFullWidth;
})(Html || (Html = {}));
if (!String.prototype['toBool']) {
    String.prototype['toBool'] = function () {
        var str = this;
        if (typeof this == 'number')
            str = str.toString();
        str = str.toLowerCase();
        return Boolean(str == 'true' || str == 'yes' || str != '0' || str == 'on');
    };
}
if (!Number.prototype['toBool']) {
    Number.prototype['toBool'] = function () {
        return Boolean(this);
    };
}
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}
if (!String.prototype['isEmpty']) {
    String.prototype['isEmpty'] = function () {
        return !Boolean(this.trim().length);
    };
}
if (!String.prototype['CSStoMilliseconds']) {
    String.prototype['CSStoMilliseconds'] = function () {
        var _that = this;
        var _float = parseFloat(_that);
        var _measure = _that.match(/s|ms/g);
        if (isNull(_measure)) {
            return _float;
        }
        switch (_measure[0]) {
            case 's':
                return _float * 1000;
                break;
            case 'ms':
                return _float;
                break;
        }
        return 0;
    };
}
if (!Array.prototype['unique']) {
    Array.prototype['unique'] = function () {
        var _t = this;
        return _t.filter(function (item, pos) {
            return _t.indexOf(item) == pos;
        });
    };
}
if (!Array.prototype['includes']) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            // 1. Let O be ? ToObject(this value).
            var o = Object(this);
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }
            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;
            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }
            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1. 
                k++;
            }
            // 8. Return false
            return false;
        }
    });
}
try {
    function isNull(data) {
        return data == null;
    }
}
catch (err) { }
try {
    function isArray(data) {
        return (Object.prototype.toString.call(data) === "[object Array]");
    }
}
catch (err) { }
try {
    function isObject(data) {
        return (Object.prototype.toString.call(data) === "[object Object]");
    }
}
catch (err) { }
try {
    function isFunc(data) {
        return (Object.prototype.toString.call(data) === "[object Function]");
    }
}
catch (err) { }
try {
    function isInteger(data) {
        return typeof data === 'number' &&
            isFinite(data) &&
            Math.floor(data) === data;
    }
}
catch (err) { }
try {
    function isString(data) {
        return typeof data === 'string';
    }
}
catch (err) { }
try {
    function isScalar(data) {
        return isString(data) || isInteger(data);
    }
}
catch (err) { }
try {
    function isTouchDevice() {
        return !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
    }
    ;
}
catch (err) { }
DOMTokenList.prototype['addMany'] = function (classes) {
    var array = isArray(classes) ? classes : classes.split(' ');
    for (var i = 0, length = array.length; i < length; i++) {
        this.add(array[i]);
    }
};
DOMTokenList.prototype['removeMany'] = function (classes, exclude) {
    var array = isArray(classes) ? classes : classes.split(' ');
    if (exclude) {
        exclude = isArray(exclude) ? exclude : exclude.split(' ');
        array = array.filter(function (value) { return !exclude.includes(value); });
    }
    for (var i = 0, length = array.length; i < length; i++) {
        this.remove(array[i]);
    }
};
DOMTokenList.prototype['toggleClass'] = function (add, remove) {
    var _that = this;
    _that.remove(remove);
    _that.add(add);
};
function executeFunctionByName(functionName, context /*, args */) {
    var args, namespaces, func;
    if (typeof functionName === 'undefined') {
        throw 'function name not specified';
    }
    if (typeof eval(functionName) !== 'function') {
        throw functionName + ' is not a function';
    }
    if (typeof context !== 'undefined') {
        if (typeof context === 'object' && context instanceof Array === false) {
            if (typeof context[functionName] !== 'function') {
                throw context + '.' + functionName + ' is not a function';
            }
            args = Array.prototype.slice.call(arguments, 2);
        }
        else {
            args = Array.prototype.slice.call(arguments, 1);
            context = window;
        }
    }
    else {
        context = window;
    }
    namespaces = functionName.split(".");
    func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}
try {
    function freeAndNil(obj) {
        var res = obj['destroy']();
        res = null;
    }
}
catch (err) { }
;
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
var EventClasses;
(function (EventClasses) {
    EventClasses["EVENT_"] = "Event";
    EventClasses["EVENT_HTML"] = "HTMLEvent";
    EventClasses["EVENT_Mouse"] = "MouseEvents";
})(EventClasses || (EventClasses = {}));
if (window.hasOwnProperty('EventTarget')) {
    EventTarget.prototype['eventListener'] = function (atype, func, capture) {
        if (typeof arguments[0] === "object" && (!arguments[0].nodeType)) {
            return this.removeEventListener.apply(this, arguments[0]);
        }
        this.addEventListener(atype, func, capture);
        return arguments;
    };
    EventTarget.prototype['fire'] = function (atype, adata) {
        var ev = new CustomEvent(atype, { detail: adata });
        this.dispatchEvent(ev);
    };
    EventTarget.prototype['stfire'] = function (eventName, eventClass) {
        var ev;
        switch (eventClass) {
            case EventClasses.EVENT_:
                ev = document.createEvent(eventClass);
                ev.initEvent(eventName, true, true);
                break;
            case EventClasses.EVENT_Mouse:
                ev = document.createEvent(eventClass);
                ev.initMouseEvent(eventName, true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 1, null);
                break;
        }
        if (ev instanceof Event) {
            this.dispatchEvent(ev);
        }
    };
}
/**
 * Number.prototype.format(n, x, s, c)
 *
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
Number.prototype['format'] = function (n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')', num = this.toFixed(Math.max(0, ~~n));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
// printf.js - version 1.1.0
//
//  Copyright (C) 2000-2002  Masanao Izumo <iz@onicos.co.jp>
//
//  This library is free software; you can redistribute it and/or
//  modify it under the terms of the GNU Lesser General Public
//  License as published by the Free Software Foundation; either
//  version 2.1 of the License, or (at your option) any later version.
//
//  This library is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
//  Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public
//  License along with this library; if not, write to the Free Software
//  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//
//
// SYNOPSIS:
//   printf("format", ...);
//   str = sprintf("format", ...);
//
// Chages:
// 2002-02-04  Masanao Izumo <mo@goice.co.jp>
//             - Fixed bug about sprintf("%%") will return "%%".
//             - Evaluate undefined "%" argument.  That is:
//                   numerical value ===> 0	(%d, %x, %o, etc)
//                   string value    ===> ''	(%s)
// printf(format, ...);
function printf(format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    document.write(va_sprintf(printf.arguments));
}
// str = sprintf(format, ...);
function sprintf(format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return va_sprintf(sprintf.arguments);
}
function va_sprintf(args) {
    var ch;
    var value;
    var longflag;
    var ljust;
    var len, llen;
    var zpad;
    var p;
    var output;
    var format_index, arg_index;
    var argc, argv;
    var specin;
    var format;
    output = '';
    format_index = 0;
    arg_index = 1;
    argv = args;
    argc = args.length;
    format = args[0];
    while (format_index < format.length) {
        ch = format.substr(format_index++, 1);
        if (ch != '%' || format_index == format.length) {
            output += ch;
        }
        else {
            // ch == '%'
            ljust = len = zpad = longflag = 0;
            llen = -1;
            p = format_index;
            specin = true;
            while (specin) {
                ch = format.substr(format_index++, 1);
                switch (ch) {
                    case '-':
                        ljust = 1;
                        continue;
                    case '0': // set zero padding if len not set
                        if (len == 0)
                            zpad = 1;
                    // FALLTHROUGH
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        len = len * 10 + parseInt(ch);
                        continue;
                    case '.':
                        llen = len;
                        len = 0;
                        continue;
                    case '*':
                        if (arg_index < argc)
                            len = parseInt(argv[arg_index++]);
                        else
                            len = 0;
                        if (len < 0) {
                            ljust = 1;
                            len = -len;
                        }
                        continue;
                    case 'l':
                        longflag = 1;
                        continue;
                    case 'u':
                    case 'U':
                        if (arg_index < argc) {
                            if (longflag) {
                                value = parseInt(argv[arg_index++]);
                            }
                            else {
                                value = parseInt(argv[arg_index++]);
                                value %= 4294967296;
                            }
                        }
                        else {
                            value = 0;
                        }
                        output += _dopr_fmtnum(value, 10, 0, ljust, len, zpad);
                        break;
                    case 'o':
                    case 'O':
                        if (arg_index < argc) {
                            if (longflag) {
                                value = parseInt(argv[arg_index++]);
                            }
                            else {
                                value = parseInt(argv[arg_index++]);
                                value %= 4294967296;
                            }
                        }
                        else {
                            value = 0;
                        }
                        output += _dopr_fmtnum(value, 8, 0, ljust, len, zpad);
                        break;
                    case 'd':
                    case 'D':
                        if (arg_index < argc) {
                            if (longflag) {
                                value = parseInt(argv[arg_index++]);
                            }
                            else {
                                value = parseInt(argv[arg_index++]);
                                value %= 4294967296;
                            }
                        }
                        else {
                            value = 0;
                        }
                        output += _dopr_fmtnum(value, 10, 1, ljust, len, zpad);
                        break;
                    case 'x':
                        if (arg_index < argc) {
                            if (longflag) {
                                value = parseInt(argv[arg_index++]);
                            }
                            else {
                                value = parseInt(argv[arg_index++]);
                                value %= 4294967296;
                            }
                        }
                        else {
                            value = 0;
                        }
                        output += _dopr_fmtnum(value, 16, 0, ljust, len, zpad);
                        break;
                    case 'X':
                        if (arg_index < argc) {
                            if (longflag) {
                                value = parseInt(argv[arg_index++]);
                            }
                            else {
                                value = parseInt(argv[arg_index++]);
                                value %= 4294967296;
                            }
                        }
                        else {
                            value = 0;
                        }
                        output += _dopr_fmtnum(value, -16, 0, ljust, len, zpad);
                        break;
                    case 's':
                        if (arg_index < argc) {
                            value = argv[arg_index++];
                            if (value == null)
                                value = "(null)";
                            else
                                value = value + ""; // toString
                        }
                        else {
                            value = '';
                        }
                        output += _dopr_fmtstr(value, ljust, len, llen);
                        break;
                    case 'c':
                        if (arg_index < argc) {
                            value = parseInt(argv[arg_index++]);
                        }
                        else {
                            value = 0;
                        }
                        output += _dopr_fromCharCode(value);
                        break;
                    case '%':
                        output += '%';
                        break;
                    /* Not supported
                            case 'f': case 'e': case 'E': case 'g': case 'G':
                              if (arg_index < argc) {
                                value = argv[arg_index++];
                              } else {
                                value = 0.0;
                              }
                              output += _dopr_fmtdouble(format.substr(p, format_index - p), value);
                              break;
                    */
                    default:
                        if (p + 1 == format_index) {
                            output += '%';
                            output += ch;
                        }
                        else {
                            // alert("format error: " + format);
                        }
                        break;
                }
                specin = false;
            }
        }
    }
    return output;
}
// Private function
function _dopr_fmtnum(value, base, dosign, ljust, len, zpad) {
    var signvalue = '';
    var uvalue;
    var place = 0;
    var padlen = 0; // amount to pad
    var caps = 0;
    var convert;
    var output;
    convert = '';
    output = '';
    if (value >= 0)
        uvalue = value;
    else
        uvalue = (value % 4294967296) + 4294967296;
    if (dosign) {
        if (value < 0) {
            signvalue = '-';
            uvalue = -value;
        }
    }
    if (base < 0) {
        caps = 1;
        base = -base;
    }
    if (uvalue == 0) {
        convert = '0';
        place = 1;
    }
    else {
        while (uvalue) {
            if (caps)
                convert = '0123456789ABCDEF'.substr(uvalue % base, 1) + convert;
            else
                convert = '0123456789abcdef'.substr(uvalue % base, 1) + convert;
            uvalue = uvalue / base;
            place++;
        }
    }
    padlen = len - place;
    if (padlen < 0)
        padlen = 0;
    if (ljust)
        padlen = -padlen;
    if (zpad && padlen > 0) {
        if (signvalue) {
            output += signvalue;
            --padlen;
            signvalue = '0';
        }
        while (padlen > 0) {
            output += '0';
            --padlen;
        }
    }
    while (padlen > 0) {
        output += ' ';
        --padlen;
    }
    if (signvalue) {
        output += signvalue;
    }
    output += convert;
    while (padlen < 0) {
        output += ' ';
        ++padlen;
    }
    return output;
}
// Private function
function _dopr_fmtstr(value, ljust, field_len, llen) {
    var padlen; // amount to pad
    var slen, truncstr = 0;
    var output = '';
    slen = value.length;
    if (llen != -1) {
        var rlen;
        rlen = field_len;
        if (slen > rlen) {
            truncstr = 1;
            slen = rlen;
        }
        field_len = llen;
    }
    padlen = field_len - slen;
    if (padlen < 0)
        padlen = 0;
    if (ljust)
        padlen = -padlen;
    while (padlen > 0) {
        output += ' ';
        --padlen;
    }
    if (truncstr) {
        output += value.substr(0, slen);
    }
    else {
        output += value;
    }
    while (padlen < 0) {
        output += ' ';
        ++padlen;
    }
    return output;
}
// Private function
var _dopr_fromCharCode_chars = null;
function _dopr_fromCharCode(code) {
    if (String.fromCharCode)
        return String.fromCharCode(code);
    if (!_dopr_fromCharCode_chars)
        _dopr_fromCharCode_chars =
            "\000\001\002\003\004\005\006\007\010\011\012\013\014\015\016\017\020" +
                "\021\022\023\024\025\026\027\030\031\032\033\034\035\036\037 !\"#$%&" +
                "'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghi" +
                "jklmnopqrstuvwxyz{|}~\177\200\201\202\203\204\205\206\207\210\211" +
                "\212\213\214\215\216\217\220\221\222\223\224\225\226\227\230\231\232" +
                "\233\234\235\236\237\240\241\242\243\244\245\246\247\250\251\252\253" +
                "\254\255\256\257\260\261\262\263\264\265\266\267\270\271\272\273\274" +
                "\275\276\277\300\301\302\303\304\305\306\307\310\311\312\313\314\315" +
                "\316\317\320\321\322\323\324\325\326\327\330\331\332\333\334\335\336" +
                "\337\340\341\342\343\344\345\346\347\350\351\352\353\354\355\356\357" +
                "\360\361\362\363\364\365\366\367\370\371\372\373\374\375\376\377";
    if (code < 0)
        return "";
    if (code <= 255)
        return _dopr_fromCharCode_chars.substr(code, 1);
    return eval(sprintf("\"\\u%04x\"", code));
}
if (!Array.prototype['includes']) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            // 1. Let O be ? ToObject(this value).
            var o = Object(this);
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }
            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;
            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }
            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1. 
                k++;
            }
            // 8. Return false
            return false;
        }
    });
}
/**
 * Создание функций из строки.
 * @param Array<string> js Массив строк кода, из которых следует создать функции.
 */
function runJS(js) {
    for (var i = 0; i < js.length; i++) {
        try {
            new Function(js[i])();
        }
        catch (err) {
            console.error(js[i], err);
        }
    }
}
if (!Math['randomInt']) {
    Math['randomInt'] = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
}
var OffsetRect = /** @class */ (function (_super) {
    __extends(OffsetRect, _super);
    function OffsetRect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.top = 0;
        _this.topHeight = 0;
        _this.bottom = 0;
        _this.left = 0;
        _this.leftWidth = 0;
        _this.right = 0;
        return _this;
    }
    return OffsetRect;
}(Object));
if (!window.hasOwnProperty('EventTarget')) {
    Window.prototype['eventListener'] = function (atype, func, capture) {
        if (typeof arguments[0] === "object" && (!arguments[0].nodeType)) {
            return this.removeEventListener.apply(this, arguments[0]);
        }
        this.addEventListener(atype, func, capture);
        return arguments;
    };
    Window.prototype['fire'] = function (atype, adata) {
        var ev = new CustomEvent(atype, { detail: adata });
        this.dispatchEvent(ev);
    };
}
if (!window.hasOwnProperty('CreateObject')) {
    Window.prototype['CreateObject'] = function (objectName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        //        console.log(arguments);
        var a = objectName.split('.');
        var fn = (window || this);
        for (var i = 0, len = a.length; i < len; i++) {
            fn = fn[a[i]];
        }
        if (typeof fn !== "function") {
            throw new Error("function not found");
        }
        return new (fn.bind.apply(fn, __spreadArrays([void 0], args)))();
    };
}
if (!Object.wrapValues) {
    Object.wrapValues = function (obj, prefix, suffix) {
        var ret = Object.values(obj);
        if (prefix || suffix) {
            [].map.call(ret, function (_el, idx) {
                if (isString(_el)) {
                    ret[idx] = (prefix ? prefix : '') + _el + (suffix ? suffix : '');
                }
            });
        }
        return ret;
    };
}
if (!Object.removeVal) {
    Object.removeVal = function (key) {
        var _that = this;
        var res = undefined;
        if (_that.hasOwnProperty(key)) {
            res = _that[key];
            delete _that[key];
        }
        return res;
    };
}
if (!Array.prototype['first']) {
    Object.defineProperty(Array.prototype, 'first', {
        get: function () {
            return this[0];
        }
    });
}
if (!Array.prototype['last']) {
    Object.defineProperty(Array.prototype, 'last', {
        get: function () {
            return this[this.length - 1];
        }
    });
}
/**
 * @returns {CSSStyleRule}
 */
if (!Document.prototype['findCSSRule']) {
    Document.prototype['findCSSRule'] = function (selector, strong) {
        //    strong = strong == undefined ? false : strong;
        for (var i = 0; i < document.styleSheets.length; i++) {
            var styleSheet = document.styleSheets.item(i);
            for (var n = 0; n < styleSheet.cssRules.length; n++) {
                if (styleSheet.cssRules[n] instanceof CSSStyleRule) {
                    if (strong) {
                        if (styleSheet.cssRules[n].selectorText == selector) {
                            return styleSheet.cssRules[n];
                        }
                    }
                    else {
                        if (styleSheet.cssRules[n].selectorText.search(selector) >= 0) {
                            return styleSheet.cssRules[n];
                        }
                    }
                }
            }
        }
        return null;
    };
}
if (!Document.prototype['width']) {
    Object.defineProperty(Document.prototype, 'width', {
        get: function () {
            if (self.innerWidth) {
                return self.innerWidth;
            }
            if (document.documentElement && document.documentElement.clientWidth) {
                return document.documentElement.clientWidth;
            }
            if (document.body) {
                return document.body.clientWidth;
            }
        }
    });
}
if (!Document.prototype['height']) {
    Object.defineProperty(Document.prototype, 'height', {
        get: function () {
            if (self.innerHeight) {
                return self.innerHeight;
            }
            if (document.documentElement && document.documentElement.clientHeight) {
                return document.documentElement.clientHeight;
            }
            if (document.body) {
                return document.body.clientHeight;
            }
        }
    });
}
if (!window.hasOwnProperty('EventTarget')) {
    Document.prototype['eventListener'] = function (atype, func, capture) {
        if (typeof arguments[0] === "object" && (!arguments[0].nodeType)) {
            return this.removeEventListener.apply(this, arguments[0]);
        }
        this.addEventListener(atype, func, capture);
        return arguments;
    };
    Document.prototype['fire'] = function (atype, adata) {
        var ev = new CustomEvent(atype, { detail: adata });
        this.dispatchEvent(ev);
    };
}
/**
 * @returns {CSSStyleRule}
 */
if (!Element.prototype['findCSSRule']) {
    Element.prototype['findCSSRule'] = function (selector) {
        for (var i = 0; i < document.styleSheets.length; i++) {
            var styleSheet = document.styleSheets.item(i);
            for (var n = 0; n < styleSheet.rules.length; n++) {
                if (styleSheet.rules[n] instanceof CSSStyleRule) {
                    if (styleSheet.rules[n].selectorText.search(selector) > 0) {
                        return styleSheet.rules[n];
                    }
                }
            }
        }
        return null;
    };
}
try {
    if (!Element.hasOwnProperty('fullHeight')) {
        Object.defineProperty(Element.prototype, 'fullHeight', {
            get: function () {
                try {
                    var calc = window.getComputedStyle(this);
                    return this.clientHeight
                        + parseFloat(calc.marginTop.replace('/px/', ''))
                        + parseFloat(calc.marginBottom.replace('/px/', ''))
                        + parseFloat(calc.borderTopWidth.replace('/px/', ''))
                        + parseFloat(calc.borderBottomWidth.replace('/px/', ''));
                }
                catch (err) { }
            }
        });
    }
}
catch (err) { }
try {
    if (!Element.hasOwnProperty('fullWidth')) {
        Object.defineProperty(Element.prototype, 'fullWidth', {
            get: function () {
                try {
                    var calc = getComputedStyle(this);
                    return this.clientWidth
                        + parseFloat(calc.marginLeft.replace('/px/', ''))
                        + parseFloat(calc.marginRight.replace('/px/', ''))
                        + parseFloat(calc.borderLeftWidth.replace('/px/', ''))
                        + parseFloat(calc.borderRightWidth.replace('/px/', ''));
                }
                catch (err) { }
            }
        });
    }
}
catch (err) { }
Element.prototype['offsetFrom'] = function (element) {
    var ret = new OffsetRect;
    var currentBounds = this.getBoundingClientRect();
    var elementBounds = element.getBoundingClientRect();
    ret.top = currentBounds.top - elementBounds.top;
    ret.left = currentBounds.left - elementBounds.left;
    ret.bottom = currentBounds.bottom - elementBounds.bottom;
    ret.right = currentBounds.right - elementBounds.right;
    ret.topHeight = ret.top + currentBounds.height;
    ret.leftWidth = ret.left + currentBounds.width;
    return ret;
};
if (!window.hasOwnProperty('EventTarget')) {
    Element.prototype['eventListener'] = function (atype, func, capture) {
        if (typeof arguments[0] === "object" && (!arguments[0].nodeType)) {
            return this.removeEventListener.apply(this, arguments[0]);
        }
        this.addEventListener(atype, func, capture);
        return arguments;
    };
    Element.prototype['fire'] = function (atype, adata) {
        var ev = new CustomEvent(atype, { detail: adata });
        this.dispatchEvent(ev);
    };
}
if (!Element['removeChildren']) {
    Element.prototype['removeChildren'] = function () {
        for (var i = 0; i < this.children.length; i++) {
            this.removeChild(this.children[i]);
        }
    };
}
if (!Element['_getObj']) {
    Element.prototype['_getObj'] = function () {
        if (this.hasOwnProperty(mf.ANCESTOR_OBJ)) {
            return this[mf.ANCESTOR_OBJ];
        }
    };
}
if (!Element['_closestObj']) {
    Element.prototype['_closestObj'] = function () {
        var _el = this;
        while (!_el.hasOwnProperty(mf.ANCESTOR_OBJ)) {
            _el = _el.parentElement;
        }
        return _el[mf.ANCESTOR_OBJ];
    };
}
if (!Element['scrollMe']) {
    Element.prototype['scrollMe'] = function () {
        window.scrollTo({
            top: this.offsetFrom(document.body).top,
            left: this.offsetFrom(document.body).left,
            behavior: 'smooth'
        });
    };
}
if (!Element['closestElement']) {
    Element.prototype['closestElement'] = function (el) {
        var node = this;
        //console.log(node, el, node == el);
        if (el == node) {
            return el;
        }
        else {
            try {
                node = node.parentElement;
                return node.closestElement(el);
            }
            catch (err) {
                return null;
            }
        }
    };
}
if (!Element['closestType']) {
    Element.prototype['closestType'] = function (type) {
        var node = this;
        //console.log(node, el, node == el);
        if (node instanceof type) {
            return node;
        }
        else {
            try {
                node = node.parentElement;
                return node.closestType(type);
            }
            catch (err) {
                return null;
            }
        }
    };
}
if (!StyleSheetList.prototype['findRulesForSelector']) {
    StyleSheetList.prototype['findRulesForSelector'] = function (selector, strong) {
        strong = arguments[1] != undefined ? arguments[1] : true;
        var res = [];
        for (var i = 0; i < document.styleSheets.length; i++) {
            [].map.call(document.styleSheets[i].findRulesForSelector(selector, strong), function (_el) {
                res.push(_el);
            });
        }
        return res;
    };
}
if (!CSSStyleSheet.prototype['findRulesForSelector']) {
    CSSStyleSheet.prototype['findRulesForSelector'] = function (selector, strong) {
        strong = arguments[1] != undefined ? arguments[1] : true;
        var _that = this;
        var res = [];
        for (var i = 0; i < _that.cssRules.length; i++) {
            var _tmp = _that.cssRules[i];
            if (_tmp instanceof CSSStyleRule) {
                if (strong) {
                    if (_tmp.selectorText == selector) {
                        res.push(_tmp);
                    }
                }
                else if (!strong) {
                    if (_tmp.selectorText.indexOf(selector) >= 0) {
                        res.push(_tmp);
                    }
                }
            }
        }
        return res;
    };
}
var HTMLFormFieldTypes;
(function (HTMLFormFieldTypes) {
    HTMLFormFieldTypes["TYPE_TEXT"] = "text";
    HTMLFormFieldTypes["TYPE_FILE"] = "file";
    HTMLFormFieldTypes["TYPE_HIDDEN"] = "hidden";
    HTMLFormFieldTypes["TYPE_CHECKBOX"] = "checkbox";
    HTMLFormFieldTypes["TYPE_RADIO"] = "radio";
    HTMLFormFieldTypes["TYPE_SELECT_ONE"] = "select-one";
})(HTMLFormFieldTypes || (HTMLFormFieldTypes = {}));
var HTMLFormFieldFlags;
(function (HTMLFormFieldFlags) {
    HTMLFormFieldFlags[HTMLFormFieldFlags["SEARCH_NAME"] = 1] = "SEARCH_NAME";
    HTMLFormFieldFlags[HTMLFormFieldFlags["PREC_NAME"] = 2] = "PREC_NAME";
    HTMLFormFieldFlags[HTMLFormFieldFlags["SEARCH_BY_MODEL_NAME"] = 4] = "SEARCH_BY_MODEL_NAME";
})(HTMLFormFieldFlags || (HTMLFormFieldFlags = {}));
var HTMLFormFields = /** @class */ (function () {
    function HTMLFormFields(form) {
        this._form = form;
        this.list;
    }
    Object.defineProperty(HTMLFormFields.prototype, "list", {
        get: function () {
            if (!this._collection) {
                this._collection = [];
                var _that_1 = this;
                try {
                    [].map.call(_that_1._form, function (_inp, _idx) {
                        _that_1._collection.push(new HTMLFormField(_inp, _idx));
                    });
                }
                catch (err) {
                    //console.trace(err);
                }
            }
            return this._collection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLFormFields.prototype, "length", {
        get: function () {
            return this._collection.length;
        },
        enumerable: true,
        configurable: true
    });
    HTMLFormFields.prototype.findByName = function (name, attrType) {
        var ret = [];
        for (var i = 0; i < this._collection.length; i++) {
            if (this._collection[i].origName == name || this._collection[i].cleanName == name) {
                if (attrType && attrType != this._collection[i].fieldElement.getAttribute('type')) {
                    continue;
                }
                ret.push(this._collection[i]);
            }
        }
        if (ret.length == 1) {
            return ret[0];
        }
        if (ret.length > 1) {
            return ret;
        }
        return false;
    };
    HTMLFormFields.prototype.getValues = function (name) {
        var ret = [];
        for (var i = 0; i < this._collection.length; i++) {
            if (this._collection[i].origName == name || this._collection[i].cleanName == name) {
                var _el = this._collection[i].fieldElement;
                if (_el instanceof HTMLInputElement) {
                    switch (_el.type) {
                        case 'checkbox':
                        case 'radio':
                            if (_el.checked) {
                                ret.push(_el.value);
                            }
                            break;
                        case 'text':
                            ret.push(_el.value);
                            break;
                    }
                }
            }
        }
        if (ret.length < 2) {
            ret = ret[0];
        }
        return ret;
    };
    HTMLFormFields.prototype.getNames = function (flags) {
        var ret = [];
        if (!flags) {
            flags = HTMLFormFieldFlags.PREC_NAME;
        }
        [].map.call(this._collection, function (el) {
            if (flags & HTMLFormFieldFlags.PREC_NAME && !el.origName.isEmpty()) {
                ret.push(el.origName);
            }
            if (flags & HTMLFormFieldFlags.SEARCH_NAME && !el.cleanName.isEmpty()) {
                ret.push(el.cleanName);
            }
            if (flags & HTMLFormFieldFlags.SEARCH_BY_MODEL_NAME && !el.modelName.isEmpty()) {
                ret.push(el.modelName);
            }
        });
        return ret.unique();
    };
    HTMLFormFields.prototype.removeFields = function (names, flags) {
        var _that = this;
        if (isString(names)) {
            names = [names];
        }
        if (!flags) {
            flags = HTMLFormFieldFlags.PREC_NAME;
        }
        [].map.call(this._collection, function (el, idx) {
            if (flags & HTMLFormFieldFlags.PREC_NAME) {
                if (names.includes(el.origName)) {
                    _that.removeField(idx);
                }
            }
            if (flags & HTMLFormFieldFlags.SEARCH_NAME || flags & HTMLFormFieldFlags.SEARCH_BY_MODEL_NAME) {
                for (var i = 0; i < names.length; i++) {
                    if (flags & HTMLFormFieldFlags.SEARCH_NAME && el.cleanName.indexOf(names[i]) >= 0) {
                        _that.removeField(idx);
                    }
                    if (flags & HTMLFormFieldFlags.SEARCH_BY_MODEL_NAME && el.modelName.indexOf(names[i]) >= 0) {
                        _that.removeField(idx);
                    }
                }
            }
        });
    };
    HTMLFormFields.prototype.removeField = function (idx) {
        this._form.removeChild(this._collection[idx].fieldElement);
        delete this._collection[idx];
    };
    HTMLFormFields.prototype.item = function (idx) {
        return this._collection[idx];
    };
    HTMLFormFields.prototype.hiddenTo = function (form, includeFields) {
        function doCopy(f, fieldName, value) {
            var _f = Html.createElementEx('input', f, { 'type': 'hidden', name: fieldName });
            _f.value = value;
            f.fields._collection.push(new HTMLFormField(_f, f.fields.length));
        }
        var selector;
        if (isString(form)) {
            selector = String(form);
            form = document.querySelector(String(form));
        }
        if (!(form instanceof HTMLFormElement) || !('action' in form)) {
            throw new Error((selector || form) + ' is not HTMLFormElement');
        }
        form.fields.removeFields(this.getNames(HTMLFormFieldFlags.SEARCH_BY_MODEL_NAME), HTMLFormFieldFlags.SEARCH_BY_MODEL_NAME);
        for (var i = 0; i < this.length; i++) {
            switch (this._collection[i].type) {
                case HTMLFormFieldTypes.TYPE_CHECKBOX:
                case HTMLFormFieldTypes.TYPE_RADIO:
                    if (this._collection[i].fieldElement.checked) {
                        doCopy(form, this._collection[i].origName, this._collection[i].value);
                    }
                    break;
                default:
                    doCopy(form, this._collection[i].origName, this._collection[i].value);
            }
        }
        return form;
    };
    return HTMLFormFields;
}());
var HTMLFormField = /** @class */ (function () {
    function HTMLFormField(inp, index) {
        this.index = index;
        this.origName = inp.name;
        this.modelName = this.origName.substr(0, this.origName.indexOf('['));
        var _clean = this.origName.match(/\[(.*?)\]/);
        if (_clean) {
            this.cleanName = _clean[1];
        }
        else {
            this.cleanName = this.origName;
        }
        this.fieldElement = inp;
        this.isMultilang = this.fieldElement.parentElement.getAttribute('data-toggle') == 'multilang';
        this.isBinary = this.fieldElement.hasAttribute('data-binary');
    }
    HTMLFormField.prototype.clear = function () {
        switch (this.prototype) {
            case 'HTMLInputElement':
            case 'HTMLTextAreaElement':
                if (this.type == HTMLFormFieldTypes.TYPE_CHECKBOX || this.type == HTMLFormFieldTypes.TYPE_RADIO) {
                    var _that = this;
                    [].map.call([_that.fieldElement.form.fields.findByName(_that.origName, _that.type)], function (_inp) {
                        _inp.fieldElement.checked = false;
                    });
                    this.fieldElement.stfire('change', EventClasses.EVENT_);
                }
                else {
                    this.value = '';
                }
                break;
            case 'HTMLSelectElement':
                [].map.call(this.fieldElement.options, function (_opt) {
                    _opt.selected = false;
                });
                break;
        }
        return this;
    };
    HTMLFormField.prototype.isEmpty = function (trimString) {
        var ret = 0;
        switch (this.prototype) {
            case 'HTMLInputElement':
            case 'HTMLTextAreaElement':
                if (this.type == HTMLFormFieldTypes.TYPE_CHECKBOX || this.type == HTMLFormFieldTypes.TYPE_RADIO) {
                    var _that = this;
                    [].map.call([_that.fieldElement.form.fields.findByName(_that.origName, _that.type)], function (_inp) {
                        ret = ret | Number(_inp.fieldElement.checked);
                    });
                }
                else {
                    if (trimString) {
                        ret = this.value.trim().length;
                    }
                    else {
                        ret = this.value.length;
                    }
                }
                break;
            case 'HTMLSelectElement':
                [].map.call(this.fieldElement.selectedOptions, function (_opt) {
                    ret = ret | _opt.value.trim().length;
                });
                break;
        }
        return !ret;
    };
    Object.defineProperty(HTMLFormField.prototype, "prototype", {
        get: function () {
            return this.fieldElement.constructor['name'];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLFormField.prototype, "value", {
        get: function () {
            if (this.prototype == 'HTMLSelectElement') {
                return this.fieldElement.options[this.fieldElement.selectedIndex].value;
            }
            return this.fieldElement.value;
        },
        set: function (val) {
            this.fieldElement.value = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLFormField.prototype, "type", {
        get: function () {
            return this.fieldElement.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HTMLFormField.prototype, "label", {
        get: function () {
            if (this.fieldElement.id) {
                return this.fieldElement.form.querySelector('label[for="' + this.fieldElement.id + '"]');
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    return HTMLFormField;
}());
if (!HTMLFormElement.prototype['fields']) {
    Object.defineProperty(HTMLFormElement.prototype, 'fields', {
        get: function () {
            var _tmp;
            if (isNull(_tmp)) {
                _tmp = new HTMLFormFields(this);
            }
            return _tmp;
        },
    });
}
HTMLFormElement.prototype['fill'] = function (val, languageName, languageFields) {
    var _that = this;
    for (var _fld = 0; _fld < _that.fields.length; _fld++) {
        var field = _that.fields.item(_fld);
        if (!field.isMultilang && val[field.cleanName] != undefined) {
            switch (field.prototype) {
                case 'HTMLInputElement':
                case 'HTMLTextAreaElement':
                    if (field.type == 'radio' || field.type == 'checkbox') {
                    }
                    else {
                        field.value = val[field.cleanName];
                    }
                    break;
                case 'HTMLSelectElement':
                    _that.checkSelectValue(field, val[field.cleanName], field.isBinary);
                    break;
            }
        }
        else if (_that.fields.item(_fld).isMultilang) {
            var lang = val[languageName];
            try {
                for (var ml = 0; ml < lang.length; ml++) {
                    var suff = lang[ml]['language'].toLowerCase().replace('-', '_');
                    for (var p in lang[ml]) {
                        if (p.concat('_', suff) == _that.fields.item(_fld).cleanName || p == _that.fields.item(_fld).cleanName) {
                            field.value = lang[ml][p];
                        }
                    }
                }
            }
            catch (err) {
                //console.error(err);
            }
        }
    }
};
HTMLFormElement.prototype['resetForm'] = function () {
    [].map.call(this, function (_inp) {
        switch (_inp.type) {
            case 'text':
            case 'hidden':
                _inp.value = null;
                break;
            case 'checkbox':
            case 'radio':
                _inp.checked = false;
                break;
        }
        if (_inp instanceof HTMLTextAreaElement) {
            _inp.value = null;
        }
        if (_inp instanceof HTMLSelectElement) {
            _inp.value = null;
            [].map.call(_inp.options, function (_opt) {
                _opt.selected = false;
            });
        }
    });
};
HTMLFormElement.prototype['getFieldByName'] = function (fieldName) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].name == fieldName) {
            return this[i];
        }
    }
    throw new Error('Field with name «' + fieldName + '» not available in this form «' + this.id + '».');
};
HTMLFormElement.prototype['checkSelectValue'] = function (field, value, bynary) {
    var _that = this;
    if (typeof value == 'string') {
        value = [value];
    }
    if (!value) {
        return;
    }
    try {
        var _element = (field instanceof HTMLFormField) ? field.fieldElement : _that.getFieldByName(field);
        if (_element instanceof HTMLSelectElement) {
            for (var i = 0; i < _element.options.length; i++) {
                for (var v = 0; v < value.length; v++) {
                    if (bynary) {
                        if (parseInt(value[v]) & parseInt(_element.options[i].value)) {
                            _element.options[i].selected = true;
                        }
                        else {
                            _element.options[i].selected = false;
                        }
                    }
                    if (!bynary) {
                        if (value[v] == _element.options[i].value) {
                            _element.options[i].selected = true;
                        }
                        else {
                            _element.options[i].selected = false;
                        }
                    }
                }
            }
        }
        else {
            throw new Error('Element «' + _element.name + '» is not HTMLSelectElement.');
        }
    }
    catch (err) {
        console.error(err);
    }
};
try {
    Object.defineProperty(HTMLFormElement.prototype, 'isMultilingual', {
        get: function () {
            var _that = this;
            var res = false;
            if (_that.getAttribute('multilingual')) {
                res = _that.languages.length;
            }
            else {
                var _langPills = _that.querySelectorAll('a[data-lang]');
                try {
                    if (_langPills.length) {
                        _that.languages = [];
                        for (var i = 0; i < _langPills.length; i++) {
                            _that.languages.push(_langPills[i].getAttribute('data-lang'));
                        }
                        res = _that.languages.length;
                        _that.setAttribute('multilingual', res.toString());
                    }
                }
                catch (err) { }
            }
            return res;
        }
    });
}
catch (err) { }
Object.defineProperty(HTMLFormElement.prototype, 'languages', {
    value: [],
    writable: true,
    enumerable: true
});
try {
    if (!HTMLTableCellElement.hasOwnProperty('rowIndex')) {
        Object.defineProperty(HTMLTableCellElement.prototype, 'rowIndex', {
            get: function () {
                var _that = this;
                try {
                    return _that.row.rowIndex;
                }
                catch (err) { }
            }
        });
    }
}
catch (err) { }
try {
    if (!HTMLTableCellElement.hasOwnProperty('row')) {
        Object.defineProperty(HTMLTableCellElement.prototype, 'row', {
            get: function () {
                var _that = this;
                try {
                    return _that.parentElement;
                }
                catch (err) { }
            }
        });
    }
}
catch (err) { }
try {
    if (!HTMLTableCellElement.prototype['neighbourCell']) {
        HTMLTableCellElement.prototype['neighbourCell'] = function (side) {
            var _that = this;
            var ret;
            try {
                switch (side) {
                    case 'left':
                        ret = _that.parentElement.cells[_that.cellIndex - 1];
                        break;
                    case 'right':
                        ret = _that.parentElement.cells[_that.cellIndex + 1];
                        break;
                    case 'top':
                        ret = _that.parentElement.parentElement.rows[_that.rowIndex - 2].cells[_that.cellIndex];
                        break;
                    case 'bottom':
                        ret = _that.parentElement.parentElement.rows[_that.rowIndex].cells[_that.cellIndex];
                        break;
                }
            }
            catch (err) { }
            return ret;
        };
    }
}
catch (err) { }
try {
    if (!HTMLTableRowElement.hasOwnProperty('table')) {
        Object.defineProperty(HTMLTableRowElement.prototype, 'table', {
            get: function () {
                var _that = this;
                try {
                    return _that.parentElement.parentElement;
                }
                catch (err) { }
            }
        });
    }
}
catch (err) { }
try {
    if (!HTMLTableElement.hasOwnProperty('cells')) {
        Object.defineProperty(HTMLTableElement.prototype, 'cells', {
            get: function () {
                var _that = this;
                var ret = [];
                for (var i = 0; i < _that.rows.length; i++) {
                    for (var c = 0; c < _that.rows[i].cells.length; c++) {
                        ret.push(_that.rows[i].cells[c]);
                    }
                }
                return ret;
            }
        });
    }
}
catch (err) { }
try {
    if (!HTMLTableElement.prototype['getCell']) {
        HTMLTableElement.prototype['getCell'] = function (rowIndex, cellIndex) {
            var _that = this;
            return _that.rows[rowIndex].cells[cellIndex];
        };
    }
    ;
}
catch (err) { }
