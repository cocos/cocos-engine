/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "GLES3Std.h"

#include "GLES3GPUObjects.h"
#include "GLES3GlobalBarrier.h"

namespace cc {
namespace gfx {

GLES3GlobalBarrier::GLES3GlobalBarrier(Device *device)
: GlobalBarrier(device) {
}

GLES3GlobalBarrier::~GLES3GlobalBarrier() {
    CC_SAFE_DELETE(_gpuBarrier);
}

bool GLES3GlobalBarrier::initialize(const GlobalBarrierInfo &info) {
    _info = info;

    _gpuBarrier = CC_NEW(GLES3GPUGlobalBarrier);

    bool hasShaderWrites = false;
    for (size_t i = 0u; i < info.prevAccesses.size(); ++i) {
        switch (info.prevAccesses[i]) {
            case AccessType::COMPUTE_SHADER_WRITE:
            case AccessType::VERTEX_SHADER_WRITE:
            case AccessType::FRAGMENT_SHADER_WRITE:
            case AccessType::COLOR_ATTACHMENT_WRITE:
            case AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE:
                hasShaderWrites = true;
                break;
            default:
                break;
        }
    }

    if (hasShaderWrites) {
        for (size_t i = 0u; i < info.nextAccesses.size(); ++i) {
            switch (info.nextAccesses[i]) {
                case AccessType::INDIRECT_BUFFER:
                    _gpuBarrier->glBarriers |= GL_COMMAND_BARRIER_BIT;
                    break;
                case AccessType::INDEX_BUFFER:
                    _gpuBarrier->glBarriers |= GL_ELEMENT_ARRAY_BARRIER_BIT;
                    break;
                case AccessType::VERTEX_BUFFER:
                    _gpuBarrier->glBarriers |= GL_VERTEX_ATTRIB_ARRAY_BARRIER_BIT;
                    break;
                case AccessType::COMPUTE_SHADER_READ_UNIFORM_BUFFER:
                case AccessType::VERTEX_SHADER_READ_UNIFORM_BUFFER:
                case AccessType::FRAGMENT_SHADER_READ_UNIFORM_BUFFER:
                    _gpuBarrier->glBarriersByRegion |= GL_UNIFORM_BARRIER_BIT;
                    break;
                case AccessType::COMPUTE_SHADER_READ_TEXTURE:
                case AccessType::VERTEX_SHADER_READ_TEXTURE:
                case AccessType::FRAGMENT_SHADER_READ_TEXTURE:
                case AccessType::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT:
                case AccessType::FRAGMENT_SHADER_READ_DEPTH_STENCIL_INPUT_ATTACHMENT:
                    _gpuBarrier->glBarriersByRegion |= GL_SHADER_IMAGE_ACCESS_BARRIER_BIT;
                    _gpuBarrier->glBarriersByRegion |= GL_TEXTURE_FETCH_BARRIER_BIT;
                    break;
                case AccessType::COMPUTE_SHADER_READ_OTHER:
                case AccessType::VERTEX_SHADER_READ_OTHER:
                case AccessType::FRAGMENT_SHADER_READ_OTHER:
                    _gpuBarrier->glBarriersByRegion |= GL_SHADER_STORAGE_BARRIER_BIT;
                    break;
                case AccessType::COLOR_ATTACHMENT_READ:
                case AccessType::DEPTH_STENCIL_ATTACHMENT_READ:
                    _gpuBarrier->glBarriersByRegion |= GL_FRAMEBUFFER_BARRIER_BIT;
                    break;
                case AccessType::TRANSFER_READ:
                    _gpuBarrier->glBarriersByRegion |= GL_FRAMEBUFFER_BARRIER_BIT;
                    _gpuBarrier->glBarriers |= GL_TEXTURE_UPDATE_BARRIER_BIT;
                    _gpuBarrier->glBarriers |= GL_BUFFER_UPDATE_BARRIER_BIT;
                    _gpuBarrier->glBarriers |= GL_PIXEL_BUFFER_BARRIER_BIT;
                    break;
                case AccessType::COMPUTE_SHADER_WRITE:
                case AccessType::VERTEX_SHADER_WRITE:
                case AccessType::FRAGMENT_SHADER_WRITE:
                    _gpuBarrier->glBarriersByRegion |= GL_SHADER_IMAGE_ACCESS_BARRIER_BIT;
                    _gpuBarrier->glBarriersByRegion |= GL_SHADER_STORAGE_BARRIER_BIT;
                    break;
                case AccessType::COLOR_ATTACHMENT_WRITE:
                case AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE:
                    _gpuBarrier->glBarriersByRegion |= GL_FRAMEBUFFER_BARRIER_BIT;
                    break;
                case AccessType::TRANSFER_WRITE:
                    _gpuBarrier->glBarriersByRegion |= GL_FRAMEBUFFER_BARRIER_BIT;
                    _gpuBarrier->glBarriers |= GL_TEXTURE_UPDATE_BARRIER_BIT;
                    _gpuBarrier->glBarriers |= GL_BUFFER_UPDATE_BARRIER_BIT;
                    _gpuBarrier->glBarriers |= GL_PIXEL_BUFFER_BARRIER_BIT;
                    break;
                case AccessType::HOST_PREINITIALIZED:
                case AccessType::HOST_WRITE:
                case AccessType::PRESENT:
                default:
                    break;
            }
        }
    }

    return true;
}

} // namespace gfx
} // namespace cc
