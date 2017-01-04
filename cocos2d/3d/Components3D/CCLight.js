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

var Component = require('../../core/components/CCComponent');

var LightType = cc.Enum({
    Directional: 0,
    Point: 1,
    Spot: 2,
});

var FallOffMode = cc.Enum({
    Linear: 0,
    InverseSquare: 1,
});
var Light = cc.Class({
    name: 'cc.Light',
    extends: Component,

    editor: CC_EDITOR && {
        executeInEditMode: true,
        menu: 'i18n:MAIN_MENU.component.renderers/Light',
    },
    properties: {
        _type: 0,
        _color: cc.color(255,255,255,255),
        _range: 50, //for point and spot
        _falloffMode: 0, //for point and spot
        _innerAngle: 45, //for spot
        _outterAngle: 60, //for spot

        type: {
            get: function() {
                return this._type;
            },
            set: function(value) {
                this._type = value;
                this.light.setType(value);
            },
            type: LightType
        },
        color: {
            get: function() {
                return this._color;
            },
            set: function(value) {
                var color = this._color;
                color.r = value.r;
                color.g = value.g;
                color.b = value.b;
                this.light.setColor(color.r/255, color.g/255, color.b/255);
            }
        },

        range: {
            get: function() {
                return this._range;
            },
            set: function(value) {
                this._range = value;
                this.light.setAttenuationEnd(value);
                this.light.setAttenuationStart(value*0.5);
            },
        },

        fallOffMode: {
            get: function() {
                return this._falloffMode;
            },
            set: function(value) {
                this._falloffMode = value;
                this.light.setFalloffMode(value);
            },
            type: FallOffMode
        },
        innerAngle: {
            get: function() {
                return this._innerAngle;
            },
            set: function(value) {
                this._innerAngle = value;
                this.light.setInnerConeAngle(value);
            },
        },
        outterAngle: {
            get: function() {
                return this._outterAngle;
            },
            set: function(value) {
                this._outterAngle = value;
                this.light.setOuterConeAngle(value);
            },
        }
    },

    ctor: function () {
        var light = new cc3d.Light();
        light.setColor(0.8,0.0,0.6);
        light.setEnabled(true);
        this.light = light;
    },

    start: function() {
    },
    onEnable: function() {
        var scene = cc.director.getScene();
        var light = this.light;
        light._node = this.node._sgNode;
        scene._sgScene.addLight(this.light);
    },
    onDisable: function() {
        var scene = cc.director.getScene();
        scene._sgScene.removeLight(this.light);
    },
    onDestroy: function() {

    },
    onFocusInEditor: function() {

    },
    onLostFocusInEditor: function() {

    },
    __preload: function () {
        var light = this.light;
        light.setType(this._type);
        var color = this._color;
        light.setColor(color.r/255, color.g/255, color.b/255);
        light.setAttenuationEnd(this._range);
        light.setAttenuationStart(this._range*0.5);
        light.setFalloffMode(this._falloffMode);
        light.setInnerConeAngle(this._innerAngle);
        light.setOuterConeAngle(this._outterAngle);
    }

});

cc.Light = module.exports = Light;
