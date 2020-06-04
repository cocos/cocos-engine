import { GFXPipelineState, IGFXPipelineStateInfo } from '../pipeline-state';
import { WebGL2GPUPipelineState } from './webgl2-gpu-objects';
import { WebGL2GFXPipelineLayout } from './webgl2-pipeline-layout';
import { WebGL2GFXRenderPass } from './webgl2-render-pass';
import { WebGL2GFXShader } from './webgl2-shader';
import { GFXStatus } from '../define';

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

export class WebGL2GFXPipelineState extends GFXPipelineState {

    get gpuPipelineState (): WebGL2GPUPipelineState {
        return  this._gpuPipelineState!;
    }

    private _gpuPipelineState: WebGL2GPUPipelineState | null = null;

    public initialize (info: IGFXPipelineStateInfo): boolean {

        this._primitive = info.primitive;
        this._shader = info.shader;
        this._rs = info.rasterizerState;
        this._dss = info.depthStencilState;
        this._bs = info.blendState;
        this._dynamicStates = info.dynamicStates || [];
        this._hash = info.hash;

        this._layout = info.layout;
        this._renderPass = info.renderPass;

        this._gpuPipelineState = {
            glPrimitive: WebGLPrimitives[info.primitive],
            gpuShader: (info.shader as WebGL2GFXShader).gpuShader,
            rs: info.rasterizerState,
            dss: info.depthStencilState,
            bs: info.blendState,
            dynamicStates: (info.dynamicStates !== undefined ? info.dynamicStates : []),
            gpuLayout: (info.layout as WebGL2GFXPipelineLayout).gpuPipelineLayout,
            gpuRenderPass: (info.renderPass as WebGL2GFXRenderPass).gpuRenderPass,
        };

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._gpuPipelineState = null;
        this._status = GFXStatus.UNREADY;
    }
}
