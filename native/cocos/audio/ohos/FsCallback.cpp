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

#include "audio/ohos/FsCallback.h"

#include <rawfile/raw_dir.h>
#include <rawfile/raw_file.h>
#include "base/memory/Memory.h"
#include "platform/ohos/FileUtils-ohos.h"

namespace {
inline cc::FileUtilsOHOS *getFU() {
    return static_cast<cc::FileUtilsOHOS *>(cc::FileUtils::getInstance());
}

struct FatFd {
    union {
        FILE *fp;
        RawFile *rf;
    } file;
    void *user;
    bool isRawFile;
};
} // namespace

namespace cc {
void *ohosOpen(const char *path, void *user) {
    bool isRawfile = false;
    const auto newPath = getFU()->expandPath(path, &isRawfile);
    auto *ret = ccnew FatFd();
    if (isRawfile) {
        ret->file.rf = OpenRawFile(cc::FileUtilsOHOS::getResourceManager(), newPath.c_str());
    } else {
        ret->file.fp = fopen(newPath.c_str(), "rb");
    }
    ret->user = user;
    ret->isRawFile = isRawfile;
    return ret;
}

size_t ohosRead(void *ptr, size_t size, size_t nmemb, void *datasource) {
    auto *fatFd = static_cast<FatFd *>(datasource);
    if (fatFd->isRawFile) {
        return ReadRawFile(fatFd->file.rf, ptr, size * nmemb) / size;
    }
    return fread(ptr, size, nmemb, fatFd->file.fp);
}

int ohosSeek(void *datasource, long offset, int whence) { //NOLINT(google-runtime-int)
    auto *fatFd = static_cast<FatFd *>(datasource);
    if (fatFd->isRawFile) {
        return SeekRawFile(fatFd->file.rf, offset, whence);
    }
    return fseek(fatFd->file.fp, offset, whence);
}

int ohosClose(void *datasource) {
    auto *fatFd = static_cast<FatFd *>(datasource);
    int code = 0;
    if (fatFd->isRawFile) {
        CloseRawFile(fatFd->file.rf);
        code = 0;
    } else {
        code = fclose(fatFd->file.fp);
    }
    delete fatFd;
    return code;
}

long ohosTell(void *datasource) { //NOLINT(google-runtime-int)
    auto *fatFd = static_cast<FatFd *>(datasource);
    if (fatFd->isRawFile) {
        return GetRawFileOffset(fatFd->file.rf);
    }
    return ftell(fatFd->file.fp);
}
} // namespace cc