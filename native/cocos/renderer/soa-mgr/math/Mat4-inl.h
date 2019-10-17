template <typename T> inline 
Mat4T<T>::Mat4T()
#if defined(_WIN32) && defined(_DEBUG)
: m00(Math::MIN<T>())
, m10(Math::MIN<T>())
, m20(Math::MIN<T>())
, m30(Math::MIN<T>())
, m01(Math::MIN<T>())
, m11(Math::MIN<T>())
, m21(Math::MIN<T>())
, m31(Math::MIN<T>())
, m02(Math::MIN<T>())
, m12(Math::MIN<T>())
, m22(Math::MIN<T>())
, m32(Math::MIN<T>())
, m03(Math::MIN<T>())
, m13(Math::MIN<T>())
, m23(Math::MIN<T>())
, m33(Math::MIN<T>())
#endif
{
}

template <typename T> inline 
Mat4T<T>::Mat4T(T f00, T f01, T f02, T f03,
				T f10, T f11, T f12, T f13,
				T f20, T f21, T f22, T f23,
				T f30, T f31, T f32, T f33)
: m00(f00)
, m10(f10)
, m20(f20)
, m30(f30)
, m01(f01)
, m11(f11)
, m21(f21)
, m31(f31)
, m02(f02)
, m12(f12)
, m22(f22)
, m32(f32)
, m03(f03)
, m13(f13)
, m23(f23)
, m33(f33)
{
}

template <typename T> inline 
Mat4T<T>::Mat4T(T *arr)
{
	memcpy(m, arr, sizeof(T)*16);
}

template <typename T> inline
Mat4T<T>::Mat4T(const Vec3T<T>& t, const QuatT<T>& r, const Vec3T<T>& s)
{
	recompose(t, r, s);
}

template <typename T> inline 
T Mat4T<T>::operator () (int i, int j) const
{
	//CC_ASSERTS(i>=0 && i<4, "Access out of bounds");
	//CC_ASSERTS(j>=0 && j<4, "Access out of bounds");
	
	Vec4T<T> vec;
	getRow(vec, i);
	return vec[j];
}

/*
template <typename T> inline 
Vec4T<T> Mat4T<T>::operator [] (int col) const
{
	Vec4T<T> vec;
	getColumn(vec, col);
	return vec;
}
*/

template <typename T> inline 
Mat4T<T>& Mat4T<T>::operator += (const T f)
{
	m00 += f; m01 += f; m02 += f; m03 += f;
	m10 += f; m11 += f; m12 += f; m13 += f;
	m20 += f; m21 += f; m22 += f; m23 += f;
	m30 += f; m31 += f; m32 += f; m33 += f;

	return *this;
}

template <typename T> inline 
Mat4T<T>& Mat4T<T>::operator += (const Mat4T &rhs)
{
	m00 += rhs.m00; m01 += rhs.m01; m02 += rhs.m02; m03 += rhs.m03;
	m10 += rhs.m10; m11 += rhs.m11; m12 += rhs.m12; m13 += rhs.m13;
	m20 += rhs.m20; m21 += rhs.m21; m22 += rhs.m22; m23 += rhs.m23;
	m30 += rhs.m30; m31 += rhs.m31; m32 += rhs.m32; m33 += rhs.m33;

	return *this;
}

template <typename T> inline 
Mat4T<T>& Mat4T<T>::operator -= (const T f)
{
	m00 -= f; m01 -= f; m02 -= f; m03 -= f;
	m10 -= f; m11 -= f; m12 -= f; m13 -= f;
	m20 -= f; m21 -= f; m22 -= f; m23 -= f;
	m30 -= f; m31 -= f; m32 -= f; m33 -= f;

	return *this;
}

template <typename T> inline 
Mat4T<T>& Mat4T<T>::operator -= (const Mat4T &rhs)
{
	m00 -= rhs.m00; m01 -= rhs.m01; m02 -= rhs.m02; m03 -= rhs.m03;
	m10 -= rhs.m10; m11 -= rhs.m11; m12 -= rhs.m12; m13 -= rhs.m13;
	m20 -= rhs.m20; m21 -= rhs.m21; m22 -= rhs.m22; m23 -= rhs.m23;
	m30 -= rhs.m30; m31 -= rhs.m31; m32 -= rhs.m32; m33 -= rhs.m33;

	return *this;
}

template <typename T> inline 
Mat4T<T>& Mat4T<T>::operator *= (const T f)
{
	m00 *= f; m01 *= f; m02 *= f; m03 *= f;
	m10 *= f; m11 *= f; m12 *= f; m13 *= f;
	m20 *= f; m21 *= f; m22 *= f; m23 *= f;
	m30 *= f; m31 *= f; m32 *= f; m33 *= f;

	return *this;
}

