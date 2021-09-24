/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable max-len */
/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

import { EDITOR } from 'internal:constants';
import { IParticleModule, Particle, PARTICLE_MODULE_ORDER } from './particle';
import { Node } from '../core/scene-graph/node';
import { TransformBit } from '../core/scene-graph/node-enum';
import { RenderMode, Space } from './enum';
import { Color, Mat4, Material, pseudoRandom, Quat, randomRangeInt, RenderingSubMesh, Vec3, Vec4 } from '../core';
import { INT_MAX } from '../core/math/bits';
import { particleEmitZAxis } from './particle-general-function';
import { IParticleSystemRenderer } from './renderer/particle-system-renderer-base';
import { Mesh } from '../3d';
import { AABB } from '../core/geometry';
import { scene } from '../core/renderer';
import { BlendFactor } from '../core/gfx';
import { Primitive } from '../primitive/primitive';
import { Root } from '../core/root';
import { legacyCC } from '../core/global-exports';

const _node_mat = new Mat4();
const _node_rol = new Quat();
const _node_scale = new Vec3();

const _anim_module = [
    '_colorOverLifetimeModule',
    '_sizeOvertimeModule',
    '_velocityOvertimeModule',
    '_forceOvertimeModule',
    '_limitVelocityOvertimeModule',
    '_rotationOvertimeModule',
    '_textureAnimationModule',
];

export class ParticleCuller {
    private _particleSystem: any;
    private _processor: IParticleSystemRenderer;
    private _node: Node;
    private _particlesAll: Particle[];
    private _updateList: Map<string, IParticleModule> = new Map<string, IParticleModule>();
    private _animateList: Map<string, IParticleModule> = new Map<string, IParticleModule>();
    private _runAnimateList: IParticleModule[] = new Array<IParticleModule>();
    private _localMat: Mat4 = new Mat4();
    private _gravity: Vec4 = new Vec4();

    public minPos: Vec3 = new Vec3();
    public maxPos: Vec3 = new Vec3();

    private _boundingMesh: Mesh | null;
    private _boundingMaterial: Material | null;
    private _boundingNode: Node | null;
    private _model: scene.Model | null;
    private _nodePose: Vec3 = new Vec3();
    private _nodeSize: Vec3 = new Vec3();

    constructor (ps) {
        this._particleSystem = ps;
        this._processor = this._particleSystem.processor;
        this._node = ps.node;
        this._particlesAll = [];

        this._boundingMesh = null;
        this._boundingMaterial = null;
        this._boundingNode = null;
        this._model = null;

        this._initModuleList();

        if (EDITOR) {
            this._createBoundingMaterial();
            this._createBoundingMesh();
            this._createBoundingModel();
            this._attachToScene();
        }
    }

    private _createBoundingMaterial () {
        this._boundingMaterial = new Material();
        this._boundingMaterial.initialize({
            effectName: 'builtin-standard',
            technique: 1,
            states: {
                blendState: { targets: [{
                    blend: true,
                    blendSrc: BlendFactor.SRC_ALPHA,
                    blendDst: BlendFactor.ONE_MINUS_SRC_ALPHA,
                    blendDstAlpha: BlendFactor.ONE_MINUS_SRC_ALPHA,
                }] },
                depthStencilState: { depthTest: false },
            },
        });
        const color = new Color(255, 255, 255, 50);
        this._boundingMaterial.setProperty('albedo', color);
        this._boundingMaterial.onLoaded();
    }

    private _createBoundingMesh () {
        this._boundingMesh = new Primitive();
        this._boundingMesh.initialize();
        this._boundingMesh.onLoaded();
    }

    private _createBoundingModel () {
        this._boundingNode = new Node(`${this._node.name}_aabb`);
        this._model = (legacyCC.director.root as Root).createModel(scene.Model);
        const particleModel = this._processor.getModel();
        if (particleModel) {
            this._model.visFlags = particleModel.visFlags;
        }
        this._model.node = this._model.transform = this._boundingNode;

        this._boundingNode.hasChangedFlags |= TransformBit.POSITION;
        this._model.transform.hasChangedFlags |= TransformBit.POSITION;
        if (this._boundingMesh) {
            const meshCount = this._boundingMesh ? this._boundingMesh.renderingSubMeshes.length : 0;
            const renderingMesh = this._boundingMesh.renderingSubMeshes;
            if (renderingMesh) {
                for (let i = 0; i < meshCount; ++i) {
                    const subMeshData = renderingMesh[i];
                    if (subMeshData && this._boundingMaterial) {
                        this._model.initSubModel(i, subMeshData, this._boundingMaterial);
                    }
                }
            }
            this._model.enabled = true;
        }

        this._model.createBoundingShape(new Vec3(-0.5, -0.5, -0.5), new Vec3(0.5, 0.5, 0.5));
    }

