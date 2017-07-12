#pragma once

namespace se {
    class Object;
    class Class;
}

extern se::Object* __jsb_Node_proto;
extern se::Class* __jsb_Node_class;

bool jsb_register_Node_manual(se::Object* global);
