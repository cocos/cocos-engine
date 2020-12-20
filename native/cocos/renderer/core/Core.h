#pragma once

#include "CoreStd.h"

#include "base/CachedArray.h"
#include "base/StringUtil.h"

#include "threading/CommandEncoder.h"
#include "threading/ThreadPool.h"

#include "gfx/GFXBuffer.h"
#include "gfx/GFXCommand.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXCommandPool.h"
#include "gfx/GFXContext.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDescriptorSetLayout.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXFence.h"
#include "gfx/GFXFramebuffer.h"
#include "gfx/GFXInputAssembler.h"
#include "gfx/GFXPipelineLayout.h"
#include "gfx/GFXPipelineState.h"
#include "gfx/GFXQueue.h"
#include "gfx/GFXRenderPass.h"
#include "gfx/GFXSampler.h"
#include "gfx/GFXShader.h"
#include "gfx/GFXTexture.h"

#include "gfx-agent/GFXBufferAgent.h"
#include "gfx-agent/GFXCommandBufferAgent.h"
#include "gfx-agent/GFXDescriptorSetAgent.h"
#include "gfx-agent/GFXDeviceAgent.h"
#include "gfx-agent/GFXFramebufferAgent.h"
#include "gfx-agent/GFXInputAssemblerAgent.h"
#include "gfx-agent/GFXPipelineStateAgent.h"
#include "gfx-agent/GFXQueueAgent.h"
#include "gfx-agent/GFXRenderPassAgent.h"
#include "gfx-agent/GFXShaderAgent.h"
#include "gfx-agent/GFXTextureAgent.h"

#define CC_JOB_SYSTEM_TASKFLOW 1
#define CC_JOB_SYSTEM_TBB      2

#define CC_JOB_SYSTEM CC_JOB_SYSTEM_TASKFLOW
