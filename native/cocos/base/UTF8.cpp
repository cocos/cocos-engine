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

#include "base/UTF8.h"

#include <cstdarg>
#include <cstdlib>

#include "ConvertUTF/ConvertUTF.h"
#include "base/Log.h"

namespace cc {

namespace StringUtils { //NOLINT

ccstd::string format(const char *format, ...) {
#define CC_MAX_STRING_LENGTH (1024 * 100)

    ccstd::string ret;

    va_list ap;
    va_start(ap, format);

    char *buf = static_cast<char *>(malloc(CC_MAX_STRING_LENGTH));
    if (buf != nullptr) {
        vsnprintf(buf, CC_MAX_STRING_LENGTH, format, ap);
        ret = buf;
        free(buf);
    }
    va_end(ap);

    return ret;
}

/*
 * @str:    the string to search through.
 * @c:        the character to not look for.
 *
 * Return value: the index of the last character that is not c.
 * */
unsigned int getIndexOfLastNotChar16(const ccstd::vector<char16_t> &str, char16_t c) {
    int len = static_cast<int>(str.size());

    int i = len - 1;
    for (; i >= 0; --i) {
        if (str[i] != c) {
            return i;
        }
    }

    return i;
}

/*
 * @str:    the string to trim
 * @index:    the index to start trimming from.
 *
 * Trims str st str=[0, index) after the operation.
 *
 * Return value: the trimmed string.
 * */
static void trimUTF16VectorFromIndex(ccstd::vector<char16_t> &str, int index) { //NOLINT
    int size = static_cast<int>(str.size());
    if (index >= size || index < 0) {
        return;
    }

    str.erase(str.begin() + index, str.begin() + size);
}

/*
 * @ch is the unicode character whitespace?
 *
 * Reference: http://en.wikipedia.org/wiki/Whitespace_character#Unicode
 *
 * Return value: weather the character is a whitespace character.
 * */
bool isUnicodeSpace(char16_t ch) {
    return (ch >= 0x0009 && ch <= 0x000D) || ch == 0x0020 || ch == 0x0085 || ch == 0x00A0 || ch == 0x1680 || (ch >= 0x2000 && ch <= 0x200A) || ch == 0x2028 || ch == 0x2029 || ch == 0x202F || ch == 0x205F || ch == 0x3000;
}

bool isCJKUnicode(char16_t ch) {
    return (ch >= 0x4E00 && ch <= 0x9FBF)     // CJK Unified Ideographs
           || (ch >= 0x2E80 && ch <= 0x2FDF)  // CJK Radicals Supplement & Kangxi Radicals
           || (ch >= 0x2FF0 && ch <= 0x30FF)  // Ideographic Description Characters, CJK Symbols and Punctuation & Japanese
           || (ch >= 0x3100 && ch <= 0x31BF)  // Korean
           || (ch >= 0xAC00 && ch <= 0xD7AF)  // Hangul Syllables
           || (ch >= 0xF900 && ch <= 0xFAFF)  // CJK Compatibility Ideographs
           || (ch >= 0xFE30 && ch <= 0xFE4F)  // CJK Compatibility Forms
           || (ch >= 0x31C0 && ch <= 0x4DFF); // Other extensions
}

void trimUTF16Vector(ccstd::vector<char16_t> &str) {
    int len = static_cast<int>(str.size());

    if (len <= 0) {
        return;
    }

    int lastIndex = len - 1;

    // Only start trimming if the last character is whitespace..
    if (isUnicodeSpace(str[lastIndex])) {
        for (int i = lastIndex - 1; i >= 0; --i) {
            if (isUnicodeSpace(str[i])) {
                lastIndex = i;
            }

            else {
                break;
            }
        }

        trimUTF16VectorFromIndex(str, lastIndex);
    }
}

template <typename T>
struct ConvertTrait {
    using ArgType = T;
};
template <>
struct ConvertTrait<char> {
    using ArgType = UTF8;
};
template <>
struct ConvertTrait<char16_t> {
    using ArgType = UTF16;
};
template <>
struct ConvertTrait<char32_t> {
    using ArgType = UTF32;
};

template <typename From, typename To, typename FromTrait = ConvertTrait<From>, typename ToTrait = ConvertTrait<To>>
bool utfConvert(
    const std::basic_string<From> &from, std::basic_string<To> &to,
    ConversionResult (*cvtfunc)(const typename FromTrait::ArgType **, const typename FromTrait::ArgType *,
                                typename ToTrait::ArgType **, typename ToTrait::ArgType *,
                                ConversionFlags)) {
    static_assert(sizeof(From) == sizeof(typename FromTrait::ArgType), "Error size mismatched");
    static_assert(sizeof(To) == sizeof(typename ToTrait::ArgType), "Error size mismatched");

    if (from.empty()) {
        to.clear();
        return true;
    }

    // See: http://unicode.org/faq/utf_bom.html#gen6
    constexpr int mostBytesPerCharacter = 4;

    const size_t maxNumberOfChars = from.length(); // all UTFs at most one element represents one character.
    const size_t numberOfOut = maxNumberOfChars * mostBytesPerCharacter / sizeof(To);

    std::basic_string<To> working(numberOfOut, 0);

    auto inbeg = reinterpret_cast<const typename FromTrait::ArgType *>(&from[0]);
    auto inend = inbeg + from.length();

    auto outbeg = reinterpret_cast<typename ToTrait::ArgType *>(&working[0]);
    auto outend = outbeg + working.length();
    auto r = cvtfunc(&inbeg, inend, &outbeg, outend, strictConversion);
    if (r != conversionOK) {
        return false;
    }

    working.resize(reinterpret_cast<To *>(outbeg) - &working[0]);
    to = std::move(working);

    return true;
};

CC_DLL void UTF8LooseFix(const ccstd::string &in, ccstd::string &out) { //NOLINT
    const auto *p = reinterpret_cast<const UTF8 *>(in.c_str());
    const auto *end = reinterpret_cast<const UTF8 *>(in.c_str() + in.size());
    unsigned ucharLen = 0;
    while (p < end) {
        ucharLen = getNumBytesForUTF8(*p);
        if (isLegalUTF8Sequence(p, p + ucharLen)) {
            if (p + ucharLen < end) {
                out.append(p, p + ucharLen);
            }
            p += ucharLen;
        } else {
            p += 1; //skip bad char
        }
    }
}

bool UTF8ToUTF16(const ccstd::string &utf8, std::u16string &outUtf16) { //NOLINT
    return utfConvert(utf8, outUtf16, ConvertUTF8toUTF16);
}

bool UTF8ToUTF32(const ccstd::string &utf8, std::u32string &outUtf32) { //NOLINT
    return utfConvert(utf8, outUtf32, ConvertUTF8toUTF32);
}

bool UTF16ToUTF8(const std::u16string &utf16, ccstd::string &outUtf8) { //NOLINT
    return utfConvert(utf16, outUtf8, ConvertUTF16toUTF8);
}

bool UTF16ToUTF32(const std::u16string &utf16, std::u32string &outUtf32) { //NOLINT
    return utfConvert(utf16, outUtf32, ConvertUTF16toUTF32);
}

bool UTF32ToUTF8(const std::u32string &utf32, ccstd::string &outUtf8) { //NOLINT
    return utfConvert(utf32, outUtf8, ConvertUTF32toUTF8);
}

bool UTF32ToUTF16(const std::u32string &utf32, std::u16string &outUtf16) { //NOLINT
    return utfConvert(utf32, outUtf16, ConvertUTF32toUTF16);
}

#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS)
ccstd::string getStringUTFCharsJNI(JNIEnv *env, jstring srcjStr, bool *ret) {
    ccstd::string utf8Str;
    auto *unicodeChar = static_cast<const uint16_t *>(env->GetStringChars(srcjStr, nullptr));
    size_t unicodeCharLength = env->GetStringLength(srcjStr);
    const std::u16string unicodeStr(reinterpret_cast<const char16_t *>(unicodeChar), unicodeCharLength);
    bool flag = UTF16ToUTF8(unicodeStr, utf8Str);

    if (ret) {
        *ret = flag;
    }

    if (!flag) {
        utf8Str = "";
    }
    env->ReleaseStringChars(srcjStr, unicodeChar);
    return utf8Str;
}

jstring newStringUTFJNI(JNIEnv *env, const ccstd::string &utf8Str, bool *ret) {
    std::u16string utf16Str;
    bool flag = cc::StringUtils::UTF8ToUTF16(utf8Str, utf16Str);

    if (ret) {
        *ret = flag;
    }

    if (!flag) {
        utf16Str.clear();
    }
    jstring stringText = env->NewString(reinterpret_cast<const jchar *>(utf16Str.data()), utf16Str.length());
    return stringText;
}
#endif

ccstd::vector<char16_t> getChar16VectorFromUTF16String(const std::u16string &utf16) {
    return ccstd::vector<char16_t>(utf16.begin(), utf16.end());
}

long getCharacterCountInUTF8String(const ccstd::string &utf8) { //NOLINT
    return getUTF8StringLength(reinterpret_cast<const UTF8 *>(utf8.c_str()));
}

StringUTF8::StringUTF8(const ccstd::string &newStr) {
    replace(newStr);
}

std::size_t StringUTF8::length() const {
    return _str.size();
}

void StringUTF8::replace(const ccstd::string &newStr) {
    _str.clear();
    if (!newStr.empty()) {
        const auto *sequenceUtf8 = reinterpret_cast<const UTF8 *>(newStr.c_str());

        int lengthString = getUTF8StringLength(sequenceUtf8);

        if (lengthString == 0) {
            CC_LOG_DEBUG("Bad utf-8 set string: %s", newStr.c_str());
            return;
        }

        while (*sequenceUtf8) {
            std::size_t lengthChar = getNumBytesForUTF8(*sequenceUtf8);

            CharUTF8 charUTF8;
            charUTF8._char.append(reinterpret_cast<const char *>(sequenceUtf8), lengthChar);
            sequenceUtf8 += lengthChar;

            _str.push_back(charUTF8);
        }
    }
}

ccstd::string StringUTF8::getAsCharSequence() const {
    ccstd::string charSequence;

    for (auto &charUtf8 : _str) {
        charSequence.append(charUtf8._char);
    }

    return charSequence;
}

bool StringUTF8::deleteChar(std::size_t pos) {
    if (pos < _str.size()) {
        _str.erase(_str.begin() + pos);
        return true;
    }
    return false;
}

bool StringUTF8::insert(std::size_t pos, const ccstd::string &insertStr) {
    StringUTF8 utf8(insertStr);

    return insert(pos, utf8);
}

bool StringUTF8::insert(std::size_t pos, const StringUTF8 &insertStr) {
    if (pos <= _str.size()) {
        _str.insert(_str.begin() + pos, insertStr._str.begin(), insertStr._str.end());

        return true;
    }
    return false;
}

} // namespace StringUtils

} // namespace cc
