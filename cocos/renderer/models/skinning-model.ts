// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { Skeleton } from '../../3d/assets/skeleton';
import { LCA } from '../../3d/misc/utils';
import { Filter, PixelFormat, WrapMode } from '../../assets/asset-enum';
import { Texture2D } from '../../assets/texture-2d';
import { Mat4, Quat, Vec3 } from '../../core/value-types';
import { mat4, quat, vec3 } from '../../core/vmath';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBufferUsageBit, GFXFormatInfos, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXDevice, GFXFeature } from '../../gfx/device';
import { JointUniformCapacity, UBOSkinning, UBOSkinningTexture, UNIFORM_JOINTS_TEXTURE } from '../../pipeline/define';
import { Node } from '../../scene-graph/node';
import { Pass } from '../core/pass';
import { samplerLib } from '../core/sampler-lib';
import { Model } from '../scene/model';
import { RenderScene } from '../scene/render-scene';

export enum JointsMediumType {
    NONE, // for non-skinning models only
    UNIFORM,
    RGBA8,
    RGBA32F,
}

export function selectJointsMediumType (device: GFXDevice, jointCount: number): JointsMediumType {
    if (jointCount <= JointUniformCapacity) {
        return JointsMediumType.UNIFORM;
    } else if (device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
        return JointsMediumType.RGBA32F;
    } else {
        return JointsMediumType.RGBA8;
    }
}

interface IJointsInfo {
    type: JointsMediumType;
    binding: number;
    buffer: GFXBuffer;
    nativeData: Float32Array;
    texture?: Texture2D;
}

const _jointsFormat = {
    [JointsMediumType.UNIFORM]: PixelFormat.RGBA32F, // float vec4
    [JointsMediumType.RGBA8]: PixelFormat.RGBA8888,
    [JointsMediumType.RGBA32F]: PixelFormat.RGBA32F,
};

const v3_1 = new Vec3();
const v3_2 = new Vec3();
const qt_0 = new Quat();
const qt_1 = new Quat();
const qt_2 = new Quat();
const m4_1 = new Mat4();
const f4_1 = new Float32Array(4);

export class Joint {
    public node: Node;
    public position: Vec3 = new Vec3();
    public rotation: Quat = new Quat();
    public scale: Vec3 = new Vec3(1, 1, 1);
    public parent: Joint | null = null;
    protected _lastUpdate = -1;
    constructor (node: Node) { this.node = node; }
    public update () {
        const totalFrames = cc.director.getTotalFrames();
        if (this._lastUpdate >= totalFrames) { return; }
        this._lastUpdate = totalFrames;

        const parent = this.parent;
        if (parent) {
            parent.update();
            vec3.multiply(this.position, this.node.position, parent.scale);
            vec3.transformQuat(this.position, this.position, parent.rotation);
            vec3.add(this.position, this.position, parent.position);
            quat.multiply(this.rotation, parent.rotation, this.node.rotation);
            vec3.multiply(this.scale, parent.scale, this.node.scale);
        }
    }
}

class JointManager {
    public static get (node: Node, root: Node) {
        let joint = JointManager._joints.get(node);
        if (joint) { return joint; }
        joint = new Joint(node);
        if (node !== root && node.parent) { joint.parent = JointManager.get(node.parent, root); }
        JointManager._joints.set(node, joint);
        return joint;
    }
    protected static _joints: Map<Node, Joint> = new Map();
}

export class SkinningModel extends Model {
    // change here and cc-skinning.inc to use other skinning algorithms
    public updateJointData = this.updateJointDataDQS;

    get joints () {
        return this._joints;
    }

    private _skeleton: Skeleton | null = null;
    private _joints: Joint[] = [];
    private _jointsMedium: IJointsInfo | null = null;

    constructor (scene: RenderScene, node: Node) {
        super(scene, node);
        this._type = 'skinning';
        if (node.parent) { this._transform = node.parent; }
    }

