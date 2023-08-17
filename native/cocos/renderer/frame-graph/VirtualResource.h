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

#pragma once

#include "Handle.h"
#include "renderer/gfx-base/GFXObject.h"

namespace cc {
namespace framegraph {

class PassNode;

using ID = uint16_t;

class VirtualResource {
public:
    VirtualResource(StringHandle name, ID id, bool imported) noexcept;
    VirtualResource() noexcept = delete;
    virtual ~VirtualResource() = default;
    VirtualResource(const VirtualResource &) = delete;
    VirtualResource(VirtualResource &&) noexcept = delete;
    VirtualResource &operator=(const VirtualResource &) = delete;
    VirtualResource &operator=(VirtualResource &&) noexcept = delete;

    virtual void request() noexcept = 0;
    virtual void release() noexcept = 0;
    bool isImported() const noexcept { return _imported; }
    void updateLifetime(PassNode *passNode) noexcept;
    void newVersion() noexcept { ++_version; }

    virtual gfx::GFXObject *getDeviceResource() const noexcept = 0;

private:
    PassNode *_firstUsePass{nullptr};
    PassNode *_lastUsePass{nullptr};
    const StringHandle _name;
    uint32_t _refCount{0};
    uint16_t _writerCount{0};
    ID _id{0};
    uint8_t _version{0};
    bool const _imported{false};
    bool _neverLoaded{true};
    bool _neverStored{true};
    bool _memoryless{false};
    bool _memorylessMSAA{false};

    friend class FrameGraph;
};

} // namespace framegraph
} // namespace cc
