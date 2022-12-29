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

#include "physics/physx/shapes/PhysXTerrain.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"
#include "physics/physx/shapes/PhysXShape.h"

namespace cc {
namespace physics {

PhysXTerrain::PhysXTerrain() : _mTerrain(nullptr),
                               _mRowScale(1.F),
                               _mColScale(1.F),
                               _mHeightScale(1.F),
                               _mIsTrigger(false){};

void PhysXTerrain::setTerrain(uint32_t objectID, float rs, float cs, float hs) {
    uintptr_t handle = PhysXWorld::getInstance().getPXPtrWithPXObjectID(objectID);
    if (handle == 0) return;
    if (_mShape) return;
    if (reinterpret_cast<uintptr_t>(_mTerrain) == handle) return;
    _mTerrain = reinterpret_cast<physx::PxHeightField *>(handle);
    _mRowScale = rs;
    _mColScale = cs;
    _mHeightScale = hs;
    if (_mSharedBody && _mTerrain) {
        onComponentSet();
        insertToShapeMap();
        if (_mEnabled) getSharedBody().addShape(*this);
        setAsTrigger(_mIsTrigger);
        updateCenter();
    }
}

void PhysXTerrain::onComponentSet() {
    if (_mTerrain) {
        physx::PxHeightFieldGeometry geom;
        geom.rowScale = _mRowScale;
        geom.columnScale = _mColScale;
        geom.heightScale = _mHeightScale;
        geom.heightField = _mTerrain;
        _mShape = PxGetPhysics().createShape(geom, getDefaultMaterial(), true);
    }
}

void PhysXTerrain::updateScale() {
    // updateCenter(); needed?
}

void PhysXTerrain::updateCenter() {
    if (!_mShape) return;
    getShape().setLocalPose(physx::PxTransform{_mCenter, _mRotation});
}

void PhysXTerrain::setAsTrigger(bool v) {
    _mIsTrigger = v;
    if (_mShape) {
        PhysXShape::setAsTrigger(v);
    }
}

} // namespace physics
} // namespace cc
