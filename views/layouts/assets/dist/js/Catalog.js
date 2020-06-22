var cat;
(function (cat) {
    class Catalog extends HTMLUListElement {
        constructor(options) {
            super();
            let _that = this;
            options.container.appendChild(this);
        }
        static getChapters(parent) {
            let _that = this;
            let url = '/v2/chapter/view';
            if (parent instanceof cat.Chapter) {
                url = url + '/' + parent.data.id;
            }
            fetch(url)
                .then((res) => {
                return res.json();
            }).then((res) => {
                res.forEach((val) => {
                    parent.nodes.appendChild(new cat.Chapter(val));
                });
            });
        }
        get nodes() {
            return this;
        }
    }
    cat.Catalog = Catalog;
    class Articles extends HTMLUListElement {
        constructor(options) {
            super();
            options.container.appendChild(this);
        }
        static getArticles(parent, nodes) {
            let _that = this;
            let url = '/v2/article/view';
            if (parent instanceof cat.Chapter) {
                url = url + '/' + parent.data.id;
            }
            fetch(url)
                .then((res) => {
                return res.json();
            }).then((res) => {
                res.forEach((val) => {
                    nodes.appendChild(new cat.Article(val));
                });
            });
        }
        clear() {
            this.innerHTML = "";
        }
    }
    cat.Articles = Articles;
    class Chapter extends HTMLLIElement {
        constructor(data) {
            super();
            this.data = data;
            Html.createElementEx('ul', this);
            cat.Catalog.getChapters(this);
        }
        get data() {
            return this._data;
        }
        set data(val) {
            Html.createElementEx('span', this, {}, val.title);
            this._data = val;
        }
        get nodes() {
            return this.querySelector('ul');
        }
    }
    cat.Chapter = Chapter;
    class Article extends HTMLLIElement {
        constructor(data) {
            super();
            this.data = data;
        }
        get data() {
            return this._data;
        }
        set data(val) {
            this.innerHTML = val.title;
            this._data = val;
        }
    }
    cat.Article = Article;
})(cat || (cat = {}));
window.customElements.define('catalog-tree', cat.Catalog, { extends: 'ul' });
window.customElements.define('articles-list', cat.Articles, { extends: 'ul' });
window.customElements.define('catalog-node', cat.Chapter, { extends: 'li' });
window.customElements.define('article-node', cat.Article, { extends: 'li' });
let catalog;
let articles;
document.eventListener("DOMContentLoaded", () => {
    catalog = new cat.Catalog({
        container: document.querySelector('.catalog')
    });
    articles = new cat.Articles({
        container: document.querySelector('.arts')
    });
    catalog.eventListener('click', (ev) => {
        ev.preventDefault();
        if (ev.target.closestType(cat.Chapter)) {
            let chapter = ev.target.closestType(cat.Chapter);
            articles.clear();
            cat.Articles.getArticles(chapter, articles);
        }
    });
    cat.Catalog.getChapters(catalog);
});
