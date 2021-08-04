#include "cocos/bindings/auto/jsb_spine_auto.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "spine-creator-support/spine-cocos2dx.h"

#ifndef JSB_ALLOC
#define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
#define JSB_FREE(ptr) delete ptr
#endif
se::Object* __jsb_spine_Animation_proto = nullptr;
se::Class* __jsb_spine_Animation_class = nullptr;

static bool js_spine_Animation_getDuration(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Animation_getDuration : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getDuration();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Animation_getDuration : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Animation_getDuration)

static bool js_spine_Animation_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Animation_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Animation_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Animation_getName)

static bool js_spine_Animation_getTimelines(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Animation_getTimelines : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::Timeline *>& result = cobj->getTimelines();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Animation_getTimelines : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Animation_getTimelines)

static bool js_spine_Animation_hasTimeline(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Animation_hasTimeline : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Animation_hasTimeline : Error processing arguments");
        bool result = cobj->hasTimeline(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Animation_hasTimeline : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Animation_hasTimeline)

static bool js_spine_Animation_setDuration(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Animation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Animation_setDuration : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Animation_setDuration : Error processing arguments");
        cobj->setDuration(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Animation_setDuration)



bool js_register_spine_Animation(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Animation", obj, nullptr, nullptr);

    cls->defineFunction("getDuration", _SE(js_spine_Animation_getDuration));
    cls->defineFunction("getName", _SE(js_spine_Animation_getName));
    cls->defineFunction("getTimelines", _SE(js_spine_Animation_getTimelines));
    cls->defineFunction("hasTimeline", _SE(js_spine_Animation_hasTimeline));
    cls->defineFunction("setDuration", _SE(js_spine_Animation_setDuration));
    cls->install();
    JSBClassType::registerClass<spine::Animation>(cls);

    __jsb_spine_Animation_proto = cls->getProto();
    __jsb_spine_Animation_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_TrackEntry_proto = nullptr;
se::Class* __jsb_spine_TrackEntry_class = nullptr;

static bool js_spine_TrackEntry_getAlpha(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getAlpha : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAlpha();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getAlpha : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getAlpha)

static bool js_spine_TrackEntry_getAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Animation* result = cobj->getAnimation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getAnimation)

static bool js_spine_TrackEntry_getAnimationEnd(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getAnimationEnd : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAnimationEnd();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getAnimationEnd : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getAnimationEnd)

static bool js_spine_TrackEntry_getAnimationLast(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getAnimationLast : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAnimationLast();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getAnimationLast : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getAnimationLast)

static bool js_spine_TrackEntry_getAnimationStart(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getAnimationStart : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAnimationStart();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getAnimationStart : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getAnimationStart)

static bool js_spine_TrackEntry_getAnimationTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getAnimationTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAnimationTime();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getAnimationTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getAnimationTime)

static bool js_spine_TrackEntry_getAttachmentThreshold(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getAttachmentThreshold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAttachmentThreshold();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getAttachmentThreshold : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getAttachmentThreshold)

static bool js_spine_TrackEntry_getDelay(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getDelay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getDelay();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getDelay : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getDelay)

static bool js_spine_TrackEntry_getDrawOrderThreshold(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getDrawOrderThreshold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getDrawOrderThreshold();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getDrawOrderThreshold : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getDrawOrderThreshold)

static bool js_spine_TrackEntry_getEventThreshold(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getEventThreshold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getEventThreshold();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getEventThreshold : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getEventThreshold)

static bool js_spine_TrackEntry_getHoldPrevious(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getHoldPrevious : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getHoldPrevious();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getHoldPrevious : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getHoldPrevious)

static bool js_spine_TrackEntry_getLoop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getLoop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getLoop();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getLoop : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getLoop)

static bool js_spine_TrackEntry_getMixBlend(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getMixBlend : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<unsigned int>(cobj->getMixBlend());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getMixBlend : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getMixBlend)

static bool js_spine_TrackEntry_getMixDuration(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getMixDuration : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMixDuration();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getMixDuration : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getMixDuration)

static bool js_spine_TrackEntry_getMixTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getMixTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMixTime();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getMixTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getMixTime)

static bool js_spine_TrackEntry_getMixingFrom(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getMixingFrom : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::TrackEntry* result = cobj->getMixingFrom();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getMixingFrom : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getMixingFrom)

static bool js_spine_TrackEntry_getMixingTo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getMixingTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::TrackEntry* result = cobj->getMixingTo();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getMixingTo : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getMixingTo)

static bool js_spine_TrackEntry_getNext(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getNext : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::TrackEntry* result = cobj->getNext();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getNext : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getNext)

static bool js_spine_TrackEntry_getTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTimeScale();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getTimeScale : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getTimeScale)

static bool js_spine_TrackEntry_getTrackEnd(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getTrackEnd : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTrackEnd();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getTrackEnd : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getTrackEnd)

static bool js_spine_TrackEntry_getTrackIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getTrackIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getTrackIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getTrackIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getTrackIndex)

static bool js_spine_TrackEntry_getTrackTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_getTrackTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTrackTime();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_getTrackTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_getTrackTime)

static bool js_spine_TrackEntry_isComplete(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_isComplete : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isComplete();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_isComplete : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_isComplete)

static bool js_spine_TrackEntry_resetRotationDirections(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_resetRotationDirections : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->resetRotationDirections();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_resetRotationDirections)

static bool js_spine_TrackEntry_setAlpha(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setAlpha : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setAlpha : Error processing arguments");
        cobj->setAlpha(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setAlpha)

static bool js_spine_TrackEntry_setAnimationEnd(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setAnimationEnd : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setAnimationEnd : Error processing arguments");
        cobj->setAnimationEnd(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setAnimationEnd)

static bool js_spine_TrackEntry_setAnimationLast(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setAnimationLast : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setAnimationLast : Error processing arguments");
        cobj->setAnimationLast(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setAnimationLast)

static bool js_spine_TrackEntry_setAnimationStart(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setAnimationStart : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setAnimationStart : Error processing arguments");
        cobj->setAnimationStart(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setAnimationStart)

static bool js_spine_TrackEntry_setAttachmentThreshold(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setAttachmentThreshold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setAttachmentThreshold : Error processing arguments");
        cobj->setAttachmentThreshold(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setAttachmentThreshold)

static bool js_spine_TrackEntry_setDelay(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setDelay : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setDelay : Error processing arguments");
        cobj->setDelay(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setDelay)

static bool js_spine_TrackEntry_setDrawOrderThreshold(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setDrawOrderThreshold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setDrawOrderThreshold : Error processing arguments");
        cobj->setDrawOrderThreshold(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setDrawOrderThreshold)

static bool js_spine_TrackEntry_setEventThreshold(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setEventThreshold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setEventThreshold : Error processing arguments");
        cobj->setEventThreshold(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setEventThreshold)

static bool js_spine_TrackEntry_setHoldPrevious(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setHoldPrevious : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setHoldPrevious : Error processing arguments");
        cobj->setHoldPrevious(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setHoldPrevious)

static bool js_spine_TrackEntry_setLoop(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setLoop : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setLoop : Error processing arguments");
        cobj->setLoop(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setLoop)

static bool js_spine_TrackEntry_setMixBlend(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setMixBlend : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::MixBlend, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setMixBlend : Error processing arguments");
        cobj->setMixBlend(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setMixBlend)

static bool js_spine_TrackEntry_setMixDuration(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setMixDuration : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setMixDuration : Error processing arguments");
        cobj->setMixDuration(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setMixDuration)

static bool js_spine_TrackEntry_setMixTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setMixTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setMixTime : Error processing arguments");
        cobj->setMixTime(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setMixTime)

static bool js_spine_TrackEntry_setTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setTimeScale : Error processing arguments");
        cobj->setTimeScale(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setTimeScale)

static bool js_spine_TrackEntry_setTrackEnd(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setTrackEnd : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setTrackEnd : Error processing arguments");
        cobj->setTrackEnd(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setTrackEnd)

static bool js_spine_TrackEntry_setTrackTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TrackEntry>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TrackEntry_setTrackTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TrackEntry_setTrackTime : Error processing arguments");
        cobj->setTrackTime(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TrackEntry_setTrackTime)



bool js_register_spine_TrackEntry(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TrackEntry", obj, nullptr, nullptr);

    cls->defineFunction("getAlpha", _SE(js_spine_TrackEntry_getAlpha));
    cls->defineFunction("getAnimation", _SE(js_spine_TrackEntry_getAnimation));
    cls->defineFunction("getAnimationEnd", _SE(js_spine_TrackEntry_getAnimationEnd));
    cls->defineFunction("getAnimationLast", _SE(js_spine_TrackEntry_getAnimationLast));
    cls->defineFunction("getAnimationStart", _SE(js_spine_TrackEntry_getAnimationStart));
    cls->defineFunction("getAnimationTime", _SE(js_spine_TrackEntry_getAnimationTime));
    cls->defineFunction("getAttachmentThreshold", _SE(js_spine_TrackEntry_getAttachmentThreshold));
    cls->defineFunction("getDelay", _SE(js_spine_TrackEntry_getDelay));
    cls->defineFunction("getDrawOrderThreshold", _SE(js_spine_TrackEntry_getDrawOrderThreshold));
    cls->defineFunction("getEventThreshold", _SE(js_spine_TrackEntry_getEventThreshold));
    cls->defineFunction("getHoldPrevious", _SE(js_spine_TrackEntry_getHoldPrevious));
    cls->defineFunction("getLoop", _SE(js_spine_TrackEntry_getLoop));
    cls->defineFunction("getMixBlend", _SE(js_spine_TrackEntry_getMixBlend));
    cls->defineFunction("getMixDuration", _SE(js_spine_TrackEntry_getMixDuration));
    cls->defineFunction("getMixTime", _SE(js_spine_TrackEntry_getMixTime));
    cls->defineFunction("getMixingFrom", _SE(js_spine_TrackEntry_getMixingFrom));
    cls->defineFunction("getMixingTo", _SE(js_spine_TrackEntry_getMixingTo));
    cls->defineFunction("getNext", _SE(js_spine_TrackEntry_getNext));
    cls->defineFunction("getTimeScale", _SE(js_spine_TrackEntry_getTimeScale));
    cls->defineFunction("getTrackEnd", _SE(js_spine_TrackEntry_getTrackEnd));
    cls->defineFunction("getTrackIndex", _SE(js_spine_TrackEntry_getTrackIndex));
    cls->defineFunction("getTrackTime", _SE(js_spine_TrackEntry_getTrackTime));
    cls->defineFunction("isComplete", _SE(js_spine_TrackEntry_isComplete));
    cls->defineFunction("resetRotationDirections", _SE(js_spine_TrackEntry_resetRotationDirections));
    cls->defineFunction("setAlpha", _SE(js_spine_TrackEntry_setAlpha));
    cls->defineFunction("setAnimationEnd", _SE(js_spine_TrackEntry_setAnimationEnd));
    cls->defineFunction("setAnimationLast", _SE(js_spine_TrackEntry_setAnimationLast));
    cls->defineFunction("setAnimationStart", _SE(js_spine_TrackEntry_setAnimationStart));
    cls->defineFunction("setAttachmentThreshold", _SE(js_spine_TrackEntry_setAttachmentThreshold));
    cls->defineFunction("setDelay", _SE(js_spine_TrackEntry_setDelay));
    cls->defineFunction("setDrawOrderThreshold", _SE(js_spine_TrackEntry_setDrawOrderThreshold));
    cls->defineFunction("setEventThreshold", _SE(js_spine_TrackEntry_setEventThreshold));
    cls->defineFunction("setHoldPrevious", _SE(js_spine_TrackEntry_setHoldPrevious));
    cls->defineFunction("setLoop", _SE(js_spine_TrackEntry_setLoop));
    cls->defineFunction("setMixBlend", _SE(js_spine_TrackEntry_setMixBlend));
    cls->defineFunction("setMixDuration", _SE(js_spine_TrackEntry_setMixDuration));
    cls->defineFunction("setMixTime", _SE(js_spine_TrackEntry_setMixTime));
    cls->defineFunction("setTimeScale", _SE(js_spine_TrackEntry_setTimeScale));
    cls->defineFunction("setTrackEnd", _SE(js_spine_TrackEntry_setTrackEnd));
    cls->defineFunction("setTrackTime", _SE(js_spine_TrackEntry_setTrackTime));
    cls->install();
    JSBClassType::registerClass<spine::TrackEntry>(cls);

    __jsb_spine_TrackEntry_proto = cls->getProto();
    __jsb_spine_TrackEntry_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_AnimationState_proto = nullptr;
se::Class* __jsb_spine_AnimationState_class = nullptr;

static bool js_spine_AnimationState_addAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2( cobj, false, "js_spine_AnimationState_addAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 4) {
            HolderType<size_t, false> arg0 = {};
            HolderType<spine::Animation*, false> arg1 = {};
            HolderType<bool, false> arg2 = {};
            HolderType<float, false> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::TrackEntry* result = cobj->addAnimation(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_AnimationState_addAnimation : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            HolderType<size_t, false> arg0 = {};
            HolderType<spine::String, true> arg1 = {};
            HolderType<bool, false> arg2 = {};
            HolderType<float, false> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::TrackEntry* result = cobj->addAnimation(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_AnimationState_addAnimation : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_addAnimation)

static bool js_spine_AnimationState_addEmptyAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_addEmptyAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<size_t, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_addEmptyAnimation : Error processing arguments");
        spine::TrackEntry* result = cobj->addEmptyAnimation(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_addEmptyAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_addEmptyAnimation)

static bool js_spine_AnimationState_clearTrack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_clearTrack : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<size_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_clearTrack : Error processing arguments");
        cobj->clearTrack(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_clearTrack)

static bool js_spine_AnimationState_clearTracks(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_clearTracks : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearTracks();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_clearTracks)

static bool js_spine_AnimationState_disableQueue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_disableQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->disableQueue();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_disableQueue)

static bool js_spine_AnimationState_enableQueue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_enableQueue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->enableQueue();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_enableQueue)

static bool js_spine_AnimationState_getCurrent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_getCurrent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<size_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_getCurrent : Error processing arguments");
        spine::TrackEntry* result = cobj->getCurrent(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_getCurrent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_getCurrent)

static bool js_spine_AnimationState_getData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_getData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::AnimationStateData* result = cobj->getData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_getData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_getData)

static bool js_spine_AnimationState_getTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_getTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTimeScale();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_getTimeScale : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_getTimeScale)

static bool js_spine_AnimationState_getTracks(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_getTracks : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::TrackEntry *>& result = cobj->getTracks();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_getTracks : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_getTracks)

static bool js_spine_AnimationState_setAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2( cobj, false, "js_spine_AnimationState_setAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            HolderType<size_t, false> arg0 = {};
            HolderType<spine::Animation*, false> arg1 = {};
            HolderType<bool, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            spine::TrackEntry* result = cobj->setAnimation(arg0.value(), arg1.value(), arg2.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_AnimationState_setAnimation : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<size_t, false> arg0 = {};
            HolderType<spine::String, true> arg1 = {};
            HolderType<bool, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            spine::TrackEntry* result = cobj->setAnimation(arg0.value(), arg1.value(), arg2.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_AnimationState_setAnimation : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_setAnimation)

static bool js_spine_AnimationState_setEmptyAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_setEmptyAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<size_t, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_setEmptyAnimation : Error processing arguments");
        spine::TrackEntry* result = cobj->setEmptyAnimation(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_setEmptyAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_setEmptyAnimation)

static bool js_spine_AnimationState_setEmptyAnimations(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_setEmptyAnimations : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_setEmptyAnimations : Error processing arguments");
        cobj->setEmptyAnimations(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_setEmptyAnimations)

static bool js_spine_AnimationState_setTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_setTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_setTimeScale : Error processing arguments");
        cobj->setTimeScale(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_setTimeScale)

static bool js_spine_AnimationState_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationState>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationState_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_AnimationState_update : Error processing arguments");
        cobj->update(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationState_update)



bool js_register_spine_AnimationState(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("AnimationState", obj, nullptr, nullptr);

    cls->defineFunction("addAnimation", _SE(js_spine_AnimationState_addAnimation));
    cls->defineFunction("addEmptyAnimation", _SE(js_spine_AnimationState_addEmptyAnimation));
    cls->defineFunction("clearTrack", _SE(js_spine_AnimationState_clearTrack));
    cls->defineFunction("clearTracks", _SE(js_spine_AnimationState_clearTracks));
    cls->defineFunction("disableQueue", _SE(js_spine_AnimationState_disableQueue));
    cls->defineFunction("enableQueue", _SE(js_spine_AnimationState_enableQueue));
    cls->defineFunction("getCurrent", _SE(js_spine_AnimationState_getCurrent));
    cls->defineFunction("getData", _SE(js_spine_AnimationState_getData));
    cls->defineFunction("getTimeScale", _SE(js_spine_AnimationState_getTimeScale));
    cls->defineFunction("getTracks", _SE(js_spine_AnimationState_getTracks));
    cls->defineFunction("setAnimation", _SE(js_spine_AnimationState_setAnimation));
    cls->defineFunction("setEmptyAnimation", _SE(js_spine_AnimationState_setEmptyAnimation));
    cls->defineFunction("setEmptyAnimations", _SE(js_spine_AnimationState_setEmptyAnimations));
    cls->defineFunction("setTimeScale", _SE(js_spine_AnimationState_setTimeScale));
    cls->defineFunction("update", _SE(js_spine_AnimationState_update));
    cls->install();
    JSBClassType::registerClass<spine::AnimationState>(cls);

    __jsb_spine_AnimationState_proto = cls->getProto();
    __jsb_spine_AnimationState_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_AnimationStateData_proto = nullptr;
se::Class* __jsb_spine_AnimationStateData_class = nullptr;

static bool js_spine_AnimationStateData_getDefaultMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationStateData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationStateData_getDefaultMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getDefaultMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AnimationStateData_getDefaultMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationStateData_getDefaultMix)

static bool js_spine_AnimationStateData_getMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationStateData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationStateData_getMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<spine::Animation*, false> arg0 = {};
        HolderType<spine::Animation*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_AnimationStateData_getMix : Error processing arguments");
        float result = cobj->getMix(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AnimationStateData_getMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationStateData_getMix)

static bool js_spine_AnimationStateData_getSkeletonData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationStateData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationStateData_getSkeletonData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::SkeletonData* result = cobj->getSkeletonData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AnimationStateData_getSkeletonData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationStateData_getSkeletonData)

static bool js_spine_AnimationStateData_setDefaultMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AnimationStateData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AnimationStateData_setDefaultMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_AnimationStateData_setDefaultMix : Error processing arguments");
        cobj->setDefaultMix(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationStateData_setDefaultMix)

static bool js_spine_AnimationStateData_setMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<spine::AnimationStateData>(s);
    SE_PRECONDITION2( cobj, false, "js_spine_AnimationStateData_setMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 3) {
            HolderType<spine::Animation*, false> arg0 = {};
            HolderType<spine::Animation*, false> arg1 = {};
            HolderType<float, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setMix(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<spine::String, true> arg0 = {};
            HolderType<spine::String, true> arg1 = {};
            HolderType<float, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setMix(arg0.value(), arg1.value(), arg2.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_spine_AnimationStateData_setMix)



bool js_register_spine_AnimationStateData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("AnimationStateData", obj, nullptr, nullptr);

    cls->defineFunction("getDefaultMix", _SE(js_spine_AnimationStateData_getDefaultMix));
    cls->defineFunction("getMix", _SE(js_spine_AnimationStateData_getMix));
    cls->defineFunction("getSkeletonData", _SE(js_spine_AnimationStateData_getSkeletonData));
    cls->defineFunction("setDefaultMix", _SE(js_spine_AnimationStateData_setDefaultMix));
    cls->defineFunction("setMix", _SE(js_spine_AnimationStateData_setMix));
    cls->install();
    JSBClassType::registerClass<spine::AnimationStateData>(cls);

    __jsb_spine_AnimationStateData_proto = cls->getProto();
    __jsb_spine_AnimationStateData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_Attachment_proto = nullptr;
se::Class* __jsb_spine_Attachment_class = nullptr;

static bool js_spine_Attachment_copy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Attachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Attachment_copy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Attachment* result = cobj->copy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Attachment_copy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Attachment_copy)

static bool js_spine_Attachment_dereference(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Attachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Attachment_dereference : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->dereference();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Attachment_dereference)

static bool js_spine_Attachment_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Attachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Attachment_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Attachment_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Attachment_getName)

static bool js_spine_Attachment_getRefCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Attachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Attachment_getRefCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getRefCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Attachment_getRefCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Attachment_getRefCount)

static bool js_spine_Attachment_reference(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Attachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Attachment_reference : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->reference();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Attachment_reference)



bool js_register_spine_Attachment(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Attachment", obj, nullptr, nullptr);

    cls->defineFunction("copy", _SE(js_spine_Attachment_copy));
    cls->defineFunction("dereference", _SE(js_spine_Attachment_dereference));
    cls->defineFunction("getName", _SE(js_spine_Attachment_getName));
    cls->defineFunction("getRefCount", _SE(js_spine_Attachment_getRefCount));
    cls->defineFunction("reference", _SE(js_spine_Attachment_reference));
    cls->install();
    JSBClassType::registerClass<spine::Attachment>(cls);

    __jsb_spine_Attachment_proto = cls->getProto();
    __jsb_spine_Attachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_Timeline_proto = nullptr;
se::Class* __jsb_spine_Timeline_class = nullptr;

static bool js_spine_Timeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Timeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Timeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Timeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Timeline_getPropertyId)



bool js_register_spine_Timeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Timeline", obj, nullptr, nullptr);

    cls->defineFunction("getPropertyId", _SE(js_spine_Timeline_getPropertyId));
    cls->install();
    JSBClassType::registerClass<spine::Timeline>(cls);

    __jsb_spine_Timeline_proto = cls->getProto();
    __jsb_spine_Timeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_AttachmentTimeline_proto = nullptr;
se::Class* __jsb_spine_AttachmentTimeline_class = nullptr;

static bool js_spine_AttachmentTimeline_getAttachmentNames(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AttachmentTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AttachmentTimeline_getAttachmentNames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::Vector<spine::String>& result = cobj->getAttachmentNames();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AttachmentTimeline_getAttachmentNames : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AttachmentTimeline_getAttachmentNames)

static bool js_spine_AttachmentTimeline_getFrameCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AttachmentTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AttachmentTimeline_getFrameCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        size_t result = cobj->getFrameCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AttachmentTimeline_getFrameCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AttachmentTimeline_getFrameCount)

static bool js_spine_AttachmentTimeline_getFrames(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AttachmentTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AttachmentTimeline_getFrames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::Vector<float>& result = cobj->getFrames();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AttachmentTimeline_getFrames : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AttachmentTimeline_getFrames)

static bool js_spine_AttachmentTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AttachmentTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AttachmentTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AttachmentTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AttachmentTimeline_getPropertyId)

static bool js_spine_AttachmentTimeline_getSlotIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AttachmentTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AttachmentTimeline_getSlotIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        size_t result = cobj->getSlotIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_AttachmentTimeline_getSlotIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_AttachmentTimeline_getSlotIndex)

static bool js_spine_AttachmentTimeline_setFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AttachmentTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AttachmentTimeline_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<int, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<spine::String, true> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_AttachmentTimeline_setFrame : Error processing arguments");
        cobj->setFrame(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_spine_AttachmentTimeline_setFrame)

static bool js_spine_AttachmentTimeline_setSlotIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::AttachmentTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_AttachmentTimeline_setSlotIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<size_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_AttachmentTimeline_setSlotIndex : Error processing arguments");
        cobj->setSlotIndex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_AttachmentTimeline_setSlotIndex)



bool js_register_spine_AttachmentTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("AttachmentTimeline", obj, __jsb_spine_Timeline_proto, nullptr);

    cls->defineFunction("getAttachmentNames", _SE(js_spine_AttachmentTimeline_getAttachmentNames));
    cls->defineFunction("getFrameCount", _SE(js_spine_AttachmentTimeline_getFrameCount));
    cls->defineFunction("getFrames", _SE(js_spine_AttachmentTimeline_getFrames));
    cls->defineFunction("getPropertyId", _SE(js_spine_AttachmentTimeline_getPropertyId));
    cls->defineFunction("getSlotIndex", _SE(js_spine_AttachmentTimeline_getSlotIndex));
    cls->defineFunction("setFrame", _SE(js_spine_AttachmentTimeline_setFrame));
    cls->defineFunction("setSlotIndex", _SE(js_spine_AttachmentTimeline_setSlotIndex));
    cls->install();
    JSBClassType::registerClass<spine::AttachmentTimeline>(cls);

    __jsb_spine_AttachmentTimeline_proto = cls->getProto();
    __jsb_spine_AttachmentTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_Bone_proto = nullptr;
se::Class* __jsb_spine_Bone_class = nullptr;

static bool js_spine_Bone_getA(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getA();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getA : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getA)

static bool js_spine_Bone_getAScaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getAScaleX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAScaleX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getAScaleX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getAScaleX)

static bool js_spine_Bone_getAScaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getAScaleY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAScaleY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getAScaleY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getAScaleY)

static bool js_spine_Bone_getAShearX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getAShearX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAShearX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getAShearX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getAShearX)

static bool js_spine_Bone_getAShearY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getAShearY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAShearY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getAShearY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getAShearY)

static bool js_spine_Bone_getAX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getAX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getAX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getAX)

static bool js_spine_Bone_getAY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getAY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getAY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getAY)

static bool js_spine_Bone_getAppliedRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getAppliedRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAppliedRotation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getAppliedRotation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getAppliedRotation)

static bool js_spine_Bone_getB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getB)

static bool js_spine_Bone_getC(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getC : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getC();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getC : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getC)

static bool js_spine_Bone_getChildren(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getChildren : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::Bone *>& result = cobj->getChildren();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getChildren : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getChildren)

static bool js_spine_Bone_getD(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getD : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getD();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getD : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getD)

static bool js_spine_Bone_getData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::BoneData& result = cobj->getData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getData)

static bool js_spine_Bone_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Bone* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getParent)

static bool js_spine_Bone_getRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRotation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getRotation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getRotation)

static bool js_spine_Bone_getScaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getScaleX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScaleX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getScaleX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getScaleX)

static bool js_spine_Bone_getScaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getScaleY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScaleY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getScaleY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getScaleY)

static bool js_spine_Bone_getShearX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getShearX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShearX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getShearX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getShearX)

static bool js_spine_Bone_getShearY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getShearY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShearY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getShearY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getShearY)

static bool js_spine_Bone_getSkeleton(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getSkeleton : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Skeleton& result = cobj->getSkeleton();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getSkeleton : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getSkeleton)

static bool js_spine_Bone_getWorldRotationX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getWorldRotationX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWorldRotationX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getWorldRotationX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getWorldRotationX)

static bool js_spine_Bone_getWorldRotationY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getWorldRotationY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWorldRotationY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getWorldRotationY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getWorldRotationY)

static bool js_spine_Bone_getWorldScaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getWorldScaleX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWorldScaleX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getWorldScaleX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getWorldScaleX)

static bool js_spine_Bone_getWorldScaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getWorldScaleY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWorldScaleY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getWorldScaleY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getWorldScaleY)

static bool js_spine_Bone_getWorldToLocalRotationX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getWorldToLocalRotationX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWorldToLocalRotationX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getWorldToLocalRotationX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getWorldToLocalRotationX)

static bool js_spine_Bone_getWorldToLocalRotationY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getWorldToLocalRotationY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWorldToLocalRotationY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getWorldToLocalRotationY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getWorldToLocalRotationY)

static bool js_spine_Bone_getWorldX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getWorldX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWorldX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getWorldX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getWorldX)

