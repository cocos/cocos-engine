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

#include "GFXCommandBuffer.h"
#include "GFXObject.h"

namespace cc {
namespace gfx {

CommandBuffer::CommandBuffer()
: GFXObject(ObjectType::COMMAND_BUFFER) {
}

CommandBuffer::~CommandBuffer() = default;

void CommandBuffer::initialize(const CommandBufferInfo &info) {
    _type = info.type;
    _queue = info.queue;

    doInit(info);
}

void CommandBuffer::destroy() {
    doDestroy();

    _type = CommandBufferType::PRIMARY;
    _queue = nullptr;
}

} // namespace gfx
} // namespace cc
