#ifndef CC_CORE_KERNEL_UTF_STRING_H_
#define CC_CORE_KERNEL_UTF_STRING_H_

#if (CC_COMPILER == CC_COMPILER_MSVC && (CC_COMPILER_VERSION >= 70 && CC_COMPILER_VERSION < 100))

# if defined(_DLL_CPPLIB)
namespace std {
  template class _CRTIMP2 basic_string<unsigned short, char_traits<unsigned short>,
  allocator<unsigned short> >;
  
  template class _CRTIMP2 basic_string<__wchar_t, char_traits<__wchar_t>,
  allocator<__wchar_t> >;
}
# endif // defined(_DLL_CPPLIB)

#endif

#include "memory/StlAlloc.h"

CC_NAMESPACE_BEGIN

/* READ THIS NOTICE BEFORE USING IN YOUR OWN APPLICATIONS
 =NOTICE=
 This class is not a complete Unicode solution. It purposefully does not
 provide certain functionality, such as proper lexical sorting for
 Unicode values. It does provide comparison operators for the sole purpose
 of using UTFString as an index with std::map and other operator< sorted
 containers, but it should NOT be relied upon for meaningful lexical
 operations, such as alphabetical sorts. If you need this type of
 functionality, look into using ICU instead (http://icu.sourceforge.net/).
 
 =REQUIREMENTS=
 There are a few requirements for proper operation. They are fairly small,
 and shouldn't restrict usage on any reasonable target.
 * Compiler must support unsigned 16-bit integer types
 * Compiler must support signed 32-bit integer types
 * wchar_t must be either UTF-16 or UTF-32 encoding, and specified as such
 using the WCHAR_UTF16 macro as outlined below.
 * You must include <iterator>, <string>, and <wchar>. Probably more, but
 these are the most obvious.
 
 =REQUIRED PREPROCESSOR MACROS=
 This class requires two preprocessor macros to be defined in order to
 work as advertised.
 INT32 - must be mapped to a signed 32 bit integer (ex. #define INT32 int)
 UINT16 - must be mapped to an unsigned 16 bit integer (ex. #define UINT32 unsigned short)
 
 Additionally, a third macro should be defined to control the evaluation of wchar_t:
 WCHAR_UTF16 - should be defined when wchar_t represents UTF-16 code points,
 such as in Windows. Otherwise it is assumed that wchar_t is a 32-bit
 integer representing UTF-32 code points.
 */

// THIS IS A VERY BRIEF AUTO DETECTION. YOU MAY NEED TO TWEAK THIS
#ifdef __STDC_ISO_10646__
// for any compiler that provides this, wchar_t is guaranteed to hold any Unicode value with a single code point (32-bit or larger)
// so we can safely skip the rest of the testing
#else // #ifdef __STDC_ISO_10646__
#  if (CC_PLATFORM == CC_PLATFORM_WINDOWS) || (CC_PLATFORM != CC_PLATFORM_ANDROID)
#    define WCHAR_UTF16 // All currently known Windows platforms utilize UTF-16 encoding in wchar_t
#  endif
#endif // #ifdef __STDC_ISO_10646__

// OGRE_IS_NATIVE_WCHAR_T means that wchar_t isn't a typedef of
// uint16 or uint32.
#if CC_COMPILER == CC_COMPILER_MSVC

// Don't define wchar_t related functions since it'll duplicate
// with UTFString::code_point related functions when compile
// without /Zc:wchar_t, because in this case both of them are
// a typedef of uint16.
#  if defined(_NATIVE_WCHAR_T_DEFINED)
#    define CC_IS_NATIVE_WCHAR_T      0
#  else
#    define CC_IS_NATIVE_WCHAR_T      0
#  endif
#else
// Assumed wchar_t is natively for other compilers
#   define CC_IS_NATIVE_WCHAR_T     1
#endif  // CC_COMPILER == CC_COMPILER_MSVC

//! A UTF-16 string with implicit conversion to/from std::string and std::wstring
/*! This class provides a complete 1 to 1 map of most std::string functions (at least to my
 knowledge). Implicit conversions allow this string class to work with all common C++ string
 formats, with specialty functions defined where implicit conversion would cause potential
 problems or is otherwise unavailable.
 
 Some additional functionality is present to assist in working with characters using the
 32-bit UTF-32 encoding. (Which is guaranteed to fit any Unicode character into a single
 code point.) \b Note: Reverse iterators do not have this functionality due to the
 ambiguity that surrounds working with UTF-16 in reverse. (Such as, where should an
 iterator point to represent the beginning of a surrogate pair?)
 
 
 \par Supported Input Types
 The supported string types for input, and their assumed encoding schemes, are:
 - std::string (UTF-8)
 - char* (UTF-8)
 - std::wstring (autodetected UTF-16 / UTF-32 based on compiler)
 - wchar_t* (autodetected UTF-16 / UTF-32 based on compiler)
 
 
 \see
 - For additional information on UTF-16 encoding: http://en.wikipedia.org/wiki/UTF-16
 - For additional information on UTF-8 encoding: http://en.wikipedia.org/wiki/UTF-8
 - For additional information on UTF-32 encoding: http://en.wikipedia.org/wiki/UTF-32
 */

class CC_CORE_API UTFString
{
  // constants used in UTF-8 conversions
  static const unsigned char _lead1 = 0xC0;      //110xxxxx
  static const unsigned char _lead1_mask = 0x1F; //00011111
  static const unsigned char _lead2 = 0xE0;      //1110xxxx
  static const unsigned char _lead2_mask = 0x0F; //00001111
  static const unsigned char _lead3 = 0xF0;      //11110xxx
  static const unsigned char _lead3_mask = 0x07; //00000111
  static const unsigned char _lead4 = 0xF8;      //111110xx
  static const unsigned char _lead4_mask = 0x03; //00000011
  static const unsigned char _lead5 = 0xFC;      //1111110x
  static const unsigned char _lead5_mask = 0x01; //00000001
  static const unsigned char _cont = 0x80;       //10xxxxxx
  static const unsigned char _cont_mask = 0x3F;  //00111111
  
public:
  //! size type used to indicate string size and character positions within the string
  typedef size_t size_type;
  //! the usual constant representing: not found, no limit, etc
  static const size_type npos = static_cast<size_type>(~0);
  
  //! a single 32-bit Unicode character
  typedef uint32_t unicode_char;
  
  //! a single UTF-16 code point
  typedef char16_t code_point;
  
  //! value type typedef for use in iterators
  typedef code_point value_type;
  
#if (CC_STL_MEMORY_ALLOCATOR == CC_STL_MEMORY_ALLOCATOR_CUSTOM)
  typedef std::basic_string<code_point, std::char_traits<code_point>, SA<code_point, STLAP > > dstring; // data string
#else
  typedef std::basic_string<code_point> dstring; // data string
#endif
  //! base iterator class for UTFString
  class CC_CORE_API _base_iterator: public std::iterator<std::random_access_iterator_tag, value_type> {
    friend class UTFString;
  protected:
    _base_iterator() { string_ = 0; }
    
    inline void _seekFwd( size_type c ) { iter_ += c; }
    inline void _seekRev( size_type c ) { iter_ -= c; }
    inline void _become( const _base_iterator& i ) { iter_ = i.iter_; string_ = i.string_; }
    inline bool _test_begin() const { return iter_ == string_->m_data.begin(); }
    inline bool _test_end() const { return iter_ == string_->m_data.end(); }
    inline size_type _get_index() const { return iter_ - string_->m_data.begin(); }
    inline void _jump_to( size_type index ) { iter_ = string_->m_data.begin() + index; }
    
    unicode_char _getCharacter() const;
    int _setCharacter( unicode_char uc );
    void _moveNext();
    void _movePrev();
    
    dstring::iterator iter_;
    UTFString* string_;
  };
  
  //////////////////////////////////////////////////////////////////////////
  // FORWARD ITERATORS
  
  class _const_fwd_iterator; // forward declaration
  
  //! forward iterator for UTFString
  class CC_CORE_API _fwd_iterator: public _base_iterator
  {
    friend class _const_fwd_iterator;
  public:
    _fwd_iterator() {}
    _fwd_iterator( const _fwd_iterator& i ) { _become( i ); }
    
