/*
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
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

//
// cocos2d constants
//

// CCConfig.js
//
cc.ENGINE_VERSION = "Cocos2d-x-lite v1.8.2";

// Resolution policies

cc.ResolutionPolicy = {
    // The entire application is visible in the specified area without trying to preserve the original aspect ratio.
    // Distortion can occur, and the application may appear stretched or compressed.
    EXACT_FIT:0,
    // The entire application fills the specified area, without distortion but possibly with some cropping,
    // while maintaining the original aspect ratio of the application.
    NO_BORDER:1,
    // The entire application is visible in the specified area without distortion while maintaining the original
    // aspect ratio of the application. Borders can appear on two sides of the application.
    SHOW_ALL:2,
    // The application takes the height of the design resolution size and modifies the width of the internal
    // canvas so that it fits the aspect ratio of the device
    // no distortion will occur however you must make sure your application works on different
    // aspect ratios
    FIXED_HEIGHT:3,
    // The application takes the width of the design resolution size and modifies the height of the internal
    // canvas so that it fits the aspect ratio of the device
    // no distortion will occur however you must make sure your application works on different
    // aspect ratios
    FIXED_WIDTH:4,

    UNKNOWN:5
};

cc.Director.PROJECTION_2D = 0;
cc.Director.PROJECTION_3D = 1;
cc.Director.PROJECTION_CUSTOM = 3;
cc.Director.PROJECTION_DEFAULT = cc.Director.PROJECTION_3D;

cc.Scheduler.PRIORITY_SYSTEM = -2147483648;
cc.Scheduler.PRIORITY_NON_SYSTEM = cc.Scheduler.PRIORITY_SYSTEM + 1;

var _Class = cc.Texture2D;

_Class.PIXEL_FORMAT_NONE = -1;
_Class.PIXEL_FORMAT_AUTO = 0;
_Class.PIXEL_FORMAT_BGRA8888 = 1;
_Class.PIXEL_FORMAT_RGBA8888 = 2;
_Class.PIXEL_FORMAT_RGB888 = 3;
_Class.PIXEL_FORMAT_RGB565 = 4;
_Class.PIXEL_FORMAT_A8 = 5;
_Class.PIXEL_FORMAT_I8 = 6;
_Class.PIXEL_FORMAT_AI88 = 7;
_Class.PIXEL_FORMAT_RGBA4444 = 8;
_Class.PIXEL_FORMAT_RGB5A1 = 9;
_Class.PIXEL_FORMAT_PVRTC4 = 10;
_Class.PIXEL_FORMAT_PVRTC4A = 11;
_Class.PIXEL_FORMAT_PVRTC2 = 11;
_Class.PIXEL_FORMAT_PVRTC2A = 13;
_Class.PIXEL_FORMAT_ETC = 14;
_Class.PIXEL_FORMAT_S3TC_DXT1 = 15;
_Class.PIXEL_FORMAT_S3TC_DXT3 = 16;
_Class.PIXEL_FORMAT_S3TC_DXT5 = 17;
_Class.PIXEL_FORMAT_ATC_RGB = 18;
_Class.PIXEL_FORMAT_ATC_EXPLICIT_ALPHA = 19;
_Class.PIXEL_FORMAT_ATC_INTERPOLATED_ALPHA = 20;
_Class.PIXEL_FORMAT_DEFAULT = _Class.PIXEL_FORMAT_AUTO;
_Class.defaultPixelFormat = _Class.PIXEL_FORMAT_DEFAULT;

cc.Event.TOUCH = 0;                  //CCEvent.js
cc.Event.KEYBOARD = 1;
cc.Event.ACCELERATION = 2;
cc.Event.MOUSE = 3;
cc.Event.FOCUS = 4;
//game controller 5
cc.Event.CUSTOM = 6;
cc.EventMouse.NONE = 0;
cc.EventMouse.DOWN = 1;
cc.EventMouse.UP = 2;
cc.EventMouse.MOVE = 3;
cc.EventMouse.SCROLL = 4;
cc.EventMouse.BUTTON_LEFT = 0;
cc.EventMouse.BUTTON_RIGHT = 1;
cc.EventMouse.BUTTON_MIDDLE = 2;
cc.EventMouse.BUTTON_4 = 3;
cc.EventMouse.BUTTON_5 = 4;
cc.EventMouse.BUTTON_6 = 5;
cc.EventMouse.BUTTON_7 = 6;
cc.EventMouse.BUTTON_8 = 7;
cc.EventTouch.MAX_TOUCHES = 5;
cc.EventTouch.EventCode = {BEGAN: 0, MOVED: 1, ENDED: 2, CANCELLED: 3};

cc.ParticleSystem.SHAPE_MODE = 0;            //CCParticleSystem.js
cc.ParticleSystem.TEXTURE_MODE = 1;
cc.ParticleSystem.STAR_SHAPE = 0;
cc.ParticleSystem.BALL_SHAPE = 1;
cc.ParticleSystem.DURATION_INFINITY = -1;
cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE = -1;
cc.ParticleSystem.START_RADIUS_EQUAL_TO_END_RADIUS = -1;

cc.TMXLayerInfo.ATTRIB_NONE = 1 << 0;            //CCTMXXMLParser.js
cc.TMXLayerInfo.ATTRIB_BASE64 = 1 << 1;
cc.TMXLayerInfo.ATTRIB_GZIP = 1 << 2;
cc.TMXLayerInfo.ATTRIB_ZLIB = 1 << 3;

// Temporary basic structures, will be overwrite by value-types/
// Point
cc.p = function (x, y) {
    'use strict';
    if (x === undefined)
        return {x: 0, y: 0};
    if (y === undefined)
        return {x: x.x, y: x.y};
    return {x:x, y:y};
};
// Size
cc.size = function (w, h) {
    'use strict';
    return {width:w, height:h};
};
// Rect
cc.rect = function (x, y, w, h) {
    'use strict';
    if (x === undefined)
        return { x: 0, y: 0, width: 0, height: 0 };

    if (y === undefined)
        return { x: x.x, y: x.y, width: x.width, height: x.height };

    if (w === undefined)
        return { x: x.x, y: x.y, width: y.width, height: y.height };

    if (h !== undefined)
        return { x: x, y: y, width: w, height: h };

    throw "unknown argument type";
};
// Color
cc.color = function (r, g, b, a) {
    'use strict';
    if (r === undefined)
        return {r: 0, g: 0, b: 0, a: 255};
    if (typeof r === "string")
        return cc.hexToColor(r);
    if (typeof r === "object")
        return {r: r.r, g: r.g, b: r.b, a: (r.a === undefined) ? 255 : r.a};
    return  {r: r, g: g, b: b, a: (a === undefined ? 255 : a)};
};


// event listener type
cc.EventListener.UNKNOWN = 0;
cc.EventListener.TOUCH_ONE_BY_ONE = 1;
cc.EventListener.TOUCH_ALL_AT_ONCE = 2;
cc.EventListener.KEYBOARD = 3;
cc.EventListener.MOUSE = 4;
cc.EventListener.ACCELERATION = 5;
cc.EventListener.FOCUS = 6;
//game controller 7
cc.EventListener.CUSTOM = 8;


cc.EventListener.create = function(argObj){
    if(!argObj || !argObj.event){
        throw "Invalid parameter.";
    }
    var listenerType = argObj.event;
    argObj.event = undefined;

    var listener = null;
    if(listenerType === cc.EventListener.TOUCH_ONE_BY_ONE) {
        listener = cc.EventListenerTouchOneByOne.create();
        if (argObj.swallowTouches) {
            listener.setSwallowTouches(argObj.swallowTouches);
        }
    }
    else if(listenerType === cc.EventListener.TOUCH_ALL_AT_ONCE)
        listener = cc.EventListenerTouchAllAtOnce.create();
    else if(listenerType === cc.EventListener.MOUSE)
        listener = cc.EventListenerMouse.create();
    else if(listenerType === cc.EventListener.CUSTOM){
        listener = cc.EventListenerCustom.create(argObj.eventName, argObj.callback);
        argObj.eventName = undefined;
        argObj.callback = undefined;
    } else if(listenerType === cc.EventListener.KEYBOARD)
        listener = cc.EventListenerKeyboard.create();
    else if(listenerType === cc.EventListener.ACCELERATION){
        listener = cc.EventListenerAcceleration.create(argObj.callback);
        argObj.callback = undefined;
    }else if(listenerType === cc.EventListener.FOCUS){
        listener = cc.EventListenerFocus.create();
    }
    else
    {
        cc.log("Error: Invalid listener type.");
    }

    for (var key in argObj) {
        // Temporary fix for EventMouse to support getDelta functions (doesn't exist in Cocos2d-x)
        if (key == "onMouseDown" || key == "onMouseMove")
            listener["_" + key] = argObj[key];
        else listener[key] = argObj[key];
    }

    return listener;
};


// Event manager
cc.eventManager.addListener = function(listener, nodeOrPriority) {
    if(!(listener instanceof cc.EventListener)) {
        listener = cc.EventListener.create(listener);
    }

    if (typeof nodeOrPriority === "number") {
        if (nodeOrPriority == 0) {
            cc.log("0 priority is forbidden for fixed priority since it's used for scene graph based priority.");
            return null;
        }

        cc.eventManager.addEventListenerWithFixedPriority(listener, nodeOrPriority);
    } else {
        cc.eventManager.addEventListenerWithSceneGraphPriority(listener, nodeOrPriority);
    }

    return listener;
};

cc.eventManager.dispatchCustomEvent = function (eventName, optionalUserData) {
    var ev = new cc.EventCustom(eventName);
    ev.setUserData(optionalUserData);
    this.dispatchEvent(ev);
};

cc.EventCustom.prototype.setUserData = function(userData) {
    this._userData = userData;
};

cc.EventCustom.prototype.getUserData = function() {
    return this._userData;
};

cc.inputManager = {
    setAccelerometerEnabled: cc.Device.setAccelerometerEnabled,
    setAccelerometerInterval: cc.Device.setAccelerometerInterval,
    getDPI: cc.Device.getDPI
};

cc.EventListenerTouchOneByOne.prototype.clone = function() {
    var ret = cc.EventListenerTouchOneByOne.create();
    ret.onTouchBegan = this.onTouchBegan;
    ret.onTouchMoved = this.onTouchMoved;
    ret.onTouchEnded = this.onTouchEnded;
    ret.onTouchCancelled = this.onTouchCancelled;
    ret.setSwallowTouches(this.isSwallowTouches());
    return ret;
};

cc.EventListenerTouchAllAtOnce.prototype.clone = function() {
    var ret = cc.EventListenerTouchAllAtOnce.create();
    ret.onTouchesBegan = this.onTouchesBegan;
    ret.onTouchesMoved = this.onTouchesMoved;
    ret.onTouchesEnded = this.onTouchesEnded;
    ret.onTouchesCancelled = this.onTouchesCancelled;
    return ret;
};

cc.EventListenerKeyboard.prototype.clone = function() {
    var ret = cc.EventListenerKeyboard.create();
    ret.onKeyPressed = this.onKeyPressed;
    ret.onKeyReleased = this.onKeyReleased;
    return ret;
};

cc.EventListenerFocus.prototype.clone = function() {
    var ret = cc.EventListenerFocus.create();
    ret.onFocusChanged = this.onFocusChanged;
    return ret;
};

cc.EventListenerMouse.prototype.clone = function() {
    var ret = cc.EventListenerMouse.create();
    ret._onMouseDown = this._onMouseDown;
    ret._onMouseMove = this._onMouseMove;
    ret.onMouseUp = this.onMouseUp;
    ret.onMouseScroll = this.onMouseScroll;
    return ret;
};
cc.EventListenerMouse.prototype.onMouseMove = function(event) {
    if (!this._onMouseMove)
        return;
    event._listener = this;
    this._onMouseMove(event);
    this._previousX = event.getLocationX();
    this._previousY = event.getLocationY();
};
cc.EventListenerMouse.prototype.onMouseDown = function(event) {
    if (!this._onMouseDown)
        return;
    event._listener = this;
    this._previousX = event.getLocationX();
    this._previousY = event.getLocationY();
    this._onMouseDown(event);
};

cc.EventListenerKeyboard.prototype._onKeyPressed = function(keyCode, event) {
    if (!this.onKeyPressed)
        return;
    this.onKeyPressed(jsbKeyArr[keyCode], event);
};

cc.EventListenerKeyboard.prototype._onKeyReleased = function(keyCode, event) {
    if (!this.onKeyReleased)
        return;
    this.onKeyReleased(jsbKeyArr[keyCode], event);
};

cc.EventMouse.prototype.getLocation = function(){
    return { x: this.getLocationX(), y: this.getLocationY() };
};

cc.EventMouse.prototype.getLocationInView = function() {
    return {x: this.getLocationX(), y: cc.view.getDesignResolutionSize().height - this.getLocationY()};
};

// Temporary fix for EventMouse to support getDelta functions (doesn't exist in Cocos2d-x)
cc.EventMouse.prototype.getDelta = function(){
    if (isNaN(this._listener._previousX)) {
        this._listener._previousX = this.getLocationX();
        this._listener._previousY = this.getLocationY();
    }
    return { x: this.getLocationX() - this._listener._previousX, y: this.getLocationY() - this._listener._previousY };
};

cc.EventMouse.prototype.getDeltaX = function(){
    if (isNaN(this._listener._previousX)) {
        this._listener._previousX = this.getLocationX();
        this._listener._previousY = this.getLocationY();
    }
    return this.getLocationX() - this._listener._previousX;
};

cc.EventMouse.prototype.getDeltaY = function(){
    if (isNaN(this._listener._previousX)) {
        this._listener._previousX = this.getLocationX();
        this._listener._previousY = this.getLocationY();
    }
    return this.getLocationY() - this._listener._previousY;
};

cc.Touch.prototype.getLocationX = function(){
    return this.getLocation().x;
};

cc.Touch.prototype.getLocationY = function(){
    return this.getLocation().y;
};

cc.visibleRect = {
    topLeft:cc.p(0,0),
    topRight:cc.p(0,0),
    top:cc.p(0,0),
    bottomLeft:cc.p(0,0),
    bottomRight:cc.p(0,0),
    bottom:cc.p(0,0),
    center:cc.p(0,0),
    left:cc.p(0,0),
    right:cc.p(0,0),
    width:0,
    height:0,

    init:function(){
        var origin = cc.director.getVisibleOrigin();
        var size = cc.director.getVisibleSize();
        var w = this.width = size.width;
        var h = this.height = size.height;
        var l = origin.x,
            b = origin.y,
            t = b + h,
            r = l + w;

        //top
        this.topLeft.x = l;
        this.topLeft.y = t;
        this.topRight.x = r;
        this.topRight.y = t;
        this.top.x = l + w/2;
        this.top.y = t;

        //bottom
        this.bottomLeft.x = l;
        this.bottomLeft.y = b;
        this.bottomRight.x = r;
        this.bottomRight.y = b;
        this.bottom.x = l + w/2;
        this.bottom.y = b;

        //center
        this.center.x = l + w/2;
        this.center.y = b + h/2;

        //left
        this.left.x = l;
        this.left.y = b + h/2;

        //right
        this.right.x = r;
        this.right.y = b + h/2;
    }
};
cc.visibleRect.init();

// Predefined font definition
cc.FontDefinition = function () {
    this.fontName = "Arial";
    this.fontSize = 12;
    this.textAlign = cc.TEXT_ALIGNMENT_CENTER;
    this.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
    this.fillStyle = cc.color(255, 255, 255, 255);
    this.boundingWidth = 0;
    this.boundingHeight = 0;

    this.strokeEnabled = false;
    this.strokeStyle = cc.color(255, 255, 255, 255);
    this.lineWidth = 1;

    this.shadowEnabled = false;
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 0;
    this.shadowBlur = 0;
    this.shadowOpacity = 1.0;
};


//
// DrawNode JS API Wrapper
//

cc.cardinalSplineAt = function (p0, p1, p2, p3, tension, t) {
    var t2 = t * t;
    var t3 = t2 * t;

    var s = (1 - tension) / 2;

    var b1 = s * ((-t3 + (2 * t2)) - t);                      // s(-t3 + 2 t2 - t)P1
    var b2 = s * (-t3 + t2) + (2 * t3 - 3 * t2 + 1);          // s(-t3 + t2)P2 + (2 t3 - 3 t2 + 1)P2
    var b3 = s * (t3 - 2 * t2 + t) + (-2 * t3 + 3 * t2);      // s(t3 - 2 t2 + t)P3 + (-2 t3 + 3 t2)P3
    var b4 = s * (t3 - t2);                                   // s(t3 - t2)P4

    var x = (p0.x * b1 + p1.x * b2 + p2.x * b3 + p3.x * b4);
    var y = (p0.y * b1 + p1.y * b2 + p2.y * b3 + p3.y * b4);
    return cc.p(x, y);
};

cc._DrawNode = cc.DrawNode;
cc._DrawNode.prototype.drawPoly = function (verts, fillColor, borderWidth, borderColor) {
    cc._DrawNode.prototype.drawPolygon.call(this, verts, verts.length, fillColor, borderWidth, borderColor);
}
cc.DrawNode = cc._DrawNode.extend({
    _drawColor: cc.color(255, 255, 255, 255),
    _lineWidth: 1,

    release: function () {},

    setLineWidth: function (width) {
        this._lineWidth = width;
    },

    getLineWidth: function () {
        return this._lineWidth;
    },

    setDrawColor: function(color) {
        var locDrawColor = this._drawColor;
        locDrawColor.r = color.r;
        locDrawColor.g = color.g;
        locDrawColor.b = color.b;
        locDrawColor.a = (color.a == null) ? 255 : color.a;
    },

    getDrawColor: function () {
        return  cc.color(this._drawColor.r, this._drawColor.g, this._drawColor.b, this._drawColor.a);
    },

    drawRect: function (origin, destination, fillColor, lineWidth, lineColor) {
        lineWidth = lineWidth || this._lineWidth;
        lineColor = lineColor || this._drawColor;
        var points = [origin, cc.p(origin.x, destination.y), destination, cc.p(destination.x, origin.y)];
        if (fillColor)
            cc._DrawNode.prototype.drawPoly.call(this, points, fillColor, lineWidth, lineColor);
        else {
            points.push(origin);
            var drawSeg = cc._DrawNode.prototype.drawSegment;
            for (var i = 0, len = points.length; i < len - 1; i++)
                drawSeg.call(this, points[i], points[i + 1], lineWidth, lineColor);
        }
    },

    drawCircle: function (center, radius, angle, segments, drawLineToCenter, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this._drawColor;
        if (color.a == null)
            color.a = 255;
        var coef = 2.0 * Math.PI / segments, vertices = [], i, len;
        for (i = 0; i <= segments; i++) {
            var rads = i * coef;
            var j = radius * Math.cos(rads + angle) + center.x;
            var k = radius * Math.sin(rads + angle) + center.y;
            vertices.push(cc.p(j, k));
        }
        if (drawLineToCenter)
            vertices.push(cc.p(center.x, center.y));

        lineWidth *= 0.5;
        var drawSeg = cc._DrawNode.prototype.drawSegment;
        for (i = 0, len = vertices.length; i < len - 1; i++)
            drawSeg.call(this, vertices[i], vertices[i + 1], lineWidth, color);
    },

    drawQuadBezier: function (origin, control, destination, segments, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this._drawColor;
        cc._DrawNode.prototype.drawQuadBezier.call(this, origin, control, destination, segments, color);
    },

    drawCubicBezier: function (origin, control1, control2, destination, segments, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this._drawColor;
        cc._DrawNode.prototype.drawCubicBezier.call(this, origin, control1, control2, destination, segments, color);
    },

    drawCatmullRom: function (points, segments, lineWidth, color) {
        this.drawCardinalSpline(points, 0.5, segments, lineWidth, color);
    },

    drawCardinalSpline: function (config, tension, segments, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this._drawColor;
        if (color.a == null)
            color.a = 255;
        var vertices = [], p, lt, deltaT = 1.0 / config.length, m1len = config.length - 1;

        for (var i = 0; i < segments + 1; i++) {
            var dt = i / segments;

            // border
            if (dt == 1) {
                p = m1len;
                lt = 1;
            } else {
                p = 0 | (dt / deltaT);
                lt = (dt - deltaT * p) / deltaT;
            }

            // Interpolate
            var newPos = cc.cardinalSplineAt(
                config[Math.min(m1len, Math.max(p - 1, 0))],
                config[Math.min(m1len, Math.max(p + 0, 0))],
                config[Math.min(m1len, Math.max(p + 1, 0))],
                config[Math.min(m1len, Math.max(p + 2, 0))],
                tension, lt);
            vertices.push(newPos);
        }

        lineWidth *= 0.5;
        var drawSeg = cc._DrawNode.prototype.drawSegment;
        for (var j = 0, len = vertices.length; j < len - 1; j++)
            drawSeg.call(this, vertices[j], vertices[j + 1], lineWidth, color);
    },

    drawDot:function (pos, radius, color) {
        color = color || this._drawColor;
        cc._DrawNode.prototype.drawDot.call(this, pos, radius, color);
    },

    drawSegment:function (from, to, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this._drawColor;

        cc._DrawNode.prototype.drawSegment.call(this, from, to, lineWidth, color);
    },

    drawPoly:function (verts, fillColor, borderWidth, borderColor) {
        borderColor = borderColor || this._drawColor;
        if (fillColor)
            cc._DrawNode.prototype.drawPoly.call(this, verts, fillColor, borderWidth, borderColor);
        else {
            verts.push(verts[0]);
            var drawSeg = cc._DrawNode.prototype.drawSegment;
            for (var i = 0, len = verts.length; i < len - 1; i++)
                drawSeg.call(this, verts[i], verts[i + 1], borderWidth, borderColor);
        }
    }
});
cc.DrawNode.create = function () {
    return new cc.DrawNode();
};


//
// TMX classes JS API Wrapper
//

cc.TMXTiledMap.prototype.allLayers = function(){
    var retArr = [],
        locChildren = this.getChildren(),
        length = locChildren.length;
    for(var i = 0; i< length; i++){
        var layer = locChildren[i];
        if(layer && layer instanceof cc.TMXLayer) {
            jsb.registerNativeRef(this, layer);
            retArr.push(layer);
        }
    }
    return retArr;
};

cc.TMXTiledMap.prototype._getLayer = cc.TMXTiledMap.prototype.getLayer;
cc.TMXTiledMap.prototype.getLayer = function(layerName) {
    var ret = this._getLayer(layerName);
    jsb.registerNativeRef(this, ret);
    return ret;
};

cc.TMXTiledMap.prototype._getObjectGroup = cc.TMXTiledMap.prototype.getObjectGroup;
cc.TMXTiledMap.prototype.getObjectGroup = function(groupName) {
    var ret = this._getObjectGroup(groupName);
    jsb.registerNativeRef(this, ret);
    return ret;
};

cc.TMXTiledMap.prototype._getObjectGroups = cc.TMXTiledMap.prototype.getObjectGroups;
cc.TMXTiledMap.prototype.getObjectGroups = function() {
    var ret = this._getObjectGroups();
    if (ret && ret instanceof Array) {
        for (var i = 0, len = ret.length; i < len; ++i) {
            jsb.registerNativeRef(this, ret[i]);
        }
    }
    return ret;
};

cc.TMXLayer.prototype._getTileAt = cc.TMXLayer.prototype.getTileAt;
cc.TMXLayer.prototype.getTileAt = function(x, y){
    var pos = y !== undefined ? cc.p(x, y) : x;
    var ret = this._getTileAt(pos);
    jsb.registerNativeRef(this, ret);
    return ret;
};
cc.TMXLayer.prototype._getTileGIDAt = cc.TMXLayer.prototype.getTileGIDAt;
cc.TMXLayer.prototype.getTileGIDAt = function(x, y){
    var pos = y !== undefined ? cc.p(x, y) : x;
    return this._getTileGIDAt(pos);
};
cc.TMXLayer.prototype._setTileGID = cc.TMXLayer.prototype.setTileGID;
cc.TMXLayer.prototype.setTileGID = function(gid, posOrX, flagsOrY, flags){
    var pos;
    if (flags !== undefined) {
        pos = cc.p(posOrX, flagsOrY);
        this._setTileGID(gid, pos, flags);
    } else if(flagsOrY != undefined){
        pos = posOrX;
        flags = flagsOrY;
        this._setTileGID(gid, pos, flags);
    } else {
        this._setTileGID(gid, posOrX);
    }
};
cc.TMXLayer.prototype._removeTileAt = cc.TMXLayer.prototype.removeTileAt;
cc.TMXLayer.prototype.removeTileAt = function(x, y){
    var pos = y !== undefined ? cc.p(x, y) : x;
    this._removeTileAt(pos);
};
cc.TMXLayer.prototype._getPositionAt = cc.TMXLayer.prototype.getPositonAt;
cc.TMXLayer.prototype.getPositonAt = function(x, y){
    var pos = y !== undefined ? cc.p(x, y) : x;
    return this._getPositionAt(pos);
};

cc.TMXLayer.prototype.tileFlagsAt = cc.TMXLayer.prototype.getTileFlagsAt;

cc.TMXObjectGroup.prototype._getObject = cc.TMXObjectGroup.prototype.getObject;
cc.TMXObjectGroup.prototype.getObject = function(objectName) {
    var ret = this._getObject(objectName);
    jsb.registerNativeRef(this, ret);
    return ret;
};

cc.TMXObjectGroup.prototype._getObjects = cc.TMXObjectGroup.prototype.getObjects;
cc.TMXObjectGroup.prototype.getObjects = function() {
    var ret = this._getObjects();
    if (ret && ret instanceof Array) {
        for (var i = 0, len = ret.length; i < len; ++i) {
            jsb.registerNativeRef(this, ret[i]);
        }
    }
    return ret;
};

cc.TMXObject.prototype._getNode = cc.TMXObject.prototype.getNode;
cc.TMXObject.prototype.getNode = function() {
    var ret = this._getNode();
    jsb.registerNativeRef(this, ret);
    return ret;
};

//
// setBlendFunc JS API Wrapper
//

var protoHasBlend = [cc.AtlasNode.prototype,
                     cc.DrawNode.prototype,
                     cc.LabelTTF.prototype,
                     cc.SpriteBatchNode.prototype,
                     cc.LayerColor.prototype,
                     cc.MotionStreak.prototype,
                     cc.Sprite.prototype,
                     cc.ParticleBatchNode.prototype,
                     cc.ParticleSystem.prototype];

var templateSetBlendFunc = function(src, dst) {
    var blendf;
    if (dst === undefined)
        blendf = src;
    else
        blendf = {src: src, dst: dst};
    this._setBlendFunc(blendf);
};
for (var i = 0, l = protoHasBlend.length; i < l; i++) {
    var _proto = protoHasBlend[i];
    _proto._setBlendFunc = _proto.setBlendFunc;
    _proto.setBlendFunc = templateSetBlendFunc;
}


//
// Ease actions JS API Wrapper
//

var easeActions = {
    easeIn : 0,
    easeOut : 1,
    easeInOut : 2,
    easeExponentialIn : 3,
    easeExponentialOut : 4,
    easeExponentialInOut : 5,
    easeSineIn : 6,
    easeSineOut : 7,
    easeSineInOut : 8,
    easeElasticIn : 9,
    easeElasticOut : 10,
    easeElasticInOut : 11,
    easeBounceIn : 12,
    easeBounceOut : 13,
    easeBounceInOut : 14,
    easeBackIn : 15,
    easeBackOut : 16,
    easeBackInOut : 17,

    easeBezierAction : 18,
    easeQuadraticActionIn : 19,
    easeQuadraticActionOut : 20,
    easeQuadraticActionInOut : 21,
    easeQuarticActionIn : 22,
    easeQuarticActionOut : 23,
    easeQuarticActionInOut : 24,
    easeQuinticActionIn : 25,
    easeQuinticActionOut : 26,
    easeQuinticActionInOut : 27,
    easeCircleActionIn : 28,
    easeCircleActionOut : 29,
    easeCircleActionInOut : 30,
    easeCubicActionIn : 31,
    easeCubicActionOut : 32,
    easeCubicActionInOut : 33
};

function templateEaseActions(actionTag) {
    return function(param, param2, param3, param4) {
        return {tag: actionTag, param: param, param2: param2, param3: param3, param4: param4};
    }
}

for (var a in easeActions) {
    var actionTag = easeActions[a];
    cc[a] = templateEaseActions(actionTag);
}

// Action2d
cc.action = cc.Action.create;
cc.cardinalSplineTo = cc.CardinalSplineTo.create;
cc.cardinalSplineBy = cc.CardinalSplineBy.create;
cc.catmullRomTo = cc.CatmullRomTo.create;
cc.catmullRomBy = cc.CatmullRomBy.create;
cc.show = cc.Show.create;
cc.hide = cc.Hide.create;
cc.toggleVisibility = cc.ToggleVisibility.create;
cc.removeSelf = cc.RemoveSelf.create;
cc.flipX = cc.FlipX.create;
cc.flipY = cc.FlipY.create;
cc.callFunc = function (selector, target, data) {
    var callback = selector;
    if (data !== undefined) {
        callback = function (sender) {
            selector.call(this, sender, data);
        };
    }
    if (target !== undefined) {
        cc.CallFunc.create(callback);
    }
    else {
        cc.CallFunc.create(callback, target);
    }
}
cc.actionInterval = cc.ActionInterval.create;
cc.rotateTo = cc.RotateTo.create;
cc.rotateBy = cc.RotateBy.create;
cc.skewTo = cc.SkewTo.create;
cc.skewBy = cc.SkewBy.create;
cc.bezierBy = cc.BezierBy.create;
cc.bezierTo = cc.BezierTo.create;
cc.scaleTo = cc.ScaleTo.create;
cc.scaleBy = cc.ScaleBy.create;
cc.blink = cc.Blink.create;
cc.fadeTo = cc.FadeTo.create;
cc.fadeIn = cc.FadeIn.create;
cc.fadeOut = cc.FadeOut.create;
cc.tintTo = cc.TintTo.create;
cc.tintBy = cc.TintBy.create;
cc.delayTime = cc.DelayTime.create;
cc.reverseTime = cc.ReverseTime.create;

cc.Place._create = cc.Place.create;
cc.place = cc.Place.create = function(posOrX, y){
    if (undefined === y){
        return cc.Place._create(posOrX);
    }else{
        return cc.Place._create(cc.p(posOrX, y));
    }
};
cc.MoveTo._create = cc.MoveTo.create;
cc.moveTo = cc.MoveTo.create = function(duration, posOrX, y){
    if (undefined === y){
        return cc.MoveTo._create(duration, posOrX);
    }else{
        return cc.MoveTo._create(duration, cc.p(posOrX, y));
    }
};
cc.MoveBy._create = cc.MoveBy.create;
cc.moveBy = cc.MoveBy.create = function(duration, posOrX, y){
    if (undefined === y){
        return cc.MoveBy._create(duration, posOrX);
    }else{
        return cc.MoveBy._create(duration, cc.p(posOrX, y));
    }
};
cc.JumpTo._create = cc.JumpTo.create;
cc.jumpTo = cc.JumpTo.create = function(duration, position, y, height, jumps){
    if (undefined === jumps){
        jumps = height;
        height = y;
        return cc.JumpTo._create(duration, position, height, jumps);
    }else{
        return cc.JumpTo._create(duration, cc.p(position, y), height, jumps);
    }
};
cc.JumpBy._create = cc.JumpBy.create;
cc.jumpBy = cc.JumpBy.create = function(duration, position, y, height, jumps){
    if (undefined === jumps){
        jumps = height;
        height = y;
        return cc.JumpBy._create(duration, position, height, jumps);
    }else{
        return cc.JumpBy._create(duration, cc.p(position, y), height, jumps);
    }
};

// Speed functions
cc.Speed.prototype.speed = cc.ActionInterval.prototype.speed = function(speed) {
//    if (speed < 0) {
//        cc.warn("cc.ActionInterval#speed : Speed must not be negative");
//        return;
//    }
    var action = this, found = false;
    while (action.getInnerAction && !found) {
        if (action instanceof cc.Speed) {
            found = true;
        }
        else {
            action = action.getInnerAction();
        }
    }
    if (found) {
        speed = speed * action._getSpeed();
        action._setSpeed(speed);
    }
    else {
        this._speed(speed);
    }
    return this;
};
cc.Speed.prototype.setSpeed = cc.ActionInterval.prototype.setSpeed = function(speed) {
//    if (speed < 0) {
//        cc.warn("cc.ActionInterval#setSpeed : Speed must not be negative");
//        return;
//    }
    var action = this, found = false;
    while (action.getInnerAction && !found) {
        if (action instanceof cc.Speed) {
            found = true;
        }
        else {
            action = action.getInnerAction();
        }
    }
    if (found) {
        action._setSpeed(speed);
    }
    else {
        this._speed(speed);
    }
};
cc.Speed.prototype.getSpeed = cc.ActionInterval.prototype.getSpeed = function() {
    var action = this, found = false;
    while (action.getInnerAction && !found) {
        if (action instanceof cc.Speed) {
            found = true;
        }
        else {
            action = action.getInnerAction();
        }
    }
    if (found) {
        return action._getSpeed();
    }
    else {
        return 1;
    }
};


//
// Node API
//
cc.Node.prototype.setUserData = function (data) {
    this.userData = data;
};
cc.Node.prototype.getUserData = function () {
    return this.userData;
};

//for compatibility with html5
cc.Node.prototype.ignoreAnchorPointForPosition = cc.Node.prototype.setIgnoreAnchorPointForPosition;

cc.Node.prototype._setNormalizedPosition = cc.Node.prototype.setNormalizedPosition;
cc.Node.prototype.setNormalizedPosition = function(pos, y){
    if(y === undefined)
        cc.Node.prototype._setNormalizedPosition.call(this, pos);
    else
        cc.Node.prototype._setNormalizedPosition.call(this, cc.p(pos, y));
};

/** returns a "world" axis aligned bounding box of the node. <br/>
 * @return {cc.Rect}
 */
