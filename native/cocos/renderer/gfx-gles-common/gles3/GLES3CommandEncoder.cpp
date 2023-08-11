#include "GLES3CommandEncoder.h"

#include "gfx-gles-common/loader/gles2w.h"
#include "gfx-gles-common/loader/gles3w.h"

#include "gfx-gles-common/egl/Context.h"

#include "gfx-gles-common/egl/Debug.h"
#include "gfx-gles-common/common/GLESDevice.h"
#include "gfx-gles-common/common/GLESRenderPass.h"
#include "GLES3Commands.h"

namespace cc::gfx {
#define BUFFER_OFFSET(idx) (static_cast<char *>(0) + (idx))

namespace {
void makeCurrent(egl::Context *context, FBOProxy &fboProxy) {
    if (fboProxy.fbo.swapchain != nullptr) {
        context->makeCurrent(fboProxy.fbo.swapchain->surface->getNativeHandle());
    }
}

void doResolve(egl::Context *context, GLESGPUStateCache *cache, GLESGPUFramebuffer *gpuFbo) {
    auto framebuffer = FBOProxy(gpuFbo->framebuffer, context->getContextID());
    auto resolveFramebuffer = FBOProxy(gpuFbo->resolveFramebuffer, context->getContextID());
    makeCurrent(context, resolveFramebuffer);

    auto width = gpuFbo->width;
    auto height = gpuFbo->height;

    if (cache->readFrameBuffer != framebuffer.handle) {
        GL_CHECK(glBindFramebuffer(GL_READ_FRAMEBUFFER, framebuffer.handle));
        cache->readFrameBuffer = framebuffer.handle;
    }

    if (cache->drawFrameBuffer != resolveFramebuffer.handle) {
        GL_CHECK(glBindFramebuffer(GL_DRAW_FRAMEBUFFER, resolveFramebuffer.handle));
        cache->drawFrameBuffer = resolveFramebuffer.handle;
    }

    resolveFramebuffer.processLoad(GL_DRAW_FRAMEBUFFER);

    if (!gpuFbo->colorBlitPairs.empty()) {
        auto resolveColorNum = gpuFbo->resolveFramebuffer.colors.size();
        std::vector<GLenum> drawBuffers(resolveColorNum, GL_NONE);
        for (auto &[src, dst] : gpuFbo->colorBlitPairs) {
            drawBuffers[dst] = GL_COLOR_ATTACHMENT0 + dst;
            GL_CHECK(glReadBuffer(GL_COLOR_ATTACHMENT0 + src));
            if (resolveFramebuffer.handle != 0) {
                GL_CHECK(glDrawBuffers(resolveColorNum, drawBuffers.data()));
            }

            GL_CHECK(glBlitFramebuffer(
                0, 0, width, height,
                0, 0, width, height,
                GL_COLOR_BUFFER_BIT, GL_NEAREST));
            drawBuffers[dst] = GL_NONE;
        }
    }
    if (gpuFbo->dsResolveMask != 0 && resolveFramebuffer.handle != 0) {
        GL_CHECK(glBlitFramebuffer(
            0, 0, width, height,
            0, 0, width, height,
            gpuFbo->dsResolveMask, GL_NEAREST));
    }

    framebuffer.processStore(GL_READ_FRAMEBUFFER);
    resolveFramebuffer.processStore(GL_DRAW_FRAMEBUFFER);
}

const GLenum GLES3_CMP_FUNCS[] = {
    GL_NEVER,
    GL_LESS,
    GL_EQUAL,
    GL_LEQUAL,
    GL_GREATER,
    GL_NOTEQUAL,
    GL_GEQUAL,
    GL_ALWAYS,
};
const GLenum GLES3_STENCIL_OPS[] = {
    GL_ZERO,
    GL_KEEP,
    GL_REPLACE,
    GL_INCR,
    GL_DECR,
    GL_INVERT,
    GL_INCR_WRAP,
    GL_DECR_WRAP,
};

const GLenum GLES3_BLEND_OPS[] = {
    GL_FUNC_ADD,
    GL_FUNC_SUBTRACT,
    GL_FUNC_REVERSE_SUBTRACT,
    GL_MIN,
    GL_MAX,
};

const GLenum GLES3_BLEND_FACTORS[] = {
    GL_ZERO,
    GL_ONE,
    GL_SRC_ALPHA,
    GL_DST_ALPHA,
    GL_ONE_MINUS_SRC_ALPHA,
    GL_ONE_MINUS_DST_ALPHA,
    GL_SRC_COLOR,
    GL_DST_COLOR,
    GL_ONE_MINUS_SRC_COLOR,
    GL_ONE_MINUS_DST_COLOR,
    GL_SRC_ALPHA_SATURATE,
    GL_CONSTANT_COLOR,
    GL_ONE_MINUS_CONSTANT_COLOR,
    GL_CONSTANT_ALPHA,
    GL_ONE_MINUS_CONSTANT_ALPHA,
};

bool isDynamicBuffer(DescriptorType type) {
    return type == DescriptorType::DYNAMIC_STORAGE_BUFFER ||
           type == DescriptorType::DYNAMIC_UNIFORM_BUFFER;
};

bool isBufferType(DescriptorType type) {
    return type == DescriptorType::UNIFORM_BUFFER ||
           type == DescriptorType::DYNAMIC_UNIFORM_BUFFER ||
           type == DescriptorType::STORAGE_BUFFER ||
           type == DescriptorType::DYNAMIC_STORAGE_BUFFER;
}

bool isTextureSampler(DescriptorType type) {
    return type == DescriptorType::SAMPLER_TEXTURE ||
           type == DescriptorType::SAMPLER ||
           type == DescriptorType::TEXTURE ||
           type == DescriptorType::STORAGE_IMAGE;
}

bool checkBuffer(const GLESGPUDescriptor &desc) {
    return desc.gpuBufferView &&
           desc.gpuBufferView->gpuBuffer &&
           desc.gpuBufferView->gpuBuffer->glBuffer != 0 &&
           desc.gpuBufferView->range != 0;
}

bool checkTexture(const GLESGPUDescriptor &desc) {
    return desc.gpuTextureView &&
           desc.gpuTextureView->texture &&
           desc.gpuTextureView->texture->glTexture != 0;
}
GLenum getBufferTarget(DescriptorType type) {
    switch (type) {
        case DescriptorType::STORAGE_BUFFER:
        case DescriptorType::DYNAMIC_STORAGE_BUFFER:
            return GL_SHADER_STORAGE_BUFFER;
        case DescriptorType::UNIFORM_BUFFER:
        case DescriptorType::DYNAMIC_UNIFORM_BUFFER:
            return GL_UNIFORM_BUFFER;
        default:
            break;
    }
    return 0;
}
} // namespace

void GLES3CommandEncoder::beginRenderPass(const PassBeginInfo &beginInfo) {
    _curSubPassIdx = 0;

    _descriptorSets.fill(nullptr);

    _currentFramebuffer = beginInfo.framebuffer;
    _currentRenderPass = beginInfo.framebuffer->gpuRenderPass;
    if (_currentFramebuffer == nullptr || _currentRenderPass == nullptr) {
        return;
    }

    auto *cache = _cacheState;
    auto framebuffer = FBOProxy(_currentFramebuffer->framebuffer, _context->getContextID());
    makeCurrent(_context, framebuffer);

    if (cache->drawFrameBuffer != framebuffer.handle) {
        GL_CHECK(glBindFramebuffer(GL_DRAW_FRAMEBUFFER, framebuffer.handle));
        cache->drawFrameBuffer = framebuffer.handle;
    }

    if (cache->viewport.left != beginInfo.renderArea.x ||
        cache->viewport.top != beginInfo.renderArea.y ||
        cache->viewport.width != beginInfo.renderArea.width ||
        cache->viewport.height != beginInfo.renderArea.height) {
        GL_CHECK(glViewport(beginInfo.renderArea.x, beginInfo.renderArea.y, beginInfo.renderArea.width, beginInfo.renderArea.height));
        cache->viewport.left = beginInfo.renderArea.x;
        cache->viewport.top =beginInfo.renderArea.y;
        cache->viewport.width = beginInfo.renderArea.width;
        cache->viewport.height = beginInfo.renderArea.height;
    }

    if (cache->scissor != beginInfo.renderArea) {
        GL_CHECK(glScissor(beginInfo.renderArea.x, beginInfo.renderArea.y, beginInfo.renderArea.width, beginInfo.renderArea.height));
        cache->scissor = beginInfo.renderArea;
    }

    GLbitfield glClears = 0;
    float fColors[4]{};
    bool maskSet = false;

    auto performLoadOp = [&](uint32_t attachmentIndex, uint32_t glAttachmentIndex) {
        const ColorAttachment &colorAttachment = _currentRenderPass->colorAttachments[attachmentIndex];
        if (colorAttachment.format != Format::UNKNOWN && colorAttachment.loadOp == LoadOp::CLEAR) {
            if (!maskSet && cache->bs.targets[0].blendColorMask != ColorMask::ALL) {
                GL_CHECK(glColorMask(true, true, true, true));
                maskSet = true;
            }

            const Color &color = beginInfo.clearColors[attachmentIndex];
            if (framebuffer.handle) {
                fColors[0] = color.x;
                fColors[1] = color.y;
                fColors[2] = color.z;
                fColors[3] = color.w;
                GL_CHECK(glClearBufferfv(GL_COLOR, glAttachmentIndex, fColors));
            } else {
                GL_CHECK(glClearColor(color.x, color.y, color.z, color.w));
                glClears |= GL_COLOR_BUFFER_BIT;
            }
        }
    };

    auto performDepthStencilLoadOp = [&](uint32_t attachmentIndex) {
        if (attachmentIndex != INVALID_BINDING) {
            bool hasStencils = GFX_FORMAT_INFOS[toNumber(_currentRenderPass->depthStencilAttachment.format)].hasStencil;
            if (_currentRenderPass->depthStencilAttachment.depthLoadOp == LoadOp::CLEAR) {
                if (!cache->dss.depthWrite) {
                    GL_CHECK(glDepthMask(true));
                }
                GL_CHECK(glClearDepthf(beginInfo.clearDepth));
                glClears |= GL_DEPTH_BUFFER_BIT;
            }
            if (hasStencils && _currentRenderPass->depthStencilAttachment.depthLoadOp == LoadOp::CLEAR) {
                if (!cache->dss.stencilWriteMaskFront) {
                    GL_CHECK(glStencilMaskSeparate(GL_FRONT, 0xffffffff));
                }
                if (!cache->dss.stencilWriteMaskBack) {
                    GL_CHECK(glStencilMaskSeparate(GL_BACK, 0xffffffff));
                }
                GL_CHECK(glClearStencil(beginInfo.clearStencil));
                glClears |= GL_STENCIL_BUFFER_BIT;
            }
        }

        if (glClears) {
            GL_CHECK(glClear(glClears));
        }

        // restore states
        if (maskSet) {
            ColorMask const colorMask = cache->bs.targets[0].blendColorMask;
            GL_CHECK(glColorMask((GLboolean)(colorMask & ColorMask::R),
                                 (GLboolean)(colorMask & ColorMask::G),
                                 (GLboolean)(colorMask & ColorMask::B),
                                 (GLboolean)(colorMask & ColorMask::A)));
        }

        if ((glClears & GL_DEPTH_BUFFER_BIT) && !cache->dss.depthWrite) {
            GL_CHECK(glDepthMask(false));
        }

        if (glClears & GL_STENCIL_BUFFER_BIT) {
            if (!cache->dss.stencilWriteMaskFront) {
                GL_CHECK(glStencilMaskSeparate(GL_FRONT, 0));
            }
            if (!cache->dss.stencilWriteMaskBack) {
                GL_CHECK(glStencilMaskSeparate(GL_BACK, 0));
            }
        }
    };

    const auto &attachments = _currentRenderPass->colorAttachments;
    const auto &indices = _currentRenderPass->indices;
    for (uint32_t i = 0; i < attachments.size(); ++i) {
        performLoadOp(i, indices[i]);
    }
    performDepthStencilLoadOp(_currentRenderPass->depthStencil);

    framebuffer.processLoad(GL_DRAW_FRAMEBUFFER);
}

void GLES3CommandEncoder::endRenderPass() {

    if (_currentFramebuffer->needResolve) {
        doResolve(_context, _cacheState, _currentFramebuffer);
    } else {
        auto framebuffer = FBOProxy(_currentFramebuffer->framebuffer, _context->getContextID());
        framebuffer.processStore(GL_DRAW_FRAMEBUFFER);
    }

    // no coherent support
//    if (device->constantRegistry()->mFBF == FBFSupportLevel::NON_COHERENT_EXT) {
//        GL_CHECK(glFramebufferFetchBarrierEXT());
//    } else if (device->constantRegistry()->mFBF == FBFSupportLevel::NON_COHERENT_QCOM) {
//        GL_CHECK(glFramebufferFetchBarrierQCOM());
//    }
}

void GLES3CommandEncoder::nextSubPass() {
    ++_curSubPassIdx;
}

void GLES3CommandEncoder::bindPipelineState(GLESGPUPipelineState *pso) {
    if (_currentPipelineState == pso) {
        return;
    }

    _currentPipelineState = pso;
    // bind rasterizer state
    if (_cacheState->rs.cullMode != _currentPipelineState->rs.cullMode) {
        switch (_currentPipelineState->rs.cullMode) {
            case CullMode::NONE: {
                if (_cacheState->isCullFaceEnabled) {
                    GL_CHECK(glDisable(GL_CULL_FACE));
                    _cacheState->isCullFaceEnabled = false;
                }
            } break;
            case CullMode::FRONT: {
                if (!_cacheState->isCullFaceEnabled) {
                    GL_CHECK(glEnable(GL_CULL_FACE));
                    _cacheState->isCullFaceEnabled = true;
                }
                GL_CHECK(glCullFace(GL_FRONT));
            } break;
            case CullMode::BACK: {
                if (!_cacheState->isCullFaceEnabled) {
                    GL_CHECK(glEnable(GL_CULL_FACE));
                    _cacheState->isCullFaceEnabled = true;
                }
                GL_CHECK(glCullFace(GL_BACK));
            } break;
            default:
                break;
        }
        _cacheState->rs.cullMode = _currentPipelineState->rs.cullMode;
    }
    if (_cacheState->rs.isFrontFaceCCW != _currentPipelineState->rs.isFrontFaceCCW) {
        GL_CHECK(glFrontFace(_currentPipelineState->rs.isFrontFaceCCW ? GL_CCW : GL_CW));
        _cacheState->rs.isFrontFaceCCW = _currentPipelineState->rs.isFrontFaceCCW;
    }
    if ((_cacheState->rs.depthBias != _currentPipelineState->rs.depthBias) ||
        (_cacheState->rs.depthBiasSlop != _currentPipelineState->rs.depthBiasSlop)) {
        GL_CHECK(glPolygonOffset(_cacheState->rs.depthBias, _cacheState->rs.depthBiasSlop));
        _cacheState->rs.depthBiasSlop = _currentPipelineState->rs.depthBiasSlop;
    }
    if (_cacheState->rs.lineWidth != _currentPipelineState->rs.lineWidth) {
        GL_CHECK(glLineWidth(_currentPipelineState->rs.lineWidth));
        _cacheState->rs.lineWidth = _currentPipelineState->rs.lineWidth;
    }

    // bind depth-stencil state
    if (_cacheState->dss.depthTest != _currentPipelineState->dss.depthTest) {
        if (_currentPipelineState->dss.depthTest) {
            GL_CHECK(glEnable(GL_DEPTH_TEST));
        } else {
            GL_CHECK(glDisable(GL_DEPTH_TEST));
        }
        _cacheState->dss.depthTest = _currentPipelineState->dss.depthTest;
    }
    if (_cacheState->dss.depthWrite != _currentPipelineState->dss.depthWrite) {
        GL_CHECK(glDepthMask(static_cast<bool>(_currentPipelineState->dss.depthWrite)));
        _cacheState->dss.depthWrite = _currentPipelineState->dss.depthWrite;
    }
    if (_cacheState->dss.depthFunc != _currentPipelineState->dss.depthFunc) {
        GL_CHECK(glDepthFunc(GLES3_CMP_FUNCS[(int)_currentPipelineState->dss.depthFunc]));
        _cacheState->dss.depthFunc = _currentPipelineState->dss.depthFunc;
    }

    // bind depth-stencil state - front
    if (_currentPipelineState->dss.stencilTestFront || _currentPipelineState->dss.stencilTestBack) {
        if (!_cacheState->isStencilTestEnabled) {
            GL_CHECK(glEnable(GL_STENCIL_TEST));
            _cacheState->isStencilTestEnabled = true;
        }
    } else {
        if (_cacheState->isStencilTestEnabled) {
            GL_CHECK(glDisable(GL_STENCIL_TEST));
            _cacheState->isStencilTestEnabled = false;
        }
    }
    if (_cacheState->dss.stencilFuncFront != _currentPipelineState->dss.stencilFuncFront ||
        _cacheState->dss.stencilRefFront != _currentPipelineState->dss.stencilRefFront ||
        _cacheState->dss.stencilReadMaskFront != _currentPipelineState->dss.stencilReadMaskFront) {
        GL_CHECK(glStencilFuncSeparate(GL_FRONT,
                                       GLES3_CMP_FUNCS[(int)_currentPipelineState->dss.stencilFuncFront],
                                       _currentPipelineState->dss.stencilRefFront,
                                       _currentPipelineState->dss.stencilReadMaskFront));
        _cacheState->dss.stencilFuncFront = _currentPipelineState->dss.stencilFuncFront;
        _cacheState->dss.stencilRefFront = _currentPipelineState->dss.stencilRefFront;
        _cacheState->dss.stencilReadMaskFront = _currentPipelineState->dss.stencilReadMaskFront;
    }
    if (_cacheState->dss.stencilFailOpFront != _currentPipelineState->dss.stencilFailOpFront ||
        _cacheState->dss.stencilZFailOpFront != _currentPipelineState->dss.stencilZFailOpFront ||
        _cacheState->dss.stencilPassOpFront != _currentPipelineState->dss.stencilPassOpFront) {
        GL_CHECK(glStencilOpSeparate(GL_FRONT,
                                     GLES3_STENCIL_OPS[(int)_currentPipelineState->dss.stencilFailOpFront],
                                     GLES3_STENCIL_OPS[(int)_currentPipelineState->dss.stencilZFailOpFront],
                                     GLES3_STENCIL_OPS[(int)_currentPipelineState->dss.stencilPassOpFront]));
        _cacheState->dss.stencilFailOpFront = _currentPipelineState->dss.stencilFailOpFront;
        _cacheState->dss.stencilZFailOpFront = _currentPipelineState->dss.stencilZFailOpFront;
        _cacheState->dss.stencilPassOpFront = _currentPipelineState->dss.stencilPassOpFront;
    }
    if (_cacheState->dss.stencilWriteMaskFront != _currentPipelineState->dss.stencilWriteMaskFront) {
        GL_CHECK(glStencilMaskSeparate(GL_FRONT, _currentPipelineState->dss.stencilWriteMaskFront));
        _cacheState->dss.stencilWriteMaskFront = _currentPipelineState->dss.stencilWriteMaskFront;
    }

    // bind depth-stencil state - back
    if (_cacheState->dss.stencilFuncBack != _currentPipelineState->dss.stencilFuncBack ||
        _cacheState->dss.stencilRefBack != _currentPipelineState->dss.stencilRefBack ||
        _cacheState->dss.stencilReadMaskBack != _currentPipelineState->dss.stencilReadMaskBack) {
        GL_CHECK(glStencilFuncSeparate(GL_BACK,
                                       GLES3_CMP_FUNCS[(int)_currentPipelineState->dss.stencilFuncBack],
                                       _currentPipelineState->dss.stencilRefBack,
                                       _currentPipelineState->dss.stencilReadMaskBack));
        _cacheState->dss.stencilFuncBack = _currentPipelineState->dss.stencilFuncBack;
        _cacheState->dss.stencilRefBack = _currentPipelineState->dss.stencilRefBack;
        _cacheState->dss.stencilReadMaskBack = _currentPipelineState->dss.stencilReadMaskBack;
    }
    if (_cacheState->dss.stencilFailOpBack != _currentPipelineState->dss.stencilFailOpBack ||
        _cacheState->dss.stencilZFailOpBack != _currentPipelineState->dss.stencilZFailOpBack ||
        _cacheState->dss.stencilPassOpBack != _currentPipelineState->dss.stencilPassOpBack) {
        GL_CHECK(glStencilOpSeparate(GL_BACK,
                                     GLES3_STENCIL_OPS[(int)_currentPipelineState->dss.stencilFailOpBack],
                                     GLES3_STENCIL_OPS[(int)_currentPipelineState->dss.stencilZFailOpBack],
                                     GLES3_STENCIL_OPS[(int)_currentPipelineState->dss.stencilPassOpBack]));
        _cacheState->dss.stencilFailOpBack = _currentPipelineState->dss.stencilFailOpBack;
        _cacheState->dss.stencilZFailOpBack = _currentPipelineState->dss.stencilZFailOpBack;
        _cacheState->dss.stencilPassOpBack = _currentPipelineState->dss.stencilPassOpBack;
    }
    if (_cacheState->dss.stencilWriteMaskBack != _currentPipelineState->dss.stencilWriteMaskBack) {
        GL_CHECK(glStencilMaskSeparate(GL_BACK, _currentPipelineState->dss.stencilWriteMaskBack));
        _cacheState->dss.stencilWriteMaskBack = _currentPipelineState->dss.stencilWriteMaskBack;
    }

    // bind blend state
    if (_cacheState->bs.isA2C != _currentPipelineState->bs.isA2C) {
        if (_cacheState->bs.isA2C) {
            GL_CHECK(glEnable(GL_SAMPLE_ALPHA_TO_COVERAGE));
        } else {
            GL_CHECK(glDisable(GL_SAMPLE_ALPHA_TO_COVERAGE));
        }
        _cacheState->bs.isA2C = _currentPipelineState->bs.isA2C;
    }
    if (_cacheState->bs.blendColor.x != _currentPipelineState->bs.blendColor.x ||
        _cacheState->bs.blendColor.y != _currentPipelineState->bs.blendColor.y ||
        _cacheState->bs.blendColor.z != _currentPipelineState->bs.blendColor.z ||
        _cacheState->bs.blendColor.w != _currentPipelineState->bs.blendColor.w) {
        GL_CHECK(glBlendColor(_currentPipelineState->bs.blendColor.x,
                              _currentPipelineState->bs.blendColor.y,
                              _currentPipelineState->bs.blendColor.z,
                              _currentPipelineState->bs.blendColor.w));
        _cacheState->bs.blendColor = _currentPipelineState->bs.blendColor;
    }

    if (!_currentPipelineState->bs.targets.empty()) {
        BlendTarget &cacheTarget = _cacheState->bs.targets[0];
        const BlendTarget &target = _currentPipelineState->bs.targets[0];
        if (cacheTarget.blend != target.blend) {
            if (!cacheTarget.blend) {
                GL_CHECK(glEnable(GL_BLEND));
            } else {
                GL_CHECK(glDisable(GL_BLEND));
            }
            cacheTarget.blend = target.blend;
        }
        if (cacheTarget.blendEq != target.blendEq ||
            cacheTarget.blendAlphaEq != target.blendAlphaEq) {
            GL_CHECK(glBlendEquationSeparate(GLES3_BLEND_OPS[(int)target.blendEq],
                                             GLES3_BLEND_OPS[(int)target.blendAlphaEq]));
            cacheTarget.blendEq = target.blendEq;
            cacheTarget.blendAlphaEq = target.blendAlphaEq;
        }
        if (cacheTarget.blendSrc != target.blendSrc ||
            cacheTarget.blendDst != target.blendDst ||
            cacheTarget.blendSrcAlpha != target.blendSrcAlpha ||
            cacheTarget.blendDstAlpha != target.blendDstAlpha) {
            GL_CHECK(glBlendFuncSeparate(GLES3_BLEND_FACTORS[(int)target.blendSrc],
                                         GLES3_BLEND_FACTORS[(int)target.blendDst],
                                         GLES3_BLEND_FACTORS[(int)target.blendSrcAlpha],
                                         GLES3_BLEND_FACTORS[(int)target.blendDstAlpha]));
            cacheTarget.blendSrc = target.blendSrc;
            cacheTarget.blendDst = target.blendDst;
            cacheTarget.blendSrcAlpha = target.blendSrcAlpha;
            cacheTarget.blendDstAlpha = target.blendDstAlpha;
        }
        if (cacheTarget.blendColorMask != target.blendColorMask) {
            GL_CHECK(glColorMask((GLboolean)(target.blendColorMask & ColorMask::R),
                                 (GLboolean)(target.blendColorMask & ColorMask::G),
                                 (GLboolean)(target.blendColorMask & ColorMask::B),
                                 (GLboolean)(target.blendColorMask & ColorMask::A)));
            cacheTarget.blendColorMask = target.blendColorMask;
        }
    }

    if (_currentPipelineState->gpuShader && _cacheState->glProgram != _currentPipelineState->gpuShader->glProgram) {
        GL_CHECK(glUseProgram(_currentPipelineState->gpuShader->glProgram));
        _cacheState->glProgram = _currentPipelineState->gpuShader->glProgram;
    }
}

void GLES3CommandEncoder::bindDescriptorSet(uint32_t setID, const DescriptorBindInfo &bindInfo) {
    _descriptorSets[setID] = bindInfo.descriptorSet;
    if (bindInfo.dynamicCount != 0) {
        _dynamicOffsets[setID].resize(bindInfo.dynamicCount);
        _dynamicOffsets[setID].assign(bindInfo.dynamicOffsets, bindInfo.dynamicOffsets + bindInfo.dynamicCount);
    }
}

void GLES3CommandEncoder::bindInputAssembler(GLESGPUInputAssembler *ia) {
    if (_currentIA == ia) {
        return;
    }
    _currentIA = ia;
    for (auto &&glCurrentAttribLoc : _cacheState->glCurrentAttribLocs) {
        glCurrentAttribLoc = false;
    }

    VAOProxy proxy(*_currentIA, _context->getContextID(), _currentPipelineState->inputHash);
    if (proxy.handle == 0) {
        GL_CHECK(glGenVertexArrays(1, &proxy.handle));
        GL_CHECK(glBindVertexArray(proxy.handle));
        for (auto &gpuInput : _currentPipelineState->attributes) {
            for (size_t a = 0; a < _currentIA->attributes.size(); ++a) {
                const GLESGPUAttribute &gpuAttribute = _currentIA->glAttribs[a];
                if (gpuAttribute.name == gpuInput.name) {
                    GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, gpuAttribute.glBuffer));

                    for (uint32_t c = 0; c < gpuAttribute.componentCount; ++c) {
                        GLuint const glLoc = gpuInput.glLoc + c;
                        uint32_t const attribOffset = gpuAttribute.offset + gpuAttribute.size * c;
                        GL_CHECK(glEnableVertexAttribArray(glLoc));
                        GL_CHECK(glVertexAttribPointer(glLoc, gpuAttribute.count, gpuAttribute.glType, gpuAttribute.isNormalized, gpuAttribute.stride, BUFFER_OFFSET(attribOffset)));
                        GL_CHECK(glVertexAttribDivisor(glLoc, gpuAttribute.isInstanced ? 1 : 0));
                        _cacheState->glCurrentAttribLocs[glLoc] = true;
                        _cacheState->glEnabledAttribLocs[glLoc] = true;
                    }
                    break;
                }
            }
        }

