#include "GLESFramebuffer.h"
#include "GLESRenderPass.h"

namespace cc::gfx::gles {

static void checkComplete() {
    GLenum status;
    GL_CHECK(status = glCheckFramebufferStatus(GL_DRAW_FRAMEBUFFER));
    if (status != GL_FRAMEBUFFER_COMPLETE) {
        switch (status) {
            case GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                break;
            case GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                break;
            case GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                break;
            case GL_FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
                break;
            case GL_FRAMEBUFFER_UNSUPPORTED:
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_UNSUPPORTED");
                break;
            default:
                CC_LOG_ERROR("checkFramebufferStatus() - %x", status);
                break;
        }
    }
}

Framebuffer::Framebuffer() {
    _typedID = generateObjectID<decltype(this)>();
}

Framebuffer::~Framebuffer() {
    destroy();
}

void Framebuffer::doInit(const FramebufferInfo &info) {
    _gpuFramebuffer = ccnew GPUFramebuffer();
    _gpuFramebuffer->renderPass = static_cast<RenderPass *>(info.renderPass)->getGPURenderPass();
    _gpuFramebuffer->attachments.reserve(info.colorTextures.size() + 1); // reserve separate depth stencil
    for (const auto &color : info.colorTextures) {
        _gpuFramebuffer->attachments.emplace_back(static_cast<Texture *>(color)->getGPUTextureView());
    }
    if (info.depthStencilTexture) {
        _gpuFramebuffer->attachments.emplace_back(static_cast<Texture *>(info.depthStencilTexture)->getGPUTextureView());
    }

    _gpuFramebuffer->initFramebuffer();
}

void Framebuffer::doDestroy() {
    _gpuFramebuffer = nullptr;
}

GPUFramebuffer::~GPUFramebuffer() {
    for (auto &handle : fboList) {
        glDeleteFramebuffers(1, &handle.fbo);
    }
}

void GPUFramebuffer::initFramebuffer() {
    const auto &subPasses = renderPass->subPasses;
    const auto &attachmentDescList = renderPass->attachments;

    // create framebuffer
    fboList.resize(subPasses.size());
    ccstd::vector<GLenum> drawBuffers(subPasses.size());

    for (uint32_t i = 0; i < subPasses.size(); ++i) {
        const auto &subPass = subPasses[i];
        FBHandle &handle = fboList[i];

        // check swapChain, if tex handle is surface. framebuffer is default fb0
        auto findSwapChain = [this, &handle](const IndexList &list) {
            return std::find_if(list.begin(), list.end(), [this, &handle](uint32_t index) {
               handle.surface = attachments[index]->texture->surface;
               return handle.surface != EGL_NO_SURFACE;
            }) != list.end();
        };
        if (findSwapChain(subPass.colors) || findSwapChain(subPass.resolves)) {
            // ignore if swapChain only has depth stencil.
            continue;
        }

        GL_CHECK(glGenFramebuffers(1, &handle.fbo));
        GL_CHECK(glBindFramebuffer(GL_DRAW_FRAMEBUFFER, handle.fbo));

        // color attachments
        for (uint32_t j = 0; j < subPass.colors.size(); ++j) {
            auto &view = attachments[subPass.colors[j]];
            if (view->texture->isRenderBuffer) {
                GL_CHECK(glFramebufferRenderbuffer(GL_DRAW_FRAMEBUFFER, static_cast<GLenum>(GL_COLOR_ATTACHMENT0 + j),
                                                   view->texture->target, view->texture->texId));
            } else {
                GL_CHECK(glFramebufferTexture2D(GL_DRAW_FRAMEBUFFER, static_cast<GLenum>(GL_COLOR_ATTACHMENT0 + j),
                                                view->texture->target, view->texture->texId, view->baseLevel));
            }
            drawBuffers[i] = static_cast<GLenum>(GL_COLOR_ATTACHMENT0 + j);
        }
        GL_CHECK(glDrawBuffers(static_cast<uint32_t>(drawBuffers.size()), drawBuffers.data()));

        // depth stencil attachments
        if (subPass.depthStencil != INVALID_BINDING && subPass.depthStencil < attachments.size()) {
            bool hasStencil = GFX_FORMAT_INFOS[static_cast<int>(attachmentDescList[subPass.depthStencil].format)].hasStencil;
            auto &view = attachments[subPass.depthStencil];
            GLenum glAttachment = hasStencil ? GL_DEPTH_STENCIL_ATTACHMENT : GL_DEPTH_ATTACHMENT;
            if (view->texture->isRenderBuffer) {
                GL_CHECK(glFramebufferRenderbuffer(GL_DRAW_FRAMEBUFFER, glAttachment, view->texture->target, view->texture->texId));
            } else {
                GL_CHECK(glFramebufferTexture2D(GL_DRAW_FRAMEBUFFER, glAttachment, view->texture->target, view->texture->texId, view->baseLevel));
            }
        }
        checkComplete();
    }

    glBindFramebuffer(GL_DRAW_FRAMEBUFFER, 0);
}

} // namespace cc::gfx::gles
