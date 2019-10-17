// Arithmetic operations
#define DEFINE_OPERATION(leftClass, rightClass, op)\
	inline SoAQuat operator op ( const leftClass& lhs, const rightClass& rhs )\
	{\
		return SoAQuat(lhs.w op rhs.w, lhs.x op rhs.x, lhs.y op rhs.y, lhs.z op rhs.z );\
	}

#define DEFINE_L_OPERATION(leftType, rightClass, op)\
    inline SoAQuat operator op ( const leftType lhs, const rightClass& rhs )\
    {\
        return SoAQuat(\
                lhs op rhs.w,\
                lhs op rhs.x,\
                lhs op rhs.y,\
                lhs op rhs.z );\
    }
#define DEFINE_R_OPERATION( leftClass, rightType, op )\
    inline SoAQuat operator op ( const leftClass& lhs, const rightType rhs )\
    {\
        return SoAQuat(\
                lhs.w op rhs,\
                lhs.x op rhs,\
                lhs.y op rhs,\
                lhs.z op rhs );\
    }

    // Update operations
#define DEFINE_UPDATE_OPERATION( leftClass, op )\
    inline void SoAQuat::operator op ( const leftClass& a )\
    {\
        w op a.w;\
        x op a.x;\
        y op a.y;\
        z op a.z;\
    }
#define DEFINE_UPDATE_R_OPERATION( rightType, op )\
    inline void SoAQuat::operator op ( const rightType a )\
    {\
        w op a;\
        x op a;\
        y op a;\
        z op a;\
    }

// + Addition
DEFINE_OPERATION(SoAQuat, SoAQuat, + );

// - Subtraction
DEFINE_OPERATION(SoAQuat, SoAQuat, - );

// * Multiplication (scalar only)
DEFINE_L_OPERATION(SoAFloat, SoAQuat, * );
DEFINE_R_OPERATION(SoAQuat, SoAFloat, * );

// Update operations
// +=
DEFINE_UPDATE_OPERATION(SoAQuat, += );

// -=
DEFINE_UPDATE_OPERATION(SoAQuat, -= );

// *=
DEFINE_UPDATE_R_OPERATION(SoAFloat, *= );

// Notes: This operator doesn't get inlined. The generated instruction count is actually high so
// the compiler seems to be clever in not inlining. There is no gain in doing a "Mul()" equivalent
// like we did with Mul( const SoAQuan&, ArrayVector3& ) because we would still need
// a temporary variable to hold all the operations (we can't overwrite to any heap value
// since all values are used until the last operation)
inline SoAQuat operator * (const SoAQuat& lhs, const SoAQuat& rhs )
{
    return SoAQuat(
        /* w = (w * rkQ.w - x * rkQ.x) - (y * rkQ.y + z * rkQ.z) */
        ( lhs.w * rhs.w - lhs.x * rhs.x ) -
        ( lhs.y * rhs.y + lhs.z * rhs.z ),
        /* x = (w * rkQ.x + x * rkQ.w) + (y * rkQ.z - z * rkQ.y) */
        ( lhs.w * rhs.x + lhs.x * rhs.w ) +
        ( lhs.y * rhs.z - lhs.z * rhs.y ),
        /* y = (w * rkQ.y + y * rkQ.w) + (z * rkQ.x - x * rkQ.z) */
        ( lhs.w * rhs.y + lhs.y * rhs.w ) +
        ( lhs.z * rhs.x - lhs.x * rhs.z ),
        /* z = (w * rkQ.z + z * rkQ.w) + (x * rkQ.y - y * rkQ.x) */
        ( lhs.w * rhs.z + lhs.z * rhs.w ) +
        ( lhs.x * rhs.y - lhs.y * rhs.x ) );
}