        if (_currentIA->gpuIndexBuffer) {
            GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _currentIA->gpuIndexBuffer->gpuBuffer->glBuffer));
        }

        for (uint32_t a = 0; a < _cacheState->glCurrentAttribLocs.size(); ++a) {
            if (_cacheState->glEnabledAttribLocs[a] != _cacheState->glCurrentAttribLocs[a]) {
                GL_CHECK(glDisableVertexAttribArray(a));
                _cacheState->glEnabledAttribLocs[a] = false;
            }
        }
    } else {
        GL_CHECK(glBindVertexArray(proxy.handle));
    }
}

void GLES3CommandEncoder::setViewport(const Viewport &vp) {
    if (_cacheState->viewport != vp) {
        _cacheState->viewport = vp;
        GL_CHECK(glViewport(vp.left, vp.top, vp.width, vp.height));
    }
}

void GLES3CommandEncoder::setScissor(const Rect &rect) {
    if (_cacheState->scissor != rect) {
        _cacheState->scissor = rect;
        GL_CHECK(glScissor(rect.x, rect.y, rect.width, rect.height));
    }
}

void GLES3CommandEncoder::setLineWidth(float width) {
    if (math::isNotEqualF(_curDynamicStates.lineWidth, width)) {
        _curDynamicStates.lineWidth = width;
    }
}

