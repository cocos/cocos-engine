// generated code

#define DECLARE_BUS_EVENT_ARG0(BusEventClass, EventBusClass)                                    \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void> { \
        using BusType = EventBusName_(EventBusClass);                                           \
        using Listener = cc::event::Listener<BusEventClass>;                                    \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;         \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                             \
        constexpr static size_t TypeID() {                                                      \
            return cc::event::intl::hash(#BusEventClass);                                       \
        }                                                                                       \
        static inline void broadcast() {                                                        \
            cc::event::broadcast<BusEventClass>();                                              \
        }                                                                                       \
    };

#define DECLARE_BUS_EVENT_ARG1(BusEventClass, EventBusClass, ArgType0)                                    \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0> { \
        using BusType = EventBusName_(EventBusClass);                                                     \
        using Listener = cc::event::Listener<BusEventClass>;                                              \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                   \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                       \
        constexpr static size_t TypeID() {                                                                \
            return cc::event::intl::hash(#BusEventClass);                                                 \
        }                                                                                                 \
        static inline void broadcast(ArgType0 arg0) {                                                     \
            cc::event::broadcast<BusEventClass>(arg0);                                                    \
        }                                                                                                 \
    };

#define DECLARE_BUS_EVENT_ARG2(BusEventClass, EventBusClass, ArgType0, ArgType1)                                    \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1> { \
        using BusType = EventBusName_(EventBusClass);                                                               \
        using Listener = cc::event::Listener<BusEventClass>;                                                        \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                             \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                 \
        constexpr static size_t TypeID() {                                                                          \
            return cc::event::intl::hash(#BusEventClass);                                                           \
        }                                                                                                           \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1) {                                                \
            cc::event::broadcast<BusEventClass>(arg0, arg1);                                                        \
        }                                                                                                           \
    };

#define DECLARE_BUS_EVENT_ARG3(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2)                                    \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2> { \
        using BusType = EventBusName_(EventBusClass);                                                                         \
        using Listener = cc::event::Listener<BusEventClass>;                                                                  \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                       \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                           \
        constexpr static size_t TypeID() {                                                                                    \
            return cc::event::intl::hash(#BusEventClass);                                                                     \
        }                                                                                                                     \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2) {                                           \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2);                                                            \
        }                                                                                                                     \
    };

#define DECLARE_BUS_EVENT_ARG4(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3)                                    \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3> { \
        using BusType = EventBusName_(EventBusClass);                                                                                   \
        using Listener = cc::event::Listener<BusEventClass>;                                                                            \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                 \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                     \
        constexpr static size_t TypeID() {                                                                                              \
            return cc::event::intl::hash(#BusEventClass);                                                                               \
        }                                                                                                                               \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3) {                                      \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3);                                                                \
        }                                                                                                                               \
    };

#define DECLARE_BUS_EVENT_ARG5(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4)                                    \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4> { \
        using BusType = EventBusName_(EventBusClass);                                                                                             \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                      \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                           \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                               \
        constexpr static size_t TypeID() {                                                                                                        \
            return cc::event::intl::hash(#BusEventClass);                                                                                         \
        }                                                                                                                                         \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4) {                                 \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4);                                                                    \
        }                                                                                                                                         \
    };

#define DECLARE_BUS_EVENT_ARG6(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5)                                    \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5> { \
        using BusType = EventBusName_(EventBusClass);                                                                                                       \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                     \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                         \
        constexpr static size_t TypeID() {                                                                                                                  \
            return cc::event::intl::hash(#BusEventClass);                                                                                                   \
        }                                                                                                                                                   \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5) {                            \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5);                                                                        \
        }                                                                                                                                                   \
    };

#define DECLARE_BUS_EVENT_ARG7(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6)                                    \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6> { \
        using BusType = EventBusName_(EventBusClass);                                                                                                                 \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                          \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                               \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                   \
        constexpr static size_t TypeID() {                                                                                                                            \
            return cc::event::intl::hash(#BusEventClass);                                                                                                             \
        }                                                                                                                                                             \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6) {                       \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6);                                                                            \
        }                                                                                                                                                             \
    };

#define DECLARE_BUS_EVENT_ARG8(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7)                                    \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7> { \
        using BusType = EventBusName_(EventBusClass);                                                                                                                           \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                    \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                         \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                             \
        constexpr static size_t TypeID() {                                                                                                                                      \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                       \
        }                                                                                                                                                                       \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7) {                  \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);                                                                                \
        }                                                                                                                                                                       \
    };

#define DECLARE_BUS_EVENT_ARG9(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8)                                    \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8> { \
        using BusType = EventBusName_(EventBusClass);                                                                                                                                     \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                              \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                                   \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                                       \
        constexpr static size_t TypeID() {                                                                                                                                                \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                                 \
        }                                                                                                                                                                                 \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7, ArgType8 arg8) {             \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);                                                                                    \
        }                                                                                                                                                                                 \
    };

