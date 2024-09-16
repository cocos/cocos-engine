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
    Root::getInstance()->on<Root::BeforeRender>([this](cc::Root* /*unused*/) {
        beforeRender();
    });
}
void RayTracing::beforeRender() {
    _description->clear();
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
            entity.mesh = static_cast<int>(_description->meshes.size());
            _description->scene.nodes.emplace_back(_description->nodes.size());
            _description->nodes.emplace_back(std::move(entity));

            meshPrimitives.emplace_back(buildRayTracingMeshPrimitive(subModel));
            const auto& wMat = model->getNode()->getWorldMatrix();
            _description->transforms.emplace_back(wMat);
            _description->transformPrev.emplace_back(wMat);
            InstanceInfo instance{};
            instance.meshPrimID = static_cast<uint32_t>(meshPrimitives.size() - 1);
            instance.transformID = _instanceNum;
            instance.meshID = _instanceNum;
            instance.meshPrimitiveLocalID = _instanceNum;
            _description->instances.emplace_back(instance);
            const auto& passes = *(subModel->getPasses());
            const auto passCount = passes.size();
            for (uint32_t passIdx = 0; passIdx < passCount; ++passIdx) {
                const auto& pass = passes[passIdx];
                if (pass->getPhase() != phaseID) continue;
                const bool isTransparent = pass->getBlendState()->targets[0].blend;
                if (!isTransparent) {
                    _description->opaqueOrMaskInstanceIDs.emplace_back(_instanceNum);
                }
                addMaterial(pass);
            } 
            _instanceNum++;
        }
    }
    buildRayTracingInstanceData();
}

