#include "GLES3Commands.h"
#include "base/StringUtil.h"
#include "gfx-gles-common/egl/Debug.h"
#include "gfx-gles-common/loader/gles3w.h"

#include "gfx-gles-common/common/GLESDevice.h"
#include "gfx-gles-common/common/GLESPipelineState.h"

namespace cc::gfx {

#include "GLES3Types.inl"


namespace {
constexpr GLenum DFT_BUF_TARGET = GL_ARRAY_BUFFER;

void uploadBufferData(GLESGPUBuffer *gpuBuffer, GLintptr offset, GLsizeiptr length, const void *buffer, bool useMap, bool sync) {
    GL_CHECK(glBindBuffer(DFT_BUF_TARGET, gpuBuffer->glBuffer));

    if (!useMap) {
        GL_CHECK(glBufferSubData(DFT_BUF_TARGET, offset, length, buffer));
    } else {
        void *dst = nullptr;
        const auto mapBits = sync ? GL_MAP_WRITE_BIT | GL_MAP_INVALIDATE_BUFFER_BIT :
                GL_MAP_WRITE_BIT | GL_MAP_INVALIDATE_BUFFER_BIT | GL_MAP_UNSYNCHRONIZED_BIT;
        GL_CHECK(dst = glMapBufferRange(DFT_BUF_TARGET, offset, length, mapBits));
        if (!dst) {
            GL_CHECK(glBufferSubData(DFT_BUF_TARGET, offset, length, buffer));
            return;
        }
        memcpy(dst, buffer, length);
        GL_CHECK(glUnmapBuffer(DFT_BUF_TARGET));
    }
    GL_CHECK(glBindBuffer(DFT_BUF_TARGET, 0));
}

uint32_t roundUp(uint32_t numToRound, uint32_t multiple) {
    return ((numToRound + multiple - 1) / multiple) * multiple;
}
} // namespace

void cmdFuncGLES3CreateBuffer(GLESDevice *device, GLESGPUBuffer *gpuBuffer) {
    if (hasAllFlags(BufferUsageBit::TRANSFER_SRC | BufferUsageBit::TRANSFER_DST, gpuBuffer->usage)) {
        // Only use staging buffers when necessary, as they are typically not recommended on devices with unified memory architectures.
        gpuBuffer->buffer = std::make_unique<uint8_t[]>(gpuBuffer->size);
    } else {
        GL_CHECK(glGenBuffers(1, &gpuBuffer->glBuffer));
        gpuBuffer->glUsage = hasFlag(gpuBuffer->memUsage, MemoryUsageBit::HOST) ? GL_STATIC_DRAW : GL_DYNAMIC_DRAW;

        uint32_t size = gpuBuffer->size;
        GL_CHECK(glBindBuffer(DFT_BUF_TARGET, gpuBuffer->glBuffer));
        GL_CHECK(glBufferData(DFT_BUF_TARGET, size, nullptr, gpuBuffer->glUsage));
        GL_CHECK(glBindBuffer(DFT_BUF_TARGET, 0));
    }
}

void cmdFuncGLES3DestroyBuffer(GLESDevice */*device*/, GLuint *bufferIDs, uint32_t count) {
    if (bufferIDs != nullptr && count > 0) {
        GL_CHECK(glDeleteBuffers(count, bufferIDs));
    }
}

void cmdFuncGLES3ResizeBuffer(GLESDevice *device, GLESGPUBuffer *gpuBuffer) {
    if (gpuBuffer->glBuffer != 0) {
        uint32_t size = gpuBuffer->size;
        GL_CHECK(glBindBuffer(DFT_BUF_TARGET, gpuBuffer->glBuffer));
        GL_CHECK(glBufferData(DFT_BUF_TARGET, size, nullptr, gpuBuffer->glUsage));
        GL_CHECK(glBindBuffer(DFT_BUF_TARGET, 0));
    } else {
        gpuBuffer->buffer = std::make_unique<uint8_t[]>(gpuBuffer->size);
    }
}

void cmdFuncGLES3UpdateBuffer(GLESDevice */*device*/, GLESGPUBuffer *gpuBuffer, const void *buffer, uint32_t offset, uint32_t size, bool useMap, bool sync) {
    if (gpuBuffer->buffer) {
        memcpy(gpuBuffer->buffer.get() + offset, buffer, size);
    } else {
        uploadBufferData(gpuBuffer, offset, size, buffer, useMap, sync);
    }
}

namespace {
void renderBufferStorage(GLESDevice */*device*/, GLESGPUTexture *gpuTexture) {
    CC_ASSERT(gpuTexture->type == TextureType::TEX2D);
    GL_CHECK(glBindRenderbuffer(GL_RENDERBUFFER, gpuTexture->glRenderbuffer));
    if (gpuTexture->glSamples > 1) {
        GL_CHECK(glRenderbufferStorageMultisampleEXT(GL_RENDERBUFFER, gpuTexture->glSamples, gpuTexture->glInternalFmt, gpuTexture->width, gpuTexture->height));
    } else {
        GL_CHECK(glRenderbufferStorage(GL_RENDERBUFFER, gpuTexture->glInternalFmt, gpuTexture->width, gpuTexture->height));
    }
    GL_CHECK(glBindRenderbuffer(GL_RENDERBUFFER, 0));
}

void textureStorage(GLESDevice *device, GLESGPUTexture *gpuTexture) {
    auto w = gpuTexture->width;
    auto h = gpuTexture->height;
    auto d = gpuTexture->type == TextureType::TEX2D_ARRAY ? gpuTexture->arrayLayer : gpuTexture->depth;

    switch (gpuTexture->type) {
        case TextureType::CUBE:
            CC_ASSERT(gpuTexture->glSamples <= 1);
            gpuTexture->glTarget = GL_TEXTURE_CUBE_MAP;
            GL_CHECK(glBindTexture(GL_TEXTURE_CUBE_MAP, gpuTexture->glTexture));
            GL_CHECK(glTexStorage2D(GL_TEXTURE_CUBE_MAP, gpuTexture->mipLevel, gpuTexture->glInternalFmt, w, h));
            GL_CHECK(glBindTexture(GL_TEXTURE_CUBE_MAP, 0));
            break;
        case TextureType::TEX2D:
            if (gpuTexture->glSamples > 1 && device->constantRegistry().minorVersion >= 1) {
                gpuTexture->glTarget = GL_TEXTURE_2D_MULTISAMPLE;
                GL_CHECK(glBindTexture(GL_TEXTURE_2D_MULTISAMPLE, gpuTexture->glTexture));
                GL_CHECK(glTexStorage2DMultisample(GL_TEXTURE_2D_MULTISAMPLE, gpuTexture->glSamples, gpuTexture->glInternalFmt, w, h, GL_FALSE));
                GL_CHECK(glBindTexture(GL_TEXTURE_2D_MULTISAMPLE, 0));
            } else {
                gpuTexture->glTarget = GL_TEXTURE_2D;
                GL_CHECK(glBindTexture(GL_TEXTURE_2D, gpuTexture->glTexture));
                GL_CHECK(glTexStorage2D(GL_TEXTURE_2D, gpuTexture->mipLevel, gpuTexture->glInternalFmt, w, h));
                GL_CHECK(glBindTexture(GL_TEXTURE_2D, 0));
            }
            break;
        case TextureType::TEX3D:
            CC_ASSERT(gpuTexture->glSamples <= 1);
            gpuTexture->glTarget = GL_TEXTURE_3D;
            GL_CHECK(glBindTexture(GL_TEXTURE_3D, gpuTexture->glTexture));
            GL_CHECK(glTexStorage3D(GL_TEXTURE_3D, gpuTexture->mipLevel, gpuTexture->glInternalFmt, w, h, d));
            GL_CHECK(glBindTexture(GL_TEXTURE_3D, 0));
            break;
        case TextureType::TEX2D_ARRAY:
            if (gpuTexture->glSamples > 1 && device->constantRegistry().minorVersion >= 1) {
                gpuTexture->glTarget = GL_TEXTURE_2D_MULTISAMPLE_ARRAY;
                GL_CHECK(glBindTexture(GL_TEXTURE_2D_MULTISAMPLE_ARRAY, gpuTexture->glTexture));
                GL_CHECK(glTexStorage3DMultisample(GL_TEXTURE_2D_MULTISAMPLE_ARRAY, gpuTexture->glSamples, gpuTexture->glInternalFmt, w, h, d, GL_FALSE));
                GL_CHECK(glBindTexture(GL_TEXTURE_2D_MULTISAMPLE_ARRAY, 0));
            } else {
                gpuTexture->glTarget = GL_TEXTURE_2D_ARRAY;
                GL_CHECK(glBindTexture(GL_TEXTURE_2D_ARRAY, gpuTexture->glTexture));
                GL_CHECK(glTexStorage3D(GL_TEXTURE_2D_ARRAY, gpuTexture->mipLevel, gpuTexture->glInternalFmt, w, h, d));
                GL_CHECK(glBindTexture(GL_TEXTURE_2D_ARRAY, 0));
            }
            break;
        default:
            break;
    }
}

bool useRenderBuffer(const GLESDevice *device, Format format, TextureUsage usage) {
    return !device->isTextureExclusive(format) &&
           hasAllFlags(TextureUsage::COLOR_ATTACHMENT | TextureUsage::DEPTH_STENCIL_ATTACHMENT, usage);
}
} // namespace

void cmdFuncGLES3CreateTexture(GLESDevice *device, GLESGPUTexture *gpuTexture) {
    if (gpuTexture->swapchain != nullptr) {
        return;
    }

    gpuTexture->glInternalFmt = mapGLInternalFormat(gpuTexture->format);
    gpuTexture->glFormat = mapGLFormat(gpuTexture->format);
    gpuTexture->glType = formatToGLType(gpuTexture->format);

    bool const supportRenderBufferMS = device->constantRegistry().mMSRT > MSRTSupportLevel::NONE;
    gpuTexture->useRenderBuffer = useRenderBuffer(device, gpuTexture->format, gpuTexture->usage) &&
                                  (gpuTexture->glSamples <= 1 || supportRenderBufferMS);

    if (gpuTexture->glSamples > 1) {
        // Allocate render buffer when binding a framebuffer if the MSRT extension is not present.
        if (gpuTexture->useRenderBuffer &&
            hasFlag(gpuTexture->flags, TextureFlagBit::LAZILY_ALLOCATED)) {
            gpuTexture->memoryAllocated = false;
            return;
        }
    }

    if (gpuTexture->glTexture != 0) {
        return;
    }

    if (gpuTexture->size == 0) {
        return;
    }

    if (gpuTexture->useRenderBuffer) {
        GL_CHECK(glGenRenderbuffers(1, &gpuTexture->glRenderbuffer));
        renderBufferStorage(device, gpuTexture);
    } else {
        GL_CHECK(glGenTextures(1, &gpuTexture->glTexture));
        textureStorage(device, gpuTexture);
    }
}

void cmdFuncGLES3DestroyTexture(GLESDevice *device, GLuint *texIDs, uint32_t count) {
    if (texIDs != nullptr && count > 0) {
        GL_CHECK(glDeleteTextures(count, texIDs));
    }
}

void cmdFuncGLES3DestroyRenderBuffer(GLESDevice *device, GLuint *renderbufferIDs, uint32_t count) {
    if (renderbufferIDs != nullptr && count > 0) {
        GL_CHECK(glDeleteRenderbuffers(count, renderbufferIDs));
    }
}

void cmdFuncGLES3ResizeTexture(GLESDevice *device, GLESGPUTexture *gpuTexture) {
    CC_ASSERT(!gpuTexture->immutable);
    if (gpuTexture->size == 0) {
        return;
    }

    if (gpuTexture->useRenderBuffer) {
        renderBufferStorage(device, gpuTexture);
    }
}

void cmdFuncGLES3UpdateProgramBinaryFormats(GLESDevice */*device*/, ccstd::vector<GLint> &formats) {
    GLint shaderBinaryFormats = 0;
    GL_CHECK(glGetIntegerv(GL_NUM_PROGRAM_BINARY_FORMATS, &shaderBinaryFormats));

    formats.resize(shaderBinaryFormats);
    GL_CHECK(glGetIntegerv(GL_PROGRAM_BINARY_FORMATS, formats.data()));
}

void cmdFuncGLES3CreateShaderByBinary(GLESDevice *device, GLESGPUShader *gpuShader, uint32_t layoutHash) {
    auto *pipelineCache = device->pipelineCache();
    if (pipelineCache == nullptr || gpuShader->hash == INVALID_SHADER_HASH) {
        return;
    }

    ccstd::hash_t hash = gpuShader->hash;
    ccstd::hash_combine(hash, layoutHash);

    auto *item = pipelineCache->fetchBinary(gpuShader->name, hash);
    if (item != nullptr) {
        GL_CHECK(gpuShader->glProgram = glCreateProgram());
        GL_CHECK(glProgramBinary(gpuShader->glProgram, item->format, item->data.data(), item->data.size()));
    }
}

void cmdFuncGLES3CreateShaderBySource(GLESDevice *device, GLESGPUShader *gpuShader, uint32_t layoutHash) {
    GLenum glShaderStage = 0;
    ccstd::string shaderStageStr;
    GLint status;

    for (size_t i = 0; i < gpuShader->stages.size(); ++i) {
        GLESGPUShader::Stage &gpuStage = gpuShader->stages[i];

        switch (gpuStage.type) {
            case ShaderStageFlagBit::VERTEX: {
                glShaderStage = GL_VERTEX_SHADER;
                shaderStageStr = "Vertex Shader";
                break;
            }
            case ShaderStageFlagBit::FRAGMENT: {
                glShaderStage = GL_FRAGMENT_SHADER;
                shaderStageStr = "Fragment Shader";
                break;
            }
            case ShaderStageFlagBit::COMPUTE: {
                glShaderStage = GL_COMPUTE_SHADER;
                shaderStageStr = "Compute Shader";
                break;
            }
            default: {
                CC_ABORT();
                return;
            }
        }
        GL_CHECK(gpuStage.glShader = glCreateShader(glShaderStage));
        uint32_t const version = 300 + device->constantRegistry().minorVersion * 10;
        ccstd::string const shaderSource = StringUtil::format("#version %u es\n", version) + gpuStage.source;
        const char *source = shaderSource.c_str();
        GL_CHECK(glShaderSource(gpuStage.glShader, 1, (const GLchar **)&source, nullptr));
        GL_CHECK(glCompileShader(gpuStage.glShader));

        GL_CHECK(glGetShaderiv(gpuStage.glShader, GL_COMPILE_STATUS, &status));
        if (status != GL_TRUE) {
            GLint logSize = 0;
            GL_CHECK(glGetShaderiv(gpuStage.glShader, GL_INFO_LOG_LENGTH, &logSize));

            ++logSize;
            auto *logs = static_cast<GLchar *>(CC_MALLOC(logSize));
            GL_CHECK(glGetShaderInfoLog(gpuStage.glShader, logSize, nullptr, logs));

            CC_LOG_ERROR("%s in %s compilation failed.", shaderStageStr.c_str(), gpuShader->name.c_str());
            CC_LOG_ERROR(logs);
            CC_FREE(logs);
            GL_CHECK(glDeleteShader(gpuStage.glShader));
            gpuStage.glShader = 0;
            return;
        }
    }

    GL_CHECK(gpuShader->glProgram = glCreateProgram());

    // link program
    for (size_t i = 0; i < gpuShader->stages.size(); ++i) {
        auto &gpuStage = gpuShader->stages[i];
        GL_CHECK(glAttachShader(gpuShader->glProgram, gpuStage.glShader));
    }

    GL_CHECK(glLinkProgram(gpuShader->glProgram));

    // detach & delete immediately
    for (size_t i = 0; i < gpuShader->stages.size(); ++i) {
        auto &gpuStage = gpuShader->stages[i];
        if (gpuStage.glShader) {
            GL_CHECK(glDetachShader(gpuShader->glProgram, gpuStage.glShader));
            GL_CHECK(glDeleteShader(gpuStage.glShader));
            gpuStage.glShader = 0;
        }
    }

    GL_CHECK(glGetProgramiv(gpuShader->glProgram, GL_LINK_STATUS, &status));
    if (status != 1) {
        CC_LOG_ERROR("Failed to link Shader [%s].", gpuShader->name.c_str());
        GLint logSize = 0;
        GL_CHECK(glGetProgramiv(gpuShader->glProgram, GL_INFO_LOG_LENGTH, &logSize));
        if (logSize) {
            ++logSize;
            auto *logs = static_cast<GLchar *>(CC_MALLOC(logSize));
            GL_CHECK(glGetProgramInfoLog(gpuShader->glProgram, logSize, nullptr, logs));

            CC_LOG_ERROR(logs);
            CC_FREE(logs);
            return;
        }
    }

    auto *cache = device->pipelineCache();
    if (cache != nullptr && gpuShader->hash != INVALID_SHADER_HASH) {
        GLint binaryLength = 0;
        GL_CHECK(glGetProgramiv(gpuShader->glProgram, GL_PROGRAM_BINARY_LENGTH, &binaryLength));
        GLsizei length = 0;
        auto *binary = ccnew GLESGPUProgramBinary();
        binary->name = gpuShader->name;
        binary->hash = gpuShader->hash;
        ccstd::hash_combine(binary->hash, layoutHash);
        binary->data.resize(binaryLength);
        GL_CHECK(glGetProgramBinary(gpuShader->glProgram, binaryLength, &length, &binary->format, binary->data.data()));
        cache->addBinary(binary);
    }
}

void cmdFuncGLES3DestroyProgram(GLESDevice */*device*/, GLuint programID) {
    if (programID != 0) {
        GL_CHECK(glDeleteProgram(programID));
    }
}

void cmdFuncGLES3CreateRenderPass(GLESDevice */*device*/, GLESGPURenderPass *gpuRenderPass) {
    auto &subPasses = gpuRenderPass->subpasses;
    auto &attachments = gpuRenderPass->colorAttachments;
    auto &drawBuffers = gpuRenderPass->drawBuffers;

    gpuRenderPass->drawBuffers.resize(subPasses.size());
    gpuRenderPass->indices.resize(attachments.size(), INVALID_BINDING);

    for (uint32_t i = 0; i < subPasses.size(); ++i) {
        auto &sub = subPasses[i];
        auto &drawBuffer = drawBuffers[i];

        std::vector<bool> visited(gpuRenderPass->colorAttachments.size());
        for (auto &input : sub.inputs) {
            visited[input] = true;
            drawBuffer.emplace_back(gpuRenderPass->indices[input]);
        }

        for (auto &color : sub.colors) {
            auto &index = gpuRenderPass->indices[color];
            if (index == INVALID_BINDING) {
                index = static_cast<uint32_t>(gpuRenderPass->colors.size());
                gpuRenderPass->colors.emplace_back(color);
            }
            if (!visited[color]) {
                drawBuffer.emplace_back(index);
            }
        }

        for (auto &resolve : sub.resolves) {
            if (resolve == INVALID_BINDING) {
                gpuRenderPass->resolves.emplace_back(resolve);
                continue;
            }
            auto &index = gpuRenderPass->indices[resolve];
            if (index == INVALID_BINDING) {
                index = static_cast<uint32_t>(gpuRenderPass->resolves.size());
                gpuRenderPass->resolves.emplace_back(resolve);
            }
        }

        gpuRenderPass->depthStencil = sub.depthStencil;
        gpuRenderPass->depthStencilResolve = sub.depthStencilResolve;
    }
}

void cmdFuncGLES3CreateInputAssembler(GLESDevice *device, GLESGPUInputAssembler *gpuInputAssembler) {
    if (gpuInputAssembler->gpuIndexBuffer) {
        switch (gpuInputAssembler->gpuIndexBuffer->stride) {
            case 1: gpuInputAssembler->glIndexType = GL_UNSIGNED_BYTE; break;
            case 2: gpuInputAssembler->glIndexType = GL_UNSIGNED_SHORT; break;
            case 4: gpuInputAssembler->glIndexType = GL_UNSIGNED_INT; break;
            default: {
                CC_LOG_ERROR("Illegal index buffer stride.");
            }
        }
    }

    ccstd::vector<uint32_t> streamOffsets(device->getCapabilities().maxVertexAttributes, 0U);

    gpuInputAssembler->glAttribs.resize(gpuInputAssembler->attributes.size());
    for (size_t i = 0; i < gpuInputAssembler->glAttribs.size(); ++i) {
        GLESGPUAttribute &gpuAttribute = gpuInputAssembler->glAttribs[i];
        const Attribute &attrib = gpuInputAssembler->attributes[i];
        const auto *gpuVB = gpuInputAssembler->gpuVertexBuffers[attrib.stream].get();

        gpuAttribute.name = attrib.name;
        gpuAttribute.glType = formatToGLType(attrib.format);
        gpuAttribute.size = GFX_FORMAT_INFOS[static_cast<int>(attrib.format)].size;
        gpuAttribute.count = GFX_FORMAT_INFOS[static_cast<int>(attrib.format)].count;
        gpuAttribute.componentCount = glComponentCount(gpuAttribute.glType);
        gpuAttribute.isNormalized = attrib.isNormalized;
        gpuAttribute.isInstanced = attrib.isInstanced;
        gpuAttribute.offset = streamOffsets[attrib.stream];

        if (gpuVB) {
            gpuAttribute.offset += gpuVB->offset;
            gpuAttribute.glBuffer = gpuVB->gpuBuffer->glBuffer;
            gpuAttribute.stride = gpuVB->stride;
        }
        streamOffsets[attrib.stream] += gpuAttribute.size;
    }
}

void cmdFuncGLES3DestroyInputAssembler(GLESDevice *device, GLESGPUInputAssembler *gpuInputAssembler) {
}

namespace {
GLESGPUSwapchain *getSwapchainIfExists(const GLESGPUTextureViewList &textureViews, const uint32_t *indices, size_t count) {
    GLESGPUSwapchain *swapchain{nullptr};
    if (indices) {
        for (size_t i = 0; i < count; ++i) {
            if (indices[i] == INVALID_BINDING) {
                continue;
            }
            auto *colorTexture = textureViews[indices[i]]->texture.get();
            if (colorTexture->swapchain) {
                swapchain = colorTexture->swapchain;
            }
        }
    }
    return swapchain;
}
GLbitfield getColorBufferMask(Format format) {
    GLbitfield mask = 0U;
    const FormatInfo &info = GFX_FORMAT_INFOS[toNumber(format)];
    if (info.hasDepth || info.hasStencil) {
        if (info.hasDepth) mask |= GL_DEPTH_BUFFER_BIT;
        if (info.hasStencil) mask |= GL_STENCIL_BUFFER_BIT;
    } else {
        mask = GL_COLOR_BUFFER_BIT;
    }
    return mask;
}
} // namespace

void cmdFuncGLES3CreateFramebuffer(GLESDevice *device, GLESGPUFramebuffer *gpuFBO, uint32_t contextIndex) {
    const auto *renderPass = gpuFBO->gpuRenderPass.get();
    const auto &colors = renderPass->colors;
    const auto &resolves = renderPass->resolves;
    const auto &indices = renderPass->indices;
    const auto depthStencil = renderPass->depthStencil;
    const auto depthStencilResolve = renderPass->depthStencilResolve;

    auto framebuffer = FBOProxy(gpuFBO->framebuffer, contextIndex);
    auto resolveFramebuffer = FBOProxy(gpuFBO->resolveFramebuffer, contextIndex);

    framebuffer.initialize(getSwapchainIfExists(gpuFBO->gpuColorViews, colors.data(), colors.size()));
    resolveFramebuffer.initialize(getSwapchainIfExists(gpuFBO->gpuColorViews, resolves.data(), resolves.size()));

    auto supportLevel = device->constantRegistry().mMSRT;
    /*
     * LEVEL0 does ont support on-chip resolve
     * LEVEL1 only support COLOR_ATTACHMENT0
     * LEVEL2 support COLOR_ATTACHMENT(i) + DEPTH_STENCIL
     */
    uint32_t const supportCount = supportLevel > MSRTSupportLevel::LEVEL1 ? 255 : static_cast<uint32_t>(supportLevel);
    constexpr bool useDsResolve = true;

    uint32_t resolveColorIndex = 0;
    for (uint32_t i = 0; i < colors.size(); ++i) {
        const auto &attachmentIndex = colors[i];
        const auto &colorIndex = indices[attachmentIndex];
        const auto &resolveIndex = resolves.empty() ? INVALID_BINDING : resolves[attachmentIndex];

        const auto &desc = renderPass->colorAttachments[attachmentIndex];
        const auto *view = gpuFBO->gpuColorViews[attachmentIndex].get();
        CC_ASSERT(view != nullptr);

        // need to resolve
        if (view->texture->glSamples > 1 && resolveIndex != INVALID_BINDING) {
            const auto &resolveDesc = renderPass->colorAttachments[resolveIndex];
            const auto *resolveView = gpuFBO->gpuColorViews[resolveIndex].get();
            CC_ASSERT(resolveView != nullptr);
            bool const lazilyAllocated = hasFlag(view->texture->flags, TextureFlagBit::LAZILY_ALLOCATED);

            if (lazilyAllocated &&                               // MS attachment should be memoryless
                resolveView->texture->swapchain == nullptr && // not back buffer
                i < supportCount) {                              // extension limit
                framebuffer.bindColorMultiSample(resolveView, colorIndex, view->texture->glSamples, resolveDesc);
            } else {
                // implicit MS not supported, fallback to MS Renderbuffer
                gpuFBO->colorBlitPairs.emplace_back(colorIndex, resolveColorIndex);
                gpuFBO->needResolve = true;
                framebuffer.bindColor(view, colorIndex, desc);
                resolveFramebuffer.bindColor(resolveView, resolveColorIndex++, resolveDesc);
            }
            continue;
        }
        framebuffer.bindColor(view, colorIndex, desc);
    }

    if (depthStencil != INVALID_BINDING) {
        const auto &desc = renderPass->depthStencilAttachment;
        const auto *view = gpuFBO->gpuDepthStencilView.get();
        CC_ASSERT(view != nullptr);

        if (view->texture->glSamples > 1 && depthStencilResolve != INVALID_BINDING) {
            const auto &resolveDesc = renderPass->depthStencilResolveAttachment;
            const auto *resolveView = gpuFBO->gpuDepthStencilResolveView.get();
            bool const lazilyAllocated = hasFlag(view->texture->flags, TextureFlagBit::LAZILY_ALLOCATED);

            if (lazilyAllocated &&                               // MS attachment should be memoryless
                resolveView->texture->swapchain == nullptr && // not back buffer
                supportCount > 1 &&                              // extension limit
                useDsResolve) {                                  // enable ds implicit resolve
                framebuffer.bindDepthStencilMultiSample(resolveView, view->texture->glSamples, resolveDesc);
            } else {
                // implicit MS not supported, fallback to MS Renderbuffer
                gpuFBO->dsResolveMask = getColorBufferMask(desc.format);
                gpuFBO->needResolve = true;
                framebuffer.bindDepthStencil(view, desc);
                resolveFramebuffer.bindDepthStencil(resolveView, resolveDesc);
            }
        } else {
            framebuffer.bindDepthStencil(view, desc);
        }
    }
}

void cmdFuncGLES3DestroyFramebuffer(GLESDevice *device, GLESGPUFramebuffer *gpuFBO, uint32_t contextIndex) {

}

void cmdFuncGLES3CreatePipelineState(GLESDevice */*device*/, GLESGPUPipelineState *gpuPso) {
    gpuPso->glPrimitive = GLE_S3_PRIMITIVES[static_cast<int>(gpuPso->primitive)];

    const auto *pipelineLayout = gpuPso->gpuPipelineLayout.get();
    const auto *shader = gpuPso->gpuShader.get();
    const auto &descLayouts = pipelineLayout->setLayouts;
    const auto glProgram = gpuPso->gpuShader->glProgram;

    // update vertex location
    GLint attrMaxLength = 0;
    GLint attrCount = 0;
    GL_CHECK(glGetProgramiv(glProgram, GL_ACTIVE_ATTRIBUTE_MAX_LENGTH, &attrMaxLength));
    GL_CHECK(glGetProgramiv(glProgram, GL_ACTIVE_ATTRIBUTES, &attrCount));
    gpuPso->attributes.resize(attrCount);
    for (GLint i = 0; i < attrCount; ++i) {
        auto &gpuInput = gpuPso->attributes[i];
        ccstd::vector<GLchar> tmpName(attrMaxLength, 0);
        GL_CHECK(glGetActiveAttrib(glProgram, i, attrMaxLength, &gpuInput.glLength, &gpuInput.glSize, &gpuInput.glType, tmpName.data()));
        gpuInput.name = tmpName.data();
        gpuInput.glLoc = glGetAttribLocation(glProgram, tmpName.data());
        ccstd::hash_combine(gpuPso->inputHash, gpuInput.name);
        ccstd::hash_combine(gpuPso->inputHash, gpuInput.glLength);
        ccstd::hash_combine(gpuPso->inputHash, gpuInput.glSize);
        ccstd::hash_combine(gpuPso->inputHash, gpuInput.glType);
        ccstd::hash_combine(gpuPso->inputHash, gpuInput.glLoc);
    }

    uint32_t offset = 0;
    uint32_t blockOffset = 0;
    uint32_t texUnit = 0;
    ccstd::vector<GLint> units;

    GL_CHECK(glUseProgram(glProgram));
    // update binding map
    gpuPso->descriptorIndices.resize(pipelineLayout->descriptorCount, {INVALID_BINDING});
    for (uint32_t set = 0, descriptorIndex = 0; set < pipelineLayout->setLayouts.size(); ++set) {
        const auto &setLayout = pipelineLayout->setLayouts[set];
        const auto &bindings = setLayout->bindings;
        for (const auto &binding : bindings) {
            if (binding.type == DescriptorType::UNIFORM_BUFFER || binding.type == DescriptorType::DYNAMIC_UNIFORM_BUFFER) {
                for (const auto &block : shader->blocks) {
                    if (block.set != set || block.binding != binding.binding) {
                        continue;
                    }

                    GLuint const blockIndex = glGetUniformBlockIndex(glProgram, block.name.c_str());
                    if (blockIndex == GL_INVALID_INDEX) {
                        continue;
                    }
                    for (uint32_t j = 0; j < binding.count; ++j) {
                        GL_CHECK(glUniformBlockBinding(glProgram, blockIndex + j, blockOffset));
                        auto &desc = gpuPso->descriptorIndices[descriptorIndex + j];
                        desc.binding = blockOffset;
                        ++blockOffset;
                    }
                }
            } else if (binding.type == DescriptorType::STORAGE_BUFFER || binding.type == DescriptorType::DYNAMIC_STORAGE_BUFFER) {
                for (const auto &buffer : shader->buffers) {
                    if (buffer.set != set || buffer.binding != binding.binding) {
                        continue;
                    }

                    GLuint const bufferIndex = glGetProgramResourceIndex(glProgram, GL_SHADER_STORAGE_BLOCK, buffer.name.c_str());
                    if (bufferIndex == GL_INVALID_INDEX) {
                        continue;
                    }
                    for (uint32_t j = 0; j < binding.count; ++j) {
                        auto &desc = gpuPso->descriptorIndices[descriptorIndex + j];
                        GLint index = 0;
                        GLenum const prop = GL_BUFFER_BINDING;
                        glGetProgramResourceiv(glProgram, GL_SHADER_STORAGE_BLOCK, bufferIndex + j, 1, &prop, 1, nullptr, &index);
                        desc.binding = index;
                    }
                }
            } else if (binding.type == DescriptorType::SAMPLER_TEXTURE) {
                for (const auto &texture : shader->samplerTextures) {
                    if (texture.set != set || texture.binding != binding.binding) {
                        continue;
                    }

                    GLuint const loc = glGetUniformLocation(glProgram, texture.name.c_str());
                    if (loc == GL_INVALID_INDEX) {
                        continue;
                    }
                    for (uint32_t j = 0; j < binding.count; ++j) {
                        auto &desc = gpuPso->descriptorIndices[descriptorIndex + j];
                        desc.unit = texUnit++;
                        units.emplace_back(desc.unit);
                    }
                    if (!units.empty()) {
                        GL_CHECK(glUniform1iv(loc, static_cast<GLsizei>(units.size()), units.data()));
                        units.clear();
                    }
                }
            } else if (binding.type == DescriptorType::STORAGE_IMAGE) {
            }
            descriptorIndex += binding.count;
        }

        gpuPso->descriptorOffsets.emplace_back(offset);
        offset += setLayout->descriptorCount;
    }
    GL_CHECK(glUseProgram(0));
}

void cmdFuncGLES3DestroyPipelineState(GLESDevice *device, GLESGPUPipelineState *gpuPso) {

}

namespace {
void completeBarrier(GLESGPUGeneralBarrier *barrier) {
    bool hasShaderWrites = false;
    for (uint32_t mask = toNumber(barrier->prevAccesses); mask; mask = utils::clearLowestBit(mask)) {
        switch (static_cast<AccessFlagBit>(utils::getLowestBit(mask))) {
            case AccessFlagBit::COMPUTE_SHADER_WRITE:
            case AccessFlagBit::VERTEX_SHADER_WRITE:
            case AccessFlagBit::FRAGMENT_SHADER_WRITE:
            case AccessFlagBit::COLOR_ATTACHMENT_WRITE:
            case AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE:
                hasShaderWrites = true;
                break;
            default:
                break;
        }
    }

    if (hasShaderWrites) {
        for (uint32_t mask = toNumber(barrier->nextAccesses); mask; mask = utils::clearLowestBit(mask)) {
            switch (static_cast<AccessFlagBit>(utils::getLowestBit(mask))) {
                case AccessFlagBit::INDIRECT_BUFFER:
                    barrier->glBarriers |= GL_COMMAND_BARRIER_BIT;
                    break;
                case AccessFlagBit::INDEX_BUFFER:
                    barrier->glBarriers |= GL_ELEMENT_ARRAY_BARRIER_BIT;
                    break;
                case AccessFlagBit::VERTEX_BUFFER:
                    barrier->glBarriers |= GL_VERTEX_ATTRIB_ARRAY_BARRIER_BIT;
                    break;
                case AccessFlagBit::COMPUTE_SHADER_READ_UNIFORM_BUFFER:
                case AccessFlagBit::VERTEX_SHADER_READ_UNIFORM_BUFFER:
                case AccessFlagBit::FRAGMENT_SHADER_READ_UNIFORM_BUFFER:
                    barrier->glBarriersByRegion |= GL_UNIFORM_BARRIER_BIT;
                    break;
                case AccessFlagBit::COMPUTE_SHADER_READ_TEXTURE:
                case AccessFlagBit::VERTEX_SHADER_READ_TEXTURE:
                case AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE:
                case AccessFlagBit::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT:
                case AccessFlagBit::FRAGMENT_SHADER_READ_DEPTH_STENCIL_INPUT_ATTACHMENT:
                    barrier->glBarriersByRegion |= GL_SHADER_IMAGE_ACCESS_BARRIER_BIT;
                    barrier->glBarriersByRegion |= GL_TEXTURE_FETCH_BARRIER_BIT;
                    break;
                case AccessFlagBit::COMPUTE_SHADER_READ_OTHER:
                case AccessFlagBit::VERTEX_SHADER_READ_OTHER:
                case AccessFlagBit::FRAGMENT_SHADER_READ_OTHER:
                    barrier->glBarriersByRegion |= GL_SHADER_STORAGE_BARRIER_BIT;
                    break;
                case AccessFlagBit::COLOR_ATTACHMENT_READ:
                case AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_READ:
                    barrier->glBarriersByRegion |= GL_FRAMEBUFFER_BARRIER_BIT;
                    break;
                case AccessFlagBit::TRANSFER_READ:
                    barrier->glBarriersByRegion |= GL_FRAMEBUFFER_BARRIER_BIT;
                    barrier->glBarriers |= GL_TEXTURE_UPDATE_BARRIER_BIT;
                    barrier->glBarriers |= GL_BUFFER_UPDATE_BARRIER_BIT;
                    barrier->glBarriers |= GL_PIXEL_BUFFER_BARRIER_BIT;
                    break;
                case AccessFlagBit::COMPUTE_SHADER_WRITE:
                case AccessFlagBit::VERTEX_SHADER_WRITE:
                case AccessFlagBit::FRAGMENT_SHADER_WRITE:
                    barrier->glBarriersByRegion |= GL_SHADER_IMAGE_ACCESS_BARRIER_BIT;
                    barrier->glBarriersByRegion |= GL_SHADER_STORAGE_BARRIER_BIT;
                    break;
                case AccessFlagBit::COLOR_ATTACHMENT_WRITE:
                case AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE:
                    barrier->glBarriersByRegion |= GL_FRAMEBUFFER_BARRIER_BIT;
                    break;
                case AccessFlagBit::TRANSFER_WRITE:
                    barrier->glBarriersByRegion |= GL_FRAMEBUFFER_BARRIER_BIT;
                    barrier->glBarriers |= GL_TEXTURE_UPDATE_BARRIER_BIT;
                    barrier->glBarriers |= GL_BUFFER_UPDATE_BARRIER_BIT;
                    barrier->glBarriers |= GL_PIXEL_BUFFER_BARRIER_BIT;
                    break;
                case AccessFlagBit::HOST_PREINITIALIZED:
                case AccessFlagBit::HOST_WRITE:
                case AccessFlagBit::PRESENT:
                default:
                    break;
            }
        }
    }
}
} // namespace
void cmdFuncGLES3CreateGeneralBarrier(GLESDevice */*device*/, GLESGPUGeneralBarrier *barrier) {
    completeBarrier(barrier);
}

void cmdFuncGLES3CreateSampler(GLESDevice */*device*/, GLESGPUSampler *gpuSampler) {
    if (gpuSampler->minFilter == Filter::LINEAR || gpuSampler->minFilter == Filter::ANISOTROPIC) {
        if (gpuSampler->mipFilter == Filter::LINEAR || gpuSampler->mipFilter == Filter::ANISOTROPIC) {
            gpuSampler->glMinFilter = GL_LINEAR_MIPMAP_LINEAR;
        } else if (gpuSampler->mipFilter == Filter::POINT) {
            gpuSampler->glMinFilter = GL_LINEAR_MIPMAP_NEAREST;
        } else {
            gpuSampler->glMinFilter = GL_LINEAR;
        }
    } else {
        if (gpuSampler->mipFilter == Filter::LINEAR || gpuSampler->mipFilter == Filter::ANISOTROPIC) {
            gpuSampler->glMinFilter = GL_NEAREST_MIPMAP_LINEAR;
        } else if (gpuSampler->mipFilter == Filter::POINT) {
            gpuSampler->glMinFilter = GL_NEAREST_MIPMAP_NEAREST;
        } else {
            gpuSampler->glMinFilter = GL_NEAREST;
        }
    }

    if (gpuSampler->magFilter == Filter::LINEAR || gpuSampler->magFilter == Filter::ANISOTROPIC) {
        gpuSampler->glMagFilter = GL_LINEAR;
    } else {
        gpuSampler->glMagFilter = GL_NEAREST;
    }

    gpuSampler->glWrapS = GLES3_WRAPS[toNumber(gpuSampler->addressU)];
    gpuSampler->glWrapT = GLES3_WRAPS[toNumber(gpuSampler->addressV)];
    gpuSampler->glWrapR = GLES3_WRAPS[toNumber(gpuSampler->addressW)];

    GL_CHECK(glGenSamplers(1, &gpuSampler->glSampler));
    GL_CHECK(glSamplerParameteri(gpuSampler->glSampler, GL_TEXTURE_MIN_FILTER, gpuSampler->glMinFilter));
    GL_CHECK(glSamplerParameteri(gpuSampler->glSampler, GL_TEXTURE_MAG_FILTER, gpuSampler->glMagFilter));
    GL_CHECK(glSamplerParameteri(gpuSampler->glSampler, GL_TEXTURE_WRAP_S, gpuSampler->glWrapS));
    GL_CHECK(glSamplerParameteri(gpuSampler->glSampler, GL_TEXTURE_WRAP_T, gpuSampler->glWrapT));
    GL_CHECK(glSamplerParameteri(gpuSampler->glSampler, GL_TEXTURE_WRAP_R, gpuSampler->glWrapR));
    GL_CHECK(glSamplerParameterf(gpuSampler->glSampler, GL_TEXTURE_MIN_LOD, static_cast<GLfloat>(gpuSampler->minLod)));
    GL_CHECK(glSamplerParameterf(gpuSampler->glSampler, GL_TEXTURE_MAX_LOD, static_cast<GLfloat>(gpuSampler->maxLod)));
}

void cmdFuncGLES3DestroySampler(GLESDevice */*device*/, GLESGPUSampler *gpuSampler) {
    if (gpuSampler->glSampler != 0) {
        glDeleteSamplers(1, &gpuSampler->glSampler);
        gpuSampler->glSampler = 0;
    }
}

namespace {
uint8_t *funcGLES3PixelBufferPick(GLESDevice *device, const uint8_t *buffer, Format format, uint32_t offset, Extent stride, Extent extent) {
    const auto blockHeight = formatAlignment(format).second;

    const uint32_t bufferSize = formatSize(format, extent.width, extent.height, extent.depth);
    const uint32_t rowStride = formatSize(format, stride.width, 1, 1);
    const uint32_t sliceStride = formatSize(format, stride.width, stride.height, 1);
    const uint32_t chunkSize = formatSize(format, extent.width, 1, 1);

//    uint8_t *stagingBuffer = device->getStagingBuffer(bufferSize);
    auto *stagingBuffer = ccnew uint8_t[bufferSize];

    uint32_t bufferOffset = 0;
    uint32_t destOffset = 0;

    for (uint32_t i = 0; i < extent.depth; i++) {
        bufferOffset = offset + sliceStride * i;
        for (uint32_t j = 0; j < extent.height; j += blockHeight) {
            memcpy(stagingBuffer + destOffset, buffer + bufferOffset, chunkSize);
            destOffset += chunkSize;
            bufferOffset += rowStride;
        }
    }

    return stagingBuffer;
}
} // namespace

void cmdFuncGLES3CopyBuffersToTexture(GLESDevice *device, const uint8_t *const *buffers, GLESGPUTexture *gpuTexture, const BufferTextureCopy *regions, uint32_t count) {
    if (gpuTexture->useRenderBuffer) return;

    bool const isCompressed = GFX_FORMAT_INFOS[static_cast<int>(gpuTexture->format)].isCompressed;
    uint32_t n = 0;

    const auto blockSize = formatAlignment(gpuTexture->format);
    uint32_t destWidth = 0;
    uint32_t destHeight = 0;

    Extent extent{};
    Offset offset{};
    Extent stride{};

    GLenum target = GL_NONE;
    for (size_t i = 0; i < count; ++i) {
        const BufferTextureCopy &region = regions[i];
        uint32_t const mipLevel = region.texSubres.mipLevel;

        offset.x = region.texOffset.x == 0 ? 0 : utils::alignTo(region.texOffset.x, static_cast<int32_t>(blockSize.first));
        offset.y = region.texOffset.y == 0 ? 0 : utils::alignTo(region.texOffset.y, static_cast<int32_t>(blockSize.second));
        offset.z = region.texOffset.z;

        extent.width = utils::alignTo(region.texExtent.width, static_cast<uint32_t>(blockSize.first));
        extent.height = utils::alignTo(region.texExtent.height, static_cast<uint32_t>(blockSize.second));
        extent.depth = gpuTexture->type == TextureType::TEX3D ? region.texExtent.depth : 1;

        stride.width = region.buffStride > 0 ? region.buffStride : extent.width;
        stride.height = region.buffTexHeight > 0 ? region.buffTexHeight : extent.height;

        destWidth = (region.texExtent.width + offset.x == (gpuTexture->width >> mipLevel)) ? region.texExtent.width : extent.width;
        destHeight = (region.texExtent.height + offset.y == (gpuTexture->height >> mipLevel)) ? region.texExtent.height : extent.height;

        const uint8_t *buff;
        if (gpuTexture->type == TextureType::TEX2D) {
            if (stride.width == extent.width && stride.height == extent.height) {
                buff = buffers[n++] + region.buffOffset;
            } else {
                buff = funcGLES3PixelBufferPick(device, buffers[n++], gpuTexture->format, region.buffOffset, stride, extent);
            }

            target = hasFlag(gpuTexture->flags, TextureFlagBit::EXTERNAL_OES) ? GL_TEXTURE_EXTERNAL_OES : GL_TEXTURE_2D;
            GL_CHECK(glBindTexture(target, gpuTexture->glTexture));
            if (isCompressed) {
                auto memSize = static_cast<GLsizei>(formatSize(gpuTexture->format, extent.width, extent.height, 1));
                GL_CHECK(glCompressedTexSubImage2D(target, mipLevel, offset.x, offset.y, destWidth, destHeight, gpuTexture->glFormat, memSize, (GLvoid *)buff));
            }
            else {
                GL_CHECK(glTexSubImage2D(target, mipLevel, offset.x, offset.y, destWidth, destHeight, gpuTexture->glFormat, gpuTexture->glType, (GLvoid *)buff));
            }
        } else if (gpuTexture->type == TextureType::TEX3D) {
            if (stride.width == extent.width && stride.height == extent.height) {
                buff = buffers[n++] + region.buffOffset;
            } else {
                buff = funcGLES3PixelBufferPick(device, buffers[n++], gpuTexture->format, region.buffOffset, stride, extent);
            }

            target = GL_TEXTURE_3D;
            GL_CHECK(glBindTexture(target, gpuTexture->glTexture));
            if (isCompressed) {
                auto memSize = static_cast<GLsizei>(formatSize(gpuTexture->format, extent.width, extent.height, extent.depth));
                GL_CHECK(glCompressedTexSubImage3D(target, mipLevel, offset.x, offset.y, offset.z, destWidth, destHeight, extent.depth, gpuTexture->glFormat, memSize, (GLvoid *)buff));
            } else {
                GL_CHECK(glTexSubImage3D(target, mipLevel, offset.x, offset.y, offset.z, destWidth, destHeight, extent.depth, gpuTexture->glFormat, gpuTexture->glType, (GLvoid *)buff));
            }
        } else if (gpuTexture->type == TextureType::CUBE) {
            target = GL_TEXTURE_CUBE_MAP;
            GL_CHECK(glBindTexture(target, gpuTexture->glTexture));
            uint32_t const faceCount = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
            for (uint32_t f = region.texSubres.baseArrayLayer; f < faceCount; ++f) {
                if (stride.width == extent.width && stride.height == extent.height) {
                    buff = buffers[n++] + region.buffOffset;
                } else {
                    buff = funcGLES3PixelBufferPick(device, buffers[n++], gpuTexture->format, region.buffOffset, stride, extent);
                }
                const auto faceTarget = GL_TEXTURE_CUBE_MAP_POSITIVE_X + f;
                if (isCompressed) {
                    auto memSize = static_cast<GLsizei>(formatSize(gpuTexture->format, extent.width, extent.height, 1));
                    GL_CHECK(glCompressedTexSubImage2D(faceTarget, mipLevel, offset.x, offset.y,destWidth, destHeight, gpuTexture->glFormat, memSize, (GLvoid *)buff));
                } else {
                    GL_CHECK(glTexSubImage2D(faceTarget, mipLevel, offset.x, offset.y, destWidth, destHeight, gpuTexture->glFormat, gpuTexture->glType, (GLvoid *)buff));
                }
            }
        } else if (gpuTexture->type == TextureType::TEX2D_ARRAY) {
            target = GL_TEXTURE_2D_ARRAY;
            GL_CHECK(glBindTexture(target, gpuTexture->glTexture));
            uint32_t const layerCount = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
            for (uint32_t z = region.texSubres.baseArrayLayer; z < layerCount; ++z) {
                offset.z = static_cast<GLint>(z);

                if (stride.width == extent.width && stride.height == extent.height) {
                    buff = buffers[n++] + region.buffOffset;
                } else {
                    buff = funcGLES3PixelBufferPick(device, buffers[n++], gpuTexture->format, region.buffOffset, stride, extent);
                }

                if (isCompressed) {
                    auto memSize = static_cast<GLsizei>(formatSize(gpuTexture->format, extent.width, extent.height, 1));
                    GL_CHECK(glCompressedTexSubImage3D(target, mipLevel, offset.x, offset.y, offset.z, destWidth, destHeight, extent.depth, gpuTexture->glFormat, memSize, (GLvoid *)buff));
                } else {
                    GL_CHECK(glTexSubImage3D(target, mipLevel, offset.x, offset.y, offset.z, destWidth, destHeight, extent.depth, gpuTexture->glFormat, gpuTexture->glType, (GLvoid *)buff));
                }
            }
        }  else {
            return;
        }
    }

    if (!isCompressed && hasFlag(gpuTexture->flags, TextureFlagBit::GEN_MIPMAP)) {
        GL_CHECK(glGenerateMipmap(target));
    }
    GL_CHECK(glBindTexture(target, 0));
}

void cmdFuncGLES3CreateFence(GLESDevice * /*device*/, GLESGPUFence *gpuFence) {
    gpuFence->sync = glFenceSync(GL_SYNC_GPU_COMMANDS_COMPLETE, 0);
}

void cmdFuncGLES3DestroyFence(GLESDevice * /*device*/, GLESGPUFence *gpuFence) {
    GL_CHECK(glDeleteSync(gpuFence->sync));
}

void cmdFuncGLES3WaitFence(GLESDevice * /*device*/, GLESGPUFence *gpuFence, uint64_t timeout, bool isClient) {
    if (isClient) {
        GL_CHECK(glClientWaitSync(gpuFence->sync, GL_SYNC_FLUSH_COMMANDS_BIT, timeout));
    } else {
        GL_CHECK(glWaitSync(gpuFence->sync, 0, GL_TIMEOUT_IGNORED));
    }
}

VAOProxy::VAOProxy(GLESGPUInputAssembler &object, uint32_t ctxId, uint32_t layoutHash)
    : ia(object), handle(ia.vaoMap[layoutHash][ctxId]) {
}

FBOProxy::FBOProxy(GLESGPUFramebufferObject &object, uint32_t ctxId) : fbo(object), handle(fbo.handle[ctxId]) {
    updateHandle();
}

void FBOProxy::initialize(GLESGPUSwapchain *swc) {
    fbo.swapchain = swc;
}

void FBOProxy::bindColor(const GLESGPUTextureView *texture, uint32_t colorIndex, const ColorAttachment &attachment) {
    bindColorMultiSample(texture, colorIndex, 1, attachment);
}

void FBOProxy::bindColorMultiSample(const GLESGPUTextureView *texture, uint32_t colorIndex, GLint samples, const ColorAttachment &attachment) {
    if (colorIndex >= fbo.colors.size()) {
        fbo.colors.resize(colorIndex + 1);
    }
    bool const isDefaultFb = fbo.swapchain != nullptr;

    if (attachment.loadOp == LoadOp::DISCARD) {
        fbo.loadInvalidates.emplace_back(isDefaultFb ? GL_COLOR : GL_COLOR_ATTACHMENT0 + colorIndex);
    }
    if (attachment.storeOp == StoreOp::DISCARD) {
        fbo.storeInvalidates.emplace_back(isDefaultFb ? GL_COLOR : GL_COLOR_ATTACHMENT0 + colorIndex);
    }
    fbo.colors[colorIndex] = {texture, samples};
}

void FBOProxy::bindDepthStencil(const GLESGPUTextureView *texture, const DepthStencilAttachment &attachment) {
    bindDepthStencilMultiSample(texture, 1, attachment);
}

void FBOProxy::bindDepthStencilMultiSample(const GLESGPUTextureView *texture, GLint samples, const DepthStencilAttachment &attachment) {
    const FormatInfo &info = GFX_FORMAT_INFOS[toNumber(texture->texture->format)];

    bool const isDefaultFb = fbo.swapchain != nullptr;
    bool const hasDepth = info.hasDepth;
    bool const hasStencil = info.hasStencil;

    fbo.dsAttachment = hasDepth && hasStencil ? GL_DEPTH_STENCIL_ATTACHMENT :
                       hasDepth ? GL_DEPTH_ATTACHMENT : GL_STENCIL_ATTACHMENT;

    if (hasDepth) {
        auto att = isDefaultFb ? GL_DEPTH : GL_DEPTH_ATTACHMENT;
        if (attachment.depthLoadOp == LoadOp::DISCARD) {
            fbo.loadInvalidates.emplace_back(att);
        }
        if (attachment.depthStoreOp == StoreOp::DISCARD) {
            fbo.storeInvalidates.emplace_back(att);
        }
    }
    if (hasStencil) {
        auto att = isDefaultFb ? GL_STENCIL : GL_STENCIL_ATTACHMENT;
        if (attachment.stencilLoadOp == LoadOp::DISCARD) {
            fbo.loadInvalidates.emplace_back(att);
        }
        if (attachment.stencilStoreOp == StoreOp::DISCARD) {
            fbo.storeInvalidates.emplace_back(att);
        }
    }

    fbo.depthStencil.first = texture;
    fbo.depthStencil.second = samples;
}

bool FBOProxy::isActive() const {
    return fbo.swapchain != nullptr || (handle != 0);
}

void FBOProxy::updateHandle() {
    if (fbo.swapchain != nullptr || handle != 0) {
        return;
    }

    if (fbo.colors.empty() && fbo.dsAttachment == GL_NONE) {
        return;
    }

    GL_CHECK(glGenFramebuffers(1, &handle));
    GL_CHECK(glBindFramebuffer(GL_DRAW_FRAMEBUFFER, handle));

    auto bindAttachment = [](GLenum attachment, GLint samples, const GLESGPUTextureView *view) {
        auto *texture = view->texture.get();
        if (samples > 1) {
            CC_ASSERT(texture->glTexture != 0);
            GL_CHECK(glFramebufferTexture2DMultisampleEXT(GL_FRAMEBUFFER,
                                                          attachment,
                                                          GL_TEXTURE_2D,
                                                          texture->glTexture,
                                                          view->baseLevel,
                                                          static_cast<GLsizei>(samples)));
            return;
        }

        if (texture->useRenderBuffer) {
            /*
             * Renderbuffer is not allocated if using lazily allocated flag.
             * If the attachment does not meet the implicit MS condition, renderbuffer should be allocated here.
             */
            if (texture->glRenderbuffer == 0) {
                GL_CHECK(glGenRenderbuffers(1, &texture->glRenderbuffer));
                renderBufferStorage(GLESDevice::getInstance(), texture);
            }
            GL_CHECK(glFramebufferRenderbuffer(GL_DRAW_FRAMEBUFFER, attachment, GL_RENDERBUFFER, texture->glRenderbuffer));
        } else {
            GLenum target = GL_TEXTURE_2D;
            if (texture->type == TextureType::CUBE && view->layerCount == 1) {
                target = GL_TEXTURE_CUBE_MAP_POSITIVE_X + view->baseLayer;
            }
            GL_CHECK(glFramebufferTexture2D(GL_DRAW_FRAMEBUFFER, attachment, target, texture->glTexture, view->baseLevel));
        }
    };

    ccstd::vector<GLenum> drawBuffers(fbo.colors.size(), GL_NONE);
    for (uint32_t i = 0; i < fbo.colors.size(); ++i) {
        const auto &[view, samples] = fbo.colors[i];
        auto att = static_cast<GLenum>(GL_COLOR_ATTACHMENT0 + i);
        drawBuffers[i] = att;
        bindAttachment(att, samples, view);
    }

    if (fbo.depthStencil.first != nullptr) {
        const auto &[view, samples] = fbo.depthStencil;
        bindAttachment(fbo.dsAttachment, samples, view);
    }

    if (!drawBuffers.empty()) {
        GL_CHECK(glDrawBuffers(drawBuffers.size(), drawBuffers.data()));
    }

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

void FBOProxy::processLoad(GLenum target) {
    if (!fbo.loadInvalidates.empty()) {
        GL_CHECK(glInvalidateFramebuffer(target, utils::toUint(fbo.loadInvalidates.size()), fbo.loadInvalidates.data()));
    }
}

void FBOProxy::processStore(GLenum target) {
    if (!fbo.storeInvalidates.empty()) {
        GL_CHECK(glInvalidateFramebuffer(target, utils::toUint(fbo.storeInvalidates.size()), fbo.storeInvalidates.data()));
    }
}
} // namespace cc::gfx