    //! pre-increment
    inline _fwd_iterator& operator++()
    {
      _seekFwd( 1 );
      return *this;
    }
    
    //! post-increment
    inline _fwd_iterator operator++( int )
    {
      _fwd_iterator tmp( *this );
      _seekFwd( 1 );
      return tmp;
    }
    
    //! pre-decrement
    inline _fwd_iterator& operator--()
    {
      _seekRev( 1 );
      return *this;
    }
    
    //! post-decrement
    inline _fwd_iterator operator--( int )
    {
      _fwd_iterator tmp( *this );
      _seekRev( 1 );
      return tmp;
    }
    
    //! addition operator
    inline _fwd_iterator operator+( difference_type n )
    {
      _fwd_iterator tmp( *this );
      if ( n < 0 )
        tmp._seekRev( -n );
      else
        tmp._seekFwd( n );
      return tmp;
    }
    
    //! subtraction operator
    inline _fwd_iterator operator-( difference_type n )
    {
      _fwd_iterator tmp( *this );
      if ( n < 0 )
        tmp._seekFwd( -n );
      else
        tmp._seekRev( n );
      return tmp;
    }
    
    //! addition assignment operator
    inline _fwd_iterator& operator+=( difference_type n )
    {
      if ( n < 0 )
        _seekRev( -n );
      else
        _seekFwd( n );
      return *this;
    }
    
    //! subtraction assignment operator
    inline _fwd_iterator& operator-=( difference_type n )
    {
      if ( n < 0 )
        _seekFwd( -n );
      else
        _seekRev( n );
      return *this;
    }
    
    //! dereference operator
    inline value_type& operator*() const { return *iter_; }
    
    //! dereference at offset operator
    inline value_type& operator[]( difference_type n ) const
    {
      _fwd_iterator tmp( *this );
      tmp += n;
      return *tmp;
    }
    
    //! advances to the next Unicode character, honoring surrogate pairs in the UTF-16 stream
    inline _fwd_iterator& moveNext()
    {
      _moveNext();
      return *this;
    }
    
    //! rewinds to the previous Unicode character, honoring surrogate pairs in the UTF-16 stream
    inline _fwd_iterator& movePrev()
    {
      _movePrev();
      return *this;
    }
    
    //! Returns the Unicode value of the character at the current position (decodes surrogate pairs if needed)
    inline unicode_char getCharacter() const { return _getCharacter(); }
    //! Sets the Unicode value of the character at the current position (adding a surrogate pair if needed); returns the amount of string length change caused by the operation
    inline int setCharacter( unicode_char uc ) { return _setCharacter( uc ); }
  };
  
  //////////////////////////////////////////////////////////////////////////
  //! const forward iterator for UTFString
  class CC_CORE_API _const_fwd_iterator: public _base_iterator
  {
  public:
    _const_fwd_iterator() {}
    _const_fwd_iterator( const _const_fwd_iterator& i ) { _become( i ); }
    _const_fwd_iterator( const _fwd_iterator& i ) { _become( i ); }
    
    //! pre-increment
    inline _const_fwd_iterator& operator++()
    {
      _seekFwd( 1 );
      return *this;
    }
    
    //! post-increment
    inline _const_fwd_iterator operator++( int )
    {
      _const_fwd_iterator tmp( *this );
      _seekFwd( 1 );
      return tmp;
    }
    
    //! pre-decrement
    inline _const_fwd_iterator& operator--()
    {
      _seekRev( 1 );
      return *this;
    }
    
    //! post-decrement
    inline _const_fwd_iterator operator--( int )
    {
      _const_fwd_iterator tmp( *this );
      _seekRev( 1 );
      return tmp;
    }
    
    //! addition operator
    inline _const_fwd_iterator operator+( difference_type n )
    {
      _const_fwd_iterator tmp( *this );
      if ( n < 0 )
        tmp._seekRev( -n );
      else
        tmp._seekFwd( n );
      return tmp;
    }
    
    //! subtraction operator
    inline _const_fwd_iterator operator-( difference_type n )
    {
      _const_fwd_iterator tmp( *this );
      if ( n < 0 )
        tmp._seekFwd( -n );
      else
        tmp._seekRev( n );
      return tmp;
    }
    
    //! addition assignment operator
    inline _const_fwd_iterator& operator+=( difference_type n )
    {
      if ( n < 0 )
        _seekRev( -n );
      else
        _seekFwd( n );
      return *this;
    }
    
    //! subtraction assignment operator
    inline _const_fwd_iterator& operator-=( difference_type n )
    {
      if ( n < 0 )
        _seekFwd( -n );
      else
        _seekRev( n );
      return *this;
    }
    
    //! dereference operator
    inline const value_type& operator*() const { return *iter_; }
    
    //! dereference at offset operator
    inline const value_type& operator[]( difference_type n ) const
    {
      _const_fwd_iterator tmp( *this );
      tmp += n;
      return *tmp;
    }
    
    //! advances to the next Unicode character, honoring surrogate pairs in the UTF-16 stream
    inline _const_fwd_iterator& moveNext()
    {
      _moveNext();
      return *this;
    }
    
    //! rewinds to the previous Unicode character, honoring surrogate pairs in the UTF-16 stream
    inline _const_fwd_iterator& movePrev()
    {
      _movePrev();
      return *this;
    }
    
    //! Returns the Unicode value of the character at the current position (decodes surrogate pairs if needed)
    inline unicode_char getCharacter() const { return _getCharacter(); }
    
    //! difference operator
    friend size_type operator-( const _const_fwd_iterator& left, const _const_fwd_iterator& right );
    //! equality operator
    friend bool operator==( const _const_fwd_iterator& left, const _const_fwd_iterator& right );
    //! inequality operator
    friend bool operator!=( const _const_fwd_iterator& left, const _const_fwd_iterator& right );
    //! less than
    friend bool operator<( const _const_fwd_iterator& left, const _const_fwd_iterator& right );
    //! less than or equal
    friend bool operator<=( const _const_fwd_iterator& left, const _const_fwd_iterator& right );
    //! greater than
    friend bool operator>( const _const_fwd_iterator& left, const _const_fwd_iterator& right );
    //! greater than or equal
    friend bool operator>=( const _const_fwd_iterator& left, const _const_fwd_iterator& right );
  };
  
  //////////////////////////////////////////////////////////////////////////
  // REVERSE ITERATORS
  
  class _const_rev_iterator; // forward declaration
  //! forward iterator for UTFString
  class CC_CORE_API _rev_iterator: public _base_iterator
  {
    friend class _const_rev_iterator;
  public:
    _rev_iterator() {}
    _rev_iterator( const _rev_iterator& i ) { _become( i ); }
    
    //! pre-increment
    inline _rev_iterator& operator++()
    {
      _seekRev( 1 );
      return *this;
    }
    
    //! post-increment
    inline _rev_iterator operator++( int )
    {
      _rev_iterator tmp( *this );
      _seekRev( 1 );
      return tmp;
    }
    
    //! pre-decrement
    inline _rev_iterator& operator--()
    {
      _seekFwd( 1 );
      return *this;
    }
    
    //! post-decrement
    inline _rev_iterator operator--( int )
    {
      _rev_iterator tmp( *this );
      _seekFwd( 1 );
      return tmp;
    }
    
    //! addition operator
    inline _rev_iterator operator+( difference_type n )
    {
      _rev_iterator tmp( *this );
      if ( n < 0 )
        tmp._seekFwd( -n );
      else
        tmp._seekRev( n );
      return tmp;
    }
    
    //! subtraction operator
    inline _rev_iterator operator-( difference_type n )
    {
      _rev_iterator tmp( *this );
      if ( n < 0 )
        tmp._seekRev( -n );
      else
        tmp._seekFwd( n );
      return tmp;
    }
    
    //! addition assignment operator
    inline _rev_iterator& operator+=( difference_type n )
    {
      if ( n < 0 )
        _seekFwd( -n );
      else
        _seekRev( n );
      return *this;
    }
    
