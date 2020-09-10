import { GFXRect, GFXViewport } from '../define';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../pipeline-state';

export interface IWebGL2TexUnit {
    glTexture: WebGLTexture | null;
}

export class WebGL2StateCache {
    public glArrayBuffer: WebGLBuffer | null = null;
    public glElementArrayBuffer: WebGLBuffer | null = null;
    public glUniformBuffer: WebGLBuffer | null = null;
    public glBindUBOs: (WebGLBuffer | null)[] = [];
    public glBindUBOOffsets: number[] = [];
    public glVAO: WebGLVertexArrayObject | null = null;
    public texUnit: number = 0;
    public glTexUnits: IWebGL2TexUnit[] = [];
    public glSamplerUnits: (WebGLSampler | null)[] = [];
    public glRenderbuffer: WebGLRenderbuffer | null = null;
    public glFramebuffer: WebGLFramebuffer | null = null;
    public glReadFramebuffer: WebGLFramebuffer | null = null;
    public viewport = new GFXViewport();
    public scissorRect = new GFXRect(0, 0, 0, 0);
    public rs = new GFXRasterizerState();
    public dss = new GFXDepthStencilState();
    public bs = new GFXBlendState();
    public glProgram: WebGLProgram | null = null;
    public glEnabledAttribLocs: boolean[] = [];
    public glCurrentAttribLocs: boolean[] = [];
    public texUnitCacheMap: Record<string, number> = {};

    initialize (texUnit: number, bufferBindings: number, vertexAttributes: number) {
        for (let i = 0; i < texUnit; ++i) this.glTexUnits.push({ glTexture: null });

        this.glSamplerUnits.length = texUnit;
        this.glSamplerUnits.fill(null);

        this.glBindUBOs.length = bufferBindings;
        this.glBindUBOs.fill(null);

        this.glBindUBOOffsets.length = bufferBindings;
        this.glBindUBOOffsets.fill(0);

        this.glEnabledAttribLocs.length = vertexAttributes;
        this.glEnabledAttribLocs.fill(false);

        this.glCurrentAttribLocs.length = vertexAttributes;
        this.glCurrentAttribLocs.fill(false);
    }
}
