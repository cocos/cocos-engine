#include "cocos-spine/spine-skeleton-ui-renderer.h"
#include "2d/renderer/RenderDrawInfo.h"
#include "2d/renderer/RenderEntity.h"
#include "2d/renderer/UIMeshBuffer.h"
#include "2d/renderer/Batcher2d.h"
#include "core/Root.h"
#include "renderer/core/MaterialInstance.h"

const static uint16_t ACCID = 65533;
using namespace cc::gfx;
using namespace cc;
namespace spine {

static const std::vector<gfx::Attribute> ATTRIBUTES_V3F_T2F_C4B{
    gfx::Attribute{gfx::ATTR_NAME_POSITION, gfx::Format::RGB32F},
    gfx::Attribute{gfx::ATTR_NAME_TEX_COORD, gfx::Format::RG32F},
    gfx::Attribute{gfx::ATTR_NAME_COLOR, gfx::Format::RGBA8, true},
};

SpineSkeletonUIRenderer::SpineSkeletonUIRenderer() {

}

SpineSkeletonUIRenderer::~SpineSkeletonUIRenderer() {
    onDestroy();
}

void SpineSkeletonUIRenderer::onDestroy() {
    for (auto *draw : _drawInfoArray) {
        CC_SAFE_DELETE(draw);
    }
    if (_uiMesh) {
        auto *batch2d = cc::Root::getInstance()->getBatcher2D();
        batch2d->removeMeshBuffer(ACCID, _uiMesh);
        delete _uiMesh;
        _uiMesh = nullptr;
    }
    destroyMaterialCaches();
}

void SpineSkeletonUIRenderer::destroyMaterialCaches() {
    for (auto &item : _materialCaches) {
        CC_SAFE_DELETE(item.second);
    }
    _materialCaches.clear();
}

void SpineSkeletonUIRenderer::setRenderEntity(cc::RenderEntity *entity) {
    _entity = entity;
}

void SpineSkeletonUIRenderer::updateMeshData(spine::SpineSkeletonModelData* mesh) {
    if (!_uiMesh) {
        _uiMesh = new UIMeshBuffer();
        ccstd::vector<gfx::Attribute> attrs = ATTRIBUTES_V3F_T2F_C4B;
        _uiMesh->initialize(std::move(attrs), true);
        auto *batch2d = cc::Root::getInstance()->getBatcher2D();
        batch2d->addMeshBuffer(ACCID, _uiMesh);
    }

    _uiMesh->setVData((float*)mesh->vBuf.data());
    _uiMesh->setIData((uint16_t*)mesh->iBuf.data());
    uint32_t byteOffset = mesh->vCount * mesh->byteStride;
    _uiMesh->setByteOffset(byteOffset);

    _entity->clearDynamicRenderDrawInfos();
    auto blendList = mesh->blendList;
    auto drawSize = blendList.size();
    for (int i = 0; i < drawSize; i++) {
        auto blend = blendList[i].blendMode;
        auto iOffset = blendList[i].indexOffset;
        auto iCount = blendList[i].indexCount;
        auto *curDrawInfo = requestDrawInfo(i);
        auto material = requestMaterial(blend);
        curDrawInfo->setMaterial(material);
        gfx::Texture *texture = _texture->getGFXTexture();
        gfx::Sampler *sampler = _texture->getGFXSampler();
        curDrawInfo->setTexture(texture);
        curDrawInfo->setSampler(sampler);

        curDrawInfo->setMeshBuffer(_uiMesh);
        curDrawInfo->setIndexOffset(iOffset);
        curDrawInfo->setIbCount(iCount);

        _entity->addDynamicRenderDrawInfo(curDrawInfo);
    }
}

cc::RenderDrawInfo *SpineSkeletonUIRenderer::requestDrawInfo(int idx) {
    if (_drawInfoArray.size() < idx + 1) {
        cc::RenderDrawInfo *draw = new cc::RenderDrawInfo();
        draw->setDrawInfoType(static_cast<uint32_t>(RenderDrawInfoType::MIDDLEWARE));
        _drawInfoArray.push_back(draw);
    }
    return _drawInfoArray[idx];
}

cc::Material *SpineSkeletonUIRenderer::requestMaterial(uint32_t blendMode) {
    bool _premultipliedAlpha = true;
    uint16_t blendSrc, blendDst;
    switch (blendMode) {
        case spine::BlendMode::BlendMode_Additive:
            blendSrc = static_cast<uint16_t>(_premultipliedAlpha ? BlendFactor::ONE : BlendFactor::SRC_ALPHA);
            blendDst = static_cast<uint16_t>(BlendFactor::ONE);
            break;
        case spine::BlendMode::BlendMode_Multiply:
            blendSrc = static_cast<uint16_t>(BlendFactor::DST_COLOR);
            blendDst = static_cast<uint16_t>(BlendFactor::ONE_MINUS_SRC_ALPHA);
            break;
        case spine::BlendMode::BlendMode_Screen:
            blendSrc = static_cast<uint16_t>(BlendFactor::ONE);
            blendDst = static_cast<uint16_t>(BlendFactor::ONE_MINUS_SRC_COLOR);
            break;
        default:
            blendSrc = static_cast<uint16_t>(_premultipliedAlpha ? BlendFactor::ONE : BlendFactor::SRC_ALPHA);
            blendDst = static_cast<uint16_t>(BlendFactor::ONE_MINUS_SRC_ALPHA);
    }
    return requestMaterial(blendSrc, blendDst);
}

cc::Material *SpineSkeletonUIRenderer::requestMaterial(uint16_t blendSrc, uint16_t blendDst) {
    uint32_t key = static_cast<uint32_t>(blendSrc) << 16 | static_cast<uint32_t>(blendDst);
    if (_materialCaches.find(key) == _materialCaches.end()) {
        const IMaterialInstanceInfo info{ (Material *)_material, 0};
        MaterialInstance *materialInstance = new MaterialInstance(info);
        PassOverrides overrides;
        BlendStateInfo stateInfo;
        stateInfo.blendColor = gfx::Color{1.0F, 1.0F, 1.0F, 1.0F};
        BlendTargetInfo targetInfo;
        targetInfo.blendEq = gfx::BlendOp::ADD;
        targetInfo.blendAlphaEq = gfx::BlendOp::ADD;
        targetInfo.blendSrc = (gfx::BlendFactor)blendSrc;
        targetInfo.blendDst = (gfx::BlendFactor)blendDst;
        targetInfo.blendSrcAlpha = (gfx::BlendFactor)blendSrc;
        targetInfo.blendDstAlpha = (gfx::BlendFactor)blendDst;
        BlendTargetInfoList targetList{targetInfo};
        stateInfo.targets = targetList;
        overrides.blendState = stateInfo;
        materialInstance->overridePipelineStates(overrides);
        const MacroRecord macros{{"TWO_COLORED", false}, {"USE_LOCAL", true}};
        materialInstance->recompileShaders(macros);
        _materialCaches[key] = materialInstance;
    }
    return _materialCaches[key];
}

} // namespace spine
