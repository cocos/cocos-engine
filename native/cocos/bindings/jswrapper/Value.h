/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#pragma once

#include <string_view>
#include "HandleObject.h"
#include "base/Macros.h"
#include "base/std/container/string.h"
#include "base/std/container/vector.h"

namespace se {

class Object;

/**
 *  se::Value represents a JavaScript Value.
 *  It could be undefined, null, number, boolean, string and object which exists in JavaScript.
 */
class Value final {
public:
    enum class Type : char {
        Undefined = 0, // NOLINT(readability-identifier-naming)
        Null,          // NOLINT(readability-identifier-naming)
        Number,        // NOLINT(readability-identifier-naming)
        Boolean,       // NOLINT(readability-identifier-naming)
        String,        // NOLINT(readability-identifier-naming)
        Object,        // NOLINT(readability-identifier-naming)
        BigInt,        // NOLINT(readability-identifier-naming)
    };

    static Value Null;      // NOLINT(readability-identifier-naming)
    static Value Undefined; // NOLINT(readability-identifier-naming)

    /**
     *  @brief The default constructor.
     */
    Value();

    /**
     *  @brief The copy constructor.
     */
    Value(const Value &v);

    /**
     *  @brief The move constructor.
     */
    Value(Value &&v) noexcept;

    /**
     *  @brief The constructor with a boolean argument.
     */
    explicit Value(bool v);

    /**
     *  @brief The constructor with a int8_t argument.
     */
    explicit Value(int8_t v);

    /**
     *  @brief The constructor with a uint8_t argument.
     */
    explicit Value(uint8_t v);

    /**
     *  @brief The constructor with a int16_t argument.
     */
    explicit Value(int16_t v);

    /**
     *  @brief The constructor with a uint16_t argument.
     */
    explicit Value(uint16_t v);

    /**
     *  @brief The constructor with a int32_t argument.
     */
    explicit Value(int32_t v);

    /**
     *  @brief The constructor with a uint32_t argument.
     */
    explicit Value(uint32_t v);

    /**
     *  @brief The constructor with a uint64_t argument.
     */
    explicit Value(uint64_t v);

    /**
     *  @brief The constructor with a int64_t argument.
     */
    explicit Value(int64_t v);

    /**
     *  @brief The constructor with a float argument.
     */
    explicit Value(float v);

    /**
     *  @brief The constructor with a double argument.
     */
    explicit Value(double v);

    /**
     *  @brief The constructor with an UTF8 null-terminated string argument.
     */
    explicit Value(const char *v);

    /**
     *  @brief The constructor with an UTF8 string argument.
     */
    explicit Value(const ccstd::string &v);

    /**
     *  @brief The constructor with an Object.
     *  @param o A se::Object to be set.
     *  @param[in] autoRootUnroot Whether to root se::Object and unroot it in se::Value's destructor or unroot it while object is replaced. Default value is false.
     */
    explicit Value(Object *o, bool autoRootUnroot = false);

    /**
     *  @brief The constructor with a HandleObject.
     *  @param o A se::HandleObject to be set.
     *  @param[in] autoRootUnroot Whether to root se::HandleObject and unroot it in se::Value's destructor or unroot it while object is replaced. Default value is false.
     */
    explicit Value(const HandleObject &o, bool autoRootUnroot = false);

    /**
     *  @brief The destructor of se::Value
     */
    ~Value();

    /**
     *  @brief The copy assignment operator.
     */
    Value &operator=(const Value &v);

    /**
     *  @brief The move assignment operator.
     */
    Value &operator=(Value &&v) noexcept;

    /**
     *  @brief Sets se::Value to a long value.
     *  @param[in] v The long value to be set.
     */
    CC_DEPRECATED(3.3)
    void setLong(long v); // NOLINT(google-runtime-int)

    /**
     *  @brief Sets se::Value to a uintptr_t value.
     *  @param[in] v The uintptr_t value to be set.
     */
    CC_DEPRECATED(3.3)
    void setUIntptr_t(uintptr_t v); // NOLINT(readability-identifier-naming)

    /**
     *  @brief Sets se::Value to a unsigned long value.
     *  @param[in] v The unsigned long value to be set.
     */
    CC_DEPRECATED(3.3)
    void setUlong(unsigned long v); // NOLINT(google-runtime-int)

