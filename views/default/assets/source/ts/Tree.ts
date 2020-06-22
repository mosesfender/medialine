module ct {

    export enum Events {
        EV_CHILDS_LOADED = 'childsLoaded',
    }

    export interface ITreeOptions {
        container: HTMLElement;
    }

    export class TTree extends HTMLElement {
        protected _dataset: ct.TTreeDataSet;
        protected _dragged: ct.TTreeNode;
        protected _dropTarget: ct.TTreeNode;
        protected _dropAccept: boolean;

        constructor(options?) {
            super();
            let _that = this;
            let _c = (Objects.removeVal(options, 'container') as HTMLElement);
            _c.parentNode.replaceChild(this, _c);
            this.appendChild(new ct.TTreeNodes());
            Objects.setDefinition(this, '_dataset', new ct.TTreeDataSet({owner: this, data: {}}))

            document.eventListener('dblclick', (ev: MouseEvent) => {
                let _t = ev.target as HTMLElement;
                if (_t.hasAttribute('data-caption')) {
                    ev.stopPropagation();
                    (_t.parentElement.parentElement as ct.TTreeNode).toggle();
                }
            });

            document.eventListener('click', (ev: MouseEvent) => {
                let _t = ev.target as HTMLElement;
                if (_t.tagName == 'I' && _t.closest('li[data-anc]')) {
                    ev.stopPropagation();
                    (_t.parentElement.parentElement as ct.TTreeNode).toggle();
                }
            });

            this.eventListener('dragstart', (ev: DragEvent) => {
                ev.dataTransfer.effectAllowed = "all";
                _that._dragged = ev.target as ct.TTreeNode;
            });

            this.eventListener('dragend', (ev: DragEvent) => {
                let _els = _that.querySelectorAll('li.overdrop');
                [].map.call(_els, (_el: HTMLElement) => {
                    _el.classList.remove('overdrop');
                });
            });

            this.eventListener('dragover', (ev: DragEvent) => {
                ev.preventDefault();
                ev.dataTransfer.effectAllowed = "all";
                ev.dataTransfer.dropEffect = "none";
                this._dropAccept = false;
                _that._dropTarget = (ev.target as HTMLElement).closestType(ct.TTreeNode);
                try {
                    this._dropAccept =
                        /* В статью ничего нельзя поместить */
                        !(_that._dropTarget.isArticle)
                        && !_that._dropTarget.closestElement(_that._dragged)

                        //                        && (((_that._dragged.isChapter && _that._dropTarget.isChapter)
                        //                            /* Разделы в разных деревьях */
                        //                            && !ct.comp.isSameTree(_that._dragged, _that._dropTarget)
                        //
                        //                            /* Раздел - потомок раздела, предка нельзя перемещать в своего потомка */
                        //                            || ct.comp.isChild(_that._dragged, _that._dropTarget))
                        //
                        //                            /* Статью можно перемещать в любой раздел */
                        //                            || (_that._dropTarget.isChapter && _that._dragged.isArticle))
                        ;
                } catch (err) {

                }

                if (this._dropAccept) {
                    _that._dropTarget.classList.add('overdrop');
                    ev.dataTransfer.dropEffect = "move";
                }
            });

            this.eventListener('dragleave', (ev: DragEvent) => {
                try {
                    let _over: HTMLElement = (ev.target as HTMLElement).closestType(ct.TTreeNode);
                    _over.classList.remove('overdrop');
                } catch (err) {}
            });

            this.eventListener('drop', (ev: DragEvent) => {
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

    /**
     * Утилиты для сравнения узлов
     */
    export class comp {
        /**
         * Сравнивает два узла раздела
         * @return bool true если оба узла в одном дереве
         */
        static isSameTree(first: ct.TTreeChapter | ct.TTreeNode, second: ct.TTreeChapter | ct.TTreeNode) {
            return (first.data.data as ct.IChapterNodeData).tree
                == (second.data.data as ct.IChapterNodeData).tree;
        }

        /**
         * Проверка на тот же предок
         * @return bool true если node уже и так потомок compareOf
         * @todo Продумать выяснение предка для статей. С разделами всё просто
         */
        static isSameChapter(node: ct.TTreeNode, compareOf: ct.TTreeChapter | ct.TTreeNode) {

        }

        /**
         * Сравнивает два узла раздела
         * @return bool true если node потомок compareOf
         */
        static isChild(node: ct.TTreeChapter | ct.TTreeNode, compareOf: ct.TTreeChapter | ct.TTreeNode) {
            return this.isSameTree(node, compareOf) &&
                ((node.data.data as ct.IChapterNodeData).lft > (compareOf.data.data as ct.IChapterNodeData).lft);
        }
    }
}

window.customElements.define('lever-tree', ct.TTree);