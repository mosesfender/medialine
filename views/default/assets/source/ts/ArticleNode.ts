module ct {
    export interface IArticleNodeData {
        id: number;
        title: string;
        content: string;
        _flags: number;
    }

    export class TTreeArticle extends ct.TTreeNode {

        constructor(options?) {
            super(options);
        }

        protected init(options) {
            this._dataset = new ct.TArticleDataSet({
                owner: this,
                data: options,
            });
        }

        protected render() {
            super.render();
            this.setAttribute('data-anc', 'article');
        }

        expand() {
            return false;
        }

        collapse() {
            return false;
        }

        public transfer(toNode: ct.TTreeChapter) {
            (this.data as ct.TArticleDataSet).toChapter(toNode);
        }
    }
}

window.customElements.define('tree-chapter', ct.TTreeArticle, {extends: 'li'});

