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
#include "RenderStage.h"
#include "base/RefCounted.h"

namespace cc {
namespace scene {
class Camera;
}
namespace pipeline {

class RenderPipeline;
class RenderStage;

struct CC_DLL RenderFlowInfo {
    ccstd::string name;
    uint32_t priority = 0;
    uint32_t tag = 0;
    RenderStageList stages;
};

class CC_DLL RenderFlow : public RefCounted {
public:
    RenderFlow();
    ~RenderFlow() override;

    virtual bool initialize(const RenderFlowInfo &info);
    virtual void activate(RenderPipeline *pipeline);
    virtual void render(scene::Camera *camera);
    virtual void destroy();

    inline const ccstd::string &getName() const { return _name; }
    inline void setName(ccstd::string &name) { _name = name; }
    inline uint32_t getPriority() const { return _priority; }
    inline void setPriority(uint32_t priority) { _priority = priority; }
    inline uint32_t getTag() const { return _tag; }
    inline void setTag(uint32_t tag) { _tag = tag; }
    inline const RenderStageList &getStages() const { return _stages; }
    inline void setStages(const RenderStageList &stages) { _stages = stages; }
    RenderStage *getRenderstageByName(const ccstd::string &name) const;

protected:
    RenderStageList _stages;
    ccstd::string _name;
    // weak reference
    RenderPipeline *_pipeline{nullptr};
    uint32_t _priority{0};
    uint32_t _tag{0};
    bool _isResourceOwner{false};
};

} // namespace pipeline
} // namespace cc
