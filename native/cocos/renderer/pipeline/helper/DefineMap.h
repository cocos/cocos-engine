#pragma once

#include "base/Value.h"
#include "core/CoreStd.h"

namespace cc {
namespace pipeline {

class CC_DLL DefineMap final : public Object {
public:
    DefineMap() = default;

    const Value &getValue(const String &name) const {
        if (_values.count(name) == 0)
            return Value::Null;

        return _values.at(name);
    }

    template <class T, class RET = void>
    ENABLE_IF_T3_RET(float, bool, String)
    setValue(const String &name, const T &value) {
        _values[name] = value;
    }

private:
    map<String, Value> _values;
};

} // namespace pipeline
} // namespace cc
