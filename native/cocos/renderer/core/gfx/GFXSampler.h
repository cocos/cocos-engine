/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#ifndef CC_CORE_GFX_SAMPLER_H_
#define CC_CORE_GFX_SAMPLER_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL Sampler : public GFXObject {
public:
    Sampler(Device *device);
    virtual ~Sampler();

    virtual bool initialize(const SamplerInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE Filter getMinFilter() const { return _minFilter; }
    CC_INLINE Filter getMagFilter() const { return _magFilter; }
    CC_INLINE Filter getMipFilter() const { return _mipFilter; }
    CC_INLINE Address getAddressU() const { return _addressU; }
    CC_INLINE Address getAddressV() const { return _addressV; }
    CC_INLINE Address getAddressW() const { return _addressW; }
    CC_INLINE uint getMaxAnisotropy() const { return _maxAnisotropy; }
    CC_INLINE ComparisonFunc getCmpFunc() const { return _cmpFunc; }
    CC_INLINE const Color &getBorderColor() const { return _borderColor; }
    CC_INLINE float getMipLODBias() const { return _mipLODBias; }

protected:
    Device *_device = nullptr;
    Filter _minFilter = Filter::NONE;
    Filter _magFilter = Filter::NONE;
    Filter _mipFilter = Filter::NONE;
    Address _addressU = Address::WRAP;
    Address _addressV = Address::WRAP;
    Address _addressW = Address::WRAP;
    uint _maxAnisotropy = 0;
    ComparisonFunc _cmpFunc = ComparisonFunc::ALWAYS;
    Color _borderColor;
    float _mipLODBias = 0.0f;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_SAMPLER_H_
