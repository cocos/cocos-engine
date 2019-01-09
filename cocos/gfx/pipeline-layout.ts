import { GFXBindingLayout } from './binding-layout';
import { GFXShaderType } from './define';
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

export abstract class GFXPipelineLayout {

    protected _device: GFXDevice;
    protected _pushConstantsRanges: IGFXPushConstantRange[] = [];
    protected _layouts: GFXBindingLayout[] = [];

    constructor (device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize (info: IGFXPipelineLayoutInfo): boolean;
    public abstract destroy ();
}
