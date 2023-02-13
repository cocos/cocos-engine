#include "GLESCommands.h"
#include "base/Utils.h"
#include "GLESConversion.h"
#include "GLESCore.h"

namespace cc::gfx::gles {

static void setEnable(bool status, GLenum flag) {
    if (status) {
        GL_CHECK(glEnable(flag));
    } else {
        GL_CHECK(glDisable(flag));
    }
}

static GLenum getBufferTarget(DescriptorType type) {
    switch (type) {
        case DescriptorType::STORAGE_BUFFER:
        case DescriptorType::DYNAMIC_STORAGE_BUFFER:
            return GL_SHADER_STORAGE_BUFFER;
        case DescriptorType::UNIFORM_BUFFER:
        case DescriptorType::DYNAMIC_UNIFORM_BUFFER:
            return GL_UNIFORM_BUFFER;
    }
    return 0;
}

static bool checkBuffer(const Descriptor &desc) {
    return desc.buffer && desc.buffer->buffer && desc.buffer->buffer->bufferId != 0 && desc.buffer->range != 0;
}

static bool checkTexture(const Descriptor& desc) {
    return desc.texture && desc.texture->texture && desc.texture->texture->texId != 0;
}

void Commands::bindPipelineState(const IntrusivePtr<GPUPipelineState> &pso) {
    if (_context->program != pso->shader->program) {
        _context->program = pso->shader->program;
        GL_CHECK(glUseProgram(_context->program));
    }
    auto error = glGetError();
    // depth
    setDepthStencil(pso->depthStencilState);

    // rasterizer
    setRasterizerState(pso->rasterizerState);

    // blend
    setBlendState(pso->blendState);

    // pipeline layout
    _currentPso = pso;
    if (_currentPso->layout) {
        _boundSets.resize(_currentPso->layout->setLayouts.size());
    }
}

void Commands::bindDescriptorSet(uint32_t set, const DescriptorBindInfo &bindInfo) {
    if (set >= _boundSets.size()) {
        return;
    }
    _boundSets[set] = bindInfo;
    auto *descriptorSetLayout = _currentPso->layout->setLayouts[set].get();
    for (auto &binding : descriptorSetLayout->bindings) {
        auto offsetToSet = descriptorSetLayout->bindingMap[binding.binding];
        auto offsetToPipelineLayout = _currentPso->descriptorOffsets[set];


        auto *descriptorIndexBase = &_currentPso->descriptors[offsetToSet + offsetToPipelineLayout];
        auto *descriptorBase = &_boundSets[set].descriptorSet->descriptors[offsetToSet];

        for (uint32_t i = 0; i < binding.count; ++i) {
            auto &descriptor = descriptorBase[i];
            auto &descriptorIndex  = descriptorIndexBase[i];
            if (isBufferType(binding.type) && checkBuffer(descriptor)) {
                GL_CHECK(glBindBufferRange(getBufferTarget(binding.type), descriptorIndex.binding,
                                  descriptor.buffer->buffer->bufferId,
                                  descriptor.buffer->offset,
                                  descriptor.buffer->range));
            } else if (checkTexture(descriptor)) {
                GL_CHECK(glActiveTexture(GL_TEXTURE0 + descriptorIndex.unit));
                GL_CHECK(glBindTexture(descriptor.texture->texture->target, descriptor.texture->texture->texId));
                GL_CHECK(glBindSampler(descriptorIndex.unit, descriptor.sampler->samplerId));
            }
        }
    }
}

void Commands::beginPassInternal() {
    CC_ASSERT(_subPassIndex < _currentFb->fboList.size());
    auto &fb = _currentFb->fboList[_subPassIndex];

    // if surface changed, need to make current. [multi-window support]
    if (fb.surface != EGL_NO_SURFACE && _context->eglContext->getCurrentSurface() != fb.surface) {
        _context->eglContext->makeCurrent(fb.surface);
    }
    if (_context->drawBuffer != fb.fbo) {
        GL_CHECK(glBindFramebuffer(GL_DRAW_FRAMEBUFFER, fb.fbo));
        _context->drawBuffer = fb.fbo;
    }

    /**
     * glInvalidateFramebuffer
     *
     * If a framebuffer object is bound, then attachments may contain:
     *     GL_COLOR_ATTACHMENTi, GL_DEPTH_ATTACHMENT, GL_STENCIL_ATTACHMENT, GL_DEPTH_STENCIL_ATTACHMENT
     *
     * If the default framebuffer is bound, then attachments may contain:
     *     GL_COLOR, GL_DEPTH, GL_STENCIL
     */
    GLbitfield clearBit = 0;
    auto attachmentFunc = [this, &clearBit](const Attachment &attachment, uint32_t index) {
        bool hasDepth = GFX_FORMAT_INFOS[toNumber(attachment.format)].hasDepth;
        bool hasStencil = GFX_FORMAT_INFOS[toNumber(attachment.format)].hasStencil;
        bool isColor = !(hasDepth || hasStencil);
        bool isDefaultFb = _context->drawBuffer == 0;

        if (attachment.loadOp == LoadOp::DISCARD) {
            if (hasDepth) {
                _invalidAttachments.emplace_back(isDefaultFb ? GL_DEPTH : GL_DEPTH_ATTACHMENT);
            }
            if (isColor) {
                _invalidAttachments.emplace_back(isDefaultFb ? GL_COLOR : GL_COLOR_ATTACHMENT0 + index);
            }
        } else if (attachment.loadOp == LoadOp::CLEAR) {
            if (isColor) {
                auto &clearColor = _clearColors[index];
                GL_CHECK(glClearBufferfv(GL_COLOR, index, reinterpret_cast<GLfloat *>(&clearColor)));
            }
            if (hasDepth) {
                if (_context->ds.depth.depthWrite != true) {
                    GL_CHECK(glDepthMask(true));
                    _context->ds.depth.depthWrite = true;
                }
                GL_CHECK(glClearDepthf(_clearDepth));
                clearBit |= GL_DEPTH_BUFFER_BIT;
            }
        }

        if (hasStencil) {
            if (attachment.stencilLoadOp == LoadOp::DISCARD) {
                _invalidAttachments.emplace_back(isDefaultFb ? GL_STENCIL : GL_STENCIL_ATTACHMENT);
            } else if (attachment.stencilLoadOp == LoadOp::CLEAR) {
                if (_context->ds.front.writemask != 0xffffffff) {
                    GL_CHECK(glStencilMaskSeparate(GL_FRONT, 0xffffffff));
                    _context->ds.front.writemask = 0xffffffff;
                }
                if (_context->ds.back.writemask != 0xffffffff) {
                    GL_CHECK(glStencilMaskSeparate(GL_BACK, 0xffffffff));
                    _context->ds.back.writemask = 0xffffffff;
                }
                GL_CHECK(glClearStencil(_clearStencil));
                clearBit |= GL_STENCIL_BUFFER_BIT;
            }
        }
    };

    // perform attachment load op
    auto &renderPass = _currentFb->renderPass;
    auto &subPass = renderPass->subPasses[_subPassIndex];
    for (uint32_t i = 0; i < subPass.colors.size(); ++i) {
        auto color = subPass.colors[i];
        auto &attachment = renderPass->attachments[color];
        attachmentFunc(attachment, color);
    }
    if (subPass.depthStencil != INVALID_BINDING) {
        attachmentFunc(renderPass->attachments[subPass.depthStencil], 0);
    }
    if (clearBit != 0) {
        glClear(GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);
    }

    if (!_invalidAttachments.empty()) {
        GL_CHECK(glInvalidateFramebuffer(GL_DRAW_FRAMEBUFFER, utils::toUint(_invalidAttachments.size()), _invalidAttachments.data()));
        _invalidAttachments.clear();
    }
}

void Commands::endPassInternal() {
    CC_ASSERT(_subPassIndex < _currentFb->fboList.size());
    auto &fb = _currentFb->fboList[_subPassIndex];

    // store op
    auto attachmentFunc = [this](const Attachment &attachment, uint32_t index) {
        bool hasDepth = GFX_FORMAT_INFOS[toNumber(attachment.format)].hasDepth;
        bool hasStencil = GFX_FORMAT_INFOS[toNumber(attachment.format)].hasStencil;
        bool isColor = !(hasDepth || hasStencil);
        bool isDefaultFb = _context->drawBuffer == 0;

        if (attachment.storeOp == StoreOp::DISCARD) {
            if (hasDepth) {
                _invalidAttachments.emplace_back(isDefaultFb ? GL_DEPTH : GL_DEPTH_ATTACHMENT);
            }
            if (isColor) {
                _invalidAttachments.emplace_back(isDefaultFb ? GL_COLOR : GL_COLOR_ATTACHMENT0 + index);
            }
        }

        if (hasStencil && attachment.stencilStoreOp == StoreOp::DISCARD) {
            _invalidAttachments.emplace_back(isDefaultFb ? GL_STENCIL : GL_STENCIL_ATTACHMENT);
        }
    };

    // perform attachment store op
    auto &renderPass = _currentFb->renderPass;
    auto &subPass = renderPass->subPasses[_subPassIndex];
    for (uint32_t i = 0; i < subPass.colors.size(); ++i) {
        auto color = subPass.colors[i];
        auto &attachment = renderPass->attachments[color];
        attachmentFunc(attachment, color);
    }
    if (subPass.depthStencil != INVALID_BINDING) {
        attachmentFunc(renderPass->attachments[subPass.depthStencil], 0);
    }

    if (!_invalidAttachments.empty()) {
        // GL_CHECK(glInvalidateFramebuffer(GL_DRAW_FRAMEBUFFER, utils::toUint(_invalidAttachments.size()), _invalidAttachments.data()));
        _invalidAttachments.clear();
    }
}

void Commands::beginRenderPass(const PassBeginInfo &beginInfo) {
    _currentFb    = beginInfo.framebuffer;
    _subPassIndex = 0;
    _clearColors  = beginInfo.clearColors;
    _clearDepth   = beginInfo.clearDepth;
    _clearStencil = static_cast<GLint>(beginInfo.clearStencil);

    auto &currentVp = _context->viewport;
    auto &renderArea = beginInfo.renderArea;
    setViewport(Viewport{renderArea.x, renderArea.y, renderArea.width, renderArea.height, currentVp.minDepth, currentVp.maxDepth});
    setScissor(renderArea);

    beginPassInternal();
}

void Commands::endRenderPass() {
    endPassInternal();

    GL_CHECK(glBindFramebuffer(GL_DRAW_FRAMEBUFFER, 0));
    _context->drawBuffer = 0;
    _currentFb = nullptr;
}

void Commands::nextSubpass() {
    endPassInternal();
    ++_subPassIndex;
    beginPassInternal();
}

void Commands::bindInputAssembler(const IntrusivePtr<GPUInputAssembler> &ia) {
    _currentIa = ia;

    uint32_t currentBuffer = 0;
    for (auto &glAttr : ia->attributes) {
        auto &view = ia->vertexBuffers[glAttr.stream];
        auto iter = _currentPso->nameLocMap.find(glAttr.name);
        if (iter == _currentPso->nameLocMap.end() || iter->second == -1) {
            continue;
        }

        if (view->buffer->bufferId != currentBuffer) {
            currentBuffer = view->buffer->bufferId;
            GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, currentBuffer));
        }

