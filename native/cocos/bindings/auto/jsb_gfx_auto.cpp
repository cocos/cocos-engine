#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "renderer/core/Core.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Format *to, se::Object *ctx)
{
    typedef typename std::underlying_type_t<cc::gfx::Format>  under_type;
    under_type tmp;
    if(sevalue_to_native(from, &tmp, ctx)) { *to = static_cast<cc::gfx::Format>(tmp); return true;}
    return false;
}

int js_register_gfx_Format(se::Object* obj)
{
    auto enum_kls = se::Object::createPlainObject();
    enum_kls->setProperty("UNKNOWN", se::Value(0));
    enum_kls->setProperty("A8", se::Value(1));
    enum_kls->setProperty("L8", se::Value(2));
    enum_kls->setProperty("LA8", se::Value(3));
    enum_kls->setProperty("R8", se::Value(4));
    enum_kls->setProperty("R8SN", se::Value(5));
    enum_kls->setProperty("R8UI", se::Value(6));
    enum_kls->setProperty("R8I", se::Value(7));
    enum_kls->setProperty("R16F", se::Value(8));
    enum_kls->setProperty("R16UI", se::Value(9));
    enum_kls->setProperty("R16I", se::Value(10));
    enum_kls->setProperty("R32F", se::Value(11));
    enum_kls->setProperty("R32UI", se::Value(12));
    enum_kls->setProperty("R32I", se::Value(13));
    enum_kls->setProperty("RG8", se::Value(14));
    enum_kls->setProperty("RG8SN", se::Value(15));
    enum_kls->setProperty("RG8UI", se::Value(16));
    enum_kls->setProperty("RG8I", se::Value(17));
    enum_kls->setProperty("RG16F", se::Value(18));
    enum_kls->setProperty("RG16UI", se::Value(19));
    enum_kls->setProperty("RG16I", se::Value(20));
    enum_kls->setProperty("RG32F", se::Value(21));
    enum_kls->setProperty("RG32UI", se::Value(22));
    enum_kls->setProperty("RG32I", se::Value(23));
    enum_kls->setProperty("RGB8", se::Value(24));
    enum_kls->setProperty("SRGB8", se::Value(25));
    enum_kls->setProperty("RGB8SN", se::Value(26));
    enum_kls->setProperty("RGB8UI", se::Value(27));
    enum_kls->setProperty("RGB8I", se::Value(28));
    enum_kls->setProperty("RGB16F", se::Value(29));
    enum_kls->setProperty("RGB16UI", se::Value(30));
    enum_kls->setProperty("RGB16I", se::Value(31));
    enum_kls->setProperty("RGB32F", se::Value(32));
    enum_kls->setProperty("RGB32UI", se::Value(33));
    enum_kls->setProperty("RGB32I", se::Value(34));
    enum_kls->setProperty("RGBA8", se::Value(35));
    enum_kls->setProperty("BGRA8", se::Value(36));
    enum_kls->setProperty("SRGB8_A8", se::Value(37));
    enum_kls->setProperty("RGBA8SN", se::Value(38));
    enum_kls->setProperty("RGBA8UI", se::Value(39));
    enum_kls->setProperty("RGBA8I", se::Value(40));
    enum_kls->setProperty("RGBA16F", se::Value(41));
    enum_kls->setProperty("RGBA16UI", se::Value(42));
    enum_kls->setProperty("RGBA16I", se::Value(43));
    enum_kls->setProperty("RGBA32F", se::Value(44));
    enum_kls->setProperty("RGBA32UI", se::Value(45));
    enum_kls->setProperty("RGBA32I", se::Value(46));
    enum_kls->setProperty("R5G6B5", se::Value(47));
    enum_kls->setProperty("R11G11B10F", se::Value(48));
    enum_kls->setProperty("RGB5A1", se::Value(49));
    enum_kls->setProperty("RGBA4", se::Value(50));
    enum_kls->setProperty("RGB10A2", se::Value(51));
    enum_kls->setProperty("RGB10A2UI", se::Value(52));
    enum_kls->setProperty("RGB9E5", se::Value(53));
    enum_kls->setProperty("D16", se::Value(54));
    enum_kls->setProperty("D16S8", se::Value(55));
    enum_kls->setProperty("D24", se::Value(56));
    enum_kls->setProperty("D24S8", se::Value(57));
    enum_kls->setProperty("D32F", se::Value(58));
    enum_kls->setProperty("D32F_S8", se::Value(59));
    enum_kls->setProperty("BC1", se::Value(60));
    enum_kls->setProperty("BC1_ALPHA", se::Value(61));
    enum_kls->setProperty("BC1_SRGB", se::Value(62));
    enum_kls->setProperty("BC1_SRGB_ALPHA", se::Value(63));
    enum_kls->setProperty("BC2", se::Value(64));
    enum_kls->setProperty("BC2_SRGB", se::Value(65));
    enum_kls->setProperty("BC3", se::Value(66));
    enum_kls->setProperty("BC3_SRGB", se::Value(67));
    enum_kls->setProperty("BC4", se::Value(68));
    enum_kls->setProperty("BC4_SNORM", se::Value(69));
    enum_kls->setProperty("BC5", se::Value(70));
    enum_kls->setProperty("BC5_SNORM", se::Value(71));
    enum_kls->setProperty("BC6H_UF16", se::Value(72));
    enum_kls->setProperty("BC6H_SF16", se::Value(73));
    enum_kls->setProperty("BC7", se::Value(74));
    enum_kls->setProperty("BC7_SRGB", se::Value(75));
    enum_kls->setProperty("ETC_RGB8", se::Value(76));
    enum_kls->setProperty("ETC2_RGB8", se::Value(77));
    enum_kls->setProperty("ETC2_SRGB8", se::Value(78));
    enum_kls->setProperty("ETC2_RGB8_A1", se::Value(79));
    enum_kls->setProperty("ETC2_SRGB8_A1", se::Value(80));
    enum_kls->setProperty("ETC2_RGBA8", se::Value(81));
    enum_kls->setProperty("ETC2_SRGB8_A8", se::Value(82));
    enum_kls->setProperty("EAC_R11", se::Value(83));
    enum_kls->setProperty("EAC_R11SN", se::Value(84));
    enum_kls->setProperty("EAC_RG11", se::Value(85));
    enum_kls->setProperty("EAC_RG11SN", se::Value(86));
    enum_kls->setProperty("PVRTC_RGB2", se::Value(87));
    enum_kls->setProperty("PVRTC_RGBA2", se::Value(88));
    enum_kls->setProperty("PVRTC_RGB4", se::Value(89));
    enum_kls->setProperty("PVRTC_RGBA4", se::Value(90));
    enum_kls->setProperty("PVRTC2_2BPP", se::Value(91));
    enum_kls->setProperty("PVRTC2_4BPP", se::Value(92));
    enum_kls->setProperty("ASTC_RGBA_4x4", se::Value(93));
    enum_kls->setProperty("ASTC_RGBA_5x4", se::Value(94));
    enum_kls->setProperty("ASTC_RGBA_5x5", se::Value(95));
    enum_kls->setProperty("ASTC_RGBA_6x5", se::Value(96));
    enum_kls->setProperty("ASTC_RGBA_6x6", se::Value(97));
    enum_kls->setProperty("ASTC_RGBA_8x5", se::Value(98));
    enum_kls->setProperty("ASTC_RGBA_8x6", se::Value(99));
    enum_kls->setProperty("ASTC_RGBA_8x8", se::Value(100));
    enum_kls->setProperty("ASTC_RGBA_10x5", se::Value(101));
    enum_kls->setProperty("ASTC_RGBA_10x6", se::Value(102));
    enum_kls->setProperty("ASTC_RGBA_10x8", se::Value(103));
    enum_kls->setProperty("ASTC_RGBA_10x10", se::Value(104));
    enum_kls->setProperty("ASTC_RGBA_12x10", se::Value(105));
    enum_kls->setProperty("ASTC_RGBA_12x12", se::Value(106));
    enum_kls->setProperty("ASTC_SRGBA_4x4", se::Value(107));
    enum_kls->setProperty("ASTC_SRGBA_5x4", se::Value(108));
    enum_kls->setProperty("ASTC_SRGBA_5x5", se::Value(109));
    enum_kls->setProperty("ASTC_SRGBA_6x5", se::Value(110));
    enum_kls->setProperty("ASTC_SRGBA_6x6", se::Value(111));
    enum_kls->setProperty("ASTC_SRGBA_8x5", se::Value(112));
    enum_kls->setProperty("ASTC_SRGBA_8x6", se::Value(113));
    enum_kls->setProperty("ASTC_SRGBA_8x8", se::Value(114));
    enum_kls->setProperty("ASTC_SRGBA_10x5", se::Value(115));
    enum_kls->setProperty("ASTC_SRGBA_10x6", se::Value(116));
    enum_kls->setProperty("ASTC_SRGBA_10x8", se::Value(117));
    enum_kls->setProperty("ASTC_SRGBA_10x10", se::Value(118));
    enum_kls->setProperty("ASTC_SRGBA_12x10", se::Value(119));
    enum_kls->setProperty("ASTC_SRGBA_12x12", se::Value(120));
    enum_kls->setProperty("COUNT", se::Value(121));
    obj->setProperty("Format", se::Value(enum_kls));
    return true;
}


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::TextureLayout *to, se::Object *ctx)
{
    typedef typename std::underlying_type_t<cc::gfx::TextureLayout>  under_type;
    under_type tmp;
    if(sevalue_to_native(from, &tmp, ctx)) { *to = static_cast<cc::gfx::TextureLayout>(tmp); return true;}
    return false;
}

int js_register_gfx_TextureLayout(se::Object* obj)
{
    auto enum_kls = se::Object::createPlainObject();
    enum_kls->setProperty("UNDEFINED", se::Value(0));
    enum_kls->setProperty("GENERAL", se::Value(1));
    enum_kls->setProperty("COLOR_ATTACHMENT_OPTIMAL", se::Value(2));
    enum_kls->setProperty("DEPTH_STENCIL_ATTACHMENT_OPTIMAL", se::Value(3));
    enum_kls->setProperty("DEPTH_STENCIL_READONLY_OPTIMAL", se::Value(4));
    enum_kls->setProperty("SHADER_READONLY_OPTIMAL", se::Value(5));
    enum_kls->setProperty("TRANSFER_SRC_OPTIMAL", se::Value(6));
    enum_kls->setProperty("TRANSFER_DST_OPTIMAL", se::Value(7));
    enum_kls->setProperty("PREINITIALIZED", se::Value(8));
    enum_kls->setProperty("PRESENT_SRC", se::Value(9));
    obj->setProperty("TextureLayout", se::Value(enum_kls));
    return true;
}


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::PrimitiveMode *to, se::Object *ctx)
{
    typedef typename std::underlying_type_t<cc::gfx::PrimitiveMode>  under_type;
    under_type tmp;
    if(sevalue_to_native(from, &tmp, ctx)) { *to = static_cast<cc::gfx::PrimitiveMode>(tmp); return true;}
    return false;
}

int js_register_gfx_PrimitiveMode(se::Object* obj)
{
    auto enum_kls = se::Object::createPlainObject();
    enum_kls->setProperty("POINT_LIST", se::Value(0));
    enum_kls->setProperty("LINE_LIST", se::Value(1));
    enum_kls->setProperty("LINE_STRIP", se::Value(2));
    enum_kls->setProperty("LINE_LOOP", se::Value(3));
    enum_kls->setProperty("LINE_LIST_ADJACENCY", se::Value(4));
    enum_kls->setProperty("LINE_STRIP_ADJACENCY", se::Value(5));
    enum_kls->setProperty("ISO_LINE_LIST", se::Value(6));
    enum_kls->setProperty("TRIANGLE_LIST", se::Value(7));
    enum_kls->setProperty("TRIANGLE_STRIP", se::Value(8));
    enum_kls->setProperty("TRIANGLE_FAN", se::Value(9));
    enum_kls->setProperty("TRIANGLE_LIST_ADJACENCY", se::Value(10));
    enum_kls->setProperty("TRIANGLE_STRIP_ADJACENCY", se::Value(11));
    enum_kls->setProperty("TRIANGLE_PATCH_ADJACENCY", se::Value(12));
    enum_kls->setProperty("QUAD_PATCH_LIST", se::Value(13));
    obj->setProperty("PrimitiveMode", se::Value(enum_kls));
    return true;
}
se::Object* __jsb_cc_gfx_Offset_proto = nullptr;
se::Class* __jsb_cc_gfx_Offset_class = nullptr;

static bool js_gfx_Offset_get_x(se::State& s)
{
    cc::gfx::Offset* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->x, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Offset_get_x)

static bool js_gfx_Offset_set_x(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Offset* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->x, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Offset_set_x : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Offset_set_x)

static bool js_gfx_Offset_get_y(se::State& s)
{
    cc::gfx::Offset* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->y, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Offset_get_y)

static bool js_gfx_Offset_set_y(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Offset* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->y, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Offset_set_y : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Offset_set_y)

static bool js_gfx_Offset_get_z(se::State& s)
{
    cc::gfx::Offset* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_get_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->z, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Offset_get_z)

static bool js_gfx_Offset_set_z(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Offset* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Offset_set_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->z, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Offset_set_z : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Offset_set_z)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Offset * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::Offset*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("x", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->x), ctx);
    }
    json->getProperty("y", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->y), ctx);
    }
    json->getProperty("z", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->z), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Offset_finalize)

static bool js_gfx_Offset_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Offset* cobj = JSB_ALLOC(cc::gfx::Offset);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Offset* cobj = JSB_ALLOC(cc::gfx::Offset);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::Offset* cobj = JSB_ALLOC(cc::gfx::Offset);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->x), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->y), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->z), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_Offset_constructor, __jsb_cc_gfx_Offset_class, js_cc_gfx_Offset_finalize)




static bool js_cc_gfx_Offset_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Offset>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Offset* cobj = SE_THIS_OBJECT<cc::gfx::Offset>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Offset_finalize)

bool js_register_gfx_Offset(se::Object* obj)
{
    auto cls = se::Class::create("Offset", obj, nullptr, _SE(js_gfx_Offset_constructor));

    cls->defineProperty("x", _SE(js_gfx_Offset_get_x), _SE(js_gfx_Offset_set_x));
    cls->defineProperty("y", _SE(js_gfx_Offset_get_y), _SE(js_gfx_Offset_set_y));
    cls->defineProperty("z", _SE(js_gfx_Offset_get_z), _SE(js_gfx_Offset_set_z));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Offset_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Offset>(cls);

    __jsb_cc_gfx_Offset_proto = cls->getProto();
    __jsb_cc_gfx_Offset_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Rect_proto = nullptr;
se::Class* __jsb_cc_gfx_Rect_class = nullptr;

static bool js_gfx_Rect_get_x(se::State& s)
{
    cc::gfx::Rect* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->x, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Rect_get_x)

static bool js_gfx_Rect_set_x(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Rect* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->x, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Rect_set_x : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Rect_set_x)

static bool js_gfx_Rect_get_y(se::State& s)
{
    cc::gfx::Rect* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->y, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Rect_get_y)

static bool js_gfx_Rect_set_y(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Rect* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->y, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Rect_set_y : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Rect_set_y)

static bool js_gfx_Rect_get_width(se::State& s)
{
    cc::gfx::Rect* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Rect_get_width)

static bool js_gfx_Rect_set_width(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Rect* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Rect_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Rect_set_width)

static bool js_gfx_Rect_get_height(se::State& s)
{
    cc::gfx::Rect* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Rect_get_height)

static bool js_gfx_Rect_set_height(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Rect* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Rect_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Rect_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Rect_set_height)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Rect * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::Rect*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("x", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->x), ctx);
    }
    json->getProperty("y", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->y), ctx);
    }
    json->getProperty("width", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Rect_finalize)

static bool js_gfx_Rect_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Rect* cobj = JSB_ALLOC(cc::gfx::Rect);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Rect* cobj = JSB_ALLOC(cc::gfx::Rect);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::Rect* cobj = JSB_ALLOC(cc::gfx::Rect);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->x), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->y), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->width), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->height), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_Rect_constructor, __jsb_cc_gfx_Rect_class, js_cc_gfx_Rect_finalize)




static bool js_cc_gfx_Rect_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Rect>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Rect* cobj = SE_THIS_OBJECT<cc::gfx::Rect>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Rect_finalize)

bool js_register_gfx_Rect(se::Object* obj)
{
    auto cls = se::Class::create("Rect", obj, nullptr, _SE(js_gfx_Rect_constructor));

    cls->defineProperty("x", _SE(js_gfx_Rect_get_x), _SE(js_gfx_Rect_set_x));
    cls->defineProperty("y", _SE(js_gfx_Rect_get_y), _SE(js_gfx_Rect_set_y));
    cls->defineProperty("width", _SE(js_gfx_Rect_get_width), _SE(js_gfx_Rect_set_width));
    cls->defineProperty("height", _SE(js_gfx_Rect_get_height), _SE(js_gfx_Rect_set_height));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Rect_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Rect>(cls);

    __jsb_cc_gfx_Rect_proto = cls->getProto();
    __jsb_cc_gfx_Rect_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Extent_proto = nullptr;
se::Class* __jsb_cc_gfx_Extent_class = nullptr;

static bool js_gfx_Extent_get_width(se::State& s)
{
    cc::gfx::Extent* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Extent_get_width)

static bool js_gfx_Extent_set_width(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Extent* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Extent_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Extent_set_width)

static bool js_gfx_Extent_get_height(se::State& s)
{
    cc::gfx::Extent* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Extent_get_height)

static bool js_gfx_Extent_set_height(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Extent* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Extent_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Extent_set_height)

static bool js_gfx_Extent_get_depth(se::State& s)
{
    cc::gfx::Extent* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_get_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Extent_get_depth)

static bool js_gfx_Extent_set_depth(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Extent* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Extent_set_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depth, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Extent_set_depth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Extent_set_depth)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Extent * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::Extent*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("width", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    json->getProperty("depth", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depth), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Extent_finalize)

static bool js_gfx_Extent_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Extent* cobj = JSB_ALLOC(cc::gfx::Extent);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Extent* cobj = JSB_ALLOC(cc::gfx::Extent);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::Extent* cobj = JSB_ALLOC(cc::gfx::Extent);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->width), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->height), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->depth), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_Extent_constructor, __jsb_cc_gfx_Extent_class, js_cc_gfx_Extent_finalize)




static bool js_cc_gfx_Extent_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Extent>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Extent* cobj = SE_THIS_OBJECT<cc::gfx::Extent>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Extent_finalize)

bool js_register_gfx_Extent(se::Object* obj)
{
    auto cls = se::Class::create("Extent", obj, nullptr, _SE(js_gfx_Extent_constructor));

    cls->defineProperty("width", _SE(js_gfx_Extent_get_width), _SE(js_gfx_Extent_set_width));
    cls->defineProperty("height", _SE(js_gfx_Extent_get_height), _SE(js_gfx_Extent_set_height));
    cls->defineProperty("depth", _SE(js_gfx_Extent_get_depth), _SE(js_gfx_Extent_set_depth));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Extent_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Extent>(cls);

    __jsb_cc_gfx_Extent_proto = cls->getProto();
    __jsb_cc_gfx_Extent_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_TextureSubres_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureSubres_class = nullptr;

static bool js_gfx_TextureSubres_get_mipLevel(se::State& s)
{
    cc::gfx::TextureSubres* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubres>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubres_get_mipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->mipLevel, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubres_get_mipLevel)

static bool js_gfx_TextureSubres_set_mipLevel(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureSubres* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubres>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubres_set_mipLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->mipLevel, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubres_set_mipLevel : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubres_set_mipLevel)

static bool js_gfx_TextureSubres_get_baseArrayLayer(se::State& s)
{
    cc::gfx::TextureSubres* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubres>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubres_get_baseArrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->baseArrayLayer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubres_get_baseArrayLayer)

static bool js_gfx_TextureSubres_set_baseArrayLayer(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureSubres* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubres>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubres_set_baseArrayLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->baseArrayLayer, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubres_set_baseArrayLayer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubres_set_baseArrayLayer)

static bool js_gfx_TextureSubres_get_layerCount(se::State& s)
{
    cc::gfx::TextureSubres* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubres>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubres_get_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->layerCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureSubres_get_layerCount)

static bool js_gfx_TextureSubres_set_layerCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureSubres* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubres>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureSubres_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->layerCount, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureSubres_set_layerCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureSubres_set_layerCount)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::TextureSubres * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::TextureSubres*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("mipLevel", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mipLevel), ctx);
    }
    json->getProperty("baseArrayLayer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->baseArrayLayer), ctx);
    }
    json->getProperty("layerCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->layerCount), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureSubres_finalize)

static bool js_gfx_TextureSubres_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::TextureSubres* cobj = JSB_ALLOC(cc::gfx::TextureSubres);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureSubres* cobj = JSB_ALLOC(cc::gfx::TextureSubres);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::TextureSubres* cobj = JSB_ALLOC(cc::gfx::TextureSubres);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->mipLevel), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->baseArrayLayer), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->layerCount), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_TextureSubres_constructor, __jsb_cc_gfx_TextureSubres_class, js_cc_gfx_TextureSubres_finalize)




static bool js_cc_gfx_TextureSubres_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::TextureSubres>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::TextureSubres* cobj = SE_THIS_OBJECT<cc::gfx::TextureSubres>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureSubres_finalize)

bool js_register_gfx_TextureSubres(se::Object* obj)
{
    auto cls = se::Class::create("TextureSubres", obj, nullptr, _SE(js_gfx_TextureSubres_constructor));

    cls->defineProperty("mipLevel", _SE(js_gfx_TextureSubres_get_mipLevel), _SE(js_gfx_TextureSubres_set_mipLevel));
    cls->defineProperty("baseArrayLayer", _SE(js_gfx_TextureSubres_get_baseArrayLayer), _SE(js_gfx_TextureSubres_set_baseArrayLayer));
    cls->defineProperty("layerCount", _SE(js_gfx_TextureSubres_get_layerCount), _SE(js_gfx_TextureSubres_set_layerCount));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureSubres_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureSubres>(cls);

    __jsb_cc_gfx_TextureSubres_proto = cls->getProto();
    __jsb_cc_gfx_TextureSubres_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BufferTextureCopy_proto = nullptr;
se::Class* __jsb_cc_gfx_BufferTextureCopy_class = nullptr;

static bool js_gfx_BufferTextureCopy_get_buffStride(se::State& s)
{
    cc::gfx::BufferTextureCopy* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_buffStride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->buffStride, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_buffStride)

static bool js_gfx_BufferTextureCopy_set_buffStride(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferTextureCopy* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_buffStride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->buffStride, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_buffStride : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_buffStride)

static bool js_gfx_BufferTextureCopy_get_buffTexHeight(se::State& s)
{
    cc::gfx::BufferTextureCopy* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_buffTexHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->buffTexHeight, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_buffTexHeight)

static bool js_gfx_BufferTextureCopy_set_buffTexHeight(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferTextureCopy* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_buffTexHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->buffTexHeight, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_buffTexHeight : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_buffTexHeight)

static bool js_gfx_BufferTextureCopy_get_texOffset(se::State& s)
{
    cc::gfx::BufferTextureCopy* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_texOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->texOffset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_texOffset)

static bool js_gfx_BufferTextureCopy_set_texOffset(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferTextureCopy* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_texOffset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->texOffset, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_texOffset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_texOffset)

static bool js_gfx_BufferTextureCopy_get_texExtent(se::State& s)
{
    cc::gfx::BufferTextureCopy* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_texExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->texExtent, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_texExtent)

static bool js_gfx_BufferTextureCopy_set_texExtent(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferTextureCopy* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_texExtent : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->texExtent, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_texExtent : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_texExtent)

static bool js_gfx_BufferTextureCopy_get_texSubres(se::State& s)
{
    cc::gfx::BufferTextureCopy* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_get_texSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->texSubres, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferTextureCopy_get_texSubres)

static bool js_gfx_BufferTextureCopy_set_texSubres(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferTextureCopy* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferTextureCopy_set_texSubres : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->texSubres, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferTextureCopy_set_texSubres : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferTextureCopy_set_texSubres)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::BufferTextureCopy * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::BufferTextureCopy*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("buffStride", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffStride), ctx);
    }
    json->getProperty("buffTexHeight", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffTexHeight), ctx);
    }
    json->getProperty("texOffset", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->texOffset), ctx);
    }
    json->getProperty("texExtent", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->texExtent), ctx);
    }
    json->getProperty("texSubres", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->texSubres), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BufferTextureCopy_finalize)

static bool js_gfx_BufferTextureCopy_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::BufferTextureCopy* cobj = JSB_ALLOC(cc::gfx::BufferTextureCopy);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BufferTextureCopy* cobj = JSB_ALLOC(cc::gfx::BufferTextureCopy);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::BufferTextureCopy* cobj = JSB_ALLOC(cc::gfx::BufferTextureCopy);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->buffStride), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->buffTexHeight), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->texOffset), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->texExtent), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->texSubres), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_BufferTextureCopy_constructor, __jsb_cc_gfx_BufferTextureCopy_class, js_cc_gfx_BufferTextureCopy_finalize)




static bool js_cc_gfx_BufferTextureCopy_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BufferTextureCopy* cobj = SE_THIS_OBJECT<cc::gfx::BufferTextureCopy>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BufferTextureCopy_finalize)

bool js_register_gfx_BufferTextureCopy(se::Object* obj)
{
    auto cls = se::Class::create("BufferTextureCopy", obj, nullptr, _SE(js_gfx_BufferTextureCopy_constructor));

    cls->defineProperty("buffStride", _SE(js_gfx_BufferTextureCopy_get_buffStride), _SE(js_gfx_BufferTextureCopy_set_buffStride));
    cls->defineProperty("buffTexHeight", _SE(js_gfx_BufferTextureCopy_get_buffTexHeight), _SE(js_gfx_BufferTextureCopy_set_buffTexHeight));
    cls->defineProperty("texOffset", _SE(js_gfx_BufferTextureCopy_get_texOffset), _SE(js_gfx_BufferTextureCopy_set_texOffset));
    cls->defineProperty("texExtent", _SE(js_gfx_BufferTextureCopy_get_texExtent), _SE(js_gfx_BufferTextureCopy_set_texExtent));
    cls->defineProperty("texSubres", _SE(js_gfx_BufferTextureCopy_get_texSubres), _SE(js_gfx_BufferTextureCopy_set_texSubres));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BufferTextureCopy_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BufferTextureCopy>(cls);

    __jsb_cc_gfx_BufferTextureCopy_proto = cls->getProto();
    __jsb_cc_gfx_BufferTextureCopy_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Color_proto = nullptr;
se::Class* __jsb_cc_gfx_Color_class = nullptr;

static bool js_gfx_Color_get_x(se::State& s)
{
    cc::gfx::Color* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_get_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->x, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Color_get_x)

static bool js_gfx_Color_set_x(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Color* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_set_x : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->x, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Color_set_x : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Color_set_x)

static bool js_gfx_Color_get_y(se::State& s)
{
    cc::gfx::Color* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_get_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->y, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Color_get_y)

static bool js_gfx_Color_set_y(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Color* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_set_y : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->y, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Color_set_y : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Color_set_y)

static bool js_gfx_Color_get_z(se::State& s)
{
    cc::gfx::Color* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_get_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->z, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Color_get_z)

static bool js_gfx_Color_set_z(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Color* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_set_z : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->z, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Color_set_z : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Color_set_z)

static bool js_gfx_Color_get_w(se::State& s)
{
    cc::gfx::Color* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_get_w : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->w, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Color_get_w)

static bool js_gfx_Color_set_w(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Color* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Color_set_w : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->w, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Color_set_w : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Color_set_w)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Color * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::Color*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("x", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->x), ctx);
    }
    json->getProperty("y", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->y), ctx);
    }
    json->getProperty("z", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->z), ctx);
    }
    json->getProperty("w", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->w), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Color_finalize)

static bool js_gfx_Color_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Color* cobj = JSB_ALLOC(cc::gfx::Color);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Color* cobj = JSB_ALLOC(cc::gfx::Color);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::Color* cobj = JSB_ALLOC(cc::gfx::Color);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->x), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->y), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->z), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->w), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_Color_constructor, __jsb_cc_gfx_Color_class, js_cc_gfx_Color_finalize)




static bool js_cc_gfx_Color_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Color>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Color* cobj = SE_THIS_OBJECT<cc::gfx::Color>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Color_finalize)

bool js_register_gfx_Color(se::Object* obj)
{
    auto cls = se::Class::create("Color", obj, nullptr, _SE(js_gfx_Color_constructor));

    cls->defineProperty("x", _SE(js_gfx_Color_get_x), _SE(js_gfx_Color_set_x));
    cls->defineProperty("y", _SE(js_gfx_Color_get_y), _SE(js_gfx_Color_set_y));
    cls->defineProperty("z", _SE(js_gfx_Color_get_z), _SE(js_gfx_Color_set_z));
    cls->defineProperty("w", _SE(js_gfx_Color_get_w), _SE(js_gfx_Color_set_w));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Color_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Color>(cls);

    __jsb_cc_gfx_Color_proto = cls->getProto();
    __jsb_cc_gfx_Color_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BindingMappingInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_BindingMappingInfo_class = nullptr;

static bool js_gfx_BindingMappingInfo_get_bufferOffsets(se::State& s)
{
    cc::gfx::BindingMappingInfo* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingMappingInfo_get_bufferOffsets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bufferOffsets, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingMappingInfo_get_bufferOffsets)

static bool js_gfx_BindingMappingInfo_set_bufferOffsets(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BindingMappingInfo* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingMappingInfo_set_bufferOffsets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bufferOffsets, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BindingMappingInfo_set_bufferOffsets : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingMappingInfo_set_bufferOffsets)

static bool js_gfx_BindingMappingInfo_get_samplerOffsets(se::State& s)
{
    cc::gfx::BindingMappingInfo* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingMappingInfo_get_samplerOffsets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->samplerOffsets, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingMappingInfo_get_samplerOffsets)

static bool js_gfx_BindingMappingInfo_set_samplerOffsets(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BindingMappingInfo* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingMappingInfo_set_samplerOffsets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->samplerOffsets, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BindingMappingInfo_set_samplerOffsets : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingMappingInfo_set_samplerOffsets)

static bool js_gfx_BindingMappingInfo_get_flexibleSet(se::State& s)
{
    cc::gfx::BindingMappingInfo* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingMappingInfo_get_flexibleSet : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->flexibleSet, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BindingMappingInfo_get_flexibleSet)

static bool js_gfx_BindingMappingInfo_set_flexibleSet(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BindingMappingInfo* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BindingMappingInfo_set_flexibleSet : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->flexibleSet, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BindingMappingInfo_set_flexibleSet : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BindingMappingInfo_set_flexibleSet)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::BindingMappingInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::BindingMappingInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("bufferOffsets", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bufferOffsets), ctx);
    }
    json->getProperty("samplerOffsets", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->samplerOffsets), ctx);
    }
    json->getProperty("flexibleSet", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->flexibleSet), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BindingMappingInfo_finalize)

