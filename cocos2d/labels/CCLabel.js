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

cc.Label = cc.Node.extend({
    _hAlign: cc.TextAlignment.LEFT,
    _vAlign: cc.VerticalTextAlignment.BOTTOM,
    _string: "",
    _fontSize: 20,
    _overFlow: 0, //0 clamp, 1 shrink 2, resize to content
    _isWrapText: true,
    _spacingX: 0,
    _spacingY: 0,
    _blendFunc: null,
    _labelSkinDirty: true,
    _labelIsTTF: true,
    _fontHandle: "",

    //fontHandle it is a font name or bmfont file.
    ctor: function(fontHandle) {
        this.setFontFileOrFamily(fontHandle);
        cc.Node.prototype.ctor.call(this);
        this.setContentSize(cc.size(128, 128));
        this._blendFunc = cc.BlendFunc._alphaNonPremultiplied();
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

    enableWrapText: function(enabled) {
        if (this._isWrapText === enabled) return;
        this._isWrapText = enabled;
        this._notifyLabelSkinDirty();
    },

    isWrapTextEnabled: function() {
        return this._isWrapText;
    },

    setFontSize: function(fntSize) {
        if (this._fontSize === fntSize) return;
        this._fontSize = fntSize;
        this._notifyLabelSkinDirty();
    },

    getFontSize: function() {
        return this._fontSize;
    },

    setOverflow: function(overflow) {
        if (this._overFlow === overflow) return;
        this._overFlow = overflow;
        this._notifyLabelSkinDirty();
    },

    getOverflow: function() {
        return this._overFlow;
    },

    setSpacingX: function(spacing) {
        if (this._spacingX === spacing) return;
        this._spacingX = spacing;
        if(this._labelIsTTF === false)
            this._notifyLabelSkinDirty();
    },

    setLineHeight: function(spacing) {
        if (this._spacingY === spacing) return;
        this._spacingY = spacing;
        this._notifyLabelSkinDirty();
    },

    getSpacingX: function() {
        return this._spacingX;
    },

    getLineHeight: function() {
        return this._spacingY;
    },

    setFontFileOrFamily: function( fontHandle ) {
        fontHandle = fontHandle || "";
        var extName = cc.path.extname(fontHandle);

        //specify font family name directly
        if( extName === null) {
            this._fontHandle = fontHandle;
            this._labelIsTTF = true;
            this._notifyLabelSkinDirty();
            return;
        }
        //add resource path
        fontHandle = cc.path.join(cc.loader.resPath, fontHandle);

        if(extName === ".ttf") {
            this._labelIsTTF = true;
            this._fontHandle = this._loadTTFFont(fontHandle);
        }
        else {
            //todo add bmfont here
            this._fontHandle = fontHandle;
            this._labelIsTTF = false;
            this._notifyLabelSkinDirty();
        }
    },

    _loadTTFFont : function(fontHandle){
        var ttfIndex = fontHandle.lastIndexOf(".ttf");
        if(ttfIndex === -1) return fontHandle;
        var slashPos = fontHandle.lastIndexOf("/");
        var fontFamilyName;
        if(slashPos === -1) fontFamilyName = fontHandle.substring(0,ttfIndex ) + "_LABEL";
        else fontFamilyName = fontHandle.substring(slashPos + 1, ttfIndex) + "_LABEL";
        var self = this;
        if(FontFace) {
            var fontFace = new FontFace(fontFamilyName, "url('" + fontHandle + "')");
            fontFace.load().then( function (loadedFace) {
                document.fonts.add(loadedFace);
                self._notifyLabelSkinDirty();
            });
        } else {
            //fall back implementations
            var doc = document, fontStyle = document.createElement("style");
            fontStyle.type = "text/css";
            doc.body.appendChild(fontStyle);

            var fontStr = "";
            if(isNaN(fontFamilyName - 0))
                fontStr += "@font-face { font-family:" + fontFamilyName + "; src:";
            else
                fontStr += "@font-face { font-family:'" + fontFamilyName + "'; src:";

            fontStr += "url('" + fontHandle + "');";

            fontStyle.textContent = fontStr + "}";

            //<div style="font-family: PressStart;">.</div>
            var preloadDiv = document.createElement("div");
            var _divStyle =  preloadDiv.style;
            _divStyle.fontFamily = name;
            preloadDiv.innerHTML = ".";
            _divStyle.position = "absolute";
            _divStyle.left = "-100px";
            _divStyle.top = "-100px";
            doc.body.appendChild(preloadDiv);
            self.scheduleOnce(self._notifyLabelSkinDirty,2);
        }

        return fontFamilyName;
    },

    setContentSize: function(size, height) {
        var oldWidth = this._contentSize.width;
        var oldHeight = this._contentSize.height;
        cc.Node.prototype.setContentSize.call(this, size,height);
        if (oldWidth === this._contentSize.width && oldHeight === this._contentSize.height) {
            return;
        }
        this._notifyLabelSkinDirty();
    },

    setBlendFunc: function (src, dst) {
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
        this._labelSkinDirty = true;
        if(this._renderCmd)
            this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.textDirty);
    },
    _createRenderCmd: function() {

        if (this._labelIsTTF) {
            if (cc._renderType === cc.game.RENDER_TYPE_WEBGL)
                return new cc.Label.TTFWebGLRenderCmd(this);
            else
                return new cc.Label.TTFCanvasRenderCmd(this);
        } else {
            //todo:add label bmfont here
        }
    }
});

cc.Label.Overflow = cc.Enum({
    CLAMP: 0,
    SHRINK: 1,
    RESIZE: 2
});
