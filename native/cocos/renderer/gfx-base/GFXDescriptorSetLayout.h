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

#pragma once

#include "GFXObject.h"

namespace cc {
namespace gfx {

class CC_DLL DescriptorSetLayout : public GFXObject {
public:
    DescriptorSetLayout();
    ~DescriptorSetLayout() override;

    void initialize(const DescriptorSetLayoutInfo &info);
    void destroy();

    inline const DescriptorSetLayoutBindingList &getBindings() const { return _bindings; }
    inline const vector<uint> &                  getDynamicBindings() const { return _dynamicBindings; }
    inline const vector<uint> &                  getBindingIndices() const { return _bindingIndices; }
    inline const vector<uint> &                  getDescriptorIndices() const { return _descriptorIndices; }
    inline uint                                  getDescriptorCount() const { return _descriptorCount; }

protected:
    virtual void doInit(const DescriptorSetLayoutInfo &info) = 0;
    virtual void doDestroy()                                 = 0;

    DescriptorSetLayoutBindingList _bindings;
    uint                           _descriptorCount = 0U;
    vector<uint>                   _bindingIndices;
    vector<uint>                   _descriptorIndices;
    vector<uint>                   _dynamicBindings;
};

} // namespace gfx
} // namespace cc