    /**
     *  @brief Sets se::Value to a double value.
     *  @param[in] v The double value to be set.
     */
    CC_DEPRECATED(3.3, "Use setDouble instead")
    void setNumber(double v);

    CC_DEPRECATED(3.3)
    unsigned int toUint() const;

    /**
     *  @brief Converts se::Value to long.
     *  @return long integer.
     */
    CC_DEPRECATED(3.3)
    long toLong() const; // NOLINT(google-runtime-int)
    /**
     *  @brief Converts se::Value to unsigned long.
     *  @return unsigned long integer.
     */
    CC_DEPRECATED(3.3)
    unsigned long toUlong() const; // NOLINT(google-runtime-int)

    /**
     *  @brief Converts se::Value to double number.
     *  @return double number.
     */
    CC_DEPRECATED(3.3, "Use toDouble instead")
    double toNumber() const;

    /**
     *  @brief Sets se::Value to undefined.
     */
    void setUndefined();

    /**
     *  @brief Sets se::Value to null.
     */
    void setNull();

    /**
     *  @brief Sets se::Value to a boolean value.
     *  @param[in] v The boolean value to be set.
     */
    void setBoolean(bool v);

    /**
     *  @brief Sets se::Value to a int8_t value.
     *  @param[in] v The int8_t value to be set.
     */
    void setInt8(int8_t v);

    /**
     *  @brief Sets se::Value to a uint8_t value.
     *  @param[in] v The uint8_t value to be set.
     */
    void setUint8(uint8_t v);

    /**
     *  @brief Sets se::Value to a int16_t value.
     *  @param[in] v The int16_t value to be set.
     */
    void setInt16(int16_t v);

    /**
     *  @brief Sets se::Value to a uint16_t value.
     *  @param[in] v The uint16_t value to be set.
     */
    void setUint16(uint16_t v);

    /**
     *  @brief Sets se::Value to a int32_t value.
     *  @param[in] v The int32_t value to be set.
     */
    void setInt32(int32_t v);

    /**
     *  @brief Sets se::Value to a uint32_t value.
     *  @param[in] v The uint32_t value to be set.
     */
    void setUint32(uint32_t v);

    /**
     *  @brief Sets se::Value to a unsigned int64_t
     *  @param[in] v The unsigned int64_t value to be set.
     */
    void setUint64(uint64_t v);

    /**
     *  @brief Sets se::Value to a int64_t value.
     *  @param[in] v The int64_t value to be set.
     */
    void setInt64(int64_t v);

    /**
     *  @brief Sets se::Value to a float value.
     *  @param[in] v The float value to be set.
     */
    void setFloat(float v);

    /**
     *  @brief Sets se::Value to a double value.
     *  @param[in] v The double value to be set.
     */
    void setDouble(double v);

    /**
     *  @brief Sets se::Value to an UTF8 null-terminated string value.
     *  @param[in] v The UTF8 null-terminated string value to be set.
     */
    void setString(const char *v);

    /**
     *  @brief Sets se::Value to string value.
     *  @param[in] v The string value to be set.
     */
    void setString(const ccstd::string &v);

    /**
     *  @brief Sets se::Value to string value by string_view.
     *  @param[in] v The string_view
     */
    void setString(const std::string_view &v);

    /**
     *  @brief Sets se::Value to se::Object value.
     *  @param[in] o The se::Object to be set.
     *  @param[in] autoRootUnroot Whether to root se::Object and unroot it in se::Value's destructor or unroot it while object is replaced. Default value is false.
     */
    void setObject(Object *o, bool autoRootUnroot = false);

    /**
     *  @brief Sets se::Value to se::HandleObject value.
     *  @param[in] o The se::Object to be set.
     *  @param[in] autoRootUnroot Whether to root se::HandleObject and unroot it in se::Value's destructor or unroot it while object is replaced. Default value is false.
     */
    void setObject(const HandleObject &o, bool autoRootUnroot = false);

    /**
     *  @brief Converts se::Value to int8_t.
     *  @return int8_t integer.
     */
    int8_t toInt8() const;

    /**
     *  @brief Converts se::Value to uint8_t.
     *  @return uint8_t integer.
     */
    uint8_t toUint8() const;

    /**
     *  @brief Converts se::Value to int16_t.
     *  @return int16_t integer.
     */
    int16_t toInt16() const;

