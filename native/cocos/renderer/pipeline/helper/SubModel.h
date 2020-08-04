#pragma once
#include "SharedMemoryPool.h"

namespace cc {
namespace pipeline {

struct CC_DLL SubModel {
    SHARED_MEMORY_DATA_TYPE priority = 0;
    SHARED_MEMORY_DATA_TYPE materialID = 0;
    SHARED_MEMORY_DATA_TYPE psociID = 0;
    SHARED_MEMORY_DATA_TYPE iaID = 0;
    
    SHARED_MEMORY_DATA_TYPE passesID = 0;
    SHARED_MEMORY_DATA_TYPE passesCount = 0;
};

} //namespace pipeline
} //namespace cc

