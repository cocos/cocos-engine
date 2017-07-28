#include "Value.hpp"
#include "Object.hpp"

namespace se {

    ValueArray EmptyValueArray;

    Value Value::Null = Value(Type::Null);
    Value Value::Undefined = Value(Type::Undefined);

    Value::Value()
    : _type(Type::Undefined)
    {
    }

    Value::Value(Type type)
    : _type(Type::Undefined)
    {
        reset(type);
    }

    Value::Value(const Value& v)
    : _type(Type::Undefined)
    {
        *this = v;
    }

    Value::Value(Value&& v)
    : _type(Type::Undefined)
    {
        *this = std::move(v);
    }

    Value::Value(bool v)
    : _type(Type::Undefined)
    {
        setBoolean(v);
    }

    Value::Value(int8_t v)
    : _type(Type::Undefined)
    {
        setInt8(v);
    }

    Value::Value(uint8_t v)
    : _type(Type::Undefined)
    {
        setUint8(v);
    }

    Value::Value(int32_t v)
    : _type(Type::Undefined)
    {
        setInt32(v);
    }

    Value::Value(uint32_t v)
    : _type(Type::Undefined)
    {
        setUint32(v);
    }

    Value::Value(int16_t v)
    : _type(Type::Undefined)
    {
        setInt16(v);
    }

    Value::Value(uint16_t v)
    : _type(Type::Undefined)
    {
        setUint16(v);
    }

    Value::Value(long v)
    : _type(Type::Undefined)
    {
        setLong(v);
    }

    Value::Value(unsigned long v)
    : _type(Type::Undefined)
    {
        setUlong(v);
    }

    Value::Value(float v)
    : _type(Type::Undefined)
    {
        setFloat(v);
    }

    Value::Value(double v)
    : _type(Type::Undefined)
    {
        setNumber(v);
    }

    Value::Value(const char* v)
    : _type(Type::Undefined)
    {
        setString(v);
    }

    Value::Value(const std::string& v)
    : _type(Type::Undefined)
    {
        setString(v);
    }

    Value::Value(Object* o)
    : _type(Type::Undefined)
    {
        setObject(o);
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
                    break;
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
                    setObject(v._u._object);
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
                    break;
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
                    if (_u._object != nullptr)
                    {
                        _u._object->release();
                    }
                    _u._object = v._u._object;
                    v._u._object = nullptr;
                }
                    break;
                default:
                    break;
            }

            v.reset(Type::Undefined);
        }
        return *this;
    }

    Value& Value::operator=(bool v)
    {
        setBoolean(v);
        return *this;
    }

    Value& Value::operator=(double v)
    {
        setNumber(v);
        return *this;
    }

    Value& Value::operator=(const std::string& v)
    {
        setString(v);
        return *this;
    }

    Value& Value::operator=(Object* o)
    {
        setObject(o);
        return *this;
    }

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

   	void Value::setObject(Object* object)
    {
        if (object != nullptr)
            reset(Type::Object);
        else
            reset(Type::Null);

        if (_u._object != object)
        {
            if (_u._object != nullptr)
            {
                _u._object->release();
            }
            _u._object = object;
            if (_u._object != nullptr)
            {
                _u._object->addRef();
            }
        }
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
//            std::stringstream ss;
//            ss << _u._number;
//            ret = ss.str();
            char tmp[350] = {0};
            snprintf(tmp, sizeof(tmp), "%lf", _u._number);
            ret = tmp;
        }
        else if (_type == Type::Object)
        {
            if (toObject()->isFunction())
            {
                ret = "[Object function]";
            }
            else
            {
                ret = "[Object object]";
            }
        }
        else if (_type == Type::Null)
        {
            ret = "null";
        }
        else if (_type == Type::Undefined)
        {
            ret = "undefined";
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
                    SAFE_RELEASE(_u._object);
                    break;
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
