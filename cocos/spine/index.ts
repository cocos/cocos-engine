/**
 * @packageDocumentation
 * @module spine
 */

import { ccenum } from '../core';
import spine from './lib/spine-core';

/**
 * @en
 * The global main namespace of Spine, all classes, functions,
 * properties and constants of Spine are defined in this namespace
 * @zh
 * Spine 的全局的命名空间，
 * 与 Spine 相关的所有的类，函数，属性，常量都在这个命名空间中定义。
 * @module sp
 * @main sp
 */

/*
 * Reference:
 * http://esotericsoftware.com/spine-runtime-terminology
 * http://esotericsoftware.com/files/runtime-diagram.png
 * http://en.esotericsoftware.com/spine-using-runtimes
 */

export * from './skeleton';
export * from './skeleton-data';
export * from './skeleton-texture';
export * from './vertex-effect-delegate';
export * from './assembler';

export { spine };

/**
 * @en
 * The global time scale of Spine.
 * @zh
 * Spine 全局时间缩放率。
 * @example
 * sp.timeScale = 0.8;
 */

// The attachment type of spine. It contains three type: REGION(0), BOUNDING_BOX(1), MESH(2) and SKINNED_MESH.
export enum ATTACHMENT_TYPE {
    REGION = 0,
    BOUNDING_BOX = 1,
    MESH = 2,
    SKINNED_MESH = 3
}
ccenum(ATTACHMENT_TYPE);

/**
 * @en The event type of spine skeleton animation.
 * @zh 骨骼动画事件类型。
 * @enum AnimationEventType
 */
export enum AnimationEventType {
    /**
     * @en The play spine skeleton animation start type.
     * @zh 开始播放骨骼动画。
     * @property {Number} START
     */
    START = 0,
    /**
     * @en Another entry has replaced this entry as the current entry. This entry may continue being applied for mixing.
     * @zh 当前的 entry 被其他的 entry 替换。当使用 mixing 时，当前的 entry 会继续运行。
     */
    INTERRUPT = 1,
    /**
     * @en The play spine skeleton animation finish type.
     * @zh 播放骨骼动画结束。
     * @property {Number} END
     */
    END = 2,
    /**
     * @en The entry will be disposed.
     * @zh entry 将被销毁。
     */
    DISPOSE = 3,
    /**
     * @en The play spine skeleton animation complete type.
     * @zh 播放骨骼动画完成。
     * @property {Number} COMPLETE
     */
    COMPLETE = 4,
    /**
     * @en The spine skeleton animation event type.
     * @zh 骨骼动画事件。
     * @property {Number} EVENT
     */
    EVENT = 5
}
ccenum(AnimationEventType);
