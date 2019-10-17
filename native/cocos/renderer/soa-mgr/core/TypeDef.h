#ifndef __TYPEDEF_H__
#define __TYPEDEF_H__

#include <inttypes.h>

#if defined(_MSC_VER) && 0
typedef signed char			i8;			//!< 128 to 127
typedef short				i16;		//!< 32,768 to 32,767
typedef int					i32;		//!< 2,147,483,648 to 2,147,483,647
typedef __int64				i64;		//!< 9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
typedef unsigned char		ui8;
typedef unsigned short		ui16;
typedef unsigned int		ui32;
typedef unsigned __int64	ui64;
#else
typedef int8_t				i8;
typedef int16_t				i16;
typedef int32_t				i32;
typedef int64_t				i64;
typedef uint8_t				ui8;
typedef uint16_t			ui16;
typedef uint32_t			ui32;
typedef uint64_t			ui64;
#endif

typedef unsigned int		uint;
typedef unsigned short		ushort;
typedef unsigned long		ulong;
typedef float				real32;		//!< .4E +/- 38 (7 digits)
typedef double				real64;		//!< 1.7E +/- 308 (15 digits)

typedef ui32				Dword;
typedef ui16				Word;
typedef i8					Bool;

typedef ui8					Byte;


typedef ui64				uint64;
typedef i64					int64;
typedef ui32				ui32f;		// ui32 or float
typedef ui32				FlagBits;

#if defined(intptr)
#	undef intptr
#endif
typedef intptr_t			intptr;

#if defined(True)
#	undef True
#endif
#define True	1

#if defined(False)
#	undef False
#endif
#define False	0

#define CC_ENUM_OPERATORS(type_) \
CC_INLINE type_ operator | (type_ lhs, type_ rhs) { return (type_)(static_cast<std::underlying_type<type_>::type/**/>(lhs) | static_cast<std::underlying_type<type_>::type/**/>(rhs)); } \
CC_INLINE void operator |= (type_& lhs, type_ rhs) { lhs = (type_)(static_cast<std::underlying_type<type_>::type/**/>(lhs) | static_cast<std::underlying_type<type_>::type/**/>(rhs)); } \
CC_INLINE type_ operator & (type_ lhs, type_ rhs) { return (type_)(static_cast<std::underlying_type<type_>::type/**/>(lhs) & static_cast<std::underlying_type<type_>::type/**/>(rhs)); } \
CC_INLINE void operator &= (type_& lhs, type_ rhs) { lhs = (type_)(static_cast<std::underlying_type<type_>::type/**/>(lhs) & static_cast<std::underlying_type<type_>::type/**/>(rhs)); } \
CC_INLINE bool operator || (type_ lhs, type_ rhs) { return (static_cast<std::underlying_type<type_>::type/**/>(lhs) || static_cast<std::underlying_type<type_>::type/**/>(rhs)); } \
CC_INLINE bool operator && (type_ lhs, type_ rhs) { return (static_cast<std::underlying_type<type_>::type/**/>(lhs) && static_cast<std::underlying_type<type_>::type/**/>(rhs)); }

#endif
