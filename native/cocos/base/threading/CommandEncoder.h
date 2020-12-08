#pragma once

#include <cstdint>
#include "concurrentqueue.h"
#include "Event.h"

namespace cc {

// 由于系统的内存分配是从一个全局堆里申请 分配过程会上锁导致降低并行度 在多线程的环境下如果频繁的申请释放内存会降低性能
// 所以这里先加个接口来统一调用 未来会换成单独服务于线程的无锁分配器
template <typename T>
inline T* MemoryAllocateForMultiThread(uint32_t const count) noexcept
{
    return static_cast<T*>(malloc(sizeof(T) * count));
}

template <typename T>
inline void MemoryFreeForMultiThread(T* const p) noexcept
{
    free(p);
}

inline uint32_t constexpr Align(uint32_t const val, uint32_t const alignment) noexcept
{
    return (val + alignment - 1) & ~(alignment-1);
}

class Command
{
public:

                                            Command() = default;
    virtual                                 ~Command() {}
                                            Command(Command const&) = delete;
                                            Command(Command&&) = delete;
                                            Command& operator=(Command const&) = delete;
                                            Command& operator=(Command&&) = delete;

    virtual void                            Execute() noexcept = 0;
    virtual char const*                     GetName() const noexcept = 0;
    inline Command*                         GetNext() const noexcept { return mNext; }

private:

    Command*                                mNext;

    friend class CommandEncoder;
};

struct alignas(64) WriterContext final
{
    uint8_t*                                mCurrentMemoryChunk         { nullptr };
    Command*                                mLastCommand                { nullptr };
    uint32_t                                mOffset                     { 0 };
    uint32_t                                mPendingCommandCount        { 0 };
    std::atomic<uint32_t>                   mWrittenCommandCount        { 0 };
};

struct alignas(64) ReaderContext final
{
    uint8_t*                                mCurrentMemoryChunk         { nullptr };
    Command*                                mLastCommand                { nullptr };
    uint32_t                                mOffset                     { 0 };
    uint32_t                                mWrittenCommandCountSnap    { 0 };
    uint32_t                                mNewCommandCount            { 0 };
    bool                                    mTerminateConsumerThread    { false };
    bool                                    mFlushingFinished           { false };
};

// 支持单生产者单消费者的环形缓冲区
// 生产者线程Allocate 消费者线程Execute
// 除了Command之外 执行Command需要的数据也需要拷贝到这里 来实现线程安全的数据访问
class alignas(64) CommandEncoder final
{
public:

                                            CommandEncoder();
                                            ~CommandEncoder() = default;
                                            CommandEncoder(CommandEncoder const&) = delete;
                                            CommandEncoder(CommandEncoder&&) = delete;
                                            CommandEncoder& operator=(CommandEncoder const&) = delete;
                                            CommandEncoder& operator=(CommandEncoder&&) = delete;

    // 分配Command
    template <typename T>
    std::enable_if_t<std::is_base_of<Command, T>::value, T*>
                                            Allocate(uint32_t const count) noexcept;

    // 分配数据
    template <typename T>
    std::enable_if_t<! std::is_base_of<Command, T>::value, T*>
                                            Allocate(uint32_t const count) noexcept;
    template <typename T>
    T*                                      AllocateAndCopy(uint32_t const count, void const* data) noexcept;
    template <typename T>
    T*                                      AllocateAndZero(uint32_t const count) noexcept;

    // 通知消费者线程开始工作
    void                                    Kick() noexcept;

    // 通知消费者线程开始工作并阻塞生产者线程 直到消费者线程执行完所有命令
    void                                    KickAndWait() noexcept;

    // 只支持单消费者
    void                                    RunConsumerThread() noexcept;
    void                                    TerminateConsumerThread() noexcept;
    void                                    FinishWriting(bool wait) noexcept;
    void                                    FlushCommands() noexcept;

