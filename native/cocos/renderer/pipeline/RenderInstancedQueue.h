#pragma once

#include "core/CoreStd.h"

NS_PP_BEGIN

class InstancedBuffer;

class CC_DLL RenderInstancedQueue : public cc::Object {
public:
    RenderInstancedQueue() = default;
    ~RenderInstancedQueue() = default;

    void clear();
    void recordCommandBuffer(cc::GFXDevice *, cc::GFXRenderPass *, cc::GFXCommandBuffer *);

    CC_INLINE const cc::set<InstancedBuffer *>::type &getQueue() const { return _queue; }

private:
    cc::set<InstancedBuffer *>::type _queue;
};

NS_PP_END
