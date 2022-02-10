/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "core/utils/Path.h"
#include "base/StringUtil.h"
#include <cstring>

namespace cc {

namespace {
const std::string EMPTY_STRING;

std::string &removeLastSlash(std::string &path) {
    if (!path.empty()) {
        if (path[path.length() - 1] == '/' || path[path.length() - 1] == '\\') {
            path = path.substr(0, path.length() - 1);
        } else if (path.length() > 1 && path[path.length() - 1] == '\\' && path[path.length() - 2] == '\\') {
            path = path.substr(0, path.length() - 2);
        }
    }
    return path;
}

} // namespace

std::string join(const std::vector<std::string> &segments) {
    std::string result;

    for (const auto &segment : segments) {
        if (!result.empty()) {
            result += "/";
        }
        result += segment;
        removeLastSlash(result);
    }

    return result;
}

std::string extname(const std::string &path) {
    if (path.empty()) {
        return EMPTY_STRING;
    }

    std::string newPath = path;
    size_t      index   = path.find_first_of('?');
    if (index != std::string::npos && index > 0) {
        newPath = newPath.substr(0, index);
    }

    index = newPath.find_last_of('.');
    if (index == std::string::npos) {
        return EMPTY_STRING;
    }

    return newPath.substr(index);
}

std::string mainFileName(const std::string &fileName) {
    if (!fileName.empty()) {
        size_t idx = fileName.find_last_of('.');
        if (idx != std::string::npos) {
            return fileName.substr(0, idx);
        }
    }

    return fileName;
}

std::string basename(const std::string &path, const std::string &extName /* = ""*/) {
    std::string newPath = path;
    size_t      index   = path.find_first_of('?');
    if (index != std::string::npos && index > 0) {
        newPath = newPath.substr(0, index);
    }

    removeLastSlash(newPath);

    index = newPath.find_last_of("/\\");
    if (index == std::string::npos) {
        return newPath;
    }

    std::string baseName = newPath.substr(index + 1);

    if (!extName.empty() && extName.length() < newPath.length()) {
        std::string extInPath       = newPath.substr(newPath.length() - extName.length());
        std::string expectedExtName = extName;
        if (StringUtil::tolower(extInPath) == StringUtil::tolower(expectedExtName)) {
            baseName = baseName.substr(0, baseName.length() - extName.length());
        }
    }

    return baseName;
}

std::string dirname(const std::string &path) {
    size_t index = path.find_last_of("/\\");
    if (index == std::string::npos) {
        return "";
    }

    std::string dir = path.substr(0, index);
    removeLastSlash(dir);
    return dir;
}

std::string changeExtname(const std::string &path, const std::string &extName /* = ""*/) {
    size_t      index   = path.find_first_of('?');
    std::string newPath = path;
    std::string tempStr;
    if (index != std::string::npos && index > 0) {
        tempStr = path.substr(index);
        newPath = path.substr(0, index);
    }

    index = newPath.find_last_of('.');
    if (index == std::string::npos) {
        return newPath + extName + tempStr;
    }

    return newPath.substr(0, index) + extName + tempStr;
}

std::string changeBasename(const std::string &path, const std::string &baseName, bool isSameExt /* = false*/) {
    if (baseName.find_last_of('.') == 0) {
        return changeExtname(path, baseName);
    }

    size_t            index = path.find_last_of('?');
    std::string       tempStr;
    std::string       newPath = path;
    const std::string ext     = isSameExt ? extname(path) : "";
    if (index != std::string::npos && index > 0) {
        tempStr = path.substr(index);
        newPath = path.substr(0, index);
    }

    index = newPath.find_last_of("/\\");
    if (index == std::string::npos) {
        index = 0;
    } else if (index > 0) {
        ++index;
    }

    return newPath.substr(0, index) + baseName + ext + tempStr;
}

std::string normalize(const std::string &url) {
    std::string oldUrl = url;
    std::string newUrl = url;

    // remove all ../
    do {
        oldUrl       = newUrl;
        size_t index = newUrl.find("../");
        if (index == std::string::npos) {
            index = newUrl.find("..\\");
        }
        size_t previousSlashIndex      = std::string::npos;
        size_t previousTwiceSlashIndex = std::string::npos;
        if (index != std::string::npos && index > 0) {
            previousSlashIndex = newUrl.find_last_of("/\\", index - 1);
            if (previousSlashIndex != std::string::npos) {
                previousTwiceSlashIndex = newUrl.find_last_of("/\\", previousSlashIndex - 1);
            }
        }

        if (previousTwiceSlashIndex == std::string::npos) {
            if (previousSlashIndex != std::string::npos) {
                newUrl = newUrl.substr(index + strlen("../"));
            }
        } else if (previousSlashIndex != std::string::npos) {
            newUrl = newUrl.substr(0, previousTwiceSlashIndex) + '/' + newUrl.substr(index + strlen("../"));
        }
    } while (oldUrl.length() != newUrl.length());

    return newUrl;
}

std::string stripSep(const std::string &path) {
    std::string result = path;
    removeLastSlash(result);
    return result;
}

char getSeperator() {
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    return '\\';
#else
    return '/';
#endif
}

} // namespace cc
