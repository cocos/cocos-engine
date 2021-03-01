/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#ifndef CC_CORE_GFX_DESCRIPTOR_SET_H_
#define CC_CORE_GFX_DESCRIPTOR_SET_H_

#include "GFXObject.h"

namespace cc {
namespace gfx {

class CC_DLL DescriptorSet : public GFXObject {
public:
    DescriptorSet(Device *device);
    virtual ~DescriptorSet();

public:
    virtual bool initialize(const DescriptorSetInfo &info) = 0;
    virtual void destroy() = 0;
    virtual void update() = 0;

    virtual void bindBuffer(uint binding, Buffer *buffer, uint index);
    virtual void bindTexture(uint binding, Texture *texture, uint index);
    virtual void bindSampler(uint binding, Sampler *sampler, uint index);

    // Functions invoked by JSB adapter
    bool bindBufferJSB(uint binding, Buffer *buffer, uint index);
    bool bindTextureJSB(uint binding, Texture *texture, uint index);
    bool bindSamplerJSB(uint binding, Sampler *sampler, uint index);

    Buffer *getBuffer(uint binding, uint index) const;
    Texture *getTexture(uint binding, uint index) const;
    Sampler *getSampler(uint binding, uint index) const;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE void bindBuffer(uint binding, Buffer *buffer) { bindBuffer(binding, buffer, 0u); }
    CC_INLINE void bindTexture(uint binding, Texture *texture) { bindTexture(binding, texture, 0u); }
    CC_INLINE void bindSampler(uint binding, Sampler *sampler) { bindSampler(binding, sampler, 0u); }
    CC_INLINE Buffer *getBuffer(uint binding) const { return getBuffer(binding, 0u); }
    CC_INLINE Texture *getTexture(uint binding) const { return getTexture(binding, 0u); }
    CC_INLINE Sampler *getSampler(uint binding) const { return getSampler(binding, 0u); }

protected:
    Device *_device = nullptr;

    DescriptorSetLayout *_layout;
    BufferList _buffers;
    TextureList _textures;
    SamplerList _samplers;

    bool _isDirty = false;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_DESCRIPTOR_SET_H_
