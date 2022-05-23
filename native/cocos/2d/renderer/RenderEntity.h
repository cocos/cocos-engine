#pragma once
#include <cocos/base/TypeDef.h>

namespace cc {
class RenderEntity {
public:
    RenderEntity();
    explicit RenderEntity(const index_t bufferId, const index_t vertexOffset, const index_t indexOffset);
    ~RenderEntity();

    inline index_t getBufferId() const { return this->_bufferId; }
    void setBufferId(index_t bufferId);
    inline index_t getVertexOffset() const { return this->_vertexOffset; }
    void setVertexOffset(index_t vertexOffset);
    inline index_t getIndexOffset() const { return this->_indexOffset; }
    void setIndexOffset(index_t indexOffset);

    inline float_t* getVbBuffer() const { return this->_vbBuffer; }
    void setVbBuffer(float_t* vbBuffer);
    inline float_t* getVDataBuffer() const { return this->_vDataBuffer; }
    void setVDataBuffer(float_t* vDataBuffer);
    inline uint16_t* getIDataBuffer() const { return this->_iDataBuffer; }
    void setIDataBuffer(uint16_t* iDataBuffer);

private:
    index_t _bufferId{0};
    index_t _vertexOffset{0};
    index_t _indexOffset{0};

    float_t* _vbBuffer{nullptr};
    float_t* _vDataBuffer{nullptr};
    uint16_t* _iDataBuffer{nullptr};
};
}
