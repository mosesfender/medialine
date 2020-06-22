class ResolveError extends Error {
    constructor(message, data) {
        super(message);
        this.data = data;
        this.name = 'ResolveError';
    }
    handleError() {
        this.data.then((err) => {
            vw.Alert('Ошибка', sprintf('[%s, %s] %s', err.code, err.line, err.message));
        });
    }
}
var ct;
(function (ct) {
    class TDataSet {
        constructor(options) {
            this.init(options);
        }
        init(options) {
            Object.assign(this, options);
        }
        doSelfData() {
        }
        doChildrens() {
            let _that = this;
            fetch(Objects.compileGetUrl('/v1/chapter/leaves', { id: this.id }))
                .then((res) => {
                if (!res.ok) {
                    throw new ResolveError(null, res.json());
                }
                return res.json();
            })
                .then((res) => {
                _that.owner.nodes.renderChildren(res);
            })
                .catch((res) => {
                res.handleError();
            });
        }
        get data() {
            return this._selfData;
        }
        set data(val) {
            this._selfData = val;
            if (this.owner._caption) {
                this.owner.caption = this._selfData.title;
            }
        }
        get id() {
            return this.data.id || null;
        }
    }
    ct.TDataSet = TDataSet;
    class TTreeDataSet extends ct.TDataSet {
        constructor(options) {
            super(options);
        }
        init(options) {
            Object.assign(this, options);
        }
    }
    ct.TTreeDataSet = TTreeDataSet;
    class TChapterDataSet extends ct.TDataSet {
        moveToChapter(destination, callback) {
            let _that = this;
            fetch('/v1/chapter/move-to-chapter', {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    chapter: this.id,
                    toChapter: isInteger(destination) ? 0 : destination.data.id,
                }),
            }).then((res) => {
                if (!res.ok) {
                    throw new ResolveError(null, res.json());
                }
                return res.json();
            }).then((res) => {
                if (isInteger(destination)) {
                    _that.owner.tree.data.doChildrens();
                }
                else {
                    destination.expand();
                    _that.owner.chapter.expand();
                }
                callback.apply(_that.owner);
            }).catch((res) => {
                res.handleError();
            });
        }
    }
    ct.TChapterDataSet = TChapterDataSet;
    class TArticleDataSet extends ct.TDataSet {
        toChapter(destination, callback) {
            let _that = this;
            vw.Confirm('Статья в раздел', sprintf('Вы собираетесь переместить или скопировать \n\
                статью «%s» в раздел «%s». Выберите требуемое действие.', _that.data.title, destination.data.data.title), {
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
            }).then((win) => {
                let url;
                let data;
                switch (win.modalResult) {
                    case 0x20:
                        url = '/v1/article/copy-to-chapter?expand=relations,chapters';
                        data = { chapter: destination.data.id, article: this.id };
                        break;
                    case 0x40:
                        url = '/v1/article/move-to-chapter?expand=relations,chapters';
                        data = {
                            toChapter: destination.data.id,
                            fromChapter: this.owner.chapter.data.id,
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
                }).then((res) => {
                    if (!res.ok) {
                        throw new ResolveError(null, res.json());
                    }
                    return res.json();
                }).then((res) => {
                    destination.expand();
                    _that.owner.expand();
                    callback.apply(_that.owner);
                    win.close();
                }).catch((res) => {
                    win.close();
                    res.handleError();
                });
            }).catch((win) => {
                win.close();
            });
        }
    }
    ct.TArticleDataSet = TArticleDataSet;
})(ct || (ct = {}));
var ct;
(function (ct) {
    let Events;
    (function (Events) {
        Events["EV_CHILDS_LOADED"] = "childsLoaded";
    })(Events = ct.Events || (ct.Events = {}));
    class TTree extends HTMLElement {
        constructor(options) {
            super();
            let _that = this;
            let _c = Objects.removeVal(options, 'container');
            _c.parentNode.replaceChild(this, _c);
            this.appendChild(new ct.TTreeNodes());
            Objects.setDefinition(this, '_dataset', new ct.TTreeDataSet({ owner: this, data: {} }));
            document.eventListener('dblclick', (ev) => {
                let _t = ev.target;
                if (_t.hasAttribute('data-caption')) {
                    ev.stopPropagation();
                    _t.parentElement.parentElement.toggle();
                }
            });
            document.eventListener('click', (ev) => {
                let _t = ev.target;
                if (_t.tagName == 'I' && _t.closest('li[data-anc]')) {
                    ev.stopPropagation();
                    _t.parentElement.parentElement.toggle();
                }
            });
            this.eventListener('dragstart', (ev) => {
                ev.dataTransfer.effectAllowed = "all";
                _that._dragged = ev.target;
            });
            this.eventListener('dragend', (ev) => {
                let _els = _that.querySelectorAll('li.overdrop');
                [].map.call(_els, (_el) => {
                    _el.classList.remove('overdrop');
                });
            });
            this.eventListener('dragover', (ev) => {
                ev.preventDefault();
                ev.dataTransfer.effectAllowed = "all";
                ev.dataTransfer.dropEffect = "none";
                this._dropAccept = false;
                _that._dropTarget = ev.target.closestType(ct.TTreeNode);
                try {
                    this._dropAccept =
                        !(_that._dropTarget.isArticle)
                            && !_that._dropTarget.closestElement(_that._dragged);
                }
                catch (err) {
                }
                if (this._dropAccept) {
                    _that._dropTarget.classList.add('overdrop');
                    ev.dataTransfer.dropEffect = "move";
                }
            });
            this.eventListener('dragleave', (ev) => {
                try {
                    let _over = ev.target.closestType(ct.TTreeNode);
                    _over.classList.remove('overdrop');
                }
                catch (err) { }
            });
            this.eventListener('drop', (ev) => {
                _that._dragged.transfer(_that._dropTarget);
            });
            this._dataset.doChildrens();
        }
        get nodes() {
            return this.querySelector('ul');
        }
        get data() {
            return this._dataset;
        }
    }
    ct.TTree = TTree;
    class comp {
        static isSameTree(first, second) {
            return first.data.data.tree
                == second.data.data.tree;
        }
        static isSameChapter(node, compareOf) {
        }
        static isChild(node, compareOf) {
            return this.isSameTree(node, compareOf) &&
                (node.data.data.lft > compareOf.data.data.lft);
        }
    }
    ct.comp = comp;
})(ct || (ct = {}));
window.customElements.define('lever-tree', ct.TTree);
var ct;
(function (ct) {
    class TTreeNodes extends HTMLUListElement {
        constructor(options) {
            super();
        }
        renderChildren(data) {
            this.innerHTML = '';
            for (let i = 0; i < data.chapters.length; i++) {
                this.appendChild(new ct.TTreeChapter(data.chapters[i]));
            }
            for (let i = 0; i < data.articles.length; i++) {
                this.appendChild(new ct.TTreeArticle(data.articles[i]));
            }
        }
        clear() {
            let _that = this;
            [].map.call(this.children, (_el) => {
                _that.removeChild(_el);
            });
        }
    }
    ct.TTreeNodes = TTreeNodes;
})(ct || (ct = {}));
window.customElements.define('tree-nodes', ct.TTreeNodes, { extends: 'ul' });
var ct;
(function (ct) {
    class TTreeNode extends HTMLLIElement {
        constructor(options) {
            super();
            Objects.setDefinition(this, 'busy', false);
            this.draggable = true;
            this.init(options);
            this.collapse();
            this.render();
            this.appendChild(new ct.TTreeNodes());
        }
        init(options) {
        }
        render() {
            this._selfContainer = Html.createElementEx('div', this);
            this._expander = Html.createElementEx('i', this._selfContainer);
            this._icon = Html.createElementEx('em', this._selfContainer);
            this._caption = Html.createElementEx('span', this._selfContainer, { 'data-caption': '' }, this._dataset.data.title);
        }
        toggle() {
            if (this._expanded) {
                this.collapse();
            }
            else {
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
        transfer(toNode) {
        }
        get tree() {
            return this.closestType(ct.TTree);
        }
        get nodes() {
            return this.querySelector('ul');
        }
        get data() {
            return this._dataset;
        }
        get chapter() {
            return this.parentElement.parentElement;
        }
        set caption(val) {
            this._caption.innerHTML = val;
        }
        get isChapter() {
            return this instanceof ct.TTreeChapter;
        }
        get isArticle() {
            return this instanceof ct.TTreeArticle;
        }
    }
    ct.TTreeNode = TTreeNode;
})(ct || (ct = {}));
var ct;
(function (ct) {
    class TTreeChapter extends ct.TTreeNode {
        constructor(options) {
            super(options);
        }
        init(options) {
            this._dataset = new ct.TChapterDataSet({
                owner: this,
                data: options,
            });
        }
        render() {
            super.render();
            this.setAttribute('data-anc', 'chapter');
        }
        transfer(toNode) {
            this.data.moveToChapter(toNode);
        }
    }
    ct.TTreeChapter = TTreeChapter;
})(ct || (ct = {}));
window.customElements.define('tree-article', ct.TTreeChapter, { extends: 'li' });
var ct;
(function (ct) {
    class TTreeArticle extends ct.TTreeNode {
        constructor(options) {
            super(options);
        }
        init(options) {
            this._dataset = new ct.TArticleDataSet({
                owner: this,
                data: options,
            });
        }
        render() {
            super.render();
            this.setAttribute('data-anc', 'article');
        }
        expand() {
            return false;
        }
        collapse() {
            return false;
        }
        transfer(toNode) {
            this.data.toChapter(toNode);
        }
    }
    ct.TTreeArticle = TTreeArticle;
})(ct || (ct = {}));
window.customElements.define('tree-chapter', ct.TTreeArticle, { extends: 'li' });
let tree;
document.eventListener('DOMContentLoaded', () => {
    tree = new ct.TTree({
        container: document.querySelector('#tree'),
    });
    tree.eventListener('contextmenu', (ev) => {
        ev.preventDefault();
        let _cmo;
        if (ev.target instanceof ct.TTree) {
            _cmo = {
                event: ev,
                items: [
                    {
                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                        caption: 'Создать раздел в корне',
                        action: () => {
                            forms.chapterForm(true)
                                .then((win) => {
                                let form = getContent(win).querySelector('form#chapter_form');
                                fetch('/v1/chapter/create', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json',
                                    },
                                    body: JSON.stringify(serialize(form)),
                                }).then((res) => {
                                    return res.json();
                                }).then((res) => {
                                    tree.data.doChildrens();
                                });
                                win.close();
                            });
                        }
                    },
                ]
            };
        }
        let li = ev.target.closest('li');
        if (li instanceof ct.TTreeChapter) {
            _cmo = {
                event: ev,
                items: [
                    {
                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                        caption: 'Переместить в корень',
                        action: () => {
                            ev.target.closestType(ct.TTreeChapter).transfer(0);
                        }
                    },
                    {
                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                        caption: 'Создать раздел',
                        action: () => {
                            forms.chapterForm(true, li)
                                .then((win) => {
                                let form = getContent(win).querySelector('form#chapter_form');
                                fetch('/v1/chapter/create', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json',
                                    },
                                    body: JSON.stringify(serialize(form)),
                                }).then((res) => {
                                    return res.json();
                                }).then((res) => {
                                    li.expand();
                                });
                                win.close();
                            });
                        }
                    },
                    {
                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                        caption: 'Изменить',
                        action: () => {
                            forms.chapterForm(false, li)
                                .then((win) => {
                                let form = getContent(win).querySelector('form#chapter_form');
                                fetch('/v1/chapter/update', {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-type': 'application/json',
                                    },
                                    body: JSON.stringify(serialize(form)),
                                }).then((res) => {
                                    return res.json();
                                }).then((res) => {
                                    li.data.data = res;
                                });
                                win.close();
                            });
                        }
                    },
                    {
                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                        caption: 'Создать статью',
                        action: () => {
                            forms.articleForm(true, null, li)
                                .then((win) => {
                                let form = getContent(win).querySelector('form#article_form');
                                fetch('/v1/article/create', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json',
                                    },
                                    body: JSON.stringify(serialize(form)),
                                }).then((res) => {
                                    return res.json();
                                }).then((res) => {
                                    li.expand();
                                    win.close();
                                });
                            });
                        }
                    },
                ]
            };
        }
        if (li instanceof ct.TTreeArticle) {
            _cmo = {
                event: ev,
                items: [
                    {
                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                        caption: 'Изменить',
                        action: () => {
                            forms.articleForm(false, li)
                                .then((win) => {
                                let form = getContent(win).querySelector('form#article_form');
                                fetch('/v1/article/update', {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-type': 'application/json',
                                    },
                                    body: JSON.stringify(serialize(form)),
                                }).then((res) => {
                                    return res.json();
                                }).then((res) => {
                                    li.data.data = res;
                                });
                                win.close();
                            });
                        }
                    },
                ]
            };
        }
        let _cm = cm.ContextMenu(_cmo);
    });
});
let getContent = function (win) {
    return win.querySelector('iframe').contentDocument;
};
let serialize = function (form) {
    let ret = {};
    form.fields.list.forEach((_field) => {
        ret[_field.cleanName] = _field.value;
    });
    return ret;
};
class forms {
    static chapterForm(create, chapter) {
        let _b = {};
        try {
            if (create) {
                _b['parent_id'] = chapter.data.id || '';
            }
            else {
                _b['chapter'] = chapter.data.id || '';
            }
        }
        catch (err) {
        }
        let w = VirtualWindow({
            oid: 'chapter',
            dimentionsByContent: true,
            showCloseButton: true,
            drag: true,
            modal: true,
            sizeable: true,
            showOnOpen: false,
            caption: create ? 'Новый раздел' : 'Редактирование раздела',
            content: {
                class: vw.TVWFrameContent,
                src: Objects.compileGetUrl('/v1/chapter/chapter-form', _b),
            },
            bounds: {
                position: vw.TBoundsPosition.POS_STORAGE | vw.TBoundsPosition.POS_CENTER,
            },
            buttons: {
                align: vw.TButtonsAlignment.ALIGN_RIGHT,
                items: [
                    {
                        caption: 'Сохранить',
                        cssClass: 'btn btn-success',
                        modalResult: vw.TModalResult.mrOk
                    },
                    {
                        caption: 'Отмена',
                        cssClass: 'btn btn-danger',
                        modalResult: vw.TModalResult.mrClose
                    },
                ]
            },
        });
        w.catch((win) => {
            win.close();
        });
        return w;
    }
    static articleForm(create, article, chapter) {
        let _b = {};
        try {
            if (create) {
                _b['chapter'] = chapter.data.id || '';
            }
            else {
                _b['article'] = article.data.id || '';
            }
        }
        catch (err) {
        }
        let w = VirtualWindow({
            oid: 'article',
            dimentionsByContent: true,
            showCloseButton: true,
            drag: true,
            modal: true,
            sizeable: true,
            showOnOpen: false,
            caption: create ? 'Новая статья' : 'Редактирование статьи',
            content: {
                class: vw.TVWFrameContent,
                src: Objects.compileGetUrl('/v1/article/article-form', _b),
            },
            bounds: {
                position: vw.TBoundsPosition.POS_STORAGE | vw.TBoundsPosition.POS_CENTER,
            },
            buttons: {
                align: vw.TButtonsAlignment.ALIGN_RIGHT,
                items: [
                    {
                        caption: 'Сохранить',
                        cssClass: 'btn btn-success',
                        modalResult: vw.TModalResult.mrOk
                    },
                    {
                        caption: 'Отмена',
                        cssClass: 'btn btn-danger',
                        modalResult: vw.TModalResult.mrClose
                    },
                ]
            },
        });
        w.catch((win) => {
            win.close();
        });
        return w;
    }
}
