
#include "core/event/EventTarget.h"
#include "utils.h"
namespace {
class TestNode {
    IMPL_EVENT_TARGET(TestNode)
    DECLARE_TARGET_EVENT_BEGIN(TestNode)
    TARGET_EVENT_ARG0(Init)
    TARGET_EVENT_ARG1(Update, float)
    TARGET_EVENT_ARG0(Stop)
    TARGET_EVENT_ARG4(Deinit, int, float, const std::string &, std::string &);
    DECLARE_TARGET_EVENT_END()
public:
    void onInit() { _init++; }
    void onUpdate(float) { _update++; }
    void onStop() { _stop++; }
    void onDeinit(int, float, const std::string &, std::string &) { _deinit++; }

    static void onInitS(TestNode *emitter);

    int _init = 0;
    int _update = 0;
    int _stop = 0;
    int _deinit = 0;
};

int TestNode_init = 0;

void TestNode::onInitS(TestNode *emitter) { TestNode_init++; }

class TestSubNode : public TestNode {
public:
};

struct LinkNode {
    LinkNode *next{nullptr};
    LinkNode *prev{nullptr};
};

class TestNodeWithParent {
    IMPL_EVENT_TARGET_WITH_PARENT(TestNodeWithParent, getParent)
    DECLARE_TARGET_EVENT_BEGIN(TestNodeWithParent)
    TARGET_EVENT_ARG0(Init)
    TARGET_EVENT_ARG1(Update, float)
    TARGET_EVENT_ARG0(Stop)
    TARGET_EVENT_ARG4(Deinit, int, float, const std::string &, std::string &);
    DECLARE_TARGET_EVENT_END()
public:
    void onInit() { _init++; }
    void onUpdate(float) { _update++; }
    void onStop() { _stop++; }
    void onDeinit(int, float, const std::string &, std::string &) { _deinit++; }

    TestNodeWithParent *getParent() {
        return parent;
    }

    static void onInitS(TestNodeWithParent *emitter);

    int _init = 0;
    int _update = 0;
    int _stop = 0;
    int _deinit = 0;

    TestNodeWithParent *parent{nullptr};
};
} // namespace

TEST(eventTarget, test_basic_event_target) {
    TestNode node;
    auto idInit = node.on<TestNode::Init>(&TestNode::onInit);
    auto idUpdate = node.on<TestNode::Update>(&TestNode::onUpdate);
    auto idStop = node.on<TestNode::Stop>(&TestNode::onStop);
    auto idDeinit = node.on<TestNode::Deinit>(&TestNode::onDeinit);

    auto idInitS = node.on<TestNode::Init>(&TestNode::onInitS);

    int TestNode_Init_Lambda = 0;
    auto idInitLambda = node.on<TestNode::Init>([&](TestNode *emitter) {
        TestNode_Init_Lambda++;
    });

    node.emit<TestNode::Init>();
    node.emit<TestNode::Update>(0.1666);
    node.emit<TestNode::Stop>();
    char message[6] = "hello";
    node.emit<TestNode::Deinit>(3, 3.6F, "hello", message);
    EXPECT_EQ(node._init, 1);
    EXPECT_EQ(node._update, 1);
    EXPECT_EQ(node._stop, 1);
    EXPECT_EQ(node._deinit, 1);
    EXPECT_EQ(TestNode_init, 1);
    EXPECT_EQ(TestNode_Init_Lambda, 1);

    node.off(idInit);
    node.emit<TestNode::Init>();
    EXPECT_EQ(node._init, 1); // no change
    EXPECT_EQ(TestNode_init, 2);
    EXPECT_EQ(TestNode_Init_Lambda, 2);
    node.off<TestNode::Init>();
    node.emit<TestNode::Init>();
    EXPECT_EQ(node._init, 1);    // no change
    EXPECT_EQ(TestNode_init, 2); // no change
    EXPECT_EQ(TestNode_Init_Lambda, 2);

    node.off<TestNode::Update>();
    node.emit<TestNode::Update>(0.1666);
    EXPECT_EQ(node._update, 1); // no change

    EXPECT_EQ(node._stop, 1);
    EXPECT_EQ(node._deinit, 1);
    node.offAll();
    node.emit<TestNode::Stop>();
    node.emit<TestNode::Deinit>(3, 3.6F, "hello", message);
    EXPECT_EQ(node._stop, 1);
    EXPECT_EQ(node._deinit, 1);
}
TEST(eventTarget, test_double_link_list) {
    LinkNode *list = nullptr;
    LinkNode a;
    LinkNode b;
    LinkNode c;
    cc::event::intl::listAppend(&list, &a);
    int count = 0;
    EVENT_LIST_LOOP_BEGIN(itr, list)
    count++;
    EVENT_LIST_LOOP_END(itr, list)
    EXPECT_EQ(count, 1);
    count = 0;
    cc::event::intl::listAppend(&list, &b);
    EVENT_LIST_LOOP_BEGIN(itr, list)
    count++;
    EVENT_LIST_LOOP_END(itr, list)
    EXPECT_EQ(count, 2);
    count = 0;
    cc::event::intl::listAppend(&list, &c);
    EVENT_LIST_LOOP_BEGIN(itr, list)
    count++;
    EVENT_LIST_LOOP_END(itr, list)
    EXPECT_EQ(count, 3);
    count = 0;

    cc::event::intl::detachFromList(&list, &b);
    EVENT_LIST_LOOP_BEGIN(itr, list)
    count++;
    EVENT_LIST_LOOP_END(itr, list)
    EXPECT_EQ(count, 2);
    count = 0;

    cc::event::intl::detachFromList(&list, &c);
    EVENT_LIST_LOOP_BEGIN(itr, list)
    count++;
    EVENT_LIST_LOOP_END(itr, list)
    EXPECT_EQ(count, 1);
    count = 0;
    cc::event::intl::detachFromList(&list, &a);
    EVENT_LIST_LOOP_BEGIN(itr, list)
    count++;
    EVENT_LIST_LOOP_END(itr, list)
    EXPECT_EQ(count, 0);
    EXPECT_EQ(list, nullptr);
    count = 0;
}

