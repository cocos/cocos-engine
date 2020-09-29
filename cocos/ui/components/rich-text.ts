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

import { Font, SpriteAtlas, TTFFont } from '../../core/assets';
import { ccclass, executeInEditMode, executionOrder, help, menu, tooltip, multiline, type, serializable } from 'cc.decorator';
import { assert, EventTouch, warnID } from '../../core/platform';
import { BASELINE_RATIO, fragmentText, HtmlTextParser, IHtmlTextParserResultObj, IHtmlTextParserStack, isUnicodeCJK, isUnicodeSpace } from '../../core/utils';
import Pool from '../../core/utils/pool';
import { Color, Vec2 } from '../../core/math';
import { Node, PrivateNode } from '../../core/scene-graph';
import { CacheMode, HorizontalTextAlignment, Label, VerticalTextAlignment } from './label';
import { LabelOutline } from './label-outline';
import { Sprite } from './sprite';
import { UIComponent, UIRenderable, UITransform } from '../../core/components/ui-base';
import { loader } from '../../core/load-pipeline';
import { DEV, EDITOR } from 'internal:constants';
import { legacyCC } from '../../core/global-exports';
import { Component } from "../../core/components";

const _htmlTextParser = new HtmlTextParser();
const RichTextChildName = 'RICHTEXT_CHILD';
const RichTextChildImageName = 'RICHTEXT_Image_CHILD';

/**
 * 富文本池。<br/>
 */
const pool = new Pool((labelSeg: ILabelSegment) => {
    if (EDITOR) {
        return false;
    }
    if (DEV) {
        assert(!labelSeg.node.parent, 'Recycling node\'s parent should be null!');
    }
    if (!legacyCC.isValid(labelSeg.node)) {
        return false;
    }
    else {
        let outline = labelSeg.node.getComponent(LabelOutline);
        if (outline) {
            outline.width = 0;
        }
    }
    return true;
}, 20);

// @ts-ignore
pool.get = function (str: string, richtext: RichText) {
    let labelSeg = this._get();
    if (!labelSeg) {
        labelSeg = {
            node: new PrivateNode(RichTextChildName),
            comp: null,
            lineCount: 0,
            styleIndex: 0,
            imageOffset: '',
            clickParam: '',
            clickHandler: '',
        };
    }

    let labelNode = labelSeg.node;
    if (!labelNode) {
        labelNode = new PrivateNode(RichTextChildName);
    }

    let label = labelNode.getComponent(Label);
    if (!label) {
        label = labelNode.addComponent(Label)!;
    }

    label.string = str;
    label.horizontalAlign = HorizontalTextAlignment.LEFT;
    label.verticalAlign = VerticalTextAlignment.TOP;
    // label._forceUseCanvas = true;

    labelNode.setPosition(0, 0, 0);
    let trans = labelNode._uiProps.uiTransformComp!;
    trans.setAnchorPoint(0.5, 0.5);

    const labelObj: ILabelSegment = {
        node: labelNode,
        comp: label,
        lineCount: 0,
        styleIndex: 0,
        imageOffset: '',
        clickParam: '',
        clickHandler: '',
    };

    return labelObj;
};

interface ILabelSegment {
    node: PrivateNode;
    comp: UIRenderable | null;
    lineCount: number;
    styleIndex: number;
    imageOffset: string;
    clickParam: string;
    clickHandler: string;
}

/**
 * @en
 * The RichText Component.
 *
 * @zh
 * 富文本组件。
 */
@ccclass('cc.RichText')
@help('i18n:cc.RichText')
@executionOrder(110)
@menu('UI/Render/RichText')
@executeInEditMode
export class RichText extends UIComponent {

    /**
     * @en
     * Content string of RichText.
     *
     * @zh
     * 富文本显示的文本内容。
     */
    @multiline
    @tooltip('富文本显示的文本内容')
    get string () {
        return this._string;
    }
    set string (value) {
        if (this._string === value) {
            return;
        }

        this._string = value;
        this._updateRichTextStatus();
    }

