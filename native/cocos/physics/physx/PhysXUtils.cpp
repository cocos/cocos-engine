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

#include "physics/physx/PhysXUtils.h"

namespace cc {
namespace physics {

void pxSetFromTwoVectors(physx::PxQuat &out, const physx::PxVec3 &a, const physx::PxVec3 &b) {
    float dot = a.dot(b);
    if (dot < -0.999999) {
        physx::PxVec3 c = (physx::PxVec3{1., 0., 0.}).cross(a);
        if (c.magnitude() < 0.000001) c = (physx::PxVec3{0., 1., 0.}).cross(a);
        c.normalize();
        out = physx::PxQuat(physx::PxPi, c);
    } else if (dot > 0.999999) {
        out = physx::PxQuat{physx::PxIdentity};
    } else {
        physx::PxVec3 c = a.cross(b);
        out = physx::PxQuat{c.x, c.y, c.z, 1 + dot};
        out.normalize();
    }
}

} // namespace physics
} // namespace cc
