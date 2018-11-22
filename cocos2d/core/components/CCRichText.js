/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
const js = require('../platform/js');
const macro = require('../platform/CCMacro');
const textUtils = require('../utils/text-utils');
const HtmlTextParser = require('../utils/html-text-parser');
const _htmlTextParser = new HtmlTextParser();

const HorizontalAlign = macro.TextAlignment;
const VerticalAlign = macro.VerticalTextAlignment;
const RichTextChildName = "RICHTEXT_CHILD";
const RichTextChildImageName = "RICHTEXT_Image_CHILD";

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        let context = this;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, arguments);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, arguments);
    };
}

/**
 * RichText pool
 */
let _segmentPool = new js.Pool(function (node) {
    if (CC_EDITOR) {
        return false;
    }
    if (CC_DEV) {
        cc.assert(!node._parent, 'Recycling node\'s parent should be null!');
    }
    if (!cc.isValid(node)) {
        return false;
    }
    else if (node.getComponent(cc.LabelOutline)) {
        return false;
    }
    return true;
}, 20);


_segmentPool.get = function (richText, name) {
    let segment = {};
    let node = this._get();
    if (!node) {
        node = new cc.PrivateNode();
    }
    node.name = name;
    node.setPosition(0, 0);
    node.setAnchorPoint(0, 0);
    node.setContentSize(128, 128);
    node.color = cc.Color.WHITE;
    node.skewX = 0;

    node.parent = richText.node;
    node.active = richText.node.active;

    segment.node = node;
    segment._styleIndex = -1;
    segment._lineCount = -1;
    segment._clickHandler = null;
    segment._clickParam = null;

    if (name === RichTextChildName) {
        segment.addLabelComponent = function (string, styleIndex, richText) {
            let label = this.node.getComponent(cc.Label);
            if (!label) {
                label = this.node.addComponent(cc.Label);
            }

            if (typeof string !== 'string') {
                string = '' + string;
            }
            let isAsset = richText.font instanceof cc.Font;
            if (isAsset) {
                label.font = richText.font;
            } else {
                label.fontFamily = "Arial";
            }
            label.string = string;

            label.horizontalAlign = HorizontalAlign.LEFT;
            label.verticalAlign = VerticalAlign.TOP;
            label.fontSize = richText.fontSize || 40;
            label.overflow = 0;
            label.enableWrapText = true;
            label.lineHeight = 40;
            label._enableBold(false);
            label._enableItalics(false);
            label._enableUnderline(false);

            this._styleIndex = styleIndex;
            this._lineCount = richText._lineCount;

            this._applyTextAttribute(richText);
        }

        segment._applyTextAttribute = function (richText) {
            let label = this.node.getComponent(cc.Label);
            let index = this._styleIndex;
            if (!label) {
                return;
            }

            let textInfo = richText._textArray[index];
            let textStyle;
            if (textInfo) {
                textStyle = textInfo.style;
            }

            label.lineHeight = richText.lineHeight;
            label.horizontalAlign = HorizontalAlign.LEFT;
            label.verticalAlign = VerticalAlign.CENTER;
            label._enableBold(textStyle && textStyle.bold);
            label._enableItalics(textStyle && textStyle.italic);
            label._enableUnderline(textStyle && textStyle.underline);

            if (textStyle && textStyle.size) {
                label.fontSize = textStyle.size;
            }

            if (textStyle && textStyle.color) {
                this.node.color = richText._convertLiteralColorValue(textStyle.color);
            }

            //TODO: temporary implementation, the italic effect should be implemented in the internal of label-assembler.
            if (textStyle && textStyle.italic) {
                this.node.skewX = 12;
            }

            if (textStyle && textStyle.outline) {
                let labelOutline = this.node.getComponent(cc.LabelOutline);
                if (!labelOutline) {
                    labelOutline = this.node.addComponent(cc.LabelOutline);
                }
                labelOutline.color = richText._convertLiteralColorValue(textStyle.outline.color);
                labelOutline.width = textStyle.outline.width;
            }

            label._updateRenderData(true);

            if (textStyle && textStyle.event) {
                if (textStyle.event.click) {
                    segment._clickHandler = textStyle.event.click;
                }
                if (textStyle.event.param) {
                    segment._clickParam = textStyle.event.param;
                }
            }
        }
    }
    else if (name === RichTextChildImageName) {
        segment.addSpriteComponent = function (spriteFrame, style, richText) {
            this.node.name = RichTextChildImageName;
            let sprite = this.node.getComponent(cc.Sprite);
            if (!sprite) {
                sprite = this.node.addComponent(cc.Sprite);
            }

            sprite.type = cc.Sprite.Type.SLICED;
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;

            // calculation contentSize
            let spriteRect = spriteFrame.getRect();
            let scaleFactor = 1;
            let spriteWidth = spriteRect.width;
            let spriteHeight = spriteRect.height;
            let expectWidth = style.imageWidth;
            let expectHeight = style.imageHeight;

            //follow the original rule, expectHeight must less then lineHeight
            if (expectHeight > 0 && expectHeight < richText.lineHeight) {
                scaleFactor = expectHeight / spriteHeight;
                spriteWidth = spriteWidth * scaleFactor;
                spriteHeight = spriteHeight * scaleFactor;
            }
            else {
                scaleFactor = richText.lineHeight / spriteHeight;
                spriteWidth = spriteWidth * scaleFactor;
                spriteHeight = spriteHeight * scaleFactor;
            }

            if (expectWidth > 0) spriteWidth = expectWidth;

            if (richText.maxWidth > 0) {
                if (richText._lineOffsetX + spriteWidth > richText.maxWidth) {
                    richText._updateLineInfo();
                }
                richText._lineOffsetX += spriteWidth;

            }
            else {
                richText._lineOffsetX += spriteWidth;
                if (richText._lineOffsetX > richText._labelWidth) {
                    richText._labelWidth = richText._lineOffsetX;
                }
            }
            sprite.spriteFrame = spriteFrame;
            this.node.setContentSize(spriteWidth, spriteHeight);

            if (style.event) {
                if (style.event.click) {
                    this._clickHandler = style.event.click;
                }
                if (style.event.param) {
                    this._clickParam = style.event.param;
                }
            }

            this._lineCount = richText._lineCount;
        }
    }

    return segment;
};

