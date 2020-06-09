#ifndef CC_GFXVULKAN_CCVK_CONTEXT_H_
#define CC_GFXVULKAN_CCVK_CONTEXT_H_

NS_CC_BEGIN

class CCVKDevice;
class CCVKGPUDevice;
class CCVKGPUContext;
class CCVKGPUSwapchain;
class CCVKGPUSemaphorePool;

class CC_VULKAN_API CCVKContext : public GFXContext {
public:
    CCVKContext(GFXDevice *device);
    ~CCVKContext();

public:
    bool initialize(const GFXContextInfo &info);
    void destroy();
    void present() {}

    CC_INLINE bool checkExtension(const String &extension) const {
        return std::find_if(_extensions.begin(), _extensions.end(),
                            [extension](const char *device_extension) {
                                return std::strcmp(device_extension, extension.c_str()) == 0;
                            }) != _extensions.end();
    }

    CC_INLINE int majorVersion() const { return _majorVersion; }
    CC_INLINE int minorVersion() const { return _minorVersion; }
    CC_INLINE CCVKGPUContext *gpuContext() { return _gpuContext; }
    CC_INLINE const vector<const char *>::type &getLayers() const { return _layers; }
    CC_INLINE const vector<const char *>::type &getExtensions() const { return _extensions; }

private:
    CCVKGPUContext *_gpuContext = nullptr;
    bool _isPrimaryContex = false;
    int _majorVersion = 0;
    int _minorVersion = 0;
    vector<const char *>::type _layers;
    vector<const char *>::type _extensions;
};

NS_CC_END

#endif // CC_GFXVULKAN_CCVK_CONTEXT_H_
