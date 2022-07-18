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
#include "2d/renderer/UIMeshBuffer.h"
#include "base/Macros.h"
#include "base/TypeDef.h"
#include "bindings/utils/BindingUtils.h"
#include "core/ArrayBuffer.h"
#include "core/assets/Material.h"
#include "core/scene-graph/Node.h"
#include "math/Color.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "math/Vec4.h"
#include "renderer/gfx-base/states/GFXSampler.h"
#include "scene/Model.h"

namespace cc {
struct Render2dLayout {
    Vec3 position;
    Vec2 uv;
    Vec4 color;
};

struct DrawInfoAttrLayout {
    uint32_t enabledIndex{1};
};

enum class RenderDrawInfoType: uint8_t {
    COMP,
    MODEL,
    IA
};

class Batcher2d;
class RenderDrawInfo final {
public:
    RenderDrawInfo() = default;
    RenderDrawInfo(index_t bufferId, uint32_t vertexOffset, uint32_t indexOffset);
    ~RenderDrawInfo();

    inline index_t getAccId() const { return _accId; }
    void setAccId(index_t id);
    inline index_t getBufferId() const { return _bufferId; }
    void setBufferId(index_t bufferId);
    inline uint32_t getVertexOffset() const { return _vertexOffset; }
    void setVertexOffset(uint32_t vertexOffset);
    inline uint32_t getIndexOffset() const { return _indexOffset; }
    void setIndexOffset(uint32_t indexOffset);
    inline UIMeshBuffer* getMeshBuffer() const { return _meshBuffer; };
    inline float* getVbBuffer() const { return _vbBuffer; }
    void setVbBuffer(float* vbBuffer);
    inline uint16_t* getIbBuffer() const { return _ibBuffer; }
    void setIbBuffer(uint16_t* ibBuffer);
    inline float* getVDataBuffer() const { return _vDataBuffer; }
    void setVDataBuffer(float* vDataBuffer);
    inline uint16_t* getIDataBuffer() const { return _iDataBuffer; }
    void setIDataBuffer(uint16_t* iDataBuffer);
    inline uint32_t getVbCount() const { return _vbCount; }
    void setVbCount(uint32_t vbCount);
    inline uint32_t getIbCount() const { return _ibCount; }
    void setIbCount(uint32_t ibCount);
    inline bool getVertDirty() const { return _vertDirty; }
    void setVertDirty(bool val);
    inline ccstd::hash_t getDataHash() const { return _dataHash; }
    void setDataHash(ccstd::hash_t dataHash);
    inline bool getIsMeshBuffer() const { return _isMeshBuffer; }
    void setIsMeshBuffer(bool isMeshBuffer);
    inline Material* getMaterial() const { return _material; }
    void setMaterial(Material* material);
    inline gfx::Texture* getTexture() const { return _texture; }
    void setTexture(gfx::Texture* texture);
    inline uint32_t getTextureHash() const { return _textureHash; }
    void setTextureHash(uint32_t textureHash);
    inline gfx::Sampler* getSampler() const { return _sampler; }
    void setSampler(gfx::Sampler* sampler);
    inline uint32_t getBlendHash() const { return _blendHash; }
    void setBlendHash(uint32_t blendHash);
    inline scene::Model* getModel() const { return _model; }
    void setModel(scene::Model* model);
    inline uint32_t getDrawInfoType() const { return static_cast<uint32_t>(_drawInfoType); }
    void setDrawInfoType(uint32_t type);

    inline RenderDrawInfoType getEnumDrawInfoType() const { return _drawInfoType; }

    void setRender2dBufferToNative(uint8_t* buffer, uint8_t stride, uint32_t size);

    inline Render2dLayout* getRender2dLayout(uint32_t dataOffset) {
        return reinterpret_cast<Render2dLayout*>(_sharedBuffer + dataOffset * sizeof(float));
    }

    inline uint8_t getStride() const { return _stride; }
    inline uint32_t getSize() const { return _size; }

    gfx::InputAssembler* requestIA(gfx::Device* device);
    void uploadBuffers();
    void resetMeshIA();

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(RenderDrawInfo);
    void destroy();

    gfx::InputAssembler* initIAInfo(gfx::Device* device);
    // weak reference
    uint8_t* _sharedBuffer{nullptr};
    uint32_t _size{0};

    index_t _bufferId{0};
    index_t _accId{0};
    uint32_t _vertexOffset{0};

    uint32_t _indexOffset{0};

    // weak reference
    float* _vbBuffer{nullptr};
    // weak reference
    uint16_t* _ibBuffer{nullptr};
    // weak reference
    float* _vDataBuffer{nullptr};
    // weak reference
    uint16_t* _iDataBuffer{nullptr};
    // weak reference
    UIMeshBuffer* _meshBuffer{nullptr};

    uint32_t _vbCount{0};
    uint32_t _ibCount{0};

    uint8_t _stride{0};
    bool _vertDirty{false};
    bool _isMeshBuffer{false};
    RenderDrawInfoType _drawInfoType{RenderDrawInfoType::COMP};

    // weak reference
    scene::Model* _model{nullptr};

    ccstd::hash_t _dataHash{0};
    uint32_t _stencilStage{0};
    // weak reference
    Material* _material{nullptr};
    // weak reference
    gfx::Texture* _texture{nullptr};
    uint32_t _textureHash{0};
    // weak reference
    gfx::Sampler* _sampler{nullptr};

    uint32_t _blendHash{0};

    gfx::InputAssemblerInfo _iaInfo;
    ccstd::vector<gfx::Attribute> _attributes{
        gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
        gfx::Attribute{gfx::ATTR_NAME_TEX_COORD, gfx::Format::RG32F},
        gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA32F},
    };
    uint32_t _vertexFormatBytes = 9 * sizeof(float); // Affected by _attributes // magic Number

    //TODO(): it is not a good way to cache IA here.
    // manage memory manually
    ccstd::vector<gfx::InputAssembler*> _iaPool;
    uint32_t _nextFreeIAHandle{0};
    // weak reference
    gfx::Buffer* _vbGFXBuffer{nullptr};
    // weak reference
    gfx::Buffer* _ibGFXBuffer{nullptr};
};
} // namespace cc
