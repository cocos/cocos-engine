template <typename T> inline 
QuatT<T>::QuatT()
#if defined(_WIN32) && defined(_DEBUG)
: w(Math::MIN<T>())
, x(Math::MIN<T>())
, y(Math::MIN<T>())
, z(Math::MIN<T>())
#endif
{
}

template <typename T> inline 
QuatT<T>::QuatT(const T* pf)
{
	//CC_ASSERTS(pf != NULL, "The array data is NULL.");

	w = pf[0];
	x = pf[1];
	y = pf[2];
	z = pf[3];
}

template <typename T> inline 
QuatT<T>::QuatT(T fw, T fx, T fy, T fz): 
w(fw), 
x(fx), 
y(fy), 
z(fz)
{
}

template <typename T> inline 
QuatT<T>::QuatT(const Vec3T<T>& vAixs, T radian)
{
	fromRotateAxis(vAixs, radian);
}

template <typename T> inline 
T& QuatT<T>::operator [] (int index)
{
	//CC_ASSERTS(index >= 0 && index < 4, "Access out of bounds");
	return m[index];
}

template <typename T> inline 
const T& QuatT<T>::operator [] (int index) const
{
	//CC_ASSERTS(index >= 0 && index < 4, "Access out of bounds");
	return m[index];
}

template <typename T> inline 
QuatT<T>::operator T* ()
{
	return m;
}

template <typename T> inline 
QuatT<T>::operator const T* () const
{
	return m;
}

template <typename T> inline 
QuatT<T>& QuatT<T>::operator += (const QuatT& q)
{
	w += q.w;
	x += q.x;
	y += q.y;
	z += q.z;

	return *this;
}

template <typename T> inline 
QuatT<T>& QuatT<T>::operator -= (const QuatT& q)
{
	w -= q.w;
	x -= q.x;
	y -= q.y;
	z -= q.z;

	return *this;
}

template <typename T> inline 
QuatT<T>& QuatT<T>::operator *= (const QuatT& q)
{
	w = w * q.w - x * q.x - y * q.y - z * q.z;
	x = w * q.x + x * q.w + y * q.z - z * q.y;
	y = w * q.y + y * q.w + z * q.x - x * q.z;
	z = w * q.z + z * q.w + x * q.y - y * q.x;
	
	return *this;
}

template <typename T> inline 
QuatT<T>& QuatT<T>::operator *= (T f)
{
	w *= f;
	x *= f;
	y *= f;
	z *= f;

	return *this;
}

template <typename T> inline 
QuatT<T>& QuatT<T>::operator /= (T f)
{
	T fInv = 1.0f / f;
	w *= fInv;
	x *= fInv;
	y *= fInv;
	z *= fInv;

	return *this;
}

template <typename T> inline 
T* QuatT<T>::ptr()
{
	return &w;
}

template <typename T> inline 
const T* QuatT<T>::ptr() const
{
	return &w;
}

template <typename T> inline 
void QuatT<T>::zero()
{
	w = 0;
	x = 0;
	y = 0;
	z = 0;
}

template <typename T> inline 
void QuatT<T>::set(T _w, T _x, T _y, T _z)
{
	this->w = _w;
	this->x = _x;
	this->y = _y;
	this->z = _z;
}

template <typename T> inline 
void QuatT<T>::set(T value)
{
	this->w = value;
	this->x = value;
	this->y = value;
	this->z = value;
}

template <typename T> inline 
void QuatT<T>::set(T *p)
{
	this->w = p[0];
	this->x = p[1];
	this->y = p[2];
	this->z = p[3];
}

template <typename T> inline 
T QuatT<T>::dot(const QuatT &rhs) const
{
	return (w * rhs.w + x * rhs.x + y * rhs.y + z * rhs.z);
}

template <typename T> inline 
QuatT<T> QuatT<T>::cross(const QuatT& rhs) const
{
	QuatT quatT;
	quatT.w = w * rhs.w - x * rhs.x - y * rhs.y - z *rhs.z;
	quatT.x = w * rhs.x + x * rhs.w + y * rhs.z - z *rhs.y;
	quatT.y = w * rhs.y + y * rhs.w + z * rhs.x - x *rhs.z;
	quatT.z = w * rhs.z + z * rhs.w + x * rhs.y - y *rhs.x;

	return quatT;
}

