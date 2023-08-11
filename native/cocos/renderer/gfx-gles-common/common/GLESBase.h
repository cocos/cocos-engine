#pragma once

#include "base/std/container/array.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-gles-common/loader/gles2w.h"
// remote in future
#include "gfx-gles-common/GLESCommandPool.h"

namespace cc::gfx {
static constexpr uint32_t QUEUE_NUM = static_cast<uint32_t>(QueueType::TRANSFER) + 1;
static constexpr uint32_t MAX_CONTEXT_NUM = QUEUE_NUM;

struct GLESGPUStateCache {
    RasterizerState   rs;
    DepthStencilState dss;
    BlendState bs;
    GLenum primitive = GL_TRIANGLES;

    GLuint glProgram = 0;

    GLuint drawFrameBuffer = 0;
    GLuint readFrameBuffer = 0;

    bool isCullFaceEnabled = true;
    bool isStencilTestEnabled = false;

    Viewport viewport;
    Rect scissor;

    ccstd::array<bool, 16> glEnabledAttribLocs;
    ccstd::array<bool, 16> glCurrentAttribLocs;
};

struct GLESGPUConstantRegistry {
    MSRTSupportLevel mMSRT{MSRTSupportLevel::NONE};
    FBFSupportLevel mFBF{FBFSupportLevel::NONE};

    GLuint majorVersion{3};
    GLuint minorVersion{2};

    // for gles2
    bool useVAO = false;
    bool useDrawInstanced = false;
    bool useInstancedArrays = false;
    bool useDiscardFramebuffer = false;

    ccstd::string fbfLevelStr;
    ccstd::string msaaLevelStr;
    ccstd::string compressedFmts;
};

} // namespace cc::gfx
