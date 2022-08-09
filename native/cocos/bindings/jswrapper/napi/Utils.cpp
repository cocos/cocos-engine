#include "Utils.h"
#include "CommonHeader.h"
#include "ScriptEngine.h"
#include "class.h"

#define MAX_STRING_LENS 1024

namespace se {
namespace internal {
void jsToSeValue(const target_value& value, Value* v) {
    assert(v != nullptr);
    napi_status    status;
    napi_valuetype valType;
    int64_t iRet      = 0;
    double  dRet      = 0.F;
    bool    bRet      = false;
    bool    lossless  = false;
    size_t  len       = 0;
    void*   nativePtr = nullptr;
    Object* obj       = nullptr;

    if (!value) {
        valType = napi_valuetype::napi_undefined;
    }else {
        NODE_API_CALL(status, ScriptEngine::getEnv(), napi_typeof(ScriptEngine::getEnv(), value, &valType));
    }

    switch (valType) {
        case napi_valuetype::napi_undefined:
            v->setUndefined();
            break;
        case napi_valuetype::napi_null:
            v->setNull();
            break;
        case napi_valuetype::napi_number:
            NODE_API_CALL(status, ScriptEngine::getEnv(), napi_get_value_double(ScriptEngine::getEnv(), value, &dRet));
            if (status == napi_ok) {
                v->setDouble(dRet);
            } else {
                v->setUndefined();
            }
            break;
        case napi_valuetype::napi_bigint:
            //NODE_API_CALL(status, ScriptEngine::getEnv(), napi_get_value_bigint_int64(ScriptEngine::getEnv(), value, &iRet, &lossless));
            if (lossless) {
                v->setInt64(iRet);
            } else {
                v->setUndefined();
            }

            break;
        case napi_valuetype::napi_string:
            NODE_API_CALL(status, ScriptEngine::getEnv(), napi_get_value_string_utf8(ScriptEngine::getEnv(), value, nullptr, 0, &len));
            if (status == napi_ok) {
                std::string valueStr;
                len += 1;
                valueStr.resize(len);
                NODE_API_CALL(status, ScriptEngine::getEnv(), napi_get_value_string_utf8(ScriptEngine::getEnv(), value, const_cast<char*>(valueStr.data()), valueStr.size(), &len));
                if (valueStr.length() != len) {
                    valueStr.resize(len);
                }
                v->setString(valueStr);
            } else {
                v->setUndefined();
            }
            break;
        case napi_valuetype::napi_boolean:
            NODE_API_CALL(status, ScriptEngine::getEnv(), napi_get_value_bool(ScriptEngine::getEnv(), value, &bRet));
            if (status == napi_ok) {
                v->setBoolean(bRet);
            } else {
                v->setUndefined();
            }
            break;
        case napi_valuetype::napi_object:
        case napi_valuetype::napi_function:
            status = napi_unwrap(ScriptEngine::getEnv(), value, &nativePtr);
            if ((status == napi_ok) && nativePtr) {
                obj = Object::getObjectWithPtr(nativePtr);
            }
            if (obj == nullptr) {
                obj = Object::_createJSObject(ScriptEngine::getEnv(), value, nullptr);
            }
            if (obj) {
                v->setObject(obj, true);
                obj->decRef();
            } else {
                v->setUndefined();
            }
            break;
        default:
            break;
    }
}

void jsToSeArgs(size_t argc, target_value* argv, ValueArray* outArr) {
    assert(outArr != nullptr);
    for (int i = 0; i < argc; i++) {
        Value v;
        jsToSeValue(argv[i], &v);
        outArr->push_back(v);
    }
}

bool seToJsValue(const Value& v, target_value* outJsVal) {
    assert(outJsVal != nullptr);
    bool        ret = false;
    napi_status status = napi_ok;
    switch (v.getType()) {
        case Value::Type::Number:
            NODE_API_CALL(status, ScriptEngine::getEnv(), napi_create_double(ScriptEngine::getEnv(), v.toDouble(), outJsVal));
            ret = (status == napi_ok);
            break;
        case Value::Type::String: {
            NODE_API_CALL(status, ScriptEngine::getEnv(), napi_create_string_utf8(ScriptEngine::getEnv(), v.toString().c_str(), v.toString().length(), outJsVal));
            ret = (status == napi_ok);
        } break;
        case Value::Type::Boolean:
            NODE_API_CALL(status, ScriptEngine::getEnv(), napi_get_boolean(ScriptEngine::getEnv(), v.toBoolean(), outJsVal));
            ret = (status == napi_ok);
            break;
        case Value::Type::Object:
            *outJsVal = v.toObject()->_getJSObject();
            ret       = (outJsVal != nullptr);
            break;
        case Value::Type::Null:
            NODE_API_CALL(status, ScriptEngine::getEnv(), napi_get_null(ScriptEngine::getEnv(), outJsVal));
            ret = (status == napi_ok);
            break;
        case Value::Type::Undefined:
            NODE_API_CALL(status, ScriptEngine::getEnv(), napi_get_undefined(ScriptEngine::getEnv(), outJsVal));
            ret = (status == napi_ok);
            break;
        case Value::Type::BigInt:
            //NODE_API_CALL(status, ScriptEngine::getEnv(), napi_create_bigint_int64(ScriptEngine::getEnv(), v.toInt64(), outJsVal));
            NODE_API_CALL(status, ScriptEngine::getEnv(), napi_create_double(ScriptEngine::getEnv(), v.toDouble(), outJsVal));
            ret = (status == napi_ok);
            break;
        default:
            assert(false);
            break;
    }
    //LOGI("type :%d", v.getType());
    return ret;
}

void seToJsArgs(napi_env env, const ValueArray& args, std::vector<target_value>* outArr) {
    assert(outArr != nullptr);
    for (const auto& data : args) {
        napi_value jsval;
        seToJsValue(data, &jsval);
        outArr->push_back(jsval);
    }
}

bool setReturnValue(const Value& data, target_value& argv) {
    LOGI("setReturnValue");
    if (data.getType() == Value::Type::BigInt) {
        // TODO: fix 'TypeError: Cannot mix BigInt and other types, use explicit conversions' for spine & dragonbones
        napi_status status;
        NODE_API_CALL(status, ScriptEngine::getEnv(), napi_create_double(ScriptEngine::getEnv(), data.toDouble(), &argv));
        return true;
    }

    return seToJsValue(data, &argv);
}
} // namespace internal
}; // namespace se