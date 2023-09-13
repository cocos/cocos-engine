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
#include "renderer/gfx-base/GFXDef-common.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "scene/gpu-scene/Const.h"


namespace cc {
class Mesh;

namespace scene {
class GPUScene;
class Model;

struct SubMeshData {
    ccstd::hash_t attributesHash{0U};
    uint32_t indexStride{0U};

    uint32_t firstVertex{0U};
    uint32_t firstIndex{0U};
    uint32_t vertexCount{0U};
    uint32_t indexCount{0U};
};

struct MemoryBufferView {
    ccstd::vector<uint8_t> buffer;
    uint32_t stride{0U};
    uint32_t count{0U};

    explicit MemoryBufferView(uint32_t inStride)
    : stride(inStride) {}

    void push(const uint8_t* data, uint32_t size, uint32_t cnt);
};

class CC_DLL GPUMeshPool final : public RefCounted {
public:
    GPUMeshPool() = default;
    ~GPUMeshPool() override = default;

    void activate(GPUScene* scene);
    void destroy();

    void build(const ccstd::vector<Mesh*>& meshes);
    
    inline const SubMeshData& getSubMeshData(uint32_t index) const { return _meshes[index]; }
    inline gfx::Buffer* getVertexBuffer(ccstd::hash_t key) { return _vertexBuffers[key].get(); }
    inline gfx::Buffer* getIndexBuffer(uint32_t key) { return _indexBuffers[key].get(); }

private:
    void addMesh(Mesh* mesh);
    void redirectMesh(Mesh* mesh);
    void updateBuffers();

    GPUScene* _gpuScene{nullptr};
    ccstd::vector<SubMeshData> _meshes;
    bool _dirty{false};

    // Key is attributes hash
    ccstd::unordered_map<ccstd::hash_t, IntrusivePtr<gfx::Buffer>> _vertexBuffers;
    // Key is index stride
    ccstd::unordered_map<uint32_t, IntrusivePtr<gfx::Buffer>> _indexBuffers;
    // CPU side vertex buffer data
    ccstd::unordered_map<ccstd::hash_t, MemoryBufferView> _vbs;
    // CPU side index buffer data
    ccstd::unordered_map<uint32_t, MemoryBufferView> _ibs;

    friend class GPUScene;
};

} // namespace scene
} // namespace cc
