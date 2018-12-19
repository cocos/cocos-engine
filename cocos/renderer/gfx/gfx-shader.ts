import { GFXDevice } from './gfx-device';
import { GFXBinding } from './gfx-binding-set-layout';
import { GFXType } from './gfx-define';

export const enum GFXShaderType {
    VERTEX,
    HULL,
    DOMAIN,
    GEOMETRY,
    FRAGMENT,
    COMPUTE,
    COUNT,
};

export class GFXShaderMacro {
    macro : string = "";
    value : string = "";

    constructor(macro : string, value : string = "") {
        this.macro = macro;
        this.value = value;
    }
};

export class GFXShaderVar {
    binding : number = -1;
    name : string = "";
    type : GFXType = GFXType.UNKNOWN;
    stride : number = 0;
    count : number = 0;
    size : number = 0;
    offset : number = 0;
};

export class GFXShaderBlock {
    binding : number = -1;
    name : string = "";
    size : number = 0;
    uniforms : GFXShaderVar[] = [];
};

export class GFXShaderSampler {
    binding : number = -1;
    name : string = "";
    type : GFXType = GFXType.UNKNOWN;
    units : number[] = [];
};

export class GFXShaderStage {
    type : GFXShaderType = GFXShaderType.VERTEX;
    source : string = "";
    macros : GFXShaderMacro[] = [];

    public define(macro : string, value : string = "") : void {
        this.macros.push({ macro, value });
    }
};

export class GFXShaderInfo {
    name : string = "";
    stages : GFXShaderStage[] = [];
    bindings : GFXBinding[] = [];
};

export abstract class GFXShader {

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info : GFXShaderInfo) : boolean;
    public abstract destroy() : void;

    protected _device : GFXDevice;
    protected _name : string = "";
    protected _stages : GFXShaderStage[] = [];
    protected _bindings : GFXBinding[] = [];    

    protected _inputs : GFXShaderVar[] = [];
    protected _uniforms : GFXShaderVar[] = [];
    protected _blocks : GFXShaderBlock[] = [];
    protected _samplers : GFXShaderSampler[] = [];
};
