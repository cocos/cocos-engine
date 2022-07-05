#include <2d/renderer/Batcher2d.h>
#include <2d/renderer/RenderEntity.h>

namespace cc {
RenderEntity::RenderEntity() : RenderEntity(nullptr) {
}

RenderEntity::RenderEntity(Batcher2d* batcher) {
    _batcher = batcher;

    for (uint32_t i = 0; i < RenderEntity::STATIC_DRAW_INFO_CAPACITY; i++) {
        _staticDrawInfos[i].setBatcher(_batcher);
    }

    _seArrayBufferObject = se::Object::createExternalArrayBufferObject(&_entityAttrLayout, sizeof(EntityAttrLayout), [](void* a, size_t b, void* c) {});
    _seArrayBufferObject->root();
    _entitySharedBuffer = new ArrayBuffer();
    _entitySharedBuffer->setJSArrayBuffer(_seArrayBufferObject);
}

RenderEntity::~RenderEntity() {
    _dynamicDrawInfos.clear();
}

void RenderEntity::addDynamicRenderDrawInfo(RenderDrawInfo* drawInfo) {
    _dynamicDrawInfos.push_back(drawInfo);
}
void RenderEntity::setDynamicRenderDrawInfo(RenderDrawInfo* drawInfo, uint32_t index) {
    if (index < _dynamicDrawInfos.size()) {
        _dynamicDrawInfos[index] = drawInfo;
    }
}
void RenderEntity::removeDynamicRenderDrawInfo() {
    if (_dynamicDrawInfos.empty()) return;
    _dynamicDrawInfos.pop_back(); // 泄漏 & crash
}
void RenderEntity::setNode(Node* node) {
    _node = node;
    node->setUserData(this);
}
void RenderEntity::setStencilStage(uint32_t stage) {
    _stencilStage = static_cast<StencilStage>(stage);
}
void RenderEntity::setEnumStencilStage(StencilStage stage) {
    _stencilStage = stage;
}
void RenderEntity::setCustomMaterial(Material* mat) {
    _customMaterial = mat;
}
void RenderEntity::setCommitModelMaterial(Material* mat) {
    _commitModelMaterial = mat;
}
void RenderEntity::setRenderEntityType(uint32_t type) {
    _renderEntityType = static_cast<RenderEntityType>(type);
}

// to be modified
RenderDrawInfo* RenderEntity::getDynamicRenderDrawInfo(uint32_t index) {
    if (index < 0 || index >= _dynamicDrawInfos.size()) {
        return nullptr;
    }
    return _dynamicDrawInfos[index];
}
ccstd::vector<RenderDrawInfo*>& RenderEntity::getDynamicRenderDrawInfos() {
    return _dynamicDrawInfos;
}
void RenderEntity::setStaticDrawInfoSize(uint32_t size) {
    CC_ASSERT(size < RenderEntity::STATIC_DRAW_INFO_CAPACITY);
    _staticDrawInfoSize = size;
}
RenderDrawInfo* RenderEntity::getStaticRenderDrawInfo(uint32_t index) {
    CC_ASSERT(index < _staticDrawInfoSize);
    return &(_staticDrawInfos[index]);
}
std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY>& RenderEntity::getStaticRenderDrawInfos() {
    return _staticDrawInfos;
}
} // namespace cc
