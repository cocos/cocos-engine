import { GFXPipelineState, IGFXPipelineStateInfo } from '../pipeline-state';
import { WebGLGPUPipelineState } from './webgl-gpu-objects';
import { WebGLGFXPipelineLayout } from './webgl-pipeline-layout';
import { WebGLGFXRenderPass } from './webgl-render-pass';
import { WebGLGFXShader } from './webgl-shader';

const WebGLPrimitives: GLenum[] = [
    0x0000, // WebGLRenderingContext.POINTS,
    0x0001, // WebGLRenderingContext.LINES,
    0x0003, // WebGLRenderingContext.LINE_STRIP,
    0x0002, // WebGLRenderingContext.LINE_LOOP,
    0x0000, // WebGLRenderingContext.NONE,
    0x0000, // WebGLRenderingContext.NONE,
    0x0000, // WebGLRenderingContext.NONE,
    0x0004, // WebGLRenderingContext.TRIANGLES,
    0x0005, // WebGLRenderingContext.TRIANGLE_STRIP,
    0x0006, // WebGLRenderingContext.TRIANGLE_FAN,
    0x0000, // WebGLRenderingContext.NONE,
    0x0000, // WebGLRenderingContext.NONE,
    0x0000, // WebGLRenderingContext.NONE,
    0x0000, // WebGLRenderingContext.NONE,
];

export class WebGLGFXPipelineState extends GFXPipelineState {

    public get gpuPipelineState (): WebGLGPUPipelineState {
        return  this._gpuPipelineState!;
    }

    private _gpuPipelineState: WebGLGPUPipelineState | null = null;

    protected _initialize (info: IGFXPipelineStateInfo): boolean {

        this._gpuPipelineState = {
            glPrimitive: WebGLPrimitives[info.primitive],
            gpuShader: (info.shader as WebGLGFXShader).gpuShader,
            rs: info.rasterizerState,
            dss: info.depthStencilState,
            bs: info.blendState,
            dynamicStates: (info.dynamicStates !== undefined ? info.dynamicStates : []),
            gpuLayout: (info.layout as WebGLGFXPipelineLayout).gpuPipelineLayout,
            gpuRenderPass: (info.renderPass as WebGLGFXRenderPass).gpuRenderPass,
        };

        return true;
    }

    protected _destroy () {
        this._gpuPipelineState = null;
    }
}
