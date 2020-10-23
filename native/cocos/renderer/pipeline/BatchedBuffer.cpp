#include "BatchedBuffer.h"
#include "gfx/GFXBuffer.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXInputAssembler.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
map<uint, map<uint, BatchedBuffer *>> BatchedBuffer::_buffers;
BatchedBuffer *BatchedBuffer::get(uint pass) {
    return BatchedBuffer::get(pass, 0);
}
BatchedBuffer *BatchedBuffer::get(uint pass, uint extraKey) {
    auto &record = _buffers[pass];
    auto &buffer = record[extraKey];
    if (buffer == nullptr) buffer = CC_NEW(BatchedBuffer(GET_PASS(pass)));
    return buffer;
}

BatchedBuffer::BatchedBuffer(const PassView *pass)
: _pass(pass),
  _device(gfx::Device::getInstance()) {
}

BatchedBuffer::~BatchedBuffer() {
}

void BatchedBuffer::destroy() {
    for (auto &batch : _batches) {
        for (auto vb : batch.vbs) {
            vb->destroy();
        }

        for (auto data : batch.vbDatas) {
            CC_FREE(data);
        }

        batch.indexBuffer->destroy();
        batch.ia->destroy();
        batch.ubo->destroy();

        CC_FREE(batch.indexData);
    }
    _batches.clear();
}

