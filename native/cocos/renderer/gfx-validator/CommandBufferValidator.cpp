/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/CoreStd.h"
#include "base/job-system/JobSystem.h"
#include "base/threading/MessageQueue.h"

#include "BufferValidator.h"
#include "CommandBufferValidator.h"
#include "DescriptorSetValidator.h"
#include "DeviceValidator.h"
#include "FramebufferValidator.h"
#include "InputAssemblerValidator.h"
#include "PipelineStateValidator.h"
#include "QueueValidator.h"
#include "RenderPassValidator.h"
#include "TextureValidator.h"
#include "ValidationUtils.h"

namespace cc {
namespace gfx {

CommandBufferValidator::~CommandBufferValidator() {
    DeviceResourceTracker<CommandBuffer>::erase(this);
    CC_SAFE_DELETE(_actor);
}

void CommandBufferValidator::doInit(const CommandBufferInfo &info) {

    /////////// execute ///////////

    CommandBufferInfo actorInfo = info;
    actorInfo.queue             = static_cast<QueueValidator *>(info.queue)->getActor();

    _actor->initialize(actorInfo);
}

void CommandBufferValidator::doDestroy() {
    _actor->destroy();
}

void CommandBufferValidator::begin(RenderPass *renderPass, uint subpass, Framebuffer *framebuffer) {
    CCASSERT(!_insideRenderPass, "Already inside an render pass?");
    CCASSERT(_type != CommandBufferType::PRIMARY || !renderPass, "Primary command buffer cannot inherit render passes");

    // secondary command buffers enter the render pass right here
    _insideRenderPass = !!renderPass;
    _commandsFlushed  = false;

    /////////// execute ///////////

    RenderPass * renderPassActor  = renderPass ? static_cast<RenderPassValidator *>(renderPass)->getActor() : nullptr;
    Framebuffer *framebufferActor = framebuffer ? static_cast<FramebufferValidator *>(framebuffer)->getActor() : nullptr;

    _actor->begin(renderPassActor, subpass, framebufferActor);
}

void CommandBufferValidator::end() {
    CCASSERT(_type != CommandBufferType::PRIMARY || !_insideRenderPass, "Still inside an render pass?");
    _insideRenderPass = false;

    /////////// execute ///////////

    _actor->end();
}

void CommandBufferValidator::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, int stencil, CommandBuffer *const *secondaryCBs, uint secondaryCBCount) {
    CCASSERT(renderPass, "invalid render pass");
    CCASSERT(fbo, "invalid framebuffer");

    CCASSERT(_type == CommandBufferType::PRIMARY, "Command 'endRenderPass' must be recorded in primary command buffers.");
    CCASSERT(!_insideRenderPass, "Already inside an render pass?");
    _insideRenderPass = true;

    static vector<CommandBuffer *> secondaryCBActors;
    secondaryCBActors.resize(secondaryCBCount);

    /////////// execute ///////////

    RenderPass * renderPassActor  = renderPass ? static_cast<RenderPassValidator *>(renderPass)->getActor() : nullptr;
    Framebuffer *framebufferActor = fbo ? static_cast<FramebufferValidator *>(fbo)->getActor() : nullptr;

    CommandBuffer **actorSecondaryCBs = nullptr;
    if (secondaryCBCount) {
        actorSecondaryCBs = secondaryCBActors.data();
        for (uint i = 0; i < secondaryCBCount; ++i) {
            actorSecondaryCBs[i] = static_cast<CommandBufferValidator *>(secondaryCBs[i])->getActor();
        }
    }

    _actor->beginRenderPass(renderPassActor, framebufferActor, renderArea, colors, depth, stencil, actorSecondaryCBs, secondaryCBCount);
}

void CommandBufferValidator::endRenderPass() {
    CCASSERT(_type == CommandBufferType::PRIMARY, "Command 'endRenderPass' must be recorded in primary command buffers.");
    CCASSERT(_insideRenderPass, "No render pass to end?");
    _insideRenderPass = false;

    /////////// execute ///////////

    _actor->endRenderPass();
}

void CommandBufferValidator::execute(CommandBuffer *const *cmdBuffs, uint32_t count) {
    if (!count) return; // be more lenient on this for now
    CCASSERT(_type == CommandBufferType::PRIMARY, "Command 'execute' must be recorded in primary command buffers.");

    /////////// execute ///////////

    static vector<CommandBuffer *> cmdBuffActors;
    cmdBuffActors.resize(count);

    for (uint i = 0U; i < count; ++i) {
        cmdBuffActors[i] = static_cast<CommandBufferValidator *>(cmdBuffs[i])->getActor();
    }

    _actor->execute(cmdBuffActors.data(), count);
}

void CommandBufferValidator::bindPipelineState(PipelineState *pso) {
    _actor->bindPipelineState(static_cast<PipelineStateValidator *>(pso)->getActor());
}

void CommandBufferValidator::bindDescriptorSet(uint set, DescriptorSet *descriptorSet, uint dynamicOffsetCount, const uint *dynamicOffsets) {
    _actor->bindDescriptorSet(set, static_cast<DescriptorSetValidator *>(descriptorSet)->getActor(), dynamicOffsetCount, dynamicOffsets);
}

void CommandBufferValidator::bindInputAssembler(InputAssembler *ia) {
    _actor->bindInputAssembler(static_cast<InputAssemblerValidator *>(ia)->getActor());
}

void CommandBufferValidator::setViewport(const Viewport &vp) {
    _actor->setViewport(vp);
}

void CommandBufferValidator::setScissor(const Rect &rect) {
    _actor->setScissor(rect);
}

void CommandBufferValidator::setLineWidth(float width) {
    _actor->setLineWidth(width);
}

void CommandBufferValidator::setDepthBias(float constant, float clamp, float slope) {
    _actor->setDepthBias(constant, clamp, slope);
}

void CommandBufferValidator::setBlendConstants(const Color &constants) {
    _actor->setBlendConstants(constants);
}

void CommandBufferValidator::setDepthBound(float minBounds, float maxBounds) {
    _actor->setDepthBound(minBounds, maxBounds);
}

void CommandBufferValidator::setStencilWriteMask(StencilFace face, uint mask) {
    _actor->setStencilWriteMask(face, mask);
}

void CommandBufferValidator::setStencilCompareMask(StencilFace face, int ref, uint mask) {
    _actor->setStencilCompareMask(face, ref, mask);
}

void CommandBufferValidator::nextSubpass() {
    _actor->nextSubpass();
}

void CommandBufferValidator::draw(const DrawInfo &info) {
    CCASSERT(_insideRenderPass, "Command 'draw' must be recorded inside render passes.");

    /////////// execute ///////////

    _actor->draw(info);
}

void CommandBufferValidator::updateBuffer(Buffer *buff, const void *data, uint size) {
    CCASSERT(_type == CommandBufferType::PRIMARY, "Command 'updateBuffer' must be recorded in primary command buffers.");
    CCASSERT(!_insideRenderPass, "Command 'updateBuffer' must be recorded outside render passes.");

    auto *bufferValidator = static_cast<BufferValidator *>(buff);
    bufferValidator->updateRedundencyCheck();

    /////////// execute ///////////

    _actor->updateBuffer(bufferValidator->getActor(), data, size);
}

void CommandBufferValidator::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint count) {
    CCASSERT(_type == CommandBufferType::PRIMARY, "Command 'copyBuffersToTexture' must be recorded in primary command buffers.");
    CCASSERT(!_insideRenderPass, "Command 'copyBuffersToTexture' must be recorded outside render passes.");

    auto *textureValidator = static_cast<TextureValidator *>(texture);
    textureValidator->updateRedundencyCheck();

    /////////// execute ///////////

    _actor->copyBuffersToTexture(buffers, textureValidator->getActor(), regions, count);
}

