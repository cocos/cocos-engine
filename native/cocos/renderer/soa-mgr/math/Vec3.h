#ifndef __VEC3_H__
#define __VEC3_H__

#include "Vec2.h"

CC_NAMESPACE_BEGIN

template <typename T> class QuatT;

// 1x3 Vector (row vector)
template <typename T>
class Vec3T
{
public:

#pragma pack(push, 1)
	union
	{
		struct 
		{
			T x, y, z;
		};

		T m[3];
	};
#pragma pack(pop)

public:
	Vec3T();
	Vec3T(const T x, const T y, const T z);
	Vec3T(const Vec2T<T> &vec, T z);

public:

	operator Vec2T<T>();
	Vec3T& operator += (const Vec3T &rhs);
	Vec3T& operator -= (const Vec3T &rhs);
	Vec3T& operator *= (const T value);
	Vec3T& operator /= (const T value);
	T& operator [] (int index);
	const T& operator [] (int index) const;
	bool operator < (const Vec3T &rhs) const;
	bool operator <= (const Vec3T &rhs) const;
	bool operator > (const Vec3T &rhs) const;
	bool operator >= (const Vec3T &rhs) const;

public:
	T				dot(const Vec3T& rhs) const;
	Vec3T<T>		cross(const Vec3T& rhs) const;
	T				len() const;
	T				lenSqr() const;
	bool			isZeroLength() const;
	Vec3T<T>		midPoint(const Vec3T& vec) const;
	Vec3T<T>		randomDeviant(const T& angle, const Vec3T& up /*= Vec3T<T>(0, 0, 0)*/) const;
	QuatT<T>		getRotationTo(const Vec3T& dest, const Vec3T& fallbackAxis) const;
	Vec3T<T>		perpendicular() const;
	const T*		ptr() const;
	T*				ptr();
	void			set(T _x, T _y, T _z);
	void			set(T *p);
	void			setVec2(const Vec2T<T>& vec2, T _z = 0);
	void			zero();
	void			one();
	void			inverse();
	void			sqrt();
	void			invSqrt();
	void			normalize();
	T				normalizeWithLen();
	void			abs();
	void			neg();
	void			saturate();
	void			clampZero();
	void			clampOne();
	void			floor();
	void			ceil();
	void			makeFloor(const Vec3T &cmp);
	void			makeCeil(const Vec3T &cmp);
	void			print();
	//QuanT			getRotationTo(const Vec3 &dest, const Vec3 &fallbackAxis = Vec3(0, 0, 0))) const;

public:
	static T		Dot(const Vec3T &a, const Vec3T &b);
	static Vec3T<T>	Cross(const Vec3T &a, const Vec3T &b);
	static Vec3T<T>	Lerp(const Vec3T &a, const Vec3T &b, const T t);
	static Vec3T<T>	Max(const Vec3T &a, const Vec3T &b);
	static Vec3T<T>	Min(const Vec3T &a, const Vec3T &b);
	static Vec3T<T>	Inverse(const Vec3T &a);
	static Vec3T<T>	Sqrt(const Vec3T &a);
	static Vec3T<T>	InvSqrt(const Vec3T &a);
	static Vec3T<T>	Normalize(const Vec3T &a);
	static Vec3T<T>	NormalizeWithLen(const Vec3T &a, T& len);
	static Vec3T<T>	Abs(const Vec3T &a);
	static Vec3T<T>	Neg(const Vec3T &a);
	static Vec3T<T>	Saturate(const Vec3T &a);
};

