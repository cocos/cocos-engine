/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

const macro = require('../../../platform/CCMacro');
const Label = require('../../../components/CCLabel');
const LabelOutline = require('../../../components/CCLabelOutline');
const textUtils = require('../../../utils/text-utils');
const Component = require('../../../components/CCComponent');
const RenderTexture = require('../../../assets/CCRenderTexture');
const OUTLINE_SUPPORTED = cc.js.isChildClassOf(LabelOutline, Component);
const Overflow = Label.Overflow;
const WHITE = cc.Color.WHITE;
const space = 2;

let LetterInfo = function() {
    this.char = '';
    this.valid = true;
    this.x = 0;
    this.y = 0;
    this.line = 0;
    this.hash = "";
};

let FontLetterDefinition = function() {
    this.u = 0;
    this.v = 0;
    this.w = 0;
    this.h = 0;
    this.texture = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.valid = false;
    this.xAdvance = 0;
};

const _invisibleAlpha = (1 / 255).toFixed(3);

function LetterTexture(char, labelInfo) {
    this._texture = null;
    this._labelInfo = labelInfo;
    this._char = char;
    this._hash = null;
    this._data = null;
    this._canvas = null;
    this._context = null;
    this._width = 0;
    this._height = 0;
    this._hash = char.charCodeAt(0) + labelInfo.hash;
}

