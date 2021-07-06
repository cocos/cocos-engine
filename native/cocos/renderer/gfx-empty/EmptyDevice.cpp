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

#include "EmptyBuffer.h"
#include "EmptyCommandBuffer.h"
#include "EmptyContext.h"
#include "EmptyDescriptorSet.h"
#include "EmptyDescriptorSetLayout.h"
#include "EmptyDevice.h"
#include "EmptyFramebuffer.h"
#include "EmptyInputAssembler.h"
#include "EmptyPipelineLayout.h"
#include "EmptyPipelineState.h"
#include "EmptyQueue.h"
#include "EmptyRenderPass.h"
#include "EmptySampler.h"
#include "EmptyShader.h"
#include "EmptyTexture.h"

namespace cc {
namespace gfx {

EmptyDevice *EmptyDevice::instance = nullptr;

EmptyDevice *EmptyDevice::getInstance() {
    return EmptyDevice::instance;
}

EmptyDevice::EmptyDevice() {
    EmptyDevice::instance = this;
}

EmptyDevice::~EmptyDevice() {
    EmptyDevice::instance = nullptr;
}

bool EmptyDevice::doInit(const DeviceInfo & /*info*/) {
    ContextInfo ctxInfo;
    ctxInfo.windowHandle = _windowHandle;

    _context = CC_NEW(EmptyContext);
    if (!_context->initialize(ctxInfo)) {
        destroy();
        return false;
    }

    QueueInfo queueInfo;
    queueInfo.type = QueueType::GRAPHICS;
    _queue         = createQueue(queueInfo);

    CommandBufferInfo cmdBuffInfo;
    cmdBuffInfo.type  = CommandBufferType::PRIMARY;
    cmdBuffInfo.queue = _queue;
    _cmdBuff          = createCommandBuffer(cmdBuffInfo);

    CC_LOG_INFO("Empty device initialized.");
    CC_LOG_INFO("SCREEN_SIZE: %d x %d", _width, _height);

    return true;
}

void EmptyDevice::doDestroy() {
    CC_SAFE_DESTROY(_cmdBuff);
    CC_SAFE_DESTROY(_queue);
    CC_SAFE_DESTROY(_context);
}

void EmptyDevice::resize(uint width, uint height) {
    _width  = width;
    _height = height;
}

void EmptyDevice::acquire() {
}

void EmptyDevice::present() {
    std::this_thread::sleep_for(std::chrono::milliseconds(16));
}

CommandBuffer *EmptyDevice::createCommandBuffer(const CommandBufferInfo & /*info*/, bool /*hasAgent*/) {
    return CC_NEW(EmptyCommandBuffer());
}

Queue *EmptyDevice::createQueue() {
    return CC_NEW(EmptyQueue());
}

Buffer *EmptyDevice::createBuffer() {
    return CC_NEW(EmptyBuffer());
}

Texture *EmptyDevice::createTexture() {
    return CC_NEW(EmptyTexture());
}

Sampler *EmptyDevice::createSampler() {
    return CC_NEW(EmptySampler());
}

Shader *EmptyDevice::createShader() {
    return CC_NEW(EmptyShader());
}

InputAssembler *EmptyDevice::createInputAssembler() {
    return CC_NEW(EmptyInputAssembler());
}

RenderPass *EmptyDevice::createRenderPass() {
    return CC_NEW(EmptyRenderPass());
}

Framebuffer *EmptyDevice::createFramebuffer() {
    return CC_NEW(EmptyFramebuffer());
}

DescriptorSet *EmptyDevice::createDescriptorSet() {
    return CC_NEW(EmptyDescriptorSet());
}

DescriptorSetLayout *EmptyDevice::createDescriptorSetLayout() {
    return CC_NEW(EmptyDescriptorSetLayout());
}

PipelineLayout *EmptyDevice::createPipelineLayout() {
    return CC_NEW(EmptyPipelineLayout());
}

PipelineState *EmptyDevice::createPipelineState() {
    return CC_NEW(EmptyPipelineState());
}

GlobalBarrier *EmptyDevice::createGlobalBarrier() {
    return CC_NEW(GlobalBarrier());
}

TextureBarrier *EmptyDevice::createTextureBarrier() {
    return CC_NEW(TextureBarrier());
}

void EmptyDevice::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
}

} // namespace gfx
} // namespace cc
