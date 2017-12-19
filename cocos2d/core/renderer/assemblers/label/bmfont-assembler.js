const renderEngine = require('../../render-engine');
const RenderData = renderEngine.RenderData;

const Label = require('../../../components/CCLabel');
const Overflow = Label.Overflow;


let FontLetterDefinition = function() {
    this._u = 0;
    this._v = 0;
    this._width = 0;
    this._height = 0;
    this._offsetX = 0;
    this._offsetY = 0;
    this._textureID = 0;
    this._validDefinition = false;
    this._xAdvance = 0;
};

cc.FontAtlas = function (fntConfig) {
    this._letterDefinitions = {};
};

cc.FontAtlas.prototype = {
    constructor: cc.FontAtlas,
    addLetterDefinitions: function(letter, letterDefinition) {
        this._letterDefinitions[letter] = letterDefinition;
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
            letterDefinitions._width *= scaleFactor;
            letterDefinitions._height *= scaleFactor;
            letterDefinitions._offsetX *= scaleFactor;
            letterDefinitions._offsetY *= scaleFactor;
            letterDefinitions._xAdvance *= scaleFactor;
        }
    },
    getLetterDefinitionForChar: function(char) {
        let hasKey = this._letterDefinitions.hasOwnProperty(char.charCodeAt(0));
        let letterDefinition;
        if (hasKey) {
            letterDefinition = this._letterDefinitions[char.charCodeAt(0)];
        } else {
            letterDefinition = null;
        }
        return letterDefinition;
    }
};

let LetterInfo = function() {
    this._char = '';
    this._valid = true;
    this._positionX = 0;
    this._positionY = 0;
    this._lineIndex = 0;
};

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
let _spriteFrame = null;
let _lineSpacing = 0;
let _string = '';
let _fontSize = 0;
let _originFontSize = 0;
let _overflow = 0;
let _contentSize = cc.size();

