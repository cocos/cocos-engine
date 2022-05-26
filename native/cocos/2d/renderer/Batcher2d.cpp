#include <2d/renderer/Batcher2d.h>
#include <cocos/base/TypeDef.h>
#include <iostream>

namespace cc {
Batcher2d::Batcher2d() {
}

Batcher2d::~Batcher2d() {
}

void Batcher2d::updateRenderEntities(std::vector<RenderEntity*>&& renderEntities) {
    this->_renderEntities = std::move(renderEntities);
}
void Batcher2d::ItIsDebugFuncInBatcher2d() {
    std::cout << "It is debug func in Batcher2d.";
}
} // namespace cc
