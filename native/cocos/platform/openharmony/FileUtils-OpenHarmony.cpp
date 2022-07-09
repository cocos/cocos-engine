#include "cocos/platform/openharmony/FileUtils-OpenHarmony.h"
#include <hilog/log.h>
#include <sys/stat.h>
#include <cstdio>
#include <regex>
#include <string>

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>

#include "cocos/base/Log.h"

#include <sys/syscall.h>
#include <unistd.h>
#include "bindings/jswrapper/napi/HelperMacros.h"

#define ASSETS_FOLDER_WRITEABLE_PATH "/data/accounts/account_0/applications/ohos.example.xcomponent1/ohos.example.xcomponent1/writeable_path"

#ifndef JCLS_HELPER
    #define JCLS_HELPER "com/cocos/lib/CocosHelper"
#endif
#include "rawfile/raw_file_manager.h"

namespace cc {

namespace {

std::string rawfilePrefix = "entry/resources/rawfile/";

void printRawfiles(NativeResourceManager *mgr, const std::string &path) {
//    auto *file = OpenRawFile(mgr, path.c_str());
//    if (file) {
//        HILOG_DEBUG(LOG_APP, "PrintRawfile %{public}s", path.c_str());
//        return;
//    }
//
//    RawDir *dir = OpenRawDir(mgr, path.c_str());
//    if (dir) {
//        auto fileCnt = GetRawFileCount(dir);
//        for (auto i = 0; i < fileCnt; i++) {
//            std::string subFile  = GetRawFileName(dir, i);
//            auto        newPath  = path + "/" + subFile; // NOLINT
//            auto        debugPtr = newPath.c_str();
//            HILOG_ERROR(LOG_APP, " find path %{public}s", newPath.c_str());
//            printRawfiles(mgr, newPath);
//        }
//    } else {
//        HILOG_ERROR(LOG_APP, "Invalidate path %{public}s", path.c_str());
//    }
}
} // namespace

NativeResourceManager* FileUtilsOpenHarmony::_nativeResourceManager = nullptr;

bool FileUtilsOpenHarmony::initResourceManager(napi_env env, napi_value param) {
    _nativeResourceManager = OH_ResourceManager_InitNativeResourceManager(env, param);
    LOGE("cocos qgh  initResourceManager %{public}p", _nativeResourceManager);
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
        LOGE("cocos qgh getContents _nativeResourceManager = nullptr");
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
        LOGE("cocos qgh getContents _nativeResourceManager = nullptr");
        return FileUtils::Status::NOT_INITIALIZED;
    }

    LOGE("cocos qgh getContents %{public}s", fullPath.c_str());
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

void FileUtilsOpenHarmony::setRawfilePrefix(const std::string &prefix) {
    //rawfilePrefix = prefix;
}


FileUtils *FileUtils::getInstance() {
    if (FileUtils::sharedFileUtils == nullptr) {
        FileUtils::sharedFileUtils = new FileUtilsOpenHarmony();
        if (!FileUtils::sharedFileUtils->init()) {
            delete FileUtils::sharedFileUtils;
            FileUtils::sharedFileUtils = nullptr;
            CC_LOG_DEBUG("ERROR: Could not init CCFileUtilsAndroid");
        }
    }
    return FileUtils::sharedFileUtils;
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
    LOGE("cocos qgh getFileSize %{public}s", fullPath.c_str());
    if (nullptr == _nativeResourceManager) {
        LOGE("cocos qgh getContents _nativeResourceManager = nullptr");
        return 0;
    }

    long filesize = 0;
    RawFile* rawFile = OH_ResourceManager_OpenRawFile(_nativeResourceManager, fullPath.c_str());
    if(rawFile) {
        filesize = OH_ResourceManager_GetRawFileSize(rawFile);
        OH_ResourceManager_CloseRawFile(rawFile);
    }
    LOGE("cocos qgh getFileSize %{public}s  size=%{public}d", fullPath.c_str(), (int)filesize);
    return filesize;
}

std::string FileUtilsOpenHarmony::getWritablePath() const {
    return ASSETS_FOLDER_WRITEABLE_PATH;
}

bool FileUtilsOpenHarmony::isFileExistInternal(const std::string &strFilePath) const {
    LOGE("cocos qgh getFileSize %{public}s", strFilePath.c_str());
    if (strFilePath.empty()) {
        return false;
    }
    std::string strPath = strFilePath;
    if (!isAbsolutePath(strPath)) { // Not absolute path, add the default root path at the beginning.
        strPath.insert(0, _defaultResRootPath);
    }

    if (nullptr == _nativeResourceManager) {
        LOGE("cocos qgh getContents _nativeResourceManager = nullptr");
        return false;
    }

    LOGE("cocos qgh getFileSize %{public}s", strPath.c_str());
    RawFile* rawFile = OH_ResourceManager_OpenRawFile(_nativeResourceManager, strPath.c_str());
    if(rawFile) {
        LOGE("cocos qgh getFileSize %{public}s exist", strPath.c_str());
        OH_ResourceManager_CloseRawFile(rawFile);
        return true;
    } 
    LOGE("cocos qgh getFileSize %{public}s not exist", strPath.c_str());
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
        LOGE("cocos qgh getContents _nativeResourceManager = nullptr");
        return false;
    }

    RawDir* rawDir = OH_ResourceManager_OpenRawDir(_nativeResourceManager, dirPathMf.c_str());
    if(rawDir) {
        OH_ResourceManager_CloseRawDir(rawDir);
        return true;
    }
    return false;
}

std::string FileUtilsOpenHarmony::expandPath(const std::string &input, bool *isRawFile) const {
//    if (!input.empty() && input[0] == '/') {
//        if (isRawFile) *isRawFile = false;
//        return input;
//    }
//    const auto fullpath = fullPathForFilename(input);
//
//    if (fullpath.find(_defaultResRootPath) == 0) {
//        if (isRawFile) *isRawFile = true;
//        return rawfilePrefix + fullpath.substr(_defaultResRootPath.length(), fullpath.length());
//    }
//
//    if (isRawFile) *isRawFile = false;
//
//    return fullpath;
    return "";
}

} // namespace cc