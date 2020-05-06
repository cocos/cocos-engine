#include "VKStd.h"
#include "VKCommandBuffer.h"
#include "VKCommands.h"
#include "VKCommandAllocator.h"
#include "VKFramebuffer.h"

#include "VKPipelineState.h"
#include "VKBindingLayout.h"
#include "VKInputAssembler.h"

NS_CC_BEGIN

CCVKCommandBuffer::CCVKCommandBuffer(GFXDevice* device)
    : GFXCommandBuffer(device)
{
}

CCVKCommandBuffer::~CCVKCommandBuffer()
{
}

bool CCVKCommandBuffer::initialize(const GFXCommandBufferInfo& info)
{
    if (!info.allocator)
    {
        return false;
    }

    _allocator = info.allocator;
    _type = info.type;

    _gpuCommandBuffer = CC_NEW(CCVKGPUCommandBuffer);
    _gpuCommandBuffer->type = _type;
    _gpuCommandBuffer->commandPool = ((CCVKCommandAllocator*)_allocator)->gpuCommandPool();
    CCVKCmdFuncAllocateCommandBuffer((CCVKDevice*)_device, _gpuCommandBuffer);

    _status = GFXStatus::SUCCESS;
    return true;
}

void CCVKCommandBuffer::destroy()
{
    if (_gpuCommandBuffer)
    {
        CCVKCmdFuncFreeCommandBuffer((CCVKDevice*)_device, _gpuCommandBuffer);
        CC_DELETE(_gpuCommandBuffer);
        _gpuCommandBuffer = nullptr;
    }

    _allocator = nullptr;
    _status = GFXStatus::UNREADY;
}

void CCVKCommandBuffer::begin()
{
    _curGPUPipelineState = nullptr;
    _curGPUBlendLayout = nullptr;
    _curGPUInputAssember = nullptr;
    _numDrawCalls = 0;
    _numInstances = 0;
    _numTriangles = 0;

    VkCommandBufferBeginInfo beginInfo{ VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO };
    beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;

    if (_type == GFXCommandBufferType::SECONDARY)
    {
        VkCommandBufferInheritanceInfo inheritance{ VK_STRUCTURE_TYPE_COMMAND_BUFFER_INHERITANCE_INFO };
        // TODO
        //beginInfo.pInheritanceInfo = &inheritance;
    }

    VK_CHECK(vkBeginCommandBuffer(_gpuCommandBuffer->vkCommandBuffer, &beginInfo));
}

void CCVKCommandBuffer::end()
{
    if (_isStateInvalid)
    {
        BindStates();
    }
    _curGPUFBO = nullptr;

    VK_CHECK(vkEndCommandBuffer(_gpuCommandBuffer->vkCommandBuffer));
}

