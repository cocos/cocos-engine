template <typename T> inline 
Vec3T<T>::Vec3T()
#if defined(_WIN32) && defined(_DEBUG)
: x(Math::MIN<T>())
, y(Math::MIN<T>())
, z(Math::MIN<T>())
#endif
{
}

template <typename T> inline 
Vec3T<T>::Vec3T(const T _x, const T _y, const T _z)
: x(_x)
, y(_y)
, z(_z)
{
}

template <typename T> inline 
Vec3T<T>::Vec3T(const Vec2T<T> &vec, T _z)
: x(vec.x)
, y(vec.y)
, z(_z)
{
}

template <typename T> inline
Vec3T<T>::operator Vec2T<T>()
{
	return Vec2T<T>(x, y);
}

template <typename T> inline 
Vec3T<T>& Vec3T<T>::operator += (const Vec3T &rhs)
{
	x += rhs.x;
	y += rhs.y;
	z += rhs.z;
	return *this;
}

template <typename T> inline 
Vec3T<T>& Vec3T<T>::operator -= (const Vec3T &rhs)
{
	x -= rhs.x;
	y -= rhs.y;
	z -= rhs.z;
	return *this;
}

template <typename T> inline 
Vec3T<T>& Vec3T<T>::operator *= (const T value)
{
	x *= value;
	y *= value;
	z *= value;
	return *this;
}

template <typename T> inline 
Vec3T<T>& Vec3T<T>::operator /= (const T value)
{
	x /= value;
	y /= value;
	z /= value;
	return *this;
}

template <typename T> inline 
void Vec3T<T>::print()
{
	printf("vec3 x: %f, y: %f, z: %f\n",x,y,z);
}

template <typename T> inline 
T& Vec3T<T>::operator [] (int index)
{
	//CC_ASSERTS(index >= 0 && index < 3, "Access out of bounds");
	return m[index];
}

template <typename T> inline 
const T& Vec3T<T>::operator [] (int index) const
{
	//CC_ASSERTS(index >= 0 && index < 3, "Access out of bounds");
	return m[index];
}

template <typename T> inline 
bool Vec3T<T>::operator < (const Vec3T &rhs) const
{
	if( x < rhs.x && y < rhs.y && z < rhs.z)
		return true;
	else
		return false;
}

template <typename T> inline 
bool Vec3T<T>::operator <= (const Vec3T &rhs) const
{
	if( x <= rhs.x && y <= rhs.y && z <= rhs.z)
		return true;
	else
		return false;
}

template <typename T> inline 
bool Vec3T<T>::operator > (const Vec3T &rhs) const
{
	if( x > rhs.x && y > rhs.y && z > rhs.z)
		return true;
	else
		return false;
}

template <typename T> inline 
bool Vec3T<T>::operator >= (const Vec3T &rhs) const
{
	if( x >= rhs.x && y >= rhs.y && z >= rhs.z)
		return true;
	else
		return false;
}

template <typename T> inline 
T* Vec3T<T>::ptr()
{
	return &x;
}

template <typename T> inline 
const T* Vec3T<T>::ptr() const
{
	return &x;
}

template <typename T> inline 
void Vec3T<T>::zero()
{
	x = 0;
	y = 0;
	z = 0;
}

template <typename T> inline 
void Vec3T<T>::one()
{
	x = 1;
	y = 1;
	z = 1;
}

template <typename T> inline 
void Vec3T<T>::set(T _x, T _y, T _z)
{
	this->x = _x;
	this->y = _y;
	this->z = _z;
}

template <typename T> inline 
void Vec3T<T>::set(T *p)
{
	this->x = p[0];
	this->y = p[1];
	this->z = p[2];
}

template <typename T> inline 
void Vec3T<T>::setVec2(const Vec2T<T>& vec2, T _z)
{
	x = vec2.x;
	y = vec2.y;
	z = _z;
}

