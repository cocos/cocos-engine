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

import { ccclass, serializable, type } from 'cc.decorator';
import { Vertex, Tetrahedron, Delaunay } from './delaunay';
import { PolynomialSolver } from './polynomial-solver';
import { LightProbeInfo } from '../../scene-graph/scene-globals';
import { Vec3, Vec4, cclegacy, EPSILON } from '../../core';
import { SH } from './sh';

const _v1 = new Vec3(0.0, 0.0, 0.0);
const _v2 = new Vec3(0.0, 0.0, 0.0);
const _normal = new Vec3(0.0, 0.0, 0.0);
const _edgeP0 = new Vec3(0.0, 0.0, 0.0);
const _edgeP1 = new Vec3(0.0, 0.0, 0.0);
const _edgeP2 = new Vec3(0.0, 0.0, 0.0);
const _crossP12 = new Vec3(0.0, 0.0, 0.0);
const _crossP20 = new Vec3(0.0, 0.0, 0.0);

const _normal2 = new Vec3(0.0, 0.0, 0.0);
const _edge1 = new Vec3(0.0, 0.0, 0.0);
const _edge2 = new Vec3(0.0, 0.0, 0.0);
const _v = new Vec3(0.0, 0.0, 0.0);
const _vp0 = new Vec3(0.0, 0.0, 0.0);
const _vp1 = new Vec3(0.0, 0.0, 0.0);
const _vp2 = new Vec3(0.0, 0.0, 0.0);

@ccclass('cc.LightProbesData')
export class LightProbesData {
    public get probes (): Vertex[] {
        return this._probes;
    }

    public get tetrahedrons (): Tetrahedron[] {
        return this._tetrahedrons;
    }

    public empty (): boolean {
        return this._probes.length === 0 || this._tetrahedrons.length === 0;
    }

    public reset (): void {
        this._probes.length = 0;
        this._tetrahedrons.length = 0;
    }

    public updateProbes (points: Vec3[]): void {
        this._probes.length = points.length;

        const pointCount = this._probes.length;
        for (let i = 0; i < pointCount; i++) {
            let probe = this._probes[i];
            if (!probe) {
                probe = new Vertex(points[i]);
                for (let j = 0; j < SH.getBasisCount(); j++) {
                    probe.coefficients[j] = Vec3.ZERO;
                }
                this._probes[i] = probe;
            } else {
                probe.position.set(points[i]);
            }
        }
    }

    public updateTetrahedrons (): void {
        const delaunay = new Delaunay(this._probes);
        this._tetrahedrons = delaunay.build();
    }

