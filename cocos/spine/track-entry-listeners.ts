/*
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 */

import spine from './lib/spine-core.js';

/**
 * @en TrackEntryListeners allows you to listen to animation events on an animation track.
 * @zh TrackEntryListeners 允许您监听动画轨道上的动画事件。
 */
export class TrackEntryListeners {
    /**
    * @en be called when an animation track starts.
    * @zh 在动画轨道开始时调用。
    * @param entry @en animation track. @zh 动画条目。
    */
    start?: ((entry: spine.TrackEntry) => void);
    /**
    * @en be called when an animation track is interrupted.
    * @zh 在动画轨道被打断时调用。
    * @param entry @en animation track. @zh 动画条目。
    */
    interrupt?: ((entry: spine.TrackEntry) => void);
    /**
    * @en be called when an animation track ends.
    * @zh 在动画轨道结束时调用。
    * @param entry @en animation track. @zh 动画条目。
    */
    end?: ((entry: spine.TrackEntry) => void);
    /**
    * @en be called when an animation track is disposed.
    * @zh 在动画轨道被销毁时调用。
    * @param entry @en animation track. @zh 动画条目。
    */
    dispose?: ((entry: spine.TrackEntry) => void);
    /**
    * @en be called when an animation track completes one loop.
    * @zh 在动画轨道完成一遍循环时调用。
    * @param entry @en animation track. @zh 动画条目。
    */
    complete?: ((entry: spine.TrackEntry) => void);
    /**
    * @en be called when an event occurs on an animation track.
    * @zh 在动画轨道上发生事件时调用。
    * @param entry @en animation track. @zh 动画条目。
    * @param event @en event object @zh 事件
    */
    event?: ((entry: spine.TrackEntry, event: Event) => void);

    /**
    * @en Get the TrackEntryListeners object for a given animation track. If a TrackEntryListeners
    * object has not yet been assigned to the animation track, a new TrackEntryListeners object is created.
    * @zh 获取给定动画轨道的TrackEntryListeners对象。如果尚未为动画轨道分配TrackEntryListeners对象，
    * 则会创建一个新的TrackEntryListeners对象。
    * @param entry @en animation track. @zh 动画条目。
    * @return {spine.AnimationStateListener} @en TrackEntryListeners object. @zh TrackEntryListeners 对象。
    */
    static getListeners (entry: spine.TrackEntry) {
        if (!entry.listener) {
            entry.listener = new TrackEntryListeners() as any;
        }
        return entry.listener;
    }
}
