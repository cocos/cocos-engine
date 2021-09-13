
#include "bindings/auto/jsb_scene_auto.h"
#include "jsb_scene_manual.h"
#include "scene/Model.h"
#include "scene/Node.h"

namespace {

template <class T>
struct alignas(uint32_t) AlignedPtr {
    char _data[8];
    T *  get() {
        return reinterpret_cast<T *>(static_cast<uintptr_t>(*reinterpret_cast<uint64_t *>(this)));
    }
};

void fastSetFlag(void *buffer) {
    struct Heap {
        AlignedPtr<cc::scene::DrawBatch2D> selfPtr;
        uint32_t                           flags;
    };
    Heap *heap                    = reinterpret_cast<Heap *>(buffer);
    heap->selfPtr.get()->visFlags = heap->flags;
}

void fastSetDescriptorSet(void *buffer) {
    struct Heap {
        AlignedPtr<cc::scene::DrawBatch2D> selfPtr;
        AlignedPtr<cc::gfx::DescriptorSet> dsPtr;
    };
    Heap *heap                         = reinterpret_cast<Heap *>(buffer);
    heap->selfPtr.get()->descriptorSet = heap->dsPtr.get();
}

void fastSetInputAssembler(void *buffer) {
    struct Heap {
        AlignedPtr<cc::scene::DrawBatch2D>  selfPtr;
        AlignedPtr<cc::gfx::InputAssembler> inputAssemblerPtr;
    };
    Heap *heap                          = reinterpret_cast<Heap *>(buffer);
    heap->selfPtr.get()->inputAssembler = heap->inputAssemblerPtr.get();
}

void fastSetPasses(void *buffer) {
    struct Heap {
        AlignedPtr<cc::scene::DrawBatch2D> selfPtr;
        uint32_t                           passSize;
        AlignedPtr<cc::scene::Pass>        passes[0];
    };
    //static_assert(offsetof(Heap, passes) == 12); // c++17

    Heap *heap   = reinterpret_cast<Heap *>(buffer);
    auto &passes = heap->selfPtr.get()->passes;
    passes.resize(heap->passSize);
    for (size_t i = 0; i < heap->passSize; i++) {
        passes[i] = heap->passes[i].get();
    }
}

void fastSetShaders(void *buffer) {
    struct Heap {
        AlignedPtr<cc::scene::DrawBatch2D> selfPtr;
        uint32_t                           shaderSize;
        AlignedPtr<cc::gfx::Shader>        shaders[0];
    };
    Heap *heap    = reinterpret_cast<Heap *>(buffer);
    auto &shaders = heap->selfPtr.get()->shaders;
    shaders.resize(heap->shaderSize);
    for (size_t i = 0; i < heap->shaderSize; i++) {
        shaders[i] = heap->shaders[i].get();
    }
}

// for pass message
void fastSetPassBlendState(void *buffer) {
    struct Heap {
        AlignedPtr<cc::scene::Pass>     selfPtr;
        AlignedPtr<cc::gfx::BlendState> bsPtr;
    };
    Heap *heap = reinterpret_cast<Heap *>(buffer);
    heap->selfPtr.get()->setBlendState(heap->bsPtr.get());
}

void fastSetPassDepthStencilState(void *buffer) {
    struct Heap {
        AlignedPtr<cc::scene::Pass>            selfPtr;
        AlignedPtr<cc::gfx::DepthStencilState> dsPtr;
    };
    Heap *heap = reinterpret_cast<Heap *>(buffer);
    heap->selfPtr.get()->setDepthStencilState(heap->dsPtr.get());
}

void fastSetPassRasterizerState(void *buffer) {
    struct Heap {
        AlignedPtr<cc::scene::Pass>          selfPtr;
        AlignedPtr<cc::gfx::RasterizerState> rsPtr;
    };
    Heap *heap = reinterpret_cast<Heap *>(buffer);
    heap->selfPtr.get()->setRasterizerState(heap->rsPtr.get());
}

void fastSetPassDescriptorSet(void *buffer) {
    struct Heap {
        AlignedPtr<cc::scene::Pass>        selfPtr;
        AlignedPtr<cc::gfx::DescriptorSet> dsPtr;
    };
    Heap *heap = reinterpret_cast<Heap *>(buffer);
    heap->selfPtr.get()->setDescriptorSet(heap->dsPtr.get());
}

template <typename F>
uint64_t convertPtr(F *in) {
    return static_cast<uint64_t>(reinterpret_cast<intptr_t>(in));
}
bool                   mqInitialized{false};
se::Object *           msgQueue{nullptr};
se::Object *           globalThis{nullptr};
constexpr size_t       BUFFER_SIZE{1 * 1024 * 1024}; // 1MB;
se::Object *           msgQueueInfo{nullptr};
uint32_t *             msgInfoPtr{nullptr};
std::vector<uint8_t *> msgQueuePtrs;
} // namespace

/**
 *  Run all commands in __fastMQ__. This function should be call before render logic,
 *  which sync data to native objects.
 */
