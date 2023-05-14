#pragma once
#include <vector>
#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/TypeDef.h"
#include "Object.h"
#include "bindings/utils/BindingUtils.h"
#include "base/std/container/string.h"
#include "cocos/editor-support/spine/spine.h"
#include "cocos-spine/spine-mesh-data.h"
#include "cocos-spine/spine-skeleton-instance.h"
#include "cocos-spine/spine-skeleton-ui-renderer.h"

namespace spine {

class SpineSkeletonUI {
public:
    SpineSkeletonUI();
    ~SpineSkeletonUI();
    void setSkeletonInstance(spine::SpineSkeletonInstance* obj);
    void setSkeletonRendererer(spine::SpineSkeletonUIRenderer* rendererUI);
    void updateRenderData();
    void onDestroy();

private:
    spine::SpineSkeletonInstance* _skeletonInstance = nullptr;
    spine::SpineSkeletonUIRenderer* _renderer = nullptr;
}; // class SpineSkeletonUI

} // namespace spine
