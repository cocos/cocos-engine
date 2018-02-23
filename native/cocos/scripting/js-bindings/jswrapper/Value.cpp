/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
#include "Value.hpp"
#include "Object.hpp"

namespace se {

    ValueArray EmptyValueArray;

    Value Value::Null = Value(Type::Null);
    Value Value::Undefined = Value(Type::Undefined);

    Value::Value()
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        memset(&_u, 0, sizeof(_u));
    }

    Value::Value(Type type)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        memset(&_u, 0, sizeof(_u));
        reset(type);
    }

    Value::Value(const Value& v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        *this = v;
    }

    Value::Value(Value&& v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        *this = std::move(v);
    }

    Value::Value(bool v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setBoolean(v);
    }

    Value::Value(int8_t v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setInt8(v);
    }

    Value::Value(uint8_t v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setUint8(v);
    }

    Value::Value(int32_t v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setInt32(v);
    }

    Value::Value(uint32_t v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setUint32(v);
    }

    Value::Value(int16_t v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setInt16(v);
    }

    Value::Value(uint16_t v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setUint16(v);
    }

    Value::Value(long v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setLong(v);
    }

    Value::Value(unsigned long v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setUlong(v);
    }

    Value::Value(float v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setFloat(v);
    }

    Value::Value(double v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setNumber(v);
    }

    Value::Value(const char* v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setString(v);
    }

    Value::Value(const std::string& v)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setString(v);
    }

    Value::Value(Object* o, bool autoRootUnroot/* = false*/)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setObject(o, autoRootUnroot);
    }

    Value::Value(const HandleObject& o, bool autoRootUnroot/* = false*/)
    : _type(Type::Undefined)
    , _autoRootUnroot(false)
    {
        setObject(o, autoRootUnroot);
    }

    Value::~Value()
    {
        reset(Type::Undefined);
    }

    Value& Value::operator=(const Value& v)
    {
        if (this != &v)
        {
            reset(v.getType());

            switch (_type) {
                case Type::Null:
                case Type::Undefined:
                {
                    memset(&_u, 0, sizeof(_u));
                    break;
                }
                case Type::Number:
                    _u._number = v._u._number;
                    break;
                case Type::String:
                    *_u._string = *v._u._string;
                    break;
                case Type::Boolean:
                    _u._boolean = v._u._boolean;
                    break;
                case Type::Object:
                {
                    setObject(v._u._object, v._autoRootUnroot);
                }
                    break;
                default:
                    break;
            }
        }
        return *this;
    }

    Value& Value::operator=(Value&& v)
    {
        if (this != &v)
        {
            reset(v.getType());

            switch (_type) {
                case Type::Null:
                case Type::Undefined:
                {
                    memset(&_u, 0, sizeof(_u));
                    break;
                }
                case Type::Number:
                    _u._number = v._u._number;
                    break;
                case Type::String:
                    *_u._string = std::move(*v._u._string);
                    break;
                case Type::Boolean:
                    _u._boolean = v._u._boolean;
                    break;
                case Type::Object:
                {
                    if (_u._object != nullptr) // When old value is also an Object, reset will take no effect, therefore, _u._object may not be nullptr.
                    {
                        if (_autoRootUnroot)
                        {
                            _u._object->unroot();
                        }
                        _u._object->decRef();
                    }
                    _u._object = v._u._object;
                    _autoRootUnroot = v._autoRootUnroot;
                    v._u._object = nullptr; // Reset to nullptr here to avoid 'release' operation in v.reset(Type::Undefined) since it's a move operation here.
                    v._autoRootUnroot = false;
                }
                    break;
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

   	void Value::setUndefined()
    {
        reset(Type::Undefined);
    }

   	void Value::setNull()
    {
        reset(Type::Null);
    }

   	void Value::setBoolean(bool v)
    {
        reset(Type::Boolean);
        _u._boolean = v;
    }

    void Value::setInt8(int8_t v)
    {
        reset(Type::Number);
        _u._number = (double)v;
    }

    void Value::setUint8(uint8_t v)
    {
        reset(Type::Number);
        _u._number = (double)v;
    }

    void Value::setInt32(int32_t v)
    {
        reset(Type::Number);
        _u._number = (double)v;
    }

    void Value::setUint32(uint32_t v)
    {
        reset(Type::Number);
        _u._number = (double)v;
    }

    void Value::setInt16(int16_t v)
    {
        reset(Type::Number);
        _u._number = (double)v;
    }

    void Value::setUint16(uint16_t v)
    {
        reset(Type::Number);
        _u._number = (double)v;
    }

    void Value::setLong(long v)
    {
        reset(Type::Number);
        _u._number = (double)v;
    }

    void Value::setUlong(unsigned long v)
    {
        reset(Type::Number);
        _u._number = (double)v;
    }

    void Value::setFloat(float v)
    {
        reset(Type::Number);
        _u._number = (double)v;
    }

   	void Value::setNumber(double v)
    {
        reset(Type::Number);
        _u._number = v;
    }

    void Value::setString(const char* v)
    {
        if (v != nullptr)
        {
            reset(Type::String);
            *_u._string = v;
        }
        else
        {
            reset(Type::Null);
        }
    }

   	void Value::setString(const std::string& v)
    {
        reset(Type::String);
        *_u._string = v;
    }

   	void Value::setObject(Object* object, bool autoRootUnroot/* = false*/)
    {
        if (object == nullptr)
        {
            reset(Type::Null);
            return;
        }

        if (_type != Type::Object)
        {
            reset(Type::Object);
        }

        if (_u._object != object)
        {
            if (object != nullptr)
            {
                object->incRef();
                if (autoRootUnroot)
                {
                    object->root();
                }
            }

            if (_u._object != nullptr) // When old value is also an Object, reset will take no effect, therefore, _u._object may not be nullptr.
            {
                if (_autoRootUnroot)
                {
                    _u._object->unroot();
                }
                _u._object->decRef();
            }
            _u._object = object;
            _autoRootUnroot = autoRootUnroot;
        }
        else
        {
            _autoRootUnroot = autoRootUnroot;
            if (_autoRootUnroot)
            {
                _u._object->root();
            }
        }
    }

    void Value::setObject(const HandleObject& o, bool autoRootUnroot/* = false*/)
    {
        setObject(o.get(), autoRootUnroot);
    }

    int8_t Value::toInt8() const
    {
        return static_cast<int8_t>(toNumber());
    }

    uint8_t Value::toUint8() const
    {
        return static_cast<uint8_t>(toNumber());
    }

    int16_t Value::toInt16() const
    {
        return static_cast<int16_t>(toNumber());
    }

    uint16_t Value::toUint16() const
    {
        return static_cast<uint16_t>(toNumber());
    }

    int32_t Value::toInt32() const
    {
        return static_cast<int32_t>(toNumber());
    }

    uint32_t Value::toUint32() const
    {
        return static_cast<uint32_t>(toNumber());
    }

    long Value::toLong() const
    {
        return static_cast<long>(toNumber());
    }

    unsigned long Value::toUlong() const
    {
        return static_cast<unsigned long>(toNumber());
    }

    float Value::toFloat() const
    {
        return static_cast<float>(toNumber());
    }

   	double Value::toNumber() const
    {
        assert(_type == Type::Number || _type == Type::Boolean);
        if (_type == Type::Boolean)
        {
            if (_u._boolean)
                return 1.0;
            else
                return 0.0;
        }
        return _u._number;
    }

   	bool Value::toBoolean() const
    {
        assert(_type == Type::Boolean);
        return _u._boolean;
    }

   	const std::string& Value::toString() const
    {
        assert(_type == Type::String);
        return *_u._string;
    }

    std::string Value::toStringForce() const
    {
        std::string ret;
        if (_type == Type::String)
        {
            ret = *_u._string;
        }
        else if (_type == Type::Boolean)
        {
            ret = _u._boolean ? "true" : "false";
        }
        else if (_type == Type::Number)
        {
            char tmp[50] = {0};
            snprintf(tmp, sizeof(tmp), "%.17g", _u._number);
            ret = tmp;
        }
        else if (_type == Type::Object)
        {
            ret = toObject()->toString();
        }
        else if (_type == Type::Null)
        {
            ret = "null";
        }
        else if (_type == Type::Undefined)
        {
            ret = "undefined";
        }
        else
        {
            assert(false);
        }

        return ret;
    }

    Object* Value::toObject() const
    {
        assert(isObject());
        return _u._object;
    }

    void Value::reset(Type type)
    {
        if (_type != type)
        {
            switch (_type) {
                case Type::String:
                    delete _u._string;
                    break;
                case Type::Object:
                {
                    if (_u._object != nullptr)
                    {
                        if (_autoRootUnroot)
                        {
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

} // namespace se {
