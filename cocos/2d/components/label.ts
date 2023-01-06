/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, help, executionOrder, menu, tooltip, displayOrder, visible, multiline, type, serializable, editable } from 'cc.decorator';
import { BYTEDANCE, EDITOR, JSB } from 'internal:constants';
import { minigame } from 'pal/minigame';
import { BitmapFont, Font, SpriteFrame } from '../assets';
import { ImageAsset, Texture2D } from '../../asset/assets';
import { ccenum, cclegacy, Color } from '../../core';
import { IBatcher } from '../renderer/i-batcher';
import { FontAtlas } from '../assets/bitmap-font';
import { CanvasPool, ISharedLabelData, LetterRenderTexture } from '../assembler/label/font-utils';
import { InstanceMaterialType, UIRenderer } from '../framework/ui-renderer';
import { TextureBase } from '../../asset/assets/texture-base';
import { PixelFormat } from '../../asset/assets/asset-enum';
import { BlendFactor } from '../../gfx';

const tempColor = Color.WHITE.clone();
/**
 * @en Enum for horizontal text alignment.
 *
 * @zh 文本横向对齐类型。
 */
export enum HorizontalTextAlignment {
    /**
     * @en Alignment left for text.
     *
     * @zh 左对齐。
     */
    LEFT = 0,
    /**
     * @en Alignment center for text.
     *
     * @zh 中心对齐。
     */
    CENTER = 1,
    /**
     * @en Alignment right for text.
     *
     * @zh 右对齐。
     */
    RIGHT = 2,
}

ccenum(HorizontalTextAlignment);

/**
 * @en Enum for vertical text alignment.
 *
 * @zh 文本垂直对齐类型。
 */
export enum VerticalTextAlignment {
    /**
     * @en Alignment top for text.
     *
     * @zh 上对齐。
     */
    TOP = 0,
    /**
     * @en Alignment center for text.
     *
     * @zh 中心对齐。
     */
    CENTER = 1,
    /**
     * @en Alignment bottom for text.
     *
     * @zh 下对齐。
     */
    BOTTOM = 2,
}

ccenum(VerticalTextAlignment);

/**
 * @en Enum for Overflow.
 *
 * @zh 文本溢出行为类型。
 */
export enum Overflow {
    /**
     * @en None.
     *
     * @zh 不做任何限制。
     */
    NONE = 0,
    /**
     * @en In CLAMP mode, when label content goes out of the bounding box, it will be clipped.
     *
     * @zh CLAMP 模式中，当文本内容超出边界框时，多余的会被截断。
     */
    CLAMP = 1,
    /**
     * @en In SHRINK mode, the font size will change dynamically to adapt the content size.
     * This mode may takes up more CPU resources when the label is refreshed.
     *
     * @zh SHRINK 模式，字体大小会动态变化，以适应内容大小。这个模式在文本刷新的时候可能会占用较多 CPU 资源。
     */
    SHRINK = 2,
    /**
     * @en In RESIZE_HEIGHT mode, you can only change the width of label and the height is changed automatically.
     *
     * @zh 在 RESIZE_HEIGHT 模式下，只能更改文本的宽度，高度是自动改变的。
     */
    RESIZE_HEIGHT = 3,
}

ccenum(Overflow);

/**
 * @en Enum for cache mode.
 *
 * @zh 文本图集缓存类型。
 */
export enum CacheMode {
    /**
     * @en Do not do any caching.
     *
     * @zh 不做任何缓存。
     */
    NONE = 0,
    /**
     * @en In BITMAP mode, cache the label as a static image and add it to the dynamic atlas for batch rendering,
     * and can batching with Sprites using broken images.
     *
     * @zh BITMAP 模式，将 label 缓存成静态图像并加入到动态图集，以便进行批次合并，可与使用碎图的 Sprite 进行合批。
     * （注：动态图集在 Chrome 以及微信小游戏暂时关闭，该功能无效）。
     */
    BITMAP = 1,
    /**
     * @en In CHAR mode, split text into characters and cache characters into a dynamic atlas which the size of 1024 * 1024.
     *
     * @zh CHAR 模式，将文本拆分为字符，并将字符缓存到一张单独的大小为 1024 * 1024 的图集中进行重复使用，不再使用动态图集。
     * （注：当图集满时将不再进行缓存，暂时不支持 SHRINK 自适应文本尺寸（后续完善））。
     */
    CHAR = 2,
}