    //! subtraction assignment operator
    inline _rev_iterator& operator-=( difference_type n )
    {
      if ( n < 0 )
        _seekRev( -n );
      else
        _seekFwd( n );
      return *this;
    }
    
    //! dereference operator
    inline value_type& operator*() const { return iter_[-1]; }
    
    //! dereference at offset operator
    inline value_type& operator[]( difference_type n ) const
    {
      _rev_iterator tmp( *this );
      tmp -= n;
      return *tmp;
    }
  };
  
  //////////////////////////////////////////////////////////////////////////
  //! const reverse iterator for UTFString
  
  class CC_CORE_API _const_rev_iterator: public _base_iterator
  {
  public:
    _const_rev_iterator() {}
    _const_rev_iterator( const _const_rev_iterator& i ) { _become( i ); }
    _const_rev_iterator( const _rev_iterator& i ) { _become( i ); }
    
    //! pre-increment
    inline _const_rev_iterator& operator++()
    {
      _seekRev( 1 );
      return *this;
    }
    
    //! post-increment
    inline _const_rev_iterator operator++( int )
    {
      _const_rev_iterator tmp( *this );
      _seekRev( 1 );
      return tmp;
    }
    
    //! pre-decrement
    inline _const_rev_iterator& operator--()
    {
      _seekFwd( 1 );
      return *this;
    }
    
    //! post-decrement
    inline _const_rev_iterator operator--( int )
    {
      _const_rev_iterator tmp( *this );
      _seekFwd( 1 );
      return tmp;
    }
    
    //! addition operator
    inline _const_rev_iterator operator+( difference_type n )
    {
      _const_rev_iterator tmp( *this );
      if ( n < 0 )
        tmp._seekFwd( -n );
      else
        tmp._seekRev( n );
      return tmp;
    }
    
    //! subtraction operator
    inline _const_rev_iterator operator-( difference_type n )
    {
      _const_rev_iterator tmp( *this );
      if ( n < 0 )
        tmp._seekRev( -n );
      else
        tmp._seekFwd( n );
      return tmp;
    }
    
    //! addition assignment operator
    inline _const_rev_iterator& operator+=( difference_type n )
    {
      if ( n < 0 )
        _seekFwd( -n );
      else
        _seekRev( n );
      return *this;
    }
    
    //! subtraction assignment operator
    inline _const_rev_iterator& operator-=( difference_type n )
    {
      if ( n < 0 )
        _seekRev( -n );
      else
        _seekFwd( n );
      return *this;
    }
    
    //! dereference operator
    inline const value_type& operator*() const { return iter_[-1]; }
    
    //! dereference at offset operator
    inline const value_type& operator[]( difference_type n ) const
    {
      _const_rev_iterator tmp( *this );
      tmp -= n;
      return *tmp;
    }
    
    //! difference operator
    friend size_type operator-( const _const_rev_iterator& left, const _const_rev_iterator& right );
    //! equality operator
    friend bool operator==( const _const_rev_iterator& left, const _const_rev_iterator& right );
    //! inequality operator
    friend bool operator!=( const _const_rev_iterator& left, const _const_rev_iterator& right );
    //! less than
    friend bool operator<( const _const_rev_iterator& left, const _const_rev_iterator& right );
    //! less than or equal
    friend bool operator<=( const _const_rev_iterator& left, const _const_rev_iterator& right );
    //! greater than
    friend bool operator>( const _const_rev_iterator& left, const _const_rev_iterator& right );
    //! greater than or equal
    friend bool operator>=( const _const_rev_iterator& left, const _const_rev_iterator& right );
  };
  
  //////////////////////////////////////////////////////////////////////////
  
  typedef _fwd_iterator iterator;                     //!< iterator
  typedef _rev_iterator reverse_iterator;             //!< reverse iterator
  typedef _const_fwd_iterator const_iterator;         //!< const iterator
  typedef _const_rev_iterator const_reverse_iterator; //!< const reverse iterator
  
  //!\name Constructors/Destructor
  //@{
  //! default constructor, creates an empty string
  UTFString() { _init(); }
  //! copy constructor
  UTFString(const UTFString& copy) { _init(); m_data = copy.m_data; }
  //! \a length copies of \a ch
  UTFString(size_type length, const code_point& ch) { _init(); assign( length, ch ); }
  //! duplicate of nul-terminated sequence \a str
  UTFString(const code_point* str) { _init(); assign( str ); }
  //! duplicate of \a str, \a length code points long
  UTFString(const code_point* str, size_type length) { _init(); assign( str, length ); }
  //! substring of \a str starting at \a index and \a length code points long
  UTFString(const UTFString& str, size_type index, size_type length) { _init(); assign( str, index, length ); }
#if CC_IS_NATIVE_WCHAR_T
  //! duplicate of nul-terminated \c wchar_t array
  UTFString(const wchar_t* w_str) { _init(); assign( w_str ); }
  //! duplicate of \a w_str, \a length characters long
  UTFString(const wchar_t* w_str, size_type length) { _init(); assign( w_str, length ); }
#endif
  
  //! duplicate of nul-terminated C-string \a c_str (UTF-8 encoding)
  UTFString(const char* c_str) { _init(); assign( c_str ); }
  //! duplicate of \a c_str, \a length characters long (UTF-8 encoding)
  UTFString(const char* c_str, size_type length) { _init(); assign( c_str, length ); }
  //! duplicate of \a str (UTF-8 encoding)
  UTFString(const String& str) { _init(); assign(str); }
  //! duplicate of \a wstr
  UTFString(const WString& wstr) { _init(); assign(wstr); }
  
  //! destructor
  ~UTFString() { _cleanBuffer(); }
  
  //////////////////////////////////////////////////////////////////////////
  // Utility functions
  
  //! Returns the number of code points in the current string
  inline size_type size() const { return m_data.size(); }
  //! Returns the number of code points in the current string
  inline size_type length() const { return size(); }
  //! Returns the number of Unicode characters in the string
  /*! Executes in linear time. */
  inline size_type length_Characters() const {
    const_iterator i = begin(), ie = end();
    size_type c = 0;
    while ( i != ie ) {
      i.moveNext();
      ++c;
    }
    return c;
  }
  //! returns the maximum number of UTF-16 code points that the string can hold
  inline size_type max_size() const { return m_data.max_size(); }
  //! sets the capacity of the string to at least \a size code points
  inline void reserve( size_type size ) { m_data.reserve( size ); }
  //! changes the size of the string to \a size, filling in any new area with \a val
  inline void resize( size_type num, const code_point& val = 0 ) { m_data.resize( num, val ); }
  //! exchanges the elements of the current string with those of \a from
  inline void swap( UTFString& from ) { m_data.swap( from.m_data ); }
  //! returns \c true if the string has no elements, \c false otherwise
  inline bool empty() const { return m_data.empty(); }
  //! returns a pointer to the first character in the current string
  inline const code_point* c_str() const { return m_data.c_str(); }
  //! returns a pointer to the first character in the current string
  inline const code_point* data() const { return c_str(); }
  //! returns the number of elements that the string can hold before it will need to allocate more space
  inline size_type capacity() const { return m_data.capacity(); }
  //! deletes all of the elements in the string
  inline void clear() { m_data.clear(); }
  //! returns a substring of the current string, starting at \a index, and \a num characters long.
  /*! If \a num is omitted, it will default to \c UTFString::npos, and the substr() function will simply return the remainder of the string starting at \a index. */
  inline UTFString substr(size_type index, size_type num = npos) const {
    // this could avoid the extra copy if we used a private specialty constructor
    dstring tmpData = m_data.substr( index, num );
    UTFString tmp;
    tmp.m_data.swap( tmpData );
    return tmp;
  }
  //! appends \a val to the end of the string
  inline void push_back(unicode_char val) {
    code_point cp[2] = { 0, 0 };
    size_t c = _utf32_to_utf16( val, cp );
    if ( c > 0 ) push_back( cp[0] );
    if ( c > 1 ) push_back( cp[1] );
  }
#if CC_IS_NATIVE_WCHAR_T
  //! appends \a val to the end of the string
  inline void push_back(wchar_t val) {
    // we do this because the Unicode method still preserves UTF-16 code points
    m_data.push_back(static_cast<code_point>(val));
  }
#endif
  //! appends \a val to the end of the string
  /*! This can be used to push surrogate pair code points, you'll just need to push them
   one after the other. */
  inline void push_back(code_point val) { m_data.push_back( val ); }
  //! appends \a val to the end of the string
  /*! Limited to characters under the 127 value barrier. */
  inline void push_back(char val) { m_data.push_back( static_cast<code_point>( val ) ); }
  //! returns \c true if the given Unicode character \a ch is in this string
  inline bool inString(unicode_char ch) const {
    const_iterator i, ie = end();
    for ( i = begin(); i != ie; i.moveNext() ) {
      if ( i.getCharacter() == ch )
        return true;
    }
    return false;
  }
  
