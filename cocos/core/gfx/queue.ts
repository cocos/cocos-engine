/**
 * @category gfx
 */

import { GFXCommandBuffer } from './command-buffer';
import { GFXObject, GFXObjectType, GFXQueueType, GFXStatus } from './define';
import { GFXDevice } from './device';

export interface IGFXQueueInfo {
    type: GFXQueueType;
}

/**
 * @en GFX Queue.
 * @zh GFX 队列。
 */
export abstract class GFXQueue extends GFXObject {

    /**
     * @en Get current type.
     * @zh 队列类型。
     */
    public get type (): number {
        return this._type;
    }

    protected _device: GFXDevice;

    protected _type: GFXQueueType = GFXQueueType.GRAPHICS;

    constructor (device: GFXDevice) {
        super(GFXObjectType.QUEUE);
        this._device = device;
    }

    public initialize (info: IGFXQueueInfo) {
        this._type = info.type;
        if (this._initialize(info)) { this._status = GFXStatus.SUCCESS; return true; }
        else { this._status = GFXStatus.FAILED; return false; }
    }

    public destroy () {
        if (this._status !== GFXStatus.SUCCESS) { return; }
        this._destroy();
        this._status = GFXStatus.UNREADY;
    }

    protected abstract _initialize (info: IGFXQueueInfo): boolean;

    protected abstract _destroy (): void;

    /**
     * @en Submit command buffers.
     * @zh 提交命令缓冲数组。
     * @param cmdBuffs The command buffers to be submitted.
     * @param fence The syncing fence.
     */
    public abstract submit (cmdBuffs: GFXCommandBuffer[], fence?: any): void;
}
