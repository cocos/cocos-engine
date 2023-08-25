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

#include "physics/physx/PhysXEventManager.h"
#include <algorithm>
#include "physics/physx/PhysXInc.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"
#include "physics/physx/shapes/PhysXShape.h"

namespace cc {
namespace physics {

void PhysXEventManager::SimulationEventCallback::onTrigger(physx::PxTriggerPair *pairs, physx::PxU32 count) {
    for (physx::PxU32 i = 0; i < count; i++) {
        const physx::PxTriggerPair &triggerPair = pairs[i];
        if (triggerPair.flags & (physx::PxTriggerPairFlag::eREMOVED_SHAPE_TRIGGER | physx::PxTriggerPairFlag::eREMOVED_SHAPE_OTHER)) {
            continue;
        }

        bool processed = false;

        //collider trigger event
        if (!processed) {
            const auto &selfIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(triggerPair.triggerShape));
            const auto &otherIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(triggerPair.otherShape));
            if (selfIter != getPxShapeMap().end() && otherIter != getPxShapeMap().end()) {
                processed = true;
                const auto &self = selfIter->second;
                const auto &other = otherIter->second;
                auto &pairs = mManager->getTriggerPairs();
                const auto &iter = std::find_if(pairs.begin(), pairs.end(), [self, other](std::shared_ptr<TriggerEventPair> &pair) {
                    return (pair->shapeA == self || pair->shapeA == other) && (pair->shapeB == self || pair->shapeB == other);
                });
                if (triggerPair.status & physx::PxPairFlag::eNOTIFY_TOUCH_FOUND) {
                    if (iter == pairs.end()) pairs.push_back(std::shared_ptr<TriggerEventPair>(ccnew TriggerEventPair{self, other}));
                } else if (triggerPair.status & physx::PxPairFlag::eNOTIFY_TOUCH_LOST) {
                    if (iter != pairs.end()) iter->get()->state = ETouchState::EXIT;
                }
            }
        }

        //cct trigger event
        if (!processed) {
            const auto &shapeIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(triggerPair.triggerShape));
            const auto &cctIter = getPxCCTMap().find(reinterpret_cast<uintptr_t>(triggerPair.otherShape));
            if (shapeIter != getPxShapeMap().end() && cctIter != getPxCCTMap().end()) {
                processed = true;
                const auto &shape = shapeIter->second;
                const auto &cct = cctIter->second;
                auto &pairs = mManager->getCCTTriggerPairs();
                const auto &iter = std::find_if(pairs.begin(), pairs.end(), [shape, cct](std::shared_ptr<CCTTriggerEventPair> &pair) {
                    return (pair->shape == shape && pair->cct == cct);
                });
                if (triggerPair.status & physx::PxPairFlag::eNOTIFY_TOUCH_FOUND) {
                    if (iter == pairs.end()) pairs.push_back(std::shared_ptr<CCTTriggerEventPair>(ccnew CCTTriggerEventPair{cct, shape}));
                } else if (triggerPair.status & physx::PxPairFlag::eNOTIFY_TOUCH_LOST) {
                    if (iter != pairs.end()) iter->get()->state = ETouchState::EXIT;
                }
            }
        }

        //cct trigger event
        if (!processed) {
            const auto &cctIter = getPxCCTMap().find(reinterpret_cast<uintptr_t>(triggerPair.triggerShape));
            const auto &shapeIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(triggerPair.otherShape));
            if (shapeIter != getPxShapeMap().end() && cctIter != getPxCCTMap().end()) {
                processed = true;
                const auto &shape = shapeIter->second;
                const auto &cct = cctIter->second;
                auto &pairs = mManager->getCCTTriggerPairs();
                const auto &iter = std::find_if(pairs.begin(), pairs.end(), [shape, cct](std::shared_ptr<CCTTriggerEventPair> &pair) {
                    return (pair->shape == shape && pair->cct == cct);
                });
                if (triggerPair.status & physx::PxPairFlag::eNOTIFY_TOUCH_FOUND) {
                    if (iter == pairs.end()) pairs.push_back(std::shared_ptr<CCTTriggerEventPair>(ccnew CCTTriggerEventPair{cct, shape}));
                } else if (triggerPair.status & physx::PxPairFlag::eNOTIFY_TOUCH_LOST) {
                    if (iter != pairs.end()) iter->get()->state = ETouchState::EXIT;
                }
            }
        }
    }
}

