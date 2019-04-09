/****************************************************************************
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
 ****************************************************************************/

import { LabelOutlineComponent } from '../../../2d/label/label-outline';
import { SpriteAtlas, TTFFont } from '../../../assets';
import { Font } from '../../../assets/font';
import { Color, Vec2 } from '../../../core';
import { ccclass, executeInEditMode, executionOrder, menu, property } from '../../../core/data/class-decorator';
import { EventTouch } from '../../../core/platform/event-manager';
import { HtmlTextParser, IHtmlTextParserResultObj, IHtmlTextParserStack } from '../../../core/utils/html-text-parser';
import Pool from '../../../core/utils/pool';
import { fragmentText, isUnicodeCJK, isUnicodeSpace } from '../../../core/utils/text-utils';
import { Node, PrivateNode } from '../../../scene-graph';
import { HorizontalTextAlignment, LabelComponent, VerticalTextAlignment } from './label-component';
import { SpriteComponent } from './sprite-component';
import { UIComponent } from './ui-component';
import { UIRenderComponent } from './ui-render-component';
import { UITransformComponent } from './ui-transfrom-component';

const _htmlTextParser = new HtmlTextParser();
const HorizontalAlign = HorizontalTextAlignment;
const VerticalAlign = VerticalTextAlignment;
const RichTextChildName = 'RICHTEXT_CHILD';
const RichTextChildImageName = 'RICHTEXT_Image_CHILD';

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce (func: Function, wait: number, immediate?: boolean) {
    let timeout;
    return function (this: any) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) { func.apply(context, arguments); }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) { func.apply(context, arguments); }
    };
}

/**
 * RichText pool
 */
const pool = new Pool((node: Node) => {
    if (CC_EDITOR) {
        return false;
    }
    if (CC_DEV) {
        cc.assert(!node.parent, 'Recycling node\'s parent should be null!');
    }
    if (!cc.isValid(node)) {
        return false;
    }
    else if (node.getComponent(cc.LabelOutline)) {
        return false;
    }
    return true;
}, 20);

pool.get = function (string: string, richtext: RichTextComponent) {
    let labelNode = this._get();
    if (!labelNode) {
        labelNode = new PrivateNode(RichTextChildName);
    }

    let labelComponent: LabelComponent = labelNode.getComponent(LabelComponent);
    if (!labelComponent) {
        labelComponent = labelNode.addComponent(LabelComponent);
    }

    labelNode.setPosition(0, 0, 0);
    // labelNode.setAnchorPoint(0.5, 0.5);
    labelNode.setContentSize(128, 128);
    // labelNode.skewX = 0;

    if (typeof string !== 'string') {
        string = '' + string;
    }
    const isAsset = richtext.font instanceof Font;
    if (isAsset) {
        labelComponent.font = richtext.font;
    } else {
        labelComponent.fontFamily = 'Arial';
    }
    labelComponent.string = string;
    labelComponent.horizontalAlign = HorizontalAlign.LEFT;
    labelComponent.verticalAlign = VerticalAlign.TOP;
    labelComponent.fontSize = richtext.fontSize || 40;
    labelComponent.overflow = 0;
    labelComponent.enableWrapText = true;
    labelComponent.lineHeight = 40;
    labelComponent.isBold = false;
    labelComponent.isItalic = false;
    labelComponent.isUnderline = false;

    const labelObj: ILabelSegment = {
        node: labelNode,
        comp: labelComponent,
        lineCount: 0,
        clickHandler: '',
        styleIndex: 0,
    };

    return labelObj;
};

interface ILabelSegment{
    node: PrivateNode;
    comp: UIRenderComponent | null;
    clickHandler: '';
    styleIndex: number;
    lineCount: number;
}

/**
 * !#en The RichText Component.
 * !#zh 富文本组件
 * @class RichText
 * @extends Component
 */
@ccclass('cc.RichTextComponent')
@executionOrder(100)
@menu('UI/RichText')
@executeInEditMode
export class RichTextComponent extends UIComponent {

    /**
     * !#en Content string of RichText.
     * !#zh 富文本显示的文本内容。
     * @property {String} string
     */
    @property({
        multiline: true,
    })
    get string () {
        return this._string;
    }
    set string (value) {
        if (this._string === value){
            return;
        }

        this._string = value;
        this._updateRichTextStatus();
    }

