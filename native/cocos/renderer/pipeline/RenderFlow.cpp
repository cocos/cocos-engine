/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#include "RenderStage.h"

namespace cc {
namespace pipeline {

RenderFlow::~RenderFlow() {
}

bool RenderFlow::initialize(const RenderFlowInfo &info) {
    _name = info.name;
    _priority = info.priority;
    _tag = info.tag;
    _stages = info.stages;
    return true;
}

void RenderFlow::activate(RenderPipeline *pipeline) {
    _pipeline = pipeline;

    std::sort(_stages.begin(), _stages.end(), [](const RenderStage *s1, const RenderStage *s2) {
        return s1->getPriority() - s2->getPriority();
    });

    for (const auto stage : _stages)
        stage->activate(pipeline, this);
}

void RenderFlow::render(Camera *camera) {
    for (const auto stage : _stages)
        stage->render(camera);
}

void RenderFlow::destroy() {
    for (const auto stage : _stages)
        stage->destroy();

    _stages.clear();
}

} //namespace pipeline
} // namespace cc
