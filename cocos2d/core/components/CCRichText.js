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
require('../label/CCHtmlTextParser.js');

var HorizontalAlign = cc.TextAlignment;
var VerticalAlign = cc.VerticalTextAlignment;

var label_wrapinspection = true;
var label_wordRex = /([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôû]+|\S)/;
var label_symbolRex = /^[!,.:;}\]%\?>、‘“》？。，！]/;
var label_lastWordRex = /([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôû]+|\S)$/;
var label_lastEnglish = /[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôû]+$/;
var label_firsrEnglish = /^[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôû]/;

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * !#en The RichText Component.
 * !#zh 富文本组件
 * @class RichText
 * @extends Component
 */
var RichText = cc.Class({
    name: 'cc.RichText',
    extends: cc._RendererUnderSG,

    ctor: function() {
        this._textArray = null;
        this._labelSegmentsCache = [];

        this._resetState();

        if(CC_EDITOR) {
            this._updateRichTextStatus = debounce(this._updateRichText, 200);
        } else {
            this._updateRichTextStatus = this._updateRichText;
        }
    },

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/RichText',
        help: 'i18n:COMPONENT.help_url.richtext',
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
            tooltip: 'i18n:COMPONENT.richtext.string',
            notify: function () {
                this._updateRichTextStatus();
            }
        },

        /**
         * !#en Horizontal Alignment of each line in RichText.
         * !#zh 文本内容的水平对齐方式。
         * @property {RichText.HorizontalAlign} horizontalAlign
         */
        horizontalAlign: {
            default: HorizontalAlign.LEFT,
            type: HorizontalAlign,
            tooltip: 'i18n:COMPONENT.richtext.horizontal_align',
            animatable: false,
            notify: function (oldValue) {
                if(this.horizontalAlign === oldValue) return;

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
            tooltip: 'i18n:COMPONENT.richtext.font_size',
            notify: function (oldValue) {
                if(this.fontSize === oldValue) return;

                this._layoutDirty = true;
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
            tooltip: 'i18n:COMPONENT.richtext.max_width',
            notify: function (oldValue) {
                if(this.maxWidth === oldValue) return;

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
            tooltip: 'i18n:COMPONENT.richtext.line_height',
            notify: function (oldValue) {
                if(this.lineHeight === oldValue) return;

                this._layoutDirty = true;
                this._updateRichTextStatus();
            }
        }
    },

    statics: {
        HorizontalAlign: HorizontalAlign,
        VerticalAlign: VerticalAlign
    },

    __preload: function () {
        this._super();

        if (!CC_EDITOR) {
            this._registerEvents();
        }
    },

    _createSgNode: function () {
        var sgNode = new _ccsg.Node();

        sgNode.setCascadeOpacityEnabled(true);

        var self = this;
        sgNode.setColor = function () {
            self._updateLabelSegmentTextAttributes();
        };

        sgNode._setContentSize = sgNode.setContentSize;
        sgNode.setContentSize = function () {};
        return sgNode;
    },

    _updateLabelSegmentTextAttributes: function() {
        this._labelSegments.forEach(function(item) {
            this._applyTextAttribute(item);
        }.bind(this));
    },

    _initSgNode: function () {
        this._updateRichText();
    },

    _measureText: function (string, styleIndex) {
        var label;
        if(this._labelSegmentsCache.length === 0) {
            label = new _ccsg.Label(string);
            this._labelSegmentsCache.push(label);
        } else {
            label = this._labelSegmentsCache[0];
            label.setString(string);
        }
        label._styleIndex = styleIndex;
        this._applyTextAttribute(label);
        var labelSize = label.getContentSize();
        return labelSize.width;
    },


    _onTouchEnded: function (event) {
        if(!this.enabledInHierarchy) return;

        var components = this.node.getComponents(cc.Component);

        for (var i = 0; i < this._labelSegments.length; ++i ) {
            var labelSegment = this._labelSegments[i];
            var clickHandler = labelSegment._clickHandler;
            if (clickHandler && this._containsTouchLocation(labelSegment, event.touch.getLocation())) {
                components.forEach(function(component) {
                    if(component.enabledInHierarchy && component[clickHandler]) {
                        component[clickHandler](event);
                    }
                });
            }
        }
    },

    _containsTouchLocation:function (label, point) {
        var myRect = label.getBoundingBoxToWorld();

        return cc.rectContainsPoint(myRect, point);
    },

    _registerEvents: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    },

    _fragmentText: function (stringToken, allWidth, styleIndex) {
        //check the first character
        var wrappedWords = [];
        //fast return if strArr is empty
        if(stringToken.length === 0 || this.maxWidth < 0) {
            wrappedWords.push('');
            return wrappedWords;
        }

        var text = stringToken;
        while (allWidth > this.maxWidth && text.length > 1) {

            var fuzzyLen = text.length * ( this.maxWidth / allWidth ) | 0;
            var tmpText = text.substr(fuzzyLen);
            var width = allWidth - this._measureText(tmpText, styleIndex);
            var sLine = tmpText;
            var pushNum = 0;

            var checkWhile = 0;
            var checkCount = 10;

            //Exceeded the size
            while (width > this.maxWidth && checkWhile++ < checkCount) {
                fuzzyLen *= this.maxWidth / width;
                fuzzyLen = fuzzyLen | 0;
                tmpText = text.substr(fuzzyLen);
                width = allWidth - this._measureText(tmpText, styleIndex);
            }

            checkWhile = 0;

            //Find the truncation point
            while (width < this.maxWidth && checkWhile++ < checkCount) {
                if (tmpText) {
                    var exec = label_wordRex.exec(tmpText);
                    pushNum = exec ? exec[0].length : 1;
                    sLine = tmpText;
                }

                fuzzyLen = fuzzyLen + pushNum;
                tmpText = text.substr(fuzzyLen);
                width = allWidth - this._measureText(tmpText, styleIndex);
            }

            fuzzyLen -= pushNum;
            if (fuzzyLen === 0) {
                fuzzyLen = 1;
                sLine = sLine.substr(1);
            }

            var sText = text.substr(0, fuzzyLen), result;

            //symbol in the first
            if (label_wrapinspection) {
                if (label_symbolRex.test(sLine || tmpText)) {
                    result = label_lastWordRex.exec(sText);
                    fuzzyLen -= result ? result[0].length : 0;
                    if (fuzzyLen === 0) fuzzyLen = 1;

                    sLine = text.substr(fuzzyLen);
                    sText = text.substr(0, fuzzyLen);
                }
            }

            //To judge whether a English words are truncated
            if (label_firsrEnglish.test(sLine)) {
                result = label_lastEnglish.exec(sText);
                if (result && sText !== result[0]) {
                    fuzzyLen -= result[0].length;
                    sLine = text.substr(fuzzyLen);
                    sText = text.substr(0, fuzzyLen);
                }
            }
            if (sText.trim().length > 0) {
                wrappedWords.push(sText);
            }
            text = sLine || tmpText;
            allWidth = this._measureText(text, styleIndex);
        }
        if (text.length > 0) {
            wrappedWords.push(text);
        }

        return wrappedWords;
    },

    _resetState: function () {
        var sgNode = this._sgNode;
        if(sgNode) {
            sgNode.removeAllChildren();
        }

        this._labelSegments = [];
        this._labelSegmentsCache = [];
        this._linesWidth = [];
        this._lineOffsetX = 0;
        this._lineCount = 1;
        this._labelWidth = 0;
        this._labelHeight = 0;
        this._layoutDirty = true;
    },

    _addLabelSegment: function(stringToken, styleIndex) {
        var labelSegment;
        if(this._labelSegmentsCache.length === 0) {
            labelSegment = new _ccsg.Label(stringToken);
        } else {
            labelSegment = this._labelSegmentsCache.pop();
            labelSegment.setString(stringToken);
        }
        labelSegment._styleIndex = styleIndex;
        labelSegment._lineCount = this._lineCount;

        this._applyTextAttribute(labelSegment);

        labelSegment.setAnchorPoint(cc.p(0, 0));
        this._sgNode.addChild(labelSegment);
        this._labelSegments.push(labelSegment);

        if(CC_JSB) {
            labelSegment.setOverflow(1);
            var size = labelSegment.getContentSize();
            labelSegment.setContentSize(size.width, this.lineHeight);
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
                var checkEndIndex = this._getFirstWordLen(labelString, checkStartIndex, labelString.length);
                var checkString = labelString.substr(checkStartIndex, checkEndIndex);
                var checkStringWidth = this._measureText(checkString, styleIndex);

                if(this._lineOffsetX + checkStringWidth <= this.maxWidth) {
                    this._lineOffsetX += checkStringWidth;
                    checkStartIndex += checkEndIndex;
                } else {

                    if(checkStartIndex > 0) {
                        var remainingString = labelString.substr(0, checkStartIndex);

                        this._addLabelSegment(remainingString, styleIndex);

                        labelString = labelString.substr(checkStartIndex, labelString.length);
                        fragmentWidth = this._measureText(labelString, styleIndex);
                    }
                    this._updateLineInfo();
                    break;
                }
            }
        }
        if(fragmentWidth > this.maxWidth) {
            var fragments = this._fragmentText(labelString, fragmentWidth, styleIndex);
            for(var k = 0; k < fragments.length; ++k) {
                var splitString = fragments[k];

                labelSegment =  this._addLabelSegment(splitString, styleIndex);

                var labelSize = labelSegment.getContentSize();

                this._lineOffsetX += labelSize.width;

                if(fragments.length > 1 && k < fragments.length - 1) {
                    this._updateLineInfo();
                }
            }
        } else {
            this._lineOffsetX += fragmentWidth;

            this._addLabelSegment(labelString, styleIndex);
        }

    },

    _isLastComponentCR: function(stringToken) {
        return stringToken.length -1 === stringToken.lastIndexOf("\n");
    },

    _updateLineInfo: function () {
        this._linesWidth.push(this._lineOffsetX);
        this._lineOffsetX = 0;
        this._lineCount++;
    },

    _needsUpdateTextLayout: function (newTextArray) {
        if(this._layoutDirty || !this._textArray || !newTextArray) {
            return true;
        }

        if(this._textArray.length !== newTextArray.length) {
            return true;
        }

        for(var i = 0; i < this._textArray.length; ++i) {
            var oldItem = this._textArray[i];
            var newItem = newTextArray[i];
            if(oldItem.text != newItem.text) {
                return true;
            } else {
                if (oldItem.style) {
                    if (newItem.style) {
                        if(oldItem.style.size != newItem.style.size
                           || oldItem.style.italic !== newItem.style.italic) {
                            return true;
                        }
                    } else {
                        if(oldItem.style.size || oldItem.style.italic) {
                            return true;
                        }
                    }
                } else {
                    if (newItem.style) {
                        if(newItem.style.size || newItem.style.italic) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },

    _updateRichText: function () {
        if (!this.enabled) return;

        var newTextArray = cc.htmlTextParser.parse(this.string);
        if(!this._needsUpdateTextLayout(newTextArray)) {
            this._textArray = newTextArray;
            this._updateLabelSegmentTextAttributes();
            return;
        }

        this._textArray = newTextArray;
        var sgNode = this._sgNode;
        this._resetState();

        var lastEmptyLine = false;
        var label;
        var labelSize;

        for (var i = 0; i < this._textArray.length; ++i) {
            var richTextElement = this._textArray[i];
            var text = richTextElement.text;
            //handle <br/> <img /> tag
            if(text === "") {
                if(richTextElement.style && richTextElement.style.newline) {
                    this._updateLineInfo();
                    continue;
                }
            }
            var multilineTexts = text.split("\n");

            for (var j = 0; j < multilineTexts.length; ++j) {
                var labelString = multilineTexts[j];
                if(labelString === "") {
                    //for continues \n
                    if(this._isLastComponentCR(text) && j == multilineTexts.length - 1) {
                        continue;
                    }
                    this._updateLineInfo();
                    lastEmptyLine = true;
                    continue;
                }
                lastEmptyLine = false;

                if(this.maxWidth > 0) {
                    var labelWidth = this._measureText(labelString, i);
                    this._updateRichTextWithMaxWidth(labelString, labelWidth, i);

                    if(multilineTexts.length > 1 && j < multilineTexts.length - 1) {
                        this._updateLineInfo();
                    }
                } else {
                    label = this._addLabelSegment(labelString, i);
                    labelSize = label.getContentSize();

                    this._lineOffsetX += labelSize.width;
                    if(this._lineOffsetX > this._labelWidth) {
                        this._labelWidth = this._lineOffsetX;
                    }

                    if(multilineTexts.length > 1 && j < multilineTexts.length - 1) {
                        this._updateLineInfo();
                    }
                }
            }
        }
        if(!lastEmptyLine) {
            this._linesWidth.push(this._lineOffsetX);
        }

        if(this.maxWidth > 0) {
            this._labelWidth = this.maxWidth;
        }
        this._labelHeight =this._lineCount * this.lineHeight;

        sgNode._setContentSize(cc.size(this._labelWidth, this._labelHeight));

        this._updateRichTextPosition();
        this._layoutDirty = false;
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
        if (this._isCJK_unicode(character) || this._isspace_unicode(character)) {
            return 1;
        }

        var len = 1;
        for (var index = startIndex + 1; index < textLen; ++index) {
            character = text.charAt(index);
            if (this._isspace_unicode(character) || this._isCJK_unicode(character)) {
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
        for(var i = 0; i < this._labelSegments.length; ++i) {
            var label = this._labelSegments[i];
            var lineCount = label._lineCount;
            if (lineCount > nextLineIndex) {
                nextTokenX = 0;
                nextLineIndex = lineCount;
            }
            var lineOffsetX = 0;
            switch (this.horizontalAlign) {
              case cc.TextAlignment.LEFT:
                  lineOffsetX = 0;
                  break;
              case cc.TextAlignment.CENTER:
                  lineOffsetX = (this._labelWidth - this._linesWidth[lineCount - 1]) / 2;
                  break;
              case cc.TextAlignment.RIGHT:
                  lineOffsetX = this._labelWidth - this._linesWidth[lineCount - 1];
                  break;
              default:
                  break;
            }
            label.setPositionX(nextTokenX + lineOffsetX);

            var labelSize = label.getContentSize();

            var positionY = (totalLineCount - lineCount) * this.lineHeight;

            label.setPositionY(positionY);

            if (lineCount === nextLineIndex) {
                nextTokenX += labelSize.width;
            }

        }
    },

    _applyTextAttribute: function (label) {
        var index = label._styleIndex;
        label.setLineHeight(this.lineHeight);
        label.setVerticalAlign(VerticalAlign.CENTER);
        label.enableBold(false);
        label.enableItalics(false);
        label.enableUnderline(false);

        var textStyle = null;
        if(this._textArray[index]) {
            textStyle = this._textArray[index].style;
        }
        if(textStyle && textStyle.color) {
            var colorValue = textStyle.color.toUpperCase();
            if(cc.Color[colorValue]) {
                label.setColor(cc.Color[colorValue]);
            } else {
                label.setColor(cc.hexToColor(textStyle.color));
            }
        } else {
            label.setColor(this.node.color);
        }

        if(textStyle && textStyle.bold) {
            label.enableBold(true);
        }

        if(textStyle && textStyle.italic) {
            label.enableItalics(true);
        }

        if(textStyle && textStyle.underline) {
            label.enableUnderline(true);
        }

        if(textStyle && textStyle.size) {
            label.setFontSize(textStyle.size);
        } else {
            label.setFontSize(this.fontSize);
        }

        if(textStyle && textStyle.event) {
            if(textStyle.event.click) {
                label._clickHandler = textStyle.event.click;
            }
        }
    }

 });

 cc.RichText = module.exports = RichText;