  //////////////////////////////////////////////////////////////////////////
  // Stream variations
  
  //! returns the current string in UTF-8 form within a std::string
  inline const String& asUTF8() const
  {
    _load_buffer_UTF8();
    return *m_buff.m_strBuff;
  }
  
  //! returns the current string in UTF-8 form as a nul-terminated char array
  inline const char* asUTF8_c_str() const
  {
    _load_buffer_UTF8();
    return m_buff.m_strBuff->c_str();
  }
  
  //! returns the current string in the native form of std::wstring
  inline const WString& asWStr() const
  {
    _load_buffer_WStr();
    return *m_buff.m_wstrBuff;
  }
  
  //! returns the current string in the native form of a nul-terminated wchar_t array
  inline const wchar_t* asWStr_c_str() const
  {
    _load_buffer_WStr();
    return m_buff.m_wstrBuff->c_str();
  }
  
  //////////////////////////////////////////////////////////////////////////
  // Single Character Access
  
  //! returns a reference to the element in the string at index \c loc
  inline code_point& at( size_type loc ) { return m_data.at( loc ); }
  //! returns a reference to the element in the string at index \c loc
  inline const code_point& at( size_type loc ) const { return m_data.at( loc ); }
  //! returns the data point \a loc evaluated as a UTF-32 value
  /*! This function will will only properly decode surrogate pairs when \a loc points to the index
   of a lead code point that is followed by a trailing code point. Evaluating the trailing code point
   itself, or pointing to a code point that is a sentinel value (part of a broken pair) will return
   the value of just that code point (not a valid Unicode value, but useful as a sentinel value). */
  unicode_char getChar( size_type loc ) const;
  
  //! sets the value of the character at \a loc to the Unicode value \a ch (UTF-32)
  /*! Providing sentinel values (values between U+D800-U+DFFF) are accepted, but you should be aware
   that you can also unwittingly create a valid surrogate pair if you don't pay attention to what you
   are doing. @note This operation may also lengthen the string if a surrogate pair is needed to
   represent the value given, but one is not available to replace; or alternatively shorten the string
   if an existing surrogate pair is replaced with a character that is representable without a surrogate
   pair. The return value will signify any lengthening or shortening performed, returning 0 if no change
   was made, -1 if the string was shortened, or 1 if the string was lengthened. Any single call can
   only change the string length by + or - 1. */
  int setChar( size_type loc, unicode_char ch );
  
  //////////////////////////////////////////////////////////////////////////
  // iterator acquisition
  
  //! returns an iterator to the first element of the string
  inline iterator begin()
  {
    iterator i;
    i.iter_ = m_data.begin();
    i.string_ = this;
    return i;
  }
  //! returns an iterator to the first element of the string
  inline const_iterator begin() const
  {
    const_iterator i;
    i.iter_ = const_cast<UTFString*>(this)->m_data.begin();
    i.string_ = const_cast<UTFString*>(this);
    return i;
  }
  //! returns an iterator just past the end of the string
  inline iterator end()
  {
    iterator i;
    i.iter_ = m_data.end();
    i.string_ = this;
    return i;
  }
  //! returns an iterator just past the end of the string
  inline const_iterator end() const
  {
    const_iterator i;
    i.iter_ = const_cast<UTFString*>(this)->m_data.end();
    i.string_ = const_cast<UTFString*>(this);
    return i;
  }
  //! returns a reverse iterator to the last element of the string
  inline reverse_iterator rbegin()
  {
    reverse_iterator i;
    i.iter_ = m_data.end();
    i.string_ = this;
    return i;
  }
  //! returns a reverse iterator to the last element of the string
  inline const_reverse_iterator rbegin() const
  {
    const_reverse_iterator i;
    i.iter_ = const_cast<UTFString*>(this)->m_data.end();
    i.string_ = const_cast<UTFString*>(this);
    return i;
  }
  //! returns a reverse iterator just past the beginning of the string
  inline reverse_iterator rend()
  {
    reverse_iterator i;
    i.iter_ = m_data.begin();
    i.string_ = this;
    return i;
  }
  //! returns a reverse iterator just past the beginning of the string
  inline const_reverse_iterator rend() const {
    const_reverse_iterator i;
    i.iter_ = const_cast<UTFString*>(this)->m_data.begin();
    i.string_ = const_cast<UTFString*>(this);
    return i;
  }
  
  //////////////////////////////////////////////////////////////////////////
  // assign
  
  //! gives the current string the values from \a start to \a end
  inline UTFString& assign( iterator start, iterator end ) {
    m_data.assign(start.iter_, end.iter_);
    return *this;
  }
  
  //! assign \a str to the current string
  inline UTFString& assign( const UTFString& str ) {
    m_data.assign(str.m_data);
    return *this;
  }
  
  //! assign the nul-terminated \a str to the current string
  inline UTFString& assign( const code_point* str ) {
    m_data.assign( str );
    return *this;
  }
  
  //! assign the first \a num characters of \a str to the current string
  inline UTFString& assign( const code_point* str, size_type num ) {
    m_data.assign( str, num );
    return *this;
  }
  
  //! assign \a len entries from \a str to the current string, starting at \a index
  inline UTFString& assign( const UTFString& str, size_type index, size_type len ) {
    m_data.assign( str.m_data, index, len );
    return *this;
  }
  
  //! assign \a num copies of \a ch to the current string
  inline UTFString& assign(size_type num, const code_point& ch) {
    m_data.assign(num, ch);
    return *this;
  }
  
  //! assign \a str to the current string (\a str is treated as a UTF-8 stream)
  UTFString& assign(const String& str);
  //! assign \a wstr to the current string (\a wstr is treated as a UTF-16 stream)
  UTFString& assign(const WString& wstr);
  
#if CC_IS_NATIVE_WCHAR_T
  //! assign \a w_str to the current string
  inline UTFString& assign(const wchar_t* w_str) {
    WString tmp(w_str);
    return assign( tmp );
  }
  
  //! assign the first \a num characters of \a w_str to the current string
  inline UTFString& assign(const wchar_t* w_str, size_type num) {
    WString tmp(w_str, num);
    return assign( tmp );
  }
#endif
  
  //! assign \a c_str to the current string (\a c_str is treated as a UTF-8 stream)
  inline UTFString& assign( const char* c_str ) {
    String tmp( c_str );
    return assign( tmp );
  }
  
  //! assign the first \a num characters of \a c_str to the current string (\a c_str is treated as a UTF-8 stream)
  inline UTFString& assign( const char* c_str, size_type num ) {
    String tmp(c_str, num);
    return assign( tmp );
  }
  
  //////////////////////////////////////////////////////////////////////////
  // append
  
