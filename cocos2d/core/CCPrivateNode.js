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
const renderEngine = require('./renderer/render-engine');
const math = renderEngine.math;

const ANCHOR_CHANGED = 'anchor-changed';
const ONE_DEGREE = Math.PI / 180;

let _vec3_temp = math.vec3.create();

/**
 * !#en
 * Class of private entities in Cocos Creator scenes.<br/>
 * The PrivateNode is hidden in editor, and completely transparent to users.<br/>
 * It has the minimum zIndex and the position is affected by parent's anchor point.
 * !#zh
 * Cocos Creator 场景中的私有节点类。<br/>
 * 私有节点在编辑器中不可见，对用户透明。<br/>
 * 它有着最小的渲染排序的 Z 轴深度，同时位置受父节点的锚点影响。
 * @class PrivateNode
 * @constructor
 * @param {String} name
 * @extends Node
 */
let PrivateNode = cc.Class({
    name: 'cc.PrivateNode',
    extends: Node,

    /**
     * @method constructor
     * @param {String} [name]
     */
    ctor (name) {
        this.zIndex = cc.macro.MIN_ZINDEX;
    },

    _onAnchorChangedHandler () {
        this._localMatDirty = true;
    },

    _updateLocalMatrix() {
        if (this._localMatDirty) {
            // Update transform
            let t = this._matrix;
            _vec3_temp.x = this._position.x - (this.parent._anchorPoint.x - 0.5) * this.parent._contentSize.width;
            _vec3_temp.y = this._position.y - (this.parent._anchorPoint.y - 0.5) * this.parent._contentSize.height;
            _vec3_temp.z = this._position.z;    
            math.mat4.fromRTS(t, this._quat, _vec3_temp, this._scale);

            // skew
            if (this._skewX || this._skewY) {
                let a = t.m00, b = t.m01, c = t.m04, d = t.m05;
                let skx = Math.tan(this._skewX * ONE_DEGREE);
                let sky = Math.tan(this._skewY * ONE_DEGREE);
                if (skx === Infinity)
                    skx = 99999999;
                if (sky === Infinity)
                    sky = 99999999;
                t.m00 = a + c * sky;
                t.m01 = b + d * sky;
                t.m04 = c + a * skx;
                t.m05 = d + b * skx;
            }
            this._localMatDirty = false;
            // Register dirty status of world matrix so that it can be recalculated
            this._worldMatDirty = true;
        }
    },

    setParent(value) {
        let oldParent = this._parent;
        this._super(value);
        if (oldParent !== value) {
            if (oldParent) {
                oldParent.off(ANCHOR_CHANGED, this._onAnchorChangedHandler, this);
            }
            if (value) {
                value.on(ANCHOR_CHANGED, this._onAnchorChangedHandler, this);
            }
        }
    },

    _updateOrderOfArrival() {
        let arrivalOrder = 0;
        this._localZOrder = (this._localZOrder & 0xffff0000) | arrivalOrder;
    },

});

cc.js.getset(PrivateNode.prototype, "parent", PrivateNode.prototype.getParent, PrivateNode.prototype.setParent);

cc.PrivateNode = module.exports = PrivateNode;