        GL_CHECK(glVertexAttribPointer(iter->second, glAttr.count, glAttr.type, glAttr.isNormalized, glAttr.stride, glAttr.offset));
        GL_CHECK(glVertexAttribDivisor(iter->second, glAttr.divisor));
        GL_CHECK(glEnableVertexAttribArray(iter->second));
    }

    if (ia->indexBuffer) {
        GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ia->indexBuffer->buffer->bufferId));
    }
}

void Commands::draw(const DrawInfo &drawInfo) {
    if (_currentIa) {
        if (_currentIa->indexBuffer && drawInfo.indexCount > 0) { // draw indexed
            uint8_t *offset = nullptr;
            offset += drawInfo.firstIndex * _currentIa->indexBuffer->buffer->stride;
            if (drawInfo.instanceCount == 0) {
                GL_CHECK(glDrawElements(_context->primitive, drawInfo.indexCount, _currentIa->indexType, offset));
            } else {
                GL_CHECK(glDrawElementsInstanced(_context->primitive, drawInfo.indexCount, _currentIa->indexType, offset, drawInfo.instanceCount));
            }
        } else if (drawInfo.vertexCount > 0) { // draw linear
            if (drawInfo.instanceCount == 0) {
                GL_CHECK(glDrawArrays(_context->primitive, drawInfo.firstVertex, drawInfo.vertexCount));
            } else {
                GL_CHECK(glDrawArraysInstanced(_context->primitive, drawInfo.firstVertex, drawInfo.vertexCount, drawInfo.instanceCount));
            }
        }
    }
}