static bool js_spine_Bone_getWorldY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getWorldY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWorldY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getWorldY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getWorldY)

static bool js_spine_Bone_getX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getX)

static bool js_spine_Bone_getY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_getY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_getY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_getY)

static bool js_spine_Bone_isActive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_isActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isActive();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_isActive : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_isActive)

static bool js_spine_Bone_isAppliedValid(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_isAppliedValid : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isAppliedValid();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_isAppliedValid : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_isAppliedValid)

static bool js_spine_Bone_rotateWorld(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_rotateWorld : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_rotateWorld : Error processing arguments");
        cobj->rotateWorld(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_rotateWorld)

static bool js_spine_Bone_setA(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setA : Error processing arguments");
        cobj->setA(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setA)

static bool js_spine_Bone_setAScaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setAScaleX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setAScaleX : Error processing arguments");
        cobj->setAScaleX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setAScaleX)

static bool js_spine_Bone_setAScaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setAScaleY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setAScaleY : Error processing arguments");
        cobj->setAScaleY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setAScaleY)

static bool js_spine_Bone_setAShearX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setAShearX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setAShearX : Error processing arguments");
        cobj->setAShearX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setAShearX)

static bool js_spine_Bone_setAShearY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setAShearY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setAShearY : Error processing arguments");
        cobj->setAShearY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setAShearY)

static bool js_spine_Bone_setAX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setAX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setAX : Error processing arguments");
        cobj->setAX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setAX)

static bool js_spine_Bone_setAY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setAY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setAY : Error processing arguments");
        cobj->setAY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setAY)

static bool js_spine_Bone_setActive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setActive : Error processing arguments");
        cobj->setActive(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setActive)

static bool js_spine_Bone_setAppliedRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setAppliedRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setAppliedRotation : Error processing arguments");
        cobj->setAppliedRotation(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setAppliedRotation)

static bool js_spine_Bone_setAppliedValid(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setAppliedValid : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setAppliedValid : Error processing arguments");
        cobj->setAppliedValid(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setAppliedValid)

static bool js_spine_Bone_setB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setB : Error processing arguments");
        cobj->setB(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setB)

static bool js_spine_Bone_setC(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setC : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setC : Error processing arguments");
        cobj->setC(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setC)

static bool js_spine_Bone_setD(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setD : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setD : Error processing arguments");
        cobj->setD(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setD)

static bool js_spine_Bone_setRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setRotation : Error processing arguments");
        cobj->setRotation(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setRotation)

static bool js_spine_Bone_setScaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setScaleX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setScaleX : Error processing arguments");
        cobj->setScaleX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setScaleX)

static bool js_spine_Bone_setScaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setScaleY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setScaleY : Error processing arguments");
        cobj->setScaleY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setScaleY)

static bool js_spine_Bone_setShearX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setShearX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setShearX : Error processing arguments");
        cobj->setShearX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setShearX)

static bool js_spine_Bone_setShearY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setShearY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setShearY : Error processing arguments");
        cobj->setShearY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setShearY)

static bool js_spine_Bone_setToSetupPose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setToSetupPose)

static bool js_spine_Bone_setWorldX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setWorldX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setWorldX : Error processing arguments");
        cobj->setWorldX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setWorldX)

static bool js_spine_Bone_setWorldY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setWorldY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setWorldY : Error processing arguments");
        cobj->setWorldY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setWorldY)

static bool js_spine_Bone_setX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setX : Error processing arguments");
        cobj->setX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setX)

static bool js_spine_Bone_setY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_setY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setY : Error processing arguments");
        cobj->setY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setY)

static bool js_spine_Bone_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Bone_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_update)

static bool js_spine_Bone_updateWorldTransform(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<spine::Bone>(s);
    SE_PRECONDITION2( cobj, false, "js_spine_Bone_updateWorldTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 7) {
            HolderType<float, false> arg0 = {};
            HolderType<float, false> arg1 = {};
            HolderType<float, false> arg2 = {};
            HolderType<float, false> arg3 = {};
            HolderType<float, false> arg4 = {};
            HolderType<float, false> arg5 = {};
            HolderType<float, false> arg6 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[6], &arg6, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->updateWorldTransform(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {

            cobj->updateWorldTransform();
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_updateWorldTransform)

static bool js_spine_Bone_isYDown(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = spine::Bone::isYDown();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_isYDown : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_isYDown)

static bool js_spine_Bone_setYDown(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_spine_Bone_setYDown : Error processing arguments");
        spine::Bone::setYDown(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Bone_setYDown)



bool js_register_spine_Bone(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Bone", obj, nullptr, nullptr);

    cls->defineFunction("getA", _SE(js_spine_Bone_getA));
    cls->defineFunction("getAScaleX", _SE(js_spine_Bone_getAScaleX));
    cls->defineFunction("getAScaleY", _SE(js_spine_Bone_getAScaleY));
    cls->defineFunction("getAShearX", _SE(js_spine_Bone_getAShearX));
    cls->defineFunction("getAShearY", _SE(js_spine_Bone_getAShearY));
    cls->defineFunction("getAX", _SE(js_spine_Bone_getAX));
    cls->defineFunction("getAY", _SE(js_spine_Bone_getAY));
    cls->defineFunction("getAppliedRotation", _SE(js_spine_Bone_getAppliedRotation));
    cls->defineFunction("getB", _SE(js_spine_Bone_getB));
    cls->defineFunction("getC", _SE(js_spine_Bone_getC));
    cls->defineFunction("getChildren", _SE(js_spine_Bone_getChildren));
    cls->defineFunction("getD", _SE(js_spine_Bone_getD));
    cls->defineFunction("getData", _SE(js_spine_Bone_getData));
    cls->defineFunction("getParent", _SE(js_spine_Bone_getParent));
    cls->defineFunction("getRotation", _SE(js_spine_Bone_getRotation));
    cls->defineFunction("getScaleX", _SE(js_spine_Bone_getScaleX));
    cls->defineFunction("getScaleY", _SE(js_spine_Bone_getScaleY));
    cls->defineFunction("getShearX", _SE(js_spine_Bone_getShearX));
    cls->defineFunction("getShearY", _SE(js_spine_Bone_getShearY));
    cls->defineFunction("getSkeleton", _SE(js_spine_Bone_getSkeleton));
    cls->defineFunction("getWorldRotationX", _SE(js_spine_Bone_getWorldRotationX));
    cls->defineFunction("getWorldRotationY", _SE(js_spine_Bone_getWorldRotationY));
    cls->defineFunction("getWorldScaleX", _SE(js_spine_Bone_getWorldScaleX));
    cls->defineFunction("getWorldScaleY", _SE(js_spine_Bone_getWorldScaleY));
    cls->defineFunction("getWorldToLocalRotationX", _SE(js_spine_Bone_getWorldToLocalRotationX));
    cls->defineFunction("getWorldToLocalRotationY", _SE(js_spine_Bone_getWorldToLocalRotationY));
    cls->defineFunction("getWorldX", _SE(js_spine_Bone_getWorldX));
    cls->defineFunction("getWorldY", _SE(js_spine_Bone_getWorldY));
    cls->defineFunction("getX", _SE(js_spine_Bone_getX));
    cls->defineFunction("getY", _SE(js_spine_Bone_getY));
    cls->defineFunction("isActive", _SE(js_spine_Bone_isActive));
    cls->defineFunction("isAppliedValid", _SE(js_spine_Bone_isAppliedValid));
    cls->defineFunction("rotateWorld", _SE(js_spine_Bone_rotateWorld));
    cls->defineFunction("setA", _SE(js_spine_Bone_setA));
    cls->defineFunction("setAScaleX", _SE(js_spine_Bone_setAScaleX));
    cls->defineFunction("setAScaleY", _SE(js_spine_Bone_setAScaleY));
    cls->defineFunction("setAShearX", _SE(js_spine_Bone_setAShearX));
    cls->defineFunction("setAShearY", _SE(js_spine_Bone_setAShearY));
    cls->defineFunction("setAX", _SE(js_spine_Bone_setAX));
    cls->defineFunction("setAY", _SE(js_spine_Bone_setAY));
    cls->defineFunction("setActive", _SE(js_spine_Bone_setActive));
    cls->defineFunction("setAppliedRotation", _SE(js_spine_Bone_setAppliedRotation));
    cls->defineFunction("setAppliedValid", _SE(js_spine_Bone_setAppliedValid));
    cls->defineFunction("setB", _SE(js_spine_Bone_setB));
    cls->defineFunction("setC", _SE(js_spine_Bone_setC));
    cls->defineFunction("setD", _SE(js_spine_Bone_setD));
    cls->defineFunction("setRotation", _SE(js_spine_Bone_setRotation));
    cls->defineFunction("setScaleX", _SE(js_spine_Bone_setScaleX));
    cls->defineFunction("setScaleY", _SE(js_spine_Bone_setScaleY));
    cls->defineFunction("setShearX", _SE(js_spine_Bone_setShearX));
    cls->defineFunction("setShearY", _SE(js_spine_Bone_setShearY));
    cls->defineFunction("setToSetupPose", _SE(js_spine_Bone_setToSetupPose));
    cls->defineFunction("setWorldX", _SE(js_spine_Bone_setWorldX));
    cls->defineFunction("setWorldY", _SE(js_spine_Bone_setWorldY));
    cls->defineFunction("setX", _SE(js_spine_Bone_setX));
    cls->defineFunction("setY", _SE(js_spine_Bone_setY));
    cls->defineFunction("update", _SE(js_spine_Bone_update));
    cls->defineFunction("updateWorldTransform", _SE(js_spine_Bone_updateWorldTransform));
    cls->defineStaticFunction("isYDown", _SE(js_spine_Bone_isYDown));
    cls->defineStaticFunction("setYDown", _SE(js_spine_Bone_setYDown));
    cls->install();
    JSBClassType::registerClass<spine::Bone>(cls);

    __jsb_spine_Bone_proto = cls->getProto();
    __jsb_spine_Bone_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_BoneData_proto = nullptr;
se::Class* __jsb_spine_BoneData_class = nullptr;

static bool js_spine_BoneData_getIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_getIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_getIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_getIndex)

static bool js_spine_BoneData_getLength(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_getLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLength();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_getLength : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_getLength)

static bool js_spine_BoneData_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_getName)

static bool js_spine_BoneData_getParent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_getParent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::BoneData* result = cobj->getParent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_getParent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_getParent)

static bool js_spine_BoneData_getRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_getRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRotation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_getRotation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_getRotation)

static bool js_spine_BoneData_getScaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_getScaleX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScaleX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_getScaleX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_getScaleX)

static bool js_spine_BoneData_getScaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_getScaleY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScaleY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_getScaleY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_getScaleY)

static bool js_spine_BoneData_getShearX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_getShearX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShearX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_getShearX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_getShearX)

static bool js_spine_BoneData_getShearY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_getShearY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShearY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_getShearY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_getShearY)

static bool js_spine_BoneData_getTransformMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_getTransformMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<unsigned int>(cobj->getTransformMode());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_getTransformMode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_getTransformMode)

static bool js_spine_BoneData_getX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_getX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_getX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_getX)

static bool js_spine_BoneData_getY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_getY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_getY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_getY)

static bool js_spine_BoneData_isSkinRequired(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_isSkinRequired : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isSkinRequired();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_isSkinRequired : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_isSkinRequired)

static bool js_spine_BoneData_setLength(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_setLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_setLength : Error processing arguments");
        cobj->setLength(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_setLength)

static bool js_spine_BoneData_setRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_setRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_setRotation : Error processing arguments");
        cobj->setRotation(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_setRotation)

static bool js_spine_BoneData_setScaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_setScaleX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_setScaleX : Error processing arguments");
        cobj->setScaleX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_setScaleX)

static bool js_spine_BoneData_setScaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_setScaleY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_setScaleY : Error processing arguments");
        cobj->setScaleY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_setScaleY)

static bool js_spine_BoneData_setShearX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_setShearX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_setShearX : Error processing arguments");
        cobj->setShearX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_setShearX)

static bool js_spine_BoneData_setShearY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_setShearY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_setShearY : Error processing arguments");
        cobj->setShearY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_setShearY)

static bool js_spine_BoneData_setSkinRequired(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_setSkinRequired : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_setSkinRequired : Error processing arguments");
        cobj->setSkinRequired(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_setSkinRequired)

static bool js_spine_BoneData_setTransformMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_setTransformMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::TransformMode, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_setTransformMode : Error processing arguments");
        cobj->setTransformMode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_setTransformMode)

static bool js_spine_BoneData_setX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_setX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_setX : Error processing arguments");
        cobj->setX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_setX)

static bool js_spine_BoneData_setY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoneData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoneData_setY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_BoneData_setY : Error processing arguments");
        cobj->setY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_BoneData_setY)



bool js_register_spine_BoneData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BoneData", obj, nullptr, nullptr);

    cls->defineFunction("getIndex", _SE(js_spine_BoneData_getIndex));
    cls->defineFunction("getLength", _SE(js_spine_BoneData_getLength));
    cls->defineFunction("getName", _SE(js_spine_BoneData_getName));
    cls->defineFunction("getParent", _SE(js_spine_BoneData_getParent));
    cls->defineFunction("getRotation", _SE(js_spine_BoneData_getRotation));
    cls->defineFunction("getScaleX", _SE(js_spine_BoneData_getScaleX));
    cls->defineFunction("getScaleY", _SE(js_spine_BoneData_getScaleY));
    cls->defineFunction("getShearX", _SE(js_spine_BoneData_getShearX));
    cls->defineFunction("getShearY", _SE(js_spine_BoneData_getShearY));
    cls->defineFunction("getTransformMode", _SE(js_spine_BoneData_getTransformMode));
    cls->defineFunction("getX", _SE(js_spine_BoneData_getX));
    cls->defineFunction("getY", _SE(js_spine_BoneData_getY));
    cls->defineFunction("isSkinRequired", _SE(js_spine_BoneData_isSkinRequired));
    cls->defineFunction("setLength", _SE(js_spine_BoneData_setLength));
    cls->defineFunction("setRotation", _SE(js_spine_BoneData_setRotation));
    cls->defineFunction("setScaleX", _SE(js_spine_BoneData_setScaleX));
    cls->defineFunction("setScaleY", _SE(js_spine_BoneData_setScaleY));
    cls->defineFunction("setShearX", _SE(js_spine_BoneData_setShearX));
    cls->defineFunction("setShearY", _SE(js_spine_BoneData_setShearY));
    cls->defineFunction("setSkinRequired", _SE(js_spine_BoneData_setSkinRequired));
    cls->defineFunction("setTransformMode", _SE(js_spine_BoneData_setTransformMode));
    cls->defineFunction("setX", _SE(js_spine_BoneData_setX));
    cls->defineFunction("setY", _SE(js_spine_BoneData_setY));
    cls->install();
    JSBClassType::registerClass<spine::BoneData>(cls);

    __jsb_spine_BoneData_proto = cls->getProto();
    __jsb_spine_BoneData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_VertexAttachment_proto = nullptr;
se::Class* __jsb_spine_VertexAttachment_class = nullptr;

static bool js_spine_VertexAttachment_copyTo(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexAttachment_copyTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::VertexAttachment*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_VertexAttachment_copyTo : Error processing arguments");
        cobj->copyTo(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_VertexAttachment_copyTo)

static bool js_spine_VertexAttachment_getDeformAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexAttachment_getDeformAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::VertexAttachment* result = cobj->getDeformAttachment();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_VertexAttachment_getDeformAttachment : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_VertexAttachment_getDeformAttachment)

static bool js_spine_VertexAttachment_getId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexAttachment_getId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_VertexAttachment_getId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_VertexAttachment_getId)

static bool js_spine_VertexAttachment_getVertices(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexAttachment_getVertices : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<float>& result = cobj->getVertices();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_VertexAttachment_getVertices : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_VertexAttachment_getVertices)

static bool js_spine_VertexAttachment_getWorldVerticesLength(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexAttachment_getWorldVerticesLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        size_t result = cobj->getWorldVerticesLength();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_VertexAttachment_getWorldVerticesLength : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_VertexAttachment_getWorldVerticesLength)

static bool js_spine_VertexAttachment_setDeformAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexAttachment_setDeformAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::VertexAttachment*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_VertexAttachment_setDeformAttachment : Error processing arguments");
        cobj->setDeformAttachment(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_VertexAttachment_setDeformAttachment)

static bool js_spine_VertexAttachment_setWorldVerticesLength(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexAttachment_setWorldVerticesLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<size_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_VertexAttachment_setWorldVerticesLength : Error processing arguments");
        cobj->setWorldVerticesLength(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_VertexAttachment_setWorldVerticesLength)



bool js_register_spine_VertexAttachment(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("VertexAttachment", obj, __jsb_spine_Attachment_proto, nullptr);

    cls->defineFunction("copyTo", _SE(js_spine_VertexAttachment_copyTo));
    cls->defineFunction("getDeformAttachment", _SE(js_spine_VertexAttachment_getDeformAttachment));
    cls->defineFunction("getId", _SE(js_spine_VertexAttachment_getId));
    cls->defineFunction("getVertices", _SE(js_spine_VertexAttachment_getVertices));
    cls->defineFunction("getWorldVerticesLength", _SE(js_spine_VertexAttachment_getWorldVerticesLength));
    cls->defineFunction("setDeformAttachment", _SE(js_spine_VertexAttachment_setDeformAttachment));
    cls->defineFunction("setWorldVerticesLength", _SE(js_spine_VertexAttachment_setWorldVerticesLength));
    cls->install();
    JSBClassType::registerClass<spine::VertexAttachment>(cls);

    __jsb_spine_VertexAttachment_proto = cls->getProto();
    __jsb_spine_VertexAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_BoundingBoxAttachment_proto = nullptr;
se::Class* __jsb_spine_BoundingBoxAttachment_class = nullptr;

static bool js_spine_BoundingBoxAttachment_copy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::BoundingBoxAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_BoundingBoxAttachment_copy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Attachment* result = cobj->copy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_BoundingBoxAttachment_copy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_BoundingBoxAttachment_copy)



bool js_register_spine_BoundingBoxAttachment(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("BoundingBoxAttachment", obj, __jsb_spine_VertexAttachment_proto, nullptr);

    cls->defineFunction("copy", _SE(js_spine_BoundingBoxAttachment_copy));
    cls->install();
    JSBClassType::registerClass<spine::BoundingBoxAttachment>(cls);

    __jsb_spine_BoundingBoxAttachment_proto = cls->getProto();
    __jsb_spine_BoundingBoxAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_ClippingAttachment_proto = nullptr;
se::Class* __jsb_spine_ClippingAttachment_class = nullptr;

static bool js_spine_ClippingAttachment_copy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ClippingAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ClippingAttachment_copy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Attachment* result = cobj->copy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_ClippingAttachment_copy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_ClippingAttachment_copy)

static bool js_spine_ClippingAttachment_getEndSlot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ClippingAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ClippingAttachment_getEndSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::SlotData* result = cobj->getEndSlot();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_ClippingAttachment_getEndSlot : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_ClippingAttachment_getEndSlot)

static bool js_spine_ClippingAttachment_setEndSlot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ClippingAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ClippingAttachment_setEndSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::SlotData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_ClippingAttachment_setEndSlot : Error processing arguments");
        cobj->setEndSlot(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_ClippingAttachment_setEndSlot)



bool js_register_spine_ClippingAttachment(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ClippingAttachment", obj, __jsb_spine_VertexAttachment_proto, nullptr);

    cls->defineFunction("copy", _SE(js_spine_ClippingAttachment_copy));
    cls->defineFunction("getEndSlot", _SE(js_spine_ClippingAttachment_getEndSlot));
    cls->defineFunction("setEndSlot", _SE(js_spine_ClippingAttachment_setEndSlot));
    cls->install();
    JSBClassType::registerClass<spine::ClippingAttachment>(cls);

    __jsb_spine_ClippingAttachment_proto = cls->getProto();
    __jsb_spine_ClippingAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_Color_proto = nullptr;
se::Class* __jsb_spine_Color_class = nullptr;

static bool js_spine_Color_clamp(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Color_clamp : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Color& result = cobj->clamp();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Color_clamp : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Color_clamp)

static bool js_spine_Color_get_r(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Color_get_r : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->r, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->r, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_spine_Color_get_r)

static bool js_spine_Color_set_r(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<spine::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Color_set_r : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->r, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_spine_Color_set_r : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_spine_Color_set_r)

static bool js_spine_Color_get_g(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Color_get_g : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->g, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->g, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_spine_Color_get_g)

static bool js_spine_Color_set_g(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<spine::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Color_set_g : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->g, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_spine_Color_set_g : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_spine_Color_set_g)

static bool js_spine_Color_get_b(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Color_get_b : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->b, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->b, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_spine_Color_get_b)

static bool js_spine_Color_set_b(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<spine::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Color_set_b : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->b, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_spine_Color_set_b : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_spine_Color_set_b)

static bool js_spine_Color_get_a(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Color_get_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= nativevalue_to_se(cobj->a, jsret, s.thisObject() /*ctx*/);
    s.rval() = jsret;
    SE_HOLD_RETURN_VALUE(cobj->a, s.thisObject(), s.rval());
    return true;
}
SE_BIND_PROP_GET(js_spine_Color_get_a)

static bool js_spine_Color_set_a(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    auto* cobj = SE_THIS_OBJECT<spine::Color>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Color_set_a : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= sevalue_to_native(args[0], &cobj->a, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_spine_Color_set_a : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_spine_Color_set_a)



bool js_register_spine_Color(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Color", obj, nullptr, nullptr);

    cls->defineProperty("r", _SE(js_spine_Color_get_r), _SE(js_spine_Color_set_r));
    cls->defineProperty("g", _SE(js_spine_Color_get_g), _SE(js_spine_Color_set_g));
    cls->defineProperty("b", _SE(js_spine_Color_get_b), _SE(js_spine_Color_set_b));
    cls->defineProperty("a", _SE(js_spine_Color_get_a), _SE(js_spine_Color_set_a));
    cls->defineFunction("clamp", _SE(js_spine_Color_clamp));
    cls->install();
    JSBClassType::registerClass<spine::Color>(cls);

    __jsb_spine_Color_proto = cls->getProto();
    __jsb_spine_Color_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_CurveTimeline_proto = nullptr;
se::Class* __jsb_spine_CurveTimeline_class = nullptr;

static bool js_spine_CurveTimeline_getCurvePercent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::CurveTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_CurveTimeline_getCurvePercent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<size_t, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_CurveTimeline_getCurvePercent : Error processing arguments");
        float result = cobj->getCurvePercent(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_CurveTimeline_getCurvePercent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_CurveTimeline_getCurvePercent)

static bool js_spine_CurveTimeline_getCurveType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::CurveTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_CurveTimeline_getCurveType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<size_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_CurveTimeline_getCurveType : Error processing arguments");
        float result = cobj->getCurveType(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_CurveTimeline_getCurveType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_CurveTimeline_getCurveType)

static bool js_spine_CurveTimeline_getFrameCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::CurveTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_CurveTimeline_getFrameCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        size_t result = cobj->getFrameCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_CurveTimeline_getFrameCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_CurveTimeline_getFrameCount)

static bool js_spine_CurveTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::CurveTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_CurveTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_CurveTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_CurveTimeline_getPropertyId)

static bool js_spine_CurveTimeline_setCurve(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::CurveTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_CurveTimeline_setCurve : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<size_t, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_CurveTimeline_setCurve : Error processing arguments");
        cobj->setCurve(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_spine_CurveTimeline_setCurve)

static bool js_spine_CurveTimeline_setLinear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::CurveTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_CurveTimeline_setLinear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<size_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_CurveTimeline_setLinear : Error processing arguments");
        cobj->setLinear(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_CurveTimeline_setLinear)

static bool js_spine_CurveTimeline_setStepped(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::CurveTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_CurveTimeline_setStepped : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<size_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_CurveTimeline_setStepped : Error processing arguments");
        cobj->setStepped(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_CurveTimeline_setStepped)



bool js_register_spine_CurveTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("CurveTimeline", obj, __jsb_spine_Timeline_proto, nullptr);

    cls->defineFunction("getCurvePercent", _SE(js_spine_CurveTimeline_getCurvePercent));
    cls->defineFunction("getCurveType", _SE(js_spine_CurveTimeline_getCurveType));
    cls->defineFunction("getFrameCount", _SE(js_spine_CurveTimeline_getFrameCount));
    cls->defineFunction("getPropertyId", _SE(js_spine_CurveTimeline_getPropertyId));
    cls->defineFunction("setCurve", _SE(js_spine_CurveTimeline_setCurve));
    cls->defineFunction("setLinear", _SE(js_spine_CurveTimeline_setLinear));
    cls->defineFunction("setStepped", _SE(js_spine_CurveTimeline_setStepped));
    cls->install();
    JSBClassType::registerClass<spine::CurveTimeline>(cls);

    __jsb_spine_CurveTimeline_proto = cls->getProto();
    __jsb_spine_CurveTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_ColorTimeline_proto = nullptr;
se::Class* __jsb_spine_ColorTimeline_class = nullptr;

static bool js_spine_ColorTimeline_getFrames(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ColorTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ColorTimeline_getFrames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<float>& result = cobj->getFrames();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_ColorTimeline_getFrames : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_ColorTimeline_getFrames)

static bool js_spine_ColorTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ColorTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ColorTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_ColorTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_ColorTimeline_getPropertyId)

static bool js_spine_ColorTimeline_getSlotIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ColorTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ColorTimeline_getSlotIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getSlotIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_ColorTimeline_getSlotIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_ColorTimeline_getSlotIndex)

static bool js_spine_ColorTimeline_setFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ColorTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ColorTimeline_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<int, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_ColorTimeline_setFrame : Error processing arguments");
        cobj->setFrame(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_spine_ColorTimeline_setFrame)

static bool js_spine_ColorTimeline_setSlotIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ColorTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ColorTimeline_setSlotIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_ColorTimeline_setSlotIndex : Error processing arguments");
        cobj->setSlotIndex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_ColorTimeline_setSlotIndex)



bool js_register_spine_ColorTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ColorTimeline", obj, __jsb_spine_CurveTimeline_proto, nullptr);

    cls->defineFunction("getFrames", _SE(js_spine_ColorTimeline_getFrames));
    cls->defineFunction("getPropertyId", _SE(js_spine_ColorTimeline_getPropertyId));
    cls->defineFunction("getSlotIndex", _SE(js_spine_ColorTimeline_getSlotIndex));
    cls->defineFunction("setFrame", _SE(js_spine_ColorTimeline_setFrame));
    cls->defineFunction("setSlotIndex", _SE(js_spine_ColorTimeline_setSlotIndex));
    cls->install();
    JSBClassType::registerClass<spine::ColorTimeline>(cls);

    __jsb_spine_ColorTimeline_proto = cls->getProto();
    __jsb_spine_ColorTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_ConstraintData_proto = nullptr;
se::Class* __jsb_spine_ConstraintData_class = nullptr;

static bool js_spine_ConstraintData_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ConstraintData_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_ConstraintData_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_ConstraintData_getName)

static bool js_spine_ConstraintData_getOrder(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ConstraintData_getOrder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        size_t result = cobj->getOrder();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_ConstraintData_getOrder : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_ConstraintData_getOrder)

static bool js_spine_ConstraintData_isSkinRequired(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ConstraintData_isSkinRequired : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isSkinRequired();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_ConstraintData_isSkinRequired : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_ConstraintData_isSkinRequired)

