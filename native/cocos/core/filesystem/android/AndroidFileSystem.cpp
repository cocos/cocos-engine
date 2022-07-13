
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

#include "cocos/core/filesystem/android/AndroidFileSystem.h"
//#include "cocos/core/filesystem/android/AndroidFileHandle.h"

#include "cocos/base/Log.h"

#include "android/asset_manager.h"
#include "android/asset_manager_jni.h"
#include "platform/java/jni/JniHelper.h"
#include "platform/java/jni/JniImp.h"



namespace cc {
constexpr int kMaxPath = 512;

#ifndef JCLS_HELPER
#define JCLS_HELPER "com/cocos/lib/CocosHelper"
#endif


AndroidFileSystem::AndroidFileSystem() {
    // ccstd::string assetsPath(getObbFilePathJNI());
    // if (assetsPath.find("/obb/") != ccstd::string::npos) {
    //     obbfile = ccnew ZipFile(assetsPath);
    // }
}

AndroidFileSystem::~AndroidFileSystem() {
}

bool AndroidFileSystem::createDirectory(const FilePath& path) {
    return true;
}

bool AndroidFileSystem::existInternal(const FilePath& filepath) const {
    if (filepath.value().empty()) {
        return false;
    }
    bool bFound = false;
    FILE *fp = fopen(filepath.value().c_str(), "r");
    if (fp) {
        bFound = true;
        fclose(fp);
    }
    return bFound;
}

int64_t AndroidFileSystem::getFileSize(const FilePath& filepath) {
    return (long)0;
}

bool AndroidFileSystem::removeDirectory(const FilePath& dirPath) {
    return false;
}

bool AndroidFileSystem::removeFile(const FilePath& filepath) {
    return false;
}


bool AndroidFileSystem::renameFile(const FilePath& oldFilepath, const FilePath& newFilepath) {
    return false;
}

BaseFileHandle* AndroidFileSystem::open(const FilePath& filepath) {
    if (filepath.value().empty()) {
        return nullptr;//FileUtils::Status::NOT_EXISTS;
    }

    ccstd::string fullPath = fullPathForFilename(filepath.value());
    if (fullPath.empty()) {
        return nullptr;//FileUtils::Status::NOT_EXISTS;
    }

    if (fullPath[0] == '/') {
        return nullptr;
        //return FileUtils::getContents(fullPath, buffer);
    }

    return nullptr;
    //return new AndroidFileHandle(asset);
}

bool AndroidFileSystem::isAbsolutePath(const ccstd::string& strPath) const {
    // On Android, there are two situations for full path.
    // 1) Files in APK, e.g. assets/path/path/file.png
    // 2) Files not in APK, e.g. /data/data/org.cocos2dx.hellocpp/cache/path/path/file.png, or /sdcard/path/path/file.png.
    // So these two situations need to be checked on Android.
    return strPath[0] == '/';
}

ccstd::string AndroidFileSystem::getUserAppDataPath() const {
    // Fix for Nexus 10 (Android 4.2 multi-user environment)
    // the path is retrieved through Java Context.getCacheDir() method
    ccstd::string dir;
    ccstd::string tmp = JniHelper::callStaticStringMethod(JCLS_HELPER, "getUserAppDataPath");

    if (tmp.length() > 0) {
        dir.append(tmp).append("/");
        return dir;
    }
    return "";
}

}