template <typename T> inline 
void QuatT<T>::conjugate()
{
	x = -x;
	y = -y;
	z = -z;
}

template <typename T> inline 
void QuatT<T>::inverse()
{
	conjugate();
	const T norm = lenSqr();

	//CC_ASSERT(norm);

	T invNorm = 1.0f / norm;
	x *= invNorm;
	y *= invNorm;
	z *= invNorm;
	w *= invNorm;
}

template <typename T> inline 
T QuatT<T>::len() const
{
	return Math::Sqrt(w * w + x * x + y * y + z * z);
}

template <typename T> inline 
T QuatT<T>::lenSqr() const
{
	return w * w + x * x + y * y + z * z;
}

template <typename T> inline 
void QuatT<T>::identity()
{
	w = 1;
	x = 0;
	y = 0;
	z = 0;
}

// Qlog(q) = v*a where q = [cos(a),v*sin(a)]
template <typename T> inline 
void QuatT<T>::log()
{
	T a = Math::ACos(w);
	T sina = Math::Sin(a);

	w = 0;

	if (sina > 0)
	{
		x = a * x / sina;
		y = a * y / sina;
		z = a * z / sina;
	}
	else
		x = y = z = 0;
}

// Exp(v*a) = [cos(a),vsin(a)]
template <typename T> inline 
void QuatT<T>::exp()
{
	T a = len();
	T sina = Math::Sin(a);
	T cosa = Math::Cos(a);
	
	w = cosa;
	
	if(a > 0)
	{
		x = sina * x / a;
		y = sina * y / a;
		z = sina * z / a;
	}
	else
		x = y = z = 0;
}

// pow(q, t) = exp(t * log(q))
template <typename T> inline 
void QuatT<T>::pow(T fExp)
{
	if(Math::Abs(w) >= 1)
		return;

	// alpha = theta / 2
	T alpha = Math::ACos(w);
	T newAlpha = alpha * fExp;

	w = Math::Cos(newAlpha);

	// calculate xyz
	T mult = Math::Sin(newAlpha) / Math::Sin(alpha);
	x = x * mult;
	y = y * mult;
	z = z * mult;
}

template <typename T> inline 
void QuatT<T>::normalize()
{
	T length = len();
	x /= length;
	y /= length;
	z /= length;
}

template <typename T> inline 
Mat4T<T> QuatT<T>::toMat4() const
{
	Mat4T<T> mat;
	T xs = x * (T)2.0f;
	T ys = y * (T)2.0f;
	T zs = z * (T)2.0f;
	T wx = w * xs;
	T wy = w * ys;
	T wz = w * zs;
	T xx = x * xs;
	T xy = x * ys;
	T xz = x * zs;
	T yy = y * ys;
	T yz = y * zs;
	T zz = z * zs;

	mat.m00 = (T)1.0f - (yy + zz); mat.m01 = xy - wz;             mat.m02 = xz + wy;             mat.m03 = 0;
	mat.m10 = xy + wz;             mat.m11 = (T)1.0f - (xx + zz); mat.m12 = yz - wx;             mat.m13 = 0;
	mat.m20 = xz - wy;             mat.m21 = yz + wx;             mat.m22 = (T)1.0f - (xx + yy); mat.m23 = 0;
	mat.m30 = 0;                   mat.m31 = 0;                    mat.m32 = 0;                   mat.m33 = 1;
	return mat;
}

