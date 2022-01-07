/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
#pragma once

#include "cocos/base/Optional.h"
#include "core/DataView.h"
#include "renderer/gfx-base/GFXDef.h"

namespace cc {

// default params behaviors just like on an plain, compact Float32Array
template <typename T>
void writeBuffer(DataView &            target,
                 const std::vector<T> &data,
                 const gfx::Format &   format = gfx::Format::R32F,
                 uint32_t              offset = 0,
                 uint32_t              stride = 0) {
    const gfx::FormatInfo &info = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(format)];
    if (stride == 0) {
        stride = info.size;
    }
    const uint32_t componentBytesLength = info.size / info.count;
    const uint32_t nSeg                 = static_cast<uint32_t>(std::floor(data.size() / info.count));

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
                            CC_ASSERT(false);
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
                            CC_ASSERT(false);
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
                            CC_ASSERT(false);
                            break;
                    }
                    break;
                default:
                    CC_ASSERT(false);
                    break;
            }
        }
    }
}

using DataVariant       = cc::variant<int32_t, float>;
using MapBufferCallback = std::function<DataVariant(const DataVariant &cur, uint32_t idx, const DataView &view)>;

DataView mapBuffer(DataView &                target,
                   const MapBufferCallback & callback,
                   cc::optional<gfx::Format> aFormat,
                   cc::optional<uint32_t>    aOffset,
                   cc::optional<uint32_t>    aLength,
                   cc::optional<uint32_t>    aStride,
                   DataView *                out);

} // namespace cc
