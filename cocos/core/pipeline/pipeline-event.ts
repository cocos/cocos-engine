import { EventTarget } from '../event/event-target';

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
