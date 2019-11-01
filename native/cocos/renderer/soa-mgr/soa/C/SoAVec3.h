#ifndef __AOSVEC3_H__
#define __AOSVEC3_H__

#include "SoA/SoADef.h"
#include "SoAMathLib.h"
#include "math/Vec3.h"

CC_NAMESPACE_BEGIN

/** Cache-friendly array of 3-dimensional represented as a SoA array.
    @remarks
        SoAVec3 is a SIMD & cache-friendly version of Vector3.
        An operation on an SoAVec3 is done on 4 vectors at a
        time (the actual amount is defined by ARRAY_PACKED_FLOATS)
        Assuming ARRAY_PACKED_FLOATS == 4, the memory layout will
        be as following:
            mChunkBase     mChunkBase + 3
        XXXX YYYY ZZZZ      XXXX YYYY ZZZZ
        Extracting one vector (XYZ) needs 48 bytes, which is within
        the 64 byte size of common cache lines.
        Architectures where the cache line == 32 bytes may want to
        set ARRAY_PACKED_FLOATS = 2 depending on their needs
*/
class SoAVec3
{
public:
	SoAFloat	m[3];

public:
	SoAVec3() {}
	SoAVec3(SoAFloat chunkX, SoAFloat chunkY, SoAFloat chunkZ)
	{
        m[0] = chunkX;
        m[1] = chunkY;
        m[2] = chunkZ;
	}
	
public:
	Vec3 getVec3(size_t index) const
	{
		Vec3 out;
		//Be careful of not writing to these regions or else strict aliasing rule gets broken!!!
		const float *aliasedReal = reinterpret_cast<const float*>(m);
		out.x = aliasedReal[ARRAY_PACKED_FLOATS * 0 + index];	//X
		out.y = aliasedReal[ARRAY_PACKED_FLOATS * 1 + index];	//Y
		out.z = aliasedReal[ARRAY_PACKED_FLOATS * 2 + index];	//Z
		return out;
    }

	void fromVec3(const Vec3 &v, size_t index)
    {
        float *aliasedReal = reinterpret_cast<float*>(m);
        aliasedReal[ARRAY_PACKED_FLOATS * 0 + index] = v.x;
        aliasedReal[ARRAY_PACKED_FLOATS * 1 + index] = v.y;
        aliasedReal[ARRAY_PACKED_FLOATS * 2 + index] = v.z;
    }

	/// Sets all packed vectors to the same value as the scalar input vector
	void set(const Vec3 &v)
	{
		m[0] = v.x;
		m[1] = v.y;
		m[2] = v.z;
	}

	// Arithmetic operations
	inline const SoAVec3& operator + () const;
	inline SoAVec3 operator - () const;

	inline friend SoAVec3 operator + (const SoAVec3 &lhs, const SoAVec3 &rhs);
	inline friend SoAVec3 operator + (float fScalar, const SoAVec3 &rhs);
	inline friend SoAVec3 operator + (const SoAVec3 &lhs, float fScalar);

	inline friend SoAVec3 operator - (const SoAVec3 &lhs, const SoAVec3 &rhs);
	inline friend SoAVec3 operator - (float fScalar, const SoAVec3 &rhs);
	inline friend SoAVec3 operator - (const SoAVec3 &lhs, float fScalar);

	inline friend SoAVec3 operator * (const SoAVec3 &lhs, const SoAVec3 &rhs);
	inline friend SoAVec3 operator * (float fScalar, const SoAVec3 &rhs);
	inline friend SoAVec3 operator * (const SoAVec3 &lhs, float fScalar);

	inline friend SoAVec3 operator / (const SoAVec3 &lhs, const SoAVec3 &rhs);
	inline friend SoAVec3 operator / (float fScalar, const SoAVec3 &rhs);
	inline friend SoAVec3 operator / (const SoAVec3 &lhs, float fScalar);

    inline void operator += (const SoAVec3 &a);
    inline void operator += (const SoAFloat fScalar);

    inline void operator -= (const SoAVec3 &a);
    inline void operator -= (const SoAFloat fScalar);

    inline void operator *= (const SoAVec3 &a);
    inline void operator *= (const SoAFloat fScalar);

    inline void operator /= (const SoAVec3 &a);
    inline void operator /= (const SoAFloat fScalar);

    inline SoAFloat len() const;
    inline SoAFloat lenSqr() const;
	inline SoAFloat dist(const SoAVec3 &vec) const;
	inline SoAFloat distSqr(const SoAVec3 &vec) const;
    inline SoAFloat dot(const SoAVec3 &vec) const;
    inline void normalize();
	inline SoAVec3 cross(const SoAVec3 &rkVector) const;
    inline SoAVec3 midPoint(const SoAVec3 &vec) const;
    inline void makeFloor(const SoAVec3 &cmp);
    inline void makeCeil(const SoAVec3 &cmp);

    /// Returns the smallest value between x, y, z; min( x, y, z )
    inline SoAFloat getMinComponent() const;

