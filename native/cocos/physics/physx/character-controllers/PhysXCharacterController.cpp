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

#include "physics/physx/character-controllers/PhysXCharacterController.h"
#include "base/std/container/unordered_map.h"
#include "physics/physx/shapes/PhysXShape.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"

namespace cc {
namespace physics {

//PxShape --> PhysXShape
static PhysXShape* convertPxShape2PhysXShape(physx::PxShape* shape) {
    //PxShape --> PhysXShape ID
    const auto& hitShape = getPxShapeMap().find(reinterpret_cast<uintptr_t>(shape));
    if (hitShape == getPxShapeMap().end()) {
        return nullptr;
    }
    //PhysXShape ID --> PhysXShape pointer
    uintptr_t wrapperPtrShape = PhysXWorld::getInstance().getWrapperPtrWithObjectID(hitShape->second);
    if (wrapperPtrShape == 0) {
        return nullptr;
    }
    return reinterpret_cast<PhysXShape*>(wrapperPtrShape);
}

void ControllerHitReport::onShapeHit(const physx::PxControllerShapeHit& hit) {
    const auto& hitShape = getPxShapeMap().find(reinterpret_cast<uintptr_t>(hit.shape));
    assert(hitShape!= getPxShapeMap().end());
    uint32_t shapeObjectID = hitShape->second;

    const auto& cct = getPxCCTMap().find(reinterpret_cast<uintptr_t>(hit.controller));
    assert(cct != getPxCCTMap().end());
    uint32_t cctObjectID = cct->second;

    CharacterControllerContact contact;
    contact.worldPosition = cc::Vec3(hit.worldPos.x, hit.worldPos.y, hit.worldPos.z);
    contact.worldNormal = cc::Vec3(hit.worldNormal.x, hit.worldNormal.y, hit.worldNormal.z);
    contact.motionDirection = cc::Vec3(hit.dir.x, hit.dir.y, hit.dir.z);
    contact.motionLength = hit.length;

    std::shared_ptr<CCTShapeEventPair> pair = std::make_shared<CCTShapeEventPair>(cctObjectID, shapeObjectID);
    pair->contacts.push_back(contact);

    auto& pairs = PhysXWorld::getInstance().getCCTShapeEventPairs();
    pairs.push_back(pair);
}

void ControllerHitReport::onControllerHit(const physx::PxControllersHit& hit) {
}

void ControllerHitReport::onObstacleHit(const physx::PxControllerObstacleHit& hit) {
}

physx::PxQueryHitType::Enum QueryFilterCallback::preFilter(const physx::PxFilterData& filterData,
const physx::PxShape* shape, const physx::PxRigidActor* actor, physx::PxHitFlags& queryFlags) {
    //PxShape --> PhysXShape ID
    const auto &hitShape = getPxShapeMap().find(reinterpret_cast<uintptr_t>(shape));
    if (hitShape == getPxShapeMap().end()) {
        return physx::PxQueryHitType::eNONE;
    }
    //PhysXShape ID --> PhysXShape pointer
    uintptr_t wrapperPtrShape = PhysXWorld::getInstance().getWrapperPtrWithObjectID(hitShape->second);
    if(wrapperPtrShape == 0){
        return physx::PxQueryHitType::eNONE;
    }
    PhysXShape* wrapperShape = reinterpret_cast<PhysXShape*>(wrapperPtrShape);
    if (!(filterData.word0 & wrapperShape->getMask()) || !(filterData.word1 & wrapperShape->getGroup())) {
        return physx::PxQueryHitType::eNONE;
    }
    return physx::PxQueryHitType::eBLOCK;
}
        
physx::PxQueryHitType::Enum QueryFilterCallback::postFilter(const physx::PxFilterData& filterData, const physx::PxQueryHit& hit){
    PX_UNUSED(filterData);
    PX_UNUSED(hit);
    return physx::PxQueryHitType::eNONE;
}

PhysXCharacterController::PhysXCharacterController() {
    _mObjectID = PhysXWorld::getInstance().addWrapperObject(reinterpret_cast<uintptr_t>(this));
    _mFilterData = physx::PxFilterData(1, 1, 1, 0 );
};

void PhysXCharacterController::release() {
    eraseFromCCTMap();
    if(_impl){
        _impl->release();
        _impl = nullptr;
    }
}

bool PhysXCharacterController::initialize(Node *node) {
    _mNode = node;
    onComponentSet();

    if (_impl == nullptr) {
        return false;
    } else {
        PhysXWorld::getInstance().addCCT(*this);
        return true;
    }    
}

void PhysXCharacterController::onEnable() {
    _mEnabled = true;
}

void PhysXCharacterController::onDisable() {
    _mEnabled = false;
}

void PhysXCharacterController::onDestroy() {
    release();
    PhysXWorld::getInstance().removeCCT(*this);
    PhysXWorld::getInstance().removeWrapperObject(_mObjectID);
}

cc::Vec3 PhysXCharacterController::getPosition() {
    const physx::PxExtendedVec3& pos = _impl->getPosition();
    cc::Vec3 cv(pos.x, pos.y, pos.z);
    return cv;
}

void PhysXCharacterController::setPosition(float x, float y, float z) {
    _impl->setPosition(physx::PxExtendedVec3{x, y, z});
}

bool PhysXCharacterController::onGround() {
    return (_pxCollisionFlags & physx::PxControllerCollisionFlag::Enum::eCOLLISION_DOWN);
}

void PhysXCharacterController::syncSceneToPhysics() {
    uint32_t getChangedFlags = _mNode->getChangedFlags();
    if (getChangedFlags & static_cast<uint32_t>(TransformBit::SCALE)) syncScale();
    //teleport
    if (getChangedFlags & static_cast<uint32_t>(TransformBit::POSITION)) {
        const auto & cctPos = _mNode->getWorldPosition() + scaledCenter();
        setPosition(cctPos.x, cctPos.y, cctPos.z);
    }
        
}

void PhysXCharacterController::syncScale () {
    updateScale();
}

//move
void PhysXCharacterController::move(float x, float y, float z, float minDist, float elapsedTime) {
    physx::PxVec3 disp{x, y, z};
    controllerFilter.mFilterData = &_mFilterData;
    controllerFilter.mFilterCallback = &_mFilterCallback;
    PhysXWorld::getInstance().getControllerManager().setOverlapRecoveryModule(_mOverlapRecovery);
    _pxCollisionFlags = _impl->move(disp, minDist, elapsedTime, controllerFilter);
}

void PhysXCharacterController::setStepOffset(float v) {
    _mStepOffset = v;
    _impl->setStepOffset(v);
}

float PhysXCharacterController::getStepOffset() {
    return _mStepOffset;
}

void PhysXCharacterController::setSlopeLimit(float v) {
    _mSlopeLimit = v;
    _impl->setSlopeLimit(cos(_mSlopeLimit * mathutils::D2R));
}

float PhysXCharacterController::getSlopeLimit() {
    return _mSlopeLimit;
}

void PhysXCharacterController::setContactOffset(float v) {
    _mContactOffset = v;
    _impl->setContactOffset(v);
}

float PhysXCharacterController::getContactOffset() {
    return _mContactOffset;
}

void PhysXCharacterController::setDetectCollisions(bool v) {
    physx::PxRigidDynamic* actor = _impl->getActor();
    physx::PxShape* shape;
    actor->getShapes(&shape, 1);
    shape->setFlag(physx::PxShapeFlag::eSIMULATION_SHAPE, v);
}

void PhysXCharacterController::setOverlapRecovery(bool v) {
    _mOverlapRecovery = v;
}

void PhysXCharacterController::setCenter(float x, float y, float z){
    _mCenter = Vec3(x, y, z);
}

uint32_t PhysXCharacterController::getGroup() {
    return _mFilterData.word0;
}

void PhysXCharacterController::setGroup(uint32_t g) {
    _mFilterData.word0 = g;
    updateFilterData();
}

uint32_t PhysXCharacterController::getMask() {
    return _mFilterData.word1;
}

void PhysXCharacterController::setMask(uint32_t m) {
    _mFilterData.word1 = m;
    updateFilterData();
}

void PhysXCharacterController::updateEventListener(EShapeFilterFlag flag) {
    _mFilterData.word3 |= physx::PxU32(flag);
    updateFilterData();
}

void PhysXCharacterController::updateFilterData() {
   setSimulationFilterData(_mFilterData);
}

void PhysXCharacterController::setSimulationFilterData(physx::PxFilterData filterData) {
    physx::PxRigidDynamic* actor = _impl->getActor();
    physx::PxShape* shape;
    actor->getShapes(&shape, 1);
    shape->setSimulationFilterData(filterData);
}

void PhysXCharacterController::syncPhysicsToScene() {
    _mNode->setWorldPosition(getPosition() - scaledCenter());
}

void PhysXCharacterController::insertToCCTMap() {
    if (_impl) {
        getPxCCTMap().insert(std::pair<uintptr_t, uint32_t>(reinterpret_cast<uintptr_t>(_impl), getObjectID()));
        getPxCCTMap().insert(std::pair<uintptr_t, uint32_t>(reinterpret_cast<uintptr_t>(getShape()), getObjectID()));
    }
}

void PhysXCharacterController::eraseFromCCTMap() {
    if (_impl) {
        getPxCCTMap().erase(reinterpret_cast<uintptr_t>(_impl));
        getPxCCTMap().erase(reinterpret_cast<uintptr_t>(getShape()));
    }
}

cc::Vec3 PhysXCharacterController::scaledCenter() {
    return _mNode->getWorldScale() * _mCenter;
}

physx::PxShape* PhysXCharacterController::getShape() {
    if (_impl) {
        //cct's shape
        physx::PxRigidDynamic* actor = _impl->getActor();
        physx::PxShape* shape;
        actor->getShapes(&shape, 1);
        return shape;
    }
    return nullptr;
}
} // namespace physics
} // namespace cc
