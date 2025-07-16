/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #include <windows.h>
#endif
#ifdef CC_WGPU_WASM
    #include "WGPUDef.h"
#endif
#include "WGPUObject.h"
#include "base/std/container/vector.h"
#include "gfx-base/GFXDevice.h"

namespace cc {
namespace gfx {

struct CCWGPUDeviceObject;

class CCWGPUSwapchain;
class CCWGPUTexture;
class WGPUGeneralBarrier;

class CCWGPUDevice final : public Device {
public:
    static CCWGPUDevice *getInstance();

    CCWGPUDevice();
    ~CCWGPUDevice();

    void acquire(const std::vector<Swapchain *> &swapchains) {
        return acquire(swapchains.data(), swapchains.size());
    }
    void acquire(Swapchain *const *swapchains, uint32_t count) override;
    void present() override;

    inline CCWGPUDeviceObject *gpuDeviceObject() { return _gpuDeviceObj; }
    inline uint8_t getCurrentFrameIndex() const { return _currentFrameIndex; }
    inline CCWGPURecycleBin *recycleBin() { return &_recycleBin[_currentFrameIndex]; }
    inline void registerSwapchain(CCWGPUSwapchain *swapchain) { _swapchains.push_back(swapchain); }
    inline void unRegisterSwapchain(CCWGPUSwapchain *swapchain) {
        auto iter = std::find(_swapchains.begin(), _swapchains.end(), swapchain);
        if (iter != _swapchains.end()) {
            _swapchains.erase(iter);
        }
    }

    template <typename T>
    void moveToTrash(T t);

    // CCWGPUStagingBuffer *stagingBuffer() {
    //     return _stagingBuffers[_currentFrameIndex];
    // }

    void debug();

    using Device::createBuffer;
    using Device::createDescriptorSet;
    using Device::createDescriptorSetLayout;
    using Device::createFramebuffer;
    using Device::createInputAssembler;
    using Device::createPipelineLayout;
    using Device::createPipelineState;
    using Device::createRenderPass;
    using Device::createShader;
    using Device::createSwapchain;
    using Device::createTexture;
    using Device::getGeneralBarrier;
    using Device::getSampler;
    using Device::initialize;

    void frameSync() override {};

    Shader *createShader(const ShaderInfo &, const std::vector<std::vector<uint32_t>> &);

    void copyBuffersToTexture(const std::vector<std::vector<uint8_t>> &buffers, Texture *dst, const std::vector<BufferTextureCopy> &regions) {
        std::vector<const uint8_t *> datas(buffers.size());
        for (size_t i = 0; i < buffers.size(); ++i) {
            datas[i] = buffers[i].data();
        }
        return copyBuffersToTexture(datas.data(), dst, regions.data(), regions.size());
    }
    uint32_t getGFXAPI() const {
        return static_cast<uint32_t>(Device::getGfxAPI());
    };
    uint32_t hasFeature(uint32_t feature) {
        return static_cast<uint32_t>(Device::hasFeature(Feature{feature}));
    };
    inline MemoryStatus getMemStatus() const {
        return _memoryStatus;
    }
    uint32_t getFormatFeatures(uint32_t format) {
        return static_cast<uint32_t>(Device::getFormatFeatures(Format{format}));
    };

    // ems export override
    EXPORT_EMS(
        void copyTextureToBuffers(Texture *src, const emscripten::val &buffers, const emscripten::val &regions);
        emscripten::val copyTextureToBuffers(Texture * src, const BufferTextureCopyList &regions);
        void copyBuffersToTexture(const emscripten::val &v, Texture *dst, const std::vector<BufferTextureCopy> &regions);)

    void initFeatures();
    void initLimits();
    void initConfigs();

protected:
    static CCWGPUDevice *instance;

    bool doInit(const DeviceInfo &info) override;
    void doDestroy() override;
    CommandBuffer *createCommandBuffer(const CommandBufferInfo &info, bool hasAgent) override;
    Queue *createQueue() override;
    Buffer *createBuffer() override;
    Texture *createTexture() override;
    Shader *createShader() override;
    InputAssembler *createInputAssembler() override;
    RenderPass *createRenderPass() override;
    Framebuffer *createFramebuffer() override;
    DescriptorSet *createDescriptorSet() override;
    DescriptorSetLayout *createDescriptorSetLayout() override;
    PipelineLayout *createPipelineLayout() override;
    PipelineState *createPipelineState() override;
    Swapchain *createSwapchain() override;
    QueryPool *createQueryPool() override;
    Sampler *createSampler(const SamplerInfo &info) override;

    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint32_t count) override;
    void copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint32_t count) override;
    void getQueryPoolResults(QueryPool *queryPool) override;

    uint8_t _currentFrameIndex{0};
    CCWGPUDeviceObject *_gpuDeviceObj = nullptr;
    ccstd::vector<CCWGPUSwapchain *> _swapchains;

    CCWGPURecycleBin _recycleBin[CC_WGPU_MAX_FRAME_COUNT];
};

template <>
inline void CCWGPUDevice::moveToTrash<WGPUBuffer>(WGPUBuffer t) {
    _recycleBin[_currentFrameIndex].bufferBin.collect(t);
}

template <>
inline void CCWGPUDevice::moveToTrash<WGPUTexture>(WGPUTexture t) {
    _recycleBin[_currentFrameIndex].textureBin.collect(t);
}

template <>
inline void CCWGPUDevice::moveToTrash<WGPUQuerySet>(WGPUQuerySet t) {
    _recycleBin[_currentFrameIndex].queryBin.collect(t);
}

} // namespace gfx

} // namespace cc
