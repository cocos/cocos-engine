#include "DefineMap.h"
namespace cc {
namespace pipeline {
DefineMap::DefineMap() {
    _jsbMacros = se::Object::createPlainObject();
    _jsbMacros->root();
    _jsbMacros->incRef();
}

DefineMap::~DefineMap() {
    _jsbMacros->decRef();
    _jsbMacros->unroot();
}
} // namespace pipeline
} // namespace cc