static bool js_spine_ConstraintData_setOrder(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ConstraintData_setOrder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<size_t, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_ConstraintData_setOrder : Error processing arguments");
        cobj->setOrder(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_ConstraintData_setOrder)

static bool js_spine_ConstraintData_setSkinRequired(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ConstraintData_setSkinRequired : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_ConstraintData_setSkinRequired : Error processing arguments");
        cobj->setSkinRequired(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_ConstraintData_setSkinRequired)



bool js_register_spine_ConstraintData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ConstraintData", obj, nullptr, nullptr);

    cls->defineFunction("getName", _SE(js_spine_ConstraintData_getName));
    cls->defineFunction("getOrder", _SE(js_spine_ConstraintData_getOrder));
    cls->defineFunction("isSkinRequired", _SE(js_spine_ConstraintData_isSkinRequired));
    cls->defineFunction("setOrder", _SE(js_spine_ConstraintData_setOrder));
    cls->defineFunction("setSkinRequired", _SE(js_spine_ConstraintData_setSkinRequired));
    cls->install();
    JSBClassType::registerClass<spine::ConstraintData>(cls);

    __jsb_spine_ConstraintData_proto = cls->getProto();
    __jsb_spine_ConstraintData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_DeformTimeline_proto = nullptr;
se::Class* __jsb_spine_DeformTimeline_class = nullptr;

static bool js_spine_DeformTimeline_getAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::DeformTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_DeformTimeline_getAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::VertexAttachment* result = cobj->getAttachment();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_DeformTimeline_getAttachment : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_DeformTimeline_getAttachment)

static bool js_spine_DeformTimeline_getFrames(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::DeformTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_DeformTimeline_getFrames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<float>& result = cobj->getFrames();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_DeformTimeline_getFrames : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_DeformTimeline_getFrames)

static bool js_spine_DeformTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::DeformTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_DeformTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_DeformTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_DeformTimeline_getPropertyId)

static bool js_spine_DeformTimeline_getSlotIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::DeformTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_DeformTimeline_getSlotIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getSlotIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_DeformTimeline_getSlotIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_DeformTimeline_getSlotIndex)

static bool js_spine_DeformTimeline_setAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::DeformTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_DeformTimeline_setAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::VertexAttachment*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_DeformTimeline_setAttachment : Error processing arguments");
        cobj->setAttachment(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_DeformTimeline_setAttachment)

static bool js_spine_DeformTimeline_setSlotIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::DeformTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_DeformTimeline_setSlotIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_DeformTimeline_setSlotIndex : Error processing arguments");
        cobj->setSlotIndex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_DeformTimeline_setSlotIndex)



bool js_register_spine_DeformTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DeformTimeline", obj, __jsb_spine_CurveTimeline_proto, nullptr);

    cls->defineFunction("getAttachment", _SE(js_spine_DeformTimeline_getAttachment));
    cls->defineFunction("getFrames", _SE(js_spine_DeformTimeline_getFrames));
    cls->defineFunction("getPropertyId", _SE(js_spine_DeformTimeline_getPropertyId));
    cls->defineFunction("getSlotIndex", _SE(js_spine_DeformTimeline_getSlotIndex));
    cls->defineFunction("setAttachment", _SE(js_spine_DeformTimeline_setAttachment));
    cls->defineFunction("setSlotIndex", _SE(js_spine_DeformTimeline_setSlotIndex));
    cls->install();
    JSBClassType::registerClass<spine::DeformTimeline>(cls);

    __jsb_spine_DeformTimeline_proto = cls->getProto();
    __jsb_spine_DeformTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_DrawOrderTimeline_proto = nullptr;
se::Class* __jsb_spine_DrawOrderTimeline_class = nullptr;

static bool js_spine_DrawOrderTimeline_getFrameCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::DrawOrderTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_DrawOrderTimeline_getFrameCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        size_t result = cobj->getFrameCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_DrawOrderTimeline_getFrameCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_DrawOrderTimeline_getFrameCount)

static bool js_spine_DrawOrderTimeline_getFrames(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::DrawOrderTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_DrawOrderTimeline_getFrames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<float>& result = cobj->getFrames();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_DrawOrderTimeline_getFrames : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_DrawOrderTimeline_getFrames)

static bool js_spine_DrawOrderTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::DrawOrderTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_DrawOrderTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_DrawOrderTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_DrawOrderTimeline_getPropertyId)



bool js_register_spine_DrawOrderTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("DrawOrderTimeline", obj, __jsb_spine_Timeline_proto, nullptr);

    cls->defineFunction("getFrameCount", _SE(js_spine_DrawOrderTimeline_getFrameCount));
    cls->defineFunction("getFrames", _SE(js_spine_DrawOrderTimeline_getFrames));
    cls->defineFunction("getPropertyId", _SE(js_spine_DrawOrderTimeline_getPropertyId));
    cls->install();
    JSBClassType::registerClass<spine::DrawOrderTimeline>(cls);

    __jsb_spine_DrawOrderTimeline_proto = cls->getProto();
    __jsb_spine_DrawOrderTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_Event_proto = nullptr;
se::Class* __jsb_spine_Event_class = nullptr;

static bool js_spine_Event_getBalance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Event>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Event_getBalance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getBalance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Event_getBalance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Event_getBalance)

static bool js_spine_Event_getData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Event>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Event_getData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::EventData& result = cobj->getData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Event_getData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Event_getData)

static bool js_spine_Event_getFloatValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Event>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Event_getFloatValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFloatValue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Event_getFloatValue : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Event_getFloatValue)

static bool js_spine_Event_getIntValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Event>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Event_getIntValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getIntValue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Event_getIntValue : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Event_getIntValue)

static bool js_spine_Event_getStringValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Event>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Event_getStringValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getStringValue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Event_getStringValue : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Event_getStringValue)

static bool js_spine_Event_getTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Event>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Event_getTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTime();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Event_getTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Event_getTime)

static bool js_spine_Event_getVolume(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Event>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Event_getVolume : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getVolume();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Event_getVolume : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Event_getVolume)

static bool js_spine_Event_setBalance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Event>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Event_setBalance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Event_setBalance : Error processing arguments");
        cobj->setBalance(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Event_setBalance)

static bool js_spine_Event_setFloatValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Event>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Event_setFloatValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Event_setFloatValue : Error processing arguments");
        cobj->setFloatValue(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Event_setFloatValue)

static bool js_spine_Event_setIntValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Event>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Event_setIntValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Event_setIntValue : Error processing arguments");
        cobj->setIntValue(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Event_setIntValue)

static bool js_spine_Event_setStringValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Event>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Event_setStringValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Event_setStringValue : Error processing arguments");
        cobj->setStringValue(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Event_setStringValue)

static bool js_spine_Event_setVolume(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Event>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Event_setVolume : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Event_setVolume : Error processing arguments");
        cobj->setVolume(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Event_setVolume)



bool js_register_spine_Event(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Event", obj, nullptr, nullptr);

    cls->defineFunction("getBalance", _SE(js_spine_Event_getBalance));
    cls->defineFunction("getData", _SE(js_spine_Event_getData));
    cls->defineFunction("getFloatValue", _SE(js_spine_Event_getFloatValue));
    cls->defineFunction("getIntValue", _SE(js_spine_Event_getIntValue));
    cls->defineFunction("getStringValue", _SE(js_spine_Event_getStringValue));
    cls->defineFunction("getTime", _SE(js_spine_Event_getTime));
    cls->defineFunction("getVolume", _SE(js_spine_Event_getVolume));
    cls->defineFunction("setBalance", _SE(js_spine_Event_setBalance));
    cls->defineFunction("setFloatValue", _SE(js_spine_Event_setFloatValue));
    cls->defineFunction("setIntValue", _SE(js_spine_Event_setIntValue));
    cls->defineFunction("setStringValue", _SE(js_spine_Event_setStringValue));
    cls->defineFunction("setVolume", _SE(js_spine_Event_setVolume));
    cls->install();
    JSBClassType::registerClass<spine::Event>(cls);

    __jsb_spine_Event_proto = cls->getProto();
    __jsb_spine_Event_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_EventData_proto = nullptr;
se::Class* __jsb_spine_EventData_class = nullptr;

static bool js_spine_EventData_getAudioPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_getAudioPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getAudioPath();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_EventData_getAudioPath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_getAudioPath)

static bool js_spine_EventData_getBalance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_getBalance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getBalance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_EventData_getBalance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_getBalance)

static bool js_spine_EventData_getFloatValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_getFloatValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFloatValue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_EventData_getFloatValue : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_getFloatValue)

static bool js_spine_EventData_getIntValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_getIntValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getIntValue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_EventData_getIntValue : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_getIntValue)

static bool js_spine_EventData_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_EventData_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_getName)

static bool js_spine_EventData_getStringValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_getStringValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getStringValue();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_EventData_getStringValue : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_getStringValue)

static bool js_spine_EventData_getVolume(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_getVolume : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getVolume();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_EventData_getVolume : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_getVolume)

static bool js_spine_EventData_setAudioPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_setAudioPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_EventData_setAudioPath : Error processing arguments");
        cobj->setAudioPath(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_setAudioPath)

static bool js_spine_EventData_setBalance(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_setBalance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_EventData_setBalance : Error processing arguments");
        cobj->setBalance(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_setBalance)

static bool js_spine_EventData_setFloatValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_setFloatValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_EventData_setFloatValue : Error processing arguments");
        cobj->setFloatValue(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_setFloatValue)

static bool js_spine_EventData_setIntValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_setIntValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_EventData_setIntValue : Error processing arguments");
        cobj->setIntValue(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_setIntValue)

static bool js_spine_EventData_setStringValue(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_setStringValue : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_EventData_setStringValue : Error processing arguments");
        cobj->setStringValue(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_setStringValue)

static bool js_spine_EventData_setVolume(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventData_setVolume : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_EventData_setVolume : Error processing arguments");
        cobj->setVolume(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_EventData_setVolume)



bool js_register_spine_EventData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("EventData", obj, nullptr, nullptr);

    cls->defineFunction("getAudioPath", _SE(js_spine_EventData_getAudioPath));
    cls->defineFunction("getBalance", _SE(js_spine_EventData_getBalance));
    cls->defineFunction("getFloatValue", _SE(js_spine_EventData_getFloatValue));
    cls->defineFunction("getIntValue", _SE(js_spine_EventData_getIntValue));
    cls->defineFunction("getName", _SE(js_spine_EventData_getName));
    cls->defineFunction("getStringValue", _SE(js_spine_EventData_getStringValue));
    cls->defineFunction("getVolume", _SE(js_spine_EventData_getVolume));
    cls->defineFunction("setAudioPath", _SE(js_spine_EventData_setAudioPath));
    cls->defineFunction("setBalance", _SE(js_spine_EventData_setBalance));
    cls->defineFunction("setFloatValue", _SE(js_spine_EventData_setFloatValue));
    cls->defineFunction("setIntValue", _SE(js_spine_EventData_setIntValue));
    cls->defineFunction("setStringValue", _SE(js_spine_EventData_setStringValue));
    cls->defineFunction("setVolume", _SE(js_spine_EventData_setVolume));
    cls->install();
    JSBClassType::registerClass<spine::EventData>(cls);

    __jsb_spine_EventData_proto = cls->getProto();
    __jsb_spine_EventData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_EventTimeline_proto = nullptr;
se::Class* __jsb_spine_EventTimeline_class = nullptr;

static bool js_spine_EventTimeline_getEvents(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventTimeline_getEvents : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::Event *>& result = cobj->getEvents();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_EventTimeline_getEvents : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_EventTimeline_getEvents)

static bool js_spine_EventTimeline_getFrameCount(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventTimeline_getFrameCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        size_t result = cobj->getFrameCount();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_EventTimeline_getFrameCount : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_EventTimeline_getFrameCount)

static bool js_spine_EventTimeline_getFrames(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventTimeline_getFrames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<float> result = cobj->getFrames();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_EventTimeline_getFrames : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_EventTimeline_getFrames)

static bool js_spine_EventTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_EventTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_EventTimeline_getPropertyId)

static bool js_spine_EventTimeline_setFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::EventTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_EventTimeline_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<size_t, false> arg0 = {};
        HolderType<spine::Event*, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_EventTimeline_setFrame : Error processing arguments");
        cobj->setFrame(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_EventTimeline_setFrame)



bool js_register_spine_EventTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("EventTimeline", obj, __jsb_spine_Timeline_proto, nullptr);

    cls->defineFunction("getEvents", _SE(js_spine_EventTimeline_getEvents));
    cls->defineFunction("getFrameCount", _SE(js_spine_EventTimeline_getFrameCount));
    cls->defineFunction("getFrames", _SE(js_spine_EventTimeline_getFrames));
    cls->defineFunction("getPropertyId", _SE(js_spine_EventTimeline_getPropertyId));
    cls->defineFunction("setFrame", _SE(js_spine_EventTimeline_setFrame));
    cls->install();
    JSBClassType::registerClass<spine::EventTimeline>(cls);

    __jsb_spine_EventTimeline_proto = cls->getProto();
    __jsb_spine_EventTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_IkConstraint_proto = nullptr;
se::Class* __jsb_spine_IkConstraint_class = nullptr;

static bool js_spine_IkConstraint_getBendDirection(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_getBendDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getBendDirection();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_getBendDirection : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_getBendDirection)

static bool js_spine_IkConstraint_getBones(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_getBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::Bone *>& result = cobj->getBones();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_getBones : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_getBones)

static bool js_spine_IkConstraint_getCompress(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_getCompress : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getCompress();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_getCompress : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_getCompress)

static bool js_spine_IkConstraint_getData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_getData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::IkConstraintData& result = cobj->getData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_getData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_getData)

static bool js_spine_IkConstraint_getMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_getMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_getMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_getMix)

static bool js_spine_IkConstraint_getOrder(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_getOrder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getOrder();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_getOrder : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_getOrder)

static bool js_spine_IkConstraint_getSoftness(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_getSoftness : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSoftness();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_getSoftness : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_getSoftness)

static bool js_spine_IkConstraint_getStretch(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_getStretch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getStretch();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_getStretch : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_getStretch)

static bool js_spine_IkConstraint_getTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_getTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Bone* result = cobj->getTarget();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_getTarget : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_getTarget)

static bool js_spine_IkConstraint_isActive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_isActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isActive();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_isActive : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_isActive)

static bool js_spine_IkConstraint_setActive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_setActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_setActive : Error processing arguments");
        cobj->setActive(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_setActive)

static bool js_spine_IkConstraint_setBendDirection(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_setBendDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_setBendDirection : Error processing arguments");
        cobj->setBendDirection(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_setBendDirection)

static bool js_spine_IkConstraint_setCompress(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_setCompress : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_setCompress : Error processing arguments");
        cobj->setCompress(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_setCompress)

static bool js_spine_IkConstraint_setMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_setMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_setMix : Error processing arguments");
        cobj->setMix(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_setMix)

static bool js_spine_IkConstraint_setSoftness(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_setSoftness : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_setSoftness : Error processing arguments");
        cobj->setSoftness(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_setSoftness)

static bool js_spine_IkConstraint_setStretch(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_setStretch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_setStretch : Error processing arguments");
        cobj->setStretch(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_setStretch)

static bool js_spine_IkConstraint_setTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_setTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::Bone*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraint_setTarget : Error processing arguments");
        cobj->setTarget(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_setTarget)

static bool js_spine_IkConstraint_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraint_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraint_update)



bool js_register_spine_IkConstraint(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IkConstraint", obj, nullptr, nullptr);

    cls->defineFunction("getBendDirection", _SE(js_spine_IkConstraint_getBendDirection));
    cls->defineFunction("getBones", _SE(js_spine_IkConstraint_getBones));
    cls->defineFunction("getCompress", _SE(js_spine_IkConstraint_getCompress));
    cls->defineFunction("getData", _SE(js_spine_IkConstraint_getData));
    cls->defineFunction("getMix", _SE(js_spine_IkConstraint_getMix));
    cls->defineFunction("getOrder", _SE(js_spine_IkConstraint_getOrder));
    cls->defineFunction("getSoftness", _SE(js_spine_IkConstraint_getSoftness));
    cls->defineFunction("getStretch", _SE(js_spine_IkConstraint_getStretch));
    cls->defineFunction("getTarget", _SE(js_spine_IkConstraint_getTarget));
    cls->defineFunction("isActive", _SE(js_spine_IkConstraint_isActive));
    cls->defineFunction("setActive", _SE(js_spine_IkConstraint_setActive));
    cls->defineFunction("setBendDirection", _SE(js_spine_IkConstraint_setBendDirection));
    cls->defineFunction("setCompress", _SE(js_spine_IkConstraint_setCompress));
    cls->defineFunction("setMix", _SE(js_spine_IkConstraint_setMix));
    cls->defineFunction("setSoftness", _SE(js_spine_IkConstraint_setSoftness));
    cls->defineFunction("setStretch", _SE(js_spine_IkConstraint_setStretch));
    cls->defineFunction("setTarget", _SE(js_spine_IkConstraint_setTarget));
    cls->defineFunction("update", _SE(js_spine_IkConstraint_update));
    cls->install();
    JSBClassType::registerClass<spine::IkConstraint>(cls);

    __jsb_spine_IkConstraint_proto = cls->getProto();
    __jsb_spine_IkConstraint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_IkConstraintData_proto = nullptr;
se::Class* __jsb_spine_IkConstraintData_class = nullptr;

static bool js_spine_IkConstraintData_getBendDirection(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_getBendDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getBendDirection();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_getBendDirection : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_getBendDirection)

static bool js_spine_IkConstraintData_getBones(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_getBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::BoneData *>& result = cobj->getBones();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_getBones : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_getBones)

static bool js_spine_IkConstraintData_getCompress(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_getCompress : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getCompress();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_getCompress : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_getCompress)

static bool js_spine_IkConstraintData_getMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_getMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_getMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_getMix)

static bool js_spine_IkConstraintData_getSoftness(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_getSoftness : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSoftness();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_getSoftness : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_getSoftness)

static bool js_spine_IkConstraintData_getStretch(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_getStretch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getStretch();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_getStretch : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_getStretch)

static bool js_spine_IkConstraintData_getTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_getTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::BoneData* result = cobj->getTarget();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_getTarget : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_getTarget)

static bool js_spine_IkConstraintData_getUniform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_getUniform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getUniform();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_getUniform : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_getUniform)

static bool js_spine_IkConstraintData_setBendDirection(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_setBendDirection : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_setBendDirection : Error processing arguments");
        cobj->setBendDirection(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_setBendDirection)

static bool js_spine_IkConstraintData_setCompress(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_setCompress : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_setCompress : Error processing arguments");
        cobj->setCompress(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_setCompress)

static bool js_spine_IkConstraintData_setMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_setMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_setMix : Error processing arguments");
        cobj->setMix(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_setMix)

static bool js_spine_IkConstraintData_setSoftness(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_setSoftness : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_setSoftness : Error processing arguments");
        cobj->setSoftness(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_setSoftness)

static bool js_spine_IkConstraintData_setStretch(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_setStretch : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_setStretch : Error processing arguments");
        cobj->setStretch(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_setStretch)

static bool js_spine_IkConstraintData_setTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_setTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::BoneData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_setTarget : Error processing arguments");
        cobj->setTarget(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_setTarget)

static bool js_spine_IkConstraintData_setUniform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintData_setUniform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintData_setUniform : Error processing arguments");
        cobj->setUniform(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintData_setUniform)



bool js_register_spine_IkConstraintData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IkConstraintData", obj, __jsb_spine_ConstraintData_proto, nullptr);

    cls->defineFunction("getBendDirection", _SE(js_spine_IkConstraintData_getBendDirection));
    cls->defineFunction("getBones", _SE(js_spine_IkConstraintData_getBones));
    cls->defineFunction("getCompress", _SE(js_spine_IkConstraintData_getCompress));
    cls->defineFunction("getMix", _SE(js_spine_IkConstraintData_getMix));
    cls->defineFunction("getSoftness", _SE(js_spine_IkConstraintData_getSoftness));
    cls->defineFunction("getStretch", _SE(js_spine_IkConstraintData_getStretch));
    cls->defineFunction("getTarget", _SE(js_spine_IkConstraintData_getTarget));
    cls->defineFunction("getUniform", _SE(js_spine_IkConstraintData_getUniform));
    cls->defineFunction("setBendDirection", _SE(js_spine_IkConstraintData_setBendDirection));
    cls->defineFunction("setCompress", _SE(js_spine_IkConstraintData_setCompress));
    cls->defineFunction("setMix", _SE(js_spine_IkConstraintData_setMix));
    cls->defineFunction("setSoftness", _SE(js_spine_IkConstraintData_setSoftness));
    cls->defineFunction("setStretch", _SE(js_spine_IkConstraintData_setStretch));
    cls->defineFunction("setTarget", _SE(js_spine_IkConstraintData_setTarget));
    cls->defineFunction("setUniform", _SE(js_spine_IkConstraintData_setUniform));
    cls->install();
    JSBClassType::registerClass<spine::IkConstraintData>(cls);

    __jsb_spine_IkConstraintData_proto = cls->getProto();
    __jsb_spine_IkConstraintData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_IkConstraintTimeline_proto = nullptr;
se::Class* __jsb_spine_IkConstraintTimeline_class = nullptr;

static bool js_spine_IkConstraintTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintTimeline_getPropertyId)

static bool js_spine_IkConstraintTimeline_setFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::IkConstraintTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_IkConstraintTimeline_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 7) {
        HolderType<int, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<int, false> arg4 = {};
        HolderType<bool, false> arg5 = {};
        HolderType<bool, false> arg6 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        ok &= sevalue_to_native(args[6], &arg6, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_IkConstraintTimeline_setFrame : Error processing arguments");
        cobj->setFrame(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 7);
    return false;
}
SE_BIND_FUNC(js_spine_IkConstraintTimeline_setFrame)



bool js_register_spine_IkConstraintTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("IkConstraintTimeline", obj, __jsb_spine_CurveTimeline_proto, nullptr);

    cls->defineFunction("getPropertyId", _SE(js_spine_IkConstraintTimeline_getPropertyId));
    cls->defineFunction("setFrame", _SE(js_spine_IkConstraintTimeline_setFrame));
    cls->install();
    JSBClassType::registerClass<spine::IkConstraintTimeline>(cls);

    __jsb_spine_IkConstraintTimeline_proto = cls->getProto();
    __jsb_spine_IkConstraintTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_MeshAttachment_proto = nullptr;
se::Class* __jsb_spine_MeshAttachment_class = nullptr;

static bool js_spine_MeshAttachment_copy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_copy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Attachment* result = cobj->copy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_copy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_copy)

static bool js_spine_MeshAttachment_getColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Color& result = cobj->getColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getColor)

static bool js_spine_MeshAttachment_getEdges(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getEdges : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<unsigned short>& result = cobj->getEdges();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getEdges : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getEdges)

static bool js_spine_MeshAttachment_getHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getHeight)

static bool js_spine_MeshAttachment_getHullLength(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getHullLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getHullLength();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getHullLength : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getHullLength)

static bool js_spine_MeshAttachment_getParentMesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getParentMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::MeshAttachment* result = cobj->getParentMesh();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getParentMesh : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getParentMesh)

static bool js_spine_MeshAttachment_getPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getPath();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getPath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getPath)

static bool js_spine_MeshAttachment_getRegionDegrees(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionDegrees : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getRegionDegrees();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionDegrees : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionDegrees)

static bool js_spine_MeshAttachment_getRegionHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionHeight)

static bool js_spine_MeshAttachment_getRegionOffsetX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionOffsetX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionOffsetX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionOffsetX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionOffsetX)

static bool js_spine_MeshAttachment_getRegionOffsetY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionOffsetY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionOffsetY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionOffsetY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionOffsetY)

static bool js_spine_MeshAttachment_getRegionOriginalHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionOriginalHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionOriginalHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionOriginalHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionOriginalHeight)

static bool js_spine_MeshAttachment_getRegionOriginalWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionOriginalWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionOriginalWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionOriginalWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionOriginalWidth)

static bool js_spine_MeshAttachment_getRegionRotate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionRotate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->getRegionRotate();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionRotate : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionRotate)

static bool js_spine_MeshAttachment_getRegionU(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionU : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionU();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionU : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionU)

static bool js_spine_MeshAttachment_getRegionU2(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionU2 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionU2();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionU2 : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionU2)

static bool js_spine_MeshAttachment_getRegionUVs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionUVs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<float>& result = cobj->getRegionUVs();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionUVs : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionUVs)

static bool js_spine_MeshAttachment_getRegionV(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionV : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionV();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionV : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionV)

static bool js_spine_MeshAttachment_getRegionV2(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionV2 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionV2();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionV2 : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionV2)

static bool js_spine_MeshAttachment_getRegionWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getRegionWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getRegionWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getRegionWidth)

static bool js_spine_MeshAttachment_getTriangles(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getTriangles : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<unsigned short>& result = cobj->getTriangles();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getTriangles : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getTriangles)

static bool js_spine_MeshAttachment_getUVs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getUVs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<float>& result = cobj->getUVs();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getUVs : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getUVs)

static bool js_spine_MeshAttachment_getWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_getWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_getWidth)

static bool js_spine_MeshAttachment_newLinkedMesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_newLinkedMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::MeshAttachment* result = cobj->newLinkedMesh();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_newLinkedMesh : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_newLinkedMesh)

static bool js_spine_MeshAttachment_setHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setHeight : Error processing arguments");
        cobj->setHeight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setHeight)

static bool js_spine_MeshAttachment_setHullLength(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setHullLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setHullLength : Error processing arguments");
        cobj->setHullLength(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setHullLength)

static bool js_spine_MeshAttachment_setParentMesh(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setParentMesh : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::MeshAttachment*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setParentMesh : Error processing arguments");
        cobj->setParentMesh(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setParentMesh)

static bool js_spine_MeshAttachment_setPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setPath : Error processing arguments");
        cobj->setPath(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setPath)

static bool js_spine_MeshAttachment_setRegionDegrees(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setRegionDegrees : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setRegionDegrees : Error processing arguments");
        cobj->setRegionDegrees(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setRegionDegrees)

static bool js_spine_MeshAttachment_setRegionHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setRegionHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setRegionHeight : Error processing arguments");
        cobj->setRegionHeight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setRegionHeight)

static bool js_spine_MeshAttachment_setRegionOffsetX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setRegionOffsetX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setRegionOffsetX : Error processing arguments");
        cobj->setRegionOffsetX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setRegionOffsetX)

static bool js_spine_MeshAttachment_setRegionOffsetY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setRegionOffsetY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setRegionOffsetY : Error processing arguments");
        cobj->setRegionOffsetY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setRegionOffsetY)

static bool js_spine_MeshAttachment_setRegionOriginalHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setRegionOriginalHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setRegionOriginalHeight : Error processing arguments");
        cobj->setRegionOriginalHeight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setRegionOriginalHeight)

static bool js_spine_MeshAttachment_setRegionOriginalWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setRegionOriginalWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setRegionOriginalWidth : Error processing arguments");
        cobj->setRegionOriginalWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setRegionOriginalWidth)

static bool js_spine_MeshAttachment_setRegionRotate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setRegionRotate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setRegionRotate : Error processing arguments");
        cobj->setRegionRotate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setRegionRotate)

