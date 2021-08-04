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

#include "physics/sdk/RigidBody.h"
#include <memory>
#include "physics/PhysicsSelector.h"

namespace cc {
namespace physics {

RigidBody::RigidBody() {
    _impl = std::make_unique<WrappedRigidBody>();
}

RigidBody::~RigidBody() {
    _impl.reset(nullptr);
}

void RigidBody::initialize(scene::Node *node, const ERigidBodyType t, const uint32_t g) {
    _impl->initialize(node, t, g);
}

void RigidBody::onEnable() {
    _impl->onEnable();
}

void RigidBody::onDisable() {
    _impl->onDisable();
}

void RigidBody::onDestroy() {
    _impl->onDestroy();
}

bool RigidBody::isAwake() {
    return _impl->isAwake();
}

bool RigidBody::isSleepy() {
    return _impl->isSleepy();
}

bool RigidBody::isSleeping() {
    return _impl->isSleeping();
}

void RigidBody::setType(ERigidBodyType v) {
    _impl->setType(v);
}

void RigidBody::setMass(float v) {
    _impl->setMass(v);
}

void RigidBody::setLinearDamping(float v) {
    _impl->setLinearDamping(v);
}

void RigidBody::setAngularDamping(float v) {
    _impl->setAngularDamping(v);
}

void RigidBody::useCCD(bool v) {
    _impl->useCCD(v);
}

void RigidBody::useGravity(bool v) {
    _impl->useGravity(v);
}

void RigidBody::setLinearFactor(float x, float y, float z) {
    _impl->setLinearFactor(x, y, z);
}

void RigidBody::setAngularFactor(float x, float y, float z) {
    _impl->setAngularFactor(x, y, z);
}

void RigidBody::setAllowSleep(bool v) {
    _impl->setAllowSleep(v);
}

void RigidBody::wakeUp() {
    _impl->wakeUp();
}

void RigidBody::sleep() {
    _impl->sleep();
}

void RigidBody::clearState() {
    _impl->clearState();
}

void RigidBody::clearForces() {
    _impl->clearForces();
}

void RigidBody::clearVelocity() {
    _impl->clearVelocity();
}

void RigidBody::setSleepThreshold(float v) {
    _impl->setSleepThreshold(v);
}

float RigidBody::getSleepThreshold() {
    return _impl->getSleepThreshold();
}

cc::Vec3 RigidBody::getLinearVelocity() {
    return _impl->getLinearVelocity();
}

void RigidBody::setLinearVelocity(float x, float y, float z) {
    _impl->setLinearVelocity(x, y, z);
}

cc::Vec3 RigidBody::getAngularVelocity() {
    return _impl->getAngularVelocity();
}

void RigidBody::setAngularVelocity(float x, float y, float z) {
    _impl->setAngularVelocity(x, y, z);
}

void RigidBody::applyForce(float x, float y, float z, float rx, float ry, float rz) {
    _impl->applyForce(x, y, z, rx, ry, rz);
}

void RigidBody::applyLocalForce(float x, float y, float z, float rx, float ry, float rz) {
    _impl->applyLocalForce(x, y, z, rx, ry, rz);
}

void RigidBody::applyImpulse(float x, float y, float z, float rx, float ry, float rz) {
    _impl->applyImpulse(x, y, z, rx, ry, rz);
}

void RigidBody::applyLocalImpulse(float x, float y, float z, float rx, float ry, float rz) {
    _impl->applyLocalImpulse(x, y, z, rx, ry, rz);
}

void RigidBody::applyTorque(float x, float y, float z) {
    _impl->applyTorque(x, y, z);
}

void RigidBody::applyLocalTorque(float x, float y, float z) {
    _impl->applyLocalTorque(x, y, z);
}

uint32_t RigidBody::getGroup() {
    return _impl->getGroup();
}

void RigidBody::setGroup(uint32_t g) {
    _impl->setGroup(g);
}

uint32_t RigidBody::getMask() {
    return _impl->getMask();
}

void RigidBody::setMask(uint32_t m) {
    _impl->setMask(m);
}

} // namespace physics
} // namespace cc
