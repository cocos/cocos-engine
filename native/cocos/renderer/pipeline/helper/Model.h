#pragma once
#include "SharedMemoryPool.h"

namespace cc {
namespace pipeline {

struct CC_DLL Model {
    SHARED_MEMORY_DATA_TYPE isDynamicBatching = 0;
    
    SHARED_MEMORY_DATA_TYPE subModelsCount = 0;
    SHARED_MEMORY_DATA_TYPE subModelsID = 0;
};

} //namespace pipeline
} // namespace cc

