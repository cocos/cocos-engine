/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "NativePipelineTypes.h"
#include "RenderGraphGraphs.h"
#include "RenderGraphTypes.h"
#include "cocos/renderer/gfx-base/GFXDevice.h"
#include "details/Range.h"
#include "gfx-base/GFXDef-common.h"
#include "pipeline/custom/RenderCommonFwd.h"

namespace cc {

namespace render {

ResourceGroup::~ResourceGroup() noexcept {
    for (const auto& buffer : instancingBuffers) {
        buffer->clear();
    }
}

void NativeRenderContext::clearPreviousResources(uint64_t finishedFenceValue) noexcept {
    for (auto iter = resourceGroups.begin(); iter != resourceGroups.end();) {
        if (iter->first <= finishedFenceValue) {
            iter = resourceGroups.erase(iter);
        } else {
            break;
        }
    }
}

namespace {

gfx::BufferInfo getBufferInfo(const ResourceDesc& desc) {
    using namespace gfx; // NOLINT(google-build-using-namespace)

    BufferUsage usage = BufferUsage::TRANSFER_SRC | BufferUsage::TRANSFER_DST;
    if (any(desc.flags & ResourceFlags::UNIFORM)) {
        usage |= BufferUsage::UNIFORM;
    }
    if (any(desc.flags & ResourceFlags::STORAGE)) {
        usage |= BufferUsage::STORAGE;
    }
    if (any(desc.flags & ResourceFlags::INDIRECT)) {
        usage |= BufferUsage::INDIRECT;
    }

    return {
        usage,
        MemoryUsage::DEVICE,
        desc.width,
        1U, // stride should not be used
        BufferFlagBit::NONE,
    };
}

gfx::TextureInfo getTextureInfo(const ResourceDesc& desc, bool bCube = false) {
    using namespace gfx; // NOLINT(google-build-using-namespace)
    // type
    auto type = TextureType::TEX1D;
    switch (desc.dimension) {
        case ResourceDimension::TEXTURE1D:
            if (desc.depthOrArraySize > 1) {
                type = TextureType::TEX1D_ARRAY;
            } else {
                type = TextureType::TEX1D;
            }
            break;
        case ResourceDimension::TEXTURE2D:
            if (desc.depthOrArraySize > 1) {
                if (bCube) {
                    type = TextureType::CUBE;
                } else {
                    type = TextureType::TEX2D_ARRAY;
                }
            } else {
                type = TextureType::TEX2D;
            }
            break;
        case ResourceDimension::TEXTURE3D:
            type = TextureType::TEX3D;
            break;
        case ResourceDimension::BUFFER:
            CC_EXPECTS(false);
    }

    // usage
    TextureUsage usage = TextureUsage::SAMPLED | TextureUsage::TRANSFER_SRC | TextureUsage::TRANSFER_DST;
    if (any(desc.flags & ResourceFlags::COLOR_ATTACHMENT)) {
        usage |= TextureUsage::COLOR_ATTACHMENT;
    }
    if (any(desc.flags & ResourceFlags::DEPTH_STENCIL_ATTACHMENT)) {
        CC_EXPECTS(!any(desc.flags & ResourceFlags::COLOR_ATTACHMENT));
        usage |= TextureUsage::DEPTH_STENCIL_ATTACHMENT;
    }
    if (any(desc.flags & ResourceFlags::INPUT_ATTACHMENT)) {
        usage |= TextureUsage::INPUT_ATTACHMENT;
    }
    if (any(desc.flags & ResourceFlags::STORAGE)) {
        usage |= TextureUsage::STORAGE;
    }

    return {
        type,
        usage,
        desc.format,
        desc.width,
        desc.height,
        desc.textureFlags,
        type == TextureType::TEX3D ? 1U : desc.depthOrArraySize,
        desc.mipLevels,
        desc.sampleCount,
        type == TextureType::TEX3D ? desc.depthOrArraySize : 1U,
        nullptr,
    };
}

} // namespace

void ResourceGraph::mount(gfx::Device* device, vertex_descriptor vertID) {
    std::ignore = device;
    auto& resg = *this;
    const auto& desc = get(ResourceGraph::DescTag{}, *this, vertID);
    visitObject(
        vertID, resg,
        [&](const ManagedResource& resource) {
            // to be removed
        },
        [&](ManagedBuffer& buffer) {
            if (!buffer.buffer) {
                auto info = getBufferInfo(desc);
                buffer.buffer = device->createBuffer(info);
            }
            CC_ENSURES(buffer.buffer);
            buffer.fenceValue = nextFenceValue;
        },
        [&](ManagedTexture& texture) {
            if (!texture.texture) {
                auto info = getTextureInfo(desc);
                texture.texture = device->createTexture(info);
            }
            CC_ENSURES(texture.texture);
            texture.fenceValue = nextFenceValue;
        },
        [&](const IntrusivePtr<gfx::Buffer>& pass) {
        },
        [&](const IntrusivePtr<gfx::Texture>& pass) {
        },
        [&](const IntrusivePtr<gfx::Framebuffer>& pass) {
        },
        [&](const RenderSwapchain& queue) {
        });
}

void ResourceGraph::unmount(uint64_t completedFenceValue) {
    auto& resg = *this;
    for (const auto& vertID : makeRange(vertices(resg))) {
        visitObject(
            vertID, resg,
            [&](const ManagedResource& resource) {
                // to be removed
            },
            [&](ManagedBuffer& buffer) {
                if (buffer.fenceValue <= completedFenceValue) {
                    buffer.buffer.reset();
                }
            },
            [&](ManagedTexture& texture) {
                if (texture.fenceValue <= completedFenceValue) {
                    texture.texture.reset();
                }
            },
            [&](const IntrusivePtr<gfx::Buffer>& pass) {
            },
            [&](const IntrusivePtr<gfx::Texture>& pass) {
            },
            [&](const IntrusivePtr<gfx::Framebuffer>& pass) {
            },
            [&](const RenderSwapchain& queue) {
            });
    }
}

} // namespace render

} // namespace cc
