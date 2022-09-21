## ===== member implementation template

static bool ${signature_name}_get_${name}(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<${namespaced_class_name}>(s);
    // SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    if (nullptr == cobj) return true;

    CC_UNUSED bool ok = true;
    se::Value jsret;
    #if $ntype.is_object and not $ntype.object_can_convert($generator, False)
    ${ntype.from_native({"generator": $generator,
                         "type_name": $ntype.namespaced_class_name.replace("*", ""),
                         "ntype": $ntype.get_whole_name($generator),
                         "level": 2,
                         "in_value": "cobj->" + $pretty_name,
                         "out_value": "jsret",
                         "context" :  "s.thisObject()"
                        })};
    #else
    ${ntype.from_native({"generator": $generator,
                         "type_name": $ntype.namespaced_class_name.replace("*", ""),
                         "ntype": $ntype.get_whole_name($generator),
                         "level": 2,
                         "scriptname": $generator.scriptname_from_native($ntype.namespaced_class_name, $ntype.namespace_name),
                         "in_value":"cobj->" + $pretty_name,
                         "out_value": "jsret",
                         "context" :  "s.thisObject()"
                         })};
    #end if
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->${pretty_name}, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(${signature_name}_get_${name})

static bool ${signature_name}_set_${name}(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<${namespaced_class_name}>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    CC_UNUSED bool ok = true;
    #set $arg_type = $ntype.to_string($generator)
#if $ntype.is_object and not $ntype.object_can_convert($generator)
    #set conv_text = $ntype.to_native({"generator": $generator, \
                        "arg_idx": 2, \
                        "arg_type": $arg_type, \
                        "ntype": $ntype.get_whole_name($generator), \
                        "in_value": "args[0]", \
                        "out_value": "cobj->"+$pretty_name, \
                        "func_name": $name, \
                        "level": 2, \
                        "arg":$ntype, \
                        "context" :  "s.thisObject()" \
                    })
#else
    #set conv_text = $ntype.to_native({"generator": $generator, \
                        "arg_idx": 2, \
                        "arg_type": $arg_type, \
                        "in_value": "args[0]", \
                        "out_value": "cobj->"+$pretty_name, \
                        "func_name": $name, \
                        "scriptname": $generator.scriptname_from_native($ntype.namespaced_class_name, $ntype.namespace_name), \
                        "level": 2, \
                        "arg":$ntype, \
                        "context" :  "s.thisObject()" \
                    })
#end if
    $conv_text;
    SE_PRECONDITION2(ok, false, "Error processing new value");
    return true;
}
SE_BIND_PROP_SET(${signature_name}_set_${name})
