
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

#pragma once

#include "base/Macros.h"

namespace cc {

class CC_DLL BaseFileHandle {
public:
    enum class MoveMethod{
        FILE_SEEK_CUR = 0,
        FILE_SEEK_END = 1,
        FILE_SEEK_SET = 2,
    };
    BaseFileHandle() = default;
    virtual ~BaseFileHandle() { };

    virtual bool seek(int64_t pos, MoveMethod moveMethod = MoveMethod::FILE_SEEK_CUR) = 0;
    virtual int64_t tell() = 0;
    virtual int64_t size() = 0;
    virtual bool read(char* buffer, int64_t buffersize) = 0;
    virtual bool write(char* buffer, int64_t buffersize) = 0;
    virtual bool flush() = 0;
    virtual bool close() = 0;
};

} // namespace cc
