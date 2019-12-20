#pragma once

#include "GFXCommand.h"

NS_CC_BEGIN

template <typename T, typename = std::enable_if<std::is_base_of<GFXCmd, T>::value>>
class GFXCommandPool {
 public:
  GFXCommandPool(): free_cmds_(1) {
    frees_ = new T*[1];
    count_ = 1;
    free_idx_ = 0;
    for (uint i = 0; i < count_; ++i) {
      frees_[i] = CC_NEW(T);
    }
  }
  
  ~GFXCommandPool() {
    for (uint i = 0; i < count_; ++i) {
      CC_DELETE(frees_[i]);
    }
    delete [] (frees_);

    for (uint i = 0; i < free_cmds_.Size(); ++i) {
      CC_DELETE(free_cmds_[i]);
    }
    free_cmds_.Clear();
  }
  
  T* Alloc() {
    if (free_idx_ < 0) {
      T** old_frees = frees_;
      uint size = count_ * 2;
      frees_ = new T*[size];
      uint increase = size - count_;
      for (uint i = 0; i < increase; ++i) {
        frees_[i] = CC_NEW(T);
      }
      for (uint i = increase, j = 0; i < size; ++i, ++j) {
        frees_[i] = old_frees[j];
      }
      delete [] (old_frees);

      count_ = size;
      free_idx_ += (int)increase;
    }
    
    T* cmd = frees_[free_idx_];
    frees_[free_idx_--] = nullptr;
    ++cmd->ref_count;
    return cmd;
  }
  
  void Free(T* cmd) {
    if (--cmd->ref_count == 0) {
      free_cmds_.Push(cmd);
    }
  }
  
  void FreeCmds(CachedArray<T*>& cmds) {
    for (uint i = 0; i < cmds.Size(); ++i) {
      if (--cmds[i]->ref_count == 0) {
        free_cmds_.Push(cmds[i]);
      }
    }
    cmds.Clear();
  }
  
  void Release() {
    for (uint i = 0; i < free_cmds_.Size(); ++i) {
      T* cmd = free_cmds_[i];
      cmd->Clear();
      frees_[++free_idx_] = cmd;
    }
    free_cmds_.Clear();
  }
  
 private:
  T** frees_ = nullptr;
  uint count_ = 0;
  CachedArray<T*> free_cmds_;
  int free_idx_ = 0;
};

NS_CC_END
