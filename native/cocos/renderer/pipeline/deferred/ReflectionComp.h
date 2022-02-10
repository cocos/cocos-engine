#pragma once

#include "base/CoreStd.h"
#include "base/TypeDef.h"
#include "math/Mat4.h"
#include "math/Vec2.h"
#include "math/Vec4.h"
#include "renderer/gfx-base/GFXDef.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {

using ComputeShaderSource = String;

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
    void init(gfx::Device* dev, uint groupSizeX, uint groupSizeY);
    void getReflectorShader(ShaderSources<ComputeShaderSource> &sources, bool useEnvmap) const;
    void getDenoiseShader(ShaderSources<ComputeShaderSource> &sources, bool useEnvmap) const;
    void initReflectionRes();
    void initDenoiseRes();
    void initDenoiseResEnvmap();
    void applyTexSize(uint width, uint height, const Mat4 &matView,
                      const Mat4& matViewProj, const Mat4& matViewProjInv,
                      const Mat4& matProjInv, const Vec4 &viewPort);

    inline gfx::DescriptorSet*            getDescriptorSet() { return _compDescriptorSet; }
    inline const gfx::PipelineState*      getPipelineState(bool useEnvmap) { return _compPipelineState[useEnvmap]; }
    inline gfx::DescriptorSet*            getDenoiseDescriptorSet() { return _compDenoiseDescriptorSet; }
    inline const gfx::PipelineState*      getDenoisePipelineState(bool useEnvmap) { return _compDenoisePipelineState[useEnvmap]; }
    inline const gfx::PipelineState*      getDenoisePipelineStateEnvmap() { return _compDenoisePipelineStateEnvmap; }
    inline const gfx::GlobalBarrier*      getBarrierPre() { return _barrierPre; }
    inline const gfx::TextureBarrierList& getBarrierBeforeDenoise() { return _barrierBeforeDenoise; }
    inline const gfx::TextureBarrierList& getBarrierAfterDenoise() { return _barrierAfterDenoise; }
    inline const gfx::DispatchInfo&       getDispatchInfo() { return _dispatchInfo; }
    inline const gfx::DispatchInfo&       getDenioseDispatchInfo() { return _denoiseDispatchInfo; }
    inline int                            getGroupSizeX() const { return _groupSizeX; }
    inline int                            getGroupSizeY() const { return _groupSizeY; }

    inline gfx::Buffer*  getConstantsBuffer() { return _compConstantsBuffer; }
    inline gfx::Sampler* getSampler() { return _sampler; }

private:
    template <typename T>
    T& getAppropriateShaderSource(ShaderSources<T>& sources);

    gfx::Device* _device{nullptr};

    gfx::Shader*              _compShader[2]{nullptr};
    gfx::DescriptorSetLayout* _compDescriptorSetLayout{nullptr};
    gfx::PipelineLayout*      _compPipelineLayout{nullptr};
    gfx::PipelineState*       _compPipelineState[2]{nullptr};
    gfx::DescriptorSet*       _compDescriptorSet{nullptr};

    gfx::Shader*              _compDenoiseShader[2]{nullptr};
    gfx::DescriptorSetLayout* _compDenoiseDescriptorSetLayout{nullptr};
    gfx::PipelineLayout*      _compDenoisePipelineLayout{nullptr};
    gfx::PipelineState*       _compDenoisePipelineState[2]{nullptr};
    gfx::PipelineState*       _compDenoisePipelineStateEnvmap{nullptr};
    gfx::DescriptorSet*       _compDenoiseDescriptorSet{nullptr};

    gfx::DescriptorSetLayout* _localDescriptorSetLayout{nullptr};

    gfx::Buffer*  _compConstantsBuffer{nullptr};
    gfx::Sampler* _sampler{nullptr};

    gfx::GlobalBarrier* _barrierPre{nullptr};

    gfx::TextureBarrierList _barrierBeforeDenoise;
    gfx::TextureBarrierList _barrierAfterDenoise;

    gfx::DispatchInfo _dispatchInfo;
    gfx::DispatchInfo _denoiseDispatchInfo;

    uint _groupSizeX{8};
    uint _groupSizeY{8};
};

} // namespace cc
