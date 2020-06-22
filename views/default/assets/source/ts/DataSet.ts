declare interface IResolveError {
    code: number;
    file: string;
    line: number;
    message: string;
    name: string;
    'stack-trace': Array<string>;
    type: string;
}

class ResolveError extends Error {
    public data;

    constructor(message?: string, data?: any) {
        super(message);
        this.data = data;
        this.name = 'ResolveError';
    }

    handleError() {
        this.data.then((err: IResolveError) => {
            vw.Alert('Ошибка', sprintf('[%s, %s] %s', err.code, err.line, err.message));
        });
    }
}

module ct {

    export interface IDatasetOptions {
        owner: HTMLElement;
        data: ct.INodeData;
    }

    export interface INodeData {
        id: number;
        title: string;
        _flags: number;
    }

    export class TDataSet {
        public owner: ct.TTree | ct.TTreeNode;
        protected _selfData: null | ct.INodeData;

        constructor(options?) {
            this.init(options);
        }

        protected init(options) {
            Object.assign(this, options);
        }

        /**
         * Метод полуцчения собственных данных узла
         */
        protected doSelfData() {

        }

        /**
         * Метод полуцчения данных детей
         */
        public doChildrens() {
            let _that = this;
            fetch(Objects.compileGetUrl('/v1/chapter/leaves', {id: this.id}))
                .then((res: Response) => {
                    if (!res.ok) {
                        throw new ResolveError(null, res.json());
                    }
                    return res.json();
                })
                .then((res) => {
                    (_that.owner.nodes as ct.TTreeNodes).renderChildren(res);
                })
                .catch((res: ResolveError) => {
                    res.handleError();
                });
        }

        get data() {
            return this._selfData;
        }

        set data(val: ct.INodeData) {
            this._selfData = val;
            if ((this.owner as ct.TTreeNode)._caption) {
                (this.owner as ct.TTreeNode).caption = this._selfData.title;
            }
        }

        get id() {
            return this.data.id || null;
        }
    }

    export class TTreeDataSet extends ct.TDataSet {

        constructor(options?) {
            super(options);
        }

        protected init(options) {
            Object.assign(this, options);
        }

    }

    export class TChapterDataSet extends ct.TDataSet {
        protected _selfData: ct.IChapterNodeData;

        public moveToChapter(destination: ct.TTreeChapter | number, callback?: Function) {
            let _that = this;
            fetch('/v1/chapter/move-to-chapter', {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json',
                    //'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    chapter: this.id,
                    toChapter: isInteger(destination) ? 0 : (destination as ct.TTreeChapter).data.id,
                }),
            }).then((res: Response) => {
                if (!res.ok) {
                    throw new ResolveError(null, res.json());
                }
                return res.json();
            }).then((res: ct.TChapterDataSet) => {
                if (isInteger(destination)) {
                    (_that.owner as ct.TTreeNode).tree.data.doChildrens();
                } else {
                    (destination as ct.TTreeChapter).expand();
                    (_that.owner as ct.TTreeChapter).chapter.expand();
                }
                callback.apply(_that.owner);
            }).catch((res: ResolveError) => {
                res.handleError();
            });
        }
    }

    export class TArticleDataSet extends ct.TDataSet {
        protected _selfData: ct.IChapterNodeData;

        public toChapter(destination: ct.TTreeChapter, callback?: Function) {
            let _that = this;

            vw.Confirm('Статья в раздел', sprintf('Вы собираетесь переместить или скопировать \n\
                статью «%s» в раздел «%s». Выберите требуемое действие.',
                _that.data.title, destination.data.data.title), {
                buttons: {
                    items: [
                        {
                            caption: 'Копировать',
                            cssClass: 'btn btn-success',
                            modalResult: 0x20
                        },
                        {
                            caption: 'Переместить',
                            cssClass: 'btn btn-warning',
                            modalResult: 0x40
                        },
                    ]
                }
            }).then((win: vw.TVirtWindow) => {
                let url: string;
                let data: {};
                switch (win.modalResult) {
                    case 0x20:
                        url = '/v1/article/copy-to-chapter?expand=relations,chapters';
                        data = {chapter: destination.data.id, article: this.id};
                        break;
                    case 0x40:
                        url = '/v1/article/move-to-chapter?expand=relations,chapters';
                        data = {
                            toChapter: destination.data.id,
                            fromChapter: (this.owner as ct.TTreeArticle).chapter.data.id,
                            article: this.id
                        };
                        break;
                }
                fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }).then((res: Response) => {
                    if (!res.ok) {
                        throw new ResolveError(null, res.json());
                    }
                    return res.json();
                }).then((res: ct.TChapterDataSet) => {
                    destination.expand();
                    (_that.owner as ct.TTreeArticle).expand();
                    callback.apply(_that.owner);
                    win.close();
                }).catch((res: ResolveError) => {
                    win.close();
                    res.handleError();
                });
            }).catch((win: vw.TVirtWindow) => {
                win.close();
            });
        }
    }
}
