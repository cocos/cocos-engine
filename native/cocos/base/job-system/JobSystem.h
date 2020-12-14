
#if CC_JOB_SYSTEM == CC_JOB_SYSTEM_TASKFLOW
#include "job-system-taskflow/TFJobGraph.h"
#include "job-system-taskflow/TFJobSystem.h"
namespace cc {
using JobGraph = TFJobGraph;
using JobSystem = TFJobSystem;
} // namespace cc
#elif CC_JOB_SYSTEM == CC_JOB_SYSTEM_TBB
#include "job-system-tbb/TBBJobGraph.h"
#include "job-system-tbb/TBBJobSystem.h"
namespace cc {
using JobGraph = TBBJobGraph;
using JobSystem = TBBJobSystem;
} // namespace cc
#endif
