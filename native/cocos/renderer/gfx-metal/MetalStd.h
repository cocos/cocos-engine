#pragma once

#include <Core.h>

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
#	ifdef CC_METAL_EXPORTS
#		define CC_MTL_API __declspec(dllexport)
#	else
#		define CC_MTL_API __declspec(dllimport)
#	endif
#else
#	define CC_MTL_API
#endif