template <typename T> inline 
void QuatT<T>::fromMat4(const Mat4T<T>& mat)
{
#if 0
	T fTrace = mat.m00 + mat.m11 + mat.m22;
	T fRoot;

	if (fTrace > 0)
	{
		// |w| > 1/2, may as well choose w > 1/2
		fRoot = Math::Sqrt(fTrace + (T)1.0f);  // 2w
		w = (T)0.5f * fRoot;
		fRoot = (T)0.5f / fRoot;  // 1/(4w)
		x = (mat.m21 - mat.m12) * fRoot;
		y = (mat.m02 - mat.m20) * fRoot;
		z = (mat.m10 - mat.m01) * fRoot;
	}
	else
	{
		// |w| <= 1/2
		static int nNext[3] = {1, 2, 0};
		int i = 0;
		if (mat.m11 > mat.m00)
			i = 1;
		if (mat.m22 > mat(i, i))
			i = 2;
		int j = nNext[i];
		int k = nNext[j];

		fRoot = Math::Sqrt(mat(i, i) - mat(j, j) - mat(k, k) + (T)1.0f);
		T *nQuan[3] = { &x, &y, &z };
		*nQuan[i] = (T)0.5f * fRoot;
		fRoot = (T)0.5f / fRoot;
		w = (mat[k][j] - mat[j][k]) * fRoot;
		*nQuan[j] = (mat(i, j) + mat(j, i)) * fRoot;
		*nQuan[k] = (mat(i, k) + mat(k, i)) * fRoot;
	}
	normalize();
#endif

	T fourXSquaredMinus1 = mat.m00 - mat.m11 - mat.m22;
	T fourYSquaredMinus1 = mat.m11 - mat.m00 - mat.m22;
	T fourZSquaredMinus1 = mat.m22 - mat.m00 - mat.m11;
	T fourWSquaredMinus1 = mat.m00 + mat.m11 + mat.m22;

	int biggestIndex = 0;
	T fourBiggestSquaredMinus1 = fourWSquaredMinus1;
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

	T biggestVal = Math::Sqrt(fourBiggestSquaredMinus1 + T(1)) * T(0.5);
	T mult = static_cast<T>(0.25) / biggestVal;

	switch (biggestIndex)
	{
	case 0:
		w = biggestVal;
		x = (mat.m21 - mat.m12) * mult;
		y = (mat.m02 - mat.m20) * mult;
		z = (mat.m10 - mat.m01) * mult;
		break;
	case 1:
		w = (mat.m21 - mat.m12) * mult;
		x = biggestVal;
		y = (mat.m10 + mat.m01) * mult;
		z = (mat.m02 + mat.m20) * mult;
		break;
	case 2:
		w = (mat.m02 - mat.m20) * mult;
		x = (mat.m10 + mat.m01) * mult;
		y = biggestVal;
		z = (mat.m12 + mat.m21) * mult;
		break;
	case 3:
		w = (mat.m10 - mat.m01) * mult;
		x = (mat.m02 + mat.m20) * mult;
		y = (mat.m21 + mat.m12) * mult;
		z = biggestVal;
		break;
	default: ;
	}
}

template <typename T> inline 
void QuatT<T>::fromAxes(const Vec3T<T>& xAxis, const Vec3T<T>& yAxis, const Vec3T<T>& zAxis)
{
	Mat4T<T> mat;
	mat.identity();

	mat.m00 = xAxis.x;
	mat.m01 = xAxis.y;
	mat.m02 = xAxis.z;

	mat.m10 = yAxis.x;
	mat.m11 = yAxis.y;
	mat.m12 = yAxis.z;

	mat.m20 = zAxis.x;
	mat.m21 = zAxis.y;
	mat.m22 = zAxis.z;

	fromMat4(mat);
}

template <typename T> inline
void QuatT<T>::toAxes(Vec3T<T>& xAxis, Vec3T<T>& yAxis, Vec3T<T>& zAxis) const
{
	Mat4 matRot = toMat4();

	xAxis.x = matRot.m00; xAxis.y = matRot.m01; xAxis.z = matRot.m02;
	yAxis.x = matRot.m10; yAxis.y = matRot.m11; yAxis.z = matRot.m12;
	zAxis.x = matRot.m20; zAxis.y = matRot.m21; zAxis.z = matRot.m22;
}

