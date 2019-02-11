import { GFXFilter, GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXSampler, GFXSamplerState, IGFXSamplerInfo } from '../sampler';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUSampler } from './webgl-gpu-objects';

const WebGLWraps: GLenum[] = [
    WebGLRenderingContext.REPEAT,
    WebGLRenderingContext.MIRRORED_REPEAT,
    WebGLRenderingContext.CLAMP_TO_EDGE,
    WebGLRenderingContext.CLAMP_TO_EDGE,
];

export class WebGLGFXSampler extends GFXSampler {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

    public get gpuSampler (): WebGLGPUSampler {
        return  this._gpuSampler!;
    }

    private _gpuSampler: WebGLGPUSampler | null = null;

    constructor (device: GFXDevice) {
        super(device);

        this._state = new GFXSamplerState();
    }

    public initialize (info: IGFXSamplerInfo): boolean {

        if (info.name !== undefined) {
            this._state.name = info.name;
        }

        if (info.minFilter !== undefined) {
            this._state.minFilter = info.minFilter;
        }

        if (info.magFilter !== undefined) {
            this._state.magFilter = info.magFilter;
        }

        if (info.mipFilter !== undefined) {
            this._state.mipFilter = info.mipFilter;
        }

        if (info.addressU !== undefined) {
            this._state.addressU = info.addressU;
        }

        if (info.addressV !== undefined) {
            this._state.addressV = info.addressV;
        }

        if (info.addressW !== undefined) {
            this._state.addressW = info.addressW;
        }

        if (info.maxAnisotropy !== undefined) {
            this._state.maxAnisotropy = info.maxAnisotropy;
        }

        if (info.cmpFunc !== undefined) {
            this._state.cmpFunc = info.cmpFunc;
        }

        if (info.borderColor !== undefined) {
            this._state.borderColor = info.borderColor;
        }

        if (info.minLOD !== undefined) {
            this._state.minLOD = info.minLOD;
        }

        if (info.maxLOD !== undefined) {
            this._state.maxLOD = info.maxLOD;
        }

        if (info.mipLODBias !== undefined) {
            this._state.mipLODBias = info.mipLODBias;
        }

        let glMinFilter = WebGLRenderingContext.NONE;
        let glMagFilter = WebGLRenderingContext.NONE;

        const minFilter = (info.minFilter !== undefined ? info.minFilter : GFXFilter.LINEAR);
        const magFilter = (info.magFilter !== undefined ? info.magFilter : GFXFilter.LINEAR);
        const mipFilter = (info.mipFilter !== undefined ? info.mipFilter : GFXFilter.NONE);

        if (minFilter === GFXFilter.LINEAR || minFilter === GFXFilter.ANISOTROPIC) {
            if (mipFilter === GFXFilter.LINEAR || mipFilter === GFXFilter.ANISOTROPIC) {
                glMinFilter = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
            } else if (mipFilter === GFXFilter.POINT) {
                glMinFilter = WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
            } else {
                glMinFilter = WebGLRenderingContext.LINEAR;
            }
        } else {
            if (mipFilter === GFXFilter.LINEAR || mipFilter === GFXFilter.ANISOTROPIC) {
                glMinFilter = WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
            } else if (mipFilter === GFXFilter.POINT) {
                glMinFilter = WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
            } else {
                glMinFilter = WebGLRenderingContext.NEAREST;
            }
        }

        if (magFilter === GFXFilter.LINEAR || magFilter === GFXFilter.ANISOTROPIC) {
            glMagFilter = WebGLRenderingContext.LINEAR;
        } else {
            glMagFilter = WebGLRenderingContext.NEAREST;
        }

        const glWrapS = (info.addressU !== undefined ? WebGLWraps[info.addressU] : WebGLRenderingContext.CLAMP_TO_EDGE);
        const glWrapT = (info.addressU !== undefined ? WebGLWraps[info.addressU] : WebGLRenderingContext.CLAMP_TO_EDGE);
        const glWrapR = (info.addressU !== undefined ? WebGLWraps[info.addressU] : WebGLRenderingContext.CLAMP_TO_EDGE);

        this._gpuSampler = {
            glMinFilter,
            glMagFilter,
            glWrapS,
            glWrapT,
            glWrapR,
        };

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._gpuSampler = null;
        this._status = GFXStatus.UNREADY;
    }
}
