/****************************************************************************
 Copyright (c) 2014-2017 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "VideoPlayer.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS)
    #include <jni.h>
    #include <cstdlib>
    #include "base/std/container/string.h"
    #include "base/std/container/unordered_map.h"
    #include "platform/FileUtils.h"
    #include "platform/java/jni/JniHelper.h"

//-----------------------------------------------------------------------------------------------------------

static const ccstd::string VIDEO_HELPER_CLASS_NAME = "com/cocos/lib/CocosVideoHelper";

using namespace cc; //NOLINT

static void executeVideoCallback(int index, int event);

    #define QUIT_FULLSCREEN 1000

extern "C" {
JNIEXPORT
//NOLINTNEXTLINE
void Java_com_cocos_lib_CocosVideoHelper_nativeExecuteVideoCallback(JNIEnv *env, jobject obj, jint index, jint event) {
    executeVideoCallback(index, event);
}
}

int createVideoWidgetJNI() {
    JniMethodInfo t;
    int ret = -1;
    if (JniHelper::getStaticMethodInfo(t, VIDEO_HELPER_CLASS_NAME.c_str(), "createVideoWidget", "()I")) {
        ret = t.env->CallStaticIntMethod(t.classID, t.methodID);

        ccDeleteLocalRef(t.env, t.classID);
    }

    return ret;
}

//-----------------------------------------------------------------------------------------------------------

static ccstd::unordered_map<int, VideoPlayer *> sAllVideoPlayers;

VideoPlayer::VideoPlayer()
: _videoPlayerIndex(-1),
  _fullScreenEnabled(false),
  _fullScreenDirty(false),
  _keepAspectRatioEnabled(false) {
    _videoPlayerIndex = createVideoWidgetJNI();
    sAllVideoPlayers[_videoPlayerIndex] = this;

    #if CC_VIDEOPLAYER_DEBUG_DRAW
    _debugDrawNode = DrawNode::create();
    addChild(_debugDrawNode);
    #endif
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

        JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "removeVideoWidget",
                                        _videoPlayerIndex);

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

    JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "setVideoUrl", _videoPlayerIndex,
                                    static_cast<int>(_videoSource), _videoURL);
}

void VideoPlayer::setFrame(float x, float y, float width, float height) {
    JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "setVideoRect", _videoPlayerIndex,
                                    static_cast<int>(x), static_cast<int>(y), static_cast<int>(width), static_cast<int>(height));
}

void VideoPlayer::setPlaybackRate(float value) {
    JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "setPlaybackRate", _videoPlayerIndex, value);
}

void VideoPlayer::setMute(bool enable) {
    JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "setMute", _videoPlayerIndex, enable);
}

void VideoPlayer::setLoop(bool enable) {
    JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "setLoop", _videoPlayerIndex, enable);
}

void VideoPlayer::setFullScreenEnabled(bool fullscreen) {
    if (_fullScreenEnabled != fullscreen) {
        _fullScreenEnabled = fullscreen;
        JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "setFullScreenEnabled", _videoPlayerIndex, fullscreen);
    }
}

void VideoPlayer::setKeepAspectRatioEnabled(bool enable) {
    if (_keepAspectRatioEnabled != enable) {
        _keepAspectRatioEnabled = enable;
        JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "setVideoKeepRatioEnabled", _videoPlayerIndex, enable);
    }
}

void VideoPlayer::play() {
    if (!_videoURL.empty()) {
        JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "startVideo", _videoPlayerIndex);
    }
}

void VideoPlayer::pause() {
    if (!_videoURL.empty()) {
        JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "pauseVideo", _videoPlayerIndex);
    }
}

void VideoPlayer::stop() {
    if (!_videoURL.empty()) {
        JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "stopVideo", _videoPlayerIndex);
    }
}

void VideoPlayer::seekTo(float sec) {
    if (!_videoURL.empty()) {
        JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "seekVideoTo", _videoPlayerIndex, int(sec * 1000));
    }
}

void VideoPlayer::setVisible(bool visible) {
    JniHelper::callStaticVoidMethod(VIDEO_HELPER_CLASS_NAME, "setVideoVisible", _videoPlayerIndex, visible);
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

void executeVideoCallback(int index, int event) {
    auto it = sAllVideoPlayers.find(index);
    if (it != sAllVideoPlayers.end()) {
        sAllVideoPlayers[index]->onPlayEvent(event);
    }
}

float VideoPlayer::currentTime() const {
    return JniHelper::callStaticFloatMethod(VIDEO_HELPER_CLASS_NAME, "getCurrentTime", _videoPlayerIndex);
}

float VideoPlayer::duration() const {
    return JniHelper::callStaticFloatMethod(VIDEO_HELPER_CLASS_NAME, "getDuration", _videoPlayerIndex);
}

#endif
