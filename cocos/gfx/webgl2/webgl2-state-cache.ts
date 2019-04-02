import { GFX_MAX_BUFFER_BINDINGS, GFX_MAX_TEXTURE_UNITS, GFX_MAX_VERTEX_ATTRIBUTES, IGFXRect, IGFXViewport } from '../define';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../pipeline-state';

export interface IWebGL2TexUnit {
    glTexture: WebGLTexture | null;
}

export class WebGL2StateCache {
    public glArrayBuffer: WebGLBuffer = 0;
    public glElementArrayBuffer: WebGLBuffer = 0;
    public glUniformBuffer: WebGLBuffer = 0;
    public glBindUBOs: WebGLBuffer[];
    public glVAO: WebGLVertexArrayObject = 0;
    public texUnit: number = 0;
    public glTex2DUnits: IWebGL2TexUnit[];
    public glTexCubeUnits: IWebGL2TexUnit[];
    public glSamplerUnits: WebGLSampler[];
    public glRenderbuffer: WebGLRenderbuffer = 0;
    public glFramebuffer: WebGLFramebuffer = 0;
    public glReadFramebuffer: WebGLFramebuffer = 0;
    public viewport: IGFXViewport;
    public scissorRect: IGFXRect;
    public rs: GFXRasterizerState;
    public dss: GFXDepthStencilState;
    public bs: GFXBlendState;
    public glProgram: WebGLProgram = 0;
    public glEnabledAttribLocs: boolean[];
    public glCurrentAttribLocs: boolean[];

    constructor () {
        this.glBindUBOs = new Array<WebGLBuffer>(GFX_MAX_BUFFER_BINDINGS);
        this.glBindUBOs.fill(0);

        this.glTex2DUnits = new Array<IWebGL2TexUnit>(GFX_MAX_TEXTURE_UNITS);
        this.glTexCubeUnits = new Array<IWebGL2TexUnit>(GFX_MAX_TEXTURE_UNITS);
        this.glSamplerUnits = new Array<WebGLSampler>(GFX_MAX_TEXTURE_UNITS);
        this.viewport = { left: 0.0, top: 0.0, width: 0.0, height: 0.0, minDepth: 0.0, maxDepth: 0.0 };
        this.scissorRect = { x: 0.0, y: 0.0, width: 0.0, height: 0.0 };
        this.rs = new GFXRasterizerState();
        this.dss = new GFXDepthStencilState();
        this.bs = new GFXBlendState();
        this.glEnabledAttribLocs = new Array<boolean>(GFX_MAX_VERTEX_ATTRIBUTES);
        this.glCurrentAttribLocs = new Array<boolean>(GFX_MAX_VERTEX_ATTRIBUTES);

        for (let i = 0; i < GFX_MAX_TEXTURE_UNITS; ++i) {
            this.glTex2DUnits[i] = {
                glTexture: null,
            };
            this.glTexCubeUnits[i] = {
                glTexture: null,
            };
            this.glSamplerUnits[i] = 0;
        }

        for (let i = 0; i < GFX_MAX_VERTEX_ATTRIBUTES; ++i) {
            this.glEnabledAttribLocs[i] = false;
            this.glCurrentAttribLocs[i] = false;
        }
    }
}