    public getInterpolationSHCoefficients (tetIndex: number, weights: Vec4, coefficients: Vec3[]): boolean {
        if (!this.hasCoefficients()) {
            return false;
        }

        const length = SH.getBasisCount();
        const tetrahedron = this._tetrahedrons[tetIndex];
        const c0 = this._probes[tetrahedron.vertex0].coefficients;
        const c1 = this._probes[tetrahedron.vertex1].coefficients;
        const c2 = this._probes[tetrahedron.vertex2].coefficients;

        if (tetrahedron.vertex3 >= 0) {
            const c3 = this._probes[tetrahedron.vertex3].coefficients;

            for (let i = 0; i < length; i++) {
                coefficients[i] = new Vec3(0.0, 0.0, 0.0);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c0[i], weights.x);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c1[i], weights.y);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c2[i], weights.z);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c3[i], weights.w);
            }
        } else {
            for (let i = 0; i < length; i++) {
                coefficients[i] = new Vec3(0.0, 0.0, 0.0);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c0[i], weights.x);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c1[i], weights.y);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c2[i], weights.z);
            }
        }

        return true;
    }

    public getInterpolationWeights (position: Vec3, tetIndex: number, weights: Vec4): number {
        const tetrahedronCount = this._tetrahedrons.length;
        if (tetIndex < 0 || tetIndex >= tetrahedronCount) {
            tetIndex = 0;
        }

        let lastIndex = -1;
        let nextIndex = -1;

        for (let i = 0; i < tetrahedronCount; i++) {
            const tetrahedron = this._tetrahedrons[tetIndex];
            this.getBarycentricCoord(position, tetrahedron, weights);
            if (weights.x >= 0.0 && weights.y >= 0.0 && weights.z >= 0.0 && weights.w >= 0.0) {
                break;
            }

            if (weights.x < weights.y && weights.x < weights.z && weights.x < weights.w) {
                nextIndex = tetrahedron.neighbours[0];
            } else if (weights.y < weights.z && weights.y < weights.w) {
                nextIndex = tetrahedron.neighbours[1];
            } else if (weights.z < weights.w) {
                nextIndex = tetrahedron.neighbours[2];
            } else {
                nextIndex = tetrahedron.neighbours[3];
            }

            // return directly due to numerical precision error
            if (lastIndex === nextIndex) {
                break;
            }

            lastIndex = tetIndex;
            tetIndex = nextIndex;
        }

        return tetIndex;
    }

    public hasCoefficients (): boolean {
        return !this.empty() && this._probes[0].coefficients.length !== 0;
    }

    private static getTriangleBarycentricCoord (p0: Vec3, p1: Vec3, p2: Vec3, position: Vec3): Vec3 {
        Vec3.subtract(_v1, p1, p0);
        Vec3.subtract(_v2, p2, p0);
        Vec3.cross(_normal, _v1, _v2);

        if (_normal.lengthSqr() <= EPSILON) {
            return new Vec3(0.0, 0.0, 0.0);
        }

        const n = _normal.clone();
        n.normalize();
        const area012Inv = 1.0 / n.dot(_normal);

        Vec3.subtract(_edgeP0, p0, position);
        Vec3.subtract(_edgeP1, p1, position);
        Vec3.subtract(_edgeP2, p2, position);

        Vec3.cross(_crossP12, _edgeP1, _edgeP2);
        const areaP12 = n.dot(_crossP12);
        const alpha = areaP12 * area012Inv;

        Vec3.cross(_crossP20, _edgeP2, _edgeP0);
        const areaP20 = n.dot(_crossP20);
        const beta = areaP20 * area012Inv;

        return new Vec3(alpha, beta, 1.0 - alpha - beta);
    }

    private getBarycentricCoord (position: Vec3, tetrahedron: Tetrahedron, weights: Vec4): void {
        if (tetrahedron.vertex3 >= 0) {
            this.getTetrahedronBarycentricCoord(position, tetrahedron, weights);
        } else {
            this.getOuterCellBarycentricCoord(position, tetrahedron, weights);
        }
    }

    private getTetrahedronBarycentricCoord (position: Vec3, tetrahedron: Tetrahedron, weights: Vec4): void {
        const result = new Vec3(0.0, 0.0, 0.0);
        Vec3.subtract(result, position, this._probes[tetrahedron.vertex3].position);
        Vec3.transformMat3(result, result, tetrahedron.matrix);

        weights.set(result.x, result.y, result.z, 1.0 - result.x - result.y - result.z);
    }

    private getOuterCellBarycentricCoord (position: Vec3, tetrahedron: Tetrahedron, weights: Vec4): void {
        const p0 = this._probes[tetrahedron.vertex0].position;
        const p1 = this._probes[tetrahedron.vertex1].position;
        const p2 = this._probes[tetrahedron.vertex2].position;

        Vec3.subtract(_edge1, p1, p0);
        Vec3.subtract(_edge2, p2, p0);
        Vec3.cross(_normal2, _edge1, _edge2);
        Vec3.subtract(_v, position, p0);

        let t = Vec3.dot(_v, _normal2);
        if (t < 0.0) {
            // test tetrahedron in next iterator
            weights.set(0.0, 0.0, 0.0, -1.0);
            return;
        }

        const coefficients = new Vec3(0.0, 0.0, 0.0);
        Vec3.transformMat3(coefficients, position, tetrahedron.matrix);
        Vec3.add(coefficients, coefficients, tetrahedron.offset);

        if (tetrahedron.vertex3 === -1) {
            t = PolynomialSolver.getCubicUniqueRoot(coefficients.x, coefficients.y, coefficients.z);
        } else {
            t = PolynomialSolver.getQuadraticUniqueRoot(coefficients.x, coefficients.y, coefficients.z);
        }

        Vec3.scaleAndAdd(_vp0, p0, this._probes[tetrahedron.vertex0].normal, t);
        Vec3.scaleAndAdd(_vp1, p1, this._probes[tetrahedron.vertex1].normal, t);
        Vec3.scaleAndAdd(_vp2, p2, this._probes[tetrahedron.vertex2].normal, t);
        const result = LightProbesData.getTriangleBarycentricCoord(_vp0, _vp1, _vp2, position);

        weights.set(result.x, result.y, result.z, 0.0);
    }

    @serializable
    @type([Vertex])
    private _probes: Vertex[] = [];
    @serializable
    @type([Tetrahedron])
    private _tetrahedrons: Tetrahedron[] = [];
}
cclegacy.internal.LightProbesData = LightProbesData;

