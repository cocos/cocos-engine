#include "BatchedBuffer.h"
#include "gfx/GFXBindingLayout.h"
#include "gfx/GFXBuffer.h"
#include "gfx/GFXInputAssembler.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
map<const Pass *, std::shared_ptr<BatchedBuffer>> BatchedBuffer::_buffers;
std::shared_ptr<BatchedBuffer> &BatchedBuffer::get(const Pass *pass) {
    if (_buffers.find(pass) == _buffers.end()) {
        _buffers[pass] = std::shared_ptr<BatchedBuffer>(CC_NEW(BatchedBuffer(pass)), [](BatchedBuffer *ptr) { CC_SAFE_DELETE(ptr); });
    }
    return _buffers[pass];
}

static UBOLocalBatched g_LocalBatch;

BatchedBuffer::BatchedBuffer(const Pass *pass) {
}

BatchedBuffer::~BatchedBuffer() {
    destroy();
}

void BatchedBuffer::destroy() {
    for (auto &batch : _batchedItems) {
        for (auto vb : batch.vbs) {
            vb->destroy();
        }
        batch.vbIdx->destroy();
        batch.ia->destroy();
        batch.ubo->destroy();
    }
    _batchedItems.clear();
}

void BatchedBuffer::merge(const SubModel *subModel, uint passIdx, const RenderObject *ro) {
    auto renderingSubMesh = GET_RENDER_SUBMESH(subModel->renderSubMeshID);
    if (renderingSubMesh->flatBuffersCount == 0) return;

    size_t vbSize = 0, vbIndexSize = 0;
    auto vbCount = GET_FLAT_BUFFER(renderingSubMesh->flatBuffersID, 0)->count;
    auto psoci = GET_PSOCI(subModel->psociID, passIdx);
    auto bindingLayout = GET_BINDING_LAYOUT(psoci->bindingLayoutID);
    bool isBatchExist = false;

    for (auto &batch : _batchedItems) {
        if (batch.vbs.size() == renderingSubMesh->flatBuffersCount && batch.mergeCount < UBOLocalBatched::BATCHING_COUNT) {
            isBatchExist = true;
            for (size_t j = 0; j < batch.vbs.size(); ++j) {
                auto vb = batch.vbs[j];
                if (vb->getStride() != GET_FLAT_BUFFER(renderingSubMesh->flatBuffersID, j)->stride) {
                    isBatchExist = false;
                    break;
                }
            }

            if (isBatchExist) {
                for (size_t j = 0; j < batch.vbs.size(); ++j) {
                    auto flatBuff = GET_FLAT_BUFFER(renderingSubMesh->flatBuffersID, j);
                    auto batchVB = batch.vbs[j];
                    auto vbData = batch.vbDatas[j];
                    vbSize = (vbCount + batch.vbCount) * flatBuff->stride;
                    if (vbSize > batchVB->getSize()) {
                        auto oldSize = batchVB->getSize();
                        batchVB->resize(vbSize);
                        auto data = std::shared_ptr<uint8_t>(static_cast<uint8_t *>(CC_MALLOC(vbSize)), [](uint8_t *ptr) { CC_SAFE_FREE(ptr); });
                        batch.vbDatas[j] = data;
                        memcpy(data.get(), vbData.get(), oldSize);
                    }
                    memcpy(batch.vbDatas[j].get() + batch.vbCount * flatBuff->stride, GET_BUFFERVIEW(flatBuff->bufferViewID)->data, flatBuff->bufferViewSize);
                }

                auto vbIndexData = batch.vbIndexData;
                vbIndexSize = (vbCount + batch.vbCount) * 4;
                if (vbIndexSize > batch.vbIdx->getSize()) {
                    auto oldSize = batch.vbIdx->getSize();
                    batch.vbIdx->resize(vbIndexSize);
                    auto data = std::shared_ptr<float>(static_cast<float *>(CC_MALLOC(vbIndexSize / sizeof(float))), [](float *ptr) { CC_SAFE_FREE(ptr); });
                    batch.vbIndexData = data;
                    memcpy(data.get(), vbIndexData.get(), oldSize);
                    vbIndexData = batch.vbIndexData;
                }

                const auto start = batch.vbCount;
                const auto end = start + vbCount;
                const auto mergeCount = batch.mergeCount;
                if (vbIndexData.get()[start] != mergeCount || vbIndexData.get()[end - 1] != mergeCount) {
                    for (size_t j = start; j < end; j++) {
                        vbIndexData.get()[j] = mergeCount + 0.1; // guard against underflow
                    }
                }

                // update world matrix
                auto transform = GET_NODE(ro->model->transformID);
                auto worldMatrix = GET_BUFFERVIEW(transform->matViewID);
                memcpy(batch.uboData, worldMatrix->data, UBOLocalBatched::MAT_WORLDS_OFFSET + batch.mergeCount * 16);
                if (!batch.mergeCount && batch.psoci != psoci) {
                    bindingLayout->bindBuffer(UBOLocalBatched::BLOCK.binding, batch.ubo);
                    bindingLayout->update();
                    batch.psoci = psoci;
                }

                ++batch.mergeCount;
                batch.vbCount += vbCount;
                auto prevCount = batch.ia->getVertexCount();
                batch.ia->setVertexCount(prevCount + vbCount);
                return;
            }
        }
    }
}

void BatchedBuffer::clear() {
    for (auto &batch : _batchedItems) {
        batch.vbCount = 0;
        batch.mergeCount = 0;
        batch.ia->setVertexCount(0);
    }
}

void BatchedBuffer::clearUBO() {
    for (auto &batch : _batchedItems) {
        batch.ubo->update(g_LocalBatch.view.data(), 0, g_LocalBatch.view.size());
    }
}
} // namespace pipeline
} // namespace cc
