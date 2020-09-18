#ifndef CC_GFXGLES2_DEVICE_H_
#define CC_GFXGLES2_DEVICE_H_

namespace cc {
namespace gfx {

class GLES2GPUStateCache;
class GLES2GPUCommandAllocator;
class GLES2GPUStagingBufferPool;

class CC_GLES2_API GLES2Device : public Device {
public:
    GLES2Device();
    ~GLES2Device();

public:
    virtual bool initialize(const DeviceInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
    virtual void acquire() override;
    virtual void present() override;
    virtual CommandBuffer *createCommandBuffer(const CommandBufferInfo &info) override;
    virtual Fence *createFence(const FenceInfo &info) override;
    virtual Queue *createQueue(const QueueInfo &info) override;
    virtual Buffer *createBuffer(const BufferInfo &info) override;
    virtual Buffer *createBuffer(const BufferViewInfo &info) override;
    virtual Texture *createTexture(const TextureInfo &info) override;
    virtual Texture *createTexture(const TextureViewInfo &info) override;
    virtual Sampler *createSampler(const SamplerInfo &info) override;
    virtual Shader *createShader(const ShaderInfo &info) override;
    virtual InputAssembler *createInputAssembler(const InputAssemblerInfo &info) override;
    virtual RenderPass *createRenderPass(const RenderPassInfo &info) override;
    virtual Framebuffer *createFramebuffer(const FramebufferInfo &info) override;
    virtual DescriptorSet *createDescriptorSet(const DescriptorSetInfo &info) override;
    virtual DescriptorSetLayout *createDescriptorSetLayout(const DescriptorSetLayoutInfo &info) override;
    virtual PipelineLayout *createPipelineLayout(const PipelineLayoutInfo &info) override;
    virtual PipelineState *createPipelineState(const PipelineStateInfo &info) override;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) override;

    CC_INLINE bool useVAO() const { return _useVAO; }
    CC_INLINE bool useDrawInstanced() const { return _useDrawInstanced; }
    CC_INLINE bool useInstancedArrays() const { return _useInstancedArrays; }
    CC_INLINE bool useDiscardFramebuffer() const { return _useDiscardFramebuffer; }

    CC_INLINE GLES2GPUStateCache *stateCache() const { return _gpuStateCache; }
    CC_INLINE GLES2GPUCommandAllocator *cmdAllocator() const { return _gpuCmdAllocator; }
    CC_INLINE GLES2GPUStagingBufferPool *stagingBufferPool() const { return _gpuStagingBufferPool; }

    CC_INLINE bool checkExtension(const String &extension) const {
        for (size_t i = 0; i < _extensions.size(); ++i) {
            if (_extensions[i].find(extension) != String::npos) {
                return true;
            }
        }
        return false;
    }

private:
    GLES2GPUStateCache *_gpuStateCache = nullptr;
    GLES2GPUCommandAllocator *_gpuCmdAllocator = nullptr;
    GLES2GPUStagingBufferPool *_gpuStagingBufferPool = nullptr;

    StringArray _extensions;

    bool _useVAO = false;
    bool _useDrawInstanced = false;
    bool _useInstancedArrays = false;
    bool _useDiscardFramebuffer = false;
};

} // namespace gfx
} // namespace cc

#endif