cc.Node.prototype.getBoundingBoxToWorld = function () {
    var contentSize = this.getContentSize();
    var rect = cc.rect(0, 0, contentSize.width, contentSize.height);
    var trans = this.getNodeToWorldTransform();
    rect = cc.rectApplyAffineTransform(rect, trans);

    //query child's BoundingBox
    if (!this.getChildren())
        return rect;

    var locChildren = this.getChildren();
    for (var i = 0; i < locChildren.length; i++) {
        var child = locChildren[i];
        if (child && child.isVisible()) {
            var childRect = child._getBoundingBoxToCurrentNode(trans);
            if (childRect)
                rect = cc.rectUnion(rect, childRect);
        }
    }
    return rect;
};

cc.Node.prototype._getBoundingBoxToCurrentNode = function (parentTransform) {
    var contentSize = this.getContentSize();
    var rect = cc.rect(0, 0, contentSize.width, contentSize.height);
    var _trans = this.getNodeToParentTransform();
    var trans = (parentTransform == null) ? _trans : cc.affineTransformConcat(_trans, parentTransform);
    rect = cc.rectApplyAffineTransform(rect, trans);

    //query child's BoundingBox
    if (!this.getChildren())
        return rect;

    var locChildren = this.getChildren();
    for (var i = 0; i < locChildren.length; i++) {
        var child = locChildren[i];
        if (child && child.isVisible()) {
            var childRect = child._getBoundingBoxToCurrentNode(trans);
            if (childRect)
                rect = cc.rectUnion(rect, childRect);
        }
    }
    return rect;
};

