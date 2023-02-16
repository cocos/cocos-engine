#pragma once

#include "gfx-base/GFXDef-common.h"
#include "gfx-gles-common/gles2w.h"
#include "gfx-gles-common/gles3w.h"
#include "gfx-gles-new/egl/Context.h"
#include "base/Log.h"

#if CC_DEBUG > 0
    #define GL_CHECK(x)                                              \
        do {                                                         \
            x;                                                       \
            GLenum err = glGetError();                               \
            if (err != GL_NO_ERROR) {                                \
                CC_LOG_ERROR("%s returned GL error: 0x%x", #x, err); \
                CC_ABORT();                                          \
            }                                                        \
        } while (0)
#else
    #define GL_CHECK(x)  x
#endif

namespace cc::gfx::gles {

struct InternalFormat {
    GLenum internalFormat = 0;
    GLenum format         = 0;
    GLenum type           = 0;
    bool isCompressed     = false;
};

struct RasterizerState {
    bool cullingEn   = false;
    GLenum cullFace  = GL_BACK;
    GLenum frontFace = GL_CCW;

    GLfloat depthBias     = 0.F;
    GLfloat depthBiasSlop = 0.F;
    GLfloat lineWidth     = 1.F;
};

struct StencilState {
    GLenum func        = GL_ALWAYS;
    uint32_t readMask  = 0xffffffff;
    uint32_t writemask = 0xffffffff;
    uint32_t reference = 0;
    GLenum failOp      = GL_KEEP;
    GLenum zPassOp     = GL_KEEP;
    GLenum zFailOp     = GL_KEEP;
};

struct DepthState {
    bool depthWrite  = true;
    bool depthTest   = false;
    GLenum depthFunc = GL_LESS;
    GLfloat minDepth = 0.F;
    GLfloat maxDepth = 1.F;
};

struct BlendTarget {
    bool blendEnable     = false;
    uint8_t writeMask    = 0xF;
    GLenum blendOp       = GL_FUNC_ADD;
    GLenum blendSrc      = GL_ONE;
    GLenum blendDst      = GL_ZERO;
    GLenum blendAlphaOp  = GL_FUNC_ADD;
    GLenum blendSrcAlpha = GL_ONE;
    GLenum blendDstAlpha = GL_ZERO;
};

struct BlendState {
    bool isA2C    = false;
    bool hasColor = false;
    Color color;
    BlendTarget target;
};

struct DepthStencilState {
    DepthState depth;
    bool stencilTest = false;
    StencilState front;
    StencilState back;
};

struct ContextState {
    egl::Context     *eglContext = nullptr;
    RasterizerState   rs;
    DepthStencilState ds;
    BlendState bs;
    GLenum primitive = GL_TRIANGLES;
    GLuint program    = 0;
    GLuint drawBuffer = 0;
    bool scissorTest = false;
    Viewport viewport = {0, 0, 1, 1, 0.f, 1.f};
    Rect scissor      = {0, 0, 1, 1};
};

inline bool isBufferType(DescriptorType type) {
    return type == DescriptorType::UNIFORM_BUFFER ||
           type == DescriptorType::DYNAMIC_UNIFORM_BUFFER ||
           type == DescriptorType::STORAGE_BUFFER ||
           type == DescriptorType::DYNAMIC_STORAGE_BUFFER;
}

inline bool isTextureSampler(DescriptorType type) {
    return type == DescriptorType::SAMPLER_TEXTURE ||
           type == DescriptorType::SAMPLER ||
           type == DescriptorType::TEXTURE ||
           type == DescriptorType::STORAGE_IMAGE;
}

} // namespace cc::gfx::gles
