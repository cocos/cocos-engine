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

#pragma once

#include "physics/spec/IWorld.h"
#include "physics/physx/PhysXInc.h"
#include "base/Macros.h"
#include <memory>
#include <vector>

namespace cc {
namespace physics {

class PhysXEventManager final {
public:
    PhysXEventManager() {
        _mCallback = new SimulationEventCallback(this);
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
    inline std::vector<std::shared_ptr<TriggerEventPair>> &getTriggerPairs() { return _mTriggerPairs; }
    inline std::vector<std::shared_ptr<ContactEventPair>> &getConatctPairs() { return _mConatctPairs; }
    void refreshPairs();

private:
    std::vector<std::shared_ptr<TriggerEventPair>> _mTriggerPairs;
    std::vector<std::shared_ptr<ContactEventPair>> _mConatctPairs;
    SimulationEventCallback *_mCallback;
};

} // namespace physics
} // namespace cc
