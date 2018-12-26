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

export class GFXUniform {
    name : string = "";
    type : GFXType = GFXType.UNKNOWN;
    count : number = 1;
};

export class GFXUniformBlock {
    binding : number = -1;
    name : string = "";
    //instance : string = "";
    uniforms : GFXUniform[] = [];
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

    // blocks are used for being compatible with single uniforms
    blocks : GFXUniformBlock[] = [];
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
    protected _blocks : GFXUniformBlock[] = [];
};
