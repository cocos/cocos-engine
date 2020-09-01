#pragma once

#include "Define.h"
#include "../core/CoreStd.h"
#include "helper/DefineMap.h"

namespace cc {
namespace gfx {
class CommandBuffer;
class DescriptorSet;
class DescriptorSetLayout;
} // namespace gfx
namespace pipeline {
class DefineMap;
class RenderView;

struct CC_DLL RenderPipelineInfo {
    uint tag = 0;
    RenderFlowList flows;
};

class CC_DLL RenderPipeline : public Object {
public:
    static RenderPipeline *getInstance();

    RenderPipeline();
    virtual ~RenderPipeline();

    virtual bool activate();
    virtual void destroy();
    virtual bool initialize(const RenderPipelineInfo &info);
    virtual void render(const vector<RenderView *> &views);

    CC_INLINE const RenderFlowList &getFlows() const { return _flows; }
    CC_INLINE uint getTag() const { return _tag; }
    CC_INLINE const map<String, InternalBindingInst> &getGlobalBindings() const { return _globalBindings; }
    CC_INLINE const ValueMap &getMacros() const { return _macros.getValues(); }
    template <class T, class RET = void>
    ENABLE_IF_T3_RET(float, bool, String)
    CC_INLINE setValue(const String &name, const T &value) { _macros.setValue(name, value);}
    CC_INLINE gfx::DescriptorSet *getDescriptorSet() const { return _descriptorSet; }

protected:
    static RenderPipeline *_instance;

    gfx::CommandBufferList _commandBuffers;
    RenderFlowList _flows;
    map<String, InternalBindingInst> _globalBindings;
    DefineMap _macros;
    uint _tag = 0;

    gfx::Device *_device = nullptr;
    gfx::DescriptorSetLayout *_descriptorSetLayout = nullptr;
    gfx::DescriptorSet *_descriptorSet = nullptr;
};

} // namespace pipeline
} // namespace cc
