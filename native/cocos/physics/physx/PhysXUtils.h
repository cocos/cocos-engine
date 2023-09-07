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

#include "base/Macros.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"
#include "renderer/pipeline/Define.h"
#include "math/Vec3.h"
#include "math/Vec4.h"
#include "physics/physx/PhysXFilterShader.h"
#include "physics/physx/PhysXInc.h"

#define PX_RELEASE(x)   \
    if (x) {            \
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

inline void pxSetColor(gfx::Color& color, physx::PxU32 rgba) {
    color.z = ((rgba >> 16) & 0xff);
    color.y = ((rgba >> 8) & 0xff);
    color.x = ((rgba) & 0xff);
    color.w = 255;
}

template <typename T>
inline T pxAbsMax(const T &a, const T &b) {
    return physx::PxAbs(a) > physx::PxAbs(b) ? a : b;
}

void pxSetFromTwoVectors(physx::PxQuat &out, const physx::PxVec3 &a, const physx::PxVec3 &b);

inline ccstd::unordered_map<uintptr_t, uint32_t> &getPxShapeMap() {
    static ccstd::unordered_map<uintptr_t, uint32_t> m;
    return m;
}

//physx::PxCharacterController ptr <--> PhysxCharacterController ObjectID
inline ccstd::unordered_map<uintptr_t, uint32_t>& getPxCCTMap() {
    static ccstd::unordered_map<uintptr_t, uint32_t> m;
    return m;
}

inline ccstd::unordered_map<uint16_t, uintptr_t> &getPxMaterialMap() {
    static ccstd::unordered_map<uint16_t, uintptr_t> m;
    return m;
}

inline physx::PxMaterial &getDefaultMaterial() {
    return *(reinterpret_cast<physx::PxMaterial *>(getPxMaterialMap()[0]));
}

inline ccstd::vector<physx::PxRaycastHit> &getPxRaycastHitBuffer() {
    static ccstd::vector<physx::PxRaycastHit> m{12};
    return m;
}

inline ccstd::vector<physx::PxSweepHit> &getPxSweepHitBuffer() {
    static ccstd::vector<physx::PxSweepHit> m{12};
    return m;
}

inline QueryFilterShader &getQueryFilterShader() {
    static QueryFilterShader shader;
    return shader;
}

} // namespace physics
} // namespace cc
