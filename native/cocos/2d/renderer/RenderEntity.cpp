/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "2d/renderer/RenderEntity.h"
#include "2d/renderer/Batcher2d.h"
#include "bindings/utils/BindingUtils.h"

namespace cc {
RenderEntity::RenderEntity(RenderEntityType type) : _renderEntityType(type) {
    if (type == RenderEntityType::STATIC) {
        ccnew_placement(&_staticDrawInfos) std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY>();
    } else {
        ccnew_placement (&_dynamicDrawInfos) ccstd::vector<RenderDrawInfo*>();
    }
    _entitySharedBufferActor.initialize(&_entityAttrLayout, sizeof(EntityAttrLayout));
}

RenderEntity::~RenderEntity() {
    if (_renderEntityType == RenderEntityType::STATIC) {
        _staticDrawInfos.~array();
    } else {
        _dynamicDrawInfos.~vector();
    }
};

void RenderEntity::addDynamicRenderDrawInfo(RenderDrawInfo* drawInfo) {
    CC_ASSERT(_renderEntityType != RenderEntityType::STATIC);
    _dynamicDrawInfos.push_back(drawInfo);
}
void RenderEntity::setDynamicRenderDrawInfo(RenderDrawInfo* drawInfo, uint32_t index) {
    CC_ASSERT(_renderEntityType != RenderEntityType::STATIC);
    if (index < _dynamicDrawInfos.size()) {
        _dynamicDrawInfos[index] = drawInfo;
    }
}
void RenderEntity::removeDynamicRenderDrawInfo() {
    CC_ASSERT(_renderEntityType != RenderEntityType::STATIC);
    if (_dynamicDrawInfos.empty()) return;
    _dynamicDrawInfos.pop_back(); // warning: memory leaking & crash
}

void RenderEntity::clearDynamicRenderDrawInfos() {
    CC_ASSERT(_renderEntityType != RenderEntityType::STATIC);
    _dynamicDrawInfos.clear();
}

void RenderEntity::setNode(Node* node) {
    if (_node) {
        _node->setUserData(nullptr);
    }
    _node = node;
    if (_node) {
        _node->setUserData(this);
    }
}

RenderDrawInfo* RenderEntity::getDynamicRenderDrawInfo(uint32_t index) {
    CC_ASSERT(_renderEntityType != RenderEntityType::STATIC);
    if (index >= _dynamicDrawInfos.size()) {
        return nullptr;
    }
    return _dynamicDrawInfos[index];
}
ccstd::vector<RenderDrawInfo*>& RenderEntity::getDynamicRenderDrawInfos() {
    CC_ASSERT(_renderEntityType != RenderEntityType::STATIC);
    return _dynamicDrawInfos;
}
void RenderEntity::setStaticDrawInfoSize(uint32_t size) {
    CC_ASSERT(_renderEntityType == RenderEntityType::STATIC && size <= RenderEntity::STATIC_DRAW_INFO_CAPACITY);
    _staticDrawInfoSize = size;
}
RenderDrawInfo* RenderEntity::getStaticRenderDrawInfo(uint32_t index) {
    CC_ASSERT(_renderEntityType == RenderEntityType::STATIC && index < _staticDrawInfoSize);
    return &(_staticDrawInfos[index]);
}
std::array<RenderDrawInfo, RenderEntity::STATIC_DRAW_INFO_CAPACITY>& RenderEntity::getStaticRenderDrawInfos() {
    CC_ASSERT(_renderEntityType == RenderEntityType::STATIC);
    return _staticDrawInfos;
}
} // namespace cc
