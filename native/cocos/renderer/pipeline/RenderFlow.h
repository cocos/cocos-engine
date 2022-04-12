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
#include "scene/Camera.h"

namespace cc {
namespace pipeline {

class RenderPipeline;
class RenderStage;

struct CC_DLL RenderFlowInfo {
    String          name;
    uint            priority = 0;
    uint            tag      = 0;
    RenderStageList stages;
};

class CC_DLL RenderFlow : public Object {
public:
    RenderFlow() = default;
    ~RenderFlow() override;

    virtual bool initialize(const RenderFlowInfo &info);
    virtual void activate(RenderPipeline *pipeline);
    virtual void render(scene::Camera *camera);
    virtual void destroy();

    inline const String &getName() const { return _name; }
    inline uint          getPriority() const { return _priority; }
    inline uint          getTag() const { return _tag; }
    RenderStage *        getRenderstageByName(const String &name) const;

protected:
    RenderStageList _stages;
    String          _name;
    RenderPipeline *_pipeline = nullptr;
    uint            _priority = 0;
    uint            _tag      = 0;
};

} // namespace pipeline
} // namespace cc