MeshPrim RayTracing::buildRayTracingMeshPrimitive(const IntrusivePtr<SubModel>& subModel) {
    auto* subMesh = subModel->getSubMesh();
    auto& iaInfo = subMesh->getIaInfo();
    auto* ia = subModel->getInputAssembler();
    auto& accessors = _description->accessors;
    auto& bufferViews = _description->bufferViews;
    auto& buffers = _description->buffers;
    auto& meshes = _description->meshes;
    Mesh mesh{};
    mesh.subModel = subModel;
    
    meshes.emplace_back(std::move(mesh));
    MeshPrim prim{};
    {
        auto* indexBuffer = iaInfo.indexBuffer;
        auto idxBuff = static_cast<uint32_t>(buffers.size());
        buffers.emplace_back(indexBuffer);
        BufferView buffView{};
        buffView.byteOffset = 0;
        buffView.buffer = static_cast<int>(idxBuff);

        buffView.byteLength = static_cast<int>(indexBuffer->getCount() * sizeof(uint16_t));
        buffView.target = TargetType::ELEMENT_ARRAY_BUFFER;
        auto idxBuffView = static_cast<int>(bufferViews.size());
        bufferViews.emplace_back(std::move(buffView));
        Accessor accessor{};
        accessor.bufferView = idxBuffView;
        accessor.byteOffset = 0;
        accessor.componentType = ComponentType::UNSIGNED_SHORT;
        accessor.count = static_cast<int>(indexBuffer->getCount());
        accessor.type = "SCALAR";
        prim.index_buffer = idxBuff;
        prim.index_offset = 0;
        prim.index_stride = indexBuffer->getStride();
        prim.index_count = static_cast<uint32_t>(accessor.count);
        accessors.emplace_back(std::move(accessor));
    }
    {
        const auto& vertBuffs = ia->getVertexBuffers();
        auto vertIdx = static_cast<uint32_t>(buffers.size());
        buffers.insert(buffers.end(), vertBuffs.begin(), vertBuffs.end());

        // vertex buffer
        prim.vertex_buffer = vertIdx;

        const auto& attrs = ia->getAttributes();
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
    return prim;
}

void RayTracing::buildRayTracingInstanceData() {
    auto& opaqueOrMaskInstIDs = _description->opaqueOrMaskInstanceIDs;
    auto& inst = _description->instances;
    auto& transform = _description->transforms;
    auto& transPrev = _description->transformPrev;

    opaqueOrMaskInstIDs.reserve(_instanceNum);
    inst.reserve(_instanceNum);
    _description->rayTracingInstances.reserve(_instanceNum);
    _description->rayTracingPrimitives.reserve(_instanceNum);

    transform.reserve(_instanceNum);
    transPrev.reserve(_instanceNum);

    // for each mesh node, which contains one transform and one or more mesh primitives
    // uint32_t numOpaqueOrMaskInstances = 0;
    // uint32_t instanceID = 0;
    // uint32_t transformID = 0;
}

MaterialProperty RayTracing::getPassUniform(const IntrusivePtr<Pass>& pass, const std::string& name) {
    auto handle = pass->getHandle(name);
    return ccstd::get<float>(pass->getUniform(handle));
}

float RayTracing::getPassUniformAsFloat(const IntrusivePtr<Pass>& pass, const std::string& name) {
    return ccstd::get<float>(getPassUniform(pass, name));
}

void RayTracing::addTexture(const IntrusivePtr<Pass>& pass, const std::string& name, uint32_t binding) {
    Texture tex{};
    tex.name = name;
    tex.source = pass->getDescriptorSet()->getTexture(binding);
    tex.sampler = pass->getDescriptorSet()->getSampler(binding);
    _description->textures.emplace_back(std::move(tex));
}

void RayTracing::addMaterial(const IntrusivePtr<Pass>& pass) {
    const bool isTransparent = pass->getBlendState()->targets[0].blend;
    Material mat{};
    MaterialPbrMetallicRoughness pbrMetallic{};
    auto pbrBinding = pass->getBinding("pbrMap");
    if (pbrBinding != -1) {
        const TextureInfo metallic{
            static_cast<int>(_description->textures.size())
        };
        pbrMetallic.metallicRoughnessTexture = metallic;
        pbrMetallic.metallicFactor = getPassUniformAsFloat(pass, "metallic");
        pbrMetallic.roughnessFactor = getPassUniformAsFloat(pass, "roughness");
        addTexture(pass, "pbrMap", pbrBinding);
    }
    auto albedoBinding = pass->getBinding("mainTexture");
    if (albedoBinding != -1) {
        const TextureInfo baseColInfo{
            static_cast<int>(_description->textures.size())
        };
        pbrMetallic.baseColorTexture = baseColInfo;
        pbrMetallic.baseColorFactor = getPassUniformAsFloat(pass, "albedoScale");
        addTexture(pass, "mainTexture", albedoBinding);
    }
    mat.pbrMetallicRoughness = pbrMetallic;
    auto normalBinding = pass->getBinding("normalMap");
    if (normalBinding != -1) {
        const MaterialNormalTextureInfo normalTexInfo{
            static_cast<int>(_description->textures.size()),
            getPassUniformAsFloat(pass, "normalStrength")
        };
        mat.normalTexture = normalTexInfo;
        addTexture(pass, "normalMap", normalBinding);
    }
    auto occlusionBinding = pass->getBinding("occlusionMap");
    if (occlusionBinding != -1) {
        const MaterialOcclusionTextureInfo occlusionTex{
            static_cast<int>(_description->textures.size()),
            getPassUniformAsFloat(pass, "occlusion")
        };
        mat.occlusionTexture = occlusionTex;
        addTexture(pass, "occlusionMap", occlusionBinding);
    }
    auto emissiveBinding = pass->getBinding("emissiveMap");
    if (emissiveBinding != -1) {
        const TextureInfo emissiveTexture{
            static_cast<int>(_description->textures.size())
        };
        mat.emissiveTexture = emissiveTexture;
        mat.emissiveFactor = ccstd::get<Vec3>(getPassUniform(pass, "emissiveScale"));
        addTexture(pass, "emissiveMap", emissiveBinding);
    }
    auto alphaCutoff = pass->getHandle("alphaThreshold");
    if (alphaCutoff != 0) {
        mat.alphaCutoff = getPassUniformAsFloat(pass, "alphaThreshold");
    }
    mat.alphaMode = isTransparent ? AlphaMode::BLEND : AlphaMode::OPAQUE;
    mat.doubleSided = pass->getRasterizerState()->cullMode == gfx::CullMode::NONE;

    _description->materials.emplace_back(std::move(mat));
}

RayTracing::RayTracing(RenderScene* scene): _renderScene(scene), _description(ccnew Description()) {}
void RayTracing::setRenderScene(RenderScene* scene) {
    _renderScene = scene;
    _description = ccnew Description();
}
} // namespace raytracing
} // namespace scene
} // namespace cc
