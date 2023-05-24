/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "FileUtils-qnx.h"
#include <errno.h>
#include <stdio.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fstream>
#include "base/Log.h"
#include "base/memory/Memory.h"

#define DECLARE_GUARD std::lock_guard<std::recursive_mutex> mutexGuard(_mutex)
#ifndef CC_RESOURCE_FOLDER_LINUX
    #define CC_RESOURCE_FOLDER_LINUX ("/Resources/")
#endif

namespace cc {

FileUtils *createFileUtils() {
    return ccnew FileUtilsQNX();
}

FileUtilsQNX::FileUtilsQNX() {
    init();
}

bool FileUtilsQNX::init() {
    // get application path
    // In QNX /proc/self/exefile is not a symbolic link; It's a regular file.
    std::ifstream file("/proc/self/exefile");
    if (!file) {
        return false;
    }
    ccstd::string appPath;
    std::getline(file, appPath);
    if (appPath.empty()) {
        return false;
    }
    _defaultResRootPath = appPath.substr(0, appPath.find_last_of('/'));
    _defaultResRootPath += CC_RESOURCE_FOLDER_LINUX;

    // Set writable path to $XDG_CONFIG_HOME or ~/.config/<app name>/ if $XDG_CONFIG_HOME not exists.
    const char *xdg_config_path = getenv("XDG_CONFIG_HOME");
    ccstd::string xdgConfigPath;
    if (xdg_config_path == NULL) {
        xdg_config_path = getenv("HOME");
        if (xdg_config_path) {
            xdgConfigPath = xdg_config_path;
        }
#if _DEBUG
        // In qnx debugging mode, the environment variables of HOME cannot be obtained.
        // To facilitate debugging. Set a default directory
        if (!xdg_config_path) {
            // Set up a user directory and resources in the same directory.
            xdgConfigPath = "/data/home/root";

            // You can get the current application directory through API
            // char* buf = getcwd(NULL, 0);
            // xdgConfigPath = buf;
            // free(buf);
        }
#endif
        xdgConfigPath += "/.config";
    } else {
        xdgConfigPath = xdg_config_path;
    }

    _writablePath = xdgConfigPath;
    _writablePath += appPath.substr(appPath.find_last_of('/'));
    _writablePath += "/";

    return FileUtils::init();
}

bool FileUtilsQNX::isFileExistInternal(const ccstd::string &filename) const {
    if (filename.empty()) {
        return false;
    }

    ccstd::string strPath = filename;
    if (!isAbsolutePath(strPath)) { // Not absolute path, add the default root path at the beginning.
        strPath.insert(0, _defaultResRootPath);
    }

    struct stat sts;
    return (stat(strPath.c_str(), &sts) == 0) && S_ISREG(sts.st_mode);
}

ccstd::string FileUtilsQNX::getWritablePath() const {
    struct stat st;
    stat(_writablePath.c_str(), &st);
    if (!S_ISDIR(st.st_mode)) {
        mkdir(_writablePath.c_str(), 0744);
    }

    return _writablePath;
}

} // namespace cc