void Commands::setViewport(const Viewport &vp) {
    auto &currentVp = _context->viewport;
    if (memcmp(&currentVp, &vp, sizeof(Viewport)) != 0) {
        glViewport(vp.left, vp.top, vp.width, vp.height);
        glDepthRangef(vp.minDepth, vp.maxDepth);
        currentVp = vp;
    }
}

void Commands::setScissor(const Rect &rect) {
    auto &currentSc = _context->scissor;
    if (memcmp(&currentSc, &rect, sizeof(Rect)) == 0) {
        glScissor(rect.x, rect.y, rect.width, rect.height);
        currentSc = rect;
    }
}

void Commands::setRasterizerState(const RasterizerState &rs) {
    auto &currentRs = _context->rs;
    if (currentRs.cullingEn != rs.cullingEn) {
        setEnable(rs.cullingEn, GL_CULL_FACE);
        currentRs.cullingEn = rs.cullingEn;
    }

    if (rs.cullingEn) {
        if (currentRs.cullFace != rs.cullFace) {
            GL_CHECK(glCullFace(rs.cullFace));
            currentRs.cullFace = rs.cullFace;
        }
    }

    if (currentRs.frontFace != rs.frontFace) {
        GL_CHECK(glFrontFace(rs.frontFace));
        currentRs.frontFace = rs.frontFace;
    }

    setDepthBias(rs.depthBias, 0, rs.depthBiasSlop);
    setLineWidth(rs.lineWidth);
}

