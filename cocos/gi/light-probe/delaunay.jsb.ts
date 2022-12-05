/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/
import { Mat3, Vec3, _decorator } from "../../core";

const { ccclass, serializable } = _decorator;

export const Vertex = jsb.Vertex;
const VertexProto = Vertex.prototype;
serializable(VertexProto, 'position', () => new Vec3(0, 0, 0));
serializable(VertexProto, 'normal', () => new Vec3(0, 0, 0));
serializable(VertexProto, 'coefficients', () => []);
ccclass('cc.Vertex')(Vertex);

export const CircumSphere = jsb.CircumSphere;
const CircumSphereProto = CircumSphere.prototype;
serializable(CircumSphereProto, 'center', () => new Vec3(0, 0, 0));
serializable(CircumSphereProto, 'radiusSquared', () => 0.0);
ccclass('cc.CircumSphere')(CircumSphere);

export const Tetrahedron = jsb.Tetrahedron;
const TetrahedronProto = Tetrahedron.prototype;
serializable(TetrahedronProto, 'invalid', () => false);
serializable(TetrahedronProto, 'vertex0', () => -1);
serializable(TetrahedronProto, 'vertex1', () => -1);
serializable(TetrahedronProto, 'vertex2', () => -1);
serializable(TetrahedronProto, 'vertex3', () => -1);
serializable(TetrahedronProto, 'neighbours', () => [-1, -1, -1, -1]);
serializable(TetrahedronProto, 'matrix', () => new Mat3());
serializable(TetrahedronProto, 'offset', () => new Vec3(0.0, 0.0, 0.0));
serializable(TetrahedronProto, 'sphere', () => new CircumSphere());
ccclass('cc.Tetrahedron')(Tetrahedron);
