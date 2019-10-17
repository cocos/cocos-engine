#ifndef __MATHLIB_H__
#define __MATHLIB_H__

#include "../Core/CoreDef.h"

CC_NAMESPACE_BEGIN

namespace Math
{

extern   const float PI;				//!< 3.14159265358979323846264338327950288419716939937511
extern   const float PI_2;				//!< Math::PI * 2.0
extern   const float PI_DIV2;			//!< Math::PI / 2.0
extern   const float PI_DIV3;			//!< Math::PI / 3.0
extern   const float PI_DIV4;			//!< Math::PI / 4.0
extern   const float PI_DIV5;			//!< Math::PI / 5.0
extern   const float PI_DIV6;			//!< Math::PI / 6.0
extern   const float PI_DIV8;			//!< Math::PI / 8.0
extern   const float PI_DIV180;			//!< 180 / Math::PI
extern   const float PI_SQR;			//!< 9.86960440108935861883449099987615113531369940724079
extern   const float PI_INV;			//!< 0.31830988618379067153776752674502872406891929148091
extern   const float EPSILON;			//!< FLT: 1.1920929e-007; DBL: 2.2204460492503131e-016
extern   const float LOWEPSILON;		//!< 1e-04
extern   const float POS_INFINITY;		//!< infinity
extern   const float NEG_INFINITY;		//!< -infinity
extern   const float LN2;				//!< Math::log(2.0)
extern   const float LN10;				//!< Math::log(10.0)
extern   const float INV_LN2;			//!< 1.0f/Math::LN2
extern   const float INV_LN10;			//!< 1.0f/Math::LN10
extern   const float DEG2RAD;			//!< 0.01745329
extern   const float RAD2DEG;			//!< 57.29577
extern   const float EPSILONQUAT;		//!< 0.0001

extern   const float MIN_FLOAT;			//!< 1.175494351e-38F
extern   const float MAX_FLOAT;			//!< 3.402823466e+38F
extern   const double MIN_DOUBLE;		//!< 2.2250738585072014e-308
extern   const double MAX_DOUBLE;		//!< 1.7976931348623158e+308
	
extern   const Byte MAX_BYTE;			//!< 0xff
extern   const short MIN_SHORT;			//!< -32768
extern   const short MAX_SHORT;			//!< 32767
extern   const int MIN_INT;				//!< -2147483648
extern   const int MAX_INT;				//!< 2147483647
extern   const Word MAX_WORD;			//!< 0xffff
extern   const Dword MAX_DWORD;			//!< 0xffffffff
extern   const i8 MIN_I8;				//!< -128
extern   const i8 MAX_I8;				//!< 127
extern   const ui8 MIN_UI8;				//!< 0
extern   const ui8 MAX_UI8;				//!< 0xff
extern   const i16 MIN_I16;				//!< -32768
extern   const i16 MAX_I16;				//!< 32767
extern   const ui16 MIN_UI16;			//!< 0
extern   const ui16 MAX_UI16;			//!< 0xffff
extern   const i32 MIN_I32;				//!< -2147483648
extern   const i32 MAX_I32;				//!< 2147483647
extern   const ui32 MIN_UI32;			//!< 0
extern   const ui32 MAX_UI32;			//!< 0xffffffff
extern   const i64 MIN_I64;				//!< -9223372036854775808
extern   const i64 MAX_I64;				//!< 9223372036854775807
extern   const ui64 MIN_UI64;			//!< 0
extern   const ui64 MAX_UI64;			//!< 0xffffffffffffffff

template <typename T> inline T MIN() { return (T)0; }
template <> inline i8 MIN() { return MIN_I8; }
template <> inline ui8 MIN() { return MIN_UI8; }
template <> inline i16 MIN() { return MIN_I16; }
template <> inline ui16 MIN() { return MAX_UI16; }
template <> inline i32 MIN() { return MAX_I32; }
template <> inline ui32 MIN() { return MAX_UI32; }
template <> inline i64 MIN() { return MAX_I64; }
template <> inline ui64 MIN() { return MAX_UI64; }

template <typename T> inline T MAX() { return (T)0; }
template <> inline i8 MAX() { return MAX_I8; }
template <> inline ui8 MAX() { return MAX_UI8; }
template <> inline i16 MAX() { return MAX_I16; }
template <> inline ui16 MAX() { return MAX_UI16; }
template <> inline i32 MAX() { return MAX_I32; }
template <> inline ui32 MAX() { return MAX_UI32; }
template <> inline i64 MAX() { return MAX_I64; }
template <> inline ui64 MAX() { return MAX_UI64; }

//////////////////////////////////////////////////////////////////////////

template <typename T>
inline T Abs(T x)
{
	return x > 0 ? x : -x;
}

template <typename T>
inline T Sgn(T x)
{
	return (x < T(0) ? T(-1) : (x > T(0) ? T(1) : T(0)));
}

template <typename T>
inline T Sqr(T x)
{
	return x * x;
}

template <typename T>
inline T Cube(T x)
{
	return sqr(x) * x;
}

template <typename T>
inline T Sqrt(T x)
{
	return std::sqrt(x);
}

template <typename T>
inline T InvSqrt(T x)
{
	return T(1) / std::sqrt(x);
}

template <typename T>
inline T Exp(T x)
{
	return std::exp(x);
}

template <typename T>
inline T Pow(T base, T exponent)
{
	return std::pow(base, exponent);
}

template <typename T>
inline T Sin(T x)
{
	return std::sin(x);
}

template <typename T>
inline T Cos(T x)
{
	return std::cos(x);
}

template <typename T>
inline T Tan(T x)
{
	return std::tan(x);
}

template <typename T>
inline T Sinh(T x)
{
	return std::sinh(x);
}

template <typename T>
inline T Cosh(T x)
{
	return std::cosh(x);
}

template <typename T>
inline T Tanh(T x)
{
	return std::tanh(x);
}

template <typename T>
inline T ASin(T x)
{
	return std::asin(x);
}

template <typename T>
inline T ACos(T x)
{
	return std::acos(x);
}

// [0, 2*PI]
template <typename T>
inline T ATan(T x)
{
	return std::atan(x);
}

// [-PI, PI]
template <typename T>
inline T ATan2(T y, T x)
{
	return std::atan2(y, x);
}

template <typename T>
inline void Swap(T& x, T& y)
{
	// Don't try to optimize this code!! This code works in parallel very well.
	T t0 = x;
	T t1 = y;
	x = t1; 
	y = t0;
}

inline bool IsNaN(float f)
{
	// std::isnan() is C99, not supported by all compilers
	// However NaN always fails this next test, no other number does.
	return f != f;
}

template <typename T>
inline T Radian(T x)
{
	return static_cast<T>(x * DEG2RAD);
}
template <typename T>
inline T Degree(T x)
{
	return static_cast<T>(x * RAD2DEG);
}
template <typename T>
inline T NormalRadian(T x)
{
	T f = (T)x;
	while (f < 0.0f || f > Math::PI_2)
	{
		if (f < 0.0f)
		{
			f += Math::PI_2;
		}

		if (f > Math::PI_2)
		{
			f -= Math::PI_2;
		}
	}

	return f;
}
template <typename T>
inline T NormalDegree(T x)
{
	T f = (T)x;
	while (f < (T)0 || f > (T)360)
	{
		if (f < (T)0)
		{
			f += (T)360;
		}

		if (f > (T)360)
		{
			f -= (T)360;
		}
	}

	return f;
}

template <typename T>
inline T Floor(T x)
{
	return std::floor(x);
}

template <typename T>
inline T Ceil(T x)
{
	return std::ceil(x);
}

template <typename T>
inline T Frac(T x)
{
	return x - static_cast<int>(x);
}

template <typename T>
inline T Round(T x)
{
	return (x > 0) ? static_cast<T>(static_cast<int>(T(0.5) + x)) :
					-static_cast<T>(static_cast<int>(T(0.5) - x));
}

template <typename T>
inline T Trunc(T x)
{
	return static_cast<T>(static_cast<int>(x));
}

template <typename T>
inline T Mod(T x, T y)
{
	return x % y;
}

template<>
inline float Mod<float>(float x, float y)
{
	return std::fmod(x, y);
}
	
template <>
inline double Mod<double>(double x, double y)
{
	return std::fmod(x, y);
}

template <typename T>
inline T Wrap(T val, T low, T high)
{
	T ret(val);
	T rang(high - low);

	while (ret >= high)
	{
		ret -= rang;
	}
	while (ret < low)
	{
		ret += rang;
	}

	return ret;
}

template <typename T>
inline T Mirror(T val, T low, T high)
{
	T ret(val);
	T rang(high - low);

	while ((ret > high) || (ret < low))
	{
		if (ret > high)
		{
			ret = 2 * high - val;
		}
		else if (ret < low)
		{
			ret = 2 * low - val;
		}
	}

	return ret;
}

template <typename T>
inline bool IsOdd(T x)
{
	return Mod(x, 2) != 0;
}

template <typename T>
inline bool IsEven(T x)
{
	return !IsOdd(x);
}

template <typename T>
inline bool IsInBound(T val, T low, T high)
{
	return ((val >= low) && (val <= high));
}

template <typename T>
inline T Min(T a, T b)
{
	return a < b ? a : b;
}

template <typename T>
inline T Max(T a, T b)
{
	return a > b ? a : b;
}

template <typename T>
inline T Min3(T a, T b, T c)
{
	return (Min)((Min)(a, b), c);
}

template <typename T>
inline T Max3(T a, T b, T c)
{
	return (Max)((Max)(a, b), c);
}

template <typename T>
inline T Min4(T a, T b, T c, T d)
{
	return (Min)((Min)((Min)(a, b), c), d);
}

template <typename T>
inline T Max4(T a, T b, T c, T d)
{
	return (Max)((Max)((Max)(a, b), c), d);
}

template <typename T>
inline T Clamp(T val, T low, T high)
{
	return Max(low, Min(high, val));
}

template <typename T>
inline T Step(T edge, T val)
{
	T pair[2] = { 0, 1 };
	return pair[edge > val];
}

template <typename T>
inline bool IsEqual(T lhs, T rhs)
{
	return (lhs == rhs);
}

template <>
inline bool IsEqual<float>(float lhs, float rhs)
{
	return (Abs<float>(lhs - rhs) <= 0.0001f);
}
template <>
inline bool IsEqual<double>(double lhs, double rhs)
{
	return (Abs<double>(lhs - rhs) <= 0.0001);
}

template <typename T>
inline bool IsNotEqual(T lhs, T rhs)
{
	return (lhs != rhs);
}

template <>
inline bool IsNotEqual<float>(float lhs, float rhs)
{
	return (Abs<float>(lhs - rhs) > 0.0001f);
}

template <>
inline bool IsNotEqual<double>(double lhs, double rhs)
{
	return (Abs<double>(lhs - rhs) > 0.0001);
}

template <typename T>
inline bool LessThan(T lhs, T rhs)
{
	return (lhs < rhs);
}

template <>
inline bool LessThan<float>(float lhs, float rhs)
{
	return IsEqual(lhs, rhs) ? false : (lhs < rhs);
}

template <>
inline bool LessThan<double>(double lhs, double rhs)
{
	return IsEqual(lhs, rhs) ? false : (lhs < rhs);
}

template <typename T>
inline bool LessEqual(T lhs, T rhs)
{
	return (lhs <= rhs);
}

template <>
inline bool LessEqual<float>(float lhs, float rhs)
{
	return IsEqual(lhs, rhs) ? true : (lhs < rhs);
}

template <>
inline bool LessEqual<double>(double lhs, double rhs)
{
	return IsEqual(lhs, rhs) ? true : (lhs < rhs);
}

