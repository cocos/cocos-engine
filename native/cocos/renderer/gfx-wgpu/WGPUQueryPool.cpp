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

#include "WGPUQueryPool.h"
#include "WGPUCommandBuffer.h"
#include "WGPUDevice.h"
#include "WGPUObject.h"

namespace cc {
namespace gfx {

CCWGPUQueryPool::CCWGPUQueryPool() {
    _typedID = generateObjectID<decltype(this)>();
}

CCWGPUQueryPool::~CCWGPUQueryPool() {
    destroy();
}

void CCWGPUQueryPool::doInit(const QueryPoolInfo& /*info*/) {
    CCWGPUDevice* device           = CCWGPUDevice::getInstance();
    _gpuQueryPool                  = CC_NEW(CCWGPUQueryPoolObject);
    _gpuQueryPool->type            = _type;
    _gpuQueryPool->maxQueryObjects = _maxQueryObjects;
    _gpuQueryPool->idPool.resize(_maxQueryObjects, 0U);

    //TODO_Zeqiang: wgpu query

    //cmdFuncGLES3CreateQuery(device, _gpuQueryPool);
}

void CCWGPUQueryPool::doDestroy() {
    if (_gpuQueryPool) {
        //cmdFuncGLES3DestroyQuery(GLES3Device::getInstance(), _gpuQueryPool);
        CC_DELETE(_gpuQueryPool);
        _gpuQueryPool = nullptr;
    }
}

} // namespace gfx
} // namespace cc
