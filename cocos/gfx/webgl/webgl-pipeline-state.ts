import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXPipelineState, IGFXPipelineStateInfo } from '../pipeline-state';
import { WebGLGPUPipelineState } from './webgl-gpu-objects';
import { WebGLGFXPipelineLayout } from './webgl-pipeline-layout';
import { WebGLGFXRenderPass } from './webgl-render-pass';
import { WebGLGFXShader } from './webgl-shader';

const WebGLPrimitives: GLenum[] = [
    WebGLRenderingContext.POINTS,
    WebGLRenderingContext.LINES,
    WebGLRenderingContext.LINE_STRIP,
    WebGLRenderingContext.LINE_LOOP,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.TRIANGLES,
    WebGLRenderingContext.TRIANGLE_STRIP,
    WebGLRenderingContext.TRIANGLE_FAN,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.NONE,
];

export class WebGLGFXPipelineState extends GFXPipelineState {

    public get gpuPipelineState (): WebGLGPUPipelineState {
        return  this._gpuPipelineState!;
    }

    private _gpuPipelineState: WebGLGPUPipelineState | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXPipelineStateInfo): boolean {

        this._primitive = info.primitive;
        this._shader = info.shader;
        this._is = info.is;
        this._rs = info.rs;
        this._dss = info.dss;
        this._bs = info.bs;
        this._dynamicStates = info.dynamicStates || [];

        this._layout = info.layout;
        this._renderPass = info.renderPass;

        this._gpuPipelineState = {
            glPrimitive: WebGLPrimitives[info.primitive],
            gpuShader: (info.shader as WebGLGFXShader).gpuShader,
            rs: info.rs,
            dss: info.dss,
            bs: info.bs,
            dynamicStates: (info.dynamicStates !== undefined ? info.dynamicStates : []),
            gpuLayout: (info.layout as WebGLGFXPipelineLayout).gpuPipelineLayout,
            gpuRenderPass: (info.renderPass as WebGLGFXRenderPass).gpuRenderPass,
        };

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._gpuPipelineState = null;
        this._status = GFXStatus.UNREADY;
    }
}
