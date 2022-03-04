/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <string>
#include <vector>
#include "android/asset_manager.h"
#include "base/Macros.h"
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
    /**
     * @js NA
     * @lua NA
     */
    ~FileUtilsAndroid() override;

    static void           setassetmanager(AAssetManager *a);
    static AAssetManager *getAssetManager() { return assetmanager; }
    static ZipFile *      getObbFile() { return obbfile; }

    /* override functions */
    bool              init() override;
    FileUtils::Status getContents(const std::string &filename, ResizableBuffer *buffer) override;

    std::string getWritablePath() const override;
    bool        isAbsolutePath(const std::string &strPath) const override;

private:
    bool isFileExistInternal(const std::string &strFilePath) const override;
    bool isDirectoryExistInternal(const std::string &dirPath) const override;

    static AAssetManager *assetmanager;
    static ZipFile *      obbfile;
};

// end of platform group
/// @}

} // namespace cc
