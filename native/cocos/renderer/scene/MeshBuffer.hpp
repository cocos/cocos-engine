/****************************************************************************
 LICENSING AGREEMENT
 
 Xiamen Yaji Software Co., Ltd., (the “Licensor”) grants the user (the “Licensee”) non-exclusive and non-transferable rights to use the software according to the following conditions:
 a.  The Licensee shall pay royalties to the Licensor, and the amount of those royalties and the payment method are subject to separate negotiations between the parties.
 b.  The software is licensed for use rather than sold, and the Licensor reserves all rights over the software that are not expressly granted (whether by implication, reservation or prohibition).
 c.  The open source codes contained in the software are subject to the MIT Open Source Licensing Agreement (see the attached for the details);
 d.  The Licensee acknowledges and consents to the possibility that errors may occur during the operation of the software for one or more technical reasons, and the Licensee shall take precautions and prepare remedies for such events. In such circumstance, the Licensor shall provide software patches or updates according to the agreement between the two parties. The Licensor will not assume any liability beyond the explicit wording of this Licensing Agreement.
 e.  Where the Licensor must assume liability for the software according to relevant laws, the Licensor’s entire liability is limited to the annual royalty payable by the Licensee.
 f.  The Licensor owns the portions listed in the root directory and subdirectory (if any) in the software and enjoys the intellectual property rights over those portions. As for the portions owned by the Licensor, the Licensee shall not:
 - i. Bypass or avoid any relevant technical protection measures in the products or services;
 - ii. Release the source codes to any other parties;
 - iii. Disassemble, decompile, decipher, attack, emulate, exploit or reverse-engineer these portion of code;
 - iv. Apply it to any third-party products or services without Licensor’s permission;
 - v. Publish, copy, rent, lease, sell, export, import, distribute or lend any products containing these portions of code;
 - vi. Allow others to use any services relevant to the technology of these codes;
 - vii. Conduct any other act beyond the scope of this Licensing Agreement.
 g.  This Licensing Agreement terminates immediately if the Licensee breaches this Agreement. The Licensor may claim compensation from the Licensee where the Licensee’s breach causes any damage to the Licensor.
 h.  The laws of the People's Republic of China apply to this Licensing Agreement.
 i.  This Agreement is made in both Chinese and English, and the Chinese version shall prevail the event of conflict.
 ****************************************************************************/

#pragma once

#include <stdint.h>

#include "../Macro.h"
#include "../gfx/VertexFormat.h"
#include "../gfx/VertexBuffer.h"
#include "../gfx/IndexBuffer.h"
#include "base/CCVector.h"

RENDERER_BEGIN

class ModelBatcher;

/**
 * @addtogroup scene
 * @{
 */

/**
 *  @brief The buffer which stores mesh render datas, including the vertices data and the indices data.
 *  It can be used as a global buffer shared by multiple render handles and eventually shared by Models
 */
class MeshBuffer
{
public:
    /**
     *  @brief It describes a range of buffer in the global buffer, it contains result when you request the buffer.
     */
    struct OffsetInfo
    {
        /** bytes count of the requested buffer */
        uint32_t vByte;
        /** offset in index buffer */
        uint32_t index;
        /** offset in vertex buffer */
        uint32_t vertex;
    };
    
    /**
     *  @brief Constructor
     *  @param[in] batcher The ModelBatcher which creates the current buffer
     *  @param[in] fmt The vertex format of vertex data
     */
    MeshBuffer(ModelBatcher* batcher, VertexFormat* fmt);
    /**
     *  @brief Destructor
     */
    ~MeshBuffer();
    
    /**
     *  @brief Requests a range of buffer for the given count of vertices and indices
     *  @param[in] vertexCount Requested count of vertices
     *  @param[in] indexCount Requested count of indices
     *  @param[out] offset The result indicates the allocated buffer range
     */
    bool request(uint32_t vertexCount, uint32_t indexCount, OffsetInfo* offset);
    bool requestStatic(uint32_t vertexCount, uint32_t indexCount, OffsetInfo* offset);
    
    /**
     *  @brief Upload data to GPU memory
     */
    void uploadData();
    /**
     *  @brief Reset all states.
     */
    void reset();
    /**
     *  @brief Destroy the mesh buffer.
     */
    void destroy();
    
    /**
     *  @brief Gets the current byte offset which indicates the start of empty range
     *  @return Byte offset.
     */
    uint32_t getByteOffset() const { return _byteOffset; };
    /**
     *  @brief Gets the current vertex start offset since last time updateOffset is invoked
     *  @return Vertex start.
     */
    uint32_t getVertexStart() const { return _vertexStart; };
    /**
     *  @brief Gets the current vertex offset, which should equals to total allocated vertex count.
     *  @return Vertex offset.
     */
    uint32_t getVertexOffset() const { return _vertexOffset; };
    /**
     *  @brief Gets the current index start offset since last time updateOffset is invoked
     *  @return Index start.
     */
    uint32_t getIndexStart() const { return _indexStart; };
    /**
     *  @brief Gets the current index offset, which should equals to total allocated index count.
     *  @return Index offset.
     */
    uint32_t getIndexOffset() const { return _indexOffset; };
    
    /**
     *  @brief Update the current allocated offsets to the start offsets.
     */
    void updateOffset()
    {
        _byteStart = _byteOffset;
        _vertexStart = _vertexOffset;
        _indexStart = _indexOffset;
    };
    
    /**
     *  @brief Gets the vertex buffer.
     */
    VertexBuffer* getVertexBuffer() const { return _vb; };
    /**
     *  @brief Gets the index buffer.
     */
    IndexBuffer* getIndexBuffer() const { return _ib; };
    
    /**
     *  @brief The vertex data storage in memory
     */
    std::vector<float> vData;
    /**
     *  @brief The index data storage in memory
     */
    std::vector<uint16_t> iData;
    /**
     *  @brief Vertex format of the vertex data.
     */
    VertexFormat* _vertexFmt;
    
    static const int INIT_VERTEX_COUNT = 256;
    static const uint8_t VDATA_BYTE = sizeof(float);
    static const uint8_t IDATA_BYTE = sizeof(uint16_t);
protected:
    void reallocBuffers();
    
private:
    uint32_t _byteStart;
    uint32_t _byteOffset;
    uint32_t _indexStart;
    uint32_t _indexOffset;
    uint32_t _vertexStart;
    uint32_t _vertexOffset;
    uint32_t _bytesPerVertex;
    uint32_t _vDataCount;
    uint32_t _iDataCount;
    bool _dirty;
    
    ModelBatcher* _batcher;
    std::size_t _vbPos;
    cocos2d::Vector<VertexBuffer*> _vbArr;
    VertexBuffer* _vb;
    IndexBuffer* _ib;
};

// end of scene group
/// @}

RENDERER_END
