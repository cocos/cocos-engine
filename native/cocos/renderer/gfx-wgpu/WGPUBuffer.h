/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "base/std/container/vector.h"
#include "gfx-base/GFXBuffer.h"

namespace cc {
namespace gfx {

struct CCWGPUBufferObject;

class CCWGPUBuffer final : public emscripten::wrapper<Buffer> {
public:
    EMSCRIPTEN_WRAPPER(CCWGPUBuffer);
    CCWGPUBuffer();
    ~CCWGPUBuffer() = default;

    void update(const void *buffer, uint32_t size) override;

    inline CCWGPUBufferObject *gpuBufferObject() const { return _gpuBufferObject; }

    static CCWGPUBuffer *defaultUniformBuffer();

    static CCWGPUBuffer *defaultStorageBuffer();

    inline uint32_t getOffset() const { return _offset; }

    template <typename T>
    void updateByType(const emscripten::val &v, uint32_t size, uint32_t len) {
        std::vector<T> rv;
        rv.resize(len);
        emscripten::val memoryView{emscripten::typed_memory_view(len, rv.data())};
        memoryView.call<void>("set", v);
        update(reinterpret_cast<const void *>(rv.data()), size);
        if (size == 576) {
            auto *data = reinterpret_cast<float *>(rv.data());
            printf("try float %f, %f, %f, %f, %f, %d, %d, %d, %d, %d, %d, %d, %d\n", data[0], data[1], data[2], data[3], data[4], rv.data()[0],
                   rv.data()[1], rv.data()[2], rv.data()[3], rv.data()[4], _stride, len, size);
        }
    }

    void update(const emscripten::val &v, uint32_t size, uint32_t stride) {
        auto length = size / stride;
        switch (stride) {
            case 1:
                updateByType<uint8_t>(v, size, length);
                break;
            case 2:
                updateByType<uint16_t>(v, size, length);
                break;
            case 4:
                updateByType<uint32_t>(v, size, length);
                break;
            case 8:
                updateByType<uint64_t>(v, size, length);
                break;
            default:
                while (1) {
                }
        }
    }

    void update(const emscripten::val &v) {
        const size_t l = v["byteLength"].as<size_t>();
        std::vector<uint8_t> rv;
        rv.resize(l);
        emscripten::val memoryView{emscripten::typed_memory_view(l, rv.data())};
        memoryView.call<void>("set", v);
        update(reinterpret_cast<const void *>(rv.data()), rv.size());
    }

    void update(const DrawInfoList &drawInfos);

    // used before unmap?
    void check();

    // stamp current resource handler
    void stamp();

    // resource handler changed?
    inline bool internalChanged() const { return _internalChanged; }

protected:
    void doInit(const BufferInfo &info) override;
    void doInit(const BufferViewInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t size, uint32_t count) override;

    CCWGPUBufferObject *_gpuBufferObject = nullptr;

    bool _internalChanged = false;
};

} // namespace gfx
} // namespace cc
