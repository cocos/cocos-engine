#include <jni.h>
#include <native_layer.h>
#include <native_layer_jni.h>
#include "platform/BasePlatform.h"
#include "platform/java/jni/glue/JniNativeGlue.h"

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosAbilitySlice_onOrientationChangedNative(JNIEnv *env, jobject obj, jint orientation, jint width, jint height) { //NOLINT JNI function name
    static jint pOrientation = 0;
    static jint pWidth       = 0;
    static jint pHeight      = 0;
    if (pOrientation != orientation || pWidth != width || pHeight != height) {
        cc::WindowEvent ev;
        ev.type   = cc::WindowEvent::Type::SIZE_CHANGED;
        ev.width  = width;
        ev.height = height;
        JNI_NATIVE_GLUE()->dispatchEvent(ev);
        pOrientation = orientation;
        pHeight      = height;
        pWidth       = width;
    }
}