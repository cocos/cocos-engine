#ifndef __SOAMATHLIB_H__
#define __SOAMATHLIB_H__

#include "../SoADef.h"
#include "Math/MathLib.h"
//#include "Util/Assertion.h"
using namespace std;

CC_NAMESPACE_BEGIN

namespace SoAMath
{

extern   const SoAFloat HALF;				//0.5f, 0.5f, 0.5f, 0.5f
extern   const SoAFloat ONE;				//1.0f, 1.0f, 1.0f, 1.0f
extern   const SoAFloat THREE;				//3.0f, 3.0f, 3.0f, 3.0f
extern   const SoAFloat NEG_ONE;			//-1.0f, -1.0f, -1.0f, -1.0f
extern   const SoAFloat PI;					//PI, PI, PI, PI
extern   const SoAFloat PI_2;				//2*PI, 2*PI, 2*PI, 2*PI
extern   const SoAFloat ONE_DIV_2PI;		//1 / 2PI, 1 / 2PI, 1 / 2PI, 1 / 2PI
extern   const SoAFloat EPSILON;			//1e-6f, 1e-6f, 1e-6f, 1e-6f
extern   const SoAFloat EPSILON_SQR;		//1e-12f, 1e-12f, 1e-12f, 1e-12f
extern   const SoAFloat ONE_MINUS_EPSILON;	//1 - 1e-6f, 1 - 1e-6f, 1 - 1e-6f, 1 - 1e-6f
extern   const SoAFloat MIN_FLOAT;
extern   const SoAFloat INF_FLOAT;			//Inf, Inf, Inf, Inf

/** Returns the absolute values of each 4 floats
    @param
        4 floating point values
    @return
        abs( a )
*/
inline SoAFloat Abs4(SoAFloat a)
{
    return Math::Abs(a);
}

/**
 * res = a?b:c
 */
inline SoAFloat TernaryOp(SoAFloat arg1, SoAFloat arg2, SoAMaskF mask) 
{
	#ifdef CC_USE_SIMD
		SoAFloat res = ARRAY_INT_ZERO;
		for(int i=0;i<ARRAY_PACKED_FLOATS;i++)
		{
			res[i] = mask[i] ? arg1[i] : arg2[i];
		}
		return res;
	#else
		return mask != 0 ? arg1 : arg2;
	#endif
}
inline ArrayInt TernaryOp(ArrayInt arg1, ArrayInt arg2, SoAMaskF mask) 
{
	#ifdef CC_USE_SIMD
		SoAFloat res = ARRAY_INT_ZERO;
		for(int i=0;i<ARRAY_PACKED_FLOATS;i++)
		{
			res[i] = mask[i] ? arg1[i] : arg2[i];
		}
		return res;
	#else
		return mask != 0 ? arg1 : arg2;
	#endif
}

#ifdef CC_USE_SIMD
inline ArrayInt TernaryOp(ui32 arg1, ui32 arg2, SoAMaskF mask) 
{
		ArrayInt a1 = {arg1};
		ArrayInt a2 = {arg2};
		SoAFloat res = ARRAY_INT_ZERO;
		for(int i=0;i<ARRAY_PACKED_FLOATS;i++)
		{
			res[i] = mask[i] ? a1[i] : a2[i];
		}
		return res;
}
#endif
/** Branchless conditional move for 4 floating point values
    @remarks
        Will NOT work if any of the arguments contains Infinite
        or NaNs or non-floating point values. If an exact binary
        copy is needed, @see CmovRobust
    @param
        4 floating point values. Can't be NaN or Inf
    @param
        4 floating point values. Can't be NaN or Inf
    @param
        4 values containing either 0 or 0xffffffff
        Any other value, the result is undefined
    @return
        r[i] = mask[i] != 0 ? arg1[i] : arg2[i]
        Another way to say it:
            if( maskCondition[i] == true )
                r[i] = arg1[i];
            else
                arg2[i];
*/
inline SoAFloat Cmov4(SoAFloat arg1, SoAFloat arg2, SoAMaskF mask)
{
	//CC_ASSERTS(!Math::IsNaN(arg1) && !Math::IsNaN(arg2), "Passing NaN values to Cmov4");

#if (CC_MODE == CC_MODE_DEBUG)
    SoAFloat newNan1 = arg1 * 0; //+-Inf * 0 = nan
    SoAFloat newNan2 = arg2 * 0; //+-Inf * 0 = nan
	//CC_ASSERTS(!Math::IsNaN(newNan1) && !Math::IsNaN(newNan2), "Passing +/- Infinity values to Cmov4");
#endif
	//float *aliasedReal = reinterpret_cast<float*>(&mask);
	return TernaryOp(arg1, arg2, mask);
}

/** Robust, branchless conditional move for a 128-bit value.
    @remarks
        If you're looking to copy 4 floating point values that do
        not contain Inf or Nans, @see Cmov4 which is faster.
        This is because switching between registers flagged as
        floating point to integer and back has a latency delay

        For more information refer to Chapter 3.5.2.3
        Bypass between Execution Domains, Intel® 64 and IA-32
        Architectures Optimization Reference Manual Order
        Number: 248966-026 April (and also Table 2-12)
    @param
        A value containing 128 bits
    @param
        A value containing 128 bits
    @param
        Mask, each bit is evaluated
    @return
        For each bit:
        r[i] = mask[i] != 0 ? arg1[i] : arg2[i]
        Another way to say it:
            if( maskCondition[i] == true )
                r[i] = arg1[i];
            else
                arg2[i];
*/
inline SoAFloat CmovRobust(SoAFloat arg1, SoAFloat arg2, SoAMaskF mask)
{
	return TernaryOp(arg1, arg2, mask);
//	return mask ? arg1 : arg2;
}

inline ArrayInt CmovRobust( ArrayInt arg1, ArrayInt arg2, ArrayMaskI mask )
{
	return TernaryOp(arg1, arg2, mask);
//	return mask ? arg1 : arg2;
}

/** Returns the result of "a & b"
@return
	r[i] = a[i] & b[i];
*/
inline ArrayInt And(ArrayInt a, ArrayInt b)
{
	return a & b;
}

inline ArrayMaskI And(ArrayMaskI a, ArrayInt b)
{
//	return ((a ? 0xffffffff : 0) & b) != 0;
return (TernaryOp(0xffffffff, 0, a) & b) != 0;
}

inline ArrayMaskI And(ArrayInt a, ArrayMaskI b)
{
	return (a & TernaryOp(0xffffffff, 0, b)) != 0;
//	return (a & (b ? 0xffffffff : 0)) != 0;
}

inline ArrayMaskI And( ArrayMaskI a, ArrayMaskI b )
{
	return a & b;
}

/** Test if "a AND b" will result in non-zero, returning 0xffffffff on those cases
@return
    r[i] = (a[i] & b[i]) ? 0xffffffff : 0;
*/
inline ArrayMaskI TestFlags4( ArrayInt a, ArrayInt b )
{
	return (a & b) != 0;
}

inline ArrayMaskI TestFlags4( ArrayMaskI a, ArrayInt b )
{
//	return ( (a ? 0xffffffff : 0) & b ) != 0;
	return ( TernaryOp(0xffffffff,0,a) & b ) != 0;
}

inline ArrayMaskI TestFlags4( ArrayInt a,  ArrayMaskI b )
{
	//return ( a & (b ? 0xffffffff : 0) ) != 0;
	return ( a & TernaryOp(0xffffffff,0,b) ) != 0;
}

/** Returns the result of "a & ~b"
@return
	r[i] = a[i] & ~b[i];
*/
inline ArrayInt AndNot( ArrayInt a, ArrayInt b )
{
	return a & ~b;
}

inline ArrayMaskI AndNot( ArrayMaskI a, ArrayInt b )
{
	return (TernaryOp( 0xffffffff , 0, a) & ~b) != 0;
}

inline ArrayMaskI AndNot( ArrayInt a, ArrayMaskI b )
{
	return (a & TernaryOp(0 , 0xffffffff , b)) != 0;
}

inline ArrayMaskI AndNot( ArrayMaskI a, ArrayMaskI b )
{
//	return a & (!b);
	return a & (b == 0);
}

/** Returns the result of "a | b"
@return
	r[i] = a[i] | b[i];
*/
inline ArrayInt Or(ArrayInt a, ArrayInt b)
{
	return a | b;
}

inline ArrayMaskI Or(ArrayMaskI a, ArrayMaskI b)
{
	return a | b;
}

inline ArrayMaskI Or( ArrayMaskI a, ArrayInt b )
{
	//return ( (a ? 0xffffffff : 0) | b ) != 0;
	return ( TernaryOp(0xffffffff , 0, a) | b ) != 0;
}

inline ArrayMaskI Or( ArrayInt a,  ArrayMaskI b )
{
	return ( a | TernaryOp(0xffffffff , 0, b) ) != 0;
}

/** Returns the result of "a < b"
@return
	r[i] = a[i] < b[i] ? 0xffffffff : 0;
*/
inline SoAMaskF CompareLess(SoAFloat a, SoAFloat b)
{
	return a < b;
}

/** Returns the result of "a <= b"
@return
	r[i] = a[i] <= b[i] ? 0xffffffff : 0;
*/
inline SoAMaskF CompareLessEqual(SoAFloat a, SoAFloat b)
{
	return a <= b;
}

/** Returns the result of "a > b"
@return
	r[i] = a[i] > b[i] ? 0xffffffff : 0;
*/
inline SoAMaskF CompareGreater(SoAFloat a, SoAFloat b)
{
	return a > b;
}

/** Returns the result of "a >= b"
@return
	r[i] = a[i] >= b[i] ? 0xffffffff : 0;
*/
inline SoAMaskF CompareGreaterEqual(SoAFloat a, SoAFloat b)
{
	return a >= b;
}

inline SoAFloat SetAll(float val)
{
	#ifdef CC_USE_SIMD
		return {val};
	#else
		return val;
	#endif
}

inline ArrayInt SetAll(ui32 val)
{
	#ifdef CC_USE_SIMD
		return {val};
	#else
		return val;
	#endif
}

/** Returns the result of "a == KSTD::numeric_limits<float>::infinity()"
@return
	r[i] = a[i] == Inf ? 0xffffffff : 0;
*/
inline SoAMaskF isInfinity(SoAFloat a)
{
	return a == KSTD::numeric_limits<float>::infinity();
}

// Returns the maximum value between a and b
inline SoAFloat Max(SoAFloat a, SoAFloat b)
{
	return Math::Max(a, b);
}

/** Returns the minimum value of all elements in a
@return
	r[0] = min( a[0], a[1], a[2], a[3] )
*/
inline float CollapseMin(SoAFloat a)
{
	return a;
}

/** Returns the maximum value of all elements in a
@return
	r[0] = max( a[0], a[1], a[2], a[3] )
*/
inline float CollapseMax(SoAFloat a)
{
	return a;
}

/** Returns the reciprocal of x
	@remarks
		If you have a very rough guarantees that you won't be feeding a zero,
		consider using @see InvNonZero4 because it's faster.
		See MathlibSSE2 implementation
	@return
		1 / x (packed as 4 floats)
*/
inline SoAFloat Inv4(SoAFloat val)
{
	return 1.0f / val;
}

/** Returns the reciprocal of x
	@remarks
		If the input is zero, it will produce a NaN!!! (but it's faster)
		Note: Some architectures may slowdown when a NaN is produced, making this
		function slower than Inv4 for those cases
		@see Inv4
	@param val
		If it's zero, the returned value could be NaN depending on implementation
	@return
		1 / x
*/
inline SoAFloat InvNonZero4(SoAFloat val)
{
	return 1.0f / val;
}

/** Returns the squared root of the reciprocal of x
	@return
		1 / sqrt( x )
*/
inline SoAFloat InvSqrt4(SoAFloat f)
{
	return 1.0f / Math::Sqrt( f );
}

/** Returns the squared root of the reciprocal of x
	@return
		1 / sqrt( x ) (packed as 4 floats)
*/
inline SoAFloat InvSqrtNonZero4( SoAFloat f )
{
	return 1.0f / Math::Sqrt( f );
}

/** Break x into fractional and integral parts
	@param
		4 floating point values. i.e. "2.57" (x4)
	@param x
		The integral part of x. i.e. 2
	@return outIntegral
		The fractional part of x. i.e. 0.57
*/
inline SoAFloat Modf4(SoAFloat x, SoAFloat &outIntegral)
{
#if CC_PLATFORM == CC_PLATFORM_ANDROID
	double _outIntegral;
	SoAFloat fractpart = modf(x, &_outIntegral);
	outIntegral = static_cast<SoAFloat>(_outIntegral);
	return fractpart;
#else
	return modff(x, &outIntegral);
#endif
}

/** Returns the arccos of x
	@param x
		4 floating point values
	@return
		arccos( x ) (packed as 4 floats)
*/
inline SoAFloat ACos4(SoAFloat x)
{
	return Math::ACos(x);
}

/** Returns the sine of x
	@param x
		4 floating point values
	@return
		sin( x ) (packed as 4 floats)
*/
inline SoAFloat Sin4(SoAFloat x)
{
	return Math::Sin(x);
}

/** Returns the cosine of x
	@param x
		4 floating point values
	@return
		cos( x ) (packed as 4 floats)
*/
inline SoAFloat Cos4(SoAFloat x)
{
	return Math::Cos(x);
}

/** Calculates the cosine & sine of x. Use this function if you need to calculate
	both, as it is faster than calling Cos4 & Sin4 together.
	@param x
		4 floating point values
	@param outSin
		Output value, sin( x ) (packed as 4 floats)
	@param outCos
		Output value, cos( x ) (packed as 4 floats)
*/
inline void SinCos4(SoAFloat x, SoAFloat &outSin, SoAFloat &outCos)
{
	outSin = Math::Sin(x);
	outCos = Math::Cos(x);
}

} // namespace SoAMath

CC_NAMESPACE_END

#endif