void CommandBufferValidator::blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint count, Filter filter) {
    CCASSERT(!_insideRenderPass, "Command 'blitTexture' must be recorded outside render passes.");

    /////////// execute ///////////

    Texture *actorSrcTexture = nullptr;
    Texture *actorDstTexture = nullptr;
    if (srcTexture) actorSrcTexture = static_cast<TextureValidator *>(srcTexture)->getActor();
    if (dstTexture) actorDstTexture = static_cast<TextureValidator *>(dstTexture)->getActor();

    _actor->blitTexture(actorSrcTexture, actorDstTexture, regions, count, filter);
}

void CommandBufferValidator::dispatch(const DispatchInfo &info) {
    CCASSERT(!_insideRenderPass, "Command 'dispatch' must be recorded outside render passes.");

    /////////// execute ///////////

    DispatchInfo actorInfo = info;
    if (info.indirectBuffer) actorInfo.indirectBuffer = static_cast<BufferValidator *>(info.indirectBuffer)->getActor();

    _actor->dispatch(info);
}

void CommandBufferValidator::pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint textureBarrierCount) {

    /////////// execute ///////////

    static vector<Texture *> textureActors;
    textureActors.resize(textureBarrierCount);

    Texture **actorTextures = nullptr;
    if (textureBarrierCount) {
        actorTextures = textureActors.data();
        for (uint i = 0U; i < textureBarrierCount; ++i) {
            actorTextures[i] = textures[i] ? static_cast<const TextureValidator *>(textures[i])->getActor() : nullptr;
        }
    }

    _actor->pipelineBarrier(barrier, textureBarriers, actorTextures, textureBarrierCount);
}

} // namespace gfx
} // namespace cc
