let tree: ct.TTree;

document.eventListener('DOMContentLoaded', () => {

    tree = new ct.TTree({
        container: document.querySelector('#tree'),
    });

    tree.eventListener('contextmenu', (ev: MouseEvent) => {
        ev.preventDefault();
        let _cmo: cm.IContextMenuOptions;

        if (ev.target instanceof ct.TTree) {
            _cmo = {
                event: ev,
                items: [
                    {
                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                        caption: 'Создать раздел в корне',
                        action: () => {
                            forms.chapterForm(true)
                                .then((win: vw.TVirtWindow) => {
                                    let form: HTMLFormElement = getContent(win).querySelector('form#chapter_form');
                                    fetch('/v1/chapter/create', {
                                        method: 'POST',
                                        headers: {
                                            'Content-type': 'application/json',
                                        },
                                        body: JSON.stringify(serialize(form)),
                                    }).then((res: Response) => {
                                        return res.json();
                                    }).then((res: ct.IChapterNodeData) => {
                                        tree.data.doChildrens();
                                    });
                                    win.close();
                                });
                        }
                    },
                ]
            };
        }

        let li = (ev.target as HTMLElement).closest('li');

        if (li instanceof ct.TTreeChapter) {
            _cmo = {
                event: ev,
                items: [
                    {
                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                        caption: 'Переместить в корень',
                        action: () => {
                            ((ev.target as HTMLElement).closestType(ct.TTreeChapter) as ct.TTreeChapter).transfer(0);
                        }
                    },
                    {
                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                        caption: 'Создать раздел',
                        action: () => {
                            forms.chapterForm(true, li as ct.TTreeChapter)
                                .then((win: vw.TVirtWindow) => {
                                    let form: HTMLFormElement = getContent(win).querySelector('form#chapter_form');
                                    fetch('/v1/chapter/create', {
                                        method: 'POST',
                                        headers: {
                                            'Content-type': 'application/json',
                                        },
                                        body: JSON.stringify(serialize(form)),
                                    }).then((res: Response) => {
                                        return res.json();
                                    }).then((res: ct.IChapterNodeData) => {
                                        (li as ct.TTreeChapter).expand();
                                    });
                                    win.close();
                                });
                        }
                    },
                    {
                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                        caption: 'Изменить',
                        action: () => {
                            forms.chapterForm(false, li as ct.TTreeChapter)
                                .then((win: vw.TVirtWindow) => {
                                    let form: HTMLFormElement = getContent(win).querySelector('form#chapter_form');
                                    fetch('/v1/chapter/update', {
                                        method: 'PATCH',
                                        headers: {
                                            'Content-type': 'application/json',
                                        },
                                        body: JSON.stringify(serialize(form)),
                                    }).then((res: Response) => {
                                        return res.json();
                                    }).then((res: ct.IChapterNodeData) => {
                                        (li as ct.TTreeChapter).data.data = res;
                                    });
                                    win.close();
                                });
                        }
                    },
                    {
                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                        caption: 'Создать статью',
                        action: () => {
                            forms.articleForm(true, null, li as ct.TTreeChapter)
                                .then((win: vw.TVirtWindow) => {
                                    let form: HTMLFormElement = getContent(win).querySelector('form#article_form');
                                    fetch('/v1/article/create', {
                                        method: 'POST',
                                        headers: {
                                            'Content-type': 'application/json',
                                        },
                                        body: JSON.stringify(serialize(form)),
                                    }).then((res: Response) => {
                                        return res.json();
                                    }).then((res: ct.IChapterNodeData) => {
                                        (li as ct.TTreeChapter).expand();
                                        win.close();
                                    });
                                });
                        }
                    },
                    //                    {
                    //                        type: cm.TContextMenuItemType.ITEM_SEPARATOR,
                    //                    },
                    //                    {
                    //                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                    //                        caption: 'Удалить',
                    //                        action: () => {
                    //
                    //                        }
                    //                    },
                ]
            }
        }

        if (li instanceof ct.TTreeArticle) {
            _cmo = {
                event: ev,
                items: [
                    {
                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                        caption: 'Изменить',
                        action: () => {
                            forms.articleForm(false, li as ct.TTreeArticle)
                                .then((win: vw.TVirtWindow) => {
                                    let form: HTMLFormElement = getContent(win).querySelector('form#article_form');
                                    fetch('/v1/article/update', {
                                        method: 'PATCH',
                                        headers: {
                                            'Content-type': 'application/json',
                                        },
                                        body: JSON.stringify(serialize(form)),
                                    }).then((res: Response) => {
                                        return res.json();
                                    }).then((res: ct.IChapterNodeData) => {
                                        (li as ct.TTreeChapter).data.data = res;
                                    });
                                    win.close();
                                });
                        }
                    },
                    //                    {
                    //                        type: cm.TContextMenuItemType.ITEM_SEPARATOR,
                    //                    },
                    //                    {
                    //                        type: cm.TContextMenuItemType.ITEM_BUTTON,
                    //                        caption: 'Удалить',
                    //                        action: () => {
                    //
                    //                        }
                    //                    },
                ]
            }
        }

        let _cm = cm.ContextMenu(_cmo);
    });

});

let getContent = function (win: vw.TVirtWindow) {
    return win.querySelector('iframe').contentDocument;
}

let serialize = function (form: HTMLFormElement) {
    let ret = {};
    form.fields.list.forEach((_field: HTMLFormField) => {
        ret[_field.cleanName] = _field.value;
    });
    return ret;
}

class forms {
    static chapterForm(create: boolean, chapter?: ct.TTreeChapter) {

        let _b = {};
        try {
            if (create) {
                _b['parent_id'] = chapter.data.id || '';
            } else {
                _b['chapter'] = chapter.data.id || '';
            }
        } catch (err) {

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

        w.catch((win: vw.TVirtWindow) => {
            win.close();
        });

        return w;
    }

    static articleForm(create: boolean, article?: ct.TTreeArticle, chapter?: ct.TTreeChapter) {

        let _b = {};
        try {
            if (create) {
                _b['chapter'] = chapter.data.id || '';
            } else {
                _b['article'] = article.data.id || ''
            }
        } catch (err) {

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

        w.catch((win: vw.TVirtWindow) => {
            win.close();
        });

        return w;
    }
}