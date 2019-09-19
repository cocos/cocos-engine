/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.

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

#ifndef __CC_IMAGE_H__
#define __CC_IMAGE_H__
/// @cond DO_NOT_SHOW

#include "base/CCRef.h"
#include "platform/CCGL.h"
#include "platform/CCStdC.h"

#include <string>
#include <map>

// premultiply alpha, or the effect will wrong when want to use other pixel format in Texture2D,
// such as RGB888, RGB5A1
#define CC_RGB_PREMULTIPLY_ALPHA(vr, vg, vb, va) \
    (unsigned)(((unsigned)((unsigned char)(vr) * ((unsigned char)(va) + 1)) >> 8) | \
    ((unsigned)((unsigned char)(vg) * ((unsigned char)(va) + 1) >> 8) << 8) | \
    ((unsigned)((unsigned char)(vb) * ((unsigned char)(va) + 1) >> 8) << 16) | \
    ((unsigned)(unsigned char)(va) << 24))

NS_CC_BEGIN

/**
 * @addtogroup platform
 * @{
 */

/**
 @brief Structure which can tell where mipmap begins and how long is it
 */
typedef struct _MipmapInfo
{
    unsigned char* address = nullptr;
    int offset = 0;
    int len = 0;
}MipmapInfo;

class Image : public Ref
{
public:
    /**
     * @js ctor
     */
    Image();

    /** Supported formats for Image */
    enum class Format
    {
        //! JPEG
        JPG,
        //! PNG
        PNG,
        //! TIFF
        TIFF,
        //! WebP
        WEBP,
        //! PVR
        PVR,
        //! ETC
        ETC,
        //! ETC2
        ETC2,
        //! S3TC
        S3TC,
        //! ATITC
//        ATITC,
        //! TGA
        TGA,
        //! Raw Data
        RAW_DATA,
        //! Unknown format
        UNKNOWN
    };

    /** @typedef Texture2D::PixelFormat
     Possible texture pixel formats
     */
    enum class PixelFormat
    {
        //! auto detect the type
        AUTO,
        //! 32-bit texture: BGRA8888
        BGRA8888,
        //! 32-bit texture: RGBA8888
        RGBA8888,
        //! 24-bit texture: RGBA888
        RGB888,
        //! 16-bit texture without Alpha channel
        RGB565,
        //! 8-bit textures used as masks
        A8,
        //! 8-bit intensity texture
        I8,
        //! 16-bit textures used as masks
        AI88,
        //! 16-bit textures: RGBA4444
        RGBA4444,
        //! 16-bit textures: RGB5A1
        RGB5A1,
        //! 4-bit PVRTC-compressed texture: PVRTC4
        PVRTC4,
        //! 4-bit PVRTC-compressed texture: PVRTC4 (has alpha channel)
        PVRTC4A,
        //! 2-bit PVRTC-compressed texture: PVRTC2
        PVRTC2,
        //! 2-bit PVRTC-compressed texture: PVRTC2 (has alpha channel)
        PVRTC2A,
        //! ETC-compressed texture: ETC
        ETC,
        //! ETC-compressed texture: GL_COMPRESSED_RGB8_ETC2
        ETC2_RGB,
        //! ETC-compressed texture: GL_COMPRESSED_RGBA8_ETC2
        ETC2_RGBA,
        //! S3TC-compressed texture: S3TC_Dxt1
        S3TC_DXT1,
        //! S3TC-compressed texture: S3TC_Dxt3
        S3TC_DXT3,
        //! S3TC-compressed texture: S3TC_Dxt5
        S3TC_DXT5,
        //! ATITC-compressed texture: ATC_RGB
        ATC_RGB,
        //! ATITC-compressed texture: ATC_EXPLICIT_ALPHA
        ATC_EXPLICIT_ALPHA,
        //! ATITC-compressed texture: ATC_INTERPOLATED_ALPHA
        ATC_INTERPOLATED_ALPHA,
        //! Default texture format: AUTO
        DEFAULT = AUTO,

        NONE = -1
    };

    struct PixelFormatInfo {

        PixelFormatInfo(GLenum anInternalFormat, GLenum aFormat, GLenum aType, int aBpp, bool aCompressed, bool anAlpha)
        : internalFormat(anInternalFormat)
        , format(aFormat)
        , type(aType)
        , bpp(aBpp)
        , compressed(aCompressed)
        , alpha(anAlpha)
        {}

        GLenum internalFormat;
        GLenum format;
        GLenum type;
        int bpp;
        bool compressed;
        bool alpha;
    };

    typedef std::map<PixelFormat, const PixelFormatInfo> PixelFormatInfoMap;

    /**
     * Enables or disables premultiplied alpha for PNG files.
     *
     *  @param enabled (default: true)
     */
    static void setPNGPremultipliedAlphaEnabled(bool enabled) { PNG_PREMULTIPLIED_ALPHA_ENABLED = enabled; }
    
