#ifndef __SOADEF_H__
#define __SOADEF_H__

#if defined(CC_USE_SIMD)
/*#	ifdef  __X86__
 //#	if CC_CPU == CC_CPU_X86
#		include <xmmintrin.h>
#		include <emmintrin.h>  //SSE Math library still needs SSE2
#		define ARRAY_PACKED_FLOATS 4
		
		CC_NAMESPACE_BEGIN
		typedef __m128 SoAFloat;
		typedef __m128 SoAMaskF;
		CC_NAMESPACE_END

#		define ARRAY_REAL_ZERO _mm_setzero_ps()
#		define ARRAY_INT_ZERO _mm_setzero_si128()

#		define CC_PREFETCH_T0( x ) _mm_prefetch( x, _MM_HINT_T0 )
#		define CC_PREFETCH_T1( x ) _mm_prefetch( x, _MM_HINT_T1 )
#		define CC_PREFETCH_T2( x ) _mm_prefetch( x, _MM_HINT_T2 )
#		define CC_PREFETCH_NTA( x ) _mm_prefetch( x, _MM_HINT_NTA )

//Distance (in ArrayMemoryManager's slots) used to keep fetching data. This also
//means the memory manager needs to allocate extra memory for them.
//Must be multiple of ARRAY_PACKED_FLOATS
#		define CC_PREFETCH_SLOT_DISTANCE     4*ARRAY_PACKED_FLOATS

		CC_NAMESPACE_BEGIN
		typedef __m128i ArrayInt;
		typedef __m128i ArrayMaskI;
		CC_NAMESPACE_END

///r = (a * b) + c
#		define _mm_madd_ps(a, b, c)			_mm_add_ps(c, _mm_mul_ps(a, b))
///r = -(a * b) + c
#		define _mm_nmsub_ps(a, b, c)		_mm_sub_ps(c, _mm_mul_ps(a, b))

/// Does not convert, just cast SoAFloat to ArrayInt
#		define CC_CAST_FLOAT_TO_INT(x)	_mm_castps_si128(x)
#		define CC_CAST_INT_TO_FLOAT(x)	_mm_castsi128_ps(x)
/// Input must be 16-byte aligned
#		define CC_CAST_ARRAY_TO_FLOAT(outFloatPtr, arraySimd)	_mm_store_ps(outFloatPtr, arraySimd)

//////////////////////////////////////////////////////////////////////////
#	elif  defined(__ARM__)
//#	elif	CC_CPU == CC_CPU_X86
#		define ARRAY_PACKED_FLOATS 4

		CC_NAMESPACE_BEGIN
		typedef float32x4_t SoAFloat;
		typedef uint32x4_t SoAMaskF;
		CC_NAMESPACE_END

#		define ARRAY_REAL_ZERO vdupq_n_f32( 0.0f )
#		define ARRAY_INT_ZERO vdupq_n_u32( 0 )

// Make sure that we have the preload macro. Might not be available with some compilers.
#		ifndef __pld
#			define __pld(x) asm volatile ( "pld [%[addr]]\n" :: [addr] "r" (x) : "cc" );
#		endif

#		if defined(__arm64__)
#			define CC_PREFETCH_T0( x ) asm volatile ( "prfm pldl1keep, [%[addr]]\n" :: [addr] "r" (x) : "cc" );
#			define CC_PREFETCH_T1( x ) asm volatile ( "prfm pldl2keep, [%[addr]]\n" :: [addr] "r" (x) : "cc" );
#			define CC_PREFETCH_T2( x ) asm volatile ( "prfm pldl3keep, [%[addr]]\n" :: [addr] "r" (x) : "cc" );
#			define CC_PREFETCH_NTA( x ) asm volatile ( "prfm pldl1strm, [%[addr]]\n" :: [addr] "r" (x) : "cc" );
#		else
#			define CC_PREFETCH_T0( x ) __pld(x)
#			define CC_PREFETCH_T1( x ) __pld(x)
#			define CC_PREFETCH_T2( x ) __pld(x)
#			define CC_PREFETCH_NTA( x ) __pld(x)
#		endif

//Distance (in ArrayMemoryManager's slots) used to keep fetching data. This also
//means the memory manager needs to allocate extra memory for them.
//Must be multiple of ARRAY_PACKED_FLOATS
#		define CC_PREFETCH_SLOT_DISTANCE     4*ARRAY_PACKED_FLOATS

		CC_NAMESPACE_BEGIN
		typedef int32x4_t ArrayInt;
		typedef uint32x4_t ArrayMaskI;
		CC_NAMESPACE_END

///r = (a * b) + c
#		define _mm_madd_ps(a, b, c)		vmlaq_f32(c, a, b)
///r = -(a * b) + c
#		define _mm_nmsub_ps(a, b, c)	vmlsq_f32(c, a, b)

/// Does not convert, just cast SoAFloat to ArrayInt
//#define CC_CAST_FLOAT_TO_INT(x)	vreinterpretq_s32_f32(x)
//#define CC_CAST_INT_TO_FLOAT(x)	vreinterpretq_f32_s32(x)
#		define CC_CAST_FLOAT_TO_INT(x)	(x)
#		define CC_CAST_INT_TO_FLOAT(x)	(x)
/// Input must be 16-byte aligned
#		define CC_CAST_ARRAY_TO_FLOAT(outFloatPtr, arraySimd)	vst1q_f32(outFloatPtr, arraySimd)

//////////////////////////////////////////////////////////////////////////
#	else
//Unsupported architecture, tell user to reconfigure. We could silently fallback to C,
//but this is very green code, and architecture may be x86 with a rare compiler.
#		error "Unknown platform or platform not supported for SIMD."
#	endif */



