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


#include "Image.h"
#include <string>
#include <ctype.h>
#include <assert.h>
#include "base/Config.h" // CC_USE_JPEG, CC_USE_WEBP
#if CC_USE_JPEG
#include "jpeg/jpeglib.h"
#endif // CC_USE_JPEG

#include "base/Data.h"
#include "base/Utils.h"
#include "renderer/core/Core.h"

extern "C"
{
#if CC_USE_PNG
#include "png/png.h"
#endif //CC_USE_PNG

#include "base/etc1.h"
#include "base/etc2.h"
}

#if CC_USE_WEBP
#include "webp/decode.h"
#endif // CC_USE_WEBP

#include "platform/FileUtils.h"
#include "base/ZipUtils.h"
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
#include "platform/android/FileUtils-android.h"
#endif

#include <map>

namespace cc {

//////////////////////////////////////////////////////////////////////////
//struct and data for pvr structure

namespace
{
    static const int PVR_TEXTURE_FLAG_TYPE_MASK = 0xff;

    // Values taken from PVRTexture.h from http://www.imgtec.com
    enum class PVR2TextureFlag
    {
        Mipmap         = (1<<8),        // has mip map levels
        Twiddle        = (1<<9),        // is twiddled
        Bumpmap        = (1<<10),       // has normals encoded for a bump map
        Tiling         = (1<<11),       // is bordered for tiled pvr
        Cubemap        = (1<<12),       // is a cubemap/skybox
        FalseMipCol    = (1<<13),       // are there false colored MIP levels
        Volume         = (1<<14),       // is this a volume texture
        Alpha          = (1<<15),       // v2.1 is there transparency info in the texture
        VerticalFlip   = (1<<16),       // v2.1 is the texture vertically flipped
    };

    static const char gPVRTexIdentifier[5] = "PVR!";

    // v2
    enum class PVR2TexturePixelFormat : unsigned char
    {
        RGBA4444 = 0x10,
        RGBA5551,
        RGBA8888,
        RGB565,
        RGB555,          // unsupported
        RGB888,
        I8,
        AI88,
        PVRTC2BPP_RGBA,
        PVRTC4BPP_RGBA,
        BGRA8888,
        A8,
    };

    // v3
    enum class PVR3TexturePixelFormat : uint64_t
    {
        PVRTC2BPP_RGB  = 0ULL,
        PVRTC2BPP_RGBA = 1ULL,
        PVRTC4BPP_RGB  = 2ULL,
        PVRTC4BPP_RGBA = 3ULL,
        PVRTC2_2BPP_RGBA = 4ULL,
        PVRTC2_4BPP_RGBA  = 5ULL,
        ETC1 = 6ULL,
        DXT1 = 7ULL,
        DXT2 = 8ULL,
        DXT3 = 9ULL,
        DXT4 = 10ULL,
        DXT5 = 11ULL,
        BC1 = 7ULL,
        BC2 = 9ULL,
        BC3 = 11ULL,
        BC4 = 12ULL,
        BC5 = 13ULL,
        BC6 = 14ULL,
        BC7 = 15ULL,
        UYVY = 16ULL,
        YUY2 = 17ULL,
        BW1bpp = 18ULL,
        R9G9B9E5 = 19ULL,
        RGBG8888 = 20ULL,
        GRGB8888 = 21ULL,
        ETC2_RGB = 22ULL,
        ETC2_RGBA = 23ULL,
        ETC2_RGBA1 = 24ULL,
        EAC_R11_Unsigned = 25ULL,
        EAC_R11_Signed = 26ULL,
        EAC_RG11_Unsigned = 27ULL,
        EAC_RG11_Signed = 28ULL,

        BGRA8888       = 0x0808080861726762ULL,
        RGBA8888       = 0x0808080861626772ULL,
        RGBA4444       = 0x0404040461626772ULL,
        RGBA5551       = 0x0105050561626772ULL,
        RGB565         = 0x0005060500626772ULL,
        RGB888         = 0x0008080800626772ULL,
        A8             = 0x0000000800000061ULL,
        L8             = 0x000000080000006cULL,
        LA88           = 0x000008080000616cULL,
    };


    // v2
    typedef const std::map<PVR2TexturePixelFormat, gfx::Format> _pixel2_formathash;