    /** treats (or not) PVR files as if they have alpha premultiplied.
     Since it is impossible to know at runtime if the PVR images have the alpha channel premultiplied, it is
     possible load them as if they have (or not) the alpha channel premultiplied.

     By default it is disabled.
     */
    static void setPVRImagesHavePremultipliedAlpha(bool haveAlphaPremultiplied);

    /**
    @brief Load the image from the specified path.
    @param path   the absolute file path.
    @return true if loaded correctly.
    */
    bool initWithImageFile(const std::string& path);

    /**
    @brief Load image from stream buffer.
    @param data  stream buffer which holds the image data.
    @param dataLen  data length expressed in (number of) bytes.
    @return true if loaded correctly.
    * @js NA
    * @lua NA
    */
    bool initWithImageData(const unsigned char * data, ssize_t dataLen);

    // @warning kFmtRawData only support RGBA8888
    bool initWithRawData(const unsigned char * data, ssize_t dataLen, int width, int height, int bitsPerComponent, bool preMulti = false);

    // Getters
    inline unsigned char*    getData() const               { return _data; }
    inline ssize_t           getDataLen() const            { return _dataLen; }
    inline Format            getFileType() const           { return _fileType; }
    inline PixelFormat       getRenderFormat() const       { return _renderFormat; }
    inline int               getWidth() const              { return _width; }
    inline int               getHeight() const             { return _height; }
    inline int               getNumberOfMipmaps() const    { return _numberOfMipmaps; }
    inline const MipmapInfo* getMipmaps() const            { return _mipmaps; }
    inline bool              hasPremultipliedAlpha() const { return _hasPremultipliedAlpha; }
    inline std::string       getFilePath() const           { return _filePath; }

    int                      getBitPerPixel() const;
    bool                     hasAlpha() const;
    bool                     isCompressed() const;

    const PixelFormatInfo& getPixelFormatInfo() const;

    /**
     @brief    Save Image data to the specified file, with specified format.
     @param    filename        the file's absolute path, including file suffix.
     @param    isToRGB        whether the image is saved as RGB format.
     */
    bool saveToFile(const std::string &filename, bool isToRGB = true);

protected:
    bool initWithJpgData(const unsigned char *  data, ssize_t dataLen);
    bool initWithPngData(const unsigned char * data, ssize_t dataLen);
    bool initWithTiffData(const unsigned char * data, ssize_t dataLen);
    bool initWithWebpData(const unsigned char * data, ssize_t dataLen);
    bool initWithPVRData(const unsigned char * data, ssize_t dataLen);
    bool initWithPVRv2Data(const unsigned char * data, ssize_t dataLen);
    bool initWithPVRv3Data(const unsigned char * data, ssize_t dataLen);
    bool initWithETCData(const unsigned char * data, ssize_t dataLen);
    bool initWithETC2Data(const unsigned char * data, ssize_t dataLen);
    bool initWithS3TCData(const unsigned char * data, ssize_t dataLen);

    typedef struct sImageTGA tImageTGA;
    bool initWithTGAData(tImageTGA* tgaData);

    bool saveImageToPNG(const std::string& filePath, bool isToRGB = true);
    bool saveImageToJPG(const std::string& filePath);

    void premultipliedAlpha();

protected:
    /**
     @brief Determine how many mipmaps can we have.
     It's same as define but it respects namespaces
     */
    static const int MIPMAP_MAX = 16;
    /**
     @brief Determine whether we premultiply alpha for png files.
     */
    static bool PNG_PREMULTIPLIED_ALPHA_ENABLED;
    unsigned char *_data;
    ssize_t _dataLen;
    int _width;
    int _height;
    Format _fileType;
    PixelFormat _renderFormat;
    MipmapInfo _mipmaps[MIPMAP_MAX];   // pointer to mipmap images
    int _numberOfMipmaps;
    // false if we can't auto detect the image is premultiplied or not.
    bool _hasPremultipliedAlpha;
    std::string _filePath;

protected:
    // noncopyable
    Image(const Image&) = delete;
    Image& operator=(const Image&) = delete;

    // nonmoveable
    Image(Image&&) = delete;
    Image& operator=(Image&&) = delete;

    /**
     * @js NA
     * @lua NA
     */
    virtual ~Image();

    Format detectFormat(const unsigned char * data, ssize_t dataLen);
    bool isPng(const unsigned char * data, ssize_t dataLen);
    bool isJpg(const unsigned char * data, ssize_t dataLen);
    bool isTiff(const unsigned char * data, ssize_t dataLen);
    bool isWebp(const unsigned char * data, ssize_t dataLen);
    bool isPvr(const unsigned char * data, ssize_t dataLen);
    bool isEtc(const unsigned char * data, ssize_t dataLen);
    bool isEtc2(const unsigned char * data, ssize_t dataLen);
    bool isS3TC(const unsigned char * data,ssize_t dataLen);
};

// end of platform group
/// @}

NS_CC_END

/// @endcond
#endif    // __CC_IMAGE_H__
