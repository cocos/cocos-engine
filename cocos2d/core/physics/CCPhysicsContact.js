
var CC_PTM_RATIO = require('./CCPhysicsTypes').CC_PTM_RATIO;
var ContactType = require('./CCPhysicsTypes').ContactType;

var pools = [];

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

function PhysicsContact () {
}

PhysicsContact.prototype.init = function (b2contact) {
    this._b2contact = b2contact;
    this.colliderA = b2contact.GetFixtureA().collider;
    this.colliderB = b2contact.GetFixtureB().collider;
    this.disabled = false;
};

PhysicsContact.prototype.getWorldManifold = function () {
    var i;
    var points = worldmanifold.points;
    var separations = worldmanifold.separations;

    if (CC_JSB) {
        var wrapper = cc.PhysicsUtils.getContactWorldManifoldWrapper(this._b2contact);
        var count = wrapper.getCount();
        var localNormal = worldmanifold.localNormal;

        points.length = separations.length = count;

        for (i = 0; i < count; i++) {
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
        
        for (i = 0; i < count; i++) {
            var p = pointCache[i];
            p.x = b2points[i].x * CC_PTM_RATIO;
            p.y = b2points[i].y * CC_PTM_RATIO;
            
            points[i] = p;
            separations[i] = b2separations[i] * CC_PTM_RATIO;
        }
    }

    return worldmanifold;
};

PhysicsContact.prototype.getManifold = function () {
    var manifold = this._b2contact.GetManifold();
    if (!CC_JSB) {
        manifold = manifold.Clone();
    }

    var points = manifold.points;
    for (var i = 0; i < manifold.pointCount; i++) {
        var p = points[i].localPoint;
        points[i].localPoint = cc.v2(p.x * CC_PTM_RATIO, p.y * CC_PTM_RATIO);
    }

    manifold.localPoint = cc.v2(manifold.localPoint.x * CC_PTM_RATIO, manifold.localPoint.y * CC_PTM_RATIO);
    manifold.localNormal = cc.v2(manifold.localNormal);

    return manifold;
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

    var a1 = arguments[1]; // now just maybe impulse

    var comps;
    var i, l, comp;

    if (bodyA.enabledContactListener) {
        comps = bodyA.node._components;
        for (i = 0, l = comps.length; i < l; i++) {
            comp = comps[i];
            if (comp[func]) {
                comp[func](this, colliderA, colliderB, a1);
            }
        }
    }

    if (bodyB.enabledContactListener) {
        comps = bodyB.node._components;
        for (i = 0, l = comps.length; i < l; i++) {
            comp = comps[i];
            if (comp[func]) {
                comp[func](this, colliderB, colliderA, a1);
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
    b2contact._contact = c;

    return c;
};

PhysicsContact.put = function (b2contact) {
    pools.push(b2contact._contact);
    b2contact._contact._b2contact = null;
    b2contact._contact = null;
};

[
    'IsTouching', 
    'SetEnabled', 'IsEnabled', 
    'SetFriction', 'GetFriction', 
    'ResetFriction', 'SetRestitution', 
    'GetRestitution', 'ResetRestitution',
    'SetTangentSpeed', 'GetTangentSpeed',
].forEach(function(name) {
    var funcName = name[0].toLowerCase() + name.substr(1, name.length-1);
    PhysicsContact.prototype[funcName] = function () {
        return this._b2contact[name].apply(this._b2contact, arguments);
    };
});

PhysicsContact.ContactType = ContactType;
cc.PhysicsContact = module.exports = PhysicsContact;
