#ifndef __QUAT_H__
#define __QUAT_H__

#include "MathLib.h"
#include "Mat4.h"

CC_NAMESPACE_BEGIN

template <typename T> class Vec3T;
template <typename T> class Vec4T;
template <typename T> class Mat4T;

/**
\brief Quaternion
*/
template <typename T>
class QuatT
{
public:

#pragma pack(push, 1)
	union
	{
		struct 
		{
			T w, x, y, z;
		};

		T m[4];
	};
#pragma pack(pop)

public:
	QuatT();
	QuatT(const T* pf);
	QuatT(const T w, const T x, const T y, const T z);
	QuatT(const Vec3T<T>& vAixs, T radian);

public:
	T& operator [] (int index);
	const T& operator [] (int index) const;	
	operator T* ();
	operator const T* () const;
	QuatT& operator += (const QuatT& q);
	QuatT& operator -= (const QuatT& q);
	QuatT& operator *= (const QuatT& q);
	QuatT& operator *= (T rhs);
	QuatT& operator /= (T rhs);

public:
	T				dot(const QuatT& rhs) const;
	QuatT<T>		cross(const QuatT& rhs) const;
	Mat4T<T>		toMat4() const;
	Vec3T<T>		rotateVec3(const Vec3T<T>& vec) const;
	T				len() const;
	T				lenSqr() const;
	Vec3T<T>		toAxisAngle(T& radian) const;
	Vec3T<T>		toAxisX() const;
	Vec3T<T>		toAxisY() const;
	Vec3T<T>		toAxisZ() const;
	T				getYaw() const;
	T				getPitch() const;
	T				getRoll() const;
	void			toEulerAngle(T &pitch, T &yaw, T &roll) const;
	void			toEulerRadian(T &pitch, T &yaw, T &roll) const;
	void			toAxes(Vec3T<T> &xAxis, Vec3T<T> &yAxis, Vec3T<T> &zAxis) const;
	const T*		ptr() const;
	T*				ptr();
	void			set(T _w, T _x, T _y, T _z);
	void			set(T value);
	void			set(T *p);
	void			fromAngleAxis(const T& rfAngle, const Vec3T<T>& rkAxis);
	void			fromMat4(const Mat4T<T>& mat);
	void			fromVec3ToVec3(const Vec3T<T>& from, const Vec3T<T>& to);
	void			fromAxes(const Vec3T<T> &xAxis, const Vec3T<T> &yAxis, const Vec3T<T> &zAxis);
	void			fromEulerAngle(T pitch, T yaw, T roll);
	void			fromRotateAxis(const Vec3T<T>& axis, T radian);
	void			conjugate();
	void			inverse();
	void			identity();
	void			zero();
	void			log();
	void			exp();
	void			pow(T fExp);
	void			normalize();
	void			diff(const QuatT& q1, const QuatT& q2);
	void			abs();
	void			neg();

public:
	static QuatT<T>		Log(const QuatT &quat);
	static QuatT<T>		Exp(const QuatT &quat);
	static QuatT<T>		Pow(const QuatT &quat, T fExp);
	
	/** Performs Normalised linear interpolation between two quaternions, and returns the result.
	 Lerp ( 0.0f, A, B ) = A
	 Lerp ( 1.0f, A, B ) = B
	 @remarks
	 Nlerp is faster than Slerp.
	 Nlerp has the proprieties of being commutative (@see Slerp;
	 commutativity is desired in certain places, like IK animation), and
	 being torque-minimal (unless shortestPath=false). However, it's performing
	 the interpolation at non-constant velocity; sometimes this is desired,
	 sometimes it is not. Having a non-constant velocity can produce a more
	 natural rotation feeling without the need of tweaking the weights; however
	 if your scene relies on the timing of the rotation or assumes it will point
	 at a specific angle at a specific weight value, Slerp is a better choice.
	 */
	static QuatT<T>		Lerp(const QuatT& q1, const QuatT& q2, T t, bool bShortestPath = false);
	
	/** Performs Spherical linear interpolation between two quaternions, and returns the result.
	 Slerp ( 0.0f, A, B ) = A
	 Slerp ( 1.0f, A, B ) = B
	 @return Interpolated quaternion
	 @remarks
	 Slerp has the proprieties of performing the interpolation at constant
	 velocity, and being torque-minimal (unless shortestPath=false).
	 However, it's NOT commutative, which means
	 Slerp ( 0.75f, A, B ) != Slerp ( 0.25f, B, A );
	 therefore be careful if your code relies in the order of the operands.
	 This is specially important in IK animation.
	 */
	static QuatT<T>		Slerp(const QuatT& q1, const QuatT& q2, T t, bool bShortestPath = false);

	// spherical quadratic interpolation
	static QuatT<T>		Squad(const QuatT& q1, const QuatT& q2, const QuatT& a, const QuatT& b, T t, bool bShortestPath = false);

	static QuatT<T>		Spline(const QuatT& q1, const QuatT& q2, const QuatT& q3);
};

template <typename T> bool operator == (const QuatT<T>& a, const QuatT<T>& b);
template <typename T> bool operator != (const QuatT<T>& a, const QuatT<T>& b);
template <typename T> QuatT<T> operator + (const QuatT<T>& rhs);
template <typename T> QuatT<T> operator - (const QuatT<T>& rhs);
template <typename T> QuatT<T> operator + (const QuatT<T>& a, const QuatT<T>& b);
template <typename T> QuatT<T> operator - (const QuatT<T>& a, const QuatT<T>& b);
template <typename T> QuatT<T> operator * (const T f, const QuatT<T>& q);
template <typename T> QuatT<T> operator * (const QuatT<T>& q, const T f);
template <typename T> QuatT<T> operator * (const QuatT<T>& a, const QuatT<T>& b);
template <typename T> Vec3T<T> operator * (const QuatT<T>& q, const Vec3T<T>& v);
template <typename T> Vec4T<T> operator * (const QuatT<T>& q, const Vec4T<T>& v);
template <typename T> QuatT<T> operator / (const QuatT<T>& a, const T f);
template <typename T> QuatT<T> operator / (const T f, const QuatT<T>& a);

#include "Quat-inl.h"

typedef QuatT<float>	Quat;
typedef QuatT<float>	Quatf;
typedef QuatT<double>	Quatd;

extern  const Quatf QUATF_ZERO;
extern  const Quatf QUATF_ONE;
extern  const Quatf QUATF_IDENTITY;

extern  const Quatd QUATD_ZERO;
extern  const Quatd QUATD_ONE;
extern  const Quatd QUATD_IDENTITY;

#define QUAT_ZERO		QUATF_ZERO
#define QUAT_ONE		QUATF_ONE
#define QUAT_IDENTITY	QUATF_IDENTITY

CC_NAMESPACE_END

#endif
