/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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

#include "Texture2D.h"
#include "DeviceGraphics.h"
#include "GFXUtils.h"
#include "firefox/WebGLFormats.h"
#include "firefox/GLConsts.h"
#include "firefox/WebGLTexelConversions.h"
#include "firefox/mozilla/CheckedInt.h"

using namespace mozilla;
using namespace mozilla::webgl;

enum class gfxAlphaType {
    Opaque,
    Premult,
    NonPremult,
};

using TexImageTarget = GLenum;

namespace {

    // Returns `value` rounded to the next highest multiple of `multiple`.
    // AKA PadToAlignment, StrideForAlignment.
    template<typename V, typename M>
    V
    RoundUpToMultipleOf(const V& value, const M& multiple)
    {
        return ((value + multiple - 1) / multiple) * multiple;
    }

    bool
    IsTarget3D(TexImageTarget target)
    {
        switch (target) {
            case LOCAL_GL_TEXTURE_2D:
            case LOCAL_GL_TEXTURE_CUBE_MAP_POSITIVE_X:
            case LOCAL_GL_TEXTURE_CUBE_MAP_NEGATIVE_X:
            case LOCAL_GL_TEXTURE_CUBE_MAP_POSITIVE_Y:
            case LOCAL_GL_TEXTURE_CUBE_MAP_NEGATIVE_Y:
            case LOCAL_GL_TEXTURE_CUBE_MAP_POSITIVE_Z:
            case LOCAL_GL_TEXTURE_CUBE_MAP_NEGATIVE_Z:
                return false;

            case LOCAL_GL_TEXTURE_3D:
            case LOCAL_GL_TEXTURE_2D_ARRAY:
                return true;

            default:
                MOZ_CRASH("GFX: bad target");
        }
    }

    void
    DoTexImage(TexImageTarget target, GLint level,
               const webgl::DriverUnpackInfo* dui, GLsizei width, GLsizei height,
               GLsizei depth, const void* data)
    {
        const GLint border = 0;

        if (IsTarget3D(target)) {
            GL_CHECK(glTexImage3D(target, level, dui->internalFormat, width, height, depth,
                         border, dui->unpackFormat, dui->unpackType, data));
        } else {
            MOZ_ASSERT(depth == 1);
            GL_CHECK(glTexImage2D(target, level, dui->internalFormat, width, height, border, dui->unpackFormat, dui->unpackType, data));
        }
    }

    void
    DoTexSubImage(TexImageTarget target, GLint level, GLint xOffset,
                  GLint yOffset, GLint zOffset, GLsizei width, GLsizei height, GLsizei depth,
                  const webgl::PackingInfo& pi, const void* data)
    {
        if (IsTarget3D(target)) {
            GL_CHECK(glTexSubImage3D(target, level, xOffset, yOffset, zOffset, width, height, depth, pi.format, pi.type, data));
        } else {
            MOZ_ASSERT(zOffset == 0);
            MOZ_ASSERT(depth == 1);
            GL_CHECK(glTexSubImage2D(target, level, xOffset, yOffset, width, height, pi.format, pi.type, data));
        }
    }

    inline void
    DoCompressedTexImage(TexImageTarget target, GLint level,
                         GLenum internalFormat, GLsizei width, GLsizei height, GLsizei depth,
                         GLsizei dataSize, const void* data)
    {
        const GLint border = 0;

        if (IsTarget3D(target)) {
            GL_CHECK(glCompressedTexImage3D(target, level, internalFormat, width, height,
                                      depth, border, dataSize, data));
        } else {
            MOZ_ASSERT(depth == 1);
            GL_CHECK(glCompressedTexImage2D(target, level, internalFormat, width, height,
                                      border, dataSize, data));
        }
    }

