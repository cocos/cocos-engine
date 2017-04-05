
var PTM_RATIO = require('./CCPhysicsTypes').PTM_RATIO;
var ContactType = require('./CCPhysicsTypes').ContactType;

var pools = [];


// temp world manifold
var pointCache = [cc.v2(), cc.v2()];

var b2worldmanifold;
if (!CC_JSB) {
    b2worldmanifold = new b2.WorldManifold();
}

var worldmanifold = {
    points: [],
    separations: [],
    localNormal: cc.v2()
};

// temp manifold
function ManifoldPoint () {
    this.localPoint = cc.v2();
    this.normalImpulse = 0;
    this.tangentImpulse = 0;
}

var manifoldPointCache = [new ManifoldPoint(), new ManifoldPoint()];

var b2manifold;
if (!CC_JSB) {
    b2manifold = new b2.Manifold();
}

var manifold = {
    type: 0,
    localPoint: cc.v2(),
    localNormal: cc.v2(),
    points: []
};

// temp impulse
var impulse = {
    normalImpulses: [],
    tangentImpulses: []
};

// PhysicsContact
function PhysicsContact () {
}

PhysicsContact.prototype.init = function (b2contact) {
    this.colliderA = b2contact.GetFixtureA().collider;
    this.colliderB = b2contact.GetFixtureB().collider;
    this.disabled = false;
    this._impulse = null;


    this._b2contact = b2contact;
    b2contact._contact = this;
};

PhysicsContact.prototype.reset = function () {
    this.colliderA = null;
    this.colliderB = null;
    this.disabled = false;
    this._impulse = null;

    this._b2contact._contact = null;
    this._b2contact = null;
};

PhysicsContact.prototype.getWorldManifold = function () {
    var points = worldmanifold.points;
    var separations = worldmanifold.separations;

    if (CC_JSB) {
        var wrapper = cc.PhysicsUtils.getContactWorldManifoldWrapper(this._b2contact);
        var count = wrapper.getCount();
        var localNormal = worldmanifold.localNormal;

        points.length = separations.length = count;

        for (var i = 0; i < count; i++) {
            let p = pointCache[i];
            p.x = wrapper.getX(i);
            p.y = wrapper.getY(i);
            
            points[i] = p;
            separations[i] = wrapper.getSeparation(i);
        }
        
        localNormal.x = wrapper.getNormalX();
        localNormal.y = wrapper.getNormalY();
    }
    else {
        this._b2contact.GetWorldManifold(b2worldmanifold);
        var b2points = b2worldmanifold.points;
        var b2separations = b2worldmanifold.separations;

        var count = this._b2contact.GetManifold().pointCount;
        points.length = separations.length = count;
        
        for (var i = 0; i < count; i++) {
            var p = pointCache[i];
            p.x = b2points[i].x * PTM_RATIO;
            p.y = b2points[i].y * PTM_RATIO;
            
            points[i] = p;
            separations[i] = b2separations[i] * PTM_RATIO;
        }
    }

    return worldmanifold;
};

PhysicsContact.prototype.getManifold = function () {
    var points = manifold.points;
    
    if (CC_JSB) {
        var wrapper = cc.PhysicsUtils.getContactManifoldWrapper();
        var count = points.length = wrapper.getCount();
        
        for (var i = 0; i < count; i++) {
            var p = manifoldPointCache[i];
            p.localPoint.x = wrapper.getX(i);
            p.localPoint.y = wrapper.getX(i);
            p.normalImpulse = wrapper.getNormalImpulse(i);
            p.tangentImpulse = wrapper.getTangentImpulse(i);

            points[i] = p;
        }

        manifold.localNormal.x = wrapper.getLocalNormalX();
        manifold.localNormal.y = wrapper.getLocalNormalY();
        manifold.localPoint.x = wrapper.getLocalPointX();
        manifold.localPoint.y = wrapper.getLocalPointY();
        manifold.type = wrapper.getType();
    }
    else {
        var b2manifold = this._b2contact.GetManifold();
        var b2points = b2manifold.points;
        var count = points.length = b2manifold.pointCount;

        for (var i = 0; i < count; i++) {
            var p = manifoldPointCache[i];
            var b2p = b2points[i];
            p.localPoint.x = b2p.localPoint.x * PTM_RATIO;
            p.localPoint.Y = b2p.localPoint.Y * PTM_RATIO;
            p.normalImpulse = b2p.normalImpulse * PTM_RATIO;
            p.tangentImpulse = b2p.tangentImpulse;

            points[i] = p;
        }

        manifold.localPoint.x = b2manifold.localPoint.x * PTM_RATIO;
        manifold.localPoint.y = b2manifold.localPoint.y * PTM_RATIO;
        manifold.localNormal.x = b2manifold.localNormal.x;
        manifold.localNormal.y = b2manifold.localNormal.y;
        manifold.type = b2manifold.type;
    }

    return manifold;
};

