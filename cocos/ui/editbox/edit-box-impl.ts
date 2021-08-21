/*
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2012 James Chen
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @packageDocumentation
 * @hidden
 */

import { BitmapFont } from '../../2d/assets';
import { director } from '../../core/director';
import { game } from '../../core/game';
import { Color, Mat4, Size, Vec3 } from '../../core/math';
import { KeyCode, screen, view } from '../../core/platform';
import { contains } from '../../core/utils/misc';
import { Label } from '../../2d/components/label';
import { EditBox } from './edit-box';
import { tabIndexUtil } from './tabIndexUtil';
import { InputFlag, InputMode, KeyboardReturnType } from './types';
import { sys } from '../../core/platform/sys';
import visibleRect from '../../core/platform/visible-rect';
import { Node } from '../../core/scene-graph';
import { EditBoxImplBase } from './edit-box-impl-base';
import { legacyCC } from '../../core/global-exports';
import { BrowserType, OS } from '../../../pal/system-info/enum-type';

// https://segmentfault.com/q/1010000002914610
const SCROLLY = 40;
const LEFT_PADDING = 2;
const DELAY_TIME = 400;

const _matrix = new Mat4();
const _matrix_temp = new Mat4();
const _vec3 = new Vec3();

let _currentEditBoxImpl: EditBoxImpl | null = null;

let _domCount = 0;

export class EditBoxImpl extends EditBoxImplBase {
    public _delegate: EditBox | null = null;
    public _inputMode: InputMode = -1;
    public _inputFlag: InputFlag = -1;
    public _returnType: KeyboardReturnType = -1;
    public __eventListeners: any = {};
    public __autoResize = false;
    public __orientationChanged: any;
    public _edTxt: HTMLInputElement | HTMLTextAreaElement | null = null;
    private _isTextArea = false;

    private _textLabelFont = null;
    private _textLabelFontSize: number | null = null;
    private _textLabelFontColor = null;
    private _textLabelAlign = null;
    private _placeholderLabelFont = null;
    private _placeholderLabelFontSize: number | null = null;
    private _placeholderLabelFontColor = null;
    private _placeholderLabelAlign = null;
    private _placeholderLineHeight = null;
    private _placeholderStyleSheet: HTMLStyleElement | null = null;
    private _domId = `EditBoxId_${++_domCount}`;

    public init (delegate: EditBox) {
        if (!delegate) {
            return;
        }

        this._delegate = delegate;
        if (delegate.inputMode === InputMode.ANY) {
            this._createTextArea();
        } else {
            this._createInput();
        }

        tabIndexUtil.add(this);
        this.setTabIndex(delegate.tabIndex);
        this._initStyleSheet();
        this._registerEventListeners();
        this._addDomToGameContainer();

        this.__autoResize = view._resizeWithBrowserSize;
    }

    public clear () {
        this._removeEventListeners();
        this._removeDomFromGameContainer();

        tabIndexUtil.remove(this);

        // clear while editing
        if (_currentEditBoxImpl === this) {
            _currentEditBoxImpl = null;
        }

        this._delegate = null;
    }

    public update () {
        this._updateMatrix();
    }

    public setTabIndex (index: number) {
        this._edTxt!.tabIndex = index;
        tabIndexUtil.resort();
    }

    public setSize (width: number, height: number) {
        const elem = this._edTxt;
        if (elem) {
            elem.style.width = `${width}px`;
            elem.style.height = `${height}px`;
        }
    }

    public beginEditing () {
        if (_currentEditBoxImpl && _currentEditBoxImpl !== this) {
            _currentEditBoxImpl.setFocus(false);
        }

        this._editing = true;
        _currentEditBoxImpl = this;
        this._delegate!._editBoxEditingDidBegan();
        this._showDom();
        this._edTxt!.focus();
    }

    public endEditing () {
        this._edTxt!.blur();
    }

    private _createInput () {
        this._isTextArea = false;
        this._edTxt = document.createElement('input');
    }

    private _createTextArea () {
        this._isTextArea = true;
        this._edTxt = document.createElement('textarea');
    }