    /**
     * @en
     * Horizontal Alignment of each line in RichText.
     *
     * @zh
     * 文本内容的水平对齐方式。
     */
    @type(HorizontalTextAlignment)
    @tooltip('文本内容的水平对齐方式')
    get horizontalAlign () {
        return this._horizontalAlign;
    }

    set horizontalAlign (value) {
        if (this.horizontalAlign === value) {
            return;
        }

        this._horizontalAlign = value;
        this._layoutDirty = true;
        this._updateRichTextStatus();
    }

    /**
     * @en
     * Font size of RichText.
     *
     * @zh
     * 富文本字体大小。
     */
    @tooltip('富文本字体大小')
    get fontSize () {
        return this._fontSize;
    }

    set fontSize (value) {
        if (this._fontSize === value) {
            return;
        }

        this._fontSize = value;
        this._layoutDirty = true;
        this._updateRichTextStatus();
    }

    /**
     * @en
     * Custom System font of RichText
     *
     * @zh
     * 富文本定制系统字体
     */
    @tooltip('富文本定制系统字体')
    get fontFamily () {
        return this._fontFamily;
    }
    set fontFamily (value: string) {
        if (this._fontFamily === value) return;
        this._fontFamily = value;
        this._layoutDirty = true;
        this._updateRichTextStatus();
    }

    /**
     * @en
     * Custom System font of RichText.
     *
     * @zh
     * 富文本定制字体。
     */
    @type(Font)
    @tooltip('富文本定制字体')
    get font () {
        return this._font;
    }
    set font (value) {
        if (this._font === value) {
            return;
        }
        this._font = value;
        this._layoutDirty = true;
        if (this._font) {
            if (EDITOR) {
                this._userDefinedFont = this._font;
            }
            this.useSystemFont = false;
            this._onTTFLoaded();
        }
        else {
            this.useSystemFont = true;
        }
        this._updateRichTextStatus();
    }

    /**
     * @en
     * Whether use system font name or not.
     *
     * @zh
     * 是否使用系统字体。
     */
    @tooltip('是否使用系统字体')
    get useSystemFont () {
        return this._isSystemFontUsed;
    }
    set useSystemFont (value: boolean) {
        if (this._isSystemFontUsed === value) {
            return;
        }
        this._isSystemFontUsed = value;

        if (EDITOR) {
            if (value) {
                this._font = null;
            }
            else if (this._userDefinedFont) {
                this._font = this._userDefinedFont;
                return;
            }
        }

        this._layoutDirty = true;
        this._updateRichTextStatus();
    }

    /**
     * @en
     * The cache mode of label. This mode only supports system fonts.
     *
     * @zh
     * 文本缓存模式, 该模式只支持系统字体。
     */
    @type(CacheMode)
    @tooltip('文本缓存模式, 该模式只支持系统字体。')
    get cacheMode () {
        return this._cacheMode;
    }
    set cacheMode (value: CacheMode) {
        if (this._cacheMode === value) {
            return;
        }
        this._cacheMode = value;
        this._updateRichTextStatus();
    }

    /**
     * @en
     * The maximize width of the RichText.
     *
     * @zh
     * 富文本的最大宽度。
     */
    @tooltip('富文本的最大宽度')
    get maxWidth () {
        return this._maxWidth;
    }

    set maxWidth (value) {
        if (this._maxWidth === value) {
            return;
        }

        this._maxWidth = value;
        this._layoutDirty = true;
        this._updateRichTextStatus();
    }

    /**
     * @en
     * Line Height of RichText.
     *
     * @zh
     * 富文本行高。
     */
    @tooltip('富文本行高')
    get lineHeight () {
        return this._lineHeight;
    }

    set lineHeight (value) {
        if (this._lineHeight === value) {
            return;
        }

        this._lineHeight = value;
        this._layoutDirty = true;
        this._updateRichTextStatus();
    }

