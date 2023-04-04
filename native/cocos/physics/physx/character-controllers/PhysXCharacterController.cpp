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

    // const cct = getWrapShape<PhysXCharacterController>(hit.getCurrentController()).characterController;
    // const collider = getWrapShape<PhysXShape>(hit.getTouchedShape()).collider;
    // const emitHit = new CharacterControllerContact();
    // emitHit.selfCCT = cct;
    // emitHit.otherCollider = collider;
    // emitHit.worldPosition.set(hit.worldPos.x, hit.worldPos.y, hit.worldPos.z);
    // emitHit.worldNormal.set(hit.worldNormal.x, hit.worldNormal.y, hit.worldNormal.z);
    // emitHit.motionDirection.set(hit.dir.x, hit.dir.y, hit.dir.z);
    // emitHit.motionLength = hit.length;
    // cct?.emit('onColliderHit', cct, collider, emitHit);


	// CharacterController* character = (CharacterController*)(hit.controller->getUserData());
	// RigidBody* rigidBody = (RigidBody*)(hit.actor->userData);
	// UtilityLayer::Log("current Character %s\n", character->GetParentNode()->GetName().c_str());
	// UtilityLayer::Log("hit RigidBody %s\n", rigidBody->GetParentNode()->GetName().c_str());
	// UtilityLayer::Log("hit world pos %f %f %f\n", hit.worldPos.x, hit.worldPos.y, hit.worldPos.z);

	// //testing
	// if (character->GetParentNode()->GetName() == "character")
	// {
	// 	//Engine::GetInstance()->m_renderer->m_vecView[0]->m_scene->
	// 	auto scene = character->GetParentNode()->GetScene();
	// 	auto nodeHitPoint = scene->m_root->CheckHasChild("hitPoint");

	// 	//node->setWorldPos() todo
	// 	assert(nodeHitPoint);
	// 	{
	// 		glm::mat4 worldTransform = nodeHitPoint->GetTransformMatrix();
	// 		glm::vec3 s0, t0; glm::quat r0;
	// 		MathUtility::Decompose1(worldTransform, t0, r0, s0);

	// 		// update node's translate, keep scale and rotation
	// 		glm::vec3 pos(hit.worldPos.x, hit.worldPos.y, hit.worldPos.z);
	// 		glm::mat4 globalM = MathUtility::TransformFromSRT(s0, r0, pos);
	// 		nodeHitPoint->SetTransformMatrix(globalM);
	// 	}
	// }
}

void ControllerHitReport::onControllerHit(const physx::PxControllersHit& hit) {
	// CharacterController* character = (CharacterController*)(hit.controller->getUserData());
	// CharacterController* other = (CharacterController*)(hit.other->getUserData());
	// // UtilityLayer::Log("current Character %s\n", character->GetParentNode()->GetName().c_str());
	// // UtilityLayer::Log("hit controller %s\n", other->GetParentNode()->GetName().c_str());
	// // UtilityLayer::Log("hit world pos %f %f %f\n", hit.worldPos.x, hit.worldPos.y, hit.worldPos.z);
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
    _mFilterData = physx::PxFilterData(1, 1, 10000, 0 );
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

//move
void PhysXCharacterController::move(float x, float y, float z, float minDist, float elapsedTime) {
    physx::PxVec3 disp{x, y, z};
    controllerFilter.mFilterData = &_mFilterData;
    controllerFilter.mFilterCallback = &_mFilterCallback;
    _pxCollisionFlags = _impl->move(disp, minDist, elapsedTime, controllerFilter);
}

void PhysXCharacterController::setMinMoveDistance(float v) {
    _mMinMoveDistance = v;
    //_impl->setMinMoveDistance(v);
    if(_impl){
        create();
    }
}

float PhysXCharacterController::getMinMoveDistance() {
    return _mMinMoveDistance;
}

void PhysXCharacterController::setStepOffset(float v) {
    _mStepOffset = v;
    _impl->setStepOffset(v);
}

float PhysXCharacterController::getStepOffset() {
    return _mStepOffset;
    //return _impl->getStepOffset();
}

void PhysXCharacterController::setSlopeLimit(float v) {
    _mSlopeLimit = v;
    _impl->setSlopeLimit(cos(_mSlopeLimit * mathutils::D2R));
}

float PhysXCharacterController::getSlopeLimit() {
    //return _impl->getSlopeLimit();
    return _mSlopeLimit;
}

void PhysXCharacterController::setContactOffset(float v) {
    _mContactOffset = v;
    _impl->setContactOffset(v);
}

float PhysXCharacterController::getContactOffset() {
    //return _impl->getContactOffset();
    return _mContactOffset;
}

void PhysXCharacterController::setDetectCollisions(bool v) {
    physx::PxRigidDynamic* actor = _impl->getActor();
    physx::PxShape* shape;
    actor->getShapes(&shape, 1);
    shape->setFlag(physx::PxShapeFlag::eSIMULATION_SHAPE, v);
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
   // _impl->setQueryFilterData(_mFilterData);
   //_impl->setSimulationFilterData(_mFilterData);
   setSimulationFilterData(_mFilterData);
}

void PhysXCharacterController::setSimulationFilterData(physx::PxFilterData filterData) {
    physx::PxRigidDynamic* actor = _impl->getActor();
    physx::PxShape* shape;
    actor->getShapes(&shape, 1);
    shape->setSimulationFilterData(filterData);
}

void PhysXCharacterController::syncPhysicsToScene() {
    _mNode->setWorldPosition(getPosition());
}

void PhysXCharacterController::insertToCCTMap() {
    if (_impl) {
        getPxCCTMap().insert(std::pair<uintptr_t, uint32_t>(reinterpret_cast<uintptr_t>(_impl), getObjectID()));
    }
}

void PhysXCharacterController::eraseFromCCTMap() {
    if (_impl) {
        getPxCCTMap().erase(reinterpret_cast<uintptr_t>(_impl));
    }
}

} // namespace physics
} // namespace cc
