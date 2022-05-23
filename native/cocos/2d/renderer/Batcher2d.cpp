#include <2d/renderer/Batcher2d.h>
#include <cocos/base/TypeDef.h>

namespace cc {
Batcher2d::Batcher2d()
{
}

Batcher2d::~Batcher2d()
{
}

void Batcher2d::updateRenderEntities(std::vector<RenderEntity*>&& renderEntities) {
    this->_renderEntities = std::move(renderEntities);
}
} // namespace cc
