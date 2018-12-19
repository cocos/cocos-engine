import { GFXDevice } from '../gfx-device';
import { WebGLGPUTexture, WebGLGPURenderPass } from './webgl-gpu-objects';
import { WebGLGFXDevice } from './webgl-gfx-device';
import { GFXTexture, GFXTextureInfo, GFXTextureFlagBit } from '../gfx-texture';
import { GFXFormatSurfaceSize } from '../gfx-define';
import { GFXRenderPass, GFXRenderPassInfo } from '../gfx-render-pass';

export class WebGLGFXRenderPass extends GFXRenderPass {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXRenderPassInfo) : boolean {

        this._colorInfos = info.colorInfos;
        this._depthStencilInfo = info.depthStencilInfo;
        this._subPasses = info.subPasses;

        this._gpuRenderPass = (<WebGLGFXDevice>this._device).emitCmdCreateGPURenderPass(info);

        return true;
    }

    public destroy() {
        this._gpuRenderPass = null;
    }

    public get gpuRenderPass(): WebGLGPURenderPass {
        return <WebGLGPURenderPass>this._gpuRenderPass;
    }

    private _gpuRenderPass : WebGLGPURenderPass | null = null;
};
