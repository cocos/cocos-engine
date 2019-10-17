/*
Concatenates two 4x4 array matrices.
@remarks
	99.99% of the cases the matrix isn't concatenated with itself, therefore it's
	safe to assume &lhs != &rhs. RESTRICT_ALIAS modifier is used (a non-standard
	C++ extension) is used when available to dramatically improve performance,
	particularly of the update operations ( a *= b )
	This function will assert if CC_RESTRICT is enabled and any of the
	given pointers point to the same location
*/

inline void _ConcatSoAMat4(SoAFloat * CC_RESTRICT ret, const SoAFloat * CC_RESTRICT a, const SoAFloat * CC_RESTRICT b )
{
    //CC_ASSERTS(ret != a && ret != b && a != b, "Re-strict aliasing rule broken.");
    ret[0] = (a[0] * b[0] + a[4] * b[1]) + (a[8] * b[2] + a[12] * b[3]);
    ret[4] = (a[0] * b[4] + a[4] * b[5]) + (a[8] * b[6] + a[12] * b[7]);
    ret[8] = (a[0] * b[8] + a[4] * b[9]) + (a[8] * b[10] + a[12] * b[11]);
    ret[12] = (a[0] * b[12] + a[4] * b[13]) + (a[8] * b[14] + a[12] * b[15]);
	// Next row (1)
    ret[1] = (a[1] * b[0] + a[5] * b[1]) + (a[9] * b[2] + a[13] * b[3]);
    ret[5] = (a[1] * b[4] + a[5] * b[5]) + (a[9] * b[6] + a[13] * b[7]);
    ret[9] = (a[1] * b[8] + a[5] * b[9]) + (a[9] * b[10] + a[13] * b[11]);
    ret[13] = (a[1] * b[12] + a[5] * b[13]) + (a[9] * b[14] + a[13] * b[15]);
    // Next row (2)
    ret[2] = (a[2] * b[0] + a[6] * b[1]) + (a[10] * b[2] + a[14] * b[3]);
    ret[6] = (a[2] * b[4] + a[6] * b[5]) + (a[10] * b[6] + a[14] * b[7]);
    ret[10] = (a[2] * b[8] + a[6] * b[9]) + (a[10] * b[10] + a[14] * b[11]);
    ret[14] = (a[2] * b[12] + a[6] * b[13]) + (a[10] * b[14] + a[14] * b[15]);
	// Next row (3)
    ret[3] = (a[3] * b[0] + a[7] * b[1]) + (a[11] * b[2] + a[15] * b[3]);
    ret[7] = (a[3] * b[4] + a[7] * b[5]) + (a[11] * b[6] + a[15] * b[7]);
    ret[11] = (a[3] * b[8] + a[7] * b[9]) + (a[11] * b[10] + a[15] * b[11]);
    ret[15] = (a[3] * b[12] + a[7] * b[13]) + (a[11] * b[14] + a[15] * b[15]);
}

// Update version
inline void _ConcatSoAMat4 (SoAFloat * CC_RESTRICT a, const SoAFloat * CC_RESTRICT b)
{
	//CC_ASSERTS(a != a, "Re-strict aliasing rule broken.");
	SoAFloat lhs0 = a[0];
	a[0] = (a[0] * b[0] + a[4] * b[1]) + (a[8] * b[2] + a[12] * b[3]);
	SoAFloat lhs1 = a[4];
	a[4] = (lhs0 * b[4] + a[4] * b[5]) + (a[8] * b[6] + a[12] * b[7]);
	SoAFloat lhs2 = a[8];
	a[8] = (lhs0 * b[8] + lhs1 * b[9]) + (a[8] * b[10] + a[12] * b[11]);
	a[12] = (lhs0 * b[12] + lhs1 * b[13]) + (lhs2 * b[14] + a[12] * b[15]);
    // Next row (1)
	lhs0 = a[1];
	a[1] = (a[1] * b[0] + a[5] * b[1]) + (a[9] * b[2] + a[13] * b[3]);
	lhs1 = a[5];
	a[5] = (lhs0 * b[4] + a[5] * b[5]) + (a[9] * b[6] + a[13] * b[7]);
	lhs2 = a[6];
	a[9] = (lhs0 * b[8] + lhs1 * b[9]) + (a[9] * b[10] + a[13] * b[11]);
	a[13] = (lhs0 * b[12] + lhs1 * b[13]) + (lhs2 * b[14] + a[13] * b[15]);
	// Next row (2)
	lhs0 = a[2];
	a[2] = (a[2] * b[0] + a[6] * b[1]) + (a[10] * b[2] + a[14] * b[3]);
	lhs1 = a[6];
	a[6] = (lhs0 * b[4] + a[6] * b[5]) + (a[10] * b[6] + a[14] * b[7]);
	lhs2 = a[10];
	a[10] = (lhs0 * b[8] + lhs1 * b[9]) + (a[10] * b[10] + a[14] * b[11]);
	a[14] = (lhs0 * b[12] + lhs1 * b[13]) + (lhs2 * b[14] + a[14] * b[15]);
    /* Next row (3) */
    lhs0 = a[3];
    a[3] = (a[3] * b[0] + a[7] * b[1]) + (a[11] * b[2] + a[15] * b[3]);
    lhs1 = a[7];
    a[7] = (lhs0 * b[4] + a[7] * b[5]) + (a[11] * b[6] + a[15] * b[7]);
    lhs2 = a[11];
    a[11] = (lhs0 * b[8] + lhs1 * b[9]) + (a[11] * b[10] + a[15] * b[11]);
    a[15] = (lhs0 * b[12] + lhs1 * b[13]) + (lhs2 * b[14] + a[15] * b[15]);
}