    static const _pixel2_formathash::value_type v2_pixel_formathash_value[] =
    {
        _pixel2_formathash::value_type(PVR2TexturePixelFormat::BGRA8888,        gfx::Format::BGRA8),
        _pixel2_formathash::value_type(PVR2TexturePixelFormat::RGBA8888,        gfx::Format::RGBA8),
        _pixel2_formathash::value_type(PVR2TexturePixelFormat::RGBA4444,        gfx::Format::RGBA4),
        _pixel2_formathash::value_type(PVR2TexturePixelFormat::RGBA5551,        gfx::Format::RGB5A1),
        _pixel2_formathash::value_type(PVR2TexturePixelFormat::RGB565,      gfx::Format::R5G6B5),
        _pixel2_formathash::value_type(PVR2TexturePixelFormat::RGB888,      gfx::Format::RGB8),
        _pixel2_formathash::value_type(PVR2TexturePixelFormat::A8,          gfx::Format::A8),
        _pixel2_formathash::value_type(PVR2TexturePixelFormat::I8,          gfx::Format::L8),
        _pixel2_formathash::value_type(PVR2TexturePixelFormat::AI88,            gfx::Format::LA8),

        _pixel2_formathash::value_type(PVR2TexturePixelFormat::PVRTC2BPP_RGBA,     gfx::Format::PVRTC_RGBA2),
        _pixel2_formathash::value_type(PVR2TexturePixelFormat::PVRTC4BPP_RGBA,      gfx::Format::PVRTC_RGBA4),
    };

    static const int PVR2_MAX_TABLE_ELEMENTS = sizeof(v2_pixel_formathash_value) / sizeof(v2_pixel_formathash_value[0]);
    static const _pixel2_formathash v2_pixel_formathash(v2_pixel_formathash_value, v2_pixel_formathash_value + PVR2_MAX_TABLE_ELEMENTS);

    // v3
    typedef const std::map<PVR3TexturePixelFormat, gfx::Format> _pixel3_formathash;
    static _pixel3_formathash::value_type v3_pixel_formathash_value[] =
    {
        _pixel3_formathash::value_type(PVR3TexturePixelFormat::BGRA8888,    gfx::Format::BGRA8),
        _pixel3_formathash::value_type(PVR3TexturePixelFormat::RGBA8888,    gfx::Format::RGBA8),
        _pixel3_formathash::value_type(PVR3TexturePixelFormat::RGBA4444,    gfx::Format::RGBA4),
        _pixel3_formathash::value_type(PVR3TexturePixelFormat::RGBA5551,    gfx::Format::RGB5A1),
        _pixel3_formathash::value_type(PVR3TexturePixelFormat::RGB565,      gfx::Format::R5G6B5),
        _pixel3_formathash::value_type(PVR3TexturePixelFormat::RGB888,      gfx::Format::RGB8),
        _pixel3_formathash::value_type(PVR3TexturePixelFormat::A8,          gfx::Format::A8),
        _pixel3_formathash::value_type(PVR3TexturePixelFormat::L8,          gfx::Format::L8),
        _pixel3_formathash::value_type(PVR3TexturePixelFormat::LA88,        gfx::Format::LA8),

        _pixel3_formathash::value_type(PVR3TexturePixelFormat::PVRTC2BPP_RGB,       gfx::Format::PVRTC_RGB2),
        _pixel3_formathash::value_type(PVR3TexturePixelFormat::PVRTC2BPP_RGBA,      gfx::Format::PVRTC_RGBA2),
        _pixel3_formathash::value_type(PVR3TexturePixelFormat::PVRTC4BPP_RGB,       gfx::Format::PVRTC_RGB4),
        _pixel3_formathash::value_type(PVR3TexturePixelFormat::PVRTC4BPP_RGBA,      gfx::Format::PVRTC_RGBA4),

        _pixel3_formathash::value_type(PVR3TexturePixelFormat::ETC1,        gfx::Format::ETC_RGB8),
    };

    static const int PVR3_MAX_TABLE_ELEMENTS = sizeof(v3_pixel_formathash_value) / sizeof(v3_pixel_formathash_value[0]);

    static const _pixel3_formathash v3_pixel_formathash(v3_pixel_formathash_value, v3_pixel_formathash_value + PVR3_MAX_TABLE_ELEMENTS);

