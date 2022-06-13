#pragma once

#include "plugins/bus/EventBus.h"

#if _WIN32
    #define CC_PLUGIN_DLL_EXPORT __declspec(dllexport)
#endif

extern "C" void cc_load_all_plugins(); //NOLINT

#if CC_PLUGIN_STATIC
    #define CC_PLUGIN_ENTRY(name, load_func)                   \
        extern "C" void cc_load_plugin_##name() { /* NOLINT */ \
            load_func();                                       \
        }
#else
    #define CC_PLUGIN_ENTRY(name, load_func)                 \
        extern "C" CC_PLUGIN_DLL_EXPORT void cc_load_plugin_##name() { \
            load_func();                                     \
        }
#endif
