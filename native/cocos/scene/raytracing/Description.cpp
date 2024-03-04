#include "Description.h"

namespace cc {
namespace scene {
namespace raytracing {
void Description::clear() {
    skins.clear();
    scene.nodes.clear();
    animations.clear();
    accessors.clear();
    bufferViews.clear();
    buffers.clear();
    materials.clear();
    textures.clear();
    meshes.clear();
    nodes.clear();
}
} // namespace raytracing
} // namespace scene
} // namespace cc
