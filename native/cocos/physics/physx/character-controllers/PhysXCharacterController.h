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

#pragma once

#include "base/Macros.h"
#include "core/scene-graph/Node.h"
#include "physics/physx/PhysXInc.h"
#include "physics/spec/ICharacterController.h"

namespace cc {
namespace physics {

class ControllerHitReport : public physx::PxUserControllerHitReport {
public:
    virtual void onShapeHit(const physx::PxControllerShapeHit& hit) override;
    virtual void onControllerHit(const physx::PxControllersHit& hit) override;
    virtual void onObstacleHit(const physx::PxControllerObstacleHit& hit) override;
};

class QueryFilterCallback : public physx::PxQueryFilterCallback {
public:
    virtual physx::PxQueryHitType::Enum preFilter(const physx::PxFilterData& filterData, const physx::PxShape* shape,
    const physx::PxRigidActor* actor, physx::PxHitFlags& queryFlags) override;
    
    virtual physx::PxQueryHitType::Enum postFilter(const physx::PxFilterData& filterData, const physx::PxQueryHit& hit) override;
};

class PhysXCharacterController : virtual public IBaseCharacterController {
    PX_NOCOPY(PhysXCharacterController)
        PhysXCharacterController();

public:
    ~PhysXCharacterController() override = default;

    void syncScale();
    void syncSceneToPhysics();
    virtual void syncPhysicsToScene() override;

    //ILifecycle
    void onEnable() override;
    void onDisable() override;
    void onDestroy() override;
    //ILifecycle END

    //ICharacterController
    bool initialize(Node* node) override;
    virtual cc::Vec3 getPosition() override;
    virtual void setPosition(float x, float y, float z) override;
    virtual bool onGround() override;
    virtual void move(float x, float y, float z, float minDist, float elapsedTime) override;
    virtual void setStepOffset(float v) override;
    virtual float getStepOffset() override;
    virtual void setSlopeLimit(float v) override;
    virtual float getSlopeLimit() override;
    virtual void setContactOffset(float v) override;
    virtual float getContactOffset() override;
    virtual void setDetectCollisions(bool v) override;
    virtual void setOverlapRecovery(bool v) override;
    virtual void setCenter(float x, float y, float z) override;
    
    uint32_t getGroup() override;
    void setGroup(uint32_t g) override;
    uint32_t getMask() override;
    void setMask(uint32_t m) override;
    void updateEventListener(EShapeFilterFlag flag) override;
    uint32_t getObjectID() const override { return _mObjectID; };
    //ICharacterController END

    inline physx::PxController& getCCT() { return *_impl; };

protected:
    physx::PxController* _impl{ nullptr };
    uint8_t _mFlag{ 0 };
    bool _mEnabled{ false };
    uint32_t _mObjectID{ 0 };
    Node* _mNode{ nullptr };
    physx::PxFilterData _mFilterData;
    ControllerHitReport report;
    QueryFilterCallback _mFilterCallback;
    physx::PxControllerFilters controllerFilter;
    physx::PxControllerCollisionFlags _pxCollisionFlags;
    bool _mOverlapRecovery{ true };
    float _mContactOffset{ 0.01f };
    float _mStepOffset{ 1.f };
    float _mSlopeLimit{ 45.f };
    cc::Vec3 _mCenter{ 0.f, 0.f, 0.f };

    void release();
    void updateFilterData();
    void setSimulationFilterData(physx::PxFilterData filterData);
    virtual void create() = 0;
    virtual void onComponentSet() = 0;
    virtual void updateScale() = 0;
    void insertToCCTMap();
    void eraseFromCCTMap();
    cc::Vec3 scaledCenter();
    physx::PxShape* getShape();
};

} // namespace physics
} // namespace cc
