module ct {

    export interface IChapterNodeData {
        depth: number;
        id: number;
        lft: number;
        position: number;
        rgt: number;
        title: string;
        tree: number;
        created_at: number;
        updated_at: number;
        _flags: number;
    }

    export class TTreeChapter extends ct.TTreeNode {

        constructor(options?) {
            super(options);
        }

        protected init(options) {
            this._dataset = new ct.TChapterDataSet({
                owner: this,
                data: options,
            });
        }

        protected render() {
            super.render();
            this.setAttribute('data-anc', 'chapter');
        }

        public transfer(toNode: ct.TTreeChapter | number) {
            (this.data as ct.TChapterDataSet).moveToChapter(toNode);
        }
    }
}

window.customElements.define('tree-article', ct.TTreeChapter, {extends: 'li'});

