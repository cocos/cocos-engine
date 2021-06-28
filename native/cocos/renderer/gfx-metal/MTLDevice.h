/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "gfx-base/GFXDevice.h"
#include "MTLConfig.h"

namespace cc {
namespace gfx {

class CCMTLGPUStagingBufferPool;
class CCMTLSemaphore;

class CCMTLDevice final : public Device {
public:
    static CCMTLDevice *getInstance();

    CCMTLDevice();
    ~CCMTLDevice() override;

    CCMTLDevice(const CCMTLDevice &) = delete;
    CCMTLDevice(CCMTLDevice &&) = delete;
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
    using Device::createQueue;
    using Device::createRenderPass;
    using Device::createSampler;
    using Device::createShader;
    using Device::createTexture;
    using Device::createGlobalBarrier;
    using Device::createTextureBarrier;

    void resize(uint width, uint height) override;
    void acquire() override;
    void present() override;

    void onPresentCompleted();
    void* getCurrentDrawable();
    void disposeCurrentDrawable();
    uint preferredPixelFormat();

    inline void *getMTLCommandQueue() const { return _mtlCommandQueue; }
    inline void *getMTLLayer() const { return _mtlLayer; }
    inline void *getMTLDevice() const { return _mtlDevice; }
    inline uint getMaximumSamplerUnits() const { return _maxSamplerUnits; }
    inline uint getMaximumColorRenderTargets() const { return _caps.maxColorRenderTargets; }
    inline uint getMaximumBufferBindingIndex() const { return _maxBufferBindingIndex; }
    inline bool isIndirectCommandBufferSupported() const { return _icbSuppored; }
    inline bool isIndirectDrawSupported() const { return _indirectDrawSupported; }
    inline CCMTLGPUStagingBufferPool *gpuStagingBufferPool() const { return _gpuStagingBufferPools[_currentFrameIndex]; }
    inline bool isSamplerDescriptorCompareFunctionSupported() const { return _isSamplerDescriptorCompareFunctionSupported; }
    inline uint currentFrameIndex() const { return _currentFrameIndex; }
    inline void *getDSSTexture() const { return _dssTex; }

protected:
    static CCMTLDevice * _instance;

    friend class DeviceManager;

    bool doInit(const DeviceInfo &info) override;
    void doDestroy() override;
    CommandBuffer *createCommandBuffer(const CommandBufferInfo &info, bool hasAgent) override;
    Queue *createQueue() override;
    Buffer *createBuffer() override;
    Texture *createTexture() override;
    Sampler *createSampler() override;
    Shader *createShader() override;
    InputAssembler *createInputAssembler() override;
    RenderPass *createRenderPass() override;
    Framebuffer *createFramebuffer() override;
    DescriptorSet *createDescriptorSet() override;
    DescriptorSetLayout *createDescriptorSetLayout() override;
    PipelineLayout *createPipelineLayout() override;
    PipelineState *createPipelineState() override;
    GlobalBarrier *createGlobalBarrier() override;
    TextureBarrier *createTextureBarrier() override;
    void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) override;

    void onMemoryWarning();

    void *_autoreleasePool = nullptr;
    void *_mtlCommandQueue = nullptr;
    void *_mtlDevice = nullptr;
    void *_mtlLayer = nullptr;
    void *_dssTex = nullptr;
    void *_activeDrawable = nullptr;
    unsigned long _mtlFeatureSet = 0;
    uint _maxSamplerUnits = 0;
    uint _maxBufferBindingIndex = 0;
    bool _icbSuppored = false;
    bool _indirectDrawSupported = false;
    bool _isSamplerDescriptorCompareFunctionSupported = false;
    CCMTLGPUStagingBufferPool *_gpuStagingBufferPools[MAX_FRAMES_IN_FLIGHT] = {nullptr};
    uint _currentBufferPoolId = 0;
    uint _currentFrameIndex = 0;
    CCMTLSemaphore *_inFlightSemaphore = nullptr;
    CC_UNUSED uint32_t _memoryAlarmListenerId = 0;
};

} // namespace gfx
} // namespace cc