void PhysXEventManager::SimulationEventCallback::onContact(const physx::PxContactPairHeader & /*header*/, const physx::PxContactPair *pairs, physx::PxU32 count) {
    for (physx::PxU32 i = 0; i < count; i++) {
        const physx::PxContactPair &cp = pairs[i];
        if (cp.flags & (physx::PxContactPairFlag::eREMOVED_SHAPE_0 | physx::PxContactPairFlag::eREMOVED_SHAPE_1)) {
            continue;
        }

        const auto &selfIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(cp.shapes[0]));
        const auto &otherIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(cp.shapes[1]));
        if (selfIter == getPxShapeMap().end() || otherIter == getPxShapeMap().end()) {
            continue;
        }

        const auto &self = selfIter->second;
        const auto &other = otherIter->second;
        auto &pairs = mManager->getConatctPairs();
        auto iter = std::find_if(pairs.begin(), pairs.end(), [self, other](std::shared_ptr<ContactEventPair> &pair) {
            return (pair->shapeA == self || pair->shapeA == other) && (pair->shapeB == self || pair->shapeB == other);
        });

        if (iter == pairs.end()) {
            pairs.push_back(std::shared_ptr<ContactEventPair>(ccnew ContactEventPair{self, other}));
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
        uintptr_t wrapperPtrShapeA = PhysXWorld::getInstance().getWrapperPtrWithObjectID(iter->get()->shapeA);
        uintptr_t wrapperPtrShapeB = PhysXWorld::getInstance().getWrapperPtrWithObjectID(iter->get()->shapeB);
        if (wrapperPtrShapeA == 0 || wrapperPtrShapeB == 0) {
            iter = getTriggerPairs().erase(iter);
            continue;
        }

        const auto &selfIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(&(reinterpret_cast<PhysXShape *>(wrapperPtrShapeA)->getShape())));
        const auto &otherIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(&(reinterpret_cast<PhysXShape *>(wrapperPtrShapeB)->getShape())));
        if (selfIter == getPxShapeMap().end() || otherIter == getPxShapeMap().end()) {
            iter = getTriggerPairs().erase(iter);
        } else if (iter->get()->state == ETouchState::EXIT) {
            iter = getTriggerPairs().erase(iter);
        } else {
            iter->get()->state = ETouchState::STAY;
            iter++;
        }
    }

    for (auto iter = getCCTTriggerPairs().begin(); iter != getCCTTriggerPairs().end();) {
        uintptr_t wrapperPtrCCT = PhysXWorld::getInstance().getWrapperPtrWithObjectID(iter->get()->cct);
        uintptr_t wrapperPtrShape = PhysXWorld::getInstance().getWrapperPtrWithObjectID(iter->get()->shape);
        if (wrapperPtrCCT == 0 || wrapperPtrShape == 0) {
            iter = getCCTTriggerPairs().erase(iter);
            continue;
        }

        const auto& cctIter = getPxCCTMap().find(reinterpret_cast<uintptr_t>(&(reinterpret_cast<PhysXCharacterController*>(wrapperPtrCCT)->getCCT())));
        const auto& shapeIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(&(reinterpret_cast<PhysXShape*>(wrapperPtrShape)->getShape())));
        if (cctIter == getPxCCTMap().end() || shapeIter == getPxShapeMap().end()) {
            iter = getCCTTriggerPairs().erase(iter);
        }
        else if (iter->get()->state == ETouchState::EXIT) {
            iter = getCCTTriggerPairs().erase(iter);
        }
        else {
            iter->get()->state = ETouchState::STAY;
            iter++;
        }
    }

    getConatctPairs().clear();
    getCCTShapePairs().clear();
}

} // namespace physics
} // namespace cc
