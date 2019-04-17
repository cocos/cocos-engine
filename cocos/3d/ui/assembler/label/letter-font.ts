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

import { ImageAsset, RenderTexture, SpriteFrame } from '../../../../assets';
import { Color, Rect, Size, Vec2 } from '../../../../core';
import { mixin } from '../../../../core/utils/js';
import { isUnicodeCJK, isUnicodeSpace, safeMeasureText} from '../../../../core/utils/text-utils';
import { GFXBufferTextureCopy } from '../../../../gfx/define';
import { LabelComponent } from '../../components/label-component';
import { LabelOutlineComponent } from '../../components/label-outline-component';
// import { UIComponent } from '../../components/ui-component';
import { ISharedLabelData } from './font-utils';

// const OUTLINE_SUPPORTED = cc.js.isChildClassOf(LabelOutlineComponent, UIComponent);
const Overflow = LabelComponent.Overflow;
const WHITE = cc.Color.WHITE;
const space = 2;
const TextAlignment = LabelComponent.HorizontalAlign;
const VerticalTextAlignment = LabelComponent.VerticalAlign;

interface ILabelInfo {
    fontSize: number;
    lineHeight: number;
    hash: string;
    fontFamily: string;
    fontDesc: string;
    hAlign: number;
    vAlign: number;
    color: Color;
    isOutlined: boolean;
    out: Color;
    margin: number;
}

class LetterInfo {
    public char = '';
    public valid = true;
    public x = 0;
    public y = 0;
    public line = 0;
    public hash = '';
}

class FontLetterDefinition {
    public u = 0;
    public v = 0;
    public w = 0;
    public h = 0;
    public texture: RenderTexture | null = null;
    public offsetX = 0;
    public offsetY = 0;
    public valid = false;
    public xAdvance = 0;
}

const _backgroundStyle = 'rgba(255, 255, 255, 0.005)';

class LetterTexture {
    public texture: SpriteFrame | null = null;
    public labelInfo: ILabelInfo;
    public char: string;
    public data: ISharedLabelData | null  = null;
    public canvas: HTMLCanvasElement | null = null;
    public context: CanvasRenderingContext2D | null = null;
    public width = 0;
    public height = 0;
    public hash: string;
    constructor (char: string, labelInfo: ILabelInfo) {
        this.char = char;
        this.labelInfo = labelInfo;
        this.hash = char.charCodeAt(0) + labelInfo.hash;
    }

    public updateRenderData () {
        this._updateProperties();
        this._updateTexture();
    }

    public destroy () {
        this.texture!.destroy();
        this.texture = null;
        // LabelComponent._canvasPool.put(this._data);
    }

    private _updateProperties () {
        this.texture = new SpriteFrame();
        this.data = LabelComponent.CanvasPool.get();
        this.canvas = this.data.canvas;
        this.context = this.data.context;
        if (this.context){
            this.context.font = this.labelInfo.fontDesc;
            const width = safeMeasureText(this.context, this.char);
            this.width = parseFloat(width.toFixed(2));
            this.height = this.labelInfo.fontSize;
        }

        if (this.canvas.width !== this.width || CC_QQPLAY) {
            this.canvas.width = this.width;
        }

        if (this.canvas.height !== this.height) {
            this.canvas.height = this.height;
        }

        // this.texture.initWithElement(this.canvas);
        const image = new ImageAsset(this.canvas);
        this.texture.image = image;
    }

