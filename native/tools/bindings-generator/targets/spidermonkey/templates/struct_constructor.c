## ===== struct constructor function implementation template

SE_DECLARE_FINALIZE_FUNC(js_${underlined_class_name}_finalize)

static bool ${struct_constructor_name}(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        ${namespaced_class_name}* cobj = JSB_ALLOC(${namespaced_class_name});
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    #if len($public_fields) > 1
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        ${namespaced_class_name}* cobj = JSB_ALLOC(${namespaced_class_name});
        #set arg_idx = 0
        #set conv_text_array = []
        #for field in $public_fields
        #set field_type = field.ntype.to_string($generator)
        #set conv_text = $field.ntype.to_native({"generator": $generator, \
                             "arg" : $field.ntype, \
                             "arg_type": $field_type, \
                             "in_value": "field", \
                             "out_value": "arg" + str(arg_idx), \
                             "class_name": $class_name, \
                             "level": 3, \
                             "is_static": False, \
                             "is_pointer": $field.ntype.is_pointer, \
                             "is_persistent": $is_persistent, \
                             "ntype": str($field_type)})
        #set conv_text_array += [$conv_text]
            #if "seval_to_reference" in $conv_text
        ${field_type}* arg${arg_idx} = nullptr;
            #elif $field.ntype.is_numeric
        ${field_type} arg${arg_idx} = 0;
            #elif $field.ntype.is_pointer
        ${field_type} arg${arg_idx} = nullptr;
            #else
        ${field_type} arg${arg_idx};
            #end if
        json->getProperty("${field.name}", &field);
        if(!field.isUndefined()) {
            $conv_text;
            #if "seval_to_reference" in $conv_text_array[$arg_idx]
            cobj->${field.name} = *arg${arg_idx};
            #else
            cobj->${field.name} = arg${arg_idx};
            #end if
        }
        #set $arg_idx = $arg_idx + 1
        #end for 

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    #end if
    else
    {
        ${namespaced_class_name}* cobj = JSB_ALLOC(${namespaced_class_name});
        #set arg_idx = 0
        #set conv_text_array = []
        #for field in $public_fields
        #set field_type = field.ntype.to_string($generator)
        #set conv_text = $field.ntype.to_native({"generator": $generator, \
                             "arg": $field.ntype, \
                             "arg_type": $field_type, \
                             "in_value": "args[" + str(arg_idx) + "]", \
                             "out_value": "arg" + str(arg_idx), \
                             "class_name": $class_name, \
                             "level": 3, \
                             "is_static": False, \
                             "is_pointer": $field.ntype.is_pointer, \
                             "is_persistent": $is_persistent, \
                             "ntype": str($field_type)})
        #set conv_text_array += [$conv_text]
            #if "seval_to_reference" in $conv_text_array[$arg_idx]
        ${field_type}* arg${arg_idx} = nullptr;
            #elif $field.ntype.is_numeric
        ${field_type} arg${arg_idx} = 0;
            #elif $field.ntype.is_pointer
        ${field_type} arg${arg_idx} = nullptr;
            #else
        ${field_type} arg${arg_idx};
            #end if
        if (!args[${arg_idx}].isUndefined()) {
            $conv_text;
            #if "seval_to_reference" in $conv_text_array[$arg_idx]
            cobj->${field.name} = *arg${arg_idx};
            #else
            cobj->${field.name} = arg${arg_idx};
            #end if
        }
        #set $arg_idx = $arg_idx + 1
        #end for 

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(${struct_constructor_name}, __jsb_${underlined_class_name}_class, js_${underlined_class_name}_finalize)
