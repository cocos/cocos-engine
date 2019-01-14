/****************************************************************************
 Copyright (c) 2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include <unordered_map>
#include <stdlib.h>
#include <jni.h>
#include <string>
#include "platform/CCApplication.h"
#include "platform/android/jni/JniHelper.h"
#include "platform/CCFileUtils.h"

//-----------------------------------------------------------------------------------------------------------

static const std::string videoHelperClassName = "org/cocos2dx/lib/Cocos2dxVideoHelper";

USING_NS_CC;

static void executeVideoCallback(int index,int event);

#define QUIT_FULLSCREEN 1000

extern "C" {
    void Java_org_cocos2dx_lib_Cocos2dxVideoHelper_nativeExecuteVideoCallback(JNIEnv * env, jobject obj, jint index,jint event) {
        executeVideoCallback(index,event);
    }
}

int createVideoWidgetJNI()
{
    JniMethodInfo t;
    int ret = -1;
    if (JniHelper::getStaticMethodInfo(t, videoHelperClassName.c_str(), "createVideoWidget", "()I")) {
        ret = t.env->CallStaticIntMethod(t.classID, t.methodID);

        t.env->DeleteLocalRef(t.classID);
    }

    return ret;
}

//-----------------------------------------------------------------------------------------------------------

static std::unordered_map<int, VideoPlayer*> s_allVideoPlayers;

VideoPlayer::VideoPlayer()
: _videoPlayerIndex(-1)
, _fullScreenEnabled(false)
, _fullScreenDirty(false)
, _keepAspectRatioEnabled(false)
{
    _videoPlayerIndex = createVideoWidgetJNI();
    s_allVideoPlayers[_videoPlayerIndex] = this;

#if CC_VIDEOPLAYER_DEBUG_DRAW
    _debugDrawNode = DrawNode::create();
    addChild(_debugDrawNode);
#endif
}

VideoPlayer::~VideoPlayer()
{
    s_allVideoPlayers.erase(_videoPlayerIndex);
    JniHelper::callStaticVoidMethod(videoHelperClassName, "removeVideoWidget", _videoPlayerIndex);
}

void VideoPlayer::setURL(const std::string& videoUrl)
{
    if (videoUrl.find("://") == std::string::npos)
    {
        _videoURL = FileUtils::getInstance()->fullPathForFilename(videoUrl);
        _videoSource = VideoPlayer::Source::FILENAME;
    }
    else
    {
        _videoURL = videoUrl;
        _videoSource = VideoPlayer::Source::URL;
    }

    JniHelper::callStaticVoidMethod(videoHelperClassName, "setVideoUrl", _videoPlayerIndex,
                                    (int)_videoSource,_videoURL);
}

void VideoPlayer::VideoPlayer::setFrame(float x, float y, float width, float height)
{
    JniHelper::callStaticVoidMethod(videoHelperClassName, "setVideoRect", _videoPlayerIndex,
                                    (int)x, (int)y, (int)width, (int)height);
}

void VideoPlayer::setFullScreenEnabled(bool enabled)
{
    if (_fullScreenEnabled != enabled)
    {
        _fullScreenEnabled = enabled;
        JniHelper::callStaticVoidMethod(videoHelperClassName, "setFullScreenEnabled", _videoPlayerIndex, enabled);
    }
}

void VideoPlayer::setKeepAspectRatioEnabled(bool enable)
{
    if (_keepAspectRatioEnabled != enable)
    {
        _keepAspectRatioEnabled = enable;
        JniHelper::callStaticVoidMethod(videoHelperClassName, "setVideoKeepRatioEnabled", _videoPlayerIndex, enable);
    }
}

void VideoPlayer::play()
{
    if (! _videoURL.empty())
    {
        JniHelper::callStaticVoidMethod(videoHelperClassName, "startVideo", _videoPlayerIndex);
    }
}

void VideoPlayer::pause()
{
    if (! _videoURL.empty())
    {
        JniHelper::callStaticVoidMethod(videoHelperClassName, "pauseVideo", _videoPlayerIndex);
    }
}

void VideoPlayer::stop()
{
    if (! _videoURL.empty())
    {
        JniHelper::callStaticVoidMethod(videoHelperClassName, "stopVideo", _videoPlayerIndex);
    }
}

void VideoPlayer::seekTo(float sec)
{
    if (! _videoURL.empty())
    {
        JniHelper::callStaticVoidMethod(videoHelperClassName, "seekVideoTo", _videoPlayerIndex, int(sec * 1000));
    }
}

void VideoPlayer::setVisible(bool visible)
{
    JniHelper::callStaticVoidMethod(videoHelperClassName, "setVideoVisible", _videoPlayerIndex, visible);
}

void VideoPlayer::addEventListener(const std::string& name, const VideoPlayer::ccVideoPlayerCallback& callback)
{
    _eventCallback[name] = callback;
}

void VideoPlayer::onPlayEvent(int event)
{
    if (event == QUIT_FULLSCREEN)
    {
        _fullScreenEnabled = false;
    }
    else
    {
        VideoPlayer::EventType videoEvent = (VideoPlayer::EventType)event;


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

void executeVideoCallback(int index,int event)
{
    auto it = s_allVideoPlayers.find(index);
    if (it != s_allVideoPlayers.end())
    {
        s_allVideoPlayers[index]->onPlayEvent(event);
    }
}

float VideoPlayer::currentTime() const
{
    return JniHelper::callStaticFloatMethod(videoHelperClassName, "getCurrentTime", _videoPlayerIndex);
}

float VideoPlayer::duration() const
{
    return JniHelper::callStaticFloatMethod(videoHelperClassName, "getDuration", _videoPlayerIndex);
}

#endif