TEST(eventTarget, add_listener_within_callback) {
    TestNode node;
    int init_times = 0;
    int init_times_inner = 0;
    int update_times = 0;
    auto idInit = node.on<TestNode::Init>([&](TestNode *emitter) {
        init_times++;
        emitter->on<TestNode::Init>([&](TestNode *emitter2) {
            init_times++;
            init_times_inner++;
        });
        emitter->on<TestNode::Update>([&](TestNode *emitter2, float dt) {
            update_times++;
        });
    });
    node.emit<TestNode::Init>();
    node.off(idInit);
    EXPECT_EQ(init_times, 1);
    EXPECT_EQ(init_times_inner, 0);
    node.emit<TestNode::Init>();
    EXPECT_EQ(init_times, 2);
    EXPECT_EQ(init_times_inner, 1);
    node.emit<TestNode::Update>(0.3);
    EXPECT_EQ(update_times, 1);
}

TEST(eventTarget, off_listener_within_callback) {
    TestNode node;
    int init_times = 0;
    int update_times = 0;
    auto idInit = node.on<TestNode::Init>([&](TestNode *emitter) {
        init_times++;
    });
    auto updateId = node.on<TestNode::Update>([&](TestNode *emitter, float dt) {
        update_times++;
        node.off(idInit);
    });
    node.emit<TestNode::Init>();
    EXPECT_EQ(init_times, 1);
    EXPECT_EQ(update_times, 0);
    node.emit<TestNode::Update>(0.3);
    EXPECT_EQ(init_times, 1);
    EXPECT_EQ(update_times, 1);
    node.emit<TestNode::Init>();
    EXPECT_EQ(init_times, 1);
    EXPECT_EQ(update_times, 1);
}
TEST(eventTarget, off_same_listener_within_callback) {
    TestNode node;
    int init_times = 0;
    int update_times = 0;
    auto idInit = node.on<TestNode::Init>([&](TestNode *emitter) {
        init_times++;
    });
    auto idInit2 = node.on<TestNode::Init>([&](TestNode *emitter) {
        init_times++;
        node.off(idInit);
    });
    // node.emit<TestNode::Init>(i); // should crash
}

TEST(eventTarget, emitWithParent) {
    TestNodeWithParent l0;
    TestNodeWithParent l1;
    TestNodeWithParent l2;
    l1.parent = &l0;
    l2.parent = &l1;
    std::vector<int> record;
    l0.on<TestNodeWithParent::Init>([&](TestNodeWithParent *emitter) {
        record.emplace_back(0);
    },
                                    true);
    l1.on<TestNodeWithParent::Init>([&](TestNodeWithParent *emitter) {
        record.emplace_back(2);
    },
                                    false);
    l2.on<TestNodeWithParent::Init>([&](TestNodeWithParent *emitter) {
        record.emplace_back(1);
    });
    l2.dispatchEvent<TestNodeWithParent::Init>();
    EXPECT_EQ(record.size(), 3);
    EXPECT_EQ(record[0], 0);
    EXPECT_EQ(record[1], 1);
    EXPECT_EQ(record[2], 2);
    l0.offAll();
    l1.offAll();
    l2.offAll();
    record.clear();
    l0.on<TestNodeWithParent::Init>([&](TestNodeWithParent::Init::EventType *eventObj) {
        record.emplace_back(0);
    },
                                    true);
    l1.on<TestNodeWithParent::Init>([&](TestNodeWithParent::Init::EventType *eventObj) {
        record.emplace_back(2);
    },
                                    false);
    l2.on<TestNodeWithParent::Init>([&](TestNodeWithParent::Init::EventType *eventObj) {
        record.emplace_back(1);
        eventObj->stopPropagation();
    });
    TestNodeWithParent::Init::EventType evt;
    l2.dispatchEvent<TestNodeWithParent::Init>(evt);
    EXPECT_EQ(record.size(), 2);
    EXPECT_EQ(record[0], 0);
    EXPECT_EQ(record[1], 1);
}
