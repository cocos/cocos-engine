#include "../Core/CoreStd.h"
#include "Vec3.h"

CC_NAMESPACE_BEGIN

const Vec3i VEC3I_ZERO(0, 0, 0);
const Vec3i VEC3I_ONE(1, 1, 1);
const Vec3i VEC3I_NEG_ONE(-1, -1, -1);
const Vec3i VEC3I_UNIT_X(1, 0, 0);
const Vec3i VEC3I_UNIT_Y(0, 1, 0);
const Vec3i VEC3I_UNIT_Z(0, 0, 1);
const Vec3i VEC3I_NEG_UNIT_X(-1, 0, 0);
const Vec3i VEC3I_NEG_UNIT_Y(0, -1, 0);
const Vec3i VEC3I_NEG_UNIT_Z(0, 0, -1);

const Vec3ui VEC3UI_ZERO(0, 0, 0);
const Vec3ui VEC3UI_ONE(1, 1, 1);
const Vec3ui VEC3UI_UNIT_X(1, 0, 0);
const Vec3ui VEC3UI_UNIT_Y(0, 1, 0);
const Vec3ui VEC3UI_UNIT_Z(0, 0, 1);

const Vec3f VEC3F_ZERO(0.0f, 0.0f, 0.0f);
const Vec3f VEC3F_ONE(1.0f, 1.0f, 1.0f);
const Vec3f VEC3F_NEG_ONE(-1.0f, -1.0f, -1.0f);
const Vec3f VEC3F_UNIT_X(1.0f, 0.0f, 0.0f);
const Vec3f VEC3F_UNIT_Y(0.0f, 1.0f, 0.0f);
const Vec3f VEC3F_UNIT_Z(0.0f, 0.0f, 1.0f);
const Vec3f VEC3F_NEG_UNIT_X(-1.0f, 0.0f, 0.0f);
const Vec3f VEC3F_NEG_UNIT_Y(0.0f, -1.0f, 0.0f);
const Vec3f VEC3F_NEG_UNIT_Z(0.0f, 0.0f, -1.0f);
const Vec3f VEC3F_INVALID(Math::MAX_FLOAT, Math::MAX_FLOAT, Math::MAX_FLOAT);

const Vec3d VEC3D_ZERO(0.0, 0.0, 0.0);
const Vec3d VEC3D_ONE(1.0, 1.0, 1.0);
const Vec3d VEC3D_NEG_ONE(-1.0, -1.0, -1.0);
const Vec3d VEC3D_UNIT_X(1.0, 0.0, 0.0);
const Vec3d VEC3D_UNIT_Y(0.0, 1.0, 0.0);
const Vec3d VEC3D_UNIT_Z(0.0, 0.0, 1.0);
const Vec3d VEC3D_NEG_UNIT_X(-1.0, 0.0, 0.0);
const Vec3d VEC3D_NEG_UNIT_Y(0.0, -1.0, 0.0);
const Vec3d VEC3D_NEG_UNIT_Z(0.0, 0.0, -1.0);
const Vec3d VEC3D_INVALID(Math::MAX_DOUBLE, Math::MAX_DOUBLE, Math::MAX_DOUBLE);

#if 0
// predefined specific vectors
const Vec3 Vec3::ZERO(0, 0, 0);
const Vec3 Vec3::ONE(1, 1, 1);
const Vec3 Vec3::UNIT_X(1, 0, 0);
const Vec3 Vec3::UNIT_Y(0, 1, 0);
const Vec3 Vec3::UNIT_Z(0, 0, 1);
const Vec3 Vec3::NEG_UNIT_X(-1, 0, 0);
const Vec3 Vec3::NEG_UNIT_Y(0, -1, 0);
const Vec3 Vec3::NEG_UNIT_Z(0, 0, -1);
const Vec3 Vec3::INVALID(Math::MAX_REAL, Math::MAX_REAL, Math::MAX_REAL);

QuanT Vec3::getRotationTo(const Vec3& dest, const Vec3& fallbackAxis) const
{
	// Based on Stan Melax's article in Game Programming Gems
	QuanT q;
	// Copy, since cannot modify local
	Vec3 v0 = *this;
	Vec3 v1 = dest;
	v0.normalize();
	v1.normalize();

	Real d = v0.dot(v1);
	// If dot == 1, vectors are the same
	if (d >= 1.0f)
	{
		return QuanT::IDENTITY;
	}
	if (d < (1e-6f - 1.0f))
	{
		if (fallbackAxis != Vec3::ZERO)
		{
			// rotate 180 degrees about the fallback axis
			q.fromRotateAxis(fallbackAxis, Math::PI);
		}
		else
		{
			// Generate an axis
			Vec3 axis = Vec3::UNIT_X.cross(*this);
			if (axis.isZeroLength()) // pick another if colinear
				axis = Vec3::UNIT_Y.cross(*this);
			axis.normalize();
			q.fromRotateAxis(axis, Math::PI);
		}
	}
	else
	{
		Real s = Math::Sqrt( (1+d)*2 );
		Real invs = 1 / s;

		Vec3 c = v0.cross(v1);

		q.x = c.x * invs;
		q.y = c.y * invs;
		q.z = c.z * invs;
		q.w = s * 0.5f;
		q.normalize();
	}
	return q;
}
#endif

CC_NAMESPACE_END
