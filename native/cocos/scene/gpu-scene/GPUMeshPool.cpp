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

#include "scene/gpu-scene/GPUMeshPool.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/gfx-base/GFXDef.h"
#include "scene/RenderScene.h"
#include "scene/Model.h"
#include "scene/SubModel.h"
#include "core/assets/RenderingSubMesh.h"
#include "3d/assets/Mesh.h"
#include "base/memory/Memory.h"
#include "base/std/container/unordered_set.h"

namespace cc {
namespace scene {

void MemoryBufferView::push(const uint8_t* data, uint32_t size, uint32_t cnt) {
    CC_ASSERT(cnt * stride == size);
    const auto offset = stride * count;
    const auto free = buffer.size() - offset;
    if (free < size) {
        const auto newSize = (offset + size) * 2;
        buffer.resize(newSize);
    }

    std::memcpy(&buffer[0] + offset, data, size);
    count += cnt;
}

void GPUMeshPool::activate(GPUScene* scene) {
    _gpuScene = scene;
}

void GPUMeshPool::destroy() {
    for (auto& iter : _vertexBuffers) {
        CC_SAFE_DESTROY_NULL(iter.second);
    }

    for (auto& iter : _indexBuffers) {
        CC_SAFE_DESTROY_NULL(iter.second);
    }

    _vertexBuffers.clear();
    _indexBuffers.clear();
    _vbs.clear();
    _ibs.clear();
    _meshes.clear();
}

void GPUMeshPool::build(const ccstd::vector<Mesh*>& meshes) {
    ccstd::unordered_set<Mesh*> meshSet;
    for (auto* mesh : meshes) {
        meshSet.insert(mesh);
    }

    for (const auto& mesh : meshSet) {
        addMesh(mesh);
    }

    updateBuffers();

    // Note: must redirect mesh after updateBuffers
    for (const auto& mesh : meshSet) {
        redirectMesh(mesh);
    }
}

void GPUMeshPool::addMesh(Mesh* mesh) {
    if (!mesh || mesh->isInGPUScene()) {
        return;
    }

    const auto& structInfo = mesh->getStruct();
    const auto& data = mesh->getData();
    const auto* buffer = data.buffer();
    const auto& subMeshes = mesh->getRenderingSubMeshes();

    for (const auto& subMesh : subMeshes) {
        CC_ASSERT(subMesh->getSubMeshIdx().has_value());
        const auto subMeshIndex = subMesh->getSubMeshIdx().value();
        const auto& primitive = structInfo.primitives[subMeshIndex];

        CC_ASSERT(primitive.vertexBundelIndices.size() == 1);
        const auto idx = primitive.vertexBundelIndices[0];
        const auto& vertexBundle = structInfo.vertexBundles[idx];

        CC_ASSERT(primitive.indexView.has_value());
        const auto& indexView = primitive.indexView.value();

        const auto vbCount = vertexBundle.view.count;
        const auto vbStride = vertexBundle.view.stride;
        const auto ibCount = indexView.count;
        const auto ibStride = indexView.stride;
        const auto attrHash = computeAttributesHash(vertexBundle.attributes);

        auto vb = _vbs.find(attrHash);
        if (vb == _vbs.cend()) {
            vb = _vbs.insert({attrHash, MemoryBufferView(vbStride)}).first;
        }

        auto ib = _ibs.find(ibStride);
        if (ib == _ibs.cend()) {
            ib = _ibs.insert({ibStride, MemoryBufferView(ibStride)}).first;
        }

        subMesh->setMeshPoolIndex(static_cast<uint32_t>(_meshes.size()));
        _meshes.push_back({attrHash, ibStride, vb->second.count, ib->second.count, vbCount, ibCount});

        vb->second.push(buffer->getData() + vertexBundle.view.offset, vertexBundle.view.length, vbCount);
        ib->second.push(buffer->getData() + indexView.offset, indexView.length, ibCount);
    }

    mesh->setInGPUScene(true);

    // Release CPU side data if necessary
#if !CC_EDITOR
    if (!mesh->isAllowDataAccess()) {
        mesh->releaseData();
    }
#endif

    _dirty = true;
}

void GPUMeshPool::redirectMesh(Mesh* mesh) {
    const auto& subMeshes = mesh->getRenderingSubMeshes();

    for (const auto& subMesh : subMeshes) {
        const auto meshIdx = subMesh->getMeshPoolIndex();
        const auto& meshData = _meshes[meshIdx];

        auto* vb = getVertexBuffer(meshData.attributesHash);
        auto* ib = getIndexBuffer(meshData.indexStride);
        gfx::BufferList vbs = {vb};

        // Reset subMesh's buffers to GPUMeshPool.
        subMesh->resetBuffers(vbs, ib, meshData.vertexCount, meshData.firstVertex, meshData.indexCount, meshData.firstIndex, meshData.firstVertex);
    }
}

void GPUMeshPool::updateBuffers() {
    if (!_dirty) {
        return;
    }

    auto* device = gfx::Device::getInstance();
    for (auto& iter : _vbs) {
        const auto size = iter.second.stride * iter.second.count;
        auto vb = _vertexBuffers.find(iter.first);
        if (vb == _vertexBuffers.cend()) {
            auto* buffer = device->createBuffer({gfx::BufferUsageBit::VERTEX,
                                                 gfx::MemoryUsageBit::DEVICE,
                                                 size,
                                                 iter.second.stride});

            buffer->update(iter.second.buffer.data(), size);
            _vertexBuffers.insert({iter.first, buffer});
        } else {
            auto& buffer = vb->second;
            if (buffer->getSize() != size) {
                buffer->resize(size);
                buffer->update(iter.second.buffer.data(), size);
            }
        }

        // Release CPU side buffer
        iter.second.buffer.clear();
        iter.second.buffer.shrink_to_fit();
    }

    for (auto& iter : _ibs) {
        const auto size = iter.second.stride * iter.second.count;
        auto ib = _indexBuffers.find(iter.first);
        if (ib == _indexBuffers.cend()) {
            auto* buffer = device->createBuffer({gfx::BufferUsageBit::INDEX,
                                                 gfx::MemoryUsageBit::DEVICE,
                                                 size,
                                                 iter.second.stride});

            buffer->update(iter.second.buffer.data(), size);
            _indexBuffers.insert({iter.first, buffer});
        } else {
            auto& buffer = ib->second;
            if (buffer->getSize() != size) {
                buffer->resize(size);
                buffer->update(iter.second.buffer.data(), size);
            }
        }

        // Release CPU side buffer
        iter.second.buffer.clear();
        iter.second.buffer.shrink_to_fit();
    }

    _dirty = false;
}

} // namespace scene
} // namespace cc
