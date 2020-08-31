#include "RenderView.h"
#include "Define.h"
#include "RenderFlow.h"
#include "RenderPipeline.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
RenderView::RenderView() {
    _pipeline = RenderPipeline::getInstance();
}

RenderView::~RenderView() {
    destroy();
}

bool RenderView::initialize(const RenderViewInfo &info) {
    
    _name = info.name;
    _priority = info.priority;
    setExecuteFlows(info.flows);
    _camera = GET_CAMERA(info.cameraID);

    return true;
}

void RenderView::destroy() {
    _window = nullptr;
    _priority = 0;
}

void RenderView::setExecuteFlows(const vector<String> &flows) {
    _flows.clear();

    const auto pipelineFlows = _pipeline->getFlows();
    if (flows.size() == 1 && flows[0] == "UIFlow") {
        for (auto flow : pipelineFlows) {
            if (flow->getName() == "UIFlow") {
                _flows.emplace_back(flow);
                break;
            }
        }
        return;
    }
    for (auto flow : pipelineFlows) {
        if (static_cast<RenderFlowTag>(flow->getTag()) == RenderFlowTag::SCENE ||
            std::find(flows.begin(), flows.end(), flow->getName()) != flows.end()) {
            _flows.emplace_back(flow);
        }
    }
}

void RenderView::setWindow(uint windowID) {
    _window = GET_WINDOW(windowID);
}

void RenderView::onGlobalPipelineStateChanged() {
    const auto pipelineFlows = _pipeline->getFlows();
    for (auto &flow : _flows) {
        for (auto pipelineFlow : pipelineFlows) {
            if (pipelineFlow->getName() == flow->getName()) {
                flow = pipelineFlow;
                break;
            }
        }
    }
}

} // namespace pipeline
} // namespace cc
