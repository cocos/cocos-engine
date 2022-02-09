/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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