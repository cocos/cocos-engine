/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
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

#pragma once

#include <chrono>
#include <cstdint>
#include <functional>
#include "audio/include/AudioDef.h"
#include "audio/include/Export.h"
#include "base/Macros.h"
#include "base/std/container/list.h"
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"
#include "engine/EngineEvents.h"

#ifdef ERROR
    #undef ERROR
#endif // ERROR

/**
 * @addtogroup audio
 * @{
 */

namespace cc {
/**
 * @class AudioProfile
 *
 * @brief
 * @js NA
 */
class EXPORT_DLL AudioProfile {
public:
    //Profile name can't be empty.
    ccstd::string name;
    //The maximum number of simultaneous audio instance.
    unsigned int maxInstances{};

    /* Minimum delay in between sounds */
    double minDelay{};

    /**
     * Default constructor
     *
     * @lua new
     */
    AudioProfile() = default;
};

class AudioEngineImpl;

/**
 * @class AudioEngine
 *
 * @brief Offers a interface to play audio.
 *
 * @note Make sure to call AudioEngine::end() when the audio engine is not needed anymore to release resources.
 * @js NA
 */

class EXPORT_DLL AudioEngine {
public:
    /** AudioState enum,all possible states of an audio instance.*/
    enum class AudioState {
        ERROR = -1,
        INITIALIZING,
        PLAYING,
        PAUSED
    };

    static const int INVALID_AUDIO_ID;

    static const float TIME_UNKNOWN;

    static bool lazyInit();

    /**
     * Release objects relating to AudioEngine.
     *
     * @warning It must be called before the application exit.
     * @lua endToLua
     */
    static void end();

    /**  
     * Gets the default profile of audio instances.
     *
     * @return The default profile of audio instances.
     */
    static AudioProfile *getDefaultProfile();

    /** 
     * Play 2d sound.
     *
     * @param filePath The path of an audio file.
     * @param loop Whether audio instance loop or not.
     * @param volume Volume value (range from 0.0 to 1.0).
     * @param profile A profile for audio instance. When profile is not specified, default profile will be used.
     * @return An audio ID. It allows you to dynamically change the behavior of an audio instance on the fly.
     *
     * @see `AudioProfile`
     */
    static int play2d(const ccstd::string &filePath, bool loop = false, float volume = 1.0F, const AudioProfile *profile = nullptr);

    /** 
     * Sets whether an audio instance loop or not.
     *
     * @param audioID An audioID returned by the play2d function.
     * @param loop Whether audio instance loop or not.
     */
    static void setLoop(int audioID, bool loop);

    /** 
     * Checks whether an audio instance is loop.
     *
     * @param audioID An audioID returned by the play2d function.
     * @return Whether or not an audio instance is loop.
     */
    static bool isLoop(int audioID);

    /** 
     * Sets volume for an audio instance.
     *
     * @param audioID An audioID returned by the play2d function.
     * @param volume Volume value (range from 0.0 to 1.0).
     */
    static void setVolume(int audioID, float volume);

    /**
     * sets volume factor for all audio instance
     * @param factor, Volume factor(range from 0.0 to 1.0).
     */
    static void setVolumeFactor(float factor);

    /**
     * Gets the volume value of an audio instance.
     *
     * @param audioID An audioID returned by the play2d function.
     * @return Volume value (range from 0.0 to 1.0).
     */
    static float getVolume(int audioID);

    /** 
     * Pause an audio instance.
     *
     * @param audioID An audioID returned by the play2d function.
     */
    static void pause(int audioID);

    /** Pause all playing audio instances. */
    static void pauseAll();

    /** 
     * Resume an audio instance.
     *
     * @param audioID An audioID returned by the play2d function.
     */
    static void resume(int audioID);

    /** Resume all suspended audio instances. */
    static void resumeAll();

    /** 
     * Stop an audio instance.
     *
     * @param audioID An audioID returned by the play2d function.
     */
    static void stop(int audioID);

    /** Stop all audio instances. */
    static void stopAll();

    /**
     * Sets the current playback position of an audio instance.
     *
     * @param audioID   An audioID returned by the play2d function.
     * @param time      The offset in seconds from the start to seek to.
     * @return 
     */
    static bool setCurrentTime(int audioID, float time);

    /** 
     * Gets the current playback position of an audio instance.
     *
     * @param audioID An audioID returned by the play2d function.
     * @return The current playback position of an audio instance.
     */
    static float getCurrentTime(int audioID);

    /** 
     * Gets the duration of an audio instance.
     *
     * @param audioID An audioID returned by the play2d function.
     * @return The duration of an audio instance.
     */
    static float getDuration(int audioID);

    /** 
    * Gets the duration of an audio file.
    *
    * @param filePath The path of an audio file.
    * @return The duration of an audio file.
    */
    static float getDurationFromFile(const ccstd::string &filePath);

