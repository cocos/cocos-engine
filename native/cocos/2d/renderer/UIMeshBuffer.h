#pragma once
#include <cocos/renderer/gfx-base/GFXDevice.h>
#include <cocos/base/TypeDef.h>
#include <vector>

namespace cc {
struct MeshBufferLayout {
    index_t byteOffset;
    index_t vertexOffset;
    index_t indexOffset;
};

class UIMeshBuffer {
public:
    UIMeshBuffer(/* args */);
    ~UIMeshBuffer();

    inline float_t* getVData() { return this->_vData; }
    void setVData(float_t* vData);
    inline uint16_t* getIData() { return this->_iData; }
    void setIData(uint16_t* iData);

    void initialize(gfx::Device* device, index_t vFloatCount, index_t iCount);
    void reset();
    void destroy();
    void setDirty();
    void recycleIA();
    void uploadBuffers();

public:
    void syncSharedBufferToNative(index_t* buffer);
    void parseLayout();

private:
    float_t* _vData{nullptr};
    uint16_t* _iData{nullptr};

    MeshBufferLayout* _meshBufferLayout{nullptr};
    index_t* _sharedBuffer{nullptr};
};
}

