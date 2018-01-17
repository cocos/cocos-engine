/*global _ccsg */

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2012 James Chen
 Copyright (c) 2011-2012 cocos2d-x.org

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const Utils = require('../../platform/utils');

const Types = require('./types');
const InputMode = Types.InputMode;
const InputFlag = Types.InputFlag;
const KeyboardReturnType = Types.KeyboardReturnType;

// https://segmentfault.com/q/1010000002914610
let SCROLLY = 40;
let LEFT_PADDING = 2;
let DELAY_TIME = 400;
let FOCUS_DELAY_UC = 400;
let FOCUS_DELAY_FIREFOX = 0;

let math = cc.vmath;
let _matrix = math.mat4.create();
let _vec3 = cc.v3();

// polyfill
let polyfill = {
    zoomInvalid: false
}
if (cc.sys.OS_ANDROID === cc.sys.os &&
    (cc.sys.browserType === cc.sys.BROWSER_TYPE_SOUGOU ||
    cc.sys.browserType === cc.sys.BROWSER_TYPE_360)) {
    polyfill.zoomInvalid = true;
}

let EditBoxImpl = cc.Class({
    ctor () {
        this._delegate = null;
        this._inputMode = -1;
        this._inputFlag = -1;
        this._returnType = KeyboardReturnType.DEFAULT;
        this._maxLength = 50;
        this._text = '';
        this._placeholderText = '';
        this._alwaysOnTop = false;
        this._size = cc.size();
        this._node = null;
        this._editing = false;
        
        this.__fullscreen = false;
        this.__autoResize = false;
        this.__rotateScreen = false;
        this.__orientationChanged = null;
    },

    setTabIndex (index) {
        if (this._edTxt) {
            this._edTxt.tabIndex = index;
        }
    },

    setFocus () {
        if (this._edTxt) {
            this._edTxt.focus();
        }
    },

    isFocused() {
        if (this._edTxt) {
            return document.activeElement === this._edTxt;
        }
        cc.warnID(4700);
        return false;
    },

    stayOnTop (flag) {
        if(this._alwaysOnTop === flag) return;

        this._alwaysOnTop = flag;
        
        if (flag) {
            this._edTxt.style.display = '';
        } else {
            this._edTxt.style.display = 'none';
        }
    },

    setMaxLength (maxLength) {
        if (!isNaN(maxLength)) {
            if(maxLength < 0) {
                //we can't set Number.MAX_VALUE to input's maxLength property
                //so we use a magic number here, it should works at most use cases.
                maxLength = 65535;
            }
            this._maxLength = maxLength;
            this._edTxt.maxLength = maxLength;
        }
    },

    setString (text) {
        this._text = text;
        this._edTxt.value = text;
    },

    getString () {
        return this._text;
    },

    setDelegate (delegate) {
        this._delegate = delegate;
    },

    setInputMode (inputMode) {
        if (this._inputMode === inputMode) return;

        this._inputMode = inputMode;

        if (inputMode === InputMode.ANY) {
            this._createDomTextArea();
        }
        else {
            this._createDomInput();
        }
    
        this._updateDomInputType();
        this._updateSize(this._size.width, this._size.height);

        this._updateMatrix();
    },

    setInputFlag (inputFlag) {
        if (this._inputFlag === inputFlag) return;

        this._inputFlag = inputFlag;
        this._updateDomInputType();

        let textTransform = 'none';

        if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
            textTransform = 'uppercase';
        }
        else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
            textTransform = 'capitalize';
        }

        this._edTxt.style.textTransform = textTransform;
    },

    setReturnType (returnType) {
        this._returnType = returnType;
        this._updateDomInputType();
    },

    setFontSize (fontSize) {
        this._edFontSize = fontSize || this._edFontSize;
        this._edTxt.style.fontSize = this._edFontSize + 'px';
    },
    
    setFontColor (color) {
        this._textColor = color;
        this._edTxt.style.color = cc.colorToHex(color);
    },
    
    setSize (width, height) {
        this._size.width = width;
        this._size.height = height;
        this._updateSize(width, height);
    },

    setNode (node) {
        this._node = node;
    },

    update () {
        if (this._editing) {
            this._updateMatrix();
        }
    },

    clear () {
        this.setDelegate(null);
        this.removeDom();
    },

    _onTouchBegan (touch) {
    },

    _onTouchEnded () {
        this._beginEditing();
    },

    _beginEditing () {
        let self = this;
        if (!self._alwaysOnTop) {
            if (self._edTxt.style.display === 'none') {
                self._edTxt.style.display = '';
    
                function startFocus () {
                    self._edTxt.focus();
                }
    
                if (cc.sys.browserType === cc.sys.BROWSER_TYPE_UC) {
                    setTimeout(startFocus, FOCUS_DELAY_UC);
                }
                else if (cc.sys.browserType === cc.sys.BROWSER_TYPE_FIREFOX) {
                    setTimeout(startFocus, FOCUS_DELAY_FIREFOX);
                }
                else {
                    startFocus();
                }
            }
        }
    
        if (cc.sys.isMobile && !self._editing) {
            // Pre adaptation and
            self._beginEditingOnMobile(self._editBox);
        }
        self._editing = true;
    },
    
    _endEditing () {
        if (!this._alwaysOnTop) {
            this._edTxt.style.display = 'none';
        }
        if (cc.sys.isMobile && this._editing) {
            let self = this;
            // Delay end editing adaptation to ensure virtual keyboard is disapeared
            setTimeout(function () {
                self._endEditingOnMobile();
            }, DELAY_TIME);
        }
        this._editing = false;
    },
    
    _updateDomInputType () {
        let inputMode = this._inputMode;
        let edTxt = this._edTxt;
    
        if (this._inputFlag === InputFlag.PASSWORD) {
            edTxt.type = 'password';
            return;
        }
    
        let type = edTxt.type;
        if (inputMode === InputMode.EMAIL_ADDR) {
            type = 'email';
        } else if(inputMode === InputMode.NUMERIC || inputMode === InputMode.DECIMAL) {
            type = 'number';
        } else if(inputMode === InputMode.PHONE_NUMBER) {
            type = 'number';
            edTxt.pattern = '[0-9]*';
        } else if(inputMode === InputMode.URL) {
            type = 'url';
        } else {
            type = 'text';
    
            if (this._returnType === KeyboardReturnType.SEARCH) {
                type = 'search';
            }
        }
    
        if (this._inputFlag === InputFlag.PASSWORD) {
            type = 'password';
        }
    
        edTxt.type = type;
    },
    
    _updateSize (newWidth, newHeight) {
        let edTxt = this._edTxt;
        if (!edTxt) return;
    
        edTxt.style.width = newWidth + 'px';
        edTxt.style.height = newHeight + 'px';
    },

    _updateMatrix () {
        if (!this._edTxt) return;
    
        let node = this._node, 
            scaleX = cc.view._scaleX, scaleY = cc.view._scaleY;
        let dpr = cc.view._devicePixelRatio;
    
        node.getWorldMatrix(_matrix);
        let contentSize = node._contentSize;
        _vec3.x = -node._anchorPoint.x * contentSize.width;
        _vec3.y = -node._anchorPoint.y * contentSize.height;
    
        math.mat4.translate(_matrix, _matrix, _vec3);
    
        scaleX /= dpr;
        scaleY /= dpr;
    
        let container = cc.game.container;
        let a = _matrix.m00 * scaleX, b = _matrix.m01, c = _matrix.m04, d = _matrix.m05 * scaleY;
    
        let offsetX = container && container.style.paddingLeft && parseInt(container.style.paddingLeft);
        let offsetY = container && container.style.paddingBottom && parseInt(container.style.paddingBottom);
        let tx = _matrix.m12 * scaleX + offsetX, ty = _matrix.m13 * scaleY + offsetY;
    
        if (polyfill.zoomInvalid) {
            this._updateSize(this._size.width * a, this._size.height * d);
            a = 1;
            d = 1;
        }
    
        let matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
        this._edTxt.style['transform'] = matrix;
        this._edTxt.style['-webkit-transform'] = matrix;
        this._edTxt.style['transform-origin'] = '0px 100% 0px';
        this._edTxt.style['-webkit-transform-origin'] = '0px 100% 0px';
    },

    _adjustEditBoxPosition () {
        this._node.getWorldMatrix(_matrix);
        let y = _matrix.m13;
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
    }
});

