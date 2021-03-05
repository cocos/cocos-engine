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

import { ccclass, tooltip, displayOrder, type, serializable } from 'cc.decorator';
import { Mesh } from '../../3d';
import { Material, Texture2D } from '../../core/assets';
import { RenderMode } from '../enum';
import ParticleSystemRendererCPU from './particle-system-renderer-cpu';
import ParticleSystemRendererGPU from './particle-system-renderer-gpu';
import { director } from '../../core/director';
import { Device, Feature } from '../../core/gfx';
import { legacyCC } from '../../core/global-exports';

function isSupportGPUParticle () {
    const device: Device = director.root!.device;
    if (device.maxVertexTextureUnits >= 8 && device.hasFeature(Feature.TEXTURE_FLOAT)) {
        return true;
    }

    legacyCC.warn('Maybe the device has restrictions on vertex textures or does not support float textures.');
    return false;
}

@ccclass('cc.ParticleSystemRenderer')
export default class ParticleSystemRenderer {
    /**
     * @zh 设定粒子生成模式。
     */
    @type(RenderMode)
    @displayOrder(0)
    @tooltip('设定粒子生成模式')
    public get renderMode () {
        return this._renderMode;
    }

    public set renderMode (val) {
        if (this._renderMode === val) {
            return;
        }
        this._renderMode = val;
        if (this._particleSystem) {
            this._particleSystem.processor.updateRenderMode();
        }
    }

    /**
     * @zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸。
     */
    @displayOrder(1)
    @tooltip('在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸')
    public get velocityScale () {
        return this._velocityScale;
    }

    public set velocityScale (val) {
        this._velocityScale = val;
        if (this._particleSystem) {
            this._particleSystem.processor.updateMaterialParams();
        }
        // this._updateModel();
    }

    /**
     * @zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸。
     */
    @displayOrder(2)
    @tooltip('在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸')
    public get lengthScale () {
        return this._lengthScale;
    }

    public set lengthScale (val) {
        this._lengthScale = val;
        if (this._particleSystem) {
            this._particleSystem.processor.updateMaterialParams();
        }
        // this._updateModel();
    }

    @type(RenderMode)
    @serializable
    private _renderMode = RenderMode.Billboard;

    @serializable
    private _velocityScale = 1;

    @serializable
    private _lengthScale = 1;

    @serializable
    private _mesh: Mesh | null = null;

    /**
     * @zh 粒子发射的模型。
     */
    @type(Mesh)
    @displayOrder(7)
    @tooltip('粒子发射的模型')
    public get mesh () {
        return this._mesh;
    }

    public set mesh (val) {
        this._mesh = val;
        if (this._particleSystem) {
            this._particleSystem.processor.setVertexAttributes();
        }
    }

    /**
     * @zh 粒子使用的材质。
     */
    @type(Material)
    @displayOrder(8)
    @tooltip('粒子使用的材质')
    public get particleMaterial () {
        if (!this._particleSystem) {
            return null;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._particleSystem.getMaterial(0);
    }

    public set particleMaterial (val) {
        if (this._particleSystem) {
            this._particleSystem.setMaterial(val, 0);
        }
    }

    /**
     * @zh 拖尾使用的材质。
     */
    @type(Material)
    @displayOrder(9)
    @tooltip('拖尾使用的材质')
    public get trailMaterial () {
        if (!this._particleSystem) {
            return null;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._particleSystem.getMaterial(1)!;
    }

    public set trailMaterial (val) {
        this._particleSystem.setMaterial(val, 1);
    }

    @serializable
    private _mainTexture: Texture2D | null = null;

    public get mainTexture () {
        return this._mainTexture;
    }

    public set mainTexture (val) {
        this._mainTexture = val;
    }

    @serializable
    private _useGPU = false;

    @displayOrder(10)
    @tooltip('是否启用GPU粒子')
    public get useGPU () {
        return this._useGPU;
    }

    public set useGPU (val) {
        if (this._useGPU === val) {
            return;
        }

        if (!isSupportGPUParticle()) {
            this._useGPU = false;
        } else {
            this._useGPU = val;
        }

        this._switchProcessor();
    }

    private _particleSystem: any = null!; // ParticleSystem

    onInit (ps: any) {
        this._particleSystem = ps;
        const useGPU = this._useGPU && isSupportGPUParticle();
        this._particleSystem.processor = useGPU ? new ParticleSystemRendererGPU(this) : new ParticleSystemRendererCPU(this);
        this._particleSystem.processor.onInit(ps);
    }

    private _switchProcessor () {
        if (this._particleSystem.processor) {
            this._particleSystem.processor.detachFromScene();
            this._particleSystem.processor.clear();
            this._particleSystem.processor = null!;
        }
        this._particleSystem.processor = this._useGPU ? new ParticleSystemRendererGPU(this) : new ParticleSystemRendererCPU(this);
        this._particleSystem.processor.onInit(this._particleSystem);
        this._particleSystem.processor.onEnable();
        this._particleSystem.bindModule();
    }
}
