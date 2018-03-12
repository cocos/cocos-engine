/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var utils = require('../utils/text-utils');
var HtmlTextParser = utils.HtmlTextParser;
var TextUtils = utils.TextUtils;
var CustomFontLoader = utils.CustomFontLoader;

var js = require("../platform/js");

var HorizontalAlign = cc.TextAlignment;
var VerticalAlign = cc.VerticalTextAlignment;
var RichTextChildName = "RICHTEXT_CHILD"
var _htmlTextParser = new HtmlTextParser();

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, arguments);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, arguments);
    };
}

/**
 * RichText pool
 */
var pool = new js.Pool(function (node) {
    if (CC_EDITOR) {
        return false;
    }
    if (CC_DEV) {
        cc.assert(!node._parent, 'Recycling node\'s parent should be null!');
    }
    if (node.getComponent(cc.LabelOutline)) {
        return false;
    }
    return true;
}, 20);

pool.get = function (string, fontAsset, fontSize) {
    var labelNode = this._get();
    if (!labelNode) {
        labelNode = new cc.PrivateNode(RichTextChildName);
    }
    var labelComponent = labelNode.getComponent(cc.Label);
    if (!labelComponent) {
        labelComponent = labelNode.addComponent(cc.Label);
    }

    labelNode.setPosition(0, 0);
    labelNode.setAnchorPoint(0.5, 0.5);
    labelNode.setContentSize(128, 128);
    labelNode.setSkewX(0);

    if (typeof string !== 'string') {
        string = '' + string;
    }
    var isAsset = fontAsset instanceof cc.Font;
    if (isAsset) {
        labelComponent.font = fontAsset;
    } else {
        labelComponent.fontFamily = "Arial";
    }
    labelComponent.string = string;
    labelComponent.horizontalAlign = HorizontalAlign.LEFT;
    labelComponent.verticalAlign = VerticalAlign.TOP;
    labelComponent.fontSize = 40;
    labelComponent.overflow = 0;
    labelComponent.enableWrapText = true;
    labelComponent.lineHeight = 40;
    labelComponent._enableBold(false);
    labelComponent._enableItalics(false);
    labelComponent._enableUnderline(false);

    return labelNode;
};

/**
 * !#en The RichText Component.
 * !#zh 富文本组件
 * @class RichText
 * @extends Component
 */
