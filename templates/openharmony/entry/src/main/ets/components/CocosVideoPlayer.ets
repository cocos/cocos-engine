/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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
import { WorkerManager } from '../cocos/WorkerManager'
import { PortProxy } from '../common/PortProxy'

enum EventType {
  PLAYING = 0,
  PAUSED,
  STOPPED,
  COMPLETED,
  META_LOADED,
  CLICKED,
  READY_TO_PLAY,
  UPDATE,
  QUIT_FULLSCREEN = 1000
};

@Observed
export class VideoInfo {
  public x: number = 0;
  public y: number = 0;
  public w: number = 0;
  public h: number = 0;
  // url
  public url: string = ""
  public viewTag: string = ''
  public visible: boolean = true

  public duration: number = 0;
  public currentTime: number = 0;
  public isFullScreen: boolean = false;
  public currentProgressRate:number | string | PlaybackSpeed;

  /**
   * https://gitee.com/openharmony/docs/blob/master/zh-cn/application-dev/reference/arkui-ts/ts-media-components-video.md#videocontroller
   *
   */
  public controller: VideoController = new VideoController()

  constructor(x: number, y: number, w: number, h: number, viewTag: string) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.viewTag = viewTag
  }
}


@Component
export struct CocosVideoPlayer {
  @ObjectLink videoInfo: VideoInfo;
  public workPort: PortProxy;
  build() {
    Video({ src: this.videoInfo.url, controller: this.videoInfo.controller, currentProgressRate:this.videoInfo.currentProgressRate })
      .position({ x: this.videoInfo.x, y: this.videoInfo.y })
      .width(this.videoInfo.w)
      .height(this.videoInfo.h)
      .controls(false)
      .autoPlay(true)
      .onStart(() => {
        this.workPort.postMessage("onVideoEvent",{videoTag:this.videoInfo.viewTag, videoEvent:EventType.PLAYING});
      })
      .onPause(() => {
        this.workPort.postMessage("onVideoEvent",{videoTag:this.videoInfo.viewTag, videoEvent:EventType.PAUSED});
      })
      .onFinish(() => {
        this.workPort.postMessage("onVideoEvent",{videoTag:this.videoInfo.viewTag, videoEvent:EventType.COMPLETED});
      })
      .onPrepared((event: {
        duration: number;
      }) => {
        this.videoInfo.duration = event.duration;
        this.workPort.postMessage("onVideoEvent",{videoTag:this.videoInfo.viewTag, videoEvent:EventType.READY_TO_PLAY, args:event.duration});
      })
      .onUpdate((event?: {
        time: number;
      }) => {
        this.videoInfo.currentTime = event.time
        this.workPort.postMessage("onVideoEvent",{videoTag:this.videoInfo.viewTag, videoEvent:EventType.UPDATE, args:event.time});
      })
      .onFullscreenChange((event?: {
        fullscreen: boolean;
      }) => {
        if (!event.fullscreen) {
          this.workPort.postMessage("onVideoEvent",{videoTag:this.videoInfo.viewTag, videoEvent:EventType.QUIT_FULLSCREEN});
        }
        this.videoInfo.isFullScreen = event.fullscreen
      })
  }
}