    private _addDomToGameContainer () {
        if (legacyCC.GAME_VIEW && this._edTxt) {
            legacyCC.gameView.container.appendChild(this._edTxt);
            legacyCC.gameView.head.appendChild(this._placeholderStyleSheet!);
        } else if (game.container && this._edTxt) {
            game.container.appendChild(this._edTxt);
            document.head.appendChild(this._placeholderStyleSheet!);
        }
    }

    private _removeDomFromGameContainer () {
        const hasElem = legacyCC.GAME_VIEW ? contains(legacyCC.gameView.container, this._edTxt)
            : contains(game.container, this._edTxt);
        if (hasElem && this._edTxt) {
            if (legacyCC.GAME_VIEW) {
                legacyCC.gameView.container.removeChild(this._edTxt);
            } else {
                game.container!.removeChild(this._edTxt);
            }
        }
        const hasStyleSheet = legacyCC.GAME_VIEW ? contains(legacyCC.gameView.head, this._placeholderStyleSheet)
            : contains(document.head, this._placeholderStyleSheet);
        if (hasStyleSheet) {
            if (legacyCC.GAME_VIEW) {
                legacyCC.gameView.head.removeChild(this._placeholderStyleSheet);
            } else {
                document.head.removeChild(this._placeholderStyleSheet!);
            }
        }

        this._edTxt = null;
        this._placeholderStyleSheet = null;
    }

    private _showDom () {
        this._updateMaxLength();
        this._updateInputType();
        this._updateStyleSheet();
        if (this._edTxt && this._delegate) {
            this._edTxt.style.display = '';
            this._delegate._hideLabels();
        }
        if (sys.isMobile) {
            this._showDomOnMobile();
        }
    }

    private _hideDom () {
        const elem = this._edTxt;
        if (elem && this._delegate) {
            elem.style.display = 'none';
            this._delegate._showLabels();
        }
        if (sys.isMobile) {
            this._hideDomOnMobile();
        }
    }

    private _showDomOnMobile () {
        if (sys.os !== OS.ANDROID && sys.os !== OS.OHOS) {
            return;
        }

        if (this.__autoResize) {
            view.resizeWithBrowserSize(false);
        }

        this._adjustWindowScroll();
    }

    private _hideDomOnMobile () {
        if (sys.os === OS.ANDROID || sys.os === OS.OHOS) {
            if (this.__autoResize) {
                view.resizeWithBrowserSize(true);
            }
        }

        this._scrollBackWindow();
    }

    private _adjustWindowScroll () {
        setTimeout(() => {
            if (window.scrollY < SCROLLY) {
                this._edTxt!.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
            }
        }, DELAY_TIME);
    }

    private _scrollBackWindow () {
        setTimeout(() => {
            if (sys.browserType === BrowserType.WECHAT && sys.os === OS.IOS) {
                if (window.top) {
                    window.top.scrollTo(0, 0);
                }

                return;
            }

            window.scrollTo(0, 0);
        }, DELAY_TIME);
    }

