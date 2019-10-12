/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
#include "base/ccConfig.h"
#include "jsb_renderer_manual.hpp"
#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "cocos/scripting/js-bindings/auto/jsb_renderer_auto.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scene/NodeProxy.hpp"
#include "scene/assembler/Assembler.hpp"
#include "jsb_conversions.hpp"

using namespace cocos2d;
using namespace cocos2d::renderer;

static bool js_renderer_Camera_getColor(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getColor : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        Color4F color;
        cobj->getColor(color);
        se::Object* arg0Obj = args[0].toObject();
        arg0Obj->setProperty("r", se::Value(color.r));
        arg0Obj->setProperty("g", se::Value(color.g));
        arg0Obj->setProperty("b", se::Value(color.b));
        s.rval().setObject(arg0Obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getColor)

static bool js_renderer_Camera_getRect(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getRect : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Rect rect;
        cobj->getRect(rect);
        se::Object* arg0Obj = args[0].toObject();
        arg0Obj->setProperty("x", se::Value(rect.x));
        arg0Obj->setProperty("y", se::Value(rect.y));
        arg0Obj->setProperty("w", se::Value(rect.w));
        arg0Obj->setProperty("h", se::Value(rect.h));
        s.rval().setObject(arg0Obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getRect)

static bool js_renderer_Camera_screenToWorld(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_screenToWorld : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        cocos2d::Vec3 out;
        cocos2d::Vec3 screenPos;
        ok = seval_to_Vec3(args[1], &screenPos);
        SE_PRECONDITION2(ok, false, "Convert arg1 failed!");
        int32_t width = 0;
        ok = seval_to_int32(args[2], &width);
        SE_PRECONDITION2(ok, false, "Convert arg2 failed!");
        int32_t height = 0;
        ok = seval_to_int32(args[3], &height);
        SE_PRECONDITION2(ok, false, "Convert arg3 failed!");
        cobj->screenToWorld(out, screenPos, width, height);
        se::Object* arg0Obj = args[0].toObject();
        arg0Obj->setProperty("x", se::Value(out.x));
        arg0Obj->setProperty("y", se::Value(out.y));
        arg0Obj->setProperty("z", se::Value(out.z));
        s.rval().setObject(arg0Obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_screenToWorld)

static bool js_renderer_Camera_worldToScreen(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_worldToScreen : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        cocos2d::Vec3 out;
        cocos2d::Vec3 worldPos;
        ok = seval_to_Vec3(args[1], &worldPos);
        SE_PRECONDITION2(ok, false, "Convert arg1 failed!");
        int32_t width = 0;
        ok = seval_to_int32(args[2], &width);
        SE_PRECONDITION2(ok, false, "Convert arg2 failed!");
        int32_t height = 0;
        ok = seval_to_int32(args[3], &height);
        SE_PRECONDITION2(ok, false, "Convert arg3 failed!");
        cobj->worldToScreen(out, worldPos, width, height);
        se::Object* arg0Obj = args[0].toObject();
        arg0Obj->setProperty("x", se::Value(out.x));
        arg0Obj->setProperty("y", se::Value(out.y));
        arg0Obj->setProperty("z", se::Value(out.z));
        s.rval().setObject(arg0Obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_worldToScreen)

static bool js_renderer_Effect_setProperty(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setProperty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setProperty : Name Error");
        // get property type by arg0
        cocos2d::renderer::Technique::Parameter::Type propType = cobj->getProperty(arg0).getType();
        ok &= (propType != cocos2d::renderer::Technique::Parameter::Type::UNKNOWN);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setProperty : Type Error");
        cocos2d::renderer::Technique::Parameter arg1(arg0, propType);
        ok &= seval_to_TechniqueParameter_not_constructor(args[1], &arg1, false);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setProperty : Error processing arguments");
        cobj->setProperty(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_setProperty)

static bool js_renderer_Effect_self(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setProperty : Invalid Native Object");
    auto addr = (unsigned long)cobj;
    s.rval().setNumber(addr);
    return true;
}
SE_BIND_FUNC(js_renderer_Effect_self);

static bool js_renderer_Light_extractView(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_extractView : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::renderer::View* view;
        ok = seval_to_native_ptr(args[0], &view);
        SE_PRECONDITION2(ok, false, "Convert arg0 failed!");

        std::vector<std::string> stages;
        ok = seval_to_std_vector_string(args[1], &stages);
        SE_PRECONDITION2(ok, false, "Convert arg1 failed!");

        cobj->extractView(*view, stages);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_extractView)

static bool js_renderer_Light_setNode(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_setNode : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        se::Value jsproxy;
        ok = args[0].toObject()->getProperty("_proxy", &jsproxy);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setNode : Cannot find node proxy form Node");
        NodeProxy* proxy = nullptr;
        ok = seval_to_native_ptr(jsproxy, &proxy);
        SE_PRECONDITION2(ok, false, "js_renderer_Light_setNode : Invalid Node Proxy");
        cobj->setNode(proxy);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_setNode)

static bool js_renderer_View_getForward(se::State& s)
{
    cocos2d::renderer::View* cobj = (cocos2d::renderer::View*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_View_getForward : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec3 out;
        cobj->getForward(out);
        se::Object* arg0Obj = args[0].toObject();
        arg0Obj->setProperty("x", se::Value(out.x));
        arg0Obj->setProperty("y", se::Value(out.y));
        arg0Obj->setProperty("z", se::Value(out.z));
        s.rval().setObject(arg0Obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_View_getForward)

static bool js_renderer_View_getPosition(se::State& s)
{
    cocos2d::renderer::View* cobj = (cocos2d::renderer::View*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_View_getPosition : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec3 out;
        cobj->getPosition(out);
        se::Object* arg0Obj = args[0].toObject();
        arg0Obj->setProperty("x", se::Value(out.x));
        arg0Obj->setProperty("y", se::Value(out.y));
        arg0Obj->setProperty("z", se::Value(out.z));
        s.rval().setObject(arg0Obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_View_getPosition)

static bool js_renderer_addStage(se::State& s)
{
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string stageName;
        ok = seval_to_std_string(args[0], &stageName);
        SE_PRECONDITION2(ok, false, "Convert arg0 failed!");
        Config::addStage(stageName);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_addStage)

static bool js_renderer_getStageIDs(se::State& s)
{
    auto& args = s.args();
    size_t argc = args.size();
    if (argc == 1)
    {
        std::vector<std::string> stageNames;
        CC_UNUSED bool ok = seval_to_std_vector_string(args[0], &stageNames);
        SE_PRECONDITION2(ok, false, "Convert arg0 failed!");
        unsigned int stageIDs = cocos2d::renderer::Config::getStageIDs(stageNames);
        uint32_to_seval(stageIDs, &s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_getStageIDs);

static bool js_renderer_getStageID(se::State& s)
{
    auto& args = s.args();
    size_t argc = args.size();
    if (argc == 1)
    {
        std::string stageName;
        CC_UNUSED bool ok = seval_to_std_string(args[0], &stageName);
        SE_PRECONDITION2(ok, false, "Convert arg0 failed!");
        int stageID = cocos2d::renderer::Config::getStageID(stageName);
        int32_to_seval(stageID, &s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_getStageID);

static bool js_renderer_Camera_setNode(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setNode : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        se::Value jsproxy;
        ok = args[0].toObject()->getProperty("_proxy", &jsproxy);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setNode : Cannot find node proxy form Node");
        NodeProxy* proxy = nullptr;
        ok = seval_to_native_ptr(jsproxy, &proxy);
        SE_PRECONDITION2(ok, false, "js_renderer_Camera_setNode : Invalid Node Proxy");
        cobj->setNode(proxy);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setNode)

static bool js_renderer_Camera_getNode(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getNode : Invalid Native Object");
    cocos2d::renderer::NodeProxy* node = cobj->getNode();
    se::Value jsproxy;
    native_ptr_to_seval<cocos2d::renderer::NodeProxy>(node, &jsproxy);
    se::Value jsnode;
    jsproxy.toObject()->getProperty("_owner", &jsnode);
    s.rval().setObject(jsnode.toObject());
    return true;
}
SE_BIND_FUNC(js_renderer_Camera_getNode)

static bool js_renderer_Config_addStage(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 1)
    {
        std::string arg0;
        bool ok = seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_addCamera : Error processing arguments");
        cocos2d::renderer::Config::addStage(arg0);
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Config_addStage);

static bool js_renderer_BaseRenderer_prop_getProgramLib(se::State& s)
{
    cocos2d::renderer::BaseRenderer* cobj = (cocos2d::renderer::BaseRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_BaseRenderer_prop_getProgramLib: Invalid Native Object.");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0)
    {
        auto programLib = cobj->getProgramLib();
        native_ptr_to_seval<cocos2d::renderer::ProgramLib>(programLib, &s.rval());
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_renderer_BaseRenderer_prop_getProgramLib);

static bool js_register_renderer_Config(se::Object* obj)
{
    auto cls = se::Class::create("Config", obj, nullptr, nullptr);
    cls->defineStaticFunction("addStage", _SE(js_renderer_Config_addStage));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Config>(cls);
    
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

static void _addModelsFromTypedArray(cocos2d::renderer::Scene* scene, se::Object* obj)
{
    uint8_t* ptr = nullptr;
    size_t length = 0;
    obj->getTypedArrayData(&ptr, &length);
    double* doublePtr = (double*)ptr;
    float* floatPtr = (float*)ptr;
    
    int numOfModels = (int)*doublePtr++;
    floatPtr += 2;
    cocos2d::Mat4 worldMatrix;
    cocos2d::renderer::InputAssembler ia;
    for (size_t i = 0; i < numOfModels; ++i)
    {
        auto model = cocos2d::renderer::ModelPool::getOrCreateModel();
        
        unsigned long addr = (unsigned long)(*doublePtr++);
        model->setEffect(reinterpret_cast<cocos2d::renderer::Effect*>(addr), nullptr);
        addr = (unsigned long)(*doublePtr++);
        ia.setVertexBuffer(reinterpret_cast<cocos2d::renderer::VertexBuffer*>(addr));
        addr = (unsigned long)(*doublePtr++);
        ia.setIndexBuffer(reinterpret_cast<cocos2d::renderer::IndexBuffer*>(addr));
        
        floatPtr += 6;
        
        model->setCullingMask((int)*floatPtr++);
        
        memcpy(worldMatrix.m, floatPtr, 16);
        model->setWorldMatix(worldMatrix);
        floatPtr += 16;
        
        ia.setStart(*floatPtr++);
        ia.setCount(*floatPtr++);
        model->setInputAssembler(ia);
        
        scene->addModel(model);
        
        doublePtr += 10;
    }
}

se::Object* __jsb_cocos2d_renderer_Technique_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Technique_class = nullptr;

static bool js_renderer_Technique_setStages(se::State& s)
{
    cocos2d::renderer::Technique* cobj = (cocos2d::renderer::Technique*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Technique_setStages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::vector<std::string> arg0;
        ok &= seval_to_std_vector_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Technique_setStages : Error processing arguments");
        cobj->setStages(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Technique_setStages)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Technique_finalize)

static bool js_renderer_Technique_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    std::vector<std::string> arg0;
    cocos2d::Vector<cocos2d::renderer::Pass*> arg1;
    ok &= seval_to_std_vector_string(args[0], &arg0);
    ok &= seval_to_std_vector_Pass(args[1], &arg1);
    SE_PRECONDITION2(ok, false, "js_renderer_Technique_constructor : Error processing arguments");
    cocos2d::renderer::Technique* cobj = new (std::nothrow) cocos2d::renderer::Technique(arg0, arg1);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_Technique_constructor, __jsb_cocos2d_renderer_Technique_class, js_cocos2d_renderer_Technique_finalize)

static bool js_cocos2d_renderer_Technique_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Technique)", s.nativeThisObject());
    cocos2d::renderer::Technique* cobj = (cocos2d::renderer::Technique*)s.nativeThisObject();
    cobj->release();

    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Technique_finalize)

bool js_register_renderer_Technique(se::Object* obj)
{
    auto cls = se::Class::create("TechniqueNative", obj, nullptr, _SE(js_renderer_Technique_constructor));

    cls->defineFunction("setStages", _SE(js_renderer_Technique_setStages));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Technique_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Technique>(cls);

    __jsb_cocos2d_renderer_Technique_proto = cls->getProto();
    __jsb_cocos2d_renderer_Technique_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

static bool js_renderer_Pass_init(se::State& s)
{
    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
    const auto& args = s.args();
    
    // program name
    cobj->setProgramName(args[0].toString());
    
    uint8_t* data = nullptr;
    size_t length = 0;
    args[1].toObject()->getTypedArrayData(&data, &length);
    uint32_t* binary32 = (uint32_t*)data;
    
    // cull mode
    cobj->setCullMode(static_cast<cocos2d::renderer::CullMode>(*binary32));
    
    // blend
    cobj->setBlend(static_cast<cocos2d::renderer::BlendOp>(*(binary32 + 1)),     // blendEq
                   static_cast<cocos2d::renderer::BlendFactor>(*(binary32 + 2)), // blendSrc
                   static_cast<cocos2d::renderer::BlendFactor>(*(binary32 + 3)), // blendDst
                   static_cast<cocos2d::renderer::BlendOp>(*(binary32 + 4)),     // blendAlphaEq
                   static_cast<cocos2d::renderer::BlendFactor>(*(binary32 + 5)), // blendSrcAlpha
                   static_cast<cocos2d::renderer::BlendFactor>(*(binary32 + 6)), // blendDstAlpha
                   *(binary32 + 7));                                              // blend color
    
    // depth
    cobj->setDepth(*(binary32 + 8), // depth test
                   *(binary32 + 9), // depth write
                   static_cast<cocos2d::renderer::DepthFunc>(*(binary32 + 10))); // depth func
    
    // stencil front
    cobj->setStencilFront(static_cast<cocos2d::renderer::StencilFunc>(*(binary32 + 11)),  // stencilFuncFront
                          *(binary32 + 12),                                               // stencilRefFront
                          *(binary32 + 13),                                               // stencilMaskFront
                          static_cast<cocos2d::renderer::StencilOp>(*(binary32 + 14)),    // stencilFailOpFront
                          static_cast<cocos2d::renderer::StencilOp>(*(binary32 + 15)),    // stencilZFailOpFront
                          static_cast<cocos2d::renderer::StencilOp>(*(binary32 + 16)),    // stencilZPassOpFront
                          *(binary32 + 17));                                              // stencilWrtieMaskFront
    
    // stencil back
    cobj->setStencilBack(static_cast<cocos2d::renderer::StencilFunc>(*(binary32 + 18)), // stencilFuncBack
                         *(binary32 + 19),                                              // stencilRefBack
                         *(binary32 + 20),                                              // stencilMaskBack
                         static_cast<cocos2d::renderer::StencilOp>(*(binary32 + 21)),   // stencilFailOpBack
                         static_cast<cocos2d::renderer::StencilOp>(*(binary32 + 22)),   // stencilZFailOpBack
                         static_cast<cocos2d::renderer::StencilOp>(*(binary32 + 23)),   // stencilZFailOpBack
                         *(binary32 + 24));
    
    return true;
    
}
SE_BIND_FUNC(js_renderer_Pass_init);

static bool js_renderer_Effect_init(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    std::string asset;
    seval_to_std_string(args[0], &asset);
    cocos2d::Vector<cocos2d::renderer::Technique*> arg0;
    std::unordered_map<std::string, cocos2d::renderer::Technique::Parameter> arg1;
    std::vector<std::unordered_map<std::string, cocos2d::Value>> arg2;
    ok &= seval_to_EffectAsset(asset, &arg0);
    ok &= seval_to_EffectProperty(args[1], &arg1);
    ok &= seval_to_EffectDefineTemplate(args[2], &arg2);
    SE_PRECONDITION2(ok, false, "js_renderer_Effect_init : Error processing arguments");
    cobj->init(arg0, arg1, arg2);
    return true;
}
SE_BIND_FUNC(js_renderer_Effect_init);

static bool js_renderer_CustomProperties_setProperty(se::State& s)
{
    cocos2d::renderer::CustomProperties* cobj = (cocos2d::renderer::CustomProperties*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_CustomProperties_setProperty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3)
    {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomProperties_setProperty : Name Error");
        std::uint8_t arg1;
        ok &= seval_to_uint8(args[1], &arg1);
        cocos2d::renderer::Technique::Parameter arg2(arg0, static_cast<cocos2d::renderer::Technique::Parameter::Type>(arg1));
        ok &= seval_to_TechniqueParameter_not_constructor(args[2], &arg2, false);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomProperties_setProperty : Error processing arguments");
        cobj->setProperty(arg0, arg2);
        return true;
    }
    else if (argc == 4)
    {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomProperties_setProperty : Name Error");
        std::uint8_t arg1;
        ok &= seval_to_uint8(args[1], &arg1);
        cocos2d::renderer::Technique::Parameter arg2(arg0, static_cast<cocos2d::renderer::Technique::Parameter::Type>(arg1));
        bool arg3;
        ok &= seval_to_boolean(args[3], &arg3);
        ok &= seval_to_TechniqueParameter_not_constructor(args[2], &arg2, arg3);
        SE_PRECONDITION2(ok, false, "js_renderer_CustomProperties_setProperty : Error processing arguments");
        cobj->setProperty(arg0, arg2);
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_CustomProperties_setProperty);

bool jsb_register_renderer_manual(se::Object* global)
{
    // Get the ns
    se::Value nsVal;
    if (!global->getProperty("renderer", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        global->setProperty("renderer", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_renderer_Config(ns);
    js_register_renderer_Technique(ns);

    // Effect
    __jsb_cocos2d_renderer_Effect_proto->defineFunction("setProperty", _SE(js_renderer_Effect_setProperty));
    __jsb_cocos2d_renderer_Effect_proto->defineFunction("self", _SE(js_renderer_Effect_self));

    // Light
    __jsb_cocos2d_renderer_Light_proto->defineFunction("extractView", _SE(js_renderer_Light_extractView));
    __jsb_cocos2d_renderer_Light_proto->defineFunction("setNode", _SE(js_renderer_Light_setNode));

    // View
    __jsb_cocos2d_renderer_View_proto->defineFunction("getForward", _SE(js_renderer_View_getForward));
    __jsb_cocos2d_renderer_View_proto->defineFunction("getPosition", _SE(js_renderer_View_getPosition));

    // Config
    se::Value rendererVal;
    global->getProperty("renderer", &rendererVal);
    rendererVal.toObject()->defineFunction("addStage", _SE(js_renderer_addStage));
    rendererVal.toObject()->defineFunction("stageIDs", _SE(js_renderer_getStageIDs));
    rendererVal.toObject()->defineFunction("stageID", _SE(js_renderer_getStageID));

    // Camera
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("setNode", _SE(js_renderer_Camera_setNode));
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("getNode", _SE(js_renderer_Camera_getNode));
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("screenToWorld", _SE(js_renderer_Camera_screenToWorld));
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("worldToScreen", _SE(js_renderer_Camera_worldToScreen));
    
    // Pass
    __jsb_cocos2d_renderer_Pass_proto->defineFunction("init", _SE(js_renderer_Pass_init));

    // Effect
    __jsb_cocos2d_renderer_Effect_proto->defineFunction("init", _SE(js_renderer_Effect_init));
    // CustomProperties
    __jsb_cocos2d_renderer_CustomProperties_proto->defineFunction("setProperty", _SE(js_renderer_CustomProperties_setProperty));
    
    return true;
}

#endif //#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
