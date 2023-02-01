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

import { ccclass, tooltip, displayOrder, type, serializable, disallowAnimation, visible, override } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Mesh } from '../3d';
import { Material, Texture2D } from '../core/assets';
import { AlignmentSpace, RenderMode, Space } from './enum';
import { Attribute, AttributeName, BufferInfo, BufferUsageBit, Device, deviceManager, DrawInfo, Feature, Format, FormatFeatureBit, FormatInfos, IndirectBuffer, MemoryUsageBit } from '../core/gfx';
import { legacyCC } from '../core/global-exports';
import { builtinResMgr, director, Enum, errorID, gfx, Mat4, ModelRenderer, Quat, RenderingSubMesh, Vec2, Vec4, warnID } from '../core';
import { MacroRecord, MaterialInstance, Pass, scene } from '../core/renderer';
import ParticleBatchModel from './models/particle-batch-model';
import { ParticleSystem } from './particle-system';
import { Camera } from '../core/renderer/scene/camera';
import { particleSystemManager } from './particle-system-manager';
import { TextureAnimationModule } from './modules/texture-animation';

const CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';

const CC_RENDER_MODE = 'CC_RENDER_MODE';
const ROTATION_OVER_TIME_MODULE_ENABLE = 'ROTATION_OVER_TIME_MODULE_ENABLE';
const INSTANCE_PARTICLE = 'CC_INSTANCE_PARTICLE';

@ccclass('cc.ParticleSystemRenderer')
export class ParticleSystemRenderer extends ModelRenderer {
    public static AlignmentSpace = AlignmentSpace;
    /**
     * @zh 设定粒子生成模式。
     */
    @type(Enum(RenderMode))
    @displayOrder(0)
    @tooltip('i18n:particleSystemRenderer.renderMode')
    public get renderMode () {
        return this._renderMode;
    }

    public set renderMode (val) {
        this._renderMode = val;
    }

    @override
    @visible(false)
    get sharedMaterials () {
        return super.sharedMaterials;
    }

    set sharedMaterials (val) {
        super.sharedMaterials = val;
    }

    /**
     * @zh 在粒子生成方式为 StretchedBillboard 时,对粒子在运动方向上按速度大小进行拉伸。
     */
    @displayOrder(1)
    @visible(function (this: ParticleSystemRenderer) { return this._renderMode === RenderMode.STRETCHED_BILLBOARD; })
    @tooltip('i18n:particleSystemRenderer.velocityScale')
    public get velocityScale () {
        return this._velocityScale;
    }

    public set velocityScale (val) {
        this._velocityScale = val;
    }

    /**
     * @zh 在粒子生成方式为 StretchedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸。
     */
    @displayOrder(2)
    @visible(function (this: ParticleSystemRenderer) { return this._renderMode === RenderMode.STRETCHED_BILLBOARD; })
    @tooltip('i18n:particleSystemRenderer.lengthScale')
    public get lengthScale () {
        return this._lengthScale;
    }

    public set lengthScale (val) {
        this._lengthScale = val;
    }

    /**
     * @zh 粒子发射的模型。
     */
    @type(Mesh)
    @visible(function (this: ParticleSystemRenderer) { return this._renderMode === RenderMode.MESH; })
    @displayOrder(7)
    @tooltip('i18n:particleSystemRenderer.mesh')
    public get mesh () {
        return this._mesh;
    }

    public set mesh (val) {
        this._mesh = val;
    }

    /**
      * @zh 粒子使用的材质。
      */
    @type(Material)
    @displayOrder(8)
    @disallowAnimation
    @tooltip('i18n:particleSystemRenderer.particleMaterial')
    public get particleMaterial () {
        return this.getMaterial(0) as Material;
    }

    public set particleMaterial (val: Material | null) {
        this.setMaterial(val, 0);
    }

