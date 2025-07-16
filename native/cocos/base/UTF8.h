/****************************************************************************
 Copyright (c) 2014 cocos2d-x.org
 Copyright (c) 2014-2016 Chukong Technologies Inc.
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

#include <sstream>
#include "base/Macros.h"
#include "base/std/container/string.h"
#include "base/std/container/vector.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS)
    #include "platform/java/jni/JniHelper.h"
#endif

namespace cc {

namespace StringUtils { //NOLINT

template <typename T>
ccstd::string toString(T arg) {
    std::stringstream ss;
    ss << arg;
    return ss.str();
}

ccstd::string CC_DLL format(const char *format, ...) CC_FORMAT_PRINTF(1, 2);

/**
 *  @brief Converts from UTF8 string to UTF16 string.
 *
 *  This function resizes \p outUtf16 to required size and
 *  fill its contents with result UTF16 string if conversion success.
 *  If conversion fails it guarantees not to change \p outUtf16.
 *
 *  @param inUtf8 The source UTF8 string to be converted from.
 *  @param outUtf16 The output string to hold the result UTF16s.
 *  @return True if succeed, otherwise false.
 *  @note Please check the return value before using \p outUtf16
 *  e.g.
 *  @code
 *    std::u16string utf16;
 *    bool ret = StringUtils::UTF8ToUTF16("你好hello", utf16);
 *    if (ret) {
 *        do_some_thing_with_utf16(utf16);
 *    }
 *  @endcode
 */
CC_DLL bool UTF8ToUTF16(const ccstd::string &inUtf8, std::u16string &outUtf16); //NOLINT

/**
 *  @brief Same as \a UTF8ToUTF16 but converts form UTF8 to UTF32.
 *
 *  @see UTF8ToUTF16
 */
CC_DLL bool UTF8ToUTF32(const ccstd::string &inUtf8, std::u32string &outUtf32); //NOLINT

/**
 *  @brief Same as \a UTF8ToUTF16 but converts form UTF16 to UTF8.
 *
 *  @see UTF8ToUTF16
 */
CC_DLL bool UTF16ToUTF8(const std::u16string &inUtf16, ccstd::string &outUtf8); //NOLINT

/**
 *  @brief Same as \a UTF8ToUTF16 but converts form UTF16 to UTF32.
 *
 *  @see UTF8ToUTF16
 */
CC_DLL bool UTF16ToUTF32(const std::u16string &inUtf16, std::u32string &outUtf32); //NOLINT

/**
 *  @brief Same as \a UTF8ToUTF16 but converts form UTF32 to UTF8.
 *
 *  @see UTF8ToUTF16
 */
CC_DLL bool UTF32ToUTF8(const std::u32string &inUtf32, ccstd::string &outUtf8); //NOLINT

/**
 *  @brief Same as \a UTF8ToUTF16 but converts form UTF32 to UTF16.
 *
 *  @see UTF8ToUTF16
 */
CC_DLL bool UTF32ToUTF16(const std::u32string &inUtf32, std::u16string &outUtf16); //NOLINT

/**
 *  @brief Skip some bad char code.
 */
CC_DLL void UTF8LooseFix(const ccstd::string &in, ccstd::string &out); //NOLINT

#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS)

/**
*  @brief convert jstring to utf8 ccstd::string,  same function with env->getStringUTFChars. 
*         because getStringUTFChars can not pass special emoticon
*  @param env   The JNI Env
*  @param srcjStr The jstring which want to convert
*  @param ret   True if the conversion succeeds and the ret pointer isn't null
*  @returns the result of utf8 string
*/
CC_DLL ccstd::string getStringUTFCharsJNI(JNIEnv *env, jstring srcjStr, bool *ret = nullptr);

/**
*  @brief create a jstring with utf8 ccstd::string, same function with env->newStringUTF
*         because newStringUTF can not convert special emoticon
*  @param env   The JNI Env
*  @param srcjStr The ccstd::string which want to convert
*  @param ret     True if the conversion succeeds and the ret pointer isn't null
*  @returns the result of jstring,the jstring need to DeleteLocalRef(jstring);
*/
CC_DLL jstring newStringUTFJNI(JNIEnv *env, const ccstd::string &utf8Str, bool *ret = nullptr);
#endif

/**
 *  @brief Trims the unicode spaces at the end of char16_t vector.
 */
CC_DLL void trimUTF16Vector(ccstd::vector<char16_t> &str); //NOLINT

/**
 *  @brief Whether the character is a whitespace character.
 *  @param ch    The unicode character.
 *  @returns     Whether the character is a white space character.
 *
 *  @see http://en.wikipedia.org/wiki/Whitespace_character#Unicode
 *
 */
CC_DLL bool isUnicodeSpace(char16_t ch);

/**
 *  @brief Whether the character is a Chinese/Japanese/Korean character.
 *  @param ch    The unicode character.
 *  @returns     Whether the character is a Chinese character.
 *
 *  @see http://www.searchtb.com/2012/04/chinese_encode.html
 *  @see http://tieba.baidu.com/p/748765987
 *
 */
CC_DLL bool isCJKUnicode(char16_t ch);

/**
 *  @brief Returns the length of the string in characters.
 *  @param utf8 An UTF-8 encoded string.
 *  @returns The length of the string in characters.
 */
CC_DLL long getCharacterCountInUTF8String(const ccstd::string &utf8); //NOLINT

/**
 *  @brief Gets the index of the last character that is not equal to the character given.
 *  @param str   The string to be searched.
 *  @param c     The character to be searched for.
 *  @returns The index of the last character that is not \p c.
 */
CC_DLL unsigned int getIndexOfLastNotChar16(const ccstd::vector<char16_t> &str, char16_t c);

/**
 *  @brief Gets char16_t vector from a given utf16 string.
 */
CC_DLL ccstd::vector<char16_t> getChar16VectorFromUTF16String(const std::u16string &utf16);

/**
* Utf8 sequence
* Store all utf8 chars as ccstd::string
* Build from ccstd::string
*/
class CC_DLL StringUTF8 {
public:
    struct CharUTF8 {
        ccstd::string _char;
        bool isAnsi() { return _char.size() == 1; }
    };
    using CharUTF8Store = ccstd::vector<CharUTF8>;

    StringUTF8() = default;
    explicit StringUTF8(const ccstd::string &newStr);
    ~StringUTF8() = default;

    std::size_t length() const;
    void replace(const ccstd::string &newStr);

    ccstd::string getAsCharSequence() const;

    bool deleteChar(std::size_t pos);
    bool insert(std::size_t pos, const ccstd::string &insertStr);
    bool insert(std::size_t pos, const StringUTF8 &insertStr);

    CharUTF8Store &getString() { return _str; }

private:
    CharUTF8Store _str;
};

} // namespace StringUtils

} // namespace cc
