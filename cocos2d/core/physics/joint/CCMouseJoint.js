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

var tempB2Vec2 = new b2.Vec2();
/**
 * !#en
 * A mouse joint is used to make a point on a body track a
 * specified world point. This a soft constraint with a maximum
 * force. This allows the constraint to stretch and without
 * applying huge forces.
 * Mouse Joint will auto register the touch event with the mouse region node,
 * and move the choosed rigidbody in touch move event.
 * Note : generally mouse joint only used in test bed.
 * !#zh
 * 鼠标关节用于使刚体上的一个点追踪一个指定的世界坐标系下的位置。
 * 鼠标关节可以指定一个最大的里来施加一个柔和的约束。
 * 鼠标关节会自动使用 mouse region 节点来注册鼠标事件，并且在触摸移动事件中移动选中的刚体。
 * 注意：一般鼠标关节只在测试环境中使用。
 * @class MouseJoint
 * @extends Joint
 */
var MouseJoint = cc.Class({
    name: 'cc.MouseJoint',
    extends: cc.Joint,
    
    editor: CC_EDITOR && {
        inspector: 'packages://inspector/inspectors/comps/physics/joint.js',
        menu: 'i18n:MAIN_MENU.component.physics/Joint/Mouse',
    },

    properties: {
        _target: 1,
        _frequency: 5,
        _dampingRatio: 0.7,
        _maxForce: 0,

        connectedBody: {
            default: null,
            type: cc.RigidBody,
            visible: false,
            override: true
        },

        collideConnected: {
            default: true,
            visible: false,
            override: true
        },

        /**
         * !#en
         * The anchor of the rigidbody.
         * !#zh
         * 刚体的锚点。
         * @property {Vec2} anchor
         * @default cc.v2(0, 0)
         */
        anchor: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.anchor',            
            default: cc.v2(0, 0),
            override: true,
            visible: false
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
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.connectedAnchor',
            default: cc.v2(0, 0),
            override: true,
            visible: false
        },

        /**
         * !#en
         * The node used to register touch evnet.
         * If this is null, it will be the joint's node.
         * !#zh
         * 用于注册触摸事件的节点。
         * 如果没有设置这个值，那么将会使用关节的节点来注册事件。
         * @property {Node} mouseRegion
         * @default null
         */
        mouseRegion: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.mouseRegion',            
            default: null,
            type: cc.Node
        },

        /**
         * !#en
         * The target point.
         * The mouse joint will move choosed rigidbody to target point.
         * !#zh
         * 目标点，鼠标关节将会移动选中的刚体到指定的目标点
         * @property {Vec2} target
         */
        target: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.target',
            visible: false,
            get: function () {
                return this._target;
            },
            set: function (value) {
                this._target = value;
                if (this._joint) {
                    tempB2Vec2.x = value.x/PTM_RATIO;
                    tempB2Vec2.y = value.y/PTM_RATIO;
                    this._joint.SetTarget(tempB2Vec2);
                }
            }
        },

        /**
         * !#en
         * The spring frequency.
         * !#zh
         * 弹簧系数。
         * @property {Number} frequency
         * @default 0
         */
        frequency: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.frequency',            
            get: function () {
                return this._frequency;
            },
            set: function (value) {
                this._frequency = value;
                if (this._joint) {
                    this._joint.SetFrequency(value);
                }
            }
        },

        /**
         * !#en
         * The damping ratio.
         * !#zh
         * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
         * @property {Number} dampingRatio
         * @property 0
         */
        dampingRatio: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.dampingRatio',                        
            get: function () {
                return this._dampingRatio;
            },
            set: function (value) {
                this._dampingRatio = value;
                if (this._joint) {
                    this._joint.SetDampingRatio(value);
                }
            }
        },

        /**
         * !#en
         * The maximum force
         * !#zh
         * 最大阻力值
         * @property {Number} maxForce
         * @default 1
         */
        maxForce: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.maxForce',            
            visible: false,
            get: function () {
                return this._maxForce;
            },
            set: function (value) {
                this._maxForce = value;
                if (this._joint) {
                    this._joint.SetMaxForce(value);
                }
            }
        },
    },

    onLoad: function () {
        var mouseRegion = this.mouseRegion || this.node;
        mouseRegion.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        mouseRegion.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        mouseRegion.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        mouseRegion.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },

    onEnable: function () {
    },

    start: function () {
    },

    onTouchBegan: function (event) {
        var manager = cc.director.getPhysicsManager();
        var target = this._pressPoint = event.touch.getLocation();
        
        if (cc.Camera && cc.Camera.main) {
            target = cc.Camera.main.getScreenToWorldPoint(target);
        }

        var collider = manager.testPoint( target );
        if (!collider) return;

        var body = this.connectedBody = collider.body;
        body.awake = true;

        this.maxForce = 1000 * this.connectedBody.getMass();
        this.target = target;

        this._init();
    },

    onTouchMove: function (event) {
        this._pressPoint = event.touch.getLocation();
    },

    onTouchEnd: function (event) {
        this._destroy();
        this._pressPoint = null;
    },

    _createJointDef: function () {
        var def = new b2.MouseJointDef();
        tempB2Vec2.x = this.target.x/PTM_RATIO;
        tempB2Vec2.y = this.target.y/PTM_RATIO;
        def.target = tempB2Vec2;
        def.maxForce = this.maxForce;
        def.dampingRatio = this.dampingRatio;
        def.frequencyHz = this.frequency;
        return def;
    },

    update: function () {
        if (!this._pressPoint || !this._isValid()) {
            return;
        }

        var camera = cc.Camera.findCamera(this.node);
        if (camera) {
            this.target = camera.getScreenToWorldPoint(this._pressPoint);
        }
        else {
            this.target = this._pressPoint;
        }
    }
});

cc.MouseJoint = module.exports = MouseJoint;
