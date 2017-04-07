
var PHYSICS_ANGLE_TO_ANGLE = require('../CCPhysicsTypes').PHYSICS_ANGLE_TO_ANGLE;
var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;

var convertToNodeRotation = require('../utils').convertToNodeRotation;

var tempPosition = cc.v2();

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

        tempPosition.x = pos.x * PTM_RATIO;
        tempPosition.y = pos.y * PTM_RATIO;

        var angle = b2body.GetAngle() * PHYSICS_ANGLE_TO_ANGLE;

        body._ignoreNodeChanges = true;

        if (node.parent.parent !== null) {
            tempPosition = node.parent.convertToNodeSpaceAR( tempPosition );
            angle = convertToNodeRotation( node.parent, angle );
        }

        node.position = tempPosition;
        node.rotation = angle;

        body._ignoreNodeChanges = false;
    }
};

cc.PhysicsUtils = module.exports = PhysicsUtils;
