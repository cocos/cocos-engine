#pragma once

#include "Define.h"

namespace cc {

namespace gfx {
class Framebuffer;
} // namespace gfx

namespace pipeline {

class RenderFlow;
class RenderPipeline;
class RenderView;
class RenderQueue;

struct CC_DLL RenderStageInfo {
    String name;
    uint priority = 0;
    uint tag = 0;
    RenderQueueDescList renderQueues;
};

class CC_DLL RenderStage : public Object {
public:
    RenderStage();
    virtual ~RenderStage();

    virtual void activate(RenderPipeline *pipeline, RenderFlow *flow);
    virtual bool initialize(const RenderStageInfo &info);

    virtual void destroy();
    virtual void render(RenderView *view) = 0;

    CC_INLINE const String &getName() const { return _name; }
    CC_INLINE uint getPriority() const { return _priority; }
    CC_INLINE uint getTag() const { return _tag; }

protected:
    RenderQueueDescList _renderQueueDescriptors;
    vector<RenderQueue *> _renderQueues;
    RenderPipeline *_pipeline = nullptr;
    RenderFlow *_flow = nullptr;
    gfx::Device *_device = nullptr;
    String _name;
    uint _priority = 0;
    uint _tag = 0;
    gfx::ColorList _clearColors = {{0, 0, 0, 1.0f}};
};

} // namespace pipeline
} // namespace cc
