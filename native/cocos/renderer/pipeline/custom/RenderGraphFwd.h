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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include "cocos/base/std/hash/hash.h"
#include "cocos/base/std/variant.h"
#include "cocos/renderer/pipeline/custom/RenderCommonFwd.h"
#include "cocos/scene/Camera.h"

namespace cc {

namespace render {

struct ResourceDesc;
struct ResourceTraits;
struct RenderSwapchain;
struct ResourceStates;
struct ManagedBuffer;
struct ManagedTexture;
struct ManagedResource;
struct RasterSubpass;
struct SubpassGraph;
struct RasterPass;
struct PersistentRenderPassAndFramebuffer;
struct ManagedTag;
struct ManagedBufferTag;
struct ManagedTextureTag;
struct PersistentBufferTag;
struct PersistentTextureTag;
struct FramebufferTag;
struct SwapchainTag;
struct SamplerTag;
struct ResourceGraph;
struct ComputePass;
struct CopyPass;
struct MovePass;
struct RaytracePass;
struct QueueTag;
struct SceneTag;
struct DispatchTag;
struct BlitTag;
struct PresentTag;
struct ClearTag;
struct ViewportTag;
struct ClearView;
struct RenderQueue;
struct SceneData;
struct Dispatch;
struct Blit;
struct Present;
struct PresentPass;
struct RenderData;
struct RenderGraph;

} // namespace render

} // namespace cc

namespace ccstd {

template <>
struct hash<cc::render::RasterSubpass> {
    hash_t operator()(const cc::render::RasterSubpass& val) const noexcept;
};

template <>
struct hash<cc::render::SubpassGraph> {
    hash_t operator()(const cc::render::SubpassGraph& val) const noexcept;
};

template <>
struct hash<cc::render::RasterPass> {
    hash_t operator()(const cc::render::RasterPass& val) const noexcept;
};

} // namespace ccstd

// clang-format on
