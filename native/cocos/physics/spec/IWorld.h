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

#include <cstdint>
#include <memory>
#include "base/TypeDef.h"
#include "base/std/container/vector.h"
#include "math/Vec3.h"

namespace cc {
namespace physics {

enum class ETouchState : uint8_t {
    ENTER = 0,
    STAY = 1,
    EXIT = 2,
};

enum class EPhysicsDrawFlags : uint32_t {
    NONE = 0,
    WIRE_FRAME = 0x0001,
    CONSTRAINT = 0x0002,
    AABB = 0x0004
};

struct TriggerEventPair {
    uint32_t shapeA; //wrapper object ID
    uint32_t shapeB; //wrapper object ID
    ETouchState state;
    static constexpr uint8_t COUNT = 3;
    TriggerEventPair(const uint32_t a, const uint32_t b)
    : shapeA(a),
      shapeB(b),
      state(ETouchState::ENTER) {}
};

struct ContactPoint {
    Vec3 position;
    float separation;
    Vec3 normal;
    uint32_t internalFaceIndex0;
    Vec3 impulse;
    uint32_t internalFaceIndex1;
    static constexpr uint8_t COUNT = 12;
};

struct ContactEventPair {
    uint32_t shapeA; //wrapper object ID
    uint32_t shapeB; //wrapper object ID
    ETouchState state;
    ccstd::vector<ContactPoint> contacts;
    static constexpr uint8_t COUNT = 4;
    ContactEventPair(const uint32_t a, const uint32_t b)
    : shapeA(a),
      shapeB(b),
      state(ETouchState::ENTER) {}
};

struct CharacterControllerContact {
    Vec3 worldPosition;
    Vec3 worldNormal;
    Vec3 motionDirection;
    float motionLength;
    static constexpr uint8_t COUNT = 10;
};
struct CCTShapeEventPair {
    uint32_t cct; //wrapper object ID
    uint32_t shape; //wrapper object ID
    //ETouchState state;
    ccstd::vector<CharacterControllerContact> contacts;
    static constexpr uint8_t COUNT = 3;
    CCTShapeEventPair(const uint32_t cct, const uint32_t shape)
        : cct(cct), shape(shape) {
    }
};

struct CCTTriggerEventPair {
    uint32_t cct; //wrapper object ID
    uint32_t shape; //wrapper object ID
    ETouchState state;
    static constexpr uint8_t COUNT = 3;
    CCTTriggerEventPair(const uint32_t cct, const uint32_t shape)
    : cct(cct),
      shape(shape),
      state(ETouchState::ENTER) {}
};

struct ConvexDesc {
    void *positions;
    uint32_t positionLength;
};

struct TrimeshDesc : ConvexDesc {
    void *triangles;
    uint32_t triangleLength;
    bool isU16;
};

struct HeightFieldDesc {
    uint32_t rows;
    uint32_t columns;
    void *samples;
};

struct RaycastOptions {
    Vec3 origin;
    float distance;
    Vec3 unitDir;
    uint32_t mask;
    bool queryTrigger;
};

struct RaycastResult {
    uint32_t shape{0};
    Vec3 hitPoint;
    float distance;
    Vec3 hitNormal;
    RaycastResult() = default;
};

class IPhysicsWorld {
public:
    virtual ~IPhysicsWorld() = default;
    ;
    virtual void setGravity(float x, float y, float z) = 0;
    virtual void setAllowSleep(bool v) = 0;
    virtual void step(float s) = 0;
    virtual void emitEvents() = 0;
    virtual void syncSceneToPhysics() = 0;
    virtual void syncSceneWithCheck() = 0;
    virtual void destroy() = 0;
    virtual void setDebugDrawFlags(EPhysicsDrawFlags f) = 0;
    virtual EPhysicsDrawFlags getDebugDrawFlags() = 0;
    virtual void setDebugDrawConstraintSize(float s) = 0;
    virtual float getDebugDrawConstraintSize() = 0;
    virtual void setCollisionMatrix(uint32_t i, uint32_t m) = 0;
    virtual ccstd::vector<std::shared_ptr<TriggerEventPair>> &getTriggerEventPairs() = 0;
    virtual ccstd::vector<std::shared_ptr<ContactEventPair>>& getContactEventPairs() = 0;
    virtual ccstd::vector<std::shared_ptr<CCTShapeEventPair>>& getCCTShapeEventPairs() = 0;
    virtual ccstd::vector<std::shared_ptr<CCTTriggerEventPair>> &getCCTTriggerEventPairs() = 0;
    virtual bool raycast(RaycastOptions &opt) = 0;
    virtual bool raycastClosest(RaycastOptions &opt) = 0;
    virtual ccstd::vector<RaycastResult> &raycastResult() = 0;
    virtual RaycastResult &raycastClosestResult() = 0;
    virtual bool sweepBox(RaycastOptions &opt, float halfExtentX, float halfExtentY, float halfExtentZ,
        float orientationW, float orientationX, float orientationY, float orientationZ) = 0;
    virtual bool sweepBoxClosest(RaycastOptions &opt, float halfExtentX, float halfExtentY, float halfExtentZ,
        float orientationW, float orientationX, float orientationY, float orientationZ) = 0;
    virtual bool sweepSphere(RaycastOptions &opt, float radius) = 0;
    virtual bool sweepSphereClosest(RaycastOptions &opt, float radius) = 0;
    virtual bool sweepCapsule(RaycastOptions &opt, float radius, float height,
        float orientationW, float orientationX, float orientationY, float orientationZ) = 0;
    virtual bool sweepCapsuleClosest(RaycastOptions &opt, float radius, float height,
        float orientationW, float orientationX, float orientationY, float orientationZ) = 0;
    virtual RaycastResult &sweepClosestResult() = 0;
    virtual ccstd::vector<RaycastResult> &sweepResult() = 0;
    virtual uint32_t createConvex(ConvexDesc &desc) = 0;
    virtual uint32_t createTrimesh(TrimeshDesc &desc) = 0;
    virtual uint32_t createHeightField(HeightFieldDesc &desc) = 0;
    virtual bool createMaterial(uint16_t id, float f, float df, float r,
                                uint8_t m0, uint8_t m1) = 0;
    virtual void setFixedTimeStep(float v) = 0;
    virtual float getFixedTimeStep() const = 0;
};

} // namespace physics
} // namespace cc