static bool js_gfx_BindingMappingInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::BindingMappingInfo* cobj = JSB_ALLOC(cc::gfx::BindingMappingInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BindingMappingInfo* cobj = JSB_ALLOC(cc::gfx::BindingMappingInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::BindingMappingInfo* cobj = JSB_ALLOC(cc::gfx::BindingMappingInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->bufferOffsets), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->samplerOffsets), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->flexibleSet), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_BindingMappingInfo_constructor, __jsb_cc_gfx_BindingMappingInfo_class, js_cc_gfx_BindingMappingInfo_finalize)




static bool js_cc_gfx_BindingMappingInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BindingMappingInfo* cobj = SE_THIS_OBJECT<cc::gfx::BindingMappingInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BindingMappingInfo_finalize)

bool js_register_gfx_BindingMappingInfo(se::Object* obj)
{
    auto cls = se::Class::create("BindingMappingInfo", obj, nullptr, _SE(js_gfx_BindingMappingInfo_constructor));

    cls->defineProperty("bufferOffsets", _SE(js_gfx_BindingMappingInfo_get_bufferOffsets), _SE(js_gfx_BindingMappingInfo_set_bufferOffsets));
    cls->defineProperty("samplerOffsets", _SE(js_gfx_BindingMappingInfo_get_samplerOffsets), _SE(js_gfx_BindingMappingInfo_set_samplerOffsets));
    cls->defineProperty("flexibleSet", _SE(js_gfx_BindingMappingInfo_get_flexibleSet), _SE(js_gfx_BindingMappingInfo_set_flexibleSet));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BindingMappingInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BindingMappingInfo>(cls);

    __jsb_cc_gfx_BindingMappingInfo_proto = cls->getProto();
    __jsb_cc_gfx_BindingMappingInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_DeviceInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_DeviceInfo_class = nullptr;

static bool js_gfx_DeviceInfo_get_windowHandle(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->windowHandle, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_windowHandle)

static bool js_gfx_DeviceInfo_set_windowHandle(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->windowHandle, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_windowHandle : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_windowHandle)

static bool js_gfx_DeviceInfo_get_width(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_width)

static bool js_gfx_DeviceInfo_set_width(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_width)

static bool js_gfx_DeviceInfo_get_height(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_height)

static bool js_gfx_DeviceInfo_set_height(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_height)

static bool js_gfx_DeviceInfo_get_nativeWidth(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_nativeWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->nativeWidth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_nativeWidth)

static bool js_gfx_DeviceInfo_set_nativeWidth(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_nativeWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->nativeWidth, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_nativeWidth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_nativeWidth)

static bool js_gfx_DeviceInfo_get_nativeHeight(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_nativeHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->nativeHeight, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_nativeHeight)

static bool js_gfx_DeviceInfo_set_nativeHeight(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_nativeHeight : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->nativeHeight, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_nativeHeight : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_nativeHeight)

static bool js_gfx_DeviceInfo_get_sharedCtx(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->sharedCtx, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_sharedCtx)

static bool js_gfx_DeviceInfo_set_sharedCtx(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->sharedCtx, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_sharedCtx : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_sharedCtx)

static bool js_gfx_DeviceInfo_get_bindingMappingInfo(se::State& s)
{
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_get_bindingMappingInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bindingMappingInfo, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DeviceInfo_get_bindingMappingInfo)

static bool js_gfx_DeviceInfo_set_bindingMappingInfo(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DeviceInfo_set_bindingMappingInfo : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bindingMappingInfo, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DeviceInfo_set_bindingMappingInfo : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DeviceInfo_set_bindingMappingInfo)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DeviceInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::DeviceInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("windowHandle", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->windowHandle), ctx);
    }
    json->getProperty("width", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    json->getProperty("nativeWidth", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->nativeWidth), ctx);
    }
    json->getProperty("nativeHeight", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->nativeHeight), ctx);
    }
    json->getProperty("sharedCtx", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->sharedCtx), ctx);
    }
    json->getProperty("bindingMappingInfo", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bindingMappingInfo), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DeviceInfo_finalize)

static bool js_gfx_DeviceInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::DeviceInfo* cobj = JSB_ALLOC(cc::gfx::DeviceInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DeviceInfo* cobj = JSB_ALLOC(cc::gfx::DeviceInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::DeviceInfo* cobj = JSB_ALLOC(cc::gfx::DeviceInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->windowHandle), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->width), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->height), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->nativeWidth), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->nativeHeight), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->sharedCtx), nullptr);;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            ok &= sevalue_to_native(args[6], &(cobj->bindingMappingInfo), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_DeviceInfo_constructor, __jsb_cc_gfx_DeviceInfo_class, js_cc_gfx_DeviceInfo_finalize)




static bool js_cc_gfx_DeviceInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DeviceInfo* cobj = SE_THIS_OBJECT<cc::gfx::DeviceInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DeviceInfo_finalize)

bool js_register_gfx_DeviceInfo(se::Object* obj)
{
    auto cls = se::Class::create("DeviceInfo", obj, nullptr, _SE(js_gfx_DeviceInfo_constructor));

    cls->defineProperty("windowHandle", _SE(js_gfx_DeviceInfo_get_windowHandle), _SE(js_gfx_DeviceInfo_set_windowHandle));
    cls->defineProperty("width", _SE(js_gfx_DeviceInfo_get_width), _SE(js_gfx_DeviceInfo_set_width));
    cls->defineProperty("height", _SE(js_gfx_DeviceInfo_get_height), _SE(js_gfx_DeviceInfo_set_height));
    cls->defineProperty("nativeWidth", _SE(js_gfx_DeviceInfo_get_nativeWidth), _SE(js_gfx_DeviceInfo_set_nativeWidth));
    cls->defineProperty("nativeHeight", _SE(js_gfx_DeviceInfo_get_nativeHeight), _SE(js_gfx_DeviceInfo_set_nativeHeight));
    cls->defineProperty("sharedCtx", _SE(js_gfx_DeviceInfo_get_sharedCtx), _SE(js_gfx_DeviceInfo_set_sharedCtx));
    cls->defineProperty("bindingMappingInfo", _SE(js_gfx_DeviceInfo_get_bindingMappingInfo), _SE(js_gfx_DeviceInfo_set_bindingMappingInfo));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DeviceInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DeviceInfo>(cls);

    __jsb_cc_gfx_DeviceInfo_proto = cls->getProto();
    __jsb_cc_gfx_DeviceInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_ContextInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_ContextInfo_class = nullptr;

static bool js_gfx_ContextInfo_get_windowHandle(se::State& s)
{
    cc::gfx::ContextInfo* cobj = SE_THIS_OBJECT<cc::gfx::ContextInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ContextInfo_get_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->windowHandle, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ContextInfo_get_windowHandle)

static bool js_gfx_ContextInfo_set_windowHandle(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ContextInfo* cobj = SE_THIS_OBJECT<cc::gfx::ContextInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ContextInfo_set_windowHandle : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->windowHandle, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ContextInfo_set_windowHandle : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ContextInfo_set_windowHandle)

static bool js_gfx_ContextInfo_get_sharedCtx(se::State& s)
{
    cc::gfx::ContextInfo* cobj = SE_THIS_OBJECT<cc::gfx::ContextInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ContextInfo_get_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->sharedCtx, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ContextInfo_get_sharedCtx)

static bool js_gfx_ContextInfo_set_sharedCtx(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ContextInfo* cobj = SE_THIS_OBJECT<cc::gfx::ContextInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ContextInfo_set_sharedCtx : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->sharedCtx, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ContextInfo_set_sharedCtx : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ContextInfo_set_sharedCtx)

static bool js_gfx_ContextInfo_get_vsyncMode(se::State& s)
{
    cc::gfx::ContextInfo* cobj = SE_THIS_OBJECT<cc::gfx::ContextInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ContextInfo_get_vsyncMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vsyncMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ContextInfo_get_vsyncMode)

static bool js_gfx_ContextInfo_set_vsyncMode(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ContextInfo* cobj = SE_THIS_OBJECT<cc::gfx::ContextInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ContextInfo_set_vsyncMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vsyncMode, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ContextInfo_set_vsyncMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ContextInfo_set_vsyncMode)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::ContextInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::ContextInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("windowHandle", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->windowHandle), ctx);
    }
    json->getProperty("sharedCtx", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->sharedCtx), ctx);
    }
    json->getProperty("vsyncMode", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vsyncMode), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ContextInfo_finalize)

static bool js_gfx_ContextInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::ContextInfo* cobj = JSB_ALLOC(cc::gfx::ContextInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ContextInfo* cobj = JSB_ALLOC(cc::gfx::ContextInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::ContextInfo* cobj = JSB_ALLOC(cc::gfx::ContextInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->windowHandle), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->sharedCtx), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->vsyncMode), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_ContextInfo_constructor, __jsb_cc_gfx_ContextInfo_class, js_cc_gfx_ContextInfo_finalize)




static bool js_cc_gfx_ContextInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::ContextInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::ContextInfo* cobj = SE_THIS_OBJECT<cc::gfx::ContextInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ContextInfo_finalize)

bool js_register_gfx_ContextInfo(se::Object* obj)
{
    auto cls = se::Class::create("ContextInfo", obj, nullptr, _SE(js_gfx_ContextInfo_constructor));

    cls->defineProperty("windowHandle", _SE(js_gfx_ContextInfo_get_windowHandle), _SE(js_gfx_ContextInfo_set_windowHandle));
    cls->defineProperty("sharedCtx", _SE(js_gfx_ContextInfo_get_sharedCtx), _SE(js_gfx_ContextInfo_set_sharedCtx));
    cls->defineProperty("vsyncMode", _SE(js_gfx_ContextInfo_get_vsyncMode), _SE(js_gfx_ContextInfo_set_vsyncMode));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ContextInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ContextInfo>(cls);

    __jsb_cc_gfx_ContextInfo_proto = cls->getProto();
    __jsb_cc_gfx_ContextInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BufferInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_BufferInfo_class = nullptr;

static bool js_gfx_BufferInfo_get_usage(se::State& s)
{
    cc::gfx::BufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->usage, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_usage)

static bool js_gfx_BufferInfo_set_usage(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->usage, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_usage : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_usage)

static bool js_gfx_BufferInfo_get_memUsage(se::State& s)
{
    cc::gfx::BufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_memUsage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->memUsage, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_memUsage)

static bool js_gfx_BufferInfo_set_memUsage(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_memUsage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->memUsage, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_memUsage : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_memUsage)

static bool js_gfx_BufferInfo_get_size(se::State& s)
{
    cc::gfx::BufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->size, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_size)

static bool js_gfx_BufferInfo_set_size(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->size, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_size : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_size)

static bool js_gfx_BufferInfo_get_stride(se::State& s)
{
    cc::gfx::BufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stride, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_stride)

static bool js_gfx_BufferInfo_set_stride(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_stride : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stride, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_stride : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_stride)

static bool js_gfx_BufferInfo_get_flags(se::State& s)
{
    cc::gfx::BufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_get_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->flags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferInfo_get_flags)

static bool js_gfx_BufferInfo_set_flags(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferInfo_set_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->flags, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferInfo_set_flags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferInfo_set_flags)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::BufferInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::BufferInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("usage", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->usage), ctx);
    }
    json->getProperty("memUsage", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->memUsage), ctx);
    }
    json->getProperty("size", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->size), ctx);
    }
    json->getProperty("stride", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stride), ctx);
    }
    json->getProperty("flags", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->flags), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BufferInfo_finalize)

static bool js_gfx_BufferInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::BufferInfo* cobj = JSB_ALLOC(cc::gfx::BufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BufferInfo* cobj = JSB_ALLOC(cc::gfx::BufferInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::BufferInfo* cobj = JSB_ALLOC(cc::gfx::BufferInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->usage), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->memUsage), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->size), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->stride), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->flags), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_BufferInfo_constructor, __jsb_cc_gfx_BufferInfo_class, js_cc_gfx_BufferInfo_finalize)




static bool js_cc_gfx_BufferInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::BufferInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BufferInfo_finalize)

bool js_register_gfx_BufferInfo(se::Object* obj)
{
    auto cls = se::Class::create("BufferInfo", obj, nullptr, _SE(js_gfx_BufferInfo_constructor));

    cls->defineProperty("usage", _SE(js_gfx_BufferInfo_get_usage), _SE(js_gfx_BufferInfo_set_usage));
    cls->defineProperty("memUsage", _SE(js_gfx_BufferInfo_get_memUsage), _SE(js_gfx_BufferInfo_set_memUsage));
    cls->defineProperty("size", _SE(js_gfx_BufferInfo_get_size), _SE(js_gfx_BufferInfo_set_size));
    cls->defineProperty("stride", _SE(js_gfx_BufferInfo_get_stride), _SE(js_gfx_BufferInfo_set_stride));
    cls->defineProperty("flags", _SE(js_gfx_BufferInfo_get_flags), _SE(js_gfx_BufferInfo_set_flags));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BufferInfo>(cls);

    __jsb_cc_gfx_BufferInfo_proto = cls->getProto();
    __jsb_cc_gfx_BufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BufferViewInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_BufferViewInfo_class = nullptr;

static bool js_gfx_BufferViewInfo_get_buffer(se::State& s)
{
    cc::gfx::BufferViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferViewInfo_get_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->buffer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferViewInfo_get_buffer)

static bool js_gfx_BufferViewInfo_set_buffer(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferViewInfo_set_buffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->buffer, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferViewInfo_set_buffer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferViewInfo_set_buffer)

static bool js_gfx_BufferViewInfo_get_offset(se::State& s)
{
    cc::gfx::BufferViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferViewInfo_get_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->offset, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferViewInfo_get_offset)

static bool js_gfx_BufferViewInfo_set_offset(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferViewInfo_set_offset : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->offset, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferViewInfo_set_offset : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferViewInfo_set_offset)

static bool js_gfx_BufferViewInfo_get_range(se::State& s)
{
    cc::gfx::BufferViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferViewInfo_get_range : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->range, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BufferViewInfo_get_range)

static bool js_gfx_BufferViewInfo_set_range(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BufferViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BufferViewInfo_set_range : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->range, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BufferViewInfo_set_range : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BufferViewInfo_set_range)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::BufferViewInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::BufferViewInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("buffer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->buffer), ctx);
    }
    json->getProperty("offset", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->offset), ctx);
    }
    json->getProperty("range", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->range), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BufferViewInfo_finalize)

static bool js_gfx_BufferViewInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::BufferViewInfo* cobj = JSB_ALLOC(cc::gfx::BufferViewInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BufferViewInfo* cobj = JSB_ALLOC(cc::gfx::BufferViewInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::BufferViewInfo* cobj = JSB_ALLOC(cc::gfx::BufferViewInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->buffer), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->offset), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->range), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_BufferViewInfo_constructor, __jsb_cc_gfx_BufferViewInfo_class, js_cc_gfx_BufferViewInfo_finalize)




static bool js_cc_gfx_BufferViewInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BufferViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::BufferViewInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BufferViewInfo_finalize)

bool js_register_gfx_BufferViewInfo(se::Object* obj)
{
    auto cls = se::Class::create("BufferViewInfo", obj, nullptr, _SE(js_gfx_BufferViewInfo_constructor));

    cls->defineProperty("buffer", _SE(js_gfx_BufferViewInfo_get_buffer), _SE(js_gfx_BufferViewInfo_set_buffer));
    cls->defineProperty("offset", _SE(js_gfx_BufferViewInfo_get_offset), _SE(js_gfx_BufferViewInfo_set_offset));
    cls->defineProperty("range", _SE(js_gfx_BufferViewInfo_get_range), _SE(js_gfx_BufferViewInfo_set_range));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BufferViewInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BufferViewInfo>(cls);

    __jsb_cc_gfx_BufferViewInfo_proto = cls->getProto();
    __jsb_cc_gfx_BufferViewInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_TextureInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureInfo_class = nullptr;

static bool js_gfx_TextureInfo_get_type(se::State& s)
{
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_type)

static bool js_gfx_TextureInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_type)

static bool js_gfx_TextureInfo_get_usage(se::State& s)
{
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->usage, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_usage)

static bool js_gfx_TextureInfo_set_usage(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_usage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->usage, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_usage : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_usage)

static bool js_gfx_TextureInfo_get_format(se::State& s)
{
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_format)

static bool js_gfx_TextureInfo_set_format(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_format)

static bool js_gfx_TextureInfo_get_width(se::State& s)
{
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->width, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_width)

static bool js_gfx_TextureInfo_set_width(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_width : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->width, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_width : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_width)

static bool js_gfx_TextureInfo_get_height(se::State& s)
{
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->height, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_height)

static bool js_gfx_TextureInfo_set_height(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_height : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->height, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_height : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_height)

static bool js_gfx_TextureInfo_get_flags(se::State& s)
{
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->flags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_flags)

static bool js_gfx_TextureInfo_set_flags(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_flags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->flags, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_flags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_flags)

static bool js_gfx_TextureInfo_get_layerCount(se::State& s)
{
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->layerCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_layerCount)

static bool js_gfx_TextureInfo_set_layerCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->layerCount, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_layerCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_layerCount)

static bool js_gfx_TextureInfo_get_levelCount(se::State& s)
{
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->levelCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_levelCount)

static bool js_gfx_TextureInfo_set_levelCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->levelCount, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_levelCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_levelCount)

static bool js_gfx_TextureInfo_get_samples(se::State& s)
{
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_samples : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->samples, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_samples)

static bool js_gfx_TextureInfo_set_samples(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_samples : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->samples, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_samples : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_samples)

static bool js_gfx_TextureInfo_get_depth(se::State& s)
{
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_get_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureInfo_get_depth)

static bool js_gfx_TextureInfo_set_depth(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureInfo_set_depth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depth, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureInfo_set_depth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureInfo_set_depth)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::TextureInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::TextureInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("usage", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->usage), ctx);
    }
    json->getProperty("format", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    json->getProperty("width", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->width), ctx);
    }
    json->getProperty("height", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->height), ctx);
    }
    json->getProperty("flags", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->flags), ctx);
    }
    json->getProperty("layerCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->layerCount), ctx);
    }
    json->getProperty("levelCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->levelCount), ctx);
    }
    json->getProperty("samples", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->samples), ctx);
    }
    json->getProperty("depth", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depth), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureInfo_finalize)

static bool js_gfx_TextureInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::TextureInfo* cobj = JSB_ALLOC(cc::gfx::TextureInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureInfo* cobj = JSB_ALLOC(cc::gfx::TextureInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::TextureInfo* cobj = JSB_ALLOC(cc::gfx::TextureInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->type), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->usage), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->format), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->width), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->height), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->flags), nullptr);;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            ok &= sevalue_to_native(args[6], &(cobj->layerCount), nullptr);;
        }
        if (argc > 7 && !args[7].isUndefined()) {
            ok &= sevalue_to_native(args[7], &(cobj->levelCount), nullptr);;
        }
        if (argc > 8 && !args[8].isUndefined()) {
            ok &= sevalue_to_native(args[8], &(cobj->samples), nullptr);;
        }
        if (argc > 9 && !args[9].isUndefined()) {
            ok &= sevalue_to_native(args[9], &(cobj->depth), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_TextureInfo_constructor, __jsb_cc_gfx_TextureInfo_class, js_cc_gfx_TextureInfo_finalize)




static bool js_cc_gfx_TextureInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::TextureInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::TextureInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureInfo_finalize)

bool js_register_gfx_TextureInfo(se::Object* obj)
{
    auto cls = se::Class::create("TextureInfo", obj, nullptr, _SE(js_gfx_TextureInfo_constructor));

    cls->defineProperty("type", _SE(js_gfx_TextureInfo_get_type), _SE(js_gfx_TextureInfo_set_type));
    cls->defineProperty("usage", _SE(js_gfx_TextureInfo_get_usage), _SE(js_gfx_TextureInfo_set_usage));
    cls->defineProperty("format", _SE(js_gfx_TextureInfo_get_format), _SE(js_gfx_TextureInfo_set_format));
    cls->defineProperty("width", _SE(js_gfx_TextureInfo_get_width), _SE(js_gfx_TextureInfo_set_width));
    cls->defineProperty("height", _SE(js_gfx_TextureInfo_get_height), _SE(js_gfx_TextureInfo_set_height));
    cls->defineProperty("flags", _SE(js_gfx_TextureInfo_get_flags), _SE(js_gfx_TextureInfo_set_flags));
    cls->defineProperty("layerCount", _SE(js_gfx_TextureInfo_get_layerCount), _SE(js_gfx_TextureInfo_set_layerCount));
    cls->defineProperty("levelCount", _SE(js_gfx_TextureInfo_get_levelCount), _SE(js_gfx_TextureInfo_set_levelCount));
    cls->defineProperty("samples", _SE(js_gfx_TextureInfo_get_samples), _SE(js_gfx_TextureInfo_set_samples));
    cls->defineProperty("depth", _SE(js_gfx_TextureInfo_get_depth), _SE(js_gfx_TextureInfo_set_depth));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureInfo>(cls);

    __jsb_cc_gfx_TextureInfo_proto = cls->getProto();
    __jsb_cc_gfx_TextureInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_TextureViewInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_TextureViewInfo_class = nullptr;

static bool js_gfx_TextureViewInfo_get_texture(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->texture, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_texture)

static bool js_gfx_TextureViewInfo_set_texture(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_texture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->texture, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_texture : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_texture)

static bool js_gfx_TextureViewInfo_get_type(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_type)

static bool js_gfx_TextureViewInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_type)

static bool js_gfx_TextureViewInfo_get_format(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_format)

static bool js_gfx_TextureViewInfo_set_format(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_format)

static bool js_gfx_TextureViewInfo_get_baseLevel(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_baseLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->baseLevel, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_baseLevel)

static bool js_gfx_TextureViewInfo_set_baseLevel(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_baseLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->baseLevel, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_baseLevel : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_baseLevel)

static bool js_gfx_TextureViewInfo_get_levelCount(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->levelCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_levelCount)

static bool js_gfx_TextureViewInfo_set_levelCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_levelCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->levelCount, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_levelCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_levelCount)

static bool js_gfx_TextureViewInfo_get_baseLayer(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_baseLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->baseLayer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_baseLayer)

static bool js_gfx_TextureViewInfo_set_baseLayer(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_baseLayer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->baseLayer, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_baseLayer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_baseLayer)

static bool js_gfx_TextureViewInfo_get_layerCount(se::State& s)
{
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_get_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->layerCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_TextureViewInfo_get_layerCount)

static bool js_gfx_TextureViewInfo_set_layerCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_TextureViewInfo_set_layerCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->layerCount, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_TextureViewInfo_set_layerCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_TextureViewInfo_set_layerCount)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::TextureViewInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::TextureViewInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("texture", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->texture), ctx);
    }
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("format", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    json->getProperty("baseLevel", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->baseLevel), ctx);
    }
    json->getProperty("levelCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->levelCount), ctx);
    }
    json->getProperty("baseLayer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->baseLayer), ctx);
    }
    json->getProperty("layerCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->layerCount), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_TextureViewInfo_finalize)

static bool js_gfx_TextureViewInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::TextureViewInfo* cobj = JSB_ALLOC(cc::gfx::TextureViewInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::TextureViewInfo* cobj = JSB_ALLOC(cc::gfx::TextureViewInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::TextureViewInfo* cobj = JSB_ALLOC(cc::gfx::TextureViewInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->texture), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->type), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->format), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->baseLevel), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->levelCount), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->baseLayer), nullptr);;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            ok &= sevalue_to_native(args[6], &(cobj->layerCount), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_TextureViewInfo_constructor, __jsb_cc_gfx_TextureViewInfo_class, js_cc_gfx_TextureViewInfo_finalize)




static bool js_cc_gfx_TextureViewInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::TextureViewInfo* cobj = SE_THIS_OBJECT<cc::gfx::TextureViewInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_TextureViewInfo_finalize)

bool js_register_gfx_TextureViewInfo(se::Object* obj)
{
    auto cls = se::Class::create("TextureViewInfo", obj, nullptr, _SE(js_gfx_TextureViewInfo_constructor));

    cls->defineProperty("texture", _SE(js_gfx_TextureViewInfo_get_texture), _SE(js_gfx_TextureViewInfo_set_texture));
    cls->defineProperty("type", _SE(js_gfx_TextureViewInfo_get_type), _SE(js_gfx_TextureViewInfo_set_type));
    cls->defineProperty("format", _SE(js_gfx_TextureViewInfo_get_format), _SE(js_gfx_TextureViewInfo_set_format));
    cls->defineProperty("baseLevel", _SE(js_gfx_TextureViewInfo_get_baseLevel), _SE(js_gfx_TextureViewInfo_set_baseLevel));
    cls->defineProperty("levelCount", _SE(js_gfx_TextureViewInfo_get_levelCount), _SE(js_gfx_TextureViewInfo_set_levelCount));
    cls->defineProperty("baseLayer", _SE(js_gfx_TextureViewInfo_get_baseLayer), _SE(js_gfx_TextureViewInfo_set_baseLayer));
    cls->defineProperty("layerCount", _SE(js_gfx_TextureViewInfo_get_layerCount), _SE(js_gfx_TextureViewInfo_set_layerCount));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_TextureViewInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::TextureViewInfo>(cls);

    __jsb_cc_gfx_TextureViewInfo_proto = cls->getProto();
    __jsb_cc_gfx_TextureViewInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_SamplerInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_SamplerInfo_class = nullptr;

static bool js_gfx_SamplerInfo_get_minFilter(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_minFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->minFilter, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_minFilter)

static bool js_gfx_SamplerInfo_set_minFilter(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_minFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->minFilter, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_minFilter : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_minFilter)

static bool js_gfx_SamplerInfo_get_magFilter(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_magFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->magFilter, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_magFilter)

static bool js_gfx_SamplerInfo_set_magFilter(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_magFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->magFilter, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_magFilter : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_magFilter)

static bool js_gfx_SamplerInfo_get_mipFilter(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_mipFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->mipFilter, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_mipFilter)

static bool js_gfx_SamplerInfo_set_mipFilter(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_mipFilter : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->mipFilter, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_mipFilter : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_mipFilter)

static bool js_gfx_SamplerInfo_get_addressU(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_addressU : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->addressU, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_addressU)

static bool js_gfx_SamplerInfo_set_addressU(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_addressU : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->addressU, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_addressU : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_addressU)

static bool js_gfx_SamplerInfo_get_addressV(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_addressV : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->addressV, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_addressV)

static bool js_gfx_SamplerInfo_set_addressV(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_addressV : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->addressV, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_addressV : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_addressV)

static bool js_gfx_SamplerInfo_get_addressW(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_addressW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->addressW, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_addressW)

static bool js_gfx_SamplerInfo_set_addressW(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_addressW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->addressW, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_addressW : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_addressW)

static bool js_gfx_SamplerInfo_get_maxAnisotropy(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_maxAnisotropy : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxAnisotropy, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_maxAnisotropy)

static bool js_gfx_SamplerInfo_set_maxAnisotropy(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_maxAnisotropy : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxAnisotropy, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_maxAnisotropy : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_maxAnisotropy)

static bool js_gfx_SamplerInfo_get_cmpFunc(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_cmpFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->cmpFunc, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_cmpFunc)

static bool js_gfx_SamplerInfo_set_cmpFunc(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_cmpFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->cmpFunc, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_cmpFunc : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_cmpFunc)

static bool js_gfx_SamplerInfo_get_borderColor(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_borderColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->borderColor, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_borderColor)

static bool js_gfx_SamplerInfo_set_borderColor(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_borderColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->borderColor, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_borderColor : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_borderColor)

static bool js_gfx_SamplerInfo_get_minLOD(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_minLOD : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->minLOD, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_minLOD)

static bool js_gfx_SamplerInfo_set_minLOD(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_minLOD : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->minLOD, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_minLOD : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_minLOD)

static bool js_gfx_SamplerInfo_get_maxLOD(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_maxLOD : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->maxLOD, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_maxLOD)

static bool js_gfx_SamplerInfo_set_maxLOD(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_maxLOD : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->maxLOD, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_maxLOD : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_maxLOD)

static bool js_gfx_SamplerInfo_get_mipLODBias(se::State& s)
{
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_get_mipLODBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->mipLODBias, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SamplerInfo_get_mipLODBias)

static bool js_gfx_SamplerInfo_set_mipLODBias(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SamplerInfo_set_mipLODBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->mipLODBias, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SamplerInfo_set_mipLODBias : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SamplerInfo_set_mipLODBias)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::SamplerInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::SamplerInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("minFilter", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->minFilter), ctx);
    }
    json->getProperty("magFilter", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->magFilter), ctx);
    }
    json->getProperty("mipFilter", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mipFilter), ctx);
    }
    json->getProperty("addressU", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->addressU), ctx);
    }
    json->getProperty("addressV", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->addressV), ctx);
    }
    json->getProperty("addressW", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->addressW), ctx);
    }
    json->getProperty("maxAnisotropy", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxAnisotropy), ctx);
    }
    json->getProperty("cmpFunc", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->cmpFunc), ctx);
    }
    json->getProperty("borderColor", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->borderColor), ctx);
    }
    json->getProperty("minLOD", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->minLOD), ctx);
    }
    json->getProperty("maxLOD", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->maxLOD), ctx);
    }
    json->getProperty("mipLODBias", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mipLODBias), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_SamplerInfo_finalize)

