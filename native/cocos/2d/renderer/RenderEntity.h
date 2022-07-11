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
#include "core/ArrayBuffer.h"
#include "core/scene-graph/Node.h"

namespace cc {
class Batcher2d;

enum class RenderEntityType {
    STATIC,
    DYNAMIC
};

struct EntityAttrLayout {
    float colorR;
    float colorG;
    float colorB;
    float colorA;
    float colorDirtyBit;
    float localOpacity;
    float enabledIndex;
};

class RenderEntity final : public Node::UserData {
public:
    static constexpr uint32_t STATIC_DRAW_INFO_CAPACITY = 4;

    RenderEntity();
    explicit RenderEntity(Batcher2d* batcher);
    ~RenderEntity() override;

    void addDynamicRenderDrawInfo(RenderDrawInfo* drawInfo);
    void setDynamicRenderDrawInfo(RenderDrawInfo* drawInfo, uint32_t index);
    void removeDynamicRenderDrawInfo();

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

    inline Material* getCustomMaterial() const { return _customMaterial; }
    void setCustomMaterial(Material* mat);

    inline Material* getCommitModelMaterial() const { return _commitModelMaterial; }
    void setCommitModelMaterial(Material* mat);

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
    inline Color getColor() const { return Color(static_cast<uint8_t>(_entityAttrLayout.colorR), static_cast<uint8_t>(_entityAttrLayout.colorG), static_cast<uint8_t>(_entityAttrLayout.colorB), static_cast<uint8_t>(_entityAttrLayout.colorA)); }
    inline float getColorAlpha() const { return _entityAttrLayout.colorA / 255; }
    inline float getLocalOpacity() const { return _entityAttrLayout.localOpacity; }
    inline float getOpacity() const { return _opacity; }
    inline void setOpacity(float opacity) { _opacity = opacity; }
    inline bool isEnabled() const { return _entityAttrLayout.enabledIndex != 0; }

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(RenderEntity);

    uint32_t _staticDrawInfoSize{0};
    std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY> _staticDrawInfos;
    ccstd::vector<RenderDrawInfo*> _dynamicDrawInfos;

    // weak reference
    Batcher2d* _batcher{nullptr};
    // weak reference
    Node* _node{nullptr};
    StencilStage _stencilStage{StencilStage::DISABLED};
    // weak reference
    Material* _customMaterial{nullptr};
    // weak reference
    Material* _commitModelMaterial{nullptr};
    RenderEntityType _renderEntityType{RenderEntityType::STATIC};

    EntityAttrLayout _entityAttrLayout;
    ArrayBuffer::Ptr _entitySharedBuffer;

    float _opacity{1.0f};

    bool _isMask{false};
    bool _isSubMask{false};
    bool _isMaskInverted{false};
};
} // namespace cc
