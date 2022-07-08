/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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
#include "base/Macros.h"
#include "core/Root.h"
#include "scene/Model.h"

namespace cc {
class UIModelProxy final {
public:
    UIModelProxy();
    ~UIModelProxy() = default;

    void initModel(Node* node);
    void activeSubModel(uint8_t val);
    void uploadData();
    void destroy();
    void clear();
    // For UIModel
    void updateModels(scene::Model* models);
    void attachDrawInfo();
    void attachNode(Node* node);

protected:
    CC_DISALLOW_COPY_MOVE_ASSIGN(UIModelProxy);

private:
    Node* _node{nullptr};
    ccstd::vector<scene::Model*> _models{};
    ccstd::vector<RenderingSubMesh*> _graphicsUseSubMeshes{};
    // For UIModel
    scene::Model* _model{nullptr};

    gfx::Device* _device{nullptr};
    uint32_t _stride{32};
    ccstd::vector<gfx::Attribute> _attributes{
        gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
        gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA32F},
        gfx::Attribute{"a_dist", gfx::Format::R32F},
    };
    gfx::PrimitiveMode _primitiveMode{gfx::PrimitiveMode::TRIANGLE_LIST};
};
} // namespace cc
