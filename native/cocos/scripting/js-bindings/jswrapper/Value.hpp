#pragma once

#include <vector>
#include <string>

#include "HandleObject.hpp"

namespace se {

    class Object;

    class Value
    {
    public:
        enum class Type
        {
            Undefined = 0,
            Null,
            Number,
            Boolean,
            String,
            Object
        };

        static Value Null;
        static Value Undefined;

        Value();
        Value(const Value& v);
        Value(Value&& v);

        explicit Value(bool v);
        explicit Value(int8_t v);
        explicit Value(uint8_t v);
        explicit Value(int16_t v);
        explicit Value(uint16_t v);
        explicit Value(int32_t v);
        explicit Value(uint32_t v);
        explicit Value(long v);
        explicit Value(unsigned long v);
        explicit Value(float v);
        explicit Value(double v);
        explicit Value(const char* v);
        explicit Value(const std::string& v);
        explicit Value(Object* o);
        explicit Value(const HandleObject& o);

        ~Value();

        Value& operator=(const Value& v);
        Value& operator=(Value&& v);
        Value& operator=(bool v);
        Value& operator=(double v);
        Value& operator=(const char* v);
        Value& operator=(const std::string& v);
        Value& operator=(Object* o);
        Value& operator=(const HandleObject& o);

        void setUndefined();
        void setNull();
        void setBoolean(bool v);
        void setInt8(int8_t v);
        void setUint8(uint8_t v);
        void setInt16(int16_t v);
        void setUint16(uint16_t v);
        void setInt32(int32_t v);
        void setUint32(uint32_t v);
        void setLong(long v);
        void setUlong(unsigned long v);
        void setFloat(float v);
        void setNumber(double v);
        void setString(const char* v);
        void setString(const std::string& v);
        void setObject(Object* o);
        void setObject(const HandleObject& o);

        int8_t toInt8() const;
        uint8_t toUint8() const;
        int16_t toInt16() const;
        uint16_t toUint16() const;
        int32_t toInt32() const;
        uint32_t toUint32() const;
        long toLong() const;
        unsigned long toUlong() const;
        float toFloat() const;

        double toNumber() const;
        bool toBoolean() const;
        const std::string& toString() const;
        std::string toStringForce() const;

        Object* toObject() const;

        inline Type getType() const { return _type; }
        inline bool isNumber() const { return _type == Type::Number; }
        inline bool isString() const { return _type == Type::String; }
        inline bool isObject() const { return _type == Type::Object; }
        inline bool isBoolean() const { return _type == Type::Boolean; }
        inline bool isUndefined() const { return _type == Type::Undefined; }
        inline bool isNull() const { return _type == Type::Null; }
        inline bool isNullOrUndefined() const { return (isNull() || isUndefined()); }

    private:
        explicit Value(Type type);
        void reset(Type type);

        Type _type;

        union {
            bool _boolean;
            double _number;
            std::string* _string;
            Object* _object;
        } _u;
    };

    using ValueArray = std::vector<Value>;
    extern ValueArray EmptyValueArray;

} // namespace se {
