#include <2d/renderer/Batcher2d.h>
#include <2d/renderer/RenderEntity.h>

namespace cc {
RenderEntity::RenderEntity() : RenderEntity(nullptr) {
}

RenderEntity::RenderEntity(Batcher2d* batcher) {
    _batcher = batcher;

    for (uint32_t i = 0; i < RenderEntity::STATIC_DRAW_INFO_COUNT; i++) {
        _staticDrawInfos[i].setBatcher(_batcher);
    }
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
void RenderEntity::setNode(Node* node) {
    _node = node;
    node->setUserData(this);
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
RenderDrawInfo* RenderEntity::getStaticRenderDrawInfo(uint32_t index) {
    if (index < 0 || index >= RenderEntity::STATIC_DRAW_INFO_COUNT) {
        return nullptr;
    }
    return &(_staticDrawInfos[index]);
}
} // namespace cc
