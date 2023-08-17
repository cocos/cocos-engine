/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

#pragma once

#include "base/TypeDef.h"
#include "math/Mat4.h"
#include "math/Vec2.h"
#include "math/Vec4.h"
#include "renderer/gfx-base/GFXDef.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {

using ComputeShaderSource = ccstd::string;

template <typename T>
struct ShaderSources {
    T glsl4;
    T glsl3;
    T glsl1;
};

class ReflectionComp {
public:
    ReflectionComp() = default;
    ~ReflectionComp();
    void init(gfx::Device *dev, uint32_t groupSizeX, uint32_t groupSizeY);
    void getReflectorShader(ShaderSources<ComputeShaderSource> &sources, bool useEnvmap) const;
    void getDenoiseShader(ShaderSources<ComputeShaderSource> &sources, bool useEnvmap) const;
    void initReflectionRes();
    void initDenoiseRes();
    void initDenoiseResEnvmap();
    void applyTexSize(uint32_t width, uint32_t height, const Mat4 &matView,
                      const Mat4 &matViewProj, const Mat4 &matViewProjInv,
                      const Mat4 &matProjInv, const Vec4 &viewPort);

    inline gfx::DescriptorSet *getDescriptorSet() { return _compDescriptorSet; }
    inline const gfx::PipelineState *getPipelineState(bool useEnvmap) { return _compPipelineState[useEnvmap]; }
    inline gfx::DescriptorSet *getDenoiseDescriptorSet() { return _compDenoiseDescriptorSet; }
    inline const gfx::PipelineState *getDenoisePipelineState(bool useEnvmap) { return _compDenoisePipelineState[useEnvmap]; }
    inline const gfx::PipelineState *getDenoisePipelineStateEnvmap() { return _compDenoisePipelineStateEnvmap; }
    inline const gfx::GeneralBarrier *getBarrierPre() { return _barrierPre; }
    inline const gfx::TextureBarrierList &getBarrierBeforeDenoise() { return _barrierBeforeDenoise; }
    inline const gfx::TextureBarrierList &getBarrierAfterDenoise() { return _barrierAfterDenoise; }
    inline const gfx::DispatchInfo &getDispatchInfo() { return _dispatchInfo; }
    inline const gfx::DispatchInfo &getDenoiseDispatchInfo() { return _denoiseDispatchInfo; }
    inline uint32_t getGroupSizeX() const { return _groupSizeX; }
    inline uint32_t getGroupSizeY() const { return _groupSizeY; }

    inline gfx::Buffer *getConstantsBuffer() { return _compConstantsBuffer; }
    inline gfx::Sampler *getSampler() { return _sampler; }

private:
    template <typename T>
    T &getAppropriateShaderSource(ShaderSources<T> &sources);

    gfx::Device *_device{nullptr};

    gfx::Shader *_compShader[2]{nullptr};
    gfx::DescriptorSetLayout *_compDescriptorSetLayout{nullptr};
    gfx::PipelineLayout *_compPipelineLayout{nullptr};
    gfx::PipelineState *_compPipelineState[2]{nullptr};
    gfx::DescriptorSet *_compDescriptorSet{nullptr};

    gfx::Shader *_compDenoiseShader[2]{nullptr};
    gfx::DescriptorSetLayout *_compDenoiseDescriptorSetLayout{nullptr};
    gfx::PipelineLayout *_compDenoisePipelineLayout{nullptr};
    gfx::PipelineState *_compDenoisePipelineState[2]{nullptr};
    gfx::PipelineState *_compDenoisePipelineStateEnvmap{nullptr};
    gfx::DescriptorSet *_compDenoiseDescriptorSet{nullptr};

    gfx::DescriptorSetLayout *_localDescriptorSetLayout{nullptr};

    gfx::Buffer *_compConstantsBuffer{nullptr};
    gfx::Sampler *_sampler{nullptr};

    gfx::GeneralBarrier *_barrierPre{nullptr};

    gfx::TextureBarrierList _barrierBeforeDenoise;
    gfx::TextureBarrierList _barrierAfterDenoise;

    gfx::DispatchInfo _dispatchInfo;
    gfx::DispatchInfo _denoiseDispatchInfo;

    uint32_t _groupSizeX{8};
    uint32_t _groupSizeY{8};
};

} // namespace cc
