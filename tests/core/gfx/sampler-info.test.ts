import { Sampler, SamplerInfo, Filter, Address, ComparisonFunc } from "../../../cocos/gfx"

function testSamplerInfo(info: SamplerInfo): boolean {
    const packed = Sampler.computeHash(info);
    const unpacked = Sampler.unpackFromHash(packed);
    return unpacked.minFilter === info.minFilter &&
        unpacked.magFilter === info.magFilter &&
        unpacked.mipFilter === info.mipFilter &&
        unpacked.addressU === info.addressU &&
        unpacked.addressV === info.addressV &&
        unpacked.addressW === info.addressW &&
        unpacked.maxAnisotropy === info.maxAnisotropy &&
        unpacked.cmpFunc === info.cmpFunc;
}

test('packSamplerInfo', () => {
    expect(testSamplerInfo(new SamplerInfo(
        Filter.NONE,
        Filter.NONE,
        Filter.NONE,
        Address.WRAP,
        Address.WRAP,
        Address.WRAP,
        0,
        ComparisonFunc.NEVER))).toBe(true);

    expect(testSamplerInfo(new SamplerInfo(
        Filter.ANISOTROPIC,
        Filter.ANISOTROPIC,
        Filter.ANISOTROPIC,
        Address.BORDER,
        Address.BORDER,
        Address.BORDER,
        16,
        ComparisonFunc.ALWAYS))).toBe(true);

    expect(testSamplerInfo(new SamplerInfo(
        Filter.ANISOTROPIC,
        Filter.LINEAR,
        Filter.POINT,
        Address.BORDER,
        Address.CLAMP,
        Address.MIRROR,
        15,
        ComparisonFunc.GREATER_EQUAL))).toBe(true);
})