void GLES3CommandEncoder::setDepthBias(float constant, float clamp, float slope) {
    if (math::isNotEqualF(_curDynamicStates.depthBiasConstant, constant) ||
        math::isNotEqualF(_curDynamicStates.depthBiasClamp, clamp) ||
        math::isNotEqualF(_curDynamicStates.depthBiasSlope, slope)) {
        _curDynamicStates.depthBiasConstant = constant;
        _curDynamicStates.depthBiasClamp = clamp;
        _curDynamicStates.depthBiasSlope = slope;
    }
}

void GLES3CommandEncoder::setBlendConstants(const Color &constants) {
    if (math::isNotEqualF(_curDynamicStates.blendConstant.x, constants.x) ||
        math::isNotEqualF(_curDynamicStates.blendConstant.y, constants.y) ||
        math::isNotEqualF(_curDynamicStates.blendConstant.z, constants.z) ||
        math::isNotEqualF(_curDynamicStates.blendConstant.w, constants.w)) {
        _curDynamicStates.blendConstant.x = constants.x;
        _curDynamicStates.blendConstant.y = constants.y;
        _curDynamicStates.blendConstant.z = constants.z;
        _curDynamicStates.blendConstant.w = constants.w;
    }
}

void GLES3CommandEncoder::setDepthBound(float minBounds, float maxBounds) {
    if (math::isNotEqualF(_curDynamicStates.depthMinBounds, minBounds) ||
        math::isNotEqualF(_curDynamicStates.depthMaxBounds, maxBounds)) {
        _curDynamicStates.depthMinBounds = minBounds;
        _curDynamicStates.depthMaxBounds = maxBounds;
    }
}