ccenum(CacheMode);

/**
 * @en
 * The Label Component.
 *
 * @zh
 * 文字标签组件。
 */
@ccclass('cc.Label')
@help('i18n:cc.Label')
@executionOrder(110)
@menu('2D/Label')
export class Label extends UIRenderer {
    /**
     * @en Enum for horizontal text alignment.
     *
     * @zh 文本横向对齐类型。
     */
    public static HorizontalAlign = HorizontalTextAlignment;
    /**
     * @en Enum for vertical text alignment.
     *
     * @zh 文本垂直对齐类型。
     */
    public static VerticalAlign = VerticalTextAlignment;
    /**
     * @en Enum for label overflow mode.
     *
     * @zh 文本溢出行为类型。
     */
    public static Overflow = Overflow;
    /**
     * @en Enum for cache mode.
     *
     * @zh 文本图集缓存类型。
     */
    public static CacheMode = CacheMode;
    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    public static _canvasPool = CanvasPool.getInstance();

    /**
     * @en
     * Content string of label.
     *
     * @zh
     * 标签显示的文本内容。
     */
    @displayOrder(4)
    @tooltip('i18n:label.string')
    @multiline
    get string () {
        return this._string;
    }
    set string (value) {
        if (value === null || value === undefined) {
            value = '';
        } else {
            value = value.toString();
        }

        if (this._string === value) {
            return;
        }

        this._string = value;
        this.markForUpdateRenderData();
    }

    /**
     * @en
     * Horizontal Alignment of label.
     *
     * @zh
     * 文本内容的水平对齐方式。
     */
    @type(HorizontalTextAlignment)
    @displayOrder(5)
    @tooltip('i18n:label.horizontal_align')
    get horizontalAlign () {
        return this._horizontalAlign;
    }
    set horizontalAlign (value) {
        if (this._horizontalAlign === value) {
            return;
        }

        this._horizontalAlign = value;
        this.markForUpdateRenderData();
    }

    /**
     * @en
     * Vertical Alignment of label.
     *
     * @zh
     * 文本内容的垂直对齐方式。
     */
    @type(VerticalTextAlignment)
    @displayOrder(6)
    @tooltip('i18n:label.vertical_align')
    get verticalAlign () {
        return this._verticalAlign;
    }
    set verticalAlign (value) {
        if (this._verticalAlign === value) {
            return;
        }

        this._verticalAlign = value;
        this.markForUpdateRenderData();
    }

    /**
     * @en
     * The actual rendering font size in shrink mode.
     *
     * @zh
     * SHRINK 模式下面文本实际渲染的字体大小。
     */
    get actualFontSize () {
        return this._actualFontSize;
    }
    set actualFontSize (value) {
        this._actualFontSize = value;
    }

    /**
     * @en
     * Font size of label.
     *
     * @zh
     * 文本字体大小。
     */
    @displayOrder(7)
    @tooltip('i18n:label.font_size')
    get fontSize () {
        return this._fontSize;
    }
    set fontSize (value) {
        if (this._fontSize === value) {
            return;
        }

        this._fontSize = value;
        this.markForUpdateRenderData();
    }

    /**
     * @en
     * Line Height of label.
     *
     * @zh
     * 文本行高。
     */
    @displayOrder(8)
    @tooltip('i18n:label.line_height')
    get lineHeight () {
        return this._lineHeight;
    }
    set lineHeight (value) {
        if (this._lineHeight === value) {
            return;
        }

        this._lineHeight = value;
        this.markForUpdateRenderData();
    }

    /**
     * @en
     * The spacing between text characters, only available in BMFont.
     *
     * @zh
     * 文本字符之间的间距。仅在使用 BMFont 位图字体时生效。
     */
    @visible(function (this: Label) {
        return !this._isSystemFontUsed && this._font instanceof BitmapFont;
    })
    @displayOrder(9)
    @tooltip('i18n:label.spacing_x')
    get spacingX () {
        return this._spacingX;
    }
    set spacingX (value) {
        if (this._spacingX === value) {
            return;
        }

        this._spacingX = value;
        this.markForUpdateRenderData();
    }

    /**
     * @en
     * Overflow of label.
     *
     * @zh
     * 文字显示超出范围时的处理方式。
     */
    @type(Overflow)
    @displayOrder(10)
    @tooltip('i18n:label.overflow')
    get overflow () {
        return this._overflow;
    }
    set overflow (value) {
        if (this._overflow === value) {
            return;
        }

        this._overflow = value;
        this.markForUpdateRenderData();
    }

