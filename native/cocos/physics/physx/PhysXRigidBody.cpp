/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "physics/physx/PhysXRigidBody.h"
#include "physics/physx/PhysXInc.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"

using physx::PxActorFlag;
using physx::PxForceMode;
using physx::PxReal;
using physx::PxTransform;
using physx::PxVec3;

namespace cc {
namespace physics {

PhysXRigidBody::PhysXRigidBody() : _mEnabled(false),
                                   _mGroup(1) {}

void PhysXRigidBody::initialize(scene::Node *node, ERigidBodyType t, uint32_t g) {
    _mGroup         = g;
    PhysXWorld &ins = PhysXWorld::getInstance();
    _mSharedBody    = ins.getSharedBody(node, this);
    getSharedBody().reference(true);
    getSharedBody().setType(t);
}

void PhysXRigidBody::onEnable() {
    _mEnabled = true;
    getSharedBody().enabled(true);
}

void PhysXRigidBody::onDisable() {
    _mEnabled = false;
    getSharedBody().enabled(false);
}

void PhysXRigidBody::onDestroy() {
    getSharedBody().reference(false);
}

bool PhysXRigidBody::isAwake() {
    if (getSharedBody().isStatic()) return false;
    return !getSharedBody().getImpl().rigidDynamic->isSleeping();
}

bool PhysXRigidBody::isSleepy() {
    return false;
}

bool PhysXRigidBody::isSleeping() {
    if (!isEnabled() || getSharedBody().isStatic()) return true;
    return getSharedBody().getImpl().rigidDynamic->isSleeping();
}

void PhysXRigidBody::setType(ERigidBodyType v) {
    getSharedBody().setType(v);
}

void PhysXRigidBody::setMass(float v) {
    getSharedBody().setMass(v);
}

void PhysXRigidBody::setLinearDamping(float v) {
    if (getSharedBody().isStatic()) return;
    getSharedBody().getImpl().rigidDynamic->setLinearDamping(v);
}

void PhysXRigidBody::setAngularDamping(float v) {
    if (getSharedBody().isStatic()) return;
    getSharedBody().getImpl().rigidDynamic->setAngularDamping(v);
}

void PhysXRigidBody::useGravity(bool v) {
    if (getSharedBody().isStatic()) return;
    getSharedBody().getImpl().rigidDynamic->setActorFlag(PxActorFlag::eDISABLE_GRAVITY, !v);
}

void PhysXRigidBody::useCCD(bool v) {
    if (getSharedBody().isStatic()) return;
    getSharedBody().getImpl().rigidDynamic->setRigidBodyFlag(physx::PxRigidBodyFlag::eENABLE_CCD, v);
}

void PhysXRigidBody::setLinearFactor(float x, float y, float z) {
    if (getSharedBody().isStatic()) return;
    getSharedBody().getImpl().rigidDynamic->setRigidDynamicLockFlag(physx::PxRigidDynamicLockFlag::eLOCK_LINEAR_X, x == 0.);
    getSharedBody().getImpl().rigidDynamic->setRigidDynamicLockFlag(physx::PxRigidDynamicLockFlag::eLOCK_LINEAR_Y, y == 0.);
    getSharedBody().getImpl().rigidDynamic->setRigidDynamicLockFlag(physx::PxRigidDynamicLockFlag::eLOCK_LINEAR_Z, z == 0.);
}

void PhysXRigidBody::setAngularFactor(float x, float y, float z) {
    if (getSharedBody().isStatic()) return;
    getSharedBody().getImpl().rigidDynamic->setRigidDynamicLockFlag(physx::PxRigidDynamicLockFlag::eLOCK_ANGULAR_X, x == 0.);
    getSharedBody().getImpl().rigidDynamic->setRigidDynamicLockFlag(physx::PxRigidDynamicLockFlag::eLOCK_ANGULAR_Y, y == 0.);
    getSharedBody().getImpl().rigidDynamic->setRigidDynamicLockFlag(physx::PxRigidDynamicLockFlag::eLOCK_ANGULAR_Z, z == 0.);
}

void PhysXRigidBody::setAllowSleep(bool v) {
    if (!getSharedBody().isDynamic()) return;
    PxReal st = getSharedBody().getImpl().rigidDynamic->getSleepThreshold();
    PxReal wc = v ? std::max(0.F, st - 0.001F) : FLT_MAX;
    getSharedBody().getImpl().rigidDynamic->setWakeCounter(wc);
}

void PhysXRigidBody::wakeUp() {
    if (!isEnabled()) return;
    if (getSharedBody().isStatic()) return;
    getSharedBody().getImpl().rigidDynamic->wakeUp();
}

void PhysXRigidBody::sleep() {
    if (!isEnabled()) return;
    if (getSharedBody().isStatic()) return;
    getSharedBody().getImpl().rigidDynamic->putToSleep();
}

void PhysXRigidBody::clearState() {
    if (!isEnabled()) return;
    clearForces();
    clearVelocity();
}

void PhysXRigidBody::clearForces() {
    if (!isEnabled()) return;
    getSharedBody().clearForces();
}

void PhysXRigidBody::clearVelocity() {
    getSharedBody().clearVelocity();
}

void PhysXRigidBody::setSleepThreshold(float v) {
    if (getSharedBody().isStatic()) return;
    getSharedBody().getImpl().rigidDynamic->setSleepThreshold(v);
}

float PhysXRigidBody::getSleepThreshold() {
    return getSharedBody().getImpl().rigidDynamic->getSleepThreshold();
}

cc::Vec3 PhysXRigidBody::getLinearVelocity() {
    if (getSharedBody().isStatic()) return cc::Vec3::ZERO;
    cc::Vec3 cv;
    pxSetVec3Ext(cv, getSharedBody().getImpl().rigidDynamic->getLinearVelocity());
    return cv;
}

void PhysXRigidBody::setLinearVelocity(float x, float y, float z) {
    if (getSharedBody().isStatic()) return;
    getSharedBody().getImpl().rigidDynamic->setLinearVelocity(PxVec3{x, y, z});
}

cc::Vec3 PhysXRigidBody::getAngularVelocity() {
    if (getSharedBody().isStatic()) return cc::Vec3::ZERO;
    cc::Vec3 cv;
    pxSetVec3Ext(cv, getSharedBody().getImpl().rigidDynamic->getAngularVelocity());
    return cv;
}

void PhysXRigidBody::setAngularVelocity(float x, float y, float z) {
    if (getSharedBody().isStatic()) return;
    getSharedBody().getImpl().rigidDynamic->setAngularVelocity(PxVec3{x, y, z});
}

void PhysXRigidBody::applyForce(float x, float y, float z, float rx, float ry, float rz) {
    if (!isEnabled()) return;
    if (getSharedBody().isStatic()) return;
    const PxVec3 force{x, y, z};
    if (force.isZero()) return;
    auto *body = getSharedBody().getImpl().rigidDynamic;
    body->addForce(force, PxForceMode::eFORCE, true);
    const PxVec3 torque = (PxVec3{rx, ry, rz}).cross(force);
    if (!torque.isZero()) body->addTorque(torque, PxForceMode::eFORCE, true);
}

void PhysXRigidBody::applyLocalForce(float x, float y, float z, float rx, float ry, float rz) {
    if (!isEnabled()) return;
    if (getSharedBody().isStatic()) return;
    const PxVec3 force{x, y, z};
    if (force.isZero()) return;
    auto *            body       = getSharedBody().getImpl().rigidDynamic;
    const PxTransform bodyPose   = body->getGlobalPose();
    const PxVec3      worldForce = bodyPose.rotate(force);
    const PxVec3      worldPos   = bodyPose.rotate(PxVec3{rx, ry, rz});
    body->addForce(worldForce, PxForceMode::eFORCE, true);
    const PxVec3 torque = worldPos.cross(worldForce);
    if (!torque.isZero()) body->addTorque(torque, PxForceMode::eFORCE, true);
}

void PhysXRigidBody::applyImpulse(float x, float y, float z, float rx, float ry, float rz) {
    if (!isEnabled()) return;
    if (getSharedBody().isStatic()) return;
    const PxVec3 impulse{x, y, z};
    if (impulse.isZero()) return;
    auto *       body   = getSharedBody().getImpl().rigidDynamic;
    const PxVec3 torque = (PxVec3{rx, ry, rz}).cross(impulse);
    body->addForce(impulse, PxForceMode::eIMPULSE, true);
    if (!torque.isZero()) body->addTorque(torque, PxForceMode::eIMPULSE, true);
}

void PhysXRigidBody::applyLocalImpulse(float x, float y, float z, float rx, float ry, float rz) {
    if (!isEnabled()) return;
    if (getSharedBody().isStatic()) return;
    const PxVec3 impulse{x, y, z};
    if (impulse.isZero()) return;
    auto *            body         = getSharedBody().getImpl().rigidDynamic;
    const PxTransform bodyPose     = body->getGlobalPose();
    const PxVec3      worldImpulse = bodyPose.rotate(impulse);
    const PxVec3      worldPos     = bodyPose.rotate(PxVec3{rx, ry, rz});
    body->addForce(worldImpulse, PxForceMode::eIMPULSE, true);
    const PxVec3 torque = worldPos.cross(worldImpulse);
    if (!torque.isZero()) body->addTorque(torque, PxForceMode::eIMPULSE, true);
}

void PhysXRigidBody::applyTorque(float x, float y, float z) {
    if (!isEnabled()) return;
    if (getSharedBody().isStatic()) return;
    PxVec3 torque{x, y, z};
    if (torque.isZero()) return;
    getSharedBody().getImpl().rigidDynamic->addTorque(torque, PxForceMode::eFORCE, true);
}

void PhysXRigidBody::applyLocalTorque(float x, float y, float z) {
    if (!isEnabled()) return;
    if (getSharedBody().isStatic()) return;
    PxVec3 torque{x, y, z};
    if (torque.isZero()) return;
    auto *            body     = getSharedBody().getImpl().rigidDynamic;
    const PxTransform bodyPose = body->getGlobalPose();
    body->addTorque(bodyPose.rotate(PxVec3{x, y, z}), PxForceMode::eFORCE, true);
}

uint32_t PhysXRigidBody::getGroup() {
    return getSharedBody().getGroup();
}

void PhysXRigidBody::setGroup(uint32_t g) {
    getSharedBody().setGroup(g);
}

uint32_t PhysXRigidBody::getMask() {
    return getSharedBody().getMask();
}

void PhysXRigidBody::setMask(uint32_t m) {
    getSharedBody().setMask(m);
}

} // namespace physics
} // namespace cc
