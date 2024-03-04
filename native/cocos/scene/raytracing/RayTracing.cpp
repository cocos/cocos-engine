/****************************************************************************
 Copyright (c) 2021-2024 Xiamen Yaji Software Co., Ltd.

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

#include "RayTracing.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/core/Root.h"
#include "cocos/scene/Pass.h"
namespace cc {
namespace scene {
namespace raytracing {
void RayTracing::activate() {
    Root::getInstance()->on<Root::BeforeRender>([this](cc::Root* rootObj) {
        this->_beforeRender();
    });
}
void RayTracing::_beforeRender() {
    _description->Clear();
    ccstd::vector<MeshPrim> meshPrimitives{};
    _description->scene.name = _renderScene->getName();
    const auto& models = _renderScene->getModels();
    auto& buffers = _description->buffers;
    _instanceNum = 0;
    auto& accessors = _description->accessors;
    auto& bufferViews = _description->bufferViews;
    auto phaseID = pipeline::getPhaseID("default");
    for (const auto& model : models) {
        auto isStatic = model->getNode()->isStatic();
        if (!isStatic) {
            continue;
        }
        const auto& subModels = model->getSubModels();
        for (const auto& subModel : subModels) {
            Entity entity{};
            entity.name = model->getNode()->getName();
            auto* node = model->getNode();
            entity.target = node;
            entity.translation = node->getPosition();
            entity.rotation = node->getRotation();
            entity.scale = node->getScale();
            entity.mesh = _description->meshes.size();
            _description->scene.nodes.emplace_back(_description->nodes.size());
            _description->nodes.emplace_back(std::move(entity));

            meshPrimitives.emplace_back(_buildRaytracingMeshPrimitive(subModel));
            const auto& wMat = model->getNode()->getWorldMatrix();
            _transforms.emplace_back(wMat);
            _transformPrevs.emplace_back(wMat);
            InstanceInfo instance{};
            instance.mMeshPrimID = static_cast<uint32_t>(meshPrimitives.size() - 1);
            instance.mTransformID = _instanceNum;
            instance.mMeshID = _instanceNum;
            instance.mMeshPrimitiveLocalID = _instanceNum;
            _instances.emplace_back(instance);
            const auto& passes = *(subModel->getPasses());
            const auto passCount = passes.size();
            for (uint32_t passIdx = 0; passIdx < passCount; ++passIdx) {
                auto& pass = passes[passIdx];
                if (pass->getPhase() != phaseID) continue;
                const bool isTransparent = pass->getBlendState()->targets[0].blend;
                if (!isTransparent) {
                    _opaqueOrMaskInstanceIDs.emplace_back(_instanceNum);
                }
                _addMaterial(pass);
            }
            
            _instanceNum++;
        }
    }
    _buildRaytracingInstanceData();
}

MeshPrim RayTracing::_buildRaytracingMeshPrimitive(const IntrusivePtr<SubModel>& submodel) {
    auto* subMesh = submodel->getSubMesh();
    auto& iaInfo = subMesh->getIaInfo();
    auto* ia = submodel->getInputAssembler();
    auto& accessors = _description->accessors;
    auto& bufferViews = _description->bufferViews;
    auto& buffers = _description->buffers;
    auto& meshes = _description->meshes;
    Mesh mesh{};
    mesh.submodel = submodel;
    
    meshes.emplace_back(std::move(mesh));
    MeshPrim prim{};
    {
        auto* indexBuffer = iaInfo.indexBuffer;
        uint32_t idxBuff = static_cast<uint32_t>(buffers.size());
        buffers.emplace_back(indexBuffer);
        BufferView buffView{};
        buffView.byteOffset = 0;
        buffView.buffer = idxBuff;

        buffView.byteLength = indexBuffer->getCount() * sizeof(uint16_t);
        buffView.target = TargetType::ELEMENT_ARRAY_BUFFER;
        uint32_t idxBuffView = static_cast<uint32_t>(bufferViews.size());
        bufferViews.emplace_back(std::move(buffView));
        Accessor accessor{};
        accessor.bufferView = idxBuffView;
        accessor.byteOffset = 0;
        accessor.componentType = ComponentType::UNSIGNED_SHORT;
        accessor.count = indexBuffer->getCount();
        accessor.type = "SCALAR";
        accessors.emplace_back(std::move(accessor));
        prim.index_buffer = idxBuff;
        prim.index_offset = 0;
        prim.index_stride = indexBuffer->getStride();
        prim.index_count = accessor.count;
    }
    {
        const auto& vertBuffs = ia->getVertexBuffers();
        uint32_t vertIdx = buffers.size();
        buffers.insert(buffers.end(), vertBuffs.begin(), vertBuffs.end());

        // vertex buffer
        prim.vertex_buffer = vertIdx;

        auto& attrs = ia->getAttributes();
        for (const auto& attribute : attrs) {
            auto offset = ia->getVertexOffset();
            const auto& info = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attribute.format)];
            if (attribute.name == "a_position") {
                prim.position_offset = offset;
                prim.position_stride = info.size;
            } else if (attribute.name == "a_normal") {
                prim.normal_offset = offset;
                prim.normal_stride = info.size;
            } else if (attribute.name == "a_texCoord") {
                prim.uv_offset = offset;
                prim.uv_stride = info.size;
            }
        }
    }
    return std::move(prim);
}

void RayTracing::_buildRaytracingInstanceData() {
    auto& opaqueOrMaskInstanceIDs = _opaqueOrMaskInstanceIDs;
    auto& instances = _instances;
    auto& transforms = _transforms;
    auto& transformPrevs = _transformPrevs;

    opaqueOrMaskInstanceIDs.reserve(_instanceNum);
    instances.reserve(_instanceNum);
    _raytracingInstances.reserve(_instanceNum);
    _raytracingPrimitives.reserve(_instanceNum);

    _transforms.reserve(_instanceNum);
    _transformPrevs.reserve(_instanceNum);

    // for each mesh node, which contains one transform and one or more mesh primitives
    uint32_t numOpaqueOrMaskInstances = 0;
    uint32_t instanceID = 0;
    uint32_t transformID = 0;
}

MaterialProperty RayTracing::_getPassUniform(const IntrusivePtr<Pass>& pass, std::string name) {
    auto handle = pass->getHandle(name);
    return ccstd::get<float>(pass->getUniform(handle));
}

float RayTracing::_getPassUniformAsFloat(const IntrusivePtr<Pass>& pass, std::string name) {
    return ccstd::get<float>(_getPassUniform(pass, name));
}

void RayTracing::_addTexture(const IntrusivePtr<Pass>& pass, std::string name, uint32_t binding) {
    Texture tex{};
    tex.name = name;
    tex.source = pass->getDescriptorSet()->getTexture(binding);
    tex.sampler = pass->getDescriptorSet()->getSampler(binding);
    _description->textures.emplace_back(std::move(tex));
}

void RayTracing::_addMaterial(const IntrusivePtr<Pass>& pass) {
    const bool isTransparent = pass->getBlendState()->targets[0].blend;
    Material mat{};
    MaterialPbrMetallicRoughness pbrMetallic{};
    auto pbrBinding = pass->getBinding("pbrMap");
    if (pbrBinding != -1) {
        TextureInfo metallic{};
        metallic.index = _description->textures.size();
        pbrMetallic.metallicRoughnessTexture = std::move(metallic);
        pbrMetallic.metallicFactor = _getPassUniformAsFloat(pass, "metallic");
        pbrMetallic.roughnessFactor = _getPassUniformAsFloat(pass, "roughness");
        _addTexture(pass, "pbrMap", pbrBinding);
    }
    auto albedoBinding = pass->getBinding("mainTexture");
    if (albedoBinding != -1) {
        TextureInfo baseColInfo{};
        baseColInfo.index = _description->textures.size();
        pbrMetallic.baseColorTexture = std::move(baseColInfo);
        pbrMetallic.baseColorFactor = _getPassUniformAsFloat(pass, "albedoScale");
        _addTexture(pass, "mainTexture", albedoBinding);
    }
    mat.pbrMetallicRoughness = std::move(pbrMetallic);
    auto normalBinding = pass->getBinding("normalMap");
    if (normalBinding != -1) {
        MaterialNormalTextureInfo normalTexInfo{};
        normalTexInfo.index = _description->textures.size();
        normalTexInfo.scale = _getPassUniformAsFloat(pass, "normalStrength");
        mat.normalTexture = std::move(normalTexInfo);
        _addTexture(pass, "normalMap", normalBinding);
    }
    auto occlusionBinding = pass->getBinding("occlusionMap");
    if (occlusionBinding != -1) {
        MaterialOcclusionTextureInfo occlusionTex{};
        occlusionTex.index = _description->textures.size();
        occlusionTex.strength = _getPassUniformAsFloat(pass, "occlusion");
        mat.occlusionTexture = std::move(occlusionTex);
        _addTexture(pass, "occlusionMap", occlusionBinding);
    }
    auto emissiveBinding = pass->getBinding("emissiveMap");
    if (emissiveBinding != -1) {
        TextureInfo emissiveTexture{};
        emissiveTexture.index = _description->textures.size();
        mat.emissiveTexture = std::move(emissiveTexture);
        mat.emissiveFactor = ccstd::get<Vec3>(_getPassUniform(pass, "emissiveScale"));
        _addTexture(pass, "emissiveMap", emissiveBinding);
    }
    auto alphaCutoff = pass->getHandle("alphaThreshold");
    if (alphaCutoff != 0) {
        mat.alphaCutoff = _getPassUniformAsFloat(pass, "alphaThreshold");
    }
    mat.alphaMode = isTransparent ? AlphaMode::Blend : AlphaMode::Opaque;
    mat.doubleSided = pass->getRasterizerState()->cullMode == gfx::CullMode::NONE ? true : false;

    _materials.emplace_back(std::move(mat));
}

RayTracing::RayTracing(RenderScene* scene) : _renderScene(scene), _description(ccnew Description()) {}
void RayTracing::setRenderScene(RenderScene* scene) {
    _renderScene = scene;
    _description = ccnew Description();
}
} // namespace raytracing
} // namespace scene
} // namespace cc
