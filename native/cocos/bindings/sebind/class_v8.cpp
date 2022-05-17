#include "class_v8.h"

namespace sebind {
void genericFunction(const v8::FunctionCallbackInfo<v8::Value> &v8args) {
    void *ctx = v8args.Data().IsEmpty() ? nullptr : v8args.Data().As<v8::External>()->Value();
    auto *method = reinterpret_cast<intl::InstanceMethodBase *>(ctx);
    assert(ctx);
    bool ret = false;
    v8::Isolate *isolate = v8args.GetIsolate();
    v8::HandleScope handleScope(isolate);
    se::ValueArray &args = se::gValueArrayPool.get(v8args.Length());
    se::CallbackDepthGuard depthGuard{args, se::gValueArrayPool._depth};
    se::internal::jsToSeArgs(v8args, args);
    auto *thisObject = reinterpret_cast<se::Object *>(se::internal::getPrivate(isolate, v8args.This()));
    se::State state(thisObject, args);
    ret = method->invoke(state);
    if (!ret) {
        SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", method->method_name.c_str(), __FILE__, __LINE__);
    }
    se::internal::setReturnValue(state.rval(), v8args);
}

} // namespace sebind