    /// Returns the biggest value between x, y, z; max( x, y, z )
    inline SoAFloat getMaxComponent() const;

    /** Converts the vector to (sign(x), sign(y), sign(z))
    @remarks
        For reference, sign( x ) = x >= 0 ? 1.0 : -1.0
        sign( -0.0f ) may return 1 or -1 depending on implementation
        @par
        SSE2 implementation: Does distinguish between -0 & 0
        C implementation: Does not distinguish between -0 & 0
    */
    inline void setToSign();

    /** Calculates the inverse of the vectors: 1.0f / v;
        But if original is zero, the zero is left (0 / 0 = 0).
        Example:
        Bfore inverseLeaveZero:
            x = 0; y = 2; z = 3;
        After inverseLeaveZero
            x = 0; y = 0.5; z = 0.3333;
    */
    inline void inverseLeaveZeroes();

    /** Takes each Vector and returns one returns a single vector
    @remarks
        This is useful when calculating bounding boxes, since it can be done independently
        in SIMD form, and once it is done, merge the results from the simd vectors into one
    @return
        Vector.x = min( vector[0].x, vector[1].x, vector[2].x, vector[3].x )
        Vector.y = min( vector[0].y, vector[1].y, vector[2].y, vector[3].y )
        Vector.z = min( vector[0].z, vector[1].z, vector[2].z, vector[3].z )
    */
    inline Vec3 collapseMin() const;

    /** Takes each Vector and returns one returns a single vector
    @remarks
        This is useful when calculating bounding boxes, since it can be done independently
        in SIMD form, and once it is done, merge the results from the simd vectors into one
    @return
        Vector.x = max( vector[0].x, vector[1].x, vector[2].x, vector[3].x )
        Vector.y = max( vector[0].y, vector[1].y, vector[2].y, vector[3].y )
        Vector.z = max( vector[0].z, vector[1].z, vector[2].z, vector[3].z )
    */
    inline Vec3 collapseMax() const;

    /** Conditional move update. @See SoAMathlibC::Cmov4
        Changes each of the four vectors contained in 'this' with
        the replacement provided
        @remarks
            If mask param contains anything other than 0's or 0xffffffff's
            the result is undefined.
            Use this version if you want to decide whether to keep current
            result or overwrite with a replacement (performance optimization).
            i.e. a = Cmov4( a, b )
            If this vector hasn't been assigned yet any value and want to
            decide between two SoAVec3s, i.e. a = Cmov4( b, c ) then
            @see Cmov4( const SoAVec3 &arg1, const SoAVec3 &arg2, ArrayReal mask );
            instead.
        @param
            Vectors to be used as replacement if the mask is zero.
        @param
            mask filled with either 0's or 0xFFFFFFFF
        @return
            this[i] = mask[i] != 0 ? this[i] : replacement[i]
    */
    inline void cmov4(SoAMaskF mask, const SoAVec3 &replacement);

    /** Conditional move update. @See SoAMathlibC::CmovRobust
        Changes each of the four vectors contained in 'this' with
        the replacement provided
        @remarks
            If mask param contains anything other than 0's or 0xffffffff's
            the result is undefined.
            Use this version if you want to decide whether to keep current
            result or overwrite with a replacement (performance optimization).
            i.e. a = CmovRobust( a, b )
            If this vector hasn't been assigned yet any value and want to
            decide between two SoAVec3s, i.e. a = Cmov4( b, c ) then
            @see Cmov4( const SoAVec3 &arg1, const SoAVec3 &arg2, ArrayReal mask );
            instead.
        @param
            Vectors to be used as replacement if the mask is zero.
        @param
            mask filled with either 0's or 0xFFFFFFFF
        @return
            this[i] = mask[i] != 0 ? this[i] : replacement[i]
    */
    inline void cmovRobust(SoAMaskF mask, const SoAVec3 &replacement);

    /** Conditional move. @See SoAMathlibC::Cmov4
        Selects between arg1 & arg2 according to mask
        @remarks
            If mask param contains anything other than 0's or 0xffffffff's
            the result is undefined.
            If you wanted to do a = cmov4( a, b ), then consider using the update version
            @see Cmov4( ArrayReal mask, const SoAVec3 &replacement );
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
    inline static void Cmov4(SoAVec3 &outVec, const SoAVec3 &arg1, const SoAVec3 &arg2, SoAMaskF mask);
};

#include "SoAVec3-inl.h"

extern  const SoAVec3 SOAVEC3_ZERO;
extern  const SoAVec3 SOAVEC3_ONE;
extern  const SoAVec3 SOAVEC3_UNIT_X;
extern  const SoAVec3 SOAVEC3_UNIT_Y;
extern  const SoAVec3 SOAVEC3_UNIT_Z;
extern  const SoAVec3 SOAVEC3_NEG_UNIT_X;
extern  const SoAVec3 SOAVEC3_NEG_UNIT_Y;
extern  const SoAVec3 SOAVEC3_NEG_UNIT_Z;

CC_NAMESPACE_END

#endif
