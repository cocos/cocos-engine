#pragma once
#include <cocos/base/TypeDef.h>
#include <vector>
#include <renderer/gfx-base/GFXDef-common.h>

namespace cc {
struct MeshBufferLayout {
    index_t byteOffset;
    index_t vertexOffset;
    index_t indexOffset;
    index_t dirtyMark;
    index_t floatsPerVertex;
};

class UIMeshBuffer {
public:
    UIMeshBuffer();
    ~UIMeshBuffer();

    inline float_t* getVData() { return _vData; }
    void setVData(float_t* vData);
    inline uint16_t* getIData() { return _iData; }
    void setIData(uint16_t* iData);

public:
    void initialize(gfx::Device* device, ccstd::vector<gfx::Attribute*>&& attrs, index_t vFloatCount, index_t iCount);
    void reset();
    void resetIA();
    void destroy();
    void setDirty();
    void recycleIA(gfx::InputAssembler* ia);
    void uploadBuffers();

    gfx::InputAssembler* requireFreeIA(gfx::Device* device);
    gfx::InputAssembler* createNewIA(gfx::Device* device);

public:
    void syncSharedBufferToNative(index_t* buffer);
    void parseLayout();

    inline index_t getByteOffset() { return _meshBufferLayout->byteOffset; }
    void setByteOffset(index_t byteOffset);
    inline index_t getVertexOffset() { return _meshBufferLayout->vertexOffset; }
    void setVertexOffset(index_t vertexOffset);
    inline index_t getIndexOffset() const { return _meshBufferLayout->indexOffset; }
    void setIndexOffset(index_t indexOffset);
    inline bool getDirty() { return _meshBufferLayout->dirtyMark != 0; }
    void setDirty(bool dirty) const;
    inline index_t getFloatsPerVertex() { return _meshBufferLayout->floatsPerVertex; }
    void setFloatsPerVertex(index_t floatsPerVertex);

private:
    float_t* _vData{nullptr};
    uint16_t* _iData{nullptr};

    MeshBufferLayout* _meshBufferLayout{nullptr};
    index_t* _sharedBuffer{nullptr};
    bool _dirty{false};
    uint32_t _vertexFormatBytes{0};
    //uint32_t _floatsPerVertex{0};//from ts, put it into layout
    index_t _initVDataCount{0};
    index_t _initIDataCount{0};
    ccstd::vector<gfx::Attribute> _attributes{
        gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
        gfx::Attribute{gfx::ATTR_NAME_TEX_COORD, gfx::Format::RG32F},
        gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA32F},
    };

    ccstd::vector<gfx::InputAssembler*> _iaPool{};
    gfx::InputAssemblerInfo _iaInfo;
    index_t _nextFreeIAHandle{0};
    bool _needDeleteVData{false};
};
} // namespace cc