#	define ARRAY_PACKED_FLOATS 4

CC_NAMESPACE_BEGIN
	typedef float SoAFloat __attribute__ ((vector_size (16)));
	//typedef float	SoAFloat;
	typedef ui32 ArrayInt __attribute__ ((vector_size (16)));
	//typedef ui32	ArrayInt;
	typedef i32 v4si __attribute__ ((vector_size (16)));
	//typedef bool	SoAMaskF;
	typedef i32 v4si __attribute__ ((vector_size (16)));
	//typedef bool	ArrayMaskI;
	#define SoAMaskF v4si
	#define ArrayMaskI v4si
CC_NAMESPACE_END

//Do NOT I REPEAT DO NOT change these to static_cast<float>(x) and static_cast<int>(x)
//These are not conversions. They're reinterpretations!
#	define CC_CAST_FLOAT_TO_INT(x)	(x)
#	define CC_CAST_INT_TO_FLOAT(x)	(x)

#	define CC_MADD(a, b, c)	( (c) + ( (a) * (b) ) )

#	define CC_PREFETCH_T0(x)	((void)0)
#	define CC_PREFETCH_T1(x)	((void)0)
#	define CC_PREFETCH_T2(x)	((void)0)
#	define CC_PREFETCH_NTA(x)	((void)0)

#	define ARRAY_INT_ZERO {0,0,0,0}

/// Input must be 16-byte aligned
#	define CC_CAST_ARRAY_TO_FLOAT(outFloatPtr, arraySimd)		outFloatPtr = __builtin_convertvector(arraySimd,SoAFloat)

//Distance (in ArrayMemoryManager's slots) used to keep fetching data. This also
//means the memory manager needs to allocate extra memory for them.
#	define CC_PREFETCH_SLOT_DISTANCE	 4*ARRAY_PACKED_FLOATS //Must be multiple of ARRAY_PACKED_FLOATS
//////////////////////////////////////////////////////////////////////////
#else
//No SIMD, use C implementation
#	define ARRAY_PACKED_FLOATS 1

CC_NAMESPACE_BEGIN
	typedef float	SoAFloat;
	typedef ui32	ArrayInt;
	typedef bool	SoAMaskF;
	typedef bool	ArrayMaskI;
CC_NAMESPACE_END

//Do NOT I REPEAT DO NOT change these to static_cast<float>(x) and static_cast<int>(x)
//These are not conversions. They're reinterpretations!
#	define CC_CAST_FLOAT_TO_INT(x)	(x)
#	define CC_CAST_INT_TO_FLOAT(x)	(x)

#	define CC_MADD(a, b, c)	( (c) + ( (a) * (b) ) )

#	define CC_PREFETCH_T0(x)	((void)0)
#	define CC_PREFETCH_T1(x)	((void)0)
#	define CC_PREFETCH_T2(x)	((void)0)
#	define CC_PREFETCH_NTA(x)	((void)0)

#	define ARRAY_INT_ZERO 0

/// Input must be 16-byte aligned
#	define CC_CAST_ARRAY_TO_FLOAT(outFloatPtr, arraySimd)		(*(outFloatPtr) = arraySimd)

//Distance (in ArrayMemoryManager's slots) used to keep fetching data. This also
//means the memory manager needs to allocate extra memory for them.
#	define CC_PREFETCH_SLOT_DISTANCE	0 //Must be multiple of ARRAY_PACKED_FLOATS
#endif

#endif
