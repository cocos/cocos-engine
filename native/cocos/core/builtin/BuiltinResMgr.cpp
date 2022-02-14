#include "core/builtin/BuiltinResMgr.h"
#include "core/assets/EffectAsset.h"
#include "core/assets/ImageAsset.h"
#include "core/assets/Material.h"
#include "core/assets/Texture2D.h"
#include "core/assets/TextureCube.h"
#include "core/builtin/Effects.h"
#include "core/builtin/ShaderSourceAssembly.h"
#include "core/data/deserializer/AssetDeserializerFactory.h"
#include "math/Color.h"
#include "platform/Image.h"
#include "rapidjson/document.h"
#include "renderer/core/ProgramLib.h"
#include "scene/Pass.h"

namespace cc {

namespace {
constexpr uint8_t BLACK_IMAGE_RGBA_DATA_2X2[2 * 2 * 4] = {
    // r, g, b, a
    0x00, 0x00, 0x00, 0xFF,
    0x00, 0x00, 0x00, 0xFF,
    0x00, 0x00, 0x00, 0xFF,
    0x00, 0x00, 0x00, 0xFF};

constexpr uint8_t GREY_IMAGE_RGBA_DATA_2X2[2 * 2 * 4] = {
    0x77, 0x77, 0x77, 0xFF,
    0x77, 0x77, 0x77, 0xFF,
    0x77, 0x77, 0x77, 0xFF,
    0x77, 0x77, 0x77, 0xFF};

constexpr uint8_t WHITE_IMAGE_RGBA_DATA_2X2[2 * 2 * 4] = {
    0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF};

constexpr uint8_t NORMAL_IMAGE_RGBA_DATA_2X2[2 * 2 * 4] = {
    0x7F, 0x7F, 0xFF, 0xFF,
    0x7F, 0x7F, 0xFF, 0xFF,
    0x7F, 0x7F, 0xFF, 0xFF,
    0x7F, 0x7F, 0xFF, 0xFF};

constexpr uint8_t EMPTY_IMAGE_RGBA_DATA_2X2[2 * 2 * 4] = {
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00};

const uint8_t DEFAULT_IMAGE_RGBA_DATA_16X16[16 * 16 * 4] = {
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF, 0xDD, 0xDD, 0xDD, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF,
    0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF, 0x55, 0x55, 0x55, 0xFF};

} // namespace

BuiltinResMgr *BuiltinResMgr::instance = nullptr;

/* static */
BuiltinResMgr *BuiltinResMgr::getInstance() {
    if (BuiltinResMgr::instance == nullptr) {
        BuiltinResMgr::instance = new BuiltinResMgr();
        BuiltinResMgr::instance->addRef();
    }
    return instance;
}

void BuiltinResMgr::destroyInstance() {
    CC_SAFE_RELEASE_NULL(BuiltinResMgr::instance);
}

Asset *BuiltinResMgr::getAsset(const std::string &uuid) {
    auto iter = _resources.find(uuid);
    if (iter != _resources.end()) {
        return iter->second.get();
    }

    return nullptr;
}

bool BuiltinResMgr::initBuiltinRes(gfx::Device *device) {
    if (_isInitialized) {
        return true;
    }

    _isInitialized = true;

    // NOTE:  C++ use const array to store color value, no need to synchronize ts's valueView logic

    // black texture
    initTexture2DWithUuid("black-texture", BLACK_IMAGE_RGBA_DATA_2X2, sizeof(BLACK_IMAGE_RGBA_DATA_2X2), 2, 2, 4);

    // empty texture
    initTexture2DWithUuid("empty-texture", EMPTY_IMAGE_RGBA_DATA_2X2, sizeof(EMPTY_IMAGE_RGBA_DATA_2X2), 2, 2, 4);

    // grey texture
    initTexture2DWithUuid("grey-texture", GREY_IMAGE_RGBA_DATA_2X2, sizeof(GREY_IMAGE_RGBA_DATA_2X2), 2, 2, 4);

    // white texture
    initTexture2DWithUuid("white-texture", WHITE_IMAGE_RGBA_DATA_2X2, sizeof(WHITE_IMAGE_RGBA_DATA_2X2), 2, 2, 4);

    // normal texture
    initTexture2DWithUuid("normal-texture", NORMAL_IMAGE_RGBA_DATA_2X2, sizeof(NORMAL_IMAGE_RGBA_DATA_2X2), 2, 2, 4);

    // default texture
    initTexture2DWithUuid("default-texture", DEFAULT_IMAGE_RGBA_DATA_16X16, sizeof(DEFAULT_IMAGE_RGBA_DATA_16X16), 16, 16, 4);

    // white cube texture
    initTextureCubeWithUuid("white-cube-texture", WHITE_IMAGE_RGBA_DATA_2X2, sizeof(WHITE_IMAGE_RGBA_DATA_2X2), 2, 2, 4);

    // default cube texture
    initTextureCubeWithUuid("default-cube-texture", DEFAULT_IMAGE_RGBA_DATA_16X16, sizeof(DEFAULT_IMAGE_RGBA_DATA_16X16), 16, 16, 4);

    //cjh TODO:    if (SpriteFrame) {
    //        const spriteFrame = new SpriteFrame() as SpriteFrame;
    //        const image = imgAsset;
    //        const texture = new Texture2D();
    //        texture.image = image;
    //        spriteFrame.texture = texture;
    //        spriteFrame._uuid = 'default-spriteframe";
    //        resources[spriteFrame->getUuid()] = spriteFrame;
    //    }
    //
    const char *shaderVersionKey = getDeviceShaderVersion(device);
    if (nullptr == shaderVersionKey || 0 == strlen(shaderVersionKey)) {
        CC_LOG_ERROR("Failed to initialize builtin shaders: unknown device.");
        return false;
    }
    //
    const ShaderSource *shaderSources = nullptr;
    const auto          iter          = ShaderSourceAssembly::get().find(shaderVersionKey);
    if (iter != ShaderSourceAssembly::get().cend()) {
        shaderSources = iter->second;
    }

    if (nullptr == shaderSources) {
        CC_LOG_ERROR("Current device is requiring builtin shaders of version %s, but shaders of that version are not assembled in this build.", shaderVersionKey);
        return false;
    }
    //
    //    return Promise.resolve().then(() => {

    rapidjson::Document doc;
    doc.Parse(BUILTIN_EFFECTS.value().c_str());

    index_t         effectIndex       = 0;
    rapidjson::Type type              = doc.GetType();
    auto            assetDeserializer = AssetDeserializerFactory::createAssetDeserializer(DeserializeAssetType::EFFECT);
    for (const auto &e : doc.GetArray()) {
        IntrusivePtr<EffectAsset> effect = new EffectAsset();
        assetDeserializer->deserialize(e, effect);

        index_t shaderIndex = 0;
        for (auto &shaderInfo : effect->_shaders) {
            const auto &shaderSource = (*shaderSources)[effectIndex][shaderIndex];
            if (!shaderSource.empty()) {
                if (0 == strcmp(shaderVersionKey, "glsl1")) {
                    shaderInfo.glsl1.vert = shaderSource.at("vert").value();
                    shaderInfo.glsl1.frag = shaderSource.at("frag").value();
                } else if (0 == strcmp(shaderVersionKey, "glsl3")) {
                    shaderInfo.glsl3.vert = shaderSource.at("vert").value();
                    shaderInfo.glsl3.frag = shaderSource.at("frag").value();
                } else if (0 == strcmp(shaderVersionKey, "glsl4")) {
                    shaderInfo.glsl4.vert = shaderSource.at("vert").value();
                    shaderInfo.glsl4.frag = shaderSource.at("frag").value();
                }
            }
            ++shaderIndex;
        }

        effect->hideInEditor = true;
        effect->onLoaded();

        ++effectIndex;
    }

    initMaterials();

    return true;
}

void BuiltinResMgr::initMaterials() {
    auto &resources = _resources;

    // standard material
    auto *standardMtl = new Material();
    standardMtl->setUuid("standard-material");
    IMaterialInfo standardInfo;
    standardInfo.effectName = std::string{"standard"};
    standardMtl->initialize(standardInfo);
    resources[standardMtl->getUuid()] = standardMtl;
    _materialsToBeCompiled.emplace_back(standardMtl);

    // material indicating missing effect (yellow)
    auto *        missingEfxMtl = new Material();
    IMaterialInfo missingEfxInfo;
    missingEfxInfo.effectName = std::string{"unlit"};
    missingEfxInfo.defines    = IMaterialInfo::DefinesType{
        MacroRecord{
            {"USE_COLOR", true}}};
    missingEfxMtl->setUuid("missing-effect-material");
    missingEfxMtl->initialize(missingEfxInfo);
    missingEfxMtl->setProperty("mainColor", Color{255, 255, 0, 255}); // #ffff00;
    resources[missingEfxMtl->getUuid()] = missingEfxMtl;
    _materialsToBeCompiled.emplace_back(missingEfxMtl);

    // material indicating missing material (purple)
    auto *        missingMtl = new Material();
    IMaterialInfo missingInfo;
    missingInfo.effectName = std::string{"unlit"},
    missingInfo.defines    = IMaterialInfo::DefinesType{MacroRecord{
        {"USE_COLOR", true}}};
    missingMtl->setUuid("missing-material");
    missingMtl->initialize(missingInfo);
    missingMtl->setProperty("mainColor", Color{255, 0, 255, 255}); // #ff00ff
    resources[missingMtl->getUuid()] = missingMtl;
    _materialsToBeCompiled.emplace_back(missingMtl);

    auto *        clearStencilMtl = new Material();
    IMaterialInfo clearStencilInfo;
    clearStencilInfo.effectName = std::string{"clear-stencil"},
    clearStencilInfo.defines    = IMaterialInfo::DefinesType{MacroRecord{
        {"USE_TEXTURE", false}}};
    clearStencilMtl->setUuid("default-clear-stencil");
    clearStencilMtl->initialize(clearStencilInfo);
    resources[clearStencilMtl->getUuid()] = clearStencilMtl;
    _materialsToBeCompiled.emplace_back(clearStencilMtl);

    // sprite material
    auto *spriteMtl = new Material();
    spriteMtl->setUuid("ui-base-material");
    IMaterialInfo spriteInfo;
    spriteInfo.effectName = std::string{"sprite"},
    spriteInfo.defines    = IMaterialInfo::DefinesType{MacroRecord{{"USE_TEXTURE", false}}};
    spriteMtl->initialize(spriteInfo);
    resources[spriteMtl->getUuid()] = spriteMtl;
    _materialsToBeCompiled.emplace_back(spriteMtl);

    // sprite material
    auto *spriteColorMtl = new Material();
    spriteColorMtl->setUuid("ui-sprite-material");
    IMaterialInfo spriteColorInfo;
    spriteColorInfo.effectName = std::string{"sprite"},
    spriteColorInfo.defines    = IMaterialInfo::DefinesType{MacroRecord{{"USE_TEXTURE", true}, {"CC_USE_EMBEDDED_ALPHA", false}, {"IS_GRAY", false}}};
    spriteColorMtl->initialize(spriteColorInfo);
    resources[spriteColorMtl->getUuid()] = spriteColorMtl;
    _materialsToBeCompiled.emplace_back(spriteColorMtl);

    // sprite alpha test material
    auto *        alphaTestMaskMtl = new Material();
    IMaterialInfo alphaTestMaskInfo;
    alphaTestMaskInfo.effectName = std::string{"sprite"},
    alphaTestMaskInfo.defines    = IMaterialInfo::DefinesType{MacroRecord{
        {"USE_TEXTURE", true}, {"USE_ALPHA_TEST", true}, {"CC_USE_EMBEDDED_ALPHA", false}, {"IS_GRAY", false}}};
    alphaTestMaskMtl->setUuid("ui-alpha-test-material");
    alphaTestMaskMtl->initialize(alphaTestMaskInfo);
    resources[alphaTestMaskMtl->getUuid()] = alphaTestMaskMtl;
    _materialsToBeCompiled.emplace_back(alphaTestMaskMtl);

    // sprite gray material
    auto *spriteGrayMtl = new Material();
    spriteGrayMtl->setUuid("ui-sprite-gray-material");
    IMaterialInfo spriteGrayInfo;
    spriteGrayInfo.effectName = std::string{"sprite"},
    spriteGrayInfo.defines    = IMaterialInfo::DefinesType{MacroRecord{{"USE_TEXTURE", true}, {"CC_USE_EMBEDDED_ALPHA", false}, {"IS_GRAY", true}}};
    spriteGrayMtl->initialize(spriteGrayInfo);
    resources[spriteGrayMtl->getUuid()] = spriteGrayMtl;
    _materialsToBeCompiled.emplace_back(spriteGrayMtl);

    // sprite alpha material
    auto *spriteAlphaMtl = new Material();
    spriteAlphaMtl->setUuid("ui-sprite-alpha-sep-material");
    IMaterialInfo spriteAlphaInfo;
    spriteAlphaInfo.effectName = std::string{"sprite"},
    spriteAlphaInfo.defines    = IMaterialInfo::DefinesType{MacroRecord{{"USE_TEXTURE", true}, {"CC_USE_EMBEDDED_ALPHA", true}, {"IS_GRAY", false}}};
    spriteAlphaMtl->initialize(spriteAlphaInfo);
    resources[spriteAlphaMtl->getUuid()] = spriteAlphaMtl;
    _materialsToBeCompiled.emplace_back(spriteAlphaMtl);

    // sprite alpha & gray material
    auto *        spriteAlphaGrayMtl = new Material();
    IMaterialInfo spriteAlphaGrayInfo;
    spriteAlphaGrayInfo.effectName = std::string{"sprite"},
    spriteAlphaGrayInfo.defines    = IMaterialInfo::DefinesType{MacroRecord{
        {"USE_TEXTURE", true}, {"CC_USE_EMBEDDED_ALPHA", true}, {"IS_GRAY", true}}};
    spriteAlphaGrayMtl->setUuid("ui-sprite-gray-alpha-sep-material");
    spriteAlphaGrayMtl->initialize(spriteAlphaGrayInfo);
    resources[spriteAlphaGrayMtl->getUuid()] = spriteAlphaGrayMtl;
    _materialsToBeCompiled.emplace_back(spriteAlphaGrayMtl);

    // ui graphics material
    auto *defaultGraphicsMtl = new Material();
    defaultGraphicsMtl->setUuid("ui-graphics-material");
    IMaterialInfo defaultGraphicsInfo;
    defaultGraphicsInfo.effectName = std::string{"graphics"};
    defaultGraphicsMtl->initialize(defaultGraphicsInfo);
    resources[defaultGraphicsMtl->getUuid()] = defaultGraphicsMtl;
    _materialsToBeCompiled.emplace_back(defaultGraphicsMtl);

#if UI_GPU_DRIVEN
    // sprite material
    auto *spriteGPUMtl = new Material();
    spriteGPUMtl->setUuid("ui-base-gpu-material");
    IMaterialInfo spriteGPUMtlInfo{
        .defines    = IMaterialInfo::DefinesType{MacroRecord{{"USE_TEXTURE", false}}},
        .effectName = std::string{"sprite-gpu"}};
    spriteGPUMtl->initialize(spriteGPUMtlInfo);
    resources[spriteGPUMtl->getUuid()] = spriteGPUMtl;
    _materialsToBeCompiled.emplace_back(spriteGPUMtl);

    // sprite material
    auto *spriteColorGPUMtl = new Material();
    spriteColorGPUMtl->setUuid("ui-sprite-gpu-material");
    IMaterialInfo spriteColorGPUMtlInfo{
        .defines    = IMaterialInfo::DefinesType{MacroRecord{{"USE_TEXTURE", true}, {"CC_USE_EMBEDDED_ALPHA", false}, {"IS_GRAY", false}}},
        .effectName = std::string{"sprite-gpu"}};
    spriteColorGPUMtl->initialize(spriteColorGPUMtlInfo);
    resources[spriteColorGPUMtl->getUuid()] = spriteColorGPUMtl;
    _materialsToBeCompiled.emplace_back(spriteColorGPUMtl);

    // sprite gray material
    auto *spriteGrayGPUMtl = new Material();
    spriteGrayGPUMtl->setUuid("ui-sprite-gray-gpu-material");
    IMaterialInfo spriteGrayGPUMtlInfo{
        .defines    = IMaterialInfo::DefinesType{MacroRecord{{"USE_TEXTURE", true}, {"CC_USE_EMBEDDED_ALPHA", false}, {"IS_GRAY", true}}},
        .effectName = std::string{"sprite-gpu"}};
    spriteGrayGPUMtl->initialize(spriteGrayGPUMtlInfo);
    resources[spriteGrayGPUMtl->getUuid()] = spriteGrayGPUMtl;
    _materialsToBeCompiled.emplace_back(spriteGrayGPUMtl);

    // sprite alpha material
    auto *spriteAlphaGPUMtl = new Material();
    spriteAlphaGPUMtl->setUuid("ui-sprite-alpha-sep-gpu-material");

    IMaterialInfo spriteAlphaGPUMtlInfo{
        .defines    = IMaterialInfo::DefinesType{MacroRecord{{"USE_TEXTURE", true}, {"CC_USE_EMBEDDED_ALPHA", true}, {"IS_GRAY", false}}},
        .effectName = std::string{"sprite-gpu"}};
    spriteAlphaGPUMtl->initialize(spriteAlphaGPUMtlInfo);
    resources[spriteAlphaGPUMtl->getUuid()] = spriteAlphaGPUMtl;
    _materialsToBeCompiled.emplace_back(spriteAlphaGPUMtl);

    // sprite alpha & gray material
    auto *spriteAlphaGrayGPUMtl = new Material();
    spriteAlphaGrayGPUMtl->setUuid("ui-sprite-gray-alpha-sep-gpu-material");
    spriteAlphaGrayGPUMtl->initialize({.defines    = IMaterialInfo::DefinesType{MacroRecord{{"USE_TEXTURE", true}, {"CC_USE_EMBEDDED_ALPHA", true}, {"IS_GRAY", true}}},
                                       .effectName = std::string{"sprite-gpu"}});
    resources[spriteAlphaGrayGPUMtl->getUuid()] = spriteAlphaGrayGPUMtl;
    _materialsToBeCompiled.emplace_back(spriteAlphaGrayGPUMtl);
#endif

    // default particle material
    auto *defaultParticleMtl = new Material();
    defaultParticleMtl->setUuid("default-particle-material");
    IMaterialInfo defaultParticleInfo;
    defaultParticleInfo.effectName = std::string{"particle"};
    defaultParticleMtl->initialize(defaultParticleInfo);
    resources[defaultParticleMtl->getUuid()] = defaultParticleMtl;
    _materialsToBeCompiled.emplace_back(defaultParticleMtl);

    // default particle gpu material
    auto *defaultParticleGPUMtl = new Material();
    defaultParticleGPUMtl->setUuid("default-particle-gpu-material");
    IMaterialInfo defaultParticleGPUInfo;
    defaultParticleGPUInfo.effectName = std::string{"particle-gpu"};
    defaultParticleGPUMtl->initialize(defaultParticleGPUInfo);
    resources[defaultParticleGPUMtl->getUuid()] = defaultParticleGPUMtl;
    _materialsToBeCompiled.emplace_back(defaultParticleGPUMtl);

    // default particle material
    auto *defaultTrailMtl = new Material();
    defaultTrailMtl->setUuid("default-trail-material");
    IMaterialInfo defaultTrailInfo;
    defaultTrailInfo.effectName = std::string{"particle-trail"};
    defaultTrailMtl->initialize(defaultTrailInfo);
    resources[defaultTrailMtl->getUuid()] = defaultTrailMtl;
    _materialsToBeCompiled.emplace_back(defaultTrailMtl);

    // default particle material
    auto *defaultBillboardMtl = new Material();
    defaultBillboardMtl->setUuid("default-billboard-material");
    IMaterialInfo defaultBillboardInfo;
    defaultBillboardInfo.effectName = std::string{"billboard"};
    defaultBillboardMtl->initialize(defaultBillboardInfo);
    resources[defaultBillboardMtl->getUuid()] = defaultBillboardMtl;
    _materialsToBeCompiled.emplace_back(defaultBillboardMtl);

    // ui spine two color material
    auto *spineTwoColorMtl = new Material();
    spineTwoColorMtl->setUuid("default-spine-material");
    IMaterialInfo spineTwoColorInfo;
    spineTwoColorInfo.effectName = std::string{"spine"},
    spineTwoColorInfo.defines    = IMaterialInfo::DefinesType{MacroRecord{
        {"USE_TEXTURE", true},
        {"CC_USE_EMBEDDED_ALPHA", false},
        {"IS_GRAY", false},
    }};
    spineTwoColorMtl->initialize(spineTwoColorInfo);
    resources[spineTwoColorMtl->getUuid()] = spineTwoColorMtl;
    _materialsToBeCompiled.emplace_back(spineTwoColorMtl);
    //
    //cjh TODO:    game.on(Game.EVENT_GAME_INITED, () => {
    tryCompileAllPasses();
    //    });
}

void BuiltinResMgr::tryCompileAllPasses() {
    for (auto &mat : _materialsToBeCompiled) {
        auto &passes = *mat->getPasses();
        for (auto &pass : passes) {
            pass->tryCompile();
        }
    }
}

void BuiltinResMgr::initTexture2DWithUuid(const std::string &uuid, const uint8_t *data, size_t dataBytes, uint32_t width, uint32_t height, uint32_t bytesPerPixel) {
    IMemoryImageSource imageSource;
    imageSource.width      = width;
    imageSource.height     = height;
    imageSource.data       = new (std::nothrow) ArrayBuffer(data, dataBytes);
    imageSource.compressed = false;
    imageSource.format     = PixelFormat::RGBA8888;

    auto *texture = new (std::nothrow) Texture2D();
    if (texture) {
        texture->setUuid(uuid);

        auto *imgAsset = new (std::nothrow) ImageAsset();
        imgAsset->setNativeAsset(imageSource);
        texture->setImage(imgAsset);

        texture->initialize();
        _resources.emplace(texture->getUuid(), texture);
    }
}

void BuiltinResMgr::initTextureCubeWithUuid(const std::string &uuid, const uint8_t *data, size_t dataBytes, uint32_t width, uint32_t height, uint32_t bytesPerPixel) {
    IMemoryImageSource imageSource;
    imageSource.width      = width;
    imageSource.height     = height;
    imageSource.data       = new (std::nothrow) ArrayBuffer(data, dataBytes);
    imageSource.compressed = false;
    imageSource.format     = PixelFormat::RGBA8888;

    auto *texture = new (std::nothrow) TextureCube();
    if (texture) {
        texture->setUuid(uuid);
        texture->setMipFilter(TextureCube::Filter::NEAREST);

        ITextureCubeMipmap mipmap;
        mipmap.front = new ImageAsset();
        mipmap.front->setNativeAsset(imageSource);
        mipmap.back = new ImageAsset();
        mipmap.back->setNativeAsset(imageSource);
        mipmap.left = new ImageAsset();
        mipmap.left->setNativeAsset(imageSource);
        mipmap.right = new ImageAsset();
        mipmap.right->setNativeAsset(imageSource);
        mipmap.top = new ImageAsset();
        mipmap.top->setNativeAsset(imageSource);
        mipmap.bottom = new ImageAsset();
        mipmap.bottom->setNativeAsset(imageSource);

        texture->setImage(mipmap);

        texture->initialize();
        _resources.emplace(texture->getUuid(), texture);
    }
}

} // namespace cc
