
var PHYSICS_TO_CC_ANGLE = require('../CCPhysicsTypes').PHYSICS_TO_CC_ANGLE;
var PTM_RATIO = require('../CCPhysicsTypes').PTM_RATIO;

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

        var position = node._position;
        position.x = pos.x * PTM_RATIO;
        position.y = pos.y * PTM_RATIO;

        var angle = b2body.GetAngle() * PHYSICS_TO_CC_ANGLE;

        body._ignoreNodeChanges = true;

        if (node.parent.parent !== null) {
            node.position = node.parent.convertToNodeSpaceAR( position );
            node.rotation = convertToNodeRotation( node.parent, angle );
        }
        else {
            node._sgNode.setPosition(position.x, position.y);
            node.rotation = angle;
        }

        body._ignoreNodeChanges = false;
    }
};

cc.PhysicsUtils = module.exports = PhysicsUtils;
