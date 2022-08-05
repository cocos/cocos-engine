#include "LayoutGraphGraphs.h"
#include "NativePipelineGraphs.h"
#include "NativePipelineTypes.h"
#include "RenderGraphGraphs.h"
#include "gfx-base/GFXDef-common.h"
#include "pipeline/custom/RenderCommonTypes.h"
#include "pipeline/custom/RenderGraphFwd.h"
#include "pipeline/custom/RenderGraphTypes.h"

namespace cc {

namespace render {

void NativeRasterPassBuilder::addRasterView(const ccstd::string &name, const RasterView &view) {
    auto &pass = get(RasterTag{}, passID, *renderGraph);
    pass.rasterViews.emplace(
        std::piecewise_construct,
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(view));
}

void NativeRasterPassBuilder::addComputeView(const ccstd::string &name, const ComputeView &view) {
    auto &pass = get(RasterTag{}, passID, *renderGraph);
    auto iter = pass.computeViews.find(name.c_str());
    if (iter == pass.computeViews.end()) {
        bool added = false;
        std::tie(iter, added) = pass.computeViews.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(name.c_str()),
            std::forward_as_tuple());
        CC_ENSURES(added);
    }
    iter->second.emplace_back(view);
}

void NativeRasterQueueBuilder::addSceneOfCamera(scene::Camera *camera, LightInfo light, SceneFlags sceneFlags, const ccstd::string &name) {
    SceneData scene(renderGraph->get_allocator());
    scene.name = name;
    scene.flags = sceneFlags;
    scene.camera = camera;
    scene.light = std::move(light);
    auto sceneID = addVertex(
        SceneTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(scene)),
        *renderGraph, queueID);
    CC_ENSURES(sceneID != RenderGraph::null_vertex());
}

void NativeRasterQueueBuilder::addSceneOfCamera(scene::Camera *camera, LightInfo light, SceneFlags sceneFlags) {
    addSceneOfCamera(camera, std::move(light), sceneFlags, "Camera");
}

void NativeRasterQueueBuilder::addScene(const ccstd::string &name, SceneFlags sceneFlags) {
    SceneData scene(renderGraph->get_allocator());
    scene.name = name;
    scene.flags = sceneFlags;

    auto sceneID = addVertex(
        SceneTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(scene)),
        *renderGraph, queueID);
    CC_ENSURES(sceneID != RenderGraph::null_vertex());
}

void NativeRasterQueueBuilder::addFullscreenQuad(
    Material *material, SceneFlags sceneFlags, const ccstd::string &name) {
    auto drawID = addVertex(
        BlitTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(material, sceneFlags, nullptr),
        *renderGraph, queueID);
    CC_ENSURES(drawID != RenderGraph::null_vertex());
}

void NativeRasterQueueBuilder::addFullscreenQuad(Material *material, SceneFlags sceneFlags) {
    addFullscreenQuad(material, sceneFlags, "FullscreenQuad");
}

void NativeRasterQueueBuilder::addCameraQuad(
    scene::Camera *camera, cc::Material *material,
    SceneFlags sceneFlags, const ccstd::string &name) {
    auto drawID = addVertex(
        BlitTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(material, sceneFlags, camera),
        *renderGraph, queueID);
    CC_ENSURES(drawID != RenderGraph::null_vertex());
}

void NativeRasterQueueBuilder::addCameraQuad(
    scene::Camera *camera, cc::Material *material, SceneFlags sceneFlags) {
    addCameraQuad(camera, material, sceneFlags, "CameraQuad");
}

void NativeRasterQueueBuilder::clearRenderTarget(const ccstd::string &name, const gfx::Color &color) {
    ccstd::pmr::vector<ClearView> clears(renderGraph->get_allocator());
    clears.emplace_back(name.c_str(), gfx::ClearFlagBit::COLOR, color);

    auto clearID = addVertex(
        ClearTag{},
        std::forward_as_tuple("ClearRenderTarget"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(clears)),
        *renderGraph, queueID);
    CC_ENSURES(clearID != RenderGraph::null_vertex());
}

void NativeRasterQueueBuilder::setViewport(const gfx::Viewport &viewport) {
    auto viewportID = addVertex(
        ViewportTag{},
        std::forward_as_tuple("Viewport"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(viewport),
        *renderGraph, queueID);
    CC_ENSURES(viewportID != RenderGraph::null_vertex());
}

namespace {

render::NameLocalID getNameID(
    const PmrFlatMap<ccstd::pmr::string, render::NameLocalID> &index,
    boost::string_view name) {
    auto iter = index.find(name);
    CC_EXPECTS(iter != index.end());
    return iter->second;
}

void addMat4(
    const LayoutGraphData &lg, boost::string_view name,
    const cc::Mat4 &v, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Mat4) == 16 * 4, "sizeof(Mat4) is not 64 bytes");
    data.constants[nameID.value].resize(sizeof(Mat4));
    memcpy(data.constants[nameID.value].data(), v.m, sizeof(v));
}

