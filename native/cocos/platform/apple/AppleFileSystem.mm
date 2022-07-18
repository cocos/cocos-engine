
/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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
#import <Foundation/Foundation.h>
#include "cocos/platform/apple/AppleFileSystem.h"
#include <ftw.h>
#include <stack>
#include "base/Log.h"
#include "base/memory/Memory.h"
#include "base/std/container/string.h"
#include "platform/FileUtils.h"
#include "platform/SAXParser.h"

namespace cc {

static NSFileManager *s_fileManager = [NSFileManager defaultManager];

AppleFileSystem::AppleFileSystem() = default;

AppleFileSystem::~AppleFileSystem() = default;

bool AppleFileSystem::createDirectory(const FilePath &path) {
    CC_ASSERT(!path.value().empty());

    //if (isDirectoryExist(path))
     //   return true;

    NSError *error;

    bool result = [s_fileManager createDirectoryAtPath:[NSString stringWithUTF8String:path.value().c_str()] withIntermediateDirectories:YES attributes:nil error:&error];

    if (!result && error != nil) {
        CC_LOG_ERROR("Fail to create directory \"%s\": %s", path.value().c_str(), [error.localizedDescription UTF8String]);
    }

    return result;
}

static int unlink_cb(const char *fpath, const struct stat *sb, int typeflag, struct FTW *ftwbuf) {
    auto ret = remove(fpath);
    if (ret) {
        CC_LOG_INFO("Fail to remove: %s ", fpath);
    }

    return ret;
}

bool AppleFileSystem::removeDirectory(const FilePath&path) {
    if (path.value().empty()) {
        CC_LOG_ERROR("Fail to remove directory, path is empty!");
        return false;
    }

    if (nftw(path.value().c_str(), unlink_cb, 64, FTW_DEPTH | FTW_PHYS))
        return false;
    else
        return true;
}

bool AppleFileSystem::pathExists(const FilePath& path) const {
    if (filePath.empty()) {
        return false;
    }
    bool ret = false;
    // Search path is an absolute path.
    if ([s_fileManager fileExistsAtPath:[NSString stringWithUTF8String:filePath.value().c_str()]]) {
        ret = true;
    }
    return ret;
}

FilePath AppleFileSystem::getUserAppDataPath() const {
    if (_writablePath.length()) {
        return _writablePath;
    }

    // save to document folder
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    std::string strRet = [documentsDirectory UTF8String];
    strRet.append("/");
    return strRet;
}

}
