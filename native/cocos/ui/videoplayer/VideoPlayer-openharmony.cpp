/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include <cstdlib>
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"

#include "ui/videoplayer/VideoPlayer.h"

#include "platform/FileUtils.h"
#include "platform/openharmony/napi/NapiHelper.h"
#include "ui/videoplayer/VideoPlayer-openharmony.h"
#include "cocos/base/Log.h"

#include <cstdlib>
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "platform/FileUtils.h"

//-----------------------------------------------------------------------------------------------------------
using namespace cc; //NOLINT
//-----------------------------------------------------------------------------------------------------------
#define QUIT_FULLSCREEN 1000



struct videoInfo {
  float duration = 0;
  float currentTime = 0;
};

static ccstd::unordered_map<int, VideoPlayer *> sAllVideoPlayers;
static ccstd::unordered_map<int, videoInfo> sAllVideoInfos;

static int32_t kWebViewTag = 0;
VideoPlayer::VideoPlayer()
: _videoPlayerIndex(-1),
  _fullScreenEnabled(false),
  _fullScreenDirty(false),
  _keepAspectRatioEnabled(false) {
    _videoPlayerIndex = kWebViewTag++;
    NapiHelper::postMessageToUIThread("createVideo", _videoPlayerIndex);
    sAllVideoPlayers[_videoPlayerIndex] = this;
    sAllVideoInfos[_videoPlayerIndex].duration = 0;
    sAllVideoInfos[_videoPlayerIndex].currentTime = 0;
}

VideoPlayer::~VideoPlayer() {
    destroy();
}

void VideoPlayer::destroy() {
    if (_videoPlayerIndex != -1) {
        auto iter = sAllVideoPlayers.find(_videoPlayerIndex);
        if (iter != sAllVideoPlayers.end()) {
            sAllVideoPlayers.erase(iter);
        }
        NapiHelper::postMessageToUIThread("removeVideo", _videoPlayerIndex);
        _videoPlayerIndex = -1;
    }
}

void VideoPlayer::setURL(const ccstd::string &videoUrl) {
    if (videoUrl.find("://") == ccstd::string::npos) {
        _videoURL = FileUtils::getInstance()->fullPathForFilename(videoUrl);
        _videoSource = VideoPlayer::Source::FILENAME;
    } else {
        _videoURL = videoUrl;
        _videoSource = VideoPlayer::Source::URL;
    }
    ccstd::unordered_map<ccstd::string, cc::Value> vals;
    vals.insert(std::make_pair("tag", _videoPlayerIndex));
    vals.insert(std::make_pair("url", _videoURL));
    NapiHelper::postMessageToUIThread("setVideoUrl", vals);
}

void VideoPlayer::VideoPlayer::setFrame(float x, float y, float width, float height) {
    ccstd::unordered_map<ccstd::string, cc::Value> vals;
    vals.insert(std::make_pair("tag", _videoPlayerIndex));
    vals.insert(std::make_pair("x", x));
    vals.insert(std::make_pair("y", y));
    vals.insert(std::make_pair("w", width));
    vals.insert(std::make_pair("h", height));
    NapiHelper::postMessageToUIThread("setVideoRect", vals);
}

void VideoPlayer::setFullScreenEnabled(bool fullscreen) {
    if (_fullScreenEnabled != fullscreen) {

        _fullScreenEnabled = fullscreen;

        ccstd::unordered_map<ccstd::string, cc::Value> vals;
        vals.insert(std::make_pair("tag", _videoPlayerIndex));
        vals.insert(std::make_pair("fullScreen", _fullScreenEnabled));
        NapiHelper::postMessageToUIThread("setFullScreenEnabled", vals);
    }
}

void VideoPlayer::setKeepAspectRatioEnabled(bool enable) {
    if (_keepAspectRatioEnabled != enable) {
        _keepAspectRatioEnabled = enable;
       // JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "setVideoKeepRatioEnabled", _videoPlayerIndex, enable);
    }
}

void VideoPlayer::play() {
    if (!_videoURL.empty()) {
         NapiHelper::postMessageToUIThread("startVideo", _videoPlayerIndex);
    }
}

