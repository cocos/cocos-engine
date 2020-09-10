#if $current_class is None or not $current_class.is_getter_or_setter($func_name)
SE_DECLARE_FUNC(js_${generator.prefix}_${class_name}_${func_name});
#end if