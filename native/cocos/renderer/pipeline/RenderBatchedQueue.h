#pragma once

#include "core/CoreStd.h"

NS_PP_BEGIN

class BatchedBuffer;

class CC_DLL RenderBatchedQueue : public cocos2d::Object {
public:
    RenderBatchedQueue() = default;
    ~RenderBatchedQueue() = default;

    void clear();
    void recordCommandBuffer(cocos2d::GFXDevice *, cocos2d::GFXRenderPass *, cocos2d::GFXCommandBuffer *);

    CC_INLINE const cocos2d::set<BatchedBuffer *>::type &getQueue() const { return _queue; }

private:
    cocos2d::set<BatchedBuffer *>::type _queue;
};

NS_PP_END
