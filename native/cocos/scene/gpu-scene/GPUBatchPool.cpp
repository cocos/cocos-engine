/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "scene/gpu-scene/GPUBatchPool.h"
#include "scene/gpu-scene/GPUMeshPool.h"
#include "scene/gpu-scene/GPUScene.h"
#include "scene/SubModel.h"
#include "scene/Model.h"
#include "scene/Pass.h"
#include "core/assets/RenderingSubMesh.h"
#include "scene/RenderScene.h"
#include "renderer/gfx-base/GFXDevice.h"


namespace cc {
namespace scene {

GPUBatch::GPUBatch(GPUScene *scene, const Pass *pass)
: _gpuScene(scene)
, _pass(pass) {
}

void GPUBatch::destroy() {
    for (auto &item : _items) {
        CC_SAFE_DESTROY_AND_DELETE(item.inputAssembler);
    }

    _items.clear();
}

void GPUBatch::addSubModel(const SubModel* subModel, uint32_t passIdx) {
    const auto *subMesh = subModel->getSubMesh();
    const auto meshIdx = subMesh->getMeshPoolIndex();
    const auto objectIdx = subModel->getObjectPoolIndex();
    auto *shader = subModel->getShader(passIdx);
    auto *descriptorSet = subModel->getDescriptorSet();
    auto *lightingMap = descriptorSet->getTexture(pipeline::LIGHTMAPTEXTURE::BINDING);

    auto *meshPool = _gpuScene->getMeshPool();
    const auto &meshData = meshPool->getSubMeshData(meshIdx);

    for (auto &item : _items) {
        // whether to use the same lightmap
        if (item.lightingMap != lightingMap) {
            continue;
        }

        // whether to use the same shader
        if (item.shader != shader) {
            continue;
        }

        // whether to use the same vertex buffer
        if (item.inputAssembler->getAttributesHash() != meshData.attributesHash) {
            continue;
        }

        // whether to use the same index buffer
        if (item.indexStride != meshData.indexStride) {
            continue;
        }

        const auto iter = item.mesh2objects.find(meshIdx);
        if (iter != item.mesh2objects.cend()) {
            iter->second.insert(objectIdx);
        } else {
            item.mesh2objects.insert({meshIdx, {objectIdx}});
        }

        return;
    }

    auto *device = gfx::Device::getInstance();
    auto *const ib = meshPool->getIndexBuffer(meshData.indexStride);
    gfx::BufferList vbs = {meshPool->getVertexBuffer(meshData.attributesHash)};
    
    const gfx::InputAssemblerInfo info = {subMesh->getAttributes(), vbs, ib};
    auto *inputAssembler = device->createInputAssembler(info);

    BatchItem item{0, 0, shader, inputAssembler, descriptorSet, lightingMap, meshData.indexStride, {}};
    item.mesh2objects.insert({meshIdx, {objectIdx}});

    _items.push_back(item);
}

void GPUBatch::removeSubModel(const SubModel *subModel, uint32_t passIdx) {
    auto *subMesh = subModel->getSubMesh();
    const auto meshIdx = subMesh->getMeshPoolIndex();
    const auto objectIdx = subModel->getObjectPoolIndex();
    auto *shader = subModel->getShader(passIdx);

    auto *meshPool = _gpuScene->getMeshPool();
    const auto &meshData = meshPool->getSubMeshData(meshIdx);

    for (auto i = 0; i < _items.size(); i++) {
        auto &item = _items[i];
        if (item.shader != shader) {
            continue;
        }

        if (item.inputAssembler->getAttributesHash() != meshData.attributesHash) {
            continue;
        }

        if (item.indexStride != meshData.indexStride) {
            continue;
        }

        const auto iter = item.mesh2objects.find(meshIdx);
        if (iter != item.mesh2objects.cend()) {
            iter->second.erase(objectIdx);

            if (iter->second.empty()) {
                item.mesh2objects.erase(meshIdx);
            }

            if (item.mesh2objects.empty()) {
                CC_SAFE_DESTROY_AND_DELETE(item.inputAssembler);
                _items.erase(_items.begin() + i);
            }
        }

        return;
    }
}

void GPUBatchPool::activate(GPUScene *scene) {
    _gpuScene = scene;

    createBuffers();
}

void GPUBatchPool::destroy() {
    removeAllModels();
    CC_SAFE_DESTROY_NULL(_instanceBuffer);
    CC_SAFE_DESTROY_NULL(_indirectBuffer);
}

void GPUBatchPool::update(uint32_t stamp) {
    std::ignore = stamp;

    if (!_dirty) {
        return;
    }

    _dirty = false;
    _instances.clear();
    _indirectCmds.clear();

    uint32_t first = 0U;
    uint32_t batchId = 0U;
    const auto &meshPool = _gpuScene->getMeshPool();

    for (auto &batch : _batches) {
        const auto *pass = batch.second->getPass();
        const auto phaseId = pass->getPhaseID();
        auto &items = batch.second->getItems();

        for (auto &item : items) {
            item.first = first;
            item.count = static_cast<uint32_t>(item.mesh2objects.size());
            first += item.count;

            for (const auto &iter : item.mesh2objects) {
                const auto meshIdx = iter.first;
                const auto &meshData = meshPool->getSubMeshData(meshIdx);

                const auto indexCount = meshData.indexCount;
                const auto firstIndex = meshData.firstIndex;
                const auto firstVertex = static_cast<int32_t>(meshData.firstVertex);
                const auto firstInstance = static_cast<uint32_t>(_instances.size());
                // const auto instanceCount = static_cast<uint32_t>(iter.second.size());

                _indirectCmds.push_back({indexCount, 0, firstIndex, firstVertex, firstInstance});

                for (const auto &objectIdx : iter.second) {
                    _instances.push_back({objectIdx, phaseId, batchId});
                }

                batchId++;
            }
        }
    }

    updateBuffers();
}

void GPUBatchPool::addModel(const Model* model) {
    const auto &subModels = model->getSubModels();

    for (const auto &subModel : subModels) {
        const auto &passes = *subModel->getPasses();
        const auto passCount = passes.size();

        for (auto passIdx = 0; passIdx < passCount; passIdx++) {
            const auto &pass = passes[passIdx];
            auto iter = _batches.find(pass);
            if (iter == _batches.cend()) {
                iter = _batches.insert({pass, ccnew GPUBatch(_gpuScene, pass)}).first;
            }

            iter->second->addSubModel(subModel, passIdx);
        }
    }

    _dirty = true;
}

void GPUBatchPool::removeModel(const Model* model) {
    const auto &subModels = model->getSubModels();

    for (const auto &subModel : subModels) {
        const auto &passes = *subModel->getPasses();
        const auto passCount = passes.size();

        for (auto passIdx = 0; passIdx < passCount; passIdx++) {
            const auto &pass = passes[passIdx];
            auto iter = _batches.find(pass);
            if (iter == _batches.cend()) {
                continue;
            }

            iter->second->removeSubModel(subModel, passIdx);
        }
    }

    _dirty = true;
}

void GPUBatchPool::removeAllModels() {
    for (auto &batch : _batches) {
        CC_SAFE_DESTROY_AND_DELETE(batch.second);
    }

    _batches.clear();
    _instances.clear();
    _indirectCmds.clear();

    _dirty = true;
}

// Use this struct while firstInstance is not supported.
struct DrawIndexedIndirectCommandFallback {
    uint32_t indexCount{0};
    uint32_t instanceCount{0};
    uint32_t firstIndex{0};
    int32_t vertexOffset{0};
    uint32_t reservedMustBeZero{0};
    uint32_t firstInstance{0};
};

uint32_t GPUBatchPool::getIndirectStride() {
    auto *device = gfx::Device::getInstance();
    return device->getCapabilities().supportFirstInstance ?
        static_cast<uint32_t>(sizeof(gfx::DrawIndexedIndirectCommand)) :
        static_cast<uint32_t>(sizeof(DrawIndexedIndirectCommandFallback));
}

void GPUBatchPool::createBuffers() {
    auto *device = gfx::Device::getInstance();

    const auto instanceStride = static_cast<uint32_t>(sizeof(InstanceData));
    const auto instanceSize = instanceStride * _instanceCapacity;

    _instanceBuffer = device->createBuffer({gfx::BufferUsageBit::STORAGE,
                                            gfx::MemoryUsageBit::DEVICE,
                                            instanceSize,
                                            instanceStride});

    const auto indirectStride = getIndirectStride();
    const auto indirectSize = indirectStride * _indirectCapacity;

    _indirectBuffer = device->createBuffer({gfx::BufferUsageBit::TRANSFER_SRC | gfx::BufferUsageBit::STORAGE,
                                            gfx::MemoryUsageBit::DEVICE,
                                            indirectSize,
                                            indirectStride});
}

void GPUBatchPool::updateBuffers() {
    auto *device = gfx::Device::getInstance();
    const auto supportFirstInstance = device->getCapabilities().supportFirstInstance;

    const auto instanceCount = static_cast<uint32_t>(_instances.size());
    const auto instanceStride = static_cast<uint32_t>(sizeof(InstanceData));

    if (instanceCount > _instanceCapacity) {
        _instanceCapacity = utils::nextPOT(instanceCount);
        _instanceBuffer->resize(instanceStride * _instanceCapacity);
    }

    if (instanceCount > 0) {
        const auto instanceSize = instanceStride * instanceCount;
        _instanceBuffer->update(_instances.data(), instanceSize);
    }

    const auto indirectCount =  static_cast<uint32_t>(_indirectCmds.size());
    const auto indirectStride = getIndirectStride();

    if (indirectCount > _indirectCapacity) {
        _indirectCapacity = utils::nextPOT(indirectCount);
        _indirectBuffer->resize(indirectStride * _indirectCapacity);
    }

    if (indirectCount > 0) {
        const auto indirectSize = indirectStride * indirectCount;

        if (supportFirstInstance) {
            _indirectBuffer->update(_indirectCmds.data(), indirectSize);
        } else {
            ccstd::vector<DrawIndexedIndirectCommandFallback> indirectCmds;
            indirectCmds.reserve(indirectCount);

            for (auto i = 0; i < indirectCount; i++) {
                const auto &cmd = _indirectCmds[i];
                indirectCmds.push_back({cmd.indexCount, cmd.instanceCount, cmd.firstIndex, cmd.vertexOffset, 0, cmd.firstInstance});
            }

            _indirectBuffer->update(indirectCmds.data(), indirectSize);
        }
    }
}

} // namespace scene
} // namespace cc
