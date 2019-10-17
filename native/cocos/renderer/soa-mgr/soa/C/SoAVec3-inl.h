/** HOW THIS WORKS:

    Instead of writing like 12 times the same code, we use macros:
    DEFINE_OPERATION( SoAVec3, SoAVec3, +, _mm_add_ps );
    Means: "define '+' operator that takes both arguments as SoAVec3 and use
    the _mm_add_ps intrinsic to do the job"

    Note that for scalars (i.e. floats) we use DEFINE_L_SCALAR_OPERATION/DEFINE_R_SCALAR_OPERATION
    depending on whether the scalar is on the left or right side of the operation
    (i.e. 2 * a vs a * 2)
    And for ArrayReal scalars we use DEFINE_L_OPERATION/DEFINE_R_OPERATION

    As for division, we use specific scalar versions to increase performance (calculate
    the inverse of the scalar once, then multiply) as well as placing asserts in
    case of trying to divide by zero.

    I've considered using templates, but decided against it because wrong operator usage
    would raise cryptic compile error messages, and templates inability to limit which
    types are being used, leave the slight possibility of mixing completely unrelated
    types (i.e. SoAQuan + ArrayVector4) and quietly compiling wrong code.
    Furthermore some platforms may not have decent compilers handling templates for
    major operator usage.

    Advantages:
        * Increased readability
        * Ease of reading & understanding
    Disadvantages:
        * Debugger can't go inside the operator. See workaround.

    As a workaround to the disadvantage, you can compile this code using cl.exe /EP /P /C to
    generate this file with macros replaced as actual code (very handy!)
*/

// Arithmetic operations
#define DEFINE_OPERATION(leftClass, rightClass, op)\
	inline SoAVec3 operator op (const leftClass &lhs, const rightClass &rhs)\
	{\
		const SoAFloat * CC_RESTRICT lhsChunkBase = lhs.m;\
		const SoAFloat * CC_RESTRICT rhsChunkBase = rhs.m;\
		return SoAVec3(lhsChunkBase[0] op rhsChunkBase[0], lhsChunkBase[1] op rhsChunkBase[1], lhsChunkBase[2] op rhsChunkBase[2]);\
	}

#define DEFINE_L_OPERATION(leftType, rightClass, op)\
	inline SoAVec3 operator op ( const leftType fScalar, const rightClass &rhs )\
	{\
		return SoAVec3(fScalar op rhs.m[0],\
						fScalar op rhs.m[1],\
						fScalar op rhs.m[2]);\
    }

#define DEFINE_R_OPERATION(leftClass, rightType, op)\
	inline SoAVec3 operator op ( const leftClass &lhs, const rightType fScalar )\
	{\
		return SoAVec3(lhs.m[0] op fScalar, lhs.m[1] op fScalar, lhs.m[2] op fScalar);\
	}

#define DEFINE_L_SCALAR_DIVISION(leftType, rightClass, op)\
    inline SoAVec3 operator op (const leftType fScalar, const rightClass &rhs)\
	{\
        return SoAVec3(fScalar op rhs.m[0], fScalar op rhs.m[1], fScalar op rhs.m[2] );\
	}

#define DEFINE_R_SCALAR_DIVISION(leftClass, rightType, op, op_func)\
	inline SoAVec3 operator op (const leftClass &lhs, const rightType fScalar)\
	{\
		float fInv = 1.0f / fScalar;\
		return SoAVec3(lhs.m[0] op_func fInv, lhs.m[1] op_func fInv, lhs.m[2] op_func fInv );\
    }

#if (CC_MODE == CC_MODE_DEBUG)
#	define ASSERT_DIV_BY_ZERO(values) {  }
#else
#	define ASSERT_DIV_BY_ZERO(values) ((void)0)
#endif

// Update operations
#define DEFINE_UPDATE_OPERATION(leftClass, op)\
    inline void SoAVec3::operator op (const leftClass &a)\
    {\
        SoAFloat * CC_RESTRICT chunkBase = m;\
        const SoAFloat * CC_RESTRICT aChunkBase = a.m;\
        chunkBase[0] op aChunkBase[0];\
        chunkBase[1] op aChunkBase[1];\
        chunkBase[2] op aChunkBase[2];\
    }

#define DEFINE_UPDATE_R_SCALAR_OPERATION(rightType, op)\
    inline void SoAVec3::operator op (const rightType fScalar)\
    {\
        m[0] op fScalar;\
        m[1] op fScalar;\
        m[2] op fScalar;\
    }

