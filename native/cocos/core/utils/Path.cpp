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

#include "core/utils/Path.h"
#include <cstring>
#include "base/StringUtil.h"

namespace cc {

namespace {
const ccstd::string EMPTY_STRING;

ccstd::string &removeLastSlash(ccstd::string &path) {
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

ccstd::string join(const ccstd::vector<ccstd::string> &segments) {
    ccstd::string result;

    for (const auto &segment : segments) {
        if (!result.empty()) {
            result += "/";
        }
        result += segment;
        removeLastSlash(result);
    }

    return result;
}

ccstd::string extname(const ccstd::string &path) {
    if (path.empty()) {
        return EMPTY_STRING;
    }

    ccstd::string newPath = path;
    size_t index = path.find_first_of('?');
    if (index != ccstd::string::npos && index > 0) {
        newPath = newPath.substr(0, index);
    }

    index = newPath.find_last_of('.');
    if (index == ccstd::string::npos) {
        return EMPTY_STRING;
    }

    return newPath.substr(index);
}

ccstd::string mainFileName(const ccstd::string &fileName) {
    if (!fileName.empty()) {
        size_t idx = fileName.find_last_of('.');
        if (idx != ccstd::string::npos) {
            return fileName.substr(0, idx);
        }
    }

    return fileName;
}

ccstd::string basename(const ccstd::string &path, const ccstd::string &extName /* = ""*/) {
    ccstd::string newPath = path;
    size_t index = path.find_first_of('?');
    if (index != ccstd::string::npos && index > 0) {
        newPath = newPath.substr(0, index);
    }

    removeLastSlash(newPath);

    index = newPath.find_last_of("/\\");
    if (index == ccstd::string::npos) {
        return newPath;
    }

    ccstd::string baseName = newPath.substr(index + 1);

    if (!extName.empty() && extName.length() < newPath.length()) {
        ccstd::string extInPath = newPath.substr(newPath.length() - extName.length());
        ccstd::string expectedExtName = extName;
        if (StringUtil::tolower(extInPath) == StringUtil::tolower(expectedExtName)) {
            baseName = baseName.substr(0, baseName.length() - extName.length());
        }
    }

    return baseName;
}

ccstd::string dirname(const ccstd::string &path) {
    size_t index = path.find_last_of("/\\");
    if (index == ccstd::string::npos) {
        return "";
    }

    ccstd::string dir = path.substr(0, index);
    removeLastSlash(dir);
    return dir;
}

ccstd::string changeExtname(const ccstd::string &path, const ccstd::string &extName /* = ""*/) {
    size_t index = path.find_first_of('?');
    ccstd::string newPath = path;
    ccstd::string tempStr;
    if (index != ccstd::string::npos && index > 0) {
        tempStr = path.substr(index);
        newPath = path.substr(0, index);
    }

    index = newPath.find_last_of('.');
    if (index == ccstd::string::npos) {
        return newPath + extName + tempStr;
    }

    return newPath.substr(0, index) + extName + tempStr;
}

ccstd::string changeBasename(const ccstd::string &path, const ccstd::string &baseName, bool isSameExt /* = false*/) {
    if (baseName.find_last_of('.') == 0) {
        return changeExtname(path, baseName);
    }

    size_t index = path.find_last_of('?');
    ccstd::string tempStr;
    ccstd::string newPath = path;
    const ccstd::string ext = isSameExt ? extname(path) : "";
    if (index != ccstd::string::npos && index > 0) {
        tempStr = path.substr(index);
        newPath = path.substr(0, index);
    }

    index = newPath.find_last_of("/\\");
    if (index == ccstd::string::npos) {
        index = 0;
    } else if (index > 0) {
        ++index;
    }

    return newPath.substr(0, index) + baseName + ext + tempStr;
}

ccstd::string normalize(const ccstd::string &url) {
    ccstd::string oldUrl = url;
    ccstd::string newUrl = url;

    // remove all ../
    do {
        oldUrl = newUrl;
        size_t index = newUrl.find("../");
        if (index == ccstd::string::npos) {
            index = newUrl.find("..\\");
        }
        size_t previousSlashIndex = ccstd::string::npos;
        size_t previousTwiceSlashIndex = ccstd::string::npos;
        if (index != ccstd::string::npos && index > 0) {
            previousSlashIndex = newUrl.find_last_of("/\\", index - 1);
            if (previousSlashIndex != ccstd::string::npos) {
                previousTwiceSlashIndex = newUrl.find_last_of("/\\", previousSlashIndex - 1);
            }
        }

        if (previousTwiceSlashIndex == ccstd::string::npos) {
            if (previousSlashIndex != ccstd::string::npos) {
                newUrl = newUrl.substr(index + strlen("../"));
            }
        } else if (previousSlashIndex != ccstd::string::npos) {
            newUrl = newUrl.substr(0, previousTwiceSlashIndex) + '/' + newUrl.substr(index + strlen("../"));
        }
    } while (oldUrl.length() != newUrl.length());

    return newUrl;
}

ccstd::string stripSep(const ccstd::string &path) {
    ccstd::string result = path;
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
