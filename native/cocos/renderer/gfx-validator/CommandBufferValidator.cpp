/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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
#include "base/Macros.h"
#include "base/job-system/JobSystem.h"

#include "BufferValidator.h"
#include "CommandBufferValidator.h"
#include "DescriptorSetValidator.h"
#include "DeviceValidator.h"
#include "FramebufferValidator.h"
#include "InputAssemblerValidator.h"
#include "PipelineStateValidator.h"
#include "QueryPoolValidator.h"
#include "QueueValidator.h"
#include "RenderPassValidator.h"
#include "TextureValidator.h"
#include "ValidationUtils.h"
#include "gfx-base/GFXCommandBuffer.h"

namespace cc {
namespace gfx {

CommandBufferValidator::CommandBufferValidator(CommandBuffer *actor)
: Agent<CommandBuffer>(actor) {
    _typedID = actor->getTypedID();
}

CommandBufferValidator::~CommandBufferValidator() {
    DeviceResourceTracker<CommandBuffer>::erase(this);
    CC_SAFE_DELETE(_actor);
}

void CommandBufferValidator::initValidator() {
    CCASSERT(!isInited(), "initializing twice?");
    _inited = true;

    size_t descriptorSetCount = DeviceValidator::getInstance()->bindingMappingInfo().setIndices.size();
    _curStates.descriptorSets.resize(descriptorSetCount);
    _curStates.dynamicOffsets.resize(descriptorSetCount);
}

void CommandBufferValidator::destroyValidator() {
}

void CommandBufferValidator::doInit(const CommandBufferInfo &info) {
    initValidator();

    CCASSERT(info.queue && static_cast<QueueValidator *>(info.queue)->isInited(), "already destroyed?");

    /////////// execute ///////////

    CommandBufferInfo actorInfo = info;
    actorInfo.queue             = static_cast<QueueValidator *>(info.queue)->getActor();

    _actor->initialize(actorInfo);
}

void CommandBufferValidator::doDestroy() {
    CCASSERT(isInited(), "destroying twice?");
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

void CommandBufferValidator::begin(RenderPass *renderPass, uint32_t subpass, Framebuffer *framebuffer) {
    CCASSERT(isInited(), "alread destroyed?");
    CCASSERT(!renderPass || static_cast<RenderPassValidator *>(renderPass)->isInited(), "already destroyed?");
    CCASSERT(!framebuffer || static_cast<FramebufferValidator *>(framebuffer)->isInited(), "already destroyed?");

    CCASSERT(!_insideRenderPass, "Already inside a render pass?");
    CCASSERT(_type != CommandBufferType::PRIMARY || !renderPass, "Primary command buffer cannot inherit render passes");

    // secondary command buffers enter the render pass right here
    _insideRenderPass = !!renderPass;
    _commandsFlushed  = false;

    _recorder.clear();
    _curStates.descriptorSets.assign(_curStates.descriptorSets.size(), nullptr);

    /////////// execute ///////////

    RenderPass * renderPassActor  = renderPass ? static_cast<RenderPassValidator *>(renderPass)->getActor() : nullptr;
    Framebuffer *framebufferActor = framebuffer ? static_cast<FramebufferValidator *>(framebuffer)->getActor() : nullptr;

    _actor->begin(renderPassActor, subpass, framebufferActor);
}

void CommandBufferValidator::end() {
    CCASSERT(isInited(), "alread destroyed?");

    CCASSERT(_type != CommandBufferType::PRIMARY || !_insideRenderPass, "Still inside a render pass?");
    _insideRenderPass = false;

    /////////// execute ///////////

    _actor->end();
}

void CommandBufferValidator::beginRenderPass(RenderPass *renderPass, Framebuffer *fbo, const Rect &renderArea, const Color *colors, float depth, uint32_t stencil, CommandBuffer *const *secondaryCBs, uint32_t secondaryCBCount) {
    CCASSERT(isInited(), "alread destroyed?");
    CCASSERT(renderPass && static_cast<RenderPassValidator *>(renderPass)->isInited(), "already destroyed?");
    CCASSERT(fbo && static_cast<FramebufferValidator *>(fbo)->isInited(), "already destroyed?");

    CCASSERT(_type == CommandBufferType::PRIMARY, "Command 'endRenderPass' must be recorded in primary command buffers.");
    CCASSERT(!_insideRenderPass, "Already inside a render pass?");

    for (size_t i = 0; i < renderPass->getColorAttachments().size(); ++i) {
        const auto &desc = renderPass->getColorAttachments()[i];
        const auto *tex  = fbo->getColorTextures()[i];
        CCASSERT(tex->getFormat() == desc.format, "attachment format mismatch");
    }
    if (fbo->getDepthStencilTexture()) {
        CCASSERT(fbo->getDepthStencilTexture()->getFormat() == renderPass->getDepthStencilAttachment().format, "attachment format mismatch");
    }

    _insideRenderPass = true;
    _curSubpass       = 0U;

    _curStates.renderPass   = renderPass;
    _curStates.framebuffer  = fbo;
    _curStates.renderArea   = renderArea;
    _curStates.clearDepth   = depth;
    _curStates.clearStencil = stencil;
    size_t clearColorCount  = renderPass->getColorAttachments().size();
    if (clearColorCount) {
        _curStates.clearColors.assign(colors, colors + clearColorCount);
    }

    if (DeviceValidator::getInstance()->isRecording()) {
        _recorder.recordBeginRenderPass(_curStates);
    }

    /////////// execute ///////////

    static vector<CommandBuffer *> secondaryCBActors;
    secondaryCBActors.resize(secondaryCBCount);

    CommandBuffer **actorSecondaryCBs = nullptr;
    if (secondaryCBCount) {
        actorSecondaryCBs = secondaryCBActors.data();
        for (uint32_t i = 0; i < secondaryCBCount; ++i) {
            actorSecondaryCBs[i] = static_cast<CommandBufferValidator *>(secondaryCBs[i])->getActor();
        }
    }

    RenderPass * renderPassActor  = static_cast<RenderPassValidator *>(renderPass)->getActor();
    Framebuffer *framebufferActor = static_cast<FramebufferValidator *>(fbo)->getActor();

    _actor->beginRenderPass(renderPassActor, framebufferActor, renderArea, colors, depth, stencil, actorSecondaryCBs, secondaryCBCount);
}

void CommandBufferValidator::nextSubpass() {
    CCASSERT(isInited(), "alread destroyed?");

    ++_curSubpass;

    /////////// execute ///////////

    _actor->nextSubpass();
}

void CommandBufferValidator::endRenderPass() {
    CCASSERT(isInited(), "alread destroyed?");

    CCASSERT(_type == CommandBufferType::PRIMARY, "Command 'endRenderPass' must be recorded in primary command buffers.");
    CCASSERT(_insideRenderPass, "No render pass to end?");
    _insideRenderPass = false;

    if (DeviceValidator::getInstance()->isRecording()) {
        _recorder.recordEndRenderPass();
    }

    /////////// execute ///////////

    _actor->endRenderPass();
}

void CommandBufferValidator::execute(CommandBuffer *const *cmdBuffs, uint32_t count) {
    CCASSERT(isInited(), "alread destroyed?");

    if (!count) return; // be more lenient on this for now
    CCASSERT(_type == CommandBufferType::PRIMARY, "Command 'execute' must be recorded in primary command buffers.");

    for (uint32_t i = 0U; i < count; ++i) {
        CCASSERT(cmdBuffs[i] && static_cast<CommandBufferValidator *>(cmdBuffs[i])->isInited(), "already destroyed?");
    }

    /////////// execute ///////////

    static vector<CommandBuffer *> cmdBuffActors;
    cmdBuffActors.resize(count);

    for (uint32_t i = 0U; i < count; ++i) {
        cmdBuffActors[i] = static_cast<CommandBufferValidator *>(cmdBuffs[i])->getActor();
    }

    _actor->execute(cmdBuffActors.data(), count);
}

void CommandBufferValidator::bindPipelineState(PipelineState *pso) {
    CCASSERT(isInited(), "alread destroyed?");
    CCASSERT(pso && static_cast<PipelineStateValidator *>(pso)->isInited(), "already destroyed?");

    _curStates.pipelineState = pso;

    /////////// execute ///////////

    _actor->bindPipelineState(static_cast<PipelineStateValidator *>(pso)->getActor());
}

void CommandBufferValidator::bindDescriptorSet(uint32_t set, DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) {
    CCASSERT(isInited(), "alread destroyed?");
    CCASSERT(descriptorSet && static_cast<DescriptorSetValidator *>(descriptorSet)->isInited(), "already destroyed?");

    CCASSERT(set < DeviceValidator::getInstance()->bindingMappingInfo().setIndices.size(), "invalid set index");
    //CCASSERT(descriptorSet->getLayout()->getDynamicBindings().size() == dynamicOffsetCount, "wrong number of dynamic offsets"); // be more lenient on this

    _curStates.descriptorSets[set] = descriptorSet;
    _curStates.dynamicOffsets[set].assign(dynamicOffsets, dynamicOffsets + dynamicOffsetCount);

    /////////// execute ///////////

    _actor->bindDescriptorSet(set, static_cast<DescriptorSetValidator *>(descriptorSet)->getActor(), dynamicOffsetCount, dynamicOffsets);
}

void CommandBufferValidator::bindInputAssembler(InputAssembler *ia) {
    CCASSERT(isInited(), "alread destroyed?");
    CCASSERT(ia && static_cast<InputAssemblerValidator *>(ia)->isInited(), "already destroyed?");

    _curStates.inputAssembler = ia;

    /////////// execute ///////////

    _actor->bindInputAssembler(static_cast<InputAssemblerValidator *>(ia)->getActor());
}

void CommandBufferValidator::setViewport(const Viewport &vp) {
    CCASSERT(isInited(), "alread destroyed?");

    _curStates.viewport = vp;

    /////////// execute ///////////

    _actor->setViewport(vp);
}

void CommandBufferValidator::setScissor(const Rect &rect) {
    CCASSERT(isInited(), "alread destroyed?");

    _curStates.scissor = rect;

    /////////// execute ///////////

    _actor->setScissor(rect);
}

void CommandBufferValidator::setLineWidth(float width) {
    CCASSERT(isInited(), "alread destroyed?");

    _curStates.lineWidth = width;

    /////////// execute ///////////

    _actor->setLineWidth(width);
}

void CommandBufferValidator::setDepthBias(float constant, float clamp, float slope) {
    CCASSERT(isInited(), "alread destroyed?");

    _curStates.depthBiasConstant = constant;
    _curStates.depthBiasClamp    = clamp;
    _curStates.depthBiasSlope    = slope;

    /////////// execute ///////////

    _actor->setDepthBias(constant, clamp, slope);
}

void CommandBufferValidator::setBlendConstants(const Color &constants) {
    CCASSERT(isInited(), "alread destroyed?");

    _curStates.blendConstant = constants;

    /////////// execute ///////////

    _actor->setBlendConstants(constants);
}

void CommandBufferValidator::setDepthBound(float minBounds, float maxBounds) {
    CCASSERT(isInited(), "alread destroyed?");

    _curStates.depthMinBounds = minBounds;
    _curStates.depthMaxBounds = maxBounds;

    /////////// execute ///////////

    _actor->setDepthBound(minBounds, maxBounds);
}

void CommandBufferValidator::setStencilWriteMask(StencilFace face, uint32_t mask) {
    CCASSERT(isInited(), "alread destroyed?");

    if (hasFlag(face, StencilFace::FRONT)) {
        _curStates.stencilStatesFront.writeMask = mask;
    }
    if (hasFlag(face, StencilFace::BACK)) {
        _curStates.stencilStatesBack.writeMask = mask;
    }

    /////////// execute ///////////

    _actor->setStencilWriteMask(face, mask);
}

void CommandBufferValidator::setStencilCompareMask(StencilFace face, uint32_t ref, uint32_t mask) {
    CCASSERT(isInited(), "alread destroyed?");

    if (hasFlag(face, StencilFace::FRONT)) {
        _curStates.stencilStatesFront.reference   = ref;
        _curStates.stencilStatesFront.compareMask = mask;
    }
    if (hasFlag(face, StencilFace::BACK)) {
        _curStates.stencilStatesBack.reference   = ref;
        _curStates.stencilStatesBack.compareMask = mask;
    }

    /////////// execute ///////////

    _actor->setStencilCompareMask(face, ref, mask);
}

void CommandBufferValidator::draw(const DrawInfo &info) {
    CCASSERT(isInited(), "alread destroyed?");

    CCASSERT(_insideRenderPass, "Command 'draw' must be recorded inside render passes.");

    if (DeviceValidator::getInstance()->isRecording()) {
        _recorder.recordDrawcall(_curStates);
    }

    const auto &psoLayouts = _curStates.pipelineState->getPipelineLayout()->getSetLayouts();
    for (size_t i = 0; i < psoLayouts.size(); ++i) {
        if (!_curStates.descriptorSets[i]) continue; // there may be inactive sets
        const auto &dsBindings  = _curStates.descriptorSets[i]->getLayout()->getBindings();
        const auto &psoBindings = psoLayouts[i]->getBindings();
        CCASSERT(psoBindings.size() == dsBindings.size(), "Descriptor set layout mismatch");
    }

    /////////// execute ///////////

    _actor->draw(info);
}

void CommandBufferValidator::updateBuffer(Buffer *buff, const void *data, uint32_t size) {
    CCASSERT(isInited(), "alread destroyed?");
    CCASSERT(buff && static_cast<BufferValidator *>(buff)->isInited(), "already destroyed?");

    CCASSERT(_type == CommandBufferType::PRIMARY, "Command 'updateBuffer' must be recorded in primary command buffers.");
    CCASSERT(!_insideRenderPass, "Command 'updateBuffer' must be recorded outside render passes.");

    auto *bufferValidator = static_cast<BufferValidator *>(buff);
    bufferValidator->sanityCheck(data, size);

    /////////// execute ///////////

    _actor->updateBuffer(bufferValidator->getActor(), data, size);
}

void CommandBufferValidator::copyBuffersToTexture(const uint8_t *const *buffers, Texture *texture, const BufferTextureCopy *regions, uint32_t count) {
    CCASSERT(isInited(), "alread destroyed?");
    CCASSERT(texture && static_cast<TextureValidator *>(texture)->isInited(), "already destroyed?");

    CCASSERT(_type == CommandBufferType::PRIMARY, "Command 'copyBuffersToTexture' must be recorded in primary command buffers.");
    CCASSERT(!_insideRenderPass, "Command 'copyBuffersToTexture' must be recorded outside render passes.");

    auto *textureValidator = static_cast<TextureValidator *>(texture);
    textureValidator->sanityCheck();

    /////////// execute ///////////

    _actor->copyBuffersToTexture(buffers, textureValidator->getActor(), regions, count);
}

void CommandBufferValidator::blitTexture(Texture *srcTexture, Texture *dstTexture, const TextureBlit *regions, uint32_t count, Filter filter) {
    CCASSERT(isInited(), "alread destroyed?");
    CCASSERT(srcTexture && static_cast<TextureValidator *>(srcTexture)->isInited(), "already destroyed?");
    CCASSERT(dstTexture && static_cast<TextureValidator *>(dstTexture)->isInited(), "already destroyed?");

    CCASSERT(srcTexture->getInfo().samples == SampleCount::ONE, "blit on multisampled texture is not allowed");
    CCASSERT(dstTexture->getInfo().samples == SampleCount::ONE, "blit on multisampled texture is not allowed");

    CCASSERT(!_insideRenderPass, "Command 'blitTexture' must be recorded outside render passes.");

    for (uint32_t i = 0; i < count; ++i) {
        const auto &region = regions[i];
        CCASSERT(region.srcOffset.x + region.srcExtent.width <= srcTexture->getInfo().width, "Invalid src region");
        CCASSERT(region.srcOffset.y + region.srcExtent.height <= srcTexture->getInfo().height, "Invalid src region");
        CCASSERT(region.srcOffset.z + region.srcExtent.depth <= srcTexture->getInfo().depth, "Invalid src region");

        CCASSERT(region.dstOffset.x + region.dstExtent.width <= dstTexture->getInfo().width, "Invalid dst region");
        CCASSERT(region.dstOffset.y + region.dstExtent.height <= dstTexture->getInfo().height, "Invalid dst region");
        CCASSERT(region.dstOffset.z + region.dstExtent.depth <= dstTexture->getInfo().depth, "Invalid dst region");
    }

    /////////// execute ///////////

    Texture *actorSrcTexture = nullptr;
    Texture *actorDstTexture = nullptr;
    if (srcTexture) actorSrcTexture = static_cast<TextureValidator *>(srcTexture)->getActor();
    if (dstTexture) actorDstTexture = static_cast<TextureValidator *>(dstTexture)->getActor();

    _actor->blitTexture(actorSrcTexture, actorDstTexture, regions, count, filter);
}

void CommandBufferValidator::dispatch(const DispatchInfo &info) {
    CCASSERT(isInited(), "alread destroyed?");

    CCASSERT(!_insideRenderPass, "Command 'dispatch' must be recorded outside render passes.");

    /////////// execute ///////////

    DispatchInfo actorInfo = info;
    if (info.indirectBuffer) actorInfo.indirectBuffer = static_cast<BufferValidator *>(info.indirectBuffer)->getActor();

    _actor->dispatch(info);
}

void CommandBufferValidator::pipelineBarrier(const GlobalBarrier *barrier, const TextureBarrier *const *textureBarriers, const Texture *const *textures, uint32_t textureBarrierCount) {
    CCASSERT(isInited(), "alread destroyed?");

    for (uint32_t i = 0U; i < textureBarrierCount; ++i) {
        CCASSERT(textures[i] && static_cast<const TextureValidator *>(textures[i])->isInited(), "already destroyed?");
    }

    /////////// execute ///////////

    static vector<Texture *> textureActors;
    textureActors.resize(textureBarrierCount);

    Texture **actorTextures = nullptr;
    if (textureBarrierCount) {
        actorTextures = textureActors.data();
        for (uint32_t i = 0U; i < textureBarrierCount; ++i) {
            actorTextures[i] = textures[i] ? static_cast<const TextureValidator *>(textures[i])->getActor() : nullptr;
        }
    }

    _actor->pipelineBarrier(barrier, textureBarriers, actorTextures, textureBarrierCount);
}

void CommandBufferValidator::beginQuery(QueryPool *queryPool, uint32_t id) {
    CCASSERT(isInited(), "already destroyed?");
    CCASSERT(static_cast<QueryPoolValidator *>(queryPool)->isInited(), "already destroyed?");

    QueryPool *actorQueryPool = static_cast<QueryPoolValidator *>(queryPool)->getActor();
    _actor->beginQuery(actorQueryPool, id);
}

void CommandBufferValidator::endQuery(QueryPool *queryPool, uint32_t id) {
    CCASSERT(isInited(), "already destroyed?");
    CCASSERT(static_cast<QueryPoolValidator *>(queryPool)->isInited(), "already destroyed?");

    QueryPool *actorQueryPool = static_cast<QueryPoolValidator *>(queryPool)->getActor();
    _actor->endQuery(actorQueryPool, id);
}

void CommandBufferValidator::resetQueryPool(QueryPool *queryPool) {
    CCASSERT(isInited(), "already destroyed?");
    CCASSERT(static_cast<QueryPoolValidator *>(queryPool)->isInited(), "already destroyed?");

    QueryPool *actorQueryPool = static_cast<QueryPoolValidator *>(queryPool)->getActor();
    _actor->resetQueryPool(actorQueryPool);
}

void CommandBufferValidator::completeQueryPool(QueryPool *queryPool) {
    CCASSERT(isInited(), "already destroyed?");
    CCASSERT(static_cast<QueryPoolValidator *>(queryPool)->isInited(), "already destroyed?");

    QueryPool *actorQueryPool = static_cast<QueryPoolValidator *>(queryPool)->getActor();
    _actor->completeQueryPool(actorQueryPool);
}

} // namespace gfx
} // namespace cc
