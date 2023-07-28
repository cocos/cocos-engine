#include "GLESCommands.h"
#ifdef CC_USE_GLES2
#include "gfx-gles-common/gles2/GLES2Commands.h"
#include "gfx-gles-common/gles2/GLES2CommandEncoder.h"
#endif
#ifdef CC_USE_GLES3
#include "gfx-gles-common/gles3/GLES3Commands.h"
#include "gfx-gles-common/gles3/GLES3CommandEncoder.h"
#endif

namespace cc::gfx {

PFN_GLESUpdateFormatFeature glesUpdateFormatFeature;
PFN_GLESUpdateTextureExclusive glesUpdateTextureExclusive;
PFN_GLESUpdateFeatureAndCapabilities glesUpdateFeatureAndCapabilities;

PFN_GLESCreateBuffer glesCreateBuffer;
PFN_GLESDestroyBuffer glesDestroyBuffer;
PFN_GLESResizeBuffer glesResizeBuffer;
PFN_GLESUpdateBuffer glesUpdateBuffer;

PFN_GLESCreateTexture glesCreateTexture;
PFN_GLESDestroyTexture glesDestroyTexture;
PFN_GLESDestroyRenderBuffer glesDestroyRenderBuffer;
PFN_GLESResizeTexture glesResizeTexture;

PFN_GLESUpdateProgramBinaryFormats glesUpdateProgramBinaryFormats;
PFN_GLESCreateShaderByBinary glesCreateShaderByBinary;
PFN_GLESCreateShaderBySource glesCreateShaderBySource;
PFN_GLESDestroyProgram glesDestroyProgram;

PFN_GLESCreatePipelineState glesCreatePipelineState;
PFN_GLESDestroyPipelineState glesDestroyPipelineState;


PFN_GLESCreateRenderPass glesCreateRenderPass;

PFN_GLESCreateInputAssembler glesCreateInputAssembler;
PFN_GLESDestroyInputAssembler glesDestroyInputAssembler;

PFN_GLESCreateFramebuffer glesCreateFramebuffer;
PFN_GLESDestroyFramebuffer glesDestroyFramebuffer;

PFN_GLESCreateSampler glesCreateSampler;
PFN_GLESDestroySampler glesDestroySampler;

PFN_GLESCreateFence glesCreateFence;
PFN_GLESDestroyFence glesDestroyFence;
PFN_GLESWaitFence glesWaitFence;

PFN_GLESCreateGeneralBarrier glesCreateGeneralBarrier;

PFN_GLESCopyBuffersToTexture glesCopyBuffersToTexture;

namespace {
#ifdef CC_USE_GLES2
void initFunctionsV2() {
    glesUpdateFormatFeature    = cmdFuncGLES2UpdateFormatFeatures;
    glesUpdateTextureExclusive = cmdFuncGLES2UpdateTextureExclusive;
    glesUpdateFeatureAndCapabilities = cmdFuncGLES2UpdateFeatureAndCapabilities;

    glesCreateBuffer  = cmdFuncGLES2CreateBuffer;
    glesDestroyBuffer = cmdFuncGLES2DestroyBuffer;
    glesResizeBuffer  = cmdFuncGLES2ResizeBuffer;
    glesUpdateBuffer  = cmdFuncGLES2UpdateBuffer;

    glesCreateTexture  = cmdFuncGLES2CreateTexture;
    glesResizeTexture  = cmdFuncGLES2ResizeTexture;
    glesDestroyTexture = cmdFuncGLES2DestroyTexture;
    glesDestroyRenderBuffer = cmdFuncGLES2DestroyRenderBuffer;

    glesUpdateProgramBinaryFormats = cmdFuncGLES2UpdateProgramBinaryFormats;
    glesCreateShaderByBinary = cmdFuncGLES2CreateShaderByBinary;
    glesCreateShaderBySource = cmdFuncGLES2CreateShaderBySource;
    glesDestroyProgram = cmdFuncGLES2DestroyProgram;

    glesCreatePipelineState = cmdFuncGLES2CreatePipelineState;
    glesDestroyPipelineState = cmdFuncGLES2DestroyPipelineState;

    glesCreateRenderPass  = cmdFuncGLES2CreateRenderPass;

    glesCreateInputAssembler  = cmdFuncGLES2CreateInputAssembler;
    glesDestroyInputAssembler = cmdFuncGLES2DestroyInputAssembler;

    glesCreateFramebuffer  = cmdFuncGLES2CreateFramebuffer;
    glesDestroyFramebuffer = cmdFuncGLES2DestroyFramebuffer;

    glesCreateSampler  = cmdFuncGLES2CreateSampler;
    glesDestroySampler = cmdFuncGLES2DestroySampler;

    glesCreateFence = cmdFuncGLES2CreateFence;
    glesDestroyFence = cmdFuncGLES2DestroyFence;
    glesWaitFence = cmdFuncGLES2WaitFence;

    glesCreateGeneralBarrier = cmdFuncGLES2CreateGeneralBarrier;

    glesCopyBuffersToTexture = cmdFuncGLES2CopyBuffersToTexture;
}
#endif

#ifdef CC_USE_GLES3
void initFunctionsV3() {
    glesUpdateFormatFeature    = cmdFuncGLES3UpdateFormatFeatures;
    glesUpdateTextureExclusive = cmdFuncGLES3UpdateTextureExclusive;
    glesUpdateFeatureAndCapabilities = cmdFuncGLES3UpdateFeatureAndCapabilities;

    glesCreateBuffer  = cmdFuncGLES3CreateBuffer;
    glesDestroyBuffer = cmdFuncGLES3DestroyBuffer;
    glesResizeBuffer  = cmdFuncGLES3ResizeBuffer;
    glesUpdateBuffer  = cmdFuncGLES3UpdateBuffer;

    glesCreateTexture  = cmdFuncGLES3CreateTexture;
    glesResizeTexture  = cmdFuncGLES3ResizeTexture;
    glesDestroyTexture = cmdFuncGLES3DestroyTexture;
    glesDestroyRenderBuffer = cmdFuncGLES3DestroyRenderBuffer;

    glesUpdateProgramBinaryFormats = cmdFuncGLES3UpdateProgramBinaryFormats;
    glesCreateShaderByBinary = cmdFuncGLES3CreateShaderByBinary;
    glesCreateShaderBySource = cmdFuncGLES3CreateShaderBySource;
    glesDestroyProgram = cmdFuncGLES3DestroyProgram;

    glesCreatePipelineState = cmdFuncGLES3CreatePipelineState;
    glesDestroyPipelineState = cmdFuncGLES3DestroyPipelineState;

    glesCreateRenderPass  = cmdFuncGLES3CreateRenderPass;

    glesCreateInputAssembler  = cmdFuncGLES3CreateInputAssembler;
    glesDestroyInputAssembler = cmdFuncGLES3DestroyInputAssembler;

    glesCreateFramebuffer  = cmdFuncGLES3CreateFramebuffer;
    glesDestroyFramebuffer = cmdFuncGLES3DestroyFramebuffer;

    glesCreateSampler  = cmdFuncGLES3CreateSampler;
    glesDestroySampler = cmdFuncGLES3DestroySampler;

    glesCreateFence = cmdFuncGLES3CreateFence;
    glesDestroyFence = cmdFuncGLES3DestroyFence;
    glesWaitFence = cmdFuncGLES3WaitFence;

    glesCreateGeneralBarrier = cmdFuncGLES3CreateGeneralBarrier;

    glesCopyBuffersToTexture = cmdFuncGLES3CopyBuffersToTexture;
}
#endif
} // namespace

void initGLESCmdFunctions(GLuint majorVersion) {
#ifdef CC_USE_GLES3
    if (majorVersion >= 3) {
        initFunctionsV3();
        return;
    }
#endif
#ifdef CC_USE_GLES2
    initFunctionsV2();
#endif
}

GLESCommandEncoder *createGLESCommandEncoder(GLuint majorVersion) {
#ifdef CC_USE_GLES3
    if (majorVersion >= 3) {
        return ccnew GLES3CommandEncoder;
    }
#endif
#ifdef CC_USE_GLES2
    return ccnew GLES2CommandEncoder;
#endif
    return nullptr;
}

} // namespace cc::gfx