template <typename T> inline 
void QuatT<T>::fromEulerAngle(T pitch, T yaw, T roll)
{
	T fCosHRoll = Math::Cos(roll * Math::DEG2RAD * 0.5f);
	T fSinHRoll = Math::Sin(roll * Math::DEG2RAD * 0.5f);
	T fCosHPitch = Math::Cos(pitch * Math::DEG2RAD * 0.5f);
	T fSinHPitch = Math::Sin(pitch * Math::DEG2RAD * 0.5f);
	T fCosHYaw = Math::Cos(yaw * Math::DEG2RAD * 0.5f);
	T fSinHYaw = Math::Sin(yaw * Math::DEG2RAD * 0.5f);

	//w = fCosHRoll * fCosHPitch * fCosHYaw + fSinHRoll * fSinHPitch * fSinHYaw;
	//x = fSinHRoll * fCosHPitch * fCosHYaw - fCosHRoll * fSinHPitch * fSinHYaw;
	//y = fCosHRoll * fSinHPitch * fCosHYaw + fSinHRoll * fCosHPitch * fSinHYaw;
	//z = fCosHRoll * fCosHPitch * fSinHYaw - fSinHRoll * fSinHPitch * fCosHYaw;

	w = fCosHRoll * fCosHPitch * fCosHYaw + fSinHRoll * fSinHPitch * fSinHYaw;
	x = fCosHRoll * fSinHPitch * fCosHYaw + fSinHRoll * fCosHPitch * fSinHYaw;
	y = fCosHRoll * fCosHPitch * fSinHYaw - fSinHRoll * fSinHPitch * fCosHYaw;
	z = fSinHRoll * fCosHPitch * fCosHYaw - fCosHRoll * fSinHPitch * fSinHYaw;
}

template <typename T> inline
T QuatT<T>::getYaw() const
{
	T fTx = 2.0f*x;
	T fTy = 2.0f*y;
	T fTz = 2.0f*z;
	T fTwy = fTy*w;
	T fTxx = fTx*x;
	T fTxz = fTz*x;
	T fTyy = fTy*y;
	return Math::ATan2(fTxz + fTwy, 1.0f - (fTxx + fTyy));
}

template <typename T> inline
T QuatT<T>::getPitch() const
{
	T fTx = 2.0f*x;
	T fTz = 2.0f*z;
	T fTwx = fTx*w;
	T fTxx = fTx*x;
	T fTyz = fTz*y;
	T fTzz = fTz*z;
	return Math::ATan2(fTyz + fTwx, 1.0f - (fTxx + fTzz));
}

template <typename T> inline
T QuatT<T>::getRoll() const
{
	T fTy = 2.0f*y;
	T fTz = 2.0f*z;
	T fTwz = fTz*w;
	T fTxy = fTy*x;
	T fTyy = fTy*y;
	T fTzz = fTz*z;
	return Math::ATan2(fTxy + fTwz, 1.0f - (fTyy + fTzz));
}

template <typename T> inline 
void QuatT<T>::toEulerAngle(T& pitch, T& yaw, T& roll) const
{
	T sqx = x * x;
	T sqy = y * y;
	T sqz = z * z;
	T sqw = w * w;
	T unit = sqx + sqy + sqz + sqw;
	T test = x * w - y * z;

	if (test > ((T)0.5f - (T)Math::EPSILONQUAT * unit))
	{
		//singularity at north pole
		pitch = (T)Math::PI_DIV2;
		yaw = (T)0.f;
		roll = -(T)2.f * Math::ATan2(y, w);
	}
	else if (test < (-(T)0.5f + (T)Math::EPSILONQUAT * unit))
	{
		//singularity at south pole
		pitch = -(T)Math::PI_DIV2;
		yaw = (T)0.f;
		roll = (T)2.f * Math::ATan2(y, w);
	}
	else
	{
		roll = Math::ATan2((T)2.0f * (w * z + x * y), (T)1.0f - (T)2.0f * (z * z + x * x));
		pitch = Math::ASin((T)2.0f * (w * x - y * z));
		yaw = Math::ATan2((T)2.0f * (w * y + z * x), (T)1.0f - (T)2.0f * (x * x + y * y));
	}

	pitch *= Math::RAD2DEG;
	yaw *= Math::RAD2DEG;
	roll *= Math::RAD2DEG;
}

