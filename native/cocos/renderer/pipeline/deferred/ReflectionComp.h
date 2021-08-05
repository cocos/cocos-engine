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
    void initReflectionRes();
    void initDenoiseRes();
    void applyTexSize(uint width, uint height, const Mat4& matViewProj);

    inline gfx::DescriptorSet*      getDescriptorSet() { return _compDescriptorSet; }
    inline const gfx::PipelineState*      getPipelineState() { return _compPipelineState; }
    inline gfx::DescriptorSet*      getDenoiseDescriptorSet() { return _compDenoiseDescriptorSet; }
    inline const gfx::PipelineState*      getDenoisePipelineState() { return _compDenoisePipelineState; }
    inline const gfx::GlobalBarrier*      getBarrierPre() { return _barrierPre; }
    inline const gfx::TextureBarrierList& getBarrierBeforeDenoise() { return _barrierBeforeDenoise; }
    inline const gfx::TextureBarrierList& getBarrierAfterDenoise() { return _barrierAfterDenoise; }
    inline const gfx::DispatchInfo&       getDispatchInfo() { return _dispatchInfo; }
    inline const gfx::DispatchInfo&       getDenioseDispatchInfo() { return _denoiseDispatchInfo; }
    inline int                            getGroupSizeX() const { return _groupSizeX; }
    inline int                            getGroupSizeY() const { return _groupSizeY; }

    inline gfx::Buffer *getConstantsBuffer() {return _compConstantsBuffer;}
    inline gfx::Sampler *getSampler() {return _sampler;}

private:
    template <typename T>
    T& getAppropriateShaderSource(ShaderSources<T>& sources);

    gfx::Device* _device{nullptr};

    gfx::Shader*              _compShader{nullptr};
    gfx::DescriptorSetLayout* _compDescriptorSetLayout{nullptr};
    gfx::PipelineState*       _compPipelineState{nullptr};
    gfx::DescriptorSet*       _compDescriptorSet{nullptr};

    gfx::Shader*              _compDenoiseShader{nullptr};
    gfx::DescriptorSetLayout* _compDenoiseDescriptorSetLayout{nullptr};
    gfx::PipelineLayout*      _compDenoisePipelineLayout{nullptr};
    gfx::PipelineState*       _compDenoisePipelineState{nullptr};
    gfx::DescriptorSet*       _compDenoiseDescriptorSet{nullptr};

    gfx::DescriptorSetLayout* _localDescriptorSetLayout{nullptr};

    gfx::Buffer*  _compConstantsBuffer{nullptr};
    gfx::Sampler* _sampler{nullptr};
    Mat4          _matViewProj;

    gfx::GlobalBarrier* _barrierPre{nullptr};

    gfx::TextureBarrierList _barrierBeforeDenoise;
    gfx::TextureBarrierList _barrierAfterDenoise;

    gfx::DispatchInfo _dispatchInfo;
    gfx::DispatchInfo _denoiseDispatchInfo;

    uint _groupSizeX{8};
    uint _groupSizeY{8};
};

} // namespace cc
