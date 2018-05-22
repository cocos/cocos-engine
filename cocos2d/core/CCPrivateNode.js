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

const Node = require('./CCNode');
const RenderFlow = require('./renderer/render-flow');
const renderEngine = require('./renderer/render-engine');
const math = renderEngine.math;

const LocalDirtyFlag = Node._LocalDirtyFlag;
const POSITION_ON = 1 << 0;
const ERR_INVALID_NUMBER = CC_EDITOR && 'The %s is invalid';
const ONE_DEGREE = Math.PI / 180;

let _vec3_temp = math.vec3.create();

/**
 * !#en
 * Class of private entities in Cocos Creator scenes.<br/>
 * The PrivateNode is hidden in editor, and completely transparent to users.<br/>
 * It has the minimum zIndex and the position isn't affected by parent's anchor point.
 * !#zh
 * Cocos Creator 场景中的私有节点类。<br/>
 * 私有节点在编辑器中不可见，对用户透明。<br/>
 * 它有着最小的渲染排序的 Z 轴深度，同时位置不受父节点的锚点影响。
 * @class PrivateNode
 * @constructor
 * @param {String} name
 * @extends Node
 */
let PrivateNode = cc.Class({
    name: 'cc.PrivateNode',
    extends: Node,

    properties: {
        x: {
            get () {
                return this._originPos.x;
            },
            set (value) {
                var localPosition = this._originPos;
                if (value !== localPosition.x) {
                    localPosition.x = value;
                    this._posDirty(true);
                }
            },
            override: true
        },

        y: {
            get () {
                return this._originPos.y;
            },
            set (value) {
                var localPosition = this._originPos;
                if (value !== localPosition.y) {
                    localPosition.y = value;
                    this._posDirty(true);
                }
            },
            override: true
        },
    },

    /**
     * @method constructor
     * @param {String} [name]
     */
    ctor (name) {
        this.zIndex = cc.macro.MIN_ZINDEX;
        this._originPos = cc.v2();
    },

    _posDirty (sendEvent) {
        this.setLocalDirty(LocalDirtyFlag.POSITION);
        this._renderFlag |= RenderFlow.FLAG_LOCAL_TRANSFORM;
        if (sendEvent === true && (this._eventMask & POSITION_ON)) {
            this.emit(EventType.POSITION_CHANGED);
        }
    },

    _updateLocalMatrix() {
        if (!this._localMatDirty) return;

        // Position correction for transform calculation
        this._position.x = this._originPos.x - (this.parent._anchorPoint.x - 0.5) * this.parent._contentSize.width;
        this._position.y = this._originPos.y - (this.parent._anchorPoint.y - 0.5) * this.parent._contentSize.height;

        this._super();
    },

    getPosition () {
        return new cc.Vec2(this._originPos);
    },

    setPosition (x, y) {
        if (y === undefined) {
            x = x.x;
            y = x.y;
        }

        var pos = this._originPos;
        if (pos.x === x && pos.y === y) {
            return;
        }
        pos.x = x;
        pos.y = y;
        this._posDirty(true);
    },

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
    },

    _updateOrderOfArrival() {
        let arrivalOrder = 0;
        this._localZOrder = (this._localZOrder & 0xffff0000) | arrivalOrder;
    },

});

cc.js.getset(PrivateNode.prototype, "parent", PrivateNode.prototype.getParent, PrivateNode.prototype.setParent);
cc.js.getset(PrivateNode.prototype, "position", PrivateNode.prototype.getPosition, PrivateNode.prototype.setPosition);

cc.PrivateNode = module.exports = PrivateNode;
