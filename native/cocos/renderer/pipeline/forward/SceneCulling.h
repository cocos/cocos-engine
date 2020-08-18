#pragma once

namespace cc {
namespace pipeline {

struct RenderObject;
struct Model;
struct Camera;
class ForwardPipeline;
class RenderView;

RenderObject genRenderObject(Model *, const Camera *);

void sceneCulling(ForwardPipeline *, RenderView *);
} // namespace pipeline
} // namespace cc
