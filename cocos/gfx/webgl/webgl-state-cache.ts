import { GFX_MAX_TEXTURE_UNITS, GFX_MAX_VERTEX_ATTRIBUTES, IGFXRect, IGFXViewport } from '../define';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../pipeline-state';

export interface IWebGLTexUnit {
    glTexture: WebGLTexture | null;
}

export class WebGLStateCache {
    public glArrayBuffer: WebGLBuffer | null = null;
    public glElementArrayBuffer: WebGLBuffer | null = null;
    public glVAO: WebGLVertexArrayObjectOES | null = null;
    public texUnit: number = 0;
    public glTex2DUnits: IWebGLTexUnit[];
    public glTexCubeUnits: IWebGLTexUnit[];
    public glRenderbuffer: WebGLRenderbuffer | null = null;
    public glFramebuffer: WebGLFramebuffer | null = null;
    public viewport: IGFXViewport;
    public scissorRect: IGFXRect;
    public rs: GFXRasterizerState;
    public dss: GFXDepthStencilState;
    public bs: GFXBlendState;
    public glProgram: WebGLProgram | null = null;
    public glEnabledAttribLocs: boolean[];
    public glCurrentAttribLocs: boolean[];

    constructor () {
        this.glTex2DUnits = new Array<IWebGLTexUnit>(GFX_MAX_TEXTURE_UNITS);
        this.glTexCubeUnits = new Array<IWebGLTexUnit>(GFX_MAX_TEXTURE_UNITS);
        this.viewport = { left: 0.0, top: 0.0, width: 0.0, height: 0.0, minDepth: 0.0, maxDepth: 0.0 };
        this.scissorRect = { x: 0.0, y: 0.0, width: 0.0, height: 0.0 };
        this.rs = new GFXRasterizerState();
        this.dss = new GFXDepthStencilState();
        this.bs = new GFXBlendState();
        this.glEnabledAttribLocs = new Array<boolean>(GFX_MAX_VERTEX_ATTRIBUTES);
        this.glCurrentAttribLocs = new Array<boolean>(GFX_MAX_VERTEX_ATTRIBUTES);
        this.glEnabledAttribLocs.fill(false);
        this.glCurrentAttribLocs.fill(false);

        for (let i = 0; i < GFX_MAX_TEXTURE_UNITS; ++i) {
            this.glTex2DUnits[i] = {
                glTexture: null,
            };
            this.glTexCubeUnits[i] = {
                glTexture: null,
            };
        }
    }
}
