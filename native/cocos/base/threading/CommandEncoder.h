#pragma once

#include "Event.h"
#include "concurrentqueue.h"
#include <cstdint>

namespace cc {

// TODO: thread-specific allocators
template <typename T>
inline T *memoryAllocateForMultiThread(uint32_t const count) noexcept {
    return static_cast<T *>(malloc(sizeof(T) * count));
}

template <typename T>
inline void memoryFreeForMultiThread(T *const p) noexcept {
    free(p);
}

inline uint32_t constexpr align(uint32_t const val, uint32_t const alignment) noexcept {
    return (val + alignment - 1) & ~(alignment - 1);
}

class Command {
public:
    Command() = default;
    virtual ~Command() {}
    Command(Command const &) = delete;
    Command(Command &&) = delete;
    Command &operator=(Command const &) = delete;
    Command &operator=(Command &&) = delete;

    virtual void execute() noexcept = 0;
    virtual char const *getName() const noexcept = 0;
    inline Command *getNext() const noexcept { return mNext; }

private:
    Command *mNext;

    friend class CommandEncoder;
};

struct alignas(64) WriterContext final {
    uint8_t *mCurrentMemoryChunk{nullptr};
    Command *mLastCommand{nullptr};
    uint32_t mOffset{0};
    uint32_t mPendingCommandCount{0};
    std::atomic<uint32_t> mWrittenCommandCount{0};
};

struct alignas(64) ReaderContext final {
    uint8_t *mCurrentMemoryChunk{nullptr};
    Command *mLastCommand{nullptr};
    uint32_t mOffset{0};
    uint32_t mWrittenCommandCountSnap{0};
    uint32_t mNewCommandCount{0};
    bool mTerminateConsumerThread{false};
    bool mFlushingFinished{false};
};

// A single-producer single-consumer circular buffer queue.
// Both the commands and their submitting data should be allocated from here.
class alignas(64) CommandEncoder final {
public:
    CommandEncoder();
    ~CommandEncoder() = default;
    CommandEncoder(CommandEncoder const &) = delete;
    CommandEncoder(CommandEncoder &&) = delete;
    CommandEncoder &operator=(CommandEncoder const &) = delete;
    CommandEncoder &operator=(CommandEncoder &&) = delete;

    // command allocation
    template <typename T>
    std::enable_if_t<std::is_base_of<Command, T>::value, T *>
    allocate(uint32_t const count) noexcept;

    // general-purpose allocation
    template <typename T>
    std::enable_if_t<!std::is_base_of<Command, T>::value, T *>
    allocate(uint32_t const count) noexcept;
    template <typename T>
    T *allocateAndCopy(uint32_t const count, void const *data) noexcept;
    template <typename T>
    T *allocateAndZero(uint32_t const count) noexcept;

    // notify the consumer to start working
    void kick() noexcept;

    // notify the consumer to start working and block the producer until finished
    void kickAndWait() noexcept;

    void runConsumerThread() noexcept;
    void terminateConsumerThread() noexcept;
    void finishWriting(bool wait) noexcept;
    void flushCommands() noexcept;

    inline bool isImmediateMode() const noexcept { return mImmediateMode; }
    inline void finishWriting() noexcept { finishWriting(false); }

    void recycleMemoryChunk(uint8_t *const chunk) const noexcept;
    static void freeChunksInFreeQueue(CommandEncoder *const mainCommandbuffer) noexcept;

    inline void setImmediateMode(bool immediateMode) noexcept { mImmediateMode = immediateMode; }
    inline int getPendingCommandCount() const noexcept { return mW.mPendingCommandCount; }
    inline int getWrittenCommandCount() const noexcept { return mW.mWrittenCommandCount; }
    inline int getNewCommandCount() const noexcept { return mR.mNewCommandCount; }

private:
    class alignas(64) MemoryAllocator final {
    public:
        MemoryAllocator() = default;
        ~MemoryAllocator() = default;
        MemoryAllocator(MemoryAllocator const &) = delete;
        MemoryAllocator(MemoryAllocator &&) = delete;
        MemoryAllocator &operator=(MemoryAllocator const &) = delete;
        MemoryAllocator &operator=(MemoryAllocator &&) = delete;

