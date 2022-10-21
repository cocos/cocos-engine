#include "audio/graph_based/SourceNode.h"
#include "audio/AudioClip.h"
#include "LabSound/core/SampledAudioNode.h"
#include "LabSound/extended/AudioContextLock.h"
namespace cc {
SourceNode::SourceNode(BaseAudioContext* ctx, AudioClip* clip) :AudioScheduledSourceNode(ctx) {
    _clip = std::shared_ptr<AudioClip>(clip);
    _ctx = std::shared_ptr<BaseAudioContext>(ctx);
    _node = std::make_shared<lab::SampledAudioNode>(*ctx->getInnerContext());

    if (clip) {
        // Set buffer if clip is ready.
        lab::ContextRenderLock lck(_ctx->getInnerContext(), "setBus");
        auto buf = std::make_shared<lab::AudioBus>(_clip->buffer->_bus);
        static_cast<lab::SampledAudioNode*>(_node.get())->setBus(lck, buf);
    }
    
    _detune = std::make_shared<AudioParam>(std::dynamic_pointer_cast<lab::SampledAudioNode>(_node)->detune());
    _playbackRate = std::make_shared<AudioParam>(std::dynamic_pointer_cast<lab::SampledAudioNode>(_node)->playbackRate());
    static_cast<lab::SampledAudioNode*>(_node.get())->setOnEnded([this]() {
        for each (auto cb in _cbs) {
            cb();
        }
    });
}
void SourceNode::startAt(float offset) {
    start(0, offset, 0);
}
void SourceNode::restartAt(float offset) {
    stop();
    start(0, offset, 0);

    _pastTime = 0;
    _startTime = _ctx->currentTime();
}
void SourceNode::pause() {
    _playbackRate->setValue(0);
}
void SourceNode::stop(float when) {
    static_cast<lab::SampledAudioNode*>(_node.get())->stop(when);
}
void SourceNode::start(float when, float offset, float duration) {
    if (_loop) {
        _loopStart = offset;
        _loopEnd = offset + duration;
    }

    static_cast<lab::SampledAudioNode*>(_node.get())->start(when, /*grainOffset*/ offset, /*grainDuration*/ duration, _loop?-1:0);
}
AudioParam* SourceNode::detune() {
    return _detune.get();
}
AudioParam* SourceNode::playbackRate() {
    return _playbackRate.get();
}
void SourceNode::setLoop(bool loop) {
    if (loop != _loop) {
        if (loop) {
            static_cast<lab::SampledAudioNode*>(_node.get())->schedule(0, _loopStart, _loopEnd - _loopStart, -1);
        } else {
            static_cast<lab::SampledAudioNode*>(_node.get())->schedule(0, 0);
        }
    }
    _loop = loop;
}

float SourceNode::currentTime() {
    return _pastTime + (_ctx->currentTime() - _startTime) * _playbackRate->value();
}
void SourceNode::setCurrentTime(float time) {
    restartAt(time);
}
void SourceNode::setLoopStart(float loopStart) {
    _loopStart = loopStart;
    if (loop) {
        static_cast<lab::SampledAudioNode*>(_node.get())->schedule(0, _loopStart, _loopEnd - _loopStart, -1);
    }
}
void SourceNode::setLoopEnd(float loopEnd) {
    _loopEnd = loopEnd;
    if (loop) {
        static_cast<lab::SampledAudioNode*>(_node.get())->schedule(0, _loopStart, _loopEnd - _loopStart, -1);
    }
}
} // namespace cc
