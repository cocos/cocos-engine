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
#include "3d/models/SkinningModel.h"

#include <utility>

#include "3d/assets/Mesh.h"
#include "3d/assets/Skeleton.h"
#include "core/platform/Debug.h"
#include "core/scene-graph/Node.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "scene/Pass.h"
#include "scene/RenderScene.h"

const uint32_t REALTIME_JOINT_TEXTURE_WIDTH = 256;
const uint32_t REALTIME_JOINT_TEXTURE_HEIGHT = 3;

namespace {
void getRelevantBuffers(ccstd::vector<index_t> &outIndices, ccstd::vector<int32_t> &outBuffers, const ccstd::vector<ccstd::vector<int32_t>> &jointMaps, int32_t targetJoint) {
    for (int32_t i = 0; i < jointMaps.size(); i++) {
        index_t index = CC_INVALID_INDEX;
        for (int32_t j = 0; j < jointMaps[i].size(); j++) {
            if (jointMaps[i][j] == targetJoint) {
                index = j;
                break;
            }
        }
        if (index >= 0) {
            outBuffers.emplace_back(i);
            outIndices.emplace_back(index);
        }
    }
}

ccstd::vector<cc::scene::IMacroPatch> uniformPatches{{"CC_USE_SKINNING", true}, {"CC_USE_REAL_TIME_JOINT_TEXTURE", false}};
ccstd::vector<cc::scene::IMacroPatch> texturePatches{{"CC_USE_SKINNING", true}, {"CC_USE_REAL_TIME_JOINT_TEXTURE", true}};

} // namespace
namespace cc {

SkinningModel::SkinningModel() {
    _type = Model::Type::SKINNING;
}
SkinningModel::~SkinningModel() {
    releaseData();
}

void SkinningModel::destroy() {
    bindSkeleton(nullptr, nullptr, nullptr);
    releaseData();
    Super::destroy();
}

void SkinningModel::bindSkeleton(Skeleton *skeleton, Node *skinningRoot, Mesh *mesh) {
    for (const JointInfo &joint : _joints) {
        deleteTransform(joint.target);
    }
    _bufferIndices.clear();
    _joints.clear();

    if (!skeleton || !skinningRoot || !mesh) return;
    auto jointCount = static_cast<uint32_t>(skeleton->getJoints().size());
    _realTimeTextureMode = pipeline::SkinningJointCapacity::jointUniformCapacity < jointCount;
    setTransform(skinningRoot);
    auto boneSpaceBounds = mesh->getBoneSpaceBounds(skeleton);
    const auto &jointMaps = mesh->getStruct().jointMaps;
    ensureEnoughBuffers((jointMaps.has_value() && !jointMaps->empty()) ? static_cast<uint32_t>(jointMaps->size()) : 1);
    _bufferIndices = mesh->getJointBufferIndices();
    initRealTimeJointTexture();
    for (index_t index = 0; index < skeleton->getJoints().size(); ++index) {
        geometry::AABB *bound = boneSpaceBounds[index];
        auto *target = skinningRoot->getChildByPath(skeleton->getJoints()[index]);
        if (!bound || !target) continue;

        auto *transform = cc::getTransform(target, skinningRoot);
        const Mat4 &bindPose = skeleton->getBindposes()[index];
        ccstd::vector<index_t> indices;
        ccstd::vector<index_t> buffers;
        if (!jointMaps.has_value()) {
            indices.emplace_back(index);
            buffers.emplace_back(0);
        } else {
            getRelevantBuffers(indices, buffers, jointMaps.value(), index);
        }

        JointInfo jointInfo;
        jointInfo.bound = bound;
        jointInfo.target = target;
        jointInfo.bindpose = bindPose;
        jointInfo.transform = transform;
        jointInfo.buffers = std::move(buffers);
        jointInfo.indices = std::move(indices);
        _joints.emplace_back(std::move(jointInfo));
    }
}

void SkinningModel::updateTransform(uint32_t stamp) {
    auto *root = getTransform();
    if (root->getChangedFlags() || root->isTransformDirty()) {
        root->updateWorldTransform();
        _localDataUpdated = true;
    }
    Vec3 v3Min{INFINITY, INFINITY, INFINITY};
    Vec3 v3Max{-INFINITY, -INFINITY, -INFINITY};
    geometry::AABB ab1;
    Vec3 v31;
    Vec3 v32;
    for (JointInfo &jointInfo : _joints) {
        auto &transform = jointInfo.transform;
        Mat4 worldMatrix = cc::getWorldMatrix(transform, static_cast<int32_t>(stamp));
        jointInfo.bound->transform(worldMatrix, &ab1);
        ab1.getBoundary(&v31, &v32);
        Vec3::min(v3Min, v31, &v3Min);
        Vec3::max(v3Max, v32, &v3Max);
    }
    if (_modelBounds && _modelBounds->isValid() && _worldBounds) {
        geometry::AABB::fromPoints(v3Min, v3Max, _modelBounds);
        _modelBounds->transform(root->getWorldMatrix(), _worldBounds);
        _worldBoundsDirty = true;
    }
}

void SkinningModel::updateUBOs(uint32_t stamp) {
    Super::updateUBOs(stamp);
    uint32_t bIdx = 0;
    Mat4 mat4;
    for (const JointInfo &jointInfo : _joints) {
        Mat4::multiply(jointInfo.transform->world, jointInfo.bindpose, &mat4);
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
        for (gfx::Buffer *buffer : _buffers) {
            buffer->update(_dataArray[bIdx], buffer->getSize());
            bIdx++;
        }
    }
}

void SkinningModel::initSubModel(index_t idx, RenderingSubMesh *subMeshData, Material *mat) {
    const auto &original = subMeshData->getVertexBuffers();
    auto &iaInfo = subMeshData->getIaInfo();
    iaInfo.vertexBuffers = subMeshData->getJointMappedBuffers();
    Super::initSubModel(idx, subMeshData, mat);
    iaInfo.vertexBuffers = original;
}

ccstd::vector<scene::IMacroPatch> SkinningModel::getMacroPatches(index_t subModelIndex) {
    auto patches = Super::getMacroPatches(subModelIndex);
    auto myPatches = uniformPatches;
    if (_realTimeTextureMode) {
        myPatches = texturePatches;
    }
    if (!patches.empty()) {
        patches.reserve(myPatches.size() + patches.size());
        patches.insert(std::begin(patches), std::begin(myPatches), std::end(myPatches));
        return patches;
    }

    return myPatches;
}

void SkinningModel::uploadJointData(uint32_t base, const Mat4 &mat, float *dst) {
    memcpy(reinterpret_cast<void *>(dst + base), mat.m, sizeof(float) * 12);
    dst[base + 3] = mat.m[12];
    dst[base + 7] = mat.m[13];
    dst[base + 11] = mat.m[14];
}

void SkinningModel::updateLocalDescriptors(index_t submodelIdx, gfx::DescriptorSet *descriptorset) {
    Super::updateLocalDescriptors(submodelIdx, descriptorset);
    uint32_t idx = _bufferIndices[submodelIdx];
    if (!_realTimeTextureMode) {
        gfx::Buffer *buffer = _buffers[idx];
        if (buffer) {
            descriptorset->bindBuffer(pipeline::UBOSkinning::BINDING, buffer);
        }
    } else {
        bindRealTimeJointTexture(idx, descriptorset);
    }
}

void SkinningModel::updateInstancedAttributes(const ccstd::vector<gfx::Attribute> &attributes, scene::SubModel *subModel) {
    auto *pass = subModel->getPass(0);
    if (pass->getBatchingScheme() != scene::BatchingSchemes::NONE) {
        // TODO(holycanvas): #9203 better to print the complete path instead of only the current node
        debug::warnID(3936, getNode()->getName());
        CC_LOG_WARNING("pass batchingScheme is none, %s", getNode()->getName().c_str());
    }
    Super::updateInstancedAttributes(attributes, subModel);
}

void SkinningModel::ensureEnoughBuffers(uint32_t count) {
    if (!_buffers.empty()) {
        for (gfx::Buffer *buffer : _buffers) {
            CC_SAFE_DESTROY(buffer);
        }
        _buffers.clear();
    }
    if (!_dataArray.empty()) {
        for (auto *data : _dataArray) {
            CC_SAFE_DELETE_ARRAY(data);
        }
        _dataArray.clear();
    }
    _dataArray.resize(count);
    if (!_realTimeTextureMode) {
        _buffers.resize(count);
        uint32_t length = pipeline::UBOSkinning::count;
        for (uint32_t i = 0; i < count; i++) {
            _buffers[i] = _device->createBuffer({
                gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
                gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
                pipeline::UBOSkinning::size,
                pipeline::UBOSkinning::size,
            });
            _dataArray[i] = new float[length];
            memset(_dataArray[i], 0, sizeof(float) * length);
        }
    } else {
        uint32_t length = 4 * REALTIME_JOINT_TEXTURE_WIDTH * REALTIME_JOINT_TEXTURE_HEIGHT;
        for (uint32_t i = 0; i < count; i++) {
            if (_dataArray[i] == nullptr) {
                _dataArray[i] = new float[length];
                memset(_dataArray[i], 0, sizeof(float) * length);
            }
        }
    }
}

void SkinningModel::initRealTimeJointTexture() {
    CC_SAFE_DELETE(_realTimeJointTexture);
    if (!_realTimeTextureMode) return;
    _realTimeJointTexture = ccnew RealTimeJointTexture;
    auto *device = gfx::Device::getInstance();
    uint32_t texWidth = REALTIME_JOINT_TEXTURE_WIDTH;
    uint32_t texHeight = REALTIME_JOINT_TEXTURE_HEIGHT;
    gfx::Format textureFormat = gfx::Format::RGBA32F;

    gfx::FormatFeature formatFeature = device->getFormatFeatures(gfx::Format::RGBA32F);
    if (!(formatFeature & gfx::FormatFeature::SAMPLED_TEXTURE)) {
        textureFormat = gfx::Format::RGBA8;
        texWidth = texWidth * 4;
    }
    uint32_t length = 4 * REALTIME_JOINT_TEXTURE_WIDTH * REALTIME_JOINT_TEXTURE_HEIGHT;
    const size_t count = _dataArray.size();
    for (size_t i = 0; i < count; i++) {
        gfx::TextureInfo textureInfo;
        textureInfo.width = texWidth;
        textureInfo.height = texHeight;
        textureInfo.usage = gfx::TextureUsageBit::STORAGE | gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_SRC | gfx::TextureUsageBit::TRANSFER_DST;
        textureInfo.format = textureFormat;
        IntrusivePtr<gfx::Texture> texture = device->createTexture(textureInfo);
        _realTimeJointTexture->textures.push_back(texture);
    }
    _realTimeJointTexture->buffer = new float[length];
}

void SkinningModel::bindRealTimeJointTexture(uint32_t idx, gfx::DescriptorSet *descriptorset) {
    if (_realTimeJointTexture->textures.size() < idx + 1) return;
    gfx::Texture *texture = _realTimeJointTexture->textures[idx];
    if (texture) {
        gfx::SamplerInfo info{
            gfx::Filter::POINT,
            gfx::Filter::POINT,
            gfx::Filter::NONE,
            gfx::Address::CLAMP,
            gfx::Address::CLAMP,
            gfx::Address::CLAMP,
        };
        auto *device = gfx::Device::getInstance();
        auto *sampler = device->getSampler(info);
        descriptorset->bindTexture(pipeline::REALTIMEJOINTTEXTURE::BINDING, texture);
        descriptorset->bindSampler(pipeline::REALTIMEJOINTTEXTURE::BINDING, sampler);
    }
}

void SkinningModel::updateRealTimeJointTextureBuffer() {
    uint32_t bIdx = 0;
    uint32_t width = REALTIME_JOINT_TEXTURE_WIDTH;
    uint32_t height = REALTIME_JOINT_TEXTURE_HEIGHT;
    for (const auto &texture : _realTimeJointTexture->textures) {
        auto *buffer = _realTimeJointTexture->buffer;
        auto *dst = buffer;
        auto *src = _dataArray[bIdx];
        uint32_t count = width;
        for (uint32_t i = 0; i < count; i++) {
            dst = buffer + (4 * i);
            memcpy(dst, src, 16);
            src = src + 4;
            dst = buffer + (4 * (i + width));
            memcpy(dst, src, 16);
            src = src + 4;
            dst = buffer + 4 * (i + 2 * width);
            memcpy(dst, src, 16);
            src = src + 4;
        }
        uint32_t buffOffset = 0;
        gfx::TextureSubresLayers layer;
        gfx::Offset texOffset;
        gfx::Extent extent{width, height, 1};
        gfx::BufferTextureCopy region{
            buffOffset,
            width,
            height,
            texOffset,
            extent,
            layer};
        auto *device = gfx::Device::getInstance();

        device->copyBuffersToTexture(reinterpret_cast<const uint8_t *const *>(&buffer), texture, &region, 1);
        bIdx++;
    }
}

void SkinningModel::releaseData() {
    if (!_dataArray.empty()) {
        for (auto *data : _dataArray) {
            CC_SAFE_DELETE_ARRAY(data);
        }
        _dataArray.clear();
    }
    CC_SAFE_DELETE(_realTimeJointTexture);
    if (!_buffers.empty()) {
        for (gfx::Buffer *buffer : _buffers) {
            CC_SAFE_DESTROY(buffer);
        }
        _buffers.clear();
    }
}

} // namespace cc
