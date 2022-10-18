#include "VKAccelerationStructure.h"
#include "VKCommands.h"
#include "VKDevice.h"

namespace cc {
namespace gfx {

CCVKAccelerationStructure::CCVKAccelerationStructure() {
    _typedID = generateObjectID<decltype(this)>();
}

CCVKAccelerationStructure::~CCVKAccelerationStructure() {
    destroy();
}

void CCVKAccelerationStructure::doInit(const AccelerationStructureInfo& info) {
    _gpuAccelerationStructure = ccnew CCVKGPUAccelerationStructure;

    if (!info.instances.empty()) {
        _gpuAccelerationStructure->geomtryInfos = info.instances;
    } else if (!info.triangels.empty()) {
        _gpuAccelerationStructure->geomtryInfos = info.triangels;
    } else if (!info.aabbs.empty()) {
        _gpuAccelerationStructure->geomtryInfos = info.aabbs;
    }

    _gpuAccelerationStructure->buildFlags = info.buildFlag;

    cmdFuncCCVKCreateAcclerationStructure(CCVKDevice::getInstance(), _gpuAccelerationStructure); 
}

void CCVKAccelerationStructure::doUpdate() {

    if (!_info.instances.empty()) {
        _gpuAccelerationStructure->geomtryInfos = _info.instances;
    } else if (!_info.triangels.empty()) {
        _gpuAccelerationStructure->geomtryInfos = _info.triangels;
    } else if (!_info.aabbs.empty()) {
        _gpuAccelerationStructure->geomtryInfos = _info.aabbs;
    }

    auto* device = CCVKDevice::getInstance();
    auto* cmdBuf = device->getCommandBuffer();

    cmdBuf->begin();
    cmdBuf->updateAccelerationStructure(this);
    cmdBuf->end();

    device->flushCommands(&cmdBuf, 1);
    device->getQueue()->submit(&cmdBuf, 1);
}

void CCVKAccelerationStructure::doBuild() {

    if (!_info.instances.empty()) {
        _gpuAccelerationStructure->geomtryInfos = _info.instances;
    } else if (!_info.triangels.empty()) {
        _gpuAccelerationStructure->geomtryInfos = _info.triangels;
    } else if (!_info.aabbs.empty()) {
        _gpuAccelerationStructure->geomtryInfos = _info.aabbs;
    }

    auto* device = CCVKDevice::getInstance();
    auto* cmdBuf = device->getCommandBuffer();

    cmdBuf->begin();
    cmdBuf->buildAccelerationStructure(this);
    cmdBuf->end();

    device->flushCommands(&cmdBuf, 1);
    device->getQueue()->submit(&cmdBuf, 1);
    //device->waitAllFences();
}

void CCVKAccelerationStructure::doCompact() {
    auto* device = CCVKDevice::getInstance();
    auto* cmdBuf = device->getCommandBuffer();

    cmdBuf->begin();
    auto* compactedAccel = ccnew CCVKAccelerationStructure;
    compactedAccel->_gpuAccelerationStructure = ccnew CCVKGPUAccelerationStructure;
    cmdBuf->compactAccelerationStructure(this,compactedAccel);
    cmdBuf->end();

    device->flushCommands(&cmdBuf, 1);
    device->getQueue()->submit(&cmdBuf, 1);

    //device->waitAllFences();

    device->gpuRecycleBin()->collect(_gpuAccelerationStructure);
    device->gpuRecycleBin()->collect(_gpuAccelerationStructure->accelStructBackingBuffer);
    //device->waitAllFences();
    _gpuAccelerationStructure->vkAccelerationStructure = compactedAccel->_gpuAccelerationStructure->vkAccelerationStructure;
    _gpuAccelerationStructure->accelStructBackingBuffer = compactedAccel->_gpuAccelerationStructure->accelStructBackingBuffer;

    compactedAccel->_gpuAccelerationStructure->vkAccelerationStructure = VK_NULL_HANDLE;
    compactedAccel->_gpuAccelerationStructure->accelStructBackingBuffer = VK_NULL_HANDLE;

    compactedAccel->destroy();
}

void CCVKAccelerationStructure::doDestroy() {
    _gpuAccelerationStructure = nullptr;
}

void CCVKGPUAccelerationStructure::shutdown() {
    if (vkCompactedSizeQueryPool) {
        vkDestroyQueryPool(CCVKDevice::getInstance()->gpuDevice()->vkDevice, vkCompactedSizeQueryPool, nullptr);
    }
    vkCompactedSizeQueryPool = VK_NULL_HANDLE;
    CCVKDevice::getInstance()->gpuRecycleBin()->collect(this);
    if (instancesBuffer) {
        CCVKDevice::getInstance()->gpuRecycleBin()->collect(instancesBuffer);
    }
    if (scratchBuffer) {
        CCVKDevice::getInstance()->gpuRecycleBin()->collect(scratchBuffer);
    }
    if (accelStructBackingBuffer) {
        CCVKDevice::getInstance()->gpuRecycleBin()->collect(accelStructBackingBuffer);
    }
    if (aabbsBuffer) {
        CCVKDevice::getInstance()->gpuRecycleBin()->collect(aabbsBuffer);
    }
}


} // namespace gfx
} //namespace cc
