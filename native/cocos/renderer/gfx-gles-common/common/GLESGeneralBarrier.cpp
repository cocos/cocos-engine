#include "GLESGeneralBarrier.h"
#include "GLESDevice.h"
#include "GLESCommands.h"

namespace cc::gfx {

GLESGeneralBarrier::GLESGeneralBarrier(const GeneralBarrierInfo &info) : GeneralBarrier(info) {
    _typedID = generateObjectID<decltype(this)>();

    _gpuBarrier = ccnew GLESGPUGeneralBarrier;
    _gpuBarrier->prevAccesses = info.prevAccesses;
    _gpuBarrier->nextAccesses = info.nextAccesses;

    glesCreateGeneralBarrier(GLESDevice::getInstance(), _gpuBarrier);
}

GLESGeneralBarrier::~GLESGeneralBarrier() {
    _gpuBarrier = nullptr;
}

} // namespace cc::gfx
