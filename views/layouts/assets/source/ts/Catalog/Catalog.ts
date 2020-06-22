module cat {

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

    export interface IArticleNodeData {
        id: number;
        title: string;
        content: string;
        _flags: number;
    }

    export interface ICatalogOptions {
        container: HTMLElement,
    }

    export class Catalog extends HTMLUListElement {

        constructor(options: cat.ICatalogOptions) {
            super();

            let _that = this;

            options.container.appendChild(this);

        }

        static getChapters(parent: cat.Chapter | cat.Catalog) {
            let _that = this;
            let url: string = '/v2/chapter/view';
            if (parent instanceof cat.Chapter) {
                url = url + '/' + (parent as cat.Chapter).data.id;
            }

            fetch(url)
                .then((res: Response) => {
                    return res.json();
                }).then((res: Array<cat.IChapterNodeData>) => {
                    res.forEach((val: cat.IChapterNodeData) => {
                        parent.nodes.appendChild(new cat.Chapter(val));
                    });
                });
        }

        get nodes() {
            return this as HTMLUListElement;
        }
    }

    export class Articles extends HTMLUListElement {

        constructor(options: cat.ICatalogOptions) {
            super();

            options.container.appendChild(this);

        }

        static getArticles(parent: cat.Chapter, nodes: cat.Articles) {
            let _that = this;
            let url: string = '/v2/article/view';
            if (parent instanceof cat.Chapter) {
                url = url + '/' + (parent as cat.Chapter).data.id;
            }

            fetch(url)
                .then((res: Response) => {
                    return res.json();
                }).then((res: Array<cat.IArticleNodeData>) => {
                    res.forEach((val: cat.IArticleNodeData) => {
                        nodes.appendChild(new cat.Article(val));
                    });
                });
        }

        clear() {
            this.innerHTML = "";
        }
    }

    export class Chapter extends HTMLLIElement {

        protected _data: cat.IChapterNodeData;

        constructor(data: cat.IChapterNodeData) {
            super();
            this.data = data;

            Html.createElementEx('ul', this);
            cat.Catalog.getChapters(this);
        }

        get data() {
            return this._data;
        }

        set data(val: cat.IChapterNodeData) {
            Html.createElementEx('span', this, {}, val.title);
            this._data = val;
        }

        get nodes() {
            return this.querySelector('ul') as HTMLUListElement;
        }
    }

    export class Article extends HTMLLIElement {

        protected _data: cat.IArticleNodeData;

        constructor(data: cat.IArticleNodeData) {
            super();
            this.data = data;
        }

        get data() {
            return this._data;
        }

        set data(val: cat.IArticleNodeData) {
            this.innerHTML = val.title;
            this._data = val;
        }

    }
}

window.customElements.define('catalog-tree', cat.Catalog, {extends: 'ul'});
window.customElements.define('articles-list', cat.Articles, {extends: 'ul'});
window.customElements.define('catalog-node', cat.Chapter, {extends: 'li'});
window.customElements.define('article-node', cat.Article, {extends: 'li'});