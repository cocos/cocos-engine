import { GFXFilter } from '../define';
import { GFXSampler, IGFXSamplerInfo } from '../sampler';
import { WebGLGPUSampler } from './webgl-gpu-objects';

const WebGLWraps: GLenum[] = [
    0x2901, // WebGLRenderingContext.REPEAT,
    0x8370, // WebGLRenderingContext.MIRRORED_REPEAT,
    0x812F, // WebGLRenderingContext.CLAMP_TO_EDGE,
    0x812F, // WebGLRenderingContext.CLAMP_TO_EDGE,
];

export class WebGLGFXSampler extends GFXSampler {

    public get gpuSampler (): WebGLGPUSampler {
        return  this._gpuSampler!;
    }

    private _gpuSampler: WebGLGPUSampler | null = null;

    protected _initialize (info: IGFXSamplerInfo): boolean {

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

        return true;
    }

    protected _destroy () {
        this._gpuSampler = null;
    }
}