var RichText = cc.Class({
    name: 'cc.RichText',
    extends: cc.Component,

    ctor: function () {
        this._textArray = null;
        this._labelSegments = [];
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
         * @property {TextAlignment} horizontalAlign
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
                if (!CC_JSB && this.font) {
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

    onEnable: function () {
        if (this.handleTouchEvent) {
            this._addEventListeners();
        }
        this._updateRichText();
    },

    onDisable: function () {
        if (this.handleTouchEvent) {
            this._removeEventListeners();
        }
        this._resetState();
    },

    start: function () {
        if (!CC_JSB) {
            this._onTTFLoaded();
        }
    },

    _addEventListeners: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    },

    _removeEventListeners: function () {
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    },

    _updateLabelSegmentTextAttributes: function () {
        this._labelSegments.forEach(function (item) {
            this._applyTextAttribute(item);
        }.bind(this));
    },

    _createFontLabel: function (string) {
        return pool.get(string, this.font, this.fontSize);
    },

    _getFontRawUrl: function () {
        var isAsset = this.font instanceof cc.TTFFont;
        var fntRawUrl = isAsset ? this.font.nativeUrl : '';
        return fntRawUrl;
    },

    _onTTFLoaded: function () {
        var rawUrl = this._getFontRawUrl();
        if (!rawUrl) return;

        var self = this;

        var callback = function () {
            self._layoutDirty = true;
            self._updateRichText();
        };

        CustomFontLoader.loadTTF(rawUrl, callback);
    },

    _measureText: function (styleIndex, string) {
        var self = this;
        var func = function (string) {
            var label;
            if (self._labelSegmentsCache.length === 0) {
                label = self._createFontLabel(string);
                self._labelSegmentsCache.push(label);
            }
            else {
                label = self._labelSegmentsCache[0];
                label.getComponent(cc.Label).string = string;
            }
            label._styleIndex = styleIndex;
            self._applyTextAttribute(label);
            var labelSize = label.getContentSize();
            return labelSize.width;
        };
        if (string) {
            return func(string);
        }
        else {
            return func;
        }
    },

    _onTouchEnded: function (event) {
        var components = this.node.getComponents(cc.Component);

        for (var i = 0; i < this._labelSegments.length; ++i) {
            var labelSegment = this._labelSegments[i];
            var clickHandler = labelSegment._clickHandler;
            if (clickHandler && this._containsTouchLocation(labelSegment, event.touch.getLocation())) {
                components.forEach(function (component) {
                    if (component.enabledInHierarchy && component[clickHandler]) {
                        component[clickHandler](event);
                    }
                });
                event.stopPropagation();
            }
        }
    },

    _containsTouchLocation: function (label, point) {
        var myRect = label.getBoundingBoxToWorld();
        return cc.rectContainsPoint(myRect, point);
    },

    _resetState: function () {
        for (let i = this.node.children.length - 1; i >= 0 ; i--) {
            let child = this.node.children[i];
            if (child.name === RichTextChildName) {
                child.parent = null;
                pool.put(child);
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
    },

    _addLabelSegment: function (stringToken, styleIndex) {
        var labelSegment;
        if (this._labelSegmentsCache.length === 0) {
            labelSegment = this._createFontLabel(stringToken);
        }
        else {
            labelSegment = this._labelSegmentsCache.pop();
            labelSegment.getComponent(cc.Label).string = stringToken;
        }
        labelSegment._styleIndex = styleIndex;
        labelSegment._lineCount = this._lineCount;

        this._applyTextAttribute(labelSegment);

        labelSegment.setAnchorPoint(0, 0);
        this.node.addChild(labelSegment);
        this._labelSegments.push(labelSegment);

        //when lineHeight is less than the content size of labelSize
        //in Web platform, the extra pixels will be trimed.
        //so we need to set the overflow to clamp in JSB
        //FIXME: label in jsb should be refactored to keep the behavior the same as web platform.
        if (CC_JSB) {
            let labelComponent = labelSegment.getComponent(cc.Label);
            labelComponent.overflow = 1;
            var size = labelSegment.getContentSize();
            labelComponent.enableWrapText = false;
            labelSegment.setDimensions(size.width, this.lineHeight);
        }

        return labelSegment;
    },

    _updateRichTextWithMaxWidth: function (labelString, labelWidth, styleIndex) {
        var fragmentWidth = labelWidth;
        var labelSegment;

        if (this._lineOffsetX > 0 && fragmentWidth + this._lineOffsetX > this.maxWidth) {
            //concat previous line
            var checkStartIndex = 0;
            while (this._lineOffsetX <= this.maxWidth) {
                var checkEndIndex = this._getFirstWordLen(labelString,
                    checkStartIndex,
                    labelString.length);
                var checkString = labelString.substr(checkStartIndex, checkEndIndex);
                var checkStringWidth = this._measureText(styleIndex, checkString);

                if (this._lineOffsetX + checkStringWidth <= this.maxWidth) {
                    this._lineOffsetX += checkStringWidth;
                    checkStartIndex += checkEndIndex;
                }
                else {

                    if (checkStartIndex > 0) {
                        var remainingString = labelString.substr(0, checkStartIndex);
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
            var fragments = TextUtils.fragmentText(labelString,
                fragmentWidth,
                this.maxWidth,
                this._measureText(styleIndex));
            for (var k = 0; k < fragments.length; ++k) {
                var splitString = fragments[k];
                labelSegment = this._addLabelSegment(splitString, styleIndex);
                var labelSize = labelSegment.getContentSize();
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

    _isLastComponentCR: function (stringToken) {
        return stringToken.length - 1 === stringToken.lastIndexOf("\n");
    },

    _updateLineInfo: function () {
        this._linesWidth.push(this._lineOffsetX);
        this._lineOffsetX = 0;
        this._lineCount++;
    },

    _needsUpdateTextLayout: function (newTextArray) {
        if (this._layoutDirty || !this._textArray || !newTextArray) {
            return true;
        }

        if (this._textArray.length !== newTextArray.length) {
            return true;
        }

        for (var i = 0; i < this._textArray.length; ++i) {
            var oldItem = this._textArray[i];
            var newItem = newTextArray[i];
            if (oldItem.text != newItem.text) {
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

    _addRichTextImageElement: function (richTextElement) {
        var spriteFrameName = richTextElement.style.src;
        var spriteFrame = this.imageAtlas.getSpriteFrame(spriteFrameName);
        if (spriteFrame) {
            var spriteNode = new cc.PrivateNode(RichTextChildName);
            var spriteComponent = spriteNode.addComponent(cc.Sprite);
            spriteNode.setAnchorPoint(0, 0);
            spriteComponent.type = cc.Sprite.Type.SLICED;
            spriteComponent.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            this.node.addChild(spriteNode);
            this._labelSegments.push(spriteNode);

            var spriteRect = spriteFrame.getRect();
            var scaleFactor = 1;
            var spriteWidth = spriteRect.width;
            var spriteHeight = spriteRect.height;
            var expectWidth = richTextElement.style.imageWidth;
            var expectHeight = richTextElement.style.imageHeight;

            //follow the original rule, expectHeight must less then lineHeight
            if (expectHeight > 0 && expectHeight < this.lineHeight) {
                scaleFactor = expectHeight / spriteHeight;
                spriteWidth = spriteWidth * scaleFactor;
                spriteHeight = spriteHeight * scaleFactor;
            }
            else {
                scaleFactor = this.lineHeight / spriteHeight;
                spriteWidth = spriteWidth * scaleFactor;
                spriteHeight = spriteHeight * scaleFactor;
            }

            if (expectWidth > 0) spriteWidth = expectWidth;

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
            spriteComponent.spriteFrame = spriteFrame;
            spriteNode.setContentSize(spriteWidth, spriteHeight);
            spriteNode._lineCount = this._lineCount;

            if (richTextElement.style.event) {
                if (richTextElement.style.event.click) {
                    spriteNode._clickHandler = richTextElement.style.event.click;
                }
            }
        }
        else {
            cc.warnID(4400);
        }
    },

    _updateRichText: function () {
        if (!this.enabled) return;

        var newTextArray = _htmlTextParser.parse(this.string);
        if (!this._needsUpdateTextLayout(newTextArray)) {
            this._textArray = newTextArray;
            this._updateLabelSegmentTextAttributes();
            return;
        }

        this._textArray = newTextArray;
        this._resetState();

        var lastEmptyLine = false;
        var label;
        var labelSize;

        for (var i = 0; i < this._textArray.length; ++i) {
            var richTextElement = this._textArray[i];
            var text = richTextElement.text;
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
            var multilineTexts = text.split("\n");

            for (var j = 0; j < multilineTexts.length; ++j) {
                var labelString = multilineTexts[j];
                if (labelString === "") {
                    //for continues \n
                    if (this._isLastComponentCR(text)
                        && j == multilineTexts.length - 1) {
                        continue;
                    }
                    this._updateLineInfo();
                    lastEmptyLine = true;
                    continue;
                }
                lastEmptyLine = false;

                if (this.maxWidth > 0) {
                    var labelWidth = this._measureText(i, labelString);
                    this._updateRichTextWithMaxWidth(labelString, labelWidth, i);

                    if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
                        this._updateLineInfo();
                    }
                }
                else {
                    label = this._addLabelSegment(labelString, i);
                    labelSize = label.getContentSize();

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

    _getFirstWordLen: function (text, startIndex, textLen) {
        var character = text.charAt(startIndex);
        if (TextUtils.isUnicodeCJK(character)
            || TextUtils.isUnicodeSpace(character)) {
            return 1;
        }

        var len = 1;
        for (var index = startIndex + 1; index < textLen; ++index) {
            character = text.charAt(index);
            if (TextUtils.isUnicodeSpace(character)
                || TextUtils.isUnicodeCJK(character)) {
                break;
            }
            len++;
        }

        return len;
    },

    _updateRichTextPosition: function () {
        var nextTokenX = 0;
        var nextLineIndex = 1;
        var totalLineCount = this._lineCount;
        for (var i = 0; i < this._labelSegments.length; ++i) {
            var label = this._labelSegments[i];
            var lineCount = label._lineCount;
            if (lineCount > nextLineIndex) {
                nextTokenX = 0;
                nextLineIndex = lineCount;
            }
            var lineOffsetX = 0;
            // var nodeAnchorXOffset = (0.5 - this.node.anchorX) * this._labelWidth; 
            switch (this.horizontalAlign) {
                case cc.TextAlignment.LEFT:
                    lineOffsetX = - this._labelWidth / 2;
                    break;
                case cc.TextAlignment.CENTER:
                    lineOffsetX = - this._linesWidth[lineCount - 1] / 2;
                    break;
                case cc.TextAlignment.RIGHT:
                    lineOffsetX = this._labelWidth / 2 - this._linesWidth[lineCount - 1];
                    break;
                default:
                    break;
            }
            label.setPositionX(nextTokenX + lineOffsetX);

            var labelSize = label.getContentSize();

            var positionY = this.lineHeight * (totalLineCount - lineCount) - this._labelHeight / 2;

            label.setPositionY(positionY);

            if (lineCount === nextLineIndex) {
                nextTokenX += labelSize.width;
            }
        }
    },

    _convertLiteralColorValue: function (color) {
        var colorValue = color.toUpperCase();
        if (cc.Color[colorValue]) {
            return cc.Color[colorValue];
        }
        else {
            return cc.hexToColor(color);
        }
    },

    _applyTextAttribute: function (labelNode) {
        var labelComponent = labelNode.getComponent(cc.Label);
        if (!labelComponent) {
            return;
        }

        var index = labelNode._styleIndex;
        labelComponent.lineHeight = this.lineHeight;
        labelComponent.horizontalAlign = HorizontalAlign.LEFT;
        labelComponent.verticalAlign = VerticalAlign.CENTER;

        var textStyle = null;
        if (this._textArray[index]) {
            textStyle = this._textArray[index].style;
        }

        if (textStyle && textStyle.color) {
            labelNode.color = this._convertLiteralColorValue(textStyle.color);
        }else {
            labelNode.color = this._convertLiteralColorValue("white");
        }

        labelComponent._enableBold(textStyle && textStyle.bold);

        labelComponent._enableItalics(textStyle && textStyle.italic);
        //TODO: temporary implementation, the italic effect should be implemented in the internal of label-assembler.
        if (textStyle && textStyle.italic) {
            labelNode.setSkewX(12);
        }

        labelComponent._enableUnderline(textStyle && textStyle.underline);

        if (textStyle && textStyle.outline) {
            var labelOutlineComponent = labelNode.getComponent(cc.LabelOutline);
            if (!labelOutlineComponent) {
                labelOutlineComponent = labelNode.addComponent(cc.LabelOutline);
            }
            labelOutlineComponent.color = this._convertLiteralColorValue(textStyle.outline.color);
            labelOutlineComponent.width = textStyle.outline.width;
        }

        if (textStyle && textStyle.size) {
            labelComponent.fontSize = textStyle.size;
        }
        else {
            labelComponent.fontSize = this.fontSize;
        }

        labelComponent._updateRenderData(true);

        if (textStyle && textStyle.event) {
            if (textStyle.event.click) {
                labelNode._clickHandler = textStyle.event.click;
            }
        }
    },

    onDestroy: function () {
        for (var i = 0; i < this._labelSegments.length; ++i) {
            this._labelSegments[i].removeFromParent();
            pool.put(this._labelSegments[i]);
        }
    },
});

cc.RichText = module.exports = RichText;
