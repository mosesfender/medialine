declare module cat {
    interface IChapterNodeData {
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
    interface IArticleNodeData {
        id: number;
        title: string;
        content: string;
        _flags: number;
    }
    interface ICatalogOptions {
        container: HTMLElement;
    }
    class Catalog extends HTMLUListElement {
        constructor(options: cat.ICatalogOptions);
        static getChapters(parent: cat.Chapter | cat.Catalog): void;
        readonly nodes: HTMLUListElement;
    }
    class Articles extends HTMLUListElement {
        constructor(options: cat.ICatalogOptions);
        static getArticles(parent: cat.Chapter, nodes: cat.Articles): void;
        clear(): void;
    }
    class Chapter extends HTMLLIElement {
        protected _data: cat.IChapterNodeData;
        constructor(data: cat.IChapterNodeData);
        data: cat.IChapterNodeData;
        readonly nodes: HTMLUListElement;
    }
    class Article extends HTMLLIElement {
        protected _data: cat.IArticleNodeData;
        constructor(data: cat.IArticleNodeData);
        data: cat.IArticleNodeData;
    }
}
declare let catalog: cat.Catalog;
declare let articles: cat.Articles;
