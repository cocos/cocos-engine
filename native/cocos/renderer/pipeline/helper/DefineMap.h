#pragma once

#include "../../core/CoreStd.h"
#include "base/Macros.h"
#include "cocos/bindings/jswrapper/Object.h"

using namespace std;
namespace cc {
namespace pipeline {

class CC_DLL DefineMap final : public Object {
public:
    DefineMap();
    ~DefineMap();

    CC_INLINE se::Object *getObject() const { return _jsbMacros; }
    CC_INLINE void getValue(const String &name, se::Value *value) const { _jsbMacros->getProperty(name.c_str(), value); }

    template <class T, class RET = void>
    ENABLE_IF_T3_RET(float, bool, String)
    setValue(const String &name, const T &value) { se::Value v(value); _jsbMacros->setProperty(name.c_str(), v); }

private:
    se::Object *_jsbMacros = nullptr;
};

} // namespace pipeline
} // namespace cc