let _p = EditBoxImpl.prototype;

// Called before editbox focus to register cc.view status
_p._beginEditingOnMobile = function () {
    this.__orientationChanged = () => {
        this._adjustEditBoxPosition();
    };

    window.addEventListener('orientationchange', this.__orientationChanged);

    if (cc.view.isAutoFullScreenEnabled()) {
        this.__fullscreen = true;
        cc.view.enableAutoFullScreen(false);
        cc.screen.exitFullScreen();
    } else {
        this.__fullscreen = false;
    }
    this.__autoResize = cc.view.__resizeWithBrowserSize;
    cc.view.resizeWithBrowserSize(false);
};

// Called after keyboard disappeared to readapte the game view
_p._endEditingOnMobile = function () {
    if (this.__rotateScreen) {
        cc.container.style['-webkit-transform'] = 'rotate(90deg)';
        cc.container.style.transform = 'rotate(90deg)';

        let view = cc.view;
        let width = view._originalDesignResolutionSize.width;
        let height = view._originalDesignResolutionSize.height;
        if (width > 0) {
            view.setDesignResolutionSize(width, height, view._resolutionPolicy);
        }
        this.__rotateScreen = false;
    }

    window.removeEventListener('orientationchange', this.__orientationChanged);

    window.scrollTo(0, 0);
    if(this.__fullscreen) {
        cc.view.enableAutoFullScreen(true);
    }
    if (this.__autoResize) {
        cc.view.resizeWithBrowserSize(true);
    }
};

