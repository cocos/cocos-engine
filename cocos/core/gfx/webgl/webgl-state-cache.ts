import { GFXRect, GFXViewport } from '../define-class';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../pipeline-state';

export interface IWebGLTexUnit {
    glTexture: WebGLTexture | null;
}

export class WebGLStateCache {
    public glArrayBuffer: WebGLBuffer | null = null;
    public glElementArrayBuffer: WebGLBuffer | null = null;
    public glVAO: WebGLVertexArrayObjectOES | null = null;
    public texUnit: number = 0;
    public glTexUnits: IWebGLTexUnit[] = [];
    public glRenderbuffer: WebGLRenderbuffer | null = null;
    public glFramebuffer: WebGLFramebuffer | null = null;
    public viewport = new GFXViewport();
    public scissorRect = new GFXRect(0, 0, 0, 0);
    public rs = new GFXRasterizerState();
    public dss = new GFXDepthStencilState();
    public bs = new GFXBlendState();
    public glProgram: WebGLProgram | null = null;
    public glEnabledAttribLocs: boolean[] = [];
    public glCurrentAttribLocs: boolean[] = [];
    public texUnitCacheMap: Record<string, number> = {};

    initialize (texUnit: number, vertexAttributes: number) {
        for (let i = 0; i < texUnit; ++i) this.glTexUnits.push({ glTexture: null });

        this.glEnabledAttribLocs.length = vertexAttributes;
        this.glEnabledAttribLocs.fill(false);

        this.glCurrentAttribLocs.length = vertexAttributes;
        this.glCurrentAttribLocs.fill(false);
    }
}