inline SoAMat4 operator * ( const SoAMat4& lhs, const SoAMat4& rhs )
{
	SoAMat4 retVal;
	_ConcatSoAMat4( retVal.m, lhs.m, rhs.m);
	return retVal;
}

inline SoAVec3 SoAMat4::operator * (const SoAVec3& rhs) const
{
	SoAFloat invW = (m[3] * rhs.m[0] + m[7] * rhs.m[1]) + (m[11] * rhs.m[2] + m[15]);
	invW = SoAMath::Inv4(invW);

    return SoAVec3(
        //X = ( m00 * v.x + m01 * v.y + m02 * v.z + m03 ) * fInvW
        (m[0] * rhs.m[0] + m[4] * rhs.m[1] + m[8] * rhs.m[2] + m[12] ) * invW,
        //Y = ( m10 * v.x + m11 * v.y + m12 * v.z + m13 ) * fInvW
        (m[1] * rhs.m[0] + m[5] * rhs.m[1] + m[9] * rhs.m[2] + m[13] ) * invW,
        //Z = ( m20 * v.x + m21 * v.y + m22 * v.z + m23 ) * fInvW
        (m[2] * rhs.m[0] + m[6] * rhs.m[1] + m[10] * rhs.m[2] + m[14] ) * invW);
}

inline void SoAMat4::operator *= (const SoAMat4& rhs)
{
    _ConcatSoAMat4(m, rhs.m);
}

inline void SoAMat4::fromQuat(const SoAQuat& quat)
{
	SoAFloat * CC_RESTRICT chunkBase = m;
    const SoAFloat * CC_RESTRICT qChunkBase = &quat.w;
    SoAFloat fTx  = qChunkBase[1] + qChunkBase[1];         // 2 * x
    SoAFloat fTy  = qChunkBase[2] + qChunkBase[2];         // 2 * y
    SoAFloat fTz  = qChunkBase[3] + qChunkBase[3];         // 2 * z
    SoAFloat fTwx = fTx * qChunkBase[0];                   // fTx*w;
    SoAFloat fTwy = fTy * qChunkBase[0];                   // fTy*w;
    SoAFloat fTwz = fTz * qChunkBase[0];                   // fTz*w;
    SoAFloat fTxx = fTx * qChunkBase[1];                   // fTx*x;
    SoAFloat fTxy = fTy * qChunkBase[1];                   // fTy*x;
    SoAFloat fTxz = fTz * qChunkBase[1];                   // fTz*x;
    SoAFloat fTyy = fTy * qChunkBase[2];                   // fTy*y;
    SoAFloat fTyz = fTz * qChunkBase[2];                   // fTz*y;
    SoAFloat fTzz = fTz * qChunkBase[3];                   // fTz*z;

	chunkBase[0] = 1.0f - (fTyy + fTzz); chunkBase[4] = fTxy - fTwz;          chunkBase[8] = fTxz + fTwy;
	chunkBase[1] = fTxy + fTwz;          chunkBase[5] = 1.0f - (fTxx + fTzz); chunkBase[9] = fTyz - fTwx;
	chunkBase[2] = fTxz - fTwy;          chunkBase[6] = fTyz + fTwx;          chunkBase[10] = 1.0f - (fTxx + fTyy);
}

