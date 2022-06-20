#pragma once
#include <cocos/2d/renderer/UIMeshBuffer.h>
#include <cocos/base/TypeDef.h>
#include <cocos/core/assets/Material.h>
#include <cocos/core/scene-graph/Node.h>
#include <cocos/renderer/gfx-base/states/GFXSampler.h>
#include <math/Color.h>
#include <math/Vec2.h>
#include <math/Vec3.h>
#include <math/Vec4.h>
#include <vector>

namespace cc {
struct Render2dLayout {
    cc::Vec3 position;
    cc::Vec2 uv;
    cc::Vec4 color;
};

struct DrawInfoAttrLayout {
    index_t enabledIndex;
};

class Batcher2d;
class RenderDrawInfo {
public:
    RenderDrawInfo();
    explicit RenderDrawInfo(Batcher2d* batcher);
    RenderDrawInfo(const index_t bufferId, const index_t vertexOffset, const index_t indexOffset);
    ~RenderDrawInfo();

    inline index_t getBufferId() const { return this->_bufferId; }
    void setBufferId(index_t bufferId);
    inline index_t getVertexOffset() const { return this->_vertexOffset; }
    void setVertexOffset(index_t vertexOffset);
    inline index_t getIndexOffset() const { return this->_indexOffset; }
    void setIndexOffset(index_t indexOffset);
    inline UIMeshBuffer* getMeshBuffer() const { return this->_meshBuffer; };
    inline float_t* getVbBuffer() const { return this->_vbBuffer; }
    void setVbBuffer(float_t* vbBuffer);
    inline uint16_t* getIbBuffer() const { return this->_ibBuffer; }
    void setIbBuffer(uint16_t* ibBuffer);
    inline float_t* getVDataBuffer() const { return this->_vDataBuffer; }
    void setVDataBuffer(float_t* vDataBuffer);
    inline uint16_t* getIDataBuffer() const { return this->_iDataBuffer; }
    void setIDataBuffer(uint16_t* iDataBuffer);
    inline index_t getVbCount() const { return this->_vbCount; }
    void setVbCount(index_t vbCount);
    inline index_t getIbCount() const { return this->_ibCount; }
    void setIbCount(index_t ibCount);
    inline Node* getNode() const { return this->_node; }
    void setNode(Node* node);
    inline bool getVertDirty() const { return this->_vertDirty; }
    void setVertDirty(bool val);
    inline uint32_t getDataHash() const { return this->_dataHash; }
    void setDataHash(uint32_t dataHash);
    inline index_t getStencilStage() const { return this->_stencilStage; }
    void setStencilStage(index_t stencilStage);
    inline bool getIsMeshBuffer() const { return this->_isMeshBuffer; }
    void setIsMeshBuffer(bool isMeshBuffer);
    inline Material* getMaterial() const { return this->_material; }
    void setMaterial(Material* material);
    inline gfx::Texture* getTexture() const { return this->_texture; }
    void setTexture(gfx::Texture* texture);
    inline index_t getTextureHash() const { return this->_textureHash; }
    void setTextureHash(index_t textureHash);
    inline gfx::Sampler* getSampler() const { return this->_sampler; }
    void setSampler(gfx::Sampler* sampler);
    inline index_t getBlendHash() const { return this->_blendHash; }
    void setBlendHash(index_t blendHash);

    void setRender2dBufferToNative(uint8_t* buffer, uint8_t stride, uint32_t size);
    void syncSharedBufferToNative(index_t* buffer);

public:
    inline bool getEnabled() const { return _entityAttrLayout->enabledIndex != 0; }

    void parseAttrLayout();

public:
    inline Render2dLayout* getRender2dLayout(index_t dataOffset) {
        return reinterpret_cast<Render2dLayout*>(this->_sharedBuffer + dataOffset * sizeof(float_t));
    }

    inline uint8_t getStride() { return this->_stride; }
    inline uint32_t getSize() { return this->_size; }

private:
    Batcher2d* _batcher;

private:
    uint8_t* _sharedBuffer{nullptr};
    uint8_t _stride{0};
    uint32_t _size{0};

    DrawInfoAttrLayout* _entityAttrLayout{nullptr};
    index_t* _attrSharedBuffer{nullptr};

private:
    index_t _bufferId{0};
    index_t _vertexOffset{0};

    index_t _indexOffset{0};

    float_t* _vbBuffer{nullptr};
    uint16_t* _ibBuffer{nullptr};
    float_t* _vDataBuffer{nullptr};
    uint16_t* _iDataBuffer{nullptr};
    UIMeshBuffer* _meshBuffer{nullptr};

    index_t _vbCount{0};
    index_t _ibCount{0};

    Node* _node{nullptr};

    bool _vertDirty{false};

private: // for merging batches
    uint32_t _dataHash{0};
    index_t _stencilStage{0};
    bool _isMeshBuffer{false};
    Material* _material{nullptr};
    gfx::Texture* _texture{nullptr};
    index_t _textureHash{0};
    gfx::Sampler* _sampler{nullptr};

    index_t _blendHash{0};
};

} // namespace cc
