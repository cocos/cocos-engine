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

var ProjectionType = cc.Enum({
    Perspective: 0,
    Orthographic: 1,
});

var Camera = cc.Class({
    name: 'cc.Camera',
    extends: Component,

    editor: CC_EDITOR && {
        executeInEditMode: true,
        menu: 'i18n:MAIN_MENU.component.renderers/Camera',
    },
    properties: {
        _clearColor: cc.color(128,128,128,255),
        _projection: 0, //default is perspective
        _near: 1,
        _far: 1000,
        _fov: 45, //for perspective
        _orthoHeight: 100, //for orthographic

        clearColor: {
            get: function() {
                return this._clearColor;
            },
            set: function(value) {
                var color = this.camera._clearOptions.color;
                this._clearColor.r = value.r;
                this._clearColor.g = value.g;
                this._clearColor.b = value.b;
                this._clearColor.a = value.a;
                color[0] = value.r/255;
                color[1] = value.g/255;
                color[2] = value.b/255;
                color[3] = value.a/255;
            },
            type: cc.Color,
        },

        projection: {
            get: function () {
                return this._projection;
            },
            set: function(value) {
                this._projection = value;
                this.camera.setProjection(value);
            },
            type: ProjectionType
        },

        near: {
            get: function() {
                return this._near;
            },
            set: function(value) {
                this._near = value;
                this.camera.setNearClip(value);
            }
        },

        far: {
            get: function() {
                return this._far;
            },
            set: function(value) {
                this._far = value;
                this.camera.setFarClip(value);
            }
        },

        fov: {
            get: function() {
                return this._fov;
            },
            set: function(value) {
                this._fov = value;
                this.camera.setFov(value);
            }
        },
        orthoHeight: {
            get: function() {
                return this._orthoHeight;
            },
            set: function(value) {
                this._orthoHeight = value;
                this.camera.setOrthoHeight(value);
            }
        },
    },
    ctor: function () {
        this.camera = new cc3d.Camera();
    },

    start: function() {
    },
    onEnable: (!CC_EDITOR) && function() {
        var camera = this.camera;
        camera._node = this.node._sgNode;
        var scene = cc.director.getScene();
        scene._sgScene.addCamera(camera);
    },
    onDisable: (!CC_EDITOR) && function() {
        var scene = cc.director.getScene();
        scene._sgScene.removeCamera(this.camera);
    },
    onDestroy: function() {

    },
    onFocusInEditor: function() {

    },
    onLostFocusInEditor: function() {

    },

    __preload: function () {
        var color = this.camera._clearOptions.color;
        color[0] = this._clearColor.r/255;
        color[1] = this._clearColor.g/255;
        color[2] = this._clearColor.b/255;
        color[3] = this._clearColor.a/255;
        this.camera.setProjection(this._projection);
        this.camera.setNearClip(this._near);
        this.camera.setFarClip(this._far);
        this.camera.setFov(this._fov);
        this.camera.setOrthoHeight(this._orthoHeight);
    }

});

cc.Camera = module.exports = Camera;
