/**
 * @category gfx
 */

import { GFXCommandBuffer } from './command-buffer';
import { GFXObject, GFXObjectType, GFXQueueType } from './define';
import { GFXDevice } from './device';
import { GFXFence } from './fence';

export interface IGFXQueueInfo {
    type: GFXQueueType;
    forceSync?: boolean;
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
    get type (): number {
        return this._type;
    }

    protected _device: GFXDevice;

    protected _type: GFXQueueType = GFXQueueType.GRAPHICS;

    protected _isAsync = false;

    constructor (device: GFXDevice) {
        super(GFXObjectType.QUEUE);
        this._device = device;
    }

    public abstract initialize (info: IGFXQueueInfo): boolean;

    public abstract destroy (): void;

    public isAsync () { return this._isAsync; }

    /**
     * @en Submit command buffers.
     * @zh 提交命令缓冲数组。
     * @param cmdBuffs The command buffers to be submitted.
     * @param fence The syncing fence.
     */
    public abstract submit (cmdBuffs: GFXCommandBuffer[], fence?: GFXFence): void;
}
