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

#include "scene/SkinningModel.h"
#include <utility>
#include "scene/RenderScene.h"

namespace cc {
namespace scene {

std::vector<JointTransform*> SkinningModel::transStacks;

void SkinningModel::updateWorldMatrix(JointInfo* info, uint32_t stamp) {
    transStacks.clear();

    int i = -1;
    _worldMatrix.setIdentity();
    auto* currTransform = &info->transform;
    auto  parentSize    = static_cast<int>(info->parents.size());
    while (currTransform->node) {
        if ((currTransform->stamp == stamp || currTransform->stamp + 1 == stamp) && !currTransform->node->getFlagsChanged()) {
            _worldMatrix.set(currTransform->world);
            currTransform->stamp = stamp;
            break;
        }
        currTransform->stamp = stamp;
        transStacks.emplace_back(currTransform);
        i++;
        if (i >= parentSize) {
            break;
        }
        currTransform = &info->parents[i];
    }
    while (i > -1) {
        currTransform = transStacks[i--];
        auto* node    = currTransform->node;
        Mat4::fromRTS(node->getRotation(), node->getPosition(), node->getScale(), &currTransform->local);
        Mat4::multiply(_worldMatrix, currTransform->local, &currTransform->world);
        _worldMatrix.set(currTransform->world);
    }
}

void SkinningModel::updateUBOs(uint32_t stamp) {
    Model::updateUBOs(stamp);
    uint32_t bIdx = 0;
    Mat4     mat4;
    for (const JointInfo& jointInfo : _joints) {
        Mat4::multiply(jointInfo.transform.world, jointInfo.bindpose, &mat4);
        for (uint32_t buffer : jointInfo.buffers) {
            uploadJointData(jointInfo.indices[bIdx] * 12, mat4, _dataArray[buffer]);
            bIdx++;
        }
        bIdx = 0;
    }
    if (_realTimeTextureMode) {
        updateRealTimeJointTextureBuffer();
    } else {
        bIdx = 0;
        for (gfx::Buffer* buffer : _buffers) {
            buffer->update(_dataArray[bIdx], buffer->getSize());
            bIdx++;
        }
    }
}

void SkinningModel::uploadJointData(uint32_t base, const Mat4& mat, float* dst) {
    memcpy(reinterpret_cast<void*>(dst + base), mat.m, sizeof(float) * 12);
    dst[base + 3]  = mat.m[12];
    dst[base + 7]  = mat.m[13];
    dst[base + 11] = mat.m[14];
}

SkinningModel::~SkinningModel() {
    size_t count = _dataArray.size();
    for (size_t i = 0; i < count; i++) {
        if (_dataArray[i]) delete[] _dataArray[i];
    }
    _dataArray.clear();
    if (_realTimeJointTexture) {
        delete _realTimeJointTexture;
        _realTimeJointTexture = nullptr;
    }
}

void SkinningModel::setBuffers(std::vector<gfx::Buffer*> buffers) {
    _buffers = std::move(buffers);
    size_t count = _buffers.size();
    _dataArray.resize(_buffers.size());
    for (size_t i = 0; i < count; i++) {
        _dataArray[i]= new float[pipeline::UBOSkinning::count];
    }
}

void SkinningModel::updateTransform(uint32_t stamp) {
    auto* root = getTransform();
    if (root->getFlagsChanged() || root->getDirtyFlag()) {
        root->updateWorldTransform();
        _transformUpdated = true;
    }
    Vec3 v3Min{INFINITY, INFINITY, INFINITY};
    Vec3 v3Max{-INFINITY, -INFINITY, -INFINITY};
    AABB ab1;
    Vec3 v31;
    Vec3 v32;
    for (JointInfo& jointInfo : _joints) {
        updateWorldMatrix(&jointInfo, stamp);
        jointInfo.bound->transform(_worldMatrix, &ab1);
        ab1.getBoundary(&v31, &v32);
        Vec3::min(v3Min, v31, &v3Min);
        Vec3::max(v3Max, v32, &v3Max);
    }
    if (_modelBounds.getValid() && _worldBounds) {
        AABB::fromPoints(v3Min, v3Max, &_modelBounds);
        _modelBounds.transform(root->getNodeLayout()->worldMatrix, _worldBounds);
    }

    if (_scene) {
        _scene->updateOctree(this);
    }
}

void SkinningModel::setRealTimeJointTextures(std::vector<gfx::Texture *> textures) {
    if (textures.empty()) return;
    _realTimeTextureMode = true;
    _realTimeJointTexture = new RealTimeJointTexture();
    uint32_t length = 4 * RealTimeJointTexture::WIDTH * RealTimeJointTexture::HEIGHT;
    size_t count = _dataArray.size();
    for (size_t i = 0; i < count; i++) {
       delete[] _dataArray[i];
       _dataArray[i] = new float[length];
    }

    _realTimeJointTexture->textures = std::move(textures);
    _realTimeJointTexture->buffer = new float[length];
}

void SkinningModel::updateRealTimeJointTextureBuffer()
{
    uint32_t bIdx = 0;
    uint32_t width = RealTimeJointTexture::WIDTH;
    uint32_t height = RealTimeJointTexture::HEIGHT;
    for (gfx::Texture* texture: _realTimeJointTexture->textures) {
        auto *buffer = _realTimeJointTexture->buffer;
        auto *src    = _dataArray[bIdx];
        uint32_t count = width;
        uint32_t index0 = 0;
        uint32_t index1 = 0;
        for (uint32_t i = 0; i < count; i++) {
            index0 = 4 * i;
            buffer[index0++] = src[index1++];
            buffer[index0++] = src[index1++];
            buffer[index0++] = src[index1++];
            buffer[index0++] = src[index1++];
            index0 = 4 * (i + width);
            buffer[index0++] = src[index1++];
            buffer[index0++] = src[index1++];
            buffer[index0++] = src[index1++];
            buffer[index0++] = src[index1++];
            index0 = 4 * (i + 2 * width);
            buffer[index0++] = src[index1++];
            buffer[index0++] = src[index1++];
            buffer[index0++] = src[index1++];
            buffer[index0++] = src[index1++];
        }
        cc::gfx::TextureSubresLayers layer;
        cc::gfx::Offset texOffset;
        cc::gfx::Extent extent = {width, height, 1};
        cc::gfx::BufferTextureCopy region = {
           width,
           height,
           texOffset,
           extent,
           layer
        };
        auto *device = cc::gfx::Device::getInstance();
        device->copyBuffersToTexture(reinterpret_cast<const uint8_t *const *>(&buffer), texture, &region, 1);
        bIdx++;
    }
}

} // namespace scene
} // namespace cc
