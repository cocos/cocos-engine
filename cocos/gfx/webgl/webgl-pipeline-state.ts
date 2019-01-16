import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXPipelineState, IGFXPipelineStateInfo } from '../pipeline-state';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUPipelineState } from './webgl-gpu-objects';

export class WebGLGFXPipelineState extends GFXPipelineState {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

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
        this._layout = info.layout;
        this._renderPass = info.renderPass;

        this._gpuPipelineState = this.webGLDevice.emitCmdCreateGPUPipelineState(info);
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuPipelineState) {
            this.webGLDevice.emitCmdDestroyGPUPipelineState(this._gpuPipelineState);
            this._gpuPipelineState = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
