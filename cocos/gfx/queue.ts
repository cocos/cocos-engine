/**
 * @category gfx
 */

import { GFXCommandBuffer } from './command-buffer';
import { GFXObject, GFXObjectType, GFXQueueType } from './define';
import { GFXDevice } from './device';

/**
 * @zh
 * GFX队列描述信息。
 */
export interface IGFXQueueInfo {
    type: GFXQueueType;
}

/**
 * @zh
 * GFX队列。
 */
export abstract class GFXQueue extends GFXObject {

    /**
     * @zh
     * 队列类型。
     */
    public get type (): number {
        return this._type;
    }

    /**
     * @zh
     * GFX设备。
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * 队列类型。
     */
    protected _type: GFXQueueType = GFXQueueType.GRAPHICS;

    /**
     * @zh
     * 构造函数。
     * @param device GFX设备。
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.QUEUE);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数。
     * @param info GFX队列描述信息。
     */
    public abstract initialize (info: IGFXQueueInfo): boolean;

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy ();

    /**
     * @zh
     * 提交命令缓冲数组。
     * @param cmdBuffs GFX命令缓冲数组。
     * @param fence GFX栅栏。
     */
    public abstract submit (cmdBuffs: GFXCommandBuffer[], fence?);
}