inline void SoAQuat::Slerp(SoAQuat& outQuat, SoAFloat fT, const SoAQuat& q1, const SoAQuat& q2)
{
    SoAFloat fCos = q1.dot( q2 );
    /* Clamp fCos to [-1; 1] range */
    fCos = Math::Min(1.0f, Math::Max(-1.0f, fCos));
        
    /* Invert the rotation for shortest path? */
    /* m = fCos < 0.0f ? -1.0f : 1.0f; */
    SoAFloat m = SoAMath::Cmov4(-1.0f, 1.0f, fCos < 0);

	outQuat.w = q2.w * m;
	outQuat.x = q2.x * m;
	outQuat.y = q2.y * m;
	outQuat.z = q2.z * m;
        
    SoAFloat fSin = Math::Sqrt(1.0f - ( fCos * fCos ));
        
    /* ATan2 in original Quaternion is slightly absurd, because fSin was derived from
        fCos (hence never negative) which makes ACos a better replacement. ACos is much
        faster than ATan2, as long as the input is whithin range [-1; 1], otherwise the generated
        NaNs make it slower (whether clamping the input outweights the benefit is
        arguable). We use ACos4 to avoid implementing ATan2_4.
    */
    SoAFloat fAngle = SoAMath::ACos4( fCos );

    // mask = Abs( fCos ) < 1-epsilon
    SoAMaskF mask   = Math::Abs(fCos) < SoAMath::ONE_MINUS_EPSILON;
    SoAFloat fInvSin = SoAMath::InvNonZero4(fSin);
    SoAFloat oneSubT = 1.0f - fT;
    // fCoeff1 = Sin( fT * fAngle ) * fInvSin
    SoAFloat fCoeff0 = SoAMath::Sin4(oneSubT * fAngle) * fInvSin;
    SoAFloat fCoeff1 = SoAMath::Sin4(fT * fAngle) * fInvSin;
    // fCoeff1 = mask ? fCoeff1 : fT; (switch to lerp when q1 & rkQ are too close->fSin=0, or 180°)
    fCoeff0 = SoAMath::CmovRobust(fCoeff0, oneSubT, mask);
    fCoeff1 = SoAMath::CmovRobust(fCoeff1, fT, mask);

    // retVal = fCoeff0 * q1 + fCoeff1 * rkT;
    outQuat.w = ( q1.w * fCoeff0 ) + ( outQuat.w * fCoeff1 );
    outQuat.x = ( q1.x * fCoeff0 ) + ( outQuat.x * fCoeff1 );
    outQuat.y = ( q1.y * fCoeff0 ) + ( outQuat.y * fCoeff1 );
    outQuat.z = ( q1.z * fCoeff0 ) + ( outQuat.z * fCoeff1 );

	outQuat.normalize();
}

inline void SoAQuat::Lerp(SoAQuat &outQuan, SoAFloat t, const SoAQuat& q1, const SoAQuat& q2)
{
	outQuan.w = CC_MADD( t, q2.w - q1.w, q1.w );
	outQuan.x = CC_MADD( t, q2.x - q1.x, q1.x );
	outQuan.y = CC_MADD( t, q2.y - q1.y, q1.y );
	outQuan.z = CC_MADD( t, q2.z - q1.z, q1.z );
	outQuan.normalize();
}

inline void SoAQuat::Mul(const SoAQuat& inQ, SoAVec3& inOutVec)
{
    // nVidia SDK implementation
    SoAVec3 qVec(inQ.x, inQ.y, inQ.z);

    SoAVec3 uv = qVec.cross(inOutVec);
    SoAVec3 uuv = qVec.cross(uv);

    // uv = uv * (2.0f * w)
    SoAFloat w2 = inQ.w + inQ.w;
    uv.m[0] = uv.m[0] * w2;
    uv.m[1] = uv.m[1] * w2;
    uv.m[2] = uv.m[2] * w2;

    // uuv = uuv * 2.0f
    uuv.m[0] = uuv.m[0] + uuv.m[0];
    uuv.m[1] = uuv.m[1] + uuv.m[1];
    uuv.m[2] = uuv.m[2] + uuv.m[2];

    //inOutVec = v + uv + uuv
    inOutVec.m[0] = inOutVec.m[0] + uv.m[0] + uuv.m[0];
    inOutVec.m[1] = inOutVec.m[1] + uv.m[1] + uuv.m[1];
    inOutVec.m[2] = inOutVec.m[2] + uv.m[2] + uuv.m[2];
}

