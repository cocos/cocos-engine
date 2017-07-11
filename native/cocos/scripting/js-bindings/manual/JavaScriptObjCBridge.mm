#include "JavaScriptObjCBridge.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

#include <string>
#include <vector>

// @interface NativeOcClass : NSObject 
// {

// }
// @end

// @implementation NativeOcClass

// +(BOOL)callNativeUIWithTitle:(NSString *) title andContent:(NSString *)content{
//     NSLog(@"callNativeUIWithTitle: title:%@, content:%@", title, content);
//     return YES;
// }

// @end

#define JSO_ERR_OK                 (0)
#define JSO_ERR_TYPE_NOT_SUPPORT   (-1)
#define JSO_ERR_INVALID_AEGUMENTS  (-2)
#define JSO_ERR_METHOD_NOT_FOUND   (-3)
#define JSO_ERR_EXCEPTION_OCCURRED (-4)
#define JSO_ERR_CLASS_NOT_FOUND    (-5)
#define JSO_ERR_VM_FAILURE         (-6)

class JavaScriptObjCBridge
{
public:
    typedef enum : char
    {
        TypeInvalid = -1,
        TypeVoid    = 0,
        TypeInteger = 1,
        TypeFloat   = 2,
        TypeBoolean = 3,
        TypeString  = 4,
        TypeVector  = 5,
        TypeFunction= 6,
    } ValueType;

    typedef std::vector<ValueType> ValueTypes;

    typedef union
    {
        int     intValue;
        float   floatValue;
        int     boolValue;
        std::string *stringValue;
    } ReturnValue;

    class CallInfo
    {
    public:
        CallInfo(const char *className, const char *methodName)
        :m_valid(false)
        ,m_error(JSO_ERR_OK)
        ,m_argumentsCount(0)
        ,m_methodName(methodName)
        ,m_className(className)
        ,m_returnType(TypeVoid)
        {
        }

        ~CallInfo(void);
        bool isValid(void) {
            return m_valid;
        }

        int getErrorCode(void) {
            return m_error;
        }
        ValueType getReturnValueType(){
            return m_returnType;
        }
        ReturnValue getReturnValue(){
            return m_ret;
        }
        bool execute(const se::ValueArray& argv, unsigned argc);
    private:
        bool m_valid;
        int m_error;
        int m_argumentsCount;
        std::string m_className;
        std::string m_methodName;
        ValueTypes m_argumentsType;
        ValueType m_returnType;
        ReturnValue m_ret;
        std::string m_retjstring;
        void pushValue(void *val);
    };
    static se::Value convertReturnValue(ReturnValue retValue, ValueType type);
};

JavaScriptObjCBridge::CallInfo::~CallInfo(void)
{
    if (m_returnType == TypeString)
    {
        delete m_ret.stringValue;
    }
}

se::Value JavaScriptObjCBridge::convertReturnValue(ReturnValue retValue, ValueType type)
{
    se::Value ret;

    switch (type)
    {
        case TypeInteger:
            ret.setInt32(retValue.intValue);
            break;
        case TypeFloat:
            ret.setFloat(retValue.floatValue);
            break;
        case TypeBoolean:
            ret.setBoolean(retValue.boolValue);
            break;
        case TypeString:
            ret.setString(*retValue.stringValue);
            break;
        default:
            break;
    }

    return ret;
}

bool JavaScriptObjCBridge::CallInfo::execute(const se::ValueArray& argv, unsigned argc)
{
    NSString *className =[NSString stringWithCString: m_className.c_str() encoding:NSUTF8StringEncoding];
    NSString *methodName = [NSString stringWithCString: m_methodName.c_str() encoding:NSUTF8StringEncoding];

    NSMutableDictionary *m_dic = [NSMutableDictionary dictionary];
    for(int i = 2; i < argc; i++)
    {
        const auto& arg = argv[i];
        NSString *key = [NSString stringWithFormat:@"argument%d" ,i-2];

        if(arg.isObject() || arg.isObject())
        {
            m_dic = NULL;
            m_error = JSO_ERR_TYPE_NOT_SUPPORT;
            return false;
        }
        else if(arg.isString())
        {
            [m_dic setObject:[NSString stringWithCString:arg.toString().c_str() encoding:NSUTF8StringEncoding] forKey:key];
        }
        else if(arg.isNumber())
        {
            double a = arg.toNumber();
            [m_dic setObject:[NSNumber numberWithFloat:a] forKey:key];
        }
        else if(arg.isBoolean())
        {
            bool a = arg.toBoolean();
            [m_dic setObject:[NSNumber numberWithBool:a] forKey:key];
        }
    }

    if(!className || !methodName)
    {
        m_error = JSO_ERR_INVALID_AEGUMENTS;
        return false;
    }

    Class targetClass = NSClassFromString(className);
    if(!targetClass)
    {
        m_error = JSO_ERR_CLASS_NOT_FOUND;
        return false;
    }
    SEL methodSel;
    methodSel = NSSelectorFromString(methodName);
    if (!methodSel)
    {
        m_error = JSO_ERR_METHOD_NOT_FOUND;
        return false;
    }
    methodSel = NSSelectorFromString(methodName);
    NSMethodSignature *methodSig = [targetClass methodSignatureForSelector:(SEL)methodSel];
    if (methodSig == nil)
    {
        m_error =  JSO_ERR_METHOD_NOT_FOUND;
        return false;
    }
    @try
    {
        NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:methodSig];
        [invocation setTarget:targetClass];
        [invocation setSelector:methodSel];
        if(m_dic != nil)
        {
            for(int i = 2;i<m_dic.count+2;i++)
            {
                id obj = [m_dic objectForKey:[NSString stringWithFormat:@"argument%d",i-2] ];

                if ([obj isKindOfClass:[NSNumber class]] &&
                    ((strcmp([obj objCType], "c") == 0 || strcmp([obj objCType], "B") == 0))) //BOOL
                {
                    bool b = [obj boolValue];
                    [invocation setArgument:&b atIndex:i];
                }
                else
                {
                    [invocation setArgument:&obj atIndex:i];
                }
            }
        }
        NSUInteger returnLength = [methodSig methodReturnLength];
        const char *returnType = [methodSig methodReturnType];
        [invocation invoke];

        if (returnLength >0)
        {
            if (strcmp(returnType, "@") == 0)
            {
                id ret;
                [invocation getReturnValue:&ret];
                pushValue(ret);
            }
            else if (strcmp(returnType, "c") == 0 || strcmp(returnType, "B") == 0) // BOOL
            {
                char ret;
                [invocation getReturnValue:&ret];
                m_ret.boolValue = ret;
                m_returnType = TypeBoolean;
            }
            else if (strcmp(returnType, "i") == 0) // int
            {
                int ret;
                [invocation getReturnValue:&ret];
                m_ret.intValue = ret;
                m_returnType = TypeInteger;
            }
            else if (strcmp(returnType, "f") == 0) // float
            {
                float ret;
                [invocation getReturnValue:&ret];
                m_ret.floatValue = ret;
                m_returnType = TypeFloat;
            }
            else
            {
                m_error = JSO_ERR_TYPE_NOT_SUPPORT;
                NSLog(@"not support return type = %s", returnType);
                return false;
            }
        }
        else
        {
            m_returnType = TypeVoid;
        }
    }@catch(NSException *exception)
    {
        NSLog(@"EXCEPTION THROW: %@", exception);
        m_error = JSO_ERR_EXCEPTION_OCCURRED;
        return false;
    }

    return true;
}