    typedef struct _PVRTexHeader
    {
        unsigned int headerLength;
        unsigned int height;
        unsigned int width;
        unsigned int numMipmaps;
        unsigned int flags;
        unsigned int dataLength;
        unsigned int bpp;
        unsigned int bitmaskRed;
        unsigned int bitmaskGreen;
        unsigned int bitmaskBlue;
        unsigned int bitmaskAlpha;
        unsigned int pvrTag;
        unsigned int numSurfs;
    } PVRv2TexHeader;

#ifdef _MSC_VER
#pragma pack(push,1)
#endif
    typedef struct
    {
        uint32_t version;
        uint32_t flags;
        uint64_t pixelFormat;
        uint32_t colorSpace;
        uint32_t channelType;
        uint32_t height;
        uint32_t width;
        uint32_t depth;
        uint32_t numberOfSurfaces;
        uint32_t numberOfFaces;
        uint32_t numberOfMipmaps;
        uint32_t metadataLength;
#ifdef _MSC_VER
    } PVRv3TexHeader;
#pragma pack(pop)
#else
    } __attribute__((packed)) PVRv3TexHeader;
#endif
}
//pvr structure end

namespace
{
    typedef struct
    {
        const unsigned char * data;
        ssize_t size;
        int offset;
    }tImageSource;

#ifdef CC_USE_PNG
    static void pngReadCallback(png_structp png_ptr, png_bytep data, png_size_t length)
    {
        tImageSource* isource = (tImageSource*)png_get_io_ptr(png_ptr);

        if((int)(isource->offset + length) <= isource->size)
        {
            memcpy(data, isource->data+isource->offset, length);
            isource->offset += length;
        }
        else
        {
            png_error(png_ptr, "pngReaderCallback failed");
        }
    }
#endif //CC_USE_PNG
}

//////////////////////////////////////////////////////////////////////////
// Implement Image
//////////////////////////////////////////////////////////////////////////

Image::Image(): _renderFormat(gfx::Format::UNKNOWN)
{
}

Image::~Image()
{
    CC_SAFE_FREE(_data);
}

bool Image::initWithImageFile(const std::string& path)
{
    bool ret = false;
    //NOTE: fullPathForFilename isn't threadsafe. we should make sure the parameter is a full path.
//    _filePath = FileUtils::getInstance()->fullPathForFilename(path);
    _filePath = path;

    Data data = FileUtils::getInstance()->getDataFromFile(_filePath);

    if (!data.isNull())
    {
        ret = initWithImageData(data.getBytes(), data.getSize());
    }

    return ret;
}

bool Image::initWithImageData(const unsigned char * data, ssize_t dataLen)
{
    bool ret = false;

    do
    {
        CC_BREAK_IF(! data || dataLen <= 0);

        unsigned char* unpackedData = nullptr;
        ssize_t unpackedLen = 0;

        //detect and unzip the compress file
        if (ZipUtils::isCCZBuffer(data, dataLen))
        {
            unpackedLen = ZipUtils::inflateCCZBuffer(data, dataLen, &unpackedData);
        }
        else if (ZipUtils::isGZipBuffer(data, dataLen))
        {
            unpackedLen = ZipUtils::inflateMemory(const_cast<unsigned char*>(data), dataLen, &unpackedData);
        }
        else
        {
            unpackedData = const_cast<unsigned char*>(data);
            unpackedLen = dataLen;
        }

        _fileType = detectFormat(unpackedData, unpackedLen);

        switch (_fileType)
        {
        case Format::PNG:
            ret = initWithPngData(unpackedData, unpackedLen);
            break;
        case Format::JPG:
            ret = initWithJpgData(unpackedData, unpackedLen);
            break;
        case Format::WEBP:
            ret = initWithWebpData(unpackedData, unpackedLen);
            break;
        case Format::PVR:
            ret = initWithPVRData(unpackedData, unpackedLen);
            break;
        case Format::ETC:
            ret = initWithETCData(unpackedData, unpackedLen);
            break;
        case Format::ETC2:
            ret = initWithETC2Data(unpackedData, unpackedLen);
            break;
        default:
            break;
        }

        if(unpackedData != data)
        {
            free(unpackedData);
        }
    } while (0);

    return ret;
}

