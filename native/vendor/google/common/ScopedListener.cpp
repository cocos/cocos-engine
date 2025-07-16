
#include "vendor/google/common/ScopedListener.h"
#include "cocos/bindings/jswrapper/SeApi.h"

namespace cc {
scopedListener::scopedListener(se::Object* obj) : _obj(obj) {
    if (_obj) {
        _obj->root();
        _obj->incRef();
    }
}

scopedListener::~scopedListener() {
    if (_obj) {
        _obj->unroot();
        _obj->decRef();
    }
}

void scopedListener::reset(se::Object* obj) {
    if (_obj) {
        _obj->unroot();
        _obj->decRef();
    }
    _obj = obj;
    if (_obj) {
        _obj->root();
        _obj->incRef();
    }
}
}