    void
    DoCompressedTexSubImage(TexImageTarget target, GLint level,
                            GLint xOffset, GLint yOffset, GLint zOffset, GLsizei width,
                            GLsizei height, GLsizei depth, GLenum sizedUnpackFormat,
                            GLsizei dataSize, const void* data)
    {
        if (IsTarget3D(target)) {
            GL_CHECK(glCompressedTexSubImage3D(target, level, xOffset, yOffset, zOffset,
                                         width, height, depth, sizedUnpackFormat, dataSize,
                                         data));
        } else {
            MOZ_ASSERT(zOffset == 0);
            MOZ_ASSERT(depth == 1);
            GL_CHECK(glCompressedTexSubImage2D(target, level, xOffset, yOffset, width,
                                         height, sizedUnpackFormat, dataSize, data));
        }
    }

    void
    DoTexOrSubImage(bool isSubImage, TexImageTarget target, GLint level,
                    const DriverUnpackInfo* dui, GLint xOffset, GLint yOffset, GLint zOffset,
                    GLsizei width, GLsizei height, GLsizei depth, const void* data)
    {
        if (isSubImage) {
            DoTexSubImage(target, level, xOffset, yOffset, zOffset, width, height,
                                 depth, dui->ToPacking(), data);
        } else {
            DoTexImage(target, level, dui, width, height, depth, data);
        }
    }

    bool
    HasColorAndAlpha(const WebGLTexelFormat format)
    {
        switch (format) {
            case WebGLTexelFormat::RA8:
            case WebGLTexelFormat::RA16F:
            case WebGLTexelFormat::RA32F:
            case WebGLTexelFormat::RGBA8:
            case WebGLTexelFormat::RGBA5551:
            case WebGLTexelFormat::RGBA4444:
            case WebGLTexelFormat::RGBA16F:
            case WebGLTexelFormat::RGBA32F:
            case WebGLTexelFormat::BGRA8:
                return true;
            default:
                return false;
        }
    }

    bool
    ConvertIfNeeded(const char* funcName,
                                   const uint32_t rowLength, const uint32_t rowCount,
                                   WebGLTexelFormat srcFormat,
                                   const uint8_t* const srcBegin, const ptrdiff_t srcStride,
                                   WebGLTexelFormat dstFormat, const ptrdiff_t dstStride,
                                   const uint8_t** const out_begin,
                                   UniqueBuffer* const out_anchoredBuffer, bool flipY, bool premultiplyAlpha)
    {
        MOZ_ASSERT(srcFormat != WebGLTexelFormat::FormatNotSupportingAnyConversion);
        MOZ_ASSERT(dstFormat != WebGLTexelFormat::FormatNotSupportingAnyConversion);

        *out_begin = srcBegin;

        if (!rowLength || !rowCount)
            return true;

        gfxAlphaType mSrcAlphaType = gfxAlphaType::NonPremult;
        const auto srcIsPremult = (mSrcAlphaType == gfxAlphaType::Premult);
        const auto& dstIsPremult = premultiplyAlpha;
        const auto fnHasPremultMismatch = [&]() {
            if (mSrcAlphaType == gfxAlphaType::Opaque)
                return false;

            if (!HasColorAndAlpha(srcFormat))
                return false;

            return srcIsPremult != dstIsPremult;
        };

        const auto srcOrigin = (flipY ? gl::OriginPos::TopLeft
                                : gl::OriginPos::BottomLeft);
        const auto dstOrigin = gl::OriginPos::BottomLeft;

        if (srcFormat != dstFormat) {
            RENDERER_LOGW("%s: Conversion requires pixel reformatting. (%u->%u)",
                                       funcName, uint32_t(srcFormat),
                                       uint32_t(dstFormat));
        } else if (fnHasPremultMismatch()) {
            RENDERER_LOGW("%s: Conversion requires change in"
                                       " alpha-premultiplication.",
                                       funcName);
        } else if (srcOrigin != dstOrigin) {
            RENDERER_LOGW("%s: Conversion requires y-flip.", funcName);
        } else if (srcStride != dstStride) {
            RENDERER_LOGW("%s: Conversion requires change in stride. (%u->%u)",
                                       funcName, uint32_t(srcStride), uint32_t(dstStride));
        } else {
            return true;
        }

        ////

        const auto dstTotalBytes = CheckedUint32(rowCount) * dstStride;
        if (!dstTotalBytes.isValid()) {
            RENDERER_LOGE("%s: Calculation failed.", funcName);
            return false;
        }

        UniqueBuffer dstBuffer = calloc(1, dstTotalBytes.value());
        if (!dstBuffer.get()) {
            RENDERER_LOGE("%s: Failed to allocate dest buffer.", funcName);
            return false;
        }
        const auto dstBegin = static_cast<uint8_t*>(dstBuffer.get());

        ////

        // And go!:
        bool wasTrivial;
        if (!ConvertImage(rowLength, rowCount,
                          srcBegin, srcStride, srcOrigin, srcFormat, srcIsPremult,
                          dstBegin, dstStride, dstOrigin, dstFormat, dstIsPremult,
                          &wasTrivial))
        {
            RENDERER_LOGE("%s: ConvertImage failed.", funcName);
            return false;
        }

        *out_begin = dstBegin;
        *out_anchoredBuffer = Move(dstBuffer);
        return true;
    }

