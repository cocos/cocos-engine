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

#include "physics/physx/shapes/PhysXBox.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"
#include "physics/physx/shapes/PhysXShape.h"

namespace cc {
namespace physics {

PhysXBox::PhysXBox() : _mHalfExtents(0.5){};

void PhysXBox::setSize(float x, float y, float z) {
    _mHalfExtents = physx::PxVec3{x / 2, y / 2, z / 2};
    updateGeometry();
    getShape().setGeometry(getPxGeometry<physx::PxBoxGeometry>());
}

void PhysXBox::onComponentSet() {
    updateGeometry();
    _mShape = PxGetPhysics().createShape(getPxGeometry<physx::PxBoxGeometry>(), getDefaultMaterial(), true);
}

void PhysXBox::updateScale() {
    updateGeometry();
    getShape().setGeometry(getPxGeometry<physx::PxBoxGeometry>());
    updateCenter();
}

void PhysXBox::updateGeometry() {
    auto *node = getSharedBody().getNode();
    auto &geo = getPxGeometry<physx::PxBoxGeometry>();
    geo.halfExtents = _mHalfExtents;
    node->updateWorldTransform();
    geo.halfExtents *= node->getWorldScale();
    geo.halfExtents = geo.halfExtents.abs();
    if (geo.halfExtents.minElement() <= 0.0) {
        geo.halfExtents = geo.halfExtents.maximum(physx::PxVec3{PX_NORMALIZATION_EPSILON});
    }
}

} // namespace physics
} // namespace cc