  //! appends \a str on to the end of the current string
  inline UTFString& append(const UTFString& str) { m_data.append(str.m_data); return *this; }
  //! appends \a str on to the end of the current string
  inline UTFString& append(const code_point* str) { m_data.append(str); return *this; }
  //! appends a substring of \a str starting at \a index that is \a len characters long on to the end of the current string
  inline UTFString& append(const UTFString& str, size_type index, size_type len) { m_data.append( str.m_data, index, len ); return *this; }
  //! appends \a num characters of \a str on to the end of the current string
  inline UTFString& append(const code_point* str, size_type num) { m_data.append( str, num ); return *this; }
  //! appends \a num repetitions of \a ch on to the end of the current string
  inline UTFString& append(size_type num, code_point ch) { m_data.append( num, ch ); return *this; }
  //! appends the sequence denoted by \a start and \a end on to the end of the current string
  inline UTFString& append(iterator start, iterator end) { m_data.append( start.iter_, end.iter_ ); return *this; }
#if CC_IS_NATIVE_WCHAR_T
  //! appends \a num characters of \a str on to the end of the current string
  inline UTFString& append(const wchar_t* w_str, size_type num) { WString tmp( w_str, num ); return append( tmp ); }
  //! appends \a num repetitions of \a ch on to the end of the current string
  inline UTFString& append(size_type num, wchar_t ch) { return append( num, static_cast<unicode_char>( ch ) ); }
#endif
  //! appends \a num characters of \a str on to the end of the current string  (UTF-8 encoding)
  inline UTFString& append(const char* c_str, size_type num) {
    UTFString tmp( c_str, num );
    append( tmp );
    return *this;
  }
  
  //! appends \a num repetitions of \a ch on to the end of the current string (Unicode values less than 128)
  inline UTFString& append(size_type num, char ch) {
    append( num, static_cast<code_point>( ch ) );
    return *this;
  }
  
  //! appends \a num repetitions of \a ch on to the end of the current string (Full Unicode spectrum)
  UTFString& append( size_type num, unicode_char ch );
  
  //////////////////////////////////////////////////////////////////////////
  // insert
  
  //! inserts \a ch before the code point denoted by \a i
  inline iterator insert(iterator i, const code_point& ch) {
    iterator ret;
    ret.iter_ = m_data.insert(i.iter_, ch);
    ret.string_ = this;
    return ret;
  }
  
  //! inserts \a str into the current string, at location \a index
  inline UTFString& insert(size_type index, const UTFString& str) {
    m_data.insert( index, str.m_data );
    return *this;
  }
  
  //! inserts \a str into the current string, at location \a index
  inline UTFString& insert(size_type index, const code_point* str) {
    m_data.insert( index, str );
    return *this;
  }
  //! inserts a substring of \a str (starting at \a index2 and \a num code points long) into the current string, at location \a index1
  inline UTFString& insert(size_type index1, const UTFString& str, size_type index2, size_type num) {
    m_data.insert( index1, str.m_data, index2, num );
    return *this;
  }
  
  //! inserts the code points denoted by \a start and \a end into the current string, before the code point specified by \a i
  inline void insert(iterator i, iterator start, iterator end) { m_data.insert( i.iter_, start.iter_, end.iter_ ); }
  
  //! inserts \a num code points of \a str into the current string, at location \a index
  inline UTFString& insert(size_type index, const code_point* str, size_type num) {
    m_data.insert(index, str, num);
    return *this;
  }
  
#if CC_IS_NATIVE_WCHAR_T
  //! inserts \a num code points of \a str into the current string, at location \a index
  inline UTFString& insert(size_type index, const wchar_t* w_str, size_type num) {
    UTFString tmp(w_str, num);
    insert(index, tmp);
    return *this;
  }
#endif
  //! inserts \a num code points of \a str into the current string, at location \a index
  inline UTFString& insert(size_type index, const char* c_str, size_type num) {
    UTFString tmp(c_str, num);
    insert(index, tmp);
    return *this;
  }
  
  //! inserts \a num copies of \a ch into the current string, at location \a index
  inline UTFString& insert(size_type index, size_type num, code_point ch) {
    m_data.insert( index, num, ch );
    return *this;
  }
  
#if CC_IS_NATIVE_WCHAR_T
  //! inserts \a num copies of \a ch into the current string, at location \a index
  inline UTFString& insert(size_type index, size_type num, wchar_t ch) {
    insert( index, num, static_cast<unicode_char>( ch ) );
    return *this;
  }
#endif
  //! inserts \a num copies of \a ch into the current string, at location \a index
  inline UTFString& insert( size_type index, size_type num, char ch )
  {
    insert( index, num, static_cast<code_point>( ch ) );
    return *this;
  }
  
  //! inserts \a num copies of \a ch into the current string, at location \a index
  UTFString& insert( size_type index, size_type num, unicode_char ch );
  
  //! inserts \a num copies of \a ch into the current string, before the code point denoted by \a i
  inline void insert(iterator i, size_type num, const code_point& ch) { m_data.insert(i.iter_, num, ch ); }
  
#if CC_IS_NATIVE_WCHAR_T
  //! inserts \a num copies of \a ch into the current string, before the code point denoted by \a i
  inline void insert(iterator i, size_type num, const wchar_t& ch) { insert(i, num, static_cast<unicode_char>(ch)); }
#endif
  
  //! inserts \a num copies of \a ch into the current string, before the code point denoted by \a i
  inline void insert(iterator i, size_type num, const char& ch) { insert( i, num, static_cast<code_point>(ch)); }
  //! inserts \a num copies of \a ch into the current string, before the code point denoted by \a i
  void insert(iterator i, size_type num, const unicode_char& ch);
  
  //////////////////////////////////////////////////////////////////////////
  // erase
  
  //! removes the code point pointed to by \a loc, returning an iterator to the next character
  inline iterator erase( iterator loc ) {
    iterator ret;
    ret.iter_ = m_data.erase(loc.iter_);
    ret.string_ = this;
    return ret;
  }
  //! removes the code points between \a start and \a end (including the one at \a start but not the one at \a end), returning an iterator to the code point after the last code point removed
  inline iterator erase(iterator start, iterator last) {
    iterator ret;
    ret.iter_ = m_data.erase(start.iter_, last.iter_);
    ret.string_ = this;
    return ret;
  }
  //! removes \a num code points from the current string, starting at \a index
  inline UTFString& erase(size_type index = 0, size_type num = npos) {
    if (num == npos)
      m_data.erase(index);
    else
      m_data.erase(index, num);
    return *this;
  }
  
  //////////////////////////////////////////////////////////////////////////
  // replace
  
  //! replaces up to \a num1 code points of the current string (starting at \a index1) with \a str
  inline UTFString& replace(size_type index1, size_type num1, const UTFString& str) {
    m_data.replace(index1, num1, str.m_data, 0, npos);
    return *this;
  }
  
  //! replaces up to \a num1 code points of the current string (starting at \a index1) with up to \a num2 code points from \a str
  inline UTFString& replace(size_type index1, size_type num1, const UTFString& str, size_type num2) {
    m_data.replace(index1, num1, str.m_data, 0, num2);
    return *this;
  }
  
  //! replaces up to \a num1 code points of the current string (starting at \a index1) with up to \a num2 code points from \a str beginning at \a index2
  inline UTFString& replace(size_type index1, size_type num1, const UTFString& str, size_type index2, size_type num2) {
    m_data.replace(index1, num1, str.m_data, index2, num2);
    return *this;
  }
  
  //! replaces code points in the current string from \a start to \a end with \a num code points from \a str
  inline UTFString& replace(iterator start, iterator end, const UTFString& str, size_type num = npos) {
    _const_fwd_iterator st(start); //Work around for gcc, allow it to find correct overload
    
    size_type index1 = begin() - st;
    size_type num1 = end - st;
    return replace( index1, num1, str, 0, num );
  }
  
  //! replaces up to \a num1 code points in the current string (beginning at \a index) with \c num2 copies of \c ch
  inline UTFString& replace(size_type index, size_type num1, size_type num2, code_point ch) {
    m_data.replace( index, num1, num2, ch );
    return *this;
  }
  
  //! replaces the code points in the current string from \a start to \a end with \a num copies of \a ch
  inline UTFString& replace(iterator start, iterator end, size_type num, code_point ch) {
    _const_fwd_iterator st(start); //Work around for gcc, allow it to find correct overload
    size_type index1 = begin() - st;
    size_type num1 = end - st;
    return replace( index1, num1, num, ch );
  }
  
  //////////////////////////////////////////////////////////////////////////
  // compare
  
