#include "Description.h"

namespace cc {
namespace scene {
namespace raytracing {
void Description::Clear() {
    skins.clear();
    scene.nodes.clear();
    animations.clear();
    accessors.clear();
    bufferViews.clear();
    buffers.clear();
    materials.clear();
    textures.clear();
    samplers.clear();
    images.clear();
}
} // namespace raytracing
} // namespace scene
} // namespace cc
