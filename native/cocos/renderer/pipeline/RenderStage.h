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

struct CC_DLL RenderStageInfo {
    String name;
    uint priority = 0;
    uint tag = 0;
};

class CC_DLL RenderStage : public Object {
public:
    RenderStage() = default;
    virtual ~RenderStage() = default;

    virtual void activate(RenderPipeline *pipeline, RenderFlow *flow);
    virtual bool initialize(const RenderStageInfo &info);

    virtual void destroy() = 0;
    virtual void render(RenderView *view) = 0;

    CC_INLINE const String& getName() const { return _name; }
    CC_INLINE uint getPriority() const { return _priority; }
    CC_INLINE uint getTag() const { return _tag; }

protected:
    RenderPipeline *_pipeline = nullptr;
    RenderFlow *_flow = nullptr;
    String _name;
    uint _priority = 0;
    uint _tag = 0;
};

} // namespace pipeline
} // namespace cc
