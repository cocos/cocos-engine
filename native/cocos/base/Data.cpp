/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/Data.h"
#include <cstring>
#include "base/Log.h"

namespace cc {

const Data Data::NULL_DATA;

Data::Data() = default;

Data::Data(Data &&other) noexcept {
    //    CC_LOG_INFO("In the move constructor of Data.");
    move(other);
}

Data::Data(const Data &other) {
    //    CC_LOG_INFO("In the copy constructor of Data.");
    copy(other._bytes, other._size);
}

Data::~Data() {
    //    CC_LOG_INFO("deallocing Data: %p", this);
    clear();
}

Data &Data::operator=(const Data &other) {
    //    CC_LOG_INFO("In the copy assignment of Data.");
    if (this != &other) {
        copy(other._bytes, other._size);
    }
    return *this;
}

Data &Data::operator=(Data &&other) noexcept {
    //    CC_LOG_INFO("In the move assignment of Data.");
    move(other);
    return *this;
}

void Data::move(Data &other) {
    clear();

    _bytes = other._bytes;
    _size = other._size;

    other._bytes = nullptr;
    other._size = 0;
}

bool Data::isNull() const {
    return (_bytes == nullptr || _size == 0);
}

uint8_t *Data::getBytes() const {
    return _bytes;
}

uint32_t Data::getSize() const {
    return _size;
}

void Data::copy(const unsigned char *bytes, uint32_t size) {
    clear();

    if (size > 0) {
        _size = size;
        _bytes = static_cast<unsigned char *>(malloc(sizeof(unsigned char) * _size));
        memcpy(_bytes, bytes, _size);
    }
}

void Data::fastSet(unsigned char *bytes, uint32_t size) {
    free(_bytes);
    _bytes = bytes;
    _size = size;
}

void Data::resize(uint32_t size) {
    CC_ASSERT(size);
    if (_size == size) {
        return;
    }
    _size = size;
    _bytes = static_cast<unsigned char *>(realloc(_bytes, sizeof(unsigned char) * _size));
}

void Data::clear() {
    free(_bytes);
    _bytes = nullptr;
    _size = 0;
}

uint8_t *Data::takeBuffer(uint32_t *size) {
    auto *buffer = getBytes();
    if (size) {
        *size = getSize();
    }

    _bytes = nullptr;
    _size = 0;
    return buffer;
}

} // namespace cc
