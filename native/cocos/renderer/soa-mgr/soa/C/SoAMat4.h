#ifndef __SOAMAT4_H__
#define __SOAMAT4_H__

#include "SoA/SoADef.h"
#include "SoAMathLib.h"
#include "SoAVec3.h"
#include "SoAQuat.h"
#include "math/Mat4.h"

CC_NAMESPACE_BEGIN

/** Simple wrap up to load an AoS matrix 4x4 using SSE. The main reason of this class
    is to force MSVC to use 4 movaps to load arrays of Matrix4s (which are way more
    efficient that whatever lea+mov junk it tries to produce)
*/
class SmartMat4
{
public:
	SoAFloat	m[16];

	void load(const Mat4& src)
	{
		memcpy(m, src.m, sizeof(Mat4));
	}
};

/** Cache-friendly container of 4x4 matrices represented as a SoA array.
    @remarks
        SoAMat4 is a SIMD & cache-friendly version of Matrix4.
        An operation on an SoAMat4 is done on 4 vectors at a
        time (the actual amount is defined by ARRAY_PACKED_FLOATS)
        Assuming ARRAY_PACKED_FLOATS == 4, the memory layout will
        be as following:
            mChunkBase mChunkBase + 3
            a00b00c00d00    a01b01c01d01
        Extracting one Matrix4 needs 256 bytes, which needs 4 line
        fetches for common cache lines of 64 bytes.
        Make sure extractions are made sequentially to avoid cache
        trashing and excessive bandwidth consumption, and prefer
        working on @See ArrayVector3 & @See ArrayQuaternion instead
        Architectures where the cache line == 32 bytes may want to
        set ARRAY_PACKED_FLOATS = 2 depending on their needs
*/
class SoAMat4
{
public:
	SoAFloat	m[16];

public:
	SoAMat4() {}

	SoAMat4(const Mat4 &mat)
	{
		set(mat);
	}

public:
	Mat4 getMat4(size_t index) const
	{
		Mat4 out;
		//Be careful of not writing to these regions or else strict aliasing rule gets broken!!!
		const float * CC_RESTRICT aliasedReal = reinterpret_cast<const float*>(m);
		float * CC_RESTRICT matrix = reinterpret_cast<float*>(out.m);
		for( size_t i=0; i<16; i+=4 )
		{
			matrix[i  ] = aliasedReal[ARRAY_PACKED_FLOATS * (i  ) + index];
			matrix[i+1] = aliasedReal[ARRAY_PACKED_FLOATS * (i+1) + index];
			matrix[i+2] = aliasedReal[ARRAY_PACKED_FLOATS * (i+2) + index];
			matrix[i+3] = aliasedReal[ARRAY_PACKED_FLOATS * (i+3) + index];
		}
		return out;
	}

	void fromMat4(const Mat4& mat, size_t index)
	{
		float * CC_RESTRICT aliasedReal = reinterpret_cast<float*>(m);
		const float * CC_RESTRICT matrix = reinterpret_cast<const float*>(mat.m);
		for(size_t i = 0; i < 16; i += 4)
		{
			aliasedReal[ARRAY_PACKED_FLOATS * (i  ) + index] = matrix[i  ];
			aliasedReal[ARRAY_PACKED_FLOATS * (i+1) + index] = matrix[i+1];
			aliasedReal[ARRAY_PACKED_FLOATS * (i+2) + index] = matrix[i+2];
			aliasedReal[ARRAY_PACKED_FLOATS * (i+3) + index] = matrix[i+3];
		}
	}

	// Sets all packed matrices to the same value as the scalar input matrix
	void set(const Mat4& mat)
	{
		memcpy(m, mat.m, sizeof(Mat4));
	}

    // Concatenation
    inline friend SoAMat4 operator * (const SoAMat4& lhs, const SoAMat4& rhs);

    inline SoAVec3 operator * (const SoAVec3& rhs) const;

    // Prefer the update version 'a *= b' A LOT over 'a = a * b'
    // (copying from an SoAMat4 is 256 bytes!)
    inline void operator *= (const SoAMat4& rhs);

    /** Converts the given quaternion to a 3x3 matrix representation and fill our values
        @remarks
            Similar to @see Quaternion::ToRotationMatrix, this function will take the input
            quaternion and overwrite the first 3x3 subset of this matrix. The 4th row &
            columns are left untouched.
            This function is defined in SoAMat4 to avoid including this header into
            ArrayQuaternion. The idea is that SoAMat4 requires ArrayQuaternion, and
            ArrayQuaternion requires ArrayVector3. Simple dependency order
        @param
            The quaternion to convert from.
    */
	inline void fromQuat(const SoAQuat& quan);
	inline void toQuat(SoAQuat& quan);

	inline void compose(const SoAVec3& pos, const SoAVec3& scale, const SoAQuat& rot);
	inline void decompose(SoAVec3& pos, SoAVec3& scale, SoAQuat& rot);

    /** Converts these matrices contained in this ArrayMatrix to AoS form and stores them in dst
    @remarks
        'dst' must be aligned and assumed to have enough memory for ARRAY_PACKED_REALS matrices
    */
    inline void storeToAoS(Mat4 * CC_RESTRICT dst) const;

    /** Converts ARRAY_PACKED_REALS matrices into this ArrayMatrix
    @remarks
        'src' must be aligned and assumed to have enough memory for ARRAY_PACKED_REALS matrices
    */
	inline void loadFromAoS(const Mat4 * CC_RESTRICT src);
	inline void loadFromAoS(const SmartMat4 * CC_RESTRICT src);

    inline bool isAffine() const;
};

#include "SoAMat4-inl.h"

extern const SoAMat4 SOAMAT4_IDENTITY;

CC_NAMESPACE_END

#endif
