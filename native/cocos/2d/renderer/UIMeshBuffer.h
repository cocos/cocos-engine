#pragma once
#include <cocos/base/TypeDef.h>
#include <vector>
#include <renderer/gfx-base/GFXDef-common.h>

namespace cc {
struct MeshBufferLayout {
    index_t byteOffset;
    index_t vertexOffset;
    index_t indexOffset;
};

class UIMeshBuffer {
public:
    UIMeshBuffer();
    ~UIMeshBuffer();

    inline float* getVData() { return _vData; }
    void setVData(float* vData);
    inline uint16_t* getIData() { return _iData; }
    void setIData(uint16_t* iData);

    void initialize(gfx::Device* device, gfx::AttributeList* attrs, index_t vFloatCount, index_t iCount);

    void reset();
    void destroy();
    void setDirty();
    void recycleIA(gfx::InputAssembler* ia);
    void uploadBuffers();

    gfx::InputAssembler* requireFreeIA(gfx::Device* device);
    gfx::InputAssembler* createNewIA(gfx::Device* device);

public:
    void syncSharedBufferToNative(index_t* buffer);
    void parseLayout();

private:
    float* _vData{nullptr};
    uint16_t* _iData{nullptr};

    MeshBufferLayout* _meshBufferLayout{nullptr};
    index_t* _sharedBuffer{nullptr};
    bool _dirty{false};
    uint32_t _vertexFormatBytes{0};
    uint32_t _floatsPerVertex{0};
    index_t _initVDataCount{0};
    index_t _initIDataCount{0};
    gfx::AttributeList _attributes{};

    ccstd::vector<gfx::InputAssembler*> _iaPool{};
    gfx::InputAssemblerInfo _iaInfo;
    index_t _nextFreeIAHandle{0};
    bool _needDeleteVData{false};
};
} // namespace cc