//
// cc.Layer bake/unbake/isBaked
//
cc.Layer.prototype.bake = cc.Layer.prototype.unbake = function() {};
cc.Layer.prototype.isBaked = function() {return false;};


//
// RenderTexture beginWithClear
//
cc.RenderTexture.prototype._beginWithClear = cc.RenderTexture.prototype.beginWithClear;
cc.RenderTexture.prototype.beginWithClear = function(r, g, b, a, depthValue, stencilValue) {
    r /= 255;
    g /= 255;
    b /= 255;
    a /= 255;
    this._beginWithClear(r, g, b, a, depthValue, stencilValue);
};


//
// Texture2D setTexParameters
//
cc.Texture2D.prototype._setTexParameters = cc.Texture2D.prototype.setTexParameters;
cc.Texture2D.prototype.setTexParameters = function (texParams, magFilter, wrapS, wrapT) {
    var minFilter;
    if (magFilter === undefined) {
        minFilter = texParams.minFilter;
        magFilter = texParams.magFilter;
        wrapS = texParams.wrapS;
        wrapT = texParams.wrapT;
    }
    else minFilter = texParams;

    this._setTexParameters(minFilter, magFilter, wrapS, wrapT);
};

cc.Texture2D.prototype.handleLoadedTexture = function (premultiplied) {};


