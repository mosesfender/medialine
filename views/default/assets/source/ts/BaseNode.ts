module ct {
    export class TTreeNode extends HTMLLIElement {
        protected _dataset: ct.TDataSet;
        protected _selfContainer: HTMLElement;
        protected _expander: HTMLElement;
        protected _icon: HTMLElement;
        public _caption: HTMLElement;
        protected _expanded: boolean;
        protected _busy: boolean;

        constructor(options?) {
            super();
            Objects.setDefinition(this, 'busy', false);
            this.draggable = true;
            this.init(options);
            this.collapse();
            this.render();
            this.appendChild(new ct.TTreeNodes());
        }

        protected init(options) {

        }

        protected render() {
            this._selfContainer = Html.createElementEx('div', this) as HTMLElement;
            this._expander = Html.createElementEx('i', this._selfContainer) as HTMLElement;
            this._icon = Html.createElementEx('em', this._selfContainer) as HTMLElement;
            this._caption = Html.createElementEx('span', this._selfContainer, {'data-caption': ''}, this._dataset.data.title) as HTMLElement;
        }

        toggle() {
            if (this._expanded) {
                this.collapse();
            } else {
                this.expand();
            }
        }

        expand() {
            this._expanded = true;
            this.classList.toggleClass('expanded', 'collapsed');
            this._dataset.doChildrens();
        }

        collapse() {
            this._expanded = false;
            this.classList.toggleClass('collapsed', 'expanded');
        }

        public transfer(toNode: ct.TTreeNode | number) {

        }

        get tree() {
            return this.closestType(ct.TTree) as ct.TTree;
        }

        get nodes() {
            return this.querySelector('ul');
        }

        get data() {
            return this._dataset;
        }

        get chapter() {
            return this.parentElement.parentElement as ct.TTreeChapter;
        }

        set caption(val: string) {
            this._caption.innerHTML = val;
        }

        get isChapter() {
            return this instanceof ct.TTreeChapter;
        }

        get isArticle() {
            return this instanceof ct.TTreeArticle;
        }
    }
}
