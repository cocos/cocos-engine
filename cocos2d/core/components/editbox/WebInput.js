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

const utils = require('../../platform/utils');
const macro = require('../../platform/CCMacro');
const Types = require('./types');
const InputMode = Types.InputMode;
const InputFlag = Types.InputFlag;
const KeyboardReturnType = Types.KeyboardReturnType;
const math = cc.vmath;

// https://segmentfault.com/q/1010000002914610
const DELAY_TIME = 400;
const SCROLLY = 40;
const LEFT_PADDING = 2;

// polyfill
let polyfill = {
    zoomInvalid: false
};

if (cc.sys.OS_ANDROID === cc.sys.os &&
    (cc.sys.browserType === cc.sys.BROWSER_TYPE_SOUGOU ||
    cc.sys.browserType === cc.sys.BROWSER_TYPE_360)) {
    polyfill.zoomInvalid = true;
}

 // private static property
 let _webInputCount = 0;
 let _vec3 = cc.v3();
 let _currentWebInput = null;

 function WebInput () {
    this._domId = ++_webInputCount;
    this._delegate = null;
    this._elem = null;
    this._inputLock = false;
    this.editing = false;

    // callbacks
    this._focusCbs = [];
    this._inputCbs = [];
    this._confirmCbs = [];
    this._completeCbs = [];
    // private callbacks
    this._compositionStartCb = null;
    this._compositionEndCb = null;
    this._clickCb = null;
    this._confirm2CompleteCbs = null;  // confirm event need to call complete callbacks too, if webInput is not textArea

    // on mobile
    this._fullscreen = false;
    this._autoResize = false;

    // matrix
    this._worldMat = math.mat4.create();
    this._cameraMat = math.mat4.create();
    // matrix cache
    this._m00 = 0;
    this._m01 = 0;
    this._m04 = 0;
    this._m05 = 0;
    this._m12 = 0;
    this._m13 = 0;
    this._w = 0;
    this._h = 0;

    // inputType cache
    this._inputMode = null;
    this._inputFlag = null;
    this._returnType = null;
 }

 // static mathods
 function createAsInput (delegate) {
    let inst = new WebInput();
    inst._elem = document.createElement('input');
    inst._init(delegate);

    return inst;
 }

 function createAsTextArea (delegate) {
     let inst = new WebInput();
     inst._elem = document.createElement('textarea');
     inst._init(delegate);

     return inst;
 }

 // methods
 Object.assign(WebInput.prototype, {
    _init (delegate) {
        this._delegate = delegate;
        
        this.setTabIndex(delegate.tabIndex);
        this._initStyleSheet();
        this._addPrivateEventListeners();
        this._addToGameContainer();
    },

    _addToGameContainer () {
        cc.game.container.appendChild(this._elem);
    },

    _removeFromGameContainer () {
        let hasChild = utils.contains(cc.game.container, this._elem);
        if (hasChild) {
            cc.game.container.removeChild(this._elem);
        }

        delete this._elem;
    },

    enable () {
        this._elem.style.disaplay = '';
    },

    disable () {
        this._elem.style.disaplay = 'none';
    },

    destroy () {
        delete this._delegate;
        this._removePrivateEventListeners();
        this._removeFromGameContainer();
    },

    show () {
        this._updateMaxLength();
        this._updateInputType();
        this._updateStyleSheet();
        
        this.editing = true;
        this._elem.style.opacity = 1;
        
        if (cc.sys.isMobile) {
            this._showOnMobile();
        }
    },
    
    hide () {
        let input = this._elem;
        this.editing = false;
        input.style.opacity = 0;
        input.blur();
        
        if (cc.sys.isMobile) {
            this._hideOnMobile();
        }
    },

    _showOnMobile () {    
        if (cc.view.isAutoFullScreenEnabled()) {
            this._fullscreen = true;
            cc.view.enableAutoFullScreen(false);
            cc.screen.exitFullScreen();
        } else {
            this._fullscreen = false;
        }
        this._autoResize = cc.view._resizeWithBrowserSize;
        cc.view.resizeWithBrowserSize(false);

        _currentWebInput = this;

        this._adjustViewOnMobile();
    },

    // Called after keyboard disappeared to readapte the game view
    _hideOnMobile () {
        cc.view.enableAutoFullScreen(this._fullscreen);
        cc.view.resizeWithBrowserSize(this._autoResize);

        this._currentWebInput = null;

        // Wait if there is another editBox to focus. 
        // Scroll to the original position if there is not anyone.
        // Otherwise, readjust view to the new focused editBox.
        setTimeout(function () {
            if (!_currentWebInput) {
                window.scrollTo(0, 0);
            }
            else {
                _currentWebInput._adjustViewOnMobile();
            }
        }, DELAY_TIME);
    },

    isTextArea () {
        return (this._elem instanceof HTMLTextAreaElement);
    },

    setTabIndex (value) {
        this._elem.tabIndex = value;
    },

    setSize (width, height) {
        let input = this._elem;
        input.style.width = width + 'px';
        input.style.height = height + 'px';
    },

    updateMatrix () {    
        let node = this._delegate.node;    
        node.getWorldMatrix(this._worldMat);
        let worldMat = this._worldMat;

        // check whether need to update
        if (this._m00 === worldMat.m00 && this._m01 === worldMat.m01 &&
            this._m04 === worldMat.m04 && this._m05 === worldMat.m05 &&
            this._m12 === worldMat.m12 && this._m13 === worldMat.m13 &&
            this._w === node._contentSize.width && this._h === node._contentSize.height) {
            return;
        }

        // update matrix cache
        this._m00 = worldMat.m00;
        this._m01 = worldMat.m01;
        this._m04 = worldMat.m04;
        this._m05 = worldMat.m05;
        this._m12 = worldMat.m12;
        this._m13 = worldMat.m13;
        this._w = node._contentSize.width;
        this._h = node._contentSize.height;

        let scaleX = cc.view._scaleX, scaleY = cc.view._scaleY,
            viewport = cc.view._viewportRect,
            dpr = cc.view._devicePixelRatio;

        _vec3.x = -node._anchorPoint.x * this._w;
        _vec3.y = -node._anchorPoint.y * this._h;
    
        math.mat4.translate(worldMat, worldMat, _vec3);

        // can't find camera in editor
        let cameraMat;
        if (CC_EDITOR) {
            cameraMat = this._cameraMat = worldMat;
        }
        else {
            let camera = cc.Camera.findCamera(node);
            camera.getWorldToCameraMatrix(this._cameraMat);
            cameraMat = this._cameraMat;
            math.mat4.mul(cameraMat, cameraMat, worldMat);
        }
        
    
        scaleX /= dpr;
        scaleY /= dpr;
    
        let container = cc.game.container;
        let a = cameraMat.m00 * scaleX, b = cameraMat.m01, c = cameraMat.m04, d = cameraMat.m05 * scaleY;
    
        let offsetX = container && container.style.paddingLeft && parseInt(container.style.paddingLeft);
        offsetX += viewport.x / dpr;
        let offsetY = container && container.style.paddingBottom && parseInt(container.style.paddingBottom);
        offsetY += viewport.y / dpr;
        let tx = cameraMat.m12 * scaleX + offsetX, ty = cameraMat.m13 * scaleY + offsetY;
    
        if (polyfill.zoomInvalid) {
            this.setSize(node.width * a, node.height * d);
            a = 1;
            d = 1;
        }
    
        let input = this._elem;
        let matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
        input.style['transform'] = matrix;
        input.style['-webkit-transform'] = matrix;
        input.style['transform-origin'] = '0px 100% 0px';
        input.style['-webkit-transform-origin'] = '0px 100% 0px';
    },

    // ===========================================
    // input type and max length
    _updateInputType () {
        let delegate = this._delegate,
            inputMode = delegate.inputMode,
            inputFlag = delegate.inputFlag,
            returnType = delegate.returnType,
            input = this._elem;

        // whether need to update
        if (this._inputMode === inputMode &&
            this._inputFlag === inputFlag &&
            this._returnType === returnType) {
            return;
        }

        // update cache
        this._inputMode = inputMode;
        this._inputFlag = inputFlag;
        this._returnType = returnType;
    
        // begin to updateInputType
        if (inputFlag === InputFlag.PASSWORD) {
            input.type = 'password';
            return;
        }
    
        // input mode
        let type = input.type;
        if (inputMode === InputMode.EMAIL_ADDR) {
            type = 'email';
        } else if(inputMode === InputMode.NUMERIC || inputMode === InputMode.DECIMAL) {
            type = 'number';
        } else if(inputMode === InputMode.PHONE_NUMBER) {
            type = 'number';
            input.pattern = '[0-9]*';
        } else if(inputMode === InputMode.URL) {
            type = 'url';
        } else {
            type = 'text';
    
            if (returnType === KeyboardReturnType.SEARCH) {
                type = 'search';
            }
        }
        input.type = type;

        // input flag
        let textTransform = 'none';
        if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
            textTransform = 'uppercase';
        }
        else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
            textTransform = 'capitalize';
        }
        input.style.textTransform = textTransform;
    },

    _updateMaxLength () {
        let maxLength = this._delegate.maxLength;
        if(maxLength < 0) {
            //we can't set Number.MAX_VALUE to input's maxLength property
            //so we use a magic number here, it should works at most use cases.
            maxLength = 65535;
        }
        this._elem.maxLength = maxLength;
    },

    // ===========================================
    // style sheet
    _initStyleSheet () {
        let input = this._elem;
        if (!this.isTextArea()) {
            input.type = 'text';
            input.style.opacity = 0;
            input.style.border = 0;
            input.style.background = 'transparent';
            input.style.width = '100%';
            input.style.height = '100%';
            input.style.active = 0;
            input.style.outline = 'medium';
            input.style.padding = '0';
            input.style.textTransform = 'uppercase';
            input.style.position = "absolute";
            input.style.bottom = "0px";
            input.style.left = LEFT_PADDING + "px";
            input.style['-moz-appearance'] = 'textfield';
            input.style.className = "cocosEditBox";
        }
        else {
            input.type = 'text';
            input.style.opacity = 0;
            input.style.border = 0;
            input.style.background = 'transparent';
            input.style.width = '100%';
            input.style.height = '100%';
            input.style.active = 0;
            input.style.outline = 'medium';
            input.style.padding = '0';
            input.style.resize = 'none';
            input.style.textTransform = 'uppercase';
            input.style.overflow_y = 'scroll';
            input.style.position = "absolute";
            input.style.bottom = "0px";
            input.style.left = LEFT_PADDING + "px";
            input.style.className = "cocosEditBox";
        }
    },

    _updateStyleSheet () {
        let delegate = this._delegate,
            input = this._elem;

        input.value = delegate.string;
        input.placeholder = delegate.placeholder;

        // TODO: handle update cache
        // update after issue solved: https://github.com/cocos-creator/2d-tasks/issues/372
        this._updateTextLabel(delegate._textLabel);
        this._updatePlaceholderLabel(delegate._placeholderLabel);
    },

    _updateTextLabel (textLabel) {
        if (!textLabel) {
            return;
        }
        let input = this._elem;

        // font size
        input.style.fontSize = `${textLabel.fontSize}px`;

        // font color
        input.style.color = textLabel.node.color.toCSS('rgba');

        // TODO: update after issue solved: https://github.com/cocos-creator/2d-tasks/issues/372
        // update color, font-family, text-align, line-height ...
    },

    _updatePlaceholderLabel (placeholderLabel) {
        if (!placeholderLabel) {
            return;
        }
        let input = this._elem;

        // TODO: update after issue solved: https://github.com/cocos-creator/2d-tasks/issues/372
    },

    // ===========================================
    // callbacks register
    onFocus (cb) {
        this._elem.addEventListener('focus', cb);
        this._focusCbs.push(cb);
    },

    onInput (cb) {
        let self = this;
        let input = this._elem;
        function inputCb () {
            if (self._inputLock) {
                return;
            }
            cb && cb(input.value);
        }
        input.addEventListener('input', inputCb);
        this._inputCbs.push(inputCb);
    },

    onConfirm (cb) {
        function confirmCb (e) {
            if (e.keyCode === macro.KEY.enter) {
                e.stopPropagation();
                cb && cb();
            }
        }
        this._elem.addEventListener('keypress', confirmCb);
        this._confirmCbs.push(confirmCb);
    },

    onComplete (cb) {
        this._elem.addEventListener('blur', cb);
        this._completeCbs.push(cb);
    },
    
    _addPrivateEventListeners () {
        let self = this;
        let input = this._elem;
        this._compositionStartCb = function () {
            self._inputLock = true;
        };
        this._compositionEndCb = function () {
            self._inputLock = false;
            
            // invoke input callbacks
            self._inputCbs.forEach(function(cb) {
                cb(input.value);
            });
        };

        // Focus, hide keyboard, then click the same editBox. 
        // Now should adjust view on mobile again after keyboard show.
        this._clickCb = function () {
            if (cc.sys.isMobile && self.editing) {
                self._adjustViewOnMobile();
            }
        };

        input.addEventListener('compositionstart', this._compositionStartCb);
        input.addEventListener('compositionend', this._compositionEndCb);
        input.addEventListener('click', this._clickCb);

        if (!this.isTextArea()) {
            this._confirm2CompleteCbs = function () {
                self._completeCbs.forEach(function (cb) {
                    cb();
                })
            };
            this.onConfirm(this._confirm2CompleteCbs);
        }
    },

    _removePrivateEventListeners () {
        let input = this._elem;
        if (this._compositionStartCb) {
            input.removeEventListener('compositionstart', this._compositionStartCb);
            delete this._compositionStartCb;
        }
        if (this._compositionEndCb) {
            input.removeEventListener('compositionend', this._compositionEndCb);
            delete this._compositionEndCb;
        }
        if (this._clickCb) {
            input.removeEventListener('click', this._clickCb);
            delete this._clickCb;
        }
        delete this._confirm2CompleteCbs; // removeEventlisteners in offAllEvents(), this._confirmCbs
    },

    offAllEvents () {
        let input = this._elem;
        this._focusCbs.forEach(function (cb) {
            input.removeEventListener('focus', cb);
        });
        this._inputCbs.forEach(function (cb) {
            input.removeEventListener('input', cb);
        });
        this._confirmCbs.forEach(function (cb) {
            input.removeEventListener('keypress', cb);
        });
        this._completeCbs.forEach(function (cb) {
            input.removeEventListener('blur', cb);
        });
    },

    // adjust view to editBox
    _adjustViewOnMobile () {
        this._delegate.node.getWorldMatrix(this._worldMat);
        let y = this._worldMat.m13;
        let windowHeight = cc.visibleRect.height;
        let windowWidth = cc.visibleRect.width;
        let factor = 0.5;
        if (windowWidth > windowHeight) {
            factor = 0.7;
        }
        setTimeout(function() {
            if (window.scrollY < SCROLLY && y < windowHeight * factor) {
                let scrollOffset = windowHeight * factor - y - window.scrollY;
                if (scrollOffset < 35) scrollOffset = 35;
                if (scrollOffset > 320) scrollOffset = 320;
                window.scrollTo(0, scrollOffset);
            }
        }, DELAY_TIME);
    },
 });

 module.exports = {
     createAsInput,
     createAsTextArea,
 };