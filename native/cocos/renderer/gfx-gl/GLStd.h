#ifndef __CC_GLSTD_H__
#define __CC_GLSTD_H__

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
#	ifdef CC_GL_EXPORTS
#		define CC_GL_API __declspec(dllexport)
#	else
#		define CC_GL_API __declspec(dllimport)
#	endif

#	include "gl/glew.h"
#else
#	define CC_GL_API
#endif

#endif