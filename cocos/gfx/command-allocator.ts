import { GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';

/**
 * @zh
 * GFX命令分配器描述信息。
 */
// tslint:disable-next-line:no-empty-interface
export interface IGFXCommandAllocatorInfo {
}

/**
 * @zh
 * GFX命令分配器。
 */
export abstract class GFXCommandAllocator extends GFXObject {

    /**
     * @zh
     * GFX设备。
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * 构造函数。
     * @param device GFX设备。
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.COMMAND_ALLOCATOR);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数。
     * @param info GFX命令分配器描述信息。
     */
    public abstract initialize (info: IGFXCommandAllocatorInfo): boolean;

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy ();
}