    inline bool                             IsImmediateMode() const noexcept { return mImmediateMode; }
    inline void                             FinishWriting() noexcept { FinishWriting(false); }

    void                                    RecycleMemoryChunk(uint8_t* const chunk) const noexcept;
    static void                             FreeChunksInFreeQueue(CommandEncoder* const mainCommandbuffer) noexcept;

    inline void                             SetImmediateMode(bool immediateMode) noexcept { mImmediateMode = immediateMode; }
    inline int                              GetPendingCommandCount() const noexcept { return mW.mPendingCommandCount; }
    inline int                              GetWrittenCommandCount() const noexcept { return mW.mWrittenCommandCount; }
    inline int                              GetNewCommandCount() const noexcept { return mR.mNewCommandCount; }

private:

    class alignas(64) MemoryAllocator final
    {
    public:

                                            MemoryAllocator() = default;
                                            ~MemoryAllocator() = default;
                                            MemoryAllocator(MemoryAllocator const&) = delete;
                                            MemoryAllocator(MemoryAllocator&&) = delete;
                                            MemoryAllocator& operator=(MemoryAllocator const&) = delete;
                                            MemoryAllocator& operator=(MemoryAllocator&&) = delete;

        static MemoryAllocator&             GetInstance() noexcept;
        uint8_t*                            Request() noexcept;
        void                                Recycle(uint8_t* const chunk, bool const freeByUser) noexcept;
        void                                FreeByUser(CommandEncoder* const mainCommandbuffer) noexcept;

    private:

        using ChunkQueue                    = moodycamel::ConcurrentQueue<uint8_t*>;

        void                                Free(uint8_t* const chunk) noexcept;
        std::atomic<uint32_t>               mChunkCount         { 0 };
        ChunkQueue                          mChunkPool          {};
        ChunkQueue                          mChunkFreeQueue     {};
    };

    uint8_t*                                AllocateImpl(uint32_t& allocatedSize, uint32_t const requestSize) noexcept;
    void                                    PushCommands() noexcept;

    // 在消费者线程执行
    void                                    PullCommands() noexcept;
    void                                    ExecuteCommand() noexcept;
    Command*                                ReadCommand() noexcept;
    inline bool                             HasNewCommand() const noexcept { return mR.mNewCommandCount > 0 && ! mR.mFlushingFinished; }
    void                                    ConsumerThreadLoop() noexcept;

    WriterContext                           mW;
    ReaderContext                           mR;
    EventCV                                 mN;
    bool                                    mImmediateMode      { true };
    bool                                    mWorkerAttached     { false };
    bool                                    mFreeChunksByUser   { true }; // 被回收的Chunk会被记录到一个队列里 由用户在生产者线程选择合适的时机来Free

    friend class MemoryChunkSwitchCommand;
};

class DummyCommand final : public Command
{
public:

    virtual void                            Execute() noexcept override {}
    virtual char const*                     GetName() const noexcept override;
};

class MemoryChunkSwitchCommand final : public Command
{
public:

    MemoryChunkSwitchCommand(CommandEncoder* const cb, uint8_t* const newChunk, uint8_t* const oldChunk) noexcept;
    ~MemoryChunkSwitchCommand();

    virtual void                            Execute() noexcept override;
    virtual char const*                     GetName() const noexcept override;

private:

