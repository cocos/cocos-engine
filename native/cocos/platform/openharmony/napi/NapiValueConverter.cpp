#include "NapiValueConverter.h"
#include <stdexcept>
#include "cocos/bindings/jswrapper/Value.h"
#include "base/Log.h"

napi_valuetype GetNapiValueType(napi_env env, napi_value value) {
  napi_valuetype type;
  napi_typeof(env, value, &type);
  return type;
}

template<>
bool NapiValueConverter::ToCppValue(napi_env env, napi_value value, int& result) {
  if (GetNapiValueType(env, value) != napi_number) {
    napi_throw_type_error(env, nullptr, "Expected number");
    return false;
  }
  napi_get_value_int32(env, value, &result);
  return true;
}

template<>
bool NapiValueConverter::ToCppValue(napi_env env, napi_value value, bool& result) {
  if (GetNapiValueType(env, value) != napi_boolean) {
    napi_throw_type_error(env, nullptr, "Expected boolean");
    return false;
  }
  napi_get_value_bool(env, value, &result);
  return true;
}

template<>
bool NapiValueConverter::ToCppValue(napi_env env, napi_value value, double& result) {
  if (GetNapiValueType(env, value) != napi_number) {
    napi_throw_type_error(env, nullptr, "Expected number");
    return false;
  }
  napi_get_value_double(env, value, &result);
  return true;
}

template<>
bool NapiValueConverter::ToCppValue(napi_env env, napi_value value, std::string& result) {
  if (GetNapiValueType(env, value) != napi_string) {
    napi_throw_type_error(env, nullptr, "Expected string");
    return false;
  }
  
  size_t str_size;
  napi_get_value_string_utf8(env, value, nullptr, 0, &str_size);    
  char* buf = new char[str_size + 1];  
  napi_get_value_string_utf8(env, value, buf, str_size + 1, &str_size);  
  result = std::string(buf);
  delete[] buf;
    
  return true;
}

napi_value NapiValueConverter::ToNapiValue(napi_env env, int32_t value) {
    napi_value result;
    napi_create_int32(env, value, &result);
    return result;
}

napi_value NapiValueConverter::ToNapiValue(napi_env env, int64_t value) {
    napi_value result;
    napi_create_int64(env, value, &result);
    return result;
}

napi_value NapiValueConverter::ToNapiValue(napi_env env, double value) {
    napi_value result;
    napi_create_double(env, value, &result);
    return result;
}

napi_value NapiValueConverter::ToNapiValue(napi_env env, bool value) {
    napi_value result;
    napi_get_boolean(env, value, &result);
    return result;
}

napi_value NapiValueConverter::ToNapiValue(napi_env env, const char* value) {
    napi_value result;
    napi_create_string_utf8(env, value, strlen(value), &result);
    return result;
}

napi_value NapiValueConverter::ToNapiValue(napi_env env, std::string value) {
    return ToNapiValue(env, value.c_str());
}

bool NapiValueConverter::NapiValueToSeValue(napi_env env, napi_value value, se::Value* v) {
    napi_status status;
    napi_valuetype valType;
    int64_t iRet = 0;
    double dRet = 0.0;
    bool bRet = false;
    bool lossless = false;
    size_t len = 0;
    if (!value) {
        valType = napi_valuetype::napi_undefined;
    } else {
        status = napi_typeof(env, value, &valType);
        if (status != napi_ok) {
            CC_LOG_WARNING("warning:%d", status);
            return false;
        }
    }

    switch (valType) {
        case napi_valuetype::napi_undefined:
            v->setUndefined();
            break;
        case napi_valuetype::napi_null:
            v->setNull();
            break;
        case napi_valuetype::napi_number:
            status = napi_get_value_double(env, value, &dRet);
            if (status == napi_ok) {
                v->setDouble(dRet);
            } else {
                CC_LOG_WARNING("warning:%d", status);
                v->setUndefined();
            }
            break;
        case napi_valuetype::napi_bigint:
            status = napi_get_value_bigint_int64(env, value, &iRet, &lossless);
            if (lossless) {
                v->setInt64(iRet);
            } else {
                v->setUndefined();
            }

            break;
        case napi_valuetype::napi_string:
            status = napi_get_value_string_utf8(env, value, nullptr, 0, &len);
            if (status == napi_ok) {
                std::string valueStr;
                len += 1;
                valueStr.resize(len);
                status = napi_get_value_string_utf8(env, value, const_cast<char*>(valueStr.data()), valueStr.size(), &len);
                if (valueStr.length() != len) {
                    valueStr.resize(len);
                }
                v->setString(valueStr);
            } else {
                CC_LOG_WARNING("warning:%d", status);
                v->setUndefined();
            }
            break;
        case napi_valuetype::napi_boolean:
            status = napi_get_value_bool(env, value, &bRet);
            if (status == napi_ok) {
                v->setBoolean(bRet);
            } else {
                CC_LOG_WARNING("warning:%d", status);
                v->setUndefined();
            }
            break;
        default:
            break;
    }
    return true;
}
