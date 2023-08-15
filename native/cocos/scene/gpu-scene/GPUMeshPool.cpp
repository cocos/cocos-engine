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

namespace cc {
namespace scene {

void GPUMeshPool::activate(GPUScene* scene) {
    _gpuScene = scene;
}

void GPUMeshPool::destroy() {
    for (auto& iter : _vertexBuffers) {
        CC_SAFE_DESTROY_NULL(iter.second);
    }
    _vertexBuffers.clear();

    for (auto& iter : _indexBuffers) {
        CC_SAFE_DESTROY_NULL(iter.second);
    }
    _indexBuffers.clear();

    _meshes.clear();
}

struct BufferView {
    ccstd::vector<uint8_t> buffer;
    uint32_t stride{0U};
    uint32_t count{0U};

    explicit BufferView(uint32_t inStride)
    : stride(inStride) {}

    void push(const uint8_t* data, uint32_t size, uint32_t cnt) {
        CC_ASSERT(cnt * stride == size);
        const auto offset = stride * count;
        const auto free = buffer.size() - offset;
        if (free < size) {
            const auto newSize = (offset + size) * 4;
            buffer.resize(newSize);
        }

        std::memcpy(&buffer[0] + offset, data, size);
        count += cnt;
    }
};

void GPUMeshPool::build(const ccstd::vector<Mesh*>& meshes) {
    // Remove duplicated meshes
    ccstd::unordered_set<Mesh*> meshSet;
    for (auto* mesh : meshes) {
        meshSet.insert(mesh);
    }

    ccstd::unordered_map<ccstd::hash_t, BufferView> vbs;
    ccstd::unordered_map<uint32_t, BufferView> ibs;

    for (const auto& mesh : meshSet) {
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

            auto vb = vbs.find(attrHash);
            if (vb == vbs.cend()) {
                vb = vbs.insert({attrHash, BufferView(vbStride)}).first;
            }

            auto ib = ibs.find(ibStride);
            if (ib == ibs.cend()) {
                ib = ibs.insert({ibStride, BufferView(ibStride)}).first;
            }

            subMesh->setMeshPoolIndex(static_cast<uint32_t>(_meshes.size()));
            _meshes.push_back({attrHash, ibStride, vb->second.count, ib->second.count, vbCount, ibCount});

            vb->second.push(buffer->getData() + vertexBundle.view.offset, vertexBundle.view.length, vbCount);
            ib->second.push(buffer->getData() + indexView.offset, indexView.length, ibCount);

            // Destroy subMesh's private buffers
            subMesh->destroy();
        }

        // Release CPU side data if necessary
        if (!mesh->isAllowDataAccess()) {
            mesh->releaseData();
        }
    }

    auto* device = gfx::Device::getInstance();
    for (const auto &iter : vbs) {
        const auto size = iter.second.stride * iter.second.count;
        auto* vb = device->createBuffer({gfx::BufferUsageBit::VERTEX,
                                         gfx::MemoryUsageBit::DEVICE,
                                         size,
                                         iter.second.stride});

        vb->update(iter.second.buffer.data(), size);
        _vertexBuffers.insert({iter.first, vb});
    }

    for (const auto& iter : ibs) {
        const auto size = iter.second.stride * iter.second.count;
        auto* ib = device->createBuffer({gfx::BufferUsageBit::INDEX,
                                         gfx::MemoryUsageBit::DEVICE,
                                         size,
                                         iter.second.stride});

        ib->update(iter.second.buffer.data(), size);
        _indexBuffers.insert({iter.first, ib});
    }
}

} // namespace scene
} // namespace cc
