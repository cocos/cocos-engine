#ifndef CC_CORE_GFX_DEVICE_H_
#define CC_CORE_GFX_DEVICE_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL Device : public Object {
public:
    static Device *getInstance();

    Device();
    virtual ~Device();

public:
    virtual bool initialize(const DeviceInfo &info) = 0;
    virtual void destroy() = 0;
    virtual void resize(uint width, uint height) = 0;
    virtual void acquire() = 0;
    virtual void present() = 0;
    virtual CommandBuffer *createCommandBuffer(const CommandBufferInfo &info) = 0;
    virtual Fence *createFence(const FenceInfo &info) = 0;
    virtual Queue *createQueue(const QueueInfo &info) = 0;
    virtual Buffer *createBuffer(const BufferInfo &info) = 0;
    virtual Buffer *createBuffer(const BufferViewInfo &info) = 0;
    virtual Texture *createTexture(const TextureInfo &info) = 0;
    virtual Texture *createTexture(const TextureViewInfo &info) = 0;
    virtual Sampler *createSampler(const SamplerInfo &info) = 0;
    virtual Shader *createShader(const ShaderInfo &info) = 0;
    virtual InputAssembler *createInputAssembler(const InputAssemblerInfo &info) = 0;
    virtual RenderPass *createRenderPass(const RenderPassInfo &info) = 0;
    virtual Framebuffer *createFramebuffer(const FramebufferInfo &info) = 0;
    virtual DescriptorSet *createDescriptorSet(const DescriptorSetInfo &info) = 0;
    virtual DescriptorSetLayout *createDescriptorSetLayout(const DescriptorSetLayoutInfo &info) = 0;
    virtual PipelineLayout *createPipelineLayout(const PipelineLayoutInfo &info) = 0;
    virtual PipelineState *createPipelineState(const PipelineStateInfo &info) = 0;
    virtual void copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) = 0;

    CC_INLINE void copyBuffersToTexture(const BufferDataList &buffers, Texture *dst, const BufferTextureCopyList &regions) {
        copyBuffersToTexture(buffers.data(), dst, regions.data(), regions.size());
    }

    CC_INLINE API getGfxAPI() const { return _API; }
    CC_INLINE const String &getDeviceName() const { return _deviceName; }
    CC_INLINE uint getWidth() { return _width; }
    CC_INLINE uint getHeight() { return _height; }
    CC_INLINE uint getNativeWidth() { return _nativeWidth; }
    CC_INLINE uint getNativeHeight() { return _nativeHeight; }
    CC_INLINE MemoryStatus &getMemoryStatus() { return _memoryStatus; }
    CC_INLINE Context *getContext() const { return _context; }
    CC_INLINE Queue *getQueue() const { return _queue; }
    CC_INLINE const String &getRenderer() const { return _renderer; }
    CC_INLINE const String &getVendor() const { return _vendor; }
    CC_INLINE uint getNumDrawCalls() const { return _numDrawCalls; }
    CC_INLINE uint getNumInstances() const { return _numInstances; }
    CC_INLINE uint getNumTris() const { return _numTriangles; }
    CC_INLINE int getMaxVertexAttributes() const { return _maxVertexAttributes; }
    CC_INLINE int getMaxVertexUniformVectors() const { return _maxVertexUniformVectors; }
    CC_INLINE int getMaxFragmentUniformVectors() const { return _maxFragmentUniformVectors; }
    CC_INLINE int getMaxTextureUnits() const { return _maxTextureUnits; }
    CC_INLINE int getMaxVertexTextureUnits() const { return _maxVertexTextureUnits; }
    CC_INLINE int getMaxUniformBufferBindings() const { return _maxUniformBufferBindings; }
    CC_INLINE int getMaxUniformBlockSize() const { return _maxUniformBlockSize; }
    CC_INLINE int getMaxTextureSize() const { return _maxTextureSize; }
    CC_INLINE int getMaxCubeMapTextureSize() const { return _maxCubeMapTextureSize; }
    CC_INLINE int getUboOffsetAlignment() const { return _uboOffsetAlignment; }
    CC_INLINE int getDepthBits() const { return _depthBits; }
    CC_INLINE int getStencilBits() const { return _stencilBits; }
    CC_INLINE uint getShaderIdGen() { return _shaderIdGen++; }
    Format getColorFormat() const;
    Format getDepthStencilFormat() const;
    CC_INLINE bool hasFeature(Feature feature) const { return _features[static_cast<uint8_t>(feature)]; }
    CC_INLINE void defineMacro(const String &macro, const String &value) { _macros[macro] = value; }
    CC_INLINE float getClipSpaceMinZ() const { return _clipSpaceMinZ; }
    CC_INLINE float getScreenSpaceSignY() const { return _screenSpaceSignY; }
    CC_INLINE float getUVSpaceSignY() const { return _UVSpaceSignY; }

protected:
    API _API = API::UNKNOWN;
    String _deviceName;
    String _renderer;
    String _vendor;
    String _version;
    bool _features[static_cast<uint8_t>(Feature::COUNT)];
    uint _width = 0;
    uint _height = 0;
    uint _nativeWidth = 0;
    uint _nativeHeight = 0;
    MemoryStatus _memoryStatus;
    uintptr_t _windowHandle = 0;
    Context *_context = nullptr;
    Queue *_queue = nullptr;
    uint _numDrawCalls = 0u;
    uint _numInstances = 0u;
    uint _numTriangles = 0u;
    uint _maxVertexAttributes = 0u;
    uint _maxVertexUniformVectors = 0u;
    uint _maxFragmentUniformVectors = 0u;
    uint _maxTextureUnits = 0u;
    uint _maxVertexTextureUnits = 0u;
    uint _maxUniformBufferBindings = GFX_MAX_BUFFER_BINDINGS;
    uint _maxUniformBlockSize = 0u;
    uint _maxTextureSize = 0u;
    uint _maxCubeMapTextureSize = 0u;
    uint _uboOffsetAlignment = 0u;
    uint _depthBits = 0u;
    uint _stencilBits = 0u;
    uint _shaderIdGen = 0u;
    unordered_map<String, String> _macros;
    float _clipSpaceMinZ = -1.0f;
    float _screenSpaceSignY = 1.0f;
    float _UVSpaceSignY = -1.0f;

private:
    static Device *_instance;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_DEVICE_H_
