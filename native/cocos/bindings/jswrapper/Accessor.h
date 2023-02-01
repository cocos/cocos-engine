#pragma once

#include "SeApi.h"
#include "Value.h"
#include "base/Assertf.h"
#include "v8/Object.h"
#include "v8/ScriptEngine.h"

#include "../manual/jsb_conversions.h"

#include <array>

namespace se {

namespace accessor {

template <typename T>

se::Value n2se(T &&value) {
    se::Value result;
    auto ok = nativevalue_to_se(std::forward<T>(value), result, nullptr);
    return ok ? result : se::Value{};
}

template <typename... ARGS>
se::Value invoke(se::Object *target, const char *fnName, ARGS... args) {
    se::AutoHandleScope scope;
    se::Value ret;
    std::array<se::Value, sizeof...(ARGS)> seArgs{n2se(args)...};
    se::ScriptEngine::getInstance()->callFunction(target, fnName, seArgs.size(), seArgs.data(), &ret);
    return ret;
}

template <typename... ARGS>
se::Value invoke(const se::Value &target, const char *fnName, ARGS &&... args) {
    return invoke(target.toObject(), fnName, std::forward<ARGS>(args)...);
}

se::Value globalPath(const std::string &path);

template <typename... ARGS>
se::Value invokeGlobal(const std::string &objectPath, const std::string &fnName, ARGS &&... args) {
    se::Value target = globalPath(objectPath);
    assert(target.isObject());
    return invoke(target.toObject(), fnName.c_str(), std::forward<ARGS>(args)...);
}

} // namespace accessor
} // namespace se