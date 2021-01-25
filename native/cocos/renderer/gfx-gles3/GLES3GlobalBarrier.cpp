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
                    _gpuBarrier->glBarriers |= GL_TEXTURE_UPDATE_BARRIER_BIT;
                    _gpuBarrier->glBarriers |= GL_BUFFER_UPDATE_BARRIER_BIT;
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