  //! compare \a str to the current string
  inline int compare(const UTFString& str) const { return m_data.compare( str.m_data ); }
  //! compare \a str to the current string
  inline int compare(const code_point* str) const { return m_data.compare( str ); }
  //! compare \a str to a substring of the current string, starting at \a index for \a length characters
  inline int compare(size_type index, size_type length, const UTFString& str) const { return m_data.compare( index, length, str.m_data ); }
  //! compare a substring of \a str to a substring of the current string, where \a index2 and \a length2 refer to \a str and \a index and \a length refer to the current string
  inline int compare(size_type index, size_type length, const UTFString& str, size_type index2, size_type length2) const { return m_data.compare( index, length, str.m_data, index2, length2 ); }
  //! compare a substring of \a str to a substring of the current string, where the substring of \a str begins at zero and is \a length2 characters long, and the substring of the current string begins at \a index and is \a length  characters long
  inline int compare(size_type index, size_type length, const code_point* str, size_type length2) const { return m_data.compare( index, length, str, length2 ); }
#if CC_IS_NATIVE_WCHAR_T
  //! compare a substring of \a str to a substring of the current string, where the substring of \a str begins at zero and is \a length2 elements long, and the substring of the current string begins at \a index and is \a length characters long
  inline int compare(size_type index, size_type length, const wchar_t* w_str, size_type length2) const {
    UTFString tmp(w_str, length2);
    return compare( index, length, tmp );
  }
#endif
  //! compare a substring of \a str to a substring of the current string, where the substring of \a str begins at zero and is \a length2 <b>UTF-8 code points</b> long, and the substring of the current string begins at \a index and is \a length characters long
  inline int compare(size_type index, size_type length, const char* c_str, size_type length2) const {
    UTFString tmp(c_str, length2);
    return compare(index, length, tmp);
  }
  
  //////////////////////////////////////////////////////////////////////////
  // find & rfind
  
  //! returns the index of the first occurrence of \a str within the current string, starting at \a index; returns \c UTFString::npos if nothing is found
  /*! \a str is a UTF-16 encoded string, but through implicit casting can also be a UTF-8 encoded string (const char* or std::string) */
  inline size_type find(const UTFString& str, size_type index = 0) const { return m_data.find(str.c_str(), index); }
  //! returns the index of the first occurrence of \a str within the current string and within \a length code points, starting at \a index; returns \c UTFString::npos if nothing is found
  /*! \a cp_str is a UTF-16 encoded string */
  inline size_type find(const code_point* cp_str, size_type index, size_type length) const {
    UTFString tmp( cp_str );
    return m_data.find( tmp.c_str(), index, length );
  }
  //! returns the index of the first occurrence of \a str within the current string and within \a length code points, starting at \a index; returns \c UTFString::npos if nothing is found
  /*! \a cp_str is a UTF-8 encoded string */
  inline size_type find(const char* c_str, size_type index, size_type length) const {
    UTFString tmp( c_str );
    return m_data.find( tmp.c_str(), index, length );
  }
#if CC_IS_NATIVE_WCHAR_T
  //! returns the index of the first occurrence of \a str within the current string and within \a length code points, starting at \a index; returns \c UTFString::npos if nothing is found
  /*! \a cp_str is a UTF-16 encoded string */
  inline size_type find(const wchar_t* w_str, size_type index, size_type length) const {
    UTFString tmp( w_str );
    return m_data.find( tmp.c_str(), index, length );
  }
#endif
  //! returns the index of the first occurrence \a ch within the current string, starting at \a index; returns \c UTFString::npos if nothing is found
  /*! \a ch is only capable of representing Unicode values up to U+007F (127) */
  inline size_type find( char ch, size_type index = 0 ) const { return find( static_cast<code_point>( ch ), index ); }
  //! returns the index of the first occurrence \a ch within the current string, starting at \a index; returns \c UTFString::npos if nothing is found
  /*! \a ch is only capable of representing Unicode values up to U+FFFF (65535) */
  inline size_type find(code_point ch, size_type index = 0) const { return m_data.find( ch, index ); }
#if CC_IS_NATIVE_WCHAR_T
  //! returns the index of the first occurrence \a ch within the current string, starting at \a index; returns \c UTFString::npos if nothing is found
  /*! \a ch is only capable of representing Unicode values up to U+FFFF (65535) */
  inline size_type find(wchar_t ch, size_type index = 0) const { return find( static_cast<unicode_char>( ch ), index ); }
#endif
  //! returns the index of the first occurrence \a ch within the current string, starting at \a index; returns \c UTFString::npos if nothing is found
  /*! \a ch can fully represent any Unicode character */
  inline size_type find(unicode_char ch, size_type index = 0) const {
    code_point cp[3] = {0, 0, 0};
    size_t l = _utf32_to_utf16( ch, cp );
    return find( UTFString( cp, l ), index );
  }
  
  //! returns the location of the first occurrence of \a str in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type rfind(const UTFString& str, size_type index = 0) const { return m_data.rfind( str.c_str(), index ); }
  //! returns the location of the first occurrence of \a str in the current string, doing a reverse search from \a index, searching at most \a num characters; returns \c UTFString::npos if nothing is found
  inline size_type rfind(const code_point* cp_str, size_type index, size_type num) const {
    UTFString tmp( cp_str );
    return m_data.rfind( tmp.c_str(), index, num );
  }
  //! returns the location of the first occurrence of \a str in the current string, doing a reverse search from \a index, searching at most \a num characters; returns \c UTFString::npos if nothing is found
  inline size_type rfind(const char* c_str, size_type index, size_type num) const {
    UTFString tmp(c_str);
    return m_data.rfind(tmp.c_str(), index, num);
  }
#if CC_IS_NATIVE_WCHAR_T
  //! returns the location of the first occurrence of \a str in the current string, doing a reverse search from \a index, searching at most \a num characters; returns \c UTFString::npos if nothing is found
  inline size_type rfind(const wchar_t* w_str, size_type index, size_type num) const {
    UTFString tmp( w_str );
    return m_data.rfind( tmp.c_str(), index, num );
  }
#endif
  //! returns the location of the first occurrence of \a ch in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type rfind(char ch, size_type index = 0) const { return rfind( static_cast<code_point>(ch), index); }
  //! returns the location of the first occurrence of \a ch in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type rfind(code_point ch, size_type index) const { return m_data.rfind(ch, index); }
#if CC_IS_NATIVE_WCHAR_T
  //! returns the location of the first occurrence of \a ch in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type rfind(wchar_t ch, size_type index = 0) const { return rfind( static_cast<unicode_char>( ch ), index ); }
#endif
  //! returns the location of the first occurrence of \a ch in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type rfind(unicode_char ch, size_type index = 0) const {
    code_point cp[3] = {0, 0, 0};
    size_t l = _utf32_to_utf16( ch, cp );
    return rfind( UTFString( cp, l ), index );
  }
  
  //////////////////////////////////////////////////////////////////////////
  //! find_first/last_(not)_of
  
  //! Returns the index of the first character within the current string that matches \b any character in \a str, beginning the search at \a index and searching at most \a num characters; returns \c UTFString::npos if nothing is found
  size_type find_first_of(const UTFString &str, size_type index = 0, size_type num = npos) const;
  //! returns the index of the first occurrence of \a ch in the current string, starting the search at \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_first_of(code_point ch, size_type index = 0) const {
    UTFString tmp;
    tmp.assign( 1, ch );
    return find_first_of( tmp, index );
  }
  //! returns the index of the first occurrence of \a ch in the current string, starting the search at \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_first_of(char ch, size_type index = 0) const { return find_first_of( static_cast<code_point>( ch ), index ); }
#if CC_IS_NATIVE_WCHAR_T
  //! returns the index of the first occurrence of \a ch in the current string, starting the search at \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_first_of(wchar_t ch, size_type index = 0) const { return find_first_of( static_cast<unicode_char>( ch ), index ); }
