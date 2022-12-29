/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { EventTarget } from '../core';

export enum PipelineEventType {
    /**
     * @en
     * The event type for render frame begin event
     *
     * @zh
     * 帧渲染开始事件。
     */
    RENDER_FRAME_BEGIN = 'render-frame-begin',

    /**
      * @en
      * The event type for render frame end event
      *
      * @zh
      * 帧渲染结束事件。
      */
    RENDER_FRAME_END = 'render-frame-end',

    /**
     * @en
     * The event type for render camera begin event
     *
     * @zh
     * 相机渲染开始事件。
     */
    RENDER_CAMERA_BEGIN = 'render-camera-begin',

    /**
     * @en
     * The event type for render camera end event
     *
     * @zh
     * 相机渲染结束事件。
     */
    RENDER_CAMERA_END = 'render-camera-end',

    /**
      * @en
      * FBO attachment texture zoom event
      *
      * @zh
      * FBO附件纹理缩放事件。
      */
    ATTACHMENT_SCALE_CAHNGED = 'attachment-scale-changed'
}

export class PipelineEventProcessor extends EventTarget {
    public eventTargetOn = super.on;
    public eventTargetOnce = super.once;

    public on (type: PipelineEventType, callback: any, target?: any, once?: boolean): typeof callback {
        return this.eventTargetOn(type, callback, target, once);
    }

    public once (type: PipelineEventType, callback: any, target?: any): typeof callback {
        return this.eventTargetOnce(type, callback, target);
    }
}

export interface IPipelineEvent {
    on (type: PipelineEventType, callback: any, target?: any, once?: boolean): typeof callback;
    once (type: PipelineEventType, callback: any, target?: any): typeof callback;
    off (type: PipelineEventType, callback?: any, target?: any);
    emit (type: PipelineEventType, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any);
    targetOff (typeOrTarget: any): void;
    removeAll (typeOrTarget: any): void;
    hasEventListener (type: PipelineEventType, callback?: any, target?: any): boolean;
}
