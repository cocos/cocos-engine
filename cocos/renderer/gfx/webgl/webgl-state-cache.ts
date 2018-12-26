import { GFX_MAX_TEXTURE_UNITS, GFX_MAX_VERTEX_ATTRIBUTES } from "../gfx-define";
import { GFXRasterizerState, GFXDepthStencilState, GFXBlendState } from "../gfx-pipeline-state";

export class WebGLStateCache {
    glArrayBuffer : WebGLBuffer | null = null;
    glElementArrayBuffer : WebGLBuffer | null = null;
    texUnit : number = 0; 
    glTex2DUnits : (WebGLTexture | null)[];
    glTexCubeUnits : (WebGLTexture | null)[];
    glFramebuffer : WebGLFramebuffer | null = null;
    viewport : number[] = [0.0, 0.0, 0.0, 0.0];
    scissorRect : number[] = [0.0, 0.0, 0.0, 0.0];
    rs : GFXRasterizerState;
    dss : GFXDepthStencilState;
    bs : GFXBlendState;
    glProgram : WebGLProgram | null = null;
    glEnabledAttribLocs : boolean[];
    glCurrentAttribLocs : boolean[];

    constructor() {
        this.glTex2DUnits = new Array<WebGLTexture | null>(GFX_MAX_TEXTURE_UNITS);
        this.glTexCubeUnits = new Array<WebGLTexture | null>(GFX_MAX_TEXTURE_UNITS);
        this.rs = new GFXRasterizerState;
        this.dss = new GFXDepthStencilState;
        this.bs = new GFXBlendState;
        this.glEnabledAttribLocs = new Array<boolean>(GFX_MAX_VERTEX_ATTRIBUTES);
        this.glCurrentAttribLocs = new Array<boolean>(GFX_MAX_VERTEX_ATTRIBUTES);

        for(let i = 0; i < GFX_MAX_TEXTURE_UNITS; ++i) {
            this.glTex2DUnits[i] = null;
            this.glTexCubeUnits[i] = null;
        }

        for(let i = 0; i < GFX_MAX_VERTEX_ATTRIBUTES; ++i) {
            this.glEnabledAttribLocs[i] = false;
            this.glCurrentAttribLocs[i] = false;
        }
    }
};
