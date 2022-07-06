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
#include <vector>
#include "2d/renderer/UIMeshBuffer.h"
#include "base/Macros.h"
#include "base/TypeDef.h"
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
    uint32_t enabledIndex;
};

class Batcher2d;
class RenderDrawInfo final {
public:
    RenderDrawInfo();
    explicit RenderDrawInfo(Batcher2d* batcher);
    RenderDrawInfo(const index_t bufferId, const uint32_t vertexOffset, const uint32_t indexOffset);
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
    inline float_t* getVbBuffer() const { return _vbBuffer; }
    void setVbBuffer(float_t* vbBuffer);
    inline uint16_t* getIbBuffer() const { return _ibBuffer; }
    void setIbBuffer(uint16_t* ibBuffer);
    inline float_t* getVDataBuffer() const { return _vDataBuffer; }
    void setVDataBuffer(float_t* vDataBuffer);
    inline uint16_t* getIDataBuffer() const { return _iDataBuffer; }
    void setIDataBuffer(uint16_t* iDataBuffer);
    inline uint32_t getVbCount() const { return _vbCount; }
    void setVbCount(uint32_t vbCount);
    inline uint32_t getIbCount() const { return _ibCount; }
    void setIbCount(uint32_t ibCount);
    inline Node* getNode() const { return _node; }
    void setNode(Node* node);
    inline bool getVertDirty() const { return _vertDirty; }
    void setVertDirty(bool val);
    inline ccstd::hash_t getDataHash() const { return _dataHash; }
    void setDataHash(ccstd::hash_t dataHash);
    inline uint32_t getStencilStage() const { return _stencilStage; }
    void setStencilStage(uint32_t stencilStage);
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

    void setRender2dBufferToNative(uint8_t* buffer, uint8_t stride, uint32_t size, uint8_t type);

    inline Batcher2d* getBatcher() const { return _batcher; }
    void setBatcher(Batcher2d* batcher);
    const ArrayBuffer& getAttrSharedBufferForJS() const;

    inline Render2dLayout* getRender2dLayout(uint32_t dataOffset) {
        return reinterpret_cast<Render2dLayout*>(_sharedBuffer + dataOffset * sizeof(float_t));
    }

    inline uint8_t getStride() { return _stride; }
    inline uint32_t getSize() { return _size; }
    inline uint8_t getDrawType() { return _drawType; }

    gfx::InputAssembler* requestIA(gfx::Device* device);
    void uploadBuffers();
    void resetMeshIA();

protected:
    CC_DISALLOW_COPY_MOVE_ASSIGN(RenderDrawInfo);

private:
    gfx::InputAssembler* _initIAInfo(gfx::Device* device);

    Batcher2d* _batcher{nullptr};

    uint8_t* _sharedBuffer{nullptr};
    uint8_t _stride{0};
    uint32_t _size{0};

    DrawInfoAttrLayout _drawInfoAttrLayout{};
    se::Object* _seArrayBufferObject{nullptr};
    ArrayBuffer::Ptr _attrSharedBuffer{nullptr};

    index_t _bufferId{0};
    index_t _accId{0};
    uint32_t _vertexOffset{0};

    uint32_t _indexOffset{0};

    float_t* _vbBuffer{nullptr};
    uint16_t* _ibBuffer{nullptr};
    float_t* _vDataBuffer{nullptr};
    uint16_t* _iDataBuffer{nullptr};
    UIMeshBuffer* _meshBuffer{nullptr};

    uint32_t _vbCount{0};
    uint32_t _ibCount{0};

    Node* _node{nullptr};

    bool _vertDirty{false};
    uint8_t _drawType{0};

    scene::Model* _model{nullptr};

    ccstd::hash_t _dataHash{0};
    uint32_t _stencilStage{0};
    bool _isMeshBuffer{false};
    Material* _material{nullptr};
    gfx::Texture* _texture{nullptr};
    uint32_t _textureHash{0};
    gfx::Sampler* _sampler{nullptr};

    uint32_t _blendHash{0};

    gfx::InputAssemblerInfo _iaInfo;
    ccstd::vector<gfx::Attribute> _attributes{
        gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
        gfx::Attribute{gfx::ATTR_NAME_TEX_COORD, gfx::Format::RG32F},
        gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA32F},
    };

    ccstd::vector<gfx::InputAssembler*> _iaPool{};
    uint32_t _nextFreeIAHandle{0};
    gfx::Buffer* _vbGFXBuffer{nullptr};
    gfx::Buffer* _ibGFXBuffer{nullptr};
};
} // namespace cc
