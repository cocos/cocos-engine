#ifndef __VEC2_H__
#define __VEC2_H__

#include "MathLib.h"

CC_NAMESPACE_BEGIN

// 1x2 Vector (row vector)
template <typename T>
class Vec2T
{
public:

#pragma pack(push, 1)
	union
	{
		struct 
		{
			T x, y;
		};

		T m[2];
	};
#pragma pack(pop)

public:
	Vec2T();
	Vec2T(const T x, const T y);

public:
	Vec2T& operator += (const Vec2T &rhs);
	Vec2T& operator -= (const Vec2T &rhs);
	Vec2T& operator *= (const T rhs);
	Vec2T& operator /= (const T rhs);
	T& operator [] (int index);
	const T& operator [] (int index) const;
	bool operator < (const Vec2T &rhs) const;
	bool operator <= (const Vec2T &rhs) const;
	bool operator > (const Vec2T &rhs) const;
	bool operator >= (const Vec2T &rhs) const;

public:
	T				dot(const Vec2T &rhs) const;
	T				cross(const Vec2T &rhs) const;
	T				len() const;
	T				lenSqr() const;
	Vec2T<T>		midPoint(const Vec2T &vec) const;
	Vec2T<T>		perpendicular() const;
	const T*		ptr() const;
	T*				ptr();
	void			set(T _x, T _y);
	void			set(T *p);
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
	void			clamp(const Vec2T& low, const Vec2T& high);
	void			floor();
	void			ceil();
	void			makeFloor(const Vec2T &cmp);
	void			makeCeil(const Vec2T &cmp);
	void			rotate(float radian);

public:
	static T		Dot(const Vec2T &a, const Vec2T &b);
	static T		Cross(const Vec2T &a, const Vec2T &b);
	static Vec2T<T>	Lerp(const Vec2T &a, const Vec2T &b, const T t);
	static Vec2T<T>	Max(const Vec2T &a, const Vec2T &b);
	static Vec2T<T>	Min(const Vec2T &a, const Vec2T &b);
	static Vec2T<T>	Inverse(const Vec2T &a);
	static Vec2T<T>	Sqrt(const Vec2T &a);
	static Vec2T<T>	InvSqrt(const Vec2T &a);
	static Vec2T<T>	Normalize(const Vec2T &a);
	static Vec2T<T>	NormalizeWithLen(const Vec2T &a, T& len);
	static Vec2T<T>	Abs(const Vec2T &a);
	static Vec2T<T>	Neg(const Vec2T &a);
	static Vec2T<T>	Saturate(const Vec2T &a);
};

template <typename T> bool operator == (const Vec2T<T> &a, const Vec2T<T> &b);
template <typename T> bool operator != (const Vec2T<T> &a, const Vec2T<T> &b);
template <typename T> Vec2T<T> operator + (const Vec2T<T> &rhs);
template <typename T> Vec2T<T> operator - (const Vec2T<T> &rhs);
template <typename T> Vec2T<T> operator + (const Vec2T<T> &a, const Vec2T<T> &b);
template <typename T> Vec2T<T> operator - (const Vec2T<T> &a, const Vec2T<T> &b);
template <typename T> Vec2T<T> operator * (const T f, const Vec2T<T> &v);
template <typename T> Vec2T<T> operator * (const Vec2T<T> &v, const T f);
template <typename T> Vec2T<T> operator * (const Vec2T<T> a, const Vec2T<T> &b);
template <typename T> Vec2T<T> operator / (const Vec2T<T> &a, const T f);
template <typename T> Vec2T<T> operator / (const T f, const Vec2T<T> &a);
template <typename T> Vec2T<T> operator / (const Vec2T<T> a, const Vec2T<T> &b);

#include "Vec2-inl.h"

typedef Vec2T<float>		Vec2;
typedef Vec2T<Bool>			Vec2b;
typedef Vec2T<i32>			Vec2i;
typedef Vec2T<ui32>			Vec2ui;
typedef Vec2T<float>		Vec2f;
typedef Vec2T<double>		Vec2d;

extern  const Vec2i VEC2I_ZERO;
extern  const Vec2i VEC2I_ONE;
extern  const Vec2i VEC2I_NEG_ONE;
extern  const Vec2i VEC2I_UNIT_X;
extern  const Vec2i VEC2I_UNIT_Y;
extern  const Vec2i VEC2I_NEG_UNIT_X;
extern  const Vec2i VEC2I_NEG_UNIT_Y;

extern  const Vec2ui VEC2UI_ZERO;
extern  const Vec2ui VEC2UI_ONE;
extern  const Vec2ui VEC2UI_UNIT_X;
extern  const Vec2ui VEC2UI_UNIT_Y;

extern  const Vec2f VEC2F_ZERO;
extern  const Vec2f VEC2F_ONE;
extern  const Vec2f VEC2F_NEG_ONE;
extern  const Vec2f VEC2F_UNIT_X;
extern  const Vec2f VEC2F_UNIT_Y;
extern  const Vec2f VEC2F_NEG_UNIT_X;
extern  const Vec2f VEC2F_NEG_UNIT_Y;
extern  const Vec2f VEC2F_INVALID;

extern  const Vec2d VEC2D_ZERO;
extern  const Vec2d VEC2D_ONE;
extern  const Vec2d VEC2D_NEG_ONE;
extern  const Vec2d VEC2D_UNIT_X;
extern  const Vec2d VEC2D_UNIT_Y;
extern  const Vec2d VEC2D_NEG_UNIT_X;
extern  const Vec2d VEC2D_NEG_UNIT_Y;
extern  const Vec2d VEC2D_INVALID;

#define VEC2_ZERO			VEC2F_ZERO
#define VEC2_ONE			VEC2F_ONE
#define VEC2_NEG_ONE		VEC2F_NEG_ONE
#define VEC2_UNIT_X			VEC2F_UNIT_X
#define VEC2_UNIT_Y			VEC2F_UNIT_Y
#define VEC2_NEG_UNIT_X		VEC2F_NEG_UNIT_X
#define VEC2_NEG_UNIT_Y		VEC2F_NEG_UNIT_Y
#define VEC2_INVALID		VEC2F_INVALID

CC_NAMESPACE_END

#endif