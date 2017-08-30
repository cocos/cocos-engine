#pragma once

#include <string>

namespace se {
    class Object;
    class Class;
}

extern se::Object* __ccObj;
extern se::Object* __jsbObj;

bool jsb_register_global_variables(se::Object* global);

bool jsb_run_script(const std::string& filePath);