LetterTexture.prototype = {
    constructor: LetterTexture,

    updateRenderData () {
        this._updateProperties();
        this._updateTexture();
    },
    _updateProperties () {
        this._texture = new cc.Texture2D();
        this._data = Label._canvasPool.get();
        this._canvas = this._data.canvas;
        this._context = this._data.context;
        this._context.font = this._labelInfo.fontDesc;
        let width = textUtils.safeMeasureText(this._context, this._char);
        this._width = parseFloat(width.toFixed(2)) + this._labelInfo.margin * 2;
        this._height = (1 + textUtils.BASELINE_RATIO) * this._labelInfo.fontSize + this._labelInfo.margin * 2;
        
        if (this._canvas.width !== this._width || CC_QQPLAY) {
            this._canvas.width = this._width;
        }

        if (this._canvas.height !== this._height) {
            this._canvas.height = this._height;
        }

        this._texture.initWithElement(this._canvas);
    },
    _updateTexture () {
        let context = this._context;
        let labelInfo = this._labelInfo,
            width = this._canvas.width,
            height = this._canvas.height;

        let startX = width / 2;
        let startY = height / 2 + this._labelInfo.fontSize * textUtils.MIDDLE_RATIO;
        let color = labelInfo.color;

        context.textAlign = 'center';
        context.textBaseline = 'alphabetic';
        context.clearRect(0, 0, width, height);
        //Add a white background to avoid black edges.
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${_invisibleAlpha})`;
        context.fillRect(0, 0, width, height);
        context.font = labelInfo.fontDesc;

        //use round for line join to avoid sharp intersect point
        context.lineJoin = 'round';
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
        if (labelInfo.isOutlined) {
            let strokeColor = labelInfo.out || WHITE;
            context.strokeStyle = `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${strokeColor.a / 255})`;
            context.lineWidth = labelInfo.margin * 2;
            context.strokeText(this._char, startX, startY);
        }
        context.fillText(this._char, startX, startY);

        this._texture.handleLoadedTexture();
    },

    destroy () {
        this._texture.destroy();
        this._texture = null;
        Label._canvasPool.put(this._data);
    },
}

function LetterAtlas (width, height) {
    let texture = new RenderTexture();
    texture.initWithSize(width, height);
    texture.update();
    
    this._texture = texture;

    this._x = space;
    this._y = space;
    this._nexty = space;

    this._width = width;
    this._height = height;

    this._letterDefinitions = {};

    cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLoad, this);
}

cc.js.mixin(LetterAtlas.prototype, {
    insertLetterTexture (letterTexture) {
        let texture = letterTexture._texture;
        let width = texture.width, height = texture.height;        

        if ((this._x + width + space) > this._width) {
            this._x = space;
            this._y = this._nexty;
        }

        if ((this._y + height) > this._nexty) {
            this._nexty = this._y + height + space;
        }

        if (this._nexty > this._height) {
            return null;
        }

        this._texture.drawTextureAt(texture, this._x, this._y);

        this._dirty = true;
        
        let letterDefinition = new FontLetterDefinition();
        letterDefinition.u = this._x;
        letterDefinition.v = this._y;
        letterDefinition.texture = this._texture;
        letterDefinition.valid = true;
        letterDefinition.w = letterTexture._width;
        letterDefinition.h = letterTexture._height;
        letterDefinition.xAdvance = letterTexture._width;

        this._x += width + space;

        this._letterDefinitions[letterTexture._hash] = letterDefinition;
        
        return letterDefinition
    },

    update () {
        if (!this._dirty) return;
        this._texture.update();
        this._dirty = false;
    },

    reset () {
        this._x = space;
        this._y = space;
        this._nexty = space;

        let chars = this._letterDefinitions;
        for (let i = 0, l = chars.length; i < l; i++) {
            let char = chars[i];
            if (!char.isValid) {
                continue;
            }
            char.destroy();
        }

        this._letterDefinitions = {};
    },

    destroy () {
        this.reset();
        this._texture.destroy();
    },

    beforeSceneLoad () {
        this.destroy();

        let texture = new RenderTexture();
        texture.initWithSize(this._width, this._height);
        texture.update();
        
        this._texture = texture;
    },

    getLetter (key) {
        return this._letterDefinitions[key];
    },

    addLetterDefinitions: function(key, letterDefinition) {
        this._letterDefinitions[key] = letterDefinition;
    },
    cloneLetterDefinition: function() {
        let copyLetterDefinitions = {};
        for (let key in this._letterDefinitions) {
            let value = new FontLetterDefinition();
            cc.js.mixin(value, this._letterDefinitions[key]);
            copyLetterDefinitions[key] = value;
        }
        return copyLetterDefinitions;
    },
    assignLetterDefinitions: function(letterDefinition) {
        for (let key in this._letterDefinitions) {
            let newValue = letterDefinition[key];
            let oldValue = this._letterDefinitions[key];
            cc.js.mixin(oldValue, newValue);
        }
    },
    scaleFontLetterDefinition: function(scaleFactor) {
        for (let fontDefinition in this._letterDefinitions) {
            let letterDefinitions = this._letterDefinitions[fontDefinition];
            letterDefinitions.w *= scaleFactor;
            letterDefinitions.h *= scaleFactor;
            letterDefinitions.offsetX *= scaleFactor;
            letterDefinitions.offsetY *= scaleFactor;
            letterDefinitions.xAdvance *= scaleFactor;
        }
    },
    getLetterDefinitionForChar: function(char, labelInfo) {
        let hash = char.charCodeAt(0) + labelInfo.hash;
        let letterDefinition = this._letterDefinitions[hash];
        if (!letterDefinition) {
            let temp = new LetterTexture(char, labelInfo);
            temp.updateRenderData();
            letterDefinition = this.insertLetterTexture(temp);
            temp.destroy();
        }

        return letterDefinition;
    }
});

let _tmpRect = cc.rect();

let _comp = null;

let _horizontalKernings = [];
let _lettersInfo = [];
let _linesWidth = [];
let _linesOffsetX = [];
let _labelDimensions = cc.size();

let _fontAtlas = null;
let _fntConfig = null;
let _numberOfLines = 0;
let _textDesiredHeight =  0;
let _letterOffsetY =  0;
let _tailoredTopY =  0;
let _tailoredBottomY =  0;
let _bmfontScale =  1.0;
let _lineBreakWithoutSpaces =  false;
let _lineSpacing = 0;
let _string = '';
let _fontSize = 0;
let _originFontSize = 0;
let _contentSize = cc.size();
let _hAlign = 0;
let _vAlign = 0;
let _spacingX = 0;
let _lineHeight = 0;
let _overflow = 0;
let _isWrapText = false;
let _labelWidth = 0;
let _labelHeight = 0;
let _maxLineWidth = 0;
let _atlasWidth = 2048;
let _atlasHeight = 2048;
let _fontFamily = "";
let _isBold = false;
let _labelInfo = {
    fontSize:0,
    lineHeight:0,
    hash:"",
    fontFamily:"",
    fontDesc:"Arial",
    hAlign:0,
    vAlign:0,
    color:WHITE,
    isOutlined:false,
    out:WHITE,
    margin:0,
};

module.exports = {
    _getAssemblerData () {
        if (!_fontAtlas) {
            _fontAtlas = new LetterAtlas(_atlasWidth, _atlasHeight);
        }

        return _fontAtlas._texture
    },
    
    updateRenderData (comp) {
        if (!comp._renderData.vertDirty) return;
        if (_comp === comp) return;

        _comp = comp;
        
        this._updateFontFamily(comp);
        _labelInfo.fontFamily = _fontFamily;

        this._updateProperties();
        _labelInfo.fontDesc = this._getFontDesc();

        this._updateContent();
        
        _comp._actualFontSize = _fontSize;
        _comp.node.setContentSize(_contentSize);

        _comp._renderData.vertDirty = _comp._renderData.uvDirty = false;

        _comp = null;
        
        this._resetProperties();
    },

    _updateFontScale () {
        _bmfontScale = _fontSize / _originFontSize;
    },

    _updateProperties () {
        _string = _comp.string.toString();
        _fontSize = _comp.fontSize;
        _originFontSize = _fontSize;
        _hAlign = _comp.horizontalAlign;
        _vAlign = _comp.verticalAlign;
        _spacingX = _comp.spacingX;
        _overflow = _comp.overflow;
        _lineHeight = _comp._lineHeight;
        _isBold = _comp._isBold;

        // should wrap text
        if (_overflow === Overflow.NONE) {
            _isWrapText = false;
        }
        else if (_overflow === Overflow.RESIZE_HEIGHT) {
            _isWrapText = true;
        }
        else {
            _isWrapText = _comp.enableWrapText;
        }

        // outline
        let outline = OUTLINE_SUPPORTED && _comp.getComponent(LabelOutline);
        if (outline && outline.enabled) {
            _labelInfo.isOutlined = true;
            _labelInfo.margin = outline.width;
            _labelInfo.out = outline.color;
            _labelInfo.out.a = outline.color.a * _comp.node.color.a / 255.0;
        }
        else {
            _labelInfo.isOutlined = false;
            _labelInfo.margin = 0;
        }

        _contentSize.width = _comp.node._contentSize.width + _labelInfo.margin * 2;
        _contentSize.height = _comp.node._contentSize.height + _labelInfo.margin * 2;

        _labelInfo.lineHeight = _lineHeight;
        _labelInfo.fontSize = _fontSize;
        _labelInfo.fontFamily = _fontFamily;
        _labelInfo.color = _comp.node.color;
        _labelInfo.hash = this._computeHash(_labelInfo);

        this._setupBMFontOverflowMetrics();

    },

    _updateFontFamily (comp) {
        if (!comp.useSystemFont) {
            if (comp.font) {
                if (comp.font._nativeAsset) {
                    _fontFamily = comp.font._nativeAsset;
                }
                else {
                    _fontFamily = cc.loader.getRes(comp.font.nativeUrl);
                    if (!_fontFamily) {
                        cc.loader.load(comp.font.nativeUrl, function (err, fontFamily) {
                            _fontFamily = fontFamily || 'Arial';
                            comp.font._nativeAsset = fontFamily;
                            comp._updateRenderData(true);
                        });
                    }
                }
            }
            else {
                _fontFamily = 'Arial';
            }
        }
        else {
            _fontFamily = comp.fontFamily;
        }
    },

    _computeHash (labelInfo) {
        let hashData = '';
        let color = labelInfo.color.toHEX("#rrggbb");
        let out = '';
        if (labelInfo.isOutlined) {
            out = out + labelInfo.margin + labelInfo.out.toHEX("#rrggbb");
        };
        
        return hashData + labelInfo.fontSize + labelInfo.fontFamily + color + out;
    },

    _getFontDesc () {
        let fontDesc = _fontSize.toString() + 'px ';
        fontDesc = fontDesc + _fontFamily;
        if (_isBold) {
            fontDesc = "bold " + fontDesc;
        }

        return fontDesc;
    },

    _resetProperties () {

    },

    _updateContent () {
        this._updateFontScale();
        //this._computeHorizontalKerningForText();
        this._alignText();
    },

    _computeHorizontalKerningForText () {
        let string = _string;
        let stringLen = string.length;

        let kerningDict = _fntConfig.kerningDict;
        let horizontalKernings = _horizontalKernings;

        let prev = -1;
        for (let i = 0; i < stringLen; ++i) {
            let key = string.charCodeAt(i);
            let kerningAmount = kerningDict[(prev << 16) | (key & 0xffff)] || 0;
            if (i < stringLen - 1) {
                horizontalKernings[i] = kerningAmount;
            } else {
                horizontalKernings[i] = 0;
            }
            prev = key;
        }
    },

    _multilineTextWrap: function(nextTokenFunc) {
        let textLen = _string.length;

        let lineIndex = 0;
        let nextTokenX = 0;
        let nextTokenY = 0;
        let longestLine = 0;
        let letterRight = 0;

        let highestY = 0;
        let lowestY = 0;
        let letterDef = null;
        let letterPosition = cc.v2(0, 0);

        this._updateFontScale();

        for (let index = 0; index < textLen;) {
            let character = _string.charAt(index);
            if (character === "\n") {
                _linesWidth.push(letterRight);
                letterRight = 0;
                lineIndex++;
                nextTokenX = 0;
                nextTokenY -= _lineHeight * _bmfontScale + _lineSpacing;
                this._recordPlaceholderInfo(index, character);
                index++;
                continue;
            }

            let tokenLen = nextTokenFunc(_string, index, textLen);
            let tokenHighestY = highestY;
            let tokenLowestY = lowestY;
            let tokenRight = letterRight;
            let nextLetterX = nextTokenX;
            let newLine = false;

            for (let tmp = 0; tmp < tokenLen; ++tmp) {
                let letterIndex = index + tmp;
                character = _string.charAt(letterIndex);
                if (character === "\r") {
                    this._recordPlaceholderInfo(letterIndex, character);
                    continue;
                }
                letterDef = _fontAtlas.getLetterDefinitionForChar(character, _labelInfo);
                if (!letterDef) {
                    this._recordPlaceholderInfo(letterIndex, character);
                    continue;
                }

                let letterX = nextLetterX + letterDef.offsetX * _bmfontScale - _labelInfo.margin;

                if (_isWrapText
                    && _maxLineWidth > 0
                    && nextTokenX > 0
                    && letterX + letterDef.w * _bmfontScale > _maxLineWidth
                    && !textUtils.isUnicodeSpace(character)) {
                    _linesWidth.push(letterRight);
                    letterRight = 0;
                    lineIndex++;
                    nextTokenX = 0;
                    nextTokenY -= (_lineHeight * _bmfontScale + _lineSpacing);
                    newLine = true;
                    break;
                } else {
                    letterPosition.x = letterX;
                }

                letterPosition.y = nextTokenY - letterDef.offsetY * _bmfontScale + _labelInfo.margin + _fontSize * textUtils.MIDDLE_RATIO / 2;
                this._recordLetterInfo(letterPosition, character, letterIndex, lineIndex);

                if (letterIndex + 1 < _horizontalKernings.length && letterIndex < textLen - 1) {
                    nextLetterX += _horizontalKernings[letterIndex + 1];
                }

                nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX - _labelInfo.margin * 2;

                tokenRight = letterPosition.x + letterDef.w * _bmfontScale - _labelInfo.margin;

                if (tokenHighestY < letterPosition.y) {
                    tokenHighestY = letterPosition.y;
                }

                if (tokenLowestY > letterPosition.y - letterDef.h * _bmfontScale) {
                    tokenLowestY = letterPosition.y - letterDef.h * _bmfontScale;
                }

            } //end of for loop

            if (newLine) continue;

            nextTokenX = nextLetterX;
            letterRight = tokenRight;

            if (highestY < tokenHighestY) {
                highestY = tokenHighestY;
            }
            if (lowestY > tokenLowestY) {
                lowestY = tokenLowestY;
            }
            if (longestLine < letterRight) {
                longestLine = letterRight;
            }

            index += tokenLen;
        } //end of for loop

        _linesWidth.push(letterRight);

        _numberOfLines = lineIndex + 1;
        _textDesiredHeight = _numberOfLines * _lineHeight * _bmfontScale;
        if (_numberOfLines > 1) {
            _textDesiredHeight += (_numberOfLines - 1) * _lineSpacing;
        }

        _contentSize.width = _labelWidth;
        _contentSize.height = _labelHeight;
        if (_labelWidth <= 0) {
            _contentSize.width = parseFloat(longestLine.toFixed(2)) + _labelInfo.margin * 2;
        }
        if (_labelHeight <= 0) {
            _contentSize.height = parseFloat(_textDesiredHeight.toFixed(2)) + _labelInfo.margin * 2 + _fontSize * textUtils.BASELINE_RATIO;
        }

        _tailoredTopY = _contentSize.height;
        _tailoredBottomY = 0;
        if (highestY > 0) {
            _tailoredTopY = _contentSize.height + highestY;
        }
        if (lowestY < -_textDesiredHeight) {
            _tailoredBottomY = _textDesiredHeight + lowestY;
        }

        return true;
    },

    _getFirstCharLen: function() {
        return 1;
    },

    _getFirstWordLen: function(text, startIndex, textLen) {
        let character = text.charAt(startIndex);
        if (textUtils.isUnicodeCJK(character)
            || character === "\n"
            || textUtils.isUnicodeSpace(character)) {
            return 1;
        }

        let len = 1;
        let letterDef = _fontAtlas.getLetterDefinitionForChar(character, _labelInfo);
        if (!letterDef) {
            return len;
        }
        let nextLetterX = letterDef.xAdvance * _bmfontScale + _spacingX;
        let letterX;
        for (let index = startIndex + 1; index < textLen; ++index) {
            character = text.charAt(index);

            letterDef = _fontAtlas.getLetterDefinitionForChar(character, _labelInfo);
            if (!letterDef) {
                break;
            }
            letterX = nextLetterX + letterDef.offsetX * _bmfontScale;

            if(letterX + letterDef.w * _bmfontScale > _maxLineWidth
               && !textUtils.isUnicodeSpace(character)
               && _maxLineWidth > 0) {
                return len;
            }
            nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX;
            if (character === "\n"
                || textUtils.isUnicodeSpace(character)
                || textUtils.isUnicodeCJK(character)) {
                break;
            }
            len++;
        }

        return len;
    },

    _multilineTextWrapByWord: function() {
        return this._multilineTextWrap(this._getFirstWordLen);
    },

    _multilineTextWrapByChar: function() {
        return this._multilineTextWrap(this._getFirstCharLen);
    },

    _recordPlaceholderInfo: function(letterIndex, char) {
        if (letterIndex >= _lettersInfo.length) {
            let tmpInfo = new LetterInfo();
            _lettersInfo.push(tmpInfo);
        }

        _lettersInfo[letterIndex].char = char;
        _lettersInfo[letterIndex].hash = char.charCodeAt(0) + _labelInfo.hash;
        _lettersInfo[letterIndex].valid = false;
    },

    _recordLetterInfo: function(letterPosition, character, letterIndex, lineIndex) {
        if (letterIndex >= _lettersInfo.length) {
            let tmpInfo = new LetterInfo();
            _lettersInfo.push(tmpInfo);
        }
        let char = character.charCodeAt(0);
        let key = char + _labelInfo.hash;
        _lettersInfo[letterIndex].line = lineIndex;
        _lettersInfo[letterIndex].char = character;
        _lettersInfo[letterIndex].hash = key;
        _lettersInfo[letterIndex].valid = _fontAtlas.getLetter(key).valid;
        _lettersInfo[letterIndex].x = letterPosition.x;
        _lettersInfo[letterIndex].y = letterPosition.y;
    },

    _alignText: function() {
        _textDesiredHeight = 0;
        _linesWidth.length = 0;

        if (!_lineBreakWithoutSpaces) {
            this._multilineTextWrapByWord();
        } else {
            this._multilineTextWrapByChar();
        }

        this._computeAlignmentOffset();

        this._updateQuads()
        //shrink
        // if (_overflow === Overflow.SHRINK) {
        //     if (_fontSize > 0 && this._isVerticalClamp()) {
        //         this._shrinkLabelToContentSize(this._isVerticalClamp);
        //     }
        // }

        // if (!this._updateQuads()) {
        //     if (_overflow === Overflow.SHRINK) {
        //         this._shrinkLabelToContentSize(this._isHorizontalClamp);
        //     }
        // }
    },

    _scaleFontSizeDown (fontSize) {
        let shouldUpdateContent = true;
        if (!fontSize) {
            fontSize = 0.1;
            shouldUpdateContent = false;
        }
        _fontSize = fontSize;

        if (shouldUpdateContent) {
            this._updateContent();
        }
    },

    _isVerticalClamp () {
        if (_textDesiredHeight > _contentSize.height) {
            return true;
        } else {
            return false;
        }
    },

    _isHorizontalClamp () {
        let letterClamp = false;
        for (let ctr = 0, l = _string.length; ctr < l; ++ctr) {
            let letterInfo = _lettersInfo[ctr];
            if (letterInfo.valid) {
                let letterDef = _fontAtlas.getLetter(letterInfo.hash);

                let px = letterInfo.x + letterDef.w * _bmfontScale;
                let lineIndex = letterInfo.line;
                if (_labelWidth > 0) {
                    if (!_isWrapText) {
                        if(px > _contentSize.width){
                            letterClamp = true;
                            break;
                        }
                    }else{
                        let wordWidth = _linesWidth[lineIndex];
                        if (wordWidth > _contentSize.width && (px > _contentSize.width || px < 0)) {
                            letterClamp = true;
                            break;
                        }
                    }
                }
            }
        }

        return letterClamp;
    },

    _isHorizontalClamped (px, lineIndex) {
        let wordWidth = _linesWidth[lineIndex];
        let letterOverClamp = (px > _contentSize.width || px < 0);

        if(!_isWrapText){
            return letterOverClamp;
        }else{
            return (wordWidth > _contentSize.width && letterOverClamp);
        }
    },

    _updateQuads () {
        
        let texture = _fontAtlas._texture;

        let node = _comp.node;
        let renderData = _comp._renderData;
        renderData.dataLength = renderData.vertexCount = renderData.indiceCount = 0;

        let contentSize = _contentSize,
            appx = node._anchorPoint.x * contentSize.width,
            appy = node._anchorPoint.y * contentSize.height;
        
        let ret = true;
        for (let ctr = 0, l = _string.length; ctr < l; ++ctr) {
            let letterInfo = _lettersInfo[ctr];
            if (!letterInfo.valid) continue;
            let letterDef = _fontAtlas.getLetter(letterInfo.hash);

            _tmpRect.height = letterDef.h;
            _tmpRect.width = letterDef.w;
            _tmpRect.x = letterDef.u;
            _tmpRect.y = letterDef.v;

            let py = letterInfo.y + _letterOffsetY;

            if (_labelHeight > 0) {
                if (py > _tailoredTopY) {
                    let clipTop = py - _tailoredTopY;
                    _tmpRect.y += clipTop;
                    _tmpRect.height -= clipTop;
                    py = py - clipTop;
                }

                if (py - letterDef.h * _bmfontScale < _tailoredBottomY) {
                    _tmpRect.height = (py < _tailoredBottomY) ? 0 : (py - _tailoredBottomY);
                }
            }

            let lineIndex = letterInfo.line;
            let px = letterInfo.x + letterDef.w / 2 * _bmfontScale + _linesOffsetX[lineIndex];

            if (_labelWidth > 0) {
                if (this._isHorizontalClamped(px, lineIndex)) {
                    if (_overflow === Overflow.CLAMP) {
                        _tmpRect.width = 0;
                    } else if (_overflow === Overflow.SHRINK) {
                        if (_contentSize.width > letterDef.w) {
                            ret = false;
                            break;
                        } else {
                            _tmpRect.width = 0;
                        }
                    }
                }
            }

            if (_tmpRect.height > 0 && _tmpRect.width > 0) {
                let letterPositionX = letterInfo.x + _linesOffsetX[letterInfo.line];
                this.appendQuad(renderData, texture, _tmpRect, false, letterPositionX - appx, py - appy, _bmfontScale);
            }
        }

        return ret;
    },

    appendQuad (renderData, texture, rect, rotated, x, y, scale) {
    },

    _computeAlignmentOffset: function() {
        _linesOffsetX.length = 0;
        
        switch (_hAlign) {
            case macro.TextAlignment.LEFT:
                for (let i = 0; i < _numberOfLines; ++i) {
                    _linesOffsetX.push(0);
                }
                break;
            case macro.TextAlignment.CENTER:
                for (let i = 0, l = _linesWidth.length; i < l; i++) {
                    _linesOffsetX.push((_contentSize.width - _linesWidth[i]) / 2);
                }
                break;
            case macro.TextAlignment.RIGHT:
                for (let i = 0, l = _linesWidth.length; i < l; i++) {
                    _linesOffsetX.push(_contentSize.width - _linesWidth[i]);
                }
                break;
            default:
                break;
        }

        switch (_vAlign) {
            case macro.VerticalTextAlignment.TOP:
                _letterOffsetY = _contentSize.height;
                break;
            case macro.VerticalTextAlignment.CENTER:
                _letterOffsetY = (_contentSize.height + _textDesiredHeight) / 2 - (_lineHeight - _fontSize) / 2;
                break;
            case macro.VerticalTextAlignment.BOTTOM:
                _letterOffsetY = (_contentSize.height + _textDesiredHeight) / 2 - (_lineHeight - _fontSize);
                break;
            default:
                break;
        }
    },

    _setupBMFontOverflowMetrics () {
        let newWidth = _contentSize.width,
            newHeight = _contentSize.height;

        if (_overflow === Overflow.RESIZE_HEIGHT) {
            newHeight = 0;
        }

        if (_overflow === Overflow.NONE) {
            newWidth = 0;
            newHeight = 0;
        }

        _labelWidth = newWidth;
        _labelHeight = newHeight;
        _labelDimensions.width = newWidth;
        _labelDimensions.height = newHeight;
        _maxLineWidth = newWidth;
    }
};
