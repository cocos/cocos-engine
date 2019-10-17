#ifndef __AOSQUAT_H__
#define __AOSQUAT_H__

#include "SoA/SoADef.h"
#include "SoAMathLib.h"
#include "Math/Quat.h"
#include "SoAVec3.h"

CC_NAMESPACE_BEGIN

/** Cache-friendly array of Quaternion represented as a SoA array.
    @remarks
        SoAQuan is a SIMD & cache-friendly version of Quaternion.
        An operation on an SoAQuan is done on 4 quaternions at a
        time (the actual amount is defined by ARRAY_PACKED_REALS)
        Assuming ARRAY_PACKED_REALS == 4, the memory layout will
        be as following:
            mChunkBase             mChunkBase + 4
        WWWW XXXX YYYY ZZZZ     WWWW XXXX YYYY ZZZZ
        Extracting one quat (XYZW) needs 64 bytes, which is within
        the 64 byte size of common cache lines.
        Architectures where the cache line == 32 bytes may want to
        set ARRAY_PACKED_REALS = 2 depending on their needs
*/
class SoAQuat
{
public:
	float w, x, y, z;

public:
	SoAQuat() {}
	SoAQuat(SoAFloat chunkW, SoAFloat chunkX, SoAFloat chunkY, SoAFloat chunkZ)
	{
		w = chunkW;
		x = chunkX;
		y = chunkY;
		z = chunkZ;
	}

public:
	Quat getQuat(size_t index) const
	{
		Quat out;
		//Be careful of not writing to these regions or else strict aliasing rule gets broken!!!
		const float *aliasedReal = reinterpret_cast<const float*>( &w );
		out.w = aliasedReal[ARRAY_PACKED_FLOATS * 0 + index];	//W
		out.x = aliasedReal[ARRAY_PACKED_FLOATS * 1 + index];	//X
		out.y = aliasedReal[ARRAY_PACKED_FLOATS * 2 + index];	//Y
		out.z = aliasedReal[ARRAY_PACKED_FLOATS * 3 + index];	//Z
		return out;
	}

	void fromQuat(const Quat& q, size_t index)
	{
		float *aliasedReal = reinterpret_cast<float*>(&w);
		aliasedReal[ARRAY_PACKED_FLOATS * 0 + index] = q.w;
		aliasedReal[ARRAY_PACKED_FLOATS * 1 + index] = q.x;
		aliasedReal[ARRAY_PACKED_FLOATS * 2 + index] = q.y;
		aliasedReal[ARRAY_PACKED_FLOATS * 3 + index] = q.z;
	}

    inline void fromAngleAxis(const SoAFloat& radian, const SoAVec3& axis);
    inline void toAngleAxis(SoAFloat& radian, SoAVec3& axis) const;

    inline friend SoAQuat operator * (const SoAQuat& lhs, const SoAQuat& rhs);
    inline friend SoAQuat operator + (const SoAQuat& lhs, const SoAQuat& rhs);
    inline friend SoAQuat operator - (const SoAQuat& lhs, const SoAQuat& rhs);
    inline friend SoAQuat operator * (const SoAQuat& lhs, SoAFloat scalar);
    inline friend SoAQuat operator * (SoAFloat scalar, const SoAQuat& lhs);
    inline void operator += (const SoAQuat& a);
    inline void operator -= (const SoAQuat& a);
    inline void operator *= (const SoAFloat fScalar);

	inline void getAxisX(SoAVec3& axis) const;
	inline void getAxisY(SoAVec3& axis) const;
	inline void getAxisZ(SoAVec3& axis) const;

    inline SoAFloat dot(const SoAQuat& quan) const;
    inline SoAFloat lenSqr() const;
    inline void normalize();

    inline void inverse();			// apply to non-zero quaternion
    inline void unitInverse();		// apply to unit-length quaternion
    inline void exp();
    inline void log();

	/** Conditional move update. @See MathlibC::Cmov4
        Changes each of the four vectors contained in 'this' with
        the replacement provided
        @remarks
            If mask param contains anything other than 0's or 0xffffffff's
            the result is undefined.
            Use this version if you want to decide whether to keep current
            result or overwrite with a replacement (performance optimization).
            i.e. a = Cmov4( a, b )
            If this vector hasn't been assigned yet any value and want to
            decide between two SoAQuans, i.e. a = Cmov4( b, c ) then
            @see Cmov4( const SoAQuan &arg1, const SoAQuan &arg2, ArrayReal mask );
            instead.
        @param
            Vectors to be used as replacement if the mask is zero.
        @param
            mask filled with either 0's or 0xFFFFFFFF
        @return
            this[i] = mask[i] != 0 ? this[i] : replacement[i]
    */
    inline void cmov4(SoAMaskF mask, const SoAQuat& replacement);

	inline SoAVec3 operator * (const SoAVec3& v) const;

    /** Rotates a vector by multiplying the quaternion to the vector, and modifies it's contents
        by storing the results there.
        @remarks
            This function is the same as doing:
                ArrayVector v;
                SoAQuan q;
                v = q * v;
            In fact, the operator overloading will make above code work perfectly. However, because
            we don't trust all compilers in optimizing this performance-sensitive function (in fact
            MSVC 2008 doesn't inline the op. and generates an unnecessary ArrayVector3) this
            function will take the input vector, and store the results back on that vector.
            This is very common when concatenating transformations on an ArrayVector3, whose
            memory reside in the heap (it makes better usage of the memory). Long story short,
            prefer calling this function to using an operator when just updating an ArrayVector3 is
            involved. (It's fine using operators for ArrayVector3s)
        @param
                
    */
    static inline void Mul(const SoAQuat& inQ, SoAVec3& inOutVec);

	static inline void Lerp(SoAQuat& outQuan, SoAFloat t, const SoAQuat& q1, const SoAQuat& q2);
    static inline void Slerp(SoAQuat& outQuan, SoAFloat t, const SoAQuat& q1, const SoAQuat& q2);

	/** Conditional move. @See MathlibC::Cmov4
		Selects between arg1 & arg2 according to mask
		@remarks
			If mask param contains anything other than 0's or 0xffffffff's
			the result is undefined.
			If you wanted to do a = cmov4( a, b ), then consider using the update version
			@see Cmov4( ArrayReal mask, const SoAQuan &replacement );
			instead.
		@param
			First array of Vectors
		@param
			Second array of Vectors
		@param
			mask filled with either 0's or 0xFFFFFFFF
		@return
			this[i] = mask[i] != 0 ? arg1[i] : arg2[i]
	*/
    inline static void Cmov4(SoAQuat& outQuan, const SoAQuat& arg1, const SoAQuat& arg2, SoAMaskF mask);
};

#include "SoAQuat-inl.h"

extern  const SoAQuat SOAQUAT_ZERO;
extern  const SoAQuat SOAQUAT_IDENTITY;

CC_NAMESPACE_END

#endif