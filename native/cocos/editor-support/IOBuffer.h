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

#pragma once
#include <cmath>
#include <cstddef>
#include <cstdint>
#include <cstring>
#include <functional>
#include <string>
#include <utility>
#include "MiddlewareMacro.h"
#include "base/Macros.h"

MIDDLEWARE_BEGIN
/**
 * Use for such as vertex buffer or index buffer,write bytes in it.
 * If write data out of range,will sign it in _outRange property.
 * User decide to enlarge it or not.
 */
class IOBuffer {
public:
    explicit IOBuffer(std::size_t defaultSize) {
        _bufferSize = defaultSize;
        _buffer = new uint8_t[_bufferSize];
        memset(_buffer, 0, _bufferSize);
    }

    IOBuffer() = default;

    virtual ~IOBuffer() {
        if (_buffer) {
            delete[] _buffer;
            _buffer = nullptr;
        }
    }

    inline void writeUint32(std::size_t pos, uint32_t val) {
        if (_bufferSize < pos + sizeof(val)) {
            _outRange = true;
            return;
        }
        auto *buffer = reinterpret_cast<uint32_t *>(_buffer + pos);
        *buffer = val;
    }

    inline void writeFloat32(std::size_t pos, float val) {
        if (_bufferSize < pos + sizeof(val)) {
            _outRange = true;
            return;
        }
        auto *buffer = reinterpret_cast<float *>(_buffer + pos);
        *buffer = val;
    }

    inline void writeBytes(const char *bytes, std::size_t bytesLen) {
        if (_bufferSize < _curPos + bytesLen) {
            _outRange = true;
            return;
        }
        memcpy(_buffer + _curPos, bytes, bytesLen);
        _curPos += bytesLen;
    }

    inline void writeUint32(uint32_t val) {
        if (_bufferSize < _curPos + sizeof(val)) {
            _outRange = true;
            return;
        }
        auto *buffer = reinterpret_cast<uint32_t *>(_buffer + _curPos);
        *buffer = val;
        _curPos += sizeof(val);
    }

    inline void writeFloat32(float val) {
        if (_bufferSize < _curPos + sizeof(val)) {
            _outRange = true;
            return;
        }
        auto *buffer = reinterpret_cast<float *>(_buffer + _curPos);
        *buffer = val;
        _curPos += sizeof(val);
    }

    inline void writeUint16(uint16_t val) {
        if (_bufferSize < _curPos + sizeof(val)) {
            _outRange = true;
            return;
        }
        auto *buffer = reinterpret_cast<uint16_t *>(_buffer + _curPos);
        *buffer = val;
        _curPos += sizeof(val);
    }

    inline uint32_t readUint32() {
        auto *buffer = reinterpret_cast<uint32_t *>(_buffer + _readPos);
        _readPos += sizeof(uint32_t);
        return *buffer;
    }

    inline uint16_t readUint16() {
        auto *buffer = reinterpret_cast<uint16_t *>(_buffer + _readPos);
        _readPos += sizeof(uint16_t);
        return *buffer;
    }

    inline float readFloat32() {
        auto *buffer = reinterpret_cast<float *>(_buffer + _readPos);
        _readPos += sizeof(float);
        return *buffer;
    }

    inline char readUint8() {
        char *buffer = reinterpret_cast<char *>(_buffer + _readPos);
        _readPos += sizeof(char);
        return *buffer;
    }

    inline void reset() {
        _curPos = 0;
        _readPos = 0;
    }

    inline void clear() {
        memset(_buffer, 0, _bufferSize);
    }

    inline void move(int pos) {
        if (_bufferSize < _curPos + pos) {
            _outRange = true;
            return;
        }
        _curPos += pos;
    }

    inline std::size_t length() const {
        return _curPos;
    }

    inline std::size_t getCurPos() const {
        return _curPos;
    }

    inline uint8_t *getCurBuffer() const {
        return _buffer + _curPos;
    }

    inline uint8_t *getBuffer() const {
        return _buffer;
    }

    inline std::size_t getCapacity() const {
        return _bufferSize;
    }

    inline bool isOutRange() const {
        return _outRange;
    }

    inline int checkSpace(std::size_t needSize, bool needCopy = false) {
        auto needLen = _curPos + needSize;
        auto isFull = 0;
        if (_maxSize > 0 && needLen > _maxSize) {
            isFull = 1;
            if (_fullCallback) {
                _fullCallback();
            }
        }
        if (!needCopy) {
            _curPos = 0;
        }
        if (_bufferSize < needLen) {
            int len = static_cast<int>(needLen);
            std::size_t fitSize = static_cast<std::size_t>(floorf(1.25F * len));
            resize(fitSize, needCopy);
            if (_resizeCallback) {
                _resizeCallback();
            }
        }

        return isFull;
    }

    void setMaxSize(std::size_t maxSize) {
        _maxSize = maxSize;
    }

    using fullCallback = std::function<void()>;
    void setFullCallback(fullCallback callback) {
        _fullCallback = std::move(callback);
    }

    using resizeCallback = std::function<void()>;
    void setResizeCallback(resizeCallback callback) {
        _resizeCallback = std::move(callback);
    }

    /**
     * @brief Resize buffer
     * @param[in] newLen New size you want to adjustment.
     * @param[in] needCopy If true,will copy old data to new buffer,default false.
     */
    virtual void resize(std::size_t newLen, bool needCopy);

protected:
    uint8_t *_buffer = nullptr;
    std::size_t _bufferSize = 0;
    std::size_t _curPos = 0;
    std::size_t _readPos = 0;
    bool _outRange = false;
    std::size_t _maxSize = 0;
    fullCallback _fullCallback = nullptr;
    resizeCallback _resizeCallback = nullptr;
};

MIDDLEWARE_END
