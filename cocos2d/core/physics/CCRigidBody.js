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

var PTM_RATIO = require('./CCPhysicsTypes').PTM_RATIO;
var CC_TO_PHYSICS_ANGLE = require('./CCPhysicsTypes').CC_TO_PHYSICS_ANGLE;
var PHYSICS_TO_CC_ANGLE = require('./CCPhysicsTypes').PHYSICS_TO_CC_ANGLE;

var getWorldRotation = require('./utils').getWorldRotation;
var BodyType = require('./CCPhysicsTypes').BodyType;

var tempb2Vec21 = new b2.Vec2();
var tempb2Vec22 = new b2.Vec2();

var VEC2_ZERO = cc.Vec2.ZERO;

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
                var lv = this._linearVelocity;
                if (this._b2Body) {
                    var velocity = this._b2Body.GetLinearVelocity();
                    lv.x = velocity.x*PTM_RATIO;
                    lv.y = velocity.y*PTM_RATIO;
                }
                return lv;
            },
            set: function (value) {
                this._linearVelocity = value;
                var b2body = this._b2Body;
                if (b2body) {
                    var temp = CC_JSB ? tempb2Vec21 : b2body.m_linearVelocity;
                    temp.Set(value.x/PTM_RATIO, value.y/PTM_RATIO);
                    b2body.SetLinearVelocity(temp);
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

    getLocalPoint: function (worldPoint, out) {
        out = out || cc.v2();
        if (this._b2Body) {
            tempb2Vec21.Set(worldPoint.x/PTM_RATIO, worldPoint.y/PTM_RATIO);
            var pos = this._b2Body.GetLocalPoint(tempb2Vec21);
            out.x = pos.x*PTM_RATIO;
            out.y = pos.y*PTM_RATIO;
        }
        return out;
    },

    getWorldPoint: function (localPoint, out) {
        out = out || cc.v2();
        if (this._b2Body) {
            tempb2Vec21.Set(localPoint.x/PTM_RATIO, localPoint.y/PTM_RATIO);
            var pos = this._b2Body.GetWorldPoint(tempb2Vec21);
            out.x = pos.x*PTM_RATIO;
            out.y = pos.y*PTM_RATIO;
        }
        return out;
    },

    getWorldVector: function (localVector, out) {
        out = out || cc.v2();
        if (this._b2Body) {
            tempb2Vec21.Set(localVector.x/PTM_RATIO, localVector.y/PTM_RATIO);
            var vector = this._b2Body.GetWorldVector(tempb2Vec21);
            out.x = vector.x*PTM_RATIO;
            out.y = vector.y*PTM_RATIO;
        }
        return out;
    },

    getLocalVector: function (worldVector, out) {
        out = out || cc.v2();
        if (this._b2Body) {
            tempb2Vec21.Set(worldVector.x/PTM_RATIO, worldVector.y/PTM_RATIO);
            var vector = this._b2Body.GetLocalVector(tempb2Vec21);
            out.x = vector.x*PTM_RATIO;
            out.y = vector.y*PTM_RATIO;
        }
        return out;
    },

    getWorldPosition: function (out) {
        out = out || cc.v2();
        if (this._b2Body) {
            var pos = this._b2Body.GetPosition();
            out.x = pos.x*PTM_RATIO;
            out.y = pos.y*PTM_RATIO;
        }
        return out;
    },

    getWorldRotation: function () {
        if (this._b2Body) {
            return this._b2Body.GetAngle() * PHYSICS_TO_CC_ANGLE;
        }
        return 0;
    },

    getLocalCenter: function (out) {
        out = out || cc.v2();
        if (this._b2Body) {
            var pos = this._b2Body.GetLocalCenter();
            out.x = pos.x*PTM_RATIO;
            out.y = pos.y*PTM_RATIO;
        }
        return out;
    },

    getWorldCenter: function (out) {
        out = out || cc.v2();
        if (this._b2Body) {
            var pos = this._b2Body.GetWorldCenter();
            out.x = pos.x*PTM_RATIO;
            out.y = pos.y*PTM_RATIO;
        }
        return out;
    },

    getLinearVelocityFromWorldPoint: function (worldPoint, out) {
        out = out || cc.v2();
        if (this._b2Body) {
            tempb2Vec21.Set(worldPoint.x/PTM_RATIO, worldPoint.y/PTM_RATIO);
            var velocity = this._b2Body.GetLinearVelocityFromWorldPoint(tempb2Vec21);
            out.x = velocity.x*PTM_RATIO;
            out.y = velocity.y*PTM_RATIO;
        }
        return out;
    },

    applyForce: function (force, point, wake) {
        if (this._b2Body) {
            tempb2Vec21.Set(force.x/PTM_RATIO, force.y/PTM_RATIO);
            tempb2Vec22.Set(point.x/PTM_RATIO, point.y/PTM_RATIO);
            this._b2Body.ApplyForce(tempb2Vec21, tempb2Vec22, wake);
        }
    },

    applyForceToCenter: function (force, wake) {
        if (this._b2Body) {
            tempb2Vec21.Set(force.x/PTM_RATIO, force.y/PTM_RATIO);
            this._b2Body.ApplyForceToCenter(tempb2Vec21, wake);
        }
    },

    applyTorque: function (torque, wake) {
        if (this._b2Body) {
            this._b2Body.ApplyTorque(torque, wake);
        }
    },
    
    resetVelocity: function () {
        var b2body = this._b2Body;
        if (!b2body) return;

        var temp = CC_JSB ? tempb2Vec21 : b2body.m_linearVelocity;
        temp.Set(0, 0);

        b2body.SetLinearVelocity(temp);
        b2body.SetAngularVelocity(0);
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
                var b2body = this._b2Body;
                var pos = node.convertToWorldSpaceAR(VEC2_ZERO);

                var temp = CC_JSB ? tempb2Vec21 : b2body.m_linearVelocity;
                temp.x = pos.x / PTM_RATIO;
                temp.y = pos.y / PTM_RATIO;

                if (node.scale && this.type === BodyType.Animated) {
                    var b2Pos = b2body.GetPosition();

                    var timeStep = cc.game.config['frameRate'];
                    temp.x = (temp.x - b2Pos.x)*timeStep;
                    temp.y = (temp.y - b2Pos.y)*timeStep;

                    b2body.SetAwake(true);
                    b2body.SetLinearVelocity(temp);
                }
                else {
                    b2body.SetTransform(temp, b2body.GetAngle());
                }
            }
        }, this);

        node.on('rotation-changed', function() {
            if (!this._ignoreNodeChanges) {
                var rotation = CC_TO_PHYSICS_ANGLE * getWorldRotation(node);
                var b2body = this._b2Body;
                if (node.scale && this.type === BodyType.Animated) {
                    var b2Rotation = b2body.GetAngle();
                    var timeStep = cc.game.config['frameRate'];
                    b2body.SetAwake(true);
                    b2body.SetAngularVelocity((rotation - b2Rotation)*timeStep);
                }
                else {
                    b2body.SetTransform(b2body.GetPosition(), rotation);
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
        var pos = this.node.convertToWorldSpaceAR(VEC2_ZERO);
        this._b2Body.SetTransform(new b2.Vec2(pos.x / PTM_RATIO, pos.y / PTM_RATIO), this._b2Body.GetAngle());
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
        bodyDef.linearVelocity = new b2.Vec2(linearVelocity.x/PTM_RATIO, linearVelocity.y/PTM_RATIO);

        bodyDef.angularVelocity = this.angularVelocity * CC_TO_PHYSICS_ANGLE;
        
        bodyDef.fixedRotation = this.fixedRotation;
        bodyDef.bullet = this.bullet;

        var node = this.node;
        var pos = node.convertToWorldSpaceAR(VEC2_ZERO);
        bodyDef.position = new b2.Vec2(pos.x / PTM_RATIO, pos.y / PTM_RATIO);
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
