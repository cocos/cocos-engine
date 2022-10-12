#pragma once
#include "audio/graph_based/AudioNode.h"
namespace cc {
class AudioScheduledSourceNode : AudioNode {
public:
    AudioScheduledSourceNode() = delete;
    virtual void start();
    virtual void stop();
    virtual void onEnded(CommonCallback cb);
    virtual void offEnded(CommonCallback cb);

private:
    std::vector<CommonCallback> _cbs;
};
}
