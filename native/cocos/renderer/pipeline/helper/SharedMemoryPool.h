#pragma once
#include "core/CoreStd.h"

namespace cc {
namespace gfx {
    struct PipelineStateInfo;
    class InputAssembler;
}
namespace pipeline {
struct Model;
struct SubModel;
struct Pass;


typedef uint32_t SHARED_MEMORY_DATA_TYPE;
#define GET_SUBMODLE(index, offset) (SharedMemory::get<SubModel>(index) + offset)
#define GET_PASS(index, offset) (SharedMemory::get<Pass>(index) + offset) //get pass from material
#define GET_PSOCI(index, offset) (SharedMemory::get<gfx::PipelineStateInfo>(index) + offset)
#define GET_IA(index) (SharedMemory::get<gfx::InputAssembler>(index))

class CC_DLL SharedMemory : public Object {
public:
    template <typename Type>
    static Type* get(SHARED_MEMORY_DATA_TYPE index);
};
} //namespace pipeline
} //namespace cc