    /**
      * @en particle trail material
      * @zh 拖尾使用的材质。
      */
    @type(Material)
    @displayOrder(9)
    @disallowAnimation
    @tooltip('i18n:particleSystemRenderer.trailMaterial')
    public get trailMaterial () {
        return this.getMaterial(1) as Material;
    }

    public set trailMaterial (val: Material | null) {
        this.setMaterial(val, 1);
    }

    /**
      * @en Particle alignment space option. Includes world, local and view.
      * @zh 粒子对齐空间选择。包括世界空间，局部空间和视角空间。
      */
    @type(Enum(AlignmentSpace))
    @displayOrder(10)
    @tooltip('i18n:particle_system.alignSpace')
    public get alignSpace () {
        return this._alignSpace;
    }

    public set alignSpace (val) {
        this._alignSpace = val;
    }

    @serializable
    private _renderMode = RenderMode.BILLBOARD;

    @serializable
    private _velocityScale = 1;

    @serializable
    private _lengthScale = 1;

    @serializable
    private _mesh: Mesh | null = null;

    // private _iaInfo: IndirectBuffer;
    private _defines: MacroRecord;
    // private _trailDefines: MacroRecord;
    private _frameTile_velLenScale = new Vec4(1, 1, 0, 0);
    private _tmp_velLenScale = new Vec4(1, 1, 0, 0);
    private _defaultMat: Material | null = null;
    private _node_scale = new Vec4();
    // private _defaultTrailMat: Material | null = null;
    private _scaleSpace = Space.LOCAL;

    @serializable
    private _alignSpace = AlignmentSpace.VIEW;
    @serializable
    private _mainTexture: Texture2D | null = null;
    private _model: ParticleBatchModel | null = null;
    private _vertAttrs: Attribute[] = [];
    private _particleSystem: ParticleSystem | null = null;

    constructor () {
        super();
        this._defines = {
            CC_USE_WORLD_SPACE: true,
            CC_USE_BILLBOARD: true,
            CC_USE_STRETCHED_BILLBOARD: false,
            CC_USE_HORIZONTAL_BILLBOARD: false,
            CC_USE_VERTICAL_BILLBOARD: false,
        };
        // this._trailDefines = {
        //     CC_USE_WORLD_SPACE: true,
        //     // CC_DRAW_WIRE_FRAME: true,   // <wireframe debug>
        // };
        // this._iaInfo = new IndirectBuffer([new DrawInfo()]);

        // this._vertAttrs = [
        //     new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),   // xyz:position
        //     new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGBA32F), // x:index y:size zw:texcoord
        //     // new Attribute(AttributeName.ATTR_TEX_COORD2, Format.RGB32F), // <wireframe debug>
        //     new Attribute(AttributeName.ATTR_TEX_COORD1, Format.RGB32F), // xyz:velocity
        //     new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true),
        // ];
        // for (const a of this._vertAttrs) {
        //     this._vertSize += FormatInfos[a.format].size;
        // }
    }

    public setParticleSystem (particleSystem: ParticleSystem) {
        this._particleSystem = particleSystem;
    }

    public onLoad () {
        if (!this._model) {
            this._model = legacyCC.director.root.createModel(ParticleBatchModel) as ParticleBatchModel;
            this._model.visFlags = this.node.layer;
            this._model.node = this._model.transform = this.node;
        }
    }

    public start () {
        this._updateMaterialParams();
        this._updateVertexAttributes();
    }

    public onEnable () {
        this._getRenderScene().addModel(this._model!);
        particleSystemManager.addParticleSystemRenderer(this);
    }

    public onDisable () {
        this._model!.scene!.removeModel(this._model!);
        particleSystemManager.removeParticleSystemRenderer(this);
    }

    public onDestroy () {
        if (this._model) {
            legacyCC.director.root.destroyModel(this._model);
            this._model = null;
        }
    }

    protected _onMaterialModified (index: number, material: Material | null) {
        super._onMaterialModified(index, material);
        if (material && index === 0) {
            this._updateMaterialParams();
        }
    }

