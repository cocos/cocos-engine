#include "Core/CoreStd.h"
#include "SoAMathLib.h"

CC_NAMESPACE_BEGIN

namespace SoAMath
{

const SoAFloat HALF					= 0.5f;
const SoAFloat ONE					= 1.0f;
const SoAFloat THREE				= 3.0f;
const SoAFloat NEG_ONE				= -1.0f;
const SoAFloat PI					= (float)(3.14159265358979323846264338327950288419716939937511);
const SoAFloat PI_2					= PI * 2.0f;
const SoAFloat ONE_DIV_2PI			= 1.0f / PI_2;
const SoAFloat EPSILON				= 1e-6f;
const SoAFloat EPSILON_SQR			= 1e-12f;
const SoAFloat ONE_MINUS_EPSILON	= 1 - 1e-6f;
const SoAFloat MIN_FLOAT			= 1.175494351e-38F;
const SoAFloat INF_FLOAT				= KSTD::numeric_limits<float>::infinity();

}

CC_NAMESPACE_END
