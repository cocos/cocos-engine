/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2016-2022 Xiamen Yaji Software Co., Ltd.

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

#include "Image.h"
#include <cassert>
#include <cctype>
#include <string>
#include <cstring>
#include "base/Config.h" // CC_USE_JPEG, CC_USE_WEBP

#if CC_USE_JPEG
    #include "jpeg/jpeglib.h"
#endif // CC_USE_JPEG

#include "base/CoreStd.h"
#include "base/Data.h"
#include "base/Utils.h"
#include "gfx-base/GFXDef.h"

extern "C" {
#if CC_USE_PNG
    #if __OHOS__ || __LINUX__ || __QNX__
        #include "png.h"
    #else
        #include "png/png.h"
    #endif
#endif //CC_USE_PNG

#include "base/etc1.h"
#include "base/etc2.h"
}

#include "base/astc.h"

#if CC_USE_WEBP
    #include "webp/decode.h"
#endif // CC_USE_WEBP

#include "base/ZipUtils.h"
#include "platform/FileUtils.h"
#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include "platform/android/FileUtils-android.h"
#endif

#include <map>

namespace cc {

//////////////////////////////////////////////////////////////////////////
//struct and data for pvr structure

namespace {
const int PVR_TEXTURE_FLAG_TYPE_MASK = 0xff;

// Values taken from PVRTexture.h from http://www.imgtec.com
enum class PVR2TextureFlag {
    MIPMAP        = (1 << 8),  // has mip map levels
    TWIDDLE       = (1 << 9),  // is twiddled
    BUMPMAP       = (1 << 10), // has normals encoded for a bump map
    TILING        = (1 << 11), // is bordered for tiled pvr
    CUBEMAP       = (1 << 12), // is a cubemap/skybox
    FALSE_MIP_COL = (1 << 13), // are there false colored MIP levels
    VOLUME        = (1 << 14), // is this a volume texture
    ALPHA         = (1 << 15), // v2.1 is there transparency info in the texture
    VERTICAL_FLIP = (1 << 16), // v2.1 is the texture vertically flipped
};

const char G_PVR_TEX_IDENTIFIER[5] = "PVR!";

// v2
enum class PVR2TexturePixelFormat : unsigned char {
    RGBA4444 = 0x10,
    RGBA5551,
    RGBA8888,
    RGB565,
    RGB555, // unsupported
    RGB888,
    I8,
    AI88,
    PVRTC2BPP_RGBA,
    PVRTC4BPP_RGBA,
    BGRA8888,
    A8,
};

// v3
enum class PVR3TexturePixelFormat : uint64_t {
    PVRTC2BPP_RGB      = 0ULL,
    PVRTC2BPP_RGBA     = 1ULL,
    PVRTC4BPP_RGB      = 2ULL,
    PVRTC4BPP_RGBA     = 3ULL,
    PVRTC2_2BPP_RGBA   = 4ULL,
    PVRTC2_4BPP_RGBA   = 5ULL,
    ETC1               = 6ULL,
    DXT1               = 7ULL,
    DXT2               = 8ULL,
    DXT3               = 9ULL,
    DXT4               = 10ULL,
    DXT5               = 11ULL,
    BC1                = 7ULL,
    BC2                = 9ULL,
    BC3                = 11ULL,
    BC4                = 12ULL,
    BC5                = 13ULL,
    BC6                = 14ULL,
    BC7                = 15ULL,
    UYVY               = 16ULL,
    YUY2               = 17ULL,
    B_W1BPP            = 18ULL,
    R9G9B9E5           = 19ULL,
    RGBG8888           = 20ULL,
    GRGB8888           = 21ULL,
    ETC2_RGB           = 22ULL,
    ETC2_RGBA          = 23ULL,
    ETC2_RGBA1         = 24ULL,
    EAC_R11_UNSIGNED   = 25ULL,
    EAC_R11_SIGNED     = 26ULL,
    EAC_R_G11_UNSIGNED = 27ULL,
    EAC_R_G11_SIGNED   = 28ULL,

