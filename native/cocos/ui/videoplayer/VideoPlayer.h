/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.
 Copyright (c) 2016-2022 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <functional>
#include <map>
#include <string>
#include "base/Macros.h"
#include "base/Ref.h"

#ifndef OBJC_CLASS
    #ifdef __OBJC__
        #define OBJC_CLASS(name) @class name
    #else
        #define OBJC_CLASS(name) class name
    #endif
#endif // OBJC_CLASS

namespace cc {

/**
 * @class VideoPlayer
 * @brief Displays a video file.
 *
 * @note VideoPlayer displays a video file base on system widget.
 * It's mean VideoPlayer displays a video file above all graphical elements of cocos2d-x.
 * @js NA
 */
class VideoPlayer : public Ref {
public:
    /**
     * Videoplayer play event type.
     */
    enum class EventType {
        PLAYING = 0,
        PAUSED,
        STOPPED,
        COMPLETED,
        META_LOADED,
        CLICKED,
        READY_TO_PLAY
    };

    VideoPlayer();

    /**
     * A callback which will be called after specific VideoPlayer event happens.
     */
    using ccVideoPlayerCallback = std::function<void()>;

    /**
     * Sets a URL as a video source for VideoPlayer.
     */
    virtual void setURL(const std::string &videoURL);

    /**
     * Starts playback.
     */
    virtual void play();

    /**
     * Pauses playback.
     */
    virtual void pause();

    /**
     * Stops playback.
     */
    virtual void stop();

    /**
     * Seeks to specified time position.
     *
     * @param sec   The offset in seconds from the start to seek to.
     */
    virtual void seekTo(float sec);

    /**
     * Get the current play time, measure in seconds.
     */
    float currentTime() const;

    float duration() const;

    /**
     * Causes the video player to keep aspect ratio or no when displaying the video.
     *
     * @param enable    Specify true to keep aspect ratio or false to scale the video until
     * both dimensions fit the visible bounds of the view exactly.
     */
    virtual void setKeepAspectRatioEnabled(bool enable);

    /**
     * Indicates whether the video player keep aspect ratio when displaying the video.
     */
    virtual bool isKeepAspectRatioEnabled() const { return _keepAspectRatioEnabled; }

    /**
     * Causes the video player to enter or exit full-screen mode.
     *
     * @param fullscreen    Specify true to enter full-screen mode or false to exit full-screen mode.
     */
    virtual void setFullScreenEnabled(bool fullscreen);

    /**
     * Register a callback to be invoked when the video state is updated.
     *
     * @param callback  The callback that will be run.
     */
    virtual void addEventListener(const std::string &name, const VideoPlayer::ccVideoPlayerCallback &callback);

    /**
     * @brief A function which will be called when video is playing.
     *
     * @param event @see VideoPlayer::EventType.
     */
    virtual void onPlayEvent(int event);

    /**
     * Toggle visibility of VideoPlayer.
     */
    virtual void setVisible(bool visible);

    /**
     * Set the rect of VideoPlayer.
     */
    virtual void setFrame(float x, float y, float width, float height);

protected:
    ~VideoPlayer() override;

protected:
    enum class Source {
        FILENAME = 0,
        URL
    };

    bool _isVisible;
    bool _fullScreenDirty;
    bool _fullScreenEnabled;
    bool _keepAspectRatioEnabled;

    std::string _videoURL;
    Source      _videoSource;

    int                                          _videoPlayerIndex;
    std::map<std::string, ccVideoPlayerCallback> _eventCallback;

    void *_videoView;
};

} // namespace cc
