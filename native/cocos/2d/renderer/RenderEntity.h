#pragma once
#include <2d/renderer/RenderDrawInfo.h>
#include <cocos/base/TypeDef.h>
#include <cocos/core/ArrayBuffer.h>
#include <cocos/core/scene-graph/Node.h>
#include <array>
#include <vector>

namespace cc {
class Batcher2d;

enum class RenderEntityType {
    STATIC,
    DYNAMIC
};

struct EntityAttrLayout {
    float_t colorR;
    float_t colorG;
    float_t colorB;
    float_t colorA;
    float_t colorDirtyBit;
    float_t localOpacity;
    float_t enabledIndex;
};

class RenderEntity final : public Node::UserData {
public:
    static constexpr uint32_t STATIC_DRAW_INFO_CAPACITY = 4;

    RenderEntity();
    explicit RenderEntity(Batcher2d* batcher);
    ~RenderEntity();

    void addDynamicRenderDrawInfo(RenderDrawInfo* drawInfo);
    void setDynamicRenderDrawInfo(RenderDrawInfo* drawInfo, uint32_t index);
    void removeDynamicRenderDrawInfo();

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

    inline const ArrayBuffer& getEntitySharedBufferForJS() const { return *_entitySharedBuffer; }
    inline bool getColorDirty() const { return _entityAttrLayout.colorDirtyBit != 0; }
    inline void setColorDirty(bool dirty) { _entityAttrLayout.colorDirtyBit = dirty ? 1 : 0; }
    inline Color getColor() const { return Color(_entityAttrLayout.colorR, _entityAttrLayout.colorG, _entityAttrLayout.colorB, _entityAttrLayout.colorA); }
    inline float_t getColorAlpha() const { return _entityAttrLayout.colorA / 255; }
    inline float_t getLocalOpacity() const { return _entityAttrLayout.localOpacity; }
    inline float_t getOpacity() const { return _opacity; }
    inline void setOpacity(float_t opacity) { _opacity = opacity; }
    //inline float_t getAlphaAndOpacity() const { return _opacity * _entityAttrLayout.colorA; }
    inline bool getEnabled() const { return _entityAttrLayout.enabledIndex != 0; }

private:
    uint32_t _staticDrawInfoSize{0};
    std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY> _staticDrawInfos{};
    ccstd::vector<RenderDrawInfo*> _dynamicDrawInfos{};

    Batcher2d* _batcher{nullptr};
    Node* _node{nullptr};

    RenderEntityType _renderEntityType{RenderEntityType::STATIC};

    EntityAttrLayout _entityAttrLayout{};
    se::Object* _seArrayBufferObject{nullptr};
    ArrayBuffer::Ptr _entitySharedBuffer{nullptr};
    float_t _opacity{1.0f};
};
} // namespace cc