    private _updateBoundingNode () {
        this._nodeSize.set(this.maxPos.x - this.minPos.x, this.maxPos.y - this.minPos.y, this.maxPos.z - this.minPos.z);
        this._nodePose.set(this.minPos.x + this._nodeSize.x * 0.5, this.minPos.y + this._nodeSize.y * 0.5, this.minPos.z + this._nodeSize.z * 0.5);
        if (this._boundingNode) {
            this._boundingNode.hasChangedFlags |= TransformBit.POSITION;
            this._boundingNode.setWorldScale(this._nodeSize);
            this._boundingNode.setWorldPosition(this._nodePose);
            if (this._model) {
                this._model.updateWorldBound();
            }
        }
    }

    public synBoundingSize (halfExt: Vec3) {
        this.maxPos.x = this._nodePose.x + halfExt.x;
        this.maxPos.y = this._nodePose.y + halfExt.y;
        this.maxPos.z = this._nodePose.z + halfExt.z;
        this.minPos.x = this._nodePose.x - halfExt.x;
        this.minPos.y = this._nodePose.y - halfExt.y;
        this.minPos.z = this._nodePose.z - halfExt.z;
        this._updateBoundingNode();
    }

    public synBoundingPose (px, py, pz) {
        this.maxPos.x = px + this._nodeSize.x * 0.5;
        this.maxPos.y = py + this._nodeSize.y * 0.5;
        this.maxPos.z = pz + this._nodeSize.z * 0.5;
        this.minPos.x = px - this._nodeSize.x * 0.5;
        this.minPos.y = py - this._nodeSize.y * 0.5;
        this.minPos.z = pz - this._nodeSize.z * 0.5;
        this._updateBoundingNode();
    }

    private _attachToScene () {
        if (!this._node.scene || !this._model) {
            return;
        }
        const renderScene = this._node.scene._renderScene;
        if (renderScene) {
            if (this._model.scene !== null) {
                this._detachFromScene();
            }
            renderScene.addModel(this._model);
        }
    }

    private _detachFromScene () {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }

    private _initModuleList () {
        _anim_module.forEach((val) => {
            const pm = this._particleSystem[val];
            if (pm && pm.enable) {
                if (pm.needUpdate) {
                    this._updateList[pm.name] = pm;
                }

                if (pm.needAnimate) {
                    this._animateList[pm.name] = pm;
                }
            }
        });

        // reorder
        this._runAnimateList.length = 0;
        for (let i = 0, len = PARTICLE_MODULE_ORDER.length; i < len; i++) {
            const p = this._animateList[PARTICLE_MODULE_ORDER[i]];
            if (p) {
                this._runAnimateList.push(p);
            }
        }
    }

    private _emit (count: number, dt: number, particleLst: Particle[]) {
        const ps = this._particleSystem;
        const node = this._node;
        const loopDelta = (ps.time % ps.duration) / ps.duration; // loop delta value

        node.invalidateChildren(TransformBit.POSITION);
        if (ps.simulationSpace === Space.World) {
            node.getWorldMatrix(_node_mat);
            node.getWorldRotation(_node_rol);
        }

        for (let i = 0; i < count; ++i) {
            const particle: Particle = new Particle(ps);
            particle.particleSystem = ps;
            particle.reset();

            const rand = pseudoRandom(randomRangeInt(0, INT_MAX));

            if (ps._shapeModule && ps._shapeModule.enable) {
                ps._shapeModule.emit(particle);
            } else {
                Vec3.set(particle.position, 0, 0, 0);
                Vec3.copy(particle.velocity, particleEmitZAxis);
            }

            if (ps._textureAnimationModule && ps._textureAnimationModule.enable) {
                ps._textureAnimationModule.init(particle);
            }

            const curveStartSpeed = ps.startSpeed.evaluate(loopDelta, rand)!;
            Vec3.multiplyScalar(particle.velocity, particle.velocity, curveStartSpeed);

            if (ps.simulationSpace === Space.World) {
                Vec3.transformMat4(particle.position, particle.position, _node_mat);
                Vec3.transformQuat(particle.velocity, particle.velocity, _node_rol);
            }

            Vec3.copy(particle.ultimateVelocity, particle.velocity);

            // apply startRotation.
            Vec3.set(particle.rotation, 0, 0, 0);

            // apply startSize.
            if (ps.startSize3D) {
                Vec3.set(particle.startSize, ps.startSizeX.evaluate(loopDelta, rand)!,
                    ps.startSizeY.evaluate(loopDelta, rand)!,
                    ps.startSizeZ.evaluate(loopDelta, rand)!);
            } else {
                Vec3.set(particle.startSize, ps.startSizeX.evaluate(loopDelta, rand)!, 1, 1);
                particle.startSize.y = particle.startSize.x;
            }
            Vec3.copy(particle.size, particle.startSize);

            // apply startLifetime.
            particle.startLifetime = ps.startLifetime.evaluate(loopDelta, rand)! + dt;
            particle.remainingLifetime = particle.startLifetime;

            particleLst.push(particle);
        }
    }