/**
 * !#en The RichText Component.
 * !#zh 富文本组件
 * @class RichText
 * @extends Component
 */
let RichText = cc.Class({
    name: 'cc.RichText',
    extends: cc.Component,

    ctor: function () {
        this._textArray = null;
        this._segments = [];
        this._labelSegmentsCache = [];
        this._linesWidth = [];

        if (CC_EDITOR) {
            this._updateRichTextStatus = debounce(this._updateRichText, 200);
        }
        else {
            this._updateRichTextStatus = this._updateRichText;
        }
    },

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/RichText',
        help: 'i18n:COMPONENT.help_url.richtext',
        executeInEditMode: true
    },

    properties: {
        /**
         * !#en Content string of RichText.
         * !#zh 富文本显示的文本内容。
         * @property {String} string
         */
        string: {
            default: '<color=#00ff00>Rich</c><color=#0fffff>Text</color>',
            multiline: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.richtext.string',
            notify: function () {
                this._updateRichTextStatus();
            }
        },

        /**
         * !#en Horizontal Alignment of each line in RichText.
         * !#zh 文本内容的水平对齐方式。
         * @property {macro.TextAlignment} horizontalAlign
         */
        horizontalAlign: {
            default: HorizontalAlign.LEFT,
            type: HorizontalAlign,
            tooltip: CC_DEV && 'i18n:COMPONENT.richtext.horizontal_align',
            animatable: false,
            notify: function (oldValue) {
                if (this.horizontalAlign === oldValue) return;

                this._layoutDirty = true;
                this._updateRichTextStatus();
            }
        },

        /**
         * !#en Font size of RichText.
         * !#zh 富文本字体大小。
         * @property {Number} fontSize
         */
        fontSize: {
            default: 40,
            tooltip: CC_DEV && 'i18n:COMPONENT.richtext.font_size',
            notify: function (oldValue) {
                if (this.fontSize === oldValue) return;

                this._layoutDirty = true;
                this._updateRichTextStatus();
            }
        },

        /**
         * !#en Custom TTF font of RichText
         * !#zh  富文本定制字体
         * @property {cc.TTFFont} font
         */
        font: {
            default: null,
            type: cc.TTFFont,
            tooltip: CC_DEV && 'i18n:COMPONENT.richtext.font',
            notify: function (oldValue) {
                if (this.font === oldValue) return;

                this._layoutDirty = true;
                if (this.font) {
                    this._onTTFLoaded();
                }
                this._updateRichTextStatus();
            }
        },

        /**
         * !#en The maximize width of the RichText
         * !#zh 富文本的最大宽度
         * @property {Number} maxWidth
         */
        maxWidth: {
            default: 0,
            tooltip: CC_DEV && 'i18n:COMPONENT.richtext.max_width',
            notify: function (oldValue) {
                if (this.maxWidth === oldValue) return;

                this._layoutDirty = true;
                this._updateRichTextStatus();
            }
        },

        /**
         * !#en Line Height of RichText.
         * !#zh 富文本行高。
         * @property {Number} lineHeight
         */
        lineHeight: {
            default: 40,
            tooltip: CC_DEV && 'i18n:COMPONENT.richtext.line_height',
            notify: function (oldValue) {
                if (this.lineHeight === oldValue) return;

                this._layoutDirty = true;
                this._updateRichTextStatus();
            }
        },

        /**
         * !#en The image atlas for the img tag. For each src value in the img tag, there should be a valid spriteFrame in the image atlas.
         * !#zh 对于 img 标签里面的 src 属性名称，都需要在 imageAtlas 里面找到一个有效的 spriteFrame，否则 img tag 会判定为无效。
         * @property {SpriteAtlas} imageAtlas
         */
        imageAtlas: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: CC_DEV && 'i18n:COMPONENT.richtext.image_atlas',
            notify: function (oldValue) {
                if (this.imageAtlas === oldValue) return;

                this._layoutDirty = true;
                this._updateRichTextStatus();
            }
        },

        /**
         * !#en
         * Once checked, the RichText will block all input events (mouse and touch) within
         * the bounding box of the node, preventing the input from penetrating into the underlying node.
         * !#zh
         * 选中此选项后，RichText 将阻止节点边界框中的所有输入事件（鼠标和触摸），从而防止输入事件穿透到底层节点。
         * @property {Boolean} handleTouchEvent
         * @default true
         */
        handleTouchEvent: {
            default: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.richtext.handleTouchEvent',
            notify: function (oldValue) {
                if (this.handleTouchEvent === oldValue) return;
                if (this.enabledInHierarchy) {
                    this.handleTouchEvent ? this._addEventListeners() : this._removeEventListeners();
                }
            }
        }
    },

    statics: {
        HorizontalAlign: HorizontalAlign,
        VerticalAlign: VerticalAlign
    },

    onEnable () {
        if (this.handleTouchEvent) {
            this._addEventListeners();
        }
        this._updateRichText();
        this._activateChildren(true);
    },

    onDisable () {
        if (this.handleTouchEvent) {
            this._removeEventListeners();
        }
        this._activateChildren(false);
    },

    start () {
        this._onTTFLoaded();
    },

    _addEventListeners () {
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    },

    _removeEventListeners () {
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    },

    _updateLabelSegmentTextAttributes () {
        this._segments.forEach(function (segment) {
            segment._applyTextAttribute(this);
        }.bind(this));
    },

    _onTTFLoaded () {
        if (this.font instanceof cc.TTFFont) {
            if (this.font._nativeAsset) {
                this._layoutDirty = true;
                this._updateRichText();
            }
            else {
                let self = this;
                cc.loader.load(this.font.nativeUrl, function (err, fontFamily) {
                    self._layoutDirty = true;
                    self._updateRichText();
                });
            }
        }
        else {
            this._layoutDirty = true;
            this._updateRichText();
        }
    },

    _measureText (styleIndex, string) {
        let self = this;
        let func = function (string) {
            let segment;
            if (self._labelSegmentsCache.length === 0) {
                segment = _segmentPool.get(self, RichTextChildName);
                self._labelSegmentsCache.push(segment);
            }
            else {
                segment = self._labelSegmentsCache[0];
            }
            segment.addLabelComponent(string, styleIndex, self);
            let labelSize = segment.node.getContentSize();
            return labelSize.width;
        };
        if (string) {
            return func(string);
        }
        else {
            return func;
        }
    },

    _onTouchEnded (event) {
        let components = this.node.getComponents(cc.Component);

        for (let i = 0; i < this._segments.length; ++i) {
            let segment = this._segments[i];
            let clickHandler = segment._clickHandler;
            if (clickHandler && this._containsTouchLocation(segment.node, event.touch.getLocation())) {
                components.forEach(function (component) {
                    if (component.enabledInHierarchy && component[clickHandler]) {
                        component[clickHandler](event, segment._clickParam);
                    }
                });
                event.stopPropagation();
            }
        }
    },

    _containsTouchLocation (node, point) {
        let myRect = node.getBoundingBoxToWorld();
        return myRect.contains(point);
    },

    _reset () {
        this._recyclingSegment();
        this._segments.length = 0;
        this._labelSegmentsCache.length = 0;
        this._linesWidth.length = 0;
        this._lineOffsetX = 0;
        this._lineCount = 1;
        this._labelWidth = 0;
        this._labelHeight = 0;
        this._layoutDirty = true;
    },

    onRestore: CC_EDITOR && function () {
        // TODO: refine undo/redo system
        // Because undo/redo will not call onEnable/onDisable,
        // we need call onEnable/onDisable manually to active/disactive children nodes.
        if (this.enabledInHierarchy) {
            this.onEnable();
        }
        else {
            this.onDisable();
        }
    },

    _activateChildren (active) {
        for (let i = this.node.children.length - 1; i >= 0; i--) {
            let child = this.node.children[i];
            if (child.name === RichTextChildName || child.name === RichTextChildImageName) {
                child.active = active;
            }
        }
    },

    _addLabelSegment (stringToken, styleIndex) {
        let segment;
        if (this._labelSegmentsCache.length === 0) {
            segment = this._addSegment(RichTextChildName);
        }
        else {
            segment = this._labelSegmentsCache.pop();
            this._segments.push(segment);
        }
        segment.addLabelComponent(stringToken, styleIndex, this);
        return segment;
    },

    _updateRichTextWithMaxWidth (labelString, labelWidth, styleIndex) {
        let fragmentWidth = labelWidth;
        let segment;

        if (this._lineOffsetX > 0 && fragmentWidth + this._lineOffsetX > this.maxWidth) {
            //concat previous line
            let checkStartIndex = 0;
            while (this._lineOffsetX <= this.maxWidth) {
                let checkEndIndex = this._getFirstWordLen(labelString, checkStartIndex, labelString.length);
                let checkString = labelString.substr(checkStartIndex, checkEndIndex);
                let checkStringWidth = this._measureText(styleIndex, checkString);

                if (this._lineOffsetX + checkStringWidth <= this.maxWidth) {
                    this._lineOffsetX += checkStringWidth;
                    checkStartIndex += checkEndIndex;
                }
                else {

                    if (checkStartIndex > 0) {
                        let remainingString = labelString.substr(0, checkStartIndex);
                        this._addLabelSegment(remainingString, styleIndex);
                        labelString = labelString.substr(checkStartIndex, labelString.length);
                        fragmentWidth = this._measureText(styleIndex, labelString);
                    }
                    this._updateLineInfo();
                    break;
                }
            }
        }
        if (fragmentWidth > this.maxWidth) {
            let fragments = textUtils.fragmentText(labelString, fragmentWidth, this.maxWidth, this._measureText(styleIndex));
            for (let k = 0; k < fragments.length; ++k) {
                let splitString = fragments[k];
                segment = this._addLabelSegment(splitString, styleIndex);
                let labelSize = segment.node.getContentSize();
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
    },

    _isLastComponentCR (stringToken) {
        return stringToken.length - 1 === stringToken.lastIndexOf("\n");
    },

    _updateLineInfo () {
        this._linesWidth.push(this._lineOffsetX);
        this._lineOffsetX = 0;
        this._lineCount++;
    },

    _needsUpdateTextLayout (newTextArray) {
        if (this._layoutDirty || !this._textArray || !newTextArray) {
            return true;
        }

        if (this._textArray.length !== newTextArray.length) {
            return true;
        }

        for (let i = 0; i < this._textArray.length; ++i) {
            let oldItem = this._textArray[i];
            let newItem = newTextArray[i];
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
    },

    _addSegment (name) {
        let segment = _segmentPool.get(this, name);
        this._segments.push(segment);
        return segment;
    },

    _addRichTextImageElement (richTextElement) {
        let spriteFrameName = richTextElement.style.src;
        let spriteFrame = this.imageAtlas.getSpriteFrame(spriteFrameName);
        if (spriteFrame) {
            let segment = this._addSegment(RichTextChildImageName);
            segment.addSpriteComponent(spriteFrame, richTextElement.style, this);
        }
        else {
            cc.warnID(4400);
        }
    },

    _updateRichText () {
        if (!this.enabled) return;

        let newTextArray = _htmlTextParser.parse(this.string);
        if (!this._needsUpdateTextLayout(newTextArray)) {
            this._textArray = newTextArray;
            this._updateLabelSegmentTextAttributes();
            return;
        }

        this._textArray = newTextArray;
        this._reset();

        let lastEmptyLine = false;
        let segment;
        let labelSize;

        for (let i = 0; i < this._textArray.length; ++i) {
            let richTextElement = this._textArray[i];
            let text = richTextElement.text;
            //handle <br/> <img /> tag
            if (text === "") {
                if (richTextElement.style && richTextElement.style.newline) {
                    this._updateLineInfo();
                    continue;
                }
                if (richTextElement.style && richTextElement.style.isImage && this.imageAtlas) {
                    this._addRichTextImageElement(richTextElement);
                    continue;
                }
            }
            let multilineTexts = text.split("\n");

            for (let j = 0; j < multilineTexts.length; ++j) {
                let labelString = multilineTexts[j];
                if (labelString === "") {
                    //for continues \n
                    if (this._isLastComponentCR(text) && j === multilineTexts.length - 1) {
                        continue;
                    }
                    this._updateLineInfo();
                    lastEmptyLine = true;
                    continue;
                }
                lastEmptyLine = false;

                if (this.maxWidth > 0) {
                    let labelWidth = this._measureText(i, labelString);
                    this._updateRichTextWithMaxWidth(labelString, labelWidth, i);

                    if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
                        this._updateLineInfo();
                    }
                }
                else {
                    segment = this._addLabelSegment(labelString, i);
                    labelSize = segment.node.getContentSize();

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
    },

    _getFirstWordLen (text, startIndex, textLen) {
        let character = text.charAt(startIndex);
        if (textUtils.isUnicodeCJK(character)
            || textUtils.isUnicodeSpace(character)) {
            return 1;
        }

        let len = 1;
        for (let index = startIndex + 1; index < textLen; ++index) {
            character = text.charAt(index);
            if (textUtils.isUnicodeSpace(character)
                || textUtils.isUnicodeCJK(character)) {
                break;
            }
            len++;
        }

        return len;
    },

    _updateRichTextPosition () {
        let nextTokenX = 0;
        let nextLineIndex = 1;
        let totalLineCount = this._lineCount;
        for (let i = 0; i < this._segments.length; ++i) {
            let segment = this._segments[i];
            let lineCount = segment._lineCount;
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

            segment.node.x = nextTokenX + lineOffsetX;
            segment.node.y = this.lineHeight * (totalLineCount - lineCount) - this._labelHeight / 2;

            if (lineCount === nextLineIndex) {
                let labelSize = segment.node.getContentSize();
                nextTokenX += labelSize.width;
            }
        }
    },

    _convertLiteralColorValue (color) {
        let colorValue = color.toUpperCase();
        if (cc.Color[colorValue]) {
            return cc.Color[colorValue];
        }
        else {
            let out = cc.color();
            return out.fromHEX(color);
        }
    },

    _recyclingSegment () {
        for (let i = 0; i < this._segments.length; ++i) {
            let segment = this._segments[i];
            segment.node.removeFromParent();
            _segmentPool.put(segment.node);
        }

        let children = this.node.children;
        for (let i = children.length - 1; i >= 0; i--) {
            let child = children[i];
            if (child.name === RichTextChildName || child.name === RichTextChildImageName) {
                if (child.parent === this.node) {
                    child.removeFromParent();
                }
                else {
                    // In case child.parent !== this.node, child cannot be removed from children
                    children.splice(i, 1);
                }
                _segmentPool.put(child);
            }
        }
    },

    onDestroy () {
        this._recyclingSegment();
    },
});

cc.RichText = module.exports = RichText;
