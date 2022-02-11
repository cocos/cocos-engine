/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "MTLStd.h"

#include "MTLBuffer.h"
#include "MTLGPUObjects.h"
#include "MTLInputAssembler.h"

namespace cc {
namespace gfx {

CCMTLInputAssembler::CCMTLInputAssembler() : InputAssembler() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLInputAssembler::~CCMTLInputAssembler() {
    destroy();
}

void CCMTLInputAssembler::doInit(const InputAssemblerInfo &info) {
    _GPUInputAssembler = CC_NEW(CCMTLGPUInputAssembler);
    if (!_GPUInputAssembler) {
        return;
    }

    if (info.indexBuffer) {
        _GPUInputAssembler->mtlIndexBuffer = static_cast<CCMTLBuffer *>(info.indexBuffer)->getMTLBuffer();
    }
    if (info.indirectBuffer) {
        _GPUInputAssembler->mtlIndirectBuffer = static_cast<CCMTLBuffer *>(info.indirectBuffer)->getMTLBuffer();
    }

    for (const auto &vertexBuffer : info.vertexBuffers)
        _GPUInputAssembler->mtlVertexBufers.push_back(static_cast<CCMTLBuffer *>(vertexBuffer)->getMTLBuffer());
}

void CCMTLInputAssembler::doDestroy() {
    CC_SAFE_DELETE(_GPUInputAssembler);
}

} // namespace gfx
} // namespace cc