static bool js_gfx_SamplerInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::SamplerInfo* cobj = JSB_ALLOC(cc::gfx::SamplerInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::SamplerInfo* cobj = JSB_ALLOC(cc::gfx::SamplerInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::SamplerInfo* cobj = JSB_ALLOC(cc::gfx::SamplerInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->minFilter), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->magFilter), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->mipFilter), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->addressU), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->addressV), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->addressW), nullptr);;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            ok &= sevalue_to_native(args[6], &(cobj->maxAnisotropy), nullptr);;
        }
        if (argc > 7 && !args[7].isUndefined()) {
            ok &= sevalue_to_native(args[7], &(cobj->cmpFunc), nullptr);;
        }
        if (argc > 8 && !args[8].isUndefined()) {
            ok &= sevalue_to_native(args[8], &(cobj->borderColor), nullptr);;
        }
        if (argc > 9 && !args[9].isUndefined()) {
            ok &= sevalue_to_native(args[9], &(cobj->minLOD), nullptr);;
        }
        if (argc > 10 && !args[10].isUndefined()) {
            ok &= sevalue_to_native(args[10], &(cobj->maxLOD), nullptr);;
        }
        if (argc > 11 && !args[11].isUndefined()) {
            ok &= sevalue_to_native(args[11], &(cobj->mipLODBias), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_SamplerInfo_constructor, __jsb_cc_gfx_SamplerInfo_class, js_cc_gfx_SamplerInfo_finalize)




static bool js_cc_gfx_SamplerInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::SamplerInfo* cobj = SE_THIS_OBJECT<cc::gfx::SamplerInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_SamplerInfo_finalize)

bool js_register_gfx_SamplerInfo(se::Object* obj)
{
    auto cls = se::Class::create("SamplerInfo", obj, nullptr, _SE(js_gfx_SamplerInfo_constructor));

    cls->defineProperty("minFilter", _SE(js_gfx_SamplerInfo_get_minFilter), _SE(js_gfx_SamplerInfo_set_minFilter));
    cls->defineProperty("magFilter", _SE(js_gfx_SamplerInfo_get_magFilter), _SE(js_gfx_SamplerInfo_set_magFilter));
    cls->defineProperty("mipFilter", _SE(js_gfx_SamplerInfo_get_mipFilter), _SE(js_gfx_SamplerInfo_set_mipFilter));
    cls->defineProperty("addressU", _SE(js_gfx_SamplerInfo_get_addressU), _SE(js_gfx_SamplerInfo_set_addressU));
    cls->defineProperty("addressV", _SE(js_gfx_SamplerInfo_get_addressV), _SE(js_gfx_SamplerInfo_set_addressV));
    cls->defineProperty("addressW", _SE(js_gfx_SamplerInfo_get_addressW), _SE(js_gfx_SamplerInfo_set_addressW));
    cls->defineProperty("maxAnisotropy", _SE(js_gfx_SamplerInfo_get_maxAnisotropy), _SE(js_gfx_SamplerInfo_set_maxAnisotropy));
    cls->defineProperty("cmpFunc", _SE(js_gfx_SamplerInfo_get_cmpFunc), _SE(js_gfx_SamplerInfo_set_cmpFunc));
    cls->defineProperty("borderColor", _SE(js_gfx_SamplerInfo_get_borderColor), _SE(js_gfx_SamplerInfo_set_borderColor));
    cls->defineProperty("minLOD", _SE(js_gfx_SamplerInfo_get_minLOD), _SE(js_gfx_SamplerInfo_set_minLOD));
    cls->defineProperty("maxLOD", _SE(js_gfx_SamplerInfo_get_maxLOD), _SE(js_gfx_SamplerInfo_set_maxLOD));
    cls->defineProperty("mipLODBias", _SE(js_gfx_SamplerInfo_get_mipLODBias), _SE(js_gfx_SamplerInfo_set_mipLODBias));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_SamplerInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::SamplerInfo>(cls);

    __jsb_cc_gfx_SamplerInfo_proto = cls->getProto();
    __jsb_cc_gfx_SamplerInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_ShaderMacro_proto = nullptr;
se::Class* __jsb_cc_gfx_ShaderMacro_class = nullptr;

static bool js_gfx_ShaderMacro_get_macro(se::State& s)
{
    cc::gfx::ShaderMacro* cobj = SE_THIS_OBJECT<cc::gfx::ShaderMacro>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderMacro_get_macro : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->macro, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderMacro_get_macro)

static bool js_gfx_ShaderMacro_set_macro(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderMacro* cobj = SE_THIS_OBJECT<cc::gfx::ShaderMacro>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderMacro_set_macro : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->macro, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderMacro_set_macro : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderMacro_set_macro)

static bool js_gfx_ShaderMacro_get_value(se::State& s)
{
    cc::gfx::ShaderMacro* cobj = SE_THIS_OBJECT<cc::gfx::ShaderMacro>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderMacro_get_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->value, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderMacro_get_value)

static bool js_gfx_ShaderMacro_set_value(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderMacro* cobj = SE_THIS_OBJECT<cc::gfx::ShaderMacro>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderMacro_set_value : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->value, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderMacro_set_value : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderMacro_set_value)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::ShaderMacro * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::ShaderMacro*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("macro", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->macro), ctx);
    }
    json->getProperty("value", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->value), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ShaderMacro_finalize)

static bool js_gfx_ShaderMacro_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::ShaderMacro* cobj = JSB_ALLOC(cc::gfx::ShaderMacro);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ShaderMacro* cobj = JSB_ALLOC(cc::gfx::ShaderMacro);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::ShaderMacro* cobj = JSB_ALLOC(cc::gfx::ShaderMacro);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->macro), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->value), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_ShaderMacro_constructor, __jsb_cc_gfx_ShaderMacro_class, js_cc_gfx_ShaderMacro_finalize)




static bool js_cc_gfx_ShaderMacro_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::ShaderMacro>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::ShaderMacro* cobj = SE_THIS_OBJECT<cc::gfx::ShaderMacro>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ShaderMacro_finalize)

bool js_register_gfx_ShaderMacro(se::Object* obj)
{
    auto cls = se::Class::create("ShaderMacro", obj, nullptr, _SE(js_gfx_ShaderMacro_constructor));

    cls->defineProperty("macro", _SE(js_gfx_ShaderMacro_get_macro), _SE(js_gfx_ShaderMacro_set_macro));
    cls->defineProperty("value", _SE(js_gfx_ShaderMacro_get_value), _SE(js_gfx_ShaderMacro_set_value));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ShaderMacro_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ShaderMacro>(cls);

    __jsb_cc_gfx_ShaderMacro_proto = cls->getProto();
    __jsb_cc_gfx_ShaderMacro_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Uniform_proto = nullptr;
se::Class* __jsb_cc_gfx_Uniform_class = nullptr;

static bool js_gfx_Uniform_get_name(se::State& s)
{
    cc::gfx::Uniform* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Uniform_get_name)

static bool js_gfx_Uniform_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Uniform* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Uniform_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Uniform_set_name)

static bool js_gfx_Uniform_get_type(se::State& s)
{
    cc::gfx::Uniform* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Uniform_get_type)

static bool js_gfx_Uniform_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Uniform* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Uniform_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Uniform_set_type)

static bool js_gfx_Uniform_get_count(se::State& s)
{
    cc::gfx::Uniform* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Uniform_get_count)

static bool js_gfx_Uniform_set_count(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Uniform* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Uniform_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Uniform_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Uniform_set_count)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Uniform * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::Uniform*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Uniform_finalize)

static bool js_gfx_Uniform_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Uniform* cobj = JSB_ALLOC(cc::gfx::Uniform);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Uniform* cobj = JSB_ALLOC(cc::gfx::Uniform);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::Uniform* cobj = JSB_ALLOC(cc::gfx::Uniform);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->type), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->count), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_Uniform_constructor, __jsb_cc_gfx_Uniform_class, js_cc_gfx_Uniform_finalize)




static bool js_cc_gfx_Uniform_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Uniform>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Uniform* cobj = SE_THIS_OBJECT<cc::gfx::Uniform>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Uniform_finalize)

bool js_register_gfx_Uniform(se::Object* obj)
{
    auto cls = se::Class::create("Uniform", obj, nullptr, _SE(js_gfx_Uniform_constructor));

    cls->defineProperty("name", _SE(js_gfx_Uniform_get_name), _SE(js_gfx_Uniform_set_name));
    cls->defineProperty("type", _SE(js_gfx_Uniform_get_type), _SE(js_gfx_Uniform_set_type));
    cls->defineProperty("count", _SE(js_gfx_Uniform_get_count), _SE(js_gfx_Uniform_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Uniform_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Uniform>(cls);

    __jsb_cc_gfx_Uniform_proto = cls->getProto();
    __jsb_cc_gfx_Uniform_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_UniformBlock_proto = nullptr;
se::Class* __jsb_cc_gfx_UniformBlock_class = nullptr;

static bool js_gfx_UniformBlock_get_set(se::State& s)
{
    cc::gfx::UniformBlock* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->set, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_set)

static bool js_gfx_UniformBlock_set_set(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformBlock* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->set, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_set : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_set)

static bool js_gfx_UniformBlock_get_binding(se::State& s)
{
    cc::gfx::UniformBlock* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_binding)

static bool js_gfx_UniformBlock_set_binding(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformBlock* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_binding)

static bool js_gfx_UniformBlock_get_name(se::State& s)
{
    cc::gfx::UniformBlock* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_name)

static bool js_gfx_UniformBlock_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformBlock* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_name)

static bool js_gfx_UniformBlock_get_members(se::State& s)
{
    cc::gfx::UniformBlock* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_members : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->members, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_members)

static bool js_gfx_UniformBlock_set_members(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformBlock* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_members : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->members, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_members : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_members)

static bool js_gfx_UniformBlock_get_count(se::State& s)
{
    cc::gfx::UniformBlock* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformBlock_get_count)

static bool js_gfx_UniformBlock_set_count(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformBlock* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformBlock_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_UniformBlock_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformBlock_set_count)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::UniformBlock * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::UniformBlock*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("set", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->set), ctx);
    }
    json->getProperty("binding", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("members", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->members), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_UniformBlock_finalize)

static bool js_gfx_UniformBlock_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::UniformBlock* cobj = JSB_ALLOC(cc::gfx::UniformBlock);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::UniformBlock* cobj = JSB_ALLOC(cc::gfx::UniformBlock);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::UniformBlock* cobj = JSB_ALLOC(cc::gfx::UniformBlock);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->set), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->binding), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->name), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->members), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->count), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_UniformBlock_constructor, __jsb_cc_gfx_UniformBlock_class, js_cc_gfx_UniformBlock_finalize)




static bool js_cc_gfx_UniformBlock_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::UniformBlock>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::UniformBlock* cobj = SE_THIS_OBJECT<cc::gfx::UniformBlock>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_UniformBlock_finalize)

bool js_register_gfx_UniformBlock(se::Object* obj)
{
    auto cls = se::Class::create("UniformBlock", obj, nullptr, _SE(js_gfx_UniformBlock_constructor));

    cls->defineProperty("set", _SE(js_gfx_UniformBlock_get_set), _SE(js_gfx_UniformBlock_set_set));
    cls->defineProperty("binding", _SE(js_gfx_UniformBlock_get_binding), _SE(js_gfx_UniformBlock_set_binding));
    cls->defineProperty("name", _SE(js_gfx_UniformBlock_get_name), _SE(js_gfx_UniformBlock_set_name));
    cls->defineProperty("members", _SE(js_gfx_UniformBlock_get_members), _SE(js_gfx_UniformBlock_set_members));
    cls->defineProperty("count", _SE(js_gfx_UniformBlock_get_count), _SE(js_gfx_UniformBlock_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_UniformBlock_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::UniformBlock>(cls);

    __jsb_cc_gfx_UniformBlock_proto = cls->getProto();
    __jsb_cc_gfx_UniformBlock_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_UniformSampler_proto = nullptr;
se::Class* __jsb_cc_gfx_UniformSampler_class = nullptr;

static bool js_gfx_UniformSampler_get_set(se::State& s)
{
    cc::gfx::UniformSampler* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->set, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_set)

static bool js_gfx_UniformSampler_set_set(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformSampler* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_set : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->set, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_set : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_set)

static bool js_gfx_UniformSampler_get_binding(se::State& s)
{
    cc::gfx::UniformSampler* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_binding)

static bool js_gfx_UniformSampler_set_binding(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformSampler* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_binding)

static bool js_gfx_UniformSampler_get_name(se::State& s)
{
    cc::gfx::UniformSampler* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_name)

static bool js_gfx_UniformSampler_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformSampler* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_name)

static bool js_gfx_UniformSampler_get_type(se::State& s)
{
    cc::gfx::UniformSampler* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_type)

static bool js_gfx_UniformSampler_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformSampler* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_type)

static bool js_gfx_UniformSampler_get_count(se::State& s)
{
    cc::gfx::UniformSampler* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_UniformSampler_get_count)

static bool js_gfx_UniformSampler_set_count(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::UniformSampler* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_UniformSampler_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_UniformSampler_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_UniformSampler_set_count)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::UniformSampler * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::UniformSampler*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("set", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->set), ctx);
    }
    json->getProperty("binding", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_UniformSampler_finalize)

static bool js_gfx_UniformSampler_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::UniformSampler* cobj = JSB_ALLOC(cc::gfx::UniformSampler);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::UniformSampler* cobj = JSB_ALLOC(cc::gfx::UniformSampler);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::UniformSampler* cobj = JSB_ALLOC(cc::gfx::UniformSampler);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->set), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->binding), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->name), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->type), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->count), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_UniformSampler_constructor, __jsb_cc_gfx_UniformSampler_class, js_cc_gfx_UniformSampler_finalize)




static bool js_cc_gfx_UniformSampler_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::UniformSampler>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::UniformSampler* cobj = SE_THIS_OBJECT<cc::gfx::UniformSampler>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_UniformSampler_finalize)

bool js_register_gfx_UniformSampler(se::Object* obj)
{
    auto cls = se::Class::create("UniformSampler", obj, nullptr, _SE(js_gfx_UniformSampler_constructor));

    cls->defineProperty("set", _SE(js_gfx_UniformSampler_get_set), _SE(js_gfx_UniformSampler_set_set));
    cls->defineProperty("binding", _SE(js_gfx_UniformSampler_get_binding), _SE(js_gfx_UniformSampler_set_binding));
    cls->defineProperty("name", _SE(js_gfx_UniformSampler_get_name), _SE(js_gfx_UniformSampler_set_name));
    cls->defineProperty("type", _SE(js_gfx_UniformSampler_get_type), _SE(js_gfx_UniformSampler_set_type));
    cls->defineProperty("count", _SE(js_gfx_UniformSampler_get_count), _SE(js_gfx_UniformSampler_set_count));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_UniformSampler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::UniformSampler>(cls);

    __jsb_cc_gfx_UniformSampler_proto = cls->getProto();
    __jsb_cc_gfx_UniformSampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_ShaderStage_proto = nullptr;
se::Class* __jsb_cc_gfx_ShaderStage_class = nullptr;

static bool js_gfx_ShaderStage_get_stage(se::State& s)
{
    cc::gfx::ShaderStage* cobj = SE_THIS_OBJECT<cc::gfx::ShaderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_get_stage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stage, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderStage_get_stage)

static bool js_gfx_ShaderStage_set_stage(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderStage* cobj = SE_THIS_OBJECT<cc::gfx::ShaderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_set_stage : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stage, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderStage_set_stage : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderStage_set_stage)

static bool js_gfx_ShaderStage_get_source(se::State& s)
{
    cc::gfx::ShaderStage* cobj = SE_THIS_OBJECT<cc::gfx::ShaderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_get_source : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->source, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderStage_get_source)

static bool js_gfx_ShaderStage_set_source(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderStage* cobj = SE_THIS_OBJECT<cc::gfx::ShaderStage>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderStage_set_source : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->source, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderStage_set_source : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderStage_set_source)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::ShaderStage * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::ShaderStage*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("stage", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stage), ctx);
    }
    json->getProperty("source", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->source), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ShaderStage_finalize)

static bool js_gfx_ShaderStage_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::ShaderStage* cobj = JSB_ALLOC(cc::gfx::ShaderStage);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ShaderStage* cobj = JSB_ALLOC(cc::gfx::ShaderStage);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::ShaderStage* cobj = JSB_ALLOC(cc::gfx::ShaderStage);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->stage), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->source), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_ShaderStage_constructor, __jsb_cc_gfx_ShaderStage_class, js_cc_gfx_ShaderStage_finalize)




static bool js_cc_gfx_ShaderStage_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::ShaderStage>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::ShaderStage* cobj = SE_THIS_OBJECT<cc::gfx::ShaderStage>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ShaderStage_finalize)

bool js_register_gfx_ShaderStage(se::Object* obj)
{
    auto cls = se::Class::create("ShaderStage", obj, nullptr, _SE(js_gfx_ShaderStage_constructor));

    cls->defineProperty("stage", _SE(js_gfx_ShaderStage_get_stage), _SE(js_gfx_ShaderStage_set_stage));
    cls->defineProperty("source", _SE(js_gfx_ShaderStage_get_source), _SE(js_gfx_ShaderStage_set_source));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ShaderStage_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ShaderStage>(cls);

    __jsb_cc_gfx_ShaderStage_proto = cls->getProto();
    __jsb_cc_gfx_ShaderStage_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Attribute_proto = nullptr;
se::Class* __jsb_cc_gfx_Attribute_class = nullptr;

static bool js_gfx_Attribute_get_name(se::State& s)
{
    cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_name)

static bool js_gfx_Attribute_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_name)

static bool js_gfx_Attribute_get_format(se::State& s)
{
    cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_format)

static bool js_gfx_Attribute_set_format(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_format)

static bool js_gfx_Attribute_get_isNormalized(se::State& s)
{
    cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_isNormalized : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isNormalized, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_isNormalized)

static bool js_gfx_Attribute_set_isNormalized(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_isNormalized : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isNormalized, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_isNormalized : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_isNormalized)

static bool js_gfx_Attribute_get_stream(se::State& s)
{
    cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_stream : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stream, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_stream)

static bool js_gfx_Attribute_set_stream(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_stream : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stream, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_stream : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_stream)

static bool js_gfx_Attribute_get_isInstanced(se::State& s)
{
    cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_isInstanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isInstanced, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_isInstanced)

static bool js_gfx_Attribute_set_isInstanced(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_isInstanced : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isInstanced, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_isInstanced : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_isInstanced)

static bool js_gfx_Attribute_get_location(se::State& s)
{
    cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_get_location : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->location, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_Attribute_get_location)

static bool js_gfx_Attribute_set_location(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Attribute_set_location : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->location, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_Attribute_set_location : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_Attribute_set_location)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::Attribute * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::Attribute*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("format", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    json->getProperty("isNormalized", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isNormalized), ctx);
    }
    json->getProperty("stream", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stream), ctx);
    }
    json->getProperty("isInstanced", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isInstanced), ctx);
    }
    json->getProperty("location", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->location), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Attribute_finalize)

static bool js_gfx_Attribute_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::Attribute* cobj = JSB_ALLOC(cc::gfx::Attribute);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::Attribute* cobj = JSB_ALLOC(cc::gfx::Attribute);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::Attribute* cobj = JSB_ALLOC(cc::gfx::Attribute);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->format), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->isNormalized), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->stream), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->isInstanced), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->location), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_Attribute_constructor, __jsb_cc_gfx_Attribute_class, js_cc_gfx_Attribute_finalize)




static bool js_cc_gfx_Attribute_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Attribute>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Attribute* cobj = SE_THIS_OBJECT<cc::gfx::Attribute>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Attribute_finalize)

bool js_register_gfx_Attribute(se::Object* obj)
{
    auto cls = se::Class::create("Attribute", obj, nullptr, _SE(js_gfx_Attribute_constructor));

    cls->defineProperty("name", _SE(js_gfx_Attribute_get_name), _SE(js_gfx_Attribute_set_name));
    cls->defineProperty("format", _SE(js_gfx_Attribute_get_format), _SE(js_gfx_Attribute_set_format));
    cls->defineProperty("isNormalized", _SE(js_gfx_Attribute_get_isNormalized), _SE(js_gfx_Attribute_set_isNormalized));
    cls->defineProperty("stream", _SE(js_gfx_Attribute_get_stream), _SE(js_gfx_Attribute_set_stream));
    cls->defineProperty("isInstanced", _SE(js_gfx_Attribute_get_isInstanced), _SE(js_gfx_Attribute_set_isInstanced));
    cls->defineProperty("location", _SE(js_gfx_Attribute_get_location), _SE(js_gfx_Attribute_set_location));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Attribute_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Attribute>(cls);

    __jsb_cc_gfx_Attribute_proto = cls->getProto();
    __jsb_cc_gfx_Attribute_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_ShaderInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_ShaderInfo_class = nullptr;

static bool js_gfx_ShaderInfo_get_name(se::State& s)
{
    cc::gfx::ShaderInfo* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_name)

static bool js_gfx_ShaderInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderInfo* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_name)

static bool js_gfx_ShaderInfo_get_stages(se::State& s)
{
    cc::gfx::ShaderInfo* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stages, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_stages)

static bool js_gfx_ShaderInfo_set_stages(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderInfo* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_stages : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stages, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_stages : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_stages)

static bool js_gfx_ShaderInfo_get_attributes(se::State& s)
{
    cc::gfx::ShaderInfo* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->attributes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_attributes)

static bool js_gfx_ShaderInfo_set_attributes(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderInfo* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->attributes, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_attributes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_attributes)

static bool js_gfx_ShaderInfo_get_blocks(se::State& s)
{
    cc::gfx::ShaderInfo* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blocks, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_blocks)

static bool js_gfx_ShaderInfo_set_blocks(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderInfo* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_blocks : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blocks, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_blocks : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_blocks)

static bool js_gfx_ShaderInfo_get_samplers(se::State& s)
{
    cc::gfx::ShaderInfo* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_get_samplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->samplers, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ShaderInfo_get_samplers)

static bool js_gfx_ShaderInfo_set_samplers(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ShaderInfo* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ShaderInfo_set_samplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->samplers, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ShaderInfo_set_samplers : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ShaderInfo_set_samplers)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::ShaderInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::ShaderInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("stages", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stages), ctx);
    }
    json->getProperty("attributes", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->attributes), ctx);
    }
    json->getProperty("blocks", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blocks), ctx);
    }
    json->getProperty("samplers", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->samplers), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ShaderInfo_finalize)

static bool js_gfx_ShaderInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::ShaderInfo* cobj = JSB_ALLOC(cc::gfx::ShaderInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ShaderInfo* cobj = JSB_ALLOC(cc::gfx::ShaderInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::ShaderInfo* cobj = JSB_ALLOC(cc::gfx::ShaderInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->stages), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->attributes), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->blocks), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->samplers), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_ShaderInfo_constructor, __jsb_cc_gfx_ShaderInfo_class, js_cc_gfx_ShaderInfo_finalize)




static bool js_cc_gfx_ShaderInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::ShaderInfo* cobj = SE_THIS_OBJECT<cc::gfx::ShaderInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ShaderInfo_finalize)

bool js_register_gfx_ShaderInfo(se::Object* obj)
{
    auto cls = se::Class::create("ShaderInfo", obj, nullptr, _SE(js_gfx_ShaderInfo_constructor));

    cls->defineProperty("name", _SE(js_gfx_ShaderInfo_get_name), _SE(js_gfx_ShaderInfo_set_name));
    cls->defineProperty("stages", _SE(js_gfx_ShaderInfo_get_stages), _SE(js_gfx_ShaderInfo_set_stages));
    cls->defineProperty("attributes", _SE(js_gfx_ShaderInfo_get_attributes), _SE(js_gfx_ShaderInfo_set_attributes));
    cls->defineProperty("blocks", _SE(js_gfx_ShaderInfo_get_blocks), _SE(js_gfx_ShaderInfo_set_blocks));
    cls->defineProperty("samplers", _SE(js_gfx_ShaderInfo_get_samplers), _SE(js_gfx_ShaderInfo_set_samplers));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ShaderInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ShaderInfo>(cls);

    __jsb_cc_gfx_ShaderInfo_proto = cls->getProto();
    __jsb_cc_gfx_ShaderInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_InputAssemblerInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_InputAssemblerInfo_class = nullptr;

static bool js_gfx_InputAssemblerInfo_get_attributes(se::State& s)
{
    cc::gfx::InputAssemblerInfo* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->attributes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputAssemblerInfo_get_attributes)

static bool js_gfx_InputAssemblerInfo_set_attributes(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::InputAssemblerInfo* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->attributes, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_InputAssemblerInfo_set_attributes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputAssemblerInfo_set_attributes)

static bool js_gfx_InputAssemblerInfo_get_vertexBuffers(se::State& s)
{
    cc::gfx::InputAssemblerInfo* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_get_vertexBuffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->vertexBuffers, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputAssemblerInfo_get_vertexBuffers)

static bool js_gfx_InputAssemblerInfo_set_vertexBuffers(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::InputAssemblerInfo* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_set_vertexBuffers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->vertexBuffers, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_InputAssemblerInfo_set_vertexBuffers : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputAssemblerInfo_set_vertexBuffers)

static bool js_gfx_InputAssemblerInfo_get_indexBuffer(se::State& s)
{
    cc::gfx::InputAssemblerInfo* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_get_indexBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->indexBuffer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputAssemblerInfo_get_indexBuffer)

static bool js_gfx_InputAssemblerInfo_set_indexBuffer(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::InputAssemblerInfo* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_set_indexBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->indexBuffer, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_InputAssemblerInfo_set_indexBuffer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputAssemblerInfo_set_indexBuffer)

static bool js_gfx_InputAssemblerInfo_get_indirectBuffer(se::State& s)
{
    cc::gfx::InputAssemblerInfo* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_get_indirectBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->indirectBuffer, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputAssemblerInfo_get_indirectBuffer)

static bool js_gfx_InputAssemblerInfo_set_indirectBuffer(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::InputAssemblerInfo* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssemblerInfo_set_indirectBuffer : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->indirectBuffer, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_InputAssemblerInfo_set_indirectBuffer : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputAssemblerInfo_set_indirectBuffer)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::InputAssemblerInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::InputAssemblerInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("attributes", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->attributes), ctx);
    }
    json->getProperty("vertexBuffers", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->vertexBuffers), ctx);
    }
    json->getProperty("indexBuffer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->indexBuffer), ctx);
    }
    json->getProperty("indirectBuffer", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->indirectBuffer), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_InputAssemblerInfo_finalize)

static bool js_gfx_InputAssemblerInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::InputAssemblerInfo* cobj = JSB_ALLOC(cc::gfx::InputAssemblerInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::InputAssemblerInfo* cobj = JSB_ALLOC(cc::gfx::InputAssemblerInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::InputAssemblerInfo* cobj = JSB_ALLOC(cc::gfx::InputAssemblerInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->attributes), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->vertexBuffers), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->indexBuffer), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->indirectBuffer), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_InputAssemblerInfo_constructor, __jsb_cc_gfx_InputAssemblerInfo_class, js_cc_gfx_InputAssemblerInfo_finalize)




static bool js_cc_gfx_InputAssemblerInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::InputAssemblerInfo* cobj = SE_THIS_OBJECT<cc::gfx::InputAssemblerInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_InputAssemblerInfo_finalize)

bool js_register_gfx_InputAssemblerInfo(se::Object* obj)
{
    auto cls = se::Class::create("InputAssemblerInfo", obj, nullptr, _SE(js_gfx_InputAssemblerInfo_constructor));

    cls->defineProperty("attributes", _SE(js_gfx_InputAssemblerInfo_get_attributes), _SE(js_gfx_InputAssemblerInfo_set_attributes));
    cls->defineProperty("vertexBuffers", _SE(js_gfx_InputAssemblerInfo_get_vertexBuffers), _SE(js_gfx_InputAssemblerInfo_set_vertexBuffers));
    cls->defineProperty("indexBuffer", _SE(js_gfx_InputAssemblerInfo_get_indexBuffer), _SE(js_gfx_InputAssemblerInfo_set_indexBuffer));
    cls->defineProperty("indirectBuffer", _SE(js_gfx_InputAssemblerInfo_get_indirectBuffer), _SE(js_gfx_InputAssemblerInfo_set_indirectBuffer));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_InputAssemblerInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::InputAssemblerInfo>(cls);

    __jsb_cc_gfx_InputAssemblerInfo_proto = cls->getProto();
    __jsb_cc_gfx_InputAssemblerInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_ColorAttachment_proto = nullptr;
se::Class* __jsb_cc_gfx_ColorAttachment_class = nullptr;

static bool js_gfx_ColorAttachment_get_format(se::State& s)
{
    cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_format)

static bool js_gfx_ColorAttachment_set_format(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_format)

static bool js_gfx_ColorAttachment_get_sampleCount(se::State& s)
{
    cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->sampleCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_sampleCount)

static bool js_gfx_ColorAttachment_set_sampleCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->sampleCount, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_sampleCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_sampleCount)

static bool js_gfx_ColorAttachment_get_loadOp(se::State& s)
{
    cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_loadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->loadOp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_loadOp)

static bool js_gfx_ColorAttachment_set_loadOp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_loadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->loadOp, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_loadOp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_loadOp)

static bool js_gfx_ColorAttachment_get_storeOp(se::State& s)
{
    cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_storeOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->storeOp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_storeOp)

static bool js_gfx_ColorAttachment_set_storeOp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_storeOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->storeOp, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_storeOp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_storeOp)

static bool js_gfx_ColorAttachment_get_beginLayout(se::State& s)
{
    cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->beginLayout, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_beginLayout)

static bool js_gfx_ColorAttachment_set_beginLayout(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->beginLayout, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_beginLayout : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_beginLayout)

static bool js_gfx_ColorAttachment_get_endLayout(se::State& s)
{
    cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_get_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->endLayout, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_ColorAttachment_get_endLayout)

static bool js_gfx_ColorAttachment_set_endLayout(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_ColorAttachment_set_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->endLayout, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_ColorAttachment_set_endLayout : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_ColorAttachment_set_endLayout)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::ColorAttachment * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::ColorAttachment*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("format", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    json->getProperty("sampleCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->sampleCount), ctx);
    }
    json->getProperty("loadOp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->loadOp), ctx);
    }
    json->getProperty("storeOp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->storeOp), ctx);
    }
    json->getProperty("beginLayout", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->beginLayout), ctx);
    }
    json->getProperty("endLayout", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->endLayout), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_ColorAttachment_finalize)

