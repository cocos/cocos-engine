/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 http://www.cocos.com
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

(function () {
    const EditBox = cc.EditBoxComponent;
    let KeyboardReturnType = EditBox.KeyboardReturnType;
    let InputMode = EditBox.InputMode;
    // let InputFlag = EditBox.InputFlag;
    let _p = EditBox._EditBoxImpl.prototype;

    // function getInputType(type) {
    //     switch (type) {
    //         case InputMode.EMAIL_ADDR:
    //             return 'email';
    //         case InputMode.NUMERIC:
    //         case InputMode.DECIMAL:
    //             return 'number';
    //         case InputMode.PHONE_NUMBER:
    //             return 'phone';
    //         case InputMode.URL:
    //             return 'url';
    //         case InputMode.SINGLE_LINE:
    //         case InputMode.ANY:
    //         default:
    //             return 'text';
    //     }
    // }

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

    function updateLabelsInvisible(editBox) {
        let placeholderLabel = editBox.placeholderLabel;
        let textLabel = editBox.textLabel;
        let displayText = editBox.string;

        placeholderLabel.node.active = displayText === '';
        textLabel.node.active = displayText !== '';
    }

    _p.init = function (delegate) {
        this._delegate = delegate;
    }

    _p.createInput = function () {
        let editBoxImpl = this;
        let editBox = this._delegate;
        editBoxImpl._editing = true;
        let multiline = editBox.inputMode === InputMode.ANY;
        // let inputTypeString = getInputType(editBoxImpl._inputMode);
        // if (editBoxImpl._inputFlag === InputFlag.PASSWORD)
        //     inputTypeString = 'password';

        // let rect = this._getRect();

        wuji.showKeyboard({
            defaultValue: editBox.string,
            maxLength: editBoxImpl._maxLength,
            multiple: multiline,
            confirmHold: false,
            confirmType: getKeyboardReturnType(editBox.returnType),
        });

        if (editBox) {
            editBox._editBoxEditingDidBegan();
            updateLabelsInvisible(editBox);
        }

        function onConfirm(res) {
            editBoxImpl._delegate && editBoxImpl._delegate._editBoxEditingReturn && editBoxImpl._delegate._editBoxEditingReturn();
        }
        wuji.onKeyboardConfirm(onConfirm);

        function onInput(res) {
            if (res.value.length > editBoxImpl._maxLength) {
                res.value = res.value.slice(0, editBoxImpl._maxLength);
            }
            if (editBoxImpl._delegate && editBoxImpl._delegate._editBoxTextChanged) {
                if (editBoxImpl._delegate.string !== res.value) {
                    editBoxImpl._delegate._editBoxTextChanged(res.value);
                }
            }
        }
        wuji.onKeyboardInput(onInput);

        function onComplete(res) {
            editBoxImpl.endEditing();
            wuji.offKeyboardConfirm(onConfirm);
            wuji.offKeyboardInput(onInput);
            wuji.offKeyboardComplete(onComplete);
        }
        wuji.onKeyboardComplete(onComplete);
    };

    _p.setTabIndex = function (index) {
        // not support
    };

    _p.setFocus = function () {
        this.beginEditing();
    };

    _p.isFocused = function () {
        return this._editing;
    };

    _p.stayOnTop = function (flag) {
        // not support
    };

    _p._getRect = function () {
        let node = this._delegate.node,
            scaleX = cc.view._scaleX, scaleY = cc.view._scaleY;
        let dpr = cc.view._devicePixelRatio;

        let matrix = cc.mat4();
        node.getWorldMatrix(matrix);
        let transform = node._uiProps.uiTransformComp;
        let vec3 = cc.v3();
        let width = 0;
        let height = 0;
        if (transform){
            const contentSize = transform.contentSize;
            const anchorPoint = transform.anchorPoint;
            width = contentSize.width;
            height = contentSize.height;
            vec3.x = -anchorPoint.x * width;
            vec3.y = -anchorPoint.y * height;
        }

        cc.Mat4.translate(matrix, matrix, vec3);

        scaleX /= dpr;
        scaleY /= dpr;

        let finalScaleX = matrix.m00 * scaleX;
        let finaleScaleY = matrix.m05 * scaleY;

        return {
            x: matrix.m12 * finalScaleX,
            y: matrix.m13 * finaleScaleY,
            width: width * finalScaleX,
            height: height * finaleScaleY
        };
    }

    _p.setMaxLength = function (maxLength) {
        if (!isNaN(maxLength)) {
            if (maxLength < 0) {
                //we can't set Number.MAX_VALUE to input's maxLength property
                //so we use a magic number here, it should works at most use cases.
                maxLength = 65535;
            }
            this._maxLength = maxLength;
        }
    };

    _p.beginEditing = function () {
        this.createInput();
    };

    _p.endEditing = function () {
        let self = this;
        if (this._editing) {
            // self._endEditingOnMobile();
            if (self._delegate && self._delegate._editBoxEditingDidEnded) {
                self._delegate._editBoxEditingDidEnded();
            }
        }
        this._editing = false;
    };
})();
