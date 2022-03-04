/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include "3d/assets/Types.h"
#include "base/RefCounted.h"
#include "base/TypeDef.h"
#include "scene/Define.h"

namespace cc {

class Mesh;
class MorphRendering;
class MorphRenderingInstance;

namespace gfx {
class Device;
class DescriptorSet;
} // namespace gfx

MorphRendering *createMorphRendering(Mesh *mesh, gfx::Device *gfxDevice);

/**
 * Class which control rendering of a morph resource.
 */
class MorphRendering : public RefCounted {
public:
    ~MorphRendering() override                       = default;
    virtual MorphRenderingInstance *createInstance() = 0;
};

/**
 * This rendering instance of a morph resource.
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

    virtual std::vector<scene::IMacroPatch> requiredPatches(index_t subMeshIndex) = 0;

    /**
     * Destroy the rendering instance.
     */
    virtual void destroy() = 0;
};

} // namespace cc