module.exports = {
    createData (comp) {
        return RenderData.alloc();
    },

    update (comp) {
        if (!comp._renderData.vertDirty) return;

        _comp = comp;
        
        this._updateProperties();
        this._updateContent();
        
        _comp._actualFontSize = _fontSize;
        _comp.node.setContentSize(_contentSize);

        _comp._renderData.vertDirty = _comp._renderData.uvDirty = false;

        _comp = null;
        
        this._resetProperties();
    },

    fillVertexBuffer (comp, index, vbuf, uintbuf) {
        let off = index * comp._vertexFormat._bytes / 4;
        let node = comp.node;
        let renderData = comp._renderData;
        let data = renderData._data;
        let z = node._position.z;
        let color = node._color._val;
        
        node._updateWorldMatrix();
        let matrix = node._worldMatrix;
        let a = matrix.m00,
            b = matrix.m01,
            c = matrix.m04,
            d = matrix.m05,
            tx = matrix.m12,
            ty = matrix.m13;
    
        let vert;
        let length = renderData.dataLength;
        for (let i = 0; i < length; i++) {
            vert = data[i];
            vbuf[off + 0] = vert.x * a + vert.y * c + tx;
            vbuf[off + 1] = vert.x * b + vert.y * d + ty;
            vbuf[off + 2] = z;
            vbuf[off + 4] = vert.u;
            vbuf[off + 5] = vert.v;
            uintbuf[off + 3] = color;
            off += 6;
        }
    },

    fillIndexBuffer (comp, offset, vertexId, ibuf) {
        let renderData = comp._renderData;
        let length = renderData.indiceCount;
        for (let i = 0; i < length; i+=6) {
            ibuf[offset++] = vertexId;
            ibuf[offset++] = vertexId+1;
            ibuf[offset++] = vertexId+2;
            ibuf[offset++] = vertexId+1;
            ibuf[offset++] = vertexId+3;
            ibuf[offset++] = vertexId+2;
            vertexId += 4;
        }
    },

    _updateFontScale () {
        _bmfontScale = _fontSize / _originFontSize;
    },

    _updateProperties () {
        let fontAsset = _comp.font;
        _spriteFrame = fontAsset.spriteFrame;
        _fntConfig = fontAsset._fntConfig;

        _fontAtlas = _comp._fontAtlas;
        if (!_fontAtlas) {
            _fontAtlas = new cc.FontAtlas(_fntConfig);
            
            let fontDict = _fntConfig.fontDefDictionary;

            for (let fontDef in fontDict) {
                let letterDefinition = new FontLetterDefinition();

                let rect = fontDict[fontDef].rect;

                letterDefinition._offsetX = fontDict[fontDef].xOffset;
                letterDefinition._offsetY = fontDict[fontDef].yOffset;
                letterDefinition._width = rect.width;
                letterDefinition._height = rect.height;
                letterDefinition._u = rect.x;
                letterDefinition._v = rect.y;
                //FIXME: only one texture supported for now
                letterDefinition._textureID = 0;
                letterDefinition._validDefinition = true;
                letterDefinition._xAdvance = fontDict[fontDef].xAdvance;

                _fontAtlas.addLetterDefinitions(fontDef, letterDefinition);
            }

            _comp._fontAtlas = _fontAtlas;
        }

        _string = _comp.string;
        _fontSize = _comp.fontSize;
        _originFontSize = _fntConfig.fontSize;
        _contentSize = _comp.node._contentSize;
        _hAlign = _comp.horizontalAlign;
        _vAlign = _comp.verticalAlign;
        _spacingX = _comp.spacingX;
        _overflow = _comp.overflow;
        _lineHeight = _comp._lineHeight;
                
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

        this._setupBMFontOverflowMetrics();
    },

    _resetProperties () {
        _fontAtlas = null;
        _fntConfig = null;
        _spriteFrame = null;
    },

    _updateContent () {
        this._updateFontScale();
        this._computeHorizontalKerningForText();
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
        let letterPosition = cc.p(0, 0);

        this._updateFontScale();

        let letterDefinitions = _fontAtlas._letterDefinitions;

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
                letterDef = _fontAtlas.getLetterDefinitionForChar(character);
                if (!letterDef) {
                    this._recordPlaceholderInfo(letterIndex, character);
                    console.log("Can't find letter definition in texture atlas " + _fntConfig.atlasName + " for letter:" + character);
                    continue;
                }

                let letterX = nextLetterX + letterDef._offsetX * _bmfontScale;

                if (_isWrapText
                    && _maxLineWidth > 0
                    && nextTokenX > 0
                    && letterX + letterDef._width * _bmfontScale > _maxLineWidth
                    && !cc.TextUtils.isUnicodeSpace(character)) {
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

                letterPosition.y = nextTokenY - letterDef._offsetY * _bmfontScale;
                this._recordLetterInfo(letterDefinitions, letterPosition, character, letterIndex, lineIndex);

                if (letterIndex + 1 < _horizontalKernings.length && letterIndex < textLen - 1) {
                    nextLetterX += _horizontalKernings[letterIndex + 1];
                }

                nextLetterX += letterDef._xAdvance * _bmfontScale + _spacingX;

                tokenRight = letterPosition.x + letterDef._width * _bmfontScale;

                if (tokenHighestY < letterPosition.y) {
                    tokenHighestY = letterPosition.y;
                }

                if (tokenLowestY > letterPosition.y - letterDef._height * _bmfontScale) {
                    tokenLowestY = letterPosition.y - letterDef._height * _bmfontScale;
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
            _contentSize.width = parseFloat(longestLine.toFixed(2));
        }
        if (_labelHeight <= 0) {
            _contentSize.height = parseFloat(_textDesiredHeight.toFixed(2));
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
        if (cc.TextUtils.isUnicodeCJK(character)
            || character === "\n"
            || cc.TextUtils.isUnicodeSpace(character)) {
            return 1;
        }

        let len = 1;
        let letterDef = _fontAtlas.getLetterDefinitionForChar(character);
        if (!letterDef) {
            return len;
        }
        let nextLetterX = letterDef._xAdvance * _bmfontScale + _spacingX;
        let letterX;
        for (let index = startIndex + 1; index < textLen; ++index) {
            character = text.charAt(index);

            letterDef = _fontAtlas.getLetterDefinitionForChar(character);
            if (!letterDef) {
                break;
            }
            letterX = nextLetterX + letterDef._offsetX * _bmfontScale;

            if(letterX + letterDef._width * _bmfontScale > _maxLineWidth
               && !cc.TextUtils.isUnicodeSpace(character)
               && _maxLineWidth > 0) {
                return len;
            }
            nextLetterX += letterDef._xAdvance * _bmfontScale + _spacingX;
            if (character === "\n"
                || cc.TextUtils.isUnicodeSpace(character)
                || cc.TextUtils.isUnicodeCJK(character)) {
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

        _lettersInfo[letterIndex]._char = char;
        _lettersInfo[letterIndex]._valid = false;
    },

    _recordLetterInfo: function(letterDefinitions, letterPosition, character, letterIndex, lineIndex) {
        if (letterIndex >= _lettersInfo.length) {
            let tmpInfo = new LetterInfo();
            _lettersInfo.push(tmpInfo);
        }
        character = character.charCodeAt(0);

        _lettersInfo[letterIndex]._lineIndex = lineIndex;
        _lettersInfo[letterIndex]._char = character;
        _lettersInfo[letterIndex]._valid = letterDefinitions[character]._validDefinition;
        _lettersInfo[letterIndex]._positionX = letterPosition.x;
        _lettersInfo[letterIndex]._positionY = letterPosition.y;
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

        //shrink
        if (_overflow === Overflow.SHRINK) {
            if (_fontSize > 0 && this._isVerticalClamp()) {
                this._shrinkLabelToContentSize(this._isVerticalClamp);
            }
        }

        if (!this._updateQuads()) {
            if (_overflow === Overflow.SHRINK) {
                this._shrinkLabelToContentSize(this._isHorizontalClamp);
            }
        }
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

    _shrinkLabelToContentSize (lambda) {
        let fontSize = _fontSize;
        let originalLineHeight = _lineHeight;
        let fontAtlas = _fontAtlas;
        
        let i = 0;
        let tempLetterDefinition = fontAtlas.cloneLetterDefinition();
        let flag = true;

        while (lambda()) {
            ++i;

            let newFontSize = fontSize - i;
            flag = false;
            if (newFontSize <= 0) {
                break;
            }

            let scale = newFontSize / fontSize;
            fontAtlas.assignLetterDefinitions(tempLetterDefinition);
            fontAtlas.scaleFontLetterDefinition(scale);
            _lineHeight = originalLineHeight * scale;
            if (!_lineBreakWithoutSpaces) {
                this._multilineTextWrapByWord();
            } else {
                this._multilineTextWrapByChar();
            }
            this._computeAlignmentOffset();
        }

        _lineHeight = originalLineHeight;
        fontAtlas.assignLetterDefinitions(tempLetterDefinition);

        if (!flag) {
            if (fontSize - i >= 0) {
                this._scaleFontSizeDown(fontSize - i);
            }
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
        let letterDefinitions = _fontAtlas._letterDefinitions;
        let letterClamp = false;
        for (let ctr = 0, l = _string.length; ctr < l; ++ctr) {
            let letterInfo = _lettersInfo[ctr];
            if (letterInfo._valid) {
                let letterDef = letterDefinitions[letterInfo._char];

                let px = letterInfo._positionX + letterDef._width / 2 * _bmfontScale;
                let lineIndex = letterInfo._lineIndex;
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
        let letterDefinitions = _fontAtlas._letterDefinitions;
        
        let texture = _spriteFrame._texture;

        let renderData = _comp._renderData;
        renderData.dataLength = renderData.vertexCount = renderData.indiceCount = 0;

        let contentSize = _contentSize,
            appx = renderData._pivotX * contentSize.width,
            appy = renderData._pivotY * contentSize.height;
        
        let ret = true;
        for (let ctr = 0, l = _string.length; ctr < l; ++ctr) {
            let letterInfo = _lettersInfo[ctr];
            if (!letterInfo._valid) continue;
            let letterDef = letterDefinitions[letterInfo._char];

            _tmpRect.height = letterDef._height;
            _tmpRect.width = letterDef._width;
            _tmpRect.x = letterDef._u;
            _tmpRect.y = letterDef._v;

            let py = letterInfo._positionY + _letterOffsetY;

            if (_labelHeight > 0) {
                if (py > _tailoredTopY) {
                    let clipTop = py - _tailoredTopY;
                    _tmpRect.y += clipTop;
                    _tmpRect.height -= clipTop;
                    py = py - clipTop;
                }

                if (py - letterDef._height * _bmfontScale < _tailoredBottomY) {
                    _tmpRect.height = (py < _tailoredBottomY) ? 0 : (py - _tailoredBottomY);
                }
            }

            let lineIndex = letterInfo._lineIndex;
            let px = letterInfo._positionX + letterDef._width / 2 * _bmfontScale + _linesOffsetX[lineIndex];

            if (_labelWidth > 0) {
                if (this._isHorizontalClamped(px, lineIndex)) {
                    if (_overflow === Overflow.CLAMP) {
                        _tmpRect.width = 0;
                    } else if (_overflow === Overflow.SHRINK) {
                        if (_contentSize.width > letterDef._width) {
                            ret = false;
                            break;
                        } else {
                            _tmpRect.width = 0;
                        }
                    }
                }
            }

            if (_tmpRect.height > 0 && _tmpRect.width > 0) {
                let isRotated = _spriteFrame.isRotated();

                let originalSize = _spriteFrame._originalSize;
                let rect = _spriteFrame._rect;
                let offset = _spriteFrame._offset;
                let trimmedLeft = offset.x + (originalSize.width - rect.width) / 2;
                let trimmedTop = offset.y - (originalSize.height - rect.height) / 2;

                if(!isRotated) {
                    _tmpRect.x += (rect.x - trimmedLeft);
                    _tmpRect.y += (rect.y + trimmedTop);
                } else {
                    let originalX = _tmpRect.x;
                    _tmpRect.x = rect.x + rect.height - _tmpRect.y - _tmpRect.height - trimmedTop;
                    _tmpRect.y = originalX + rect.y - trimmedLeft;
                    if (_tmpRect.y < 0) {
                        _tmpRect.height = _tmpRect.height + trimmedTop;
                    }
                }

                let letterPositionX = letterInfo._positionX + _linesOffsetX[letterInfo._lineIndex];
                this.appendQuad(renderData, texture, _tmpRect, isRotated, letterPositionX - appx, py - appy, _bmfontScale);
            }
        }

        return ret;
    },

    appendQuad (renderData, texture, rect, rotated, x, y, scale) {
        let dataOffset = renderData.dataLength;
        
        renderData.dataLength += 4;
        renderData.vertexCount = renderData.dataLength;
        renderData.indiceCount = renderData.dataLength / 2 * 3;

        let data = renderData._data;
        let texw = texture.width,
            texh = texture.height;

        let rectWidth = rect.width,
            rectHeight = rect.height;

        let l, b, r, t;
        if (!rotated) {
            l = (rect.x) / texw;
            r = (rect.x + rectWidth) / texw;
            b = (rect.y + rectHeight) / texh;
            t = (rect.y) / texh;

            data[dataOffset].u = l;
            data[dataOffset].v = b;
            data[dataOffset+1].u = r;
            data[dataOffset+1].v = b;
            data[dataOffset+2].u = l;
            data[dataOffset+2].v = t;
            data[dataOffset+3].u = r;
            data[dataOffset+3].v = t;
        } else {
            l = (rect.x) / texw;
            r = (rect.x + rectHeight) / texw;
            b = (rect.y + rectWidth) / texh;
            t = (rect.y) / texh;

            data[dataOffset].u = l;
            data[dataOffset].v = t;
            data[dataOffset+1].u = l;
            data[dataOffset+1].v = b;
            data[dataOffset+2].u = r;
            data[dataOffset+2].v = t;
            data[dataOffset+3].u = r;
            data[dataOffset+3].v = b;
        }

        data[dataOffset].x = x;
        data[dataOffset].y = y - rectHeight * scale;
        data[dataOffset+1].x = x + rectWidth * scale;
        data[dataOffset+1].y = y - rectHeight * scale;
        data[dataOffset+2].x = x;
        data[dataOffset+2].y = y;
        data[dataOffset+3].x = x + rectWidth * scale;
        data[dataOffset+3].y = y;
    },

    _computeAlignmentOffset: function() {
        _linesOffsetX.length = 0;
        
        switch (_hAlign) {
            case cc.TextAlignment.LEFT:
                for (let i = 0; i < _numberOfLines; ++i) {
                    _linesOffsetX.push(0);
                }
                break;
            case cc.TextAlignment.CENTER:
                for (let i = 0, l = _linesWidth.length; i < l; i++) {
                    _linesOffsetX.push((_contentSize.width - _linesWidth[i]) / 2);
                }
                break;
            case cc.TextAlignment.RIGHT:
                for (let i = 0, l = _linesWidth.length; i < l; i++) {
                    _linesOffsetX.push(_contentSize.width - _linesWidth[i]);
                }
                break;
            default:
                break;
        }

        switch (_vAlign) {
            case cc.VerticalTextAlignment.TOP:
                _letterOffsetY = _contentSize.height;
                break;
            case cc.VerticalTextAlignment.CENTER:
                _letterOffsetY = (_contentSize.height + _textDesiredHeight) / 2;
                break;
            case cc.VerticalTextAlignment.BOTTOM:
                _letterOffsetY = _textDesiredHeight;
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
