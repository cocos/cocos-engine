#include "audio/graph_based/SourceNode.h"
#include "audio/AudioClip.h"
#include "base/Log.h"
#include "LabSound/core/SampledAudioNode.h"
#include "LabSound/extended/AudioContextLock.h"
namespace cc {

SourceNode::SourceNode(BaseAudioContext* ctx, AudioBuffer* buffer) {
    _ctx = ctx->getInnerContext();
    _absn = std::make_shared<lab::SampledAudioNode>(*ctx->getInnerContext());
    _gain = std::make_shared<lab::GainNode>(*ctx->getInnerContext());
    if (buffer) {
        _buffer = buffer;
        lab::ContextRenderLock lck(_ctx.get(), "setBus");
        auto bus = _buffer->_bus;
        _absn->setBus(lck, bus);
        _innerState = ABSNState::READY;
    }
    _ctx->connect(_gain, _absn);
    _playbackRate = AudioParam::createParam(_absn->playbackRate());
}

 AudioNode* SourceNode::connect(AudioNode* node) {
    if (std::find(_connections.begin(), _connections.end(), node) != _connections.end()) {
        // Connection is ignored.
        return node;
    }
    CC_LOG_DEBUG("=== Emplace back an audio node which will call add ref ===");
    _connections.emplace_back(node);
    CC_LOG_DEBUG("====");
    _ctx->connect(node->_node, _gain);
    return node;
}
void SourceNode::disconnect() {
    // input index of destination. It calls destIndex in labsound.
    CC_LOG_DEBUG("==== Waiting for release call ====");
    _connections.clear();
    _ctx->disconnect(_gain);
}
void SourceNode::start(float time) {
    if (!_buffer) {
        CC_LOG_ERROR("[SourceNode] No buffer is provided!! Play audio failed");
        return;
    }
    if (time) {
        _restart(time);
    } else {
        switch (_innerState) {
            case ABSNState::PAUSED:
                _startTime = _ctx->currentTime();
                _restart(_pastTime);
                _innerState = ABSNState::PLAYING;
                break;
            case ABSNState::PLAYING:
                _restart(0);
                break;
            case ABSNState::DIRTY:
                _restart(_pastTime);
                break;
            case ABSNState::READY:
                _pureStart(0);
                break;
            default:
                break;
        }
    }
}

void SourceNode::pause() {
    if (_innerState != ABSNState::PLAYING) {
        return;
    }
    _pastTime = getCurrentTime();
    // Hard to set value to 0 to pause the audio.
    _absn->clearSchedules();
    _innerState = ABSNState::PAUSED;
}
void SourceNode::stop() {
    try {
        _absn->clearSchedules();
        _pastTime = 0;
        _innerState = ABSNState::READY;
        CC_LOG_DEBUG("Stopping the source node");
    } catch (std::exception e){
        // Do nothing
    }
}

void SourceNode::_restart(float time) {
    stop();
    _pureStart(time);
}
void SourceNode::_pureStart(float time) {
    _pastTime = time;
    _absn->schedule(0, time, _loop?-1:0);
    _startTime = _ctx->currentTime();
    _innerState = ABSNState::PLAYING;
}
void SourceNode::setBuffer(AudioBuffer* buffer) {
    _buffer.reset(buffer);
    lab::ContextRenderLock lck(_ctx.get(), "setBus");
    auto bus = _buffer->_bus;
    _absn->setBus(lck, bus);
}
AudioBuffer* SourceNode::getBuffer() {
    return _buffer.get();
}
void SourceNode::setPlaybackRate(float rate) {
    _playbackRate->setValue(rate);
}
float SourceNode::getPlaybackRate() {
    return _playbackRate->getValue();
}
void SourceNode::setLoop(bool loop) {
    if (loop != _loop) {
        if (loop) {
            _absn->schedule(0, -1);
        } else {
            _absn->schedule(0, 0);
        }
    }
    _loop = loop;
}

float SourceNode::getCurrentTime() {
    if (_innerState != ABSNState::PLAYING) {
        return _pastTime;
    }
    return _pastTime + (_ctx->currentTime() - _startTime) * _playbackRate->getValue();
}
void SourceNode::setCurrentTime(float time) {
    if (_innerState != ABSNState::PLAYING) {
        _pastTime = time;
        _innerState = ABSNState::DIRTY;
    } else {
        start(time);
    }
}

} // namespace cc
