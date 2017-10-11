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

/************************  Actions  *************************/

cc.Speed.prototype._ctor = function (action, speed) {
    speed !== undefined && this.initWithAction(action, speed);
};
cc.speed = cc.Speed.create = function (action, speed) {
    return new cc.Speed(action, speed);
};

cc.CardinalSplineTo.prototype._ctor = cc.CardinalSplineBy.prototype._ctor = function(duration, points, tension) {
    tension !== undefined && this.initWithDuration(duration, points, tension);
};

cc.CatmullRomTo.prototype._ctor = cc.CatmullRomBy.prototype._ctor = function(dt, points) {
    points !== undefined && this.initWithDuration(dt, points);
};

var easeCtor = function(action) {
    action !== undefined && this.initWithAction(action);
};

cc.ActionEase.prototype._ctor = easeCtor;
cc.EaseExponentialIn.prototype._ctor = easeCtor;
cc.EaseExponentialOut.prototype._ctor = easeCtor;
cc.EaseExponentialInOut.prototype._ctor = easeCtor;
cc.EaseSineIn.prototype._ctor = easeCtor;
cc.EaseSineOut.prototype._ctor = easeCtor;
cc.EaseSineInOut.prototype._ctor = easeCtor;
cc.EaseBounce.prototype._ctor = easeCtor;
cc.EaseBounceIn.prototype._ctor = easeCtor;
cc.EaseBounceOut.prototype._ctor = easeCtor;
cc.EaseBounceInOut.prototype._ctor = easeCtor;
cc.EaseBackIn.prototype._ctor = easeCtor;
cc.EaseBackOut.prototype._ctor = easeCtor;
cc.EaseBackInOut.prototype._ctor = easeCtor;

var easeRateCtor = function(action, rate) {
    rate !== undefined && this.initWithAction(action, rate);
};
cc.EaseRateAction.prototype._ctor = easeRateCtor;
cc.EaseIn.prototype._ctor = easeRateCtor;
cc.EaseOut.prototype._ctor = easeRateCtor;
cc.EaseInOut.prototype._ctor = easeRateCtor;

var easeElasticCtor = function(action, period) {
    if( action ) {
        period !== undefined ? this.initWithAction(action, period)
                             : this.initWithAction(action);
    }
};
cc.EaseElastic.prototype._ctor = easeElasticCtor;
cc.EaseElasticIn.prototype._ctor = easeElasticCtor;
cc.EaseElasticOut.prototype._ctor = easeElasticCtor;
cc.EaseElasticInOut.prototype._ctor = easeElasticCtor;

cc.RemoveSelf.prototype._ctor = function(isNeedCleanUp) {
    isNeedCleanUp !== undefined && cc.RemoveSelf.prototype.init.call(this, isNeedCleanUp);
};

cc.FlipX.prototype._ctor = function(flip) {
    flip !== undefined && this.initWithFlipX(flip);
};

cc.FlipY.prototype._ctor = function(flip) {
    flip !== undefined && this.initWithFlipY(flip);
};

cc.Place.prototype._ctor = function(pos, y) {
    if (pos !== undefined) {
        if (pos.x !== undefined) {
            y = pos.y;
            pos = pos.x;
        }
        this.initWithPosition(cc.p(pos, y));
    }
};

cc.CallFunc.prototype._ctor = function(selector, selectorTarget, data) {
    if (selector !== undefined) {
        if (selectorTarget === undefined) {
            this.initWithFunction(selector);
        }
        else {
            var callback = selector;
            if (data !== undefined) {
                callback = function (sender) {
                    selector.call(this, sender, data);
                }
            }
            this.initWithFunction(callback, selectorTarget);
        }
    }
};

cc.ActionInterval.prototype._ctor = function(d) {
    d !== undefined && this.initWithDuration(d);
};

cc.Sequence.prototype._ctor = function(tempArray) {
    var actions = (tempArray instanceof Array) ? tempArray : arguments;
    var last = actions.length - 1;
    if ((last >= 0) && (actions[last] == null))
        cc.log('parameters should not be ending with null in Javascript');

    if (last >= 1) {
        var prev = actions[0];
        for (var i = 1; i < last; i++) {
            if (actions[i]) {
                prev = new cc.Sequence(prev, actions[i]);
            }
        }
        this.initWithTwoActions(prev, actions[last]);
    }
};
cc.sequence = cc.Sequence.create = function (tempArray) {
    var actions = (tempArray instanceof Array) ? tempArray : arguments;
    var last = actions.length - 1;
    if ((last >= 0) && (actions[last] == null))
        cc.log('parameters should not be ending with null in Javascript');

    if (last >= 1) {
        var prev = actions[0];
        for (var i = 1; i < last; i++) {
            if (actions[i]) {
                prev = new cc.Sequence(prev, actions[i]);
            }
        }
        return new cc.Sequence(prev, actions[last]);
    }
    else {
        return null;
    }
};

