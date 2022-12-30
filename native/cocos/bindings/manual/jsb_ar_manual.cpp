/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "jsb_ar_manual.h"

#include "bindings/auto/jsb_ar_auto.h"
#include "bindings/manual/jsb_global.h"

static bool js_ar_ARModule_getAddedPlanesInfo(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float* result = cobj->getAddedPlanesInfo();

        int len = cobj->getInfoLength();
        se::HandleObject planesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, result, sizeof(float) * len)};
        s.rval().setObject(planesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}

SE_BIND_FUNC(js_ar_ARModule_getAddedPlanesInfo)

static bool js_ar_ARModule_getUpdatedPlanesInfo(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float* result = cobj->getUpdatedPlanesInfo();
        int len = cobj->getInfoLength();
        se::HandleObject planesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, result, sizeof(float) * len)};
        s.rval().setObject(planesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getUpdatedPlanesInfo)

static bool js_ar_ARModule_getRemovedPlanesInfo(se::State& s) {
    auto* cobj = SE_THIS_OBJECT<cc::ar::ARModule>(s);
    if (nullptr == cobj) return true;
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float* result = cobj->getRemovedPlanesInfo();
        int len = cobj->getInfoLength();
        se::HandleObject planesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, result, sizeof(float) * len)};
        s.rval().setObject(planesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getRemovedPlanesInfo)