template <typename T> inline 
Mat4T<T>& Mat4T<T>::operator *= (const Mat4T &rhs)
{
	T l00 = m00, l01 = m01, l02 = m02, l03 = m03;
	T l10 = m10, l11 = m11, l12 = m12, l13 = m13;
	T l20 = m20, l21 = m21, l22 = m22, l23 = m23;
	T l30 = m30, l31 = m31, l32 = m32, l33 = m33;

	m00 = l00 * rhs.m00 + l01 * rhs.m10 + l02 * rhs.m20 + l03 * rhs.m30;
	m01 = l00 * rhs.m01 + l01 * rhs.m11 + l02 * rhs.m21 + l03 * rhs.m31;
	m02 = l00 * rhs.m02 + l01 * rhs.m12 + l02 * rhs.m22 + l03 * rhs.m32;
	m03 = l00 * rhs.m03 + l01 * rhs.m13 + l02 * rhs.m23 + l03 * rhs.m33;
	
	m10 = l10 * rhs.m00 + l11 * rhs.m10 + l12 * rhs.m20 + l13 * rhs.m30;
	m11 = l10 * rhs.m01 + l11 * rhs.m11 + l12 * rhs.m21 + l13 * rhs.m31;
	m12 = l10 * rhs.m02 + l11 * rhs.m12 + l12 * rhs.m22 + l13 * rhs.m32;
	m13 = l10 * rhs.m03 + l11 * rhs.m13 + l12 * rhs.m23 + l13 * rhs.m33;
	
	m20 = l20 * rhs.m00 + l21 * rhs.m10 + l22 * rhs.m20 + l23 * rhs.m30;
	m21 = l20 * rhs.m01 + l21 * rhs.m11 + l22 * rhs.m21 + l23 * rhs.m31;
	m22 = l20 * rhs.m02 + l21 * rhs.m12 + l22 * rhs.m22 + l23 * rhs.m32;
	m23 = l20 * rhs.m03 + l21 * rhs.m13 + l22 * rhs.m23 + l23 * rhs.m33;
	
	m30 = l30 * rhs.m00 + l31 * rhs.m10 + l32 * rhs.m20 + l33 * rhs.m30;
	m31 = l30 * rhs.m01 + l31 * rhs.m11 + l32 * rhs.m21 + l33 * rhs.m31;
	m32 = l30 * rhs.m02 + l31 * rhs.m12 + l32 * rhs.m22 + l33 * rhs.m32;
	m33 = l30 * rhs.m03 + l31 * rhs.m13 + l32 * rhs.m23 + l33 * rhs.m33;

	return *this;
}

template <typename T> inline 
Mat4T<T>& Mat4T<T>::operator /= (const T f)
{
	m00 /= f; m01 /= f; m02 /= f; m03 /= f;
	m10 /= f; m11 /= f; m12 /= f; m13 /= f;
	m20 /= f; m21 /= f; m22 /= f; m23 /= f;
	m30 /= f; m31 /= f; m32 /= f; m33 /= f;

	return *this;
}

template <typename T> inline 
T* Mat4T<T>::ptr()
{
	return m;
}

template <typename T> inline 
const T* Mat4T<T>::ptr() const
{
	return m;
}

template <typename T> inline 
void Mat4T<T>::zero()
{
	memset(m, 0, sizeof(T)*16);
}

template <typename T> inline 
void Mat4T<T>::append(const Mat4T &lhs, bool mat33)
{
	T l00 = lhs.m00, l01 = lhs.m01, l02 = lhs.m02;
	T l10 = lhs.m10, l11 = lhs.m11, l12 = lhs.m12;
	T l20 = lhs.m20, l21 = lhs.m21, l22 = lhs.m22;
	T r00 = m00, r01 = m01, r02 = m02;
	T r10 = m10, r11 = m11, r12 = m12;
	T r20 = m20, r21 = m21, r22 = m22;

	if (mat33)
	{
		m00 = l00 * r00 + l01 * r10 + l02 * r20;
		m01 = l00 * r01 + l01 * r11 + l02 * r21;
		m02 = l00 * r02 + l01 * r12 + l02 * r22;
		m10 = l10 * r00 + l11 * r10 + l12 * r20;
		m11 = l10 * r01 + l11 * r11 + l12 * r21;
		m12 = l10 * r02 + l11 * r12 + l12 * r22;
		m20 = l20 * r00 + l21 * r10 + l22 * r20;
		m21 = l20 * r01 + l21 * r11 + l22 * r21;
		m22 = l20 * r02 + l21 * r12 + l22 * r22;
	}
	else
	{
		T l03 = lhs.m03, l13 = lhs.m13, l23 = lhs.m23, l33 = lhs.m33, l30 = lhs.m30, l31 = lhs.m31, l32 = lhs.m32;
		T r03 = m03, r13 = m13, r23 = m23, r33 = m33, r30 = m30, r31 = m31, r32 = m32;

		m00 = l00 * r00 + l01 * r10 + l02 * r20 + l03 * r30;
		m01 = l00 * r01 + l01 * r11 + l02 * r21 + l03 * r31;
		m02 = l00 * r02 + l01 * r12 + l02 * r22 + l03 * r32;
		m03 = l00 * r03 + l01 * r13 + l02 * r23 + l03 * r33;

		m10 = l10 * r00 + l11 * r10 + l12 * r20 + l13 * r30;
		m11 = l10 * r01 + l11 * r11 + l12 * r21 + l13 * r31;
		m12 = l10 * r02 + l11 * r12 + l12 * r22 + l13 * r32;
		m13 = l10 * r03 + l11 * r13 + l12 * r23 + l13 * r33;

		m20 = l20 * r00 + l21 * r10 + l22 * r20 + l23 * r30;
		m21 = l20 * r01 + l21 * r11 + l22 * r21 + l23 * r31;
		m22 = l20 * r02 + l21 * r12 + l22 * r22 + l23 * r32;
		m23 = l20 * r03 + l21 * r13 + l22 * r23 + l23 * r33;

		m30 = l30 * r00 + l31 * r10 + l32 * r20 + l33 * r30;
		m31 = l30 * r01 + l31 * r11 + l32 * r21 + l33 * r31;
		m32 = l30 * r02 + l31 * r12 + l32 * r22 + l33 * r32;
		m33 = l30 * r03 + l31 * r13 + l32 * r23 + l33 * r33;
	}
}

template <typename T> inline 
void Mat4T<T>::setRow(int row, const Vec4T<T> &vec)
{
	//CC_ASSERTS(row >= 0 && row < 4, "Access out of bounds");
	T *p = m + row;
	p[0] = vec.x; 
	p[4] = vec.y;
	p[8] = vec.z;
	p[12] = vec.w;
}

