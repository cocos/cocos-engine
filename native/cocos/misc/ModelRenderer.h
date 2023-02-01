#pragma once

#include "Renderer.h"
#include "base/Ptr.h"
#include "base/std/container/vector.h"
#include "core/scene-graph/Layers.h"
#include "scene/Model.h"

namespace cc {
class ModelRenderer : public Renderer {
public:
    /**
     * @en The visibility which will be applied to the committed models.
     * @zh 应用于所有提交渲染的 Model 的可见性
     */
    uint32_t getVisibility() const { return _visFlags; }
    void setVisibility(uint32_t flag) {
        _visFlags = flag;
        _onVisibilityChange(flag);
    }

    /**
     * @en The priority which will be applied to the committed models.(Valid only in transparent queues)
     * @zh 应用于所有提交渲染的 Model 的排序优先级（只在半透明渲染队列中起效）
     */
    int32_t getPriority() const {
        return _priority;
    }

    void setPriority(int32_t val) {
        if (val == _priority) return;
        _priority = val;
        _updatePriority();
    }

    // protected:

    /**
     * @zh 收集组件中的 models
     * @en Collect the models in this component.
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    PtrVector<scene::Model> &_collectModels() {
        return _models;
    }

    virtual void onEnable() override {
        _updatePriority();
    }

    virtual void _attachToScene() {
    }

    virtual void _detachFromScene() {
    }

    virtual void _onVisibilityChange(uint32_t flags) {
    }

    virtual void _updatePriority() {
        if (!_models.empty()) {
            for (auto &model : _models) {
                model->setPriority(_priority);
            }
        }
    }

    uint32_t _visFlags = static_cast<uint32_t>(LayerList::NONE);

public:
    using LayerList = Layers::LayerList;
    PtrVector<scene::Model> _models;
    int32_t _priority = 0; // TODO: float or interger ?
};
} // namespace cc