/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include <cstdint>
#include <type_traits>
#include "base/CachedArray.h"

namespace cc {
namespace gfx {

// Multisampled Render to Texture
enum class MSRTSupportLevel {
    NONE,
    LEVEL1,
    LEVEL2,
};

// Framebuffer Fetch
enum class FBFSupportLevel {
    NONE,
    COHERENT,
    NON_COHERENT_EXT,
    NON_COHERENT_QCOM,
};

enum class GLESCmdType : uint8_t {
    BEGIN_RENDER_PASS,
    END_RENDER_PASS,
    BIND_STATES,
    DRAW,
    UPDATE_BUFFER,
    COPY_BUFFER_TO_TEXTURE,
    BLIT_TEXTURE,
    DISPATCH,
    BARRIER,
    QUERY,
    COUNT,
};

class GLESBindingMapping {
public:
    vector<int32_t> blockOffsets;
    vector<int32_t> samplerTextureOffsets;
    uint32_t        flexibleSet{0};
};

class GLESCmd : public Object {
public:
    GLESCmdType type;
    uint32_t    refCount = 0;

    explicit GLESCmd(GLESCmdType type) : type(type) {}
    ~GLESCmd() override = default;

    virtual void clear() = 0;
};

#define INITIAL_CAPACITY 1

template <typename T, typename = std::enable_if_t<std::is_base_of<GLESCmd, T>::value>>
class CommandPool {
public:
    CommandPool() : _freeCmds(INITIAL_CAPACITY) {
        _frees   = new T *[INITIAL_CAPACITY];
        _count   = INITIAL_CAPACITY;
        _freeIdx = INITIAL_CAPACITY - 1;
        for (uint32_t i = 0; i < _count; ++i) {
            _frees[i] = CC_NEW(T);
        }
    }

    ~CommandPool() {
        for (uint32_t i = 0; i < _count; ++i) {
            CC_DELETE(_frees[i]);
        }
        delete[](_frees);

        for (uint32_t i = 0; i < _freeCmds.size(); ++i) {
            CC_DELETE(_freeCmds[i]);
        }
        _freeCmds.clear();
    }

    T *alloc() {
        if (_freeIdx < 0) {
            T **     oldFrees = _frees;
            uint32_t size     = _count * 2;
            _frees            = new T *[size];
            uint32_t increase = size - _count;
            for (uint32_t i = 0; i < increase; ++i) {
                _frees[i] = CC_NEW(T);
            }
            for (uint32_t i = increase, j = 0; i < size; ++i, ++j) {
                _frees[i] = oldFrees[j];
            }
            delete[](oldFrees);

            _count = size;
            _freeIdx += static_cast<int>(increase);
        }

        T *cmd             = _frees[_freeIdx];
        _frees[_freeIdx--] = nullptr;
        ++cmd->refCount;
        return cmd;
    }

    void free(T *cmd) {
        if (--cmd->refCount == 0) {
            _freeCmds.push(cmd);
        }
    }

    void freeCmds(CachedArray<T *> &cmds) {
        for (uint32_t i = 0; i < cmds.size(); ++i) {
            if (--cmds[i]->refCount == 0) {
                _freeCmds.push(cmds[i]);
            }
        }
        cmds.clear();
    }

    void release() {
        for (uint32_t i = 0; i < _freeCmds.size(); ++i) {
            T *cmd = _freeCmds[i];
            cmd->clear();
            _frees[++_freeIdx] = cmd;
        }
        _freeCmds.clear();
    }

protected:
    T **             _frees = nullptr;
    uint32_t         _count = 0;
    CachedArray<T *> _freeCmds;
    int              _freeIdx = 0;
};

} // namespace gfx
} // namespace cc
