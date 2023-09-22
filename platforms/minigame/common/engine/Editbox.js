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

    function getKeyboardReturnType (type) {
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

    function MiniGameEditBoxImpl () {
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
        init (delegate) {
            if (!delegate) {
                cc.error('EditBox init failed');
                return;
            }
            this._delegate = delegate;
        },

        beginEditing () {
            // In case multiply register events
            if (this._editing) {
                return;
            }
            this._ensureKeyboardHide(() => {
                const delegate = this._delegate;
                this._showKeyboard();
                this._registerKeyboardEvent();
                this._editing = true;
                _currentEditBoxImpl = this;
                delegate._editBoxEditingDidBegan();
            });
        },

        endEditing () {
            this._hideKeyboard();
            const cbs = this._eventListeners;
            cbs.onKeyboardComplete && cbs.onKeyboardComplete();
        },

        _registerKeyboardEvent () {
            const self = this;
            const delegate = this._delegate;
            const cbs = this._eventListeners;

            cbs.onKeyboardInput = function (res) {
                if (delegate._string !== res.value) {
                    delegate._editBoxTextChanged(res.value);
                }
            };

            cbs.onKeyboardConfirm = function (res) {
                res && res.value ? delegate._editBoxEditingReturn(res.value) : delegate._editBoxEditingReturn();
                const cbs = self._eventListeners;
                cbs.onKeyboardComplete && cbs.onKeyboardComplete(res);
            };

            cbs.onKeyboardComplete = function (res) {
                self._editing = false;
                _currentEditBoxImpl = null;
                // wechat program do not have offKeyboard related callback
                if (cc.sys.platform !== cc.sys.Platform.WECHAT_MINI_PROGRAM) {
                    self._unregisterKeyboardEvent();
                }
                if (res && res.value && res.value !== delegate.string) {
                    delegate._editBoxTextChanged(res.value);
                }
                res && res.value ? delegate._editBoxEditingDidEnded(res.value) : delegate._editBoxEditingDidEnded();
            };

            __globalAdapter.onKeyboardInput(cbs.onKeyboardInput);
            __globalAdapter.onKeyboardConfirm(cbs.onKeyboardConfirm);
            __globalAdapter.onKeyboardComplete(cbs.onKeyboardComplete);
        },

        _unregisterKeyboardEvent () {
            const cbs = this._eventListeners;

            if (cbs.onKeyboardInput) {
                __globalAdapter.offKeyboardInput(cbs.onKeyboardInput);
                cbs.onKeyboardInput = null;
            }
            if (cbs.onKeyboardConfirm) {
                __globalAdapter.offKeyboardConfirm(cbs.onKeyboardConfirm);
                cbs.onKeyboardConfirm = null;
            }
            if (cbs.onKeyboardComplete) {
                __globalAdapter.offKeyboardComplete(cbs.onKeyboardComplete);
                cbs.onKeyboardComplete = null;
            }
        },

        _otherEditing () {
            return !!_currentEditBoxImpl && _currentEditBoxImpl !== this && _currentEditBoxImpl._editing;
        },

        _ensureKeyboardHide (cb) {
            const otherEditing = this._otherEditing();
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

        _showKeyboard () {
            const delegate = this._delegate;
            const multiline = (delegate.inputMode === EditBoxComp.InputMode.ANY);
            __globalAdapter.showKeyboard({
                defaultValue: delegate.string,
                maxLength: delegate.maxLength < 0 ? MAX_VALUE : delegate.maxLength,
                multiple: multiline,
                confirmHold: false,
                confirmType: getKeyboardReturnType(delegate.returnType),
                success (res) {

                },
                fail (res) {
                    cc.warn(res.errMsg);
                },
            });
        },

        _hideKeyboard () {
            __globalAdapter.hideKeyboard({
                success (res) {

                },
                fail (res) {
                    cc.warn(res.errMsg);
                },
            });
        },
    });
}());