template <typename T> inline 
void Mat4T<T>::setColumn(int column, const Vec4T<T> &vec)
{
	//CC_ASSERTS(column >= 0 && column < 4, "Access out of bounds");
	T *p = m + column;
	p[0] = vec.x; 
	p[1] = vec.y; 
	p[2] = vec.z; 
	p[3] = vec.w; 
}

template <typename T> inline 
Vec4T<T> Mat4T<T>::getRowVec4(int row) const
{
	//CC_ASSERTS(row >= 0 && row < 4, "Access out of bounds");
	Vec4T<T> vec;
	const T *p = m + row*4;
	vec.x = p[0];
	vec.y = p[4];
	vec.z = p[8];
	vec.w = p[12];
	return vec;
}

template <typename T> inline 
Vec4T<T> Mat4T<T>::getColumnVec4(int col) const
{
	//CC_ASSERTS(col >= 0 && col < 4, "Access out of bounds");
	Vec4T<T> vec;
	const T *p = m + col;
	vec.x = p[0];
	vec.y = p[1];
	vec.z = p[2];
	vec.w = p[3];
	return vec;
}

template <typename T> inline
void Mat4T<T>::setRow(int row, const Vec3T<T> &vec)
{
	//CC_ASSERTS(row >= 0 && row < 4, "Access out of bounds");
	T *p = m + row;
	p[0] = vec.x;
	p[4] = vec.y;
	p[8] = vec.z;
}

template <typename T> inline
void Mat4T<T>::setColumn(int column, const Vec3T<T> &vec)
{
	//CC_ASSERTS(column >= 0 && column < 4, "Access out of bounds");
	T *p = m + column * 4;
	p[0] = vec.x;
	p[1] = vec.y;
	p[2] = vec.z;
}

template <typename T> inline
Vec3T<T> Mat4T<T>::getRowVec3(int row) const
{
	//CC_ASSERTS(row >= 0 && row < 4, "Access out of bounds");
	Vec3T<T> vec;
	const T *p = m + row * 4;
	vec.x = p[0];
	vec.y = p[4];
	vec.z = p[8];
	return vec;
}

template <typename T> inline
Vec3T<T> Mat4T<T>::getColumnVec3(int col) const
{
	//CC_ASSERTS(col >= 0 && col < 4, "Access out of bounds");
	Vec3T<T> vec;
	const T *p = m + col * 4;
	vec.x = p[0];
	vec.y = p[1];
	vec.z = p[2];
	return vec;
}

template <typename T> inline 
void Mat4T<T>::identity()
{
	m00 = 1; m01 = 0; m02 = 0; m03 = 0;
	m10 = 0; m11 = 1; m12 = 0; m13 = 0;
	m20 = 0; m21 = 0; m22 = 1; m23 = 0;
	m30 = 0; m31 = 0; m32 = 0; m33 = 1;
}

template <typename T> inline 
void Mat4T<T>::translate(T x, T y, T z)
{
	m03 += x;
	m13 += y;
	m23 += z;
}

template <typename T> inline 
void Mat4T<T>::translate(const Vec3T<T> &vec)
{
	m03 += vec.x;
	m13 += vec.y;
	m23 += vec.z;
}

template <typename T> inline 
void Mat4T<T>::makeTranslation(T x, T y, T z)
{
	m00 = 1; m01 = 0; m02 = 0; m03 = x;
	m10 = 0; m11 = 1; m12 = 0; m13 = y;
	m20 = 0; m21 = 0; m22 = 1; m23 = z;
	m30 = 0; m31 = 0; m32 = 0; m33 = 1;
}

template <typename T> inline 
void Mat4T<T>::makeTranslation(const Vec3T<T> &vec)
{
	m00 = 1; m01 = 0; m02 = 0; m03 = vec.x;
	m10 = 0; m11 = 1; m12 = 0; m13 = vec.y;
	m20 = 0; m21 = 0; m22 = 1; m23 = vec.z;
	m30 = 0; m31 = 0; m32 = 0; m33 = 1;
}

template <typename T> inline
void Mat4T<T>::setTranslation(T x, T y, T z)
{
	m03 = x;
	m13 = y;
	m23 = z;
}

template <typename T> inline
void Mat4T<T>::setTranslation(const Vec3T<T> &vec)
{
	m03 = vec.x;
	m13 = vec.y;
	m23 = vec.z;
}

template <typename T> inline 
void Mat4T<T>::translateX(T d)
{
	m03 += d;
}

template <typename T> inline 
void Mat4T<T>::translateY(T d)
{
	m13 += d;
}

template <typename T> inline 
void Mat4T<T>::translateZ(T d)
{
	m23 += d;
}

template <typename T> inline
void Mat4T<T>::setScale(T x, T y, T z)
{
	Vec3T<T> s = decomposeScale();

	s.inverse();
	s.x *= x;
	s.y *= y;
	s.z *= z;

	m00 *= s.x; m01 *= s.y; m02 *= s.z;
	m10 *= s.x; m11 *= s.y; m12 *= s.z;
	m20 *= s.x; m21 *= s.y; m22 *= s.z;
}

template <typename T> inline
void Mat4T<T>::setScale(const Vec3T<T> &vec)
{
	Vec3T<T> s = decomposeScale();

	s.inverse();
	s =s * vec;

	m00 *= s.x; m01 *= s.y; m02 *= s.z;
	m10 *= s.x; m11 *= s.y; m12 *= s.z;
	m20 *= s.x; m21 *= s.y; m22 *= s.z;
}