void addQuaternion(const LayoutGraphData &lg, const ccstd::string &name, const Quaternion &quat, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Quaternion) == 4 * 4, "sizeof(Quaternion) is not 16 bytes");
    static_assert(std::is_trivially_copyable<Quaternion>::value, "Quaternion is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(Quaternion));
    memcpy(data.constants[nameID.value].data(), &quat, sizeof(quat));
}

void addColor(const LayoutGraphData &lg, const ccstd::string &name, const gfx::Color &color, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(gfx::Color) == 4 * 4, "sizeof(Color) is not 16 bytes");
    static_assert(std::is_trivially_copyable<gfx::Color>::value, "Color is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(gfx::Color));
    memcpy(data.constants[nameID.value].data(), &color, sizeof(color));
}

void addVec4(const LayoutGraphData &lg, const ccstd::string &name, const Vec4 &vec, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Vec4) == 4 * 4, "sizeof(Vec4) is not 16 bytes");
    // static_assert(std::is_trivially_copyable<Vec4>::value, "Vec4 is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(Vec4));
    memcpy(data.constants[nameID.value].data(), &vec.x, sizeof(vec));
}

void addVec2(const LayoutGraphData &lg, const ccstd::string &name, const Vec2 &vec, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(Vec2) == 2 * 4, "sizeof(Vec2) is not 8 bytes");
    // static_assert(std::is_trivially_copyable<Vec4>::value, "Vec2 is not trivially copyable");
    data.constants[nameID.value].resize(sizeof(Vec2));
    memcpy(data.constants[nameID.value].data(), &vec.x, sizeof(vec));
}

void addFloat(const LayoutGraphData &lg, const ccstd::string &name, float v, RenderData &data) {
    auto nameID = getNameID(lg.constantIndex, name);
    static_assert(sizeof(float) == 4, "sizeof(float) is not 4 bytes");
    data.constants[nameID.value].resize(sizeof(float));
    memcpy(data.constants[nameID.value].data(), &v, sizeof(v));
}

void addBuffer(const LayoutGraphData &lg, const ccstd::string &name, gfx::Buffer *buffer, RenderData &data) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.buffers[nameID.value] = IntrusivePtr<gfx::Buffer>(buffer);
}

void addTexture(const LayoutGraphData &lg, const ccstd::string &name, gfx::Texture *texture, RenderData &data) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.textures[nameID.value] = IntrusivePtr<gfx::Texture>(texture);
}

void addReadWriteBuffer(const LayoutGraphData &lg, const ccstd::string &name, gfx::Buffer *buffer, RenderData &data) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.buffers[nameID.value] = IntrusivePtr<gfx::Buffer>(buffer);
}

void addReadWriteTexture(const LayoutGraphData &lg, const ccstd::string &name, gfx::Texture *texture, RenderData &data) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.textures[nameID.value] = IntrusivePtr<gfx::Texture>(texture);
}

void addSampler(const LayoutGraphData &lg, const ccstd::string &name, gfx::Sampler *sampler, RenderData &data) {
    auto nameID = getNameID(lg.attributeIndex, name);
    data.samplers[nameID.value].ptr = sampler;
}

} // namespace

void NativeRasterQueueBuilder::setMat4(const ccstd::string &name, const Mat4 &mat) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addMat4(*layoutGraph, name, mat, data);
}

void NativeRasterQueueBuilder::setQuaternion(const ccstd::string &name, const Quaternion &quat) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addQuaternion(*layoutGraph, name, quat, data);
}

void NativeRasterQueueBuilder::setColor(const ccstd::string &name, const gfx::Color &color) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addColor(*layoutGraph, name, color, data);
}

void NativeRasterQueueBuilder::setVec4(const ccstd::string &name, const Vec4 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addVec4(*layoutGraph, name, vec, data);
}

void NativeRasterQueueBuilder::setVec2(const ccstd::string &name, const Vec2 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addVec2(*layoutGraph, name, vec, data);
}

void NativeRasterQueueBuilder::setFloat(const ccstd::string &name, float v) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addFloat(*layoutGraph, name, v, data);
}

void NativeRasterQueueBuilder::setBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addBuffer(*layoutGraph, name, buffer, data);
}

void NativeRasterQueueBuilder::setTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addTexture(*layoutGraph, name, texture, data);
}

void NativeRasterQueueBuilder::setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addReadWriteBuffer(*layoutGraph, name, buffer, data);
}

void NativeRasterQueueBuilder::setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addReadWriteTexture(*layoutGraph, name, texture, data);
}