void Commands::setLineWidth(float width) {
    if (_context->rs.lineWidth != width) {
        glLineWidth(width);
        _context->rs.lineWidth = width;
    }
}

void Commands::setDepthBias(float constant, float clamp, float slope) {
    std::ignore = clamp;
    if (_context->rs.depthBias != constant || _context->rs.depthBiasSlop != slope) {
        glPolygonOffset(constant, slope);
        _context->rs.depthBias = constant;
        _context->rs.depthBiasSlop = slope;
    }
}

void Commands::setDepthStencil(const DepthStencilState &ds) {
    auto &currentDS = _context->ds.depth;
    if (currentDS.depthTest != ds.depth.depthTest) {
        setEnable(ds.depth.depthTest, GL_DEPTH_TEST);
        currentDS.depthTest = ds.depth.depthTest;
    }

    if (currentDS.depthWrite != ds.depth.depthWrite) {
        GL_CHECK(glDepthMask(ds.depth.depthWrite));
        currentDS.depthWrite = ds.depth.depthWrite;
    }

    if (currentDS.depthFunc != ds.depth.depthFunc) {
        GL_CHECK(glDepthFunc(ds.depth.depthFunc));
        currentDS.depthFunc = ds.depth.depthFunc;
    }

    setDepthBound(ds.depth.minDepth, ds.depth.maxDepth);

    if (_context->ds.stencilTest != ds.stencilTest) {
        setEnable(ds.stencilTest, GL_STENCIL_TEST);
        _context->ds.stencilTest = ds.stencilTest;
    }

    // front
    setStencilFunc(StencilFace::FRONT, ds.front.func, ds.front.reference, ds.front.readMask);
    setStencilWriteMask(StencilFace::FRONT, ds.front.writemask);

    // back
    setStencilFunc(StencilFace::BACK, ds.back.func, ds.back.reference, ds.back.readMask);
    setStencilWriteMask(StencilFace::BACK, ds.back.writemask);
}

void Commands::setBlendConstants(const Color &constants) {
    auto &color = _context->bs.color;
    if (memcmp(&color, &constants, sizeof(Color))) {
        glBlendColor(constants.x, constants.y, constants.z, constants.w);
        color = constants;
    }
}

