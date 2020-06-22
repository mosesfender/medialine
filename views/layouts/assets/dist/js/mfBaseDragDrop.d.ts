declare type TOffsetCoords = {
    x: number;
    y: number;
};
declare module mf {
    class TBaseDragDrop {
        owner: mf.TBaseElement | HTMLElement;
        protected _canDrad: boolean;
        protected _levers: Array<HTMLElement>;
        cloneDraggable: boolean;
        startDragInterval: number;
        protected _beginEvent: MouseEvent;
        protected _currentLever: HTMLElement;
        protected _beginOffset: TOffsetCoords;
        protected _rfa: number;
        protected _moveEvent: MouseEvent;
        protected _ev_MouseUp: any;
        protected _ev_MouseDown: any;
        protected _ev_MouseMove: any;
        constructor(options?: any);
        destroy(): void;
        protected _initEvents(): void;
        protected startDrag(ev: MouseEvent): void;
        protected clearDrag(): void;
        protected isDragLever(_el: Element): false | HTMLElement;
        levers: string | HTMLElement | Array<any>;
        readonly naturalOwner: HTMLElement;
    }
}
