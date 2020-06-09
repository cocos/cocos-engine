#ifndef CC_CORE_GFX_SHADER_H_
#define CC_CORE_GFX_SHADER_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXShader : public GFXObject {
public:
    GFXShader(GFXDevice *device);
    virtual ~GFXShader();

public:
    virtual bool initialize(const GFXShaderInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE GFXDevice *getDevice() const { return _device; }
    // Can not rename to `id` as JS code, because `id` is a keyword in objective-c.
    CC_INLINE uint getHash() const { return _hash; }
    CC_INLINE const String &getName() const { return _name; }
    CC_INLINE const GFXShaderStageList &getStages() const { return _stages; }
    CC_INLINE const GFXUniformBlockList &getBlocks() const { return _blocks; }
    CC_INLINE const GFXUniformSamplerList &getSamplers() const { return _samplers; }

protected:
    GFXDevice *_device = nullptr;
    uint _hash = 0;
    String _name;
    GFXShaderStageList _stages;
    GFXUniformBlockList _blocks;
    GFXUniformSamplerList _samplers;
};

NS_CC_END

#endif // CC_CORE_GFX_TEXTURE_VIEW_H_