template <typename T> inline 
void Mat4T<T>::rotate(const Vec3T<T> &v, T radian)
{
	T x = v.x;
	T y = v.y;
	T z = v.z;

	// Make sure the input axis is normalized.
	T n = x*x + y*y + z*z;
	if (Math::IsEqual(n, 1.0f))
	{
		// Not normalized.
		n = sqrt(n);
		// Prevent divide too close to zero.
		if (n > 0.000001f)
		{
			n = 1.0f / n;
			x *= n;
			y *= n;
			z *= n;
		}
	}

	T fSin = Math::Sin(radian);
	T fCos = Math::Cos(radian);

	T t = 1.0f - fCos;
	T tx = t * x;
	T ty = t * y;
	T tz = t * z;
	T txy = tx * y;
	T txz = tx * z;
	T tyz = ty * z;
	T sx = fSin * x;
	T sy = fSin * y;
	T sz = fSin * z;

	Mat4T local;

	local.m00 = fCos + tx*x;
	local.m10 = txy + sz;
	local.m20 = txz - sy;
	local.m30 = 0;

	local.m01 = txy - sz;
	local.m11 = fCos + ty*y;
	local.m21 = tyz + sx;
	local.m31 = 0;

	local.m02 = txz + sy;
	local.m12 = tyz - sx;
	local.m22 = fCos + tz*z;
	local.m32 = 0;

	local.m03 = 0;
	local.m13 = 0;
	local.m23 = 0;
	local.m33 = 1;

	*this = (local * (*this));
}

template <typename T> inline 
void Mat4T<T>::makeRotation(const Vec3T<T> &axis, T radian)
{
	T x = axis.x;
	T y = axis.y;
	T z = axis.z;

	// Make sure the input axis is normalized.
	T n = x*x + y*y + z*z;
	if (Math::IsEqual(n, 1.0f))
	{
		// Not normalized.
		n = sqrt(n);
		// Prevent divide too close to zero.
		if (n > 0.000001f)
		{
			n = 1.0f / n;
			x *= n;
			y *= n;
			z *= n;
		}
	}

	T fSin = Math::Sin(radian);
	T fCos = Math::Cos(radian);

	T t = 1.0f - fCos;
	T tx = t * x;
	T ty = t * y;
	T tz = t * z;
	T txy = tx * y;
	T txz = tx * z;
	T tyz = ty * z;
	T sx = fSin * x;
	T sy = fSin * y;
	T sz = fSin * z;

	m00 = fCos + tx*x;
	m10 = txy + sz;
	m20 = txz - sy;
	m30 = 0;

	m01 = txy - sz;
	m11 = fCos + ty*y;
	m21 = tyz + sx;
	m31 = 0;

	m02 = txz + sy;
	m12 = tyz - sx;
	m22 = fCos + tz*z;
	m32 = 0;

	m03 = 0;
	m13 = 0;
	m23 = 0;
	m33 = 1;
}

// this = Rx * this
template <typename T> inline 
void Mat4T<T>::rotateX(const T radian)
{
	T fSin = Math::Sin(radian);
	T fCos = Math::Cos(radian);

	T temp01 = m01 * fCos + m02 * fSin;
	T temp11 = m11 * fCos + m12 * fSin;
	T temp21 = m21 * fCos + m22 * fSin;
	T temp31 = m31 * fCos + m32 * fSin;

	T temp02 = m01 * -fSin + m02 * fCos;
	T temp12 = m11 * -fSin + m12 * fCos;
	T temp22 = m21 * -fSin + m22 * fCos;
	T temp32 = m31 * -fSin + m32 * fCos;

	m01 = temp01;
	m11 = temp11;
	m21 = temp21;
	m31 = temp31;
	m02 = temp02;
	m12 = temp12;
	m22 = temp22;
	m32 = temp32;
}

template <typename T> inline 
void Mat4T<T>::makeRotateX(const T radian)
{
	T fSin = Math::Sin(radian);
	T fCos = Math::Cos(radian);

	m00 = 1; m01 = 0;    m02 = 0;     m03 = 0;
	m10 = 0; m11 = fCos; m12 = -fSin; m13 = 0;
	m20 = 0; m21 = fSin; m22 = fCos;  m23 = 0;
	m30 = 0; m31 = 0;    m32 = 0;     m33 = 1;
}

// this = Ry * this
template <typename T> inline 
void Mat4T<T>::rotateY(const T radian)
{
	T fSin = Math::Sin(radian);
	T fCos = Math::Cos(radian);

	T temp00 = m00 * fCos - m02 * fSin;
	T temp10 = m10 * fCos - m12 * fSin;
	T temp20 = m20 * fCos - m22 * fSin;
	T temp30 = m30 * fCos - m32 * fSin;

	T temp02 = m00 * fSin + m02 * fCos;
	T temp12 = m10 * fSin + m12 * fCos;
	T temp22 = m20 * fSin + m22 * fCos;
	T temp32 = m30 * fSin + m32 * fCos;

	m00 = temp00;
	m10 = temp10;
	m20 = temp20;
	m30 = temp30;
	m02 = temp02;
	m12 = temp12;
	m22 = temp22;
	m32 = temp32;
}

template <typename T> inline 
void Mat4T<T>::makeRotateY(const T radian)
{
	T fSin = Math::Sin(radian);
	T fCos = Math::Cos(radian);

	m00 = fCos; m01 = 0; m02 = fSin; m03 = 0;
	m10 = 0;    m11 = 1; m12 = 0;    m13 = 0;
	m20 =-fSin; m21 = 0; m22 = fCos; m23 = 0;
	m30 = 0;    m31 = 0; m32 = 0;    m33 = 1;
}

// this = Rx * this
template <typename T> inline 
void Mat4T<T>::rotateZ(const T radian)
{
	T fSin = Math::Sin(radian);
	T fCos = Math::Cos(radian);

	T temp00 = m00 * fCos + m01 * fSin;
	T temp10 = m10 * fCos + m11 * fSin;
	T temp20 = m20 * fCos + m21 * fSin;
	T temp30 = m30 * fCos + m31 * fSin;

	T temp01 = m00 *-fSin + m01 * fCos;
	T temp11 = m10 *-fSin + m11 * fCos;
	T temp21 = m20 *-fSin + m21 * fCos;
	T temp31 = m30 *-fSin + m31 * fCos;

	m00 = temp00;
	m10 = temp10;
	m20 = temp20;
	m30 = temp30;
	m01 = temp01;
	m11 = temp11;
	m21 = temp21;
	m31 = temp31;
}

