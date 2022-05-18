#include "sebind_fruits.h"

#include "bindings/sebind/intl/common.h"
#include "bindings/sebind/sebind.h"
#include "tests/sebind-tests/common/Classes/demo/Coconut.h"
#include "tests/sebind-tests/common/Classes/demo/Fruit.h"

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
            .property("sweetness", &demo::Fruit::getSweetness, &demo::Fruit::setSweetness)
            .property("price", &demo::Fruit::getPrice, nullptr)
            .install(ns);
    }
    sebind::class_<demo::Coconut> coconutClass("Coconut", fruitClass.prototype());
    {
        coconutClass.constructor<sebind::ThisObject>()
            .constructor<sebind::ThisObject, const std::string&, float>()
            .property("radius", &demo::Coconut::getRadius, nullptr)
            .function("combine", &demo::Coconut::combine)
            .function("callJsFunction", &demo::Coconut::callJSFunction)
            .staticFunction("OneTwoThree", &demo::Coconut::OneTwoThree)
            .staticProperty("p123", &demo::Coconut::OneTwoThree, nullptr)
            .install(ns);
    }
    return true;
}
