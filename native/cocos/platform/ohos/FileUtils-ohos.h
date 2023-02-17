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

#pragma once
//clang-format off
#include <cstdint>
//clang-format on
#include <rawfile/raw_dir.h>
#include <rawfile/raw_file.h>
#include <rawfile/resource_manager.h>
#include "base/Macros.h"
#include "cocos/platform/FileUtils.h"

namespace cc {

class CC_DLL FileUtilsOHOS : public FileUtils {
public:
    static bool initResourceManager(ResourceManager *mgr, const ccstd::string &assetPath, const ccstd::string &moduleName);

    static void setRawfilePrefix(const ccstd::string &prefix);

    static ResourceManager *getResourceManager();

    FileUtilsOHOS();
    ~FileUtilsOHOS() override = default;

    bool init() override;

    FileUtils::Status getContents(const ccstd::string &filename, ResizableBuffer *buffer) override;

    bool isAbsolutePath(const ccstd::string &strPath) const override;

    ccstd::string getWritablePath() const override;

    ccstd::string expandPath(const ccstd::string &input, bool *isRawFile) const;

    std::pair<int, std::function<void()>> getFd(const ccstd::string &path) const;

private:
    bool isFileExistInternal(const ccstd::string &strFilePath) const override;

    bool isDirectoryExistInternal(const ccstd::string &dirPath) const override;

    /* weak ref, do not need release */
    static ResourceManager *ohosResourceMgr;
    static ccstd::string ohosAssetPath;

    friend class FileUtils;
};

} // namespace cc
