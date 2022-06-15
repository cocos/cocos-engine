#include "Simple.h"
#include <2d/assembler/Simple.h>
#include <cocos/2d/renderer/Batcher2d.h>
#include <cocos/base/TypeDef.h>

namespace cc {
Simple::Simple(/* args */) {
    this->_batcher = nullptr;
}

Simple::Simple(Batcher2d* batcher) {
    this->_batcher = batcher;
}

Simple::~Simple() {
}

} // namespace cc