#endif
  //! returns the index of the first occurrence of \a ch in the current string, starting the search at \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_first_of( unicode_char ch, size_type index = 0 ) const
  {
    code_point cp[3] = {0, 0, 0};
    size_t l = _utf32_to_utf16( ch, cp );
    return find_first_of( UTFString( cp, l ), index );
  }
  
  //! returns the index of the first character within the current string that does not match any character in \a str, beginning the search at \a index and searching at most \a num characters; returns \c UTFString::npos if nothing is found
  size_type find_first_not_of(const UTFString& str, size_type index = 0, size_type num = npos) const;
  //! returns the index of the first character within the current string that does not match \a ch, starting the search at \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_first_not_of(code_point ch, size_type index = 0) const
  {
    UTFString tmp;
    tmp.assign( 1, ch );
    return find_first_not_of(tmp, index);
  }
  //! returns the index of the first character within the current string that does not match \a ch, starting the search at \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_first_not_of(char ch, size_type index = 0) const { return find_first_not_of( static_cast<code_point>( ch ), index ); }
#if CC_IS_NATIVE_WCHAR_T
  //! returns the index of the first character within the current string that does not match \a ch, starting the search at \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_first_not_of(wchar_t ch, size_type index = 0) const { return find_first_not_of( static_cast<unicode_char>( ch ), index ); }
#endif
  //! returns the index of the first character within the current string that does not match \a ch, starting the search at \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_first_not_of(unicode_char ch, size_type index = 0) const
  {
    code_point cp[3] = {0, 0, 0};
    size_t l = _utf32_to_utf16( ch, cp );
    return find_first_not_of( UTFString( cp, l ), index );
  }
  
  //! returns the index of the first character within the current string that matches any character in \a str, doing a reverse search from \a index and searching at most \a num characters; returns \c UTFString::npos if nothing is found
  size_type find_last_of(const UTFString& str, size_type index = npos, size_type num = npos) const;
  
  //! returns the index of the first occurrence of \a ch in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_last_of(code_point ch, size_type index = npos) const
  {
    UTFString tmp;
    tmp.assign( 1, ch );
    return find_last_of(tmp, index);
  }
  
  //! returns the index of the first occurrence of \a ch in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_last_of(char ch, size_type index = npos) const { return find_last_of( static_cast<code_point>( ch ), index ); }
  
#if CC_IS_NATIVE_WCHAR_T
  //! returns the index of the first occurrence of \a ch in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_last_of( wchar_t ch, size_type index = npos ) const { return find_last_of( static_cast<unicode_char>( ch ), index ); }
#endif
  //! returns the index of the first occurrence of \a ch in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_last_of( unicode_char ch, size_type index = npos ) const {
    code_point cp[3] = {0, 0, 0};
    size_t l = _utf32_to_utf16( ch, cp );
    return find_last_of( UTFString( cp, l ), index );
  }
  
  //! returns the index of the last character within the current string that does not match any character in \a str, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  size_type find_last_not_of(const UTFString& str, size_type index = npos, size_type num = npos) const;
  
  //! returns the index of the last occurrence of a character that does not match \a ch in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_last_not_of(code_point ch, size_type index = npos) const {
    UTFString tmp;
    tmp.assign( 1, ch );
    return find_last_not_of( tmp, index );
  }
  
  //! returns the index of the last occurrence of a character that does not match \a ch in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_last_not_of(char ch, size_type index = npos) const { return find_last_not_of( static_cast<code_point>( ch ), index ); }
  
#if CC_IS_NATIVE_WCHAR_T
  //! returns the index of the last occurrence of a character that does not match \a ch in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_last_not_of(wchar_t ch, size_type index = npos) const { return find_last_not_of( static_cast<unicode_char>( ch ), index ); }
#endif
  //! returns the index of the last occurrence of a character that does not match \a ch in the current string, doing a reverse search from \a index; returns \c UTFString::npos if nothing is found
  inline size_type find_last_not_of(unicode_char ch, size_type index = npos) const {
    code_point cp[3] = {0, 0, 0};
    size_t l = _utf32_to_utf16( ch, cp );
    return find_last_not_of( UTFString( cp, l ), index );
  }
  
  //////////////////////////////////////////////////////////////////////////
  // Operators
  
  //! less than operator
  inline bool operator<( const UTFString& right ) const { return compare( right ) < 0; }
  //! less than or equal operator
  inline bool operator<=( const UTFString& right ) const { return compare( right ) <= 0; }
  //! greater than operator
  inline bool operator>( const UTFString& right ) const { return compare( right ) > 0; }
  //! greater than or equal operator
  inline bool operator>=( const UTFString& right ) const { return compare( right ) >= 0; }
  //! equality operator
  inline bool operator==( const UTFString& right ) const { return compare( right ) == 0; }
  //! inequality operator
  inline bool operator!=( const UTFString& right ) const { return !operator==( right ); }
  //! assignment operator, implicitly casts all compatible types
  inline UTFString& operator=( const UTFString& s ) { return assign( s ); }
  //! assignment operator
  inline UTFString& operator=( code_point ch ) {
    clear();
    return append( 1, ch );
  }
  //! assignment operator
  inline UTFString& operator=( char ch ) {
    clear();
    return append( 1, ch );
  }
#if CC_IS_NATIVE_WCHAR_T
  //! assignment operator
  inline UTFString& operator=( wchar_t ch ) {
    clear();
    return append( 1, ch );
  }
#endif
  //! assignment operator
  inline UTFString& operator=( unicode_char ch ) {
    clear();
    return append( 1, ch );
  }
  //! code point dereference operator
  inline code_point& operator[]( size_type index ) { return at( index ); }
  //! code point dereference operator
  inline const code_point& operator[]( size_type index ) const{ return at( index ); }
  
  //////////////////////////////////////////////////////////////////////////
  // Implicit Cast Operators
  
  //! implicit cast to string
  inline operator String() const { return String(asUTF8()); }
  //! implicit cast to wstring
  inline operator WString() const { return WString(asWStr()); }
  
  //////////////////////////////////////////////////////////////////////////
  // UTF-16 character encoding/decoding
  
  //! returns \c true if \a cp does not match the signature for the lead of follow code point of a surrogate pair in a UTF-16 sequence
  inline static bool _utf16_independent_char( code_point cp ) {
    /*
     if ( 0xD800 <= cp && cp <= 0xDFFF ) // tests if the cp is within the surrogate pair range
     return false; // it matches a surrogate pair signature
     return true; // everything else is a standalone code point
     */
    return ( 0xD800 > cp || cp > 0xDFFF );
  }
  
  //! returns \c true if \a cp matches the signature of a surrogate pair lead character
  inline static bool _utf16_surrogate_lead( code_point cp ) {
    /*
     if ( 0xD800 <= cp && cp <= 0xDBFF ) // tests if the cp is within the 2nd word of a surrogate pair
     return true; // it is a 1st word
     return false; // it isn't
     */
    
    return ( 0xD800 <= cp && cp <= 0xDBFF );
  }
  
  //! returns \c true if \a cp matches the signature of a surrogate pair following character
  inline static bool _utf16_surrogate_follow( code_point cp ) {
    /*
     if ( 0xDC00 <= cp && cp <= 0xDFFF ) // tests if the cp is within the 2nd word of a surrogate pair
     return true; // it is a 2nd word
     return false; // everything else isn't
     */
    
    return ( 0xDC00 <= cp && cp <= 0xDFFF );
  }
  
  //! estimates the number of UTF-16 code points in the sequence starting with \a cp
  inline static size_t _utf16_char_length( code_point cp ) {
    /*
     if ( 0xD800 <= cp && cp <= 0xDBFF ) // test if cp is the beginning of a surrogate pair
     return 2; // if it is, then we are 2 words long
     return 1; // otherwise we are only 1 word long
     */
    
    return ( 0xD800 <= cp && cp <= 0xDBFF )? 2 : 1;
  }
  
  //! returns the number of UTF-16 code points needed to represent the given UTF-32 character \a cp
  inline static size_t _utf16_char_length( unicode_char uc ) {
    /*
     if ( uc > 0xFFFF ) // test if uc is greater than the single word maximum
     return 2; // if so, we need a surrogate pair
     return 1; // otherwise we can stuff it into a single word
     */
    
    return ( uc > 0xFFFF ? 2 : 1);
  }
  
  //! converts the given UTF-16 character buffer \a in_cp to a single UTF-32 Unicode character \a out_uc, returns the number of code points used to create the output character (2 for surrogate pairs, otherwise 1)
  /*! This function does it's best to prevent error conditions, verifying complete
   surrogate pairs before applying the algorithm. In the event that half of a pair
   is found it will happily generate a value in the 0xD800 - 0xDFFF range, which is
   normally an invalid Unicode value but we preserve them for use as sentinel values. */
  static size_t _utf16_to_utf32( const code_point in_cp[2], unicode_char& out_uc );
  
  //! writes the given UTF-32 \a uc_in to the buffer location \a out_cp using UTF-16 encoding, returns the number of code points used to encode the input (always 1 or 2)
  /*! This function, like its counterpart, will happily create invalid UTF-16 surrogate pairs. These
   invalid entries will be created for any value of \c in_uc that falls in the range U+D800 - U+DFFF.
   These are generally useful as sentinel values to represent various program specific conditions.
   @note This function will also pass through any single UTF-16 code point without modification,
   making it a safe method of ensuring a stream that is unknown UTF-32 or UTF-16 is truly UTF-16.*/
  static size_t _utf32_to_utf16( const unicode_char& in_uc, code_point out_cp[2] );
  
  //////////////////////////////////////////////////////////////////////////
  // UTF-8 character encoding/decoding
  
  //! returns \c true if \a cp is the beginning of a UTF-8 sequence
  inline static bool _utf8_start_char( unsigned char cp ) { return ( cp & ~_cont_mask ) != _cont; }
  
  //! estimates the number of UTF-8 code points in the sequence starting with \a cp
  static size_t _utf8_char_length( unsigned char cp );
  //! returns the number of UTF-8 code points needed to represent the given UTF-32 character \a cp
  static size_t _utf8_char_length( unicode_char uc );
  
  //! converts the given UTF-8 character buffer to a single UTF-32 Unicode character, returns the number of bytes used to create the output character (maximum of 6)
  static size_t _utf8_to_utf32( const unsigned char in_cp[6], unicode_char& out_uc );
  //! writes the given UTF-32 \a uc_in to the buffer location \a out_cp using UTF-8 encoding, returns the number of bytes used to encode the input
  static size_t _utf32_to_utf8( const unicode_char& in_uc, unsigned char out_cp[6] );
  
  //! verifies a UTF-8 stream, returning the total number of Unicode characters found
  inline static size_type _verifyUTF8( const unsigned char* c_str )
  {
    String tmp( reinterpret_cast<const char*>( c_str ) );
    return _verifyUTF8( tmp );
  }
  
  //! verifies a UTF-8 stream, returning the total number of Unicode characters found
  static size_type _verifyUTF8( const String& str );
  