template <typename T> inline
void QuatT<T>::toEulerRadian(T& pitch, T& yaw, T& roll) const
{
	T sqx = x * x;
	T sqy = y * y;
	T sqz = z * z;
	T sqw = w * w;
	T unit = sqx + sqy + sqz + sqw;
	T test = x * w - y * z;

	if (test > ((T)0.5f - (T)Math::EPSILONQUAT * unit))
	{
		//singularity at north pole
		pitch = (T)Math::PI_DIV2;
		yaw = (T)0.f;
		roll = -(T)2.f * Math::ATan2(y, w);
	}
	else if (test < (-(T)0.5f + (T)Math::EPSILONQUAT * unit))
	{
		//singularity at south pole
		pitch = -(T)Math::PI_DIV2;
		yaw = (T)0.f;
		roll = (T)2.f * Math::ATan2(y, w);
	}
	else
	{
		roll = Math::ATan2((T)2.0f * (w * z + x * y), (T)1.0f - (T)2.0f * (z * z + x * x));
		pitch = Math::ASin((T)2.0f * (w * x - y * z));
		yaw = Math::ATan2((T)2.0f * (w * y + z * x), (T)1.0f - (T)2.0f * (x * x + y * y));
	}
}

template <typename T> inline 
void QuatT<T>::fromVec3ToVec3(const Vec3T<T>& from, const Vec3T<T>& to)
{
	/*
	Vec3T<T> s = from;
	s.normalize();
	Vec3T<T> t = to;
	t.normalize();

	Vec3T<T> sxt = s.cross(t); // SxT
	T sxtLen = sxt.len(); // == cos(angle)
	T dot = s.dot(t);
	if (sxtLen == 0)
	{
		// parallel case.

		// 04/7/6 added. fix bug.
		if (dot > (T)0)
		{
			identity();
		}
		else
		{
			// inverse.
			Vec3T<T> vt;
			from.perpendicular(vt);

			rotateAxis(vt, Math::PI);
		}

		return;
	}

	Vec3T<T> u = sxt / sxtLen;

	T angle2 = Math::ACos(dot)/(T)2.0f;

	T sina = Math::Sin(angle2);
	T cosa = Math::Cos(angle2);

	x = u.x * sina;
	y = u.y * sina;
	z = u.z * sina;
	w = cosa;
	*/

	// Based on Stan Melax's article in Game Programming Gems

	// Copy, since cannot modify local
	Vec3T<T> v0 = from;
	Vec3T<T> v1 = to;
	v0.normalize();
	v1.normalize();

	float d = v0.dot(v1);
	// If dot == 1, vectors are the same
	if (d >= 1.0f)
	{
		identity();
	}
	else if(d < (1e-6f - 1.0f))
	{
		Vec3 vAxis = VEC3_UNIT_X.cross(from);
		if (vAxis.isZeroLength()) // pick another if collinear
		{
			vAxis = VEC3_UNIT_Y.cross(from);
		}
		vAxis.normalize();
		fromRotateAxis(vAxis, Math::PI);
	}
	else
	{
		float s = Math::Sqrt(((T)1 + d) * (T)2);
		float invs = (T)1 / s;

		Vec3T<T> c = v0.cross(v1);
		this->x = c.x * invs;
		this->y = c.y * invs;
		this->z = c.z * invs;
		this->w = s * (T)0.5f;
		normalize();
	}
}

template <typename T> inline 
void QuatT<T>::fromRotateAxis(const Vec3T<T>& axis, T radian)
{
	// assert:  axis is unit length
	// The quaternion representing the rotation is
	// q = cos(A / 2) + sin(A / 2 ) * (x * i + y * j + z * k)

	T alpha = (T)0.5f * radian;
	T sina = Math::Sin(alpha);
	w = Math::Cos(alpha);
	x = sina * axis.x;
	y = sina * axis.y;
	z = sina * axis.z;
	normalize();
}

template <typename T> inline 
Vec3T<T> QuatT<T>::rotateVec3(const Vec3T<T>& vec) const
{
	// nVidia SDK implementation
	Vec3T<T> qvec(x, y, z);
	Vec3T<T> uv = qvec.cross(vec);
	Vec3T<T> uuv = qvec.cross(uv);
	uv *= (T)2.0f * w;
	uuv *= (T)2.0f;

	return vec + uv + uuv;
}

