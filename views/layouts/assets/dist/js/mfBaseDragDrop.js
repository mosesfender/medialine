var mf;
(function (mf) {
    var TBaseDragDrop = (function () {
        function TBaseDragDrop(options) {
            this._canDrad = false;
            this._levers = [];
            Objects.extend(this, options);
            Objects.setDefinition(this, 'cloneDraggable', false);
            Objects.setDefinition(this, 'startDragInterval', 1);
            Objects.setDefinition(this, 'levers', this.naturalOwner);
            this._initEvents();
        }
        TBaseDragDrop.prototype.destroy = function () {
            document.eventListener(this._ev_MouseDown);
            document.eventListener(this._ev_MouseUp);
            document.eventListener(this._ev_MouseMove);
        };
        TBaseDragDrop.prototype._initEvents = function () {
            var _that = this;
            this._ev_MouseDown = this.naturalOwner.eventListener('mousedown', function (ev) {
                _that._canDrad = false;
                var _lever = _that.isDragLever(ev.target);
                setTimeout(function () {
                    if (_lever) {
                        _that._currentLever = _lever;
                        _that._ev_MouseUp = document.eventListener('mouseup', function (ev) {
                            cancelAnimationFrame(_that._rfa);
                            _that.clearDrag();
                        });
                        _that._ev_MouseMove = document.eventListener('mousemove', function (ev) {
                            if (_that._canDrad) {
                                _that._rfa = requestAnimationFrame(function () {
                                    _that.naturalOwner.style.left = ev.clientX - _that._beginOffset.x + 'px';
                                    _that.naturalOwner.style.top = ev.clientY - _that._beginOffset.y + 'px';
                                });
                            }
                        });
                        _that.startDrag(ev);
                    }
                }, _that.startDragInterval);
            });
        };
        TBaseDragDrop.prototype.startDrag = function (ev) {
            this._beginEvent = ev;
            this._beginOffset = {};
            var op = this._currentLever.offsetFrom(this.naturalOwner);
            this._beginOffset.x = op.left + ev['layerX'];
            this._beginOffset.y = op.top + ev['layerY'];
            this._canDrad = true;
        };
        TBaseDragDrop.prototype.clearDrag = function () {
            this._canDrad = false;
            document.eventListener(this._ev_MouseUp);
            document.eventListener(this._ev_MouseMove);
        };
        TBaseDragDrop.prototype.isDragLever = function (_el) {
            for (var i = 0; i < this._levers.length; i++) {
                if (_el.closestElement(this._levers[i])) {
                    return this._levers[i];
                }
            }
            return false;
        };
        Object.defineProperty(TBaseDragDrop.prototype, "levers", {
            get: function () {
                return this._levers;
            },
            set: function (val) {
                if (isString(val)) {
                    this.levers = [val];
                }
                if (val instanceof HTMLElement) {
                    this.levers = [val];
                }
                if (isArray(val)) {
                    for (var i = 0; i < val.length; i++) {
                        if (isString(val[i])) {
                            var _els = this.naturalOwner.querySelectorAll(val[i]);
                            for (var _el = 0; _el < _els.length; _el++) {
                                this._levers.push(_els[_el]);
                            }
                        }
                        else if (val[i] instanceof HTMLElement) {
                            this._levers.push(val[i]);
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TBaseDragDrop.prototype, "naturalOwner", {
            get: function () {
                return (this.owner instanceof mf.TBaseElement) ? this.owner.element : this.owner;
            },
            enumerable: true,
            configurable: true
        });
        return TBaseDragDrop;
    }());
    mf.TBaseDragDrop = TBaseDragDrop;
})(mf || (mf = {}));
