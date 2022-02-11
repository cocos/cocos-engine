/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "Value.h"
#include <cmath>
#include <cstdint>
#include <sstream>
#include <type_traits>
#include "Object.h"

namespace se {

#ifndef LIKELY
    #ifdef __GNUC__
        #define LIKELY(expr) __builtin_expect(!!(expr), 1)
    #else
        #define LIKELY(expr) expr
    #endif
#endif

template <typename T>
inline
    typename std::enable_if<std::is_unsigned<T>::value, T>::type
    fromDoubleToIntegral(double d) {
    return static_cast<T>(static_cast<int64_t>(d));
}

template <typename T>
inline
    typename std::enable_if<std::is_signed<T>::value, T>::type
    fromDoubleToIntegral(double d) {
    return static_cast<T>(d);
}

#define CONVERT_TO_TYPE(type) fromDoubleToIntegral<type>(toDouble())

ValueArray EmptyValueArray; // NOLINT(readability-identifier-naming)

Value Value::Null      = Value(Type::Null);      //NOLINT(readability-identifier-naming)
Value Value::Undefined = Value(Type::Undefined); //NOLINT(readability-identifier-naming)

Value::Value()
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    memset(&_u, 0, sizeof(_u));
}

Value::Value(Type type)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    memset(&_u, 0, sizeof(_u));
    reset(type);
}

Value::Value(const Value &v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    *this = v;
}

Value::Value(Value &&v) noexcept
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    *this = std::move(v);
}

Value::Value(bool v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setBoolean(v);
}

Value::Value(int8_t v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setInt8(v);
}

Value::Value(uint8_t v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setUint8(v);
}

Value::Value(int32_t v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setInt32(v);
}

Value::Value(uint32_t v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setUint32(v);
}

Value::Value(int16_t v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setInt16(v);
}

Value::Value(uint16_t v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setUint16(v);
}

Value::Value(int64_t v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setInt64(v);
}

Value::Value(uint64_t v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setUint64(v);
}

Value::Value(float v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setFloat(v);
}

Value::Value(double v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setDouble(v);
}

Value::Value(const char *v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setString(v);
}

Value::Value(const std::string &v)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setString(v);
}

Value::Value(Object *o, bool autoRootUnroot /* = false*/)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setObject(o, autoRootUnroot);
}

Value::Value(const HandleObject &o, bool autoRootUnroot /* = false*/)
: _type(Type::Undefined),
  _autoRootUnroot(false) {
    setObject(o, autoRootUnroot);
}

Value::~Value() {
    reset(Type::Undefined);
}

Value &Value::operator=(const Value &v) {
    if (this != &v) {
        reset(v.getType());

        switch (_type) {
            case Type::Null:
            case Type::Undefined: {
                memset(&_u, 0, sizeof(_u));
                break;
            }
            case Type::Number:
                _u._number = v._u._number;
                break;
            case Type::BigInt:
                _u._bigint = v._u._bigint;
                break;
            case Type::String:
                *_u._string = *v._u._string;
                break;
            case Type::Boolean:
                _u._boolean = v._u._boolean;
                break;
            case Type::Object: {
                setObject(v._u._object, v._autoRootUnroot);
            } break;
            default:
                break;
        }
    }
    return *this;
}

Value &Value::operator=(Value &&v) noexcept {
    if (this != &v) {
        reset(v.getType());

        switch (_type) {
            case Type::Null:
            case Type::Undefined: {
                memset(&_u, 0, sizeof(_u));
                break;
            }
            case Type::Number:
                _u._number = v._u._number;
                break;
            case Type::BigInt:
                _u._bigint = v._u._bigint;
                break;
            case Type::String:
                *_u._string = std::move(*v._u._string);
                break;
            case Type::Boolean:
                _u._boolean = v._u._boolean;
                break;
            case Type::Object: {
                if (_u._object != nullptr) // When old value is also an Object, reset will take no effect, therefore, _u._object may not be nullptr.
                {
                    if (_autoRootUnroot) {
                        _u._object->unroot();
                    }
                    _u._object->decRef();
                }
                _u._object        = v._u._object;
                _autoRootUnroot   = v._autoRootUnroot;
                v._u._object      = nullptr; // Reset to nullptr here to avoid 'release' operation in v.reset(Type::Undefined) since it's a move operation here.
                v._autoRootUnroot = false;
            } break;
            default:
                break;
        }

        v.reset(Type::Undefined);
    }
    return *this;
}

