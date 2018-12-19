import { GFXDevice } from './gfx-device';
import { GFXRenderPass } from './gfx-render-pass';
import { GFXBindingSetLayout } from './gfx-binding-set-layout';
import { GFXShaderType } from './gfx-shader';

export class GFXPushConstantRange {
    shaderType : GFXShaderType = GFXShaderType.VERTEX;
    offset : number = 0;
    count : number = 0;
};

export class GFXPipelineLayoutInfo {
    pushConstantsRanges : GFXPushConstantRange[] = [];
    layouts : GFXBindingSetLayout[] = [];
};

export abstract class GFXPipelineLayout {  

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info : GFXPipelineLayoutInfo) : boolean;
    public abstract destroy() : void;

    protected _device : GFXDevice;
    protected _renderPass: GFXRenderPass | null = null;
};