void GLES3CommandEncoder::setStencilWriteMask(StencilFace face, uint32_t mask) {
    auto update = [&](DynamicStencilStates &stencilState) {
        if (stencilState.writeMask != mask) {
            stencilState.writeMask = mask;
        }
    };
    if (hasFlag(face, StencilFace::FRONT)) update(_curDynamicStates.stencilStatesFront);
    if (hasFlag(face, StencilFace::BACK)) update(_curDynamicStates.stencilStatesBack);
}

void GLES3CommandEncoder::setStencilCompareMask(StencilFace face, uint32_t ref, uint32_t mask) {
    auto update = [&](DynamicStencilStates &stencilState) {
        if ((stencilState.reference != ref) ||
            (stencilState.compareMask != mask)) {
            stencilState.reference = ref;
            stencilState.compareMask = mask;
        }
    };
    if (hasFlag(face, StencilFace::FRONT)) update(_curDynamicStates.stencilStatesFront);
    if (hasFlag(face, StencilFace::BACK)) update(_curDynamicStates.stencilStatesBack);
}

void GLES3CommandEncoder::bindDescriptorSets() {
    auto setCount = _currentPipelineState->gpuPipelineLayout->setLayouts.size();
    for (uint32_t setID = 0; setID < setCount; ++setID) {
        uint32_t dynamicIndex = 0;
        uint32_t descriptorIndex = 0;

        const auto &dynamics = _dynamicOffsets[setID];
        auto *descriptorSet = _descriptorSets[setID];
        if (descriptorSet == nullptr) {
            continue;
        }

        auto *descriptorSetLayout = _currentPipelineState->gpuPipelineLayout->setLayouts[setID].get();
        for (auto &binding : descriptorSetLayout->bindings) {
            auto offsetToPipelineLayout = _currentPipelineState->descriptorOffsets[setID];

            const uint32_t *dynamicOffsetPtr = nullptr;
            if (isDynamicBuffer(binding.type) && dynamicIndex + binding.count <= dynamics.size()) {
                dynamicOffsetPtr = &dynamics[dynamicIndex];
                dynamicIndex += binding.count;
            }

            auto *descriptorIndexBase = &_currentPipelineState->descriptorIndices[descriptorIndex + offsetToPipelineLayout];
            auto *descriptorBase = &descriptorSet->gpuDescriptors[descriptorIndex];

            descriptorIndex += binding.count;
            if (descriptorIndexBase->binding == INVALID_BINDING) {
                continue;
            }
            for (uint32_t i = 0; i < binding.count; ++i) {
                auto &descriptor = descriptorBase[i];
                auto &index = descriptorIndexBase[i];
                if (isBufferType(binding.type) && checkBuffer(descriptor)) {
                    uint32_t const offset = descriptor.gpuBufferView->offset + (dynamicOffsetPtr != nullptr ? dynamicOffsetPtr[i] : 0);
                    GL_CHECK(glBindBufferRange(getBufferTarget(binding.type), index.binding,
                                               descriptor.gpuBufferView->gpuBuffer->glBuffer,
                                               offset,
                                               descriptor.gpuBufferView->range));
                } else if (checkTexture(descriptor)) {
                    GL_CHECK(glActiveTexture(GL_TEXTURE0 + index.unit));
                    GL_CHECK(glBindTexture(descriptor.gpuTextureView->texture->glTarget, descriptor.gpuTextureView->texture->glTexture));
                    GL_CHECK(glBindSampler(index.unit, descriptor.gpuSampler->glSampler));
                }
            }
        }
    }
}

