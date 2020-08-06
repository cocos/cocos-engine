import { GFXFilter, GFXStatus } from '../define';
import { GFXSampler, IGFXSamplerInfo } from '../sampler';
import { IWebGLGPUSampler } from './webgl-gpu-objects';

const WebGLWraps: GLenum[] = [
    0x2901, // WebGLRenderingContext.REPEAT,
    0x8370, // WebGLRenderingContext.MIRRORED_REPEAT,
    0x812F, // WebGLRenderingContext.CLAMP_TO_EDGE,
    0x812F, // WebGLRenderingContext.CLAMP_TO_EDGE,
];

export class WebGLSampler extends GFXSampler {

    public get gpuSampler (): IWebGLGPUSampler {
        return  this._gpuSampler!;
    }

    private _gpuSampler: IWebGLGPUSampler | null = null;

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

        let glMinFilter = 0;
        let glMagFilter = 0;

        const minFilter = this._state.minFilter;
        const magFilter = this._state.magFilter;
        const mipFilter = this._state.mipFilter;

        if (minFilter === GFXFilter.LINEAR || minFilter === GFXFilter.ANISOTROPIC) {
            if (mipFilter === GFXFilter.LINEAR || mipFilter === GFXFilter.ANISOTROPIC) {
                glMinFilter = 0x2703; // WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
            } else if (mipFilter === GFXFilter.POINT) {
                glMinFilter = 0x2701; // WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
            } else {
                glMinFilter = 0x2601; // WebGLRenderingContext.LINEAR;
            }
        } else {
            if (mipFilter === GFXFilter.LINEAR || mipFilter === GFXFilter.ANISOTROPIC) {
                glMinFilter = 0x2702; // WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
            } else if (mipFilter === GFXFilter.POINT) {
                glMinFilter = 0x2700; // WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
            } else {
                glMinFilter = 0x2600; // WebGLRenderingContext.NEAREST;
            }
        }

        if (magFilter === GFXFilter.LINEAR || magFilter === GFXFilter.ANISOTROPIC) {
            glMagFilter = 0x2601; // WebGLRenderingContext.LINEAR;
        } else {
            glMagFilter = 0x2600; // WebGLRenderingContext.NEAREST;
        }

        const glWrapS = WebGLWraps[this._state.addressU];
        const glWrapT = WebGLWraps[this._state.addressV];
        const glWrapR = WebGLWraps[this._state.addressW];

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
