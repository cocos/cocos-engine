#pragma once
#include <cocos/base/TypeDef.h>
#include <vector>
#include <math/Vec2.h>
#include <math/Vec3.h>
#include <math/Vec4.h>
#include <math/Color.h>

namespace cc {
struct Render2dLayout {
    cc::Vec3 position;
    cc::Vec2 uv;
    cc::Vec4 color; // use Vec4 instead of Color because of bytes alignment
};

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

    //inline std::vector<AdvanceRenderData*> getDataArr() { return this->_dataArr; }
    //void setAdvanceRenderDataArr(std::vector<AdvanceRenderData*>&& arr);

    void setRender2dBufferToNative(uint8_t* buffer, uint8_t stride, uint32_t size);
    void setRender2dBufferToNativeNew(float_t* buffer);

    // for debug
    void ItIsDebugFuncInRenderEntity();

private:
    // deprecated
    //std::vector<AdvanceRenderData*> _dataArr{};

    // use this
    std::vector< Render2dLayout*> _render2dLayoutArr{};

    // updateWorld 数据计算用到
    index_t _bufferId{0};
    index_t _vertexOffset{0};
    index_t _indexOffset{0};

    float_t* _vbBuffer{nullptr};
    float_t* _vDataBuffer{nullptr};
    uint16_t* _iDataBuffer{nullptr};
};
}
