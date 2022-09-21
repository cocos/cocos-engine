/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "Range.h"
#include "RenderGraphGraphs.h"
#include "RenderGraphTypes.h"


namespace cc {

namespace render {

void ResourceGraph::mount(vertex_descriptor vertID, ccstd::pmr::vector<vertex_descriptor>& mounted) {
    auto& resg = *this;
    visitObject(
        vertID, resg,
        [&](const ManagedResource& resource) {
            // to be removed
        },
        [&](ManagedBuffer& buffer) {
            if (!buffer.buffer) {
                mounted.emplace_back(vertID);
            }
            buffer.fenceValue = nextFenceValue;
        },
        [&](ManagedTexture& texture) {
            if (!texture.texture) {
                mounted.emplace_back(vertID);
            }
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