static bool js_spine_MeshAttachment_setRegionU(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setRegionU : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setRegionU : Error processing arguments");
        cobj->setRegionU(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setRegionU)

static bool js_spine_MeshAttachment_setRegionU2(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setRegionU2 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setRegionU2 : Error processing arguments");
        cobj->setRegionU2(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setRegionU2)

static bool js_spine_MeshAttachment_setRegionV(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setRegionV : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setRegionV : Error processing arguments");
        cobj->setRegionV(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setRegionV)

static bool js_spine_MeshAttachment_setRegionV2(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setRegionV2 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setRegionV2 : Error processing arguments");
        cobj->setRegionV2(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setRegionV2)

static bool js_spine_MeshAttachment_setRegionWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setRegionWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setRegionWidth : Error processing arguments");
        cobj->setRegionWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setRegionWidth)

static bool js_spine_MeshAttachment_setWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_setWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_MeshAttachment_setWidth : Error processing arguments");
        cobj->setWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_setWidth)

static bool js_spine_MeshAttachment_updateUVs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::MeshAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_MeshAttachment_updateUVs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateUVs();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_MeshAttachment_updateUVs)



bool js_register_spine_MeshAttachment(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("MeshAttachment", obj, __jsb_spine_VertexAttachment_proto, nullptr);

    cls->defineFunction("copy", _SE(js_spine_MeshAttachment_copy));
    cls->defineFunction("getColor", _SE(js_spine_MeshAttachment_getColor));
    cls->defineFunction("getEdges", _SE(js_spine_MeshAttachment_getEdges));
    cls->defineFunction("getHeight", _SE(js_spine_MeshAttachment_getHeight));
    cls->defineFunction("getHullLength", _SE(js_spine_MeshAttachment_getHullLength));
    cls->defineFunction("getParentMesh", _SE(js_spine_MeshAttachment_getParentMesh));
    cls->defineFunction("getPath", _SE(js_spine_MeshAttachment_getPath));
    cls->defineFunction("getRegionDegrees", _SE(js_spine_MeshAttachment_getRegionDegrees));
    cls->defineFunction("getRegionHeight", _SE(js_spine_MeshAttachment_getRegionHeight));
    cls->defineFunction("getRegionOffsetX", _SE(js_spine_MeshAttachment_getRegionOffsetX));
    cls->defineFunction("getRegionOffsetY", _SE(js_spine_MeshAttachment_getRegionOffsetY));
    cls->defineFunction("getRegionOriginalHeight", _SE(js_spine_MeshAttachment_getRegionOriginalHeight));
    cls->defineFunction("getRegionOriginalWidth", _SE(js_spine_MeshAttachment_getRegionOriginalWidth));
    cls->defineFunction("getRegionRotate", _SE(js_spine_MeshAttachment_getRegionRotate));
    cls->defineFunction("getRegionU", _SE(js_spine_MeshAttachment_getRegionU));
    cls->defineFunction("getRegionU2", _SE(js_spine_MeshAttachment_getRegionU2));
    cls->defineFunction("getRegionUVs", _SE(js_spine_MeshAttachment_getRegionUVs));
    cls->defineFunction("getRegionV", _SE(js_spine_MeshAttachment_getRegionV));
    cls->defineFunction("getRegionV2", _SE(js_spine_MeshAttachment_getRegionV2));
    cls->defineFunction("getRegionWidth", _SE(js_spine_MeshAttachment_getRegionWidth));
    cls->defineFunction("getTriangles", _SE(js_spine_MeshAttachment_getTriangles));
    cls->defineFunction("getUVs", _SE(js_spine_MeshAttachment_getUVs));
    cls->defineFunction("getWidth", _SE(js_spine_MeshAttachment_getWidth));
    cls->defineFunction("newLinkedMesh", _SE(js_spine_MeshAttachment_newLinkedMesh));
    cls->defineFunction("setHeight", _SE(js_spine_MeshAttachment_setHeight));
    cls->defineFunction("setHullLength", _SE(js_spine_MeshAttachment_setHullLength));
    cls->defineFunction("setParentMesh", _SE(js_spine_MeshAttachment_setParentMesh));
    cls->defineFunction("setPath", _SE(js_spine_MeshAttachment_setPath));
    cls->defineFunction("setRegionDegrees", _SE(js_spine_MeshAttachment_setRegionDegrees));
    cls->defineFunction("setRegionHeight", _SE(js_spine_MeshAttachment_setRegionHeight));
    cls->defineFunction("setRegionOffsetX", _SE(js_spine_MeshAttachment_setRegionOffsetX));
    cls->defineFunction("setRegionOffsetY", _SE(js_spine_MeshAttachment_setRegionOffsetY));
    cls->defineFunction("setRegionOriginalHeight", _SE(js_spine_MeshAttachment_setRegionOriginalHeight));
    cls->defineFunction("setRegionOriginalWidth", _SE(js_spine_MeshAttachment_setRegionOriginalWidth));
    cls->defineFunction("setRegionRotate", _SE(js_spine_MeshAttachment_setRegionRotate));
    cls->defineFunction("setRegionU", _SE(js_spine_MeshAttachment_setRegionU));
    cls->defineFunction("setRegionU2", _SE(js_spine_MeshAttachment_setRegionU2));
    cls->defineFunction("setRegionV", _SE(js_spine_MeshAttachment_setRegionV));
    cls->defineFunction("setRegionV2", _SE(js_spine_MeshAttachment_setRegionV2));
    cls->defineFunction("setRegionWidth", _SE(js_spine_MeshAttachment_setRegionWidth));
    cls->defineFunction("setWidth", _SE(js_spine_MeshAttachment_setWidth));
    cls->defineFunction("updateUVs", _SE(js_spine_MeshAttachment_updateUVs));
    cls->install();
    JSBClassType::registerClass<spine::MeshAttachment>(cls);

    __jsb_spine_MeshAttachment_proto = cls->getProto();
    __jsb_spine_MeshAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_PathAttachment_proto = nullptr;
se::Class* __jsb_spine_PathAttachment_class = nullptr;

static bool js_spine_PathAttachment_copy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathAttachment_copy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Attachment* result = cobj->copy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathAttachment_copy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathAttachment_copy)

static bool js_spine_PathAttachment_getLengths(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathAttachment_getLengths : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<float>& result = cobj->getLengths();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathAttachment_getLengths : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathAttachment_getLengths)

static bool js_spine_PathAttachment_isClosed(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathAttachment_isClosed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isClosed();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathAttachment_isClosed : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathAttachment_isClosed)

static bool js_spine_PathAttachment_isConstantSpeed(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathAttachment_isConstantSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isConstantSpeed();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathAttachment_isConstantSpeed : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathAttachment_isConstantSpeed)

static bool js_spine_PathAttachment_setClosed(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathAttachment_setClosed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathAttachment_setClosed : Error processing arguments");
        cobj->setClosed(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathAttachment_setClosed)

static bool js_spine_PathAttachment_setConstantSpeed(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathAttachment_setConstantSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathAttachment_setConstantSpeed : Error processing arguments");
        cobj->setConstantSpeed(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathAttachment_setConstantSpeed)



bool js_register_spine_PathAttachment(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PathAttachment", obj, __jsb_spine_VertexAttachment_proto, nullptr);

    cls->defineFunction("copy", _SE(js_spine_PathAttachment_copy));
    cls->defineFunction("getLengths", _SE(js_spine_PathAttachment_getLengths));
    cls->defineFunction("isClosed", _SE(js_spine_PathAttachment_isClosed));
    cls->defineFunction("isConstantSpeed", _SE(js_spine_PathAttachment_isConstantSpeed));
    cls->defineFunction("setClosed", _SE(js_spine_PathAttachment_setClosed));
    cls->defineFunction("setConstantSpeed", _SE(js_spine_PathAttachment_setConstantSpeed));
    cls->install();
    JSBClassType::registerClass<spine::PathAttachment>(cls);

    __jsb_spine_PathAttachment_proto = cls->getProto();
    __jsb_spine_PathAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_PathConstraint_proto = nullptr;
se::Class* __jsb_spine_PathConstraint_class = nullptr;

static bool js_spine_PathConstraint_apply(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_apply : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->apply();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_apply)

static bool js_spine_PathConstraint_getBones(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_getBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::Bone *>& result = cobj->getBones();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_getBones : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_getBones)

static bool js_spine_PathConstraint_getData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_getData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::PathConstraintData& result = cobj->getData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_getData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_getData)

static bool js_spine_PathConstraint_getOrder(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_getOrder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getOrder();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_getOrder : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_getOrder)

static bool js_spine_PathConstraint_getPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_getPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getPosition();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_getPosition : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_getPosition)

static bool js_spine_PathConstraint_getRotateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_getRotateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRotateMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_getRotateMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_getRotateMix)

static bool js_spine_PathConstraint_getSpacing(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_getSpacing : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSpacing();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_getSpacing : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_getSpacing)

static bool js_spine_PathConstraint_getTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_getTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Slot* result = cobj->getTarget();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_getTarget : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_getTarget)

static bool js_spine_PathConstraint_getTranslateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_getTranslateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTranslateMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_getTranslateMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_getTranslateMix)

static bool js_spine_PathConstraint_isActive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_isActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isActive();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_isActive : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_isActive)

static bool js_spine_PathConstraint_setActive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_setActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_setActive : Error processing arguments");
        cobj->setActive(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_setActive)

static bool js_spine_PathConstraint_setPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_setPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_setPosition : Error processing arguments");
        cobj->setPosition(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_setPosition)

static bool js_spine_PathConstraint_setRotateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_setRotateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_setRotateMix : Error processing arguments");
        cobj->setRotateMix(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_setRotateMix)

static bool js_spine_PathConstraint_setSpacing(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_setSpacing : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_setSpacing : Error processing arguments");
        cobj->setSpacing(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_setSpacing)

static bool js_spine_PathConstraint_setTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_setTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::Slot*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_setTarget : Error processing arguments");
        cobj->setTarget(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_setTarget)

static bool js_spine_PathConstraint_setTranslateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_setTranslateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraint_setTranslateMix : Error processing arguments");
        cobj->setTranslateMix(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_setTranslateMix)

static bool js_spine_PathConstraint_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraint_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraint_update)



bool js_register_spine_PathConstraint(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PathConstraint", obj, nullptr, nullptr);

    cls->defineFunction("apply", _SE(js_spine_PathConstraint_apply));
    cls->defineFunction("getBones", _SE(js_spine_PathConstraint_getBones));
    cls->defineFunction("getData", _SE(js_spine_PathConstraint_getData));
    cls->defineFunction("getOrder", _SE(js_spine_PathConstraint_getOrder));
    cls->defineFunction("getPosition", _SE(js_spine_PathConstraint_getPosition));
    cls->defineFunction("getRotateMix", _SE(js_spine_PathConstraint_getRotateMix));
    cls->defineFunction("getSpacing", _SE(js_spine_PathConstraint_getSpacing));
    cls->defineFunction("getTarget", _SE(js_spine_PathConstraint_getTarget));
    cls->defineFunction("getTranslateMix", _SE(js_spine_PathConstraint_getTranslateMix));
    cls->defineFunction("isActive", _SE(js_spine_PathConstraint_isActive));
    cls->defineFunction("setActive", _SE(js_spine_PathConstraint_setActive));
    cls->defineFunction("setPosition", _SE(js_spine_PathConstraint_setPosition));
    cls->defineFunction("setRotateMix", _SE(js_spine_PathConstraint_setRotateMix));
    cls->defineFunction("setSpacing", _SE(js_spine_PathConstraint_setSpacing));
    cls->defineFunction("setTarget", _SE(js_spine_PathConstraint_setTarget));
    cls->defineFunction("setTranslateMix", _SE(js_spine_PathConstraint_setTranslateMix));
    cls->defineFunction("update", _SE(js_spine_PathConstraint_update));
    cls->install();
    JSBClassType::registerClass<spine::PathConstraint>(cls);

    __jsb_spine_PathConstraint_proto = cls->getProto();
    __jsb_spine_PathConstraint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_PathConstraintData_proto = nullptr;
se::Class* __jsb_spine_PathConstraintData_class = nullptr;

static bool js_spine_PathConstraintData_getBones(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_getBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::BoneData *>& result = cobj->getBones();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_getBones : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_getBones)

static bool js_spine_PathConstraintData_getOffsetRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_getOffsetRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOffsetRotation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_getOffsetRotation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_getOffsetRotation)

static bool js_spine_PathConstraintData_getPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_getPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getPosition();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_getPosition : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_getPosition)

static bool js_spine_PathConstraintData_getPositionMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_getPositionMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<unsigned int>(cobj->getPositionMode());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_getPositionMode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_getPositionMode)

static bool js_spine_PathConstraintData_getRotateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_getRotateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRotateMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_getRotateMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_getRotateMix)

static bool js_spine_PathConstraintData_getRotateMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_getRotateMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<unsigned int>(cobj->getRotateMode());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_getRotateMode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_getRotateMode)

static bool js_spine_PathConstraintData_getSpacing(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_getSpacing : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getSpacing();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_getSpacing : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_getSpacing)

static bool js_spine_PathConstraintData_getSpacingMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_getSpacingMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<unsigned int>(cobj->getSpacingMode());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_getSpacingMode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_getSpacingMode)

static bool js_spine_PathConstraintData_getTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_getTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::SlotData* result = cobj->getTarget();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_getTarget : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_getTarget)

static bool js_spine_PathConstraintData_getTranslateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_getTranslateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTranslateMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_getTranslateMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_getTranslateMix)

static bool js_spine_PathConstraintData_setOffsetRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_setOffsetRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_setOffsetRotation : Error processing arguments");
        cobj->setOffsetRotation(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_setOffsetRotation)

static bool js_spine_PathConstraintData_setPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_setPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_setPosition : Error processing arguments");
        cobj->setPosition(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_setPosition)

static bool js_spine_PathConstraintData_setPositionMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_setPositionMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::PositionMode, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_setPositionMode : Error processing arguments");
        cobj->setPositionMode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_setPositionMode)

static bool js_spine_PathConstraintData_setRotateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_setRotateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_setRotateMix : Error processing arguments");
        cobj->setRotateMix(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_setRotateMix)

static bool js_spine_PathConstraintData_setRotateMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_setRotateMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::RotateMode, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_setRotateMode : Error processing arguments");
        cobj->setRotateMode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_setRotateMode)

static bool js_spine_PathConstraintData_setSpacing(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_setSpacing : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_setSpacing : Error processing arguments");
        cobj->setSpacing(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_setSpacing)

static bool js_spine_PathConstraintData_setSpacingMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_setSpacingMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::SpacingMode, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_setSpacingMode : Error processing arguments");
        cobj->setSpacingMode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_setSpacingMode)

static bool js_spine_PathConstraintData_setTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_setTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::SlotData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_setTarget : Error processing arguments");
        cobj->setTarget(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_setTarget)

static bool js_spine_PathConstraintData_setTranslateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintData_setTranslateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintData_setTranslateMix : Error processing arguments");
        cobj->setTranslateMix(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintData_setTranslateMix)



bool js_register_spine_PathConstraintData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PathConstraintData", obj, __jsb_spine_ConstraintData_proto, nullptr);

    cls->defineFunction("getBones", _SE(js_spine_PathConstraintData_getBones));
    cls->defineFunction("getOffsetRotation", _SE(js_spine_PathConstraintData_getOffsetRotation));
    cls->defineFunction("getPosition", _SE(js_spine_PathConstraintData_getPosition));
    cls->defineFunction("getPositionMode", _SE(js_spine_PathConstraintData_getPositionMode));
    cls->defineFunction("getRotateMix", _SE(js_spine_PathConstraintData_getRotateMix));
    cls->defineFunction("getRotateMode", _SE(js_spine_PathConstraintData_getRotateMode));
    cls->defineFunction("getSpacing", _SE(js_spine_PathConstraintData_getSpacing));
    cls->defineFunction("getSpacingMode", _SE(js_spine_PathConstraintData_getSpacingMode));
    cls->defineFunction("getTarget", _SE(js_spine_PathConstraintData_getTarget));
    cls->defineFunction("getTranslateMix", _SE(js_spine_PathConstraintData_getTranslateMix));
    cls->defineFunction("setOffsetRotation", _SE(js_spine_PathConstraintData_setOffsetRotation));
    cls->defineFunction("setPosition", _SE(js_spine_PathConstraintData_setPosition));
    cls->defineFunction("setPositionMode", _SE(js_spine_PathConstraintData_setPositionMode));
    cls->defineFunction("setRotateMix", _SE(js_spine_PathConstraintData_setRotateMix));
    cls->defineFunction("setRotateMode", _SE(js_spine_PathConstraintData_setRotateMode));
    cls->defineFunction("setSpacing", _SE(js_spine_PathConstraintData_setSpacing));
    cls->defineFunction("setSpacingMode", _SE(js_spine_PathConstraintData_setSpacingMode));
    cls->defineFunction("setTarget", _SE(js_spine_PathConstraintData_setTarget));
    cls->defineFunction("setTranslateMix", _SE(js_spine_PathConstraintData_setTranslateMix));
    cls->install();
    JSBClassType::registerClass<spine::PathConstraintData>(cls);

    __jsb_spine_PathConstraintData_proto = cls->getProto();
    __jsb_spine_PathConstraintData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_PathConstraintMixTimeline_proto = nullptr;
se::Class* __jsb_spine_PathConstraintMixTimeline_class = nullptr;

static bool js_spine_PathConstraintMixTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintMixTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintMixTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintMixTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintMixTimeline_getPropertyId)



bool js_register_spine_PathConstraintMixTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PathConstraintMixTimeline", obj, __jsb_spine_CurveTimeline_proto, nullptr);

    cls->defineFunction("getPropertyId", _SE(js_spine_PathConstraintMixTimeline_getPropertyId));
    cls->install();
    JSBClassType::registerClass<spine::PathConstraintMixTimeline>(cls);

    __jsb_spine_PathConstraintMixTimeline_proto = cls->getProto();
    __jsb_spine_PathConstraintMixTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_PathConstraintPositionTimeline_proto = nullptr;
se::Class* __jsb_spine_PathConstraintPositionTimeline_class = nullptr;

static bool js_spine_PathConstraintPositionTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintPositionTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintPositionTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintPositionTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintPositionTimeline_getPropertyId)

static bool js_spine_PathConstraintPositionTimeline_setFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintPositionTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintPositionTimeline_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<int, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintPositionTimeline_setFrame : Error processing arguments");
        cobj->setFrame(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintPositionTimeline_setFrame)



bool js_register_spine_PathConstraintPositionTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PathConstraintPositionTimeline", obj, __jsb_spine_CurveTimeline_proto, nullptr);

    cls->defineFunction("getPropertyId", _SE(js_spine_PathConstraintPositionTimeline_getPropertyId));
    cls->defineFunction("setFrame", _SE(js_spine_PathConstraintPositionTimeline_setFrame));
    cls->install();
    JSBClassType::registerClass<spine::PathConstraintPositionTimeline>(cls);

    __jsb_spine_PathConstraintPositionTimeline_proto = cls->getProto();
    __jsb_spine_PathConstraintPositionTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_PathConstraintSpacingTimeline_proto = nullptr;
se::Class* __jsb_spine_PathConstraintSpacingTimeline_class = nullptr;

static bool js_spine_PathConstraintSpacingTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PathConstraintSpacingTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PathConstraintSpacingTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PathConstraintSpacingTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PathConstraintSpacingTimeline_getPropertyId)



bool js_register_spine_PathConstraintSpacingTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PathConstraintSpacingTimeline", obj, __jsb_spine_PathConstraintPositionTimeline_proto, nullptr);

    cls->defineFunction("getPropertyId", _SE(js_spine_PathConstraintSpacingTimeline_getPropertyId));
    cls->install();
    JSBClassType::registerClass<spine::PathConstraintSpacingTimeline>(cls);

    __jsb_spine_PathConstraintSpacingTimeline_proto = cls->getProto();
    __jsb_spine_PathConstraintSpacingTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_PointAttachment_proto = nullptr;
se::Class* __jsb_spine_PointAttachment_class = nullptr;

static bool js_spine_PointAttachment_copy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PointAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PointAttachment_copy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Attachment* result = cobj->copy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PointAttachment_copy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PointAttachment_copy)

static bool js_spine_PointAttachment_getRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PointAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PointAttachment_getRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRotation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PointAttachment_getRotation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PointAttachment_getRotation)

static bool js_spine_PointAttachment_getX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PointAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PointAttachment_getX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PointAttachment_getX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PointAttachment_getX)

static bool js_spine_PointAttachment_getY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PointAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PointAttachment_getY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_PointAttachment_getY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_PointAttachment_getY)

static bool js_spine_PointAttachment_setRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PointAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PointAttachment_setRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PointAttachment_setRotation : Error processing arguments");
        cobj->setRotation(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PointAttachment_setRotation)

static bool js_spine_PointAttachment_setX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PointAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PointAttachment_setX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PointAttachment_setX : Error processing arguments");
        cobj->setX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PointAttachment_setX)

static bool js_spine_PointAttachment_setY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::PointAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_PointAttachment_setY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_PointAttachment_setY : Error processing arguments");
        cobj->setY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_PointAttachment_setY)



bool js_register_spine_PointAttachment(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("PointAttachment", obj, __jsb_spine_Attachment_proto, nullptr);

    cls->defineFunction("copy", _SE(js_spine_PointAttachment_copy));
    cls->defineFunction("getRotation", _SE(js_spine_PointAttachment_getRotation));
    cls->defineFunction("getX", _SE(js_spine_PointAttachment_getX));
    cls->defineFunction("getY", _SE(js_spine_PointAttachment_getY));
    cls->defineFunction("setRotation", _SE(js_spine_PointAttachment_setRotation));
    cls->defineFunction("setX", _SE(js_spine_PointAttachment_setX));
    cls->defineFunction("setY", _SE(js_spine_PointAttachment_setY));
    cls->install();
    JSBClassType::registerClass<spine::PointAttachment>(cls);

    __jsb_spine_PointAttachment_proto = cls->getProto();
    __jsb_spine_PointAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_RegionAttachment_proto = nullptr;
se::Class* __jsb_spine_RegionAttachment_class = nullptr;

static bool js_spine_RegionAttachment_copy(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_copy : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Attachment* result = cobj->copy();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_copy : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_copy)

static bool js_spine_RegionAttachment_getColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Color& result = cobj->getColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getColor)

static bool js_spine_RegionAttachment_getHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getHeight)

static bool js_spine_RegionAttachment_getOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<float>& result = cobj->getOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getOffset)

static bool js_spine_RegionAttachment_getPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getPath();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getPath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getPath)

static bool js_spine_RegionAttachment_getRegionHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getRegionHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getRegionHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getRegionHeight)

static bool js_spine_RegionAttachment_getRegionOffsetX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getRegionOffsetX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionOffsetX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getRegionOffsetX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getRegionOffsetX)

static bool js_spine_RegionAttachment_getRegionOffsetY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getRegionOffsetY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionOffsetY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getRegionOffsetY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getRegionOffsetY)

static bool js_spine_RegionAttachment_getRegionOriginalHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getRegionOriginalHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionOriginalHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getRegionOriginalHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getRegionOriginalHeight)

static bool js_spine_RegionAttachment_getRegionOriginalWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getRegionOriginalWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionOriginalWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getRegionOriginalWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getRegionOriginalWidth)

static bool js_spine_RegionAttachment_getRegionWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getRegionWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRegionWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getRegionWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getRegionWidth)

static bool js_spine_RegionAttachment_getRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRotation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getRotation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getRotation)

static bool js_spine_RegionAttachment_getScaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getScaleX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScaleX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getScaleX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getScaleX)

static bool js_spine_RegionAttachment_getScaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getScaleY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScaleY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getScaleY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getScaleY)

static bool js_spine_RegionAttachment_getUVs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getUVs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<float>& result = cobj->getUVs();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getUVs : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getUVs)

static bool js_spine_RegionAttachment_getWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getWidth)

static bool js_spine_RegionAttachment_getX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getX)

static bool js_spine_RegionAttachment_getY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_getY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_getY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_getY)

static bool js_spine_RegionAttachment_setHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setHeight : Error processing arguments");
        cobj->setHeight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setHeight)

static bool js_spine_RegionAttachment_setPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setPath : Error processing arguments");
        cobj->setPath(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setPath)

static bool js_spine_RegionAttachment_setRegionHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setRegionHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setRegionHeight : Error processing arguments");
        cobj->setRegionHeight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setRegionHeight)

static bool js_spine_RegionAttachment_setRegionOffsetX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setRegionOffsetX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setRegionOffsetX : Error processing arguments");
        cobj->setRegionOffsetX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setRegionOffsetX)

static bool js_spine_RegionAttachment_setRegionOffsetY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setRegionOffsetY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setRegionOffsetY : Error processing arguments");
        cobj->setRegionOffsetY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setRegionOffsetY)

static bool js_spine_RegionAttachment_setRegionOriginalHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setRegionOriginalHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setRegionOriginalHeight : Error processing arguments");
        cobj->setRegionOriginalHeight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setRegionOriginalHeight)

static bool js_spine_RegionAttachment_setRegionOriginalWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setRegionOriginalWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setRegionOriginalWidth : Error processing arguments");
        cobj->setRegionOriginalWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setRegionOriginalWidth)

static bool js_spine_RegionAttachment_setRegionWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setRegionWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setRegionWidth : Error processing arguments");
        cobj->setRegionWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setRegionWidth)

static bool js_spine_RegionAttachment_setRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setRotation : Error processing arguments");
        cobj->setRotation(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setRotation)

static bool js_spine_RegionAttachment_setScaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setScaleX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setScaleX : Error processing arguments");
        cobj->setScaleX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setScaleX)

static bool js_spine_RegionAttachment_setScaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setScaleY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setScaleY : Error processing arguments");
        cobj->setScaleY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setScaleY)

static bool js_spine_RegionAttachment_setUVs(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setUVs : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<bool, false> arg4 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setUVs : Error processing arguments");
        cobj->setUVs(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setUVs)

static bool js_spine_RegionAttachment_setWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setWidth : Error processing arguments");
        cobj->setWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setWidth)

static bool js_spine_RegionAttachment_setX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setX : Error processing arguments");
        cobj->setX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setX)

static bool js_spine_RegionAttachment_setY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_setY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RegionAttachment_setY : Error processing arguments");
        cobj->setY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_setY)

static bool js_spine_RegionAttachment_updateOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RegionAttachment>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RegionAttachment_updateOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateOffset();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RegionAttachment_updateOffset)