void CCVKCommandBuffer::beginRenderPass(GFXFramebuffer* fbo, const GFXRect& renderArea,
    GFXClearFlags clearFlags, const std::vector<GFXColor>& colors, float depth, int stencil)
{
    _curGPUFBO = ((CCVKFramebuffer*)fbo)->gpuFBO();
    auto &renderPass = _curGPUFBO->isOffscreen ? _curGPUFBO->gpuRenderPass : _curGPUFBO->swapchain->renderPass;
    auto &barriers = renderPass->beginBarriers;
    auto &clearValues = renderPass->clearValues;
    auto attachmentCount = barriers.size();

    if (attachmentCount)
    {
        for (uint32_t i = 0u; i < attachmentCount - 1; i++)
        {
            barriers[i].image = _curGPUFBO->isOffscreen ? _curGPUFBO->gpuColorViews[i]->gpuTexture->vkImage :
                _curGPUFBO->swapchain->swapchainImages[_curGPUFBO->swapchain->curImageIndex];
            clearValues[i].color = { colors[i].r, colors[i].g, colors[i].b, colors[i].a };
        }
        barriers[attachmentCount - 1].image = _curGPUFBO->isOffscreen ? _curGPUFBO->gpuDepthStencilView->gpuTexture->vkImage :
            _curGPUFBO->swapchain->depthStencilImages[_curGPUFBO->swapchain->curImageIndex];
        clearValues[attachmentCount - 1].depthStencil = { depth, (uint32_t)stencil };

        vkCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer, VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT,
            VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT | VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT,
            VK_DEPENDENCY_BY_REGION_BIT, 0, nullptr, 0, nullptr, barriers.size(), barriers.data());
    }

    VkRenderPassBeginInfo passBeginInfo{ VK_STRUCTURE_TYPE_RENDER_PASS_BEGIN_INFO };
    passBeginInfo.renderPass = _curGPUFBO->gpuRenderPass->vkRenderPass;
    passBeginInfo.framebuffer = _curGPUFBO->isOffscreen ? _curGPUFBO->vkFramebuffer :
        _curGPUFBO->swapchain->vkSwapchainFramebuffers[_curGPUFBO->swapchain->curImageIndex];
    passBeginInfo.renderArea.extent.width = renderArea.width;
    passBeginInfo.renderArea.extent.height = renderArea.height;
    passBeginInfo.clearValueCount = clearValues.size();
    passBeginInfo.pClearValues = clearValues.data();

    vkCmdBeginRenderPass(_gpuCommandBuffer->vkCommandBuffer, &passBeginInfo, VK_SUBPASS_CONTENTS_INLINE);

    VkViewport viewport{ (float)renderArea.x, (float)(renderArea.height - renderArea.y), (float)renderArea.width, -(float)renderArea.height, 0, 1 };
    vkCmdSetViewport(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &viewport);

    VkRect2D scissor{ { renderArea.x, renderArea.y }, { renderArea.width, renderArea.height } };
    vkCmdSetScissor(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &scissor);
}

void CCVKCommandBuffer::endRenderPass()
{
    vkCmdEndRenderPass(_gpuCommandBuffer->vkCommandBuffer);

    auto &renderPass = _curGPUFBO->isOffscreen ? _curGPUFBO->gpuRenderPass : _curGPUFBO->swapchain->renderPass;
    auto &barriers = renderPass->endBarriers;
    auto attachmentCount = barriers.size();

    if (attachmentCount)
    {
        for (uint32_t i = 0u; i < attachmentCount - 1; i++)
        {
            barriers[i].image = _curGPUFBO->isOffscreen ? _curGPUFBO->gpuColorViews[i]->gpuTexture->vkImage :
                _curGPUFBO->swapchain->swapchainImages[_curGPUFBO->swapchain->curImageIndex];
        }
        barriers[attachmentCount - 1].image = _curGPUFBO->isOffscreen ? _curGPUFBO->gpuDepthStencilView->gpuTexture->vkImage :
            _curGPUFBO->swapchain->depthStencilImages[_curGPUFBO->swapchain->curImageIndex];

        vkCmdPipelineBarrier(_gpuCommandBuffer->vkCommandBuffer,
            VK_PIPELINE_STAGE_COLOR_ATTACHMENT_OUTPUT_BIT | VK_PIPELINE_STAGE_EARLY_FRAGMENT_TESTS_BIT,
            VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT, VK_DEPENDENCY_BY_REGION_BIT,
            0, nullptr, 0, nullptr, barriers.size(), barriers.data());
    }

    _curGPUFBO = nullptr;
}

void CCVKCommandBuffer::bindPipelineState(GFXPipelineState* pso)
{
    _curGPUPipelineState = ((CCVKPipelineState*)pso)->gpuPipelineState();
    vkCmdBindPipeline(_gpuCommandBuffer->vkCommandBuffer, VK_PIPELINE_BIND_POINT_GRAPHICS, _curGPUPipelineState->vkPipeline);
    _isStateInvalid = true;
}

void CCVKCommandBuffer::bindBindingLayout(GFXBindingLayout* layout)
{
    _curGPUBlendLayout = ((CCVKBindingLayout*)layout)->gpuBindingLayout();
    _isStateInvalid = true;
}

