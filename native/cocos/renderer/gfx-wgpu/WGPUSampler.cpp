/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "WGPUSampler.h"
#include <webgpu/webgpu.h>
#include <limits>
#include "WGPUDevice.h"
#include "WGPUUtils.h"

namespace cc {
namespace gfx {

namespace {
CCWGPUSampler *dftFilterableSampler = nullptr;
CCWGPUSampler *dftUnfilterableSampler = nullptr;
} // namespace

using namespace emscripten;

CCWGPUSampler::CCWGPUSampler(const SamplerInfo &info) : Sampler(info) {
    ccstd::string tag = std::to_string(static_cast<uint32_t>(info.minFilter)) + " " + std::to_string(static_cast<uint32_t>(info.magFilter)) + " " + std::to_string(static_cast<uint32_t>(info.mipFilter));
    WGPUSamplerDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = tag.c_str(),
        .addressModeU = toWGPUAddressMode(info.addressU),
        .addressModeV = toWGPUAddressMode(info.addressV),
        .addressModeW = toWGPUAddressMode(info.addressW),
        .magFilter = toWGPUFilterMode(info.magFilter),
        .minFilter = toWGPUFilterMode(info.minFilter),
        .mipmapFilter = toWGPUMipmapFilterMode(info.mipFilter),
        .lodMinClamp = 0.0f,
        .lodMaxClamp = std::numeric_limits<float>::max(),
        .compare = WGPUCompareFunction_Undefined, // toWGPUCompareFunction(info.cmpFunc),
        .maxAnisotropy = static_cast<uint16_t>(info.maxAnisotropy),
    };

    auto *device = CCWGPUDevice::getInstance();
    _wgpuSampler = wgpuDeviceCreateSampler(device->gpuDeviceObject()->wgpuDevice, &descriptor);
}

CCWGPUSampler::~CCWGPUSampler() {
    wgpuSamplerRelease(_wgpuSampler);
}

CCWGPUSampler *CCWGPUSampler::defaultFilterableSampler() {
    if (!dftFilterableSampler) {
        SamplerInfo info = {
            .minFilter = Filter::LINEAR,
            .magFilter = Filter::LINEAR,
            .mipFilter = Filter::LINEAR,
            .addressU = Address::WRAP,
            .addressV = Address::WRAP,
            .addressW = Address::WRAP,
            .maxAnisotropy = 0,
            .cmpFunc = ComparisonFunc::ALWAYS,
        };
        dftFilterableSampler = ccnew CCWGPUSampler(info);
    }
    return dftFilterableSampler;
}

CCWGPUSampler *CCWGPUSampler::defaultUnfilterableSampler() {
    if (!dftUnfilterableSampler) {
        SamplerInfo info = {
            .minFilter = Filter::POINT,
            .magFilter = Filter::POINT,
            .mipFilter = Filter::POINT,
            .addressU = Address::WRAP,
            .addressV = Address::WRAP,
            .addressW = Address::WRAP,
            .maxAnisotropy = 0,
            .cmpFunc = ComparisonFunc::ALWAYS,
        };
        dftUnfilterableSampler = ccnew CCWGPUSampler(info);
    }
    return dftUnfilterableSampler;
}

} // namespace gfx
} // namespace cc