    BGRA8888 = 0x0808080861726762ULL,
    RGBA8888 = 0x0808080861626772ULL,
    RGBA4444 = 0x0404040461626772ULL,
    RGBA5551 = 0x0105050561626772ULL,
    RGB565   = 0x0005060500626772ULL,
    RGB888   = 0x0008080800626772ULL,
    A8       = 0x0000000800000061ULL,
    L8       = 0x000000080000006cULL,
    LA88     = 0x000008080000616cULL,
};

// v2
using _pixel2_formathash = const std::map<PVR2TexturePixelFormat, gfx::Format>;

const _pixel2_formathash::value_type V2_PIXEL_FORMATHASH_VALUE[] = {
    _pixel2_formathash::value_type(PVR2TexturePixelFormat::BGRA8888, gfx::Format::BGRA8),
    _pixel2_formathash::value_type(PVR2TexturePixelFormat::RGBA8888, gfx::Format::RGBA8),
    _pixel2_formathash::value_type(PVR2TexturePixelFormat::RGBA4444, gfx::Format::RGBA4),
    _pixel2_formathash::value_type(PVR2TexturePixelFormat::RGBA5551, gfx::Format::RGB5A1),
    _pixel2_formathash::value_type(PVR2TexturePixelFormat::RGB565, gfx::Format::R5G6B5),
    _pixel2_formathash::value_type(PVR2TexturePixelFormat::RGB888, gfx::Format::RGB8),
    _pixel2_formathash::value_type(PVR2TexturePixelFormat::A8, gfx::Format::A8),
    _pixel2_formathash::value_type(PVR2TexturePixelFormat::I8, gfx::Format::L8),
    _pixel2_formathash::value_type(PVR2TexturePixelFormat::AI88, gfx::Format::LA8),

    _pixel2_formathash::value_type(PVR2TexturePixelFormat::PVRTC2BPP_RGBA, gfx::Format::PVRTC_RGBA2),
    _pixel2_formathash::value_type(PVR2TexturePixelFormat::PVRTC4BPP_RGBA, gfx::Format::PVRTC_RGBA4),
};

const int                PVR2_MAX_TABLE_ELEMENTS = sizeof(V2_PIXEL_FORMATHASH_VALUE) / sizeof(V2_PIXEL_FORMATHASH_VALUE[0]);
const _pixel2_formathash V2_PIXEL_FORMATHASH(V2_PIXEL_FORMATHASH_VALUE, V2_PIXEL_FORMATHASH_VALUE + PVR2_MAX_TABLE_ELEMENTS);

// v3
using _pixel3_formathash                                = const std::map<PVR3TexturePixelFormat, gfx::Format>;
_pixel3_formathash::value_type v3PixelFormathashValue[] = {
    _pixel3_formathash::value_type(PVR3TexturePixelFormat::BGRA8888, gfx::Format::BGRA8),
    _pixel3_formathash::value_type(PVR3TexturePixelFormat::RGBA8888, gfx::Format::RGBA8),
    _pixel3_formathash::value_type(PVR3TexturePixelFormat::RGBA4444, gfx::Format::RGBA4),
    _pixel3_formathash::value_type(PVR3TexturePixelFormat::RGBA5551, gfx::Format::RGB5A1),
    _pixel3_formathash::value_type(PVR3TexturePixelFormat::RGB565, gfx::Format::R5G6B5),
    _pixel3_formathash::value_type(PVR3TexturePixelFormat::RGB888, gfx::Format::RGB8),
    _pixel3_formathash::value_type(PVR3TexturePixelFormat::A8, gfx::Format::A8),
    _pixel3_formathash::value_type(PVR3TexturePixelFormat::L8, gfx::Format::L8),
    _pixel3_formathash::value_type(PVR3TexturePixelFormat::LA88, gfx::Format::LA8),

    _pixel3_formathash::value_type(PVR3TexturePixelFormat::PVRTC2BPP_RGB, gfx::Format::PVRTC_RGB2),
    _pixel3_formathash::value_type(PVR3TexturePixelFormat::PVRTC2BPP_RGBA, gfx::Format::PVRTC_RGBA2),
    _pixel3_formathash::value_type(PVR3TexturePixelFormat::PVRTC4BPP_RGB, gfx::Format::PVRTC_RGB4),
    _pixel3_formathash::value_type(PVR3TexturePixelFormat::PVRTC4BPP_RGBA, gfx::Format::PVRTC_RGBA4),

    _pixel3_formathash::value_type(PVR3TexturePixelFormat::ETC1, gfx::Format::ETC_RGB8),
};

const int PVR3_MAX_TABLE_ELEMENTS = sizeof(v3PixelFormathashValue) / sizeof(v3PixelFormathashValue[0]);

const _pixel3_formathash V3_PIXEL_FORMATHASH(v3PixelFormathashValue, v3PixelFormathashValue + PVR3_MAX_TABLE_ELEMENTS);

using PVRv2TexHeader = struct PvrTexHeader {
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
};

#ifdef _MSC_VER
    #pragma pack(push, 1)
#endif
using PVRv3TexHeader = struct {
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
};
    #pragma pack(pop)
#else
} __attribute__((packed));
#endif
} // namespace
//pvr structure end