    WebGLTexelFormat
    FormatForPackingInfo(const PackingInfo& pi)
    {
        switch (pi.type) {
            case LOCAL_GL_UNSIGNED_BYTE:
                switch (pi.format) {
                    case LOCAL_GL_RED:
                    case LOCAL_GL_LUMINANCE:
                    case LOCAL_GL_RED_INTEGER:
                        return WebGLTexelFormat::R8;

                    case LOCAL_GL_ALPHA:
                        return WebGLTexelFormat::A8;

                    case LOCAL_GL_LUMINANCE_ALPHA:
                        return WebGLTexelFormat::RA8;

                    case LOCAL_GL_RGB:
                    case LOCAL_GL_RGB_INTEGER:
                    case LOCAL_GL_SRGB:
                        return WebGLTexelFormat::RGB8;

                    case LOCAL_GL_RGBA:
                    case LOCAL_GL_RGBA_INTEGER:
                    case LOCAL_GL_SRGB_ALPHA:
                        return WebGLTexelFormat::RGBA8;

                    case LOCAL_GL_RG:
                    case LOCAL_GL_RG_INTEGER:
                        return WebGLTexelFormat::RG8;

                    default:
                        break;
                }
                break;

            case LOCAL_GL_UNSIGNED_SHORT_5_6_5:
                if (pi.format == LOCAL_GL_RGB)
                    return WebGLTexelFormat::RGB565;
                break;

            case LOCAL_GL_UNSIGNED_SHORT_5_5_5_1:
                if (pi.format == LOCAL_GL_RGBA)
                    return WebGLTexelFormat::RGBA5551;
                break;

            case LOCAL_GL_UNSIGNED_SHORT_4_4_4_4:
                if (pi.format == LOCAL_GL_RGBA)
                    return WebGLTexelFormat::RGBA4444;
                break;

            case LOCAL_GL_HALF_FLOAT:
            case LOCAL_GL_HALF_FLOAT_OES:
                switch (pi.format) {
                    case LOCAL_GL_RED:
                    case LOCAL_GL_LUMINANCE:
                        return WebGLTexelFormat::R16F;

                    case LOCAL_GL_ALPHA:           return WebGLTexelFormat::A16F;
                    case LOCAL_GL_LUMINANCE_ALPHA: return WebGLTexelFormat::RA16F;
                    case LOCAL_GL_RG:              return WebGLTexelFormat::RG16F;
                    case LOCAL_GL_RGB:             return WebGLTexelFormat::RGB16F;
                    case LOCAL_GL_RGBA:            return WebGLTexelFormat::RGBA16F;

                    default:
                        break;
                }
                break;

            case LOCAL_GL_FLOAT:
                switch (pi.format) {
                    case LOCAL_GL_RED:
                    case LOCAL_GL_LUMINANCE:
                        return WebGLTexelFormat::R32F;

                    case LOCAL_GL_ALPHA:           return WebGLTexelFormat::A32F;
                    case LOCAL_GL_LUMINANCE_ALPHA: return WebGLTexelFormat::RA32F;
                    case LOCAL_GL_RG:              return WebGLTexelFormat::RG32F;
                    case LOCAL_GL_RGB:             return WebGLTexelFormat::RGB32F;
                    case LOCAL_GL_RGBA:            return WebGLTexelFormat::RGBA32F;

                    default:
                        break;
                }
                break;

            case LOCAL_GL_UNSIGNED_INT_10F_11F_11F_REV:
                if (pi.format == LOCAL_GL_RGB)
                    return WebGLTexelFormat::RGB11F11F10F;
                break;

            default:
                break;
        }

        return WebGLTexelFormat::FormatNotSupportingAnyConversion;
    }

