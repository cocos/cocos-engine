/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
#include "cocos/platform/openharmony/FileUtils-OpenHarmony.h"
#include <hilog/log.h>
#include <sys/stat.h>
#include <cstdio>
#include <regex>

#include <string>
#include <sys/syscall.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <dirent.h>
#include <unistd.h>
#include "base/memory/Memory.h"

#include "cocos/base/Log.h"

#include "bindings/jswrapper/napi/HelperMacros.h"
#define ASSETS_FOLDER_WRITEABLE_PATH "/data/accounts/account_0/applications/ohos.example.xcomponent1/ohos.example.xcomponent1/writeable_path"
#include "rawfile/raw_file_manager.h"

namespace cc {

NativeResourceManager* FileUtilsOpenHarmony::_nativeResourceManager = nullptr;

FileUtils *createFileUtils() {
    return ccnew FileUtilsOpenHarmony();
}

FileUtilsOpenHarmony::FileUtilsOpenHarmony() {
    init();
}

std::string FileUtilsOpenHarmony::_ohWritablePath;

bool FileUtilsOpenHarmony::initResourceManager(napi_env env, napi_value param) {
    _nativeResourceManager = OH_ResourceManager_InitNativeResourceManager(env, param);
    return true;
}

FileUtils::Status FileUtilsOpenHarmony::getRawFileDescriptor(const std::string &filename,RawFileDescriptor& descriptor) {
    if (filename.empty()) {
        return FileUtils::Status::NOT_EXISTS;
    }

    std::string fullPath = fullPathForFilename(filename);
    if (fullPath.empty()) {
        return FileUtils::Status::NOT_EXISTS;
    }

    if (nullptr == _nativeResourceManager) {
        CC_LOG_ERROR("nativeResourceManager is nullptr");
        return FileUtils::Status::NOT_INITIALIZED;
    }

    RawFile *rawFile = OH_ResourceManager_OpenRawFile(_nativeResourceManager, fullPath.c_str());
    if (nullptr == rawFile) {
        return FileUtils::Status::OPEN_FAILED;
    }

    bool result = OH_ResourceManager_GetRawFileDescriptor(rawFile, descriptor);
    if (!result) {
         OH_ResourceManager_CloseRawFile(rawFile);
        return FileUtils::Status::OPEN_FAILED;
    }

    OH_ResourceManager_CloseRawFile(rawFile);
    return FileUtils::Status::OK;  
}

FileUtils::Status FileUtilsOpenHarmony::getContents(const std::string &filename, ResizableBuffer *buffer) {
    if (filename.empty()) {
        return FileUtils::Status::NOT_EXISTS;
    }

    std::string fullPath = fullPathForFilename(filename);
    if (fullPath.empty()) {
        return FileUtils::Status::NOT_EXISTS;
    }

    if (fullPath[0] == '/') {
        return FileUtils::getContents(fullPath, buffer);
    }

    if (nullptr == _nativeResourceManager) {
        CC_LOG_ERROR("nativeResourceManager is nullptr");
        return FileUtils::Status::NOT_INITIALIZED;
    }

    RawFile *rawFile = OH_ResourceManager_OpenRawFile(_nativeResourceManager, fullPath.c_str());
    if (nullptr == rawFile) {
        return FileUtils::Status::OPEN_FAILED;
    }

    auto size = OH_ResourceManager_GetRawFileSize(rawFile);
    buffer->resize(size);

    assert(buffer->buffer());

    int readsize = OH_ResourceManager_ReadRawFile(rawFile, buffer->buffer(), size);
    // TODO(unknown): read error
    if (readsize < size) {
        if (readsize >= 0) {
            buffer->resize(readsize);
        }
        OH_ResourceManager_CloseRawFile(rawFile);
        return FileUtils::Status::READ_FAILED;
    }
    OH_ResourceManager_CloseRawFile(rawFile);
    return FileUtils::Status::OK;
}

FileUtilsOpenHarmony::~FileUtilsOpenHarmony() {
    if(_nativeResourceManager)
        OH_ResourceManager_ReleaseNativeResourceManager(_nativeResourceManager);
}

bool FileUtilsOpenHarmony::init() {
    _defaultResRootPath = "";
    return FileUtils::init();
}

bool FileUtilsOpenHarmony::isAbsolutePath(const std::string &strPath) const {
    return !strPath.empty() && (strPath[0] == '/');
}

std::string FileUtilsOpenHarmony::getSuitableFOpen(const std::string &filenameUtf8) const {
    return filenameUtf8;
}

long FileUtilsOpenHarmony::getFileSize(const std::string &filepath) {
    if (filepath.empty()) {
        return 0;
    }

    auto *fs = FileUtils::getInstance();

    std::string fullPath = fs->fullPathForFilename(filepath);
    if (fullPath.empty()) {
        return 0;
    }
    if (nullptr == _nativeResourceManager) {
        CC_LOG_ERROR("nativeResourceManager is nullptr");
        return 0;
    }

    long filesize = 0;
    RawFile* rawFile = OH_ResourceManager_OpenRawFile(_nativeResourceManager, fullPath.c_str());
    if(rawFile) {
        filesize = OH_ResourceManager_GetRawFileSize(rawFile);
        OH_ResourceManager_CloseRawFile(rawFile);
    }
    return filesize;
}

std::string FileUtilsOpenHarmony::getWritablePath() const {
    return _ohWritablePath;
}

bool FileUtilsOpenHarmony::isFileExistInternal(const std::string &strFilePath) const {
    if (strFilePath.empty()) {
        return false;
    }
    std::string strPath = strFilePath;
    if (!isAbsolutePath(strPath)) { // Not absolute path, add the default root path at the beginning.
        strPath.insert(0, _defaultResRootPath);
    }

    if (nullptr == _nativeResourceManager) {
        CC_LOG_ERROR("nativeResourceManager is nullptr");
        return false;
    }

    RawFile* rawFile = OH_ResourceManager_OpenRawFile(_nativeResourceManager, strPath.c_str());
    if(rawFile) {
        OH_ResourceManager_CloseRawFile(rawFile);
        return true;
    }
    return false;
}

bool FileUtilsOpenHarmony::isDirectoryExistInternal(const std::string &dirPath) const {
    if (dirPath.empty()) return false;
    std::string dirPathMf = dirPath[dirPath.length() - 1] == '/' ? dirPath.substr(0, dirPath.length() - 1) : dirPath;

    if (dirPathMf[0] == '/') {
        struct stat st;
        return stat(dirPathMf.c_str(), &st) == 0 && S_ISDIR(st.st_mode);
    }

    if (dirPathMf.find(_defaultResRootPath) == 0) {
        dirPathMf = dirPathMf.substr(_defaultResRootPath.length(), dirPathMf.length());
    }
    
    if (nullptr == _nativeResourceManager) {
        CC_LOG_ERROR("nativeResourceManager is nullptr");
        return false;
    }

    RawDir* rawDir = OH_ResourceManager_OpenRawDir(_nativeResourceManager, dirPathMf.c_str());
    if(rawDir) {
        OH_ResourceManager_CloseRawDir(rawDir);
        return true;
    }
    return false;
}

bool FileUtilsOpenHarmony::renameFile(const std::string &oldfullpath, const std::string &newfullpath) {
    if (access(oldfullpath.c_str(), F_OK) != 0) {
        return false;
    }
    if (rename(oldfullpath.c_str(), newfullpath.c_str()) != 0) {
        if (access(newfullpath.c_str(), F_OK) == 0) {
            remove(newfullpath.c_str());
        }
        return false;
    }
    return true;
}

bool FileUtilsOpenHarmony::removeFile(const std::string &filepath) {
    return remove(filepath.c_str()) == 0;
}

bool FileUtilsOpenHarmony::removeDirectory(const std::string &dirPath) {
    DIR *directory = opendir(dirPath.c_str());
    if (!directory) {
        return false;
    }
    struct dirent *dir{nullptr};
    struct stat    st;
    while ((dir = readdir(directory)) != NULL) {
        if (strcmp(dir->d_name, ".") == 0 || strcmp(dir->d_name, "..") == 0) {
            continue;
        }
        std::string subPath = dirPath + '/' + dir->d_name;
        if (lstat(subPath.c_str(), &st) == -1) {
            continue;
        }
        if (S_ISDIR(st.st_mode)) {
            if (!removeDirectory(subPath)) {
                closedir(directory);
                return false;
            }
            rmdir(subPath.c_str());
        } else if (S_ISREG(st.st_mode)) {
            unlink(subPath.c_str());
        } else {
            continue;
        }
    }
    if (rmdir(dirPath.c_str()) == -1) {
        closedir(directory);
        return false;
    }
    closedir(directory);
    return true;
}

} // namespace cc