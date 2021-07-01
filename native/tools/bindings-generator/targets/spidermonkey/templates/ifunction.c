## ===== instance function implementation template

static bool ${signature_name}(se::State& s) // NOLINT(readability-identifier-naming, google-runtime-references)
{
    auto* cobj = SE_THIS_OBJECT<${namespaced_class_name}>(s);
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
        #set holder_prefix_array = []
        #while $count < $arg_idx
            #set $arg = $arguments[$count]
            #set $arg_type = $arg.to_string($generator)
            #if $arg.is_reference
            #set $holder_prefix="HolderType<"+$arg_type+", true>"
            #else
            #set $holder_prefix="HolderType<"+$arg_type+", false>"
            #end if
            #set holder_prefix_array += [$holder_prefix]
            #set conv_txt= $arg.to_native({"generator": $generator,\
                             "arg" : $arg, \
                             "arg_type": $arg_type, \
                             "in_value": "args[" + str(count) + "]", \
                             "out_value":  "arg"+str(count) , \
                             "class_name": $class_name,\
                             "level": 2, \
                             "context" : "s.thisObject()", \
                             "is_static": False, \
                             "is_persistent": $is_persistent, \
                             "ntype": str($arg)})
            #set arg_conv_array += [$conv_txt]
        $holder_prefix arg${count} = {};
            #set $count = $count + 1
        #end while
        #set $count = 0
        #set arg_list = ""
        #set arg_array = []
        #while $count < $arg_idx
            #set $arg = $arguments[$count]
            #set $arg_type = $arg.to_string($generator)
        $arg_conv_array[$count];
            #if $arg.is_rreference
            #set $arg_array += [ "std::move(arg"+str(count)+".value())"]
            #else
            #set $arg_array += [ "arg"+str(count)+".value()"]
            #end if
            #set $count = $count + 1
        #end while
        #if $arg_idx > 0
        SE_PRECONDITION2(ok, false, "${signature_name} : Error processing arguments");
        #end if
        #set $arg_list = ", ".join($arg_array)
        #if $ret_type.name != "void"
            #if $ret_type.is_enum
        auto result = static_cast<$ret_type.enum_declare_type>(cobj->${func_name}($arg_list));
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
            #if $generator.should_obtain_return_value($class_name, $func_name)
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
            #end if
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
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
