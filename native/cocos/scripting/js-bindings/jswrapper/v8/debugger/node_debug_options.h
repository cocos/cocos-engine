#ifndef SRC_NODE_DEBUG_OPTIONS_H_
#define SRC_NODE_DEBUG_OPTIONS_H_

#include "../../config.hpp"
#if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR

#include <string>

// Forward declaration to break recursive dependency chain with src/env.h.
namespace node {

class DebugOptions {
 public:
  DebugOptions();
  bool ParseOption(const char* argv0, const std::string& option);
    void set_inspector_enabled(bool enabled) { inspector_enabled_ = enabled; }
  bool inspector_enabled() const { return inspector_enabled_; }
  bool deprecated_invocation() const {
    return deprecated_debug_ &&
      inspector_enabled_ &&
      break_first_line_;
  }
  bool invalid_invocation() const {
    return deprecated_debug_ && !inspector_enabled_;
  }
  void set_wait_for_connect(bool wait) { break_first_line_ = wait; }
  bool wait_for_connect() const { return break_first_line_; }
  std::string host_name() const { return host_name_; }
  void set_host_name(std::string host_name) { host_name_ = host_name; }
  int port() const;
  void set_port(int port) { port_ = port; }

 private:
  bool inspector_enabled_;
  bool deprecated_debug_;
  bool break_first_line_;
  std::string host_name_;
  int port_;
};

}  // namespace node

#endif // #if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR

#endif  // SRC_NODE_DEBUG_OPTIONS_H_
