/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once
#include <array>
#include "2d/renderer/RenderDrawInfo.h"
#include "2d/renderer/StencilManager.h"
#include "base/Macros.h"
#include "base/TypeDef.h"
#include "bindings/utils/BindingUtils.h"
#include "core/ArrayBuffer.h"
#include "core/scene-graph/Node.h"

namespace cc {
class Batcher2d;

enum class RenderEntityType : uint8_t {
    STATIC,
    DYNAMIC,
    CROSSED,
};

enum class MaskMode : uint8_t {
    NONE,
    MASK,
    MASK_INVERTED,
    MASK_NODE,
    MASK_NODE_INVERTED
};

struct EntityAttrLayout {
    float localOpacity{1.0F};
    uint8_t colorR{255};
    uint8_t colorG{255};
    uint8_t colorB{255};
    uint8_t colorA{255};
    uint8_t maskMode{0};
    uint8_t colorDirtyBit{1};
    uint8_t enabledIndex{0};
    uint8_t useLocal{0};
};

class RenderEntity final : public Node::UserData {
public:
    static constexpr uint32_t STATIC_DRAW_INFO_CAPACITY = 4;

    explicit RenderEntity(RenderEntityType type);
    ~RenderEntity() override;

    void addDynamicRenderDrawInfo(RenderDrawInfo* drawInfo);
    void setDynamicRenderDrawInfo(RenderDrawInfo* drawInfo, uint32_t index);
    void removeDynamicRenderDrawInfo();
    void clearDynamicRenderDrawInfos();
    void clearStaticRenderDrawInfos();

    inline bool getIsMask() const {
        return static_cast<MaskMode>(_entityAttrLayout.maskMode) == MaskMode::MASK || static_cast<MaskMode>(_entityAttrLayout.maskMode) == MaskMode::MASK_INVERTED;
    }

    inline bool getIsSubMask() const {
        return static_cast<MaskMode>(_entityAttrLayout.maskMode) == MaskMode::MASK_NODE || static_cast<MaskMode>(_entityAttrLayout.maskMode) == MaskMode::MASK_NODE_INVERTED;
    }

    inline bool getIsMaskInverted() const {
        return static_cast<MaskMode>(_entityAttrLayout.maskMode) == MaskMode::MASK_INVERTED || static_cast<MaskMode>(_entityAttrLayout.maskMode) == MaskMode::MASK_NODE_INVERTED;
    }

    inline bool getUseLocal() const { return _entityAttrLayout.useLocal; }
    inline void setUseLocal(bool useLocal) {
        _entityAttrLayout.useLocal = useLocal;
    }

    inline Node* getNode() const { return _node; }
    void setNode(Node* node);

    inline Node* getRenderTransform() const { return _renderTransform; }
    void setRenderTransform(Node* renderTransform);

    inline uint32_t getStencilStage() const { return static_cast<uint32_t>(_stencilStage); }
    inline void setStencilStage(uint32_t stage) {
        _stencilStage = static_cast<StencilStage>(stage);
    }
    inline StencilStage getEnumStencilStage() const { return _stencilStage; }
    inline void setEnumStencilStage(StencilStage stage) {
        _stencilStage = stage;
    }

    inline RenderEntityType getRenderEntityType() const { return _renderEntityType; };

    inline uint32_t getStaticDrawInfoSize() const { return _staticDrawInfoSize; };
    void setStaticDrawInfoSize(uint32_t size);

    RenderDrawInfo* getStaticRenderDrawInfo(uint32_t index);
    std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY>& getStaticRenderDrawInfos();
    RenderDrawInfo* getDynamicRenderDrawInfo(uint32_t index);
    ccstd::vector<RenderDrawInfo*>& getDynamicRenderDrawInfos();

    inline se::Object* getEntitySharedBufferForJS() const { return _entitySharedBufferActor.getSharedArrayBufferObject(); }
    inline bool getColorDirty() const { return _entityAttrLayout.colorDirtyBit != 0; }
    inline void setColorDirty(bool dirty) { _entityAttrLayout.colorDirtyBit = dirty ? 1 : 0; }
    inline bool getVBColorDirty() const { return _vbColorDirty; }
    inline void setVBColorDirty(bool vbColorDirty) { _vbColorDirty = vbColorDirty; }
    inline Color getColor() const { return Color(_entityAttrLayout.colorR, _entityAttrLayout.colorG, _entityAttrLayout.colorB, _entityAttrLayout.colorA); }
    inline float getColorAlpha() const { return static_cast<float>(_entityAttrLayout.colorA) / 255.F; }
    inline float getLocalOpacity() const { return _entityAttrLayout.localOpacity; }
    inline float getOpacity() const { return _opacity; }
    inline void setOpacity(float opacity) { _opacity = opacity; }
    inline bool isEnabled() const { return _entityAttrLayout.enabledIndex != 0; }
    inline uint32_t getRenderDrawInfosSize() const {
        return _renderEntityType == RenderEntityType::STATIC ? _staticDrawInfoSize : static_cast<uint32_t>(_dynamicDrawInfos.size());
    }
    inline RenderDrawInfo* getRenderDrawInfoAt(uint32_t index) {
        return _renderEntityType == RenderEntityType::STATIC ? &(_staticDrawInfos[index]) : _dynamicDrawInfos[index];
    }

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(RenderEntity);
    // weak reference
    Node* _node{nullptr};

    // weak reference
    Node* _renderTransform{nullptr};

    EntityAttrLayout _entityAttrLayout;
    float _opacity{1.0F};

    bindings::NativeMemorySharedToScriptActor _entitySharedBufferActor;
    union {
        std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY> _staticDrawInfos;
        ccstd::vector<RenderDrawInfo*> _dynamicDrawInfos;
    };
    StencilStage _stencilStage{StencilStage::DISABLED};
    RenderEntityType _renderEntityType{RenderEntityType::STATIC};
    uint8_t _staticDrawInfoSize{0};
    bool _vbColorDirty{true};
};
} // namespace cc
