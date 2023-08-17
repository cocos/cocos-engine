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
#pragma once

#include <cmath>
#include "base/std/optional.h"
#include "core/DataView.h"
#include "renderer/gfx-base/GFXDef.h"

namespace cc {

// default params behaviors just like on an plain, compact Float32Array
template <typename T>
void writeBuffer(DataView &target,
                 const ccstd::vector<T> &data,
                 const gfx::Format &format = gfx::Format::R32F,
                 uint32_t offset = 0,
                 uint32_t stride = 0) {
    const gfx::FormatInfo &info = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(format)];
    if (stride == 0) {
        stride = info.size;
    }
    const uint32_t componentBytesLength = info.size / info.count;
    const auto nSeg = static_cast<uint32_t>(floor(data.size() / info.count));

    const uint32_t bytes = info.size / info.count * 8;

    for (uint32_t iSeg = 0; iSeg < nSeg; ++iSeg) {
        uint32_t x = offset + stride * iSeg;
        for (uint32_t iComponent = 0; iComponent < info.count; ++iComponent) {
            const uint32_t y = x + componentBytesLength * iComponent;
            // default Little-Endian
            switch (info.type) {
                case gfx::FormatType::UINT:
                case gfx::FormatType::UNORM:
                    switch (bytes) {
                        case 8:
                            target.setUint8(y, static_cast<uint8_t>(data[info.count * iSeg + iComponent]));
                            break;
                        case 16:
                            target.setUint16(y, static_cast<uint16_t>(data[info.count * iSeg + iComponent]));
                            break;
                        case 32:
                            target.setUint32(y, static_cast<uint32_t>(data[info.count * iSeg + iComponent]));
                            break;
                        default:
                            CC_ABORT();
                            break;
                    }
                    break;
                case gfx::FormatType::INT:
                case gfx::FormatType::SNORM:
                    switch (bytes) {
                        case 8:
                            target.setInt8(y, static_cast<int8_t>(data[info.count * iSeg + iComponent]));
                            break;
                        case 16:
                            target.setInt16(y, static_cast<int16_t>(data[info.count * iSeg + iComponent]));
                            break;
                        case 32:
                            target.setInt32(y, static_cast<int32_t>(data[info.count * iSeg + iComponent]));
                            break;
                        default:
                            CC_ABORT();
                            break;
                    }
                    break;
                case gfx::FormatType::UFLOAT:
                case gfx::FormatType::FLOAT:
                    switch (bytes) {
                        case 8:
                            target.setFloat32(y, static_cast<float>(data[info.count * iSeg + iComponent]));
                            break;
                        case 16:
                            target.setFloat32(y, static_cast<float>(data[info.count * iSeg + iComponent]));
                            break;
                        case 32:
                            target.setFloat32(y, static_cast<float>(data[info.count * iSeg + iComponent]));
                            break;
                        default:
                            CC_ABORT();
                            break;
                    }
                    break;
                default:
                    CC_ABORT();
                    break;
            }
        }
    }
}

using DataVariant = ccstd::variant<ccstd::monostate, int32_t, float>;
using MapBufferCallback = std::function<DataVariant(const DataVariant &cur, uint32_t idx, const DataView &view)>;

DataView mapBuffer(DataView &target,
                   const MapBufferCallback &callback,
                   ccstd::optional<gfx::Format> aFormat,
                   ccstd::optional<uint32_t> aOffset,
                   ccstd::optional<uint32_t> aLength,
                   ccstd::optional<uint32_t> aStride,
                   DataView *out);

} // namespace cc
