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
#include "base/std/container/vector.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/unordered_set.h"
#include "renderer/gfx-base/GFXDef-common.h"
#include "scene/gpu-scene/Const.h"
#include <climits>
#include <utility>

namespace cc {

namespace gfx {
class Shader;
class Buffer;
class InputAssembler;
class DescriptorSet;
class Texture;
}

namespace scene {
class Pass;
class Model;
class SubModel;
class GPUScene;

struct InstanceData {
    uint32_t objectId{UINT_MAX};
    uint32_t phaseId{UINT_MAX};
    uint32_t batchId{UINT_MAX};
};

using ObjectList = ccstd::unordered_set<uint32_t>;

struct CC_DLL BatchItem {
    /**
     * A BatchItem corresponds to a multi draw indirect
     * which uses [first, first + count) interval of indirect commands
     */
    uint32_t first{0U};
    uint32_t count{0U};

    gfx::Shader *shader{nullptr};
    gfx::InputAssembler *inputAssembler{nullptr};
    gfx::DescriptorSet *descriptorSet{nullptr};
    gfx::Texture *lightingMap{nullptr};
    uint32_t indexStride{0U};

    /**
     * Map from MeshPool index to ObjectPool index list, 
     * each key-value pair corresponds to a indirect command
     */
    ccstd::unordered_map<uint32_t, ObjectList> mesh2objects;
};

using BatchItemList = ccstd::vector<BatchItem>;

class CC_DLL GPUBatch final {
public:
    GPUBatch(GPUScene *scene, const Pass *pass);
    ~GPUBatch() = default;

    void destroy();

    void addSubModel(const SubModel *subModel, uint32_t passIdx);
    void removeSubModel(const SubModel *subModel, uint32_t passIdx);

    inline BatchItemList &getItems() { return _items; }
    inline const BatchItemList &getItems() const { return _items; }
    inline const Pass *getPass() const { return _pass; }
    inline bool empty() const { return _items.empty(); }

private:
    const GPUScene *_gpuScene{nullptr};
    const Pass *_pass{nullptr};
    BatchItemList _items;
};

class CC_DLL GPUBatchPool final : public RefCounted {
public:
    GPUBatchPool() = default;
    ~GPUBatchPool() override = default;

    void activate(GPUScene *scene);
    void destroy();
    void update(uint32_t stamp);

    void addModel(const Model *model);
    void removeModel(const Model *model);
    void removeAllModels();

    inline ccstd::unordered_map<Pass *, GPUBatch *> &getBatches() { return _batches; }
    inline uint32_t getIndirectCount() const { return static_cast<uint32_t>(_indirectCmds.size()); }
    inline uint32_t getInstanceCount() const { return static_cast<uint32_t>(_instances.size()); }
    static uint32_t getIndirectStride();

    inline gfx::Buffer *getInstanceBuffer() { return _instanceBuffer.get(); }
    inline gfx::Buffer *getIndirectBuffer() { return _indirectBuffer.get(); }

private:
    void createBuffers();
    void updateBuffers();

    GPUScene *_gpuScene{nullptr};
    ccstd::unordered_map<Pass *, GPUBatch *> _batches;
    ccstd::vector<InstanceData> _instances;
    ccstd::vector<gfx::DrawIndexedIndirectCommand> _indirectCmds;

    bool _dirty{false};
    IntrusivePtr<gfx::Buffer> _instanceBuffer;
    IntrusivePtr<gfx::Buffer> _indirectBuffer;
    uint32_t _instanceCapacity{GPU_INSTANCE_COUNT_INIT};
    uint32_t _indirectCapacity{GPU_INDIRECT_COUNT_INIT};
};

} // namespace scene
} // namespace cc