//
// Label overflow
//
cc.Label.Overflow = {
    NONE: 0,
    CLAMP: 1,
    SHRINK: 2,
    RESIZE_HEIGHT: 3
};
//
// Label adaptation to LabelTTF/LabelBMFont/LabelAtlas
//
_p = cc.Label.prototype;
_p.enableStroke = _p.enableOutline;
_p.setBoundingWidth = _p.setWidth;
_p.setBoundingHeight = _p.setHeight;

//
// cc.BlendFunc
//
/**
 * Blend Function used for textures
 * @Class cc.BlendFunc
 * @Constructor
 * @param {Number} src1 source blend function
 * @param {Number} dst1 destination blend function
 */
cc.BlendFunc = function (src1, dst1) {
    this.src = src1;
    this.dst = dst1;
};

cc.BlendFunc._disable = function(){
    return new cc.BlendFunc(cc.ONE, cc.ZERO);
};
cc.BlendFunc._alphaPremultiplied = function(){
    return new cc.BlendFunc(cc.ONE, cc.ONE_MINUS_SRC_ALPHA);
};
cc.BlendFunc._alphaNonPremultiplied = function(){
    return new cc.BlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA);
};
cc.BlendFunc._additive = function(){
    return new cc.BlendFunc(cc.SRC_ALPHA, cc.ONE);
};

