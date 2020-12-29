/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
#ifndef CC_GFXGLES2_SAMPLER_H_
#define CC_GFXGLES2_SAMPLER_H_

namespace cc {
namespace gfx {

class GLES2GPUSampler;

class CC_GLES2_API GLES2Sampler final : public Sampler {
public:
    GLES2Sampler(Device *device);
    ~GLES2Sampler();

public:
    virtual bool initialize(const SamplerInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPUSampler *gpuSampler() const { return _gpuSampler; }

private:
    GLES2GPUSampler *_gpuSampler = nullptr;
    String _name;
    Filter _minFilter = Filter::LINEAR;
    Filter _magFilter = Filter::LINEAR;
    Filter _mipFilter = Filter::NONE;
    Address _addressU = Address::WRAP;
    Address _addressV = Address::WRAP;
    Address _addressW = Address::WRAP;
    uint _maxAnisotropy = 16;
    ComparisonFunc _cmpFunc = ComparisonFunc::NEVER;
    Color _borderColor;
    uint _minLOD = 0;
    uint _maxLOD = 1000;
    float _mipLODBias = 0.0f;
};

} // namespace gfx
} // namespace cc

#endif
