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

namespace cc {
namespace gfx {

class CC_DLL RenderPass : public GFXObject {
public:
    RenderPass();
    ~RenderPass() override;

    static size_t computeHash(const RenderPassInfo &info);

    void initialize(const RenderPassInfo &info);
    void destroy();

    inline const ColorAttachmentList &   getColorAttachments() const { return _colorAttachments; }
    inline const DepthStencilAttachment &getDepthStencilAttachment() const { return _depthStencilAttachment; }
    inline const SubpassInfoList &       getSubpasses() const { return _subpasses; }
    inline const SubpassDependencyList & getDependencies() const { return _dependencies; }
    inline size_t                        getHash() const { return _hash; }

protected:
    size_t computeHash();

    virtual void doInit(const RenderPassInfo &info) = 0;
    virtual void doDestroy()                        = 0;

    ColorAttachmentList    _colorAttachments;
    DepthStencilAttachment _depthStencilAttachment;
    SubpassInfoList        _subpasses;
    SubpassDependencyList  _dependencies;
    size_t                 _hash = 0;
};

} // namespace gfx
} // namespace cc
