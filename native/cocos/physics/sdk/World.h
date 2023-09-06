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
#include "physics/spec/IWorld.h"

namespace cc {
namespace physics {
class CC_DLL World final : public IPhysicsWorld {
public:
    World();
    ~World() override;
    void setGravity(float x, float y, float z) override;
    void setAllowSleep(bool v) override;
    void step(float fixedTimeStep) override;
    void emitEvents() override;
    void syncSceneToPhysics() override;
    void syncSceneWithCheck() override;
    void setDebugDrawFlags(EPhysicsDrawFlags flags) override;
    EPhysicsDrawFlags getDebugDrawFlags() override;
    void setDebugDrawConstraintSize(float size) override;
    float getDebugDrawConstraintSize() override;
    void setCollisionMatrix(uint32_t i, uint32_t m) override;
    ccstd::vector<std::shared_ptr<TriggerEventPair>> &getTriggerEventPairs() override;
    ccstd::vector<std::shared_ptr<ContactEventPair>>& getContactEventPairs() override;
    ccstd::vector<std::shared_ptr<CCTShapeEventPair>>& getCCTShapeEventPairs() override;
    ccstd::vector<std::shared_ptr<CCTTriggerEventPair>>& getCCTTriggerEventPairs() override;
    bool raycast(RaycastOptions &opt) override;
    bool raycastClosest(RaycastOptions &opt) override;
    ccstd::vector<RaycastResult> &raycastResult() override;
    RaycastResult &raycastClosestResult() override;
    bool sweepBox(RaycastOptions &opt, float halfExtentX, float halfExtentY, float halfExtentZ,
        float orientationW, float orientationX, float orientationY, float orientationZ) override;
    bool sweepBoxClosest(RaycastOptions &opt, float halfExtentX, float halfExtentY, float halfExtentZ,
        float orientationW, float orientationX, float orientationY, float orientationZ) override;
    bool sweepSphere(RaycastOptions &opt, float radius) override;
    bool sweepSphereClosest(RaycastOptions &opt, float radius) override;
    bool sweepCapsule(RaycastOptions &opt, float radius, float height,
        float orientationW, float orientationX, float orientationY, float orientationZ) override;
    bool sweepCapsuleClosest(RaycastOptions &opt, float radius, float height,
        float orientationW, float orientationX, float orientationY, float orientationZ) override;
    RaycastResult &sweepClosestResult() override;
    ccstd::vector<RaycastResult> &sweepResult() override;

    uint32_t createConvex(ConvexDesc &desc) override;
    uint32_t createTrimesh(TrimeshDesc &desc) override;
    uint32_t createHeightField(HeightFieldDesc &desc) override;
    bool createMaterial(uint16_t id, float f, float df, float r,
                        uint8_t m0, uint8_t m1) override;
    float getFixedTimeStep() const override;
    void setFixedTimeStep(float fixedTimeStep) override;

    void destroy() override;

private:
    std::unique_ptr<IPhysicsWorld> _impl;
};
} // namespace physics
} // namespace cc