    private _updateTexture () {
        if (!this.context || !this.canvas){
            return;
        }

        const context = this.context;
        const labelInfo = this.labelInfo;
        const width = this.canvas.width;
        const height = this.canvas.height;

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.clearRect(0, 0, width, height);
        // Add a white background to avoid black edges.
        context.fillStyle = _backgroundStyle;
        context.fillRect(0, 0, width, height);
        context.font = labelInfo.fontDesc;

        const startX = width / 2;
        const startY = height / 2;
        const color = labelInfo.color;
        // use round for line join to avoid sharp intersect point
        context.lineJoin = 'round';
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${1})`;
        if (labelInfo.isOutlined) {
            const strokeColor = labelInfo.out || WHITE;
            context.strokeStyle = `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${strokeColor.a / 255})`;
            context.lineWidth = labelInfo.margin * 2;
            context.strokeText(this.char, startX, startY);
        }
        context.fillText(this.char, startX, startY);

        // this.texture.handleLoadedTexture();
        this.texture!.updateImage();
    }
}

export class LetterAtlas {
    get width () {
        return this._width;
    }

    get height () {
        return this._height;
    }

    public texture: RenderTexture;
    private _x = space;
    private _y = space;
    private _nexty = space;
    private _width = 0;
    private _height = 0;
    private _letterDefinitions = new Map<string, FontLetterDefinition>();
    private _imageAssets: ImageAsset[] = [];
    private _dirty = false;

    constructor (width: number, height: number) {
        this.texture = new RenderTexture();
        this.texture.initWithSize(width, height);

        this._width = width;
        this._height = height;
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLoad, this);
    }

    public insertLetterTexture (letterTexture: LetterTexture) {
        const texture = letterTexture.texture;
        const device = cc.director.root.device;
        if (!texture || !this.texture || !device || !texture.image) {
            return null;
        }

        const width = texture.width;
        const height = texture.height;

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

        console.log('drawtexture   ' + this._x + '   ' + this._y);
        this.texture.drawTextureAt(texture, this._x, this._y);

        this._dirty = true;

        const letterDefinition = new FontLetterDefinition();
        letterDefinition.u = this._x;
        letterDefinition.v = this._y;
        letterDefinition.texture = this.texture;
        letterDefinition.valid = true;
        letterDefinition.w = letterTexture.width;
        letterDefinition.h = letterTexture.height;
        letterDefinition.xAdvance = letterTexture.width;

        this._x += width + space;

        this._letterDefinitions.set(letterTexture.hash, letterDefinition);

        const region = new GFXBufferTextureCopy();
        region.texOffset.x = letterDefinition.offsetX;
        region.texOffset.y = letterDefinition.offsetY;
        region.texExtent.width = letterDefinition.w;
        region.texExtent.height = letterDefinition.h;

        return letterDefinition;
    }

    public update () {
        if (!this._dirty) {
            return;
        }
        // this.texture.update();
        this._dirty = false;
    }

    public reset () {
        this._x = space;
        this._y = space;
        this._nexty = space;

        // const chars = this._letterDefinitions;
        // for (let i = 0, l = (Object.keys(chars)).length; i < l; i++) {
        //     const char = chars[i];
        //     if (!char.valid) {
        //         continue;
        //     }
        //     char.destroy();
        // }

        // this._letterDefinitions = createMap();
        this._letterDefinitions.clear();
    }

    public destroy () {
        this.reset();
        if (this.texture){
            this.texture.destroy();
        }
    }

    public beforeSceneLoad () {
        this.destroy();

        const texture = new RenderTexture();
        texture.initWithSize(this._width, this._height);
        // texture.update();

        this.texture = texture;
    }

    public getLetter (key: string) {
        return this._letterDefinitions.get(key);
    }

    public addLetterDefinitions (key: string, letterDefinition: FontLetterDefinition) {
        this._letterDefinitions[key] = letterDefinition;
    }

    public cloneLetterDefinition () {
        const copyLetterDefinitions = {};
        for (const key of Object.keys(this._letterDefinitions)) {
            const value = new FontLetterDefinition();
            mixin(value, this._letterDefinitions[key]);
            copyLetterDefinitions[key] = value;
        }
        return copyLetterDefinitions;
    }

    public assignLetterDefinitions (letterDefinitions: Map<string, FontLetterDefinition> ) {
        letterDefinitions.forEach((value, key) => {
            const oldValue = this._letterDefinitions[key];
            mixin(oldValue, value);
        });
    }

    public scaleFontLetterDefinition (scaleFactor: number) {
        for (const fontDefinition of Object.keys(this._letterDefinitions)) {
            const letterDefinitions = this._letterDefinitions[fontDefinition];
            letterDefinitions.w *= scaleFactor;
            letterDefinitions.h *= scaleFactor;
            letterDefinitions.offsetX *= scaleFactor;
            letterDefinitions.offsetY *= scaleFactor;
            letterDefinitions.xAdvance *= scaleFactor;
        }
    }

    public getLetterDefinitionForChar (char: string, labelInfo: ILabelInfo) {
        const hash = char.charCodeAt(0) + labelInfo.hash;
        let letterDefinition: FontLetterDefinition | null | undefined = this._letterDefinitions.get(hash);
        if (!letterDefinition) {
            const temp = new LetterTexture(char, labelInfo);
            temp.updateRenderData();
            letterDefinition = this.insertLetterTexture(temp);
            temp.destroy();
        }

        return letterDefinition;
    }

    private _makeFrameBuffer (){
        if (!cc.director.root || !cc.director.root.device){
            return null;
        }

        return cc.director.root.device.createFramebuffer({});
    }

    private _makeContainer (width: number, height: number){
        const texture =  new SpriteFrame();
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = width;
        canvas.height = height;
        const image = new ImageAsset(canvas);
        texture.image = image;
        return texture;
    }
}

const _tmpRect = new Rect();

let _comp: LabelComponent | null = null;

const _horizontalKernings: number[] = [];
const _lettersInfo: LetterInfo[] = [];
const _linesWidth: number[] = [];
const _linesOffsetX: number[] = [];
const _labelDimensions = new Size();

let _fontAtlas: LetterAtlas | null = null;
const _fntConfig = null;
let _numberOfLines = 0;
let _textDesiredHeight = 0;
let _letterOffsetY = 0;
let _tailoredTopY = 0;
let _tailoredBottomY = 0;
let _bmfontScale = 1.0;
const _lineBreakWithoutSpaces = false;
const _lineSpacing = 0;
let _string = '';
let _fontSize = 0;
let _originFontSize = 0;
const _contentSize = new Size();
let _hAlign = 0;
let _vAlign = 0;
let _spacingX = 0;
let _lineHeight = 0;
let _overflow = 0;
let _isWrapText = false;
let _labelWidth = 0;
let _labelHeight = 0;
let _maxLineWidth = 0;
const _atlasWidth = 256;
const _atlasHeight = 256;
let _fontFamily = '';
let _isBold = false;
const _labelInfo: ILabelInfo = {
    fontSize: 0,
    lineHeight: 0,
    hash: '',
    fontFamily: '',
    fontDesc: 'Arial',
    hAlign: 0,
    vAlign: 0,
    color: WHITE,
    isOutlined: false,
    out: WHITE,
    margin: 0,
};

export const letterFont = {
    getAssemblerData () {
        if (!_fontAtlas) {
            _fontAtlas = new LetterAtlas(_atlasWidth, _atlasHeight);
        }

        return _fontAtlas.texture;
    },

    updateRenderData (comp: LabelComponent) {
        if (!comp.renderData || !comp.renderData.vertDirty) {
            return;
        }

        if (_comp === comp) {
            return;
        }

        _comp = comp;

        this._updateFontFamily(comp);
        _labelInfo.fontFamily = _fontFamily;

        this._updateProperties();
        _labelInfo.fontDesc = this._getFontDesc();

        this._updateContent();

        // _comp._actualFontSize = _fontSize;
        _comp.node.setContentSize(_contentSize);

        _comp.renderData!.vertDirty = _comp.renderData!.uvDirty = false;

        _comp = null;

        this._resetProperties();
    },

    _updateFontScale () {
        _bmfontScale = _fontSize / _originFontSize;
    },

    _updateProperties () {
        if (!_comp){
            return;
        }

        _string = _comp.string.toString();
        _fontSize = _comp.fontSize;
        _originFontSize = _fontSize;
        const contentSize = _comp.node.getContentSize();
        _contentSize.width = contentSize.width;
        _contentSize.height = contentSize.height;
        _hAlign = _comp.horizontalAlign;
        _vAlign = _comp.verticalAlign;
        _spacingX = _comp.spacingX;
        _overflow = _comp.overflow;
        _lineHeight = _comp.lineHeight;
        _isBold = _comp.isBold;

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
        const outline = /*OUTLINE_SUPPORTED && */_comp.getComponent(LabelOutlineComponent);
        if (outline && outline.enabled) {
            _labelInfo.isOutlined = true;
            _labelInfo.margin = outline.width;
            _labelInfo.out = outline.color;
            _labelInfo.out.a = outline.color.a * _comp.color.a / 255.0;
        }
        else {
            _labelInfo.isOutlined = false;
            _labelInfo.margin = 0;
        }

        _labelInfo.lineHeight = _lineHeight;
        _labelInfo.fontSize = _fontSize;
        _labelInfo.fontFamily = _fontFamily;
        _labelInfo.color = _comp.color;
        _labelInfo.hash = this._computeHash(_labelInfo);

        this._setupBMFontOverflowMetrics();

    },

    _updateFontFamily (comp: LabelComponent) {
        if (!comp.useSystemFont) {
            if (comp.font) {
                if (comp.font._nativeAsset) {
                    _fontFamily = comp.font._nativeAsset;
                }
                else {
                    _fontFamily = cc.loader.getRes(comp.font.nativeUrl);
                    if (!_fontFamily) {
                        cc.loader.load(comp.font.nativeUrl, (err, fontFamily) => {
                            _fontFamily = fontFamily || 'Arial';
                            if (comp.font){
                                comp.font._nativeAsset = fontFamily;
                            }

                            comp.updateRenderData(true);
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

    _computeHash (labelInfo: ILabelInfo) {
        const hashData = '';
        const color = labelInfo.color.toHEX('#rrggbb');
        let out = '';
        if (labelInfo.isOutlined) {
            out = labelInfo.out.toHEX('#rrggbb');
        }

        return hashData + labelInfo.fontSize + labelInfo.fontFamily + color + out;
    },

    _getFontDesc () {
        let fontDesc = _fontSize.toString() + 'px ';
        fontDesc = fontDesc + _fontFamily;
        if (_isBold) {
            fontDesc = 'bold ' + fontDesc;
        }

        return fontDesc;
    },

    _resetProperties () {

    },

    _updateContent () {
        this._updateFontScale();
        // this._computeHorizontalKerningForText();
        this._alignText();
    },

    _computeHorizontalKerningForText () {
        // const string = _string;
        // const stringLen = string.length;

        // const kerningDict = _fntConfig.kerningDict;
        // const horizontalKernings = _horizontalKernings;

        // let prev = -1;
        // for (let i = 0; i < stringLen; ++i) {
        //     const key = string.charCodeAt(i);
        //     const kerningAmount = kerningDict[(prev << 16) | (key & 0xffff)] || 0;
        //     if (i < stringLen - 1) {
        //         horizontalKernings[i] = kerningAmount;
        //     } else {
        //         horizontalKernings[i] = 0;
        //     }
        //     prev = key;
        // }
    },

    _multilineTextWrap (nextTokenFunc: Function) {
        const textLen = _string.length;

        let lineIndex = 0;
        let nextTokenX = 0;
        let nextTokenY = 0;
        let longestLine = 0;
        let letterRight = 0;

        let highestY = 0;
        let lowestY = 0;
        let letterDef: FontLetterDefinition | null = null;
        const letterPosition = new Vec2(0, 0);

        this._updateFontScale();

        for (let index = 0; index < textLen;) {
            let character = _string.charAt(index);
            if (character === '\n') {
                _linesWidth.push(letterRight);
                letterRight = 0;
                lineIndex++;
                nextTokenX = 0;
                nextTokenY -= _lineHeight * _bmfontScale + _lineSpacing;
                this._recordPlaceholderInfo(index, character);
                index++;
                continue;
            }

            const tokenLen = nextTokenFunc(_string, index, textLen);
            let tokenHighestY = highestY;
            let tokenLowestY = lowestY;
            let tokenRight = letterRight;
            let nextLetterX = nextTokenX;
            let newLine = false;

            for (let tmp = 0; tmp < tokenLen; ++tmp) {
                const letterIndex = index + tmp;
                character = _string.charAt(letterIndex);
                if (character === '\r') {
                    this._recordPlaceholderInfo(letterIndex, character);
                    continue;
                }

                letterDef = _fontAtlas && _fontAtlas.getLetterDefinitionForChar(character, _labelInfo);
                if (!letterDef) {
                    this._recordPlaceholderInfo(letterIndex, character);
                    continue;
                }

                const letterX = nextLetterX + letterDef.offsetX * _bmfontScale;

                if (_isWrapText
                    && _maxLineWidth > 0
                    && nextTokenX > 0
                    && letterX + letterDef.w * _bmfontScale > _maxLineWidth
                    && !isUnicodeSpace(character)) {
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

                letterPosition.y = nextTokenY - letterDef.offsetY * _bmfontScale;
                this._recordLetterInfo(letterPosition, character, letterIndex, lineIndex);

                if (letterIndex + 1 < _horizontalKernings.length && letterIndex < textLen - 1) {
                    nextLetterX += _horizontalKernings[letterIndex + 1];
                }

                nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX;

                tokenRight = letterPosition.x + letterDef.w * _bmfontScale;

                if (tokenHighestY < letterPosition.y) {
                    tokenHighestY = letterPosition.y;
                }

                if (tokenLowestY > letterPosition.y - letterDef.h * _bmfontScale) {
                    tokenLowestY = letterPosition.y - letterDef.h * _bmfontScale;
                }

            } // end of for loop

            if (newLine) { continue; }

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
        } // end of for loop

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

    _getFirstCharLen () {
        return 1;
    },

    _getFirstWordLen (text: string, startIndex: number, textLen: number) {
        let character = text.charAt(startIndex);
        if (isUnicodeCJK(character) || character === '\n' || isUnicodeSpace(character)) {
            return 1;
        }

        if (!_fontAtlas){
            return;
        }

        let len = 1;
        let letterDef = _fontAtlas.getLetterDefinitionForChar(character, _labelInfo);
        if (!letterDef) {
            return len;
        }
        let nextLetterX = letterDef.xAdvance * _bmfontScale + _spacingX;
        let letterX: number;
        for (let index = startIndex + 1; index < textLen; ++index) {
            character = text.charAt(index);

            letterDef = _fontAtlas.getLetterDefinitionForChar(character, _labelInfo);
            if (!letterDef) {
                break;
            }
            letterX = nextLetterX + letterDef.offsetX * _bmfontScale;

            if (letterX + letterDef.w * _bmfontScale > _maxLineWidth
                && !isUnicodeSpace(character)
                && _maxLineWidth > 0) {
                return len;
            }
            nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX;
            if (character === '\n' || isUnicodeSpace(character) || isUnicodeCJK(character)) {
                break;
            }
            len++;
        }

        return len;
    },

    _multilineTextWrapByWord () {
        return this._multilineTextWrap(this._getFirstWordLen);
    },

    _multilineTextWrapByChar () {
        return this._multilineTextWrap(this._getFirstCharLen);
    },

    _recordPlaceholderInfo (letterIndex: number, char: string) {
        if (letterIndex >= _lettersInfo.length) {
            const tmpInfo = new LetterInfo();
            _lettersInfo.push(tmpInfo);
        }

        _lettersInfo[letterIndex].char = char;
        _lettersInfo[letterIndex].hash = char.charCodeAt(0) + _labelInfo.hash;
        _lettersInfo[letterIndex].valid = false;
    },

    _recordLetterInfo (letterPosition: Vec2, character: string, letterIndex: number, lineIndex: number) {
        if (letterIndex >= _lettersInfo.length) {
            const tmpInfo = new LetterInfo();
            _lettersInfo.push(tmpInfo);
        }
        const char = character.charCodeAt(0);
        const key = char + _labelInfo.hash;
        _lettersInfo[letterIndex].line = lineIndex;
        _lettersInfo[letterIndex].char = character;
        _lettersInfo[letterIndex].hash = key;
        const fontLetter = _fontAtlas && _fontAtlas.getLetter(key);
        _lettersInfo[letterIndex].valid = fontLetter ? !!fontLetter.valid : false;
        _lettersInfo[letterIndex].x = letterPosition.x;
        _lettersInfo[letterIndex].y = letterPosition.y;
    },

    _alignText () {
        _textDesiredHeight = 0;
        _linesWidth.length = 0;

        if (!_lineBreakWithoutSpaces) {
            this._multilineTextWrapByWord();
        } else {
            this._multilineTextWrapByChar();
        }

        this._computeAlignmentOffset();

        this._updateQuads();
        // shrink
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

    _scaleFontSizeDown (fontSize: number) {
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
            const letterInfo = _lettersInfo[ctr];
            if (letterInfo.valid) {
                const letterDef = _fontAtlas!.getLetter(letterInfo.hash);
                if (!letterDef){
                    continue;
                }

                const px = letterInfo.x + letterDef.w * _bmfontScale;
                const lineIndex = letterInfo.line;
                if (_labelWidth > 0) {
                    if (!_isWrapText) {
                        if (px > _contentSize.width) {
                            letterClamp = true;
                            break;
                        }
                    } else {
                        const wordWidth = _linesWidth[lineIndex];
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

    _isHorizontalClamped (px: number, lineIndex: number) {
        const wordWidth = _linesWidth[lineIndex];
        const letterOverClamp = (px > _contentSize.width || px < 0);

        if (!_isWrapText) {
            return letterOverClamp;
        } else {
            return (wordWidth > _contentSize.width && letterOverClamp);
        }
    },

    _updateQuads () {
        if (!_comp || !_fontAtlas){
            return;
        }

        const texture = _fontAtlas.texture;

        const node = _comp.node;
        const renderData = _comp.renderData!;
        renderData.dataLength = renderData.vertexCount = renderData.indiceCount = 0;

        const contentSize = _contentSize;
        const ap = node.getAnchorPoint();
        const appx = ap.x * contentSize.width;
        const appy = ap.y * contentSize.height;

        let ret = true;
        for (let ctr = 0, l = _string.length; ctr < l; ++ctr) {
            const letterInfo = _lettersInfo[ctr];
            if (!letterInfo.valid) { continue; }
            const letterDef = _fontAtlas.getLetter(letterInfo.hash);
            if (!letterDef){
                continue;
            }

            _tmpRect.height = letterDef.h;
            _tmpRect.width = letterDef.w;
            _tmpRect.x = letterDef.u;
            _tmpRect.y = letterDef.v;

            let py = letterInfo.y + _letterOffsetY;

            if (_labelHeight > 0) {
                if (py > _tailoredTopY) {
                    const clipTop = py - _tailoredTopY;
                    _tmpRect.y += clipTop;
                    _tmpRect.height -= clipTop;
                    py = py - clipTop;
                }

                if (py - letterDef.h * _bmfontScale < _tailoredBottomY) {
                    _tmpRect.height = (py < _tailoredBottomY) ? 0 : (py - _tailoredBottomY);
                }
            }

            const lineIndex = letterInfo.line;
            const px = letterInfo.x + letterDef.w / 2 * _bmfontScale + _linesOffsetX[lineIndex];

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
                const letterPositionX = letterInfo.x + _linesOffsetX[letterInfo.line];
                this.appendQuad(renderData, texture, _tmpRect, false, letterPositionX - appx, py - appy, _bmfontScale);
            }
        }

        return ret;
    },

    appendQuad (renderData, texture, rect, rotated, x, y, scale) {
    },

    _computeAlignmentOffset () {
        _linesOffsetX.length = 0;

        switch (_hAlign) {
            case TextAlignment.LEFT:
                for (let i = 0; i < _numberOfLines; ++i) {
                    _linesOffsetX.push(0);
                }
                break;
            case TextAlignment.CENTER:
                for (let i = 0, l = _linesWidth.length; i < l; i++) {
                    _linesOffsetX.push((_contentSize.width - _linesWidth[i]) / 2);
                }
                break;
            case TextAlignment.RIGHT:
                for (let i = 0, l = _linesWidth.length; i < l; i++) {
                    _linesOffsetX.push(_contentSize.width - _linesWidth[i]);
                }
                break;
            default:
                break;
        }

        switch (_vAlign) {
            case VerticalTextAlignment.TOP:
                _letterOffsetY = _contentSize.height;
                break;
            case VerticalTextAlignment.CENTER:
                _letterOffsetY = (_contentSize.height + _textDesiredHeight) / 2 - (_lineHeight - _fontSize) / 2;
                break;
            case VerticalTextAlignment.BOTTOM:
                _letterOffsetY = (_contentSize.height + _textDesiredHeight) / 2 - (_lineHeight - _fontSize);
                break;
            default:
                break;
        }
    },

    _setupBMFontOverflowMetrics () {
        let newWidth = _contentSize.width;
        let newHeight = _contentSize.height;

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
    },
};