private:
  //template<class ITER_TYPE> friend class _iterator;
  dstring m_data;
  
  //! buffer data type identifier
  enum BufferType
  {
    BT_NONE,
    BT_STR,
    BT_WSTR,
  };
  
  //! common constructor operations
  inline void _init()
  {
    m_buff.m_voidBuff = 0;
    m_buffType = BT_NONE;
    m_buffSize = 0;
  }
  
  ///////////////////////////////////////////////////////////////////////
  // Scratch buffer
  //! auto cleans the scratch buffer using the proper delete for the stored type
  void _cleanBuffer() const;
  
  //! create a std::string in the scratch buffer area
  void _getBufferStr() const;
  //! create a std::wstring in the scratch buffer area
  void _getBufferWStr() const;
  
  void _load_buffer_UTF8() const;
  void _load_buffer_WStr() const;
  void _load_buffer_UTF32() const;
  
  mutable BufferType m_buffType; // identifies the data type held in mBuffer
  mutable size_t m_buffSize; // size of the CString buffer
  
  // multi-purpose buffer used everywhere we need a throw-away buffer
  union
  {
    mutable void* m_voidBuff;
    mutable String* m_strBuff;
    mutable WString* m_wstrBuff;
  } m_buff;
};

//////////////////////////////////////////////////////////////////////////

//! string addition operator \relates UTFString
inline UTFString operator+( const UTFString& s1, const UTFString& s2 ) { return UTFString( s1 ).append( s2 ); }
//! string addition operator \relates UTFString
inline UTFString operator+( const UTFString& s1, UTFString::code_point c ) { return UTFString( s1 ).append( 1, c ); }
//! string addition operator \relates UTFString
inline UTFString operator+( const UTFString& s1, UTFString::unicode_char c ) { return UTFString( s1 ).append( 1, c ); }
//! string addition operator \relates UTFString
inline UTFString operator+( const UTFString& s1, char c ) { return UTFString( s1 ).append( 1, c ); }

#if CC_IS_NATIVE_WCHAR_T
//! string addition operator \relates UTFString
inline UTFString operator+( const UTFString& s1, wchar_t c ) { return UTFString( s1 ).append( 1, c ); }
#endif

//! string addition operator \relates UTFString
inline UTFString operator+( UTFString::code_point c, const UTFString& s2 ) { return UTFString().append( 1, c ).append( s2 ); }
//! string addition operator \relates UTFString
inline UTFString operator+( UTFString::unicode_char c, const UTFString& s2 ) { return UTFString().append( 1, c ).append( s2 ); }
//! string addition operator \relates UTFString
inline UTFString operator+( char c, const UTFString& s2 ) { return UTFString().append( 1, c ).append( s2 ); }

#if CC_IS_NATIVE_WCHAR_T
//! string addition operator \relates UTFString
inline UTFString operator+( wchar_t c, const UTFString& s2 ) { return UTFString().append( 1, c ).append( s2 ); }
#endif

// (const) forward iterator common operators
inline UTFString::size_type operator-( const UTFString::_const_fwd_iterator& left, const UTFString::_const_fwd_iterator& right ) { return ( left.iter_ - right.iter_ ); }
inline bool operator==( const UTFString::_const_fwd_iterator& left, const UTFString::_const_fwd_iterator& right ) { return left.iter_ == right.iter_; }
inline bool operator!=( const UTFString::_const_fwd_iterator& left, const UTFString::_const_fwd_iterator& right ) { return left.iter_ != right.iter_; }
inline bool operator<( const UTFString::_const_fwd_iterator& left, const UTFString::_const_fwd_iterator& right ) { return left.iter_ < right.iter_; }
inline bool operator<=( const UTFString::_const_fwd_iterator& left, const UTFString::_const_fwd_iterator& right ) { return left.iter_ <= right.iter_; }
inline bool operator>( const UTFString::_const_fwd_iterator& left, const UTFString::_const_fwd_iterator& right ) { return left.iter_ > right.iter_; }
inline bool operator>=( const UTFString::_const_fwd_iterator& left, const UTFString::_const_fwd_iterator& right ) { return left.iter_ >= right.iter_; }

// (const) reverse iterator common operators
// NB: many of these operations are evaluated in reverse because this is a reverse iterator wrapping a forward iterator
inline UTFString::size_type operator-( const UTFString::_const_rev_iterator& left, const UTFString::_const_rev_iterator& right ) { return ( right.iter_ - left.iter_ ); }
inline bool operator==( const UTFString::_const_rev_iterator& left, const UTFString::_const_rev_iterator& right ) { return left.iter_ == right.iter_; }
inline bool operator!=( const UTFString::_const_rev_iterator& left, const UTFString::_const_rev_iterator& right ) { return left.iter_ != right.iter_; }
inline bool operator<( const UTFString::_const_rev_iterator& left, const UTFString::_const_rev_iterator& right ) { return right.iter_ < left.iter_; }
inline bool operator<=( const UTFString::_const_rev_iterator& left, const UTFString::_const_rev_iterator& right ) { return right.iter_ <= left.iter_; }
inline bool operator>( const UTFString::_const_rev_iterator& left, const UTFString::_const_rev_iterator& right ) { return right.iter_ > left.iter_; }
inline bool operator>=( const UTFString::_const_rev_iterator& left, const UTFString::_const_rev_iterator& right ) { return right.iter_ >= left.iter_; }

CC_NAMESPACE_END

#endif // CC_CORE_KERNEL_UTF_STRING_H_
