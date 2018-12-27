import { GFX_MAX_TEXTURE_UNITS, GFX_MAX_VERTEX_ATTRIBUTES } from "../gfx-define";
import { GFXRasterizerState, GFXDepthStencilState, GFXBlendState } from "../gfx-pipeline-state";

export class WebGLTexUnit
{
    glTexture : WebGLTexture = 0;
	minFilter : GLenum = WebGLRenderingContext.NONE;
	magFilter : GLenum = WebGLRenderingContext.NONE;
	wrapS : GLenum = WebGLRenderingContext.NONE;
	wrapT : GLenum = WebGLRenderingContext.NONE;
	wrapR : GLenum = WebGLRenderingContext.NONE;
	baseLevel : number = 0;
	maxLevel : number = 1000;
};

export class WebGLStateCache {
    glArrayBuffer : WebGLBuffer = 0;
    glElementArrayBuffer : WebGLBuffer = 0;
    texUnit : number = 0; 
    glTex2DUnits : WebGLTexUnit[];
    glTexCubeUnits : WebGLTexUnit[];
    glFramebuffer : WebGLFramebuffer = 0;
    viewport : number[] = [0.0, 0.0, 0.0, 0.0];
    scissorRect : number[] = [0.0, 0.0, 0.0, 0.0];
    rs : GFXRasterizerState;
    dss : GFXDepthStencilState;
    bs : GFXBlendState;
    glProgram : WebGLProgram = -1;
    glEnabledAttribLocs : boolean[];
    glCurrentAttribLocs : boolean[];

    constructor() {
        this.glTex2DUnits = new Array<WebGLTexUnit>(GFX_MAX_TEXTURE_UNITS);
        this.glTexCubeUnits = new Array<WebGLTexUnit>(GFX_MAX_TEXTURE_UNITS);
        this.rs = new GFXRasterizerState;
        this.dss = new GFXDepthStencilState;
        this.bs = new GFXBlendState;
        this.glEnabledAttribLocs = new Array<boolean>(GFX_MAX_VERTEX_ATTRIBUTES);
        this.glCurrentAttribLocs = new Array<boolean>(GFX_MAX_VERTEX_ATTRIBUTES);

        for(let i = 0; i < GFX_MAX_VERTEX_ATTRIBUTES; ++i) {
            this.glEnabledAttribLocs[i] = false;
            this.glCurrentAttribLocs[i] = false;
        }
    }
};
