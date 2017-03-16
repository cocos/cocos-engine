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
var getWorldScale = require('../utils').getWorldScale;

function PhysicsCollider () {
    this._fixtures = [];
    this._shapes = [];
    this._inited = false;
}

PhysicsCollider.prototype.onDisable = function () {
    this._destroy();
};

PhysicsCollider.prototype.onEnable = function () {
    this._init();
};

PhysicsCollider.prototype.start = function () {
    this._init();
};

PhysicsCollider.prototype.apply = function () {
    this._destroy();
    this._init();
};

PhysicsCollider.prototype.getAABB = function () {
    var MAX = 10e6;

    var minX = MAX, minY = MAX;
    var maxX = -MAX, maxY = -MAX;
    
    var manager = cc.director.getPhysicsManager();
    var fixtures = this._fixtures;
    for (var i = 0; i < fixtures.length; i++) {
        var fixture = fixtures[i];

        var count = fixture.m_proxyCount;
        for (var j = 0; j < count; j++) {
            var aabb = fixture.GetAABB(j);
            if (aabb.lowerBound.x < minX) minX = aabb.lowerBound.x;
            if (aabb.lowerBound.y < minY) minY = aabb.lowerBound.y;
            if (aabb.upperBound.x > maxX) maxX = aabb.upperBound.x;
            if (aabb.upperBound.y > maxY) maxY = aabb.upperBound.y;
        }

        manager._registerContactFixture(fixture);
    }

    minX *= CC_PTM_RATIO;
    minY *= CC_PTM_RATIO;
    maxX *= CC_PTM_RATIO;
    maxY *= CC_PTM_RATIO;

    return cc.rect(minX, minY, maxX-minX, maxY-minY);
};

PhysicsCollider.prototype._getFixtureIndex = function (fixture) {
    return this._fixtures.indexOf(fixture);
};

PhysicsCollider.prototype._init = function () {
    cc.director.getPhysicsManager().pushDelayEvent(this, '__init', []);
};
PhysicsCollider.prototype._destroy = function () {
    cc.director.getPhysicsManager().pushDelayEvent(this, '__destroy', []);
};

PhysicsCollider.prototype.__init = function () {
    if (this._inited) return;

    var body = this.body || this.getComponent(cc.RigidBody);
    if (!body) return;

    var innerBody = body._getBody();
    if (!innerBody) return;

    var transform;
    if (body.node !== this.node) {
        transform = cc.affineTransformConcat( this.node.getNodeToWorldTransformAR(), cc.affineTransformInvert(body.node.getNodeToWorldTransformAR()) );
    }

    var node = body.node;
    var scale = getWorldScale(node);

    var shapes = scale.x === 0 && scale.y === 0 ? [] : this._createShape(scale, transform);

    if (!(shapes instanceof Array)) {
        shapes = [shapes];
    }

    var categoryBits = 1 << node.groupIndex;
    var maskBits = 0;
    var bits = cc.game.collisionMatrix[node.groupIndex];
    for (var i = 0; i < bits.length; i++) {
        if (!bits[i]) continue;
        maskBits |= 1 << i;
    }

    var filter = {
        categoryBits: categoryBits,
        maskBits: maskBits,
        groupIndex: 0
    };

    var manager = cc.director.getPhysicsManager();

    for (var i = 0; i < shapes.length; i++) {
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
    this.registerBodyEvent();

    this._inited = true;
};
PhysicsCollider.prototype.__destroy = function () {
    if (!this._inited) return;

    var fixtures = this._fixtures;
    var body = this.body._getBody();

    for (var i = fixtures.length-1; i >=0 ; i--) {
        var fixture = fixtures[i];
        fixture.collider = null;

        if (body) {
            body.DestroyFixture(fixture);
        }
    }
    
    this.registerBodyEvent();
    this.body = null;
    
    this._fixtures.length = 0;
    this._shapes.length = 0;
    this._inited = false;
};

PhysicsCollider.prototype._createShape = function () {
};

PhysicsCollider.properties = {
    _density: 1.0,
    _sensor: false,
    _friction: 0.2,
    _restitution: 0,

    body: {
        default: null,
        type: cc.RigidBody
    },

    density: {
        get: function () {
            return this._density;
        },
        set: function (value) {
            this._density = value;
        }
    },

    sensor: {
        get: function () {
            return this._sensor;
        },
        set: function (value) {
            this._sensor  = value;
        }
    },

    friction: {
        get: function () {
            return this._friction;
        },
        set: function (value) {
            this._friction = value;
        }
    },

    restitution: {
        get: function () {
            return this._restitution;
        },
        set: function (value) {
            this._restitution = value;
        }
    }
};

PhysicsCollider.prototype.setEnabled = function () {
    this.enabled = true;
}
PhysicsCollider.prototype.setDisabled = function () {
    this.enabled = false;   
}

PhysicsCollider.prototype.registerBodyEvent = function () {
    this.body.on('enabled', this.setEnabled, this);
    this.body.on('disabled', this.setDisabled, this);
};
PhysicsCollider.prototype.unregisterBodyEvent = function () {
    this.body.off('enabled', this.setEnabled, this);
    this.body.off('disabled', this.setDisabled, this);
};

cc.PhysicsCollider = module.exports = PhysicsCollider;