    bool
    TexOrSubImage(bool isSubImage, const char* funcName,
                                  const uint8_t* dataPtr, size_t dataLen, TexImageTarget target, GLint level,
                                  const webgl::DriverUnpackInfo* dui, GLint xOffset,
                                  GLint yOffset, GLint zOffset, const webgl::PackingInfo& srcPI, const webgl::PackingInfo& dstPI,
                                  uint32_t width, uint32_t height, uint32_t srcAlignment,
                                  uint32_t depth, bool flipY, bool premultiplyAlpha)
    {
        const auto rowLength = width;
        const auto rowCount = height;

        const auto srcFormat = FormatForPackingInfo(srcPI);
        const auto srcBPP = webgl::BytesPerPixel(srcPI);

        const auto dstFormat = FormatForPackingInfo(dstPI);
        const auto dstBPP = webgl::BytesPerPixel(dstPI);

        const uint8_t* uploadPtr = dataPtr;
        UniqueBuffer tempBuffer;

        do {
            if (!dataPtr)
                break;

            if (!flipY &&
                !premultiplyAlpha)
            {
                break;
            }

            const auto srcRowLengthBytes = rowLength * srcBPP;

            const uint32_t maxGLAlignment = 8;
            const auto srcStride = RoundUpToMultipleOf(srcRowLengthBytes, srcAlignment);
            const uint32_t dstAlignment = (srcAlignment > maxGLAlignment) ? 1 : srcAlignment;

            const auto dstRowLengthBytes = rowLength * dstBPP;
            const auto dstStride = RoundUpToMultipleOf(dstRowLengthBytes, dstAlignment);

            ////
            if (!ConvertIfNeeded(funcName, rowLength, rowCount, srcFormat, dataPtr,
                                 srcStride, dstFormat, dstStride, &uploadPtr, &tempBuffer, flipY, premultiplyAlpha))
            {
                return false;
            }
        } while (false);

        //////

        bool useParanoidHandling = false;
//        if (mNeedsExactUpload && webgl->mBoundPixelUnpackBuffer) {
//            webgl->GenerateWarning("%s: Uploads from a buffer with a final row with a byte"
//                                   " count smaller than the row stride can incur extra"
//                                   " overhead.",
//                                   funcName);
//
//            if (gl->WorkAroundDriverBugs()) {
//                useParanoidHandling |= (gl->Vendor() == gl::GLVendor::NVIDIA);
//            }
//        }
//
        if (!useParanoidHandling) {
//            if (webgl->mBoundPixelUnpackBuffer) {
//                gl->fBindBuffer(LOCAL_GL_PIXEL_UNPACK_BUFFER,
//                                webgl->mBoundPixelUnpackBuffer->mGLName);
//            }

            DoTexOrSubImage(isSubImage, target, level, dui, xOffset, yOffset,
                                         zOffset, width, height, depth, uploadPtr);

//            if (webgl->mBoundPixelUnpackBuffer) {
//                gl->fBindBuffer(LOCAL_GL_PIXEL_UNPACK_BUFFER, 0);
//            }
            return true;
        }

        //////

//        MOZ_ASSERT(webgl->mBoundPixelUnpackBuffer);

        if (!isSubImage) {
            // Alloc first to catch OOMs.
//            AssertUintParamCorrect(gl, LOCAL_GL_PIXEL_UNPACK_BUFFER, 0);
            DoTexOrSubImage(false, target, level, dui, xOffset, yOffset,
                                         zOffset, width, height, depth, nullptr);
        }

//        const ScopedLazyBind bindPBO(gl, LOCAL_GL_PIXEL_UNPACK_BUFFER,
//                                     webgl->mBoundPixelUnpackBuffer);
//
//        //////
//
//        // Make our sometimes-implicit values explicit. Also this keeps them constant when we
//        // ask for height=mHeight-1 and such.
//        glPixelStorei(LOCAL_GL_UNPACK_ROW_LENGTH, mRowLength);
//        glPixelStorei(LOCAL_GL_UNPACK_IMAGE_HEIGHT, mImageHeight);
//
//        if (depth > 1) {
//            *out_error = DoTexOrSubImage(true, target, level, dui, xOffset, yOffset,
//                                         zOffset, width, height, depth-1, uploadPtr);
//        }
//
//        // Skip the images we uploaded.
//        glPixelStorei(LOCAL_GL_UNPACK_SKIP_IMAGES, mSkipImages + depth - 1);
//
//        if (height > 1) {
//            *out_error = DoTexOrSubImage(true, target, level, dui, xOffset, yOffset,
//                                         zOffset+depth-1, width, height-1, 1, uploadPtr);
//        }
//
//        const auto totalSkipRows = CheckedUint32(mSkipImages) * mImageHeight + mSkipRows;
//        const auto totalFullRows = CheckedUint32(depth - 1) * mImageHeight + height - 1;
//        const auto tailOffsetRows = totalSkipRows + totalFullRows;
//
//        const auto bytesPerRow = CheckedUint32(mRowLength) * bytesPerPixel;
//        const auto rowStride = RoundUpToMultipleOf(bytesPerRow, alignment);
//        if (!rowStride.isValid()) {
//            MOZ_CRASH("Should be checked earlier.");
//        }
//        const auto tailOffsetBytes = tailOffsetRows * rowStride;
//
//        uploadPtr += tailOffsetBytes.value();
//
//        //////
//
//        glPixelStorei(LOCAL_GL_UNPACK_ALIGNMENT, 1);   // No stride padding.
//        glPixelStorei(LOCAL_GL_UNPACK_ROW_LENGTH, 0);  // No padding in general.
//        glPixelStorei(LOCAL_GL_UNPACK_SKIP_IMAGES, 0); // Don't skip images,
//        glPixelStorei(LOCAL_GL_UNPACK_SKIP_ROWS, 0);   // or rows.
//        // Keep skipping pixels though!
//
//        *out_error = DoTexOrSubImage(true, target, level, dui, xOffset,
//                                     yOffset+height-1, zOffset+depth-1, width, 1, 1,
//                                     uploadPtr);

        // Reset all our modified state.
//cjh        glPixelStorei(LOCAL_GL_UNPACK_ALIGNMENT, webgl->mPixelStore_UnpackAlignment);
//        glPixelStorei(LOCAL_GL_UNPACK_IMAGE_HEIGHT, webgl->mPixelStore_UnpackImageHeight);
//        glPixelStorei(LOCAL_GL_UNPACK_ROW_LENGTH, webgl->mPixelStore_UnpackRowLength);
//        glPixelStorei(LOCAL_GL_UNPACK_SKIP_IMAGES, webgl->mPixelStore_UnpackSkipImages);
//        glPixelStorei(LOCAL_GL_UNPACK_SKIP_ROWS, webgl->mPixelStore_UnpackSkipRows);

        return true;
    }

}

