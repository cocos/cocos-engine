/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "jsb_scene_manual.h"
#include "bindings/auto/jsb_scene_auto.h"
#include "core/Root.h"
#include "core/event/EventTypesToJS.h"
#include "core/scene-graph/Node.h"
#include "core/scene-graph/NodeEvent.h"
#include "scene/Model.h"

#ifndef JSB_ALLOC
    #define JSB_ALLOC(kls, ...) ccnew kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
    #define JSB_FREE(ptr) delete ptr
#endif

namespace {

class TempFloatArray final {
public:
    TempFloatArray() = default;
    ~TempFloatArray() = default;

    inline void setData(float *data) { _data = data; }

    inline void writeVec3(const cc::Vec3 &p) {
        _data[0] = p.x;
        _data[1] = p.y;
        _data[2] = p.z;
    }

    inline cc::Vec3 readVec3() const {
        return cc::Vec3{_data[0], _data[1], _data[2]};
    }

    inline void writeQuaternion(const cc::Quaternion &p) {
        _data[0] = p.x;
        _data[1] = p.y;
        _data[2] = p.z;
        _data[3] = p.w;
    }

    inline cc::Quaternion readQuaternion() const {
        return cc::Quaternion{_data[0], _data[1], _data[2], _data[3]};
    }

    inline void writeMat4(const cc::Mat4 &m) {
        memcpy(_data, m.m, sizeof(float) * 16);
    }

    inline cc::Mat4 readMat4() const {
        cc::Mat4 ret;
        memcpy(ret.m, _data, sizeof(float) * 16);
        return ret;
    }

    inline void writeRay(const cc::geometry::Ray &ray) {
        _data[0] = ray.o.x;
        _data[1] = ray.o.y;
        _data[2] = ray.o.z;
        _data[3] = ray.d.x;
        _data[4] = ray.d.y;
        _data[5] = ray.d.z;
    }

    inline cc::geometry::Ray readRay() const {
        return cc::geometry::Ray{_data[0], _data[1], _data[2], _data[3], _data[4], _data[5]};
    }

    inline const float &operator[](size_t index) const { return _data[index]; }
    inline float &operator[](size_t index) { return _data[index]; }

private:
    float *_data{nullptr};

    CC_DISALLOW_ASSIGN(TempFloatArray)
};

TempFloatArray tempFloatArray;

} // namespace