    private _updateVertexAttributes () {
        if (this._model) {
            this._vertAttrs.length = 0;
            this._vertAttrs.push(
                new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F, false, 0),            // mesh position
                new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGB32F, false, 0),           // mesh uv
            );
            if (this.renderMode === RenderMode.MESH && this.mesh) {
                this._vertAttrs.push(
                    new Attribute(AttributeName.ATTR_NORMAL, Format.RGB32F, false, 0),          // mesh normal
                    new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true, 0),             // mesh color
                );
                const format = this.mesh.readAttributeFormat(0, AttributeName.ATTR_COLOR);
                if (format) {
                    let type = Format.RGBA8;
                    for (let i = 0; i < FormatInfos.length; ++i) {
                        if (FormatInfos[i].name === format.name) {
                            type = i;
                            break;
                        }
                    }
                    this._vertAttrs[3] = new Attribute(AttributeName.ATTR_COLOR, type, true, 0);
                } else { // mesh without vertex color
                    const type = Format.RGBA8;
                    this._vertAttrs[3] = new Attribute(AttributeName.ATTR_COLOR, type, true, 0);
                }
            }
            this._vertAttrs.push(
                new Attribute('a_particle_position', Format.RGB32F, false, 1, true),        // particle position
                new Attribute('a_particle_rotation', Format.RGB32F, false, 1, true),        // particle rotation
                new Attribute('a_particle_size', Format.RGB32F, false, 1, true),            // particle size
                new Attribute('a_particle_frame', Format.R32F, false, 1, true),            // particle frame id
                new Attribute('a_particle_color', Format.RGBA8, true, 1, true),             // particle color
            );
            if (this._renderMode === RenderMode.STRETCHED_BILLBOARD) {
                this._vertAttrs.push(new Attribute('a_particle_velocity', Format.RGB32F, false, 1, true));
            }
            this._model.setVertexAttributes(this._renderMode === RenderMode.MESH ? this._mesh : null, this._vertAttrs);
        }
    }

    public clear () {
        if (this._model) this._model.enabled = false;
    }

    public getModel () {
        return this._model;
    }

    // internal function
    public updateRenderData () {
        if (!this._particleSystem) return;
        const { particles } = this._particleSystem;
        this._model!.setCapacity(particles.capacity);
        this._updateRotation();
        this._updateScale();
        // this.updateTrailMaterial()

        this._model!.updateIA(particles);
        //this.updateTrailRenderData();
    }

    private _updateMaterialParams () {
        if (!this._particleSystem) {
            return;
        }

        const mat: Material | null = this.getMaterialInstance(0) || this._defaultMat;

        const shareMaterial = this.sharedMaterial;
        if (shareMaterial != null) {
            this._mainTexture = shareMaterial.getProperty('mainTexture', 0) as Texture2D;
        }

        if (shareMaterial == null && this._defaultMat == null) {
            this._defaultMat = new MaterialInstance({
                parent: builtinResMgr.get<Material>('default-particle-material'),
                owner: this,
                subModelIdx: 0,
            });
            if (this._mainTexture !== null) {
                this._defaultMat.setProperty('mainTexture', this._mainTexture);
            }
        }
        this._defines[CC_USE_WORLD_SPACE] = this._particleSystem.simulationSpace === Space.WORLD;
        const renderMode = this.renderMode;
        if (renderMode === RenderMode.STRETCHED_BILLBOARD) {
            this._frameTile_velLenScale.z = this.velocityScale;
            this._frameTile_velLenScale.w = this.lengthScale;
        }
        this._defines[CC_RENDER_MODE] = renderMode;
        const textureModule = this._particleSystem.getModule(TextureAnimationModule);
        if (textureModule && textureModule.enable) {
            Vec4.copy(this._tmp_velLenScale, this._frameTile_velLenScale); // fix textureModule switch bug
            Vec2.set(this._tmp_velLenScale, textureModule.numTilesX, textureModule.numTilesY);
            mat!.setProperty('frameTile_velLenScale', this._tmp_velLenScale);
        } else {
            mat!.setProperty('frameTile_velLenScale', this._frameTile_velLenScale);
        }

        this._defines[ROTATION_OVER_TIME_MODULE_ENABLE] = true;
        this._defines[INSTANCE_PARTICLE] = true;

        mat!.recompileShaders(this._defines);
        this._model?.updateMaterial(mat!);
    }

    protected beforeRender () {
        // if (!this._isPlaying) return;
        // this._processor.beforeRender();
        // if (this._trailModule && this._trailModule.enable) {
        //     this._trailModule.beforeRender();
        // }

        // if (this.getParticleCount() <= 0) {
        //     if (this._processor.getModel()?.scene) {
        //         this._processor.detachFromScene();
        //         if (this._trailModule && this._trailModule.enable) {
        //             this._trailModule._detachFromScene();
        //         }
        //         this._needAttach = false;
        //     }
        // } else if (!this._processor.getModel()?.scene) {
        //     this._needAttach = true;
        // }
        // because we use index buffer, per particle index count = 6.
        //this._model!.updateIA(this._particles.count);
        // const subModels = this._trailModel && this._trailModel.subModels;
        // if (subModels && subModels.length > 0) {
        //     const subModel = subModels[0];
        //     subModel.inputAssembler.vertexBuffers[0].update(this._vbF32!);
        //     subModel.inputAssembler.indexBuffer!.update(this._iBuffer!);
        //     this._iaInfo.drawInfos[0].firstIndex = 0;
        //     this._iaInfo.drawInfos[0].indexCount = count;
        //     this._iaInfoBuffer!.update(this._iaInfo);
        // }
    }

    // private _fillVertexBuffer (trailSeg: ITrailElement, colorModifer: Color, indexOffset: number,
    //     xTexCoord: number, trailEleIdx: number, indexSet: number) {
    //     this._vbF32![this.vbOffset++] = trailSeg.position.x;
    //     this._vbF32![this.vbOffset++] = trailSeg.position.y;
    //     this._vbF32![this.vbOffset++] = trailSeg.position.z;
    //     this._vbF32![this.vbOffset++] = trailSeg.direction;
    //     this._vbF32![this.vbOffset++] = trailSeg.width;
    //     this._vbF32![this.vbOffset++] = xTexCoord;
    //     this._vbF32![this.vbOffset++] = 0;
    //     // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];  // <wireframe debug>
    //     // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];
    //     // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];
    //     // _bcIdx %= 9;
    //     this._vbF32![this.vbOffset++] = trailSeg.velocity.x;
    //     this._vbF32![this.vbOffset++] = trailSeg.velocity.y;
    //     this._vbF32![this.vbOffset++] = trailSeg.velocity.z;
    //     _temp_color.set(trailSeg.color);
    //     _temp_color.multiply(colorModifer);
    //     this._vbUint32![this.vbOffset++] = _temp_color._val;
    //     this._vbF32![this.vbOffset++] = trailSeg.position.x;
    //     this._vbF32![this.vbOffset++] = trailSeg.position.y;
    //     this._vbF32![this.vbOffset++] = trailSeg.position.z;
    //     this._vbF32![this.vbOffset++] = 1 - trailSeg.direction;
    //     this._vbF32![this.vbOffset++] = trailSeg.width;
    //     this._vbF32![this.vbOffset++] = xTexCoord;
    //     this._vbF32![this.vbOffset++] = 1;
    //     // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];  // <wireframe debug>
    //     // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];
    //     // this._vbF32![this.vbOffset++] = barycentric[_bcIdx++];
    //     // _bcIdx %= 9;
    //     this._vbF32![this.vbOffset++] = trailSeg.velocity.x;
    //     this._vbF32![this.vbOffset++] = trailSeg.velocity.y;
    //     this._vbF32![this.vbOffset++] = trailSeg.velocity.z;
    //     this._vbUint32![this.vbOffset++] = _temp_color._val;
    //     if (indexSet & PRE_TRIANGLE_INDEX) {
    //         this._iBuffer![this.ibOffset++] = indexOffset + 2 * trailEleIdx;
    //         this._iBuffer![this.ibOffset++] = indexOffset + 2 * trailEleIdx - 1;
    //         this._iBuffer![this.ibOffset++] = indexOffset + 2 * trailEleIdx + 1;
    //     }
    //     if (indexSet & NEXT_TRIANGLE_INDEX) {
    //         this._iBuffer![this.ibOffset++] = indexOffset + 2 * trailEleIdx;
    //         this._iBuffer![this.ibOffset++] = indexOffset + 2 * trailEleIdx + 1;
    //         this._iBuffer![this.ibOffset++] = indexOffset + 2 * trailEleIdx + 2;
    //     }
    // }

    // public updateTrailRenderData () {
    //     this.vbOffset = 0;
    //     this.ibOffset = 0;
    //     for (const p of this._particleTrail.keys()) {
    //         const trailSeg = this._particleTrail.get(p)!;
    //         if (trailSeg.start === -1) {
    //             continue;
    //         }
    //         const indexOffset = this.vbOffset * 4 / this._vertSize;
    //         const end = trailSeg.start >= trailSeg.end ? trailSeg.end + trailSeg.trailElements.length : trailSeg.end;
    //         const trailNum = end - trailSeg.start;
    //         // const lastSegRatio = vec3.distance(trailSeg.getTailElement()!.position, p.position) / this._minParticleDistance;
    //         const textCoordSeg = 1 / (trailNum /* - 1 + lastSegRatio */);
    //         const startSegEle = trailSeg.trailElements[trailSeg.start];
    //         this._fillVertexBuffer(startSegEle, this.colorOverTrail.evaluate(1, 1), indexOffset, 1, 0, NEXT_TRIANGLE_INDEX);
    //         for (let i = trailSeg.start + 1; i < end; i++) {
    //             const segEle = trailSeg.trailElements[i % trailSeg.trailElements.length];
    //             const j = i - trailSeg.start;
    //             this._fillVertexBuffer(segEle, this.colorOverTrail.evaluate(1 - j / trailNum, 1),
    //                 indexOffset, 1 - j * textCoordSeg, j, PRE_TRIANGLE_INDEX | NEXT_TRIANGLE_INDEX);
    //         }
    //         if (this._needTransform) {
    //             Vec3.transformMat4(_temp_trailEle.position, p.position, _temp_xform);
    //         } else {
    //             Vec3.copy(_temp_trailEle.position, p.position);
    //         }

    //         // refresh particle node position to update emit position
    //         const trailModel = this._trailModel;
    //         if (trailModel) {
    //             trailModel.node.invalidateChildren(TransformBit.POSITION);
    //         }

    //         if (trailNum === 1 || trailNum === 2) {
    //             const lastSecondTrail = trailSeg.getElement(trailSeg.end - 1)!;
    //             Vec3.subtract(lastSecondTrail.velocity, _temp_trailEle.position, lastSecondTrail.position);
    //             this._vbF32![this.vbOffset - this._vertSize / 4 - 4] = lastSecondTrail.velocity.x;
    //             this._vbF32![this.vbOffset - this._vertSize / 4 - 3] = lastSecondTrail.velocity.y;
    //             this._vbF32![this.vbOffset - this._vertSize / 4 - 2] = lastSecondTrail.velocity.z;
    //             this._vbF32![this.vbOffset - 4] = lastSecondTrail.velocity.x;
    //             this._vbF32![this.vbOffset - 3] = lastSecondTrail.velocity.y;
    //             this._vbF32![this.vbOffset - 2] = lastSecondTrail.velocity.z;
    //             Vec3.subtract(_temp_trailEle.velocity, _temp_trailEle.position, lastSecondTrail.position);
    //             this._checkDirectionReverse(_temp_trailEle, lastSecondTrail);
    //         } else if (trailNum > 2) {
    //             const lastSecondTrail = trailSeg.getElement(trailSeg.end - 1)!;
    //             const lastThirdTrail = trailSeg.getElement(trailSeg.end - 2)!;
    //             Vec3.subtract(_temp_vec3, lastThirdTrail.position, lastSecondTrail.position);
    //             Vec3.subtract(_temp_vec3_1, _temp_trailEle.position, lastSecondTrail.position);
    //             Vec3.normalize(_temp_vec3, _temp_vec3);
    //             Vec3.normalize(_temp_vec3_1, _temp_vec3_1);
    //             Vec3.subtract(lastSecondTrail.velocity, _temp_vec3_1, _temp_vec3);
    //             Vec3.normalize(lastSecondTrail.velocity, lastSecondTrail.velocity);
    //             this._checkDirectionReverse(lastSecondTrail, lastThirdTrail);
    //             // refresh last trail segment data
    //             this.vbOffset -= this._vertSize / 4 * 2;
    //             this.ibOffset -= 6;
    //             // _bcIdx = (_bcIdx - 6 + 9) % 9;  // <wireframe debug>
    //             this._fillVertexBuffer(lastSecondTrail, this.colorOverTrail.evaluate(textCoordSeg, 1), indexOffset,
    //                 textCoordSeg, trailNum - 1, PRE_TRIANGLE_INDEX | NEXT_TRIANGLE_INDEX);
    //             Vec3.subtract(_temp_trailEle.velocity, _temp_trailEle.position, lastSecondTrail.position);
    //             Vec3.normalize(_temp_trailEle.velocity, _temp_trailEle.velocity);
    //             this._checkDirectionReverse(_temp_trailEle, lastSecondTrail);
    //         }
    //         if (this.widthFromParticle) {
    //             _temp_trailEle.width = p.size.x * this.widthRatio.evaluate(0, 1)!;
    //         } else {
    //             _temp_trailEle.width = this.widthRatio.evaluate(0, 1)!;
    //         }
    //         _temp_trailEle.color = p.color;

    //         if (Vec3.equals(_temp_trailEle.velocity, Vec3.ZERO)) {
    //             this.ibOffset -= 3;
    //         } else {
    //             this._fillVertexBuffer(_temp_trailEle, this.colorOverTrail.evaluate(0, 1), indexOffset, 0, trailNum, PRE_TRIANGLE_INDEX);
    //         }
    //     }
    //     if (this._trailModel) {
    //         this._trailModel.enabled = this.ibOffset > 0;
    //     }
    // }

    // public updateTrailMaterial () {
    //     if (!this._particleSystem) {
    //         return;
    //     }
    //     const ps = this._particleSystem;
    //     const trailModule = ps._trailModule;
    //     if (trailModule && trailModule.enable) {
    //         if (ps.simulationSpace === Space.WORLD || trailModule.space === Space.WORLD) {
    //             this._trailDefines[CC_USE_WORLD_SPACE] = true;
    //         } else {
    //             this._trailDefines[CC_USE_WORLD_SPACE] = false;
    //         }
    //         let mat = ps.getMaterialInstance(1);
    //         if (mat === null && this._defaultTrailMat === null) {
    //             this._defaultTrailMat = new MaterialInstance({
    //                 parent: builtinResMgr.get<Material>('default-trail-material'),
    //                 owner: this,
    //                 subModelIdx: 1,
    //             });
    //         }
    //         mat = mat || this._defaultTrailMat;
    //         mat.recompileShaders(this._trailDefines);
    //         const trailMaterial = this.getMaterialInstance(1) || this._defaultTrailMat;
    //         if (this._trailModel) {
    //             this._trailModel.setSubModelMaterial(0, trailMaterial);
    //         }
    //     }
    // }

    private _updateRotation () {
        const material = this.getMaterialInstance(0);
        const mode = this.renderMode;
        if (mode !== RenderMode.MESH && this._alignSpace === AlignmentSpace.VIEW) {
            return;
        }
        const rotation = new Quat();
        if (this._alignSpace === AlignmentSpace.LOCAL) {
            this.node.getRotation(rotation);
        } else if (this._alignSpace === AlignmentSpace.WORLD) {
            this.node.getWorldRotation(rotation);
        } else if (this._alignSpace === AlignmentSpace.VIEW) {
            // Quat.fromEuler(_node_rot, 0.0, 0.0, 0.0);
            rotation.set(0.0, 0.0, 0.0, 1.0);
            const cameraLst: Camera[]| undefined = this.node.scene.renderScene?.cameras;
            if (cameraLst !== undefined) {
                for (let i = 0; i < cameraLst?.length; ++i) {
                    const camera:Camera = cameraLst[i];
                    // eslint-disable-next-line max-len
                    const checkCamera: boolean = (!EDITOR || legacyCC.GAME_VIEW) ? (camera.visibility & this.node.layer) === this.node.layer : camera.name === 'Editor Camera';
                    if (checkCamera) {
                        Quat.fromViewUp(rotation, camera.forward);
                        break;
                    }
                }
            }
        } else {
            rotation.set(0.0, 0.0, 0.0, 1.0);
        }
        material!.setProperty('nodeRotation', rotation);
    }

    // private rebuild () {
    //     const device: Device = director.root!.device;
    //     const vertexBuffer = device.createBuffer(new BufferInfo(
    //         BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
    //         MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
    //         this._vertSize * (this._trailNum + 1) * 2,
    //         this._vertSize,
    //     ));
    //     const vBuffer: ArrayBuffer = new ArrayBuffer(this._vertSize * (this._trailNum + 1) * 2);
    //     this._vbF32 = new Float32Array(vBuffer);
    //     this._vbUint32 = new Uint32Array(vBuffer);
    //     vertexBuffer.update(vBuffer);

    //     const indexBuffer = device.createBuffer(new BufferInfo(
    //         BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
    //         MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
    //         Math.max(1, this._trailNum) * 6 * Uint16Array.BYTES_PER_ELEMENT,
    //         Uint16Array.BYTES_PER_ELEMENT,
    //     ));
    //     this._iBuffer = new Uint16Array(Math.max(1, this._trailNum) * 6);
    //     indexBuffer.update(this._iBuffer);

    //     this._iaInfoBuffer = device.createBuffer(new BufferInfo(
    //         BufferUsageBit.INDIRECT,
    //         MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
    //         DRAW_INFO_SIZE,
    //         DRAW_INFO_SIZE,
    //     ));
    //     this._iaInfo.drawInfos[0].vertexCount = (this._trailNum + 1) * 2;
    //     this._iaInfo.drawInfos[0].indexCount = this._trailNum * 6;
    //     this._iaInfoBuffer.update(this._iaInfo);

    //     this._subMeshData = new RenderingSubMesh([vertexBuffer], this._vertAttrs, PrimitiveMode.TRIANGLE_LIST, indexBuffer, this._iaInfoBuffer);

    //     const trailModel = this._trailModel;
    //     if (trailModel && this._material) {
    //         trailModel.node = trailModel.transform = this.node;
    //         trailModel.visFlags = this.node.layer;
    //         trailModel.initSubModel(0, this._subMeshData, this._material);
    //         trailModel.enabled = true;
    //     }
    // }

    private _updateScale () {
        const material = this.getMaterialInstance(0);
        switch (this._scaleSpace) {
        case Space.LOCAL:
            this._node_scale.set(this.node.scale.x, this.node.scale.y, this.node.scale.z);
            break;
        case Space.WORLD:
            this._node_scale.set(this.node.worldScale.x, this.node.worldScale.y, this.node.worldScale.z);
            break;
        default:
            break;
        }
        material?.setProperty('scale', this._node_scale);
    }
}
