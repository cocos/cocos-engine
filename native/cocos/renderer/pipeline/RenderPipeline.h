#pragma once

#include "Define.h"
#include "core/CoreStd.h"
#include "helper/DefineMap.h"

namespace cc {
namespace gfx {
class CommandBuffer;
}
namespace pipeline {
class DefineMap;
class RenderView;

//TODO coulsonwang
class DescriptorSetLayout;
class DescriptorSet;

struct CC_DLL RenderPipelineInfo {
    RenderFlowList flows;
    uint tag = 0;
};

class CC_DLL RenderPipeline : public Object {
public:
    static RenderPipeline *getInstance();

    RenderPipeline();
    virtual ~RenderPipeline();

    virtual bool activate();
    virtual void destroy();
    virtual bool initialize(const RenderPipelineInfo &info);
    virtual void render(RenderView *view);

    CC_INLINE const RenderFlowList &getFlows() const { return _flows; }
    CC_INLINE uint getTag() const { return _tag; }
    CC_INLINE const map<String, InternalBindingInst> &getGlobalBindings() const { return _globalBindings; }
    CC_INLINE const DefineMap &getMacro() const { return _macros; }

protected:
    static RenderPipeline *_instance;

    gfx::CommandBufferList _commandBuffers;
    RenderFlowList _flows;
    map<String, InternalBindingInst> _globalBindings;
    DefineMap _macros;
    uint _tag = 0;

    DescriptorSetLayout *_descriptorSetLayout = nullptr;
    DescriptorSet *_descriptorSet = nullptr;
};

} // namespace pipeline
} // namespace cc
