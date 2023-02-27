/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

// IDEA: hack, must be included before ziputils
#include "base/ZipUtils.h"

#include <mutex>

#ifdef MINIZIP_FROM_SYSTEM
    #include <minizip/unzip.h>
#else // from our embedded sources
    #include "unzip/unzip.h"
#endif

#include <zlib.h>
#include <cstdlib>
#include <memory>
#include "base/Data.h"
#include "base/Locked.h"
#include "base/Log.h"
#include "base/memory/Memory.h"
#include "platform/FileUtils.h"
#include "unzip/ioapi_mem.h"

// minizip 1.2.0 is same with other platforms
#ifndef unzGoToFirstFile64
    #define unzGoToFirstFile64(A, B, C, D) unzGoToFirstFile2(A, B, C, D, NULL, 0, NULL, 0) // NOLINT(readability-identifier-naming)
    #define unzGoToNextFile64(A, B, C, D)  unzGoToNextFile2(A, B, C, D, NULL, 0, NULL, 0)  // NOLINT(readability-identifier-naming)#endif
#endif

namespace cc {

unsigned int ZipUtils::encryptedPvrKeyParts[4] = {0, 0, 0, 0};
unsigned int ZipUtils::encryptionKey[1024];
bool ZipUtils::encryptionKeyIsValid = false;

// --------------------- ZipUtils ---------------------

inline void ZipUtils::decodeEncodedPvr(unsigned int *data, uint32_t len) {
    const int enclen = 1024;
    const int securelen = 512;
    const int distance = 64;

    // check if key was set
    // make sure to call caw_setkey_part() for all 4 key parts
    CC_ASSERT(ZipUtils::encryptedPvrKeyParts[0] != 0); // CCZ file is encrypted but key part 0 is not set. Call ZipUtils::setPvrEncryptionKeyPart(...)?
    CC_ASSERT(ZipUtils::encryptedPvrKeyParts[1] != 0); // CCZ file is encrypted but key part 1 is not set. Call ZipUtils::setPvrEncryptionKeyPart(...)?
    CC_ASSERT(ZipUtils::encryptedPvrKeyParts[2] != 0); // CCZ file is encrypted but key part 2 is not set. Call ZipUtils::setPvrEncryptionKeyPart(...)?
    CC_ASSERT(ZipUtils::encryptedPvrKeyParts[3] != 0); // CCZ file is encrypted but key part 3 is not set. Call ZipUtils::setPvrEncryptionKeyPart(...)?

    // create long key
    if (!ZipUtils::encryptionKeyIsValid) {
        unsigned int y{0};
        unsigned int p{0};
        unsigned int e{0};
        unsigned int rounds = 6;
        unsigned int sum = 0;
        unsigned int z = ZipUtils::encryptionKey[enclen - 1];

        do {
#define DELTA 0x9e3779b9
#define MX    (((z >> 5 ^ y << 2) + (y >> 3 ^ z << 4)) ^ ((sum ^ y) + (ZipUtils::encryptedPvrKeyParts[(p & 3) ^ e] ^ z)))

            sum += DELTA;
            e = (sum >> 2) & 3;

            for (p = 0; p < enclen - 1; p++) {
                y = ZipUtils::encryptionKey[p + 1];
                z = ZipUtils::encryptionKey[p] += MX;
            }

            y = ZipUtils::encryptionKey[0];
            z = ZipUtils::encryptionKey[enclen - 1] += MX;

        } while (--rounds);

        ZipUtils::encryptionKeyIsValid = true;
    }

    int b = 0;
    int i = 0;

    // encrypt first part completely
    for (; i < len && i < securelen; i++) {
        data[i] ^= ZipUtils::encryptionKey[b++];

        if (b >= enclen) {
            b = 0;
        }
    }

    // encrypt second section partially
    for (; i < len; i += distance) {
        data[i] ^= ZipUtils::encryptionKey[b++];

        if (b >= enclen) {
            b = 0;
        }
    }
}

inline unsigned int ZipUtils::checksumPvr(const unsigned int *data, uint32_t len) {
    unsigned int cs = 0;
    const int cslen = 128;

    len = (len < cslen) ? len : cslen;

    for (int i = 0; i < len; i++) {
        cs = cs ^ data[i];
    }

    return cs;
}

// memory in iPhone is precious
// Should buffer factor be 1.5 instead of 2 ?
#define BUFFER_INC_FACTOR (2)

int ZipUtils::inflateMemoryWithHint(unsigned char *in, uint32_t inLength, unsigned char **out, uint32_t *outLength, uint32_t outLengthHint) {
    /* ret value */
    int err = Z_OK;
    uint32_t bufferSize = outLengthHint;
    *out = static_cast<unsigned char *>(malloc(bufferSize));

    z_stream descompressionStream; /* decompression stream */
    descompressionStream.zalloc = static_cast<alloc_func>(nullptr);
    descompressionStream.zfree = static_cast<free_func>(nullptr);
    descompressionStream.opaque = static_cast<voidpf>(nullptr);

    descompressionStream.next_in = in;
    descompressionStream.avail_in = inLength;
    descompressionStream.next_out = *out;
    descompressionStream.avail_out = bufferSize;

    /* window size to hold 256k */
    if ((err = inflateInit2(&descompressionStream, 15 + 32)) != Z_OK) {
        return err;
    }

    for (;;) {
        err = inflate(&descompressionStream, Z_NO_FLUSH);

        if (err == Z_STREAM_END) {
            break;
        }

        switch (err) {
            case Z_NEED_DICT:
                err = Z_DATA_ERROR;
            case Z_DATA_ERROR:
            case Z_MEM_ERROR:
                inflateEnd(&descompressionStream);
                return err;
        }

        // not enough memory ?
        if (err != Z_STREAM_END) {
            *out = static_cast<unsigned char *>(realloc(*out, bufferSize * BUFFER_INC_FACTOR));

            /* not enough memory, ouch */
            if (!*out) {
                CC_LOG_DEBUG("ZipUtils: realloc failed");
                inflateEnd(&descompressionStream);
                return Z_MEM_ERROR;
            }

            descompressionStream.next_out = *out + bufferSize;
            descompressionStream.avail_out = static_cast<unsigned int>(bufferSize);
            bufferSize *= BUFFER_INC_FACTOR;
        }
    }

    *outLength = bufferSize - descompressionStream.avail_out;
    err = inflateEnd(&descompressionStream);
    return err;
}

uint32_t ZipUtils::inflateMemoryWithHint(unsigned char *in, uint32_t inLength, unsigned char **out, uint32_t outLengthHint) {
    uint32_t outLength = 0;
    int err = inflateMemoryWithHint(in, inLength, out, &outLength, outLengthHint);

    if (err != Z_OK || *out == nullptr) {
        if (err == Z_MEM_ERROR) {
            CC_LOG_DEBUG("ZipUtils: Out of memory while decompressing map data!");
        } else if (err == Z_VERSION_ERROR) {
            CC_LOG_DEBUG("ZipUtils: Incompatible zlib version!");
        } else if (err == Z_DATA_ERROR) {
            CC_LOG_DEBUG("ZipUtils: Incorrect zlib compressed data!");
        } else {
            CC_LOG_DEBUG("ZipUtils: Unknown error while decompressing map data!");
        }

        if (*out) {
            free(*out);
            *out = nullptr;
        }
        outLength = 0;
    }

    return outLength;
}

uint32_t ZipUtils::inflateMemory(unsigned char *in, uint32_t inLength, unsigned char **out) {
    // 256k for hint
    return inflateMemoryWithHint(in, inLength, out, 256 * 1024);
}

int ZipUtils::inflateGZipFile(const char *path, unsigned char **out) {
    int len;
    int offset = 0;

    CC_ASSERT(out);
    CC_ASSERT(&*out);

    gzFile inFile = gzopen(FileUtils::getInstance()->getSuitableFOpen(path).c_str(), "rb");
    if (inFile == nullptr) {
        CC_LOG_DEBUG("ZipUtils: error open gzip file: %s", path);
        return -1;
    }

    /* 512k initial decompress buffer */
    unsigned int bufferSize = 512 * 1024;
    unsigned int totalBufferSize = bufferSize;

    *out = static_cast<unsigned char *>(malloc(bufferSize));
    if (!out) {
        CC_LOG_DEBUG("ZipUtils: out of memory");
        return -1;
    }

    for (;;) {
        len = gzread(inFile, *out + offset, bufferSize);
        if (len < 0) {
            CC_LOG_DEBUG("ZipUtils: error in gzread");
            free(*out);
            *out = nullptr;
            return -1;
        }
        if (len == 0) {
            break;
        }

        offset += len;

        // finish reading the file
        if (static_cast<unsigned int>(len) < bufferSize) {
            break;
        }

        bufferSize *= BUFFER_INC_FACTOR;
        totalBufferSize += bufferSize;
        auto *tmp = static_cast<unsigned char *>(realloc(*out, totalBufferSize));

        if (!tmp) {
            CC_LOG_DEBUG("ZipUtils: out of memory");
            free(*out);
            *out = nullptr;
            return -1;
        }

        *out = tmp;
    }

    if (gzclose(inFile) != Z_OK) {
        CC_LOG_DEBUG("ZipUtils: gzclose failed");
    }

    return offset;
}

bool ZipUtils::isCCZFile(const char *path) {
    // load file into memory
    Data compressedData = FileUtils::getInstance()->getDataFromFile(path);

    if (compressedData.isNull()) {
        CC_LOG_DEBUG("ZipUtils: loading file failed");
        return false;
    }

    return isCCZBuffer(compressedData.getBytes(), compressedData.getSize());
}

bool ZipUtils::isCCZBuffer(const unsigned char *buffer, uint32_t len) {
    if (len < sizeof(struct CCZHeader)) {
        return false;
    }

    const auto *header = reinterpret_cast<const struct CCZHeader *>(buffer);
    return header->sig[0] == 'C' && header->sig[1] == 'C' && header->sig[2] == 'Z' && (header->sig[3] == '!' || header->sig[3] == 'p');
}

bool ZipUtils::isGZipFile(const char *path) {
    // load file into memory
    Data compressedData = FileUtils::getInstance()->getDataFromFile(path);

    if (compressedData.isNull()) {
        CC_LOG_DEBUG("ZipUtils: loading file failed");
        return false;
    }

    return isGZipBuffer(compressedData.getBytes(), compressedData.getSize());
}

bool ZipUtils::isGZipBuffer(const unsigned char *buffer, uint32_t len) {
    if (len < 2) {
        return false;
    }

    return buffer[0] == 0x1F && buffer[1] == 0x8B;
}

int ZipUtils::inflateCCZBuffer(const unsigned char *buffer, uint32_t bufferLen, unsigned char **out) {
    const auto *header = reinterpret_cast<const struct CCZHeader *>(buffer);

    // verify header
    if (header->sig[0] == 'C' && header->sig[1] == 'C' && header->sig[2] == 'Z' && header->sig[3] == '!') {
        // verify header version
        unsigned int version = CC_SWAP_INT16_BIG_TO_HOST(header->version);
        if (version > 2) {
            CC_LOG_DEBUG("Unsupported CCZ header format");
            return -1;
        }

        // verify compression format
        if (CC_SWAP_INT16_BIG_TO_HOST(header->compression_type) != CCZ_COMPRESSION_ZLIB) {
            CC_LOG_DEBUG("CCZ Unsupported compression method");
            return -1;
        }
    } else if (header->sig[0] == 'C' && header->sig[1] == 'C' && header->sig[2] == 'Z' && header->sig[3] == 'p') {
        // encrypted ccz file
        header = reinterpret_cast<const struct CCZHeader *>(buffer);

        // verify header version
        unsigned int version = CC_SWAP_INT16_BIG_TO_HOST(header->version);
        if (version > 0) {
            CC_LOG_DEBUG("Unsupported CCZ header format");
            return -1;
        }

        // verify compression format
        if (CC_SWAP_INT16_BIG_TO_HOST(header->compression_type) != CCZ_COMPRESSION_ZLIB) {
            CC_LOG_DEBUG("CCZ Unsupported compression method");
            return -1;
        }

#if CC_DEBUG > 0
        // decrypt
        auto *ints = reinterpret_cast<unsigned int *>(const_cast<unsigned char *>(buffer) + 12);
        uint32_t enclen = (bufferLen - 12) / 4;

        decodeEncodedPvr(ints, enclen);
        // verify checksum in debug mode
        unsigned int calculated = checksumPvr(ints, enclen);
        unsigned int required = CC_SWAP_INT32_BIG_TO_HOST(header->reserved);

        if (calculated != required) {
            CC_LOG_DEBUG("Can't decrypt image file. Is the decryption key valid?");
            return -1;
        }
#endif
    } else {
        CC_LOG_DEBUG("Invalid CCZ file");
        return -1;
    }

    unsigned int len = CC_SWAP_INT32_BIG_TO_HOST(header->len);

    *out = static_cast<unsigned char *>(malloc(len));
    if (!*out) {
        CC_LOG_DEBUG("CCZ: Failed to allocate memory for texture");
        return -1;
    }

    uLongf destlen = len;
    const auto *source = reinterpret_cast<const Bytef *>(buffer + sizeof(*header));
    int ret = uncompress(*out, &destlen, source, static_cast<uLong>(bufferLen - sizeof(*header)));

    if (ret != Z_OK) {
        CC_LOG_DEBUG("CCZ: Failed to uncompress data");
        free(*out);
        *out = nullptr;
        return -1;
    }

    return static_cast<int>(len);
}

int ZipUtils::inflateCCZFile(const char *path, unsigned char **out) {
    CC_ASSERT(out);

    // load file into memory
    Data compressedData = FileUtils::getInstance()->getDataFromFile(path);

    if (compressedData.isNull()) {
        CC_LOG_DEBUG("Error loading CCZ compressed file");
        return -1;
    }

    return inflateCCZBuffer(compressedData.getBytes(), compressedData.getSize(), out);
}

void ZipUtils::setPvrEncryptionKeyPart(int index, unsigned int value) {
    CC_ASSERT_GE(index, 0);
    CC_ASSERT_LE(index, 3);

    if (ZipUtils::encryptedPvrKeyParts[index] != value) {
        ZipUtils::encryptedPvrKeyParts[index] = value;
        ZipUtils::encryptionKeyIsValid = false;
    }
}

void ZipUtils::setPvrEncryptionKey(unsigned int keyPart1, unsigned int keyPart2, unsigned int keyPart3, unsigned int keyPart4) {
    setPvrEncryptionKeyPart(0, keyPart1);
    setPvrEncryptionKeyPart(1, keyPart2);
    setPvrEncryptionKeyPart(2, keyPart3);
    setPvrEncryptionKeyPart(3, keyPart4);
}

// --------------------- ZipFile ---------------------
// from unzip.cpp
#define UNZ_MAXFILENAMEINZIP 256

static const ccstd::string EMPTY_FILE_NAME;

struct ZipEntryInfo {
    unz_file_pos pos;
    uLong uncompressed_size;
};

class ZipFilePrivate {
public:
    Locked<unzFile, std::recursive_mutex> zipFile;
    std::unique_ptr<ourmemory_s> memfs;