        static MemoryAllocator &getInstance() noexcept;
        uint8_t *request() noexcept;
        void recycle(uint8_t *const chunk, bool const freeByUser) noexcept;
        void freeByUser(CommandEncoder *const mainCommandbuffer) noexcept;

    private:
        using ChunkQueue = moodycamel::ConcurrentQueue<uint8_t *>;

        void free(uint8_t *const chunk) noexcept;
        std::atomic<uint32_t> mChunkCount{0};
        ChunkQueue mChunkPool{};
        ChunkQueue mChunkFreeQueue{};
    };

    uint8_t *allocateImpl(uint32_t &allocatedSize, uint32_t const requestSize) noexcept;
    void pushCommands() noexcept;

    // consumer thread specifics
    void pullCommands() noexcept;
    void executeCommand() noexcept;
    Command *readCommand() noexcept;
    inline bool hasNewCommand() const noexcept { return mR.mNewCommandCount > 0 && !mR.mFlushingFinished; }
    void consumerThreadLoop() noexcept;

    WriterContext mW;
    ReaderContext mR;
    EventCV mN;
    bool mImmediateMode{true};
    bool mWorkerAttached{false};
    bool mFreeChunksByUser{true}; // recycled chunks will be stashed until explicit free instruction

    friend class MemoryChunkSwitchCommand;
};

class DummyCommand final : public Command {
public:
    virtual void execute() noexcept override {}
    virtual char const *getName() const noexcept override;
};

class MemoryChunkSwitchCommand final : public Command {
public:
    MemoryChunkSwitchCommand(CommandEncoder *const cb, uint8_t *const newChunk, uint8_t *const oldChunk) noexcept;
    ~MemoryChunkSwitchCommand();

    virtual void execute() noexcept override;
    virtual char const *getName() const noexcept override;

private:
    CommandEncoder *mCommandEncoder{nullptr};
    uint8_t *mNewChunk{nullptr};
    uint8_t *mOldChunk{nullptr};
};

class TerminateConsumerThreadCommand final : public Command {
public:
    TerminateConsumerThreadCommand(EventSem *const pEvent, ReaderContext *const pR) noexcept;