static bool js_gfx_ColorAttachment_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::ColorAttachment* cobj = JSB_ALLOC(cc::gfx::ColorAttachment);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::ColorAttachment* cobj = JSB_ALLOC(cc::gfx::ColorAttachment);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::ColorAttachment* cobj = JSB_ALLOC(cc::gfx::ColorAttachment);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->format), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->sampleCount), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->loadOp), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->storeOp), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->beginLayout), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->endLayout), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_ColorAttachment_constructor, __jsb_cc_gfx_ColorAttachment_class, js_cc_gfx_ColorAttachment_finalize)




static bool js_cc_gfx_ColorAttachment_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::ColorAttachment* cobj = SE_THIS_OBJECT<cc::gfx::ColorAttachment>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_ColorAttachment_finalize)

bool js_register_gfx_ColorAttachment(se::Object* obj)
{
    auto cls = se::Class::create("ColorAttachment", obj, nullptr, _SE(js_gfx_ColorAttachment_constructor));

    cls->defineProperty("format", _SE(js_gfx_ColorAttachment_get_format), _SE(js_gfx_ColorAttachment_set_format));
    cls->defineProperty("sampleCount", _SE(js_gfx_ColorAttachment_get_sampleCount), _SE(js_gfx_ColorAttachment_set_sampleCount));
    cls->defineProperty("loadOp", _SE(js_gfx_ColorAttachment_get_loadOp), _SE(js_gfx_ColorAttachment_set_loadOp));
    cls->defineProperty("storeOp", _SE(js_gfx_ColorAttachment_get_storeOp), _SE(js_gfx_ColorAttachment_set_storeOp));
    cls->defineProperty("beginLayout", _SE(js_gfx_ColorAttachment_get_beginLayout), _SE(js_gfx_ColorAttachment_set_beginLayout));
    cls->defineProperty("endLayout", _SE(js_gfx_ColorAttachment_get_endLayout), _SE(js_gfx_ColorAttachment_set_endLayout));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_ColorAttachment_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::ColorAttachment>(cls);

    __jsb_cc_gfx_ColorAttachment_proto = cls->getProto();
    __jsb_cc_gfx_ColorAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_DepthStencilAttachment_proto = nullptr;
se::Class* __jsb_cc_gfx_DepthStencilAttachment_class = nullptr;

static bool js_gfx_DepthStencilAttachment_get_format(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->format, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_format)

static bool js_gfx_DepthStencilAttachment_set_format(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_format : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->format, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_format : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_format)

static bool js_gfx_DepthStencilAttachment_get_sampleCount(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->sampleCount, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_sampleCount)

static bool js_gfx_DepthStencilAttachment_set_sampleCount(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_sampleCount : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->sampleCount, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_sampleCount : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_sampleCount)

static bool js_gfx_DepthStencilAttachment_get_depthLoadOp(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_depthLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthLoadOp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_depthLoadOp)

static bool js_gfx_DepthStencilAttachment_set_depthLoadOp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_depthLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthLoadOp, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_depthLoadOp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_depthLoadOp)

static bool js_gfx_DepthStencilAttachment_get_depthStoreOp(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_depthStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStoreOp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_depthStoreOp)

static bool js_gfx_DepthStencilAttachment_set_depthStoreOp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_depthStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStoreOp, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_depthStoreOp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_depthStoreOp)

static bool js_gfx_DepthStencilAttachment_get_stencilLoadOp(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_stencilLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilLoadOp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_stencilLoadOp)

static bool js_gfx_DepthStencilAttachment_set_stencilLoadOp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_stencilLoadOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilLoadOp, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_stencilLoadOp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_stencilLoadOp)

static bool js_gfx_DepthStencilAttachment_get_stencilStoreOp(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_stencilStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilStoreOp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_stencilStoreOp)

static bool js_gfx_DepthStencilAttachment_set_stencilStoreOp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_stencilStoreOp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilStoreOp, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_stencilStoreOp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_stencilStoreOp)

static bool js_gfx_DepthStencilAttachment_get_beginLayout(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->beginLayout, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_beginLayout)

static bool js_gfx_DepthStencilAttachment_set_beginLayout(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_beginLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->beginLayout, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_beginLayout : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_beginLayout)

static bool js_gfx_DepthStencilAttachment_get_endLayout(se::State& s)
{
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_get_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->endLayout, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilAttachment_get_endLayout)

static bool js_gfx_DepthStencilAttachment_set_endLayout(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilAttachment_set_endLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->endLayout, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilAttachment_set_endLayout : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilAttachment_set_endLayout)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DepthStencilAttachment * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::DepthStencilAttachment*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("format", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->format), ctx);
    }
    json->getProperty("sampleCount", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->sampleCount), ctx);
    }
    json->getProperty("depthLoadOp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthLoadOp), ctx);
    }
    json->getProperty("depthStoreOp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStoreOp), ctx);
    }
    json->getProperty("stencilLoadOp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilLoadOp), ctx);
    }
    json->getProperty("stencilStoreOp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilStoreOp), ctx);
    }
    json->getProperty("beginLayout", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->beginLayout), ctx);
    }
    json->getProperty("endLayout", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->endLayout), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DepthStencilAttachment_finalize)

static bool js_gfx_DepthStencilAttachment_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::DepthStencilAttachment* cobj = JSB_ALLOC(cc::gfx::DepthStencilAttachment);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DepthStencilAttachment* cobj = JSB_ALLOC(cc::gfx::DepthStencilAttachment);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::DepthStencilAttachment* cobj = JSB_ALLOC(cc::gfx::DepthStencilAttachment);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->format), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->sampleCount), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->depthLoadOp), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->depthStoreOp), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->stencilLoadOp), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->stencilStoreOp), nullptr);;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            ok &= sevalue_to_native(args[6], &(cobj->beginLayout), nullptr);;
        }
        if (argc > 7 && !args[7].isUndefined()) {
            ok &= sevalue_to_native(args[7], &(cobj->endLayout), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_DepthStencilAttachment_constructor, __jsb_cc_gfx_DepthStencilAttachment_class, js_cc_gfx_DepthStencilAttachment_finalize)




static bool js_cc_gfx_DepthStencilAttachment_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DepthStencilAttachment* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilAttachment>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DepthStencilAttachment_finalize)

bool js_register_gfx_DepthStencilAttachment(se::Object* obj)
{
    auto cls = se::Class::create("DepthStencilAttachment", obj, nullptr, _SE(js_gfx_DepthStencilAttachment_constructor));

    cls->defineProperty("format", _SE(js_gfx_DepthStencilAttachment_get_format), _SE(js_gfx_DepthStencilAttachment_set_format));
    cls->defineProperty("sampleCount", _SE(js_gfx_DepthStencilAttachment_get_sampleCount), _SE(js_gfx_DepthStencilAttachment_set_sampleCount));
    cls->defineProperty("depthLoadOp", _SE(js_gfx_DepthStencilAttachment_get_depthLoadOp), _SE(js_gfx_DepthStencilAttachment_set_depthLoadOp));
    cls->defineProperty("depthStoreOp", _SE(js_gfx_DepthStencilAttachment_get_depthStoreOp), _SE(js_gfx_DepthStencilAttachment_set_depthStoreOp));
    cls->defineProperty("stencilLoadOp", _SE(js_gfx_DepthStencilAttachment_get_stencilLoadOp), _SE(js_gfx_DepthStencilAttachment_set_stencilLoadOp));
    cls->defineProperty("stencilStoreOp", _SE(js_gfx_DepthStencilAttachment_get_stencilStoreOp), _SE(js_gfx_DepthStencilAttachment_set_stencilStoreOp));
    cls->defineProperty("beginLayout", _SE(js_gfx_DepthStencilAttachment_get_beginLayout), _SE(js_gfx_DepthStencilAttachment_set_beginLayout));
    cls->defineProperty("endLayout", _SE(js_gfx_DepthStencilAttachment_get_endLayout), _SE(js_gfx_DepthStencilAttachment_set_endLayout));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DepthStencilAttachment_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DepthStencilAttachment>(cls);

    __jsb_cc_gfx_DepthStencilAttachment_proto = cls->getProto();
    __jsb_cc_gfx_DepthStencilAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_SubPassInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_SubPassInfo_class = nullptr;

static bool js_gfx_SubPassInfo_get_bindPoint(se::State& s)
{
    cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPassInfo_get_bindPoint : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bindPoint, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubPassInfo_get_bindPoint)

static bool js_gfx_SubPassInfo_set_bindPoint(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPassInfo_set_bindPoint : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bindPoint, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SubPassInfo_set_bindPoint : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubPassInfo_set_bindPoint)

static bool js_gfx_SubPassInfo_get_inputs(se::State& s)
{
    cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPassInfo_get_inputs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->inputs, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubPassInfo_get_inputs)

static bool js_gfx_SubPassInfo_set_inputs(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPassInfo_set_inputs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->inputs, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SubPassInfo_set_inputs : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubPassInfo_set_inputs)

static bool js_gfx_SubPassInfo_get_colors(se::State& s)
{
    cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPassInfo_get_colors : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->colors, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubPassInfo_get_colors)

static bool js_gfx_SubPassInfo_set_colors(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPassInfo_set_colors : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->colors, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SubPassInfo_set_colors : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubPassInfo_set_colors)

static bool js_gfx_SubPassInfo_get_resolves(se::State& s)
{
    cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPassInfo_get_resolves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->resolves, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubPassInfo_get_resolves)

static bool js_gfx_SubPassInfo_set_resolves(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPassInfo_set_resolves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->resolves, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SubPassInfo_set_resolves : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubPassInfo_set_resolves)

static bool js_gfx_SubPassInfo_get_depthStencil(se::State& s)
{
    cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPassInfo_get_depthStencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencil, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubPassInfo_get_depthStencil)

static bool js_gfx_SubPassInfo_set_depthStencil(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPassInfo_set_depthStencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencil, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SubPassInfo_set_depthStencil : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubPassInfo_set_depthStencil)

static bool js_gfx_SubPassInfo_get_preserves(se::State& s)
{
    cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPassInfo_get_preserves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->preserves, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubPassInfo_get_preserves)

static bool js_gfx_SubPassInfo_set_preserves(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPassInfo_set_preserves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->preserves, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_SubPassInfo_set_preserves : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubPassInfo_set_preserves)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::SubPassInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::SubPassInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("bindPoint", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bindPoint), ctx);
    }
    json->getProperty("inputs", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->inputs), ctx);
    }
    json->getProperty("colors", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->colors), ctx);
    }
    json->getProperty("resolves", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->resolves), ctx);
    }
    json->getProperty("depthStencil", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencil), ctx);
    }
    json->getProperty("preserves", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->preserves), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_SubPassInfo_finalize)

static bool js_gfx_SubPassInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::SubPassInfo* cobj = JSB_ALLOC(cc::gfx::SubPassInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::SubPassInfo* cobj = JSB_ALLOC(cc::gfx::SubPassInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::SubPassInfo* cobj = JSB_ALLOC(cc::gfx::SubPassInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->bindPoint), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->inputs), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->colors), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->resolves), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->depthStencil), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->preserves), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_SubPassInfo_constructor, __jsb_cc_gfx_SubPassInfo_class, js_cc_gfx_SubPassInfo_finalize)




static bool js_cc_gfx_SubPassInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::SubPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::SubPassInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_SubPassInfo_finalize)

bool js_register_gfx_SubPassInfo(se::Object* obj)
{
    auto cls = se::Class::create("SubPassInfo", obj, nullptr, _SE(js_gfx_SubPassInfo_constructor));

    cls->defineProperty("bindPoint", _SE(js_gfx_SubPassInfo_get_bindPoint), _SE(js_gfx_SubPassInfo_set_bindPoint));
    cls->defineProperty("inputs", _SE(js_gfx_SubPassInfo_get_inputs), _SE(js_gfx_SubPassInfo_set_inputs));
    cls->defineProperty("colors", _SE(js_gfx_SubPassInfo_get_colors), _SE(js_gfx_SubPassInfo_set_colors));
    cls->defineProperty("resolves", _SE(js_gfx_SubPassInfo_get_resolves), _SE(js_gfx_SubPassInfo_set_resolves));
    cls->defineProperty("depthStencil", _SE(js_gfx_SubPassInfo_get_depthStencil), _SE(js_gfx_SubPassInfo_set_depthStencil));
    cls->defineProperty("preserves", _SE(js_gfx_SubPassInfo_get_preserves), _SE(js_gfx_SubPassInfo_set_preserves));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_SubPassInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::SubPassInfo>(cls);

    __jsb_cc_gfx_SubPassInfo_proto = cls->getProto();
    __jsb_cc_gfx_SubPassInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_RenderPassInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_RenderPassInfo_class = nullptr;

static bool js_gfx_RenderPassInfo_get_colorAttachments(se::State& s)
{
    cc::gfx::RenderPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_get_colorAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->colorAttachments, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RenderPassInfo_get_colorAttachments)

static bool js_gfx_RenderPassInfo_set_colorAttachments(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RenderPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_set_colorAttachments : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->colorAttachments, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RenderPassInfo_set_colorAttachments : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RenderPassInfo_set_colorAttachments)

static bool js_gfx_RenderPassInfo_get_depthStencilAttachment(se::State& s)
{
    cc::gfx::RenderPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_get_depthStencilAttachment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencilAttachment, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RenderPassInfo_get_depthStencilAttachment)

static bool js_gfx_RenderPassInfo_set_depthStencilAttachment(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RenderPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_set_depthStencilAttachment : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencilAttachment, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RenderPassInfo_set_depthStencilAttachment : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RenderPassInfo_set_depthStencilAttachment)

static bool js_gfx_RenderPassInfo_get_subPasses(se::State& s)
{
    cc::gfx::RenderPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_get_subPasses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->subPasses, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RenderPassInfo_get_subPasses)

static bool js_gfx_RenderPassInfo_set_subPasses(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RenderPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPassInfo_set_subPasses : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->subPasses, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RenderPassInfo_set_subPasses : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RenderPassInfo_set_subPasses)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::RenderPassInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::RenderPassInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("colorAttachments", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->colorAttachments), ctx);
    }
    json->getProperty("depthStencilAttachment", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencilAttachment), ctx);
    }
    json->getProperty("subPasses", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->subPasses), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_RenderPassInfo_finalize)

static bool js_gfx_RenderPassInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::RenderPassInfo* cobj = JSB_ALLOC(cc::gfx::RenderPassInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::RenderPassInfo* cobj = JSB_ALLOC(cc::gfx::RenderPassInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::RenderPassInfo* cobj = JSB_ALLOC(cc::gfx::RenderPassInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->colorAttachments), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->depthStencilAttachment), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->subPasses), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_RenderPassInfo_constructor, __jsb_cc_gfx_RenderPassInfo_class, js_cc_gfx_RenderPassInfo_finalize)




static bool js_cc_gfx_RenderPassInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::RenderPassInfo* cobj = SE_THIS_OBJECT<cc::gfx::RenderPassInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_RenderPassInfo_finalize)

bool js_register_gfx_RenderPassInfo(se::Object* obj)
{
    auto cls = se::Class::create("RenderPassInfo", obj, nullptr, _SE(js_gfx_RenderPassInfo_constructor));

    cls->defineProperty("colorAttachments", _SE(js_gfx_RenderPassInfo_get_colorAttachments), _SE(js_gfx_RenderPassInfo_set_colorAttachments));
    cls->defineProperty("depthStencilAttachment", _SE(js_gfx_RenderPassInfo_get_depthStencilAttachment), _SE(js_gfx_RenderPassInfo_set_depthStencilAttachment));
    cls->defineProperty("subPasses", _SE(js_gfx_RenderPassInfo_get_subPasses), _SE(js_gfx_RenderPassInfo_set_subPasses));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_RenderPassInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::RenderPassInfo>(cls);

    __jsb_cc_gfx_RenderPassInfo_proto = cls->getProto();
    __jsb_cc_gfx_RenderPassInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_FramebufferInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_FramebufferInfo_class = nullptr;

static bool js_gfx_FramebufferInfo_get_renderPass(se::State& s)
{
    cc::gfx::FramebufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_get_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->renderPass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FramebufferInfo_get_renderPass)

static bool js_gfx_FramebufferInfo_set_renderPass(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FramebufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_set_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->renderPass, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FramebufferInfo_set_renderPass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FramebufferInfo_set_renderPass)

static bool js_gfx_FramebufferInfo_get_colorTextures(se::State& s)
{
    cc::gfx::FramebufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_get_colorTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->colorTextures, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FramebufferInfo_get_colorTextures)

static bool js_gfx_FramebufferInfo_set_colorTextures(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FramebufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_set_colorTextures : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->colorTextures, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FramebufferInfo_set_colorTextures : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FramebufferInfo_set_colorTextures)

static bool js_gfx_FramebufferInfo_get_depthStencilTexture(se::State& s)
{
    cc::gfx::FramebufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_get_depthStencilTexture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencilTexture, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FramebufferInfo_get_depthStencilTexture)

static bool js_gfx_FramebufferInfo_set_depthStencilTexture(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FramebufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_set_depthStencilTexture : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencilTexture, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FramebufferInfo_set_depthStencilTexture : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FramebufferInfo_set_depthStencilTexture)

static bool js_gfx_FramebufferInfo_get_colorMipmapLevels(se::State& s)
{
    cc::gfx::FramebufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_get_colorMipmapLevels : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->colorMipmapLevels, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FramebufferInfo_get_colorMipmapLevels)

static bool js_gfx_FramebufferInfo_set_colorMipmapLevels(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FramebufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_set_colorMipmapLevels : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->colorMipmapLevels, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FramebufferInfo_set_colorMipmapLevels : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FramebufferInfo_set_colorMipmapLevels)

static bool js_gfx_FramebufferInfo_get_depthStencilMipmapLevel(se::State& s)
{
    cc::gfx::FramebufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_get_depthStencilMipmapLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencilMipmapLevel, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FramebufferInfo_get_depthStencilMipmapLevel)

static bool js_gfx_FramebufferInfo_set_depthStencilMipmapLevel(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FramebufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FramebufferInfo_set_depthStencilMipmapLevel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencilMipmapLevel, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FramebufferInfo_set_depthStencilMipmapLevel : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FramebufferInfo_set_depthStencilMipmapLevel)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::FramebufferInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::FramebufferInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("renderPass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->renderPass), ctx);
    }
    json->getProperty("colorTextures", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->colorTextures), ctx);
    }
    json->getProperty("depthStencilTexture", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencilTexture), ctx);
    }
    json->getProperty("colorMipmapLevels", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->colorMipmapLevels), ctx);
    }
    json->getProperty("depthStencilMipmapLevel", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencilMipmapLevel), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_FramebufferInfo_finalize)

static bool js_gfx_FramebufferInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::FramebufferInfo* cobj = JSB_ALLOC(cc::gfx::FramebufferInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::FramebufferInfo* cobj = JSB_ALLOC(cc::gfx::FramebufferInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::FramebufferInfo* cobj = JSB_ALLOC(cc::gfx::FramebufferInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->renderPass), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->colorTextures), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->depthStencilTexture), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->colorMipmapLevels), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->depthStencilMipmapLevel), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_FramebufferInfo_constructor, __jsb_cc_gfx_FramebufferInfo_class, js_cc_gfx_FramebufferInfo_finalize)




static bool js_cc_gfx_FramebufferInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::FramebufferInfo* cobj = SE_THIS_OBJECT<cc::gfx::FramebufferInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_FramebufferInfo_finalize)

bool js_register_gfx_FramebufferInfo(se::Object* obj)
{
    auto cls = se::Class::create("FramebufferInfo", obj, nullptr, _SE(js_gfx_FramebufferInfo_constructor));

    cls->defineProperty("renderPass", _SE(js_gfx_FramebufferInfo_get_renderPass), _SE(js_gfx_FramebufferInfo_set_renderPass));
    cls->defineProperty("colorTextures", _SE(js_gfx_FramebufferInfo_get_colorTextures), _SE(js_gfx_FramebufferInfo_set_colorTextures));
    cls->defineProperty("depthStencilTexture", _SE(js_gfx_FramebufferInfo_get_depthStencilTexture), _SE(js_gfx_FramebufferInfo_set_depthStencilTexture));
    cls->defineProperty("colorMipmapLevels", _SE(js_gfx_FramebufferInfo_get_colorMipmapLevels), _SE(js_gfx_FramebufferInfo_set_colorMipmapLevels));
    cls->defineProperty("depthStencilMipmapLevel", _SE(js_gfx_FramebufferInfo_get_depthStencilMipmapLevel), _SE(js_gfx_FramebufferInfo_set_depthStencilMipmapLevel));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_FramebufferInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::FramebufferInfo>(cls);

    __jsb_cc_gfx_FramebufferInfo_proto = cls->getProto();
    __jsb_cc_gfx_FramebufferInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_DescriptorSetLayoutBinding_proto = nullptr;
se::Class* __jsb_cc_gfx_DescriptorSetLayoutBinding_class = nullptr;

static bool js_gfx_DescriptorSetLayoutBinding_get_binding(se::State& s)
{
    cc::gfx::DescriptorSetLayoutBinding* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_get_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->binding, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetLayoutBinding_get_binding)

static bool js_gfx_DescriptorSetLayoutBinding_set_binding(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DescriptorSetLayoutBinding* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_set_binding : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->binding, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayoutBinding_set_binding : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetLayoutBinding_set_binding)

static bool js_gfx_DescriptorSetLayoutBinding_get_descriptorType(se::State& s)
{
    cc::gfx::DescriptorSetLayoutBinding* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_get_descriptorType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->descriptorType, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetLayoutBinding_get_descriptorType)

static bool js_gfx_DescriptorSetLayoutBinding_set_descriptorType(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DescriptorSetLayoutBinding* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_set_descriptorType : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->descriptorType, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayoutBinding_set_descriptorType : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetLayoutBinding_set_descriptorType)

static bool js_gfx_DescriptorSetLayoutBinding_get_count(se::State& s)
{
    cc::gfx::DescriptorSetLayoutBinding* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetLayoutBinding_get_count)

static bool js_gfx_DescriptorSetLayoutBinding_set_count(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DescriptorSetLayoutBinding* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayoutBinding_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetLayoutBinding_set_count)

static bool js_gfx_DescriptorSetLayoutBinding_get_stageFlags(se::State& s)
{
    cc::gfx::DescriptorSetLayoutBinding* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_get_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stageFlags, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetLayoutBinding_get_stageFlags)

static bool js_gfx_DescriptorSetLayoutBinding_set_stageFlags(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DescriptorSetLayoutBinding* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_set_stageFlags : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stageFlags, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayoutBinding_set_stageFlags : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetLayoutBinding_set_stageFlags)

static bool js_gfx_DescriptorSetLayoutBinding_get_immutableSamplers(se::State& s)
{
    cc::gfx::DescriptorSetLayoutBinding* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_get_immutableSamplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->immutableSamplers, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetLayoutBinding_get_immutableSamplers)

static bool js_gfx_DescriptorSetLayoutBinding_set_immutableSamplers(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DescriptorSetLayoutBinding* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutBinding_set_immutableSamplers : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->immutableSamplers, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayoutBinding_set_immutableSamplers : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetLayoutBinding_set_immutableSamplers)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DescriptorSetLayoutBinding * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::DescriptorSetLayoutBinding*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("binding", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->binding), ctx);
    }
    json->getProperty("descriptorType", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->descriptorType), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    json->getProperty("stageFlags", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stageFlags), ctx);
    }
    json->getProperty("immutableSamplers", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->immutableSamplers), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayoutBinding_finalize)

static bool js_gfx_DescriptorSetLayoutBinding_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::DescriptorSetLayoutBinding* cobj = JSB_ALLOC(cc::gfx::DescriptorSetLayoutBinding);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DescriptorSetLayoutBinding* cobj = JSB_ALLOC(cc::gfx::DescriptorSetLayoutBinding);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::DescriptorSetLayoutBinding* cobj = JSB_ALLOC(cc::gfx::DescriptorSetLayoutBinding);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->binding), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->descriptorType), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->count), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->stageFlags), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->immutableSamplers), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_DescriptorSetLayoutBinding_constructor, __jsb_cc_gfx_DescriptorSetLayoutBinding_class, js_cc_gfx_DescriptorSetLayoutBinding_finalize)




static bool js_cc_gfx_DescriptorSetLayoutBinding_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DescriptorSetLayoutBinding* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutBinding>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayoutBinding_finalize)

bool js_register_gfx_DescriptorSetLayoutBinding(se::Object* obj)
{
    auto cls = se::Class::create("DescriptorSetLayoutBinding", obj, nullptr, _SE(js_gfx_DescriptorSetLayoutBinding_constructor));

    cls->defineProperty("binding", _SE(js_gfx_DescriptorSetLayoutBinding_get_binding), _SE(js_gfx_DescriptorSetLayoutBinding_set_binding));
    cls->defineProperty("descriptorType", _SE(js_gfx_DescriptorSetLayoutBinding_get_descriptorType), _SE(js_gfx_DescriptorSetLayoutBinding_set_descriptorType));
    cls->defineProperty("count", _SE(js_gfx_DescriptorSetLayoutBinding_get_count), _SE(js_gfx_DescriptorSetLayoutBinding_set_count));
    cls->defineProperty("stageFlags", _SE(js_gfx_DescriptorSetLayoutBinding_get_stageFlags), _SE(js_gfx_DescriptorSetLayoutBinding_set_stageFlags));
    cls->defineProperty("immutableSamplers", _SE(js_gfx_DescriptorSetLayoutBinding_get_immutableSamplers), _SE(js_gfx_DescriptorSetLayoutBinding_set_immutableSamplers));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DescriptorSetLayoutBinding_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DescriptorSetLayoutBinding>(cls);

    __jsb_cc_gfx_DescriptorSetLayoutBinding_proto = cls->getProto();
    __jsb_cc_gfx_DescriptorSetLayoutBinding_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_DescriptorSetLayoutInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_DescriptorSetLayoutInfo_class = nullptr;

static bool js_gfx_DescriptorSetLayoutInfo_get_bindings(se::State& s)
{
    cc::gfx::DescriptorSetLayoutInfo* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutInfo_get_bindings : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bindings, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetLayoutInfo_get_bindings)

static bool js_gfx_DescriptorSetLayoutInfo_set_bindings(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DescriptorSetLayoutInfo* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayoutInfo_set_bindings : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bindings, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayoutInfo_set_bindings : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetLayoutInfo_set_bindings)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DescriptorSetLayoutInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::DescriptorSetLayoutInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("bindings", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bindings), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayoutInfo_finalize)

static bool js_gfx_DescriptorSetLayoutInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::DescriptorSetLayoutInfo* cobj = JSB_ALLOC(cc::gfx::DescriptorSetLayoutInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::DescriptorSetLayoutInfo* cobj = JSB_ALLOC(cc::gfx::DescriptorSetLayoutInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->bindings), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_DescriptorSetLayoutInfo_constructor, __jsb_cc_gfx_DescriptorSetLayoutInfo_class, js_cc_gfx_DescriptorSetLayoutInfo_finalize)




static bool js_cc_gfx_DescriptorSetLayoutInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DescriptorSetLayoutInfo* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayoutInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayoutInfo_finalize)

bool js_register_gfx_DescriptorSetLayoutInfo(se::Object* obj)
{
    auto cls = se::Class::create("DescriptorSetLayoutInfo", obj, nullptr, _SE(js_gfx_DescriptorSetLayoutInfo_constructor));

    cls->defineProperty("bindings", _SE(js_gfx_DescriptorSetLayoutInfo_get_bindings), _SE(js_gfx_DescriptorSetLayoutInfo_set_bindings));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DescriptorSetLayoutInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DescriptorSetLayoutInfo>(cls);

    __jsb_cc_gfx_DescriptorSetLayoutInfo_proto = cls->getProto();
    __jsb_cc_gfx_DescriptorSetLayoutInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_DescriptorSetInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_DescriptorSetInfo_class = nullptr;

static bool js_gfx_DescriptorSetInfo_get_layout(se::State& s)
{
    cc::gfx::DescriptorSetInfo* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetInfo_get_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->layout, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DescriptorSetInfo_get_layout)

static bool js_gfx_DescriptorSetInfo_set_layout(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DescriptorSetInfo* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetInfo_set_layout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->layout, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetInfo_set_layout : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DescriptorSetInfo_set_layout)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DescriptorSetInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::DescriptorSetInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("layout", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->layout), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DescriptorSetInfo_finalize)

static bool js_gfx_DescriptorSetInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::DescriptorSetInfo* cobj = JSB_ALLOC(cc::gfx::DescriptorSetInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::DescriptorSetInfo* cobj = JSB_ALLOC(cc::gfx::DescriptorSetInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->layout), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_DescriptorSetInfo_constructor, __jsb_cc_gfx_DescriptorSetInfo_class, js_cc_gfx_DescriptorSetInfo_finalize)




static bool js_cc_gfx_DescriptorSetInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DescriptorSetInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DescriptorSetInfo* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DescriptorSetInfo_finalize)

bool js_register_gfx_DescriptorSetInfo(se::Object* obj)
{
    auto cls = se::Class::create("DescriptorSetInfo", obj, nullptr, _SE(js_gfx_DescriptorSetInfo_constructor));

    cls->defineProperty("layout", _SE(js_gfx_DescriptorSetInfo_get_layout), _SE(js_gfx_DescriptorSetInfo_set_layout));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DescriptorSetInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DescriptorSetInfo>(cls);

    __jsb_cc_gfx_DescriptorSetInfo_proto = cls->getProto();
    __jsb_cc_gfx_DescriptorSetInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_PipelineLayoutInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_PipelineLayoutInfo_class = nullptr;

static bool js_gfx_PipelineLayoutInfo_get_setLayouts(se::State& s)
{
    cc::gfx::PipelineLayoutInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayoutInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayoutInfo_get_setLayouts : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->setLayouts, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineLayoutInfo_get_setLayouts)

static bool js_gfx_PipelineLayoutInfo_set_setLayouts(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineLayoutInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayoutInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayoutInfo_set_setLayouts : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->setLayouts, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineLayoutInfo_set_setLayouts : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineLayoutInfo_set_setLayouts)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::PipelineLayoutInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::PipelineLayoutInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("setLayouts", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->setLayouts), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_PipelineLayoutInfo_finalize)