    /**
     * @en
     * The image atlas for the img tag. For each src value in the img tag, there should be a valid spriteFrame in the image atlas.
     *
     * @zh
     * 对于 img 标签里面的 src 属性名称，都需要在 imageAtlas 里面找到一个有效的 spriteFrame，否则 img tag 会判定为无效。
     */
    @type(SpriteAtlas)
    @tooltip('对于 img 标签里面的 src 属性名称，都需要在 imageAtlas 里面找到一个有效的 spriteFrame，否则 img tag 会判定为无效')
    get imageAtlas () {
        return this._imageAtlas;
    }

    set imageAtlas (value) {
        if (this._imageAtlas === value) {
            return;
        }

        this._imageAtlas = value;
        this._layoutDirty = true;
        this._updateRichTextStatus();
    }

    /**
     * @en
     * Once checked, the RichText will block all input events (mouse and touch) within
     * the bounding box of the node, preventing the input from penetrating into the underlying node.
     *
     * @zh
     * 选中此选项后，RichText 将阻止节点边界框中的所有输入事件（鼠标和触摸），从而防止输入事件穿透到底层节点。
     */
    @tooltip('选中此选项后，RichText 将阻止节点边界框中的所有输入事件（鼠标和触摸），从而防止输入事件穿透到底层节点')
    get handleTouchEvent () {
        return this._handleTouchEvent;
    }

    set handleTouchEvent (value) {
        if (this._handleTouchEvent === value) {
            return;
        }

        this._handleTouchEvent = value;
        if (this.enabledInHierarchy) {
            this.handleTouchEvent ? this._addEventListeners() : this._removeEventListeners();
        }
    }
    public static HorizontalAlign = HorizontalTextAlignment;
    public static VerticalAlign = VerticalTextAlignment;

    @serializable
    protected _lineHeight = 40;
    @serializable
    protected _string = '<color=#00ff00>Rich</color><color=#0fffff>Text</color>';
    // protected _updateRichTextStatus =
    @serializable
    protected _horizontalAlign = HorizontalTextAlignment.LEFT;
    @serializable
    protected _fontSize = 40;
    @serializable
    protected _maxWidth = 0;
    @serializable
    protected _fontFamily: string = 'Arial';
    @serializable
    protected _font: TTFFont | null = null;
    @serializable
    protected _isSystemFontUsed: boolean = true;
    @serializable
    protected _userDefinedFont: TTFFont | null = null;
    @serializable
    protected _cacheMode: CacheMode = CacheMode.NONE;
    @serializable
    protected _imageAtlas: SpriteAtlas | null = null;
    @serializable
    protected _handleTouchEvent = true;

    protected _textArray: IHtmlTextParserResultObj[] = [];
    protected _labelSegments: ILabelSegment[] = [];
    protected _labelSegmentsCache: ILabelSegment[] = [];
    protected _linesWidth: number[] = [];
    protected _lineCount = 1;
    protected _labelWidth = 0;
    protected _labelHeight = 0;
    protected _layoutDirty = true;
    protected _lineOffsetX = 0;
    protected _updateRichTextStatus: () => void;

    constructor () {
        super();
        if (EDITOR) {
            this._userDefinedFont = null;
        }
        this._updateRichTextStatus = this._updateRichText;
    }

    public onEnable () {
        if (this.handleTouchEvent) {
            this._addEventListeners();
        }

        this._updateRichText();
        this._activateChildren(true);
    }

    public onDisable () {
        if (this.handleTouchEvent) {
            this._removeEventListeners();
        }

        this._activateChildren(false);
    }

    public start () {
        this._onTTFLoaded();
        this.node.on(Node.EventType.ANCHOR_CHANGED, this._updateRichTextPosition, this);
    }

    public onRestore () {
        if (!EDITOR) {
            return;
        }

        // TODO: refine undo/redo system
        // Because undo/redo will not call onEnable/onDisable,
        // we need call onEnable/onDisable manually to active/disactive children nodes.
        if (this.enabledInHierarchy) {
            this.onEnable();
        }
        else {
            this.onDisable();
        }
    }

