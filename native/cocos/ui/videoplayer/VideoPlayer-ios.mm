/****************************************************************************
 Copyright (c) 2014-2016 Chukong Technologies Inc.

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

USING_NS_CC;

// No Available on tvOS
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS && !defined(CC_TARGET_OS_TVOS)

//-------------------------------------------------------------------------------------

#import <AVKit/AVPlayerViewController.h>
#import <CoreMedia/CMTime.h>
#include "platform/CCApplication.h"
#include "platform/ios/CCEAGLView-ios.h"
#include "platform/CCFileUtils.h"

@interface UIVideoViewWrapperIos : NSObject

typedef NS_ENUM(NSInteger, PlayerbackState) {
    PlayerbackStateUnknown = 0,
    PlayerbackStatePaused,
    PlayerbackStopped,
    PlayerbackStatePlaying,
    PlayerbackStateCompleted
};

@property (strong, nonatomic) AVPlayerViewController * playerController;

- (void) setFrame:(int) left :(int) top :(int) width :(int) height;
- (void) setURL:(int) videoSource :(std::string&) videoUrl;
- (void) play;
- (void) pause;
- (void) resume;
- (void) stop;
- (BOOL) isPlaying;
- (void) seekTo:(float) sec;
- (float) currentTime;
- (float) duration;
- (void) setVisible:(BOOL) visible;
- (void) setKeepRatioEnabled:(BOOL) enabled;
- (void) setFullScreenEnabled:(BOOL) enabled;
- (void) showPlaybackControls:(BOOL) value;
- (BOOL) isFullScreenEnabled;
- (void) cleanup;
-(id) init:(void*) videoPlayer;

-(void) videoFinished:(NSNotification*) notification;

@end

@implementation UIVideoViewWrapperIos
{
    int _left;
    int _top;
    int _width;
    int _height;
    bool _keepRatioEnabled;
    bool _fullscreen;
    CGRect _restoreRect;
    PlayerbackState _state;
    VideoPlayer* _videoPlayer;
}

-(id)init:(void*)videoPlayer
{
    if (self = [super init]) {
        self.playerController = [AVPlayerViewController new];

        [self showPlaybackControls:TRUE];
        [self setKeepRatioEnabled:FALSE];

        _videoPlayer = (VideoPlayer*)videoPlayer;
        _state = PlayerbackStateUnknown;
    }

    return self;
}

-(void) dealloc
{
    [self cleanup];
    [self.playerController release];
    [super dealloc];
}

-(void) setFrame:(int)left :(int)top :(int)width :(int)height
{
    if (_left == left && _width == width && _top == top && _height == height)
        return;
    
    _left = left;
    _width = width;
    _top = top;
    _height = height;
    [self.playerController.view setFrame:CGRectMake(left, top, width, height)];
}

-(void) setFullScreenEnabled:(BOOL) enabled
{
    // AVPlayerViewController doesn't provide API to enable fullscreen. But you can toggle
    // fullsreen by the playback controllers.
}

-(BOOL) isFullScreenEnabled
{
    return false;
}

-(BOOL) isPlaying
{
    return (_state == PlayerbackState::PlayerbackStatePlaying);
}

-(void) setURL:(int)videoSource :(std::string &)videoUrl
{
    [self cleanup];

    if (videoSource == 1)
        self.playerController.player = [[[AVPlayer alloc] initWithURL:[NSURL URLWithString:@(videoUrl.c_str())]] autorelease];
    else
        self.playerController.player = [[[AVPlayer alloc] initWithURL:[NSURL fileURLWithPath:@(videoUrl.c_str())]] autorelease];

    [self setKeepRatioEnabled:_keepRatioEnabled];
    [self showPlaybackControls:TRUE];

    auto eaglview = (CCEAGLView*)cocos2d::Application::getInstance()->getView();
    [eaglview addSubview:self.playerController.view];
    [self registerPlayerEventListener];
}

-(void) seekTo:(float)sec
{
    if (self.playerController.player)
        [self.playerController.player seekToTime:CMTimeMake(sec, 1)];
}

-(float) currentTime
{
    if (self.playerController.player)
        return CMTimeGetSeconds([self.playerController.player currentTime]);

    return -1;
}

-(float) duration
{
    if (self.playerController.player)
        return CMTimeGetSeconds(self.playerController.player.currentItem.asset.duration);

    return  -1;;
}

-(void) setVisible:(BOOL)visible
{
    [self.playerController.view setHidden:!visible];
    if (!visible)
        [self pause];
}

-(void) setKeepRatioEnabled:(BOOL)enabled
{
    _keepRatioEnabled = enabled;
    if (_keepRatioEnabled)
        self.playerController.videoGravity = AVLayerVideoGravityResizeAspect;
    else
        self.playerController.videoGravity = AVLayerVideoGravityResizeAspectFill;
}

-(void) play
{
    if (self.playerController.player && _state != PlayerbackStatePlaying) {
        [self.playerController.player play];
        _state = PlayerbackStatePlaying;
        _videoPlayer->onPlayEvent((int)VideoPlayer::EventType::PLAYING);
    }
}

-(void) pause
{
    if (self.playerController.player && _state == PlayerbackStatePlaying) {
        [self.playerController.player pause];
        _state = PlayerbackStatePaused;
        _videoPlayer->onPlayEvent((int)VideoPlayer::EventType::PAUSED);
    }
}

-(void) resume
{
    if (self.playerController.player && _state == PlayerbackStatePaused)
        [self play];
}

-(void) stop
{
    // AVPlayer doesn't have stop, so just pause it, and seek time to 0.
    if (self.playerController.player && _state != PlayerbackStopped) {
        [self seekTo:0];
        [self.playerController.player pause];
        _state = PlayerbackStopped;
        _videoPlayer->onPlayEvent((int)VideoPlayer::EventType::STOPPED);
    }
}

// Private functions

-(void) cleanup
{
    [self stop];
    [self removePlayerEventListener];
    [self.playerController.view removeFromSuperview];
}

-(void) removePlayerEventListener {
    if (self.playerController.player)
    {
        [[NSNotificationCenter defaultCenter] removeObserver:self
                                              name:AVPlayerItemDidPlayToEndTimeNotification
                                              object:self.playerController.player.currentItem];

       [self.playerController.player removeObserver:self forKeyPath:@"status"];
    }
}

-(void) registerPlayerEventListener
{
    if (self.playerController.player)
    {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(videoFinished:)
                                                 name:AVPlayerItemDidPlayToEndTimeNotification
                                                 object:self.playerController.player.currentItem];

        [self.playerController.player addObserver:self forKeyPath:@"status" options:0 context:nil];
    }
}

-(void) showPlaybackControls:(BOOL)value
{
    self.playerController.showsPlaybackControls = value;
}

-(void) videoFinished:(NSNotification *)notification
{
    if(_videoPlayer != nullptr) {
        _videoPlayer->onPlayEvent((int)VideoPlayer::EventType::COMPLETED);
        _state = PlayerbackStateCompleted;

        // Seek to 0 to make it playable again.
        [self seekTo:0];
    }
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object
                        change:(NSDictionary *)change context:(void *)context {

    auto player = self.playerController.player;
    if (object == player && [keyPath isEqualToString:@"status"]) {
        if (player.status == AVPlayerStatusReadyToPlay) {
            _videoPlayer->onPlayEvent((int)VideoPlayer::EventType::META_LOADED);
            _videoPlayer->onPlayEvent((int)VideoPlayer::EventType::READY_TO_PLAY);
        } else if (player.status == AVPlayerStatusFailed) {
            // something went wrong. player.error should contain some information
            NSLog(@"Failed to load video");
        }
    }
}

@end
//------------------------------------------------------------------------------------------------------------

VideoPlayer::VideoPlayer()
: _videoPlayerIndex(-1)
, _fullScreenEnabled(false)
, _fullScreenDirty(false)
, _keepAspectRatioEnabled(false)
{
    _videoView = [[UIVideoViewWrapperIos alloc] init:this];

#if CC_VIDEOPLAYER_DEBUG_DRAW
    _debugDrawNode = DrawNode::create();
    addChild(_debugDrawNode);
#endif
}

VideoPlayer::~VideoPlayer()
{
    if(_videoView)
    {
        [((UIVideoViewWrapperIos*)_videoView) dealloc];
    }
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
    
    [((UIVideoViewWrapperIos*)_videoView) setURL:(int)_videoSource :_videoURL];
}

void VideoPlayer::setFullScreenEnabled(bool enabled)
{
    [((UIVideoViewWrapperIos*)_videoView) setFullScreenEnabled:enabled];
}

void VideoPlayer::setKeepAspectRatioEnabled(bool enable)
{
    if (_keepAspectRatioEnabled != enable)
    {
        _keepAspectRatioEnabled = enable;
        [((UIVideoViewWrapperIos*)_videoView) setKeepRatioEnabled:enable];
    }
}

void VideoPlayer::play()
{
    if (! _videoURL.empty() && _isVisible)
    {
        [((UIVideoViewWrapperIos*)_videoView) play];
    }
}

void VideoPlayer::pause()
{
    if (! _videoURL.empty())
    {
        [((UIVideoViewWrapperIos*)_videoView) pause];
    }
}

void VideoPlayer::stop()
{
    if (! _videoURL.empty())
    {
        [((UIVideoViewWrapperIos*)_videoView) stop];
    }
}

void VideoPlayer::seekTo(float sec)
{
    if (! _videoURL.empty())
    {
        [((UIVideoViewWrapperIos*)_videoView) seekTo:sec];
    }
}

float VideoPlayer::currentTime()const
{
    return [((UIVideoViewWrapperIos*)_videoView) currentTime];
}

float VideoPlayer::duration()const
{
    return [((UIVideoViewWrapperIos*)_videoView) duration];
}

void VideoPlayer::setVisible(bool visible)
{
    _isVisible = visible;

    if (!visible)
    {
        [((UIVideoViewWrapperIos*)_videoView) setVisible:NO];
    }
    else
    {
        [((UIVideoViewWrapperIos*)_videoView) setVisible:YES];
    }
}

void VideoPlayer::addEventListener(const std::string& name, const VideoPlayer::ccVideoPlayerCallback& callback)
{
    _eventCallback[name] = callback;
}

void VideoPlayer::onPlayEvent(int event)
{
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

void VideoPlayer::setFrame(float x, float y, float width, float height)
{
    auto eaglview = (CCEAGLView*)cocos2d::Application::getInstance()->getView();
    auto scaleFactor = [eaglview contentScaleFactor];
    [((UIVideoViewWrapperIos*)_videoView) setFrame:x/scaleFactor
                                                  :y/scaleFactor
                                                  :width/scaleFactor
                                                  :height/scaleFactor];
}

#endif
