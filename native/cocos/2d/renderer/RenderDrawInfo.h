#pragma once
#include <cocos/2d/renderer/UIMeshBuffer.h>
#include <cocos/base/TypeDef.h>
#include <cocos/core/ArrayBuffer.h>
#include <cocos/core/assets/Material.h>
#include <cocos/core/scene-graph/Node.h>
#include <cocos/renderer/gfx-base/states/GFXSampler.h>
#include <math/Color.h>
#include <math/Vec2.h>
#include <math/Vec3.h>
#include <math/Vec4.h>
#include <vector>
#include <cocos/scene/Model.h>

namespace cc {
struct Render2dLayout {
    cc::Vec3 position;
    cc::Vec2 uv;
    cc::Vec4 color;
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
    inline index_t getBufferId() const { return this->_bufferId; }
    void setBufferId(index_t bufferId);
    inline uint32_t getVertexOffset() const { return this->_vertexOffset; }
    void setVertexOffset(uint32_t vertexOffset);
    inline uint32_t getIndexOffset() const { return this->_indexOffset; }
    void setIndexOffset(uint32_t indexOffset);
    inline UIMeshBuffer* getMeshBuffer() const { return this->_meshBuffer; };
    inline float_t* getVbBuffer() const { return this->_vbBuffer; }
    void setVbBuffer(float_t* vbBuffer);
    inline uint16_t* getIbBuffer() const { return this->_ibBuffer; }
    void setIbBuffer(uint16_t* ibBuffer);
    inline float_t* getVDataBuffer() const { return this->_vDataBuffer; }
    void setVDataBuffer(float_t* vDataBuffer);
    inline uint16_t* getIDataBuffer() const { return this->_iDataBuffer; }
    void setIDataBuffer(uint16_t* iDataBuffer);
    inline uint32_t getVbCount() const { return this->_vbCount; }
    void setVbCount(uint32_t vbCount);
    inline uint32_t getIbCount() const { return this->_ibCount; }
    void setIbCount(uint32_t ibCount);
    inline Node* getNode() const { return this->_node; }
    void setNode(Node* node);
    inline bool getVertDirty() const { return this->_vertDirty; }
    void setVertDirty(bool val);
    inline uint32_t getDataHash() const { return this->_dataHash; }
    void setDataHash(uint32_t dataHash);
    inline uint32_t getStencilStage() const { return this->_stencilStage; }
    void setStencilStage(uint32_t stencilStage);
    inline bool getIsMeshBuffer() const { return this->_isMeshBuffer; }
    void setIsMeshBuffer(bool isMeshBuffer);
    inline Material* getMaterial() const { return this->_material; }
    void setMaterial(Material* material);
    inline gfx::Texture* getTexture() const { return this->_texture; }
    void setTexture(gfx::Texture* texture);
    inline uint32_t getTextureHash() const { return this->_textureHash; }
    void setTextureHash(uint32_t textureHash);
    inline gfx::Sampler* getSampler() const { return this->_sampler; }
    void setSampler(gfx::Sampler* sampler);
    inline uint32_t getBlendHash() const { return this->_blendHash; }
    void setBlendHash(uint32_t blendHash);
    inline scene::Model* getModel() const { return this->_model; }
    void setModel(scene::Model* model);

    void setRender2dBufferToNative(uint8_t* buffer, uint8_t stride, uint32_t size, uint8_t type);
    void syncSharedBufferToNative(uint32_t* buffer);

public:
    inline Batcher2d* getBatcher() const { return _batcher; }
    void setBatcher(Batcher2d* batcher);

    //inline bool getEnabled() const { return _drawInfoAttrLayout.enabledIndex != 0; }

    void parseAttrLayout();

    //ArrayBuffer::Ptr getAttrSharedBufferForJS() const;

    const ArrayBuffer& getAttrSharedBufferForJS() const;

public:
    inline Render2dLayout* getRender2dLayout(uint32_t dataOffset) {
        return reinterpret_cast<Render2dLayout*>(this->_sharedBuffer + dataOffset * sizeof(float_t));
    }

    inline uint8_t getStride() { return this->_stride; }
    inline uint32_t getSize() { return this->_size; }
    inline uint8_t getDrawType() { return this->_drawType; }

public: // for meshRenderData
    gfx::InputAssembler* requestIA(gfx::Device* device);
    void uploadBuffers();
    void resetMeshIA();


private:
    gfx::InputAssembler* _initIAInfo(gfx::Device* device);


private:
    Batcher2d* _batcher;

private:
    uint8_t* _sharedBuffer{nullptr};
    uint8_t _stride{0};
    uint32_t _size{0};

    DrawInfoAttrLayout _drawInfoAttrLayout{};
    se::Object* _seArrayBufferObject{nullptr};
    ArrayBuffer::Ptr _attrSharedBuffer{nullptr};

private:
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

private: // for merging batches
    uint32_t _dataHash{0};
    uint32_t _stencilStage{0};
    bool _isMeshBuffer{false};
    Material* _material{nullptr};
    gfx::Texture* _texture{nullptr};
    uint32_t _textureHash{0};
    gfx::Sampler* _sampler{nullptr};

    uint32_t _blendHash{0};

private: // for meshRenderData
    gfx::InputAssemblerInfo _iaInfo;
    ccstd::vector<gfx::Attribute> _attributes{
        gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
        gfx::Attribute{gfx::ATTR_NAME_TEX_COORD, gfx::Format::RG32F},
        gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA32F},
    };

    ccstd::vector<gfx::InputAssembler*> _iaPool{};
    uint32_t _nextFreeIAHandle{0};
    gfx::Buffer* vbGFXBuffer{nullptr};
    gfx::Buffer* ibGFXBuffer{nullptr};
};

} // namespace cc
