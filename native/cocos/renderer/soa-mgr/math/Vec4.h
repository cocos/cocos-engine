#ifndef __VEC4_H__
#define __VEC4_H__

#include "Vec3.h"

CC_NAMESPACE_BEGIN

/**
\brief 1x4 Vector (row vector)
*/
template <typename T>
class Vec4T
{
public:

#pragma pack(push, 1)
	union
	{
		struct 
		{
			T x, y, z, w;
		};
		T m[4];
	};
#pragma pack(pop)

public:
	Vec4T();
	Vec4T(const T x, const T y, const T z, const T w);
	Vec4T(const T value);
	Vec4T(const Vec3T<T> &vec3, T w);

public:

	operator Vec2T<T>();
	operator Vec3T<T>();
	Vec4T& operator += (const Vec4T &rhs);
	Vec4T& operator += (const T value);
	Vec4T& operator -= (const Vec4T &rhs);
	Vec4T& operator -= (const T value);
	Vec4T& operator *= (const Vec4T &rhs);
	Vec4T& operator *= (const T value);
	Vec4T& operator /= (const Vec4T &rhs);
	Vec4T& operator /= (const T value);
	T& operator [] (int index);
	const T& operator [] (int index) const;

public:
	T				dot(const Vec4T &rhs) const;
	T				len() const;
	T				lenSqr() const;
	Vec4T<T>		midPoint(const Vec4T& vec) const;
	const T*		ptr() const;
	T*				ptr();
	void			set(T _x, T _y, T _z, T _w = 0);
	void			set(T value);
	void			set(T *p);
	void			setVec3(const Vec3T<T> &vec3, T _w = 0.0);
	Vec3T<T>		toVec3() const;
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
	void			clamp(const Vec4T& low, const Vec4T& high);
	void			floor();
	void			ceil();
	void			makeFloor(const Vec4T &cmp);
	void			makeCeil(const Vec4T &cmp);

public:
	static T		Dot(const Vec4T &a, const Vec4T &b);
	static Vec4T<T>	Lerp(const Vec4T &a, const Vec4T &b, const T t);
	static Vec4T<T>	Max(const Vec4T &a, const Vec4T &b);
	static Vec4T<T>	Min(const Vec4T &a, const Vec4T &b);
	static Vec4T<T>	Inverse(const Vec4T &a);
	static Vec4T<T>	Sqrt(const Vec4T &a);
	static Vec4T<T>	InvSqrt(const Vec4T &a);
	static Vec4T<T>	Normalize(const Vec4T &a);
	static Vec4T<T>	NormalizeWithLen(const Vec4T &a, T& len);
	static Vec4T<T>	Abs(const Vec4T &a);
	static Vec4T<T>	Neg(const Vec4T &a);
	static Vec4T<T>	Saturate(const Vec4T &a);
};

template <typename T> bool operator == (const Vec4T<T> &a, const Vec4T<T> &b);
template <typename T> bool operator != (const Vec4T<T> &a, const Vec4T<T> &b);
template <typename T> Vec4T<T> operator + (const Vec4T<T> &rhs);
template <typename T> Vec4T<T> operator - (const Vec4T<T> &rhs);
template <typename T> Vec4T<T> operator + (const Vec4T<T> &a, const Vec4T<T> &b);
template <typename T> Vec4T<T> operator - (const Vec4T<T> &a, const Vec4T<T> &b);
template <typename T> Vec4T<T> operator * (const T f, const Vec4T<T> &v);
template <typename T> Vec4T<T> operator * (const Vec4T<T> &v, const T f);
template <typename T> Vec4T<T> operator * (const Vec4T<T> a, const Vec4T<T> &b);
template <typename T> Vec4T<T> operator / (const Vec4T<T> &a, const T f);
template <typename T> Vec4T<T> operator / (const Vec4T<T> a, const Vec4T<T> &b);

#include "Vec4-inl.h"

typedef Vec4T<float>		Vec4;
typedef Vec4T<Bool>			Vec4b;
typedef Vec4T<ui8>			Vec4ui8;
typedef Vec4T<i32>			Vec4i;
typedef Vec4T<ui32>			Vec4ui;
typedef Vec4T<float>		Vec4f;
typedef Vec4T<double>		Vec4d;

extern  const Vec4i VEC4I_ZERO;
extern  const Vec4i VEC4I_ONE;
extern  const Vec4i VEC4I_NEG_ONE;
extern  const Vec4i VEC4I_UNIT_X;
extern  const Vec4i VEC4I_UNIT_Y;
extern  const Vec4i VEC4I_UNIT_Z;
extern  const Vec4i VEC4I_UNIT_W;
extern  const Vec4i VEC4I_NEG_UNIT_X;
extern  const Vec4i VEC4I_NEG_UNIT_Y;
extern  const Vec4i VEC4I_NEG_UNIT_Z;
extern  const Vec4i VEC4I_NEG_UNIT_W;

extern  const Vec4ui VEC4UI_ZERO;
extern  const Vec4ui VEC4UI_ONE;
extern  const Vec4ui VEC4UI_UNIT_X;
extern  const Vec4ui VEC4UI_UNIT_Y;

extern  const Vec4f VEC4F_ZERO;
extern  const Vec4f VEC4F_ONE;
extern  const Vec4f VEC4F_NEG_ONE;
extern  const Vec4f VEC4F_UNIT_X;
extern  const Vec4f VEC4F_UNIT_Y;
extern  const Vec4f VEC4F_UNIT_Z;
extern  const Vec4f VEC4F_NEG_UNIT_X;
extern  const Vec4f VEC4F_NEG_UNIT_Y;
extern  const Vec4f VEC4F_NEG_UNIT_Z;
extern  const Vec4f VEC4F_INVALID;

extern  const Vec4d VEC4D_ZERO;
extern  const Vec4d VEC4D_ONE;
extern  const Vec4d VEC4D_NEG_ONE;
extern  const Vec4d VEC4D_UNIT_X;
extern  const Vec4d VEC4D_UNIT_Y;
extern  const Vec4d VEC4D_UNIT_Z;
extern  const Vec4d VEC4D_NEG_UNIT_X;
extern  const Vec4d VEC4D_NEG_UNIT_Y;
extern  const Vec4d VEC4D_NEG_UNIT_Z;
extern  const Vec4d VEC4D_INVALID;

#define VEC4_ZERO			VEC4F_ZERO
#define VEC4_ONE			VEC4F_ONE
#define VEC4_NEG_ONE		VEC4F_NEG_ONE
#define VEC4_UNIT_X			VEC4F_UNIT_X
#define VEC4_UNIT_Y			VEC4F_UNIT_Y
#define VEC4_UNIT_Z			VEC4F_UNIT_Z
#define VEC4_NEG_UNIT_X		VEC4F_NEG_UNIT_X
#define VEC4_NEG_UNIT_Y		VEC4F_NEG_UNIT_Y
#define VEC4_NEG_UNIT_Z		VEC4F_NEG_UNIT_Z
#define VEC4_INVALID		VEC4F_INVALID

CC_NAMESPACE_END

#endif