void jsbFlushFastMQ() {
    if (!mqInitialized || !msgInfoPtr || msgInfoPtr[1] == 0) {
        return;
    }

    uint8_t *  mqPtr{nullptr};
    const auto minSize = msgInfoPtr[0] + 1;
    if (minSize > msgQueuePtrs.size()) {
        se::AutoHandleScope scope;
        se::Value           maxIdx;
        se::Value           currentArrayBuffer;
        se::Object *        arrayBufferObj;
        auto                oldSize = msgQueuePtrs.size();
        msgQueuePtrs.resize(minSize);
        for (auto i = oldSize; i < minSize; i++) {
            msgQueue->getArrayElement(i, &currentArrayBuffer);
            arrayBufferObj = currentArrayBuffer.toObject();
            arrayBufferObj->getArrayBufferData(&mqPtr, nullptr);
            msgQueuePtrs[i] = mqPtr;
        }
    }

    for (auto i = 0; i < minSize; i++) {
        mqPtr          = msgQueuePtrs[i];
        auto *u32Ptr   = reinterpret_cast<uint32_t *>(mqPtr);
        auto  offset   = u32Ptr[0];
        auto  commands = u32Ptr[1];
        assert(offset < BUFFER_SIZE);
        if (commands == 0) return;

        using FastFunction = void (*)(void *);

        uint8_t *p = mqPtr + 8;
        for (uint32_t i = 0; i < commands; i++) {
            auto *base   = reinterpret_cast<uint32_t *>(p);
            auto  len    = base[0];
            auto *fnAddr = reinterpret_cast<uint64_t *>(base + 1);
            auto *fn     = reinterpret_cast<FastFunction *>(fnAddr);
            (*fn)(p + 12);
            p += len;
        }
        // reset
        u32Ptr[0] = 8;
        u32Ptr[1] = 0;
    }
    msgInfoPtr[0] = 0;
    msgInfoPtr[1] = 0;
}

void registerDrawBatch2DFunction(se::Object *cls) {
    // register function table of DrawBatch2D
    se::Value jsValue;
    cls->getProperty("DrawBatch2D", &jsValue);
    se::Object *jsObj   = jsValue.toObject();
    se::Object *fnTable = se::Object::createPlainObject();
    fnTable->setProperty("visFlags", se::Value(convertPtr(fastSetFlag)));
    fnTable->setProperty("descriptorSet", se::Value(convertPtr(fastSetDescriptorSet)));
    fnTable->setProperty("inputAssembler", se::Value(convertPtr(fastSetInputAssembler)));
    fnTable->setProperty("passes", se::Value(convertPtr(fastSetPasses)));
    fnTable->setProperty("shaders", se::Value(convertPtr(fastSetShaders)));
    jsObj->setProperty("fnTable", se::Value(fnTable));
}

void registerPassFunction(se::Object *cls) {
    // register function table of DrawBatch2D
    se::Value jsValue;
    cls->getProperty("Pass", &jsValue);
    se::Object *jsObj   = jsValue.toObject();
    se::Object *fnTable = se::Object::createPlainObject();
    fnTable->setProperty("blendState", se::Value(convertPtr(fastSetPassBlendState)));
    fnTable->setProperty("depthStencilState", se::Value(convertPtr(fastSetPassDepthStencilState)));
    fnTable->setProperty("rasterizerState", se::Value(convertPtr(fastSetPassRasterizerState)));
    fnTable->setProperty("descriptorSet", se::Value(convertPtr(fastSetPassDescriptorSet)));
    jsObj->setProperty("fnTable", se::Value(fnTable));
}

bool register_all_scene_ext_manual(se::Object *obj) { //NOLINT
    // allocate global message queue

    se::AutoHandleScope scope;
    auto *              msgArrayBuffer = se::Object::createArrayBufferObject(nullptr, BUFFER_SIZE);
    globalThis                         = se::ScriptEngine::getInstance()->getGlobalObject();
    msgQueue                           = se::Object::createArrayObject(1);
    msgQueueInfo                       = se::Object::createTypedArray(se::Object::TypedArrayType::UINT32, nullptr, sizeof(uint32_t) * 2);
    msgQueuePtrs.clear();

    {
        uint8_t *data{nullptr};
        msgArrayBuffer->getArrayBufferData(&data, nullptr);
        auto *int32Data = reinterpret_cast<uint32_t *>(data);
        int32Data[0]    = 8;
        int32Data[1]    = 0;
        msgQueueInfo->getTypedArrayData(&data, nullptr);
        msgInfoPtr    = reinterpret_cast<uint32_t *>(data);
        msgInfoPtr[0] = 0; // current queue index
        msgInfoPtr[1] = 0; // total message count
    }
    msgQueue->setArrayElement(0, se::Value(msgArrayBuffer));
    globalThis->setProperty("__fastMQ__", se::Value(msgQueue));
    globalThis->setProperty("__fastMQInfo__", se::Value(msgQueueInfo));

    mqInitialized = true;

    // register function table, serialize to queue
    se::Object *nsObj{nullptr};

    se::Value nsValue;
    obj->getProperty("ns", &nsValue);
    nsObj = nsValue.toObject();

    registerDrawBatch2DFunction(nsObj);
    registerPassFunction(nsObj);

    return true;
}
