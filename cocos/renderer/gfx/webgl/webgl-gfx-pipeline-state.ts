import { GFXDevice } from '../gfx-device';
import { GFXPipelineState, GFXPipelineStateInfo } from '../gfx-pipeline-state';
import { WebGLGFXDevice } from './webgl-gfx-device';
import { WebGLGPUPipelineState } from './webgl-gpu-objects';

export class WebGLGFXPipelineState extends GFXPipelineState {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXPipelineStateInfo) : boolean {

        this._primitive = info.primitive;
        this._shader = info.shader;
        this._is = info.is;
        this._rs = info.rs;
        this._dss = info.dss;
        this._bs = info.bs;
        this._layout = info.layout;
        this._renderPass = info.renderPass;

        this._gpuPipelineState = this.webGLDevice.emitCmdCreateGPUPipelineState(info);

        return true;
    }

    public destroy() {
        if(this._gpuPipelineState)
        {
            this.webGLDevice.emitCmdDestroyGPUPipelineState(this._gpuPipelineState);
            this._gpuPipelineState = null;
        }
    }

    public get webGLDevice() : WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuPipelineState() : WebGLGPUPipelineState | null {
        return this._gpuPipelineState;
    }

    private _gpuPipelineState : WebGLGPUPipelineState | null = null;
};
