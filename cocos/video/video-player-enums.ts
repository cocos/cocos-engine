/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

/**
 * @en Enum for video resource type.
 * @zh 视频资源类型枚举。
 */
import { Enum } from '../core/value-types';

export const ResourceType = Enum({
    /**
     * @en
     * The remote resource type.
     * @zh
     * 远程视频。
     */
    REMOTE: 0,
    /**
     * @en
     * The local resource type.
     * @zh
     * 本地视频。
     */
    LOCAL: 1,
});

export enum EventType {
    /**
     * @en None.
     * @zh 无。
     */
    NONE = 'none',
    /**
     * @en The video is playing.
     * @zh 视频播放中。
     */
    PLAYING = 'playing',
    /**
     * @en Video paused.
     * @zh 视频暂停中。
     */
    PAUSED = 'paused',
    /**
     * @en Video stopped.
     * @zh 视频停止中。
     */
    STOPPED = 'stopped',
    /**
     * @en Video playback complete.
     * @zh 视频播放完毕。
     */
    COMPLETED = 'completed',
    /**
     * @en Video metadata loading complete.
     * @zh 视频元数据加载完毕。
     */
    META_LOADED = 'meta-loaded',
    /**
     * @en The video is ready to play when loaded.
     * @zh 视频加载完毕可播放。
     */
    READY_TO_PLAY = 'ready-to-play',
    /**
     * @en Errors triggered while processing video
     * @zh 处理视频时触发的错误。
     */
    ERROR = 'error',

    /**
     * @en Video is clicked.
     * @zh 视频被点击。
     */
    CLICKED = 'clicked',
}

export enum READY_STATE {
    /**
     * @en No information about whether audio/video is ready.
     * @zh 没有关于音频/视频是否就绪的信息。
     */
    HAVE_NOTHING,
    /**
     * @en Metadata about audio/video ready.
     * @zh 关于音频/视频就绪的元数据。
     */
    HAVE_METADATA,
    /**
     * @en Data is available for the current playback position, but not enough data to play the next frame/ms.
     * @zh 当前播放位置的数据可用，但没有足够的数据来播放下一帧/毫秒。
     */
    HAVE_CURRENT_DATA,
    /**
     * @en Data for the current and at least the next frame is available.
     * @zh 当前及至少下一帧的数据是可用的。
     */
    HAVE_FUTURE_DATA,
    /**
     * @en Available data is enough to start playback.
     * @zh 可用数据足以开始播放。
     */
    HAVE_ENOUGH_DATA
}
