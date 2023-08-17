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

#include "Define.h"
#include "base/RefCounted.h"
#include "base/std/container/unordered_map.h"
#include "scene/Model.h"
#include "scene/Pass.h"

namespace cc {
namespace gfx {
class Device;
}
namespace pipeline {
struct PSOInfo;

struct CC_DLL InstancedItem {
    uint32_t capacity = 0;
    gfx::Buffer *vb = nullptr;
    uint8_t *data = nullptr;
    gfx::InputAssembler *ia = nullptr;
    uint32_t stride = 0;
    gfx::Shader *shader = nullptr;
    gfx::DescriptorSet *descriptorSet = nullptr;
    gfx::Texture *lightingMap = nullptr;
    gfx::Texture *reflectionProbeCubemap = nullptr;
    gfx::Texture *reflectionProbePlanarMap = nullptr;
    uint32_t reflectionProbeType = 0;
    gfx::Texture *reflectionProbeBlendCubemap = nullptr;
    gfx::DrawInfo drawInfo;
};
using InstancedItemList = ccstd::vector<InstancedItem>;
using DynamicOffsetList = ccstd::vector<uint32_t>;

class InstancedBuffer : public RefCounted {
public:
    static constexpr uint32_t INITIAL_CAPACITY = 32;
    static constexpr uint32_t MAX_CAPACITY = 1024;

    explicit InstancedBuffer(const scene::Pass *pass);
    ~InstancedBuffer() override;

    void destroy();
    void merge(scene::SubModel *, uint32_t);
    void merge(scene::SubModel *, uint32_t, gfx::Shader *);
    void uploadBuffers(gfx::CommandBuffer *cmdBuff) const;
    void clear();
    void setDynamicOffset(uint32_t idx, uint32_t value);

    inline const InstancedItemList &getInstances() const { return _instances; }
    inline const scene::Pass *getPass() const { return _pass; }
    inline void setPass(const scene::Pass *pass) noexcept { _pass = pass; }
    inline bool hasPendingModels() const { return _hasPendingModels; }
    inline const DynamicOffsetList &dynamicOffsets() const { return _dynamicOffsets; }

private:
    InstancedItemList _instances;
    // weak reference
    const scene::Pass *_pass{nullptr};
    bool _hasPendingModels{false};
    DynamicOffsetList _dynamicOffsets;
    // weak reference
    gfx::Device *_device{nullptr};
};

} // namespace pipeline
} // namespace cc
