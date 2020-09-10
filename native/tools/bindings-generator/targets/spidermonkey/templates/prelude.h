#set generator = $current_class.generator

extern se::Object* __jsb_${current_class.underlined_class_name}_proto;
extern se::Class* __jsb_${current_class.underlined_class_name}_class;

bool js_register_${current_class.underlined_class_name}(se::Object* obj);
bool register_all_${generator.prefix}(se::Object* obj);
