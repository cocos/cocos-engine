/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#pragma once

#include <functional>
#include "../Macro.h"
#include "../Types.h"
#include "VertexFormat.h"
#include "GraphicsHandle.h"

RENDERER_BEGIN

/**
 * @addtogroup gfx
 * @{
 */

class DeviceGraphics;

/**
 * VertexBuffer manages the GL vertex attributes buffer.
 * It creates, updates and destoies the GL vertex buffer.
 */
class VertexBuffer final : public GraphicsHandle
{
public:
    /**
     * Creates a vertex buffer object
     * @param[in] device DeviceGraphics pointer
     * @param[in] format Specifies the vertex attributes layout
     * @param[in] usage The usage pattern
     * @param[in] data Data pointer, could be nullptr, then nothing is updated to the buffer.
     * @param[in] dataByteLength Data's byte length.
     * @param[in] numVertices Count of vertices.
     */
    RENDERER_DEFINE_CREATE_METHOD_6(VertexBuffer, init,  DeviceGraphics*, VertexFormat*, Usage, const void*, size_t, uint32_t)

    VertexBuffer();
    virtual ~VertexBuffer();

    /**
     * Initializes a vertex buffer object
     * @param[in] device DeviceGraphics pointer
     * @param[in] format Specifies the vertex attributes layout
     * @param[in] usage The usage pattern
     * @param[in] data Data pointer, could be nullptr, then nothing is updated to the buffer.
     * @param[in] dataByteLength Data's byte length.
     * @param[in] numVertices Count of vertices.
     */
    bool init(DeviceGraphics* device, VertexFormat* format, Usage usage, const void* data, size_t dataByteLength, uint32_t numVertices);
    /**
     * Update data to the GL vertex buffer
     * @param[in] offset Destination offset for filling buffer data.
     * @param[in] data Data to be updated.
     * @param[in] dataByteLength Data byte length to be updated.
     */
    void update(uint32_t offset, const void* data, size_t dataByteLength);

    /**
     * Gets the count of vertices
     */
    inline uint32_t getCount() const { return _numVertices; }
    /**
     * Sets the count of vertices
     */
    inline void setCount(uint32_t numVertices) { _numVertices = numVertices; }

    /**
     * Gets the attributes layout and format of vertices.
     */
    inline const VertexFormat& getFormat() const { return *_format; }
//    inline void setFormat(VertexFormat&& format) { _format = std::move(format); }
    /**
     * Sets the attributes layout and format of vertices.
     */
    void setFormat(VertexFormat* format);

    /**
     * Gets usage pattern of the vertex buffer
     */
    inline Usage getUsage() const { return _usage; }
    /**
     * Sets usage pattern of the vertex buffer
     */
    inline void setUsage(Usage usage) { _usage = usage; }

    /**
     * Gets byte size of the vertex buffer
     */
    inline uint32_t getBytes() const { return _bytes; }
    /**
     * Sets byte size of the vertex buffer
     */
    inline void setBytes(uint32_t bytes) { _bytes = bytes; }

    using FetchDataCallback = std::function<uint8_t*(size_t*)>;
    void setFetchDataCallback(const FetchDataCallback& cb) { _fetchDataCallback = cb; }
    uint8_t* invokeFetchDataCallback(size_t* bytes) {
        if (_fetchDataCallback == nullptr)
        {
            *bytes = 0;
            return nullptr;
        }
        return _fetchDataCallback(bytes);
    }

    /**
     * Destroies the vertex buffer
     */
    void destroy();

private:
    DeviceGraphics* _device = nullptr;
    VertexFormat* _format = nullptr;
    Usage _usage;
    uint32_t _numVertices;
    uint32_t _bytes;

    FetchDataCallback _fetchDataCallback;

    CC_DISALLOW_COPY_ASSIGN_AND_MOVE(VertexBuffer)
};

// end of gfx group
/// @}

RENDERER_END
