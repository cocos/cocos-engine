#pragma once
#include "audio/graph_based/AudioNode.h"
namespace cc {
class AudioScheduledSourceNode : public AudioNode {
public:
    AudioScheduledSourceNode() = delete;
    AudioScheduledSourceNode(BaseAudioContext *ctx) : AudioNode(ctx){}
    virtual ~AudioScheduledSourceNode();
    virtual void start(float when = 0);
    virtual void stop(float when = 0);
    virtual void onEnded(CommonCallback cb);
    virtual void offEnded(CommonCallback cb);

protected:
    std::vector<CommonCallback> _cbs;
};
}
