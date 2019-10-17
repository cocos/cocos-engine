#ifndef __Mat4T_H__
#define __Mat4T_H__

#include "Vec4.h"

CC_NAMESPACE_BEGIN

template <typename T> class QuatT;

/**
\brief 4x4 Matrix (column major)
*/
template <typename T>
class Mat4T
{
public:

#pragma pack(push, 1)
	union
	{
		struct
		{
			T m00, m10, m20, m30;
			T m01, m11, m21, m31;
			T m02, m12, m22, m32;
			T m03, m13, m23, m33;
		};
		
		T m[16];
	};
#pragma pack(pop)

public:
	Mat4T();
	Mat4T(	T f00, T f01, T f02, T f03,
			T f10, T f11, T f12, T f13,
			T f20, T f21, T f22, T f23,
			T f30, T f31, T f32, T f33);
	Mat4T(T *arr);
	Mat4T(const Vec3T<T>& t, const QuatT<T>& r, const Vec3T<T>& s);
	
public:
	T operator () (int i, int j) const;
	//Vec4T<T> operator [] (int row) const;
	Mat4T& operator += (const T f);
	Mat4T& operator += (const Mat4T &rhs);
	Mat4T& operator -= (const T f);
	Mat4T& operator -= (const Mat4T &rhs);
	Mat4T& operator *= (const T f);
	Mat4T& operator *= (const Mat4T &rhs);
	Mat4T& operator /= (const T f);
	
public:
	bool			isAffine() const;
	Vec3T<T>		getRowVec3(int row) const;
	Vec3T<T>		getColumnVec3(int col) const;
	Vec4T<T>		getRowVec4(int row) const;
	Vec4T<T>		getColumnVec4(int col) const;
	Vec3T<T>		transformVec3(const Vec3T<T> &vec) const;
	Vec3T<T>		transformVec3(const Vec4T<T> &vec) const;
	void			transformVec3(const Vec4T<T> &in, Vec4T<T> &out) const;
	Vec4T<T>		transformVec4(const Vec4T<T> &vec) const;
	Vec3T<T>		transformAffine(const Vec3T<T> &vec) const;
	Vec4T<T>		transformAffine(const Vec4T<T> &vec) const;
	Vec3T<T>		deltaTransformAffine(const Vec3T<T> &vec) const;
	void			recompose(const Vec3T<T>& t, const QuatT<T>& r, const Vec3T<T>& s);
	void			decompose(Vec3T<T>& t, QuatT<T>& r, Vec3T<T>& s) const;
	Vec3T<T>		decomposeTranslation() const;
	Vec3T<T>		decomposeScale() const;
	QuatT<T>		decomposeRotation() const;
	Mat4T<T>		decomposeRotationMatrix() const;
	void			copyRawDataTo(T* data, int index, bool transpose) const;
	const T*		ptr() const;
	T*				ptr();
	void			copyRawDataFrom(const T* data, int index, bool transpose);
	void			append(const Mat4T &lhs, bool mat33 = false);
	void			setRow(int row, const Vec4T<T> &vec);
	void			setColumn(int column, const Vec4T<T> &vec);
	void			setRow(int row, const Vec3T<T> &vec);
	void			setColumn(int column, const Vec3T<T> &vec);
	void			fromQuat(const QuatT<T> &quat);
	void			identity();
	void			zero();
	void			translate(T x, T y, T z);
	void			translate(const Vec3T<T> &v);
	void			makeTranslation(T x, T y, T z);
	void			makeTranslation(const Vec3T<T> &v);
	void			setTranslation(T x, T y, T z);
	void			setTranslation(const Vec3T<T> &v);
	void			translateX(T d);
	void			translateY(T d);
	void			translateZ(T d);
	void			setScale(T x, T y, T z);
	void			setScale(const Vec3T<T> &vec);
	void			rotate(const Vec3T<T> &axis, T radian);
	void			makeRotation(const Vec3T<T> &axis, T radian);
	void			rotateX(const T radian);
	void			makeRotateX(const T radian);
	void			rotateY(const T radian);
	void			makeRotateY(const T radian);
	void			rotateZ(const T radian);
	void			makeRotateZ(const T radian);
	void			scale(const Vec3T<T> &scaleVec);
	void			scale(T x, T y, T z);
	void			makeScale(const Vec3T<T> &scaleVec);
	void			makeScale(T x, T y, T z);
	void			transpose();
	void			inverse();
	void			fastInverse();
	void			clearTranslation();
	void			clearScale();
	void			clearRotation();
};

template <typename T> bool operator == (const Mat4T<T> &a, const Mat4T<T> &b);
template <typename T> bool operator != (const Mat4T<T> &a, const Mat4T<T> &b);
template <typename T> Mat4T<T> operator + (const Mat4T<T> &a, const T f);
template <typename T> Mat4T<T> operator + (const T f, const Mat4T<T> &a);
template <typename T> Mat4T<T> operator + (const Mat4T<T> &a, const Mat4T<T> &b);
template <typename T> Mat4T<T> operator - (const Mat4T<T> &a, const T f);
template <typename T> Mat4T<T> operator - (const T f, const Mat4T<T> &a);
template <typename T> Mat4T<T> operator - (const Mat4T<T> &a, const Mat4T<T> &b);
template <typename T> Vec4T<T> operator * (const Mat4T<T> &mat, const Vec4T<T> &vec);
template <typename T> Vec3T<T> operator * (const Mat4T<T> &mat, const Vec3T<T> &vec);
template <typename T> Mat4T<T> operator * (const Mat4T<T> &a, const Mat4T<T> &b);
template <typename T> Mat4T<T> operator * (const Mat4T<T> &a, const T f);
template <typename T> Mat4T<T> operator * (const T f, const Mat4T<T> &a);
template <typename T> Mat4T<T> operator / (const Mat4T<T> &mat, const T f);

typedef Mat4T<float>	Mat4;
typedef Mat4T<float>	Mat4f;
typedef Mat4T<double>	Mat4d;

CC_NAMESPACE_END

#include "Quat.h"

CC_NAMESPACE_BEGIN
#include "Mat4-inl.h"

extern  const Mat4f MAT4F_ZERO;
extern  const Mat4f MAT4F_IDENTITY;
extern  const Mat4f MAT4F_D3D2GL_PROJ;

extern  const Mat4d MAT4D_ZERO;
extern  const Mat4d MAT4D_IDENTITY;
extern  const Mat4d MAT4D_D3D2GL_PROJ;

#define MAT4_ZERO			MAT4F_ZERO
#define MAT4_IDENTITY		MAT4F_IDENTITY
#define MAT4_D3D2GL_PROJ	MAT4F_D3D2GL_PROJ

CC_NAMESPACE_END

#endif