namespace {
using tImageSource = struct {
    const unsigned char *data;
    ssize_t              size;
    int                  offset;
};

#ifdef CC_USE_PNG
void pngReadCallback(png_structp pngPtr, png_bytep data, png_size_t length) {
    auto *isource = static_cast<tImageSource *>(png_get_io_ptr(pngPtr));

    if (static_cast<int>(isource->offset + length) <= isource->size) {
        memcpy(data, isource->data + isource->offset, length);
        isource->offset += static_cast<int>(length);
    } else {
        png_error(pngPtr, "pngReaderCallback failed");
    }
}
#endif //CC_USE_PNG
} // namespace

//////////////////////////////////////////////////////////////////////////
// Implement Image
//////////////////////////////////////////////////////////////////////////

Image::Image() : _renderFormat(gfx::Format::UNKNOWN) {
}

Image::~Image() {
    CC_SAFE_FREE(_data);
}

bool Image::initWithImageFile(const std::string &path) {
    bool ret = false;
    //NOTE: fullPathForFilename isn't threadsafe. we should make sure the parameter is a full path.
    //    _filePath = FileUtils::getInstance()->fullPathForFilename(path);
    _filePath = path;

    Data data = FileUtils::getInstance()->getDataFromFile(_filePath);

    if (!data.isNull()) {
        ret = initWithImageData(data.getBytes(), data.getSize());
    }

    return ret;
}

bool Image::initWithImageData(const unsigned char *data, ssize_t dataLen) {
    bool ret = false;

    do {
        CC_BREAK_IF(!data || dataLen <= 0);

        unsigned char *unpackedData = nullptr;
        ssize_t        unpackedLen  = 0;

        //detect and unzip the compress file
        if (ZipUtils::isCCZBuffer(data, dataLen)) {
            unpackedLen = ZipUtils::inflateCCZBuffer(data, dataLen, &unpackedData);
        } else if (ZipUtils::isGZipBuffer(data, dataLen)) {
            unpackedLen = ZipUtils::inflateMemory(const_cast<unsigned char *>(data), dataLen, &unpackedData);
        } else {
            unpackedData = const_cast<unsigned char *>(data);
            unpackedLen  = dataLen;
        }

        _fileType = detectFormat(unpackedData, unpackedLen);

        switch (_fileType) {
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
            case Format::ASTC:
                ret = initWithASTCData(unpackedData, unpackedLen);
                break;
            default:
                break;
        }

        if (unpackedData != data) {
            free(unpackedData);
        }
    } while (false);

    return ret;
}

bool Image::isPng(const unsigned char *data, ssize_t dataLen) {
    if (dataLen <= 8) {
        return false;
    }

    static const unsigned char PNG_SIGNATURE[] = {0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a};

    return memcmp(PNG_SIGNATURE, data, sizeof(PNG_SIGNATURE)) == 0;
}

bool Image::isEtc(const unsigned char *data, ssize_t /*dataLen*/) {
    return etc1_pkm_is_valid(const_cast<etc1_byte *>(data)) != 0;
}

bool Image::isEtc2(const unsigned char *data, ssize_t /*dataLen*/) {
    return etc2_pkm_is_valid(const_cast<etc2_byte *>(data)) != 0;
}

bool Image::isASTC(const unsigned char *data, ssize_t /*dataLen*/) {
    return astcIsValid(const_cast<astc_byte *>(data));
}

bool Image::isJpg(const unsigned char *data, ssize_t dataLen) {
    if (dataLen <= 4) {
        return false;
    }

    static const unsigned char JPG_SOI[] = {0xFF, 0xD8};

    return memcmp(data, JPG_SOI, 2) == 0;
}

