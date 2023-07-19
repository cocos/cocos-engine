import { Texture2D } from '../../../asset/assets';
import { CCFloat } from '../../../core';
import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, help, menu, range, rangeMin, serializable, slide, tooltip, type } from '../../../core/data/decorators';
import { min } from '../../../core/math/bits';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.Dof')
@help('cc.Dof')
@menu('PostProcess/Dof')
@disallowMultiple
@executeInEditMode
export class Dof extends PostProcessSetting {
    @serializable
    protected _start = 0.0;
    @serializable
    protected _end = 0.0;
    @serializable
    protected _maxRadius = 0.0;

    @rangeMin(0)
    @type(CCFloat)
    set farStart (value: number) {
        this._start = value;
    }
    get farStart () {
        return this._start;
    }

    @rangeMin(0)
    @type(CCFloat)
    set farEnd (value: number) {
        this._end = value;
    }
    get farEnd () {
        return this._end;
    }

    @slide
    @range([0, 10, 0.01])
    @type(CCFloat)
    set maxRadius (value: number) {
        this._maxRadius = value;
    }
    get maxRadius () {
        return this._maxRadius;
    }
}
