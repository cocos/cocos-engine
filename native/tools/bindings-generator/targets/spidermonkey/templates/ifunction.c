## ===== instance function implementation template

static bool ${signature_name}(se::State& s)
{
    ${namespaced_class_name}* cobj = (${namespaced_class_name}*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "${signature_name} : Invalid Native Object");
#if len($arguments) >= $min_args
    const auto& args = s.args();
    size_t argc = args.size();
    #set arg_count = len($arguments)
    #set arg_idx = $min_args
    #if $arg_count > 0 or $ret_type.name != "void"
    CC_UNUSED bool ok = true;
    #end if
    #while $arg_idx <= $arg_count
    if (argc == ${arg_idx}) {
        #set $count = 0
        #set arg_conv_array = []
        #while $count < $arg_idx
            #set $arg = $arguments[$count]
            #set $arg_type = $arg.to_string($generator)
            #set conv_txt= $arg.to_native({"generator": $generator,\
                             "arg" : $arg, \
                             "arg_type": $arg_type, \
                             "in_value": "args[" + str(count) + "]", \
                             "out_value": "arg" + str(count),   \
                             "class_name": $class_name,\
                             "level": 2, \
                             "is_static": False, \
                             "is_persistent": $is_persistent, \
                             "ntype": str($arg)}) 
            #set arg_conv_array += [$conv_txt]
            #if "seval_to_reference" in $conv_txt
        $arg_type* arg${count} = nullptr;
            #elif $arg.is_numeric
        $arg_type arg${count} = 0;
            #elif $arg.is_pointer
        $arg_type arg${count} = nullptr;
            #else
        $arg_type arg${count};
            #end if
            #set $count = $count + 1
        #end while
        #set $count = 0
        #set arg_list = ""
        #set arg_array = []
        #while $count < $arg_idx
            #set $arg = $arguments[$count]
            #set $arg_type = $arg.to_string($generator)
        $arg_conv_array[$count];
            #if "seval_to_reference" in $arg_conv_array[$count]
                #set $arg_array += ["*arg"+str(count)]
            #else
                #set $arg_array += ["arg"+str(count)]
            #end if
            #set $count = $count + 1
        #end while
        #if $arg_idx > 0
        SE_PRECONDITION2(ok, false, "${signature_name} : Error processing arguments");
        #end if
        #set $arg_list = ", ".join($arg_array)
        #if $ret_type.name != "void"
            #if $ret_type.is_enum
        $ret_type.enum_declare_type result = ($ret_type.enum_declare_type)cobj->${func_name}($arg_list);
            #else
        ${ret_type.get_whole_name($generator)} result = cobj->${func_name}($arg_list);
            #end if
        ${ret_type.from_native({"generator": $generator,
                                    "in_value": "result",
                                    "out_value": "s.rval()",
                                    "class_name": $ret_type.get_class_name($generator),
                                    "ntype": str($ret_type),
                                    "level": 2})};
        SE_PRECONDITION2(ok, false, "${signature_name} : Error processing arguments");
        #else
        cobj->${func_name}($arg_list);
        #end if
        return true;
    }
        #set $arg_idx = $arg_idx + 1
    #end while
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, $arg_count);
#end if
    return false;
}
#if $current_class is not None and $current_class.is_getter_method($func_name)
SE_BIND_PROP_GET(${signature_name})
#elif $current_class is not None and $current_class.is_setter_method($func_name)
SE_BIND_PROP_SET(${signature_name})
#else
SE_BIND_FUNC(${signature_name})
#end if
