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

#pragma once

#include "android/asset_manager.h"
#include "base/Macros.h"
#include "base/std/container/string.h"
#include "jni.h"
#include "platform/FileUtils.h"

namespace cc {

class ZipFile;

/**
 * @addtogroup platform
 * @{
 */

//! @brief  Helper class to handle file operations
class CC_DLL FileUtilsAndroid : public FileUtils {
    friend class FileUtils;

public:
    FileUtilsAndroid();
    ~FileUtilsAndroid() override;

    static void setAssetManager(AAssetManager *a);
    static AAssetManager *getAssetManager() { return assetmanager; }
    static ZipFile *getObbFile() { return obbfile; }

    /* override functions */
    bool init() override;
    FileUtils::Status getContents(const ccstd::string &filename, ResizableBuffer *buffer) override;

    ccstd::string getWritablePath() const override;
    bool isAbsolutePath(const ccstd::string &strPath) const override;

private:
    bool isFileExistInternal(const ccstd::string &strFilePath) const override;
    bool isDirectoryExistInternal(const ccstd::string &dirPath) const override;

    static AAssetManager *assetmanager;
    static ZipFile *obbfile;
};

// end of platform group
/// @}

} // namespace cc
