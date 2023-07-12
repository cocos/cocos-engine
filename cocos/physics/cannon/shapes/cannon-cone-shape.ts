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

import CANNON from '@cocos/cannon';
import { Vec3, IVec3Like } from '../../../core';
import { CannonShape } from './cannon-shape';
import { IConeShape } from '../../spec/i-physics-shape';
import { ConeCollider } from '../../../../exports/physics-framework';
import { EAxisDirection } from '../../framework/physics-enum';
import { commitShapeUpdates } from '../cannon-util';

const v3_0 = new Vec3();
const v3_1 = new Vec3();

export class CannonConeShape extends CannonShape implements IConeShape {
    get collider (): ConeCollider {
        return this._collider as ConeCollider;
    }

    get impl (): CANNON.Cylinder {
        return this._shape as CANNON.Cylinder;
    }

    setRadius (v: number): void {
        this.updateProperties(
            this.collider.radius,
            this.collider.height,
            (CANNON as any).CC_CONFIG.numSegmentsCone,
            this.collider.direction,
            this.collider.node.worldScale,
        );

        if (this._index !== -1) commitShapeUpdates(this._body);
    }

    setHeight (v: number): void {
        this.updateProperties(
            this.collider.radius,
            this.collider.height,
            (CANNON as any).CC_CONFIG.numSegmentsCone,
            this.collider.direction,
            this.collider.node.worldScale,
        );

        if (this._index !== -1) commitShapeUpdates(this._body);
    }

    setDirection (v: number): void {
        this.updateProperties(
            this.collider.radius,
            this.collider.height,
            (CANNON as any).CC_CONFIG.numSegmentsCone,
            this.collider.direction,
            this.collider.node.worldScale,
        );

        if (this._index !== -1) commitShapeUpdates(this._body);
    }

    constructor (radius = 0.5, height = 1, direction = EAxisDirection.Y_AXIS) {
        super();
        this._shape = new CANNON.Cylinder(0, radius, height, (CANNON as any).CC_CONFIG.numSegmentsCone, direction === EAxisDirection.Y_AXIS);
    }

    onLoad (): void {
        super.onLoad();
        this.setRadius(this.collider.radius);
    }

    setScale (scale: Vec3): void {
        super.setScale(scale);
        this.setRadius(this.collider.radius);
    }

    updateProperties (radius: number, height: number, numSegments: number, direction: number, scale: IVec3Like): void {
        let wh = height;
        let wr = radius;
        const cos = Math.cos;
        const sin = Math.sin;
        const abs = Math.abs;
        const max = Math.max;
        if (direction === 1) {
            wh = abs(scale.y) * height;
            wr = max(abs(scale.x), abs(scale.z)) * radius;
        } else if (direction === 2) {
            wh = abs(scale.z) * height;
            wr = max(abs(scale.x), abs(scale.y)) * radius;
        } else {
            wh = abs(scale.x) * height;
            wr = max(abs(scale.y), abs(scale.z)) * radius;
        }
        const N = numSegments;
        const hH = wh / 2;
        const vertices: CANNON.Vec3[] = [];
        const indices: number[][] = [];
        const axes: CANNON.Vec3[] = [];
        const theta = Math.PI * 2 / N;
        if (direction === 1) {
            const bf: number[] = [];
            indices.push(bf);
            vertices.push(new CANNON.Vec3(0, hH, 0));
            for (let i = 0; i < N; i++) {
                const x = wr * cos(theta * i);
                const z = wr * sin(theta * i);
                vertices.push(new CANNON.Vec3(x, -hH, z));
            }
            for (let i = 0; i < N; i++) {
                if (i !== 0) bf.push(i);
                let face: number[];
                if (i < N - 1) {
                    face = [0, i + 2, i + 1];
                } else {
                    face = [0, 1, i + 1];
                }
                indices.push(face);
                Vec3.subtract(v3_0, vertices[0], vertices[face[1]]);
                Vec3.subtract(v3_1, vertices[face[2]], vertices[face[1]]);
                Vec3.cross(v3_0, v3_1, v3_0);
                v3_0.normalize();
                axes.push(new CANNON.Vec3(v3_0.x, v3_0.y, v3_0.z));
            }
            axes.push(new CANNON.Vec3(0, -1, 0));
        } else if (direction === 2) {
            const bf: number[] = [];
            indices.push(bf);
            vertices.push(new CANNON.Vec3(0, 0, hH));
            for (let i = 0; i < N; i++) {
                const x = wr * cos(theta * i);
                const y = wr * sin(theta * i);
                vertices.push(new CANNON.Vec3(x, y, -hH));
            }
            for (let i = 0; i < N; i++) {
                if (i !== 0) bf.push(N - i);
                let face: number[];
                if (i < N - 1) {
                    face = [0, i + 1, i + 2];
                } else {
                    face = [0, i + 1, 1];
                }
                indices.push(face);
                Vec3.subtract(v3_0, vertices[0], vertices[face[1]]);
                Vec3.subtract(v3_1, vertices[face[2]], vertices[face[1]]);
                Vec3.cross(v3_0, v3_0, v3_1);
                v3_0.normalize();
                axes.push(new CANNON.Vec3(v3_0.x, v3_0.y, v3_0.z));
            }
            axes.push(new CANNON.Vec3(0, 0, -1));
        } else {
            const bf: number[] = [];
            indices.push(bf);
            vertices.push(new CANNON.Vec3(hH, 0, 0));
            for (let i = 0; i < N; i++) {
                const y = wr * cos(theta * i);
                const z = wr * sin(theta * i);
                vertices.push(new CANNON.Vec3(-hH, y, z));
            }
            for (let i = 0; i < N; i++) {
                if (i !== 0) bf.push(N - i);
                let face: number[];
                if (i < N - 1) {
                    face = [0, i + 1, i + 2];
                } else {
                    face = [0, i + 1, 1];
                }
                indices.push(face);
                Vec3.subtract(v3_0, vertices[0], vertices[face[1]]);
                Vec3.subtract(v3_1, vertices[face[2]], vertices[face[1]]);
                Vec3.cross(v3_0, v3_0, v3_1);
                v3_0.normalize();
                axes.push(new CANNON.Vec3(v3_0.x, v3_0.y, v3_0.z));
            }
            axes.push(new CANNON.Vec3(-1, 0, 0));
        }

        this.impl.vertices = vertices;
        this.impl.faces = indices;
        this.impl.uniqueAxes = axes;
        this.impl.worldVerticesNeedsUpdate = true;
        this.impl.worldFaceNormalsNeedsUpdate = true;
        this.impl.computeNormals();
        this.impl.computeEdges();
        this.impl.updateBoundingSphereRadius();
    }
}
