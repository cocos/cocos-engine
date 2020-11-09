/**
 * @packageDocumentation
 * @module gfx
 */

import { CommandBuffer } from './command-buffer';
import { Device } from './device';
import { Fence } from './fence';
import { Obj, ObjectType, QueueType } from './define';

export class QueueInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public type: QueueType = QueueType.GRAPHICS,
    ) {}
}

/**
 * @en GFX Queue.
 * @zh GFX 队列。
 */
export abstract class Queue extends Obj {

    /**
     * @en Get current type.
     * @zh 队列类型。
     */
    get type (): number {
        return this._type;
    }

    protected _device: Device;

    protected _type: QueueType = QueueType.GRAPHICS;

    protected _isAsync = false;

    constructor (device: Device) {
        super(ObjectType.QUEUE);
        this._device = device;
    }

    public isAsync () { return this._isAsync; }

    public abstract initialize (info: QueueInfo): boolean;

    public abstract destroy (): void;

    /**
     * @en Submit command buffers.
     * @zh 提交命令缓冲数组。
     * @param cmdBuffs The command buffers to be submitted.
     * @param fence The syncing fence.
     */
    public abstract submit (cmdBuffs: CommandBuffer[], fence?: Fence): void;
}
