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
#include "3d/models/SkinningModel.h"

#include <array>
#include <utility>

#include "3d/assets/Mesh.h"
#include "3d/assets/Skeleton.h"
#include "core/scene-graph/Node.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "scene/Pass.h"
#include "scene/RenderScene.h"

namespace {
void getRelevantBuffers(std::vector<index_t> &outIndices, std::vector<int32_t> &outBuffers, const std::vector<std::vector<int32_t>> &jointMaps, int32_t targetJoint) {
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

std::vector<cc::scene::IMacroPatch> myPatches{{"CC_USE_SKINNING", true}};

} // namespace
namespace cc {

SkinningModel::SkinningModel() {
    _type = Model::Type::SKINNING;
}
SkinningModel::~SkinningModel() {
    for (auto *curr : _dataArray) {
        delete curr;
    }
}

void SkinningModel::destroy() {
    bindSkeleton(nullptr, nullptr, nullptr);
    if (!_buffers.empty()) {
        for (gfx::Buffer *buffer : _buffers) {
            CC_SAFE_DESTROY(buffer);
        }
        _buffers.clear();
    }
    Super::destroy();
}

void SkinningModel::bindSkeleton(Skeleton *skeleton, Node *skinningRoot, Mesh *mesh) {
    for (const JointInfo &joint : _joints) {
        deleteTransform(joint.target);
    }
    _bufferIndices.clear();
    _joints.clear();

    if (!skeleton || !skinningRoot || !mesh) return;
    setTransform(skinningRoot);
    auto        boneSpaceBounds = mesh->getBoneSpaceBounds(skeleton);
    const auto &jointMaps       = mesh->getStruct().jointMaps;
    ensureEnoughBuffers((jointMaps.has_value() && !jointMaps->empty()) ? static_cast<int32_t>(jointMaps->size()) : 1);
    _bufferIndices = mesh->getJointBufferIndices();

    for (index_t index = 0; index < skeleton->getJoints().size(); ++index) {
        geometry::AABB *bound  = boneSpaceBounds[index];
        auto *          target = skinningRoot->getChildByPath(skeleton->getJoints()[index]);
        if (!bound || !target) continue;

        auto *               transform = cc::getTransform(target, skinningRoot);
        const Mat4 &         bindPose  = skeleton->getBindposes()[index];
        std::vector<index_t> indices;
        std::vector<index_t> buffers;
        if (!jointMaps.has_value()) {
            indices.emplace_back(index);
            buffers.emplace_back(0);
        } else {
            getRelevantBuffers(indices, buffers, jointMaps.value(), index);
        }

        JointInfo jointInfo;
        jointInfo.bound     = bound;
        jointInfo.target    = target;
        jointInfo.bindpose  = bindPose;
        jointInfo.transform = transform;
        jointInfo.buffers   = std::move(buffers);
        jointInfo.indices   = std::move(indices);
        _joints.emplace_back(std::move(jointInfo));
    }
}

void SkinningModel::updateTransform(uint32_t stamp) {
    auto *root = getTransform();
    if (root->getChangedFlags() || root->getDirtyFlag()) {
        root->updateWorldTransform();
        _localDataUpdated = true;
    }
    Vec3           v3Min{INFINITY, INFINITY, INFINITY};
    Vec3           v3Max{-INFINITY, -INFINITY, -INFINITY};
    geometry::AABB ab1;
    Vec3           v31;
    Vec3           v32;
    for (JointInfo &jointInfo : _joints) {
        const auto *bound       = jointInfo.bound;
        auto *      transform   = jointInfo.transform;
        Mat4        worldMatrix = cc::getWorldMatrix(transform, static_cast<int32_t>(stamp));
        jointInfo.bound->transform(worldMatrix, &ab1);
        ab1.getBoundary(&v31, &v32);
        Vec3::min(v3Min, v31, &v3Min);
        Vec3::max(v3Max, v32, &v3Max);
    }
    if (_modelBounds->isValid() && _worldBounds) {
        geometry::AABB::fromPoints(v3Min, v3Max, _modelBounds);
        _modelBounds->transform(root->getWorldMatrix(), _worldBounds);
    }
}

void SkinningModel::updateUBOs(uint32_t stamp) {
    Super::updateUBOs(stamp);
    uint32_t bIdx = 0;
    Mat4     mat4;
    for (const JointInfo &jointInfo : _joints) {
        Mat4::multiply(jointInfo.transform->world, jointInfo.bindpose, &mat4);
        for (uint32_t buffer : jointInfo.buffers) {
            uploadJointData(jointInfo.indices[bIdx] * 12, mat4, _dataArray[buffer]->data());
            bIdx++;
        }
        bIdx = 0;
    }
    bIdx = 0;
    for (const auto &buffer : _buffers) {
        buffer->update(_dataArray[bIdx]->data(), buffer->getSize());
        bIdx++;
    }
}

void SkinningModel::initSubModel(index_t idx, RenderingSubMesh *subMeshData, Material *mat) {
    const auto &original = subMeshData->getVertexBuffers();
    auto &      iaInfo   = subMeshData->getIaInfo();
    iaInfo.vertexBuffers = subMeshData->getJointMappedBuffers();
    Super::initSubModel(idx, subMeshData, mat);
    iaInfo.vertexBuffers = original;
}

std::vector<scene::IMacroPatch> &SkinningModel::getMacroPatches(index_t subModelIndex) {
    auto &patches = Super::getMacroPatches(subModelIndex);
    patches.reserve(myPatches.size() + patches.size());
    patches.insert(std::begin(patches), std::begin(myPatches), std::end(myPatches));
    return patches;
}

void SkinningModel::uploadJointData(uint32_t base, const Mat4 &mat, float *dst) {
    memcpy(reinterpret_cast<void *>(dst + base), mat.m, sizeof(float) * 12);
    dst[base + 3]  = mat.m[12];
    dst[base + 7]  = mat.m[13];
    dst[base + 11] = mat.m[14];
}

void SkinningModel::updateLocalDescriptors(index_t submodelIdx, gfx::DescriptorSet *descriptorset) {
    Super::updateLocalDescriptors(submodelIdx, descriptorset);
    gfx::Buffer *buffer = _buffers[_bufferIndices[submodelIdx]];
    if (buffer) {
        descriptorset->bindBuffer(pipeline::UBOSkinning::BINDING, buffer);
    }
}

void SkinningModel::updateInstancedAttributes(const std::vector<gfx::Attribute> &attributes, scene::Pass *pass) {
    if (pass->getBatchingScheme() != scene::BatchingSchemes::NONE) {
        // TODO(holycanvas): #9203 better to print the complete path instead of only the current node
        // warnID(3936, this.node.name);
        CC_LOG_WARNING("pass batchingScheme is none, %s", getNode()->getName().c_str());
    }
    Super::updateInstancedAttributes(attributes, pass);
}

void SkinningModel::ensureEnoughBuffers(index_t count) {
    for (index_t i = 0; i < count; i++) {
        if (i >= _buffers.size()) {
            _buffers.resize(i + 1);
        }

        if (_buffers[i] == nullptr) {
            _buffers[i] = _device->createBuffer({
                gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
                gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
                pipeline::UBOSkinning::SIZE,
                pipeline::UBOSkinning::SIZE,
            });
        }

        if (i >= _dataArray.size()) {
            _dataArray.resize(i + 1);
        }

        if (_dataArray[i] == nullptr) {
            _dataArray[i] = new std::array<float, pipeline::UBOSkinning::COUNT>;
        }
    }
}
} // namespace cc