bool Image::isPng(const unsigned char * data, ssize_t dataLen)
{
    if (dataLen <= 8)
    {
        return false;
    }

    static const unsigned char PNG_SIGNATURE[] = {0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a};

    return memcmp(PNG_SIGNATURE, data, sizeof(PNG_SIGNATURE)) == 0;
}

bool Image::isEtc(const unsigned char * data, ssize_t dataLen)
{
    return etc1_pkm_is_valid((etc1_byte*)data) ? true : false;
}

bool Image::isEtc2(const unsigned char * data, ssize_t dataLen)
{
    return etc2_pkm_is_valid((etc2_byte*)data) ? true : false;
}

bool Image::isJpg(const unsigned char * data, ssize_t dataLen)
{
    if (dataLen <= 4)
    {
        return false;
    }

    static const unsigned char JPG_SOI[] = {0xFF, 0xD8};

    return memcmp(data, JPG_SOI, 2) == 0;
}

bool Image::isWebp(const unsigned char * data, ssize_t dataLen)
{
    if (dataLen <= 12)
    {
        return false;
    }
    
    static const char* WEBP_RIFF = "RIFF";
    static const char* WEBP_WEBP = "WEBP";
    
    return memcmp(data, WEBP_RIFF, 4) == 0
    && memcmp(static_cast<const unsigned char*>(data) + 8, WEBP_WEBP, 4) == 0;
}

bool Image::isPvr(const unsigned char * data, ssize_t dataLen)
{
    if (static_cast<size_t>(dataLen) < sizeof(PVRv2TexHeader) || static_cast<size_t>(dataLen) < sizeof(PVRv3TexHeader))
    {
        return false;
    }

    const PVRv2TexHeader* headerv2 = static_cast<const PVRv2TexHeader*>(static_cast<const void*>(data));
    const PVRv3TexHeader* headerv3 = static_cast<const PVRv3TexHeader*>(static_cast<const void*>(data));

    return memcmp(&headerv2->pvrTag, gPVRTexIdentifier, strlen(gPVRTexIdentifier)) == 0 || CC_SWAP_INT32_BIG_TO_HOST(headerv3->version) == 0x50565203;
}

Image::Format Image::detectFormat(const unsigned char * data, ssize_t dataLen)
{
    if (isPng(data, dataLen))
    {
        return Format::PNG;
    }
    else if (isJpg(data, dataLen))
    {
        return Format::JPG;
    }
    else if (isWebp(data, dataLen))
    {
        return Format::WEBP;
    }
    else if (isPvr(data, dataLen))
    {
        return Format::PVR;
    }
    else if (isEtc(data, dataLen))
    {
        return Format::ETC;
    }
    else if (isEtc2(data, dataLen))
    {
        return Format::ETC2;
    }
    else
    {
        return Format::UNKNOWN;
    }
}

namespace
{
    /*
     * ERROR HANDLING:
     *
     * The JPEG library's standard error handler (jerror.c) is divided into
     * several "methods" which you can override individually.  This lets you
     * adjust the behavior without duplicating a lot of code, which you might
     * have to update with each future release.
     *
     * We override the "error_exit" method so that control is returned to the
     * library's caller when a fatal error occurs, rather than calling exit()
     * as the standard error_exit method does.
     *
     * We use C's setjmp/longjmp facility to return control.  This means that the
     * routine which calls the JPEG library must first execute a setjmp() call to
     * establish the return point.  We want the replacement error_exit to do a
     * longjmp().  But we need to make the setjmp buffer accessible to the
     * error_exit routine.  To do this, we make a private extension of the
     * standard JPEG error handler object.  (If we were using C++, we'd say we
     * were making a subclass of the regular error handler.)
     *
     * Here's the extended error handler struct:
     */
#if CC_USE_JPEG
    struct MyErrorMgr
    {
        struct jpeg_error_mgr pub;  /* "public" fields */
        jmp_buf setjmp_buffer;  /* for return to caller */
    };

    typedef struct MyErrorMgr * MyErrorPtr;

    /*
     * Here's the routine that will replace the standard error_exit method:
     */

