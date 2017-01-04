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

var Animation3D = cc.Class({
    name: 'cc.Animation3D',
    extends: Component,

    editor: CC_EDITOR && {
        executeInEditMode: true,
        menu: 'i18n:MAIN_MENU.component.renderers/Animation3D',
    },
    properties: {
        animations: {
            default: [],
            type: cc.AnimationRes3D,
        },
    },

    ctor: function () {
        this._model = null;
        this._animationDirty = true;
        this._animationIndex = -1;
    },
    start: function() {
        this.playAnimation(0, 0);
    },
    onEnable: function() {
        this.playAnimation(0, 0);
    },
    onDisable: function() {
        this.stopAnimation();
    },
    onDestroy: function() {

    },
    playAnimation: function(index, blendTime) {
        this._animationIndex = index;
        this.onAnimationDirty();
    },
    onAnimationDirty: function() {
        this._animationDirty = true;
    },
    _applyAnimation: function(model) {
        if(this._animationDirty) {
            var animationIndex = this._animationIndex;
            if(animationIndex >= 0 && model && model._skeleton && this.animations[animationIndex]) {
                this._animationDirty = false;
                model._skeleton.setAnimation(this.animations[animationIndex]._animation);
                model._skeleton.currentTime = 0;
            }
        }
    },
    stopAnimation: function() {
        this._animationIndex = -1;
        var model = this.node.getComponent('cc.Model');
        if(model && model._skeleton) {
            model._skeleton.setAnimation(null);
            model._skeleton.currentTime = 0;
        }
    },
    onFocusInEditor: function() {

    },
    update: function(dt) {
        var model = this.node.getComponent('cc.Model');
        this._applyAnimation(model);
        if(model && model._skeleton) {
            model._skeleton.addTime(dt * 1000);
            model._skeleton.updateGraph();
        }
    },
    onLostFocusInEditor: function() {

    },
    __preload: function () {
    }

});

cc.Animation3D = module.exports = Animation3D;