#define DECLARE_BUS_EVENT_ARG10(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9)                                   \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9> { \
        using BusType = EventBusName_(EventBusClass);                                                                                                                                               \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                                        \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                                             \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                                                 \
        constexpr static size_t TypeID() {                                                                                                                                                          \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                                           \
        }                                                                                                                                                                                           \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7, ArgType8 arg8, ArgType9 arg9) {        \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);                                                                                        \
        }                                                                                                                                                                                           \
    };

#define DECLARE_BUS_EVENT_ARG11(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10)                                   \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10> { \
        using BusType = EventBusName_(EventBusClass);                                                                                                                                                          \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                                                   \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                                                        \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                                                            \
        constexpr static size_t TypeID() {                                                                                                                                                                     \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                                                      \
        }                                                                                                                                                                                                      \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7, ArgType8 arg8, ArgType9 arg9, ArgType10 arg10) {  \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10);                                                                                            \
        }                                                                                                                                                                                                      \
    };

#define DECLARE_BUS_EVENT_ARG12(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11)                                        \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11> {      \
        using BusType = EventBusName_(EventBusClass);                                                                                                                                                                          \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                                                                   \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                                                                        \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                                                                            \
        constexpr static size_t TypeID() {                                                                                                                                                                                     \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                                                                      \
        }                                                                                                                                                                                                                      \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7, ArgType8 arg8, ArgType9 arg9, ArgType10 arg10, ArgType11 arg11) { \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11);                                                                                                     \
        }                                                                                                                                                                                                                      \
    };

#define DECLARE_BUS_EVENT_ARG13(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12)                                              \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12> {            \
        using BusType = EventBusName_(EventBusClass);                                                                                                                                                                                           \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                                                                                    \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                                                                                         \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                                                                                             \
        constexpr static size_t TypeID() {                                                                                                                                                                                                      \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                                                                                       \
        }                                                                                                                                                                                                                                       \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7, ArgType8 arg8, ArgType9 arg9, ArgType10 arg10, ArgType11 arg11, ArgType12 arg12) { \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12);                                                                                                               \
        }                                                                                                                                                                                                                                       \
    };

#define DECLARE_BUS_EVENT_ARG14(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13)                                                    \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13> {                  \
        using BusType = EventBusName_(EventBusClass);                                                                                                                                                                                                            \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                                                                                                     \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                                                                                                          \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                                                                                                              \
        constexpr static size_t TypeID() {                                                                                                                                                                                                                       \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                                                                                                        \
        }                                                                                                                                                                                                                                                        \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7, ArgType8 arg8, ArgType9 arg9, ArgType10 arg10, ArgType11 arg11, ArgType12 arg12, ArgType13 arg13) { \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13);                                                                                                                         \
        }                                                                                                                                                                                                                                                        \
    };

#define DECLARE_BUS_EVENT_ARG15(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13, ArgType14)                                                          \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13, ArgType14> {                        \
        using BusType = EventBusName_(EventBusClass);                                                                                                                                                                                                                             \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                                                                                                                      \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                                                                                                                           \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                                                                                                                               \
        constexpr static size_t TypeID() {                                                                                                                                                                                                                                        \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                                                                                                                         \
        }                                                                                                                                                                                                                                                                         \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7, ArgType8 arg8, ArgType9 arg9, ArgType10 arg10, ArgType11 arg11, ArgType12 arg12, ArgType13 arg13, ArgType14 arg14) { \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14);                                                                                                                                   \
        }                                                                                                                                                                                                                                                                         \
    };

#define DECLARE_BUS_EVENT_ARG16(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13, ArgType14, ArgType15)                                                                \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13, ArgType14, ArgType15> {                              \
        using BusType = EventBusName_(EventBusClass);                                                                                                                                                                                                                                              \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                                                                                                                                       \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                                                                                                                                            \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                                                                                                                                                \
        constexpr static size_t TypeID() {                                                                                                                                                                                                                                                         \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                                                                                                                                          \
        }                                                                                                                                                                                                                                                                                          \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7, ArgType8 arg8, ArgType9 arg9, ArgType10 arg10, ArgType11 arg11, ArgType12 arg12, ArgType13 arg13, ArgType14 arg14, ArgType15 arg15) { \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15);                                                                                                                                             \
        }                                                                                                                                                                                                                                                                                          \
    };

