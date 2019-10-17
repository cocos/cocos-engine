#ifndef __CC_GFXGLES3_GLES3_STD_H__
#define __CC_GFXGLES3_GLES3_STD_H__

#include <Core.h>

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
#	ifdef CC_GLES3_EXPORTS
#		define CC_GLES3_API __declspec(dllexport)
#	else
#		define CC_GLES3_API __declspec(dllimport)
#	endif
#else
#	define CC_GLES3_API
#endif

#endif
