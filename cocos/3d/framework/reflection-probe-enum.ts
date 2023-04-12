/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

/**
 * @en Use Reflection probe
 * @zh 使用反射探针。
 */
export enum ReflectionProbeType {
    /**
     * @en Use the default skybox.
     * @zh 使用默认天空盒。
     */
    NONE = 0,
    /**
     * @en Cubemap generate by probe.
     * @zh Probe烘焙的cubemap。
     */
    BAKED_CUBEMAP = 1,
    /**
     * @en Realtime planar reflection.
     * @zh 实时平面反射。
     */
    PLANAR_REFLECTION = 2,
    /**
     * @en Mixing between reflection probe.
     * @zh 反射探针之间进行混合。
     */
    BLEND_PROBES = 3,
    /**
     * @en Mixing between reflection probe and skybox.
     * @zh 反射探针之间混合或反射探针和天空盒之间混合。
     */
    BLEND_PROBES_AND_SKYBOX = 4,
}
