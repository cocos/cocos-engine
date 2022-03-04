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

#include "physics/physx/PhysXEventManager.h"
#include <algorithm>
#include "physics/physx/PhysXInc.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/shapes/PhysXShape.h"
#include "physics/spec/IWorld.h"

namespace cc {
namespace physics {

void PhysXEventManager::SimulationEventCallback::onTrigger(physx::PxTriggerPair *pairs, physx::PxU32 count) {
    for (physx::PxU32 i = 0; i < count; i++) {
        const physx::PxTriggerPair &tp = pairs[i];
        if (tp.flags & (physx::PxTriggerPairFlag::eREMOVED_SHAPE_TRIGGER | physx::PxTriggerPairFlag::eREMOVED_SHAPE_OTHER)) {
            continue;
        }

        const auto &selfIter  = getPxShapeMap().find(reinterpret_cast<uintptr_t>(tp.triggerShape));
        const auto &otherIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(tp.otherShape));
        if (selfIter == getPxShapeMap().end() || otherIter == getPxShapeMap().end()) {
            continue;
        }

        const auto &self  = selfIter->second;
        const auto &other = otherIter->second;
        auto &      pairs = mManager->getTriggerPairs();
        const auto &iter  = std::find_if(pairs.begin(), pairs.end(), [self, other](std::shared_ptr<TriggerEventPair> &pair) {
            return (pair->shapeA == self || pair->shapeA == other) && (pair->shapeB == self || pair->shapeB == other);
        });
        if (tp.status & physx::PxPairFlag::eNOTIFY_TOUCH_FOUND) {
            if (iter == pairs.end()) pairs.push_back(std::shared_ptr<TriggerEventPair>(new TriggerEventPair{self, other}));
        } else if (tp.status & physx::PxPairFlag::eNOTIFY_TOUCH_LOST) {
            if (iter != pairs.end()) iter->get()->state = ETouchState::EXIT;
        }
    }
}

void PhysXEventManager::SimulationEventCallback::onContact(const physx::PxContactPairHeader & /*header*/, const physx::PxContactPair *pairs, physx::PxU32 count) {
    for (physx::PxU32 i = 0; i < count; i++) {
        const physx::PxContactPair &cp = pairs[i];
        if (cp.flags & (physx::PxContactPairFlag::eREMOVED_SHAPE_0 | physx::PxContactPairFlag::eREMOVED_SHAPE_1)) {
            continue;
        }

        const auto &selfIter  = getPxShapeMap().find(reinterpret_cast<uintptr_t>(cp.shapes[0]));
        const auto &otherIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(cp.shapes[1]));
        if (selfIter == getPxShapeMap().end() || otherIter == getPxShapeMap().end()) {
            continue;
        }

        const auto &self  = selfIter->second;
        const auto &other = otherIter->second;
        auto &      pairs = mManager->getConatctPairs();
        auto        iter  = std::find_if(pairs.begin(), pairs.end(), [self, other](std::shared_ptr<ContactEventPair> &pair) {
            return (pair->shapeA == self || pair->shapeA == other) && (pair->shapeB == self || pair->shapeB == other);
        });

        if (iter == pairs.end()) {
            pairs.push_back(std::shared_ptr<ContactEventPair>(new ContactEventPair{self, other}));
            iter = pairs.end() - 1;
        }

        if (cp.events & physx::PxPairFlag::eNOTIFY_TOUCH_PERSISTS) {
            iter->get()->state = ETouchState::STAY;
        } else if (cp.events & physx::PxPairFlag::eNOTIFY_TOUCH_FOUND) {
            iter->get()->state = ETouchState::ENTER;
        } else if (cp.events & physx::PxPairFlag::eNOTIFY_TOUCH_LOST) {
            iter->get()->state = ETouchState::EXIT;
        }

        const physx::PxU8 &contactCount = cp.contactCount;
        iter->get()->contacts.resize(contactCount);
        if (contactCount > 0) {
            cp.extractContacts(reinterpret_cast<physx::PxContactPairPoint *>(&iter->get()->contacts[0]), contactCount);
        }
    }
}

void PhysXEventManager::refreshPairs() {
    for (auto iter = getTriggerPairs().begin(); iter != getTriggerPairs().end();) {
        const auto &selfIter  = getPxShapeMap().find(reinterpret_cast<uintptr_t>(&(reinterpret_cast<PhysXShape *>(iter->get()->shapeA)->getShape())));
        const auto &otherIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(&(reinterpret_cast<PhysXShape *>(iter->get()->shapeB)->getShape())));
        if (selfIter == getPxShapeMap().end() || otherIter == getPxShapeMap().end()) {
            iter = getTriggerPairs().erase(iter);
        } else if (iter->get()->state == ETouchState::EXIT) {
            iter = getTriggerPairs().erase(iter);
        } else {
            iter->get()->state = ETouchState::STAY;
            iter++;
        }
    }

    getConatctPairs().clear();
}

} // namespace physics
} // namespace cc