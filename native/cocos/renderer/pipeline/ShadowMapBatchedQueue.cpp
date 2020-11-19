#include <array>

#include "BatchedBuffer.h"
#include "Define.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "RenderBatchedQueue.h"
#include "RenderInstancedQueue.h"
#include "ShadowMapBatchedQueue.h"
#include "forward/ForwardPipeline.h"
#include "forward/SceneCulling.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDevice.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
ShadowMapBatchedQueue::ShadowMapBatchedQueue(ForwardPipeline *pipeline)
: _phaseID(getPhaseID("shadow-caster")) {
    _pipeline = pipeline;
    _buffer = pipeline->getDescriptorSet()->getBuffer(UBOShadow::BINDING);
    _instancedQueue = CC_NEW(RenderInstancedQueue);
    _batchedQueue = CC_NEW(RenderBatchedQueue);
}

void ShadowMapBatchedQueue::gatherLightPasses(const Light *light, gfx::CommandBuffer *cmdBufferer) {
    clear();

    const auto *shadowInfo = _pipeline->getShadows();
    const auto &shadowObjects = _pipeline->getShadowObjects();
    if (light && shadowInfo->getShadowType() == ShadowType::SHADOWMAP) {
        updateUBOs(light, cmdBufferer);

        for (const auto ro : shadowObjects) {
            const auto *model = ro.model;

            switch (light->getType()) {
                case LightType::DIRECTIONAL:
                    add(model, cmdBufferer);
                    break;
                case LightType::SPOT:
                    if (model->getWorldBounds() &&
                        (aabb_aabb(model->getWorldBounds(), light->getAABB()) ||
                         aabb_frustum(model->getWorldBounds(), light->getFrustum()))) {
                        add(model, cmdBufferer);
                    }
                    break;
                default:;
            }
        }
    }
}

void ShadowMapBatchedQueue::clear() {
    _subModels.clear();
    _shaders.clear();
    _passes.clear();
    if (_instancedQueue) _instancedQueue->clear();
    if (_batchedQueue) _batchedQueue->clear();
}

void ShadowMapBatchedQueue::add(const ModelView *model, gfx::CommandBuffer *cmdBufferer) {
    // this assumes light pass index is the same for all submodels
    const auto shadowPassIdx = getShadowPassIndex(model);
    if (shadowPassIdx < 0) {
        return;
    }

    const auto subModelID = model->getSubModelID();
    const auto subModelCount = subModelID[0];
    for (unsigned m = 1; m <= subModelCount; ++m) {
        const auto subModel = model->getSubModelView(subModelID[m]);
        const auto pass = subModel->getPassView(shadowPassIdx);
        const auto batchingScheme = pass->getBatchingScheme();
        subModel->getDescriptorSet()->bindBuffer(UBOShadow::BINDING, _buffer);
        subModel->getDescriptorSet()->update();

        if (batchingScheme == BatchingSchemes::INSTANCING) {
            auto *instancedBuffer = InstancedBuffer::get(subModel->passID[shadowPassIdx]);
            instancedBuffer->merge(model, subModel, shadowPassIdx);
            _instancedQueue->add(instancedBuffer);
        } else if (batchingScheme == BatchingSchemes::VB_MERGING) {
            auto *batchedBuffer = BatchedBuffer::get(subModel->passID[shadowPassIdx]);
            batchedBuffer->merge(subModel, shadowPassIdx, model);
            _batchedQueue->add(batchedBuffer);
        } else { // standard draw
            _subModels.emplace_back(subModel);
            _shaders.emplace_back(subModel->getShader(shadowPassIdx));
            _passes.emplace_back(pass);
        }
    }

    _instancedQueue->uploadBuffers(cmdBufferer);
    _batchedQueue->uploadBuffers(cmdBufferer);
}

void ShadowMapBatchedQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) const {
    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);
    _batchedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);

    for (size_t i = 0; i < _subModels.size(); i++) {
        const auto subModel = _subModels[i];
        const auto shader = _shaders[i];
        const auto pass = _passes[i];
        const auto ia = subModel->getInputAssembler();
        const auto pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);

        cmdBuffer->bindPipelineState(pso);
        cmdBuffer->bindDescriptorSet(MATERIAL_SET, pass->getDescriptorSet());
        cmdBuffer->bindDescriptorSet(LOCAL_SET, subModel->getDescriptorSet());
        cmdBuffer->bindInputAssembler(ia);
        cmdBuffer->draw(ia);
    }
}

void ShadowMapBatchedQueue::destroy() {
    CC_SAFE_DELETE(_batchedQueue);

    CC_SAFE_DELETE(_instancedQueue);

    _buffer = nullptr;
}

void ShadowMapBatchedQueue::updateUBOs(const Light *light, gfx::CommandBuffer *cmdBufferer) const {
    const auto *shadowInfo = _pipeline->getShadows();
    auto shadowUBO = _pipeline->getShadowUBO();
    auto *device = gfx::Device::getInstance();

    switch (light->getType()) {
        case LightType::DIRECTIONAL: {
            cc::Mat4 matShadowCamera;

            float x = 0.0f, y = 0.0f, farClamp = 0.0f;
            if (shadowInfo->autoAdapt) {
                Vec3 tmpCenter;
                getShadowWorldMatrix(_pipeline->getSphere(), light->getNode()->worldRotation, light->direction, matShadowCamera, tmpCenter);

                const auto radius = _pipeline->getSphere()->radius;
                x = radius * shadowInfo->aspect;
                y = radius;

                const float halfFar = tmpCenter.distance(_pipeline->getSphere()->center);
                farClamp = std::min(halfFar * COEFFICIENT_OF_EXPANSION, SHADOW_CAMERA_MAX_FAR);
            } else {
                matShadowCamera = light->getNode()->worldMatrix;

                x = shadowInfo->orthoSize * shadowInfo->aspect;
                y = shadowInfo->orthoSize;

                farClamp = shadowInfo->farValue;
            }

            const auto matShadowView = matShadowCamera.getInversed();

            cc::Mat4 matShadowViewProj;
            const auto projectionSinY = device->getScreenSpaceSignY() * device->getUVSpaceSignY();
            Mat4::createOrthographicOffCenter(-x, x, -y, y, shadowInfo->nearValue, shadowInfo->farValue, device->getClipSpaceMinZ(), projectionSinY, &matShadowViewProj);

            matShadowViewProj.multiply(matShadowView);
            memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));
        } break;
        case LightType::SPOT: {
            const auto &matShadowCamera = light->getNode()->worldMatrix;

            const auto matShadowView = matShadowCamera.getInversed();

            cc::Mat4 matShadowViewProj;
            cc::Mat4::createPerspective(light->spotAngle, light->aspect, 0.001f, light->range, &matShadowViewProj);

            matShadowViewProj.multiply(matShadowView);
            memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));
        } break;
        default:;
    }

    float shadowInfos[4] = {shadowInfo->size.x, shadowInfo->size.y, (float)shadowInfo->pcfType, shadowInfo->bias};
    memcpy(shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, &shadowInfo->color, sizeof(Vec4));
    memcpy(shadowUBO.data() + UBOShadow::SHADOW_INFO_OFFSET, &shadowInfos, sizeof(shadowInfos));

    cmdBufferer->updateBuffer(_pipeline->getDescriptorSet()->getBuffer(UBOShadow::BINDING), shadowUBO.data(), UBOShadow::SIZE);
}

int ShadowMapBatchedQueue::getShadowPassIndex(const ModelView *model) const {
    const auto subModelArrayID = model->getSubModelID();
    const auto count = subModelArrayID[0];
    for (unsigned i = 1; i <= count; i++) {
        const auto subModel = model->getSubModelView(subModelArrayID[i]);
        for (unsigned passIdx = 0; passIdx < subModel->passCount; passIdx++) {
            const auto pass = subModel->getPassView(passIdx);
            if (pass->phase == _phaseID) {
                return passIdx;
            }
        }
    }
    return -1;
}

} // namespace pipeline
} // namespace cc