static bool js_gfx_PipelineLayoutInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::PipelineLayoutInfo* cobj = JSB_ALLOC(cc::gfx::PipelineLayoutInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::PipelineLayoutInfo* cobj = JSB_ALLOC(cc::gfx::PipelineLayoutInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->setLayouts), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_PipelineLayoutInfo_constructor, __jsb_cc_gfx_PipelineLayoutInfo_class, js_cc_gfx_PipelineLayoutInfo_finalize)




static bool js_cc_gfx_PipelineLayoutInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::PipelineLayoutInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::PipelineLayoutInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayoutInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_PipelineLayoutInfo_finalize)

bool js_register_gfx_PipelineLayoutInfo(se::Object* obj)
{
    auto cls = se::Class::create("PipelineLayoutInfo", obj, nullptr, _SE(js_gfx_PipelineLayoutInfo_constructor));

    cls->defineProperty("setLayouts", _SE(js_gfx_PipelineLayoutInfo_get_setLayouts), _SE(js_gfx_PipelineLayoutInfo_set_setLayouts));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_PipelineLayoutInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::PipelineLayoutInfo>(cls);

    __jsb_cc_gfx_PipelineLayoutInfo_proto = cls->getProto();
    __jsb_cc_gfx_PipelineLayoutInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_InputState_proto = nullptr;
se::Class* __jsb_cc_gfx_InputState_class = nullptr;

static bool js_gfx_InputState_get_attributes(se::State& s)
{
    cc::gfx::InputState* cobj = SE_THIS_OBJECT<cc::gfx::InputState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputState_get_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->attributes, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_InputState_get_attributes)

static bool js_gfx_InputState_set_attributes(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::InputState* cobj = SE_THIS_OBJECT<cc::gfx::InputState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputState_set_attributes : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->attributes, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_InputState_set_attributes : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_InputState_set_attributes)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::InputState * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::InputState*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("attributes", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->attributes), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_InputState_finalize)

static bool js_gfx_InputState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::InputState* cobj = JSB_ALLOC(cc::gfx::InputState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::InputState* cobj = JSB_ALLOC(cc::gfx::InputState);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->attributes), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_InputState_constructor, __jsb_cc_gfx_InputState_class, js_cc_gfx_InputState_finalize)




static bool js_cc_gfx_InputState_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::InputState>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::InputState* cobj = SE_THIS_OBJECT<cc::gfx::InputState>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_InputState_finalize)

bool js_register_gfx_InputState(se::Object* obj)
{
    auto cls = se::Class::create("InputState", obj, nullptr, _SE(js_gfx_InputState_constructor));

    cls->defineProperty("attributes", _SE(js_gfx_InputState_get_attributes), _SE(js_gfx_InputState_set_attributes));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_InputState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::InputState>(cls);

    __jsb_cc_gfx_InputState_proto = cls->getProto();
    __jsb_cc_gfx_InputState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_RasterizerState_proto = nullptr;
se::Class* __jsb_cc_gfx_RasterizerState_class = nullptr;

static bool js_gfx_RasterizerState_get_isDiscard(se::State& s)
{
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_isDiscard : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isDiscard, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_isDiscard)

static bool js_gfx_RasterizerState_set_isDiscard(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_isDiscard : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isDiscard, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_isDiscard : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_isDiscard)

static bool js_gfx_RasterizerState_get_polygonMode(se::State& s)
{
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_polygonMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->polygonMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_polygonMode)

static bool js_gfx_RasterizerState_set_polygonMode(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_polygonMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->polygonMode, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_polygonMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_polygonMode)

static bool js_gfx_RasterizerState_get_shadeModel(se::State& s)
{
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_shadeModel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shadeModel, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_shadeModel)

static bool js_gfx_RasterizerState_set_shadeModel(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_shadeModel : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shadeModel, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_shadeModel : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_shadeModel)

static bool js_gfx_RasterizerState_get_cullMode(se::State& s)
{
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_cullMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->cullMode, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_cullMode)

static bool js_gfx_RasterizerState_set_cullMode(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_cullMode : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->cullMode, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_cullMode : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_cullMode)

static bool js_gfx_RasterizerState_get_isFrontFaceCCW(se::State& s)
{
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_isFrontFaceCCW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isFrontFaceCCW, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_isFrontFaceCCW)

static bool js_gfx_RasterizerState_set_isFrontFaceCCW(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_isFrontFaceCCW : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isFrontFaceCCW, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_isFrontFaceCCW : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_isFrontFaceCCW)

static bool js_gfx_RasterizerState_get_depthBiasEnabled(se::State& s)
{
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_depthBiasEnabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthBiasEnabled, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_depthBiasEnabled)

static bool js_gfx_RasterizerState_set_depthBiasEnabled(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_depthBiasEnabled : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthBiasEnabled, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_depthBiasEnabled : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_depthBiasEnabled)

static bool js_gfx_RasterizerState_get_depthBias(se::State& s)
{
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_depthBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthBias, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_depthBias)

static bool js_gfx_RasterizerState_set_depthBias(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_depthBias : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthBias, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_depthBias : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_depthBias)

static bool js_gfx_RasterizerState_get_depthBiasClamp(se::State& s)
{
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_depthBiasClamp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthBiasClamp, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_depthBiasClamp)

static bool js_gfx_RasterizerState_set_depthBiasClamp(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_depthBiasClamp : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthBiasClamp, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_depthBiasClamp : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_depthBiasClamp)

static bool js_gfx_RasterizerState_get_depthBiasSlop(se::State& s)
{
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_depthBiasSlop : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthBiasSlop, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_depthBiasSlop)

static bool js_gfx_RasterizerState_set_depthBiasSlop(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_depthBiasSlop : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthBiasSlop, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_depthBiasSlop : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_depthBiasSlop)

static bool js_gfx_RasterizerState_get_isDepthClip(se::State& s)
{
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_isDepthClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isDepthClip, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_isDepthClip)

static bool js_gfx_RasterizerState_set_isDepthClip(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_isDepthClip : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isDepthClip, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_isDepthClip : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_isDepthClip)

static bool js_gfx_RasterizerState_get_isMultisample(se::State& s)
{
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_isMultisample : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isMultisample, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_isMultisample)

static bool js_gfx_RasterizerState_set_isMultisample(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_isMultisample : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isMultisample, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_isMultisample : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_isMultisample)

static bool js_gfx_RasterizerState_get_lineWidth(se::State& s)
{
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_get_lineWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->lineWidth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_RasterizerState_get_lineWidth)

static bool js_gfx_RasterizerState_set_lineWidth(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RasterizerState_set_lineWidth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->lineWidth, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_RasterizerState_set_lineWidth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_RasterizerState_set_lineWidth)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::RasterizerState * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::RasterizerState*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("isDiscard", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isDiscard), ctx);
    }
    json->getProperty("polygonMode", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->polygonMode), ctx);
    }
    json->getProperty("shadeModel", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shadeModel), ctx);
    }
    json->getProperty("cullMode", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->cullMode), ctx);
    }
    json->getProperty("isFrontFaceCCW", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isFrontFaceCCW), ctx);
    }
    json->getProperty("depthBiasEnabled", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthBiasEnabled), ctx);
    }
    json->getProperty("depthBias", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthBias), ctx);
    }
    json->getProperty("depthBiasClamp", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthBiasClamp), ctx);
    }
    json->getProperty("depthBiasSlop", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthBiasSlop), ctx);
    }
    json->getProperty("isDepthClip", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isDepthClip), ctx);
    }
    json->getProperty("isMultisample", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isMultisample), ctx);
    }
    json->getProperty("lineWidth", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->lineWidth), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_RasterizerState_finalize)

static bool js_gfx_RasterizerState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::RasterizerState* cobj = JSB_ALLOC(cc::gfx::RasterizerState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::RasterizerState* cobj = JSB_ALLOC(cc::gfx::RasterizerState);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::RasterizerState* cobj = JSB_ALLOC(cc::gfx::RasterizerState);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->isDiscard), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->polygonMode), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->shadeModel), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->cullMode), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->isFrontFaceCCW), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->depthBiasEnabled), nullptr);;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            ok &= sevalue_to_native(args[6], &(cobj->depthBias), nullptr);;
        }
        if (argc > 7 && !args[7].isUndefined()) {
            ok &= sevalue_to_native(args[7], &(cobj->depthBiasClamp), nullptr);;
        }
        if (argc > 8 && !args[8].isUndefined()) {
            ok &= sevalue_to_native(args[8], &(cobj->depthBiasSlop), nullptr);;
        }
        if (argc > 9 && !args[9].isUndefined()) {
            ok &= sevalue_to_native(args[9], &(cobj->isDepthClip), nullptr);;
        }
        if (argc > 10 && !args[10].isUndefined()) {
            ok &= sevalue_to_native(args[10], &(cobj->isMultisample), nullptr);;
        }
        if (argc > 11 && !args[11].isUndefined()) {
            ok &= sevalue_to_native(args[11], &(cobj->lineWidth), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_RasterizerState_constructor, __jsb_cc_gfx_RasterizerState_class, js_cc_gfx_RasterizerState_finalize)




static bool js_cc_gfx_RasterizerState_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::RasterizerState>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::RasterizerState* cobj = SE_THIS_OBJECT<cc::gfx::RasterizerState>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_RasterizerState_finalize)

bool js_register_gfx_RasterizerState(se::Object* obj)
{
    auto cls = se::Class::create("RasterizerState", obj, nullptr, _SE(js_gfx_RasterizerState_constructor));

    cls->defineProperty("isDiscard", _SE(js_gfx_RasterizerState_get_isDiscard), _SE(js_gfx_RasterizerState_set_isDiscard));
    cls->defineProperty("polygonMode", _SE(js_gfx_RasterizerState_get_polygonMode), _SE(js_gfx_RasterizerState_set_polygonMode));
    cls->defineProperty("shadeModel", _SE(js_gfx_RasterizerState_get_shadeModel), _SE(js_gfx_RasterizerState_set_shadeModel));
    cls->defineProperty("cullMode", _SE(js_gfx_RasterizerState_get_cullMode), _SE(js_gfx_RasterizerState_set_cullMode));
    cls->defineProperty("isFrontFaceCCW", _SE(js_gfx_RasterizerState_get_isFrontFaceCCW), _SE(js_gfx_RasterizerState_set_isFrontFaceCCW));
    cls->defineProperty("depthBiasEnabled", _SE(js_gfx_RasterizerState_get_depthBiasEnabled), _SE(js_gfx_RasterizerState_set_depthBiasEnabled));
    cls->defineProperty("depthBias", _SE(js_gfx_RasterizerState_get_depthBias), _SE(js_gfx_RasterizerState_set_depthBias));
    cls->defineProperty("depthBiasClamp", _SE(js_gfx_RasterizerState_get_depthBiasClamp), _SE(js_gfx_RasterizerState_set_depthBiasClamp));
    cls->defineProperty("depthBiasSlop", _SE(js_gfx_RasterizerState_get_depthBiasSlop), _SE(js_gfx_RasterizerState_set_depthBiasSlop));
    cls->defineProperty("isDepthClip", _SE(js_gfx_RasterizerState_get_isDepthClip), _SE(js_gfx_RasterizerState_set_isDepthClip));
    cls->defineProperty("isMultisample", _SE(js_gfx_RasterizerState_get_isMultisample), _SE(js_gfx_RasterizerState_set_isMultisample));
    cls->defineProperty("lineWidth", _SE(js_gfx_RasterizerState_get_lineWidth), _SE(js_gfx_RasterizerState_set_lineWidth));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_RasterizerState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::RasterizerState>(cls);

    __jsb_cc_gfx_RasterizerState_proto = cls->getProto();
    __jsb_cc_gfx_RasterizerState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_DepthStencilState_proto = nullptr;
se::Class* __jsb_cc_gfx_DepthStencilState_class = nullptr;

static bool js_gfx_DepthStencilState_get_depthTest(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_depthTest : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthTest, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_depthTest)

static bool js_gfx_DepthStencilState_set_depthTest(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_depthTest : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthTest, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_depthTest : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_depthTest)

static bool js_gfx_DepthStencilState_get_depthWrite(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_depthWrite : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthWrite, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_depthWrite)

static bool js_gfx_DepthStencilState_set_depthWrite(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_depthWrite : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthWrite, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_depthWrite : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_depthWrite)

static bool js_gfx_DepthStencilState_get_depthFunc(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_depthFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthFunc, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_depthFunc)

static bool js_gfx_DepthStencilState_set_depthFunc(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_depthFunc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthFunc, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_depthFunc : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_depthFunc)

static bool js_gfx_DepthStencilState_get_stencilTestFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilTestFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilTestFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilTestFront)

static bool js_gfx_DepthStencilState_set_stencilTestFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilTestFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilTestFront, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilTestFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilTestFront)

static bool js_gfx_DepthStencilState_get_stencilFuncFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilFuncFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilFuncFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilFuncFront)

static bool js_gfx_DepthStencilState_set_stencilFuncFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilFuncFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilFuncFront, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilFuncFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilFuncFront)

static bool js_gfx_DepthStencilState_get_stencilReadMaskFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilReadMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilReadMaskFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilReadMaskFront)

static bool js_gfx_DepthStencilState_set_stencilReadMaskFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilReadMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilReadMaskFront, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilReadMaskFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilReadMaskFront)

static bool js_gfx_DepthStencilState_get_stencilWriteMaskFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilWriteMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilWriteMaskFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilWriteMaskFront)

static bool js_gfx_DepthStencilState_set_stencilWriteMaskFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilWriteMaskFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilWriteMaskFront, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilWriteMaskFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilWriteMaskFront)

static bool js_gfx_DepthStencilState_get_stencilFailOpFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilFailOpFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilFailOpFront)

static bool js_gfx_DepthStencilState_set_stencilFailOpFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilFailOpFront, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilFailOpFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilFailOpFront)

static bool js_gfx_DepthStencilState_get_stencilZFailOpFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilZFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilZFailOpFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilZFailOpFront)

static bool js_gfx_DepthStencilState_set_stencilZFailOpFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilZFailOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilZFailOpFront, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilZFailOpFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilZFailOpFront)

static bool js_gfx_DepthStencilState_get_stencilPassOpFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilPassOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilPassOpFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilPassOpFront)

static bool js_gfx_DepthStencilState_set_stencilPassOpFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilPassOpFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilPassOpFront, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilPassOpFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilPassOpFront)

static bool js_gfx_DepthStencilState_get_stencilRefFront(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilRefFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilRefFront, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilRefFront)

static bool js_gfx_DepthStencilState_set_stencilRefFront(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilRefFront : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilRefFront, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilRefFront : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilRefFront)

static bool js_gfx_DepthStencilState_get_stencilTestBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilTestBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilTestBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilTestBack)

static bool js_gfx_DepthStencilState_set_stencilTestBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilTestBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilTestBack, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilTestBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilTestBack)

static bool js_gfx_DepthStencilState_get_stencilFuncBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilFuncBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilFuncBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilFuncBack)

static bool js_gfx_DepthStencilState_set_stencilFuncBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilFuncBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilFuncBack, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilFuncBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilFuncBack)

static bool js_gfx_DepthStencilState_get_stencilReadMaskBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilReadMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilReadMaskBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilReadMaskBack)

static bool js_gfx_DepthStencilState_set_stencilReadMaskBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilReadMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilReadMaskBack, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilReadMaskBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilReadMaskBack)

static bool js_gfx_DepthStencilState_get_stencilWriteMaskBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilWriteMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilWriteMaskBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilWriteMaskBack)

static bool js_gfx_DepthStencilState_set_stencilWriteMaskBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilWriteMaskBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilWriteMaskBack, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilWriteMaskBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilWriteMaskBack)

static bool js_gfx_DepthStencilState_get_stencilFailOpBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilFailOpBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilFailOpBack)

static bool js_gfx_DepthStencilState_set_stencilFailOpBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilFailOpBack, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilFailOpBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilFailOpBack)

static bool js_gfx_DepthStencilState_get_stencilZFailOpBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilZFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilZFailOpBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilZFailOpBack)

static bool js_gfx_DepthStencilState_set_stencilZFailOpBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilZFailOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilZFailOpBack, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilZFailOpBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilZFailOpBack)

static bool js_gfx_DepthStencilState_get_stencilPassOpBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilPassOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilPassOpBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilPassOpBack)

static bool js_gfx_DepthStencilState_set_stencilPassOpBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilPassOpBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilPassOpBack, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilPassOpBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilPassOpBack)

static bool js_gfx_DepthStencilState_get_stencilRefBack(se::State& s)
{
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_get_stencilRefBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->stencilRefBack, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_DepthStencilState_get_stencilRefBack)

static bool js_gfx_DepthStencilState_set_stencilRefBack(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DepthStencilState_set_stencilRefBack : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->stencilRefBack, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_DepthStencilState_set_stencilRefBack : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_DepthStencilState_set_stencilRefBack)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::DepthStencilState * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::DepthStencilState*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("depthTest", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthTest), ctx);
    }
    json->getProperty("depthWrite", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthWrite), ctx);
    }
    json->getProperty("depthFunc", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthFunc), ctx);
    }
    json->getProperty("stencilTestFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilTestFront), ctx);
    }
    json->getProperty("stencilFuncFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilFuncFront), ctx);
    }
    json->getProperty("stencilReadMaskFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilReadMaskFront), ctx);
    }
    json->getProperty("stencilWriteMaskFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilWriteMaskFront), ctx);
    }
    json->getProperty("stencilFailOpFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilFailOpFront), ctx);
    }
    json->getProperty("stencilZFailOpFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilZFailOpFront), ctx);
    }
    json->getProperty("stencilPassOpFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilPassOpFront), ctx);
    }
    json->getProperty("stencilRefFront", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilRefFront), ctx);
    }
    json->getProperty("stencilTestBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilTestBack), ctx);
    }
    json->getProperty("stencilFuncBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilFuncBack), ctx);
    }
    json->getProperty("stencilReadMaskBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilReadMaskBack), ctx);
    }
    json->getProperty("stencilWriteMaskBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilWriteMaskBack), ctx);
    }
    json->getProperty("stencilFailOpBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilFailOpBack), ctx);
    }
    json->getProperty("stencilZFailOpBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilZFailOpBack), ctx);
    }
    json->getProperty("stencilPassOpBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilPassOpBack), ctx);
    }
    json->getProperty("stencilRefBack", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->stencilRefBack), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DepthStencilState_finalize)

static bool js_gfx_DepthStencilState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::DepthStencilState* cobj = JSB_ALLOC(cc::gfx::DepthStencilState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::DepthStencilState* cobj = JSB_ALLOC(cc::gfx::DepthStencilState);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::DepthStencilState* cobj = JSB_ALLOC(cc::gfx::DepthStencilState);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->depthTest), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->depthWrite), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->depthFunc), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->stencilTestFront), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->stencilFuncFront), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->stencilReadMaskFront), nullptr);;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            ok &= sevalue_to_native(args[6], &(cobj->stencilWriteMaskFront), nullptr);;
        }
        if (argc > 7 && !args[7].isUndefined()) {
            ok &= sevalue_to_native(args[7], &(cobj->stencilFailOpFront), nullptr);;
        }
        if (argc > 8 && !args[8].isUndefined()) {
            ok &= sevalue_to_native(args[8], &(cobj->stencilZFailOpFront), nullptr);;
        }
        if (argc > 9 && !args[9].isUndefined()) {
            ok &= sevalue_to_native(args[9], &(cobj->stencilPassOpFront), nullptr);;
        }
        if (argc > 10 && !args[10].isUndefined()) {
            ok &= sevalue_to_native(args[10], &(cobj->stencilRefFront), nullptr);;
        }
        if (argc > 11 && !args[11].isUndefined()) {
            ok &= sevalue_to_native(args[11], &(cobj->stencilTestBack), nullptr);;
        }
        if (argc > 12 && !args[12].isUndefined()) {
            ok &= sevalue_to_native(args[12], &(cobj->stencilFuncBack), nullptr);;
        }
        if (argc > 13 && !args[13].isUndefined()) {
            ok &= sevalue_to_native(args[13], &(cobj->stencilReadMaskBack), nullptr);;
        }
        if (argc > 14 && !args[14].isUndefined()) {
            ok &= sevalue_to_native(args[14], &(cobj->stencilWriteMaskBack), nullptr);;
        }
        if (argc > 15 && !args[15].isUndefined()) {
            ok &= sevalue_to_native(args[15], &(cobj->stencilFailOpBack), nullptr);;
        }
        if (argc > 16 && !args[16].isUndefined()) {
            ok &= sevalue_to_native(args[16], &(cobj->stencilZFailOpBack), nullptr);;
        }
        if (argc > 17 && !args[17].isUndefined()) {
            ok &= sevalue_to_native(args[17], &(cobj->stencilPassOpBack), nullptr);;
        }
        if (argc > 18 && !args[18].isUndefined()) {
            ok &= sevalue_to_native(args[18], &(cobj->stencilRefBack), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_DepthStencilState_constructor, __jsb_cc_gfx_DepthStencilState_class, js_cc_gfx_DepthStencilState_finalize)




static bool js_cc_gfx_DepthStencilState_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DepthStencilState* cobj = SE_THIS_OBJECT<cc::gfx::DepthStencilState>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DepthStencilState_finalize)

bool js_register_gfx_DepthStencilState(se::Object* obj)
{
    auto cls = se::Class::create("DepthStencilState", obj, nullptr, _SE(js_gfx_DepthStencilState_constructor));

    cls->defineProperty("depthTest", _SE(js_gfx_DepthStencilState_get_depthTest), _SE(js_gfx_DepthStencilState_set_depthTest));
    cls->defineProperty("depthWrite", _SE(js_gfx_DepthStencilState_get_depthWrite), _SE(js_gfx_DepthStencilState_set_depthWrite));
    cls->defineProperty("depthFunc", _SE(js_gfx_DepthStencilState_get_depthFunc), _SE(js_gfx_DepthStencilState_set_depthFunc));
    cls->defineProperty("stencilTestFront", _SE(js_gfx_DepthStencilState_get_stencilTestFront), _SE(js_gfx_DepthStencilState_set_stencilTestFront));
    cls->defineProperty("stencilFuncFront", _SE(js_gfx_DepthStencilState_get_stencilFuncFront), _SE(js_gfx_DepthStencilState_set_stencilFuncFront));
    cls->defineProperty("stencilReadMaskFront", _SE(js_gfx_DepthStencilState_get_stencilReadMaskFront), _SE(js_gfx_DepthStencilState_set_stencilReadMaskFront));
    cls->defineProperty("stencilWriteMaskFront", _SE(js_gfx_DepthStencilState_get_stencilWriteMaskFront), _SE(js_gfx_DepthStencilState_set_stencilWriteMaskFront));
    cls->defineProperty("stencilFailOpFront", _SE(js_gfx_DepthStencilState_get_stencilFailOpFront), _SE(js_gfx_DepthStencilState_set_stencilFailOpFront));
    cls->defineProperty("stencilZFailOpFront", _SE(js_gfx_DepthStencilState_get_stencilZFailOpFront), _SE(js_gfx_DepthStencilState_set_stencilZFailOpFront));
    cls->defineProperty("stencilPassOpFront", _SE(js_gfx_DepthStencilState_get_stencilPassOpFront), _SE(js_gfx_DepthStencilState_set_stencilPassOpFront));
    cls->defineProperty("stencilRefFront", _SE(js_gfx_DepthStencilState_get_stencilRefFront), _SE(js_gfx_DepthStencilState_set_stencilRefFront));
    cls->defineProperty("stencilTestBack", _SE(js_gfx_DepthStencilState_get_stencilTestBack), _SE(js_gfx_DepthStencilState_set_stencilTestBack));
    cls->defineProperty("stencilFuncBack", _SE(js_gfx_DepthStencilState_get_stencilFuncBack), _SE(js_gfx_DepthStencilState_set_stencilFuncBack));
    cls->defineProperty("stencilReadMaskBack", _SE(js_gfx_DepthStencilState_get_stencilReadMaskBack), _SE(js_gfx_DepthStencilState_set_stencilReadMaskBack));
    cls->defineProperty("stencilWriteMaskBack", _SE(js_gfx_DepthStencilState_get_stencilWriteMaskBack), _SE(js_gfx_DepthStencilState_set_stencilWriteMaskBack));
    cls->defineProperty("stencilFailOpBack", _SE(js_gfx_DepthStencilState_get_stencilFailOpBack), _SE(js_gfx_DepthStencilState_set_stencilFailOpBack));
    cls->defineProperty("stencilZFailOpBack", _SE(js_gfx_DepthStencilState_get_stencilZFailOpBack), _SE(js_gfx_DepthStencilState_set_stencilZFailOpBack));
    cls->defineProperty("stencilPassOpBack", _SE(js_gfx_DepthStencilState_get_stencilPassOpBack), _SE(js_gfx_DepthStencilState_set_stencilPassOpBack));
    cls->defineProperty("stencilRefBack", _SE(js_gfx_DepthStencilState_get_stencilRefBack), _SE(js_gfx_DepthStencilState_set_stencilRefBack));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DepthStencilState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DepthStencilState>(cls);

    __jsb_cc_gfx_DepthStencilState_proto = cls->getProto();
    __jsb_cc_gfx_DepthStencilState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BlendTarget_proto = nullptr;
se::Class* __jsb_cc_gfx_BlendTarget_class = nullptr;

static bool js_gfx_BlendTarget_get_blend(se::State& s)
{
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blend, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blend)

static bool js_gfx_BlendTarget_set_blend(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blend, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blend : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blend)

static bool js_gfx_BlendTarget_get_blendSrc(se::State& s)
{
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendSrc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendSrc, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendSrc)

static bool js_gfx_BlendTarget_set_blendSrc(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendSrc : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendSrc, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendSrc : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendSrc)

static bool js_gfx_BlendTarget_get_blendDst(se::State& s)
{
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendDst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendDst, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendDst)

static bool js_gfx_BlendTarget_set_blendDst(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendDst : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendDst, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendDst : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendDst)

static bool js_gfx_BlendTarget_get_blendEq(se::State& s)
{
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendEq, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendEq)

static bool js_gfx_BlendTarget_set_blendEq(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendEq, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendEq : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendEq)

static bool js_gfx_BlendTarget_get_blendSrcAlpha(se::State& s)
{
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendSrcAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendSrcAlpha, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendSrcAlpha)

static bool js_gfx_BlendTarget_set_blendSrcAlpha(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendSrcAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendSrcAlpha, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendSrcAlpha : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendSrcAlpha)

static bool js_gfx_BlendTarget_get_blendDstAlpha(se::State& s)
{
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendDstAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendDstAlpha, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendDstAlpha)

static bool js_gfx_BlendTarget_set_blendDstAlpha(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendDstAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendDstAlpha, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendDstAlpha : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendDstAlpha)

static bool js_gfx_BlendTarget_get_blendAlphaEq(se::State& s)
{
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendAlphaEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendAlphaEq, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendAlphaEq)

static bool js_gfx_BlendTarget_set_blendAlphaEq(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendAlphaEq : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendAlphaEq, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendAlphaEq : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendAlphaEq)

static bool js_gfx_BlendTarget_get_blendColorMask(se::State& s)
{
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_get_blendColorMask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendColorMask, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendTarget_get_blendColorMask)

static bool js_gfx_BlendTarget_set_blendColorMask(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendTarget_set_blendColorMask : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendColorMask, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BlendTarget_set_blendColorMask : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendTarget_set_blendColorMask)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::BlendTarget * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::BlendTarget*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("blend", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blend), ctx);
    }
    json->getProperty("blendSrc", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendSrc), ctx);
    }
    json->getProperty("blendDst", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendDst), ctx);
    }
    json->getProperty("blendEq", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendEq), ctx);
    }
    json->getProperty("blendSrcAlpha", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendSrcAlpha), ctx);
    }
    json->getProperty("blendDstAlpha", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendDstAlpha), ctx);
    }
    json->getProperty("blendAlphaEq", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendAlphaEq), ctx);
    }
    json->getProperty("blendColorMask", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendColorMask), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BlendTarget_finalize)

static bool js_gfx_BlendTarget_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::BlendTarget* cobj = JSB_ALLOC(cc::gfx::BlendTarget);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BlendTarget* cobj = JSB_ALLOC(cc::gfx::BlendTarget);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::BlendTarget* cobj = JSB_ALLOC(cc::gfx::BlendTarget);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->blend), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->blendSrc), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->blendDst), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->blendEq), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->blendSrcAlpha), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->blendDstAlpha), nullptr);;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            ok &= sevalue_to_native(args[6], &(cobj->blendAlphaEq), nullptr);;
        }
        if (argc > 7 && !args[7].isUndefined()) {
            ok &= sevalue_to_native(args[7], &(cobj->blendColorMask), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_BlendTarget_constructor, __jsb_cc_gfx_BlendTarget_class, js_cc_gfx_BlendTarget_finalize)




static bool js_cc_gfx_BlendTarget_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::BlendTarget>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BlendTarget* cobj = SE_THIS_OBJECT<cc::gfx::BlendTarget>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BlendTarget_finalize)