    public onDestroy () {
        for (const seg of this._labelSegments) {
            seg.node.removeFromParent();
            pool.put(seg);
        }

        this.node.off(Node.EventType.ANCHOR_CHANGED, this._updateRichTextPosition, this);
    }

    protected _addEventListeners () {
        this.node.on(Node.EventType.TOUCH_END, this._onTouchEnded, this);
    }

    protected _removeEventListeners () {
        this.node.off(Node.EventType.TOUCH_END, this._onTouchEnded, this);
    }

    protected _updateLabelSegmentTextAttributes () {
        this._labelSegments.forEach((item) => {
            this._applyTextAttribute(item);
        });
    }

    protected _createFontLabel (str: string): ILabelSegment {
        // @ts-ignore
        return pool.get(str, this);
    }

    protected _onTTFLoaded () {
        if (this._font instanceof TTFFont) {
            if (this._font._nativeAsset) {
                this._layoutDirty = true;
                this._updateRichText();
            }
            else {
                const self = this;
                loader.load(this._font.nativeUrl, (err, fontFamily) => {
                    self._layoutDirty = true;
                    self._updateRichText();
                });
            }
        }
        else {
            this._layoutDirty = true;
            this._updateRichText();
        }
    }

    protected _measureText (styleIndex: number, string?: string) {
        const self = this;
        const func = (s: string) => {
            let label: ILabelSegment;
            if (self._labelSegmentsCache.length === 0) {
                label = self._createFontLabel(s);
                self._labelSegmentsCache.push(label);
            }
            else {
                label = self._labelSegmentsCache[0];
                label.node.getComponent(Label)!.string = s;
            }
            label.styleIndex = styleIndex;
            self._applyTextAttribute(label);
            const labelSize = label.node._uiProps.uiTransformComp!.contentSize;
            return labelSize.width;
        };
        if (string) {
            return func(string);
        }
        else {
            return func;
        }
    }

    protected _onTouchEnded (event: EventTouch) {
        const components = this.node.getComponents(Component);

        const self = this;
        for (const seg of this._labelSegments) {
            const clickHandler = seg.clickHandler;
            const clickParam = seg.clickParam;
            if (clickHandler && this._containsTouchLocation(seg, event.touch!.getUILocation())) {
                components.forEach((component) => {
                    const func = component[clickHandler] as Function;
                    if (component.enabledInHierarchy && func) {
                        func.call(component, event, clickParam);
                    }
                });
                event.propagationStopped = true;
            }
        }
    }

    protected _containsTouchLocation (label: ILabelSegment, point: Vec2) {
        const comp = label.node.getComponent(UITransform);
        if (!comp) {
            return false;
        }

        const myRect = comp.getBoundingBoxToWorld();
        return myRect.contains(point);
    }

    protected _resetState () {
        const children = this.node.children as Mutable<Node[]>;

        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (child.name === RichTextChildName || child.name === RichTextChildImageName) {
                if (child.parent === this.node) {
                    child.parent = null;
                } else {
                    // In case child.parent !== this.node, child cannot be removed from children

                    children.splice(i, 1);
                }

                if (child.name === RichTextChildName) {
                    const index = this._labelSegments.findIndex((seg) => {
                        return seg.node === child;
                    });

                    if (index !== -1) {
                        pool.put(this._labelSegments[index]);
                    }
                }
            }
        }

