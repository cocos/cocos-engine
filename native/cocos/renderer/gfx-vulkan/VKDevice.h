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

#ifndef CC_GFXVULKAN_DEVICE_H_
#define CC_GFXVULKAN_DEVICE_H_

namespace cc {
namespace gfx {

class CCVKTexture;

class CCVKGPUDevice;
class CCVKGPUContext;
class CCVKGPUSwapchain;

class CCVKGPUBufferHub;
class CCVKGPUTransportHub;
class CCVKGPUDescriptorHub;
class CCVKGPUSemaphorePool;
class CCVKGPUBarrierManager;
class CCVKGPUDescriptorSetHub;

class CCVKGPUFencePool;
class CCVKGPURecycleBin;
class CCVKGPUStagingBufferPool;

class CC_VULKAN_API CCVKDevice final : public Device {
public:
    CCVKDevice();
    ~CCVKDevice();

    friend class CCVKContext;
    using Device::copyBuffersToTexture;
    using Device::createBuffer;
    using Device::createCommandBuffer;
    using Device::createDescriptorSet;
    using Device::createDescriptorSetLayout;
    using Device::createFramebuffer;
    using Device::createGlobalBarrier;
    using Device::createInputAssembler;
    using Device::createPipelineLayout;
    using Device::createPipelineState;
    using Device::createQueue;
    using Device::createRenderPass;
    using Device::createSampler;
    using Device::createShader;
    using Device::createTexture;
    using Device::createTextureBarrier;

    virtual bool   initialize(const DeviceInfo &info) override;
    virtual void   destroy() override;
    virtual void   resize(uint width, uint height) override;
    virtual void   acquire() override;
    virtual void   present() override;
    CC_INLINE bool checkExtension(const String &extension) const {
        return std::find_if(_extensions.begin(), _extensions.end(),
                            [extension](const char *device_extension) {
                                return std::strcmp(device_extension, extension.c_str()) == 0;
                            }) != _extensions.end();
    }

    CCVKGPUContext *gpuContext() const;
    CC_INLINE CCVKGPUDevice *gpuDevice() const { return _gpuDevice; }
    CC_INLINE CCVKGPUSwapchain *gpuSwapchain() { return _gpuSwapchain; }

    CC_INLINE CCVKGPUBufferHub *gpuBufferHub() { return _gpuBufferHub; }
    CC_INLINE CCVKGPUTransportHub *gpuTransportHub() { return _gpuTransportHub; }
    CC_INLINE CCVKGPUDescriptorHub *gpuDescriptorHub() { return _gpuDescriptorHub; }
    CC_INLINE CCVKGPUSemaphorePool *gpuSemaphorePool() { return _gpuSemaphorePool; }
    CC_INLINE CCVKGPUBarrierManager *gpuBarrierManager() { return _gpuBarrierManager; }
    CC_INLINE CCVKGPUDescriptorSetHub *gpuDescriptorSetHub() { return _gpuDescriptorSetHub; }

    CCVKGPUFencePool *        gpuFencePool();
    CCVKGPURecycleBin *       gpuRecycleBin();
    CCVKGPUStagingBufferPool *gpuStagingBufferPool();

private:
    virtual CommandBuffer *      doCreateCommandBuffer(const CommandBufferInfo &info, bool hasAgent) override;
    virtual Queue *              createQueue() override;
    virtual Buffer *             createBuffer() override;
    virtual Texture *            createTexture() override;
    virtual Sampler *            createSampler() override;
    virtual Shader *             createShader() override;
    virtual InputAssembler *     createInputAssembler() override;
    virtual RenderPass *         createRenderPass() override;
    virtual Framebuffer *        createFramebuffer() override;
    virtual DescriptorSet *      createDescriptorSet() override;
    virtual DescriptorSetLayout *createDescriptorSetLayout() override;
    virtual PipelineLayout *     createPipelineLayout() override;
    virtual PipelineState *      createPipelineState() override;
    virtual GlobalBarrier *      createGlobalBarrier() override;
    virtual TextureBarrier *     createTextureBarrier() override;
    virtual void                 copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) override;

    void destroySwapchain();
    bool checkSwapchainStatus();

    CCVKGPUDevice *       _gpuDevice    = nullptr;
    CCVKGPUSwapchain *    _gpuSwapchain = nullptr;
    vector<CCVKTexture *> _depthStencilTextures;

    vector<CCVKGPUFencePool *>         _gpuFencePools;
    vector<CCVKGPURecycleBin *>        _gpuRecycleBins;
    vector<CCVKGPUStagingBufferPool *> _gpuStagingBufferPools;

    CCVKGPUBufferHub *       _gpuBufferHub        = nullptr;
    CCVKGPUTransportHub *    _gpuTransportHub     = nullptr;
    CCVKGPUDescriptorHub *   _gpuDescriptorHub    = nullptr;
    CCVKGPUSemaphorePool *   _gpuSemaphorePool    = nullptr;
    CCVKGPUDescriptorSetHub *_gpuDescriptorSetHub = nullptr;
    CCVKGPUBarrierManager *  _gpuBarrierManager   = nullptr;

    vector<const char *> _layers;
    vector<const char *> _extensions;

    bool _swapchainReady = false;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXVULKAN_DEVICE_H_
