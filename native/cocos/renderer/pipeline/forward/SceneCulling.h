#pragma once

namespace cc {
class Mat4;
class Vec4;
class Vec3;
namespace pipeline {

struct RenderObject;
struct Model;
struct Camera;
class ForwardPipeline;
class RenderView;
struct Shadows;

RenderObject genRenderObject(Model *, const Camera *);

void sceneCulling(ForwardPipeline *, RenderView *);
void getShadowWorldMatrix(const Shadows *shadows, const cc::Vec4 &rotation, const cc::Vec3 &dir, cc::Mat4 &shadowWorldMat);
} // namespace pipeline
} // namespace cc
