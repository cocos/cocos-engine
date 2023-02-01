#include "HasJSThisObject.h"
#include "PrivateObject.h"
#include "MappingUtils.h"

namespace se {
    se::Object * HasJSThisObject::getJSThis() const {
        return _thisObject;
    }    
    void HasJSThisObject::bindJSThis(void *nativePtr) {
        CC_ASSERTF(!_thisObject, "should not bound twice");
        _thisObject = se::NativePtrToObjectMap::findFirst(nativePtr);
        CC_ASSERT(_thisObject);
    }    
}
