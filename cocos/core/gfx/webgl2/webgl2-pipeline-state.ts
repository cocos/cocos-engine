import { GFXPipelineState, IGFXPipelineStateInfo } from '../pipeline-state';
import { IWebGL2GPUPipelineState } from './webgl2-gpu-objects';
import { WebGL2RenderPass } from './webgl2-render-pass';
import { WebGL2Shader } from './webgl2-shader';
import { GFXDynamicStateFlagBit } from '../define';
import { WebGL2PipelineLayout } from './webgl2-pipeline-layout';

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

export class WebGL2PipelineState extends GFXPipelineState {

    get gpuPipelineState (): IWebGL2GPUPipelineState {
        return  this._gpuPipelineState!;
    }

    private _gpuPipelineState: IWebGL2GPUPipelineState | null = null;

    public initialize (info: IGFXPipelineStateInfo): boolean {

        this._primitive = info.primitive;
        this._shader = info.shader;
        this._pipelineLayout = info.pipelineLayout;
        this._rs = info.rasterizerState;
        this._dss = info.depthStencilState;
        this._bs = info.blendState;
        this._is = info.inputState;
        this._renderPass = info.renderPass;

        if (info.dynamicStates !== undefined) {
            this._dynamicStates = info.dynamicStates;
        }

        const dynamicStates: GFXDynamicStateFlagBit[] = [];
        for (let i = 0; i < 31; i++) {
            if (this._dynamicStates & (1 << i)) {
                dynamicStates.push(1 << i);
            }
        }

        this._gpuPipelineState = {
            glPrimitive: WebGLPrimitives[info.primitive],
            gpuShader: (info.shader as WebGL2Shader).gpuShader,
            gpuPipelineLayout: (info.pipelineLayout as WebGL2PipelineLayout).gpuPipelineLayout,
            rs: info.rasterizerState,
            dss: info.depthStencilState,
            bs: info.blendState,
            gpuRenderPass: (info.renderPass as WebGL2RenderPass).gpuRenderPass,
            dynamicStates,
        };

        return true;
    }

    public destroy () {
        this._gpuPipelineState = null;
    }
}
