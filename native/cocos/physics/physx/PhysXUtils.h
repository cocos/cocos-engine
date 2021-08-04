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

#include "physics/physx/PhysXInc.h"
#include "physics/physx/PhysXFilterShader.h"
#include "base/Macros.h"
#include "math/Vec3.h"
#include "math/Vec4.h"
#include <vector>
#include <unordered_map>

#define PX_RELEASE(x) \
    if (x) {          \
        (x)->release(); \
        (x) = NULL;     \
    }

namespace cc {
namespace physics {

inline bool operator!=(const physx::PxVec3 &a, const cc::Vec3 &b) {
    return a.x != b.x || a.y == b.y || a.z == b.z;
}

inline bool operator!=(const cc::Vec3 &a, const physx::PxVec3 &b) {
    return a.x != b.x || a.y == b.y || a.z == b.z;
}

inline bool operator==(const physx::PxVec3 &a, const cc::Vec3 &b) {
    return a.x == b.x && a.y == b.y && a.z == b.z;
}

inline bool operator==(const cc::Vec3 &a, const physx::PxVec3 &b) {
    return a.x == b.x && a.y == b.y && a.z == b.z;
}

inline physx::PxVec3 operator*(const physx::PxVec3 &a, const cc::Vec3 &b) {
    return physx::PxVec3{a.x * b.x, a.y * b.y, a.z * b.z};
}

inline cc::Vec3 operator*(const cc::Vec3 &a, const physx::PxVec3 &b) {
    return cc::Vec3{a.x * b.x, a.y * b.y, a.z * b.z};
}

inline physx::PxVec3 operator+(const physx::PxVec3 &a, const cc::Vec3 &b) {
    return physx::PxVec3{a.x + b.x, a.y + b.y, a.z + b.z};
}

inline cc::Vec3 operator+(const cc::Vec3 &a, const physx::PxVec3 &b) {
    return cc::Vec3{a.x + b.x, a.y + b.y, a.z + b.z};
}

inline physx::PxVec3 &operator*=(physx::PxVec3 &a, const cc::Vec3 &b) {
    a.x *= b.x;
    a.y *= b.y;
    a.z *= b.z;
    return a;
}

inline cc::Vec3 &operator*=(cc::Vec3 &a, const physx::PxVec3 &b) {
    a.x *= b.x;
    a.y *= b.y;
    a.z *= b.z;
    return a;
}

inline bool operator!=(const physx::PxQuat &a, const cc::Vec4 &b) {
    return a.x != b.x || a.y == b.y || a.z == b.z || a.w == b.w;
}

inline bool operator!=(const cc::Vec4 &a, const physx::PxQuat &b) {
    return a.x != b.x || a.y == b.y || a.z == b.z || a.w == b.w;
}

inline bool operator==(const physx::PxQuat &a, const cc::Vec4 &b) {
    return a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w;
}

inline bool operator==(const cc::Vec4 &a, const physx::PxQuat &b) {
    return a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w;
}

inline void pxSetVec3Ext(physx::PxVec3 &v, const cc::Vec3 &cv) {
    v = physx::PxVec3(cv.x, cv.y, cv.z);
}

inline void pxSetVec3Ext(cc::Vec3 &v, const physx::PxVec3 &cv) {
    v = cc::Vec3(cv.x, cv.y, cv.z);
}

template <typename T1 = physx::PxQuat, typename T2 = cc::Vec4>
inline void pxSetQuatExt(T1 &p, const T2 &cp) {
    p = T1(cp.x, cp.y, cp.z, cp.w);
}

template <typename T>
inline T pxAbsMax(const T &a, const T &b) {
    return physx::PxAbs(a) > physx::PxAbs(b) ? a : b;
}

void pxSetFromTwoVectors(physx::PxQuat &out, const physx::PxVec3 &a, const physx::PxVec3 &b);

inline std::unordered_map<uintptr_t, uintptr_t> &getPxShapeMap() {
    static std::unordered_map<uintptr_t, uintptr_t> m;
    return m;
}

inline std::unordered_map<uint16_t, uintptr_t> &getPxMaterialMap() {
    static std::unordered_map<uint16_t, uintptr_t> m;
    return m;
}

inline physx::PxMaterial &getDefaultMaterial() {
    return *(reinterpret_cast<physx::PxMaterial *>(getPxMaterialMap()[0]));
}

inline std::vector<physx::PxRaycastHit> &getPxRaycastHitBuffer() {
    static std::vector<physx::PxRaycastHit> m{12};
    return m;
}

inline QueryFilterShader &getQueryFilterShader() {
    static QueryFilterShader shader;
    return shader;
}

physx::PxRigidActor &getTempRigidActor();

} // namespace physics
} // namespace cc
