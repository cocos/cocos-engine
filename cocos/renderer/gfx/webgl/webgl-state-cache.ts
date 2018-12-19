import { GFX_MAX_TEXTURE_UNITS } from "../gfx-define";

export class WebGLStateCache {
    glArrayBuffer : WebGLBuffer | null = null;
    glElementArrayBuffer : WebGLBuffer | null = null;
    texUnit : number = 0; 
    glTex2DUnits : (WebGLTexture | null)[];
    glTexCubeUnits : (WebGLTexture | null)[];
    glFramebuffer : WebGLFramebuffer | null = null;

    constructor() {
        this.glTex2DUnits = new Array<WebGLTexture | null>(GFX_MAX_TEXTURE_UNITS);
        this.glTexCubeUnits = new Array<WebGLTexture | null>(GFX_MAX_TEXTURE_UNITS);

        for(let i = 0; i < GFX_MAX_TEXTURE_UNITS; ++i) {
            this.glTex2DUnits[i] = null;
            this.glTexCubeUnits[i] = null;
        }
    }
};
