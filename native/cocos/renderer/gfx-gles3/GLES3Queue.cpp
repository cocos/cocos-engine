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

#include "GLES3Std.h"

#include "GLES3CommandBuffer.h"
#include "GLES3Commands.h"
#include "GLES3Device.h"
#include "GLES3Queue.h"

namespace cc {
namespace gfx {

GLES3Queue::GLES3Queue() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3Queue::~GLES3Queue() {
    destroy();
}

void GLES3Queue::doInit(const QueueInfo &info) {
}

void GLES3Queue::doDestroy() {
}

void GLES3Queue::submit(CommandBuffer *const *cmdBuffs, uint32_t count) {
    for (uint32_t i = 0; i < count; ++i) {
        auto *cmdBuff = static_cast<GLES3CommandBuffer *>(cmdBuffs[i]);

        if (!cmdBuff->_pendingPackages.empty()) {
            GLES3CmdPackage *cmdPackage = cmdBuff->_pendingPackages.front();

            cmdFuncGLES3ExecuteCmds(GLES3Device::getInstance(), cmdPackage);

            cmdBuff->_pendingPackages.pop();
            cmdBuff->_freePackages.push(cmdPackage);
            cmdBuff->_cmdAllocator->clearCmds(cmdPackage);
            cmdBuff->_cmdAllocator->reset();
        }

        _numDrawCalls += cmdBuff->_numDrawCalls;
        _numInstances += cmdBuff->_numInstances;
        _numTriangles += cmdBuff->_numTriangles;
    }
}

} // namespace gfx
} // namespace cc