    /**
     *  @brief Converts se::Value to uint16_t.
     *  @return uint16_t integer.
     */
    uint16_t toUint16() const;

    /**
     *  @brief Converts se::Value to int32_t.
     *  @return int32_t integer.
     */
    int32_t toInt32() const;

    /**
     *  @brief Converts se::Value to uint32_t.
     *  @return uint32_t integer.
     */
    uint32_t toUint32() const;

    /**
     *  @brief Converts se::Value to int64_t
     *  @return signed int64
     */
    int64_t toInt64() const;

    /**
     *  @brief Converts se::Value to unsigned uint64_t.
     *  @return unsigned int64.
     */
    uint64_t toUint64() const;

    /**
     *  @brief Converts se::Value to float number.
     *  @return float number.
     */
    float toFloat() const;

    /**
     *  @brief Converts se::Value to double number.
     *  @return double number.
     */
    double toDouble() const;

    /**
     *  @brief Converts se::Value to boolean.
     *  @return boolean.
     */
    bool toBoolean() const;

    /**
     *  @brief Gets ccstd::string if se::Value stores a string. It will trigger an assertion if se::Value isn't a string.
     *  @return A ccstd::string reference.
     *  @see toStringForce
     */
    const ccstd::string &toString() const;

    /**
     *  @brief Converts a se::Value to ccstd::string. Could be invoked even when se::Value isn't a string.
     *  @return A copied ccstd::string value.
     *  @see toString
     */
    ccstd::string toStringForce() const;

    /**
     *  @brief Gets the se::Object pointer if se::Value stores an object. It will trigger an assertion if se::Value isn't an object.
     *  @return A se::Object pointer.
     */
    Object *toObject() const;

    /**
     *  @brief Gets the type of se::Value.
     *  @return The type of se::Value.
     */
    inline Type getType() const { return _type; }

    /**
     *  @brief Tests whether se::Value stores a number.
     *  @return true if se::Value stores a number, otherwise false.
     */
    inline bool isNumber() const { return _type == Type::Number; }

    /**
     *  @brief Tests whether se::Value stores a Bigint.
     *  @return true if se::Value stores a uint64_t or a int64_t, otherwise false.
     */
    inline bool isBigInt() const { return _type == Type::BigInt; }

    /**
     *  @brief Tests whether se::Value stores a string.
     *  @return true if se::Value stores a string, otherwise false.
     */
    inline bool isString() const { return _type == Type::String; }

    /**
     *  @brief Tests whether se::Value stores an object.
     *  @return true if se::Value stores an object, otherwise false.
     */
    inline bool isObject() const { return _type == Type::Object; }

    /**
     *  @brief Tests whether se::Value stores a boolean.
     *  @return true if se::Value stores a boolean, otherwise false.
     */
    inline bool isBoolean() const { return _type == Type::Boolean; }

    /**
     *  @brief Tests whether se::Value stores an undefined value.
     *  @return true if se::Value stores an undefined value, otherwise false.
     */
    inline bool isUndefined() const { return _type == Type::Undefined; }

    /**
     *  @brief Tests whether se::Value stores a null value.
     *  @return true if se::Value stores a null value, otherwise false.
     */
    inline bool isNull() const { return _type == Type::Null; }

    /**
     *  @brief Tests whether se::Value stores a null or an undefined value.
     *  @return true if se::Value stores a null or an undefined value, otherwise false.
     */
    inline bool isNullOrUndefined() const { return (isNull() || isUndefined()); }

    size_t toSize() const {
        return static_cast<size_t>(toDouble());
    }

    void setSize(size_t v) {
        setDouble(static_cast<double>(v));
    }

    uintptr_t asPtr() const {
        return static_cast<uintptr_t>(toUint64());
    }

private:
    explicit Value(Type type);
    void reset(Type type);

    union {
        bool _boolean;
        double _number;
        ccstd::string *_string;
        Object *_object;
        int64_t _bigint;
    } _u;

    Type _type;
    bool _autoRootUnroot;
};

using ValueArray = ccstd::vector<Value>;
extern ValueArray EmptyValueArray; // NOLINT(readability-identifier-naming)

} // namespace se

using se_object_ptr = se::Object *; // NOLINT(readability-identifier-naming)
