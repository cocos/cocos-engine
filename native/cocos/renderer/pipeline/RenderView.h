#pragma once

#include "Define.h"

namespace cc {
namespace pipeline {
struct Camera;
class RenderFlow;
struct RenderWindow;
class RenderPipeline;

struct CC_DLL RenderViewInfo {
    uint cameraID = 0;
    String name;
    uint priority = 0;
    std::vector<String> flows;
};

class CC_DLL RenderView : public Object {
public:
    RenderView();
    virtual ~RenderView();

    void destroy();
    bool initialize(const RenderViewInfo &info);
    void setExecuteFlows(const vector<String> &flows);
    void setWindow(uint windowID);
    void onGlobalPipelineStateChanged();

    CC_INLINE const String &getName() const { return _name; }
    CC_INLINE uint getPriority() const { return _priority; }
    CC_INLINE void setPriority(uint value) { _priority = value; }
    CC_INLINE uint getVisibility() const { return _visibility; }
    CC_INLINE void setVisibility(uint value) { _visibility = value; }
    CC_INLINE Camera *getCamera() const { return _camera; }
    CC_INLINE bool isEnabled() const { return _isEnabled; }
    CC_INLINE void setEnable(bool value) { _isEnabled = value; }
    CC_INLINE const RenderFlowList &getFlows() const { return _flows; }
    CC_INLINE RenderWindow *getWindow() const { return _window; }

private:
    RenderFlowList _flows;
    String _name;
    Camera *_camera = nullptr;
    RenderWindow *_window = nullptr;
    RenderPipeline *_pipeline = nullptr;

    uint _priority = 0;
    uint _visibility = CAMERA_DEFAULT_MASK;
    bool _isEnabled = false;
};

} // namespace pipeline
} // namespace cc
