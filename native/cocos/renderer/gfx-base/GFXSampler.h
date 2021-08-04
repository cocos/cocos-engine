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

#pragma once

#include "GFXObject.h"

namespace cc {
namespace gfx {

class CC_DLL Sampler : public GFXObject {
public:
    Sampler();
    ~Sampler() override;

    void initialize(const SamplerInfo &info);
    void destroy();

    inline Filter         getMinFilter() const { return _minFilter; }
    inline Filter         getMagFilter() const { return _magFilter; }
    inline Filter         getMipFilter() const { return _mipFilter; }
    inline Address        getAddressU() const { return _addressU; }
    inline Address        getAddressV() const { return _addressV; }
    inline Address        getAddressW() const { return _addressW; }
    inline uint           getMaxAnisotropy() const { return _maxAnisotropy; }
    inline ComparisonFunc getCmpFunc() const { return _cmpFunc; }
    inline const Color &  getBorderColor() const { return _borderColor; }
    inline float          getMipLODBias() const { return _mipLODBias; }

protected:
    virtual void doInit(const SamplerInfo &info) = 0;
    virtual void doDestroy()                     = 0;

    Filter         _minFilter     = Filter::NONE;
    Filter         _magFilter     = Filter::NONE;
    Filter         _mipFilter     = Filter::NONE;
    Address        _addressU      = Address::WRAP;
    Address        _addressV      = Address::WRAP;
    Address        _addressW      = Address::WRAP;
    uint           _maxAnisotropy = 0;
    ComparisonFunc _cmpFunc       = ComparisonFunc::ALWAYS;
    Color          _borderColor;
    float          _mipLODBias = 0.0F;
};

} // namespace gfx
} // namespace cc