RENDERER_BEGIN

Texture2D::Texture2D()
{
//    RENDERER_LOGD("Construct Texture2D: %p", this);
}

Texture2D::~Texture2D()
{
//    RENDERER_LOGD("Destruct Texture2D: %p", this);
}

bool Texture2D::init(DeviceGraphics* device, const Options& options)
{
    bool ok = Texture::init(device);
    if (ok)
    {
        _target = GL_TEXTURE_2D;
        GL_CHECK(glGenTextures(1, &_glID));

        if (options.images.empty())
        {
            const auto& glFmt = glTextureFmt(_format);
            int len = options.width * options.height * glFmt.bpp / 8;
            unsigned char* tmpData = new unsigned char[len];
            memset(tmpData, 255, len);
            Data data;
            data.copy(tmpData, len);
            delete [] tmpData;
            const_cast<Options&>(options).images.push_back(data);
        }

        update(options);
    }
    return ok;
}

void Texture2D::update(const Options& options)
{
    bool genMipmap = _hasMipmap;

    _width = options.width;
    _height = options.height;
    _anisotropy = options.anisotropy;
    _minFilter = options.minFilter;
    _magFilter = options.magFilter;
    _mipFilter = options.mipFilter;
    _wrapS = options.wrapS;
    _wrapT = options.wrapT;
    _format = options.format;
    _compressed = _format >= Format::RGB_DXT1 && _format <= Format::RGBA_PVRTC_4BPPV1;

    // check if generate mipmap
    _hasMipmap = options.hasMipmap;
    genMipmap = options.hasMipmap;

    if (options.images.size() > 1)
    {
        genMipmap = false; //TODO: is it true here?
        uint16_t maxLength = options.width > options.height ? options.width : options.height;
        if (maxLength >> (options.images.size() - 1) != 1) {
            RENDERER_LOGE("texture-2d mipmap is invalid, should have a 1x1 mipmap.");
        }
    }

    // NOTE: get pot after _width, _height has been assigned.
    bool pot = isPow2(_width) && isPow2(_height);
    if (!pot) {
        genMipmap = false;
    }

    GL_CHECK(glActiveTexture(GL_TEXTURE0));
    GL_CHECK(glBindTexture(GL_TEXTURE_2D, _glID));
    if (!options.images.empty()) {
        setMipmap(options.images, options.flipY, options.premultiplyAlpha);
    }

    setTexInfo();

    if (genMipmap) {
        GL_CHECK(glHint(GL_GENERATE_MIPMAP_HINT, GL_NICEST));
        GL_CHECK(glGenerateMipmap(GL_TEXTURE_2D));
    }
    _device->restoreTexture(0);
}

