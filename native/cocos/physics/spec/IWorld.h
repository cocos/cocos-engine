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

#include <cstdint>
#include <memory>
#include <vector>
#include "base/TypeDef.h"
#include "math/Vec3.h"

namespace cc {
namespace physics {

enum class ETouchState : uint8_t {
    ENTER = 0,
    STAY  = 1,
    EXIT  = 2,
};

struct TriggerEventPair {
    uintptr_t                shapeA;
    uintptr_t                shapeB;
    ETouchState              state;
    static constexpr uint8_t COUNT = 3;
    TriggerEventPair(const uintptr_t a, const uintptr_t b)
    : shapeA(a),
      shapeB(b),
      state(ETouchState::ENTER) {}
};

struct ContactPoint {
    Vec3                     position;
    float                    separation;
    Vec3                     normal;
    uint32_t                 internalFaceIndex0;
    Vec3                     impulse;
    uint32_t                 internalFaceIndex1;
    static constexpr uint8_t COUNT = 12;
};

struct ContactEventPair {
    uintptr_t                 shapeA;
    uintptr_t                 shapeB;
    ETouchState               state;
    std::vector<ContactPoint> contacts;
    static constexpr uint8_t  COUNT = 4;
    ContactEventPair(const uintptr_t a, const uintptr_t b)
    : shapeA(a),
      shapeB(b),
      state(ETouchState::ENTER) {}
};

struct ConvexDesc {
    void *   positions;
    uint32_t positionLength;
};

struct TrimeshDesc : ConvexDesc {
    void *   triangles;
    uint32_t triangleLength;
    bool     isU16;
};

struct HeightFieldDesc {
    uint32_t rows;
    uint32_t columns;
    void *   samples;
};

struct RaycastOptions {
    Vec3     origin;
    float    distance;
    Vec3     unitDir;
    uint32_t mask;
    bool     queryTrigger;
};

struct RaycastResult {
    uintptr_t shape{0};
    Vec3      hitPoint;
    float     distance;
    Vec3      hitNormal;
    RaycastResult() = default;
};

class IPhysicsWorld {
public:
    virtual ~IPhysicsWorld() = default;
    ;
    virtual void                                            setGravity(float x, float y, float z)      = 0;
    virtual void                                            setAllowSleep(bool v)                      = 0;
    virtual void                                            step(float s)                              = 0;
    virtual void                                            emitEvents()                               = 0;
    virtual void                                            syncSceneToPhysics()                       = 0;
    virtual void                                            syncSceneWithCheck()                       = 0;
    virtual void                                            destroy()                                  = 0;
    virtual void                                            setCollisionMatrix(uint32_t i, uint32_t m) = 0;
    virtual std::vector<std::shared_ptr<TriggerEventPair>> &getTriggerEventPairs()                     = 0;
    virtual std::vector<std::shared_ptr<ContactEventPair>> &getContactEventPairs()                     = 0;
    virtual bool                                            raycast(RaycastOptions &opt)               = 0;
    virtual bool                                            raycastClosest(RaycastOptions &opt)        = 0;
    virtual std::vector<RaycastResult> &                    raycastResult()                            = 0;
    virtual RaycastResult &                                 raycastClosestResult()                     = 0;
    virtual uintptr_t                                       createConvex(ConvexDesc &desc)             = 0;
    virtual uintptr_t                                       createTrimesh(TrimeshDesc &desc)           = 0;
    virtual uintptr_t                                       createHeightField(HeightFieldDesc &desc)   = 0;
    virtual uintptr_t                                       createMaterial(uint16_t id, float f, float df, float r,
                                                                           uint8_t m0, uint8_t m1)     = 0;
};

} // namespace physics
} // namespace cc
