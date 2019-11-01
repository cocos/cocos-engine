#ifndef __CORESTD_H__
#define __CORESTD_H__

#include "CoreDef.h"

#if defined(_WIN32)
#ifndef WIN32_LEAN_AND_MEAN
#   define WIN32_LEAN_AND_MEAN
#endif
#if !defined(NOMINMAX) && defined(_MSC_VER)
#   define NOMINMAX // required to stop windows.h messing up std::min
#endif
#   include <Windows.h>
#endif

// STD including
#ifndef __MFC_FRAME_WORK__
#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>  
#include <wchar.h>
#include <math.h>
#include <float.h>
//#include <assert.h>
#include <time.h>
#endif

#include <array>
#include <string>
#include <vector>
#include <list>
#include <queue>
#include <deque>
#include <set>
#include <map>
#include <unordered_map>
#include <algorithm>
#include <exception>
#include <functional>

#define KSTD std


#include <cmath>
#include <atomic>
#include <mutex>

// Data Type define
#include "TypeDef.h"
/*#include "memory/KartMemory.h"
#include "kernel/MemObject.h"
#include "kernel/Log.h"
#include "util/Assertion.h"
#include "util/Singleton.h"
#include "util/SpinMutex.h"*/

#endif
