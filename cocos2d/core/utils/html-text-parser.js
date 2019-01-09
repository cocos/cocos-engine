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

var eventRegx = /^(click)(\s)*=|(param)(\s)*=/;
var imageAttrReg = /(\s)*src(\s)*=|(\s)*height(\s)*=|(\s)*width(\s)*=|(\s)*click(\s)*=|(\s)*param(\s)*=/;
/**
 * A utils class for parsing HTML texts. The parsed results will be an object array.
 */
var HtmlTextParser = function() {
    this._parsedObject = {};
    this._specialSymbolArray = [];
    this._specialSymbolArray.push([/&lt;/g, '<']);
    this._specialSymbolArray.push([/&gt;/g, '>']);
    this._specialSymbolArray.push([/&amp;/g, '&']);
    this._specialSymbolArray.push([/&quot;/g, '"']);
    this._specialSymbolArray.push([/&apos;/g, '\'']);
};

HtmlTextParser.prototype = {
    constructor: HtmlTextParser,
    parse: function(htmlString) {
        this._resultObjectArray = [];
        this._stack = [];

        var startIndex = 0;
        var length = htmlString.length;
        while (startIndex < length) {
            var tagBeginIndex = htmlString.indexOf('<', startIndex);
            if (tagBeginIndex < 0) {
                this._stack.pop();
                this._processResult(htmlString.substring(startIndex));
                startIndex = length;
            } else {
                this._processResult(htmlString.substring(startIndex, tagBeginIndex));

                var tagEndIndex = htmlString.indexOf('>', startIndex);
                if (tagEndIndex === -1) {
                    // cc.error('The HTML tag is invalid!');
                    tagEndIndex = tagBeginIndex;
                } else if (htmlString.charAt(tagBeginIndex + 1) === '\/'){
                    this._stack.pop();
                } else {
                    this._addToStack(htmlString.substring(tagBeginIndex + 1, tagEndIndex));
                }
                startIndex = tagEndIndex + 1;

            }
        }


        return this._resultObjectArray;
    },

    _attributeToObject: function (attribute) {
        attribute = attribute.trim();

        var obj = {};
        var header = attribute.match(/^(color|size)(\s)*=/);
        var tagName;
        var nextSpace;
        var eventObj;
        var eventHanlderString;
        if (header) {
            tagName = header[0];
            attribute = attribute.substring(tagName.length).trim();
            if(attribute === "") return obj;

            //parse color
            nextSpace = attribute.indexOf(' ');
            switch(tagName[0]){
              case 'c':
                  if (nextSpace > -1) {
                      obj.color = attribute.substring(0, nextSpace).trim();
                  } else {
                      obj.color = attribute;
                  }
                  break;
              case 's':
                  obj.size = parseInt(attribute);
                  break;
            }

            //tag has event arguments
            if(nextSpace > -1) {
                eventHanlderString = attribute.substring(nextSpace+1).trim();
                eventObj = this._processEventHandler(eventHanlderString);
                obj.event = eventObj;
            }
            return obj;
        }

        header = attribute.match(/^(br(\s)*\/)/);
        if(header && header[0].length > 0) {
            tagName = header[0].trim();
            if(tagName.startsWith("br") && tagName[tagName.length-1] === "/") {
                obj.isNewLine = true;
                this._resultObjectArray.push({text: "", style: {newline: true}});
                return obj;
            }
        }

        header = attribute.match(/^(img(\s)*src(\s)*=[^>]+\/)/);
        if(header && header[0].length > 0) {
            tagName = header[0].trim();
            if(tagName.startsWith("img") && tagName[tagName.length-1] === "/") {
                header = attribute.match(imageAttrReg);
                var tagValue;
                var remainingArgument;
                var isValidImageTag = false;
                while (header) {
                    //skip the invalid tags at first
                    attribute = attribute.substring(attribute.indexOf(header[0]));
                    tagName = attribute.substr(0, header[0].length);
                    //remove space and = character
                    remainingArgument = attribute.substring(tagName.length).trim();
                    nextSpace = remainingArgument.indexOf(' ');

                    tagValue = (nextSpace > -1) ? remainingArgument.substr(0, nextSpace) : remainingArgument;
                    tagName = tagName.replace(/[^a-zA-Z]/g, "").trim();
                    tagName = tagName.toLocaleLowerCase();

                    attribute = remainingArgument.substring(nextSpace).trim();
                    if (tagName === "src") {
                        obj.isImage = true
                        if( tagValue.endsWith( '\/' ) ) tagValue = tagValue.substring( 0, tagValue.length - 1 );
                        if( tagValue.indexOf('\'')===0 ) {
                            isValidImageTag = true;
                            tagValue = tagValue.substring( 1, tagValue.length - 1 );
                        } else if( tagValue.indexOf('"')===0 ) {
                            isValidImageTag = true;
                            tagValue = tagValue.substring( 1, tagValue.length - 1 );
                        }
                        obj.src = tagValue;
                    } else if (tagName === "height") {
                        obj.imageHeight = parseInt(tagValue);
                    } else if (tagName === "width") {
                        obj.imageWidth = parseInt(tagValue);
                    } else if (tagName === "click") {
                        obj.event = this._processEventHandler(tagName + "=" + tagValue);
                    }

                    if (obj.event && tagName === 'param') {
                        obj.event.param = tagValue.replace(/^\"|\"$/g, '');
                    }

                    header = attribute.match(imageAttrReg);
                }

                if( isValidImageTag && obj.isImage )
                {
                    this._resultObjectArray.push({text: "", style: obj});
                }

                return {};
            }
        }

        header = attribute.match(/^(outline(\s)*[^>]*)/);
        if (header) {
            attribute = header[0].substring("outline".length).trim();
            var defaultOutlineObject = {color: "#ffffff", width: 1};
            if (attribute) {
                var outlineAttrReg = /(\s)*color(\s)*=|(\s)*width(\s)*=|(\s)*click(\s)*=|(\s)*param(\s)*=/;
                header = attribute.match(outlineAttrReg);
                var tagValue;
                while (header) {
                    //skip the invalid tags at first
                    attribute = attribute.substring(attribute.indexOf(header[0]));
                    tagName = attribute.substr(0, header[0].length);
                    //remove space and = character
                    remainingArgument = attribute.substring(tagName.length).trim();
                    nextSpace = remainingArgument.indexOf(' ');
                    if (nextSpace > -1) {
                        tagValue = remainingArgument.substr(0, nextSpace);
                    } else {
                        tagValue = remainingArgument;
                    }
                    tagName = tagName.replace(/[^a-zA-Z]/g, "").trim();
                    tagName = tagName.toLocaleLowerCase();

                    attribute = remainingArgument.substring(nextSpace).trim();
                    if (tagName === "click") {
                        obj.event = this._processEventHandler(tagName + "=" + tagValue);
                    } else if (tagName === "color") {
                        defaultOutlineObject.color = tagValue;
                    } else if (tagName === "width") {
                        defaultOutlineObject.width = parseInt(tagValue);
                    }

                    if (obj.event && tagName === 'param') {
                        obj.event.param = tagValue.replace(/^\"|\"$/g, '');
                    }

                    header = attribute.match(outlineAttrReg);
                }
            }
            obj.outline = defaultOutlineObject;
        }

        header = attribute.match(/^(on|u|b|i)(\s)*/);
        if(header && header[0].length > 0) {
            tagName = header[0];
            attribute = attribute.substring(tagName.length).trim();
            switch(tagName[0]){
              case 'u':
                  obj.underline = true;
                  break;
              case 'i':
                  obj.italic = true;
                  break;
              case 'b':
                  obj.bold = true;
                  break;
            }
            if(attribute === "") {
                return obj;
            }
            eventObj = this._processEventHandler(attribute);
            obj.event = eventObj;
        }

        return obj;
    },

    _processEventHandler: function (eventString) {
        var index = 0;
        var obj = {};
        var eventNames = eventString.match(eventRegx);
        var isValidTag = false;
        while(eventNames) {
            var eventName = eventNames[0];
            var eventValue = "";
            isValidTag = false;
            eventString = eventString.substring(eventName.length).trim();
            if(eventString.charAt(0) === "\"") {
                index = eventString.indexOf("\"", 1);
                if (index > -1) {
                    eventValue = eventString.substring(1, index).trim();
                    isValidTag = true;
                }
                index++;
            } else if(eventString.charAt(0) === "\'") {
                index = eventString.indexOf('\'', 1);
                if(index > -1) {
                    eventValue = eventString.substring(1, index).trim();
                    isValidTag = true;
                }
                index++;
            } else {
                //skip the invalid attribute value
                var match = eventString.match(/(\S)+/);
                if(match) {
                    eventValue = match[0];
                } else {
                    eventValue = "";
                }
                index = eventValue.length;
            }

            if(isValidTag) {
                eventName = eventName.substring(0, eventName.length-1).trim();
                obj[eventName] = eventValue;
            }

            eventString = eventString.substring(index).trim();
            eventNames = eventString.match(eventRegx);
        }

        return obj;
    },

    _addToStack: function(attribute) {
        var obj = this._attributeToObject(attribute);

        if (this._stack.length === 0){
            this._stack.push(obj);
        } else {
            if(obj.isNewLine || obj.isImage) {
                return;
            }
            //for nested tags
            var previousTagObj = this._stack[this._stack.length - 1];
            for (var key in previousTagObj) {
                if (!(obj[key])) {
                    obj[key] = previousTagObj[key];
                }
            }
            this._stack.push(obj);
        }
    },

    _processResult: function(value) {
        if (value === "") {
            return;
        }

        value = this._escapeSpecialSymbol(value);
        if (this._stack.length > 0) {
            this._resultObjectArray.push({text: value, style: this._stack[this._stack.length - 1]});
        } else {
            this._resultObjectArray.push({text: value});
        }
    },

    _escapeSpecialSymbol: function(str) {
        for(var i = 0; i < this._specialSymbolArray.length; ++i) {
            var key = this._specialSymbolArray[i][0];
            var value = this._specialSymbolArray[i][1];

            str = str.replace(key, value);
        }
        return str;
    }
};

if (CC_TEST) {
    cc._Test.HtmlTextParser = HtmlTextParser;
}

module.exports = HtmlTextParser;