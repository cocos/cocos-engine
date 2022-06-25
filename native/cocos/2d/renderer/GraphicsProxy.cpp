#include "GraphicsProxy.h"
#include "2d/renderer/RenderEntity.h"
#include "cocos//core/assets/RenderingSubMesh.h"

namespace cc {
GraphicsProxy::GraphicsProxy() {
}
GraphicsProxy::~GraphicsProxy() {
}

void GraphicsProxy::initModel(Node* node) {
    _model = Root::getInstance()->createModel<scene::Model>();
    _model->setNode(node);
    _model->setTransform(node);
    _node = node;
}

void GraphicsProxy::activeSubModel(uint8_t val) {
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
        RenderDrawInfo* drawInfo = entity->getStaticRenderDrawInfo(0);
        _model->initSubModel(val, renderMesh, drawInfo->getMaterial()); //材质实例
        _graphicsUseSubMeshes.emplace_back(renderMesh);
    }
}

void GraphicsProxy::uploadData() {
    RenderEntity* entity = static_cast<RenderEntity*>(_node->getUserData()); // 这儿是一对多// list
    RenderDrawInfo* drawInfo = entity->getStaticRenderDrawInfo(0);
    auto subModelList = _model->getSubModels();
    for (size_t i = 0; i < subModelList.size(); i++) { // 可能会多
        auto* ia = subModelList.at(0)->getInputAssembler();
        if (drawInfo->getVbCount() <= 0) continue;
        gfx::BufferList vBuffers = ia->getVertexBuffers();
        if (vBuffers.size() > 0) {
            auto size = drawInfo->getVbCount() * _stride;
            vBuffers[0]->resize(size);
            vBuffers[0]->update(drawInfo->getVDataBuffer()); // vdata
        }
        ia->setVertexCount(drawInfo->getVbCount()); // count

        gfx::Buffer* iBuffer = ia->getIndexBuffer();
        auto size = drawInfo->getIbCount() * 2;
        iBuffer->resize(size);
        iBuffer->update(drawInfo->getIDataBuffer()); // idata
        ia->setIndexCount(drawInfo->getIbCount());   // indexCount
    }
    drawInfo->setModel(_model);
}

void GraphicsProxy::destroy() {
}

void GraphicsProxy::clear() {
}

} // namespace cc
