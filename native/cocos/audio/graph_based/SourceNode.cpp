#include "audio/graph_based/SourceNode.h"
#include "audio/graph_based/AudioNode.h"
#include "audio/graph_based/AudioParam.h"
#include "audio/graph_based/AudioBuffer.h"
#include "audio/graph_based/BaseAudioContext.h"
#include "base/Log.h"
#include "LabSound/core/SampledAudioNode.h"
#include "LabSound/extended/AudioContextLock.h"
namespace cc {

SourceNode::SourceNode(BaseAudioContext* ctx, AudioBuffer* buffer): AudioNode(ctx) {
    _absn = std::make_shared<lab::SampledAudioNode>(*ctx->getInnerContext());
    _node = std::make_shared<lab::GainNode>(*ctx->getInnerContext());
    if (buffer) {
        _buffer = buffer;
        lab::ContextRenderLock lck(ctx->getInnerContext().get(), "setBus");
        auto bus = _buffer->_bus;
        _absn->setBus(lck, bus);
        _innerState = ABSNState::READY;
    }
    ctx->getInnerContext()->connect(_node, _absn);
    _playbackRate = AudioParam::createParam(_absn->playbackRate());
    #if CC_PLATFORM == CC_PLATFORM_ANDROID
        _gain = AudioParam::createParam(std::dynamic_pointer_cast<lab::GainNode>(_node)->gain());
    #else
        _gain = AudioParam::createParam(std::-<lab::GainNode>(_node)->gain());
    #endif
    _absn->setOnEnded([&](){
        _onEnd();
    });
}

void SourceNode::_onEnd() {
    _innerState = ABSNState::PAUSED;
    _pastTime = 0;
    if (_finishCallback) {
        _finishCallback();
    }
}
float SourceNode::getVolume() {
    return _gain->getValue();
}
void SourceNode::setVolume(float vol) {
    _gain->setValue(vol);
}
bool SourceNode::start(float time) {
    if (!_buffer) {
        CC_LOG_ERROR("[SourceNode] No buffer is provided!! Play audio failed");
        return false;
    }
    if (!_buffer->getBus()) {
        CC_LOG_ERROR("[SourceNode] AudioBuffer is invalid, cannot find a wave to play");
        return false;
    }
    if (time) {
        _restart(time);
    } else {
        switch (_innerState) {
            case ABSNState::PAUSED:
                _startTime = _ctx->getCurrentTime();
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
    return true;
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
    _startTime = _ctx->getCurrentTime();
    _innerState = ABSNState::PLAYING;
    _absn->playbackRate()->setValue(_cachePlaybackRate);
}
void SourceNode::setBuffer(AudioBuffer* buffer) {
    if (buffer == _buffer) {
        // Same as original
        return;
    }
    _buffer.reset(buffer);
    lab::ContextRenderLock lck(_ctx->getInnerContext().get(), "setBus");
    auto bus = _buffer->_bus;
    if (!bus) {
        CC_LOG_ERROR("[SourceNode] AudioBuffer is invalid, cannot find a wave to play");
        return;
    }
    _absn->setBus(lck, bus);
    _innerState = ABSNState::READY;
}
AudioBuffer* SourceNode::getBuffer() {
    return _buffer.get();
}
void SourceNode::setPlaybackRate(float rate) {
    _pastTime = getCurrentTime();
    _startTime = _ctx->getCurrentTime();
    _cachePlaybackRate = _absn->playbackRate()->value();

    if (_innerState == ABSNState::PLAYING) {
        _playbackRate->setValue(rate);
    }
}
float SourceNode::getPlaybackRate() {
    // return cached playback rate otherwise the playback rate is not accurate.
    return _cachePlaybackRate;
}
void SourceNode::setOnEnded(std::function<void()> fn) {
    _finishCallback = fn;
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
    return _pastTime + (_ctx->getCurrentTime() - _startTime) * _playbackRate->getValue();
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
