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

#pragma once

#include "3d/assets/MorphRendering.h"
#include "3d/assets/Types.h"
#include "base/Ptr.h"
#include "scene/Define.h"

namespace cc {

class SubMeshMorphRendering;
class Mesh;

namespace gfx {
class Device;
class DescriptorSet;
} // namespace gfx

/**
 * @en The instance of [[MorphRendering]] for dedicated control in the mesh renderer.
 * The root [[MorphRendering]] is owned by [[Mesh]] asset, each [[MeshRenderer]] can have its own morph rendering instance.
 * @zh 用于网格渲染器中独立控制 [[MorphRendering]] 的实例。原始 [[MorphRendering]] 被 [[Mesh]] 资源持有，每个 [[MeshRenderer]] 都持有自己的形变网格渲染实例。
 */
class MorphRenderingInstance : public RefCounted {
public:
    ~MorphRenderingInstance() override = default;
    /**
     * Sets weights of targets of specified sub mesh.
     * @param subMeshIndex
     * @param weights
     */
    virtual void setWeights(index_t subMeshIndex, const MeshWeightsType &weights) = 0;

    /**
     * Adapts pipeline state to do the rendering.
     * @param subMeshIndex
     * @param pipelineState
     */
    virtual void adaptPipelineState(index_t subMeshIndex, gfx::DescriptorSet *descriptorSet) = 0;

    virtual ccstd::vector<scene::IMacroPatch> requiredPatches(index_t subMeshIndex) = 0;

    /**
     * Destroy the rendering instance.
     */
    virtual void destroy() = 0;
};

/**
 * @en Interface for classes which control the rendering of morph resources.
 * @zh 支持形变网格渲染的基类。
 */
class MorphRendering : public RefCounted {
public:
    ~MorphRendering() override = default;
    virtual MorphRenderingInstance *createInstance() = 0;
};

/**
 * @en Standard morph rendering class, it supports both GPU and CPU based morph blending.
 * If sub mesh morph targets count is less than [[pipeline.UBOMorph.MAX_MORPH_TARGET_COUNT]], then GPU based blending is enabled.
 * Each of the sub-mesh morph has its own [[MorphRenderingInstance]],
 * its morph target weights, render pipeline state and strategy of morph blending are controlled separately.
 * @zh 标准形变网格渲染类，它同时支持 CPU 和 GPU 的形变混合计算。
 * 如果子网格形变目标数量少于 [[pipeline.UBOMorph.MAX_MORPH_TARGET_COUNT]]，那么就会使用基于 GPU 的形变混合计算。
 * 每个子网格形变都使用自己独立的 [[MorphRenderingInstance]]，它的形变目标权重、渲染管线状态和形变混合计算策略都是独立控制的。
 */
class StdMorphRendering final : public MorphRendering {
public:
    explicit StdMorphRendering(Mesh *mesh, gfx::Device *gfxDevice);
    ~StdMorphRendering() override;
    MorphRenderingInstance *createInstance() override;

private:
    Mesh *_mesh{nullptr};
    ccstd::vector<IntrusivePtr<SubMeshMorphRendering>> _subMeshRenderings;

    CC_DISALLOW_COPY_MOVE_ASSIGN(StdMorphRendering);

    friend class StdMorphRenderingInstance;
};

/**
 * @en Create morph rendering from mesh which contains morph targets data.
 * @zh 从包含形变对象的网格资源中创建形变网格渲染对象。
 * @param mesh @en The mesh to create morph rendering from. @zh 用于创建形变网格渲染对象的原始网格资源。
 * @param gfxDevice @en The device instance acquired from [[Root]]. @zh 设备对象实例，可以从 [[Root]] 获取。
 */
MorphRendering *createMorphRendering(Mesh *mesh, gfx::Device *gfxDevice);

} // namespace cc
