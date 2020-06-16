#include "CoreStd.h"
#include "UTFString.h"

namespace cc {
namespace gfx {

UTFString::unicode_char UTFString::_base_iterator::_getCharacter() const {
    return string_->getChar(_get_index());
}

int UTFString::_base_iterator::_setCharacter(unicode_char uc) {
    size_type current_index = _get_index();
    int change = string_->setChar(current_index, uc);
    _jump_to(current_index);
    return change;
}

void UTFString::_base_iterator::_moveNext() {
    _seekFwd(1);             // move 1 code point forward
    if (_test_end()) return; // exit if we hit the end
    if (_utf16_surrogate_follow(iter_[0])) {
        // landing on a follow code point means we might be part of a bigger character
        // so we test for that
        code_point lead_half = 0;
        //NB: we can't possibly be at the beginning here, so no need to test
        lead_half = iter_[-1]; // check the previous code point to see if we're part of a surrogate pair
        if (_utf16_surrogate_lead(lead_half)) {
            _seekFwd(1); // if so, then advance 1 more code point
        }
    }
}

void UTFString::_base_iterator::_movePrev() {
    _seekRev(1);               // move 1 code point backwards
    if (_test_begin()) return; // exit if we hit the beginning
    if (_utf16_surrogate_follow(iter_[0])) {
        // landing on a follow code point means we might be part of a bigger character
        // so we test for that
        code_point lead_half = 0;
        lead_half = iter_[-1]; // check the previous character to see if we're part of a surrogate pair
        if (_utf16_surrogate_lead(lead_half)) {
            _seekRev(1); // if so, then rewind 1 more code point
        }
    }
}

//////////////////////////////////////////////////////////////////////////

UTFString::unicode_char UTFString::getChar(size_type loc) const {
    const code_point *ptr = c_str();
    unicode_char uc;
    size_t l = _utf16_char_length(ptr[loc]);
    code_point cp[2] = {/* blame the code beautifier */
                        0, 0};
    cp[0] = ptr[loc];

    if (l == 2 && (loc + 1) < m_data.length()) {
        cp[1] = ptr[loc + 1];
    }
    _utf16_to_utf32(cp, uc);
    return uc;
}

int UTFString::setChar(size_type loc, unicode_char ch) {
    code_point cp[2] = {/* blame the code beautifier */
                        0, 0};
    size_t l = _utf32_to_utf16(ch, cp);
    unicode_char existingChar = getChar(loc);
    size_t existingSize = _utf16_char_length(existingChar);
    size_t newSize = _utf16_char_length(ch);

    if (newSize > existingSize) {
        at(loc) = cp[0];
        insert(loc + 1, 1, cp[1]);
        return 1;
    }
    if (newSize < existingSize) {
        erase(loc, 1);
        at(loc) = cp[0];
        return -1;
    }

    // newSize == existingSize
    at(loc) = cp[0];
    if (l == 2) at(loc + 1) = cp[1];
    return 0;
}

UTFString &UTFString::assign(const String &str) {
    size_type len = _verifyUTF8(str);
    clear(); // empty our contents, if there are any
    if (len == 0) {
        return *this;
    }

    reserve(len); // best guess bulk capacity growth

    // This is a 3 step process, converting each byte in the UTF-8 stream to UTF-32,
    // then converting it to UTF-16, then finally appending the data buffer

    unicode_char uc = 0;      // temporary Unicode character buffer
    unsigned char utf8buf[7]; // temporary UTF-8 buffer
    utf8buf[6] = 0;
    size_t utf8len;          // UTF-8 length
    code_point utf16buff[3]; // temporary UTF-16 buffer
    utf16buff[2] = 0;
    size_t utf16len; // UTF-16 length

    String::const_iterator i, ie = str.end();
    for (i = str.begin(); i != ie; i++) {
        utf8len = _utf8_char_length(static_cast<unsigned char>(*i)); // estimate bytes to load
        for (size_t j = 0; j < utf8len; j++) {                       // load the needed UTF-8 bytes
            utf8buf[j] = (static_cast<unsigned char>(*(i + j)));     // we don't increment 'i' here just in case the estimate is wrong (shouldn't happen, but we're being careful)
        }
        utf8buf[utf8len] = 0;                  // nul terminate so we throw an exception before running off the end of the buffer
        utf8len = _utf8_to_utf32(utf8buf, uc); // do the UTF-8 -> UTF-32 conversion
        i += utf8len - 1;                      // we subtract 1 for the increment of the 'for' loop

        utf16len = _utf32_to_utf16(uc, utf16buff); // UTF-32 -> UTF-16 conversion
        append(utf16buff, utf16len);               // append the characters to the string
    }
    return *this;
}

UTFString &UTFString::assign(const WString &wstr) {
    m_data.clear();
    m_data.reserve(wstr.length()); // best guess bulk allocate
#ifdef WCHAR_UTF16                 // if we're already working in UTF-16, this is easy
    code_point tmp;
    WString::const_iterator i, ie = wstr.end();
    for (i = wstr.begin(); i != ie; i++) {
        tmp = static_cast<code_point>(*i);
        m_data.push_back(tmp);
    }
#else // otherwise we do it the safe way (which is still 100% safe to pass UTF-16 through, just slower)
    code_point cp[3] = {0, 0, 0};
    unicode_char tmp;
    WString::const_iterator i, ie = wstr.end();
    for (i = wstr.begin(); i != ie; i++) {
        tmp = static_cast<unicode_char>(*i);
        size_t l = _utf32_to_utf16(tmp, cp);
        if (l > 0) m_data.push_back(cp[0]);
        if (l > 1) m_data.push_back(cp[1]);
    }
#endif
    return *this;
}

UTFString &UTFString::append(size_type num, unicode_char ch) {
    code_point cp[2] = {0, 0};
    if (_utf32_to_utf16(ch, cp) == 2) {
        for (size_type i = 0; i < num; i++) {
            append(1, cp[0]);
            append(1, cp[1]);
        }
    } else {
        for (size_type i = 0; i < num; i++) {
            append(1, cp[0]);
        }
    }
    return *this;
}

UTFString &UTFString::insert(size_type index, size_type num, unicode_char ch) {
    code_point cp[3] = {0, 0, 0};
    size_t l = _utf32_to_utf16(ch, cp);
    if (l == 1) {
        return insert(index, num, cp[0]);
    }
    for (size_type c = 0; c < num; c++) {
        // insert in reverse order to preserve ordering after insert
        insert(index, 1, cp[1]);
        insert(index, 1, cp[0]);
    }
    return *this;
}

void UTFString::insert(iterator i, size_type num, const unicode_char &ch) {
    code_point cp[3] = {0, 0, 0};
    size_t l = _utf32_to_utf16(ch, cp);
    if (l == 1) {
        insert(i, num, cp[0]);
    } else {
        for (size_type c = 0; c < num; c++) {
            // insert in reverse order to preserve ordering after insert
            insert(i, 1, cp[1]);
            insert(i, 1, cp[0]);
        }
    }
}

UTFString::size_type UTFString::find_first_of(const UTFString &str, size_type index /*= 0*/, size_type num /*= npos */) const {
    size_type i = 0;
    const size_type len = length();
    while (i < num && (index + i) < len) {
        unicode_char ch = getChar(index + i);
        if (str.inString(ch))
            return index + i;
        i += _utf16_char_length(ch); // increment by the Unicode character length
    }
    return npos;
}

UTFString::size_type UTFString::find_first_not_of(const UTFString &str, size_type index /*= 0*/, size_type num /*= npos */) const {
    size_type i = 0;
    const size_type len = length();
    while (i < num && (index + i) < len) {
        unicode_char ch = getChar(index + i);
        if (!str.inString(ch))
            return index + i;
        i += _utf16_char_length(ch); // increment by the Unicode character length
    }
    return npos;
}

UTFString::size_type UTFString::find_last_of(const UTFString &str, size_type index /*= npos*/, size_type num /*= npos */) const {
    size_type i = 0;
    const size_type len = length();
    if (index > len) index = len - 1;

    while (i < num && (index - i) != npos) {
        size_type j = index - i;
        // careful to step full Unicode characters
        if (j != 0 && _utf16_surrogate_follow(at(j)) && _utf16_surrogate_lead(at(j - 1))) {
            j = index - ++i;
        }
        // and back to the usual dull test
        unicode_char ch = getChar(j);
        if (str.inString(ch))
            return j;
        i++;
    }
    return npos;
}

UTFString::size_type UTFString::find_last_not_of(const UTFString &str, size_type index /*= npos*/, size_type num /*= npos */) const {
    size_type i = 0;
    const size_type len = length();
    if (index > len) index = len - 1;

    while (i < num && (index - i) != npos) {
        size_type j = index - i;
        // careful to step full Unicode characters
        if (j != 0 && _utf16_surrogate_follow(at(j)) && _utf16_surrogate_lead(at(j - 1))) {
            j = index - ++i;
        }
        // and back to the usual dull test
        unicode_char ch = getChar(j);
        if (!str.inString(ch))
            return j;
        i++;
    }
    return npos;
}

size_t UTFString::_utf16_to_utf32(const code_point in_cp[2], unicode_char &out_uc) {
    const code_point &cp1 = in_cp[0];
    const code_point &cp2 = in_cp[1];
    bool wordPair = false;

    // does it look like a surrogate pair?
    if (0xD800 <= cp1 && cp1 <= 0xDBFF) {
        // looks like one, but does the other half match the algorithm as well?
        if (0xDC00 <= cp2 && cp2 <= 0xDFFF)
            wordPair = true; // yep!
    }

    if (!wordPair) { // if we aren't a 100% authentic surrogate pair, then just copy the value
        out_uc = cp1;
        return 1;
    }

    unsigned short cU = cp1, cL = cp2; // copy upper and lower words of surrogate pair to writable buffers
    cU -= 0xD800;                      // remove the encoding markers
    cL -= 0xDC00;

    out_uc = (cU & 0x03FF) << 10; // grab the 10 upper bits and set them in their proper location
    out_uc |= (cL & 0x03FF);      // combine in the lower 10 bits
    out_uc += 0x10000;            // add back in the value offset

    return 2; // this whole operation takes to words, so that's what we'll return
}

size_t UTFString::_utf32_to_utf16(const unicode_char &in_uc, code_point out_cp[2]) {
    if (in_uc <= 0xFFFF) { // we blindly preserve sentinel values because our decoder understands them
        out_cp[0] = static_cast<code_point>(in_uc);
        return 1;
    }
    unicode_char uc = in_uc; // copy to writable buffer
    unsigned short tmp;      // single code point buffer
    uc -= 0x10000;           // subtract value offset

    //process upper word
    tmp = static_cast<unsigned short>((uc >> 10) & 0x03FF); // grab the upper 10 bits
    tmp += 0xD800;                                          // add encoding offset
    out_cp[0] = tmp;                                        // write

    // process lower word
    tmp = static_cast<unsigned short>(uc & 0x03FF); // grab the lower 10 bits
    tmp += 0xDC00;                                  // add encoding offset
    out_cp[1] = tmp;                                // write

    return 2; // return used word count (2 for surrogate pairs)
}

size_t UTFString::_utf8_char_length(unsigned char cp) {
    if (!(cp & 0x80)) return 1;
    if ((cp & ~_lead1_mask) == _lead1) return 2;
    if ((cp & ~_lead2_mask) == _lead2) return 3;
    if ((cp & ~_lead3_mask) == _lead3) return 4;
    if ((cp & ~_lead4_mask) == _lead4) return 5;
    if ((cp & ~_lead5_mask) == _lead5) return 6;

    CCASSERT(0, "invalid UTF-8 sequence header value");
    return 1;
}

size_t UTFString::_utf8_char_length(unicode_char uc) {
    /*
   7 bit:  U-00000000 - U-0000007F: 0xxxxxxx
   11 bit: U-00000080 - U-000007FF: 110xxxxx 10xxxxxx
   16 bit: U-00000800 - U-0000FFFF: 1110xxxx 10xxxxxx 10xxxxxx
   21 bit: U-00010000 - U-001FFFFF: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
   26 bit: U-00200000 - U-03FFFFFF: 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
   31 bit: U-04000000 - U-7FFFFFFF: 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
   */
    if (!(uc & ~0x0000007F)) return 1;
    if (!(uc & ~0x000007FF)) return 2;
    if (!(uc & ~0x0000FFFF)) return 3;
    if (!(uc & ~0x001FFFFF)) return 4;
    if (!(uc & ~0x03FFFFFF)) return 5;
    if (!(uc & ~0x7FFFFFFF)) return 6;

    CCASSERT(0, "invalid UTF-32 value");
    return 1;
}

size_t UTFString::_utf8_to_utf32(const unsigned char in_cp[6], unicode_char &out_uc) {
    size_t len = _utf8_char_length(in_cp[0]);
    if (len == 1) { // if we are only 1 byte long, then just grab it and exit
        out_uc = in_cp[0];
        return 1;
    }

    unicode_char c = 0; // temporary buffer
    size_t i = 0;
    switch (len) { // load header byte
        case 6:
            c = in_cp[i] & _lead5_mask;
            break;
        case 5:
            c = in_cp[i] & _lead4_mask;
            break;
        case 4:
            c = in_cp[i] & _lead3_mask;
            break;
        case 3:
            c = in_cp[i] & _lead2_mask;
            break;
        case 2:
            c = in_cp[i] & _lead1_mask;
            break;
    }

    for (++i; i < len; i++) { // load each continuation byte
        if ((in_cp[i] & ~_cont_mask) != _cont) {
            CCASSERT(0, "bad UTF-8 continuation byte");
            break;
        }
        c <<= 6;
        c |= (in_cp[i] & _cont_mask);
    }

    out_uc = c; // write the final value and return the used byte length
    return len;
}

size_t UTFString::_utf32_to_utf8(const unicode_char &in_uc, unsigned char out_cp[6]) {
    size_t len = _utf8_char_length(in_uc); // predict byte length of sequence
    unicode_char c = in_uc;                // copy to temp buffer

    //stuff all of the lower bits
    for (size_t i = len - 1; i > 0; i--) {
        out_cp[i] = static_cast<unsigned char>(((c)&_cont_mask) | _cont);
        c >>= 6;
    }

    //now write the header byte
    switch (len) {
        case 6:
            out_cp[0] = static_cast<unsigned char>(((c)&_lead5_mask) | _lead5);
            break;
        case 5:
            out_cp[0] = static_cast<unsigned char>(((c)&_lead4_mask) | _lead4);
            break;
        case 4:
            out_cp[0] = static_cast<unsigned char>(((c)&_lead3_mask) | _lead3);
            break;
        case 3:
            out_cp[0] = static_cast<unsigned char>(((c)&_lead2_mask) | _lead2);
            break;
        case 2:
            out_cp[0] = static_cast<unsigned char>(((c)&_lead1_mask) | _lead1);
            break;
        case 1:
        default:
            out_cp[0] = static_cast<unsigned char>((c)&0x7F);
            break;
    }

    // return the byte length of the sequence
    return len;
}

UTFString::size_type UTFString::_verifyUTF8(const String &str) {
    String::const_iterator i, ie = str.end();
    i = str.begin();
    size_type length = 0;

    while (i != ie) {
        // characters pass until we find an extended sequence
        if ((*i) & 0x80) {
            unsigned char c = (*i);
            size_t contBytes = 0;

            // get continuation byte count and test for overlong sequences
            if ((c & ~_lead1_mask) == _lead1) { // 1 additional byte
                if (c == _lead1) {
                    CCASSERT(0, "overlong UTF-8 sequence");
                    return 0;
                }
                contBytes = 1;

            } else if ((c & ~_lead2_mask) == _lead2) { // 2 additional bytes
                contBytes = 2;
                if (c == _lead2) {  // possible overlong UTF-8 sequence
                    c = (*(i + 1)); // look ahead to next byte in sequence
                    if ((c & _lead2) == _cont) {
                        CCASSERT(0, "overlong UTF-8 sequence");
                        return 0;
                    }
                }

            } else if ((c & ~_lead3_mask) == _lead3) { // 3 additional bytes
                contBytes = 3;
                if (c == _lead3) {  // possible overlong UTF-8 sequence
                    c = (*(i + 1)); // look ahead to next byte in sequence
                    if ((c & _lead3) == _cont) {
                        CCASSERT(0, "overlong UTF-8 sequence");
                        return 0;
                    }
                }

            } else if ((c & ~_lead4_mask) == _lead4) { // 4 additional bytes
                contBytes = 4;
                if (c == _lead4) {  // possible overlong UTF-8 sequence
                    c = (*(i + 1)); // look ahead to next byte in sequence
                    if ((c & _lead4) == _cont) {
                        CCASSERT(0, "overlong UTF-8 sequence");
                        return 0;
                    }
                }

            } else if ((c & ~_lead5_mask) == _lead5) { // 5 additional bytes
                contBytes = 5;
                if (c == _lead5) {  // possible overlong UTF-8 sequence
                    c = (*(i + 1)); // look ahead to next byte in sequence
                    if ((c & _lead5) == _cont) {
                        CCASSERT(0, "overlong UTF-8 sequence");
                        return 0;
                    }
                }
            }

            // check remaining continuation bytes for
            while (contBytes--) {
                c = (*(++i)); // get next byte in sequence
                if ((c & ~_cont_mask) != _cont) {
                    CCASSERT(0, "bad UTF-8 continuation byte");
                    return 0;
                }
            }
        }
        length++;
        i++;
    }
    return length;
}

void UTFString::_cleanBuffer() const {
    if (m_buff.m_voidBuff != 0) {
        switch (m_buffType) {
            case BT_STR:
                CC_DELETE_T(m_buff.m_strBuff, String);
                break;
            case BT_WSTR:
                CC_DELETE_T(m_buff.m_wstrBuff, WString);
                break;
            case BT_NONE: // under the worse of circumstances, this is all we can do, and hope it works out
            default:
                //delete mBuffer.mVoidBuffer;
                // delete void* is undefined, don't do that
                CCASSERT(0, "This should never happen - mVoidBuffer should never contain something if we "
                            "don't know the type");
                break;
        }
        m_buff.m_voidBuff = 0;
        m_buffSize = 0;
        m_buffType = BT_NONE;
    }
}

void UTFString::_getBufferStr() const {
    if (m_buffType != BT_STR) {
        _cleanBuffer();
        m_buff.m_strBuff = CC_NEW_T(String);
        m_buffType = BT_STR;
    }
    m_buff.m_strBuff->clear();
}

void UTFString::_getBufferWStr() const {
    if (m_buffType != BT_WSTR) {
        _cleanBuffer();
        m_buff.m_wstrBuff = CC_NEW_T(WString);
        m_buffType = BT_WSTR;
    }
    m_buff.m_wstrBuff->clear();
}

void UTFString::_load_buffer_UTF8() const {
    _getBufferStr();
    String &buffer = (*m_buff.m_strBuff);
    buffer.reserve(length());

    unsigned char utf8buf[6] = "";
    char *charbuf = (char *)utf8buf;
    unicode_char c;
    size_t len;

    const_iterator i, ie = end();
    for (i = begin(); i != ie; i.moveNext()) {
        c = i.getCharacter();
        len = _utf32_to_utf8(c, utf8buf);
        size_t j = 0;
        while (j < len)
            buffer.push_back(charbuf[j++]);
    }
}

void UTFString::_load_buffer_WStr() const {
    _getBufferWStr();
    WString &buffer = (*m_buff.m_wstrBuff);
    buffer.reserve(length()); // may over reserve, but should be close enough
#ifdef WCHAR_UTF16            // wchar_t matches UTF-16
    const_iterator i, ie = end();
    for (i = begin(); i != ie; ++i) {
        buffer.push_back((wchar_t)(*i));
    }
#else // wchar_t fits UTF-32
    unicode_char c;
    const_iterator i, ie = end();
    for (i = begin(); i != ie; i.moveNext()) {
        c = i.getCharacter();
        buffer.push_back((wchar_t)c);
    }
#endif
}

} // namespace gfx
} // namespace cc
