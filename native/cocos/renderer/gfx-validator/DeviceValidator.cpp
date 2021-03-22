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

#include "BufferValidator.h"
#include "CommandBufferValidator.h"
#include "DescriptorSetLayoutValidator.h"
#include "DescriptorSetValidator.h"
#include "DeviceValidator.h"
#include "FramebufferValidator.h"
#include "InputAssemblerValidator.h"
#include "PipelineLayoutValidator.h"
#include "PipelineStateValidator.h"
#include "QueueValidator.h"
#include "RenderPassValidator.h"
#include "SamplerValidator.h"
#include "ShaderValidator.h"
#include "TextureValidator.h"

namespace cc {
namespace gfx {

DeviceValidator *DeviceValidator::_instance = nullptr;

DeviceValidator *DeviceValidator::getInstance() {
    return DeviceValidator::_instance;
}

DeviceValidator::DeviceValidator(Device *device) : Agent(device) {
    DeviceValidator::_instance = this;
}

DeviceValidator::~DeviceValidator() {
    CC_SAFE_DELETE(_actor);
    DeviceValidator::_instance = nullptr;
}

bool DeviceValidator::doInit(const DeviceInfo &info) {
    if (!_actor->initialize(info)) {
        return false;
    }

    _context                                     = _actor->getContext();
    _API                                         = _actor->getGfxAPI();
    _deviceName                                  = _actor->getDeviceName();
    _queue                                       = CC_NEW(QueueValidator(_actor->getQueue()));
    _cmdBuff                                     = CC_NEW(CommandBufferValidator(_actor->getCommandBuffer()));
    static_cast<CommandBufferValidator *>(_cmdBuff)->_queue = _queue;
    _renderer                                    = _actor->getRenderer();
    _vendor                                      = _actor->getVendor();
    _caps                                        = _actor->_caps;
    memcpy(_features, _actor->_features, static_cast<uint>(Feature::COUNT) * sizeof(bool));

    CC_LOG_INFO("Device validator enabled.");

    return true;
}

void DeviceValidator::doDestroy() {
    if (_cmdBuff) {
        static_cast<CommandBufferValidator *>(_cmdBuff)->_actor = nullptr;
        CC_DELETE(_cmdBuff);
        _cmdBuff = nullptr;
    }
    if (_queue) {
        static_cast<QueueValidator *>(_queue)->_actor = nullptr;
        CC_DELETE(_queue);
        _queue = nullptr;
    }

    _actor->destroy();
}

void DeviceValidator::resize(uint width, uint height) {
    _actor->resize(width, height);
}

void DeviceValidator::acquire() {
    _actor->acquire();
}

void DeviceValidator::present() {
    _actor->present();
}

void DeviceValidator::setMultithreaded(bool multithreaded) {
    _actor->setMultithreaded(multithreaded);
}

CommandBuffer *DeviceValidator::createCommandBuffer(const CommandBufferInfo &info, bool hasAgent) {
    CommandBuffer *actor = _actor->createCommandBuffer(info, hasAgent);
    return CC_NEW(CommandBufferValidator(actor));
}

Queue *DeviceValidator::createQueue() {
    Queue *actor = _actor->createQueue();
    return CC_NEW(QueueValidator(actor));
}

Buffer *DeviceValidator::createBuffer() {
    Buffer *actor = _actor->createBuffer();
    return CC_NEW(BufferValidator(actor));
}

Texture *DeviceValidator::createTexture() {
    Texture *actor = _actor->createTexture();
    return CC_NEW(TextureValidator(actor));
}

Sampler *DeviceValidator::createSampler() {
    Sampler *actor = _actor->createSampler();
    return CC_NEW(SamplerValidator(actor));
}

Shader *DeviceValidator::createShader() {
    Shader *actor = _actor->createShader();
    return CC_NEW(ShaderValidator(actor));
}

InputAssembler *DeviceValidator::createInputAssembler() {
    InputAssembler *actor = _actor->createInputAssembler();
    return CC_NEW(InputAssemblerValidator(actor));
}

RenderPass *DeviceValidator::createRenderPass() {
    RenderPass *actor = _actor->createRenderPass();
    return CC_NEW(RenderPassValidator(actor));
}

Framebuffer *DeviceValidator::createFramebuffer() {
    Framebuffer *actor = _actor->createFramebuffer();
    return CC_NEW(FramebufferValidator(actor));
}

DescriptorSet *DeviceValidator::createDescriptorSet() {
    DescriptorSet *actor = _actor->createDescriptorSet();
    return CC_NEW(DescriptorSetValidator(actor));
}

DescriptorSetLayout *DeviceValidator::createDescriptorSetLayout() {
    DescriptorSetLayout *actor = _actor->createDescriptorSetLayout();
    return CC_NEW(DescriptorSetLayoutValidator(actor));
}

PipelineLayout *DeviceValidator::createPipelineLayout() {
    PipelineLayout *actor = _actor->createPipelineLayout();
    return CC_NEW(PipelineLayoutValidator(actor));
}

PipelineState *DeviceValidator::createPipelineState() {
    PipelineState *actor = _actor->createPipelineState();
    return CC_NEW(PipelineStateValidator(actor));
}

GlobalBarrier *DeviceValidator::createGlobalBarrier() {
    return _actor->createGlobalBarrier();
}

TextureBarrier *DeviceValidator::createTextureBarrier() {
    return _actor->createTextureBarrier();
}

void DeviceValidator::copyBuffersToTexture(const uint8_t *const *buffers, Texture *dst, const BufferTextureCopy *regions, uint count) {
    _actor->copyBuffersToTexture(buffers, static_cast<TextureValidator *>(dst)->getActor(), regions, count);
}

void DeviceValidator::flushCommands(CommandBuffer *const *cmdBuffs, uint count) {
    if (!count) return;

    static vector<CommandBuffer *> cmdBuffActors;
    cmdBuffActors.resize(count);

    for (uint i = 0u; i < count; ++i) {
        cmdBuffActors[i] = static_cast<CommandBufferValidator *>(cmdBuffs[i])->getActor();
    }

    _actor->flushCommands(cmdBuffActors.data(), count);
}

} // namespace gfx
} // namespace cc