template <typename T> inline 
T Vec3T<T>::dot(const Vec3T& rhs) const
{
	return (x * rhs.x + y * rhs.y + z * rhs.z);
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::cross(const Vec3T& rhs) const
{
	return Vec3T<T>(y * rhs.z - z * rhs.y, z * rhs.x - x * rhs.z, x * rhs.y - y * rhs.x);
}

template <typename T> inline 
void Vec3T<T>::inverse()
{
	x = 1.0f / x;
	y = 1.0f / y;
	z = 1.0f / z;
}

template <typename T> inline 
void Vec3T<T>::sqrt()
{
	x = Math::Sqrt(x);
	y = Math::Sqrt(y);
	z = Math::Sqrt(z);
}

template <typename T> inline 
void Vec3T<T>::invSqrt()
{
	x = 1.0f / Math::Sqrt(x);
	y = 1.0f / Math::Sqrt(y);
	z = 1.0f / Math::Sqrt(z);
}

template <typename T> inline 
T Vec3T<T>::len() const
{
	return Math::Sqrt(x * x + y * y + z * z);
}

template <typename T> inline 
T Vec3T<T>::lenSqr() const
{
	return (x * x + y * y + z * z);
}

template <typename T> inline 
void Vec3T<T>::normalize()
{
	T length = len();
	x /= length;
	y /= length;
	z /= length;
}

template <typename T> inline 
T Vec3T<T>::normalizeWithLen()
{
	T length = len();

	x /= length;
	y /= length;
	z /= length;

	return length;
}

template <typename T> inline 
void Vec3T<T>::abs()
{
	x = Math::Abs(x);
	y = Math::Abs(y);
	z = Math::Abs(z);
}

template <typename T> inline 
void Vec3T<T>::neg()
{
	x = -x;
	y = -y;
	z = -z;
}

template <typename T> inline 
void Vec3T<T>::saturate()
{
	if ( x > 1 ) x = 1;
	if ( y > 1 ) y = 1;
	if ( z > 1 ) z = 1;

	if ( x < 0 ) x = 0;
	if ( y < 0 ) y = 0;
	if ( z < 0 ) z = 0;
}

template <typename T> inline 
void Vec3T<T>::clampZero()
{
	if ( x < 0 ) x = 0;
	if ( y < 0 ) y = 0;
	if ( z < 0 ) z = 0;
}

template <typename T> inline 
void Vec3T<T>::clampOne()
{
	if ( x > 1 ) x = 1;
	if ( y > 1 ) y = 1;
	if ( z > 1 ) z = 1;

	return *this;
}

template <typename T> inline 
void Vec3T<T>::floor()
{
	x = Math::Floor(x);
	y = Math::Floor(y);
	z = Math::Floor(z);
}

template <typename T> inline 
void Vec3T<T>::ceil()
{
	x = Math::Ceil(x);
	y = Math::Ceil(y);
	z = Math::Ceil(z);

	return *this;
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::midPoint(const Vec3T& vec) const
{
	return Vec3T((x + vec.x) * 0.5f, (y + vec.y) * 0.5f, (z + vec.z) * 0.5f);
}

template <typename T> inline
Vec3T<T> Vec3T<T>::randomDeviant(
const T& angle,
const Vec3T& up )const
{
	Vec3T newUp;

	if (up == Vec3T(0, 0, 0))
	{
		// Generate an up vector
		newUp = this->perpendicular();
	}
	else
	{
		newUp = up;
	}

	// Rotate up vector by random amount around this
	QuatT<T> q;
	q.fromRotateAxis(*this, (T)(Math::UnitRandom() * Math::PI_2));
	newUp = q * newUp;

	// Finally rotate this by given angle around randomised up
	q.fromRotateAxis(newUp, angle);
	return q * (*this);
}

template <typename T> inline
QuatT<T> Vec3T<T>::getRotationTo(const Vec3T& dest, const Vec3T& fallbackAxis /*= Vector3::ZERO*/) const
{
	// Based on Stan Melax's article in Game Programming Gems
	QuatT<T> q(1.0,1.0,1.0,1.0);
	Vec3T vecX(1.0, 0.0, 0.0);
	Vec3T vecY(0.0, 1.0, 0.0);
	Vec3T vecZero(0.0, 0.0, 0.0);
	// Copy, since cannot modify local
	Vec3T v0 = *this;
	Vec3T v1 = dest;
	v0.normalize();
	v1.normalize();

	float d = v0.dot(v1);
	// If dot == 1, vectors are the same
	if (d >= 1.0f)
	{
		return q;
	}
	if (d < (1e-6f - 1.0f))
	{
		if (fallbackAxis != vecZero)
		{
			// rotate 180 degrees about the fallback axis
			q.fromAngleAxis(Math::PI, fallbackAxis);
		}
		else
		{
			// Generate an axis
			Vec3T axis = vecX.cross(*this);
			if (axis.isZeroLength()) // pick another if colinear
				axis = vecY.cross(*this);
			axis.normalize();
			q.fromAngleAxis(Math::PI, axis);
		}
	}
	else
	{
		float s = Math::Sqrt((1 + d) * 2);
		float invs = 1 / s;

		Vec3T c = v0.cross(v1);

		q.x = c.x * invs;
		q.y = c.y * invs;
		q.z = c.z * invs;
		q.w = s * 0.5f;
		q.normalize();
	}
	return q;
}


template <typename T> inline 
void Vec3T<T>::makeFloor(const Vec3T &cmp)
{
	x = Math::Min(x, cmp.x);
	y = Math::Min(y, cmp.y);
	z = Math::Min(z, cmp.z);
}

template <typename T> inline 
void Vec3T<T>::makeCeil(const Vec3T &cmp)
{
	x = Math::Max(x, cmp.x);
	y = Math::Max(y, cmp.y);
	z = Math::Max(z, cmp.z);
}

template <typename T> inline 
bool Vec3T<T>::isZeroLength() const
{
	T sqlen = (x * x) + (y * y) + (z * z);
	return (sqlen < (Math::LOWEPSILON * Math::LOWEPSILON));
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::perpendicular() const
{
	Vec3T<T> outVec = this->cross(Vec3T<T>(1, 0, 0));

	// Check length
	if(outVec.lenSqr() == 0.0)
	{
		/* This vector is the Y axis multiplied by a scalar, so we have
		   to use another axis.
		*/
		outVec = this->cross(Vec3T<T>(0, 1, 0));
	}
	outVec.normalize();
	return outVec;
}

template <typename T> inline 
T Vec3T<T>::Dot(const Vec3T &a, const Vec3T &b)
{
	return (a.x * b.x + a.y * b.y + a.z * b.z);
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::Cross(const Vec3T &a, const Vec3T &b)
{
	return Vec3T(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::Lerp(const Vec3T &a, const Vec3T &b, const T t)
{
	return a + (b - a) * t;
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::Max(const Vec3T &a, const Vec3T &b)
{
	return Vec3T((a.x > b.x ? a.x : b.x), (a.y > b.y ? a.y : b.y), (a.z > b.z ? a.z : b.z));
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::Min(const Vec3T &a, const Vec3T &b)
{
	return Vec3T((a.x < b.x ? a.x : b.x), (a.y < b.y ? a.y : b.y), (a.z < b.z ? a.z : b.z));
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::Inverse(const Vec3T &a)
{
	Vec3T<T> outVec = a;
	outVec.inverse();
	return outVec;
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::Sqrt(const Vec3T &a)
{
	Vec3T<T> outVec = a;
	outVec.sqrt();
	return outVec;
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::InvSqrt(const Vec3T &a)
{
	Vec3T<T> outVec = a;
	outVec.invSqrt();
	return outVec;
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::Normalize(const Vec3T &a)
{
	Vec3T<T> outVec = a;
	outVec.normalize();
	return outVec;
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::NormalizeWithLen(const Vec3T &a, T& len)
{
	Vec3T<T> outVec = a;
	len = outVec.normalizeWithLen();
	return outVec;
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::Abs(const Vec3T &a)
{
	Vec3T<T> outVec = a;
	outVec.abs();
	return outVec;
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::Neg(const Vec3T &a)
{
	Vec3T<T> outVec = a;
	outVec.neg();
	return outVec;
}

template <typename T> inline 
Vec3T<T> Vec3T<T>::Saturate(const Vec3T &a)
{
	Vec3T<T> outVec = a;
	outVec.saturate();
	return outVec;
}

template <typename T> inline 
Vec3T<T> operator + (const Vec3T<T> &rhs)
{
	return rhs;
}

template <typename T> inline 
Vec3T<T> operator - (const Vec3T<T> &rhs)
{
	return Vec3T<T>(-rhs.x, -rhs.y, -rhs.z);
}

template <typename T> inline 
bool operator == (const Vec3T<T> &a, const Vec3T<T> &b)
{
	return (Math::IsEqual(a.x, b.x) && Math::IsEqual(a.y, b.y) && Math::IsEqual(a.z, b.z));
}

template <typename T> inline 
bool operator != (const Vec3T<T> &a, const Vec3T<T> &b)
{
	return (Math::IsNotEqual(a.x, b.x) || Math::IsNotEqual(a.y, b.y) || Math::IsNotEqual(a.z, b.z));
}

template <typename T> inline 
Vec3T<T> operator + (const Vec3T<T> &a, const Vec3T<T> &b)
{
	return Vec3T<T>(a.x + b.x, a.y + b.y, a.z + b.z);
}

template <typename T> inline
Vec3T<T> operator + (const Vec3T<T> &a, float f)
{
	return Vec3T<T>(a.x + f, a.y + f, a.z + f);
}

template <typename T> inline
Vec3T<T> operator + (float f, const Vec3T<T> &a)
{
	return Vec3T<T>(f + a.x, f + a.y, f + a.z);
}

template <typename T> inline 
Vec3T<T> operator - (const Vec3T<T> &a, const Vec3T<T> &b)
{
	return Vec3T<T>(a.x - b.x, a.y - b.y, a.z - b.z);
}

template <typename T> inline
Vec3T<T> operator - (const Vec3T<T> &a, float f)
{
	return Vec3T<T>(a.x - f, a.y - f, a.z - f);
}

template <typename T> inline
Vec3T<T> operator - (float f, const Vec3T<T> &a)
{
	return Vec3T<T>(f - a.x, f - a.y, f - a.z);
}

template <typename T> inline 
Vec3T<T> operator * (const T f, const Vec3T<T> &v)
{
	return Vec3T<T>(f * v.x, f * v.y, f * v.z);
}

template <typename T> inline 
Vec3T<T> operator * (const Vec3T<T> &v, const T f)
{
	return Vec3T<T>(f * v.x, f * v.y, f * v.z);
}

template <typename T> inline 
Vec3T<T> operator * (const Vec3T<T> a, const Vec3T<T> &b)
{
	return Vec3T<T>(a.x * b.x, a.y * b.y, a.z * b.z);
}

template <typename T> inline 
Vec3T<T> operator / (const Vec3T<T> &a, const T f)
{
	return Vec3T<T>(a.x / f, a.y / f, a.z / f);
}

template <typename T> inline 
Vec3T<T> operator / (const T f, const Vec3T<T> &a)
{
	return Vec3T<T>(f / a.x, f / a.y, f / a.z);
}

template <typename T> inline 
Vec3T<T> operator / (const Vec3T<T> a, const Vec3T<T> &b)
{
	return Vec3T<T>(a.x / b.x, a.y / b.y, a.z / b.z);
}
