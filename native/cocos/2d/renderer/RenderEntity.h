#pragma once
#include <cocos/base/TypeDef.h>
#include <vector>
#include <math/Vec2.h>
#include <math/Vec3.h>
#include <math/Vec4.h>
#include <math/Color.h>
#include <cocos/core/scene-graph/Node.h>
#include <cocos/core/assets/Material.h>
#include <cocos/renderer/gfx-base/states/GFXSampler.h>
#include <cocos/2d/renderer/UIMeshBuffer.h>

namespace cc {
struct Render2dLayout {
    cc::Vec3 position;
    cc::Vec2 uv;
    cc::Vec4 color; // use Vec4 instead of Color because of bytes alignment
};

struct EntityAttrLayout {
    index_t currIndex;
    index_t nextIndex;
};

class Batcher2d;
class RenderEntity {
public:
    RenderEntity();
    explicit RenderEntity(Batcher2d* batcher);
    RenderEntity(const index_t bufferId, const index_t vertexOffset, const index_t indexOffset);
    ~RenderEntity();
    
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

    //inline ccstd::vector<AdvanceRenderData*> getDataArr() { return this->_dataArr; }
    //void setAdvanceRenderDataArr(std::vector<AdvanceRenderData*>&& arr);

    void setRender2dBufferToNative(uint8_t* buffer, uint8_t stride, uint32_t size);

    // for debug
    void ItIsDebugFuncInRenderEntity();

public:
    inline index_t getCurrIndex() const { return _entityAttrLayout->currIndex; }
    void setCurrIndex(index_t currIndex);
    inline index_t getNextIndex() const { return _entityAttrLayout->nextIndex; }
    void setNextIndex(index_t nextIndex);

    void syncSharedBufferToNative(index_t* buffer);
    void parseAttrLayout();

public:
    //这里每次获取时都应该对buffer做一次解析
    //ccstd::vector<Render2dLayout*>& getRenderDataArr();
    inline Render2dLayout* getRender2dLayout(index_t dataOffset) {
        return reinterpret_cast<Render2dLayout*>(this->_sharedBuffer + dataOffset * sizeof(float_t));;
    }

    //void parseLayout();
    //void refreshLayout();
    inline uint8_t getStride() { return this->_stride; }
    inline uint32_t getSize() { return this->_size; }

private:
    Batcher2d* _batcher;

private:
    // use this
    //ccstd::vector<Render2dLayout*> _render2dLayoutArr{};
    uint8_t* _sharedBuffer{nullptr};
    uint8_t _stride{0};
    uint32_t _size{0};

    EntityAttrLayout* _entityAttrLayout{nullptr};
    index_t* _attrSharedBuffer{nullptr};

private:
    // updateWorld 数据计算用到
    index_t _bufferId{0};
    index_t _vertexOffset{0};

    // 这个要使用batcher2d里的字段，它不跟这entity走
    index_t _indexOffset{0};

    float_t* _vbBuffer{nullptr};
    uint16_t* _ibBuffer{nullptr};
    float_t* _vDataBuffer{nullptr};
    uint16_t* _iDataBuffer{nullptr};
    UIMeshBuffer* _meshBuffer{nullptr};

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
}
