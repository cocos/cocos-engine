#include "jsb_creator_physics_manual.hpp"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/manual/jsb_box2d_manual.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_creator_auto.hpp"

#include "editor-support/spine/spine-cocos2dx.h"

static cocos2d::Map<std::string, cocos2d::Texture2D*>* _preloadedAtlasTextures = nullptr;
static cocos2d::Texture2D* _getPreloadedAtlasTexture(const char* path)
{
    assert(_preloadedAtlasTextures);
    auto it = _preloadedAtlasTextures->find(path);
    return it != _preloadedAtlasTextures->end() ? it->second : nullptr;
}

static bool js_creator_sp_initSkeletonRenderer(se::State& s)
{
    // renderer, jsonPath, atlasText, textures, scale
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc != 5) {
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 5);
        return false;
    }
    bool ok = false;

    spine::SkeletonRenderer* node = nullptr;
    ok = seval_to_native_ptr(args[0], &node);
    SE_PRECONDITION2(ok, false, "js_creator_sp_initSkeletonRenderer: Converting 'sgNode' failed!");

    std::string jsonPath;
    ok = seval_to_std_string(args[1], &jsonPath);
    SE_PRECONDITION2(ok, false, "js_creator_sp_initSkeletonRenderer: Invalid json path!");

    std::string atlasText;
    ok = seval_to_std_string(args[2], &atlasText);
    SE_PRECONDITION2(ok, false, "js_creator_sp_initSkeletonRenderer: Invalid atlas content!");

    cocos2d::Map<std::string, cocos2d::Texture2D*> textures;
    ok = seval_to_Map_string_key(args[3], &textures);
    SE_PRECONDITION2(ok, false, "js_creator_sp_initSkeletonRenderer: Invalid textures!");

    float scale = 1.0f;
    ok = seval_to_float(args[4], &scale);
    SE_PRECONDITION2(ok, false, "js_creator_sp_initSkeletonRenderer: Invalid scale!");

    // create atlas from preloaded texture

    _preloadedAtlasTextures = &textures;
    spine::spAtlasPage_setCustomTextureLoader(_getPreloadedAtlasTexture);

    spAtlas* atlas = spAtlas_create(atlasText.c_str(), (int)atlasText.size(), "", nullptr);
    CCASSERT(atlas, "Error creating atlas.");

    _preloadedAtlasTextures = nullptr;
    spine::spAtlasPage_setCustomTextureLoader(nullptr);

    // init node
    node->initWithJsonFile(jsonPath, atlas, scale);

    return true;
}
SE_BIND_FUNC(js_creator_sp_initSkeletonRenderer)


bool register_all_creator_manual(se::Object* obj)
{
    // Spine

    se::Value nsVal;
    if (obj->getProperty("sp", &nsVal) && nsVal.isObject())
    {
        nsVal.toObject()->defineFunction("_initSkeletonRenderer", _SE(js_creator_sp_initSkeletonRenderer));
    }
    else
    {
        CCLOGERROR("Couldn't get window.sp varible, was sp module registered?");
    }

    se::ScriptEngine::getInstance()->clearException();

    return true;
}

