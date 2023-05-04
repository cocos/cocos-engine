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
import { ccclass } from 'cc.decorator';
import { ShapeModule } from './shape';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { INITIAL_DIR, POSITION, ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { Vec3 } from '../../core';

const dir = new Vec3();
const pos = new Vec3();
@ccclass('cc.RectangleShapeModule')
@VFXModule.register('RectangleShape', ModuleExecStageFlags.SPAWN, [INITIAL_DIR.name])
export class RectangleShapeModule extends ShapeModule {
    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const position = particles.getVec3Parameter(POSITION);
        const initialDir = particles.getVec3Parameter(INITIAL_DIR);
        const rand = this.randomStream;
        for (let i = fromIndex; i < toIndex; i++) {
            Vec3.set(dir, 0, 0, 1);
            Vec3.set(pos, rand.getFloatFromRange(-0.5, 0.5), rand.getFloatFromRange(-0.5, 0.5), 0);
            this.storePositionAndDirection(i, dir, pos, initialDir, position);
        }
    }
}
