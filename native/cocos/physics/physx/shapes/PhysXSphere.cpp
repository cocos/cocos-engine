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

#include "physics/physx/shapes/PhysXSphere.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"
#include "physics/physx/shapes/PhysXShape.h"

namespace cc {
namespace physics {

PhysXSphere::PhysXSphere() : _mRadius(0.5F) {}

void PhysXSphere::setRadius(float r) {
    _mRadius = r;
    updateGeometry();
    getShape().setGeometry(getPxGeometry<physx::PxSphereGeometry>());
}

void PhysXSphere::onComponentSet() {
    updateGeometry();
    _mShape = PxGetPhysics().createShape(getPxGeometry<physx::PxSphereGeometry>(), getDefaultMaterial(), true);
}

void PhysXSphere::updateScale() {
    updateGeometry();
    getShape().setGeometry(getPxGeometry<physx::PxSphereGeometry>());
    updateCenter();
}

void PhysXSphere::updateGeometry() {
    physx::PxVec3 scale;
    auto *node = getSharedBody().getNode();
    node->updateWorldTransform();
    pxSetVec3Ext(scale, node->getWorldScale());
    auto &geo = getPxGeometry<physx::PxSphereGeometry>();
    geo.radius = physx::PxMax(_mRadius * scale.abs().maxElement(), PX_NORMALIZATION_EPSILON);
}

} // namespace physics
} // namespace cc
