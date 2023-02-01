#pragma once

#include "../manual/jsb_conversions.h"
//#include "v8/Object.h"
//#include "v8/ScriptEngine.h"

namespace se {

class Object;
class HasJSThisObject {
public:
    se::Object *getJSThis() const;
    void bindJSThis(void *);

    template <typename T>
    T getJSProperty(const char *key) const;
    template <typename T>
    void setJSProperty(const char *key, T &&);

private:
    mutable se::Object *_thisObject{nullptr};
};

template <typename T>
T HasJSThisObject::getJSProperty(const char *key) const {
    se::AutoHandleScope scope;
    se::Value ret;
    getJSThis()->getProperty(key, &ret);
    T nativeObj{};
    sevalue_to_native(ret, &nativeObj, nullptr);
    return nativeObj;
}

template <typename T>
void HasJSThisObject::setJSProperty(const char *key, T &&value) {
    se::AutoHandleScope scope;
    se::Value ret;
    nativevalue_to_se(value, ret, nullptr);
    getJSThis()->setProperty(key, ret);
}

} // namespace se