// Called after editbox focus to readapte the game view
_p._onFocusOnMobile = function (editBox) {
    if (cc.view._isRotated) {
        cc.container.style['-webkit-transform'] = 'rotate(0deg)';
        cc.container.style.transform = 'rotate(0deg)';
        cc.view._isRotated = false;
        let policy = cc.view.getResolutionPolicy();
        policy.apply(cc.view, cc.view.getDesignResolutionSize());
        cc.view._isRotated = true;
        //use window scrollTo to adjust the input area
        window.scrollTo(35, 35);
        this.__rotateScreen = true;
    } else {
        this.__rotateScreen = false;
    }
    this._adjustEditBoxPosition();
};

_p._createDomInput = function () {
    this.removeDom();

    let self = this;
    let tmpEdTxt = this._edTxt = document.createElement('input');
    tmpEdTxt.type = 'text';
    tmpEdTxt.style.fontSize = this._edFontSize + 'px';
    tmpEdTxt.style.color = '#000000';
    tmpEdTxt.style.border = 0;
    tmpEdTxt.style.background = 'transparent';
    tmpEdTxt.style.width = '100%';
    tmpEdTxt.style.height = '100%';
    tmpEdTxt.style.active = 0;
    tmpEdTxt.style.outline = 'medium';
    tmpEdTxt.style.padding = '0';
    tmpEdTxt.style.textTransform = 'uppercase';
    tmpEdTxt.style.display = 'none';
    tmpEdTxt.style.position = "absolute";
    tmpEdTxt.style.bottom = "0px";
    tmpEdTxt.style.left = LEFT_PADDING + "px";
    tmpEdTxt.style['-moz-appearance'] = 'textfield';
    tmpEdTxt.style.className = "cocosEditBox";
    tmpEdTxt.style.fontFamily = 'Arial';

    tmpEdTxt.addEventListener('input', function () {
        if (this.value.length > this._maxLength) {
            this.value = this.value.slice(0, this._maxLength);
        }

        if (self._delegate && self._delegate.editBoxTextChanged) {
            if (self._text !== this.value) {
                self._text = this.value;
                self._delegate.editBoxTextChanged(self._text);
            }
        }
    });
    tmpEdTxt.addEventListener('keypress', function (e) {
        if (e.keyCode === cc.KEY.enter) {
            e.stopPropagation();
            e.preventDefault();

            self._text = this.value;

            self._endEditing();
            if (self._delegate && self._delegate.editBoxEditingReturn) {
                self._delegate.editBoxEditingReturn();
            }
            cc._canvas.focus();
        }
    });

    tmpEdTxt.addEventListener('focus', function () {
        this.style.fontSize = self._edFontSize + 'px';
        this.style.color = cc.colorToHex(self._textColor);

        if (cc.sys.isMobile) {
            self._onFocusOnMobile();
        }

        if (self._delegate && self._delegate.editBoxEditingDidBegan) {
            self._delegate.editBoxEditingDidBegan();
        }
    });
    tmpEdTxt.addEventListener('blur', function () {
        self._text = this.value;

        if (self._delegate && self._delegate.editBoxEditingDidEnded) {
            self._delegate.editBoxEditingDidEnded();
        }

        self._endEditing();
    });

    this._addDomToGameContainer();

    return tmpEdTxt;
};

