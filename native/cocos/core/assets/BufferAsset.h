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

#include "core/ArrayBuffer.h"
#include "core/assets/Asset.h"

namespace cc {

class BufferAsset final : public Asset {
public:
    BufferAsset() = default;
    ~BufferAsset() override = default;

    inline ArrayBuffer *getBuffer() const { return _buffer; }

    inline void setNativeAssetForJS(ArrayBuffer *buffer) { _buffer = buffer; }
    inline ArrayBuffer *getNativeAssetForJS() const { return _buffer; }

    ccstd::any getNativeAsset() const override;
    void setNativeAsset(const ccstd::any &obj) override;
    bool validate() const override { return _buffer != nullptr; }

private:
    ArrayBuffer::Ptr _buffer;

    CC_DISALLOW_COPY_MOVE_ASSIGN(BufferAsset);
};

} // namespace cc