bool Image::isWebp(const unsigned char *data, ssize_t dataLen) {
    if (dataLen <= 12) {
        return false;
    }

    static const char *webpRiff = "RIFF";
    static const char *webpWebp = "WEBP";

    return memcmp(data, webpRiff, 4) == 0 && memcmp(static_cast<const unsigned char *>(data) + 8, webpWebp, 4) == 0;
}

bool Image::isPvr(const unsigned char *data, ssize_t dataLen) {
    if (static_cast<size_t>(dataLen) < sizeof(PVRv2TexHeader) || static_cast<size_t>(dataLen) < sizeof(PVRv3TexHeader)) {
        return false;
    }

    const auto *headerv2 = static_cast<const PVRv2TexHeader *>(static_cast<const void *>(data));
    const auto *headerv3 = static_cast<const PVRv3TexHeader *>(static_cast<const void *>(data));

    return memcmp(&headerv2->pvrTag, G_PVR_TEX_IDENTIFIER, strlen(G_PVR_TEX_IDENTIFIER)) == 0 || CC_SWAP_INT32_BIG_TO_HOST(headerv3->version) == 0x50565203;
}

Image::Format Image::detectFormat(const unsigned char *data, ssize_t dataLen) {
    if (isPng(data, dataLen)) {
        return Format::PNG;
    }
    if (isJpg(data, dataLen)) {
        return Format::JPG;
    }
    if (isWebp(data, dataLen)) {
        return Format::WEBP;
    }
    if (isPvr(data, dataLen)) {
        return Format::PVR;
    }
    if (isEtc(data, dataLen)) {
        return Format::ETC;
    }
    if (isEtc2(data, dataLen)) {
        return Format::ETC2;
    }
    if (isASTC(data, dataLen)) {
        return Format::ASTC;
    }
    return Format::UNKNOWN;
}

gfx::Format Image::getASTCFormat(const unsigned char *pHeader) {
    int xdim = pHeader[ASTC_HEADER_MAGIC];
    int ydim = pHeader[ASTC_HEADER_MAGIC + 1];

    if (xdim == 4) return gfx::Format::ASTC_RGBA_4X4;
    if (xdim == 5) {
        if (ydim == 4) return gfx::Format::ASTC_RGBA_5X4;
        return gfx::Format::ASTC_RGBA_5X5;
    }
    if (xdim == 6) {
        if (ydim == 5) return gfx::Format::ASTC_RGBA_6X5;
        return gfx::Format::ASTC_RGBA_6X6;
    }
    if (xdim == 8) {
        if (ydim == 5) return gfx::Format::ASTC_RGBA_8X5;
        if (ydim == 6) return gfx::Format::ASTC_RGBA_8X6;
        return gfx::Format::ASTC_RGBA_8X8;
    }
    if (xdim == 10) {
        if (ydim == 5) return gfx::Format::ASTC_RGBA_10X5;
        if (ydim == 6) return gfx::Format::ASTC_RGBA_10X6;
        if (ydim == 8) return gfx::Format::ASTC_RGBA_10X8;
        return gfx::Format::ASTC_RGBA_10X10;
    }
    if (ydim == 10) return gfx::Format::ASTC_RGBA_12X10;
    return gfx::Format::ASTC_RGBA_12X12;
}

namespace {
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
struct MyErrorMgr {
    struct jpeg_error_mgr pub;           /* "public" fields */
    jmp_buf               setjmp_buffer; /* for return to caller */
};

using MyErrorPtr = struct MyErrorMgr *;

/*
 * Here's the routine that will replace the standard error_exit method:
 */

void myErrorExit(j_common_ptr cinfo) {
    /* cinfo->err really points to a MyErrorMgr struct, so coerce pointer */
    auto *myerr = reinterpret_cast<MyErrorPtr>(cinfo->err);

    /* Always display the message. */
    /* We could postpone this until after returning, if we chose. */
    /* internal message function can't show error message in some platforms, so we rewrite it here.
     * edit it if has version conflict.
     */
    //(*cinfo->err->output_message) (cinfo);
    char buffer[JMSG_LENGTH_MAX];
    (*cinfo->err->format_message)(cinfo, buffer);
    CC_LOG_DEBUG("jpeg error: %s", buffer);

    /* Return control to the setjmp point */
    longjmp(myerr->setjmp_buffer, 1);
}
#endif // CC_USE_JPEG
} // namespace

