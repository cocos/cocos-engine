// include order matters: multiple EMSCRIPTEN_BINDINGS(ModuleName){...} defines static objects,
// which initialized by defined order, thus have a influence on the final initialization order in js glue code(emscripten internal implementation),
// which may cause Unbound-Type-Error.

// clang-format off
#include "WasmDefine.h"
#include "LayoutGraphWasm.h"
#include "RenderCommonWasm.h"
#include "RenderGraphWasm.h"
#include "RenderInterfaceWasm.h"
// clang-format on

// float cc::render::GlobalVar::CumulativeTime{0.0F};
// float cc::render::GlobalVar::FrameTime{0.0F};
// uint32_t cc::render::GlobalVar::TotalFrames{0U};

// EMSCRIPTEN_BINDINGS(COMMON_WASM_EXPORT) {
//     emscripten::class_<cc::render::GlobalVar>("GlobalVar")
//         .class_property("CumulativeTime", &cc::render::GlobalVar::CumulativeTime)
//         .class_property("FrameTime", &cc::render::GlobalVar::FrameTime)
//         .class_property("TotalFrames", &cc::render::GlobalVar::TotalFrames);
// };