    /**
     * !#en Horizontal Alignment of each line in RichText.
     * !#zh 文本内容的水平对齐方式。
     * @property {macro.TextAlignment} horizontalAlign
     */
    @property({
        type: HorizontalAlign,
    })
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
     * !#en Font size of RichText.
     * !#zh 富文本字体大小。
     * @property {Number} fontSize
     */
    @property
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
     * !#en Custom TTF font of RichText
     * !#zh  富文本定制字体
     * @property {cc.TTFFont} font
     */
    @property({
        type: TTFFont,
    })
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
            this._onTTFLoaded();
        }
        this._updateRichTextStatus();
    }

    /**
     * !#en The maximize width of the RichText
     * !#zh 富文本的最大宽度
     * @property {Number} maxWidth
     */
    @property
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
     * !#en Line Height of RichText.
     * !#zh 富文本行高。
     * @property {Number} lineHeight
     */
    @property
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
     * !#en The image atlas for the img tag. For each src value in the img tag, there should be a valid spriteFrame in the image atlas.
     * !#zh 对于 img 标签里面的 src 属性名称，都需要在 imageAtlas 里面找到一个有效的 spriteFrame，否则 img tag 会判定为无效。
     * @property {SpriteAtlas} imageAtlas
     */
    @property({
        type: SpriteAtlas,
    })
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
     * !#en
     * Once checked, the RichText will block all input events (mouse and touch) within
     * the bounding box of the node, preventing the input from penetrating into the underlying node.
     * !#zh
     * 选中此选项后，RichText 将阻止节点边界框中的所有输入事件（鼠标和触摸），从而防止输入事件穿透到底层节点。
     * @property {Boolean} handleTouchEvent
     * @default true
     */
    @property
    get handleTouchEvent (){
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
    public static HorizontalAlign = HorizontalAlign;
    public static VerticalAlign = VerticalAlign;

    @property
    private _lineHeight = 40;
    @property
    private _string = '<color=#00ff00>Rich</c><color=#0fffff>Text</color>';
    // private _updateRichTextStatus =
    @property
    private _horizontalAlign = HorizontalAlign.LEFT;
    @property
    private _fontSize = 40;
    @property
    private _maxWidth = 0;
    @property
    private _font: TTFFont | null = null;
    @property
    private _imageAtlas: SpriteAtlas | null = null;
    @property
    private _handleTouchEvent = true;

    private _textArray: IHtmlTextParserResultObj[] = [];
    private _labelSegments: ILabelSegment[] = [];
    private _labelSegmentsCache: ILabelSegment[] = [];
    private _linesWidth: number[] = [];
    private _lineCount = 1;
    private _labelWidth = 0;
    private _labelHeight = 0;
    private _layoutDirty = true;
    private _lineOffsetX = 0;
    private _updateRichTextStatus: () => void;

    constructor () {
        super();
        if (CC_EDITOR) {
            this._updateRichTextStatus = debounce(this._updateRichText, 200);
        }
        else {
            this._updateRichTextStatus = this._updateRichText;
        }
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
    }

    public onRestore () {
        if (!CC_EDITOR){
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
    }

    private _addEventListeners () {
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    }

    private _removeEventListeners () {
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    }

    private _updateLabelSegmentTextAttributes () {
        this._labelSegments.forEach((item) => {
            this._applyTextAttribute(item);
        });
    }

    private _createFontLabel (string: string) {
        return pool.get(string, this);
    }

    private _onTTFLoaded () {
        if (this._font instanceof TTFFont) {
            if (this._font._nativeAsset) {
                this._layoutDirty = true;
                this._updateRichText();
            }
            else {
                const self = this;
                cc.loader.load(this._font.nativeUrl, (err, fontFamily) => {
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

    private _measureText (styleIndex: number, string?: string) {
        const self = this;
        const func = (s: string) => {
            let label: ILabelSegment;
            if (self._labelSegmentsCache.length === 0) {
                label = self._createFontLabel(s);
                self._labelSegmentsCache.push(label);
            }
            else {
                label = self._labelSegmentsCache[0];
                label.node.getComponent(LabelComponent)!.string = s;
            }
            label.styleIndex = styleIndex;
            self._applyTextAttribute(label);
            const labelSize = label.node.getContentSize();
            return labelSize.width;
        };
        if (string) {
            return func(string);
        }
        else {
            return func;
        }
    }

    private _onTouchEnded (event: EventTouch) {
        const components = this.node.getComponents(UIComponent);

        const self = this;
        for (const seg of this._labelSegments) {
            const clickHandler = seg.clickHandler;
            if (clickHandler && this._containsTouchLocation(seg, event.touch!.getUILocation())) {
                components.forEach((component) => {
                    const func = component[clickHandler] as Function;
                    if (component.enabledInHierarchy && func) {
                        func.call(self, event);
                    }
                });
                event.propagationStopped = true;
            }
        }
    }

    private _containsTouchLocation (label: ILabelSegment, point: Vec2) {
        const comp = label.node.getComponent(UITransformComponent);
        if (!comp){
            return false;
        }

        const myRect = comp.getBoundingBoxToWorld();
        return myRect.contains(point);
    }

    private _resetState () {
        const children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (child.name === RichTextChildName || child.name === RichTextChildImageName) {
                if (child.parent === this.node) {
                    child.parent = null;
                }
                else {
                    // In case child.parent !== this.node, child cannot be removed from children
                    children.splice(i, 1);
                }
                if (child.name === RichTextChildName) {
                    pool.put(child);
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

    private _activateChildren (active) {
        for (let i = this.node.children.length - 1; i >= 0; i--) {
            const child = this.node.children[i];
            if (child.name === RichTextChildName || child.name === RichTextChildImageName) {
                child.active = active;
            }
        }
    }

    private _addLabelSegment (stringToken: string, styleIndex: number) {
        let labelSegment: ILabelSegment;
        if (this._labelSegmentsCache.length === 0) {
            labelSegment = this._createFontLabel(stringToken);
        } else {
            labelSegment = this._labelSegmentsCache.pop()!;
            const label = labelSegment.node.getComponent(LabelComponent);
            if (label) {
                label.string = stringToken;
            }
        }

        labelSegment.styleIndex = styleIndex;
        labelSegment.lineCount = this._lineCount;
        labelSegment.node.setAnchorPoint(0, 0);
        this._applyTextAttribute(labelSegment);
        this.node.addChild(labelSegment.node);
        this._labelSegments.push(labelSegment);

        return labelSegment;
    }

    private _updateRichTextWithMaxWidth (labelString: string, labelWidth: number, styleIndex: number) {
        let fragmentWidth = labelWidth;
        let labelSegment: ILabelSegment;

        if (this._lineOffsetX > 0 && fragmentWidth + this._lineOffsetX > this.maxWidth) {
            // concat previous line
            let checkStartIndex = 0;
            while (this._lineOffsetX <= this.maxWidth) {
                const checkEndIndex = this._getFirstWordLen(labelString,
                    checkStartIndex,
                    labelString.length);
                const checkString = labelString.substr(checkStartIndex, checkEndIndex);
                const checkStringWidth = this._measureText(styleIndex, checkString) as number;

                if (this._lineOffsetX + checkStringWidth <= this.maxWidth) {
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
        if (fragmentWidth > this.maxWidth) {
            const fragments = fragmentText(labelString,
                fragmentWidth,
                this.maxWidth,
                this._measureText(styleIndex) as (s: string) => number);
            for (let k = 0; k < fragments.length; ++k) {
                const splitString = fragments[k];
                labelSegment = this._addLabelSegment(splitString, styleIndex);
                const labelSize = labelSegment.node.getContentSize();
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

    private _isLastComponentCR (stringToken) {
        return stringToken.length - 1 === stringToken.lastIndexOf('\n');
    }

    private _updateLineInfo () {
        this._linesWidth.push(this._lineOffsetX);
        this._lineOffsetX = 0;
        this._lineCount++;
    }

    private _needsUpdateTextLayout (newTextArray: IHtmlTextParserResultObj[]) {
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
            }
            else {
                if (oldItem.style) {
                    if (newItem.style) {
                        if (!!newItem.style.outline !== !!oldItem.style.outline) {
                            return true;
                        }
                        if (oldItem.style.size !== newItem.style.size
                            || oldItem.style.italic !== newItem.style.italic
                            || oldItem.style.isImage !== newItem.style.isImage) {
                            return true;
                        }
                        if (oldItem.style.isImage === newItem.style.isImage) {
                            if (oldItem.style.src !== newItem.style.src) {
                                return true;
                            }
                        }
                    }
                    else {
                        if (oldItem.style.size || oldItem.style.italic || oldItem.style.isImage || oldItem.style.outline) {
                            return true;
                        }
                    }
                }
                else {
                    if (newItem.style) {
                        if (newItem.style.size || newItem.style.italic || newItem.style.isImage || newItem.style.outline) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    private _addRichTextImageElement (richTextElement: IHtmlTextParserResultObj) {
        if (!richTextElement.style){
            return;
        }

        const spriteFrameName = richTextElement.style.src;
        const spriteFrame = this._imageAtlas && spriteFrameName && this._imageAtlas.getSpriteFrame(spriteFrameName);
        if (spriteFrame) {
            const spriteNode = new PrivateNode(RichTextChildImageName);
            const spriteComponent = spriteNode.addComponent(SpriteComponent);
            spriteNode.setAnchorPoint(0, 0);
            spriteComponent!.type = cc.SpriteComponent.Type.SLICED;
            spriteComponent!.sizeMode = cc.SpriteComponent.SizeMode.CUSTOM;
            this.node.addChild(spriteNode);
            const obj: ILabelSegment = {
                node: spriteNode,
                comp: spriteComponent,
                lineCount: 0,
                clickHandler: '',
                styleIndex: 0,
            };
            this._labelSegments.push(obj);

            const spriteRect = spriteFrame.getRect();
            let scaleFactor = 1;
            let spriteWidth = spriteRect.width;
            let spriteHeight = spriteRect.height;
            const expectWidth = richTextElement.style.imageWidth;
            const expectHeight = richTextElement.style.imageHeight;

            // follow the original rule, expectHeight must less then lineHeight
            if (expectHeight !== undefined && expectHeight > 0 && expectHeight < this.lineHeight) {
                scaleFactor = expectHeight / spriteHeight;
                spriteWidth = spriteWidth * scaleFactor;
                spriteHeight = spriteHeight * scaleFactor;
            } else {
                scaleFactor = this.lineHeight / spriteHeight;
                spriteWidth = spriteWidth * scaleFactor;
                spriteHeight = spriteHeight * scaleFactor;
            }

            if (expectWidth !== undefined && expectWidth > 0) {
                spriteWidth = expectWidth;
            }

            if (this.maxWidth > 0) {
                if (this._lineOffsetX + spriteWidth > this.maxWidth) {
                    this._updateLineInfo();
                }
                this._lineOffsetX += spriteWidth;

            }
            else {
                this._lineOffsetX += spriteWidth;
                if (this._lineOffsetX > this._labelWidth) {
                    this._labelWidth = this._lineOffsetX;
                }
            }
            spriteComponent!.spriteFrame = spriteFrame;
            spriteNode.setContentSize(spriteWidth, spriteHeight);
            obj.lineCount = this._lineCount;

            if (richTextElement.style.event) {
                const c = 'click';
                if (richTextElement.style.event[c]) {
                    obj.clickHandler = richTextElement.style.event[c];
                }
            }
        }
        else {
            cc.warnID(4400);
        }
    }

    private _updateRichText () {
        if (!this.enabled) {
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
        let labelSize;

        for (let i = 0; i < this._textArray.length; ++i) {
            const richTextElement = this._textArray[i];
            const text = richTextElement.text;
            if (text === undefined){
                continue;
            }

            // handle <br/> <img /> tag
            if (text === '') {
                if (richTextElement.style && richTextElement.style.isNewLine) {
                    this._updateLineInfo();
                    continue;
                }
                if (richTextElement.style && richTextElement.style.isImage && this.imageAtlas) {
                    this._addRichTextImageElement(richTextElement);
                    continue;
                }
            }
            const multilineTexts = text.split('\n');

            for (let j = 0; j < multilineTexts.length; ++j) {
                const labelString = multilineTexts[j];
                if (labelString === '') {
                    // for continues \n
                    if (this._isLastComponentCR(text)
                        && j === multilineTexts.length - 1) {
                        continue;
                    }
                    this._updateLineInfo();
                    lastEmptyLine = true;
                    continue;
                }
                lastEmptyLine = false;

                if (this.maxWidth > 0) {
                    const labelWidth = this._measureText(i, labelString) as number;
                    this._updateRichTextWithMaxWidth(labelString, labelWidth, i);

                    if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
                        this._updateLineInfo();
                    }
                }
                else {
                    label = this._addLabelSegment(labelString, i);
                    labelSize = label.node.getContentSize();

                    this._lineOffsetX += labelSize.width;
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

        if (this.maxWidth > 0) {
            this._labelWidth = this.maxWidth;
        }
        this._labelHeight = this._lineCount * this.lineHeight;

        // trigger "size-changed" event
        this.node.setContentSize(this._labelWidth, this._labelHeight);

        this._updateRichTextPosition();
        this._layoutDirty = false;
    }

    private _getFirstWordLen (text: string, startIndex: number, textLen: number) {
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

    private _updateRichTextPosition () {
        let nextTokenX = 0;
        let nextLineIndex = 1;
        const totalLineCount = this._lineCount;
        for (const label of this._labelSegments) {
            const lineCount = label.lineCount;
            if (lineCount > nextLineIndex) {
                nextTokenX = 0;
                nextLineIndex = lineCount;
            }

            let lineOffsetX = 0;
            // let nodeAnchorXOffset = (0.5 - this.node.anchorX) * this._labelWidth;
            switch (this.horizontalAlign) {
                case HorizontalAlign.LEFT:
                    lineOffsetX = - this._labelWidth / 2;
                    break;
                case HorizontalAlign.CENTER:
                    lineOffsetX = - this._linesWidth[lineCount - 1] / 2;
                    break;
                case HorizontalAlign.RIGHT:
                    lineOffsetX = this._labelWidth / 2 - this._linesWidth[lineCount - 1];
                    break;
                default:
                    break;
            }

            const labelSize = label.node.getContentSize();

            const pos = label.node.getPosition();
            label.node.setPosition(nextTokenX + lineOffsetX,
                this.lineHeight * (totalLineCount - lineCount) - this._labelHeight / 2,
                pos.x,
            );

            if (lineCount === nextLineIndex) {
                nextTokenX += labelSize.width;
            }
        }
    }

    private _convertLiteralColorValue (color: string) {
        const colorValue = color.toUpperCase();
        if (Color[colorValue]) {
            return Color[colorValue];
        }
        else {
            const out = new Color();
            return out.fromHEX(color);
        }
    }

    private _applyTextAttribute (labelSeg: ILabelSegment) {
        const labelComponent = labelSeg.node.getComponent(LabelComponent);
        if (!labelComponent) {
            return;
        }

        const index = labelSeg.styleIndex;
        labelComponent.lineHeight = this.lineHeight;
        labelComponent.horizontalAlign = HorizontalAlign.LEFT;
        labelComponent.verticalAlign = VerticalAlign.CENTER;

        let textStyle: IHtmlTextParserStack | undefined;
        if (this._textArray[index]) {
            textStyle = this._textArray[index].style;
        }

        const labelComp = labelSeg.node.getComponent(LabelComponent);
        if (labelComp) {
            if (textStyle && textStyle.color) {
                labelComp.color = this._convertLiteralColorValue(textStyle.color);
            } else {
                labelComp.color = this._convertLiteralColorValue('white');
            }
        }

        labelComponent.isBold = !!(textStyle && textStyle.bold);

        labelComponent.isItalic = !!(textStyle && textStyle.italic);
        // TODO: temporary implementation, the italic effect should be implemented in the internal of label-assembler.
        // if (textStyle && textStyle.italic) {
        //     labelNode.skewX = 12;
        // }

        labelComponent.isUnderline = !!(textStyle && textStyle.underline);

        if (textStyle && textStyle.outline) {
            let labelOutlineComponent = labelSeg.node.getComponent(LabelOutlineComponent);
            if (!labelOutlineComponent) {
                labelOutlineComponent = labelSeg.node.addComponent(LabelOutlineComponent);
            }

            labelOutlineComponent!.color = this._convertLiteralColorValue(textStyle.outline.color);
            labelOutlineComponent!.width = textStyle.outline.width;
        }

        if (textStyle && textStyle.size) {
            labelComponent.fontSize = textStyle.size;
        }
        else {
            labelComponent.fontSize = this._fontSize;
        }

        labelComponent.updateRenderData(true);

        if (textStyle && textStyle.event) {
            const c = 'click';
            if (textStyle.event[c]) {
                labelSeg.clickHandler = textStyle.event[c];
            }
        }
    }
}

cc.RichTextComponent = RichTextComponent;
