#pragma once

#include "core/CoreStd.h"

NS_PP_BEGIN

class InstancedBuffer;

class CC_DLL RenderInstancedQueue : public cocos2d::Object {
public:
    RenderInstancedQueue() = default;
    ~RenderInstancedQueue() = default;

    void clear();
    void recordCommandBuffer(cocos2d::GFXDevice *, cocos2d::GFXRenderPass *, cocos2d::GFXCommandBuffer *);

    CC_INLINE const cocos2d::set<InstancedBuffer *>::type &getQueue() const { return _queue; }

private:
    cocos2d::set<InstancedBuffer *>::type _queue;
};

NS_PP_END
