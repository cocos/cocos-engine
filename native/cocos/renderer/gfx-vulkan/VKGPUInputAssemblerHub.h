/****************************************************************************
Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "VKGPUObjects.h"

namespace cc {
namespace gfx {

class CCVKGPUDevice;

class CCVKGPUInputAssemblerHub {
public:
    explicit CCVKGPUInputAssemblerHub(CCVKGPUDevice *device)
        : _gpuDevice(device) {
    }

    ~CCVKGPUInputAssemblerHub() = default;

    void connect(CCVKGPUInputAssembler *ia, const CCVKGPUBufferView *buffer) {
        _ias[buffer].insert(ia);
    }

    void update(CCVKGPUBufferView* oldBuffer, CCVKGPUBufferView* newBuffer) {
        auto iter = _ias.find(oldBuffer);
        if (iter != _ias.end()) {
            for (const auto &ia : iter->second) {
                ia->update(oldBuffer, newBuffer);
                _ias[newBuffer].insert(ia);
            }
            _ias.erase(iter);
        }
    }

    void disengage(const CCVKGPUBufferView *buffer) {
        auto iter = _ias.find(buffer);
        if (iter != _ias.end()) {
            _ias.erase(iter);
        }
    }

    void disengage(CCVKGPUInputAssembler *set, const CCVKGPUBufferView *buffer) {
        auto iter = _ias.find(buffer);
        if (iter == _ias.end()) return;
        iter->second.erase(set);
    }

private:
    CCVKGPUDevice *_gpuDevice;
    ccstd::unordered_map<const CCVKGPUBufferView *, std::unordered_set<CCVKGPUInputAssembler *>> _ias;
};

} // namespace gfx
} // namespace cc
