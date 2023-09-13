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

#include "scene/gpu-scene/GPUScene.h"
#include "base/memory/Memory.h"
#include "scene/RenderScene.h"
#include "scene/Model.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {
namespace scene {

void GPUScene::activate(RenderScene* scene) {
    _scene = scene;

    _meshPool = ccnew GPUMeshPool();
    _meshPool->activate(this);

    _objectPool = ccnew GPUObjectPool();
    _objectPool->activate(this);

    _batchPool = ccnew GPUBatchPool();
    _batchPool->activate(this);
}

void GPUScene::destroy() {
    CC_SAFE_DESTROY_NULL(_batchPool);
    CC_SAFE_DESTROY_NULL(_objectPool);
    CC_SAFE_DESTROY_NULL(_meshPool);
}

void GPUScene::update(uint32_t stamp) {
    _objectPool->update(stamp);
    _batchPool->update(stamp);
}

void GPUScene::build(const ccstd::vector<Mesh*>& meshes) {
    _meshPool->build(meshes);
}

void GPUScene::addModel(const Model* model) {
    _objectPool->addModel(model);
    _batchPool->addModel(model);
}

void GPUScene::removeModel(const Model* model) {
    _batchPool->removeModel(model);
    _objectPool->removeModel(model);
}

void GPUScene::removeAllModels() {
    _batchPool->removeAllModels();
    _objectPool->removeAllModels();
}

} // namespace scene
} // namespace cc
