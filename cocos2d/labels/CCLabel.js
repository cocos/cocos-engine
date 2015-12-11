/*global cc */

/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

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

var EventTarget = require("../cocos2d/core/event/event-target");

cc.FontLetterDefinition = function() {
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

cc.FontAtlas = function(fntConfig) {
    this._lineHeight = fntConfig.commonHeight;
    this._fontSize = fntConfig.fontSize;
    this._letterDefinitions = {};
    this._fntConfig = fntConfig;
};

cc.FontAtlas.prototype = {
    constructor: cc.FontAtlas,
    setFontSize: function(fontSize) {
        this._fontSize = fontSize;
    },
    getOriginalFontSize: function() {
        return this._fntConfig.fontSize;
    },
    addLetterDefinitions: function(letter, letterDefinition) {
        this._letterDefinitions[letter] = letterDefinition;
    },
    cloneLetterDefinition: function() {
        var copyLetterDefinitions = {};
        for (var key in this._letterDefinitions) {
            var value = new cc.FontLetterDefinition();
            cc.js.mixin(value, this._letterDefinitions[key]);
            copyLetterDefinitions[key] = value;
        }
        return copyLetterDefinitions;
    },
    assignLetterDefinitions: function(letterDefinition) {
        for (var key in this._letterDefinitions) {
            var newValue = letterDefinition[key];
            var oldValue = this._letterDefinitions[key];
            cc.js.mixin(oldValue, newValue);
        }
    },
    scaleFontLetterDefinition: function(scaleFactor) {
        for (var fontDefinition in this._letterDefinitions) {
            var letterDefinitions = this._letterDefinitions[fontDefinition];
            letterDefinitions._width *= scaleFactor;
            letterDefinitions._height *= scaleFactor;
            letterDefinitions._offsetX *= scaleFactor;
            letterDefinitions._offsetY *= scaleFactor;
            letterDefinitions._xAdvance *= scaleFactor;
        }
    },

    getLetterDefinitionForChar: function(char) {
        var hasKey = this._letterDefinitions.hasOwnProperty(char.charCodeAt(0));
        var letterDefinition;
        if (hasKey) {
            letterDefinition = this._letterDefinitions[char.charCodeAt(0)];
        } else {
            letterDefinition = null;
        }
        return letterDefinition;
    }
};

cc.LetterInfo = function() {
    this._char = "";
    this._valid = true;
    this._positionX = 0;
    this._positionY = 0;
    this._atlasIndex = 0;
    this._lineIndex = 0;
};

cc.Label = _ccsg.Node.extend({
    _hAlign: cc.TextAlignment.LEFT, //0 left, 1 center, 2 right
    _vAlign: cc.VerticalTextAlignment.TOP, //0 bottom,1 center, 2 top
    _string: "",
    _fontSize: 40,
    _overFlow: 0, //0 clamp, 1 shrink 2, resize to content
    _isWrapText: true,
    _spacingX: 0,

    _blendFunc: null,
    _isUseSystemFont: true,
    _labelSkinDirty: true,
    _labelType: 0, //0 is ttf, 1 is bmfont.
    _fontHandle: "", //a ttf font name or a bmfont file path.
    _lineSpacing: 0,

    _maxLineWidth:  0,
    _labelDimensions:  cc.size(0, 0),
    _labelWidth:  0,
    _labelHeight:  0,

    // max width until a line break is added
    _lineHeight: 40,
    _className: "Label",

    //fontHandle it is a font name or bmfont file.
    ctor: function(string, fontHandle, type) {
        EventTarget.call(this);

        fontHandle = fontHandle || "";
        this._fontHandle = fontHandle;
        type = type || 0;
        this._labelType = type;
        string = string || "";
        this._string = string;

        _ccsg.Node.prototype.ctor.call(this);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setContentSize(cc.size(128, 128));
        this._blendFunc = cc.BlendFunc._alphaNonPremultiplied();

        //init bmfont
        if (type === 1) {
            this._initBMFontWithString(this._string, this._fontHandle);
        } else {
            this.setFontFileOrFamily(fontHandle);
            this.setString(this._string);
        }
    },

    _resetBMFont: function() {
        this._imageOffset = cc.p(0, 0);
        this._cascadeColorEnabled = true;
        this._cascadeOpacityEnabled = true;
        this._fontAtlas = null;
        this._config = null;
        this._numberOfLines =  0;
        this._lettersInfo =  [];
        this._linesWidth =  [];
        this._linesOffsetX =  [];
        this._bmFontSize =  0;
        this._textDesiredHeight =  0;
        this._letterOffsetY =  0;
        this._tailoredTopY =  0;
        this._tailoredBottomY =  0;
        this._config =  null;
        this._fontAtlas =  null;
        this._bmfontScale =  1.0;
        this._additionalKerning =  0;
        this._horizontalKernings =  [];
        this._lineBreakWithoutSpaces =  false;

        this._reusedRect =  cc.rect(0, 0, 0, 0);
        this._textureLoaded = false;

        if (this._spriteBatchNode) {
            this.removeChild(this._spriteBatchNode);
            this._spriteBatchNode = null;
        }
    },
    isSystemFontUsed: function() {
        return this._isUseSystemFont;
    },

    setSystemFontUsed: function(value) {
        if (this._isUseSystemFont === value) return;

        if (value) {
            this.setFontFileOrFamily("Arial");
        }
        this._isUseSystemFont = value;
    },
    setHorizontalAlign: function(align) {
        if (this._hAlign === align) return;
        this._hAlign = align;
        this._notifyLabelSkinDirty();
    },

    getHorizontalAlign: function() {
        return this._hAlign;
    },

    setVerticalAlign: function(align) {
        if (this._vAlign === align) return;
        this._vAlign = align;
        this._notifyLabelSkinDirty();
    },

    getVerticalAlign: function() {
        return this._vAlign;
    },

    setString: function(string) {
        if (this._string === string) return;
        this._string = string;
        this._notifyLabelSkinDirty();
    },


    getString: function() {
        return this._string;
    },
    getStringLength: function() {
        return this._string.length;
    },

    enableWrapText: function(enabled) {
        if (this._isWrapText === enabled) return;
        //when label is in resize mode, wrap is disabled.
        if (this._overFlow === cc.Label.Overflow.RESIZE) {
            return;
        }
        this._isWrapText = enabled;
        this._rescaleWithOriginalFontSize();
        this._notifyLabelSkinDirty();
    },

    isWrapTextEnabled: function() {
        return this._isWrapText;
    },
    getFontName: function() {
        return this._fontHandle;
    },
    setFontSize: function(fntSize) {
        this._fontSize = fntSize;
        this._bmFontSize = fntSize;
        this._notifyLabelSkinDirty();
    },

    getFontSize: function() {
        return this._fontSize;
    },

    setOverflow: function(overflow) {
        if (this._overFlow === overflow) return;
        this._overFlow = overflow;
        if (this._overFlow === cc.Label.Overflow.RESIZE) {
            this._setDimensions(this._labelDimensions.width, 0);
            this._isWrapText = true;
        }
        this._rescaleWithOriginalFontSize();
        this._notifyLabelSkinDirty();
    },

    getOverflow: function() {
        return this._overFlow;
    },

    setSpacingX: function(spacing) {
        if (this._spacingX === spacing) return;
        this._spacingX = spacing;
    },

    setLineHeight: function(lineHeight) {
        if (this._lineHeight === lineHeight) return;
        this._lineHeight = lineHeight;
        this._notifyLabelSkinDirty();
    },
    setLineBreakWithoutSpace: function(lineBreakFlag) {
        if (this._lineBreakWithoutSpaces === lineBreakFlag) return;

        this._lineBreakWithoutSpaces = lineBreakFlag;
        this._notifyLabelSkinDirty();
    },
    getSpacingX: function() {
        return this._spacingX;
    },

    getLineHeight: function() {
        return this._lineHeight;
    },

    setFontFileOrFamily: function(fontHandle) {
        fontHandle = fontHandle || "Arial";
        var extName = cc.path.extname(fontHandle);

        this._resetBMFont();
        //specify font family name directly
        if (extName === null) {
            this._fontHandle = fontHandle;
            this._labelType = cc.Label.Type.TTF;
            this._notifyLabelSkinDirty();
            this._isUseSystemFont = true;
            return;
        }
        //add resource path
        fontHandle = cc.path.join(cc.loader.resPath, fontHandle);

        this._isUseSystemFont = false;
        if (extName === ".ttf") {
            this._labelType = cc.Label.Type.TTF;
            this._fontHandle = this._loadTTFFont(fontHandle);
        } else if (extName === ".fnt") {
            //todo add bmfont here
            this._labelType = cc.Label.Type.BMFont;
            this._initBMFontWithString(this._string, fontHandle);
        }
    },

    _loadTTFFont: function(fontHandle) {
        var ttfIndex = fontHandle.lastIndexOf(".ttf");
        if (ttfIndex === -1) return fontHandle;
        var slashPos = fontHandle.lastIndexOf("/");
        var fontFamilyName;
        if (slashPos === -1) fontFamilyName = fontHandle.substring(0, ttfIndex) + "_LABEL";
        else fontFamilyName = fontHandle.substring(slashPos + 1, ttfIndex) + "_LABEL";
        var self = this;
        if (FontFace) {
            var fontFace = new FontFace(fontFamilyName, "url('" + fontHandle + "')");
            fontFace.load().then(function(loadedFace) {
                document.fonts.add(loadedFace);
                self._notifyLabelSkinDirty();
            });
        } else {
            //fall back implementations
            var doc = document,
                fontStyle = document.createElement("style");
            fontStyle.type = "text/css";
            doc.body.appendChild(fontStyle);

            var fontStr = "";
            if (isNaN(fontFamilyName - 0))
                fontStr += "@font-face { font-family:" + fontFamilyName + "; src:";
            else
                fontStr += "@font-face { font-family:'" + fontFamilyName + "'; src:";

            fontStr += "url('" + fontHandle + "');";

            fontStyle.textContent = fontStr + "}";

            //<div style="font-family: PressStart;">.</div>
            var preloadDiv = document.createElement("div");
            var _divStyle = preloadDiv.style;
            _divStyle.fontFamily = fontFamilyName;
            preloadDiv.innerHTML = ".";
            _divStyle.position = "absolute";
            _divStyle.left = "-100px";
            _divStyle.top = "-100px";
            doc.body.appendChild(preloadDiv);
            self.scheduleOnce(self._notifyLabelSkinDirty, 2);
        }

        return fontFamilyName;
    },

    setContentSize: function(size, height) {
        var oldWidth = this._contentSize.width;
        var oldHeight = this._contentSize.height;
        if (this._labelType === cc.Label.Type.TTF) {
            _ccsg.Node.prototype.setContentSize.call(this, size, height);
            if (oldWidth === this._contentSize.width && oldHeight === this._contentSize.height) {
                return;
            }
            var newWidth = size.width || size;
            var newHeight = size.height || height;
            this._labelWidth = newWidth;
            this._labelHeight = newHeight;
            this._labelDimensions.width = newWidth;
            this._labelDimensions.height = newHeight;

            this._maxLineWidth = newWidth;

            this._notifyLabelSkinDirty();
        } else if (this._labelType === cc.Label.Type.BMFont) {
            if (!height) {
                if (oldWidth === size.width && oldHeight === size.height) {
                    return;
                }
                this._setDimensions(size.width, size.height);
            } else {
                if (oldWidth === size && oldHeight === height) {
                    return;
                }
                this._setDimensions(size, height);
            }
        }
    },

    setBlendFunc: function(src, dst) {
        var locBlendFunc = this._blendFunc;
        if (dst === undefined) {
            locBlendFunc.src = src.src;
            locBlendFunc.dst = src.dst;
        } else {
            locBlendFunc.src = src;
            locBlendFunc.dst = dst;
        }
    },


    getBlendFunc: function() {
        return new cc.BlendFunc(this._blendFunc.src, this._blendFunc.dst);
    },

    _notifyLabelSkinDirty: function() {
        if (CC_EDITOR) {
            if (this._labelType === cc.Label.Type.BMFont) {
                this._updateContent();
                this.setColor(this.color);
                this._labelSkinDirty = false;
            } else if (this._labelType === cc.Label.Type.TTF) {
                this._labelSkinDirty = true;
            }
        } else {
            this._labelSkinDirty = true;
        }
    },
    _createRenderCmd: function() {
        if (cc._renderType === cc.game.RENDER_TYPE_WEBGL)
            return new cc.Label.WebGLRenderCmd(this);
        else
            return new cc.Label.CanvasRenderCmd(this);
    },

    getContentSize: function(foreceUpdate) {
        if (foreceUpdate) {
            if (this._labelType === cc.Label.Type.BMFont && this._labelSkinDirty) {
                this._updateContent();
            }
        }
        return _ccsg.Node.prototype.getContentSize.call(this);
    }
});

cc.BMFontHelper = {
    _alignText: function() {
        var ret = true;

        do {
            if (!this._spriteBatchNode) return true;


            this._textDesiredHeight = 0;
            this._linesWidth = [];
            if (this._maxLineWidth > 0 && !this._lineBreakWithoutSpaces) {
                this._multilineTextWrapByWord();
            } else {
                this._multilineTextWrapByChar();
            }

            this._computeAlignmentOffset();

            //shrink
            if (this._overFlow === cc.Label.Overflow.SHRINK) {
                var fontSize = this.getFontSize();

                if (fontSize > 0 && this._isVerticalClamp()) {
                    this._shrinkLabelToContentSize(this._isVerticalClamp.bind(this));
                }
            }

            if (!this._updateQuads()) {
                ret = false;
                if (this._overFlow === cc.Label.Overflow.SHRINK) {
                    this._shrinkLabelToContentSize(this._isHorizontalClamp.bind(this));
                }
                break;
            }
        } while (0);

        return ret;
    },

    _isHorizontalClamped : function(px, lineIndex){
        var wordWidth = this._linesWidth[lineIndex];
        var letterOverClamp = (px > this._contentSize.width || px < 0);

        if(!this._isWrapText){
            return letterOverClamp;
        }else{
            return (wordWidth > this._contentSize.width && letterOverClamp);
        }
    },

    _updateQuads: function() {
        var ret = true;

        this._spriteBatchNode.removeAllChildren();


        var letterClamp = false;
        for (var ctr = 0; ctr < this._string.length; ++ctr) {
            if (this._lettersInfo[ctr]._valid) {
                var letterDef = this._fontAtlas._letterDefinitions[this._lettersInfo[ctr]._char];

                this._reusedRect.height = letterDef._height;
                this._reusedRect.width = letterDef._width;
                this._reusedRect.x = letterDef._u;
                this._reusedRect.y = letterDef._v;

                var py = this._lettersInfo[ctr]._positionY + this._letterOffsetY;

                if (this._labelHeight > 0) {
                    if (py > this._tailoredTopY) {
                        var clipTop = py - this._tailoredTopY;
                        this._reusedRect.y += clipTop;
                        this._reusedRect.height -= clipTop;
                        py = py - clipTop;
                    }

                    if (py - letterDef._height * this._bmfontScale < this._tailoredBottomY) {
                        this._reusedRect.height = (py < this._tailoredBottomY) ? 0 : (py - this._tailoredBottomY);
                    }
                }

                var lineIndex = this._lettersInfo[ctr]._lineIndex;
                var px = this._lettersInfo[ctr]._positionX + letterDef._width / 2 * this._bmfontScale + this._linesOffsetX[lineIndex];


                if (this._labelWidth > 0) {
                    if (this._isHorizontalClamped(px, lineIndex)) {
                        if (this._overFlow === cc.Label.Overflow.CLAMP) {
                            this._reusedRect.width = 0;
                        } else if (this._overFlow === cc.Label.Overflow.SHRINK) {
                            if (this._contentSize.width > letterDef._width) {
                                letterClamp = true;
                                ret = false;
                                break;
                            } else {
                                this._reusedRect.width = 0;
                            }
                        }
                    }
                }


                if (this._reusedRect.height > 0 && this._reusedRect.width > 0) {
                    var fontChar = this.getChildByTag(ctr);
                    var locTexture = this._spriteBatchNode._renderCmd._texture || this._spriteBatchNode.textureAtlas.texture;

                    if (!fontChar) {
                        fontChar = new cc.Sprite();
                        fontChar.initWithTexture(locTexture);
                        fontChar.setAnchorPoint(cc.p(0, 1));
                    }

                    fontChar.setTextureRect(this._reusedRect, false, this._reusedRect.size);

                    var letterPositionX = this._lettersInfo[ctr]._positionX + this._linesOffsetX[this._lettersInfo[ctr]._lineIndex];
                    fontChar.setPosition(letterPositionX, py);

                    var index = this._spriteBatchNode.getChildrenCount();

                    this._lettersInfo[ctr]._atlasIndex = index;

                    this._updateLetterSpriteScale(fontChar);

                    // this._spriteBatchNode.insertQuadFromSprite(this._reusedLetter, index);
                    this._spriteBatchNode.addChild(fontChar);

                }
            }
        }

        return ret;
    },

    _updateLetterSpriteScale: function(sprite) {
        if (this._labelType === cc.Label.Type.BMFont && this._fontSize > 0) {
            sprite.setScale(this._bmfontScale);
        }
    },

    _recordPlaceholderInfo: function(letterIndex, char) {
        if (letterIndex >= this._lettersInfo.length) {
            var tmpInfo = new cc.LetterInfo();
            this._lettersInfo.push(tmpInfo);
        }

        this._lettersInfo[letterIndex]._char = char;
        this._lettersInfo[letterIndex]._valid = false;
    },

    _recordLetterInfo: function(letterPosition, character, letterIndex, lineIndex) {
        if (letterIndex >= this._lettersInfo.length) {
            var tmpInfo = new cc.LetterInfo();
            this._lettersInfo.push(tmpInfo);
        }
        character = character.charCodeAt(0);

        this._lettersInfo[letterIndex]._lineIndex = lineIndex;
        this._lettersInfo[letterIndex]._char = character;
        this._lettersInfo[letterIndex]._valid = this._fontAtlas._letterDefinitions[character]._validDefinition;
        this._lettersInfo[letterIndex]._positionX = letterPosition.x;
        this._lettersInfo[letterIndex]._positionY = letterPosition.y;
    },

    _setDimensions: function(width, height) {
        if (this._overFlow === cc.Label.Overflow.RESIZE) {
            height = 0;
        }
        if (height !== this._labelHeight || width !== this._labelWidth) {
            this._labelWidth = width;
            this._labelHeight = height;
            this._labelDimensions.width = width;
            this._labelDimensions.height = height;

            this._maxLineWidth = width;
            if (this._overFlow === cc.Label.Overflow.SHRINK) {
                if (this._bmFontSize > 0) {
                    this._restoreFontSize();
                }
            }
            this._notifyLabelSkinDirty();
        }
    },

    _restoreFontSize: function() {
        if (this._labelType === cc.Label.Type.BMFont) {
            this._fontSize = this._bmFontSize;
        }
    },

    _multilineTextWrap: function(nextTokenFunc) {
        var textLen = this.getStringLength();
        var lineIndex = 0;
        var nextTokenX = 0;
        var nextTokenY = 0;
        var longestLine = 0;
        var letterRight = 0;

        var contentScaleFactor = cc.contentScaleFactor();
        var lineSpacing = this._lineSpacing * contentScaleFactor;
        var highestY = 0;
        var lowestY = 0;
        var letterDef = null;
        var letterPosition = cc.p(0, 0);

        this._updateBMFontScale();

        for (var index = 0; index < textLen;) {
            var character = this._string.charAt(index);
            if (character === "\n") {
                this._linesWidth.push(letterRight);
                letterRight = 0;
                lineIndex++;
                nextTokenX = 0;
                nextTokenY -= this._lineHeight * this._bmfontScale + lineSpacing;
                this._recordPlaceholderInfo(index, character);
                index++;
                continue;
            }

            var tokenLen = nextTokenFunc(this._string, index, textLen);
            var tokenHighestY = highestY;
            var tokenLowestY = lowestY;
            var tokenRight = letterRight;
            var nextLetterX = nextTokenX;
            var newLine = false;

            for (var tmp = 0; tmp < tokenLen; ++tmp) {
                var letterIndex = index + tmp;
                character = this._string.charAt(letterIndex);
                if (character === "\r") {
                    this._recordPlaceholderInfo(letterIndex, character);
                    continue;
                }
                letterDef = this._fontAtlas.getLetterDefinitionForChar(character);
                if (!letterDef) {
                    this._recordPlaceholderInfo(letterIndex, character);
                    console.log("Can't find letter definition in font file for letter:" + character);
                    continue;
                }

                var letterX = (nextLetterX + letterDef._offsetX * this._bmfontScale) / contentScaleFactor;

                if (this._isWrapText
                    && this._maxLineWidth > 0
                    && nextTokenX > 0
                    && letterX + letterDef._width * this._bmfontScale > this._maxLineWidth
                    && !this._isspace_unicode(character)) {
                    this._linesWidth.push(letterRight);
                    letterRight = 0;
                    lineIndex++;
                    nextTokenX = 0;
                    nextTokenY -= (this._lineHeight * this._bmfontScale + lineSpacing);
                    newLine = true;
                    break;
                } else {
                    letterPosition.x = letterX;
                }

                letterPosition.y = (nextTokenY - letterDef._offsetY * this._bmfontScale) / contentScaleFactor;
                this._recordLetterInfo(letterPosition, character, letterIndex, lineIndex);

                if (letterIndex + 1 < this._horizontalKernings.length && letterIndex < textLen - 1) {
                    nextLetterX += this._horizontalKernings[letterIndex + 1];
                }

                nextLetterX += letterDef._xAdvance * this._bmfontScale + this._additionalKerning;

                tokenRight = letterPosition.x + letterDef._width * this._bmfontScale;

                if (tokenHighestY < letterPosition.y) {
                    tokenHighestY = letterPosition.y;
                }

                if (tokenLowestY > letterPosition.y - letterDef._height * this._bmfontScale) {
                    tokenLowestY = letterPosition.y - letterDef._height * this._bmfontScale;
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

        this._linesWidth.push(letterRight);

        this._numberOfLines = lineIndex + 1;
        this._textDesiredHeight = (this._numberOfLines * this._lineHeight * this._bmfontScale) / contentScaleFactor;
        if (this._numberOfLines > 1) {
            this._textDesiredHeight += (this._numberOfLines - 1) * this._lineSpacing;
        }

        var contentSize = cc.size(this._labelWidth, this._labelHeight);
        if (this._labelWidth <= 0) {
            contentSize.width = longestLine;
        }
        if (this._labelHeight <= 0) {
            contentSize.height = this._textDesiredHeight;
        }
        _ccsg.Node.prototype.setContentSize.call(this, contentSize);

        this._tailoredTopY = contentSize.height;
        this._tailoredBottomY = 0;
        if (highestY > 0) {
            this._tailoredTopY = contentSize.height + highestY;
        }
        if (lowestY < -this._textDesiredHeight) {
            this._tailoredBottomY = this._textDesiredHeight + lowestY;
        }

        return true;
    },

    _multilineTextWrapByWord: function() {
        return this._multilineTextWrap(this._getFirstWordLen.bind(this));
    },

    _multilineTextWrapByChar: function() {
        return this._multilineTextWrap(this._getFirstCharLen.bind(this));
    },

    _isVerticalClamp: function() {
        if (this._textDesiredHeight > this._contentSize.height) {
            return true;
        } else {
            return false;
        }
    },

    _isHorizontalClamp: function() {
        var letterClamp = false;

        for (var ctr = 0; ctr < this.getStringLength(); ++ctr) {
            if (this._lettersInfo[ctr]._valid) {
                var letterDef = this._fontAtlas._letterDefinitions[this._lettersInfo[ctr]._char];

                var px = this._lettersInfo[ctr]._positionX + letterDef._width / 2 * this._bmfontScale;
                var lineIndex = this._lettersInfo[ctr]._lineIndex;
                if (this._labelWidth > 0) {
                    if (!this._isWrapText) {
                        if(px > this._contentSize.width){
                            letterClamp = true;
                            break;
                        }
                    }else{
                        var wordWidth = this._linesWidth[lineIndex];
                        if(wordWidth > this._contentSize.width && (px > this._contentSize.width || px < 0)){
                            letterClamp = true;
                            break;
                        }
                    }
                }
            }
        }

        return letterClamp;
    },

    _shrinkLabelToContentSize: function(lambda) {
        var fontSize = this.getFontSize();

        var i = 0;
        var tempLetterDefinition = this._fontAtlas.cloneLetterDefinition();
        var originalLineHeight = this._lineHeight;
        var flag = true;

        while (lambda()) {
            ++i;

            var newFontSize = fontSize - i;
            flag = false;
            if (newFontSize <= 0) {
                break;
            }

            var scale = newFontSize / fontSize;
            this._fontAtlas.assignLetterDefinitions(tempLetterDefinition);
            this._fontAtlas.scaleFontLetterDefinition(scale);
            this._lineHeight = originalLineHeight * scale;
            if (this._maxLineWidth > 0 && !this._lineBreakWithoutSpaces) {
                this._multilineTextWrapByWord();
            } else {
                this._multilineTextWrapByChar();
            }
            this._computeAlignmentOffset();
        }

        this._lineHeight = originalLineHeight;
        this._fontAtlas.assignLetterDefinitions(tempLetterDefinition);

        if (!flag) {
            if (fontSize - i >= 0) {
                this._scaleFontSizeDown(fontSize - i);
            }
        }
    },

    _scaleFontSizeDown: function(fontSize) {
        var shouldUpdateContent = true;
        //1 is BMFont
        if (this._labelType === cc.Label.Type.BMFont) {
            if (!fontSize) {
                fontSize = 0.1;
                shouldUpdateContent = false;
            }
            this._fontSize = fontSize;
        }
        if (shouldUpdateContent) {
            this._updateContent();
        }
    },

    _updateContent: function() {
        var updateFinished = true;

        if (this._fontAtlas) {
            this._computeHorizontalKerningForText(this._string);
            updateFinished = this._alignText();
        }
        if (updateFinished) {
            this._labelSkinDirty = false;
        }
    },


    _computeAlignmentOffset: function() {
        this._linesOffsetX = [];
        switch (this._hAlign) {
            case cc.TextAlignment.LEFT:
                for (var i = 0; i < this._numberOfLines; ++i) {
                    this._linesOffsetX.push(0);
                }
                break;
            case cc.TextAlignment.CENTER:
                this._linesWidth.forEach(function(lineWidth) {
                    this._linesOffsetX.push((this._contentSize.width - lineWidth) / 2);
                }.bind(this));
                break;
            case cc.TextAlignment.RIGHT:
                this._linesWidth.forEach(function(lineWidth) {
                    this._linesOffsetX.push(this._contentSize.width - lineWidth);
                }.bind(this));
                break;
            default:
                break;
        }

        switch (this._vAlign) {
            case cc.VerticalTextAlignment.TOP:
                this._letterOffsetY = this._contentSize.height;
                break;
            case cc.VerticalTextAlignment.CENTER:
                this._letterOffsetY = (this._contentSize.height + this._textDesiredHeight) / 2;
                break;
            case cc.VerticalTextAlignment.BOTTOM:
                this._letterOffsetY = this._textDesiredHeight;
                break;
            default:
                break;
        }
    },

    _getFirstCharLen: function(text, startIndex, textLen) {
        return 1;
    },

    _isCJK_unicode: function(ch) {
        var __CHINESE_REG = /^[\u4E00-\u9FFF\u3400-\u4DFF]+$/;
        var __JAPANESE_REG = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
        var __KOREAN_REG = /^[\u1100-\u11FF]|[\u3130-\u318F]|[\uA960-\uA97F]|[\uAC00-\uD7AF]|[\uD7B0-\uD7FF]+$/;
        return __CHINESE_REG.test(ch) || __JAPANESE_REG.test(ch) || __KOREAN_REG.test(ch);
    },

    //Checking whether the character is a whitespace
    _isspace_unicode: function(ch) {
        ch = ch.charCodeAt(0);
        return ((ch >= 9 && ch <= 13) || ch === 32 || ch === 133 || ch === 160 || ch === 5760 || (ch >= 8192 && ch <= 8202) || ch === 8232 || ch === 8233 || ch === 8239 || ch === 8287 || ch === 12288);
    },

    _getFirstWordLen: function(text, startIndex, textLen) {
        var character = text.charAt(startIndex);
        if (this._isCJK_unicode(character) || character === "\n" || this._isspace_unicode(character)) {
            return 1;
        }

        var len = 1;
        for (var index = startIndex + 1; index < textLen; ++index) {
            character = text.charAt(index);
            if (character === "\n" || this._isspace_unicode(character) || this._isCJK_unicode(character)) {
                break;
            }
            len++;
        }

        return len;
    },

    _updateBMFontScale: function() {
        if (this._labelType === cc.Label.Type.BMFont) {
            var originalFontSize = this._fontAtlas._fontSize;
            this._bmfontScale = this._fontSize * cc.contentScaleFactor() / originalFontSize;
        } else {
            this._bmfontScale = 1;
        }

    },

    _initBMFontWithString: function(str, fntFile) {
        var self = this;
        if (self._config) {
            cc.log("cc.Label._initBMFontWithString(): re-init is no longer supported");
            return false;
        }
        this._string = str;
        this._setBMFontFile(fntFile);
    },

    _createSpriteBatchNode: function(texture) {

        this._spriteBatchNode = new cc.SpriteBatchNode(texture, this._string.length);
        this._spriteBatchNode.setCascadeColorEnabled(true);
        this._spriteBatchNode.setCascadeOpacityEnabled(true);
        this.addChild(this._spriteBatchNode);

        this._updateContent();
        this.setColor(this.color);
    },
    //this method is used as createFontAtlas
    _createFontChars: function() {
        if (!this._config) {
            return;
        }

        this._fontAtlas = new cc.FontAtlas(this._config);

        if(!this._lineHeight){
            this._lineHeight = this._fontAtlas._lineHeight;
        }

        var locCfg = this._config;
        var locFontDict = locCfg.fontDefDictionary;

        for (var fontDef in locFontDict) {
            var letterDefinition = new cc.FontLetterDefinition();

            var tempRect = locFontDict[fontDef].rect;
            cc.rectPointsToPixels(tempRect);


            letterDefinition._offsetX = locFontDict[fontDef].xOffset;
            letterDefinition._offsetY = locFontDict[fontDef].yOffset;
            letterDefinition._width = tempRect.width;
            letterDefinition._height = tempRect.height;
            letterDefinition._u = tempRect.x + this._imageOffset.x;
            letterDefinition._v = tempRect.y + this._imageOffset.y;
            //FIXME: only one texture supported for now
            letterDefinition._textureID = 0;
            letterDefinition._validDefinition = true;
            letterDefinition._xAdvance = locFontDict[fontDef].xAdvance;

            this._fontAtlas.addLetterDefinitions(fontDef, letterDefinition);
        }
    },

    _rescaleWithOriginalFontSize: function() {
        var renderingFontSize = this.getFontSize();
        if (this._bmFontSize - renderingFontSize >= 1 && this._overFlow === cc.Label.Overflow.SHRINK) {
            this._scaleFontSizeDown(this._bmFontSize);
        }
    },

    _computeHorizontalKerningForText: function(text) {
        var stringLen = this.getStringLength();
        var locKerningDict = this._config.kerningDict;

        var prev = -1;
        for (var i = 0; i < stringLen; ++i) {
            var key = this._string.charCodeAt(i);
            var kerningAmount = locKerningDict[(prev << 16) | (key & 0xffff)] || 0;
            if (i < stringLen - 1) {
                this._horizontalKernings[i] = kerningAmount;
            } else {
                this._horizontalKernings[i] = 0;
            }
            prev = key;
        }
    },

    _setBMFontFile: function(filename) {
        if (filename) {
            this._fontHandle = filename;
            var self = this;
            if (this._labelType === cc.Label.Type.BMFont) {

                this._resetBMFont();

                var texture;
                cc.loader.load(this._fontHandle, function(err, results) {
                    if (err) {
                        cc.log("cc.Label._initBMFontWithString(): Impossible to create font. Please check file");
                    }

                    self._config = results[0];
                    self._createFontChars();
                    texture = cc.textureCache.addImage(self._config.atlasName);
                    var locIsLoaded = texture.isLoaded();
                    self._textureLoaded = locIsLoaded;
                    if (!locIsLoaded) {
                        texture.once("load", function(event) {
                            var self = this;

                            if (!self._spriteBatchNode) {
                                self._createSpriteBatchNode(texture);
                            }
                            self._textureLoaded = true;
                            self.emit("load");
                        }, self);
                    } else {
                        self._createSpriteBatchNode(texture);
                    }
                });
            }
        }
    }
};


var _p = cc.Label.prototype;
cc.js.addon(_p, EventTarget.prototype);
cc.js.mixin(_p, cc.BMFontHelper);

cc.Label.Type = cc.Enum({
    TTF: 0,
    BMFont: 1
});
cc.Label.Overflow = cc.Enum({
    CLAMP: 0,
    SHRINK: 1,
    RESIZE: 2
});
