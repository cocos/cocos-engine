/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

        // When node's parent is not scene, convert position and rotation.
        if (node.parent.parent !== null) {
            tempPosition = node.parent.convertToNodeSpaceAR( tempPosition );
            angle = convertToNodeRotation( node.parent, angle );
        }

        var sgNode = node._sgNode;

        // sync position
        var position = node._position;
        position.x = tempPosition.x;
        position.y = tempPosition.y;

        sgNode.setPosition(position);

        // sync rotation
        node._rotationX = node._rotationY = angle;
        sgNode.rotation = angle;
    }
};

cc.PhysicsUtils = module.exports = PhysicsUtils;
