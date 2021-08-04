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

#pragma once

#include <memory>
#include "base/Macros.h"
#include "physics/physx/PhysXEventManager.h"
#include "physics/physx/PhysXFilterShader.h"
#include "physics/physx/PhysXInc.h"
#include "physics/physx/PhysXRigidBody.h"
#include "physics/physx/PhysXSharedBody.h"
#include "physics/spec/IWorld.h"
#include "scene/Node.h"

namespace cc {
namespace physics {

class PhysXWorld final : virtual public IPhysicsWorld {
public:
    static PhysXWorld &         getInstance();
    static physx::PxFoundation &getFundation();
    static physx::PxCooking &   getCooking();
    static physx::PxPhysics &   getPhysics();
    PhysXWorld();
    ~PhysXWorld() override;
    void                        step(float fixedTimeStep) override;
    void                        setGravity(float x, float y, float z) override;
    void                        setAllowSleep(bool v) override;
    void                        emitEvents() override;
    void                        setCollisionMatrix(uint32_t index, uint32_t mask) override;
    bool                        raycast(RaycastOptions &opt) override;
    bool                        raycastClosest(RaycastOptions &opt) override;
    std::vector<RaycastResult> &raycastResult() override;
    RaycastResult &             raycastClosestResult() override;
    uintptr_t                   createConvex(ConvexDesc &desc) override;
    uintptr_t                   createTrimesh(TrimeshDesc &desc) override;
    uintptr_t                   createHeightField(HeightFieldDesc &desc) override;
    uintptr_t                   createMaterial(uint16_t id, float f, float df, float r,
                                               uint8_t m0, uint8_t m1) override;
    inline std::vector<std::shared_ptr<TriggerEventPair>> &getTriggerEventPairs() override {
        return _mEventMgr->getTriggerPairs();
    }
    inline std::vector<std::shared_ptr<ContactEventPair>> &getContactEventPairs() override {
        return _mEventMgr->getConatctPairs();
    }
    void syncSceneToPhysics() override;
    void syncSceneWithCheck() override;
    void destroy() override;

    inline PhysXSharedBody *getSharedBody(
        const scene::Node *   node,
        PhysXRigidBody *const body = nullptr) {
        return PhysXSharedBody::getSharedBody(node, this, body);
    }

    inline physx::PxScene &getScene() const { return *_mScene; }
    uint32_t                  getMaskByIndex(uint32_t i);
    void                      syncPhysicsToScene();
    void                      addActor(const PhysXSharedBody &sb);
    void                      removeActor(const PhysXSharedBody &sb);

private:
    static PhysXWorld *  instance;
    physx::PxFoundation *_mFoundation;
    physx::PxCooking *   _mCooking;
    physx::PxPhysics *   _mPhysics;
#ifdef CC_DEBUG
    physx::PxPvd *_mPvd;
#endif
    physx::PxDefaultCpuDispatcher *_mDispatcher;
    physx::PxScene *               _mScene;
    PhysXEventManager *            _mEventMgr;
    uint32_t                       _mCollisionMatrix[31];
    std::vector<PhysXSharedBody *> _mSharedBodies;
};

} // namespace physics
} // namespace cc
