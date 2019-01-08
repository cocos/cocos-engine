import { GFX_MAX_TEXTURE_UNITS, GFX_MAX_VERTEX_ATTRIBUTES, GFXViewport, GFXRect } from "../define";
import { GFXRasterizerState, GFXDepthStencilState, GFXBlendState } from "../pipeline-state";

export interface WebGLTexUnit
{
    glTexture : WebGLTexture;
	minFilter : GLenum;
	magFilter : GLenum;
	wrapS : GLenum;
	wrapT : GLenum;
	wrapR : GLenum;
	baseLevel : number;
	maxLevel : number;
};

export class WebGLStateCache {
    glArrayBuffer : WebGLBuffer = 0;
    glElementArrayBuffer : WebGLBuffer = 0;
    texUnit : number = 0;
    glTex2DUnits : WebGLTexUnit[];
    glTexCubeUnits : WebGLTexUnit[];
    glFramebuffer : WebGLFramebuffer = 0;
    viewport : GFXViewport;
    scissorRect : GFXRect;
    rs : GFXRasterizerState;
    dss : GFXDepthStencilState;
    bs : GFXBlendState;
    glProgram : WebGLProgram = 0;
    glEnabledAttribLocs : boolean[];
    glCurrentAttribLocs : boolean[];

    constructor() {
        this.glTex2DUnits = new Array<WebGLTexUnit>(GFX_MAX_TEXTURE_UNITS);
        this.glTexCubeUnits = new Array<WebGLTexUnit>(GFX_MAX_TEXTURE_UNITS);
        this.viewport = { left: 0.0, top: 0.0, width: 0.0, height: 0.0, minDepth: 0.0, maxDepth: 0.0};
        this.scissorRect = { x: 0.0, y: 0.0, width: 0.0, height: 0.0};
        this.rs = new GFXRasterizerState;
        this.dss = new GFXDepthStencilState;
        this.bs = new GFXBlendState;
        this.glEnabledAttribLocs = new Array<boolean>(GFX_MAX_VERTEX_ATTRIBUTES);
        this.glCurrentAttribLocs = new Array<boolean>(GFX_MAX_VERTEX_ATTRIBUTES);

        for(let i = 0; i < GFX_MAX_TEXTURE_UNITS; ++i) {
            this.glTex2DUnits[i] = {
                glTexture : 0,
                minFilter : WebGLRenderingContext.NONE,
                magFilter : WebGLRenderingContext.NONE,
                wrapS : WebGLRenderingContext.NONE,
                wrapT : WebGLRenderingContext.NONE,
                wrapR : WebGLRenderingContext.NONE,
                baseLevel : 0,
                maxLevel : 1000,
            }
        }

        for(let i = 0; i < GFX_MAX_VERTEX_ATTRIBUTES; ++i) {
            this.glEnabledAttribLocs[i] = false;
            this.glCurrentAttribLocs[i] = false;
        }
    }
};
