/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "PipelineSceneData.h"
#include "core/ArrayBuffer.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "scene/Ambient.h"
#include "scene/Fog.h"
#include "scene/Octree.h"
#include "scene/Shadow.h"
#include "scene/Skybox.h"

#include <sstream>

namespace cc {
namespace pipeline {

PipelineSceneData::PipelineSceneData() {
    _fog     = new scene::Fog(); // cjh how to delete?
    _ambient = new scene::Ambient();
    _skybox  = new scene::Skybox();
    _shadow  = new scene::Shadows();
    _octree  = new scene::Octree();
}

PipelineSceneData::~PipelineSceneData() {
    CC_SAFE_DELETE(_fog); // cjh correct ?
    CC_SAFE_DELETE(_ambient);
    CC_SAFE_DELETE(_skybox);
    CC_SAFE_DELETE(_shadow);
    CC_SAFE_DELETE(_octree);
}

void PipelineSceneData::activate(gfx::Device *device, RenderPipeline *pipeline) {
    _device   = device;
    _pipeline = pipeline;
    initGeometryRendererMaterials();
    initOcclusionQuery();
}

void PipelineSceneData::destroy() {
    for (auto &pair : _shadowFrameBufferMap) {
        pair.second->destroy();
        delete pair.second;
    }

    _shadowFrameBufferMap.clear();
    _validPunctualLights.clear();

    CC_SAFE_DESTROY_NULL(_occlusionQueryInputAssembler);
    CC_SAFE_DESTROY_NULL(_occlusionQueryVertexBuffer);
    CC_SAFE_DESTROY_NULL(_occlusionQueryIndicesBuffer);
}

void PipelineSceneData::initOcclusionQuery() {
    if (!_occlusionQueryInputAssembler) {
        _occlusionQueryInputAssembler = createOcclusionQueryIA();
    }

    if (!_occlusionQueryMaterial) {
        _occlusionQueryMaterial = new Material();
        _occlusionQueryMaterial->initDefault(std::string{"default-occlusion-query-material"});
        IMaterialInfo info;
        info.effectName = "occlusion-query";
        _occlusionQueryMaterial->initialize(info);
        _occlusionQueryPass   = (*_occlusionQueryMaterial->getPasses())[0];
        _occlusionQueryShader = _occlusionQueryPass->getShaderVariant();
    }
}

void PipelineSceneData::initGeometryRendererMaterials() {
    _geometryRendererMaterials.resize(GEOMETRY_RENDERER_TECHNIQUE_COUNT);
    _geometryRendererPasses.reserve(GEOMETRY_RENDERER_TECHNIQUE_COUNT);
    _geometryRendererShaders.reserve(GEOMETRY_RENDERER_TECHNIQUE_COUNT);

    for (uint32_t tech = 0; tech < GEOMETRY_RENDERER_TECHNIQUE_COUNT; tech++) {
        _geometryRendererMaterials[tech] = new Material();

        std::stringstream ss;
        ss << "geometry-renderer-material-" << tech;
        _geometryRendererMaterials[tech]->setUuid(ss.str());

        IMaterialInfo materialInfo;
        materialInfo.effectName = "geometry-renderer";
        materialInfo.technique  = tech;
        _geometryRendererMaterials[tech]->initialize(materialInfo);

        const auto &passes = _geometryRendererMaterials[tech]->getPasses().get();
        for (const auto &pass : *passes) {
            _geometryRendererPasses.emplace_back(pass);
            _geometryRendererShaders.emplace_back(pass->getShaderVariant());
        }
    }
}

scene::Pass *PipelineSceneData::getOcclusionQueryPass() {
    if (_occlusionQueryMaterial) {
        const auto &passes = *_occlusionQueryMaterial->getPasses();
        return passes[0].get();
    }

    return nullptr;
}

gfx::InputAssembler *PipelineSceneData::createOcclusionQueryIA() {
    // create vertex buffer
    const float vertices[] = {-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1};
    uint32_t    vbStride   = sizeof(float) * 3;
    uint32_t    vbSize     = vbStride * 8;

    _occlusionQueryVertexBuffer = _device->createBuffer(gfx::BufferInfo{
        gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::DEVICE, vbSize, vbStride});
    _occlusionQueryVertexBuffer->update(vertices);

    // create index buffer
    const uint16_t indices[]     = {0, 2, 1, 1, 2, 3, 4, 5, 6, 5, 7, 6, 1, 3, 7, 1, 7, 5, 0, 4, 6, 0, 6, 2, 0, 1, 5, 0, 5, 4, 2, 6, 7, 2, 7, 3};
    uint32_t       ibStride      = sizeof(uint16_t);
    uint32_t       ibSize        = ibStride * 36;
    _occlusionQueryIndicesBuffer = _device->createBuffer(gfx::BufferInfo{
        gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::DEVICE, ibSize, ibStride});
    _occlusionQueryIndicesBuffer->update(indices);

    gfx::AttributeList attributes{gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F}};

    // create cube input assembler
    gfx::InputAssemblerInfo info{attributes, {_occlusionQueryVertexBuffer}, _occlusionQueryIndicesBuffer};
    return _device->createInputAssembler(info);
}

} // namespace pipeline
} // namespace cc