void NativeRasterQueueBuilder::setSampler(const ccstd::string &name, gfx::Sampler *sampler) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addSampler(*layoutGraph, name, sampler, data);
}

RasterQueueBuilder *NativeRasterPassBuilder::addQueue(
    QueueHint hint, const ccstd::string &name) { // NOLINT(bugprone-easily-swappable-parameters)
    auto queueID = addVertex(
        QueueTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(hint),
        *renderGraph, passID);

    return new NativeRasterQueueBuilder(renderGraph, queueID, layoutGraph);
}

RasterQueueBuilder *NativeRasterPassBuilder::addQueue(QueueHint hint) {
    return addQueue(hint, "Queue");
}

void NativeRasterPassBuilder::addFullscreenQuad(
    Material *material, SceneFlags sceneFlags, const ccstd::string &name) { // NOLINT(bugprone-easily-swappable-parameters)
    auto queueID = addVertex(
        QueueTag{},
        std::forward_as_tuple("Queue"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(QueueHint::RENDER_TRANSPARENT),
        *renderGraph, passID);

    addVertex(
        BlitTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(material, sceneFlags, nullptr),
        *renderGraph, queueID);
}

void NativeRasterPassBuilder::addFullscreenQuad(
    Material *material, SceneFlags sceneFlags) {
    return addFullscreenQuad(material, sceneFlags, "FullscreenQuad");
}

void NativeRasterPassBuilder::addCameraQuad(
    scene::Camera *camera, cc::Material *material,
    SceneFlags sceneFlags, const ccstd::string &name) {
    auto queueID = addVertex(
        QueueTag{},
        std::forward_as_tuple("Queue"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(QueueHint::RENDER_TRANSPARENT),
        *renderGraph, passID);

    addVertex(
        BlitTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(material, sceneFlags, camera),
        *renderGraph, queueID);
}

void NativeRasterPassBuilder::addCameraQuad(
    scene::Camera *camera, cc::Material *material, SceneFlags sceneFlags) {
    return addCameraQuad(camera, material, sceneFlags, "CameraQuad");
}

void NativeRasterPassBuilder::setViewport(const gfx::Viewport &viewport) {
    auto& pass = get(RasterTag{}, passID, *renderGraph);
    pass.viewport = viewport;
}

void NativeRasterPassBuilder::setMat4(const ccstd::string &name, const Mat4 &mat) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addMat4(*layoutGraph, name, mat, data);
}

void NativeRasterPassBuilder::setQuaternion(const ccstd::string &name, const Quaternion &quat) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addQuaternion(*layoutGraph, name, quat, data);
}

void NativeRasterPassBuilder::setColor(const ccstd::string &name, const gfx::Color &color) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addColor(*layoutGraph, name, color, data);
}

void NativeRasterPassBuilder::setVec4(const ccstd::string &name, const Vec4 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addVec4(*layoutGraph, name, vec, data);
}

void NativeRasterPassBuilder::setVec2(const ccstd::string &name, const Vec2 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addVec2(*layoutGraph, name, vec, data);
}

void NativeRasterPassBuilder::setFloat(const ccstd::string &name, float v) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addFloat(*layoutGraph, name, v, data);
}

void NativeRasterPassBuilder::setBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addBuffer(*layoutGraph, name, buffer, data);
}

void NativeRasterPassBuilder::setTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addTexture(*layoutGraph, name, texture, data);
}

void NativeRasterPassBuilder::setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addReadWriteBuffer(*layoutGraph, name, buffer, data);
}

void NativeRasterPassBuilder::setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addReadWriteTexture(*layoutGraph, name, texture, data);
}

void NativeRasterPassBuilder::setSampler(const ccstd::string &name, gfx::Sampler *sampler) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addSampler(*layoutGraph, name, sampler, data);
}

// NativeComputeQueue
void NativeComputeQueueBuilder::addDispatch(const ccstd::string &shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const ccstd::string &name) {
    addVertex(
        DispatchTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(
            shader.c_str(),
            threadGroupCountX,
            threadGroupCountY,
            threadGroupCountZ),
        *renderGraph);
}

void NativeComputeQueueBuilder::addDispatch(const ccstd::string &shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) {
    addDispatch(shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ, "Dispatch");
}

void NativeComputeQueueBuilder::setMat4(const ccstd::string &name, const Mat4 &mat) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addMat4(*layoutGraph, name, mat, data);
}

void NativeComputeQueueBuilder::setQuaternion(const ccstd::string &name, const Quaternion &quat) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addQuaternion(*layoutGraph, name, quat, data);
}

void NativeComputeQueueBuilder::setColor(const ccstd::string &name, const gfx::Color &color) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addColor(*layoutGraph, name, color, data);
}

