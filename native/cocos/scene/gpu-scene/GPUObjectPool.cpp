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

#include "scene/gpu-scene/GPUObjectPool.h"
#include "scene/gpu-scene/GPUScene.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "scene/RenderScene.h"
#include "scene/Model.h"
#include "scene/SubModel.h"
#include "base/memory/Memory.h"
#include "base/Utils.h"
#include "math/Vec3.h"

namespace cc {
namespace scene {

void GPUObjectPool::activate(GPUScene* scene) {
    _gpuScene = scene;

    createBuffer();
}

void GPUObjectPool::destroy() {
    CC_SAFE_DESTROY_NULL(_objectBuffer);

    _objects.clear();
    _freeSlots.clear();
}

void GPUObjectPool::update(uint32_t stamp) {
    const auto* scene = _gpuScene->getScene();
    const auto& gpuModels = scene->getGPUModels();
    Mat4 worldMatrixIT;

    for (const auto& model : gpuModels) {
        if (model->isEnabled()) {
            model->updateTransform(stamp);

            for (SubModel* subModel : model->getSubModels()) {
                subModel->update();
            }

            if (!model->isLocalDataUpdated()) {
                continue;
            }

            model->setLocalDataUpdated(true);
            const auto& subModels = model->getSubModels();
            if (subModels.empty()) {
                continue;
            }

            const auto& worldMatrix = model->getTransform()->getWorldMatrix();
            Mat4::inverseTranspose(worldMatrix, &worldMatrixIT);
            const auto* worldBound = model->getWorldBounds();
            CC_ASSERT(worldBound);

            const auto& boxCenter = worldBound->getCenter();
            const auto& boxHalfExtents = worldBound->getHalfExtents();
            const auto radius = boxHalfExtents.length();
            const Vec4 sphere{boxCenter.x, boxCenter.y, boxCenter.z, radius};
            const Vec4 halfExtents{boxHalfExtents.x, boxHalfExtents.y, boxHalfExtents.z, 0.0F};
            const auto& lightmapUVParam = model->getLightmapUVParam();
            const auto& shadowBias = model->getShadowBiasParam();

            // All submodels use the same object data.
            const auto index = subModels[0]->getObjectPoolIndex();
            if (index == UINT_MAX) {
                continue;
            }

            _objects[index] = {worldMatrix, worldMatrixIT, sphere, halfExtents, lightmapUVParam, shadowBias};
            _dirty = true;
        }
    }

    updateBuffer();
}

void GPUObjectPool::addModel(const Model* model) {
    const auto& subModels = model->getSubModels();
    if (subModels.empty()) {
        return;
    }

    Mat4 worldMatrixIT;
    const auto& worldMatrix = model->getTransform()->getWorldMatrix();
    Mat4::inverseTranspose(worldMatrix, &worldMatrixIT);
    const auto* worldBound = model->getWorldBounds();
    CC_ASSERT(worldBound);
    
    const auto& boxCenter = worldBound->getCenter();
    const auto& boxHalfExtents = worldBound->getHalfExtents();
    const auto radius = boxHalfExtents.length();
    const Vec4 sphere{boxCenter.x, boxCenter.y, boxCenter.z, radius};
    const Vec4 halfExtents{boxHalfExtents.x, boxHalfExtents.y, boxHalfExtents.z, 0.0F};
    const auto& lightmapUVParam = model->getLightmapUVParam();
    const auto& shadowBias = model->getShadowBiasParam();

    uint32_t index = 0;
    if (_freeSlots.empty()) {
        index = static_cast<uint32_t>(_objects.size());
        _objects.push_back({worldMatrix, worldMatrixIT, sphere, halfExtents, lightmapUVParam, shadowBias});
    } else {
        index = _freeSlots.front();
        _objects[index] = {worldMatrix, worldMatrixIT, sphere, halfExtents, lightmapUVParam, shadowBias};
        _freeSlots.pop_front();
    }
    _dirty = true;

    // All submodels share the same object index
    for (const auto& subModel : subModels) {
        subModel->setObjectPoolIndex(index);
    }
}

void GPUObjectPool::removeModel(const Model* model) {
    const auto& subModels = model->getSubModels();
    if (subModels.empty()) {
        return;
    }

    // All submodels share the same object index
    const auto index = subModels[0]->getObjectPoolIndex();
    if (index != UINT_MAX) {
        _freeSlots.push_back(index);
    }

    // Do not set _dirty = true here, because we don't change _objects for efficiency
}

void GPUObjectPool::removeAllModels() {
    _objects.clear();
    _freeSlots.clear();
}

void GPUObjectPool::createBuffer() {
    auto* device = gfx::Device::getInstance();
    const auto stride = static_cast<uint32_t>(sizeof(ObjectData));
    const auto size = stride * _objectCapacity;

    _objectBuffer = device->createBuffer({gfx::BufferUsageBit::STORAGE,
                                          gfx::MemoryUsageBit::DEVICE | gfx::MemoryUsageBit::HOST,
                                          size,
                                          stride});
}

void GPUObjectPool::updateBuffer() {
    if (!_dirty) {
        return;
    }

    const auto objectCount = static_cast<uint32_t>(_objects.size());
    const auto stride = static_cast<uint32_t>(sizeof(ObjectData));

    if (objectCount > _objectCapacity) {
        _objectCapacity = utils::nextPOT(objectCount);
        _objectBuffer->resize(stride * _objectCapacity);
    }

    if (objectCount > 0) {
        const auto size = stride * objectCount;
        _objectBuffer->update(_objects.data(), size);
    }

    _dirty = false;
}

} // namespace scene
} // namespace cc
