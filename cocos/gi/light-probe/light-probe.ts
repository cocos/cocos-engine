/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

import { serializable } from 'cc.decorator';
import { Vertex, Tetrahedron, Delaunay } from './delaunay';
import { LightProbeQuality } from './sh';
import { PolynomialSolver } from './polynomial-solver';
import { LightProbeInfo } from '../../core/scene-graph/scene-globals';
import { Vec3 } from '../../core/math/vec3';
import { Vec4 } from '../../core/math/vec4';

export class LightProbesData {
    public build (points: Vec3[]) {
        const delaunay = new Delaunay();
        delaunay.build(points);
        delaunay.getResults(this._probes, this._tetrahedrons);
    }

    public getInterpolationSHCoefficients (position: Vec3, tetIndex: number, coefficients: Vec3[]) {
        const weights = new Vec4(0.0, 0.0, 0.0, 0.0);
        tetIndex = this.getInterpolationWeights(position, tetIndex, weights);

        const tetrahedron = this._tetrahedrons[tetIndex];
        const c0 = this._probes[tetrahedron.vertex0].coefficients;
        const c1 = this._probes[tetrahedron.vertex1].coefficients;
        const c2 = this._probes[tetrahedron.vertex2].coefficients;

        if (tetrahedron.vertex3 >= 0) {
            const c3 = this._probes[tetrahedron.vertex3].coefficients;

            for (let i = 0; i < coefficients.length; i++) {
                coefficients[i] = new Vec3(0.0, 0.0, 0.0);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c0[i], weights.x);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c1[i], weights.y);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c2[i], weights.z);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c3[i], weights.w);
            }
        } else {
            for (let i = 0; i < coefficients.length; i++) {
                coefficients[i] = new Vec3(0.0, 0.0, 0.0);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c0[i], weights.x);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c1[i], weights.y);
                Vec3.scaleAndAdd(coefficients[i], coefficients[i], c2[i], weights.z);
            }
        }

        return tetIndex;
    }

    public getInterpolationWeights (position: Vec3, tetIndex: number, weights: Vec4) {
        const tetrahedronCount = this._tetrahedrons.length;
        if (tetIndex < 0 || tetIndex >= tetrahedronCount) {
            tetIndex = 0;
        }

        let lastIndex = -1;
        let nextIndex = -1;

        for (let i = 0; i < tetrahedronCount; i++) {
            const tetrahedron = this._tetrahedrons[tetIndex];
            weights = this.getBarycentricCoord(position, tetrahedron);
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

    private static getTriangleBarycentricCoord (p0: Vec3, p1: Vec3, p2: Vec3, position: Vec3) {
        const v0 = new Vec3(0.0, 0.0, 0.0);
        const v1 = new Vec3(0.0, 0.0, 0.0);
        const v = new Vec3(0.0, 0.0, 0.0);

        Vec3.subtract(v0, p0, p2);
        Vec3.subtract(v1, p1, p2);
        Vec3.subtract(v, position, p2);

        const invDeterminant = 1.0 / (v0.x * v1.y - v0.y * v1.x);
        const alpha = (v1.y * v.x - v1.x * v.y) * invDeterminant;
        const beta = (v0.x * v.y - v0.y * v.x) * invDeterminant;
        const gamma = 1.0 - alpha - beta;

        return new Vec3(alpha, beta, gamma);
    }

    private getBarycentricCoord (position: Vec3, tetrahedron: Tetrahedron) {
        if (tetrahedron.vertex3 >= 0) {
            return this.getTetrahedronBarycentricCoord(position, tetrahedron);
        } else {
            return this.getOuterCellBarycentricCoord(position, tetrahedron);
        }
    }

    private getTetrahedronBarycentricCoord (position: Vec3, tetrahedron: Tetrahedron) {
        const result = new Vec3(0.0, 0.0, 0.0);
        Vec3.subtract(result, position, this._probes[tetrahedron.vertex3].position);
        Vec3.transformMat3(result, result, tetrahedron.matrix);

        return new Vec4(result.x, result.y, result.z, 1.0 - result.x - result.y - result.z);
    }

    private getOuterCellBarycentricCoord (position: Vec3, tetrahedron: Tetrahedron) {
        const p0 = this._probes[tetrahedron.vertex0].position;
        const p1 = this._probes[tetrahedron.vertex1].position;
        const p2 = this._probes[tetrahedron.vertex2].position;

        const normal = new Vec3(0.0, 0.0, 0.0);
        const edge1 = new Vec3(0.0, 0.0, 0.0);
        const edge2 = new Vec3(0.0, 0.0, 0.0);
        const v = new Vec3(0.0, 0.0, 0.0);

        Vec3.subtract(edge1, p1, p0);
        Vec3.subtract(edge2, p2, p0);
        Vec3.cross(normal, edge1, edge2);
        Vec3.subtract(v, position, p0);

        let t = Vec3.dot(v, normal);
        if (t < 0.0) {
            // test tetrahedron in next iterator
            return new Vec4(0.0, 0.0, 0.0, -1.0);
        }

        const coefficients = new Vec3(0.0, 0.0, 0.0);
        Vec3.transformMat3(coefficients, position, tetrahedron.matrix);
        Vec3.add(coefficients, coefficients, tetrahedron.offset);

        if (tetrahedron.vertex3 === -1) {
            t = PolynomialSolver.getCubicUniqueRoot(coefficients.x, coefficients.y, coefficients.z);
        } else {
            t = PolynomialSolver.getQuadraticUniqueRoot(coefficients.x, coefficients.y, coefficients.z);
        }

        const v0 = new Vec3(0.0, 0.0, 0.0);
        const v1 = new Vec3(0.0, 0.0, 0.0);
        const v2 = new Vec3(0.0, 0.0, 0.0);

        Vec3.scaleAndAdd(v0, p0, this._probes[tetrahedron.vertex0].normal, t);
        Vec3.scaleAndAdd(v1, p1, this._probes[tetrahedron.vertex1].normal, t);
        Vec3.scaleAndAdd(v2, p2, this._probes[tetrahedron.vertex2].normal, t);
        const result = LightProbesData.getTriangleBarycentricCoord(v0, v1, v2, position);

        return new Vec4(result.x, result.y, result.z, 0.0);
    }

    @serializable
    private _probes: Vertex[] = [];
    @serializable
    private _tetrahedrons: Tetrahedron[] = [];
}

/**
 * @en light probe data
 * @zh 光照探针数据
 */
export class LightProbes {
    /**
     * @en Whether activate light probe
     * @zh 是否启用光照探针
     */
    set enabled (val: boolean) {
        this._enabled = val;
    }
    get enabled () {
        return this._enabled;
    }

    /**
     * @en Light probe's quality
     * @zh 光照探针的质量等级
     */
    set quality (quality) {
        this._quality = quality;
    }
    get quality () {
        return this._quality;
    }

    /**
     * @en Reduce ringing of light probe
     * @zh 减少光照探针的振铃效果
     */
    set reduceRinging (val: number) {
        this._reduceRinging = val;
    }
    get reduceRinging () {
        return this._reduceRinging;
    }

    /**
     * @en Whether to show light probe
     * @zh 是否显示光照探针
     */
    set showProbe (val: boolean) {
        this._showProbe = val;
    }
    get showProbe () {
        return this._showProbe;
    }

    /**
     * @en Whether to show light probe's connection
     * @zh 是否显示光照探针连线
     */
    set showWireframe (val: boolean) {
        this._showWireframe = val;
    }
    get showWireframe () {
        return this._showWireframe;
    }

    /**
     * @en Whether to show light probe's convex
     * @zh 是否显示光照探针凸包
     */
    set showConvex (val: boolean) {
        this._showConvex = val;
    }
    get showConvex () {
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

    protected _enabled = false;
    protected _quality = LightProbeQuality.Normal;
    protected _reduceRinging = 0.0;
    protected _showProbe = true;
    protected _showWireframe = true;
    protected _showConvex = false;
    protected _data: LightProbesData | null = null;

    public initialize (info: LightProbeInfo) {
        this._enabled = info.enabled;
        this._quality = info.quality;
        this._reduceRinging = info.reduceRinging;
        this._showProbe = info.showProbe;
        this._showWireframe = info.showWireframe;
        this._showConvex = info.showConvex;
        this._data = info.data;
    }
}
