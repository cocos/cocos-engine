/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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

enum class RenderEntityType: uint8_t {
    STATIC,
    DYNAMIC
};

struct EntityAttrLayout {
    float localOpacity{1.0F};
    uint8_t colorR{255};
    uint8_t colorG{255};
    uint8_t colorB{255};
    uint8_t colorA{255};
    uint8_t colorDirtyBit{1};
    uint8_t enabledIndex{1};
    uint8_t padding0{0}; //available
    uint8_t padding1{0}; //available
};

class RenderEntity final : public Node::UserData {
public:
    static constexpr uint32_t STATIC_DRAW_INFO_CAPACITY = 4;

    RenderEntity();
    ~RenderEntity() override;

    void addDynamicRenderDrawInfo(RenderDrawInfo* drawInfo);
    void setDynamicRenderDrawInfo(RenderDrawInfo* drawInfo, uint32_t index);
    void removeDynamicRenderDrawInfo();
    void clearDynamicRenderDrawInfos();

    inline bool getIsMask() const { return _isMask; }
    void setIsMask(bool isMask);

    inline bool getIsSubMask() const { return _isSubMask; }
    void setIsSubMask(bool isSubMask);

    inline bool getIsMaskInverted() const { return _isMaskInverted; }
    void setIsMaskInverted(bool isMaskInverted);

    inline Node* getNode() const { return _node; }
    void setNode(Node* node);

    inline uint32_t getStencilStage() const { return static_cast<uint32_t>(_stencilStage); }
    void setStencilStage(uint32_t stage);
    inline StencilStage getEnumStencilStage() const { return _stencilStage; }
    void setEnumStencilStage(StencilStage stage);

    inline RenderEntityType getRenderEntityType() const { return _renderEntityType; };
    void setRenderEntityType(uint32_t type);

    inline uint32_t getStaticDrawInfoSize() const { return _staticDrawInfoSize; };
    void setStaticDrawInfoSize(uint32_t size);

    RenderDrawInfo* getStaticRenderDrawInfo(uint32_t index);
    std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY>& getStaticRenderDrawInfos();
    RenderDrawInfo* getDynamicRenderDrawInfo(uint32_t index);
    ccstd::vector<RenderDrawInfo*>& getDynamicRenderDrawInfos();

    inline se::Object* getEntitySharedBufferForJS() const { return _entitySharedBufferActor.getSharedArrayBufferObject(); }
    inline bool getColorDirty() const { return _entityAttrLayout.colorDirtyBit != 0; }
    inline void setColorDirty(bool dirty) { _entityAttrLayout.colorDirtyBit = dirty ? 1 : 0; }
    inline Color getColor() const { return Color(_entityAttrLayout.colorR, _entityAttrLayout.colorG, _entityAttrLayout.colorB, _entityAttrLayout.colorA); }
    inline float getColorAlpha() const { return static_cast<float>(_entityAttrLayout.colorA) / 255.F; }
    inline float getLocalOpacity() const { return _entityAttrLayout.localOpacity; }
    inline float getOpacity() const { return _opacity; }
    inline void setOpacity(float opacity) { _opacity = opacity; }
    inline bool isEnabled() const { return _entityAttrLayout.enabledIndex != 0; }

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(RenderEntity);
    // weak reference
    Node* _node{nullptr};
    StencilStage _stencilStage{StencilStage::DISABLED};
    RenderEntityType _renderEntityType{RenderEntityType::STATIC};
    bool _isMask{false};
    bool _isSubMask{false};

    EntityAttrLayout _entityAttrLayout;
    float _opacity{1.0F};
    uint32_t _staticDrawInfoSize{0};

    bindings::NativeMemorySharedToScriptActor _entitySharedBufferActor;
    std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY> _staticDrawInfos;
    ccstd::vector<RenderDrawInfo*> _dynamicDrawInfos;
    bool _isMaskInverted{false};
};
} // namespace cc
