#pragma once

#include "CoreStd.h"

#include "base/CachedArray.h"
#include "base/StringUtil.h"

#include "threading/ThreadPool.h"
#include "threading/CommandEncoder.h"

#include "gfx/GFXDevice.h"
#include "gfx/GFXContext.h"
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
#include "gfx/GFXCommand.h"
#include "gfx/GFXCommandPool.h"

#include "gfx-proxy/GFXDeviceProxy.h"
#include "gfx-proxy/GFXBufferProxy.h"
#include "gfx-proxy/GFXTextureProxy.h"
#include "gfx-proxy/GFXShaderProxy.h"
#include "gfx-proxy/GFXRenderPassProxy.h"
#include "gfx-proxy/GFXFramebufferProxy.h"
#include "gfx-proxy/GFXInputAssemblerProxy.h"
#include "gfx-proxy/GFXPipelineStateProxy.h"
#include "gfx-proxy/GFXDescriptorSetProxy.h"
#include "gfx-proxy/GFXCommandBufferProxy.h"
#include "gfx-proxy/GFXQueueProxy.h"

#define CC_JOB_SYSTEM_TASKFLOW 1
#define CC_JOB_SYSTEM_TBB 2

#define CC_JOB_SYSTEM CC_JOB_SYSTEM_TASKFLOW
