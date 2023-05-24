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

#include "GFXObject.h"
#include "base/RefCounted.h"

namespace cc {
namespace gfx {

class CC_DLL DescriptorSetLayout : public GFXObject, public RefCounted {
public:
    DescriptorSetLayout();
    ~DescriptorSetLayout() override;

    void initialize(const DescriptorSetLayoutInfo &info);
    void destroy();

    inline const DescriptorSetLayoutBindingList &getBindings() const { return _bindings; }
    inline const ccstd::vector<uint32_t> &getDynamicBindings() const { return _dynamicBindings; }
    inline const ccstd::vector<uint32_t> &getBindingIndices() const { return _bindingIndices; }
    inline const ccstd::vector<uint32_t> &getDescriptorIndices() const { return _descriptorIndices; }
    inline uint32_t getDescriptorCount() const { return _descriptorCount; }

protected:
    virtual void doInit(const DescriptorSetLayoutInfo &info) = 0;
    virtual void doDestroy() = 0;

    DescriptorSetLayoutBindingList _bindings;
    uint32_t _descriptorCount = 0U;
    ccstd::vector<uint32_t> _bindingIndices;
    ccstd::vector<uint32_t> _descriptorIndices;
    ccstd::vector<uint32_t> _dynamicBindings;
};

} // namespace gfx
} // namespace cc