PhysicsContact.prototype.getImpulse = function () {
    var b2impulse = this._impulse;
    if (!b2impulse) return null;

    var normalImpulses = impulse.normalImpulses;
    var tangentImpulses = impulse.tangentImpulses;
    var count;

    if (CC_JSB) {
        count = b2impulse.getCount();
        for (var i = 0; i < count; i++) {
            normalImpulses[i] = b2impulse.getNormalImpulse(i);
            tangentImpulses[i] = b2impulse.getTangentImpulse(i);
        }
    }
    else {
        count = b2impulse.count;
        for (var i = 0; i < count; i++) {
            normalImpulses[i] = b2impulse.normalImpulses[i] * PTM_RATIO;
            tangentImpulses[i] = b2impulse.tangentImpulses[i];
        }
    }

    tangentImpulses.length = normalImpulses.length = count;

    return impulse;
};

PhysicsContact.prototype.emit = function (contactType) {
    var func;
    switch (contactType) {
        case ContactType.BEGIN_CONTACT:
            func = 'onBeginContact';
            break;
        case ContactType.END_CONTACT:
            func = 'onEndContact';
            break;
        case ContactType.PRE_SOLVE:
            func = 'onPreSolve';
            break;
        case ContactType.POST_SOLVE:
            func = 'onPostSolve';
            break;
    }

    var colliderA = this.colliderA;
    var colliderB = this.colliderB;

    var bodyA = colliderA.body;
    var bodyB = colliderB.body;

    var comps;
    var i, l, comp;

    if (bodyA.enabledContactListener) {
        comps = bodyA.node._components;
        for (i = 0, l = comps.length; i < l; i++) {
            comp = comps[i];
            if (comp[func]) {
                comp[func](this, colliderA, colliderB);
            }
        }
    }

    if (bodyB.enabledContactListener) {
        comps = bodyB.node._components;
        for (i = 0, l = comps.length; i < l; i++) {
            comp = comps[i];
            if (comp[func]) {
                comp[func](this, colliderB, colliderA);
            }
        }
    }
};

PhysicsContact.get = function (b2contact) {
    var c;
    if (pools.length === 0) {
        c = new cc.PhysicsContact();
    }
    else {
        c = pools.pop(); 
    }

    c.init(b2contact);
    return c;
};

PhysicsContact.put = function (b2contact) {
    var c = b2contact._contact;
    if (!c) return;
    
    pools.push(c);
    c.reset();
};

[
    'IsTouching', 
    'IsEnabled', 
    'GetFriction', 
    'ResetFriction',
    'GetRestitution', 
    'ResetRestitution',
    'GetTangentSpeed',
].forEach(function(name) {
    var funcName = name[0].toLowerCase() + name.substr(1, name.length-1);
    PhysicsContact.prototype[funcName] = function () {
        return this._b2contact[name]();
    };
});

[
    'SetEnabled',
    'SetFriction',
    'SetRestitution',
    'SetTangentSpeed',
].forEach(function(name) {
    var funcName = name[0].toLowerCase() + name.substr(1, name.length-1);
    PhysicsContact.prototype[funcName] = function (arg) {
        this._b2contact[name](arg);
    };
});

PhysicsContact.ContactType = ContactType;
cc.PhysicsContact = module.exports = PhysicsContact;
