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

#include "physics/physx/shapes/PhysXTrimesh.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"
#include "physics/physx/shapes/PhysXShape.h"

namespace cc {
namespace physics {

PhysXTrimesh::PhysXTrimesh() : _mMeshHandle(0),
                               _mConvex(false),
                               _mIsTrigger(false){};

void PhysXTrimesh::setMesh(uintptr_t handle) {
    if (_mShape) return;
    if (_mMeshHandle == handle) return;
    _mMeshHandle = handle;
    if (_mSharedBody && _mMeshHandle) {
        onComponentSet();
        insertToShapeMap();
        if (_mEnabled) getSharedBody().addShape(*this);
        setAsTrigger(_mIsTrigger);
        updateCenter();
    }
}

void PhysXTrimesh::useConvex(bool v) {
    _mConvex = v;
}

void PhysXTrimesh::onComponentSet() {
    if (_mMeshHandle) {
        const auto &mat = getDefaultMaterial();
        if (_mConvex) {
            physx::PxConvexMeshGeometry geom;
            geom.convexMesh = reinterpret_cast<physx::PxConvexMesh *>(_mMeshHandle);
            // geom.meshFlags = PxConvexMeshGeometryFlags::eTIGHT_BOUNDS;
            _mShape = PxGetPhysics().createShape(geom, mat, true);
        } else {
            physx::PxTriangleMeshGeometry geom;
            geom.triangleMesh = reinterpret_cast<physx::PxTriangleMesh *>(_mMeshHandle);
            // geom.meshFlags = PxMeshGeometryFlag::eDOUBLE_SIDED;
            _mShape = PxGetPhysics().createShape(geom, mat, true);
        }
        updateGeometry();
    }
}

void PhysXTrimesh::updateScale() {
    updateGeometry();
    updateCenter();
}

void PhysXTrimesh::updateGeometry() {
    static physx::PxMeshScale scale;
    scale.rotation = physx::PxQuat{physx::PxIdentity};
    auto *node     = getSharedBody().getNode();
    node->updateWorldTransform();
    pxSetVec3Ext(scale.scale, node->getWorldScale());
    const auto &type = _mShape->getGeometryType();
    if (type == physx::PxGeometryType::eCONVEXMESH) {
        physx::PxConvexMeshGeometry geom;
        if (getShape().getConvexMeshGeometry(geom)) {
            geom.scale = scale;
            getShape().setGeometry(geom);
        }
    } else if (type == physx::PxGeometryType::eTRIANGLEMESH) {
        physx::PxTriangleMeshGeometry geom;
        if (getShape().getTriangleMeshGeometry(geom)) {
            geom.scale = scale;
            getShape().setGeometry(geom);
        }
    }
}

void PhysXTrimesh::setAsTrigger(bool v) {
    _mIsTrigger = v;
    if (_mShape) {
        PhysXShape::setAsTrigger(v);
    }
}

} // namespace physics
} // namespace cc
