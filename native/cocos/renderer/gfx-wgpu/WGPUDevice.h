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

using namespace emscripten;

class CCWGPUDevice final : public wrapper<Device> {
public:
    EMSCRIPTEN_WRAPPER(CCWGPUDevice);

    static CCWGPUDevice *getInstance();

    ~CCWGPUDevice();

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
    Swapchain *createSwapchain(const SwapchainInfoInstance &info) {
        return Device::createSwapchain(static_cast<const SwapchainInfo &>(info));
    }

    Framebuffer *createFramebuffer(const FramebufferInfoInstance &info) {
        return Device::createFramebuffer(static_cast<const FramebufferInfo &>(info));
    }

    Texture *createTexture(const TextureInfoInstance &info) {
        return Device::createTexture(static_cast<const TextureInfo &>(info));
    }

    Texture *createTexture(const TextureViewInfoInstance &info) {
        return Device::createTexture(static_cast<const TextureViewInfo &>(info));
    }

    Buffer *createBuffer(const BufferInfoInstance &info) {
        return Device::createBuffer(static_cast<const BufferInfo &>(info));
    }

    Buffer *createBuffer(const BufferViewInfoInstance &info) {
        return Device::createBuffer(static_cast<const BufferViewInfo &>(info));
    }

    DescriptorSet *createDescriptorSet(const DescriptorSetInfoInstance &info) {
        return Device::createDescriptorSet(static_cast<const DescriptorSetInfo &>(info));
    }

    DescriptorSetLayout *createDescriptorSetLayout(const DescriptorSetLayoutInfoInstance &info) {
        return Device::createDescriptorSetLayout(static_cast<const DescriptorSetLayoutInfo &>(info));
    }

    InputAssembler *createInputAssembler(const InputAssemblerInfoInstance &info) {
        return Device::createInputAssembler(static_cast<const InputAssemblerInfo &>(info));
    }

    PipelineState *createPipelineState(const PipelineStateInfoInstance &info) {
        return Device::createPipelineState(static_cast<const PipelineStateInfo &>(info));
    }

    CommandBuffer *createCommandBuffer(const CommandBufferInfoInstance &info) {
        return Device::createCommandBuffer(static_cast<const CommandBufferInfo &>(info));
    }

    emscripten::val copyTextureToBuffers(Texture *src, const BufferTextureCopyList &regions);

    Shader *createShader(const SPVShaderInfoInstance &spvInfo);

    void copyBuffersToTexture(const emscripten::val &v, Texture *dst, const BufferTextureCopyList &regions) {
        uint32_t len = v["length"].as<unsigned>();
        ccstd::vector<ccstd::vector<uint8_t>> lifeProlonger(len);
        ccstd::vector<const uint8_t *> buffers;
        for (size_t i = 0; i < len; i++) {
            lifeProlonger[i] = EMSArraysToU8Vec(v, i);
            buffers.push_back(lifeProlonger[i].data());
        }

        return copyBuffersToTexture(buffers.data(), dst, regions.data(), regions.size());
    }

    void debug();

protected:
    static CCWGPUDevice *instance;

    CCWGPUDevice();

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

    CCWGPUDeviceObject *_gpuDeviceObj = nullptr;
    ccstd::vector<CCWGPUSwapchain *> _swapchains;
};

} // namespace gfx

} // namespace cc
