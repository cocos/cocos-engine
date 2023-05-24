/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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
#include "core/Root.h"
#include "scene/Model.h"

namespace cc {
class UIModelProxy final {
public:
    UIModelProxy();
    ~UIModelProxy();

    void initModel(Node* node);
    void activeSubModels();
    void uploadData();
    void destroy();
    void clear();
    inline scene::Model* getModel() const { return _model; }
    // For UIModel
    void updateModels(scene::Model* models);
    void attachDrawInfo();
    void attachNode(Node* node);
    void clearModels();

protected:
    CC_DISALLOW_COPY_MOVE_ASSIGN(UIModelProxy);

private:
    Node* _node{nullptr};
    IntrusivePtr<scene::Model> _model;
    ccstd::vector<IntrusivePtr<RenderingSubMesh>> _graphicsUseSubMeshes{};
    // For UIModel
    ccstd::vector<scene::Model*> _models{};

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
