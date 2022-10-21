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
#include "base/RefCounted.h"

namespace cc {
namespace gfx {

class Buffer;
class Texture;

struct TransientPoolInfo {
    bool enableImage = true;
    bool enableBuffer = true;
};

class TransientPool : public GFXObject, public RefCounted {
public:
    TransientPool();
    ~TransientPool() override = default;

    void initialize(const TransientPoolInfo &info);

    Buffer *requestBuffer(const BufferInfo &info);
    Texture *requestTexture(const TextureInfo &info);

    void resetBuffer(Buffer *);
    void resetTexture(Texture *);

protected:
    friend class TransientPoolAgent;
    friend class TransientPoolValidator;

    virtual void doInit(const TransientPoolInfo &info) {};
    virtual void doInitBuffer(Buffer *buffer) {}
    virtual void doResetBuffer(Buffer *buffer) {}
    virtual void doInitTexture(Texture *texture) {}
    virtual void doResetTexture(Texture *texture) {}
};

} // namespace gfx
} // namespace cc