void NativeComputeQueueBuilder::setVec4(const ccstd::string &name, const Vec4 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addVec4(*layoutGraph, name, vec, data);
}

void NativeComputeQueueBuilder::setVec2(const ccstd::string &name, const Vec2 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addVec2(*layoutGraph, name, vec, data);
}

void NativeComputeQueueBuilder::setFloat(const ccstd::string &name, float v) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addFloat(*layoutGraph, name, v, data);
}

void NativeComputeQueueBuilder::setBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addBuffer(*layoutGraph, name, buffer, data);
}

void NativeComputeQueueBuilder::setTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addTexture(*layoutGraph, name, texture, data);
}

void NativeComputeQueueBuilder::setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addReadWriteBuffer(*layoutGraph, name, buffer, data);
}

void NativeComputeQueueBuilder::setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addReadWriteTexture(*layoutGraph, name, texture, data);
}

void NativeComputeQueueBuilder::setSampler(const ccstd::string &name, gfx::Sampler *sampler) {
    auto &data = get(RenderGraph::Data, *renderGraph, queueID);
    addSampler(*layoutGraph, name, sampler, data);
}

void NativeComputePassBuilder::addComputeView(const ccstd::string &name, const ComputeView &view) {
    auto &pass = get(ComputeTag{}, passID, *renderGraph);
    auto iter = pass.computeViews.find(name.c_str());
    if (iter == pass.computeViews.end()) {
        bool added = false;
        std::tie(iter, added) = pass.computeViews.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(name.c_str()),
            std::forward_as_tuple());
        CC_ENSURES(added);
    }
    iter->second.emplace_back(view);
}

ComputeQueueBuilder *NativeComputePassBuilder::addQueue(const ccstd::string &name) {
    auto queueID = addVertex(
        QueueTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(QueueHint::NONE),
        *renderGraph, passID);

    return new NativeComputeQueueBuilder(renderGraph, queueID, layoutGraph);
}

ComputeQueueBuilder *NativeComputePassBuilder::addQueue() {
    return addQueue("Queue");
}

void NativeComputePassBuilder::addDispatch(
    const ccstd::string &shader,
    uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ,
    const ccstd::string &name) {
    auto queueID = addVertex(
        QueueTag{},
        std::forward_as_tuple("Queue"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        *renderGraph, passID);

    addVertex(
        DispatchTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(shader.c_str(), threadGroupCountX, threadGroupCountY, threadGroupCountZ),
        *renderGraph, queueID);
}

void NativeComputePassBuilder::addDispatch(
    const ccstd::string &shader,
    uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) {
    addDispatch(shader, threadGroupCountX, threadGroupCountY, threadGroupCountZ, "Dispatch");
}

void NativeComputePassBuilder::setMat4(const ccstd::string &name, const Mat4 &mat) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addMat4(*layoutGraph, name, mat, data);
}

void NativeComputePassBuilder::setQuaternion(const ccstd::string &name, const Quaternion &quat) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addQuaternion(*layoutGraph, name, quat, data);
}

void NativeComputePassBuilder::setColor(const ccstd::string &name, const gfx::Color &color) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addColor(*layoutGraph, name, color, data);
}

void NativeComputePassBuilder::setVec4(const ccstd::string &name, const Vec4 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addVec4(*layoutGraph, name, vec, data);
}

void NativeComputePassBuilder::setVec2(const ccstd::string &name, const Vec2 &vec) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addVec2(*layoutGraph, name, vec, data);
}

void NativeComputePassBuilder::setFloat(const ccstd::string &name, float v) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addFloat(*layoutGraph, name, v, data);
}

void NativeComputePassBuilder::setBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addBuffer(*layoutGraph, name, buffer, data);
}

void NativeComputePassBuilder::setTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addTexture(*layoutGraph, name, texture, data);
}

void NativeComputePassBuilder::setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addReadWriteBuffer(*layoutGraph, name, buffer, data);
}

void NativeComputePassBuilder::setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addReadWriteTexture(*layoutGraph, name, texture, data);
}

void NativeComputePassBuilder::setSampler(const ccstd::string &name, gfx::Sampler *sampler) {
    auto &data = get(RenderGraph::Data, *renderGraph, passID);
    addSampler(*layoutGraph, name, sampler, data);
}

void NativeMovePassBuilder::addPair(const MovePair &pair) {
    auto &movePass = get(MoveTag{}, passID, *renderGraph);
    movePass.movePairs.emplace_back(pair);
}

void NativeCopyPassBuilder::addPair(const CopyPair &pair) {
    auto &copyPass = get(CopyTag{}, passID, *renderGraph);
    copyPass.copyPairs.emplace_back(pair);
}

} // namespace render

} // namespace cc
