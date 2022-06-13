#include "Plugins.h"


#if !CC_USE_PLUGINS
extern "C" void cc_load_all_plugins() {  // NOLINT
}
#endif