/** @expose */
cc.BlendFunc.DISABLE;
cc.defineGetterSetter(cc.BlendFunc, "DISABLE", cc.BlendFunc._disable);
/** @expose */
cc.BlendFunc.ALPHA_PREMULTIPLIED;
cc.defineGetterSetter(cc.BlendFunc, "ALPHA_PREMULTIPLIED", cc.BlendFunc._alphaPremultiplied);
/** @expose */
cc.BlendFunc.ALPHA_NON_PREMULTIPLIED;
cc.defineGetterSetter(cc.BlendFunc, "ALPHA_NON_PREMULTIPLIED", cc.BlendFunc._alphaNonPremultiplied);
/** @expose */
cc.BlendFunc.ADDITIVE;
cc.defineGetterSetter(cc.BlendFunc, "ADDITIVE", cc.BlendFunc._additive);

cc.GLProgram.prototype.setUniformLocationWithMatrix2fv = function(){
    var tempArray = Array.prototype.slice.call(arguments);
    tempArray.push(2);
    this.setUniformLocationWithMatrixfvUnion.apply(this, tempArray);
};

cc.GLProgram.prototype.setUniformLocationWithMatrix3fv = function(){
    var tempArray = Array.prototype.slice.call(arguments);
    tempArray.push(3);
    this.setUniformLocationWithMatrixfvUnion.apply(this, tempArray);
};
cc.GLProgram.prototype.setUniformLocationWithMatrix4fv = function(){
    var tempArray = Array.prototype.slice.call(arguments);
    tempArray.push(4);
    this.setUniformLocationWithMatrixfvUnion.apply(this, tempArray);
};