bool js_register_gfx_BlendTarget(se::Object* obj)
{
    auto cls = se::Class::create("BlendTarget", obj, nullptr, _SE(js_gfx_BlendTarget_constructor));

    cls->defineProperty("blend", _SE(js_gfx_BlendTarget_get_blend), _SE(js_gfx_BlendTarget_set_blend));
    cls->defineProperty("blendSrc", _SE(js_gfx_BlendTarget_get_blendSrc), _SE(js_gfx_BlendTarget_set_blendSrc));
    cls->defineProperty("blendDst", _SE(js_gfx_BlendTarget_get_blendDst), _SE(js_gfx_BlendTarget_set_blendDst));
    cls->defineProperty("blendEq", _SE(js_gfx_BlendTarget_get_blendEq), _SE(js_gfx_BlendTarget_set_blendEq));
    cls->defineProperty("blendSrcAlpha", _SE(js_gfx_BlendTarget_get_blendSrcAlpha), _SE(js_gfx_BlendTarget_set_blendSrcAlpha));
    cls->defineProperty("blendDstAlpha", _SE(js_gfx_BlendTarget_get_blendDstAlpha), _SE(js_gfx_BlendTarget_set_blendDstAlpha));
    cls->defineProperty("blendAlphaEq", _SE(js_gfx_BlendTarget_get_blendAlphaEq), _SE(js_gfx_BlendTarget_set_blendAlphaEq));
    cls->defineProperty("blendColorMask", _SE(js_gfx_BlendTarget_get_blendColorMask), _SE(js_gfx_BlendTarget_set_blendColorMask));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BlendTarget_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BlendTarget>(cls);

    __jsb_cc_gfx_BlendTarget_proto = cls->getProto();
    __jsb_cc_gfx_BlendTarget_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_BlendState_proto = nullptr;
se::Class* __jsb_cc_gfx_BlendState_class = nullptr;

static bool js_gfx_BlendState_get_isA2C(se::State& s)
{
    cc::gfx::BlendState* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_get_isA2C : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isA2C, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendState_get_isA2C)

static bool js_gfx_BlendState_set_isA2C(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendState* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_set_isA2C : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isA2C, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BlendState_set_isA2C : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendState_set_isA2C)

static bool js_gfx_BlendState_get_isIndepend(se::State& s)
{
    cc::gfx::BlendState* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_get_isIndepend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isIndepend, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendState_get_isIndepend)

static bool js_gfx_BlendState_set_isIndepend(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendState* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_set_isIndepend : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isIndepend, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BlendState_set_isIndepend : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendState_set_isIndepend)

static bool js_gfx_BlendState_get_blendColor(se::State& s)
{
    cc::gfx::BlendState* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_get_blendColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendColor, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendState_get_blendColor)

static bool js_gfx_BlendState_set_blendColor(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendState* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_set_blendColor : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendColor, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BlendState_set_blendColor : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendState_set_blendColor)

static bool js_gfx_BlendState_get_targets(se::State& s)
{
    cc::gfx::BlendState* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_get_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->targets, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendState_get_targets)

static bool js_gfx_BlendState_set_targets(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::BlendState* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_BlendState_set_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->targets, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_BlendState_set_targets : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendState_set_targets)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::BlendState * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::BlendState*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("isA2C", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isA2C), ctx);
    }
    json->getProperty("isIndepend", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isIndepend), ctx);
    }
    json->getProperty("blendColor", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendColor), ctx);
    }
    json->getProperty("targets", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->targets), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BlendState_finalize)

static bool js_gfx_BlendState_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::BlendState* cobj = JSB_ALLOC(cc::gfx::BlendState);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BlendState* cobj = JSB_ALLOC(cc::gfx::BlendState);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::BlendState* cobj = JSB_ALLOC(cc::gfx::BlendState);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->isA2C), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->isIndepend), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->blendColor), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->targets), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_BlendState_constructor, __jsb_cc_gfx_BlendState_class, js_cc_gfx_BlendState_finalize)




static bool js_cc_gfx_BlendState_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::BlendState>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BlendState* cobj = SE_THIS_OBJECT<cc::gfx::BlendState>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BlendState_finalize)

bool js_register_gfx_BlendState(se::Object* obj)
{
    auto cls = se::Class::create("BlendState", obj, nullptr, _SE(js_gfx_BlendState_constructor));

    cls->defineProperty("isA2C", _SE(js_gfx_BlendState_get_isA2C), _SE(js_gfx_BlendState_set_isA2C));
    cls->defineProperty("isIndepend", _SE(js_gfx_BlendState_get_isIndepend), _SE(js_gfx_BlendState_set_isIndepend));
    cls->defineProperty("blendColor", _SE(js_gfx_BlendState_get_blendColor), _SE(js_gfx_BlendState_set_blendColor));
    cls->defineProperty("targets", _SE(js_gfx_BlendState_get_targets), _SE(js_gfx_BlendState_set_targets));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_BlendState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BlendState>(cls);

    __jsb_cc_gfx_BlendState_proto = cls->getProto();
    __jsb_cc_gfx_BlendState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_PipelineStateInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_PipelineStateInfo_class = nullptr;

static bool js_gfx_PipelineStateInfo_get_shader(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_shader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->shader, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_shader)

static bool js_gfx_PipelineStateInfo_set_shader(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_shader : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->shader, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_shader : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_shader)

static bool js_gfx_PipelineStateInfo_get_pipelineLayout(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_pipelineLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->pipelineLayout, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_pipelineLayout)

static bool js_gfx_PipelineStateInfo_set_pipelineLayout(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_pipelineLayout : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->pipelineLayout, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_pipelineLayout : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_pipelineLayout)

static bool js_gfx_PipelineStateInfo_get_renderPass(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->renderPass, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_renderPass)

static bool js_gfx_PipelineStateInfo_set_renderPass(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_renderPass : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->renderPass, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_renderPass : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_renderPass)

static bool js_gfx_PipelineStateInfo_get_inputState(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_inputState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->inputState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_inputState)

static bool js_gfx_PipelineStateInfo_set_inputState(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_inputState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->inputState, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_inputState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_inputState)

static bool js_gfx_PipelineStateInfo_get_rasterizerState(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->rasterizerState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_rasterizerState)

static bool js_gfx_PipelineStateInfo_set_rasterizerState(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_rasterizerState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->rasterizerState, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_rasterizerState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_rasterizerState)

static bool js_gfx_PipelineStateInfo_get_depthStencilState(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->depthStencilState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_depthStencilState)

static bool js_gfx_PipelineStateInfo_set_depthStencilState(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_depthStencilState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->depthStencilState, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_depthStencilState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_depthStencilState)

static bool js_gfx_PipelineStateInfo_get_blendState(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->blendState, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_blendState)

static bool js_gfx_PipelineStateInfo_set_blendState(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_blendState : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->blendState, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_blendState : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_blendState)

static bool js_gfx_PipelineStateInfo_get_primitive(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->primitive, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_primitive)

static bool js_gfx_PipelineStateInfo_set_primitive(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_primitive : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->primitive, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_primitive : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_primitive)

static bool js_gfx_PipelineStateInfo_get_dynamicStates(se::State& s)
{
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_get_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->dynamicStates, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_PipelineStateInfo_get_dynamicStates)

static bool js_gfx_PipelineStateInfo_set_dynamicStates(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineStateInfo_set_dynamicStates : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->dynamicStates, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_PipelineStateInfo_set_dynamicStates : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_PipelineStateInfo_set_dynamicStates)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::PipelineStateInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::PipelineStateInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("shader", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->shader), ctx);
    }
    json->getProperty("pipelineLayout", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->pipelineLayout), ctx);
    }
    json->getProperty("renderPass", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->renderPass), ctx);
    }
    json->getProperty("inputState", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->inputState), ctx);
    }
    json->getProperty("rasterizerState", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->rasterizerState), ctx);
    }
    json->getProperty("depthStencilState", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->depthStencilState), ctx);
    }
    json->getProperty("blendState", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->blendState), ctx);
    }
    json->getProperty("primitive", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->primitive), ctx);
    }
    json->getProperty("dynamicStates", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->dynamicStates), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_PipelineStateInfo_finalize)

static bool js_gfx_PipelineStateInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::PipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::PipelineStateInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::PipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::PipelineStateInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::PipelineStateInfo* cobj = JSB_ALLOC(cc::gfx::PipelineStateInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->shader), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->pipelineLayout), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->renderPass), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->inputState), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->rasterizerState), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->depthStencilState), nullptr);;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            ok &= sevalue_to_native(args[6], &(cobj->blendState), nullptr);;
        }
        if (argc > 7 && !args[7].isUndefined()) {
            ok &= sevalue_to_native(args[7], &(cobj->primitive), nullptr);;
        }
        if (argc > 8 && !args[8].isUndefined()) {
            ok &= sevalue_to_native(args[8], &(cobj->dynamicStates), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_PipelineStateInfo_constructor, __jsb_cc_gfx_PipelineStateInfo_class, js_cc_gfx_PipelineStateInfo_finalize)




static bool js_cc_gfx_PipelineStateInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::PipelineStateInfo* cobj = SE_THIS_OBJECT<cc::gfx::PipelineStateInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_PipelineStateInfo_finalize)

bool js_register_gfx_PipelineStateInfo(se::Object* obj)
{
    auto cls = se::Class::create("PipelineStateInfo", obj, nullptr, _SE(js_gfx_PipelineStateInfo_constructor));

    cls->defineProperty("shader", _SE(js_gfx_PipelineStateInfo_get_shader), _SE(js_gfx_PipelineStateInfo_set_shader));
    cls->defineProperty("pipelineLayout", _SE(js_gfx_PipelineStateInfo_get_pipelineLayout), _SE(js_gfx_PipelineStateInfo_set_pipelineLayout));
    cls->defineProperty("renderPass", _SE(js_gfx_PipelineStateInfo_get_renderPass), _SE(js_gfx_PipelineStateInfo_set_renderPass));
    cls->defineProperty("inputState", _SE(js_gfx_PipelineStateInfo_get_inputState), _SE(js_gfx_PipelineStateInfo_set_inputState));
    cls->defineProperty("rasterizerState", _SE(js_gfx_PipelineStateInfo_get_rasterizerState), _SE(js_gfx_PipelineStateInfo_set_rasterizerState));
    cls->defineProperty("depthStencilState", _SE(js_gfx_PipelineStateInfo_get_depthStencilState), _SE(js_gfx_PipelineStateInfo_set_depthStencilState));
    cls->defineProperty("blendState", _SE(js_gfx_PipelineStateInfo_get_blendState), _SE(js_gfx_PipelineStateInfo_set_blendState));
    cls->defineProperty("primitive", _SE(js_gfx_PipelineStateInfo_get_primitive), _SE(js_gfx_PipelineStateInfo_set_primitive));
    cls->defineProperty("dynamicStates", _SE(js_gfx_PipelineStateInfo_get_dynamicStates), _SE(js_gfx_PipelineStateInfo_set_dynamicStates));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_PipelineStateInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::PipelineStateInfo>(cls);

    __jsb_cc_gfx_PipelineStateInfo_proto = cls->getProto();
    __jsb_cc_gfx_PipelineStateInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_FormatInfo_proto = nullptr;
se::Class* __jsb_cc_gfx_FormatInfo_class = nullptr;

static bool js_gfx_FormatInfo_get_name(se::State& s)
{
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->name, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_name)

static bool js_gfx_FormatInfo_set_name(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_name : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->name, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_name : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_name)

static bool js_gfx_FormatInfo_get_size(se::State& s)
{
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->size, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_size)

static bool js_gfx_FormatInfo_set_size(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_size : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->size, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_size : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_size)

static bool js_gfx_FormatInfo_get_count(se::State& s)
{
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->count, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_count)

static bool js_gfx_FormatInfo_set_count(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_count : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->count, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_count : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_count)

static bool js_gfx_FormatInfo_get_type(se::State& s)
{
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->type, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_type)

static bool js_gfx_FormatInfo_set_type(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_type : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->type, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_type : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_type)

static bool js_gfx_FormatInfo_get_hasAlpha(se::State& s)
{
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_hasAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->hasAlpha, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_hasAlpha)

static bool js_gfx_FormatInfo_set_hasAlpha(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_hasAlpha : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->hasAlpha, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_hasAlpha : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_hasAlpha)

static bool js_gfx_FormatInfo_get_hasDepth(se::State& s)
{
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_hasDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->hasDepth, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_hasDepth)

static bool js_gfx_FormatInfo_set_hasDepth(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_hasDepth : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->hasDepth, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_hasDepth : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_hasDepth)

static bool js_gfx_FormatInfo_get_hasStencil(se::State& s)
{
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_hasStencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->hasStencil, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_hasStencil)

static bool js_gfx_FormatInfo_set_hasStencil(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_hasStencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->hasStencil, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_hasStencil : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_hasStencil)

static bool js_gfx_FormatInfo_get_isCompressed(se::State& s)
{
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_get_isCompressed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->isCompressed, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_FormatInfo_get_isCompressed)

static bool js_gfx_FormatInfo_set_isCompressed(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_FormatInfo_set_isCompressed : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->isCompressed, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_FormatInfo_set_isCompressed : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_FormatInfo_set_isCompressed)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::FormatInfo * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::FormatInfo*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("name", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    json->getProperty("size", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->size), ctx);
    }
    json->getProperty("count", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    json->getProperty("type", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    json->getProperty("hasAlpha", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->hasAlpha), ctx);
    }
    json->getProperty("hasDepth", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->hasDepth), ctx);
    }
    json->getProperty("hasStencil", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->hasStencil), ctx);
    }
    json->getProperty("isCompressed", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->isCompressed), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_FormatInfo_finalize)

static bool js_gfx_FormatInfo_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::FormatInfo* cobj = JSB_ALLOC(cc::gfx::FormatInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::FormatInfo* cobj = JSB_ALLOC(cc::gfx::FormatInfo);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::FormatInfo* cobj = JSB_ALLOC(cc::gfx::FormatInfo);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->name), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->size), nullptr);;
        }
        if (argc > 2 && !args[2].isUndefined()) {
            ok &= sevalue_to_native(args[2], &(cobj->count), nullptr);;
        }
        if (argc > 3 && !args[3].isUndefined()) {
            ok &= sevalue_to_native(args[3], &(cobj->type), nullptr);;
        }
        if (argc > 4 && !args[4].isUndefined()) {
            ok &= sevalue_to_native(args[4], &(cobj->hasAlpha), nullptr);;
        }
        if (argc > 5 && !args[5].isUndefined()) {
            ok &= sevalue_to_native(args[5], &(cobj->hasDepth), nullptr);;
        }
        if (argc > 6 && !args[6].isUndefined()) {
            ok &= sevalue_to_native(args[6], &(cobj->hasStencil), nullptr);;
        }
        if (argc > 7 && !args[7].isUndefined()) {
            ok &= sevalue_to_native(args[7], &(cobj->isCompressed), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_FormatInfo_constructor, __jsb_cc_gfx_FormatInfo_class, js_cc_gfx_FormatInfo_finalize)




static bool js_cc_gfx_FormatInfo_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::FormatInfo>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::FormatInfo* cobj = SE_THIS_OBJECT<cc::gfx::FormatInfo>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_FormatInfo_finalize)

bool js_register_gfx_FormatInfo(se::Object* obj)
{
    auto cls = se::Class::create("FormatInfo", obj, nullptr, _SE(js_gfx_FormatInfo_constructor));

    cls->defineProperty("name", _SE(js_gfx_FormatInfo_get_name), _SE(js_gfx_FormatInfo_set_name));
    cls->defineProperty("size", _SE(js_gfx_FormatInfo_get_size), _SE(js_gfx_FormatInfo_set_size));
    cls->defineProperty("count", _SE(js_gfx_FormatInfo_get_count), _SE(js_gfx_FormatInfo_set_count));
    cls->defineProperty("type", _SE(js_gfx_FormatInfo_get_type), _SE(js_gfx_FormatInfo_set_type));
    cls->defineProperty("hasAlpha", _SE(js_gfx_FormatInfo_get_hasAlpha), _SE(js_gfx_FormatInfo_set_hasAlpha));
    cls->defineProperty("hasDepth", _SE(js_gfx_FormatInfo_get_hasDepth), _SE(js_gfx_FormatInfo_set_hasDepth));
    cls->defineProperty("hasStencil", _SE(js_gfx_FormatInfo_get_hasStencil), _SE(js_gfx_FormatInfo_set_hasStencil));
    cls->defineProperty("isCompressed", _SE(js_gfx_FormatInfo_get_isCompressed), _SE(js_gfx_FormatInfo_set_isCompressed));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_FormatInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::FormatInfo>(cls);

    __jsb_cc_gfx_FormatInfo_proto = cls->getProto();
    __jsb_cc_gfx_FormatInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_MemoryStatus_proto = nullptr;
se::Class* __jsb_cc_gfx_MemoryStatus_class = nullptr;

static bool js_gfx_MemoryStatus_get_bufferSize(se::State& s)
{
    cc::gfx::MemoryStatus* cobj = SE_THIS_OBJECT<cc::gfx::MemoryStatus>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_MemoryStatus_get_bufferSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->bufferSize, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_MemoryStatus_get_bufferSize)

static bool js_gfx_MemoryStatus_set_bufferSize(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::MemoryStatus* cobj = SE_THIS_OBJECT<cc::gfx::MemoryStatus>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_MemoryStatus_set_bufferSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->bufferSize, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_MemoryStatus_set_bufferSize : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_MemoryStatus_set_bufferSize)

static bool js_gfx_MemoryStatus_get_textureSize(se::State& s)
{
    cc::gfx::MemoryStatus* cobj = SE_THIS_OBJECT<cc::gfx::MemoryStatus>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_MemoryStatus_get_textureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->textureSize, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_MemoryStatus_get_textureSize)

static bool js_gfx_MemoryStatus_set_textureSize(se::State& s)
{
    const auto& args = s.args();
    cc::gfx::MemoryStatus* cobj = SE_THIS_OBJECT<cc::gfx::MemoryStatus>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_MemoryStatus_set_textureSize : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->textureSize, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_MemoryStatus_set_textureSize : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_MemoryStatus_set_textureSize)


template<>
bool sevalue_to_native(const se::Value &from, cc::gfx::MemoryStatus * to, se::Object *ctx)
{
    assert(from.isObject());
    se::Object *json = from.toObject();
    auto* data = (cc::gfx::MemoryStatus*)json->getPrivateData();
    if (data) {
        *to = *data;
        return true;
    }
    se::Value field;
    bool ok = true;
    json->getProperty("bufferSize", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->bufferSize), ctx);
    }
    json->getProperty("textureSize", &field);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->textureSize), ctx);
    }
    return ok;
}

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_MemoryStatus_finalize)

