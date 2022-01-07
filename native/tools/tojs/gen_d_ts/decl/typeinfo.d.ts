


declare interface NativeType {
    name: string;
    script_ns: string;
    whole_name: string;
    namespace_name: string;
    namespaced_class_name: string;
    is_const: boolean;
    is_pointer: boolean;
    is_reference: boolean;
    is_rreference: boolean;
    is_object: boolean;
    is_struct: boolean;
    is_function: boolean;
    is_enum: boolean;
    is_numeric: boolean;
    enum_declare_type: string;
    param_types: NativeType[];
    ret_type: NativeType|null;
}


declare interface NativeField {
    name: string;
    pretty_name: string;
    signature_name: string;
    type: NativeType;
    is_static: boolean;
    is_static_const:boolean;
}


declare interface NativeFunction {
    name: string;
    signature_name: string;
    arguments: NativeType[];
    argumentTips: string[];
    static: boolean;
    min_args:number;
    is_overloaded: boolean;
    is_constructor: boolean;
    not_supported: boolean;
    ret_type: NativeType;
    current_class_name: string;
    comment: string;
    should_skip_function:boolean;
}


declare interface NativeOverloadedFunction {
    name: string;
    signature_name: string;
    min_args: number;
    comment: string;
    is_ctor: boolean;
    current_class_name: string|null;
    implementations: NativeFunction[];
    should_skip_function:boolean;
}

declare interface NativeAttribute {
    name: string;
    type: NativeType;
    names: string[];
}

type MethodMap = {
    [key: string]: NativeFunction|NativeOverloadedFunction
};

declare interface NativeClass {
    namespace_name: string;
    script_ns: string;
    parents: string[];
    nested_classes: string[];
    class_name: string;
    is_ref_class: boolean;
    namespaced_class_name: string;
    underlined_class_name: string;
    is_struct: boolean;
    is_abstract: boolean;
    is_persistent: boolean;
    is_class_owned_by_cpp: boolean;
    has_constructor: boolean;
    public_fields: NativeField[];
    override_methods?: MethodMap;
    getter_setter: NativeAttribute[];
    methods: MethodMap;
    static_methods: MethodMap;
    dict_of_override_method_should_be_bound: MethodMap;
}