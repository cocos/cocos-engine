#set generator = $current_class.generator
#if len($current_class.module_config) > 0
\#if $current_class.module_config[0]
#end if
se::Object* __jsb_${current_class.underlined_class_name}_proto = nullptr; // NOLINT
se::Class* __jsb_${current_class.underlined_class_name}_class = nullptr;  // NOLINT
