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
#include "core/assets/TextureBase.h"

namespace cc {

class ImageAsset;

/**
 * @en The simple texture base class.
 * It create the GFX Texture and can set mipmap levels.
 * @zh 简单贴图基类。
 * 简单贴图内部创建了 GFX 贴图和该贴图上的 GFX 贴图视图。
 * 简单贴图允许指定不同的 Mipmap 层级。
 */
class SimpleTexture : public TextureBase {
    IMPL_EVENT_TARGET(SimpleTexture)
    DECLARE_TARGET_EVENT_BEGIN_WITH_PARENTS(SimpleTexture, TextureBase)
    TARGET_EVENT_ARG1(TextureUpdated, cc::gfx::Texture *)
    TARGET_EVENT_ARG1(AfterAssignImage, cc::ImageAsset *)
    DECLARE_TARGET_EVENT_END()
public:
    ~SimpleTexture() override;

    using Super = TextureBase;
    /**
     * @en The mipmap level of the texture
     * @zh 贴图中的 Mipmap 层级数量
     */
    inline uint32_t mipmapLevel() const {
        return _mipmapLevel;
    }

    /**
     * @en The GFX Texture resource
     * @zh 获取此贴图底层的 GFX 贴图对象。
     */
    gfx::Texture *getGFXTexture() const override {
        return _gfxTextureView.get();
    }

    bool destroy() override;

    /**
     * @en Update the level 0 mipmap image.
     * @zh 更新 0 级 Mipmap。
     */
    void updateImage();

    /**
     * @en Update the given level mipmap image.
     * @zh 更新指定层级范围内的 Mipmap。当 Mipmap 数据发生了改变时应调用此方法提交更改。
     * 若指定的层级范围超出了实际已有的层级范围，只有覆盖的那些层级范围会被更新。
     * @param firstLevel First level to be updated
     * @param count Mipmap level count to be updated
     */
    virtual void updateMipmaps(uint32_t firstLevel, uint32_t count) {}

    /**
     * @en Upload data to the given mipmap level.
     * The size of the image will affect how the mipmap is updated.
     * - When the image is an ArrayBuffer, the size of the image must match the mipmap size.
     * - If the image size matches the mipmap size, the mipmap data will be updated entirely.
     * - If the image size is smaller than the mipmap size, the mipmap will be updated from top left corner.
     * - If the image size is larger, an error will be raised
     * @zh 上传图像数据到指定层级的 Mipmap 中。
     * 图像的尺寸影响 Mipmap 的更新范围：
     * - 当图像是 `ArrayBuffer` 时，图像的尺寸必须和 Mipmap 的尺寸一致；否则，
     * - 若图像的尺寸与 Mipmap 的尺寸相同，上传后整个 Mipmap 的数据将与图像数据一致；
     * - 若图像的尺寸小于指定层级 Mipmap 的尺寸（不管是长或宽），则从贴图左上角开始，图像尺寸范围内的 Mipmap 会被更新；
     * - 若图像的尺寸超出了指定层级 Mipmap 的尺寸（不管是长或宽），都将引起错误。
     * @param source The source image or image data
     * @param level Mipmap level to upload the image to
     * @param arrayIndex The array index
     */
    void uploadDataWithArrayBuffer(const ArrayBuffer &source, uint32_t level = 0, uint32_t arrayIndex = 0);
    void uploadData(const uint8_t *source, uint32_t level = 0, uint32_t arrayIndex = 0);

    void assignImage(ImageAsset *image, uint32_t level, uint32_t arrayIndex = 0);

    void checkTextureLoaded();

    /**
     * Set mipmap level of this texture.
     * The value is passes as presumed info to `this._getGfxTextureCreateInfo()`.
     * @param value The mipmap level.
     * @warn As it is invoked by subclass(TextureCube) in TS, so should make it as public.
     */
    void setMipmapLevel(uint32_t value);

    /**
     * Set mipmap level range for this texture.
     * @param baseLevel The base mipmap level.
     * @param maxLevel The maximum mipmap level.
     */
    void setMipRange(uint32_t baseLevel, uint32_t maxLevel);

    /**
     * @en Whether mipmaps are baked convolutional maps.
     * @zh mipmaps是否为烘焙出来的卷积图。
     */
    virtual bool isUsingOfflineMipmaps();

protected:
    SimpleTexture();
    void textureReady();

    /**
     * @en This method is override by derived classes to provide GFX texture info.
     * @zh 这个方法被派生类重写以提供 GFX 纹理信息。
     * @param presumed The presumed GFX texture info.
     */
    virtual gfx::TextureInfo getGfxTextureCreateInfo(gfx::TextureUsageBit usage, gfx::Format format, uint32_t levelCount, gfx::TextureFlagBit flags) = 0;

    /**
     * @en This method is overrided by derived classes to provide GFX TextureViewInfo.
     * @zh 这个方法被派生类重写以提供 GFX 纹理视图信息。
     * @param presumed The presumed GFX TextureViewInfo.
     */
    virtual gfx::TextureViewInfo getGfxTextureViewCreateInfo(gfx::Texture *texture, gfx::Format format, uint32_t baseLevel, uint32_t levelCount) = 0;

    void tryReset();

    void createTexture(gfx::Device *device);
    gfx::Texture *createTextureView(gfx::Device *device);

    void tryDestroyTexture();
    void tryDestroyTextureView();
    void notifyTextureUpdated();
    void setMipRangeInternal(uint32_t baseLevel, uint32_t maxLevel);

    IntrusivePtr<gfx::Texture> _gfxTexture;
    IntrusivePtr<gfx::Texture> _gfxTextureView;

    uint32_t _mipmapLevel{1};
    // Cache these data to reduce JSB invoking.
    uint32_t _textureWidth{0};
    uint32_t _textureHeight{0};

    uint32_t _baseLevel{0};
    uint32_t _maxLevel{1000};

    CC_DISALLOW_COPY_MOVE_ASSIGN(SimpleTexture);
};

} // namespace cc
