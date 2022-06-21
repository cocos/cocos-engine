#include <2d/renderer/RenderEntity.h>
#include <2d/renderer/Batcher2d.h>

namespace cc {
RenderEntity::RenderEntity(Batcher2d* batcher) {
    _batcher = batcher;
}

RenderEntity::~RenderEntity(){
    _drawInfos.clear();
}

void RenderEntity::addRenderDrawInfo(RenderDrawInfo* drawInfo) {
    _drawInfos.push_back(drawInfo);
}
void RenderEntity::setRenderDrawInfo(RenderDrawInfo* drawInfo, index_t index) {
    if (index < _drawInfos.size()) {
        _drawInfos[index] = drawInfo;
    }
}
void RenderEntity::setNode(Node* node) {
    _node = node;
    node->setUserData(this);
}
RenderDrawInfo* RenderEntity::getRenderDrawInfo() {
    if (_drawInfos.size() > 0) {
        return _drawInfos[0];
    }
    return nullptr;
}
ccstd::vector<RenderDrawInfo*>& RenderEntity::getRenderDrawInfos() {
    return _drawInfos;
}
}
