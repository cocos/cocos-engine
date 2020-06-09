/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 * @category ui
 */

import { BitmapFont, Font, ImageAsset, SpriteFrame, Texture2D } from '../../core/assets';
import { ccclass, help, executionOrder, menu, property } from '../../core/data/class-decorator';
import { ccenum } from '../../core/value-types/enum';
import { UI } from '../../core/renderer/ui/ui';
import { FontAtlas } from '../assembler/label/bmfontUtils';
import { CanvasPool, ISharedLabelData } from '../assembler/label/font-utils';
import { LetterRenderTexture } from '../assembler/label/letter-font';
import { UIRenderComponent } from '../../core/components/ui-base/ui-render-component';
import { warnID } from '../../core/platform/debug';
import { sys } from '../../core/platform/sys';
import { EDITOR } from 'internal:constants';
import { legacyCC } from '../../core/global-exports';

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
 * @zh 文本超载类型。
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
     * @zh SHRINK 模式，字体大小会动态变化，以适应内容大小。
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
enum CacheMode {
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
 * @zh
 * Type 类型。
 */
/**
 * @zh
 * TTF字体。
 */
/**
 * @zh
 * 位图字体。
 */
/**
 * @zh
 * 系统字体。
 */

/**
 * @en
 * The Label Component.
 *
 * @zh
 * 文字标签组件。
 */
@ccclass('cc.LabelComponent')
@help('i18n:cc.LabelComponent')
@executionOrder(110)
@menu('UI/Render/Label')
export class LabelComponent extends UIRenderComponent {
    /**
     * @en
     * Content string of label.
     *
     * @zh
     * 标签显示的文本内容。
     */
    @property({
        displayOrder: 4,
        multiline: true,
        tooltip:'Label 显示的文本内容字符串',
    })
    get string () {
        return this._string;
    }
    set string (value) {
        value = value.toString();
        if (this._string === value) {
            return;
        }

        this._string = value;
        this.updateRenderData();
    }

    /**
     * @en
     * Horizontal Alignment of label.
     *
     * @zh
     * 文本内容的水平对齐方式。
     */
    @property({
        type: HorizontalTextAlignment,
        displayOrder: 5,
        tooltip:'文字水平对齐模式',
    })
    get horizontalAlign () {
        return this._horizontalAlign;
    }

    set horizontalAlign (value) {
        if (this._horizontalAlign === value) {
            return;
        }

        this._horizontalAlign = value;
        this.updateRenderData();
    }

    /**
     * @en
     * Vertical Alignment of label.
     *
     * @zh
     * 文本内容的垂直对齐方式。
     */
    @property({
        type: VerticalTextAlignment,
        displayOrder: 6,
        tooltip:'文字垂直对齐模式',
    })
    get verticalAlign () {
        return this._verticalAlign;
    }

    set verticalAlign (value) {
        if (this._verticalAlign === value) {
            return;
        }

        this._verticalAlign = value;
        this.updateRenderData();
    }

    /**
     * @en
     * The actual rendering font size in shrink mode.
     *
     * @zh
     * SHRINK 模式下面文本实际渲染的字体大小。
     */
    @property({
        readonly: true,
        displayName: 'Actual Font Size',
        visible: false,
    })
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
    @property({
        displayOrder: 7,
        tooltip:'文字尺寸，以 point 为单位',
    })
    get fontSize () {
        return this._fontSize;
    }

    set fontSize (value) {
        if (this._fontSize === value) {
            return;
        }

        this._fontSize = value;
        this.updateRenderData();
    }

    /**
     * @en
     * Font family of label, only take effect when useSystemFont property is true.
     *
     * @zh
     * 文本字体名称, 只在 useSystemFont 属性为 true 的时候生效。
     */
    @property({
        displayOrder: 8,
        tooltip:'文字字体名字',
    })
    get fontFamily () {
        return this._fontFamily;
    }

    set fontFamily (value) {
        if (this._fontFamily === value) {
            return;
        }

        this._fontFamily = value;
        this.updateRenderData();
    }

    /**
     * @en
     * Line Height of label.
     *
     * @zh
     * 文本行高。
     */
    @property({
        displayOrder: 8,
        tooltip:'文字行高，以 point 为单位',
    })
    get lineHeight () {
        return this._lineHeight;
    }
    set lineHeight (value) {
        if (this._lineHeight === value) {
            return;
        }

        this._lineHeight = value;
        this.updateRenderData();
    }

