(function () {
    if (!(cc && cc.internal && cc.internal.EditBox)) {
        return;
    }

    const EditBoxComp = cc.internal.EditBox;
    const js = cc.js;
    const KeyboardReturnType = EditBoxComp.KeyboardReturnType;
    const MAX_VALUE = 65535;
    const KEYBOARD_HIDE_TIME = 600;
    let _hideKeyboardTimeout = null;
    let _currentEditBoxImpl = null;

    function getKeyboardReturnType(type) {
        switch (type) {
            case KeyboardReturnType.DEFAULT:
            case KeyboardReturnType.DONE:
                return 'done';
            case KeyboardReturnType.SEND:
                return 'send';
            case KeyboardReturnType.SEARCH:
                return 'search';
            case KeyboardReturnType.GO:
                return 'go';
            case KeyboardReturnType.NEXT:
                return 'next';
        }
        return 'done';
    }

    function MiniGameEditBoxImpl() {
        this._delegate = null;
        this._editing = false;

        this._eventListeners = {
            onKeyboardInput: null,
            onKeyboardConfirm: null,
            onKeyboardComplete: null,
        };
    }

    js.extend(MiniGameEditBoxImpl, EditBoxComp._EditBoxImpl);
    EditBoxComp._EditBoxImpl = MiniGameEditBoxImpl;

    Object.assign(MiniGameEditBoxImpl.prototype, {
        init(delegate) {
            if (!delegate) {
                cc.error('EditBox init failed');
                return;
            }
            this._delegate = delegate;
        },

        beginEditing() {
            // In case multiply register events
            if (this._editing) {
                return;
            }
            this._ensureKeyboardHide(() => {
                let delegate = this._delegate;
                this._showKeyboard();
                this._registerKeyboardEvent();
                this._editing = true;
                _currentEditBoxImpl = this;
                delegate._editBoxEditingDidBegan();
            });
        },

        endEditing() {
            this._hideKeyboard();
            let cbs = this._eventListeners;
            cbs.onKeyboardComplete && cbs.onKeyboardComplete();
        },

        _registerKeyboardEvent() {
            let self = this;
            let delegate = this._delegate;
            let cbs = this._eventListeners;

            cbs.onKeyboardInput = function (res) {
                if (delegate._string !== res.value) {
                    delegate._editBoxTextChanged(res.value);
                }
            }

            cbs.onKeyboardConfirm = function (res) {
                delegate._editBoxEditingReturn();
                let cbs = self._eventListeners;
                cbs.onKeyboardComplete && cbs.onKeyboardComplete();
            }

            cbs.onKeyboardComplete = function () {
                self._editing = false;
                _currentEditBoxImpl = null;
                self._unregisterKeyboardEvent();
                delegate._editBoxEditingDidEnded();
            }

            ral.onKeyboardInput(cbs.onKeyboardInput);
            ral.onKeyboardConfirm(cbs.onKeyboardConfirm);
            ral.onKeyboardComplete(cbs.onKeyboardComplete);
        },

        _unregisterKeyboardEvent() {
            let cbs = this._eventListeners;

            if (cbs.onKeyboardInput) {
                ral.offKeyboardInput(cbs.onKeyboardInput);
                cbs.onKeyboardInput = null;
            }
            if (cbs.onKeyboardConfirm) {
                ral.offKeyboardConfirm(cbs.onKeyboardConfirm);
                cbs.onKeyboardConfirm = null;
            }
            if (cbs.onKeyboardComplete) {
                ral.offKeyboardComplete(cbs.onKeyboardComplete);
                cbs.onKeyboardComplete = null;
            }
        },

        _otherEditing() {
            return !!_currentEditBoxImpl && _currentEditBoxImpl !== this && _currentEditBoxImpl._editing;
        },

        _ensureKeyboardHide(cb) {
            let otherEditing = this._otherEditing();
            if (!otherEditing && !_hideKeyboardTimeout) {
                return cb();
            }
            if (_hideKeyboardTimeout) {
                clearTimeout(_hideKeyboardTimeout);
            }
            if (otherEditing) {
                _currentEditBoxImpl.endEditing();
            }
            _hideKeyboardTimeout = setTimeout(() => {
                _hideKeyboardTimeout = null;
                cb();
            }, KEYBOARD_HIDE_TIME);
        },

        _showKeyboard() {
            let delegate = this._delegate;
            let multiline = (delegate.inputMode === EditBoxComp.InputMode.ANY);
            ral.showKeyboard({
                defaultValue: delegate.string,
                maxLength: delegate.maxLength < 0 ? MAX_VALUE : delegate.maxLength,
                multiple: multiline,
                confirmHold: false,
                confirmType: getKeyboardReturnType(delegate.returnType),
                success(res) {

                },
                fail(res) {
                    cc.warn(res.errMsg);
                }
            });
        },

        _hideKeyboard() {
            ral.hideKeyboard({
                success(res) {

                },
                fail(res) {
                    cc.warn(res.errMsg);
                },
            });
        },
    });
})();

