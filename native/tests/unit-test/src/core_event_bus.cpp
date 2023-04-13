#include "core/event/EventBus.h"
#include "utils.h"
namespace {
DECLARE_EVENT_BUS(Test1)
DECLARE_BUS_EVENT_ARG0(BusEvent0_Test1, Test1)
DECLARE_BUS_EVENT_ARG1(BusEvent1_Test1, Test1, int)
DECLARE_BUS_EVENT_ARG2(BusEvent2_Test1, Test1, int, const char *)
DECLARE_BUS_EVENT_ARG3(BusEvent3_Test1, Test1, int, char *, float)

DECLARE_EVENT_BUS(Test2)
DECLARE_BUS_EVENT_ARG0(BusEvent0_Test2, Test2)
DECLARE_BUS_EVENT_ARG1(BusEvent1_Test2, Test2, int)
DECLARE_BUS_EVENT_ARG2(BusEvent2_Test2, Test2, int, const char *)
DECLARE_BUS_EVENT_ARG3(BusEvent3_Test2, Test2, int, char *, float)
struct Test1_ListenerT {
    static int handleArg2_arg0;
    static const char *handleArg2_arg1;
    static int handleArg3_arg0;
    static char *handleArg3_arg1;
    static float handleArg3_arg2;
    static void handleArg2(int arg0, const char *arg1) {
        handleArg2_arg0 = arg0;
        handleArg2_arg1 = arg1;
    }
    static void handleArg3(int arg0, char *arg1, float arg2) {
        handleArg3_arg0 = arg0;
        handleArg3_arg1 = arg1;
        handleArg3_arg2 = arg2;
    }
};
int Test1_ListenerT::handleArg2_arg0 = 0;
const char *Test1_ListenerT::handleArg2_arg1 = nullptr;
int Test1_ListenerT::handleArg3_arg0 = 0;
char *Test1_ListenerT::handleArg3_arg1 = nullptr;
float Test1_ListenerT::handleArg3_arg2 = 0;

static int handleArg2_value1 = 0;
static const char *handleArg2_value2 = nullptr;
static void handleArg2(int arg0, const char *arg1) {
    handleArg2_value1 = arg0;
    handleArg2_value2 = arg1;
}

} // namespace
TEST(eventBus, test_stack_allocated_listener) {
    BusEvent0_Test1::Listener listener;
    int listenerTriggerTimes = 0;
    listener.bind([&]() {
        listenerTriggerTimes++;
    });
    BusEvent0_Test1::broadcast();
    logLabel = "listener trigger 1 time";
    EXPECT_EQ(listenerTriggerTimes, 1);

    logLabel = "listener trigger 2 time";
    cc::event::broadcast<BusEvent0_Test1>();
    EXPECT_EQ(listenerTriggerTimes, 2);

    logLabel = "listener disabled";
    listener.disable();
    cc::event::broadcast<BusEvent0_Test1>();
    EXPECT_EQ(listenerTriggerTimes, 2);

    logLabel = "listener enabled";
    listener.enable();
    cc::event::broadcast<BusEvent0_Test1>();
    EXPECT_EQ(listenerTriggerTimes, 3);
}

TEST(eventBus, test_heap_allocated_listener) {
    BusEvent0_Test1::Listener *listener = new BusEvent0_Test1::Listener;
    int listenerTriggerTimes = 0;
    listener->bind([&]() {
        listenerTriggerTimes++;
    });
    BusEvent0_Test1::broadcast();
    logLabel = "listener trigger 1 time";
    EXPECT_EQ(listenerTriggerTimes, 1);

    logLabel = "listener trigger 2 time";
    cc::event::broadcast<BusEvent0_Test1>();
    EXPECT_EQ(listenerTriggerTimes, 2);

    delete listener;
    logLabel = "listener trigger remain 2 time after deleted";
    cc::event::broadcast<BusEvent0_Test1>();
    EXPECT_EQ(listenerTriggerTimes, 2);
}

TEST(eventBus, test_bind_methods) {
    BusEvent2_Test1::Listener listenerArg2;
    BusEvent2_Test1::Listener listenerArg2Copy;
    BusEvent3_Test1::Listener listenerArg3;

    int listenerTriggerTimes = 0;
    const char *staticMessage = " hello event bus";
    listenerArg2.bind([&](int, const char *) {
        listenerTriggerTimes++;
    });
    BusEvent2_Test1::broadcast(1, staticMessage);
    EXPECT_EQ(listenerTriggerTimes, 1);

    logLabel = "bind static method, override";
    listenerArg2.bind(&Test1_ListenerT::handleArg2);
    listenerArg2Copy.bind(&handleArg2);
    BusEvent2_Test1::broadcast(1, staticMessage);
    EXPECT_EQ(Test1_ListenerT::handleArg2_arg0, 1);
    EXPECT_EQ(Test1_ListenerT::handleArg2_arg1, staticMessage);
    EXPECT_EQ(handleArg2_value1, 1);
    EXPECT_EQ(handleArg2_value2, staticMessage);
    EXPECT_EQ(listenerTriggerTimes, 1); // should not update

    logLabel = "broadcast arg3";
    char message[6] = "world";
    listenerArg3.bind(&Test1_ListenerT::handleArg3);
    BusEvent3_Test1::broadcast(1, message, 3.5F);
    EXPECT_EQ(Test1_ListenerT::handleArg3_arg0, 1);
    EXPECT_EQ(Test1_ListenerT::handleArg3_arg1, message);
    EXPECT_EQ(Test1_ListenerT::handleArg3_arg2, 3.5F);
}

