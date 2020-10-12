#include "SharedMemory.h"

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
const se::PoolType InstancedAttribute::type = se::PoolType::UNKNOWN;
const se::PoolType BufferView::type = se::PoolType::UNKNOWN;
const se::PoolType FlatBuffer::type = se::PoolType::UNKNOWN;
const se::PoolType RenderingSubMesh::type = se::PoolType::UNKNOWN;
const se::PoolType Node::type = se::PoolType::NODE;
const se::PoolType Root::type = se::PoolType::ROOT;
const se::PoolType RenderWindow::type = se::PoolType::RENDER_WINDOW;
const se::PoolType Shadows::type = se::PoolType::SHADOW;
const se::PoolType Sphere::type = se::PoolType::SPHERE;

void AABB::getBoundary(cc::Vec3 &minPos, cc::Vec3 &maxPos) const {
    minPos = center - halfExtents;
    maxPos = center + halfExtents;
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

void Sphere::mergeAABB(const AABB *aabb) {
    cc::Vec3 minPos, maxPos;
    aabb->getBoundary(minPos, maxPos);
    mergePoint(minPos);
    mergePoint(maxPos);
}
} // namespace pipeline
} // namespace cc
