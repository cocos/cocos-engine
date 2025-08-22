/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { OutputArchive, InputArchive } from './archive';
import { Color, DescriptorSetLayoutBinding, DescriptorSetLayoutInfo, Uniform, UniformBlock } from '../../gfx';

export function saveColor (ar: OutputArchive, v: Color): void {
    ar.n(v.x);
    ar.n(v.y);
    ar.n(v.z);
    ar.n(v.w);
}

export function loadColor (ar: InputArchive, v: Color): void {
    v.x = ar.n();
    v.y = ar.n();
    v.z = ar.n();
    v.w = ar.n();
}

export function saveUniform (ar: OutputArchive, v: Uniform): void {
    ar.s(v.name);
    ar.n(v.type);
    ar.n(v.count);
}

export function loadUniform (ar: InputArchive, v: Uniform): void {
    v.name = ar.s();
    v.type = ar.n();
    v.count = ar.n();
}

export function saveUniformBlock (ar: OutputArchive, v: UniformBlock): void {
    ar.n(v.set);
    ar.n(v.binding);
    ar.s(v.name);
    ar.n(v.members.length);
    for (const v1 of v.members) {
        saveUniform(ar, v1);
    }
    ar.n(v.count);
}

export function loadUniformBlock (ar: InputArchive, v: UniformBlock): void {
    v.set = ar.n();
    v.binding = ar.n();
    v.name = ar.s();
    let sz = 0;
    sz = ar.n();
    v.members.length = sz;
    for (let i = 0; i !== sz; ++i) {
        const v1 = new Uniform();
        loadUniform(ar, v1);
        v.members[i] = v1;
    }
    v.count = ar.n();
}

export function saveDescriptorSetLayoutBinding (ar: OutputArchive, v: DescriptorSetLayoutBinding): void {
    ar.n(v.binding);
    ar.n(v.descriptorType);
    ar.n(v.count);
    ar.n(v.stageFlags);
    // skip immutableSamplers;
}

export function loadDescriptorSetLayoutBinding (ar: InputArchive, v: DescriptorSetLayoutBinding): void {
    v.binding = ar.n();
    v.descriptorType = ar.n();
    v.count = ar.n();
    v.stageFlags = ar.n();
    // skip immutableSamplers;
}

export function saveDescriptorSetLayoutInfo (ar: OutputArchive, v: DescriptorSetLayoutInfo): void {
    ar.n(v.bindings.length);
    for (const v1 of v.bindings) {
        saveDescriptorSetLayoutBinding(ar, v1);
    }
}

export function loadDescriptorSetLayoutInfo (ar: InputArchive, v: DescriptorSetLayoutInfo): void {
    const sz = ar.n();
    v.bindings.length = sz;
    for (let i = 0; i !== sz; ++i) {
        const v1 = new DescriptorSetLayoutBinding();
        loadDescriptorSetLayoutBinding(ar, v1);
        v.bindings[i] = v1;
    }
}
