#include "sebind_fruits.h"

#include "bindings/sebind/intl/common.h"
#include "bindings/sebind/sebind.h"
#include "tests/sebind-tests/common/Classes/demo/Coconut.h"
#include "tests/sebind-tests/common/Classes/demo/Fruit.h"

namespace {
struct Utils {};

void doAssert(bool value, const std::string &message) {
    if (!value) {
        CC_LOG_ERROR("Assert Fail: %s", message.c_str());
        std::exit(-1);
    }
}

void successQuit(int code) {
    std::exit(code);
}

} // namespace

bool jsb_register_fruits(se::Object *globalThis) {
    se::Object *ns{nullptr};
    {
        se::Value demo;
        globalThis->getProperty("demo", &demo);
        if (!demo.isObject()) {
            ns = se::Object::createPlainObject();
            globalThis->setProperty("demo", se::Value(ns));
        } else {
            ns = demo.toObject();
        }
    }

    sebind::class_<demo::Fruit> fruitClass("Fruit");
    {
        fruitClass.constructor<const std::string &>()
            .constructor<const std::string &, int>()
            .function("fullInfo", &demo::Fruit::fullInfo)
            .function("toString", &demo::Fruit::fullInfo)
            .property("uid", &demo::Fruit::uid)
            .property("name", &demo::Fruit::getName, nullptr)
            .property("sweetness", &demo::Fruit::getSweetness, &demo::Fruit::setSweetness)
            .property("price", &demo::Fruit::getPrice, nullptr)
            .install(ns);
    }
    sebind::class_<demo::Coconut> coconutClass("Coconut", fruitClass.prototype());
    {
        coconutClass.constructor<sebind::ThisObject>()
            .constructor<sebind::ThisObject, const std::string &, float>()
            .property("radius", &demo::Coconut::getRadius, nullptr)
            .property("radius2", nullptr, &demo::Coconut::setRadius)
            .function("combine", &demo::Coconut::combine)
            .function("setRadius", &demo::Coconut::setRadius)
            .function("getRadius", &demo::Coconut::getRadius)
            .function("doNothing", &demo::Coconut::doNothing)
            .function("callJsFunction", &demo::Coconut::callJSFunction)
            .staticFunction("OneTwoThree", &demo::Coconut::OneTwoThree)
            .staticFunction("StaticDoNothing", &demo::Coconut::StaticDoNothing)
            .staticProperty("p123_1", &demo::Coconut::OneTwoThree, &demo::Coconut::IgnoreInput)
            .staticProperty("p123_2", &demo::Coconut::OneTwoThree, nullptr)
            .staticProperty("p123_3", nullptr, &demo::Coconut::IgnoreInput)
            .staticProperty("p123", &demo::Coconut::OneTwoThree, nullptr)
            .install(ns);
    }

    sebind::class_<Utils> utilsClass("utils");
    {
        utilsClass.staticFunction("assert", &doAssert)
            .staticFunction("exit", &successQuit)
            .install(globalThis);
    }

    return true;
}
