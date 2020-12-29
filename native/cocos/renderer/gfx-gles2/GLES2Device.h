/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#ifndef CC_GFXGLES2_DEVICE_H_
#define CC_GFXGLES2_DEVICE_H_

#ifndef GL_COMPRESSED_RGB8_ETC2
#define GL_COMPRESSED_RGB8_ETC2           0x9274
#endif

#ifndef GL_COMPRESSED_RGBA8_ETC2_EAC
#define GL_COMPRESSED_RGBA8_ETC2_EAC      0x9278
#endif

namespace cc {
namespace gfx {

class GLES2Context;
class GLES2GPUStateCache;
class GLES2GPUStagingBufferPool;

class CC_GLES2_API GLES2Device final : public Device {
public:
    GLES2Device();
    ~GLES2Device();

    using Device::createCommandBuffer;
    using Device::createFence;
    using Device::createQueue;
    using Device::createBuffer;
    using Device::createTexture;
    using Device::createSampler;
    using Device::createShader;
    using Device::createInputAssembler;
    using Device::createRenderPass;
    using Device::createFramebuffer;
    using Device::createDescriptorSet;
    using Device::createDescriptorSetLayout;
    using Device::createPipelineLayout;
    using Device::createPipelineState;
    using Device::copyBuffersToTexture;

    virtual bool initialize(const DeviceInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
    virtual void acquire() override;
    virtual void present() override;

    CC_INLINE bool useVAO() const { return _useVAO; }
    CC_INLINE bool useDrawInstanced() const { return _useDrawInstanced; }
    CC_INLINE bool useInstancedArrays() const { return _useInstancedArrays; }
    CC_INLINE bool useDiscardFramebuffer() const { return _useDiscardFramebuffer; }

    CC_INLINE GLES2GPUStateCache *stateCache() const { return _gpuStateCache; }
    CC_INLINE GLES2GPUStagingBufferPool *stagingBufferPool() const { return _gpuStagingBufferPool; }

    CC_INLINE bool checkExtension(const String &extension) const {
        for (size_t i = 0; i < _extensions.size(); ++i) {
            if (_extensions[i].find(extension) != String::npos) {
                return true;
            }
        }
        return false;
    }

    CC_INLINE uint getThreadID() const { return _threadID; }

protected:
    virtual CommandBuffer *doCreateCommandBuffer(const CommandBufferInfo &info, bool hasAgent) override;
    virtual Fence *createFence() override;
    virtual Queue *createQueue() override;
    virtual Buffer *createBuffer() override;
    virtual Texture *createTexture() override;
    virtual Sampler *createSampler() override;
    virtual Shader *createShader() override;
    virtual InputAssembler *createInputAssembler() override;
    virtual RenderPass *createRenderPass() override;
    virtual Framebuffer *createFramebuffer() override;
    virtual DescriptorSet *createDescriptorSet() override;
    virtual DescriptorSetLayout *createDescriptorSetLayout() override;
    virtual PipelineLayout *createPipelineLayout() override;
    virtual PipelineState *createPipelineState() override;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) override;

    virtual void bindRenderContext(bool bound) override;
    virtual void bindDeviceContext(bool bound) override;

private:

    bool checkForETC2() const;

    GLES2Context *_renderContext = nullptr;
    GLES2Context *_deviceContext = nullptr;
    GLES2GPUStateCache *_gpuStateCache = nullptr;
    GLES2GPUStagingBufferPool *_gpuStagingBufferPool = nullptr;

    StringArray _extensions;

    bool _useVAO = false;
    bool _useDrawInstanced = false;
    bool _useInstancedArrays = false;
    bool _useDiscardFramebuffer = false;

    uint _threadID = 0u;
};

} // namespace gfx
} // namespace cc

#endif
