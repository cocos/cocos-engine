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

import { ccclass, rangeMin, serializable, type } from 'cc.decorator';
import { CCInteger, Vec3 } from '../../core';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { INITIAL_DIR, ParticleDataSet, POSITION } from '../particle-data-set';
import { UserDataSet } from '../user-data-set';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { ShapeModule } from './shape';

const dir = new Vec3();
const pos = new Vec3();

@ccclass('cc.GridShapeModule')
@VFXModule.register('GridShape', ModuleExecStageFlags.SPAWN, [INITIAL_DIR.name])
export class GridShape extends ShapeModule {
    @serializable
    public length = 1;
    @serializable
    public width = 1;
    @serializable
    public height = 1;

    @type(CCInteger)
    @rangeMin(1)
    @serializable
    public numInX = 1;

    @type(CCInteger)
    @rangeMin(1)
    @serializable
    public numInY = 1;

    @type(CCInteger)
    @rangeMin(1)
    @serializable
    public numInZ = 1;

    private _xyCellNum = 0;
    private _lengthPerCell = 0;
    private _widthPerCell = 0;
    private _heightPerCell = 0;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.tick(particles, emitter, user, context);
        this._xyCellNum = this.numInX * this.numInY;
        this._lengthPerCell = this.length / this.numInX;
        this._widthPerCell = this.width / this.numInY;
        this._heightPerCell = this.height / this.numInZ;
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { fromIndex, toIndex } = context;
        const xyCellNum = this._xyCellNum;
        const numInX = this.numInX;
        const numInZ = this.numInZ;
        const lengthPerCell = this._lengthPerCell;
        const widthPerCell = this._widthPerCell;
        const heightPerCell = this._heightPerCell;
        const initialDir = particles.getVec3Parameter(INITIAL_DIR);
        const position = particles.getVec3Parameter(POSITION);
        Vec3.set(dir, 0, 0, 1);
        for (let i = fromIndex, index = 0; i < toIndex; i++, index++) {
            const zIndex = Math.floor(index / xyCellNum) % numInZ;
            const cellIndex = index % xyCellNum;
            const xIndex =  cellIndex % numInX;
            const yIndex = Math.floor(cellIndex / numInX);
            const x = (xIndex + 0.5) * lengthPerCell;
            const y = (yIndex + 0.5) * widthPerCell;
            const z = (zIndex + 0.5) * heightPerCell;
            Vec3.set(pos, x, y, z);
            this.storePositionAndDirection(i, dir, pos, initialDir, position);
        }
    }
}
