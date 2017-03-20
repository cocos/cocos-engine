/*
 * Copyright (c) 2014-2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/************************************************************
 *
 * Constructors with built in init function
 *
 ************************************************************/

var _p;

/************************  Layers  *************************/

var dummyCtor = function(){
    this.init();
};

_p = cc.Layer.prototype;
_p._ctor = function() {
    cc.Layer.prototype.init.call(this);
};


_p = cc.LayerColor.prototype;
_p._ctor = function(color, w, h) {
    color = color ||  cc.color(0, 0, 0, 255);
    w = w === undefined ? cc.winSize.width : w;
    h = h === undefined ? cc.winSize.height : h;

    cc.LayerColor.prototype.init.call(this, color, w, h);
};


_p = cc.LayerGradient.prototype;
_p._ctor = function(start, end, v, colorStops) {
    start = start || cc.color(0,0,0,255);
    end = end || cc.color(0,0,0,255);
    v = v || cc.p(0, -1);

    this.initWithColor(start, end, v);

    if (colorStops instanceof Array) {
        cc.log('Warning: Color stops parameter is not supported in JSB.');
    }
};


/************************  Sprite  *************************/

_p = cc.Sprite.prototype;
_p._ctor = function(fileName, rect) {
    if (fileName === undefined) {
        cc.Sprite.prototype.init.call(this);
    }
    else if (typeof(fileName) === 'string') {
        if (fileName[0] === '#') {
            //init with a sprite frame name
            var frameName = fileName.substr(1, fileName.length - 1);
            this.initWithSpriteFrameName(frameName);
        } else {
            // Create with filename and rect
            rect ? this.initWithFile(fileName, rect) : this.initWithFile(fileName);
        }
    }
    else if (typeof(fileName) === 'object') {
        if (fileName instanceof cc.Texture2D) {
            //init with texture and rect
            rect ? this.initWithTexture(fileName, rect) : this.initWithTexture(fileName);
        } else if (fileName instanceof cc.SpriteFrame) {
            //init with a sprite frame
            this.initWithSpriteFrame(fileName);
        } else if (fileName instanceof jsb.PolygonInfo) {
            //init with a polygon info
            this.initWithPolygon(fileName);
        }
    }
};

_p = cc.SpriteFrame.prototype;
_p._ctor = function(filename, rect, rotated, offset, originalSize){
    if(originalSize !== undefined){
        if(filename instanceof cc.Texture2D)
            this.initWithTexture(filename, rect, rotated, offset, originalSize);
        else
            this.initWithTexture(filename, rect, rotated, offset, originalSize);
    }else if(rect !== undefined){
        if(filename instanceof cc.Texture2D)
            this.initWithTexture(filename, rect);
        else
            this.initWithTextureFilename(filename, rect);
    }
};

/************************  motion-streak  *************************/
_p = cc.MotionStreak.prototype;
_p._ctor = function(fade, minSeg, stroke, color, texture){
    if(texture !== undefined)
        this.initWithFade(fade, minSeg, stroke, color, texture);
};

/************************  Particle  *************************/
_p = cc.ParticleBatchNode.prototype;
_p._ctor = function(fileImage, capacity){
    capacity = capacity || cc.PARTICLE_DEFAULT_CAPACITY;
    if (typeof(fileImage) == 'string') {
        cc.ParticleBatchNode.prototype.init.call(this, fileImage, capacity);
    } else if (fileImage instanceof cc.Texture2D) {
        this.initWithTexture(fileImage, capacity);
    }
};

_p = cc.ParticleSystem.prototype;
_p._ctor = function(plistFile){
    if (!plistFile || typeof(plistFile) === 'number') {
        var ton = plistFile || 100;
        this.initWithTotalParticles(ton);
    } else if ( typeof plistFile === 'string') {
        this.initWithFile(plistFile);
    } else if(plistFile){
        this.initWithDictionary(plistFile);
    }
};

