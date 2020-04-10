/**
 * @category gfx
 */

import { GFXBindingLayout } from './binding-layout';
import { GFXObject, GFXObjectType, GFXShaderType, GFXStatus } from './define';
import { GFXDevice } from './device';

export interface IGFXPushConstantRange {
    shaderType: GFXShaderType;
    offset: number;
    count: number;
}

export interface IGFXPipelineLayoutInfo {
    pushConstantsRanges?: IGFXPushConstantRange[];
    layouts: GFXBindingLayout[];
}

export abstract class GFXPipelineLayout extends GFXObject {

    /**
     * @en Get current binding layouts.
     * @zh GFX 绑定布局数组。
     */
    public get layouts (): GFXBindingLayout[] {
        return this._layouts;
    }

    protected _device: GFXDevice;

    protected _pushConstantsRanges: IGFXPushConstantRange[] = [];

    protected _layouts: GFXBindingLayout[] = [];

    constructor (device: GFXDevice) {
        super(GFXObjectType.PIPELINE_LAYOUT);
        this._device = device;
    }

    public initialize (info: IGFXPipelineLayoutInfo) {

        this._layouts = info.layouts;
        this._pushConstantsRanges = info.pushConstantsRanges || [];

        if (this._initialize(info)) { this._status = GFXStatus.SUCCESS; return true; }
        else { this._status = GFXStatus.FAILED; return false; }
    }

    public destroy () {
        if (this._status !== GFXStatus.SUCCESS) { return; }
        this._destroy();
        this._status = GFXStatus.UNREADY;
    }

    protected abstract _initialize (info: IGFXPipelineLayoutInfo): boolean;

    protected abstract _destroy (): void;
}
