template <typename T> inline 
Vec4T<T>::Vec4T()
#if defined(_WIN32) && defined(_DEBUG)
: x(Math::MIN<T>())
, y(Math::MIN<T>())
, z(Math::MIN<T>())
, w(Math::MIN<T>())
#endif
{
}

template <typename T> inline 
Vec4T<T>::Vec4T(const T _x, const T _y, const T _z, const T _w)
: x(_x)
, y(_y)
, z(_z)
, w(_w)
{
}

template <typename T> inline 
Vec4T<T>::Vec4T(const T value)
: x(value)
, y(value)
, z(value)
, w(value)
{
}

template <typename T> inline 
Vec4T<T>::Vec4T(const Vec3T<T> &vec3, T _w)
: x(vec3.x)
, y(vec3.y)
, z(vec3.z)
, w(_w)
{
}

template <typename T> inline
Vec4T<T>::operator Vec2T<T>()
{
	return Vec2T<T>(x, y);
}

template <typename T> inline
Vec4T<T>::operator Vec3T<T>()
{
	return Vec3T<T>(x, y, z);
}

template <typename T> inline 
Vec4T<T>& Vec4T<T>::operator += (const Vec4T &rhs)
{
	x += rhs.x;
	y += rhs.y;
	z += rhs.z;
	w += rhs.w;
	return *this;
}

template <typename T> inline 
Vec4T<T>& Vec4T<T>::operator += (const T value)
{
	x += value;
	y += value;
	z += value;
	w += value;
	return *this;
}

template <typename T> inline 
Vec4T<T>& Vec4T<T>::operator -= (const Vec4T &rhs)
{
	x -= rhs.x;
	y -= rhs.y;
	z -= rhs.z;
	w -= rhs.w;

	return *this;
}

template <typename T> inline 
Vec4T<T>& Vec4T<T>::operator -= (const T value)
{
	x -= value;
	y -= value;
	z -= value;
	w -= value;

	return *this;
}

template <typename T> inline 
Vec4T<T>& Vec4T<T>::operator *= (const Vec4T &rhs)
{
	x *= rhs.x;
	y *= rhs.y;
	z *= rhs.z;
	w *= rhs.w;

	return *this;
}

template <typename T> inline 
Vec4T<T>& Vec4T<T>::operator *= (const T value)
{
	x *= value;
	y *= value;
	z *= value;
	w *= value;

	return *this;
}

template <typename T> inline 
Vec4T<T>& Vec4T<T>::operator /= (const Vec4T &rhs)
{
	x /= rhs.x;
	y /= rhs.y;
	z /= rhs.z;
	w /= rhs.w;

	return *this;
}

template <typename T> inline 
Vec4T<T>& Vec4T<T>::operator /= (const T value)
{
	x /= value;
	y /= value;
	z /= value;
	w /= value;

	return *this;
}

template <typename T> inline 
T& Vec4T<T>::operator [] (int index)
{
	//CC_ASSERTS(index >= 0 && index < 4, "Access out of bounds");
	return m[index];
}

template <typename T> inline 
const T& Vec4T<T>::operator [] (int index) const
{
	//CC_ASSERTS(index >= 0 && index < 4, "Access out of bounds");
	return m[index];
}

template <typename T> inline 
T* Vec4T<T>::ptr()
{
	return &x;
}

template <typename T> inline 
const T* Vec4T<T>::ptr() const
{
	return &x;
}

template <typename T> inline 
void Vec4T<T>::zero()
{
	x = 0;
	y = 0;
	z = 0;
	w = 0;
}

template <typename T> inline 
void Vec4T<T>::one()
{
	x = 1;
	y = 1;
	z = 1;
	w = 1;
}

template <typename T> inline 
void Vec4T<T>::set(T _x, T _y, T _z, T _w)
{
	this->x = _x;
	this->y = _y;
	this->z = _z;
	this->w = _w;
}

template <typename T> inline 
void Vec4T<T>::set(T value)
{
	this->x = value;
	this->y = value;
	this->z = value;
	this->w = value;
}

template <typename T> inline 
void Vec4T<T>::set(T *p)
{
	this->x = p[0];
	this->y = p[1];
	this->z = p[2];
	this->w = p[3];
}

template <typename T> inline 
void Vec4T<T>::setVec3(const Vec3T<T> &vec3, T _w)
{
	x = vec3.x;
	y = vec3.y;
	z = vec3.z;
	w = _w;
}

template <typename T> inline
Vec3T<T> Vec4T<T>::toVec3() const
{
	return Vec3T<T>(x, y, z);
}

template <typename T> inline 
T Vec4T<T>::dot(const Vec4T &rhs) const
{
	return (x * rhs.x + y * rhs.y + z * rhs.z + w * rhs.w);
}

