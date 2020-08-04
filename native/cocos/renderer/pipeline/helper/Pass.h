#pragma once
#include "SharedMemoryPool.h"

namespace cc {
namespace pipeline {

struct CC_DLL Pass {
    SHARED_MEMORY_DATA_TYPE priority = 0;
    SHARED_MEMORY_DATA_TYPE hash = 0;
    SHARED_MEMORY_DATA_TYPE phase = 0;
};

} //namespace pipeline
} //namespace cc