bool js_register_spine_RegionAttachment(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RegionAttachment", obj, __jsb_spine_Attachment_proto, nullptr);

    cls->defineFunction("copy", _SE(js_spine_RegionAttachment_copy));
    cls->defineFunction("getColor", _SE(js_spine_RegionAttachment_getColor));
    cls->defineFunction("getHeight", _SE(js_spine_RegionAttachment_getHeight));
    cls->defineFunction("getOffset", _SE(js_spine_RegionAttachment_getOffset));
    cls->defineFunction("getPath", _SE(js_spine_RegionAttachment_getPath));
    cls->defineFunction("getRegionHeight", _SE(js_spine_RegionAttachment_getRegionHeight));
    cls->defineFunction("getRegionOffsetX", _SE(js_spine_RegionAttachment_getRegionOffsetX));
    cls->defineFunction("getRegionOffsetY", _SE(js_spine_RegionAttachment_getRegionOffsetY));
    cls->defineFunction("getRegionOriginalHeight", _SE(js_spine_RegionAttachment_getRegionOriginalHeight));
    cls->defineFunction("getRegionOriginalWidth", _SE(js_spine_RegionAttachment_getRegionOriginalWidth));
    cls->defineFunction("getRegionWidth", _SE(js_spine_RegionAttachment_getRegionWidth));
    cls->defineFunction("getRotation", _SE(js_spine_RegionAttachment_getRotation));
    cls->defineFunction("getScaleX", _SE(js_spine_RegionAttachment_getScaleX));
    cls->defineFunction("getScaleY", _SE(js_spine_RegionAttachment_getScaleY));
    cls->defineFunction("getUVs", _SE(js_spine_RegionAttachment_getUVs));
    cls->defineFunction("getWidth", _SE(js_spine_RegionAttachment_getWidth));
    cls->defineFunction("getX", _SE(js_spine_RegionAttachment_getX));
    cls->defineFunction("getY", _SE(js_spine_RegionAttachment_getY));
    cls->defineFunction("setHeight", _SE(js_spine_RegionAttachment_setHeight));
    cls->defineFunction("setPath", _SE(js_spine_RegionAttachment_setPath));
    cls->defineFunction("setRegionHeight", _SE(js_spine_RegionAttachment_setRegionHeight));
    cls->defineFunction("setRegionOffsetX", _SE(js_spine_RegionAttachment_setRegionOffsetX));
    cls->defineFunction("setRegionOffsetY", _SE(js_spine_RegionAttachment_setRegionOffsetY));
    cls->defineFunction("setRegionOriginalHeight", _SE(js_spine_RegionAttachment_setRegionOriginalHeight));
    cls->defineFunction("setRegionOriginalWidth", _SE(js_spine_RegionAttachment_setRegionOriginalWidth));
    cls->defineFunction("setRegionWidth", _SE(js_spine_RegionAttachment_setRegionWidth));
    cls->defineFunction("setRotation", _SE(js_spine_RegionAttachment_setRotation));
    cls->defineFunction("setScaleX", _SE(js_spine_RegionAttachment_setScaleX));
    cls->defineFunction("setScaleY", _SE(js_spine_RegionAttachment_setScaleY));
    cls->defineFunction("setUVs", _SE(js_spine_RegionAttachment_setUVs));
    cls->defineFunction("setWidth", _SE(js_spine_RegionAttachment_setWidth));
    cls->defineFunction("setX", _SE(js_spine_RegionAttachment_setX));
    cls->defineFunction("setY", _SE(js_spine_RegionAttachment_setY));
    cls->defineFunction("updateOffset", _SE(js_spine_RegionAttachment_updateOffset));
    cls->install();
    JSBClassType::registerClass<spine::RegionAttachment>(cls);

    __jsb_spine_RegionAttachment_proto = cls->getProto();
    __jsb_spine_RegionAttachment_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_RotateTimeline_proto = nullptr;
se::Class* __jsb_spine_RotateTimeline_class = nullptr;

static bool js_spine_RotateTimeline_getBoneIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RotateTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RotateTimeline_getBoneIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getBoneIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RotateTimeline_getBoneIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RotateTimeline_getBoneIndex)

static bool js_spine_RotateTimeline_getFrames(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RotateTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RotateTimeline_getFrames : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<float>& result = cobj->getFrames();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RotateTimeline_getFrames : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RotateTimeline_getFrames)

static bool js_spine_RotateTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RotateTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RotateTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_RotateTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_RotateTimeline_getPropertyId)

static bool js_spine_RotateTimeline_setBoneIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RotateTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RotateTimeline_setBoneIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RotateTimeline_setBoneIndex : Error processing arguments");
        cobj->setBoneIndex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_RotateTimeline_setBoneIndex)

static bool js_spine_RotateTimeline_setFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::RotateTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_RotateTimeline_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<int, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_RotateTimeline_setFrame : Error processing arguments");
        cobj->setFrame(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_spine_RotateTimeline_setFrame)



bool js_register_spine_RotateTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("RotateTimeline", obj, __jsb_spine_CurveTimeline_proto, nullptr);

    cls->defineFunction("getBoneIndex", _SE(js_spine_RotateTimeline_getBoneIndex));
    cls->defineFunction("getFrames", _SE(js_spine_RotateTimeline_getFrames));
    cls->defineFunction("getPropertyId", _SE(js_spine_RotateTimeline_getPropertyId));
    cls->defineFunction("setBoneIndex", _SE(js_spine_RotateTimeline_setBoneIndex));
    cls->defineFunction("setFrame", _SE(js_spine_RotateTimeline_setFrame));
    cls->install();
    JSBClassType::registerClass<spine::RotateTimeline>(cls);

    __jsb_spine_RotateTimeline_proto = cls->getProto();
    __jsb_spine_RotateTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_TranslateTimeline_proto = nullptr;
se::Class* __jsb_spine_TranslateTimeline_class = nullptr;

static bool js_spine_TranslateTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TranslateTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TranslateTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TranslateTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TranslateTimeline_getPropertyId)

static bool js_spine_TranslateTimeline_setFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TranslateTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TranslateTimeline_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<int, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TranslateTimeline_setFrame : Error processing arguments");
        cobj->setFrame(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_spine_TranslateTimeline_setFrame)



bool js_register_spine_TranslateTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TranslateTimeline", obj, __jsb_spine_CurveTimeline_proto, nullptr);

    cls->defineFunction("getPropertyId", _SE(js_spine_TranslateTimeline_getPropertyId));
    cls->defineFunction("setFrame", _SE(js_spine_TranslateTimeline_setFrame));
    cls->install();
    JSBClassType::registerClass<spine::TranslateTimeline>(cls);

    __jsb_spine_TranslateTimeline_proto = cls->getProto();
    __jsb_spine_TranslateTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_ScaleTimeline_proto = nullptr;
se::Class* __jsb_spine_ScaleTimeline_class = nullptr;

static bool js_spine_ScaleTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ScaleTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ScaleTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_ScaleTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_ScaleTimeline_getPropertyId)



bool js_register_spine_ScaleTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ScaleTimeline", obj, __jsb_spine_TranslateTimeline_proto, nullptr);

    cls->defineFunction("getPropertyId", _SE(js_spine_ScaleTimeline_getPropertyId));
    cls->install();
    JSBClassType::registerClass<spine::ScaleTimeline>(cls);

    __jsb_spine_ScaleTimeline_proto = cls->getProto();
    __jsb_spine_ScaleTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_ShearTimeline_proto = nullptr;
se::Class* __jsb_spine_ShearTimeline_class = nullptr;

static bool js_spine_ShearTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::ShearTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_ShearTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_ShearTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_ShearTimeline_getPropertyId)



bool js_register_spine_ShearTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("ShearTimeline", obj, __jsb_spine_TranslateTimeline_proto, nullptr);

    cls->defineFunction("getPropertyId", _SE(js_spine_ShearTimeline_getPropertyId));
    cls->install();
    JSBClassType::registerClass<spine::ShearTimeline>(cls);

    __jsb_spine_ShearTimeline_proto = cls->getProto();
    __jsb_spine_ShearTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_Skeleton_proto = nullptr;
se::Class* __jsb_spine_Skeleton_class = nullptr;

static bool js_spine_Skeleton_findBone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_findBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findBone : Error processing arguments");
        spine::Bone* result = cobj->findBone(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findBone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_findBone)

static bool js_spine_Skeleton_findBoneIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_findBoneIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findBoneIndex : Error processing arguments");
        int result = cobj->findBoneIndex(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findBoneIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_findBoneIndex)

static bool js_spine_Skeleton_findIkConstraint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_findIkConstraint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findIkConstraint : Error processing arguments");
        spine::IkConstraint* result = cobj->findIkConstraint(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findIkConstraint : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_findIkConstraint)

static bool js_spine_Skeleton_findPathConstraint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_findPathConstraint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findPathConstraint : Error processing arguments");
        spine::PathConstraint* result = cobj->findPathConstraint(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findPathConstraint : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_findPathConstraint)

static bool js_spine_Skeleton_findSlot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_findSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findSlot : Error processing arguments");
        spine::Slot* result = cobj->findSlot(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findSlot : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_findSlot)

static bool js_spine_Skeleton_findSlotIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_findSlotIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findSlotIndex : Error processing arguments");
        int result = cobj->findSlotIndex(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findSlotIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_findSlotIndex)

static bool js_spine_Skeleton_findTransformConstraint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_findTransformConstraint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findTransformConstraint : Error processing arguments");
        spine::TransformConstraint* result = cobj->findTransformConstraint(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_findTransformConstraint : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_findTransformConstraint)

static bool js_spine_Skeleton_getAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2( cobj, false, "js_spine_Skeleton_getAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<int, false> arg0 = {};
            HolderType<spine::String, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::Attachment* result = cobj->getAttachment(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getAttachment : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<spine::String, true> arg0 = {};
            HolderType<spine::String, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::Attachment* result = cobj->getAttachment(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getAttachment : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getAttachment)

static bool js_spine_Skeleton_getBones(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::Bone *>& result = cobj->getBones();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getBones : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getBones)

static bool js_spine_Skeleton_getColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Color& result = cobj->getColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getColor)

static bool js_spine_Skeleton_getData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::SkeletonData* result = cobj->getData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getData)

static bool js_spine_Skeleton_getDrawOrder(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getDrawOrder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::Slot *>& result = cobj->getDrawOrder();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getDrawOrder : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getDrawOrder)

static bool js_spine_Skeleton_getIkConstraints(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getIkConstraints : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::IkConstraint *>& result = cobj->getIkConstraints();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getIkConstraints : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getIkConstraints)

static bool js_spine_Skeleton_getPathConstraints(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getPathConstraints : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::PathConstraint *>& result = cobj->getPathConstraints();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getPathConstraints : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getPathConstraints)

static bool js_spine_Skeleton_getRootBone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getRootBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Bone* result = cobj->getRootBone();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getRootBone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getRootBone)

static bool js_spine_Skeleton_getScaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getScaleX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScaleX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getScaleX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getScaleX)

static bool js_spine_Skeleton_getScaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getScaleY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScaleY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getScaleY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getScaleY)

static bool js_spine_Skeleton_getSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Skin* result = cobj->getSkin();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getSkin : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getSkin)

static bool js_spine_Skeleton_getSlots(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getSlots : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::Slot *>& result = cobj->getSlots();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getSlots : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getSlots)

static bool js_spine_Skeleton_getTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTime();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getTime)

static bool js_spine_Skeleton_getTransformConstraints(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getTransformConstraints : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::TransformConstraint *>& result = cobj->getTransformConstraints();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getTransformConstraints : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getTransformConstraints)

static bool js_spine_Skeleton_getUpdateCacheList(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getUpdateCacheList : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::Updatable *>& result = cobj->getUpdateCacheList();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getUpdateCacheList : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getUpdateCacheList)

static bool js_spine_Skeleton_getX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getX)

static bool js_spine_Skeleton_getY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_getY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_getY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_getY)

static bool js_spine_Skeleton_printUpdateCache(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_printUpdateCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->printUpdateCache();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_printUpdateCache)

static bool js_spine_Skeleton_setAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_setAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<spine::String, true> arg0 = {};
        HolderType<spine::String, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_setAttachment : Error processing arguments");
        cobj->setAttachment(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_setAttachment)

static bool js_spine_Skeleton_setBonesToSetupPose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_setBonesToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setBonesToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_setBonesToSetupPose)

static bool js_spine_Skeleton_setPosition(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_setPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_setPosition : Error processing arguments");
        cobj->setPosition(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_setPosition)

static bool js_spine_Skeleton_setScaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_setScaleX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_setScaleX : Error processing arguments");
        cobj->setScaleX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_setScaleX)

static bool js_spine_Skeleton_setScaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_setScaleY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_setScaleY : Error processing arguments");
        cobj->setScaleY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_setScaleY)

static bool js_spine_Skeleton_setSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2( cobj, false, "js_spine_Skeleton_setSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<spine::Skin*, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setSkin(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<spine::String, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setSkin(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_setSkin)

static bool js_spine_Skeleton_setSlotsToSetupPose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_setSlotsToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setSlotsToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_setSlotsToSetupPose)

static bool js_spine_Skeleton_setTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_setTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_setTime : Error processing arguments");
        cobj->setTime(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_setTime)

static bool js_spine_Skeleton_setToSetupPose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_setToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_setToSetupPose)

static bool js_spine_Skeleton_setX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_setX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_setX : Error processing arguments");
        cobj->setX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_setX)

static bool js_spine_Skeleton_setY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_setY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_setY : Error processing arguments");
        cobj->setY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_setY)

static bool js_spine_Skeleton_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skeleton_update : Error processing arguments");
        cobj->update(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_update)

static bool js_spine_Skeleton_updateCache(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_updateCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateCache();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_updateCache)

static bool js_spine_Skeleton_updateWorldTransform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skeleton>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skeleton_updateWorldTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateWorldTransform();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skeleton_updateWorldTransform)



bool js_register_spine_Skeleton(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Skeleton", obj, nullptr, nullptr);

    cls->defineFunction("findBone", _SE(js_spine_Skeleton_findBone));
    cls->defineFunction("findBoneIndex", _SE(js_spine_Skeleton_findBoneIndex));
    cls->defineFunction("findIkConstraint", _SE(js_spine_Skeleton_findIkConstraint));
    cls->defineFunction("findPathConstraint", _SE(js_spine_Skeleton_findPathConstraint));
    cls->defineFunction("findSlot", _SE(js_spine_Skeleton_findSlot));
    cls->defineFunction("findSlotIndex", _SE(js_spine_Skeleton_findSlotIndex));
    cls->defineFunction("findTransformConstraint", _SE(js_spine_Skeleton_findTransformConstraint));
    cls->defineFunction("getAttachment", _SE(js_spine_Skeleton_getAttachment));
    cls->defineFunction("getBones", _SE(js_spine_Skeleton_getBones));
    cls->defineFunction("getColor", _SE(js_spine_Skeleton_getColor));
    cls->defineFunction("getData", _SE(js_spine_Skeleton_getData));
    cls->defineFunction("getDrawOrder", _SE(js_spine_Skeleton_getDrawOrder));
    cls->defineFunction("getIkConstraints", _SE(js_spine_Skeleton_getIkConstraints));
    cls->defineFunction("getPathConstraints", _SE(js_spine_Skeleton_getPathConstraints));
    cls->defineFunction("getRootBone", _SE(js_spine_Skeleton_getRootBone));
    cls->defineFunction("getScaleX", _SE(js_spine_Skeleton_getScaleX));
    cls->defineFunction("getScaleY", _SE(js_spine_Skeleton_getScaleY));
    cls->defineFunction("getSkin", _SE(js_spine_Skeleton_getSkin));
    cls->defineFunction("getSlots", _SE(js_spine_Skeleton_getSlots));
    cls->defineFunction("getTime", _SE(js_spine_Skeleton_getTime));
    cls->defineFunction("getTransformConstraints", _SE(js_spine_Skeleton_getTransformConstraints));
    cls->defineFunction("getUpdateCacheList", _SE(js_spine_Skeleton_getUpdateCacheList));
    cls->defineFunction("getX", _SE(js_spine_Skeleton_getX));
    cls->defineFunction("getY", _SE(js_spine_Skeleton_getY));
    cls->defineFunction("printUpdateCache", _SE(js_spine_Skeleton_printUpdateCache));
    cls->defineFunction("setAttachment", _SE(js_spine_Skeleton_setAttachment));
    cls->defineFunction("setBonesToSetupPose", _SE(js_spine_Skeleton_setBonesToSetupPose));
    cls->defineFunction("setPosition", _SE(js_spine_Skeleton_setPosition));
    cls->defineFunction("setScaleX", _SE(js_spine_Skeleton_setScaleX));
    cls->defineFunction("setScaleY", _SE(js_spine_Skeleton_setScaleY));
    cls->defineFunction("setSkin", _SE(js_spine_Skeleton_setSkin));
    cls->defineFunction("setSlotsToSetupPose", _SE(js_spine_Skeleton_setSlotsToSetupPose));
    cls->defineFunction("setTime", _SE(js_spine_Skeleton_setTime));
    cls->defineFunction("setToSetupPose", _SE(js_spine_Skeleton_setToSetupPose));
    cls->defineFunction("setX", _SE(js_spine_Skeleton_setX));
    cls->defineFunction("setY", _SE(js_spine_Skeleton_setY));
    cls->defineFunction("update", _SE(js_spine_Skeleton_update));
    cls->defineFunction("updateCache", _SE(js_spine_Skeleton_updateCache));
    cls->defineFunction("updateWorldTransform", _SE(js_spine_Skeleton_updateWorldTransform));
    cls->install();
    JSBClassType::registerClass<spine::Skeleton>(cls);

    __jsb_spine_Skeleton_proto = cls->getProto();
    __jsb_spine_Skeleton_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_SkeletonBounds_proto = nullptr;
se::Class* __jsb_spine_SkeletonBounds_class = nullptr;

static bool js_spine_SkeletonBounds_aabbcontainsPoint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonBounds>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonBounds_aabbcontainsPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonBounds_aabbcontainsPoint : Error processing arguments");
        bool result = cobj->aabbcontainsPoint(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonBounds_aabbcontainsPoint : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonBounds_aabbcontainsPoint)

static bool js_spine_SkeletonBounds_aabbintersectsSegment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonBounds>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonBounds_aabbintersectsSegment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonBounds_aabbintersectsSegment : Error processing arguments");
        bool result = cobj->aabbintersectsSegment(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonBounds_aabbintersectsSegment : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonBounds_aabbintersectsSegment)

static bool js_spine_SkeletonBounds_containsPoint(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonBounds>(s);
    SE_PRECONDITION2( cobj, false, "js_spine_SkeletonBounds_containsPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<float, false> arg0 = {};
            HolderType<float, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::BoundingBoxAttachment* result = cobj->containsPoint(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_SkeletonBounds_containsPoint : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 3) {
            HolderType<spine::Polygon*, false> arg0 = {};
            HolderType<float, false> arg1 = {};
            HolderType<float, false> arg2 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            bool result = cobj->containsPoint(arg0.value(), arg1.value(), arg2.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_SkeletonBounds_containsPoint : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonBounds_containsPoint)

static bool js_spine_SkeletonBounds_getHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonBounds>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonBounds_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonBounds_getHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonBounds_getHeight)

static bool js_spine_SkeletonBounds_getPolygon(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonBounds>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonBounds_getPolygon : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::BoundingBoxAttachment*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonBounds_getPolygon : Error processing arguments");
        spine::Polygon* result = cobj->getPolygon(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonBounds_getPolygon : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonBounds_getPolygon)

static bool js_spine_SkeletonBounds_getWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonBounds>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonBounds_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonBounds_getWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonBounds_getWidth)

static bool js_spine_SkeletonBounds_intersectsSegment(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonBounds>(s);
    SE_PRECONDITION2( cobj, false, "js_spine_SkeletonBounds_intersectsSegment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 5) {
            HolderType<spine::Polygon*, false> arg0 = {};
            HolderType<float, false> arg1 = {};
            HolderType<float, false> arg2 = {};
            HolderType<float, false> arg3 = {};
            HolderType<float, false> arg4 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
            if (!ok) { ok = true; break; }
            bool result = cobj->intersectsSegment(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_SkeletonBounds_intersectsSegment : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 4) {
            HolderType<float, false> arg0 = {};
            HolderType<float, false> arg1 = {};
            HolderType<float, false> arg2 = {};
            HolderType<float, false> arg3 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::BoundingBoxAttachment* result = cobj->intersectsSegment(arg0.value(), arg1.value(), arg2.value(), arg3.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_SkeletonBounds_intersectsSegment : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonBounds_intersectsSegment)



bool js_register_spine_SkeletonBounds(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SkeletonBounds", obj, nullptr, nullptr);

    cls->defineFunction("aabbcontainsPoint", _SE(js_spine_SkeletonBounds_aabbcontainsPoint));
    cls->defineFunction("aabbintersectsSegment", _SE(js_spine_SkeletonBounds_aabbintersectsSegment));
    cls->defineFunction("containsPoint", _SE(js_spine_SkeletonBounds_containsPoint));
    cls->defineFunction("getHeight", _SE(js_spine_SkeletonBounds_getHeight));
    cls->defineFunction("getPolygon", _SE(js_spine_SkeletonBounds_getPolygon));
    cls->defineFunction("getWidth", _SE(js_spine_SkeletonBounds_getWidth));
    cls->defineFunction("intersectsSegment", _SE(js_spine_SkeletonBounds_intersectsSegment));
    cls->install();
    JSBClassType::registerClass<spine::SkeletonBounds>(cls);

    __jsb_spine_SkeletonBounds_proto = cls->getProto();
    __jsb_spine_SkeletonBounds_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_Polygon_proto = nullptr;
se::Class* __jsb_spine_Polygon_class = nullptr;



bool js_register_spine_Polygon(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Polygon", obj, nullptr, nullptr);

    cls->install();
    JSBClassType::registerClass<spine::Polygon>(cls);

    __jsb_spine_Polygon_proto = cls->getProto();
    __jsb_spine_Polygon_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_SkeletonData_proto = nullptr;
se::Class* __jsb_spine_SkeletonData_class = nullptr;

static bool js_spine_SkeletonData_findAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_findAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findAnimation : Error processing arguments");
        spine::Animation* result = cobj->findAnimation(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_findAnimation)

static bool js_spine_SkeletonData_findBone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_findBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findBone : Error processing arguments");
        spine::BoneData* result = cobj->findBone(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findBone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_findBone)

static bool js_spine_SkeletonData_findBoneIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_findBoneIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findBoneIndex : Error processing arguments");
        int result = cobj->findBoneIndex(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findBoneIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_findBoneIndex)

static bool js_spine_SkeletonData_findEvent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_findEvent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findEvent : Error processing arguments");
        spine::EventData* result = cobj->findEvent(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findEvent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_findEvent)

static bool js_spine_SkeletonData_findIkConstraint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_findIkConstraint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findIkConstraint : Error processing arguments");
        spine::IkConstraintData* result = cobj->findIkConstraint(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findIkConstraint : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_findIkConstraint)

static bool js_spine_SkeletonData_findPathConstraint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_findPathConstraint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findPathConstraint : Error processing arguments");
        spine::PathConstraintData* result = cobj->findPathConstraint(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findPathConstraint : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_findPathConstraint)

static bool js_spine_SkeletonData_findPathConstraintIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_findPathConstraintIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findPathConstraintIndex : Error processing arguments");
        int result = cobj->findPathConstraintIndex(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findPathConstraintIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_findPathConstraintIndex)

static bool js_spine_SkeletonData_findSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_findSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findSkin : Error processing arguments");
        spine::Skin* result = cobj->findSkin(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findSkin : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_findSkin)

static bool js_spine_SkeletonData_findSlot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_findSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findSlot : Error processing arguments");
        spine::SlotData* result = cobj->findSlot(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findSlot : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_findSlot)

static bool js_spine_SkeletonData_findSlotIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_findSlotIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findSlotIndex : Error processing arguments");
        int result = cobj->findSlotIndex(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findSlotIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_findSlotIndex)

static bool js_spine_SkeletonData_findTransformConstraint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_findTransformConstraint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findTransformConstraint : Error processing arguments");
        spine::TransformConstraintData* result = cobj->findTransformConstraint(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_findTransformConstraint : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_findTransformConstraint)

static bool js_spine_SkeletonData_getAnimations(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getAnimations : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::Animation *>& result = cobj->getAnimations();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getAnimations : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getAnimations)

static bool js_spine_SkeletonData_getAudioPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getAudioPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getAudioPath();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getAudioPath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getAudioPath)

static bool js_spine_SkeletonData_getBones(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::BoneData *>& result = cobj->getBones();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getBones : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getBones)

static bool js_spine_SkeletonData_getDefaultSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getDefaultSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Skin* result = cobj->getDefaultSkin();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getDefaultSkin : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getDefaultSkin)

static bool js_spine_SkeletonData_getEvents(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getEvents : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::EventData *>& result = cobj->getEvents();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getEvents : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getEvents)

static bool js_spine_SkeletonData_getFps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getFps : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getFps();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getFps : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getFps)

static bool js_spine_SkeletonData_getHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getHash();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getHash : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getHash)

static bool js_spine_SkeletonData_getHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getHeight();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getHeight : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getHeight)

static bool js_spine_SkeletonData_getIkConstraints(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getIkConstraints : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::IkConstraintData *>& result = cobj->getIkConstraints();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getIkConstraints : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getIkConstraints)

static bool js_spine_SkeletonData_getImagesPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getImagesPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getImagesPath();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getImagesPath : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getImagesPath)

static bool js_spine_SkeletonData_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getName)

static bool js_spine_SkeletonData_getPathConstraints(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getPathConstraints : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::PathConstraintData *>& result = cobj->getPathConstraints();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getPathConstraints : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getPathConstraints)

static bool js_spine_SkeletonData_getSkins(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getSkins : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::Skin *>& result = cobj->getSkins();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getSkins : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getSkins)

static bool js_spine_SkeletonData_getSlots(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getSlots : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::SlotData *>& result = cobj->getSlots();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getSlots : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getSlots)

static bool js_spine_SkeletonData_getTransformConstraints(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getTransformConstraints : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::TransformConstraintData *>& result = cobj->getTransformConstraints();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getTransformConstraints : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getTransformConstraints)

static bool js_spine_SkeletonData_getVersion(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getVersion : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getVersion();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getVersion : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getVersion)

static bool js_spine_SkeletonData_getWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWidth();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getWidth : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getWidth)

static bool js_spine_SkeletonData_getX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getX)

static bool js_spine_SkeletonData_getY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_getY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_getY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_getY)

static bool js_spine_SkeletonData_setAudioPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_setAudioPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_setAudioPath : Error processing arguments");
        cobj->setAudioPath(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_setAudioPath)

static bool js_spine_SkeletonData_setDefaultSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_setDefaultSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::Skin*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_setDefaultSkin : Error processing arguments");
        cobj->setDefaultSkin(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_setDefaultSkin)

