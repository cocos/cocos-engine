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
var getWorldScale = require('../utils').getWorldScale;

/**
 * @class PhysicsCollider
 * @extends Collider
 */
var PhysicsCollider = cc.Class({
    name: 'cc.PhysicsCollider',
    extends: cc.Collider,

    ctor: function () {
        this._fixtures = [];
        this._shapes = [];
        this._inited = false;
        this._rect = cc.rect();
    },

    properties: {
        _density: 1.0,
        _sensor: false,
        _friction: 0.2,
        _restitution: 0,
        
        /**
         * !#en
         * The density.
         * !#zh
         * 密度
         * @property {Number} density
         * @default 1
         */
        density: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.density',
            get: function () {
                return this._density;
            },
            set: function (value) {
                this._density = value;
            }
        },

        /**
         * !#en
         * A sensor collider collects contact information but never generates a collision response
         * !#zh
         * 一个传感器类型的碰撞体会产生碰撞回调，但是不会发生物理碰撞效果。
         * @property {Boolean} sensor
         * @default false
         */
        sensor: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.sensor',        
            get: function () {
                return this._sensor;
            },
            set: function (value) {
                this._sensor  = value;
            }
        },

        /**
         * !#en
         * The friction coefficient, usually in the range [0,1].
         * !#zh
         * 摩擦系数，取值一般在 [0, 1] 之间
         * @property {Number} friction
         * @default 0.2
         */
        friction: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.friction',        
            get: function () {
                return this._friction;
            },
            set: function (value) {
                this._friction = value;
            }
        },

        /**
         * !#en
         * The restitution (elasticity) usually in the range [0,1].
         * !#zh
         * 弹性系数，取值一般在 [0, 1]之间
         * @property {Number} restitution
         * @default 0
         */
        restitution: {
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.restitution',
            get: function () {
                return this._restitution;
            },
            set: function (value) {
                this._restitution = value;
            }
        },

        /**
         * !#en
         * Physics collider will find the rigidbody component on the node and set to this property.
         * !#zh
         * 碰撞体会在初始化时查找节点上是否存在刚体，如果查找成功则赋值到这个属性上。
         * @property {RigidBody} body
         * @default null
         */
        body: {
            default: null,
            type: cc.RigidBody,
            visible: false
        }
    },

    onDisable: function () {
        this._destroy();
    },
    onEnable: function () {
        this._init();
    },
    start: function () {
        this._init();
    },

    _getFixtureIndex: function (fixture) {
        return this._fixtures.indexOf(fixture);
    },

    _init: function () {
        cc.director.getPhysicsManager().pushDelayEvent(this, '__init', []);
    },
    _destroy: function () {
        cc.director.getPhysicsManager().pushDelayEvent(this, '__destroy', []);
    },

    __init: function () {
        if (this._inited) return;

        var body = this.body || this.getComponent(cc.RigidBody);
        if (!body) return;

        var innerBody = body._getBody();
        if (!innerBody) return;

        var node = body.node;
        var scale = getWorldScale(node);
        this._scale = scale;

        var shapes = scale.x === 0 && scale.y === 0 ? [] : this._createShape(scale);

        if (!(shapes instanceof Array)) {
            shapes = [shapes];
        }

        var categoryBits = 1 << node.groupIndex;
        var maskBits = 0;
        var bits = cc.game.collisionMatrix[node.groupIndex];
        for (let i = 0; i < bits.length; i++) {
            if (!bits[i]) continue;
            maskBits |= 1 << i;
        }

        var filter = {
            categoryBits: categoryBits,
            maskBits: maskBits,
            groupIndex: 0
        };

        var manager = cc.director.getPhysicsManager();

        for (let i = 0; i < shapes.length; i++) {
            var shape = shapes[i];

            var fixDef = new b2.FixtureDef();
            fixDef.density = this.density;
            fixDef.isSensor = this.sensor;
            fixDef.friction = this.friction;
            fixDef.restitution = this.restitution;
            fixDef.shape = shape;

            fixDef.filter = filter;

            var fixture = innerBody.CreateFixture(fixDef);
            fixture.collider = this;

            if (body.enabledContactListener) {
                manager._registerContactFixture(fixture);
            }

            this._shapes.push(shape);
            this._fixtures.push(fixture);
        }

        this.body = body;

        this._inited = true;
    },

    __destroy: function () {
        if (!this._inited) return;

        var fixtures = this._fixtures;
        var body = this.body._getBody();
        var manager = cc.director.getPhysicsManager();

        for (var i = fixtures.length-1; i >=0 ; i--) {
            var fixture = fixtures[i];
            fixture.collider = null;

            manager._unregisterContactFixture(fixture);

            if (body) {
                body.DestroyFixture(fixture);
            }
        }
        
        this.body = null;
        
        this._fixtures.length = 0;
        this._shapes.length = 0;
        this._inited = false;
    },
    
    _createShape: function () {
    },

    /**
     * !#en
     * Apply current changes to collider, this will regenerate inner box2d fixtures.
     * !#zh
     * 应用当前 collider 中的修改，调用此函数会重新生成内部 box2d 的夹具。
     * @method apply
     */
    apply: function () {
        this._destroy();
        this._init();
    },

    /**
     * !#en
     * Get the world aabb of the collider
     * !#zh
     * 获取碰撞体的世界坐标系下的包围盒
     * @method getAABB
     */
    getAABB: function () {
        var MAX = 10e6;

        var minX = MAX, minY = MAX;
        var maxX = -MAX, maxY = -MAX;
        
        var fixtures = this._fixtures;
        for (var i = 0; i < fixtures.length; i++) {
            var fixture = fixtures[i];

            var count = fixture.GetShape().GetChildCount();
            for (var j = 0; j < count; j++) {
                var aabb = fixture.GetAABB(j);
                if (aabb.lowerBound.x < minX) minX = aabb.lowerBound.x;
                if (aabb.lowerBound.y < minY) minY = aabb.lowerBound.y;
                if (aabb.upperBound.x > maxX) maxX = aabb.upperBound.x;
                if (aabb.upperBound.y > maxY) maxY = aabb.upperBound.y;
            }
        }

        minX *= PTM_RATIO;
        minY *= PTM_RATIO;
        maxX *= PTM_RATIO;
        maxY *= PTM_RATIO;

        var r = this._rect;
        r.x = minX;
        r.y = minY;
        r.width = maxX - minX;
        r.height = maxY - minY;

        return r;
    }
});

cc.PhysicsCollider = module.exports = PhysicsCollider;
