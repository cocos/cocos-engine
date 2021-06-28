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

#include "physics/physx/shapes/PhysXShape.h"
#include <unordered_map>
#include "physics/physx/PhysXSharedBody.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"

namespace cc {
namespace physics {

void PhysXShape::initialize(scene::Node *node) {
    PhysXWorld &ins = PhysXWorld::getInstance();
    _mSharedBody    = ins.getSharedBody(node);
    getSharedBody().reference(true);
    onComponentSet();
    getPxShapeMap().insert(std::pair<uintptr_t, uintptr_t>(reinterpret_cast<uintptr_t>(&getShape()), getImpl()));
}

void PhysXShape::onEnable() {
    _mEnabled = true;
    getSharedBody().addShape(*this);
    getSharedBody().enabled(true);
}

void PhysXShape::onDisable() {
    _mEnabled = false;
    getSharedBody().removeShape(*this);
    getSharedBody().enabled(false);
}

void PhysXShape::onDestroy() {
    getSharedBody().reference(false);
    getPxShapeMap().erase(reinterpret_cast<uintptr_t>(&getShape()));
}

void PhysXShape::setMaterial(uint16_t id, float f, float df, float r,
                             uint8_t m0, uint8_t m1) {
    auto *mat = reinterpret_cast<physx::PxMaterial *>(getSharedBody().getWorld().createMaterial(id, f, df, r, m0, m1));
    getShape().setMaterials(&mat, 1);
}

void PhysXShape::setAsTrigger(bool v) {
    if (v) {
        getShape().setFlag(physx::PxShapeFlag::eSIMULATION_SHAPE, !v);
        getShape().setFlag(physx::PxShapeFlag::eTRIGGER_SHAPE, v);
    } else {
        getShape().setFlag(physx::PxShapeFlag::eTRIGGER_SHAPE, v);
        getShape().setFlag(physx::PxShapeFlag::eSIMULATION_SHAPE, !v);
    }
    if (_mIndex >= 0) {
        getSharedBody().removeShape(*this);
        getSharedBody().addShape(*this);
    }
}

void PhysXShape::setCenter(float x, float y, float z) {
    _mCenter = physx::PxVec3{x, y, z};
    updateCenter();
}

uint32_t PhysXShape::getGroup() {
    return getSharedBody().getGroup();
}

void PhysXShape::setGroup(uint32_t g) {
    getSharedBody().setGroup(g);
}

uint32_t PhysXShape::getMask() {
    return getSharedBody().getMask();
}

void PhysXShape::setMask(uint32_t m) {
    getSharedBody().setMask(m);
}

void PhysXShape::updateEventListener(EShapeFilterFlag flag) {
}

scene::AABB &PhysXShape::getAABB() {
    static scene::AABB aabb;
    auto bounds = physx::PxShapeExt::getWorldBounds(getShape(), *getSharedBody().getImpl().rigidActor);
    pxSetVec3Ext(aabb.getLayout()->center, (bounds.maximum + bounds.minimum) / 2);
    pxSetVec3Ext(aabb.getLayout()->halfExtents, (bounds.maximum - bounds.minimum) / 2);
    return aabb;
}

scene::Sphere &PhysXShape::getBoundingSphere() {
    static scene::Sphere sphere;
    sphere.define(getAABB());
    return sphere;
}

void PhysXShape::updateFilterData(const physx::PxFilterData &data) {
}

void PhysXShape::updateCenter() {
    auto &             sb   = getSharedBody();
    auto *             node = sb.getNode();
    node->updateWorldTransform();
    physx::PxTransform local{_mCenter * node->getWorldScale(), _mRotation};
    getShape().setLocalPose(local);
    if (_mEnabled && !isTrigger()) sb.updateCenterOfMass();
}

} // namespace physics
} // namespace cc
