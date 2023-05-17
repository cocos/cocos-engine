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

#include "RenderFlow.h"
#include <algorithm>
#include "RenderStage.h"
#include "base/memory/Memory.h"

namespace cc {
namespace pipeline {

RenderFlow::RenderFlow() = default;

RenderFlow::~RenderFlow() = default;

bool RenderFlow::initialize(const RenderFlowInfo &info) {
    _name = info.name;
    _priority = info.priority;
    _tag = info.tag;
    _stages = info.stages;
    _isResourceOwner = false;
    return true;
}

void RenderFlow::activate(RenderPipeline *pipeline) {
    _pipeline = pipeline;

    std::sort(_stages.begin(), _stages.end(), [](const RenderStage *s1, const RenderStage *s2) {
        return s1->getPriority() < s2->getPriority();
    });

    for (auto const &stage : _stages) {
        stage->activate(pipeline, this);
    }
}

void RenderFlow::render(scene::Camera *camera) {
    for (auto const &stage : _stages) {
        stage->render(camera);
    }
}

void RenderFlow::destroy() {
    for (auto &stage : _stages) {
        CC_SAFE_DESTROY(stage);
    }

    _stages.clear();
}

RenderStage *RenderFlow::getRenderstageByName(const ccstd::string &name) const {
    for (auto const &node : _stages) {
        if (node->getName() == name) {
            return node;
        }
    }
    return nullptr;
}

} //namespace pipeline
} // namespace cc