    METHODDEF(void)
    myErrorExit(j_common_ptr cinfo)
    {
        /* cinfo->err really points to a MyErrorMgr struct, so coerce pointer */
        MyErrorPtr myerr = (MyErrorPtr) cinfo->err;

        /* Always display the message. */
        /* We could postpone this until after returning, if we chose. */
        /* internal message function can't show error message in some platforms, so we rewrite it here.
         * edit it if has version conflict.
         */
        //(*cinfo->err->output_message) (cinfo);
        char buffer[JMSG_LENGTH_MAX];
        (*cinfo->err->format_message) (cinfo, buffer);
        CC_LOG_DEBUG("jpeg error: %s", buffer);

        /* Return control to the setjmp point */
        longjmp(myerr->setjmp_buffer, 1);
    }
#endif // CC_USE_JPEG
}

bool Image::initWithJpgData(const unsigned char * data, ssize_t dataLen)
{
#if CC_USE_JPEG
    /* these are standard libjpeg structures for reading(decompression) */
    struct jpeg_decompress_struct cinfo;
    /* We use our private extension JPEG error handler.
     * Note that this struct must live as long as the main JPEG parameter
     * struct, to avoid dangling-pointer problems.
     */
    struct MyErrorMgr jerr;
    /* libjpeg data structure for storing one row, that is, scanline of an image */
    JSAMPROW row_pointer[1] = {0};
    unsigned long location = 0;

    bool ret = false;
    do
    {
        /* We set up the normal JPEG error routines, then override error_exit. */
        cinfo.err = jpeg_std_error(&jerr.pub);
        jerr.pub.error_exit = myErrorExit;
        /* Establish the setjmp return context for MyErrorExit to use. */
        if (setjmp(jerr.setjmp_buffer))
        {
            /* If we get here, the JPEG code has signaled an error.
             * We need to clean up the JPEG object, close the input file, and return.
             */
            jpeg_destroy_decompress(&cinfo);
            break;
        }

        /* setup decompression process and source, then read JPEG header */
        jpeg_create_decompress( &cinfo );

        jpeg_mem_src(&cinfo, const_cast<unsigned char*>(data), dataLen);

        /* reading the image header which contains image information */
#if (JPEG_LIB_VERSION >= 90)
        // libjpeg 0.9 adds stricter types.
        jpeg_read_header(&cinfo, TRUE);
#else
        jpeg_read_header(&cinfo, TRUE);
#endif

        // we only support RGB or grayscale
        if (cinfo.jpeg_color_space == JCS_GRAYSCALE)
            _renderFormat = gfx::Format::L8;
        else {
            cinfo.out_color_space = JCS_RGB;
            _renderFormat = gfx::Format::RGB8;
        }

        /* Start decompression jpeg here */
        jpeg_start_decompress( &cinfo );

        /* init image info */
        _width  = cinfo.output_width;
        _height = cinfo.output_height;
        _dataLen = cinfo.output_width*cinfo.output_height*cinfo.output_components;
        _data = static_cast<unsigned char*>(malloc(_dataLen * sizeof(unsigned char)));
        CC_BREAK_IF(! _data);

        /* now actually read the jpeg into the raw buffer */
        /* read one scan line at a time */
        while (cinfo.output_scanline < cinfo.output_height)
        {
            row_pointer[0] = _data + location;
            location += cinfo.output_width*cinfo.output_components;
            jpeg_read_scanlines(&cinfo, row_pointer, 1);
        }

        /* When read image file with broken data, jpeg_finish_decompress() may cause error.
         * Besides, jpeg_destroy_decompress() shall deallocate and release all memory associated
         * with the decompression object.
         * So it doesn't need to call jpeg_finish_decompress().
         */
        //jpeg_finish_decompress( &cinfo );
        jpeg_destroy_decompress( &cinfo );
        /* wrap up decompression, destroy objects, free pointers and close open files */
        ret = true;
    } while (0);

    return ret;
#endif // CC_USE_JPEG
}

