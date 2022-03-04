/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include "Define.h"
#include "scene/Model.h"
#include "scene/Pass.h"

namespace cc {
namespace gfx {
class Device;
}
namespace pipeline {
struct PSOInfo;

#if defined(INITIAL_CAPACITY)
    #undef INITIAL_CAPACITY
#endif

struct CC_DLL InstancedItem {
    uint                 count         = 0;
    uint                 capacity      = 0;
    gfx::Buffer *        vb            = nullptr;
    uint8_t *            data          = nullptr;
    gfx::InputAssembler *ia            = nullptr;
    uint                 stride        = 0;
    gfx::Shader *        shader        = nullptr;
    gfx::DescriptorSet * descriptorSet = nullptr;
    gfx::Texture *       lightingMap   = nullptr;
};
using InstancedItemList = vector<InstancedItem>;
using DynamicOffsetList = vector<uint>;

class InstancedBuffer : public Object {
public:
    static constexpr uint   INITIAL_CAPACITY = 32;
    static constexpr uint   MAX_CAPACITY     = 1024;
    static InstancedBuffer *get(scene::Pass *pass);
    static InstancedBuffer *get(scene::Pass *, uint extraKey);
    static void             destroyInstancedBuffer();

    explicit InstancedBuffer(const scene::Pass *pass);
    ~InstancedBuffer() override;

    void destroy();
    void merge(const scene::Model *, const scene::SubModel *, uint);
    void merge(const scene::Model *, const scene::SubModel *, uint, gfx::Shader *);
    void uploadBuffers(gfx::CommandBuffer *cmdBuff);
    void clear();
    void setDynamicOffset(uint idx, uint value);

    inline const InstancedItemList &getInstances() const { return _instances; }
    inline const scene::Pass *      getPass() const { return _pass; }
    inline bool                     hasPendingModels() const { return _hasPendingModels; }
    inline const DynamicOffsetList &dynamicOffsets() const { return _dynamicOffsets; }

private:
    static map<scene::Pass *, map<uint, InstancedBuffer *>> buffers;
    InstancedItemList                                       _instances;
    const scene::Pass *                                     _pass             = nullptr;
    bool                                                    _hasPendingModels = false;
    DynamicOffsetList                                       _dynamicOffsets;
    gfx::Device *                                           _device = nullptr;
};

} // namespace pipeline
} // namespace cc