static bool js_gfx_MemoryStatus_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();

    if(argc == 0) 
    {
        cc::gfx::MemoryStatus* cobj = JSB_ALLOC(cc::gfx::MemoryStatus);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else if(argc == 1 && args[0].isObject())
    {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::MemoryStatus* cobj = JSB_ALLOC(cc::gfx::MemoryStatus);
        ok &= sevalue_to_native(args[0], cobj, s.thisObject());
        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }
    else
    {
        cc::gfx::MemoryStatus* cobj = JSB_ALLOC(cc::gfx::MemoryStatus);
        if (argc > 0 && !args[0].isUndefined()) {
            ok &= sevalue_to_native(args[0], &(cobj->bufferSize), nullptr);;
        }
        if (argc > 1 && !args[1].isUndefined()) {
            ok &= sevalue_to_native(args[1], &(cobj->textureSize), nullptr);;
        }

        if(!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_MemoryStatus_constructor, __jsb_cc_gfx_MemoryStatus_class, js_cc_gfx_MemoryStatus_finalize)




static bool js_cc_gfx_MemoryStatus_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::MemoryStatus>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::MemoryStatus* cobj = SE_THIS_OBJECT<cc::gfx::MemoryStatus>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_MemoryStatus_finalize)

bool js_register_gfx_MemoryStatus(se::Object* obj)
{
    auto cls = se::Class::create("MemoryStatus", obj, nullptr, _SE(js_gfx_MemoryStatus_constructor));

    cls->defineProperty("bufferSize", _SE(js_gfx_MemoryStatus_get_bufferSize), _SE(js_gfx_MemoryStatus_set_bufferSize));
    cls->defineProperty("textureSize", _SE(js_gfx_MemoryStatus_get_textureSize), _SE(js_gfx_MemoryStatus_set_textureSize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_MemoryStatus_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::MemoryStatus>(cls);

    __jsb_cc_gfx_MemoryStatus_proto = cls->getProto();
    __jsb_cc_gfx_MemoryStatus_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_GFXObject_proto = nullptr;
se::Class* __jsb_cc_gfx_GFXObject_class = nullptr;

static bool js_gfx_GFXObject_getType(se::State& s)
{
    cc::gfx::GFXObject* cobj = SE_THIS_OBJECT<cc::gfx::GFXObject>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXObject_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXObject_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_GFXObject_getType)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_GFXObject_finalize)

static bool js_gfx_GFXObject_constructor(se::State& s) // constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    cc::gfx::ObjectType arg0;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
    SE_PRECONDITION2(ok, false, "js_gfx_GFXObject_constructor : Error processing arguments");
    cc::gfx::GFXObject* cobj = JSB_ALLOC(cc::gfx::GFXObject, arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_gfx_GFXObject_constructor, __jsb_cc_gfx_GFXObject_class, js_cc_gfx_GFXObject_finalize)




static bool js_cc_gfx_GFXObject_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::GFXObject>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::GFXObject* cobj = SE_THIS_OBJECT<cc::gfx::GFXObject>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_GFXObject_finalize)

bool js_register_gfx_GFXObject(se::Object* obj)
{
    auto cls = se::Class::create("GFXObject", obj, nullptr, _SE(js_gfx_GFXObject_constructor));

    cls->defineProperty("gfxType", _SE(js_gfx_GFXObject_getType), nullptr);
    cls->defineFinalizeFunction(_SE(js_cc_gfx_GFXObject_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::GFXObject>(cls);

    __jsb_cc_gfx_GFXObject_proto = cls->getProto();
    __jsb_cc_gfx_GFXObject_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Device_proto = nullptr;
se::Class* __jsb_cc_gfx_Device_class = nullptr;

static bool js_gfx_Device_getMaxUniformBlockSize(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxUniformBlockSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxUniformBlockSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxUniformBlockSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxUniformBlockSize)

static bool js_gfx_Device_getMaxVertexTextureUnits(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxVertexTextureUnits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxVertexTextureUnits();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxVertexTextureUnits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxVertexTextureUnits)

static bool js_gfx_Device_getMaxVertexUniformVectors(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxVertexUniformVectors : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxVertexUniformVectors();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxVertexUniformVectors : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxVertexUniformVectors)

static bool js_gfx_Device_getGfxAPI(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getGfxAPI : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getGfxAPI();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getGfxAPI : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getGfxAPI)

static bool js_gfx_Device_getVendor(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getVendor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getVendor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getVendor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getVendor)

static bool js_gfx_Device_hasFeature(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_hasFeature : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Feature, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_hasFeature : Error processing arguments");
        bool result = cobj->hasFeature(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_hasFeature : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_hasFeature)

static bool js_gfx_Device_createFence(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createFence : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::FenceInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createFence : Error processing arguments");
        cc::gfx::Fence* result = cobj->createFence(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createFence : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createFence)

static bool js_gfx_Device_getContext(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getContext : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Context* result = cobj->getContext();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getContext : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getContext)

static bool js_gfx_Device_getWidth(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getWidth)

static bool js_gfx_Device_getScreenSpaceSignY(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getScreenSpaceSignY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScreenSpaceSignY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getScreenSpaceSignY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getScreenSpaceSignY)

static bool js_gfx_Device_getQueue(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Queue* result = cobj->getQueue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getQueue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getQueue)

static bool js_gfx_Device_createDescriptorSetLayout(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createDescriptorSetLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DescriptorSetLayoutInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createDescriptorSetLayout : Error processing arguments");
        cc::gfx::DescriptorSetLayout* result = cobj->createDescriptorSetLayout(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createDescriptorSetLayout : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createDescriptorSetLayout)

static bool js_gfx_Device_getMaxVertexAttributes(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxVertexAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxVertexAttributes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxVertexAttributes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxVertexAttributes)

static bool js_gfx_Device_getDepthStencilFormat(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getDepthStencilFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getDepthStencilFormat();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getDepthStencilFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getDepthStencilFormat)

static bool js_gfx_Device_getNumTris(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNumTris : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumTris();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNumTris : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNumTris)

static bool js_gfx_Device_getRenderer(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getRenderer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getRenderer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getRenderer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getRenderer)

static bool js_gfx_Device_getStencilBits(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getStencilBits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getStencilBits();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getStencilBits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getStencilBits)

static bool js_gfx_Device_getDeviceName(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getDeviceName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getDeviceName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getDeviceName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getDeviceName)

static bool js_gfx_Device_getNumInstances(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNumInstances : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumInstances();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNumInstances : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNumInstances)

static bool js_gfx_Device_getHeight(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getHeight)

static bool js_gfx_Device_createCommandBuffer(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::CommandBufferInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createCommandBuffer : Error processing arguments");
        cc::gfx::CommandBuffer* result = cobj->createCommandBuffer(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createCommandBuffer : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createCommandBuffer)

static bool js_gfx_Device_createPipelineState(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PipelineStateInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createPipelineState : Error processing arguments");
        cc::gfx::PipelineState* result = cobj->createPipelineState(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createPipelineState : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createPipelineState)

static bool js_gfx_Device_createDescriptorSet(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DescriptorSetInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createDescriptorSet : Error processing arguments");
        cc::gfx::DescriptorSet* result = cobj->createDescriptorSet(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createDescriptorSet : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createDescriptorSet)

static bool js_gfx_Device_present(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_present)

static bool js_gfx_Device_destroy(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_destroy)

static bool js_gfx_Device_getColorFormat(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getColorFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getColorFormat();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getColorFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getColorFormat)

static bool js_gfx_Device_createFramebuffer(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createFramebuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::FramebufferInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createFramebuffer : Error processing arguments");
        cc::gfx::Framebuffer* result = cobj->createFramebuffer(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createFramebuffer : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createFramebuffer)

static bool js_gfx_Device_getMaxTextureSize(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxTextureSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxTextureSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxTextureSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxTextureSize)

static bool js_gfx_Device_createRenderPass(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::RenderPassInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createRenderPass : Error processing arguments");
        cc::gfx::RenderPass* result = cobj->createRenderPass(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createRenderPass : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createRenderPass)

static bool js_gfx_Device_createPipelineLayout(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createPipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PipelineLayoutInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createPipelineLayout : Error processing arguments");
        cc::gfx::PipelineLayout* result = cobj->createPipelineLayout(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createPipelineLayout : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createPipelineLayout)

static bool js_gfx_Device_acquire(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_acquire : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->acquire();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_acquire)

static bool js_gfx_Device_getMaxCubeMapTextureSize(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxCubeMapTextureSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxCubeMapTextureSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxCubeMapTextureSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxCubeMapTextureSize)

static bool js_gfx_Device_getShaderIdGen(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getShaderIdGen : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getShaderIdGen();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getShaderIdGen : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getShaderIdGen)

static bool js_gfx_Device_getMaxUniformBufferBindings(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxUniformBufferBindings : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxUniformBufferBindings();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxUniformBufferBindings : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxUniformBufferBindings)

static bool js_gfx_Device_createShader(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::ShaderInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createShader : Error processing arguments");
        cc::gfx::Shader* result = cobj->createShader(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createShader : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createShader)

static bool js_gfx_Device_createInputAssembler(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::InputAssemblerInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createInputAssembler : Error processing arguments");
        cc::gfx::InputAssembler* result = cobj->createInputAssembler(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createInputAssembler : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createInputAssembler)

static bool js_gfx_Device_defineMacro(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_defineMacro : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::String, true> arg0 = {};
        HolderType<cc::String, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_defineMacro : Error processing arguments");
        cobj->defineMacro(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_defineMacro)

static bool js_gfx_Device_createSampler(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::SamplerInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createSampler : Error processing arguments");
        cc::gfx::Sampler* result = cobj->createSampler(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createSampler : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createSampler)

static bool js_gfx_Device_getNativeHeight(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNativeHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNativeHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNativeHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNativeHeight)

static bool js_gfx_Device_initialize(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DeviceInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_initialize)

static bool js_gfx_Device_resize(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_resize : Error processing arguments");
        cobj->resize(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_resize)

static bool js_gfx_Device_getSurfaceTransform(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getSurfaceTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getSurfaceTransform();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getSurfaceTransform : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getSurfaceTransform)

static bool js_gfx_Device_genShaderId(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_genShaderId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->genShaderId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_genShaderId : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_genShaderId)

static bool js_gfx_Device_createQueue(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::QueueInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createQueue : Error processing arguments");
        cc::gfx::Queue* result = cobj->createQueue(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createQueue : Error processing arguments");
        se::NonRefNativePtrCreatedByCtorMap::emplace(result);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createQueue)

static bool js_gfx_Device_getDepthBits(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getDepthBits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getDepthBits();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getDepthBits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getDepthBits)

static bool js_gfx_Device_bindingMappingInfo(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_bindingMappingInfo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::BindingMappingInfo& result = cobj->bindingMappingInfo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_bindingMappingInfo : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_bindingMappingInfo)

static bool js_gfx_Device_getMemoryStatus(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMemoryStatus : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::MemoryStatus& result = cobj->getMemoryStatus();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMemoryStatus : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMemoryStatus)

static bool js_gfx_Device_getMaxFragmentUniformVectors(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxFragmentUniformVectors : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxFragmentUniformVectors();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxFragmentUniformVectors : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxFragmentUniformVectors)

static bool js_gfx_Device_getMaxTextureUnits(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getMaxTextureUnits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getMaxTextureUnits();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getMaxTextureUnits : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getMaxTextureUnits)

static bool js_gfx_Device_getClipSpaceMinZ(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getClipSpaceMinZ : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getClipSpaceMinZ();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getClipSpaceMinZ : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getClipSpaceMinZ)

static bool js_gfx_Device_getUboOffsetAlignment(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getUboOffsetAlignment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getUboOffsetAlignment();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getUboOffsetAlignment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_getUboOffsetAlignment)

static bool js_gfx_Device_getUVSpaceSignY(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getUVSpaceSignY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getUVSpaceSignY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getUVSpaceSignY : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getUVSpaceSignY)

static bool js_gfx_Device_getCommandBuffer(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getCommandBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::CommandBuffer* result = cobj->getCommandBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getCommandBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getCommandBuffer)

static bool js_gfx_Device_getNativeWidth(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNativeWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNativeWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNativeWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNativeWidth)

static bool js_gfx_Device_getNumDrawCalls(se::State& s)
{
    cc::gfx::Device* cobj = SE_THIS_OBJECT<cc::gfx::Device>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_getNumDrawCalls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumDrawCalls();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_getNumDrawCalls : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Device_getNumDrawCalls)




bool js_register_gfx_Device(se::Object* obj)
{
    auto cls = se::Class::create("GFXDevice", obj, nullptr, nullptr);

    cls->defineProperty("deviceName", _SE(js_gfx_Device_getDeviceName), nullptr);
    cls->defineProperty("clipSpaceMinZ", _SE(js_gfx_Device_getClipSpaceMinZ), nullptr);
    cls->defineProperty("numInstances", _SE(js_gfx_Device_getNumInstances), nullptr);
    cls->defineProperty("maxTextureUnits", _SE(js_gfx_Device_getMaxTextureUnits), nullptr);
    cls->defineProperty("height", _SE(js_gfx_Device_getHeight), nullptr);
    cls->defineProperty("shaderIdGen", _SE(js_gfx_Device_getShaderIdGen), nullptr);
    cls->defineProperty("renderer", _SE(js_gfx_Device_getRenderer), nullptr);
    cls->defineProperty("maxUniformBufferBindings", _SE(js_gfx_Device_getMaxUniformBufferBindings), nullptr);
    cls->defineProperty("UVSpaceSignY", _SE(js_gfx_Device_getUVSpaceSignY), nullptr);
    cls->defineProperty("commandBuffer", _SE(js_gfx_Device_getCommandBuffer), nullptr);
    cls->defineProperty("vendor", _SE(js_gfx_Device_getVendor), nullptr);
    cls->defineProperty("depthBits", _SE(js_gfx_Device_getDepthBits), nullptr);
    cls->defineProperty("maxFragmentUniformVectors", _SE(js_gfx_Device_getMaxFragmentUniformVectors), nullptr);
    cls->defineProperty("maxVertexAttributes", _SE(js_gfx_Device_getMaxVertexAttributes), nullptr);
    cls->defineProperty("width", _SE(js_gfx_Device_getWidth), nullptr);
    cls->defineProperty("maxVertexUniformVectors", _SE(js_gfx_Device_getMaxVertexUniformVectors), nullptr);
    cls->defineProperty("maxCubeMapTextureSize", _SE(js_gfx_Device_getMaxCubeMapTextureSize), nullptr);
    cls->defineProperty("maxVertexTextureUnits", _SE(js_gfx_Device_getMaxVertexTextureUnits), nullptr);
    cls->defineProperty("nativeWidth", _SE(js_gfx_Device_getNativeWidth), nullptr);
    cls->defineProperty("numDrawCalls", _SE(js_gfx_Device_getNumDrawCalls), nullptr);
    cls->defineProperty("memoryStatus", _SE(js_gfx_Device_getMemoryStatus), nullptr);
    cls->defineProperty("gfxAPI", _SE(js_gfx_Device_getGfxAPI), nullptr);
    cls->defineProperty("maxUniformBlockSize", _SE(js_gfx_Device_getMaxUniformBlockSize), nullptr);
    cls->defineProperty("surfaceTransform", _SE(js_gfx_Device_getSurfaceTransform), nullptr);
    cls->defineProperty("maxTextureSize", _SE(js_gfx_Device_getMaxTextureSize), nullptr);
    cls->defineProperty("nativeHeight", _SE(js_gfx_Device_getNativeHeight), nullptr);
    cls->defineProperty("depthStencilFormat", _SE(js_gfx_Device_getDepthStencilFormat), nullptr);
    cls->defineProperty("numTris", _SE(js_gfx_Device_getNumTris), nullptr);
    cls->defineProperty("screenSpaceSignY", _SE(js_gfx_Device_getScreenSpaceSignY), nullptr);
    cls->defineProperty("stencilBits", _SE(js_gfx_Device_getStencilBits), nullptr);
    cls->defineProperty("queue", _SE(js_gfx_Device_getQueue), nullptr);
    cls->defineProperty("context", _SE(js_gfx_Device_getContext), nullptr);
    cls->defineProperty("colorFormat", _SE(js_gfx_Device_getColorFormat), nullptr);
    cls->defineFunction("hasFeature", _SE(js_gfx_Device_hasFeature));
    cls->defineFunction("createFence", _SE(js_gfx_Device_createFence));
    cls->defineFunction("createDescriptorSetLayout", _SE(js_gfx_Device_createDescriptorSetLayout));
    cls->defineFunction("createCommandBuffer", _SE(js_gfx_Device_createCommandBuffer));
    cls->defineFunction("createPipelineState", _SE(js_gfx_Device_createPipelineState));
    cls->defineFunction("createDescriptorSet", _SE(js_gfx_Device_createDescriptorSet));
    cls->defineFunction("present", _SE(js_gfx_Device_present));
    cls->defineFunction("destroy", _SE(js_gfx_Device_destroy));
    cls->defineFunction("createFramebuffer", _SE(js_gfx_Device_createFramebuffer));
    cls->defineFunction("createRenderPass", _SE(js_gfx_Device_createRenderPass));
    cls->defineFunction("createPipelineLayout", _SE(js_gfx_Device_createPipelineLayout));
    cls->defineFunction("acquire", _SE(js_gfx_Device_acquire));
    cls->defineFunction("createShader", _SE(js_gfx_Device_createShader));
    cls->defineFunction("createInputAssembler", _SE(js_gfx_Device_createInputAssembler));
    cls->defineFunction("defineMacro", _SE(js_gfx_Device_defineMacro));
    cls->defineFunction("createSampler", _SE(js_gfx_Device_createSampler));
    cls->defineFunction("initialize", _SE(js_gfx_Device_initialize));
    cls->defineFunction("resize", _SE(js_gfx_Device_resize));
    cls->defineFunction("genShaderId", _SE(js_gfx_Device_genShaderId));
    cls->defineFunction("createQueue", _SE(js_gfx_Device_createQueue));
    cls->defineFunction("bindingMappingInfo", _SE(js_gfx_Device_bindingMappingInfo));
    cls->defineFunction("getUboOffsetAlignment", _SE(js_gfx_Device_getUboOffsetAlignment));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Device>(cls);

    __jsb_cc_gfx_Device_proto = cls->getProto();
    __jsb_cc_gfx_Device_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Context_proto = nullptr;
se::Class* __jsb_cc_gfx_Context_class = nullptr;

static bool js_gfx_Context_getSharedContext(se::State& s)
{
    cc::gfx::Context* cobj = SE_THIS_OBJECT<cc::gfx::Context>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Context_getSharedContext : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Context* result = cobj->getSharedContext();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Context_getSharedContext : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Context_getSharedContext)

static bool js_gfx_Context_getDepthStencilFormat(se::State& s)
{
    cc::gfx::Context* cobj = SE_THIS_OBJECT<cc::gfx::Context>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Context_getDepthStencilFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getDepthStencilFormat();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Context_getDepthStencilFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Context_getDepthStencilFormat)

static bool js_gfx_Context_getColorFormat(se::State& s)
{
    cc::gfx::Context* cobj = SE_THIS_OBJECT<cc::gfx::Context>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Context_getColorFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getColorFormat();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Context_getColorFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Context_getColorFormat)

static bool js_gfx_Context_getVsyncMode(se::State& s)
{
    cc::gfx::Context* cobj = SE_THIS_OBJECT<cc::gfx::Context>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Context_getVsyncMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getVsyncMode();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Context_getVsyncMode : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Context_getVsyncMode)

static bool js_gfx_Context_initialize(se::State& s)
{
    cc::gfx::Context* cobj = SE_THIS_OBJECT<cc::gfx::Context>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Context_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::ContextInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Context_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Context_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Context_initialize)

static bool js_gfx_Context_destroy(se::State& s)
{
    cc::gfx::Context* cobj = SE_THIS_OBJECT<cc::gfx::Context>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Context_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Context_destroy)

static bool js_gfx_Context_getDevice(se::State& s)
{
    cc::gfx::Context* cobj = SE_THIS_OBJECT<cc::gfx::Context>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Context_getDevice : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Device* result = cobj->getDevice();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Context_getDevice : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Context_getDevice)

static bool js_gfx_Context_present(se::State& s)
{
    cc::gfx::Context* cobj = SE_THIS_OBJECT<cc::gfx::Context>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Context_present : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->present();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Context_present)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Context_finalize)

static bool js_gfx_Context_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::Context: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Context constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Context_constructor, __jsb_cc_gfx_Context_class, js_cc_gfx_Context_finalize)




static bool js_cc_gfx_Context_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Context>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Context* cobj = SE_THIS_OBJECT<cc::gfx::Context>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Context_finalize)

bool js_register_gfx_Context(se::Object* obj)
{
    auto cls = se::Class::create("Context", obj, nullptr, _SE(js_gfx_Context_constructor));

    cls->defineProperty("sharedContext", _SE(js_gfx_Context_getSharedContext), nullptr);
    cls->defineProperty("vsyncMode", _SE(js_gfx_Context_getVsyncMode), nullptr);
    cls->defineProperty("colorFormat", _SE(js_gfx_Context_getColorFormat), nullptr);
    cls->defineProperty("depthStencilFormat", _SE(js_gfx_Context_getDepthStencilFormat), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_Context_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_Context_destroy));
    cls->defineFunction("getDevice", _SE(js_gfx_Context_getDevice));
    cls->defineFunction("present", _SE(js_gfx_Context_present));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Context_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Context>(cls);

    __jsb_cc_gfx_Context_proto = cls->getProto();
    __jsb_cc_gfx_Context_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Buffer_proto = nullptr;
se::Class* __jsb_cc_gfx_Buffer_class = nullptr;

static bool js_gfx_Buffer_getUsage(se::State& s)
{
    cc::gfx::Buffer* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getUsage();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getUsage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getUsage)

static bool js_gfx_Buffer_getMemUsage(se::State& s)
{
    cc::gfx::Buffer* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getMemUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMemUsage();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getMemUsage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getMemUsage)

static bool js_gfx_Buffer_getSize(se::State& s)
{
    cc::gfx::Buffer* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getSize)

static bool js_gfx_Buffer_getCount(se::State& s)
{
    cc::gfx::Buffer* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getCount)

static bool js_gfx_Buffer_destroy(se::State& s)
{
    cc::gfx::Buffer* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Buffer_destroy)

static bool js_gfx_Buffer_getStride(se::State& s)
{
    cc::gfx::Buffer* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getStride : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getStride();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getStride : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getStride)

static bool js_gfx_Buffer_getFlags(se::State& s)
{
    cc::gfx::Buffer* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_getFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getFlags();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_getFlags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Buffer_getFlags)

static bool js_gfx_Buffer_resize(se::State& s)
{
    cc::gfx::Buffer* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_resize : Error processing arguments");
        cobj->resize(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Buffer_resize)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Buffer_finalize)

static bool js_gfx_Buffer_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::Buffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Buffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Buffer_constructor, __jsb_cc_gfx_Buffer_class, js_cc_gfx_Buffer_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Buffer_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Buffer>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Buffer* cobj = SE_THIS_OBJECT<cc::gfx::Buffer>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Buffer_finalize)

bool js_register_gfx_Buffer(se::Object* obj)
{
    auto cls = se::Class::create("Buffer", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Buffer_constructor));

    cls->defineProperty("count", _SE(js_gfx_Buffer_getCount), nullptr);
    cls->defineProperty("memUsage", _SE(js_gfx_Buffer_getMemUsage), nullptr);
    cls->defineProperty("stride", _SE(js_gfx_Buffer_getStride), nullptr);
    cls->defineProperty("flags", _SE(js_gfx_Buffer_getFlags), nullptr);
    cls->defineProperty("usage", _SE(js_gfx_Buffer_getUsage), nullptr);
    cls->defineProperty("size", _SE(js_gfx_Buffer_getSize), nullptr);
    cls->defineFunction("destroy", _SE(js_gfx_Buffer_destroy));
    cls->defineFunction("resize", _SE(js_gfx_Buffer_resize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Buffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Buffer>(cls);

    __jsb_cc_gfx_Buffer_proto = cls->getProto();
    __jsb_cc_gfx_Buffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Texture_proto = nullptr;
se::Class* __jsb_cc_gfx_Texture_class = nullptr;

static bool js_gfx_Texture_getSize(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getSize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getSize();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getSize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getSize)

static bool js_gfx_Texture_getDepth(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getDepth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getDepth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getDepth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getDepth)

static bool js_gfx_Texture_getFlags(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getFlags();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getFlags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getFlags)

static bool js_gfx_Texture_getType(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getType)

static bool js_gfx_Texture_getHeight(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getHeight)

static bool js_gfx_Texture_getBuffer(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned char* result = cobj->getBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getBuffer)

static bool js_gfx_Texture_getWidth(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getWidth)

static bool js_gfx_Texture_getLevelCount(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getLevelCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getLevelCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getLevelCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getLevelCount)

static bool js_gfx_Texture_getUsage(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getUsage : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getUsage();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getUsage : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getUsage)

static bool js_gfx_Texture_destroy(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Texture_destroy)

static bool js_gfx_Texture_getSamples(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getSamples : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getSamples();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getSamples : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getSamples)

static bool js_gfx_Texture_getFormat(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getFormat : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getFormat();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getFormat : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getFormat)

static bool js_gfx_Texture_getLayerCount(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_getLayerCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getLayerCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_getLayerCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Texture_getLayerCount)

static bool js_gfx_Texture_resize(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_resize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_resize : Error processing arguments");
        cobj->resize(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_Texture_resize)

static bool js_gfx_Texture_isTextureView(se::State& s)
{
    cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_isTextureView : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isTextureView();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_isTextureView : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Texture_isTextureView)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Texture_finalize)

static bool js_gfx_Texture_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::Texture: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Texture constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Texture_constructor, __jsb_cc_gfx_Texture_class, js_cc_gfx_Texture_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Texture_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Texture>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Texture* cobj = SE_THIS_OBJECT<cc::gfx::Texture>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Texture_finalize)

bool js_register_gfx_Texture(se::Object* obj)
{
    auto cls = se::Class::create("Texture", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Texture_constructor));

    cls->defineProperty("samples", _SE(js_gfx_Texture_getSamples), nullptr);
    cls->defineProperty("format", _SE(js_gfx_Texture_getFormat), nullptr);
    cls->defineProperty("buffer", _SE(js_gfx_Texture_getBuffer), nullptr);
    cls->defineProperty("levelCount", _SE(js_gfx_Texture_getLevelCount), nullptr);
    cls->defineProperty("height", _SE(js_gfx_Texture_getHeight), nullptr);
    cls->defineProperty("width", _SE(js_gfx_Texture_getWidth), nullptr);
    cls->defineProperty("depth", _SE(js_gfx_Texture_getDepth), nullptr);
    cls->defineProperty("flags", _SE(js_gfx_Texture_getFlags), nullptr);
    cls->defineProperty("layerCount", _SE(js_gfx_Texture_getLayerCount), nullptr);
    cls->defineProperty("usage", _SE(js_gfx_Texture_getUsage), nullptr);
    cls->defineProperty("type", _SE(js_gfx_Texture_getType), nullptr);
    cls->defineProperty("size", _SE(js_gfx_Texture_getSize), nullptr);
    cls->defineFunction("destroy", _SE(js_gfx_Texture_destroy));
    cls->defineFunction("resize", _SE(js_gfx_Texture_resize));
    cls->defineFunction("isTextureView", _SE(js_gfx_Texture_isTextureView));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Texture_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Texture>(cls);

    __jsb_cc_gfx_Texture_proto = cls->getProto();
    __jsb_cc_gfx_Texture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Sampler_proto = nullptr;
se::Class* __jsb_cc_gfx_Sampler_class = nullptr;

static bool js_gfx_Sampler_getAddressW(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getAddressW : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getAddressW();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getAddressW : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getAddressW)

static bool js_gfx_Sampler_getMaxAnisotropy(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMaxAnisotropy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMaxAnisotropy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMaxAnisotropy : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMaxAnisotropy)

static bool js_gfx_Sampler_getMipLODBias(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMipLODBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMipLODBias();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMipLODBias : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMipLODBias)

static bool js_gfx_Sampler_getCmpFunc(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getCmpFunc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getCmpFunc();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getCmpFunc : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getCmpFunc)

static bool js_gfx_Sampler_getBorderColor(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getBorderColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::Color& result = cobj->getBorderColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getBorderColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getBorderColor)

static bool js_gfx_Sampler_getMinFilter(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMinFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMinFilter();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMinFilter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMinFilter)

static bool js_gfx_Sampler_getMipFilter(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMipFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMipFilter();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMipFilter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMipFilter)

static bool js_gfx_Sampler_getAddressV(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getAddressV : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getAddressV();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getAddressV : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getAddressV)

static bool js_gfx_Sampler_getAddressU(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getAddressU : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getAddressU();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getAddressU : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getAddressU)

static bool js_gfx_Sampler_getMagFilter(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMagFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getMagFilter();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMagFilter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMagFilter)

static bool js_gfx_Sampler_initialize(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::SamplerInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Sampler_initialize)

static bool js_gfx_Sampler_destroy(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Sampler_destroy)

static bool js_gfx_Sampler_getMinLOD(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMinLOD : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMinLOD();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMinLOD : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMinLOD)

static bool js_gfx_Sampler_getMaxLOD(se::State& s)
{
    cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Sampler_getMaxLOD : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getMaxLOD();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Sampler_getMaxLOD : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Sampler_getMaxLOD)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Sampler_finalize)

static bool js_gfx_Sampler_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::Sampler: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Sampler constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Sampler_constructor, __jsb_cc_gfx_Sampler_class, js_cc_gfx_Sampler_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Sampler_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Sampler>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Sampler* cobj = SE_THIS_OBJECT<cc::gfx::Sampler>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Sampler_finalize)

bool js_register_gfx_Sampler(se::Object* obj)
{
    auto cls = se::Class::create("Sampler", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Sampler_constructor));

    cls->defineProperty("borderColor", _SE(js_gfx_Sampler_getBorderColor), nullptr);
    cls->defineProperty("mipFilter", _SE(js_gfx_Sampler_getMipFilter), nullptr);
    cls->defineProperty("minFilter", _SE(js_gfx_Sampler_getMinFilter), nullptr);
    cls->defineProperty("maxLOD", _SE(js_gfx_Sampler_getMaxLOD), nullptr);
    cls->defineProperty("magFilter", _SE(js_gfx_Sampler_getMagFilter), nullptr);
    cls->defineProperty("addressU", _SE(js_gfx_Sampler_getAddressU), nullptr);
    cls->defineProperty("addressV", _SE(js_gfx_Sampler_getAddressV), nullptr);
    cls->defineProperty("addressW", _SE(js_gfx_Sampler_getAddressW), nullptr);
    cls->defineProperty("cmpFunc", _SE(js_gfx_Sampler_getCmpFunc), nullptr);
    cls->defineProperty("maxAnisotropy", _SE(js_gfx_Sampler_getMaxAnisotropy), nullptr);
    cls->defineProperty("mipLODBias", _SE(js_gfx_Sampler_getMipLODBias), nullptr);
    cls->defineProperty("minLOD", _SE(js_gfx_Sampler_getMinLOD), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_Sampler_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_Sampler_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Sampler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Sampler>(cls);

    __jsb_cc_gfx_Sampler_proto = cls->getProto();
    __jsb_cc_gfx_Sampler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Shader_proto = nullptr;
se::Class* __jsb_cc_gfx_Shader_class = nullptr;

static bool js_gfx_Shader_getStages(se::State& s)
{
    cc::gfx::Shader* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getStages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::ShaderStage>& result = cobj->getStages();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getStages : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getStages)

static bool js_gfx_Shader_getName(se::State& s)
{
    cc::gfx::Shader* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::String& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getName : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getName)

static bool js_gfx_Shader_getID(se::State& s)
{
    cc::gfx::Shader* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getID : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getID();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getID : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getID)

static bool js_gfx_Shader_getAttributes(se::State& s)
{
    cc::gfx::Shader* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Attribute>& result = cobj->getAttributes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getAttributes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getAttributes)

static bool js_gfx_Shader_getSamplers(se::State& s)
{
    cc::gfx::Shader* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getSamplers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::UniformSampler>& result = cobj->getSamplers();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getSamplers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getSamplers)

static bool js_gfx_Shader_initialize(se::State& s)
{
    cc::gfx::Shader* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::ShaderInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Shader_initialize)

static bool js_gfx_Shader_destroy(se::State& s)
{
    cc::gfx::Shader* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Shader_destroy)

static bool js_gfx_Shader_getBlocks(se::State& s)
{
    cc::gfx::Shader* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Shader_getBlocks : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::UniformBlock>& result = cobj->getBlocks();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Shader_getBlocks : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Shader_getBlocks)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Shader_finalize)

static bool js_gfx_Shader_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::Shader: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Shader constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Shader_constructor, __jsb_cc_gfx_Shader_class, js_cc_gfx_Shader_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Shader_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Shader>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Shader* cobj = SE_THIS_OBJECT<cc::gfx::Shader>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Shader_finalize)

bool js_register_gfx_Shader(se::Object* obj)
{
    auto cls = se::Class::create("Shader", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Shader_constructor));

    cls->defineProperty("blocks", _SE(js_gfx_Shader_getBlocks), nullptr);
    cls->defineProperty("name", _SE(js_gfx_Shader_getName), nullptr);
    cls->defineProperty("samplers", _SE(js_gfx_Shader_getSamplers), nullptr);
    cls->defineProperty("shaderID", _SE(js_gfx_Shader_getID), nullptr);
    cls->defineProperty("attributes", _SE(js_gfx_Shader_getAttributes), nullptr);
    cls->defineProperty("stages", _SE(js_gfx_Shader_getStages), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_Shader_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_Shader_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Shader_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Shader>(cls);

    __jsb_cc_gfx_Shader_proto = cls->getProto();
    __jsb_cc_gfx_Shader_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_InputAssembler_proto = nullptr;
se::Class* __jsb_cc_gfx_InputAssembler_class = nullptr;

static bool js_gfx_InputAssembler_getFirstIndex(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getFirstIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFirstIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getFirstIndex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getFirstIndex)

static bool js_gfx_InputAssembler_getVertexOffset(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVertexOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getVertexOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getVertexOffset)

static bool js_gfx_InputAssembler_getVertexCount(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getVertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getVertexCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getVertexCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getVertexCount)

static bool js_gfx_InputAssembler_setIndexCount(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setIndexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setIndexCount : Error processing arguments");
        cobj->setIndexCount(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setIndexCount)

static bool js_gfx_InputAssembler_getAttributesHash(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getAttributesHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getAttributesHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getAttributesHash : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getAttributesHash)

static bool js_gfx_InputAssembler_setFirstInstance(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setFirstInstance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setFirstInstance : Error processing arguments");
        cobj->setFirstInstance(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setFirstInstance)

static bool js_gfx_InputAssembler_destroy(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_InputAssembler_destroy)

static bool js_gfx_InputAssembler_setVertexOffset(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setVertexOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setVertexOffset : Error processing arguments");
        cobj->setVertexOffset(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setVertexOffset)

static bool js_gfx_InputAssembler_getInstanceCount(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getInstanceCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getInstanceCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getInstanceCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getInstanceCount)

static bool js_gfx_InputAssembler_getIndexCount(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getIndexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getIndexCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getIndexCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getIndexCount)

static bool js_gfx_InputAssembler_getIndirectBuffer(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getIndirectBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Buffer* result = cobj->getIndirectBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getIndirectBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getIndirectBuffer)

static bool js_gfx_InputAssembler_getVertexBuffers(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getVertexBuffers : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Buffer *>& result = cobj->getVertexBuffers();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getVertexBuffers : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getVertexBuffers)

static bool js_gfx_InputAssembler_initialize(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::InputAssemblerInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_InputAssembler_initialize)

static bool js_gfx_InputAssembler_setFirstVertex(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setFirstVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setFirstVertex : Error processing arguments");
        cobj->setFirstVertex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setFirstVertex)

static bool js_gfx_InputAssembler_getFirstVertex(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getFirstVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFirstVertex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getFirstVertex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getFirstVertex)

static bool js_gfx_InputAssembler_setVertexCount(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setVertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setVertexCount : Error processing arguments");
        cobj->setVertexCount(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setVertexCount)

static bool js_gfx_InputAssembler_getAttributes(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getAttributes : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Attribute>& result = cobj->getAttributes();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getAttributes : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getAttributes)

static bool js_gfx_InputAssembler_getIndexBuffer(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getIndexBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Buffer* result = cobj->getIndexBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getIndexBuffer : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getIndexBuffer)

static bool js_gfx_InputAssembler_setFirstIndex(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setFirstIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setFirstIndex : Error processing arguments");
        cobj->setFirstIndex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setFirstIndex)

static bool js_gfx_InputAssembler_setInstanceCount(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_setInstanceCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<unsigned int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_setInstanceCount : Error processing arguments");
        cobj->setInstanceCount(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_PROP_SET(js_gfx_InputAssembler_setInstanceCount)

static bool js_gfx_InputAssembler_getFirstInstance(se::State& s)
{
    cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_getFirstInstance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getFirstInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_InputAssembler_getFirstInstance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_InputAssembler_getFirstInstance)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_InputAssembler_finalize)

static bool js_gfx_InputAssembler_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::InputAssembler: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::InputAssembler constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_InputAssembler_constructor, __jsb_cc_gfx_InputAssembler_class, js_cc_gfx_InputAssembler_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_InputAssembler_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::InputAssembler>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::InputAssembler* cobj = SE_THIS_OBJECT<cc::gfx::InputAssembler>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_InputAssembler_finalize)

bool js_register_gfx_InputAssembler(se::Object* obj)
{
    auto cls = se::Class::create("InputAssembler", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_InputAssembler_constructor));

    cls->defineProperty("instanceCount", _SE(js_gfx_InputAssembler_getInstanceCount), _SE(js_gfx_InputAssembler_setInstanceCount));
    cls->defineProperty("vertexBuffers", _SE(js_gfx_InputAssembler_getVertexBuffers), nullptr);
    cls->defineProperty("attributesHash", _SE(js_gfx_InputAssembler_getAttributesHash), nullptr);
    cls->defineProperty("firstInstance", _SE(js_gfx_InputAssembler_getFirstInstance), _SE(js_gfx_InputAssembler_setFirstInstance));
    cls->defineProperty("vertexCount", _SE(js_gfx_InputAssembler_getVertexCount), _SE(js_gfx_InputAssembler_setVertexCount));
    cls->defineProperty("indexBuffer", _SE(js_gfx_InputAssembler_getIndexBuffer), nullptr);
    cls->defineProperty("vertexOffset", _SE(js_gfx_InputAssembler_getVertexOffset), _SE(js_gfx_InputAssembler_setVertexOffset));
    cls->defineProperty("attributes", _SE(js_gfx_InputAssembler_getAttributes), nullptr);
    cls->defineProperty("indexCount", _SE(js_gfx_InputAssembler_getIndexCount), _SE(js_gfx_InputAssembler_setIndexCount));
    cls->defineProperty("firstIndex", _SE(js_gfx_InputAssembler_getFirstIndex), _SE(js_gfx_InputAssembler_setFirstIndex));
    cls->defineProperty("indirectBuffer", _SE(js_gfx_InputAssembler_getIndirectBuffer), nullptr);
    cls->defineProperty("firstVertex", _SE(js_gfx_InputAssembler_getFirstVertex), _SE(js_gfx_InputAssembler_setFirstVertex));
    cls->defineFunction("destroy", _SE(js_gfx_InputAssembler_destroy));
    cls->defineFunction("initialize", _SE(js_gfx_InputAssembler_initialize));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_InputAssembler_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::InputAssembler>(cls);

    __jsb_cc_gfx_InputAssembler_proto = cls->getProto();
    __jsb_cc_gfx_InputAssembler_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_RenderPass_proto = nullptr;
se::Class* __jsb_cc_gfx_RenderPass_class = nullptr;

static bool js_gfx_RenderPass_getSubPasses(se::State& s)
{
    cc::gfx::RenderPass* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getSubPasses : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::SubPassInfo>& result = cobj->getSubPasses();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getSubPasses : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_getSubPasses)

static bool js_gfx_RenderPass_getHash(se::State& s)
{
    cc::gfx::RenderPass* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getHash : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_RenderPass_getHash)

static bool js_gfx_RenderPass_initialize(se::State& s)
{
    cc::gfx::RenderPass* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::RenderPassInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_initialize)

static bool js_gfx_RenderPass_destroy(se::State& s)
{
    cc::gfx::RenderPass* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_destroy)

static bool js_gfx_RenderPass_getDepthStencilAttachment(se::State& s)
{
    cc::gfx::RenderPass* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_RenderPass_getDepthStencilAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::DepthStencilAttachment& result = cobj->getDepthStencilAttachment();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_RenderPass_getDepthStencilAttachment : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_RenderPass_getDepthStencilAttachment)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_RenderPass_finalize)

static bool js_gfx_RenderPass_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::RenderPass: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::RenderPass constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_RenderPass_constructor, __jsb_cc_gfx_RenderPass_class, js_cc_gfx_RenderPass_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_RenderPass_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::RenderPass>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::RenderPass* cobj = SE_THIS_OBJECT<cc::gfx::RenderPass>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_RenderPass_finalize)

bool js_register_gfx_RenderPass(se::Object* obj)
{
    auto cls = se::Class::create("RenderPass", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_RenderPass_constructor));

    cls->defineProperty("hash", _SE(js_gfx_RenderPass_getHash), nullptr);
    cls->defineFunction("getSubPasses", _SE(js_gfx_RenderPass_getSubPasses));
    cls->defineFunction("initialize", _SE(js_gfx_RenderPass_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_RenderPass_destroy));
    cls->defineFunction("getDepthStencilAttachment", _SE(js_gfx_RenderPass_getDepthStencilAttachment));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_RenderPass_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::RenderPass>(cls);

    __jsb_cc_gfx_RenderPass_proto = cls->getProto();
    __jsb_cc_gfx_RenderPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Framebuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_Framebuffer_class = nullptr;

static bool js_gfx_Framebuffer_getColorTextures(se::State& s)
{
    cc::gfx::Framebuffer* cobj = SE_THIS_OBJECT<cc::gfx::Framebuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_getColorTextures : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::Texture *>& result = cobj->getColorTextures();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_getColorTextures : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Framebuffer_getColorTextures)

static bool js_gfx_Framebuffer_getDepthStencilTexture(se::State& s)
{
    cc::gfx::Framebuffer* cobj = SE_THIS_OBJECT<cc::gfx::Framebuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_getDepthStencilTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Texture* result = cobj->getDepthStencilTexture();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_getDepthStencilTexture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Framebuffer_getDepthStencilTexture)

static bool js_gfx_Framebuffer_initialize(se::State& s)
{
    cc::gfx::Framebuffer* cobj = SE_THIS_OBJECT<cc::gfx::Framebuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::FramebufferInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Framebuffer_initialize)

static bool js_gfx_Framebuffer_destroy(se::State& s)
{
    cc::gfx::Framebuffer* cobj = SE_THIS_OBJECT<cc::gfx::Framebuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Framebuffer_destroy)

static bool js_gfx_Framebuffer_getRenderPass(se::State& s)
{
    cc::gfx::Framebuffer* cobj = SE_THIS_OBJECT<cc::gfx::Framebuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Framebuffer_getRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::RenderPass* result = cobj->getRenderPass();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Framebuffer_getRenderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Framebuffer_getRenderPass)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Framebuffer_finalize)

static bool js_gfx_Framebuffer_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::Framebuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Framebuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Framebuffer_constructor, __jsb_cc_gfx_Framebuffer_class, js_cc_gfx_Framebuffer_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Framebuffer_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Framebuffer>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Framebuffer* cobj = SE_THIS_OBJECT<cc::gfx::Framebuffer>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Framebuffer_finalize)

bool js_register_gfx_Framebuffer(se::Object* obj)
{
    auto cls = se::Class::create("Framebuffer", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Framebuffer_constructor));

    cls->defineProperty("colorTextures", _SE(js_gfx_Framebuffer_getColorTextures), nullptr);
    cls->defineProperty("renderPass", _SE(js_gfx_Framebuffer_getRenderPass), nullptr);
    cls->defineProperty("depthStencilTexture", _SE(js_gfx_Framebuffer_getDepthStencilTexture), nullptr);
    cls->defineFunction("initialize", _SE(js_gfx_Framebuffer_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_Framebuffer_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Framebuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Framebuffer>(cls);

    __jsb_cc_gfx_Framebuffer_proto = cls->getProto();
    __jsb_cc_gfx_Framebuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_DescriptorSetLayout_proto = nullptr;
se::Class* __jsb_cc_gfx_DescriptorSetLayout_class = nullptr;

static bool js_gfx_DescriptorSetLayout_getBindings(se::State& s)
{
    cc::gfx::DescriptorSetLayout* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayout_getBindings : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::DescriptorSetLayoutBinding>& result = cobj->getBindings();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayout_getBindings : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSetLayout_getBindings)

static bool js_gfx_DescriptorSetLayout_initialize(se::State& s)
{
    cc::gfx::DescriptorSetLayout* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DescriptorSetLayoutInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayout_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSetLayout_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSetLayout_initialize)

static bool js_gfx_DescriptorSetLayout_destroy(se::State& s)
{
    cc::gfx::DescriptorSetLayout* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSetLayout_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSetLayout_destroy)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayout_finalize)

static bool js_gfx_DescriptorSetLayout_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::DescriptorSetLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::DescriptorSetLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_DescriptorSetLayout_constructor, __jsb_cc_gfx_DescriptorSetLayout_class, js_cc_gfx_DescriptorSetLayout_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_DescriptorSetLayout_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DescriptorSetLayout>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DescriptorSetLayout* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSetLayout>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DescriptorSetLayout_finalize)

bool js_register_gfx_DescriptorSetLayout(se::Object* obj)
{
    auto cls = se::Class::create("DescriptorSetLayout", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_DescriptorSetLayout_constructor));

    cls->defineFunction("getBindings", _SE(js_gfx_DescriptorSetLayout_getBindings));
    cls->defineFunction("initialize", _SE(js_gfx_DescriptorSetLayout_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_DescriptorSetLayout_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DescriptorSetLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DescriptorSetLayout>(cls);

    __jsb_cc_gfx_DescriptorSetLayout_proto = cls->getProto();
    __jsb_cc_gfx_DescriptorSetLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_PipelineLayout_proto = nullptr;
se::Class* __jsb_cc_gfx_PipelineLayout_class = nullptr;

static bool js_gfx_PipelineLayout_initialize(se::State& s)
{
    cc::gfx::PipelineLayout* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayout_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PipelineLayoutInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineLayout_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineLayout_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineLayout_initialize)

static bool js_gfx_PipelineLayout_destroy(se::State& s)
{
    cc::gfx::PipelineLayout* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayout_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineLayout_destroy)

static bool js_gfx_PipelineLayout_getSetLayouts(se::State& s)
{
    cc::gfx::PipelineLayout* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayout>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineLayout_getSetLayouts : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::vector<cc::gfx::DescriptorSetLayout *>& result = cobj->getSetLayouts();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineLayout_getSetLayouts : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineLayout_getSetLayouts)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_PipelineLayout_finalize)

static bool js_gfx_PipelineLayout_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::PipelineLayout: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::PipelineLayout constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_PipelineLayout_constructor, __jsb_cc_gfx_PipelineLayout_class, js_cc_gfx_PipelineLayout_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_PipelineLayout_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::PipelineLayout>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::PipelineLayout* cobj = SE_THIS_OBJECT<cc::gfx::PipelineLayout>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_PipelineLayout_finalize)

bool js_register_gfx_PipelineLayout(se::Object* obj)
{
    auto cls = se::Class::create("PipelineLayout", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_PipelineLayout_constructor));

    cls->defineFunction("initialize", _SE(js_gfx_PipelineLayout_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_PipelineLayout_destroy));
    cls->defineFunction("getSetLayouts", _SE(js_gfx_PipelineLayout_getSetLayouts));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_PipelineLayout_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::PipelineLayout>(cls);

    __jsb_cc_gfx_PipelineLayout_proto = cls->getProto();
    __jsb_cc_gfx_PipelineLayout_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_PipelineState_proto = nullptr;
se::Class* __jsb_cc_gfx_PipelineState_class = nullptr;

static bool js_gfx_PipelineState_getRasterizerState(se::State& s)
{
    cc::gfx::PipelineState* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getRasterizerState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::RasterizerState& result = cobj->getRasterizerState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getRasterizerState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getRasterizerState)

static bool js_gfx_PipelineState_getShader(se::State& s)
{
    cc::gfx::PipelineState* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getShader : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Shader* result = cobj->getShader();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getShader : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getShader)

static bool js_gfx_PipelineState_getInputState(se::State& s)
{
    cc::gfx::PipelineState* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getInputState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::InputState& result = cobj->getInputState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getInputState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getInputState)

static bool js_gfx_PipelineState_getPrimitive(se::State& s)
{
    cc::gfx::PipelineState* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getPrimitive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getPrimitive();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getPrimitive : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getPrimitive)

static bool js_gfx_PipelineState_getDepthStencilState(se::State& s)
{
    cc::gfx::PipelineState* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getDepthStencilState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::DepthStencilState& result = cobj->getDepthStencilState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getDepthStencilState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getDepthStencilState)

static bool js_gfx_PipelineState_getBlendState(se::State& s)
{
    cc::gfx::PipelineState* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getBlendState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::BlendState& result = cobj->getBlendState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getBlendState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getBlendState)

static bool js_gfx_PipelineState_getPipelineLayout(se::State& s)
{
    cc::gfx::PipelineState* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getPipelineLayout : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::PipelineLayout* result = cobj->getPipelineLayout();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getPipelineLayout : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineState_getPipelineLayout)

static bool js_gfx_PipelineState_initialize(se::State& s)
{
    cc::gfx::PipelineState* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PipelineStateInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineState_initialize)

static bool js_gfx_PipelineState_destroy(se::State& s)
{
    cc::gfx::PipelineState* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineState_destroy)

static bool js_gfx_PipelineState_getRenderPass(se::State& s)
{
    cc::gfx::PipelineState* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const cc::gfx::RenderPass* result = cobj->getRenderPass();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getRenderPass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_PipelineState_getRenderPass)

static bool js_gfx_PipelineState_getDynamicStates(se::State& s)
{
    cc::gfx::PipelineState* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_PipelineState_getDynamicStates : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getDynamicStates();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_PipelineState_getDynamicStates : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_PipelineState_getDynamicStates)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_PipelineState_finalize)

static bool js_gfx_PipelineState_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::PipelineState: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::PipelineState constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_PipelineState_constructor, __jsb_cc_gfx_PipelineState_class, js_cc_gfx_PipelineState_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_PipelineState_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::PipelineState>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::PipelineState* cobj = SE_THIS_OBJECT<cc::gfx::PipelineState>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_PipelineState_finalize)

bool js_register_gfx_PipelineState(se::Object* obj)
{
    auto cls = se::Class::create("PipelineState", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_PipelineState_constructor));

    cls->defineProperty("primitive", _SE(js_gfx_PipelineState_getPrimitive), nullptr);
    cls->defineProperty("rasterizerState", _SE(js_gfx_PipelineState_getRasterizerState), nullptr);
    cls->defineProperty("shader", _SE(js_gfx_PipelineState_getShader), nullptr);
    cls->defineProperty("blendState", _SE(js_gfx_PipelineState_getBlendState), nullptr);
    cls->defineProperty("renderPass", _SE(js_gfx_PipelineState_getRenderPass), nullptr);
    cls->defineProperty("inputState", _SE(js_gfx_PipelineState_getInputState), nullptr);
    cls->defineProperty("depthStencilState", _SE(js_gfx_PipelineState_getDepthStencilState), nullptr);
    cls->defineFunction("getPipelineLayout", _SE(js_gfx_PipelineState_getPipelineLayout));
    cls->defineFunction("initialize", _SE(js_gfx_PipelineState_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_PipelineState_destroy));
    cls->defineFunction("getDynamicStates", _SE(js_gfx_PipelineState_getDynamicStates));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_PipelineState_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::PipelineState>(cls);

    __jsb_cc_gfx_PipelineState_proto = cls->getProto();
    __jsb_cc_gfx_PipelineState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_DescriptorSet_proto = nullptr;
se::Class* __jsb_cc_gfx_DescriptorSet_class = nullptr;

static bool js_gfx_DescriptorSet_bindTextureJSB(se::State& s)
{
    cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_bindTextureJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Texture*, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindTextureJSB : Error processing arguments");
        bool result = cobj->bindTextureJSB(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindTextureJSB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindTextureJSB)

static bool js_gfx_DescriptorSet_bindBuffer(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_bindBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::Buffer*, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->bindBuffer(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::Buffer*, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->bindBuffer(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindBuffer)

static bool js_gfx_DescriptorSet_bindSamplerJSB(se::State& s)
{
    cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_bindSamplerJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Sampler*, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindSamplerJSB : Error processing arguments");
        bool result = cobj->bindSamplerJSB(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindSamplerJSB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindSamplerJSB)

static bool js_gfx_DescriptorSet_getTexture(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_getTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<unsigned int, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            cc::gfx::Texture* result = cobj->getTexture(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getTexture : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            cc::gfx::Texture* result = cobj->getTexture(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getTexture : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_getTexture)

static bool js_gfx_DescriptorSet_bindSampler(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_bindSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::Sampler*, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->bindSampler(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::Sampler*, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->bindSampler(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindSampler)

static bool js_gfx_DescriptorSet_update(se::State& s)
{
    cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_update)

static bool js_gfx_DescriptorSet_getSampler(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_getSampler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<unsigned int, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            cc::gfx::Sampler* result = cobj->getSampler(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getSampler : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            cc::gfx::Sampler* result = cobj->getSampler(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getSampler : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_getSampler)

static bool js_gfx_DescriptorSet_bindTexture(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_bindTexture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::Texture*, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->bindTexture(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::Texture*, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->bindTexture(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindTexture)

static bool js_gfx_DescriptorSet_initialize(se::State& s)
{
    cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::DescriptorSetInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_initialize)

static bool js_gfx_DescriptorSet_destroy(se::State& s)
{
    cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_destroy)

static bool js_gfx_DescriptorSet_getBuffer(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_DescriptorSet_getBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<unsigned int, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            cc::gfx::Buffer* result = cobj->getBuffer(arg0.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getBuffer : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            cc::gfx::Buffer* result = cobj->getBuffer(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_getBuffer : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_getBuffer)

static bool js_gfx_DescriptorSet_bindBufferJSB(se::State& s)
{
    cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_DescriptorSet_bindBufferJSB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<unsigned int, false> arg0 = {};
        HolderType<cc::gfx::Buffer*, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindBufferJSB : Error processing arguments");
        bool result = cobj->bindBufferJSB(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_DescriptorSet_bindBufferJSB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_DescriptorSet_bindBufferJSB)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_DescriptorSet_finalize)

static bool js_gfx_DescriptorSet_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::DescriptorSet: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::DescriptorSet constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_DescriptorSet_constructor, __jsb_cc_gfx_DescriptorSet_class, js_cc_gfx_DescriptorSet_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_DescriptorSet_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::DescriptorSet* cobj = SE_THIS_OBJECT<cc::gfx::DescriptorSet>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_DescriptorSet_finalize)

bool js_register_gfx_DescriptorSet(se::Object* obj)
{
    auto cls = se::Class::create("DescriptorSet", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_DescriptorSet_constructor));

    cls->defineFunction("bindTextureJSB", _SE(js_gfx_DescriptorSet_bindTextureJSB));
    cls->defineFunction("bindBuffer", _SE(js_gfx_DescriptorSet_bindBuffer));
    cls->defineFunction("bindSamplerJSB", _SE(js_gfx_DescriptorSet_bindSamplerJSB));
    cls->defineFunction("getTexture", _SE(js_gfx_DescriptorSet_getTexture));
    cls->defineFunction("bindSampler", _SE(js_gfx_DescriptorSet_bindSampler));
    cls->defineFunction("update", _SE(js_gfx_DescriptorSet_update));
    cls->defineFunction("getSampler", _SE(js_gfx_DescriptorSet_getSampler));
    cls->defineFunction("bindTexture", _SE(js_gfx_DescriptorSet_bindTexture));
    cls->defineFunction("initialize", _SE(js_gfx_DescriptorSet_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_DescriptorSet_destroy));
    cls->defineFunction("getBuffer", _SE(js_gfx_DescriptorSet_getBuffer));
    cls->defineFunction("bindBufferJSB", _SE(js_gfx_DescriptorSet_bindBufferJSB));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_DescriptorSet_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::DescriptorSet>(cls);

    __jsb_cc_gfx_DescriptorSet_proto = cls->getProto();
    __jsb_cc_gfx_DescriptorSet_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_CommandBuffer_proto = nullptr;
se::Class* __jsb_cc_gfx_CommandBuffer_class = nullptr;

static bool js_gfx_CommandBuffer_draw(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_draw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::InputAssembler*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_draw : Error processing arguments");
        cobj->draw(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_draw)

static bool js_gfx_CommandBuffer_setBlendConstants(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setBlendConstants : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Color, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setBlendConstants : Error processing arguments");
        cobj->setBlendConstants(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setBlendConstants)

static bool js_gfx_CommandBuffer_setDepthBound(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setDepthBound : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setDepthBound : Error processing arguments");
        cobj->setDepthBound(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setDepthBound)

static bool js_gfx_CommandBuffer_getQueue(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::gfx::Queue* result = cobj->getQueue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getQueue : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getQueue)

static bool js_gfx_CommandBuffer_setLineWidth(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setLineWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setLineWidth : Error processing arguments");
        cobj->setLineWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setLineWidth)

static bool js_gfx_CommandBuffer_end(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_end : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->end();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_end)

static bool js_gfx_CommandBuffer_setStencilWriteMask(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setStencilWriteMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<cc::gfx::StencilFace, false> arg0 = {};
        HolderType<unsigned int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setStencilWriteMask : Error processing arguments");
        cobj->setStencilWriteMask(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setStencilWriteMask)

static bool js_gfx_CommandBuffer_getNumInstances(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getNumInstances : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumInstances();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getNumInstances : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getNumInstances)

static bool js_gfx_CommandBuffer_setStencilCompareMask(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setStencilCompareMask : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<cc::gfx::StencilFace, false> arg0 = {};
        HolderType<int, false> arg1 = {};
        HolderType<unsigned int, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setStencilCompareMask : Error processing arguments");
        cobj->setStencilCompareMask(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setStencilCompareMask)

static bool js_gfx_CommandBuffer_bindInputAssembler(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_bindInputAssembler : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::InputAssembler*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_bindInputAssembler : Error processing arguments");
        cobj->bindInputAssembler(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_bindInputAssembler)

static bool js_gfx_CommandBuffer_bindPipelineState(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_bindPipelineState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::PipelineState*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_bindPipelineState : Error processing arguments");
        cobj->bindPipelineState(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_bindPipelineState)

static bool js_gfx_CommandBuffer_destroy(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_destroy)

static bool js_gfx_CommandBuffer_getNumTris(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getNumTris : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumTris();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getNumTris : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getNumTris)

static bool js_gfx_CommandBuffer_setViewport(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setViewport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Viewport, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setViewport : Error processing arguments");
        cobj->setViewport(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setViewport)

static bool js_gfx_CommandBuffer_setDepthBias(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setDepthBias : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setDepthBias : Error processing arguments");
        cobj->setDepthBias(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setDepthBias)

static bool js_gfx_CommandBuffer_begin(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_CommandBuffer_begin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {

            cobj->begin();
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<cc::gfx::RenderPass*, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};
            HolderType<cc::gfx::Framebuffer*, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->begin(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<cc::gfx::RenderPass*, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->begin(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<cc::gfx::RenderPass*, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->begin(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_begin)

static bool js_gfx_CommandBuffer_getType(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getType)

static bool js_gfx_CommandBuffer_bindDescriptorSet(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_CommandBuffer_bindDescriptorSet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::DescriptorSet*, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->bindDescriptorSet(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::DescriptorSet*, false> arg1 = {};
            HolderType<unsigned int, false> arg2 = {};
            HolderType<std::vector<unsigned int>, true> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->bindDescriptorSet(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<unsigned int, false> arg0 = {};
            HolderType<cc::gfx::DescriptorSet*, false> arg1 = {};
            HolderType<std::vector<unsigned int>, true> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->bindDescriptorSet(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_bindDescriptorSet)

static bool js_gfx_CommandBuffer_endRenderPass(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_endRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->endRenderPass();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_endRenderPass)

static bool js_gfx_CommandBuffer_initialize(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::CommandBufferInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_initialize)

static bool js_gfx_CommandBuffer_setScissor(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_setScissor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::Rect, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_setScissor : Error processing arguments");
        cobj->setScissor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_setScissor)

static bool js_gfx_CommandBuffer_beginRenderPass(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_CommandBuffer_beginRenderPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 6) {
            HolderType<cc::gfx::RenderPass*, false> arg0 = {};
            HolderType<cc::gfx::Framebuffer*, false> arg1 = {};
            HolderType<cc::gfx::Rect, true> arg2 = {};
            HolderType<cc::gfx::ColorList, true> arg3 = {};
            HolderType<float, false> arg4 = {};
            HolderType<int, false> arg5 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->beginRenderPass(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 6) {
            HolderType<cc::gfx::RenderPass*, false> arg0 = {};
            HolderType<cc::gfx::Framebuffer*, false> arg1 = {};
            HolderType<cc::gfx::Rect, true> arg2 = {};
            HolderType<const cc::gfx::Color*, false> arg3 = {};
            HolderType<float, false> arg4 = {};
            HolderType<int, false> arg5 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->beginRenderPass(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_beginRenderPass)

static bool js_gfx_CommandBuffer_getNumDrawCalls(se::State& s)
{
    cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_getNumDrawCalls : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->getNumDrawCalls();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_getNumDrawCalls : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_getNumDrawCalls)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_CommandBuffer_finalize)

static bool js_gfx_CommandBuffer_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::CommandBuffer: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::CommandBuffer constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_CommandBuffer_constructor, __jsb_cc_gfx_CommandBuffer_class, js_cc_gfx_CommandBuffer_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_CommandBuffer_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::CommandBuffer* cobj = SE_THIS_OBJECT<cc::gfx::CommandBuffer>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_CommandBuffer_finalize)

bool js_register_gfx_CommandBuffer(se::Object* obj)
{
    auto cls = se::Class::create("CommandBuffer", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_CommandBuffer_constructor));

    cls->defineFunction("draw", _SE(js_gfx_CommandBuffer_draw));
    cls->defineFunction("setBlendConstants", _SE(js_gfx_CommandBuffer_setBlendConstants));
    cls->defineFunction("setDepthBound", _SE(js_gfx_CommandBuffer_setDepthBound));
    cls->defineFunction("getQueue", _SE(js_gfx_CommandBuffer_getQueue));
    cls->defineFunction("setLineWidth", _SE(js_gfx_CommandBuffer_setLineWidth));
    cls->defineFunction("end", _SE(js_gfx_CommandBuffer_end));
    cls->defineFunction("setStencilWriteMask", _SE(js_gfx_CommandBuffer_setStencilWriteMask));
    cls->defineFunction("getNumInstances", _SE(js_gfx_CommandBuffer_getNumInstances));
    cls->defineFunction("setStencilCompareMask", _SE(js_gfx_CommandBuffer_setStencilCompareMask));
    cls->defineFunction("bindInputAssembler", _SE(js_gfx_CommandBuffer_bindInputAssembler));
    cls->defineFunction("bindPipelineState", _SE(js_gfx_CommandBuffer_bindPipelineState));
    cls->defineFunction("destroy", _SE(js_gfx_CommandBuffer_destroy));
    cls->defineFunction("getNumTris", _SE(js_gfx_CommandBuffer_getNumTris));
    cls->defineFunction("setViewport", _SE(js_gfx_CommandBuffer_setViewport));
    cls->defineFunction("setDepthBias", _SE(js_gfx_CommandBuffer_setDepthBias));
    cls->defineFunction("begin", _SE(js_gfx_CommandBuffer_begin));
    cls->defineFunction("getType", _SE(js_gfx_CommandBuffer_getType));
    cls->defineFunction("bindDescriptorSet", _SE(js_gfx_CommandBuffer_bindDescriptorSet));
    cls->defineFunction("endRenderPass", _SE(js_gfx_CommandBuffer_endRenderPass));
    cls->defineFunction("initialize", _SE(js_gfx_CommandBuffer_initialize));
    cls->defineFunction("setScissor", _SE(js_gfx_CommandBuffer_setScissor));
    cls->defineFunction("beginRenderPass", _SE(js_gfx_CommandBuffer_beginRenderPass));
    cls->defineFunction("getNumDrawCalls", _SE(js_gfx_CommandBuffer_getNumDrawCalls));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_CommandBuffer_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::CommandBuffer>(cls);

    __jsb_cc_gfx_CommandBuffer_proto = cls->getProto();
    __jsb_cc_gfx_CommandBuffer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Fence_proto = nullptr;
se::Class* __jsb_cc_gfx_Fence_class = nullptr;

static bool js_gfx_Fence_initialize(se::State& s)
{
    cc::gfx::Fence* cobj = SE_THIS_OBJECT<cc::gfx::Fence>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Fence_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::FenceInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Fence_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Fence_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Fence_initialize)

static bool js_gfx_Fence_destroy(se::State& s)
{
    cc::gfx::Fence* cobj = SE_THIS_OBJECT<cc::gfx::Fence>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Fence_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Fence_destroy)

static bool js_gfx_Fence_wait(se::State& s)
{
    cc::gfx::Fence* cobj = SE_THIS_OBJECT<cc::gfx::Fence>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Fence_wait : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->wait();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Fence_wait)

static bool js_gfx_Fence_reset(se::State& s)
{
    cc::gfx::Fence* cobj = SE_THIS_OBJECT<cc::gfx::Fence>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Fence_reset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Fence_reset)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Fence_finalize)

static bool js_gfx_Fence_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::Fence: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Fence constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Fence_constructor, __jsb_cc_gfx_Fence_class, js_cc_gfx_Fence_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Fence_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Fence>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Fence* cobj = SE_THIS_OBJECT<cc::gfx::Fence>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Fence_finalize)

bool js_register_gfx_Fence(se::Object* obj)
{
    auto cls = se::Class::create("Fence", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Fence_constructor));

    cls->defineFunction("initialize", _SE(js_gfx_Fence_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_Fence_destroy));
    cls->defineFunction("wait", _SE(js_gfx_Fence_wait));
    cls->defineFunction("reset", _SE(js_gfx_Fence_reset));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Fence_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Fence>(cls);

    __jsb_cc_gfx_Fence_proto = cls->getProto();
    __jsb_cc_gfx_Fence_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_cc_gfx_Queue_proto = nullptr;
se::Class* __jsb_cc_gfx_Queue_class = nullptr;

static bool js_gfx_Queue_getType(se::State& s)
{
    cc::gfx::Queue* cobj = SE_THIS_OBJECT<cc::gfx::Queue>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Queue_getType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = (int)cobj->getType();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Queue_getType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_gfx_Queue_getType)

static bool js_gfx_Queue_submit(se::State& s)
{
    CC_UNUSED bool ok = true;
    cc::gfx::Queue* cobj = SE_THIS_OBJECT<cc::gfx::Queue>(s);
    SE_PRECONDITION2( cobj, false, "js_gfx_Queue_submit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<std::vector<cc::gfx::CommandBuffer *>, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->submit(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<const cc::gfx::CommandBuffer**, false> arg0 = {};
            HolderType<unsigned int, false> arg1 = {};
            HolderType<cc::gfx::Fence*, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->submit(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<std::vector<cc::gfx::CommandBuffer *>, true> arg0 = {};
            HolderType<cc::gfx::Fence*, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());;
            if (!ok) { ok = true; break; }
            cobj->submit(arg0.value(), arg1.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Queue_submit)

static bool js_gfx_Queue_isAsync(se::State& s)
{
    cc::gfx::Queue* cobj = SE_THIS_OBJECT<cc::gfx::Queue>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Queue_isAsync : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAsync();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Queue_isAsync : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Queue_isAsync)

static bool js_gfx_Queue_initialize(se::State& s)
{
    cc::gfx::Queue* cobj = SE_THIS_OBJECT<cc::gfx::Queue>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Queue_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<cc::gfx::QueueInfo, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());;
        SE_PRECONDITION2(ok, false, "js_gfx_Queue_initialize : Error processing arguments");
        bool result = cobj->initialize(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_gfx_Queue_initialize : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_Queue_initialize)

static bool js_gfx_Queue_destroy(se::State& s)
{
    cc::gfx::Queue* cobj = SE_THIS_OBJECT<cc::gfx::Queue>(s);
    SE_PRECONDITION2(cobj, false, "js_gfx_Queue_destroy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->destroy();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_Queue_destroy)

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_Queue_finalize)

static bool js_gfx_Queue_constructor(se::State& s) // constructor.c
{
    //#3 cc::gfx::Queue: is_skip_construtor True
    se::ScriptEngine::getInstance()->evalString("throw new Error(\"cc::gfx::Queue constructor is skipped\")");
    return false;
}
SE_BIND_CTOR(js_gfx_Queue_constructor, __jsb_cc_gfx_Queue_class, js_cc_gfx_Queue_finalize)



extern se::Object* __jsb_cc_gfx_GFXObject_proto;

static bool js_cc_gfx_Queue_finalize(se::State& s)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<cc::gfx::Queue>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::Queue* cobj = SE_THIS_OBJECT<cc::gfx::Queue>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_Queue_finalize)

bool js_register_gfx_Queue(se::Object* obj)
{
    auto cls = se::Class::create("Queue", obj, __jsb_cc_gfx_GFXObject_proto, _SE(js_gfx_Queue_constructor));

    cls->defineProperty("type", _SE(js_gfx_Queue_getType), nullptr);
    cls->defineFunction("submit", _SE(js_gfx_Queue_submit));
    cls->defineFunction("isAsync", _SE(js_gfx_Queue_isAsync));
    cls->defineFunction("initialize", _SE(js_gfx_Queue_initialize));
    cls->defineFunction("destroy", _SE(js_gfx_Queue_destroy));
    cls->defineFinalizeFunction(_SE(js_cc_gfx_Queue_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::Queue>(cls);

    __jsb_cc_gfx_Queue_proto = cls->getProto();
    __jsb_cc_gfx_Queue_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_gfx(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("gfx", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("gfx", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_gfx_RasterizerState(ns);
    js_register_gfx_MemoryStatus(ns);
    js_register_gfx_Context(ns);
    js_register_gfx_GFXObject(ns);
    js_register_gfx_Buffer(ns);
    js_register_gfx_Texture(ns);
    js_register_gfx_Uniform(ns);
    js_register_gfx_DescriptorSet(ns);
    js_register_gfx_BlendTarget(ns);
    js_register_gfx_DescriptorSetLayoutBinding(ns);
    js_register_gfx_FormatInfo(ns);
    js_register_gfx_PipelineLayout(ns);
    js_register_gfx_Sampler(ns);
    js_register_gfx_InputAssembler(ns);
    js_register_gfx_RenderPass(ns);
    js_register_gfx_BufferInfo(ns);
    js_register_gfx_SamplerInfo(ns);
    js_register_gfx_TextureViewInfo(ns);
    js_register_gfx_ShaderMacro(ns);
    js_register_gfx_PrimitiveMode(ns);
    js_register_gfx_TextureSubres(ns);
    js_register_gfx_InputAssemblerInfo(ns);
    js_register_gfx_TextureInfo(ns);
    js_register_gfx_PipelineState(ns);
    js_register_gfx_RenderPassInfo(ns);
    js_register_gfx_TextureLayout(ns);
    js_register_gfx_Offset(ns);
    js_register_gfx_Device(ns);
    js_register_gfx_Framebuffer(ns);
    js_register_gfx_CommandBuffer(ns);
    js_register_gfx_Rect(ns);
    js_register_gfx_BufferViewInfo(ns);
    js_register_gfx_Extent(ns);
    js_register_gfx_UniformSampler(ns);
    js_register_gfx_ShaderInfo(ns);
    js_register_gfx_PipelineStateInfo(ns);
    js_register_gfx_Shader(ns);
    js_register_gfx_BlendState(ns);
    js_register_gfx_DescriptorSetInfo(ns);
    js_register_gfx_DescriptorSetLayoutInfo(ns);
    js_register_gfx_ContextInfo(ns);
    js_register_gfx_UniformBlock(ns);
    js_register_gfx_DepthStencilAttachment(ns);
    js_register_gfx_PipelineLayoutInfo(ns);
    js_register_gfx_BufferTextureCopy(ns);
    js_register_gfx_Queue(ns);
    js_register_gfx_ColorAttachment(ns);
    js_register_gfx_SubPassInfo(ns);
    js_register_gfx_Fence(ns);
    js_register_gfx_Color(ns);
    js_register_gfx_Attribute(ns);
    js_register_gfx_Format(ns);
    js_register_gfx_DeviceInfo(ns);
    js_register_gfx_BindingMappingInfo(ns);
    js_register_gfx_FramebufferInfo(ns);
    js_register_gfx_ShaderStage(ns);
    js_register_gfx_InputState(ns);
    js_register_gfx_DescriptorSetLayout(ns);
    js_register_gfx_DepthStencilState(ns);
    return true;
}

