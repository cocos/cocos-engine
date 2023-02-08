#pragma once

#include "gfx-base/GFXRenderPass.h"
#include "gfx-base/GFXDeviceObject.h"

namespace cc::gfx::gles {

struct Attachment {
    Format format           = Format::UNKNOWN;
    SampleCount sampleCount = SampleCount::ONE;
    LoadOp loadOp           = LoadOp::CLEAR;
    StoreOp storeOp         = StoreOp::STORE;
    LoadOp stencilLoadOp    = LoadOp::CLEAR;
    StoreOp stencilStoreOp  = StoreOp::STORE;
};

struct SubPass {
    IndexList colors;
    IndexList resolves;
    uint32_t depthStencil = INVALID_BINDING;
};

struct GPURenderPass : public GFXDeviceObject<DefaultDeleter> {
    ccstd::vector<Attachment> attachments;
    ccstd::vector<SubPass> subPasses;
};

class RenderPass : public gfx::RenderPass {
public:
    RenderPass();
    ~RenderPass() override;

    GPURenderPass *getGPURenderPass() const { return _gpuRenderPass.get(); }

private:
    void doInit(const RenderPassInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GPURenderPass> _gpuRenderPass;
};

} // namespace cc::gfx::gles
