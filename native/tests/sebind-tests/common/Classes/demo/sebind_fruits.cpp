#include "sebind_fruits.h"
#include <chrono>
#include <iostream>
#include "bindings/sebind/intl/common.h"
#include "bindings/sebind/sebind.h"
#include "tests/sebind-tests/common/Classes/demo/Coconut.h"
#include "tests/sebind-tests/common/Classes/demo/Fruit.h"

namespace {
struct Utils {};

void doAssert(bool value, const std::string &message) {
    if (!value) {
        CC_LOG_ERROR("Assert Fail: %s", message.c_str());
        std::cerr << "Assert Failed: " << message << std::endl;
        ;
        std::exit(-1);
    }
}

void WriteLog(const std::string &message) {
    // std::cout << "[log] " << message << std::endl;
    CC_LOG_DEBUG("[log] %s", message.c_str());
}

void successQuit(int code) {
    if (code == 0) {
        FILE *fp = fopen("result.txt", "wt");
        fwrite("ok\n", 3, 1, fp);
        fclose(fp);
    }
    std::exit(code);
}

int Coconut_time() {
    return std::chrono::duration_cast<std::chrono::seconds>(
               std::chrono::system_clock::now().time_since_epoch())
        .count();
}

float Coconut_area(demo::Coconut *d) {
    return d->getRadius() * d->getRadius() * 3.14F;
}

bool Coconut_weight(se::State &s) {
    s.rval().setFloat(88.8);
    return true;
}

demo::Coconut *Coconut_create(int, int, int, int) {
    return new demo::Coconut();
}

class CoconutExt : public demo::Coconut {
public:
    using Coconut::Coconut;
};

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
            .constructor(&Coconut_create)
            .property("radius", &demo::Coconut::getRadius, nullptr)
            .property("radius2", nullptr, &demo::Coconut::setRadius)
            .function("combine", &demo::Coconut::combine)
            .function("combine1", &demo::Coconut::combine1)
            .function("combine2", &demo::Coconut::combine2)
            .function("combine3", &demo::Coconut::combine3)
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
            .staticFunction("log", &WriteLog)
            .install(globalThis);
    }

    sebind::class_<CoconutExt> coconutExtClass("CoconutExt", fruitClass.prototype());
    {
        coconutExtClass.constructor<sebind::ThisObject>()
            .staticProperty("time", &Coconut_time, nullptr)
            .staticFunction("getTime", &Coconut_time)
            .staticFunction("staticGetWeight", &Coconut_weight)
            .property("area", &Coconut_area, nullptr)
            .function("getArea", &Coconut_area)
            .property("weight", &Coconut_weight, &Coconut_weight)
            .function("getWeight", &Coconut_weight)
            .finalizer([](CoconutExt *) {

            })
            .install(ns);
    }

    return true;
}
