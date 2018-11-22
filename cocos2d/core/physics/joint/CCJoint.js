/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;

/**
 * !#en
 * Base class for joints to connect rigidbody.
 * !#zh
 * 关节类的基类
 * @class Joint
 * @extends Component
 */
var Joint = cc.Class({
    name: 'cc.Joint',
    extends: cc.Component,
    
    editor: { 
        requireComponent: cc.RigidBody
    },

    properties: {
               /**
         * !#en
         * The anchor of the rigidbody.
         * !#zh
         * 刚体的锚点。
         * @property {Vec2} anchor
         * @default cc.v2(0, 0)
         */
        anchor: {
            default: cc.v2(0, 0),
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.anchor'
        },
        /**
         * !#en
         * The anchor of the connected rigidbody.
         * !#zh
         * 关节另一端刚体的锚点。
         * @property {Vec2} connectedAnchor
         * @default cc.v2(0, 0)
         */
        connectedAnchor: {
            default: cc.v2(0, 0),
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.connectedAnchor'            
        },
        
        /**
         * !#en
         * The rigidbody to which the other end of the joint is attached.
         * !#zh
         * 关节另一端链接的刚体
         * @property {RigidBody} connectedBody
         * @default null
         */
        connectedBody: {
            default: null,
            type: cc.RigidBody,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.connectedBody'
        },

        /**
         * !#en
         * Should the two rigid bodies connected with this joint collide with each other?
         * !#zh
         * 链接到关节上的两个刚体是否应该相互碰撞？
         * @property {Boolean} collideConnected
         * @default false
         */
        collideConnected: {
            default: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.collideConnected'
        }
    },

    onDisable: function () {
        this._destroy();
    },

    onEnable: function () {
        this._init();
    },

    // need init after body and connected body init
    start: function () {
        this._init();
    },

    /**
     * !#en
     * Apply current changes to joint, this will regenerate inner box2d joint.
     * !#zh
     * 应用当前关节中的修改，调用此函数会重新生成内部 box2d 的关节。
     * @method apply
     */
    apply: function () {
        this._destroy();
        this._init();
    },

    /**
     * !#en
     * Get the anchor point on rigidbody in world coordinates.
     * !#zh
     * 获取刚体世界坐标系下的锚点。
     * @method getWorldAnchor
     * @return {Vec2}
     */
    getWorldAnchor: function () {
        if (this._joint) {
            var anchor = this._joint.GetAnchorA();
            return cc.v2(anchor.x * PTM_RATIO, anchor.y * PTM_RATIO);
        }
        return cc.Vec2.ZERO;
    },

    /**
     * !#en
     * Get the anchor point on connected rigidbody in world coordinates.
     * !#zh
     * 获取链接刚体世界坐标系下的锚点。
     * @method getWorldConnectedAnchor
     * @return {Vec2}
     */
    getWorldConnectedAnchor: function () {
        if (this._joint) {
            var anchor = this._joint.GetAnchorB();
            return cc.v2(anchor.x * PTM_RATIO, anchor.y * PTM_RATIO);
        }
        return cc.Vec2.ZERO;
    },

    /**
     * !#en
     * Gets the reaction force of the joint.
     * !#zh
     * 获取关节的反作用力。
     * @method getReactionForce
     * @param {Number} timeStep - The time to calculate the reaction force for.
     * @return {Vec2}
     */
    getReactionForce: function (timeStep) {
        var out = cc.v2();
        if (this._joint) {
            return this._joint.GetReactionForce(timeStep, out);
        }
        return out;
    },

    /**
     * !#en
     * Gets the reaction torque of the joint.
     * !#zh
     * 获取关节的反扭矩。
     * @method getReactionTorque
     * @param {Number} timeStep - The time to calculate the reaction torque for.
     * @return {Number}
     */
    getReactionTorque: function (timeStep) {
        if (this._joint) {
            return this._joint.GetReactionTorque(timeStep);
        }
        return 0;
    },

    _init: function () {
        cc.director.getPhysicsManager().pushDelayEvent(this, '__init', []);  
    },
    _destroy: function () {
        cc.director.getPhysicsManager().pushDelayEvent(this, '__destroy', []);
    },

    __init: function () {
        if (this._inited) return;

        this.body = this.getComponent(cc.RigidBody);
        
        if (this._isValid()) {
            var def = this._createJointDef();
            if (!def) return;

            def.bodyA = this.body._getBody();
            def.bodyB = this.connectedBody._getBody();
            def.collideConnected = this.collideConnected;

            cc.director.getPhysicsManager()._addJoint(this, def);
            
            this._inited = true;
        }
    },
    __destroy: function () {
        if (!this._inited) return;

        cc.director.getPhysicsManager()._removeJoint(this);

        this._joint = null;
        this._inited = false;
    },

    _createJointDef: function () {
        return null;
    },

    _isValid: function () {
        return this.body && this.body._getBody() &&
            this.connectedBody && this.connectedBody._getBody();
    }
});

cc.Joint = module.exports = Joint;
