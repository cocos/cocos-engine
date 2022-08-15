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

    void update(const emscripten::val &v, uint32_t size) {
        ccstd::vector<uint8_t> buffer = emscripten::convertJSArrayToNumberVector<uint8_t>(v);
        update(reinterpret_cast<const void *>(buffer.data()), size);
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
