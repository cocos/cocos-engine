#include "SharedMemory.h"
#include "../math/MathUtil.h"
#include "renderer/core/gfx/GFXDef.h"

namespace cc {
namespace pipeline {

const se::PoolType ModelView::type = se::PoolType::MODEL;
const se::PoolType SubModelView::type = se::PoolType::SUB_MODEL;
const se::PoolType PassView::type = se::PoolType::PASS;
const se::PoolType Camera::type = se::PoolType::CAMERA;
const se::PoolType AABB::type = se::PoolType::AABB;
const se::PoolType Frustum::type = se::PoolType::FRUSTUM;
const se::PoolType Scene::type = se::PoolType::SCENE;
const se::PoolType Light::type = se::PoolType::LIGHT;
const se::PoolType Ambient::type = se::PoolType::AMBIENT;
const se::PoolType Fog::type = se::PoolType::FOG;
const se::PoolType Skybox::type = se::PoolType::SKYBOX;
const se::PoolType InstancedAttributeView::type = se::PoolType::INSTANCED_ATTRIBUTE;
const se::PoolType FlatBufferView::type = se::PoolType::FLAT_BUFFER;
const se::PoolType RenderingSubMesh::type = se::PoolType::SUB_MESH;
const se::PoolType Node::type = se::PoolType::NODE;
const se::PoolType Root::type = se::PoolType::ROOT;
const se::PoolType RenderWindow::type = se::PoolType::RENDER_WINDOW;
const se::PoolType Shadows::type = se::PoolType::SHADOW;
const se::PoolType Sphere::type = se::PoolType::SPHERE;

void AABB::getBoundary(cc::Vec3 &minPos, cc::Vec3 &maxPos) const {
    minPos = center - halfExtents;
    maxPos = center + halfExtents;
}

void AABB::merge(const AABB &aabb) {
    cc::Vec3 minA = center - halfExtents;
    cc::Vec3 minB = aabb.center - aabb.halfExtents;
    cc::Vec3 maxA = center + halfExtents;
    cc::Vec3 maxB = aabb.center + aabb.halfExtents;
    cc::Vec3 maxP, minP;
    cc::Vec3::max(maxA, maxB, &maxP);
    cc::Vec3::min(minA, minB, &minP);

    cc::Vec3 addP = maxP + minP;
    cc::Vec3 subP = maxP - minP;
    center = addP * 0.5f;
    halfExtents = subP * 0.5f;
}

int Sphere::interset(const Plane &plane) const {
    const float dot = plane.normal.dot(center);
    const float r = radius * plane.normal.length();
    if (dot + r < plane.distance) {
        return -1;
    }

    if (dot - r > plane.distance) {
        return 0;
    }

    return 1;
}

bool Sphere::interset(const Frustum &frustum) const {
    for (const auto &plane : frustum.planes) {
        if (this->interset(plane) == -1) {
            return false;
        }
    }

    return true;
}

void Sphere::mergePoint(const cc::Vec3 &point) {
    if (radius < 0.0f) {
        center = point;
        radius = 0.0;
        return;
    }

    auto offset = point - center;
    auto distance = offset.length();

    if (distance > radius) {
        auto half = (distance - radius) * 0.5f;
        radius += half;
        offset.scale(half / distance);
        center += offset;
    }
}

void Sphere::define(const AABB &aabb) {
    cc::Vec3 minPos, maxPos;
    aabb.getBoundary(minPos, maxPos);

    // Initialize sphere
    center.set(minPos);
    radius = 0.0f;

    // Calculate sphere
    const cc::Vec3 offset = maxPos - center;
    const float dist = offset.length();

    const float half = dist * 0.5f;
    radius += dist * 0.5f;
    center += (half / dist) * offset;
}

void Sphere::mergeAABB(const AABB *aabb) {
    cc::Vec3 minPos, maxPos;
    aabb->getBoundary(minPos, maxPos);
    mergePoint(minPos);
    mergePoint(maxPos);
}

int sphere_plane(const Sphere *sphere, const Plane *plane) {
    const auto dot = cc::Vec3::dot(plane->normal, sphere->center);
    const auto r = sphere->radius * plane->normal.length();
    if (dot + r < plane->distance) {
        return -1;
    } else if (dot - r > plane->distance) {
        return 0;
    }
    return 1;
};

bool sphere_frustum(const Sphere *sphere, const Frustum *frustum) {
    for (auto i = 0; i < PLANE_LENGTH; i++) {
        // frustum plane normal points to the inside
        if (sphere_plane(sphere, &frustum->planes[i]) == -1) {
            return false;
        }
    } // completely outside
    return true;
}

bool aabb_aabb(const AABB *aabb1, const AABB *aabb2) {
    cc::Vec3 aMin, aMax, bMin, bMax;
    cc::Vec3::subtract(aabb1->center, aabb1->halfExtents, &aMin);
    cc::Vec3::add(aabb1->center, aabb1->halfExtents, &aMax);
    cc::Vec3::subtract(aabb2->center, aabb2->halfExtents, &bMin);
    cc::Vec3::add(aabb2->center, aabb2->halfExtents, &bMax);
    return (aMin.x <= bMax.x && aMax.x >= bMin.x) &&
           (aMin.y <= bMax.y && aMax.y >= bMin.y) &&
           (aMin.z <= bMax.z && aMax.z >= bMin.z);
}

int aabb_plane(const AABB *aabb, const Plane *plane) {
    const auto &halfExtents = aabb->halfExtents;
    auto r = halfExtents.x * std::abs(plane->normal.x) +
             halfExtents.y * std::abs(plane->normal.y) +
             halfExtents.z * std::abs(plane->normal.z);
    auto dot = Vec3::dot(plane->normal, aabb->center);
    if (dot + r < plane->distance) {
        return -1;
    } else if (dot - r > plane->distance) {
        return 0;
    }
    return 1;
};

bool aabb_frustum(const AABB *aabb, const Frustum *frustum) {
    for (size_t i = 0; i < PLANE_LENGTH; i++) {
        // frustum plane normal points to the inside
        if (aabb_plane(aabb, &frustum->planes[i]) == -1) {
            return 0;
        }
    } // completely outside
    return 1;
}

gfx::BlendState *getBlendStateImpl(uint index) {
    static gfx::BlendState blendState;
    auto buffer = SharedMemory::getBuffer<uint32_t>(se::PoolType::BLEND_STATE, index);
    memcpy(&blendState, buffer, 24);

    uint32_t targetArrayHandle = *(buffer + 6);
    const auto targetsHandle = GET_BLEND_TARGET_ARRAY(targetArrayHandle);
    uint32_t targetLen = targetsHandle[0];
    auto &targets = blendState.targets;
    targets.resize(targetLen);
    for (uint32_t i = 1; i <= targetLen; ++i) {
        memcpy(&targets[i - 1], GET_BLEND_TARGET(targetsHandle[i]), sizeof(gfx::BlendTarget));
    }

    return &blendState;
}

} // namespace pipeline
} // namespace cc
