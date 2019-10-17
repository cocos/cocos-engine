#include "../Core/CoreStd.h"
#include "Quat.h"

CC_NAMESPACE_BEGIN

const Quatf QUATF_ZERO(0.0f, 0.0f, 0.0f, 0.0f);
const Quatf QUATF_ONE(1.0f, 1.0f, 1.0f, 1.0f);
const Quatf QUATF_IDENTITY(1.0f, 0.0f, 0.0f, 0.0f);

const Quatd QUATD_ZERO(0.0, 0.0, 0.0, 0.0);
const Quatd QUATD_ONE(1.0, 1.0, 1.0, 1.0);
const Quatd QUATD_IDENTITY(1.0, 0.0, 0.0, 0.0);

/*
// This version of slerp, used by squad, does not check for theta > 180.
QuatT QuatSlerpNoInvert(const QuatT &q1, const QuatT &q2, Real t)
{
	Real dot = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
	QuatT qsuatT;

	if (dot > -0.95f && dot < 0.95f)
	{
		Real angle = Math::ACos(dot);
		Real sina, sinat, sinaomt;
		sina = Math::Sin(angle);
		sinat = Math::Sin(angle * t);
		sinaomt = Math::Sin(angle * (1 - t));
		quatT = (q1 * sinaomt + q2 * sinat) / sina;
	}
	
	//if the angle is small, use linear interpolation
	else
		quatT.lerp(q1, q2, t);

	return quatT;
}
*/

CC_NAMESPACE_END
