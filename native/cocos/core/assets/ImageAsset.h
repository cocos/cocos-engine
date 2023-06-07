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
    bool compressed{false};
    uint32_t width{0};
    uint32_t height{0};
    PixelFormat format{PixelFormat::RGBA8888};
    ccstd::vector<uint32_t> mipmapLevelDataSize;
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
    //    ccstd::any getNativeAsset() const override { return ccstd::any(_nativeData); }
    void setNativeAsset(const ccstd::any &obj) override;

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
     * @en The pixel mipmap level data size of the image.
     * @zh 此图像资源的mipmap层级大小。
     */
    const ccstd::vector<uint32_t> &getMipmapLevelDataSize() const;

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
    const ccstd::string &getUrl() const;

    // Functions for TS.
    inline void setWidth(uint32_t width) { _width = width; }
    inline void setHeight(uint32_t height) { _height = height; }
    inline void setFormat(PixelFormat format) { _format = format; }
    inline void setData(uint8_t *data) { _data = data; }
    inline void setNeedFreeData(bool v) { _needFreeData = v; }
    inline void setUrl(const ccstd::string &url) { _url = url; }
    inline void setMipmapLevelDataSize(const ccstd::vector<uint32_t> &mipmapLevelDataSize) { _mipmapLevelDataSize = mipmapLevelDataSize; }

    // Functions for Utils.
    IntrusivePtr<ImageAsset> extractMipmap0();
    std::vector<IntrusivePtr<ImageAsset>> extractMipmaps();

private:
    uint8_t *_data{nullptr};

    PixelFormat _format{PixelFormat::RGBA8888};
    uint32_t _width{0};
    uint32_t _height{0};

    bool _needFreeData{false}; // Should free data if the data is assigned in C++.

    ArrayBuffer::Ptr _arrayBuffer; //minggo: hold the data from ImageSource.

    ccstd::string _url;

    ccstd::vector<uint32_t> _mipmapLevelDataSize;

    CC_DISALLOW_COPY_MOVE_ASSIGN(ImageAsset);
};

} // namespace cc