inline void SoAMat4::toQuat(SoAQuat &quat)
{
	float fourXSquaredMinus1 = m[0] - m[5] - m[10];
	float fourYSquaredMinus1 = m[5] - m[0] - m[10];
	float fourZSquaredMinus1 = m[10] - m[0] - m[5];
	float fourWSquaredMinus1 = m[0] + m[5] + m[10];

	int biggestIndex = 0;
	float fourBiggestSquaredMinus1 = fourWSquaredMinus1;
	if (fourXSquaredMinus1 > fourBiggestSquaredMinus1)
	{
		fourBiggestSquaredMinus1 = fourXSquaredMinus1;
		biggestIndex = 1;
	}
	if (fourYSquaredMinus1 > fourBiggestSquaredMinus1)
	{
		fourBiggestSquaredMinus1 = fourYSquaredMinus1;
		biggestIndex = 2;
	}
	if (fourZSquaredMinus1 > fourBiggestSquaredMinus1)
	{
		fourBiggestSquaredMinus1 = fourZSquaredMinus1;
		biggestIndex = 3;
	}

	float biggestVal = Math::Sqrt(fourBiggestSquaredMinus1 + 1.0f) * 0.5f;
	float mult = 0.25f / biggestVal;

	switch (biggestIndex)
	{
	case 0:
		quat.w = biggestVal;
		quat.x = (m[6] - m[9]) * mult;
		quat.y = (m[8] - m[2]) * mult;
		quat.z = (m[1] - m[4]) * mult;
		break;
	case 1:
		quat.w = (m[6] - m[9]) * mult;
		quat.x = biggestVal;
		quat.y = (m[1] + m[4]) * mult;
		quat.z = (m[8] + m[2]) * mult;
		break;
	case 2:
		quat.w = (m[8] - m[2]) * mult;
		quat.x = (m[1] + m[4]) * mult;
		quat.y = biggestVal;
		quat.z = (m[9] + m[6]) * mult;
		break;
	case 3:
		quat.w = (m[1] - m[4]) * mult;
		quat.x = (m[8] + m[2]) * mult;
		quat.y = (m[6] + m[9]) * mult;
		quat.z = biggestVal;
		break;
	default: ;
	}
}

inline void SoAMat4::compose(const SoAVec3& pos, const SoAVec3& scale, const SoAQuat& rot)
{
    SoAFloat * CC_RESTRICT chunkBase = m;
    const SoAFloat * CC_RESTRICT posChunkBase = pos.m;
    const SoAFloat * CC_RESTRICT scaleChunkBase = scale.m;
    this->fromQuat(rot);

	chunkBase[0] *= scaleChunkBase[0];	//m00 * scale.x
	chunkBase[1] *= scaleChunkBase[0];	//m10 * scale.x
	chunkBase[2] *= scaleChunkBase[0];	//m20 * scale.x

	chunkBase[4] *= scaleChunkBase[1];	//m01 * scale.y
	chunkBase[5] *= scaleChunkBase[1];	//m11 * scale.y
	chunkBase[6] *= scaleChunkBase[1];	//m21 * scale.y

	chunkBase[8] *= scaleChunkBase[2];	//m02 * scale.z
	chunkBase[9] *= scaleChunkBase[2];	//m12 * scale.z
	chunkBase[10] *= scaleChunkBase[2];	//m22 * scale.z

	chunkBase[12] = posChunkBase[0];		//m03 * pos.x
	chunkBase[13] = posChunkBase[1];		//m13 * pos.y
	chunkBase[14] = posChunkBase[2];		//m23 * pos.z

	// No projection term
	chunkBase[3] = m[7] = m[11] = 0.0f;
	chunkBase[15] = 1.0f;
}

inline void SoAMat4::decompose(SoAVec3& pos, SoAVec3& scale, SoAQuat& rot)
{
	pos.m[0] = m[12];
	pos.m[1] = m[13];
	pos.m[2] = m[14];

	scale.m[0] = Math::Sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
	scale.m[1] = Math::Sqrt(m[4] * m[4] + m[5] * m[5] + m[6] * m[6]);
	scale.m[2] = Math::Sqrt(m[8] * m[8] + m[9] * m[9] + m[10] * m[10]);

	float sx = 1.0f / scale.m[0];
	float sy = 1.0f / scale.m[1];
	float sz = 1.0f / scale.m[2];

	SoAMat4 mat;
	mat.m[0] = m[0] * sx; mat.m[4] = m[4] * sy; mat.m[8] = m[8] * sz;   mat.m[12] = 0.0f;
	mat.m[1] = m[1] * sx; mat.m[5] = m[5] * sy; mat.m[9] = m[9] * sz;   mat.m[13] = 0.0f;
	mat.m[2] = m[2] * sx; mat.m[6] = m[6] * sy; mat.m[10] = m[10] * sz; mat.m[14] = 0.0f;
	mat.m[3] = 0.0f;      mat.m[7] = 0.0f;       mat.m[11] = 0.0f;       mat.m[15] = 1.0f;
	mat.toQuat(rot);
}

inline bool SoAMat4::isAffine() const
{
	return Math::IsEqual(m[3], 0.0f) && Math::IsEqual(m[7], 0.0f) && Math::IsEqual(m[11], 0.0f) && Math::IsEqual(m[15], 1.0f);
}

inline void SoAMat4::storeToAoS(Mat4 * CC_RESTRICT dst) const
{
	*dst = this->getMat4(0);
}

inline void SoAMat4::loadFromAoS(const Mat4 * CC_RESTRICT src)
{
	this->fromMat4(*src, 0);
}

inline void SoAMat4::loadFromAoS(const SmartMat4 * CC_RESTRICT src)
{
	memcpy(m, src->m, sizeof(SmartMat4));
}