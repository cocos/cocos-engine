import { GFXPipelineState, IGFXPipelineStateInfo } from '../pipeline-state';
import { IWebGLGPUPipelineState } from './webgl-gpu-objects';
import { WebGLRenderPass } from './webgl-render-pass';
import { WebGLShader } from './webgl-shader';
import { GFXStatus, GFXDynamicStateFlagBit } from '../define';

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

export class WebGLPipelineState extends GFXPipelineState {

    get gpuPipelineState (): IWebGLGPUPipelineState {
        return  this._gpuPipelineState!;
    }

    private _gpuPipelineState: IWebGLGPUPipelineState | null = null;

    public initialize (info: IGFXPipelineStateInfo): boolean {

        this._primitive = info.primitive;
        this._shader = info.shader;
        this._rs = info.rasterizerState;
        this._dss = info.depthStencilState;
        this._bs = info.blendState;
        this._is = info.inputState;
        this._renderPass = info.renderPass;

        const dynamicStates: GFXDynamicStateFlagBit[] = [];
        for (let i = 0; i < 31; i++) {
            if (this._dynamicStates & (1 << i)) {
                dynamicStates.push(1 << i);
            }
        }

        this._gpuPipelineState = {
            glPrimitive: WebGLPrimitives[info.primitive],
            gpuShader: (info.shader as WebGLShader).gpuShader,
            rs: info.rasterizerState,
            dss: info.depthStencilState,
            bs: info.blendState,
            gpuRenderPass: (info.renderPass as WebGLRenderPass).gpuRenderPass,
            dynamicStates,
        };

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._gpuPipelineState = null;
        this._status = GFXStatus.UNREADY;
    }
}
