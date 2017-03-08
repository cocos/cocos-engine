
var PHYSICS_TO_CC_ANGLE = cc.PhysicsManager.PHYSICS_TO_CC_ANGLE;
var CC_PTM_RATIO = cc.PhysicsManager.CC_PTM_RATIO;

var convertToNodeRotation = require('../utils').convertToNodeRotation;

function PhysicsUtils () {
}

PhysicsUtils.prototype.addB2Body = function (body) {};

PhysicsUtils.prototype.removeB2Body = function (body) {};

PhysicsUtils.prototype.syncNode = function () {
    var bodies = cc.director.getPhysicsManager()._bodies;

    for (var i = 0, l = bodies.length; i < l; i++) {
        var body = bodies[i];
        var node = body.node;

        var b2body = body._b2Body;
        var pos = b2body.GetPosition();

        var position = cc.v2( pos.x * CC_PTM_RATIO, pos.y * CC_PTM_RATIO);
        var angle = b2body.GetAngle() * PHYSICS_TO_CC_ANGLE;

        body._ignoreNodeChanges = true;

        if (node.parent.parent !== null) {
            node.position = node.parent.convertToNodeSpaceAR( position );
            node.rotation = convertToNodeRotation( node.parent, angle );
        }
        else {
            node.position = position;
            node.rotation = angle;
        }

        body._ignoreNodeChanges = false;
    }
};

cc.PhysicsUtils = module.exports = PhysicsUtils;
