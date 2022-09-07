/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
import { Camera } from './components/camera-component';
import { Director, director } from './director';
import { Vec3 } from './math';
import { ReflectionProbe } from './renderer/scene/reflectionProbe';

export class ReflectionProbeManager {
    public static probeManager: ReflectionProbeManager | null = null;
    private _probes: ReflectionProbe[] = [];
    public addProbe (camera: Camera, pos?: Vec3) {
        const probe = new ReflectionProbe();

        probe.startCapture(camera, (data:any, width:any, height:any) => {
            const path = 'D:/cocosProject/cocos-task/TestProject/assets/renderTexture/';
            const fileName = 'testRendercc.png';
            const fullpath = path + fileName;
            EditorExtends.Asset.saveDataToImage(data, width, height, fullpath, (params:any) => {
            });
        });
        this._probes.push(probe);
    }
    //eslint-disable-next-line @typescript-eslint/ban-types
    async waitForNextFrame (callback:Function) {
        return new Promise<void>((resolve, reject) => {
            director.once(Director.EVENT_END_FRAME, () => {
                resolve();
                callback();
                console.log('end capture ==============');
            });
        });
    }
}

ReflectionProbeManager.probeManager = new ReflectionProbeManager();
