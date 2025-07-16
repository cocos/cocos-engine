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

#include "physics/physx/PhysXFilterShader.h"
#include "physics/physx/PhysXInc.h"

namespace cc {
namespace physics {

physx::PxFilterFlags simpleFilterShader(
    physx::PxFilterObjectAttributes attributes0, physx::PxFilterData fd0,
    physx::PxFilterObjectAttributes attributes1, physx::PxFilterData fd1,
    physx::PxPairFlags &pairFlags, const void *constantBlock, physx::PxU32 constantBlockSize) {
    PX_UNUSED(constantBlock);
    PX_UNUSED(constantBlockSize);
    // group mask filter
    if (!(fd0.word0 & fd1.word1) || !(fd0.word1 & fd1.word0)) {
        return physx::PxFilterFlag::eSUPPRESS;
    }

    if (physx::PxFilterObjectIsTrigger(attributes0) || physx::PxFilterObjectIsTrigger(attributes1)) {
        pairFlags |= physx::PxPairFlag::eTRIGGER_DEFAULT | physx::PxPairFlag::eNOTIFY_TOUCH_CCD;
        return physx::PxFilterFlag::eDEFAULT;
    }
    if (!physx::PxFilterObjectIsKinematic(attributes0) || !physx::PxFilterObjectIsKinematic(attributes1)) {
        pairFlags |= physx::PxPairFlag::eSOLVE_CONTACT;
    }
    pairFlags |= physx::PxPairFlag::eDETECT_DISCRETE_CONTACT |
                 physx::PxPairFlag::eNOTIFY_TOUCH_FOUND | physx::PxPairFlag::eNOTIFY_TOUCH_LOST | physx::PxPairFlag::eNOTIFY_TOUCH_PERSISTS |
                 physx::PxPairFlag::eDETECT_CCD_CONTACT | physx::PxPairFlag::eNOTIFY_CONTACT_POINTS;
    return physx::PxFilterFlag::eDEFAULT;
}

physx::PxFilterFlags advanceFilterShader(
    physx::PxFilterObjectAttributes attributes0, physx::PxFilterData fd0,
    physx::PxFilterObjectAttributes attributes1, physx::PxFilterData fd1,
    physx::PxPairFlags &pairFlags, const void *constantBlock, physx::PxU32 constantBlockSize) {
    PX_UNUSED(constantBlock);
    PX_UNUSED(constantBlockSize);
    // group mask filter
    if (!(fd0.word0 & fd1.word1) || !(fd0.word1 & fd1.word0)) {
        return physx::PxFilterFlag::eSUPPRESS;
    }

    pairFlags = physx::PxPairFlags(0);

    // trigger filter
    if (physx::PxFilterObjectIsTrigger(attributes0) || physx::PxFilterObjectIsTrigger(attributes1)) {
        pairFlags |= physx::PxPairFlag::eDETECT_DISCRETE_CONTACT;

        // need trigger event?
        const physx::PxU16 needTriggerEvent = (fd0.word3 & DETECT_TRIGGER_EVENT) | (fd1.word3 & DETECT_TRIGGER_EVENT);
        if (needTriggerEvent) {
            pairFlags |= physx::PxPairFlag::eNOTIFY_TOUCH_FOUND | physx::PxPairFlag::eNOTIFY_TOUCH_LOST;
            return physx::PxFilterFlag::eDEFAULT;
        }
        return physx::PxFilterFlag::eSUPPRESS;
    }

    // need detect ccd contact?
    const physx::PxU16 needDetectCCD = (fd0.word3 & DETECT_CONTACT_CCD) | (fd1.word3 & DETECT_CONTACT_CCD);
    if (needDetectCCD) pairFlags |= physx::PxPairFlag::eDETECT_CCD_CONTACT;

    if (!physx::PxFilterObjectIsKinematic(attributes0) || !physx::PxFilterObjectIsKinematic(attributes1)) {
        pairFlags |= physx::PxPairFlag::eSOLVE_CONTACT;
    }

    // simple collision process
    pairFlags |= physx::PxPairFlag::eDETECT_DISCRETE_CONTACT;

    // need contact event?
    const physx::PxU16 needContactEvent = (fd0.word3 & DETECT_CONTACT_EVENT) | (fd1.word3 & DETECT_CONTACT_EVENT);
    if (needContactEvent) pairFlags |= physx::PxPairFlag::eNOTIFY_TOUCH_FOUND | physx::PxPairFlag::eNOTIFY_TOUCH_LOST | physx::PxPairFlag::eNOTIFY_TOUCH_PERSISTS;

    // need contact point?
    const physx::PxU16 needContactPoint = (fd0.word3 & DETECT_CONTACT_POINT) | (fd1.word3 & DETECT_CONTACT_POINT);
    if (needContactPoint) pairFlags |= physx::PxPairFlag::eNOTIFY_CONTACT_POINTS;

    return physx::PxFilterFlag::eDEFAULT;
}

physx::PxQueryHitType::Enum QueryFilterShader::preFilter(const physx::PxFilterData &filterData, const physx::PxShape *shape,
                                                         const physx::PxRigidActor *actor, physx::PxHitFlags &queryFlags) {
    PX_UNUSED(actor);
    PX_UNUSED(queryFlags);
    if ((filterData.word3 & QUERY_CHECK_TRIGGER) && shape->getFlags().isSet(physx::PxShapeFlag::eTRIGGER_SHAPE)) {
        return physx::PxQueryHitType::eNONE;
    }
    return filterData.word3 & QUERY_SINGLE_HIT ? physx::PxQueryHitType::eBLOCK : physx::PxQueryHitType::eTOUCH;
}

} // namespace physics
} // namespace cc
