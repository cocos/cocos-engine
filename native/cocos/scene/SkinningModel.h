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
#include <vector>
#include "math/Mat4.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "renderer/gfx-base/GFXDescriptorSet.h"
#include "renderer/pipeline/Define.h"
#include "scene/Model.h"
namespace cc {
namespace scene {

struct JointTransform {
    Node *node{nullptr};
    Mat4  local;
    Mat4  world;
    int   stamp{-1};
};

struct JointInfo {
    AABB *                      bound{nullptr};
    Node *                      target{nullptr};
    Mat4                        bindpose;
    JointTransform              transform;
    std::vector<JointTransform> parents;
    std::vector<uint32_t>       buffers;
    std::vector<uint32_t>       indices;
};

class SkinningModel : public Model {
public:
    SkinningModel()                      = default;
    SkinningModel(const SkinningModel &) = delete;
    SkinningModel(SkinningModel &&)      = delete;
    ~SkinningModel() override;
    SkinningModel &operator=(const SkinningModel &) = delete;
    SkinningModel &operator=(SkinningModel &&) = delete;

    void        setBuffers(std::vector<gfx::Buffer *> buffers);
    inline void setIndicesAndJoints(std::vector<uint32_t> bufferIndices, std::vector<JointInfo> joints) {
        _bufferIndices = std::move(bufferIndices);
        _joints        = std::move(joints);
    }
    inline void updateLocalDescriptors(uint32_t submodelIdx, gfx::DescriptorSet *descriptorset) {
        gfx::Buffer *buffer = _buffers[_bufferIndices[submodelIdx]];
        if (buffer) {
            descriptorset->bindBuffer(pipeline::UBOSkinning::BINDING, buffer);
        }
    }
    inline void setNeedUpdate(bool needUpdate) {
        _needUpdate = needUpdate;
    }
    void updateTransform(uint32_t stamp) override;
    void updateUBOs(uint32_t stamp) override;

protected:
    ModelType _type{ModelType::SKINNING};

private:
    static void                                                    uploadJointData(uint32_t base, const Mat4 &mat, float *dst);
    void                                                           updateWorldMatrix(JointInfo *info, uint32_t stamp);
    bool                                                           _needUpdate{false};
    Mat4                                                           _worldMatrix;
    std::vector<uint32_t>                                          _bufferIndices;
    std::vector<gfx::Buffer *>                                     _buffers;
    std::vector<JointInfo>                                         _joints;
    std::vector<std::array<float, pipeline::UBOSkinning::COUNT> *> _dataArray;
    static std::vector<JointTransform *>                           transStacks;
};

} // namespace scene
} // namespace cc
