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

class CCWGPUDevice final : public emscripten::wrapper<Device> {
public:
    EMSCRIPTEN_WRAPPER(CCWGPUDevice);

    static CCWGPUDevice *getInstance();

    CCWGPUDevice();
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
    bool hasFeature(ems::Feature::type feature) const {
        return Device::hasFeature(Feature(feature));
    };

    void initialize(const ems::DeviceInfo &info) {
        Device::initialize(static_cast<const DeviceInfo &>(info));
    }

    Swapchain *createSwapchain(const ems::SwapchainInfo &info) {
        return Device::createSwapchain(static_cast<const SwapchainInfo &>(info));
    }

    Framebuffer *createFramebuffer(const ems::FramebufferInfo &info) {
        return Device::createFramebuffer(static_cast<const FramebufferInfo &>(info));
    }

    Texture *createTexture(const ems::TextureInfo &info) {
        return Device::createTexture(static_cast<const TextureInfo &>(info));
    }

    Texture *createTexture(const ems::TextureViewInfo &info) {
        return Device::createTexture(static_cast<const TextureViewInfo &>(info));
    }

    Buffer *createBuffer(const ems::BufferInfo &info) {
        return Device::createBuffer(static_cast<const BufferInfo &>(info));
    }

    Buffer *createBuffer(const ems::BufferViewInfo &info) {
        return Device::createBuffer(static_cast<const BufferViewInfo &>(info));
    }

    DescriptorSet *createDescriptorSet(const ems::DescriptorSetInfo &info) {
        return Device::createDescriptorSet(static_cast<const DescriptorSetInfo &>(info));
    }

    DescriptorSetLayout *createDescriptorSetLayout(const ems::DescriptorSetLayoutInfo &info) {
        return Device::createDescriptorSetLayout(static_cast<const DescriptorSetLayoutInfo &>(info));
    }

    PipelineLayout *createPipelineLayout(const ems::PipelineLayoutInfo &info) {
        return Device::createPipelineLayout(static_cast<const PipelineLayoutInfo &>(info));
    }

    InputAssembler *createInputAssembler(const ems::InputAssemblerInfo &info) {
        return Device::createInputAssembler(static_cast<const InputAssemblerInfo &>(info));
    }

    PipelineState *createPipelineState(const ems::PipelineStateInfo &info) {
        return Device::createPipelineState(static_cast<const PipelineStateInfo &>(info));
    }

    CommandBuffer *createCommandBuffer(const ems::CommandBufferInfo &info) {
        return Device::createCommandBuffer(static_cast<const CommandBufferInfo &>(info));
    }

    RenderPass *createRenderPass(const ems::RenderPassInfo &info) {
        return Device::createRenderPass(static_cast<const RenderPassInfo &>(info));
    }

    emscripten::val copyTextureToBuffers(Texture *src, const BufferTextureCopyList &regions);

    Shader *createShader(const ShaderInfo &info);

    void copyBuffersToTexture(const emscripten::val &v, Texture *dst, emscripten::val regions);

    Sampler *getSampler(const ems::SamplerInfo &info) {
        return Device::getSampler(static_cast<const SamplerInfo &>(info));
    }

    void debug();

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

    CCWGPUDeviceObject *_gpuDeviceObj = nullptr;
    ccstd::vector<CCWGPUSwapchain *> _swapchains;
};

} // namespace gfx

} // namespace cc