template <typename T> inline 
void Mat4T<T>::makeRotateZ(const T radian)
{
	T fSin = Math::Sin(radian);
	T fCos = Math::Cos(radian);

	m00 = fCos;	m01 = -fSin; m02 = 0; m03 = 0;
	m10 = fSin; m11 = fCos;  m12 = 0; m13 = 0;
	m20 = 0;    m21 = 0;     m22 = 1; m23 = 0;
	m30 = 0;    m31 = 0;     m32 = 0; m33 = 1;
}

template <typename T> inline 
void Mat4T<T>::scale(const Vec3T<T> &scaleVec)
{
	scale(scaleVec.x, scaleVec.y, scaleVec.z);
}

template <typename T> inline 
void Mat4T<T>::scale(T x, T y, T z)
{
	m00 *= x; m01 *= y; m02 *= z;
	m10 *= x; m11 *= y; m12 *= z;
	m20 *= x; m21 *= y; m22 *= z;
}

template <typename T> inline 
void Mat4T<T>::makeScale(const Vec3T<T> &scaleVec)
{
	makeScale(scaleVec.x, scaleVec.y, scaleVec.z);
}

template <typename T> inline 
void Mat4T<T>::makeScale(T x, T y, T z)
{
	m00 = x; m01 = 0; m02 = 0; m03 = 0;
	m10 = 0; m11 = y; m12 = 0; m13 = 0;
	m20 = 0; m21 = 0; m22 = z; m23 = 0;
	m30 = 0; m31 = 0; m32 = 0; m33 = 1;
}

template <typename T> inline 
Vec3T<T> Mat4T<T>::transformVec3(const Vec3T<T> &vec) const
{
	Vec3T<T> outVec;
	T w = 1.0f / (vec.x * m30 + vec.y * m31 + vec.z * m32 + m33);
	outVec.x = (vec.x * m00 + vec.y * m01 + vec.z * m02 + m03) * w;
	outVec.y = (vec.x * m10 + vec.y * m11 + vec.z * m12 + m13) * w;
	outVec.z = (vec.x * m20 + vec.y * m21 + vec.z * m22 + m23) * w;
	return outVec;
}

template <typename T> inline 
Vec3T<T> Mat4T<T>::transformVec3(const Vec4T<T> &vec) const
{
	Vec3T<T> outVec;
	outVec.x = vec.x * m00 + vec.y * m01 + vec.z * m02 + vec.w * m03;
	outVec.y = vec.x * m10 + vec.y * m11 + vec.z * m12 + vec.w * m13;
	outVec.z = vec.x * m20 + vec.y * m21 + vec.z * m22 + vec.w * m23;
	return outVec;
}

template <typename T> inline
void Mat4T<T>::transformVec3(const Vec4T<T> &in, Vec4T<T> &out) const
{
	out.x = in.x * m00 + in.y * m01 + in.z * m02 + m03;
	out.y = in.x * m10 + in.y * m11 + in.z * m12 + m13;
	out.z = in.x * m20 + in.y * m21 + in.z * m22 + m23;
}

// assume input vec.w equals 1
// result.w is garbage
template <typename T> inline 
Vec4T<T> Mat4T<T>::transformVec4(const Vec4T<T> &vec) const
{
	Vec4T<T> outVec;
	outVec.x = vec.x * m00 + vec.y * m01 + vec.z * m02 + vec.w * m03;
	outVec.y = vec.x * m10 + vec.y * m11 + vec.z * m12 + vec.w * m13;
	outVec.z = vec.x * m20 + vec.y * m21 + vec.z * m22 + vec.w * m23;
	outVec.w = vec.x * m30 + vec.y * m31 + vec.z * m32 + vec.w * m33;
	return outVec;
}

template <typename T> inline 
Vec3T<T> Mat4T<T>::transformAffine(const Vec3T<T> &vec) const
{
	////CC_ASSERT(isAffine());
	Vec3T<T> outVec;
	outVec.x = vec.x * m00 + vec.y * m01 + vec.z * m02 + m03;
	outVec.y = vec.x * m10 + vec.y * m11 + vec.z * m12 + m13;
	outVec.z = vec.x * m20 + vec.y * m21 + vec.z * m22 + m23;
	return outVec;
}

template <typename T> inline 
Vec4T<T> Mat4T<T>::transformAffine(const Vec4T<T> &vec) const
{
	////CC_ASSERT(isAffine());
	Vec4T<T> outVec;
	outVec.x = vec.x * m00 + vec.y * m01 + vec.z * m02 + m03 * vec.w;
	outVec.y = vec.x * m10 + vec.y * m11 + vec.z * m12 + m13 * vec.w;
	outVec.z = vec.x * m20 + vec.y * m21 + vec.z * m22 + m23 * vec.w;
	outVec.w = vec.w;
	return outVec;
}

template <typename T> inline
Vec3T<T> Mat4T<T>::deltaTransformAffine(const Vec3T<T> &vec) const
{
	////CC_ASSERT(isAffine());
	Vec3T<T> outVec;
	float x = vec.x;
	float y = vec.y;
	float z = vec.z;
	outVec.x = m00 * x + m01 * y + m02 * z;
	outVec.y = m10 * x + m11 * y + m12 * z;
	outVec.z = m20 * x + m21 * y + m22 * z;
	return outVec;
}

template <typename T> inline 
void Mat4T<T>::transpose()
{
	Math::Swap(m01, m10);
	Math::Swap(m02, m20);
	Math::Swap(m03, m30);
	Math::Swap(m12, m21);
	Math::Swap(m13, m31);
	Math::Swap(m23, m32);
}

