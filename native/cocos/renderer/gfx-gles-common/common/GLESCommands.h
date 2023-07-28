#pragma once

#include "base/std/container/array.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-gles-common/common/GLESBase.h"
#include "gfx-gles-common/common/GLESCommandEncoder.h"

namespace cc::gfx {
class GLESDevice;
struct GLESGPUBuffer;
struct GLESGPUTexture;
struct GLESGPUGeneralBarrier;
struct GLESGPUShader;
struct GLESGPUPipelineLayout;
struct GLESGPURenderPass;
struct GLESGPUInputAssembler;
struct GLESGPUFramebuffer;
struct GLESGPUSampler;
struct GLESGPUPipelineState;

using PFN_GLESUpdateFormatFeature = void(*)(GLESDevice *device, ccstd::array<FormatFeature, static_cast<size_t>(Format::COUNT)> &formatFeatures);
using PFN_GLESUpdateTextureExclusive = void(*)(GLESDevice *device, ccstd::array<bool, static_cast<size_t>(Format::COUNT)> &textureExclusive);
using PFN_GLESUpdateFeatureAndCapabilities = void(*)(GLESDevice *device, DeviceCaps &caps, GLESGPUConstantRegistry &constantRegistry, ccstd::array<bool, static_cast<size_t>(Feature::COUNT)> &features);

using PFN_GLESCreateBuffer  = void(*)(GLESDevice *device, GLESGPUBuffer *gpuBuffer);
using PFN_GLESResizeBuffer  = void(*)(GLESDevice *device, GLESGPUBuffer *gpuBuffer);
using PFN_GLESUpdateBuffer  = void(*)(GLESDevice *device, GLESGPUBuffer *gpuBuffer, const void *buffer, uint32_t offset, uint32_t size, bool mapBuffer, bool sync);
using PFN_GLESDestroyBuffer = void(*)(GLESDevice *device, GLuint *buffers, uint32_t count);

using PFN_GLESCreateTexture  = void(*)(GLESDevice *device, GLESGPUTexture *gpuTexture);
using PFN_GLESResizeTexture  = void(*)(GLESDevice *device, GLESGPUTexture *gpuTexture);
using PFN_GLESDestroyTexture = void(*)(GLESDevice *device, GLuint *textures, uint32_t count);
using PFN_GLESDestroyRenderBuffer = void(*)(GLESDevice *device, GLuint *rbs, uint32_t count);

using PFN_GLESUpdateProgramBinaryFormats = void(*)(GLESDevice *device, ccstd::vector<GLint> &formats);
using PFN_GLESCreateShaderByBinary = void(*)(GLESDevice *device, GLESGPUShader *gpuShader, uint32_t layoutHash);
using PFN_GLESCreateShaderBySource = void(*)(GLESDevice *device, GLESGPUShader *gpuShader, uint32_t layoutHash);
using PFN_GLESDestroyProgram = void(*)(GLESDevice *device, GLuint programID);

using PFN_GLESCreatePipelineState = void(*)(GLESDevice *device, GLESGPUPipelineState *gpuPso);
using PFN_GLESDestroyPipelineState = void(*)(GLESDevice *device, GLESGPUPipelineState *gpuPso);

using PFN_GLESCreateRenderPass  = void(*)(GLESDevice *device, GLESGPURenderPass *gpuRenderPass);

using PFN_GLESCreateInputAssembler  = void(*)(GLESDevice *device, GLESGPUInputAssembler *gpuInputAssembler);
using PFN_GLESDestroyInputAssembler = void(*)(GLESDevice *device, GLESGPUInputAssembler *gpuInputAssembler);

using PFN_GLESCreateFramebuffer  = void(*)(GLESDevice *device, GLESGPUFramebuffer *gpuFBO, uint32_t contextIndex);
using PFN_GLESDestroyFramebuffer = void(*)(GLESDevice *device, GLESGPUFramebuffer *gpuFBO, uint32_t contextIndex);

using PFN_GLESCreateSampler  = void(*)(GLESDevice *device, GLESGPUSampler *gpuSampler);
using PFN_GLESDestroySampler = void(*)(GLESDevice *device, GLESGPUSampler *gpuSampler);

using PFN_GLESCreateFence  = void(*)(GLESDevice *device, GLESGPUFence *gpuFence);
using PFN_GLESDestroyFence = void(*)(GLESDevice *device, GLESGPUFence *gpuFence);
using PFN_GLESWaitFence = void(*)(GLESDevice *device, GLESGPUFence *gpuFence, uint64_t timeout, bool isClient);

using PFN_GLESCreateGeneralBarrier = void(*)(GLESDevice *device, GLESGPUGeneralBarrier *barrier);

using PFN_GLESCopyBuffersToTexture = void(*)(GLESDevice *device, const uint8_t *const *buffers, GLESGPUTexture *gpuTexture, const BufferTextureCopy *regions, uint32_t count);

extern PFN_GLESUpdateFormatFeature glesUpdateFormatFeature;
extern PFN_GLESUpdateTextureExclusive glesUpdateTextureExclusive;
extern PFN_GLESUpdateFeatureAndCapabilities glesUpdateFeatureAndCapabilities;

extern PFN_GLESCreateBuffer glesCreateBuffer;
extern PFN_GLESDestroyBuffer glesDestroyBuffer;
extern PFN_GLESResizeBuffer glesResizeBuffer;
extern PFN_GLESUpdateBuffer glesUpdateBuffer;

extern PFN_GLESCreateTexture glesCreateTexture;
extern PFN_GLESDestroyTexture glesDestroyTexture;
extern PFN_GLESDestroyRenderBuffer glesDestroyRenderBuffer;
extern PFN_GLESResizeTexture glesResizeTexture;

extern PFN_GLESUpdateProgramBinaryFormats glesUpdateProgramBinaryFormats;
extern PFN_GLESCreateShaderByBinary glesCreateShaderByBinary;
extern PFN_GLESCreateShaderBySource glesCreateShaderBySource;
extern PFN_GLESDestroyProgram glesDestroyProgram;

extern PFN_GLESCreatePipelineState glesCreatePipelineState;
extern PFN_GLESDestroyPipelineState glesDestroyPipelineState;

extern PFN_GLESCreateRenderPass glesCreateRenderPass;

extern PFN_GLESCreateInputAssembler glesCreateInputAssembler;
extern PFN_GLESDestroyInputAssembler glesDestroyInputAssembler;

extern PFN_GLESCreateFramebuffer glesCreateFramebuffer;
extern PFN_GLESDestroyFramebuffer glesDestroyFramebuffer;

extern PFN_GLESCreateSampler glesCreateSampler;
extern PFN_GLESDestroySampler glesDestroySampler;

extern PFN_GLESCreateFence glesCreateFence;
extern PFN_GLESDestroyFence glesDestroyFence;
extern PFN_GLESWaitFence glesWaitFence;

extern PFN_GLESCreateGeneralBarrier glesCreateGeneralBarrier;

extern PFN_GLESCopyBuffersToTexture glesCopyBuffersToTexture;

void initGLESCmdFunctions(GLuint majorVersion);
GLESCommandEncoder *createGLESCommandEncoder(GLuint majorVersion);

} // namespace cc::gfx
