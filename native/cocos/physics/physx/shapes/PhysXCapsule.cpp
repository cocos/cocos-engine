/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "physics/physx/shapes/PhysXCapsule.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"
#include "physics/physx/shapes/PhysXShape.h"

namespace cc {
namespace physics {

PhysXCapsule::PhysXCapsule() : _mRadius(0.5F),
                               _mCylinderHeight(1.0F),
                               _mDirection(EAxisDirection::Y_AXIS){};

void PhysXCapsule::setRadius(float r) {
    _mRadius = r;
    updateGeometry();
    getShape().setGeometry(getPxGeometry<physx::PxCapsuleGeometry>());
}

void PhysXCapsule::setCylinderHeight(float v) {
    _mCylinderHeight = v;
    updateGeometry();
    getShape().setGeometry(getPxGeometry<physx::PxCapsuleGeometry>());
}

void PhysXCapsule::setDirection(EAxisDirection v) {
    _mDirection = v;
    updateGeometry();
    getShape().setGeometry(getPxGeometry<physx::PxCapsuleGeometry>());
}

void PhysXCapsule::onComponentSet() {
    updateGeometry();
    _mShape = PxGetPhysics().createShape(getPxGeometry<physx::PxCapsuleGeometry>(), getDefaultMaterial(), true);
}

void PhysXCapsule::updateScale() {
    updateGeometry();
    getShape().setGeometry(getPxGeometry<physx::PxCapsuleGeometry>());
    updateCenter();
}

void PhysXCapsule::updateGeometry() {
    auto *node = getSharedBody().getNode();
    auto &geo = getPxGeometry<physx::PxCapsuleGeometry>();
    float rs = 1.F;
    float hs = 1.F;
    node->updateWorldTransform();
    switch (_mDirection) {
        case EAxisDirection::X_AXIS:
            hs = physx::PxAbs(node->getWorldScale().x);
            rs = pxAbsMax(node->getWorldScale().y, node->getWorldScale().z);
            _mRotation = physx::PxQuat{physx::PxIdentity};
            break;
        case EAxisDirection::Z_AXIS:
            hs = physx::PxAbs(node->getWorldScale().z);
            rs = pxAbsMax(node->getWorldScale().x, node->getWorldScale().y);
            _mRotation = physx::PxQuat(physx::PxPiDivTwo, physx::PxVec3{0.F, 1.F, 0.F});
            break;
        case EAxisDirection::Y_AXIS:
        default:
            hs = physx::PxAbs(node->getWorldScale().y);
            rs = pxAbsMax(node->getWorldScale().x, node->getWorldScale().z);
            _mRotation = physx::PxQuat(physx::PxPiDivTwo, physx::PxVec3{0.F, 0.F, 1.F});
            break;
    }
    geo.radius = physx::PxMax(physx::PxAbs(_mRadius * rs), PX_NORMALIZATION_EPSILON);
    geo.halfHeight = physx::PxMax(physx::PxAbs(_mCylinderHeight / 2 * hs), PX_NORMALIZATION_EPSILON);
}

} // namespace physics
} // namespace cc
