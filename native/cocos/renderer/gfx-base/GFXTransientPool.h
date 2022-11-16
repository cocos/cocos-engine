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

#include "GFXObject.h"
#include "GFXAliasingContext.h"
#include "gfx-base/allocator/Allocator.h"
#include "base/RefCounted.h"
#include "base/Ptr.h"

namespace cc {
namespace gfx {

class Buffer;
class Texture;

struct TransientPoolInfo {
    bool enableImage = true;
    bool enableBuffer = true;
    uint32_t blockSize = 64 * 1024 * 1024;
};

class TransientPool : public GFXObject, public RefCounted {
public:
    TransientPool();
    ~TransientPool() override = default;

    void initialize(const TransientPoolInfo &info);

    void beginFrame();
    void endFrame();

    Buffer *requestBuffer(const BufferInfo &info, PassScope scope, AccessFlags accessFlag = AccessFlagBit::NONE);
    Texture *requestTexture(const TextureInfo &info, PassScope scope, AccessFlags accessFlag = AccessFlagBit::NONE);

    void resetBuffer(Buffer *, PassScope scope, AccessFlags accessFlag = AccessFlagBit::NONE);
    void resetTexture(Texture *, PassScope scope, AccessFlags accessFlag = AccessFlagBit::NONE);

protected:
    friend class TransientPoolAgent;
    friend class TransientPoolValidator;

    // game thread
    void recordResource(uint32_t id, PassScope scope, AccessFlags accessFlag);

    // gfx thread
    virtual void doInit(const TransientPoolInfo &info) {}
    virtual void doInitBuffer(Buffer *buffer) {}
    virtual void doResetBuffer(Buffer *buffer) {}
    virtual void doInitTexture(Texture *texture) {}
    virtual void doResetTexture(Texture *texture) {}

    TransientPoolInfo _info;
    ccstd::unordered_map<uint32_t, AliasingResourceTracked> _resources;
    std::unique_ptr<AliasingContext> _context;
    std::vector<IntrusivePtr<Buffer>> _buffers;
    std::vector<IntrusivePtr<Texture>> _textures;
    std::unique_ptr<Allocator> _allocator;
};

} // namespace gfx
} // namespace cc