    /** 
     * Returns the state of an audio instance.
     *
     * @param audioID An audioID returned by the play2d function.
     * @return The status of an audio instance.
     */
    static AudioState getState(int audioID);

    /** 
     * Register a callback to be invoked when an audio instance has completed playing.
     *
     * @param audioID An audioID returned by the play2d function.
     * @param callback
     */
    static void setFinishCallback(int audioID, const std::function<void(int, const ccstd::string &)> &callback);

    /**
     * Gets the maximum number of simultaneous audio instance of AudioEngine.
     */
    static int getMaxAudioInstance() { return static_cast<int>(sMaxInstances); }

    /**
     * Sets the maximum number of simultaneous audio instance for AudioEngine.
     *
     * @param maxInstances The maximum number of simultaneous audio instance.
     */
    static bool setMaxAudioInstance(int maxInstances);

    /** 
     * Uncache the audio data from internal buffer.
     * AudioEngine cache audio data on ios,mac, and oalsoft platform.
     *
     * @warning This can lead to stop related audio first.
     * @param filePath Audio file path.
     */
    static void uncache(const ccstd::string &filePath);

    /** 
     * Uncache all audio data from internal buffer.
     *
     * @warning All audio will be stopped first.
     */
    static void uncacheAll();

    /**  
     * Gets the audio profile by id of audio instance.
     *
     * @param audioID An audioID returned by the play2d function.
     * @return The audio profile.
     */
    static AudioProfile *getProfile(int audioID);

    /**  
     * Gets an audio profile by name.
     *
     * @param profileName A name of audio profile.
     * @return The audio profile.
     */
    static AudioProfile *getProfile(const ccstd::string &profileName);

    /**
     * Preload audio file.
     * @param filePath The file path of an audio.
     */
    static void preload(const ccstd::string &filePath) { preload(filePath, nullptr); }

    /**
     * Preload audio file.
     * @param filePath The file path of an audio.
     * @param callback A callback which will be called after loading is finished.
     */
    static void preload(const ccstd::string &filePath, const std::function<void(bool isSuccess)> &callback);

    /**
     * Gets playing audio count.
     */
    static int getPlayingAudioCount();

    /**
     * Whether to enable playing audios
     * @note If it's disabled, current playing audios will be stopped and the later 'preload', 'play2d' methods will take no effects.
     */
    static void setEnabled(bool isEnabled);
    /**
     * Check whether AudioEngine is enabled.
     */
    static bool isEnabled();

    /**
     * @brief Get the PCMHeader of audio
     * 
     * @param url The file url of an audio. same as filePath
     * @return PCMHeader of audio
     */
    static PCMHeader getPCMHeader(const char *url);

    /**
     * @brief Get the Buffer object
     * 
     * @param channelID as there might be several channels at same time, select one to get buffer. 
     * Start from 0
     * @return PCM datas behave as a ccstd::vector<char>. You can check byte length in PCMHeader.
     */
    static ccstd::vector<uint8_t> getOriginalPCMBuffer(const char *url, uint32_t channelID);

protected:
    static void addTask(const std::function<void()> &task);
    static void remove(int audioID);

    static void pauseAll(ccstd::vector<int> *pausedAudioIDs);
    static void resumeAll(ccstd::vector<int> *pausedAudioIDs);

    struct ProfileHelper {
        AudioProfile profile;

        ccstd::list<int> audioIDs;

        std::chrono::high_resolution_clock::time_point lastPlayTime;

        ProfileHelper() = default;
    };

    struct AudioInfo {
        const ccstd::string *filePath;
        ProfileHelper *profileHelper;

        float volume;
        bool loop;
        float duration;
        AudioState state;

        AudioInfo();
        ~AudioInfo() = default;

    private:
        AudioInfo(const AudioInfo &info);
        AudioInfo(AudioInfo &&info) noexcept;
        AudioInfo &operator=(const AudioInfo &info);
        AudioInfo &operator=(AudioInfo &&info) noexcept;
    };

    //audioID,audioAttribute
    static ccstd::unordered_map<int, AudioInfo> sAudioIDInfoMap;

    //audio file path,audio IDs
    static ccstd::unordered_map<ccstd::string, ccstd::list<int>> sAudioPathIDMap;

    //profileName,ProfileHelper
    static ccstd::unordered_map<ccstd::string, ProfileHelper> sAudioPathProfileHelperMap;

    static unsigned int sMaxInstances;

    static ProfileHelper *sDefaultProfileHelper;

    static AudioEngineImpl *sAudioEngineImpl;

    class AudioEngineThreadPool;
    static AudioEngineThreadPool *sThreadPool;

    static bool sIsEnabled;

private:
    static float sVolumeFactor;
    static events::EnterBackground::Listener sOnPauseListenerID;
    static events::EnterForeground::Listener sOnResumeListenerID;
    static ccstd::vector<int> sBreakAudioID;

    static void onEnterBackground();
    static void onEnterForeground();

    friend class AudioEngineImpl;
};

} // namespace cc

// end group
/// @}
