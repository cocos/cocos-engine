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

#include "VideoPlayer.h"

using namespace cc;

// No Available on tvOS
#if CC_PLATFORM == CC_PLATFORM_MAC_IOS

//-------------------------------------------------------------------------------------

    #import <AVKit/AVPlayerViewController.h>
    #import <CoreMedia/CMTime.h>
    #include "platform/FileUtils.h"

@interface UIVideoViewWrapperIos : NSObject

typedef NS_ENUM(NSInteger, PlayerbackState) {
    PlayerbackStateUnknown = 0,
    PlayerbackStatePaused,
    PlayerbackStopped,
    PlayerbackStatePlaying,
    PlayerbackStateCompleted
};

@property (assign, nonatomic) AVPlayerViewController *playerController;

- (void)setFrame:(int)left
                :(int)top
                :(int)width
                :(int)height;
- (void)setURL:(int)videoSource :(std::string &)videoUrl;
- (void)play;
- (void)pause;
- (void)resume;
- (void)stop;
- (BOOL)isPlaying;
- (void)seekTo:(float)sec;
- (float)currentTime;
- (float)duration;
- (void)setVisible:(BOOL)visible;
- (void)setKeepRatioEnabled:(BOOL)enabled;
- (void)setFullScreenEnabled:(BOOL)enabled;
- (void)showPlaybackControls:(BOOL)value;
- (BOOL)isFullScreenEnabled;
- (void)cleanup;
- (id)init:(void *)videoPlayer;

- (void)videoFinished:(NSNotification *)notification;

@end

@implementation UIVideoViewWrapperIos {
    int _left;
    int _top;
    int _width;
    int _height;
    bool _keepRatioEnabled;
    bool _fullscreen;
    CGRect _restoreRect;
    PlayerbackState _state;
    VideoPlayer *_videoPlayer;
}

- (id)init:(void *)videoPlayer {
    if (self = [super init]) {
        _keepRatioEnabled = FALSE;
        _left = _top = _width = _height = 0;

        [self initPlayerController];
        _videoPlayer = (VideoPlayer *)videoPlayer;
    }

    return self;
}

- (void)initPlayerController {
    self.playerController = [AVPlayerViewController new];
    [self setFrame:_left:_top:_width:_height];
    [self showPlaybackControls:TRUE];
    [self setKeepRatioEnabled:_keepRatioEnabled];
    _state = PlayerbackStateUnknown;
}

- (void)dealloc {
    [self cleanup];
    [super dealloc];
}

- (void)setFrame:(int)left
                :(int)top
                :(int)width
                :(int)height {
    if (_left == left && _width == width && _top == top && _height == height)
        return;

    _left = left;
    _width = width;
    _top = top;
    _height = height;
    [self.playerController.view setFrame:CGRectMake(left, top, width, height)];
}

- (void)setFullScreenEnabled:(BOOL)enabled {
    // AVPlayerViewController doesn't provide API to enable fullscreen. But you can toggle
    // fullsreen by the playback controllers.
}

- (BOOL)isFullScreenEnabled {
    return false;
}

- (BOOL)isPlaying {
    return (self.playerController.player && self.playerController.player.rate != 0);
}

- (void)setURL:(int)videoSource :(std::string &)videoUrl {
    [self cleanup];
    [self initPlayerController];

    if (videoSource == 1)
        self.playerController.player = [[[AVPlayer alloc] initWithURL:[NSURL URLWithString:@(videoUrl.c_str())]] autorelease];
    else
        self.playerController.player = [[[AVPlayer alloc] initWithURL:[NSURL fileURLWithPath:@(videoUrl.c_str())]] autorelease];

    [self registerPlayerEventListener];
}

- (void)seekTo:(float)sec {
    if (self.playerController.player)
        [self.playerController.player seekToTime:CMTimeMake(sec * 600, 600) toleranceBefore:kCMTimeZero toleranceAfter:kCMTimeZero];
}

- (float)currentTime {
    if (self.playerController.player)
        return CMTimeGetSeconds([self.playerController.player currentTime]);

    return -1;
}

- (float)duration {
    if (self.playerController.player)
        return CMTimeGetSeconds(self.playerController.player.currentItem.asset.duration);

    return -1;
    ;
}

- (void)setVisible:(BOOL)visible {
    [self.playerController.view setHidden:!visible];
    if (!visible)
        [self pause];
}

- (void)setKeepRatioEnabled:(BOOL)enabled {
    _keepRatioEnabled = enabled;
    if (_keepRatioEnabled)
        self.playerController.videoGravity = AVLayerVideoGravityResizeAspectFill;
    else
        self.playerController.videoGravity = AVLayerVideoGravityResize;
}

- (void)play {
    if (self.playerController.player && ![self isPlaying]) {
        [self.playerController.player play];
        _state = PlayerbackStatePlaying;
        _videoPlayer->onPlayEvent((int)VideoPlayer::EventType::PLAYING);
    }
}

- (void)pause {
    if ([self isPlaying]) {
        [self.playerController.player pause];
        _state = PlayerbackStatePaused;
        _videoPlayer->onPlayEvent((int)VideoPlayer::EventType::PAUSED);
    }
}

- (void)resume {
    if (self.playerController.player && _state == PlayerbackStatePaused)
        [self play];
}

- (void)stop {
    // AVPlayer doesn't have `stop` method, so just pause it, and seek time to 0.
    if (self.playerController.player && _state != PlayerbackStopped) {
        [self seekTo:0];
        [self.playerController.player pause];
        _state = PlayerbackStopped;
        _videoPlayer->onPlayEvent((int)VideoPlayer::EventType::STOPPED);
    }
}