    /**
     * @en
     * Whether auto wrap label when string width is large than label width.
     *
     * @zh
     * 是否自动换行。
     */
    @displayOrder(11)
    @tooltip('i18n:label.wrap')
    get enableWrapText () {
        return this._enableWrapText;
    }
    set enableWrapText (value) {
        if (this._enableWrapText === value) {
            return;
        }

        this._enableWrapText = value;
        this.markForUpdateRenderData();
    }

    /**
     * @en
     * Whether use system font name or not.
     *
     * @zh
     * 是否使用系统字体。
     */
    @displayOrder(12)
    @tooltip('i18n:label.system_font')
    get useSystemFont () {
        return this._isSystemFontUsed;
    }
    set useSystemFont (value) {
        if (this._isSystemFontUsed === value) {
            return;
        }

        this.destroyRenderData();

        if (EDITOR) {
            if (!value && this._isSystemFontUsed && this._userDefinedFont) {
                this.font = this._userDefinedFont;
                this.spacingX = this._spacingX;
                return;
            }
        }

        this._isSystemFontUsed = !!value;
        if (value) {
            this.font = null;
        }
        this._flushAssembler();
        this.markForUpdateRenderData();
    }

    /**
     * @en
     * Font family of label, only take effect when useSystemFont property is true.
     *
     * @zh
     * 文本字体名称, 只在 useSystemFont 属性为 true 的时候生效。
     */
    @displayOrder(13)
    @visible(function (this: Label) { return this._isSystemFontUsed; })
    @tooltip('i18n:label.font_family')
    get fontFamily () {
        return this._fontFamily;
    }
    set fontFamily (value) {
        if (this._fontFamily === value) {
            return;
        }

        this._fontFamily = value;
        this.markForUpdateRenderData();
    }

    /**
     * @en
     * The font of label.
     *
     * @zh
     * 文本字体。
     */
    @type(Font)
    @displayOrder(13)
    @visible(function (this: Label) { return !this._isSystemFontUsed; })
    @tooltip('i18n:label.font')
    get font () {
        // return this._N$file;
        return this._font;
    }
    set font (value) {
        if (this._font === value) {
            return;
        }

        // if delete the font, we should change isSystemFontUsed to true
        this._isSystemFontUsed = !value;

        if (EDITOR) {
            this._userDefinedFont = value;
        }

        // this._N$file = value;
        this._font = value;
        // if (value && this._isSystemFontUsed)
        //     this._isSystemFontUsed = false;

        this.destroyRenderData();

        this._fontAtlas = null;
        this.updateRenderData(true);
    }

    /**
     * @en
     * The cache mode of label. This mode only supports system fonts.
     *
     * @zh
     * 文本缓存模式, 该模式只支持系统字体。
     */
    @type(CacheMode)
    @displayOrder(14)
    @tooltip('i18n:label.cache_mode')
    get cacheMode () {
        return this._cacheMode;
    }
    set cacheMode (value) {
        if (this._cacheMode === value) {
            return;
        }

        if (this._cacheMode === CacheMode.BITMAP && !(this._font instanceof BitmapFont) && this._ttfSpriteFrame) {
            this._ttfSpriteFrame._resetDynamicAtlasFrame();
        }
        if (this._cacheMode === CacheMode.CHAR) {
            this._ttfSpriteFrame = null;
        }

        this._cacheMode = value;
        this.updateRenderData(true);
    }

    /**
     * @en
     * Whether the font is bold.
     *
     * @zh
     * 字体是否加粗。
     */
    @displayOrder(15)
    @tooltip('i18n:label.font_bold')
    get isBold () {
        return this._isBold;
    }
    set isBold (value) {
        if (this._isBold === value) {
            return;
        }

        this._isBold = value;
        this.markForUpdateRenderData();
    }

    /**
     * @en
     * Whether the font is italic.
     *
     * @zh
     * 字体是否倾斜。
     */
    @displayOrder(16)
    @tooltip('i18n:label.font_italic')
    get isItalic () {
        return this._isItalic;
    }
    set isItalic (value) {
        if (this._isItalic === value) {
            return;
        }

        this._isItalic = value;
        this.markForUpdateRenderData();
    }

