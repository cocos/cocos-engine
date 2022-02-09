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

#include <utility>

#include "3d/assets/Skeleton.h"
#include "3d/models/MorphModel.h"
#include "3d/skeletal-animation/SkeletalAnimationUtils.h"
#include "gfx-base/GFXDef-common.h"

namespace cc {

namespace gfx {
class Texture;
}

class DataPoolManager;

struct BakedJointInfo {
    IntrusivePtr<gfx::Buffer>                 buffer;
    Float32Array                              jointTextureInfo;
    cc::optional<IJointTextureHandle *>       texture;
    IAnimInfo                                 animInfo;
    std::vector<cc::optional<geometry::AABB>> boundsInfo;
};

class BakedSkinningModel final : public MorphModel {
public:
    using Super = MorphModel;
    BakedSkinningModel();
    ~BakedSkinningModel() override = default;

    void destroy() override;

    std::vector<scene::IMacroPatch> &getMacroPatches(index_t subModelIndex) override;
    void                             updateLocalDescriptors(index_t subModelIndex, gfx::DescriptorSet *descriptorSet) override;
    void                             updateTransform(uint32_t stamp) override;
    void                             updateUBOs(uint32_t stamp) override;
    void                             updateInstancedAttributes(const std::vector<gfx::Attribute> &attributes, scene::Pass *pass) override;
    void                             updateInstancedJointTextureInfo();
    // void                             uploadAnimation(AnimationClip *anim); // TODO(xwx): AnimationClip not define

    void bindSkeleton(Skeleton *skeleton, Node *skinningRoot, Mesh *mesh);

    inline void updateModelBounds(geometry::AABB *modelBounds) {
        if (modelBounds == nullptr) {
            return;
        }
        _modelBounds->setValid(true);
        _modelBounds->set(modelBounds->getCenter(), modelBounds->getHalfExtents());
    }

    void syncAnimInfoForJS(gfx::Buffer *buffer, const Float32Array &data, Uint8Array &dirty);
    void syncDataForJS(const std::vector<cc::optional<geometry::AABB>> &boundsInfo,
                       const cc::optional<geometry::AABB> &             modelBound,
                       float                                            jointTextureInfo0,
                       float                                            jointTextureInfo1,
                       float                                            jointTextureInfo2,
                       float                                            jointTextureInfo3,
                       gfx::Texture *                                   tex,
                       const Float32Array &                             animInfoData);

    void setUploadedAnimForJS(bool value) { _isUploadedAnim = value; }

protected:
    void applyJointTexture(const cc::optional<IJointTextureHandle *> &texture);

private:
    BakedJointInfo _jointMedium;
    index_t        _instAnimInfoIdx{CC_INVALID_INDEX};
    //    IntrusivePtr<DataPoolManager> _dataPoolManager;
    IntrusivePtr<Skeleton> _skeleton;
    IntrusivePtr<Mesh>     _mesh;
    // AnimationClip* uploadedAnim;
    bool _isUploadedAnim{false};

    CC_DISALLOW_COPY_MOVE_ASSIGN(BakedSkinningModel);
};

} // namespace cc