static bool js_spine_SkeletonData_setFps(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_setFps : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_setFps : Error processing arguments");
        cobj->setFps(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_setFps)

static bool js_spine_SkeletonData_setHash(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_setHash : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_setHash : Error processing arguments");
        cobj->setHash(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_setHash)

static bool js_spine_SkeletonData_setHeight(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_setHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_setHeight : Error processing arguments");
        cobj->setHeight(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_setHeight)

static bool js_spine_SkeletonData_setImagesPath(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_setImagesPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_setImagesPath : Error processing arguments");
        cobj->setImagesPath(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_setImagesPath)

static bool js_spine_SkeletonData_setName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_setName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_setName : Error processing arguments");
        cobj->setName(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_setName)

static bool js_spine_SkeletonData_setVersion(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_setVersion : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_setVersion : Error processing arguments");
        cobj->setVersion(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_setVersion)

static bool js_spine_SkeletonData_setWidth(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_setWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_setWidth : Error processing arguments");
        cobj->setWidth(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_setWidth)

static bool js_spine_SkeletonData_setX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_setX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_setX : Error processing arguments");
        cobj->setX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_setX)

static bool js_spine_SkeletonData_setY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonData_setY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonData_setY : Error processing arguments");
        cobj->setY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonData_setY)



bool js_register_spine_SkeletonData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SkeletonData", obj, nullptr, nullptr);

    cls->defineFunction("findAnimation", _SE(js_spine_SkeletonData_findAnimation));
    cls->defineFunction("findBone", _SE(js_spine_SkeletonData_findBone));
    cls->defineFunction("findBoneIndex", _SE(js_spine_SkeletonData_findBoneIndex));
    cls->defineFunction("findEvent", _SE(js_spine_SkeletonData_findEvent));
    cls->defineFunction("findIkConstraint", _SE(js_spine_SkeletonData_findIkConstraint));
    cls->defineFunction("findPathConstraint", _SE(js_spine_SkeletonData_findPathConstraint));
    cls->defineFunction("findPathConstraintIndex", _SE(js_spine_SkeletonData_findPathConstraintIndex));
    cls->defineFunction("findSkin", _SE(js_spine_SkeletonData_findSkin));
    cls->defineFunction("findSlot", _SE(js_spine_SkeletonData_findSlot));
    cls->defineFunction("findSlotIndex", _SE(js_spine_SkeletonData_findSlotIndex));
    cls->defineFunction("findTransformConstraint", _SE(js_spine_SkeletonData_findTransformConstraint));
    cls->defineFunction("getAnimations", _SE(js_spine_SkeletonData_getAnimations));
    cls->defineFunction("getAudioPath", _SE(js_spine_SkeletonData_getAudioPath));
    cls->defineFunction("getBones", _SE(js_spine_SkeletonData_getBones));
    cls->defineFunction("getDefaultSkin", _SE(js_spine_SkeletonData_getDefaultSkin));
    cls->defineFunction("getEvents", _SE(js_spine_SkeletonData_getEvents));
    cls->defineFunction("getFps", _SE(js_spine_SkeletonData_getFps));
    cls->defineFunction("getHash", _SE(js_spine_SkeletonData_getHash));
    cls->defineFunction("getHeight", _SE(js_spine_SkeletonData_getHeight));
    cls->defineFunction("getIkConstraints", _SE(js_spine_SkeletonData_getIkConstraints));
    cls->defineFunction("getImagesPath", _SE(js_spine_SkeletonData_getImagesPath));
    cls->defineFunction("getName", _SE(js_spine_SkeletonData_getName));
    cls->defineFunction("getPathConstraints", _SE(js_spine_SkeletonData_getPathConstraints));
    cls->defineFunction("getSkins", _SE(js_spine_SkeletonData_getSkins));
    cls->defineFunction("getSlots", _SE(js_spine_SkeletonData_getSlots));
    cls->defineFunction("getTransformConstraints", _SE(js_spine_SkeletonData_getTransformConstraints));
    cls->defineFunction("getVersion", _SE(js_spine_SkeletonData_getVersion));
    cls->defineFunction("getWidth", _SE(js_spine_SkeletonData_getWidth));
    cls->defineFunction("getX", _SE(js_spine_SkeletonData_getX));
    cls->defineFunction("getY", _SE(js_spine_SkeletonData_getY));
    cls->defineFunction("setAudioPath", _SE(js_spine_SkeletonData_setAudioPath));
    cls->defineFunction("setDefaultSkin", _SE(js_spine_SkeletonData_setDefaultSkin));
    cls->defineFunction("setFps", _SE(js_spine_SkeletonData_setFps));
    cls->defineFunction("setHash", _SE(js_spine_SkeletonData_setHash));
    cls->defineFunction("setHeight", _SE(js_spine_SkeletonData_setHeight));
    cls->defineFunction("setImagesPath", _SE(js_spine_SkeletonData_setImagesPath));
    cls->defineFunction("setName", _SE(js_spine_SkeletonData_setName));
    cls->defineFunction("setVersion", _SE(js_spine_SkeletonData_setVersion));
    cls->defineFunction("setWidth", _SE(js_spine_SkeletonData_setWidth));
    cls->defineFunction("setX", _SE(js_spine_SkeletonData_setX));
    cls->defineFunction("setY", _SE(js_spine_SkeletonData_setY));
    cls->install();
    JSBClassType::registerClass<spine::SkeletonData>(cls);

    __jsb_spine_SkeletonData_proto = cls->getProto();
    __jsb_spine_SkeletonData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_Skin_proto = nullptr;
se::Class* __jsb_spine_Skin_class = nullptr;

static bool js_spine_Skin_addSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skin>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skin_addSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::Skin*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skin_addSkin : Error processing arguments");
        cobj->addSkin(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skin_addSkin)

static bool js_spine_Skin_copySkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skin>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skin_copySkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::Skin*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skin_copySkin : Error processing arguments");
        cobj->copySkin(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Skin_copySkin)

static bool js_spine_Skin_getAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skin>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skin_getAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<size_t, false> arg0 = {};
        HolderType<spine::String, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skin_getAttachment : Error processing arguments");
        spine::Attachment* result = cobj->getAttachment(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skin_getAttachment : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_Skin_getAttachment)

static bool js_spine_Skin_getBones(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skin>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skin_getBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::BoneData *>& result = cobj->getBones();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skin_getBones : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skin_getBones)

static bool js_spine_Skin_getConstraints(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skin>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skin_getConstraints : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::ConstraintData *>& result = cobj->getConstraints();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skin_getConstraints : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skin_getConstraints)

static bool js_spine_Skin_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skin>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skin_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Skin_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Skin_getName)

static bool js_spine_Skin_removeAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skin>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skin_removeAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<size_t, false> arg0 = {};
        HolderType<spine::String, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skin_removeAttachment : Error processing arguments");
        cobj->removeAttachment(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_Skin_removeAttachment)

static bool js_spine_Skin_setAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Skin>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Skin_setAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<size_t, false> arg0 = {};
        HolderType<spine::String, true> arg1 = {};
        HolderType<spine::Attachment*, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Skin_setAttachment : Error processing arguments");
        cobj->setAttachment(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_spine_Skin_setAttachment)



bool js_register_spine_Skin(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Skin", obj, nullptr, nullptr);

    cls->defineFunction("addSkin", _SE(js_spine_Skin_addSkin));
    cls->defineFunction("copySkin", _SE(js_spine_Skin_copySkin));
    cls->defineFunction("getAttachment", _SE(js_spine_Skin_getAttachment));
    cls->defineFunction("getBones", _SE(js_spine_Skin_getBones));
    cls->defineFunction("getConstraints", _SE(js_spine_Skin_getConstraints));
    cls->defineFunction("getName", _SE(js_spine_Skin_getName));
    cls->defineFunction("removeAttachment", _SE(js_spine_Skin_removeAttachment));
    cls->defineFunction("setAttachment", _SE(js_spine_Skin_setAttachment));
    cls->install();
    JSBClassType::registerClass<spine::Skin>(cls);

    __jsb_spine_Skin_proto = cls->getProto();
    __jsb_spine_Skin_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_Slot_proto = nullptr;
se::Class* __jsb_spine_Slot_class = nullptr;

static bool js_spine_Slot_getAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Slot_getAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Attachment* result = cobj->getAttachment();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Slot_getAttachment : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Slot_getAttachment)

static bool js_spine_Slot_getAttachmentTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Slot_getAttachmentTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAttachmentTime();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Slot_getAttachmentTime : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Slot_getAttachmentTime)

static bool js_spine_Slot_getBone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Slot_getBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Bone& result = cobj->getBone();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Slot_getBone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Slot_getBone)

static bool js_spine_Slot_getColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Slot_getColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Color& result = cobj->getColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Slot_getColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Slot_getColor)

static bool js_spine_Slot_getDarkColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Slot_getDarkColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Color& result = cobj->getDarkColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Slot_getDarkColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Slot_getDarkColor)

static bool js_spine_Slot_getData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Slot_getData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::SlotData& result = cobj->getData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Slot_getData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Slot_getData)

static bool js_spine_Slot_getDeform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Slot_getDeform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<float>& result = cobj->getDeform();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Slot_getDeform : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Slot_getDeform)

static bool js_spine_Slot_getSkeleton(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Slot_getSkeleton : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Skeleton& result = cobj->getSkeleton();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Slot_getSkeleton : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Slot_getSkeleton)

static bool js_spine_Slot_hasDarkColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Slot_hasDarkColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->hasDarkColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_Slot_hasDarkColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Slot_hasDarkColor)

static bool js_spine_Slot_setAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Slot_setAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::Attachment*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Slot_setAttachment : Error processing arguments");
        cobj->setAttachment(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Slot_setAttachment)

static bool js_spine_Slot_setAttachmentTime(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Slot_setAttachmentTime : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_Slot_setAttachmentTime : Error processing arguments");
        cobj->setAttachmentTime(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_Slot_setAttachmentTime)

static bool js_spine_Slot_setToSetupPose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::Slot>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_Slot_setToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_Slot_setToSetupPose)



bool js_register_spine_Slot(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Slot", obj, nullptr, nullptr);

    cls->defineFunction("getAttachment", _SE(js_spine_Slot_getAttachment));
    cls->defineFunction("getAttachmentTime", _SE(js_spine_Slot_getAttachmentTime));
    cls->defineFunction("getBone", _SE(js_spine_Slot_getBone));
    cls->defineFunction("getColor", _SE(js_spine_Slot_getColor));
    cls->defineFunction("getDarkColor", _SE(js_spine_Slot_getDarkColor));
    cls->defineFunction("getData", _SE(js_spine_Slot_getData));
    cls->defineFunction("getDeform", _SE(js_spine_Slot_getDeform));
    cls->defineFunction("getSkeleton", _SE(js_spine_Slot_getSkeleton));
    cls->defineFunction("hasDarkColor", _SE(js_spine_Slot_hasDarkColor));
    cls->defineFunction("setAttachment", _SE(js_spine_Slot_setAttachment));
    cls->defineFunction("setAttachmentTime", _SE(js_spine_Slot_setAttachmentTime));
    cls->defineFunction("setToSetupPose", _SE(js_spine_Slot_setToSetupPose));
    cls->install();
    JSBClassType::registerClass<spine::Slot>(cls);

    __jsb_spine_Slot_proto = cls->getProto();
    __jsb_spine_Slot_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_SlotData_proto = nullptr;
se::Class* __jsb_spine_SlotData_class = nullptr;

static bool js_spine_SlotData_getAttachmentName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SlotData_getAttachmentName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getAttachmentName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SlotData_getAttachmentName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SlotData_getAttachmentName)

static bool js_spine_SlotData_getBlendMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SlotData_getBlendMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = static_cast<unsigned int>(cobj->getBlendMode());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SlotData_getBlendMode : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SlotData_getBlendMode)

static bool js_spine_SlotData_getBoneData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SlotData_getBoneData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::BoneData& result = cobj->getBoneData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SlotData_getBoneData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SlotData_getBoneData)

static bool js_spine_SlotData_getColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SlotData_getColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Color& result = cobj->getColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SlotData_getColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SlotData_getColor)

static bool js_spine_SlotData_getDarkColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SlotData_getDarkColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Color& result = cobj->getDarkColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SlotData_getDarkColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SlotData_getDarkColor)

static bool js_spine_SlotData_getIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SlotData_getIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SlotData_getIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SlotData_getIndex)

static bool js_spine_SlotData_getName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SlotData_getName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const spine::String& result = cobj->getName();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SlotData_getName : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SlotData_getName)

static bool js_spine_SlotData_hasDarkColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SlotData_hasDarkColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->hasDarkColor();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SlotData_hasDarkColor : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SlotData_hasDarkColor)

static bool js_spine_SlotData_setAttachmentName(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SlotData_setAttachmentName : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::String, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SlotData_setAttachmentName : Error processing arguments");
        cobj->setAttachmentName(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SlotData_setAttachmentName)

static bool js_spine_SlotData_setBlendMode(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SlotData_setBlendMode : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::BlendMode, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SlotData_setBlendMode : Error processing arguments");
        cobj->setBlendMode(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SlotData_setBlendMode)

static bool js_spine_SlotData_setHasDarkColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SlotData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SlotData_setHasDarkColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SlotData_setHasDarkColor : Error processing arguments");
        cobj->setHasDarkColor(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SlotData_setHasDarkColor)



bool js_register_spine_SlotData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SlotData", obj, nullptr, nullptr);

    cls->defineFunction("getAttachmentName", _SE(js_spine_SlotData_getAttachmentName));
    cls->defineFunction("getBlendMode", _SE(js_spine_SlotData_getBlendMode));
    cls->defineFunction("getBoneData", _SE(js_spine_SlotData_getBoneData));
    cls->defineFunction("getColor", _SE(js_spine_SlotData_getColor));
    cls->defineFunction("getDarkColor", _SE(js_spine_SlotData_getDarkColor));
    cls->defineFunction("getIndex", _SE(js_spine_SlotData_getIndex));
    cls->defineFunction("getName", _SE(js_spine_SlotData_getName));
    cls->defineFunction("hasDarkColor", _SE(js_spine_SlotData_hasDarkColor));
    cls->defineFunction("setAttachmentName", _SE(js_spine_SlotData_setAttachmentName));
    cls->defineFunction("setBlendMode", _SE(js_spine_SlotData_setBlendMode));
    cls->defineFunction("setHasDarkColor", _SE(js_spine_SlotData_setHasDarkColor));
    cls->install();
    JSBClassType::registerClass<spine::SlotData>(cls);

    __jsb_spine_SlotData_proto = cls->getProto();
    __jsb_spine_SlotData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_TransformConstraint_proto = nullptr;
se::Class* __jsb_spine_TransformConstraint_class = nullptr;

static bool js_spine_TransformConstraint_apply(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_apply : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->apply();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_apply)

static bool js_spine_TransformConstraint_getBones(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_getBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::Bone *>& result = cobj->getBones();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_getBones : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_getBones)

static bool js_spine_TransformConstraint_getData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_getData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::TransformConstraintData& result = cobj->getData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_getData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_getData)

static bool js_spine_TransformConstraint_getOrder(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_getOrder : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getOrder();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_getOrder : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_getOrder)

static bool js_spine_TransformConstraint_getRotateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_getRotateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRotateMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_getRotateMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_getRotateMix)

static bool js_spine_TransformConstraint_getScaleMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_getScaleMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScaleMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_getScaleMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_getScaleMix)

static bool js_spine_TransformConstraint_getShearMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_getShearMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShearMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_getShearMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_getShearMix)

static bool js_spine_TransformConstraint_getTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_getTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Bone* result = cobj->getTarget();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_getTarget : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_getTarget)

static bool js_spine_TransformConstraint_getTranslateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_getTranslateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTranslateMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_getTranslateMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_getTranslateMix)

static bool js_spine_TransformConstraint_isActive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_isActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isActive();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_isActive : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_isActive)

static bool js_spine_TransformConstraint_setActive(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_setActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_setActive : Error processing arguments");
        cobj->setActive(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_setActive)

static bool js_spine_TransformConstraint_setRotateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_setRotateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_setRotateMix : Error processing arguments");
        cobj->setRotateMix(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_setRotateMix)

static bool js_spine_TransformConstraint_setScaleMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_setScaleMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_setScaleMix : Error processing arguments");
        cobj->setScaleMix(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_setScaleMix)

static bool js_spine_TransformConstraint_setShearMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_setShearMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_setShearMix : Error processing arguments");
        cobj->setShearMix(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_setShearMix)

static bool js_spine_TransformConstraint_setTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_setTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::Bone*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_setTarget : Error processing arguments");
        cobj->setTarget(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_setTarget)

static bool js_spine_TransformConstraint_setTranslateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_setTranslateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraint_setTranslateMix : Error processing arguments");
        cobj->setTranslateMix(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_setTranslateMix)

static bool js_spine_TransformConstraint_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraint>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraint_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->update();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraint_update)



bool js_register_spine_TransformConstraint(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TransformConstraint", obj, nullptr, nullptr);

    cls->defineFunction("apply", _SE(js_spine_TransformConstraint_apply));
    cls->defineFunction("getBones", _SE(js_spine_TransformConstraint_getBones));
    cls->defineFunction("getData", _SE(js_spine_TransformConstraint_getData));
    cls->defineFunction("getOrder", _SE(js_spine_TransformConstraint_getOrder));
    cls->defineFunction("getRotateMix", _SE(js_spine_TransformConstraint_getRotateMix));
    cls->defineFunction("getScaleMix", _SE(js_spine_TransformConstraint_getScaleMix));
    cls->defineFunction("getShearMix", _SE(js_spine_TransformConstraint_getShearMix));
    cls->defineFunction("getTarget", _SE(js_spine_TransformConstraint_getTarget));
    cls->defineFunction("getTranslateMix", _SE(js_spine_TransformConstraint_getTranslateMix));
    cls->defineFunction("isActive", _SE(js_spine_TransformConstraint_isActive));
    cls->defineFunction("setActive", _SE(js_spine_TransformConstraint_setActive));
    cls->defineFunction("setRotateMix", _SE(js_spine_TransformConstraint_setRotateMix));
    cls->defineFunction("setScaleMix", _SE(js_spine_TransformConstraint_setScaleMix));
    cls->defineFunction("setShearMix", _SE(js_spine_TransformConstraint_setShearMix));
    cls->defineFunction("setTarget", _SE(js_spine_TransformConstraint_setTarget));
    cls->defineFunction("setTranslateMix", _SE(js_spine_TransformConstraint_setTranslateMix));
    cls->defineFunction("update", _SE(js_spine_TransformConstraint_update));
    cls->install();
    JSBClassType::registerClass<spine::TransformConstraint>(cls);

    __jsb_spine_TransformConstraint_proto = cls->getProto();
    __jsb_spine_TransformConstraint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_TransformConstraintData_proto = nullptr;
se::Class* __jsb_spine_TransformConstraintData_class = nullptr;

static bool js_spine_TransformConstraintData_getBones(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_getBones : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Vector<spine::BoneData *>& result = cobj->getBones();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_getBones : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_getBones)

static bool js_spine_TransformConstraintData_getOffsetRotation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_getOffsetRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOffsetRotation();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_getOffsetRotation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_getOffsetRotation)

static bool js_spine_TransformConstraintData_getOffsetScaleX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_getOffsetScaleX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOffsetScaleX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_getOffsetScaleX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_getOffsetScaleX)

static bool js_spine_TransformConstraintData_getOffsetScaleY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_getOffsetScaleY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOffsetScaleY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_getOffsetScaleY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_getOffsetScaleY)

static bool js_spine_TransformConstraintData_getOffsetShearY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_getOffsetShearY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOffsetShearY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_getOffsetShearY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_getOffsetShearY)

static bool js_spine_TransformConstraintData_getOffsetX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_getOffsetX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOffsetX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_getOffsetX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_getOffsetX)

static bool js_spine_TransformConstraintData_getOffsetY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_getOffsetY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getOffsetY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_getOffsetY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_getOffsetY)

static bool js_spine_TransformConstraintData_getRotateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_getRotateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRotateMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_getRotateMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_getRotateMix)

static bool js_spine_TransformConstraintData_getScaleMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_getScaleMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getScaleMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_getScaleMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_getScaleMix)

static bool js_spine_TransformConstraintData_getShearMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_getShearMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getShearMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_getShearMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_getShearMix)

static bool js_spine_TransformConstraintData_getTarget(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_getTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::BoneData* result = cobj->getTarget();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_getTarget : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_getTarget)

static bool js_spine_TransformConstraintData_getTranslateMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_getTranslateMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTranslateMix();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_getTranslateMix : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_getTranslateMix)

static bool js_spine_TransformConstraintData_isLocal(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_isLocal : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isLocal();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_isLocal : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_isLocal)

static bool js_spine_TransformConstraintData_isRelative(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintData>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintData_isRelative : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isRelative();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintData_isRelative : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintData_isRelative)



bool js_register_spine_TransformConstraintData(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TransformConstraintData", obj, __jsb_spine_ConstraintData_proto, nullptr);

    cls->defineFunction("getBones", _SE(js_spine_TransformConstraintData_getBones));
    cls->defineFunction("getOffsetRotation", _SE(js_spine_TransformConstraintData_getOffsetRotation));
    cls->defineFunction("getOffsetScaleX", _SE(js_spine_TransformConstraintData_getOffsetScaleX));
    cls->defineFunction("getOffsetScaleY", _SE(js_spine_TransformConstraintData_getOffsetScaleY));
    cls->defineFunction("getOffsetShearY", _SE(js_spine_TransformConstraintData_getOffsetShearY));
    cls->defineFunction("getOffsetX", _SE(js_spine_TransformConstraintData_getOffsetX));
    cls->defineFunction("getOffsetY", _SE(js_spine_TransformConstraintData_getOffsetY));
    cls->defineFunction("getRotateMix", _SE(js_spine_TransformConstraintData_getRotateMix));
    cls->defineFunction("getScaleMix", _SE(js_spine_TransformConstraintData_getScaleMix));
    cls->defineFunction("getShearMix", _SE(js_spine_TransformConstraintData_getShearMix));
    cls->defineFunction("getTarget", _SE(js_spine_TransformConstraintData_getTarget));
    cls->defineFunction("getTranslateMix", _SE(js_spine_TransformConstraintData_getTranslateMix));
    cls->defineFunction("isLocal", _SE(js_spine_TransformConstraintData_isLocal));
    cls->defineFunction("isRelative", _SE(js_spine_TransformConstraintData_isRelative));
    cls->install();
    JSBClassType::registerClass<spine::TransformConstraintData>(cls);

    __jsb_spine_TransformConstraintData_proto = cls->getProto();
    __jsb_spine_TransformConstraintData_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_TransformConstraintTimeline_proto = nullptr;
se::Class* __jsb_spine_TransformConstraintTimeline_class = nullptr;

static bool js_spine_TransformConstraintTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintTimeline_getPropertyId)

static bool js_spine_TransformConstraintTimeline_setFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TransformConstraintTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TransformConstraintTimeline_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        HolderType<size_t, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TransformConstraintTimeline_setFrame : Error processing arguments");
        cobj->setFrame(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_spine_TransformConstraintTimeline_setFrame)



bool js_register_spine_TransformConstraintTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TransformConstraintTimeline", obj, __jsb_spine_CurveTimeline_proto, nullptr);

    cls->defineFunction("getPropertyId", _SE(js_spine_TransformConstraintTimeline_getPropertyId));
    cls->defineFunction("setFrame", _SE(js_spine_TransformConstraintTimeline_setFrame));
    cls->install();
    JSBClassType::registerClass<spine::TransformConstraintTimeline>(cls);

    __jsb_spine_TransformConstraintTimeline_proto = cls->getProto();
    __jsb_spine_TransformConstraintTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_TwoColorTimeline_proto = nullptr;
se::Class* __jsb_spine_TwoColorTimeline_class = nullptr;

static bool js_spine_TwoColorTimeline_getPropertyId(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TwoColorTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TwoColorTimeline_getPropertyId : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getPropertyId();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TwoColorTimeline_getPropertyId : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TwoColorTimeline_getPropertyId)

static bool js_spine_TwoColorTimeline_getSlotIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TwoColorTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TwoColorTimeline_getSlotIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->getSlotIndex();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_TwoColorTimeline_getSlotIndex : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_TwoColorTimeline_getSlotIndex)

static bool js_spine_TwoColorTimeline_setFrame(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TwoColorTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TwoColorTimeline_setFrame : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 9) {
        HolderType<int, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        HolderType<float, false> arg4 = {};
        HolderType<float, false> arg5 = {};
        HolderType<float, false> arg6 = {};
        HolderType<float, false> arg7 = {};
        HolderType<float, false> arg8 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        ok &= sevalue_to_native(args[4], &arg4, s.thisObject());
        ok &= sevalue_to_native(args[5], &arg5, s.thisObject());
        ok &= sevalue_to_native(args[6], &arg6, s.thisObject());
        ok &= sevalue_to_native(args[7], &arg7, s.thisObject());
        ok &= sevalue_to_native(args[8], &arg8, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TwoColorTimeline_setFrame : Error processing arguments");
        cobj->setFrame(arg0.value(), arg1.value(), arg2.value(), arg3.value(), arg4.value(), arg5.value(), arg6.value(), arg7.value(), arg8.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 9);
    return false;
}
SE_BIND_FUNC(js_spine_TwoColorTimeline_setFrame)

static bool js_spine_TwoColorTimeline_setSlotIndex(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::TwoColorTimeline>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_TwoColorTimeline_setSlotIndex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_TwoColorTimeline_setSlotIndex : Error processing arguments");
        cobj->setSlotIndex(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_TwoColorTimeline_setSlotIndex)



bool js_register_spine_TwoColorTimeline(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("TwoColorTimeline", obj, __jsb_spine_CurveTimeline_proto, nullptr);

    cls->defineFunction("getPropertyId", _SE(js_spine_TwoColorTimeline_getPropertyId));
    cls->defineFunction("getSlotIndex", _SE(js_spine_TwoColorTimeline_getSlotIndex));
    cls->defineFunction("setFrame", _SE(js_spine_TwoColorTimeline_setFrame));
    cls->defineFunction("setSlotIndex", _SE(js_spine_TwoColorTimeline_setSlotIndex));
    cls->install();
    JSBClassType::registerClass<spine::TwoColorTimeline>(cls);

    __jsb_spine_TwoColorTimeline_proto = cls->getProto();
    __jsb_spine_TwoColorTimeline_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_VertexEffect_proto = nullptr;
se::Class* __jsb_spine_VertexEffect_class = nullptr;



bool js_register_spine_VertexEffect(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("VertexEffect", obj, nullptr, nullptr);

    cls->install();
    JSBClassType::registerClass<spine::VertexEffect>(cls);

    __jsb_spine_VertexEffect_proto = cls->getProto();
    __jsb_spine_VertexEffect_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_JitterVertexEffect_proto = nullptr;
se::Class* __jsb_spine_JitterVertexEffect_class = nullptr;

static bool js_spine_JitterVertexEffect_getJitterX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::JitterVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_JitterVertexEffect_getJitterX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getJitterX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_JitterVertexEffect_getJitterX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_JitterVertexEffect_getJitterX)

static bool js_spine_JitterVertexEffect_getJitterY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::JitterVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_JitterVertexEffect_getJitterY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getJitterY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_JitterVertexEffect_getJitterY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_JitterVertexEffect_getJitterY)

static bool js_spine_JitterVertexEffect_setJitterX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::JitterVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_JitterVertexEffect_setJitterX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_JitterVertexEffect_setJitterX : Error processing arguments");
        cobj->setJitterX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_JitterVertexEffect_setJitterX)

static bool js_spine_JitterVertexEffect_setJitterY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::JitterVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_JitterVertexEffect_setJitterY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_JitterVertexEffect_setJitterY : Error processing arguments");
        cobj->setJitterY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_JitterVertexEffect_setJitterY)



bool js_register_spine_JitterVertexEffect(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("JitterVertexEffect", obj, __jsb_spine_VertexEffect_proto, nullptr);

    cls->defineFunction("getJitterX", _SE(js_spine_JitterVertexEffect_getJitterX));
    cls->defineFunction("getJitterY", _SE(js_spine_JitterVertexEffect_getJitterY));
    cls->defineFunction("setJitterX", _SE(js_spine_JitterVertexEffect_setJitterX));
    cls->defineFunction("setJitterY", _SE(js_spine_JitterVertexEffect_setJitterY));
    cls->install();
    JSBClassType::registerClass<spine::JitterVertexEffect>(cls);

    __jsb_spine_JitterVertexEffect_proto = cls->getProto();
    __jsb_spine_JitterVertexEffect_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_SwirlVertexEffect_proto = nullptr;
se::Class* __jsb_spine_SwirlVertexEffect_class = nullptr;

static bool js_spine_SwirlVertexEffect_getAngle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SwirlVertexEffect_getAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getAngle();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SwirlVertexEffect_getAngle : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SwirlVertexEffect_getAngle)

static bool js_spine_SwirlVertexEffect_getCenterX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SwirlVertexEffect_getCenterX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getCenterX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SwirlVertexEffect_getCenterX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SwirlVertexEffect_getCenterX)

static bool js_spine_SwirlVertexEffect_getCenterY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SwirlVertexEffect_getCenterY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getCenterY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SwirlVertexEffect_getCenterY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SwirlVertexEffect_getCenterY)

static bool js_spine_SwirlVertexEffect_getRadius(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SwirlVertexEffect_getRadius : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getRadius();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SwirlVertexEffect_getRadius : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SwirlVertexEffect_getRadius)

static bool js_spine_SwirlVertexEffect_getWorldX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SwirlVertexEffect_getWorldX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWorldX();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SwirlVertexEffect_getWorldX : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SwirlVertexEffect_getWorldX)