TEST(eventBus, test_multiple_listeners) {
    BusEvent0_Test1::Listener listener1;
    BusEvent0_Test1::Listener listener2;
    int listener1_TriggerTimes = 0;
    int listener2_TriggerTimes = 0;
    listener1.bind([&]() {
        listener1_TriggerTimes++;
    });
    listener2.bind([&]() {
        listener2_TriggerTimes++;
    });
    logLabel = "trigger 1 time";
    BusEvent0_Test1::broadcast();
    EXPECT_EQ(listener1_TriggerTimes, 1);
    EXPECT_EQ(listener2_TriggerTimes, 1);
    logLabel = "trigger 1 time";
    BusEvent0_Test1::broadcast();
    EXPECT_EQ(listener1_TriggerTimes, 2);
    EXPECT_EQ(listener2_TriggerTimes, 2);
}

TEST(eventBus, create_event_bus_in_listener) {
    std::unique_ptr<BusEvent1_Test2::Listener> listenerStatic_A1 = std::make_unique<BusEvent1_Test2::Listener>();
    std::vector<std::unique_ptr<BusEvent0_Test2::Listener>> listenerDyn_A0;
    std::vector<std::unique_ptr<BusEvent1_Test2::Listener>> listenerDyn_A1;
    int listenerStaticTriggerTimes = 0;
    int sub0_ListenerStaticTriggerTimes = 0;
    int sub1_ListenerStaticTriggerTimes = 0;
    listenerStatic_A1->bind([&](int n) {
        listenerStaticTriggerTimes += 1;
        for (int i = 0; i < n; i++) {
            listenerDyn_A0.emplace_back(std::make_unique<BusEvent0_Test2::Listener>());
            listenerDyn_A1.emplace_back(std::make_unique<BusEvent1_Test2::Listener>());
            listenerDyn_A0.back()->bind([&]() {
                sub0_ListenerStaticTriggerTimes++;
            });
            listenerDyn_A1.back()->bind([&](int n) {
                sub1_ListenerStaticTriggerTimes++;
            });
        }
        // BusEvent1_Test2::broadcast(3); // dead loop
        BusEvent0_Test2::broadcast();
    });
    logLabel = "create sub listeners x2";
    BusEvent1_Test2::broadcast(2);
    EXPECT_EQ(listenerStaticTriggerTimes, 1);
    EXPECT_EQ(sub0_ListenerStaticTriggerTimes, 2);
    EXPECT_EQ(sub1_ListenerStaticTriggerTimes, 0); // new listenerDyn_A1 listeners would not be triggers

    logLabel = "create sub listeners x2";
    listenerStatic_A1.reset();
    BusEvent1_Test2::broadcast(5);
    BusEvent0_Test2::broadcast();
    EXPECT_EQ(listenerStaticTriggerTimes, 1);
    EXPECT_EQ(sub0_ListenerStaticTriggerTimes, 2 + 2);
    EXPECT_EQ(sub1_ListenerStaticTriggerTimes, 2);
}

TEST(eventBus, del_event_bus_in_listener) {
    BusEvent1_Test2::Listener *listener_1 = new BusEvent1_Test2::Listener;
    BusEvent1_Test2::Listener *listener_2 = new BusEvent1_Test2::Listener;
    BusEvent1_Test2::Listener *listener_3 = new BusEvent1_Test2::Listener;
    int listener1_cnt = 0;
    int listener2_cnt = 0;
    int listener3_cnt = 0;
    listener_1->bind([&](int x) {
        listener1_cnt++;
    });
    listener_2->bind([&](int x) {
        listener2_cnt++;
    });
    listener_3->bind([&](int x) {
        listener3_cnt++;
        if (listener_2) {
            delete listener_2;
            listener_2 = nullptr;
        }
    });
    BusEvent1_Test2::broadcast(3);
    EXPECT_EQ(listener1_cnt, 1);
    EXPECT_EQ(listener2_cnt, 1);
    EXPECT_EQ(listener2_cnt, 1);
    BusEvent1_Test2::broadcast(3);
    EXPECT_EQ(listener1_cnt, 2);
    EXPECT_EQ(listener2_cnt, 1); // should not run again
    EXPECT_EQ(listener3_cnt, 2);

    delete listener_1;
    // delete listener_2;
    delete listener_3;
}
