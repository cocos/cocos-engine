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

#include "3d/misc/Buffer.h"
#include "base/std/variant.h"

namespace cc {

namespace {
ccstd::unordered_map<gfx::FormatType, ccstd::string> typeMap{
    {gfx::FormatType::UNORM, "Uint"},
    {gfx::FormatType::SNORM, "Int"},
    {gfx::FormatType::UINT, "Uint"},
    {gfx::FormatType::INT, "Int"},
    {gfx::FormatType::UFLOAT, "Float"},
    {gfx::FormatType::FLOAT, "Float"},
};

ccstd::string getDataViewType(const gfx::FormatInfo &info) {
    ccstd::string type;
    auto iter = typeMap.find(info.type);
    if (iter != typeMap.end()) {
        type = iter->second;
    } else {
        type = "Uint";
    }

    const uint32_t bytes = info.size / info.count * 8;
    return type + std::to_string(bytes);
}

} // namespace

using DataVariant = ccstd::variant<ccstd::monostate, int32_t, float>;
using MapBufferCallback = std::function<DataVariant(const DataVariant &cur, uint32_t idx, const DataView &view)>;

DataView mapBuffer(DataView &target,
                   const MapBufferCallback &callback,
                   ccstd::optional<gfx::Format> aFormat,
                   ccstd::optional<uint32_t> aOffset,
                   ccstd::optional<uint32_t> aLength,
                   ccstd::optional<uint32_t> aStride,
                   DataView *out) {
    gfx::Format format = aFormat.has_value() ? aFormat.value() : gfx::Format::R32F;
    uint32_t offset = aOffset.has_value() ? aOffset.value() : 0;
    uint32_t length = aLength.has_value() ? aLength.value() : target.byteLength() - offset;
    uint32_t stride = aStride.has_value() ? aStride.value() : 0;

    DataView dataView;
    if (out == nullptr) {
        out = &dataView;
        dataView.assign(target.buffer()->slice(target.byteOffset(), target.byteOffset() + target.byteLength()));
    }

    const auto &info = gfx::GFX_FORMAT_INFOS[static_cast<int32_t>(format)];
    if (stride == 0) {
        stride = info.size;
    }

    static const ccstd::string SET_PREFIX{"set"};
    static const ccstd::string GET_PREFIX{"get"};

    bool isFloat = info.type == gfx::FormatType::FLOAT || info.type == gfx::FormatType::UFLOAT;
    DataView::IntWritter intWritter = nullptr;
    if (!isFloat) {
        intWritter = DataView::intWritterMap[SET_PREFIX + getDataViewType(info)];
    }

    DataView::ReaderVariant intReader;
    if (!isFloat) {
        intReader = DataView::intReaderMap[GET_PREFIX + getDataViewType(info)];
    }

    const uint32_t componentBytesLength = info.size / info.count;
    const uint32_t nSeg = floor(length / stride);

    for (uint32_t iSeg = 0; iSeg < nSeg; ++iSeg) {
        const uint32_t x = offset + stride * iSeg;
        for (uint32_t iComponent = 0; iComponent < info.count; ++iComponent) {
            const uint32_t y = x + componentBytesLength * iComponent;
            if (isFloat) {
                float cur = target.getFloat32(y);
                auto dataVariant = callback(cur, iComponent, target);
                if (ccstd::holds_alternative<float>(dataVariant)) {
                    out->setFloat32(y, ccstd::get<float>(dataVariant));
                } else {
                    CC_LOG_ERROR("mapBuffer, wrong data type, expect float");
                }
            } else {
                int32_t cur = target.readInt(intReader, y);
                // iComponent is usually more useful than y
                auto dataVariant = callback(cur, iComponent, target);
                if (ccstd::holds_alternative<int32_t>(dataVariant)) {
                    (target.*intWritter)(y, ccstd::get<int32_t>(dataVariant));
                } else {
                    CC_LOG_ERROR("mapBuffer, wrong data type, expect int32_t");
                }
            }
        }
    }
    return dataView;
}

} // namespace cc