//    Value& Value::operator=(bool v)
//    {
//        setBoolean(v);
//        return *this;
//    }
//
//    Value& Value::operator=(double v)
//    {
//        setNumber(v);
//        return *this;
//    }
//
//    Value& Value::operator=(const std::string& v)
//    {
//        setString(v);
//        return *this;
//    }
//
//    Value& Value::operator=(Object* o)
//    {
//        setObject(o);
//        return *this;
//    }
//
//    Value& Value::operator=(const HandleObject& o)
//    {
//        setObject(o);
//        return *this;
//    }

void Value::setUndefined() {
    reset(Type::Undefined);
}

void Value::setNull() {
    reset(Type::Null);
}

void Value::setBoolean(bool v) {
    reset(Type::Boolean);
    _u._boolean = v;
}

void Value::setInt8(int8_t v) {
    reset(Type::Number);
    _u._number = static_cast<double>(v);
}

void Value::setUint8(uint8_t v) {
    reset(Type::Number);
    _u._number = static_cast<double>(v);
}

void Value::setInt32(int32_t v) {
    reset(Type::Number);
    _u._number = static_cast<double>(v);
}

void Value::setUint32(uint32_t v) {
    reset(Type::Number);
    _u._number = static_cast<double>(v);
}

void Value::setInt16(int16_t v) {
    reset(Type::Number);
    _u._number = static_cast<double>(v);
}

void Value::setUint16(uint16_t v) {
    reset(Type::Number);
    _u._number = static_cast<double>(v);
}

void Value::setInt64(int64_t v) {
    reset(Type::BigInt);
    _u._bigint = v;
}

void Value::setUint64(uint64_t v) {
    reset(Type::BigInt);
    _u._bigint = static_cast<int64_t>(v);
}

void Value::setFloat(float v) {
    reset(Type::Number);
    _u._number = static_cast<double>(v);
}

void Value::setDouble(double v) {
    reset(Type::Number);
    _u._number = v;
}

void Value::setString(const char *v) {
    if (v != nullptr) {
        reset(Type::String);
        *_u._string = v;
    } else {
        reset(Type::Null);
    }
}

void Value::setString(const std::string &v) {
    reset(Type::String);
    *_u._string = v;
}

void Value::setObject(Object *object, bool autoRootUnroot /* = false*/) {
    if (object == nullptr) {
        reset(Type::Null);
        return;
    }

    if (_type != Type::Object) {
        reset(Type::Object);
    }

    if (_u._object != object) {
        if (object != nullptr) {
            object->incRef();
            if (autoRootUnroot) {
                object->root();
            }
        }

        if (_u._object != nullptr) // When old value is also an Object, reset will take no effect, therefore, _u._object may not be nullptr.
        {
            if (_autoRootUnroot) {
                _u._object->unroot();
            }
            _u._object->decRef();
        }
        _u._object      = object;
        _autoRootUnroot = autoRootUnroot;
    } else {
        _autoRootUnroot = autoRootUnroot;
        if (_autoRootUnroot) {
            _u._object->root();
        }
    }
}

void Value::setObject(const HandleObject &o, bool autoRootUnroot /* = false*/) {
    setObject(o.get(), autoRootUnroot);
}

int8_t Value::toInt8() const {
    return CONVERT_TO_TYPE(int8_t);
}

uint8_t Value::toUint8() const {
    return CONVERT_TO_TYPE(uint8_t);
}