    private _updateMatrix () {
        if (!this._edTxt) {
            return;
        }

        const node = this._delegate!.node;
        let scaleX = view.getScaleX();
        let scaleY = view.getScaleY();
        let widthRatio = 1;
        let heightRatio = 1;
        if (legacyCC.GAME_VIEW) {
            widthRatio = legacyCC.gameView.canvas.width / legacyCC.game.canvas.width;
            heightRatio = legacyCC.gameView.canvas.height / legacyCC.game.canvas.height;
        }
        scaleX *= widthRatio;
        scaleY *= heightRatio;
        const viewport = view.getViewportRect();
        const dpr = view.getDevicePixelRatio();

        node.getWorldMatrix(_matrix);
        const transform = node._uiProps.uiTransformComp;
        if (transform) {
            Vec3.set(_vec3, -transform.anchorX * transform.width, -transform.anchorY * transform.height, _vec3.z);
        }

        Mat4.transform(_matrix, _matrix, _vec3);

        if (!node._uiProps.uiTransformComp) {
            return;
        }

        const camera = director.root!.batcher2D.getFirstRenderCamera(node);
        if (!camera) return;

        // camera.getWorldToCameraMatrix(_matrix_temp);
        camera.node.getWorldRT(_matrix_temp);
        const m12 = _matrix_temp.m12;
        const m13 = _matrix_temp.m13;
        const center = visibleRect.center;
        _matrix_temp.m12 = center.x - (_matrix_temp.m00 * m12 + _matrix_temp.m04 * m13);
        _matrix_temp.m13 = center.y - (_matrix_temp.m01 * m12 + _matrix_temp.m05 * m13);

        Mat4.multiply(_matrix_temp, _matrix_temp, _matrix);
        scaleX /= dpr;
        scaleY /= dpr;

        const container = legacyCC.GAME_VIEW ? legacyCC.gameView.container : game.container;
        const a = _matrix_temp.m00 * scaleX;
        const b = _matrix.m01;
        const c = _matrix.m04;
        const d = _matrix_temp.m05 * scaleY;

        let offsetX = parseInt((container && container.style.paddingLeft) || '0');
        offsetX += viewport.x * widthRatio / dpr;
        let offsetY = parseInt((container && container.style.paddingBottom) || '0');
        offsetY += viewport.y / dpr;
        const tx = _matrix_temp.m12 * scaleX + offsetX;
        const ty = _matrix_temp.m13 * scaleY + offsetY;

        const matrix = `matrix(${a},${-b},${-c},${d},${tx},${-ty})`;
        this._edTxt.style.transform = matrix;
        this._edTxt.style['-webkit-transform'] = matrix;
        this._edTxt.style['transform-origin'] = '0px 100% 0px';
        this._edTxt.style['-webkit-transform-origin'] = '0px 100% 0px';
    }

