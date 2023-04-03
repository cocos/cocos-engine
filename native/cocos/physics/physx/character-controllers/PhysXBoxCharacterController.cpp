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

#include "physics/physx/character-controllers/PhysXBoxCharacterController.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"
#include "math/Utils.h"

namespace cc {
namespace physics {
PhysXBoxCharacterController::PhysXBoxCharacterController() :
_mHalfHeight(0.5F), _mHalfSideExtent(0.5F), _mHalfForwardExtent(0.5F) {
}

void PhysXBoxCharacterController::setHalfHeight(float v) {
    _mHalfHeight = v;
    if(_impl) {
        static_cast<physx::PxBoxController*>(_impl)->setHalfHeight(v);
    }
}

void PhysXBoxCharacterController::setHalfSideExtent(float v) {
    _mHalfSideExtent = v;
    if(_impl) {
        static_cast<physx::PxBoxController*>(_impl)->setHalfSideExtent(v);
    }
}

void PhysXBoxCharacterController::setHalfForwardExtent(float v) {
    _mHalfForwardExtent = v;
    if (_impl) {
        static_cast<physx::PxBoxController*>(_impl)->setHalfForwardExtent(v);
    }
}

void PhysXBoxCharacterController::onComponentSet() {
    create();
}

void PhysXBoxCharacterController::create() {
    release();

    physx::PxControllerManager& controllerManager = PhysXWorld::getInstance().getControllerManager();
    auto pxMtl = reinterpret_cast<physx::PxMaterial *>(PhysXWorld::getInstance().getPXMaterialPtrWithMaterialID(0));

    physx::PxBoxControllerDesc boxDesc;
    boxDesc.halfHeight = _mHalfSideExtent;
    boxDesc.halfSideExtent = _mHalfSideExtent;
    boxDesc.halfForwardExtent = _mHalfForwardExtent;
    boxDesc.density = 10.0;
    boxDesc.scaleCoeff = 0.8;
    boxDesc.volumeGrowth = 1.5;
    boxDesc.contactOffset = fmaxf(0.f, _mContactOffset);
    boxDesc.stepOffset = _mStepOffset;
    boxDesc.slopeLimit = cos(_mSlopeLimit * mathutils::D2R);
    boxDesc.upDirection = physx::PxVec3(0, 1, 0);
    //node is at capsule's center
    const Vec3& worldPos = _mNode->getWorldPosition();
    boxDesc.position = physx::PxExtendedVec3(worldPos.x, worldPos.y, worldPos.z);
    boxDesc.material = pxMtl;
    boxDesc.userData = this;
    boxDesc.reportCallback = &report;
    _impl = static_cast<physx::PxBoxController*>(controllerManager.createController(boxDesc));

    insertToCCTMap();
    updateFilterData();
}

} // namespace physics
} // namespace cc