bool Image::initWithJpgData(const unsigned char *data, ssize_t dataLen) {
#if CC_USE_JPEG
    /* these are standard libjpeg structures for reading(decompression) */
    struct jpeg_decompress_struct cinfo;
    /* We use our private extension JPEG error handler.
     * Note that this struct must live as long as the main JPEG parameter
     * struct, to avoid dangling-pointer problems.
     */
    struct MyErrorMgr jerr;
    /* libjpeg data structure for storing one row, that is, scanline of an image */
    JSAMPROW rowPointer[1] = {nullptr};
    uint32_t location      = 0;

    bool ret = false;
    do {
        /* We set up the normal JPEG error routines, then override error_exit. */
        cinfo.err           = jpeg_std_error(&jerr.pub);
        jerr.pub.error_exit = myErrorExit;
        /* Establish the setjmp return context for MyErrorExit to use. */
        if (setjmp(jerr.setjmp_buffer)) {
            /* If we get here, the JPEG code has signaled an error.
             * We need to clean up the JPEG object, close the input file, and return.
             */
            jpeg_destroy_decompress(&cinfo);
            break;
        }

        /* setup decompression process and source, then read JPEG header */
        jpeg_create_decompress(&cinfo);

        jpeg_mem_src(&cinfo, const_cast<unsigned char *>(data), dataLen);

        /* reading the image header which contains image information */
    #if (JPEG_LIB_VERSION >= 90)
        // libjpeg 0.9 adds stricter types.
        jpeg_read_header(&cinfo, TRUE);
    #else
        jpeg_read_header(&cinfo, TRUE);
    #endif

        // we only support RGB or grayscale
        if (cinfo.jpeg_color_space == JCS_GRAYSCALE) {
            _renderFormat = gfx::Format::L8;
        } else {
            cinfo.out_color_space = JCS_RGB;
            _renderFormat         = gfx::Format::RGB8;
        }

        /* Start decompression jpeg here */
        jpeg_start_decompress(&cinfo);

        /* init image info */
        _isCompressed = false;
        _width        = cinfo.output_width;
        _height       = cinfo.output_height;
        _dataLen      = cinfo.output_width * cinfo.output_height * cinfo.output_components;
        _data         = static_cast<unsigned char *>(malloc(_dataLen * sizeof(unsigned char)));
        CC_BREAK_IF(!_data);

        /* now actually read the jpeg into the raw buffer */
        /* read one scan line at a time */
        while (cinfo.output_scanline < cinfo.output_height) {
            rowPointer[0] = _data + location;
            location += cinfo.output_width * cinfo.output_components;
            jpeg_read_scanlines(&cinfo, rowPointer, 1);
        }

        /* When read image file with broken data, jpeg_finish_decompress() may cause error.
         * Besides, jpeg_destroy_decompress() shall deallocate and release all memory associated
         * with the decompression object.
         * So it doesn't need to call jpeg_finish_decompress().
         */
        //jpeg_finish_decompress( &cinfo );
        jpeg_destroy_decompress(&cinfo);
        /* wrap up decompression, destroy objects, free pointers and close open files */
        ret = true;
    } while (false);

    return ret;
#endif // CC_USE_JPEG
}