static bool js_ar_ARModule_getPlanePolygon(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getPlanePolygon : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_ar_ARModule_getPlanePolygon : Error processing arguments");

        float* buffer = cobj->getPlanePolygon(arg0.value());
        int len = cobj->getInfoLength();
        se::HandleObject verticesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(verticesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getPlanePolygon)

static bool js_ar_ARModule_getAddedSceneMesh(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getAddedSceneMesh : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        float* buffer = cobj->getAddedSceneMesh();
        int len = cobj->getInfoLength();
        se::HandleObject planesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(planesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getAddedSceneMesh)

static bool js_ar_ARModule_getUpdatedSceneMesh(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getUpdatedSceneMesh : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        float* buffer = cobj->getUpdatedSceneMesh();
        int len = cobj->getInfoLength();
        se::HandleObject planesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(planesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getUpdatedSceneMesh)

static bool js_ar_ARModule_getRemovedSceneMesh(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getRemovedSceneMesh : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        float* buffer = cobj->getRemovedSceneMesh();
        int len = cobj->getInfoLength();
        se::HandleObject meshesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(meshesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getRemovedSceneMesh)

static bool js_ar_ARModule_requireSceneMesh(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_requireSceneMesh : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        int* buffer = cobj->requireSceneMesh();
        int len = cobj->getInfoLength();
        se::HandleObject meshesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::UINT32, buffer, sizeof(float) * len)};
        s.rval().setObject(meshesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_requireSceneMesh)

static bool js_ar_ARModule_getSceneMeshVertices(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getSceneMeshVertices : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_ar_ARModule_getSceneMeshVertices : Error processing arguments");

        float* buffer = cobj->getSceneMeshVertices(arg0.value());
        int len = cobj->getInfoLength();
        se::HandleObject verticesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(verticesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getSceneMeshVertices)

static bool js_ar_ARModule_getSceneMeshTriangleIndices(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getSceneMeshTriangleIndices : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_ar_ARModule_getSceneMeshTriangleIndices : Error processing arguments");

        int* buffer = cobj->getSceneMeshTriangleIndices(arg0.value());
        int len = cobj->getInfoLength();
        se::HandleObject indicesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::UINT32, buffer, sizeof(float) * len)};
        s.rval().setObject(indicesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getSceneMeshTriangleIndices)

static bool js_ar_ARModule_getAddedImagesInfo(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getAddedImagesInfo : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        float* buffer = cobj->getAddedImagesInfo();
        int len = cobj->getInfoLength();
        se::HandleObject imagesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(imagesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getAddedImagesInfo)

static bool js_ar_ARModule_getUpdatedImagesInfo(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getUpdatedImagesInfo : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        float* buffer = cobj->getUpdatedImagesInfo();
        int len = cobj->getInfoLength();
        se::HandleObject imagesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(imagesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getUpdatedImagesInfo)

static bool js_ar_ARModule_getRemovedImagesInfo(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getRemovedImagesInfo : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        float* buffer = cobj->getRemovedImagesInfo();
        int len = cobj->getInfoLength();
        se::HandleObject imagesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(imagesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getRemovedImagesInfo)

static bool js_ar_ARModule_getAddedObjectsInfo(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getAddedObjectsInfo : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        float* buffer = cobj->getAddedObjectsInfo();
        int len = cobj->getInfoLength();
        se::HandleObject info{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(info);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getAddedObjectsInfo)

static bool js_ar_ARModule_getUpdatedObjectsInfo(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getUpdatedObjectsInfo : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        float* buffer = cobj->getUpdatedObjectsInfo();
        int len = cobj->getInfoLength();
        se::HandleObject info{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(info);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getUpdatedObjectsInfo)

static bool js_ar_ARModule_getRemovedObjectsInfo(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getRemovedObjectsInfo : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        float* buffer = cobj->getRemovedObjectsInfo();
        int len = cobj->getInfoLength();
        se::HandleObject info{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(info);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getRemovedObjectsInfo)

static bool js_ar_ARModule_getAddedFacesInfo(se::State& s) {
    auto* cobj = static_cast<cc::ar::ARModule*>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getAddedFacesInfo : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        float* buffer = cobj->getAddedFacesInfo();
        int len = cobj->getInfoLength();
        se::HandleObject info{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(info);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getAddedFacesInfo)

static bool js_ar_ARModule_getUpdatedFacesInfo(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getUpdatedFacesInfo : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        float* buffer = cobj->getUpdatedFacesInfo();
        int len = cobj->getInfoLength();
        se::HandleObject info{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(info);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getUpdatedFacesInfo)

static bool js_ar_ARModule_getRemovedFacesInfo(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getRemovedFacesInfo : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        float* buffer = cobj->getRemovedFacesInfo();
        int len = cobj->getInfoLength();
        se::HandleObject info{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(info);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getRemovedFacesInfo)

static bool js_ar_ARModule_getFaceBlendShapes(se::State& s) {
    cc::ar::ARModule* cobj = (cc::ar::ARModule*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_ar_ARModule_getFaceBlendShapes : Invalid Native Object");

    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_ar_ARModule_getFaceBlendShapes : Error processing arguments");

        float* buffer = cobj->getFaceBlendShapes(arg0.value());
        int len = cobj->getInfoLength();
        se::HandleObject verticesInfo{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, buffer, sizeof(float) * len)};
        s.rval().setObject(verticesInfo);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_ar_ARModule_getFaceBlendShapes)

bool register_all_ar_manual(se::Object* obj) {
    __jsb_cc_ar_ARModule_proto->defineFunction("getAddedPlanesInfo", _SE(js_ar_ARModule_getAddedPlanesInfo));
    __jsb_cc_ar_ARModule_proto->defineFunction("getUpdatedPlanesInfo", _SE(js_ar_ARModule_getUpdatedPlanesInfo));
    __jsb_cc_ar_ARModule_proto->defineFunction("getRemovedPlanesInfo", _SE(js_ar_ARModule_getRemovedPlanesInfo));
    __jsb_cc_ar_ARModule_proto->defineFunction("getPlanePolygon", _SE(js_ar_ARModule_getPlanePolygon));

    __jsb_cc_ar_ARModule_proto->defineFunction("getAddedSceneMesh", _SE(js_ar_ARModule_getAddedSceneMesh));
    __jsb_cc_ar_ARModule_proto->defineFunction("getUpdatedSceneMesh", _SE(js_ar_ARModule_getUpdatedSceneMesh));
    __jsb_cc_ar_ARModule_proto->defineFunction("getRemovedSceneMesh", _SE(js_ar_ARModule_getRemovedSceneMesh));
    __jsb_cc_ar_ARModule_proto->defineFunction("requireSceneMesh", _SE(js_ar_ARModule_requireSceneMesh));
    __jsb_cc_ar_ARModule_proto->defineFunction("getSceneMeshVertices", _SE(js_ar_ARModule_getSceneMeshVertices));
    __jsb_cc_ar_ARModule_proto->defineFunction("getSceneMeshTriangleIndices", _SE(js_ar_ARModule_getSceneMeshTriangleIndices));

    __jsb_cc_ar_ARModule_proto->defineFunction("getAddedImagesInfo", _SE(js_ar_ARModule_getAddedImagesInfo));
    __jsb_cc_ar_ARModule_proto->defineFunction("getUpdatedImagesInfo", _SE(js_ar_ARModule_getUpdatedImagesInfo));
    __jsb_cc_ar_ARModule_proto->defineFunction("getRemovedImagesInfo", _SE(js_ar_ARModule_getRemovedImagesInfo));

    __jsb_cc_ar_ARModule_proto->defineFunction("getAddedObjectsInfo", _SE(js_ar_ARModule_getAddedObjectsInfo));
    __jsb_cc_ar_ARModule_proto->defineFunction("getUpdatedObjectsInfo", _SE(js_ar_ARModule_getUpdatedObjectsInfo));
    __jsb_cc_ar_ARModule_proto->defineFunction("getRemovedObjectsInfo", _SE(js_ar_ARModule_getRemovedObjectsInfo));

    __jsb_cc_ar_ARModule_proto->defineFunction("getAddedFacesInfo", _SE(js_ar_ARModule_getAddedFacesInfo));
    __jsb_cc_ar_ARModule_proto->defineFunction("getUpdatedFacesInfo", _SE(js_ar_ARModule_getUpdatedFacesInfo));
    __jsb_cc_ar_ARModule_proto->defineFunction("getRemovedFacesInfo", _SE(js_ar_ARModule_getRemovedFacesInfo));
    __jsb_cc_ar_ARModule_proto->defineFunction("getFaceBlendShapes", _SE(js_ar_ARModule_getFaceBlendShapes));

    return true;
}
