## ===== instance function implementation template - for overloaded functions

static bool ${signature_name}(se::State& s)
{
    CC_UNUSED bool ok = true;
    ${namespaced_class_name}* cobj = (${namespaced_class_name}*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "${signature_name} : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
#for func in $implementations
#if len($func.arguments) >= $func.min_args
    #set arg_count = len($func.arguments)
    #set arg_idx = $func.min_args
    #while $arg_idx <= $arg_count
    #set arg_list = ""
    #set arg_array = []
    do {
        #if $func.min_args >= 0
        if (argc == $arg_idx) {
            #set $count = 0
            #set arg_conv_array = []
            #while $count < $arg_idx
                #set $arg = $func.arguments[$count]
                #set $arg_type = $arg.to_string($generator)
                #set conv_txt =  $arg.to_native({"generator": $generator, \
                             "arg" : $arg,\
                             "arg_type": $arg_type,\
                             "in_value": "args[" + str(count) + "]",\
                             "out_value": "arg" + str(count),\
                             "class_name": $class_name,\
                             "level": 3,\
                             "is_static": False,\
                             "is_persistent": $is_persistent,\
                             "ntype": str($arg)})
                #set arg_conv_array += [$conv_txt]
                #if "seval_to_reference" in $conv_txt
            $arg_type* arg${count} = nullptr;
                #elif $arg.is_numeric
            ${arg_type} arg${count} = 0;
                #elif $arg.is_pointer
            ${arg_type} arg${count} = nullptr;
                #else
            ${arg_type} arg${count};
                #end if
            $conv_txt;            
                #if "seval_to_reference" in $conv_txt
                #set $arg_array += ["*arg"+str(count)]
                #else
                #set $arg_array += ["arg"+str(count)]
                #end if
                #set $count = $count + 1
            #if $arg_idx > 0 and arg_type != "bool"
            if (!ok) { ok = true; break; }
            #end if
            #end while
            #set $arg_list = ", ".join($arg_array)
        #end if
        #if str($func.ret_type) != "void"
            #if $func.ret_type.is_enum
            $ret_type.enum_declare_type result = ($ret_type.enum_declare_type)cobj->${func.func_name}($arg_list);
            #else
            ${func.ret_type.get_whole_name($generator)} result = cobj->${func.func_name}($arg_list);
            #end if
            ${func.ret_type.from_native({"generator": $generator,
                                                      "in_value": "result",
                                                      "out_value": "s.rval()",
                                                      "class_name": $func.ret_type.get_class_name($generator),
                                                      "ntype": str($func.ret_type),
                                                      "level": 2})};
            SE_PRECONDITION2(ok, false, "${signature_name} : Error processing arguments");
        #else
            cobj->${func.func_name}($arg_list);
        #end if
            return true;
        }
    } while(false);

    #set $arg_idx = $arg_idx + 1
    #end while
#end if
#end for
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(${signature_name})
