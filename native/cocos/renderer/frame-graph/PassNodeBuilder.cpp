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

#include "PassNodeBuilder.h"
#include "FrameGraph.h"

namespace cc {
namespace framegraph {

PassNodeBuilder::PassNodeBuilder(FrameGraph &graph, PassNode &passNode) noexcept
: _graph(graph),
  _passNode(passNode) {
}

Handle PassNodeBuilder::read(const Handle &input) const noexcept {
    return _passNode.read(_graph, input);
}

TextureHandle PassNodeBuilder::write(const TextureHandle &output, uint8_t mipmapLevel, uint8_t faceId, uint8_t arrayPosition, const RenderTargetAttachment::Descriptor &attachmentDesc) const noexcept {
    const TextureHandle handle(_passNode.write(_graph, output));
    RenderTargetAttachment attachment;
    attachment.textureHandle = handle;
    attachment.desc = attachmentDesc;
    attachment.level = mipmapLevel;
    attachment.layer = faceId;
    attachment.index = arrayPosition;
    _passNode.createRenderTargetAttachment(std::forward<RenderTargetAttachment>(attachment));

    if (attachmentDesc.loadOp == gfx::LoadOp::LOAD) {
        ResourceNode &outputResourceNode = _graph.getResourceNode(output);
        ++outputResourceNode.readerCount;
    }

    return handle;
}

TextureHandle PassNodeBuilder::write(const TextureHandle &output, const RenderTargetAttachment::Descriptor &attachmentDesc) const noexcept {
    return write(output, 0, 0, 0, attachmentDesc);
}

void PassNodeBuilder::writeToBlackboard(const StringHandle &name, const Handle &handle) const noexcept {
    _graph.getBlackboard().put(name, handle);
}

Handle PassNodeBuilder::readFromBlackboard(const StringHandle &name) const noexcept {
    return Handle(_graph.getBlackboard().get(name));
}

} // namespace framegraph
} // namespace cc