void Texture2D::updateSubImage(const SubImageOption& option)
{
    const GLTextureFmt& glFmt = glTextureFmt(_format);

    GL_CHECK(glActiveTexture(GL_TEXTURE0));
    GL_CHECK(glBindTexture(GL_TEXTURE_2D, _glID));
    setSubImage(glFmt, option);
    _device->restoreTexture(0);
}

void Texture2D::updateImage(const ImageOption& option)
{
    const GLTextureFmt& glFmt = glTextureFmt(_format);

    GL_CHECK(glActiveTexture(GL_TEXTURE0));
    GL_CHECK(glBindTexture(GL_TEXTURE_2D, _glID));
    setImage(glFmt, option);
    _device->restoreTexture(0);
}

// Private methods:

void Texture2D::setSubImage(const GLTextureFmt& glFmt, const SubImageOption& option)
{
    const auto& img = option.image;

    //Set the row align only when mipmapsNum == 1 and the data is uncompressed
    GLint aligment = 1;
    if (!_hasMipmap && !_compressed && glFmt.bpp > 0)
    {
        unsigned int bytesPerRow = option.width * glFmt.bpp / 8;

        if (bytesPerRow % 8 == 0)
            aligment = 8;
        else if (bytesPerRow % 4 == 0)
            aligment = 4;
        else if (bytesPerRow % 2 == 0)
            aligment = 2;
        else
            aligment = 1;
    }

    GL_CHECK(glPixelStorei(GL_UNPACK_ALIGNMENT, aligment));

    GLenum dstFormat = glFmt.internalFormat;
    GLenum dstType = glFmt.pixelType;

    webgl::DriverUnpackInfo dui;
    dui.internalFormat = glFmt.internalFormat;
    dui.unpackFormat = glFmt.format;
    dui.unpackType = glFmt.pixelType;
    webgl::PackingInfo srcPI;
    srcPI.type = glFmt.pixelType;
    srcPI.format = glFmt.format;

    webgl::PackingInfo dstPI;
    dstPI.type = dstType;
    dstPI.format = dstFormat;

    if (_compressed)
    {
        DoCompressedTexSubImage(GL_TEXTURE_2D, option.level, option.x, option.y, 0, glFmt.internalFormat, option.width, option.height, 1, (GLsizei)img.getSize(), img.getBytes());
    }
    else
    {
        TexOrSubImage(true, "Texture2D::setSubImage", img.getBytes(), img.getSize(), GL_TEXTURE_2D, option.level, &dui, 0, 0, 0, srcPI, dstPI, option.width, option.height, aligment, 1, option.flipY, option.premultiplyAlpha);
    }
}

