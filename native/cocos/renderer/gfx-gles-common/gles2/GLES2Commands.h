#pragma once

#include "gfx-gles-common/common/GLESBase.h"
#include "gfx-gles-common/common/GLESDevice.h"
#include "gfx-gles-common/common/GLESInputAssembler.h"
#include "gfx-gles-common/common/GLESFramebuffer.h"
#include "gfx-gles-common/common/GLESCommandEncoder.h"

namespace cc::gfx {
struct GLESGPUFence;

void cmdFuncGLES2UpdateFormatFeatures(GLESDevice *device, ccstd::array<FormatFeature, static_cast<size_t>(Format::COUNT)> &formatFeatures);
void cmdFuncGLES2UpdateTextureExclusive(GLESDevice *device, ccstd::array<bool, static_cast<size_t>(Format::COUNT)> &textureExclusive);
void cmdFuncGLES2UpdateFeatureAndCapabilities(GLESDevice *device, DeviceCaps &caps, GLESGPUConstantRegistry &constantRegistry,
                                              ccstd::array<bool, static_cast<size_t>(Feature::COUNT)> &features);

void cmdFuncGLES2CreateBuffer(GLESDevice *device, GLESGPUBuffer *gpuBuffer);
void cmdFuncGLES2ResizeBuffer(GLESDevice *device, GLESGPUBuffer *gpuBuffer);
void cmdFuncGLES3UpdateBuffer(GLESDevice *device, GLESGPUBuffer *gpuBuffer, const void *buffer, uint32_t offset, uint32_t size, bool useMap, bool sync);
void cmdFuncGLES2DestroyBuffer(GLESDevice *device, GLuint *bufferIDs, uint32_t count);

void cmdFuncGLES2CreateTexture(GLESDevice *device, GLESGPUTexture *gpuTexture);
void cmdFuncGLES2ResizeTexture(GLESDevice *device, GLESGPUTexture *gpuTexture);
void cmdFuncGLES2DestroyTexture(GLESDevice *device, GLuint *texIDs, uint32_t count);
void cmdFuncGLES2DestroyRenderBuffer(GLESDevice *device, GLuint *renderbufferIDs, uint32_t count);

void cmdFuncGLES2UpdateProgramBinaryFormats(GLESDevice *device, ccstd::vector<GLint> &formats);
void cmdFuncGLES2CreateShaderByBinary(GLESDevice *device, GLESGPUShader *gpuShader, uint32_t layoutHash);
void cmdFuncGLES2CreateShaderBySource(GLESDevice *device, GLESGPUShader *gpuShader, uint32_t layoutHash);
void cmdFuncGLES2DestroyProgram(GLESDevice *device, GLuint programID);

void cmdFuncGLES2CreatePipelineState(GLESDevice *device, GLESGPUPipelineState *gpuPso);
void cmdFuncGLES2DestroyPipelineState(GLESDevice *device, GLESGPUPipelineState *gpuPso);

void cmdFuncGLES2CreateRenderPass(GLESDevice *device, GLESGPURenderPass *gpuRenderPass);

void cmdFuncGLES2CreateInputAssembler(GLESDevice *device, GLESGPUInputAssembler *gpuInputAssembler);
void cmdFuncGLES2DestroyInputAssembler(GLESDevice *device, GLESGPUInputAssembler *gpuInputAssembler);

void cmdFuncGLES2CreateFramebuffer(GLESDevice *device, GLESGPUFramebuffer *gpuFBO, uint32_t contextIndex);
void cmdFuncGLES2DestroyFramebuffer(GLESDevice *device, GLESGPUFramebuffer *gpuFBO, uint32_t contextIndex);

void cmdFuncGLES2CreateSampler(GLESDevice *device, GLESGPUSampler *gpuSampler);
void cmdFuncGLES2DestroySampler(GLESDevice *device, GLESGPUSampler *gpuSampler);

void cmdFuncGLES2CreateFence(GLESDevice *device, GLESGPUFence *gpuFence);
void cmdFuncGLES2DestroyFence(GLESDevice *device, GLESGPUFence *gpuFence);
void cmdFuncGLES2WaitFence(GLESDevice *device, GLESGPUFence *gpuFence, uint64_t timeout, bool isClient);

void cmdFuncGLES2CreateGeneralBarrier(GLESDevice *device, GLESGPUGeneralBarrier *barrier);

void cmdFuncGLES2CopyBuffersToTexture(GLESDevice *device, const uint8_t *const *buffers, GLESGPUTexture *gpuTexture, const BufferTextureCopy *regions, uint32_t count);
} // namespace cc::gfx
