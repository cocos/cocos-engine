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

#include "physics/physx/PhysXInc.h"

namespace cc {
namespace physics {

constexpr physx::PxU32 QUERY_FILTER         = 1 << 0;
constexpr physx::PxU32 QUERY_CHECK_TRIGGER  = 1 << 1;
constexpr physx::PxU32 QUERY_SINGLE_HIT     = 1 << 2;
constexpr physx::PxU32 DETECT_TRIGGER_EVENT = 1 << 3;
constexpr physx::PxU32 DETECT_CONTACT_EVENT = 1 << 4;
constexpr physx::PxU32 DETECT_CONTACT_POINT = 1 << 5;
constexpr physx::PxU32 DETECT_CONTACT_CCD   = 1 << 6;

physx::PxFilterFlags simpleFilterShader(
    physx::PxFilterObjectAttributes attributes0, physx::PxFilterData fd0,
    physx::PxFilterObjectAttributes attributes1, physx::PxFilterData fd1,
    physx::PxPairFlags &pairFlags, const void* constantBlock, physx::PxU32 constantBlockSize);

physx::PxFilterFlags advanceFilterShader(
    physx::PxFilterObjectAttributes attributes0, physx::PxFilterData fd0,
    physx::PxFilterObjectAttributes attributes1, physx::PxFilterData fd1,
    physx::PxPairFlags &pairFlags, const void* constantBlock, physx::PxU32 constantBlockSize);

class QueryFilterShader : public physx::PxSceneQueryFilterCallback {
public:
    physx::PxQueryHitType::Enum preFilter(const physx::PxFilterData &filterData, const physx::PxShape *shape,
                                                  const physx::PxRigidActor *actor, physx::PxHitFlags &queryFlags) override;
    physx::PxQueryHitType::Enum postFilter(const physx::PxFilterData & filterData, const physx::PxQueryHit & hit) override {
        PX_UNUSED(filterData);
        PX_UNUSED(hit);
        return physx::PxQueryHitType::eNONE;
    };
};

} // namespace physics
} // namespace cc
