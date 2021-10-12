/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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

import { ccclass, menu, property, disallowMultiple, type } from '../core/data/class-decorator'
import { Component } from '../core/components/component'
import { legacyCC } from '../core/global-exports';

import { Camera } from '../core/renderer/scene/camera';
import { Camera as CameraComponent, ClearFlag } from '../core/components/camera-component';
import { JsonAsset } from '../core'

import { EDITOR, BUILD } from 'internal:constants';

import { ARModuleHelper } from './ar-module-helper';

import { director, Director } from '../core/director';
import { Color, Vec3, Rect, Vec2, Mat4, Quat } from '../core/math';
import { Node } from '../core/scene-graph/node';
import { Layers } from '../core/scene-graph/layers';
import { ClearFlagBit } from '../core/gfx//base/define';

let _temp_vec3a = new Vec3();
let _temp_quat = new Quat();

// use this need add follows in project/native/engine/android/app/AndroidManifest.xml:
// <uses-permission android:name="android.permission.CAMERA"/>
// <uses-feature android:name="android.hardware.camera.ar" android:required="true"/>
// <meta-data android:name="com.google.ar.core" android:value="required" />
/**
 * @en AR session component
 * @zh AR session 组件
 */
@ccclass('cc.ARSession')
@menu("AR/ARSession")
@disallowMultiple
export class ARSession extends Component {
    
    //#region background and pose control
    // for 3d object
    @property({ type: CameraComponent })
    protected _targetCamera: CameraComponent | null = null;
    @property({ type: CameraComponent })
    get targetCamera () {
        return this._targetCamera;
    }
    set targetCamera (val) {
        this._targetCamera = val;
    }

    // for backGround
    protected _camera: Camera | null = null;

    //#endregion

    // features config
    featuresConfigs : JsonAsset | null = null;

    @property
    smooth = false;

    @property
    lerpPosition = true;
    initOrigin = new Vec3();
    initOrient = new Quat();

    targetOrigin = new Vec3();
    targetOrient = new Quat();
    private _matProj = new Mat4();

    private _curFrame = 0;
    skipFrame = 3;

    public onLoad() {
        if (BUILD) {
            const instance = ARModuleHelper.getInstance();

            instance.start();
            /*
            instance.update();

            const cameraPose = instance.getCameraPose();
            this.initOrigin.x = cameraPose[0], this.initOrigin.y = cameraPose[1], this.initOrigin.z = cameraPose[2];
            _temp_quat.x = cameraPose[3], _temp_quat.y = cameraPose[4], _temp_quat.z = cameraPose[5], _temp_quat.w = cameraPose[6];

            Quat.copy(this.initOrient, _temp_quat);
            console.log('init origin', JSON.stringify(this.initOrigin), 'init orient', this.initOrient);
            const fov = 2 * Math.atan(legacyCC.winSize.height * 0.5 / 200) * 180 / Math.PI;
            this._targetCamera!.fov = fov;
            */
        }
    }

    public __preload () {
        const cameraNode = new Node('ARCamera_' + this.node.name);
        // background currently use this layer, need modify to use camera event 
        cameraNode.layer = Layers.Enum.UI_3D;
        cameraNode.setPosition(0, 0, 0);

        if (!EDITOR) {
            this._camera = director.root!.createCamera();
            this._camera.initialize({
                name: 'ar_' + this.node.name,
                node: cameraNode,
                projection: CameraComponent.ProjectionType.ORTHO,
                priority: -1,
            });

            this._camera.fov = 45;
            this._camera.clearFlag = ClearFlag.SOLID_COLOR;
            this._camera.farClip = 2000;
            this._camera.viewport = new Rect(0, 0, 1, 1);

            const rs = this._getRenderScene();
            rs.addCamera(this._camera);
        }
    }

    public onEnable () {
        if(this._camera)
        {
            const rs = this._getRenderScene();
            rs.addCamera(this._camera);
        }
    }

    lateUpdate (dt: number) {
        
        if (!BUILD) return;
        if (this.lerpPosition) {
            if (!Vec3.equals(this._targetCamera!.node.worldPosition, this.targetOrigin)) {
                Vec3.lerp(_temp_vec3a, this._targetCamera!.node.worldPosition, this.targetOrigin, 0.33333333);
                this._targetCamera!.node.setWorldPosition(_temp_vec3a);
            }
        }
        if (this.smooth) {
            Quat.slerp(_temp_quat, this._targetCamera!.node.worldRotation, this.targetOrient, 0.5);
            this._targetCamera!.node.setWorldRotation(_temp_quat);
        }
        if (this._curFrame < this.skipFrame) {
            this._curFrame++;
            return;
        }
        this._curFrame = 0;
        const instance = ARModuleHelper.getInstance();

        instance.update();
        const pose = instance.getCameraPose();
        if (Math.abs(pose[0]) < 200 && Math.abs(pose[1]) < 200 && Math.abs(pose[2]) < 200) {
            this.targetOrigin.x = pose[0], this.targetOrigin.y = pose[1], this.targetOrigin.z = pose[2];
            this.targetOrient.x = pose[3], this.targetOrient.y = pose[4], this.targetOrient.z = pose[5], this.targetOrient.w = pose[6];
            if (!this.lerpPosition) {
                this._targetCamera!.node.setWorldPosition(this.targetOrigin);
            }
            if (!this.smooth) {
                this._targetCamera!.node.setWorldRotation(this.targetOrient);
            }
            const matArr = instance.getCameraProjectionMatrix();
            Mat4.fromArray(this._matProj, matArr);
            this._targetCamera!.camera.matProj = this._matProj;
        }
    }
}

legacyCC.ARSession = ARSession;