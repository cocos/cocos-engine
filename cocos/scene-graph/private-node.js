/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

'use strict';

import Node from './node';
import _decorator from '../core/data/class-decorator';
const { ccclass, property } = _decorator;

const LocalDirtyFlag = Node._LocalDirtyFlag;
const POSITION_ON = 1 << 0;

/**
 * !#en
 * Class of private entities in Cocos Creator scenes.<br/>
 * The PrivateNode is hidden in editor, and completely transparent to users.<br/>
 * It's normally used as Node's private content created by components in parent node.<br/>
 * So in theory private nodes are not children, they are part of the parent node.<br/>
 * Private node have two important characteristics:<br/>
 * 1. It has the minimum z index and cannot be modified, because they can't be displayed over real children.<br/>
 * 2. The positioning of private nodes is also special, they will consider the left bottom corner of the parent node's bounding box as the origin of local coordinates.<br/>
 *    In this way, they can be easily kept inside the bounding box.<br/>
 * Currently, it's used by RichText component and TileMap component.
 * !#zh
 * Cocos Creator 场景中的私有节点类。<br/>
 * 私有节点在编辑器中不可见，对用户透明。<br/>
 * 通常私有节点是被一些特殊的组件创建出来作为父节点的一部分而存在的，理论上来说，它们不是子节点，而是父节点的组成部分。<br/>
 * 私有节点有两个非常重要的特性：<br/>
 * 1. 它有着最小的渲染排序的 Z 轴深度，并且无法被更改，因为它们不能被显示在其他正常子节点之上。<br/>
 * 2. 它的定位也是特殊的，对于私有节点来说，父节点包围盒的左下角是它的局部坐标系原点，这个原点相当于父节点的位置减去它锚点的偏移。这样私有节点可以比较容易被控制在包围盒之中。<br/>
 * 目前在引擎中，RichText 和 TileMap 都有可能生成私有节点。
 * @class PrivateNode
 * @method constructor
 * @param {String} name
 * @extends Node
 */
 @ccclass("cc.PrivateNode")
export default class PrivateNode extends Node {
    @property({
        override: true
    })
    get x() {
        return this._originPos.x;
    }
    set x(value) {
        var localPosition = this._originPos;
        if (value !== localPosition.x) {
            localPosition.x = value;
            this._posDirty(true);
        }
    }

    @property({
        override: true
    })
    get y() {
        return this._originPos.y;
    }
    set y(value) {
        var localPosition = this._originPos;
        if (value !== localPosition.y) {
            localPosition.y = value;
            this._posDirty(true);
        }
    }

    @property({
        override: true
    })
    get zIndex() {
        return cc.macro.MIN_ZINDEX;
    }
    set zIndex(val) {
        cc.warnID(1638);
    }

    /**
     * @method constructor
     * @param {String} [name]
     */
    constructor (name) {
        super(name);
        this._localZOrder = cc.macro.MIN_ZINDEX << 16;
        this._originPos = cc.v2();
    }

    _posDirty (sendEvent) {
        this.setLocalDirty(LocalDirtyFlag.POSITION);
        if (sendEvent === true && (this._eventMask & POSITION_ON)) {
            this.emit(Node.EventType.POSITION_CHANGED);
        }
    }

    _updateLocalMatrix() {
        if (!this._localMatDirty) return;

        let parent = this.parent;
        if (parent) {
            // Position correction for transform calculation
            this._position.x = this._originPos.x - (parent._anchorPoint.x - 0.5) * parent._contentSize.width;
            this._position.y = this._originPos.y - (parent._anchorPoint.y - 0.5) * parent._contentSize.height;
        }

        this._super();
    }

    getPosition () {
        return new cc.Vec2(this._originPos);
    }

    setPosition (x, y) {
        if (y === undefined) {
            x = x.x;
            y = x.y;
        }

        let pos = this._originPos;
        if (pos.x === x && pos.y === y) {
            return;
        }
        pos.x = x;
        pos.y = y;
        this._posDirty(true);
    }

    setParent(value) {
        let oldParent = this._parent;
        this._super(value);
        if (oldParent !== value) {
            if (oldParent) {
                oldParent.off(Node.EventType.ANCHOR_CHANGED, this._posDirty, this);
            }
            if (value) {
                value.on(Node.EventType.ANCHOR_CHANGED, this._posDirty, this);
            }
        }
    }

    // do not update order of arrival
    _updateOrderOfArrival() {}
}

cc.js.getset(PrivateNode.prototype, "parent", PrivateNode.prototype.getParent, PrivateNode.prototype.setParent);
cc.js.getset(PrivateNode.prototype, "position", PrivateNode.prototype.getPosition, PrivateNode.prototype.setPosition);

cc.PrivateNode = PrivateNode;
