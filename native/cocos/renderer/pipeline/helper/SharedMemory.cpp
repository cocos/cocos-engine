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

#include "SharedMemory.h"
#include "gfx-base/GFXDef.h"
#include "math/MathUtil.h"

namespace cc {
namespace pipeline {

const se::PoolType ModelView::TYPE               = se::PoolType::MODEL;
const se::PoolType SubModelView::TYPE            = se::PoolType::SUB_MODEL;
const se::PoolType PassView::TYPE                = se::PoolType::PASS;
const se::PoolType Camera::TYPE                  = se::PoolType::CAMERA;
const se::PoolType AABB::TYPE                    = se::PoolType::AABB;
const se::PoolType Frustum::TYPE                 = se::PoolType::FRUSTUM;
const se::PoolType Scene::TYPE                   = se::PoolType::SCENE;
const se::PoolType Light::TYPE                   = se::PoolType::LIGHT;
const se::PoolType Ambient::TYPE                 = se::PoolType::AMBIENT;
const se::PoolType Fog::TYPE                     = se::PoolType::FOG;
const se::PoolType Skybox::TYPE                  = se::PoolType::SKYBOX;
const se::PoolType InstancedAttributeView::TYPE  = se::PoolType::INSTANCED_ATTRIBUTE;
const se::PoolType FlatBufferView::TYPE          = se::PoolType::FLAT_BUFFER;
const se::PoolType RenderingSubMesh::TYPE        = se::PoolType::SUB_MESH;
const se::PoolType Node::TYPE                    = se::PoolType::NODE;
const se::PoolType Root::TYPE                    = se::PoolType::ROOT;
const se::PoolType RenderWindow::TYPE            = se::PoolType::RENDER_WINDOW;
const se::PoolType Shadows::TYPE                 = se::PoolType::SHADOW;
const se::PoolType Sphere::TYPE                  = se::PoolType::SPHERE;
const se::PoolType UIBatch::TYPE                 = se::PoolType::UI_BATCH;
const se::PoolType PipelineSharedSceneData::TYPE = se::PoolType::PIPELINE_SHARED_SCENE_DATA;

void AABB::getBoundary(cc::Vec3 &minPos, cc::Vec3 &maxPos) const {
    minPos = center - halfExtents;
    maxPos = center + halfExtents;
}

void AABB::merge(const AABB &aabb) {
    cc::Vec3 minA = center - halfExtents;
    cc::Vec3 minB = aabb.center - aabb.halfExtents;
    cc::Vec3 maxA = center + halfExtents;
    cc::Vec3 maxB = aabb.center + aabb.halfExtents;
    cc::Vec3 maxP;
    cc::Vec3 minP;
    cc::Vec3::max(maxA, maxB, &maxP);
    cc::Vec3::min(minA, minB, &minP);

    cc::Vec3 addP = maxP + minP;
    cc::Vec3 subP = maxP - minP;
    center        = addP * 0.5F;
    halfExtents   = subP * 0.5F;
}

int Sphere::interset(const Plane &plane) const {
    const float dot = plane.normal.dot(center);
    const float r   = radius * plane.normal.length();
    if (dot + r < plane.distance) {
        return -1;
    }

    if (dot - r > plane.distance) {
        return 0;
    }

    return 1;
}

bool Sphere::interset(const Frustum &frustum) const {
    for (const auto &plane : frustum.planes) { // NOLINT
        if (this->interset(plane) == -1) {
            return false;
        }
    }

    return true;
}

void Sphere::mergePoint(const cc::Vec3 &point) {
    if (radius < 0.0F) {
        center = point;
        radius = 0.0;
        return;
    }

    auto offset   = point - center;
    auto distance = offset.length();

    if (distance > radius) {
        auto half = (distance - radius) * 0.5F;
        radius += half;
        offset.scale(half / distance);
        center += offset;
    }
}

void Sphere::define(const AABB &aabb) {
    cc::Vec3 minPos;
    cc::Vec3 maxPos;
    aabb.getBoundary(minPos, maxPos);

    // Initialize sphere
    center.set(minPos);
    radius = 0.0F;

    // Calculate sphere
    const cc::Vec3 offset = maxPos - center;
    const float    dist   = offset.length();

    const float half = dist * 0.5F;
    radius += dist * 0.5F;
    center += (half / dist) * offset;
}

void Sphere::mergeAABB(const AABB *aabb) {
    cc::Vec3 minPos;
    cc::Vec3 maxPos;
    aabb->getBoundary(minPos, maxPos);
    mergePoint(minPos);
    mergePoint(maxPos);
}

int spherePlane(const Sphere *sphere, const Plane *plane) {
    const auto dot = cc::Vec3::dot(plane->normal, sphere->center);
    const auto r   = sphere->radius * plane->normal.length();
    if (dot + r < plane->distance) {
        return -1;
    }
    if (dot - r > plane->distance) {
        return 0;
    }
    return 1;
};

bool sphere_frustum(const Sphere *sphere, const Frustum *frustum) { // NOLINT
    for (const auto &plane : frustum->planes) {
        // frustum plane normal points to the inside
        if (spherePlane(sphere, &plane) == -1) {
            return false;
        }
    } // completely outside
    return true;
}

bool aabbAabb(const AABB *aabb1, const AABB *aabb2) {
    cc::Vec3 aMin;
    cc::Vec3 aMax;
    cc::Vec3 bMin;
    cc::Vec3 bMax;
    cc::Vec3::subtract(aabb1->center, aabb1->halfExtents, &aMin);
    cc::Vec3::add(aabb1->center, aabb1->halfExtents, &aMax);
    cc::Vec3::subtract(aabb2->center, aabb2->halfExtents, &bMin);
    cc::Vec3::add(aabb2->center, aabb2->halfExtents, &bMax);
    return (aMin.x <= bMax.x && aMax.x >= bMin.x) &&
           (aMin.y <= bMax.y && aMax.y >= bMin.y) &&
           (aMin.z <= bMax.z && aMax.z >= bMin.z);
}

int aabbPlane(const AABB *aabb, const Plane *plane) {
    const auto &halfExtents = aabb->halfExtents;
    auto        r           = halfExtents.x * std::abs(plane->normal.x) +
             halfExtents.y * std::abs(plane->normal.y) +
             halfExtents.z * std::abs(plane->normal.z);
    auto dot = Vec3::dot(plane->normal, aabb->center);
    if (dot + r < plane->distance) {
        return -1;
    }
    if (dot - r > plane->distance) {
        return 0;
    }
    return 1;
};

bool aabbFrustum(const AABB *aabb, const Frustum *frustum) {
    for (const auto &plane : frustum->planes) {
        // frustum plane normal points to the inside
        if (aabbPlane(aabb, &plane) == -1) {
            return false;
        }
    } // completely outside
    return true;
}

gfx::BlendState *getBlendStateImpl(uint index) {
    static gfx::BlendState blendState;
    auto *                 buffer = SharedMemory::getBuffer<uint32_t>(se::PoolType::BLEND_STATE, index);
    memcpy(&blendState, buffer, 24); // NOLINT

    uint32_t    targetArrayHandle = *(buffer + 6);
    auto *const targetsHandle     = GET_BLEND_TARGET_ARRAY(targetArrayHandle);
    uint32_t    targetLen         = targetsHandle[0];
    auto &      targets           = blendState.targets;
    targets.resize(targetLen);
    for (uint32_t i = 1; i <= targetLen; ++i) {
        memcpy(&targets[i - 1], GET_BLEND_TARGET(targetsHandle[i]), sizeof(gfx::BlendTarget));
    }

    return &blendState;
}

} // namespace pipeline
} // namespace cc
