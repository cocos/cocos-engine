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

#include "DevicePassResourceTable.h"

#include <algorithm>
#include "FrameGraph.h"
#include "PassNode.h"

namespace cc {
namespace framegraph {

gfx::GFXObject *DevicePassResourceTable::get(const ResourceDictionary &from, Handle handle) noexcept {
    const auto it = from.find(handle);
    return it == from.cend() ? nullptr : it->second;
}

void DevicePassResourceTable::extract(const FrameGraph &graph,
                                      const PassNode *passNode,
                                      ccstd::vector<const gfx::Texture *> const &renderTargets) noexcept {
    do {
        extract(graph, passNode->_reads, _reads, false, renderTargets);
        extract(graph, passNode->_writes, _writes, true, renderTargets);

        passNode = passNode->_next;
    } while (passNode);
}

void DevicePassResourceTable::extract(const FrameGraph &graph,
                                      ccstd::vector<Handle> const &from,
                                      ResourceDictionary &to,
                                      bool /*ignoreRenderTarget*/,
                                      ccstd::vector<const gfx::Texture *> const & /*renderTargets*/) noexcept {
    std::for_each(from.cbegin(), from.cend(), [&](const Handle handle) {
        if (to.find(handle) != to.cend()) {
            return;
        }

        const ResourceNode &resourceNode = graph.getResourceNode(handle);
        CC_ASSERT(resourceNode.virtualResource);
        gfx::GFXObject *const deviceResource = resourceNode.virtualResource->getDeviceResource();

        if (!deviceResource) {
            return;
        }

        //if (ignoreRenderTarget) {
        //    bool const isRenderTarget =
        //        std::find_if(
        //            renderTargets.cbegin(),
        //            renderTargets.cend(),
        //            [&deviceResource](const gfx::Texture *const x) {
        //                return deviceResource == x;
        //            }) != renderTargets.cend();

        //    if (isRenderTarget) {
        //        return;
        //    }
        //}

        to[handle] = deviceResource;
    });
}

} // namespace framegraph
} // namespace cc