void GLES3CommandEncoder::draw(const DrawInfo &drawInfo) {
    if (_currentPipelineState == nullptr) {
        return;
    }

    const auto glPrimitive = _currentPipelineState->glPrimitive;
    if (_currentIA == nullptr || _currentPipelineState == nullptr) {
        return;
    }

    bindDescriptorSets();

    if (_currentIA->gpuIndexBuffer) {
        if (drawInfo.indexCount > 0) {
            uint8_t *offset = nullptr;
            offset += static_cast<size_t>(drawInfo.firstIndex * _currentIA->gpuIndexBuffer->stride);
            if (drawInfo.instanceCount == 0) {
                GL_CHECK(glDrawElements(glPrimitive, drawInfo.indexCount, _currentIA->glIndexType, offset));
            } else {
                GL_CHECK(glDrawElementsInstanced(glPrimitive, drawInfo.indexCount, _currentIA->glIndexType, offset, drawInfo.instanceCount));
            }
        }
    } else if (drawInfo.vertexCount > 0) {
        if (drawInfo.instanceCount == 0) {
            GL_CHECK(glDrawArrays(glPrimitive, drawInfo.firstVertex, drawInfo.vertexCount));
        } else {
            GL_CHECK(glDrawArraysInstanced(glPrimitive, drawInfo.firstVertex, drawInfo.vertexCount, drawInfo.instanceCount));
        }
    }
}