void Texture2D::setImage(const GLTextureFmt& glFmt, const ImageOption& option)
{
    const auto& img = option.image;

    //Set the row align only when mipmapsNum == 1 and the data is uncompressed
    GLint aligment = 1;
    if (_hasMipmap && !_compressed && glFmt.bpp > 0)
    {
        unsigned int bytesPerRow = option.width * glFmt.bpp / 8;

        if (bytesPerRow % 8 == 0)
            aligment = 8;
        else if (bytesPerRow % 4 == 0)
            aligment = 4;
        else if (bytesPerRow % 2 == 0)
            aligment = 2;
        else
            aligment = 1;
    }

    GL_CHECK(glPixelStorei(GL_UNPACK_ALIGNMENT, aligment));

    webgl::DriverUnpackInfo dui;
    dui.internalFormat = glFmt.internalFormat;
    dui.unpackFormat = glFmt.format;
    dui.unpackType = glFmt.pixelType;
    webgl::PackingInfo srcPI;
    srcPI.type = glFmt.pixelType;
    srcPI.format = glFmt.format;

    webgl::PackingInfo dstPI;
    dstPI.type = glFmt.pixelType;
    dstPI.format = glFmt.internalFormat;;

    if (_compressed)
    {
        DoCompressedTexImage(GL_TEXTURE_2D, option.level, glFmt.internalFormat, option.width, option.height, 1, (GLsizei)img.getSize(), img.getBytes());
    }
    else
    {
        TexOrSubImage(false, "Texture2D::setImage", img.getBytes(), img.getSize(), GL_TEXTURE_2D, option.level, &dui, 0, 0, 0, srcPI, dstPI, option.width, option.height, aligment, 1, option.flipY, option.premultiplyAlpha);
    }
}

void Texture2D::setMipmap(const std::vector<cocos2d::Data>& images, bool isFlipY, bool isPremultiplyAlpha)
{
    const auto& glFmt = glTextureFmt(_format);
    ImageOption options;
    options.width = _width;
    options.height = _height;
    options.flipY = isFlipY;
    options.premultiplyAlpha = isPremultiplyAlpha;
    options.level = 0;

    for (size_t i = 0, len = images.size(); i < len; ++i)
    {
        options.level = (GLint)i;
        options.width = _width >> i;
        options.height = _height >> i;
        options.image = images[i];
        setImage(glFmt, options);
    }
}

void Texture2D::setTexInfo()
{
    bool pot = isPow2(_width) && isPow2(_height);

    // WebGL1 doesn't support all wrap modes with NPOT textures
    if (!pot && (_wrapS != WrapMode::CLAMP || _wrapT != WrapMode::CLAMP))
    {
        RENDERER_LOGW("WebGL1 doesn\'t support all wrap modes with NPOT textures");
        _wrapS = WrapMode::CLAMP;
        _wrapT = WrapMode::CLAMP;
    }

    Filter mipFilter = _hasMipmap ? _mipFilter : Filter::NONE;
    if (!pot && mipFilter != Filter::NONE)
    {
        RENDERER_LOGW("NPOT textures do not support mipmap filter");
        mipFilter = Filter::NONE;
    }

    GL_CHECK(glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, glFilter(_minFilter, mipFilter)));
    GL_CHECK(glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, glFilter(_magFilter, Filter::NONE)));
    GL_CHECK(glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, (GLint)_wrapS));
    GL_CHECK(glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, (GLint)_wrapT));

    //TODO:    let ext = this._device.ext('EXT_texture_filter_anisotropic');
//    if (ext) {
//        GL_CHECK(glTexParameteri(GL_TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, this._anisotropy));
//    }
}

RENDERER_END
