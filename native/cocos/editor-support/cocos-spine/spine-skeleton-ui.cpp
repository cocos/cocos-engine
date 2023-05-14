#include "cocos-spine/spine-skeleton-ui.h"
#include "2d/renderer/RenderDrawInfo.h"
#include "2d/renderer/RenderEntity.h"

namespace spine {

SpineSkeletonUI::SpineSkeletonUI() {

}

SpineSkeletonUI::~SpineSkeletonUI() {

}

void SpineSkeletonUI::setSkeletonInstance(spine::SpineSkeletonInstance* obj) {
    _skeletonInstance = obj;
}

void SpineSkeletonUI::setSkeletonRendererer(spine::SpineSkeletonUIRenderer* rendererUI) {
    _renderer = rendererUI;
}

void SpineSkeletonUI::updateRenderData() {
    if (!_skeletonInstance || !_renderer) return;
    auto mesh = _skeletonInstance->updateRenderData();
    _renderer->updateMeshData(mesh);
}

void SpineSkeletonUI::onDestroy() {
    
}

} // namespace spine
