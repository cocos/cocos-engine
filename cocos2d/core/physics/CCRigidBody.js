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
var CC_TO_PHYSICS_ANGLE = cc.PhysicsManager.CC_TO_PHYSICS_ANGLE;
var PHYSICS_TO_CC_ANGLE = cc.PhysicsManager.PHYSICS_TO_CC_ANGLE;

var getWorldRotation = require('./utils').getWorldRotation;
var BodyType = require('./CCPhysicsTypes').BodyType;

var RigidBody = cc.Class({
    name: 'cc.RigidBody',
    extends: cc.Component,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.physics/Rigid Body',
        disallowMultiple: true
    },

    properties: {
        _type: BodyType.Dynamic,
        _allowSleep: true,
        _gravityScale: 1,
        _linearDamping: 0,
        _angularDamping: 0,
        _linearVelocity: cc.v2(0, 0),
        _angularVelocity: 0,
        _fixedRotation: false,

        enabledContactListener: false,

        bullet: false,

        enabled: {
            get: function () {
                return this._enabled;
            },
            set: function () {
                cc.warnID('8200');
            },
            visible: false,
            override: true
        },

        type: {
            type: BodyType,
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;

                if (this._b2Body) {
                    if (value === BodyType.Animated) {
                        this._b2Body.SetType(BodyType.Kinematic);
                    }
                    else {
                        this._b2Body.SetType(value);
                    }
                }
            }
        },

        allowSleep: {
            get: function () {
                return this._allowSleep;
            },
            set: function (value) {
                this._allowSleep = value;

                if (this._b2Body) {
                    this._b2Body.SetAllowSleeping(value);
                }
            }
        },

        gravityScale: {
            get: function () {
                return this._gravityScale;
            },
            set: function (value) {
                this._gravityScale = value;
                if (this._b2Body) {
                    this._b2Body.SetGravityScale(value);
                }
            }
        },

        linearDamping: {
            get: function () {
                return this._linearDamping;
            },
            set: function (value) {
                this._linearDamping = value;
                if (this._b2Body) {
                    this._b2Body.SetLinearDamping(this._linearDamping);
                }
            }
        },

        angularDamping: {
            get: function () {
                return this._angularDamping;
            },
            set: function (value) {
                this._angularDamping = value;
                if (this._b2Body) {
                    this._b2Body.SetAngularDamping(value);
                }
            }
        },

        linearVelocity: {
            type: cc.Vec2,
            get: function () {
                if (this._b2Body) {
                    var velocity = this._b2Body.GetLinearVelocity();
                    return cc.v2(velocity.x*CC_PTM_RATIO, velocity.y*CC_PTM_RATIO);
                }
                return this._linearVelocity;
            },
            set: function (value) {
                this._linearVelocity = value;
                if (this._b2Body) {
                    this._b2Body.SetLinearVelocity( new b2.Vec2(value.x/CC_PTM_RATIO, value.y/CC_PTM_RATIO) );
                }
            }
        },

        angularVelocity: {
            get: function () {
                if (this._b2Body) {
                    return this._b2Body.GetAngularVelocity() * PHYSICS_TO_CC_ANGLE;
                }
                return this._angularVelocity;
            },
            set: function (value) {
                this._angularVelocity = value;
                if (this._b2Body) {
                    this._b2Body.SetAngularVelocity( value * CC_TO_PHYSICS_ANGLE );
                }
            }
        },

        fixedRotation: {
            get: function () {
                return this._fixedRotation;
            },
            set: function (value) {
                this._fixedRotation = value;
                if (this._b2Body) {
                    this._b2Body.SetFixedRotation(value);
                }
            }
        },

        awake: {
            get: function () {
                return this._b2Body ? this._b2Body.IsAwake() : false;
            },
            set: function (value) {
                if (this._b2Body) {
                    this._b2Body.SetAwake( value );
                }
            }
        },

        mass: {
            visible: false,
            get: function () {
                return this._b2Body ? this._b2Body.GetMass() : 0;
            }
        },

        bodyActive: {
            visible: false,
            get: function () {
                return this._b2Body ? this._b2Body.IsActive() : false;
            },
            set: function (value) {
                if (this._b2Body) {
                    this._b2Body.SetActive(value);
                }
            }
        }
    },

    getLocalPoint: function (worldPoint) {
        if (this._b2Body) {
            worldPoint = new b2.Vec2(worldPoint.x/CC_PTM_RATIO, worldPoint.y/CC_PTM_RATIO);
            var pos = this._b2Body.GetLocalPoint(worldPoint);
            return cc.v2(pos.x*CC_PTM_RATIO, pos.y*CC_PTM_RATIO);
        }
        return cc.v2();
    },

    getWorldPoint: function (localPoint) {
        if (this._b2Body) {
            localPoint = new b2.Vec2(localPoint.x/CC_PTM_RATIO, localPoint.y/CC_PTM_RATIO);
            var pos = this._b2Body.GetWorldPoint(localPoint);
            return cc.v2(pos.x*CC_PTM_RATIO, pos.y*CC_PTM_RATIO);
        }
        return cc.v2();
    },

    getWorldVector: function (localVector) {
        if (this._b2Body) {
            localVector = new b2.Vec2(localVector.x/CC_PTM_RATIO, localVector.y/CC_PTM_RATIO);
            var vector = this._b2Body.GetWorldVector(localVector);
            return cc.v2(vector.x*CC_PTM_RATIO, vector.y*CC_PTM_RATIO);
        }
        return cc.v2();
    },

    getLocalVector: function (worldVector) {
        if (this._b2Body) {
            worldVector = new b2.Vec2(worldVector.x/CC_PTM_RATIO, worldVector.y/CC_PTM_RATIO);
            var vector = this._b2Body.GetLocalVector(worldVector);
            return cc.v2(vector.x*CC_PTM_RATIO, vector.y*CC_PTM_RATIO);
        }
        return cc.v2();
    },

    getWorldPosition: function () {
        if (this._b2Body) {
            var pos = this._b2Body.GetPosition();
            return cc.v2(pos.x*CC_PTM_RATIO, pos.y*CC_PTM_RATIO);
        }
        return cc.v2();
    },

    getWorldRotation: function () {
        if (this._b2Body) {
            return this._b2Body.GetAngle() * PHYSICS_TO_CC_ANGLE;
        }
        return 0;
    },

    getLinearVelocityFromWorldPoint: function (p) {
        if (this._b2Body) {
            p = new b2.Vec2(p.x/CC_PTM_RATIO, p.y/CC_PTM_RATIO);
            var velocity = this._b2Body.GetLinearVelocityFromWorldPoint(p);
            return cc.v2(velocity.x*CC_PTM_RATIO, velocity.y*CC_PTM_RATIO);
        }
        return cc.v2();
    },

    applyForce: function (force, point, wake) {
        if (this._b2Body) {
            force = new b2.Vec2(force.x/CC_PTM_RATIO, force.y/CC_PTM_RATIO);
            point = new b2.Vec2(point.x/CC_PTM_RATIO, point.y/CC_PTM_RATIO);
            this._b2Body.ApplyForce(force, point, wake);
        }
    },

    applyForceToCenter: function (force, wake) {
        if (this._b2Body) {
            force = new b2.Vec2(force.x/CC_PTM_RATIO, force.y/CC_PTM_RATIO);
            this._b2Body.ApplyForceToCenter(force, wake);
        }
    },

    applyTorque: function (torque, wake) {
        if (this._b2Body) {
            this._b2Body.ApplyTorque(torque, wake);
        }
    },
    
    resetVelocity: function () {
        if (!this._b2Body) return;

        this._b2Body.SetLinearVelocity(new b2.Vec2());
        this._b2Body.SetAngularVelocity(0);
    },

    onEnable: function () {
        this._init();
    },

    onDisable: function () {
        this._destroy();
    },

    onLoad: function () {
        this._ignoreNodeChanges = false;

        var node = this.node;

        node.on('position-changed', function() {
            if (!this._ignoreNodeChanges) {
                var pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
                if (node.scale && this.type === BodyType.Animated) {
                    pos = new b2.Vec2(pos.x / CC_PTM_RATIO, pos.y / CC_PTM_RATIO);
                    var b2Pos = this._b2Body.GetPosition();

                    pos.x = (pos.x - b2Pos.x)/(1/60);
                    pos.y = (pos.y - b2Pos.y)/(1/60);

                    this._b2Body.SetAwake(true);
                    this._b2Body.SetLinearVelocity(pos);
                }
                else {
                    this._b2Body.SetTransform(new b2.Vec2(pos.x / CC_PTM_RATIO, pos.y / CC_PTM_RATIO), this._b2Body.GetAngle());
                }
            }
        }, this);

        node.on('rotation-changed', function() {
            if (!this._ignoreNodeChanges) {
                var rotation = CC_TO_PHYSICS_ANGLE * getWorldRotation(node);
                if (node.scale && this.type === BodyType.Animated) {
                    var b2Rotation = this._b2Body.GetAngle();

                    this._b2Body.SetAwake(true);
                    this._b2Body.SetAngularVelocity((rotation - b2Rotation)/(1/60));
                }
                else {
                    this._b2Body.SetTransform(this._b2Body.GetPosition(), rotation);
                }
            }
        }, this);

        node.on('scale-changed', function () {
            if (!this._ignoreNodeChanges) {
                var colliders = this.getComponents(cc.Collider);
                for (var i = 0; i < colliders.length; i++) {
                    colliders[i].apply();
                }
            }
        }, this);
    },

    syncPosition: function () {
        var pos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this._b2Body.SetTransform(new b2.Vec2(pos.x / CC_PTM_RATIO, pos.y / CC_PTM_RATIO), this._b2Body.GetAngle());
    },

   _init: function () {
        cc.director.getPhysicsManager().pushDelayEvent(this, '__init', []);
    },
    _destroy: function () {
        cc.director.getPhysicsManager().pushDelayEvent(this, '__destroy', []);
    },

    __init: function () {
        if (this._inited) return;

        var bodyDef = new b2.BodyDef();
        
        if (this.type === BodyType.Animated) {
            bodyDef.type = BodyType.Kinematic;
        }
        else {
            bodyDef.type = this.type;
        }

        bodyDef.allowSleep = this.allowSleep;
        bodyDef.gravityScale = this.gravityScale;
        bodyDef.linearDamping = this.linearDamping;
        bodyDef.angularDamping = this.angularDamping;

        var linearVelocity = this.linearVelocity;
        bodyDef.linearVelocity = new b2.Vec2(linearVelocity.x/CC_PTM_RATIO, linearVelocity.y/CC_PTM_RATIO);

        bodyDef.angularVelocity = this.angularVelocity * CC_TO_PHYSICS_ANGLE;
        
        bodyDef.fixedRotation = this.fixedRotation;
        bodyDef.bullet = this.bullet;

        var node = this.node;
        var pos = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        bodyDef.position = new b2.Vec2(pos.x / CC_PTM_RATIO, pos.y / CC_PTM_RATIO);
        bodyDef.angle = -(Math.PI / 180) * getWorldRotation(node); 

        cc.director.getPhysicsManager()._addBody(this, bodyDef);

        this._inited = true;
    },
    __destroy: function () {
        if (!this._inited) return;
        cc.director.getPhysicsManager()._removeBody(this);
        this._inited = false;
    },

    _getBody: function () {
        return this._b2Body;
    },

});

cc.RigidBody = module.exports = RigidBody;
