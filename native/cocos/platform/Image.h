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
#pragma once

#include "base/Ref.h"
#include <string>
#include <map>

namespace cc {

namespace gfx {
enum class Format;
} // namespace gfx

class Image : public Ref {
public:
    Image();

    /** Supported formats for Image */
    enum class Format {
        //! JPEG
        JPG,
        //! PNG
        PNG,
        //! WebP
        WEBP,
        //! PVR
        PVR,
        //! ETC
        ETC,
        //! ETC2
        ETC2,
        //! ASTC
        ASTC,
        //! Raw Data
        RAW_DATA,
        //! Unknown format
        UNKNOWN
    };


    bool initWithImageFile(const std::string &path);
    bool initWithImageData(const unsigned char *data, ssize_t dataLen);

    // @warning kFmtRawData only support RGBA8888
    bool initWithRawData(const unsigned char *data, ssize_t dataLen, int width, int height, int bitsPerComponent, bool preMulti = false);
    
    // data will be free ouside.
    inline void takeData(unsigned char** outData) {
        *outData = _data; _data = nullptr;
    }

    // Getters
    inline unsigned char *getData() const { return _data; }
    inline ssize_t getDataLen() const { return _dataLen; }
    inline Format getFileType() const { return _fileType; }
    inline gfx::Format getRenderFormat() const { return _renderFormat; }
    inline int getWidth() const { return _width; }
    inline int getHeight() const { return _height; }
    inline std::string getFilePath() const { return _filePath; }

    inline bool isCompressed() const { return _isCompressed; }

protected:
    bool initWithJpgData(const unsigned char *data, ssize_t dataLen);
    bool initWithPngData(const unsigned char *data, ssize_t dataLen);
    bool initWithWebpData(const unsigned char *data, ssize_t dataLen);
    bool initWithPVRData(const unsigned char *data, ssize_t dataLen);
    bool initWithPVRv2Data(const unsigned char *data, ssize_t dataLen);
    bool initWithPVRv3Data(const unsigned char *data, ssize_t dataLen);
    bool initWithETCData(const unsigned char *data, ssize_t dataLen);
    bool initWithETC2Data(const unsigned char *data, ssize_t dataLen);
    bool initWithASTCData(const unsigned char * data, ssize_t dataLen);

protected:
    unsigned char *_data = nullptr;
    ssize_t _dataLen = 0;
    int _width = 0;
    int _height = 0;
    Format _fileType = Format::UNKNOWN;
    gfx::Format _renderFormat;
    std::string _filePath;
    bool _isCompressed = false;

protected:
    // noncopyable
    Image(const Image &) = delete;
    Image &operator=(const Image &) = delete;

    // nonmoveable
    Image(Image &&) = delete;
    Image &operator=(Image &&) = delete;
    
    virtual ~Image();

    Format detectFormat(const unsigned char *data, ssize_t dataLen);
    bool isPng(const unsigned char *data, ssize_t dataLen);
    bool isJpg(const unsigned char *data, ssize_t dataLen);
    bool isWebp(const unsigned char *data, ssize_t dataLen);
    bool isPvr(const unsigned char *data, ssize_t dataLen);
    bool isEtc(const unsigned char *data, ssize_t dataLen);
    bool isEtc2(const unsigned char *data, ssize_t dataLen);
    bool isASTC(const unsigned char * data, ssize_t detaLen);

    gfx::Format getASTCFormat(const unsigned char * pHeader) const;
};

} //namespace cc
