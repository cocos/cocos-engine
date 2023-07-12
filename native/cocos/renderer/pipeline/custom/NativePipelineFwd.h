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
#include "cocos/renderer/pipeline/InstancedBuffer.h"
#include "cocos/renderer/pipeline/custom/NativeFwd.h"

namespace cc {

namespace render {

class NativeRenderNode;
class NativeSetter;
class NativeRenderSubpassBuilderImpl;
class NativeRenderQueueBuilder;
class NativeRenderSubpassBuilder;
class NativeMultisampleRenderSubpassBuilder;
class NativeComputeSubpassBuilder;
class NativeRenderPassBuilder;
class NativeComputeQueueBuilder;
class NativeComputePassBuilder;
class NativeSceneTransversal;
struct RenderInstancingQueue;
struct DrawInstance;
struct RenderDrawQueue;
struct NativeRenderQueue;
class DefaultSceneVisitor;
class DefaultForwardLightingTransversal;
struct ResourceGroup;
struct BufferPool;
struct DescriptorSetPool;
struct UniformBlockResource;
struct ProgramResource;
struct LayoutGraphNodeResource;
struct QuadResource;

enum class ResourceType;

struct SceneResource;
struct CullingKey;
struct CullingQueries;
struct NativeRenderQueueDesc;
struct SceneCulling;
struct NativeRenderContext;
class NativeProgramLibrary;
struct PipelineCustomization;
class NativePipeline;
class NativeProgramProxy;
class NativeRenderingModule;

} // namespace render

} // namespace cc

namespace ccstd {

template <>
struct hash<cc::render::CullingKey> {
    hash_t operator()(const cc::render::CullingKey& val) const noexcept;
};

} // namespace ccstd

// clang-format on
