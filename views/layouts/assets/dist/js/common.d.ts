declare module mf {
    const ATTRIBUTE_ANCESTOR = "data-ancestor";
    const ATTRIBUTE_ROLE = "data-role";
    const MAIN_ANCESTOR = "mfElement";
    const ANCESTOR_OBJ = "__obj";
    const ATTRIBUTES_PARAM = "attributes";
}
declare function isNull(data: any): Boolean;
declare function isString(data: any): Boolean;
declare function isArray(data: any): Boolean;
declare function isObject(data: any): Boolean;
declare function isFunc(data: any): Boolean;
declare function isInteger(data: any): Boolean;
declare function isScalar(data: any): Boolean;
declare function isTouchDevice(): Boolean;
declare enum mfRequestMethod {
    METHOD_GET = "GET",
    METHOD_POST = "POST"
}
declare enum mfResponseCodes {
    RESULT_CODE_SUCCESS = "success",
    RESULT_CODE_ERROR = "error",
    RESULT_CODE_MODEL_ERROR = "modelError"
}
interface mfResponse {
    code: mfResponseCodes;
    message: string;
    data: any;
}
/**
 * @update 27.08.2018
 */
declare namespace Url {
    interface ParsedURL {
        source: string;
        schema: string;
        host: string;
        port: string;
        path: string;
        query: string;
        file: string;
        hash: string;
        relative: string;
        segments: Array<String>;
        params: any;
    }
    function parse(str: string): ParsedURL;
}
declare namespace Objects {
    function extend(first: Object, second: Object): Object;
    function extendWithExcludes(first: Object, second: Object, excludes?: Array<String>): Object;
    function objectToQueryStr(obj: Object): string;
    function objectToQueryStr2(obj: Object): string;
    function compileGetUrl(url: string, params: Object): string;
    function setDefinition(obj: Object, propertyName: string, defValue: any): any;
    function postData(url: string, params: Object, method?: mfRequestMethod): void;
    /**
     * Получает значение key объекта obj, и удаляет его из объекта
     * @param Object obj
     * @param string key
     */
    function removeVal(obj: Object, key: string): any | undefined;
}
declare namespace Html {
    function empty(el: HTMLElement): void;
    function createElement(tag: string): Element;
    function createElementNS(NS: string, tag: string): Element;
    function createElementEx(tag: string, parent?: Element, attributes?: Object, innerText?: string): Element;
    function createSwgUse(xhref: string, cssClass?: string): SVGSVGElement;
    /**
     * @var {string} str Class attribute, e.g. 'class-one class-two'
     * @returns {string} CSS path, e.q. '.class-one.class-two'
     */
    function classStringToCSSSelector(str: string): string;
    /**
     * @var {string} tag, e.g. 'div'
     * @returns {string} e.g. '<div></div>'
     */
    function tagToJqueryTag(tag: string): string;
    function cssMeasureToNumber(css: string): number;
    function getElementFullHeight(element: HTMLElement): number;
    function getElementFullWidth(element: HTMLElement): number;
}
declare interface String {
    toBool(): boolean;
    isEmpty(): boolean;
    CSStoMilliseconds(): number;
}
declare interface Number {
    toBool(): boolean;
}
declare interface Array<T> {
    unique(): Array<T>;
    includes(searchElement: number | string, fromIndex?: number): boolean;
}
interface DOMTokenList {
    addMany(classes: string | Array<string>): void;
    removeMany(classes: string | Array<string>, exclude?: string | Array<string>): void;
    toggleClass(add: string, remove: string): void;
}
declare function executeFunctionByName(functionName: any, context: any): any;
declare enum EventClasses {
    EVENT_ = "Event",
    EVENT_HTML = "HTMLEvent",
    EVENT_Mouse = "MouseEvents"
}
interface EventTarget {
    eventListener(atype: any, func?: any, capture?: any): any;
    fire(atype: string, adata?: any): any;
    stfire(eventName: string, eventClass: string): any;
}
declare function printf(format: string, ...args: any[]): void;
declare function sprintf(format: string, ...args: any[]): any;
declare function va_sprintf(args: any): any;
declare function _dopr_fmtnum(value: any, base: any, dosign: any, ljust: any, len: any, zpad: any): any;
declare function _dopr_fmtstr(value: any, ljust: any, field_len: any, llen: any): string;
declare var _dopr_fromCharCode_chars: any;
declare function _dopr_fromCharCode(code: any): any;
/**
 * Создание функций из строки.
 * @param Array<string> js Массив строк кода, из которых следует создать функции.
 */
