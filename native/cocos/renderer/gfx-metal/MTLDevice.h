/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#import "MTLConfig.h"
#import "gfx-base/GFXDevice.h"

namespace cc {
namespace gfx {

struct CCMTLGPUDeviceObject;

class CCMTLGPUStagingBufferPool;
class CCMTLSemaphore;
class CCMTLSwapchain;

class CCMTLDevice final : public Device {
public:
    static CCMTLDevice *getInstance();

    CCMTLDevice();
    ~CCMTLDevice();

    CCMTLDevice(const CCMTLDevice &) = delete;
    CCMTLDevice(CCMTLDevice &&)      = delete;
    CCMTLDevice &operator=(const CCMTLDevice &) = delete;
    CCMTLDevice &operator=(CCMTLDevice &&) = delete;

    using Device::copyBuffersToTexture;
    using Device::createBuffer;
    using Device::createCommandBuffer;
    using Device::createDescriptorSet;
    using Device::createDescriptorSetLayout;
    using Device::createFramebuffer;
    using Device::createInputAssembler;
    using Device::createPipelineLayout;
    using Device::createPipelineState;
    using Device::createQueryPool;
    using Device::createQueue;
    using Device::createRenderPass;
    using Device::createShader;
    using Device::createTexture;

    void acquire(Swapchain *const *swapchains, uint32_t count) override;
    void present() override;

    void onPresentCompleted();

    inline void *                     getMTLCommandQueue() const { return _mtlCommandQueue; }
    inline void *                     getMTLDevice() const { return _mtlDevice; }
    inline uint                       getMaximumSamplerUnits() const { return _maxSamplerUnits; }
    inline uint                       getMaximumColorRenderTargets() const { return _caps.maxColorRenderTargets; }
    inline uint                       getMaximumBufferBindingIndex() const { return _maxBufferBindingIndex; }
    inline bool                       isIndirectCommandBufferSupported() const { return _icbSuppored; }
    inline bool                       isIndirectDrawSupported() const { return _indirectDrawSupported; }
    inline CCMTLGPUStagingBufferPool *gpuStagingBufferPool() const { return _gpuStagingBufferPools[_currentFrameIndex]; }
    inline bool                       isSamplerDescriptorCompareFunctionSupported() const { return _isSamplerDescriptorCompareFunctionSupported; }
    inline uint                       currentFrameIndex() const { return _currentFrameIndex; }

    inline void registerSwapchain(CCMTLSwapchain *swapchain) { _swapchains.push_back(swapchain); }
    inline void unRegisterSwapchain(CCMTLSwapchain *swapchain) {
        auto iter = std::find(_swapchains.begin(), _swapchains.end(), swapchain);
        if (iter != _swapchains.end()) {
            _swapchains.erase(iter);
        }
    }

protected:
    static CCMTLDevice *_instance;

    friend class DeviceManager;

    bool                 doInit(const DeviceInfo &info) override;
    void                 doDestroy() override;
    CommandBuffer *      createCommandBuffer(const CommandBufferInfo &info, bool hasAgent) override;
    Queue *              createQueue() override;
    QueryPool *          createQueryPool() override;
    Buffer *             createBuffer() override;
    Texture *            createTexture() override;
    Shader *             createShader() override;
    InputAssembler *     createInputAssembler() override;
    RenderPass *         createRenderPass() override;
    Framebuffer *        createFramebuffer() override;
    DescriptorSet *      createDescriptorSet() override;
    DescriptorSetLayout *createDescriptorSetLayout() override;
    PipelineLayout *     createPipelineLayout() override;
    PipelineState *      createPipelineState() override;
    Sampler *            createSampler(const SamplerInfo &info) override;
    Swapchain *          createSwapchain() override;
    void                 copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) override;
    void                 copyTextureToBuffers(Texture *src, uint8_t *const *buffers, const BufferTextureCopy *region, uint count) override;
    void                 getQueryPoolResults(QueryPool *queryPool) override;

    void onMemoryWarning();

    void *                     _mtlCommandQueue                             = nullptr;
    void *                     _mtlDevice                                   = nullptr;
    void *                     _activeDrawable                              = nullptr;
    unsigned long              _mtlFeatureSet                               = 0;
    uint                       _maxSamplerUnits                             = 0;
    uint                       _maxBufferBindingIndex                       = 0;
    bool                       _icbSuppored                                 = false;
    bool                       _indirectDrawSupported                       = false;
    bool                       _isSamplerDescriptorCompareFunctionSupported = false;
    CCMTLGPUStagingBufferPool *_gpuStagingBufferPools[MAX_FRAMES_IN_FLIGHT] = {nullptr};
    uint                       _currentBufferPoolId                         = 0;
    uint                       _currentFrameIndex                           = 0;
    CCMTLSemaphore *           _inFlightSemaphore                           = nullptr;
    CC_UNUSED uint32_t         _memoryAlarmListenerId                       = 0;

    std::vector<CCMTLSwapchain *> _swapchains;

    CCMTLGPUDeviceObject *_gpuDeviceObj = nullptr;
};

} // namespace gfx
} // namespace cc