    public bindSkeleton (skeleton: Skeleton | null) {
        this._destroyJointsMedium();
        this._skeleton = skeleton;
        if (!skeleton) { return; }
        const type = selectJointsMediumType(this._device, skeleton.joints.length);
        const format = _jointsFormat[type];
        const UBO = type === JointsMediumType.UNIFORM ? UBOSkinning : UBOSkinningTexture;

        const binding = UBO.BLOCK.binding;
        const buffer = this._device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: UBO.SIZE,
            stride: UBO.SIZE,
        });
        const width = Math.ceil(12 * 4 / GFXFormatInfos[format].size);
        const height = skeleton.joints.length;
        const nativeData = new Float32Array(width * height * 4);
        this._jointsMedium = { type, binding, buffer, nativeData };

        if (type !== JointsMediumType.UNIFORM) {
            const texture = this._jointsMedium.texture = new Texture2D();
            texture.create(width, height, format);
            texture.setFilters(Filter.NEAREST, Filter.NEAREST);
            texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);

            f4_1[0] = 1 / width;
            f4_1[1] = 1 / height;
            buffer.update(f4_1, UBOSkinningTexture.JOINTS_TEXTURE_SIZE_INV_OFFSET, f4_1.byteLength);
        }
    }

    public commitJointData () {
        if (!this._jointsMedium) { return; }
        const { type, nativeData, buffer, texture } = this._jointsMedium;
        if (type === JointsMediumType.UNIFORM) {
            buffer.update(nativeData, UBOSkinning.MAT_JOINT_OFFSET);
        } else {
            texture!.uploadData(nativeData.buffer);
        }
    }

    public updateUBOs () {
        if (!super.updateUBOs() || !this._skeleton) { return false; }

        const len = this._joints.length;
        for (let i = 0; i < len; ++i) {
            const cur = this._joints[i]; cur.update();
            const bindpose = this._skeleton.bindposes[i];

            vec3.multiply(v3_1, bindpose.position, cur.scale);
            vec3.transformQuat(v3_1, v3_1, cur.rotation);
            vec3.add(v3_1, v3_1, cur.position);
            quat.multiply(qt_1, cur.rotation, bindpose.rotation);
            vec3.multiply(v3_2, cur.scale, bindpose.scale);

            this.updateJointData(i, v3_1, qt_1, v3_2, i === 0);
        }

        this.commitJointData();
        return true;
    }

    public resetSkinningTarget (skinningRoot: Node) {
        const root = LCA(this.node, skinningRoot);
        if (!root || !this._skeleton) { return; }
        this._joints.length = 0;
        this._skeleton.joints.forEach((path) => {
            const targetNode = skinningRoot.getChildByPath(path);
            if (!targetNode) {
                console.warn(`Skinning target ${path} not found in scene graph.`);
                return;
            }
            this._joints.push(JointManager.get(targetNode, root));
        });
    }

    // Linear Blending Skinning
    protected updateJointDataLBS (idx: number, pos: Vec3, rot: Quat, scale: Vec3) {
        if (!this._jointsMedium) { return; }
        const out = this._jointsMedium.nativeData;
        const base = 12 * idx;
        mat4.fromRTS(m4_1, rot, pos, scale);
        out[base + 0] = m4_1.m00;
        out[base + 1] = m4_1.m01;
        out[base + 2] = m4_1.m02;
        out[base + 3] = m4_1.m12;
        out[base + 4] = m4_1.m04;
        out[base + 5] = m4_1.m05;
        out[base + 6] = m4_1.m06;
        out[base + 7] = m4_1.m13;
        out[base + 8] = m4_1.m08;
        out[base + 9] = m4_1.m09;
        out[base + 10] = m4_1.m10;
        out[base + 11] = m4_1.m14;
    }

    // Dual Quaternion Skinning
    protected updateJointDataDQS (idx: number, pos: Vec3, rot: Quat, scale: Vec3, first = false) {
        if (!this._jointsMedium) { return; }
        const out = this._jointsMedium.nativeData;
        const base = 12 * idx;
        // sign consistency
        if (first) { quat.copy(qt_0, rot); }
        else if (quat.dot(qt_0, rot) < 0) { quat.scale(rot, rot, -1); }
        // conversion
        quat.set(qt_2, pos.x, pos.y, pos.z, 0);
        quat.scale(qt_2, quat.multiply(qt_2, qt_2, rot), 0.5);
        // upload
        out[base + 0] = rot.x;
        out[base + 1] = rot.y;
        out[base + 2] = rot.z;
        out[base + 3] = rot.w;
        out[base + 4] = qt_2.x;
        out[base + 5] = qt_2.y;
        out[base + 6] = qt_2.z;
        out[base + 7] = qt_2.w;
        out[base + 8] = scale.x;
        out[base + 9] = scale.y;
        out[base + 10] = scale.z;
    }

    protected _doCreatePSO (pass: Pass) {
        const pso = super._doCreatePSO(pass);
        if (!this._jointsMedium) { return pso; }
        const { type, buffer, binding, texture } = this._jointsMedium;
        pso.pipelineLayout.layouts[0].bindBuffer(binding, buffer);
        if (type !== JointsMediumType.UNIFORM) {
            const view = texture!.getGFXTextureView();
            const sampler = samplerLib.getSampler(this._device, texture!.getGFXSamplerInfo());
            if (view && sampler) {
                pso.pipelineLayout.layouts[0].bindTextureView(UNIFORM_JOINTS_TEXTURE.binding, view);
                pso.pipelineLayout.layouts[0].bindSampler(UNIFORM_JOINTS_TEXTURE.binding, sampler);
            }
        }
        return pso;
    }

    private _destroyJointsMedium () {
        if (!this._jointsMedium) { return; }
        const { type, buffer, texture } = this._jointsMedium;
        buffer.destroy();
        if (type !== JointsMediumType.UNIFORM) { texture!.destroy(); }
        this._jointsMedium = null;
    }
}
