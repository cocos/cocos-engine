## ===== constructor function implementation template

SE_DECLARE_FINALIZE_FUNC(js_${underlined_class_name}_finalize)

static bool ${signature_name}(se::State& s)
{
#if $is_skip_constructor
    //#1 ${namespaced_class_name}: is_skip_construtor ${is_skip_constructor}
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"${namespaced_class_name} constructor is skipped\")");
    return false;
#else
    CC_UNUSED bool ok = true;
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
            #while $count < $arg_idx
                #set $arg = $func.arguments[$count]
                #set $arg_type = arg.to_string($generator)
                    #if $arg.is_numeric
            ${arg_type} arg${count} = 0;
                    #elif $arg.is_pointer
            ${arg_type} arg${count} = nullptr;
                    #else
            ${arg_type} arg${count};
                    #end if
            ${arg.to_native({"generator": $generator,
                             "arg" : $arg,
                             "arg_type": $arg_type,
                             "in_value": "args[" + str(count) + "]",
                             "out_value": "arg" + str(count),
                             "class_name": $class_name,
                             "level": 3,
                             "is_static": False,
                             "is_persistent": $is_persistent,
                             "ntype": str($arg)})};
                #set $arg_array += ["arg"+str(count)]
                #set $count = $count + 1
                #if $arg_idx > 0
            if (!ok) { ok = true; break; }
                #end if
            #end while
        #end if
        #if len($arg_array) == 0
        #set $arg_list=""
        #else
        #set $arg_list = ", " + ", ".join($arg_array)
        #end if
            ${namespaced_class_name}* cobj = JSB_ALLOC(${namespaced_class_name}$arg_list);
            s.thisObject()->setPrivateData(cobj);
            #if not $is_ref_class
            se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
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
#end if
}
SE_BIND_CTOR(${signature_name}, __jsb_${underlined_class_name}_class, js_${underlined_class_name}_finalize)