bool Image::initWithPngData(const unsigned char * data, ssize_t dataLen)
{
#if CC_USE_PNG
    // length of bytes to check if it is a valid png file
#define PNGSIGSIZE  8
    bool ret = false;
    png_byte        header[PNGSIGSIZE]   = {0};
    png_structp     png_ptr     =   0;
    png_infop       info_ptr    = 0;

    do
    {
        // png header len is 8 bytes
        CC_BREAK_IF(dataLen < PNGSIGSIZE);

        // check the data is png or not
        memcpy(header, data, PNGSIGSIZE);
        CC_BREAK_IF(png_sig_cmp(header, 0, PNGSIGSIZE));

        // init png_struct
        png_ptr = png_create_read_struct(PNG_LIBPNG_VER_STRING, 0, 0, 0);
        CC_BREAK_IF(! png_ptr);

        // init png_info
        info_ptr = png_create_info_struct(png_ptr);
        CC_BREAK_IF(!info_ptr);

        CC_BREAK_IF(setjmp(png_jmpbuf(png_ptr)));

        // set the read call back function
        tImageSource imageSource;
        imageSource.data    = (unsigned char*)data;
        imageSource.size    = dataLen;
        imageSource.offset  = 0;
        png_set_read_fn(png_ptr, &imageSource, pngReadCallback);

        // read png header info

        // read png file info
        png_read_info(png_ptr, info_ptr);

        _width = png_get_image_width(png_ptr, info_ptr);
        _height = png_get_image_height(png_ptr, info_ptr);
        png_byte bit_depth = png_get_bit_depth(png_ptr, info_ptr);
        png_uint_32 color_type = png_get_color_type(png_ptr, info_ptr);

        //CC_LOG_DEBUG("color type %u", color_type);

        // force palette images to be expanded to 24-bit RGB
        // it may include alpha channel
        if (color_type == PNG_COLOR_TYPE_PALETTE)
        {
            png_set_palette_to_rgb(png_ptr);
        }
        // low-bit-depth grayscale images are to be expanded to 8 bits
        if (color_type == PNG_COLOR_TYPE_GRAY && bit_depth < 8)
        {
            bit_depth = 8;
            png_set_expand_gray_1_2_4_to_8(png_ptr);
        }
        // expand any tRNS chunk data into a full alpha channel
        if (png_get_valid(png_ptr, info_ptr, PNG_INFO_tRNS))
        {
            png_set_tRNS_to_alpha(png_ptr);
        }
        // reduce images with 16-bit samples to 8 bits
        if (bit_depth == 16)
        {
            png_set_strip_16(png_ptr);
        }

        // Expanded earlier for grayscale, now take care of palette and rgb
        if (bit_depth < 8)
        {
            png_set_packing(png_ptr);
        }
        // update info
        png_read_update_info(png_ptr, info_ptr);
        bit_depth = png_get_bit_depth(png_ptr, info_ptr);
        color_type = png_get_color_type(png_ptr, info_ptr);

        switch (color_type)
        {
            case PNG_COLOR_TYPE_GRAY:
                _renderFormat = gfx::Format::L8;
                break;
            case PNG_COLOR_TYPE_GRAY_ALPHA:
                _renderFormat = gfx::Format::LA8;
                break;
            case PNG_COLOR_TYPE_RGB:
                _renderFormat = gfx::Format::RGB8;
                break;
            case PNG_COLOR_TYPE_RGB_ALPHA:
                _renderFormat = gfx::Format::RGBA8;
                break;
            default:
                break;
        }

        // read png data
        png_size_t rowbytes;
        png_bytep* row_pointers = (png_bytep*)malloc( sizeof(png_bytep) * _height );

        rowbytes = png_get_rowbytes(png_ptr, info_ptr);

        _dataLen = rowbytes * _height;
        _data = static_cast<unsigned char*>(malloc(_dataLen * sizeof(unsigned char)));
        if (!_data)
        {
            if (row_pointers != nullptr)
            {
                free(row_pointers);
            }
            break;
        }

        for (unsigned short i = 0; i < _height; ++i)
        {
            row_pointers[i] = _data + i*rowbytes;
        }
        png_read_image(png_ptr, row_pointers);
        png_read_end(png_ptr, nullptr);

        if (row_pointers != nullptr)
        {
            free(row_pointers);
        }

        ret = true;
    } while (0);

    if (png_ptr)
    {
        png_destroy_read_struct(&png_ptr, (info_ptr) ? &info_ptr : 0, 0);
    }
    return ret;
#endif //CC_USE_PNG
}

