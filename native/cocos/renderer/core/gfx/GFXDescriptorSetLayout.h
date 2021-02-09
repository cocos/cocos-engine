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

#ifndef CC_CORE_GFX_DESCRIPTOR_SET_LAYOUT_H_
#define CC_CORE_GFX_DESCRIPTOR_SET_LAYOUT_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL DescriptorSetLayout : public GFXObject {
public:
    DescriptorSetLayout(Device *device);
    virtual ~DescriptorSetLayout();

public:
    virtual bool initialize(const DescriptorSetLayoutInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE const DescriptorSetLayoutBindingList &getBindings() const { return _bindings; }
    CC_INLINE const vector<uint> &getBindingIndices() const { return _bindingIndices; }
    CC_INLINE const vector<uint> &getDescriptorIndices() const { return _descriptorIndices; }
    CC_INLINE const uint getDescriptorCount() const { return _descriptorCount; }

protected:
    Device *_device = nullptr;
    DescriptorSetLayoutBindingList _bindings;
    uint _descriptorCount = 0u;
    vector<uint> _bindingIndices;
    vector<uint> _descriptorIndices;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_DESCRIPTOR_SET_LAYOUT_H_
