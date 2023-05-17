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

#include "GLES3Std.h"

#include "GLES3Buffer.h"
#include "GLES3Commands.h"
#include "GLES3Device.h"
#include "GLES3InputAssembler.h"

namespace cc {
namespace gfx {

GLES3InputAssembler::GLES3InputAssembler() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3InputAssembler::~GLES3InputAssembler() {
    destroy();
}

void GLES3InputAssembler::doInit(const InputAssemblerInfo &info) {
    _gpuInputAssembler = ccnew GLES3GPUInputAssembler;
    _gpuInputAssembler->attributes = _attributes;
    _gpuInputAssembler->gpuVertexBuffers.resize(_vertexBuffers.size());
    for (size_t i = 0; i < _gpuInputAssembler->gpuVertexBuffers.size(); ++i) {
        auto *vb = static_cast<GLES3Buffer *>(_vertexBuffers[i]);
        _gpuInputAssembler->gpuVertexBuffers[i] = vb->gpuBuffer();
    }
    if (info.indexBuffer) {
        _gpuInputAssembler->gpuIndexBuffer = static_cast<GLES3Buffer *>(info.indexBuffer)->gpuBuffer();
    }

    if (info.indirectBuffer) {
        _gpuInputAssembler->gpuIndirectBuffer = static_cast<GLES3Buffer *>(info.indirectBuffer)->gpuBuffer();
    }

    cmdFuncGLES3CreateInputAssembler(GLES3Device::getInstance(), _gpuInputAssembler);
}

void GLES3InputAssembler::doDestroy() {
    if (_gpuInputAssembler) {
        cmdFuncGLES3DestroyInputAssembler(GLES3Device::getInstance(), _gpuInputAssembler);
        delete _gpuInputAssembler;
        _gpuInputAssembler = nullptr;
    }
}

} // namespace gfx
} // namespace cc
