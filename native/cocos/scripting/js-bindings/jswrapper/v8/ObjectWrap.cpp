#include "ObjectWrap.h"

#ifdef SCRIPT_ENGINE_V8

namespace se {

    ObjectWrap::ObjectWrap() {
        refs_ = 0;
        _nativeObj = nullptr;
        _finalizeCb = nullptr;
    }

    bool ObjectWrap::init(v8::Local<v8::Object> handle) {
        assert(persistent().IsEmpty());
        persistent().Reset(v8::Isolate::GetCurrent(), handle);
        makeWeak();
        return true;
    }

    void ObjectWrap::setFinalizeCallback(V8FinalizeFunc finalizeCb) {
        _finalizeCb = finalizeCb;
    }

    ObjectWrap::~ObjectWrap() {
        if (persistent().IsEmpty())
            return;
        //cjh            assert(persistent().IsNearDeath());
        persistent().ClearWeak();
        persistent().Reset();
    }


/*static*/
    void *ObjectWrap::unwrap(v8::Local<v8::Object> handle) {
        assert(!handle.IsEmpty());
        assert(handle->InternalFieldCount() > 0);
        return handle->GetAlignedPointerFromInternalField(0);
    }


    v8::Local<v8::Object> ObjectWrap::handle() {
        return handle(v8::Isolate::GetCurrent());
    }


    v8::Local<v8::Object> ObjectWrap::handle(v8::Isolate *isolate) {
        return v8::Local<v8::Object>::New(isolate, persistent());
    }


    v8::Persistent<v8::Object> &ObjectWrap::persistent() {
        return handle_;
    }

    void ObjectWrap::wrap(void *nativeObj) {
        assert(handle()->InternalFieldCount() > 0);
        _nativeObj = nativeObj;
        handle()->SetAlignedPointerInInternalField(0, nativeObj);
    }

    void ObjectWrap::makeWeak() {
        persistent().SetWeak(this, weakCallback, v8::WeakCallbackType::kFinalizer);
        persistent().MarkIndependent();
    }


    void ObjectWrap::ref() {
        assert(!persistent().IsEmpty());
        persistent().ClearWeak();
        refs_++;
    }

    void ObjectWrap::unref() {
        assert(!persistent().IsEmpty());
        assert(!persistent().IsWeak());
        assert(refs_ > 0);
        if (--refs_ == 0)
            makeWeak();
    }

/*static*/
    void ObjectWrap::weakCallback(const v8::WeakCallbackInfo<ObjectWrap> &data) {
        ObjectWrap *wrap = data.GetParameter();
//        LOGD("weakCallback: %p, nativeObj = %p, finalize: %p\n", wrap, wrap->_nativeObj, wrap->_finalizeCb);
        assert(wrap->refs_ == 0);
        wrap->handle_.Reset();
        if (wrap->_finalizeCb != nullptr)
        {
            wrap->_finalizeCb(wrap->_nativeObj); // wrap will be destroyed in wrap->_finalizeCb, should not use any wrap object after this line.
        }
    }

} // namespace se {

#endif // #ifdef SCRIPT_ENGINE_V8
