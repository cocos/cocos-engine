/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
    doDestroy();
}

void CCWGPUQueryPool::doInit(const QueryPoolInfo & /*info*/) {
    CCWGPUDevice *device = CCWGPUDevice::getInstance();
    _gpuQueryPool = ccnew CCWGPUQueryPoolObject;
    _gpuQueryPool->type = _type;
    _gpuQueryPool->maxQueryObjects = _maxQueryObjects;
    _gpuQueryPool->idPool.resize(_maxQueryObjects, 0U);

    // TODO_Zeqiang: wgpu query

    // cmdFuncGLES3CreateQuery(device, _gpuQueryPool);
}

void CCWGPUQueryPool::doDestroy() {
    if (_gpuQueryPool) {
        // cmdFuncGLES3DestroyQuery(GLES3Device::getInstance(), _gpuQueryPool);
        delete _gpuQueryPool;
        _gpuQueryPool = nullptr;
    }
}

} // namespace gfx
} // namespace cc
