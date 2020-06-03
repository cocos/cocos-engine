#ifndef CC_GFXGLES2_GLES2_WINDOW_H_
#define CC_GFXGLES2_GLES2_WINDOW_H_

NS_CC_BEGIN

class CC_GLES2_API GLES2Window : public GFXWindow {
public:
    GLES2Window(GFXDevice *device);
    ~GLES2Window();

public:
    virtual bool initialize(const GFXWindowInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
};

NS_CC_END

#endif