    private _updateParticles (dt: number, particleLst: Particle[]) {
        const ps = this._particleSystem;
        ps.node.getWorldMatrix(_node_mat);

        switch (ps.scaleSpace) {
        case Space.Local:
            ps.node.getScale(_node_scale);
            break;
        case Space.World:
            ps.node.getWorldScale(_node_scale);
            break;
        default:
            break;
        }

        this._updateList.forEach((value: IParticleModule, key: string) => {
            value.update(ps.simulationSpace, _node_mat);
        });

        if (ps.simulationSpace === Space.Local) {
            const r:Quat = ps.node.getRotation();
            Mat4.fromQuat(this._localMat, r);
            this._localMat.transpose(); // just consider rotation, use transpose as invert
        }

        for (let i = 0; i < particleLst.length; ++i) {
            const p: Particle = particleLst[i];
            p.remainingLifetime -= dt;
            Vec3.set(p.animatedVelocity, 0, 0, 0);

            if (ps.simulationSpace === Space.Local) {
                const gravityFactor = -ps.gravityModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, pseudoRandom(p.randomSeed))! * 9.8 * dt;
                this._gravity.x = 0.0;
                this._gravity.y = gravityFactor;
                this._gravity.z = 0.0;
                this._gravity.w = 1.0;
                this._gravity = this._gravity.transformMat4(this._localMat);

                p.velocity.x += this._gravity.x;
                p.velocity.y += this._gravity.y;
                p.velocity.z += this._gravity.z;
            } else {
                // apply gravity.
                p.velocity.y -= ps.gravityModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, pseudoRandom(p.randomSeed))! * 9.8 * dt;
            }

            Vec3.copy(p.ultimateVelocity, p.velocity);

            this._runAnimateList.forEach((value) => {
                value.animate(p, dt);
            });

            Vec3.scaleAndAdd(p.position, p.position, p.ultimateVelocity, dt); // apply velocity.
        }
    }

    private _calculateBounding (isInit: boolean) {
        const size: Vec3 = new Vec3();
        const position: Vec3 = new Vec3();
        const subPos: Vec3 = new Vec3();
        const addPos: Vec3 = new Vec3();

        const meshSize: Vec3 = new Vec3(1.0, 1.0, 1.0);
        if (this._processor.getInfo()!.renderMode === RenderMode.Mesh) {
            const mesh: Mesh | null = this._processor.getInfo().mesh;
            if (mesh && mesh.struct.minPosition && mesh.struct.maxPosition) {
                const meshAABB: AABB = new AABB();
                AABB.fromPoints(meshAABB, mesh.struct.minPosition, mesh.struct.maxPosition);
                const meshMax = Math.max(meshAABB.halfExtents.x, meshAABB.halfExtents.y, meshAABB.halfExtents.z);
                meshSize.set(meshMax, meshMax, meshMax);
            }
        }

        for (let i = 0; i < this._particlesAll.length; ++i) {
            const p: Particle = this._particlesAll[i];
            Vec3.multiply(size, _node_scale, p.size);
            Vec3.multiply(size, size, meshSize);
            position.set(p.position);
            if (this._particleSystem.simulationSpace !== Space.World) {
                Vec3.transformMat4(position, position, this._particleSystem.node._mat);
            }
            if (isInit && i === 0) {
                this.minPos.set(position.x - size.x, position.y - size.y, position.z - size.z);
                this.maxPos.set(position.x + size.x, position.y + size.y, position.z + size.z);
            } else {
                subPos.set(position.x - size.x, position.y - size.y, position.z - size.z);
                addPos.set(position.x + size.x, position.y + size.y, position.z + size.z);
                Vec3.min(this.minPos, this.minPos, subPos);
                Vec3.max(this.maxPos, this.maxPos, addPos);
            }
        }
    }

    public calculatePositions () {
        this._emit(this._particleSystem.capacity, 0, this._particlesAll);
        const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
        this._updateParticles(0, this._particlesAll);
        this._calculateBounding(true);
        this._updateParticles(this._particleSystem.startLifetime.evaluate(0, rand), this._particlesAll);
        this._calculateBounding(false);

        this._updateBoundingNode();
    }

    public clear () {
        this._particlesAll.length = 0;
    }

    public destroy () {
        this._detachFromScene();
        this._boundingMaterial?.destroy();
        this._model?.destroy();
        this._boundingNode?.destroy();
        this._boundingMesh?.destroy();
    }
}