static bool js_spine_SwirlVertexEffect_getWorldY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SwirlVertexEffect_getWorldY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getWorldY();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SwirlVertexEffect_getWorldY : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SwirlVertexEffect_getWorldY)

static bool js_spine_SwirlVertexEffect_setAngle(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SwirlVertexEffect_setAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SwirlVertexEffect_setAngle : Error processing arguments");
        cobj->setAngle(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SwirlVertexEffect_setAngle)

static bool js_spine_SwirlVertexEffect_setCenterX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SwirlVertexEffect_setCenterX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SwirlVertexEffect_setCenterX : Error processing arguments");
        cobj->setCenterX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SwirlVertexEffect_setCenterX)

static bool js_spine_SwirlVertexEffect_setCenterY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SwirlVertexEffect_setCenterY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SwirlVertexEffect_setCenterY : Error processing arguments");
        cobj->setCenterY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SwirlVertexEffect_setCenterY)

static bool js_spine_SwirlVertexEffect_setRadius(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SwirlVertexEffect_setRadius : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SwirlVertexEffect_setRadius : Error processing arguments");
        cobj->setRadius(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SwirlVertexEffect_setRadius)

static bool js_spine_SwirlVertexEffect_setWorldX(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SwirlVertexEffect_setWorldX : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SwirlVertexEffect_setWorldX : Error processing arguments");
        cobj->setWorldX(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SwirlVertexEffect_setWorldX)

static bool js_spine_SwirlVertexEffect_setWorldY(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SwirlVertexEffect>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SwirlVertexEffect_setWorldY : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SwirlVertexEffect_setWorldY : Error processing arguments");
        cobj->setWorldY(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SwirlVertexEffect_setWorldY)



bool js_register_spine_SwirlVertexEffect(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SwirlVertexEffect", obj, __jsb_spine_VertexEffect_proto, nullptr);

    cls->defineFunction("getAngle", _SE(js_spine_SwirlVertexEffect_getAngle));
    cls->defineFunction("getCenterX", _SE(js_spine_SwirlVertexEffect_getCenterX));
    cls->defineFunction("getCenterY", _SE(js_spine_SwirlVertexEffect_getCenterY));
    cls->defineFunction("getRadius", _SE(js_spine_SwirlVertexEffect_getRadius));
    cls->defineFunction("getWorldX", _SE(js_spine_SwirlVertexEffect_getWorldX));
    cls->defineFunction("getWorldY", _SE(js_spine_SwirlVertexEffect_getWorldY));
    cls->defineFunction("setAngle", _SE(js_spine_SwirlVertexEffect_setAngle));
    cls->defineFunction("setCenterX", _SE(js_spine_SwirlVertexEffect_setCenterX));
    cls->defineFunction("setCenterY", _SE(js_spine_SwirlVertexEffect_setCenterY));
    cls->defineFunction("setRadius", _SE(js_spine_SwirlVertexEffect_setRadius));
    cls->defineFunction("setWorldX", _SE(js_spine_SwirlVertexEffect_setWorldX));
    cls->defineFunction("setWorldY", _SE(js_spine_SwirlVertexEffect_setWorldY));
    cls->install();
    JSBClassType::registerClass<spine::SwirlVertexEffect>(cls);

    __jsb_spine_SwirlVertexEffect_proto = cls->getProto();
    __jsb_spine_SwirlVertexEffect_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_VertexEffectDelegate_proto = nullptr;
se::Class* __jsb_spine_VertexEffectDelegate_class = nullptr;

static bool js_spine_VertexEffectDelegate_clear(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexEffectDelegate>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexEffectDelegate_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_VertexEffectDelegate_clear)

static bool js_spine_VertexEffectDelegate_getEffectType(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexEffectDelegate>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexEffectDelegate_getEffectType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const std::string& result = cobj->getEffectType();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_VertexEffectDelegate_getEffectType : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_VertexEffectDelegate_getEffectType)

static bool js_spine_VertexEffectDelegate_getJitterVertexEffect(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexEffectDelegate>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexEffectDelegate_getJitterVertexEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::JitterVertexEffect* result = cobj->getJitterVertexEffect();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_VertexEffectDelegate_getJitterVertexEffect : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_VertexEffectDelegate_getJitterVertexEffect)

static bool js_spine_VertexEffectDelegate_getSwirlVertexEffect(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexEffectDelegate>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexEffectDelegate_getSwirlVertexEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::SwirlVertexEffect* result = cobj->getSwirlVertexEffect();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_VertexEffectDelegate_getSwirlVertexEffect : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_VertexEffectDelegate_getSwirlVertexEffect)

static bool js_spine_VertexEffectDelegate_getVertexEffect(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexEffectDelegate>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexEffectDelegate_getVertexEffect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::VertexEffect* result = cobj->getVertexEffect();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_VertexEffectDelegate_getVertexEffect : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_VertexEffectDelegate_getVertexEffect)

static bool js_spine_VertexEffectDelegate_initJitter(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexEffectDelegate>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexEffectDelegate_initJitter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_VertexEffectDelegate_initJitter : Error processing arguments");
        spine::JitterVertexEffect* result = cobj->initJitter(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_VertexEffectDelegate_initJitter : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_VertexEffectDelegate_initJitter)

static bool js_spine_VertexEffectDelegate_initSwirlWithPow(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexEffectDelegate>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexEffectDelegate_initSwirlWithPow : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_VertexEffectDelegate_initSwirlWithPow : Error processing arguments");
        spine::SwirlVertexEffect* result = cobj->initSwirlWithPow(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_VertexEffectDelegate_initSwirlWithPow : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_VertexEffectDelegate_initSwirlWithPow)

static bool js_spine_VertexEffectDelegate_initSwirlWithPowOut(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::VertexEffectDelegate>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_VertexEffectDelegate_initSwirlWithPowOut : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<float, false> arg0 = {};
        HolderType<int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_VertexEffectDelegate_initSwirlWithPowOut : Error processing arguments");
        spine::SwirlVertexEffect* result = cobj->initSwirlWithPowOut(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_VertexEffectDelegate_initSwirlWithPowOut : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_VertexEffectDelegate_initSwirlWithPowOut)

SE_DECLARE_FINALIZE_FUNC(js_spine_VertexEffectDelegate_finalize)

static bool js_spine_VertexEffectDelegate_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    spine::VertexEffectDelegate* cobj = JSB_ALLOC(spine::VertexEffectDelegate);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_spine_VertexEffectDelegate_constructor, __jsb_spine_VertexEffectDelegate_class, js_spine_VertexEffectDelegate_finalize)



static bool js_spine_VertexEffectDelegate_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj =SE_THIS_OBJECT<spine::VertexEffectDelegate>(s);
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_spine_VertexEffectDelegate_finalize)

bool js_register_spine_VertexEffectDelegate(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("VertexEffectDelegate", obj, nullptr, _SE(js_spine_VertexEffectDelegate_constructor));

    cls->defineFunction("clear", _SE(js_spine_VertexEffectDelegate_clear));
    cls->defineFunction("getEffectType", _SE(js_spine_VertexEffectDelegate_getEffectType));
    cls->defineFunction("getJitterVertexEffect", _SE(js_spine_VertexEffectDelegate_getJitterVertexEffect));
    cls->defineFunction("getSwirlVertexEffect", _SE(js_spine_VertexEffectDelegate_getSwirlVertexEffect));
    cls->defineFunction("getVertexEffect", _SE(js_spine_VertexEffectDelegate_getVertexEffect));
    cls->defineFunction("initJitter", _SE(js_spine_VertexEffectDelegate_initJitter));
    cls->defineFunction("initSwirlWithPow", _SE(js_spine_VertexEffectDelegate_initSwirlWithPow));
    cls->defineFunction("initSwirlWithPowOut", _SE(js_spine_VertexEffectDelegate_initSwirlWithPowOut));
    cls->defineFinalizeFunction(_SE(js_spine_VertexEffectDelegate_finalize));
    cls->install();
    JSBClassType::registerClass<spine::VertexEffectDelegate>(cls);

    __jsb_spine_VertexEffectDelegate_proto = cls->getProto();
    __jsb_spine_VertexEffectDelegate_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_SkeletonRenderer_proto = nullptr;
se::Class* __jsb_spine_SkeletonRenderer_class = nullptr;

static bool js_spine_SkeletonRenderer_beginSchedule(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_beginSchedule : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->beginSchedule();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_beginSchedule)

static bool js_spine_SkeletonRenderer_findBone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_findBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_findBone : Error processing arguments");
        spine::Bone* result = cobj->findBone(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_findBone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_findBone)

static bool js_spine_SkeletonRenderer_findSlot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_findSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_findSlot : Error processing arguments");
        spine::Slot* result = cobj->findSlot(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_findSlot : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_findSlot)

static bool js_spine_SkeletonRenderer_getAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_getAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_getAttachment : Error processing arguments");
        spine::Attachment* result = cobj->getAttachment(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_getAttachment : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_getAttachment)

static bool js_spine_SkeletonRenderer_getBoundingBox(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_getBoundingBox : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cc::Rect result = cobj->getBoundingBox();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_getBoundingBox : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_getBoundingBox)

static bool js_spine_SkeletonRenderer_getDebugData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_getDebugData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se::Object* result = cobj->getDebugData();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_getDebugData : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_getDebugData)

static bool js_spine_SkeletonRenderer_getParamsBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_getParamsBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se::Object* result = cobj->getParamsBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_getParamsBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_getParamsBuffer)

static bool js_spine_SkeletonRenderer_getSharedBufferOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_getSharedBufferOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se::Object* result = cobj->getSharedBufferOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_getSharedBufferOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_getSharedBufferOffset)

static bool js_spine_SkeletonRenderer_getSkeleton(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_getSkeleton : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Skeleton* result = cobj->getSkeleton();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_getSkeleton : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_getSkeleton)

static bool js_spine_SkeletonRenderer_getTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_getTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTimeScale();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_getTimeScale : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_getTimeScale)

static bool js_spine_SkeletonRenderer_initWithSkeleton(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_initWithSkeleton : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::Skeleton*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_initWithSkeleton : Error processing arguments");
        cobj->initWithSkeleton(arg0.value());
        return true;
    }
    if (argc == 2) {
        HolderType<spine::Skeleton*, false> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_initWithSkeleton : Error processing arguments");
        cobj->initWithSkeleton(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<spine::Skeleton*, false> arg0 = {};
        HolderType<bool, false> arg1 = {};
        HolderType<bool, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_initWithSkeleton : Error processing arguments");
        cobj->initWithSkeleton(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    if (argc == 4) {
        HolderType<spine::Skeleton*, false> arg0 = {};
        HolderType<bool, false> arg1 = {};
        HolderType<bool, false> arg2 = {};
        HolderType<bool, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_initWithSkeleton : Error processing arguments");
        cobj->initWithSkeleton(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_initWithSkeleton)

static bool js_spine_SkeletonRenderer_initWithUUID(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_initWithUUID : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_initWithUUID : Error processing arguments");
        cobj->initWithUUID(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_initWithUUID)

static bool js_spine_SkeletonRenderer_initialize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_initialize : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->initialize();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_initialize)

static bool js_spine_SkeletonRenderer_isOpacityModifyRGB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_isOpacityModifyRGB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isOpacityModifyRGB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_isOpacityModifyRGB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_isOpacityModifyRGB)

static bool js_spine_SkeletonRenderer_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_onDisable)

static bool js_spine_SkeletonRenderer_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_onEnable)

static bool js_spine_SkeletonRenderer_paused(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_paused : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_paused : Error processing arguments");
        cobj->paused(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_paused)

static bool js_spine_SkeletonRenderer_render(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_render : Error processing arguments");
        cobj->render(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_render)

static bool js_spine_SkeletonRenderer_setAttachEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setAttachEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setAttachEnabled : Error processing arguments");
        cobj->setAttachEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setAttachEnabled)

static bool js_spine_SkeletonRenderer_setAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2( cobj, false, "js_spine_SkeletonRenderer_setAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            HolderType<const char*, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            bool result = cobj->setAttachment(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setAttachment : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            HolderType<std::string, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            bool result = cobj->setAttachment(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setAttachment : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setAttachment)

static bool js_spine_SkeletonRenderer_setBatchEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setBatchEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setBatchEnabled : Error processing arguments");
        cobj->setBatchEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setBatchEnabled)

static bool js_spine_SkeletonRenderer_setBonesToSetupPose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setBonesToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setBonesToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setBonesToSetupPose)

static bool js_spine_SkeletonRenderer_setColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setColor : Error processing arguments");
        cobj->setColor(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setColor)

static bool js_spine_SkeletonRenderer_setDebugBonesEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setDebugBonesEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setDebugBonesEnabled : Error processing arguments");
        cobj->setDebugBonesEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setDebugBonesEnabled)

static bool js_spine_SkeletonRenderer_setDebugMeshEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setDebugMeshEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setDebugMeshEnabled : Error processing arguments");
        cobj->setDebugMeshEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setDebugMeshEnabled)

static bool js_spine_SkeletonRenderer_setDebugSlotsEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setDebugSlotsEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setDebugSlotsEnabled : Error processing arguments");
        cobj->setDebugSlotsEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setDebugSlotsEnabled)

static bool js_spine_SkeletonRenderer_setOpacityModifyRGB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setOpacityModifyRGB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setOpacityModifyRGB : Error processing arguments");
        cobj->setOpacityModifyRGB(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setOpacityModifyRGB)

static bool js_spine_SkeletonRenderer_setSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2( cobj, false, "js_spine_SkeletonRenderer_setSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<const char*, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setSkin(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setSkin(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setSkin)

static bool js_spine_SkeletonRenderer_setSlotsRange(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setSlotsRange : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<int, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setSlotsRange : Error processing arguments");
        cobj->setSlotsRange(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setSlotsRange)

static bool js_spine_SkeletonRenderer_setSlotsToSetupPose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setSlotsToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setSlotsToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setSlotsToSetupPose)

static bool js_spine_SkeletonRenderer_setTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setTimeScale : Error processing arguments");
        cobj->setTimeScale(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setTimeScale)

static bool js_spine_SkeletonRenderer_setToSetupPose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setToSetupPose)

static bool js_spine_SkeletonRenderer_setUseTint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setUseTint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setUseTint : Error processing arguments");
        cobj->setUseTint(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setUseTint)

static bool js_spine_SkeletonRenderer_setVertexEffectDelegate(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_setVertexEffectDelegate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::VertexEffectDelegate*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_setVertexEffectDelegate : Error processing arguments");
        cobj->setVertexEffectDelegate(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_setVertexEffectDelegate)

static bool js_spine_SkeletonRenderer_stopSchedule(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_stopSchedule : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopSchedule();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_stopSchedule)

static bool js_spine_SkeletonRenderer_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonRenderer_update : Error processing arguments");
        cobj->update(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_update)

static bool js_spine_SkeletonRenderer_updateWorldTransform(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonRenderer_updateWorldTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateWorldTransform();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonRenderer_updateWorldTransform)

SE_DECLARE_FINALIZE_FUNC(js_spine_SkeletonRenderer_finalize)

static bool js_spine_SkeletonRenderer_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor_overloaded.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<spine::Skeleton*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::SkeletonRenderer* cobj = JSB_ALLOC(spine::SkeletonRenderer, arg0.value());
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            HolderType<spine::Skeleton*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<bool, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::SkeletonRenderer* cobj = JSB_ALLOC(spine::SkeletonRenderer, arg0.value(), arg1.value());
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            HolderType<spine::Skeleton*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<bool, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<bool, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::SkeletonRenderer* cobj = JSB_ALLOC(spine::SkeletonRenderer, arg0.value(), arg1.value(), arg2.value());
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 4) {
            HolderType<spine::Skeleton*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<bool, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<bool, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<bool, false> arg3 = {};
            ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::SkeletonRenderer* cobj = JSB_ALLOC(spine::SkeletonRenderer, arg0.value(), arg1.value(), arg2.value(), arg3.value());
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 0) {
            spine::SkeletonRenderer* cobj = JSB_ALLOC(spine::SkeletonRenderer);
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 1) {
            HolderType<spine::SkeletonData*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::SkeletonRenderer* cobj = JSB_ALLOC(spine::SkeletonRenderer, arg0.value());
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            HolderType<spine::SkeletonData*, false> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<bool, false> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::SkeletonRenderer* cobj = JSB_ALLOC(spine::SkeletonRenderer, arg0.value(), arg1.value());
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<std::string, true> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::SkeletonRenderer* cobj = JSB_ALLOC(spine::SkeletonRenderer, arg0.value(), arg1.value());
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    do {
        if (argc == 3) {
            HolderType<std::string, true> arg0 = {};
            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<std::string, true> arg1 = {};
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            HolderType<float, false> arg2 = {};
            ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
            if (!ok) { ok = true; break; }
            spine::SkeletonRenderer* cobj = JSB_ALLOC(spine::SkeletonRenderer, arg0.value(), arg1.value(), arg2.value());
            s.thisObject()->setPrivateData(cobj);
            return true;
        }
    } while(false);
    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_spine_SkeletonRenderer_constructor, __jsb_spine_SkeletonRenderer_class, js_spine_SkeletonRenderer_finalize)



static bool js_spine_SkeletonRenderer_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj =SE_THIS_OBJECT<spine::SkeletonRenderer>(s);
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_spine_SkeletonRenderer_finalize)

bool js_register_spine_SkeletonRenderer(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("Skeleton", obj, nullptr, _SE(js_spine_SkeletonRenderer_constructor));

    cls->defineFunction("beginSchedule", _SE(js_spine_SkeletonRenderer_beginSchedule));
    cls->defineFunction("findBone", _SE(js_spine_SkeletonRenderer_findBone));
    cls->defineFunction("findSlot", _SE(js_spine_SkeletonRenderer_findSlot));
    cls->defineFunction("getAttachment", _SE(js_spine_SkeletonRenderer_getAttachment));
    cls->defineFunction("getBoundingBox", _SE(js_spine_SkeletonRenderer_getBoundingBox));
    cls->defineFunction("getDebugData", _SE(js_spine_SkeletonRenderer_getDebugData));
    cls->defineFunction("getParamsBuffer", _SE(js_spine_SkeletonRenderer_getParamsBuffer));
    cls->defineFunction("getSharedBufferOffset", _SE(js_spine_SkeletonRenderer_getSharedBufferOffset));
    cls->defineFunction("getSkeleton", _SE(js_spine_SkeletonRenderer_getSkeleton));
    cls->defineFunction("getTimeScale", _SE(js_spine_SkeletonRenderer_getTimeScale));
    cls->defineFunction("initWithSkeleton", _SE(js_spine_SkeletonRenderer_initWithSkeleton));
    cls->defineFunction("initWithUUID", _SE(js_spine_SkeletonRenderer_initWithUUID));
    cls->defineFunction("initialize", _SE(js_spine_SkeletonRenderer_initialize));
    cls->defineFunction("isOpacityModifyRGB", _SE(js_spine_SkeletonRenderer_isOpacityModifyRGB));
    cls->defineFunction("onDisable", _SE(js_spine_SkeletonRenderer_onDisable));
    cls->defineFunction("onEnable", _SE(js_spine_SkeletonRenderer_onEnable));
    cls->defineFunction("paused", _SE(js_spine_SkeletonRenderer_paused));
    cls->defineFunction("render", _SE(js_spine_SkeletonRenderer_render));
    cls->defineFunction("setAttachEnabled", _SE(js_spine_SkeletonRenderer_setAttachEnabled));
    cls->defineFunction("setAttachment", _SE(js_spine_SkeletonRenderer_setAttachment));
    cls->defineFunction("setBatchEnabled", _SE(js_spine_SkeletonRenderer_setBatchEnabled));
    cls->defineFunction("setBonesToSetupPose", _SE(js_spine_SkeletonRenderer_setBonesToSetupPose));
    cls->defineFunction("setColor", _SE(js_spine_SkeletonRenderer_setColor));
    cls->defineFunction("setDebugBonesEnabled", _SE(js_spine_SkeletonRenderer_setDebugBonesEnabled));
    cls->defineFunction("setDebugMeshEnabled", _SE(js_spine_SkeletonRenderer_setDebugMeshEnabled));
    cls->defineFunction("setDebugSlotsEnabled", _SE(js_spine_SkeletonRenderer_setDebugSlotsEnabled));
    cls->defineFunction("setOpacityModifyRGB", _SE(js_spine_SkeletonRenderer_setOpacityModifyRGB));
    cls->defineFunction("setSkin", _SE(js_spine_SkeletonRenderer_setSkin));
    cls->defineFunction("setSlotsRange", _SE(js_spine_SkeletonRenderer_setSlotsRange));
    cls->defineFunction("setSlotsToSetupPose", _SE(js_spine_SkeletonRenderer_setSlotsToSetupPose));
    cls->defineFunction("setTimeScale", _SE(js_spine_SkeletonRenderer_setTimeScale));
    cls->defineFunction("setToSetupPose", _SE(js_spine_SkeletonRenderer_setToSetupPose));
    cls->defineFunction("setUseTint", _SE(js_spine_SkeletonRenderer_setUseTint));
    cls->defineFunction("setVertexEffectDelegate", _SE(js_spine_SkeletonRenderer_setVertexEffectDelegate));
    cls->defineFunction("stopSchedule", _SE(js_spine_SkeletonRenderer_stopSchedule));
    cls->defineFunction("update", _SE(js_spine_SkeletonRenderer_update));
    cls->defineFunction("updateWorldTransform", _SE(js_spine_SkeletonRenderer_updateWorldTransform));
    cls->defineFinalizeFunction(_SE(js_spine_SkeletonRenderer_finalize));
    cls->install();
    JSBClassType::registerClass<spine::SkeletonRenderer>(cls);

    __jsb_spine_SkeletonRenderer_proto = cls->getProto();
    __jsb_spine_SkeletonRenderer_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_SkeletonAnimation_proto = nullptr;
se::Class* __jsb_spine_SkeletonAnimation_class = nullptr;

static bool js_spine_SkeletonAnimation_addAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_addAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<int, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<bool, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_addAnimation : Error processing arguments");
        spine::TrackEntry* result = cobj->addAnimation(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_addAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 4) {
        HolderType<int, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<bool, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_addAnimation : Error processing arguments");
        spine::TrackEntry* result = cobj->addAnimation(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_addAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_addAnimation)

static bool js_spine_SkeletonAnimation_addEmptyAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_addEmptyAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_addEmptyAnimation : Error processing arguments");
        spine::TrackEntry* result = cobj->addEmptyAnimation(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_addEmptyAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 3) {
        HolderType<int, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_addEmptyAnimation : Error processing arguments");
        spine::TrackEntry* result = cobj->addEmptyAnimation(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_addEmptyAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_addEmptyAnimation)

static bool js_spine_SkeletonAnimation_clearTrack(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_clearTrack : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->clearTrack();
        return true;
    }
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_clearTrack : Error processing arguments");
        cobj->clearTrack(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_clearTrack)

static bool js_spine_SkeletonAnimation_clearTracks(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_clearTracks : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->clearTracks();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_clearTracks)

static bool js_spine_SkeletonAnimation_findAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_findAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_findAnimation : Error processing arguments");
        spine::Animation* result = cobj->findAnimation(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_findAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_findAnimation)

static bool js_spine_SkeletonAnimation_getCurrent(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_getCurrent : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::TrackEntry* result = cobj->getCurrent();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_getCurrent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    if (argc == 1) {
        HolderType<int, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_getCurrent : Error processing arguments");
        spine::TrackEntry* result = cobj->getCurrent(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_getCurrent : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_getCurrent)

static bool js_spine_SkeletonAnimation_getState(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_getState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::AnimationState* result = cobj->getState();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_getState : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_getState)

static bool js_spine_SkeletonAnimation_setAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<int, false> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<bool, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setAnimation : Error processing arguments");
        spine::TrackEntry* result = cobj->setAnimation(arg0.value(), arg1.value(), arg2.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setAnimation)

static bool js_spine_SkeletonAnimation_setAnimationStateData(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setAnimationStateData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<spine::AnimationStateData*, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setAnimationStateData : Error processing arguments");
        cobj->setAnimationStateData(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setAnimationStateData)

static bool js_spine_SkeletonAnimation_setCompleteListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setCompleteListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (spine::TrackEntry *)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spine::TrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setCompleteListener : Error processing arguments");
        cobj->setCompleteListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setCompleteListener)

static bool js_spine_SkeletonAnimation_setDisposeListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setDisposeListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (spine::TrackEntry *)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spine::TrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setDisposeListener : Error processing arguments");
        cobj->setDisposeListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setDisposeListener)

static bool js_spine_SkeletonAnimation_setEmptyAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setEmptyAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<int, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setEmptyAnimation : Error processing arguments");
        spine::TrackEntry* result = cobj->setEmptyAnimation(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setEmptyAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setEmptyAnimation)

static bool js_spine_SkeletonAnimation_setEmptyAnimations(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setEmptyAnimations : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setEmptyAnimations : Error processing arguments");
        cobj->setEmptyAnimations(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setEmptyAnimations)

static bool js_spine_SkeletonAnimation_setEndListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setEndListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (spine::TrackEntry *)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spine::TrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setEndListener : Error processing arguments");
        cobj->setEndListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setEndListener)

static bool js_spine_SkeletonAnimation_setEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (spine::TrackEntry *, spine::Event *)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spine::TrackEntry* larg0, spine::Event* larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setEventListener : Error processing arguments");
        cobj->setEventListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setEventListener)

static bool js_spine_SkeletonAnimation_setInterruptListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setInterruptListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (spine::TrackEntry *)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spine::TrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setInterruptListener : Error processing arguments");
        cobj->setInterruptListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setInterruptListener)

static bool js_spine_SkeletonAnimation_setMix(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setMix : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setMix : Error processing arguments");
        cobj->setMix(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setMix)

static bool js_spine_SkeletonAnimation_setStartListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setStartListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (spine::TrackEntry *)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spine::TrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setStartListener : Error processing arguments");
        cobj->setStartListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setStartListener)

static bool js_spine_SkeletonAnimation_setTrackCompleteListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setTrackCompleteListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<spine::TrackEntry*, false> arg0 = {};
        HolderType<std::function<void (spine::TrackEntry *)>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spine::TrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1.data = lambda;
            }
            else
            {
                arg1.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setTrackCompleteListener : Error processing arguments");
        cobj->setTrackCompleteListener(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setTrackCompleteListener)

static bool js_spine_SkeletonAnimation_setTrackDisposeListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setTrackDisposeListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<spine::TrackEntry*, false> arg0 = {};
        HolderType<std::function<void (spine::TrackEntry *)>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spine::TrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1.data = lambda;
            }
            else
            {
                arg1.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setTrackDisposeListener : Error processing arguments");
        cobj->setTrackDisposeListener(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setTrackDisposeListener)

static bool js_spine_SkeletonAnimation_setTrackEndListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setTrackEndListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<spine::TrackEntry*, false> arg0 = {};
        HolderType<std::function<void (spine::TrackEntry *)>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spine::TrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1.data = lambda;
            }
            else
            {
                arg1.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setTrackEndListener : Error processing arguments");
        cobj->setTrackEndListener(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setTrackEndListener)

static bool js_spine_SkeletonAnimation_setTrackEventListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setTrackEventListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<spine::TrackEntry*, false> arg0 = {};
        HolderType<std::function<void (spine::TrackEntry *, spine::Event *)>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spine::TrackEntry* larg0, spine::Event* larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1.data = lambda;
            }
            else
            {
                arg1.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setTrackEventListener : Error processing arguments");
        cobj->setTrackEventListener(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setTrackEventListener)

static bool js_spine_SkeletonAnimation_setTrackInterruptListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setTrackInterruptListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<spine::TrackEntry*, false> arg0 = {};
        HolderType<std::function<void (spine::TrackEntry *)>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spine::TrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1.data = lambda;
            }
            else
            {
                arg1.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setTrackInterruptListener : Error processing arguments");
        cobj->setTrackInterruptListener(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setTrackInterruptListener)

static bool js_spine_SkeletonAnimation_setTrackStartListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonAnimation_setTrackStartListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<spine::TrackEntry*, false> arg0 = {};
        HolderType<std::function<void (spine::TrackEntry *)>, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        do {
            if (args[1].isObject() && args[1].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[1]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](spine::TrackEntry* larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg1.data = lambda;
            }
            else
            {
                arg1.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setTrackStartListener : Error processing arguments");
        cobj->setTrackStartListener(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setTrackStartListener)

static bool js_spine_SkeletonAnimation_createWithBinaryFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_createWithBinaryFile : Error processing arguments");
        auto result = spine::SkeletonAnimation::createWithBinaryFile(arg0.value(), arg1.value());
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_spine_SkeletonAnimation_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_createWithBinaryFile : Error processing arguments");
        auto result = spine::SkeletonAnimation::createWithBinaryFile(arg0.value(), arg1.value(), arg2.value());
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_spine_SkeletonAnimation_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_createWithBinaryFile)

static bool js_spine_SkeletonAnimation_create(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = spine::SkeletonAnimation::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_spine_SkeletonAnimation_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_create)

static bool js_spine_SkeletonAnimation_createWithJsonFile(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_createWithJsonFile : Error processing arguments");
        auto result = spine::SkeletonAnimation::createWithJsonFile(arg0.value(), arg1.value());
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_spine_SkeletonAnimation_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        ok &= sevalue_to_native(args[1], &arg1, nullptr);
        ok &= sevalue_to_native(args[2], &arg2, nullptr);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_createWithJsonFile : Error processing arguments");
        auto result = spine::SkeletonAnimation::createWithJsonFile(arg0.value(), arg1.value(), arg2.value());
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_spine_SkeletonAnimation_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_createWithJsonFile)

static bool js_spine_SkeletonAnimation_setGlobalTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, nullptr);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonAnimation_setGlobalTimeScale : Error processing arguments");
        spine::SkeletonAnimation::setGlobalTimeScale(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonAnimation_setGlobalTimeScale)

SE_DECLARE_FINALIZE_FUNC(js_spine_SkeletonAnimation_finalize)

static bool js_spine_SkeletonAnimation_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    spine::SkeletonAnimation* cobj = JSB_ALLOC(spine::SkeletonAnimation);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_spine_SkeletonAnimation_constructor, __jsb_spine_SkeletonAnimation_class, js_spine_SkeletonAnimation_finalize)

static bool js_spine_SkeletonAnimation_ctor(se::State& s) // NOLINT(readability-identifier-naming)
{
    spine::SkeletonAnimation* cobj = JSB_ALLOC(spine::SkeletonAnimation);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_spine_SkeletonAnimation_ctor, __jsb_spine_SkeletonAnimation_class, js_spine_SkeletonAnimation_finalize)


    

static bool js_spine_SkeletonAnimation_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj =SE_THIS_OBJECT<spine::SkeletonAnimation>(s);
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_spine_SkeletonAnimation_finalize)