// Private functions

- (void)cleanup {
    [self stop];
    [self removePlayerEventListener];
    [self.playerController.view removeFromSuperview];
    [self.playerController release];
}

- (void)removePlayerEventListener {
    if (self.playerController.player) {
        [[NSNotificationCenter defaultCenter] removeObserver:self
                                                        name:AVPlayerItemDidPlayToEndTimeNotification
                                                      object:self.playerController.player.currentItem];

        [self.playerController.player removeObserver:self forKeyPath:@"status"];
    }
}

- (void)registerPlayerEventListener {
    if (self.playerController.player) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(videoFinished:)
                                                     name:AVPlayerItemDidPlayToEndTimeNotification
                                                   object:self.playerController.player.currentItem];

        [self.playerController.player addObserver:self forKeyPath:@"status" options:0 context:nil];
    }
}

- (void)showPlaybackControls:(BOOL)value {
    self.playerController.showsPlaybackControls = value;
}

- (void)videoFinished:(NSNotification *)notification {
    if (_videoPlayer != nullptr) {
        _videoPlayer->onPlayEvent((int)VideoPlayer::EventType::COMPLETED);
        _state = PlayerbackStateCompleted;

        // Seek to 0 to make it playable again.
        [self seekTo:0];
    }
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context {

    auto player = self.playerController.player;
    if (object == player && [keyPath isEqualToString:@"status"]) {
        if (player.status == AVPlayerStatusReadyToPlay) {
            [self addPlayerControllerSubView];
            _videoPlayer->onPlayEvent((int)VideoPlayer::EventType::META_LOADED);
            _videoPlayer->onPlayEvent((int)VideoPlayer::EventType::READY_TO_PLAY);
        } else if (player.status == AVPlayerStatusFailed) {
            // something went wrong. player.error should contain some information
            NSLog(@"Failed to load video");
        }
    }
}

- (void)addPlayerControllerSubView {
    auto eaglview = UIApplication.sharedApplication.delegate.window.rootViewController.view;
    [eaglview addSubview:self.playerController.view];
}

@end
//------------------------------------------------------------------------------------------------------------

VideoPlayer::VideoPlayer()
: _videoPlayerIndex(-1),
  _fullScreenEnabled(false),
  _fullScreenDirty(false),
  _keepAspectRatioEnabled(false) {
    _videoView = [[UIVideoViewWrapperIos alloc] init:this];

    #if CC_VIDEOPLAYER_DEBUG_DRAW
    _debugDrawNode = DrawNode::create();
    addChild(_debugDrawNode);
    #endif
}

VideoPlayer::~VideoPlayer() {
    if (_videoView) {
        [((UIVideoViewWrapperIos *)_videoView) dealloc];
    }
}

void VideoPlayer::setURL(const std::string &videoUrl) {
    if (videoUrl.find("://") == std::string::npos) {
        _videoURL = FileUtils::getInstance()->fullPathForFilename(videoUrl);
        _videoSource = VideoPlayer::Source::FILENAME;
    } else {
        _videoURL = videoUrl;
        _videoSource = VideoPlayer::Source::URL;
    }

    [((UIVideoViewWrapperIos *)_videoView) setURL:(int) _videoSource:_videoURL];
}

void VideoPlayer::setFullScreenEnabled(bool enabled) {
    [((UIVideoViewWrapperIos *)_videoView) setFullScreenEnabled:enabled];
}

void VideoPlayer::setKeepAspectRatioEnabled(bool enable) {
    if (_keepAspectRatioEnabled != enable) {
        _keepAspectRatioEnabled = enable;
        [((UIVideoViewWrapperIos *)_videoView) setKeepRatioEnabled:enable];
    }
}

void VideoPlayer::play() {
    if (!_videoURL.empty() && _isVisible) {
        [((UIVideoViewWrapperIos *)_videoView) play];
    }
}

void VideoPlayer::pause() {
    if (!_videoURL.empty()) {
        [((UIVideoViewWrapperIos *)_videoView) pause];
    }
}

void VideoPlayer::stop() {
    if (!_videoURL.empty()) {
        [((UIVideoViewWrapperIos *)_videoView) stop];
    }
}

void VideoPlayer::seekTo(float sec) {
    if (!_videoURL.empty()) {
        [((UIVideoViewWrapperIos *)_videoView) seekTo:sec];
    }
}

float VideoPlayer::currentTime() const {
    return [((UIVideoViewWrapperIos *)_videoView) currentTime];
}

float VideoPlayer::duration() const {
    return [((UIVideoViewWrapperIos *)_videoView) duration];
}

void VideoPlayer::setVisible(bool visible) {
    _isVisible = visible;

    if (!visible) {
        [((UIVideoViewWrapperIos *)_videoView) setVisible:NO];
    } else {
        [((UIVideoViewWrapperIos *)_videoView) setVisible:YES];
    }
}

void VideoPlayer::addEventListener(const std::string &name, const VideoPlayer::ccVideoPlayerCallback &callback) {
    _eventCallback[name] = callback;
}

void VideoPlayer::onPlayEvent(int event) {
    switch ((EventType)event) {
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

void VideoPlayer::setFrame(float x, float y, float width, float height) {
    auto eaglview = UIApplication.sharedApplication.delegate.window.rootViewController.view;
    auto scaleFactor = [eaglview contentScaleFactor];
    [((UIVideoViewWrapperIos *)_videoView) setFrame:x / scaleFactor:y / scaleFactor:width / scaleFactor:height / scaleFactor];
}

#endif
