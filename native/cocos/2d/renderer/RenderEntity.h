#pragma once
#include <2d/renderer/RenderDrawInfo.h>
#include <cocos/base/TypeDef.h>
#include <cocos/core/scene-graph/Node.h>
#include <array>
#include <vector>

namespace cc {
class Batcher2d;

enum class RenderEntityType {
    STATIC,
    DYNAMIC
};

class RenderEntity final : public Node::UserData {
public:
    static constexpr uint32_t STATIC_DRAW_INFO_CAPACITY = 4;

    RenderEntity();
    explicit RenderEntity(Batcher2d* batcher);
    ~RenderEntity();

    void addDynamicRenderDrawInfo(RenderDrawInfo* drawInfo);
    void setDynamicRenderDrawInfo(RenderDrawInfo* drawInfo, uint32_t index);

    inline Node* getNode() const { return _node; }
    void setNode(Node* node);

    inline RenderEntityType getRenderEntityType() const { return _renderEntityType; };
    void setRenderEntityType(uint32_t type);

    inline uint32_t getStaticDrawInfoSize() const { return _staticDrawInfoSize; };
    void setStaticDrawInfoSize(uint32_t size);

    RenderDrawInfo* getStaticRenderDrawInfo(uint32_t index);
    std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY>& getStaticRenderDrawInfos();
    RenderDrawInfo* getDynamicRenderDrawInfo(uint32_t index);
    ccstd::vector<RenderDrawInfo*>& getDynamicRenderDrawInfos();

private:
    uint32_t _staticDrawInfoSize{0};
    std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY> _staticDrawInfos{};
    ccstd::vector<RenderDrawInfo*> _dynamicDrawInfos{};

    Batcher2d* _batcher{nullptr};
    Node* _node{nullptr};

    RenderEntityType _renderEntityType{RenderEntityType::STATIC};
};
} // namespace cc
