
var CC_PTM_RATIO = cc.PhysicsManager.CC_PTM_RATIO;
var ContactType = require('./CCPhysicsTypes').ContactType;

function PhysicsContact (contact) {
    this._contact = contact;
    this.colliderA = contact.GetFixtureA().collider;
    this.colliderB = contact.GetFixtureB().collider;
    this.disabled = false;
}

PhysicsContact.prototype.getWorldManifold = function () {
    var worldmanifold;

    if (CC_JSB) {
        worldmanifold = cc.director.getPhysicsManager()._utils.getContactWorldManifold(this._contact);
    }
    else {
        worldmanifold = new b2.WorldManifold();
        this._contact.GetWorldManifold(worldmanifold);
    }

    var i;
    var points = worldmanifold.points;
    for (i = 0; i < points.length; i++) {
        var p = points[i];
        if (!p) break;

        points[i] = cc.v2(p.x * CC_PTM_RATIO, p.y * CC_PTM_RATIO);
    }

    points.length = i;

    var separations = worldmanifold.separations;
    separations.length = points.length;

    for (i = 0; i < separations.length; i++) {
        separations[i] *= CC_PTM_RATIO;
    }

    return worldmanifold;
};

PhysicsContact.prototype.getManifold = function () {
    var manifold = this._contact.GetManifold();
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
        return this._contact[name].apply(this._contact, arguments);
    };
});

PhysicsContact.ContactType = ContactType;
cc.PhysicsContact = module.exports = PhysicsContact;
