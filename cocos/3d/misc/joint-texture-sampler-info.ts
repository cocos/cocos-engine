import { Address, Filter, SamplerInfo } from '../../core/gfx';

export const jointTextureSamplerInfo = new SamplerInfo(
    Filter.POINT,
    Filter.POINT,
    Filter.NONE,
    Address.CLAMP,
    Address.CLAMP,
    Address.CLAMP,
);