void JavaScriptObjCBridge::CallInfo::pushValue(void *val)
{
    id oval = (id)val;
    if (oval == nil)
    {
        return;
    }
    else if ([oval isKindOfClass:[NSNumber class]])
    {
        NSNumber *number = (NSNumber *)oval;
        const char *numberType = [number objCType];
        if (strcmp(numberType, @encode(BOOL)) == 0)
        {
            m_ret.boolValue = [number boolValue];
            m_returnType = TypeBoolean;
        }
        else if (strcmp(numberType, @encode(int)) == 0)
        {
            m_ret.intValue = [number intValue];
            m_returnType = TypeInteger;
        }
        else
        {
            m_ret.floatValue = [number floatValue];
            m_returnType = TypeFloat;
        }
    }
    else if ([oval isKindOfClass:[NSString class]])
    {
        const char *content = [oval cStringUsingEncoding:NSUTF8StringEncoding];
        m_ret.stringValue = new (std::nothrow) std::string(content);
        m_returnType = TypeString;
    }
    else if ([oval isKindOfClass:[NSDictionary class]])
    {

    }
    else
    {
        const char *content = [[NSString stringWithFormat:@"%@", oval] cStringUsingEncoding:NSUTF8StringEncoding];
        m_ret.stringValue =  new std::string(content);
        m_returnType = TypeString;
    }
}

se::Class* __jsb_JavaScriptObjCBridge_class = nullptr;

static bool JavaScriptObjCBridge_finalize(se::State& s)
{
    JavaScriptObjCBridge* cobj = (JavaScriptObjCBridge*)s.nativeThisObject();
    delete cobj;
    return true;
}
SE_BIND_FINALIZE_FUNC(JavaScriptObjCBridge_finalize)

static bool JavaScriptObjCBridge_constructor(se::State& s)
{
    JavaScriptObjCBridge* cobj = new (std::nothrow) JavaScriptObjCBridge();
    s.thisObject()->setPrivateData(cobj);
    s.thisObject()->addRef(); //FIXME: remove this
    return true;
}
SE_BIND_CTOR(JavaScriptObjCBridge_constructor, __jsb_JavaScriptObjCBridge_class, JavaScriptObjCBridge_finalize)

static bool JavaScriptObjCBridge_callStaticMethod(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc >= 2)
    {
        bool ok = false;
        std::string clsName, methodName;
        ok = seval_to_std_string(args[0], &clsName);
        JSB_PRECONDITION2(ok, false, "Converting class name failed!");

        ok = seval_to_std_string(args[1], &methodName);
        JSB_PRECONDITION2(ok, false, "Converting method name failed!");

        JavaScriptObjCBridge::CallInfo call(clsName.c_str(), methodName.c_str());
        ok = call.execute(args, argc);
        if(!ok)
        {
            SE_REPORT_ERROR("call result code: %d", call.getErrorCode());
            return false;
        }
        s.rval() = JavaScriptObjCBridge::convertReturnValue(call.getReturnValue(), call.getReturnValueType());

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting >=2", argc);
    return false;
}
SE_BIND_FUNC(JavaScriptObjCBridge_callStaticMethod)

bool register_javascript_objc_bridge(se::Object* obj)
{
    se::Class* cls = se::Class::create("JavaScriptObjCBridge", obj, nullptr, _SE(JavaScriptObjCBridge_constructor));
    cls->defineFinalizedFunction(_SE(JavaScriptObjCBridge_finalize));

    cls->defineFunction("callStaticMethod", _SE(JavaScriptObjCBridge_callStaticMethod));

    cls->install();
    __jsb_JavaScriptObjCBridge_class = cls;

    se::ScriptEngine::getInstance()->clearException();

    return true;
}
