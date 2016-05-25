/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.

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

#include "cddandroidAndroidJavaEngine.h"
#include <stdlib.h>
#include <android/log.h>
#include <jni.h>
#include <sys/system_properties.h>
#include "platform/android/jni/JniHelper.h"
#include "ccdandroidUtils.h"
#include "audio/include/AudioEngine.h"

// Java class
#define  CLASS_NAME "org/cocos2dx/lib/Cocos2dxHelper"

using namespace cocos2d::experimental;
using namespace CocosDenshion::android;
using namespace cocos2d;

AndroidJavaEngine::AndroidJavaEngine()
    : _implementBaseOnAudioEngine(false)
    , _effectVolume(1.f)
{
    auto sdk_ver = JniHelper::callStaticIntMethod(CLASS_NAME, "getSDKVersion");
    __android_log_print(ANDROID_LOG_DEBUG, "AndroidJavaEngine", "android build version:%d", sdk_ver);
    if (sdk_ver == 21 || sdk_ver == 22)
    {
        _implementBaseOnAudioEngine = true;
    }
}

AndroidJavaEngine::~AndroidJavaEngine()
{
    if (_implementBaseOnAudioEngine)
    {
        stopAllEffects();
    }
    JniHelper::callStaticVoidMethod(CLASS_NAME, "destroyAudioEngine");
}

void AndroidJavaEngine::preloadBackgroundMusic(const char* filePath) {
    std::string fullPath = getFullPathWithoutAssetsPrefix(filePath);
    JniHelper::callStaticVoidMethod(CLASS_NAME, "preloadBackgroundMusic", fullPath);
}

void AndroidJavaEngine::playBackgroundMusic(const char* filePath, bool loop) {
    std::string fullPath = getFullPathWithoutAssetsPrefix(filePath);
    JniHelper::callStaticVoidMethod(CLASS_NAME, "playBackgroundMusic", fullPath, loop);
}

void AndroidJavaEngine::stopBackgroundMusic(bool releaseData) {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "stopBackgroundMusic");
}

void AndroidJavaEngine::pauseBackgroundMusic() {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "pauseBackgroundMusic");
}

void AndroidJavaEngine::resumeBackgroundMusic() {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "resumeBackgroundMusic");
}

void AndroidJavaEngine::rewindBackgroundMusic() {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "rewindBackgroundMusic");
}

bool AndroidJavaEngine::willPlayBackgroundMusic() {
    return true;
}

bool AndroidJavaEngine::isBackgroundMusicPlaying() {
    return JniHelper::callStaticBooleanMethod(CLASS_NAME, "isBackgroundMusicPlaying");
}

float AndroidJavaEngine::getBackgroundMusicVolume() {
    return JniHelper::callStaticFloatMethod(CLASS_NAME, "getBackgroundMusicVolume");
}

void AndroidJavaEngine::setBackgroundMusicVolume(float volume) {
    JniHelper::callStaticVoidMethod(CLASS_NAME, "setBackgroundMusicVolume", volume);
}

float AndroidJavaEngine::getEffectsVolume()
{
    if (_implementBaseOnAudioEngine)
    {
        return _effectVolume;
    }
    else
    {
        return JniHelper::callStaticFloatMethod(CLASS_NAME, "getEffectsVolume");;
    }
}

void AndroidJavaEngine::setEffectsVolume(float volume)
{
    if (_implementBaseOnAudioEngine)
    {
        if (volume > 1.f)
        {
            volume = 1.f;
        }
        else if (volume < 0.f)
        {
            volume = 0.f;
        }

        if (_effectVolume != volume)
        {
            _effectVolume = volume;
            for (auto it : _soundIDs)
            {
                AudioEngine::setVolume(it, volume);
            }
        }
    }
    else
    {
        JniHelper::callStaticVoidMethod(CLASS_NAME, "setEffectsVolume", volume);
    }
}

unsigned int AndroidJavaEngine::playEffect(const char* filePath, bool loop,
    float pitch, float pan, float gain)
{
    if (_implementBaseOnAudioEngine)
    {
        auto soundID = AudioEngine::play2d(filePath, loop, _effectVolume);
        if (soundID != AudioEngine::INVALID_AUDIO_ID)
        {
            _soundIDs.push_back(soundID);

            AudioEngine::setFinishCallback(soundID, [this](int id, const std::string& filePath){
                _soundIDs.remove(id);
            });
        }

        return soundID;
    }
    else
    {
        std::string fullPath = getFullPathWithoutAssetsPrefix(filePath);
        return JniHelper::callStaticIntMethod(CLASS_NAME, "playEffect", fullPath, loop, pitch, pan, gain);
    }
}

void AndroidJavaEngine::pauseEffect(unsigned int soundID)
{
    if (_implementBaseOnAudioEngine)
    {
        AudioEngine::pause(soundID);
    }
    else
    {
        JniHelper::callStaticVoidMethod(CLASS_NAME, "pauseEffect", (int)soundID);
    }
}

void AndroidJavaEngine::resumeEffect(unsigned int soundID)
{
    if (_implementBaseOnAudioEngine)
    {
        AudioEngine::resume(soundID);
    }
    else
    {
        JniHelper::callStaticVoidMethod(CLASS_NAME, "resumeEffect", (int)soundID);
    }
}

void AndroidJavaEngine::stopEffect(unsigned int soundID)
{
    if (_implementBaseOnAudioEngine)
    {
        AudioEngine::stop(soundID);
        _soundIDs.remove(soundID);
    }
    else
    {
        JniHelper::callStaticVoidMethod(CLASS_NAME, "stopEffect", (int)soundID);
    }
}

void AndroidJavaEngine::pauseAllEffects()
{
    if (_implementBaseOnAudioEngine)
    {
        for (auto it : _soundIDs)
        {
            AudioEngine::pause(it);
        }
    }
    else
    {
        JniHelper::callStaticVoidMethod(CLASS_NAME, "pauseAllEffects");
    }
}

void AndroidJavaEngine::resumeAllEffects()
{
    if (_implementBaseOnAudioEngine)
    {
        for (auto it : _soundIDs)
        {
            AudioEngine::resume(it);
        }
    }
    else
    {
        JniHelper::callStaticVoidMethod(CLASS_NAME, "resumeAllEffects");
    }
}

void AndroidJavaEngine::stopAllEffects()
{
    if (_implementBaseOnAudioEngine)
    {
        for (auto it : _soundIDs)
        {
            AudioEngine::stop(it);
        }
        _soundIDs.clear();
    }
    else
    {
        JniHelper::callStaticVoidMethod(CLASS_NAME, "stopAllEffects");
    }
}

void AndroidJavaEngine::preloadEffect(const char* filePath)
{
    if (!_implementBaseOnAudioEngine)
    {
        std::string fullPath = getFullPathWithoutAssetsPrefix(filePath);
        JniHelper::callStaticVoidMethod(CLASS_NAME, "preloadEffect", fullPath);
    }
}

void AndroidJavaEngine::unloadEffect(const char* filePath)
{
    if (!_implementBaseOnAudioEngine)
    {
        std::string fullPath = getFullPathWithoutAssetsPrefix(filePath);
        JniHelper::callStaticVoidMethod(CLASS_NAME, "unloadEffect", fullPath);
    }
}