void CCVKCommandBuffer::bindInputAssembler(GFXInputAssembler* ia)
{
    auto gpuInputAssembler = ((CCVKInputAssembler*)ia)->gpuInputAssembler();

    vkCmdBindVertexBuffers(_gpuCommandBuffer->vkCommandBuffer, 0, gpuInputAssembler->vertexBuffers.size(),
        gpuInputAssembler->vertexBuffers.data(), gpuInputAssembler->vertexBufferOffsets.data());

    if (gpuInputAssembler->gpuIndexBuffer)
    {
        vkCmdBindIndexBuffer(_gpuCommandBuffer->vkCommandBuffer, gpuInputAssembler->gpuIndexBuffer->vkBuffer, 0,
            gpuInputAssembler->gpuIndexBuffer->stride == 32 ? VK_INDEX_TYPE_UINT32 : VK_INDEX_TYPE_UINT16);
    }
}

void CCVKCommandBuffer::setViewport(const GFXViewport& vp)
{
    if (_curViewport != vp)
    {
        _curViewport = vp;
        VkViewport viewport{ (float)vp.left, (float)vp.top, (float)vp.width, (float)vp.height, vp.minDepth, vp.maxDepth };
        vkCmdSetViewport(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &viewport);
    }
}

void CCVKCommandBuffer::setScissor(const GFXRect& rect)
{
    if (_curScissor != rect)
    {
        _curScissor = rect;
        VkRect2D scissor{ { rect.x, rect.y }, { rect.width, rect.height } };
        vkCmdSetScissor(_gpuCommandBuffer->vkCommandBuffer, 0, 1, &scissor);
    }
}

void CCVKCommandBuffer::setLineWidth(const float width)
{
    if (math::IsNotEqualF(_curLineWidth, width))
    {
        _curLineWidth = width;
        vkCmdSetLineWidth(_gpuCommandBuffer->vkCommandBuffer, width);
    }
}

void CCVKCommandBuffer::setDepthBias(float constant, float clamp, float slope)
{
    if (math::IsNotEqualF(_curDepthBias.constant, constant) ||
        math::IsNotEqualF(_curDepthBias.clamp, clamp) ||
        math::IsNotEqualF(_curDepthBias.slope, slope))
    {
        _curDepthBias.constant = constant;
        _curDepthBias.clamp = clamp;
        _curDepthBias.slope = slope;
        vkCmdSetDepthBias(_gpuCommandBuffer->vkCommandBuffer, constant, clamp, slope);
    }
}

void CCVKCommandBuffer::setBlendConstants(const GFXColor& constants)
{
    if (math::IsNotEqualF(_curBlendConstants.r, constants.r) ||
        math::IsNotEqualF(_curBlendConstants.g, constants.g) ||
        math::IsNotEqualF(_curBlendConstants.b, constants.b) ||
        math::IsNotEqualF(_curBlendConstants.a, constants.a))
    {
        _curBlendConstants.r = constants.r;
        _curBlendConstants.g = constants.g;
        _curBlendConstants.b = constants.b;
        _curBlendConstants.a = constants.a;
        vkCmdSetBlendConstants(_gpuCommandBuffer->vkCommandBuffer, reinterpret_cast<const float*>(&constants));
    }
}

void CCVKCommandBuffer::setDepthBound(float minBounds, float maxBounds)
{
    if (math::IsNotEqualF(_curDepthBounds.minBounds, minBounds) ||
        math::IsNotEqualF(_curDepthBounds.maxBounds, maxBounds))
    {
        _curDepthBounds.minBounds = minBounds;
        _curDepthBounds.maxBounds = maxBounds;
        vkCmdSetDepthBounds(_gpuCommandBuffer->vkCommandBuffer, minBounds, maxBounds);
    }
}

void CCVKCommandBuffer::setStencilWriteMask(GFXStencilFace face, uint mask)
{
    if ((_curStencilWriteMask.face != face) ||
        (_curStencilWriteMask.write_mask != mask))
    {
        _curStencilWriteMask.face = face;
        _curStencilWriteMask.write_mask = mask;
        vkCmdSetStencilWriteMask(_gpuCommandBuffer->vkCommandBuffer,
            face == GFXStencilFace::FRONT ? VK_STENCIL_FACE_FRONT_BIT : VK_STENCIL_FACE_BACK_BIT, mask);
    }
}