    /**
     * @en
     * Whether the font is underline.
     *
     * @zh
     * 字体是否加下划线。
     */
    @displayOrder(17)
    @tooltip('i18n:label.font_underline')
    get isUnderline () {
        return this._isUnderline;
    }
    set isUnderline (value) {
        if (this._isUnderline === value) {
            return;
        }

        this._isUnderline = value;
        this.markForUpdateRenderData();
    }

    /**
     * @en The height of underline.
     * @zh 下划线高度。
     */
    @visible(function (this: Label) { return this._isUnderline; })
    @editable
    @displayOrder(18)
    @tooltip('i18n:label.underline_height')
    public get underlineHeight () {
        return this._underlineHeight;
    }
    public set underlineHeight (value) {
        if (this._underlineHeight === value) return;
        this._underlineHeight = value;
        this.markForUpdateRenderData();
    }

    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get spriteFrame () {
        return this._texture;
    }

    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get ttfSpriteFrame () {
        return this._ttfSpriteFrame;
    }

    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get assemblerData () {
        return this._assemblerData;
    }

    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    get fontAtlas () {
        return this._fontAtlas;
    }

    set fontAtlas (value) {
        this._fontAtlas = value;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    get _bmFontOriginalSize () {
        if (this._font instanceof BitmapFont) {
            return this._font.fontSize;
        } else {
            return -1;
        }
    }

    @serializable
    protected _string = 'label';
    @serializable
    protected _horizontalAlign = HorizontalTextAlignment.CENTER;
    @serializable
    protected _verticalAlign = VerticalTextAlignment.CENTER;
    @serializable
    protected _actualFontSize = 0;
    @serializable
    protected _fontSize = 40;
    @serializable
    protected _fontFamily = 'Arial';
    @serializable
    protected _lineHeight = 40;
    @serializable
    protected _overflow: Overflow = Overflow.NONE;
    @serializable
    protected _enableWrapText = true;
    @serializable
    protected _font: Font | null = null;
    @serializable
    protected _isSystemFontUsed = true;
    @serializable
    protected _spacingX = 0;
    @serializable
    protected _isItalic = false;
    @serializable
    protected _isBold = false;
    @serializable
    protected _isUnderline = false;
    @serializable
    protected _underlineHeight = 2;
    @serializable
    protected _cacheMode = CacheMode.NONE;

    // don't need serialize
    // 这个保存了旧项目的 file 数据
    protected _N$file: Font | null = null;
    protected _texture: SpriteFrame | LetterRenderTexture | null = null;
    protected _ttfSpriteFrame: SpriteFrame | null = null;
    protected _userDefinedFont: Font | null = null;
    protected _assemblerData: ISharedLabelData | null = null;
    protected _fontAtlas: FontAtlas | null = null;
    protected _letterTexture: LetterRenderTexture | null = null;

    protected _contentWidth = 0;

    /**
     * @engineInternal
     */
    get contentWidth () {
        return this._contentWidth;
    }

    /**
     * @engineInternal
     */
    set contentWidth (val) {
        this._contentWidth = val;
    }

    constructor () {
        super();
        if (EDITOR) {
            this._userDefinedFont = null;
        }

        this._ttfSpriteFrame = null;
    }

    public onEnable () {
        super.onEnable();

        // TODO: Hack for barbarians
        if (!this._font && !this._isSystemFontUsed) {
            this.useSystemFont = true;
        }
        // Reapply default font family if necessary
        if (this._isSystemFontUsed && !this._fontFamily) {
            this.fontFamily = 'Arial';
        }

        this._applyFontTexture();
    }

    public onDestroy () {
        if (this._assembler && this._assembler.resetAssemblerData) {
            this._assembler.resetAssemblerData(this._assemblerData!);
        }

        this._assemblerData = null;
        if (this._ttfSpriteFrame) {
            this._ttfSpriteFrame._resetDynamicAtlasFrame();
            const tex = this._ttfSpriteFrame.texture;
            this._ttfSpriteFrame.destroy();
            if (tex) {
                const tex2d = tex as Texture2D;
                if (tex2d.image) {
                    tex2d.image.destroy();
                }
                tex.destroy();
            }
            this._ttfSpriteFrame = null;
        }

        // texture cannot be destroyed in here, lettertexture image source is public.
        this._letterTexture = null;

        super.onDestroy();
    }

    /**
     * @en update render data.
     * @zh 更新渲染相关数据。
     * @param force @en Whether to force an immediate update. @zh 是否立马强制更新渲染数据。
     */
    public updateRenderData (force = false) {
        if (force) {
            this._flushAssembler();
            // Hack: Fixed the bug that richText wants to get the label length by _measureText,
            // _assembler.updateRenderData will update the content size immediately.
            if (this.renderData) this.renderData.vertDirty = true;
            this._applyFontTexture();
        }
        if (this._assembler) {
            this._assembler.updateRenderData(this);
        }
    }

    protected _render (render: IBatcher) {
        render.commitComp(this, this.renderData, this._texture, this._assembler!, null);
    }

    // Cannot use the base class methods directly because BMFont and CHAR cannot be updated in assambler with just color.
    protected _updateColor () {
        super._updateColor();
        this.markForUpdateRenderData();
    }

    /**
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    public setEntityColor (color: Color) {
        if (JSB) {
            if (this._font instanceof BitmapFont) {
                this._renderEntity.color = color;
            } else {
                tempColor.set(255, 255, 255, color.a);
                this._renderEntity.color = tempColor;
            }
        }
    }

    protected _canRender () {
        if (!super._canRender() || !this._string) {
            return false;
        }

        const font = this._font;
        if (font && font instanceof BitmapFont) {
            const spriteFrame = font.spriteFrame;
            // cannot be activated if texture not loaded yet
            if (!spriteFrame || !spriteFrame.texture) {
                return false;
            }
        }

        return true;
    }

    protected _flushAssembler () {
        const assembler = Label.Assembler.getAssembler(this);

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (!this.renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this.renderData!.material = this.material;
                this._updateColor();
            }
        }
    }

    protected _applyFontTexture () {
        this.markForUpdateRenderData();
        const font = this._font;
        if (font instanceof BitmapFont) {
            const spriteFrame = font.spriteFrame;
            if (spriteFrame && spriteFrame.texture) {
                this._texture = spriteFrame;
                if (this.renderData) {
                    this.renderData.textureDirty = true;
                }
                this.changeMaterialForDefine();
                if (this._assembler) {
                    this._assembler.updateRenderData(this);
                }
            }
        } else {
            if (this.cacheMode === CacheMode.CHAR) {
                this._letterTexture = this._assembler!.getAssemblerData();
                this._texture = this._letterTexture;
            } else if (!this._ttfSpriteFrame) {
                this._ttfSpriteFrame = new SpriteFrame();
                this._assemblerData = this._assembler!.getAssemblerData();
                const image = new ImageAsset(this._assemblerData!.canvas);
                const texture = new Texture2D();
                texture.image = image;
                this._ttfSpriteFrame.texture = texture;
            }

            if (this.cacheMode !== CacheMode.CHAR) {
                // this._frame._refreshTexture(this._texture);
                this._texture = this._ttfSpriteFrame;
            }
            this.changeMaterialForDefine();
        }
    }

    protected changeMaterialForDefine () {
        if (!this._texture) {
            return;
        }
        let value = false;
        if (this.cacheMode !== CacheMode.CHAR) {
            const spriteFrame = this._texture as SpriteFrame;
            const texture = spriteFrame.texture;
            if (texture instanceof TextureBase) {
                const format = texture.getPixelFormat();
                value = (format === PixelFormat.RGBA_ETC1 || format === PixelFormat.RGB_A_PVRTC_4BPPV1 || format === PixelFormat.RGB_A_PVRTC_2BPPV1);
            }
        }
        if (value) {
            this._instanceMaterialType = InstanceMaterialType.USE_ALPHA_SEPARATED;
        } else {
            this._instanceMaterialType = InstanceMaterialType.ADD_COLOR_AND_TEXTURE;
        }
        this.updateMaterial();
    }

    /**
     * @engineInternal
     */
    public _updateBlendFunc () {
        // override for BYTEDANCE
        if (BYTEDANCE) {
            // need to fix ttf font black border at the sdk verion lower than 2.0.0
            const sysInfo = minigame.getSystemInfoSync();
            if (Number.parseInt(sysInfo.SDKVersion[0]) < 2) {
                if (this._srcBlendFactor === BlendFactor.SRC_ALPHA && !minigame.isDevTool
                    && !(this._font instanceof BitmapFont) && !this._customMaterial) {
                    // Premultiplied alpha on runtime when sdk verion is lower than 2.0.0
                    this._srcBlendFactor = BlendFactor.ONE;
                }
            }
        }
        super._updateBlendFunc();
    }
}

cclegacy.Label = Label;