template <typename T> inline 
void Mat4T<T>::inverse()
{	
	T v0 = m20 * m31 - m21 * m30;
	T v1 = m20 * m32 - m22 * m30;
	T v2 = m20 * m33 - m23 * m30;
	T v3 = m21 * m32 - m22 * m31;
	T v4 = m21 * m33 - m23 * m31;
	T v5 = m22 * m33 - m23 * m32;

	T t00 = + (v5 * m11 - v4 * m12 + v3 * m13);
	T t10 = - (v5 * m10 - v2 * m12 + v1 * m13);
	T t20 = + (v4 * m10 - v2 * m11 + v0 * m13);
	T t30 = - (v3 * m10 - v1 * m11 + v0 * m12);

	T invDet = (T)1.0 / (t00 * m00 + t10 * m01 + t20 * m02 + t30 * m03);

	T d00 = t00 * invDet;
	T d10 = t10 * invDet;
	T d20 = t20 * invDet;
	T d30 = t30 * invDet;

	T d01 = - (v5 * m01 - v4 * m02 + v3 * m03) * invDet;
	T d11 = + (v5 * m00 - v2 * m02 + v1 * m03) * invDet;
	T d21 = - (v4 * m00 - v2 * m01 + v0 * m03) * invDet;
	T d31 = + (v3 * m00 - v1 * m01 + v0 * m02) * invDet;

	v0 = m10 * m31 - m11 * m30;
	v1 = m10 * m32 - m12 * m30;
	v2 = m10 * m33 - m13 * m30;
	v3 = m11 * m32 - m12 * m31;
	v4 = m11 * m33 - m13 * m31;
	v5 = m12 * m33 - m13 * m32;

	T d02 = + (v5 * m01 - v4 * m02 + v3 * m03) * invDet;
	T d12 = - (v5 * m00 - v2 * m02 + v1 * m03) * invDet;
	T d22 = + (v4 * m00 - v2 * m01 + v0 * m03) * invDet;
	T d32 = - (v3 * m00 - v1 * m01 + v0 * m02) * invDet;

	v0 = m21 * m10 - m20 * m11;
	v1 = m22 * m10 - m20 * m12;
	v2 = m23 * m10 - m20 * m13;
	v3 = m22 * m11 - m21 * m12;
	v4 = m23 * m11 - m21 * m13;
	v5 = m23 * m12 - m22 * m13;

	T d03 = - (v5 * m01 - v4 * m02 + v3 * m03) * invDet;
	T d13 = + (v5 * m00 - v2 * m02 + v1 * m03) * invDet;
	T d23 = - (v4 * m00 - v2 * m01 + v0 * m03) * invDet;
	T d33 = + (v3 * m00 - v1 * m01 + v0 * m02) * invDet;

	m00 = d00; m01 = d01; m02 = d02; m03 = d03;
	m10 = d10; m11 = d11; m12 = d12; m13 = d13;
	m20 = d20; m21 = d21; m22 = d22; m23 = d23;
	m30 = d30; m31 = d31; m32 = d32; m33 = d33;
}

template <typename T> inline 
void Mat4T<T>::fastInverse()
{	
	Math::Swap(m01, m10);
	Math::Swap(m02, m20);
	Math::Swap(m12, m21);

	m30 = 0;
	m31 = 0;
	m32 = 0;

	m03 = -m03;
	m13 = -m13;
	m23 = -m23;
	m33 = 1;
}

template <typename T> inline 
void Mat4T<T>::fromQuat(const QuatT<T> &quat)
{
	*this = quat.toMat4();
}

template <typename T> inline 
bool Mat4T<T>::isAffine() const
{
	return Math::IsEqual(m30, 0.0f) && Math::IsEqual(m31, 0.0f) && Math::IsEqual(m32, 0.0f) && Math::IsEqual(m33, 1.0f);
}

template <typename T> inline
void Mat4T<T>::clearTranslation()
{
	m03 = 0;
	m13 = 0;
	m23 = 0;
}

template <typename T> inline
void Mat4T<T>::clearScale()
{
	Vec3T<T> s = decomposeScale();

	s.inverse();

	m00 *= s.x; m01 *= s.y; m02 *= s.z;
	m10 *= s.x; m11 *= s.y; m12 *= s.z;
	m20 *= s.x; m21 *= s.y; m22 *= s.z;
}

template <typename T> inline
void Mat4T<T>::clearRotation()
{
	Vec3T<T> s = decomposeScale();

	m00 = s.x; m01 = 0;   m02 = 0;
	m10 = 0;   m11 = s.y; m12 = 0;
	m20 = 0;   m21 = 0;   m22 = s.z;
}

template <typename T> inline
void Mat4T<T>::recompose(const Vec3T<T>& t, const QuatT<T>& r, const Vec3T<T>& s)
{
	fromQuat(r);
	scale(s);
	translate(t);
}

template <typename T> inline
void Mat4T<T>::decompose(Vec3T<T>& t, QuatT<T>& r, Vec3T<T>& s) const
{
	t = decomposeTranslation();
	s = decomposeScale();

	T sx = 1.0f / s.x;
	T sy = 1.0f / s.y;
	T sz = 1.0f / s.z;

	Mat4T<T> mat;
	mat.m00 = m00 * sx; mat.m01 = m01 * sy; mat.m02 = m02 * sz; mat.m03 = 0;
	mat.m10 = m10 * sx; mat.m11 = m11 * sy; mat.m12 = m12 * sz; mat.m13 = 0;
	mat.m20 = m20 * sx; mat.m21 = m21 * sy; mat.m22 = m22 * sz; mat.m23 = 0;
	mat.m30 = 0;        mat.m31 = 0;         mat.m32 = 0;        mat.m33 = 1;
	r.fromMat4(mat);
}

