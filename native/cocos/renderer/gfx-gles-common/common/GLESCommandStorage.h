#pragma once

#include <memory>
#include <tuple>
#include <base/std/container/list.h>

namespace cc::gfx {

struct CmdBase {
    CmdBase() = default;
    virtual ~CmdBase() = default;
    virtual void execute() {};
    CmdBase* next = nullptr;
};

template <typename Func, typename ...Args>
struct Cmd : public CmdBase {
    using Parameters = std::tuple<std::remove_reference_t<Args>...>;
    using FuncType = Func;

    explicit Cmd(Func &&f, Args &&...args) : func(f), params(std::forward<Args>(args)...) {}

    FuncType   func;
    Parameters params;

    void execute() override {
        std::apply(func, params);
    }
};


class GLESCommandStorage {
public:
    GLESCommandStorage() = default;
    ~GLESCommandStorage() = default;

    static constexpr uint32_t DEFAULT_ALIGNMENT = 4;
    static constexpr uint32_t DEFAULT_BLOCK_SIZE = 1 * 1024 * 1024; // 1M

    uint8_t* allocate(uint32_t size, uint32_t alignment = DEFAULT_ALIGNMENT);
    void reset();
    void execute();

    template <typename Func, typename ...Args>
    void enqueueCmd(Func &&func, Args &&...args)
    {
        using CmdType = Cmd<Func, Args...>;
        uint8_t *ptr = allocate(sizeof(CmdType));
        auto *cmd = new (ptr) CmdType(std::forward<Func>(func), std::forward<Args>(args)...);

        (*_current) = cmd;
        _current = &(cmd->next);
    }

    struct BlockStorage {
        uint32_t blockSize = 0;
        uint32_t offset = 0;
        std::unique_ptr<uint8_t[]> storage;

        uint8_t *allocate(uint32_t size, uint32_t alignment);
        void reset();
    };

private:
    void allocateStorage();

    using StoragePtr = std::unique_ptr<BlockStorage>;
    using Iterator = std::list<StoragePtr>::iterator;

    ccstd::list<StoragePtr> _storages;
    Iterator _iterator = _storages.end();
    CmdBase* _head = nullptr;
    CmdBase** _current = &_head;
};

} // namespace cc::gfx
