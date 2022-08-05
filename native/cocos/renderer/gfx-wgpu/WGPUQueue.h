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

#ifdef CC_WGPU_WASM
    #include "WGPUDef.h"
#endif
#include "gfx-base/GFXQueue.h"

namespace cc {
namespace gfx {

struct CCWGPUQueueObject;

class CCWGPUQueue final : public Queue {
public:
    CCWGPUQueue();
    ~CCWGPUQueue() = default;

    void submit(CommandBuffer *const *cmdBuffs, uint32_t count) override;
    inline CCWGPUQueueObject *gpuQueueObject() { return _gpuQueueObject; }
    inline uint32_t getNumDrawCalls() const { return _numDrawCalls; }
    inline uint32_t getNumInstances() const { return _numInstances; }
    inline uint32_t getNumTris() const { return _numTriangles; }

    inline void resetStatus() { _numDrawCalls = _numInstances = _numTriangles = 0; }

    EXPORT_EMS(
        void submit(const emscripten::val &cmdBuffs);)
protected:
    void doInit(const QueueInfo &info) override;
    void doDestroy() override;

    CCWGPUQueueObject *_gpuQueueObject = nullptr;

    uint32_t _numDrawCalls = 0;
    uint32_t _numInstances = 0;
    uint32_t _numTriangles = 0;
};

} // namespace gfx
} // namespace cc
