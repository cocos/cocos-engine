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

#include <utility>
#include "3d/models/MorphModel.h"
#include "base/std/container/array.h"
#include "core/animation/SkeletalAnimationUtils.h"
#include "math/Mat4.h"
#include "renderer/gfx-base/GFXDef-common.h"
#include "renderer/pipeline/Define.h"

namespace cc {
class Skeleton;
namespace geometry {
class AABB;
}

struct JointInfo {
    geometry::AABB *bound{nullptr};
    Node *target{nullptr};
    Mat4 bindpose;
    IntrusivePtr<IJointTransform> transform;
    ccstd::vector<index_t> buffers;
    ccstd::vector<index_t> indices;
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

    void initSubModel(index_t idx, RenderingSubMesh *subMeshData, Material *mat) override;
    ccstd::vector<scene::IMacroPatch> getMacroPatches(index_t subModelIndex) override;
    void updateInstancedAttributes(const ccstd::vector<gfx::Attribute> &attributes, scene::SubModel *subModel) override;

    void bindSkeleton(Skeleton *skeleton, Node *skinningRoot, Mesh *mesh);

private:
    static void uploadJointData(uint32_t base, const Mat4 &mat, float *dst);
    void ensureEnoughBuffers(uint32_t count);
    void updateRealTimeJointTextureBuffer();
    void initRealTimeJointTexture();
    void bindRealTimeJointTexture(uint32_t idx, gfx::DescriptorSet *descriptorset);
    void releaseData();

    ccstd::vector<index_t> _bufferIndices;
    ccstd::vector<IntrusivePtr<gfx::Buffer>> _buffers;
    ccstd::vector<JointInfo> _joints;
    ccstd::vector<float *> _dataArray;
    bool _realTimeTextureMode = false;
    RealTimeJointTexture *_realTimeJointTexture = nullptr;

    CC_DISALLOW_COPY_MOVE_ASSIGN(SkinningModel);
};

} // namespace cc
