/*
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
import { Mat3, Vec3, _decorator } from "../../core";
import { patch_cc_CircumSphere, patch_cc_Tetrahedron, patch_cc_Vertex } from "../../native-binding/decorators";
import type { Vertex as JsbVertex, CircumSphere as JsbCircumSphere, Tetrahedron as JsbTetrahedron } from './delaunay';

declare const jsb: any;

export const Vertex: typeof JsbVertex = jsb.Vertex;
export type Vertex = JsbVertex;
patch_cc_Vertex({Vertex, Vec3});

export const CircumSphere: typeof JsbCircumSphere = jsb.CircumSphere;
export type CircumSphere = JsbCircumSphere;
patch_cc_CircumSphere({CircumSphere, Vec3});

export const Tetrahedron: typeof JsbTetrahedron = jsb.Tetrahedron;
export type Tetrahedron = JsbTetrahedron;
patch_cc_Tetrahedron({Tetrahedron, Mat3, Vec3, CircumSphere});