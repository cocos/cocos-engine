#pragma once
#include <cocos/base/TypeDef.h>
#include <renderer/gfx-base/GFXDef-common.h>
#include <vector>

namespace cc {
struct MeshBufferLayout {
    uint32_t byteOffset;
    uint32_t vertexOffset;
    uint32_t indexOffset;
    uint32_t dirtyMark;
    uint32_t floatsPerVertex;
};

class UIMeshBuffer final {
public:
    UIMeshBuffer() = default;
    ~UIMeshBuffer();

    inline float_t* getVData() { return _vData; }
    void setVData(float_t* vData);
    inline uint16_t* getIData() { return _iData; }
    void setIData(uint16_t* iData);

public:
    void initialize(gfx::Device* device, ccstd::vector<gfx::Attribute*>&& attrs, uint32_t vFloatCount, uint32_t iCount);
    void reset();
    void destroy();
    void setDirty();
    void uploadBuffers();

    void syncSharedBufferToNative(uint32_t* buffer);

public:
    void resetIA();
    void recycleIA(gfx::InputAssembler* ia);
    void parseLayout();

    gfx::InputAssembler* requireFreeIA(gfx::Device* device);
    gfx::InputAssembler* createNewIA(gfx::Device* device);

    inline uint32_t getByteOffset() { return _meshBufferLayout->byteOffset; }
    void setByteOffset(uint32_t byteOffset);
    inline uint32_t getVertexOffset() { return _meshBufferLayout->vertexOffset; }
    void setVertexOffset(uint32_t vertexOffset);
    inline uint32_t getIndexOffset() const { return _meshBufferLayout->indexOffset; }
    void setIndexOffset(uint32_t indexOffset);
    inline bool getDirty() { return _meshBufferLayout->dirtyMark != 0; }
    void setDirty(bool dirty) const;
    inline uint32_t getFloatsPerVertex() { return _meshBufferLayout->floatsPerVertex; }
    void setFloatsPerVertex(uint32_t floatsPerVertex);

private:
    float_t* _vData{nullptr};
    uint16_t* _iData{nullptr};

    MeshBufferLayout* _meshBufferLayout{nullptr};
    uint32_t* _sharedBuffer{nullptr};
    bool _dirty{false};
    uint32_t _vertexFormatBytes{0};
    uint32_t _initVDataCount{0};
    uint32_t _initIDataCount{0};
    ccstd::vector<gfx::Attribute> _attributes{
        gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
        gfx::Attribute{gfx::ATTR_NAME_TEX_COORD, gfx::Format::RG32F},
        gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA32F},
    };

    ccstd::vector<gfx::InputAssembler*> _iaPool{};
    gfx::InputAssemblerInfo _iaInfo;
    uint32_t _nextFreeIAHandle{0};
    bool _needDeleteVData{false};
};
} // namespace cc