void CCVKCommandBuffer::setStencilCompareMask(GFXStencilFace face, int reference, uint mask)
{
    if ((_curStencilCompareMask.face != face) ||
        (_curStencilCompareMask.reference != reference) ||
        (_curStencilCompareMask.compareMask != mask))
    {
        _curStencilCompareMask.face = face;
        _curStencilCompareMask.reference = reference;
        _curStencilCompareMask.compareMask = mask;

        VkStencilFaceFlagBits vkFace = (face == GFXStencilFace::FRONT ? VK_STENCIL_FACE_FRONT_BIT : VK_STENCIL_FACE_BACK_BIT);
        vkCmdSetStencilReference(_gpuCommandBuffer->vkCommandBuffer, vkFace, reference);
        vkCmdSetStencilCompareMask(_gpuCommandBuffer->vkCommandBuffer, vkFace, mask);
    }
}

void CCVKCommandBuffer::draw(GFXInputAssembler* ia)
{
    if ((_type == GFXCommandBufferType::PRIMARY && _curGPUFBO) ||
        (_type == GFXCommandBufferType::SECONDARY))
    {
        if (_isStateInvalid)
        {
            BindStates();
        }

        CCVKGPUInputAssembler* gpuInputAssembler = ((CCVKInputAssembler*)ia)->gpuInputAssembler();
        GFXDrawInfo drawInfo;

        if (gpuInputAssembler->gpuIndirectBuffer)
        {
            // TODO
        }
        else
        {
            ((CCVKInputAssembler*)ia)->extractDrawInfo(drawInfo);

            if (gpuInputAssembler->gpuIndexBuffer && drawInfo.indexCount >= 0)
            {
                vkCmdDrawIndexed(_gpuCommandBuffer->vkCommandBuffer, drawInfo.indexCount, std::max(drawInfo.instanceCount, 1u),
                    drawInfo.firstIndex, drawInfo.vertexOffset, drawInfo.firstInstance);
            }
            else
            {
                vkCmdDraw(_gpuCommandBuffer->vkCommandBuffer, drawInfo.vertexCount, std::max(drawInfo.instanceCount, 1u),
                    drawInfo.firstVertex, drawInfo.firstInstance);
            }
        }
    }
    else
    {
        CC_LOG_ERROR("Command 'draw' must be recorded inside a render pass.");
    }
}

void CCVKCommandBuffer::updateBuffer(GFXBuffer* buff, void* data, uint size, uint offset)
{
    if ((_type == GFXCommandBufferType::PRIMARY && _curGPUFBO) ||
        (_type == GFXCommandBufferType::SECONDARY))
    {
    }
    else
    {
        CC_LOG_ERROR("Command 'updateBuffer' must be recorded inside a render pass.");
    }
}

void CCVKCommandBuffer::copyBufferToTexture(GFXBuffer* src, GFXTexture* dst, GFXTextureLayout layout, const GFXBufferTextureCopyList& regions)
{
    if ((_type == GFXCommandBufferType::PRIMARY && _curGPUFBO) ||
        (_type == GFXCommandBufferType::SECONDARY))
    {
    }
    else
    {
        CC_LOG_ERROR("Command 'copyBufferToTexture' must be recorded inside a render pass.");
    }
}

void CCVKCommandBuffer::execute(const std::vector<GFXCommandBuffer*>& cmd_buffs, uint32_t count)
{
    for (uint i = 0; i < count; ++i)
    {
        CCVKCommandBuffer* cmd_buff = (CCVKCommandBuffer*)cmd_buffs[i];

        _numDrawCalls += cmd_buff->getNumDrawCalls();
        _numInstances += cmd_buff->getNumInstances();
        _numTriangles += cmd_buff->getNumTris();
    }
}

void CCVKCommandBuffer::BindStates()
{
    _isStateInvalid = false;
}

NS_CC_END