template <typename T> inline
Vec3T<T> Mat4T<T>::decomposeTranslation() const
{
	Vec3T<T> t;
	t.x = m03;
	t.y = m13;
	t.z = m23;
	return t;
}

template <typename T> inline
Vec3T<T> Mat4T<T>::decomposeScale() const
{
	Vec3T<T> s;
	s.x = Math::Sqrt(m00 * m00 + m10 * m10 + m20 * m20);
	s.y = Math::Sqrt(m01 * m01 + m11 * m11 + m21 * m21);
	s.z = Math::Sqrt(m02 * m02 + m12 * m12 + m22 * m22);
	return s;
}

template <typename T> inline
Mat4T<T> Mat4T<T>::decomposeRotationMatrix() const
{
	Vec3T<T> s = decomposeScale();
	s.inverse();

	Mat4T<T> mat;
	mat.m00 = m00 * s.x; mat.m01 = m01 * s.y; mat.m02 = m02 * s.z; mat.m03 = 0;
	mat.m10 = m10 * s.x; mat.m11 = m11 * s.y; mat.m12 = m12 * s.z; mat.m13 = 0;
	mat.m20 = m20 * s.x; mat.m21 = m21 * s.y; mat.m22 = m22 * s.z; mat.m23 = 0;
	mat.m30 = 0;         mat.m31 = 0;         mat.m32 = 0;         mat.m33 = 1;
	return mat;
}

template <typename T> inline
QuatT<T> Mat4T<T>::decomposeRotation() const
{
	QuatT<T> r;
	r.fromMat4(decomposeRotationMatrix());
	return r;
}

template <typename T> inline 
bool operator == (const Mat4T<T> &a, const Mat4T<T> &b)
{
	// true if all vectors equal to each other
	return (Math::IsEqual(a.m00, b.m00) && Math::IsEqual(a.m01, b.m01) && Math::IsEqual(a.m02, b.m02) && Math::IsEqual(a.m03, b.m03) &&
			Math::IsEqual(a.m10, b.m10) && Math::IsEqual(a.m11, b.m11) && Math::IsEqual(a.m12, b.m12) && Math::IsEqual(a.m13, b.m13) &&
			Math::IsEqual(a.m20, b.m20) && Math::IsEqual(a.m21, b.m21) && Math::IsEqual(a.m22, b.m22) && Math::IsEqual(a.m23, b.m23) &&
			Math::IsEqual(a.m30, b.m30) && Math::IsEqual(a.m31, b.m31) && Math::IsEqual(a.m32, b.m32) && Math::IsEqual(a.m33, b.m33));
}

template <typename T> inline 
bool operator != (const Mat4T<T> &a, const Mat4T<T> &b)
{
	// true if any one vector not-equal
	return (Math::IsNotEqual(a.m00, b.m00) || Math::IsNotEqual(a.m01, b.m01) || Math::IsNotEqual(a.m02, b.m02) || Math::IsNotEqual(a.m03, b.m03) ||
			Math::IsNotEqual(a.m10, b.m10) || Math::IsNotEqual(a.m11, b.m11) || Math::IsNotEqual(a.m12, b.m12) || Math::IsNotEqual(a.m13, b.m13) ||
			Math::IsNotEqual(a.m20, b.m20) || Math::IsNotEqual(a.m21, b.m21) || Math::IsNotEqual(a.m22, b.m22) || Math::IsNotEqual(a.m23, b.m23) ||
			Math::IsNotEqual(a.m30, b.m30) || Math::IsNotEqual(a.m31, b.m31) || Math::IsNotEqual(a.m32, b.m32) || Math::IsNotEqual(a.m33, b.m33));
}

template <typename T> inline 
Mat4T<T> operator + (const Mat4T<T> &a, const T f)
{
	Mat4T<T> result = a;
	result += f;
	return result;
}

template <typename T> inline 
Mat4T<T> operator + (const T f, const Mat4T<T> &a)
{
	Mat4T<T> result = a;
	result += f;
	return result;
}

template <typename T> inline 
Mat4T<T> operator + (const Mat4T<T> &a, const Mat4T<T> &b)
{
	Mat4T<T> result;

	result.m00 = a.m00 + b.m00;
	result.m01 = a.m01 + b.m01;
	result.m02 = a.m02 + b.m02;
	result.m03 = a.m03 + b.m03;

	result.m10 = a.m10 + b.m10;
	result.m11 = a.m11 + b.m11;
	result.m12 = a.m12 + b.m12;
	result.m13 = a.m13 + b.m13;
	
	result.m20 = a.m20 + b.m20;
	result.m21 = a.m21 + b.m21;
	result.m22 = a.m22 + b.m22;
	result.m23 = a.m23 + b.m23;
	
	result.m30 = a.m30 + b.m30;
	result.m31 = a.m31 + b.m31;
	result.m32 = a.m32 + b.m32;
	result.m33 = a.m33 + b.m33;

	return result;
}

template <typename T> inline 
Mat4T<T> operator - (const Mat4T<T> &a, const T f)
{
	Mat4T<T> result = a;
	result -= f;
	return result;
}

template <typename T> inline 
Mat4T<T> operator - (const T f, const Mat4T<T> &a)
{
	Mat4T<T> result = a;
	result -= f;
	return result;
}

