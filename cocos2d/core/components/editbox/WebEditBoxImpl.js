/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const WebInput = require('./WebInput');
const EditBox = cc.EditBox;
const js = cc.js;

const Types = require('./types');
const InputMode = Types.InputMode;
const InputFlag = Types.InputFlag;
const KeyboardReturnType = Types.KeyboardReturnType;

function WebEditBoxImpl () {
    this._webInput = null;
}

js.extend(WebEditBoxImpl, EditBox._EditBoxImpl);
EditBox._EditBoxImpl = WebEditBoxImpl;

Object.assign(WebEditBoxImpl.prototype, {
    init (delegate) {
        if (!delegate) {
            return;
        }

        this._delegate = delegate;

        if (delegate.inputMode === InputMode.ANY) {
            this._webInput = WebInput.createAsTextArea(delegate);
        }
        else {
            this._webInput = WebInput.createAsInput(delegate);
        }

        this._registerEventListeners();
    },

    onEnable () {
        this._webInput.enable();
    },

    onDisable () {
        this._webInput.disable();
    },

    onDestroy () {
        this._webInput.offAllEvents();
        this._webInput.destroy();
        delete this._delegate;
        delete this._webInput;
    },

    update () {
        this._webInput.updateMatrix();
    },

    setTabIndex (index) {
        this._webInput.setTabIndex(index);
    },

    setSize (width, height) {
        this._webInput.setSize(width, height);
    },

    setFocus (value) {
        if (value) {
            this._showWebInput();
        }
        else {
            this._hideWebInput();
        }
    },

    isFocused () {
        return this._webInput.editing;
    },

    beginEditing () {
        this._delegate.editBoxEditingDidBegan();  
        this._showWebInput();
    },

    endEditing () {
        this._delegate.editBoxEditingDidEnded();
        this._hideWebInput();
    },

    _showWebInput () {
        this._webInput.show();
        this._delegate._hideLabels();
    },

    _hideWebInput () {
        this._webInput.hide();
        this._delegate._showLabels();
    },

    _registerEventListeners () {
        let self = this;

        this._webInput.onInput(function (res) {
            self._delegate.editBoxTextChanged(res);
        });

        this._webInput.onFocus(function () {
            self.beginEditing();
        });

        this._webInput.onConfirm(function () {
            self._delegate.editBoxEditingReturn();
        });

        this._webInput.onComplete(function () {
            self.endEditing();
        });
    },
});

