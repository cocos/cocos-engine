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

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #include <windows.h>
#endif

#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "WGPUDef.h"
#include "base/std/container/vector.h"
#include "gfx-base/GFXDevice.h"

#define EMSArraysToU8Vec(v, i) (emscripten::convertJSArrayToNumberVector<uint8_t>(v[i]))
namespace cc {
namespace gfx {

struct CCWGPUDeviceObject;

class CCWGPUSwapchain;
class CCWGPUTexture;
class WGPUGeneralBarrier;

class CCWGPUDevice final : public emscripten::wrapper<Device> {
public:
    EMSCRIPTEN_WRAPPER(CCWGPUDevice);

    static CCWGPUDevice *getInstance();

    CCWGPUDevice();
    ~CCWGPUDevice();

    void acquire(const emscripten::val &swapchains);
    void acquire(Swapchain *const *swapchains, uint32_t count) override;
    void present() override;

    inline CCWGPUDeviceObject *gpuDeviceObject() { return _gpuDeviceObj; }

    inline void registerSwapchain(CCWGPUSwapchain *swapchain) { _swapchains.push_back(swapchain); }
    inline void unRegisterSwapchain(CCWGPUSwapchain *swapchain) {
        auto iter = std::find(_swapchains.begin(), _swapchains.end(), swapchain);
        if (iter != _swapchains.end()) {
            _swapchains.erase(iter);
        }
    }

    // ems export override

    void initialize(const emscripten::val &info);

    Swapchain *createSwapchain(const emscripten::val &info);

    Framebuffer *createFramebuffer(const emscripten::val &info);

    Texture *createTexture(const emscripten::val &info);

    using Device::createTexture;

    Buffer *createBuffer(const emscripten::val &info);

    DescriptorSet *createDescriptorSet(const emscripten::val &info);

    DescriptorSetLayout *createDescriptorSetLayout(const emscripten::val &info);

    PipelineLayout *createPipelineLayout(const emscripten::val &info);

    InputAssembler *createInputAssembler(const emscripten::val &info);

    PipelineState *createPipelineState(const emscripten::val &info);

    RenderPass *createRenderPass(const emscripten::val &info);

    emscripten::val copyTextureToBuffers(Texture *src, const BufferTextureCopyList &regions);

    WGPUGeneralBarrier *getGeneralBarrier(const emscripten::val &info);

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
    using Device::getGeneralBarrier;
    using Device::getSampler;
    using Device::initialize;

    Shader *createShader(const emscripten::val &info);

    void copyBuffersToTexture(const emscripten::val &v, Texture *dst, const emscripten::val &regions);

    Sampler *getSampler(const emscripten::val &info);

    inline MemoryStatus getMemStatus() const { return _memoryStatus; }

    void debug();

    uint32_t getFormatFeatures(uint32_t format) {
        return static_cast<uint32_t>(Device::getFormatFeatures(Format{format}));
    }

    uint32_t getGFXAPI() const {
        return static_cast<uint32_t>(Device::getGfxAPI());
    }

    uint32_t hasFeature(uint32_t feature) {
        return static_cast<uint32_t>(Device::hasFeature(Feature{feature}));
    };

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

    void initFormatFeatures();

    CCWGPUDeviceObject *_gpuDeviceObj = nullptr;
    ccstd::vector<CCWGPUSwapchain *> _swapchains;
};

} // namespace gfx

} // namespace cc