bool Image::initWithPVRv2Data(const unsigned char * data, ssize_t dataLen)
{
    int width = 0, height = 0;

    //Cast first sizeof(PVRTexHeader) bytes of data stream as PVRTexHeader
    const PVRv2TexHeader *header = static_cast<const PVRv2TexHeader *>(static_cast<const void*>(data));

    //Make sure that tag is in correct formatting
    if (memcmp(&header->pvrTag, gPVRTexIdentifier, strlen(gPVRTexIdentifier)) != 0)
    {
        return false;
    }

    unsigned int flags = CC_SWAP_INT32_LITTLE_TO_HOST(header->flags);
    PVR2TexturePixelFormat formatFlags = static_cast<PVR2TexturePixelFormat>(flags & PVR_TEXTURE_FLAG_TYPE_MASK);
    bool flipped = (flags & (unsigned int)PVR2TextureFlag::VerticalFlip) ? true : false;
    if (flipped)
    {
        CC_LOG_DEBUG("initWithPVRv2Data: WARNING: Image is flipped. Regenerate it using PVRTexTool");
    }

    if (v2_pixel_formathash.find(formatFlags) == v2_pixel_formathash.end())
    {
        CC_LOG_DEBUG("initWithPVRv2Data: WARNING: Unsupported PVR Pixel Format: 0x%02X. Re-encode it with a OpenGL pixel format variant", (int)formatFlags);
        return false;
    }

    auto it = v2_pixel_formathash.find(formatFlags);
    if (it == v2_pixel_formathash.end() )
    {
        CC_LOG_DEBUG("initWithPVRv2Data: WARNING: Unsupported PVR Pixel Format: 0x%02X. Re-encode it with a OpenGL pixel format variant", (int)formatFlags);
        return false;
    }

    _renderFormat = it->second;

    //Get size of mipmap
    _width = width = CC_SWAP_INT32_LITTLE_TO_HOST(header->width);
    _height = height = CC_SWAP_INT32_LITTLE_TO_HOST(header->height);

    //Move by size of header
    _dataLen = dataLen - sizeof(PVRv2TexHeader);
    _data = static_cast<unsigned char*>(malloc(_dataLen * sizeof(unsigned char)));
    memcpy(_data, (unsigned char*)data + sizeof(PVRv2TexHeader), _dataLen);
    
    return true;
}

bool Image::initWithPVRv3Data(const unsigned char * data, ssize_t dataLen)
{
    if (static_cast<size_t>(dataLen) < sizeof(PVRv3TexHeader))
    {
        return false;
    }

    const PVRv3TexHeader *header = static_cast<const PVRv3TexHeader *>(static_cast<const void*>(data));

    // validate version
    if (CC_SWAP_INT32_BIG_TO_HOST(header->version) != 0x50565203)
    {
        CC_LOG_DEBUG("initWithPVRv3Data: WARNING: pvr file version mismatch");
        return false;
    }

    // parse pixel format
    PVR3TexturePixelFormat pixelFormat = static_cast<PVR3TexturePixelFormat>(header->pixelFormat);

    if (v3_pixel_formathash.find(pixelFormat) == v3_pixel_formathash.end())
    {
        CC_LOG_DEBUG("initWithPVRv3Data: WARNING: Unsupported PVR Pixel Format: 0x%016llX. Re-encode it with a OpenGL pixel format variant",
              static_cast<unsigned long long>(pixelFormat));
        return false;
    }

    auto it = v3_pixel_formathash.find(pixelFormat);
    if (it == v3_pixel_formathash.end() )
    {
        CC_LOG_DEBUG("initWithPVRv3Data: WARNING: Unsupported PVR Pixel Format: 0x%016llX. Re-encode it with a OpenGL pixel format variant",
              static_cast<unsigned long long>(pixelFormat));
        return false;
    }

    _renderFormat = it->second;

    // sizing
    _width = CC_SWAP_INT32_LITTLE_TO_HOST(header->width);
    _height = CC_SWAP_INT32_LITTLE_TO_HOST(header->height);

    _dataLen = dataLen - (sizeof(PVRv3TexHeader) + header->metadataLength);
    _data = static_cast<unsigned char*>(malloc(_dataLen * sizeof(unsigned char)));
    memcpy(_data, static_cast<const unsigned char*>(data) + sizeof(PVRv3TexHeader) + header->metadataLength, _dataLen);

    return true;
}

