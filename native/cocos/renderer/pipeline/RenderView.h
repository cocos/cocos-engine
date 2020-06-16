#pragma once

#include "Define.h"

namespace cc {
class Camera;
class Root;
} // namespace cc

namespace cc {
namespace pipeline {

class RenderFlow;

class CC_DLL RenderView : public gfx::Object {
public:
    static void registerCreateFun(cc::Root *root);

    bool initialize(const RenderViewInfo &info);
    void destroy();
    void enable(bool value);
    void setExecuteFlows(const RenderFlowList &flows);
    void setPriority();

    CC_INLINE const gfx::String &getName() const { return _name; }
    CC_INLINE uint getPriority() const { return _priority; }
    CC_INLINE uint getVisibility() const { return _visibility; }
    CC_INLINE void setVisibility(uint value) { _visibility = value; }
    CC_INLINE cc::Camera *getCamera() const { return _camera; }
    CC_INLINE bool isEnabled() const { return _isEnabled; }
    CC_INLINE const RenderFlowList &getFlows() const { return _flows; }

    // getWindow
    // setWindow

private:
    RenderView(cc::Root *root, cc::Camera *camera);

private:
    RenderFlowList _flows;
    gfx::String _name;
    cc::Camera *_camera = nullptr;
    cc::Root *_root = nullptr;
    uint _priority = 0;
    uint _visibility = CAMERA_DEFAULT_MASK;
    bool _isEnabled = false;
};

} // namespace pipeline
} // namespace cc