    private _updateInputType () {
        const delegate = this._delegate;
        const inputMode = delegate!.inputMode;
        const inputFlag = delegate!.inputFlag;
        const returnType = delegate!.returnType;
        let elem = this._edTxt;

        if (this._inputMode === inputMode
            && this._inputFlag === inputFlag
            && this._returnType === returnType) {
            return;
        }

        // update cache
        this._inputMode = inputMode;
        this._inputFlag = inputFlag;
        this._returnType = returnType;

        // FIX ME: TextArea actually dose not support password type.
        if (this._isTextArea) {
            // input flag
            let transform = 'none';
            if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
                transform = 'uppercase';
            } else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
                transform = 'capitalize';
            }
            elem!.style.textTransform = transform;
            return;
        }

        elem = elem as HTMLInputElement;
        // begin to updateInputType
        if (inputFlag === InputFlag.PASSWORD) {
            elem.type = 'password';
            elem.style.textTransform = 'none';
            return;
        }

        // input mode
        let type = elem.type;
        if (inputMode === InputMode.EMAIL_ADDR) {
            type = 'email';
        } else if (inputMode === InputMode.NUMERIC || inputMode === InputMode.DECIMAL) {
            type = 'number';
        } else if (inputMode === InputMode.PHONE_NUMBER) {
            type = 'number';
            elem.pattern = '[0-9]*';
            elem.addEventListener("wheel", function () {
                 return false;
            });
        } else if (inputMode === InputMode.URL) {
            type = 'url';
        } else {
            type = 'text';

            if (returnType === KeyboardReturnType.SEARCH) {
                type = 'search';
            }
        }
        elem.type = type;

        // input flag
        let textTransform = 'none';
        if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
            textTransform = 'uppercase';
        } else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
            textTransform = 'capitalize';
        }
        elem.style.textTransform = textTransform;
    }

    private _updateMaxLength () {
        let maxLength = this._delegate!.maxLength;
        if (maxLength < 0) {
            maxLength = 65535;
        }
        this._edTxt!.maxLength = maxLength;
    }

    private _initStyleSheet () {
        if (!this._edTxt) {
            return;
        }
        let elem = this._edTxt;
        elem.style.color = '#000000';
        elem.style.border = '0px';
        elem.style.background = 'transparent';
        elem.style.width = '100%';
        elem.style.height = '100%';
        elem.style.outline = 'medium';
        elem.style.padding = '0';
        elem.style.textTransform = 'none';
        elem.style.display = 'none';
        elem.style.position = 'absolute';
        elem.style.bottom = '0px';
        elem.style.left = `${LEFT_PADDING}px`;
        elem.className = 'cocosEditBox';
        elem.style.fontFamily = 'Arial';
        elem.id = this._domId;

        if (!this._isTextArea) {
            elem = elem as HTMLInputElement;
            elem.type = 'text';
            elem.style['-moz-appearance'] = 'textfield';
        } else {
            elem.style.resize = 'none';
            elem.style.overflowY = 'scroll';
        }

        this._placeholderStyleSheet = document.createElement('style');
    }

    private _updateStyleSheet () {
        const delegate = this._delegate;
        const elem = this._edTxt;
        if (elem && delegate) {
            elem.value = delegate.string;
            elem.placeholder = delegate.placeholder;

            this._updateTextLabel(delegate.textLabel);
            this._updatePlaceholderLabel(delegate.placeholderLabel);
        }
    }

    private _updateTextLabel (textLabel) {
        if (!textLabel) {
            return;
        }

        let font = textLabel.font;
        if (font && !(font instanceof BitmapFont)) {
            font = font._fontFamily;
        } else {
            font = textLabel.fontFamily;
        }

        const fontSize = textLabel.fontSize * textLabel.node.scale.y;

        if (this._textLabelFont === font
            && this._textLabelFontSize === fontSize
            && this._textLabelFontColor === textLabel.fontColor
            && this._textLabelAlign === textLabel.horizontalAlign) {
            return;
        }

        this._textLabelFont = font;
        this._textLabelFontSize = fontSize;
        this._textLabelFontColor = textLabel.fontColor;
        this._textLabelAlign = textLabel.horizontalAlign;

        if (!this._edTxt) {
            return;
        }

        const elem = this._edTxt;
        elem.style.fontSize = `${fontSize}px`;
        elem.style.color = textLabel.color.toCSS();
        elem.style.fontFamily = font;

        switch (textLabel.horizontalAlign) {
        case Label.HorizontalAlign.LEFT:
            elem.style.textAlign = 'left';
            break;
        case Label.HorizontalAlign.CENTER:
            elem.style.textAlign = 'center';
            break;
        case Label.HorizontalAlign.RIGHT:
            elem.style.textAlign = 'right';
            break;
        default:
            break;
        }
    }

    private _updatePlaceholderLabel (placeholderLabel) {
        if (!placeholderLabel) {
            return;
        }

        let font = placeholderLabel.font;
        if (font && !(font instanceof BitmapFont)) {
            font = placeholderLabel.font._fontFamily;
        } else {
            font = placeholderLabel.fontFamily;
        }

        const fontSize = placeholderLabel.fontSize * placeholderLabel.node.scale.y;

        if (this._placeholderLabelFont === font
            && this._placeholderLabelFontSize === fontSize
            && this._placeholderLabelFontColor === placeholderLabel.fontColor
            && this._placeholderLabelAlign === placeholderLabel.horizontalAlign
            && this._placeholderLineHeight === placeholderLabel.fontSize) {
            return;
        }

        this._placeholderLabelFont = font;
        this._placeholderLabelFontSize = fontSize;
        this._placeholderLabelFontColor = placeholderLabel.fontColor;
        this._placeholderLabelAlign = placeholderLabel.horizontalAlign;
        this._placeholderLineHeight = placeholderLabel.fontSize;

        const styleEl = this._placeholderStyleSheet;
        const fontColor = placeholderLabel.color.toCSS();
        const lineHeight = placeholderLabel.fontSize;

        let horizontalAlign = '';
        switch (placeholderLabel.horizontalAlign) {
        case Label.HorizontalAlign.LEFT:
            horizontalAlign = 'left';
            break;
        case Label.HorizontalAlign.CENTER:
            horizontalAlign = 'center';
            break;
        case Label.HorizontalAlign.RIGHT:
            horizontalAlign = 'right';
            break;
        default:
            break;
        }

        styleEl!.innerHTML = `#${this._domId}::-webkit-input-placeholder{text-transform: initial;-family: ${font};font-size: ${fontSize}px;color: ${fontColor};line-height: ${lineHeight}px;text-align: ${horizontalAlign};}`
                            + `#${this._domId}::-moz-placeholder{text-transform: initial;-family: ${font};font-size: ${fontSize}px;color: ${fontColor};line-height: ${lineHeight}px;text-align: ${horizontalAlign};}`
                            + `#${this._domId}::-ms-input-placeholder{text-transform: initial;-family: ${font};font-size: ${fontSize}px;color: ${fontColor};line-height: ${lineHeight}px;text-align: ${horizontalAlign};}`;
        // EDGE_BUG_FIX: hide clear button, because clearing input box in Edge does not emit input event
        // issue refference: https://github.com/angular/angular/issues/26307
        if (sys.browserType === BrowserType.EDGE) {
            styleEl!.innerHTML += `#${this._domId}::-ms-clear{display: none;}`;
        }
    }

    private _registerEventListeners () {
        if (!this._edTxt) {
            return;
        }

        const elem = this._edTxt;
        let inputLock = false;
        const cbs = this.__eventListeners;

        cbs.compositionStart = () => {
            inputLock = true;
        };

        cbs.compositionEnd = () => {
            inputLock = false;
            this._delegate!._editBoxTextChanged(elem.value);
        };

        cbs.onInput = () => {
            if (inputLock) {
                return;
            }
            const delegate = this._delegate;
            // input of number type doesn't support maxLength attribute
            const maxLength = delegate!.maxLength;
            if (maxLength >= 0) {
                elem.value = elem.value.slice(0, maxLength);
            }
            delegate!._editBoxTextChanged(elem.value);
        };

        cbs.onClick = () => {
            if (this._editing) {
                if (sys.isMobile) {
                    this._adjustWindowScroll();
                }
            }
        };

        cbs.onKeydown = (e) => {
            if (e.keyCode === KeyCode.ENTER) {
                e.propagationStopped = true;
                this._delegate!._editBoxEditingReturn();

                if (!this._isTextArea) {
                    elem.blur();
                }
            } else if (e.keyCode === KeyCode.TAB) {
                e.propagationStopped = true;
                e.preventDefault();

                tabIndexUtil.next(this);
            }
        };

        cbs.onBlur = () => {
            // on mobile, sometimes input element doesn't fire compositionend event
            if (sys.isMobile && inputLock) {
                cbs.compositionEnd();
            }
            this._editing = false;
            _currentEditBoxImpl = null;
            this._hideDom();
            this._delegate!._editBoxEditingDidEnded();
        };

        elem.addEventListener('compositionstart', cbs.compositionStart);
        elem.addEventListener('compositionend', cbs.compositionEnd);
        elem.addEventListener('input', cbs.onInput);
        elem.addEventListener('keydown', cbs.onKeydown);
        elem.addEventListener('blur', cbs.onBlur);
        elem.addEventListener('touchstart', cbs.onClick);
    }
    private _removeEventListeners () {
        if (!this._edTxt) {
            return;
        }

        const elem = this._edTxt;
        const cbs = this.__eventListeners;

        elem.removeEventListener('compositionstart', cbs.compositionStart);
        elem.removeEventListener('compositionend', cbs.compositionEnd);
        elem.removeEventListener('input', cbs.onInput);
        elem.removeEventListener('keydown', cbs.onKeydown);
        elem.removeEventListener('blur', cbs.onBlur);
        elem.removeEventListener('touchstart', cbs.onClick);

        cbs.compositionStart = null;
        cbs.compositionEnd = null;
        cbs.onInput = null;
        cbs.onKeydown = null;
        cbs.onBlur = null;
        cbs.onClick = null;
    }
}
