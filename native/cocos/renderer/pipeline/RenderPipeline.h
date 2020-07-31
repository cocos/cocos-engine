#pragma once

#include "core/CoreStd.h"
#include "Define.h"
#include "helper/DefineMap.h"

namespace cc {
namespace pipeline {
class DefineMap;
class RenderView;

struct CC_DLL RenderPipelineInfo {
    RenderFlowList flows;
    uint tag = 0;
};

class CC_DLL RenderPipeline : public Object {
public:
    RenderPipeline() = default;
    virtual ~RenderPipeline() = default;

    virtual bool activate();
    virtual void destroy();
    virtual bool initialize(const RenderPipelineInfo *info);
    virtual void render(RenderView *view);

    CC_INLINE const RenderFlowList &getFlows() const { return _flows; }
    CC_INLINE uint getTag() const { return _tag; }
    CC_INLINE const map<String, InternalBindingInst> &getGlobalBindings() const { return _globalBindings; }
    CC_INLINE const DefineMap &getMacro() const { return _macros; }

protected:
    RenderFlowList _flows;
    map<String, InternalBindingInst> _globalBindings;
    DefineMap _macros;
    uint _tag = 0;
};

} // namespace pipeline
} // namespace cc