#define DEFINE_UPDATE_R_SCALAR_DIVISION(rightType, op, op_func)\
	inline void SoAVec3::operator op (const rightType fScalar)\
	{\
	float fInv = 1.0f / fScalar;\
	m[0] = m[0] op_func fInv;\
	m[1] = m[1] op_func fInv;\
	m[2] = m[2] op_func fInv;\
	}

inline const SoAVec3& SoAVec3::operator + () const
{
    return *this;
};

inline SoAVec3 SoAVec3::operator - () const
{
    return SoAVec3( -m[0], -m[1], -m[2] );
}

// + Addition
DEFINE_OPERATION( SoAVec3, SoAVec3, + );
DEFINE_L_OPERATION( float, SoAVec3, + );
DEFINE_R_OPERATION( SoAVec3, float, + );

// - Subtraction
DEFINE_OPERATION( SoAVec3, SoAVec3, - );
DEFINE_L_OPERATION( float, SoAVec3, - );
DEFINE_R_OPERATION( SoAVec3, float, - );

// * Multiplication
DEFINE_OPERATION( SoAVec3, SoAVec3, * );
DEFINE_L_OPERATION( float, SoAVec3, * );
DEFINE_R_OPERATION( SoAVec3, float, * );

// / Division (scalar versions use mul instead of div, because they mul against the reciprocal)
DEFINE_OPERATION( SoAVec3, SoAVec3, / );
DEFINE_L_SCALAR_DIVISION( float, SoAVec3, / );
DEFINE_R_SCALAR_DIVISION( SoAVec3, float, /, * );

inline void SoAVec3::Cmov4(SoAVec3 &outVec, const SoAVec3 &arg1, const SoAVec3 &arg2, SoAMaskF mask)
{
	outVec.m[0] = SoAMath::Cmov4(arg1.m[0], arg2.m[0], mask);
	outVec.m[1] = SoAMath::Cmov4(arg1.m[1], arg2.m[1], mask);
	outVec.m[2] = SoAMath::Cmov4(arg1.m[2], arg2.m[2], mask);
}

// Update operations
// +=
DEFINE_UPDATE_OPERATION( SoAVec3, += );
DEFINE_UPDATE_R_SCALAR_OPERATION( float, += );

// -=
DEFINE_UPDATE_OPERATION( SoAVec3, -= );
DEFINE_UPDATE_R_SCALAR_OPERATION( float, -= );

// *=
DEFINE_UPDATE_OPERATION( SoAVec3, *= );
DEFINE_UPDATE_R_SCALAR_OPERATION( float, *= );

// /=
DEFINE_UPDATE_OPERATION(SoAVec3, /= );
DEFINE_UPDATE_R_SCALAR_DIVISION( float, /=, * );

inline SoAFloat SoAVec3::len() const
{
    return Math::Sqrt((m[0] * m[0]) + (m[1] * m[1]) + (m[2] * m[2]));
}

inline SoAFloat SoAVec3::lenSqr() const
{
    return (m[0] * m[0]) + (m[1] * m[1]) + (m[2] * m[2]);
}

inline SoAFloat SoAVec3::dist(const SoAVec3 &vec) const
{
	return (*this - vec).len();
}

inline SoAFloat SoAVec3::distSqr(const SoAVec3 &vec) const
{
	return (*this - vec).lenSqr();
}

inline SoAFloat SoAVec3::dot(const SoAVec3 &vec) const
{
    return (m[0] * vec.m[0]) + (m[1] * vec.m[1]) + (m[2] * vec.m[2]);
}

inline void SoAVec3::normalize()
{
    SoAFloat sqLength = (m[0] * m[0]) + (m[1] * m[1]) + (m[2] * m[2]);

    //Convert sqLength's 0s into 1, so that zero vectors remain as zero
    //Denormals are treated as 0 during the check.
    //Note: We could create a mask now and nuke nans after InvSqrt, however
    //generating the nans could impact performance in some architectures
    sqLength = SoAMath::Cmov4(sqLength, 1.0f, sqLength > SoAMath::MIN_FLOAT);
    SoAFloat invLength = SoAMath::InvSqrtNonZero4( sqLength );
    m[0] = m[0] * invLength; //x * invLength
    m[1] = m[1] * invLength; //y * invLength
    m[2] = m[2] * invLength; //z * invLength
}

inline SoAVec3 SoAVec3::cross( const SoAVec3& rkVec ) const
{
	return SoAVec3(	m[1] * rkVec.m[2] - m[2] * rkVec.m[1],
					m[2] * rkVec.m[0] - m[0] * rkVec.m[2],
					m[0] * rkVec.m[1] - m[1] * rkVec.m[0]);
}