inline void SoAQuat::fromAngleAxis(const SoAFloat& radian, const SoAVec3& axis)
{
    // assert:  axis[] is unit length
    //
    // The quaternion representing the rotation is
    //   q = cos(A/2)+sin(A/2)*(x*i+y*j+z*k)
    SoAFloat fHalfAngle(radian * 0.5f);

    SoAFloat fSin;
    SoAMath::SinCos4(fHalfAngle, fSin, w);

    SoAFloat * CC_RESTRICT chunkBase = &w;
    const SoAFloat * CC_RESTRICT rkAxisChunkBase = axis.m;

    chunkBase[1] = fSin * rkAxisChunkBase[0]; //x = fSin*rkAxis.x;
    chunkBase[2] = fSin * rkAxisChunkBase[1]; //y = fSin*rkAxis.y;
    chunkBase[3] = fSin * rkAxisChunkBase[2]; //z = fSin*rkAxis.z;
}

inline void SoAQuat::toAngleAxis(SoAFloat& radian, SoAVec3& rkAxis) const
{
    // The quaternion representing the rotation is
    //   q = cos(A/2)+sin(A/2)*(x*i+y*j+z*k)
    SoAFloat sqLength = x * x + y * y + z * z;
    SoAMaskF mask = sqLength > 0;

    //sqLength = sqLength > 0 ? sqLength : 1; so that invSqrt doesn't give NaNs or Infs
    //when 0 (to avoid using CmovRobust just to select the non-nan results)
    sqLength = SoAMath::Cmov4(sqLength, 1.0f, sqLength > SoAMath::MIN_FLOAT);
    SoAFloat fInvLength = SoAMath::InvSqrtNonZero4( sqLength );

    const SoAFloat acosW = SoAMath::ACos4( w );

	//sqLength > 0 ? (2 * ACos(w)) : 0
    radian = SoAMath::Cmov4(acosW + acosW, 0, mask );

    rkAxis.m[0] = SoAMath::Cmov4(x * fInvLength, 1.0f, mask);	//sqLength > 0 ? (x * fInvLength) : 1
    rkAxis.m[1] = SoAMath::Cmov4(y * fInvLength, 0, mask);		//sqLength > 0 ? (y * fInvLength) : 0
    rkAxis.m[2] = SoAMath::Cmov4(z * fInvLength, 0, mask);		//sqLength > 0 ? (y * fInvLength) : 0
}

inline void SoAQuat::getAxisX(SoAVec3 &axis) const
{
	SoAFloat fTy  = y + y;		// 2 * y
	SoAFloat fTz  = z + z;		// 2 * z
	SoAFloat fTwy = fTy * w;	// fTy*w;
	SoAFloat fTwz = fTz * w;	// fTz*w;
	SoAFloat fTxy = fTy * x;	// fTy*x;
	SoAFloat fTxz = fTz * x;	// fTz*x;
	SoAFloat fTyy = fTy * y;	// fTy*y;
	SoAFloat fTzz = fTz * z;	// fTz*z;

	axis.m[0] = 1.0f - (fTyy + fTzz);
	axis.m[1] = fTxy + fTwz;
	axis.m[2] = fTxz - fTwy;
}

inline void SoAQuat::getAxisY(SoAVec3& axis) const
{
	SoAFloat fTx  = x + x;                     // 2 * x
	SoAFloat fTy  = y + y;                     // 2 * y
	SoAFloat fTz  = z + z;                     // 2 * z
	SoAFloat fTwx = fTx * w;                   // fTx*w;
	SoAFloat fTwz = fTz * w;                   // fTz*w;
	SoAFloat fTxx = fTx * x;                   // fTx*x;
	SoAFloat fTxy = fTy * x;                   // fTy*x;
	SoAFloat fTyz = fTz * y;                   // fTz*y;
	SoAFloat fTzz = fTz * z;                   // fTz*z;

	axis.m[0] = fTxy - fTwz;
	axis.m[1] = 1.0f - (fTxx + fTzz);
	axis.m[2] = fTyz + fTwx;
}

