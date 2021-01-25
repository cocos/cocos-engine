#ifndef CC_CORE_GFX_SHADER_H_
#define CC_CORE_GFX_SHADER_H_

#include "GFXDef.h"

namespace cc {
namespace gfx {

class CC_DLL Shader : public GFXObject {
public:
    Shader(Device *device);
    virtual ~Shader();

    virtual bool initialize(const ShaderInfo &info) = 0;
    virtual void destroy() = 0;

    CC_INLINE Device *getDevice() const { return _device; }
    CC_INLINE uint getID() const { return _shaderID; }
    CC_INLINE const String &getName() const { return _name; }
    CC_INLINE const ShaderStageList &getStages() const { return _stages; }
    CC_INLINE const AttributeList &getAttributes() const { return _attributes; }
    CC_INLINE const UniformBlockList &getBlocks() const { return _blocks; }
    CC_INLINE const UniformStorageBufferList &getBuffers() const { return _buffers; }
    CC_INLINE const UniformSamplerTextureList &getSamplerTextures() const { return _samplerTextures; }
    CC_INLINE const UniformSamplerList &getSamplers() const { return _samplers; }
    CC_INLINE const UniformTextureList &getTextures() const { return _textures; }
    CC_INLINE const UniformStorageImageList &getImages() const { return _images; }
    CC_INLINE const UniformInputAttachmentList &getSubpassInputs() const { return _subpassInputs; }

protected:
    Device *_device = nullptr;
    uint _shaderID = 0;
    String _name;
    ShaderStageList _stages;
    AttributeList _attributes;
    UniformBlockList _blocks;
    UniformStorageBufferList _buffers;
    UniformSamplerTextureList _samplerTextures;
    UniformSamplerList _samplers;
    UniformTextureList _textures;
    UniformStorageImageList _images;
    UniformInputAttachmentList _subpassInputs;
};

} // namespace gfx
} // namespace cc

#endif // CC_CORE_GFX_SHADER_H_
