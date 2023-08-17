/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

#include <cstdint>
#include <type_traits>
#include "core/memop/CachedArray.h"

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

struct GLESBindingMapping {
    ccstd::vector<int32_t> blockOffsets;
    ccstd::vector<int32_t> samplerTextureOffsets;
    uint32_t flexibleSet{0};
};

class GLESCmd {
public:
    GLESCmdType type;
    uint32_t refCount = 0;

    explicit GLESCmd(GLESCmdType type) : type(type) {}
    virtual ~GLESCmd() = default;

    virtual void clear() = 0;
};

#define GLES_COMMAND_POOL_INITIAL_CAPACITY 1

template <typename T, typename = std::enable_if_t<std::is_base_of<GLESCmd, T>::value>>
class CommandPool {
public:
    CommandPool() : _freeCmds(GLES_COMMAND_POOL_INITIAL_CAPACITY) {
        _frees = ccnew T *[GLES_COMMAND_POOL_INITIAL_CAPACITY];
        _count = GLES_COMMAND_POOL_INITIAL_CAPACITY;
        _freeIdx = GLES_COMMAND_POOL_INITIAL_CAPACITY - 1;
        for (uint32_t i = 0; i < _count; ++i) {
            _frees[i] = ccnew T;
        }
    }

    ~CommandPool() {
        for (uint32_t i = 0; i < _count; ++i) {
            delete _frees[i];
        }
        delete[](_frees);

        for (uint32_t i = 0; i < _freeCmds.size(); ++i) {
            delete _freeCmds[i];
        }
        _freeCmds.clear();
    }

    T *alloc() {
        if (_freeIdx < 0) {
            T **oldFrees = _frees;
            uint32_t size = _count * 2;
            _frees = ccnew T *[size];
            uint32_t increase = size - _count;
            for (uint32_t i = 0; i < increase; ++i) {
                _frees[i] = ccnew T;
            }
            for (uint32_t i = increase, j = 0; i < size; ++i, ++j) {
                _frees[i] = oldFrees[j];
            }
            delete[](oldFrees);

            _count = size;
            _freeIdx += static_cast<int>(increase);
        }

        T *cmd = _frees[_freeIdx];
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
    T **_frees = nullptr;
    uint32_t _count = 0;
    CachedArray<T *> _freeCmds;
    int _freeIdx = 0;
};

} // namespace gfx
} // namespace cc