inline SoAVec3 SoAVec3::midPoint(const SoAVec3 &rkVec) const
{
    return SoAVec3(	(m[0] + rkVec.m[0]) * 0.5f,
					(m[1] + rkVec.m[1]) * 0.5f,
					(m[2] + rkVec.m[2]) * 0.5f );
}

inline void SoAVec3::makeFloor(const SoAVec3 &cmp)
{
    SoAFloat * CC_RESTRICT aChunkBase = &m[0];
    const SoAFloat * CC_RESTRICT bChunkBase = &cmp.m[0];
    aChunkBase[0] = Math::Min( aChunkBase[0], bChunkBase[0] );
    aChunkBase[1] = Math::Min( aChunkBase[1], bChunkBase[1] );
    aChunkBase[2] = Math::Min( aChunkBase[2], bChunkBase[2] );
}

inline void SoAVec3::makeCeil(const SoAVec3 &cmp)
{
    SoAFloat * CC_RESTRICT aChunkBase = &m[0];
    const SoAFloat * CC_RESTRICT bChunkBase = &cmp.m[0];
    aChunkBase[0] = Math::Max( aChunkBase[0], bChunkBase[0] );
    aChunkBase[1] = Math::Max( aChunkBase[1], bChunkBase[1] );
    aChunkBase[2] = Math::Max( aChunkBase[2], bChunkBase[2] );
}

inline SoAFloat SoAVec3::getMinComponent() const
{
    return Math::Min3(m[0], m[1], m[2]);
}

inline SoAFloat SoAVec3::getMaxComponent() const
{
    return Math::Max3(m[0], m[1], m[2]);
}
    
inline void SoAVec3::setToSign()
{
    m[0] = m[0] >= 0 ? 1.0f : -1.0f;
    m[1] = m[1] >= 0 ? 1.0f : -1.0f;
    m[2] = m[2] >= 0 ? 1.0f : -1.0f;
}

inline void SoAVec3::inverseLeaveZeroes()
{
    m[0] = SoAMath::CmovRobust(m[0], SoAMath::InvNonZero4(m[0]), m[0] == 0.0f);
    m[1] = SoAMath::CmovRobust(m[1], SoAMath::InvNonZero4(m[1]), m[1] == 0.0f);
    m[2] = SoAMath::CmovRobust(m[2], SoAMath::InvNonZero4(m[2]), m[2] == 0.0f);
}

inline Vec3 SoAVec3::collapseMin() const
{
    return Vec3(m[0], m[1], m[2]);
}

inline Vec3 SoAVec3::collapseMax() const
{
    return Vec3(m[0], m[1], m[2]);
}

inline void SoAVec3::cmov4(SoAMaskF mask, const SoAVec3 &replacement)
{
    SoAFloat * CC_RESTRICT aChunkBase = &m[0];
    const SoAFloat * CC_RESTRICT bChunkBase = &replacement.m[0];
    aChunkBase[0] = SoAMath::Cmov4(aChunkBase[0], bChunkBase[0], mask);
    aChunkBase[1] = SoAMath::Cmov4(aChunkBase[1], bChunkBase[1], mask);
    aChunkBase[2] = SoAMath::Cmov4(aChunkBase[2], bChunkBase[2], mask);
}

inline void SoAVec3::cmovRobust(SoAMaskF mask, const SoAVec3 &replacement)
{
    SoAFloat * CC_RESTRICT aChunkBase = &m[0];
    const SoAFloat * CC_RESTRICT bChunkBase = &replacement.m[0];
    aChunkBase[0] = SoAMath::CmovRobust(aChunkBase[0], bChunkBase[0], mask);
    aChunkBase[1] = SoAMath::CmovRobust(aChunkBase[1], bChunkBase[1], mask);
    aChunkBase[2] = SoAMath::CmovRobust(aChunkBase[2], bChunkBase[2], mask);
}

#undef DEFINE_OPERATION
#undef DEFINE_L_OPERATION
#undef DEFINE_R_OPERATION
#undef DEFINE_L_SCALAR_DIVISION
#undef DEFINE_R_SCALAR_DIVISION

#undef DEFINE_UPDATE_OPERATION
#undef DEFINE_UPDATE_R_SCALAR_OPERATION
#undef DEFINE_UPDATE_DIVISION
#undef DEFINE_UPDATE_R_SCALAR_DIVISION