#define DECLARE_BUS_EVENT_ARG17(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13, ArgType14, ArgType15, ArgType16)                                                                      \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13, ArgType14, ArgType15, ArgType16> {                                    \
        using BusType = EventBusName_(EventBusClass);                                                                                                                                                                                                                                                               \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                                                                                                                                                        \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                                                                                                                                                             \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                                                                                                                                                                 \
        constexpr static size_t TypeID() {                                                                                                                                                                                                                                                                          \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                                                                                                                                                           \
        }                                                                                                                                                                                                                                                                                                           \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7, ArgType8 arg8, ArgType9 arg9, ArgType10 arg10, ArgType11 arg11, ArgType12 arg12, ArgType13 arg13, ArgType14 arg14, ArgType15 arg15, ArgType16 arg16) { \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16);                                                                                                                                                       \
        }                                                                                                                                                                                                                                                                                                           \
    };

#define DECLARE_BUS_EVENT_ARG18(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13, ArgType14, ArgType15, ArgType16, ArgType17)                                                                            \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13, ArgType14, ArgType15, ArgType16, ArgType17> {                                          \
        using BusType = EventBusName_(EventBusClass);                                                                                                                                                                                                                                                                                \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                                                                                                                                                                         \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                                                                                                                                                                              \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                                                                                                                                                                                  \
        constexpr static size_t TypeID() {                                                                                                                                                                                                                                                                                           \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                                                                                                                                                                            \
        }                                                                                                                                                                                                                                                                                                                            \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7, ArgType8 arg8, ArgType9 arg9, ArgType10 arg10, ArgType11 arg11, ArgType12 arg12, ArgType13 arg13, ArgType14 arg14, ArgType15 arg15, ArgType16 arg16, ArgType17 arg17) { \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, arg17);                                                                                                                                                                 \
        }                                                                                                                                                                                                                                                                                                                            \
    };

#define DECLARE_BUS_EVENT_ARG19(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13, ArgType14, ArgType15, ArgType16, ArgType17, ArgType18)                                                                                  \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13, ArgType14, ArgType15, ArgType16, ArgType17, ArgType18> {                                                \
        using BusType = EventBusName_(EventBusClass);                                                                                                                                                                                                                                                                                                 \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                                                                                                                                                                                          \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                                                                                                                                                                                               \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                                                                                                                                                                                                   \
        constexpr static size_t TypeID() {                                                                                                                                                                                                                                                                                                            \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                                                                                                                                                                                             \
        }                                                                                                                                                                                                                                                                                                                                             \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7, ArgType8 arg8, ArgType9 arg9, ArgType10 arg10, ArgType11 arg11, ArgType12 arg12, ArgType13 arg13, ArgType14 arg14, ArgType15 arg15, ArgType16 arg16, ArgType17 arg17, ArgType18 arg18) { \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, arg17, arg18);                                                                                                                                                                           \
        }                                                                                                                                                                                                                                                                                                                                             \
    };

#define DECLARE_BUS_EVENT_ARG20(BusEventClass, EventBusClass, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13, ArgType14, ArgType15, ArgType16, ArgType17, ArgType18, ArgType19)                                                                                        \
    struct BusEventClass final : cc::event::BusEventTrait<EventBusName_(EventBusClass), void, ArgType0, ArgType1, ArgType2, ArgType3, ArgType4, ArgType5, ArgType6, ArgType7, ArgType8, ArgType9, ArgType10, ArgType11, ArgType12, ArgType13, ArgType14, ArgType15, ArgType16, ArgType17, ArgType18, ArgType19> {                                                      \
        using BusType = EventBusName_(EventBusClass);                                                                                                                                                                                                                                                                                                                  \
        using Listener = cc::event::Listener<BusEventClass>;                                                                                                                                                                                                                                                                                                           \
        constexpr static const char *BUS_NAME = EventBusName_(EventBusClass)::BUS_NAME;                                                                                                                                                                                                                                                                                \
        constexpr static const char *HANDLE_CLASS = #BusEventClass;                                                                                                                                                                                                                                                                                                    \
        constexpr static size_t TypeID() {                                                                                                                                                                                                                                                                                                                             \
            return cc::event::intl::hash(#BusEventClass);                                                                                                                                                                                                                                                                                                              \
        }                                                                                                                                                                                                                                                                                                                                                              \
        static inline void broadcast(ArgType0 arg0, ArgType1 arg1, ArgType2 arg2, ArgType3 arg3, ArgType4 arg4, ArgType5 arg5, ArgType6 arg6, ArgType7 arg7, ArgType8 arg8, ArgType9 arg9, ArgType10 arg10, ArgType11 arg11, ArgType12 arg12, ArgType13 arg13, ArgType14 arg14, ArgType15 arg15, ArgType16 arg16, ArgType17 arg17, ArgType18 arg18, ArgType19 arg19) { \
            cc::event::broadcast<BusEventClass>(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, arg17, arg18, arg19);                                                                                                                                                                                     \
        }                                                                                                                                                                                                                                                                                                                                                              \
    };
