#ifndef CC_GFXGLES3_GLES3_WINDOW_H_
#define CC_GFXGLES3_GLES3_WINDOW_H_

NS_CC_BEGIN

class CC_GLES3_API GLES3Window : public GFXWindow {
public:
    GLES3Window(GFXDevice *device);
    ~GLES3Window();

public:
    virtual bool initialize(const GFXWindowInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint width, uint height) override;
};

NS_CC_END

#endif