    // ccstd::unordered_map is faster if available on the platform
    using FileListContainer = ccstd::unordered_map<ccstd::string, struct ZipEntryInfo>;
    FileListContainer fileList;
};

ZipFile *ZipFile::createWithBuffer(const void *buffer, uint32_t size) {
    auto *zip = ccnew ZipFile();
    if (zip && zip->initWithBuffer(buffer, size)) {
        return zip;
    }
    delete zip;
    return nullptr;
}

ZipFile::ZipFile()
: _data(ccnew ZipFilePrivate) {
    auto zipFile = _data->zipFile.lock();
    *zipFile = nullptr;
}

ZipFile::ZipFile(const ccstd::string &zipFile, const ccstd::string &filter)
: _data(ccnew ZipFilePrivate) {
    auto zipFileL = _data->zipFile.lock();
    *zipFileL = unzOpen(FileUtils::getInstance()->getSuitableFOpen(zipFile).c_str());
    setFilter(filter);
}

ZipFile::~ZipFile() {
    if (_data) {
        auto zipFile = _data->zipFile.lock();
        if (*zipFile) {
            unzClose(*zipFile);
        }
    }

    CC_SAFE_DELETE(_data);
}

bool ZipFile::setFilter(const ccstd::string &filter) {
    bool ret = false;
    do {
        CC_BREAK_IF(!_data);
        auto zipFile = _data->zipFile.lock();
        CC_BREAK_IF(!(*zipFile));

        // clear existing file list
        _data->fileList.clear();

        // UNZ_MAXFILENAMEINZIP + 1 - it is done so in unzLocateFile
        char szCurrentFileName[UNZ_MAXFILENAMEINZIP + 1];
        unz_file_info64 fileInfo;

        // go through all files and store position information about the required files
        int err = unzGoToFirstFile64(*zipFile, &fileInfo,
                                     szCurrentFileName, sizeof(szCurrentFileName) - 1);
        while (err == UNZ_OK) {
            unz_file_pos posInfo;
            int posErr = unzGetFilePos(*zipFile, &posInfo);
            if (posErr == UNZ_OK) {
                ccstd::string currentFileName = szCurrentFileName;
                // cache info about filtered files only (like 'assets/')
                if (filter.empty() || currentFileName.substr(0, filter.length()) == filter) {
                    ZipEntryInfo entry;
                    entry.pos = posInfo;
                    entry.uncompressed_size = static_cast<uLong>(fileInfo.uncompressed_size);
                    _data->fileList[currentFileName] = entry;
                }
            }
            // next file - also get the information about it
            err = unzGoToNextFile64(*zipFile, &fileInfo,
                                    szCurrentFileName, sizeof(szCurrentFileName) - 1);
        }
        ret = true;

    } while (false);

    return ret;
}

bool ZipFile::fileExists(const ccstd::string &fileName) const {
    bool ret = false;
    do {
        CC_BREAK_IF(!_data);
        ret = _data->fileList.find(fileName) != _data->fileList.end();
    } while (false);

    return ret;
}

unsigned char *ZipFile::getFileData(const ccstd::string &fileName, uint32_t *size) {
    unsigned char *buffer = nullptr;
    if (size) {
        *size = 0;
    }

    auto zipFile = _data->zipFile.lock();

    do {
        CC_BREAK_IF(!(*zipFile));
        CC_BREAK_IF(fileName.empty());

        auto it = _data->fileList.find(fileName);
        CC_BREAK_IF(it == _data->fileList.end());

        ZipEntryInfo fileInfo = it->second;

        int nRet = unzGoToFilePos(*zipFile, &fileInfo.pos);
        CC_BREAK_IF(UNZ_OK != nRet);

        nRet = unzOpenCurrentFile(*zipFile);
        CC_BREAK_IF(UNZ_OK != nRet);

        buffer = static_cast<unsigned char *>(malloc(fileInfo.uncompressed_size));
        int CC_UNUSED nSize = unzReadCurrentFile(*zipFile, buffer, static_cast<unsigned int>(fileInfo.uncompressed_size));
        CC_ASSERT(nSize == 0 || nSize == (int)fileInfo.uncompressed_size);

        if (size) {
            *size = static_cast<uint32_t>(fileInfo.uncompressed_size);
        }
        unzCloseCurrentFile(*zipFile);
    } while (false);

    return buffer;
}

bool ZipFile::getFileData(const ccstd::string &fileName, ResizableBuffer *buffer) {
    bool res = false;
    do {
        auto zipFile = _data->zipFile.lock();
        CC_BREAK_IF(!(*zipFile));
        CC_BREAK_IF(fileName.empty());

        auto it = _data->fileList.find(fileName);
        CC_BREAK_IF(it == _data->fileList.end());

        ZipEntryInfo fileInfo = it->second;

        int nRet = unzGoToFilePos(*zipFile, &fileInfo.pos);
        CC_BREAK_IF(UNZ_OK != nRet);

        nRet = unzOpenCurrentFile(*zipFile);
        CC_BREAK_IF(UNZ_OK != nRet);

        buffer->resize(fileInfo.uncompressed_size);
        int CC_UNUSED nSize = unzReadCurrentFile(*zipFile, buffer->buffer(), static_cast<unsigned int>(fileInfo.uncompressed_size));
        CC_ASSERT(nSize == 0 || nSize == (int)fileInfo.uncompressed_size);
        unzCloseCurrentFile(*zipFile);
        res = true;
    } while (false);

    return res;
}

ccstd::string ZipFile::getFirstFilename() {
    auto zipFile = _data->zipFile.lock();
    if (unzGoToFirstFile(*zipFile) != UNZ_OK) return EMPTY_FILE_NAME;
    ccstd::string path;
    unz_file_info info;
    getCurrentFileInfo(&path, &info);
    return path;
}

ccstd::string ZipFile::getNextFilename() {
    auto zipFile = _data->zipFile.lock();
    if (unzGoToNextFile(*zipFile) != UNZ_OK) return EMPTY_FILE_NAME;
    ccstd::string path;
    unz_file_info info;
    getCurrentFileInfo(&path, &info);
    return path;
}

int ZipFile::getCurrentFileInfo(ccstd::string *filename, unz_file_info *info) {
    char path[FILENAME_MAX + 1];
    auto zipFile = _data->zipFile.lock();
    int ret = unzGetCurrentFileInfo(*zipFile, info, path, sizeof(path), nullptr, 0, nullptr, 0);
    if (ret != UNZ_OK) {
        *filename = EMPTY_FILE_NAME;
    } else {
        filename->assign(path);
    }
    return ret;
}

bool ZipFile::initWithBuffer(const void *buffer, uint32_t size) {
    if (!buffer || size == 0) return false;
    auto zipFile = _data->zipFile.lock();
    zlib_filefunc_def memoryFile = {nullptr};

    std::unique_ptr<ourmemory_t> memfs(ccnew ourmemory_t{static_cast<char *>(const_cast<void *>(buffer)), static_cast<uint32_t>(size), 0, 0, 0});
    if (!memfs) return false;
    fill_memory_filefunc(&memoryFile, memfs.get());

    *zipFile = unzOpen2(nullptr, &memoryFile);
    if (!(*zipFile)) return false;

    setFilter(EMPTY_FILE_NAME);
    return true;
}

} // namespace cc