inline void SoAQuat::getAxisZ(SoAVec3& axis) const
{
	SoAFloat fTx  = x + x;		// 2 * x
	SoAFloat fTy  = y + y;		// 2 * y
	SoAFloat fTz  = z + z;		// 2 * z
	SoAFloat fTwx = fTx * w;	// fTx*w;
	SoAFloat fTwy = fTy * w;	// fTy*w;
	SoAFloat fTxx = fTx * x;	// fTx*x;
	SoAFloat fTxz = fTz * x;	// fTz*x;
	SoAFloat fTyy = fTy * y;	// fTy*y;
	SoAFloat fTyz = fTz * y;	// fTz*y;

	axis.m[0] = fTxz + fTwy;
	axis.m[1] = fTyz - fTwx;
	axis.m[2] = 1.0f - (fTxx + fTyy);
}

inline SoAFloat SoAQuat::dot(const SoAQuat& quan) const
{
	return w * quan.w + x * quan.x + y * quan.y + z * quan.z;
}

inline SoAFloat SoAQuat::lenSqr() const
{
	return w * w + x * x + y * y + z * z;
}

inline void SoAQuat::normalize()
{
	SoAFloat sqLength = w * w + x * x + y * y + z * z;

	//Convert sqLength's 0s into 1, so that zero vectors remain as zero
	//Denormals are treated as 0 during the check.
	//Note: We could create a mask now and nuke nans after InvSqrt, however
	//generating the nans could impact performance in some architectures
	sqLength = SoAMath::Cmov4(sqLength, 1.0f, sqLength > SoAMath::MIN_FLOAT);
	SoAFloat invLength = SoAMath::InvSqrtNonZero4(sqLength);
	w *= invLength;
	x *= invLength;
	y *= invLength;
	z *= invLength;
}

inline void SoAQuat::inverse()
{
	SoAFloat fNorm = w * w + x * x + y * y + z * z;

	//Will return a zero Quaternion if original is zero length (Quaternion's behavior)
	fNorm = SoAMath::Cmov4(fNorm, 1.0f, fNorm > SoAMath::EPSILON);
	SoAFloat invNorm = SoAMath::Inv4( fNorm );
	SoAFloat negInvNorm = -invNorm;

	w *= invNorm;
	x *= negInvNorm;
	y *= negInvNorm;
	z *= negInvNorm;
}

inline void SoAQuat::unitInverse()
{
	x = -x;
	y = -y;
	z = -z;
}

inline void SoAQuat::exp()
{
    // If q = A*(x*i+y*j+z*k) where (x,y,z) is unit length, then
    // exp(q) = cos(A)+sin(A)*(x*i+y*j+z*k).  If sin(A) is near zero,
    // use exp(q) = cos(A)+A*(x*i+y*j+z*k) since A/sin(A) has limit 1.

    SoAFloat fAngle = Math::Sqrt(x * x + y * y + z * z);

    SoAFloat fCos, fSin;
    SoAMath::SinCos4(fAngle, fSin, fCos);

    //coeff = Abs(fSin) >= msEpsilon ? (fSin / fAngle) : 1.0f;
    SoAFloat coeff = SoAMath::CmovRobust(fSin / fAngle, 1.0f, Math::Abs(fSin) >= SoAMath::EPSILON);
    x *= coeff;
	y *= coeff;
	z *= coeff;
}