void Commands::setBlendState(const BlendState &bs) {
    auto &currentBs = _context->bs;
    if (currentBs.isA2C != bs.isA2C) {
        setEnable(bs.isA2C, GL_SAMPLE_ALPHA_TO_COVERAGE);
        currentBs.isA2C = bs.isA2C;
    }
    setBlendConstants(bs.color);

    if (bs.hasColor) {
        if (currentBs.target.blendEnable != bs.target.blendEnable) {
            setEnable(bs.target.blendEnable, GL_BLEND);
            currentBs.target.blendEnable = bs.target.blendEnable;
        }
        if (currentBs.target.writeMask != bs.target.writeMask) {
            GL_CHECK(glColorMask(bs.target.writeMask & 0x01, bs.target.writeMask & 0x02, bs.target.writeMask & 0x04, bs.target.writeMask & 0x08));
            currentBs.target.writeMask = bs.target.writeMask;
        }
        if (currentBs.target.blendOp != bs.target.blendOp ||
            currentBs.target.blendAlphaOp != bs.target.blendAlphaOp) {
            GL_CHECK(glBlendEquationSeparate(bs.target.blendOp, bs.target.blendAlphaOp));
            currentBs.target.blendOp = bs.target.blendOp;
            currentBs.target.blendAlphaOp = bs.target.blendAlphaOp;
        }
        if (currentBs.target.blendSrc != bs.target.blendSrc ||
            currentBs.target.blendDst != bs.target.blendDst ||
            currentBs.target.blendSrcAlpha != bs.target.blendSrcAlpha ||
            currentBs.target.blendDstAlpha != bs.target.blendDstAlpha) {
            GL_CHECK(glBlendFuncSeparate(bs.target.blendSrc, bs.target.blendDst, bs.target.blendSrcAlpha, bs.target.blendDstAlpha));
            currentBs.target.blendSrc      = bs.target.blendSrc;
            currentBs.target.blendDst      = bs.target.blendDst;
            currentBs.target.blendSrcAlpha = bs.target.blendSrcAlpha;
            currentBs.target.blendDstAlpha = bs.target.blendDstAlpha;
        }
    }
}

void Commands::setDepthBound(float minBounds, float maxBounds) {
    if (_context->ds.depth.minDepth != minBounds || _context->ds.depth.maxDepth != maxBounds) {
        glDepthRangef(minBounds, maxBounds);
        _context->ds.depth.minDepth = minBounds;
        _context->ds.depth.maxDepth = maxBounds;
    }
}

void Commands::setStencilWriteMask(StencilFace face, uint32_t mask) {
    auto stencilFn = [](StencilState &state, GLenum face, uint32_t mask) {
        if (state.writemask != mask) {
            glStencilMaskSeparate(face, mask);
            state.writemask = mask;
        }
    };

    if (hasFlag(face, StencilFace::FRONT)) {
        stencilFn(_context->ds.front, GL_FRONT, mask);
    }
    if (hasFlag(face, StencilFace::BACK)) {
        stencilFn(_context->ds.back, GL_BACK, mask);
    }
}

void Commands::setStencilCompareMask(StencilFace face, uint32_t ref, uint32_t mask) {
    auto stencilFn = [](StencilState &state, GLenum face, uint32_t ref, uint32_t mask) {
        if (state.readMask != mask || state.reference != ref) {
            glStencilFuncSeparate(face, state.func, ref, mask);
            state.readMask = mask;
            state.reference = ref;
        }
    };
    if (hasFlag(face, StencilFace::FRONT)) {
        stencilFn(_context->ds.front, GL_FRONT, ref, mask);
    }
    if (hasFlag(face, StencilFace::BACK)) {
        stencilFn(_context->ds.back, GL_BACK, ref, mask);
    }
}

void Commands::setStencilFunc(StencilFace face, GLenum func, uint32_t ref, uint32_t mask) {
    auto stencilFn = [](StencilState &state, GLenum face, GLenum func, uint32_t ref, uint32_t mask) {
        if (state.readMask != mask || state.reference != ref || state.func != func) {
            glStencilFuncSeparate(face, func, ref, mask);
            state.readMask = mask;
            state.reference = ref;
            state.func = func;
        }
    };
    if (hasFlag(face, StencilFace::FRONT)) {
        stencilFn(_context->ds.front, GL_FRONT, func, ref, mask);
    }
    if (hasFlag(face, StencilFace::BACK)) {
        stencilFn(_context->ds.back, GL_BACK, func, ref, mask);
    }
}

void Commands::dispatch(uint32_t groupX, uint32_t groupY, uint32_t groupZ) {
    GL_CHECK(glDispatchCompute(groupX, groupY, groupZ));
}

void Commands::updateBuffer(const IntrusivePtr<GPUBufferView> &buffer, uint8_t *ptr, uint32_t size) {

}

} // namespace cc::gfx::gles