void VideoPlayer::pause() {
    if (!_videoURL.empty()) {
        NapiHelper::postMessageToUIThread("pauseVideo", _videoPlayerIndex);
    }
}

void VideoPlayer::stop() {
    if (!_videoURL.empty()) {
        NapiHelper::postMessageToUIThread("stopVideo", _videoPlayerIndex);
    }
}

void VideoPlayer::seekTo(float sec) {
    if (!_videoURL.empty()) {
        ccstd::unordered_map<ccstd::string, cc::Value> vals;
        vals.insert(std::make_pair("tag", _videoPlayerIndex));
        vals.insert(std::make_pair("time", int(sec)));
        NapiHelper::postMessageToUIThread("seekVideoTo", vals);
    }
}

void VideoPlayer::setVisible(bool visible) {
    ccstd::unordered_map<ccstd::string, cc::Value> vals;
    vals.insert(std::make_pair("tag", _videoPlayerIndex));
    vals.insert(std::make_pair("visible", visible));
    NapiHelper::postMessageToUIThread("setVideoVisible", vals);
}

void VideoPlayer::addEventListener(const ccstd::string &name, const VideoPlayer::ccVideoPlayerCallback &callback) {
    _eventCallback[name] = callback;
}

void VideoPlayer::onPlayEvent(int event) {
    if (event == QUIT_FULLSCREEN) {
        _fullScreenEnabled = false;
    } else {
        auto videoEvent = static_cast<VideoPlayer::EventType>(event);

        switch (videoEvent) {
            case EventType::PLAYING:
                _eventCallback["play"]();
                break;
            case EventType::PAUSED:
                _eventCallback["pause"]();
                break;
            case EventType::STOPPED:
                _eventCallback["stoped"]();
                break;
            case EventType::COMPLETED:
                _eventCallback["ended"]();
                break;
            case EventType::META_LOADED:
                _eventCallback["loadedmetadata"]();
                break;
            case EventType::CLICKED:
                _eventCallback["click"]();
                break;
            case EventType::READY_TO_PLAY:
                _eventCallback["suspend"]();
                break;
            default:
                break;
        }
    }
}

void executeVideoCallback(int index, int event, float arg) {
    auto it = sAllVideoPlayers.find(index);
    if (it != sAllVideoPlayers.end()) {
        auto videoEvent = static_cast<VideoPlayer::EventType>(event);
        if(videoEvent == VideoPlayer::EventType::READY_TO_PLAY) {
            sAllVideoInfos[index].duration = arg;
        } else if(videoEvent == VideoPlayer::EventType::UPDATE) {
            sAllVideoInfos[index].currentTime = arg;
        }
        it->second->onPlayEvent(event);
    }
}

float VideoPlayer::currentTime() const {
    return sAllVideoInfos[_videoPlayerIndex].currentTime;
    //return 0.0f;
    //return JniHelper::callStaticFloatMethod(VIDEO_HELPER_CLASS_NAME, "getCurrentTime", _videoPlayerIndex);
}

float VideoPlayer::duration() const {
    return sAllVideoInfos[_videoPlayerIndex].duration;
    //return JniHelper::callStaticFloatMethod(VIDEO_HELPER_CLASS_NAME, "getDuration", _videoPlayerIndex);
}

void VideoOpenHarmony::GetInterfaces(std::vector<napi_property_descriptor> &descriptors) {
    descriptors = {
        DECLARE_NAPI_FUNCTION("onEvents", VideoOpenHarmony::napiOnEvent)
    };
}

napi_value VideoOpenHarmony::napiOnEvent(napi_env env, napi_callback_info info) {
    size_t      argc = 3;
    napi_value  args[3];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));

    se::ValueArray seArgs;
    seArgs.reserve(3);
    se::internal::jsToSeArgs(argc, args, &seArgs);

    int32_t viewTag;
    sevalue_to_native(seArgs[0], &viewTag, nullptr);

    int32_t eventType;
    sevalue_to_native(seArgs[1], &eventType, nullptr);

    int32_t time = 0;
    if(argc > 2) {
        sevalue_to_native(seArgs[2], &time, nullptr);
    }
    executeVideoCallback(viewTag, eventType, time);
    return nullptr;
}
