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

#pragma once

#include <memory>
#include "base/Macros.h"
#include "base/memory/Memory.h"
#include "base/std/container/vector.h"
#include "physics/physx/PhysXInc.h"
#include "physics/spec/IWorld.h"

namespace cc {
namespace physics {

class PhysXEventManager final {
public:
    PhysXEventManager() {
        _mCallback = ccnew SimulationEventCallback(this);
    }

    ~PhysXEventManager() {
        delete _mCallback;
    }

    struct SimulationEventCallback : public physx::PxSimulationEventCallback {
        void onConstraintBreak(physx::PxConstraintInfo * /*constraints*/, physx::PxU32 /*count*/) override{};
        void onWake(physx::PxActor ** /*actors*/, physx::PxU32 /*count*/) override{};
        void onSleep(physx::PxActor ** /*actors*/, physx::PxU32 /*count*/) override{};
        void onTrigger(physx::PxTriggerPair * /*pairs*/, physx::PxU32 /*count*/) override;
        void onContact(const physx::PxContactPairHeader & /*pairHeader*/, const physx::PxContactPair * /*pairs*/, physx::PxU32 /*nbPairs*/) override;
        void onAdvance(const physx::PxRigidBody *const * /*bodyBuffer*/, const physx::PxTransform * /*poseBuffer*/, const physx::PxU32 /*count*/) override{};
        PhysXEventManager *mManager;

    public:
        explicit SimulationEventCallback(PhysXEventManager *m) : mManager(m) {}
    };

    inline SimulationEventCallback &getEventCallback() { return *_mCallback; }
    inline ccstd::vector<std::shared_ptr<TriggerEventPair>> &getTriggerPairs() { return _mTriggerPairs; }
    inline ccstd::vector<std::shared_ptr<ContactEventPair>> &getConatctPairs() { return _mConatctPairs; }
    void refreshPairs();

private:
    ccstd::vector<std::shared_ptr<TriggerEventPair>> _mTriggerPairs;
    ccstd::vector<std::shared_ptr<ContactEventPair>> _mConatctPairs;
    SimulationEventCallback *_mCallback;
};

} // namespace physics
} // namespace cc