template <typename T> inline 
void QuatT<T>::diff(const QuatT& q1, const QuatT& q2)
{
	QuatT invQ1 = q1;
	invQ1.inverse();
	*this = invQ1 * q2;
}

template <typename T> inline 
void QuatT<T>::abs()
{
	x = Math::Abs(x);
	y = Math::Abs(y);
	z = Math::Abs(z);
	w = Math::Abs(w);
}

template <typename T> inline 
void QuatT<T>::neg()
{
	x = -x;
	y = -y;
	z = -z;
	w = -w;
}

template <typename T> inline
void QuatT<T>::fromAngleAxis(const T& rfAngle,const Vec3T<T>& rkAxis)
{
	// assert:  axis[] is unit length
	//
	// The quaternion representing the rotation is
	//   q = cos(A/2)+sin(A/2)*(x*i+y*j+z*k)

	T fHalfAngle = rfAngle/2;
	T fSin = Math::Sin(fHalfAngle);
	w = Math::Cos(fHalfAngle);
	x = fSin*rkAxis.x;
	y = fSin*rkAxis.y;
	z = fSin*rkAxis.z;
}
template <typename T> inline 
Vec3T<T> QuatT<T>::toAxisAngle(T& radian) const
{
	// The quaternion representing the rotation is
	//   q = cos(A/2)+sin(A/2)*(x*i+y*j+z*k)
	Vec3T<T> vAxis;
	T fSqrLength = x*x + y*y + z*z;
	if (fSqrLength > 0.0)
	{
		radian = (T)2.0f*Math::ACos(w);
		T fInvLength = Math::InvSqrt(fSqrLength);
		vAxis.x = x*fInvLength;
		vAxis.y = y*fInvLength;
		vAxis.z = z*fInvLength;
	}
	else
	{
		// angle is 0 (mod 2*pi), so any axis will do
		radian = (T)0.0f;
		vAxis.x = (T)1.0f;
		vAxis.y = (T)0.0f;
		vAxis.z = (T)0.0f;
	}
	return vAxis;
}

template <typename T> inline 
Vec3T<T> QuatT<T>::toAxisX() const
{
	Vec3T<T> vAxis;
	//Real fTx  = 2.0*x;
	T fTy = (T)2.0f*y;
	T fTz = (T)2.0f*z;
	T fTwy = fTy*w;
	T fTwz = fTz*w;
	T fTxy = fTy*x;
	T fTxz = fTz*x;
	T fTyy = fTy*y;
	T fTzz = fTz*z;

	vAxis.set(1.0f-(fTyy+fTzz), fTxy+fTwz, fTxz-fTwy);
	return vAxis;
}

template <typename T> inline 
Vec3T<T> QuatT<T>::toAxisY() const
{
	Vec3T<T> vAxis;
	T fTx = (T)2.0f*x;
	T fTy = (T)2.0f*y;
	T fTz = (T)2.0f*z;
	T fTwx = fTx*w;
	T fTwz = fTz*w;
	T fTxx = fTx*x;
	T fTxy = fTy*x;
	T fTyz = fTz*y;
	T fTzz = fTz*z;

	vAxis.set(fTxy-fTwz, 1.0f-(fTxx+fTzz), fTyz+fTwx);
	return vAxis;
}

template <typename T> inline 
Vec3T<T> QuatT<T>::toAxisZ() const
{
	Vec3T<T> vAxis;
	T fTx = (T)2.0f*x;
	T fTy = (T)2.0f*y;
	T fTz = (T)2.0f*z;
	T fTwx = fTx*w;
	T fTwy = fTy*w;
	T fTxx = fTx*x;
	T fTxz = fTz*x;
	T fTyy = fTy*y;
	T fTyz = fTz*y;

	vAxis.set(fTxz+fTwy, fTyz-fTwx, 1.0f-(fTxx+fTyy));
	return vAxis;
}

