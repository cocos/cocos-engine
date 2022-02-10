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

#include "core/assets/Asset.h"
#include "core/assets/AssetEnum.h"

#include "core/ArrayBuffer.h"

namespace cc {

class Image;

/**
 * @en Image source in memory
 * @zh 内存图像源。
 */
struct IMemoryImageSource {
    ArrayBuffer::Ptr data;
    bool             compressed{false};
    uint32_t         width{0};
    uint32_t         height{0};
    PixelFormat      format{PixelFormat::RGBA8888};
};

/**
 * @en Image Asset.
 * @zh 图像资源。
 */
class ImageAsset final : public Asset {
public:
    using Super = Asset;

    ImageAsset() = default;
    ~ImageAsset() override;

    //minggo: do not need it in c++.
    //    cc::any getNativeAsset() const override { return cc::any(_nativeData); }
    void setNativeAsset(const cc::any &obj) override;

    /**
     * @en Image data.
     * @zh 此图像资源的图像数据。
     */
    const uint8_t *getData() const;

    /**
     * @en The pixel width of the image.
     * @zh 此图像资源的像素宽度。
     */
    uint32_t getWidth() const;

    /**
     * @en The pixel height of the image.
     * @zh 此图像资源的像素高度。
     */
    uint32_t getHeight() const;

    /**
     * @en The pixel format of the image.
     * @zh 此图像资源的像素格式。
     */
    PixelFormat getFormat() const;

    /**
     * @en Whether the image is in compressed texture format.
     * @zh 此图像资源是否为压缩像素格式。
     */
    bool isCompressed() const;

    /**
     * @en The original source image URL, it could be empty.
     * @zh 此图像资源的原始图像源的 URL。当原始图像元不是 HTML 文件时可能为空。
     * @deprecated Please use [[nativeUrl]]
     */
    std::string getUrl() const;

    // Functions for TS.
    inline void setWidth(uint32_t width) { _width = width; }
    inline void setHeight(uint32_t height) { _height = height; }
    inline void setFormat(PixelFormat format) { _format = format; }
    inline void setData(uint8_t *data) { _data = data; }
    inline void setUrl(const std::string &url) { _url = url; }

private:
    uint32_t         _width{0};
    uint32_t         _height{0};
    PixelFormat      _format{PixelFormat::RGBA8888};
    uint8_t *        _data{nullptr};
    bool             _needFreeData{false}; // Should free data if the data is assigned in C++.
    ArrayBuffer::Ptr _arrayBuffer;         //minggo: hold the data from ImageSource.
    std::string      _url;

    CC_DISALLOW_COPY_MOVE_ASSIGN(ImageAsset);
};

} // namespace cc