// Hack for the lifecycle of JS objects
cc.Director.prototype._jsb_getScheduler = cc.Director.prototype.getScheduler;
cc.Director.prototype.getScheduler = function() {
    var scheduler = this._jsb_getScheduler();
    if (this._jsb_scheduler != scheduler)
    {
        this._jsb_scheduler = scheduler;
    }
    return scheduler;
}

cc.Director.prototype._jsb_getActionManager = cc.Director.prototype.getActionManager;
cc.Director.prototype.getActionManager = function() {
    var actionManager = this._jsb_getActionManager();
    if (this._jsb_actionManager != actionManager)
    {
        this._jsb_actionManager = actionManager;
    }
    return actionManager;
}

cc.Director.prototype._jsb_getEventDispatcher = cc.Director.prototype.getEventDispatcher;
cc.Director.prototype.getEventDispatcher = function() {
    var eventDispatcher = this._jsb_getEventDispatcher();
    if (this._jsb_eventDispatcher != eventDispatcher)
    {
        this._jsb_eventDispatcher = eventDispatcher;
    }
    return eventDispatcher;
}

cc.SpriteFrame.prototype._jsb_getTexture = cc.SpriteFrame.prototype.getTexture;
cc.SpriteFrame.prototype.getTexture = function() {
    var texture = this._jsb_getTexture();
    if (this._jsb_texture != texture)
    {
        this._jsb_texture = texture;
    }
    return texture;
}

cc.Sprite.prototype._jsb_getTexture = cc.Sprite.prototype.getTexture;
cc.Sprite.prototype.getTexture = function() {
    var texture = this._jsb_getTexture();
    if (this._jsb_texture != texture)
    {
        this._jsb_texture = texture;
    }
    return texture;
}

//

