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

'use strict';

(function (window, BaseTestLayer) {

var backHandler = function () {
    var scene = new _ccsg.Scene();
    var layer = new TestController();
    scene.addChild(layer);
    cc.director.runScene(scene);
};

var createEntity = function (file, x, y) {
    var node = new cc.Node(file);
    if (file) {
        var tex = cc.textureCache.getTextureForKey(file);
        var spriteFrame = new cc.SpriteFrame(tex, cc.rect(0, 0, tex.getPixelWidth(), tex.getPixelHeight()));
        var spriteRenderer = node.addComponent(cc.Sprite);
        spriteRenderer.spriteFrame = spriteFrame;
    }
    node.x = x;
    node.y = y;
    return node;
};

var TouchEventTest = ECSTestLayer.extend({
    _title: 'Node Event Test',
    _subtitle: 'Grossini can be touched',

    ctor:function() {
        this._super(cc.color(0,0,0,255), cc.color(98,99,117,255), backHandler, NodeEventTestFlow);

        this._label = new cc.LabelTTF('', 'Arial', 20);
        this._label.x = cc.winSize.width/2;
        this._label.y = 150;
        this.addChild(this._label);

        this._node = null;
    },

    onEnter: function () {
        this._super();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            owner: this,
            onTouchBegan: function () {
                var layer = this.owner;
                layer._label.string = 'Touch outside';
                return true;
            }
        }, this);

        this._node = createEntity(s_pathGrossini, cc.winSize.width/2, cc.winSize.height/2);
        cc.director.getScene().addChild(this._node);

        this._node.on(cc.Node.EventType.TOUCH_START, function () {
            this._label.string = 'Touch start - Grossini';
        }, this);
        this._node.on(cc.Node.EventType.TOUCH_MOVE, function () {
            this._label.string = 'Touch move - Grossini';
        }, this);
        this._node.on(cc.Node.EventType.TOUCH_END, function () {
            this._label.string = 'Touch end - Grossini';
        }, this);
    }
});

var MouseEventTest = ECSTestLayer.extend({
    _title: 'Node Event Test',
    _subtitle: 'Grossini can interact with mouse',

    ctor: function() {
        this._super(cc.color(0,0,0,255), cc.color(98,99,117,255), backHandler, NodeEventTestFlow);
        this._label = new cc.LabelTTF('', 'Arial', 20);
        this._label.x = cc.winSize.width/2;
        this._label.y = 150;
        this.addChild(this._label);
    },
    onEnter: function () {
        this._super();

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            owner: this,
            onMouseDown: function () {
                var layer = this.owner;
                layer._label.string = 'Mouse down - outside';
            },
            onMouseMove: function () {
                var layer = this.owner;
                layer._label.string = 'Mouse move - outside';
            },
            onMouseUp: function () {
                var layer = this.owner;
                layer._label.string = 'Mouse up - outside';
            }
        }, this);

        var node = createEntity(s_pathGrossini, cc.winSize.width/2, cc.winSize.height/2);
        cc.director.getScene().addChild(node);

        node.on(cc.Node.EventType.MOUSE_DOWN, function () {
            this._label.string = 'Mouse down - Grossini';
        }, this);
        node.on(cc.Node.EventType.MOUSE_MOVE, function () {
            this._label.string = 'Mouse move - Grossini';
        }, this);
        node.on(cc.Node.EventType.MOUSE_UP, function () {
            this._label.string = 'Mouse up - Grossini';
        }, this);
    }
});

var PropagationTest = ECSTestLayer.extend({
    _title: 'Node Event Test',
    _subtitle: 'Enable or disable propagation to see difference',

    ctor: function () {
        this._super(cc.color(0,0,0,255), cc.color(98,99,117,255), backHandler, NodeEventTestFlow);
        this.propagate = true;
    },
    onEnter: function () {
        this._super();

        var node = createEntity('Images/CyanSquare.png', cc.winSize.width/2, cc.winSize.height/2);
        cc.director.getScene().addChild(node);

        var self = this;
        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.opacity = 180;
            if (self.propagate)
                event.stopPropagation();
        }, node);
        node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var delta = event.touch.getDelta();
            this.x += delta.x;
            this.y += delta.y;
            if (self.propagate)
                event.stopPropagation();
        }, node);
        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.opacity = 255;
            if (self.propagate)
                event.stopPropagation();
        }, node);

        var magenta = createEntity('Images/MagentaSquare.png', 50, -50);
        node.addChild(magenta);

        magenta.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.opacity = 180;
            if (self.propagate)
                event.stopPropagation();
        }, magenta);
        magenta.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var delta = event.touch.getDelta();
            this.x += delta.x;
            this.y += delta.y;
            if (self.propagate)
                event.stopPropagation();
        }, magenta);
        magenta.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.opacity = 255;
            if (self.propagate)
                event.stopPropagation();
        }, magenta);

        var yellow = createEntity('Images/YellowSquare.png', 50, 80);
        magenta.addChild(yellow);

        yellow.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.opacity = 180;
            if (self.propagate)
                event.stopPropagation();
        }, yellow);
        yellow.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var delta = event.touch.getDelta();
            this.x += delta.x;
            this.y += delta.y;
            if (self.propagate)
                event.stopPropagation();
        }, yellow);
        yellow.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.opacity = 255;
            if (self.propagate)
                event.stopPropagation();
        }, yellow);

        var propagateItem = new cc.MenuItemFont('Propagation OFF', function() {
            self.propagate = !self.propagate;
            propagateItem.string = self.propagate ? 'Propagation OFF' : 'Propagation ON';
        });

        propagateItem.fontSize = 16;
        propagateItem.x = cc.visibleRect.right.x - propagateItem.width/2-20;
        propagateItem.y = cc.visibleRect.right.y;

        var menu = new cc.Menu(propagateItem);
        menu.setPosition(0, 0);
        menu.setAnchorPoint(0, 0);
        this.addChild(menu);
    }
});

var NodeEventTestFlow = new FlowControl([
    TouchEventTest,
    MouseEventTest,
    PropagationTest,
], true);

window.NodeEventTestFlow = NodeEventTestFlow;

})(window, BaseTestLayer);
