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

#ifndef CC_GFXGLES3_DEVICE_H_
#define CC_GFXGLES3_DEVICE_H_

namespace cc {
namespace gfx {

class GLES3Context;
class GLES3GPUStateCache;
class GLES3GPUStagingBufferPool;
class GLES3GPUFramebufferCacheMap;

class CC_GLES3_API GLES3Device final : public Device {
public:
    GLES3Device();
    ~GLES3Device();

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

    virtual bool initialize(const DeviceInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
    virtual void acquire() override;
    virtual void present() override;

    CC_INLINE GLES3GPUStateCache *stateCache() const { return _gpuStateCache; }
    CC_INLINE GLES3GPUStagingBufferPool *stagingBufferPool() const { return _gpuStagingBufferPool; }
    CC_INLINE GLES3GPUFramebufferCacheMap *framebufferCacheMap() const { return _gpuFramebufferCacheMap; }

    CC_INLINE bool checkExtension(const String &extension) const {
        for (size_t i = 0; i < _extensions.size(); ++i) {
            if (_extensions[i].find(extension) != String::npos) {
                return true;
            }
        }
        return false;
    }

    CC_INLINE uint getThreadID() const { return _threadID; }
    uint           getMinorVersion() const;

protected:
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

    virtual void bindRenderContext(bool bound) override;
    virtual void bindDeviceContext(bool bound) override;

private:
    GLES3Context *               _renderContext          = nullptr;
    GLES3Context *               _deviceContext          = nullptr;
    GLES3GPUStateCache *         _gpuStateCache          = nullptr;
    GLES3GPUStagingBufferPool *  _gpuStagingBufferPool   = nullptr;
    GLES3GPUFramebufferCacheMap *_gpuFramebufferCacheMap = nullptr;

    StringArray _extensions;

    uint _threadID = 0u;
};

} // namespace gfx
} // namespace cc

#endif