void GLES3CommandEncoder::drawIndirect() {

}

void GLES3CommandEncoder::drawIndexedIndirect() {

}

void GLES3CommandEncoder::dispatch(uint32_t x, uint32_t y, uint32_t z) {
    if (_currentPipelineState == nullptr) {
        return;
    }

    bindDescriptorSets();
    GL_CHECK(glDispatchCompute(x, y, z));
}

void GLES3CommandEncoder::dispatchIndirect(GLESGPUBuffer *buffer, uint32_t offset) {
    GL_CHECK(glBindBuffer(GL_DISPATCH_INDIRECT_BUFFER, buffer->glBuffer));
    GL_CHECK(glDispatchComputeIndirect(offset));
    GL_CHECK(glBindBuffer(GL_DISPATCH_INDIRECT_BUFFER, 0));
}

void GLES3CommandEncoder::updateBuffer(GLESGPUBuffer *buffer, const void *data, uint32_t size) {
    cmdFuncGLES3UpdateBuffer(GLESDevice::getInstance(), buffer, data, 0, size, true, true);
}

void GLES3CommandEncoder::begin(GLESGPUFence *waitFence) {
//    if (waitFence != nullptr && waitFence->sync != nullptr) {
//        glesWaitFence(GLESDevice::getInstance(), waitFence, UINT64_MAX, true);
//        glesDestroyFence(GLESDevice::getInstance(), waitFence);
//    }
}

void GLES3CommandEncoder::end(GLESGPUFence *signalFence) {
//    if (signalFence != nullptr) {
//        glesCreateFence(GLESDevice::getInstance(), signalFence);
//    }
}

void GLES3CommandEncoder::attachContext(egl::Context *context, GLESGPUStateCache *cacheState) {
    _context = context;
    _cacheState = cacheState;
}
} // namespace cc::gfx