_p._createDomTextArea = function () {
    this.removeDom();

    let self = this;
    let tmpEdTxt = this._edTxt = document.createElement('textarea');
    tmpEdTxt.type = 'text';
    tmpEdTxt.style.fontSize = this._edFontSize + 'px';
    tmpEdTxt.style.color = '#000000';
    tmpEdTxt.style.border = 0;
    tmpEdTxt.style.background = 'transparent';
    tmpEdTxt.style.width = '100%';
    tmpEdTxt.style.height = '100%';
    tmpEdTxt.style.active = 0;
    tmpEdTxt.style.outline = 'medium';
    tmpEdTxt.style.padding = '0';
    tmpEdTxt.style.resize = 'none';
    tmpEdTxt.style.textTransform = 'uppercase';
    tmpEdTxt.style.overflow_y = 'scroll';
    tmpEdTxt.style.display = 'none';
    tmpEdTxt.style.position = "absolute";
    tmpEdTxt.style.bottom = "0px";
    tmpEdTxt.style.left = LEFT_PADDING + "px";
    tmpEdTxt.style.className = "cocosEditBox";
    tmpEdTxt.style.fontFamily = 'Arial';

    tmpEdTxt.addEventListener('input', function () {
        if (this.value.length > this._maxLength) {
            this.value = this.value.slice(0, this._maxLength);
        }

        if (self._delegate && self._delegate.editBoxTextChanged) {
            if (self._text !== this.value) {
                self._text = this.value;
                self._delegate.editBoxTextChanged(self._text);
            }
        }
    });

    tmpEdTxt.addEventListener('focus', function () {
        this.style.fontSize = self._edFontSize + 'px';
        this.style.color = cc.colorToHex(self._textColor);

        if (cc.sys.isMobile) {
            self._onFocusOnMobile();
        }

        if (self._delegate && self._delegate.editBoxEditingDidBegan) {
            self._delegate.editBoxEditingDidBegan();
        }

    });
    tmpEdTxt.addEventListener('keypress', function (e) {
        if (e.keyCode === cc.KEY.enter) {
            e.stopPropagation();

            if (self._delegate && self._delegate.editBoxEditingReturn) {
                self._delegate.editBoxEditingReturn();
            }
        }
    });
    tmpEdTxt.addEventListener('blur', function () {
        self._text = this.value;

        if (self._delegate && self._delegate.editBoxEditingDidEnded) {
            self._delegate.editBoxEditingDidEnded();
        }

        self._endEditing();
    });

    this._addDomToGameContainer();
    return tmpEdTxt;
};

_p._addDomToGameContainer = function () {
    cc.game.container.appendChild(this._edTxt);
};

_p.removeDom = function () {
    let edTxt = this._edTxt;
    if (edTxt) {
        let hasChild = Utils.contains(cc.game.container, edTxt);
        if (hasChild) {
            cc.game.container.removeChild(edTxt);
        }
    }
    this._edTxt = null;
};

module.exports = EditBoxImpl;
