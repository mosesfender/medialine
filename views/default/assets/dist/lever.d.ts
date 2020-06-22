declare interface IResolveError {
    code: number;
    file: string;
    line: number;
    message: string;
    name: string;
    'stack-trace': Array<string>;
    type: string;
}
declare class ResolveError extends Error {
    data: any;
    constructor(message?: string, data?: any);
    handleError(): void;
}
declare module ct {
    interface IDatasetOptions {
        owner: HTMLElement;
        data: ct.INodeData;
    }
    interface INodeData {
        id: number;
        title: string;
        _flags: number;
    }
    class TDataSet {
        owner: ct.TTree | ct.TTreeNode;
        protected _selfData: null | ct.INodeData;
        constructor(options?: any);
        protected init(options: any): void;
        protected doSelfData(): void;
        doChildrens(): void;
        data: ct.INodeData;
        readonly id: number;
    }
    class TTreeDataSet extends ct.TDataSet {
        constructor(options?: any);
        protected init(options: any): void;
    }
    class TChapterDataSet extends ct.TDataSet {
        protected _selfData: ct.IChapterNodeData;
        moveToChapter(destination: ct.TTreeChapter | number, callback?: Function): void;
    }
    class TArticleDataSet extends ct.TDataSet {
        protected _selfData: ct.IChapterNodeData;
        toChapter(destination: ct.TTreeChapter, callback?: Function): void;
    }
}
declare module ct {
    enum Events {
        EV_CHILDS_LOADED = "childsLoaded"
    }
    interface ITreeOptions {
        container: HTMLElement;
    }
    class TTree extends HTMLElement {
        protected _dataset: ct.TTreeDataSet;
        protected _dragged: ct.TTreeNode;
        protected _dropTarget: ct.TTreeNode;
        protected _dropAccept: boolean;
        constructor(options?: any);
        readonly nodes: HTMLUListElement;
        readonly data: TTreeDataSet;
    }
    class comp {
        static isSameTree(first: ct.TTreeChapter | ct.TTreeNode, second: ct.TTreeChapter | ct.TTreeNode): boolean;
        static isSameChapter(node: ct.TTreeNode, compareOf: ct.TTreeChapter | ct.TTreeNode): void;
        static isChild(node: ct.TTreeChapter | ct.TTreeNode, compareOf: ct.TTreeChapter | ct.TTreeNode): boolean;
    }
}
declare module ct {
    interface INodesInputData {
        chapters: Array<ct.IChapterNodeData>;
        articles: Array<ct.IArticleNodeData>;
    }
    class TTreeNodes extends HTMLUListElement {
        constructor(options?: any);
        renderChildren(data: ct.INodesInputData): void;
        clear(): void;
    }
}
declare module ct {
    class TTreeNode extends HTMLLIElement {
        protected _dataset: ct.TDataSet;
        protected _selfContainer: HTMLElement;
        protected _expander: HTMLElement;
        protected _icon: HTMLElement;
        _caption: HTMLElement;
        protected _expanded: boolean;
        protected _busy: boolean;
        constructor(options?: any);
        protected init(options: any): void;
        protected render(): void;
        toggle(): void;
        expand(): void;
        collapse(): void;
        transfer(toNode: ct.TTreeNode | number): void;
        readonly tree: TTree;
        readonly nodes: HTMLUListElement;
        readonly data: TDataSet;
        readonly chapter: TTreeChapter;
        caption: string;
        readonly isChapter: boolean;
        readonly isArticle: boolean;
    }
}
declare module ct {
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
    class TTreeChapter extends ct.TTreeNode {
        constructor(options?: any);
        protected init(options: any): void;
        protected render(): void;
        transfer(toNode: ct.TTreeChapter | number): void;
    }
}
declare module ct {
    interface IArticleNodeData {
        id: number;
        title: string;
        content: string;
        _flags: number;
    }
    class TTreeArticle extends ct.TTreeNode {
        constructor(options?: any);
        protected init(options: any): void;
        protected render(): void;
        expand(): boolean;
        collapse(): boolean;
        transfer(toNode: ct.TTreeChapter): void;
    }
}
declare let tree: ct.TTree;
declare let getContent: (win: vw.TVirtWindow) => Document;
declare let serialize: (form: HTMLFormElement) => {};
declare class forms {
    static chapterForm(create: boolean, chapter?: ct.TTreeChapter): Promise<vw.TVirtWindow>;
    static articleForm(create: boolean, article?: ct.TTreeArticle, chapter?: ct.TTreeChapter): Promise<vw.TVirtWindow>;
}
