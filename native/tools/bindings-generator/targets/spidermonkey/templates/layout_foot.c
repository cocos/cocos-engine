bool register_all_${prefix}(se::Object* obj)    // NOLINT
{
#if $target_ns
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("${target_ns}", &nsVal, true))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("${target_ns}", nsVal);
    }
    se::Object* ns = nsVal.toObject();
#else 
    // Get the global ns
    se::Object* ns = se::ScriptEngine::getInstance()->getGlobalObject();
#end if

#for jsclass in $sorted_classes
    #if $in_listed_classes(jsclass.class_name)
    #if len($jsclass.module_config) > 0
    \#if $jsclass.module_config[0]
    #end if
    js_register_${prefix}_${jsclass.nested_class_name}(ns);
    #if len($jsclass.module_config) > 0
    \#endif // $jsclass.module_config[0]
    #end if
    #end if
#end for
    return true;
}

#if $macro_judgement
\#endif //$macro_judgement
#end if
// clang-format on