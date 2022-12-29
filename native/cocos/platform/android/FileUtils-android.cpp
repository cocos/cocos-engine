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

#include "platform/android/FileUtils-android.h"
#include <android/log.h>
#include <sys/stat.h>
#include <cstdlib>
#include "android/asset_manager.h"
#include "android/asset_manager_jni.h"
#include "base/Log.h"
#include "base/ZipUtils.h"
#include "base/memory/Memory.h"
#include "platform/java/jni/JniHelper.h"
#include "platform/java/jni/JniImp.h"

#define LOG_TAG   "FileUtils-android.cpp"
#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, LOG_TAG, __VA_ARGS__)

#define ASSETS_FOLDER_NAME "@assets/"

#ifndef JCLS_HELPER
    #define JCLS_HELPER "com/cocos/lib/CocosHelper"
#endif

namespace cc {

AAssetManager *FileUtilsAndroid::assetmanager = nullptr;
ZipFile *FileUtilsAndroid::obbfile = nullptr;

FileUtils *createFileUtils() {
    return ccnew FileUtilsAndroid();
}

void FileUtilsAndroid::setAssetManager(AAssetManager *a) {
    if (nullptr == a) {
        LOGD("setAssetManager : received unexpected nullptr parameter");
        return;
    }

    cc::FileUtilsAndroid::assetmanager = a;
}

FileUtilsAndroid::FileUtilsAndroid() {
    init();
}

FileUtilsAndroid::~FileUtilsAndroid() {
    CC_SAFE_DELETE(obbfile);
}

bool FileUtilsAndroid::init() {
    _defaultResRootPath = ASSETS_FOLDER_NAME;

    ccstd::string assetsPath(getObbFilePathJNI());
    if (assetsPath.find("/obb/") != ccstd::string::npos) {
        obbfile = ccnew ZipFile(assetsPath);
    }

    return FileUtils::init();
}

bool FileUtilsAndroid::isFileExistInternal(const ccstd::string &strFilePath) const {
    if (strFilePath.empty()) {
        return false;
    }

    bool bFound = false;

    // Check whether file exists in apk.
    if (strFilePath[0] != '/') {
        const char *s = strFilePath.c_str();

        // Found "@assets/" at the beginning of the path and we don't want it
        if (strFilePath.find(ASSETS_FOLDER_NAME) == 0) s += strlen(ASSETS_FOLDER_NAME);
        if (obbfile && obbfile->fileExists(s)) {
            bFound = true;
        } else if (FileUtilsAndroid::assetmanager) {
            AAsset *aa = AAssetManager_open(FileUtilsAndroid::assetmanager, s, AASSET_MODE_UNKNOWN);
            if (aa) {
                bFound = true;
                AAsset_close(aa);
            } else {
                // CC_LOG_DEBUG("[AssetManager] ... in APK %s, found = false!", strFilePath.c_str());
            }
        }
    } else {
        FILE *fp = fopen(strFilePath.c_str(), "r");
        if (fp) {
            bFound = true;
            fclose(fp);
        }
    }
    return bFound;
}

bool FileUtilsAndroid::isDirectoryExistInternal(const ccstd::string &testDirPath) const {
    if (testDirPath.empty()) {
        return false;
    }

    ccstd::string dirPath = testDirPath;
    if (dirPath[dirPath.length() - 1] == '/') {
        dirPath[dirPath.length() - 1] = '\0';
    }

    // find absolute path in flash memory
    if (dirPath[0] == '/') {
        CC_LOG_DEBUG("find in flash memory dirPath(%s)", dirPath.c_str());
        struct stat st;
        if (stat(dirPath.c_str(), &st) == 0) {
            return S_ISDIR(st.st_mode);
        }
    } else {
        // find it in apk's assets dir
        // Found "@assets/" at the beginning of the path and we don't want it
        CC_LOG_DEBUG("find in apk dirPath(%s)", dirPath.c_str());
        const char *s = dirPath.c_str();
        if (dirPath.find(_defaultResRootPath) == 0) {
            s += _defaultResRootPath.length();
        }
        if (FileUtilsAndroid::assetmanager) {
            AAssetDir *aa = AAssetManager_openDir(FileUtilsAndroid::assetmanager, s);
            if (aa && AAssetDir_getNextFileName(aa)) {
                AAssetDir_close(aa);
                return true;
            }
        }
    }

    return false;
}

bool FileUtilsAndroid::isAbsolutePath(const ccstd::string &strPath) const {
    // On Android, there are two situations for full path.
    // 1) Files in APK, e.g. assets/path/path/file.png
    // 2) Files not in APK, e.g. /data/data/org.cocos2dx.hellocpp/cache/path/path/file.png, or /sdcard/path/path/file.png.
    // So these two situations need to be checked on Android.
    return strPath[0] == '/' || strPath.find(ASSETS_FOLDER_NAME) == 0;
}

FileUtils::Status FileUtilsAndroid::getContents(const ccstd::string &filename, ResizableBuffer *buffer) {
    if (filename.empty()) {
        return FileUtils::Status::NOT_EXISTS;
    }

    ccstd::string fullPath = fullPathForFilename(filename);
    if (fullPath.empty()) {
        return FileUtils::Status::NOT_EXISTS;
    }

    if (fullPath[0] == '/') {
        return FileUtils::getContents(fullPath, buffer);
    }

    ccstd::string relativePath;
    size_t position = fullPath.find(ASSETS_FOLDER_NAME);
    if (0 == position) {
        // "@assets/" is at the beginning of the path and we don't want it
        relativePath += fullPath.substr(strlen(ASSETS_FOLDER_NAME));
    } else {
        relativePath = fullPath;
    }

    if (obbfile) {
        if (obbfile->getFileData(relativePath, buffer)) {
            return FileUtils::Status::OK;
        }
    }

    if (nullptr == assetmanager) {
        LOGD("... FileUtilsAndroid::assetmanager is nullptr");
        return FileUtils::Status::NOT_INITIALIZED;
    }

    AAsset *asset = AAssetManager_open(assetmanager, relativePath.data(), AASSET_MODE_UNKNOWN);
    if (nullptr == asset) {
        LOGD("asset (%s) is nullptr", filename.c_str());
        return FileUtils::Status::OPEN_FAILED;
    }

    auto size = AAsset_getLength(asset);
    buffer->resize(size);

    int readsize = AAsset_read(asset, buffer->buffer(), size);
    AAsset_close(asset);

    if (readsize < size) {
        if (readsize >= 0) {
            buffer->resize(readsize);
        }
        return FileUtils::Status::READ_FAILED;
    }

    return FileUtils::Status::OK;
}

ccstd::string FileUtilsAndroid::getWritablePath() const {
    // Fix for Nexus 10 (Android 4.2 multi-user environment)
    // the path is retrieved through Java Context.getCacheDir() method
    ccstd::string dir;
    ccstd::string tmp = JniHelper::callStaticStringMethod(JCLS_HELPER, "getWritablePath");

    if (tmp.length() > 0) {
        dir.append(tmp).append("/");
        return dir;
    }
    return "";
}

} // namespace cc
