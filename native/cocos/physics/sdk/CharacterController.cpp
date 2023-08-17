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

#include "physics/sdk/CharacterController.h"
#include <memory>
#include "physics/PhysicsSelector.h"

#define CC_PHYSICS_CCT_DEFINITION(CLASS, WRAPPED)                               \
                                                                                \
CLASS::CLASS() {                                                                \
    _impl.reset(ccnew WRAPPED());                                               \
}                                                                               \
                                                                                \
CLASS::~CLASS() {                                                               \
    _impl.reset(nullptr);                                                       \
}                                                                               \
                                                                                \
bool CLASS::initialize(Node *node) {                                            \
    return _impl->initialize(node);                                             \
}                                                                               \
                                                                                \
void CLASS::onEnable() {                                                        \
    _impl->onEnable();                                                          \
}                                                                               \
                                                                                \
void CLASS::onDisable() {                                                       \
    _impl->onDisable();                                                         \
}                                                                               \
                                                                                \
void CLASS::onDestroy() {                                                       \
    _impl->onDestroy();                                                         \
}                                                                               \
                                                                                \
cc::Vec3 CLASS::getPosition() {                                                 \
    return _impl->getPosition();                                                \
}                                                                               \
                                                                                \
void CLASS::setPosition(float x, float y, float z) {                            \
    _impl->setPosition(x, y, z);                                                \
}                                                                               \
                                                                                \
bool CLASS::onGround() {                                                        \
    return _impl->onGround();                                                   \
}                                                                               \
                                                                                \
void CLASS::move(float x, float y, float z, float minDist, float elapsedTime) { \
    _impl->move(x, y, z, minDist, elapsedTime);                                 \
}                                                                               \
                                                                                \
void CLASS::syncPhysicsToScene() {                                              \
    _impl->syncPhysicsToScene();                                                \
}                                                                               \
                                                                                \
void CLASS::setStepOffset(float v) {                                            \
    _impl->setStepOffset(v);                                                    \
}                                                                               \
                                                                                \
float CLASS::getStepOffset() {                                                  \
    return _impl->getStepOffset();                                              \
}                                                                               \
                                                                                \
void CLASS::setSlopeLimit(float v) {                                            \
    _impl->setSlopeLimit(v);                                                    \
}                                                                               \
                                                                                \
float CLASS::getSlopeLimit() {                                                  \
    return _impl->getSlopeLimit();                                              \
}                                                                               \
                                                                                \
void CLASS::setContactOffset(float v) {                                         \
    _impl->setContactOffset(v);                                                 \
}                                                                               \
                                                                                \
float CLASS::getContactOffset() {                                               \
    return _impl->getContactOffset();                                           \
}                                                                               \
                                                                                \
void CLASS::setDetectCollisions(bool v) {                                       \
    _impl->setDetectCollisions(v);                                              \
}                                                                               \
void CLASS::setOverlapRecovery(bool v) {                                        \
    _impl->setOverlapRecovery(v);                                               \
}                                                                               \
void CLASS::setCenter(float x, float y, float z) {                              \
    _impl->setCenter(x, y, z);                                                  \
}                                                                               \
uint32_t CLASS::getGroup() {                                                    \
    return _impl->getGroup();                                                   \
}                                                                               \
                                                                                \
void CLASS::setGroup(uint32_t g) {                                              \
    _impl->setGroup(g);                                                         \
}                                                                               \
                                                                                \
uint32_t CLASS::getMask() {                                                     \
    return _impl->getMask();                                                    \
}                                                                               \
                                                                                \
void CLASS::setMask(uint32_t m) {                                               \
    _impl->setMask(m);                                                          \
}                                                                               \
void CLASS::updateEventListener(EShapeFilterFlag flag) {                        \
    _impl->updateEventListener(flag);                                           \
}                                                                               \
uint32_t CLASS::getObjectID()const {                                            \
    return _impl->getObjectID();                                                \
}                                                                               \
                                                                                \

namespace cc {
namespace physics {

/// COMMON ///
CC_PHYSICS_CCT_DEFINITION(CapsuleCharacterController, WrappedCapsuleCharacterController)
CC_PHYSICS_CCT_DEFINITION(BoxCharacterController, WrappedBoxCharacterController)

/// EXTRAS ///

void CapsuleCharacterController::setRadius(float v) {
    _impl->setRadius(v);
}

void CapsuleCharacterController::setHeight(float v) {
    _impl->setHeight(v);
}

void BoxCharacterController::setHalfHeight(float v) {
    _impl->setHalfHeight(v);
}

void BoxCharacterController::setHalfSideExtent(float v) {
    _impl->setHalfSideExtent(v);
}

void BoxCharacterController::setHalfForwardExtent(float v) {
    _impl->setHalfForwardExtent(v);
}

} // namespace physics
} // namespace cc
