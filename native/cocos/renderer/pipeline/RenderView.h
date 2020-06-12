#pragma once

#include "Define.h"

NS_CC_BEGIN
class Camera;
class Root;
NS_CC_END

NS_PP_BEGIN

class RenderFlow;

class CC_DLL RenderView : public cocos2d::Object {
public:
    static void registerCreateFun(cocos2d::Root *root);

    bool initialize(const RenderViewInfo &info);
    void destroy();
    void enable(bool value);
    void setExecuteFlows(const RenderFlowList &flows);
    void setPriority();

    CC_INLINE const cocos2d::String &getName() const { return _name; }
    CC_INLINE uint getPriority() const { return _priority; }
    CC_INLINE uint getVisibility() const { return _visibility; }
    CC_INLINE void setVisibility(uint value) { _visibility = value; }
    CC_INLINE cocos2d::Camera *getCamera() const { return _camera; }
    CC_INLINE bool isEnabled() const { return _isEnabled; }
    CC_INLINE const RenderFlowList &getFlows() const { return _flows; }

    // getWindow
    // setWindow

private:
    RenderView(cocos2d::Root *root, cocos2d::Camera *camera);

private:
    RenderFlowList _flows;
    cocos2d::String _name;
    cocos2d::Camera *_camera = nullptr;
    cocos2d::Root *_root = nullptr;
    uint _priority = 0;
    uint _visibility = CAMERA_DEFAULT_MASK;
    bool _isEnabled = false;
};

NS_PP_END
