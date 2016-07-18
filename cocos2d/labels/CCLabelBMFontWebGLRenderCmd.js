/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

 Use any of these editors to generate BMFonts:
 http://glyphdesigner.71squared.com/ (Commercial, Mac OS X)
 http://www.n4te.com/hiero/hiero.jnlp (Free, Java)
 http://slick.cokeandcode.com/demos/hiero.jnlp (Free, Java)
 http://www.angelcode.com/products/bmfont/ (Free, Windows only)
 ****************************************************************************/

(function(){
    cc.LabelBMFont.WebGLRenderCmd = function(renderableObject){
        _ccsg.Node.WebGLRenderCmd.call(this, renderableObject);
    };

    var proto = cc.LabelBMFont.WebGLRenderCmd.prototype = Object.create(_ccsg.Node.WebGLRenderCmd.prototype);
    proto.constructor = cc.LabelBMFont.WebGLRenderCmd;

    proto.setTexture = function (texture) {
        this._node.setOpacityModifyRGB(this._node._texture.hasPremultipliedAlpha());
    };

    proto._updateCharTexture = function(fontChar, rect, key){
        // updating previous sprite
        fontChar.setTextureRect(rect, false);
        // restore to default in case they were modified
        fontChar.visible = true;
    };

    proto._changeTextureColor = function(){};

    proto._updateCharColorAndOpacity = function(){};
})();
