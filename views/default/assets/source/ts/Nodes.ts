module ct {

    export interface INodesInputData {
        chapters: Array<ct.IChapterNodeData>;
        articles: Array<ct.IArticleNodeData>;
    }

    export class TTreeNodes extends HTMLUListElement {

        constructor(options?) {
            super();

        }

        public renderChildren(data: ct.INodesInputData) {
            this.innerHTML = '';
            for (let i = 0; i < data.chapters.length; i++) {
                this.appendChild(new ct.TTreeChapter(data.chapters[i]));
            }
            for (let i = 0; i < data.articles.length; i++) {
                this.appendChild(new ct.TTreeArticle(data.articles[i]));
            }
        }

        public clear() {
            let _that = this;
            [].map.call(this.children, (_el: HTMLElement) => {
                _that.removeChild(_el);
            });
        }
    }
}

window.customElements.define('tree-nodes', ct.TTreeNodes, {extends: 'ul'});