#ifndef CC_GFXVULKAN_CCVK_WINDOW_H_
#define CC_GFXVULKAN_CCVK_WINDOW_H_

NS_CC_BEGIN

class CC_VULKAN_API CCVKWindow : public GFXWindow
{
public:
    CCVKWindow(GFXDevice* device);
    ~CCVKWindow();

public:
    bool initialize(const GFXWindowInfo& info);
    void destroy();
    void resize(uint width, uint height);
};

NS_CC_END

#endif