  ui16 CRC16(const char* str);
  ui32 CRC32(const char* str);
  ui32 CRC32NoCase(const char* str);

  float UnitRandom();

// [-1,1)
  float SymmetricRandom();

// [min,max)
  float IntervalRandom (float fMin, float fMax);

// Write a n*8 bits integer value to memory in native endian.
inline void IntWrite(void *pDest, int n, uint value)
{
	switch(n)
	{
	case 1:
		((ui8*)pDest)[0] = (ui8)value;
		break;
	case 2:
		((ui16*)pDest)[0] = (ui16)value;
		break;
	case 3:
#if KART_ENDIAN == KART_ENDIAN_BIG
		((ui8*)pDest)[0] = (ui8)((value >> 16) & 0xFF);
		((ui8*)pDest)[1] = (ui8)((value >> 8) & 0xFF);
		((ui8*)pDest)[2] = (ui8)(value & 0xFF);
#else
		((ui8*)pDest)[2] = (ui8)((value >> 16) & 0xFF);
		((ui8*)pDest)[1] = (ui8)((value >> 8) & 0xFF);
		((ui8*)pDest)[0] = (ui8)(value & 0xFF);
#endif
		break;
	case 4:
		((ui32*)pDest)[0] = (ui32)value;                
		break;                
	}        
}

//Read a n*8 bits integer value to memory in native endian.
inline uint IntRead(const void* src, int n)
{
	switch(n)
	{
	case 1:
		return ((ui8*)src)[0];
	case 2:
		return ((ui16*)src)[0];
	case 3:
#if KART_ENDIAN == KART_ENDIAN_BIG
		return ((ui32)((ui8*)src)[0]<<16)| ((ui32)((ui8*)src)[1]<<8)| ((ui32)((ui8*)src)[2]);
#else
		return ((ui32)((ui8*)src)[0])| ((ui32)((ui8*)src)[1]<<8)| ((ui32)((ui8*)src)[2]<<16);
#endif
	case 4:
		return ((ui32*)src)[0];
	} 
	return 0; // ?
}

/**
* Convert floating point color channel value between 0.0 and 1.0 (otherwise clamped) 
* to integer of a certain number of bits. Works for any value of bits between 0 and 31.
*/
inline uint FloatToFixed(float value, uint bits)
{
	if(value <= 0.0f)
		return 0;
	else if (value >= 1.0f)
		return (1<<bits)-1;
	else
		return (uint)(value * (1<<bits));     
}

// Fixed point to float
inline float FixedToFloat(uint value, uint bits)
{
	return (float)value/(float)((1<<bits)-1);
}

// Converts float in uint32 format to a a half in uint16 format
inline ui16 FloatToHalfI(ui32 i)
{
	register int s = (i >> 16) & 0x00008000;
	register int e = ((i >> 23) & 0x000000ff) - (127 - 15);
	register int m = i & 0x007fffff;

	if (e <= 0)
	{
		if (e < -10)
		{
			return 0;
		}
		m = (m | 0x00800000) >> (1 - e);
        
		return static_cast<ui16>(s | (m >> 13));
	}
	else if (e == 0xff - (127 - 15))
	{
		if (m == 0) // Inf
		{
			return static_cast<ui16>(s | 0x7c00);
		} 
		else    // NAN
		{
			m >>= 13;
			return static_cast<ui16>(s | 0x7c00 | m | (m == 0));
		}
	}
	else
	{
		if (e > 30) // Overflow
		{
			return static_cast<ui16>(s | 0x7c00);
		}
        
		return static_cast<ui16>(s | (e << 10) | (m >> 13));
	}
}

// Convert a float32 to a float16 (NV_half_float)
inline ui16 FloatToHalf(float i)
{
	union { float f; ui32 i; } v;
	v.f = i;
	return FloatToHalfI(v.i);
}

//Converts a half in uint16 format to a float in uint32 format
inline ui32 HalfToFloatI(ui16 y)
{
	register int s = (y >> 15) & 0x00000001;
	register int e = (y >> 10) & 0x0000001f;
	register int m = y & 0x000003ff;

	if (e == 0)
	{
		if (m == 0) // Plus or minus zero
		{
			return s << 31;
		}
		else // unnormalized number -- renormalized it
		{
			while (!(m & 0x00000400))
			{
				m <<= 1;
				e -=  1;
			}

			e += 1;
			m &= ~0x00000400;
		}
	}
	else if (e == 31)
	{
		if (m == 0) // Inf
		{
			return (s << 31) | 0x7f800000;
		}
		else // NaN
		{
			return (s << 31) | 0x7f800000 | (m << 13);
		}
	}

	e = e + (127 - 15);
	m = m << 13;

	return (s << 31) | (e << 23) | m;
}

// Convert a float16 (NV_half_float) to a float32
inline float HalfToFloat(ui16 y)
{
	union { float f; ui32 i; } v;
	v.i = HalfToFloatI(y);
	return v.f;
}

// Determines wheter the number is power-of-two or not
template <typename T>
inline bool IsPO2(T num)
{
	return (num & (num-1)) == 0;
}

// Return the closest power-of-two number greater or equal to value
inline uint NearsetPO2(uint num)
{
	--num;
	num |= num >> 16;
	num |= num >> 8;
	num |= num >> 4;
	num |= num >> 2;
	num |= num >> 1;
	++num;
	
	return num;
}

#ifndef __has_builtin
// Compatibility with non-clang compilers
#define __has_builtin(x) 0
#endif

inline ui16 ByteSwap16(ui16 arg)
{
	return ((arg << 8) & 0xFF00) | ((arg >> 8) & 0x00FF);
}

inline ui32 ByteSwap32(ui32 arg)
{
	return ((arg & 0x000000FF) << 24) | ((arg & 0x0000FF00) << 8) | ((arg >> 8) & 0x0000FF00) | ((arg >> 24) & 0x000000FF);
}

inline ui64 ByteSwap64(ui64 arg)
{
	union {
		ui64 sv;
		ui32 ul[2];
	} tmp, result;
	tmp.sv = arg;
	result.ul[0] = ByteSwap32(tmp.ul[1]);
	result.ul[1] = ByteSwap32(tmp.ul[0]);
	return result.sv;
}

inline void ByteSwapChunks(void* pData, size_t size, size_t count)
{
	for (size_t c = 0; c < count; ++c)
	{
		char swapByte;
		for (char *p0 = (char*)pData + c * size, *p1 = p0 + size - 1; p0 < p1; ++p0, --p1)
		{
			swapByte = *p0;
			*p0 = *p1;
			*p1 = swapByte;
		}
	}
}


inline ui16 Load16LE(const ui8* in)
{
	return (ui16)in[0] | (ui16)in[1] << 8;
}

inline ui32 Load32LE(const ui8* in)
{
	return (ui32)in[0] | (ui32)in[1] << 8 | (ui32)in[2] << 16 | (ui32)in[3] << 24;
}

inline ui64 Load64LE(const ui8* in)
{
	return (ui64)in[0] | (ui64)in[1] << 8 | (ui64)in[2] << 16 | (ui64)in[3] << 24 |
			(ui64)in[4] << 32 | (ui64)in[5] << 40 | (ui64)in[6] << 48 | (ui64)in[7] << 56;
}

inline float Lerp(float x, float y, float weight)
{
	return x + weight * (y - x);
}

inline float SmoothStep(float edge0, float edge1, float x)
{
	// Scale, bias and saturate x to 0..1 range
	x = Clamp((x - edge0) / (edge1 - edge0), 0.0f, 1.0f);
	// Evaluate polynomial
	return x*x*(3 - 2 * x);
}

}
CC_NAMESPACE_END
#endif
