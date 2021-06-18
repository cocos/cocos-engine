/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
 
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

#include <vector>
#include "math/Mat4.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "scene/Model.h"

namespace cc {
namespace scene {

struct JointTransform {
    Mat4 world;
};

struct JointInfo {
    Mat4                       bindpose;
    JointTransform *           transform;
    std::vector<gfx::Buffer *> buffers;
    std::vector<uint32_t>      indices;
};

class SkinningModel : public Model {
public:
    SkinningModel()                      = default;
    SkinningModel(const SkinningModel &) = delete;
    SkinningModel(SkinningModel &&)      = delete;
    ~SkinningModel() override            = default;
    SkinningModel &operator=(const SkinningModel &) = delete;
    SkinningModel &operator=(SkinningModel &&) = delete;

    void updateTransform() override;
    void updateUBOs(uint32_t /*unused*/) override;

private:
    std::vector<gfx::Buffer *> _buffers;
    std::vector<JointInfo *>   _joints;
};

} // namespace scene
} // namespace cc
