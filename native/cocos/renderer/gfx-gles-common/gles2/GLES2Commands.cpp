#include "GLES2Commands.h"

namespace cc::gfx {

#include "GLES2Types.inl"

void cmdFuncGLES2CreateBuffer(GLESDevice *device, GLESGPUBuffer *gpuBuffer) {}
void cmdFuncGLES2DestroyBuffer(GLESDevice *device, GLuint *bufferIDs, uint32_t count) {}
void cmdFuncGLES2ResizeBuffer(GLESDevice *device, GLESGPUBuffer *gpuBuffer) {}
void cmdFuncGLES2UpdateBuffer(GLESDevice *device, GLESGPUBuffer *gpuBuffer, const void *buffer, uint32_t offset, uint32_t size, bool useMap, bool sync) {}
void cmdFuncGLES2CreateTexture(GLESDevice *device, GLESGPUTexture *gpuTexture) {}
void cmdFuncGLES2DestroyTexture(GLESDevice *device, GLuint *texIDs, uint32_t count) {}
void cmdFuncGLES2DestroyRenderBuffer(GLESDevice *device, GLuint *renderbufferIDs, uint32_t count) {}
void cmdFuncGLES2ResizeTexture(GLESDevice *device, GLESGPUTexture *gpuTexture) {}
void cmdFuncGLES2UpdateProgramBinaryFormats(GLESDevice *device, ccstd::vector<GLint> &formats) {}
void cmdFuncGLES2CreateShaderByBinary(GLESDevice *device, GLESGPUShader *gpuShader, uint32_t layoutHash) {}
void cmdFuncGLES2CreateShaderBySource(GLESDevice *device, GLESGPUShader *gpuShader, uint32_t layoutHash) {}
void cmdFuncGLES2DestroyProgram(GLESDevice *device, GLuint programID) {}
void cmdFuncGLES2CreatePipelineState(GLESDevice *device, GLESGPUPipelineState *gpuPso) {}
void cmdFuncGLES2DestroyPipelineState(GLESDevice *device, GLESGPUPipelineState *gpuPso) {}
void cmdFuncGLES2CreateRenderPass(GLESDevice *device, GLESGPURenderPass *gpuRenderPass) {}
void cmdFuncGLES2CreateInputAssembler(GLESDevice *device, GLESGPUInputAssembler *gpuInputAssembler) {}
void cmdFuncGLES2DestroyInputAssembler(GLESDevice *device, GLESGPUInputAssembler *gpuInputAssembler) {}
void cmdFuncGLES2CreateFramebuffer(GLESDevice *device, GLESGPUFramebuffer *gpuFBO, uint32_t contextIndex) {}
void cmdFuncGLES2DestroyFramebuffer(GLESDevice *device, GLESGPUFramebuffer *gpuFBO, uint32_t contextIndex) {}
void cmdFuncGLES2CreateGeneralBarrier(GLESDevice *device, GLESGPUGeneralBarrier *barrier) {}
void cmdFuncGLES2CopyBuffersToTexture(GLESDevice *device, const uint8_t *const *buffers, GLESGPUTexture *gpuTexture, const BufferTextureCopy *regions, uint32_t count) {}
void cmdFuncGLES2CreateSampler(GLESDevice *device, GLESGPUSampler *gpuSampler) {}
void cmdFuncGLES2DestroySampler(GLESDevice *device, GLESGPUSampler *gpuSampler) {}
void cmdFuncGLES2CreateFence(GLESDevice *device, GLESGPUFence *gpuFence) {}
void cmdFuncGLES2DestroyFence(GLESDevice *device, GLESGPUFence *gpuFence) {}
void cmdFuncGLES2WaitFence(GLESDevice *device, GLESGPUFence *gpuFence, uint64_t timeout, bool isClient) {}
} // namespace cc::gfx
