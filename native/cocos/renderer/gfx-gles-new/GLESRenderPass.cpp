#include "GLESRenderPass.h"
#include "base/Utils.h"

namespace cc::gfx::gles {

static Attachment convertAttachment(const gfx::ColorAttachment &input) {
    Attachment output = {};
    output.format         = input.format;
    output.sampleCount    = input.sampleCount;
    output.loadOp = input.loadOp;
    output.storeOp = input.storeOp;
    output.stencilLoadOp  = LoadOp::DISCARD;
    output.stencilStoreOp = StoreOp::DISCARD;
    return output;
}

static Attachment convertAttachment(const gfx::DepthStencilAttachment &input) {
    Attachment output = {};
    output.format         = input.format;
    output.sampleCount    = input.sampleCount;
    output.loadOp = input.depthLoadOp;
    output.storeOp = input.depthStoreOp;
    output.stencilLoadOp  = input.stencilLoadOp;
    output.stencilStoreOp = input.stencilStoreOp;
    return output;
}

RenderPass::RenderPass() {
    _typedID = generateObjectID<decltype(this)>();
}

RenderPass::~RenderPass() {
    destroy();
}

void RenderPass::doInit(const RenderPassInfo &info) {
    std::ignore = info;
    uint32_t colorCount = utils::toUint(_colorAttachments.size());
    uint32_t subPassCount = utils::toUint(_subpasses.size());

    _gpuRenderPass = ccnew GPURenderPass();
    _gpuRenderPass->attachments.reserve(colorCount + 1U);
    _gpuRenderPass->subPasses.reserve(std::min(subPassCount, 1U));

    for (auto &attachment : _colorAttachments) {
        _gpuRenderPass->attachments.emplace_back(convertAttachment(attachment));
    }
    // append depth stencil to gpu renderPass attachments
    if (_depthStencilAttachment.format != Format::UNKNOWN) {
        _gpuRenderPass->attachments.emplace_back(convertAttachment(_depthStencilAttachment));
    }

    // assign subPasses
    for (auto &subPass : _subpasses) {
        _gpuRenderPass->subPasses.emplace_back();
        auto &gpuSubPass = _gpuRenderPass->subPasses.back();
        gpuSubPass.colors = subPass.colors;
        gpuSubPass.resolves = subPass.resolves;
        if (subPass.depthStencil > colorCount) {
            gpuSubPass.depthStencil = colorCount;
        }
    }

    // assign a dummy subPass if not specified
    if (_subpasses.empty()) {
        _gpuRenderPass->subPasses.emplace_back();
        auto &subPass = _gpuRenderPass->subPasses.back();
        subPass.colors.resize(_colorAttachments.size());
        for (uint32_t i = 0; i < colorCount; ++i) {
            subPass.colors[i] = i;
        }
        if (_depthStencilAttachment.format != Format::UNKNOWN) {
            subPass.depthStencil = colorCount;
        }
    }
}

void RenderPass::doDestroy() {
    _gpuRenderPass = nullptr;
}

} // namespace cc::gfx::gles
