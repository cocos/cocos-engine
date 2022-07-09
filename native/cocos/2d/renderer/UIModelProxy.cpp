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

#include "UIModelProxy.h"
#include "2d/renderer/RenderEntity.h"
#include "core/assets/RenderingSubMesh.h"

namespace cc {
UIModelProxy::UIModelProxy() {
    _device = Root::getInstance()->getDevice();
}

void UIModelProxy::initModel(Node* node) {
    _model = Root::getInstance()->createModel<scene::Model>();
    _model->setNode(node);
    _model->setTransform(node);
    _node = node;
}

void UIModelProxy::activeSubModel(uint8_t val) {
    if (_model == nullptr) return;
    if (_model->getSubModels().size() <= val) {
        auto* entity = static_cast<RenderEntity*>(_node->getUserData());
        RenderDrawInfo* drawInfo = entity->getDynamicRenderDrawInfo(val);
        if (drawInfo == nullptr) {
            return;
        }

        auto* vertexBuffer = _device->createBuffer({
            gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE,
            65535 * _stride,
            _stride,
        });
        auto* indexBuffer = _device->createBuffer({
            gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE,
            65535 * sizeof(uint16_t) * 2,
            sizeof(uint16_t),
        });
        gfx::BufferList vbReference;
        vbReference.emplace_back(vertexBuffer);

        auto* renderMesh = ccnew RenderingSubMesh(vbReference, _attributes, _primitiveMode, indexBuffer);
        renderMesh->setSubMeshIdx(0);

        _model->initSubModel(val, renderMesh, drawInfo->getMaterial());
        _graphicsUseSubMeshes.emplace_back(renderMesh);
    }
}

void UIModelProxy::uploadData() {
    auto* entity = static_cast<RenderEntity*>(_node->getUserData());
    const auto& drawInfos = entity->getDynamicRenderDrawInfos();
    const auto& subModelList = _model->getSubModels();
    for (size_t i = 0; i < drawInfos.size(); i++) {
        auto* drawInfo = drawInfos[i];
        auto* ia = subModelList.at(i)->getInputAssembler();
        if (drawInfo->getVertexOffset() <= 0) continue;
        gfx::BufferList vBuffers = ia->getVertexBuffers();
        if (!vBuffers.empty()) {
            auto size = drawInfo->getVertexOffset() * _stride;
            // if (size > vBuffers[0]->getSize()) {
            vBuffers[0]->resize(size);
            // }
            vBuffers[0]->update(drawInfo->getVDataBuffer()); // vdata
        }
        ia->setVertexCount(drawInfo->getVertexOffset()); // count

        gfx::Buffer* iBuffer = ia->getIndexBuffer();
        auto size = drawInfo->getIndexOffset() * 2;
        // if (size > iBuffer->getSize()) {
        iBuffer->resize(size);
        // }
        iBuffer->update(drawInfo->getIDataBuffer());   // idata
        ia->setIndexCount(drawInfo->getIndexOffset()); // indexCount
        // drawInfo->setModel(_model); // hack, render by model
    }

    if (!drawInfos.empty()) {
        drawInfos[0]->setModel(_model);
    }
}

void UIModelProxy::destroy() {
    if (_model != nullptr) {
        Root::getInstance()->destroyModel(_model);
        _model = nullptr;
    }
}

void UIModelProxy::clear() {
}

// for ui model
void UIModelProxy::updateModels(scene::Model* model) {
    _models.emplace_back(model);
}

void UIModelProxy::attachDrawInfo() {
    auto* entity = static_cast<RenderEntity*>(_node->getUserData());
    auto& drawInfos = entity->getDynamicRenderDrawInfos();
    if (drawInfos.size() != _models.size()) return;
    for (size_t i = 0; i < drawInfos.size(); i++) {
        drawInfos[i]->setModel(_models[i]);
    }
}

void UIModelProxy::attachNode(Node* node) {
    _node = node;
}

} // namespace cc
