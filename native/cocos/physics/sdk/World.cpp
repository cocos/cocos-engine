/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "physics/PhysicsSelector.h"
#include "physics/sdk/World.h"
#include <memory>

namespace cc {
namespace physics {

World::World() {
    _impl = std::make_unique<WrappedWorld>();
}

World::~World() {
    _impl.reset(nullptr);
}

void World::emitEvents() {
    _impl->emitEvents();
}

void World::step(float fixedTimeStep) {
    _impl->step(fixedTimeStep);
}

void World::setAllowSleep(bool v) {
    _impl->setAllowSleep(v);
}

void World::setGravity(float x, float y, float z) {
    _impl->setGravity(x, y, z);
}

uintptr_t World::createMaterial(uint16_t id, float f, float df, float r,
                               uint8_t m0, uint8_t m1) {
    return _impl->createMaterial(id, f, df, r, m0, m1);
}

void World::syncSceneToPhysics() {
    _impl->syncSceneToPhysics();
}

void World::syncSceneWithCheck() {
    _impl->syncSceneWithCheck();
}

void World::destroy() {
    _impl->destroy();
}

std::vector<std::shared_ptr<TriggerEventPair>> &World::getTriggerEventPairs() {
    return _impl->getTriggerEventPairs();
}

std::vector<std::shared_ptr<ContactEventPair>> &World::getContactEventPairs() {
    return _impl->getContactEventPairs();
}

void World::setCollisionMatrix(uint32_t i, uint32_t m) {
    _impl->setCollisionMatrix(i, m);
}

uintptr_t World::createConvex(ConvexDesc &desc) {
    return _impl->createConvex(desc);
}

uintptr_t World::createTrimesh(TrimeshDesc &desc) {
    return _impl->createTrimesh(desc);
}

uintptr_t World::createHeightField(HeightFieldDesc &desc) {
    return _impl->createHeightField(desc);
}

bool World::raycast(RaycastOptions &opt) {
    return _impl->raycast(opt);
}

std::vector<RaycastResult> &World::raycastResult() {
    return _impl->raycastResult();
}

bool World::raycastClosest(RaycastOptions &opt) {
    return _impl->raycastClosest(opt);
}

RaycastResult &World::raycastClosestResult() {
    return _impl->raycastClosestResult();
}

} // namespace physics
} // namespace cc
