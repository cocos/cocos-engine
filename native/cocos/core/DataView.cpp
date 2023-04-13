/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.
 
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

#include "core/DataView.h"
#include "base/TemplateUtils.h"

namespace cc {

#include "base/Macros.h"
#include "core/ArrayBuffer.h"

ccstd::unordered_map<ccstd::string, DataView::ReaderVariant> DataView::intReaderMap{
    {"getUint8", &DataView::getUint8},
    {"getUint16", &DataView::getUint16},
    {"getUint32", &DataView::getUint32},
    {"getInt8", &DataView::getInt8},
    {"getInt16", &DataView::getInt16},
    {"getInt32", &DataView::getInt32},
};

ccstd::unordered_map<ccstd::string, DataView::IntWritter> DataView::intWritterMap{
    {"setUint8", reinterpret_cast<DataView::IntWritter>(&DataView::setUint8)},
    {"setUint16", reinterpret_cast<DataView::IntWritter>(&DataView::setUint16)},
    {"setUint32", reinterpret_cast<DataView::IntWritter>(&DataView::setUint32)},
    {"setInt8", reinterpret_cast<DataView::IntWritter>(&DataView::setInt8)},
    {"setInt16", reinterpret_cast<DataView::IntWritter>(&DataView::setInt16)},
    {"setInt32", reinterpret_cast<DataView::IntWritter>(&DataView::setInt32)},
};

int32_t DataView::readInt(ReaderVariant &readerVariant, uint32_t offset) {
    return ccstd::visit(overloaded{
                            [offset, this](auto &reader) {
                                return static_cast<int32_t>((this->*reader)(offset));
                            },
                            [](ccstd::monostate & /*unused*/) { return 0; }},
                        readerVariant);
}

DataView::DataView(ArrayBuffer *buffer) : DataView(buffer, 0) {}

DataView::DataView(ArrayBuffer *buffer, uint32_t byteOffset)
: DataView(buffer, byteOffset, buffer ? (buffer->byteLength() - byteOffset) : 0) {}

DataView::DataView(ArrayBuffer *buffer, uint32_t byteOffset, uint32_t byteLength) {
    assign(buffer, byteOffset, byteLength);
}

void DataView::assign(ArrayBuffer *buffer) {
    assign(buffer, 0);
}

void DataView::assign(ArrayBuffer *buffer, uint32_t byteOffset) {
    assign(buffer, byteOffset, buffer ? buffer->byteLength() : 0);
}

void DataView::assign(ArrayBuffer *buffer, uint32_t byteOffset, uint32_t byteLength) {
    CC_ASSERT_NOT_NULL(buffer);
    CC_ASSERT_GT(byteLength, 0);
    _buffer = buffer;
    _byteOffset = byteOffset;
    _byteEndPos = byteLength + byteOffset;
    CC_ASSERT(_byteEndPos <= buffer->_byteLength);

    _data = buffer->_data;
}

uint8_t DataView::getUint8(uint32_t offset) const {
    offset += _byteOffset;
    CC_ASSERT_LT(offset, _byteEndPos);

    return _data[offset];
}

uint16_t DataView::getUint16(uint32_t offset) const {
    offset += _byteOffset;
    CC_ASSERT(offset < (_byteEndPos - 1));

    return *reinterpret_cast<uint16_t *>(_data + offset);
}

uint32_t DataView::getUint32(uint32_t offset) const {
    offset += _byteOffset;
    CC_ASSERT(offset < (_byteEndPos - 3));

    return *reinterpret_cast<uint32_t *>(_data + offset);
}

int8_t DataView::getInt8(uint32_t offset) const {
    offset += _byteOffset;
    CC_ASSERT_LT(offset, _byteEndPos);

    return static_cast<int8_t>(_data[offset]);
}

int16_t DataView::getInt16(uint32_t offset) const {
    offset += _byteOffset;
    CC_ASSERT(offset < (_byteEndPos - 1));

    return *reinterpret_cast<int16_t *>(_data + offset);
}

int32_t DataView::getInt32(uint32_t offset) const {
    offset += _byteOffset;
    CC_ASSERT(offset < (_byteEndPos - 3));

    return *reinterpret_cast<int32_t *>(_data + offset);
}

float DataView::getFloat32(uint32_t offset) const {
    offset += _byteOffset;
    CC_ASSERT(offset < (_byteEndPos - 3));

    return *reinterpret_cast<float *>(_data + offset);
}

void DataView::setUint8(uint32_t offset, uint8_t value) {
    offset += _byteOffset;
    CC_ASSERT_LT(offset, _byteEndPos);

    _data[offset] = value;
}

void DataView::setUint16(uint32_t offset, uint16_t value) {
    offset += _byteOffset;
    CC_ASSERT(offset < _byteEndPos - 1);

    *reinterpret_cast<uint16_t *>(_data + offset) = value;
}

void DataView::setUint32(uint32_t offset, uint32_t value) {
    offset += _byteOffset;
    CC_ASSERT(offset < _byteEndPos - 3);

    *reinterpret_cast<uint32_t *>(_data + offset) = value;
}

void DataView::setInt8(uint32_t offset, int8_t value) {
    offset += _byteOffset;
    CC_ASSERT_LT(offset, _byteEndPos);

    *reinterpret_cast<int8_t *>(_data + offset) = value;
}

void DataView::setInt16(uint32_t offset, int16_t value) {
    offset += _byteOffset;
    CC_ASSERT(offset < _byteEndPos - 1);

    *reinterpret_cast<int16_t *>(_data + offset) = value;
}

void DataView::setInt32(uint32_t offset, int32_t value) {
    offset += _byteOffset;
    CC_ASSERT(offset < _byteEndPos - 3);

    *reinterpret_cast<int32_t *>(_data + offset) = value;
}

void DataView::setFloat32(uint32_t offset, float value) {
    offset += _byteOffset;
    CC_ASSERT(offset < _byteEndPos - 3);

    *(reinterpret_cast<float *>(_data + offset)) = value;
}

} // namespace cc
