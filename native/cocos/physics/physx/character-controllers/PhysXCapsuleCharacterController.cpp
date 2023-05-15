/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

#include "physics/physx/character-controllers/PhysXCapsuleCharacterController.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"
#include "math/Utils.h"

namespace cc {
namespace physics {
PhysXCapsuleCharacterController::PhysXCapsuleCharacterController() : 
_mRadius(0.5F), _mHeight(1.0F) {
}

void PhysXCapsuleCharacterController::setRadius(float v) {
    _mRadius = v;
    updateScale();
}

void PhysXCapsuleCharacterController::setHeight(float v) {
    _mHeight = v;
    updateScale();
}

void PhysXCapsuleCharacterController::onComponentSet() {
    create();
}

void PhysXCapsuleCharacterController::create() {
    release();

    physx::PxControllerManager& controllerManager = PhysXWorld::getInstance().getControllerManager();
    auto pxMtl = reinterpret_cast<physx::PxMaterial *>(PhysXWorld::getInstance().getPXMaterialPtrWithMaterialID(0));

    physx::PxCapsuleControllerDesc capsuleDesc;
    capsuleDesc.height = _mHeight;
    capsuleDesc.radius = _mRadius;
    capsuleDesc.climbingMode = physx::PxCapsuleClimbingMode::eCONSTRAINED;
    capsuleDesc.density = 10.0;
    capsuleDesc.scaleCoeff = 0.8;
    capsuleDesc.volumeGrowth = 1.5;
    capsuleDesc.contactOffset = fmaxf(0.f, _mContactOffset);
    capsuleDesc.stepOffset = _mStepOffset;
    capsuleDesc.slopeLimit = cos(_mSlopeLimit * mathutils::D2R);
    capsuleDesc.upDirection = physx::PxVec3(0, 1, 0);
    //node is at capsule's center
    Vec3 worldPos = _mNode->getWorldPosition();
    worldPos += scaledCenter();
    capsuleDesc.position = physx::PxExtendedVec3(worldPos.x, worldPos.y, worldPos.z);
    capsuleDesc.material = pxMtl;
    capsuleDesc.userData = this;
    capsuleDesc.reportCallback = &report;
    _impl = static_cast<physx::PxCapsuleController*>(controllerManager.createController(capsuleDesc));

    updateScale();
    insertToCCTMap();
    updateFilterData();
}

void PhysXCapsuleCharacterController::updateScale(){
    updateGeometry();
}

void PhysXCapsuleCharacterController::updateGeometry() {
    if(!_impl) return;

    auto *node = _mNode;
    node->updateWorldTransform();
    float r = _mRadius * pxAbsMax(node->getWorldScale().x, node->getWorldScale().z);
    float h = _mHeight * physx::PxAbs(node->getWorldScale().y);
    static_cast<physx::PxCapsuleController*>(_impl)->setRadius(physx::PxMax(r, PX_NORMALIZATION_EPSILON));
    static_cast<physx::PxCapsuleController*>(_impl)->setHeight(physx::PxMax(h, PX_NORMALIZATION_EPSILON));
}

} // namespace physics
} // namespace cc
