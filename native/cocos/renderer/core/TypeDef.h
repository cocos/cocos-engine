#ifndef CC_CORE_TYPE_DEF_H_
#define CC_CORE_TYPE_DEF_H_

typedef unsigned int    uint;
typedef unsigned short  ushort;
typedef unsigned long   ulong;

typedef unsigned int    FlagBits;

#define CC_ENUM_OPERATORS(type_) \
CC_INLINE type_ operator | (type_ lhs, type_ rhs) { return (type_)(static_cast<std::underlying_type<type_>::type/**/>(lhs) | static_cast<std::underlying_type<type_>::type/**/>(rhs)); } \
CC_INLINE void operator |= (type_& lhs, type_ rhs) { lhs = (type_)(static_cast<std::underlying_type<type_>::type/**/>(lhs) | static_cast<std::underlying_type<type_>::type/**/>(rhs)); } \
CC_INLINE int operator & (type_ lhs, type_ rhs) { return (int)(static_cast<std::underlying_type<type_>::type/**/>(lhs) & static_cast<std::underlying_type<type_>::type/**/>(rhs)); } \
CC_INLINE void operator &= (type_& lhs, type_ rhs) { lhs = (type_)(static_cast<std::underlying_type<type_>::type/**/>(lhs) & static_cast<std::underlying_type<type_>::type/**/>(rhs)); } \
CC_INLINE bool operator || (type_ lhs, type_ rhs) { return (static_cast<std::underlying_type<type_>::type/**/>(lhs) || static_cast<std::underlying_type<type_>::type/**/>(rhs)); } \
CC_INLINE bool operator && (type_ lhs, type_ rhs) { return (static_cast<std::underlying_type<type_>::type/**/>(lhs) && static_cast<std::underlying_type<type_>::type/**/>(rhs)); }


#endif // CC_CORE_TYPE_DEF_H_
