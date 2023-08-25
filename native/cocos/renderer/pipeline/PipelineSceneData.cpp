/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "PipelineSceneData.h"
#include <sstream>
#include "core/ArrayBuffer.h"
#include "core/assets/Material.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gi/light-probe/LightProbe.h"
#include "scene/Ambient.h"
#include "scene/Fog.h"
#include "scene/Model.h"
#include "scene/Octree.h"
#include "scene/Pass.h"
#include "scene/Shadow.h"
#include "scene/Skin.h"
#include "scene/Skybox.h"
#include "scene/Model.h"
#include "scene/PostSettings.h"

namespace cc {
namespace pipeline {

PipelineSceneData::PipelineSceneData() {
    _fog = ccnew scene::Fog();
    _ambient = ccnew scene::Ambient();
    _skybox = ccnew scene::Skybox();
    _shadow = ccnew scene::Shadows();
    _csmLayers = ccnew CSMLayers();
    _octree = ccnew scene::Octree();
    _lightProbes = ccnew gi::LightProbes();
    _skin = ccnew scene::Skin();
    _postSettings = ccnew scene ::PostSettings();
}

PipelineSceneData::~PipelineSceneData() {
    CC_SAFE_DELETE(_fog);
    CC_SAFE_DELETE(_ambient);
    CC_SAFE_DELETE(_skybox);
    CC_SAFE_DELETE(_shadow);
    CC_SAFE_DELETE(_octree);
    CC_SAFE_DELETE(_csmLayers);
    CC_SAFE_DELETE(_lightProbes);
    CC_SAFE_DELETE(_skin);
    CC_SAFE_DELETE(_postSettings);
}

void PipelineSceneData::activate(gfx::Device *device) {
    _device = device;

#if CC_USE_GEOMETRY_RENDERER
    initGeometryRenderer();
#endif

#if CC_USE_DEBUG_RENDERER
    initDebugRenderer();
#endif

#if CC_USE_OCCLUSION_QUERY
    initOcclusionQuery();
#endif
}

void PipelineSceneData::destroy() {
    _shadowFrameBufferMap.clear();
    _validPunctualLights.clear();

    _occlusionQueryInputAssembler = nullptr;
    _occlusionQueryVertexBuffer = nullptr;
    _occlusionQueryIndicesBuffer = nullptr;
    _standardSkinModel = nullptr;
    _skinMaterialModel = nullptr;
}

void PipelineSceneData::initOcclusionQuery() {
    CC_ASSERT(!_occlusionQueryInputAssembler);
    _occlusionQueryInputAssembler = createOcclusionQueryIA();

    if (!_occlusionQueryMaterial) {
        _occlusionQueryMaterial = ccnew Material();
        _occlusionQueryMaterial->setUuid("default-occlusion-query-material");
        IMaterialInfo info;
        info.effectName = "internal/builtin-occlusion-query";
        _occlusionQueryMaterial->initialize(info);
        if (!_occlusionQueryMaterial->getPasses()->empty()) {
            _occlusionQueryPass = (*_occlusionQueryMaterial->getPasses())[0];
            _occlusionQueryShader = _occlusionQueryPass->getShaderVariant();
        }
    }
}

void PipelineSceneData::initGeometryRenderer() {
    _geometryRendererMaterials.resize(GEOMETRY_RENDERER_TECHNIQUE_COUNT);
    _geometryRendererPasses.reserve(GEOMETRY_RENDERER_TECHNIQUE_COUNT);
    _geometryRendererShaders.reserve(GEOMETRY_RENDERER_TECHNIQUE_COUNT);

    for (uint32_t tech = 0; tech < GEOMETRY_RENDERER_TECHNIQUE_COUNT; tech++) {
        _geometryRendererMaterials[tech] = ccnew Material();

        std::stringstream ss;
        ss << "geometry-renderer-material-" << tech;
        _geometryRendererMaterials[tech]->setUuid(ss.str());

        IMaterialInfo materialInfo;
        materialInfo.effectName = "internal/builtin-geometry-renderer";
        materialInfo.technique = tech;
        _geometryRendererMaterials[tech]->initialize(materialInfo);

        const auto &passes = _geometryRendererMaterials[tech]->getPasses().get();
        for (const auto &pass : *passes) {
            _geometryRendererPasses.emplace_back(pass);
            _geometryRendererShaders.emplace_back(pass->getShaderVariant());
        }
    }
}

void PipelineSceneData::initDebugRenderer() {
    if (!_debugRendererMaterial) {
        _debugRendererMaterial = ccnew Material();
        _debugRendererMaterial->setUuid("default-debug-renderer-material");
        IMaterialInfo info;
        info.effectName = "internal/builtin-debug-renderer";
        _debugRendererMaterial->initialize(info);
        _debugRendererPass = (*_debugRendererMaterial->getPasses())[0];
        _debugRendererShader = _debugRendererPass->getShaderVariant();
    }
}

gfx::InputAssembler *PipelineSceneData::createOcclusionQueryIA() {
    // create vertex buffer
    const float vertices[] = {-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1};
    uint32_t vbStride = sizeof(float) * 3;
    uint32_t vbSize = vbStride * 8;

    _occlusionQueryVertexBuffer = _device->createBuffer(gfx::BufferInfo{
        gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::DEVICE, vbSize, vbStride});
    _occlusionQueryVertexBuffer->update(vertices);

    // create index buffer
    const uint16_t indices[] = {0, 2, 1, 1, 2, 3, 4, 5, 6, 5, 7, 6, 1, 3, 7, 1, 7, 5, 0, 4, 6, 0, 6, 2, 0, 1, 5, 0, 5, 4, 2, 6, 7, 2, 7, 3};
    uint32_t ibStride = sizeof(uint16_t);
    uint32_t ibSize = ibStride * 36;
    _occlusionQueryIndicesBuffer = _device->createBuffer(gfx::BufferInfo{
        gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::DEVICE, ibSize, ibStride});
    _occlusionQueryIndicesBuffer->update(indices);

    gfx::AttributeList attributes{gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F}};

    // create cube input assembler
    gfx::InputAssemblerInfo info{attributes, {_occlusionQueryVertexBuffer}, _occlusionQueryIndicesBuffer};
    return _device->createInputAssembler(info);
}

void PipelineSceneData::setStandardSkinModel(scene::Model *val) {
    _standardSkinModel = val;
}

void PipelineSceneData::setSkinMaterialModel(scene::Model *val) {
    _skinMaterialModel = val;
}

} // namespace pipeline
} // namespace cc