/**
 * @en light probe data
 * @zh 光照探针数据
 */
export class LightProbes {
    /**
     * @en GI multiplier
     * @zh GI乘数
     */
    set giScale (val: number) {
        this._giScale = val;
    }
    get giScale (): number {
        return this._giScale;
    }

    /**
      * @en GI sample counts
      * @zh GI 采样数量
      */
    set giSamples (val: number) {
        this._giSamples = val;
    }
    get giSamples (): number {
        return this._giSamples;
    }

    /**
      * @en light bounces
      * @zh 光照反弹次数
      */
    set bounces (val: number) {
        this._bounces = val;
    }
    get bounces (): number {
        return this._bounces;
    }

    /**
     * @en Reduce ringing of light probe
     * @zh 减少光照探针的振铃效果
     */
    set reduceRinging (val: number) {
        this._reduceRinging = val;
    }
    get reduceRinging (): number {
        return this._reduceRinging;
    }

    /**
     * @en Whether to show light probe
     * @zh 是否显示光照探针
     */
    set showProbe (val: boolean) {
        this._showProbe = val;
    }
    get showProbe (): boolean {
        return this._showProbe;
    }

    /**
     * @en Whether to show light probe's connection
     * @zh 是否显示光照探针连线
     */
    set showWireframe (val: boolean) {
        this._showWireframe = val;
    }
    get showWireframe (): boolean {
        return this._showWireframe;
    }

    /**
     * @en Whether to show light probe's convex
     * @zh 是否显示光照探针凸包
     */
    set showConvex (val: boolean) {
        this._showConvex = val;
    }
    get showConvex (): boolean {
        return this._showConvex;
    }

    /**
     * @en light probe's vertex and tetrahedron data
     * @zh 光照探针顶点及四面体数据
     */
    set data (val: LightProbesData | null) {
        this._data = val;
    }
    get data (): LightProbesData | null {
        return this._data;
    }

    /**
     * @en The value of all light probe sphere display size
     * @zh 光照探针全局显示大小
     */
    set lightProbeSphereVolume (val: number) {
        this._lightProbeSphereVolume = val;
    }
    get lightProbeSphereVolume (): number {
        return this._lightProbeSphereVolume;
    }

    protected _giScale = 1.0;
    protected _giSamples = 1024;
    protected _bounces = 2;
    protected _reduceRinging = 0.0;
    protected _showProbe = true;
    protected _showWireframe = true;
    protected _showConvex = false;
    protected _data: LightProbesData | null = null;
    protected _lightProbeSphereVolume = 1.0;

    public initialize (info: LightProbeInfo): void {
        this._giScale = info.giScale;
        this._giSamples = info.giSamples;
        this._bounces = info.bounces;
        this._reduceRinging = info.reduceRinging;
        this._showProbe = info.showProbe;
        this._showWireframe = info.showWireframe;
        this._showConvex = info.showConvex;
        this._data = info.data;
        this._lightProbeSphereVolume = info.lightProbeSphereVolume;
    }

    public empty (): boolean {
        if (!this._data) {
            return true;
        }

        return this._data.empty();
    }
}
cclegacy.internal.LightProbes = LightProbes;