cc.ParticleFire.prototype._ctor = dummyCtor;
cc.ParticleFireworks.prototype._ctor = dummyCtor;
cc.ParticleSun.prototype._ctor = dummyCtor;
cc.ParticleGalaxy.prototype._ctor = dummyCtor;
cc.ParticleMeteor.prototype._ctor = dummyCtor;
cc.ParticleFlower.prototype._ctor = dummyCtor;
cc.ParticleSpiral.prototype._ctor = dummyCtor;
cc.ParticleExplosion.prototype._ctor = dummyCtor;
cc.ParticleSmoke.prototype._ctor = dummyCtor;
cc.ParticleRain.prototype._ctor = dummyCtor;
cc.ParticleSnow.prototype._ctor = dummyCtor;

/************************  RenderTexture  *************************/
_p = cc.RenderTexture.prototype;
_p._ctor = function(width, height, format, depthStencilFormat){
    if(width !== undefined && height !== undefined){
        format = format || cc.Texture2D.PIXEL_FORMAT_RGBA8888;
        depthStencilFormat = depthStencilFormat || 0;
        this.initWithWidthAndHeight(width, height, format, depthStencilFormat);
    }
};

/************************  Tile Map  *************************/
_p = cc.TileMapAtlas.prototype;
_p._ctor = function(tile, mapFile, tileWidth, tileHeight){
    if(tileHeight !== undefined)
        this.initWithTileFile(tile, mapFile, tileWidth, tileHeight);
};

_p = cc.TMXLayer.prototype;
_p._ctor = function(tilesetInfo, layerInfo, mapInfo){
    if(mapInfo !== undefined)
        this.initWithTilesetInfo(tilesetInfo, layerInfo, mapInfo);
};

_p = cc.TMXTiledMap.prototype;
_p._ctor = function(tmxFile, resourcePath){
    if(resourcePath !== undefined){
        this.initWithXML(tmxFile,resourcePath);
    }else if(tmxFile !== undefined){
        this.initWithTMXFile(tmxFile);
    }
};

_p = cc.TMXMapInfo.prototype;
_p._ctor = function(tmxFile, resourcePath){
    if (resourcePath !== undefined) {
        this.initWithXML(tmxFile,resourcePath);
    }else if(tmxFile !== undefined){
        this.initWithTMXFile(tmxFile);
    }
};

/************************  Nodes  *************************/

cc.ClippingNode.prototype._ctor = function(stencil) {
    if(stencil != undefined)
        cc.ClippingNode.prototype.init.call(this, stencil);
    else
        cc.ClippingNode.prototype.init.call(this);
};

cc.DrawNode.prototype._ctor = function() {
    cc.DrawNode.prototype.init.call(this);
};

cc.LabelTTF.prototype._ctor = function(text, fontName, fontSize, dimensions, hAlignment, vAlignment) {
    this._flippedX = false;
    this._flippedY = false;
    this._renderLabel = this.getRenderLabel();
    if (arguments.length <= 0) {
        return;
    }
    
    text = text || '';
    if (fontName && fontName instanceof cc.FontDefinition) {
        this.initWithStringAndTextDefinition(text, fontName);
    }
    else {
        fontName = fontName || '';
        fontSize = fontSize || 16;
        dimensions = dimensions || cc.size(0,0);
        hAlignment = hAlignment === undefined ? cc.TEXT_ALIGNMENT_LEFT : hAlignment;
        vAlignment = vAlignment === undefined ? cc.VERTICAL_TEXT_ALIGNMENT_TOP : vAlignment;
        this.initWithString(text, fontName, fontSize, dimensions, hAlignment, vAlignment);
    }
};

/************************  Other classes  *************************/

cc.EventTouch.prototype._ctor = function(touches) {
    touches !== undefined && cc.EventTouch.prototype.setTouches.call(this, touches);
};
cc.Touch.prototype._ctor = function(x, y, id) {
    id !== undefined && cc.Touch.prototype.setTouchInfo.call(this, x, y, id);
};

cc.GLProgram.prototype._ctor = function(vShaderFileName, fShaderFileName) {
    if(vShaderFileName !== undefined && fShaderFileName !== undefined){
        cc.GLProgram.prototype.init.call(this, vShaderFileName, fShaderFileName);
        cc.GLProgram.prototype.link.call(this);
        cc.GLProgram.prototype.updateUniforms.call(this);
    }
};
