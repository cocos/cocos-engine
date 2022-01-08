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

#include "base/Ptr.h"
#include "cocos/base/Optional.h"
#include "core/assets/Asset.h"
#include "core/assets/AssetEnum.h"
#include "core/assets/ImageAsset.h"
#include "core/assets/SimpleTexture.h"

namespace cc {

struct ITexture2DSerializeData {
    std::string              base;
    std::vector<std::string> mipmaps;
};

/**
 * @en The create information for [[Texture2D]]
 * @zh 用来创建贴图的信息。
 */
struct ITexture2DCreateInfo {
    /**
     * @en The pixel width
     * @zh 像素宽度。
     */
    uint32_t width{0};

    /**
     * @en The pixel height
     * @zh 像素高度。
     */
    uint32_t height{0};

    /**
     * @en The pixel format
     * @zh 像素格式。
     * @default PixelFormat.RGBA8888
     */
    cc::optional<PixelFormat> format;

    /**
     * @en The mipmap level count
     * @zh mipmap 层级。
     * @default 1
     */
    cc::optional<uint32_t> mipmapLevel;
};

/**
 * @en The 2D texture asset. It supports mipmap, each level of mipmap use an [[ImageAsset]].
 * @zh 二维贴图资源。二维贴图资源的每个 Mipmap 层级都为一张 [[ImageAsset]]。
 */
class Texture2D final : public SimpleTexture {
public:
    using Super = SimpleTexture;

    explicit Texture2D()  = default;
    ~Texture2D() override = default;

    /**
     * @en All levels of mipmap images, be noted, automatically generated mipmaps are not included.
     * When setup mipmap, the size of the texture and pixel format could be modified.
     * @zh 所有层级 Mipmap，注意，这里不包含自动生成的 Mipmap。
     * 当设置 Mipmap 时，贴图的尺寸以及像素格式可能会改变。
     */
    const std::vector<IntrusivePtr<ImageAsset>> &getMipmaps() const {
        return _mipmaps;
    }

    const std::vector<std::string> &getMipmapsUuids() const { // TODO(xwx): temporary use _mipmaps as string array
        return _mipmapsUuids;
    }

    //cjh TODO: TextureCube also needs this method.
    void syncMipmapsForJS(const std::vector<IntrusivePtr<ImageAsset>> &value);

    void setMipmaps(const std::vector<IntrusivePtr<ImageAsset>> &value);

    /**
     * @en Level 0 mipmap image.
     * Be noted, `this.image = img` equals `this.mipmaps = [img]`,
     * sets image will clear all previous mipmaps.
     * @zh 0 级 Mipmap。
     * 注意，`this.image = img` 等价于 `this.mipmaps = [img]`，
     * 也就是说，通过 `this.image` 设置 0 级 Mipmap 时将隐式地清除之前的所有 Mipmap。
     */
    inline ImageAsset *getImage() const {
        return _mipmaps.empty() ? nullptr : _mipmaps[0].get();
    }

    void setImage(ImageAsset *value);

    void initialize();

    void onLoaded() override;

    /**
     * @en Reset the current texture with given size, pixel format and mipmap images.
     * After reset, the gfx resource will become invalid, you must use [[uploadData]] explicitly to upload the new mipmaps to GPU resources.
     * @zh 将当前贴图重置为指定尺寸、像素格式以及指定 mipmap 层级。重置后，贴图的像素数据将变为未定义。
     * mipmap 图像的数据不会自动更新到贴图中，你必须显式调用 [[uploadData]] 来上传贴图数据。
     * @param info The create information
     */
    void reset(const ITexture2DCreateInfo &info);

    /**
     * @en Reset the current texture with given size, pixel format and mipmap images.
     * After reset, the gfx resource will become invalid, you must use [[uploadData]] explicitly to upload the new mipmaps to GPU resources.
     * @zh 将当前贴图重置为指定尺寸、像素格式以及指定 mipmap 层级。重置后，贴图的像素数据将变为未定义。
     * mipmap 图像的数据不会自动更新到贴图中，你必须显式调用 [[uploadData]] 来上传贴图数据。
     * @param width Pixel width
     * @param height Pixel height
     * @param format Pixel format
     * @param mipmapLevel Mipmap level count
     * @deprecated since v1.0 please use [[reset]] instead
     */
    void create(uint32_t width, uint32_t height, PixelFormat format = PixelFormat::RGBA8888, uint32_t mipmapLevel = 1);

    std::string toString() const override;

    void updateMipmaps(uint32_t firstLevel, uint32_t count) override;

    /**
     * @en If the level 0 mipmap image is a HTML element, then return it, otherwise return null.
     * @zh 若此贴图 0 级 Mipmap 的图像资源的实际源存在并为 HTML 元素则返回它，否则返回 `null`。
     * @returns HTML element or `null`
     * @deprecated Please use [[image.data]] instead
     */
    HTMLElement *getHtmlElementObj();

    /**
     * @en Destroy the current 2d texture, clear up all mipmap levels and the related GPU resources.
     * @zh 销毁此贴图，清空所有 Mipmap 并释放占用的 GPU 资源。
     */
    bool destroy() override;

    /**
     * @en Gets the description of the 2d texture
     * @zh 返回此贴图的描述。
     * @returns The description
     */
    std::string description() const;

    /**
     * @en Release used GPU resources.
     * @zh 释放占用的 GPU 资源。
     * @deprecated please use [[destroy]] instead
     */
    void releaseTexture();

    // SERIALIZATION

    /**
     * @return
     */
    cc::any serialize(const cc::any &ctxForExporting) override;

    /**
     *
     * @param data
     */
    void deserialize(const cc::any &serializedData, const cc::any &handle) override;

    gfx::TextureInfo getGfxTextureCreateInfo(gfx::TextureUsageBit usage, gfx::Format format, uint32_t levelCount, gfx::TextureFlagBit flags) override;

    void initDefault(const cc::optional<std::string> &uuid) override;

    bool validate() const override;

private:
    std::vector<IntrusivePtr<ImageAsset>> _mipmaps;

    std::vector<std::string> _mipmapsUuids; // TODO(xwx): temporary use _mipmaps as UUIDs string array

    friend class Texture2DDeserializer;

    CC_DISALLOW_COPY_MOVE_ASSIGN(Texture2D);
};

} // namespace cc
