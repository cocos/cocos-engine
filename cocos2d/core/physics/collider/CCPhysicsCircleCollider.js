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

var CC_PTM_RATIO = cc.PhysicsManager.CC_PTM_RATIO;

var PhysicsCircleCollider = cc.Class({
    name: 'cc.PhysicsCircleCollider',
    extends: cc.CircleCollider,
    mixins: [cc.PhysicsCollider],

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.physics/Collider/Circle',
    },

    properties: cc.PhysicsCollider.properties,

    _createShape: function (scale) {
        var shape = new b2.CircleShape();
        shape.m_radius = this.radius / CC_PTM_RATIO * scale.x;
        return shape;
    }
});

cc.PhysicsCircleCollider = module.exports = PhysicsCircleCollider;
