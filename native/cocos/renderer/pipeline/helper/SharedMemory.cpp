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
const se::PoolType MainLight::type = se::PoolType::UNKNOWN;
const se::PoolType Ambient::type = se::PoolType::UNKNOWN;
const se::PoolType Fog::type = se::PoolType::UNKNOWN;
const se::PoolType InstancedAttribute::type = se::PoolType::UNKNOWN;
const se::PoolType BufferView::type = se::PoolType::UNKNOWN;
const se::PoolType FlatBuffer::type  = se::PoolType::UNKNOWN;
const se::PoolType RenderingSubMesh::type = se::PoolType::UNKNOWN;
const se::PoolType Node::type = se::PoolType::NODE;
const se::PoolType Root::type = se::PoolType::ROOT;
const se::PoolType RenderWindow::type = se::PoolType::RENDER_WINDOW;


} // namespace pipeline
} // namespace cc
