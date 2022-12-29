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

#include <cstdint>
#include "base/Ptr.h"
#include "core/assets/Asset.h"
#include "core/assets/AssetEnum.h"
#include "renderer/gfx-base/GFXDef.h"

#include "base/std/any.h"

namespace cc {

namespace gfx {
class Sampler;
class Device;
class Texture;
} // namespace gfx
/**
 * @en The base texture class, it defines features shared by all textures.
 * @zh 贴图资源基类。它定义了所有贴图共用的概念。
 */
class TextureBase : public Asset {
    IMPL_EVENT_TARGET(TextureBase)
    DECLARE_TARGET_EVENT_BEGIN(TextureBase)
    TARGET_EVENT_ARG1(SamplerUpdated, cc::gfx::Sampler *)
    DECLARE_TARGET_EVENT_END()
public:
    using Super = Asset;

    /**
     * @en The pixel format enum.
     * @zh 像素格式枚举类型
     */
    using PixelFormat = PixelFormat;

    /**
     * @en The wrap mode enum.
     * @zh 环绕模式枚举类型
     */
    using WrapMode = WrapMode;

    /**
     * @en The texture filter mode enum
     * @zh 纹理过滤模式枚举类型
     */
    using Filter = Filter;

    TextureBase(); // NOTE: Editor needs to invoke 'new TextureBase' in JS, so we need to make the constructor public.
    ~TextureBase() override;
    /**
     * @en Whether the pixel data is compressed.
     * @zh 此贴图是否为压缩的像素格式。
     */
    bool isCompressed() const;

    /**
     * @en Pixel width of the texture
     * @zh 此贴图的像素宽度。
     */
    uint32_t getWidth() const {
        return _width;
    }

    /**
     * @en Pixel height of the texture
     * @zh 此贴图的像素高度。
     */
    uint32_t getHeight() const {
        return _height;
    }

    // Functions for TS deserialization.
    inline void setWidth(uint32_t width) { _width = width; }
    inline void setHeight(uint32_t height) { _height = height; }

    /**
     * @en Gets the id of the texture
     * @zh 获取标识符。
     * @returns The id
     */
    inline const ccstd::string &getId() const {
        return _id;
    }

    /**
     * @en Gets the pixel format
     * @zh 获取像素格式。
     * @returns The pixel format
     */
    inline PixelFormat getPixelFormat() const {
        return _format;
    }

    /**
     * @en Gets the anisotropy
     * @zh 获取各向异性。
     * @returns The anisotropy
     */
    inline uint32_t getAnisotropy() const {
        return _anisotropy;
    }

    /**
     * @en Sets the wrap mode of the texture.
     * Be noted, if the size of the texture is not power of two, only [[WrapMode.CLAMP_TO_EDGE]] is allowed.
     * @zh 设置此贴图的缠绕模式。
     * 注意，若贴图尺寸不是 2 的整数幂，缠绕模式仅允许 [[WrapMode.CLAMP_TO_EDGE]]。
     * @param wrapS S(U) coordinate wrap mode
     * @param wrapT T(V) coordinate wrap mode
     * @param wrapR R(W) coordinate wrap mode
     */
    void setWrapMode(WrapMode wrapS, WrapMode wrapT, WrapMode wrapR);
    void setWrapMode(WrapMode wrapS, WrapMode wrapT);

    /**
     * @en Sets the texture's filter mode
     * @zh 设置此贴图的过滤算法。
     * @param minFilter Filter mode for scale down
     * @param magFilter Filter mode for scale up
     */
    void setFilters(Filter minFilter, Filter magFilter);

    /**
     * @en Sets the texture's mip filter
     * @zh 设置此贴图的缩小过滤算法。
     * @param mipFilter Filter mode for scale down
     */
    void setMipFilter(Filter mipFilter);

    /**
     * @en Sets the texture's anisotropy
     * @zh 设置此贴图的各向异性。
     * @param anisotropy
     */
    void setAnisotropy(uint32_t anisotropy);

    /**
     * @en Destroy the current texture, clear up the related GPU resources.
     * @zh 销毁此贴图，并释放占用的 GPU 资源。
     */
    bool destroy() override;

    /**
     * @en Gets the texture hash.
     * @zh 获取此贴图的哈希值。
     */
    inline ccstd::hash_t getHash() const {
        return _textureHash;
    }

    /**
     * @en Gets the GFX Texture resource
     * @zh 获取此贴图底层的 GFX 贴图对象。
     */
    virtual gfx::Texture *getGFXTexture() const {
        return nullptr;
    }

    /**
     * @en Gets the internal GFX sampler information.
     * @zh 获取此贴图内部使用的 GFX 采样器信息。
     * @private
     */
    virtual const gfx::SamplerInfo &getSamplerInfo() const {
        return _samplerInfo;
    }

    /**
     * @en Gets the sampler resource for the texture
     * @zh 获取此贴图底层的 GFX 采样信息。
     */
    virtual gfx::Sampler *getGFXSampler() const;

    // SERIALIZATION
    /**
     * @return
     */
    ccstd::any serialize(const ccstd::any &ctxForExporting) override;

    /**
     *
     * @param data
     */
    void deserialize(const ccstd::any &serializedData, const ccstd::any &handle) override;

protected:
    static gfx::Device *getGFXDevice();
    static gfx::Format getGFXPixelFormat(PixelFormat format);

    gfx::Format getGFXFormat() const;

    void setGFXFormat(const ccstd::optional<PixelFormat> &format);

private:
    void notifySamplerUpdated();

public:
    /*@serializable*/
    PixelFormat _format{PixelFormat::RGBA8888};

    /*@serializable*/
    Filter _minFilter{Filter::LINEAR};

    /*@serializable*/
    Filter _magFilter{Filter::LINEAR};

    /*@serializable*/
    Filter _mipFilter{Filter::NONE};

    /*@serializable*/
    WrapMode _wrapS{WrapMode::REPEAT};

    /*@serializable*/
    WrapMode _wrapT{WrapMode::REPEAT};

    /*@serializable*/
    WrapMode _wrapR{WrapMode::REPEAT};

    /*@serializable*/
    uint32_t _anisotropy{0};

protected:
    uint32_t _width{1};
    uint32_t _height{1};
    ccstd::string _id;
    gfx::SamplerInfo _samplerInfo;
    gfx::Sampler *_gfxSampler{nullptr};
    gfx::Device *_gfxDevice{nullptr};

    ccstd::hash_t _textureHash{0U};

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(TextureBase);
};

} // namespace cc
