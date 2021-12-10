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
#include "scene/Model.h"
#include "renderer/pipeline/Define.h"
#include "renderer/pipeline/RenderPipeline.h"
#include "scene/RenderScene.h"
#include "scene/SubModel.h"

namespace cc {
namespace scene {
void Model::uploadMat4AsVec4x3(const Mat4 &mat, float *v1, float *v2, float *v3) {
    uint size = sizeof(float) * 4;
    memcpy(v1, mat.m, size);
    memcpy(v2, mat.m + 4, size);
    memcpy(v3, mat.m + 8, size);
    v1[3] = mat.m[12];
    v2[3] = mat.m[13];
    v3[3] = mat.m[14];
}

void Model::updateTransform(uint32_t /*stamp*/) {
    Node *node = _transform;
    if (node->getFlagsChanged() || node->getDirtyFlag()) {
        node->updateWorldTransform();
        _transformUpdated = true;
        if (_modelBounds.getValid() && _worldBounds) {
            _modelBounds.transform(node->getWorldMatrix(), _worldBounds);
        }

        if (_scene) {
            _scene->updateOctree(this);
        }
    }
}

void Model::updateUBOs(uint32_t stamp) {
    for (SubModel *subModel : _subModels) {
        subModel->update();
    }
    _updateStamp = stamp;
    if (!_transformUpdated) {
        return;
    }
    _transformUpdated = false;
    getTransform()->updateWorldTransform();
    const auto &                                 worldMatrix = getTransform()->getWorldMatrix();
    int                                          idx         = _instMatWorldIdx;
    Mat4                                         mat4;
    std::array<float, pipeline::UBOLocal::COUNT> bufferView;
    if (idx >= 0) {
        const std::vector<uint8_t *> &attrs = getInstancedAttributeBlock()->views;
        uploadMat4AsVec4x3(worldMatrix,
                           reinterpret_cast<float *>(attrs[idx]),
                           reinterpret_cast<float *>(attrs[idx + 1]),
                           reinterpret_cast<float *>(attrs[idx + 2]));
    } else if (_localBuffer) {
        memcpy(bufferView.data() + pipeline::UBOLocal::MAT_WORLD_OFFSET, worldMatrix.m, sizeof(Mat4));
        Mat4::inverseTranspose(worldMatrix, &mat4);
        memcpy(bufferView.data() + pipeline::UBOLocal::MAT_WORLD_IT_OFFSET, mat4.m, sizeof(Mat4));
        _localBuffer->update(bufferView.data(), pipeline::UBOLocal::SIZE);

        const bool enableOcclusionQuery = pipeline::RenderPipeline::getInstance()->getOcclusionQueryEnabled();
        if (enableOcclusionQuery) {
            updateWorldBoundUBOs();
        }
    }
}

void Model::updateWorldBoundUBOs() {
    if (_worldBoundBuffer) {
        std::array<float, pipeline::UBOWorldBound::COUNT> worldBoundBufferView;
        const Vec3 &                                      center      = _worldBounds ? _worldBounds->getCenter() : Vec3{0.0F, 0.0F, 0.0F};
        const Vec3 &                                      halfExtents = _worldBounds ? _worldBounds->getHalfExtents() : Vec3{1.0F, 1.0F, 1.0F};
        const Vec4                                        worldBoundCenter{center.x, center.y, center.z, 0.0F};
        const Vec4                                        worldBoundHalfExtents{halfExtents.x, halfExtents.y, halfExtents.z, 1.0F};
        memcpy(worldBoundBufferView.data() + pipeline::UBOWorldBound::WORLD_BOUND_CENTER, &worldBoundCenter.x, sizeof(Vec4));
        memcpy(worldBoundBufferView.data() + pipeline::UBOWorldBound::WORLD_BOUND_HALF_EXTENTS, &worldBoundHalfExtents.x, sizeof(Vec4));
        _worldBoundBuffer->update(worldBoundBufferView.data(), pipeline::UBOWorldBound::SIZE);
    }
}

void Model::setSubModel(uint32_t idx, SubModel *subModel) {
    subModel->setOwner(this);
    if (idx >= static_cast<uint32_t>(_subModels.size())) {
        _subModels.emplace_back(subModel);
        return;
    }
    _subModels[idx] = subModel;
}

} // namespace scene
} // namespace cc