template <typename T> inline 
QuatT<T> QuatT<T>::Log(const QuatT& quat)
{
	QuatT<T> outQuat = quat;
	outQuat.log();
	return outQuat;
}

template <typename T> inline 
QuatT<T> QuatT<T>::Exp(const QuatT& quat)
{
	QuatT<T> outQuat = quat;
	outQuat.exp();
	return outQuat;
}

template <typename T> inline 
QuatT<T> QuatT<T>::Pow(const QuatT& quat, T fExp)
{
	QuatT<T> outQuat = quat;
	outQuat.pow(fExp);
	return outQuat;
}

template <typename T> inline 
QuatT<T> QuatT<T>::Lerp(const QuatT& q1, const QuatT& q2, T t, bool bShortestPath)
{
	QuatT<T> outQuat;
	T fCos = q1.dot(q2);
	if (fCos < 0.0 && bShortestPath)
	{
		outQuat = q1 + t * ((-q2) - q1);
	}
	else
	{
		outQuat = q1 + t * (q2 - q1);
	}
	
	outQuat.normalize();
	return outQuat;
}

template <typename T> inline 
QuatT<T> QuatT<T>::Slerp(const QuatT& q1, const QuatT& q2, T t, bool bShortestPath)
{
	QuatT<T> outQuat;
	T fCos = q1.dot(q2);
	QuatT q;

	// do we need to invert rotation?
	if (fCos < 0.0f && bShortestPath)
	{
		fCos = -fCos;
		q = -q2;
	}
	else
	{
		q = q2;
	}

	if (Math::Abs(fCos) < (T)(1.0 - (1e-03)))
	{
		// Standard case (slerp)
		T fSin = Math::Sqrt(1 - Math::Sqr(fCos));
		T radian = Math::ATan2(fSin, fCos);
		T fInvSin = (T)1.0f / fSin;
		T fCoeff0 = Math::Sin(((T)1.0f - t) * radian) * fInvSin;
		T fCoeff1 = Math::Sin(t * radian) * fInvSin;
		outQuat = fCoeff0 * q1 + fCoeff1 * q;
	}
	else
	{
		// There are two situations:
		// 1. "q1" and "q2" are very close (fCos ~= +1), so we can do a linear
		//    interpolation safely.
		// 2. "q1" and "q2" are almost inverse of each other (fCos ~= -1), there
		//    are an infinite number of possibilities interpolation. but we haven't
		//    have method to fix this case, so just use linear interpolation here.
		outQuat = ((T)1.0f - t) * q1 + t * q;
		// taking the complement requires renormalisation
		outQuat.normalize();
	}
	return outQuat;
}

template <typename T> inline 
QuatT<T> QuatT<T>::Squad(const QuatT& q1, const QuatT& q2, const QuatT& a, const QuatT& b, T t, bool bShortestPath)
{
	T slerpT = (T)2.0f * t * ((T)1.0f - t);
	return Slerp(Slerp(q1, q2, t, bShortestPath), Slerp(a, b, t), slerpT);
}

template <typename T> inline 
QuatT<T> QuatT<T>::Spline(const QuatT& q1, const QuatT& q2, const QuatT& q3)
{
	QuatT q;

	q.w = q2.w;
	q.x = -q2.x;
	q.y = -q2.y;
	q.z = -q2.z;

	return q2 * Exp((Log(q * q1) + Log(q * q3)) / -4);
}

template <typename T> inline 
QuatT<T> operator + (const QuatT<T>& rhs)
{
	return rhs;
}

template <typename T> inline 
QuatT<T> operator - (const QuatT<T>& rhs)
{
	return QuatT<T>(-rhs.w, -rhs.x, -rhs.y, -rhs.z);
}

template <typename T> inline 
bool operator == (const QuatT<T>& a, const QuatT<T>& b)
{
	return (Math::IsEqual(a.w, b.w) && Math::IsEqual(a.x, b.x) && Math::IsEqual(a.y, b.y) && Math::IsEqual(a.z, b.z));
}

template <typename T> inline 
bool operator != (const QuatT<T>& a, const QuatT<T>& b)
{
	return (Math::IsNotEqual(a.w, b.w) || Math::IsNotEqual(a.x, b.x) || Math::IsNotEqual(a.y, b.y) || Math::IsNotEqual(a.z, b.z));
}

