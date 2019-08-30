/**
 * @category gfx
 */

import { GFXBuffer } from './buffer';
import { GFXBindingType, GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXSampler } from './sampler';
import { GFXTextureView } from './texture-view';

/**
 * @zh
 * GFX绑定。
 */
export interface IGFXBinding {
    binding: number;
    type: GFXBindingType;
    name: string;
}

/**
 * @zh
 * GFX绑定布局描述信息。
 */
export interface IGFXBindingLayoutInfo {
    bindings: IGFXBinding[];
}

/**
 * @zh
 * GFX绑定单元。
 */
export class GFXBindingUnit {
    public binding: number = 0;
    public type: GFXBindingType = GFXBindingType.UNKNOWN;
    public name: string = '';
    public buffer: GFXBuffer | null = null;
    public texView: GFXTextureView | null = null;
    public sampler: GFXSampler | null = null;
}

/**
 * @zh
 * GFX绑定布局。
 */
export abstract class GFXBindingLayout extends GFXObject {

    /**
     * @zh
     * GFX设备。
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * 绑定单元数组。
     */
    protected _bindingUnits: GFXBindingUnit[] = [];

    /**
     * @zh
     * 脏数据标识。
     */
    protected _isDirty = false;

    /**
     * 构造函数。
     * @param device GFX设备。
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.BINDING_LAYOUT);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数。
     * @param info GFX绑定布局描述信息。
     */
    public abstract initialize (info: IGFXBindingLayoutInfo): boolean;

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy ();

    /**
     * @zh
     * 更新。
     */
    public abstract update ();

    /**
     * @zh
     * 在指定的binding位置上绑定缓冲。
     * @param binding 绑定GFX组件的插槽。
     * @param buffer GFX缓冲。
     */
    public bindBuffer (binding: number, buffer: GFXBuffer) {
        for (const bindingUnit of this._bindingUnits) {
            if (bindingUnit.binding === binding) {
                if (bindingUnit.type === GFXBindingType.UNIFORM_BUFFER) {
                    if (bindingUnit.buffer !== buffer) {
                        bindingUnit.buffer = buffer;
                        this._isDirty = true;
                    }
                } else {
                    console.error('Setting binding is not GFXBindingType.UNIFORM_BUFFER.');
                }
                return;
            }
        }
    }

    /**
     * @zh
     * 在指定的binding位置上绑定采样器。
     * @param binding 绑定GFX组件的插槽。
     * @param sampler GFX采样器。
     */
    public bindSampler (binding: number, sampler: GFXSampler) {
        for (const bindingUnit of this._bindingUnits) {
            if (bindingUnit.binding === binding) {
                if (bindingUnit.type === GFXBindingType.SAMPLER) {
                    if (bindingUnit.sampler !== sampler) {
                        bindingUnit.sampler = sampler;
                        this._isDirty = true;
                    }
                } else {
                    console.error('Setting binding is not GFXBindingType.SAMPLER.');
                }
                return;
            }
        }
    }

    /**
     * @zh
     * 在指定的binding位置上绑定纹理视图。
     * @param binding 绑定GFX组件的插槽。
     * @param texView GFX纹理视图。
     */
    public bindTextureView (binding: number, texView: GFXTextureView) {
        for (const bindingUnit of this._bindingUnits) {
            if (bindingUnit.binding === binding) {
                if (bindingUnit.type === GFXBindingType.SAMPLER) {
                    if (bindingUnit.texView !== texView) {
                        bindingUnit.texView = texView;
                        this._isDirty = true;
                    }
                } else {
                    console.error('Setting binding is not GFXBindingType.SAMPLER.');
                }
                return;
            }
        }
    }

    /**
     * @zh
     * 得到指定的binding位置上的GFX绑定单元。
     * @param binding 绑定GFX组件的插槽。
     */
    public getBindingUnit (binding: number): GFXBindingUnit | null {
        for (const unit of this._bindingUnits) {
            if (unit.binding === binding) {
                return unit;
            }
        }
        return null;
    }
}
