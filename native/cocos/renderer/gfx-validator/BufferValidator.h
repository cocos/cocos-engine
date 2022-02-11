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

#include "base/Agent.h"
#include "gfx-base/GFXBuffer.h"

namespace cc {
namespace gfx {

class CC_DLL BufferValidator final : public Agent<Buffer> {
public:
    static bool recordInitStack;

    explicit BufferValidator(Buffer *actor);
    ~BufferValidator() override;

    void update(const void *buffer, uint32_t size) override;

    void sanityCheck(const void *buffer, uint32_t size);

    inline bool isInited() const { return _inited; }

protected:
    void doInit(const BufferInfo &info) override;
    void doInit(const BufferViewInfo &info) override;
    void doResize(uint32_t size, uint32_t count) override;
    void doDestroy() override;

    vector<uint8_t> _buffer;

    uint32_t _lastUpdateFrame{0U};
    uint32_t _totalUpdateTimes{0U};
    uint32_t _creationFrame{0U};

    bool _inited{false};

    String _initStack;
};

} // namespace gfx
} // namespace cc
