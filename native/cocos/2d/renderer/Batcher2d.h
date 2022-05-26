#pragma once
#include <cocos/base/TypeDef.h>
#include <cocos/2d/renderer/RenderEntity.h>
#include <vector>

namespace cc {
class Batcher2d
{
public:
    Batcher2d();
    ~Batcher2d();

    void updateRenderEntities(std::vector<RenderEntity*>&& renderEntities);

    // for debug
    void ItIsDebugFuncInBatcher2d();
private:
    std::vector<RenderEntity*> _renderEntities{};
};
}