    CommandEncoder*                         mCommandBuffer              { nullptr };
    uint8_t*                                mNewChunk                   { nullptr };
    uint8_t*                                mOldChunk                   { nullptr };
};

template <typename T>
std::enable_if_t<std::is_base_of<Command, T>::value, T*>
CommandEncoder::Allocate(uint32_t const count) noexcept
{
    uint32_t allocatedSize = 0;
    T* const cmd = reinterpret_cast<T*>(AllocateImpl(allocatedSize, sizeof(T)));
    cmd->mNext = reinterpret_cast<Command*>(mW.mCurrentMemoryChunk + mW.mOffset);
    ++mW.mPendingCommandCount;
    mW.mLastCommand = cmd;
    return cmd;
}

template <typename T>
std::enable_if_t<! std::is_base_of<Command, T>::value, T*>
CommandEncoder::Allocate(uint32_t const count) noexcept
{
    uint32_t const requestSize = sizeof(T) * count;
    assert(requestSize);
    uint32_t allocatedSize = 0;
    uint8_t* const allocatedMemory = AllocateImpl(allocatedSize, requestSize);
    mW.mLastCommand->mNext = reinterpret_cast<Command*>(mW.mCurrentMemoryChunk + mW.mOffset);
    return reinterpret_cast<T*>(allocatedMemory);
}

template <typename T>
T* CommandEncoder::AllocateAndCopy(uint32_t const count, void const* data) noexcept
{
    T* const allocatedMemory = Allocate<T>(count);
    memcpy(allocatedMemory, data, sizeof(T) * count);
    return allocatedMemory;
}

template <typename T>
T* CommandEncoder::AllocateAndZero(uint32_t const count) noexcept
{
    T* const allocatedMemory = Allocate<T>(count);
    memset(allocatedMemory, 0, sizeof(T) * count);
    return allocatedMemory;
}

// 生产者线程用来向CommandBuffer填充Command的工具宏

#define WRITE_COMMAND(CB, CommandName, Params)                      \
    {                                                               \
        if (! CB->IsImmediateMode())                                \
        {                                                           \
            new (CB->Allocate<CommandName>(1)) CommandName Params;  \
        }                                                           \
        else                                                        \
        {                                                           \
            CommandName command Params;                             \
            command.Execute();                                      \
        }                                                           \
    }

#define ENCODE_COMMAND_0(CB, CommandName, Code)                     \
    class CommandName final : public Command                        \
    {                                                               \
    public:                                                         \
        virtual void Execute() noexcept override                    \
        {                                                           \
            Code;                                                   \
        }                                                           \
        virtual char const* GetName() const noexcept override       \
        {                                                           \
            return (#CommandName);                                  \
        }                                                           \
    };                                                              \
    WRITE_COMMAND(CB, CommandName, );

#define ENCODE_COMMAND_1(CB, CommandName,                           \
            Param1, Value1,                                         \
            Code) {                                                 \
                                                                    \
    using Type1 =  std::decay<decltype(Value1)>::type;              \
                                                                    \
    class CommandName final : public Command                        \
    {                                                               \
    public:                                                         \
    explicit CommandName(Type1 const& In##Param1)                   \
    : Param1(In##Param1)                                            \
    {                                                               \
    }                                                               \
    virtual void Execute() noexcept override                        \
    {                                                               \
        Code;                                                       \
    }                                                               \
    virtual char const* GetName() const noexcept override           \
    {                                                               \
        return (#CommandName);                                      \
    }                                                               \
    private:                                                        \
        Type1   Param1;                                             \
    };                                                              \
    WRITE_COMMAND(CB, CommandName, (Value1)) };

#define ENCODE_COMMAND_2(CB, CommandName,                           \
            Param1, Value1,                                         \
            Param2, Value2,                                         \
            Code) {                                                 \
                                                                    \
    using Type1 =  std::decay<decltype(Value1)>::type;              \
    using Type2 =  std::decay<decltype(Value2)>::type;              \
                                                                    \
    class CommandName final : public Command                        \
    {                                                               \
    public:                                                         \
    CommandName(                                                    \
              Type1 const& In##Param1                               \
            , Type2 const& In##Param2                               \
            )                                                       \
    : Param1(In##Param1)                                            \
    , Param2(In##Param2)                                            \
    {                                                               \
    }                                                               \
    virtual void Execute() noexcept override                        \
    {                                                               \
        Code;                                                       \
    }                                                               \
    virtual char const* GetName() const noexcept override           \
    {                                                               \
        return (#CommandName);                                      \
    }                                                               \
    private:                                                        \
        Type1   Param1;                                             \
        Type2   Param2;                                             \
    };                                                              \
    WRITE_COMMAND(CB, CommandName, (Value1, Value2)) };

#define ENCODE_COMMAND_3(CB, CommandName,                           \
            Param1, Value1,                                         \
            Param2, Value2,                                         \
            Param3, Value3,                                         \
            Code) {                                                 \
                                                                    \
    using Type1 =  std::decay<decltype(Value1)>::type;              \
    using Type2 =  std::decay<decltype(Value2)>::type;              \
    using Type3 =  std::decay<decltype(Value3)>::type;              \
                                                                    \
    class CommandName final : public Command                        \
    {                                                               \
    public:                                                         \
    CommandName(                                                    \
              Type1 const &In##Param1                               \
            , Type2 const &In##Param2                               \
            , Type3 const &In##Param3                               \
            )                                                       \
    : Param1(In##Param1)                                            \
    , Param2(In##Param2)                                            \
    , Param3(In##Param3)                                            \
    {                                                               \
    }                                                               \
    virtual void Execute() noexcept override                        \
    {                                                               \
        Code;                                                       \
    }                                                               \
    virtual char const* GetName() const noexcept override           \
    {                                                               \
        return (#CommandName);                                      \
    }                                                               \
    private:                                                        \
        Type1   Param1;                                             \
        Type2   Param2;                                             \
        Type3   Param3;                                             \
    };                                                              \
    WRITE_COMMAND(CB, CommandName, (Value1, Value2, Value3)) };

#define ENCODE_COMMAND_4(CB, CommandName,                           \
            Param1, Value1,                                         \
            Param2, Value2,                                         \
            Param3, Value3,                                         \
            Param4, Value4,                                         \
            Code) {                                                 \
                                                                    \
    using Type1 =  std::decay<decltype(Value1)>::type;              \
    using Type2 =  std::decay<decltype(Value2)>::type;              \
    using Type3 =  std::decay<decltype(Value3)>::type;              \
    using Type4 =  std::decay<decltype(Value4)>::type;              \
                                                                    \
    class CommandName : public Command                              \
    {                                                               \
    public:                                                         \
    CommandName(                                                    \
              Type1 const &In##Param1                               \
            , Type2 const &In##Param2                               \
            , Type3 const &In##Param3                               \
            , Type4 const &In##Param4                               \
            )                                                       \
    : Param1(In##Param1)                                            \
    , Param2(In##Param2)                                            \
    , Param3(In##Param3)                                            \
    , Param4(In##Param4)                                            \
    {                                                               \
    }                                                               \
    virtual void Execute() noexcept override                        \
    {                                                               \
        Code;                                                       \
    }                                                               \
    virtual char const* GetName() const noexcept override           \
    {                                                               \
        return (#CommandName);                                      \
    }                                                               \
    private:                                                        \
        Type1   Param1;                                             \
        Type2   Param2;                                             \
        Type3   Param3;                                             \
        Type4   Param4;                                             \
    };                                                              \
    WRITE_COMMAND(CB, CommandName, (Value1, Value2, Value3, Value4)) };

#define ENCODE_COMMAND_5(CB, CommandName,                           \
            Param1, Value1,                                         \
            Param2, Value2,                                         \
            Param3, Value3,                                         \
            Param4, Value4,                                         \
            Param5, Value5,                                         \
            Code) {                                                 \
                                                                    \
    using Type1 =  std::decay<decltype(Value1)>::type;              \
    using Type2 =  std::decay<decltype(Value2)>::type;              \
    using Type3 =  std::decay<decltype(Value3)>::type;              \
    using Type4 =  std::decay<decltype(Value4)>::type;              \
    using Type5 =  std::decay<decltype(Value5)>::type;              \
                                                                    \
    class CommandName : public Command                              \
    {                                                               \
    public:                                                         \
    CommandName(                                                    \
              Type1 const &In##Param1                               \
            , Type2 const &In##Param2                               \
            , Type3 const &In##Param3                               \
            , Type4 const &In##Param4                               \
            , Type5 const &In##Param5                               \
            )                                                       \
    : Param1(In##Param1)                                            \
    , Param2(In##Param2)                                            \
    , Param3(In##Param3)                                            \
    , Param4(In##Param4)                                            \
    , Param5(In##Param5)                                            \
    {                                                               \
    }                                                               \
    virtual void Execute() noexcept override                        \
    {                                                               \
        Code;                                                       \
    }                                                               \
    virtual char const* GetName() const noexcept override           \
    {                                                               \
        return (#CommandName);                                      \
    }                                                               \
    private:                                                        \
        Type1   Param1;                                             \
        Type2   Param2;                                             \
        Type3   Param3;                                             \
        Type4   Param4;                                             \
        Type5   Param5;                                             \
    };                                                              \
    WRITE_COMMAND(CB, CommandName, (Value1, Value2, Value3, Value4, Value5)) };

#define ENCODE_COMMAND_6(CB, CommandName,                           \
            Param1, Value1,                                         \
            Param2, Value2,                                         \
            Param3, Value3,                                         \
            Param4, Value4,                                         \
            Param5, Value5,                                         \
            Param6, Value6,                                         \
            Code) {                                                 \
                                                                    \
    using Type1 =  std::decay<decltype(Value1)>::type;              \
    using Type2 =  std::decay<decltype(Value2)>::type;              \
    using Type3 =  std::decay<decltype(Value3)>::type;              \
    using Type4 =  std::decay<decltype(Value4)>::type;              \
    using Type5 =  std::decay<decltype(Value5)>::type;              \
    using Type6 =  std::decay<decltype(Value6)>::type;              \
                                                                    \
    class CommandName : public Command                              \
    {                                                               \
    public:                                                         \
    CommandName(                                                    \
              Type1 const &In##Param1                               \
            , Type2 const &In##Param2                               \
            , Type3 const &In##Param3                               \
            , Type4 const &In##Param4                               \
            , Type5 const &In##Param5                               \
            , Type6 const &In##Param6                               \
            )                                                       \
    : Param1(In##Param1)                                            \
    , Param2(In##Param2)                                            \
    , Param3(In##Param3)                                            \
    , Param4(In##Param4)                                            \
    , Param5(In##Param5)                                            \
    , Param6(In##Param6)                                            \
    {                                                               \
    }                                                               \
    virtual void Execute() noexcept                                 \
    {                                                               \
        Code;                                                       \
    }                                                               \
    virtual char const* GetName() const noexcept override           \
    {                                                               \
        return (#CommandName);                                      \
    }                                                               \
    private:                                                        \
        Type1   Param1;                                             \
        Type2   Param2;                                             \
        Type3   Param3;                                             \
        Type4   Param4;                                             \
        Type5   Param5;                                             \
        Type6   Param6;                                             \
    };                                                              \
    WRITE_COMMAND(CB, CommandName, (Value1, Value2, Value3, Value4, Value5, Value6)) };

#define ENCODE_COMMAND_7(CB, CommandName,                           \
            Param1, Value1,                                         \
            Param2, Value2,                                         \
            Param3, Value3,                                         \
            Param4, Value4,                                         \
            Param5, Value5,                                         \
            Param6, Value6,                                         \
            Param7, Value7,                                         \
            Code) {                                                 \
                                                                    \
    using Type1 =  std::decay<decltype(Value1)>::type;              \
    using Type2 =  std::decay<decltype(Value2)>::type;              \
    using Type3 =  std::decay<decltype(Value3)>::type;              \
    using Type4 =  std::decay<decltype(Value4)>::type;              \
    using Type5 =  std::decay<decltype(Value5)>::type;              \
    using Type6 =  std::decay<decltype(Value6)>::type;              \
    using Type7 =  std::decay<decltype(Value7)>::type;              \
                                                                    \
    class CommandName : public Command                              \
    {                                                               \
    public:                                                         \
    CommandName(                                                    \
              Type1 const &In##Param1                               \
            , Type2 const &In##Param2                               \
            , Type3 const &In##Param3                               \
            , Type4 const &In##Param4                               \
            , Type5 const &In##Param5                               \
            , Type6 const &In##Param6                               \
            , Type7 const &In##Param7                               \
            )                                                       \
    : Param1(In##Param1)                                            \
    , Param2(In##Param2)                                            \
    , Param3(In##Param3)                                            \
    , Param4(In##Param4)                                            \
    , Param5(In##Param5)                                            \
    , Param6(In##Param6)                                            \
    , Param7(In##Param7)                                            \
    {                                                               \
    }                                                               \
    virtual void Execute() noexcept override                        \
    {                                                               \
        Code;                                                       \
    }                                                               \
    virtual const char* GetName() const noexcept override           \
    {                                                               \
        return (#CommandName);                                      \
    }                                                               \
    private:                                                        \
        Type1   Param1;                                             \
        Type2   Param2;                                             \
        Type3   Param3;                                             \
        Type4   Param4;                                             \
        Type5   Param5;                                             \
        Type6   Param6;                                             \
        Type7   Param7;                                             \
    };                                                              \
    WRITE_COMMAND(CB, CommandName, (Value1, Value2, Value3, Value4, Value5, Value6, Value7)) };

#define ENCODE_COMMAND_8(CB, CommandName,                           \
            Param1, Value1,                                         \
            Param2, Value2,                                         \
            Param3, Value3,                                         \
            Param4, Value4,                                         \
            Param5, Value5,                                         \
            Param6, Value6,                                         \
            Param7, Value7,                                         \
            Param8, Value8,                                         \
            Code) {                                                 \
                                                                    \
    using Type1 =  std::decay<decltype(Value1)>::type;              \
    using Type2 =  std::decay<decltype(Value2)>::type;              \
    using Type3 =  std::decay<decltype(Value3)>::type;              \
    using Type4 =  std::decay<decltype(Value4)>::type;              \
    using Type5 =  std::decay<decltype(Value5)>::type;              \
    using Type6 =  std::decay<decltype(Value6)>::type;              \
    using Type7 =  std::decay<decltype(Value7)>::type;              \
    using Type8 =  std::decay<decltype(Value8)>::type;              \
                                                                    \
    class CommandName : public Command                              \
    {                                                               \
    public:                                                         \
    CommandName(                                                    \
              Type1 const &In##Param1                               \
            , Type2 const &In##Param2                               \
            , Type3 const &In##Param3                               \
            , Type4 const &In##Param4                               \
            , Type5 const &In##Param5                               \
            , Type6 const &In##Param6                               \
            , Type7 const &In##Param7                               \
            , Type8 const &In##Param8                               \
            )                                                       \
    : Param1(In##Param1)                                            \
    , Param2(In##Param2)                                            \
    , Param3(In##Param3)                                            \
    , Param4(In##Param4)                                            \
    , Param5(In##Param5)                                            \
    , Param6(In##Param6)                                            \
    , Param7(In##Param7)                                            \
    , Param8(In##Param8)                                            \
    {                                                               \
    }                                                               \
    virtual void Execute() noexcept override                        \
    {                                                               \
        Code;                                                       \
    }                                                               \
    virtual char const* GetName() const noexcept override           \
    {                                                               \
        return (#CommandName);                                      \
    }                                                               \
    private:                                                        \
        Type1   Param1;                                             \
        Type2   Param2;                                             \
        Type3   Param3;                                             \
        Type4   Param4;                                             \
        Type5   Param5;                                             \
        Type6   Param6;                                             \
        Type7   Param7;                                             \
        Type8   Param8;                                             \
    };                                                              \
    WRITE_COMMAND(CB, CommandName, (Value1, Value2, Value3, Value4, Value5, Value6, Value7, Value8)) };

} // namespace cc
