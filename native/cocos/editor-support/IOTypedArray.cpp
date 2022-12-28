/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "IOTypedArray.h"
#include "TypedArrayPool.h"

#define USE_TYPEARRAY_POOL 0

MIDDLEWARE_BEGIN

IOTypedArray::IOTypedArray(se::Object::TypedArrayType arrayType, std::size_t defaultSize, bool usePool) {
    _arrayType = arrayType;
    _bufferSize = defaultSize;
    _usePool = usePool;

    if (_usePool) {
        _typeArray = TypedArrayPool::getInstance()->pop(_arrayType, _bufferSize);
    } else {
        se::AutoHandleScope hs;
        _typeArray = se::Object::createTypedArray(_arrayType, nullptr, _bufferSize);
        _typeArray->root();
    }

    se::AutoHandleScope hs;
    _typeArray->getTypedArrayData(&_buffer, &_bufferSize);
}

IOTypedArray::~IOTypedArray() {
    if (_usePool) {
        TypedArrayPool::getInstance()->push(_arrayType, _bufferSize, _typeArray);
    } else {
        _typeArray->unroot();
        _typeArray->decRef();
    }
    _typeArray = nullptr;
    _buffer = nullptr;
}

void IOTypedArray::resize(std::size_t newLen, bool needCopy) {
    if (_bufferSize >= newLen) return;

    se::Object *newTypeBuffer = nullptr;

    if (_usePool) {
        newTypeBuffer = TypedArrayPool::getInstance()->pop(_arrayType, newLen);
    } else {
        se::AutoHandleScope hs;
        newTypeBuffer = se::Object::createTypedArray(_arrayType, nullptr, newLen);
        newTypeBuffer->root();
    }

    uint8_t *newBuffer = nullptr;
    se::AutoHandleScope hs;
    newTypeBuffer->getTypedArrayData(&newBuffer, static_cast<size_t *>(&newLen));

    if (needCopy) {
        memcpy(newBuffer, _buffer, _bufferSize);
    }

    if (_usePool) {
        TypedArrayPool::getInstance()->push(_arrayType, _bufferSize, _typeArray);
    } else {
        _typeArray->unroot();
        _typeArray->decRef();
    }

    _typeArray = newTypeBuffer;
    _buffer = newBuffer;
    _bufferSize = newLen;
    _outRange = false;
}

MIDDLEWARE_END
