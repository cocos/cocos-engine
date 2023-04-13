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

#include <jni.h>
#include <native_layer.h>
#include <native_layer_jni.h>
#include "platform/BasePlatform.h"
#include "platform/java/jni/glue/JniNativeGlue.h"

JNIEXPORT void JNICALL Java_com_cocos_lib_CocosAbilitySlice_onOrientationChangedNative(JNIEnv *env, jobject obj, jint orientation, jint width, jint height) { //NOLINT JNI function name
    static jint pOrientation = 0;
    static jint pWidth = 0;
    static jint pHeight = 0;
    if (pOrientation != orientation || pWidth != width || pHeight != height) {
        cc::WindowEvent ev;
        ev.type = cc::WindowEvent::Type::SIZE_CHANGED;
        ev.width = width;
        ev.height = height;
        //JNI_NATIVE_GLUE()->dispatchEvent(ev);
        cc::events::WindowEvent::broadcast(ev);
        pOrientation = orientation;
        pHeight = height;
        pWidth = width;
    }
}