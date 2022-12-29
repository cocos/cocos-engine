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

#include "physics/sdk/World.h"
#include <memory>
#include "physics/PhysicsSelector.h"

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

bool World::createMaterial(uint16_t id, float f, float df, float r,
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

ccstd::vector<std::shared_ptr<TriggerEventPair>> &World::getTriggerEventPairs() {
    return _impl->getTriggerEventPairs();
}

ccstd::vector<std::shared_ptr<ContactEventPair>> &World::getContactEventPairs() {
    return _impl->getContactEventPairs();
}

void World::setCollisionMatrix(uint32_t i, uint32_t m) {
    _impl->setCollisionMatrix(i, m);
}

uint32_t World::createConvex(ConvexDesc &desc) {
    return _impl->createConvex(desc);
}

uint32_t World::createTrimesh(TrimeshDesc &desc) {
    return _impl->createTrimesh(desc);
}

uint32_t World::createHeightField(HeightFieldDesc &desc) {
    return _impl->createHeightField(desc);
}

bool World::raycast(RaycastOptions &opt) {
    return _impl->raycast(opt);
}

ccstd::vector<RaycastResult> &World::raycastResult() {
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