    virtual void execute() noexcept override;
    virtual char const *getName() const noexcept override;

private:
    EventSem *mEvent{nullptr};
    ReaderContext *mR{nullptr};
};

template <typename T>
std::enable_if_t<std::is_base_of<Command, T>::value, T *>
CommandEncoder::allocate(uint32_t const count) noexcept {
    uint32_t allocatedSize = 0;
    T *const cmd = reinterpret_cast<T *>(allocateImpl(allocatedSize, sizeof(T)));
    cmd->mNext = reinterpret_cast<Command *>(mW.mCurrentMemoryChunk + mW.mOffset);
    ++mW.mPendingCommandCount;
    mW.mLastCommand = cmd;
    return cmd;
}

template <typename T>
std::enable_if_t<!std::is_base_of<Command, T>::value, T *>
CommandEncoder::allocate(uint32_t const count) noexcept {
    uint32_t const requestSize = sizeof(T) * count;
    assert(requestSize);
    uint32_t allocatedSize = 0;
    uint8_t *const allocatedMemory = allocateImpl(allocatedSize, requestSize);
    mW.mLastCommand->mNext = reinterpret_cast<Command *>(mW.mCurrentMemoryChunk + mW.mOffset);
    return reinterpret_cast<T *>(allocatedMemory);
}

template <typename T>
T *CommandEncoder::allocateAndCopy(uint32_t const count, void const *data) noexcept {
    T *const allocatedMemory = Allocate<T>(count);
    memcpy(allocatedMemory, data, sizeof(T) * count);
    return allocatedMemory;
}

template <typename T>
T *CommandEncoder::allocateAndZero(uint32_t const count) noexcept {
    T *const allocatedMemory = Allocate<T>(count);
    memset(allocatedMemory, 0, sizeof(T) * count);
    return allocatedMemory;
}

// utility macros for the producer thread to encode commands

#define WRITE_COMMAND(CB, CommandName, Params)                     \
    {                                                              \
        if (!CB->isImmediateMode()) {                              \
            new (CB->allocate<CommandName>(1)) CommandName Params; \
        } else {                                                   \
            CommandName command Params;                            \
            command.execute();                                     \
        }                                                          \
    }

#define ENCODE_COMMAND_0(CB, CommandName, Code)                     \
    {                                                               \
        class CommandName final : public Command {                  \
        public:                                                     \
            virtual void execute() noexcept override {              \
                Code                                                \
            }                                                       \
            virtual char const *getName() const noexcept override { \
                return (#CommandName);                              \
            }                                                       \
        };                                                          \
        WRITE_COMMAND(CB, CommandName, );                           \
    }

#define ENCODE_COMMAND_1(CB, CommandName,                           \
                         Param1, Value1,                            \
                         Code)                                      \
    {                                                               \
                                                                    \
        using Type1 = std::decay<decltype(Value1)>::type;           \
                                                                    \
        class CommandName final : public Command {                  \
        public:                                                     \
            explicit CommandName(Type1 const &In##Param1)           \
            : Param1(In##Param1) {                                  \
            }                                                       \
            virtual void execute() noexcept override {              \
                Code                                                \
            }                                                       \
            virtual char const *getName() const noexcept override { \
                return (#CommandName);                              \
            }                                                       \
                                                                    \
        private:                                                    \
            Type1 Param1;                                           \
        };                                                          \
        WRITE_COMMAND(CB, CommandName, (Value1))                    \
    }

#define ENCODE_COMMAND_2(CB, CommandName,                           \
                         Param1, Value1,                            \
                         Param2, Value2,                            \
                         Code)                                      \
    {                                                               \
                                                                    \
        using Type1 = std::decay<decltype(Value1)>::type;           \
        using Type2 = std::decay<decltype(Value2)>::type;           \
                                                                    \
        class CommandName final : public Command {                  \
        public:                                                     \
            CommandName(                                            \
                Type1 const &In##Param1, Type2 const &In##Param2)   \
            : Param1(In##Param1), Param2(In##Param2) {              \
            }                                                       \
            virtual void execute() noexcept override {              \
                Code                                                \
            }                                                       \
            virtual char const *getName() const noexcept override { \
                return (#CommandName);                              \
            }                                                       \
                                                                    \
        private:                                                    \
            Type1 Param1;                                           \
            Type2 Param2;                                           \
        };                                                          \
        WRITE_COMMAND(CB, CommandName, (Value1, Value2))            \
    }

#define ENCODE_COMMAND_3(CB, CommandName,                           \
                         Param1, Value1,                            \
                         Param2, Value2,                            \
                         Param3, Value3,                            \
                         Code)                                      \
    {                                                               \
                                                                    \
        using Type1 = std::decay<decltype(Value1)>::type;           \
        using Type2 = std::decay<decltype(Value2)>::type;           \
        using Type3 = std::decay<decltype(Value3)>::type;           \
                                                                    \
        class CommandName final : public Command {                  \
        public:                                                     \
            CommandName(                                            \
                Type1 const &In##Param1,                            \
                Type2 const &In##Param2,                            \
                Type3 const &In##Param3)                            \
            : Param1(In##Param1),                                   \
              Param2(In##Param2),                                   \
              Param3(In##Param3) {                                  \
            }                                                       \
            virtual void execute() noexcept override {              \
                Code                                                \
            }                                                       \
            virtual char const *getName() const noexcept override { \
                return (#CommandName);                              \
            }                                                       \
                                                                    \
        private:                                                    \
            Type1 Param1;                                           \
            Type2 Param2;                                           \
            Type3 Param3;                                           \
        };                                                          \
        WRITE_COMMAND(CB, CommandName,                              \
                      (Value1,                                      \
                       Value2,                                      \
                       Value3))                                     \
    }

#define ENCODE_COMMAND_4(CB, CommandName,                           \
                         Param1, Value1,                            \
                         Param2, Value2,                            \
                         Param3, Value3,                            \
                         Param4, Value4,                            \
                         Code)                                      \
    {                                                               \
                                                                    \
        using Type1 = std::decay<decltype(Value1)>::type;           \
        using Type2 = std::decay<decltype(Value2)>::type;           \
        using Type3 = std::decay<decltype(Value3)>::type;           \
        using Type4 = std::decay<decltype(Value4)>::type;           \
                                                                    \
        class CommandName : public Command {                        \
        public:                                                     \
            CommandName(                                            \
                Type1 const &In##Param1,                            \
                Type2 const &In##Param2,                            \
                Type3 const &In##Param3,                            \
                Type4 const &In##Param4)                            \
            : Param1(In##Param1),                                   \
              Param2(In##Param2),                                   \
              Param3(In##Param3),                                   \
              Param4(In##Param4) {                                  \
            }                                                       \
            virtual void execute() noexcept override {              \
                Code                                                \
            }                                                       \
            virtual char const *getName() const noexcept override { \
                return (#CommandName);                              \
            }                                                       \
                                                                    \
        private:                                                    \
            Type1 Param1;                                           \
            Type2 Param2;                                           \
            Type3 Param3;                                           \
            Type4 Param4;                                           \
        };                                                          \
        WRITE_COMMAND(CB, CommandName,                              \
                      (Value1,                                      \
                       Value2,                                      \
                       Value3,                                      \
                       Value4))                                     \
    }

#define ENCODE_COMMAND_5(CB, CommandName,                           \
                         Param1, Value1,                            \
                         Param2, Value2,                            \
                         Param3, Value3,                            \
                         Param4, Value4,                            \
                         Param5, Value5,                            \
                         Code)                                      \
    {                                                               \
                                                                    \
        using Type1 = std::decay<decltype(Value1)>::type;           \
        using Type2 = std::decay<decltype(Value2)>::type;           \
        using Type3 = std::decay<decltype(Value3)>::type;           \
        using Type4 = std::decay<decltype(Value4)>::type;           \
        using Type5 = std::decay<decltype(Value5)>::type;           \
                                                                    \
        class CommandName : public Command {                        \
        public:                                                     \
            CommandName(                                            \
                Type1 const &In##Param1,                            \
                Type2 const &In##Param2,                            \
                Type3 const &In##Param3,                            \
                Type4 const &In##Param4,                            \
                Type5 const &In##Param5)                            \
            : Param1(In##Param1),                                   \
              Param2(In##Param2),                                   \
              Param3(In##Param3),                                   \
              Param4(In##Param4),                                   \
              Param5(In##Param5) {                                  \
            }                                                       \
            virtual void execute() noexcept override {              \
                Code                                                \
            }                                                       \
            virtual char const *getName() const noexcept override { \
                return (#CommandName);                              \
            }                                                       \
                                                                    \
        private:                                                    \
            Type1 Param1;                                           \
            Type2 Param2;                                           \
            Type3 Param3;                                           \
            Type4 Param4;                                           \
            Type5 Param5;                                           \
        };                                                          \
        WRITE_COMMAND(CB, CommandName,                              \
                      (Value1,                                      \
                       Value2,                                      \
                       Value3,                                      \
                       Value4,                                      \
                       Value5))                                     \
    }

#define ENCODE_COMMAND_6(CB, CommandName,                           \
                         Param1, Value1,                            \
                         Param2, Value2,                            \
                         Param3, Value3,                            \
                         Param4, Value4,                            \
                         Param5, Value5,                            \
                         Param6, Value6,                            \
                         Code)                                      \
    {                                                               \
                                                                    \
        using Type1 = std::decay<decltype(Value1)>::type;           \
        using Type2 = std::decay<decltype(Value2)>::type;           \
        using Type3 = std::decay<decltype(Value3)>::type;           \
        using Type4 = std::decay<decltype(Value4)>::type;           \
        using Type5 = std::decay<decltype(Value5)>::type;           \
        using Type6 = std::decay<decltype(Value6)>::type;           \
                                                                    \
        class CommandName : public Command {                        \
        public:                                                     \
            CommandName(                                            \
                Type1 const &In##Param1,                            \
                Type2 const &In##Param2,                            \
                Type3 const &In##Param3,                            \
                Type4 const &In##Param4,                            \
                Type5 const &In##Param5,                            \
                Type6 const &In##Param6)                            \
            : Param1(In##Param1),                                   \
              Param2(In##Param2),                                   \
              Param3(In##Param3),                                   \
              Param4(In##Param4),                                   \
              Param5(In##Param5),                                   \
              Param6(In##Param6) {                                  \
            }                                                       \
            virtual void execute() noexcept override {              \
                Code                                                \
            }                                                       \
            virtual char const *getName() const noexcept override { \
                return (#CommandName);                              \
            }                                                       \
                                                                    \
        private:                                                    \
            Type1 Param1;                                           \
            Type2 Param2;                                           \
            Type3 Param3;                                           \
            Type4 Param4;                                           \
            Type5 Param5;                                           \
            Type6 Param6;                                           \
        };                                                          \
        WRITE_COMMAND(CB, CommandName,                              \
                      (Value1,                                      \
                       Value2,                                      \
                       Value3,                                      \
                       Value4,                                      \
                       Value5,                                      \
                       Value6))                                     \
    }

#define ENCODE_COMMAND_7(CB, CommandName,                           \
                         Param1, Value1,                            \
                         Param2, Value2,                            \
                         Param3, Value3,                            \
                         Param4, Value4,                            \
                         Param5, Value5,                            \
                         Param6, Value6,                            \
                         Param7, Value7,                            \
                         Code)                                      \
    {                                                               \
                                                                    \
        using Type1 = std::decay<decltype(Value1)>::type;           \
        using Type2 = std::decay<decltype(Value2)>::type;           \
        using Type3 = std::decay<decltype(Value3)>::type;           \
        using Type4 = std::decay<decltype(Value4)>::type;           \
        using Type5 = std::decay<decltype(Value5)>::type;           \
        using Type6 = std::decay<decltype(Value6)>::type;           \
        using Type7 = std::decay<decltype(Value7)>::type;           \
                                                                    \
        class CommandName : public Command {                        \
        public:                                                     \
            CommandName(                                            \
                Type1 const &In##Param1,                            \
                Type2 const &In##Param2,                            \
                Type3 const &In##Param3,                            \
                Type4 const &In##Param4,                            \
                Type5 const &In##Param5,                            \
                Type6 const &In##Param6,                            \
                Type7 const &In##Param7)                            \
            : Param1(In##Param1),                                   \
              Param2(In##Param2),                                   \
              Param3(In##Param3),                                   \
              Param4(In##Param4),                                   \
              Param5(In##Param5),                                   \
              Param6(In##Param6),                                   \
              Param7(In##Param7) {                                  \
            }                                                       \
            virtual void execute() noexcept override {              \
                Code                                                \
            }                                                       \
            virtual const char *getName() const noexcept override { \
                return (#CommandName);                              \
            }                                                       \
                                                                    \
        private:                                                    \
            Type1 Param1;                                           \
            Type2 Param2;                                           \
            Type3 Param3;                                           \
            Type4 Param4;                                           \
            Type5 Param5;                                           \
            Type6 Param6;                                           \
            Type7 Param7;                                           \
        };                                                          \
        WRITE_COMMAND(CB, CommandName,                              \
                      (Value1,                                      \
                       Value2,                                      \
                       Value3,                                      \
                       Value4,                                      \
                       Value5,                                      \
                       Value6,                                      \
                       Value7))                                     \
    }

#define ENCODE_COMMAND_8(CB, CommandName,                           \
                         Param1, Value1,                            \
                         Param2, Value2,                            \
                         Param3, Value3,                            \
                         Param4, Value4,                            \
                         Param5, Value5,                            \
                         Param6, Value6,                            \
                         Param7, Value7,                            \
                         Param8, Value8,                            \
                         Code)                                      \
    {                                                               \
                                                                    \
        using Type1 = std::decay<decltype(Value1)>::type;           \
        using Type2 = std::decay<decltype(Value2)>::type;           \
        using Type3 = std::decay<decltype(Value3)>::type;           \
        using Type4 = std::decay<decltype(Value4)>::type;           \
        using Type5 = std::decay<decltype(Value5)>::type;           \
        using Type6 = std::decay<decltype(Value6)>::type;           \
        using Type7 = std::decay<decltype(Value7)>::type;           \
        using Type8 = std::decay<decltype(Value8)>::type;           \
                                                                    \
        class CommandName : public Command {                        \
        public:                                                     \
            CommandName(Type1 const &In##Param1,                    \
                        Type2 const &In##Param2,                    \
                        Type3 const &In##Param3,                    \
                        Type4 const &In##Param4,                    \
                        Type5 const &In##Param5,                    \
                        Type6 const &In##Param6,                    \
                        Type7 const &In##Param7,                    \
                        Type8 const &In##Param8)                    \
            : Param1(In##Param1),                                   \
              Param2(In##Param2),                                   \
              Param3(In##Param3),                                   \
              Param4(In##Param4),                                   \
              Param5(In##Param5),                                   \
              Param6(In##Param6),                                   \
              Param7(In##Param7),                                   \
              Param8(In##Param8) {                                  \
            }                                                       \
            virtual void execute() noexcept override {              \
                Code                                                \
            }                                                       \
            virtual char const *getName() const noexcept override { \
                return (#CommandName);                              \
            }                                                       \
                                                                    \
        private:                                                    \
            Type1 Param1;                                           \
            Type2 Param2;                                           \
            Type3 Param3;                                           \
            Type4 Param4;                                           \
            Type5 Param5;                                           \
            Type6 Param6;                                           \
            Type7 Param7;                                           \
            Type8 Param8;                                           \
        };                                                          \
        WRITE_COMMAND(CB, CommandName,                              \
                      (Value1,                                      \
                       Value2,                                      \
                       Value3,                                      \
                       Value4,                                      \
                       Value5,                                      \
                       Value6,                                      \
                       Value7,                                      \
                       Value8))                                     \
    }

#define ENCODE_COMMAND_9(CB, CommandName,                           \
                         Param1, Value1,                            \
                         Param2, Value2,                            \
                         Param3, Value3,                            \
                         Param4, Value4,                            \
                         Param5, Value5,                            \
                         Param6, Value6,                            \
                         Param7, Value7,                            \
                         Param8, Value8,                            \
                         Param9, Value9,                            \
                         Code)                                      \
    {                                                               \
                                                                    \
        using Type1 = std::decay<decltype(Value1)>::type;           \
        using Type2 = std::decay<decltype(Value2)>::type;           \
        using Type3 = std::decay<decltype(Value3)>::type;           \
        using Type4 = std::decay<decltype(Value4)>::type;           \
        using Type5 = std::decay<decltype(Value5)>::type;           \
        using Type6 = std::decay<decltype(Value6)>::type;           \
        using Type7 = std::decay<decltype(Value7)>::type;           \
        using Type8 = std::decay<decltype(Value8)>::type;           \
        using Type9 = std::decay<decltype(Value9)>::type;           \
                                                                    \
        class CommandName : public Command {                        \
        public:                                                     \
            CommandName(Type1 const &In##Param1,                    \
                        Type2 const &In##Param2,                    \
                        Type3 const &In##Param3,                    \
                        Type4 const &In##Param4,                    \
                        Type5 const &In##Param5,                    \
                        Type6 const &In##Param6,                    \
                        Type7 const &In##Param7,                    \
                        Type8 const &In##Param8,                    \
                        Type9 const &In##Param9)                    \
            : Param1(In##Param1),                                   \
              Param2(In##Param2),                                   \
              Param3(In##Param3),                                   \
              Param4(In##Param4),                                   \
              Param5(In##Param5),                                   \
              Param6(In##Param6),                                   \
              Param7(In##Param7),                                   \
              Param8(In##Param8),                                   \
              Param9(In##Param9) {                                  \
            }                                                       \
            virtual void execute() noexcept override {              \
                Code                                                \
            }                                                       \
            virtual char const *getName() const noexcept override { \
                return (#CommandName);                              \
            }                                                       \
                                                                    \
        private:                                                    \
            Type1 Param1;                                           \
            Type2 Param2;                                           \
            Type3 Param3;                                           \
            Type4 Param4;                                           \
            Type5 Param5;                                           \
            Type6 Param6;                                           \
            Type7 Param7;                                           \
            Type8 Param8;                                           \
            Type9 Param9;                                           \
        };                                                          \
        WRITE_COMMAND(CB, CommandName,                              \
                      (Value1,                                      \
                       Value2,                                      \
                       Value3,                                      \
                       Value4,                                      \
                       Value5,                                      \
                       Value6,                                      \
                       Value7,                                      \
                       Value8,                                      \
                       Value9))                                     \
    }

} // namespace cc