template <typename T> bool operator == (const Vec3T<T> &a, const Vec3T<T> &b);
template <typename T> bool operator != (const Vec3T<T> &a, const Vec3T<T> &b);
template <typename T> Vec3T<T> operator + (const Vec3T<T> &rhs);
template <typename T> Vec3T<T> operator - (const Vec3T<T> &rhs);
template <typename T> Vec3T<T> operator + (const Vec3T<T> &a, const Vec3T<T> &b);
template <typename T> Vec3T<T> operator + (const Vec3T<T> &a, float f);
template <typename T> Vec3T<T> operator + (float f, const Vec3T<T> &a);
template <typename T> Vec3T<T> operator - (const Vec3T<T> &a, const Vec3T<T> &b);
template <typename T> Vec3T<T> operator - (const Vec3T<T> &a, float f);
template <typename T> Vec3T<T> operator - (float f, const Vec3T<T> &a);
template <typename T> Vec3T<T> operator * (const T f, const Vec3T<T> &v);
template <typename T> Vec3T<T> operator * (const Vec3T<T> &v, const T f);
template <typename T> Vec3T<T> operator * (const Vec3T<T> a, const Vec3T<T> &b);
template <typename T> Vec3T<T> operator / (const Vec3T<T> &a, const T f);
template <typename T> Vec3T<T> operator / (const T f, const Vec3T<T> &a);
template <typename T> Vec3T<T> operator / (const Vec3T<T> a, const Vec3T<T> &b);

#include "Vec3-inl.h"

typedef Vec3T<float>		Vec3;
typedef Vec3T<Bool>			Vec3b;
typedef Vec3T<ui8>			Vec3ui8;
typedef Vec3T<i32>			Vec3i;
typedef Vec3T<ui32>			Vec3ui;
typedef Vec3T<float>		Vec3f;
typedef Vec3T<double>		Vec3d;

extern  const Vec3i VEC3I_ZERO;
extern  const Vec3i VEC3I_ONE;
extern  const Vec3i VEC3I_NEG_ONE;
extern  const Vec3i VEC3I_UNIT_X;
extern  const Vec3i VEC3I_UNIT_Y;
extern  const Vec3i VEC3I_UNIT_Z;
extern  const Vec3i VEC3I_NEG_UNIT_X;
extern  const Vec3i VEC3I_NEG_UNIT_Y;
extern  const Vec3i VEC3I_NEG_UNIT_Z;

extern  const Vec3ui VEC3UI_ZERO;
extern  const Vec3ui VEC3UI_ONE;
extern  const Vec3ui VEC3UI_UNIT_X;
extern  const Vec3ui VEC3UI_UNIT_Y;

extern  const Vec3f VEC3F_ZERO;
extern  const Vec3f VEC3F_ONE;
extern  const Vec3f VEC3F_NEG_ONE;
extern  const Vec3f VEC3F_UNIT_X;
extern  const Vec3f VEC3F_UNIT_Y;
extern  const Vec3f VEC3F_UNIT_Z;
extern  const Vec3f VEC3F_NEG_UNIT_X;
extern  const Vec3f VEC3F_NEG_UNIT_Y;
extern  const Vec3f VEC3F_NEG_UNIT_Z;
extern  const Vec3f VEC3F_INVALID;

extern  const Vec3d VEC3D_ZERO;
extern  const Vec3d VEC3D_ONE;
extern  const Vec3d VEC3D_NEG_ONE;
extern  const Vec3d VEC3D_UNIT_X;
extern  const Vec3d VEC3D_UNIT_Y;
extern  const Vec3d VEC3D_UNIT_Z;
extern  const Vec3d VEC3D_NEG_UNIT_X;
extern  const Vec3d VEC3D_NEG_UNIT_Y;
extern  const Vec3d VEC3D_NEG_UNIT_Z;
extern  const Vec3d VEC3D_INVALID;

#define VEC3_ZERO			VEC3F_ZERO
#define VEC3_ONE			VEC3F_ONE
#define VEC3_NEG_ONE		VEC3F_NEG_ONE
#define VEC3_UNIT_X			VEC3F_UNIT_X
#define VEC3_UNIT_Y			VEC3F_UNIT_Y
#define VEC3_UNIT_Z			VEC3F_UNIT_Z
#define VEC3_NEG_UNIT_X		VEC3F_NEG_UNIT_X
#define VEC3_NEG_UNIT_Y		VEC3F_NEG_UNIT_Y
#define VEC3_NEG_UNIT_Z		VEC3F_NEG_UNIT_Z
#define VEC3_INVALID		VEC3F_INVALID

CC_NAMESPACE_END

#endif