#pragma once

#include "gfx-base/GFXPipelineState.h"
#include "gfx-base/GFXDeviceObject.h"
#include "gfx-gles-new/GLESCore.h"
#include "gfx-gles-new/GLESShader.h"
#include "gfx-gles-new/GLESPipelineLayout.h"
#include "base/std/container/vector.h"

namespace cc::gfx::gles {

struct GPUDescriptorIndex {
    union {
        uint32_t binding;  // for buffer
        uint32_t unit;     // for texture, sampler
    };
};

struct GPUPipelineState : public GFXDeviceObject<DefaultDeleter> {
    GPUPipelineState() noexcept = default;
    ~GPUPipelineState() noexcept override = default;

    void initPipelineState(const PipelineStateInfo &info);
    void setRasterizerState(const gfx::RasterizerState &rs);
    void setDepthStencilState(const gfx::DepthStencilState &ds);
    void setBlendState(const gfx::BlendState &bs);
    void setShader(gfx::Shader *shader);
    void setBinding();

    IntrusivePtr<GPUShader>         shader;
    IntrusivePtr<GPUPipelineLayout> layout;

    RasterizerState   rasterizerState;
    DepthStencilState depthStencilState;
    BlendState        blendState;

    GLenum primitive               = GL_TRIANGLES;
    DynamicStateFlags dynamicStats = DynamicStateFlagBit::NONE;

    // descriptors
    ccstd::vector<GPUDescriptorIndex> descriptors;
    ccstd::vector<uint32_t> descriptorOffsets;  // set offset to descriptors

    // shader resource list
    AttributeList              attributes;
    UniformBlockList           blocks;
    UniformStorageBufferList   buffers;
    UniformSamplerTextureList  samplerTextures;
    UniformStorageImageList    images;

    UniformInputAttachmentList subpassInputs;
};

class PipelineState : public gfx::PipelineState {
public:
    PipelineState();
    ~PipelineState() override;

    GPUPipelineState *getGPUPipelineState() const { return _pso.get(); }

protected:

    void doInit(const PipelineStateInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GPUPipelineState> _pso;
};

} // namespace cc::gfx::gles
