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

#include <boost/functional/hash.hpp>

#include "base/CoreStd.h"

#include "GFXObject.h"
#include "GFXRenderPass.h"
#include "base/Utils.h"
#include "gfx-base/GFXDef-common.h"

namespace cc {
namespace gfx {

RenderPass::RenderPass()
: GFXObject(ObjectType::RENDER_PASS) {
}

RenderPass::~RenderPass() = default;

// Based on render pass compatibility
size_t RenderPass::computeHash() {
    size_t seed = _colorAttachments.size() * 2 + 3;
    for (const ColorAttachment &ca : _colorAttachments) {
        boost::hash_combine(seed, ca.format);
        boost::hash_combine(seed, ca.sampleCount);
    }
    const auto &ds = _depthStencilAttachment;
    boost::hash_combine(seed, ds.format);
    boost::hash_combine(seed, ds.sampleCount);

    boost::hash_combine(seed, _subpasses);
    return seed;
}

size_t RenderPass::computeHash(const RenderPassInfo &info) {
    return Hasher<RenderPassInfo>()(info);
}

void RenderPass::initialize(const RenderPassInfo &info) {
    _colorAttachments       = info.colorAttachments;
    _depthStencilAttachment = info.depthStencilAttachment;
    _subpasses              = info.subpasses;
    _dependencies           = info.dependencies;
    _hash                   = computeHash();

    doInit(info);
}

void RenderPass::destroy() {
    doDestroy();

    _colorAttachments.clear();
    _subpasses.clear();
    _hash = 0U;
}

} // namespace gfx
} // namespace cc
