#pragma once
#include "pipeline/Define.h"

namespace cc {
class Mat4;
class Vec4;
class Vec3;
namespace pipeline {

struct RenderObject;
struct Model;
struct Camera;
class ForwardPipeline;
struct Sphere;
struct Light;
struct Sphere;
struct Shadows;

RenderObject genRenderObject(Model *, const Camera *);

void lightCollecting(Camera *, std::vector<const Light *>&);
void shadowCollecting(ForwardPipeline *, Camera *);
void sceneCulling(ForwardPipeline *, Camera *);
void updateDirLight(Shadows *shadows, const Light *light, std::array<float, UBOShadow::COUNT>&);
void getShadowWorldMatrix(const Sphere *sphere, const cc::Vec4 &rotation, const cc::Vec3 &dir, cc::Mat4 &shadowWorldMat, cc::Vec3 &out);
} // namespace pipeline
} // namespace cc
