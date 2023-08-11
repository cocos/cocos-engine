#pragma once

#include "base/std/container/array.h"
#include "gfx-gles-common/common/GLESBase.h"
namespace cc::gfx {
class GLESDevice;
struct GLESGPUBuffer;
struct GLESGPUTexture;
struct GLESGPUTextureView;
struct GLESGPUShader;
struct GLESGPUPipelineState;
struct GLESGPUInputAssembler;
struct GLESGPUFramebuffer;
struct GLESGPUFramebufferObject;
struct GLESGPUSampler;
struct GLESGPUGeneralBarrier;
struct GLESGPURenderPass;
struct GLESGPUSwapchain;
struct GLESGPUFence;

void cmdFuncGLES3UpdateFormatFeatures(GLESDevice *device, ccstd::array<FormatFeature, static_cast<size_t>(Format::COUNT)> &formatFeatures);
void cmdFuncGLES3UpdateTextureExclusive(GLESDevice *device, ccstd::array<bool, static_cast<size_t>(Format::COUNT)> &textureExclusive);
void cmdFuncGLES3UpdateFeatureAndCapabilities(GLESDevice *device, DeviceCaps &caps, GLESGPUConstantRegistry &constantRegistry,
                                              ccstd::array<bool, static_cast<size_t>(Feature::COUNT)> &features);

void cmdFuncGLES3CreateBuffer(GLESDevice *device, GLESGPUBuffer *gpuBuffer);
void cmdFuncGLES3ResizeBuffer(GLESDevice *device, GLESGPUBuffer *gpuBuffer);
void cmdFuncGLES3UpdateBuffer(GLESDevice *device, GLESGPUBuffer *gpuBuffer, const void *buffer, uint32_t offset, uint32_t size, bool useMap, bool sync);
void cmdFuncGLES3DestroyBuffer(GLESDevice *device, GLuint *bufferIDs, uint32_t count);

void cmdFuncGLES3CreateTexture(GLESDevice *device, GLESGPUTexture *gpuTexture);
void cmdFuncGLES3ResizeTexture(GLESDevice *device, GLESGPUTexture *gpuTexture);
void cmdFuncGLES3DestroyTexture(GLESDevice *device, GLuint *texIDs, uint32_t count);
void cmdFuncGLES3DestroyRenderBuffer(GLESDevice *device, GLuint *renderbufferIDs, uint32_t count);

void cmdFuncGLES3UpdateProgramBinaryFormats(GLESDevice *device, ccstd::vector<GLint> &formats);
void cmdFuncGLES3CreateShaderByBinary(GLESDevice *device, GLESGPUShader *gpuShader, uint32_t layoutHash);
void cmdFuncGLES3CreateShaderBySource(GLESDevice *device, GLESGPUShader *gpuShader, uint32_t layoutHash);
void cmdFuncGLES3DestroyProgram(GLESDevice *device, GLuint programID);

void cmdFuncGLES3CreatePipelineState(GLESDevice *device, GLESGPUPipelineState *gpuPso);
void cmdFuncGLES3DestroyPipelineState(GLESDevice *device, GLESGPUPipelineState *gpuPso);

void cmdFuncGLES3CreateInputAssembler(GLESDevice *device, GLESGPUInputAssembler *gpuInputAssembler);
void cmdFuncGLES3DestroyInputAssembler(GLESDevice *device, GLESGPUInputAssembler *gpuInputAssembler);

void cmdFuncGLES3CreateFramebuffer(GLESDevice *device, GLESGPUFramebuffer *gpuFBO, uint32_t contextIndex);
void cmdFuncGLES3DestroyFramebuffer(GLESDevice *device, GLESGPUFramebuffer *gpuFBO, uint32_t contextIndex);

void cmdFuncGLES3CreateSampler(GLESDevice *device, GLESGPUSampler *gpuSampler);
void cmdFuncGLES3DestroySampler(GLESDevice *device, GLESGPUSampler *gpuSampler);

void cmdFuncGLES3CreateFence(GLESDevice *device, GLESGPUFence *gpuFence);
void cmdFuncGLES3DestroyFence(GLESDevice *device, GLESGPUFence *gpuFence);
void cmdFuncGLES3WaitFence(GLESDevice *device, GLESGPUFence *gpuFence, uint64_t timeout, bool isClient);

void cmdFuncGLES3CreateRenderPass(GLESDevice *device, GLESGPURenderPass *gpuRenderPass);

void cmdFuncGLES3CreateGeneralBarrier(GLESDevice *device, GLESGPUGeneralBarrier *barrier);

void cmdFuncGLES3CopyBuffersToTexture(GLESDevice *device, const uint8_t *const *buffers, GLESGPUTexture *gpuTexture, const BufferTextureCopy *regions, uint32_t count);

struct FBOProxy {
    FBOProxy(GLESGPUFramebufferObject &object, uint32_t ctxId);
    void initialize(GLESGPUSwapchain *swc = nullptr);
    void bindColor(const GLESGPUTextureView *texture, uint32_t colorIndex, const ColorAttachment &attachment);
    void bindColorMultiSample(const GLESGPUTextureView *texture, uint32_t colorIndex, GLint samples, const ColorAttachment &attachment);
    void bindDepthStencil(const GLESGPUTextureView *texture, const DepthStencilAttachment &attachment);
    void bindDepthStencilMultiSample(const GLESGPUTextureView *texture, GLint samples, const DepthStencilAttachment &attachment);
    bool isActive() const;
    void updateHandle();
    void processLoad(GLenum target);
    void processStore(GLenum target);

    GLESGPUFramebufferObject &fbo;
    GLuint &handle;
};

struct VAOProxy {
    VAOProxy(GLESGPUInputAssembler &object, uint32_t ctxId, uint32_t layoutHash);

    GLESGPUInputAssembler &ia;
    GLuint &handle;
};
} // namespace cc::gfx