bool Image::initWithPngData(const unsigned char *data, ssize_t dataLen) {
#if CC_USE_PNG
    // length of bytes to check if it is a valid png file
    #define PNGSIGSIZE 8
    bool        ret                = false;
    png_byte    header[PNGSIGSIZE] = {0};
    png_structp pngPtr             = nullptr;
    png_infop   infoPtr            = nullptr;

    do {
        // png header len is 8 bytes
        CC_BREAK_IF(dataLen < PNGSIGSIZE);

        // check the data is png or not
        memcpy(header, data, PNGSIGSIZE);
        CC_BREAK_IF(png_sig_cmp(header, 0, PNGSIGSIZE));

        // init png_struct
        pngPtr = png_create_read_struct(PNG_LIBPNG_VER_STRING, nullptr, nullptr, nullptr);
        CC_BREAK_IF(!pngPtr);

        // init png_info
        infoPtr = png_create_info_struct(pngPtr);
        CC_BREAK_IF(!infoPtr);

        CC_BREAK_IF(setjmp(png_jmpbuf(pngPtr)));

        // set the read call back function
        tImageSource imageSource;
        imageSource.data   = const_cast<unsigned char *>(data);
        imageSource.size   = dataLen;
        imageSource.offset = 0;
        png_set_read_fn(pngPtr, &imageSource, pngReadCallback);

        // read png header info

        // read png file info
        png_read_info(pngPtr, infoPtr);

        _isCompressed         = false;
        _width                = png_get_image_width(pngPtr, infoPtr);
        _height               = png_get_image_height(pngPtr, infoPtr);
        png_byte    bitDepth  = png_get_bit_depth(pngPtr, infoPtr);
        png_uint_32 colorType = png_get_color_type(pngPtr, infoPtr);

        //CC_LOG_DEBUG("color type %u", color_type);

        // force palette images to be expanded to 24-bit RGB
        // it may include alpha channel
        if (colorType == PNG_COLOR_TYPE_PALETTE) {
            png_set_palette_to_rgb(pngPtr);
        }
        // low-bit-depth grayscale images are to be expanded to 8 bits
        if (colorType == PNG_COLOR_TYPE_GRAY && bitDepth < 8) {
            bitDepth = 8;
            png_set_expand_gray_1_2_4_to_8(pngPtr);
        }
        // expand any tRNS chunk data into a full alpha channel
        if (png_get_valid(pngPtr, infoPtr, PNG_INFO_tRNS)) {
            png_set_tRNS_to_alpha(pngPtr);
        }
        // reduce images with 16-bit samples to 8 bits
        if (bitDepth == 16) {
            png_set_strip_16(pngPtr);
        }

        // Expanded earlier for grayscale, now take care of palette and rgb
        if (bitDepth < 8) {
            png_set_packing(pngPtr);
        }
        // update info
        png_read_update_info(pngPtr, infoPtr);
        colorType = png_get_color_type(pngPtr, infoPtr);

        switch (colorType) {
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
        auto *     rowPointers = static_cast<png_bytep *>(malloc(sizeof(png_bytep) * _height));

        rowbytes = png_get_rowbytes(pngPtr, infoPtr);

        _dataLen = rowbytes * _height;
        _data    = static_cast<unsigned char *>(malloc(_dataLen * sizeof(unsigned char)));
        if (!_data) {
            if (rowPointers != nullptr) {
                free(rowPointers);
            }
            break;
        }

        for (int i = 0; i < _height; ++i) {
            rowPointers[i] = _data + i * rowbytes;
        }
        png_read_image(pngPtr, rowPointers);
        png_read_end(pngPtr, nullptr);

        if (rowPointers != nullptr) {
            free(rowPointers);
        }

        ret = true;
    } while (false);

    if (pngPtr) {
        png_destroy_read_struct(&pngPtr, (infoPtr) ? &infoPtr : nullptr, nullptr);
    }
    return ret;
#endif //CC_USE_PNG
}

bool Image::initWithPVRv2Data(const unsigned char *data, ssize_t dataLen) {
    int width  = 0;
    int height = 0;

    //Cast first sizeof(PVRTexHeader) bytes of data stream as PVRTexHeader
    const auto *header = static_cast<const PVRv2TexHeader *>(static_cast<const void *>(data));

    //Make sure that tag is in correct formatting
    if (memcmp(&header->pvrTag, G_PVR_TEX_IDENTIFIER, strlen(G_PVR_TEX_IDENTIFIER)) != 0) {
        return false;
    }

    unsigned int flags       = CC_SWAP_INT32_LITTLE_TO_HOST(header->flags);
    auto         formatFlags = static_cast<PVR2TexturePixelFormat>(flags & PVR_TEXTURE_FLAG_TYPE_MASK);
    bool         flipped     = (flags & static_cast<unsigned int>(PVR2TextureFlag::VERTICAL_FLIP)) != 0;
    if (flipped) {
        CC_LOG_DEBUG("initWithPVRv2Data: WARNING: Image is flipped. Regenerate it using PVRTexTool");
    }

    if (V2_PIXEL_FORMATHASH.find(formatFlags) == V2_PIXEL_FORMATHASH.end()) {
        CC_LOG_DEBUG("initWithPVRv2Data: WARNING: Unsupported PVR Pixel Format: 0x%02X. Re-encode it with a OpenGL pixel format variant", (int)formatFlags);
        return false;
    }

    auto it = V2_PIXEL_FORMATHASH.find(formatFlags);
    if (it == V2_PIXEL_FORMATHASH.end()) {
        CC_LOG_DEBUG("initWithPVRv2Data: WARNING: Unsupported PVR Pixel Format: 0x%02X. Re-encode it with a OpenGL pixel format variant", (int)formatFlags);
        return false;
    }

    _renderFormat = it->second;

    //Get size of mipmap
    _width        = CC_SWAP_INT32_LITTLE_TO_HOST(header->width);
    _height       = CC_SWAP_INT32_LITTLE_TO_HOST(header->height);
    _isCompressed = true;

    //Move by size of header
    _dataLen = dataLen - sizeof(PVRv2TexHeader);
    _data    = static_cast<unsigned char *>(malloc(_dataLen * sizeof(unsigned char)));
    memcpy(_data, const_cast<unsigned char *>(data) + sizeof(PVRv2TexHeader), _dataLen);

    return true;
}

bool Image::initWithPVRv3Data(const unsigned char *data, ssize_t dataLen) {
    if (static_cast<size_t>(dataLen) < sizeof(PVRv3TexHeader)) {
        return false;
    }

    const auto *header = static_cast<const PVRv3TexHeader *>(static_cast<const void *>(data));

    // validate version
    if (CC_SWAP_INT32_BIG_TO_HOST(header->version) != 0x50565203) {
        CC_LOG_DEBUG("initWithPVRv3Data: WARNING: pvr file version mismatch");
        return false;
    }

    // parse pixel format
    auto pixelFormat = static_cast<PVR3TexturePixelFormat>(header->pixelFormat);

    if (V3_PIXEL_FORMATHASH.find(pixelFormat) == V3_PIXEL_FORMATHASH.end()) {
        CC_LOG_DEBUG("initWithPVRv3Data: WARNING: Unsupported PVR Pixel Format: 0x%016llX. Re-encode it with a OpenGL pixel format variant",
                     static_cast<unsigned long long>(pixelFormat));
        return false;
    }

    auto it = V3_PIXEL_FORMATHASH.find(pixelFormat);
    if (it == V3_PIXEL_FORMATHASH.end()) {
        CC_LOG_DEBUG("initWithPVRv3Data: WARNING: Unsupported PVR Pixel Format: 0x%016llX. Re-encode it with a OpenGL pixel format variant",
                     static_cast<unsigned long long>(pixelFormat));
        return false;
    }

    _renderFormat = it->second;

    // sizing
    _width        = CC_SWAP_INT32_LITTLE_TO_HOST(header->width);
    _height       = CC_SWAP_INT32_LITTLE_TO_HOST(header->height);
    _isCompressed = true;

    _dataLen = dataLen - (sizeof(PVRv3TexHeader) + header->metadataLength);
    _data    = static_cast<unsigned char *>(malloc(_dataLen * sizeof(unsigned char)));
    memcpy(_data, static_cast<const unsigned char *>(data) + sizeof(PVRv3TexHeader) + header->metadataLength, _dataLen);

    return true;
}

bool Image::initWithETCData(const unsigned char *data, ssize_t dataLen) {
    const auto *header = static_cast<const etc1_byte *>(data);

    //check the data
    if (!etc1_pkm_is_valid(header)) {
        return false;
    }

    _width        = etc1_pkm_get_width(header);
    _height       = etc1_pkm_get_height(header);
    _isCompressed = true;

    if (0 == _width || 0 == _height) {
        return false;
    }

    _renderFormat = gfx::Format::ETC_RGB8;
    _dataLen      = dataLen - ETC_PKM_HEADER_SIZE;
    _data         = static_cast<unsigned char *>(malloc(_dataLen * sizeof(unsigned char)));
    memcpy(_data, static_cast<const unsigned char *>(data) + ETC_PKM_HEADER_SIZE, _dataLen);
    return true;
}

bool Image::initWithETC2Data(const unsigned char *data, ssize_t dataLen) {
    const auto *header = static_cast<const etc2_byte *>(data);

    //check the data
    if (!etc2_pkm_is_valid(header)) {
        return false;
    }

    _width        = etc2_pkm_get_width(header);
    _height       = etc2_pkm_get_height(header);
    _isCompressed = true;

    if (0 == _width || 0 == _height) {
        return false;
    }

    etc2_uint32 format = etc2_pkm_get_format(header);
    if (format == ETC2_RGB_NO_MIPMAPS) {
        _renderFormat = gfx::Format::ETC2_RGB8;
    } else {
        _renderFormat = gfx::Format::ETC2_RGBA8;
    }

    _dataLen = dataLen - ETC2_PKM_HEADER_SIZE;
    _data    = static_cast<unsigned char *>(malloc(_dataLen * sizeof(unsigned char)));
    memcpy(_data, static_cast<const unsigned char *>(data) + ETC2_PKM_HEADER_SIZE, _dataLen);
    return true;
}

bool Image::initWithASTCData(const unsigned char *data, ssize_t dataLen) {
    const auto *header = static_cast<const astc_byte *>(data);

    //check the data
    if (!astcIsValid(header)) {
        return false;
    }

    _width        = astcGetWidth(header);
    _height       = astcGetHeight(header);
    _isCompressed = true;

    if (0 == _width || 0 == _height) {
        return false;
    }

    _renderFormat = getASTCFormat(header);

    _dataLen = dataLen - ASTC_HEADER_SIZE;
    _data    = static_cast<unsigned char *>(malloc(_dataLen * sizeof(unsigned char)));
    memcpy(_data, static_cast<const unsigned char *>(data) + ASTC_HEADER_SIZE, _dataLen);
    // if (_data == nullptr) {
    //     CCLOG("initWithASTCData: ERROR: Image _data is null!");
    //     return false;
    // }

    return true;
}

bool Image::initWithPVRData(const unsigned char *data, ssize_t dataLen) {
    return initWithPVRv2Data(data, dataLen) || initWithPVRv3Data(data, dataLen);
}

bool Image::initWithWebpData(const unsigned char *data, ssize_t dataLen) {
#if CC_USE_WEBP
    bool ret = false;

    do {
        WebPDecoderConfig config;
        if (WebPInitDecoderConfig(&config) == 0) break;
        if (WebPGetFeatures(static_cast<const uint8_t *>(data), dataLen, &config.input) != VP8_STATUS_OK) break;
        if (config.input.width == 0 || config.input.height == 0) break;

        config.output.colorspace = config.input.has_alpha ? MODE_rgbA : MODE_RGB;
        _renderFormat            = config.input.has_alpha ? gfx::Format::RGBA8 : gfx::Format::RGB8;
        _width                   = config.input.width;
        _height                  = config.input.height;
        _isCompressed            = false;

        _dataLen = _width * _height * (config.input.has_alpha ? 4 : 3);
        _data    = static_cast<unsigned char *>(malloc(_dataLen * sizeof(unsigned char)));

        config.output.u.RGBA.rgba        = static_cast<uint8_t *>(_data);
        config.output.u.RGBA.stride      = _width * (config.input.has_alpha ? 4 : 3);
        config.output.u.RGBA.size        = _dataLen;
        config.output.is_external_memory = 1;

        if (WebPDecode(static_cast<const uint8_t *>(data), dataLen, &config) != VP8_STATUS_OK) {
            free(_data);
            _data = nullptr;
            break;
        }

        ret = true;
    } while (false);
    return ret;
#endif // CC_USE_WEBP
}

bool Image::initWithRawData(const unsigned char *data, ssize_t /*dataLen*/, int width, int height, int /*bitsPerComponent*/, bool /*preMulti*/) {
    bool ret = false;
    do {
        CC_BREAK_IF(0 == width || 0 == height);

        _height       = height;
        _width        = width;
        _renderFormat = gfx::Format::RGBA8;
        _isCompressed = false;

        // only RGBA8888 supported
        int bytesPerComponent = 4;
        _dataLen              = height * width * bytesPerComponent;
        _data                 = static_cast<unsigned char *>(malloc(_dataLen * sizeof(unsigned char)));
        CC_BREAK_IF(!_data);
        memcpy(_data, data, _dataLen);

        ret = true;
    } while (false);

    return ret;
}

} // namespace cc
