import { GFXDevice } from './device';
import { GFXBindingLayout } from './binding-layout';
import { GFXShaderType } from './shader';

export class GFXPushConstantRange {
    shaderType : GFXShaderType = GFXShaderType.VERTEX;
    offset : number = 0;
    count : number = 0;
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
