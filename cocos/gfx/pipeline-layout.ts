import { GFXDevice } from './device';
import { GFXBindingLayout } from './binding-layout';
import { GFXShaderType } from './define';

export interface GFXPushConstantRange {
    shaderType : GFXShaderType;
    offset : number;
    count : number;
};

export interface GFXPipelineLayoutInfo {
    pushConstantsRanges? : GFXPushConstantRange[];
    layouts : GFXBindingLayout[];
};

export abstract class GFXPipelineLayout {

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info : GFXPipelineLayoutInfo) : boolean;
    public abstract destroy() : void;

    protected _device : GFXDevice;
    protected _pushConstantsRanges : GFXPushConstantRange[] = [];
    protected _layouts: GFXBindingLayout[] = [];
};
