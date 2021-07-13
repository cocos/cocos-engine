#set has_constructor = False
#set generator = $current_class.generator
#set methods = $current_class.methods_clean()
#set st_methods = $current_class.static_methods_clean()
#set public_fields = $current_class.public_fields
#if $current_class.is_struct
#set has_constructor = True
${current_class.generate_struct_constructor()}
#elif 'constructor' in $current_class.methods
#set has_constructor = True
#set constructor = $current_class.methods.constructor
${current_class.methods.constructor.generate_code($current_class)}
#end if

#if $generator.in_listed_extend_classed($current_class.class_name) and $has_constructor
#if not $constructor.is_overloaded
    ${constructor.generate_code($current_class, None, False, True)}
#else
    ${constructor.generate_code($current_class, False, True)}
#end if
#end if

#if not $current_class.is_abstract
static bool js_${current_class.underlined_class_name}_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    #if $current_class.rename_destructor is None
    #if $current_class.is_ref_class
    auto* cobj =SE_THIS_OBJECT<${current_class.namespaced_class_name}>(s);
    cobj->release();
    #else
        #if not $current_class.is_class_owned_by_cpp
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<${current_class.namespaced_class_name}>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<${current_class.namespaced_class_name}>(s);
        JSB_FREE(cobj);
    }
        #end if
    #end if
    #else
    // destructor is skipped
    #end if
    return true;
}
SE_BIND_FINALIZE_FUNC(js_${current_class.underlined_class_name}_finalize)
#end if
#if $current_class.rename_destructor is not None

static bool js_${current_class.underlined_class_name}_${current_class.rename_destructor}(se::State& s) // NOLINT(readability-identifier-naming)
{
    #if $current_class.is_ref_class
    auto* cobj = SE_THIS_OBJECT<${current_class.namespaced_class_name}>(s);
    cobj->release();
    #else
        #if not $current_class.is_class_owned_by_cpp
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<${current_class.namespaced_class_name}>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<${current_class.namespaced_class_name}>(s);
        JSB_FREE(cobj);
    }
        #end if
    #end if
    auto objIter = se::NativePtrToObjectMap::find(SE_THIS_OBJECT<${current_class.namespaced_class_name}>(s));
    if(objIter != se::NativePtrToObjectMap::end())
    {
        objIter->second->clearPrivateData(true);
    }
    return true;
}
SE_BIND_FUNC(js_${current_class.underlined_class_name}_${current_class.rename_destructor})
#end if

bool js_register_${generator.prefix}_${current_class.class_name}(se::Object* obj) // NOLINT(readability-identifier-naming)
{
#if has_constructor
    #if len($current_class.parents) > 0
    auto* cls = se::Class::create("${current_class.target_class_name}", obj, __jsb_${current_class.parents[0].underlined_class_name}_proto, _SE(js_${generator.prefix}_${current_class.class_name}_constructor));
    #else
    auto* cls = se::Class::create("${current_class.target_class_name}", obj, nullptr, _SE(js_${generator.prefix}_${current_class.class_name}_constructor));
    #end if
#else
    #if len($current_class.parents) > 0
    auto* cls = se::Class::create("${current_class.target_class_name}", obj, __jsb_${current_class.parents[0].underlined_class_name}_proto, nullptr);
    #else
    auto* cls = se::Class::create("${current_class.target_class_name}", obj, nullptr, nullptr);
    #end if
#end if

#for m in public_fields
    #if  $current_class.should_export_field(m.name)
    cls->defineProperty("${m.name}", _SE(${m.signature_name}_get_${m.name}), _SE(${m.signature_name}_set_${m.name}));
    #end if
#end for
#for m in $current_class.getter_setter
    #set tmp_getter = "nullptr" if m["getter"] is None else "_SE(" + m["getter"].signature_name + ")"
    #set tmp_setter = "nullptr" if m["setter"] is None else "_SE(" + m["setter"].signature_name + ")"
    cls->defineProperty("${m.name}", ${tmp_getter}, ${tmp_setter});
#end for
#for m in methods
    #if not $current_class.skip_bind_function(m)
    #set fn = m['impl']
    cls->defineFunction("${m['name']}", _SE(${fn.signature_name}));
    #end if
#end for
#if $generator.in_listed_extend_classed($current_class.class_name) and $has_constructor
    cls->defineFunction("ctor", _SE(js_${generator.prefix}_${current_class.class_name}_ctor));
#end if
#if $current_class.rename_destructor is not None
    cls->defineFunction("${current_class.rename_destructor}", _SE(js_${current_class.underlined_class_name}_${current_class.rename_destructor}));
#end if
#if len(st_methods) > 0
    #for m in st_methods
    #set fn = m['impl']
    cls->defineStaticFunction("${m['name']}", _SE(${fn.signature_name}));
    #end for
#end if
#if not $current_class.is_abstract
    cls->defineFinalizeFunction(_SE(js_${current_class.underlined_class_name}_finalize));
#end if
    cls->install();
    JSBClassType::registerClass<${current_class.namespaced_class_name}>(cls);

    __jsb_${current_class.underlined_class_name}_proto = cls->getProto();
    __jsb_${current_class.underlined_class_name}_class = cls;

#if $generator.in_listed_extend_classed($current_class.class_name) and not $current_class.is_abstract
    jsb_set_extend_property("${generator.target_ns}", "${current_class.target_class_name}");
#end if
    se::ScriptEngine::getInstance()->clearException();
    return true;
}
