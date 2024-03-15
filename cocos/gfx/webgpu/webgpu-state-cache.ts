import { Rect, Viewport } from '../base/define';
import { BlendState, DepthStencilState, RasterizerState } from '../base/pipeline-state';

export interface IWebGPUTexUnit {
    glTexture: WebGLTexture | null;
}

export class WebGPUStateCache {
    public glArrayBuffer: WebGLBuffer | null = null;
    public glElementArrayBuffer: WebGLBuffer | null = null;
    public glUniformBuffer: WebGLBuffer | null = null;
    public glBindUBOs: (WebGLBuffer | null)[] = [];
    public glBindUBOOffsets: number[] = [];
    public glVAO: WebGLVertexArrayObject | null = null;
    public texUnit: number = 0;
    public glTexUnits: IWebGPUTexUnit[] = [];
    public glSamplerUnits: (WebGLSampler | null)[] = [];
    public glRenderbuffer: WebGLRenderbuffer | null = null;
    public glFramebuffer: WebGLFramebuffer | null = null;
    public glReadFramebuffer: WebGLFramebuffer | null = null;
    public viewport = new Viewport();
    public scissorRect = new Rect(0, 0, 0, 0);
    public rs = new RasterizerState();
    public dss = new DepthStencilState();
    public bs = new BlendState();
    public glProgram: WebGLProgram | null = null;
    public glEnabledAttribLocs: boolean[] = [];
    public glCurrentAttribLocs: boolean[] = [];
    public texUnitCacheMap: Record<string, number> = {};

    initialize(texUnit: number, bufferBindings: number, vertexAttributes: number) {
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
