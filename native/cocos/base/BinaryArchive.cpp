/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

#include "BinaryArchive.h"
#include "base/Assertf.h"

namespace cc {

bool BinaryInputArchive::load(char *data, uint32_t size) {
    CC_ASSERT(!!_stream);
    return _stream.rdbuf()->sgetn(data, size) == size;
}

void BinaryInputArchive::move(uint32_t length) {
    CC_ASSERT(!!_stream);
    _stream.ignore(length);
}

void BinaryOutputArchive::save(const char *data, uint32_t size) {
    CC_ASSERT(!!_stream);
    auto len = _stream.rdbuf()->sputn(data, size);
    CC_ASSERT(len == size);
}

} // namespace cc
