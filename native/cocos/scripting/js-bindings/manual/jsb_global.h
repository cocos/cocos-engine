#pragma once

namespace se {
    class Object;
    class Class;
}

extern se::Object* __ccObj;
extern se::Object* __jsbObj;

bool jsb_register_global_variables(se::Object* global);