void BatchedBuffer::merge(const SubModelView *subModel, uint passIdx, const RenderObject *renderObject) {
    const auto subMesh = subModel->getSubMesh();
    const auto flatBuffersID = subMesh->getFlatBufferArrayID();
    const auto flatBuffersCount = flatBuffersID[0];
    if (flatBuffersCount == 0) {
        return;
    }

    const auto flatBuffer = subMesh->getFlatBuffer(flatBuffersID[1]);
    auto vbSize = 0;
    auto indexSize = 0;
    const auto vbCount = flatBuffer->count;
    const auto pass = subModel->getPassView(passIdx);
    const auto shader = subModel->getShader(passIdx);
    const auto descriptorSet = subModel->getDescriptorSet();
    bool isBatchExist = false;

    for (auto i = 0; i < _batches.size(); ++i) {
        auto batch = _batches[i];
        if (batch.vbs.size() == flatBuffersCount && batch.mergeCount < UBOLocalBatched::BATCHING_COUNT) {
            isBatchExist = true;
            for (auto j = 0; j < flatBuffersCount; ++j) {
                const auto vb = batch.vbs[j];
                if (vb->getStride() != subMesh->getFlatBuffer(flatBuffersID[j + 1])->stride) {
                    isBatchExist = false;
                    break;
                }
            }

            if (isBatchExist) {
                for (auto j = 0; j < flatBuffersCount; ++j) {
                    const auto flatBuffer = subMesh->getFlatBuffer(flatBuffersID[j + 1]);
                    auto batchVB = batch.vbs[j];
                    auto vbData = batch.vbDatas[j];
                    const auto vbBufSizeOld = batchVB->getSize();
                    vbSize = (vbCount + batch.vbCount) * flatBuffer->stride;
                    if (vbSize > vbBufSizeOld) {
                        uint8_t *vbDataNew = static_cast<uint8_t *>(CC_MALLOC(vbSize));
                        memcpy(vbDataNew, vbData, vbBufSizeOld);
                        batchVB->resize(vbSize);
                        batch.vbDatas[j] = vbDataNew;
                        CC_FREE(vbData);
                    }

                    auto size = 0u;
                    auto offset = batch.vbCount * flatBuffer->stride;
                    const auto data = flatBuffer->getBuffer(&size);
                    memcpy(vbData + offset, data, size);
                }

                auto indexData = batch.indexData;
                indexSize = (vbCount + batch.vbCount) * sizeof(float);
                if (indexSize > batch.indexBuffer->getSize()) {

                    batch.indexData = static_cast<float *>(CC_MALLOC(indexSize));
                    memcpy(batch.indexData, indexData, batch.indexBuffer->getSize());
                    CC_FREE(indexData);
                    indexData = batch.indexData;
                    batch.indexBuffer->resize(indexSize);
                }

                const auto start = batch.vbCount;
                const auto end = start + vbCount;
                const auto mergeCount = batch.mergeCount;
                if (indexData[start] != mergeCount || indexData[end - 1] != mergeCount) {
                    for (auto j = start; j < end; j++) {
                        indexData[j] = mergeCount + 0.1f; // guard against underflow
                    }
                }

                // update world matrix
                const auto offset = UBOLocalBatched::MAT_WORLDS_OFFSET + batch.mergeCount * 16;
                const auto &worldMatrix = renderObject->model->getTransform()->worldMatrix;
                memcpy(batch.uboData.data() + offset, worldMatrix.m, sizeof(worldMatrix));

                if (!batch.mergeCount) {
                    descriptorSet->bindBuffer(UBOLocalBatched::BLOCK.layout.binding, batch.ubo);
                    descriptorSet->update();
                    batch.pass = pass;
                    batch.shader = shader;
                    batch.descriptorSet = descriptorSet;
                }

                ++batch.mergeCount;
                batch.vbCount += vbCount;
                auto prevCount = batch.ia->getVertexCount();
                batch.ia->setVertexCount(prevCount + vbCount);
                return;
            }
        }
    }

    // Create a new batch
    vector<gfx::Buffer *> vbs(flatBuffersCount);
    vector<uint8_t *> vbDatas(flatBuffersCount);
    vector<gfx::Buffer *> totalVBs(flatBuffersCount + 1);

    for (auto i = 0; i < flatBuffersCount; ++i) {
        const auto flatBuffer = subMesh->getFlatBuffer(flatBuffersID[i + 1]);
        auto newVB = _device->createBuffer({
            gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
            flatBuffer->count * flatBuffer->stride,
            flatBuffer->stride,
        });
        auto size = 0u;
        auto data = flatBuffer->getBuffer(&size);
        newVB->update(data, 0, size);

        vbs[i] = newVB;
        vbDatas[i] = static_cast<uint8_t *>(CC_MALLOC(newVB->getSize()));
        totalVBs[i] = newVB;
    }

    const auto indexBufferSize = vbCount * sizeof(float);
    auto indexBuffer = _device->createBuffer({
        gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        static_cast<uint>(indexBufferSize),
        sizeof(float),
    });
    float *indexData = static_cast<float *>(CC_MALLOC(indexBufferSize));
    memset(indexData, 0, indexBufferSize);
    indexBuffer->update(indexData, 0, indexBufferSize);
    totalVBs[flatBuffersCount] = indexBuffer;

    vector<gfx::Attribute> attributes = subModel->getInputAssembler()->getAttributes();
    gfx::Attribute attrib = {
        "a_dyn_batch_id",
        gfx::Format::R32F,
        false,
        flatBuffersCount,
    };
    attributes.emplace_back(std::move(attrib));

    auto ia = _device->createInputAssembler({std::move(attributes), std::move(totalVBs)});

    auto ubo = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        UBOLocalBatched::SIZE,
        UBOLocalBatched::SIZE,
    });

    descriptorSet->bindBuffer(UBOLocalBatched::BLOCK.layout.binding, ubo);
    descriptorSet->update();

    std::array<float, UBOLocalBatched::COUNT> uboData;
    const auto &worldMatrix = renderObject->model->getTransform()->worldMatrix;
    memcpy(uboData.data() + UBOLocalBatched::MAT_WORLDS_OFFSET, worldMatrix.m, sizeof(worldMatrix));
    BatchedItem item = {
        std::move(vbs),                  //vbs
        std::move(vbDatas),              //vbDatas
        indexBuffer,                     //indexBuffer
        static_cast<float *>(indexData), //indexData
        vbCount,                         //vbCount
        1,                               //mergeCount
        ia,                              //ia
        ubo,                             //ubo
        std::move(uboData),              //uboData
        descriptorSet,                   //descriptorSet
        pass,                            //pass
        shader,                          //shader
    };
    _batches.emplace_back(std::move(item));
}

void BatchedBuffer::clear() {
    for (auto &batch : _batches) {
        batch.vbCount = 0;
        batch.mergeCount = 0;
        batch.ia->setVertexCount(0);
    }
}

void BatchedBuffer::setDynamicOffset(uint idx, uint value) {
    _dynamicOffsets[idx] = value;
}

} // namespace pipeline
} // namespace cc