template <typename T> inline 
Mat4T<T> operator - (const Mat4T<T> &a, const Mat4T<T> &b)
{
	Mat4T<T> result;

	result.m00 = a.m00 - b.m00;
	result.m01 = a.m01 - b.m01;
	result.m02 = a.m02 - b.m02;
	result.m03 = a.m03 - b.m03;

	result.m10 = a.m10 - b.m10;
	result.m11 = a.m11 - b.m11;
	result.m12 = a.m12 - b.m12;
	result.m13 = a.m13 - b.m13;
	
	result.m20 = a.m20 - b.m20;
	result.m21 = a.m21 - b.m21;
	result.m22 = a.m22 - b.m22;
	result.m23 = a.m23 - b.m23;
	
	result.m30 = a.m30 - b.m30;
	result.m31 = a.m31 - b.m31;
	result.m32 = a.m32 - b.m32;
	result.m33 = a.m33 - b.m33;

	return result;
}

template <typename T> inline 
Vec4T<T> operator * (const Mat4T<T> &m, const Vec4T<T> &v)
{
	return m.transformVec4(v);
}

template <typename T> inline 
Vec3T<T> operator * (const Mat4T<T> &m, const Vec3T<T> &v)
{
	return m.transformVec3(v);
}

template <typename T> inline 
Mat4T<T> operator * (const Mat4T<T> &a, const Mat4T<T> &b)
{
	Mat4T<T> result;

	result.m00 = a.m00 * b.m00 + a.m01 * b.m10 + a.m02 * b.m20 + a.m03 * b.m30;
	result.m01 = a.m00 * b.m01 + a.m01 * b.m11 + a.m02 * b.m21 + a.m03 * b.m31;
	result.m02 = a.m00 * b.m02 + a.m01 * b.m12 + a.m02 * b.m22 + a.m03 * b.m32;
	result.m03 = a.m00 * b.m03 + a.m01 * b.m13 + a.m02 * b.m23 + a.m03 * b.m33;
	
	result.m10 = a.m10 * b.m00 + a.m11 * b.m10 + a.m12 * b.m20 + a.m13 * b.m30;
	result.m11 = a.m10 * b.m01 + a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31;
	result.m12 = a.m10 * b.m02 + a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32;
	result.m13 = a.m10 * b.m03 + a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33;
	
	result.m20 = a.m20 * b.m00 + a.m21 * b.m10 + a.m22 * b.m20 + a.m23 * b.m30;
	result.m21 = a.m20 * b.m01 + a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31;
	result.m22 = a.m20 * b.m02 + a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32;
	result.m23 = a.m20 * b.m03 + a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33;
	
	result.m30 = a.m30 * b.m00 + a.m31 * b.m10 + a.m32 * b.m20 + a.m33 * b.m30;
	result.m31 = a.m30 * b.m01 + a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31;
	result.m32 = a.m30 * b.m02 + a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32;
	result.m33 = a.m30 * b.m03 + a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33;

	return result;
}

template <typename T> inline 
Mat4T<T> operator * (const Mat4T<T> &a, const T f)
{
	Mat4T<T> result;

	result.m00 = a.m00 * f;
	result.m01 = a.m01 * f;
	result.m02 = a.m02 * f;
	result.m03 = a.m03 * f;
	
	result.m10 = a.m10 * f;
	result.m11 = a.m11 * f;
	result.m12 = a.m12 * f;
	result.m13 = a.m13 * f;
	
	result.m20 = a.m20 * f;
	result.m21 = a.m21 * f;
	result.m22 = a.m22 * f;
	result.m23 = a.m23 * f;
	
	result.m30 = a.m30 * f;
	result.m31 = a.m31 * f;
	result.m32 = a.m32 * f;
	result.m33 = a.m33 * f;

	return result;
}

template <typename T> inline 
Mat4T<T> operator * (const T f, const Mat4T<T> &a)
{
	Mat4T<T> result;

	result.m00 = f * a.m00;
	result.m01 = f * a.m01;
	result.m02 = f * a.m02;
	result.m03 = f * a.m03;
	
	result.m10 = f * a.m10;
	result.m11 = f * a.m11;
	result.m12 = f * a.m12;
	result.m13 = f * a.m13;
	
	result.m20 = f * a.m20;
	result.m21 = f * a.m21;
	result.m22 = f * a.m22;
	result.m23 = f * a.m23;
	
	result.m30 = f * a.m30;
	result.m31 = f * a.m31;
	result.m32 = f * a.m32;
	result.m33 = f * a.m33;

	return result;
}

template <typename T> inline 
Mat4T<T> operator / (const Mat4T<T> &a, const T f)
{
	Mat4T<T> result;

	T fInv = 1.0f / f;

	result.m00 = a.m00 * fInv;
	result.m01 = a.m01 * fInv;
	result.m02 = a.m02 * fInv;
	result.m03 = a.m03 * fInv;
	
	result.m10 = a.m10 * fInv;
	result.m11 = a.m11 * fInv;
	result.m12 = a.m12 * fInv;
	result.m13 = a.m13 * fInv;
	
	result.m20 = a.m20 * fInv;
	result.m21 = a.m21 * fInv;
	result.m22 = a.m22 * fInv;
	result.m23 = a.m23 * fInv;
	
	result.m30 = a.m30 * fInv;
	result.m31 = a.m31 * fInv;
	result.m32 = a.m32 * fInv;
	result.m33 = a.m33 * fInv;

	return result;
}

template <typename T> inline
void Mat4T<T>::copyRawDataFrom(const T* data, int index, bool transpose)
{
	if (transpose)
		this->transpose();

	for (int i = 0; i < 16; i++)
		m[i] = data[i + index];

	if (transpose)
		this->transpose();
}

template <typename T> inline
void Mat4T<T>::copyRawDataTo(T* data, int index, bool transpose) const
{
	if (transpose)
	{
		int offset = index;
		for (int i = 0; i < 4; i++)
		{
			data[offset] = m[i];
			data[offset + 1] = m[i + 4];
			data[offset + 2] = m[i + 8];
			data[offset + 3] = m[i + 12];
			offset += 4;
		}
	}
	else
	{
		for (int i = 0; i < 16; i++)
			data[i + index] = m[i];
	}
}