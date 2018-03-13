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

const PhysicsTypes = require('./CCPhysicsTypes');
const BodyType = PhysicsTypes.BodyType;
const DrawBits = PhysicsTypes.DrawBits;
const PTM_RATIO = PhysicsTypes.PTM_RATIO;

const math = cc.vmath;
const mat4 = math.mat4;
const vec2 = math.vec2;

const ShapeInactiveColor = cc.color(127, 127, 76, 150);
const ShapeStaticColor = cc.color(127, 229, 127, 150);
const ShapeKinematicColor = cc.color(127, 127, 229, 150);
const ShapeInawakeColor = cc.color(153, 153, 153, 150);
const ShapeNormalColor = cc.color(229, 178, 178, 150);
const JointColor = cc.color(127, 204, 204, 150);
const AabbColor = cc.color(229, 77, 229, 255);

let _vec2_tmp1 = cc.v2();
let _vec2_tmp2 = cc.v2();
let _mat4_tmp = mat4.create();
let _rect_tmp = cc.rect();

function drawPoints (g, points, offset, color, matrix) {
    for (let i = 0, l = points.length; i < l; i++) {
        _vec2_tmp1.x = points[i].x + offset.x;
        _vec2_tmp1.y = points[i].y + offset.y;

        vec2.transformMat4(_vec2_tmp1, _vec2_tmp1, matrix);
        if (i === 0) {
            g.moveTo(_vec2_tmp1.x, _vec2_tmp1. y);
        }
        else {
            g.lineTo(_vec2_tmp1.x, _vec2_tmp1. y);
        }
    }
}

function drawCollider (g, collider, color, matrix) {
    if (!collider.body) return;

    if (collider instanceof cc.PhysicsBoxCollider) {
        let offset = collider.offset;
        let size = collider.size;
        let points = [
            cc.v2(- size.width/2, - size.height/2),
            cc.v2(+ size.width/2, - size.height/2),
            cc.v2(+ size.width/2, + size.height/2),
            cc.v2(- size.width/2, + size.height/2),
        ];

        drawPoints(g, points, collider.offset, color, matrix);
        g.close();
    }
    else if (collider instanceof cc.PhysicsPolygonCollider) {
        drawPoints(g, collider.points, collider.offset, color, matrix);
        g.close();
    }
    else if (collider instanceof cc.PhysicsChainCollider) {
        drawPoints(g, collider.points, color, matrix);
    }
    else if (collider instanceof cc.PhysicsCircleCollider) {
        vec2.transformMat4(_vec2_tmp1, collider.offset, matrix);
        g.circle(_vec2_tmp1.x, _vec2_tmp1.y, collider.radius * collider._scale.x);
    }
    else {
        return;
    }

    g.fillColor = color;
    g.fill();
    g.stroke();
}

function drawSegment (g, p1, p2, color) {
    if (p1.x === p2.x && p1.y === p2.y) {
        g.fillColor = color;
        g.circle(p1.x, p1.y, 1);
        g.fill();
        return;
    }
    g.strokeColor = color;
    g.moveTo(p1.x, p1.y);
    g.lineTo(p2.x, p2.y);
    g.stroke();   
}

module.exports = function (manager) {
    let flags = manager.debugDrawFlags;
    if (!flags) {
        return;
    }

    manager._checkDebugDrawValid();
    let debugDrawer = manager._debugDrawer;
    debugDrawer.clear();

    if (flags & DrawBits.e_shapeBit || flags & DrawBits.e_aabbBit) {
        let bodies = manager._bodies;
        for (let i = 0, l = bodies.length; i < l; i++) {
            let body = bodies[i];
            let colliders = body.node.getComponents(cc.PhysicsCollider);

            if (colliders.length === 0) continue;
            
            body.node.getWorldMatrix(_mat4_tmp);

            if (flags & DrawBits.e_shapeBit) {
                let color = ShapeNormalColor;
                if (!body.active) {
                    color = ShapeInactiveColor;
                } 
                else if (body.type == BodyType.Static) {
                    color = ShapeStaticColor;
                }
                else if (body.type == BodyType.Kinematic) {
                    color = ShapeKinematicColor;
                }
                else if (!body.awake) {
                    color = ShapeInawakeColor;
                }

                for (let i2 = 0, l2 = colliders.length; i2 < l2; i2++) {
                    drawCollider(debugDrawer, colliders[i2], color, _mat4_tmp);
                }
            }
            
            if (flags & DrawBits.e_aabbBit && body.active) {
                for (let i2 = 0, l2 = colliders.length; i2 < l2; i2++) {
                    let aabb = colliders[i2].getAABB();
                    debugDrawer.strokeColor = AabbColor;
                    debugDrawer.rect(aabb.x, aabb.y, aabb.width, aabb.height);
                    debugDrawer.stroke();
                }
            }
        }
    }

    if (flags & DrawBits.e_jointBit) {
        let joints = manager._joints;
        for (let i = 0, l = joints.length; i < l; i++) {
            let joint = joints[i];
            let bodyA = joint.body;
            let bodyB = joint.connectedBody;

            if (!bodyA || !bodyB) continue;

            bodyA.node.getWorldMatrix(_mat4_tmp);
            _vec2_tmp1.x = _mat4_tmp.m12;
            _vec2_tmp1.y = _mat4_tmp.m13;

            bodyB.node.getWorldMatrix(_mat4_tmp);
            _vec2_tmp2.x = _mat4_tmp.m12;
            _vec2_tmp2.y = _mat4_tmp.m13;

            let p1 = cc.v2(joint._joint.GetAnchorA()).mulSelf(PTM_RATIO);
            let p2 = cc.v2(joint._joint.GetAnchorB()).mulSelf(PTM_RATIO);

            if (joint instanceof cc.DistanceJoint) {
                drawSegment(debugDrawer, p1, p2, JointColor);
            }
            else {
                drawSegment(debugDrawer, _vec2_tmp1, p1, JointColor);
                drawSegment(debugDrawer, p1, p2, JointColor);
                drawSegment(debugDrawer, _vec2_tmp2, p2, JointColor);
            }
        }
    }

};
