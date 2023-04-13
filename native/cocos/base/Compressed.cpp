/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include <cstring>

#include "base/Compressed.h"
#include "base/Utils.h"

// compressed file header
static const uint32_t COMPRESSED_HEADER_LENGTH = 4;
static const uint32_t COMPRESSED_MIPMAP_LEVEL_COUNT_LENGTH = 4;
static const uint32_t COMPRESSED_MIPMAP_DATA_SIZE_LENGTH = 4;
static const uint32_t COMPRESSED_MAGIC = 0x50494d43;

bool compressedIsValid(const unsigned char* pFile) {
    const uint32_t magic = static_cast<uint32_t>(pFile[0]) +
                           static_cast<uint32_t>(pFile[1]) * 256 +
                           static_cast<uint32_t>(pFile[2]) * 65536 +
                           static_cast<uint32_t>(pFile[3]) * 16777216;

    return magic == COMPRESSED_MAGIC;
}

uint32_t getChunkNumbers(const unsigned char* pFile) {
    return static_cast<uint32_t>(pFile[COMPRESSED_MIPMAP_LEVEL_COUNT_LENGTH + 0]) +
           static_cast<uint32_t>(pFile[COMPRESSED_MIPMAP_LEVEL_COUNT_LENGTH + 1]) * 256 +
           static_cast<uint32_t>(pFile[COMPRESSED_MIPMAP_LEVEL_COUNT_LENGTH + 2]) * 65536 +
           static_cast<uint32_t>(pFile[COMPRESSED_MIPMAP_LEVEL_COUNT_LENGTH + 3]) * 16777216;
}

uint32_t getChunkSizes(const unsigned char* pFile, uint32_t level) {
    const uint32_t byteOffset = COMPRESSED_HEADER_LENGTH + COMPRESSED_MIPMAP_LEVEL_COUNT_LENGTH + COMPRESSED_MIPMAP_DATA_SIZE_LENGTH * level;
    return (pFile[byteOffset + 0]) +
           (pFile[byteOffset + 1]) * 256 +
           (pFile[byteOffset + 2]) * 65536 +
           (pFile[byteOffset + 3]) * 16777216;
}

unsigned char* getChunk(const unsigned char* pFile, uint32_t level) {
    unsigned char* dstData = nullptr;
    const auto chunkCount = getChunkNumbers(pFile);
    const auto compressedFileHeaderLength = COMPRESSED_HEADER_LENGTH + COMPRESSED_MIPMAP_LEVEL_COUNT_LENGTH + COMPRESSED_MIPMAP_DATA_SIZE_LENGTH * chunkCount;

    uint32_t byteOffset = compressedFileHeaderLength;
    for (uint32_t i = 0; i < chunkCount; ++i) {
        const auto chunkSize = getChunkSizes(pFile, i);
        if (i == level) {
            dstData = static_cast<unsigned char*>(malloc(chunkSize * sizeof(unsigned char)));
            memcpy(dstData, pFile + byteOffset, chunkSize);
            break;
        }
        byteOffset += chunkSize;
    }

    return dstData;
}
