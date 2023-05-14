#pragma once
#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/TypeDef.h"
#include <vector>
#include "bindings/utils/BindingUtils.h"
#include "base/std/container/string.h"
#include "cocos/editor-support/spine/spine.h"
#include "cocos-spine/spine-mesh-data.h"


namespace cc {
class RenderEntity;
class RenderDrawInfo;
class Material;
class Texture2D;
class UIMeshBuffer;
};

using namespace cc;
namespace spine {

class SpineSkeletonUIRenderer {
public:
    SpineSkeletonUIRenderer();
    ~SpineSkeletonUIRenderer();
    void setRenderEntity(cc::RenderEntity* entity);
    void updateMeshData(SpineSkeletonModelData *mesh);
    void onDestroy();

    inline Material *getMaterial() const { return _material; }
    inline void setMaterial(Material *material) {
        _material = material;
        destroyMaterialCaches();
    }

    inline Texture2D *getTexture() const { return _texture; }
    inline void setTexture(Texture2D *texture) {
        _texture = texture;
    }

private:
    cc::RenderDrawInfo *requestDrawInfo(int idx);
    cc::Material *requestMaterial(uint32_t blend);
    cc::Material *requestMaterial(uint16_t blendSrc, uint16_t blendDst);
    void destroyMaterialCaches();

private:
    cc::RenderEntity *_entity = nullptr;
    cc::Material *_material = nullptr;
    cc::Texture2D *_texture = nullptr;
    std::vector<cc::RenderDrawInfo *> _drawInfoArray;
    cc::UIMeshBuffer *_uiMesh = nullptr;
    ccstd::unordered_map<uint32_t, cc::Material*> _materialCaches;
};

} // namespace spine