template <typename T> inline 
void Vec4T<T>::inverse()
{
	x = 1.0f / x;
	y = 1.0f / y;
	z = 1.0f / z;
	w = 1.0f / w;
}

template <typename T> inline 
void Vec4T<T>::sqrt()
{
	x = Math::Sqrt(x);
	y = Math::Sqrt(y);
	z = Math::Sqrt(z);
	w = Math::Sqrt(w);
}

template <typename T> inline 
void Vec4T<T>::invSqrt()
{
	x = 1.0f / Math::Sqrt(x);
	y = 1.0f / Math::Sqrt(y);
	z = 1.0f / Math::Sqrt(z);
	w = 1.0f / Math::Sqrt(w);
}

template <typename T> inline 
T Vec4T<T>::len() const
{
	return Math::Sqrt(x * x + y * y + z * z + w * w);
}

template <typename T> inline 
T Vec4T<T>::lenSqr() const
{
	return (x * x + y * y + z * z + w * w);
}

template <typename T> inline 
void Vec4T<T>::normalize()
{
	T length = len();
	x /= length;
	y /= length;
	z /= length;
	w /= length;
}

template <typename T> inline 
T Vec4T<T>::normalizeWithLen()
{
	T length = len();
	x /= length;
	y /= length;
	z /= length;
	w /= length;

	return length;
}

template <typename T> inline 
void Vec4T<T>::abs()
{
	x = Math::Abs(x);
	y = Math::Abs(y);
	z = Math::Abs(z);
	w = Math::Abs(w);
}

template <typename T> inline 
void Vec4T<T>::neg()
{
	x = -x;
	y = -y;
	z = -z;
	w = -w;
}

template <typename T> inline 
void Vec4T<T>::saturate()
{
	if ( x > 1 ) x = 1;
	if ( y > 1 ) y = 1;
	if ( z > 1 ) z = 1;
	if ( w > 1 ) w = 1;

	if ( x < 0 ) x = 0;
	if ( y < 0 ) y = 0;
	if ( z < 0 ) z = 0;
	if ( w < 0 ) w = 0;
}

template <typename T> inline 
void Vec4T<T>::clampZero()
{
	if ( x < 0 ) x = 0;
	if ( y < 0 ) y = 0;
	if ( z < 0 ) z = 0;
	if ( w < 0 ) w = 0;
}

template <typename T> inline 
void Vec4T<T>::clampOne()
{
	if ( x > 1 ) x = 1;
	if ( y > 1 ) y = 1;
	if ( z > 1 ) z = 1;
	if ( w > 1 ) w = 1;
}

template <typename T> inline
void Vec4T<T>::clamp(const Vec4T& low, const Vec4T& high)
{
	x = Math::Clamp(x, low.x, high.x);
	y = Math::Clamp(y, low.y, high.y);
	z = Math::Clamp(z, low.z, high.z);
	w = Math::Clamp(w, low.w, high.w);
}

template <typename T> inline 
void Vec4T<T>::floor()
{
	x = Math::Floor(x);
	y = Math::Floor(y);
	z = Math::Floor(z);
	w = Math::Floor(w);
}

template <typename T> inline 
void Vec4T<T>::ceil()
{
	x = Math::Ceil(x);
	y = Math::Ceil(y);
	z = Math::Ceil(z);
	w = Math::Ceil(w);
}

template <typename T> inline 
Vec4T<T> Vec4T<T>::midPoint(const Vec4T& vec) const
{
	return Vec4T((x + vec.x) * 0.5f, (y + vec.y) * 0.5f, (z + vec.z) * 0.5f, 1.0);
}

template <typename T> inline 
void Vec4T<T>::makeFloor(const Vec4T &cmp)
{
	x = Math::Min(x, cmp.x);
	y = Math::Min(y, cmp.y);
	z = Math::Min(z, cmp.z);
	w = Math::Min(w, cmp.w);
}

template <typename T> inline 
void Vec4T<T>::makeCeil(const Vec4T &cmp)
{
	x = Math::Max(x, cmp.x);
	y = Math::Max(y, cmp.y);
	z = Math::Max(z, cmp.z);
	w = Math::Max(w, cmp.w);
}

template <typename T> inline 
T Vec4T<T>::Dot(const Vec4T &a, const Vec4T &b)
{
	return (a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w);
}

template <typename T> inline 
Vec4T<T> Vec4T<T>::Lerp(const Vec4T &a, const Vec4T &b, const T t)
{
	return a + (b - a) * t;
}

