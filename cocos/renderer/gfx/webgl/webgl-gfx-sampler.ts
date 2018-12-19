import { GFXDevice } from '../gfx-device';
import { GFXSampler, GFXSamplerInfo } from '../gfx-sampler';

export class WebGLGFXSampler extends GFXSampler {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXSamplerInfo) : boolean {

        this._minFilter = info.minFilter;
        this._magFilter = info.magFilter;
        this._mipFilter = info.mipFilter;
        this._addressU = info.addressU;
        this._addressV = info.addressV;
        this._addressW = info.addressW;
        this._maxAnisotropy = info.maxAnisotropy;
        this._cmpFunc = info.cmpFunc;
        this._borderColor = info.borderColor;
        this._minLOD = info.minLOD;
        this._maxLOD = info.maxLOD;
        this._mipLODBias = info.mipLODBias;

        return true;
    }

    public destroy() {
    }
};