bool Image::initWithETCData(const unsigned char * data, ssize_t dataLen)
{
    const etc1_byte* header = static_cast<const etc1_byte*>(data);

    //check the data
    if (! etc1_pkm_is_valid(header))
    {
        return  false;
    }

    _width = etc1_pkm_get_width(header);
    _height = etc1_pkm_get_height(header);

    if (0 == _width || 0 == _height)
    {
        return false;
    }

    _renderFormat = gfx::Format::ETC_RGB8;
    _dataLen = dataLen - ETC_PKM_HEADER_SIZE;
    _data = static_cast<unsigned char*>(malloc(_dataLen * sizeof(unsigned char)));
    memcpy(_data, static_cast<const unsigned char*>(data) + ETC_PKM_HEADER_SIZE, _dataLen);
    return true;
}

bool Image::initWithETC2Data(const unsigned char * data, ssize_t dataLen)
{
    const etc2_byte* header = static_cast<const etc2_byte*>(data);
    
    //check the data
    if (! etc2_pkm_is_valid(header))
    {
        return  false;
    }
    
    _width = etc2_pkm_get_width(header);
    _height = etc2_pkm_get_height(header);
    
    if (0 == _width || 0 == _height)
    {
        return false;
    }
        
    etc2_uint32 format = etc2_pkm_get_format(header);
    if (format == ETC2_RGB_NO_MIPMAPS)
        _renderFormat = gfx::Format::ETC2_RGB8;
    else
        _renderFormat = gfx::Format::ETC2_RGBA8;
    
    _dataLen = dataLen - ETC2_PKM_HEADER_SIZE;
    _data = static_cast<unsigned char*>(malloc(_dataLen * sizeof(unsigned char)));
    memcpy(_data, static_cast<const unsigned char*>(data) + ETC2_PKM_HEADER_SIZE, _dataLen);
    
    return true;
}

bool Image::initWithPVRData(const unsigned char * data, ssize_t dataLen)
{
    return initWithPVRv2Data(data, dataLen) || initWithPVRv3Data(data, dataLen);
}

bool Image::initWithWebpData(const unsigned char * data, ssize_t dataLen)
{
#if CC_USE_WEBP
    bool ret = false;
    
    do
    {
        WebPDecoderConfig config;
        if (WebPInitDecoderConfig(&config) == 0) break;
        if (WebPGetFeatures(static_cast<const uint8_t*>(data), dataLen, &config.input) != VP8_STATUS_OK) break;
        if (config.input.width == 0 || config.input.height == 0) break;
        
        config.output.colorspace = config.input.has_alpha?MODE_rgbA:MODE_RGB;
        _renderFormat = config.input.has_alpha ? gfx::Format::RGBA8 : gfx::Format::RGB8;
        _width    = config.input.width;
        _height   = config.input.height;
        
        
        _dataLen = _width * _height * (config.input.has_alpha?4:3);
        _data = static_cast<unsigned char*>(malloc(_dataLen * sizeof(unsigned char)));
        
        config.output.u.RGBA.rgba = static_cast<uint8_t*>(_data);
        config.output.u.RGBA.stride = _width * (config.input.has_alpha?4:3);
        config.output.u.RGBA.size = _dataLen;
        config.output.is_external_memory = 1;
        
        if (WebPDecode(static_cast<const uint8_t*>(data), dataLen, &config) != VP8_STATUS_OK)
        {
            free(_data);
            _data = nullptr;
            break;
        }
        
        ret = true;
    } while (0);
    return ret;
#endif // CC_USE_WEBP
}

bool Image::initWithRawData(const unsigned char * data, ssize_t dataLen, int width, int height, int bitsPerComponent, bool preMulti)
{
    bool ret = false;
    do
    {
        CC_BREAK_IF(0 == width || 0 == height);

        _height   = height;
        _width    = width;
        _renderFormat = gfx::Format::RGBA8;

        // only RGBA8888 supported
        int bytesPerComponent = 4;
        _dataLen = height * width * bytesPerComponent;
        _data = static_cast<unsigned char*>(malloc(_dataLen * sizeof(unsigned char)));
        CC_BREAK_IF(! _data);
        memcpy(_data, data, _dataLen);

        ret = true;
    } while (0);

    return ret;
}

}
