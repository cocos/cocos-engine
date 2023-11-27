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

#pragma once
#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "scene/gpu-scene/Const.h"
#include "scene/gpu-scene/GPUMeshPool.h"
#include "scene/gpu-scene/GPUObjectPool.h"
#include "scene/gpu-scene/GPUBatchPool.h"

namespace cc {
class Mesh;

namespace scene {
class RenderScene;
class Model;

class CC_DLL GPUScene final : public RefCounted {
public:
    GPUScene() = default;
    ~GPUScene() override = default;

    void activate(RenderScene* scene);
    void destroy();
    void update(uint32_t stamp);

    void build(const ccstd::vector<Mesh*>& meshes);

    void addModel(const Model* model);
    void removeModel(const Model* model);
    void removeAllModels();

    inline RenderScene* getScene() const { return _scene; }
    inline GPUMeshPool* getMeshPool() const { return _meshPool.get(); }
    inline GPUObjectPool* getObjectPool() const { return _objectPool.get(); }
    inline GPUBatchPool* getBatchPool() const { return _batchPool.get(); }

    inline uint32_t getIndirectCount() const { return _batchPool->getIndirectCount(); }
    inline uint32_t getInstanceCount() const { return _batchPool->getInstanceCount(); }
    inline bool empty() const { return _batchPool->getInstanceCount() == 0; }

    inline gfx::Buffer* getInstanceBuffer() { return _batchPool->getInstanceBuffer(); }
    inline gfx::Buffer* getIndirectBuffer() { return _batchPool->getIndirectBuffer(); }
    inline gfx::Buffer* getObjectBuffer() { return _objectPool->getObjectBuffer(); }

private:
    RenderScene* _scene{nullptr};
    IntrusivePtr<GPUMeshPool> _meshPool;
    IntrusivePtr<GPUObjectPool> _objectPool;
    IntrusivePtr<GPUBatchPool> _batchPool;
};

} // namespace scene
} // namespace cc