declare function runJS(js: Array<string>): void;
interface Math {
    /**
     * Возвращает целое число в диапазоне 0..max
     */
    randomInt(min: number, max: number): number;
}
declare class OffsetRect extends Object {
    top: number;
    topHeight: number;
    bottom: number;
    left: number;
    leftWidth: number;
    right: number;
}
declare interface Window {
    eventListener(atype: any, func?: any, capture?: any): any;
    fire(atype: string, adata?: any): any;
    CreateObject(objectName: string, ...args: any[]): any;
}
declare interface Object {
    values(obj: Object): Array<any>;
    wrapValues(obj: Object, prefix?: string, suffix?: string): Array<string>;
    removeVal(key: string): any | undefined;
}
declare interface Array<T> {
    first: any;
    last: any;
}
declare interface Document {
    findCSSRule(selector: string, strong?: boolean): CSSStyleRule | null;
    width: number;
    height: number;
    eventListener(atype: any, func?: any, capture?: any): any;
    fire(atype: string, adata?: any): any;
}
declare interface Element {
    findCSSRule(selector: string): CSSStyleRule | null;
    offsetFrom(element: Element): OffsetRect;
    fullHeight: number;
    fullWidth: number;
    eventListener(atype: any, func?: any, capture?: any): any;
    fire(atype: string, adata?: any): any;
    removeChildren(): any;
    scrollMe(): any;
    closestElement(el: Element): Element | null;
    /**
     * Находит элемент с указанным типом в иерархии объектов вверх от текщего элемента.
     * @param type Искомый тип объекта (имя конструктора)
     */
    closestType(type: any): any | null;
}
declare interface StyleSheetList {
    /**
     * Ищет правила во всех списках стилей для указанного селектора.
     *
     * @param selector {string} Селектор элемента
     * @param strong {boolean} Флаг, указывающий на точное совпадение селектора
     * @default true
     */
    findRulesForSelector(selector: string, strong?: boolean): Array<CSSStyleRule>;
}
declare interface CSSStyleSheet {
    /**
     * Ищет правила во всех списках стилей для указанного селектора.
     *
     * @param selector {string} Селектор элемента
     * @param strong {boolean} Флаг, указывающий на точное совпадение селектора
     * @default true
     */
    findRulesForSelector(selector: string, strong?: boolean): Array<CSSStyleRule>;
}
declare enum HTMLFormFieldTypes {
    TYPE_TEXT = "text",
    TYPE_FILE = "file",
    TYPE_HIDDEN = "hidden",
    TYPE_CHECKBOX = "checkbox",
    TYPE_RADIO = "radio",
    TYPE_SELECT_ONE = "select-one"
}
declare enum HTMLFormFieldFlags {
    SEARCH_NAME = 1,
    PREC_NAME = 2,
    SEARCH_BY_MODEL_NAME = 4
}
declare class HTMLFormFields {
    _form: HTMLFormElement;
    _collection: Array<HTMLFormField>;
    constructor(form: HTMLFormElement);
    readonly list: HTMLFormField[];
    readonly length: number;
    findByName(name: string, attrType?: HTMLFormFieldTypes | string): Array<HTMLFormField> | HTMLFormField | boolean;
    getValues(name: string): string | Array<string>;
    getNames(flags?: HTMLFormFieldFlags): Array<string>;
    removeFields(names: string | Array<string>, flags?: HTMLFormFieldFlags): void;
    removeField(idx: number): void;
    item(idx: any): HTMLFormField;
    hiddenTo(form: string | HTMLFormElement): HTMLFormElement;
}
declare class HTMLFormField {
    origName: string;
    modelName: string;
    cleanName: string;
    index: number;
    fieldElement: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    isMultilang: boolean;
    isBinary: boolean;
    constructor(inp: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, index: number);
    clear(): this;
    isEmpty(trimString?: Boolean): boolean;
    readonly prototype: any;
    value: string;
    readonly type: string;
    readonly label: Element;
}
declare interface HTMLFormElement {
    /**
     * Сброс элементов формы
     */
    resetForm(): void;
    checkSelectValue(field: string | HTMLFormField, value: string | Array<string> | number | Array<number>, bynary?: boolean): void;
    getFieldByName(fieldName: string): HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    languages: Array<string>;
    isMultilingual: boolean | number;
    fields: HTMLFormFields;
    fill(val: Object, languageName?: string, languageFields?: Array<string>): void;
}
declare interface HTMLTableCellElement {
    rowIndex: number;
    row: HTMLTableRowElement;
    neighbourCell(side: string): HTMLTableCellElement | undefined;
}
declare interface HTMLTableRowElement {
    table: HTMLTableElement;
}
declare interface HTMLTableElement {
    cells: Array<HTMLTableCellElement>;
    getCell(rowIndex: number, cellIndex: number): HTMLTableCellElement | undefined;
}