template <typename T> inline 
QuatT<T> operator + (const QuatT<T>& a, const QuatT<T>& b)
{
	return QuatT<T>((a.w + b.w),
		(a.x + b.x),
		(a.y + b.y),
		(a.z + b.z));
}

template <typename T> inline 
QuatT<T> operator - (const QuatT<T>& a, const QuatT<T>& b)
{
	return QuatT<T>((a.w - b.w),
		(a.x - b.x),
		(a.y - b.y),
		(a.z - b.z));
}

template <typename T> inline 
QuatT<T> operator * (const T f, const QuatT<T>& q)
{
	return QuatT<T>((f * q.w),
		(f * q.x),
		(f * q.y),
		(f * q.z));
}

template <typename T> inline 
QuatT<T> operator * (const QuatT<T>& q, const T f)
{
	return QuatT<T>((f * q.w),
		(f * q.x),
		(f * q.y),
		(f * q.z));
}

template <typename T> inline 
QuatT<T> operator * (const QuatT<T>& a, const QuatT<T>& b)
{
	/*
	//standard define
	QuatT<T> result;
	result.w = a.w * b.w - a.x * b.x - a.y * b.y - a.z *b.z;
	result.x = a.w * b.x + a.x * b.w + a.z * b.y - a.y *b.z;
	result.y = a.w * b.y + a.y * b.w + a.x * b.z - a.z *b.x;
	result.z = a.w * b.z + a.z * b.w + a.y * b.x - a.x *b.y;
	*/
	
	return QuatT<T>((a.w * b.w - a.x * b.x - a.y * b.y - a.z *b.z),
		(a.w * b.x + a.x * b.w + a.y * b.z - a.z *b.y),
		(a.w * b.y + a.y * b.w + a.z * b.x - a.x *b.z),
		(a.w * b.z + a.z * b.w + a.x * b.y - a.y *b.x));
}

template <typename T> inline 
Vec3T<T> operator * (const QuatT<T>& q, const Vec3T<T> &v)
{
	/*
	// p*q'
	float tw = q.x * v.x + q.y * v.y + q.z * v.z;
	float tx = q.w * v.x + q.y * v.z - q.z * v.y;
	float ty = q.w * v.y - q.x * v.z + q.z * v.x;
	float tz = q.w * v.z + q.x * v.y - q.y * v.x;

	Vec3T<T> ret;
	ret.x = tw * q.x + tx * q.w - ty * q.z + tz * q.y;
	ret.y = tw * q.y + tx * q.z + ty * q.w - tz * q.x;
	ret.z = tw * q.z - tx * q.y + ty * q.x + tz * q.w;

	return ret
	*/

	// nVidia SDK implementation
	Vec3T<T> qvec(q.x, q.y, q.z);
	Vec3T<T> uv = qvec.cross(v);
	Vec3T<T> uuv = qvec.cross(uv);
	uv *= (T)2.0f * q.w;
	uuv *= (T)2.0f;

	return (v + uv + uuv);
}

template <typename T> inline 
Vec4T<T> operator * (const QuatT<T>& q, const Vec4T<T> &v)
{
	// nVidia SDK implementation
	Vec3T<T> vec(v);
	Vec3T<T> qvec(q.x, q.y, q.z);
	Vec3T<T> uv = qvec.cross(vec);
	Vec3T<T> uuv = qvec.cross(uv);
	uv *= (T)2.0f * q.w;
	uuv *= (T)2.0f;

	return Vec4(vec + uv + uuv, 1);
}

template <typename T> inline 
QuatT<T> operator / (const QuatT<T>& a, const T f)
{
	T fInv = 1.0f / f;

	return QuatT<T>((a.w * fInv),
		(a.x * fInv),
		(a.y * fInv),
		(a.z * fInv));
}

template <typename T> inline 
QuatT<T> operator / (const T f, const QuatT<T>& a)
{
	return QuatT<T>((f / a.w),
		(f / a.x),
		(f / a.y),
		(f / a.z));
}
