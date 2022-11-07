#pragma once
#include "audio/graph_based/AudioNode.h"
namespace cc {
typedef std::function<void()> CommonCallback;
class AudioScheduledSourceNode : public AudioNode {
public:
    AudioScheduledSourceNode() = delete;
    AudioScheduledSourceNode(BaseAudioContext *ctx);
    virtual ~AudioScheduledSourceNode();
    virtual void start(float when = 0);
    virtual void stop(float when = 0);
    virtual void onEnded(const CommonCallback& cb);
    virtual void offEnded(const CommonCallback& cb);

protected:
    std::vector<CommonCallback> _cbs;
};
}