    /**
     * @en
     * Overflow of label.
     *
     * @zh
     * 文字显示超出范围时的处理方式。
     */
    @property({
        type: Overflow,
        displayOrder: 9,
        tooltip:'文字排版模式，包括以下三种：\n 1. CLAMP: 节点约束框之外的文字会被截断 \n 2. SHRINK: 自动根据节点约束框缩小文字\n 3. RESIZE_HEIGHT: 根据文本内容自动更新节点的 height 属性.',
    })
    get overflow () {
        return this._overflow;
    }

    set overflow (value) {
        if (this._overflow === value) {
            return;
        }

        this._overflow = value;
        this.updateRenderData();
    }

    /**
     * @en
     * Whether auto wrap label when string width is large than label width.
     *
     * @zh
     * 是否自动换行。
     */
    @property({
        displayOrder: 10,
        tooltip:'自动换行',
    })
    get enableWrapText () {
        return this._enableWrapText;
    }
    set enableWrapText (value) {
        if (this._enableWrapText === value) {
            return;
        }

        this._enableWrapText = value;
        this.updateRenderData();
    }

    /**
     * @en
     * The font of label.
     *
     * @zh
     * 文本字体。
     */
    @property({
        type: Font,
        displayOrder: 11,
        tooltip:'Label 使用的字体资源',
    })
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

        if (EDITOR && value) {
            this._userDefinedFont = value;
        }

        // this._N$file = value;
        this._font = value;
        // if (value && this._isSystemFontUsed)
        //     this._isSystemFontUsed = false;

        if (typeof value === 'string') {
            warnID(4000);
        }

        if (this._renderData) {
            this.destroyRenderData();
            this._renderData = null;
        }

        this._fontAtlas = null;
        this.updateRenderData(true);
    }

    /**
     * @en
     * Whether use system font name or not.
     *
     * @zh
     * 是否使用系统字体。
     */
    @property({
        displayOrder: 12,
        tooltip:'是否使用系统默认字体',
    })
    get useSystemFont () {
        return this._isSystemFontUsed;
    }

