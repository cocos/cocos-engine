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

#pragma once

#include <utility>
#include <vector>
#include "3d/assets/Skeleton.h"
#include "3d/models/MorphModel.h"
#include "core/animation/SkeletalAnimationUtils.h"
#include "math/Mat4.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "renderer/gfx-base/GFXDescriptorSet.h"
#include "renderer/pipeline/Define.h"
#include "scene/Model.h"

namespace cc {

namespace geometry {
class AABB;
}

struct JointInfo {
    geometry::AABB *     bound{nullptr};
    Node *               target{nullptr};
    Mat4                 bindpose;
    IJointTransform *    transform{nullptr};
    std::vector<index_t> buffers;
    std::vector<index_t> indices;
};

class SkinningModel final : public MorphModel {
public:
    using Super = MorphModel;
    SkinningModel();
    ~SkinningModel() override;

    void updateLocalDescriptors(index_t submodelIdx, gfx::DescriptorSet *descriptorset) override;
    void updateTransform(uint32_t stamp) override;
    void updateUBOs(uint32_t stamp) override;
    void destroy() override;

    void                             initSubModel(index_t idx, RenderingSubMesh *subMeshData, Material *mat) override;
    std::vector<scene::IMacroPatch> &getMacroPatches(index_t subModelIndex) override;
    void                             updateInstancedAttributes(const std::vector<gfx::Attribute> &attributes, scene::Pass *pass) override;

    void bindSkeleton(Skeleton *skeleton, Node *skinningRoot, Mesh *mesh);

private:
    static void uploadJointData(uint32_t base, const Mat4 &mat, float *dst);
    void        ensureEnoughBuffers(index_t count);

    std::vector<index_t>                                           _bufferIndices;
    std::vector<IntrusivePtr<gfx::Buffer>>                         _buffers;
    std::vector<JointInfo>                                         _joints;
    std::vector<std::array<float, pipeline::UBOSkinning::COUNT> *> _dataArray;

    CC_DISALLOW_COPY_MOVE_ASSIGN(SkinningModel);
};

} // namespace cc
