import { GFXBindingLayout } from './binding-layout';
import { GFXObject, GFXObjectType, GFXShaderType } from './define';
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

    protected _device: GFXDevice;
    protected _pushConstantsRanges: IGFXPushConstantRange[] = [];
    protected _layouts: GFXBindingLayout[] = [];

    constructor (device: GFXDevice) {
        super(GFXObjectType.PIPELINE_LAYOUT);
        this._device = device;
    }

    public abstract initialize (info: IGFXPipelineLayoutInfo): boolean;
    public abstract destroy ();
}