    set useSystemFont (value) {
        if (this._isSystemFontUsed === value) {
            return;
        }

        this.destroyRenderData();
        this._renderData = null;

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
            this._flushAssembler();
            this.updateRenderData();
        }
        // else if (!this._userDefinedFont) {
        //     this.disableRender();
        // }

    }

    /**
     * @en
     * The cache mode of label. This mode only supports system fonts.
     *
     * @zh
     * 文本缓存模式, 该模式只支持系统字体。
     */
    @property({
        type: CacheMode,
        displayOrder: 13,
        tooltip:'文本缓存模式，包括以下三种：\n 1. NONE: 不做任何缓存，文本内容进行一次绘制 \n 2. BITMAP: 将文本作为静态图像加入动态图集进行批次合并，但是不能频繁动态修改文本内容 \n 3. CHAR: 将文本拆分为字符并且把字符纹理缓存到一张字符图集中进行复用，适用于字符内容重复并且频繁更新的文本内容',
    })
    get cacheMode () {
        return this._cacheMode;
    }

    set cacheMode (value) {
        if (this._cacheMode === value) {
            return;
        }

        // if (this._cacheMode === CacheMode.BITMAP && !(this._font instanceof BitmapFont) && this._frame) {
        //     this._frame._resetDynamicAtlasFrame();
        // }

        if (this._cacheMode === CacheMode.CHAR) {
            this._ttfSpriteFrame = null;
        }

        this._cacheMode = value;
        this.updateRenderData(true);
    }

    get spriteFrame () {
        return this._texture;
    }

    /**
     * @en
     * Whether the font is bold.
     *
     * @zh
     * 字体是否加粗。
     */
    @property({
        // visible: false,
        displayOrder: 15,
        tooltip:'字体加粗',
    })
    get isBold () {
        return this._isBold;
    }

    set isBold (value) {
        if (this._isBold === value) {
            return;
        }

        this._isBold = value;
        this.updateRenderData();
    }

    /**
     * @en
     * Whether the font is italic.
     *
     * @zh
     * 字体是否倾斜。
     */
    @property({
        // visible: false,
        displayOrder: 16,
        tooltip:'字体倾斜',
    })
    get isItalic () {
        return this._isItalic;
    }

    set isItalic (value) {
        if (this._isItalic === value) {
            return;
        }

        this._isItalic = value;
        this.updateRenderData();
    }

    /**
     * @en
     * Whether the font is underline.
     *
     * @zh
     * 字体是否加下划线。
     */
    @property({
        // visible: false,
        displayOrder: 17,
        tooltip:'字体加下划线',
    })
    get isUnderline () {
        return this._isUnderline;
    }

    set isUnderline (value) {
        if (this._isUnderline === value) {
            return;
        }

        this._isUnderline = value;
        this.updateRenderData();
    }

    get assemblerData (){
        return this._assemblerData;
    }

    get fontAtlas () {
        return this._fontAtlas;
    }

    set fontAtlas (value) {
        this._fontAtlas = value;
    }

    get spacingX () {
        return this._spacingX;
    }

    set spacingX (value) {
        if (this._spacingX === value) {
            return;
        }

        this._spacingX = value;
        this.updateRenderData();
    }

    get _bmFontOriginalSize (){
        if (this._font instanceof BitmapFont) {
            return this._font.fontSize;
        }
        else {
            return -1;
        }
    }

    public static HorizontalAlign = HorizontalTextAlignment;
    public static VerticalAlign = VerticalTextAlignment;
    public static Overflow = Overflow;
    public static CacheMode = CacheMode;
    public static _canvasPool = new CanvasPool();

    @property
    protected _useOriginalSize = true;
    @property
    protected _string = 'label';
    @property
    protected _horizontalAlign = HorizontalTextAlignment.CENTER;
    @property
    protected _verticalAlign = VerticalTextAlignment.CENTER;
    @property
    protected _actualFontSize = 0;
    @property
    protected _fontSize = 40;
    @property
    protected _fontFamily = 'Arial';
    @property
    protected _lineHeight = 40;
    @property
    protected _overflow: Overflow = Overflow.NONE;
    @property
    protected _enableWrapText = true;
    @property
    protected _font: Font | null = null;
    @property
    protected _isSystemFontUsed = true;
    protected _spacingX = 0;
    @property
    protected _isItalic = false;
    @property
    protected _isBold = false;
    @property
    protected _isUnderline = false;
    @property
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

        this.updateRenderData(true);
    }

    public onDisable () {
        super.onDisable();
    }

    public onDestroy () {
        if (this._assembler && this._assembler.resetAssemblerData) {
            this._assembler.resetAssemblerData(this._assemblerData!);
        }

        this._assemblerData = null;
        if (this._ttfSpriteFrame) {
            const tex = this._ttfSpriteFrame.texture;
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

    public updateRenderData (force = false) {
        this.markForUpdateRenderData();

        if (force) {
            this._flushAssembler();
            this._applyFontTexture();
        }
    }

    protected _render (render: UI) {
        render.commitComp(this, this._texture!.getGFXTexture(), this._assembler!, this._texture!.getGFXSampler());
    }

    protected _updateColor () {
        if (this._font instanceof BitmapFont) {
           super._updateColor();
        } else {
            this.updateRenderData(false);
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
            if (!spriteFrame || !spriteFrame.textureLoaded()) {
                return false;
            }
        }

        return true;
    }

    protected _flushAssembler () {
        const assembler = LabelComponent.Assembler!.getAssembler(this);

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (!this._renderData) {
            if (this._assembler && this._assembler.createData){
                this._renderData = this._assembler.createData(this);
                this._renderData!.material = this._material;
            }
        }
    }

    protected _flushMaterial () {
        this._updateMaterial(this._material);
    }

    protected _applyFontTexture () {
        const font = this._font;
        if (font instanceof BitmapFont) {
            const spriteFrame = font.spriteFrame;
            const onBMFontTextureLoaded = () => {
                // TODO: old texture in material have been released by loader
                this._texture = spriteFrame;
                this._flushMaterial();
                if (this._assembler) {
                    this._assembler!.updateRenderData(this);
                }
            };
            // cannot be activated if texture not loaded yet
            if (spriteFrame) {
                if (spriteFrame.loaded || spriteFrame.textureLoaded) {
                    onBMFontTextureLoaded();
                } else {
                    spriteFrame.once('load', onBMFontTextureLoaded, this);
                }
            }
        } else {
            if (this.cacheMode === CacheMode.CHAR && sys.browserType !== sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
                this._letterTexture = this._assembler!.getAssemblerData();
                this._texture = this._letterTexture;
            } else if (!this._ttfSpriteFrame) {
                this._ttfSpriteFrame = new SpriteFrame();
                this._assemblerData = this._assembler!.getAssemblerData();
                const image = new ImageAsset(this._assemblerData!.canvas);
                const tex = image._texture;
                this._ttfSpriteFrame.texture = tex;
            }

            if (this.cacheMode !== CacheMode.CHAR) {
                // this._frame._refreshTexture(this._texture);
                this._texture = this._ttfSpriteFrame;
            }

            this._flushMaterial();
            if (this._assembler) {
                this._assembler!.updateRenderData(this);
            }
        }
    }
}

legacyCC.LabelComponent = LabelComponent;
