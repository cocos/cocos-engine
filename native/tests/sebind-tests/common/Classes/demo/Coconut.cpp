#include "Coconut.h"

namespace demo {

std::string Coconut::callJSFunction(const std::string &name) {
    if (!_jsThis) {
        return "jsThis is not set";
    }
    se::Value prop;
    _jsThis->getProperty(name, &prop);
    if (prop.isNullOrUndefined()) {
        return "function found!";
    }
    se::Value ret;
    prop.toObject()->call({}, _jsThis, &prop);
    assert(prop.isString());
    return prop.toString();
}
} // namespace demo