        this._labelSegments.length = 0;
        this._labelSegmentsCache.length = 0;
        this._linesWidth.length = 0;
        this._lineOffsetX = 0;
        this._lineCount = 1;
        this._labelWidth = 0;
        this._labelHeight = 0;
        this._layoutDirty = true;
    }

    protected _activateChildren (active) {
        for (let i = this.node.children.length - 1; i >= 0; i--) {
            const child = this.node.children[i];
            if (child.name === RichTextChildName || child.name === RichTextChildImageName) {
                child.active = active;
            }
        }
    }

    protected _addLabelSegment (stringToken: string, styleIndex: number) {
        let labelSegment: ILabelSegment;
        if (this._labelSegmentsCache.length === 0) {
            labelSegment = this._createFontLabel(stringToken);
        } else {
            labelSegment = this._labelSegmentsCache.pop()!;
            const label = labelSegment.node.getComponent(Label);
            if (label) {
                label.string = stringToken;
            }
        }

        labelSegment.styleIndex = styleIndex;
        labelSegment.lineCount = this._lineCount;
        labelSegment.node._uiProps.uiTransformComp!.setAnchorPoint(0, 0);
        this._applyTextAttribute(labelSegment);
        // @ts-ignore
        this.node.addChild(labelSegment.node);
        this._labelSegments.push(labelSegment);

        return labelSegment;
    }

    protected _updateRichTextWithMaxWidth (labelString: string, labelWidth: number, styleIndex: number) {
        let fragmentWidth = labelWidth;
        let labelSegment: ILabelSegment;

        if (this._lineOffsetX > 0 && fragmentWidth + this._lineOffsetX > this._maxWidth) {
            // concat previous line
            let checkStartIndex = 0;
            while (this._lineOffsetX <= this._maxWidth) {
                const checkEndIndex = this._getFirstWordLen(labelString, checkStartIndex, labelString.length);
                const checkString = labelString.substr(checkStartIndex, checkEndIndex);
                const checkStringWidth = this._measureText(styleIndex, checkString) as number;

                if (this._lineOffsetX + checkStringWidth <= this._maxWidth) {
                    this._lineOffsetX += checkStringWidth;
                    checkStartIndex += checkEndIndex;
                }
                else {

                    if (checkStartIndex > 0) {
                        const remainingString = labelString.substr(0, checkStartIndex);
                        this._addLabelSegment(remainingString, styleIndex);
                        labelString = labelString.substr(checkStartIndex, labelString.length);
                        fragmentWidth = this._measureText(styleIndex, labelString) as number;
                    }
                    this._updateLineInfo();
                    break;
                }
            }
        }
        if (fragmentWidth > this._maxWidth) {
            const fragments = fragmentText(labelString, fragmentWidth, this._maxWidth, this._measureText(styleIndex) as (s: string) => number);
            for (let k = 0; k < fragments.length; ++k) {
                const splitString = fragments[k];
                labelSegment = this._addLabelSegment(splitString, styleIndex);
                const labelSize = labelSegment.node._uiProps.uiTransformComp!.contentSize;
                this._lineOffsetX += labelSize.width;
                if (fragments.length > 1 && k < fragments.length - 1) {
                    this._updateLineInfo();
                }
            }
        }
        else {
            this._lineOffsetX += fragmentWidth;
            this._addLabelSegment(labelString, styleIndex);
        }
    }

    protected _isLastComponentCR (stringToken) {
        return stringToken.length - 1 === stringToken.lastIndexOf('\n');
    }

    protected _updateLineInfo () {
        this._linesWidth.push(this._lineOffsetX);
        this._lineOffsetX = 0;
        this._lineCount++;
    }

    protected _needsUpdateTextLayout (newTextArray: IHtmlTextParserResultObj[]) {
        if (this._layoutDirty || !this._textArray || !newTextArray) {
            return true;
        }

        if (this._textArray.length !== newTextArray.length) {
            return true;
        }

        for (let i = 0; i < this._textArray.length; i++) {
            const oldItem = this._textArray[i];
            const newItem = newTextArray[i];
            if (oldItem.text !== newItem.text) {
                return true;
            } else {
                let oldStyle = oldItem.style, newStyle = newItem.style;
                if (oldStyle) {
                    if (newStyle) {
                        if (!!newStyle.outline !== !!oldStyle.outline) {
                            return true;
                        }
                        if (oldStyle.size !== newStyle.size ||
                            oldStyle.italic !== newStyle.italic ||
                            oldStyle.isImage !== newStyle.isImage) {
                            return true;
                        }
                        if (oldStyle.src !== newStyle.src ||
                            oldStyle.imageAlign !== newStyle.imageAlign ||
                            oldStyle.imageHeight !== newStyle.imageHeight ||
                            oldStyle.imageWidth !== newStyle.imageWidth ||
                            oldStyle.imageOffset !== newStyle.imageOffset) {
                            return true;
                        }
                    } else {
                        if (oldStyle.size || oldStyle.italic || oldStyle.isImage || oldStyle.outline) {
                            return true;
                        }
                    }
                } else {
                    if (newStyle) {
                        if (newStyle.size || newStyle.italic || newStyle.isImage || newStyle.outline) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    protected _addRichTextImageElement (richTextElement: IHtmlTextParserResultObj) {
        if (!richTextElement.style) {
            return;
        }

        const style = richTextElement.style;
        const spriteFrameName = style.src;
        const spriteFrame = this._imageAtlas && spriteFrameName && this._imageAtlas.getSpriteFrame(spriteFrameName);
        if (!spriteFrame) {
            warnID(4400);
        } else {
            const spriteNode = new PrivateNode(RichTextChildImageName);
            const sprite = spriteNode.addComponent(Sprite);
            switch (style.imageAlign) {
                case 'top':
                    spriteNode._uiProps.uiTransformComp!.setAnchorPoint(0, 1);
                    break;
                case 'center':
                    spriteNode._uiProps.uiTransformComp!.setAnchorPoint(0, 0.5);
                    break;
                default:
                    spriteNode._uiProps.uiTransformComp!.setAnchorPoint(0, 0);
                    break;
            }
            sprite.type = Sprite.Type.SLICED;
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;

            // Why need to set spriteFrame before can add child ??
            sprite.spriteFrame = spriteFrame;
            // @ts-ignore
            this.node.addChild(spriteNode);
            const obj: ILabelSegment = {
                node: spriteNode,
                comp: sprite,
                lineCount: 0,
                styleIndex: 0,
                imageOffset: style.imageOffset || '',
                clickParam: '',
                clickHandler: '',
            };
            this._labelSegments.push(obj);


            const spriteRect = spriteFrame.rect.clone();
            let scaleFactor = 1;
            let spriteWidth = spriteRect.width;
            let spriteHeight = spriteRect.height;
            const expectWidth = style.imageWidth || 0;
            const expectHeight = style.imageHeight || 0;

            if (expectHeight > 0) {
                scaleFactor = expectHeight / spriteHeight;
                spriteWidth = spriteWidth * scaleFactor;
                spriteHeight = spriteHeight * scaleFactor;
            } else {
                scaleFactor = this._lineHeight / spriteHeight;
                spriteWidth = spriteWidth * scaleFactor;
                spriteHeight = spriteHeight * scaleFactor;
            }

            if (expectWidth > 0) {
                spriteWidth = expectWidth;
            }

            if (this._maxWidth > 0) {
                if (this._lineOffsetX + spriteWidth > this._maxWidth) {
                    this._updateLineInfo();
                }
                this._lineOffsetX += spriteWidth;

            } else {
                this._lineOffsetX += spriteWidth;
                if (this._lineOffsetX > this._labelWidth) {
                    this._labelWidth = this._lineOffsetX;
                }
            }
            spriteNode._uiProps.uiTransformComp!.setContentSize(spriteWidth, spriteHeight);
            obj.lineCount = this._lineCount;

            obj.clickHandler = '';
            obj.clickParam = '';
            let event = style.event;
            if (event) {
                obj.clickHandler = event['click'];
                obj.clickParam = event['param'];
            }
        }
    }

    protected _updateRichText () {
        if (!this.enabledInHierarchy) {
            return;
        }

        const newTextArray = _htmlTextParser.parse(this._string);
        if (!this._needsUpdateTextLayout(newTextArray)) {
            this._textArray = newTextArray.slice();
            this._updateLabelSegmentTextAttributes();
            return;
        }

        this._textArray = newTextArray.slice();
        this._resetState();

        let lastEmptyLine = false;
        let label: ILabelSegment;

        for (let i = 0; i < this._textArray.length; ++i) {
            const richTextElement = this._textArray[i];
            const text = richTextElement.text;
            if (text === undefined) {
                continue;
            }

            // handle <br/> <img /> tag
            if (text === '') {
                if (richTextElement.style && richTextElement.style.isNewLine) {
                    this._updateLineInfo();
                    continue;
                }
                if (richTextElement.style && richTextElement.style.isImage && this._imageAtlas) {
                    this._addRichTextImageElement(richTextElement);
                    continue;
                }
            }
            const multilineTexts = text.split('\n');

            for (let j = 0; j < multilineTexts.length; ++j) {
                const labelString = multilineTexts[j];
                if (labelString === '') {
                    // for continues \n
                    if (this._isLastComponentCR(text) && j === multilineTexts.length - 1) {
                        continue;
                    }
                    this._updateLineInfo();
                    lastEmptyLine = true;
                    continue;
                }
                lastEmptyLine = false;

                if (this._maxWidth > 0) {
                    const labelWidth = this._measureText(i, labelString) as number;
                    this._updateRichTextWithMaxWidth(labelString, labelWidth, i);

                    if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
                        this._updateLineInfo();
                    }
                } else {
                    label = this._addLabelSegment(labelString, i);

                    this._lineOffsetX += label.node._uiProps.uiTransformComp!.width;
                    if (this._lineOffsetX > this._labelWidth) {
                        this._labelWidth = this._lineOffsetX;
                    }

                    if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
                        this._updateLineInfo();
                    }
                }
            }
        }
        if (!lastEmptyLine) {
            this._linesWidth.push(this._lineOffsetX);
        }

        if (this._maxWidth > 0) {
            this._labelWidth = this._maxWidth;
        }
        this._labelHeight = (this._lineCount + BASELINE_RATIO) * this._lineHeight;

        // trigger "size-changed" event
        this.node._uiProps.uiTransformComp!.setContentSize(this._labelWidth, this._labelHeight);

        this._updateRichTextPosition();
        this._layoutDirty = false;
    }

    protected _getFirstWordLen (text: string, startIndex: number, textLen: number) {
        let character = text.charAt(startIndex);
        if (isUnicodeCJK(character) || isUnicodeSpace(character)) {
            return 1;
        }

        let len = 1;
        for (let index = startIndex + 1; index < textLen; ++index) {
            character = text.charAt(index);
            if (isUnicodeSpace(character) || isUnicodeCJK(character)) {
                break;
            }

            len++;
        }

        return len;
    }

    protected _updateRichTextPosition () {
        let nextTokenX = 0;
        let nextLineIndex = 1;
        const totalLineCount = this._lineCount;
        const trans = this.node._uiProps.uiTransformComp!;
        const anchorX = trans.anchorX;
        const anchorY = trans.anchorY;
        for (let i = 0; i < this._labelSegments.length; ++i) {
            const segment = this._labelSegments[i];
            const lineCount = segment.lineCount;
            if (lineCount > nextLineIndex) {
                nextTokenX = 0;
                nextLineIndex = lineCount;
            }

            let lineOffsetX = this._labelWidth * (this._horizontalAlign * 0.5 - anchorX);
            switch (this._horizontalAlign) {
                case HorizontalTextAlignment.LEFT:
                    break;
                case HorizontalTextAlignment.CENTER:
                    lineOffsetX -= this._linesWidth[lineCount - 1] / 2;
                    break;
                case HorizontalTextAlignment.RIGHT:
                    lineOffsetX -= this._linesWidth[lineCount - 1];
                    break;
                default:
                    break;
            }

            const pos = segment.node.position;
            segment.node.setPosition(nextTokenX + lineOffsetX,
                this._lineHeight * (totalLineCount - lineCount) - this._labelHeight * anchorY,
                pos.z,
            );

            if (lineCount === nextLineIndex) {
                nextTokenX += segment.node._uiProps.uiTransformComp!.width;
            }

            let sprite = segment.node.getComponent(Sprite);
            if (sprite) {
                let position = segment.node.position.clone();
                // adjust img align (from <img align=top|center|bottom>)
                let lineHeightSet = this._lineHeight;
                let lineHeightReal = this._lineHeight * (1 + BASELINE_RATIO); //single line node height
                switch (segment.node._uiProps.uiTransformComp!.anchorY) {
                    case 1:
                        position.y += (lineHeightSet + ((lineHeightReal - lineHeightSet) / 2));
                        break;
                    case 0.5:
                        position.y += (lineHeightReal / 2);
                        break;
                    default:
                        position.y += ((lineHeightReal - lineHeightSet) / 2);
                        break;
                }
                // adjust img offset (from <img offset=12|12,34>)
                if (segment.imageOffset) {
                    let offsets = segment.imageOffset.split(',');
                    if (offsets.length === 1 && offsets[0]) {
                        let offsetY = parseFloat(offsets[0]);
                        if (Number.isInteger(offsetY)) position.y += offsetY;
                    }
                    else if (offsets.length === 2) {
                        let offsetX = parseFloat(offsets[0]);
                        let offsetY = parseFloat(offsets[1]);
                        if (Number.isInteger(offsetX)) position.x += offsetX;
                        if (Number.isInteger(offsetY)) position.y += offsetY;
                    }
                }
                segment.node.position = position;
            }

            //adjust y for label with outline
            let outline = segment.node.getComponent(LabelOutline);
            if (outline) {
                let position = segment.node.position.clone();
                position.y = position.y - outline.width;
                segment.node.position = position;
            }
        }
    }

    protected _convertLiteralColorValue (color: string) {
        const colorValue = color.toUpperCase();
        if (Color[colorValue]) {
            return Color[colorValue];
        }
        else {
            const out = new Color();
            return out.fromHEX(color);
        }
    }

    protected _applyTextAttribute (labelSeg: ILabelSegment) {
        const label = labelSeg.node.getComponent(Label);
        if (!label) {
            return;
        }

        const index = labelSeg.styleIndex;

        let textStyle: IHtmlTextParserStack | undefined;
        if (this._textArray[index]) {
            textStyle = this._textArray[index].style;
        }

        if (textStyle) {
            label.color = this._convertLiteralColorValue(textStyle.color || 'white');
            label.isBold = !!textStyle.bold;
            label.isItalic = !!textStyle.italic;
            // TODO: temporary implementation, the italic effect should be implemented in the internal of label-assembler.
            // if (textStyle.italic) {
            //     labelNode.skewX = 12;
            // }

            label.isUnderline = !!textStyle.underline;
            if (textStyle.outline) {
                let labelOutline = labelSeg.node.getComponent(LabelOutline);
                if (!labelOutline) {
                    labelOutline = labelSeg.node.addComponent(LabelOutline);
                }

                labelOutline.color = this._convertLiteralColorValue(textStyle.outline.color);
                labelOutline.width = textStyle.outline.width;
            }

            if (textStyle.size) {
                label.fontSize = textStyle.size;
            }

            labelSeg.clickHandler = '';
            labelSeg.clickParam = '';
            let event = textStyle.event;
            if (event) {
                labelSeg.clickHandler = event['click'] || '';
                labelSeg.clickParam = event['param'] || '';
            }
        }
        else {
            label.fontSize = this._fontSize;
        }

        label.cacheMode = this._cacheMode;

        let isAsset = this._font instanceof Font;
        if (isAsset && !this._isSystemFontUsed) {
            label.font = this._font;
        } else {
            label.fontFamily = this._fontFamily;
        }
        label.useSystemFont = this._isSystemFontUsed;
        label.lineHeight = this._lineHeight;

        label.updateRenderData(true);
    }
}
