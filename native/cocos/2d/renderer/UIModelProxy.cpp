#include "UIModelProxy.h"
#include "2d/renderer/RenderEntity.h"
#include "cocos//core/assets/RenderingSubMesh.h"

namespace cc {
UIModelProxy::UIModelProxy() {
}
UIModelProxy::~UIModelProxy() {
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

        RenderEntity* entity = static_cast<RenderEntity*>(_node->getUserData());
        RenderDrawInfo* drawInfo = entity->getDynamicRenderDrawInfo(val);
        _model->initSubModel(val, renderMesh, drawInfo->getMaterial());
        _graphicsUseSubMeshes.emplace_back(renderMesh);
    }
}

void UIModelProxy::uploadData() {
    RenderEntity* entity = static_cast<RenderEntity*>(_node->getUserData());
    auto drawInfos = entity->getDynamicRenderDrawInfos();
    auto subModelList = _model->getSubModels();
    for (size_t i = 0; i < drawInfos.size(); i++) {
        auto drawInfo = drawInfos[i];
        auto* ia = subModelList.at(i)->getInputAssembler();
        if (drawInfo->getVertexOffset() <= 0) continue;
        gfx::BufferList vBuffers = ia->getVertexBuffers();
        if (vBuffers.size() > 0) {
            auto size = drawInfo->getVertexOffset() * _stride;
            // if (size > vBuffers[0]->getSize()) {
                vBuffers[0]->resize(size);
            // }
            vBuffers[0]->update(drawInfo->getVDataBuffer()); // vdata
        }
        ia->setVertexCount(drawInfo->getVertexOffset()); // count

        gfx::Buffer* iBuffer = ia->getIndexBuffer();
        auto size = drawInfo->getIndexOffset() * sizeof(uint16_t);
        // if (size > iBuffer->getSize()) {
            iBuffer->resize(size);
        // }
        iBuffer->update(drawInfo->getIDataBuffer()); // idata
            ia->setIndexCount(drawInfo->getIndexOffset()); // indexCount
        // drawInfo->setModel(_model); // hack, render by model
    }
    drawInfos[0]->setModel(_model);
}

void UIModelProxy::destroy() {
}

void UIModelProxy::clear() {
}

// for ui model
void UIModelProxy::updateModels(scene::Model* model) {
    _models.emplace_back(model);
}

void UIModelProxy::attachDrawInfo() {
    RenderEntity* entity = static_cast<RenderEntity*>(_node->getUserData());
    auto drawInfos = entity->getDynamicRenderDrawInfos();
    if (drawInfos.size() != _models.size()) return;
    for (size_t i = 0; i < drawInfos.size(); i++) {
        drawInfos[i]->setModel(_models[i]);
    }
}

void UIModelProxy::attachNode(Node* node) {
    _node = node;
}

} // namespace cc