inline void SoAQuat::log()
{
    // If q = cos(A)+sin(A)*(x*i+y*j+z*k) where (x,y,z) is unit length, then
    // log(q) = A*(x*i+y*j+z*k).  If sin(A) is near zero, use log(q) =
    // sin(A)*(x*i+y*j+z*k) since sin(A)/A has limit 1.

    SoAFloat fAngle = SoAMath::ACos4(w);
    SoAFloat fSin = SoAMath::Sin4(fAngle);

    //mask = Math::Abs(w) < 1.0 && Math::Abs(fSin) >= msEpsilon
    SoAMaskF mask = Math::Abs(w) < SoAMath::ONE && Math::Abs(fSin) >= SoAMath::EPSILON;

    //coeff = mask ? (fAngle / fSin) : 1.0
    //Unlike Exp(), we can use InvNonZero4 (which is faster) instead of div because we know for
    //sure CMov will copy the 1 instead of the NaN when fSin is close to zero, guarantee we might
    //not have in Exp()
    SoAFloat coeff = SoAMath::CmovRobust( fAngle * SoAMath::InvNonZero4( fSin ), 1.0f, mask );

    w = 0.0f;
	x *= coeff;
	y *= coeff;
	z *= coeff;
}

inline void SoAQuat::cmov4(SoAMaskF mask, const SoAQuat& replacement)
{
	SoAFloat * CC_RESTRICT aChunkBase = &w;
	const SoAFloat * CC_RESTRICT bChunkBase = &w;
	aChunkBase[0] = SoAMath::Cmov4( aChunkBase[0], bChunkBase[0], mask );
	aChunkBase[1] = SoAMath::Cmov4( aChunkBase[1], bChunkBase[1], mask );
	aChunkBase[2] = SoAMath::Cmov4( aChunkBase[2], bChunkBase[2], mask );
	aChunkBase[3] = SoAMath::Cmov4( aChunkBase[3], bChunkBase[3], mask );
}

inline SoAVec3 SoAQuat::operator * (const SoAVec3& v) const
{
	/*
	float tw = x * v.m[0] + y * v.m[1] + z * v.m[2];
	float tx = w * v.m[0] + y * v.m[2] - z * v.m[1];
	float ty = w * v.m[1] - x * v.m[2] + z * v.m[0];
	float tz = w * v.m[2] + x * v.m[1] - y * v.m[0];

	SoAVec3 ret;
	ret.m[0] = tw * x + tx * w - ty * z + tz * y;
	ret.m[1] = tw * y + tx * z + ty * w - tz * x;
	ret.m[2] = tw * z - tx * y + ty * x + tz * w;

	return ret;
	*/

	// nVidia SDK implementation
	SoAVec3 qVec(x, y, z);

	SoAVec3 uv = qVec.cross(v);
	SoAVec3 uuv = qVec.cross(uv);

	// uv = uv * (2.0f * w)
	SoAFloat w2 = w + w;
	uv.m[0] = uv.m[0] * w2;
	uv.m[1] = uv.m[1] * w2;
	uv.m[2] = uv.m[2] * w2;

	// uuv = uuv * 2.0f
	uuv.m[0] = uuv.m[0] + uuv.m[0];
	uuv.m[1] = uuv.m[1] + uuv.m[1];
	uuv.m[2] = uuv.m[2] + uuv.m[2];

	//uv = v + uv + uuv
	uv.m[0] = v.m[0] + uv.m[0] + uuv.m[0];
	uv.m[1] = v.m[1] + uv.m[1] + uuv.m[1];
	uv.m[2] = v.m[2] + uv.m[2] + uuv.m[2];

	return uv;
}

inline void SoAQuat::Cmov4(SoAQuat& outQuan, const SoAQuat& arg1, const SoAQuat& arg2, SoAMaskF mask)
{
	outQuan.w = SoAMath::Cmov4(arg1.w, arg2.w, mask);
	outQuan.x = SoAMath::Cmov4(arg1.x, arg2.x, mask);
	outQuan.y = SoAMath::Cmov4(arg1.y, arg2.y, mask);
	outQuan.z = SoAMath::Cmov4(arg1.z, arg2.z, mask);
}