static bool js_root_registerListeners(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::Root>(s);
    SE_PRECONDITION2(cobj, false, "js_root_registerListeners : Invalid Native Object");

#define DISPATCH_EVENT_TO_JS_ARGS_0(eventType, jsFuncName)                                                         \
    cobj->getEventProcessor()->on(eventType, [](cc::Root *rootObj) {                                               \
        se::AutoHandleScope hs;                                                                                    \
        se::Value rootVal;                                                                                         \
        bool ok = nativevalue_to_se(rootObj, rootVal);                                                             \
        SE_PRECONDITION2_FUNCNAME_VOID(ok, #jsFuncName, "js_root_registerListeners : Error processing arguments"); \
        if (rootVal.isObject()) {                                                                                  \
            se::ScriptEngine::getInstance()->callFunction(rootVal.toObject(), #jsFuncName, 0, nullptr);            \
        }                                                                                                          \
    })

    DISPATCH_EVENT_TO_JS_ARGS_0(cc::EventTypesToJS::ROOT_BATCH2D_INIT, _onBatch2DInit);
    DISPATCH_EVENT_TO_JS_ARGS_0(cc::EventTypesToJS::ROOT_BATCH2D_UPDATE, _onBatch2DUpdate);
    DISPATCH_EVENT_TO_JS_ARGS_0(cc::EventTypesToJS::ROOT_BATCH2D_UPLOAD_BUFFERS, _onBatch2DUploadBuffers);
    DISPATCH_EVENT_TO_JS_ARGS_0(cc::EventTypesToJS::ROOT_BATCH2D_RESET, _onBatch2DReset);
    DISPATCH_EVENT_TO_JS_ARGS_0(cc::EventTypesToJS::DIRECTOR_BEFORE_COMMIT, _onDirectorBeforeCommit);

    return true;
}
SE_BIND_FUNC(js_root_registerListeners) // NOLINT(readability-identifier-naming)

static void registerOnTransformChanged(cc::Node *node, se::Object *jsObject) {
    node->on(
        cc::NodeEventType::TRANSFORM_CHANGED,
        [jsObject](cc::TransformBit transformBit) {
            se::AutoHandleScope hs;
            se::Value arg0;
            nativevalue_to_se(transformBit, arg0);
            se::ScriptEngine::getInstance()->callFunction(jsObject, "_onTransformChanged", 1, &arg0);
        });
}

static void registerOnParentChanged(cc::Node *node, se::Object *jsObject) {
    node->on(
        cc::NodeEventType::PARENT_CHANGED,
        [jsObject](cc::Node *oldParent) {
            se::AutoHandleScope hs;
            se::Value arg0;
            nativevalue_to_se(oldParent, arg0);
            se::ScriptEngine::getInstance()->callFunction(jsObject, "_onParentChanged", 1, &arg0);
        });
}

static void registerOnLayerChanged(cc::Node *node, se::Object *jsObject) {
    node->on(
        cc::NodeEventType::LAYER_CHANGED,
        [jsObject](uint32_t layer) {
            se::AutoHandleScope hs;
            se::Value arg0;
            nativevalue_to_se(layer, arg0);
            se::ScriptEngine::getInstance()->callFunction(jsObject, "_onLayerChanged", 1, &arg0);
        });
}

static void registerOnChildRemoved(cc::Node *node, se::Object *jsObject) {
    node->on(
        cc::NodeEventType::CHILD_REMOVED,
        [jsObject](cc::Node *child) {
            se::AutoHandleScope hs;
            se::Value arg0;
            nativevalue_to_se(child, arg0);
            se::ScriptEngine::getInstance()->callFunction(jsObject, "_onChildRemoved", 1, &arg0);
        });
}

static void registerOnChildAdded(cc::Node *node, se::Object *jsObject) {
    node->on(
        cc::NodeEventType::CHILD_ADDED,
        [jsObject](cc::Node *child) {
            se::AutoHandleScope hs;
            se::Value arg0;
            nativevalue_to_se(child, arg0);
            se::ScriptEngine::getInstance()->callFunction(jsObject, "_onChildAdded", 1, &arg0);
        });
}

static void registerOnSiblingOrderChanged(cc::Node *node, se::Object *jsObject) {
    node->on(
        cc::NodeEventType::SIBLING_ORDER_CHANGED,
        [jsObject]() {
            se::AutoHandleScope hs;
            se::ScriptEngine::getInstance()->callFunction(jsObject, "_onSiblingOrderChanged", 0, nullptr);
        });
}

static void registerOnActiveNode(cc::Node *node, se::Object *jsObject) {
    cc::CallbackInfoBase::ID skip;
    node->on(
        cc::EventTypesToJS::NODE_ACTIVE_NODE,
        [jsObject](bool shouldActiveNow) {
            se::AutoHandleScope hs;
            se::Value arg0;
            nativevalue_to_se(shouldActiveNow, arg0);
            se::ScriptEngine::getInstance()->callFunction(jsObject, "_onActiveNode", 1, &arg0);
        },
        skip);
}

static void registerOnBatchCreated(cc::Node *node, se::Object *jsObject) {
    cc::CallbackInfoBase::ID skip;
    node->on(
        cc::EventTypesToJS::NODE_ON_BATCH_CREATED,
        [jsObject](bool dontChildPrefab) {
            se::AutoHandleScope hs;
            se::Value arg0;
            nativevalue_to_se(dontChildPrefab, arg0);
            se::ScriptEngine::getInstance()->callFunction(jsObject, "_onBatchCreated", 1, &arg0);
        },
        skip);
}

static void registerLocalPositionRotationScaleUpdated(cc::Node *node, se::Object *jsObject) {
    node->on(cc::EventTypesToJS::NODE_LOCAL_POSITION_UPDATED, [jsObject](float x, float y, float z) {
        se::AutoHandleScope hs;
        ccstd::array<se::Value, 3> args;
        nativevalue_to_se(x, args[0]);
        nativevalue_to_se(y, args[1]);
        nativevalue_to_se(z, args[2]);
        se::ScriptEngine::getInstance()->callFunction(jsObject, "_onLocalPositionUpdated", static_cast<uint32_t>(args.size()), args.data());
    });

    node->on(cc::EventTypesToJS::NODE_LOCAL_ROTATION_UPDATED, [jsObject](float x, float y, float z, float w) {
        se::AutoHandleScope hs;
        ccstd::array<se::Value, 4> args;
        nativevalue_to_se(x, args[0]);
        nativevalue_to_se(y, args[1]);
        nativevalue_to_se(z, args[2]);
        nativevalue_to_se(w, args[3]);
        se::ScriptEngine::getInstance()->callFunction(jsObject, "_onLocalRotationUpdated", static_cast<uint32_t>(args.size()), args.data());
    });

    node->on(cc::EventTypesToJS::NODE_LOCAL_SCALE_UPDATED, [jsObject](float x, float y, float z) {
        se::AutoHandleScope hs;
        ccstd::array<se::Value, 3> args;
        nativevalue_to_se(x, args[0]);
        nativevalue_to_se(y, args[1]);
        nativevalue_to_se(z, args[2]);
        se::ScriptEngine::getInstance()->callFunction(jsObject, "_onLocalScaleUpdated", static_cast<uint32_t>(args.size()), args.data());
    });

    node->on(cc::EventTypesToJS::NODE_LOCAL_POSITION_ROTATION_SCALE_UPDATED, [jsObject](float px, float py, float pz, float rx, float ry, float rz, float rw, float sx, float sy, float sz) {
        se::AutoHandleScope hs;
        ccstd::array<se::Value, 10> args;
        nativevalue_to_se(px, args[0]);
        nativevalue_to_se(py, args[1]);
        nativevalue_to_se(pz, args[2]);

        nativevalue_to_se(rx, args[3]);
        nativevalue_to_se(ry, args[4]);
        nativevalue_to_se(rz, args[5]);
        nativevalue_to_se(rw, args[6]);

        nativevalue_to_se(sx, args[7]);
        nativevalue_to_se(sy, args[8]);
        nativevalue_to_se(sz, args[9]);

        se::ScriptEngine::getInstance()->callFunction(jsObject, "_onLocalPositionRotationScaleUpdated", static_cast<uint32_t>(args.size()), args.data());
    });
}

static bool js_scene_Node_registerListeners(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_registerListeners : Invalid Native Object");

    auto *jsObject = s.thisObject();

#define NODE_DISPATCH_EVENT_TO_JS(eventType, jsFuncName)                                      \
    cobj->on(                                                                                 \
        eventType, [jsObject]() {                                                             \
            se::AutoHandleScope hs;                                                           \
            se::ScriptEngine::getInstance()->callFunction(jsObject, #jsFuncName, 0, nullptr); \
        });

    registerOnActiveNode(cobj, jsObject);
    registerOnBatchCreated(cobj, jsObject);

    NODE_DISPATCH_EVENT_TO_JS(cc::EventTypesToJS::NODE_REATTACH, _onReAttach);
    NODE_DISPATCH_EVENT_TO_JS(cc::EventTypesToJS::NODE_REMOVE_PERSIST_ROOT_NODE, _onRemovePersistRootNode);
    NODE_DISPATCH_EVENT_TO_JS(cc::EventTypesToJS::NODE_DESTROY_COMPONENTS, _onDestroyComponents);
    //    NODE_DISPATCH_EVENT_TO_JS(cc::NodeEventType::SIBLING_ORDER_CHANGED, _onSiblingOrderChanged);

    cobj->on(
        cc::NodeEventType::NODE_DESTROYED,
        [](cc::Node *node) {
            se::AutoHandleScope hs;
            se::Value nodeVal;
            nativevalue_to_se(node, nodeVal);
            se::ScriptEngine::getInstance()->callFunction(nodeVal.toObject(), "_onNodeDestroyed", 1, &nodeVal);
        });

    cobj->onSiblingIndexChanged = [jsObject](index_t newIndex) {
        se::AutoHandleScope hs;
        se::Value arg0;
        nativevalue_to_se(newIndex, arg0);
        se::ScriptEngine::getInstance()->callFunction(jsObject, "_onSiblingIndexChanged", 1, &arg0);
    };

    cobj->on(cc::EventTypesToJS::NODE_SCENE_UPDATED, [jsObject](cc::Scene *scene) {
        se::AutoHandleScope hs;
        se::Value arg0;
        nativevalue_to_se(scene, arg0);
        se::ScriptEngine::getInstance()->callFunction(jsObject, "_onSceneUpdated", 1, &arg0);
    });

    cobj->on(cc::EventTypesToJS::NODE_EDITOR_ATTACHED, [jsObject](bool attached) {
        se::AutoHandleScope hs;
        se::Value arg0;
        nativevalue_to_se(attached, arg0);
        se::ScriptEngine::getInstance()->callFunction(jsObject, "_onEditorAttached", 1, &arg0);
    });

    registerLocalPositionRotationScaleUpdated(cobj, jsObject);

    return true;
}
SE_BIND_FUNC(js_scene_Node_registerListeners) // NOLINT(readability-identifier-naming)

static bool js_scene_Node_registerOnTransformChanged(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_registerOnTransformChanged : Invalid Native Object");

    auto *jsObject = s.thisObject();

    registerOnTransformChanged(cobj, jsObject);
    return true;
}
SE_BIND_FUNC(js_scene_Node_registerOnTransformChanged) // NOLINT(readability-identifier-naming)

static bool js_scene_Node_registerOnParentChanged(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_registerOnParentChanged : Invalid Native Object");

    auto *jsObject = s.thisObject();

    registerOnParentChanged(cobj, jsObject);
    return true;
}
SE_BIND_FUNC(js_scene_Node_registerOnParentChanged) // NOLINT(readability-identifier-naming)

static bool js_scene_Node_registerOnLayerChanged(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_registerOnLayerChanged : Invalid Native Object");

    auto *jsObject = s.thisObject();

    registerOnLayerChanged(cobj, jsObject);
    return true;
}
SE_BIND_FUNC(js_scene_Node_registerOnLayerChanged) // NOLINT(readability-identifier-naming)

static bool js_scene_Node_registerOnChildRemoved(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_registerOnChildRemoved : Invalid Native Object");

    auto *jsObject = s.thisObject();

    registerOnChildRemoved(cobj, jsObject);
    return true;
}
SE_BIND_FUNC(js_scene_Node_registerOnChildRemoved) // NOLINT(readability-identifier-naming)

static bool js_scene_Node_registerOnChildAdded(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_registerOnChildAdded : Invalid Native Object");

    auto *jsObject = s.thisObject();

    registerOnChildAdded(cobj, jsObject);
    return true;
}
SE_BIND_FUNC(js_scene_Node_registerOnChildAdded) // NOLINT(readability-identifier-naming)

static bool js_scene_Node_registerOnSiblingOrderChanged(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::Node>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_registerOnSiblingOrderChanged : Invalid Native Object");

    auto *jsObject = s.thisObject();
    registerOnSiblingOrderChanged(cobj, jsObject);
    return true;
}
SE_BIND_FUNC(js_scene_Node_registerOnSiblingOrderChanged) // NOLINT(readability-identifier-naming)

static bool js_scene_Camera_screenPointToRay(void *nativeObject) // NOLINT(readability-identifier-naming)
{
    auto *cobj = reinterpret_cast<cc::scene::Camera *>(nativeObject);
    cc::geometry::Ray ray = cobj->screenPointToRay(tempFloatArray[0], tempFloatArray[1]);
    tempFloatArray.writeRay(ray);
    return true;
}
SE_BIND_FUNC_FAST(js_scene_Camera_screenPointToRay)

static bool js_scene_Camera_screenToWorld(void *nativeObject) // NOLINT(readability-identifier-naming)
{
    auto *cobj = reinterpret_cast<cc::scene::Camera *>(nativeObject);
    cc::Vec3 ret = cobj->screenToWorld(tempFloatArray.readVec3());
    tempFloatArray.writeVec3(ret);
    return true;
}
SE_BIND_FUNC_FAST(js_scene_Camera_screenToWorld)

static bool js_scene_Camera_worldToScreen(void *nativeObject) // NOLINT(readability-identifier-naming)
{
    auto *cobj = reinterpret_cast<cc::scene::Camera *>(nativeObject);
    cc::Vec3 ret = cobj->worldToScreen(tempFloatArray.readVec3());
    tempFloatArray.writeVec3(ret);
    return true;
}
SE_BIND_FUNC_FAST(js_scene_Camera_worldToScreen)

static bool js_scene_Camera_worldMatrixToScreen(void *nativeObject) // NOLINT(readability-identifier-naming)
{
    auto *cobj = reinterpret_cast<cc::scene::Camera *>(nativeObject);
    cc::Mat4 worldMatrix = tempFloatArray.readMat4();
    cc::Mat4 ret = cobj->worldMatrixToScreen(worldMatrix, static_cast<uint32_t>(tempFloatArray[16]), static_cast<uint32_t>(tempFloatArray[17]));
    tempFloatArray.writeMat4(ret);
    return true;
}
SE_BIND_FUNC_FAST(js_scene_Camera_worldMatrixToScreen)

static bool js_scene_Node_setTempFloatArray(se::State &s) // NOLINT(readability-identifier-naming)
{
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        uint8_t *buffer = nullptr;
        args[0].toObject()->getArrayBufferData(&buffer, nullptr);
        tempFloatArray.setData(reinterpret_cast<float *>(buffer));
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_scene_Node_setTempFloatArray)


#define FAST_GET_VALUE(ns, className, method, type)                   \
    static bool js_scene_##className##_##method(void *nativeObject) { \
        auto *cobj = reinterpret_cast<ns::className *>(nativeObject); \
        auto result = cobj->method();                                 \
        tempFloatArray.write##type(result);                           \
        return true;                                                  \
    }                                                                 \
    SE_BIND_FUNC_FAST(js_scene_##className##_##method)

#define FAST_GET_CONST_REF(ns, className, method, type)               \
    static bool js_scene_##className##_##method(void *nativeObject) { \
        auto *cobj = reinterpret_cast<ns::className *>(nativeObject); \
        const auto &result = cobj->method();                          \
        tempFloatArray.write##type(result);                           \
        return true;                                                  \
    }                                                                 \
    SE_BIND_FUNC_FAST(js_scene_##className##_##method)

FAST_GET_VALUE(cc, Node, getRight, Vec3)
FAST_GET_VALUE(cc, Node, getForward, Vec3)
FAST_GET_VALUE(cc, Node, getUp, Vec3)
FAST_GET_VALUE(cc, Node, getWorldRS, Mat4)
FAST_GET_VALUE(cc, Node, getWorldRT, Mat4)

FAST_GET_CONST_REF(cc, Node, getWorldPosition, Vec3)
FAST_GET_CONST_REF(cc, Node, getWorldRotation, Quaternion)
FAST_GET_CONST_REF(cc, Node, getWorldScale, Vec3)
FAST_GET_CONST_REF(cc, Node, getWorldMatrix, Mat4)
FAST_GET_CONST_REF(cc, Node, getEulerAngles, Vec3)

FAST_GET_CONST_REF(cc::scene, Camera, getMatView, Mat4)
FAST_GET_CONST_REF(cc::scene, Camera, getMatProj, Mat4)
FAST_GET_CONST_REF(cc::scene, Camera, getMatProjInv, Mat4)
FAST_GET_CONST_REF(cc::scene, Camera, getMatViewProj, Mat4)
FAST_GET_CONST_REF(cc::scene, Camera, getMatViewProjInv, Mat4)

static bool js_scene_Node_setPosition(void *s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = reinterpret_cast<cc::Node *>(s);
    auto argc = static_cast<size_t>(tempFloatArray[0]);
    if (argc == 2) {
        cobj->setPositionInternal(tempFloatArray[1], tempFloatArray[2], true);
    } else {
        cobj->setPositionInternal(tempFloatArray[1], tempFloatArray[2], tempFloatArray[3], true);
    }
    return true;
}
SE_BIND_FUNC_FAST(js_scene_Node_setPosition)

static bool js_scene_Node_setRotation(void *s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = reinterpret_cast<cc::Node *>(s);
    cobj->setRotationInternal(tempFloatArray[0], tempFloatArray[1], tempFloatArray[2], tempFloatArray[3], true);
    return true;
}
SE_BIND_FUNC_FAST(js_scene_Node_setRotation)

static bool js_scene_Node_setRotationFromEuler(void *s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = reinterpret_cast<cc::Node *>(s);
    cobj->setRotationFromEuler(tempFloatArray[0], tempFloatArray[1], tempFloatArray[2]);
    return true;
}
SE_BIND_FUNC_FAST(js_scene_Node_setRotationFromEuler)

static bool js_scene_Node_setScale(void *s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = reinterpret_cast<cc::Node *>(s);
    auto argc = static_cast<size_t>(tempFloatArray[0]);
    if (argc == 2) {
        cobj->setScaleInternal(tempFloatArray[1], tempFloatArray[2], true);

    } else {
        cobj->setScaleInternal(tempFloatArray[1], tempFloatArray[2], tempFloatArray[3], true);
    }
    return true;
}
SE_BIND_FUNC_FAST(js_scene_Node_setScale)

static bool js_scene_Node_setRTS(void *s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = reinterpret_cast<cc::Node *>(s);
    cc::Quaternion qt;
    auto rotSize = static_cast<int32_t>(tempFloatArray[0]);
    if (rotSize > 0) {
        qt.set(tempFloatArray[1], tempFloatArray[2], tempFloatArray[3], tempFloatArray[4]);
    }

    auto posSize = static_cast<int32_t>(tempFloatArray[5]);
    cc::Vec3 pos;
    if (posSize > 0) {
        pos.set(tempFloatArray[6], tempFloatArray[7], tempFloatArray[8]);
    }

    auto scaleSize = static_cast<int32_t>(tempFloatArray[9]);
    cc::Vec3 scale;
    if (scaleSize > 0) {
        scale.set(tempFloatArray[10], tempFloatArray[11], tempFloatArray[12]);
    }
    cobj->setRTSInternal(rotSize > 0 ? &qt : nullptr, posSize > 0 ? &pos : nullptr, scaleSize > 0 ? &scale : nullptr, true);
    return true;
}
SE_BIND_FUNC_FAST(js_scene_Node_setRTS)

static bool js_scene_Node_rotateForJS(void *s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = reinterpret_cast<cc::Node *>(s);
    auto argc = static_cast<size_t>(tempFloatArray[0]);
    if (argc == 4) {
        cobj->rotateForJS(tempFloatArray[1], tempFloatArray[2], tempFloatArray[3], tempFloatArray[4]);
    } else {
        auto size = static_cast<int32_t>(tempFloatArray[5]);
        cobj->rotateForJS(tempFloatArray[1], tempFloatArray[2], tempFloatArray[3], tempFloatArray[4], size == 0 ? cc::NodeSpace::LOCAL : static_cast<cc::NodeSpace>(static_cast<int>(std::roundf(tempFloatArray[5]))));
    }

    const auto &lrot = cobj->getRotation();
    tempFloatArray.writeQuaternion(lrot);
    return true;
}
SE_BIND_FUNC_FAST(js_scene_Node_rotateForJS)

static bool js_scene_Node_inverseTransformPoint(void *nativeObject) // NOLINT(readability-identifier-naming)
{
    auto *cobj = reinterpret_cast<cc::Node *>(nativeObject);
    auto p = cobj->inverseTransformPoint(tempFloatArray.readVec3());
    tempFloatArray.writeVec3(p);
    return true;
}
SE_BIND_FUNC_FAST(js_scene_Node_inverseTransformPoint)

static bool js_scene_Pass_blocks_getter(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = SE_THIS_OBJECT<cc::scene::Pass>(s);
    SE_PRECONDITION2(cobj, false, "js_scene_Node_registerListeners : Invalid Native Object");
    auto *thiz = s.thisObject();

    se::Value blocksVal;
    if (thiz->getProperty("_blocks", &blocksVal, true) && blocksVal.isObject() && blocksVal.toObject()->isArray()) {
        s.rval() = blocksVal;
        return true;
    }

    const auto &blocks = cobj->getBlocks();
    const uint8_t *blockDataBase = cobj->getRootBlock()->getData();

    se::HandleObject jsBlocks{se::Object::createArrayObject(blocks.size())};
    int32_t i = 0;
    for (const auto &block : blocks) {
        se::HandleObject jsBlock{
            se::Object::createTypedArrayWithBuffer(
                se::Object::TypedArrayType::FLOAT32,
                cobj->getRootBlock()->getJSArrayBuffer(),
                reinterpret_cast<const uint8_t *>(block.data) - blockDataBase,
                block.count * 4)};
        jsBlocks->setArrayElement(i, se::Value(jsBlock));
        ++i;
    }
    thiz->setProperty("_blocks", se::Value(jsBlocks));
    s.rval().setObject(jsBlocks);
    return true;
}
SE_BIND_PROP_GET(js_scene_Pass_blocks_getter)

static bool js_scene_RenderScene_root_getter(se::State &s) { // NOLINT(readability-identifier-naming)
    nativevalue_to_se(cc::Root::getInstance(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_scene_RenderScene_root_getter)

static bool js_Model_setInstancedAttribute(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_Model_setInstancedAttribute : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    auto *thiz = s.thisObject();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        ccstd::string name;
        ok &= sevalue_to_native(args[0], &name, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_Model_setInstancedAttribute : Error processing arguments");

        const auto &val = args[1];
        if (val.isObject()) {
            if (val.toObject()->isArray()) {
                uint32_t len = 0;
                val.toObject()->getArrayLength(&len);

                se::Value dataVal;
                ccstd::array<float, 64> stackData;
                float *pData = nullptr;
                bool needFree = false;

                if (len <= static_cast<uint32_t>(stackData.size())) {
                    pData = stackData.data();
                } else {
                    pData = static_cast<float *>(CC_MALLOC(len));
                    needFree = true;
                }

                for (uint32_t i = 0; i < len; ++i) {
                    ok = val.toObject()->getArrayElement(i, &dataVal);
                    CC_ASSERT(ok && dataVal.isNumber());
                    pData[i] = dataVal.toFloat();
                }

                cobj->setInstancedAttribute(name, pData, len * sizeof(float));

                if (needFree) {
                    CC_FREE(pData);
                }
                return true;
            }

            if (val.toObject()->isTypedArray()) {
                se::Object::TypedArrayType type = val.toObject()->getTypedArrayType();
                switch (type) {
                    case se::Object::TypedArrayType::FLOAT32: {
                        uint8_t *data = nullptr;
                        size_t byteLength = 0;
                        if (val.toObject()->getTypedArrayData(&data, &byteLength) && data != nullptr && byteLength > 0) {
                            cobj->setInstancedAttribute(name, reinterpret_cast<const float *>(data), static_cast<uint32_t>(byteLength));
                        }
                    } break;

                    default:
                        // FIXME:
                        CC_ASSERT(false); // NOLINT
                        break;
                }
                return true;
            }
        }

        SE_REPORT_ERROR("js_Model_setInstancedAttribute : Error processing arguments");
        return false;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_Model_setInstancedAttribute)

static bool js_Model_registerListeners(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::scene::Model>(s);
    SE_PRECONDITION2(cobj, false, "js_Model_registerListeners : Invalid Native Object");
    auto *thiz = s.thisObject();

#define MODEL_DISPATCH_EVENT_TO_JS(eventType, jsFuncName)                               \
    cobj->getEventProcessor().on(eventType, [=](uint32_t stamp) {                       \
        cobj->setCalledFromJS(true);                                                    \
        se::AutoHandleScope hs;                                                         \
        se::Value stampVal{stamp};                                                      \
        se::ScriptEngine::getInstance()->callFunction(thiz, #jsFuncName, 1, &stampVal); \
    })

    MODEL_DISPATCH_EVENT_TO_JS(cc::EventTypesToJS::MODEL_UPDATE_TRANSFORM, updateTransform);
    MODEL_DISPATCH_EVENT_TO_JS(cc::EventTypesToJS::MODEL_UPDATE_UBO, updateUBOs);

#undef MODEL_DISPATCH_EVENT_TO_JS

    cobj->getEventProcessor().on(cc::EventTypesToJS::MODEL_UPDATE_LOCAL_DESCRIPTORS, [=](index_t subModelIndex, cc::gfx::DescriptorSet *descriptorSet) {
        cobj->setCalledFromJS(true);
        se::AutoHandleScope hs;

        ccstd::array<se::Value, 2> args;
        nativevalue_to_se(subModelIndex, args[0]);
        nativevalue_to_se(descriptorSet, args[1]);
        se::ScriptEngine::getInstance()->callFunction(thiz, "_updateLocalDescriptors", static_cast<uint32_t>(args.size()), args.data());
    });

    cobj->getEventProcessor().on(cc::EventTypesToJS::MODEL_UPDATE_INSTANCED_ATTRIBUTES, [=](const ccstd::vector<cc::gfx::Attribute> &attributes, cc::scene::Pass *pass) {
        cobj->setCalledFromJS(true);
        se::AutoHandleScope hs;

        ccstd::array<se::Value, 2> args;
        nativevalue_to_se(attributes, args[0]);
        nativevalue_to_se(pass, args[1]);
        se::ScriptEngine::getInstance()->callFunction(thiz, "_updateInstancedAttributes", static_cast<uint32_t>(args.size()), args.data());
    });

    cobj->getEventProcessor().on(cc::EventTypesToJS::MODEL_GET_MACRO_PATCHES, [=](index_t subModelIndex, ccstd::vector<cc::scene::IMacroPatch> *pPatches) {
        cobj->setCalledFromJS(true);
        se::AutoHandleScope hs;

        se::Value rval;
        ccstd::array<se::Value, 1> args;
        nativevalue_to_se(subModelIndex, args[0]);
        bool ok = se::ScriptEngine::getInstance()->callFunction(thiz, "getMacroPatches", static_cast<uint32_t>(args.size()), args.data(), &rval);

        if (ok) {
            sevalue_to_native(rval, pPatches);
        }
    });

    return true;
}
SE_BIND_FUNC(js_Model_registerListeners) // NOLINT(readability-identifier-naming)

static bool js_assets_MaterialInstance_registerListeners(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::MaterialInstance>(s);
    SE_PRECONDITION2(cobj, false, "js_assets_MaterialInstance_registerListeners : Invalid Native Object");
    cobj->setRebuildPSOCallback([](index_t /*index*/, cc::Material *material) {
        se::AutoHandleScope hs;
        se::Value matVal;
        bool ok = nativevalue_to_se(material, matVal);
        if (!ok) {
            return;
        }
        se::ScriptEngine::getInstance()->callFunction(matVal.toObject(), "_onRebuildPSO", 0, nullptr);
    });

    return true;
}
SE_BIND_FUNC(js_assets_MaterialInstance_registerListeners) // NOLINT(readability-identifier-naming)

bool register_all_scene_manual(se::Object *obj) // NOLINT(readability-identifier-naming)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("ns", &nsVal)) {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("ns", nsVal);
    }

    __jsb_cc_Root_proto->defineFunction("_registerListeners", _SE(js_root_registerListeners));

    __jsb_cc_scene_Camera_proto->defineFunction("screenPointToRay", _SE(js_scene_Camera_screenPointToRay));
    __jsb_cc_scene_Camera_proto->defineFunction("screenToWorld", _SE(js_scene_Camera_screenToWorld));
    __jsb_cc_scene_Camera_proto->defineFunction("worldToScreen", _SE(js_scene_Camera_worldToScreen));
    __jsb_cc_scene_Camera_proto->defineFunction("worldMatrixToScreen", _SE(js_scene_Camera_worldMatrixToScreen));

    __jsb_cc_scene_Camera_proto->defineFunction("getMatView", _SE(js_scene_Camera_getMatView));
    __jsb_cc_scene_Camera_proto->defineFunction("getMatProj", _SE(js_scene_Camera_getMatProj));
    __jsb_cc_scene_Camera_proto->defineFunction("getMatProjInv", _SE(js_scene_Camera_getMatProjInv));
    __jsb_cc_scene_Camera_proto->defineFunction("getMatViewProj", _SE(js_scene_Camera_getMatViewProj));
    __jsb_cc_scene_Camera_proto->defineFunction("getMatViewProjInv", _SE(js_scene_Camera_getMatViewProjInv));

    // Node TS wrapper will invoke this function to let native object listen some events.
    __jsb_cc_Node_proto->defineFunction("_registerListeners", _SE(js_scene_Node_registerListeners));

    __jsb_cc_Node_proto->defineFunction("_registerOnTransformChanged", _SE(js_scene_Node_registerOnTransformChanged));
    __jsb_cc_Node_proto->defineFunction("_registerOnParentChanged", _SE(js_scene_Node_registerOnParentChanged));
    __jsb_cc_Node_proto->defineFunction("_registerOnLayerChanged", _SE(js_scene_Node_registerOnLayerChanged));
    __jsb_cc_Node_proto->defineFunction("_registerOnChildRemoved", _SE(js_scene_Node_registerOnChildRemoved));
    __jsb_cc_Node_proto->defineFunction("_registerOnChildAdded", _SE(js_scene_Node_registerOnChildAdded));
    __jsb_cc_Node_proto->defineFunction("_registerOnSiblingOrderChanged", _SE(js_scene_Node_registerOnSiblingOrderChanged));

    se::Value jsbVal;
    obj->getProperty("jsb", &jsbVal);
    se::Value nodeVal;
    jsbVal.toObject()->getProperty("Node", &nodeVal);

    nodeVal.toObject()->defineFunction("_setTempFloatArray", _SE(js_scene_Node_setTempFloatArray));

    __jsb_cc_Node_proto->defineFunction("_setPosition", _SE(js_scene_Node_setPosition));
    __jsb_cc_Node_proto->defineFunction("_setScale", _SE(js_scene_Node_setScale));
    __jsb_cc_Node_proto->defineFunction("_setRotation", _SE(js_scene_Node_setRotation));
    __jsb_cc_Node_proto->defineFunction("_setRotationFromEuler", _SE(js_scene_Node_setRotationFromEuler));
    __jsb_cc_Node_proto->defineFunction("_rotateForJS", _SE(js_scene_Node_rotateForJS));

    __jsb_cc_Node_proto->defineFunction("_getEulerAngles", _SE(js_scene_Node_getEulerAngles));
    __jsb_cc_Node_proto->defineFunction("_getForward", _SE(js_scene_Node_getForward));
    __jsb_cc_Node_proto->defineFunction("_getUp", _SE(js_scene_Node_getUp));
    __jsb_cc_Node_proto->defineFunction("_getRight", _SE(js_scene_Node_getRight));

    __jsb_cc_Node_proto->defineFunction("_getWorldPosition", _SE(js_scene_Node_getWorldPosition));
    __jsb_cc_Node_proto->defineFunction("_getWorldRotation", _SE(js_scene_Node_getWorldRotation));
    __jsb_cc_Node_proto->defineFunction("_getWorldScale", _SE(js_scene_Node_getWorldScale));

    __jsb_cc_Node_proto->defineFunction("_getWorldMatrix", _SE(js_scene_Node_getWorldMatrix));
    __jsb_cc_Node_proto->defineFunction("_getWorldRS", _SE(js_scene_Node_getWorldRS));
    __jsb_cc_Node_proto->defineFunction("_getWorldRT", _SE(js_scene_Node_getWorldRT));

    __jsb_cc_Node_proto->defineFunction("_setRTS", _SE(js_scene_Node_setRTS));
    __jsb_cc_Node_proto->defineFunction("_inverseTransformPoint", _SE(js_scene_Node_inverseTransformPoint));

    __jsb_cc_scene_Pass_proto->defineProperty("blocks", _SE(js_scene_Pass_blocks_getter), nullptr);

    __jsb_cc_scene_RenderScene_proto->defineProperty("root", _SE(js_scene_RenderScene_root_getter), nullptr);

    __jsb_cc_scene_Model_proto->defineFunction("_setInstancedAttribute", _SE(js_Model_setInstancedAttribute));

    __jsb_cc_scene_Model_proto->defineFunction("_registerListeners", _SE(js_Model_registerListeners));
    __jsb_cc_MaterialInstance_proto->defineFunction("_registerListeners", _SE(js_assets_MaterialInstance_registerListeners));

    return true;
}