template <typename T> inline 
Vec4T<T> Vec4T<T>::Max(const Vec4T &a, const Vec4T &b)
{
	return Vec4T((a.x > b.x ? a.x : b.x),
		(a.y > b.y ? a.y : b.y),
		(a.z > b.z ? a.z : b.z),
		(a.w > b.w ? a.w : b.w));
}

template <typename T> inline 
Vec4T<T> Vec4T<T>::Min(const Vec4T &a, const Vec4T &b)
{
	return Vec4T((a.x < b.x ? a.x : b.x),
		(a.y < b.y ? a.y : b.y),
		(a.z < b.z ? a.z : b.z),
		(a.w < b.w ? a.w : b.w));
}

template <typename T> inline 
Vec4T<T> Vec4T<T>::Inverse(const Vec4T &a)
{
	Vec4T<T> outVec = a;
	outVec.inverse();
	return outVec;
}

template <typename T> inline 
Vec4T<T> Vec4T<T>::Sqrt(const Vec4T &a)
{
	Vec4T<T> outVec = a;
	outVec.sqrt();
	return outVec;
}

template <typename T> inline 
Vec4T<T> Vec4T<T>::InvSqrt(const Vec4T &a)
{
	Vec4T<T> outVec = a;
	outVec.invSqrt();
	return outVec;
}

template <typename T> inline 
Vec4T<T> Vec4T<T>::Normalize(const Vec4T &a)
{
	Vec4T<T> outVec = a;
	outVec.normalize();
	return outVec;
}

template <typename T> inline 
Vec4T<T> Vec4T<T>::NormalizeWithLen(const Vec4T &a, T& len)
{
	Vec4T<T> outVec = a;
	len = outVec.normalizeWithLen();
	return outVec;
}

template <typename T> inline 
Vec4T<T> Vec4T<T>::Abs(const Vec4T &a)
{
	Vec4T<T> outVec = a;
	outVec.abs();
	return outVec;
}

template <typename T> inline 
Vec4T<T> Vec4T<T>::Neg(const Vec4T &a)
{
	Vec4T<T> outVec = a;
	outVec.neg();
	return outVec;
}

template <typename T> inline 
Vec4T<T> Vec4T<T>::Saturate(const Vec4T &a)
{
	Vec4T<T> outVec = a;
	outVec.saturate();
	return outVec;
}

template <typename T> inline 
Vec4T<T> operator + (const Vec4T<T> &rhs)
{
	return rhs;
}

template <typename T> inline 
Vec4T<T> operator - (const Vec4T<T> &rhs)
{
	return Vec4T<T>(-rhs.x, -rhs.y, -rhs.z, -rhs.w);
}

template <typename T> inline 
bool operator == (const Vec4T<T> &a, const Vec4T<T> &b)
{
	return (Math::IsEqual(a.x, b.x) && Math::IsEqual(a.y, b.y) && Math::IsEqual(a.z, b.z) && Math::IsEqual(a.w, b.w));
}

template <typename T> inline 
bool operator != (const Vec4T<T> &a, const Vec4T<T> &b)
{
	return (Math::IsNotEqual(a.x, b.x) || Math::IsNotEqual(a.y, b.y) || Math::IsNotEqual(a.z, b.z) || Math::IsNotEqual(a.w, b.w));
}

template <typename T> inline 
Vec4T<T> operator + (const Vec4T<T> &a, const Vec4T<T> &b)
{
	return Vec4T<T>(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
}

template <typename T> inline 
Vec4T<T> operator - (const Vec4T<T> &a, const Vec4T<T> &b)
{
	return Vec4T<T>(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
}

template <typename T> inline 
Vec4T<T> operator * (const T f, const Vec4T<T> &v)
{
	return Vec4T<T>(f * v.x, f * v.y, f * v.z, f * v.w);
}

template <typename T> inline 
Vec4T<T> operator * (const Vec4T<T> &v, const T f)
{
	return Vec4T<T>(f * v.x, f * v.y, f * v.z, f * v.w);
}

template <typename T> inline 
Vec4T<T> operator * (const Vec4T<T> a, const Vec4T<T> &b)
{
	return Vec4T<T>(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
}

template <typename T> inline 
Vec4T<T> operator / (const Vec4T<T> &a, const T f)
{
	return Vec4T<T>(a.x / f, a.y / f, a.z / f, a.w / f);
}

template <typename T> inline 
Vec4T<T> operator / (const T f, const Vec4T<T> &a)
{
	return Vec4T<T>(f / a.x, f / a.y, f / a.z, f / a.w);
}

template <typename T> inline 
Vec4T<T> operator / (const Vec4T<T> a, const Vec4T<T> &b)
{
	return Vec4T<T>(a.x / b.x, a.y / b.y, a.z / b.z, a.w / b.w);
}