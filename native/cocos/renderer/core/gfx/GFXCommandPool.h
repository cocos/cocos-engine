#pragma once

#include "GFXCommand.h"

namespace cc {
namespace gfx {

#define INITIAL_CAPACITY 1

template <typename T, typename = std::enable_if<std::is_base_of<GFXCmd, T>::value>>
class GFXCommandPool {
public:
    GFXCommandPool() : _freeCmds(INITIAL_CAPACITY) {
        _frees = new T *[INITIAL_CAPACITY];
        _count = INITIAL_CAPACITY;
        _freeIdx = INITIAL_CAPACITY - 1;
        for (uint i = 0; i < _count; ++i) {
            _frees[i] = CC_NEW(T);
        }
    }

    ~GFXCommandPool() {
        for (uint i = 0; i < _count; ++i) {
            CC_DELETE(_frees[i]);
        }
        delete[](_frees);

        for (uint i = 0; i < _freeCmds.size(); ++i) {
            CC_DELETE(_freeCmds[i]);
        }
        _freeCmds.clear();
    }

    T *alloc() {
        if (_freeIdx < 0) {
            T **old_frees = _frees;
            uint size = _count * 2;
            _frees = new T *[size];
            uint increase = size - _count;
            for (uint i = 0; i < increase; ++i) {
                _frees[i] = CC_NEW(T);
            }
            for (uint i = increase, j = 0; i < size; ++i, ++j) {
                _frees[i] = old_frees[j];
            }
            delete[](old_frees);

            _count = size;
            _freeIdx += (int)increase;
        }

        T *cmd = _frees[_freeIdx];
        _frees[_freeIdx--] = nullptr;
        ++cmd->ref_count;
        return cmd;
    }

    void free(T *cmd) {
        if (--cmd->ref_count == 0) {
            _freeCmds.push(cmd);
        }
    }

    void freeCmds(CachedArray<T *> &cmds) {
        for (uint i = 0; i < cmds.size(); ++i) {
            if (--cmds[i]->ref_count == 0) {
                _freeCmds.push(cmds[i]);
            }
        }
        cmds.clear();
    }

    void release() {
        for (uint i = 0; i < _freeCmds.size(); ++i) {
            T *cmd = _freeCmds[i];
            cmd->clear();
            _frees[++_freeIdx] = cmd;
        }
        _freeCmds.clear();
    }

private:
    T **_frees = nullptr;
    uint _count = 0;
    CachedArray<T *> _freeCmds;
    int _freeIdx = 0;
};

} // namespace gfx
} // namespace cc
