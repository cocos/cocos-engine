do {
    if (${in_value}.isObject() && ${in_value}.toObject()->isFunction())
    {
        se::Value jsThis(s.thisObject());
        se::Value jsFunc(${in_value});
        #if $is_static or $is_persistent
        jsFunc.toObject()->root();
        #else
        jsThis.toObject()->attachObject(jsFunc.toObject());
        #end if
        auto lambda = [=](${lambda_parameters}) -> ${ret_type.name} {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            #set arg_count = len($param_types)
            #if $arg_count > 0 or $ret_type.name != "void"
            CC_UNUSED bool ok = true;
            #end if
            #if $arg_count > 0
            se::ValueArray args;
            args.resize($arg_count);
            #end if
            #set $count = 0
            #while $count < $arg_count
                #set $arg = $param_types[$count]
                #set $arg_type = $arg.to_string($generator)
            ${arg.from_native({"generator": $generator,
                                 "arg_type": $arg_type,
                                 "in_value": "larg" + str(count),
                                 "out_value": "args[" + str(count) + "]",
                                 "class_name": $class_name,
                                 "level": 2,
                                 "ntype": str($arg)})};
                #set $count = $count + 1
            #end while
            se::Value rval;
            se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
            se::Object* funcObj = jsFunc.toObject();
            #if $arg_count > 0
            bool succeed = funcObj->call(args, thisObj, &rval);
            #else
            bool succeed = funcObj->call(se::EmptyValueArray, thisObj, &rval);
            #end if
            if (!succeed) {
                se::ScriptEngine::getInstance()->clearException();
            }
            #if $ret_type.name != "void"
            #set $ret_type_name = $ret_type.get_whole_name($generator)
            $ret_type_name result;
            ${ret_type.to_native({"generator": $generator,
                                 "arg_type": $ret_type_name,
                                 "in_value": "rval",
                                 "out_value": "result",
                                 "ntype": str($ret_type),
                                 "level": 2})};
            SE_PRECONDITION2(ok, result, "lambda function : Error processing return value with type ${ret_type.name}");
            return result;
            #end if
        };
        ${out_value}.data = lambda;
    }
    else
    {
        ${out_value}.data = nullptr;
    }
} while(false)