int16_t Value::toInt16() const {
    return CONVERT_TO_TYPE(int16_t);
}

uint16_t Value::toUint16() const {
    return CONVERT_TO_TYPE(uint16_t);
}

int32_t Value::toInt32() const {
    return CONVERT_TO_TYPE(int32_t);
}

uint32_t Value::toUint32() const {
    return CONVERT_TO_TYPE(uint32_t);
}

int64_t Value::toInt64() const {
    assert(isBigInt() || isNumber());
    return _type == Type::BigInt ? _u._bigint : CONVERT_TO_TYPE(int64_t);
}

uint64_t Value::toUint64() const {
    assert(isBigInt() || isNumber());
    return _type == Type::BigInt ? static_cast<uint64_t>(_u._bigint) : CONVERT_TO_TYPE(uint64_t);
}

float Value::toFloat() const {
    return static_cast<float>(toDouble());
}

double Value::toDouble() const {
    assert(_type == Type::Number || _type == Type::Boolean || _type == Type::BigInt);
    if (LIKELY(_type == Type::Number)) {
        return _u._number;
    }
    if (_type == Type::BigInt) {
        // CC_LOG_WARNING("convert int64 to double");
        return static_cast<double>(_u._bigint);
    }
    return _u._boolean ? 1.0 : 0.0;
}

bool Value::toBoolean() const {
    assert(_type == Type::Boolean);
    return _u._boolean;
}

const std::string &Value::toString() const {
    assert(_type == Type::String);
    return *_u._string;
}

std::string Value::toStringForce() const {
    std::stringstream ss;
    if (_type == Type::String) {
        ss << *_u._string;
    } else if (_type == Type::Boolean) {
        ss << (_u._boolean ? "true" : "false");
    } else if (_type == Type::Number) {
        char tmp[50] = {0};
        snprintf(tmp, sizeof(tmp), "%.17g", _u._number);
        ss << tmp;
    } else if (_type == Type::BigInt) {
        ss << _u._bigint;
    } else if (_type == Type::Object) {
        ss << toObject()->toString();
    } else if (_type == Type::Null) {
        ss << "null";
    } else if (_type == Type::Undefined) {
        ss << "undefined";
    } else {
        assert(false);
        ss << "[[BadValueType]]";
    }
    return ss.str();
}

Object *Value::toObject() const {
    assert(isObject());
    return _u._object;
}

void Value::reset(Type type) {
    if (_type != type) {
        switch (_type) {
            case Type::String:
                delete _u._string;
                break;
            case Type::Object: {
                if (_u._object != nullptr) {
                    if (_autoRootUnroot) {
                        _u._object->unroot();
                    }
                    _u._object->decRef();
                    _u._object = nullptr;
                }

                _autoRootUnroot = false;
                break;
            }
            default:
                break;
        }

        memset(&_u, 0, sizeof(_u));

        switch (type) {
            case Type::String:
                _u._string = new std::string();
                break;
            default:
                break;
        }
        _type = type;
    }
}

/////////////////// deprecated methods ////////////////////

void Value::setLong(long v) { // NOLINT(google-runtime-int)
    setDouble(static_cast<double>(v));
}

void Value::setUIntptr_t(uintptr_t v) {
    setDouble(static_cast<double>(v));
}

void Value::setUlong(unsigned long v) { // NOLINT(google-runtime-int)
    setDouble(static_cast<double>(v));
}

void Value::setNumber(double v) {
    setDouble(v);
}

unsigned int Value::toUint() const {
    return CONVERT_TO_TYPE(unsigned int);
}

long Value::toLong() const { // NOLINT(google-runtime-int)
    return CONVERT_TO_TYPE(long);
}

unsigned long Value::toUlong() const { // NOLINT(google-runtime-int)
    return CONVERT_TO_TYPE(unsigned long);
}

double Value::toNumber() const {
    return toDouble();
}

} // namespace se