cc.Repeat.prototype._ctor = function (action, times) {
    times !== undefined && this.initWithAction(action, times);
};
cc.repeat = cc.Repeat.create = function (action, times) {
    return new cc.Repeat(action, times);
};

cc.RepeatForever.prototype._ctor = function (action) {
    action !== undefined && this.initWithAction(action);
};
cc.repeatForever = cc.RepeatForever.create = function (action) {
    return new cc.RepeatForever(action);
};

cc.Spawn.prototype._ctor = function (tempArray) {
    var actions = (tempArray instanceof Array) ? tempArray : arguments;
    var last = actions.length - 1;
    if ((last >= 0) && (actions[last] == null))
        cc.log('parameters should not be ending with null in Javascript');

    if (last >= 1) {
        var prev = actions[0];
        for (var i = 1; i < last; i++) {
            if (actions[i]) {
                prev = new cc.Spawn(prev, actions[i]);
            }
        }
        this.initWithTwoActions(prev, actions[last]);
    }
};
cc.spawn = cc.Spawn.create = function (tempArray) {
    var actions = (tempArray instanceof Array) ? tempArray : arguments;
    var last = actions.length - 1;
    if ((last >= 0) && (actions[last] == null))
        cc.log('parameters should not be ending with null in Javascript');

    if (last >= 1) {
        var prev = actions[0];
        for (var i = 1; i < last; i++) {
            if (actions[i]) {
                prev = new cc.Spawn(prev, actions[i]);
            }
        }
        return new cc.Spawn(prev, actions[last]);
    }
    else {
        return null;
    }
};

cc.RotateTo.prototype._ctor = cc.RotateBy.prototype._ctor = function(duration, deltaAngleX, deltaAngleY) {
    if (deltaAngleX !== undefined) {
        if (deltaAngleY !== undefined)
            this.initWithDuration(duration, deltaAngleX, deltaAngleY);
        else
            this.initWithDuration(duration, deltaAngleX, deltaAngleX);
    }
};

cc.MoveBy.prototype._ctor = cc.MoveTo.prototype._ctor = function(duration, pos, y) {
    if (pos !== undefined) {
        if(pos.x === undefined) {
            pos = cc.p(pos, y);
        }

        this.initWithDuration(duration, pos);
    }
};

cc.SkewTo.prototype._ctor = cc.SkewBy.prototype._ctor = function(t, sx, sy) {
    sy !== undefined && this.initWithDuration(t, sx, sy);
};

cc.JumpBy.prototype._ctor = cc.JumpTo.prototype._ctor = function(duration, position, y, height, jumps) {
    if (height !== undefined) {
        if (jumps !== undefined) {
            position = cc.p(position, y);
        }
        else {
            jumps = height;
            height = y;
        }
        this.initWithDuration(duration, position, height, jumps);
    }
};

cc.BezierBy.prototype._ctor = cc.BezierTo.prototype._ctor = function(t, c) {
    c !== undefined && this.initWithDuration(t, c);
};

cc.ScaleTo.prototype._ctor = cc.ScaleBy.prototype._ctor = function(duration, sx, sy) {
    if (sx !== undefined) {
        if (sy !== undefined)
            this.initWithDuration(duration, sx, sy);
        else this.initWithDuration(duration, sx);
    }
};

cc.Blink.prototype._ctor = function(duration, blinks) {
    blinks !== undefined && this.initWithDuration(duration, blinks);
};

cc.FadeTo.prototype._ctor = function(duration, opacity) {
    opacity !== undefined && this.initWithDuration(duration, opacity);
};

cc.FadeIn.prototype._ctor = function(duration) {
    duration !== undefined && this.initWithDuration(duration, 255);
};

cc.FadeOut.prototype._ctor = function(duration) {
    duration !== undefined && this.initWithDuration(duration, 0);
};

cc.TintTo.prototype._ctor = cc.TintBy.prototype._ctor = function(duration, red, green, blue) {
    blue !== undefined && this.initWithDuration(duration, red, green, blue);
};

cc.DelayTime.prototype._ctor = function(duration) {
    duration !== undefined && this.initWithDuration(duration);
};
/*
cc.ReverseTime.prototype._ctor = function(action) {
    action && this.initWithAction(action);
};*/

cc.TargetedAction.prototype._ctor = function (target, action) {
    action && this.initWithTarget(target, action);
};
cc.targetedAction = cc.TargetedAction.create = function (target, action) {
    return new cc.TargetedAction(target, action);
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

cc.LabelTTF.prototype._ctor = function (text, fontName, fontSize, dimensions, hAlignment, vAlignment) {
    this._flippedX = false;
    this._flippedY = false;
    this._renderLabel = this.getRenderLabel();
    if (text === undefined) {
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