bool js_register_spine_SkeletonAnimation(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SkeletonAnimation", obj, __jsb_spine_SkeletonRenderer_proto, _SE(js_spine_SkeletonAnimation_constructor));

    cls->defineFunction("addAnimation", _SE(js_spine_SkeletonAnimation_addAnimation));
    cls->defineFunction("addEmptyAnimation", _SE(js_spine_SkeletonAnimation_addEmptyAnimation));
    cls->defineFunction("clearTrack", _SE(js_spine_SkeletonAnimation_clearTrack));
    cls->defineFunction("clearTracks", _SE(js_spine_SkeletonAnimation_clearTracks));
    cls->defineFunction("findAnimation", _SE(js_spine_SkeletonAnimation_findAnimation));
    cls->defineFunction("getCurrent", _SE(js_spine_SkeletonAnimation_getCurrent));
    cls->defineFunction("getState", _SE(js_spine_SkeletonAnimation_getState));
    cls->defineFunction("setAnimation", _SE(js_spine_SkeletonAnimation_setAnimation));
    cls->defineFunction("setAnimationStateData", _SE(js_spine_SkeletonAnimation_setAnimationStateData));
    cls->defineFunction("setCompleteListenerNative", _SE(js_spine_SkeletonAnimation_setCompleteListener));
    cls->defineFunction("setDisposeListener", _SE(js_spine_SkeletonAnimation_setDisposeListener));
    cls->defineFunction("setEmptyAnimation", _SE(js_spine_SkeletonAnimation_setEmptyAnimation));
    cls->defineFunction("setEmptyAnimations", _SE(js_spine_SkeletonAnimation_setEmptyAnimations));
    cls->defineFunction("setEndListener", _SE(js_spine_SkeletonAnimation_setEndListener));
    cls->defineFunction("setEventListener", _SE(js_spine_SkeletonAnimation_setEventListener));
    cls->defineFunction("setInterruptListener", _SE(js_spine_SkeletonAnimation_setInterruptListener));
    cls->defineFunction("setMix", _SE(js_spine_SkeletonAnimation_setMix));
    cls->defineFunction("setStartListener", _SE(js_spine_SkeletonAnimation_setStartListener));
    cls->defineFunction("setTrackCompleteListenerNative", _SE(js_spine_SkeletonAnimation_setTrackCompleteListener));
    cls->defineFunction("setTrackDisposeListener", _SE(js_spine_SkeletonAnimation_setTrackDisposeListener));
    cls->defineFunction("setTrackEndListener", _SE(js_spine_SkeletonAnimation_setTrackEndListener));
    cls->defineFunction("setTrackEventListener", _SE(js_spine_SkeletonAnimation_setTrackEventListener));
    cls->defineFunction("setTrackInterruptListener", _SE(js_spine_SkeletonAnimation_setTrackInterruptListener));
    cls->defineFunction("setTrackStartListener", _SE(js_spine_SkeletonAnimation_setTrackStartListener));
    cls->defineFunction("ctor", _SE(js_spine_SkeletonAnimation_ctor));
    cls->defineStaticFunction("createWithBinaryFile", _SE(js_spine_SkeletonAnimation_createWithBinaryFile));
    cls->defineStaticFunction("create", _SE(js_spine_SkeletonAnimation_create));
    cls->defineStaticFunction("createWithJsonFile", _SE(js_spine_SkeletonAnimation_createWithJsonFile));
    cls->defineStaticFunction("setGlobalTimeScale", _SE(js_spine_SkeletonAnimation_setGlobalTimeScale));
    cls->defineFinalizeFunction(_SE(js_spine_SkeletonAnimation_finalize));
    cls->install();
    JSBClassType::registerClass<spine::SkeletonAnimation>(cls);

    __jsb_spine_SkeletonAnimation_proto = cls->getProto();
    __jsb_spine_SkeletonAnimation_class = cls;

    jsb_set_extend_property("spine", "SkeletonAnimation");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_SkeletonCacheAnimation_proto = nullptr;
se::Class* __jsb_spine_SkeletonCacheAnimation_class = nullptr;

static bool js_spine_SkeletonCacheAnimation_addAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_addAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_addAnimation : Error processing arguments");
        cobj->addAnimation(arg0.value(), arg1.value());
        return true;
    }
    if (argc == 3) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_addAnimation : Error processing arguments");
        cobj->addAnimation(arg0.value(), arg1.value(), arg2.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_addAnimation)

static bool js_spine_SkeletonCacheAnimation_beginSchedule(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_beginSchedule : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->beginSchedule();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_beginSchedule)

static bool js_spine_SkeletonCacheAnimation_findAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_findAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_findAnimation : Error processing arguments");
        spine::Animation* result = cobj->findAnimation(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_findAnimation : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_findAnimation)

static bool js_spine_SkeletonCacheAnimation_findBone(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_findBone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_findBone : Error processing arguments");
        spine::Bone* result = cobj->findBone(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_findBone : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_findBone)

static bool js_spine_SkeletonCacheAnimation_findSlot(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_findSlot : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_findSlot : Error processing arguments");
        spine::Slot* result = cobj->findSlot(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_findSlot : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_findSlot)

static bool js_spine_SkeletonCacheAnimation_getAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_getAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<std::string, true> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_getAttachment : Error processing arguments");
        spine::Attachment* result = cobj->getAttachment(arg0.value(), arg1.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_getAttachment : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_getAttachment)

static bool js_spine_SkeletonCacheAnimation_getParamsBuffer(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_getParamsBuffer : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se::Object* result = cobj->getParamsBuffer();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_getParamsBuffer : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_getParamsBuffer)

static bool js_spine_SkeletonCacheAnimation_getSharedBufferOffset(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_getSharedBufferOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        se::Object* result = cobj->getSharedBufferOffset();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_getSharedBufferOffset : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_getSharedBufferOffset)

static bool js_spine_SkeletonCacheAnimation_getSkeleton(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_getSkeleton : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::Skeleton* result = cobj->getSkeleton();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_getSkeleton : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_getSkeleton)

static bool js_spine_SkeletonCacheAnimation_getTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_getTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getTimeScale();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_getTimeScale : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_getTimeScale)

static bool js_spine_SkeletonCacheAnimation_isOpacityModifyRGB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_isOpacityModifyRGB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->isOpacityModifyRGB();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_isOpacityModifyRGB : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_isOpacityModifyRGB)

static bool js_spine_SkeletonCacheAnimation_onDisable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_onDisable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onDisable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_onDisable)

static bool js_spine_SkeletonCacheAnimation_onEnable(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_onEnable : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->onEnable();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_onEnable)

static bool js_spine_SkeletonCacheAnimation_paused(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_paused : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_paused : Error processing arguments");
        cobj->paused(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_paused)

static bool js_spine_SkeletonCacheAnimation_setAnimation(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setAnimation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        HolderType<std::string, true> arg0 = {};
        HolderType<bool, false> arg1 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_setAnimation : Error processing arguments");
        cobj->setAnimation(arg0.value(), arg1.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setAnimation)

static bool js_spine_SkeletonCacheAnimation_setAttachEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setAttachEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_setAttachEnabled : Error processing arguments");
        cobj->setAttachEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setAttachEnabled)

static bool js_spine_SkeletonCacheAnimation_setAttachment(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2( cobj, false, "js_spine_SkeletonCacheAnimation_setAttachment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            HolderType<const char*, false> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            bool result = cobj->setAttachment(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_setAttachment : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    do {
        if (argc == 2) {
            HolderType<std::string, true> arg0 = {};
            HolderType<std::string, true> arg1 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
            if (!ok) { ok = true; break; }
            bool result = cobj->setAttachment(arg0.value(), arg1.value());
            ok &= nativevalue_to_se(result, s.rval(), s.thisObject() /*ctx*/);
            SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_setAttachment : Error processing arguments");
            SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setAttachment)

static bool js_spine_SkeletonCacheAnimation_setBatchEnabled(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setBatchEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_setBatchEnabled : Error processing arguments");
        cobj->setBatchEnabled(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setBatchEnabled)

static bool js_spine_SkeletonCacheAnimation_setBonesToSetupPose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setBonesToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setBonesToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setBonesToSetupPose)

static bool js_spine_SkeletonCacheAnimation_setColor(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        HolderType<float, false> arg0 = {};
        HolderType<float, false> arg1 = {};
        HolderType<float, false> arg2 = {};
        HolderType<float, false> arg3 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        ok &= sevalue_to_native(args[3], &arg3, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_setColor : Error processing arguments");
        cobj->setColor(arg0.value(), arg1.value(), arg2.value(), arg3.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setColor)

static bool js_spine_SkeletonCacheAnimation_setCompleteListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setCompleteListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (std::string)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](std::string larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_setCompleteListener : Error processing arguments");
        cobj->setCompleteListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setCompleteListener)

static bool js_spine_SkeletonCacheAnimation_setEndListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setEndListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (std::string)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](std::string larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_setEndListener : Error processing arguments");
        cobj->setEndListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setEndListener)

static bool js_spine_SkeletonCacheAnimation_setOpacityModifyRGB(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setOpacityModifyRGB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_setOpacityModifyRGB : Error processing arguments");
        cobj->setOpacityModifyRGB(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setOpacityModifyRGB)

static bool js_spine_SkeletonCacheAnimation_setSkin(se::State& s) // NOLINT(readability-identifier-naming)
{
    CC_UNUSED bool ok = true;
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2( cobj, false, "js_spine_SkeletonCacheAnimation_setSkin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 1) {
            HolderType<const char*, false> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setSkin(arg0.value());
            return true;
        }
    } while(false);

    do {
        if (argc == 1) {
            HolderType<std::string, true> arg0 = {};

            ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
            if (!ok) { ok = true; break; }
            cobj->setSkin(arg0.value());
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setSkin)

static bool js_spine_SkeletonCacheAnimation_setSlotsToSetupPose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setSlotsToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setSlotsToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setSlotsToSetupPose)

static bool js_spine_SkeletonCacheAnimation_setStartListener(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setStartListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (std::string)>, true> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](std::string larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_setStartListener : Error processing arguments");
        cobj->setStartListener(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setStartListener)

static bool js_spine_SkeletonCacheAnimation_setTimeScale(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setTimeScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_setTimeScale : Error processing arguments");
        cobj->setTimeScale(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setTimeScale)

static bool js_spine_SkeletonCacheAnimation_setToSetupPose(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setToSetupPose : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->setToSetupPose();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setToSetupPose)

static bool js_spine_SkeletonCacheAnimation_setUseTint(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_setUseTint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<bool, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_setUseTint : Error processing arguments");
        cobj->setUseTint(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_setUseTint)

static bool js_spine_SkeletonCacheAnimation_stopSchedule(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_stopSchedule : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stopSchedule();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_stopSchedule)

static bool js_spine_SkeletonCacheAnimation_update(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_update : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<float, false> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_update : Error processing arguments");
        cobj->update(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_update)

static bool js_spine_SkeletonCacheAnimation_updateAllAnimationCache(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_updateAllAnimationCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->updateAllAnimationCache();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_updateAllAnimationCache)

static bool js_spine_SkeletonCacheAnimation_updateAnimationCache(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheAnimation_updateAnimationCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_updateAnimationCache : Error processing arguments");
        cobj->updateAnimationCache(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheAnimation_updateAnimationCache)

SE_DECLARE_FINALIZE_FUNC(js_spine_SkeletonCacheAnimation_finalize)

static bool js_spine_SkeletonCacheAnimation_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    std::string arg0;
    bool arg1;
    ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
    ok &= sevalue_to_native(args[1], &arg1, s.thisObject());
    SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheAnimation_constructor : Error processing arguments");
    spine::SkeletonCacheAnimation* cobj = JSB_ALLOC(spine::SkeletonCacheAnimation, arg0, arg1);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_spine_SkeletonCacheAnimation_constructor, __jsb_spine_SkeletonCacheAnimation_class, js_spine_SkeletonCacheAnimation_finalize)



static bool js_spine_SkeletonCacheAnimation_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj =SE_THIS_OBJECT<spine::SkeletonCacheAnimation>(s);
    cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_spine_SkeletonCacheAnimation_finalize)

bool js_register_spine_SkeletonCacheAnimation(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SkeletonCacheAnimation", obj, nullptr, _SE(js_spine_SkeletonCacheAnimation_constructor));

    cls->defineFunction("addAnimation", _SE(js_spine_SkeletonCacheAnimation_addAnimation));
    cls->defineFunction("beginSchedule", _SE(js_spine_SkeletonCacheAnimation_beginSchedule));
    cls->defineFunction("findAnimation", _SE(js_spine_SkeletonCacheAnimation_findAnimation));
    cls->defineFunction("findBone", _SE(js_spine_SkeletonCacheAnimation_findBone));
    cls->defineFunction("findSlot", _SE(js_spine_SkeletonCacheAnimation_findSlot));
    cls->defineFunction("getAttachment", _SE(js_spine_SkeletonCacheAnimation_getAttachment));
    cls->defineFunction("getParamsBuffer", _SE(js_spine_SkeletonCacheAnimation_getParamsBuffer));
    cls->defineFunction("getSharedBufferOffset", _SE(js_spine_SkeletonCacheAnimation_getSharedBufferOffset));
    cls->defineFunction("getSkeleton", _SE(js_spine_SkeletonCacheAnimation_getSkeleton));
    cls->defineFunction("getTimeScale", _SE(js_spine_SkeletonCacheAnimation_getTimeScale));
    cls->defineFunction("isOpacityModifyRGB", _SE(js_spine_SkeletonCacheAnimation_isOpacityModifyRGB));
    cls->defineFunction("onDisable", _SE(js_spine_SkeletonCacheAnimation_onDisable));
    cls->defineFunction("onEnable", _SE(js_spine_SkeletonCacheAnimation_onEnable));
    cls->defineFunction("paused", _SE(js_spine_SkeletonCacheAnimation_paused));
    cls->defineFunction("setAnimation", _SE(js_spine_SkeletonCacheAnimation_setAnimation));
    cls->defineFunction("setAttachEnabled", _SE(js_spine_SkeletonCacheAnimation_setAttachEnabled));
    cls->defineFunction("setAttachment", _SE(js_spine_SkeletonCacheAnimation_setAttachment));
    cls->defineFunction("setBatchEnabled", _SE(js_spine_SkeletonCacheAnimation_setBatchEnabled));
    cls->defineFunction("setBonesToSetupPose", _SE(js_spine_SkeletonCacheAnimation_setBonesToSetupPose));
    cls->defineFunction("setColor", _SE(js_spine_SkeletonCacheAnimation_setColor));
    cls->defineFunction("setCompleteListener", _SE(js_spine_SkeletonCacheAnimation_setCompleteListener));
    cls->defineFunction("setEndListener", _SE(js_spine_SkeletonCacheAnimation_setEndListener));
    cls->defineFunction("setOpacityModifyRGB", _SE(js_spine_SkeletonCacheAnimation_setOpacityModifyRGB));
    cls->defineFunction("setSkin", _SE(js_spine_SkeletonCacheAnimation_setSkin));
    cls->defineFunction("setSlotsToSetupPose", _SE(js_spine_SkeletonCacheAnimation_setSlotsToSetupPose));
    cls->defineFunction("setStartListener", _SE(js_spine_SkeletonCacheAnimation_setStartListener));
    cls->defineFunction("setTimeScale", _SE(js_spine_SkeletonCacheAnimation_setTimeScale));
    cls->defineFunction("setToSetupPose", _SE(js_spine_SkeletonCacheAnimation_setToSetupPose));
    cls->defineFunction("setUseTint", _SE(js_spine_SkeletonCacheAnimation_setUseTint));
    cls->defineFunction("stopSchedule", _SE(js_spine_SkeletonCacheAnimation_stopSchedule));
    cls->defineFunction("update", _SE(js_spine_SkeletonCacheAnimation_update));
    cls->defineFunction("updateAllAnimationCache", _SE(js_spine_SkeletonCacheAnimation_updateAllAnimationCache));
    cls->defineFunction("updateAnimationCache", _SE(js_spine_SkeletonCacheAnimation_updateAnimationCache));
    cls->defineFinalizeFunction(_SE(js_spine_SkeletonCacheAnimation_finalize));
    cls->install();
    JSBClassType::registerClass<spine::SkeletonCacheAnimation>(cls);

    __jsb_spine_SkeletonCacheAnimation_proto = cls->getProto();
    __jsb_spine_SkeletonCacheAnimation_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_SkeletonCacheMgr_proto = nullptr;
se::Class* __jsb_spine_SkeletonCacheMgr_class = nullptr;

static bool js_spine_SkeletonCacheMgr_buildSkeletonCache(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheMgr>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheMgr_buildSkeletonCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheMgr_buildSkeletonCache : Error processing arguments");
        spine::SkeletonCache* result = cobj->buildSkeletonCache(arg0.value());
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheMgr_buildSkeletonCache : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheMgr_buildSkeletonCache)

static bool js_spine_SkeletonCacheMgr_removeSkeletonCache(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheMgr>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonCacheMgr_removeSkeletonCache : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::string, true> arg0 = {};
        ok &= sevalue_to_native(args[0], &arg0, s.thisObject());
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheMgr_removeSkeletonCache : Error processing arguments");
        cobj->removeSkeletonCache(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheMgr_removeSkeletonCache)

static bool js_spine_SkeletonCacheMgr_destroyInstance(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        spine::SkeletonCacheMgr::destroyInstance();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheMgr_destroyInstance)

static bool js_spine_SkeletonCacheMgr_getInstance(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::SkeletonCacheMgr* result = spine::SkeletonCacheMgr::getInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonCacheMgr_getInstance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonCacheMgr_getInstance)


static bool js_spine_SkeletonCacheMgr_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<spine::SkeletonCacheMgr>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<spine::SkeletonCacheMgr>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_spine_SkeletonCacheMgr_finalize)

bool js_register_spine_SkeletonCacheMgr(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SkeletonCacheMgr", obj, nullptr, nullptr);

    cls->defineFunction("buildSkeletonCache", _SE(js_spine_SkeletonCacheMgr_buildSkeletonCache));
    cls->defineFunction("removeSkeletonCache", _SE(js_spine_SkeletonCacheMgr_removeSkeletonCache));
    cls->defineStaticFunction("destroyInstance", _SE(js_spine_SkeletonCacheMgr_destroyInstance));
    cls->defineStaticFunction("getInstance", _SE(js_spine_SkeletonCacheMgr_getInstance));
    cls->defineFinalizeFunction(_SE(js_spine_SkeletonCacheMgr_finalize));
    cls->install();
    JSBClassType::registerClass<spine::SkeletonCacheMgr>(cls);

    __jsb_spine_SkeletonCacheMgr_proto = cls->getProto();
    __jsb_spine_SkeletonCacheMgr_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
se::Object* __jsb_spine_SkeletonDataMgr_proto = nullptr;
se::Class* __jsb_spine_SkeletonDataMgr_class = nullptr;

static bool js_spine_SkeletonDataMgr_setDestroyCallback(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto* cobj = SE_THIS_OBJECT<spine::SkeletonDataMgr>(s);
    SE_PRECONDITION2(cobj, false, "js_spine_SkeletonDataMgr_setDestroyCallback : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        HolderType<std::function<void (int)>, false> arg0 = {};
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](int larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
        
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0.data = lambda;
            }
            else
            {
                arg0.data = nullptr;
            }
        } while(false)
        ;
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonDataMgr_setDestroyCallback : Error processing arguments");
        cobj->setDestroyCallback(arg0.value());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonDataMgr_setDestroyCallback)

static bool js_spine_SkeletonDataMgr_getInstance(se::State& s) // NOLINT(readability-identifier-naming)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        spine::SkeletonDataMgr* result = spine::SkeletonDataMgr::getInstance();
        ok &= nativevalue_to_se(result, s.rval(), nullptr /*ctx*/);
        SE_PRECONDITION2(ok, false, "js_spine_SkeletonDataMgr_getInstance : Error processing arguments");
        SE_HOLD_RETURN_VALUE(result, s.thisObject(), s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_spine_SkeletonDataMgr_getInstance)

SE_DECLARE_FINALIZE_FUNC(js_spine_SkeletonDataMgr_finalize)

static bool js_spine_SkeletonDataMgr_constructor(se::State& s) // NOLINT(readability-identifier-naming) constructor.c
{
    spine::SkeletonDataMgr* cobj = JSB_ALLOC(spine::SkeletonDataMgr);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_spine_SkeletonDataMgr_constructor, __jsb_spine_SkeletonDataMgr_class, js_spine_SkeletonDataMgr_finalize)



static bool js_spine_SkeletonDataMgr_finalize(se::State& s) // NOLINT(readability-identifier-naming)
{
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(SE_THIS_OBJECT<spine::SkeletonDataMgr>(s));
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        auto* cobj = SE_THIS_OBJECT<spine::SkeletonDataMgr>(s);
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_spine_SkeletonDataMgr_finalize)

bool js_register_spine_SkeletonDataMgr(se::Object* obj) // NOLINT(readability-identifier-naming)
{
    auto* cls = se::Class::create("SkeletonDataMgr", obj, nullptr, _SE(js_spine_SkeletonDataMgr_constructor));

    cls->defineFunction("setDestroyCallback", _SE(js_spine_SkeletonDataMgr_setDestroyCallback));
    cls->defineStaticFunction("getInstance", _SE(js_spine_SkeletonDataMgr_getInstance));
    cls->defineFinalizeFunction(_SE(js_spine_SkeletonDataMgr_finalize));
    cls->install();
    JSBClassType::registerClass<spine::SkeletonDataMgr>(cls);

    __jsb_spine_SkeletonDataMgr_proto = cls->getProto();
    __jsb_spine_SkeletonDataMgr_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}
bool register_all_spine(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("spine", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("spine", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_spine_Slot(ns);
    js_register_spine_ConstraintData(ns);
    js_register_spine_Polygon(ns);
    js_register_spine_SkeletonCacheAnimation(ns);
    js_register_spine_Attachment(ns);
    js_register_spine_VertexAttachment(ns);
    js_register_spine_SkeletonDataMgr(ns);
    js_register_spine_VertexEffect(ns);
    js_register_spine_JitterVertexEffect(ns);
    js_register_spine_SkeletonCacheMgr(ns);
    js_register_spine_Timeline(ns);
    js_register_spine_CurveTimeline(ns);
    js_register_spine_IkConstraintTimeline(ns);
    js_register_spine_SkeletonRenderer(ns);
    js_register_spine_Animation(ns);
    js_register_spine_MeshAttachment(ns);
    js_register_spine_TranslateTimeline(ns);
    js_register_spine_ShearTimeline(ns);
    js_register_spine_AttachmentTimeline(ns);
    js_register_spine_PathConstraintMixTimeline(ns);
    js_register_spine_PathConstraintPositionTimeline(ns);
    js_register_spine_PathConstraintSpacingTimeline(ns);
    js_register_spine_SkeletonAnimation(ns);
    js_register_spine_IkConstraintData(ns);
    js_register_spine_SwirlVertexEffect(ns);
    js_register_spine_AnimationStateData(ns);
    js_register_spine_PointAttachment(ns);
    js_register_spine_AnimationState(ns);
    js_register_spine_TrackEntry(ns);
    js_register_spine_BoneData(ns);
    js_register_spine_ScaleTimeline(ns);
    js_register_spine_SkeletonData(ns);
    js_register_spine_PathAttachment(ns);
    js_register_spine_TransformConstraint(ns);
    js_register_spine_BoundingBoxAttachment(ns);
    js_register_spine_ClippingAttachment(ns);
    js_register_spine_DeformTimeline(ns);
    js_register_spine_SkeletonBounds(ns);
    js_register_spine_TransformConstraintData(ns);
    js_register_spine_ColorTimeline(ns);
    js_register_spine_PathConstraint(ns);
    js_register_spine_TransformConstraintTimeline(ns);
    js_register_spine_Bone(ns);
    js_register_spine_EventTimeline(ns);
    js_register_spine_Skeleton(ns);
    js_register_spine_TwoColorTimeline(ns);
    js_register_spine_Color(ns);
    js_register_spine_DrawOrderTimeline(ns);
    js_register_spine_RegionAttachment(ns);
    js_register_spine_IkConstraint(ns);
    js_register_spine_RotateTimeline(ns);
    js_register_spine_SlotData(ns);
    js_register_spine_Skin(ns);
    js_register_spine_VertexEffectDelegate(ns);
    js_register_spine_EventData(ns);
    js_register_spine_Event(ns);
    js_register_spine_PathConstraintData(ns);
    return true;
}

